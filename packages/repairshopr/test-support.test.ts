import { captureError } from './test-support';

describe('captureError', () => {
	it('returns the error a rejected operation threw', async () => {
		const error = await captureError(Promise.reject(new TypeError('boom')));

		expect(error).toBeInstanceOf(TypeError);
		expect(error.message).toBe('boom');
	});

	it('fails when the operation resolves instead of rejecting', async () => {
		await expect(captureError(Promise.resolve('ok'))).rejects.toThrow(
			'the operation resolved; this test expects a rejection',
		);
	});

	it('fails on a non-Error rejection', async () => {
		await expect(captureError(Promise.reject('plain string'))).rejects.toThrow(
			'the operation rejected with a non-Error value: plain string',
		);
	});
});
