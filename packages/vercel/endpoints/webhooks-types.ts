import { z } from 'zod';
import { optNum, optStr, teamIdInput } from './common';

const webhookId = z
	.string()
	.min(1)
	.describe('Webhook id, as listed by getWebhooks.');

/** Event names Vercel documents for POST /v1/webhooks (OpenAPI spec). */
const VERCEL_WEBHOOK_EVENTS = [
	'budget.reached',
	'domain.created',
	'domain.dns.records.changed',
	'domain.transfer-in.started',
	'domain.transfer-in.completed',
	'domain.transfer-in.failed',
	'domain.certificate.add',
	'domain.certificate.add.failed',
	'domain.certificate.renew',
	'domain.certificate.renew.failed',
	'domain.certificate.deleted',
	'domain.renewal',
	'domain.renewal.failed',
	'domain.auto-renew.changed',
	'deployment.created',
	'deployment.build-requested',
	'deployment.cleanup',
	'deployment.error',
	'deployment.blocked',
	'deployment.canceled',
	'deployment.succeeded',
	'deployment.ready',
	'deployment.check-rerequested',
	'deployment.promoted',
	'deployment.rollback',
	'deployment.integration.action.start',
	'deployment.integration.action.cancel',
	'deployment.integration.action.cleanup',
	'deployment.checkrun.start',
	'deployment.checkrun.cancel',
	'edge-config.created',
	'edge-config.deleted',
	'edge-config.items.updated',
	'firewall.attack',
	'firewall.system-rule-anomaly',
	'firewall.custom-rule-anomaly',
	'function.archival-required',
	'function.removal-required',
	'alerts.triggered',
	'integration-configuration.permission-upgraded',
	'integration-configuration.removed',
	'integration-configuration.scope-change-confirmed',
	'integration-configuration.transferred',
	'integration-resource.project-connected',
	'integration-resource.project-disconnected',
	'project.created',
	'project.removed',
	'project.renamed',
	'project.env-variable.created',
	'project.env-variable.updated',
	'project.env-variable.deleted',
	'project.domain.created',
	'project.domain.updated',
	'project.domain.deleted',
	'project.domain.verified',
	'project.domain.unverified',
	'project.domain.moved',
	'project.rolling-release.started',
	'project.rolling-release.aborted',
	'project.rolling-release.completed',
	'project.rolling-release.approved',
	'deployment.checks.failed',
	'deployment.checks.succeeded',
	'deployment-checks-completed',
	'deployment-ready',
	'deployment-prepared',
	'deployment-error',
	'deployment-check-rerequested',
	'deployment-canceled',
	'project-created',
	'project-removed',
	'domain-created',
	'deployment',
	'integration-configuration-permission-updated',
	'integration-configuration-removed',
	'integration-configuration-scope-change-confirmed',
	'marketplace.member.changed',
	'marketplace.invoice.created',
	'marketplace.invoice.paid',
	'marketplace.invoice.notpaid',
	'marketplace.invoice.overdue',
	'marketplace.invoice.refunded',
	'ai-gateway.balance-depleted',
	'ai-gateway.auto-reload.limit-reached',
	'ai-gateway.budget.updated',
	'observability.anomaly',
	'observability.anomaly-error',
	'observability.usage-anomaly',
	'observability.error-anomaly',
	'botid.anomaly',
	'flag.created',
	'flag.updated',
	'flag.deleted',
	'flag.segment.created',
	'flag.segment.updated',
	'flag.segment.deleted',
	'test-webhook',
	'message.created',
	'message.updated',
	'message.deleted',
	'thread.resolved',
	'thread.unresolved',
	'message.reaction-added',
	'message.reaction-removed',
	'message.mentioned',
	'comment.created',
	'comment.updated',
	'comment.deleted',
	'comment.resolved',
	'comment.unresolved',
	'comment.reaction-added',
	'comment.reaction-removed',
	'comment.mentioned',
] as const;

// Vercel adds events often, so a name outside the documented list is sent as is.
const webhookEvent = z.union([
	z.enum(VERCEL_WEBHOOK_EVENTS),
	z.string().min(1),
]);

export const WebhookSchema = z
	.object({
		id: z.string(),
		url: optStr(),
		events: z.array(z.string()).nullable().optional(),
		ownerId: optStr(),
		projectIds: z.array(z.string()).nullable().optional(),
		projectsMetadata: z.array(z.unknown()).nullable().optional(),
		alertRuleIds: z.array(z.string()).nullable().optional(),
		createdAt: optNum(),
		updatedAt: optNum(),
	})
	.passthrough();

export const VercelWebhooksInputSchemas = {
	getWebhooks: z.object({
		teamId: teamIdInput,
		projectId: z
			.string()
			.optional()
			.describe('Only webhooks that cover this project (prj_…).'),
	}),
	getWebhook: z.object({
		teamId: teamIdInput,
		id: webhookId,
	}),
	createWebhook: z.object({
		teamId: teamIdInput,
		url: z
			.url({ protocol: /^https?$/ })
			.describe('HTTPS (or HTTP) endpoint Vercel POSTs events to.'),
		events: z
			.array(webhookEvent)
			.min(1)
			.describe(
				'Events to deliver, e.g. deployment.succeeded, deployment.error, project.created.',
			),
		projectIds: z
			.array(z.string().regex(/^[A-Za-z0-9_]+$/, 'Use project ids (prj_…).'))
			.min(1)
			.max(50)
			.optional()
			.describe(
				'Only these projects (ids, up to 50). Leave out for every project in the team.',
			),
	}),
	deleteWebhook: z.object({
		teamId: teamIdInput,
		id: webhookId,
	}),
} as const;

export const VercelWebhooksOutputSchemas = {
	getWebhooks: z.array(WebhookSchema),
	getWebhook: WebhookSchema,
	createWebhook: WebhookSchema.extend({
		secret: optStr().describe(
			'Signing secret for the x-vercel-signature header. Returned only here, at creation.',
		),
	}),
	deleteWebhook: z.object({ deleted: z.boolean(), id: z.string() }),
} as const;

export type VercelWebhooksInputs = {
	[K in keyof typeof VercelWebhooksInputSchemas]: z.input<
		(typeof VercelWebhooksInputSchemas)[K]
	>;
};
export type VercelWebhooksOutputs = {
	[K in keyof typeof VercelWebhooksOutputSchemas]: z.infer<
		(typeof VercelWebhooksOutputSchemas)[K]
	>;
};
