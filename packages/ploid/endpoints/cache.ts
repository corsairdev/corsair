import type { CorsairDatabase } from 'corsair/db';
import { sql } from 'corsair/db';
import { PloidSchema } from '../schema';
import type { ContactField } from '../schema/database';
import { Person } from '../schema/database';

// The entity client replaces the whole JSON document and has no conditional
// update, so the save talks to the reserved connection directly.
export type PersonCacheContext = {
	$getAccountId: () => Promise<string>;
	database?: Pick<CorsairDatabase, 'db' | 'isPg'>;
};

// Partial identity facts about one person. Every field is optional except the
// person_id key; undefined means "this response said nothing about it".
export type PersonPatch = {
	providerId: string;
	name?: string | null;
	headline?: string | null;
	company?: string | null;
	location?: string | null;
	linkedinUrl?: string | null;
	profileUrl?: string | null;
	githubUrl?: string | null;
	xUrl?: string | null;
	identityVerified?: boolean;
	confidence?: number | null;
	summary?: string | null;
	workEmail?: ContactField;
	personalEmail?: ContactField;
	phone?: ContactField;
	sources?: string[];
};

const PERSON_ENTITY = 'people';
const PERSON_VERSION = PloidSchema.version;

// A stuck compare-and-set must give up. The caller already has the API
// response; the warning path logs the miss.
const MAX_SAVE_ATTEMPTS = 8;

type SqlConn = CorsairDatabase['db'];

function mergeField<T>(
	current: T | undefined,
	incoming: T | undefined,
): T | undefined {
	if (incoming === undefined) return current;
	return incoming;
}

function contactIsFound(field: ContactField | undefined): boolean {
	return (
		field !== undefined &&
		field.status === 'found' &&
		field.value !== null &&
		field.value !== ''
	);
}

// A sibling write that never saw this field, or that only learned it was
// empty, must not erase a value that is already stored.
function mergeContact(
	current: ContactField | undefined,
	incoming: ContactField | undefined,
): ContactField | undefined {
	if (incoming === undefined) return current;
	if (!contactIsFound(incoming) && contactIsFound(current)) return current;
	return incoming;
}

function mergePerson(current: Person | undefined, patch: PersonPatch): Person {
	const data: Person = {
		...(current ?? {}),
		personId: patch.providerId,
		updatedAt: new Date(),
	};
	data.name = mergeField(data.name, patch.name);
	data.headline = mergeField(data.headline, patch.headline);
	data.company = mergeField(data.company, patch.company);
	data.location = mergeField(data.location, patch.location);
	data.linkedinUrl = mergeField(data.linkedinUrl, patch.linkedinUrl);
	data.profileUrl = mergeField(data.profileUrl, patch.profileUrl);
	data.githubUrl = mergeField(data.githubUrl, patch.githubUrl);
	data.xUrl = mergeField(data.xUrl, patch.xUrl);
	data.identityVerified = mergeField(
		data.identityVerified,
		patch.identityVerified,
	);
	data.confidence = mergeField(data.confidence, patch.confidence);
	data.summary = mergeField(data.summary, patch.summary);
	data.workEmail = mergeContact(data.workEmail, patch.workEmail);
	data.personalEmail = mergeContact(data.personalEmail, patch.personalEmail);
	data.phone = mergeContact(data.phone, patch.phone);
	if (patch.sources !== undefined && patch.sources.length > 0) {
		// Union, not concat: re-resolving the same person must not grow
		// the row with duplicate URLs.
		data.sources = [...new Set([...(data.sources ?? []), ...patch.sources])];
	}
	return data;
}

// Logical names. The Kysely table plugin maps dbTables overrides, including
// hyphenated names, and the dialect quotes them. Checking the physical name
// here rejects configurations Corsair already accepts.
const ENTITIES_TABLE = 'corsair_entities';
const ACCOUNTS_TABLE = 'corsair_accounts';

function usesPostgres(database: Pick<CorsairDatabase, 'isPg'>): boolean {
	// CorsairDatabase.isPg is false only for better-sqlite3. Omitting it
	// means Postgres, matching createCorsairDatabase.
	return database.isPg !== false;
}

function affectedRows(result: { numAffectedRows?: bigint }): bigint {
	return result.numAffectedRows ?? 0n;
}

// sqlite stores the JSON document as text. Postgres returns the jsonb value
// already decoded. Both have to become the person schema before the merge.
function parseStoredPerson(value: unknown): Person {
	return Person.parse(decodeStored(value));
}

// unknown: sqlite returns JSON text and postgres returns a decoded object.
function decodeStored(value: unknown): unknown {
	if (typeof value !== 'string') return value;
	// JSON.parse is typed as any. The person schema checks the decoded value.
	return JSON.parse(value) as unknown;
}

function dataExpression(postgres: boolean, payload: string) {
	// postgres: bind the JSON text and cast it, so the jsonb column stores
	// an object rather than a quoted string.
	return postgres ? sql`${payload}::jsonb` : sql`${payload}`;
}

async function rollback(conn: SqlConn): Promise<void> {
	try {
		await sql`ROLLBACK`.execute(conn);
	} catch {
		// BEGIN may have failed before a transaction existed.
	}
}

