import { z } from 'zod';

// Execute Code
export const ExecuteCodeInputSchema = z.object({
	code: z.string().min(1, 'Code is required'),
	language: z.string().optional(),
	session_id: z.string().optional(),
	args: z.array(z.string()).optional(),
	files: z.array(z.string()).optional(),
});
export type ExecuteCodeInput = z.infer<typeof ExecuteCodeInputSchema>;

export const ExecuteCodeResponseSchema = z.object({
	exit_code: z.number(),
	stdout: z.string().optional(),
	stderr: z.string().optional(),
	logs: z.string().optional(),
	output_files: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.optional(),
	session_id: z.string().optional(),
});
export type ExecuteCodeResponse = z.infer<typeof ExecuteCodeResponseSchema>;

// Upload File
export const UploadFileInputSchema = z.object({
	filename: z.string().min(1, 'Filename is required'),
	content: z.string(),
	session_id: z.string().optional(),
	mime_type: z.string().optional(),
});
export type UploadFileInput = z.infer<typeof UploadFileInputSchema>;

export const UploadFileResponseSchema = z.object({
	file_id: z.string(),
	filename: z.string(),
	size: z.number().optional(),
	session_id: z.string().optional(),
});
export type UploadFileResponse = z.infer<typeof UploadFileResponseSchema>;

// List Files
export const ListFilesInputSchema = z.object({
	session_id: z.string().optional(),
});
export type ListFilesInput = z.infer<typeof ListFilesInputSchema>;

export const ListFilesResponseSchema = z.object({
	files: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			size: z.number().optional(),
			mime_type: z.string().optional(),
		}),
	),
});
export type ListFilesResponse = z.infer<typeof ListFilesResponseSchema>;

// Download File
export const DownloadFileInputSchema = z.object({
	file_id: z.string().min(1, 'File ID is required'),
	session_id: z.string().optional(),
});
export type DownloadFileInput = z.infer<typeof DownloadFileInputSchema>;

export const DownloadFileResponseSchema = z.object({
	file_id: z.string(),
	filename: z.string().optional(),
	content: z.string(),
	mime_type: z.string().optional(),
});
export type DownloadFileResponse = z.infer<typeof DownloadFileResponseSchema>;

// Delete File
export const DeleteFileInputSchema = z.object({
	file_id: z.string().min(1, 'File ID is required'),
	session_id: z.string().optional(),
});
export type DeleteFileInput = z.infer<typeof DeleteFileInputSchema>;

export const DeleteFileResponseSchema = z.object({
	success: z.boolean(),
	file_id: z.string(),
});
export type DeleteFileResponse = z.infer<typeof DeleteFileResponseSchema>;

export type CodeInterpreterEndpointInputs = {
	executeCode: ExecuteCodeInput;
	uploadFile: UploadFileInput;
	listFiles: ListFilesInput;
	downloadFile: DownloadFileInput;
	deleteFile: DeleteFileInput;
};

export type CodeInterpreterEndpointOutputs = {
	executeCode: ExecuteCodeResponse;
	uploadFile: UploadFileResponse;
	listFiles: ListFilesResponse;
	downloadFile: DownloadFileResponse;
	deleteFile: DeleteFileResponse;
};

export const CodeInterpreterEndpointInputSchemas = {
	executeCode: ExecuteCodeInputSchema,
	uploadFile: UploadFileInputSchema,
	listFiles: ListFilesInputSchema,
	downloadFile: DownloadFileInputSchema,
	deleteFile: DeleteFileInputSchema,
} as const;

export const CodeInterpreterEndpointOutputSchemas = {
	executeCode: ExecuteCodeResponseSchema,
	uploadFile: UploadFileResponseSchema,
	listFiles: ListFilesResponseSchema,
	downloadFile: DownloadFileResponseSchema,
	deleteFile: DeleteFileResponseSchema,
} as const;
