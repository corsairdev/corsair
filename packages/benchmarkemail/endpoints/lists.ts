/**
 * Benchmark Email lists endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Contacts / General list routes)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import { compactQuery } from './shared';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const createContactList: BenchmarkEmailEndpoints['listsCreateContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsCreateContactList']
		>(`Contact/`, ctx.key, { method: 'POST', body: input.data });

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.createContactList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteContactList: BenchmarkEmailEndpoints['listsDeleteContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsDeleteContactList']
		>(`Contact/${encodeURIComponent(input.listID)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.deleteContactList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteList: BenchmarkEmailEndpoints['listsDeleteList'] = async (
	ctx,
	input,
) => {
	const response = await makeBenchmarkEmailRequest<
		BenchmarkEmailEndpointOutputs['listsDeleteList']
	>(`Contact/DeleteList/${encodeURIComponent(input.listIDs)}`, ctx.key, {
		method: 'DELETE',
	});

	await logEventFromContext(
		ctx,
		'benchmarkemail.lists.deleteList',
		{ ...input },
		'completed',
	);
	return response;
};

export const getContactListDeepView: BenchmarkEmailEndpoints['listsGetContactListDeepView'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetContactListDeepView']
		>(`Contact/${encodeURIComponent(input.listIDs)}/All`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getContactListDeepView',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactListDetails: BenchmarkEmailEndpoints['listsGetContactListDetails'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetContactListDetails']
		>(`Contact/${encodeURIComponent(input.listID)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getContactListDetails',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactListFieldNames: BenchmarkEmailEndpoints['listsGetContactListFieldNames'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetContactListFieldNames']
		>(`Contact/${encodeURIComponent(input.listID)}/Fields`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getContactListFieldNames',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactLists: BenchmarkEmailEndpoints['listsGetContactLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetContactLists']
		>(`Contact/`, ctx.key, {
			method: 'GET',
			query: compactQuery({ page: input.page, pageSize: input.pageSize }),
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getContactLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDeleteListCheck: BenchmarkEmailEndpoints['listsGetDeleteListCheck'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetDeleteListCheck']
		>(`Contact/DeleteListCheck/${encodeURIComponent(input.listIDs)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getDeleteListCheck',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getListUploadTerms: BenchmarkEmailEndpoints['listsGetListUploadTerms'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetListUploadTerms']
		>(`Client/ListUploadTerms`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getListUploadTerms',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactListSummary: BenchmarkEmailEndpoints['listsGetContactListSummary'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsGetContactListSummary']
		>(`Contact/${encodeURIComponent(input.listID)}/ContactSummary`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.getContactListSummary',
			{ ...input },
			'completed',
		);
		return response;
	};

export const restoreTrashList: BenchmarkEmailEndpoints['listsRestoreTrashList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsRestoreTrashList']
		>(
			`Contact/RestoreTrashList/${encodeURIComponent(input.listIDs)}`,
			ctx.key,
			{ method: 'PATCH', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.restoreTrashList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateContactList: BenchmarkEmailEndpoints['listsUpdateContactList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['listsUpdateContactList']
		>(`Contact/${encodeURIComponent(input.listID)}`, ctx.key, {
			method: 'PATCH',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.lists.updateContactList',
			{ ...input },
			'completed',
		);
		return response;
	};
