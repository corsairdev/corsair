import { logEventFromContext } from 'corsair/core';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRawRequest } from '../client';
import type { GrafanaEndpointOutputs } from './types';

export const getDistributorHaTracker: GrafanaEndpoints['ringGetDistributorHaTracker'] =
	async (ctx, _input) => {
		const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

		let result: GrafanaEndpointOutputs['ringGetDistributorHaTracker'];

		try {
			const raw = await makeGrafanaRawRequest(
				'/distributor/ha-tracker',
				ctx.key,
				grafanaUrl,
			);

			result = {
				data: {
					html_content: raw.content,
					status_code: raw.status_code,
				},
				successful: true,
			};
		} catch (error) {
			result = {
				data: { html_content: '', status_code: 0 },
				error: error instanceof Error ? error.message : 'Unknown error',
				successful: false,
			};
		}

		if (result.successful && ctx.db.ringStatus) {
			try {
				const ringId = 'distributor-ha-tracker';
				await ctx.db.ringStatus.upsertByEntityId(ringId, {
					id: ringId,
					content: result.data.html_content,
					contentType: 'text/html',
					statusCode: result.data.status_code,
					fetchedAt: new Date(),
				});
			} catch (err) {
				console.warn(
					'Failed to save distributor ha-tracker ring status to database:',
					err,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'grafana.ring.getDistributorHaTracker',
			{},
			'completed',
		);
		return result;
	};

export const getIndexGateway: GrafanaEndpoints['ringGetIndexGateway'] = async (
	ctx,
	_input,
) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['ringGetIndexGateway'];

	try {
		const raw = await makeGrafanaRawRequest(
			'/index-gateway/ring',
			ctx.key,
			grafanaUrl,
		);

		result = {
			data: {
				content: raw.content,
				content_type: raw.content_type,
			},
			successful: true,
		};
	} catch (error) {
		result = {
			data: { content: '', content_type: '' },
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.ringStatus) {
		try {
			const ringId = 'index-gateway';
			await ctx.db.ringStatus.upsertByEntityId(ringId, {
				id: ringId,
				content: result.data.content,
				contentType: result.data.content_type,
				fetchedAt: new Date(),
			});
		} catch (err) {
			console.warn(
				'Failed to save index gateway ring status to database:',
				err,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'grafana.ring.getIndexGateway',
		{},
		'completed',
	);
	return result;
};

export const getOverridesExporter: GrafanaEndpoints['ringGetOverridesExporter'] =
	async (ctx, _input) => {
		const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

		let result: GrafanaEndpointOutputs['ringGetOverridesExporter'];

		try {
			const raw = await makeGrafanaRawRequest(
				'/overrides-exporter/ring',
				ctx.key,
				grafanaUrl,
			);

			result = {
				data: { html_content: raw.content },
				successful: true,
			};
		} catch (error) {
			result = {
				data: { html_content: '' },
				error: error instanceof Error ? error.message : 'Unknown error',
				successful: false,
			};
		}

		if (result.successful && ctx.db.ringStatus) {
			try {
				const ringId = 'overrides-exporter';
				await ctx.db.ringStatus.upsertByEntityId(ringId, {
					id: ringId,
					content: result.data.html_content,
					contentType: 'text/html',
					fetchedAt: new Date(),
				});
			} catch (err) {
				console.warn(
					'Failed to save overrides exporter ring status to database:',
					err,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'grafana.ring.getOverridesExporter',
			{},
			'completed',
		);
		return result;
	};

export const getRuler: GrafanaEndpoints['ringGetRuler'] = async (
	ctx,
	_input,
) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['ringGetRuler'];

	try {
		const raw = await makeGrafanaRawRequest('/ruler/ring', ctx.key, grafanaUrl);

		result = {
			data: {
				content: raw.content,
				content_type: raw.content_type,
			},
			successful: true,
		};
	} catch (error) {
		result = {
			data: { content: '', content_type: '' },
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.ringStatus) {
		try {
			const ringId = 'ruler';
			await ctx.db.ringStatus.upsertByEntityId(ringId, {
				id: ringId,
				content: result.data.content,
				contentType: result.data.content_type,
				fetchedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save ruler ring status to database:', err);
		}
	}

	await logEventFromContext(ctx, 'grafana.ring.getRuler', {}, 'completed');
	return result;
};

export const getTenants: GrafanaEndpoints['storeGatewayGetTenants'] = async (
	ctx,
	_input,
) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['storeGatewayGetTenants'];

	try {
		const raw = await makeGrafanaRawRequest(
			'/store-gateway/tenants',
			ctx.key,
			grafanaUrl,
		);

		result = {
			data: {
				content: raw.content,
				content_type: raw.content_type,
			},
			successful: true,
		};
	} catch (error) {
		result = {
			data: { content: '' },
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.ringStatus) {
		try {
			const ringId = 'store-gateway-tenants';
			await ctx.db.ringStatus.upsertByEntityId(ringId, {
				id: ringId,
				content: result.data.content,
				contentType: result.data.content_type,
				fetchedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save store gateway tenants to database:', err);
		}
	}

	await logEventFromContext(
		ctx,
		'grafana.storeGateway.getTenants',
		{},
		'completed',
	);
	return result;
};
