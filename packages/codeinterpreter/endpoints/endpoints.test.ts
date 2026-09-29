import { logEventFromContext } from 'corsair/core';
import type { CodeInterpreterContext } from '..';
import {
	makeCodeInterpreterRequest,
	makeCodeInterpreterUpload,
} from '../client';
import { deleteFile } from './deleteFile';
import { executeCode } from './executeCode';
import { CodeInterpreterEndpointOutputSchemas } from './types';
import { uploadFile } from './uploadFile';

jest.mock('../client', () => ({
	makeCodeInterpreterRequest: jest.fn(),
	makeCodeInterpreterUpload: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn(),
}));

const mockedRequest = makeCodeInterpreterRequest as jest.Mock;
const mockedUpload = makeCodeInterpreterUpload as jest.Mock;
const mockedLog = logEventFromContext as jest.Mock;

const ctx = { key: 'test-api-key' } as CodeInterpreterContext;

describe('CodeInterpreter endpoints', () => {
	beforeEach(() => {
		mockedRequest.mockReset();
		mockedUpload.mockReset();
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
			{ sessionId: 'sess-1' },
		);
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'codeinterpreter.file.upload',
			{ filename: 'test.py' },
			'completed',
		);
		expect(result).toEqual(response);
	});

	it('propagates errors from the underlying request', async () => {
		mockedRequest.mockRejectedValueOnce(new Error('rate limited'));

		await expect(executeCode(ctx, { code: 'print(1)' })).rejects.toThrow(
			'rate limited',
		);
	});
});
