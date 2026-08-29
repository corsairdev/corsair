export type WebflowMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type WebflowOperation = {
	key: string;
	group: string;
	name: string;
	method: WebflowMethod;
	path: string;
	pathParams?: readonly string[];
	riskLevel: 'read' | 'write' | 'destructive';
	irreversible?: boolean;
	description: string;
};
