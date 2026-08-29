import { logEventFromContext } from 'corsair/core';
import type { NextDNSEndpoints } from '../index';
import { auditPayload } from './logging';
import { compactBody, nextDNSCall } from './shared';
import type {
	NextDNSParentalControl,
	NextDNSParentalControlCategory,
	NextDNSParentalControlService,
} from './types';

export const get: NextDNSEndpoints['parentalControlGet'] = async (
	ctx,
	input,
) => {
	const result = await nextDNSCall<{ data: NextDNSParentalControl }>(
		ctx,
		`/profiles/${input.profileId}/parentalControl`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.parentalControl.get',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

/** Confirmed live: `PATCH .../parentalControl` returns `204` with no body - a `GET` after follows to return the resulting state. */
export const update: NextDNSEndpoints['parentalControlUpdate'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(ctx, `/profiles/${input.profileId}/parentalControl`, {
		method: 'PATCH',
		body: compactBody({
			safeSearch: input.safeSearch,
			youtubeRestrictedMode: input.youtubeRestrictedMode,
			blockBypass: input.blockBypass,
		}),
	});
	const result = await nextDNSCall<{ data: NextDNSParentalControl }>(
		ctx,
		`/profiles/${input.profileId}/parentalControl`,
	);
	await logEventFromContext(
		ctx,
		'nextdns.parentalControl.update',
		auditPayload(input, ['profileId']),
		'completed',
	);
	return result.data;
};

export const getCategories: NextDNSEndpoints['parentalControlGetCategories'] =
	async (ctx, input) => {
		const result = await nextDNSCall<{
			data: NextDNSParentalControlCategory[];
		}>(ctx, `/profiles/${input.profileId}/parentalControl/categories`);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.getCategories',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data ?? [];
	};

export const addCategory: NextDNSEndpoints['parentalControlAddCategory'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/parentalControl/categories`,
			{
				method: 'POST',
				body: compactBody({
					id: input.id,
					active: input.active,
					recreation: input.recreation,
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.addCategory',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const deleteCategory: NextDNSEndpoints['parentalControlDeleteCategory'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/parentalControl/categories/${input.id}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.deleteCategory',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const updateCategory: NextDNSEndpoints['parentalControlUpdateCategory'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/parentalControl/categories/${input.id}`,
			{
				method: 'PATCH',
				body: compactBody({
					active: input.active,
					recreation: input.recreation,
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.updateCategory',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const replaceCategories: NextDNSEndpoints['parentalControlReplaceCategories'] =
	async (ctx, input) => {
		const result = await nextDNSCall<{
			data: NextDNSParentalControlCategory[];
		}>(ctx, `/profiles/${input.profileId}/parentalControl/categories`, {
			method: 'PUT',
			body: input.categories,
		});
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.replaceCategories',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data ?? input.categories;
	};

export const getServices: NextDNSEndpoints['parentalControlGetServices'] =
	async (ctx, input) => {
		const result = await nextDNSCall<{
			data: NextDNSParentalControlService[];
		}>(ctx, `/profiles/${input.profileId}/parentalControl/services`);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.getServices',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data ?? [];
	};

export const addService: NextDNSEndpoints['parentalControlAddService'] = async (
	ctx,
	input,
) => {
	await nextDNSCall(
		ctx,
		`/profiles/${input.profileId}/parentalControl/services`,
		{
			method: 'POST',
			body: compactBody({
				id: input.id,
				active: input.active,
				recreation: input.recreation,
			}),
		},
	);
	await logEventFromContext(
		ctx,
		'nextdns.parentalControl.addService',
		auditPayload(input, ['profileId', 'id']),
		'completed',
	);
	return { id: input.id };
};

export const deleteService: NextDNSEndpoints['parentalControlDeleteService'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/parentalControl/services/${input.id}`,
			{ method: 'DELETE' },
		);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.deleteService',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const updateService: NextDNSEndpoints['parentalControlUpdateService'] =
	async (ctx, input) => {
		await nextDNSCall(
			ctx,
			`/profiles/${input.profileId}/parentalControl/services/${input.id}`,
			{
				method: 'PATCH',
				body: compactBody({
					active: input.active,
					recreation: input.recreation,
				}),
			},
		);
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.updateService',
			auditPayload(input, ['profileId', 'id']),
			'completed',
		);
		return { id: input.id };
	};

export const replaceServices: NextDNSEndpoints['parentalControlReplaceServices'] =
	async (ctx, input) => {
		const result = await nextDNSCall<{
			data: NextDNSParentalControlService[];
		}>(ctx, `/profiles/${input.profileId}/parentalControl/services`, {
			method: 'PUT',
			body: input.services,
		});
		await logEventFromContext(
			ctx,
			'nextdns.parentalControl.replaceServices',
			auditPayload(input, ['profileId']),
			'completed',
		);
		return result.data ?? input.services;
	};
