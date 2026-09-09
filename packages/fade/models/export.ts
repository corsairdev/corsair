export type ExportStatus = 'queued' | 'running' | 'done' | 'error' | 'cancelled';

export interface ExportJob {
	jobId: string;
	projectId: string;
	outputPath: string;
	status: ExportStatus;
	/** 0.0–1.0 */
	progress: number;
	/** Current frame being encoded */
	currentFrame: number;
	totalFrames: number;
	errorMessage: string | null;
	startedAt: string | null;
	finishedAt: string | null;
}
