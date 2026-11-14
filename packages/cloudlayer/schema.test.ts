import type {
	CloudlayerEndpointInputs,
	CloudlayerEndpointOutputs,
} from './endpoints/types';
import {
	CloudlayerEndpointInputSchemas,
	CloudlayerEndpointOutputSchemas,
} from './endpoints/types';
import { CloudlayerSchema } from './schema';
import { cloudlayerEntities } from './schema/database';

const job = {
	id: 'job-1',
	status: 'pending' as const,
};

const binaryArtifact = {
	kind: 'binary' as const,
	contentType: 'application/pdf',
	base64: 'JVBERg==',
};

const asset = {
	id: 'asset-1',
	jobId: 'job-1',
	ext: 'pdf',
	type: 'application/pdf',
	size: 123,
	url: 'https://storage.cloudlayer.io/assets/asset-1.pdf',
	timestamp: 1_700_000_000_000,
};

const listedJob = {
	id: 'job-1',
	uid: 'user-1',
	apiKeyUsed: 'cl_live_redacted',
	type: 'html-pdf',
	status: 'success' as const,
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

const inputFixtures: CloudlayerEndpointInputs = {
	'html.toPdf': { html: 'PGgxPkhlbGxvPC9oMT4=' },
	'html.toPdfV1': { html: 'PGgxPkhlbGxvPC9oMT4=' },
	'html.toImage': { html: 'PGgxPkhlbGxvPC9oMT4=' },
	'html.toImageV1': { html: 'PGgxPkhlbGxvPC9oMT4=' },
	'url.toPdf': { url: 'https://capture.invalid' },
	'url.toPdfV1': { url: 'https://capture.invalid' },
	'url.toPdfQuick': { url: 'https://capture.invalid' },
	'url.toPdfQuickV1': { url: 'https://capture.invalid' },
	'url.toImage': { url: 'https://capture.invalid' },
	'url.toImageV1': { url: 'https://capture.invalid' },
	'url.toImageQuick': { url: 'https://capture.invalid' },
	'url.toImageQuickV1': { url: 'https://capture.invalid' },
	'template.toPdf': { templateId: 'invoice', data: { name: 'Example' } },
	'template.toPdfV1': { templateId: 'invoice', data: { name: 'Example' } },
	'template.toImage': { templateId: 'invoice', data: { name: 'Example' } },
	'template.toImageV1': { templateId: 'invoice', data: { name: 'Example' } },
	'account.get': {},
	'assets.list': { limit: 10, startAfterId: 'asset-0' },
	'assets.get': { id: 'asset-1' },
	'jobs.list': { limit: 10, startAfterId: 'job-0' },
	'jobs.listV2': { limit: 10, startAfterId: 'job-0' },
	'jobs.get': { id: 'job-1' },
	'storage.create': {
		title: 'Test storage',
		bucket: 'documents',
		region: 'us-east-1',
		accessKeyId: 'test-access-key',
		secretAccessKey: 'test-secret-key',
	},
	'storage.getCurrent': {},
	'storage.get': { id: 'storage-1' },
	'storage.remove': { id: 'storage-1' },
};

const outputFixtures: CloudlayerEndpointOutputs = {
	'html.toPdf': job,
	'html.toPdfV1': binaryArtifact,
	'html.toImage': job,
	'html.toImageV1': { ...binaryArtifact, contentType: 'image/png' },
	'url.toPdf': job,
	'url.toPdfV1': binaryArtifact,
	'url.toPdfQuick': job,
	'url.toPdfQuickV1': binaryArtifact,
	'url.toImage': job,
	'url.toImageV1': { ...binaryArtifact, contentType: 'image/png' },
	'url.toImageQuick': job,
	'url.toImageQuickV1': { ...binaryArtifact, contentType: 'image/png' },
	'template.toPdf': job,
	'template.toPdfV1': binaryArtifact,
	'template.toImage': job,
	'template.toImageV1': { ...binaryArtifact, contentType: 'image/png' },
	'account.get': {
		email: 'account@cloudlayer.invalid',
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
	},
	'assets.list': [asset],
	'assets.get': asset,
	'jobs.list': [listedJob],
	'jobs.listV2': [listedJob],
	'jobs.get': listedJob,
	'storage.create': { title: 'Test storage', id: 'storage-1' },
	'storage.getCurrent': storageConfig,
	'storage.get': storageConfig,
	'storage.remove': {
		message:
			'Storage configuration deleted. Reverting to default cloud storage.',
	},
};

const inputSchemaCases = [
	[
		'html.toPdf',
		CloudlayerEndpointInputSchemas['html.toPdf'],
		inputFixtures['html.toPdf'],
	],
	[
		'html.toPdfV1',
		CloudlayerEndpointInputSchemas['html.toPdfV1'],
		inputFixtures['html.toPdfV1'],
	],
	[
		'html.toImage',
		CloudlayerEndpointInputSchemas['html.toImage'],
		inputFixtures['html.toImage'],
	],
	[
		'html.toImageV1',
		CloudlayerEndpointInputSchemas['html.toImageV1'],
		inputFixtures['html.toImageV1'],
	],
	[
		'url.toPdf',
		CloudlayerEndpointInputSchemas['url.toPdf'],
		inputFixtures['url.toPdf'],
	],
	[
		'url.toPdfV1',
		CloudlayerEndpointInputSchemas['url.toPdfV1'],
		inputFixtures['url.toPdfV1'],
	],
	[
		'url.toPdfQuick',
		CloudlayerEndpointInputSchemas['url.toPdfQuick'],
		inputFixtures['url.toPdfQuick'],
	],
	[
		'url.toPdfQuickV1',
		CloudlayerEndpointInputSchemas['url.toPdfQuickV1'],
		inputFixtures['url.toPdfQuickV1'],
	],
	[
		'url.toImage',
		CloudlayerEndpointInputSchemas['url.toImage'],
		inputFixtures['url.toImage'],
	],
	[
		'url.toImageV1',
		CloudlayerEndpointInputSchemas['url.toImageV1'],
		inputFixtures['url.toImageV1'],
	],
	[
		'url.toImageQuick',
		CloudlayerEndpointInputSchemas['url.toImageQuick'],
		inputFixtures['url.toImageQuick'],
	],
	[
		'url.toImageQuickV1',
		CloudlayerEndpointInputSchemas['url.toImageQuickV1'],
		inputFixtures['url.toImageQuickV1'],
	],
	[
		'template.toPdf',
		CloudlayerEndpointInputSchemas['template.toPdf'],
		inputFixtures['template.toPdf'],
	],
	[
		'template.toPdfV1',
		CloudlayerEndpointInputSchemas['template.toPdfV1'],
		inputFixtures['template.toPdfV1'],
	],
	[
		'template.toImage',
		CloudlayerEndpointInputSchemas['template.toImage'],
		inputFixtures['template.toImage'],
	],
	[
		'template.toImageV1',
		CloudlayerEndpointInputSchemas['template.toImageV1'],
		inputFixtures['template.toImageV1'],
	],
	[
		'account.get',
		CloudlayerEndpointInputSchemas['account.get'],
		inputFixtures['account.get'],
	],
	[
		'assets.list',
		CloudlayerEndpointInputSchemas['assets.list'],
		inputFixtures['assets.list'],
	],
	[
		'assets.get',
		CloudlayerEndpointInputSchemas['assets.get'],
		inputFixtures['assets.get'],
	],
	[
		'jobs.list',
		CloudlayerEndpointInputSchemas['jobs.list'],
		inputFixtures['jobs.list'],
	],
	[
		'jobs.listV2',
		CloudlayerEndpointInputSchemas['jobs.listV2'],
		inputFixtures['jobs.listV2'],
	],
	[
		'jobs.get',
		CloudlayerEndpointInputSchemas['jobs.get'],
		inputFixtures['jobs.get'],
	],
	[
		'storage.create',
		CloudlayerEndpointInputSchemas['storage.create'],
		inputFixtures['storage.create'],
	],
	[
		'storage.getCurrent',
		CloudlayerEndpointInputSchemas['storage.getCurrent'],
		inputFixtures['storage.getCurrent'],
	],
	[
		'storage.get',
		CloudlayerEndpointInputSchemas['storage.get'],
		inputFixtures['storage.get'],
	],
	[
		'storage.remove',
		CloudlayerEndpointInputSchemas['storage.remove'],
		inputFixtures['storage.remove'],
	],
] as const;

const outputSchemaCases = [
	[
		'html.toPdf',
		CloudlayerEndpointOutputSchemas['html.toPdf'],
		outputFixtures['html.toPdf'],
	],
	[
		'html.toPdfV1',
		CloudlayerEndpointOutputSchemas['html.toPdfV1'],
		outputFixtures['html.toPdfV1'],
	],
	[
		'html.toImage',
		CloudlayerEndpointOutputSchemas['html.toImage'],
		outputFixtures['html.toImage'],
	],
	[
		'html.toImageV1',
		CloudlayerEndpointOutputSchemas['html.toImageV1'],
		outputFixtures['html.toImageV1'],
	],
	[
		'url.toPdf',
		CloudlayerEndpointOutputSchemas['url.toPdf'],
		outputFixtures['url.toPdf'],
	],
	[
		'url.toPdfV1',
		CloudlayerEndpointOutputSchemas['url.toPdfV1'],
		outputFixtures['url.toPdfV1'],
	],
	[
		'url.toPdfQuick',
		CloudlayerEndpointOutputSchemas['url.toPdfQuick'],
		outputFixtures['url.toPdfQuick'],
	],
	[
		'url.toPdfQuickV1',
		CloudlayerEndpointOutputSchemas['url.toPdfQuickV1'],
		outputFixtures['url.toPdfQuickV1'],
	],
	[
		'url.toImage',
		CloudlayerEndpointOutputSchemas['url.toImage'],
		outputFixtures['url.toImage'],
	],
	[
		'url.toImageV1',
		CloudlayerEndpointOutputSchemas['url.toImageV1'],
		outputFixtures['url.toImageV1'],
	],
	[
		'url.toImageQuick',
		CloudlayerEndpointOutputSchemas['url.toImageQuick'],
		outputFixtures['url.toImageQuick'],
	],
	[
		'url.toImageQuickV1',
		CloudlayerEndpointOutputSchemas['url.toImageQuickV1'],
		outputFixtures['url.toImageQuickV1'],
	],
	[
		'template.toPdf',
		CloudlayerEndpointOutputSchemas['template.toPdf'],
		outputFixtures['template.toPdf'],
	],
	[
		'template.toPdfV1',
		CloudlayerEndpointOutputSchemas['template.toPdfV1'],
		outputFixtures['template.toPdfV1'],
	],
	[
		'template.toImage',
		CloudlayerEndpointOutputSchemas['template.toImage'],
		outputFixtures['template.toImage'],
	],
	[
		'template.toImageV1',
		CloudlayerEndpointOutputSchemas['template.toImageV1'],
		outputFixtures['template.toImageV1'],
	],
	[
		'account.get',
		CloudlayerEndpointOutputSchemas['account.get'],
		outputFixtures['account.get'],
	],
	[
		'assets.list',
		CloudlayerEndpointOutputSchemas['assets.list'],
		outputFixtures['assets.list'],
	],
	[
		'assets.get',
		CloudlayerEndpointOutputSchemas['assets.get'],
		outputFixtures['assets.get'],
	],
	[
		'jobs.list',
		CloudlayerEndpointOutputSchemas['jobs.list'],
		outputFixtures['jobs.list'],
	],
	[
		'jobs.listV2',
		CloudlayerEndpointOutputSchemas['jobs.listV2'],
		outputFixtures['jobs.listV2'],
	],
	[
		'jobs.get',
		CloudlayerEndpointOutputSchemas['jobs.get'],
		outputFixtures['jobs.get'],
	],
	[
		'storage.create',
		CloudlayerEndpointOutputSchemas['storage.create'],
		outputFixtures['storage.create'],
	],
	[
		'storage.getCurrent',
		CloudlayerEndpointOutputSchemas['storage.getCurrent'],
		outputFixtures['storage.getCurrent'],
	],
	[
		'storage.get',
		CloudlayerEndpointOutputSchemas['storage.get'],
		outputFixtures['storage.get'],
	],
	[
		'storage.remove',
		CloudlayerEndpointOutputSchemas['storage.remove'],
		outputFixtures['storage.remove'],
	],
] as const;

describe('Cloudlayer schema', () => {
	it('declares a semver version and an empty entity map', () => {
		expect(CloudlayerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(CloudlayerSchema.entities).toBe(cloudlayerEntities);
		expect(CloudlayerSchema.entities).toEqual({});
	});
});

describe('Cloudlayer endpoint schemas', () => {
	it('accepts the free-plan account and empty storage list the live API returns', () => {
		// Live GET /v2/account on a new free account (11-13): no bytesLimit, and
		// no job counters until the first job runs.
		const freeAccount = {
			email: 'account@cloudlayer.invalid',
			callsLimit: 100,
			calls: 0,
			storageUsed: 0,
			storageLimit: 30_000_000,
			subscription: 'price-free',
			bytesTotal: 0,
			computeTimeTotal: 0,
			computeTimeLimit: -1,
			subType: 'limit',
			uid: 'user-1',
			subActive: true,
		};
		expect(
			CloudlayerEndpointOutputSchemas['account.get'].safeParse(freeAccount)
				.success,
		).toBe(true);
		// Live GET /v2/storage with no configuration: a bare empty array.
		expect(
			CloudlayerEndpointOutputSchemas['storage.getCurrent'].safeParse([])
				.success,
		).toBe(true);
		expect(
			CloudlayerEndpointOutputSchemas['storage.getCurrent'].safeParse([
				outputFixtures['storage.get'],
			]).success,
		).toBe(true);
	});

	it('accepts a job status or billing model the provider adds later', () => {
		expect(
			CloudlayerEndpointOutputSchemas['jobs.get'].safeParse({
				...listedJob,
				status: 'processing',
			}).success,
		).toBe(true);
		expect(
			CloudlayerEndpointOutputSchemas['html.toPdf'].safeParse({
				...job,
				status: 'processing',
			}).success,
		).toBe(true);
		expect(
			CloudlayerEndpointOutputSchemas['account.get'].safeParse({
				...outputFixtures['account.get'],
				subType: 'trial',
			}).success,
		).toBe(true);
	});

	it('requires valid absolute URLs in URL generation and batch inputs', () => {
		expect(
			CloudlayerEndpointInputSchemas['url.toPdf'].safeParse({
				url: 'example.com',
			}).success,
		).toBe(false);
		expect(
			CloudlayerEndpointInputSchemas['url.toImageQuick'].safeParse({
				url: 'https://example.com',
			}).success,
		).toBe(true);
		expect(
			CloudlayerEndpointInputSchemas['url.toPdf'].safeParse({
				batch: { urls: ['https://one.example', 'not-a-url'] },
			}).success,
		).toBe(false);
	});

	it('does not expose the provider webhook callback parameter', () => {
		expect(
			CloudlayerEndpointInputSchemas['url.toPdf'].safeParse({
				url: 'https://capture.invalid',
				webhook: 'https://callbacks.invalid/cloudlayer',
			}).success,
		).toBe(false);
	});

	it('accepts template multipart fields and requires JSON render data', () => {
		const upload = {
			template: new Blob(['<h1>Invoice</h1>'], { type: 'text/html' }),
			data: { invoiceNumber: 'INV-5' },
		};

		expect(
			CloudlayerEndpointInputSchemas['template.toPdf'].safeParse(upload)
				.success,
		).toBe(true);
		expect(
			CloudlayerEndpointInputSchemas['template.toImage'].safeParse(upload)
				.success,
		).toBe(true);
		expect(
			CloudlayerEndpointInputSchemas['template.toPdf'].safeParse({
				template: upload.template,
				data: '{"invoiceNumber":"INV-5"}',
			}).success,
		).toBe(false);
		expect(
			CloudlayerEndpointInputSchemas['template.toImage'].safeParse({
				...upload,
				format: 'png',
			}).success,
		).toBe(false);
		expect(
			CloudlayerEndpointInputSchemas['template.toImage'].safeParse({
				...upload,
				async: false,
			}).success,
		).toBe(false);
		expect(
			CloudlayerEndpointInputSchemas['template.toPdf'].safeParse({
				...upload,
				async: false,
			}).success,
		).toBe(false);
	});

	it.each([
		['html.toPdf', CloudlayerEndpointInputSchemas['html.toPdf']],
		['html.toImage', CloudlayerEndpointInputSchemas['html.toImage']],
		['url.toPdf', CloudlayerEndpointInputSchemas['url.toPdf']],
		['url.toImage', CloudlayerEndpointInputSchemas['url.toImage']],
		['template.toPdf', CloudlayerEndpointInputSchemas['template.toPdf']],
		['template.toImage', CloudlayerEndpointInputSchemas['template.toImage']],
	] as const)('validates async:false input mode for %s', (name, schema) => {
		expect(
			schema.safeParse({ ...inputFixtures[name], async: false }).success,
		).toBe(true);
	});

	it('requires synchronous mode when storage is disabled', () => {
		const input = inputFixtures['html.toPdf'];
		expect(
			CloudlayerEndpointInputSchemas['html.toPdf'].safeParse({
				...input,
				storage: false,
			}).success,
		).toBe(false);
		expect(
			CloudlayerEndpointInputSchemas['html.toPdf'].safeParse({
				...input,
				async: false,
				storage: false,
			}).success,
		).toBe(true);
	});

	it.each([
		'html.toPdf',
		'html.toImage',
		'url.toPdf',
		'url.toImage',
		'template.toPdf',
		'template.toImage',
	] as const)('validates a binary artifact for %s output', (name) => {
		expect(
			CloudlayerEndpointOutputSchemas[name].safeParse(binaryArtifact).success,
		).toBe(true);
	});

	for (const [name, schema, fixture] of inputSchemaCases) {
		it(`validates ${name} input`, () => {
			expect(schema.safeParse(fixture).success).toBe(true);
			expect(schema.safeParse(null).success).toBe(false);
		});
	}

	for (const [name, schema, fixture] of outputSchemaCases) {
		it(`validates ${name} output`, () => {
			expect(schema.safeParse(fixture).success).toBe(true);
			expect(schema.safeParse(null).success).toBe(false);
		});
	}
});
