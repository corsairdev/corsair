export type CloudinaryApiKind = 'admin' | 'upload' | 'live';
export type CloudinaryBodyKind = 'json' | 'form' | 'multipart' | 'none';
export type CloudinaryRiskLevel = 'read' | 'write' | 'destructive';

export type CloudinaryOperation = {
	key: string;
	slug: string;
	group: string;
	name: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	api: CloudinaryApiKind;
	bodyKind: CloudinaryBodyKind;
	pathParams?: string[];
	queryParams?: string[];
	riskLevel: CloudinaryRiskLevel;
	irreversible?: boolean;
	description: string;
	uploadResourceType?: 'image' | 'video' | 'raw' | 'auto';
};
