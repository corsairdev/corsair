import crypto from 'crypto';
import { z } from 'zod';

export const VercelWebhookPayloadSchema = z
	.object({
		type: z.string(),
		createdAt: z
			.union([z.number(), z.string()])
			.transform((val) => Number(val)),
		teamId: z.string().optional(),
		payload: z.record(z.string(), z.unknown()),
	})
	.passthrough();

export const DeploymentCreatedEventSchema = VercelWebhookPayloadSchema.extend({
	type: z.literal('deployment.created'),
	payload: z
		.object({
			deployment: z
				.object({
					id: z.string(),
					name: z.string(),
					url: z.string(),
					target: z.string().optional(),
					meta: z.record(z.string(), z.string()).optional(),
				})
				.passthrough(),
		})
		.passthrough(),
}).passthrough();

export const DeploymentSucceededEventSchema = VercelWebhookPayloadSchema.extend(
	{
		type: z.literal('deployment.succeeded'),
		payload: z
			.object({
				deployment: z
					.object({
						id: z.string(),
						name: z.string(),
						url: z.string(),
						target: z.string().optional(),
						meta: z.record(z.string(), z.string()).optional(),
					})
					.passthrough(),
			})
			.passthrough(),
	},
).passthrough();

export const DeploymentErrorEventSchema = VercelWebhookPayloadSchema.extend({
	type: z.literal('deployment.error'),
	payload: z
		.object({
			deployment: z
				.object({
					id: z.string(),
					name: z.string(),
					url: z.string(),
					target: z.string().optional(),
					meta: z.record(z.string(), z.string()).optional(),
				})
				.passthrough(),
		})
		.passthrough(),
}).passthrough();

export const ProjectCreatedEventSchema = VercelWebhookPayloadSchema.extend({
	type: z.literal('project.created'),
	payload: z
		.object({
			project: z
				.object({
					id: z.string(),
					name: z.string(),
				})
				.passthrough(),
		})
		.passthrough(),
}).passthrough();

export type VercelWebhookOutputs = {
	deploymentCreated: z.infer<typeof DeploymentCreatedEventSchema>;
	deploymentSucceeded: z.infer<typeof DeploymentSucceededEventSchema>;
	deploymentError: z.infer<typeof DeploymentErrorEventSchema>;
	projectCreated: z.infer<typeof ProjectCreatedEventSchema>;
};

export function createVercelMatch(eventType: string) {
	return (request: any) => {
		try {
			const parsed = VercelWebhookPayloadSchema.parse(
				request.body || request.payload || request,
			);
			return parsed.type === eventType;
		} catch {
			return false;
		}
	};
}

export function verifyVercelWebhookSignature(
	request: {
		rawBody: string | Buffer;
		headers: Record<string, string | string[] | undefined>;
	},
	secret: string,
): boolean {
	const signature = request.headers['x-vercel-signature'];
	if (!signature || typeof signature !== 'string') return false;

	try {
		const hmac = crypto.createHmac('sha1', secret);
		const digest = hmac.update(request.rawBody).digest('hex');
		const a = Buffer.from(signature);
		const b = Buffer.from(digest);
		if (a.length !== b.length) return false;
		return crypto.timingSafeEqual(a, b);
	} catch {
		return false;
	}
}
