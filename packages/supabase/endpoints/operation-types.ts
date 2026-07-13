import type { EndpointRiskLevel } from 'corsair/core';

export type SupabaseMethod =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS';

export type SupabaseOperationKind =
	| 'management'
	| 'project'
	| 'oauthAuthorizeUrl'
	| 'listTables'
	| 'getTableSchemas'
	| 'selectFromTable';

export type SupabaseOperation = {
	key: string;
	group: string;
	name: string;
	method: SupabaseMethod;
	path: string;
	description: string;
	pathParams?: readonly string[];
	riskLevel: EndpointRiskLevel;
	irreversible?: boolean;
	kind?: SupabaseOperationKind;
	mediaType?: string;
	defaultQuery?: Record<string, unknown>;
};
