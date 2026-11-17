import {
	PaperformFormEntity,
	PaperformSpaceEntity,
	PaperformSubmissionEntity,
	PaperformTranslationEntity,
} from './database';

export const PaperformSchema = {
	version: '1.0.0',
	entities: {
		forms: PaperformFormEntity,
		spaces: PaperformSpaceEntity,
		translations: PaperformTranslationEntity,
		submissions: PaperformSubmissionEntity,
	},
} as const;
