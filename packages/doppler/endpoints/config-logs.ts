import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored - a config log's `diff` embeds the actual before/after secret
 * values that changed (confirmed live). Never logged, never mirrored. Only
 * identifiers are ever passed to `auditPayload` here.
 */

/** Lists a config's change-log entries, paginated. */
export const list: DopplerEndpoints['configLogsList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		page: number;
		logs: DopplerEndpointOutputs['configLogsList']['logs'];
	}>(ctx, 'configs/config/logs', {
		query: compact({
			project: input.project,
			config: input.config,
			page: input.page,
			per_page: input.perPage,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.configLogs.list',
		{
			...auditPayload(input, ['project', 'config']),
			returned: result.logs.length,
		},
		'completed',
	);
	return result;
};

/** Retrieves a single config log entry, including its secret diff. */
export const get: DopplerEndpoints['configLogsGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		log: DopplerEndpointOutputs['configLogsGet'];
	}>(ctx, 'configs/config/logs/log', {
		query: { project: input.project, config: input.config, log: input.log },
	});

	await logEventFromContext(
		ctx,
		'doppler.configLogs.get',
		auditPayload(input, ['project', 'config', 'log']),
		'completed',
	);
	return result.log;
};

/** Rolls a config back to the state captured by a given log entry. */
export const rollback: DopplerEndpoints['configLogsRollback'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<{
		log: DopplerEndpointOutputs['configLogsRollback'];
	}>(ctx, 'configs/config/logs/log/rollback', {
		method: 'POST',
		query: { project: input.project, config: input.config, log: input.log },
	});

	await logEventFromContext(
		ctx,
		'doppler.configLogs.rollback',
		auditPayload(input, ['project', 'config', 'log']),
		'completed',
	);
	return result.log;
};
