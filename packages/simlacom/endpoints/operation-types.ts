export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export type JsonSchema = {
	$ref?: string;
	type?: string | readonly string[];
	description?: string;
	format?: string;
	pattern?: string;
	nullable?: boolean;
	enum?: readonly JsonValue[];
	properties?: Record<string, JsonSchema>;
	required?: readonly string[];
	items?: JsonSchema;
	additionalProperties?: boolean | JsonSchema;
	oneOf?: readonly JsonSchema[];
	anyOf?: readonly JsonSchema[];
	allOf?: readonly JsonSchema[];
	minimum?: number;
	maximum?: number;
	minLength?: number;
	maxLength?: number;
	minItems?: number;
	maxItems?: number;
	[key: string]:
		| JsonValue
		| JsonSchema
		| readonly string[]
		| readonly JsonValue[]
		| readonly JsonSchema[]
		| undefined;
};

export type SimlaComOperation = {
	id: string;
	group: string;
	name: string;
	method: 'GET' | 'POST';
	route: string;
	versioned: boolean;
	summary: string;
	description: string;
	risk: 'read' | 'write' | 'destructive';
	parameters: readonly {
		name: string;
		in: 'path' | 'query';
		required: boolean;
		default?: JsonValue;
		schema: JsonSchema;
	}[];
	request?: {
		required: boolean;
		mediaType: string;
		schema: JsonSchema;
	};
	response: { kind: 'binary' } | { kind: 'json'; schema: JsonSchema };
};

export type OperationData = {
	version: string;
	operations: SimlaComOperation[];
	schemas: Record<string, JsonSchema>;
};
