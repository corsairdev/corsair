import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeActiveCampaignRequest } from '../client';
import { auditPayload, listAuditPayload } from './logging';
import { evictRow, persistRow, persistRows } from './persist';
import {
	buildPaginationQuery,
	compactBody,
	compactQuery,
	resolveAccount,
} from './shared';

/**
 * Builds the five standard operations for an ActiveCampaign REST resource.
 *
 * Nearly every resource on the v3 API follows one shape: a collection at
 * `/<path>` returning rows under a plural envelope key, a single record at
 * `/<path>/{id}` under a singular key, and create/update taking a body wrapped
 * in that same singular key. Rather than repeat that eleven times with only
 * the strings changed, it is declared once here.
 *
 * Every rule the hand-written groups follow is preserved:
 *
 * - rows are validated against the entity schema before being cached, and a
 *   rejected row warns rather than failing the call
 * - cache writes are best-effort; a mirror failure never fails the operation
 * - an explicit DELETE evicts, a read never does
 * - `undefined` is stripped from bodies and queries so that "leave this alone"
 *   is not serialised as "clear this"
 * - audit payloads allow-list identifiers; everything else is logged by field
 *   name only
 *
 * The `ctx` and returned handlers are typed loosely here and re-typed at each
 * export site against the operation's own key, so the per-operation input and
 * output types are still enforced at the boundary. This is the only place in
 * the plugin where that widening happens.
 */

type ResourceCtx = {
	key: string;
	options: { account?: string };
	keys: { get_account: () => Promise<string | null | undefined> };
	db: Record<string, unknown>;
};

/**
 * The generic handler shape. `input` is `Record<string, unknown>` rather than
 * a narrower type on purpose: each export site re-types the handler against
 * its own operation key, and a narrower parameter here (`Record<string,
 * never>`, say) would make every one of those casts a non-overlapping
 * conversion.
 */
type Handler = (
	ctx: ResourceCtx,
	input: Record<string, unknown>,
) => Promise<unknown>;

export interface ResourceConfig {
	/** REST path segment, e.g. `dealGroups`. */
	path: string;
	/** Envelope key on a single-record response, e.g. `dealGroup`. */
	one: string;
	/** Envelope key on a collection response, e.g. `dealGroups`. */
	many: string;
	/** Event name prefix, e.g. `activecampaign.dealGroups`. */
	event: string;
	/** Entity schema used to validate rows before caching. Omit to skip. */
	entity?: z.ZodType;
	/** Key in `ctx.db` to mirror into. Omit to skip mirroring. */
	store?: string;
	/** Human label used in warnings, e.g. `dealGroup`. */
	label?: string;
	/**
	 * Input keys that may be logged by value. Identifiers, pagination and
	 * status flags only - never names, emails, or free text.
	 */
	logKeys?: readonly string[];
	/** Extra query parameters passed through on list, beyond pagination. */
	queryKeys?: readonly string[];
	/** Maps caller-facing keys to ActiveCampaign's wire-level query keys. */
	queryMap?: Readonly<Record<string, string>>;
	/** Body keys accepted by create and update. */
	bodyKeys?: readonly string[];
}

/** Delegates to the shared resolver so the raise-on-missing rule is uniform. */
async function account(ctx: ResourceCtx): Promise<string> {
	return resolveAccount(ctx);
}

function pick(
	input: Record<string, unknown>,
	keys: readonly string[],
): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const k of keys) out[k] = input[k];
	return out;
}

export function mapQuery(
	input: Record<string, unknown>,
	mapping: Readonly<Record<string, string>>,
): Record<string, string | number | boolean | undefined> {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const [inputKey, queryKey] of Object.entries(mapping)) {
		const value = input[inputKey];
		if (
			value === undefined ||
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			out[queryKey] = value;
		}
	}
	return compactQuery(out);
}

