// Generated with endpoints/operation-types.ts from the WordPress REST index:
// one entry per operation in wordpress-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { wordpressSchemaEntry } from './openapi-schema';
import { createWordpressOperation as op } from './operations';

export const wordpressEndpointsNested = {
	abilities: {
		categories: {
			get: op('abilities.categories.get'),
			list: op('abilities.categories.list'),
		},
		get: op('abilities.get'),
		list: op('abilities.list'),
		run: op('abilities.run'),
		runDestructive: op('abilities.runDestructive'),
		runReadonly: op('abilities.runReadonly'),
	},
	batch: {
		run: op('batch.run'),
	},
	blockDirectory: {
		search: op('blockDirectory.search'),
	},
	blockEditor: {
		export: op('blockEditor.export'),
		navigationFallback: op('blockEditor.navigationFallback'),
		urlDetails: op('blockEditor.urlDetails'),
	},
	blockPatterns: {
		categories: op('blockPatterns.categories'),
		list: op('blockPatterns.list'),
	},
	blockRenderer: {
		render: op('blockRenderer.render'),
	},
	blockTypes: {
		get: op('blockTypes.get'),
		list: op('blockTypes.list'),
		listByNamespace: op('blockTypes.listByNamespace'),
	},
	blocks: {
		autosaves: {
			create: op('blocks.autosaves.create'),
			get: op('blocks.autosaves.get'),
			list: op('blocks.autosaves.list'),
		},
		create: op('blocks.create'),
		delete: op('blocks.delete'),
		get: op('blocks.get'),
		list: op('blocks.list'),
		revisions: {
			delete: op('blocks.revisions.delete'),
			get: op('blocks.revisions.get'),
			list: op('blocks.revisions.list'),
		},
		update: op('blocks.update'),
	},
	categories: {
		create: op('categories.create'),
		delete: op('categories.delete'),
		get: op('categories.get'),
		list: op('categories.list'),
		update: op('categories.update'),
	},
	comments: {
		create: op('comments.create'),
		delete: op('comments.delete'),
		get: op('comments.get'),
		list: op('comments.list'),
		update: op('comments.update'),
	},
	fontCollections: {
		get: op('fontCollections.get'),
		list: op('fontCollections.list'),
	},
	fontFamilies: {
		create: op('fontFamilies.create'),
		delete: op('fontFamilies.delete'),
		fontFaces: {
			create: op('fontFamilies.fontFaces.create'),
			delete: op('fontFamilies.fontFaces.delete'),
			get: op('fontFamilies.fontFaces.get'),
			list: op('fontFamilies.fontFaces.list'),
		},
		get: op('fontFamilies.get'),
		list: op('fontFamilies.list'),
		update: op('fontFamilies.update'),
	},
	globalStyles: {
		get: op('globalStyles.get'),
		revisions: {
			get: op('globalStyles.revisions.get'),
			list: op('globalStyles.revisions.list'),
		},
		theme: op('globalStyles.theme'),
		themeVariations: op('globalStyles.themeVariations'),
		update: op('globalStyles.update'),
	},
	iconCollections: {
		get: op('iconCollections.get'),
		list: op('iconCollections.list'),
	},
	icons: {
		get: op('icons.get'),
		list: op('icons.list'),
		listByCollection: op('icons.listByCollection'),
	},
	media: {
		create: op('media.create'),
		delete: op('media.delete'),
		edit: op('media.edit'),
		finalize: op('media.finalize'),
		get: op('media.get'),
		list: op('media.list'),
		postProcess: op('media.postProcess'),
		sideload: op('media.sideload'),
		update: op('media.update'),
	},
	menuItems: {
		autosaves: {
			create: op('menuItems.autosaves.create'),
			get: op('menuItems.autosaves.get'),
			list: op('menuItems.autosaves.list'),
		},
		create: op('menuItems.create'),
		delete: op('menuItems.delete'),
		get: op('menuItems.get'),
		list: op('menuItems.list'),
		update: op('menuItems.update'),
	},
	menuLocations: {
		get: op('menuLocations.get'),
		list: op('menuLocations.list'),
	},
	menus: {
		create: op('menus.create'),
		delete: op('menus.delete'),
		get: op('menus.get'),
		list: op('menus.list'),
		update: op('menus.update'),
	},
	navigation: {
		autosaves: {
			create: op('navigation.autosaves.create'),
			get: op('navigation.autosaves.get'),
			list: op('navigation.autosaves.list'),
		},
		create: op('navigation.create'),
		delete: op('navigation.delete'),
		get: op('navigation.get'),
		list: op('navigation.list'),
		revisions: {
			delete: op('navigation.revisions.delete'),
			get: op('navigation.revisions.get'),
			list: op('navigation.revisions.list'),
		},
		update: op('navigation.update'),
	},
	oembed: {
		embed: op('oembed.embed'),
		proxy: op('oembed.proxy'),
	},
	pages: {
		autosaves: {
			create: op('pages.autosaves.create'),
			get: op('pages.autosaves.get'),
			list: op('pages.autosaves.list'),
		},
		create: op('pages.create'),
		delete: op('pages.delete'),
		get: op('pages.get'),
		list: op('pages.list'),
		revisions: {
			delete: op('pages.revisions.delete'),
			get: op('pages.revisions.get'),
			list: op('pages.revisions.list'),
		},
		update: op('pages.update'),
	},
	patternCategories: {
		create: op('patternCategories.create'),
		delete: op('patternCategories.delete'),
		get: op('patternCategories.get'),
		list: op('patternCategories.list'),
		update: op('patternCategories.update'),
	},
	patternDirectory: {
		search: op('patternDirectory.search'),
	},
	plugins: {
		delete: op('plugins.delete'),
		get: op('plugins.get'),
		install: op('plugins.install'),
		list: op('plugins.list'),
		update: op('plugins.update'),
	},
	posts: {
		autosaves: {
			create: op('posts.autosaves.create'),
			get: op('posts.autosaves.get'),
			list: op('posts.autosaves.list'),
		},
		create: op('posts.create'),
		delete: op('posts.delete'),
		get: op('posts.get'),
		list: op('posts.list'),
		revisions: {
			delete: op('posts.revisions.delete'),
			get: op('posts.revisions.get'),
			list: op('posts.revisions.list'),
		},
		update: op('posts.update'),
	},
	rest: {
		get: op('rest.get'),
		send: op('rest.send'),
	},
	search: {
		query: op('search.query'),
	},
	settings: {
		get: op('settings.get'),
		update: op('settings.update'),
	},
	sidebars: {
		get: op('sidebars.get'),
		list: op('sidebars.list'),
		update: op('sidebars.update'),
	},
	site: {
		index: op('site.index'),
	},
	siteHealth: {
		authorizationHeader: op('siteHealth.authorizationHeader'),
		backgroundUpdates: op('siteHealth.backgroundUpdates'),
		directorySizes: op('siteHealth.directorySizes'),
		dotorgCommunication: op('siteHealth.dotorgCommunication'),
		httpsStatus: op('siteHealth.httpsStatus'),
		loopbackRequests: op('siteHealth.loopbackRequests'),
		pageCache: op('siteHealth.pageCache'),
	},
	statuses: {
		get: op('statuses.get'),
		list: op('statuses.list'),
	},
	tags: {
		create: op('tags.create'),
		delete: op('tags.delete'),
		get: op('tags.get'),
		list: op('tags.list'),
		update: op('tags.update'),
	},
	taxonomies: {
		get: op('taxonomies.get'),
		list: op('taxonomies.list'),
	},
	templateParts: {
		autosaves: {
			create: op('templateParts.autosaves.create'),
			get: op('templateParts.autosaves.get'),
			list: op('templateParts.autosaves.list'),
		},
		create: op('templateParts.create'),
		delete: op('templateParts.delete'),
		get: op('templateParts.get'),
		list: op('templateParts.list'),
		lookup: op('templateParts.lookup'),
		revisions: {
			delete: op('templateParts.revisions.delete'),
			get: op('templateParts.revisions.get'),
			list: op('templateParts.revisions.list'),
		},
		update: op('templateParts.update'),
	},
	templates: {
		autosaves: {
			create: op('templates.autosaves.create'),
			get: op('templates.autosaves.get'),
			list: op('templates.autosaves.list'),
		},
		create: op('templates.create'),
		delete: op('templates.delete'),
		get: op('templates.get'),
		list: op('templates.list'),
		lookup: op('templates.lookup'),
		revisions: {
			delete: op('templates.revisions.delete'),
			get: op('templates.revisions.get'),
			list: op('templates.revisions.list'),
		},
		update: op('templates.update'),
	},
	themes: {
		get: op('themes.get'),
		list: op('themes.list'),
	},
	types: {
		get: op('types.get'),
		list: op('types.list'),
	},
	users: {
		applicationPasswords: {
			create: op('users.applicationPasswords.create'),
			delete: op('users.applicationPasswords.delete'),
			deleteAll: op('users.applicationPasswords.deleteAll'),
			get: op('users.applicationPasswords.get'),
			introspect: op('users.applicationPasswords.introspect'),
			list: op('users.applicationPasswords.list'),
			update: op('users.applicationPasswords.update'),
		},
		create: op('users.create'),
		delete: op('users.delete'),
		deleteMe: op('users.deleteMe'),
		get: op('users.get'),
		list: op('users.list'),
		me: op('users.me'),
		update: op('users.update'),
		updateMe: op('users.updateMe'),
	},
	viewConfig: {
		get: op('viewConfig.get'),
	},
	widgetTypes: {
		encode: op('widgetTypes.encode'),
		get: op('widgetTypes.get'),
		list: op('widgetTypes.list'),
		render: op('widgetTypes.render'),
	},
	widgets: {
		create: op('widgets.create'),
		delete: op('widgets.delete'),
		get: op('widgets.get'),
		list: op('widgets.list'),
		update: op('widgets.update'),
	},
} as const;

