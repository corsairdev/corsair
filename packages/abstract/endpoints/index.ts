import { get as emailReputationGet } from './email-reputation';
import { validate as emailValidate } from './email-validation';
import { validate as ibanValidate } from './iban';
import { getCategories as vatGetCategories } from './vat';

export const EmailValidation = {
	validate: emailValidate,
};

export const EmailReputation = {
	get: emailReputationGet,
};

export const Vat = {
	getCategories: vatGetCategories,
};

export const Iban = {
	validate: ibanValidate,
};

export * from './types';
