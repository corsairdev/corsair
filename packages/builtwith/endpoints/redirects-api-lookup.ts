import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';
import { makeBuiltWithRequest } from '../client';
import {
	BuiltWithEndpointInputSchemas,
	BuiltWithEndpointOutputSchemas,
} from './types';

export const redirectsApiLookup: BuiltWithEndpoints['redirectsApiLookup'] =
	async (ctx, rawInput) => {
		const input =
			BuiltWithEndpointInputSchemas.redirectsApiLookup.parse(rawInput);
		const response = await makeBuiltWithRequest(
			'redirect1/api.json',
			ctx.key,
			BuiltWithEndpointOutputSchemas.redirectsApiLookup,
			{
				method: 'GET',
				query: {
					LOOKUP: input.lookup,
				},
			},
		);

		if (response.Lookup && ctx.db.redirects) {
			try {
				const lookup = response.Lookup;
				const directions = [
					['inbound', response.Inbound],
					['outbound', response.Outbound],
				] as const;
				for (const [direction, rows] of directions) {
					for (const row of rows ?? []) {
						const id = `${lookup}|${direction}|${row.Domain}`;
						await ctx.db.redirects.upsertByEntityId(id, {
							id,
							lookup,
							direction,
							domain: row.Domain,
							firstDetected: row.FirstDetected,
							lastDetected: row.LastDetected,
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save BuiltWith redirects to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'builtwith.redirects.api.lookup',
			{ ...input },
			'completed',
		);

		return response;
	};