export const wordpressEndpointSchemas = {
	'abilities.categories.get': wordpressSchemaEntry('abilities.categories.get'),
	'abilities.categories.list': wordpressSchemaEntry(
		'abilities.categories.list',
	),
	'abilities.get': wordpressSchemaEntry('abilities.get'),
	'abilities.list': wordpressSchemaEntry('abilities.list'),
	'abilities.run': wordpressSchemaEntry('abilities.run'),
	'abilities.runDestructive': wordpressSchemaEntry('abilities.runDestructive'),
	'abilities.runReadonly': wordpressSchemaEntry('abilities.runReadonly'),
	'batch.run': wordpressSchemaEntry('batch.run'),
	'blockDirectory.search': wordpressSchemaEntry('blockDirectory.search'),
	'blockEditor.export': wordpressSchemaEntry('blockEditor.export'),
	'blockEditor.navigationFallback': wordpressSchemaEntry(
		'blockEditor.navigationFallback',
	),
	'blockEditor.urlDetails': wordpressSchemaEntry('blockEditor.urlDetails'),
	'blockPatterns.categories': wordpressSchemaEntry('blockPatterns.categories'),
	'blockPatterns.list': wordpressSchemaEntry('blockPatterns.list'),
	'blockRenderer.render': wordpressSchemaEntry('blockRenderer.render'),
	'blockTypes.get': wordpressSchemaEntry('blockTypes.get'),
	'blockTypes.list': wordpressSchemaEntry('blockTypes.list'),
	'blockTypes.listByNamespace': wordpressSchemaEntry(
		'blockTypes.listByNamespace',
	),
	'blocks.autosaves.create': wordpressSchemaEntry('blocks.autosaves.create'),
	'blocks.autosaves.get': wordpressSchemaEntry('blocks.autosaves.get'),
	'blocks.autosaves.list': wordpressSchemaEntry('blocks.autosaves.list'),
	'blocks.create': wordpressSchemaEntry('blocks.create'),
	'blocks.delete': wordpressSchemaEntry('blocks.delete'),
	'blocks.get': wordpressSchemaEntry('blocks.get'),
	'blocks.list': wordpressSchemaEntry('blocks.list'),
	'blocks.revisions.delete': wordpressSchemaEntry('blocks.revisions.delete'),
	'blocks.revisions.get': wordpressSchemaEntry('blocks.revisions.get'),
	'blocks.revisions.list': wordpressSchemaEntry('blocks.revisions.list'),
	'blocks.update': wordpressSchemaEntry('blocks.update'),
	'categories.create': wordpressSchemaEntry('categories.create'),
	'categories.delete': wordpressSchemaEntry('categories.delete'),
	'categories.get': wordpressSchemaEntry('categories.get'),
	'categories.list': wordpressSchemaEntry('categories.list'),
	'categories.update': wordpressSchemaEntry('categories.update'),
	'comments.create': wordpressSchemaEntry('comments.create'),
	'comments.delete': wordpressSchemaEntry('comments.delete'),
	'comments.get': wordpressSchemaEntry('comments.get'),
	'comments.list': wordpressSchemaEntry('comments.list'),
	'comments.update': wordpressSchemaEntry('comments.update'),
	'fontCollections.get': wordpressSchemaEntry('fontCollections.get'),
	'fontCollections.list': wordpressSchemaEntry('fontCollections.list'),
	'fontFamilies.create': wordpressSchemaEntry('fontFamilies.create'),
	'fontFamilies.delete': wordpressSchemaEntry('fontFamilies.delete'),
	'fontFamilies.fontFaces.create': wordpressSchemaEntry(
		'fontFamilies.fontFaces.create',
	),
	'fontFamilies.fontFaces.delete': wordpressSchemaEntry(
		'fontFamilies.fontFaces.delete',
	),
	'fontFamilies.fontFaces.get': wordpressSchemaEntry(
		'fontFamilies.fontFaces.get',
	),
	'fontFamilies.fontFaces.list': wordpressSchemaEntry(
		'fontFamilies.fontFaces.list',
	),
	'fontFamilies.get': wordpressSchemaEntry('fontFamilies.get'),
	'fontFamilies.list': wordpressSchemaEntry('fontFamilies.list'),
	'fontFamilies.update': wordpressSchemaEntry('fontFamilies.update'),
	'globalStyles.get': wordpressSchemaEntry('globalStyles.get'),
	'globalStyles.revisions.get': wordpressSchemaEntry(
		'globalStyles.revisions.get',
	),
	'globalStyles.revisions.list': wordpressSchemaEntry(
		'globalStyles.revisions.list',
	),
	'globalStyles.theme': wordpressSchemaEntry('globalStyles.theme'),
	'globalStyles.themeVariations': wordpressSchemaEntry(
		'globalStyles.themeVariations',
	),
	'globalStyles.update': wordpressSchemaEntry('globalStyles.update'),
	'iconCollections.get': wordpressSchemaEntry('iconCollections.get'),
	'iconCollections.list': wordpressSchemaEntry('iconCollections.list'),
	'icons.get': wordpressSchemaEntry('icons.get'),
	'icons.list': wordpressSchemaEntry('icons.list'),
	'icons.listByCollection': wordpressSchemaEntry('icons.listByCollection'),
	'media.create': wordpressSchemaEntry('media.create'),
	'media.delete': wordpressSchemaEntry('media.delete'),
	'media.edit': wordpressSchemaEntry('media.edit'),
	'media.finalize': wordpressSchemaEntry('media.finalize'),
	'media.get': wordpressSchemaEntry('media.get'),
	'media.list': wordpressSchemaEntry('media.list'),
	'media.postProcess': wordpressSchemaEntry('media.postProcess'),
	'media.sideload': wordpressSchemaEntry('media.sideload'),
	'media.update': wordpressSchemaEntry('media.update'),
	'menuItems.autosaves.create': wordpressSchemaEntry(
		'menuItems.autosaves.create',
	),
	'menuItems.autosaves.get': wordpressSchemaEntry('menuItems.autosaves.get'),
	'menuItems.autosaves.list': wordpressSchemaEntry('menuItems.autosaves.list'),
	'menuItems.create': wordpressSchemaEntry('menuItems.create'),
	'menuItems.delete': wordpressSchemaEntry('menuItems.delete'),
	'menuItems.get': wordpressSchemaEntry('menuItems.get'),
	'menuItems.list': wordpressSchemaEntry('menuItems.list'),
	'menuItems.update': wordpressSchemaEntry('menuItems.update'),
	'menuLocations.get': wordpressSchemaEntry('menuLocations.get'),
	'menuLocations.list': wordpressSchemaEntry('menuLocations.list'),
	'menus.create': wordpressSchemaEntry('menus.create'),
	'menus.delete': wordpressSchemaEntry('menus.delete'),
	'menus.get': wordpressSchemaEntry('menus.get'),
	'menus.list': wordpressSchemaEntry('menus.list'),
	'menus.update': wordpressSchemaEntry('menus.update'),
	'navigation.autosaves.create': wordpressSchemaEntry(
		'navigation.autosaves.create',
	),
	'navigation.autosaves.get': wordpressSchemaEntry('navigation.autosaves.get'),
	'navigation.autosaves.list': wordpressSchemaEntry(
		'navigation.autosaves.list',
	),
	'navigation.create': wordpressSchemaEntry('navigation.create'),
	'navigation.delete': wordpressSchemaEntry('navigation.delete'),
	'navigation.get': wordpressSchemaEntry('navigation.get'),
	'navigation.list': wordpressSchemaEntry('navigation.list'),
	'navigation.revisions.delete': wordpressSchemaEntry(
		'navigation.revisions.delete',
	),
	'navigation.revisions.get': wordpressSchemaEntry('navigation.revisions.get'),
	'navigation.revisions.list': wordpressSchemaEntry(
		'navigation.revisions.list',
	),
	'navigation.update': wordpressSchemaEntry('navigation.update'),
	'oembed.embed': wordpressSchemaEntry('oembed.embed'),
	'oembed.proxy': wordpressSchemaEntry('oembed.proxy'),
	'pages.autosaves.create': wordpressSchemaEntry('pages.autosaves.create'),
	'pages.autosaves.get': wordpressSchemaEntry('pages.autosaves.get'),
	'pages.autosaves.list': wordpressSchemaEntry('pages.autosaves.list'),
	'pages.create': wordpressSchemaEntry('pages.create'),
	'pages.delete': wordpressSchemaEntry('pages.delete'),
	'pages.get': wordpressSchemaEntry('pages.get'),
	'pages.list': wordpressSchemaEntry('pages.list'),
	'pages.revisions.delete': wordpressSchemaEntry('pages.revisions.delete'),
	'pages.revisions.get': wordpressSchemaEntry('pages.revisions.get'),
	'pages.revisions.list': wordpressSchemaEntry('pages.revisions.list'),
	'pages.update': wordpressSchemaEntry('pages.update'),
	'patternCategories.create': wordpressSchemaEntry('patternCategories.create'),
	'patternCategories.delete': wordpressSchemaEntry('patternCategories.delete'),
	'patternCategories.get': wordpressSchemaEntry('patternCategories.get'),
	'patternCategories.list': wordpressSchemaEntry('patternCategories.list'),
	'patternCategories.update': wordpressSchemaEntry('patternCategories.update'),
	'patternDirectory.search': wordpressSchemaEntry('patternDirectory.search'),
	'plugins.delete': wordpressSchemaEntry('plugins.delete'),
	'plugins.get': wordpressSchemaEntry('plugins.get'),
	'plugins.install': wordpressSchemaEntry('plugins.install'),
	'plugins.list': wordpressSchemaEntry('plugins.list'),
	'plugins.update': wordpressSchemaEntry('plugins.update'),
	'posts.autosaves.create': wordpressSchemaEntry('posts.autosaves.create'),
	'posts.autosaves.get': wordpressSchemaEntry('posts.autosaves.get'),
	'posts.autosaves.list': wordpressSchemaEntry('posts.autosaves.list'),
	'posts.create': wordpressSchemaEntry('posts.create'),
	'posts.delete': wordpressSchemaEntry('posts.delete'),
	'posts.get': wordpressSchemaEntry('posts.get'),
	'posts.list': wordpressSchemaEntry('posts.list'),
	'posts.revisions.delete': wordpressSchemaEntry('posts.revisions.delete'),
	'posts.revisions.get': wordpressSchemaEntry('posts.revisions.get'),
	'posts.revisions.list': wordpressSchemaEntry('posts.revisions.list'),
	'posts.update': wordpressSchemaEntry('posts.update'),
	'rest.get': wordpressSchemaEntry('rest.get'),
	'rest.send': wordpressSchemaEntry('rest.send'),
	'search.query': wordpressSchemaEntry('search.query'),
	'settings.get': wordpressSchemaEntry('settings.get'),
	'settings.update': wordpressSchemaEntry('settings.update'),
	'sidebars.get': wordpressSchemaEntry('sidebars.get'),
	'sidebars.list': wordpressSchemaEntry('sidebars.list'),
	'sidebars.update': wordpressSchemaEntry('sidebars.update'),
	'site.index': wordpressSchemaEntry('site.index'),
	'siteHealth.authorizationHeader': wordpressSchemaEntry(
		'siteHealth.authorizationHeader',
	),
	'siteHealth.backgroundUpdates': wordpressSchemaEntry(
		'siteHealth.backgroundUpdates',
	),
	'siteHealth.directorySizes': wordpressSchemaEntry(
		'siteHealth.directorySizes',
	),
	'siteHealth.dotorgCommunication': wordpressSchemaEntry(
		'siteHealth.dotorgCommunication',
	),
	'siteHealth.httpsStatus': wordpressSchemaEntry('siteHealth.httpsStatus'),
	'siteHealth.loopbackRequests': wordpressSchemaEntry(
		'siteHealth.loopbackRequests',
	),
	'siteHealth.pageCache': wordpressSchemaEntry('siteHealth.pageCache'),
	'statuses.get': wordpressSchemaEntry('statuses.get'),
	'statuses.list': wordpressSchemaEntry('statuses.list'),
	'tags.create': wordpressSchemaEntry('tags.create'),
	'tags.delete': wordpressSchemaEntry('tags.delete'),
	'tags.get': wordpressSchemaEntry('tags.get'),
	'tags.list': wordpressSchemaEntry('tags.list'),
	'tags.update': wordpressSchemaEntry('tags.update'),
	'taxonomies.get': wordpressSchemaEntry('taxonomies.get'),
	'taxonomies.list': wordpressSchemaEntry('taxonomies.list'),
	'templateParts.autosaves.create': wordpressSchemaEntry(
		'templateParts.autosaves.create',
	),
	'templateParts.autosaves.get': wordpressSchemaEntry(
		'templateParts.autosaves.get',
	),
	'templateParts.autosaves.list': wordpressSchemaEntry(
		'templateParts.autosaves.list',
	),
	'templateParts.create': wordpressSchemaEntry('templateParts.create'),
	'templateParts.delete': wordpressSchemaEntry('templateParts.delete'),
	'templateParts.get': wordpressSchemaEntry('templateParts.get'),
	'templateParts.list': wordpressSchemaEntry('templateParts.list'),
	'templateParts.lookup': wordpressSchemaEntry('templateParts.lookup'),
	'templateParts.revisions.delete': wordpressSchemaEntry(
		'templateParts.revisions.delete',
	),
	'templateParts.revisions.get': wordpressSchemaEntry(
		'templateParts.revisions.get',
	),
	'templateParts.revisions.list': wordpressSchemaEntry(
		'templateParts.revisions.list',
	),
	'templateParts.update': wordpressSchemaEntry('templateParts.update'),
	'templates.autosaves.create': wordpressSchemaEntry(
		'templates.autosaves.create',
	),
	'templates.autosaves.get': wordpressSchemaEntry('templates.autosaves.get'),
	'templates.autosaves.list': wordpressSchemaEntry('templates.autosaves.list'),
	'templates.create': wordpressSchemaEntry('templates.create'),
	'templates.delete': wordpressSchemaEntry('templates.delete'),
	'templates.get': wordpressSchemaEntry('templates.get'),
	'templates.list': wordpressSchemaEntry('templates.list'),
	'templates.lookup': wordpressSchemaEntry('templates.lookup'),
	'templates.revisions.delete': wordpressSchemaEntry(
		'templates.revisions.delete',
	),
	'templates.revisions.get': wordpressSchemaEntry('templates.revisions.get'),
	'templates.revisions.list': wordpressSchemaEntry('templates.revisions.list'),
	'templates.update': wordpressSchemaEntry('templates.update'),
	'themes.get': wordpressSchemaEntry('themes.get'),
	'themes.list': wordpressSchemaEntry('themes.list'),
	'types.get': wordpressSchemaEntry('types.get'),
	'types.list': wordpressSchemaEntry('types.list'),
	'users.applicationPasswords.create': wordpressSchemaEntry(
		'users.applicationPasswords.create',
	),
	'users.applicationPasswords.delete': wordpressSchemaEntry(
		'users.applicationPasswords.delete',
	),
	'users.applicationPasswords.deleteAll': wordpressSchemaEntry(
		'users.applicationPasswords.deleteAll',
	),
	'users.applicationPasswords.get': wordpressSchemaEntry(
		'users.applicationPasswords.get',
	),
	'users.applicationPasswords.introspect': wordpressSchemaEntry(
		'users.applicationPasswords.introspect',
	),
	'users.applicationPasswords.list': wordpressSchemaEntry(
		'users.applicationPasswords.list',
	),
	'users.applicationPasswords.update': wordpressSchemaEntry(
		'users.applicationPasswords.update',
	),
	'users.create': wordpressSchemaEntry('users.create'),
	'users.delete': wordpressSchemaEntry('users.delete'),
	'users.deleteMe': wordpressSchemaEntry('users.deleteMe'),
	'users.get': wordpressSchemaEntry('users.get'),
	'users.list': wordpressSchemaEntry('users.list'),
	'users.me': wordpressSchemaEntry('users.me'),
	'users.update': wordpressSchemaEntry('users.update'),
	'users.updateMe': wordpressSchemaEntry('users.updateMe'),
	'viewConfig.get': wordpressSchemaEntry('viewConfig.get'),
	'widgetTypes.encode': wordpressSchemaEntry('widgetTypes.encode'),
	'widgetTypes.get': wordpressSchemaEntry('widgetTypes.get'),
	'widgetTypes.list': wordpressSchemaEntry('widgetTypes.list'),
	'widgetTypes.render': wordpressSchemaEntry('widgetTypes.render'),
	'widgets.create': wordpressSchemaEntry('widgets.create'),
	'widgets.delete': wordpressSchemaEntry('widgets.delete'),
	'widgets.get': wordpressSchemaEntry('widgets.get'),
	'widgets.list': wordpressSchemaEntry('widgets.list'),
	'widgets.update': wordpressSchemaEntry('widgets.update'),
} satisfies RequiredPluginEndpointSchemas<typeof wordpressEndpointsNested>;

