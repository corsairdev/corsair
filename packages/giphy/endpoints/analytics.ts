import { logEventFromContext } from 'corsair/core';
import { makeGiphyAnalyticsRequest } from '../client';
import type { GiphyEndpoints } from '../index';

// Action Register — https://developers.giphy.com/docs/api/endpoint/#action-register
// Registers a view/click/send against the tracking URL from a GIF response's
// `analytics` object (onload/onclick/onsent). The input schema allow-lists
// the GIPHY analytics host; `ts` defaults to now per the docs ("a UNIX
// timestamp in milliseconds corresponding to when the action occurred").
export const register: GiphyEndpoints['analyticsRegister'] = async (
	ctx,
	input,
) => {
	await makeGiphyAnalyticsRequest(input.pingback_url, {
		customer_id: input.customer_id,
		ts: input.ts ?? Date.now(),
	});

	const response = { success: true };

	await logEventFromContext(
		ctx,
		'giphy.analytics.register',
		{ customer_id: input.customer_id },
		'completed',
	);

	return response;
};

export const Analytics = {
	register,
};
