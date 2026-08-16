import { z } from 'zod';
import { hubApiPost } from '../hub/client/http';
import type { HubConfig } from '../hub/types';
import type { AiStepCallback, AiStepRequest } from './execute';

// ─────────────────────────────────────────────────────────────────────────────
// step.ai host capability
//
// Runs one durable inference for a workflow's `step.ai.*` call. The workflow
// sandbox can't reach the network, so this host-side callback does the work:
// resolve the target op's input schema (host-side, where the plugin's live Zod
// lives), send prompt + input + JSON Schema to Hub (which holds the central LLM
// key), validate the response against that same Zod schema, and retry once with
// the validation errors appended before failing. The output is returned as a
// JSON string, which `step.ai` parses back inside the realm.
// ─────────────────────────────────────────────────────────────────────────────

/** Minimal plugin shape read at runtime to resolve an op's input schema. */
type SchemaPlugin = {
	id: string;
	endpointSchemas?: Record<string, { input?: z.ZodTypeAny }>;
};

export type AiStepContext = {
	hub: HubConfig;
	plugins: readonly SchemaPlugin[];
	runId: string;
	workflowId: string;
	tenantId: string;
};

export type HubAiRequestBody = {
	runId: string;
	workflowId: string;
	stepName: string;
	kind: AiStepRequest['kind'];
	prompt: string;
	input: unknown;
	responseSchema?: unknown;
	model?: string;
};

export type HubAiResponse = {
	output: unknown;
};

/** Runs one inference against Hub and returns its output — the only impure seam. */
export type HubInfer = (body: HubAiRequestBody) => Promise<HubAiResponse>;

// One call plus one corrective retry.
const MAX_ATTEMPTS = 2;

export function resolveOpInputSchema(
	plugins: readonly SchemaPlugin[],
	op: string,
): z.ZodTypeAny {
	if (typeof op !== 'string' || op.length === 0) {
		throw new Error(
			`step.ai.object requires returnObject.op to be a string like "linear.issues.create", got ${JSON.stringify(op)}`,
		);
	}
	const dot = op.indexOf('.');
	if (dot < 1) {
		throw new Error(`Invalid op "${op}": expected "<plugin>.<endpoint.path>"`);
	}
	const pluginId = op.slice(0, dot);
	// endpointSchemas are keyed by the endpoint path WITHOUT the `.api` segment
	// (e.g. "issues.create"). Accept the call-path form the agent naturally
	// writes too — "linear.api.issues.create" == "linear.issues.create".
	let key = op.slice(dot + 1);
	if (key.startsWith('api.')) key = key.slice(4);
	const plugin = plugins.find((p) => p.id === pluginId);
	if (!plugin) throw new Error(`Unknown plugin "${pluginId}" in op "${op}"`);
	const schema = plugin.endpointSchemas?.[key]?.input;
	if (!schema) throw new Error(`No input schema registered for op "${op}"`);
	return schema;
}

function pickFields(
	schema: z.ZodTypeAny,
	pick: readonly string[],
	op: string,
): z.ZodTypeAny {
	const obj = schema as unknown as {
		pick?: (mask: Record<string, true>) => z.ZodTypeAny;
	};
	if (typeof obj.pick !== 'function') {
		throw new Error(
			`Cannot pick fields from op "${op}": its input schema is not an object`,
		);
	}
	return obj.pick(Object.fromEntries(pick.map((k) => [k, true])));
}

/** The Zod validator for the output, and whether Hub should get a JSON Schema. */
function resolveValidator(
	plugins: readonly SchemaPlugin[],
	req: AiStepRequest,
): { schema: z.ZodTypeAny; sendSchema: boolean } {
	switch (req.kind) {
		case 'text':
			return { schema: z.string(), sendSchema: false };
		case 'bool':
			return { schema: z.boolean(), sendSchema: true };
		case 'enum': {
			const options = req.options ?? [];
			if (options.length === 0) {
				throw new Error(
					`step.ai.enum("${req.stepName}") requires a non-empty options array`,
				);
			}
			return {
				schema: z.enum(options as [string, ...string[]]),
				sendSchema: true,
			};
		}
		default: {
			const ro = req.returnObject;
			if (!ro) {
				throw new Error(
					`step.ai.object("${req.stepName}") requires a returnObject`,
				);
			}
			let schema = resolveOpInputSchema(plugins, ro.op);
			if (ro.pick && ro.pick.length > 0) {
				schema = pickFields(schema, ro.pick, ro.op);
			}
			return { schema, sendSchema: true };
		}
	}
}

function formatIssues(error: z.ZodError): string {
	return error.issues
		.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
		.join('; ');
}

function defaultInfer(hub: HubConfig, tenantId: string): HubInfer {
	return (body) =>
		hubApiPost<HubAiResponse>({
			hub,
			path: `/workflows/ai?tenantId=${encodeURIComponent(tenantId)}`,
			body,
			parseResponse: (payload) => payload as HubAiResponse,
		});
}

export function createAiStepCallback(
	ctx: AiStepContext,
	infer: HubInfer = defaultInfer(ctx.hub, ctx.tenantId),
): AiStepCallback {
	return async (req) => {
		const { schema, sendSchema } = resolveValidator(ctx.plugins, req);
		const responseSchema = sendSchema
			? z.toJSONSchema(schema, { target: 'draft-7', io: 'input' })
			: undefined;

		let lastError = '';
		for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
			const prompt =
				attempt === 0
					? req.prompt
					: `${req.prompt}\n\nYour previous response failed validation: ${lastError}\nReturn a value that matches the required schema exactly.`;

			const res = await infer({
				runId: ctx.runId,
				workflowId: ctx.workflowId,
				stepName: req.stepName,
				kind: req.kind,
				prompt,
				input: req.input,
				responseSchema,
				model: req.model,
			});

			const parsed = schema.safeParse(res.output);
			if (parsed.success) return JSON.stringify(parsed.data);
			lastError = formatIssues(parsed.error);
		}

		throw new Error(
			`step.ai("${req.stepName}") output did not match the expected schema after ${MAX_ATTEMPTS} attempts: ${lastError}`,
		);
	};
}
