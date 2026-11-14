import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['customers.list'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.list']
	>('/customers', ctx.key, {
		method: 'GET',
		query: {
			mailbox: parsedInput.mailbox,
			firstName: parsedInput.firstName,
			lastName: parsedInput.lastName,
			email: parsedInput.email,
			query: parsedInput.query,
			sortField: parsedInput.sortField,
			sortOrder: parsedInput.sortOrder,
			page: parsedInput.page,
		},
	});

	const parsed =
		HelpScoutEndpointOutputSchemas['customers.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.customers.list',
		{ count: parsed._embedded.customers.length },
		'completed',
	);

	return parsed;
};

export const get: HelpScoutEndpoints['customers.get'] = async (ctx, input) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.get'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.get']
	>(
		`/customers/${encodeURIComponent(String(parsedInput.customerId))}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		HelpScoutEndpointOutputSchemas['customers.get'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.customers.get',
		{ customerId: parsed.id },
		'completed',
	);

	return parsed;
};

export const create: HelpScoutEndpoints['customers.create'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.create'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.create']
	>('/customers', ctx.key, {
		method: 'POST',
		body: parsedInput,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.create'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.create',
		{ success: true },
		'completed',
	);

	return parsed;
};

export const update: HelpScoutEndpoints['customers.update'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.update'].parse(input);
	const { customerId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.update']
	>(`/customers/${encodeURIComponent(String(customerId))}`, ctx.key, {
		method: 'PUT',
		body,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.update'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.update',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const patch: HelpScoutEndpoints['customers.patch'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.patch'].parse(input);
	const { customerId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.patch']
	>(`/customers/${encodeURIComponent(String(customerId))}`, ctx.key, {
		method: 'PATCH',
		body,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.patch'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.patch',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const remove: HelpScoutEndpoints['customers.delete'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.delete'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.delete']
	>(
		`/customers/${encodeURIComponent(String(parsedInput.customerId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.delete'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.delete',
		{ customerId: String(parsedInput.customerId) },
		'completed',
	);

	return parsed;
};

export const createAddress: HelpScoutEndpoints['customers.createAddress'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.createAddress'].parse(input);
		const { customerId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.createAddress']
		>(`/customers/${encodeURIComponent(String(customerId))}/address`, ctx.key, {
			method: 'POST',
			body,
		});

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.createAddress'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.createAddress',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const updateAddress: HelpScoutEndpoints['customers.updateAddress'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.updateAddress'].parse(input);
		const { customerId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.updateAddress']
		>(`/customers/${encodeURIComponent(String(customerId))}/address`, ctx.key, {
			method: 'PUT',
			body,
		});

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.updateAddress'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.updateAddress',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const deleteAddress: HelpScoutEndpoints['customers.deleteAddress'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.deleteAddress'].parse(input);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.deleteAddress']
		>(
			`/customers/${encodeURIComponent(String(parsedInput.customerId))}/address`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.deleteAddress'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.deleteAddress',
			{ customerId: String(parsedInput.customerId) },
			'completed',
		);

		return parsed;
	};

export const createEmail: HelpScoutEndpoints['customers.createEmail'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.createEmail'].parse(input);
	const { customerId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.createEmail']
	>(`/customers/${encodeURIComponent(String(customerId))}/emails`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.createEmail'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.createEmail',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const updateEmail: HelpScoutEndpoints['customers.updateEmail'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.updateEmail'].parse(input);
	const { customerId, emailId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.updateEmail']
	>(
		`/customers/${encodeURIComponent(String(customerId))}/emails/${encodeURIComponent(String(emailId))}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.updateEmail'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.updateEmail',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const deleteEmail: HelpScoutEndpoints['customers.deleteEmail'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.deleteEmail'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.deleteEmail']
	>(
		`/customers/${encodeURIComponent(String(parsedInput.customerId))}/emails/${encodeURIComponent(String(parsedInput.emailId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.deleteEmail'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.deleteEmail',
		{ customerId: String(parsedInput.customerId) },
		'completed',
	);

	return parsed;
};

export const createPhone: HelpScoutEndpoints['customers.createPhone'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.createPhone'].parse(input);
	const { customerId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.createPhone']
	>(`/customers/${encodeURIComponent(String(customerId))}/phones`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.createPhone'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.createPhone',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const updatePhone: HelpScoutEndpoints['customers.updatePhone'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.updatePhone'].parse(input);
	const { customerId, phoneId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.updatePhone']
	>(
		`/customers/${encodeURIComponent(String(customerId))}/phones/${encodeURIComponent(String(phoneId))}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.updatePhone'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.updatePhone',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const deletePhone: HelpScoutEndpoints['customers.deletePhone'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.deletePhone'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.deletePhone']
	>(
		`/customers/${encodeURIComponent(String(parsedInput.customerId))}/phones/${encodeURIComponent(String(parsedInput.phoneId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.deletePhone'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.deletePhone',
		{ customerId: String(parsedInput.customerId) },
		'completed',
	);

	return parsed;
};

export const createChat: HelpScoutEndpoints['customers.createChat'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.createChat'].parse(input);
	const { customerId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.createChat']
	>(`/customers/${encodeURIComponent(String(customerId))}/chats`, ctx.key, {
		method: 'POST',
		body,
	});

	const parsed = HelpScoutEndpointOutputSchemas['customers.createChat'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.createChat',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const updateChat: HelpScoutEndpoints['customers.updateChat'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.updateChat'].parse(input);
	const { customerId, chatId, ...body } = parsedInput;

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.updateChat']
	>(
		`/customers/${encodeURIComponent(String(customerId))}/chats/${encodeURIComponent(String(chatId))}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.updateChat'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.updateChat',
		{ customerId: String(customerId) },
		'completed',
	);

	return parsed;
};

export const deleteChat: HelpScoutEndpoints['customers.deleteChat'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		HelpScoutEndpointInputSchemas['customers.deleteChat'].parse(input);

	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['customers.deleteChat']
	>(
		`/customers/${encodeURIComponent(String(parsedInput.customerId))}/chats/${encodeURIComponent(String(parsedInput.chatId))}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	const parsed = HelpScoutEndpointOutputSchemas['customers.deleteChat'].parse(
		response ?? {},
	);

	await logEventFromContext(
		ctx,
		'helpscout.customers.deleteChat',
		{ customerId: String(parsedInput.customerId) },
		'completed',
	);

	return parsed;
};

export const createSocialProfile: HelpScoutEndpoints['customers.createSocialProfile'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.createSocialProfile'].parse(
				input,
			);
		const { customerId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.createSocialProfile']
		>(
			`/customers/${encodeURIComponent(String(customerId))}/social-profiles`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.createSocialProfile'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.createSocialProfile',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const updateSocialProfile: HelpScoutEndpoints['customers.updateSocialProfile'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.updateSocialProfile'].parse(
				input,
			);
		const { customerId, profileId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.updateSocialProfile']
		>(
			`/customers/${encodeURIComponent(String(customerId))}/social-profiles/${encodeURIComponent(String(profileId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.updateSocialProfile'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.updateSocialProfile',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const deleteSocialProfile: HelpScoutEndpoints['customers.deleteSocialProfile'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.deleteSocialProfile'].parse(
				input,
			);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.deleteSocialProfile']
		>(
			`/customers/${encodeURIComponent(String(parsedInput.customerId))}/social-profiles/${encodeURIComponent(String(parsedInput.profileId))}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.deleteSocialProfile'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.deleteSocialProfile',
			{ customerId: String(parsedInput.customerId) },
			'completed',
		);

		return parsed;
	};

export const createWebsite: HelpScoutEndpoints['customers.createWebsite'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.createWebsite'].parse(input);
		const { customerId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.createWebsite']
		>(
			`/customers/${encodeURIComponent(String(customerId))}/websites`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.createWebsite'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.createWebsite',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const updateWebsite: HelpScoutEndpoints['customers.updateWebsite'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.updateWebsite'].parse(input);
		const { customerId, websiteId, ...body } = parsedInput;

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.updateWebsite']
		>(
			`/customers/${encodeURIComponent(String(customerId))}/websites/${encodeURIComponent(String(websiteId))}`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.updateWebsite'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.updateWebsite',
			{ customerId: String(customerId) },
			'completed',
		);

		return parsed;
	};

export const deleteWebsite: HelpScoutEndpoints['customers.deleteWebsite'] =
	async (ctx, input) => {
		const parsedInput =
			HelpScoutEndpointInputSchemas['customers.deleteWebsite'].parse(input);

		const response = await makeHelpscoutRequest<
			HelpScoutEndpointOutputs['customers.deleteWebsite']
		>(
			`/customers/${encodeURIComponent(String(parsedInput.customerId))}/websites/${encodeURIComponent(String(parsedInput.websiteId))}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);

		const parsed = HelpScoutEndpointOutputSchemas[
			'customers.deleteWebsite'
		].parse(response ?? {});

		await logEventFromContext(
			ctx,
			'helpscout.customers.deleteWebsite',
			{ customerId: String(parsedInput.customerId) },
			'completed',
		);

		return parsed;
	};
