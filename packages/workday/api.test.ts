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

	it('should invoke an endpoint correctly', async () => {
		const plugin = workday({ key: 'test', webhookSecret: 'secret' });

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({ success: true }),
		});

		const result = await plugin.endpoints?.business.createBusinessTitleChange(
			// Justification: Mock context for testing
			{ key: 'test' } as any,
			// Justification: Mock input for testing
			{ workerId: '123' } as any,
		);

		expect(mockFetch).toHaveBeenCalled();
		expect(mockFetch.mock.calls[0][0]).toContain('workday.com');
		expect(result).toEqual({ success: true });
	});
});
