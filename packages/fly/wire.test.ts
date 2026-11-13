import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { operations } from './endpoints/operations';
import { fly } from './index';

const api = createCorsair({ plugins: [fly({ key: 'FlyV1 test-token' })] }).fly
	.api;
const pageInfo = {
	endCursor: 'next',
	hasNextPage: true,
	hasPreviousPage: false,
	startCursor: null,
};
const connection = { nodes: [], pageInfo, totalCount: 0 };
const org = { id: 'org-id', name: 'Org', slug: 'org', type: 'SHARED' };
const job = {
	id: 'job-id',
	url: 'https://example.com',
	schedule: null,
	nextRunAt: null,
	httpOptions: null,
};
const addOn = {
	id: 'addon-id',
	name: 'cache',
	status: null,
	primaryRegion: null,
	hostname: null,
	publicUrl: null,
	createdAt: '2026-01-01',
	updatedAt: '2026-01-01',
	organization: { id: 'org-id', name: 'Org', slug: 'org' },
};
const thirdParty = {
	id: 'tp-id',
	name: 'auth',
	location: 'https://example.com',
	customLevel: 'REQUIRED',
	flyctlLevel: 'REQUIRED',
	uiexLevel: 'REQUIRED',
	createdAt: '2026-01-01',
	updatedAt: '2026-01-01',
};
const mutationPayload = { clientMutationId: null };

