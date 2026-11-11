import { logEventFromContext } from 'corsair/core';
import type { KlipfolioEndpoints } from '..';
import { makeKlipfolioRequest } from '../client';
import { klipfolioPathParameter } from './path';
import type { KlipfolioEndpointOutputs } from './types';

export const retrieveProfile: KlipfolioEndpoints['retrieveProfile'] = async (
	ctx,
	input,
) => {
	const response = await makeKlipfolioRequest<
		KlipfolioEndpointOutputs['retrieveProfile']
	>(ctx, '/profile', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'klipfolio.misc.retrieveProfile',
		input,
		'completed',
	);
	return response;
};

export const createDashboardPublishedLinks: KlipfolioEndpoints['createDashboardPublishedLinks'] =
	async (ctx, input) => {
		const { dashboardId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['createDashboardPublishedLinks']
		>(
			ctx,
			klipfolioPathParameter(
				'/dashboard-published-links/{dashboard_id}',
				'dashboard_id',
				input.dashboardId,
			),
			{ method: 'POST', body: rest },
		);
		// Published-link passwords authenticate access to the link; they are
		// redacted before the input lands in the event log.
		await logEventFromContext(
			ctx,
			'klipfolio.misc.createDashboardPublishedLinks',
			{ ...input, password: '[redacted]' },
			'completed',
		);
		return response;
	};

export const listDashboardPublishedLinks: KlipfolioEndpoints['listDashboardPublishedLinks'] =
	async (ctx, input) => {
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['listDashboardPublishedLinks']
		>(ctx, '/dashboard-published-links', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'klipfolio.misc.listDashboardPublishedLinks',
			input,
			'completed',
		);
		return response;
	};

export const updateDashboardPublishedLinks: KlipfolioEndpoints['updateDashboardPublishedLinks'] =
	async (ctx, input) => {
		const { publishedLinkId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['updateDashboardPublishedLinks']
		>(
			ctx,
			klipfolioPathParameter(
				'/dashboard-published-links/{published_link_id}',
				'published_link_id',
				input.publishedLinkId,
			),
			{ method: 'PUT', body: rest },
		);
		// Published-link passwords authenticate access to the link; they are
		// redacted before the input lands in the event log.
		await logEventFromContext(
			ctx,
			'klipfolio.misc.updateDashboardPublishedLinks',
			{ ...input, password: '[redacted]' },
			'completed',
		);
		return response;
	};

export const deleteDashboardPublishedLinks: KlipfolioEndpoints['deleteDashboardPublishedLinks'] =
	async (ctx, input) => {
		const { publishedLinkId, ...rest } = input;
		const response = await makeKlipfolioRequest<
			KlipfolioEndpointOutputs['deleteDashboardPublishedLinks']
		>(
			ctx,
			klipfolioPathParameter(
				'/dashboard-published-links/{published_link_id}',
				'published_link_id',
				input.publishedLinkId,
			),
			{ method: 'DELETE', query: rest },
		);
		await logEventFromContext(
			ctx,
			'klipfolio.misc.deleteDashboardPublishedLinks',
			input,
			'completed',
		);
		return response;
	};
