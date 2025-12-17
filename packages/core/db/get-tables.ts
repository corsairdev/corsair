import type { CorsairDBPlugin } from './plugin';
import type { CorsairDBSchema, DBFieldAttribute } from './type';

export type CorsairDBOptions = {
	plugins?: CorsairDBPlugin[] | undefined;
};

/**
 * Core DB tables that Corsair owns (auth/session/accounts/etc).
 *
 * This is intentionally minimal for now: plugins can extend/override fields and/or
 * add new tables.
 */
export const getCoreTables = (): CorsairDBSchema =>
	({
		user: {
			modelName: 'user',
			fields: {
				name: { type: 'string', required: true, fieldName: 'name' },
				email: {
					type: 'string',
					required: true,
					unique: true,
					fieldName: 'email',
					sortable: true,
				},
				emailVerified: {
					type: 'boolean',
					required: true,
					defaultValue: false,
					fieldName: 'emailVerified',
					input: false,
				},
				image: { type: 'string', required: false, fieldName: 'image' },
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					fieldName: 'createdAt',
				},
				updatedAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					onUpdate: () => new Date(),
					fieldName: 'updatedAt',
				},
			},
			order: 1,
		},
		session: {
			modelName: 'session',
			fields: {
				expiresAt: { type: 'date', required: true, fieldName: 'expiresAt' },
				token: {
					type: 'string',
					required: true,
					unique: true,
					fieldName: 'token',
				},
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					fieldName: 'createdAt',
				},
				updatedAt: {
					type: 'date',
					required: true,
					onUpdate: () => new Date(),
					fieldName: 'updatedAt',
				},
				ipAddress: { type: 'string', required: false, fieldName: 'ipAddress' },
				userAgent: { type: 'string', required: false, fieldName: 'userAgent' },
				userId: {
					type: 'string',
					required: true,
					fieldName: 'userId',
					references: { model: 'user', field: 'id', onDelete: 'cascade' },
				},
			},
			order: 2,
		},
		account: {
			modelName: 'account',
			fields: {
				accountId: {
					type: 'string',
					required: true,
					fieldName: 'accountId',
				},
				providerId: {
					type: 'string',
					required: true,
					fieldName: 'providerId',
				},
				userId: {
					type: 'string',
					required: true,
					fieldName: 'userId',
					references: { model: 'user', field: 'id', onDelete: 'cascade' },
				},
				accessToken: {
					type: 'string',
					required: false,
					fieldName: 'accessToken',
				},
				refreshToken: {
					type: 'string',
					required: false,
					fieldName: 'refreshToken',
				},
				idToken: { type: 'string', required: false, fieldName: 'idToken' },
				accessTokenExpiresAt: {
					type: 'date',
					required: false,
					fieldName: 'accessTokenExpiresAt',
				},
				refreshTokenExpiresAt: {
					type: 'date',
					required: false,
					fieldName: 'refreshTokenExpiresAt',
				},
				scope: { type: 'string', required: false, fieldName: 'scope' },
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					fieldName: 'createdAt',
				},
				updatedAt: {
					type: 'date',
					required: true,
					onUpdate: () => new Date(),
					fieldName: 'updatedAt',
				},
			},
			order: 3,
		},
		verification: {
			modelName: 'verification',
			fields: {
				identifier: {
					type: 'string',
					required: true,
					fieldName: 'identifier',
				},
				value: { type: 'string', required: true, fieldName: 'value' },
				expiresAt: {
					type: 'date',
					required: true,
					fieldName: 'expiresAt',
				},
				createdAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					fieldName: 'createdAt',
				},
				updatedAt: {
					type: 'date',
					required: true,
					defaultValue: () => new Date(),
					onUpdate: () => new Date(),
					fieldName: 'updatedAt',
				},
			},
			order: 4,
		},
	}) satisfies CorsairDBSchema;

/**
 * Merge core tables with plugin-provided schema fragments.
 *
 * - Table keys are merged by key
 * - Fields are shallow-merged (plugin wins on conflicts)
 * - modelName can be overridden by plugin
 */
export const getCorsairTables = (
	options: CorsairDBOptions,
): CorsairDBSchema => {
	const plugins = options.plugins ?? [];
	const pluginSchema = plugins.reduce(
		(acc, plugin) => {
			const schema = plugin.schema;
			if (!schema) return acc;
			for (const [key, value] of Object.entries(schema)) {
				acc[key] = {
					fields: {
						...acc[key]?.fields,
						...value.fields,
					},
					modelName: value.modelName || key,
				};
			}
			return acc;
		},
		{} as Record<
			string,
			{ fields: Record<string, DBFieldAttribute>; modelName: string }
		>,
	);

	return {
		...getCoreTables(),
		...pluginSchema,
	} satisfies CorsairDBSchema;
};
