export type JsonScalar = string | number | boolean | null;

export type JsonValue = JsonScalar | JsonValue[] | { [key: string]: JsonValue };

export type ZohoBooksRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'ca'
	| 'cn'
	| 'sa'
	| 'ae';

export type ZohoBooksOperationParameter = {
	name: string;
	in: 'query' | 'path' | 'header';
	required: boolean;
	description?: string;
	schema?: JsonValue;
	style?: string;
	explode?: boolean;
};

export type ZohoBooksOperationDefinition = {
	id: string;
	group: string;
	groupSlug: string;
	name: string;
	riskLevel: 'read' | 'write' | 'destructive';
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	path: string;
	summary: string;
	description: string;
	docsUrl: string;
	parameters: ZohoBooksOperationParameter[];
	request?: {
		mediaType: string;
		required: boolean;
		schema?: JsonValue;
	};
	responses: Array<{
		status: string;
		contentType: string;
		schema?: JsonValue;
	}>;
	scopes: string[];
};

export type ZohoBooksExcludedOperationDefinition =
	ZohoBooksOperationDefinition & { exclusionReason: string };

export type ZohoBooksOperationInput = {
	pathParams?: Record<string, JsonValue>;
	query?: Record<string, JsonValue>;
	headers?: Record<string, JsonValue>;
	body?: JsonValue;
};

export type ZohoBooksBinaryOutput = {
	kind: 'binary';
	contentType: string;
	base64: string;
	byteLength: number;
};

export type ZohoBooksOperationOutput = JsonValue | ZohoBooksBinaryOutput;
