import { logEventFromContext } from 'corsair/core';
import { makeSendGridRequest } from '../client';
import type { OpSpec } from './catalog';
import { enc, q } from './run';

type Ctx = Parameters<typeof logEventFromContext>[0] & { key: string };

export async function runCatalogOp(
	ctx: Ctx,
	spec: OpSpec,
	input: Record<string, unknown>,
): Promise<unknown> {
	let path = spec.path;
	for (const key of spec.pathKeys ?? []) {
		path = path.replaceAll(`{${key}}`, enc(String(input[key])));
	}

	const query = spec.queryKeys ? q(input, spec.queryKeys) : undefined;

	let body: unknown;
	if (spec.body === true) {
		body = input;
	} else if (spec.body === 'omit') {
		const next = { ...input };
		for (const key of [...(spec.pathKeys ?? []), ...(spec.queryKeys ?? [])]) {
			delete next[key];
		}
		body = next;
	}

	const result = await makeSendGridRequest<unknown>(path, ctx.key, {
		method: spec.method,
		body,
		query,
		responseHeader: spec.responseHeader,
	});

	let mapped: unknown = result;
	if (spec.mapHeader === 'x_message_id') {
		mapped = {
			x_message_id: typeof result === 'string' ? result : undefined,
		};
	} else if (spec.wrapArray) {
		const items = Array.isArray(result) ? result : [];
		mapped = { [spec.wrapArray]: items };
	} else if (result === undefined || result === null) {
		mapped = {};
	}

	if (spec.upsertList) {
		const row = mapped as { id?: string };
		const listsDb = (
			ctx as {
				db?: {
					lists?: {
						upsertByEntityId: (id: string, data: never) => Promise<unknown>;
					};
				};
			}
		).db?.lists;
		if (row.id && listsDb) {
			await listsDb.upsertByEntityId(row.id, mapped as never);
		}
	}

	await logEventFromContext(
		ctx,
		`sendgrid.${spec.nested}`,
		{ method: spec.method },
		'completed',
	);
	return mapped;
}
