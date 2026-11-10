import { HiggsfieldEndpointInputSchemas } from './endpoints/types';
import { HiggsfieldSchema } from './schema';

describe('Higgsfield schema', () => {
	it('declares a semver version and mirrors nothing locally', () => {
		expect(HiggsfieldSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(HiggsfieldSchema.entities).toEqual({});
	});
});

describe('input schemas', () => {
	const submit = HiggsfieldEndpointInputSchemas.generationsSubmit;
	const input = { prompt: 'a lake' };

	it.each([
		'higgsfield-ai/soul/v2/standard',
		'kling-video/v2.5-turbo/pro/text-to-video',
		'higgsfield/cinema-studio/4.0',
		'soul-id',
		'/z-image/turbo',
	])('accepts the model path %s', (modelPath) => {
		expect(submit.safeParse({ modelPath, input }).success).toBe(true);
	});

	it.each([
		'https://evil.example/x',
		'//evil.example/x',
		'a/../b',
		'a/b?x=1',
		'a/b#frag',
		'a/%2e%2e/b',
		'a\\b',
		'requests/abc/cancel',
		'files/generate-upload-url',
		'estimate/a/b',
		'models/usage',
		'v1/custom-references',
		'',
	])('refuses the model path %p', (modelPath) => {
		expect(submit.safeParse({ modelPath, input }).success).toBe(false);
	});

	it('takes only an https webhook URL without credentials', () => {
		const parse = (webhookUrl: string) =>
			submit.safeParse({ modelPath: 'a/b', input, webhookUrl }).success;
		expect(parse('https://example.com/hook?tenantId=t1')).toBe(true);
		expect(parse('http://example.com/hook')).toBe(false);
		expect(parse('ftp://example.com/hook')).toBe(false);
		expect(parse('https://user:pass@example.com/hook')).toBe(false);
		expect(parse('not a url')).toBe(false);
	});

	it('holds idempotency keys to what the API allows', () => {
		const parse = (idempotencyKey: string) =>
			submit.safeParse({ modelPath: 'a/b', input, idempotencyKey }).success;
		expect(parse('c8a7f1de-7b7e-4fb4-a1f0-5d7a2f4f0a11')).toBe(true);
		expect(parse('a'.repeat(255))).toBe(true);
		expect(parse('a'.repeat(256))).toBe(false);
		expect(parse('has space')).toBe(false);
		expect(parse('')).toBe(false);
		expect(parse('ünicode')).toBe(false);
	});

	it('holds expiresAfter to one hour through seven days', () => {
		const parse = (expiresAfter: number) =>
			submit.safeParse({ modelPath: 'a/b', input, expiresAfter }).success;
		expect(parse(3600)).toBe(true);
		expect(parse(604800)).toBe(true);
		expect(parse(3599)).toBe(false);
		expect(parse(604801)).toBe(false);
	});

	it('caps waitSeconds at 15', () => {
		const run = HiggsfieldEndpointInputSchemas.generationsRun;
		const parse = (waitSeconds: number) =>
			run.safeParse({ modelPath: 'a/b', input, waitSeconds }).success;
		expect(parse(0)).toBe(true);
		expect(parse(15)).toBe(true);
		expect(parse(15.5)).toBe(false);
		expect(parse(-1)).toBe(false);
	});

	it.each(['../keys', 'a/b', 'a?b', 'a#b', '', 'a b', '.hidden'])(
		'refuses the request id %p',
		(requestId) => {
			expect(
				HiggsfieldEndpointInputSchemas.requestsStatus.safeParse({ requestId })
					.success,
			).toBe(false);
		},
	);

	it('files.upload takes base64 and an allowed type', () => {
		const upload = HiggsfieldEndpointInputSchemas.filesUpload;
		expect(
			upload.safeParse({ contentBase64: 'YWJj', contentType: 'image/png' })
				.success,
		).toBe(true);
		expect(upload.safeParse({}).success).toBe(false);
		expect(upload.safeParse({ contentBase64: 'YWJj' }).success).toBe(false);
		expect(
			upload.safeParse({ contentBase64: '', contentType: 'image/png' }).success,
		).toBe(false);
		expect(
			upload.safeParse({
				contentBase64: 'YWJj',
				contentType: 'application/pdf',
			}).success,
		).toBe(false);
	});
});
