import { cloudconvert } from './index';

// R8 in .github/PLUGIN_PR_RULES.md: an operation that sends a message, spends
// money or credits, or can't be undone is `destructive`.
const meta = cloudconvert().endpointMeta as Record<
	string,
	{ riskLevel: string }
>;

describe('cloudconvert risk levels', () => {
	it.each([
		'jobs.create',
		'jobs.createAndWait',
		'tasks.createExportGoogleCloudStorage',
		'tasks.createExportS3',
		'tasks.retry',
		'jobs.remove',
		'tasks.remove',
	])('marks %s destructive', (op) => {
		expect(meta[op]?.riskLevel).toBe('destructive');
	});

	it.each([
		'jobs.get',
		'jobs.list',
		'tasks.get',
		'operations.list',
		'users.show',
	])('keeps free read %s as read', (op) => {
		expect(meta[op]?.riskLevel).toBe('read');
	});
});
