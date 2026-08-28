import { logEventFromContext } from 'corsair/core';
import type { HtmlToImageEndpoints } from '..';

export const getImage: HtmlToImageEndpoints['getImage'] = async (
	ctx,
	input,
) => {
	const response = await fetch(input.url);

	if (!response.ok) {
		throw new Error(
			`Failed to retrieve image: ${response.status} ${response.statusText}`,
		);
	}

	await logEventFromContext(
		ctx,
		'htmltoimage.get_image',
		{ url: input.url },
		'completed',
	);

	return {
		url: input.url,
	};
};
