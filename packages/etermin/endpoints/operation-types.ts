export type ETerminPrimitive = string | number | boolean;
export type ETerminParameter = {
	name: string;
	type: 'string' | 'number' | 'boolean';
	required: boolean;
	description: string;
};
export type ETerminOperation = {
	key: string;
	group: string;
	action: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	path: string;
	riskLevel: 'read' | 'write' | 'destructive';
	description: string;
	params: readonly ETerminParameter[];
	responseKind: 'array' | 'object' | 'opaque';
};
