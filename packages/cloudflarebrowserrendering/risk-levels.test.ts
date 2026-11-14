import { cloudflarebrowserrendering } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`. Reads that only return
// page data stay `read` even though each call uses browser time (the Ahrefs
// plugin keeps its metered reads as `read` the same way). Calls that produce a
// new artifact (screenshot, PDF, snapshot) or start a billed job or session
// (crawl, browser session) are `destructive`.
const meta = cloudflarebrowserrendering().endpointMeta as Record<
	string,
	{ riskLevel: string }
>;

describe('cloudflarebrowserrendering risk levels', () => {
	it.each([
		'snapshot.capture',
		'screenshot.capture',
		'pdf.render',
		'crawl.start',
		'browser.create',
	])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
	});

	it.each([
		'content.fetch',
		'markdown.convert',
		'accessibilityTree.capture',
		'scrape.extract',
		'json.extract',
		'links.list',
		'crawl.get',
		'sessions.list',
		'sessions.get',
		'browser.version',
		'browser.protocol',
		'targets.list',
		'targets.get',
	])('keeps read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});
});
