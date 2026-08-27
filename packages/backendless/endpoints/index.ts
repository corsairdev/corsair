import { BackendlessClient } from '../client';
import type { BackendlessContext, BackendlessPluginOptions } from './types';
import { BackendlessEndpointInputSchemas } from './types';

function validatedStoragePath(value: string, allowEmpty = false): string {
	const trimmed = value.trim();
	if (allowEmpty && !trimmed) return '';
	if (
		!trimmed ||
		trimmed.split('/').some((part) => part === '..' || part === '.')
	) {
		throw new Error(
			'Storage paths must not be empty or contain . or .. segments',
		);
	}
	if (/[<>'"%]/.test(trimmed)) {
		throw new Error(
			'Storage paths contain characters forbidden by Backendless',
		);
	}
	return trimmed;
}

function storagePath(value: string, allowEmpty = false): string {
	const trimmed = validatedStoragePath(value, allowEmpty).replace(
		/^\/+|\/+$/g,
		'',
	);
	return trimmed
		.split('/')
		.filter(Boolean)
		.map((part) => encodeURIComponent(part))
		.join('/');
}

function storageLocation(value: string): string {
	const trimmed = validatedStoragePath(value).replace(/^\/+|\/+$/g, '');
	return `/${trimmed}`;
}

function optionsOf(ctx: BackendlessContext): BackendlessPluginOptions {
	return (ctx.options ?? {}) as BackendlessPluginOptions;
}

function identityPropertyOf(ctx: BackendlessContext): string {
	const value = optionsOf(ctx).identityProperty?.trim();
	return value || 'email';
}

async function valueFromKeyManager(
	ctx: BackendlessContext,
	field: string,
): Promise<string | undefined> {
	const manager = (ctx as unknown as { keys?: Record<string, unknown> }).keys;
	const getter = manager?.[`get_${field}`];
	if (typeof getter !== 'function') return undefined;
	try {
		const value = await (getter as () => Promise<string | null>)();
		return value ?? undefined;
	} catch (error) {
		if (error instanceof Error && /no dek found/i.test(error.message))
			return undefined;
		throw error;
	}
}

async function clientFor(
	ctx: BackendlessContext,
	userScoped = false,
): Promise<BackendlessClient> {
	const options = optionsOf(ctx);
	const applicationId =
		options.applicationId ?? (await valueFromKeyManager(ctx, 'application_id'));
	const restApiKey =
		options.restApiKey ??
		ctx.key ??
		(await valueFromKeyManager(ctx, 'api_key'));
	const baseUrl =
		options.baseUrl ?? (await valueFromKeyManager(ctx, 'base_url'));
	const userToken = userScoped
		? (options.userToken ?? (await valueFromKeyManager(ctx, 'user_token')))
		: undefined;
	if (!applicationId || !restApiKey || !baseUrl) {
		throw new Error(
			'Backendless requires applicationId, REST API key, and HTTPS baseUrl credentials',
		);
	}
	return new BackendlessClient({
		baseUrl,
		applicationId,
		restApiKey,
		userToken,
	});
}

const query = (
	input: Record<string, unknown>,
): Record<string, string | number | boolean | undefined> =>
	input as Record<string, string | number | boolean | undefined>;

export const Files = {
	copy: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesCopy.parse(input);
		return (await clientFor(ctx)).call('PUT', 'files.copy', {
			body: {
				sourcePath: storageLocation(value.sourcePath),
				targetPath: storageLocation(value.targetPath),
			},
		});
	},
	move: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesMove.parse(input);
		return (await clientFor(ctx)).call('PUT', 'files.move', {
			body: {
				sourcePath: storageLocation(value.sourcePath),
				targetPath: storageLocation(value.targetPath),
			},
		});
	},
	delete: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesDelete.parse(input);
		const resourcePath = [
			storagePath(value.path),
			encodeURIComponent(value.fileName),
		]
			.filter(Boolean)
			.join('/');
		return (await clientFor(ctx)).call('DELETE', 'files.delete', {
			path: { filePath: resourcePath },
		});
	},
	createDirectory: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.filesCreateDirectory.parse(input);
		return (await clientFor(ctx)).call('POST', 'files.directory', {
			path: { dirPath: storagePath(value.path) },
		});
	},
	deleteDirectory: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.filesDeleteDirectory.parse(input);
		return (await clientFor(ctx)).call('DELETE', 'files.directory', {
			path: { dirPath: storagePath(value.path) },
		});
	},
	list: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesList.parse(input);
		const encoded = storagePath(value.path, true);
		return (await clientFor(ctx)).call(
			'GET',
			encoded ? 'files.directory' : 'files.root',
			{
				path: encoded ? { dirPath: encoded } : undefined,
				query: query({
					pattern: value.pattern,
					sub: value.sub,
					pagesize: value.pageSize,
					offset: value.offset,
				}),
			},
		);
	},
	count: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesCount.parse(input);
		const encoded = storagePath(value.path, true);
		return (await clientFor(ctx)).call(
			'GET',
			encoded ? 'files.directory' : 'files.root',
			{
				path: encoded ? { dirPath: encoded } : undefined,
				query: query({
					action: 'count',
					pattern: value.pattern,
					sub: value.recursive,
					countDirectories: value.directoryCount,
				}),
			},
		);
	},
};

