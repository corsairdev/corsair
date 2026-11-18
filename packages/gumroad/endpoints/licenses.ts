import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

// The licenses endpoints take form-encoded bodies and need no access token
// ("The Verify License API endpoint does not require an OAuth application").
export const verify: GumroadEndpoints['licensesVerify'] = (ctx, input) =>
	call(ctx, 'licensesVerify', 'licenses.verify', '/licenses/verify', input, {
		method: 'POST',
		toForm: (parsed) =>
			formEntries({
				product_id: parsed.product_id,
				license_key: parsed.license_key,
				increment_uses_count: parsed.increment_uses_count,
			}),
	});

export const enable: GumroadEndpoints['licensesEnable'] = (ctx, input) =>
	call(ctx, 'licensesEnable', 'licenses.enable', '/licenses/enable', input, {
		method: 'PUT',
		toForm: (parsed) =>
			formEntries({
				product_id: parsed.product_id,
				license_key: parsed.license_key,
			}),
	});

export const disable: GumroadEndpoints['licensesDisable'] = (ctx, input) =>
	call(ctx, 'licensesDisable', 'licenses.disable', '/licenses/disable', input, {
		method: 'PUT',
		toForm: (parsed) =>
			formEntries({
				product_id: parsed.product_id,
				license_key: parsed.license_key,
			}),
	});

export const decrementUsesCount: GumroadEndpoints['licensesDecrementUsesCount'] =
	(ctx, input) =>
		call(
			ctx,
			'licensesDecrementUsesCount',
			'licenses.decrementUsesCount',
			'/licenses/decrement_uses_count',
			input,
			{
				method: 'PUT',
				toForm: (parsed) =>
					formEntries({
						product_id: parsed.product_id,
						license_key: parsed.license_key,
					}),
			},
		);

export const rotate: GumroadEndpoints['licensesRotate'] = (ctx, input) =>
	call(ctx, 'licensesRotate', 'licenses.rotate', '/licenses/rotate', input, {
		method: 'PUT',
		toForm: (parsed) =>
			formEntries({
				product_id: parsed.product_id,
				license_key: parsed.license_key,
			}),
	});
