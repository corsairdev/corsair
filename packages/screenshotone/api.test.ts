import type { ScreenshotOneContext } from './context';
import { getUsage, listDevices } from './endpoints/read';

const accessKey = process.env.SCREENSHOTONE_ACCESS_KEY;
if (!accessKey) {
	console.warn(
		'SCREENSHOTONE_ACCESS_KEY is not set. Skipping live ScreenshotOne calls.',
	);
}
const live = accessKey ? it : it.skip;

function context(): ScreenshotOneContext {
	return { key: accessKey } as ScreenshotOneContext;
}

live('reads usage', async () => {
	const result = await getUsage(context(), {});
	expect(result.usage.id).toBe('plan');
});

live('lists devices', async () => {
	const result = await listDevices(context(), {});
	expect(result.devices.length).toBeGreaterThan(0);
});
