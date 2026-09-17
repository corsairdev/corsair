export type ApiRequestOptions = {
	readonly method:
		| 'GET'
		| 'PUT'
		| 'POST'
		| 'DELETE'
		| 'OPTIONS'
		| 'HEAD'
		| 'PATCH';
	readonly url: string;
	readonly path?: Record<string, any>;
	readonly cookies?: Record<string, any>;
	readonly headers?: Record<string, any>;
	readonly query?: Record<string, any>;
	readonly formData?: Record<string, any>;
	readonly body?: any;
	readonly mediaType?: string;
	readonly redirect?: 'follow' | 'error' | 'manual';
	readonly responseHeader?: string;
	readonly errors?: Record<number, string>;
};
