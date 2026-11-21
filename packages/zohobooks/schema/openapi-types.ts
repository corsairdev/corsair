export type JsonScalar = string | number | boolean | null;

export type JsonValue =
	| JsonScalar
	| readonly JsonValue[]
	| { readonly [key: string]: JsonValue };

export type ZohoBooksBinaryFile = {
	filename: string;
	contentType: string;
	base64: string;
};

// China has a documented Books API host but no verified Books OAuth Accounts host.
export type ZohoBooksRegion =
	| 'us'
	| 'eu'
	| 'in'
	| 'au'
	| 'jp'
	| 'ca'
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
	parameters: readonly ZohoBooksOperationParameter[];
	request?: {
		mediaType: string;
		required: boolean;
		schema?: JsonValue;
	};
	responses: readonly {
		status: string;
		contentType: string;
		schema?: JsonValue;
	}[];
	scopes: readonly string[];
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
