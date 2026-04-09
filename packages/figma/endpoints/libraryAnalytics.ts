import { logEventFromContext } from 'corsair/core';
import type { FigmaEndpoints } from '..';
import { makeFigmaRequest } from '../client';
import type { FigmaEndpointOutputs } from './types';

export const componentActions: FigmaEndpoints['libraryAnalyticsComponentActions'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsComponentActions']
		>(`v1/analytics/libraries/${file_key}/component/actions`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.componentActions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const componentUsages: FigmaEndpoints['libraryAnalyticsComponentUsages'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsComponentUsages']
		>(`v1/analytics/libraries/${file_key}/component/usages`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.componentUsages',
			{ ...input },
			'completed',
		);
		return result;
	};

export const styleActions: FigmaEndpoints['libraryAnalyticsStyleActions'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsStyleActions']
		>(`v1/analytics/libraries/${file_key}/style/actions`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.styleActions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const styleUsages: FigmaEndpoints['libraryAnalyticsStyleUsages'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsStyleUsages']
		>(`v1/analytics/libraries/${file_key}/style/usages`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.styleUsages',
			{ ...input },
			'completed',
		);
		return result;
	};

export const variableActions: FigmaEndpoints['libraryAnalyticsVariableActions'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsVariableActions']
		>(`v1/analytics/libraries/${file_key}/variable/actions`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.variableActions',
			{ ...input },
			'completed',
		);
		return result;
	};

export const variableUsages: FigmaEndpoints['libraryAnalyticsVariableUsages'] =
	async (ctx, input) => {
		const { file_key, ...queryParams } = input;
		const result = await makeFigmaRequest<
			FigmaEndpointOutputs['libraryAnalyticsVariableUsages']
		>(`v1/analytics/libraries/${file_key}/variable/usages`, ctx.key, {
			method: 'GET',
			query: { ...queryParams },
		});

		await logEventFromContext(
			ctx,
			'figma.libraryAnalytics.variableUsages',
			{ ...input },
			'completed',
		);
		return result;
	};
