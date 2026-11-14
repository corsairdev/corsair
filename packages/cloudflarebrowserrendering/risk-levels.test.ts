import { cloudflarebrowserrendering } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`.
const meta = cloudflarebrowserrendering().endpointMeta as Record<
	string,
	{ riskLevel: string }
>;

describe('cloudflarebrowserrendering risk levels', () => {
	it.each([
		'content.fetch',
		'markdown.convert',
		'snapshot.capture',
		'accessibilityTree.capture',
		'scrape.extract',
		'json.extract',
		'links.list',
		'screenshot.capture',
		'pdf.render',
		'crawl.start',
		'browser.create',
	])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
	});

	it.each([
		'crawl.get',
		'sessions.list',
		'sessions.get',
		'browser.version',
		'browser.protocol',
		'targets.list',
		'targets.get',
	])('keeps free read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});
});
