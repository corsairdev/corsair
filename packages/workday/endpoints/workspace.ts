import { logEventFromContext } from 'corsair/core';
import type { WorkdayEndpoints } from '..';
import { makeWorkdayRequest } from '../client';
import type { WorkdayEndpointOutputs } from './types';

export const getWorkspaceInstances: WorkdayEndpoints['getWorkspaceInstances'] =
	async (ctx, input) => {
		const response = await makeWorkdayRequest<
			WorkdayEndpointOutputs['getWorkspaceInstances']
		>('v1/workspace/api', ctx.key, {
			method: 'POST',
			body: input as { [key: string]: unknown },
		});
		await logEventFromContext(
			ctx,
			'workday.workspace.getWorkspaceInstances',
			input ?? {},
			'completed',
		);
		return response;
	};
