import { BoltIotAPIError, makeBoltIotRequest } from './client';
import { BoltIotCommand } from './schema';

const LIVE_KEY = process.env.BOLT_IOT_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Bolt IoT live Cloud API', () => {
	it('lists devices with numeric success envelope', async () => {
		const res = await makeBoltIotRequest('getDevices', LIVE_KEY as string);
		const parsed = BoltIotCommand.parse(res);
		expect(parsed.success === 1 || parsed.success === '1').toBe(true);
	});

	it('returns Device does not exist for a missing deviceName', async () => {
		await expect(
			makeBoltIotRequest('analogRead', LIVE_KEY as string, {
				deviceName: 'BOLT1234567',
				pin: 'A0',
			}),
		).rejects.toThrow(BoltIotAPIError);
	});
});
