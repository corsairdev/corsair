import { Smtp2goAPIError } from './client';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';

type HandlerResult = {
	maxRetries: number;
	headersRetryAfterMs?: number;
	retryStrategy?: string;
};

type HandlerEntry = {
	match: (error: Error) => boolean;
	handler: (error: Error) => Promise<HandlerResult>;
};

// unknown: the handler map's values are a Partial type, so tests read them
// through this narrowed shape to call match and handler directly.
const handlers = errorHandlers as unknown as Record<string, HandlerEntry>;

/** Reads a handler that must exist, so a missing one fails as an assertion. */
function handlerOf(
	source: Record<string, HandlerEntry>,
	name: string,
): HandlerEntry {
	const entry = source[name];
	if (!entry) throw new Error(`Expected handler "${name}" to be registered`);
	return entry;
}

function smtpError(
	message: string,
	options: ConstructorParameters<typeof Smtp2goAPIError>[1] = {},
): Smtp2goAPIError {
	return new Smtp2goAPIError(message, options);
}

function firstMatch(error: Error): string | undefined {
	for (const [name, entry] of Object.entries(handlers)) {
		if (entry.match(error)) return name;
	}
	return undefined;
}

describe('error handler order and behavior', () => {
	it('routes the documented failures to the right handler', () => {
		// 429 with an empty body and no Retry-After (live-verified).
		expect(
			firstMatch(smtpError('SMTP2GO 429: throttled', { status: 429 })),
		).toBe('RATE_LIMIT_ERROR');
		// Missing or malformed key: 403 naming api_key (live probe).
		expect(
			firstMatch(
				smtpError("SMTP2GO 403: The 'api_key' parameter was not found", {
					status: 403,
					code: 'E_ApiResponseCodes.INVALID_IN_PAYLOAD',
				}),
			),
		).toBe('AUTH_ERROR');
		// Unknown but well-formed key: 400 naming api_key (live probe).
		expect(
			firstMatch(
				smtpError(
					"SMTP2GO 400: An API User matching the passed 'api_key' was not found",
					{ status: 400, code: 'E_ApiResponseCodes.API_EXCEPTION' },
				),
			),
		).toBe('AUTH_ERROR');
		// Field validation 400 is not an auth failure even though it shares the
		// INVALID_IN_PAYLOAD code with the missing-key error.
		expect(
			firstMatch(
				smtpError(
					'SMTP2GO 400 E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD: field to empty',
					{ status: 400, code: 'E_ApiResponseCodes.NON_VALIDATING_IN_PAYLOAD' },
				),
			),
		).toBe('VALIDATION_ERROR');
		// Per-key permission denial.
		expect(
			firstMatch(
				smtpError('SMTP2GO 403: no permission', {
					status: 403,
					code: 'E_ApiResponseCodes.ENDPOINT_PERMISSION_DENIED',
				}),
			),
		).toBe('PERMISSION_ERROR');
		// 404 unknown route.
		expect(firstMatch(smtpError('SMTP2GO 404: gone', { status: 404 }))).toBe(
			'VALIDATION_ERROR',
		);
		// A schema rejection lands on validation.
		const zodError = new Error('Validation failed');
		zodError.name = 'ZodError';
		expect(firstMatch(zodError)).toBe('VALIDATION_ERROR');
		// Anything unclassified falls through to DEFAULT.
		expect(firstMatch(new Error('bad input'))).toBe('DEFAULT');
	});

	it('retries a 429 once, delayed past the documented IP timeout', async () => {
		const noHeader = await handlerOf(handlers, 'RATE_LIMIT_ERROR').handler(
			smtpError('SMTP2GO 429', { status: 429 }),
		);
		expect(noHeader.maxRetries).toBe(1);
		// No Retry-After header exists on this API, so the fallback delay is
		// the documented minimum throttle window.
		expect(noHeader.headersRetryAfterMs).toBe(60_000);

		const withHeader = await handlerOf(handlers, 'RATE_LIMIT_ERROR').handler(
			smtpError('SMTP2GO 429', { status: 429, retryAfter: 90_000 }),
		);
		expect(withHeader.headersRetryAfterMs).toBe(90_000);
	});

	it('never retries auth, permission or validation failures', async () => {
		for (const name of ['AUTH_ERROR', 'PERMISSION_ERROR', 'VALIDATION_ERROR']) {
			const result = await handlerOf(handlers, name).handler(
				new Error('anything'),
			);
			expect([name, result.maxRetries]).toEqual([name, 0]);
		}
	});

	it('replays only reads on 5xx and transport failures', () => {
		const read500 = smtpError('SMTP2GO 500', {
			status: 500,
			replayable: true,
		});
		const write500 = smtpError('SMTP2GO 500', {
			status: 500,
			replayable: false,
		});
		const readTransport = smtpError('fetch failed', {
			transport: true,
			replayable: true,
		});
		const writeTransport = smtpError('fetch failed', {
			transport: true,
			replayable: false,
		});

		expect(handlerOf(handlers, 'SERVER_ERROR').match(read500)).toBe(true);
		expect(handlerOf(handlers, 'SERVER_ERROR').match(write500)).toBe(false);
		expect(handlerOf(handlers, 'SERVER_ERROR').match(readTransport)).toBe(true);
		expect(handlerOf(handlers, 'SERVER_ERROR').match(writeTransport)).toBe(
			false,
		);
	});

	it('retries a replayable 5xx with exponential backoff', async () => {
		const result = await handlerOf(handlers, 'SERVER_ERROR').handler(
			smtpError('SMTP2GO 503', { status: 503, replayable: true }),
		);
		expect(result.maxRetries).toBe(2);
		expect(result.retryStrategy).toBe('exponential_backoff');
	});

	it('keeps DEFAULT last after a merge with caller handlers', async () => {
		const callerDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 7 }),
		};
		// A caller handler for a status no builtin covers keeps its position,
		// so core finds it before the trailing DEFAULT.
		const caller418 = {
			match: (error: Error) =>
				error instanceof Smtp2goAPIError && error.status === 418,
			handler: async () => ({ maxRetries: 5 }),
		};

		// unknown: narrowed the same way as the builtin map above.
		const merged = mergeErrorHandlers(errorHandlers, {
			TEAPOT_ERROR: caller418,
			DEFAULT: callerDefault,
		}) as unknown as Record<string, HandlerEntry>;

		const names = Object.keys(merged);
		expect(names.at(-1)).toBe('DEFAULT');
		expect(
			handlerOf(merged, 'DEFAULT').handler(new Error('x')),
		).resolves.toMatchObject({
			maxRetries: 7,
		});
		// The builtin handlers the caller did not name are still present.
		expect(handlerOf(merged, 'RATE_LIMIT_ERROR')).toBeDefined();
		// The caller's handler is reachable ahead of DEFAULT.
		expect(
			handlerOf(merged, 'TEAPOT_ERROR').handler(
				smtpError('SMTP2GO 418', { status: 418 }),
			),
		).resolves.toMatchObject({ maxRetries: 5 });
		// Order check: the teapot error resolves to TEAPOT_ERROR, not DEFAULT.
		let resolved = '';
		for (const [name, entry] of Object.entries(merged)) {
			if (entry.match(smtpError('SMTP2GO 418', { status: 418 }))) {
				resolved = name;
				break;
			}
		}
		expect(resolved).toBe('TEAPOT_ERROR');
	});

	it('returns the builtin set unchanged when no caller handlers arrive', () => {
		expect(mergeErrorHandlers(errorHandlers, undefined)).toBe(errorHandlers);
	});
});
