import {
	makeCodeInterpreterDownload,
	makeCodeInterpreterRequest,
	makeCodeInterpreterUpload,
} from './client';
import type {
	DeleteFileResponse,
	ExecuteCodeResponse,
	ListFilesResponse,
	UploadFileResponse,
} from './endpoints/types';
import { CodeInterpreterEndpointOutputSchemas } from './endpoints/types';

const LIVE = Boolean(process.env.CODEINTERPRETER_API_KEY);
const describeLive = LIVE ? describe : describe.skip;

describe('codeinterpreter live-test gate', () => {
	it('documents the env vars required for live tests', () => {
		expect(typeof LIVE).toBe('boolean');
		expect(LIVE).toBe(Boolean(process.env.CODEINTERPRETER_API_KEY));
	});
});

describeLive('codeinterpreter live API', () => {
	// why safe: env presence is guaranteed by the LIVE gate — this block only runs when CODEINTERPRETER_API_KEY is set.
	const apiKey = process.env.CODEINTERPRETER_API_KEY as string;
	const baseUrl = process.env.CODEINTERPRETER_BASE_URL;

	it('executes code', async () => {
		const result = await makeCodeInterpreterRequest<ExecuteCodeResponse>(
			'exec',
			apiKey,
			{
				method: 'POST',
				body: { code: 'print(1+1)', lang: 'py' },
				baseUrl,
			},
		);
		const parsed =
			CodeInterpreterEndpointOutputSchemas.executeCode.safeParse(result);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(typeof parsed.data.exit_code).toBe('number');
		}
	}, 60000);

	it('lists files', async () => {
		const result = await makeCodeInterpreterRequest<ListFilesResponse>(
			'files',
			apiKey,
			{
				method: 'GET',
				baseUrl,
			},
		);
		const parsed =
			CodeInterpreterEndpointOutputSchemas.listFiles.safeParse(result);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(Array.isArray(parsed.data.files)).toBe(true);
		}
	}, 60000);

	it('uploads, downloads, and deletes a file', async () => {
		const content = 'hello from live test';
		const uploaded = await makeCodeInterpreterUpload<UploadFileResponse>(
			apiKey,
			{ filename: 'hello.txt', content, mimeType: 'text/plain' },
			{ baseUrl },
		);
		const uploadParsed =
			CodeInterpreterEndpointOutputSchemas.uploadFile.safeParse(uploaded);
		expect(uploadParsed.success).toBe(true);
		if (!uploadParsed.success) {
			throw new Error('upload response failed schema validation');
		}
		const fileId = uploadParsed.data.file_id;
		expect(typeof fileId).toBe('string');

		try {
			const downloaded = await makeCodeInterpreterDownload(
				`files/${encodeURIComponent(fileId)}`,
				apiKey,
				{ baseUrl },
			);
			expect(typeof downloaded.base64).toBe('string');
			expect(typeof downloaded.contentType).toBe('string');
			const roundTripped = Buffer.from(downloaded.base64, 'base64').toString(
				'utf8',
			);
			expect(roundTripped).toBe(content);
			const downloadParsed =
				CodeInterpreterEndpointOutputSchemas.downloadFile.safeParse({
					file_id: fileId,
					filename: downloaded.filename,
					content: downloaded.base64,
					mime_type: downloaded.contentType,
				});
			expect(downloadParsed.success).toBe(true);
		} finally {
			const deleted = await makeCodeInterpreterRequest<DeleteFileResponse>(
				'files',
				apiKey,
				{
					method: 'DELETE',
					query: { file_id: fileId },
					baseUrl,
				},
			);
			const deleteParsed =
				CodeInterpreterEndpointOutputSchemas.deleteFile.safeParse(deleted);
			expect(deleteParsed.success).toBe(true);
		}
	}, 60000);
});
