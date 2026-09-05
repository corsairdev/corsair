import { logEventFromContext } from 'corsair/core';
import { makeWhautomateRequest } from '../client';
import type { WhautomateEndpoints } from '../index';
import type { WhautomateEndpointOutputs } from './types';

export const getServiceCategories: WhautomateEndpoints['getServiceCategories'] =
	async (ctx, input) => {
		const query: Record<string, string | number | boolean | undefined> = {};
		if (input.page) query.page = input.page;
		if (input.limit) query.limit = input.limit;

		const result = await makeWhautomateRequest<
			WhautomateEndpointOutputs['getServiceCategories']
		>(ctx.options.apiHost!, ctx.key, '/service-categories', {
			method: 'GET',
			query,
		});

		await logEventFromContext(
			ctx,
			'whautomate.serviceCategories.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const deleteServiceCategory: WhautomateEndpoints['deleteServiceCategory'] =
	async (ctx, input) => {
		const result = await makeWhautomateRequest<
			WhautomateEndpointOutputs['deleteServiceCategory']
		>(ctx.options.apiHost!, ctx.key, `/service-categories/${input.id}`, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'whautomate.serviceCategories.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const ServiceCategories = {
	getServiceCategories,
	deleteServiceCategory,
};
