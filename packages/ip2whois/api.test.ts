import { makeIp2whoisRequest } from './client';
import { DomainLookupResponseSchema } from './endpoints/types';

const KEY = process.env.IP2WHOIS_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'IP2WHOIS_API_KEY is not set; the live IP2WHOIS suite is skipped',
	);
}

describeLive('IP2WHOIS live', () => {
	it('looks up example.com', async () => {
		const response = await makeIp2whoisRequest<unknown>(KEY as string, '/v2', {
			domain: 'example.com',
		});
		const parsed = DomainLookupResponseSchema.parse(response);
		expect(parsed.domain).toBe('example.com');
	});
});
