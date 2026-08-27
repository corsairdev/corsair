import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Delete OAuth Provider Authorization by authorized provider ID */
/** Official: DELETE /api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/ (`externalOAuth_authorizedProviders_delete`) */
export const externalOAuthAuthorizedProvidersDelete: DatarobotEndpoints['externalOAuthAuthorizedProvidersDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['authorizedProviderId', 'authorizationID'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthAuthorizedProvidersDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List OAuth Provider Authorizations */
/** Official: GET /api/v2/externalOAuth/authorizedProviders/ (`externalOAuth_authorizedProviders_list`) */
export const externalOAuthAuthorizedProvidersList: DatarobotEndpoints['externalOAuthAuthorizedProvidersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/authorizedProviders/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthAuthorizedProvidersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Acquire OAuth Provider Authorization's Access Token by authorized provider ID */
/** Official: POST /api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/token/ (`externalOAuth_authorizedProviders_token_create`) */
export const externalOAuthAuthorizedProvidersTokenCreate: DatarobotEndpoints['externalOAuthAuthorizedProvidersTokenCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/token/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['authorizedProviderId', 'authorizationID'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersTokenCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthAuthorizedProvidersTokenCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get User Information by authorized provider ID */
/** Official: GET /api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/userinfo/ (`externalOAuth_authorizedProviders_userinfo_list`) */
export const externalOAuthAuthorizedProvidersUserinfoList: DatarobotEndpoints['externalOAuthAuthorizedProvidersUserinfoList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/authorizedProviders/{authorizedProviderId}/userinfo/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['authorizedProviderId', 'authorizationID'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersUserinfoList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthAuthorizedProvidersUserinfoList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OAuth Provider Job by job ID */
/** Official: GET /api/v2/externalOAuth/jobs/{jobId}/ (`externalOAuth_jobs_retrieve`) */
export const externalOAuthJobsRetrieve: DatarobotEndpoints['externalOAuthJobsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/jobs/{jobId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['jobId', 'jobID'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthJobsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthJobsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Authorize OAuth Provider by provider ID */
/** Official: POST /api/v2/externalOAuth/providers/{providerId}/authorize/ (`externalOAuth_providers_authorize_create`) */
export const externalOAuthProvidersAuthorizeCreate: DatarobotEndpoints['externalOAuthProvidersAuthorizeCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/providers/{providerId}/authorize/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['providerId'],
			['state', 'redirect_uri'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersAuthorizeCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersAuthorizeCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** OAuth Provider Callback */
/** Official: POST /api/v2/externalOAuth/providers/callback/ (`externalOAuth_providers_callback_create`) */
export const externalOAuthProvidersCallbackCreate: DatarobotEndpoints['externalOAuthProvidersCallbackCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/providers/callback/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersCallbackCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersCallbackCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create OAuth Provider */
/** Official: POST /api/v2/externalOAuth/providers/ (`externalOAuth_providers_create`) */
export const externalOAuthProvidersCreate: DatarobotEndpoints['externalOAuthProvidersCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalOAuth/providers/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete OAuth Provider by provider ID */
/** Official: DELETE /api/v2/externalOAuth/providers/{providerID}/ (`externalOAuth_providers_delete`) */
export const externalOAuthProvidersDelete: DatarobotEndpoints['externalOAuthProvidersDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/providers/{providerID}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['providerID', 'providerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersDelete.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List OAuth Providers */
/** Official: GET /api/v2/externalOAuth/providers/ (`externalOAuth_providers_list`) */
export const externalOAuthProvidersList: DatarobotEndpoints['externalOAuthProvidersList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/externalOAuth/providers/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['ids', 'types', 'host', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update OAuth Provider by provider ID */
/** Official: PATCH /api/v2/externalOAuth/providers/{providerID}/ (`externalOAuth_providers_patch`) */
export const externalOAuthProvidersPatch: DatarobotEndpoints['externalOAuthProvidersPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/providers/{providerID}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['providerID', 'providerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get OAuth Provider by provider ID */
/** Official: GET /api/v2/externalOAuth/providers/{providerID}/ (`externalOAuth_providers_retrieve`) */
export const externalOAuthProvidersRetrieve: DatarobotEndpoints['externalOAuthProvidersRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/externalOAuth/providers/{providerID}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['providerID', 'providerId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.externalOAuthProvidersRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.externalOAuth.externalOAuthProvidersRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
