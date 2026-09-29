import { logEventFromContext } from 'corsair/core';
import type { PrismaContext } from '../index';
import { executePostgresQuery, inspectPostgresSchema } from '../pg-client';
import type { PrismaEndpoint } from './factory';
import { safeLogPostgresInput } from './sql-helpers';
import type { PrismaEndpointInput } from './types';
import {
	ExecuteDatabaseCommandInputSchema,
	InspectDatabaseSchemaInputSchema,
	InspectDatabaseSchemaOutputSchema,
	PostgresQueryResultSchema,
	QueryDatabaseInputSchema,
} from './types';

type PostgresInput = {
	host: string;
	port?: number;
	user: string;
	password: string;
	database: string;
	sslRejectUnauthorized?: boolean;
};

// The generic endpoint input is a permissive record; narrow the direct
// postgres hand-written schemas when reading their connection fields.
function postgresInput(input: PrismaEndpointInput): PostgresInput {
	return {
		host: String(input.host),
		port: input.port !== undefined ? Number(input.port) : undefined,
		user: String(input.user),
		password: String(input.password),
		database: String(input.database),
		sslRejectUnauthorized:
			input.sslRejectUnauthorized !== undefined
				? Boolean(input.sslRejectUnauthorized)
				: undefined,
	};
}

function sqlCommand(input: PrismaEndpointInput): string {
	return String(input.sql);
}

function sqlParams(input: PrismaEndpointInput): unknown[] {
	return Array.isArray(input.params) ? (input.params as unknown[]) : [];
}

export const queryDatabase: PrismaEndpoint = async (ctx, input = {}) => {
	const parsed = QueryDatabaseInputSchema.parse(input);
	const result = await executePostgresQuery(
		postgresInput(parsed),
		sqlCommand(parsed),
		sqlParams(parsed),
		'read',
	);
	const validatedResult = PostgresQueryResultSchema.parse(result);

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.sql.query',
			safeLogPostgresInput(parsed),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log sql.query:', error);
	}
	return validatedResult;
};

export const executeDatabaseCommand: PrismaEndpoint = async (
	ctx,
	input = {},
) => {
	const parsed = ExecuteDatabaseCommandInputSchema.parse(input);
	const result = await executePostgresQuery(
		postgresInput(parsed),
		sqlCommand(parsed),
		sqlParams(parsed),
		'write',
	);
	const validatedResult = PostgresQueryResultSchema.parse(result);

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.sql.execute',
			safeLogPostgresInput(parsed),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log sql.execute:', error);
	}
	return validatedResult;
};

export const inspectDatabaseSchema: PrismaEndpoint = async (
	ctx,
	input = {},
) => {
	const parsed = InspectDatabaseSchemaInputSchema.parse(input);
	const result = await inspectPostgresSchema(postgresInput(parsed));
	const validatedResult = InspectDatabaseSchemaOutputSchema.parse(result);

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.databases.inspectSchema',
			safeLogPostgresInput(parsed),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log databases.inspectSchema:', error);
	}
	return validatedResult;
};

export const SqlEndpoints = {
	query: queryDatabase,
	execute: executeDatabaseCommand,
} as const;
