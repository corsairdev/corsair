import type { GitHubSchemaOverride } from '../plugins/github/schema';
import type { GmailSchemaOverride } from '../plugins/gmail/schema';
import type { LinearSchemaOverride } from '../plugins/linear/schema';
import type { SlackSchemaOverride } from '../plugins/slack/schema';
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

/**
 * Plugin configuration for Slack
 */
export type SlackPluginConfig = {
	name: 'slack';
	token: string;
	channels?: Record<string, string>;
	members?: Record<string, string>;
	schema?: SlackSchemaOverride;
};

/**
 * Plugin configuration for Gmail
 */
export type GmailPluginConfig = {
	name: 'gmail';
	accessToken: string;
	refreshToken?: string;
	userId?: string;
	schema?: GmailSchemaOverride;
};

/**
 * Plugin configuration for Linear
 */
export type LinearPluginConfig = {
	name: 'linear';
	apiKey: string;
	teamId?: string;
	schema?: LinearSchemaOverride;
};

/**
 * Plugin configuration for GitHub
 */
export type GitHubPluginConfig = {
	name: 'github';
	token: string;
	schema?: GitHubSchemaOverride;
};

/**
 * Union of all plugin config types
 */
export type PluginConfig =
	| SlackPluginConfig
	| GmailPluginConfig
	| LinearPluginConfig
	| GitHubPluginConfig;

/**
 * Base configuration for Corsair
 */
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
	 * Now supports array format with schema overrides
	 */
	plugins?: PluginConfig[];
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
