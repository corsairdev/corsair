import type { DnsfilterContext } from './index';
import {
	persistIpAddresses,
	persistNetworks,
	persistScheduledReports,
	persistUnblockRequests,
	persistUsers,
} from './persistence';

function createContext(db: Record<string, unknown>): DnsfilterContext {
	return {
		key: 'test-key',
		$getAccountId: async () => 'account-1',
		database: undefined,
		db,
	} as unknown as DnsfilterContext;
}

function entityClient() {
	return { upsertByEntityId: jest.fn() };
}

describe('DNSFilter persistence', () => {
	it('persists list responses', async () => {
		const networks = entityClient();
		const ctx = createContext({ networks });

		await persistNetworks(ctx, {
			data: [
				{
					id: 1,
					attributes: { name: 'HQ', organization_id: 5 },
					relationships: { policy: { data: { id: 12 } } },
				},
				{ id: '2', attributes: { name: 'Branch' } },
			],
		});

		expect(networks.upsertByEntityId).toHaveBeenCalledTimes(2);
		expect(networks.upsertByEntityId).toHaveBeenNthCalledWith(
			1,
			'1',
			expect.objectContaining({
				id: '1',
				name: 'HQ',
				policyId: '12',
			}),
		);
		expect(networks.upsertByEntityId).toHaveBeenNthCalledWith(
			2,
			'2',
			expect.objectContaining({ id: '2', name: 'Branch' }),
		);
	});

	it('reads user attributes and emails', async () => {
		const users = entityClient();
		const ctx = createContext({ users });

		await persistUsers(ctx, {
			data: {
				id: 'u-1',
				attributes: {
					name: 'Ada Lovelace',
					email: 'ada@example.com',
					role: 'admin',
				},
			},
		});

		expect(users.upsertByEntityId).toHaveBeenCalledWith(
			'u-1',
			expect.objectContaining({
				email: 'ada@example.com',
				role: 'admin',
			}),
		);
	});

	it('persists IP addresses using the ip attribute', async () => {
		const ipAddresses = entityClient();
		const ctx = createContext({ ipAddresses });

		await persistIpAddresses(ctx, {
			data: { id: 'ip-1', attributes: { ip: '203.0.113.10' } },
		});

		expect(ipAddresses.upsertByEntityId).toHaveBeenCalledWith(
			'ip-1',
			expect.objectContaining({ address: '203.0.113.10' }),
		);
	});

	it('persists unblock requests with their status', async () => {
		const unblockRequests = entityClient();
		const ctx = createContext({ unblockRequests });

		await persistUnblockRequests(ctx, {
			data: {
				id: 'req-1',
				attributes: { domain: 'example.com', status: 'pending' },
			},
		});

		expect(unblockRequests.upsertByEntityId).toHaveBeenCalledWith(
			'req-1',
			expect.objectContaining({ domain: 'example.com', status: 'pending' }),
		);
	});

	it('maps the DNSFilter frequency field on scheduled reports', async () => {
		const scheduledReports = entityClient();
		const ctx = createContext({ scheduledReports });

		await persistScheduledReports(ctx, {
			data: {
				id: 'report-1',
				attributes: {
					name: 'Weekly',
					frequency: 'weekly',
					organization_id: 12,
				},
			},
		});

		expect(scheduledReports.upsertByEntityId).toHaveBeenCalledWith(
			'report-1',
			expect.objectContaining({
				name: 'Weekly',
				frequency: 'weekly',
				organizationId: '12',
			}),
		);
	});

	it('never throws when the database write fails', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const networks = {
			upsertByEntityId: jest.fn(async () => {
				throw new Error('database offline');
			}),
		};
		const ctx = createContext({ networks });

		await expect(
			persistNetworks(ctx, { data: { id: 1, attributes: { name: 'HQ' } } }),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
