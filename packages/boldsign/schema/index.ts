import {
	BoldsignBrand,
	BoldsignCustomField,
	BoldsignDocument,
} from './database';

export const BoldsignSchema = {
	version: '1.0.0',
	entities: {
		documents: BoldsignDocument,
		brands: BoldsignBrand,
		custom_fields: BoldsignCustomField,
	},
} as const;
