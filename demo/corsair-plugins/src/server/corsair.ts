import { createCorsair, github, linear, resend, slack, googlesheets, hubspot, posthog, gmail, googlecalendar, googledrive} from 'corsair';
import { pool } from '../db';
import { inngest } from './inngest/client';
import {
	createLinearIssueFromSlackMessage,
	notifyOnLinearIssueAssignment,
	notifyOnPosthogFeatureFlagChanges,
	notifyTeamOfNewGithubPRs,
	sendSlackUpdateOnLinearIssueCreated,
} from '@/workflows';

export const corsair = createCorsair({
	multiTenancy: true,
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		linear({
			webhookHooks: {
				issues: {
					create: {
						after: async (ctx, res) => {
							const tenantId = ctx.tenantId ?? 'default';
							const event = res.data!;
							await Promise.allSettled([
								sendSlackUpdateOnLinearIssueCreated({
									tenantId,
									event,
								}),
							]);
						},
					},
					update: {
						after: async (ctx, res) => {
							await notifyOnLinearIssueAssignment({
								tenantId: ctx.tenantId ?? 'default',
								event: res.data!,
							});
						},
					},
				},
				comments: {
					create: {
						after: async (ctx, res) => {
							await inngest.send({
								name: 'linear/comment-created',
								data: {
									tenantId: ctx.tenantId ?? 'default',
									event: res.data!,
								},
							});
						},
					},
					update: {
						after: async (ctx, res) => {
							await inngest.send({
								name: 'linear/comment-updated',
								data: {
									tenantId: ctx.tenantId ?? 'default',
									event: res.data!,
								},
							});
						},
					},
				},
			},
		}),
		slack({
			webhookHooks: {
				messages: {
					message: {
						after: async (ctx, res) => {
							await createLinearIssueFromSlackMessage({
								tenantId: ctx.tenantId ?? 'default',
								event: res.data!,
							});
						},
					},
				},
				reactions: {
					added: {
						after(ctx, response) {
							console.log('added reaction', response.data?.reaction);
						},
					},
				},
			},
		}),
		resend({
			webhookHooks: {
				emails: {
					received: {
						after: async (ctx, res) => {
							await inngest.send({
								name: 'resend/email',
								data: {
									tenantId: ctx.tenantId ?? 'default',
									event: res.data!,
								},
							});
						},
					},
				},
			},
		}),
		github({
			authType: 'api_key',
			webhookHooks: {
				starCreated: {
					after: async (ctx, res) => {
						await inngest.send({
							name: 'github/star',
							data: {
								tenantId: ctx.tenantId ?? 'default',
								event: res.data!,
							},
						});
					},
				},
				pullRequestOpened: {
					after: async (ctx, res) => {
						await notifyTeamOfNewGithubPRs({
							tenantId: ctx.tenantId ?? 'default',
							event: res.data!,
						});
					},
				},
			},
		}),
		googlesheets({
			webhookHooks: {
				rowAdded: {
					after: async (ctx, res) => {
						console.log('row added', res.data?.values);
					},
				},
			},
		}),
		googlecalendar({
			webhookHooks: {
				onEventCreated: {
					after: async (ctx, res) => {
						console.log('event created', res.data?.event);
					},
				},
			},
		}),
		googledrive({
			webhookHooks: {
				fileChanged: {
					after: async (ctx, res) => {
						console.log('file changed', res.data?.file);
					},
				},
			},
		}),
		gmail({
			webhookHooks: {
				messageReceived: {
					after: async (ctx, res) => {
						console.log('message received', res.data?.message);
					},
				},
			},
		}),
		hubspot({
			authType: 'api_key',
			credentials: {
				token: process.env.HUBSPOT_API_KEY!,
			},
			webhookHooks: {
				contactCreated: {
					after: async (ctx, res) => {
						console.log('contact created', res.data?.success);
					},
				},
			},
		}),
		posthog({
			webhookHooks: {
				events: {
					captured: {
						after: async (ctx, res) => {
							console.log('event captured', res.data?.event);
							await notifyOnPosthogFeatureFlagChanges({
								tenantId: ctx.tenantId ?? 'default',
								event: res.data!,
							});
						},
					},
				},
			},
		}),
	],
});
