import { request } from 'corsair/http';
import {
	makeAppVeyorRequest,
	makeAppVeyorTextRequest,
	parseRetryAfter,
} from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('AppVeyor client', () => {
	beforeEach(() => jest.clearAllMocks());

	it('uses bearer token configuration and GET requests', async () => {
		mockRequest.mockResolvedValueOnce([]);
		await makeAppVeyorRequest('/projects', 'test-key');
		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config?.TOKEN).toBe('test-key');
		expect(config?.BASE).toBe('https://ci.appveyor.com/api');
		expect(options?.method).toBe('GET');
		expect(options?.url).toBe('/projects');
	});

	it('sends text accept headers for log requests', async () => {
		mockRequest.mockResolvedValueOnce('log');
		await makeAppVeyorTextRequest('/buildjobs/1/log', 'test-key');
		expect(mockRequest.mock.calls[0]?.[0].HEADERS).toEqual(
			expect.objectContaining({ Accept: 'text/plain' }),
		);
	});

	it('parses seconds and HTTP-date Retry-After values', () => {
		expect(parseRetryAfter('3')).toBe(3000);
		expect(parseRetryAfter(null)).toBeUndefined();
	});
});
