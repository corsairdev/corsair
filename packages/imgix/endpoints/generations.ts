import { logEventFromContext } from 'corsair/core';
import type { ImgixEndpoints } from '..';
import { makeImgixRequest } from '../client';
import { ImgixEndpointInputSchemas, ImgixEndpointOutputSchemas } from './types';

export const createVideo: ImgixEndpoints['generations.createVideo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['generations.createVideo'].parse(input);

	// `unknown` because payload attributes vary across provider parameters
	const body: Record<string, unknown> = { url: parsedInput.url };
	if (parsedInput.model !== undefined) body.model = parsedInput.model;
	if (parsedInput.prompt !== undefined) body.prompt = parsedInput.prompt;
	if (parsedInput.duration !== undefined) body.duration = parsedInput.duration;
	if (parsedInput.aspect_ratio !== undefined)
		body.aspect_ratio = parsedInput.aspect_ratio;

	const response = await makeImgixRequest(ctx.key, {
		method: 'POST',
		path: 'generations/video',
		body,
	});

	const parsed =
		ImgixEndpointOutputSchemas['generations.createVideo'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.generations.createVideo',
		{ job_id: parsed.data.id, status: parsed.data.attributes.status },
		'completed',
	);

	return parsed;
};

export const getVideoJob: ImgixEndpoints['generations.getVideoJob'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['generations.getVideoJob'].parse(input);

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: `generations/video/${encodeURIComponent(parsedInput.job_id)}`,
	});

	const parsed =
		ImgixEndpointOutputSchemas['generations.getVideoJob'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.generations.getVideoJob',
		{ job_id: parsed.data.id, status: parsed.data.attributes.status },
		'completed',
	);

	return parsed;
};

export const getAltText: ImgixEndpoints['generations.getAltText'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		ImgixEndpointInputSchemas['generations.getAltText'].parse(input);

	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsedInput.url !== undefined) query.url = parsedInput.url;
	if (parsedInput.url64 !== undefined) query.url64 = parsedInput.url64;
	if (parsedInput.language !== undefined) query.language = parsedInput.language;
	if (parsedInput.regenerate !== undefined)
		query.regenerate = parsedInput.regenerate;

	const response = await makeImgixRequest(ctx.key, {
		method: 'GET',
		path: 'generations/alt-text',
		query,
	});

	const parsed =
		ImgixEndpointOutputSchemas['generations.getAltText'].parse(response);

	await logEventFromContext(
		ctx,
		'imgix.generations.getAltText',
		{ languages: Object.keys(parsed.alt_text) },
		'completed',
	);

	return parsed;
};

export const overrideAltText: ImgixEndpoints['generations.overrideAltText'] =
	async (ctx, input) => {
		const parsedInput =
			ImgixEndpointInputSchemas['generations.overrideAltText'].parse(input);

		// `unknown` because payload attributes vary across provider parameters
		const body: Record<string, unknown> = {
			alt_text: parsedInput.alt_text,
		};
		if (parsedInput.url !== undefined) body.url = parsedInput.url;
		if (parsedInput.url64 !== undefined) body.url64 = parsedInput.url64;

		const response = await makeImgixRequest(ctx.key, {
			method: 'POST',
			path: 'generations/alt-text',
			body,
		});

		const parsed =
			ImgixEndpointOutputSchemas['generations.overrideAltText'].parse(response);

		await logEventFromContext(
			ctx,
			'imgix.generations.overrideAltText',
			{ languages: Object.keys(parsed.alt_text) },
			'completed',
		);

		return parsed;
	};
