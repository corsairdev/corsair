import { makeLaunchDarklyRequest } from './client';
import {
	ContextsGetOutputSchema,
	TeamsGetOutputSchema,
} from './endpoints/types';
import { launchdarklyEndpointMeta } from './index';

describe('LaunchDarkly live-run regressions', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('accepts the epoch-millisecond _creationDate teams return', () => {
		// Trimmed from a live teams.create response (11-16).
		const team = {
			key: 'cpt-team',
			name: 'cpt-team',
			_creationDate: 1763287200000,
			_lastModified: 1763287200000,
			_version: 1,
			_links: {
				self: { href: '/api/v2/teams/cpt-team', type: 'application/json' },
			},
		};
		expect(TeamsGetOutputSchema.safeParse(team).success).toBe(true);
	});

	it('parses context records with the context nested under `context`', () => {
		const records = {
			_environmentId: 'env-1',
			items: [
				{
					context: { kind: 'user', key: 'cpt-user' },
					lastSeen: '2026-11-16T10:00:00.000Z',
					applicationId: '',
				},
			],
		};
		expect(ContextsGetOutputSchema.safeParse(records).success).toBe(true);
	});

	it('marks flag, segment and environment changes destructive', () => {
		for (const op of [
			'featureFlags.update',
			'featureFlags.delete',
			'segments.update',
			'environments.update',
			'environments.delete',
			'accessTokens.create',
		] as const) {
			expect(launchdarklyEndpointMeta[op].riskLevel).toBe('destructive');
		}
	});

	it('masks the key when header validation quotes it', async () => {
		const failure = await makeLaunchDarklyRequest(
			'/api/v2/projects',
			'api-unit-test\nkey',
		).catch((caught: unknown) => caught);
		expect(failure).toBeInstanceOf(Error);
		expect(String((failure as Error).message)).not.toContain('api-unit-test');
		expect(String((failure as Error).stack)).not.toContain('api-unit-test');
	});
});
