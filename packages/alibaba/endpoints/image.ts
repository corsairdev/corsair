import { logEventFromContext } from 'corsair/core';
import type { AlibabaEndpoints } from '..';
import { makeDashScopeRequest } from '../client';
import {
	AlibabaEndpointInputSchemas,
	AlibabaEndpointOutputSchemas,
} from './types';

export const generate: AlibabaEndpoints['imageGenerate'] = async (
	ctx,
	input,
) => {
	const {
		model,
		prompt,
		images = [],
		parameters,
	} = AlibabaEndpointInputSchemas.imageGenerate.parse(input);

	// Single-turn messages: input images in order, then the one text prompt.
	const response = AlibabaEndpointOutputSchemas.imageGenerate.parse(
		await makeDashScopeRequest<unknown>(
			'api/v1/services/aigc/multimodal-generation/generation',
			ctx.key,
			{
				method: 'POST',
				body: {
					model,
					input: {
						messages: [
							{
								role: 'user',
								content: [
									...images.map((image) => ({ image })),
									{ text: prompt },
								],
							},
						],
					},
					...(parameters ? { parameters } : {}),
				},
				baseUrl: ctx.options.baseUrl,
			},
		),
	);

	const urls = response.output.choices.flatMap((choice) =>
		choice.message.content.map((item) => item.image),
	);
	if (ctx.db.images) {
		try {
			for (const url of urls) {
				await ctx.db.images.upsertByEntityId(url, {
					url,
					requestId: response.request_id,
					model,
					prompt,
					width:
						response.usage?.output_width ?? response.usage?.width ?? undefined,
					height:
						response.usage?.output_height ??
						response.usage?.height ??
						undefined,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save Model Studio image to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'alibaba.image.generate',
		{ model, imageCount: urls.length, requestId: response.request_id },
		'completed',
	);
	return response;
};
