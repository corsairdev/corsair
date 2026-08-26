import type { CorsairPluginContext, PickAuth } from 'corsair/core';
import { z } from 'zod';
import type { BackendlessSchema } from '../schema';

export const BackendlessAuthConfig = {
	api_key: {
		account: ['application_id', 'base_url', 'user_token'] as const,
	},
} as const;

export type BackendlessPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	restApiKey?: string;
	applicationId?: string;
	baseUrl?: string;
	userToken?: string;
	permissions?: unknown;
};

export type BackendlessContext = CorsairPluginContext<
	typeof BackendlessSchema,
	BackendlessPluginOptions,
	undefined,
	typeof BackendlessAuthConfig
>;

const name = z.string().trim().min(1).max(512);
const path = z.string().trim().min(1).max(2048);
const nonNegativeInt = z.number().int().min(0).max(1_000_000);
const jsonValue = z.unknown();

export const BackendlessEndpointInputSchemas = {
	filesCopy: z.object({ sourcePath: path, targetPath: path }),
	filesMove: z.object({ sourcePath: path, targetPath: path }),
	filesDelete: z.object({ path, fileName: name }),
	filesCreateDirectory: z.object({ path }),
	filesDeleteDirectory: z.object({ path }),
	filesList: z.object({
		path: z.string().trim().max(2048).default(''),
		pattern: z.string().trim().max(256).optional(),
		sub: z.boolean().optional(),
		pageSize: nonNegativeInt.optional(),
		offset: nonNegativeInt.optional(),
	}),
	filesCount: z.object({
		path: z.string().trim().max(2048).default(''),
		pattern: z.string().trim().max(256).optional(),
		recursive: z.boolean().optional(),
		directoryCount: z.boolean().optional(),
	}),
	dataRetrieve: z.object({
		tableName: name,
		objectId: name.optional(),
		where: z.string().trim().max(4096).optional(),
		sortBy: z.string().trim().max(1024).optional(),
		pageSize: nonNegativeInt.optional(),
		offset: nonNegativeInt.optional(),
		properties: z.array(name).max(100).optional(),
		excludeProperties: z.array(name).max(100).optional(),
		loadRelations: z.array(name).max(100).optional(),
	}),
	hiveCreate: z.object({ hiveName: name }),
	hiveValues: z.object({ hiveName: name, key: name }),
	hiveKeyItems: z
		.object({
			hiveName: name,
			key: name,
			index: z.number().int().min(-1_000_000).max(1_000_000).optional(),
			from: z.number().int().min(0).max(1_000_000).optional(),
			to: z.number().int().min(0).max(1_000_000).optional(),
		})
		.refine(
			(value) =>
				value.index === undefined ||
				(value.from === undefined && value.to === undefined),
			{
				message: 'index cannot be combined with from/to',
			},
		),
	hiveMapPut: z.object({
		hiveName: name,
		mapKey: name,
		keyName: name,
		value: jsonValue,
	}),
	counterGet: z.object({ counterName: name }),
	counterSet: z.object({
		counterName: name,
		expected: z.number(),
		updated: z.number(),
	}),
	counterReset: z.object({ counterName: name }),
	userRegistration: z.object({
		identity: z.string().trim().min(1).max(320),
		password: z.string().min(8).max(256),
		properties: z.record(z.string(), jsonValue).optional(),
	}),
	userLogin: z.object({
		login: z.string().trim().min(1).max(320),
		password: z.string().min(1).max(256),
		stayLoggedIn: z.boolean().optional(),
	}),
	userLogout: z.object({}),
	userPasswordRecovery: z.object({
		identity: z.string().trim().min(1).max(320),
	}),
	userUpdate: z.object({
		userId: name,
		properties: z
			.record(z.string(), jsonValue)
			.refine((value) => Object.keys(value).length > 0),
	}),
	userDelete: z.object({ userId: name }),
	userFind: z.object({ userId: name }),
	userValidateToken: z.object({
		userToken: z.string().trim().min(1).max(4096).optional(),
	}),
	permission: z
		.object({
			tableName: name,
			permission: z.enum([
				'ADD',
				'UPDATE',
				'FIND',
				'REMOVE',
				'DESCRIBE',
				'PERMISSION',
				'LOAD_RELATIONS',
				'ADD_RELATION',
				'DELETE_RELATION',
				'UPSERT',
				'*',
			]),
			objectId: name.optional(),
			userId: name.optional(),
			role: name.optional(),
		})
		.refine((value) => Boolean(value.userId || value.role), {
			message: 'userId or role is required',
		}),
	messagePublish: z.object({
		channel: name,
		message: jsonValue,
		headers: z.record(z.string(), z.string()).optional(),
		subtopic: z.string().trim().max(512).optional(),
		publishAt: z
			.union([z.string().datetime(), z.number().int().positive()])
			.optional(),
	}),
} as const;

export const BackendlessEndpointOutputSchemas = {
	filesCopy: z.unknown(),
	filesMove: z.unknown(),
	filesDelete: z.unknown(),
	filesCreateDirectory: z.unknown(),
	filesDeleteDirectory: z.unknown(),
	filesList: z.unknown(),
	filesCount: z.unknown(),
	dataRetrieve: z.unknown(),
	hiveCreate: z.unknown(),
	hiveValues: z.unknown(),
	hiveKeyItems: z.unknown(),
	hiveMapPut: z.unknown(),
	counterGet: z.number(),
	counterSet: z.boolean(),
	counterReset: z.unknown(),
	userRegistration: z.unknown(),
	userLogin: z
		.object({ user: z.unknown().optional(), userToken: z.string().optional() })
		.passthrough(),
	userLogout: z.unknown(),
	userPasswordRecovery: z.unknown(),
	userUpdate: z.unknown(),
	userDelete: z.unknown(),
	userFind: z.unknown(),
	userValidateToken: z.boolean(),
	permission: z.unknown(),
	messagePublish: z.unknown(),
} as const;

export type BackendlessEndpointInputs = {
	[K in keyof typeof BackendlessEndpointInputSchemas]: z.infer<
		(typeof BackendlessEndpointInputSchemas)[K]
	>;
};
export type BackendlessEndpointOutputs = {
	[K in keyof typeof BackendlessEndpointOutputSchemas]: z.infer<
		(typeof BackendlessEndpointOutputSchemas)[K]
	>;
};
