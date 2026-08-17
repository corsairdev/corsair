import type { SalesforceRequestOptions } from '../client';
import {
	discoverSalesforceInstanceUrl,
	makeSalesforceRequest,
} from '../client';
import { soqlWhere } from '../utils';

/**
 * Minimal structural view of the plugin context the endpoints need.
 */
export type SalesforceCallContext = {
	key: string;
	options: { instanceUrl?: string | undefined; loginUrl?: string | undefined };
	keys?: unknown;
	db?: unknown;
};

/**
 * Resolves the org instance URL for a call.
 *
 * Salesforce REST must be called on the org host from the OAuth token
 * (`instance_url`), not login.salesforce.com.
 * Docs: https://help.salesforce.com/s/articleView?id=sf.remoteaccess_oauth_web_server_flow.htm
 */
export async function resolveInstanceUrl(
	ctx: SalesforceCallContext,
): Promise<string> {
	if (ctx.options.instanceUrl) return ctx.options.instanceUrl;

	const stored = await (
		ctx.keys as { get_instance_url?: () => Promise<string | null | undefined> }
	)?.get_instance_url?.();
	if (stored) {
		ctx.options.instanceUrl = stored;
		return stored;
	}

	const fromEnv = process.env.SALESFORCE_INSTANCE_URL;
	if (fromEnv) {
		ctx.options.instanceUrl = fromEnv;
		return fromEnv;
	}

	const discovered = await discoverSalesforceInstanceUrl(
		ctx.key,
		ctx.options.loginUrl,
	);
	ctx.options.instanceUrl = discovered;
	return discovered;
}

export async function salesforceCall<T>(
	ctx: SalesforceCallContext,
	endpoint: string,
	options: Omit<SalesforceRequestOptions, 'instanceUrl'> = {},
): Promise<T> {
	const instanceUrl = await resolveInstanceUrl(ctx);
	return await makeSalesforceRequest<T>(endpoint, ctx.key, {
		...options,
		instanceUrl,
	});
}

/**
 * Salesforce create/update bodies are a flat map of API field names. A
 * `CustomFields` bag is a plugin convenience and must be spread, not nested.
 */
export function flattenFields(input: object): Record<string, unknown> {
	const { CustomFields, ...rest } = input as {
		CustomFields?: Record<string, unknown>;
	} & Record<string, unknown>;
	const body: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(rest)) {
		if (value !== undefined) body[key] = value;
	}
	if (CustomFields) {
		for (const [key, value] of Object.entries(CustomFields)) {
			if (value !== undefined) body[key] = value;
		}
	}
	return body;
}

export function soqlList(
	sobject: string,
	fields: string[],
	input: { query?: string; limit?: number; offset?: number },
	extraWhere?: string[],
): string {
	const limit = input.limit ?? 200;
	const offsetStr = input.offset ? ` OFFSET ${input.offset}` : '';
	const conditions = [...(extraWhere ?? [])];
	const queryClause = soqlWhere(input.query);
	if (queryClause) conditions.push(queryClause);
	const whereStr =
		conditions.length > 0 ? ` WHERE ${conditions.join(' AND ')}` : '';
	return `SELECT ${fields.join(', ')} FROM ${sobject}${whereStr} LIMIT ${limit}${offsetStr}`;
}
