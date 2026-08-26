import { logEventFromContext } from 'corsair/core';
import type { SapsuccessfactorsEndpoints } from '..';
import { makeSapsuccessfactorsRequest } from '../client';
import type { SapsuccessfactorsEndpointOutputs } from './types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';

// Query All Available Clock In/Clock Out Groups
// Retrieve all configured clock in/clock out groups.
export const queryAllAvailableClockClockOut: SapsuccessfactorsEndpoints['queryAllAvailableClockClockOut'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.queryAllAvailableClockClockOut.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const query = validatedInput as Record<
			string,
			string | number | boolean | undefined
		>;
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['queryAllAvailableClockClockOut']
		>('odata/v2/ClockInClockOutGroup', ctx.key, {
			method: 'GET',
			query,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.queryAllAvailableClockClockOut.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.query.queryAllAvailableClockClockOut',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};

// Query Clock In/Clock Out Group By Code
// Retrieve one clock in/out group by code, optionally with time event types.
export const queryClockClockOutGroupCodeTime: SapsuccessfactorsEndpoints['queryClockClockOutGroupCodeTime'] =
	async (ctx, input) => {
		const validatedInput =
			SapsuccessfactorsEndpointInputSchemas.queryClockClockOutGroupCodeTime.parse(
				input ?? {},
			);
		const apiBaseUrl =
			(ctx as any)?.options?.apiBaseUrl ?? (ctx as any)?.options?.baseUrl;
		const { code, ...query } = (validatedInput ?? {}) as { code?: string };
		const resourcePath = code
			? `odata/v2/ClockInClockOutGroup('${code}')`
			: 'odata/v2/ClockInClockOutGroup';
		const response = await makeSapsuccessfactorsRequest<
			SapsuccessfactorsEndpointOutputs['queryClockClockOutGroupCodeTime']
		>(resourcePath, ctx.key, {
			method: 'GET',
			query: query as Record<string, string | number | boolean | undefined>,
			apiBaseUrl,
		});
		const validatedResponse =
			SapsuccessfactorsEndpointOutputSchemas.queryClockClockOutGroupCodeTime.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'sapsuccessfactors.query.queryClockClockOutGroupCodeTime',
			input ?? {},
			'completed',
		);
		return validatedResponse;
	};
