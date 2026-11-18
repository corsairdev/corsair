import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	GetOnchainSqlJobsJobIdInput,
	GetOnchainSqlJobsJobIdOutput,
	OnchainBridgeRankingInput,
	OnchainBridgeRankingOutput,
	OnchainDexActivityInput,
	OnchainDexActivityOutput,
	OnchainGasPriceInput,
	OnchainGasPriceOutput,
	OnchainQueryInput,
	OnchainQueryOutput,
	OnchainSchemaInput,
	OnchainSchemaOutput,
	OnchainSqlInput,
	OnchainSqlJobsInput,
	OnchainSqlJobsJobIdInput,
	OnchainSqlJobsJobIdOutput,
	OnchainSqlJobsJobIdResultsInput,
	OnchainSqlJobsJobIdResultsOutput,
	OnchainSqlJobsOutput,
	OnchainSqlOutput,
	OnchainSqlPreflightInput,
	OnchainSqlPreflightOutput,
	OnchainTxInput,
	OnchainTxOutput,
	OnchainYieldRankingInput,
	OnchainYieldRankingOutput,
} from './types';

export const Onchain = {
	bridgeRanking: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainBridgeRanking'],
	) =>
		callSurf(
			ctx,
			'onchain.bridgeRanking',
			OnchainBridgeRankingInput,
			OnchainBridgeRankingOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/bridge/ranking',
				query: omitEmpty({
					time_range: validated.time_range,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ time_range: String(validated.time_range ?? '') }),
		),
	dexActivity: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainDexActivity'],
	) =>
		callSurf(
			ctx,
			'onchain.dexActivity',
			OnchainDexActivityInput,
			OnchainDexActivityOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/dex/activity',
				query: omitEmpty({
					chain: validated.chain,
					project: validated.project,
					address: validated.address,
					time_range: validated.time_range,
					from: validated.from,
					to: validated.to,
					group_by: validated.group_by,
				}),
			}),
			(validated) => ({ chain: String(validated.chain ?? '') }),
		),
	gasPrice: (ctx: SurfContext, input: SurfEndpointInputs['onchainGasPrice']) =>
		callSurf(
			ctx,
			'onchain.gasPrice',
			OnchainGasPriceInput,
			OnchainGasPriceOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/gas-price',
				query: omitEmpty({ chain: validated.chain }),
			}),
			(validated) => ({ chain: String(validated.chain ?? '') }),
		),
	query: (ctx: SurfContext, input: SurfEndpointInputs['onchainQuery']) =>
		callSurf(
			ctx,
			'onchain.query',
			OnchainQueryInput,
			OnchainQueryOutput,
			input,
			(validated) => ({
				method: 'POST',
				url: '/gateway/v1/onchain/query',
				body: omitEmpty({
					fields: validated.fields,
					filters: validated.filters,
					limit: validated.limit,
					offset: validated.offset,
					sort: validated.sort,
					source: validated.source,
				}),
			}),
			(validated) => ({ fields: String(validated.fields ?? '') }),
		),
	schema: (ctx: SurfContext, input: SurfEndpointInputs['onchainSchema']) =>
		callSurf(
			ctx,
			'onchain.schema',
			OnchainSchemaInput,
			OnchainSchemaOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/schema',
				query: omitEmpty({ table: validated.table }),
			}),
			(validated) => ({ table: String(validated.table ?? '') }),
		),
	sql: (ctx: SurfContext, input: SurfEndpointInputs['onchainSql']) =>
		callSurf(
			ctx,
			'onchain.sql',
			OnchainSqlInput,
			OnchainSqlOutput,
			input,
			(validated) => ({
				method: 'POST',
				url: '/gateway/v1/onchain/sql',
				body: omitEmpty({ max_rows: validated.max_rows, sql: validated.sql }),
			}),
			(validated) => ({ max_rows: String(validated.max_rows ?? '') }),
		),
	sqlJobs: (ctx: SurfContext, input: SurfEndpointInputs['onchainSqlJobs']) =>
		callSurf(
			ctx,
			'onchain.sqlJobs',
			OnchainSqlJobsInput,
			OnchainSqlJobsOutput,
			input,
			(validated) => ({
				method: 'POST',
				url: '/gateway/v1/onchain/sql/jobs',
				body: omitEmpty({ max_rows: validated.max_rows, sql: validated.sql }),
			}),
			(validated) => ({ max_rows: String(validated.max_rows ?? '') }),
		),
	sqlJobsJobId: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainSqlJobsJobId'],
	) =>
		callSurf(
			ctx,
			'onchain.sqlJobsJobId',
			OnchainSqlJobsJobIdInput,
			OnchainSqlJobsJobIdOutput,
			input,
			(validated) => ({
				method: 'DELETE',
				url: '/gateway/v1/onchain/sql/jobs/{job_id}',
				path: { job_id: validated.job_id },
			}),
			(validated) => ({ job_id: String(validated.job_id ?? '') }),
		),
	getSqlJobsJobId: (
		ctx: SurfContext,
		input: SurfEndpointInputs['getOnchainSqlJobsJobId'],
	) =>
		callSurf(
			ctx,
			'onchain.getSqlJobsJobId',
			GetOnchainSqlJobsJobIdInput,
			GetOnchainSqlJobsJobIdOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/sql/jobs/{job_id}',
				path: { job_id: validated.job_id },
			}),
			(validated) => ({ job_id: String(validated.job_id ?? '') }),
		),
	sqlJobsJobIdResults: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainSqlJobsJobIdResults'],
	) =>
		callSurf(
			ctx,
			'onchain.sqlJobsJobIdResults',
			OnchainSqlJobsJobIdResultsInput,
			OnchainSqlJobsJobIdResultsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/sql/jobs/{job_id}/results',
				path: { job_id: validated.job_id },
				query: omitEmpty({ format: validated.format }),
			}),
			(validated) => ({ job_id: String(validated.job_id ?? '') }),
		),
	sqlPreflight: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainSqlPreflight'],
	) =>
		callSurf(
			ctx,
			'onchain.sqlPreflight',
			OnchainSqlPreflightInput,
			OnchainSqlPreflightOutput,
			input,
			(validated) => ({
				method: 'POST',
				url: '/gateway/v1/onchain/sql/preflight',
				body: omitEmpty({ max_rows: validated.max_rows, sql: validated.sql }),
			}),
			(validated) => ({ max_rows: String(validated.max_rows ?? '') }),
		),
	tx: (ctx: SurfContext, input: SurfEndpointInputs['onchainTx']) =>
		callSurf(
			ctx,
			'onchain.tx',
			OnchainTxInput,
			OnchainTxOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/tx',
				query: omitEmpty({
					hash: validated.hash,
					chain: validated.chain,
					include: validated.include,
				}),
			}),
			(validated) => ({ hash: String(validated.hash ?? '') }),
		),
	yieldRanking: (
		ctx: SurfContext,
		input: SurfEndpointInputs['onchainYieldRanking'],
	) =>
		callSurf(
			ctx,
			'onchain.yieldRanking',
			OnchainYieldRankingInput,
			OnchainYieldRankingOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/onchain/yield/ranking',
				query: omitEmpty({
					project: validated.project,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ project: String(validated.project ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
