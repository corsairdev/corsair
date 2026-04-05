export interface RateLimitConfig {
    enabled: boolean;
    maxRetries: number;
    initialRetryDelay: number;
    backoffMultiplier: number;
    headerNames: {
        retryAfter?: string;
        resetTime?: string;
        remaining?: string;
        limit?: string;
    };
    isRateLimitError?: (status: number, body: any) => boolean;
}
export interface RateLimitInfo {
    retryAfter?: number;
    rateLimitReset?: number;
    rateLimitRemaining?: number;
    rateLimitLimit?: number;
}
export declare const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig;
export declare function extractRateLimitInfo(response: Response, config: RateLimitConfig): RateLimitInfo;
export declare function isRateLimitError(status: number, body: any, config: RateLimitConfig): boolean;
export declare function calculateRetryDelay(attempt: number, rateLimitInfo: RateLimitInfo, config: RateLimitConfig): number;
export declare function sleep(ms: number): Promise<void>;
//# sourceMappingURL=rate-limit.d.ts.map