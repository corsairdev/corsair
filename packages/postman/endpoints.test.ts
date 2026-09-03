import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import {
	PostmanEndpointInputSchemas,
	PostmanEndpointOutputSchemas,
} from './endpoints/types';
import type { PostmanContext } from './index';
import { postman } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

// logEventFromContext is mocked so endpoint tests assert routing without
// touching the event store (same approach as packages/ticktick/api.test.ts).
jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(
			public plugin: string,
			public type: string,
		) {
			super(`Missing auth: ${plugin} ${type}`);
		}
	},
}));

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'postman-test-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('postman-test-key'),
	},
	logEvent: jest.fn(),
	database: {
		insertInto: jest.fn().mockReturnValue({
			values: jest.fn().mockReturnValue({
				execute: jest.fn().mockResolvedValue(undefined),
			}),
		}),
	},
} as unknown as PostmanContext;

describe('Postman Plugin Structure', () => {
	it('registers all endpoints with schemas and metadata', () => {
		const plugin = postman({ key: 'postman-test-key' });
		expect(plugin.id).toBe('postman');
		expect(plugin.schema).toBeDefined();
		expect(plugin.endpoints).toBeDefined();
		expect(Object.keys(PostmanEndpointInputSchemas)).toHaveLength(125);
		expect(Object.keys(PostmanEndpointOutputSchemas)).toHaveLength(125);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(125);
		expect(typeof plugin.endpoints!.apis.createSchema).toBe('function');
		expect(typeof plugin.endpoints!.apis.createCollectionFromSchema).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.apis.getComments).toBe('function');
		expect(typeof plugin.endpoints!.apis.get).toBe('function');
		expect(typeof plugin.endpoints!.apis.getSchema).toBe('function');
		expect(typeof plugin.endpoints!.apis.getVersion).toBe('function');
		expect(typeof plugin.endpoints!.apis.listVersions).toBe('function');
		expect(typeof plugin.endpoints!.apis.list).toBe('function');
		expect(typeof plugin.endpoints!.apis.getSchemaFileContents).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.apis.getSchemaFiles).toBe('function');
		expect(typeof plugin.endpoints!.apis.create).toBe('function');
		expect(typeof plugin.endpoints!.apis.createOrUpdateSchemaFile).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.apis.deleteSchemaFile).toBe('function');
		expect(typeof plugin.endpoints!.apis.remove).toBe('function');
		expect(typeof plugin.endpoints!.apis.deleteComment).toBe('function');
		expect(typeof plugin.endpoints!.apis.update).toBe('function');
		expect(typeof plugin.endpoints!.apis.updateComment).toBe('function');
		expect(typeof plugin.endpoints!.specs.get).toBe('function');
		expect(typeof plugin.endpoints!.specs.list).toBe('function');
		expect(typeof plugin.endpoints!.specs.getDefinition).toBe('function');
		expect(typeof plugin.endpoints!.specs.getFile).toBe('function');
		expect(typeof plugin.endpoints!.specs.getGeneratedCollections).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.specs.getFiles).toBe('function');
		expect(typeof plugin.endpoints!.specs.create).toBe('function');
		expect(typeof plugin.endpoints!.specs.deleteFile).toBe('function');
		expect(typeof plugin.endpoints!.specs.remove).toBe('function');
		expect(typeof plugin.endpoints!.specs.generateCollection).toBe('function');
		expect(typeof plugin.endpoints!.specs.createFile).toBe('function');
		expect(typeof plugin.endpoints!.specs.syncWithCollection).toBe('function');
		expect(typeof plugin.endpoints!.specs.updateFile).toBe('function');
		expect(typeof plugin.endpoints!.specs.update).toBe('function');
		expect(typeof plugin.endpoints!.collections.list).toBe('function');
		expect(typeof plugin.endpoints!.collections.listForked).toBe('function');
		expect(typeof plugin.endpoints!.collections.getUpdateStatus).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getComments).toBe('function');
		expect(typeof plugin.endpoints!.collections.getPullRequests).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getRoles).toBe('function');
		expect(typeof plugin.endpoints!.collections.getForks).toBe('function');
		expect(typeof plugin.endpoints!.collections.getDuplicationStatus).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getFolderComments).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getFolder).toBe('function');
		expect(typeof plugin.endpoints!.collections.getGeneratedSpecs).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getRequestComments).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getRequest).toBe('function');
		expect(typeof plugin.endpoints!.collections.getResponseComments).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.getResponse).toBe('function');
		expect(typeof plugin.endpoints!.collections.getSourceStatus).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.create).toBe('function');
		expect(typeof plugin.endpoints!.collections.createComment).toBe('function');
		expect(typeof plugin.endpoints!.collections.createFolder).toBe('function');
		expect(typeof plugin.endpoints!.collections.createFolderComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.createPullRequest).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.createRequestComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.createResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.createResponseComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.remove).toBe('function');
		expect(typeof plugin.endpoints!.collections.deleteFolder).toBe('function');
		expect(typeof plugin.endpoints!.collections.deleteFolderComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.deleteRequestComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.deleteResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.deleteResponseComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.deleteComment).toBe('function');
		expect(typeof plugin.endpoints!.collections.duplicate).toBe('function');
		expect(typeof plugin.endpoints!.collections.fork).toBe('function');
		expect(typeof plugin.endpoints!.collections.generateSpec).toBe('function');
		expect(typeof plugin.endpoints!.collections.createRequest).toBe('function');
		expect(typeof plugin.endpoints!.collections.mergeFork).toBe('function');
		expect(typeof plugin.endpoints!.collections.pullChanges).toBe('function');
		expect(typeof plugin.endpoints!.collections.replace).toBe('function');
		expect(typeof plugin.endpoints!.collections.syncWithSchema).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.syncWithSpec).toBe('function');
		expect(typeof plugin.endpoints!.collections.transferFolders).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.transformToOpenapi).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.update).toBe('function');
		expect(typeof plugin.endpoints!.collections.updateRequest).toBe('function');
		expect(typeof plugin.endpoints!.collections.updateFolder).toBe('function');
		expect(typeof plugin.endpoints!.collections.updateFolderComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.updateRequestComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.updateResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.collections.updateResponseComment).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.groups.list).toBe('function');
		expect(typeof plugin.endpoints!.mocks.list).toBe('function');
		expect(typeof plugin.endpoints!.mocks.create).toBe('function');
		expect(typeof plugin.endpoints!.mocks.deleteServerResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.mocks.createServerResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.mocks.publish).toBe('function');
		expect(typeof plugin.endpoints!.mocks.update).toBe('function');
		expect(typeof plugin.endpoints!.mocks.updateServerResponse).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.monitors.list).toBe('function');
		expect(typeof plugin.endpoints!.monitors.get).toBe('function');
		expect(typeof plugin.endpoints!.monitors.create).toBe('function');
		expect(typeof plugin.endpoints!.monitors.remove).toBe('function');
		expect(typeof plugin.endpoints!.monitors.run).toBe('function');
		expect(typeof plugin.endpoints!.monitors.update).toBe('function');
		expect(typeof plugin.endpoints!.users.list).toBe('function');
		expect(typeof plugin.endpoints!.users.get).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.list).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.getActivity).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.get).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.getGlobalVariables).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.workspaces.getRoles).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.create).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.remove).toBe('function');
		expect(typeof plugin.endpoints!.workspaces.updateGlobalVariables).toBe(
			'function',
		);
		expect(typeof plugin.endpoints!.workspaces.update).toBe('function');
		expect(typeof plugin.endpoints!.account.me).toBe('function');
		expect(typeof plugin.endpoints!.billing.getAccount).toBe('function');
		expect(typeof plugin.endpoints!.billing.listInvoices).toBe('function');
		expect(typeof plugin.endpoints!.accessKeys.list).toBe('function');
		expect(typeof plugin.endpoints!.environments.getForks).toBe('function');
		expect(typeof plugin.endpoints!.environments.get).toBe('function');
		expect(typeof plugin.endpoints!.environments.create).toBe('function');
		expect(typeof plugin.endpoints!.environments.remove).toBe('function');
		expect(typeof plugin.endpoints!.environments.fork).toBe('function');
		expect(typeof plugin.endpoints!.environments.mergeFork).toBe('function');
		expect(typeof plugin.endpoints!.environments.replace).toBe('function');
		expect(typeof plugin.endpoints!.environments.update).toBe('function');
		expect(typeof plugin.endpoints!.environments.list).toBe('function');
		expect(typeof plugin.endpoints!.scim.getResourceTypes).toBe('function');
		expect(typeof plugin.endpoints!.scim.getServiceConfig).toBe('function');
		expect(typeof plugin.endpoints!.webhooks.create).toBe('function');
		expect(typeof plugin.endpoints!.tools.importOpenapi).toBe('function');
		expect(typeof plugin.endpoints!.comments.resolve).toBe('function');
		expect(typeof plugin.endpoints!.pullRequests.review).toBe('function');
		expect(typeof plugin.endpoints!.pullRequests.update).toBe('function');
	});
});

