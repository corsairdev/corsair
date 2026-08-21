import {
	BasecampAccountIdMissingError,
	BasecampAPIError,
	BasecampOAuthError,
	BasecampSchemaError,
} from './client';
import { basecampAuditPayload } from './endpoints/logging';
import { basecampOperationCatalog } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import {
	basecamp,
	basecampEndpointMeta,
	basecampEndpointSchemas,
} from './index';

function flattenEndpoints(
	value: Record<string, unknown>,
	prefix = '',
): string[] {
	return Object.entries(value).flatMap(([key, child]) => {
		const next = prefix ? prefix + '.' + key : key;
		if (typeof child === 'function') return [next];
		if (child && typeof child === 'object') {
			return flattenEndpoints(child as Record<string, unknown>, next);
		}
		return [];
	});
}

function handlerFor(error: Error): string {
	const entry = Object.entries(errorHandlers).find(([, handler]) =>
		handler.match(error),
	);
	if (!entry) throw new Error('No error handler matched');
	return entry[0];
}

describe('Basecamp endpoint registry', () => {
	it('keeps endpoint, schema and metadata keys in exact lockstep', () => {
		const plugin = basecamp({ key: 'token', accountId: '42' });
		const endpointPaths = flattenEndpoints(
			plugin.endpoints as unknown as Record<string, unknown>,
		).sort();
		const catalogPaths = basecampOperationCatalog.map((row) => row.path).sort();
		expect(endpointPaths).toEqual(catalogPaths);
		expect(Object.keys(basecampEndpointSchemas).sort()).toEqual(catalogPaths);
		expect(Object.keys(basecampEndpointMeta).sort()).toEqual(catalogPaths);
	});

	it('has the expected preliminary semantic risk register', () => {
		const counts = Object.groupBy(
			basecampOperationCatalog,
			(operation) => operation.riskLevel,
		);
		expect(counts.read).toHaveLength(74);
		expect(counts.write).toHaveLength(77);
		expect(counts.destructive).toHaveLength(10);
		for (const operation of basecampOperationCatalog) {
			expect(basecampEndpointMeta[operation.path].riskLevel).toBe(
				operation.riskLevel,
			);
		}
	});

	it('declares OAuth metadata and account selection', () => {
		const plugin = basecamp({});
		expect(plugin.options).toMatchObject({ authType: 'oauth_2' });
		expect(plugin.oauthConfig).toMatchObject({
			providerName: 'Basecamp',
			authUrl: 'https://launchpad.37signals.com/authorization/new',
			tokenUrl: 'https://launchpad.37signals.com/authorization/token',
		});
		expect(plugin.authConfig).toMatchObject({
			oauth_2: { account: expect.arrayContaining(['account_id']) },
		});
		expect(plugin.webhooks).toEqual({});
	});
});

describe('Basecamp errors and audit safety', () => {
	it('routes provider errors by status without retrying writes', async () => {
		expect(handlerFor(new BasecampAPIError('rate', 429, 2000))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(handlerFor(new BasecampAPIError('auth', 401))).toBe('AUTH_ERROR');
		expect(handlerFor(new BasecampOAuthError('oauth'))).toBe('AUTH_ERROR');
		expect(handlerFor(new BasecampAPIError('forbidden', 403))).toBe(
			'PERMISSION_ERROR',
		);
		expect(handlerFor(new BasecampAPIError('missing', 404))).toBe(
			'NOT_FOUND_ERROR',
		);
		expect(handlerFor(new BasecampAPIError('invalid', 422))).toBe(
			'VALIDATION_ERROR',
		);
		expect(handlerFor(new BasecampAccountIdMissingError())).toBe(
			'VALIDATION_ERROR',
		);
		expect(handlerFor(new BasecampSchemaError('bad input', 'input'))).toBe(
			'VALIDATION_ERROR',
		);
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(
				new BasecampAPIError('rate', 429),
				{ operation: 'projectsAndTemplates.postProjects' } as never,
			),
		).toMatchObject({ maxRetries: 0 });
	});

	it('logs identifiers and counts but not secrets or user content', () => {
		const payload = basecampAuditPayload({
			project_id: 42,
			active: false,
			assignee_ids: [1, 2],
			content: 'private message',
			chatbotKey: 'secret',
			email_address: 'person@example.com',
		});
		expect(payload).toMatchObject({
			project_id: 42,
			active: false,
			assignee_ids_count: 2,
		});
		expect(JSON.stringify(payload)).not.toMatch(
			/private message|secret|person@example.com/,
		);
	});

	it('logs the camelCase identifiers the endpoint inputs actually use', () => {
		const payload = basecampAuditPayload({
			bucketId: 1,
			recordingId: '2',
			campfireId: 3,
			subscriptionIds: [4, 5],
			valid: 'not an identifier',
		});
		expect(payload).toMatchObject({
			bucketId: 1,
			recordingId: '2',
			campfireId: 3,
			subscriptionIds_count: 2,
		});
		expect(payload).not.toHaveProperty('valid');
	});
});
