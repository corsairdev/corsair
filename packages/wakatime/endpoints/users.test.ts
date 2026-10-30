import { logEventFromContext } from 'corsair/core';
import { makeWakaTimeRequest } from '../client';
import { getCurrentUser } from './users';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('../client', () => ({
	makeWakaTimeRequest: jest.fn(),
}));

const mockRequest = makeWakaTimeRequest as jest.MockedFunction<
	typeof makeWakaTimeRequest
>;

const mockContext = { key: 'test-key' } as never;

beforeEach(() => {
	mockRequest.mockReset();
	(jest.mocked(logEventFromContext) as jest.Mock).mockReset();
});

describe('getCurrentUser', () => {
	it('returns the validated documented response envelope', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'user-1', username: 'user' },
		});

		await expect(getCurrentUser(mockContext, {})).resolves.toEqual({
			data: { id: 'user-1', username: 'user' },
		});
		expect(mockRequest).toHaveBeenCalledWith('users/current', 'test-key');
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('rejects a response that fails runtime validation', async () => {
		mockRequest.mockResolvedValue({ data: { id: 42 } });

		await expect(getCurrentUser(mockContext, {})).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});
