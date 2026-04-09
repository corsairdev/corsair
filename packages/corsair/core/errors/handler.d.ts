import type { CorsairErrorHandler, RetryStrategy } from './index';
/**
 * Hierarchy of error handlers
 * 1. specific error's handler defined in plugin
 * 2. specific error's handler defined in root-level Corsair schema
 * 3. DEFAULT handler defined in plugin
 * 4. DEFAULT handler defined in root-level Corsair schema
 * 5. defaultErrorHandler that comes pre-configured in Corsair
 */
export declare function handleCorsairError(error: Error, pluginId: string, operation: string, input: Record<string, unknown>, errorHandlers: CorsairErrorHandler): Promise<RetryStrategy>;
//# sourceMappingURL=handler.d.ts.map