import { makeFreshBooksRequest } from './client';

/**
 * FreshBooks runs one public API host. A call signs in with the OAuth access
 * token as a bearer token. Routes are scoped by one of three ids, all listed
 * on the identity (`users.me` → business_memberships[].business): the
 * accounting `account_id` (like LJArJ4), the numeric business `id` and the
 * `business_uuid` (ledger and newer report routes).
 */
export const FRESHBOOKS_API_BASE = 'https://api.freshbooks.com';
export const FRESHBOOKS_OAUTH_AUTH_URL =
	'https://auth.freshbooks.com/oauth/authorize';
export const FRESHBOOKS_OAUTH_TOKEN_URL =
	'https://api.freshbooks.com/auth/oauth/token';

/**
 * Every scope the operations use (freshbooks.com/api/scopes). The FreshBooks
 * app must have the same scopes ticked, or the sign-in is refused.
 */
export const freshbooksOAuthScopes = [
	'user:profile:read',
	'user:account:read',
	'user:business:read',
	'user:teams:read',
	'user:clients:read',
	'user:clients:write',
	'user:credit_notes:read',
	'user:invoices:read',
	'user:invoices:write',
	'user:estimates:read',
	'user:estimates:write',
	'user:payments:read',
	'user:payments:write',
	'user:online_payments:read',
	'user:online_payments:write',
	'user:other_income:read',
	'user:other_income:write',
	'user:taxes:read',
	'user:taxes:write',
	'user:expenses:read',
	'user:expenses:write',
	'user:bills:read',
	'user:bills:write',
	'user:bill_vendors:read',
	'user:bill_vendors:write',
	'user:bill_payments:read',
	'user:bill_payments:write',
	'user:billable_items:read',
	'user:billable_items:write',
	'user:projects:read',
	'user:projects:write',
	'user:time_entries:read',
	'user:time_entries:write',
	'user:journal_entries:read',
	'user:journal_entries:write',
	'user:reports:read',
	'user:uploads:read',
	'user:uploads:write',
] as const;

export type FreshBooksAuthOptions = {
	/**
	 * The accounting account id (like LJArJ4) the accounting operations use
	 * when a call leaves `accountId` out. Left out here too, the plugin reads
	 * it from users.me when the identity belongs to one business.
	 */
	accountId?: string;
	/** The numeric business id, the same way (projects, time tracking, team). */
	businessId?: string;
	/** The business uuid, the same way (ledger accounts, journal entries, ledger reports). */
	businessUuid?: string;
};

// No stored values beyond the OAuth tokens core keeps.
export type FreshBooksStoredKeys = object;

export type FreshBooksTarget = {
	base: string;
	headers: Record<string, string>;
	query: Record<string, string>;
	secrets: string[];
};

/** Where a call goes and how it signs in. */
export async function resolveFreshBooksTarget(
	ctx: { key: string },
	_host?: string,
): Promise<FreshBooksTarget> {
	return {
		base: FRESHBOOKS_API_BASE,
		headers: { Authorization: `Bearer ${ctx.key}` },
		query: {},
		secrets: [],
	};
}

type IdName = 'accountId' | 'businessId' | 'businessUuid';

/** Where each id sits on a users.me business. */
const ID_FIELD: Record<IdName, string> = {
	accountId: 'account_id',
	businessId: 'id',
	businessUuid: 'business_uuid',
};

const MAX_CACHED_IDENTITIES = 50;
// `unknown` because each business is untrusted JSON until an id is read from it.
const identities = new Map<string, Promise<Array<Record<string, unknown>>>>();

/** The businesses the token's identity belongs to, read once per token. */
async function businessesFor(ctx: {
	key: string;
	options: FreshBooksAuthOptions;
}): Promise<Array<Record<string, unknown>>> {
	let pending = identities.get(ctx.key);
	if (!pending) {
		pending = (async () => {
			const answer = await makeFreshBooksRequest(ctx, {
				method: 'GET',
				path: '/auth/api/v1/users/me',
			});
			const response =
				typeof answer === 'object' && answer !== null
					? (answer as Record<string, unknown>).response
					: undefined;
			const memberships =
				typeof response === 'object' && response !== null
					? (response as Record<string, unknown>).business_memberships
					: undefined;
			if (!Array.isArray(memberships)) return [];
			return memberships.flatMap((membership) => {
				const business =
					typeof membership === 'object' && membership !== null
						? (membership as Record<string, unknown>).business
						: undefined;
				return typeof business === 'object' && business !== null
					? [business as Record<string, unknown>]
					: [];
			});
		})();
		// A failed lookup is not kept: the next call asks again.
		pending.catch(() => identities.delete(ctx.key));
		if (identities.size >= MAX_CACHED_IDENTITIES) {
			const oldest = identities.keys().next().value;
			if (oldest !== undefined) identities.delete(oldest);
		}
		identities.set(ctx.key, pending);
	}
	return pending;
}

/** Forgets cached identities (tests). */
export function clearFreshBooksIdentityCache(): void {
	identities.clear();
}

/**
 * The value of an id the caller left out: the plugin option, else the one
 * business on users.me. An identity in several businesses has to say which.
 */
export async function freshbooksPathDefault(
	ctx: { key: string; options: FreshBooksAuthOptions },
	name: string,
): Promise<string> {
	const id = name as IdName;
	const fromOptions = ctx.options?.[id];
	if (fromOptions !== undefined && String(fromOptions).trim() !== '') {
		return String(fromOptions).trim();
	}
	const field = ID_FIELD[id];
	if (!field) throw new Error(`[freshbooks] ${name} is required`);
	const values = [
		...new Set(
			(await businessesFor(ctx))
				.map((business) => business[field])
				.filter(
					(value): value is string | number =>
						typeof value === 'string' || typeof value === 'number',
				)
				.map(String),
		),
	];
	if (values.length === 1) return values[0] as string;
	if (values.length === 0) {
		throw new Error(
			`[freshbooks] ${name} is required: users.me lists no business with a ${field}`,
		);
	}
	throw new Error(
		`[freshbooks] ${name} is required: this FreshBooks login belongs to ${values.length} businesses (see users.me business_memberships); pass ${name} or set the ${name} plugin option`,
	);
}
