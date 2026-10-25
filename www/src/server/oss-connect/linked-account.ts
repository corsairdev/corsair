import { and, eq, ne } from 'drizzle-orm';

import type { DB } from '@/db';
import { user } from '@/db/auth-schema';

/**
 * Accounts a contributor can connect on their OSS profile. Connecting links to the
 * signed-in corsair.dev account; it never creates one.
 */
export const CONNECT_PROVIDERS = ['github', 'discord'] as const;
export type ConnectProvider = (typeof CONNECT_PROVIDERS)[number];

/** The only environment variables the connect providers read. */
type ConnectEnv = {
	GITHUB_CLIENT_ID?: string;
	GITHUB_CLIENT_SECRET?: string;
	DISCORD_CLIENT_ID?: string;
	DISCORD_CLIENT_SECRET?: string;
};

function readConnectEnv(): ConnectEnv {
	return {
		GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
		GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
		DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
		DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
	};
}

const CREDENTIAL_KEYS = {
	github: ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET'],
	discord: ['DISCORD_CLIENT_ID', 'DISCORD_CLIENT_SECRET'],
} as const satisfies Record<
	ConnectProvider,
	readonly [keyof ConnectEnv, keyof ConnectEnv]
>;

export function connectProviderCredentials(
	provider: ConnectProvider,
	env: ConnectEnv = readConnectEnv(),
) {
	const [idKey, secretKey] = CREDENTIAL_KEYS[provider];
	const clientId = env[idKey];
	const clientSecret = env[secretKey];
	return clientId && clientSecret ? { clientId, clientSecret } : null;
}

export function enabledConnectProviders(
	env: ConnectEnv = readConnectEnv(),
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
		// Runs inside the OAuth callback; a stalled API must not hold the redirect.
		// A failed copy is retried by connecting again.
		signal: AbortSignal.timeout(5000),
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
			// GitHub just confirmed this login belongs to the account being linked, so
			// whoever else holds the name (typed, or kept after a rename) gives it up.
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
