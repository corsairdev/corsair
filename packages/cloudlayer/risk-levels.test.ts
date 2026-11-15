import { cloudlayer } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`.
const meta = cloudlayer().endpointMeta as Record<string, { riskLevel: string }>;

describe('cloudlayer risk levels', () => {
	it.each([
		'html.toPdf',
		'html.toPdfV1',
		'html.toImage',
		'html.toImageV1',
		'url.toPdf',
		'url.toPdfV1',
		'url.toPdfQuick',
		'url.toPdfQuickV1',
		'url.toImage',
		'url.toImageV1',
		'url.toImageQuick',
		'url.toImageQuickV1',
		'template.toPdf',
		'template.toPdfV1',
		'template.toImage',
		'template.toImageV1',
		'storage.remove',
	])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
	});

	it.each([
		'account.get',
		'assets.list',
		'assets.get',
		'jobs.list',
		'jobs.listV2',
		'jobs.get',
		'storage.getCurrent',
		'storage.get',
	])('keeps free read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});
});
