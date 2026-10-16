import type { ContactOutEndpoints } from '..';
import { saveProfile } from './cache';
import { call } from './call';

export const enrich: ContactOutEndpoints['linkedinEnrich'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'linkedinEnrich',
		'linkedin.enrich',
		'GET',
		'v1/linkedin/enrich',
		input,
	);
	if (!Array.isArray(result.profile) && result.profile.url) {
		await saveProfile(ctx, result.profile.url, result.profile);
	}
	return result;
};

export const contactInfo: ContactOutEndpoints['linkedinContactInfo'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'linkedinContactInfo',
		'linkedin.contactInfo',
		'GET',
		'v1/people/linkedin',
		input,
	);

export const workEmailStatus: ContactOutEndpoints['linkedinWorkEmailStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'linkedinWorkEmailStatus',
		'linkedin.workEmailStatus',
		'GET',
		'v1/people/linkedin/work_email_status',
		input,
	);

export const personalEmailStatus: ContactOutEndpoints['linkedinPersonalEmailStatus'] =
	(ctx, input) =>
		call(
			ctx,
			'linkedinPersonalEmailStatus',
			'linkedin.personalEmailStatus',
			'GET',
			'v1/people/linkedin/personal_email_status',
			input,
		);

export const phoneStatus: ContactOutEndpoints['linkedinPhoneStatus'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'linkedinPhoneStatus',
		'linkedin.phoneStatus',
		'GET',
		'v1/people/linkedin/phone_status',
		input,
	);
