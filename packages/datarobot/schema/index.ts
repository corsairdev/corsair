import {
	DatarobotDataset,
	DatarobotDeployment,
	DatarobotProject,
	DatarobotUseCase,
	DatarobotUser,
} from './database';

export const DatarobotSchema = {
	version: '0.1.0',
	entities: {
		project: DatarobotProject,
		dataset: DatarobotDataset,
		deployment: DatarobotDeployment,
		useCase: DatarobotUseCase,
		user: DatarobotUser,
	},
} as const;

export * from './database';
