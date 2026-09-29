import 'dotenv/config';
import { makeAppRequest } from './client';
import type {
	GetMessagesResponse,
	GetSegmentMembershipResponse,
	GetSegmentsResponse,
	ListCollectionsResponse,
	ListIpAddressesResponse,
	ListNewslettersResponse,
	ListSnippetsResponse,
} from './endpoints/types';
import { CustomerioEndpointOutputSchemas } from './endpoints/types';

// Live read-only checks against the real App API.
// Provide CUSTOMERIO_API_KEY (a scoped App API key) to run them; otherwise the
// suite skips so CI stays green without credentials. Only GET endpoints are
// exercised here — write endpoints are covered by endpoints.test.ts mocks.
const API_KEY: string | undefined = process.env.CUSTOMERIO_API_KEY;

function getLiveKey(): string {
	if (API_KEY === undefined || API_KEY.length === 0) {
		throw new Error('CUSTOMERIO_API_KEY is not set');
	}
	return API_KEY;
}

const describeLive = API_KEY ? describe : describe.skip;

describeLive('Customer.io live App API', () => {
	it('lists segments', async () => {
		const response = await makeAppRequest<GetSegmentsResponse>(
			'/v1/segments',
			getLiveKey(),
			{ method: 'GET' },
		);
		const parsed = CustomerioEndpointOutputSchemas.getSegments.parse(response);
		expect(Array.isArray(parsed.segments)).toBe(true);
	});

	it('lists messages with pagination', async () => {
		const response = await makeAppRequest<GetMessagesResponse>(
			'/v1/messages',
			getLiveKey(),
			{ method: 'GET', query: { limit: 1 } },
		);
		const parsed = CustomerioEndpointOutputSchemas.getMessages.parse(response);
		expect(Array.isArray(parsed.messages)).toBe(true);
	});

	it('lists collections, snippets and newsletters', async () => {
		const key: string = getLiveKey();
		const collections = await makeAppRequest<ListCollectionsResponse>(
			'/v1/collections',
			key,
			{ method: 'GET' },
		);
		expect(
			CustomerioEndpointOutputSchemas.listCollections.parse(collections),
		).toBeDefined();

		const snippets = await makeAppRequest<ListSnippetsResponse>(
			'/v1/snippets',
			key,
			{
				method: 'GET',
			},
		);
		expect(
			CustomerioEndpointOutputSchemas.listSnippets.parse(snippets),
		).toBeDefined();

		const newsletters = await makeAppRequest<ListNewslettersResponse>(
			'/v1/newsletters',
			key,
			{ method: 'GET', query: { limit: 1 } },
		);
		expect(
			CustomerioEndpointOutputSchemas.listNewsletters.parse(newsletters),
		).toBeDefined();
	});

	it('lists IP addresses and segment membership shape', async () => {
		const key: string = getLiveKey();
		const ips = await makeAppRequest<ListIpAddressesResponse>(
			'/v1/info/ip_addresses',
			key,
			{ method: 'GET' },
		);
		const parsedIps =
			CustomerioEndpointOutputSchemas.listIpAddresses.parse(ips);
		expect(Array.isArray(parsedIps.ip_addresses)).toBe(true);

		const segments = await makeAppRequest<GetSegmentsResponse>(
			'/v1/segments',
			key,
			{
				method: 'GET',
			},
		);
		const firstId: number | undefined = segments.segments[0]?.id;
		if (firstId === undefined) {
			return;
		}
		const membership = await makeAppRequest<GetSegmentMembershipResponse>(
			`/v1/segments/${String(firstId)}/membership`,
			key,
			{ method: 'GET', query: { limit: 1 } },
		);
		expect(
			CustomerioEndpointOutputSchemas.getSegmentMembership.parse(membership),
		).toBeDefined();
	});
});
