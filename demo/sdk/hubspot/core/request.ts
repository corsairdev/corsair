import { ApiError } from './ApiError';
import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
import type { OnCancel } from './CancelablePromise';
import { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';

export const isDefined = <T>(
	value: T | null | undefined,
): value is Exclude<T, null | undefined> => {
	return value !== undefined && value !== null;
};

export const isString = (value: any): value is string => {
	return typeof value === 'string';
};

export const isStringWithValue = (value: any): value is string => {
	return isString(value) && value !== '';
};

export const isBlob = (value: any): value is Blob => {
	return (
		typeof value === 'object' &&
		typeof value.type === 'string' &&
		typeof value.stream === 'function' &&
		typeof value.arrayBuffer === 'function' &&
		typeof value.constructor === 'function' &&
		typeof value.constructor.name === 'string' &&
		/^(Blob|File)$/.test(value.constructor.name) &&
		/^(Blob|File)$/.test(value[Symbol.toStringTag])
	);
};

export const isFormData = (value: any): value is FormData => {
	return value instanceof FormData;
};

export const base64 = (str: string): string => {
	try {
		return btoa(str);
	} catch (err) {
		return Buffer.from(str).toString('base64');
	}
};

export const getQueryString = (params: Record<string, any>): string => {
	const qs: string[] = [];

	const append = (key: string, value: any) => {
		qs.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
	};

	const process = (key: string, value: any) => {
		if (isDefined(value)) {
			if (Array.isArray(value)) {
				// HubSpot expects arrays as repeated query parameters
				// e.g., properties=email&properties=firstname
				value.forEach((v) => {
					if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
						append(key, v);
					} else {
						// For complex array items, stringify them
						append(key, JSON.stringify(v));
					}
				});
			} else if (typeof value === 'object') {
				// For objects, HubSpot typically expects JSON string or flattened format
				// We'll stringify objects for now
				append(key, JSON.stringify(value));
			} else {
				append(key, value);
			}
		}
	};

	Object.entries(params).forEach(([key, value]) => {
		process(key, value);
	});

	if (qs.length > 0) {
		return `?${qs.join('&')}`;
	}

	return '';
};

const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
	const encoder = config.ENCODE_PATH || encodeURI;

	let path = options.url
		.replace('{api-version}', config.VERSION)
		.replace(/{(.*?)}/g, (substring: string, group: string) => {
			if (options.path?.hasOwnProperty(group)) {
				return encoder(String(options.path[group]));
			}
			return substring;
		});

	// Remove leading slash from path if present to avoid double slashes
	path = path.startsWith('/') ? path.slice(1) : path;

	const url = `${config.BASE}/${path}`;
	if (options.query) {
		return `${url}${getQueryString(options.query)}`;
	}
	return url;
};

export const getFormData = (
	options: ApiRequestOptions,
): FormData | undefined => {
	if (options.formData) {
		const formData = new FormData();

		const process = (key: string, value: any) => {
			if (isString(value) || isBlob(value)) {
				formData.append(key, value);
			} else {
				formData.append(key, JSON.stringify(value));
			}
		};

		Object.entries(options.formData)
			.filter(([_, value]) => isDefined(value))
			.forEach(([key, value]) => {
				if (Array.isArray(value)) {
					value.forEach((v) => process(key, v));
				} else {
					process(key, value);
				}
			});

		return formData;
	}
	return undefined;
};

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;

export const resolve = async <T>(
	options: ApiRequestOptions,
	resolver?: T | Resolver<T>,
): Promise<T | undefined> => {
	if (typeof resolver === 'function') {
		return (resolver as Resolver<T>)(options);
	}
	return resolver;
};

export const getHeaders = async (
	config: OpenAPIConfig,
	options: ApiRequestOptions,
): Promise<Headers> => {
	const [token, username, password, additionalHeaders] = await Promise.all([
		resolve(options, config.TOKEN),
		resolve(options, config.USERNAME),
		resolve(options, config.PASSWORD),
		resolve(options, config.HEADERS),
	]);

	const headers = Object.entries({
		Accept: 'application/json',
		...additionalHeaders,
		...options.headers,
	})
		.filter(([_, value]) => isDefined(value))
		.reduce(
			(headers, [key, value]) => ({
				...headers,
				[key]: String(value),
			}),
			{} as Record<string, string>,
		);

	// Only set Authorization if not already provided in headers
	if (!headers['Authorization']) {
		if (isStringWithValue(token)) {
			headers['Authorization'] = `Bearer ${token}`;
		} else if (
			isStringWithValue(username) &&
			isStringWithValue(password)
		) {
			const credentials = base64(`${username}:${password}`);
			headers['Authorization'] = `Basic ${credentials}`;
		}
	}

	if (options.body !== undefined) {
		if (options.mediaType) {
			headers['Content-Type'] = options.mediaType;
		} else if (isBlob(options.body)) {
			headers['Content-Type'] = options.body.type || 'application/octet-stream';
		} else if (isString(options.body)) {
			headers['Content-Type'] = 'text/plain';
		} else if (!isFormData(options.body)) {
			headers['Content-Type'] = 'application/json; charset=utf-8';
		}
	}

	return new Headers(headers);
};

