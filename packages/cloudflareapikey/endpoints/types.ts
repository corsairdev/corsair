import { z } from 'zod';

const input = () => z.record(z.string(), z.unknown());
const output = () => z.unknown();

export type CloudflareApiKeyEndpointInputs = Record<string, Record<string, unknown>>;
export type CloudflareApiKeyEndpointOutputs = Record<string, unknown>;

export const CloudflareApiKeyEndpointInputSchemas = {
	zonesList: input(), zonesGet: input(), zonesCreate: input(), zonesEdit: input(), zonesDelete: input(),
	dnsList: input(), dnsGet: input(), dnsCreate: input(), dnsEdit: input(), dnsDelete: input(),
	workersList: input(), workersGet: input(), workersUpload: input(), workersDelete: input(),
	workerRoutesList: input(), workerRoutesGet: input(), workerRoutesCreate: input(), workerRoutesEdit: input(), workerRoutesDelete: input(),
	rulesetsList: input(), rulesetsGet: input(), rulesetsCreate: input(), rulesetsUpdate: input(), rulesetsDelete: input(),
} as const;

export const CloudflareApiKeyEndpointOutputSchemas = {
	zonesList: output(), zonesGet: output(), zonesCreate: output(), zonesEdit: output(), zonesDelete: output(),
	dnsList: output(), dnsGet: output(), dnsCreate: output(), dnsEdit: output(), dnsDelete: output(),
	workersList: output(), workersGet: output(), workersUpload: output(), workersDelete: output(),
	workerRoutesList: output(), workerRoutesGet: output(), workerRoutesCreate: output(), workerRoutesEdit: output(), workerRoutesDelete: output(),
	rulesetsList: output(), rulesetsGet: output(), rulesetsCreate: output(), rulesetsUpdate: output(), rulesetsDelete: output(),
} as const;
