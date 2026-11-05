import { AlibabaImage, AlibabaVideoTask } from './database';

export const AlibabaSchema = {
	version: '1.0.0',
	entities: {
		videoTasks: AlibabaVideoTask,
		images: AlibabaImage,
	},
} as const;

export type { AlibabaImage, AlibabaVideoTask } from './database';
