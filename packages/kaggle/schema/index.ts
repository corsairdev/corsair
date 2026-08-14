import {
	KaggleCompetitionEntity,
	KaggleDatasetEntity,
	KaggleKernelEntity,
	KaggleModelEntity,
} from './database';

export const KaggleSchema = {
	version: '1.0.0',
	entities: {
		datasets: KaggleDatasetEntity,
		models: KaggleModelEntity,
		competitions: KaggleCompetitionEntity,
		kernels: KaggleKernelEntity,
	},
} as const;

export * from './database';
