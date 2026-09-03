import { z } from 'zod';

// ======================
// Run Browser Task
// ======================
export const RunBrowserTaskInputSchema = z.object({
	task: z.string().min(1),
	browser_session_id: z.string().optional(),
	start_url: z.string().url().optional(),
	max_steps: z.number().int().positive().optional(),
});

export type RunBrowserTaskInput = z.infer<typeof RunBrowserTaskInputSchema>;

export const RunBrowserTaskOutputSchema = z.object({
	task_id: z.string().optional(),
	browser_session_id: z.string().optional(),
	status: z.string().optional(),
	message: z.string().optional(),
	data: z.unknown().optional(),
});

export type RunBrowserTaskOutput = z.infer<typeof RunBrowserTaskOutputSchema>;

// ======================
// Download Task File
// ======================
export const DownloadTaskFileInputSchema = z.object({
	task_id: z.string().min(1),
	file_id: z.string().min(1),
});

export type DownloadTaskFileInput = z.infer<typeof DownloadTaskFileInputSchema>;

export const DownloadTaskFileOutputSchema = z.object({
	download_url: z.string().url().optional(),
	file_id: z.string().optional(),
	expires_at: z.string().optional(),
	filename: z.string().optional(),
});

export type DownloadTaskFileOutput = z.infer<
	typeof DownloadTaskFileOutputSchema
>;

// ======================
// Get Session Live URL
// ======================
export const GetSessionLiveUrlInputSchema = z.object({
	browser_session_id: z.string().min(1),
});

export type GetSessionLiveUrlInput = z.infer<
	typeof GetSessionLiveUrlInputSchema
>;

export const GetSessionLiveUrlOutputSchema = z.object({
	live_url: z.string().url().optional(),
	browser_session_id: z.string().optional(),
});

export type GetSessionLiveUrlOutput = z.infer<
	typeof GetSessionLiveUrlOutputSchema
>;

// ======================
// Stop Browser Task
// ======================
export const StopBrowserTaskInputSchema = z.object({
	task_id: z.string().min(1),
});

export type StopBrowserTaskInput = z.infer<typeof StopBrowserTaskInputSchema>;

export const StopBrowserTaskOutputSchema = z.object({
	task_id: z.string().optional(),
	status: z.string().optional(),
	message: z.string().optional(),
});

export type StopBrowserTaskOutput = z.infer<typeof StopBrowserTaskOutputSchema>;

// ======================
// Watch Browser Task
// ======================
export const WatchBrowserTaskInputSchema = z.object({
	task_id: z.string().min(1),
});

export type WatchBrowserTaskInput = z.infer<typeof WatchBrowserTaskInputSchema>;

export const WatchBrowserTaskOutputSchema = z.object({
	task_id: z.string().optional(),
	status: z.string().optional(),
	is_success: z.boolean().optional(),
	current_goal: z.string().optional(),
	current_url: z.string().optional(),
	output: z.unknown().optional(),
	output_files: z.array(z.unknown()).optional(),
	screenshots: z.array(z.unknown()).optional(),
	message: z.string().optional(),
});

export type WatchBrowserTaskOutput = z.infer<
	typeof WatchBrowserTaskOutputSchema
>;

// ======================
// Combined Types
// ======================
export type BrowserToolEndpointInputs = {
	runBrowserTask: RunBrowserTaskInput;
	downloadTaskFile: DownloadTaskFileInput;
	getSessionLiveUrl: GetSessionLiveUrlInput;
	stopBrowserTask: StopBrowserTaskInput;
	watchBrowserTask: WatchBrowserTaskInput;
};

export type BrowserToolEndpointOutputs = {
	runBrowserTask: RunBrowserTaskOutput;
	downloadTaskFile: DownloadTaskFileOutput;
	getSessionLiveUrl: GetSessionLiveUrlOutput;
	stopBrowserTask: StopBrowserTaskOutput;
	watchBrowserTask: WatchBrowserTaskOutput;
};
export const BrowserToolEndpointInputSchemas = {
	runBrowserTask: RunBrowserTaskInputSchema,
	downloadTaskFile: DownloadTaskFileInputSchema,
	getSessionLiveUrl: GetSessionLiveUrlInputSchema,
	stopBrowserTask: StopBrowserTaskInputSchema,
	watchBrowserTask: WatchBrowserTaskInputSchema,
};

export const BrowserToolEndpointOutputSchemas = {
	runBrowserTask: RunBrowserTaskOutputSchema,
	downloadTaskFile: DownloadTaskFileOutputSchema,
	getSessionLiveUrl: GetSessionLiveUrlOutputSchema,
	stopBrowserTask: StopBrowserTaskOutputSchema,
	watchBrowserTask: WatchBrowserTaskOutputSchema,
};
