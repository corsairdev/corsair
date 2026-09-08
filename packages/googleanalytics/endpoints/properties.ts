import { logEventFromContext } from 'corsair/core';
import type { GoogleAnalyticsEndpoints } from '..';
import {
	encodeResourcePath,
	GOOGLE_ANALYTICS_DATA_BASE,
	GoogleAnalyticsAPIError,
	listQuery,
	makeAuthenticatedGoogleAnalyticsRequest,
	propertyPath,
} from '../client';
import type { GoogleAnalyticsEndpointOutputs } from './types';

export const get: GoogleAnalyticsEndpoints['propertiesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['propertiesGet']
	>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
		method: 'GET',
	});

	if (result.name && ctx.db.properties) {
		try {
			await ctx.db.properties.upsertByEntityId(result.name, {
				...result,
			});
		} catch (error) {
			console.warn('Failed to save property to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'googleanalytics.properties.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: GoogleAnalyticsEndpoints['propertiesList'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['propertiesList']
	>('/v1alpha/properties', ctx, {
		method: 'GET',
		query: listQuery(input),
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.properties.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listFiltered: GoogleAnalyticsEndpoints['propertiesListFiltered'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesListFiltered']
		>('/v1beta/properties', ctx, {
			method: 'GET',
			query: listQuery(input),
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.listFiltered',
			{ ...input },
			'completed',
		);
		return result;
	};

export const update: GoogleAnalyticsEndpoints['propertiesUpdate'] = async (
	ctx,
	input,
) => {
	const name = input.property?.name;
	if (!name) {
		throw new GoogleAnalyticsAPIError(
			'propertiesUpdate requires property.name (e.g. "properties/123") to identify the property to update.',
		);
	}

	const query: Record<string, string> = {};
	if (input.updateMask) {
		query.updateMask = input.updateMask;
	}

	const result = await makeAuthenticatedGoogleAnalyticsRequest<
		GoogleAnalyticsEndpointOutputs['propertiesUpdate']
	>(`/v1beta/${propertyPath(name)}`, ctx, {
		method: 'PATCH',
		body: input.property,
		query,
	});

	await logEventFromContext(
		ctx,
		'googleanalytics.properties.update',
		{ ...input },
		'completed',
	);
	return result;
};

export const createRollup: GoogleAnalyticsEndpoints['propertiesCreateRollup'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesCreateRollup']
		>('/v1alpha/properties:createRollupProperty', ctx, {
			method: 'POST',
			body: input,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.createRollup',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getAttributionSettings: GoogleAnalyticsEndpoints['propertiesGetAttributionSettings'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesGetAttributionSettings']
		>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.getAttributionSettings',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getDataRetentionSettings: GoogleAnalyticsEndpoints['propertiesGetDataRetentionSettings'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesGetDataRetentionSettings']
		>(`/v1beta/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.getDataRetentionSettings',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getGoogleSignalsSettings: GoogleAnalyticsEndpoints['propertiesGetGoogleSignalsSettings'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesGetGoogleSignalsSettings']
		>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.getGoogleSignalsSettings',
			{ ...input },
			'completed',
		);
		return result;
	};

export const getPropertyQuotasSnapshot: GoogleAnalyticsEndpoints['propertiesGetPropertyQuotasSnapshot'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedGoogleAnalyticsRequest<
			GoogleAnalyticsEndpointOutputs['propertiesGetPropertyQuotasSnapshot']
		>(`/v1alpha/${encodeResourcePath(input.name)}`, ctx, {
			method: 'GET',
			base: GOOGLE_ANALYTICS_DATA_BASE,
		});

		await logEventFromContext(
			ctx,
			'googleanalytics.properties.getPropertyQuotasSnapshot',
			{ ...input },
			'completed',
		);
		return result;
	};
