import type { SlackPlugin } from '../plugins/types';
import type { DrizzlePostgresConfig } from './drizzle-postgres';
import type { PrismaPostgresConfig } from './prisma-postgres';

export type { DrizzlePostgresConfig } from './drizzle-postgres';
export type { PrismaPostgresConfig } from './prisma-postgres';

export type ExtractStrict<T, U extends T> = U;

export type ORMs = 'drizzle' | 'prisma';

export type DBTypes = 'postgres';

export type Framework = 'nextjs';

export type ColumnInfo = {
	type: string;
};

export type TableSchema = Record<string, ColumnInfo>;

export type SchemaOutput = Record<string, TableSchema>;

export type ConnectionConfig =
	| string
	| {
			host: string;
			port?: number;
			username: string;
			password: string;
			database: string;
			ssl?: boolean;
	  };

type BasePlugin = Record<'slack', SlackPlugin>;

export type BaseConfig = {
	/**
	 * The API endpoint to use for the Corsair client. Defaults to `/api/corsair`.
	 */
	apiEndpoint: string;
	/**
	 * The path to the Corsair folder. Defaults to `./corsair`.
	 */
	pathToCorsairFolder: string;
	/**
	 * Any plugins for Corsair to use
	 */
	plugins?: BasePlugin;
};

/**
 * Base Corsair config setup. Currently only compatible with Next.js + Drizzle + Postgres
 */
export type CorsairConfig<T> = BaseConfig &
	(DrizzlePostgresConfig<T> | PrismaPostgresConfig<T>);

export const DefaultBaseConfig: BaseConfig = {
	apiEndpoint: 'api/corsair',
	pathToCorsairFolder: './corsair',
};
