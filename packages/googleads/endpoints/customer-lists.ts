import { logEventFromContext } from 'corsair/core';
import type { GoogleAdsEndpoints } from '..';
import { GoogleAdsAPIError, makeGoogleAdsRequest } from '../client';
import { assertDigitsOnly, assertResourceNameFormat } from './gaql-utils';
import type { GoogleAdsEndpointOutputs } from './types';

export const getMany: GoogleAdsEndpoints['customerListsGetMany'] = async (
	ctx,
	input,
) => {
	try {
		assertDigitsOnly(input.customerId, 'customerId');

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
		FROM user_list
		LIMIT 1000`;

		// Using `unknown` because the pageToken field is optional and its presence changes the shape.
		const body: Record<string, unknown> = { query };
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
		).catch(() => {});
		throw error;
	}
};

export const create: GoogleAdsEndpoints['customerListsCreate'] = async (
	ctx,
	input,
) => {
	try {
		assertDigitsOnly(input.customerId, 'customerId');

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
		).catch(() => {});
		throw error;
	}
};

export const addOrRemove: GoogleAdsEndpoints['customerListsAddOrRemove'] =
	async (ctx, input) => {
		try {
			assertDigitsOnly(input.customerId, 'customerId');

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

			if (!jobResourceName) {
				throw new Error('API returned empty job resource name');
			}
			assertResourceNameFormat(
				jobResourceName,
				/^customers\/\d+\/offlineUserDataJobs\/\d+$/,
				'jobResourceName',
			);

			let operationsAdded = false;
			try {
				// Step 2: Add operations to the job
				// Capture response to check for partial failures — with enablePartialFailure: true,
				// rejected identifiers are returned in the response body instead of throwing.
				const addOpsResponse = await makeGoogleAdsRequest<{
					partialFailureError?: { code: number; message: string };
				}>(`/${jobResourceName}:addOperations`, ctx.key, {
					method: 'POST',
					body: {
						enablePartialFailure: true,
						operations: input.operations,
					},
					developerToken: ctx.options?.developerToken,
					loginCustomerId: ctx.options?.loginCustomerId,
				});
				operationsAdded = true;

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
				const jobState = operationsAdded ? 'Staged' : 'Orphaned';
				if (error instanceof GoogleAdsAPIError) {
					throw new GoogleAdsAPIError(
						`${error.message} (${jobState} Job Resource Name: ${jobResourceName})`,
						error.code,
						error.retryAfter,
					);
				}
				throw new Error(
					`${jobState} Job: ${jobResourceName}. Original error: ${
						error instanceof Error ? error.message : String(error)
					}`,
				);
			}

			// DB upsert and logging are intentionally outside the inner try-catch.
			// If these fail, the error correctly propagates without the misleading
			// "Orphaned Job" annotation, since the Google Ads job completed successfully.
			// Note: we intentionally skip the cache upsert here because addOrRemove
			// does not return any new list metadata. Upserting only id+resourceName
			// would erase richer fields (name, description, sizes) previously cached by getMany.

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
				// Surface partial failure info so callers can detect silently rejected operations.
				...(addOpsResponse.partialFailureError && {
					partialFailureError: addOpsResponse.partialFailureError,
				}),
				message: addOpsResponse.partialFailureError
					? `Job started with partial failures: ${addOpsResponse.partialFailureError.message}`
					: 'Offline user data job created and started. Changes may take 6-12 hours to be reflected.',
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
			).catch(() => {});
			throw error;
		}
	};
