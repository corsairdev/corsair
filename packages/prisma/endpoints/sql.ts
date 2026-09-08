import { logEventFromContext } from 'corsair/core';
import type { PrismaContext } from '../index';
import { executePostgresQuery, inspectPostgresSchema } from '../pg-client';
import type { PrismaEndpoint } from './factory';
import { safeLogPostgresInput } from './sql-helpers';
import type { PrismaEndpointInput } from './types';

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
	const result = await executePostgresQuery(
		postgresInput(input),
		sqlCommand(input),
		sqlParams(input),
		'read',
	);

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.sql.query',
			safeLogPostgresInput(input),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log sql.query:', error);
	}
	return result;
};

export const executeDatabaseCommand: PrismaEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await executePostgresQuery(
		postgresInput(input),
		sqlCommand(input),
		sqlParams(input),
		'write',
	);

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.sql.execute',
			safeLogPostgresInput(input),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log sql.execute:', error);
	}
	return result;
};

export const inspectDatabaseSchema: PrismaEndpoint = async (
	ctx,
	input = {},
) => {
	const result = await inspectPostgresSchema(postgresInput(input));

	try {
		await logEventFromContext(
			ctx as PrismaContext,
			'prisma.databases.inspectSchema',
			safeLogPostgresInput(input),
			'completed',
		);
	} catch (error) {
		console.warn('[prisma] failed to log databases.inspectSchema:', error);
	}
	return result;
};

export const SqlEndpoints = {
	query: queryDatabase,
	execute: executeDatabaseCommand,
} as const;
