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
			webhookHooks: {
				issues: {
					create: {
						after: async (ctx, res) => {
							const tenantId = (ctx as any).$tenantId || 'default';
							const rawBody = (ctx as any).$rawBody;
							const linearBody = res.data as any;

							await inngest.send({
								name: 'linear/event',
								data: {
									tenantId,
									event: linearBody,
									rawBody,
								},
							});
						},
					},
					update: {
					
						after: async (ctx, res) => {
							const tenantId = (ctx as any).$tenantId || 'default';
							const rawBody = (ctx as any).$rawBody;
							const linearBody = res.data as any;
					
							await inngest.send({
								name: 'linear/event',
								data: {
									tenantId,
									event: linearBody,
									rawBody,
								},
							});
						},
					},
				},
				comments: {
					create: {
					
						after: async (ctx, res) => {
							const tenantId = (ctx as any).$tenantId || 'default';
							const rawBody = (ctx as any).$rawBody;
							const linearBody = res.data as any;
					
							await inngest.send({
								name: 'linear/event',
								data: {
									tenantId,
									event: linearBody,
									rawBody,
								},
							});
						},
					},
					update: {
					
						after: async (ctx, res) => {
							const tenantId = (ctx as any).$tenantId || 'default';
							const rawBody = (ctx as any).$rawBody;
							const linearBody = res.data as any;
							
							await inngest.send({
								name: 'linear/event',
								data: {
									tenantId,
									event: linearBody,
									rawBody,
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
							const tenantId = (ctx as any).$tenantId || 'default';
							const rawBody = (ctx as any).$rawBody;
							const slackEvent = res.data as any;
						
							await inngest.send({
								name: 'slack/event',
								data: {
									tenantId,
									event: slackEvent,
									rawBody,
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
							const tenantId = (ctx as any).$tenantId || 'default';
							const resendBody = res.data as any;
							
							const toAddress = Array.isArray(resendBody?.data?.to)
								? resendBody.data.to[0] || 'unknown'
								: resendBody?.data?.to || 'unknown';

							await inngest.send({
								name: 'resend/email',
								data: {
									tenantId,
									from: resendBody?.data?.from || 'unknown',
									to: toAddress,
									subject: resendBody?.data?.subject || 'No subject',
									text: resendBody?.data?.text,
									html: resendBody?.data?.html,
								},
							});
						},
					},
				},
			},
		}),
	],
});
