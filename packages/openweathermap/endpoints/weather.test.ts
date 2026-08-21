import { logEventFromContext } from 'corsair/core';
import { makeOpenWeatherMapRequest } from '../client';
import type { OpenWeatherMapContext } from '../index';
import { circleCity, current, forecast5Day } from './weather';

jest.mock('../client', () => ({
	makeOpenWeatherMapRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = makeOpenWeatherMapRequest as jest.MockedFunction<
	typeof makeOpenWeatherMapRequest
>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx(): OpenWeatherMapContext {
	return { key: 'test-key', options: {} } as unknown as OpenWeatherMapContext;
}

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({});
	mockLogEvent.mockClear();
});

describe('weather JSON-only query sanitization', () => {
	it.each([
		['current', current, 'weather', { lat: 51.5, lon: -0.12, mode: 'xml' }],
		['forecast5Day', forecast5Day, 'forecast', { q: 'London', mode: 'html' }],
		['circleCity', circleCity, 'find', { lat: 51.5, lon: -0.12, mode: 'xml' }],
	] as const)(
		'drops runtime %s mode before calling OpenWeatherMap',
		async (_name, handler, endpoint, input) => {
			await handler(makeCtx(), input as never);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [, , options] = mockRequest.mock.calls[0] ?? [];
			expect(mockRequest.mock.calls[0]?.[0]).toBe(endpoint);
			expect(options).toMatchObject({ api: 'data25' });
			expect(options?.query).not.toHaveProperty('mode');
		},
	);
});