// This table combines different endpoint inputs and outputs; each public call
// remains independently typed and validates its fixture at the endpoint seam.
type Case = {
	path: string;
	args: Record<string, unknown>;
	result: unknown;
	call: () => Promise<unknown>;
};
const cases: Case[] = [
	{
		path: 'apps.list',
		args: { after: 'cursor', first: 2 },
		result: connection,
		call: () => api.apps.list({ after: 'cursor', first: 2 }),
	},
	{
		path: 'apps.get',
		args: { name: 'demo' },
		result: null,
		call: () => api.apps.get({ name: 'demo' }),
	},
	{
		path: 'apps.nameAvailable',
		args: { name: 'demo' },
		result: true,
		call: () => api.apps.nameAvailable({ name: 'demo' }),
	},
	{
		path: 'organizations.list',
		args: {},
		result: connection,
		call: () => api.organizations.list({}),
	},
	{
		path: 'organizations.get',
		args: { slug: 'org' },
		result: org,
		call: () => api.organizations.get({ slug: 'org' }),
	},
	{
		path: 'organizations.personal',
		args: {},
		result: org,
		call: () => api.organizations.personal({}),
	},
	{
		path: 'organizations.delete',
		args: { input: { organizationId: 'org-id' } },
		result: { ...mutationPayload, deletedOrganizationId: 'org-id' },
		call: () =>
			api.organizations.delete({ input: { organizationId: 'org-id' } }),
	},
	{
		path: 'checks.jobs',
		args: {},
		result: connection,
		call: () => api.checks.jobs({}),
	},
	{
		path: 'checks.locations',
		args: {},
		result: [],
		call: () => api.checks.locations({}),
	},
	{
		path: 'checks.createJob',
		args: {
			input: {
				organizationId: 'org-id',
				url: 'https://example.com',
				locations: ['iad'],
				httpOptions: {},
			},
		},
		result: { ...mutationPayload, checkJob: job, checkJobRun: null },
		call: () =>
			api.checks.createJob({
				input: {
					organizationId: 'org-id',
					url: 'https://example.com',
					locations: ['iad'],
					httpOptions: {},
				},
			}),
	},
	{
		path: 'checks.runJob',
		args: { input: { checkJobId: 'job-id' } },
		result: { ...mutationPayload, checkJob: job, checkJobRun: null },
		call: () => api.checks.runJob({ input: { checkJobId: 'job-id' } }),
	},
	{
		path: 'wireguard.listPeers',
		args: { slug: 'org', after: 'cursor' },
		result: { wireGuardPeers: connection },
		call: () => api.wireguard.listPeers({ slug: 'org', after: 'cursor' }),
	},
	{
		path: 'wireguard.getPeer',
		args: { slug: 'org', peerName: 'peer' },
		result: null,
		call: () => api.wireguard.getPeer({ slug: 'org', peerName: 'peer' }),
	},
	{
		path: 'wireguard.listTokens',
		args: { slug: 'org' },
		result: { delegatedWireGuardTokens: connection },
		call: () => api.wireguard.listTokens({ slug: 'org' }),
	},
	{
		path: 'wireguard.addPeer',
		args: { input: { name: 'peer', organizationId: 'org-id', pubkey: 'key' } },
		result: {
			...mutationPayload,
			endpointip: '1.2.3.4',
			network: null,
			peerip: '::1',
			pubkey: 'key',
		},
		call: () =>
			api.wireguard.addPeer({
				input: { name: 'peer', organizationId: 'org-id', pubkey: 'key' },
			}),
	},
	{
		path: 'wireguard.removePeer',
		args: { input: { name: 'peer', organizationId: 'org-id' } },
		result: { ...mutationPayload, organization: org },
		call: () =>
			api.wireguard.removePeer({
				input: { name: 'peer', organizationId: 'org-id' },
			}),
	},
	{
		path: 'wireguard.validatePeers',
		args: { input: { peerIps: ['::1'] } },
		result: { ...mutationPayload, invalidPeerIps: [], validPeerIps: ['::1'] },
		call: () => api.wireguard.validatePeers({ input: { peerIps: ['::1'] } }),
	},
	{
		path: 'wireguard.createToken',
		args: { input: { organizationId: 'org-id' } },
		result: { ...mutationPayload, token: 'secret' },
		call: () =>
			api.wireguard.createToken({ input: { organizationId: 'org-id' } }),
	},
	{
		path: 'wireguard.deleteToken',
		args: { input: { organizationId: 'org-id', name: 'token' } },
		result: { ...mutationPayload, token: 'secret' },
		call: () =>
			api.wireguard.deleteToken({
				input: { organizationId: 'org-id', name: 'token' },
			}),
	},
	{
		path: 'addOns.list',
		args: {},
		result: connection,
		call: () => api.addOns.list({}),
	},
	{
		path: 'addOns.get',
		args: { id: 'addon-id' },
		result: addOn,
		call: () => api.addOns.get({ id: 'addon-id' }),
	},
	{
		path: 'addOns.plans',
		args: {},
		result: connection,
		call: () => api.addOns.plans({}),
	},
	{
		path: 'addOns.provider',
		args: { name: 'redis' },
		result: {
			id: 'p',
			name: 'redis',
			displayName: null,
			resourceName: 'redis',
			beta: false,
			internal: false,
		},
		call: () => api.addOns.provider({ name: 'redis' }),
	},
	{
		path: 'addOns.create',
		args: { input: { type: 'redis' } },
		result: { ...mutationPayload, addOn },
		call: () => api.addOns.create({ input: { type: 'redis' } }),
	},
	{
		path: 'addOns.update',
		args: { input: { addOnId: 'addon-id' } },
		result: { ...mutationPayload, addOn },
		call: () => api.addOns.update({ input: { addOnId: 'addon-id' } }),
	},
	{
		path: 'addOns.delete',
		args: { input: { addOnId: 'addon-id' } },
		result: { ...mutationPayload, deletedAddOnName: 'cache' },
		call: () => api.addOns.delete({ input: { addOnId: 'addon-id' } }),
	},
	{
		path: 'addOns.resetPassword',
		args: { input: { name: 'cache' } },
		result: { ...mutationPayload, addOn },
		call: () => api.addOns.resetPassword({ input: { name: 'cache' } }),
	},
	{
		path: 'thirdParty.list',
		args: { slug: 'org' },
		result: { thirdPartyConfigurations: connection },
		call: () => api.thirdParty.list({ slug: 'org' }),
	},
	{
		path: 'thirdParty.create',
		args: {
			input: {
				organizationId: 'org-id',
				name: 'auth',
				location: 'https://example.com',
				customLevel: 'REQUIRED',
				flyctlLevel: 'REQUIRED',
				uiexLevel: 'REQUIRED',
			},
		},
		result: { ...mutationPayload, thirdPartyConfiguration: thirdParty },
		call: () =>
			api.thirdParty.create({
				input: {
					organizationId: 'org-id',
					name: 'auth',
					location: 'https://example.com',
					customLevel: 'REQUIRED',
					flyctlLevel: 'REQUIRED',
					uiexLevel: 'REQUIRED',
				},
			}),
	},
	{
		path: 'thirdParty.update',
		args: { input: { thirdPartyConfigurationId: 'tp-id' } },
		result: { ...mutationPayload, thirdPartyConfiguration: thirdParty },
		call: () =>
			api.thirdParty.update({ input: { thirdPartyConfigurationId: 'tp-id' } }),
	},
	{
		path: 'thirdParty.delete',
		args: { input: { thirdPartyConfigurationId: 'tp-id' } },
		result: { ...mutationPayload, ok: true },
		call: () =>
			api.thirdParty.delete({ input: { thirdPartyConfigurationId: 'tp-id' } }),
	},
	{
		path: 'account.userOnlyToken',
		args: {},
		result: false,
		call: () => api.account.userOnlyToken({}),
	},
	{
		path: 'account.viewer',
		args: {},
		result: { avatarUrl: '', email: 'a@example.com', name: null },
		call: () => api.account.viewer({}),
	},
	{
		path: 'platform.nearestRegion',
		args: { wireguardGateway: true },
		result: {
			code: 'iad',
			name: 'Ashburn',
			latitude: null,
			longitude: null,
			gatewayAvailable: true,
		},
		call: () => api.platform.nearestRegion({ wireguardGateway: true }),
	},
];

