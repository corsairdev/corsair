import { getDetails as linkedinGetDetails } from './linkedin';
import { getCompanyEmail as emailGetCompanyEmail } from './email';

export const LinkedIn = {
	getDetails: linkedinGetDetails,
};

export const Email = {
	getCompanyEmail: emailGetCompanyEmail,
};

export * from './types';
