import type { EndpointRiskLevel } from 'corsair/core';

export type PrismaMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// operations that do not hit the REST Management API (they connect
// directly to a Postgres instance over the wire protocol) carry a kind that
// routes them to dedicated handlers instead of the generic factory
export type PrismaOperationKind = 'sql' | 'schema';

export type PrismaOperation = {
	key: string;
	group: string;
	name: string;
	method: PrismaMethod;
	path: string;
	description: string;
	pathParams?: readonly string[];
	riskLevel: EndpointRiskLevel;
	irreversible?: boolean;
	kind?: PrismaOperationKind;
};
