import type { PointagramEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PointagramEndpointInputSchemas as Inputs,
	normalizeFlag,
	PointagramEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The docs describe these filters as JSON strings in the query string, such as
 * `[{"id":"13","type":1}]` and `["19145"]`. They are encoded here rather than
 * left to the caller so the wire format stays the one Pointagram parses.
 */
function jsonQuery(
	value: readonly (string | number | { id: string; type: 1 | 2 })[] | undefined,
): string | undefined {
	return value === undefined || value.length === 0
		? undefined
		: JSON.stringify(value);
}

export const list: PointagramEndpoints['scoreSeriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scoreSeries.list',
			input: Inputs.scoreSeriesList,
			output: Outputs.scoreSeriesList,
		},
		input,
		() => ({ method: 'GET', path: '/scoreseries' }),
		{
			// The docs print `data.series`; the live API sends `data.scoreseries`.
			shape: (data) => {
				if (data === null || typeof data !== 'object') return data;
				// unknown: untyped envelope data, validated by the output schema.
				const record = data as Record<string, unknown>;
				return { series: record.scoreseries ?? record.series };
			},
			log: (_, result) => ({ count: result.series.length }),
		},
	);

export const get: PointagramEndpoints['scoreSeriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scoreSeries.get',
			input: Inputs.scoreSeriesGet,
			output: Outputs.scoreSeriesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/scoreseries/${segment(id)}` }),
		{ log: ({ id }) => ({ scoreSeriesId: String(id) }) },
	);

export const addPoints: PointagramEndpoints['scoreSeriesAddPoints'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'scoreSeries.addPoints',
			input: Inputs.scoreSeriesAddPoints,
			output: Outputs.scoreSeriesAddPoints,
		},
		input,
		({
			player_id,
			player_name,
			player_email,
			player_external_id,
			scoreseries_id,
			scoreseries_name,
			points,
			pointtype_name,
			source_score_id,
			comment,
			score_time,
			tags,
			create_player,
			create_tags,
		}) => ({
			method: 'POST',
			path: '/scoreseries/points',
			body: {
				player_id,
				player_name,
				player_email,
				player_external_id,
				scoreseries_id,
				scoreseries_name,
				points,
				pointtype_name,
				source_score_id,
				comment,
				score_time,
				// Pointagram wants the tags as a JSON string inside the JSON body.
				tags: tags === undefined ? undefined : JSON.stringify(tags),
				create_player: normalizeFlag(create_player),
				create_tags: normalizeFlag(create_tags),
			},
		}),
		{
			// Only the numeric id is logged. A series named in the input is customer
			// data, so it stays out of the event payload.
			log: (parsed, result) => ({
				scoreSeriesId:
					parsed.scoreseries_id === undefined
						? undefined
						: String(parsed.scoreseries_id),
				transactionId:
					result.insid === undefined || result.insid === null
						? undefined
						: String(result.insid),
			}),
		},
	);

export const pointTypes: PointagramEndpoints['scoreSeriesPointTypes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'scoreSeries.pointTypes',
			input: Inputs.scoreSeriesPointTypes,
			output: Outputs.scoreSeriesPointTypes,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/scoreseries/${segment(id)}/pointtypes`,
		}),
		{ log: (_, result) => ({ count: result.pointtypes.length }) },
	);

export const history: PointagramEndpoints['scoreSeriesHistory'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'scoreSeries.history',
			input: Inputs.scoreSeriesHistory,
			output: Outputs.scoreSeriesHistory,
		},
		input,
		({
			id,
			tags_filter,
			tags_or_filter,
			teams_filter,
			player_filter,
			time_from,
			time_to,
			show_revoked,
			limit,
			offset,
		}) => ({
			method: 'GET',
			path: `/scoreseries/${segment(id)}/history`,
			query: {
				tags_filter: jsonQuery(tags_filter),
				tags_or_filter: jsonQuery(tags_or_filter),
				teams_filter: jsonQuery(teams_filter),
				player_filter: jsonQuery(player_filter),
				time_from,
				time_to,
				// The docs take 0 or 1 here, not a boolean.
				show_revoked:
					show_revoked === undefined ? undefined : show_revoked ? '1' : '0',
				limit,
				offset,
			},
		}),
		{ log: (_, result) => ({ count: result.history.length }) },
	);
