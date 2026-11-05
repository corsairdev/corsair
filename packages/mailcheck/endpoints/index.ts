import { validateDomain } from './validate-domain';
import { verifyEmail } from './verify-email';

export const Mailcheck = {
	verifyEmail,
	validateDomain,
};

export * from './types';
