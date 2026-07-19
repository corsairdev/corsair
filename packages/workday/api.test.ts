import { workday } from './index.js';

describe('Workday Plugin', () => {
	const mockFetch = jest.fn();
	(globalThis as any).fetch = mockFetch;

	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('should initialize the plugin correctly', () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });
		expect(plugin.id).toBe('workday');
	});

	it('should provide the expected endpoint structure for business', () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });
		expect(plugin.endpoints).toHaveProperty('business');
		expect(plugin.endpoints?.business.createBusinessTitleChange).toBeDefined();
	});

	it('should provide the expected endpoint structure for job', () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });
		expect(plugin.endpoints).toHaveProperty('job');
		expect(plugin.endpoints?.job.createJobChange).toBeDefined();
	});

	it('should provide the expected endpoint structure for payroll', () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });
		expect(plugin.endpoints).toHaveProperty('payroll');
		expect(plugin.endpoints?.payroll.createPayrollInputs).toBeDefined();
	});

	it('should support webhooks configuration', () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });
		expect(plugin.webhooks).toBeDefined();
		expect(plugin.pluginWebhookMatcher).toBeDefined();
	});
});
