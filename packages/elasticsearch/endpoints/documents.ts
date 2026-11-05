import type { ElasticsearchEndpoints } from '..';
import { encodeIndexTarget } from '../client';
import { call, notFoundFoundFalse, pickQuery } from './call';
import type { DocumentsBulkInput } from './types';

const docPath = (index: string, id: string) =>
	`/${encodeIndexTarget(index)}/_doc/${encodeURIComponent(id)}`;

export const get: ElasticsearchEndpoints['documentsGet'] = (ctx, input) =>
	call(ctx, 'documentsGet', 'documents.get', input, {
		path: (parsed) => docPath(parsed.index, parsed.id),
		notFoundIsResult: notFoundFoundFalse,
	});

export const exists: ElasticsearchEndpoints['documentsExists'] = (ctx, input) =>
	call(ctx, 'documentsExists', 'documents.exists', input, {
		method: 'HEAD',
		path: (parsed) => docPath(parsed.index, parsed.id),
		existsStyle: true,
	});

const WRITE_QUERY_KEYS = [
	'refresh',
	'routing',
	'pipeline',
	'if_seq_no',
	'if_primary_term',
	'require_alias',
	'timeout',
	'wait_for_active_shards',
] as const;

export const index: ElasticsearchEndpoints['documentsIndex'] = (ctx, input) =>
	call(ctx, 'documentsIndex', 'documents.index', input, {
		method: 'POST',
		path: (parsed) => docPath(parsed.index, parsed.id),
		query: (parsed) => pickQuery(parsed, [...WRITE_QUERY_KEYS, 'op_type']),
		body: (parsed) => parsed.document,
	});

export const create: ElasticsearchEndpoints['documentsCreate'] = (ctx, input) =>
	call(ctx, 'documentsCreate', 'documents.create', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_create/${encodeURIComponent(parsed.id)}`,
		query: (parsed) => pickQuery(parsed, [...WRITE_QUERY_KEYS]),
		body: (parsed) => parsed.document,
	});

export const update: ElasticsearchEndpoints['documentsUpdate'] = (ctx, input) =>
	call(ctx, 'documentsUpdate', 'documents.update', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_update/${encodeURIComponent(parsed.id)}`,
		query: (parsed) =>
			pickQuery(parsed, [
				'refresh',
				'retry_on_conflict',
				'routing',
				'if_seq_no',
				'if_primary_term',
			]),
		body: (parsed) => {
			const {
				index: _index,
				id: _id,
				refresh: _refresh,
				retry_on_conflict: _retry,
				routing: _routing,
				if_seq_no: _seq,
				if_primary_term: _term,
				...body
			} = parsed;
			return body;
		},
	});

export const remove: ElasticsearchEndpoints['documentsDelete'] = (ctx, input) =>
	call(ctx, 'documentsDelete', 'documents.delete', input, {
		method: 'DELETE',
		path: (parsed) => docPath(parsed.index, parsed.id),
		query: (parsed) => pickQuery(parsed, [...WRITE_QUERY_KEYS]),
		// A 404 whose body reports result "not_found" is the documented
		// no-match signal, mirroring documents.get's found: false.
		notFoundIsResult: (body) =>
			body !== null &&
			typeof body === 'object' &&
			!Array.isArray(body) &&
			(body as Record<string, unknown>).result === 'not_found',
	});

const BY_QUERY_KEYS = [
	'conflicts',
	'refresh',
	'wait_for_completion',
	'requests_per_second',
	'scroll',
	'slices',
	'pipeline',
] as const;

export const updateByQuery: ElasticsearchEndpoints['documentsUpdateByQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsUpdateByQuery', 'documents.updateByQuery', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_update_by_query`,
		query: (parsed) => pickQuery(parsed, [...BY_QUERY_KEYS]),
		body: (parsed) => {
			const body: Record<string, unknown> = {};
			if (parsed.query !== undefined) body.query = parsed.query;
			if (parsed.max_docs !== undefined) body.max_docs = parsed.max_docs;
			if (parsed.script !== undefined) body.script = parsed.script;
			return body;
		},
	});

export const deleteByQuery: ElasticsearchEndpoints['documentsDeleteByQuery'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsDeleteByQuery', 'documents.deleteByQuery', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_delete_by_query`,
		query: (parsed) => pickQuery(parsed, [...BY_QUERY_KEYS]),
		body: (parsed) => {
			const body: Record<string, unknown> = {};
			if (parsed.query !== undefined) body.query = parsed.query;
			if (parsed.max_docs !== undefined) body.max_docs = parsed.max_docs;
			return body;
		},
	});

