import { logEventFromContext } from 'corsair/core';
import { makeCloudflareApiKeyRequest } from '../client';

type Input = Record<string, unknown>;
type Context = Parameters<typeof logEventFromContext>[0] & { key: string };
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const stringValue = (input: Input, name: string) => String(input[name]);

async function call<T>(ctx: Context, event: string, input: Input, path: string, method: Method, body?: Input, query?: Input): Promise<T> {
	const result = await makeCloudflareApiKeyRequest<T>(path, ctx.key, { method, body, query: query as Record<string, string | number | boolean | undefined> });
	await logEventFromContext(ctx, event, input, 'completed');
	return result;
}

export const zonesList = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.zones.list', input, '/zones', 'GET', undefined, input);
export const zonesGet = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.zones.get', input, `/zones/${stringValue(input, 'zone_id')}`, 'GET');
export const zonesCreate = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.zones.create', input, '/zones', 'POST', input);
export const zonesEdit = (ctx: Context, input: Input) => { const { zone_id, ...body } = input; return call(ctx, 'cloudflareapikey.zones.edit', input, `/zones/${String(zone_id)}`, 'PATCH', body); };
export const zonesDelete = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.zones.delete', input, `/zones/${stringValue(input, 'zone_id')}`, 'DELETE');

export const dnsList = (ctx: Context, input: Input) => { const { zone_id, ...query } = input; return call(ctx, 'cloudflareapikey.dns.list', input, `/zones/${String(zone_id)}/dns_records`, 'GET', undefined, query); };
export const dnsGet = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.dns.get', input, `/zones/${stringValue(input, 'zone_id')}/dns_records/${stringValue(input, 'dns_record_id')}`, 'GET');
export const dnsCreate = (ctx: Context, input: Input) => { const { zone_id, ...body } = input; return call(ctx, 'cloudflareapikey.dns.create', input, `/zones/${String(zone_id)}/dns_records`, 'POST', body); };
export const dnsEdit = (ctx: Context, input: Input) => { const { zone_id, dns_record_id, ...body } = input; return call(ctx, 'cloudflareapikey.dns.edit', input, `/zones/${String(zone_id)}/dns_records/${String(dns_record_id)}`, 'PATCH', body); };
export const dnsDelete = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.dns.delete', input, `/zones/${stringValue(input, 'zone_id')}/dns_records/${stringValue(input, 'dns_record_id')}`, 'DELETE');

export const workersList = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.scripts.list', input, `/accounts/${stringValue(input, 'account_id')}/workers/scripts`, 'GET');
export const workersGet = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.scripts.get', input, `/accounts/${stringValue(input, 'account_id')}/workers/scripts/${stringValue(input, 'script_name')}`, 'GET');
export const workersUpload = async (ctx: Context, input: Input) => {
	const accountId = stringValue(input, 'account_id'); const scriptName = stringValue(input, 'script_name');
	const path = `/accounts/${accountId}/workers/scripts/${scriptName}`;
	const { script_content, bindings, compatibility_date } = input;
	const result = bindings != null || compatibility_date != null
		? await makeCloudflareApiKeyRequest(path, ctx.key, { method: 'PUT', formData: { metadata: JSON.stringify({ ...(bindings != null ? { bindings } : {}), ...(compatibility_date != null ? { compatibility_date } : {}) }), script: String(script_content) } })
		: await makeCloudflareApiKeyRequest(path, ctx.key, { method: 'PUT', rawBody: String(script_content), mediaType: 'application/javascript' });
	await logEventFromContext(ctx, 'cloudflareapikey.workers.scripts.upload', input, 'completed'); return result;
};
export const workersDelete = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.scripts.delete', input, `/accounts/${stringValue(input, 'account_id')}/workers/scripts/${stringValue(input, 'script_name')}`, 'DELETE');

export const workerRoutesList = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.routes.list', input, `/zones/${stringValue(input, 'zone_id')}/workers/routes`, 'GET');
export const workerRoutesGet = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.routes.get', input, `/zones/${stringValue(input, 'zone_id')}/workers/routes/${stringValue(input, 'route_id')}`, 'GET');
export const workerRoutesCreate = (ctx: Context, input: Input) => { const { zone_id, ...body } = input; return call(ctx, 'cloudflareapikey.workers.routes.create', input, `/zones/${String(zone_id)}/workers/routes`, 'POST', body); };
export const workerRoutesEdit = (ctx: Context, input: Input) => { const { zone_id, route_id, ...body } = input; return call(ctx, 'cloudflareapikey.workers.routes.edit', input, `/zones/${String(zone_id)}/workers/routes/${String(route_id)}`, 'PUT', body); };
export const workerRoutesDelete = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.workers.routes.delete', input, `/zones/${stringValue(input, 'zone_id')}/workers/routes/${stringValue(input, 'route_id')}`, 'DELETE');

export const rulesetsList = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.rulesets.list', input, `/zones/${stringValue(input, 'zone_id')}/rulesets`, 'GET');
export const rulesetsGet = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.rulesets.get', input, `/zones/${stringValue(input, 'zone_id')}/rulesets/${stringValue(input, 'ruleset_id')}`, 'GET');
export const rulesetsCreate = (ctx: Context, input: Input) => { const { zone_id, ...body } = input; return call(ctx, 'cloudflareapikey.rulesets.create', input, `/zones/${String(zone_id)}/rulesets`, 'POST', body); };
export const rulesetsUpdate = (ctx: Context, input: Input) => { const { zone_id, ruleset_id, ...body } = input; return call(ctx, 'cloudflareapikey.rulesets.update', input, `/zones/${String(zone_id)}/rulesets/${String(ruleset_id)}`, 'PUT', body); };
export const rulesetsDelete = (ctx: Context, input: Input) => call(ctx, 'cloudflareapikey.rulesets.delete', input, `/zones/${stringValue(input, 'zone_id')}/rulesets/${stringValue(input, 'ruleset_id')}`, 'DELETE');
