import { ApiError } from 'corsair/http';
import {
	ALCHEMY_NETWORKS,
	AlchemyAPIError,
	assertAlchemyNetwork,
	getAlchemyBaseUrl,
} from './client';

describe('Alchemy client', () => {
	it('formats base URL for allowlisted networks only', () => {
		expect(getAlchemyBaseUrl()).toBe('https://eth-mainnet.g.alchemy.com');
		expect(getAlchemyBaseUrl('base-mainnet')).toBe(
			'https://base-mainnet.g.alchemy.com',
		);
		expect(ALCHEMY_NETWORKS).toContain('eth-mainnet');
	});

	it('rejects credential-redirect style networks', () => {
		expect(() => assertAlchemyNetwork('evil.com')).toThrow(
			/Unsupported Alchemy network/,
		);
		expect(() => assertAlchemyNetwork('eth-mainnet/../../attacker')).toThrow(
			/Unsupported Alchemy network/,
		);
		expect(() => getAlchemyBaseUrl('not-a-network')).toThrow(
			/Unsupported Alchemy network/,
		);
	});

	it('creates AlchemyAPIError from ApiError', () => {
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
			} as never,
			'Forbidden',
		);
		const error = new AlchemyAPIError('Wrapper error', { cause });
		expect(error.status).toBe(403);
		expect(error.statusText).toBe('Forbidden');
	});
});
