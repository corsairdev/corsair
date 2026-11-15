import { conversiontools } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`.
const meta: Record<string, { riskLevel?: string } | undefined> =
	conversiontools().endpointMeta ?? {};

describe('conversiontools risk levels', () => {
	it.each(['tasks.create', 'tasks.remove'])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
	});

	it.each([
		'account.verify',
		'account.getInfo',
		'account.getConfig',
		'conversions.list',
		'conversions.get',
		'files.getInfo',
		'tasks.list',
		'tasks.get',
	])('keeps free read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});
});
