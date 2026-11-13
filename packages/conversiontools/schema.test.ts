import {
	AccountGetConfigInputSchema,
	AccountGetConfigResponseSchema,
	AccountGetInfoInputSchema,
	AccountGetInfoResponseSchema,
	AccountVerifyInputSchema,
	AccountVerifyResponseSchema,
	ConversionsGetInputSchema,
	ConversionsGetResponseSchema,
	ConversionsListInputSchema,
	ConversionsListResponseSchema,
	FilesCreateDownloadLinkInputSchema,
	FilesCreateDownloadLinkResponseSchema,
	FilesCreateUploadSessionInputSchema,
	FilesCreateUploadSessionResponseSchema,
	FilesDownloadByIdInputSchema,
	FilesDownloadFromLinkInputSchema,
	FilesDownloadOutputSchema,
	FilesGetInfoInputSchema,
	FilesGetInfoResponseSchema,
	FilesUploadInputSchema,
	FilesUploadResponseSchema,
	FilesUploadToSessionInputSchema,
	FilesUploadToSessionResponseSchema,
	TasksCreateInputSchema,
	TasksCreateResponseSchema,
	TasksGetInputSchema,
	TasksGetResponseSchema,
	TasksListInputSchema,
	TasksListResponseSchema,
	TasksRemoveInputSchema,
	TasksRemoveResponseSchema,
	TasksUpdateRetentionInputSchema,
	TasksUpdateRetentionResponseSchema,
} from './endpoints/types';
import { ConversiontoolsSchema } from './schema';
import { conversiontoolsEntities } from './schema/database';

const conversion = {
	type: 'convert.xml_to_json',
	title: 'XML to JSON',
	input_format: 'xml',
	output_format: 'json',
};
const FILE_ID = '0123456789abcdef0123456789abcdef';
const TASK_ID = 'fedcba9876543210fedcba9876543210';
const DOWNLOAD_ID = 'abcdef0123456789abcdef0123456789';

