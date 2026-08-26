import { BackendlessClient } from '../client';
import type { BackendlessContext, BackendlessPluginOptions } from './types';
import { BackendlessEndpointInputSchemas } from './types';

function validatedStoragePath(value: string): string {
	const trimmed = value.trim();
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

function storagePath(value: string): string {
	const trimmed = validatedStoragePath(value).replace(/^\/+|\/+$/g, '');
	return trimmed
		.split('/')
		.filter(Boolean)
		.map((part) => encodeURIComponent(part))
		.join('/');
}

function optionsOf(ctx: BackendlessContext): BackendlessPluginOptions {
	return (ctx.options ?? {}) as BackendlessPluginOptions;
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
		return (await clientFor(ctx)).call('PUT', 'files/copy', {
			body: {
				sourcePath: validatedStoragePath(value.sourcePath),
				targetPath: validatedStoragePath(value.targetPath),
			},
		});
	},
	move: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesMove.parse(input);
		return (await clientFor(ctx)).call('PUT', 'files/move', {
			body: {
				sourcePath: validatedStoragePath(value.sourcePath),
				targetPath: validatedStoragePath(value.targetPath),
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
		return (await clientFor(ctx)).call('DELETE', `files/${resourcePath}`);
	},
	createDirectory: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.filesCreateDirectory.parse(input);
		return (await clientFor(ctx)).call(
			'POST',
			`files/${storagePath(value.path)}`,
		);
	},
	deleteDirectory: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.filesDeleteDirectory.parse(input);
		return (await clientFor(ctx)).call(
			'DELETE',
			`files/${storagePath(value.path)}`,
		);
	},
	list: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesList.parse(input);
		const params = query({
			pattern: value.pattern,
			sub: value.sub,
			pagesize: value.pageSize,
			offset: value.offset,
		});
		return (await clientFor(ctx)).call(
			'GET',
			`files/${storagePath(value.path)}`,
			{ query: params },
		);
	},
	count: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.filesCount.parse(input);
		const params = query({
			action: 'count',
			pattern: value.pattern,
			recursive: value.recursive,
			'directory-count': value.directoryCount,
		});
		return (await clientFor(ctx)).call(
			'GET',
			`files/${storagePath(value.path)}`,
			{ query: params },
		);
	},
};

export const Data = {
	retrieve: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.dataRetrieve.parse(input);
		const path = `data/${encodeURIComponent(value.tableName)}${value.objectId ? `/${encodeURIComponent(value.objectId)}` : ''}`;
		const params = query({
			where: value.where,
			sortBy: value.sortBy,
			pageSize: value.pageSize,
			offset: value.offset,
			properties: value.properties?.join(','),
			excludeProperties: value.excludeProperties?.join(','),
			loadRelations: value.loadRelations?.join(','),
		});
		return (await clientFor(ctx, true)).call('GET', path, {
			query: params,
			userScoped: true,
		});
	},
};

export const Hive = {
	create: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveCreate.parse(input);
		return (await clientFor(ctx)).call(
			'POST',
			`hive/${encodeURIComponent(value.hiveName)}`,
		);
	},
	values: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveValues.parse(input);
		return (await clientFor(ctx)).call(
			'GET',
			`hive/${encodeURIComponent(value.hiveName)}/map/${encodeURIComponent(value.key)}`,
		);
	},
	keyItems: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveKeyItems.parse(input);
		const base = `hive/${encodeURIComponent(value.hiveName)}/list/${encodeURIComponent(value.key)}`;
		if (value.index !== undefined)
			return (await clientFor(ctx)).call('GET', `${base}/${value.index}`);
		return (await clientFor(ctx)).call('GET', base, {
			query: query({ from: value.from, to: value.to }),
		});
	},
	mapPut: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.hiveMapPut.parse(input);
		return (await clientFor(ctx)).call(
			'PUT',
			`hive/${encodeURIComponent(value.hiveName)}/map/${encodeURIComponent(value.mapKey)}/set/${encodeURIComponent(value.keyName)}`,
			{ body: { value: value.value } },
		);
	},
};

