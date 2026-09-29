import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterContext } from '..';
import {
	makeCodeInterpreterDownload,
	makeCodeInterpreterRequest,
	makeCodeInterpreterUpload,
} from '../client';
import { deleteFile } from './deleteFile';
import { downloadFile } from './downloadFile';
import { executeCode } from './executeCode';
import { listFiles } from './listFiles';
import { CodeInterpreterEndpointOutputSchemas } from './types';
import { uploadFile } from './uploadFile';

jest.mock('../client', () => ({
	makeCodeInterpreterRequest: jest.fn(),
	makeCodeInterpreterUpload: jest.fn(),
	makeCodeInterpreterDownload: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = makeCodeInterpreterRequest as jest.Mock;
const mockedUpload = makeCodeInterpreterUpload as jest.Mock;
const mockedDownload = makeCodeInterpreterDownload as jest.Mock;
const mockedLog = logEventFromContext as jest.Mock;

const ctx = {
	key: 'test-api-key',
	options: { baseUrl: 'https://ci.example.com' },
} as CodeInterpreterContext;

describe('CodeInterpreter endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedUpload.mockReset();
		mockedDownload.mockReset();
		mockedLog.mockReset();
	});

	it('executeCode calls POST /exec and omits source code from the event log', async () => {
		const response = {
			exit_code: 0,
			stdout: 'Hello\n',
			session_id: 'sess-1',
		};
		mockedRequest.mockResolvedValueOnce(response);

		const input = {
			code: 'print("Hello")',
			language: 'python',
			session_id: 'sess-1',
		};
		const result = await executeCode(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('exec', 'test-api-key', {
			method: 'POST',
			body: input,
			baseUrl: 'https://ci.example.com',
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.code.execute',
			{ language: 'python', session_id: 'sess-1' },
			'completed',
		);
		expect(result).toEqual(response);
		expect(
			CodeInterpreterEndpointOutputSchemas.executeCode.safeParse(result)
				.success,
		).toBe(true);
	});

	it('deleteFile sends file_id and session_id as query parameters', async () => {
		const response = { success: true, file_id: 'file-1' };
		mockedRequest.mockResolvedValueOnce(response);

		const input = { file_id: 'file-1', session_id: 'sess-1' };
		const result = await deleteFile(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith('files', 'test-api-key', {
			method: 'DELETE',
			query: {
				file_id: 'file-1',
				session_id: 'sess-1',
			},
			baseUrl: 'https://ci.example.com',
		});
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.file.delete',
			{ file_id: 'file-1' },
			'completed',
		);
		expect(result).toEqual(response);
	});

	it('uploadFile posts multipart data via the upload client', async () => {
		const response = {
			file_id: 'file-1',
			filename: 'test.py',
			size: 8,
		};
		mockedUpload.mockResolvedValueOnce(response);

		const input = {
			filename: 'test.py',
			content: 'print(1)',
			session_id: 'sess-1',
			mime_type: 'text/x-python',
		};
		const result = await uploadFile(ctx, input);

		expect(mockedUpload).toHaveBeenCalledWith(
			'test-api-key',
			{
				filename: 'test.py',
				content: 'print(1)',
				mimeType: 'text/x-python',
			},
			{ sessionId: 'sess-1', baseUrl: 'https://ci.example.com' },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.file.upload',
			{ filename: 'test.py' },
			'completed',
		);
		expect(result).toEqual(response);
	});

	it('listFiles calls GET /files with session_id query', async () => {
		const response = {
			files: [{ id: 'file-1', name: 'test.py', size: 8 }],
		};
		mockedRequest.mockResolvedValueOnce(response);

		const input = { session_id: 'sess-1' };
		const result = await listFiles(ctx, input);

		expect(mockedRequest).toHaveBeenCalledWith(
			'files?session_id=sess-1',
			'test-api-key',
			{ method: 'GET', baseUrl: 'https://ci.example.com' },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.file.list',
			input,
			'completed',
		);
		expect(result).toEqual(response);
	});

	it('downloadFile uses the byte-preserving download client', async () => {
		mockedDownload.mockResolvedValueOnce({
			base64: 'cHJpbnQoMSk=',
			contentType: 'text/x-python',
			filename: 'test.py',
		});

		const input = { file_id: 'file-1', session_id: 'sess-1' };
		const result = await downloadFile(ctx, input);

		expect(mockedDownload).toHaveBeenCalledWith(
			'files/file-1?session_id=sess-1',
			'test-api-key',
			{ baseUrl: 'https://ci.example.com' },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.file.download',
			{ file_id: 'file-1' },
			'completed',
		);
		expect(result).toEqual({
			file_id: 'file-1',
			filename: 'test.py',
			content: 'cHJpbnQoMSk=',
			mime_type: 'text/x-python',
		});
		expect(
			CodeInterpreterEndpointOutputSchemas.downloadFile.safeParse(result)
				.success,
		).toBe(true);
	});

	it('propagates errors from the underlying request', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('rate limited'));

		await expect(executeCode(ctx, { code: 'print(1)' })).rejects.toThrow(
			'rate limited',
		);
	});
});
