import {
	createCorsair,
	discord,
	github,
	gmail,
	googlecalendar,
	googledrive,
	googlesheets,
	hubspot,
	linear,
	posthog,
	resend,
	slack,
} from 'corsair';
import { pool } from '../db';
import { inngest } from './inngest/client';

export const corsair = createCorsair({
	multiTenancy: false,
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	plugins: [
		discord(),
		linear({
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
			},
		}),
		gmail({
			webhookHooks: {
				messageChanged: {
					after: async (ctx, res) => {
						console.log(res.data?.type, 'res.data?.type');
					},
				},
			},
		}),
		googlecalendar({
			webhookHooks: {
				onEventChanged: {
					after: async (ctx, res) => {
						console.log(res.data?.type, 'res.data?.type');
					},
				},
			},
		}),
		googledrive({
			webhookHooks: {
				driveChanged: {
					after: async (ctx, res) => {
						console.log(res.data?.type, 'res.data?.type');
						// Access all files
						res.data?.allFiles.forEach(({ file, filePath, changeType }) => {
							console.log(
								`File ${file.name} was ${changeType}, ${filePath}, ${file.size}`,
							);
						});

						// Access all folders
						res.data?.allFolders.forEach(({ folder, filePath, changeType }) => {
							console.log(
								`Folder ${folder.name} was ${changeType}, ${filePath}`,
							);
						});
					},
				},
			},
		}),
		googlesheets({
			webhookHooks: {
				rangeUpdated: {
					after: async (ctx, res) => {
						console.log('rangeUpdated', ctx.tenantId, res.data);
					},
				},
			},
		}),
		hubspot(),
		posthog(),
	],
});
