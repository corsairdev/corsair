import { logEventFromContext } from 'corsair/core';
import { makeApiNinjasRequest } from '../client';
import type { ApiNinjasEndpoints } from '../index';
import { auditPayload, withCount } from './logging';
import { cacheEmoji } from './persist';
import { asArray, imageContentType, imageEncoding } from './shared';
import type { ApiNinjasEndpointOutputs } from './types';

/**
 * Generators, converters and small stateful helpers.
 *
 * Every operation here is a single documented endpoint under
 * https://api.api-ninjas.com. Inputs map one-to-one onto the documented query
 * parameters, so nothing is renamed on the way through.
 */

/** Returns a random password string adhering to the specified parameters. */
export const password: ApiNinjasEndpoints['utilityPassword'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityPassword']
	>('passwordgenerator', ctx.key, {
		version: 'v1',
		query: {
			length: input.length,
			exclude_numbers: input.exclude_numbers,
			exclude_special_chars: input.exclude_special_chars,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.password',
		withCount(
			auditPayload(input, [
				'length',
				'exclude_numbers',
				'exclude_special_chars',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Returns fake random user profiles. Supports customizable fields,
 * filtering, and localization.
 */
export const randomUser: ApiNinjasEndpoints['utilityRandomUser'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityRandomUser']
	>('randomuser', ctx.key, {
		version: 'v2',
		query: {
			count: input.count,
			gender: input.gender,
			min_age: input.min_age,
			max_age: input.max_age,
			locale: input.locale,
			fields: input.fields,
			exclude: input.exclude,
			seed: input.seed,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.randomUser',
		withCount(
			auditPayload(input, [
				'count',
				'gender',
				'min_age',
				'max_age',
				'locale',
				'fields',
				'exclude',
				'seed',
			]),
			result,
		),
		'completed',
	);
	return result;
};

/** Fetch and possibly update a counter. */
export const counter: ApiNinjasEndpoints['utilityCounter'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityCounter']
	>('counter', ctx.key, {
		version: 'v1',
		query: {
			id: input.id,
			hit: input.hit,
			value: input.value,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.counter',
		withCount(auditPayload(input, []), result),
		'completed',
	);
	return result;
};

/**
 * Returns conversions between different units of the same measurement
 * type.
 */
export const convertUnit: ApiNinjasEndpoints['utilityConvertUnit'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityConvertUnit']
	>('unitconversion', ctx.key, {
		version: 'v1',
		query: {
			amount: input.amount,
			unit: input.unit,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.convertUnit',
		withCount(auditPayload(input, ['unit']), result),
		'completed',
	);
	return result;
};

/**
 * Get a list of company names, ticker symbols, and logo image URLs
 * matching the input parameters. Returns at most 10 results.
 */
export const logo: ApiNinjasEndpoints['utilityLogo'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityLogo']
	>('logo', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			ticker: input.ticker,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.logo',
		withCount(auditPayload(input, ['name', 'ticker']), result),
		'completed',
	);
	return result;
};

/**
 * Get a country's flag as SVG image URLs. Both 1:1 and 4:3 aspect ratios
 * are supported and returned in the response.
 */
export const countryFlag: ApiNinjasEndpoints['utilityCountryFlag'] = async (
	ctx,
	input,
) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityCountryFlag']
	>('countryflag', ctx.key, {
		version: 'v1',
		query: {
			country: input.country,
		},
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.countryFlag',
		withCount(auditPayload(input, ['country']), result),
		'completed',
	);
	return result;
};

/**
 * Returns a list of emojis according to input parameters. Returns at most
 * 30 results. To access more than 30 results, use the offset parameter to
 * offset results in multiple API calls.
 */
export const emoji: ApiNinjasEndpoints['utilityEmoji'] = async (ctx, input) => {
	const result = await makeApiNinjasRequest<
		ApiNinjasEndpointOutputs['utilityEmoji']
	>('emoji', ctx.key, {
		version: 'v1',
		query: {
			name: input.name,
			code: input.code,
			group: input.group,
			subgroup: input.subgroup,
			offset: input.offset,
		},
	});

	await cacheEmoji(ctx.db.emoji, asArray(result), new Date());

	await logEventFromContext(
		ctx,
		'apininjas.utility.emoji',
		withCount(
			auditPayload(input, ['name', 'code', 'group', 'subgroup', 'offset']),
			result,
		),
		'completed',
	);
	return result;
};

/**
 * Generates a QR code image.
 *
 * The response is an image rather than JSON, and the shared transport decodes
 * any non-JSON body as text - so SVG and EPS come back byte-for-byte while a
 * raster format does not survive the round trip. `format` therefore defaults to
 * `svg` here rather than to the provider's own default of `png`: a caller who
 * does not state a format gets an exact payload instead of a corrupted one.
 *
 * A caller who does ask for `png` or `jpg` still gets the call made, and the
 * result says so: `encoding` is `lossy-text` rather than `text`, so the payload
 * is never presented as a usable image when it is not one. Deciding that for
 * the caller by rejecting the request would be the other defensible choice; it
 * is not taken here because the catalog lists these operations and the raster
 * bytes are still useful for length and content checks.
 *
 * The underlying limitation is in the core transport's response handling, not
 * in this plugin; it is raised as a suggestion in the pull request rather than
 * patched here, because this package may not change core files.
 */
export const qrCode: ApiNinjasEndpoints['utilityQrCode'] = async (
	ctx,
	input,
) => {
	const format = input.format ?? 'svg';
	const contentType = imageContentType(format);

	const result = await makeApiNinjasRequest<string>('qrcode', ctx.key, {
		version: 'v1',
		query: {
			data: input.data,
			format,
			size: input.size,
			fg_color: input.fg_color,
			bg_color: input.bg_color,
		},
		accept: contentType,
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.qrCode',
		auditPayload(input, ['format', 'size', 'fg_color', 'bg_color']),
		'completed',
	);
	return {
		content_type: contentType,
		encoding: imageEncoding(format),
		data: String(result ?? ''),
	};
};

/**
 * Generates a barcode image.
 *
 * Same transport constraint as {@link qrCode}: `format` defaults to `svg` so
 * the returned payload is exact, and `encoding` reports `lossy-text` when a
 * caller asks for a raster format. The provider defaults `type` to `upc`, which
 * rejects text that is not a valid UPC, so the caller's `type` is passed
 * through untouched rather than guessed at.
 */
export const barcode: ApiNinjasEndpoints['utilityBarcode'] = async (
	ctx,
	input,
) => {
	const format = input.format ?? 'svg';
	const contentType = imageContentType(format);

	const result = await makeApiNinjasRequest<string>(
		'barcodegenerate',
		ctx.key,
		{
			version: 'v1',
			query: {
				text: input.text,
				type: input.type,
				format,
				include_text: input.include_text,
			},
			accept: contentType,
		},
	);

	await logEventFromContext(
		ctx,
		'apininjas.utility.barcode',
		auditPayload(input, ['type', 'format', 'include_text']),
		'completed',
	);
	return {
		content_type: contentType,
		encoding: imageEncoding(format),
		data: String(result ?? ''),
	};
};

/**
 * Returns a random image.
 *
 * This endpoint only ever answers with JPEG bytes - there is no text format to
 * ask for - so its payload is always `lossy-text` and should be treated as
 * opaque. It is the one operation here that cannot return a usable image until
 * the core transport can carry binary responses.
 */
export const randomImage: ApiNinjasEndpoints['utilityRandomImage'] = async (
	ctx,
	input,
) => {
	const contentType = imageContentType('jpg');

	const result = await makeApiNinjasRequest<string>('randomimage', ctx.key, {
		version: 'v1',
		query: {
			category: input.category,
			width: input.width,
			height: input.height,
		},
		accept: contentType,
	});

	await logEventFromContext(
		ctx,
		'apininjas.utility.randomImage',
		auditPayload(input, ['category', 'width', 'height']),
		'completed',
	);
	return {
		content_type: contentType,
		encoding: 'lossy-text',
		data: String(result ?? ''),
	};
};
