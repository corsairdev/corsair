import * as client from '../client';
import { Assets } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeBorneoRequest: jest.fn(),
}));

const mockedRequest = client.makeBorneoRequest as jest.MockedFunction<
	typeof client.makeBorneoRequest
>;

const ctx = {
	key: 'test-key',
	options: { baseUrl: 'https://dashboard.example.test' },
	db: {},
} as any;

describe('Borneo asset endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({});
	});

	it('creates an asset', async () => {
		await Assets.createAsset(ctx, {
			name: 'Customer CRM',
			type: 'application',
		});

		expect(mockedRequest).toHaveBeenCalledWith('/assets', ctx.key, {
			method: 'POST',
			body: { name: 'Customer CRM', type: 'application' },
			baseUrl: ctx.options.baseUrl,
		});
	});

	it('retrieves an asset by encoded id', async () => {
		await Assets.retrieveAsset(ctx, { assetId: 'asset/123' });

		expect(mockedRequest).toHaveBeenCalledWith('/assets/asset%2F123', ctx.key, {
			method: 'GET',
			baseUrl: ctx.options.baseUrl,
		});
	});

	it('updates an asset without leaking the path id into the body', async () => {
		await Assets.updateAsset(ctx, {
			assetId: 'asset-123',
			name: 'Customer CRM',
			type: 'application',
		});

		expect(mockedRequest).toHaveBeenCalledWith('/assets/asset-123', ctx.key, {
			method: 'PUT',
			body: { name: 'Customer CRM', type: 'application' },
			baseUrl: ctx.options.baseUrl,
		});
	});

	it('deletes an asset', async () => {
		await Assets.deleteAsset(ctx, { assetId: 'asset/123' });

		expect(mockedRequest).toHaveBeenCalledWith('/assets/asset%2F123', ctx.key, {
			method: 'DELETE',
			baseUrl: ctx.options.baseUrl,
		});
	});
});