describe('Postman apis', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('apis.createSchema Create a schema (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.createSchema(mockCtx, {
			apiId: 'test-apiId',
			type: 'proto:2',
			files: [{}],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/apis/{apiId}/schemas');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ type: 'proto:2', files: [{}] });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisCreateSchema.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisCreateSchema.safeParse({
				apiId: 'test-apiId',
				type: 'proto:2',
				files: [{}],
			}).success,
		).toBe(true);
	});

	it('apis.createCollectionFromSchema Add a collection (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.createCollectionFromSchema(
			mockCtx,
			{ apiId: 'test-apiId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/apis/{apiId}/collections');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisCreateCollectionFromSchema.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisCreateCollectionFromSchema.safeParse({
				apiId: 'test-apiId',
			}).success,
		).toBe(true);
	});

	it("apis.getComments Get an API's comments (Deprecated by Postman", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.getComments(mockCtx, {
			apiId: 'test-apiId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}/comments');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisGetComments.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisGetComments.safeParse({
				apiId: 'test-apiId',
			}).success,
		).toBe(true);
	});

	it('apis.get Get an API (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.get(mockCtx, {
			apiId: 'test-apiId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(PostmanEndpointOutputSchemas.apisGet.safeParse(result).success).toBe(
			true,
		);
		expect(
			PostmanEndpointInputSchemas.apisGet.safeParse({ apiId: 'test-apiId' })
				.success,
		).toBe(true);
	});

	it('apis.getSchema Get a schema (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.getSchema(mockCtx, {
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}/schemas/{schemaId}');
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisGetSchema.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisGetSchema.safeParse({
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
			}).success,
		).toBe(true);
	});

	it('apis.getVersion Get a version (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.getVersion(mockCtx, {
			apiId: 'test-apiId',
			versionId: 'test-versionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}/versions/{versionId}');
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			versionId: 'test-versionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisGetVersion.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisGetVersion.safeParse({
				apiId: 'test-apiId',
				versionId: 'test-versionId',
			}).success,
		).toBe(true);
	});

	it('apis.listVersions Get all versions (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.listVersions(mockCtx, {
			apiId: 'test-apiId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}/versions');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisListVersions.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisListVersions.safeParse({
				apiId: 'test-apiId',
			}).success,
		).toBe(true);
	});

	it('apis.list Get all APIs (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.list(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisList.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('apis.getSchemaFileContents Get schema file contents (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.getSchemaFileContents(mockCtx, {
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
			filePath: 'test-filePath',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/apis/{apiId}/schemas/{schemaId}/files/{file-path}',
		);
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
			'file-path': 'test-filePath',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisGetSchemaFileContents.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisGetSchemaFileContents.safeParse({
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it('apis.getSchemaFiles Get schema files (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.getSchemaFiles(mockCtx, {
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/apis/{apiId}/schemas/{schemaId}/files');
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisGetSchemaFiles.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisGetSchemaFiles.safeParse({
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
			}).success,
		).toBe(true);
	});

	it('apis.create Create an API (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.create(mockCtx, {
			workspaceId: 'test-workspaceId',
			name: 'test-name',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/apis');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.body).toMatchObject({ name: 'test-name' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisCreate.safeParse({
				workspaceId: 'test-workspaceId',
				name: 'test-name',
			}).success,
		).toBe(true);
	});

	it('apis.createOrUpdateSchemaFile Create or update a schema file (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.createOrUpdateSchemaFile(
			mockCtx,
			{
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
				filePath: 'test-filePath',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/apis/{apiId}/schemas/{schemaId}/files/{file-path}',
		);
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
			'file-path': 'test-filePath',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisCreateOrUpdateSchemaFile.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisCreateOrUpdateSchemaFile.safeParse({
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it('apis.deleteSchemaFile Delete a schema file (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.deleteSchemaFile(mockCtx, {
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
			filePath: 'test-filePath',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/apis/{apiId}/schemas/{schemaId}/files/{file-path}',
		);
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			schemaId: 'test-schemaId',
			'file-path': 'test-filePath',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisDeleteSchemaFile.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisDeleteSchemaFile.safeParse({
				apiId: 'test-apiId',
				schemaId: 'test-schemaId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it('apis.remove Delete an API (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.remove(mockCtx, {
			apiId: 'test-apiId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/apis/{apiId}');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisRemove.safeParse({ apiId: 'test-apiId' })
				.success,
		).toBe(true);
	});

	it("apis.deleteComment Delete an API's comment (Deprecated by Postman", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.deleteComment(mockCtx, {
			apiId: 'test-apiId',
			commentId: 1,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/apis/{apiId}/comments/{commentId}');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId', commentId: 1 });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisDeleteComment.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisDeleteComment.safeParse({
				apiId: 'test-apiId',
				commentId: 1,
			}).success,
		).toBe(true);
	});

	it('apis.update Update an API (Deprecated by Postman', async () => {
		const canned = { name: 'test-name' };
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.update(mockCtx, {
			apiId: 'test-apiId',
			name: 'test-name',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/apis/{apiId}');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ name: 'test-name' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisUpdate.safeParse({
				apiId: 'test-apiId',
				name: 'test-name',
			}).success,
		).toBe(true);
	});

	it("apis.updateComment Update an API's comment (Deprecated by Postman", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.apis.updateComment(mockCtx, {
			apiId: 'test-apiId',
			commentId: 1,
			body: 'test-body',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/apis/{apiId}/comments/{commentId}');
		expect(captured?.path).toMatchObject({ apiId: 'test-apiId', commentId: 1 });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.apisUpdateComment.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.apisUpdateComment.safeParse({
				apiId: 'test-apiId',
				commentId: 1,
				body: 'test-body',
			}).success,
		).toBe(true);
	});
});
describe('Postman specs', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('specs.get Get a spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.get(mockCtx, {
			specId: 'test-specId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs/{specId}');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGet.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGet.safeParse({ specId: 'test-specId' })
				.success,
		).toBe(true);
	});

	it('specs.list Get all specs', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.list(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsList.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it("specs.getDefinition Get a spec's definition", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.getDefinition(mockCtx, {
			specId: 'test-specId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs/{specId}/definitions');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGetDefinition.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGetDefinition.safeParse({
				specId: 'test-specId',
			}).success,
		).toBe(true);
	});

	it('specs.getFile Get a spec file', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.getFile(mockCtx, {
			specId: 'test-specId',
			filePath: 'test-filePath',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs/{specId}/files/{filePath}');
		expect(captured?.path).toMatchObject({
			specId: 'test-specId',
			filePath: 'test-filePath',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGetFile.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGetFile.safeParse({
				specId: 'test-specId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it("specs.getGeneratedCollections Get a spec's generated collections", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.getGeneratedCollections(
			mockCtx,
			{ specId: 'test-specId', elementType: 'collection' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs/{specId}/generations/{elementType}');
		expect(captured?.path).toMatchObject({
			specId: 'test-specId',
			elementType: 'collection',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGetGeneratedCollections.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGetGeneratedCollections.safeParse({
				specId: 'test-specId',
				elementType: 'collection',
			}).success,
		).toBe(true);
	});

	it("specs.getFiles Get a spec's files", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.getFiles(mockCtx, {
			specId: 'test-specId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/specs/{specId}/files');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGetFiles.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGetFiles.safeParse({
				specId: 'test-specId',
			}).success,
		).toBe(true);
	});

	it('specs.create Create a spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.create(mockCtx, {
			workspaceId: 'test-workspaceId',
			name: 'test-name',
			type: 'OPENAPI:2.0',
			files: [{ path: 'test-path', content: 'test-content', type: 'DEFAULT' }],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/specs');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.body).toMatchObject({
			name: 'test-name',
			type: 'OPENAPI:2.0',
			files: [{ path: 'test-path', content: 'test-content', type: 'DEFAULT' }],
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsCreate.safeParse({
				workspaceId: 'test-workspaceId',
				name: 'test-name',
				type: 'OPENAPI:2.0',
				files: [
					{ path: 'test-path', content: 'test-content', type: 'DEFAULT' },
				],
			}).success,
		).toBe(true);
	});

	it('specs.deleteFile Delete a spec file', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.deleteFile(mockCtx, {
			specId: 'test-specId',
			filePath: 'test-filePath',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/specs/{specId}/files/{filePath}');
		expect(captured?.path).toMatchObject({
			specId: 'test-specId',
			filePath: 'test-filePath',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsDeleteFile.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsDeleteFile.safeParse({
				specId: 'test-specId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it('specs.remove Delete a spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.remove(mockCtx, {
			specId: 'test-specId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/specs/{specId}');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsRemove.safeParse({
				specId: 'test-specId',
			}).success,
		).toBe(true);
	});

	it('specs.generateCollection Generate a collection from spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.generateCollection(mockCtx, {
			specId: 'test-specId',
			elementType: 'collection',
			name: 'test-name',
			options: {},
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/specs/{specId}/generations/{elementType}');
		expect(captured?.path).toMatchObject({
			specId: 'test-specId',
			elementType: 'collection',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ name: 'test-name', options: {} });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsGenerateCollection.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsGenerateCollection.safeParse({
				specId: 'test-specId',
				elementType: 'collection',
				name: 'test-name',
				options: {},
			}).success,
		).toBe(true);
	});

	it('specs.createFile Create a spec file', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.createFile(mockCtx, {
			specId: 'test-specId',
			path: 'test-path',
			content: 'test-content',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/specs/{specId}/files');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({
			path: 'test-path',
			content: 'test-content',
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsCreateFile.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsCreateFile.safeParse({
				specId: 'test-specId',
				path: 'test-path',
				content: 'test-content',
			}).success,
		).toBe(true);
	});

	it('specs.syncWithCollection Sync spec with collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.syncWithCollection(mockCtx, {
			specId: 'test-specId',
			collectionUid: 'test-collectionUid',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/specs/{specId}/synchronizations');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toMatchObject({
			collectionUid: 'test-collectionUid',
		});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsSyncWithCollection.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsSyncWithCollection.safeParse({
				specId: 'test-specId',
				collectionUid: 'test-collectionUid',
			}).success,
		).toBe(true);
	});

	it('specs.updateFile Update a spec file', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.updateFile(mockCtx, {
			specId: 'test-specId',
			filePath: 'test-filePath',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PATCH');
		expect(captured?.url).toBe('/specs/{specId}/files/{filePath}');
		expect(captured?.path).toMatchObject({
			specId: 'test-specId',
			filePath: 'test-filePath',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsUpdateFile.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsUpdateFile.safeParse({
				specId: 'test-specId',
				filePath: 'test-filePath',
			}).success,
		).toBe(true);
	});

	it("specs.update Update a spec's properties", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.specs.update(mockCtx, {
			specId: 'test-specId',
			name: 'test-name',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PATCH');
		expect(captured?.url).toBe('/specs/{specId}');
		expect(captured?.path).toMatchObject({ specId: 'test-specId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ name: 'test-name' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.specsUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.specsUpdate.safeParse({
				specId: 'test-specId',
				name: 'test-name',
			}).success,
		).toBe(true);
	});
});
describe('Postman collections', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('collections.list Get all collections', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsList.safeParse({}).success,
		).toBe(true);
	});

	it('collections.listForked Get all forked collections', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.listForked(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/collection-forks');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsListForked.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsListForked.safeParse({}).success,
		).toBe(true);
	});

	it('collections.getUpdateStatus Get async collection update status', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getUpdateStatus(
			mockCtx,
			{ taskId: 'test-taskId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collection-updates-tasks/{taskId}');
		expect(captured?.path).toMatchObject({ taskId: 'test-taskId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetUpdateStatus.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetUpdateStatus.safeParse({
				taskId: 'test-taskId',
			}).success,
		).toBe(true);
	});

	it("collections.getComments Get a collection's comments", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getComments(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/comments');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetComments.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetComments.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.getPullRequests Get a collection's pull requests", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getPullRequests(
			mockCtx,
			{ collectionId: 'test-collectionId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/pull-requests');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetPullRequests.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetPullRequests.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.getRoles Get a collection's roles", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getRoles(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/roles');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetRoles.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetRoles.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.getForks Get a collection's forks", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getForks(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/forks');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetForks.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetForks.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.getDuplicationStatus Get duplication task status', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getDuplicationStatus(
			mockCtx,
			{ taskId: 'test-taskId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collection-duplicate-tasks/{taskId}');
		expect(captured?.path).toMatchObject({ taskId: 'test-taskId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetDuplicationStatus.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetDuplicationStatus.safeParse({
				taskId: 'test-taskId',
			}).success,
		).toBe(true);
	});

	it("collections.getFolderComments Get a folder's comments", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getFolderComments(
			mockCtx,
			{ collectionId: 'test-collectionId', folderId: 'test-folderId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			folderId: 'test-folderId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetFolderComments.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetFolderComments.safeParse({
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
			}).success,
		).toBe(true);
	});

	it('collections.getFolder Get a folder', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getFolder(mockCtx, {
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}',
		);
		expect(captured?.path).toMatchObject({
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetFolder.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetFolder.safeParse({
				folderId: 'test-folderId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.getGeneratedSpecs Get generated spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getGeneratedSpecs(
			mockCtx,
			{ collectionUid: 'test-collectionUid', elementType: 'spec' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionUid}/generations/{elementType}',
		);
		expect(captured?.path).toMatchObject({
			collectionUid: 'test-collectionUid',
			elementType: 'spec',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetGeneratedSpecs.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetGeneratedSpecs.safeParse({
				collectionUid: 'test-collectionUid',
				elementType: 'spec',
			}).success,
		).toBe(true);
	});

	it("collections.getRequestComments Get a request's comments", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getRequestComments(
			mockCtx,
			{ collectionId: 'test-collectionId', requestId: 'test-requestId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			requestId: 'test-requestId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetRequestComments.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetRequestComments.safeParse({
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
			}).success,
		).toBe(true);
	});

	it('collections.getRequest Get a request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getRequest(mockCtx, {
			requestId: 'test-requestId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}',
		);
		expect(captured?.path).toMatchObject({
			requestId: 'test-requestId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetRequest.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetRequest.safeParse({
				requestId: 'test-requestId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.getResponseComments Get a response's comments", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getResponseComments(
			mockCtx,
			{ collectionId: 'test-collectionId', responseId: 'test-responseId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			responseId: 'test-responseId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetResponseComments.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetResponseComments.safeParse({
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
			}).success,
		).toBe(true);
	});

	it('collections.getResponse Get a response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getResponse(mockCtx, {
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}',
		);
		expect(captured?.path).toMatchObject({
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetResponse.safeParse({
				responseId: 'test-responseId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.getSourceStatus Get source collection's status", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.getSourceStatus(
			mockCtx,
			{ collectionId: 'test-collectionId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/source-status');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGetSourceStatus.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGetSourceStatus.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.create Create a collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.create(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreate.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});

	it('collections.createComment Create a collection comment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createComment(mockCtx, {
			collectionId: 'test-collectionId',
			body: 'test-body',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/comments');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateComment.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateComment.safeParse({
				collectionId: 'test-collectionId',
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it('collections.createFolder Create a folder', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createFolder(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/folders');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateFolder.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateFolder.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.createFolderComment Create a folder comment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createFolderComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			folderId: 'test-folderId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateFolderComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateFolderComment.safeParse({
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it('collections.createPullRequest Create a pull request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createPullRequest(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				title: 'test-title',
				reviewers: ['test-reviewersItem'],
				destinationId: 'test-destinationId',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/pull-requests');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({
			title: 'test-title',
			reviewers: ['test-reviewersItem'],
			destinationId: 'test-destinationId',
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreatePullRequest.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreatePullRequest.safeParse({
				collectionId: 'test-collectionId',
				title: 'test-title',
				reviewers: ['test-reviewersItem'],
				destinationId: 'test-destinationId',
			}).success,
		).toBe(true);
	});

	it('collections.createRequestComment Create a request comment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createRequestComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			requestId: 'test-requestId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateRequestComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateRequestComment.safeParse({
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it('collections.createResponse Create a response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createResponse(mockCtx, {
			collectionId: 'test-collectionId',
			request: 'test-request',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/responses');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toMatchObject({ request: 'test-request' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateResponse.safeParse({
				collectionId: 'test-collectionId',
				request: 'test-request',
			}).success,
		).toBe(true);
	});

	it('collections.createResponseComment Create a response comment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createResponseComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}/comments',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			responseId: 'test-responseId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateResponseComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateResponseComment.safeParse({
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it('collections.remove Delete a collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.remove(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/collections/{collectionId}');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsRemove.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.deleteFolder Delete a folder', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteFolder(mockCtx, {
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}',
		);
		expect(captured?.path).toMatchObject({
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteFolder.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteFolder.safeParse({
				folderId: 'test-folderId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.deleteFolderComment Delete a folder's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteFolderComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				commentId: 1,
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			folderId: 'test-folderId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteFolderComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteFolderComment.safeParse({
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				commentId: 1,
			}).success,
		).toBe(true);
	});

	it("collections.deleteRequestComment Delete a request's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteRequestComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				commentId: 1,
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			requestId: 'test-requestId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteRequestComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteRequestComment.safeParse({
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				commentId: 1,
			}).success,
		).toBe(true);
	});

	it('collections.deleteResponse Delete a response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteResponse(mockCtx, {
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}',
		);
		expect(captured?.path).toMatchObject({
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteResponse.safeParse({
				responseId: 'test-responseId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.deleteResponseComment Delete a response's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteResponseComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				commentId: 1,
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			responseId: 'test-responseId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteResponseComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteResponseComment.safeParse({
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				commentId: 1,
			}).success,
		).toBe(true);
	});

	it("collections.deleteComment Delete a collection's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.deleteComment(mockCtx, {
			collectionId: 'test-collectionId',
			commentId: 1,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDeleteComment.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDeleteComment.safeParse({
				collectionId: 'test-collectionId',
				commentId: 1,
			}).success,
		).toBe(true);
	});

	it('collections.duplicate Duplicate a collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.duplicate(mockCtx, {
			collectionId: 'test-collectionId',
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/duplicates');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ workspace: 'test-workspace' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsDuplicate.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsDuplicate.safeParse({
				collectionId: 'test-collectionId',
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});

	it('collections.fork Create a fork', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.fork(mockCtx, {
			collectionId: 'test-collectionId',
			workspace: 'test-workspace',
			label: 'test-label',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/fork/{collectionId}');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toMatchObject({ label: 'test-label' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsFork.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsFork.safeParse({
				collectionId: 'test-collectionId',
				workspace: 'test-workspace',
				label: 'test-label',
			}).success,
		).toBe(true);
	});

	it('collections.generateSpec Generate spec from collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.generateSpec(mockCtx, {
			collectionUid: 'test-collectionUid',
			elementType: 'spec',
			name: 'test-name',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'/collections/{collectionUid}/generations/{elementType}',
		);
		expect(captured?.path).toMatchObject({
			collectionUid: 'test-collectionUid',
			elementType: 'spec',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ name: 'test-name' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsGenerateSpec.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsGenerateSpec.safeParse({
				collectionUid: 'test-collectionUid',
				elementType: 'spec',
				name: 'test-name',
			}).success,
		).toBe(true);
	});

	it('collections.createRequest Create a request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.createRequest(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/{collectionId}/requests');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsCreateRequest.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsCreateRequest.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.mergeFork Merge a fork (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.mergeFork(mockCtx, {
			destination: 'test-destination',
			source: 'test-source',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collections/merge');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({
			destination: 'test-destination',
			source: 'test-source',
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsMergeFork.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsMergeFork.safeParse({
				destination: 'test-destination',
				source: 'test-source',
			}).success,
		).toBe(true);
	});

	it('collections.pullChanges Pull source changes', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.pullChanges(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/collections/{collectionId}/pulls');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsPullChanges.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsPullChanges.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.replace Replace a collection's data", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.replace(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/collections/{collectionId}');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsReplace.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsReplace.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.syncWithSchema Sync collection with schema (Deprecated by Postman', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.syncWithSchema(mockCtx, {
			apiId: 'test-apiId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/apis/{apiId}/collections/{collectionId}/sync-with-schema-tasks',
		);
		expect(captured?.path).toMatchObject({
			apiId: 'test-apiId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsSyncWithSchema.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsSyncWithSchema.safeParse({
				apiId: 'test-apiId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.syncWithSpec Sync collection with spec', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.syncWithSpec(mockCtx, {
			collectionUid: 'test-collectionUid',
			specId: 'test-specId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/collections/{collectionUid}/synchronizations');
		expect(captured?.path).toMatchObject({
			collectionUid: 'test-collectionUid',
		});
		expect(captured?.query).toMatchObject({ specId: 'test-specId' });
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsSyncWithSpec.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsSyncWithSpec.safeParse({
				collectionUid: 'test-collectionUid',
				specId: 'test-specId',
			}).success,
		).toBe(true);
	});

	it('collections.transferFolders Transfer folders', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.transferFolders(
			mockCtx,
			{
				ids: ['test-idsItem'],
				mode: 'copy',
				target: { id: 'test-id', model: 'collection' },
				location: { position: 'start' },
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/collection-folders-transfers');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({
			ids: ['test-idsItem'],
			mode: 'copy',
			target: { id: 'test-id', model: 'collection' },
			location: { position: 'start' },
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsTransferFolders.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsTransferFolders.safeParse({
				ids: ['test-idsItem'],
				mode: 'copy',
				target: { id: 'test-id', model: 'collection' },
				location: { position: 'start' },
			}).success,
		).toBe(true);
	});

	it('collections.transformToOpenapi Transform collection to OpenAPI', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.transformToOpenapi(
			mockCtx,
			{ collectionId: 'test-collectionId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collections/{collectionId}/transformations');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsTransformToOpenapi.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsTransformToOpenapi.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.update Update part of a collection', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.update(mockCtx, {
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PATCH');
		expect(captured?.url).toBe('/collections/{collectionId}');
		expect(captured?.path).toMatchObject({ collectionId: 'test-collectionId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdate.safeParse({
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.updateRequest Update a request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateRequest(mockCtx, {
			requestId: 'test-requestId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}',
		);
		expect(captured?.path).toMatchObject({
			requestId: 'test-requestId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateRequest.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateRequest.safeParse({
				requestId: 'test-requestId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it('collections.updateFolder Update a folder', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateFolder(mockCtx, {
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}',
		);
		expect(captured?.path).toMatchObject({
			folderId: 'test-folderId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateFolder.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateFolder.safeParse({
				folderId: 'test-folderId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.updateFolderComment Update a folder's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateFolderComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				commentId: 1,
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/folders/{folderId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			folderId: 'test-folderId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateFolderComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateFolderComment.safeParse({
				collectionId: 'test-collectionId',
				folderId: 'test-folderId',
				commentId: 1,
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it("collections.updateRequestComment Update a request's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateRequestComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				commentId: 1,
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/requests/{requestId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			requestId: 'test-requestId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateRequestComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateRequestComment.safeParse({
				collectionId: 'test-collectionId',
				requestId: 'test-requestId',
				commentId: 1,
				body: 'test-body',
			}).success,
		).toBe(true);
	});

	it('collections.updateResponse Update a response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateResponse(mockCtx, {
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}',
		);
		expect(captured?.path).toMatchObject({
			responseId: 'test-responseId',
			collectionId: 'test-collectionId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateResponse.safeParse({
				responseId: 'test-responseId',
				collectionId: 'test-collectionId',
			}).success,
		).toBe(true);
	});

	it("collections.updateResponseComment Update a response's comment", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.collections.updateResponseComment(
			mockCtx,
			{
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				commentId: 1,
				body: 'test-body',
			},
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/collections/{collectionId}/responses/{responseId}/comments/{commentId}',
		);
		expect(captured?.path).toMatchObject({
			collectionId: 'test-collectionId',
			responseId: 'test-responseId',
			commentId: 1,
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ body: 'test-body' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.collectionsUpdateResponseComment.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.collectionsUpdateResponseComment.safeParse({
				collectionId: 'test-collectionId',
				responseId: 'test-responseId',
				commentId: 1,
				body: 'test-body',
			}).success,
		).toBe(true);
	});
});
describe('Postman groups', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('groups.list Get all groups', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.groups.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/groups');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.groupsList.safeParse(result).success,
		).toBe(true);
		expect(PostmanEndpointInputSchemas.groupsList.safeParse({}).success).toBe(
			true,
		);
	});
});
describe('Postman mocks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('mocks.list Get all mock servers', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/mocks');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksList.safeParse(result).success,
		).toBe(true);
		expect(PostmanEndpointInputSchemas.mocksList.safeParse({}).success).toBe(
			true,
		);
	});

	it('mocks.create Create a mock server', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.create(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/mocks');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksCreate.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});

	it('mocks.deleteServerResponse Delete a server response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.deleteServerResponse(mockCtx, {
			mockId: 'test-mockId',
			serverResponseId: 'test-serverResponseId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe(
			'/mocks/{mockId}/server-responses/{serverResponseId}',
		);
		expect(captured?.path).toMatchObject({
			mockId: 'test-mockId',
			serverResponseId: 'test-serverResponseId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksDeleteServerResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksDeleteServerResponse.safeParse({
				mockId: 'test-mockId',
				serverResponseId: 'test-serverResponseId',
			}).success,
		).toBe(true);
	});

	it('mocks.createServerResponse Create a server response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.createServerResponse(mockCtx, {
			mockId: 'test-mockId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/mocks/{mockId}/server-responses');
		expect(captured?.path).toMatchObject({ mockId: 'test-mockId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksCreateServerResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksCreateServerResponse.safeParse({
				mockId: 'test-mockId',
			}).success,
		).toBe(true);
	});

	it('mocks.publish Publish a mock server', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.publish(mockCtx, {
			mockId: 'test-mockId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/mocks/{mockId}/publish');
		expect(captured?.path).toMatchObject({ mockId: 'test-mockId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksPublish.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksPublish.safeParse({
				mockId: 'test-mockId',
			}).success,
		).toBe(true);
	});

	it('mocks.update Update a mock server', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.update(mockCtx, {
			mockId: 'test-mockId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/mocks/{mockId}');
		expect(captured?.path).toMatchObject({ mockId: 'test-mockId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksUpdate.safeParse({
				mockId: 'test-mockId',
			}).success,
		).toBe(true);
	});

	it('mocks.updateServerResponse Update a server response', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.mocks.updateServerResponse(mockCtx, {
			mockId: 'test-mockId',
			serverResponseId: 'test-serverResponseId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe(
			'/mocks/{mockId}/server-responses/{serverResponseId}',
		);
		expect(captured?.path).toMatchObject({
			mockId: 'test-mockId',
			serverResponseId: 'test-serverResponseId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.mocksUpdateServerResponse.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.mocksUpdateServerResponse.safeParse({
				mockId: 'test-mockId',
				serverResponseId: 'test-serverResponseId',
			}).success,
		).toBe(true);
	});
});
describe('Postman monitors', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('monitors.list Get all monitors', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/monitors');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsList.safeParse(result).success,
		).toBe(true);
		expect(PostmanEndpointInputSchemas.monitorsList.safeParse({}).success).toBe(
			true,
		);
	});

	it('monitors.get Get a monitor', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.get(mockCtx, {
			monitorId: 'test-monitorId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/monitors/{monitorId}');
		expect(captured?.path).toMatchObject({ monitorId: 'test-monitorId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsGet.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.monitorsGet.safeParse({
				monitorId: 'test-monitorId',
			}).success,
		).toBe(true);
	});

	it('monitors.create Create a monitor', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.create(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/monitors');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.monitorsCreate.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});

	it('monitors.remove Delete a monitor', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.remove(mockCtx, {
			monitorId: 'test-monitorId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/monitors/{monitorId}');
		expect(captured?.path).toMatchObject({ monitorId: 'test-monitorId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.monitorsRemove.safeParse({
				monitorId: 'test-monitorId',
			}).success,
		).toBe(true);
	});

	it('monitors.run Run a monitor', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.run(mockCtx, {
			monitorId: 'test-monitorId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/monitors/{monitorId}/run');
		expect(captured?.path).toMatchObject({ monitorId: 'test-monitorId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsRun.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.monitorsRun.safeParse({
				monitorId: 'test-monitorId',
			}).success,
		).toBe(true);
	});

	it('monitors.update Update a monitor', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.monitors.update(mockCtx, {
			monitorId: 'test-monitorId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/monitors/{monitorId}');
		expect(captured?.path).toMatchObject({ monitorId: 'test-monitorId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.monitorsUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.monitorsUpdate.safeParse({
				monitorId: 'test-monitorId',
			}).success,
		).toBe(true);
	});
});
describe('Postman users', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('users.list Get all team users', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.users.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/users');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.usersList.safeParse(result).success,
		).toBe(true);
		expect(PostmanEndpointInputSchemas.usersList.safeParse({}).success).toBe(
			true,
		);
	});

	it('users.get Get a team user', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.users.get(mockCtx, { userId: 1 });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/users/{userId}');
		expect(captured?.path).toMatchObject({ userId: 1 });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.usersGet.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.usersGet.safeParse({ userId: 1 }).success,
		).toBe(true);
	});
});
describe('Postman workspaces', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('workspaces.list Get all workspaces', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/workspaces');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesList.safeParse({}).success,
		).toBe(true);
	});

	it("workspaces.getActivity Get a workspace's activity feed", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.getActivity(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/workspaces/{workspaceId}/activities');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesGetActivity.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesGetActivity.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('workspaces.get Get a workspace', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.get(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/workspaces/{workspaceId}');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesGet.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesGet.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('workspaces.getGlobalVariables Get global variables', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.getGlobalVariables(
			mockCtx,
			{ workspaceId: 'test-workspaceId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/workspaces/{workspaceId}/global-variables');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesGetGlobalVariables.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesGetGlobalVariables.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it("workspaces.getRoles Get a workspace's roles", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.getRoles(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/workspaces/{workspaceId}/roles');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesGetRoles.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesGetRoles.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('workspaces.create Create a workspace', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.create(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/workspaces');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesCreate.safeParse({}).success,
		).toBe(true);
	});

	it('workspaces.remove Delete a workspace', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.remove(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/workspaces/{workspaceId}');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesRemove.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('workspaces.updateGlobalVariables Update global variables', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.updateGlobalVariables(
			mockCtx,
			{ workspaceId: 'test-workspaceId' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/workspaces/{workspaceId}/global-variables');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesUpdateGlobalVariables.safeParse(
				result,
			).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesUpdateGlobalVariables.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});

	it('workspaces.update Update a workspace', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.workspaces.update(mockCtx, {
			workspaceId: 'test-workspaceId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/workspaces/{workspaceId}');
		expect(captured?.path).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.workspacesUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.workspacesUpdate.safeParse({
				workspaceId: 'test-workspaceId',
			}).success,
		).toBe(true);
	});
});
describe('Postman account', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('account.me Get authenticated user', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.account.me(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/me');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.accountMe.safeParse(result).success,
		).toBe(true);
		expect(PostmanEndpointInputSchemas.accountMe.safeParse({}).success).toBe(
			true,
		);
	});
});
describe('Postman billing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('billing.getAccount Get accounts', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.billing.getAccount(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/accounts');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.billingGetAccount.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.billingGetAccount.safeParse({}).success,
		).toBe(true);
	});

	it('billing.listInvoices List account invoices', async () => {
		const canned = { data: [{}] };
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.billing.listInvoices(mockCtx, {
			accountId: 'test-accountId',
			status: 'PAID',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/accounts/{accountId}/invoices');
		expect(captured?.path).toMatchObject({ accountId: 'test-accountId' });
		expect(captured?.query).toMatchObject({ status: 'PAID' });
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.billingListInvoices.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.billingListInvoices.safeParse({
				accountId: 'test-accountId',
				status: 'PAID',
			}).success,
		).toBe(true);
	});
});
describe('Postman accessKeys', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('accessKeys.list Get collection access keys', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.accessKeys.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/collection-access-keys');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.accessKeysList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.accessKeysList.safeParse({}).success,
		).toBe(true);
	});
});
describe('Postman environments', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("environments.getForks Get an environment's forks", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.getForks(mockCtx, {
			environmentId: 'test-environmentId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/environments/{environmentId}/forks');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsGetForks.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsGetForks.safeParse({
				environmentId: 'test-environmentId',
			}).success,
		).toBe(true);
	});

	it('environments.get Get an environment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.get(mockCtx, {
			environmentId: 'test-environmentId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/environments/{environmentId}');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsGet.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsGet.safeParse({
				environmentId: 'test-environmentId',
			}).success,
		).toBe(true);
	});

	it('environments.create Create an environment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.create(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/environments');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsCreate.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});

	it('environments.remove Delete an environment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.remove(mockCtx, {
			environmentId: 'test-environmentId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('DELETE');
		expect(captured?.url).toBe('/environments/{environmentId}');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsRemove.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsRemove.safeParse({
				environmentId: 'test-environmentId',
			}).success,
		).toBe(true);
	});

	it('environments.fork Create a fork', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.fork(mockCtx, {
			environmentId: 'test-environmentId',
			workspaceId: 'test-workspaceId',
			forkName: 'test-forkName',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/environments/{environmentId}/forks');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toMatchObject({ workspaceId: 'test-workspaceId' });
		expect(captured?.body).toMatchObject({ forkName: 'test-forkName' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsFork.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsFork.safeParse({
				environmentId: 'test-environmentId',
				workspaceId: 'test-workspaceId',
				forkName: 'test-forkName',
			}).success,
		).toBe(true);
	});

	it('environments.mergeFork Merge a fork', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.mergeFork(mockCtx, {
			environmentId: 'test-environmentId',
			source: 'test-source',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/environments/{environmentId}/merges');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ source: 'test-source' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsMergeFork.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsMergeFork.safeParse({
				environmentId: 'test-environmentId',
				source: 'test-source',
			}).success,
		).toBe(true);
	});

	it("environments.replace Replace an environment's data", async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.replace(mockCtx, {
			environmentId: 'test-environmentId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/environments/{environmentId}');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsReplace.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsReplace.safeParse({
				environmentId: 'test-environmentId',
			}).success,
		).toBe(true);
	});

	it('environments.update Update an environment', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.update(mockCtx, {
			environmentId: 'test-environmentId',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PATCH');
		expect(captured?.url).toBe('/environments/{environmentId}');
		expect(captured?.path).toMatchObject({
			environmentId: 'test-environmentId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsUpdate.safeParse({
				environmentId: 'test-environmentId',
			}).success,
		).toBe(true);
	});

	it('environments.list Get all environments', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.environments.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/environments');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({});
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.environmentsList.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.environmentsList.safeParse({}).success,
		).toBe(true);
	});
});
describe('Postman scim', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('scim.getResourceTypes Get resource types', async () => {
		const canned = [{}];
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.scim.getResourceTypes(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/scim/v2/ResourceTypes');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.scimGetResourceTypes.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.scimGetResourceTypes.safeParse({}).success,
		).toBe(true);
	});

	it('scim.getServiceConfig Get service provider configuration', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.scim.getServiceConfig(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('GET');
		expect(captured?.url).toBe('/scim/v2/ServiceProviderConfig');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.scimGetServiceConfig.safeParse(result)
				.success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.scimGetServiceConfig.safeParse({}).success,
		).toBe(true);
	});
});
describe('Postman webhooks', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('webhooks.create Create a webhook', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.webhooks.create(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/webhooks');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeDefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.webhooksCreate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.webhooksCreate.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});
});
describe('Postman tools', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('tools.importOpenapi Import an OpenAPI definition', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.tools.importOpenapi(mockCtx, {
			workspace: 'test-workspace',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/import/openapi');
		expect(captured?.path).toBeUndefined();
		expect(captured?.query).toMatchObject({ workspace: 'test-workspace' });
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.toolsImportOpenapi.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.toolsImportOpenapi.safeParse({
				workspace: 'test-workspace',
			}).success,
		).toBe(true);
	});
});
describe('Postman comments', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('comments.resolve Resolve a comment thread', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.comments.resolve(mockCtx, {
			threadId: 1,
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/comments-resolutions/{threadId}');
		expect(captured?.path).toMatchObject({ threadId: 1 });
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toBeUndefined();
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.commentsResolve.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.commentsResolve.safeParse({ threadId: 1 })
				.success,
		).toBe(true);
	});
});
describe('Postman pullRequests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('pullRequests.review Review a pull request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.pullRequests.review(mockCtx, {
			pullRequestId: 'test-pullRequestId',
			action: 'approve',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe('/pull-requests/{pullRequestId}/tasks');
		expect(captured?.path).toMatchObject({
			pullRequestId: 'test-pullRequestId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({ action: 'approve' });
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.pullRequestsReview.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.pullRequestsReview.safeParse({
				pullRequestId: 'test-pullRequestId',
				action: 'approve',
			}).success,
		).toBe(true);
	});

	it('pullRequests.update Update a pull request', async () => {
		const canned = {};
		let captured: ApiRequestOptions | undefined;
		mockRequest.mockImplementationOnce(
			async (config: OpenAPIConfig, options: ApiRequestOptions) => {
				expect(config.BASE).toBe('https://api.getpostman.com');
				captured = options;
				return canned;
			},
		);

		const plugin = postman();
		const result = await plugin.endpoints!.pullRequests.update(mockCtx, {
			pullRequestId: 'test-pullRequestId',
			title: 'test-title',
			reviewers: ['test-reviewersItem'],
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(captured?.method).toBe('PUT');
		expect(captured?.url).toBe('/pull-requests/{pullRequestId}');
		expect(captured?.path).toMatchObject({
			pullRequestId: 'test-pullRequestId',
		});
		expect(captured?.query).toBeUndefined();
		expect(captured?.body).toMatchObject({
			title: 'test-title',
			reviewers: ['test-reviewersItem'],
		});
		expect(result).toEqual(canned);
		expect(
			PostmanEndpointOutputSchemas.pullRequestsUpdate.safeParse(result).success,
		).toBe(true);
		expect(
			PostmanEndpointInputSchemas.pullRequestsUpdate.safeParse({
				pullRequestId: 'test-pullRequestId',
				title: 'test-title',
				reviewers: ['test-reviewersItem'],
			}).success,
		).toBe(true);
	});
});