export const wordpressEndpointMeta = {
	'abilities.categories.get': {
		riskLevel: 'read',
		description: 'Get one ability category',
	},
	'abilities.categories.list': {
		riskLevel: 'read',
		description: 'List the ability categories',
	},
	'abilities.get': {
		riskLevel: 'read',
		description: 'Get one registered ability with its input and output schema',
	},
	'abilities.list': {
		riskLevel: 'read',
		description:
			'List the abilities registered on the site (the Abilities API): name, label, input and output schema and annotations',
	},
	'abilities.run': {
		riskLevel: 'destructive',
		description:
			'Run an ability that changes something (sent as POST with its input); what it does depends on the ability',
	},
	'abilities.runDestructive': {
		riskLevel: 'destructive',
		description: 'Run an ability marked destructive (sent as DELETE)',
	},
	'abilities.runReadonly': {
		riskLevel: 'read',
		description: 'Run an ability marked readonly (sent as GET with its input)',
	},
	'batch.run': {
		riskLevel: 'destructive',
		description:
			'Run up to 25 write requests (POST, PUT, PATCH, DELETE on routes that allow batching) in one call; with validation require-all-validate nothing runs unless every request validates',
	},
	'blockDirectory.search': {
		riskLevel: 'read',
		description:
			'Search the WordPress.org block directory for installable block plugins',
	},
	'blockEditor.export': {
		riskLevel: 'read',
		description:
			"Export the active block theme with the site's customizations as a zip (returned as a file)",
	},
	'blockEditor.navigationFallback': {
		riskLevel: 'write',
		description:
			'Get (or create) the navigation menu the editor falls back to when a Navigation block has none',
	},
	'blockEditor.urlDetails': {
		riskLevel: 'read',
		description:
			"Fetch a URL's title, description, icon and image, as the editor's link previews do",
	},
	'blockPatterns.categories': {
		riskLevel: 'read',
		description: 'List the registered block pattern categories',
	},
	'blockPatterns.list': {
		riskLevel: 'read',
		description:
			'List the block patterns registered on the site (theme, core and plugin patterns)',
	},
	'blockRenderer.render': {
		riskLevel: 'read',
		description:
			'Render a dynamic block (a server-side rendered block such as core/latest-posts) with attributes to HTML',
	},
	'blockTypes.get': {
		riskLevel: 'read',
		description: 'Get one block type',
	},
	'blockTypes.list': {
		riskLevel: 'read',
		description: 'List block types',
	},
	'blockTypes.listByNamespace': {
		riskLevel: 'read',
		description:
			'List the registered block types in one namespace (for example `core`)',
	},
	'blocks.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a synced pattern (reusable block)',
	},
	'blocks.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a synced pattern (reusable block)',
	},
	'blocks.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a synced pattern (reusable block)',
	},
	'blocks.create': {
		riskLevel: 'write',
		description: 'Create a synced pattern (reusable block)',
	},
	'blocks.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a synced pattern (reusable block); without force true it goes to the trash',
	},
	'blocks.get': {
		riskLevel: 'read',
		description: 'Get one synced pattern (reusable block)',
	},
	'blocks.list': {
		riskLevel: 'read',
		description:
			'List synced patterns (reusable blocks), one page at a time, with search and filters',
	},
	'blocks.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'blocks.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a synced pattern (reusable block)',
	},
	'blocks.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a synced pattern (reusable block), one page at a time, with search and filters',
	},
	'blocks.update': {
		riskLevel: 'write',
		description:
			'Update a synced pattern (reusable block): only the fields you pass change',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a category',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a category; WordPress needs force true for this type, which deletes it permanently',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get one category',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List categories, one page at a time, with search and filters',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Update a category: only the fields you pass change',
	},
	'comments.create': {
		riskLevel: 'write',
		description: 'Create a comment',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description: 'Delete a comment; without force true it goes to the trash',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Get one comment',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List comments, one page at a time, with search and filters',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Update a comment: only the fields you pass change',
	},
	'fontCollections.get': {
		riskLevel: 'read',
		description: 'Get one font collection',
	},
	'fontCollections.list': {
		riskLevel: 'read',
		description: 'List font collections, one page at a time',
	},
	'fontFamilies.create': {
		riskLevel: 'write',
		description: 'Create a font family',
	},
	'fontFamilies.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a font family; WordPress needs force true for this type, which deletes it permanently',
	},
	'fontFamilies.fontFaces.create': {
		riskLevel: 'write',
		description: 'Create a font face for a font family',
	},
	'fontFamilies.fontFaces.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a font face; WordPress needs force true for this type, which deletes it permanently',
	},
	'fontFamilies.fontFaces.get': {
		riskLevel: 'read',
		description: 'Get one font face of a font family',
	},
	'fontFamilies.fontFaces.list': {
		riskLevel: 'read',
		description: 'List the font faces of a font family, one page at a time',
	},
	'fontFamilies.get': {
		riskLevel: 'read',
		description: 'Get one font family',
	},
	'fontFamilies.list': {
		riskLevel: 'read',
		description: 'List font families, one page at a time',
	},
	'fontFamilies.update': {
		riskLevel: 'write',
		description: 'Update a font family: only the fields you pass change',
	},
	'globalStyles.get': {
		riskLevel: 'read',
		description: 'Get one global styles record',
	},
	'globalStyles.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a global styles record',
	},
	'globalStyles.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a global styles record, one page at a time',
	},
	'globalStyles.theme': {
		riskLevel: 'read',
		description:
			"Get the active theme's base global styles (theme.json settings and styles)",
	},
	'globalStyles.themeVariations': {
		riskLevel: 'read',
		description: "List a theme's style variations",
	},
	'globalStyles.update': {
		riskLevel: 'write',
		description:
			'Update a global styles record: only the fields you pass change',
	},
	'iconCollections.get': {
		riskLevel: 'read',
		description: 'Get one icon collection',
	},
	'iconCollections.list': {
		riskLevel: 'read',
		description:
			'List icon collections, one page at a time, with search and filters',
	},
	'icons.get': {
		riskLevel: 'read',
		description: 'Get one icon',
	},
	'icons.list': {
		riskLevel: 'read',
		description: 'List icons, one page at a time, with search and filters',
	},
	'icons.listByCollection': {
		riskLevel: 'read',
		description: 'List the icons in one icon collection',
	},
	'media.create': {
		riskLevel: 'write',
		description:
			'Upload a file to the media library (image, PDF, audio, video) with optional title, caption, alt text and the post it belongs to',
	},
	'media.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a media item; WordPress needs force true for this type, which deletes it permanently',
	},
	'media.edit': {
		riskLevel: 'write',
		description:
			'Crop, rotate or flip an image attachment; WordPress saves the result as a new attachment',
	},
	'media.finalize': {
		riskLevel: 'write',
		description:
			"Finish an attachment after its client-side image processing: WordPress writes the attachment's metadata",
	},
	'media.get': {
		riskLevel: 'read',
		description: 'Get one media item',
	},
	'media.list': {
		riskLevel: 'read',
		description:
			'List media items, one page at a time, with search and filters',
	},
	'media.postProcess': {
		riskLevel: 'write',
		description:
			'Run server-side image processing (sub-size generation) for an uploaded attachment that is waiting for it',
	},
	'media.sideload': {
		riskLevel: 'write',
		description:
			"Add a file as an extra image size of an existing attachment (the block editor's client-side image processing)",
	},
	'media.update': {
		riskLevel: 'write',
		description: 'Update a media item: only the fields you pass change',
	},
	'menuItems.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a menu item',
	},
	'menuItems.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a menu item',
	},
	'menuItems.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a menu item',
	},
	'menuItems.create': {
		riskLevel: 'write',
		description: 'Create a menu item',
	},
	'menuItems.delete': {
		riskLevel: 'destructive',
		description: 'Delete a menu item; without force true it goes to the trash',
	},
	'menuItems.get': {
		riskLevel: 'read',
		description: 'Get one menu item',
	},
	'menuItems.list': {
		riskLevel: 'read',
		description: 'List menu items, one page at a time, with search and filters',
	},
	'menuItems.update': {
		riskLevel: 'write',
		description: 'Update a menu item: only the fields you pass change',
	},
	'menuLocations.get': {
		riskLevel: 'read',
		description: 'Get one menu location',
	},
	'menuLocations.list': {
		riskLevel: 'read',
		description: 'List menu locations',
	},
	'menus.create': {
		riskLevel: 'write',
		description: 'Create a classic menu',
	},
	'menus.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a classic menu; WordPress needs force true for this type, which deletes it permanently',
	},
	'menus.get': {
		riskLevel: 'read',
		description: 'Get one classic menu',
	},
	'menus.list': {
		riskLevel: 'read',
		description:
			'List classic menus, one page at a time, with search and filters',
	},
	'menus.update': {
		riskLevel: 'write',
		description: 'Update a classic menu: only the fields you pass change',
	},
	'navigation.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a navigation menu',
	},
	'navigation.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a navigation menu',
	},
	'navigation.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a navigation menu',
	},
	'navigation.create': {
		riskLevel: 'write',
		description: 'Create a navigation menu',
	},
	'navigation.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a navigation menu; without force true it goes to the trash',
	},
	'navigation.get': {
		riskLevel: 'read',
		description: 'Get one navigation menu',
	},
	'navigation.list': {
		riskLevel: 'read',
		description:
			'List navigation menus, one page at a time, with search and filters',
	},
	'navigation.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'navigation.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a navigation menu',
	},
	'navigation.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a navigation menu, one page at a time, with search and filters',
	},
	'navigation.update': {
		riskLevel: 'write',
		description: 'Update a navigation menu: only the fields you pass change',
	},
	'oembed.embed': {
		riskLevel: 'read',
		description:
			'Get the oEmbed data (title, author, HTML embed code) for a URL on this site',
	},
	'oembed.proxy': {
		riskLevel: 'read',
		description:
			'Get oEmbed data for a URL on another site (YouTube, X, Vimeo ...) through the site, as the block editor does',
	},
	'pages.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a page',
	},
	'pages.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a page',
	},
	'pages.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a page',
	},
	'pages.create': {
		riskLevel: 'write',
		description: 'Create a page',
	},
	'pages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a page; without force true it goes to the trash',
	},
	'pages.get': {
		riskLevel: 'read',
		description: 'Get one page',
	},
	'pages.list': {
		riskLevel: 'read',
		description: 'List pages, one page at a time, with search and filters',
	},
	'pages.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'pages.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a page',
	},
	'pages.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a page, one page at a time, with search and filters',
	},
	'pages.update': {
		riskLevel: 'write',
		description: 'Update a page: only the fields you pass change',
	},
	'patternCategories.create': {
		riskLevel: 'write',
		description: 'Create a pattern category',
	},
	'patternCategories.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a pattern category; WordPress needs force true for this type, which deletes it permanently',
	},
	'patternCategories.get': {
		riskLevel: 'read',
		description: 'Get one pattern category',
	},
	'patternCategories.list': {
		riskLevel: 'read',
		description:
			'List pattern categories, one page at a time, with search and filters',
	},
	'patternCategories.update': {
		riskLevel: 'write',
		description: 'Update a pattern category: only the fields you pass change',
	},
	'patternDirectory.search': {
		riskLevel: 'read',
		description: 'Search the WordPress.org pattern directory',
	},
	'plugins.delete': {
		riskLevel: 'destructive',
		description: "Delete an inactive plugin's files from the site",
	},
	'plugins.get': {
		riskLevel: 'read',
		description: 'Get one plugin',
	},
	'plugins.install': {
		riskLevel: 'destructive',
		description:
			'Install a plugin from the WordPress.org directory by its slug, optionally activating it (runs third-party code on the site)',
	},
	'plugins.list': {
		riskLevel: 'read',
		description: 'List plugins',
	},
	'plugins.update': {
		riskLevel: 'destructive',
		description:
			'Activate or deactivate an installed plugin (status active, inactive or network-active)',
	},
	'posts.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a post',
	},
	'posts.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a post',
	},
	'posts.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a post',
	},
	'posts.create': {
		riskLevel: 'write',
		description: 'Create a post',
	},
	'posts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a post; without force true it goes to the trash',
	},
	'posts.get': {
		riskLevel: 'read',
		description: 'Get one post',
	},
	'posts.list': {
		riskLevel: 'read',
		description: 'List posts, one page at a time, with search and filters',
	},
	'posts.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'posts.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a post',
	},
	'posts.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a post, one page at a time, with search and filters',
	},
	'posts.update': {
		riskLevel: 'write',
		description: 'Update a post: only the fields you pass change',
	},
	'rest.get': {
		riskLevel: 'read',
		description:
			"GET any route on the site's REST API, such as a custom post type (`wp/v2/book`) or another plugin's namespace (`yoast/v1/...`, `acf/v3/...`); returns the JSON as is",
	},
	'rest.send': {
		riskLevel: 'destructive',
		description:
			"POST, PUT, PATCH or DELETE any route on the site's REST API (a custom post type, another plugin's route); returns the JSON as is",
	},
	'search.query': {
		riskLevel: 'read',
		description:
			'Search posts, terms or post formats across types, one page at a time: title, URL, type and subtype of each match',
	},
	'settings.get': {
		riskLevel: 'read',
		description:
			"Get the site's settings: title, tagline, URL, admin email, timezone, date and time formats, language, posts per page, default category, comment settings and more",
	},
	'settings.update': {
		riskLevel: 'write',
		description: 'Update site settings: only the settings you pass change',
	},
	'sidebars.get': {
		riskLevel: 'read',
		description: 'Get one widget area (sidebar)',
	},
	'sidebars.list': {
		riskLevel: 'read',
		description: 'List widget areas (sidebars)',
	},
	'sidebars.update': {
		riskLevel: 'write',
		description:
			'Update a widget area (sidebar): only the fields you pass change',
	},
	'site.index': {
		riskLevel: 'read',
		description:
			"Get the site's REST discovery document: name, description, URL, timezone, the namespaces it serves (wp/v2, plugins' own) and every route with its methods and args",
	},
	'siteHealth.authorizationHeader': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks the Authorization header reaches WordPress',
	},
	'siteHealth.backgroundUpdates': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks automatic background updates can work',
	},
	'siteHealth.directorySizes': {
		riskLevel: 'read',
		description:
			"Get the size of the site's directories (WordPress, themes, plugins, uploads, database); can be slow on big sites",
	},
	'siteHealth.dotorgCommunication': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks the site can reach WordPress.org',
	},
	'siteHealth.httpsStatus': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks the site is served over HTTPS',
	},
	'siteHealth.loopbackRequests': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks the site can make loopback requests to itself',
	},
	'siteHealth.pageCache': {
		riskLevel: 'read',
		description:
			'Run the Site Health test that checks for a page cache and its response times',
	},
	'statuses.get': {
		riskLevel: 'read',
		description: 'Get one post status',
	},
	'statuses.list': {
		riskLevel: 'read',
		description: 'List post statuses',
	},
	'tags.create': {
		riskLevel: 'write',
		description: 'Create a tag',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a tag; WordPress needs force true for this type, which deletes it permanently',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get one tag',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags, one page at a time, with search and filters',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update a tag: only the fields you pass change',
	},
	'taxonomies.get': {
		riskLevel: 'read',
		description: 'Get one taxonomy',
	},
	'taxonomies.list': {
		riskLevel: 'read',
		description: 'List taxonomies',
	},
	'templateParts.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a template part',
	},
	'templateParts.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a template part',
	},
	'templateParts.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a template part',
	},
	'templateParts.create': {
		riskLevel: 'write',
		description: 'Create a template part',
	},
	'templateParts.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a template part; without force true it goes to the trash',
	},
	'templateParts.get': {
		riskLevel: 'read',
		description: 'Get one template part',
	},
	'templateParts.list': {
		riskLevel: 'read',
		description: 'List template parts',
	},
	'templateParts.lookup': {
		riskLevel: 'read',
		description:
			'Find the fallback template part WordPress would use for a slug',
	},
	'templateParts.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'templateParts.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a template part',
	},
	'templateParts.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a template part, one page at a time, with search and filters',
	},
	'templateParts.update': {
		riskLevel: 'write',
		description: 'Update a template part: only the fields you pass change',
	},
	'templates.autosaves.create': {
		riskLevel: 'write',
		description: 'Create a autosave for a block template',
	},
	'templates.autosaves.get': {
		riskLevel: 'read',
		description: 'Get one autosave of a block template',
	},
	'templates.autosaves.list': {
		riskLevel: 'read',
		description: 'List the autosaves of a block template',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a block template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a block template; without force true it goes to the trash',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get one block template',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'List block templates',
	},
	'templates.lookup': {
		riskLevel: 'read',
		description:
			'Find the fallback template WordPress would use for a slug (for example `single-post`), when the theme has none of its own',
	},
	'templates.revisions.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a revision; WordPress needs force true for this type, which deletes it permanently',
	},
	'templates.revisions.get': {
		riskLevel: 'read',
		description: 'Get one revision of a block template',
	},
	'templates.revisions.list': {
		riskLevel: 'read',
		description:
			'List the revisions of a block template, one page at a time, with search and filters',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update a block template: only the fields you pass change',
	},
	'themes.get': {
		riskLevel: 'read',
		description: 'Get one theme',
	},
	'themes.list': {
		riskLevel: 'read',
		description: 'List themes',
	},
	'types.get': {
		riskLevel: 'read',
		description: 'Get one post type',
	},
	'types.list': {
		riskLevel: 'read',
		description: 'List post types',
	},
	'users.applicationPasswords.create': {
		riskLevel: 'destructive',
		description:
			"Create an application password for a user; the response's `password` is shown once and can act as that user",
	},
	'users.applicationPasswords.delete': {
		riskLevel: 'destructive',
		description: 'Delete a application password',
	},
	'users.applicationPasswords.deleteAll': {
		riskLevel: 'destructive',
		description:
			'Revoke every application password of a user, the one this call uses included',
	},
	'users.applicationPasswords.get': {
		riskLevel: 'read',
		description: 'Get one application password of a user',
	},
	'users.applicationPasswords.introspect': {
		riskLevel: 'read',
		description:
			'Get the application password this call is made with (name, uuid, last used)',
	},
	'users.applicationPasswords.list': {
		riskLevel: 'read',
		description: 'List the application passwords of a user',
	},
	'users.applicationPasswords.update': {
		riskLevel: 'write',
		description:
			'Update a application password: only the fields you pass change',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a user',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a user; WordPress needs force true for this type, which deletes it permanently',
	},
	'users.deleteMe': {
		riskLevel: 'destructive',
		description:
			"Delete the authenticated user's own account, reassigning their posts to another user (`reassign`, required with `force: true`)",
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get one user',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users, one page at a time, with search and filters',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Get the user the application password belongs to: name, roles and (with context edit) email and capabilities',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update a user: only the fields you pass change',
	},
	'users.updateMe': {
		riskLevel: 'write',
		description: "Update the authenticated user's own profile",
	},
	'viewConfig.get': {
		riskLevel: 'read',
		description:
			'Get the data views configuration the admin screens use for an entity',
	},
	'widgetTypes.encode': {
		riskLevel: 'read',
		description:
			"Encode a legacy widget's form data into the instance a widget block stores",
	},
	'widgetTypes.get': {
		riskLevel: 'read',
		description: 'Get one widget type',
	},
	'widgetTypes.list': {
		riskLevel: 'read',
		description: 'List widget types',
	},
	'widgetTypes.render': {
		riskLevel: 'read',
		description: 'Render a legacy widget instance to HTML',
	},
	'widgets.create': {
		riskLevel: 'write',
		description: 'Create a widget',
	},
	'widgets.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a widget; WordPress needs force true for this type, which deletes it permanently',
	},
	'widgets.get': {
		riskLevel: 'read',
		description: 'Get one widget',
	},
	'widgets.list': {
		riskLevel: 'read',
		description: 'List widgets',
	},
	'widgets.update': {
		riskLevel: 'write',
		description: 'Update a widget: only the fields you pass change',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof wordpressEndpointsNested
>;
