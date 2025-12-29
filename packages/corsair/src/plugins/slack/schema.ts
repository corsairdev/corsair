import type { CorsairPluginDBSchema } from '../../core/schema/types';

export const getSlackSchema = () => {
	return {
		slackWorkspace: {
			fields: {
				id: { type: 'string', required: true, unique: true },
				integrationId: {
					type: 'string',
					required: true,
					references: {
						model: 'integration',
						field: 'id',
						onDelete: 'cascade',
					},
				},
				teamId: { type: 'string', required: true, unique: true },
				teamName: { type: 'string', required: false },
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
				},
				updatedAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
				},
			},
			order: 10,
		},
		slackChannel: {
			fields: {
				id: { type: 'string', required: true, unique: true },
				workspaceId: {
					type: 'string',
					required: true,
					references: {
						model: 'slackWorkspace',
						field: 'id',
						onDelete: 'cascade',
					},
				},
				channelId: { type: 'string', required: true, unique: true },
				name: { type: 'string', required: false },
				isPrivate: { type: 'boolean', required: false },
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
				},
				updatedAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
				},
			},
			order: 11,
		},
		slackMessage: {
			fields: {
				id: { type: 'string', required: true, unique: true },
				channelId: {
					type: 'string',
					required: true,
					references: {
						model: 'slackChannel',
						field: 'id',
						onDelete: 'cascade',
					},
				},
				ts: { type: 'string', required: true },
				userId: { type: 'string', required: false },
				text: { type: 'string', required: false },
				raw: { type: 'json', required: false },
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
				},
			},
			order: 12,
		},
	} satisfies CorsairPluginDBSchema;
};

export type SlackSchema = ReturnType<typeof getSlackSchema>;