export const mget: ElasticsearchEndpoints['documentsMget'] = (ctx, input) =>
	call(ctx, 'documentsMget', 'documents.mget', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_mget`,
		body: (parsed) =>
			parsed.ids !== undefined ? { ids: parsed.ids } : { docs: parsed.docs },
	});

export const getSource: ElasticsearchEndpoints['documentsGetSource'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsGetSource', 'documents.getSource', input, {
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_source/${encodeURIComponent(parsed.id)}`,
		query: (parsed) => pickQuery(parsed, ['routing']),
	});

export const existsSource: ElasticsearchEndpoints['documentsExistsSource'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsExistsSource', 'documents.existsSource', input, {
		method: 'HEAD',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_source/${encodeURIComponent(parsed.id)}`,
		existsStyle: true,
	});

export const explain: ElasticsearchEndpoints['documentsExplain'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsExplain', 'documents.explain', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_explain/${encodeURIComponent(parsed.id)}`,
		query: (parsed) => pickQuery(parsed, ['routing']),
		body: (parsed) => {
			const body: Record<string, unknown> = {};
			if (parsed.query !== undefined) body.query = parsed.query;
			return body;
		},
	});

const TERMVECTOR_KEYS = [
	'field_statistics',
	'term_statistics',
	'positions',
	'offsets',
	'payloads',
	'routing',
] as const;

export const termvectors: ElasticsearchEndpoints['documentsTermvectors'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsTermvectors', 'documents.termvectors', input, {
		method: 'POST',
		path: (parsed) =>
			`/${encodeIndexTarget(parsed.index)}/_termvectors/${encodeURIComponent(parsed.id)}`,
		query: (parsed) => ({
			...pickQuery(parsed, [...TERMVECTOR_KEYS]),
			// Comma-separated field list per the spec's Fields type.
			fields: parsed.fields?.join(','),
		}),
	});

export const mtermvectors: ElasticsearchEndpoints['documentsMtermvectors'] = (
	ctx,
	input,
) =>
	call(ctx, 'documentsMtermvectors', 'documents.mtermvectors', input, {
		method: 'POST',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_mtermvectors`,
		query: (parsed) => ({
			...pickQuery(parsed, [...TERMVECTOR_KEYS]),
			fields: parsed.fields?.join(','),
		}),
		body: (parsed) =>
			parsed.ids !== undefined ? { ids: parsed.ids } : { docs: parsed.docs },
	});

// Serialize typed bulk operations into the newline-delimited action/source
// pairs the bulk API requires; action metadata carries the _id.
function operationsToNdjson(parsed: DocumentsBulkInput): string {
	if (parsed.operations === undefined) return parsed.ndjson ?? '';
	const lines: string[] = [];
	for (const operation of parsed.operations) {
		switch (operation.action) {
			case 'index':
				lines.push(JSON.stringify({ index: { _id: operation._id } }));
				lines.push(JSON.stringify(operation.document));
				break;
			case 'create':
				lines.push(JSON.stringify({ create: { _id: operation._id } }));
				lines.push(JSON.stringify(operation.document));
				break;
			case 'update': {
				lines.push(JSON.stringify({ update: { _id: operation._id } }));
				const body: Record<string, unknown> = {};
				if (operation.doc !== undefined) body.doc = operation.doc;
				if (operation.script !== undefined) body.script = operation.script;
				if (operation.doc_as_upsert !== undefined)
					body.doc_as_upsert = operation.doc_as_upsert;
				if (operation.upsert !== undefined) body.upsert = operation.upsert;
				lines.push(JSON.stringify(body));
				break;
			}
			case 'delete':
				lines.push(JSON.stringify({ delete: { _id: operation._id } }));
				break;
		}
	}
	return `${lines.join('\n')}\n`;
}

export const bulk: ElasticsearchEndpoints['documentsBulk'] = (ctx, input) =>
	call(ctx, 'documentsBulk', 'documents.bulk', input, {
		// PUT is the documented method for the index-scoped bulk path.
		method: 'PUT',
		path: (parsed) => `/${encodeIndexTarget(parsed.index)}/_bulk`,
		query: (parsed) =>
			pickQuery(parsed, [
				'refresh',
				'routing',
				'pipeline',
				'require_alias',
				'timeout',
			]),
		body: (parsed) => operationsToNdjson(parsed),
		mediaType: () => 'application/x-ndjson',
	});
