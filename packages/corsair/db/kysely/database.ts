import { Kysely, PostgresDialect } from 'kysely';
import type { Pool } from 'pg';
import type {
	CorsairAccount,
	CorsairEntity,
	CorsairEvent,
	CorsairIntegration,
} from '../index';

export type CorsairKyselyDatabase = {
	corsair_integrations: CorsairIntegration;
	corsair_accounts: CorsairAccount;
	corsair_entities: CorsairEntity;
	corsair_events: CorsairEvent;
};

export type CorsairDatabase = {
	db: Kysely<CorsairKyselyDatabase>;
};

export type CorsairDatabaseInput = Pool | Kysely<CorsairKyselyDatabase>;

function isPgPool(input: CorsairDatabaseInput): input is Pool {
	return typeof (input as Pool).query === 'function';
}

function isKysely(
	input: CorsairDatabaseInput,
): input is Kysely<CorsairKyselyDatabase> {
	return (
		typeof (input as Kysely<CorsairKyselyDatabase>).selectFrom === 'function'
	);
}

export function createCorsairDatabase(
	input: CorsairDatabaseInput,
): CorsairDatabase {
	if (isKysely(input)) {
		return { db: input };
	}

	if (!isPgPool(input)) {
		throw new Error(
			'Unsupported database input. Expected a pg Pool or a Kysely instance.',
		);
	}

	const db = new Kysely<CorsairKyselyDatabase>({
		dialect: new PostgresDialect({ pool: input }),
	});

	return { db };
}
