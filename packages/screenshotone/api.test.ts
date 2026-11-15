import type { ScreenshotOneContext } from './context';
import { getUsage } from './endpoints/read';

console.warn('Skipping the live ScreenshotOne usage call in unit tests.');

const live = it.skip;

live('reads usage', async () => {
	const result = await getUsage(
		{ key: process.env.SCREENSHOTONE_ACCESS_KEY } as ScreenshotOneContext,
		{},
	);
	expect(result.usage.id).toBe('plan');
});
