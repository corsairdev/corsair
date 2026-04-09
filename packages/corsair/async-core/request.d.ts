import type { ApiRequestOptions } from './ApiRequestOptions';
import { CancelablePromise } from './CancelablePromise';
import type { OpenAPIConfig } from './OpenAPI';
import type { RateLimitConfig } from './rate-limit';
export interface RequestOptions {
    rateLimitConfig?: RateLimitConfig;
}
export declare const request: <T>(config: OpenAPIConfig, options: ApiRequestOptions, requestOptions?: RequestOptions) => CancelablePromise<T>;
//# sourceMappingURL=request.d.ts.map