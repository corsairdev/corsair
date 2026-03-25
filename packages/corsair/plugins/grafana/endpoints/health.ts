import { logEventFromContext } from '../../utils/events';
import type { GrafanaEndpoints } from '..';
import { makeGrafanaRequest } from '../client';
import type { GrafanaEndpointOutputs } from './types';

export const get: GrafanaEndpoints['healthGet'] = async (ctx, _input) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['healthGet'];

	try {
		const raw = await makeGrafanaRequest<{
			version?: string;
			commit?: string;
			database?: string;
			enterpriseCommit?: string;
		}>('/api/health', ctx.key, grafanaUrl);

		result = {
			data: {
				version: raw.version,
				commit: raw.commit,
				database: raw.database,
				enterpriseCommit: raw.enterpriseCommit,
			},
			successful: true,
		};
	} catch (error) {
		result = {
			data: {},
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.healthStatus) {
		try {
			await ctx.db.healthStatus.upsertByEntityId('health', {
				id: 'health',
				version: result.data.version,
				commit: result.data.commit,
				database: result.data.database,
				enterpriseCommit: result.data.enterpriseCommit,
				checkedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save health status to database:', err);
		}
	}

	await logEventFromContext(ctx, 'grafana.health.get', {}, 'completed');
	return result;
};

export const getStatus: GrafanaEndpoints['statusGet'] = async (ctx, _input) => {
	const grafanaUrl = (await ctx.keys.get_grafana_url()) ?? '';

	let result: GrafanaEndpointOutputs['statusGet'];

	try {
		// Grafana Enterprise license status endpoint
		const raw = await makeGrafanaRequest<{
			licenseExpiry?: number;
			hasLicense?: boolean;
			// response shape varies; use boolean flag to determine availability
		}>('/api/licensing/check', ctx.key, grafanaUrl);

		// hasLicense or licenseExpiry presence indicates a valid license
		const license_available =
			raw.hasLicense === true || (raw.licenseExpiry !== undefined && raw.licenseExpiry > Date.now() / 1000);

		result = {
			data: { license_available },
			successful: true,
		};
	} catch (error) {
		result = {
			data: { license_available: false },
			error: error instanceof Error ? error.message : 'Unknown error',
			successful: false,
		};
	}

	if (result.successful && ctx.db.healthStatus) {
		try {
			const existing = await ctx.db.healthStatus.findByEntityId('health');
			await ctx.db.healthStatus.upsertByEntityId('health', {
				...(existing?.data ?? { id: 'health' }),
				licenseAvailable: result.data.license_available,
				checkedAt: new Date(),
			});
		} catch (err) {
			console.warn('Failed to save license status to database:', err);
		}
	}

	await logEventFromContext(ctx, 'grafana.status.get', {}, 'completed');
	return result;
};
