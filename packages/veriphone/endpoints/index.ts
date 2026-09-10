import { getCoverage } from './coverage';
import { getCredits } from './credits';
import { getExamplePhoneNumber } from './get-example-phone-number';
import { verifyPhoneNumber } from './verify-phone-number';

export const VerifyPhoneNumber = {
	verifyPhoneNumber,
};

export const GetExamplePhoneNumber = {
	getExamplePhoneNumber,
};

export const Credits = {
	getCredits,
};

export const Coverage = {
	getCoverage,
};

export * from './types';
export type { VeriphoneEndpointContext } from './verify-phone-number';