export const Counters = {
	get: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterGet.parse(input);
		return (await clientFor(ctx, true)).call(
			'GET',
			`counters/${encodeURIComponent(value.counterName)}`,
			{ userScoped: true },
		);
	},
	set: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterSet.parse(input);
		return (await clientFor(ctx, true)).call(
			'PUT',
			`counters/${encodeURIComponent(value.counterName)}/get/compareandset`,
			{
				query: query({ expected: value.expected, updatedvalue: value.updated }),
				userScoped: true,
			},
		);
	},
	reset: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.counterReset.parse(input);
		return (await clientFor(ctx, true)).call(
			'PUT',
			`counters/${encodeURIComponent(value.counterName)}/reset`,
			{ userScoped: true },
		);
	},
};

export const Users = {
	register: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userRegistration.parse(input);
		return (await clientFor(ctx)).call('POST', 'users/register', {
			body: {
				identity: value.identity,
				password: value.password,
				...(value.properties ?? {}),
			},
		});
	},
	login: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userLogin.parse(input);
		const result = await (await clientFor(ctx)).call<Record<string, unknown>>(
			'POST',
			'users/login',
			{
				body: {
					login: value.login,
					password: value.password,
					stayLoggedIn: value.stayLoggedIn,
				},
			},
		);
		const userToken =
			typeof result['user-token'] === 'string'
				? result['user-token']
				: typeof result.userToken === 'string'
					? result.userToken
					: undefined;
		const user = result['user'] ?? result;
		return { user, userToken };
	},
	logout: async (ctx: BackendlessContext, input: unknown) => {
		BackendlessEndpointInputSchemas.userLogout.parse(input);
		return (await clientFor(ctx, true)).call('GET', 'users/logout', {
			userScoped: true,
		});
	},
	passwordRecovery: async (ctx: BackendlessContext, input: unknown) => {
		const value =
			BackendlessEndpointInputSchemas.userPasswordRecovery.parse(input);
		return (await clientFor(ctx)).call(
			'GET',
			`users/restorepassword/${encodeURIComponent(value.identity)}`,
		);
	},
	update: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userUpdate.parse(input);
		return (await clientFor(ctx, true)).call(
			'PUT',
			`users/${encodeURIComponent(value.userId)}`,
			{ body: value.properties, userScoped: true },
		);
	},
	delete: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userDelete.parse(input);
		return (await clientFor(ctx, true)).call(
			'DELETE',
			`data/Users/${encodeURIComponent(value.userId)}`,
			{ userScoped: true },
		);
	},
	find: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.userFind.parse(input);
		return (await clientFor(ctx, true)).call(
			'GET',
			`data/Users/${encodeURIComponent(value.userId)}`,
			{ userScoped: true },
		);
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
		return (await clientFor(ctx)).call(
			'GET',
			`users/isvalidusertoken/${encodeURIComponent(token)}`,
		);
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
	const path = `data/${encodeURIComponent(value.tableName)}/permissions/${action}${value.objectId ? `/${encodeURIComponent(value.objectId)}` : ''}`;
	return (await clientFor(ctx, true)).call('PUT', path, {
		body: {
			permission: value.permission,
			...(value.userId ? { user: value.userId } : { role: value.role }),
		},
		userScoped: true,
	});
}

export const Messaging = {
	publish: async (ctx: BackendlessContext, input: unknown) => {
		const value = BackendlessEndpointInputSchemas.messagePublish.parse(input);
		return (await clientFor(ctx, true)).call(
			'POST',
			`messaging/${encodeURIComponent(value.channel)}`,
			{
				body: {
					message: value.message,
					headers: value.headers,
					subtopic: value.subtopic,
					publishAt: value.publishAt,
				},
				userScoped: true,
			},
		);
	},
};
