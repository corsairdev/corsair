import { z } from 'zod';
import { makeBuildkiteRequest } from './client';
import {
	BuildkiteAccessToken,
	BuildkiteAgent,
	BuildkiteMeta,
	BuildkiteOrganization,
	BuildkiteUser,
} from './schema';

const LIVE_KEY = process.env.BUILDKITE_API_TOKEN;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Buildkite live REST API', () => {
	it('GET /v2/meta returns webhook CIDRs without auth', async () => {
		const res = await makeBuildkiteRequest<unknown>('/v2/meta', undefined);
		const parsed = BuildkiteMeta.parse(res);
		expect(parsed.webhook_ips.length).toBeGreaterThan(0);
	});
});

describeIfKey('Buildkite live authenticated REST API', () => {
	it('GET /v2/access-token returns the current token', async () => {
		const res = await makeBuildkiteRequest<unknown>(
			'/v2/access-token',
			LIVE_KEY,
		);
		const parsed = BuildkiteAccessToken.parse(res);
		expect(parsed.uuid.length).toBeGreaterThan(0);
		expect(Array.isArray(parsed.scopes)).toBe(true);
	});

	it('GET /v2/user returns the token owner', async () => {
		const res = await makeBuildkiteRequest<unknown>('/v2/user', LIVE_KEY);
		const parsed = BuildkiteUser.parse(res);
		expect(parsed.id.length).toBeGreaterThan(0);
		expect(parsed.email.length).toBeGreaterThan(0);
	});

	it('GET /v2/organizations lists orgs and agents for the first slug', async () => {
		const orgs = z.array(BuildkiteOrganization).parse(
			await makeBuildkiteRequest<unknown>('/v2/organizations', LIVE_KEY, {
				query: { page: 1, per_page: 1 },
			}),
		);
		expect(Array.isArray(orgs)).toBe(true);
		if (!orgs[0]?.slug) return;
		const agents = z
			.array(BuildkiteAgent)
			.parse(
				await makeBuildkiteRequest<unknown>(
					`/v2/organizations/${encodeURIComponent(orgs[0].slug)}/agents`,
					LIVE_KEY,
					{ query: { page: 1, per_page: 1 } },
				),
			);
		expect(Array.isArray(agents)).toBe(true);
	});
});
