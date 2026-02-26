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
	spotify,
	notion,
} from 'corsair';
import { pool } from '../db';

export const corsair = createCorsair({
	multiTenancy: true,
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [
		linear(),
		slack({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.post': 'require_approval',
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
		spotify(),
		notion(),
	],
});
