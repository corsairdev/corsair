/** What `request()` resolves with when `responseType` is `'binary'`. */
export type BinaryResponse = {
	bytes: Uint8Array;
	/** The Content-Type header as sent, or null when there was none. */
	contentType: string | null;
};

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
	readonly responseHeader?: string;
	/**
	 * `'binary'` returns a successful response as `{ bytes, contentType }`
	 * (`BinaryResponse`) instead of decoding it as JSON or text, which corrupts
	 * a file. An error response is still parsed, so its message survives.
	 */
	readonly responseType?: 'binary';
	readonly errors?: Record<number, string>;
};
