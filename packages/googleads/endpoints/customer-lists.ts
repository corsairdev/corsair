import { logEventFromContext } from 'corsair/core';
import type { GoogleAdsEndpoints } from '..';
import { GoogleAdsAPIError, makeGoogleAdsRequest } from '../client';
import type { GoogleAdsEndpointOutputs } from './types';

export const getMany: GoogleAdsEndpoints['customerListsGetMany'] = async (
	ctx,
	input,
) => {
	try {
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

		// Using `unknown` because the pageSize / pageToken fields are optional and their presence changes the shape.
		const body: Record<string, unknown> = { query };
		if (input.pageSize) {
			body.pageSize = input.pageSize;
		}
		if (input.pageToken) {
			body.pageToken = input.pageToken;
		}

		const response = await makeGoogleAdsRequest<
			GoogleAdsEndpointOutputs['customerListsGetMany']
		>(`/customers/${input.customerId}/googleAds:search`, ctx.key, {
			method: 'POST',
			body,
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

		if (response.results) {
			for (const row of response.results) {
				if (row.userList?.id) {
					await ctx.db.customerLists.upsertByEntityId(
						row.userList.id,
						row.userList,
					);
				}
			}
		}

		await logEventFromContext(
			ctx,
			'googleads.customerLists.getMany',
			{ ...input },
			'completed',
		);
		return response;
	} catch (error) {
		await logEventFromContext(
			ctx,
			'googleads.customerLists.getMany',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const create: GoogleAdsEndpoints['customerListsCreate'] = async (
	ctx,
	input,
) => {
	try {
		const response = await makeGoogleAdsRequest<
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
							membershipLifeSpan: input.membershipLifeSpan || 10000,
							crmBasedUserList: {
								uploadKeyType: input.uploadKeyType || 'CONTACT_INFO',
								dataSourceType: 'FIRST_PARTY',
							},
						},
					},
				],
			},
			developerToken: ctx.options?.developerToken,
			loginCustomerId: ctx.options?.loginCustomerId,
		});

		if (response.results) {
			for (const result of response.results) {
				if (result.resourceName) {
					const id = result.resourceName.split('/').pop();
					if (id) {
						await ctx.db.customerLists.upsertByEntityId(id, {
							id,
							resourceName: result.resourceName,
							name: input.listName,
							description: input.description,
							membershipLifeSpan: input.membershipLifeSpan
								? String(input.membershipLifeSpan)
								: undefined,
						});
					}
				}
			}
		}

		await logEventFromContext(
			ctx,
			'googleads.customerLists.create',
			{ ...input },
			'completed',
		);
		return response;
	} catch (error) {
		await logEventFromContext(
			ctx,
			'googleads.customerLists.create',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const addOrRemove: GoogleAdsEndpoints['customerListsAddOrRemove'] =
	async (ctx, input) => {
		try {
			// Step 1: Create an offline user data job
			const createJobResult = await makeGoogleAdsRequest<{
				resourceName: string;
			}>(`/customers/${input.customerId}/offlineUserDataJobs:create`, ctx.key, {
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
			});

			const jobResourceName = createJobResult.resourceName;

			if (!jobResourceName || !jobResourceName.startsWith('customers/')) {
				throw new Error('API returned invalid job resource name');
			}

			try {
				// Step 2: Add operations to the job
				// Using Record<string, unknown> because the addOperations response body is undocumented
				// and not used - only the success/failure of the call matters here.
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
				// Using Record<string, unknown> because the :run response is empty/undocumented
				// and not used - only the success/failure of the call matters here.
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
			} catch (error) {
				// Only API call failures are annotated with the orphaned job resource name.
				// DB upsert or logging failures below should NOT be reported as orphaned jobs,
				// since the Google Ads side effect has already completed at this point.
				if (error instanceof GoogleAdsAPIError) {
					throw new GoogleAdsAPIError(
						`${error.message} (Orphaned Job Resource Name: ${jobResourceName})`,
						error.code,
						error.retryAfter,
					);
				}
				throw new Error(
					`Orphaned Job: ${jobResourceName}. Original error: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			// DB upsert and logging are intentionally outside the inner try-catch.
			// If these fail, the error correctly propagates without the misleading
			// "Orphaned Job" annotation, since the Google Ads job completed successfully.
			const id = input.userListResourceName.split('/').pop();
			if (id) {
				await ctx.db.customerLists.upsertByEntityId(id, {
					id,
					resourceName: input.userListResourceName,
				});
			}

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
				},
				message:
					'Offline user data job created and started. Changes may take 6-12 hours to be reflected.',
			};
		} catch (error) {
			await logEventFromContext(
				ctx,
				'googleads.customerLists.addOrRemove',
				{
					customerId: input.customerId,
					userListResourceName: input.userListResourceName,
					operationCount: input.operations.length,
				},
				'failed',
			);
			throw error;
		}
	};
