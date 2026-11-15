import { makeIp2proxyRequest } from './client';
import { CheckProxyResponseSchema } from './endpoints/types';

const KEY = process.env.IP2PROXY_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'IP2PROXY_API_KEY is not set; the live IP2Proxy suite is skipped',
	);
}

describeLive('IP2Proxy live', () => {
	it('checks 8.8.8.8 with the PX1 package', async () => {
		const response = await makeIp2proxyRequest<unknown>(KEY as string, {
			ip: '8.8.8.8',
			package: 'PX1',
		});
		const parsed = CheckProxyResponseSchema.parse(response);
		expect(parsed.response).toBe('OK');
		expect(parsed.countryCode).toBe('US');
		expect(parsed.isProxy).toBe('NO');
	});
});
