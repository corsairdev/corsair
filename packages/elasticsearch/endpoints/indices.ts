import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, pickBody, pickQuery } from './call';

const TIMEOUT_KEYS = ['timeout', 'master_timeout'] as const;
const RESIZE_KEYS = ['wait_for_active_shards', ...TIMEOUT_KEYS] as const;
const RESIZE_BODY_KEYS = ['settings', 'aliases', 'mappings', 'conditions'];

const indexPath = (index: string) => `/${encodeIndexTarget(index)}`;

// Body fields shared by rollover and the clone/split/shrink resizes.
const resizeBody = (parsed: Record<string, unknown>) =>
	pickBody(parsed, [...RESIZE_BODY_KEYS]);

export const list: ElasticsearchEndpoints['indicesList'] = (ctx, input) =>
	call(ctx, 'indicesList', 'indices.list', input, {
		path: (parsed) =>
			parsed.index
				? `/_cat/indices/${encodeIndexTarget(parsed.index)}`
				: '/_cat/indices',
		query: () => ({ format: 'json' }),
	});

export const get: ElasticsearchEndpoints['indicesGet'] = (ctx, input) =>
	call(ctx, 'indicesGet', 'indices.get', input, {
		path: (parsed) => indexPath(parsed.index),
	});

export const create: ElasticsearchEndpoints['indicesCreate'] = (ctx, input) =>
	call(ctx, 'indicesCreate', 'indices.create', input, {
		method: 'PUT',
		path: (parsed) => indexPath(parsed.index),
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
		body: (parsed) => pickBody(parsed, ['aliases', 'mappings', 'settings']),
	});

export const exists: ElasticsearchEndpoints['indicesExists'] = (ctx, input) =>
	call(ctx, 'indicesExists', 'indices.exists', input, {
		method: 'HEAD',
		path: (parsed) => indexPath(parsed.index),
		existsStyle: true,
	});

export const remove: ElasticsearchEndpoints['indicesDelete'] = (ctx, input) =>
	call(ctx, 'indicesDelete', 'indices.delete', input, {
		method: 'DELETE',
		path: (parsed) => indexPath(parsed.index),
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS]),
	});

export const open: ElasticsearchEndpoints['indicesOpen'] = (ctx, input) =>
	call(ctx, 'indicesOpen', 'indices.open', input, {
		method: 'POST',
		path: (parsed) => `${indexPath(parsed.index)}/_open`,
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
	});

export const close: ElasticsearchEndpoints['indicesClose'] = (ctx, input) =>
	call(ctx, 'indicesClose', 'indices.close', input, {
		method: 'POST',
		path: (parsed) => `${indexPath(parsed.index)}/_close`,
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
	});

const blockPath = (index: string, block: string) =>
	`${indexPath(index)}/_block/${encodeURIComponent(block)}`;

export const addBlock: ElasticsearchEndpoints['indicesAddBlock'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesAddBlock', 'indices.addBlock', input, {
		method: 'PUT',
		path: (parsed) => blockPath(parsed.index, parsed.block),
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS]),
	});

export const removeBlock: ElasticsearchEndpoints['indicesRemoveBlock'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesRemoveBlock', 'indices.removeBlock', input, {
		method: 'DELETE',
		path: (parsed) => blockPath(parsed.index, parsed.block),
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS]),
	});

export const getMapping: ElasticsearchEndpoints['indicesGetMapping'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesGetMapping', 'indices.getMapping', input, {
		path: (parsed) => `${indexPath(parsed.index)}/_mapping`,
	});

export const putMapping: ElasticsearchEndpoints['indicesPutMapping'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesPutMapping', 'indices.putMapping', input, {
		method: 'POST',
		path: (parsed) => `${indexPath(parsed.index)}/_mapping`,
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS, 'write_index_only']),
		body: (parsed) => parsed.mappings,
	});

export const getFieldMapping: ElasticsearchEndpoints['indicesGetFieldMapping'] =
	(ctx, input) =>
		call(ctx, 'indicesGetFieldMapping', 'indices.getFieldMapping', input, {
			path: (parsed) =>
				`${indexPath(parsed.index)}/_mapping/field/${encodeURIComponent(parsed.fields)}`,
		});

export const getSettings: ElasticsearchEndpoints['indicesGetSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesGetSettings', 'indices.getSettings', input, {
		path: (parsed) =>
			`${indexPath(parsed.index)}/_settings/${encodeURIComponent(parsed.name)}`,
		query: (parsed) =>
			pickQuery(parsed, ['flat_settings', 'include_defaults', 'local']),
	});

