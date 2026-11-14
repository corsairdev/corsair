import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Comments,
	Elements,
	LayerComponents,
	LayerGroups,
	Layers,
	Maps,
	PrintPages,
	Projects,
	Sources,
	Users,
} from './endpoints';
import type {
	FeltEndpointInputs,
	FeltEndpointOutputs,
} from './endpoints/types';
import {
	FeltEndpointInputSchemas,
	FeltEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FeltSchema } from './schema';

export type FeltPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFeltPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof feltEndpointsNested>;
};

export type FeltContext = CorsairPluginContext<
	typeof FeltSchema,
	FeltPluginOptions
>;

export type FeltKeyBuilderContext = KeyBuilderContext<FeltPluginOptions>;

export type FeltBoundEndpoints = BindEndpoints<typeof feltEndpointsNested>;

type FeltEndpoint<K extends keyof FeltEndpointOutputs> = CorsairEndpoint<
	FeltContext,
	FeltEndpointInputs[K],
	FeltEndpointOutputs[K]
>;

export type FeltEndpoints = {
	usersGetCurrent: FeltEndpoint<'usersGetCurrent'>;
	mapsCreate: FeltEndpoint<'mapsCreate'>;
	mapsGet: FeltEndpoint<'mapsGet'>;
	mapsUpdate: FeltEndpoint<'mapsUpdate'>;
	mapsDelete: FeltEndpoint<'mapsDelete'>;
	mapsDuplicate: FeltEndpoint<'mapsDuplicate'>;
	mapsMove: FeltEndpoint<'mapsMove'>;
	mapsExportImage: FeltEndpoint<'mapsExportImage'>;
	mapsCreateEmbedToken: FeltEndpoint<'mapsCreateEmbedToken'>;
	layersList: FeltEndpoint<'layersList'>;
	layersGet: FeltEndpoint<'layersGet'>;
	layersUpdate: FeltEndpoint<'layersUpdate'>;
	layersDelete: FeltEndpoint<'layersDelete'>;
	layersUpload: FeltEndpoint<'layersUpload'>;
	layersAddFromSource: FeltEndpoint<'layersAddFromSource'>;
	layersRefresh: FeltEndpoint<'layersRefresh'>;
	layersUpdateStyle: FeltEndpoint<'layersUpdateStyle'>;
	layersPublish: FeltEndpoint<'layersPublish'>;
	layersCreateCustomExport: FeltEndpoint<'layersCreateCustomExport'>;
	layersPollCustomExport: FeltEndpoint<'layersPollCustomExport'>;
	layersGetExportLink: FeltEndpoint<'layersGetExportLink'>;
	layersDuplicate: FeltEndpoint<'layersDuplicate'>;
	layersListLibrary: FeltEndpoint<'layersListLibrary'>;
	layerGroupsList: FeltEndpoint<'layerGroupsList'>;
	layerGroupsGet: FeltEndpoint<'layerGroupsGet'>;
	layerGroupsUpdate: FeltEndpoint<'layerGroupsUpdate'>;
	layerGroupsUpdateBulk: FeltEndpoint<'layerGroupsUpdateBulk'>;
	layerGroupsDelete: FeltEndpoint<'layerGroupsDelete'>;
	layerGroupsPublish: FeltEndpoint<'layerGroupsPublish'>;
	layerComponentsList: FeltEndpoint<'layerComponentsList'>;
	layerComponentsCreate: FeltEndpoint<'layerComponentsCreate'>;
	layerComponentsGet: FeltEndpoint<'layerComponentsGet'>;
	layerComponentsUpdate: FeltEndpoint<'layerComponentsUpdate'>;
	layerComponentsDelete: FeltEndpoint<'layerComponentsDelete'>;
	elementsList: FeltEndpoint<'elementsList'>;
	elementsUpsert: FeltEndpoint<'elementsUpsert'>;
	elementsDelete: FeltEndpoint<'elementsDelete'>;
	elementsListGroups: FeltEndpoint<'elementsListGroups'>;
	elementsGetGroup: FeltEndpoint<'elementsGetGroup'>;
	elementsUpsertGroups: FeltEndpoint<'elementsUpsertGroups'>;
	commentsExport: FeltEndpoint<'commentsExport'>;
	commentsResolve: FeltEndpoint<'commentsResolve'>;
	commentsDelete: FeltEndpoint<'commentsDelete'>;
	projectsList: FeltEndpoint<'projectsList'>;
	projectsCreate: FeltEndpoint<'projectsCreate'>;
	projectsGet: FeltEndpoint<'projectsGet'>;
	projectsUpdate: FeltEndpoint<'projectsUpdate'>;
	projectsDelete: FeltEndpoint<'projectsDelete'>;
	sourcesList: FeltEndpoint<'sourcesList'>;
	sourcesCreate: FeltEndpoint<'sourcesCreate'>;
	sourcesGet: FeltEndpoint<'sourcesGet'>;
	sourcesUpdate: FeltEndpoint<'sourcesUpdate'>;
	sourcesDelete: FeltEndpoint<'sourcesDelete'>;
	sourcesSync: FeltEndpoint<'sourcesSync'>;
	sourcesCreateCredential: FeltEndpoint<'sourcesCreateCredential'>;
	sourcesUpdateCredential: FeltEndpoint<'sourcesUpdateCredential'>;
	sourcesDeleteCredential: FeltEndpoint<'sourcesDeleteCredential'>;
	printPagesListLayouts: FeltEndpoint<'printPagesListLayouts'>;
	printPagesCreateLayout: FeltEndpoint<'printPagesCreateLayout'>;
	printPagesUpdateLayout: FeltEndpoint<'printPagesUpdateLayout'>;
	printPagesDeleteLayout: FeltEndpoint<'printPagesDeleteLayout'>;
	printPagesListPages: FeltEndpoint<'printPagesListPages'>;
	printPagesCreatePage: FeltEndpoint<'printPagesCreatePage'>;
	printPagesGetPage: FeltEndpoint<'printPagesGetPage'>;
	printPagesUpdatePage: FeltEndpoint<'printPagesUpdatePage'>;
	printPagesDeletePage: FeltEndpoint<'printPagesDeletePage'>;
	printPagesExportPage: FeltEndpoint<'printPagesExportPage'>;
	printPagesUpsertItems: FeltEndpoint<'printPagesUpsertItems'>;
	printPagesDeleteItem: FeltEndpoint<'printPagesDeleteItem'>;
};

