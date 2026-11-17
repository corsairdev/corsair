import {
	PaperformFormEntity,
	PaperformSpaceEntity,
	PaperformTranslationEntity,
} from './database';

export const PaperformSchema = {
	version: '1.0.0',
	entities: {
		forms: PaperformFormEntity,
		spaces: PaperformSpaceEntity,
		translations: PaperformTranslationEntity,
	},
} as const;