async function insertIfAbsent(
	conn: SqlConn,
	accountId: string,
	entityId: string,
	payload: string,
	postgres: boolean,
	now: Date,
): Promise<bigint> {
	const id = crypto.randomUUID();
	const data = dataExpression(postgres, payload);
	// WHERE NOT EXISTS, not an upsert: a replacing upsert would clobber a
	// row a sibling inserted after this attempt saw an empty read.
	const inserted = await sql`
		INSERT INTO ${sql.table(ENTITIES_TABLE)} (
			id, created_at, updated_at, account_id, entity_id, entity_type, version, data
		)
		SELECT ${id}, ${now}, ${now}, ${accountId}, ${entityId}, ${PERSON_ENTITY}, ${PERSON_VERSION}, ${data}
		WHERE NOT EXISTS (
			SELECT 1 FROM ${sql.table(ENTITIES_TABLE)}
			WHERE account_id = ${accountId}
				AND entity_type = ${PERSON_ENTITY}
				AND entity_id = ${entityId}
		)
	`.execute(conn);
	return affectedRows(inserted);
}

async function updateIfMatch(
	conn: SqlConn,
	accountId: string,
	entityId: string,
	// unknown: SQLite returns the ISO text; Postgres may return a Date.
	rawUpdatedAt: unknown,
	payload: string,
	postgres: boolean,
	now: Date,
): Promise<bigint> {
	const data = dataExpression(postgres, payload);
	// rawUpdatedAt is the value just read. On SQLite that is the ISO text
	// the driver returned; calling getTime() on it would never match.
	const updated = await sql`
		UPDATE ${sql.table(ENTITIES_TABLE)}
		SET version = ${PERSON_VERSION},
			data = ${data},
			updated_at = ${now}
		WHERE account_id = ${accountId}
			AND entity_type = ${PERSON_ENTITY}
			AND entity_id = ${entityId}
			AND updated_at = ${rawUpdatedAt}
	`.execute(conn);
	return affectedRows(updated);
}

async function commitOnce(
	database: Pick<CorsairDatabase, 'db' | 'isPg' | 'tableNames'>,
	accountId: string,
	patch: PersonPatch,
): Promise<bigint> {
	const postgres = usesPostgres(database);
	return database.db.connection().execute(async (conn) => {
		// One BEGIN for the whole read and write. A second BEGIN (including
		// Kysely's transaction helper, which emits its own) nests and fails.
		if (postgres) {
			await sql`BEGIN`.execute(conn);
		} else {
			await sql`BEGIN IMMEDIATE`.execute(conn);
		}
		try {
			if (postgres) {
				// Lock the account row so two processes cannot both decide
				// the person is missing and insert over each other.
				await sql`
					SELECT id FROM ${sql.table(ACCOUNTS_TABLE)}
					WHERE id = ${accountId}
					FOR UPDATE
				`.execute(conn);
			}
			// Read on this reserved connection. A read through the shared
			// client waits on the SQLite mutex this callback already holds.
			const read = await sql<{ data: unknown; updated_at: unknown }>`
				SELECT data, updated_at
				FROM ${sql.table(ENTITIES_TABLE)}
				WHERE account_id = ${accountId}
					AND entity_type = ${PERSON_ENTITY}
					AND entity_id = ${patch.providerId}
			`.execute(conn);
			const row = read.rows[0];
			const current = row ? parseStoredPerson(row.data) : undefined;
			const merged = mergePerson(current, patch);
			const payload = JSON.stringify(merged);
			const now = new Date();
			const changed = row
				? await updateIfMatch(
						conn,
						accountId,
						patch.providerId,
						row.updated_at,
						payload,
						postgres,
						now,
					)
				: await insertIfAbsent(
						conn,
						accountId,
						patch.providerId,
						payload,
						postgres,
						now,
					);
			await sql`COMMIT`.execute(conn);
			return changed;
		} catch (error) {
			await rollback(conn);
			throw error;
		}
	});
}

async function writePerson(
	ctx: PersonCacheContext,
	accountId: string,
	patch: PersonPatch,
): Promise<void> {
	try {
		const database = ctx.database;
		if (database?.db === undefined) {
			throw new Error('Database not configured');
		}
		for (let attempt = 0; attempt < MAX_SAVE_ATTEMPTS; attempt++) {
			const changed = await commitOnce(database, accountId, patch);
			// Zero rows means a sibling committed first. The next attempt
			// reads that row and merges, so its fields are kept.
			if (changed > 0n) return;
		}
		throw new Error(
			`person ${patch.providerId} kept changing under a concurrent save`,
		);
	} catch (error) {
		// A failed cache write must not fail the endpoint: the caller already
		// paid ACU for the response. Swallowing here also keeps a rejected
		// link from poisoning the queued saves behind it.
		console.warn(`[ploid] Failed to cache person ${patch.providerId}:`, error);
	}
}

// Saves for one account and person run one at a time in this process. The
// chain is not a lock across processes; commitOnce's compare-and-set is.
const saveChains = new Map<string, Promise<void>>();

export async function rememberPerson(
	ctx: PersonCacheContext,
	patch: PersonPatch,
): Promise<void> {
	// The account lookup is itself a database call and throws when no
	// database is configured. It must stay guarded: optional storage can
	// never fail an API response that already succeeded (and was billed).
	let accountId: string;
	try {
		accountId = await ctx.$getAccountId();
	} catch (error) {
		console.warn(
			`[ploid] Skipping person cache for ${patch.providerId} (no database):`,
			error,
		);
		return;
	}
	const chainKey = `${accountId}:${patch.providerId}`;
	const previous = saveChains.get(chainKey) ?? Promise.resolve();
	const next = previous
		.catch(() => {})
		.then(() => writePerson(ctx, accountId, patch));
	saveChains.set(chainKey, next);
	// Drop the tail entry once it settles so the map does not grow unbounded.
	void next.finally(() => {
		if (saveChains.get(chainKey) === next) {
			saveChains.delete(chainKey);
		}
	});
	return next;
}
