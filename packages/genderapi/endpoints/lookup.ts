import { logEventFromContext } from 'corsair/core';
import type { GenderApiContext, GenderApiEndpoints } from '..';
import type { GenderApiCredentials } from '../client';
import { definedQuery, makeGenderApiRequest } from '../client';
import {
	GenderApiEndpointInputSchemas,
	GenderApiEndpointOutputSchemas,
} from './types';

/**
 * The key resolves from the option first, then from the stored account key.
 * Gender API has no keyless mode, so an empty key is sent as-is and the API
 * answers `errno: 40`, which the auth handler reads.
 */
async function resolveCredentials(
	ctx: GenderApiContext,
): Promise<GenderApiCredentials> {
	if (ctx.options.key) return { apiKey: ctx.options.key };
	const stored = await ctx.keys.get_api_key();
	return { apiKey: stored ?? undefined };
}

export const name: GenderApiEndpoints['lookup']['name'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiEndpointInputSchemas.name.parse(input ?? {});

	const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
		path: '/get',
		query: definedQuery({
			name: parsed.name,
			country: parsed.country,
			locale: parsed.locale,
			ip: parsed.ip,
		}),
	});

	const result = GenderApiEndpointOutputSchemas.name.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapi.lookup.name',
		{
			gender: result.gender,
			samples: result.samples,
			accuracy: result.accuracy,
			country: result.country,
		},
		'completed',
	);
	return result;
};

/**
 * A multi lookup sends the names joined by a semicolon and asks for `multi`.
 * The country list follows the same order, and a single code applies to all of
 * them, which is why the plugin accepts either one code or one per name.
 */
export const multi: GenderApiEndpoints['lookup']['multi'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiEndpointInputSchemas.multi.parse(input ?? {});

	const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
		path: '/get',
		query: definedQuery({
			name: parsed.names.join(';'),
			country: parsed.countries?.join(';'),
			multi: true,
		}),
	});

	const result = GenderApiEndpointOutputSchemas.multi.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapi.lookup.multi',
		{
			count: result.result.length,
			unknown: result.result.filter((row) => row.gender === 'unknown').length,
			credits_used: result.credits_used,
		},
		'completed',
	);
	return result;
};

export const email: GenderApiEndpoints['email']['lookup'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiEndpointInputSchemas.email.parse(input ?? {});

	const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
		path: '/get',
		query: definedQuery({
			email: parsed.email,
			country: parsed.country,
		}),
	});

	const result = GenderApiEndpointOutputSchemas.email.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapi.email.lookup',
		{
			gender: result.gender,
			// The email itself is personal data, so the log names only the provider.
			mail_provider: result.mail_provider,
			samples: result.samples,
		},
		'completed',
	);
	return result;
};

export const fullName: GenderApiEndpoints['fullName']['split'] = async (
	ctx,
	input,
) => {
	const parsed = GenderApiEndpointInputSchemas.fullName.parse(input ?? {});

	const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
		path: '/get',
		query: definedQuery({
			split: parsed.split,
			country: parsed.country,
			strict: parsed.strict,
		}),
	});

	const result = GenderApiEndpointOutputSchemas.fullName.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapi.fullName.split',
		{
			gender: result.gender,
			samples: result.samples,
			accuracy: result.accuracy,
			strict: parsed.strict ?? false,
		},
		'completed',
	);
	return result;
};

export const countryOfOrigin: GenderApiEndpoints['countryOfOrigin']['get'] =
	async (ctx, input) => {
		const parsed = GenderApiEndpointInputSchemas.countryOfOrigin.parse(
			input ?? {},
		);

		const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
			path: '/get-country-of-origin',
			query: definedQuery({ name: parsed.name }),
		});

		const result = GenderApiEndpointOutputSchemas.countryOfOrigin.parse(raw);

		await logEventFromContext(
			ctx,
			'genderapi.countryOfOrigin.get',
			{
				countries: result.country_of_origin.length,
				// The leading entry is the strongest one, so it is the useful signal.
				top_country: result.country_of_origin[0]?.country,
				credits_used: result.credits_used,
			},
			'completed',
		);
		return result;
	};

export const stats: GenderApiEndpoints['account']['stats'] = async (
	ctx,
	input,
) => {
	GenderApiEndpointInputSchemas.stats.parse(input ?? {});

	const raw = await makeGenderApiRequest(await resolveCredentials(ctx), {
		path: '/get-stats',
	});

	const result = GenderApiEndpointOutputSchemas.stats.parse(raw);

	await logEventFromContext(
		ctx,
		'genderapi.account.stats',
		{
			remaining_requests: result.remaining_requests,
			is_limit_reached: result.is_limit_reached,
		},
		'completed',
	);
	return result;
};
