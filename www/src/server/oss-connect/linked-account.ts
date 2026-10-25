import { and, eq, ne } from 'drizzle-orm';

import type { DB } from '@/db';
import { account, user } from '@/db/auth-schema';

/**
 * Accounts a contributor can connect on their OSS profile. Connecting links to the
 * signed-in corsair.dev account; it never creates one.
 */
export const CONNECT_PROVIDERS = ['github', 'discord'] as const;
export type ConnectProvider = (typeof CONNECT_PROVIDERS)[number];

const ENV_PREFIX: Record<ConnectProvider, string> = {
	github: 'GITHUB',
	discord: 'DISCORD',
};

export function connectProviderCredentials(
	provider: ConnectProvider,
	env: Record<string, string | undefined> = process.env,
) {
	const clientId = env[`${ENV_PREFIX[provider]}_CLIENT_ID`];
	const clientSecret = env[`${ENV_PREFIX[provider]}_CLIENT_SECRET`];
	return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export function enabledConnectProviders(
	env: Record<string, string | undefined> = process.env,
): ConnectProvider[] {
	return CONNECT_PROVIDERS.filter((provider) =>
		connectProviderCredentials(provider, env),
	);
}

export function isConnectProvider(value: string): value is ConnectProvider {
	return (CONNECT_PROVIDERS as readonly string[]).includes(value);
}

type FetchLike = (url: string, init?: RequestInit) => Promise<Response>;

const IDENTITY_URL: Record<ConnectProvider, string> = {
	github: 'https://api.github.com/user',
	discord: 'https://discord.com/api/v10/users/@me',
};

/** The provider's account id and lowercased username for an access token, or null. */
export async function fetchLinkedIdentity(
	provider: ConnectProvider,
	accessToken: string,
	fetchImpl: FetchLike = fetch,
): Promise<{ id: string; username: string } | null> {
	const response = await fetchImpl(IDENTITY_URL[provider], {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json',
			// GitHub rejects API calls without a User-Agent.
			'User-Agent': 'corsair-oss',
		},
	});
	if (!response.ok) return null;
	const body = (await response.json()) as {
		id?: number | string;
		login?: string;
		username?: string;
	};
	const username = provider === 'github' ? body.login : body.username;
	if (body.id == null || !username) return null;
	return { id: String(body.id), username: username.toLowerCase() };
}

type LinkedAccount = {
	userId: string;
	providerId: string;
	accountId: string;
	accessToken?: string | null;
};

/**
 * Copies a connected account's verified name onto the OSS profile: the GitHub login
 * becomes github_username, the Discord username becomes discord_username.
 */
export async function syncLinkedAccount(
	db: DB,
	linked: LinkedAccount,
	fetchImpl: FetchLike = fetch,
) {
	if (!isConnectProvider(linked.providerId) || !linked.accessToken) return;
	const provider = linked.providerId;
	const identity = await fetchLinkedIdentity(
		provider,
		linked.accessToken,
		fetchImpl,
	);
	// The token has to belong to the account that was just linked.
	if (!identity || identity.id !== linked.accountId) {
		console.warn('[oss-connect] could not read the linked account', {
			provider,
			userId: linked.userId,
		});
		return;
	}

	if (provider === 'discord') {
		await db
			.update(user)
			.set({ discordUsername: identity.username })
			.where(eq(user.id, linked.userId));
		return;
	}

	await db.transaction(async (tx) => {
		const [holder] = await tx
			.select({ id: user.id })
			.from(user)
			.where(
				and(
					eq(user.githubUsername, identity.username),
					ne(user.id, linked.userId),
				),
			)
			.limit(1);
		if (holder) {
			const [verified] = await tx
				.select({ id: account.id })
				.from(account)
				.where(
					and(eq(account.userId, holder.id), eq(account.providerId, 'github')),
				)
				.limit(1);
			if (verified) {
				console.warn(
					'[oss-connect] GitHub login already belongs to another connected profile',
					{ userId: linked.userId, holderId: holder.id },
				);
				return;
			}
			// Someone typed this login without proving it; the verified owner takes it.
			await tx
				.update(user)
				.set({ githubUsername: null })
				.where(eq(user.id, holder.id));
		}
		await tx
			.update(user)
			.set({ githubUsername: identity.username })
			.where(eq(user.id, linked.userId));
	});
}
