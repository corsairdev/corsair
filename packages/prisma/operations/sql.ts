import type { PrismaOperation } from '../endpoints/operation-types';

export const sqlOperations = [
	{
		key: 'queryDatabase',
		group: 'sql',
		name: 'query',
		method: 'POST',
		path: '/sql/query',
		pathParams: [],
		riskLevel: 'read',
		kind: 'sql',
		description:
			'Execute a read-only SQL query (SELECT) over the Postgres connection',
	},
	{
		key: 'executeDatabaseCommand',
		group: 'sql',
		name: 'execute',
		method: 'POST',
		path: '/sql/execute',
		pathParams: [],
		riskLevel: 'destructive',
		irreversible: true,
		kind: 'sql',
		description:
			'Execute a SQL command (INSERT/UPDATE/DELETE/DDL) over the Postgres connection',
	},
] as const satisfies readonly PrismaOperation[];
