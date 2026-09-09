import type { Timeline } from './timeline';

export interface ProjectSettings {
	outputPath: string;
	codec: string;
	crf: number;
	preset: string;
	audioCodec: string;
	audioBitrate: string;
	mediaDownloadPath: string;
}

export interface Project {
	version: string;
	projectId: string;
	name: string;
	width: number;
	height: number;
	fps: number;
	/** Total length in frames */
	totalFrame: number;
	filePath: string | null;
	isDirty: boolean;
	/** Index 0 = root, rest = compositions */
	timelines: Timeline[];
	settings: ProjectSettings;
}