const feltEndpointsNested = {
	users: {
		getCurrent: Users.getCurrent,
	},
	maps: {
		create: Maps.create,
		get: Maps.get,
		update: Maps.update,
		delete: Maps.delete,
		duplicate: Maps.duplicate,
		move: Maps.move,
		exportImage: Maps.exportImage,
		createEmbedToken: Maps.createEmbedToken,
	},
	layers: {
		list: Layers.list,
		get: Layers.get,
		update: Layers.update,
		delete: Layers.delete,
		upload: Layers.upload,
		addFromSource: Layers.addFromSource,
		refresh: Layers.refresh,
		updateStyle: Layers.updateStyle,
		publish: Layers.publish,
		createCustomExport: Layers.createCustomExport,
		pollCustomExport: Layers.pollCustomExport,
		getExportLink: Layers.getExportLink,
		duplicate: Layers.duplicate,
		listLibrary: Layers.listLibrary,
	},
	layerGroups: {
		list: LayerGroups.list,
		get: LayerGroups.get,
		update: LayerGroups.update,
		updateBulk: LayerGroups.updateBulk,
		delete: LayerGroups.delete,
		publish: LayerGroups.publish,
	},
	layerComponents: {
		list: LayerComponents.list,
		create: LayerComponents.create,
		get: LayerComponents.get,
		update: LayerComponents.update,
		delete: LayerComponents.delete,
	},
	elements: {
		list: Elements.list,
		upsert: Elements.upsert,
		delete: Elements.delete,
		listGroups: Elements.listGroups,
		getGroup: Elements.getGroup,
		upsertGroups: Elements.upsertGroups,
	},
	comments: {
		export: Comments.export,
		resolve: Comments.resolve,
		delete: Comments.delete,
	},
	projects: {
		list: Projects.list,
		create: Projects.create,
		get: Projects.get,
		update: Projects.update,
		delete: Projects.delete,
	},
	sources: {
		list: Sources.list,
		create: Sources.create,
		get: Sources.get,
		update: Sources.update,
		delete: Sources.delete,
		sync: Sources.sync,
		createCredential: Sources.createCredential,
		updateCredential: Sources.updateCredential,
		deleteCredential: Sources.deleteCredential,
	},
	printPages: {
		listLayouts: PrintPages.listLayouts,
		createLayout: PrintPages.createLayout,
		updateLayout: PrintPages.updateLayout,
		deleteLayout: PrintPages.deleteLayout,
		listPages: PrintPages.listPages,
		createPage: PrintPages.createPage,
		getPage: PrintPages.getPage,
		updatePage: PrintPages.updatePage,
		deletePage: PrintPages.deletePage,
		exportPage: PrintPages.exportPage,
		upsertItems: PrintPages.upsertItems,
		deleteItem: PrintPages.deleteItem,
	},
} as const;

