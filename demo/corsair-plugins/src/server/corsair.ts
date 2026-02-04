import { createCorsair, linear, resend, slack } from 'corsair';
import { drizzleAdapter } from 'corsair/adapters';
import { db } from '../db';
import * as schema from '../db/schema';
import { inngest } from './inngest/client';

export const corsair = createCorsair({
	multiTenancy: true,
	database: drizzleAdapter(db, { provider: 'pg', schema }),
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		linear({
			authType: 'api_key',
			webhookHooks: {
				issues: {
					create: {
						after: async (ctx, res) => {
							await inngest.send({
								name: 'linear/issue-created',
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
								name: 'linear/issue-updated',
								data: {
									tenantId: ctx.tenantId ?? 'default',
									event: res.data!,
								},
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
			signingSecret: process.env.SLACK_SIGNING_SECRET!,
			webhookHooks: {
				messages: {
					message: {
						after: async (ctx, res) => {
							await inngest.send({
								name: 'slack/event',
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
	],
});
