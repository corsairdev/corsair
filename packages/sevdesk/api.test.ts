import { makeSevdeskRequest } from './client';
import { SevdeskEndpointOutputSchemas } from './endpoints/types';

const liveKey = process.env.SEVDESK_API_KEY ?? '';
if (!liveKey)
	console.warn('Skipping Sevdesk live tests: SEVDESK_API_KEY is not set.');
const describeLive = liveKey ? describe : describe.skip;

describeLive('Sevdesk read-only live API tests', () => {
	it('checks the bookkeeping system version', async () => {
		// unknown because the live API JSON is untrusted until the operation schema parses it.
		const response = await makeSevdeskRequest<unknown>(
			'GET',
			'/Tools/bookkeepingSystemVersion',
			liveKey,
		);
		expect(
			SevdeskEndpointOutputSchemas['basics.bookkeepingSystemVersion'].parse(
				response,
			),
		).toBeDefined();
	});
});