export const feltEndpointSchemas = {
	'users.getCurrent': {
		input: FeltEndpointInputSchemas.usersGetCurrent,
		output: FeltEndpointOutputSchemas.usersGetCurrent,
	},
	'maps.create': {
		input: FeltEndpointInputSchemas.mapsCreate,
		output: FeltEndpointOutputSchemas.mapsCreate,
	},
	'maps.get': {
		input: FeltEndpointInputSchemas.mapsGet,
		output: FeltEndpointOutputSchemas.mapsGet,
	},
	'maps.update': {
		input: FeltEndpointInputSchemas.mapsUpdate,
		output: FeltEndpointOutputSchemas.mapsUpdate,
	},
	'maps.delete': {
		input: FeltEndpointInputSchemas.mapsDelete,
		output: FeltEndpointOutputSchemas.mapsDelete,
	},
	'maps.duplicate': {
		input: FeltEndpointInputSchemas.mapsDuplicate,
		output: FeltEndpointOutputSchemas.mapsDuplicate,
	},
	'maps.move': {
		input: FeltEndpointInputSchemas.mapsMove,
		output: FeltEndpointOutputSchemas.mapsMove,
	},
	'maps.exportImage': {
		input: FeltEndpointInputSchemas.mapsExportImage,
		output: FeltEndpointOutputSchemas.mapsExportImage,
	},
	'maps.createEmbedToken': {
		input: FeltEndpointInputSchemas.mapsCreateEmbedToken,
		output: FeltEndpointOutputSchemas.mapsCreateEmbedToken,
	},
	'layers.list': {
		input: FeltEndpointInputSchemas.layersList,
		output: FeltEndpointOutputSchemas.layersList,
	},
	'layers.get': {
		input: FeltEndpointInputSchemas.layersGet,
		output: FeltEndpointOutputSchemas.layersGet,
	},
	'layers.update': {
		input: FeltEndpointInputSchemas.layersUpdate,
		output: FeltEndpointOutputSchemas.layersUpdate,
	},
	'layers.delete': {
		input: FeltEndpointInputSchemas.layersDelete,
		output: FeltEndpointOutputSchemas.layersDelete,
	},
	'layers.upload': {
		input: FeltEndpointInputSchemas.layersUpload,
		output: FeltEndpointOutputSchemas.layersUpload,
	},
	'layers.addFromSource': {
		input: FeltEndpointInputSchemas.layersAddFromSource,
		output: FeltEndpointOutputSchemas.layersAddFromSource,
	},
	'layers.refresh': {
		input: FeltEndpointInputSchemas.layersRefresh,
		output: FeltEndpointOutputSchemas.layersRefresh,
	},
	'layers.updateStyle': {
		input: FeltEndpointInputSchemas.layersUpdateStyle,
		output: FeltEndpointOutputSchemas.layersUpdateStyle,
	},
	'layers.publish': {
		input: FeltEndpointInputSchemas.layersPublish,
		output: FeltEndpointOutputSchemas.layersPublish,
	},
	'layers.createCustomExport': {
		input: FeltEndpointInputSchemas.layersCreateCustomExport,
		output: FeltEndpointOutputSchemas.layersCreateCustomExport,
	},
	'layers.pollCustomExport': {
		input: FeltEndpointInputSchemas.layersPollCustomExport,
		output: FeltEndpointOutputSchemas.layersPollCustomExport,
	},
	'layers.getExportLink': {
		input: FeltEndpointInputSchemas.layersGetExportLink,
		output: FeltEndpointOutputSchemas.layersGetExportLink,
	},
	'layers.duplicate': {
		input: FeltEndpointInputSchemas.layersDuplicate,
		output: FeltEndpointOutputSchemas.layersDuplicate,
	},
	'layers.listLibrary': {
		input: FeltEndpointInputSchemas.layersListLibrary,
		output: FeltEndpointOutputSchemas.layersListLibrary,
	},
	'layerGroups.list': {
		input: FeltEndpointInputSchemas.layerGroupsList,
		output: FeltEndpointOutputSchemas.layerGroupsList,
	},
	'layerGroups.get': {
		input: FeltEndpointInputSchemas.layerGroupsGet,
		output: FeltEndpointOutputSchemas.layerGroupsGet,
	},
	'layerGroups.update': {
		input: FeltEndpointInputSchemas.layerGroupsUpdate,
		output: FeltEndpointOutputSchemas.layerGroupsUpdate,
	},
	'layerGroups.updateBulk': {
		input: FeltEndpointInputSchemas.layerGroupsUpdateBulk,
		output: FeltEndpointOutputSchemas.layerGroupsUpdateBulk,
	},
	'layerGroups.delete': {
		input: FeltEndpointInputSchemas.layerGroupsDelete,
		output: FeltEndpointOutputSchemas.layerGroupsDelete,
	},
	'layerGroups.publish': {
		input: FeltEndpointInputSchemas.layerGroupsPublish,
		output: FeltEndpointOutputSchemas.layerGroupsPublish,
	},
	'layerComponents.list': {
		input: FeltEndpointInputSchemas.layerComponentsList,
		output: FeltEndpointOutputSchemas.layerComponentsList,
	},
	'layerComponents.create': {
		input: FeltEndpointInputSchemas.layerComponentsCreate,
		output: FeltEndpointOutputSchemas.layerComponentsCreate,
	},
	'layerComponents.get': {
		input: FeltEndpointInputSchemas.layerComponentsGet,
		output: FeltEndpointOutputSchemas.layerComponentsGet,
	},
	'layerComponents.update': {
		input: FeltEndpointInputSchemas.layerComponentsUpdate,
		output: FeltEndpointOutputSchemas.layerComponentsUpdate,
	},
	'layerComponents.delete': {
		input: FeltEndpointInputSchemas.layerComponentsDelete,
		output: FeltEndpointOutputSchemas.layerComponentsDelete,
	},
	'elements.list': {
		input: FeltEndpointInputSchemas.elementsList,
		output: FeltEndpointOutputSchemas.elementsList,
	},
	'elements.upsert': {
		input: FeltEndpointInputSchemas.elementsUpsert,
		output: FeltEndpointOutputSchemas.elementsUpsert,
	},
	'elements.delete': {
		input: FeltEndpointInputSchemas.elementsDelete,
		output: FeltEndpointOutputSchemas.elementsDelete,
	},
	'elements.listGroups': {
		input: FeltEndpointInputSchemas.elementsListGroups,
		output: FeltEndpointOutputSchemas.elementsListGroups,
	},
	'elements.getGroup': {
		input: FeltEndpointInputSchemas.elementsGetGroup,
		output: FeltEndpointOutputSchemas.elementsGetGroup,
	},
	'elements.upsertGroups': {
		input: FeltEndpointInputSchemas.elementsUpsertGroups,
		output: FeltEndpointOutputSchemas.elementsUpsertGroups,
	},
	'comments.export': {
		input: FeltEndpointInputSchemas.commentsExport,
		output: FeltEndpointOutputSchemas.commentsExport,
	},
	'comments.resolve': {
		input: FeltEndpointInputSchemas.commentsResolve,
		output: FeltEndpointOutputSchemas.commentsResolve,
	},
	'comments.delete': {
		input: FeltEndpointInputSchemas.commentsDelete,
		output: FeltEndpointOutputSchemas.commentsDelete,
	},
	'projects.list': {
		input: FeltEndpointInputSchemas.projectsList,
		output: FeltEndpointOutputSchemas.projectsList,
	},
	'projects.create': {
		input: FeltEndpointInputSchemas.projectsCreate,
		output: FeltEndpointOutputSchemas.projectsCreate,
	},
	'projects.get': {
		input: FeltEndpointInputSchemas.projectsGet,
		output: FeltEndpointOutputSchemas.projectsGet,
	},
	'projects.update': {
		input: FeltEndpointInputSchemas.projectsUpdate,
		output: FeltEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: FeltEndpointInputSchemas.projectsDelete,
		output: FeltEndpointOutputSchemas.projectsDelete,
	},
	'sources.list': {
		input: FeltEndpointInputSchemas.sourcesList,
		output: FeltEndpointOutputSchemas.sourcesList,
	},
	'sources.create': {
		input: FeltEndpointInputSchemas.sourcesCreate,
		output: FeltEndpointOutputSchemas.sourcesCreate,
	},
	'sources.get': {
		input: FeltEndpointInputSchemas.sourcesGet,
		output: FeltEndpointOutputSchemas.sourcesGet,
	},
	'sources.update': {
		input: FeltEndpointInputSchemas.sourcesUpdate,
		output: FeltEndpointOutputSchemas.sourcesUpdate,
	},
	'sources.delete': {
		input: FeltEndpointInputSchemas.sourcesDelete,
		output: FeltEndpointOutputSchemas.sourcesDelete,
	},
	'sources.sync': {
		input: FeltEndpointInputSchemas.sourcesSync,
		output: FeltEndpointOutputSchemas.sourcesSync,
	},
	'sources.createCredential': {
		input: FeltEndpointInputSchemas.sourcesCreateCredential,
		output: FeltEndpointOutputSchemas.sourcesCreateCredential,
	},
	'sources.updateCredential': {
		input: FeltEndpointInputSchemas.sourcesUpdateCredential,
		output: FeltEndpointOutputSchemas.sourcesUpdateCredential,
	},
	'sources.deleteCredential': {
		input: FeltEndpointInputSchemas.sourcesDeleteCredential,
		output: FeltEndpointOutputSchemas.sourcesDeleteCredential,
	},
	'printPages.listLayouts': {
		input: FeltEndpointInputSchemas.printPagesListLayouts,
		output: FeltEndpointOutputSchemas.printPagesListLayouts,
	},
	'printPages.createLayout': {
		input: FeltEndpointInputSchemas.printPagesCreateLayout,
		output: FeltEndpointOutputSchemas.printPagesCreateLayout,
	},
	'printPages.updateLayout': {
		input: FeltEndpointInputSchemas.printPagesUpdateLayout,
		output: FeltEndpointOutputSchemas.printPagesUpdateLayout,
	},
	'printPages.deleteLayout': {
		input: FeltEndpointInputSchemas.printPagesDeleteLayout,
		output: FeltEndpointOutputSchemas.printPagesDeleteLayout,
	},
	'printPages.listPages': {
		input: FeltEndpointInputSchemas.printPagesListPages,
		output: FeltEndpointOutputSchemas.printPagesListPages,
	},
	'printPages.createPage': {
		input: FeltEndpointInputSchemas.printPagesCreatePage,
		output: FeltEndpointOutputSchemas.printPagesCreatePage,
	},
	'printPages.getPage': {
		input: FeltEndpointInputSchemas.printPagesGetPage,
		output: FeltEndpointOutputSchemas.printPagesGetPage,
	},
	'printPages.updatePage': {
		input: FeltEndpointInputSchemas.printPagesUpdatePage,
		output: FeltEndpointOutputSchemas.printPagesUpdatePage,
	},
	'printPages.deletePage': {
		input: FeltEndpointInputSchemas.printPagesDeletePage,
		output: FeltEndpointOutputSchemas.printPagesDeletePage,
	},
	'printPages.exportPage': {
		input: FeltEndpointInputSchemas.printPagesExportPage,
		output: FeltEndpointOutputSchemas.printPagesExportPage,
	},
	'printPages.upsertItems': {
		input: FeltEndpointInputSchemas.printPagesUpsertItems,
		output: FeltEndpointOutputSchemas.printPagesUpsertItems,
	},
	'printPages.deleteItem': {
		input: FeltEndpointInputSchemas.printPagesDeleteItem,
		output: FeltEndpointOutputSchemas.printPagesDeleteItem,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof feltEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const feltEndpointMeta = {
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Retrieve profile information for the authenticated user',
	},
	'maps.create': {
		riskLevel: 'write',
		description: 'Create a new map in Felt',
	},
	'maps.get': {
		riskLevel: 'read',
		description: 'Get details and layers of a map',
	},
	'maps.update': {
		riskLevel: 'write',
		description:
			'Update map properties such as title, description, or permissions',
	},
	'maps.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a map',
	},
	'maps.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate an existing map',
	},
	'maps.move': {
		riskLevel: 'write',
		description: 'Move a map to a project or folder',
	},
	'maps.exportImage': {
		riskLevel: 'write',
		description: 'Trigger an export of the map as an image',
	},
	'maps.createEmbedToken': {
		riskLevel: 'write',
		description: 'Create a secure authenticated embed token for a map',
	},
	'layers.list': {
		riskLevel: 'read',
		description: 'List all layers within a map',
	},
	'layers.get': {
		riskLevel: 'read',
		description: 'Get details of a specific map layer',
	},
	'layers.update': {
		riskLevel: 'write',
		description: 'Update multiple map layers in bulk',
	},
	'layers.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a map layer',
	},
	'layers.upload': {
		riskLevel: 'write',
		description:
			'Upload a data layer to a map from a URL or file upload parameters',
	},
	'layers.addFromSource': {
		riskLevel: 'write',
		description:
			'Add a layer to a map from a source: one of its datasets, a SQL query or a STAC asset',
	},
	'layers.refresh': {
		riskLevel: 'write',
		description: 'Trigger a refresh of a live data layer',
	},
	'layers.updateStyle': {
		riskLevel: 'write',
		description: 'Update visual style of a layer using Felt Style Language',
	},
	'layers.publish': {
		riskLevel: 'write',
		description: 'Publish a layer to the library',
	},
	'layers.createCustomExport': {
		riskLevel: 'write',
		description: 'Request an export of layer data in a specified format',
	},
	'layers.pollCustomExport': {
		riskLevel: 'read',
		description: 'Check status and get download URL of a layer export request',
	},
	'layers.getExportLink': {
		riskLevel: 'read',
		description: 'Get a direct download link for layer data',
	},
	'layers.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate layers across maps',
	},
	'layers.listLibrary': {
		riskLevel: 'read',
		description: 'List layers available in the library',
	},
	'layerGroups.list': {
		riskLevel: 'read',
		description: 'List layer groups in a map',
	},
	'layerGroups.get': {
		riskLevel: 'read',
		description: 'Get details of a layer group',
	},
	'layerGroups.update': {
		riskLevel: 'write',
		description: 'Update properties of a layer group',
	},
	'layerGroups.updateBulk': {
		riskLevel: 'write',
		description: 'Update multiple layer groups in bulk',
	},
	'layerGroups.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a layer group',
	},
	'layerGroups.publish': {
		riskLevel: 'write',
		description: 'Publish a layer group to the library',
	},
	'layerComponents.list': {
		riskLevel: 'read',
		description: 'List dashboard UI components attached to a layer',
	},
	'layerComponents.create': {
		riskLevel: 'write',
		description: 'Create a dashboard component on a layer',
	},
	'layerComponents.get': {
		riskLevel: 'read',
		description: 'Get details of a layer component',
	},
	'layerComponents.update': {
		riskLevel: 'write',
		description: 'Update a dashboard component on a layer',
	},
	'layerComponents.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a layer component',
	},
	'elements.list': {
		riskLevel: 'read',
		description: 'List drawn elements on a map in GeoJSON format',
	},
	'elements.upsert': {
		riskLevel: 'write',
		description:
			'Create or update elements on a map using GeoJSON FeatureCollection',
	},
	'elements.delete': {
		riskLevel: 'destructive',
		description:
			"Delete a drawn element from a map; the element id is the feature's `felt:id` property",
	},
	'elements.listGroups': {
		riskLevel: 'read',
		description: 'List element groups in a map',
	},
	'elements.getGroup': {
		riskLevel: 'read',
		description: 'Get elements in an element group as GeoJSON',
	},
	'elements.upsertGroups': {
		riskLevel: 'write',
		description: 'Create or update element groups in a map',
	},
	'comments.export': {
		riskLevel: 'read',
		description: 'Export all comments and replies from a map',
	},
	'comments.resolve': {
		riskLevel: 'write',
		description: 'Resolve a map comment thread',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a map comment',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects in the workspace',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project in the workspace',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get details and maps contained within a project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update project settings or permissions',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a project',
	},
	'sources.list': {
		riskLevel: 'read',
		description: 'List connected data sources in the workspace',
	},
	'sources.create': {
		riskLevel: 'write',
		description: 'Connect a new cloud database or warehouse data source',
	},
	'sources.get': {
		riskLevel: 'read',
		description: 'Get details of a connected data source and its datasets',
	},
	'sources.update': {
		riskLevel: 'write',
		description: 'Update data source configuration or permissions',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		description: 'Permanently delete a data source connection',
	},
	'sources.sync': {
		riskLevel: 'write',
		description: 'Trigger a manual sync of a connected data source',
	},
	'sources.createCredential': {
		riskLevel: 'write',
		description: 'Add an authentication credential to a data source',
	},
	'sources.updateCredential': {
		riskLevel: 'write',
		description: 'Update an authentication credential on a data source',
	},
	'sources.deleteCredential': {
		riskLevel: 'destructive',
		description: 'Permanently delete a credential from a data source',
	},
	'printPages.listLayouts': {
		riskLevel: 'read',
		description: 'List saved print layouts in a map',
	},
	'printPages.createLayout': {
		riskLevel: 'write',
		description: 'Save a print page as a reusable layout template',
	},
	'printPages.updateLayout': {
		riskLevel: 'write',
		description: 'Update a print layout template',
	},
	'printPages.deleteLayout': {
		riskLevel: 'destructive',
		description: 'Delete a print layout template',
	},
	'printPages.listPages': {
		riskLevel: 'read',
		description: 'List print page designs in a map',
	},
	'printPages.createPage': {
		riskLevel: 'write',
		description: 'Create a new print page design in a map',
	},
	'printPages.getPage': {
		riskLevel: 'read',
		description: 'Get details and items of a print page design',
	},
	'printPages.updatePage': {
		riskLevel: 'write',
		description: 'Update properties and dimensions of a print page design',
	},
	'printPages.deletePage': {
		riskLevel: 'destructive',
		description: 'Permanently delete a print page design',
	},
	'printPages.exportPage': {
		riskLevel: 'write',
		description: 'Export a print page as a PDF or image',
	},
	'printPages.upsertItems': {
		riskLevel: 'write',
		description: 'Create or update items on a print page design',
	},
	'printPages.deleteItem': {
		riskLevel: 'destructive',
		description: 'Delete an item from a print page design',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof feltEndpointsNested>;

export const feltAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseFeltPlugin<T extends FeltPluginOptions> = CorsairPlugin<
	'felt',
	typeof FeltSchema,
	typeof feltEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalFeltPlugin = BaseFeltPlugin<FeltPluginOptions>;

export type ExternalFeltPlugin<T extends FeltPluginOptions> = BaseFeltPlugin<T>;

export function felt<const T extends FeltPluginOptions>(
	incomingOptions: FeltPluginOptions & T = {} as FeltPluginOptions & T,
): ExternalFeltPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'felt',
		authConfig: feltAuthConfig,
		schema: FeltSchema,
		options,
		hooks: options.hooks,
		endpoints: feltEndpointsNested,
		webhooks: {},
		endpointMeta: feltEndpointMeta,
		endpointSchemas: feltEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: FeltKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('felt', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('felt', 'api_key');
			return apiKey;
		},
	} satisfies InternalFeltPlugin;
}

