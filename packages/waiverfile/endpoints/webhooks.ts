import type { WaiverFileEndpoints } from '..';
import { call } from './call';

/**
 * Drops the query string from a webhook target. WaiverFile signs nothing, so a
 * receiver's URL often carries a token in its query; logging it whole would write a
 * usable secret into the event log. The origin and path still identify the receiver.
 */
function safeTargetUrl(url: string): string {
	try {
		const parsed = new URL(url);
		return `${parsed.origin}${parsed.pathname}`;
	} catch {
		return url.split('?')[0] ?? url;
	}
}

import {
	WaiverFileEndpointInputSchemas as Inputs,
	WaiverFileEndpointOutputSchemas as Outputs,
} from './types';

/**
 * WaiverFile's webhooks are per-trigger subscriptions rather than one object
 * with a topic list: subscribing is `POST /subscribe/<trigger>?targetUrl=…` and
 * unsubscribing is `DELETE /deletesubscribe/<trigger>` with the same URL.
 *
 * Both carry the target URL as a query parameter, so the trigger is part of
 * the path and the URL is the only thing that identifies the subscription.
 */
export const subscribe: WaiverFileEndpoints['webhooksSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.subscribe',
			input: Inputs.webhooksSubscribe,
			output: Outputs.webhooksSubscribe,
		},
		input,
		({ trigger, targetUrl }) => ({
			method: 'POST',
			path: `/api/v1/subscribe/${trigger}`,
			query: { targetUrl },
		}),
		{
			// The URL is the subscription's identity, so it is logged; it is a
			// server endpoint, not a person.
			log: (parsed, result) => ({
				trigger: parsed.trigger,
				url: safeTargetUrl(parsed.targetUrl),
				success: result.Success ?? false,
			}),
		},
	);

export const unsubscribe: WaiverFileEndpoints['webhooksUnsubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.unsubscribe',
			input: Inputs.webhooksUnsubscribe,
			output: Outputs.webhooksUnsubscribe,
		},
		input,
		({ trigger, targetUrl }) => ({
			method: 'DELETE',
			path: `/api/v1/deletesubscribe/${trigger}`,
			query: { targetUrl },
		}),
		{
			log: (parsed, result) => ({
				trigger: parsed.trigger,
				url: safeTargetUrl(parsed.targetUrl),
				success: result.Success ?? false,
			}),
		},
	);
