import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const get: GumroadEndpoints['userGet'] = (ctx, input) =>
	call(ctx, 'userGet', 'user.get', '/user', input);

export const customHtmlGet: GumroadEndpoints['userCustomHtmlGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'userCustomHtmlGet',
		'user.customHtmlGet',
		'/user/custom_html',
		input,
	);

// The custom HTML endpoints are the two documented JSON-body calls; their
// cURL sends Authorization: Bearer plus Content-Type: application/json.
export const customHtmlUpdate: GumroadEndpoints['userCustomHtmlUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'userCustomHtmlUpdate',
		'user.customHtmlUpdate',
		'/user/custom_html',
		input,
		{
			method: 'PUT',
			toJson: (parsed) => ({ custom_html: parsed.custom_html }),
		},
	);

export const customHtmlPreview: GumroadEndpoints['userCustomHtmlPreview'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'userCustomHtmlPreview',
		'user.customHtmlPreview',
		'/user/preview_custom_html',
		input,
		{
			method: 'POST',
			toJson: (parsed) => ({ custom_html: parsed.custom_html }),
		},
	);

export const refundPolicyGet: GumroadEndpoints['userRefundPolicyGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'userRefundPolicyGet',
		'user.refundPolicyGet',
		'/refund_policy',
		input,
	);

export const refundPolicyUpdate: GumroadEndpoints['userRefundPolicyUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'userRefundPolicyUpdate',
		'user.refundPolicyUpdate',
		'/refund_policy',
		input,
		{
			method: 'PUT',
			toForm: (parsed) =>
				formEntries({
					refund_period: parsed.refund_period,
					fine_print: parsed.fine_print,
				}),
		},
	);
