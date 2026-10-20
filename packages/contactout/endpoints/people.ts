import type { ContactOutContext, ContactOutEndpoints } from '..';
import { saveProfile } from './cache';
import { call } from './call';
import type { PeopleSearchResponse } from './types';

async function saveProfiles(
	ctx: ContactOutContext,
	profiles: PeopleSearchResponse['profiles'],
) {
	if (Array.isArray(profiles)) return;
	for (const [url, profile] of Object.entries(profiles)) {
		await saveProfile(ctx, url, profile);
	}
}

export const enrich: ContactOutEndpoints['peopleEnrich'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'peopleEnrich',
		'people.enrich',
		'POST',
		'v1/people/enrich',
		input,
	);
	if (result.profile.url) {
		await saveProfile(ctx, result.profile.url, result.profile);
	}
	return result;
};

export const search: ContactOutEndpoints['peopleSearch'] = async (
	ctx,
	input,
) => {
	const result = await call(
		ctx,
		'peopleSearch',
		'people.search',
		'POST',
		'v1/people/search',
		input,
	);
	await saveProfiles(ctx, result.profiles);
	return result;
};

export const count: ContactOutEndpoints['peopleCount'] = (ctx, input) =>
	call(ctx, 'peopleCount', 'people.count', 'POST', 'v1/people/count', input);

export const decisionMakers: ContactOutEndpoints['peopleDecisionMakers'] =
	async (ctx, input) => {
		const result = await call(
			ctx,
			'peopleDecisionMakers',
			'people.decisionMakers',
			'GET',
			'v1/people/decision-makers',
			input,
		);
		await saveProfiles(ctx, result.profiles);
		return result;
	};
