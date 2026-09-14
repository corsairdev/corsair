import { CodeInterpreterSchema } from './schema';
import {
	CodeInterpreterSession,
	CodeInterpreterFile,
	CodeInterpreterExecution,
} from './schema/database';
import {
	ExecuteCodeInputSchema,
	ExecuteCodeResponseSchema,
	UploadFileInputSchema,
	UploadFileResponseSchema,
	ListFilesInputSchema,
	ListFilesResponseSchema,
	DownloadFileInputSchema,
	DownloadFileResponseSchema,
	DeleteFileInputSchema,
	DeleteFileResponseSchema,
} from './endpoints/types';
import {
	ExecutionCompletedEventSchema,
	ExecutionFailedEventSchema,
	FileReadyEventSchema,
} from './webhooks/types';

describe('CodeInterpreter schema', () => {
	it('declares a semver version', () => {
		expect(CodeInterpreterSchema.version).toBeDefined();
		expect(CodeInterpreterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares registered entity schemas', () => {
		expect(typeof CodeInterpreterSchema.entities).toBe('object');
		expect(CodeInterpreterSchema.entities.sessions).toBe(CodeInterpreterSession);
		expect(CodeInterpreterSchema.entities.files).toBe(CodeInterpreterFile);
		expect(CodeInterpreterSchema.entities.executions).toBe(CodeInterpreterExecution);
	});
});

describe('Database Entity Schemas', () => {
	it('validates CodeInterpreterSession', () => {
		const validSession = {
			id: 'sess-123',
			status: 'active',
			language: 'python',
		};
		expect(CodeInterpreterSession.parse(validSession)).toMatchObject(validSession);

		const invalidSession = { id: 'sess-123', status: 'unknown_status' };
		expect(() => CodeInterpreterSession.parse(invalidSession)).toThrow();
	});

	it('validates CodeInterpreterFile', () => {
		const validFile = {
			id: 'file-123',
			name: 'script.py',
			size: 1024,
			mime_type: 'text/x-python',
		};
		expect(CodeInterpreterFile.parse(validFile)).toMatchObject(validFile);
	});

	it('validates CodeInterpreterExecution', () => {
		const validExec = {
			exit_code: 0,
			stdout: 'Hello World',
			session_id: 'sess-123',
		};
		expect(CodeInterpreterExecution.parse(validExec)).toMatchObject(validExec);
	});
});

describe('Endpoint Input/Output Schemas', () => {
	it('validates executeCode schemas', () => {
		const input = { code: 'print("Hello")', language: 'python' };
		expect(ExecuteCodeInputSchema.parse(input)).toMatchObject(input);

		const response = { exit_code: 0, stdout: 'Hello\n' };
		expect(ExecuteCodeResponseSchema.parse(response)).toMatchObject(response);

		expect(() => ExecuteCodeInputSchema.parse({ code: '' })).toThrow();
	});

	it('validates uploadFile schemas', () => {
		const input = { filename: 'test.py', content: 'print(1)' };
		expect(UploadFileInputSchema.parse(input)).toMatchObject(input);

		const response = { file_id: 'f-1', filename: 'test.py', size: 8 };
		expect(UploadFileResponseSchema.parse(response)).toMatchObject(response);
	});

	it('validates listFiles schemas', () => {
		const input = { session_id: 'sess-1' };
		expect(ListFilesInputSchema.parse(input)).toMatchObject(input);

		const response = { files: [{ id: 'f-1', name: 'test.py', size: 10 }] };
		expect(ListFilesResponseSchema.parse(response)).toMatchObject(response);
	});

	it('validates downloadFile schemas', () => {
		const input = { file_id: 'f-1' };
		expect(DownloadFileInputSchema.parse(input)).toMatchObject(input);

		const response = { file_id: 'f-1', filename: 'test.py', content: 'print(1)' };
		expect(DownloadFileResponseSchema.parse(response)).toMatchObject(response);
	});

	it('validates deleteFile schemas', () => {
		const input = { file_id: 'f-1' };
		expect(DeleteFileInputSchema.parse(input)).toMatchObject(input);

		const response = { success: true, file_id: 'f-1' };
		expect(DeleteFileResponseSchema.parse(response)).toMatchObject(response);
	});
});

describe('Webhook Schemas', () => {
	it('validates ExecutionCompletedEventSchema', () => {
		const payload = {
			type: 'execution.completed',
			created_at: '2026-09-09T12:00:00Z',
			data: {
				session_id: 'sess-1',
				exit_code: 0,
				stdout: 'Success',
			},
		};
		expect(ExecutionCompletedEventSchema.parse(payload)).toMatchObject(payload);
	});

	it('validates ExecutionFailedEventSchema', () => {
		const payload = {
			type: 'execution.failed',
			created_at: '2026-09-09T12:00:00Z',
			data: {
				session_id: 'sess-1',
				error: 'SyntaxError',
			},
		};
		expect(ExecutionFailedEventSchema.parse(payload)).toMatchObject(payload);
	});

	it('validates FileReadyEventSchema', () => {
		const payload = {
			type: 'file.ready',
			created_at: '2026-09-09T12:00:00Z',
			data: {
				session_id: 'sess-1',
				file_id: 'file-1',
				filename: 'chart.png',
			},
		};
		expect(FileReadyEventSchema.parse(payload)).toMatchObject(payload);
	});
});
