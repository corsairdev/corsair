import { jest } from '@jest/globals';
import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { ChMeetingsAPIError } from './client';
import { Person } from './endpoints';
import { PersonGetInputSchema } from './endpoints/types';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

/**
 * Only the transport (`corsair/http`'s `request`) is mocked, so the
 * assertions below exercise the real client: the ApiKey auth header, the
 * api.chmeetings.com base URL, and the `{ data }` envelope unwrapping.
 */
jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const requestMock = request as unknown as jest.Mock<
	(config: unknown, options: unknown, extra?: unknown) => Promise<unknown>
>;
const mockLog = logEventFromContext as unknown as jest.Mock<
	() => Promise<void>
>;

const ctx = { key: 'chm-test-key' };

const samplePerson = {
	id: 123,
	first_name: 'Emily',
	last_name: 'Smith',
	email: 'emily.smith@example.com',
	mobile: '+1-415-555-0136',
	gender: 'female',
};

beforeEach(() => {
	requestMock.mockReset();
	mockLog.mockClear();
});

describe('Person.get', () => {
	it('validates its input', () => {
		expect(() => PersonGetInputSchema.parse({ id: 123 })).toThrow();
		expect(PersonGetInputSchema.parse({ id: '123' })).toEqual({ id: '123' });
	});

	it('sends the ApiKey header and unwraps the { data } envelope', async () => {
		requestMock.mockResolvedValue({
			status_code: 200,
			errors: null,
			data: samplePerson,
		});

		const result = await Person.get(ctx as never, { id: '123' });

		const [config, options] = requestMock.mock.calls[0]!;
		expect(config).toMatchObject({
			BASE: 'https://api.chmeetings.com/api/v1',
			HEADERS: { ApiKey: 'chm-test-key' },
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: 'people/123',
		});

		// The endpoint returns the bare person, not the envelope.
		expect(result).toEqual(samplePerson);
		expect(mockLog).toHaveBeenCalledWith(
			ctx as never,
			'chmeetings.person.get',
			{ id: '123' },
			'completed',
		);
	});

	it('keeps fields absent from the published DTO schema via passthrough', async () => {
		requestMock.mockResolvedValue({
			status_code: 200,
			errors: null,
			data: { ...samplePerson, native_name: 'Emily' },
		});

		const result = await Person.get(ctx as never, { id: '123' });
		expect(result).toMatchObject({ native_name: 'Emily' });
	});

	it('throws a ChMeetingsAPIError when the envelope has no data', async () => {
		requestMock.mockResolvedValue({
			status_code: 404,
			errors: ['Person not found'],
		});

		await expect(Person.get(ctx as never, { id: '404' })).rejects.toThrow(
			ChMeetingsAPIError,
		);
		expect(mockLog).not.toHaveBeenCalled();
	});
});
