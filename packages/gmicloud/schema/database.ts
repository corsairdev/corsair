import { z } from 'zod';
import * as Compute from '../endpoints/schemas/compute';
import { LlmModelSchema } from '../endpoints/schemas/inference';
import * as Sandbox from '../endpoints/schemas/sandbox';

// Entities reuse the API object schemas, so a cached record has exactly the
// fields GMI Cloud returns for it.

// Source: GET https://api.gmi-serving.com/v1/models,
// https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference
export const GmicloudModel = LlmModelSchema;

// Source: POST/GET /api/v1/ie/requestqueue/apikey/requests,
// https://docs.gmicloud.ai/inference-engine/api-reference/video-api-reference
export const GmicloudMediaRequest = z.object({
	requestId: z.string(),
	model: z.string(),
	status: z.string(),
	// unknown: model-specific request parameters, as sent.
	payload: z.record(z.string(), z.unknown()).nullish(),
	// unknown: model-specific output URLs, e.g. video_url and thumbnail_image_url.
	outcome: z.record(z.string(), z.unknown()).nullish(),
	createdAt: z.number().optional(),
	updatedAt: z.number().optional(),
});

// Source: containersResp, https://docs.gmicloud.ai/api-spec/service_api.yaml
export const GmicloudContainer = Compute.ContainersResp;

// Source: BaremetalResp, https://docs.gmicloud.ai/api-spec/service_api.yaml
export const GmicloudBaremetal = Compute.BaremetalResp;

// Source: elasticIPResp, https://docs.gmicloud.ai/api-spec/service_api.yaml
export const GmicloudElasticIp = Compute.ElasticIPResp;

// Source: FirewallResp, https://docs.gmicloud.ai/api-spec/service_api.yaml
export const GmicloudFirewall = Compute.FirewallResp;

// Source: SandboxControlDetail (list items are the SandboxControlSummary subset),
// https://docs.gmicloud.ai/api-spec/sandbox_api.yaml
export const GmicloudSandbox = Sandbox.SandboxControlDetail;

// Source: Template, https://docs.gmicloud.ai/api-spec/sandbox_api.yaml
export const GmicloudSandboxTemplate = Sandbox.Template;

export type GmicloudModel = z.infer<typeof GmicloudModel>;
export type GmicloudMediaRequest = z.infer<typeof GmicloudMediaRequest>;
export type GmicloudContainer = z.infer<typeof GmicloudContainer>;
export type GmicloudBaremetal = z.infer<typeof GmicloudBaremetal>;
export type GmicloudElasticIp = z.infer<typeof GmicloudElasticIp>;
export type GmicloudFirewall = z.infer<typeof GmicloudFirewall>;
export type GmicloudSandbox = z.infer<typeof GmicloudSandbox>;
export type GmicloudSandboxTemplate = z.infer<typeof GmicloudSandboxTemplate>;
