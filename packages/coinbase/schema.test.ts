import {
	CoinbaseAccount,
	CoinbaseCurrency,
	CoinbasePaymentMethod,
	CoinbasePrice,
	CoinbaseSchema,
	CoinbaseTransaction,
	CoinbaseUser,
} from './schema';

const ACCOUNT = {
	id: '2bbf394c-193b-5b2a-9155-3b4732659ede',
	name: 'My Wallet',
	primary: true,
	type: 'wallet',
	currency: {
		code: 'BTC',
		name: 'Bitcoin',
		type: 'crypto',
		asset_id: '5b71fc48-3dd3-540c-809b-f8c94d0e68b5',
		slug: 'bitcoin',
		color: '#F7931A',
		exponent: 8,
		sort_index: 100,
	},
	balance: { amount: '39.59000000', currency: 'BTC' },
	created_at: '2024-01-31T20:49:02Z',
	updated_at: '2024-01-31T20:49:02Z',
	resource: 'account',
	resource_path: '/v2/accounts/2bbf394c-193b-5b2a-9155-3b4732659ede',
};

describe('Coinbase schema', () => {
	it('declares a semver version', () => {
		expect(CoinbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares Coinbase App entities', () => {
		expect(Object.keys(CoinbaseSchema.entities).sort()).toEqual([
			'accounts',
			'currencies',
			'paymentMethods',
			'prices',
			'transactions',
			'users',
		]);
	});

	it('parses official account JSON', () => {
		const parsed = CoinbaseAccount.parse(ACCOUNT);
		expect(parsed.id).toBe('2bbf394c-193b-5b2a-9155-3b4732659ede');
		expect(parsed.balance?.currency).toBe('BTC');
	});

	it('parses official user JSON', () => {
		expect(
			CoinbaseUser.parse({
				id: '9bd290f2-beed-52e5-84b7-2c36d961a161',
				name: 'First Last',
				avatar_url: 'https://static-assets.coinbase.com/profile/avatar.jpg',
				resource: 'user',
				email: 'first.last@example.com',
			}).email,
		).toBe('first.last@example.com');
	});

	it('parses official price JSON', () => {
		expect(
			CoinbasePrice.parse({ amount: '1015.00', currency: 'USD' }).amount,
		).toBe('1015.00');
	});

	it('parses official currency JSON', () => {
		expect(
			CoinbaseCurrency.parse({
				id: 'BTC',
				name: 'Bitcoin',
				min_size: '0.00000001',
			}).id,
		).toBe('BTC');
	});

	it('parses official transaction JSON', () => {
		expect(
			CoinbaseTransaction.parse({
				id: '57ffb4ae-0c59-5430-bcd3-3f98f797a66c',
				type: 'send',
				status: 'completed',
				amount: { amount: '-0.00100000', currency: 'BTC' },
			}).type,
		).toBe('send');
	});

	it('parses official payment method JSON', () => {
		expect(
			CoinbasePaymentMethod.parse({
				id: '83562370-3e5c-51db-87da-752af5ef30b2',
				type: 'ach_bank_account',
				name: 'Checking',
				currency: 'USD',
			}).id,
		).toMatch(/83562370/);
	});

	it('rejects empty provider objects', () => {
		expect(() => CoinbaseAccount.parse({})).toThrow();
		expect(() => CoinbaseUser.parse({})).toThrow();
		expect(() => CoinbasePrice.parse({})).toThrow();
		expect(() => CoinbaseCurrency.parse({ name: 'Bitcoin' })).toThrow();
		expect(() => CoinbaseTransaction.parse({})).toThrow();
		expect(() => CoinbasePaymentMethod.parse({})).toThrow();
	});
});