describe('Fly GraphQL public request seam', () => {
	afterEach(() => jest.restoreAllMocks());
	it.each(cases)(
		'$path forwards variables and validates the result',
		async ({ path, args, result, call }) => {
			const [group, name] = path.split('.');
			if (!group || !name) throw new Error(`Invalid operation path: ${path}`);
			const groupDefinitions: Record<string, { field: string; query: string }> =
				operations[group as keyof typeof operations];
			const definition = groupDefinitions[name];
			if (!definition) throw new Error(`Missing operation: ${path}`);
			const fetchMock = jest
				.spyOn(global, 'fetch')
				.mockResolvedValue(
					new Response(
						JSON.stringify({ data: { [definition.field]: result } }),
						{ status: 200, headers: { 'content-type': 'application/json' } },
					),
				);
			await expect(call()).resolves.toEqual(result);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const callArgs = fetchMock.mock.calls[0];
			if (!callArgs) throw new Error('Expected a fetch call');
			const [url, request] = callArgs;
			expect(String(url)).toBe('https://api.fly.io/graphql');
			expect(request?.method).toBe('POST');
			expect(new Headers(request?.headers).get('authorization')).toBe(
				'Bearer FlyV1 test-token',
			);
			expect(JSON.parse(String(request?.body))).toEqual({
				query: definition.query,
				variables: args,
			});
		},
	);
	it('rejects invalid input before sending a request', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		await expect(api.apps.nameAvailable({ name: '' })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('rejects malformed provider results', async () => {
		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ data: { userOnlyToken: 'false' } }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(api.account.userOnlyToken({})).rejects.toThrow();
	});
	it('reports GraphQL errors even when HTTP succeeds', async () => {
		jest
			.spyOn(global, 'fetch')
			.mockResolvedValue(
				new Response(
					JSON.stringify({ errors: [{ message: 'permission denied' }] }),
					{ status: 200, headers: { 'content-type': 'application/json' } },
				),
			);
		await expect(api.account.userOnlyToken({})).rejects.toThrow(
			'permission denied',
		);
	});
	it('does not send a request without credentials', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		const unauthenticated = createCorsair({ plugins: [fly()] }).fly.api;
		await expect(unauthenticated.account.userOnlyToken({})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('does not retry a rate-limited mutation and preserves Retry-After', async () => {
		const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '2' },
			}),
		);
		const promise = api.organizations.delete({
			input: { organizationId: 'org-id' },
		});
		await expect(promise).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
		});
		await expect(promise).rejects.toBeInstanceOf(ApiError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
