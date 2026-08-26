import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';

// Query All Available Clock In/Clock Out Groups
// Retrieve all configured clock in/clock out groups.
export const queryAllAvailableClockClockOut: SapsuccessfactorsEndpoints['queryAllAvailableClockClockOut'] =
	async (ctx, input) => {
		const query = input as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['queryAllAvailableClockClockOut']
		>('odata/v2/ClockInClockOutGroup', ctx.key, { method: 'GET', query });
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.query.queryAllAvailableClockClockOut',
			input ?? {},
			'completed',
		);
		return response;
	};

// Query Clock In/Clock Out Group By Code
// Retrieve one clock in/out group by code, optionally with time event types.
export const queryClockClockOutGroupCodeTime: SapsuccessfactorsEndpoints['queryClockClockOutGroupCodeTime'] =
	async (ctx, input) => {
		const { code, ...query } = (input ?? {}) as { code?: string };
		const resourcePath = code
			? `odata/v2/ClockInClockOutGroup('${code}')`
			: 'odata/v2/ClockInClockOutGroup';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['queryClockClockOutGroupCodeTime']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
		});
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.query.queryClockClockOutGroupCodeTime',
			input ?? {},
			'completed',
		);
		return response;
	};
