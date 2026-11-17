import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedVercelRequest } from '../client';
import type { VercelContext } from '../index';
import { VercelDomainSchema } from '../schema/database';
import {
	addDomain,
	addProjectDomain,
	deleteDomain,
	getDomain,
	getDomainConfig,
	getDomains,
	getProjectDomain,
	getProjectDomains,
	removeProjectDomain,
	updateProjectDomain,
	verifyProjectDomain,
} from './domains';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeAuthenticatedVercelRequest: jest.fn(),
}));

const request = makeAuthenticatedVercelRequest as jest.MockedFunction<
	typeof makeAuthenticatedVercelRequest
>;
const logEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const upsert = jest.fn();
const remove = jest.fn();
const ctx = {
	key: 'test-token',
	options: {},
	db: { domains: { upsertByEntityId: upsert, deleteByEntityId: remove } },
} as unknown as VercelContext;

// Shaped like a live /v5/domains item: nulls where the spec says required,
// fields the spec doesn't list.
const domain = {
	id: 'dom_1',
	name: 'example.com',
	boughtAt: null,
	createdAt: 1700000000000,
	expiresAt: null,
	transferredAt: null,
	serviceType: 'external',
	verified: true,
	nameservers: ['ns1.other.com'],
	intendedNameservers: [],
	teamId: null,
	userId: 'u1',
	creator: { id: 'u1', username: 'someone', email: 'a@b.c', name: 'A' },
	echMode: 'auto',
	cdnEnabled: true,
	zone: false,
	configVerifiedAt: null,
	verificationRecord: 'abc123',
};