export const Data = {
	retrieve: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.dataRetrieve.parse(input);
		const tableName = encodeURIComponent(value.tableName);
		return (await clientFor(ctx, true)).call(
			'GET',
			value.objectId ? 'data.object' : 'data.table',
			{
				path: value.objectId
					? { tableName, objectId: encodeURIComponent(value.objectId) }
					: { tableName },
				query: query({
					where: value.where,
					sortBy: value.sortBy,
					pageSize: value.pageSize,
					offset: value.offset,
					properties: value.properties?.join(','),
					excludeProperties: value.excludeProperties?.join(','),
					loadRelations: value.loadRelations?.join(','),
				}),
				userScoped: true,
			},
		);
	},
};

export const Hive = {
	create: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveCreate.parse(input);
		return (await clientFor(ctx)).call('POST', 'hive.create', {
			path: { hiveName: encodeURIComponent(value.hiveName) },
		});
	},
	values: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveValues.parse(input);
		return (await clientFor(ctx)).call('GET', 'hive.map', {
			path: {
				hiveName: encodeURIComponent(value.hiveName),
				key: encodeURIComponent(value.key),
			},
		});
	},
	keyItems: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveKeyItems.parse(input);
		const path = {
			hiveName: encodeURIComponent(value.hiveName),
			key: encodeURIComponent(value.key),
		};
		if (value.index !== undefined)
			return (await clientFor(ctx)).call('GET', 'hive.listIndex', {
				path: { ...path, index: value.index },
			});
		return (await clientFor(ctx)).call('GET', 'hive.list', {
			path,
			query: query({ from: value.from, to: value.to }),
		});
	},
	mapPut: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveMapPut.parse(input);
		return (await clientFor(ctx)).call('PUT', 'hive.mapSet', {
			path: {
				hiveName: encodeURIComponent(value.hiveName),
				mapKey: encodeURIComponent(value.mapKey),
				keyName: encodeURIComponent(value.keyName),
			},
			body: { value: value.value },
		});
	},
};

export const Counters = {
	get: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterGet.parse(input);
		return (await clientFor(ctx, true)).call('GET', 'counters.get', {
			path: { counterName: encodeURIComponent(value.counterName) },
			userScoped: true,
		});
	},
	set: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterSet.parse(input);
		return (await clientFor(ctx, true)).call('PUT', 'counters.compare', {
			path: { counterName: encodeURIComponent(value.counterName) },
			query: query({ expected: value.expected, updatedvalue: value.updated }),
			userScoped: true,
		});
	},
	reset: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterReset.parse(input);
		return (await clientFor(ctx, true)).call('PUT', 'counters.reset', {
			path: { counterName: encodeURIComponent(value.counterName) },
			userScoped: true,
		});
	},
};

