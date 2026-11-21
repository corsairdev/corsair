import { logEventFromContext } from 'corsair/core';
import { makeStravaRequest } from './client';
import { create } from './endpoints/uploads';
import type { StravaContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return { ...actual, makeStravaRequest: jest.fn() };
});

// The real resolveFileInput, with its download served from mockLinks instead
// of the network: the guarded fetch, size cap and naming all still run.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual(
		'corsair/http',
	) as typeof import('corsair/http');
	return {
		...actual,
		resolveFileInput: (
			input: Parameters<typeof actual.resolveFileInput>[0],
			options: Parameters<typeof actual.resolveFileInput>[1],
			deps?: Parameters<typeof actual.resolveFileInput>[2],
		) => actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	served: new Map<string, { body: Uint8Array; type: string }>(),
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			const file = mockLinks.served.get(url.toString());
			return {
				status: file ? 200 : 404,
				headers: file ? { 'content-type': file.type } : {},
				body: (async function* () {
					if (file) yield file.body;
				})(),
			};
		},
	},
};

const mockRequest = jest.mocked(makeStravaRequest);
const mockLog = jest.mocked(logEventFromContext);

// unknown: the endpoint reads only ctx.key and ctx.db.uploads here.
const ctx = {
	key: 'test-token',
	db: { uploads: { upsertByEntityId: jest.fn() } },
} as unknown as StravaContext;

const GPX = new TextEncoder().encode(
	'<?xml version="1.0"?><gpx version="1.1"><trk><name>Morning Ride</name></trk></gpx>',
);

function sentForm(): Record<string, unknown> {
	const options = mockRequest.mock.calls.at(-1)?.[2] as {
		formData: Record<string, unknown>;
	};
	return options.formData;
}

describe('uploads.create file input', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({
			id: 42,
			status: 'Your activity is still being processed.',
		});
		mockLog.mockClear();
		mockLinks.served.clear();
	});

	it('downloads a link and uploads it as the file part with its name and type', async () => {
		mockLinks.served.set('https://files.example.com/rides/morning.gpx', {
			body: GPX,
			type: 'application/gpx+xml',
		});

		await create(ctx, {
			file: 'https://files.example.com/rides/morning.gpx',
			data_type: 'gpx',
			name: 'Morning Ride',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest.mock.calls[0]?.[0]).toBe('uploads');
		const form = sentForm();
		const file = form.file as File;
		expect(file).toBeInstanceOf(File);
		expect(file.name).toBe('morning.gpx');
		expect(file.type).toBe('application/gpx+xml');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(GPX);
		expect(form.data_type).toBe('gpx');
		expect(form.name).toBe('Morning Ride');
	});

	it('decodes {base64} and names the file for its data_type', async () => {
		await create(ctx, {
			file: { base64: Buffer.from(GPX).toString('base64') },
			data_type: 'gpx',
		});

		const file = sentForm().file as File;
		expect(file.name).toBe('activity.gpx');
		expect(file.type).toBe('application/octet-stream');
		expect(new Uint8Array(await file.arrayBuffer())).toEqual(GPX);
	});

	it('takes {base64, filename, contentType} as given', async () => {
		await create(ctx, {
			file: {
				base64: Buffer.from(GPX).toString('base64'),
				filename: 'evening.gpx',
				contentType: 'application/gpx+xml',
			},
			data_type: 'gpx',
		});

		const file = sentForm().file as File;
		expect(file.name).toBe('evening.gpx');
		expect(file.type).toBe('application/gpx+xml');
	});

	it('still sends a Blob as it was given', async () => {
		const blob = new Blob([GPX], { type: 'application/gpx+xml' });

		await create(ctx, { file: blob, data_type: 'gpx' });

		expect(sentForm().file).toBe(blob);
	});

	it('does not log the file payload', async () => {
		await create(ctx, {
			file: { base64: Buffer.from(GPX).toString('base64') },
			data_type: 'gpx',
			name: 'Morning Ride',
		});

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'strava.uploads.create',
			{ data_type: 'gpx', name: 'Morning Ride' },
			'completed',
		);
	});

	it('refuses a private address or an unknown file shape before any request to Strava', async () => {
		for (const file of [
			'https://127.0.0.1/ride.gpx',
			'http://169.254.169.254/latest/meta-data/',
		]) {
			await expect(create(ctx, { file, data_type: 'gpx' })).rejects.toThrow(
				/file URL/,
			);
		}
		await expect(
			create(ctx, {
				file: { path: '/tmp/ride.gpx' } as never,
				data_type: 'gpx',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
