
import { AlchemyAPIError, getAlchemyBaseUrl } from './client';
import { ApiError } from 'corsair/http';

describe('Alchemy client', () => {
	it('formats base URL correctly', () => {
		expect(getAlchemyBaseUrl()).toBe('https://eth-mainnet.g.alchemy.com');
		expect(getAlchemyBaseUrl('polygon-mainnet')).toBe(
			'https://polygon-mainnet.g.alchemy.com',
		);
		expect(getAlchemyBaseUrl('eth-sepolia')).toBe(
			'https://eth-sepolia.g.alchemy.com',
		);
	});

	it('creates AlchemyAPIError correctly', () => {
		const error = new AlchemyAPIError('Test error', { status: 400 });
		expect(error.message).toBe('Test error');
		expect(error.name).toBe('AlchemyAPIError');
		expect(error.status).toBe(400);
	});

	it('creates AlchemyAPIError from ApiError correctly', () => {
		const cause = new ApiError(
			{
				method: 'GET',
				url: 'https://test.com',
			},
			{
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				url: 'https://test.com',
				body: null,
			} as any,
			'Forbidden',
		);
		const error = new AlchemyAPIError('Wrapper error', { cause });
		expect(error.message).toBe('Wrapper error');
		expect(error.status).toBe(403);
		expect(error.statusText).toBe('Forbidden');
	});
});