export const Users = {
	register: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userRegistration.parse(input);
		const properties = value.properties ?? {};
		const identityProperty = identityPropertyOf(ctx);
		return (await clientFor(ctx)).call('POST', 'users.register', {
			body: {
				...properties,
				[identityProperty]: value.identity,
				password: value.password,
			},
		});
	},
	login: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userLogin.parse(input);
		const result = await (await clientFor(ctx)).call<Record<string, unknown>>(
			'POST',
			'users.login',
			{
				body: {
					login: value.login,
					password: value.password,
				},
			},
		);
		const userToken =
			typeof result['user-token'] === 'string'
				? result['user-token']
				: typeof result.userToken === 'string'
					? result.userToken
					: undefined;
		const user = result.user ?? result;
		return { user, userToken };
	},
	logout: async (ctx: BackendlessContext, input: unknown) => {
		BackendlessEndpointInputSchemas.userLogout.parse(input);
		return (await clientFor(ctx, true)).call('GET', 'users.logout', {
			userScoped: true,
		});
	},
	passwordRecovery: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.userPasswordRecovery.parse(input);
		return (await clientFor(ctx)).call('GET', 'users.restore', {
			path: { identity: encodeURIComponent(value.identity) },
		});
	},
	update: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userUpdate.parse(input);
		return (await clientFor(ctx, true)).call('PUT', 'users.byId', {
			path: { userId: encodeURIComponent(value.userId) },
			body: value.properties,
			userScoped: true,
		});
	},
	delete: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userDelete.parse(input);
		return (await clientFor(ctx, true)).call('DELETE', 'users.byId', {
			path: { userId: encodeURIComponent(value.userId) },
			userScoped: true,
		});
	},
	find: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userFind.parse(input);
		return (await clientFor(ctx, true)).call('GET', 'users.find', {
			path: { userId: encodeURIComponent(value.userId) },
			userScoped: true,
		});
	},
	validateToken: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.userValidateToken.parse(input);
		const token =
			value.userToken ??
			optionsOf(ctx).userToken ??
			(await valueFromKeyManager(ctx, 'user_token'));
		if (!token)
			throw new Error(
				'userToken is required to validate a Backendless session',
			);
		return (await clientFor(ctx)).call('GET', 'users.validate', {
			path: { token: encodeURIComponent(token) },
		});
	},
};

export const Permissions = {
	grant: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.permission.parse(input);
		return permissionCall(ctx, value, 'GRANT');
	},
	revoke: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.permission.parse(input);
		return permissionCall(ctx, value, 'DENY');
	},
};

async function permissionCall(
	ctx: BackendlessContext,
	value: {
		tableName: string;
		permission: string;
		objectId?: string;
		userId?: string;
		role?: string;
	},
	action: 'GRANT' | 'DENY',
) {
	return (await clientFor(ctx, true)).call(
		'PUT',
		value.objectId ? 'permissions.object' : 'permissions.table',
		{
			path: {
				tableName: encodeURIComponent(value.tableName),
				action,
				...(value.objectId
					? { objectId: encodeURIComponent(value.objectId) }
					: {}),
			},
			body: {
				permission: value.permission,
				...(value.userId ? { user: value.userId } : { role: value.role }),
			},
			userScoped: true,
		},
	);
}

export const Messaging = {
	publish: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.messagePublish.parse(input);
		return (await clientFor(ctx, true)).call('POST', 'messaging.publish', {
			path: { channel: encodeURIComponent(value.channel) },
			body: {
				message: value.message,
				headers: value.headers,
				subtopic: value.subtopic,
				publishAt: value.publishAt,
			},
			userScoped: true,
		});
	},
};
