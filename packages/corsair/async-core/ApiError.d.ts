import type { ApiRequestOptions } from './ApiRequestOptions';
import type { ApiResult } from './ApiResult';
export declare class ApiError extends Error {
    readonly url: string;
    readonly status: number;
    readonly statusText: string;
    readonly body: any;
    readonly request: ApiRequestOptions;
    readonly retryAfter?: number;
    readonly rateLimitReset?: number;
    readonly rateLimitRemaining?: number;
    readonly rateLimitLimit?: number;
    constructor(request: ApiRequestOptions, response: ApiResult, message: string, rateLimitInfo?: {
        retryAfter?: number;
        rateLimitReset?: number;
        rateLimitRemaining?: number;
        rateLimitLimit?: number;
    });
    isRateLimitError(): boolean;
}
//# sourceMappingURL=ApiError.d.ts.map