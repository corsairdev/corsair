import {
	AbstractEmailReputation,
	AbstractEmailValidation,
	AbstractIbanValidation,
	AbstractVatCategory,
} from './database';

export const AbstractSchema = {
	version: '1.0.0',
	entities: {
		emailValidations: AbstractEmailValidation,
		emailReputations: AbstractEmailReputation,
		vatCategories: AbstractVatCategory,
		ibanValidations: AbstractIbanValidation,
	},
} as const;
