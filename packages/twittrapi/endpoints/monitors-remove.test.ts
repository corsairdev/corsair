import { makeTwittrApiRequest } from '../client';
import { removeAccount } from './monitors';

jest.mock('../client', () => ({
	makeTwittrApiRequest: jest.fn(),
}));

const mockedRequest = makeTwittrApiRequest as jest.Mock;

function stubCtx() {
	const monitoredAccounts = {
		search: jest.fn(async () => [
			{
				id: 'internal-1',
				data: { userId: '2244994945', username: 'XDevelopers' },
			},
		]),
		deleteById: jest.fn(async () => true),
		deleteByEntityId: jest.fn(async () => true),
	};
	const ctx = {
		db: { monitoredAccounts },
		key: 'test-key',
		$getAccountId: async () => 'test-account',
		database: undefined,
	} as never;
	return { ctx, monitoredAccounts };
}

describe('monitors.removeAccount local cleanup', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('resolves a username to the stored userId before deleting', async () => {
		mockedRequest.mockResolvedValueOnce({});
		const { ctx, monitoredAccounts } = stubCtx();

		await removeAccount(ctx, { usernameOrId: 'XDevelopers' });

		expect(monitoredAccounts.search).toHaveBeenCalledWith({
			data: { username: 'XDevelopers' },
		});
		expect(monitoredAccounts.deleteById).toHaveBeenCalledWith('internal-1');
		expect(monitoredAccounts.deleteByEntityId).toHaveBeenCalledWith(
			'XDevelopers',
		);
	});

	it('deletes directly when a numeric userId is passed', async () => {
		mockedRequest.mockResolvedValueOnce({});
		const { ctx, monitoredAccounts } = stubCtx();
		monitoredAccounts.search.mockResolvedValueOnce([]);

		await removeAccount(ctx, { usernameOrId: '2244994945' });

		expect(monitoredAccounts.deleteByEntityId).toHaveBeenCalledWith(
			'2244994945',
		);
	});
});
