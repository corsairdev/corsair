import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Account,
	Assets,
	Html,
	Jobs,
	Storage,
	Template,
	Url,
} from './endpoints';
import { CloudlayerEndpointInputSchemas } from './endpoints/types';
import type { CloudlayerContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeCloudlayerSyncRequest: jest.fn(),
		makeCloudlayerRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeCloudlayerRequest);
const mockedSyncRequest = jest.mocked(client.makeCloudlayerSyncRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
type Ctx = Parameters<typeof Html.toPdf>[0];

function buildCtx(): Ctx {
	const ctx: CloudlayerContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'unit-test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('unit-test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();
const job = { id: 'job-1', status: 'pending' };
const binaryArtifact = {
	kind: 'binary' as const,
	contentType: 'application/pdf',
	base64: 'JVBERi0=',
};
const asset = {
	id: 'asset-1',
	jobId: 'job-1',
	ext: 'pdf',
	type: 'application/pdf',
	size: 123,
	url: 'https://storage.cloudlayer.io/assets/asset-1.pdf?signature=signed-download-marker',
	timestamp: 1_700_000_000_000,
};
const listedJob = {
	id: 'job-1',
	uid: 'user-1',
	apiKeyUsed: 'api-key-marker',
	type: 'html-pdf',
	status: 'success',
	params: { format: 'a4' },
	size: 123,
	processTime: 1000,
	apiCreditCost: 1,
	workerName: 'worker-1',
	timestamp: 1_700_000_000_000,
};
const storageConfig = {
	title: 'Test storage',
	bucket: 'documents',
	region: 'us-east-1',
	accessKeyId: 'masked-access-key',
	secretAccessKey: '****',
	endpoint: null,
};
const redactionMarkers = [
	'token=private-marker',
	'person@redaction.invalid',
	'test-access-key',
	'test-secret-key',
	'api-key-marker',
	'signed-download-marker',
];

function expectSafeLog(eventName: string, payload: object): void {
	expect(mockedLogEvent).toHaveBeenCalledWith(
		ctx,
		eventName,
		payload,
		'completed',
	);
	const loggedPayload = mockedLogEvent.mock.calls[0]?.[2];
	const serializedPayload = JSON.stringify(loggedPayload);
	for (const marker of redactionMarkers) {
		expect(serializedPayload).not.toContain(marker);
	}
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedSyncRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Cloudlayer endpoints', () => {
	it('html.toPdf sends the PDF request and redacts the HTML body', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = { html: 'cHJpdmF0ZS1kb2N1bWVudA==' };

		const result = await Html.toPdf(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/html/pdf',
			'unit-test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expectSafeLog('cloudlayer.html.toPdf', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'private-document',
		);
	});

	it('html.toPdf returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = { html: 'cHJpdmF0ZS1kb2N1bWVudA==', async: false };

		const result = await Html.toPdf(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/html/pdf', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.html.toPdf', { count: 1 });
	});

	it('html.toPdfV1 returns a base64 artifact from the v1 route', async () => {
		mockedSyncRequest.mockResolvedValue(binaryArtifact);
		const input = { html: 'cHJpdmF0ZS1kb2N1bWVudA==' };

		const result = await Html.toPdfV1(ctx, input);

		expect(result).toEqual(binaryArtifact);
		expect(mockedSyncRequest).toHaveBeenCalledWith('/html/pdf', ctx.key, {
			method: 'POST',
			apiVersion: 'v1',
			body: input,
		});
		expectSafeLog('cloudlayer.html.toPdfV1', { count: 1 });
	});

	it('html.toImage sends the image request and redacts the HTML body', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = { html: 'cHJpdmF0ZS1pbWFnZQ==' };

		const result = await Html.toImage(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/html/image',
			'unit-test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expectSafeLog('cloudlayer.html.toImage', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'private-image',
		);
	});

	it('html.toImage returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = { html: 'cHJpdmF0ZS1pbWFnZQ==', async: false };

		const result = await Html.toImage(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/html/image', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.html.toImage', { count: 1 });
	});

	it('html.toImageV1 returns a base64 artifact from the v1 route', async () => {
		mockedSyncRequest.mockResolvedValue({
			...binaryArtifact,
			contentType: 'image/png',
		});
		const input = { html: 'cHJpdmF0ZS1pbWFnZQ==' };

		const result = await Html.toImageV1(ctx, input);

		expect(result).toEqual({ ...binaryArtifact, contentType: 'image/png' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/html/image', ctx.key, {
			method: 'POST',
			apiVersion: 'v1',
			body: input,
		});
		expectSafeLog('cloudlayer.html.toImageV1', { count: 1 });
	});

	it('url.toPdf sends the complete documented POST body without logging its URL', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = {
			url: 'https://private.invalid/path?token=private-marker',
			format: 'a4' as const,
		};

		const result = await Url.toPdf(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/url/pdf',
			'unit-test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expectSafeLog('cloudlayer.url.toPdf', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'private.invalid',
		);
	});

	it('url.toPdf returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = {
			url: 'https://private.invalid/report',
			format: 'a4' as const,
			async: false,
		};

		const result = await Url.toPdf(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/pdf', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.url.toPdf', { count: 1 });
	});

	it('url.toPdfV1 returns a base64 artifact from the v1 POST route', async () => {
		mockedSyncRequest.mockResolvedValue(binaryArtifact);
		const input = { url: 'https://private.invalid/report' };

		const result = await Url.toPdfV1(ctx, input);

		expect(result).toEqual(binaryArtifact);
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/pdf', ctx.key, {
			method: 'POST',
			apiVersion: 'v1',
			body: input,
		});
		expectSafeLog('cloudlayer.url.toPdfV1', { count: 1 });
	});

	it('url.toPdfQuick sends only the documented GET query parameters', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = { url: 'https://capture.invalid/report', timeout: 5000 };

		const result = await Url.toPdfQuick(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/url/pdf',
			'unit-test-api-key',
			{
				method: 'GET',
				query: input,
			},
		);
		expectSafeLog('cloudlayer.url.toPdfQuick', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'https://capture.invalid/report',
		);
	});

	it('url.toPdfQuickV1 returns a base64 artifact from the v1 GET route', async () => {
		mockedSyncRequest.mockResolvedValue(binaryArtifact);
		const input = { url: 'https://capture.invalid/report', timeout: 5000 };

		const result = await Url.toPdfQuickV1(ctx, input);

		expect(result).toEqual(binaryArtifact);
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/pdf', ctx.key, {
			method: 'GET',
			apiVersion: 'v1',
			query: input,
		});
		expectSafeLog('cloudlayer.url.toPdfQuickV1', { count: 1 });
	});

	it('url.toImage sends the full documented POST body without logging the URL', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = {
			url: 'https://private.invalid/image?token=private-marker',
			imageType: 'webp' as const,
			cookies: [{ name: 'session', value: 'person@redaction.invalid' }],
		};

		const result = await Url.toImage(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/url/image',
			'unit-test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expectSafeLog('cloudlayer.url.toImage', { count: 1 });
	});

	it('url.toImage returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = {
			url: 'https://private.invalid/image',
			imageType: 'png' as const,
			async: false,
		};

		const result = await Url.toImage(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/image', ctx.key, {
			method: 'POST',
			body: input,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.url.toImage', { count: 1 });
	});

	it('url.toImageV1 returns a base64 artifact from the v1 POST route', async () => {
		mockedSyncRequest.mockResolvedValue({
			...binaryArtifact,
			contentType: 'image/png',
		});
		const input = { url: 'https://private.invalid/image' };

		const result = await Url.toImageV1(ctx, input);

		expect(result).toEqual({ ...binaryArtifact, contentType: 'image/png' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/image', ctx.key, {
			method: 'POST',
			apiVersion: 'v1',
			body: input,
		});
		expectSafeLog('cloudlayer.url.toImageV1', { count: 1 });
	});

	it('url.toImageQuickV1 returns a base64 artifact from the v1 GET route', async () => {
		mockedSyncRequest.mockResolvedValue({
			...binaryArtifact,
			contentType: 'image/png',
		});
		const input = { url: 'https://capture.invalid/image', timeout: 5000 };

		const result = await Url.toImageQuickV1(ctx, input);

		expect(result).toEqual({ ...binaryArtifact, contentType: 'image/png' });
		expect(mockedSyncRequest).toHaveBeenCalledWith('/url/image', ctx.key, {
			method: 'GET',
			apiVersion: 'v1',
			query: input,
		});
		expectSafeLog('cloudlayer.url.toImageQuickV1', { count: 1 });
	});

	it('url.toImageQuick sends only the documented GET query parameters', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = { url: 'https://capture.invalid/image', timeout: 5000 };

		const result = await Url.toImageQuick(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/url/image',
			'unit-test-api-key',
			{
				method: 'GET',
				query: input,
			},
		);
		expectSafeLog('cloudlayer.url.toImageQuick', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'https://capture.invalid/image',
		);
	});

	it('template.toPdf sends template data without logging customer fields', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = {
			templateId: 'invoice-template',
			data: { email: 'person@redaction.invalid', invoiceNumber: 'INV-1' },
		};

		const result = await Template.toPdf(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/template/pdf',
			'unit-test-api-key',
			{ method: 'POST', body: input },
		);
		expectSafeLog('cloudlayer.template.toPdf', { count: 1 });
	});

	it('template.toPdf uploads a template file as multipart without logging data', async () => {
		mockedRequest.mockResolvedValue(job);
		const template = new Blob(['<h1>Invoice</h1>'], { type: 'text/html' });
		const data = { email: 'person@redaction.invalid', invoiceNumber: 'INV-2' };

		const result = await Template.toPdf(ctx, { template, data });

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/template/pdf',
			'unit-test-api-key',
			{
				method: 'POST',
				formData: { template, data: JSON.stringify(data) },
			},
		);
		expectSafeLog('cloudlayer.template.toPdf', { count: 1 });
	});

	it('template.toPdf returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = { templateId: 'invoice-template', async: false };

		const result = await Template.toPdf(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith(
			'/template/pdf',
			'unit-test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.template.toPdf', { count: 1 });
	});

	it('template.toPdfV1 returns a base64 artifact from the v1 route', async () => {
		mockedSyncRequest.mockResolvedValue(binaryArtifact);
		const input = { templateId: 'invoice-template', data: { number: 'INV-6' } };

		const result = await Template.toPdfV1(ctx, input);

		expect(result).toEqual(binaryArtifact);
		expect(mockedSyncRequest).toHaveBeenCalledWith(
			'/template/pdf',
			'unit-test-api-key',
			{ method: 'POST', apiVersion: 'v1', body: input },
		);
		expectSafeLog('cloudlayer.template.toPdfV1', { count: 1 });
	});

	it('template.toImage sends JSON inputs without logging template data', async () => {
		mockedRequest.mockResolvedValue(job);
		const input = {
			templateId: 'invoice-template',
			data: { email: 'person@redaction.invalid', invoiceNumber: 'INV-3' },
			imageType: 'png' as const,
		};

		const result = await Template.toImage(ctx, input);

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/template/image',
			'unit-test-api-key',
			{ method: 'POST', body: input },
		);
		expectSafeLog('cloudlayer.template.toImage', { count: 1 });
	});

	it('template.toImage uploads a template file as multipart', async () => {
		mockedRequest.mockResolvedValue(job);
		const template = new Blob(['<h1>Invoice</h1>'], { type: 'text/html' });
		const data = { invoiceNumber: 'INV-4' };

		const result = await Template.toImage(ctx, { template, data });

		expect(result).toEqual(job);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/template/image',
			'unit-test-api-key',
			{
				method: 'POST',
				formData: { template, data: JSON.stringify(data) },
			},
		);
		expectSafeLog('cloudlayer.template.toImage', { count: 1 });
	});

	it('template.toImage returns the completed JSON job for the documented async:false mode', async () => {
		mockedSyncRequest.mockResolvedValue({ ...job, status: 'success' });
		const input = {
			templateId: 'invoice-template',
			imageType: 'png' as const,
			async: false,
		};

		const result = await Template.toImage(ctx, input);

		expect(result).toEqual({ ...job, status: 'success' });
		expect(mockedSyncRequest).toHaveBeenCalledWith(
			'/template/image',
			'unit-test-api-key',
			{ method: 'POST', body: input },
		);
		expect(mockedRequest).not.toHaveBeenCalled();
		expectSafeLog('cloudlayer.template.toImage', { count: 1 });
	});

	it('template.toImageV1 returns a base64 artifact from the v1 route', async () => {
		mockedSyncRequest.mockResolvedValue({
			...binaryArtifact,
			contentType: 'image/png',
		});
		const input = { templateId: 'invoice-template', data: { number: 'INV-7' } };

		const result = await Template.toImageV1(ctx, input);

		expect(result).toEqual({ ...binaryArtifact, contentType: 'image/png' });
		expect(mockedSyncRequest).toHaveBeenCalledWith(
			'/template/image',
			'unit-test-api-key',
			{ method: 'POST', apiVersion: 'v1', body: input },
		);
		expectSafeLog('cloudlayer.template.toImageV1', { count: 1 });
	});

	it('account.get returns the account but logs no account details', async () => {
		const response = {
			email: 'person@redaction.invalid',
			uid: 'user-1',
			subscription: 'price-starter',
			subType: 'limit',
			subActive: true,
			calls: 10,
			callsLimit: 100,
			bytesTotal: 1024,
			bytesLimit: 4096,
			computeTimeTotal: 2000,
			computeTimeLimit: 5000,
			storageUsed: 512,
			storageLimit: 2048,
			totalJobs: 10,
			successJobs: 9,
			errorJobs: 1,
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Account.get(ctx, {});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/account',
			'unit-test-api-key',
			{
				method: 'GET',
			},
		);
		expectSafeLog('cloudlayer.account.get', {});
	});

	it('assets.list sends cursor parameters and logs only the result count', async () => {
		mockedRequest.mockResolvedValue([asset]);
		const input = { limit: 5, startAfterId: 'asset-0' };

		const result = await Assets.list(ctx, input);

		expect(result).toEqual([asset]);
		expect(mockedRequest).toHaveBeenCalledWith('/assets', 'unit-test-api-key', {
			method: 'GET',
			query: input,
		});
		expectSafeLog('cloudlayer.assets.list', { count: 1 });
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'signed-download-marker',
		);
	});

	it('assets.get encodes the ID and never logs its download URL', async () => {
		mockedRequest.mockResolvedValue(asset);

		const result = await Assets.get(ctx, { id: 'asset/1' });

		expect(result).toEqual(asset);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/assets/asset%2F1',
			'unit-test-api-key',
			{ method: 'GET' },
		);
		expectSafeLog('cloudlayer.assets.get', { count: 1 });
	});

	it('jobs.list calls the documented v1 path and redacts job key data', async () => {
		mockedRequest.mockResolvedValue([listedJob]);
		const input = { limit: 10, startAfterId: 'job-0' };

		const result = await Jobs.list(ctx, input);

		expect(result).toEqual([listedJob]);
		expect(mockedRequest).toHaveBeenCalledWith('/jobs', 'unit-test-api-key', {
			method: 'GET',
			apiVersion: 'v1',
			query: input,
		});
		expectSafeLog('cloudlayer.jobs.list', { count: 1 });
	});

	it('jobs.listV2 calls the documented v2 path and redacts job key data', async () => {
		mockedRequest.mockResolvedValue([listedJob]);
		const input = { limit: 10, startAfterId: 'job-0' };

		const result = await Jobs.listV2(ctx, input);

		expect(result).toEqual([listedJob]);
		expect(mockedRequest).toHaveBeenCalledWith('/jobs', 'unit-test-api-key', {
			method: 'GET',
			apiVersion: 'v2',
			query: input,
		});
		expectSafeLog('cloudlayer.jobs.listV2', { count: 1 });
	});

	it('jobs.get encodes the ID and redacts the API key used field', async () => {
		mockedRequest.mockResolvedValue(listedJob);

		const result = await Jobs.get(ctx, { id: 'job/1' });

		expect(result).toEqual(listedJob);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/jobs/job%2F1',
			'unit-test-api-key',
			{ method: 'GET' },
		);
		expectSafeLog('cloudlayer.jobs.get', { count: 1 });
	});

	it('storage.create sends credentials but never includes them in event logs', async () => {
		const response = { title: 'Test storage', id: 'storage-1' };
		mockedRequest.mockResolvedValue(response);
		const input = {
			title: 'Test storage',
			bucket: 'documents',
			region: 'us-east-1',
			accessKeyId: 'test-access-key',
			secretAccessKey: 'test-secret-key',
		};

		const result = await Storage.create(ctx, input);

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/storage',
			'unit-test-api-key',
			{
				method: 'POST',
				body: input,
			},
		);
		expectSafeLog('cloudlayer.storage.create', { count: 1 });
	});

	it('storage.getCurrent returns the current config without logging it', async () => {
		mockedRequest.mockResolvedValue(storageConfig);

		const result = await Storage.getCurrent(ctx, {});

		expect(result).toEqual(storageConfig);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/storage',
			'unit-test-api-key',
			{
				method: 'GET',
			},
		);
		expectSafeLog('cloudlayer.storage.getCurrent', {});
	});

	it('storage.get encodes the storage ID and redacts the config', async () => {
		mockedRequest.mockResolvedValue(storageConfig);

		const result = await Storage.get(ctx, { id: 'storage/1' });

		expect(result).toEqual(storageConfig);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/storage/storage%2F1',
			'unit-test-api-key',
			{ method: 'GET' },
		);
		expectSafeLog('cloudlayer.storage.get', { count: 1 });
	});

	it('storage.remove encodes the ID and logs only a count', async () => {
		const response = { message: 'Storage configuration deleted.' };
		mockedRequest.mockResolvedValue(response);

		const result = await Storage.remove(ctx, { id: 'storage/1' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/storage/storage%2F1',
			'unit-test-api-key',
			{ method: 'DELETE' },
		);
		expectSafeLog('cloudlayer.storage.remove', { count: 1 });
	});

	describe('invalid input handling', () => {
		it('rejects invalid HTML generation before making a request', async () => {
			await expect(Html.toPdf(ctx, { html: '' })).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects URL generation with neither url nor batch', async () => {
			await expect(Url.toPdf(ctx, {})).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects a template request without exactly one template source', async () => {
			await expect(Template.toPdf(ctx, {})).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects a non-object input for the no-argument account schema', () => {
			expect(
				CloudlayerEndpointInputSchemas['account.get'].safeParse(null).success,
			).toBe(false);
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects empty asset identifiers before making a request', async () => {
			await expect(Assets.get(ctx, { id: '' })).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects empty job identifiers before making a request', async () => {
			await expect(Jobs.get(ctx, { id: '' })).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});

		it('rejects missing storage credentials before making a request', async () => {
			await expect(
				Storage.create(ctx, {
					title: '',
					bucket: 'documents',
					region: 'us-east-1',
					accessKeyId: 'test-access-key',
					secretAccessKey: 'test-secret-key',
				}),
			).rejects.toThrow();
			expect(mockedRequest).not.toHaveBeenCalled();
		});
	});
});
