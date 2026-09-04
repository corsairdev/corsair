import { makeBunnycdnRequest } from './client';
import {
	ApiKeysEndpoints as ApiKeysRaw,
	BillingEndpoints as BillingRaw,
	ContainersEndpoints as ContainersRaw,
	DnsZoneEndpoints as DnsZoneRaw,
	EdgeScriptsEndpoints as EdgeScriptsRaw,
	PullZoneEndpoints as PullZoneRaw,
	PurgeEndpoints as PurgeRaw,
	SearchEndpoints as SearchRaw,
	ShieldEndpoints as ShieldRaw,
	StatisticsEndpoints as StatisticsRaw,
	StorageZoneEndpoints as StorageZoneRaw,
	StreamEndpoints as StreamRaw,
	UserEndpoints as UserRaw,
	VideoLibraryEndpoints as VideoLibraryRaw,
} from './endpoints';
import {
	BunnycdnEndpointInputSchemas,
	BunnycdnEndpointOutputSchemas,
} from './endpoints/types';
import type { BunnycdnContext } from './index';
import { bunnycdn } from './index';

jest.mock('./client', () => ({
	makeBunnycdnRequest: jest.fn(),
}));

const mockedRequest = makeBunnycdnRequest as jest.Mock;

const ctx = {
	keys: { get_api_key: async () => 'test-key' },
	options: {},
} as unknown as BunnycdnContext;

beforeEach(() => {
	mockedRequest.mockReset();
	mockedRequest.mockImplementation(async () => ({}));
});

// Records every operation invoked through the suite so the coverage sweep at
// the bottom can assert the exercised set is exactly the registered set.
const exercised = new Set<string>();

type EndpointFn = (...args: never[]) => Promise<unknown>;

function track<T extends Record<string, EndpointFn>>(
	group: string,
	endpoints: T,
): T {
	return new Proxy(endpoints, {
		get(target, prop) {
			const fn = Reflect.get(target, prop);
			if (typeof fn !== 'function' || typeof prop !== 'string') {
				return fn;
			}
			return (...args: never[]) => {
				exercised.add(`${group}.${prop}`);
				return (fn as EndpointFn)(...args);
			};
		},
	}) as T;
}

const PullZoneEndpoints = track('pullZone', PullZoneRaw);
const DnsZoneEndpoints = track('dnsZone', DnsZoneRaw);
const StorageZoneEndpoints = track('storageZone', StorageZoneRaw);
const PurgeEndpoints = track('purge', PurgeRaw);
const ShieldEndpoints = track('shield', ShieldRaw);
const ContainersEndpoints = track('containers', ContainersRaw);
const BillingEndpoints = track('billing', BillingRaw);
const SearchEndpoints = track('search', SearchRaw);
const UserEndpoints = track('user', UserRaw);
const StreamEndpoints = track('stream', StreamRaw);
const EdgeScriptsEndpoints = track('edgeScripts', EdgeScriptsRaw);
const VideoLibraryEndpoints = track('videoLibrary', VideoLibraryRaw);
const StatisticsEndpoints = track('statistics', StatisticsRaw);
const ApiKeysEndpoints = track('apiKeys', ApiKeysRaw);

