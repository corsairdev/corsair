import type {
	CorsairErrorHandler,
	CorsairPluginContext,
	PickAuth,
} from 'corsair/core';
import { z } from 'zod';
import type { BackendlessSchema } from '../schema';
import {
	BackendlessDataObject,
	BackendlessFile,
	BackendlessMessageStatus,
	BackendlessUser,
} from '../schema';

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
	errorHandlers?: CorsairErrorHandler;
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

/** Official empty bodies: hive create, logout, reset, permissions. */
export const BackendlessVoidSchema = z.union([
	z.null(),
	z.undefined(),
	z.literal(''),
	z.boolean(),
	z.number(),
	z.string(),
]);

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
		})
		.refine((value) => !(value.userId && value.role), {
			message: 'userId and role are mutually exclusive',
		}),
	messagePublish: z.object({
		channel: name,
		message: jsonValue,
		headers: z.record(z.string(), z.string()).optional(),
		subtopic: z.string().trim().max(512).optional(),
		publishAt: z
			.union([z.iso.datetime(), z.number().int().positive()])
			.optional(),
	}),
} as const;

export const BackendlessEndpointOutputSchemas = {
	filesCopy: z.string(),
	filesMove: z.string(),
	filesDelete: BackendlessVoidSchema,
	filesCreateDirectory: BackendlessVoidSchema,
	filesDeleteDirectory: BackendlessVoidSchema,
	filesList: z.array(BackendlessFile),
	filesCount: z.number(),
	dataRetrieve: z.union([
		BackendlessDataObject,
		z.array(BackendlessDataObject),
	]),
	hiveCreate: BackendlessVoidSchema,
	hiveValues: z.record(z.string(), z.unknown()),
	hiveKeyItems: z.union([
		z.array(z.unknown()),
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.record(z.string(), z.unknown()),
	]),
	hiveMapPut: z.boolean(),
	counterGet: z.number(),
	counterSet: z.boolean(),
	counterReset: BackendlessVoidSchema,
	userRegistration: BackendlessUser,
	userLogin: z.looseObject({
		user: BackendlessUser.optional(),
		userToken: z.string().optional(),
	}),
	userLogout: BackendlessVoidSchema,
	userPasswordRecovery: BackendlessVoidSchema,
	userUpdate: BackendlessUser,
	userDelete: z.union([
		z.number(),
		z.object({ deletionTime: z.number().optional() }).loose(),
		z.null(),
		z.undefined(),
		z.literal(''),
	]),
	userFind: BackendlessUser,
	userValidateToken: z.boolean(),
	permission: BackendlessVoidSchema,
	messagePublish: BackendlessMessageStatus,
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