export const getRequestBody = (options: ApiRequestOptions): any => {
	if (options.body !== undefined) {
		if (options.mediaType?.includes('/json')) {
			return JSON.stringify(options.body);
		} else if (
			isString(options.body) ||
			isBlob(options.body) ||
			isFormData(options.body)
		) {
			return options.body;
		} else {
			return JSON.stringify(options.body);
		}
	}
	return undefined;
};

export const sendRequest = async (
	config: OpenAPIConfig,
	options: ApiRequestOptions,
	url: string,
	body: any,
	formData: FormData | undefined,
	headers: Headers,
	onCancel: OnCancel,
): Promise<Response> => {
	const controller = new AbortController();

	const request: RequestInit = {
		headers,
		body: body ?? formData,
		method: options.method,
		signal: controller.signal,
	};

	if (config.WITH_CREDENTIALS) {
		request.credentials = config.CREDENTIALS;
	}

	onCancel(() => controller.abort());

	return await fetch(url, request);
};

export const getResponseHeader = (
	response: Response,
	responseHeader?: string,
): string | undefined => {
	if (responseHeader) {
		const content = response.headers.get(responseHeader);
		if (isString(content)) {
			return content;
		}
	}
	return undefined;
};

export const getResponseBody = async (response: Response): Promise<any> => {
	if (response.status !== 204) {
		try {
			const contentType = response.headers.get('Content-Type');
			if (contentType) {
				const jsonTypes = ['application/json', 'application/problem+json'];
				const isJSON = jsonTypes.some((type) =>
					contentType.toLowerCase().startsWith(type),
				);
				if (isJSON) {
					return await response.json();
				} else {
					return await response.text();
				}
			}
		} catch (error) {
			console.error(error);
		}
	}
	return undefined;
};

export const catchErrorCodes = (
	options: ApiRequestOptions,
	result: ApiResult,
): void => {
	const errors: Record<number, string> = {
		400: 'Bad Request',
		401: 'Unauthorized',
		403: 'Forbidden',
		404: 'Not Found',
		429: 'Rate Limited',
		500: 'Internal Server Error',
		502: 'Bad Gateway',
		503: 'Service Unavailable',
		...options.errors,
	};

	const error = errors[result.status];
	if (error) {
		// Include detailed error information from HubSpot
		const errorDetails = result.body?.message || result.body?.errors?.[0]?.message || result.body?.error || error;
		throw new ApiError(options, result, errorDetails);
	}

	if (!result.ok) {
		const errorStatus = result.status ?? 'unknown';
		const errorStatusText = result.statusText ?? 'unknown';
		const errorBody = (() => {
			try {
				return JSON.stringify(result.body, null, 2);
			} catch (e) {
				return undefined;
			}
		})();

		// Try to extract meaningful error message from HubSpot response
		const errorMessage =
			result.body?.message ||
			result.body?.errors?.[0]?.message ||
			result.body?.error ||
			`Generic Error: status: ${errorStatus}; status text: ${errorStatusText}; body: ${errorBody}`;

		throw new ApiError(options, result, errorMessage);
	}
};

export const request = <T>(
	config: OpenAPIConfig,
	options: ApiRequestOptions,
): CancelablePromise<T> => {
	return new CancelablePromise(async (resolve, reject, onCancel) => {
		try {
			const url = getUrl(config, options);
			const formData = getFormData(options);
			const body = getRequestBody(options);
			const headers = await getHeaders(config, options);

			if (!onCancel.isCancelled) {
				const response = await sendRequest(
					config,
					options,
					url,
					body,
					formData,
					headers,
					onCancel,
				);
				const responseBody = await getResponseBody(response);
				const responseHeader = getResponseHeader(
					response,
					options.responseHeader,
				);

				const result: ApiResult = {
					url,
					ok: response.ok,
					status: response.status,
					statusText: response.statusText,
					body: responseHeader ?? responseBody,
				};

				catchErrorCodes(options, result);

				resolve(result.body);
			}
		} catch (error) {
			reject(error);
		}
	});
};