describe('pullZone', () => {
	it('list: lists pull zones with pagination query params', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Name: 'a' }]);
		const result = await PullZoneEndpoints.list(ctx, {
			page: 1,
			perPage: 20,
			search: 'cdn',
		});
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest).toHaveBeenCalledWith('/pullzone', 'test-key', {
			method: 'GET',
			query: {
				page: 1,
				perPage: 20,
				search: 'cdn',
				includeCertificate: undefined,
			},
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.pullZoneList.parse(result)).toEqual([
			{ Id: 1, Name: 'a' },
		]);
	});

	it('get: gets a pull zone by id', async () => {
		mockedRequest.mockResolvedValue({ Id: 123, Name: 'demo' });
		const result = await PullZoneEndpoints.get(ctx, { id: 123 });
		expect(mockedRequest).toHaveBeenCalledWith('/pullzone/123', 'test-key', {
			method: 'GET',
			query: { includeCertificate: undefined },
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.pullZoneGet.parse(result)).toEqual({
			Id: 123,
			Name: 'demo',
		});
	});

	it('create: creates a pull zone with PascalCase body fields', async () => {
		mockedRequest.mockResolvedValue({ Id: 1, Name: 'my-zone' });
		const result = await PullZoneEndpoints.create(ctx, {
			name: 'my-zone',
			originUrl: 'https://origin.example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/pullzone', 'test-key', {
			method: 'POST',
			query: undefined,
			body: {
				Name: 'my-zone',
				OriginUrl: 'https://origin.example.com',
				Type: undefined,
			},
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.pullZoneCreate.parse(result)).toEqual({
			Id: 1,
			Name: 'my-zone',
		});
	});

	it('update: updates a pull zone by id', async () => {
		mockedRequest.mockResolvedValue({ Id: 1, Name: 'my-zone' });
		const result = await PullZoneEndpoints.update(ctx, {
			id: 1,
			settings: { OriginUrl: 'https://new.example.com' },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/pullzone/1', 'test-key', {
			method: 'POST',
			query: undefined,
			body: { OriginUrl: 'https://new.example.com' },
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.pullZoneUpdate.parse(result)).toEqual({
			Id: 1,
			Name: 'my-zone',
		});
	});

	it('remove: deletes a pull zone and returns success', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await PullZoneEndpoints.remove(ctx, { id: 1 });
		expect(mockedRequest).toHaveBeenCalledWith('/pullzone/1', 'test-key', {
			method: 'DELETE',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(result).toEqual({ success: true });
	});

	it('purgeCache: purges a pull zone cache with a cache tag', async () => {
		const result = await PullZoneEndpoints.purgeCache(ctx, {
			id: 7,
			cacheTag: 'product-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/7/purgeCache',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { CacheTag: 'product-1' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('purgeCache: purges a full pull zone cache without a tag using an empty body', async () => {
		const result = await PullZoneEndpoints.purgeCache(ctx, { id: 7 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/7/purgeCache',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: {},
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('checkAvailability: checks pull zone name availability', async () => {
		mockedRequest.mockResolvedValue({ Available: true });
		const result = await PullZoneEndpoints.checkAvailability(ctx, {
			name: 'my-zone',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/checkavailability',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Name: 'my-zone' },
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.pullZoneAvailability.parse(result),
		).toEqual({ Available: true });
	});

	it('addAllowedReferrer: adds a hostname to the allowed referer list', async () => {
		const result = await PullZoneEndpoints.addAllowedReferrer(ctx, {
			id: 1,
			hostname: 'example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/addAllowedReferrer',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Hostname: 'example.com' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('removeAllowedReferrer: removes a hostname from the allowed referer list', async () => {
		const result = await PullZoneEndpoints.removeAllowedReferrer(ctx, {
			id: 1,
			hostname: 'example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/removeAllowedReferrer',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Hostname: 'example.com' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('addBlockedIp: adds an IP to the blocked list', async () => {
		const result = await PullZoneEndpoints.addBlockedIp(ctx, {
			id: 1,
			blockedIp: '1.2.3.4',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/addBlockedIp',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { BlockedIp: '1.2.3.4' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('removeBlockedIp: removes an IP from the blocked list', async () => {
		const result = await PullZoneEndpoints.removeBlockedIp(ctx, {
			id: 1,
			blockedIp: '1.2.3.4',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/removeBlockedIp',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { BlockedIp: '1.2.3.4' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('addBlockedReferrer: adds a blocked referer to a pull zone', async () => {
		const result = await PullZoneEndpoints.addBlockedReferrer(ctx, {
			id: 1,
			hostname: 'spam.example',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/addBlockedReferrer',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Hostname: 'spam.example' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('removeBlockedReferrer: removes a blocked referer from a pull zone', async () => {
		const result = await PullZoneEndpoints.removeBlockedReferrer(ctx, {
			id: 1,
			hostname: 'spam.example',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/removeBlockedReferrer',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Hostname: 'spam.example' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('resetSecurityKey: resets the pull zone security key', async () => {
		const result = await PullZoneEndpoints.resetSecurityKey(ctx, { id: 1 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/resetSecurityKey',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: {},
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('resetSecurityKey: resets the pull zone security key to a custom value', async () => {
		const result = await PullZoneEndpoints.resetSecurityKey(ctx, {
			id: 1,
			securityKey: 'custom-key',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/resetSecurityKey',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { SecurityKey: 'custom-key' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('setForceSSL: enables Force SSL on a pull zone hostname', async () => {
		const result = await PullZoneEndpoints.setForceSSL(ctx, {
			id: 1,
			hostname: 'cdn.example.com',
			forceSSL: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/setForceSSL',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Hostname: 'cdn.example.com', ForceSSL: true },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('edgeRuleUpsert: adds or updates an edge rule on a pull zone', async () => {
		mockedRequest.mockResolvedValue({ Guid: 'rule-1', Enabled: true });
		const result = await PullZoneEndpoints.edgeRuleUpsert(ctx, {
			pullZoneId: 1,
			rule: { Description: 'force ssl', Enabled: true },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/edgerules/addOrUpdate',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Description: 'force ssl', Enabled: true },
				base: 'core',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.edgeRuleUpsert.parse(result)).toEqual({
			Guid: 'rule-1',
			Enabled: true,
		});
	});

	it('edgeRuleDelete: deletes an edge rule from a pull zone', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await PullZoneEndpoints.edgeRuleDelete(ctx, {
			pullZoneId: 1,
			edgeRuleId: 'abc',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/edgerules/abc',
			'test-key',
			{
				method: 'DELETE',
				query: undefined,
				body: undefined,
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('edgeRuleSetEnabled: enables or disables an edge rule', async () => {
		const result = await PullZoneEndpoints.edgeRuleSetEnabled(ctx, {
			pullZoneId: 1,
			edgeRuleId: 'abc',
			value: false,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/edgerules/abc/setEdgeRuleEnabled',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Value: false },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('optimizerStatistics: reads optimizer statistics for a pull zone', async () => {
		const result = await PullZoneEndpoints.optimizerStatistics(ctx, {
			pullZoneId: 1,
			dateFrom: '2026-08-01',
			dateTo: '2026-09-01',
			hourly: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/optimizer/statistics',
			'test-key',
			{
				method: 'GET',
				query: { dateFrom: '2026-08-01', dateTo: '2026-09-01', hourly: true },
				body: undefined,
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.pullZoneDateRange.parse(result),
		).toEqual({});
	});

	it('originShieldQueueStatistics: reads origin shield queue statistics', async () => {
		const result = await PullZoneEndpoints.originShieldQueueStatistics(ctx, {
			pullZoneId: 1,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/originshield/queuestatistics',
			'test-key',
			{
				method: 'GET',
				query: { dateFrom: undefined, dateTo: undefined, hourly: undefined },
				body: undefined,
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.pullZoneDateRange.parse(result),
		).toEqual({});
	});

	it('safeHopStatistics: reads SafeHop statistics for a pull zone', async () => {
		const result = await PullZoneEndpoints.safeHopStatistics(ctx, {
			pullZoneId: 1,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/pullzone/1/safehop/statistics',
			'test-key',
			{
				method: 'GET',
				query: { dateFrom: undefined, dateTo: undefined, hourly: undefined },
				body: undefined,
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.pullZoneDateRange.parse(result),
		).toEqual({});
	});
});

describe('purge', () => {
	it('url: purges a single URL via query params', async () => {
		await PurgeEndpoints.url(ctx, { url: 'https://cdn.example.com/app.js' });
		expect(mockedRequest).toHaveBeenCalledWith('/purge', 'test-key', {
			method: 'POST',
			query: {
				url: 'https://cdn.example.com/app.js',
				async: undefined,
				exactPath: undefined,
			},
			body: undefined,
			base: 'core',
		});
	});

	it('url: purges a URL asynchronously with an exact path', async () => {
		await PurgeEndpoints.url(ctx, {
			url: 'https://cdn.example.com/app/',
			async: true,
			exactPath: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/purge', 'test-key', {
			method: 'POST',
			query: {
				url: 'https://cdn.example.com/app/',
				async: true,
				exactPath: true,
			},
			body: undefined,
			base: 'core',
		});
	});
});

describe('storageZone', () => {
	it('list: lists storage zones with search', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Name: 'assets' }]);
		const result = await StorageZoneEndpoints.list(ctx, { search: 'assets' });
		expect(mockedRequest).toHaveBeenCalledWith('/storagezone', 'test-key', {
			method: 'GET',
			query: {
				page: undefined,
				perPage: undefined,
				includeDeleted: undefined,
				search: 'assets',
			},
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.storageZoneList.parse(result)).toEqual(
			[{ Id: 1, Name: 'assets' }],
		);
	});

	it('get: gets a storage zone by id', async () => {
		mockedRequest.mockResolvedValue({ Id: 2, Name: 'assets' });
		const result = await StorageZoneEndpoints.get(ctx, { id: 2 });
		expect(mockedRequest).toHaveBeenCalledWith('/storagezone/2', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.storageZoneGet.parse(result)).toEqual({
			Id: 2,
			Name: 'assets',
		});
	});

	it('create: creates a storage zone with required fields', async () => {
		mockedRequest.mockResolvedValue({ Id: 2, Name: 'assets', Region: 'de' });
		const result = await StorageZoneEndpoints.create(ctx, {
			name: 'assets',
			region: 'de',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/storagezone', 'test-key', {
			method: 'POST',
			query: undefined,
			body: { Name: 'assets', Region: 'de' },
			base: 'core',
		});
		expect(
			BunnycdnEndpointOutputSchemas.storageZoneCreate.parse(result),
		).toEqual({
			Id: 2,
			Name: 'assets',
			Region: 'de',
		});
	});

	it('update: updates storage zone settings', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await StorageZoneEndpoints.update(ctx, {
			id: 2,
			settings: { OriginUrl: 'https://origin.example.com' },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/storagezone/2', 'test-key', {
			method: 'POST',
			query: undefined,
			body: { OriginUrl: 'https://origin.example.com' },
			base: 'core',
		});
		expect(result).toEqual({ success: true });
	});

	it('remove: deletes a storage zone', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await StorageZoneEndpoints.remove(ctx, {
			id: 2,
			deleteLinkedPullZones: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/storagezone/2', 'test-key', {
			method: 'DELETE',
			query: { deleteLinkedPullZones: true },
			body: undefined,
			base: 'core',
		});
		expect(result).toEqual({ success: true });
	});

	it('checkAvailability: checks storage zone name availability', async () => {
		mockedRequest.mockResolvedValue({ Available: true });
		const result = await StorageZoneEndpoints.checkAvailability(ctx, {
			name: 'assets',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/storagezone/checkavailability',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Name: 'assets' },
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.storageZoneAvailability.parse(result),
		).toEqual({ Available: true });
	});
});

describe('dnsZone', () => {
	it('list: lists DNS zones with search', async () => {
		mockedRequest.mockResolvedValue([{ Id: 3, Domain: 'example.com' }]);
		const result = await DnsZoneEndpoints.list(ctx, { search: 'example' });
		expect(mockedRequest).toHaveBeenCalledWith('/dnszone', 'test-key', {
			method: 'GET',
			query: { page: undefined, perPage: undefined, search: 'example' },
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.dnsZoneList.parse(result)).toEqual([
			{ Id: 3, Domain: 'example.com' },
		]);
	});

	it('get: gets a DNS zone by id', async () => {
		mockedRequest.mockResolvedValue({ Id: 3, Domain: 'example.com' });
		const result = await DnsZoneEndpoints.get(ctx, { id: 3 });
		expect(mockedRequest).toHaveBeenCalledWith('/dnszone/3', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.dnsZoneGet.parse(result)).toEqual({
			Id: 3,
			Domain: 'example.com',
		});
	});

	it('createRecord: creates a DNS record in a zone', async () => {
		mockedRequest.mockResolvedValue({ Id: 9, Type: 1 });
		const result = await DnsZoneEndpoints.createRecord(ctx, {
			zoneId: 3,
			record: { Type: 1, Name: 'www', Value: '1.2.3.4' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dnszone/3/records',
			'test-key',
			{
				method: 'PUT',
				query: undefined,
				body: { Type: 1, Name: 'www', Value: '1.2.3.4' },
				base: 'core',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.dnsRecordCreate.parse(result)).toEqual(
			{
				Id: 9,
				Type: 1,
			},
		);
	});

	it('updateRecord: updates a DNS record', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await DnsZoneEndpoints.updateRecord(ctx, {
			zoneId: 3,
			id: 9,
			record: { Value: '5.6.7.8' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dnszone/3/records/9',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Value: '5.6.7.8' },
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('deleteRecord: deletes a DNS record', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await DnsZoneEndpoints.deleteRecord(ctx, {
			zoneId: 3,
			id: 9,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dnszone/3/records/9',
			'test-key',
			{
				method: 'DELETE',
				query: undefined,
				body: undefined,
				base: 'core',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('checkAvailability: checks DNS zone name availability', async () => {
		mockedRequest.mockResolvedValue({ Available: true });
		const result = await DnsZoneEndpoints.checkAvailability(ctx, {
			name: 'example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/dnszone/checkavailability',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { Name: 'example.com' },
				base: 'core',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.dnsZoneAvailability.parse(result),
		).toEqual({ Available: true });
	});
});

describe('billing', () => {
	it('summary: reads the billing summary as a per-zone array', async () => {
		mockedRequest.mockResolvedValue([
			{ PullZoneId: 1, MonthlyUsage: 0, MonthlyBandwidthUsed: 0 },
		]);
		const result = await BillingEndpoints.summary(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/billing/summary', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.billingSummary.parse(result)).toEqual([
			{ PullZoneId: 1, MonthlyUsage: 0, MonthlyBandwidthUsed: 0 },
		]);
	});
});

describe('statistics', () => {
	it('get: reads CDN statistics for a pull zone', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await StatisticsEndpoints.get(ctx, {
			pullZone: 1,
			hourly: true,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/statistics', 'test-key', {
			method: 'GET',
			query: expect.objectContaining({ pullZone: 1, hourly: true }),
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.statistics.parse(result)).toEqual({});
	});

	it('countries: lists supported countries', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Name: 'Germany' }]);
		const result = await StatisticsEndpoints.countries(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/country', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.countryList.parse(result)).toEqual([
			{ Id: 1, Name: 'Germany' },
		]);
	});

	it('regions: lists regions with pricing info', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Name: 'EU' }]);
		const result = await StatisticsEndpoints.regions(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/region', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.regionList.parse(result)).toEqual([
			{ Id: 1, Name: 'EU' },
		]);
	});
});

describe('search', () => {
	it('global: searches across pull zones, storage zones and more', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await SearchEndpoints.global(ctx, {
			search: 'cdn',
			from: 0,
			size: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/search', 'test-key', {
			method: 'GET',
			query: { search: 'cdn', from: 0, size: 5 },
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.globalSearch.parse(result)).toEqual(
			{},
		);
	});
});

describe('apiKeys', () => {
	it('list: lists API keys with pagination', async () => {
		mockedRequest.mockResolvedValue([{ Id: 'key-1' }]);
		const result = await ApiKeysEndpoints.list(ctx, { page: 1, perPage: 5 });
		expect(mockedRequest).toHaveBeenCalledWith('/apikey', 'test-key', {
			method: 'GET',
			query: { page: 1, perPage: 5 },
			body: undefined,
			base: 'core',
		});
		expect(BunnycdnEndpointOutputSchemas.apiKeysList.parse(result)).toEqual([
			{ Id: 'key-1' },
		]);
	});
});

describe('user', () => {
	it('auditLog: reads the user audit log for a date', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await UserEndpoints.auditLog(ctx, {
			date: '2026-09-01',
			limit: 50,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/user/audit/2026-09-01',
			'test-key',
			{
				method: 'GET',
				query: expect.objectContaining({ Limit: 50 }),
				body: undefined,
				base: 'core',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.userAuditLog.parse(result)).toEqual(
			{},
		);
	});
});

describe('videoLibrary', () => {
	it('list: lists video libraries', async () => {
		mockedRequest.mockResolvedValue([{ Id: 1, Name: 'lib' }]);
		const result = await VideoLibraryEndpoints.list(ctx, { perPage: 5 });
		expect(mockedRequest).toHaveBeenCalledWith('/videolibrary', 'test-key', {
			method: 'GET',
			query: { page: undefined, perPage: 5, search: undefined },
			body: undefined,
			base: 'core',
		});
		expect(
			BunnycdnEndpointOutputSchemas.videoLibrariesList.parse(result),
		).toEqual([{ Id: 1, Name: 'lib' }]);
	});

	it('languages: lists languages supported by video libraries', async () => {
		mockedRequest.mockResolvedValue(['en', 'de']);
		const result = await VideoLibraryEndpoints.languages(ctx);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/videolibrary/languages',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'core',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.languages.parse(result)).toEqual([
			'en',
			'de',
		]);
	});
});

describe('edgeScripts', () => {
	it('list: lists edge scripts with search', async () => {
		mockedRequest.mockResolvedValue([{}]);
		const result = await EdgeScriptsEndpoints.list(ctx, { search: 'auth' });
		expect(mockedRequest).toHaveBeenCalledWith('/script', 'test-key', {
			method: 'GET',
			query: expect.objectContaining({ search: 'auth' }),
			body: undefined,
			base: 'compute',
		});
		expect(BunnycdnEndpointOutputSchemas.edgeScriptsList.parse(result)).toEqual(
			[{}],
		);
	});
});

describe('stream', () => {
	it('oembed: reads oEmbed metadata for a video embed', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await StreamEndpoints.oembed(ctx, {
			url: 'https://iframe.mediadelivery.net/embed/1/2',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/OEmbed', 'test-key', {
			method: 'GET',
			query: expect.objectContaining({
				url: 'https://iframe.mediadelivery.net/embed/1/2',
			}),
			body: undefined,
			base: 'stream',
		});
		expect(BunnycdnEndpointOutputSchemas.oembed.parse(result)).toEqual({});
	});
});

describe('shield', () => {
	it('zonesList: lists shield zones with pagination', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.zonesList(ctx, {
			page: 2,
			perPage: 10,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/shield-zones', 'test-key', {
			method: 'GET',
			query: { page: 2, perPage: 10 },
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.shieldPage.parse(result)).toEqual({});
	});

	it('zoneGet: gets a shield zone configuration by id', async () => {
		mockedRequest.mockResolvedValue({ shieldZoneId: 5, pullZoneId: 7 });
		const result = await ShieldEndpoints.zoneGet(ctx, { shieldZoneId: 5 });
		expect(mockedRequest).toHaveBeenCalledWith('/shield-zone/5', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.shieldZoneId.parse(result)).toEqual({
			shieldZoneId: 5,
			pullZoneId: 7,
		});
	});

	it('zoneGetByPullZone: gets the shield zone for a pull zone', async () => {
		mockedRequest.mockResolvedValue({ shieldZoneId: 5, pullZoneId: 7 });
		const result = await ShieldEndpoints.zoneGetByPullZone(ctx, {
			pullZoneId: 7,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/get-by-pullzone/7',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldZoneByPullZone.parse(result),
		).toEqual({
			shieldZoneId: 5,
			pullZoneId: 7,
		});
	});

	it('zonesPullZoneMapping: reads the shield zone to pull zone mapping', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.zonesPullZoneMapping(ctx);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zones/pullzone-mapping',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('zoneUpdate: updates a shield zone configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.zoneUpdate(ctx, { shieldZoneId: 5 });
		expect(mockedRequest).toHaveBeenCalledWith('/shield-zone', 'test-key', {
			method: 'PATCH',
			query: undefined,
			body: { shieldZoneId: 5 },
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldZoneUpdate.parse(result),
		).toEqual({});
	});

	it('rateLimitsList: lists rate limit rules for a shield zone', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.rateLimitsList(ctx, {
			shieldZoneId: 5,
			page: 1,
			perPage: 10,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/rate-limits/5', 'test-key', {
			method: 'GET',
			query: { page: 1, perPage: 10 },
			body: undefined,
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldRateLimitsList.parse(result),
		).toEqual({});
	});

	it('rateLimitGet: gets a shield rate limit rule by id', async () => {
		mockedRequest.mockResolvedValue({ id: 9, ruleName: 'api-guard' });
		const result = await ShieldEndpoints.rateLimitGet(ctx, { id: 9 });
		expect(mockedRequest).toHaveBeenCalledWith('/rate-limit/9', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldRateLimitId.parse(result),
		).toEqual({
			id: 9,
			ruleName: 'api-guard',
		});
	});

	it('rateLimitCreate: creates a shield rate limit rule', async () => {
		mockedRequest.mockResolvedValue({ id: 9, ruleName: 'api-guard' });
		const result = await ShieldEndpoints.rateLimitCreate(ctx, {
			shieldZoneId: 5,
			ruleName: 'api-guard',
			ruleConfiguration: { requestCount: 100 },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/rate-limit', 'test-key', {
			method: 'POST',
			query: undefined,
			body: {
				shieldZoneId: 5,
				ruleName: 'api-guard',
				ruleDescription: undefined,
				ruleConfiguration: { requestCount: 100 },
			},
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldRateLimitCreate.parse(result),
		).toEqual({
			id: 9,
			ruleName: 'api-guard',
		});
	});

	it('rateLimitUpdate: updates a shield rate limit rule', async () => {
		mockedRequest.mockResolvedValue({ id: 9, ruleName: 'renamed' });
		const result = await ShieldEndpoints.rateLimitUpdate(ctx, {
			id: 9,
			ruleName: 'renamed',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/rate-limit/9', 'test-key', {
			method: 'PATCH',
			query: undefined,
			body: {
				ruleName: 'renamed',
				ruleDescription: undefined,
				ruleConfiguration: {},
			},
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldRateLimitUpdate.parse(result),
		).toEqual({
			id: 9,
			ruleName: 'renamed',
		});
	});

	it('rateLimitDelete: deletes a shield rate limit rule', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await ShieldEndpoints.rateLimitDelete(ctx, { id: 9 });
		expect(mockedRequest).toHaveBeenCalledWith('/rate-limit/9', 'test-key', {
			method: 'DELETE',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(result).toEqual({ success: true });
	});

	it('metricsOverview: reads the security metrics overview', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsOverview(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/overview/5',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsOverviewDetailed: reads detailed metrics over a time range', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsOverviewDetailed(ctx, {
			shieldZoneId: 5,
			startDate: '2026-08-01T00:00:00Z',
			endDate: '2026-09-01T00:00:00Z',
			resolution: 'daily',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/overview/5/detailed',
			'test-key',
			{
				method: 'GET',
				query: {
					StartDate: '2026-08-01T00:00:00Z',
					EndDate: '2026-09-01T00:00:00Z',
					Resolution: 'daily',
				},
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsRateLimit: reads metrics for a specific rate limit', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsRateLimit(ctx, { id: 9 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/rate-limit/9',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsRateLimits: reads aggregated rate limit metrics', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsRateLimits(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/rate-limits/5',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsBotDetection: reads bot detection metrics', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsBotDetection(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/shield-zone/5/bot-detection',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsUploadScanning: reads upload scanning metrics', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsUploadScanning(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/shield-zone/5/upload-scanning',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('metricsWafRule: reads metrics for a specific WAF rule', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.metricsWafRule(ctx, {
			shieldZoneId: 5,
			ruleId: 'rule-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/metrics/shield-zone/5/waf-rule/rule-1',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafRuleMetrics.parse(result),
		).toEqual({});
	});

	it('eventLogs: fetches event logs with date and continuation token', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.eventLogs(ctx, {
			shieldZoneId: 5,
			date: '2026-09-01',
			continuationToken: 'tok_123',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/event-logs/5/2026-09-01/tok_123',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.shieldEventLogs.parse(result)).toEqual(
			{},
		);
	});

	it('promoState: reads the shield promotional state', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.promoState(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/promo/state', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.shieldPage.parse(result)).toEqual({});
	});

	it('ddosEnums: lists available DDoS configuration values', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.ddosEnums(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/ddos/enums', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.shieldPage.parse(result)).toEqual({});
	});

	it('botDetectionGet: reads the bot detection configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.botDetectionGet(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/bot-detection',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('botDetectionUpdate: updates the bot detection configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.botDetectionUpdate(ctx, {
			shieldZoneId: 5,
			executionMode: 1,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/bot-detection',
			'test-key',
			{
				method: 'PATCH',
				query: undefined,
				body: { shieldZoneId: 5, executionMode: 1 },
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldBotDetectionUpdate.parse(result),
		).toEqual({});
	});

	it('uploadScanningGet: reads the upload scanning configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.uploadScanningGet(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/upload-scanning',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('uploadScanningUpdate: updates the upload scanning configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.uploadScanningUpdate(ctx, {
			shieldZoneId: 5,
			isEnabled: true,
			csamScanningMode: 2,
			antivirusScanningMode: 2,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/upload-scanning',
			'test-key',
			{
				method: 'PATCH',
				query: undefined,
				body: {
					shieldZoneId: 5,
					isEnabled: true,
					csamScanningMode: 2,
					antivirusScanningMode: 2,
				},
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldUploadScanningUpdate.parse(result),
		).toEqual({});
	});

	it('accessListsList: lists access lists for a shield zone', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.accessListsList(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('accessListGet: gets a custom access list by id', async () => {
		mockedRequest.mockResolvedValue({ id: 3, name: 'blocklist' });
		const result = await ShieldEndpoints.accessListGet(ctx, {
			shieldZoneId: 5,
			id: 3,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists/3',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldAccessListId.parse(result),
		).toEqual({
			id: 3,
			name: 'blocklist',
		});
	});

	it('accessListCreate: creates a custom access list', async () => {
		mockedRequest.mockResolvedValue({ id: 3, name: 'blocklist' });
		const result = await ShieldEndpoints.accessListCreate(ctx, {
			shieldZoneId: 5,
			name: 'blocklist',
			type: 2,
			content: '1.2.3.4',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: {
					name: 'blocklist',
					type: 2,
					content: '1.2.3.4',
					description: undefined,
					checksum: undefined,
				},
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldAccessListCreate.parse(result),
		).toEqual({
			id: 3,
			name: 'blocklist',
		});
	});

	it('accessListUpdate: updates a custom access list', async () => {
		mockedRequest.mockResolvedValue({ id: 3, name: 'blocklist-v2' });
		const result = await ShieldEndpoints.accessListUpdate(ctx, {
			shieldZoneId: 5,
			id: 3,
			name: 'blocklist-v2',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists/3',
			'test-key',
			{
				method: 'PATCH',
				query: undefined,
				body: { name: 'blocklist-v2', content: undefined, checksum: undefined },
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldAccessListUpdate.parse(result),
		).toEqual({
			id: 3,
			name: 'blocklist-v2',
		});
	});

	it('accessListConfigUpdate: updates an access list configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.accessListConfigUpdate(ctx, {
			shieldZoneId: 5,
			id: 4,
			isEnabled: true,
			action: 2,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists/configurations/4',
			'test-key',
			{
				method: 'PATCH',
				query: undefined,
				body: { isEnabled: true, action: 2 },
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldAccessListConfigUpdate.parse(result),
		).toEqual({});
	});

	it('accessListEnums: lists available access list values', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.accessListEnums(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/shield-zone/5/access-lists/enums',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldMetricsDetailed.parse(result),
		).toEqual({});
	});

	it('wafCustomRulesList: lists custom WAF rules with pagination', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafCustomRulesList(ctx, {
			shieldZoneId: 5,
			page: 1,
			perPage: 10,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/custom-rules/5',
			'test-key',
			{
				method: 'GET',
				query: { page: 1, perPage: 10 },
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafCustomRulesList.parse(result),
		).toEqual({});
	});

	it('wafCustomRuleGet: gets a custom WAF rule by id', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafCustomRuleGet(ctx, { id: 'cr-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/custom-rule/cr-1',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafCustomRuleId.parse(result),
		).toEqual({});
	});

	it('wafEngineConfig: reads the WAF engine configuration', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafEngineConfig(ctx);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/engine-config',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('wafEnums: lists available WAF configuration values', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafEnums(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/waf/enums', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('wafProfiles: lists available WAF security profiles', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafProfiles(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/waf/profiles', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('wafRulesPlanSegmentation: lists WAF rules by plan tier', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafRulesPlanSegmentation(ctx);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/rules/plan-segmentation',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('wafRulesReviewTriggered: lists triggered WAF rules awaiting review', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafRulesReviewTriggered(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/rules/review-triggered/5',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafRuleReview.parse(result),
		).toEqual({});
	});

	it('wafRulesByZone: lists WAF rules for a shield zone', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafRulesByZone(ctx, {
			shieldZoneId: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/waf/rules/5', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'shield',
		});
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafRuleReview.parse(result),
		).toEqual({});
	});

	it('wafRulesReviewTriggeredPost: applies an action to a triggered WAF rule', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ShieldEndpoints.wafRulesReviewTriggeredPost(ctx, {
			shieldZoneId: 5,
			ruleId: 'rule-1',
			action: 'allow',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/waf/rules/review-triggered/5',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { ruleId: 'rule-1', action: 'allow' },
				base: 'shield',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.shieldWafRuleReview.parse(result),
		).toEqual({});
	});
});

describe('containers', () => {
	it('applicationsList: lists applications with cursor pagination', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.applicationsList(ctx, {
			limit: 10,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/apps', 'test-key', {
			method: 'GET',
			query: { nextCursor: undefined, limit: 10 },
			body: undefined,
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.containersCursor.parse(result),
		).toEqual({});
	});

	it('nodesList: lists Magic Container nodes', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.nodesList(ctx, {
			nextCursor: 'cur',
			limit: 5,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/nodes', 'test-key', {
			method: 'GET',
			query: { nextCursor: 'cur', limit: 5 },
			body: undefined,
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.containersCursor.parse(result),
		).toEqual({});
	});

	it('regionsList: lists Magic Container regions', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.regionsList(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/regions', 'test-key', {
			method: 'GET',
			query: { nextCursor: undefined, limit: undefined },
			body: undefined,
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.containersCursor.parse(result),
		).toEqual({});
	});

	it('optimalBaseRegion: reads the optimal base region', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.optimalBaseRegion(ctx, {
			cdnServerToken: 'tok',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/regions/optimal', 'test-key', {
			method: 'GET',
			query: { cdnServerToken: 'tok' },
			body: undefined,
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.optimalBaseRegion.parse(result),
		).toEqual({});
	});

	it('userLimits: reads Magic Container limits for the account', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.userLimits(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/limits', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'mc',
		});
		expect(BunnycdnEndpointOutputSchemas.emptyInput.parse(result)).toEqual({});
	});

	it('registriesList: lists container registries', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.registriesList(ctx);
		expect(mockedRequest).toHaveBeenCalledWith('/registries', 'test-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.containersCursor.parse(result),
		).toEqual({});
	});

	it('registryDelete: deletes a container registry', async () => {
		mockedRequest.mockResolvedValue(undefined);
		const result = await ContainersEndpoints.registryDelete(ctx, {
			registryId: 'reg-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/registries/reg-1',
			'test-key',
			{
				method: 'DELETE',
				query: undefined,
				body: undefined,
				base: 'mc',
			},
		);
		expect(result).toEqual({ success: true });
	});

	it('imageTags: lists tags for a container image', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.imageTags(ctx, {
			registryId: 'reg-1',
			imageName: 'api',
			imageNamespace: 'team',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/registries/tags', 'test-key', {
			method: 'POST',
			query: undefined,
			body: { registryId: 'reg-1', imageName: 'api', imageNamespace: 'team' },
			base: 'mc',
		});
		expect(
			BunnycdnEndpointOutputSchemas.containerImageTags.parse(result),
		).toEqual({});
	});

	it('imageDigest: reads the digest of a container image', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.imageDigest(ctx, {
			registryId: 'reg-1',
			imageName: 'api',
			imageNamespace: 'team',
			tag: 'latest',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/registries/digest',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: {
					registryId: 'reg-1',
					imageName: 'api',
					imageNamespace: 'team',
					tag: 'latest',
				},
				base: 'mc',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.containerImageRef.parse(result),
		).toEqual({});
	});

	it('configSuggestions: reads deployment suggestions for an image', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.configSuggestions(ctx, {
			registryId: 'reg-1',
			imageName: 'api',
			imageNamespace: 'team',
			tag: 'latest',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/registries/config-suggestions',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: {
					registryId: 'reg-1',
					imageName: 'api',
					imageNamespace: 'team',
					tag: 'latest',
				},
				base: 'mc',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.containerImageRef.parse(result),
		).toEqual({});
	});

	it('publicImagesSearch: searches public container images by prefix', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.publicImagesSearch(ctx, {
			registryId: 'reg-1',
			prefix: 'nginx',
			size: 10,
			page: 1,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/registries/public-images/search',
			'test-key',
			{
				method: 'POST',
				query: undefined,
				body: { registryId: 'reg-1', prefix: 'nginx', size: 10, page: 1 },
				base: 'mc',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.containerPublicImagesSearch.parse(result),
		).toEqual({});
	});

	it('volumesList: lists volumes for an application', async () => {
		mockedRequest.mockResolvedValue({});
		const result = await ContainersEndpoints.volumesList(ctx, {
			appId: 'app-1',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/apps/app-1/volumes',
			'test-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
				base: 'mc',
			},
		);
		expect(
			BunnycdnEndpointOutputSchemas.containerVolumesList.parse(result),
		).toEqual({});
	});
});

describe('input schema validation', () => {
	it('rejects pull zone creation without a name', () => {
		expect(() =>
			BunnycdnEndpointInputSchemas.pullZoneCreate.parse({ name: '' }),
		).toThrow();
	});

	it('rejects purge url calls without a valid url', () => {
		expect(() =>
			BunnycdnEndpointInputSchemas.purgeUrl.parse({ url: 'not-a-url' }),
		).toThrow();
	});

	it('rejects access list creation without content', () => {
		expect(() =>
			BunnycdnEndpointInputSchemas.shieldAccessListCreate.parse({
				shieldZoneId: 1,
				name: 'x',
				type: 2,
			}),
		).toThrow();
	});

	it('rejects container image lookups with missing fields', () => {
		expect(() =>
			BunnycdnEndpointInputSchemas.containerImageRef.parse({
				registryId: 'reg-1',
				imageName: 'api',
			}),
		).toThrow();
		expect(() =>
			BunnycdnEndpointInputSchemas.dnsRecordDelete.parse({ zoneId: 1 }),
		).toThrow();
		expect(() =>
			BunnycdnEndpointInputSchemas.shieldEventLogs.parse({
				shieldZoneId: 1,
				date: '2026-09-01',
			}),
		).toThrow();
	});

	it('accepts paginated pull zone list responses', () => {
		const parsed = BunnycdnEndpointOutputSchemas.pullZoneList.parse({
			Items: [{ Id: 1, Name: 'a' }],
			CurrentPage: 1,
			TotalItems: 1,
			HasMoreItems: false,
		});
		expect(parsed).toBeDefined();
	});

	it('rejects malformed pull zone get responses', () => {
		expect(() =>
			BunnycdnEndpointOutputSchemas.pullZoneGet.parse({ Name: 'missing-id' }),
		).toThrow();
	});
});

describe('endpoint coverage sweep', () => {
	it('exercises exactly the registered operations', () => {
		const plugin = bunnycdn({});
		const endpoints = plugin.endpoints as Record<
			string,
			Record<string, unknown>
		>;
		const registered = new Set<string>();
		for (const [group, ops] of Object.entries(endpoints)) {
			for (const name of Object.keys(ops)) {
				registered.add(`${group}.${name}`);
			}
		}
		const missing = [...registered].filter((op) => !exercised.has(op));
		const extra = [...exercised].filter((op) => !registered.has(op));
		expect({ missing, extra }).toEqual({ missing: [], extra: [] });
		expect(registered.size).toBe(96);
	});
});
