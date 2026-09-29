import {
	ScaleAiBatch,
	ScaleAiBatchStatus,
	ScaleAiFile,
	ScaleAiProject,
	ScaleAiTask,
	ScaleAiTeammate,
} from './database';

export const ScaleAiSchema = {
	version: '1.0.0',
	entities: {
		tasks: ScaleAiTask,
		batches: ScaleAiBatch,
		batchStatuses: ScaleAiBatchStatus,
		projects: ScaleAiProject,
		files: ScaleAiFile,
		teammates: ScaleAiTeammate,
	},
} as const;

export {
	ScaleAiBatch,
	ScaleAiBatchStatus,
	ScaleAiFile,
	ScaleAiProject,
	ScaleAiTask,
	ScaleAiTeammate,
} from './database';
