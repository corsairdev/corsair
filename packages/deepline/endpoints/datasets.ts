import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	ExportRowsInputSchema,
	ExportRowsOutputSchema,
	RowHistoryInputSchema,
	RowHistoryOutputSchema,
} from './types';

export const rows = defineEndpoint({
	event: 'deepline.datasets.rows',
	input: ExportRowsInputSchema,
	output: ExportRowsOutputSchema,
	run: async (ctx, { playName, ...query }) => {
		const result = ExportRowsOutputSchema.parse(
			await makeDeeplineRequest(
				`/api/v2/plays/${segment(playName)}/sheet`,
				ctx.key,
				{ query },
			),
		);
		// Match the SDK: never silently return mutable workspace rows for a run.
		if (
			query.runId &&
			(result.scope?.kind !== 'run' ||
				result.scope.runId !== query.runId ||
				result.rows.some((row) => row.runId && row.runId !== query.runId))
		) {
			throw new Error(
				'Deepline did not confirm the requested run scope. Retry the same export; do not rerun the Play.',
			);
		}
		return result;
	},
});
export const history = defineEndpoint({
	event: 'deepline.datasets.history',
	input: RowHistoryInputSchema,
	output: RowHistoryOutputSchema,
	run: (ctx, { playName, ...query }) =>
		makeDeeplineRequest(
			`/api/v2/plays/${segment(playName)}/sheet/history`,
			ctx.key,
			{ query },
		),
});
