import type {
	CorsairErrorHandler,
	ErrorContext,
	ErrorHandler,
	RetryStrategy,
} from './index';

const defaultErrorHandler: ErrorHandler = async (error, context) => {
	console.error(`[corsair:${context.pluginId}:${context.operation}]`, {
		error: error.message,
		input: context.input,
	});
	return {
		maxRetries: 0,
	};
};

/**
 * Hierarchy of error handlers
 * 1. specific error's handler defined in plugin
 * 2. specific error's handler defined in root-level Corsair schema
 * 3. DEFAULT handler defined in plugin
 * 4. DEFAULT handler defined in root-level Corsair schema
 * 5. defaultErrorHandler that comes pre-configured in Corsair
 */
export async function handleCorsairError(
	error: Error,
	pluginId: string,
	operation: string,
	input: Record<string, unknown>,
	errorHandlers: CorsairErrorHandler,
): Promise<RetryStrategy> {
	const context = {
		pluginId,
		operation,
		input,
		originalError: error,
	} satisfies ErrorContext;

	// Find the first matching named handler. DEFAULT is the fallback, never a
	// candidate: most plugins' DEFAULT matches everything, so checking it in
	// key order would hide every named handler that comes after it.
	const matchingHandlerName = Object.keys(errorHandlers).find(
		(errorName) =>
			errorName !== 'DEFAULT' &&
			errorHandlers[errorName]?.match(error, context),
	);

	const pluginSpecificErrorHandler =
		errorHandlers[matchingHandlerName || 'DEFAULT']?.handler;

	const handler = pluginSpecificErrorHandler || defaultErrorHandler;

	return await handler(error, context);
}
