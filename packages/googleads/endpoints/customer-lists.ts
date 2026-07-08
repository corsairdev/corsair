import { logEventFromContext } from 'corsair/core';
import type { GoogleAdsEndpoints } from '..';
import type { GoogleAdsEndpointOutputs } from './types';
import { makeGoogleAdsRequest } from '../client';

export const getMany: GoogleAdsEndpoints['customerListsGetMany'] = async (
	ctx,
	input,
) => {
	const query = `SELECT
		user_list.resource_name,
		user_list.id,
		user_list.name,
		user_list.description,
		user_list.type,
		user_list.membership_status,
		user_list.size_for_display,
		user_list.size_for_search,
		user_list.membership_life_span,
		user_list.read_only
	FROM user_list`;

	const body: Record<string, unknown> = { query };
	if (input.pageSize) {
		body.pageSize = input.pageSize;
	}
	if (input.pageToken) {
		body.pageToken = input.pageToken;
	}

	const response =
		await makeGoogleAdsRequest<
			GoogleAdsEndpointOutputs['customerListsGetMany']
		>(`/customers/${input.customerId}/googleAds:search`, ctx.key, {
			method: 'POST',
			body,
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

	await logEventFromContext(
		ctx,
		'googleads.customerLists.getMany',
		{ ...input },
		'completed',
	);
	return response;
};

export const create: GoogleAdsEndpoints['customerListsCreate'] = async (
	ctx,
	input,
) => {
	const response =
		await makeGoogleAdsRequest<
			GoogleAdsEndpointOutputs['customerListsCreate']
		>(`/customers/${input.customerId}/userLists:mutate`, ctx.key, {
			method: 'POST',
			body: {
				operations: [
					{
						create: {
							name: input.listName,
							description: input.description || '',
							membershipStatus: 'OPEN',
							membershipLifeSpan:
								input.membershipLifeSpan || 10000,
							crmBasedUserList: {
								uploadKeyType:
									input.uploadKeyType || 'CONTACT_INFO',
								dataSourceType: 'FIRST_PARTY',
							},
						},
					},
				],
			},
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

	await logEventFromContext(
		ctx,
		'googleads.customerLists.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const addOrRemove: GoogleAdsEndpoints['customerListsAddOrRemove'] =
	async (ctx, input) => {
		// Step 1: Create an offline user data job
		const createJobResult = await makeGoogleAdsRequest<{
			resourceName: string;
		}>(
			`/customers/${input.customerId}/offlineUserDataJobs:create`,
			ctx.key,
			{
				method: 'POST',
				body: {
					job: {
						type: 'CUSTOMER_MATCH_USER_LIST',
						customerMatchUserListMetadata: {
							userList: input.userListResourceName,
						},
					},
				},
				developerToken: ctx.options?.developerToken,
				loginCustomerId: ctx.options?.loginCustomerId,
			},
		);

		const jobResourceName = createJobResult.resourceName;

		// Step 2: Add operations to the job
		await makeGoogleAdsRequest<Record<string, unknown>>(
			`/${jobResourceName}:addOperations`,
			ctx.key,
			{
				method: 'POST',
				body: {
					enablePartialFailure: true,
					operations: input.operations,
				},
				developerToken: ctx.options?.developerToken,
				loginCustomerId: ctx.options?.loginCustomerId,
			},
		);

		// Step 3: Run the job
		await makeGoogleAdsRequest<Record<string, unknown>>(
			`/${jobResourceName}:run`,
			ctx.key,
			{
				method: 'POST',
				body: {},
				developerToken: ctx.options?.developerToken,
				loginCustomerId: ctx.options?.loginCustomerId,
			},
		);

		await logEventFromContext(
			ctx,
			'googleads.customerLists.addOrRemove',
			{
				customerId: input.customerId,
				userListResourceName: input.userListResourceName,
				operationCount: input.operations.length,
			},
			'completed',
		);

		return {
			job: {
				resourceName: jobResourceName,
				type: 'CUSTOMER_MATCH_USER_LIST',
				status: 'RUNNING',
			},
			message:
				'Offline user data job created and started. Changes may take 6-12 hours to be reflected.',
		};
	};
