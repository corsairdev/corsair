import type { ApiRequestOptions } from './ApiRequestOptions';

type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;
type Headers = Record<string, string>;

export type OpenAPIConfig = {
	BASE: string;
	VERSION: string;
	WITH_CREDENTIALS: boolean;
	CREDENTIALS: 'include' | 'omit' | 'same-origin';
	TOKEN?: string | Resolver<string> | undefined;
	USERNAME?: string | Resolver<string> | undefined;
	PASSWORD?: string | Resolver<string> | undefined;
	HEADERS?: Headers | Resolver<Headers> | undefined;
	ENCODE_PATH?: ((path: string) => string) | undefined;
};