export type {
	AddSourceLayerAccepted,
	CommentResolved,
	CommentsDeleteInput,
	CommentsDeleteResponse,
	CommentsExportInput,
	CommentsExportResponse,
	CommentsResolveInput,
	CommentsResolveResponse,
	CustomExportRequestStatus,
	CustomExportResponse,
	DuplicateLayersResponse,
	ElementGroup,
	ElementsDeleteInput,
	ElementsDeleteResponse,
	ElementsGetGroupInput,
	ElementsGetGroupResponse,
	ElementsListGroupsInput,
	ElementsListGroupsResponse,
	ElementsListInput,
	ElementsListResponse,
	ElementsUpsertGroupsInput,
	ElementsUpsertGroupsResponse,
	ElementsUpsertInput,
	ElementsUpsertResponse,
	EmbedToken,
	ExportLink,
	FeltDeletedResponse,
	FeltEndpointInputs,
	FeltEndpointOutputs,
	FeltLayer,
	FeltMap,
	GeoJson,
	LayerComponent,
	LayerComponentsCreateInput,
	LayerComponentsCreateResponse,
	LayerComponentsDeleteInput,
	LayerComponentsDeleteResponse,
	LayerComponentsGetInput,
	LayerComponentsGetResponse,
	LayerComponentsListInput,
	LayerComponentsListResponse,
	LayerComponentsUpdateInput,
	LayerComponentsUpdateResponse,
	LayerGroup,
	LayerGroupsDeleteInput,
	LayerGroupsDeleteResponse,
	LayerGroupsGetInput,
	LayerGroupsGetResponse,
	LayerGroupsListInput,
	LayerGroupsListResponse,
	LayerGroupsPublishInput,
	LayerGroupsPublishResponse,
	LayerGroupsUpdateBulkInput,
	LayerGroupsUpdateBulkResponse,
	LayerGroupsUpdateInput,
	LayerGroupsUpdateResponse,
	LayerLibrary,
	LayersAddFromSourceInput,
	LayersAddFromSourceResponse,
	LayersCreateCustomExportInput,
	LayersCreateCustomExportResponse,
	LayersDeleteInput,
	LayersDeleteResponse,
	LayersDuplicateInput,
	LayersDuplicateResponse,
	LayersGetExportLinkInput,
	LayersGetExportLinkResponse,
	LayersGetInput,
	LayersGetResponse,
	LayersListInput,
	LayersListLibraryInput,
	LayersListLibraryResponse,
	LayersListResponse,
	LayersPollCustomExportInput,
	LayersPollCustomExportResponse,
	LayersPublishInput,
	LayersPublishResponse,
	LayersRefreshInput,
	LayersRefreshResponse,
	LayersUpdateInput,
	LayersUpdateResponse,
	LayersUpdateStyleInput,
	LayersUpdateStyleResponse,
	LayersUploadInput,
	LayersUploadResponse,
	MapImageExport,
	MapReference,
	MapsCreateEmbedTokenInput,
	MapsCreateEmbedTokenResponse,
	MapsCreateInput,
	MapsCreateResponse,
	MapsDeleteInput,
	MapsDeleteResponse,
	MapsDuplicateInput,
	MapsDuplicateResponse,
	MapsExportImageInput,
	MapsExportImageResponse,
	MapsGetInput,
	MapsGetResponse,
	MapsMoveInput,
	MapsMoveResponse,
	MapsUpdateInput,
	MapsUpdateResponse,
	PrintLayout,
	PrintPageDetail,
	PrintPageExport,
	PrintPagesCreateLayoutInput,
	PrintPagesCreateLayoutResponse,
	PrintPagesCreatePageInput,
	PrintPagesCreatePageResponse,
	PrintPagesDeleteItemInput,
	PrintPagesDeleteItemResponse,
	PrintPagesDeleteLayoutInput,
	PrintPagesDeleteLayoutResponse,
	PrintPagesDeletePageInput,
	PrintPagesDeletePageResponse,
	PrintPagesExportPageInput,
	PrintPagesExportPageResponse,
	PrintPagesGetPageInput,
	PrintPagesGetPageResponse,
	PrintPagesListLayoutsInput,
	PrintPagesListLayoutsResponse,
	PrintPagesListPagesInput,
	PrintPagesListPagesResponse,
	PrintPagesUpdateLayoutInput,
	PrintPagesUpdateLayoutResponse,
	PrintPagesUpdatePageInput,
	PrintPagesUpdatePageResponse,
	PrintPagesUpsertItemsInput,
	PrintPagesUpsertItemsResponse,
	Project,
	ProjectReference,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	Source,
	SourceCredential,
	SourceReference,
	SourcesCreateCredentialInput,
	SourcesCreateCredentialResponse,
	SourcesCreateInput,
	SourcesCreateResponse,
	SourcesDeleteCredentialInput,
	SourcesDeleteCredentialResponse,
	SourcesDeleteInput,
	SourcesDeleteResponse,
	SourcesGetInput,
	SourcesGetResponse,
	SourcesListInput,
	SourcesListResponse,
	SourcesSyncInput,
	SourcesSyncResponse,
	SourcesUpdateCredentialInput,
	SourcesUpdateCredentialResponse,
	SourcesUpdateInput,
	SourcesUpdateResponse,
	UploadResponse,
	User,
	UsersGetCurrentInput,
	UsersGetCurrentResponse,
} from './endpoints/types';