const projectDomain = {
	name: 'www.example.com',
	apexName: 'example.com',
	projectId: 'prj_1',
	redirect: null,
	redirectStatusCode: null,
	gitBranch: null,
	customEnvironmentId: null,
	createdAt: 1,
	updatedAt: 2,
	verified: false,
	verification: [
		{
			type: 'TXT',
			domain: '_vercel.example.com',
			value: 'vc-domain-verify=www.example.com,abc',
			reason: 'pending_domain_verification',
		},
	],
	somethingNew: true,
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('domains', () => {
	it('getDomains sends pagination, keeps new fields, stores each domain by name', async () => {
		request.mockResolvedValueOnce({
			domains: [domain],
			pagination: { count: 1, next: null, prev: 1700000000000 },
		});

		const result = await getDomains(ctx, {
			limit: 5,
			until: 1800000000000,
			teamId: 'team_1',
		});

		expect(request).toHaveBeenCalledWith('/v5/domains', ctx, {
			teamId: 'team_1',
			query: { limit: 5, until: 1800000000000 },
		});
		expect(result.domains[0]?.verificationRecord).toBe('abc123');
		expect(result.domains[0]?.teamId).toBeNull();
		expect(result.pagination?.next).toBeNull();
		// Stored as Vercel sent it, null teamId (a personal account) included,
		// and it passes the entity schema upsertByEntityId parses with.
		expect(upsert).toHaveBeenCalledWith(
			'example.com',
			expect.objectContaining({ id: 'dom_1', name: 'example.com' }),
		);
		const stored = upsert.mock.calls[0]?.[1];
		expect(stored).toHaveProperty('teamId', null);
		expect(stored).toHaveProperty('boughtAt', null);
		expect(VercelDomainSchema.safeParse(stored).success).toBe(true);
		expect(logEvent).toHaveBeenCalledWith(
			ctx,
			'vercel.domains.getDomains',
			expect.objectContaining({ limit: 5 }),
			'completed',
		);
	});

	it('getDomains rejects a limit over 100 before calling Vercel', async () => {
		await expect(getDomains(ctx, { limit: 500 })).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getDomain encodes the name and stores the domain', async () => {
		request.mockResolvedValueOnce({ domain: { ...domain, suffix: false } });
		const result = await getDomain(ctx, { domain: 'example.com' });
		expect(request).toHaveBeenCalledWith('/v5/domains/example.com', ctx, {
			teamId: undefined,
		});
		expect(result.domain.id).toBe('dom_1');
		expect(upsert).toHaveBeenCalledWith('example.com', expect.anything());
	});

	it('getDomain rejects a response without a domain id', async () => {
		request.mockResolvedValueOnce({ domain: { name: 'example.com' } });
		await expect(getDomain(ctx, { domain: 'example.com' })).rejects.toThrow();
		expect(upsert).not.toHaveBeenCalled();
	});

	it('getDomainConfig sends projectIdOrName and strict, tolerates extra fields', async () => {
		request.mockResolvedValueOnce({
			configuredBy: null,
			misconfigured: true,
			acceptedChallenges: [],
			recommendedIPv4: [{ rank: 1, value: ['76.76.21.21'] }],
			recommendedCNAME: [{ rank: 1, value: 'cname.vercel-dns.com.' }],
			nameservers: ['ns1.other.com'],
			serviceType: 'external',
			cnames: [],
			aValues: ['192.0.2.1'],
			conflicts: [],
			ipStatus: null,
		});
		const result = await getDomainConfig(ctx, {
			domain: 'www.example.com',
			projectIdOrName: 'site',
			strict: true,
			teamId: 'my-team',
		});
		expect(request).toHaveBeenCalledWith(
			'/v6/domains/www.example.com/config',
			ctx,
			{ teamId: 'my-team', query: { projectIdOrName: 'site', strict: true } },
		);
		expect(result.misconfigured).toBe(true);
		expect(result.configuredBy).toBeNull();
		expect(result.recommendedIPv4?.[0]?.value).toEqual(['76.76.21.21']);
	});

	it('getDomainConfig rejects a response without misconfigured', async () => {
		request.mockResolvedValueOnce({ configuredBy: 'A' });
		await expect(
			getDomainConfig(ctx, { domain: 'example.com' }),
		).rejects.toThrow();
	});

	it('addDomain always sends method add and stores the new domain', async () => {
		request.mockResolvedValueOnce({ domain });
		await addDomain(ctx, { name: 'example.com', zone: true, teamId: 'team_1' });
		expect(request).toHaveBeenCalledWith('/v7/domains', ctx, {
			method: 'POST',
			teamId: 'team_1',
			body: { method: 'add', name: 'example.com', zone: true },
		});
		expect(upsert).toHaveBeenCalledWith('example.com', expect.anything());
	});

	it('addDomain takes no transfer or move-in fields', async () => {
		await expect(
			addDomain(ctx, { name: '' } as Parameters<typeof addDomain>[1]),
		).rejects.toThrow();
		request.mockResolvedValueOnce({ domain });
		await addDomain(ctx, {
			name: 'example.com',
			method: 'transfer-in',
			authCode: 'x',
		} as Parameters<typeof addDomain>[1]);
		expect(request).toHaveBeenCalledTimes(1);
		expect(request.mock.calls[0]?.[2]?.body).toEqual({
			method: 'add',
			name: 'example.com',
		});
	});

	it('deleteDomain reports the deletion and drops the stored row', async () => {
		request.mockResolvedValueOnce({ uid: 'dom_1' });
		await expect(
			deleteDomain(ctx, { domain: 'example.com', teamId: 'team_1' }),
		).resolves.toEqual({ deleted: true, domain: 'example.com', uid: 'dom_1' });
		expect(request).toHaveBeenCalledWith('/v6/domains/example.com', ctx, {
			method: 'DELETE',
			teamId: 'team_1',
		});
		expect(remove).toHaveBeenCalledWith('example.com');
	});

	it('deleteDomain tolerates an empty body', async () => {
		request.mockResolvedValueOnce(undefined);
		await expect(deleteDomain(ctx, { domain: 'example.com' })).resolves.toEqual(
			{
				deleted: true,
				domain: 'example.com',
				uid: null,
			},
		);
	});

	it('getProjectDomains sends every filter and parses null fields', async () => {
		request.mockResolvedValueOnce({
			domains: [projectDomain],
			pagination: { count: 1, next: null, prev: 1 },
		});
		const result = await getProjectDomains(ctx, {
			idOrName: 'my site',
			production: true,
			target: 'production',
			gitBranch: 'main',
			redirects: false,
			redirect: 'example.com',
			verified: false,
			customEnvironmentId: 'env_1',
			order: 'ASC',
			limit: 10,
			since: 5,
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/my%20site/domains',
			ctx,
			{
				teamId: 'team_1',
				query: {
					limit: 10,
					since: 5,
					production: true,
					target: 'production',
					customEnvironmentId: 'env_1',
					gitBranch: 'main',
					redirects: false,
					redirect: 'example.com',
					verified: false,
					order: 'ASC',
				},
			},
		);
		expect(result.domains[0]?.redirect).toBeNull();
		expect(result.domains[0]?.somethingNew).toBe(true);
		// Project domains aren't stored in the domains entity.
		expect(upsert).not.toHaveBeenCalled();
	});

	it('getProjectDomains rejects an unknown target before calling Vercel', async () => {
		await expect(
			getProjectDomains(ctx, {
				idOrName: 'site',
				target: 'staging',
			} as unknown as Parameters<typeof getProjectDomains>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('getProjectDomain returns the verification challenge', async () => {
		request.mockResolvedValueOnce(projectDomain);
		const result = await getProjectDomain(ctx, {
			idOrName: 'prj_1',
			domain: 'www.example.com',
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/prj_1/domains/www.example.com',
			ctx,
			{ teamId: 'team_1' },
		);
		expect(result.verification?.[0]?.type).toBe('TXT');
	});

	it('getProjectDomain rejects a response without a name', async () => {
		request.mockResolvedValueOnce({ projectId: 'prj_1' });
		await expect(
			getProjectDomain(ctx, { idOrName: 'prj_1', domain: 'x.com' }),
		).rejects.toThrow();
	});

	it('addProjectDomain posts the domain with its redirect', async () => {
		request.mockResolvedValueOnce({
			...projectDomain,
			redirect: 'example.com',
		});
		await addProjectDomain(ctx, {
			idOrName: 'prj_1',
			name: 'www.example.com',
			redirect: 'example.com',
			redirectStatusCode: 308,
			teamId: 'team_1',
		});
		expect(request).toHaveBeenCalledWith('/v10/projects/prj_1/domains', ctx, {
			method: 'POST',
			teamId: 'team_1',
			body: {
				name: 'www.example.com',
				redirect: 'example.com',
				redirectStatusCode: 308,
			},
		});
	});

	it('addProjectDomain rejects an unsupported redirect status', async () => {
		await expect(
			addProjectDomain(ctx, {
				idOrName: 'prj_1',
				name: 'www.example.com',
				redirectStatusCode: 303,
			} as unknown as Parameters<typeof addProjectDomain>[1]),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();
	});

	it('updateProjectDomain keeps null to clear a field', async () => {
		request.mockResolvedValueOnce(projectDomain);
		await updateProjectDomain(ctx, {
			idOrName: 'prj_1',
			domain: 'www.example.com',
			redirect: null,
			redirectStatusCode: null,
		});
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/prj_1/domains/www.example.com',
			ctx,
			{
				method: 'PATCH',
				teamId: undefined,
				body: { redirect: null, redirectStatusCode: null },
			},
		);
	});

	it('updateProjectDomain needs a field to change', async () => {
		await expect(
			updateProjectDomain(ctx, {
				idOrName: 'prj_1',
				domain: 'www.example.com',
			}),
		).rejects.toThrow('Pass gitBranch, redirect or redirectStatusCode');
		expect(request).not.toHaveBeenCalled();
	});

	it('removeProjectDomain reports the removal after an empty response', async () => {
		request.mockResolvedValueOnce({});
		await expect(
			removeProjectDomain(ctx, {
				idOrName: 'prj_1',
				domain: 'www.example.com',
				teamId: 'team_1',
			}),
		).resolves.toEqual({
			removed: true,
			idOrName: 'prj_1',
			domain: 'www.example.com',
		});
		// No removeRedirects: a plain DELETE with no body.
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/prj_1/domains/www.example.com',
			ctx,
			{ method: 'DELETE', teamId: 'team_1', body: undefined },
		);
	});

	it('removeProjectDomain sends removeRedirects in the DELETE body', async () => {
		request.mockResolvedValue({});
		await removeProjectDomain(ctx, {
			idOrName: 'prj_1',
			domain: 'example.com',
			removeRedirects: true,
		});
		await removeProjectDomain(ctx, {
			idOrName: 'prj_1',
			domain: 'example.com',
			removeRedirects: false,
		});
		expect(request).toHaveBeenNthCalledWith(
			1,
			'/v9/projects/prj_1/domains/example.com',
			ctx,
			{ method: 'DELETE', teamId: undefined, body: { removeRedirects: true } },
		);
		expect(request.mock.calls[1]?.[2]?.body).toEqual({
			removeRedirects: false,
		});
		await expect(
			removeProjectDomain(ctx, {
				idOrName: 'prj_1',
				domain: 'example.com',
				removeRedirects: 'yes',
			} as unknown as Parameters<typeof removeProjectDomain>[1]),
		).rejects.toThrow();
		expect(request).toHaveBeenCalledTimes(2);
	});

	it('verifyProjectDomain posts to the verify route', async () => {
		const { verification: _v, ...verified } = projectDomain;
		request.mockResolvedValueOnce({ ...verified, verified: true });
		const result = await verifyProjectDomain(ctx, {
			idOrName: 'prj_1',
			domain: 'www.example.com',
		});
		expect(request).toHaveBeenCalledWith(
			'/v9/projects/prj_1/domains/www.example.com/verify',
			ctx,
			{ method: 'POST', teamId: undefined },
		);
		expect(result.verified).toBe(true);
	});

	it('lets a Vercel error through unchanged', async () => {
		const error = Object.assign(new Error('Project Domain not found.'), {
			status: 404,
		});
		request.mockRejectedValueOnce(error);
		await expect(
			getProjectDomain(ctx, { idOrName: 'prj_1', domain: 'nope.com' }),
		).rejects.toBe(error);
		expect(logEvent).not.toHaveBeenCalled();
	});
});
