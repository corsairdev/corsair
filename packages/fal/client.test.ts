import { ApiError } from 'corsair/http';
import {
	endpointPath,
	falErrorMessage,
	parseEndpointId,
	requestBasePath,
} from './client';

const REQUEST_ID = '019a1b2c-3d4e-7f80-9a1b-2c3d4e5f6a7b';

describe('parseEndpointId', () => {
	it('splits owner, app and endpoint path', () => {
		expect(
			parseEndpointId('fal-ai/kling-video/v2.1/master/text-to-video'),
		).toEqual({
			owner: 'fal-ai',
			app: 'kling-video',
			path: ['v2.1', 'master', 'text-to-video'],
		});
		expect(parseEndpointId('/fal-ai/flux/')).toEqual({
			owner: 'fal-ai',
			app: 'flux',
			path: [],
		});
	});

	it.each(['flux', 'fal-ai//flux', 'fal-ai/../x', 'fal-ai/flux?x=1', ''])(
		'rejects %p',
		(id) => {
			expect(() => parseEndpointId(id)).toThrow('not a fal endpoint id');
		},
	);

	it('builds the submit path from every segment', () => {
		expect(endpointPath('fal-ai/flux/schnell')).toBe('/fal-ai/flux/schnell');
	});
});

describe('requestBasePath', () => {
	it('uses only owner/app for an endpoint id with a path', () => {
		expect(
			requestBasePath({
				endpointId: 'fal-ai/flux/schnell',
				requestId: REQUEST_ID,
			}),
		).toEqual({
			basePath: `/fal-ai/flux/requests/${REQUEST_ID}`,
			requestId: REQUEST_ID,
		});
	});

	it.each([
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/status`,
		`https://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}/cancel`,
		`https://queue.falrun.com/fal-ai/flux/requests/${REQUEST_ID}`,
	])('reads %s', (responseUrl) => {
		expect(requestBasePath({ responseUrl })).toEqual({
			basePath: `/fal-ai/flux/requests/${REQUEST_ID}`,
			requestId: REQUEST_ID,
		});
	});

	it.each([
		`http://queue.fal.run/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://queue.fal.run.evil.com/fal-ai/flux/requests/${REQUEST_ID}`,
		`https://api.fal.ai/fal-ai/flux/requests/${REQUEST_ID}`,
		'https://queue.fal.run/fal-ai/flux',
		'not a url',
	])('refuses %s so the key never leaves fal', (responseUrl) => {
		expect(() => requestBasePath({ responseUrl })).toThrow();
	});

	it('refuses a request id with path characters', () => {
		expect(() =>
			requestBasePath({ endpointId: 'fal-ai/flux', requestId: '../keys' }),
		).toThrow('not a fal request id');
	});

	it('needs a reference', () => {
		expect(() => requestBasePath({ requestId: REQUEST_ID })).toThrow(
			'Pass endpointId and requestId',
		);
	});
});

describe('falErrorMessage', () => {
	const error = (status: number, body: unknown) =>
		new ApiError(
			{ method: 'GET', url: '/x' },
			{ url: 'https://fal.run/x', ok: false, status, statusText: '', body },
			'Request failed',
		);

	it('joins validation details', () => {
		expect(
			falErrorMessage(
				error(422, {
					detail: [
						{ loc: ['body', 'prompt'], msg: 'Field required' },
						{ loc: ['body', 'seed'], msg: 'Input should be an integer' },
					],
				}),
			),
		).toBe(
			'422: body.prompt: Field required; body.seed: Input should be an integer',
		);
	});

	it('reads detail strings and Platform API errors', () => {
		expect(falErrorMessage(error(500, { detail: 'Runner crashed' }))).toBe(
			'500: Runner crashed',
		);
		expect(
			falErrorMessage(
				error(403, {
					error: {
						type: 'authorization_error',
						message: 'This API key is not permitted to perform this action.',
					},
				}),
			),
		).toBe('403: This API key is not permitted to perform this action.');
	});

	it('falls back to the error message', () => {
		expect(falErrorMessage(new Error('boom'))).toBe('boom');
		expect(falErrorMessage(error(502, undefined))).toBe('502: Request failed');
	});
});
