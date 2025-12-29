import type { CorsairDBSchema } from './types';

/**
 * Core tables are intentionally minimal: they represent the developer’s
 * existing OAuth integration records.
 */
export const coreTables = {
	integration: {
		modelName: 'integration',
		order: 1,
		fields: {
			id: { type: 'string', required: true, unique: true },
			provider: { type: 'string', required: true },
			accountId: { type: 'string', required: true },
			accessToken: { type: 'string', required: false },
			refreshToken: { type: 'string', required: false },
			expiresAt: { type: 'date', required: false },
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
	},
} satisfies CorsairDBSchema;
