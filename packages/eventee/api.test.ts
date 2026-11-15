// Optional read-only smoke tests. Set EVENTEE_API_KEY to an event-scoped token
// and run `pnpm test:live`; these tests never create, update, or delete data.
import { makeEventeeRequest } from './client';
import { EventeeEndpointOutputSchemas } from './endpoints/types';

const liveKey = process.env.EVENTEE_API_KEY ?? '';
if (liveKey.length === 0) {
	console.warn('Skipping Eventee live tests: EVENTEE_API_KEY is not set.');
}
const describeLive = liveKey.length > 0 ? describe : describe.skip;

describeLive('Eventee live read-only API smoke tests', () => {
	it('reads the event content program', async () => {
		// Live provider JSON is untrusted until parsed by the documented response schema.
		const response: unknown = await makeEventeeRequest<unknown>(
			'/public/api/{api-version}/content',
			liveKey,
			{ method: 'GET' },
		);
		const program = EventeeEndpointOutputSchemas.contentGet.parse(response);
		expect(Array.isArray(program.halls)).toBe(true);
		expect(Array.isArray(program.lectures)).toBe(true);
	});

	it('reads all partners', async () => {
		const response: unknown = await makeEventeeRequest<unknown>(
			'/public/api/{api-version}/partners',
			liveKey,
			{ method: 'GET' },
		);
		expect(
			Array.isArray(EventeeEndpointOutputSchemas.partnerList.parse(response)),
		).toBe(true);
	});

	it('reads participants, registrations, groups, and reviews', async () => {
		const requests = [
			[
				'/public/api/{api-version}/participants',
				EventeeEndpointOutputSchemas.attendeeList,
			],
			[
				'/public/api/{api-version}/registrations',
				EventeeEndpointOutputSchemas.registrationList,
			],
			[
				'/public/api/{api-version}/groups',
				EventeeEndpointOutputSchemas.groupList,
			],
			[
				'/public/api/{api-version}/reviews',
				EventeeEndpointOutputSchemas.reviewList,
			],
		] as const;
		for (const [path, schema] of requests) {
			// Provider JSON is runtime-checked; the key is never included in assertion output.
			const response: unknown = await makeEventeeRequest<unknown>(
				path,
				liveKey,
				{ method: 'GET' },
			);
			expect(Array.isArray(schema.parse(response))).toBe(true);
		}
	});
});