describe('Conversion Tools database schema', () => {
	it('declares a semver version and no local entities', () => {
		expect(ConversiontoolsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(ConversiontoolsSchema.entities).toBe(conversiontoolsEntities);
		expect(ConversiontoolsSchema.entities).toEqual({});
	});
});

describe('Conversion Tools endpoint input and output schemas', () => {
	it('validates account.verify', () => {
		expect(AccountVerifyInputSchema.safeParse({}).success).toBe(true);
		expect(AccountVerifyInputSchema.safeParse({ extra: true }).success).toBe(
			false,
		);
		expect(AccountVerifyResponseSchema.safeParse({ error: null }).success).toBe(
			true,
		);
		expect(AccountVerifyResponseSchema.safeParse({ error: 401 }).success).toBe(
			false,
		);
	});

	it('validates account.getInfo', () => {
		expect(AccountGetInfoInputSchema.safeParse({}).success).toBe(true);
		expect(AccountGetInfoInputSchema.safeParse({ extra: true }).success).toBe(
			false,
		);
		expect(
			AccountGetInfoResponseSchema.safeParse({
				error: null,
				email: 'agent@example.com',
			}).success,
		).toBe(true);
		expect(
			AccountGetInfoResponseSchema.safeParse({ email: 'not-an-email' }).success,
		).toBe(false);
	});

	it('validates account.getConfig', () => {
		expect(AccountGetConfigInputSchema.safeParse({}).success).toBe(true);
		expect(AccountGetConfigInputSchema.safeParse({ extra: true }).success).toBe(
			false,
		);
		// Live GET /v1/config response (11-13), trimmed.
		expect(
			AccountGetConfigResponseSchema.safeParse({
				error: null,
				data: {
					conversions: [],
					subscriptionStatus: 'active',
					canPause: true,
					canResume: false,
				},
			}).success,
		).toBe(true);
		expect(
			AccountGetConfigResponseSchema.safeParse({ error: null, conversions: [] })
				.success,
		).toBe(false);
		expect(
			AccountGetConfigResponseSchema.safeParse({
				error: 2,
				data: { conversions: [] },
			}).success,
		).toBe(false);
	});

	it('validates conversions.list', () => {
		expect(
			ConversionsListInputSchema.safeParse({
				input: 'xml',
				output: 'json',
				ai: false,
			}).success,
		).toBe(true);
		expect(ConversionsListInputSchema.safeParse({ ai: 'false' }).success).toBe(
			false,
		);
		expect(
			ConversionsListResponseSchema.safeParse({
				error: null,
				count: 1,
				conversions: [conversion],
			}).success,
		).toBe(true);
		expect(
			ConversionsListResponseSchema.safeParse({
				error: null,
				count: -1,
				conversions: [],
			}).success,
		).toBe(false);
	});

	it('validates conversions.get', () => {
		expect(
			ConversionsGetInputSchema.safeParse({ type: 'convert.xml_to_json' })
				.success,
		).toBe(true);
		expect(ConversionsGetInputSchema.safeParse({ type: '' }).success).toBe(
			false,
		);
		expect(
			ConversionsGetResponseSchema.safeParse({ error: null, conversion })
				.success,
		).toBe(true);
		expect(
			ConversionsGetResponseSchema.safeParse({ error: null }).success,
		).toBe(false);
	});

	it('validates files.upload', () => {
		expect(
			FilesUploadInputSchema.safeParse({ file: new Blob(['xml']) }).success,
		).toBe(true);
		expect(
			FilesUploadInputSchema.safeParse({ file: 'input.xml' }).success,
		).toBe(false);
		expect(
			FilesUploadResponseSchema.safeParse({ error: null, file_id: FILE_ID })
				.success,
		).toBe(true);
		expect(FilesUploadResponseSchema.safeParse({ error: null }).success).toBe(
			false,
		);
		expect(
			FilesUploadResponseSchema.safeParse({ error: null, file_id: 'file-id' })
				.success,
		).toBe(false);
	});

	it('validates files.getInfo', () => {
		expect(
			FilesGetInfoInputSchema.safeParse({ file_id: FILE_ID }).success,
		).toBe(true);
		expect(FilesGetInfoInputSchema.safeParse({ file_id: '' }).success).toBe(
			false,
		);
		expect(
			FilesGetInfoInputSchema.safeParse({ file_id: 'file-id' }).success,
		).toBe(false);
		expect(
			FilesGetInfoResponseSchema.safeParse({
				preview: false,
				size: 123,
				name: 'result.txt',
				previewData: ['text'],
			}).success,
		).toBe(true);
		// Live GET /v1/files/{file_id}/info response (11-13), trimmed.
		expect(
			FilesGetInfoResponseSchema.safeParse({
				size: 27,
				name: 'input.xml',
				previewData: '<root><item>1</item></root>\n',
				detectedFormat: null,
				renderHint: 'xml',
				canViewInline: true,
			}).success,
		).toBe(true);
		expect(
			FilesGetInfoResponseSchema.safeParse({ preview: 'false', size: 123 })
				.success,
		).toBe(false);
	});

	it('validates files.createDownloadLink', () => {
		expect(
			FilesCreateDownloadLinkInputSchema.safeParse({ file_id: FILE_ID })
				.success,
		).toBe(true);
		expect(
			FilesCreateDownloadLinkInputSchema.safeParse({ file_id: '' }).success,
		).toBe(false);
		expect(
			FilesCreateDownloadLinkInputSchema.safeParse({ file_id: 'file-id' })
				.success,
		).toBe(false);
		expect(
			FilesCreateDownloadLinkResponseSchema.safeParse({
				file_id: FILE_ID,
				download_id: DOWNLOAD_ID,
			}).success,
		).toBe(true);
		expect(
			FilesCreateDownloadLinkResponseSchema.safeParse({ file_id: FILE_ID })
				.success,
		).toBe(false);
	});

	it('validates files.createUploadSession', () => {
		expect(
			FilesCreateUploadSessionInputSchema.safeParse({ filename: 'input.xml' })
				.success,
		).toBe(true);
		expect(
			FilesCreateUploadSessionInputSchema.safeParse({ filename: '' }).success,
		).toBe(false);
		expect(
			FilesCreateUploadSessionResponseSchema.safeParse({
				upload_url:
					'https://api.conversiontools.io/v1/upload-sessions/session-id',
				file_id: FILE_ID,
				expires_in: 300,
			}).success,
		).toBe(true);
		expect(
			FilesCreateUploadSessionResponseSchema.safeParse({
				upload_url: 'not-a-url',
				file_id: FILE_ID,
				expires_in: 300,
			}).success,
		).toBe(false);
	});

	it('validates both raw download inputs and the JSON-safe binary output', () => {
		const output = {
			contentBase64: 'AAEC/w==',
			contentType: 'application/octet-stream',
			contentDisposition: 'attachment; filename="result.bin"',
			size: 4,
		};

		expect(
			FilesDownloadByIdInputSchema.safeParse({ file_id: FILE_ID }).success,
		).toBe(true);
		expect(
			FilesDownloadByIdInputSchema.safeParse({ file_id: 'not-an-id' }).success,
		).toBe(false);
		expect(
			FilesDownloadByIdInputSchema.safeParse({ file_id: `${FILE_ID}\n` })
				.success,
		).toBe(false);
		expect(
			FilesDownloadFromLinkInputSchema.safeParse({ download_id: DOWNLOAD_ID })
				.success,
		).toBe(true);
		expect(
			FilesDownloadFromLinkInputSchema.safeParse({ download_id: 'not-an-id' })
				.success,
		).toBe(false);
		expect(FilesDownloadOutputSchema.safeParse(output).success).toBe(true);
		expect(
			FilesDownloadOutputSchema.safeParse({
				...output,
				contentBase64: '%%%bad',
			}).success,
		).toBe(false);
		expect(
			FilesDownloadOutputSchema.safeParse({ ...output, size: -1 }).success,
		).toBe(false);
		expect(
			FilesDownloadOutputSchema.safeParse({ ...output, contentType: '' })
				.success,
		).toBe(false);
	});

	it('validates files.uploadToSession', () => {
		const uploadUrl =
			'https://api.conversiontools.io/v1/upload-sessions/session-id';
		expect(
			FilesUploadToSessionInputSchema.safeParse({
				upload_url: uploadUrl,
				file: new Blob(['xml']),
			}).success,
		).toBe(true);
		expect(
			FilesUploadToSessionInputSchema.safeParse({ upload_url: uploadUrl })
				.success,
		).toBe(false);
		expect(
			FilesUploadToSessionResponseSchema.safeParse({
				file_id: FILE_ID,
				filename: 'input.xml',
				size: 3,
			}).success,
		).toBe(true);
		expect(
			FilesUploadToSessionResponseSchema.safeParse({ file_id: FILE_ID })
				.success,
		).toBe(false);
	});

	it('validates tasks.create', () => {
		expect(
			TasksCreateInputSchema.safeParse({
				type: 'convert.xml_to_json',
				options: { file_id: FILE_ID, sandbox: true },
			}).success,
		).toBe(true);
		expect(
			TasksCreateInputSchema.safeParse({
				type: 'convert.website_to_pdf',
				options: { url: 'https://example.com' },
			}).success,
		).toBe(true);
		expect(
			TasksCreateInputSchema.safeParse({
				type: 'convert.xml_to_json',
				options: { file_id: FILE_ID },
				file_id: FILE_ID,
			}).success,
		).toBe(false);
		expect(
			TasksCreateInputSchema.safeParse({
				type: 'convert.xml_to_json',
				options: {
					file_id: FILE_ID,
					callbackUrl: 'https://example.test/hook',
				},
			}).success,
		).toBe(false);
		expect(
			TasksCreateInputSchema.safeParse({
				type: 'convert.xml_to_json',
				options: {},
			}).success,
		).toBe(false);
		expect(
			TasksCreateResponseSchema.safeParse({ error: null, task_id: TASK_ID })
				.success,
		).toBe(true);
		expect(TasksCreateResponseSchema.safeParse({ error: null }).success).toBe(
			false,
		);
		expect(
			TasksCreateResponseSchema.safeParse({ error: null, task_id: 'task-id' })
				.success,
		).toBe(false);
	});

	it('validates tasks.list', () => {
		expect(TasksListInputSchema.safeParse({ status: 'RUNNING' }).success).toBe(
			true,
		);
		expect(TasksListInputSchema.safeParse({ status: 'WAITING' }).success).toBe(
			false,
		);
		expect(
			TasksListResponseSchema.safeParse({
				error: null,
				data: [{ id: TASK_ID, status: 'SUCCESS' }],
			}).success,
		).toBe(true);
		expect(
			TasksListResponseSchema.safeParse({ error: null, data: 'none' }).success,
		).toBe(false);
	});

	it('validates tasks.get', () => {
		expect(TasksGetInputSchema.safeParse({ task_id: TASK_ID }).success).toBe(
			true,
		);
		expect(TasksGetInputSchema.safeParse({ task_id: 'task-id' }).success).toBe(
			false,
		);
		expect(
			TasksGetResponseSchema.safeParse({
				error: null,
				status: 'PENDING',
				file_id: null,
				conversionProgress: 0,
			}).success,
		).toBe(true);
		// A status the API adds later still parses; a missing one does not.
		expect(
			TasksGetResponseSchema.safeParse({
				error: null,
				status: 'WAITING',
				file_id: null,
			}).success,
		).toBe(true);
		expect(
			TasksGetResponseSchema.safeParse({ error: null, file_id: null }).success,
		).toBe(false);
	});

	it('validates tasks.updateRetention', () => {
		expect(
			TasksUpdateRetentionInputSchema.safeParse({
				task_id: TASK_ID,
				retentionMode: 'ttl_15m',
			}).success,
		).toBe(true);
		expect(
			TasksUpdateRetentionInputSchema.safeParse({
				task_id: TASK_ID,
				retentionMode: 'ttl_1m',
			}).success,
		).toBe(false);
		expect(
			TasksUpdateRetentionInputSchema.safeParse({
				task_id: 'task-id',
				retentionMode: 'ttl_15m',
			}).success,
		).toBe(false);
		expect(
			TasksUpdateRetentionResponseSchema.safeParse({
				retentionMode: 'standard_24h',
				dateExpires: '2026-11-11T12:00:00.000Z',
			}).success,
		).toBe(true);
		expect(
			TasksUpdateRetentionResponseSchema.safeParse({
				retentionMode: 'standard_24h',
			}).success,
		).toBe(false);
	});

	it('validates tasks.remove', () => {
		expect(TasksRemoveInputSchema.safeParse({ task_id: TASK_ID }).success).toBe(
			true,
		);
		expect(
			TasksRemoveInputSchema.safeParse({ task_id: 'task-id' }).success,
		).toBe(false);
		expect(
			TasksRemoveResponseSchema.safeParse({
				message: 'File deletion scheduled',
				dateDeleted: '2026-11-11T12:00:00.000Z',
			}).success,
		).toBe(true);
		expect(TasksRemoveResponseSchema.safeParse({ message: 1 }).success).toBe(
			false,
		);
	});
});