export function makeResource(config: ResourceConfig) {
	const label = config.label ?? config.one;
	const logKeys = config.logKeys ?? ['id', 'limit', 'offset'];

	const list: Handler = async (ctx, rawInput) => {
		const input = rawInput as Record<string, unknown>;
		const response = (await makeActiveCampaignRequest(
			config.path,
			ctx.key,
			await account(ctx),
			{
				method: 'GET',
				query: {
					...buildPaginationQuery(input as { limit?: number; offset?: number }),
					...compactQuery(
						pick(input, config.queryKeys ?? []) as Record<string, string>,
					),
					...mapQuery(input, config.queryMap ?? {}),
				},
			},
		)) as Record<string, unknown>;

		const rows = response[config.many];
		if (config.entity && config.store) {
			await persistRows(
				ctx.db[config.store] as never,
				config.entity,
				rows,
				label,
			);
		}

		await logEventFromContext(
			ctx as never,
			`${config.event}.list`,
			listAuditPayload(input, logKeys, Array.isArray(rows) ? rows.length : 0),
			'completed',
		);
		return response;
	};

	const get: Handler = async (ctx, rawInput) => {
		const input = rawInput as unknown as { id: string };
		const response = (await makeActiveCampaignRequest(
			`${config.path}/${encodeURIComponent(input.id)}`,
			ctx.key,
			await account(ctx),
			{ method: 'GET' },
		)) as Record<string, unknown>;

		if (config.entity && config.store) {
			await persistRow(
				ctx.db[config.store] as never,
				config.entity,
				response[config.one],
				label,
			);
		}

		await logEventFromContext(
			ctx as never,
			`${config.event}.get`,
			auditPayload(input as never, ['id']),
			'completed',
		);
		return response;
	};

	const create: Handler = async (ctx, rawInput) => {
		const input = rawInput as Record<string, unknown>;
		const response = (await makeActiveCampaignRequest(
			config.path,
			ctx.key,
			await account(ctx),
			{
				method: 'POST',
				body: { [config.one]: compactBody(pick(input, config.bodyKeys ?? [])) },
			},
		)) as Record<string, unknown>;

		if (config.entity && config.store) {
			await persistRow(
				ctx.db[config.store] as never,
				config.entity,
				response[config.one],
				label,
			);
		}

		await logEventFromContext(
			ctx as never,
			`${config.event}.create`,
			auditPayload(input, logKeys),
			'completed',
		);
		return response;
	};

	const update: Handler = async (ctx, rawInput) => {
		const input = rawInput as Record<string, unknown>;
		const id = input.id;
		if (typeof id !== 'string' || id.length === 0) {
			throw new Error('An id is required to update this resource');
		}
		const response = (await makeActiveCampaignRequest(
			`${config.path}/${encodeURIComponent(id)}`,
			ctx.key,
			await account(ctx),
			{
				method: 'PUT',
				body: { [config.one]: compactBody(pick(input, config.bodyKeys ?? [])) },
			},
		)) as Record<string, unknown>;

		if (config.entity && config.store) {
			await persistRow(
				ctx.db[config.store] as never,
				config.entity,
				response[config.one],
				label,
			);
		}

		await logEventFromContext(
			ctx as never,
			`${config.event}.update`,
			auditPayload(input, logKeys),
			'completed',
		);
		return response;
	};

	/**
	 * An explicit DELETE is permanent, so the mirrored row is evicted. Reads
	 * never evict - ActiveCampaign archives far more often than it deletes.
	 */
	const remove: Handler = async (ctx, rawInput) => {
		const input = rawInput as unknown as { id: string };
		await makeActiveCampaignRequest(
			`${config.path}/${encodeURIComponent(input.id)}`,
			ctx.key,
			await account(ctx),
			{ method: 'DELETE' },
		);

		if (config.store) {
			await evictRow(ctx.db[config.store] as never, input.id, label);
		}

		await logEventFromContext(
			ctx as never,
			`${config.event}.delete`,
			auditPayload(input as never, ['id']),
			'completed',
		);
		return { id: input.id };
	};

	return { list, get, create, update, remove };
}