export const putSettings: ElasticsearchEndpoints['indicesPutSettings'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesPutSettings', 'indices.putSettings', input, {
		method: 'PUT',
		path: (parsed) => `${indexPath(parsed.index)}/_settings`,
		query: (parsed) =>
			pickQuery(parsed, ['preserve_existing', 'reopen', ...TIMEOUT_KEYS]),
		body: (parsed) => parsed.settings,
	});

const aliasPath = (index: string, name: string) =>
	`${indexPath(index)}/_alias/${encodeURIComponent(name)}`;

const aliasesPath = (index: string, name: string) =>
	`${indexPath(index)}/_aliases/${encodeURIComponent(name)}`;

export const getAlias: ElasticsearchEndpoints['indicesGetAlias'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesGetAlias', 'indices.getAlias', input, {
		path: (parsed) => aliasPath(parsed.index, parsed.name),
	});

export const existsAlias: ElasticsearchEndpoints['indicesExistsAlias'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesExistsAlias', 'indices.existsAlias', input, {
		method: 'HEAD',
		path: (parsed) => aliasPath(parsed.index, parsed.name),
		existsStyle: true,
	});

export const putAlias: ElasticsearchEndpoints['indicesPutAlias'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesPutAlias', 'indices.putAlias', input, {
		method: 'POST',
		path: (parsed) => aliasesPath(parsed.index, parsed.name),
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS]),
		body: (parsed) =>
			pickBody(parsed, [
				'filter',
				'routing',
				'index_routing',
				'search_routing',
				'is_write_index',
			]),
	});

export const deleteAlias: ElasticsearchEndpoints['indicesDeleteAlias'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesDeleteAlias', 'indices.deleteAlias', input, {
		method: 'DELETE',
		path: (parsed) => aliasesPath(parsed.index, parsed.name),
		query: (parsed) => pickQuery(parsed, [...TIMEOUT_KEYS]),
	});

export const rollover: ElasticsearchEndpoints['indicesRollover'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesRollover', 'indices.rollover', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.alias)}/_rollover/${encodeURIComponent(parsed.new_index)}`,
		query: (parsed) => pickQuery(parsed, ['dry_run', 'lazy', ...RESIZE_KEYS]),
		body: (parsed) => resizeBody(parsed),
	});

export const clone: ElasticsearchEndpoints['indicesClone'] = (ctx, input) =>
	call(ctx, 'indicesClone', 'indices.clone', input, {
		method: 'POST',
		path: (parsed) =>
			`${indexPath(parsed.index)}/_clone/${encodeURIComponent(parsed.target)}`,
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
		body: (parsed) => resizeBody(parsed),
	});

export const split: ElasticsearchEndpoints['indicesSplit'] = (ctx, input) =>
	call(ctx, 'indicesSplit', 'indices.split', input, {
		method: 'POST',
		path: (parsed) =>
			`${indexPath(parsed.index)}/_split/${encodeURIComponent(parsed.target)}`,
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
		body: (parsed) => resizeBody(parsed),
	});

export const shrink: ElasticsearchEndpoints['indicesShrink'] = (ctx, input) =>
	call(ctx, 'indicesShrink', 'indices.shrink', input, {
		method: 'POST',
		path: (parsed) =>
			`${indexPath(parsed.index)}/_shrink/${encodeURIComponent(parsed.target)}`,
		query: (parsed) => pickQuery(parsed, [...RESIZE_KEYS]),
		body: (parsed) => resizeBody(parsed),
	});
export const downsample: ElasticsearchEndpoints['indicesDownsample'] = (
	ctx,
	input,
) =>
	call(ctx, 'indicesDownsample', 'indices.downsample', input, {
		method: 'POST',
		path: (parsed) =>
			`${indexPath(parsed.index)}/_downsample/${encodeURIComponent(parsed.target_index)}`,
		body: (parsed) => {
			const body: Record<string, unknown> = {
				fixed_interval: parsed.fixed_interval,
			};
			if (parsed.sampling_method !== undefined)
				body.sampling_method = parsed.sampling_method;
			return body;
		},
	});

export const analyze: ElasticsearchEndpoints['indicesAnalyze'] = (ctx, input) =>
	call(ctx, 'indicesAnalyze', 'indices.analyze', input, {
		method: 'POST',
		path: (parsed) => `${indexPath(parsed.index)}/_analyze`,
		body: (parsed) => ({
			text: parsed.text,
			...pickBody(parsed, ['analyzer', 'field', 'tokenizer', 'explain']),
		}),
	});
