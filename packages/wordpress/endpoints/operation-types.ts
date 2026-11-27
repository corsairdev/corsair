// Generated from the WordPress REST index (GET /wp-json/?context=help on
// a wordpress:latest Docker site, WordPress 7.1.5, no plugins active, fetched 2026-11-27); wordpress-manifest.json is the same contract as JSON.
// Inputs are the route args (path, query and body fields) in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type WordpressJsonValue =
	| null
	| boolean
	| number
	| string
	| WordpressJsonValue[]
	| { [key: string]: WordpressJsonValue | undefined };

export const WORDPRESS_OPERATION_IDS = [
	'abilities.categories.get',
	'abilities.categories.list',
	'abilities.get',
	'abilities.list',
	'abilities.run',
	'abilities.runDestructive',
	'abilities.runReadonly',
	'batch.run',
	'blockDirectory.search',
	'blockEditor.export',
	'blockEditor.navigationFallback',
	'blockEditor.urlDetails',
	'blockPatterns.categories',
	'blockPatterns.list',
	'blockRenderer.render',
	'blockTypes.get',
	'blockTypes.list',
	'blockTypes.listByNamespace',
	'blocks.autosaves.create',
	'blocks.autosaves.get',
	'blocks.autosaves.list',
	'blocks.create',
	'blocks.delete',
	'blocks.get',
	'blocks.list',
	'blocks.revisions.delete',
	'blocks.revisions.get',
	'blocks.revisions.list',
	'blocks.update',
	'categories.create',
	'categories.delete',
	'categories.get',
	'categories.list',
	'categories.update',
	'comments.create',
	'comments.delete',
	'comments.get',
	'comments.list',
	'comments.update',
	'fontCollections.get',
	'fontCollections.list',
	'fontFamilies.create',
	'fontFamilies.delete',
	'fontFamilies.fontFaces.create',
	'fontFamilies.fontFaces.delete',
	'fontFamilies.fontFaces.get',
	'fontFamilies.fontFaces.list',
	'fontFamilies.get',
	'fontFamilies.list',
	'fontFamilies.update',
	'globalStyles.get',
	'globalStyles.revisions.get',
	'globalStyles.revisions.list',
	'globalStyles.theme',
	'globalStyles.themeVariations',
	'globalStyles.update',
	'iconCollections.get',
	'iconCollections.list',
	'icons.get',
	'icons.list',
	'icons.listByCollection',
	'media.create',
	'media.delete',
	'media.edit',
	'media.finalize',
	'media.get',
	'media.list',
	'media.postProcess',
	'media.sideload',
	'media.update',
	'menuItems.autosaves.create',
	'menuItems.autosaves.get',
	'menuItems.autosaves.list',
	'menuItems.create',
	'menuItems.delete',
	'menuItems.get',
	'menuItems.list',
	'menuItems.update',
	'menuLocations.get',
	'menuLocations.list',
	'menus.create',
	'menus.delete',
	'menus.get',
	'menus.list',
	'menus.update',
	'navigation.autosaves.create',
	'navigation.autosaves.get',
	'navigation.autosaves.list',
	'navigation.create',
	'navigation.delete',
	'navigation.get',
	'navigation.list',
	'navigation.revisions.delete',
	'navigation.revisions.get',
	'navigation.revisions.list',
	'navigation.update',
	'oembed.embed',
	'oembed.proxy',
	'pages.autosaves.create',
	'pages.autosaves.get',
	'pages.autosaves.list',
	'pages.create',
	'pages.delete',
	'pages.get',
	'pages.list',
	'pages.revisions.delete',
	'pages.revisions.get',
	'pages.revisions.list',
	'pages.update',
	'patternCategories.create',
	'patternCategories.delete',
	'patternCategories.get',
	'patternCategories.list',
	'patternCategories.update',
	'patternDirectory.search',
	'plugins.delete',
	'plugins.get',
	'plugins.install',
	'plugins.list',
	'plugins.update',
	'posts.autosaves.create',
	'posts.autosaves.get',
	'posts.autosaves.list',
	'posts.create',
	'posts.delete',
	'posts.get',
	'posts.list',
	'posts.revisions.delete',
	'posts.revisions.get',
	'posts.revisions.list',
	'posts.update',
	'rest.get',
	'rest.send',
	'search.query',
	'settings.get',
	'settings.update',
	'sidebars.get',
	'sidebars.list',
	'sidebars.update',
	'site.index',
	'siteHealth.authorizationHeader',
	'siteHealth.backgroundUpdates',
	'siteHealth.directorySizes',
	'siteHealth.dotorgCommunication',
	'siteHealth.httpsStatus',
	'siteHealth.loopbackRequests',
	'siteHealth.pageCache',
	'statuses.get',
	'statuses.list',
	'tags.create',
	'tags.delete',
	'tags.get',
	'tags.list',
	'tags.update',
	'taxonomies.get',
	'taxonomies.list',
	'templateParts.autosaves.create',
	'templateParts.autosaves.get',
	'templateParts.autosaves.list',
	'templateParts.create',
	'templateParts.delete',
	'templateParts.get',
	'templateParts.list',
	'templateParts.lookup',
	'templateParts.revisions.delete',
	'templateParts.revisions.get',
	'templateParts.revisions.list',
	'templateParts.update',
	'templates.autosaves.create',
	'templates.autosaves.get',
	'templates.autosaves.list',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.lookup',
	'templates.revisions.delete',
	'templates.revisions.get',
	'templates.revisions.list',
	'templates.update',
	'themes.get',
	'themes.list',
	'types.get',
	'types.list',
	'users.applicationPasswords.create',
	'users.applicationPasswords.delete',
	'users.applicationPasswords.deleteAll',
	'users.applicationPasswords.get',
	'users.applicationPasswords.introspect',
	'users.applicationPasswords.list',
	'users.applicationPasswords.update',
	'users.create',
	'users.delete',
	'users.deleteMe',
	'users.get',
	'users.list',
	'users.me',
	'users.update',
	'users.updateMe',
	'viewConfig.get',
	'widgetTypes.encode',
	'widgetTypes.get',
	'widgetTypes.list',
	'widgetTypes.render',
	'widgets.create',
	'widgets.delete',
	'widgets.get',
	'widgets.list',
	'widgets.update',
] as const;

export type WordpressOperationId = (typeof WORDPRESS_OPERATION_IDS)[number];

export type WordpressAbility = {
	/** Unique identifier for the ability. */
	name?: string | null;
	/** Display label for the ability. */
	label?: string | null;
	/** Description of the ability. */
	description?: string | null;
	/** Ability category this ability belongs to. */
	category?: string | null;
	/** JSON Schema for the ability input. */
	input_schema?: Record<string, WordpressJsonValue> | null;
	/** JSON Schema for the ability output. */
	output_schema?: Record<string, WordpressJsonValue> | null;
	/** Meta information about the ability. */
	meta?: {
		/** Behavioral annotations for the ability. */
		annotations?: {
			/** Whether the ability does not modify its environment. */
			readonly?: boolean | null;
			/** Whether the ability may perform destructive updates to its environment. */
			destructive?: boolean | null;
			/** Whether repeated calls with the same arguments have no additional effect. */
			idempotent?: boolean | null;
			[key: string]: unknown;
		} | null;
		/** Whether the ability is meant to be available to clients such as the REST API, MCP, or AI agents. Defaults to false, but individual channel settings such as show_in_rest can override it. */
		public?: boolean | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressAbilityCategory = {
	/** Unique identifier for the ability category. */
	slug?: string | null;
	/** Display label for the category. */
	label?: string | null;
	/** Description of the category. */
	description?: string | null;
	/** Meta information about the category. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressApplicationPassword = {
	/** The unique identifier for the application password. */
	uuid?: string | null;
	/** A UUID provided by the application to uniquely identify it. It is recommended to use an UUID v5 with the URL or DNS namespace. */
	app_id?: string | null;
	/** The name of the application password. */
	name?: string | null;
	/** The generated password. Only available after adding an application. */
	password?: string | null;
	/** The GMT date the application password was created. */
	created?: string | null;
	/** The GMT date the application password was last used. */
	last_used?: string | null;
	/** The IP address the application password was last used by. */
	last_ip?: string | null;
	[key: string]: unknown;
};

export type WordpressAttachment = {
	/** The date the post was published, in the site's timezone. */
	date?: string | null;
	/** The date the post was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the post. */
	id?: number | null;
	/** URL to the post. */
	link?: string | null;
	/** The date the post was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the post was last modified, as GMT. */
	modified_gmt?: string | null;
	/** An alphanumeric identifier for the post unique to its type. */
	slug?: string | null;
	/** A named status for the post. */
	status?: string | null;
	/** Type of post. */
	type?: string | null;
	/** Permalink template for the post. */
	permalink_template?: string | null;
	/** Slug automatically generated from the post title. */
	generated_slug?: string | null;
	/** An array of the class names for the post container element. */
	class_list?: Array<string> | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The ID for the author of the post. */
	author?: number | null;
	/** The ID of the featured media for the post. */
	featured_media?: number | null;
	/** Whether or not comments are open on the post. */
	comment_status?: string | null;
	/** Whether or not the post can be pinged. */
	ping_status?: string | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	/** The theme file to use to display the post. */
	template?: string | null;
	/** Alternative text to display when attachment is not displayed. */
	alt_text?: string | null;
	/** The attachment caption. */
	caption?: {
		/** Caption for the attachment, as it exists in the database. */
		raw?: string | null;
		/** HTML caption for the attachment, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The attachment description. */
	description?: {
		/** Description for the attachment, as it exists in the database. */
		raw?: string | null;
		/** HTML description for the attachment, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Attachment type. */
	media_type?: string | null;
	/** The attachment MIME type. */
	mime_type?: string | null;
	/** Details about the media file, specific to its type. */
	media_details?: Record<string, WordpressJsonValue> | null;
	/** The ID for the associated post of the attachment. */
	post?: number | null;
	/** URL to the original attachment file. */
	source_url?: string | null;
	/** List of the missing image sizes of the attachment. */
	missing_image_sizes?: Array<string> | null;
	/** Original attachment file name. */
	filename?: string | null;
	/** Attachment file size in bytes. */
	filesize?: number | null;
	/** EXIF orientation value. Values 1-8 follow the EXIF specification, where 1 means no rotation needed. */
	exif_orientation?: number | null;
	/** Encode quality (1-100) from the wp_editor_set_quality filter, resolved against the output MIME type. The "default" value applies to the full-size image; "sizes" lists per-registered-size overrides where the filtered value differs from "default". */
	image_quality?: {
		default?: number | null;
		sizes?: {
			thumbnail?: number | null;
			medium?: number | null;
			medium_large?: number | null;
			large?: number | null;
			'1536x1536'?: number | null;
			'2048x2048'?: number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	} | null;
	/** The output MIME type this image should be converted to, based on the image_editor_output_format filter. Null if no conversion is needed. */
	image_output_format?: string | null;
	/** Whether to use progressive/interlaced encoding when saving this image. */
	image_save_progressive?: boolean | null;
	[key: string]: unknown;
};

export type WordpressBlockDirectoryItem = {
	/** The block name, in namespace/block-name format. */
	name?: string | null;
	/** The block title, in human readable format. */
	title?: string | null;
	/** A short description of the block, in human readable format. */
	description?: string | null;
	/** The block slug. */
	id?: string | null;
	/** The star rating of the block. */
	rating?: number | null;
	/** The number of ratings. */
	rating_count?: number | null;
	/** The number sites that have activated this block. */
	active_installs?: number | null;
	/** The average rating of blocks published by the same author. */
	author_block_rating?: number | null;
	/** The number of blocks published by the same author. */
	author_block_count?: number | null;
	/** The WordPress.org username of the block author. */
	author?: string | null;
	/** The block icon. */
	icon?: string | null;
	/** The date when the block was last updated. */
	last_updated?: string | null;
	/** The date when the block was last updated, in human readable format. */
	humanized_updated?: string | null;
	[key: string]: unknown;
};

export type WordpressBlockPattern = {
	/** The pattern name. */
	name?: string | null;
	/** The pattern title, in human readable format. */
	title?: string | null;
	/** The pattern content. */
	content?: string | null;
	/** The pattern detailed description. */
	description?: string | null;
	/** The pattern viewport width for inserter preview. */
	viewport_width?: number | null;
	/** Determines whether the pattern is visible in inserter. */
	inserter?: boolean | null;
	/** The pattern category slugs. */
	categories?: Array<WordpressJsonValue> | null;
	/** The pattern keywords. */
	keywords?: Array<WordpressJsonValue> | null;
	/** Block types that the pattern is intended to be used with. */
	block_types?: Array<WordpressJsonValue> | null;
	/** An array of post types that the pattern is restricted to be used with. */
	post_types?: Array<WordpressJsonValue> | null;
	/** The template types where the pattern fits (a list, or one string from patterns registered in PHP). */
	template_types?: (Array<string> | string) | null;
	/** Where the pattern comes from e.g. core */
	source?: string | null;
	[key: string]: unknown;
};

export type WordpressBlockPatternCategory = {
	/** The category name. */
	name?: string | null;
	/** The category label, in human readable format. */
	label?: string | null;
	/** The category description, in human readable format. */
	description?: string | null;
	[key: string]: unknown;
};

export type WordpressBlockType = {
	/** Version of block API. */
	api_version?: number | null;
	/** Title of block type. */
	title?: string | null;
	/** Unique name identifying the block type. */
	name?: string | null;
	/** Description of block type. */
	description?: string | null;
	/** Icon of block type. */
	icon?: string | null;
	/** Block attributes. */
	attributes?: Record<string, Record<string, WordpressJsonValue>> | null;
	/** Context provided by blocks of this type. */
	provides_context?: Record<string, string> | null;
	/** Context values inherited by blocks of this type. */
	uses_context?: Array<string> | null;
	/** Custom CSS selectors. */
	selectors?: Record<string, WordpressJsonValue> | null;
	/** Block supports. */
	supports?: Record<string, WordpressJsonValue> | null;
	/** Block category. */
	category?: string | null;
	/** Is the block dynamically rendered. */
	is_dynamic?: boolean | null;
	/** Editor script handles. */
	editor_script_handles?: Array<string> | null;
	/** Public facing and editor script handles. */
	script_handles?: Array<string> | null;
	/** Public facing script handles. */
	view_script_handles?: Array<string> | null;
	/** Public facing script module IDs. */
	view_script_module_ids?: Array<string> | null;
	/** Editor style handles. */
	editor_style_handles?: Array<string> | null;
	/** Public facing and editor style handles. */
	style_handles?: Array<string> | null;
	/** Public facing style handles. */
	view_style_handles?: Array<string> | null;
	/** Block style variations. */
	styles?: Array<{
		/** Unique name identifying the style. */
		name?: string | null;
		/** The human-readable label for the style. */
		label?: string | null;
		/** Inline CSS code that registers the CSS class required for the style. */
		inline_style?: string | null;
		/** Contains the handle that defines the block style. */
		style_handle?: string | null;
		[key: string]: unknown;
	}> | null;
	/** Block variations. */
	variations?: Array<{
		/** The unique and machine-readable name. */
		name?: string | null;
		/** A human-readable variation title. */
		title?: string | null;
		/** A detailed variation description. */
		description?: string | null;
		/** Block category. */
		category?: string | null;
		/** Icon of block type. */
		icon?: string | null;
		/** Indicates whether the current variation is the default one. */
		isDefault?: boolean | null;
		/** The initial values for attributes. */
		attributes?: Record<string, WordpressJsonValue> | null;
		/** The list of inner blocks used in the example. */
		innerBlocks?: Array<{
			/** The name of the inner block. */
			name?: string | null;
			/** The attributes of the inner block. */
			attributes?: Record<string, WordpressJsonValue> | null;
			/** A list of the inner block's own inner blocks. This is a recursive definition following the parent innerBlocks schema. */
			innerBlocks?: Array<WordpressJsonValue> | null;
			[key: string]: unknown;
		}> | null;
		/** Block example. */
		example?: {
			/** The attributes used in the example. */
			attributes?: Record<string, WordpressJsonValue> | null;
			/** The list of inner blocks used in the example. */
			innerBlocks?: Array<{
				/** The name of the inner block. */
				name?: string | null;
				/** The attributes of the inner block. */
				attributes?: Record<string, WordpressJsonValue> | null;
				/** A list of the inner block's own inner blocks. This is a recursive definition following the parent innerBlocks schema. */
				innerBlocks?: Array<WordpressJsonValue> | null;
				[key: string]: unknown;
			}> | null;
			[key: string]: unknown;
		} | null;
		/** The list of scopes where the variation is applicable. When not provided, it assumes all available scopes. */
		scope?: Array<string> | null;
		/** Block keywords. */
		keywords?: Array<string> | null;
		[key: string]: unknown;
	}> | null;
	/** Public text domain. */
	textdomain?: string | null;
	/** Parent blocks. */
	parent?: Array<string> | null;
	/** Ancestor blocks. */
	ancestor?: Array<string> | null;
	/** Allowed child block types. */
	allowed_blocks?: Array<string> | null;
	/** Block keywords. */
	keywords?: Array<string> | null;
	/** Block example. */
	example?: {
		/** The attributes used in the example. */
		attributes?: Record<string, WordpressJsonValue> | null;
		/** The list of inner blocks used in the example. */
		innerBlocks?: Array<{
			/** The name of the inner block. */
			name?: string | null;
			/** The attributes of the inner block. */
			attributes?: Record<string, WordpressJsonValue> | null;
			/** A list of the inner block's own inner blocks. This is a recursive definition following the parent innerBlocks schema. */
			innerBlocks?: Array<WordpressJsonValue> | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	} | null;
	/** This block is automatically inserted near any occurrence of the block types used as keys of this map, into a relative position given by the corresponding value. */
	block_hooks?: Record<string, WordpressJsonValue> | null;
	/** Editor script handle. DEPRECATED: Use `editor_script_handles` instead. */
	editor_script?: string | null;
	/** Public facing and editor script handle. DEPRECATED: Use `script_handles` instead. */
	script?: string | null;
	/** Public facing script handle. DEPRECATED: Use `view_script_handles` instead. */
	view_script?: string | null;
	/** Editor style handle. DEPRECATED: Use `editor_style_handles` instead. */
	editor_style?: string | null;
	/** Public facing and editor style handle. DEPRECATED: Use `style_handles` instead. */
	style?: string | null;
	[key: string]: unknown;
};

export type WordpressCategory = {
	/** Unique identifier for the term. */
	id?: number | null;
	/** Number of published posts for the term. */
	count?: number | null;
	/** HTML description of the term. */
	description?: string | null;
	/** URL of the term. */
	link?: string | null;
	/** HTML title for the term. */
	name?: string | null;
	/** An alphanumeric identifier for the term unique to its type. */
	slug?: string | null;
	/** Type attribution for the term. */
	taxonomy?: string | null;
	/** The parent term ID. */
	parent?: number | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressComment = {
	/** Unique identifier for the comment. */
	id?: number | null;
	/** The ID of the user object, if author was a user. */
	author?: number | null;
	/** Email address for the comment author. */
	author_email?: string | null;
	/** IP address for the comment author. */
	author_ip?: string | null;
	/** Display name for the comment author. */
	author_name?: string | null;
	/** URL for the comment author. */
	author_url?: string | null;
	/** User agent for the comment author. */
	author_user_agent?: string | null;
	/** The content for the comment. */
	content?: {
		/** Content for the comment, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the comment, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The date the comment was published, in the site's timezone. */
	date?: string | null;
	/** The date the comment was published, as GMT. */
	date_gmt?: string | null;
	/** URL to the comment. */
	link?: string | null;
	/** The ID for the parent of the comment. */
	parent?: number | null;
	/** The ID of the associated post object. */
	post?: number | null;
	/** State of the comment. */
	status?: string | null;
	/** Type of the comment. */
	type?: string | null;
	/** Avatar URLs for the comment author. */
	author_avatar_urls?: {
		/** Avatar URL with image size of 24 pixels. */
		'24'?: string | null;
		/** Avatar URL with image size of 48 pixels. */
		'48'?: string | null;
		/** Avatar URL with image size of 96 pixels. */
		'96'?: string | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		/** Note resolution status */
		_wp_note_status?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressFontCollection = {
	/** Unique identifier for the font collection. */
	slug?: string | null;
	/** The name for the font collection. */
	name?: string | null;
	/** The description for the font collection. */
	description?: string | null;
	/** The font families for the font collection. */
	font_families?: Array<WordpressJsonValue> | null;
	/** The categories for the font collection. */
	categories?: Array<WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressIcon = {
	/** The icon name. */
	name?: string | null;
	/** The icon label. */
	label?: string | null;
	/** The icon content (SVG markup). */
	content?: string | null;
	/** The slug of the collection this icon belongs to. */
	collection?: string | null;
	[key: string]: unknown;
};

export type WordpressIconCollection = {
	/** The icon collection slug. */
	slug?: string | null;
	/** The icon collection label. */
	label?: string | null;
	/** The icon collection description. */
	description?: string | null;
	[key: string]: unknown;
};

export type WordpressMenuLocation = {
	/** The name of the menu location. */
	name?: string | null;
	/** The description of the menu location. */
	description?: string | null;
	/** The ID of the assigned menu. */
	menu?: number | null;
	[key: string]: unknown;
};

export type WordpressNavMenu = {
	/** Unique identifier for the term. */
	id?: number | null;
	/** HTML description of the term. */
	description?: string | null;
	/** HTML title for the term. */
	name?: string | null;
	/** An alphanumeric identifier for the term unique to its type. */
	slug?: string | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	/** The locations assigned to the menu. */
	locations?: Array<string> | null;
	/** Whether to automatically add top level pages to this menu. */
	auto_add?: boolean | null;
	[key: string]: unknown;
};

export type WordpressNavMenuItem = {
	/** The title for the object. */
	title?:
		| (
				| string
				| {
						/** Title for the object, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the object, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
		  )
		| null;
	/** Unique identifier for the object. */
	id?: number | null;
	/** The singular label used to describe this type of menu item. */
	type_label?: string | null;
	/** The family of objects originally represented, such as "post_type" or "taxonomy". */
	type?: string | null;
	/** A named status for the object. */
	status?: string | null;
	/** The ID for the parent of the object. */
	parent?: number | null;
	/** Text for the title attribute of the link element for this menu item. */
	attr_title?: string | null;
	/** Class names for the link element of this menu item. */
	classes?: Array<string> | null;
	/** The description of this menu item. */
	description?: string | null;
	/** The DB ID of the nav_menu_item that is this item's menu parent, if any, otherwise 0. */
	menu_order?: number | null;
	/** The type of object originally represented, such as "category", "post", or "attachment". */
	object?: string | null;
	/** The database ID of the original object this menu item represents, for example the ID for posts or the term_id for categories. */
	object_id?: number | null;
	/** The target attribute of the link element for this menu item. */
	target?: string | null;
	/** The URL to which this menu item points. */
	url?: string | null;
	/** The XFN relationship expressed in the link of this menu item. */
	xfn?: Array<string> | null;
	/** Whether the menu item represents an object that no longer exists. */
	invalid?: boolean | null;
	/** The terms assigned to the object in the nav_menu taxonomy. */
	menus?: number | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressNavMenuItemRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier. */
	guid?:
		| (
				| {
						rendered?: string | null;
						raw?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the object. */
	title?:
		| (
				| string
				| {
						/** Title for the object, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the object, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
		  )
		| null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	/** Preview link for the post. */
	preview_link?: string | null;
	[key: string]: unknown;
};

export type WordpressNavigationFallback = {
	/** The unique identifier for the Navigation Menu. */
	id?: number | null;
	[key: string]: unknown;
};

export type WordpressPage = {
	/** The date the post was published, in the site's timezone. */
	date?: string | null;
	/** The date the post was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the post. */
	id?: number | null;
	/** URL to the post. */
	link?: string | null;
	/** The date the post was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the post was last modified, as GMT. */
	modified_gmt?: string | null;
	/** An alphanumeric identifier for the post unique to its type. */
	slug?: string | null;
	/** A named status for the post. */
	status?: string | null;
	/** Type of post. */
	type?: string | null;
	/** A password to protect access to the content and excerpt. */
	password?: string | null;
	/** Permalink template for the post. */
	permalink_template?: string | null;
	/** Slug automatically generated from the post title. */
	generated_slug?: string | null;
	/** An array of the class names for the post container element. */
	class_list?: Array<string> | null;
	/** The ID for the parent of the post. */
	parent?: number | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The ID for the author of the post. */
	author?: number | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The ID of the featured media for the post. */
	featured_media?: number | null;
	/** Whether or not comments are open on the post. */
	comment_status?: string | null;
	/** Whether or not the post can be pinged. */
	ping_status?: string | null;
	/** The order of the post in relation to other posts. */
	menu_order?: number | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** The theme file to use to display the post. */
	template?: string | null;
	[key: string]: unknown;
};

export type WordpressPageRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressPageRevision2 = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** Preview link for the post. */
	preview_link?: string | null;
	[key: string]: unknown;
};

export type WordpressPatternDirectoryItem = {
	/** The pattern ID. */
	id?: number | null;
	/** The pattern title, in human readable format. */
	title?: string | null;
	/** The pattern content. */
	content?: string | null;
	/** The pattern's category slugs. */
	categories?: Array<string> | null;
	/** The pattern's keywords. */
	keywords?: Array<string> | null;
	/** A description of the pattern. */
	description?: string | null;
	/** The preferred width of the viewport when previewing a pattern, in pixels. */
	viewport_width?: number | null;
	/** The block types which can use this pattern. */
	block_types?: Array<string> | null;
	[key: string]: unknown;
};

export type WordpressPlugin = {
	/** The plugin file. */
	plugin?: string | null;
	/** The plugin activation status. */
	status?: string | null;
	/** The plugin name. */
	name?: string | null;
	/** The plugin's website address. */
	plugin_uri?: string | null;
	/** The plugin author. */
	author?: string | null;
	/** Plugin author's website address. */
	author_uri?: string | null;
	/** The plugin description. */
	description?: {
		/** The raw plugin description. */
		raw?: string | null;
		/** The plugin description formatted for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The plugin version number. */
	version?: string | null;
	/** Whether the plugin can only be activated network-wide. */
	network_only?: boolean | null;
	/** Minimum required version of WordPress. */
	requires_wp?: string | null;
	/** Minimum required version of PHP. */
	requires_php?: string | null;
	/** The plugin's text domain. */
	textdomain?: string | null;
	[key: string]: unknown;
};

export type WordpressPost = {
	/** The date the post was published, in the site's timezone. */
	date?: string | null;
	/** The date the post was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the post. */
	id?: number | null;
	/** URL to the post. */
	link?: string | null;
	/** The date the post was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the post was last modified, as GMT. */
	modified_gmt?: string | null;
	/** An alphanumeric identifier for the post unique to its type. */
	slug?: string | null;
	/** A named status for the post. */
	status?: string | null;
	/** Type of post. */
	type?: string | null;
	/** A password to protect access to the content and excerpt. */
	password?: string | null;
	/** Permalink template for the post. */
	permalink_template?: string | null;
	/** Slug automatically generated from the post title. */
	generated_slug?: string | null;
	/** An array of the class names for the post container element. */
	class_list?: Array<string> | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The ID for the author of the post. */
	author?: number | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The ID of the featured media for the post. */
	featured_media?: number | null;
	/** Whether or not comments are open on the post. */
	comment_status?: string | null;
	/** Whether or not the post can be pinged. */
	ping_status?: string | null;
	/** The format for the post. */
	format?: string | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** Whether or not the post should be treated as sticky. */
	sticky?: boolean | null;
	/** The theme file to use to display the post. */
	template?: string | null;
	/** The terms assigned to the post in the category taxonomy. */
	categories?: Array<number> | null;
	/** The terms assigned to the post in the post_tag taxonomy. */
	tags?: Array<number> | null;
	[key: string]: unknown;
};

export type WordpressPostRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressPostRevision2 = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** Preview link for the post. */
	preview_link?: string | null;
	[key: string]: unknown;
};

export type WordpressRenderedBlock = {
	/** The rendered block. */
	rendered?: string | null;
	[key: string]: unknown;
};

export type WordpressSearchResult = {
	/** Unique identifier for the object. */
	id?: (number | string) | null;
	/** The title for the object. */
	title?: string | null;
	/** URL to the object. */
	url?: string | null;
	/** Object type. */
	type?: string | null;
	/** Object subtype. */
	subtype?: string | null;
	[key: string]: unknown;
};

export type WordpressSettings = {
	/** Site title. */
	title?: string | null;
	/** Site tagline. */
	description?: string | null;
	/** Site URL. */
	url?: string | null;
	/** This address is used for admin purposes, like new user notification. */
	email?: string | null;
	/** A city in the same timezone as you. */
	timezone?: string | null;
	/** A date format for all date strings. */
	date_format?: string | null;
	/** A time format for all time strings. */
	time_format?: string | null;
	/** A day number of the week that the week should start on. */
	start_of_week?: number | null;
	/** WordPress locale code. */
	language?: string | null;
	/** Convert emoticons like :-) and :-P to graphics on display. */
	use_smilies?: boolean | null;
	/** Default post category. */
	default_category?: number | null;
	/** Default post format. */
	default_post_format?: string | null;
	/** Blog pages show at most. */
	posts_per_page?: number | null;
	/** What to show on the front page */
	show_on_front?: string | null;
	/** The ID of the page that should be displayed on the front page */
	page_on_front?: number | null;
	/** The ID of the page that should display the latest posts */
	page_for_posts?: number | null;
	/** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
	default_ping_status?: string | null;
	/** Allow people to submit comments on new posts. */
	default_comment_status?: string | null;
	/** Site logo. */
	site_logo?: number | null;
	/** Site icon. */
	site_icon?: number | null;
	[key: string]: unknown;
};

export type WordpressSidebar = {
	/** ID of sidebar. */
	id?: string | null;
	/** Unique name identifying the sidebar. */
	name?: string | null;
	/** Description of sidebar. */
	description?: string | null;
	/** Extra CSS class to assign to the sidebar in the Widgets interface. */
	class?: string | null;
	/** HTML content to prepend to each widget's HTML output when assigned to this sidebar. Default is an opening list item element. */
	before_widget?: string | null;
	/** HTML content to append to each widget's HTML output when assigned to this sidebar. Default is a closing list item element. */
	after_widget?: string | null;
	/** HTML content to prepend to the sidebar title when displayed. Default is an opening h2 element. */
	before_title?: string | null;
	/** HTML content to append to the sidebar title when displayed. Default is a closing h2 element. */
	after_title?: string | null;
	/** Status of sidebar. */
	status?: string | null;
	/** Nested widgets. */
	widgets?: Array<Record<string, WordpressJsonValue> | string> | null;
	[key: string]: unknown;
};

export type WordpressStatus = {
	/** The title for the status. */
	name?: string | null;
	/** Whether posts with this status should be private. */
	private?: boolean | null;
	/** Whether posts with this status should be protected. */
	protected?: boolean | null;
	/** Whether posts of this status should be shown in the front end of the site. */
	public?: boolean | null;
	/** Whether posts with this status should be publicly-queryable. */
	queryable?: boolean | null;
	/** Whether to include posts in the edit listing for their post type. */
	show_in_list?: boolean | null;
	/** An alphanumeric identifier for the status. */
	slug?: string | null;
	/** Whether posts of this status may have floating published dates. */
	date_floating?: boolean | null;
	[key: string]: unknown;
};

export type WordpressTag = {
	/** Unique identifier for the term. */
	id?: number | null;
	/** Number of published posts for the term. */
	count?: number | null;
	/** HTML description of the term. */
	description?: string | null;
	/** URL of the term. */
	link?: string | null;
	/** HTML title for the term. */
	name?: string | null;
	/** An alphanumeric identifier for the term unique to its type. */
	slug?: string | null;
	/** Type attribution for the term. */
	taxonomy?: string | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressTaxonomy = {
	/** All capabilities used by the taxonomy. */
	capabilities?: Record<string, WordpressJsonValue> | null;
	/** A human-readable description of the taxonomy. */
	description?: string | null;
	/** Whether or not the taxonomy should have children. */
	hierarchical?: boolean | null;
	/** Human-readable labels for the taxonomy for various contexts. */
	labels?: Record<string, WordpressJsonValue> | null;
	/** The title for the taxonomy. */
	name?: string | null;
	/** An alphanumeric identifier for the taxonomy. */
	slug?: string | null;
	/** Whether or not the term cloud should be displayed. */
	show_cloud?: boolean | null;
	/** Types associated with the taxonomy. */
	types?: Array<string> | null;
	/** REST base route for the taxonomy. */
	rest_base?: string | null;
	/** REST namespace route for the taxonomy. */
	rest_namespace?: string | null;
	/** The visibility settings for the taxonomy. */
	visibility?: {
		/** Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users. */
		public?: boolean | null;
		/** Whether the taxonomy is publicly queryable. */
		publicly_queryable?: boolean | null;
		/** Whether to generate a default UI for managing this taxonomy. */
		show_ui?: boolean | null;
		/** Whether to allow automatic creation of taxonomy columns on associated post-types table. */
		show_admin_column?: boolean | null;
		/** Whether to make the taxonomy available for selection in navigation menus. */
		show_in_nav_menus?: boolean | null;
		/** Whether to show the taxonomy in the quick/bulk edit panel. */
		show_in_quick_edit?: boolean | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressTheme = {
	/** The theme's stylesheet. This uniquely identifies the theme. */
	stylesheet?: string | null;
	/** The uri for the theme's stylesheet directory. */
	stylesheet_uri?: string | null;
	/** The theme's template. If this is a child theme, this refers to the parent theme, otherwise this is the same as the theme's stylesheet. */
	template?: string | null;
	/** The uri for the theme's template directory. If this is a child theme, this refers to the parent theme, otherwise this is the same as the theme's stylesheet directory. */
	template_uri?: string | null;
	/** The theme author. */
	author?: {
		/** The theme author's name, as found in the theme header. */
		raw?: string | null;
		/** HTML for the theme author, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The website of the theme author. */
	author_uri?: {
		/** The website of the theme author, as found in the theme header. */
		raw?: string | null;
		/** The website of the theme author, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** A description of the theme. */
	description?: {
		/** The theme description, as found in the theme header. */
		raw?: string | null;
		/** The theme description, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Whether the theme is a block-based theme. */
	is_block_theme?: boolean | null;
	/** The name of the theme. */
	name?: {
		/** The theme name, as found in the theme header. */
		raw?: string | null;
		/** The theme name, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The minimum PHP version required for the theme to work. */
	requires_php?: string | null;
	/** The minimum WordPress version required for the theme to work. */
	requires_wp?: string | null;
	/** The theme's screenshot URL. */
	screenshot?: string | null;
	/** Tags indicating styles and features of the theme. */
	tags?: {
		/** The theme tags, as found in the theme header. */
		raw?: Array<string> | null;
		/** The theme tags, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The theme's text domain. */
	textdomain?: string | null;
	/** Features supported by this theme. */
	theme_supports?: {
		/** Whether theme opts in to wide alignment CSS class. */
		'align-wide'?: boolean | null;
		/** Whether posts and comments RSS feed links are added to head. */
		'automatic-feed-links'?: boolean | null;
		/** Whether a theme uses block-based templates. */
		'block-templates'?: boolean | null;
		/** Whether a theme uses block-based template parts. */
		'block-template-parts'?: boolean | null;
		/** Custom background if defined by the theme. */
		'custom-background'?:
			| (
					| boolean
					| {
							'default-image'?: string | null;
							'default-preset'?: string | null;
							'default-position-x'?: string | null;
							'default-position-y'?: string | null;
							'default-size'?: string | null;
							'default-repeat'?: string | null;
							'default-attachment'?: string | null;
							'default-color'?: string | null;
							[key: string]: unknown;
					  }
			  )
			| null;
		/** Custom header if defined by the theme. */
		'custom-header'?:
			| (
					| boolean
					| {
							'default-image'?: string | null;
							'random-default'?: boolean | null;
							width?: number | null;
							height?: number | null;
							'flex-height'?: boolean | null;
							'flex-width'?: boolean | null;
							'default-text-color'?: string | null;
							'header-text'?: boolean | null;
							uploads?: boolean | null;
							video?: boolean | null;
							[key: string]: unknown;
					  }
			  )
			| null;
		/** Custom logo if defined by the theme. */
		'custom-logo'?:
			| (
					| boolean
					| {
							width?: number | null;
							height?: number | null;
							'flex-width'?: boolean | null;
							'flex-height'?: boolean | null;
							'header-text'?: Array<string> | null;
							'unlink-homepage-logo'?: boolean | null;
							[key: string]: unknown;
					  }
			  )
			| null;
		/** Whether the theme enables Selective Refresh for Widgets being managed with the Customizer. */
		'customize-selective-refresh-widgets'?: boolean | null;
		/** Whether theme opts in to the dark editor style UI. */
		'dark-editor-style'?: boolean | null;
		/** Whether the theme disables custom colors. */
		'disable-custom-colors'?: boolean | null;
		/** Whether the theme disables custom font sizes. */
		'disable-custom-font-sizes'?: boolean | null;
		/** Whether the theme disables custom gradients. */
		'disable-custom-gradients'?: boolean | null;
		/** Whether the theme disables generated layout styles. */
		'disable-layout-styles'?: boolean | null;
		/** Custom color palette if defined by the theme. */
		'editor-color-palette'?:
			| (
					| boolean
					| Array<{
							name?: string | null;
							slug?: string | null;
							color?: string | null;
							[key: string]: unknown;
					  }>
			  )
			| null;
		/** Custom font sizes if defined by the theme. */
		'editor-font-sizes'?:
			| (
					| boolean
					| Array<{
							name?: string | null;
							size?: number | null;
							slug?: string | null;
							[key: string]: unknown;
					  }>
			  )
			| null;
		/** Custom gradient presets if defined by the theme. */
		'editor-gradient-presets'?:
			| (
					| boolean
					| Array<{
							name?: string | null;
							gradient?: string | null;
							slug?: string | null;
							[key: string]: unknown;
					  }>
			  )
			| null;
		/** Custom spacing sizes if defined by the theme. */
		'editor-spacing-sizes'?:
			| (
					| boolean
					| Array<{
							name?: string | null;
							size?: string | null;
							slug?: string | null;
							[key: string]: unknown;
					  }>
			  )
			| null;
		/** Whether theme opts in to the editor styles CSS wrapper. */
		'editor-styles'?: boolean | null;
		/** Allows use of HTML5 markup for search forms, comment forms, comment lists, gallery, and caption. */
		html5?: (boolean | Array<string>) | null;
		/** Post formats supported. */
		formats?: Array<string> | null;
		/** The post types that support thumbnails or true if all post types are supported. */
		'post-thumbnails'?: (boolean | Array<string>) | null;
		/** Whether the theme supports responsive embedded content. */
		'responsive-embeds'?: boolean | null;
		/** Whether the theme can manage the document title tag. */
		'title-tag'?: boolean | null;
		/** Whether theme opts in to default WordPress block styles for viewing. */
		'wp-block-styles'?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The URI of the theme's webpage. */
	theme_uri?: {
		/** The URI of the theme's webpage, as found in the theme header. */
		raw?: string | null;
		/** The URI of the theme's webpage, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The theme's current version. */
	version?: string | null;
	/** A named status for the theme. */
	status?: string | null;
	/** A list of default template types. */
	default_template_types?: Array<{
		slug?: string | null;
		title?: string | null;
		description?: string | null;
		[key: string]: unknown;
	}> | null;
	/** A list of allowed area values for template parts. */
	default_template_part_areas?: Array<{
		area?: string | null;
		label?: string | null;
		description?: string | null;
		icon?: string | null;
		area_tag?: string | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

export type WordpressType = {
	/** All capabilities used by the post type. */
	capabilities?: Record<string, WordpressJsonValue> | null;
	/** A human-readable description of the post type. */
	description?: string | null;
	/** Whether or not the post type should have children. */
	hierarchical?: boolean | null;
	/** Whether or not the post type can be viewed. */
	viewable?: boolean | null;
	/** Human-readable labels for the post type for various contexts. */
	labels?: Record<string, WordpressJsonValue> | null;
	/** The title for the post type. */
	name?: string | null;
	/** An alphanumeric identifier for the post type. */
	slug?: string | null;
	/** All features, supported by the post type. */
	supports?: Record<string, WordpressJsonValue> | null;
	/** If the value is a string, the value will be used as the archive slug. If the value is false the post type has no archive. */
	has_archive?: (string | boolean) | null;
	/** Taxonomies associated with post type. */
	taxonomies?: Array<string> | null;
	/** REST base route for the post type. */
	rest_base?: string | null;
	/** REST route's namespace for the post type. */
	rest_namespace?: string | null;
	/** The visibility settings for the post type. */
	visibility?: {
		/** Whether to generate a default UI for managing this post type. */
		show_ui?: boolean | null;
		/** Whether to make the post type available for selection in navigation menus. */
		show_in_nav_menus?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The icon for the post type. */
	icon?: string | null;
	/** The block template associated with the post type. */
	template?: Array<WordpressJsonValue> | null;
	/** The template_lock associated with the post type, or false if none. */
	template_lock?: (string | boolean) | null;
	[key: string]: unknown;
};

export type WordpressUser = {
	/** Unique identifier for the user. */
	id?: number | null;
	/** Login name for the user. */
	username?: string | null;
	/** Display name for the user. */
	name?: string | null;
	/** First name for the user. */
	first_name?: string | null;
	/** Last name for the user. */
	last_name?: string | null;
	/** The email address for the user. */
	email?: string | null;
	/** URL of the user. */
	url?: string | null;
	/** Description of the user. */
	description?: string | null;
	/** Author URL of the user. */
	link?: string | null;
	/** Locale for the user. */
	locale?: string | null;
	/** The nickname for the user. */
	nickname?: string | null;
	/** An alphanumeric identifier for the user. */
	slug?: string | null;
	/** Registration date for the user. */
	registered_date?: string | null;
	/** Roles assigned to the user. */
	roles?: Array<string> | null;
	/** Password for the user (never included). */
	password?: string | null;
	/** All capabilities assigned to the user. */
	capabilities?: Record<string, WordpressJsonValue> | null;
	/** Any extra capabilities assigned to the user. */
	extra_capabilities?: Record<string, WordpressJsonValue> | null;
	/** Avatar URLs for the user. */
	avatar_urls?: {
		/** Avatar URL with image size of 24 pixels. */
		'24'?: string | null;
		/** Avatar URL with image size of 48 pixels. */
		'48'?: string | null;
		/** Avatar URL with image size of 96 pixels. */
		'96'?: string | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		persisted_preferences?: {
			/** The date and time the preferences were updated. */
			_modified?: string | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressViewConfig = {
	/** Entity kind. */
	kind?: string | null;
	/** Entity name. */
	name?: string | null;
	/** The schema version of the configuration. */
	version?: number | null;
	/** Default view configuration. */
	default_view?: {
		type?: string | null;
		layout?: {
			styles?: Record<
				string,
				{
					width?: (string | number) | null;
					maxWidth?: (string | number) | null;
					minWidth?: (string | number) | null;
					align?: string | null;
					[key: string]: unknown;
				}
			> | null;
			density?: string | null;
			enableMoving?: boolean | null;
			badgeFields?: Array<string> | null;
			previewSize?: number | null;
			[key: string]: unknown;
		} | null;
		filters?: Array<{
			field?: string | null;
			operator?: string | null;
			value?: WordpressJsonValue | null;
			isLocked?: boolean | null;
			[key: string]: unknown;
		}> | null;
		sort?: {
			field?: string | null;
			direction?: string | null;
			[key: string]: unknown;
		} | null;
		perPage?: number | null;
		fields?: Array<string> | null;
		titleField?: string | null;
		mediaField?: string | null;
		descriptionField?: string | null;
		showTitle?: boolean | null;
		showMedia?: boolean | null;
		showDescription?: boolean | null;
		showLevels?: boolean | null;
		groupBy?: {
			field?: string | null;
			direction?: string | null;
			showLabel?: boolean | null;
			[key: string]: unknown;
		} | null;
		infiniteScrollEnabled?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Default layout configurations. */
	default_layouts?: {
		table?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				styles?: Record<
					string,
					{
						width?: (string | number) | null;
						maxWidth?: (string | number) | null;
						minWidth?: (string | number) | null;
						align?: string | null;
						[key: string]: unknown;
					}
				> | null;
				density?: string | null;
				enableMoving?: boolean | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		list?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				density?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		grid?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				badgeFields?: Array<string> | null;
				previewSize?: number | null;
				density?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		activity?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				density?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		pickerGrid?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				badgeFields?: Array<string> | null;
				previewSize?: number | null;
				density?: string | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		pickerTable?: {
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			layout?: {
				styles?: Record<
					string,
					{
						width?: (string | number) | null;
						maxWidth?: (string | number) | null;
						minWidth?: (string | number) | null;
						align?: string | null;
						[key: string]: unknown;
					}
				> | null;
				density?: string | null;
				enableMoving?: boolean | null;
				[key: string]: unknown;
			} | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	} | null;
	/** List of default views. */
	view_list?: Array<{
		title?: string | null;
		slug?: string | null;
		view?: {
			type?: string | null;
			layout?: {
				styles?: Record<
					string,
					{
						width?: (string | number) | null;
						maxWidth?: (string | number) | null;
						minWidth?: (string | number) | null;
						align?: string | null;
						[key: string]: unknown;
					}
				> | null;
				density?: string | null;
				enableMoving?: boolean | null;
				badgeFields?: Array<string> | null;
				previewSize?: number | null;
				[key: string]: unknown;
			} | null;
			filters?: Array<{
				field?: string | null;
				operator?: string | null;
				value?: WordpressJsonValue | null;
				isLocked?: boolean | null;
				[key: string]: unknown;
			}> | null;
			sort?: {
				field?: string | null;
				direction?: string | null;
				[key: string]: unknown;
			} | null;
			perPage?: number | null;
			fields?: Array<string> | null;
			titleField?: string | null;
			mediaField?: string | null;
			descriptionField?: string | null;
			showTitle?: boolean | null;
			showMedia?: boolean | null;
			showDescription?: boolean | null;
			showLevels?: boolean | null;
			groupBy?: {
				field?: string | null;
				direction?: string | null;
				showLabel?: boolean | null;
				[key: string]: unknown;
			} | null;
			infiniteScrollEnabled?: boolean | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	}> | null;
	/** Default form configuration. */
	form?: {
		layout?:
			| (
					| {
							type?: string | null;
							labelPosition?: string | null;
							[key: string]: unknown;
					  }
					| {
							type?: string | null;
							labelPosition?: string | null;
							openAs?:
								| (
										| string
										| {
												type?: string | null;
												applyLabel?: string | null;
												cancelLabel?: string | null;
												[key: string]: unknown;
										  }
								  )
								| null;
							summary?: (string | Array<string>) | null;
							editVisibility?: string | null;
							[key: string]: unknown;
					  }
					| {
							type?: string | null;
							withHeader?: boolean | null;
							isOpened?: boolean | null;
							isCollapsible?: boolean | null;
							summary?:
								| (
										| string
										| Array<
												| string
												| {
														id?: string | null;
														visibility?: string | null;
														[key: string]: unknown;
												  }
										  >
								  )
								| null;
							[key: string]: unknown;
					  }
					| {
							type?: string | null;
							alignment?: string | null;
							styles?: Record<
								string,
								{
									flex?: (string | number) | null;
									[key: string]: unknown;
								}
							> | null;
							[key: string]: unknown;
					  }
					| {
							type?: string | null;
							summary?: string | null;
							[key: string]: unknown;
					  }
			  )
			| null;
		fields?: Array<
			| string
			| {
					id?: string | null;
					label?: string | null;
					description?: string | null;
					layout?:
						| (
								| {
										type?: string | null;
										labelPosition?: string | null;
										[key: string]: unknown;
								  }
								| {
										type?: string | null;
										labelPosition?: string | null;
										openAs?:
											| (
													| string
													| {
															type?: string | null;
															applyLabel?: string | null;
															cancelLabel?: string | null;
															[key: string]: unknown;
													  }
											  )
											| null;
										summary?: (string | Array<string>) | null;
										editVisibility?: string | null;
										[key: string]: unknown;
								  }
								| {
										type?: string | null;
										withHeader?: boolean | null;
										isOpened?: boolean | null;
										isCollapsible?: boolean | null;
										summary?:
											| (
													| string
													| Array<
															| string
															| {
																	id?: string | null;
																	visibility?: string | null;
																	[key: string]: unknown;
															  }
													  >
											  )
											| null;
										[key: string]: unknown;
								  }
								| {
										type?: string | null;
										alignment?: string | null;
										styles?: Record<
											string,
											{
												flex?: (string | number) | null;
												[key: string]: unknown;
											}
										> | null;
										[key: string]: unknown;
								  }
								| {
										type?: string | null;
										summary?: string | null;
										[key: string]: unknown;
								  }
						  )
						| null;
					children?: Array<string | Record<string, WordpressJsonValue>> | null;
					[key: string]: unknown;
			  }
		> | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressWidget = {
	/** Unique identifier for the widget. */
	id?: string | null;
	/** The type of the widget. Corresponds to ID in widget-types endpoint. */
	id_base?: string | null;
	/** The sidebar the widget belongs to. */
	sidebar?: string | null;
	/** HTML representation of the widget. */
	rendered?: string | null;
	/** HTML representation of the widget admin form. */
	rendered_form?: string | null;
	/** Instance settings of the widget, if supported. */
	instance?: {
		/** Base64 encoded representation of the instance settings. */
		encoded?: string | null;
		/** Cryptographic hash of the instance settings. */
		hash?: string | null;
		/** Unencoded instance settings, if supported. */
		raw?: Record<string, WordpressJsonValue> | null;
		[key: string]: unknown;
	} | null;
	/** URL-encoded form data from the widget admin form. Used to update a widget that does not support instance. Write only. */
	form_data?: string | null;
	[key: string]: unknown;
};

export type WordpressWidgetType = {
	/** Unique slug identifying the widget type. */
	id?: string | null;
	/** Human-readable name identifying the widget type. */
	name?: string | null;
	/** Description of the widget. */
	description?: string | null;
	/** Whether the widget supports multiple instances */
	is_multi?: boolean | null;
	/** Class name */
	classname?: string | null;
	[key: string]: unknown;
};

export type WordpressWpBlock = {
	/** The date the post was published, in the site's timezone. */
	date?: string | null;
	/** The date the post was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the post. */
	id?: number | null;
	/** URL to the post. */
	link?: string | null;
	/** The date the post was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the post was last modified, as GMT. */
	modified_gmt?: string | null;
	/** An alphanumeric identifier for the post unique to its type. */
	slug?: string | null;
	/** A named status for the post. */
	status?: string | null;
	/** Type of post. */
	type?: string | null;
	/** A password to protect access to the content and excerpt. */
	password?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		wp_pattern_sync_status?: string | null;
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** The theme file to use to display the post. */
	template?: string | null;
	/** The terms assigned to the post in the wp_pattern_category taxonomy. */
	wp_pattern_category?: Array<number> | null;
	[key: string]: unknown;
};

export type WordpressWpBlockRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		wp_pattern_sync_status?: string | null;
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressWpBlockRevision2 = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The excerpt for the post. */
	excerpt?: {
		/** Excerpt for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML excerpt for the post, transformed for display. */
		rendered?: string | null;
		/** Whether the excerpt is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: {
		wp_pattern_sync_status?: string | null;
		footnotes?: string | null;
		[key: string]: unknown;
	} | null;
	/** Preview link for the post. */
	preview_link?: string | null;
	[key: string]: unknown;
};

export type WordpressWpFontFace = {
	/** Unique identifier for the post. */
	id?: number | null;
	/** Version of the theme.json schema used for the typography settings. */
	theme_json_version?: number | null;
	/** The ID for the parent font family of the font face. */
	parent?: number | null;
	/** font-face declaration in theme.json format. */
	font_face_settings?: {
		/** CSS font-family value. */
		fontFamily?: string | null;
		/** CSS font-style value. */
		fontStyle?: string | null;
		/** List of available font weights, separated by a space. */
		fontWeight?: (string | number) | null;
		/** CSS font-display value. */
		fontDisplay?: string | null;
		/** Paths or URLs to the font files. */
		src?: (string | Array<string>) | null;
		/** CSS font-stretch value. */
		fontStretch?: string | null;
		/** CSS ascent-override value. */
		ascentOverride?: string | null;
		/** CSS descent-override value. */
		descentOverride?: string | null;
		/** CSS font-variant value. */
		fontVariant?: string | null;
		/** CSS font-feature-settings value. */
		fontFeatureSettings?: string | null;
		/** CSS font-variation-settings value. */
		fontVariationSettings?: string | null;
		/** CSS line-gap-override value. */
		lineGapOverride?: string | null;
		/** CSS size-adjust value. */
		sizeAdjust?: string | null;
		/** CSS unicode-range value. */
		unicodeRange?: string | null;
		/** URL to a preview image of the font face. */
		preview?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressWpFontFamily = {
	/** Unique identifier for the post. */
	id?: number | null;
	/** Version of the theme.json schema used for the typography settings. */
	theme_json_version?: number | null;
	/** The IDs of the child font faces in the font family. */
	font_faces?: Array<number> | null;
	/** font-face definition in theme.json format. */
	font_family_settings?: {
		/** Name of the font family preset, translatable. */
		name?: string | null;
		/** Kebab-case unique identifier for the font family preset. */
		slug?: string | null;
		/** CSS font-family value. */
		fontFamily?: string | null;
		/** URL to a preview image of the font family. */
		preview?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WordpressWpGlobalStyles = {
	/** ID of global styles config. */
	id?: number | null;
	/** Global styles. */
	styles?: Record<string, WordpressJsonValue> | null;
	/** Global settings. */
	settings?: Record<string, WordpressJsonValue> | null;
	/** Title of the global styles variation. */
	title?:
		| (
				| {
						/** Title for the global styles variation, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the post, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	[key: string]: unknown;
};

export type WordpressWpGlobalStylesRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** ID of global styles config. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** Global styles. */
	styles?: Record<string, WordpressJsonValue> | null;
	/** Global settings. */
	settings?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressWpNavigation = {
	/** The date the post was published, in the site's timezone. */
	date?: string | null;
	/** The date the post was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the post. */
	id?: number | null;
	/** URL to the post. */
	link?: string | null;
	/** The date the post was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the post was last modified, as GMT. */
	modified_gmt?: string | null;
	/** An alphanumeric identifier for the post unique to its type. */
	slug?: string | null;
	/** A named status for the post. */
	status?: string | null;
	/** Type of post. */
	type?: string | null;
	/** A password to protect access to the content and excerpt. */
	password?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** The theme file to use to display the post. */
	template?: string | null;
	[key: string]: unknown;
};

export type WordpressWpNavigationRevision = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressWpNavigationRevision2 = {
	/** The ID for the author of the revision. */
	author?: number | null;
	/** The date the revision was published, in the site's timezone. */
	date?: string | null;
	/** The date the revision was published, as GMT. */
	date_gmt?: string | null;
	/** The globally unique identifier for the post. */
	guid?: {
		/** GUID for the post, as it exists in the database. */
		raw?: string | null;
		/** GUID for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** Unique identifier for the revision. */
	id?: number | null;
	/** The date the revision was last modified, in the site's timezone. */
	modified?: string | null;
	/** The date the revision was last modified, as GMT. */
	modified_gmt?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	/** An alphanumeric identifier for the revision unique to its type. */
	slug?: string | null;
	/** The title for the post. */
	title?: {
		/** Title for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML title for the post, transformed for display. */
		rendered?: string | null;
		[key: string]: unknown;
	} | null;
	/** The content for the post. */
	content?: {
		/** Content for the post, as it exists in the database. */
		raw?: string | null;
		/** HTML content for the post, transformed for display. */
		rendered?: string | null;
		/** Version of the content block format used by the post. */
		block_version?: number | null;
		/** Whether the content is protected with a password. */
		protected?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	/** Preview link for the post. */
	preview_link?: string | null;
	[key: string]: unknown;
};

export type WordpressWpPatternCategory = {
	/** Unique identifier for the term. */
	id?: number | null;
	/** Number of published posts for the term. */
	count?: number | null;
	/** HTML description of the term. */
	description?: string | null;
	/** URL of the term. */
	link?: string | null;
	/** HTML title for the term. */
	name?: string | null;
	/** An alphanumeric identifier for the term unique to its type. */
	slug?: string | null;
	/** Type attribution for the term. */
	taxonomy?: string | null;
	/** Meta fields. */
	meta?: Record<string, WordpressJsonValue> | null;
	[key: string]: unknown;
};

export type WordpressWpSiteHealthTest = {
	/** The name of the test being run. */
	test?: string | null;
	/** A label describing the test. */
	label?: string | null;
	/** The status of the test. */
	status?: string | null;
	/** The category this test is grouped in. */
	badge?: {
		label?: string | null;
		color?: string | null;
		[key: string]: unknown;
	} | null;
	/** A more descriptive explanation of what the test looks for, and why it is important for the user. */
	description?: string | null;
	/** HTML containing an action to direct the user to where they can resolve the issue. */
	actions?: string | null;
	[key: string]: unknown;
};

export type WordpressWpTemplate = {
	/** ID of template. */
	id?: string | null;
	/** Unique slug identifying the template. */
	slug?: string | null;
	/** Theme identifier for the template. */
	theme?: string | null;
	/** Type of template. */
	type?: string | null;
	/** Source of template */
	source?: string | null;
	/** Source of a customized template */
	origin?: string | null;
	/** Content of template. */
	content?:
		| (
				| {
						/** Content for the template, as it exists in the database. */
						raw?: string | null;
						/** Version of the content block format used by the template. */
						block_version?: number | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Title of template. */
	title?:
		| (
				| {
						/** Title for the template, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the template, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Description of template. */
	description?: string | null;
	/** Status of template. */
	status?: string | null;
	/** Post ID. */
	wp_id?: number | null;
	/** Theme file exists. */
	has_theme_file?: WordpressJsonValue | null;
	/** The ID for the author of the template. */
	author?: number | null;
	/** The date the template was last modified, in the site's timezone. */
	modified?: string | null;
	/** Human readable text for the author. */
	author_text?: string | null;
	/** Where the template originally comes from e.g. 'theme' */
	original_source?: string | null;
	/** The date the template was published, in the site's timezone. */
	date?: string | null;
	/** Whether a template is a custom template. */
	is_custom?: WordpressJsonValue | null;
	/** Plugin that registered the template. */
	plugin?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	[key: string]: unknown;
};

export type WordpressWpTemplate2 = {
	/** ID of template. */
	id?: string | null;
	/** Unique slug identifying the template. */
	slug?: string | null;
	/** Theme identifier for the template. */
	theme?: string | null;
	/** Type of template. */
	type?: string | null;
	/** Source of template */
	source?: string | null;
	/** Source of a customized template */
	origin?: string | null;
	/** Content of template. */
	content?:
		| (
				| {
						/** Content for the template, as it exists in the database. */
						raw?: string | null;
						/** Version of the content block format used by the template. */
						block_version?: number | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Title of template. */
	title?:
		| (
				| {
						/** Title for the template, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the template, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Description of template. */
	description?: string | null;
	/** Status of template. */
	status?: string | null;
	/** Post ID. */
	wp_id?: number | null;
	/** Theme file exists. */
	has_theme_file?: WordpressJsonValue | null;
	/** The ID for the author of the template. */
	author?: number | null;
	/** The date the template was last modified, in the site's timezone. */
	modified?: string | null;
	/** Human readable text for the author. */
	author_text?: string | null;
	/** Where the template originally comes from e.g. 'theme' */
	original_source?: string | null;
	/** The date the template was published, in the site's timezone. */
	date?: string | null;
	/** Whether a template is a custom template. */
	is_custom?: WordpressJsonValue | null;
	/** Plugin that registered the template. */
	plugin?: string | null;
	[key: string]: unknown;
};

export type WordpressWpTemplatePart = {
	/** ID of template. */
	id?: string | null;
	/** Unique slug identifying the template. */
	slug?: string | null;
	/** Theme identifier for the template. */
	theme?: string | null;
	/** Type of template. */
	type?: string | null;
	/** Source of template */
	source?: string | null;
	/** Source of a customized template */
	origin?: string | null;
	/** Content of template. */
	content?:
		| (
				| {
						/** Content for the template, as it exists in the database. */
						raw?: string | null;
						/** Version of the content block format used by the template. */
						block_version?: number | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Title of template. */
	title?:
		| (
				| {
						/** Title for the template, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the template, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Description of template. */
	description?: string | null;
	/** Status of template. */
	status?: string | null;
	/** Post ID. */
	wp_id?: number | null;
	/** Theme file exists. */
	has_theme_file?: WordpressJsonValue | null;
	/** The ID for the author of the template. */
	author?: number | null;
	/** The date the template was last modified, in the site's timezone. */
	modified?: string | null;
	/** Human readable text for the author. */
	author_text?: string | null;
	/** Where the template originally comes from e.g. 'theme' */
	original_source?: string | null;
	/** The date the template was published, in the site's timezone. */
	date?: string | null;
	/** Where the template part is intended for use (header, footer, etc.) */
	area?: string | null;
	/** The ID for the parent of the revision. */
	parent?: number | null;
	[key: string]: unknown;
};

export type WordpressWpTemplatePart2 = {
	/** ID of template. */
	id?: string | null;
	/** Unique slug identifying the template. */
	slug?: string | null;
	/** Theme identifier for the template. */
	theme?: string | null;
	/** Type of template. */
	type?: string | null;
	/** Source of template */
	source?: string | null;
	/** Source of a customized template */
	origin?: string | null;
	/** Content of template. */
	content?:
		| (
				| {
						/** Content for the template, as it exists in the database. */
						raw?: string | null;
						/** Version of the content block format used by the template. */
						block_version?: number | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Title of template. */
	title?:
		| (
				| {
						/** Title for the template, as it exists in the database. */
						raw?: string | null;
						/** HTML title for the template, transformed for display. */
						rendered?: string | null;
						[key: string]: unknown;
				  }
				| string
		  )
		| null;
	/** Description of template. */
	description?: string | null;
	/** Status of template. */
	status?: string | null;
	/** Post ID. */
	wp_id?: number | null;
	/** Theme file exists. */
	has_theme_file?: WordpressJsonValue | null;
	/** The ID for the author of the template. */
	author?: number | null;
	/** The date the template was last modified, in the site's timezone. */
	modified?: string | null;
	/** Human readable text for the author. */
	author_text?: string | null;
	/** Where the template originally comes from e.g. 'theme' */
	original_source?: string | null;
	/** The date the template was published, in the site's timezone. */
	date?: string | null;
	/** Where the template part is intended for use (header, footer, etc.) */
	area?: string | null;
	[key: string]: unknown;
};

export type WordpressOperationInputs = {
	'abilities.categories.get': {
		/** Unique identifier for the ability category. */
		slug: string;
	};
	'abilities.categories.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
	};
	'abilities.get': {
		/** Unique identifier for the ability. */
		name: string;
	};
	'abilities.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to abilities in specific ability category. */
		category?: string;
		/** Limit results to abilities in a specific namespace. */
		namespace?: string;
		/** Limit results to abilities matching all of the given meta fields. */
		meta?: {
			/** Limit results to abilities matching the given behavioral annotations. */
			annotations?: {
				/** Whether the ability does not modify its environment. */
				readonly?: boolean | null;
				/** Whether the ability may perform destructive updates to its environment. */
				destructive?: boolean | null;
				/** Whether repeated calls with the same arguments have no additional effect. */
				idempotent?: boolean | null;
			};
		};
	};
	'abilities.run': {
		/** Unique identifier for the ability. */
		name: string;
		/** Input parameters for the ability execution. */
		input?: WordpressJsonValue;
	};
	'abilities.runDestructive': {
		/** Unique identifier for the ability. */
		name: string;
		/** Input parameters for the ability execution. */
		input?: WordpressJsonValue;
	};
	'abilities.runReadonly': {
		/** Unique identifier for the ability. */
		name: string;
		/** Input parameters for the ability execution. */
		input?: WordpressJsonValue;
	};
	'batch.run': {
		validation?: 'require-all-validate' | 'normal';
		requests: Array<{
			method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
			path: string;
			body?: Record<string, WordpressJsonValue>;
			headers?: Record<string, string | Array<string>>;
		}>;
	};
	'blockDirectory.search': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit result set to blocks matching the search term. */
		term: string;
	};
	'blockEditor.export': Record<string, never>;
	'blockEditor.navigationFallback': Record<string, never>;
	'blockEditor.urlDetails': {
		/** The URL to process. */
		url: string;
	};
	'blockPatterns.categories': Record<string, never>;
	'blockPatterns.list': Record<string, never>;
	'blockRenderer.render': {
		/** Unique registered name for the block. */
		name: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'edit';
		/** Attributes for the block. */
		attributes?: Record<string, WordpressJsonValue>;
		/** ID of the post context. */
		post_id?: number;
	};
	'blockTypes.get': {
		/** Block namespace. */
		namespace: string;
		/** Block name. */
		name: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'blockTypes.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Block namespace. */
		namespace?: string;
	};
	'blockTypes.listByNamespace': {
		/** Block namespace. */
		namespace: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'blocks.autosaves.create': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** Meta fields. */
		meta?: {
			wp_pattern_sync_status?: 'partial' | 'unsynced';
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the wp_pattern_category taxonomy. */
		wp_pattern_category?: Array<number>;
	};
	'blocks.autosaves.get': {
		/** The ID for the parent of the autosave. */
		parent: number;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'blocks.autosaves.list': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'blocks.create': {
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** Meta fields. */
		meta?: {
			wp_pattern_sync_status?: 'partial' | 'unsynced';
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the wp_pattern_category taxonomy. */
		wp_pattern_category?: Array<number>;
	};
	'blocks.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'blocks.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Override the default excerpt length. */
		excerpt_length?: number;
		/** The password for the post if it is password protected. */
		password?: string;
	};
	'blocks.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<
			| 'publish'
			| 'future'
			| 'draft'
			| 'pending'
			| 'private'
			| 'trash'
			| 'auto-draft'
			| 'inherit'
			| 'request-pending'
			| 'request-confirmed'
			| 'request-failed'
			| 'request-completed'
			| 'any'
		>;
		/** Limit result set based on relationship between multiple taxonomies. */
		tax_relation?: 'AND' | 'OR';
		/** Limit result set to items with specific terms assigned in the wp_pattern_category taxonomy. */
		wp_pattern_category?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
					/** Whether items must be assigned all or any of the specified terms. */
					operator?: 'AND' | 'OR';
			  };
		/** Limit result set to items except those with specific terms assigned in the wp_pattern_category taxonomy. */
		wp_pattern_category_exclude?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
			  };
	};
	'blocks.revisions.delete': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'blocks.revisions.get': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'blocks.revisions.list': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'blocks.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** Meta fields. */
		meta?: {
			wp_pattern_sync_status?: 'partial' | 'unsynced';
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the wp_pattern_category taxonomy. */
		wp_pattern_category?: Array<number>;
	};
	'categories.create': {
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** The parent term ID. */
		parent?: number;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'categories.delete': {
		/** Unique identifier for the term. */
		id: number;
		/** Required to be true, as terms do not support trashing. */
		force?: boolean;
	};
	'categories.get': {
		/** Unique identifier for the term. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'categories.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by term attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'include_slugs'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide terms not assigned to any posts. */
		hide_empty?: boolean;
		/** Limit result set to terms assigned to a specific parent. */
		parent?: number;
		/** Limit result set to terms assigned to a specific post. */
		post?: number;
		/** Limit result set to terms with one or more specific slugs. */
		slug?: Array<string>;
	};
	'categories.update': {
		/** Unique identifier for the term. */
		id: number;
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name?: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** The parent term ID. */
		parent?: number;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'comments.create': {
		/** The ID of the user object, if author was a user. */
		author?: number;
		/** Email address for the comment author. */
		author_email?: string;
		/** IP address for the comment author. */
		author_ip?: string;
		/** Display name for the comment author. */
		author_name?: string;
		/** URL for the comment author. */
		author_url?: string;
		/** User agent for the comment author. */
		author_user_agent?: string;
		/** The content for the comment. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the comment, as it exists in the database. */
					raw?: string;
			  };
		/** The date the comment was published, in the site's timezone. */
		date?: string;
		/** The date the comment was published, as GMT. */
		date_gmt?: string;
		/** The ID for the parent of the comment. */
		parent?: number;
		/** The ID of the associated post object. */
		post?: number;
		/** State of the comment. */
		status?: string;
		/** Meta fields. */
		meta?: {
			/** Note resolution status */
			_wp_note_status?: 'resolved' | 'reopen';
		};
	};
	'comments.delete': {
		/** Unique identifier for the comment. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
		/** The password for the parent post of the comment (if the post is password protected). */
		password?: string;
	};
	'comments.get': {
		/** Unique identifier for the comment. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** The password for the parent post of the comment (if the post is password protected). */
		password?: string;
	};
	'comments.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to comments published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit result set to comments assigned to specific user IDs. Requires authorization. */
		author?: Array<number>;
		/** Ensure result set excludes comments assigned to specific user IDs. Requires authorization. */
		author_exclude?: Array<number>;
		/** Limit result set to that from a specific author email. Requires authorization. */
		author_email?: string;
		/** Limit response to comments published before a given ISO8601 compliant date. */
		before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by comment attribute. */
		orderby?:
			| 'date'
			| 'date_gmt'
			| 'id'
			| 'include'
			| 'post'
			| 'parent'
			| 'type';
		/** Limit result set to comments of specific parent IDs. */
		parent?: Array<number>;
		/** Ensure result set excludes specific parent IDs. */
		parent_exclude?: Array<number>;
		/** Limit result set to comments assigned to specific post IDs. */
		post?: Array<number>;
		/** Limit result set to comments assigned a specific status. Requires authorization. */
		status?: string;
		/** Limit result set to comments assigned a specific type. Requires authorization. */
		type?: string;
		/** The password for the post if it is password protected. */
		password?: string;
	};
	'comments.update': {
		/** Unique identifier for the comment. */
		id: number;
		/** The ID of the user object, if author was a user. */
		author?: number;
		/** Email address for the comment author. */
		author_email?: string;
		/** IP address for the comment author. */
		author_ip?: string;
		/** Display name for the comment author. */
		author_name?: string;
		/** URL for the comment author. */
		author_url?: string;
		/** User agent for the comment author. */
		author_user_agent?: string;
		/** The content for the comment. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the comment, as it exists in the database. */
					raw?: string;
			  };
		/** The date the comment was published, in the site's timezone. */
		date?: string;
		/** The date the comment was published, as GMT. */
		date_gmt?: string;
		/** The ID for the parent of the comment. */
		parent?: number;
		/** The ID of the associated post object. */
		post?: number;
		/** State of the comment. */
		status?: string;
		/** Meta fields. */
		meta?: {
			/** Note resolution status */
			_wp_note_status?: 'resolved' | 'reopen';
		};
	};
	'fontCollections.get': {
		/** The slug. */
		slug: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'fontCollections.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
	};
	'fontFamilies.create': {
		/** Version of the theme.json schema used for the typography settings. */
		theme_json_version?: number;
		/** font-family declaration in theme.json format, encoded as a string. */
		font_family_settings: string;
	};
	'fontFamilies.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'fontFamilies.fontFaces.create': {
		/** The ID for the parent font family of the font face. */
		font_family_id: number;
		/** Version of the theme.json schema used for the typography settings. */
		theme_json_version?: number;
		/** font-face declaration in theme.json format, encoded as a string. */
		font_face_settings: string;
	};
	'fontFamilies.fontFaces.delete': {
		/** The ID for the parent font family of the font face. */
		font_family_id: number;
		/** Unique identifier for the font face. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'fontFamilies.fontFaces.get': {
		/** The ID for the parent font family of the font face. */
		font_family_id: number;
		/** Unique identifier for the font face. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'fontFamilies.fontFaces.list': {
		/** The ID for the parent font family of the font face. */
		font_family_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?: 'id' | 'include';
	};
	'fontFamilies.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'fontFamilies.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?: 'id' | 'include';
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
	};
	'fontFamilies.update': {
		/** Unique identifier for the post. */
		id: number;
		/** Version of the theme.json schema used for the typography settings. */
		theme_json_version?: number;
		/** font-family declaration in theme.json format, encoded as a string. */
		font_family_settings: string;
	};
	'globalStyles.get': {
		/** ID of global styles config. */
		id: string;
	};
	'globalStyles.revisions.get': {
		/** The ID for the parent of the global styles revision. */
		parent: number;
		/** Unique identifier for the global styles revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'globalStyles.revisions.list': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Offset the result set by a specific number of items. */
		offset?: number;
	};
	'globalStyles.theme': {
		/** The theme identifier */
		stylesheet: string;
	};
	'globalStyles.themeVariations': {
		/** The theme identifier */
		stylesheet: string;
	};
	'globalStyles.update': {
		/** Unique identifier of the record. */
		id: string;
		/** Global styles. */
		styles?: Record<string, WordpressJsonValue>;
		/** Global settings. */
		settings?: Record<string, WordpressJsonValue>;
		/** Title of the global styles variation. */
		title?:
			| {
					/** Title for the global styles variation, as it exists in the database. */
					raw?: string;
			  }
			| string;
	};
	'iconCollections.get': {
		/** Icon collection slug. */
		slug: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'iconCollections.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
	};
	'icons.get': {
		/** Icon name. */
		name: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'icons.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit results to icons belonging to the given collection slug. */
		collection?: string;
	};
	'icons.listByCollection': {
		/** Limit results to icons belonging to the given collection slug. */
		collection: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
	};
	'media.create': {
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
		/** The theme file to use to display the post. */
		template?: string;
		/** Alternative text to display when attachment is not displayed. */
		alt_text?: string;
		/** The attachment caption. A string, or `{ raw }`. */
		caption?:
			| string
			| {
					/** Caption for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The attachment description. A string, or `{ raw }`. */
		description?:
			| string
			| {
					/** Description for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the associated post of the attachment. */
		post?: number;
		/** Whether to generate image sub sizes. */
		generate_sub_sizes?: boolean;
		/** Whether to convert image formats. */
		convert_format?: boolean;
		/** URL of an external image to sideload into the media library, instead of uploading a file. */
		url?: string;
		/** The file to upload: a public URL, `{ url }`, or `{ base64, filename, contentType }`. It is sent as the request body with its file name in Content-Disposition. */
		file?: FileInput;
	};
	'media.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'media.edit': {
		/** Unique identifier of the record. */
		id: number;
		/** URL to the edited image file. */
		src: string;
		/** Array of image edits. */
		modifiers?: Array<
			| {
					/** Flip type. */
					type?: 'flip';
					/** Flip arguments. */
					args?: {
						/** Flip direction. */
						flip: {
							/** Whether to flip in the horizontal direction. */
							horizontal: boolean;
							/** Whether to flip in the vertical direction. */
							vertical: boolean;
						};
					};
			  }
			| {
					/** Rotation type. */
					type?: 'rotate';
					/** Rotation arguments. */
					args?: {
						/** Angle to rotate clockwise in degrees. */
						angle: number;
					};
			  }
			| {
					/** Crop type. */
					type?: 'crop';
					/** Crop arguments. */
					args?: {
						/** Horizontal position from the left to begin the crop as a percentage of the image width. */
						left: number;
						/** Vertical position from the top to begin the crop as a percentage of the image height. */
						top: number;
						/** Width of the crop as a percentage of the image width. */
						width: number;
						/** Height of the crop as a percentage of the image height. */
						height: number;
					};
			  }
		>;
		/** The amount to rotate the image clockwise in degrees. DEPRECATED: Use `modifiers` instead. */
		rotation?: number;
		/** As a percentage of the image, the x position to start the crop from. DEPRECATED: Use `modifiers` instead. */
		x?: number;
		/** As a percentage of the image, the y position to start the crop from. DEPRECATED: Use `modifiers` instead. */
		y?: number;
		/** As a percentage of the image, the width to crop the image to. DEPRECATED: Use `modifiers` instead. */
		width?: number;
		/** As a percentage of the image, the height to crop the image to. DEPRECATED: Use `modifiers` instead. */
		height?: number;
		/** The attachment caption. A string, or `{ raw }`. */
		caption?:
			| string
			| {
					/** Caption for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The attachment description. A string, or `{ raw }`. */
		description?:
			| string
			| {
					/** Description for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the associated post of the attachment. */
		post?: number;
		/** Alternative text to display when attachment is not displayed. */
		alt_text?: string;
	};
	'media.finalize': {
		/** Unique identifier for the attachment. */
		id: number;
		/** Array of sub-size metadata collected from sideload responses. */
		sub_sizes?: Array<{
			/** Size name, or an array of size names when a single file is registered under multiple sizes with matching dimensions. */
			image_size: string | Array<string>;
			width?: number;
			height?: number;
			file?: string;
			mime_type?: string;
			filesize?: number;
			original_image?: string;
		}>;
	};
	'media.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'media.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit result set to posts assigned to specific authors. */
		author?: Array<number>;
		/** Ensure result set excludes posts assigned to specific authors. */
		author_exclude?: Array<number>;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
		/** Limit result set to items with particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<'inherit' | 'private' | 'trash'>;
		/** Limit result set to attachments of a particular media type or media types. */
		media_type?: Array<'image' | 'video' | 'text' | 'application' | 'audio'>;
		/** Limit result set to attachments of a particular MIME type or MIME types. */
		mime_type?: Array<string>;
	};
	'media.postProcess': {
		/** Unique identifier for the attachment. */
		id: number;
		action: 'create-image-subsizes';
	};
	'media.sideload': {
		/** Unique identifier for the attachment. */
		id: number;
		/** Image size. Can be a single size name or an array of size names to register the same file under multiple sizes. */
		image_size: string | Array<string>;
		/** Whether to convert image formats. */
		convert_format?: boolean;
		/** The file to upload: a public URL, `{ url }`, or `{ base64, filename, contentType }`. It is sent as the request body with its file name in Content-Disposition. */
		file: FileInput;
	};
	'media.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
		/** The theme file to use to display the post. */
		template?: string;
		/** Alternative text to display when attachment is not displayed. */
		alt_text?: string;
		/** The attachment caption. A string, or `{ raw }`. */
		caption?:
			| string
			| {
					/** Caption for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The attachment description. A string, or `{ raw }`. */
		description?:
			| string
			| {
					/** Description for the attachment, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the associated post of the attachment. */
		post?: number;
	};
	'menuItems.autosaves.create': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the object. */
		parent?: number;
		/** The title for the object. */
		title?:
			| string
			| {
					/** Title for the object, as it exists in the database. */
					raw?: string;
			  };
		/** The family of objects originally represented, such as "post_type" or "taxonomy". */
		type?: 'taxonomy' | 'post_type' | 'post_type_archive' | 'custom';
		/** A named status for the object. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** Text for the title attribute of the link element for this menu item. */
		attr_title?: string;
		/** Class names for the link element of this menu item. */
		classes?: Array<string>;
		/** The description of this menu item. */
		description?: string;
		/** The DB ID of the nav_menu_item that is this item's menu parent, if any, otherwise 0. */
		menu_order?: number;
		/** The type of object originally represented, such as "category", "post", or "attachment". */
		object?: string;
		/** The database ID of the original object this menu item represents, for example the ID for posts or the term_id for categories. */
		object_id?: number;
		/** The target attribute of the link element for this menu item. */
		target?: '_blank' | '';
		/** The URL to which this menu item points. */
		url?: string;
		/** The XFN relationship expressed in the link of this menu item. */
		xfn?: Array<string>;
		/** The terms assigned to the object in the nav_menu taxonomy. */
		menus?: number;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'menuItems.autosaves.get': {
		/** The ID for the parent of the autosave. */
		parent: number;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menuItems.autosaves.list': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menuItems.create': {
		/** The title for the object. */
		title?:
			| string
			| {
					/** Title for the object, as it exists in the database. */
					raw?: string;
			  };
		/** The family of objects originally represented, such as "post_type" or "taxonomy". */
		type?: 'taxonomy' | 'post_type' | 'post_type_archive' | 'custom';
		/** A named status for the object. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the parent of the object. */
		parent?: number;
		/** Text for the title attribute of the link element for this menu item. */
		attr_title?: string;
		/** Class names for the link element of this menu item. */
		classes?: Array<string>;
		/** The description of this menu item. */
		description?: string;
		/** The DB ID of the nav_menu_item that is this item's menu parent, if any, otherwise 0. */
		menu_order?: number;
		/** The type of object originally represented, such as "category", "post", or "attachment". */
		object?: string;
		/** The database ID of the original object this menu item represents, for example the ID for posts or the term_id for categories. */
		object_id?: number;
		/** The target attribute of the link element for this menu item. */
		target?: '_blank' | '';
		/** The URL to which this menu item points. */
		url?: string;
		/** The XFN relationship expressed in the link of this menu item. */
		xfn?: Array<string>;
		/** The terms assigned to the object in the nav_menu taxonomy. */
		menus?: number;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'menuItems.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'menuItems.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menuItems.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title'
			| 'menu_order';
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<
			| 'publish'
			| 'future'
			| 'draft'
			| 'pending'
			| 'private'
			| 'trash'
			| 'auto-draft'
			| 'inherit'
			| 'request-pending'
			| 'request-confirmed'
			| 'request-failed'
			| 'request-completed'
			| 'any'
		>;
		/** Limit result set based on relationship between multiple taxonomies. */
		tax_relation?: 'AND' | 'OR';
		/** Limit result set to items with specific terms assigned in the menus taxonomy. */
		menus?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
					/** Whether items must be assigned all or any of the specified terms. */
					operator?: 'AND' | 'OR';
			  };
		/** Limit result set to items except those with specific terms assigned in the menus taxonomy. */
		menus_exclude?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
			  };
		/** Limit result set to posts with a specific menu_order value. */
		menu_order?: number;
	};
	'menuItems.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The title for the object. */
		title?:
			| string
			| {
					/** Title for the object, as it exists in the database. */
					raw?: string;
			  };
		/** The family of objects originally represented, such as "post_type" or "taxonomy". */
		type?: 'taxonomy' | 'post_type' | 'post_type_archive' | 'custom';
		/** A named status for the object. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the parent of the object. */
		parent?: number;
		/** Text for the title attribute of the link element for this menu item. */
		attr_title?: string;
		/** Class names for the link element of this menu item. */
		classes?: Array<string>;
		/** The description of this menu item. */
		description?: string;
		/** The DB ID of the nav_menu_item that is this item's menu parent, if any, otherwise 0. */
		menu_order?: number;
		/** The type of object originally represented, such as "category", "post", or "attachment". */
		object?: string;
		/** The database ID of the original object this menu item represents, for example the ID for posts or the term_id for categories. */
		object_id?: number;
		/** The target attribute of the link element for this menu item. */
		target?: '_blank' | '';
		/** The URL to which this menu item points. */
		url?: string;
		/** The XFN relationship expressed in the link of this menu item. */
		xfn?: Array<string>;
		/** The terms assigned to the object in the nav_menu taxonomy. */
		menus?: number;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'menuLocations.get': {
		/** An alphanumeric identifier for the menu location. */
		location: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menuLocations.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menus.create': {
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
		/** The locations assigned to the menu. */
		locations?: Array<string>;
		/** Whether to automatically add top level pages to this menu. */
		auto_add?: boolean;
	};
	'menus.delete': {
		/** Unique identifier for the term. */
		id: number;
		/** Required to be true, as terms do not support trashing. */
		force?: boolean;
	};
	'menus.get': {
		/** Unique identifier for the term. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'menus.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by term attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'include_slugs'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide terms not assigned to any posts. */
		hide_empty?: boolean;
		/** Limit result set to terms assigned to a specific post. */
		post?: number;
		/** Limit result set to terms with one or more specific slugs. */
		slug?: Array<string>;
	};
	'menus.update': {
		/** Unique identifier for the term. */
		id: number;
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name?: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
		/** The locations assigned to the menu. */
		locations?: Array<string>;
		/** Whether to automatically add top level pages to this menu. */
		auto_add?: boolean;
	};
	'navigation.autosaves.create': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The theme file to use to display the post. */
		template?: string;
	};
	'navigation.autosaves.get': {
		/** The ID for the parent of the autosave. */
		parent: number;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'navigation.autosaves.list': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'navigation.create': {
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The theme file to use to display the post. */
		template?: string;
	};
	'navigation.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'navigation.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** The password for the post if it is password protected. */
		password?: string;
	};
	'navigation.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<
			| 'publish'
			| 'future'
			| 'draft'
			| 'pending'
			| 'private'
			| 'trash'
			| 'auto-draft'
			| 'inherit'
			| 'request-pending'
			| 'request-confirmed'
			| 'request-failed'
			| 'request-completed'
			| 'any'
		>;
	};
	'navigation.revisions.delete': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'navigation.revisions.get': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'navigation.revisions.list': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'navigation.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The theme file to use to display the post. */
		template?: string;
	};
	'oembed.embed': {
		/** The URL of the resource for which to fetch oEmbed data. */
		url: string;
		format?: WordpressJsonValue;
		maxwidth?: WordpressJsonValue;
	};
	'oembed.proxy': {
		/** The URL of the resource for which to fetch oEmbed data. */
		url: string;
		/** The oEmbed format to use. */
		format?: 'json' | 'xml';
		/** The maximum width of the embed frame in pixels. */
		maxwidth?: number;
		/** The maximum height of the embed frame in pixels. */
		maxheight?: number;
		/** Whether to perform an oEmbed discovery request for unsanctioned providers. */
		discover?: boolean;
	};
	'pages.autosaves.create': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the post. */
		parent?: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The order of the post in relation to other posts. */
		menu_order?: number;
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
	};
	'pages.autosaves.get': {
		/** The ID for the parent of the autosave. */
		parent: number;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'pages.autosaves.list': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'pages.create': {
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The ID for the parent of the post. */
		parent?: number;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The order of the post in relation to other posts. */
		menu_order?: number;
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
	};
	'pages.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'pages.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Override the default excerpt length. */
		excerpt_length?: number;
		/** The password for the post if it is password protected. */
		password?: string;
	};
	'pages.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit result set to posts assigned to specific authors. */
		author?: Array<number>;
		/** Ensure result set excludes posts assigned to specific authors. */
		author_exclude?: Array<number>;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Limit result set to posts with a specific menu_order value. */
		menu_order?: number;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title'
			| 'menu_order';
		/** Limit result set to items with particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<
			| 'publish'
			| 'future'
			| 'draft'
			| 'pending'
			| 'private'
			| 'trash'
			| 'auto-draft'
			| 'inherit'
			| 'request-pending'
			| 'request-confirmed'
			| 'request-failed'
			| 'request-completed'
			| 'any'
		>;
	};
	'pages.revisions.delete': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'pages.revisions.get': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'pages.revisions.list': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'pages.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The ID for the parent of the post. */
		parent?: number;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The order of the post in relation to other posts. */
		menu_order?: number;
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** The theme file to use to display the post. */
		template?: string;
	};
	'patternCategories.create': {
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'patternCategories.delete': {
		/** Unique identifier for the term. */
		id: number;
		/** Required to be true, as terms do not support trashing. */
		force?: boolean;
	};
	'patternCategories.get': {
		/** Unique identifier for the term. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'patternCategories.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by term attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'include_slugs'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide terms not assigned to any posts. */
		hide_empty?: boolean;
		/** Limit result set to terms assigned to a specific post. */
		post?: number;
		/** Limit result set to terms with one or more specific slugs. */
		slug?: Array<string>;
	};
	'patternCategories.update': {
		/** Unique identifier for the term. */
		id: number;
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name?: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'patternDirectory.search': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit results to those matching a category ID. */
		category?: number;
		/** Limit results to those matching a keyword ID. */
		keyword?: number;
		/** Limit results to those matching a pattern (slug). */
		slug?: Array<WordpressJsonValue>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title'
			| 'favorite_count';
	};
	'plugins.delete': {
		/** The plugin file without `.php`, for example `akismet/akismet`. */
		plugin: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'plugins.get': {
		/** The plugin file without `.php`, for example `akismet/akismet`. */
		plugin: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'plugins.install': {
		/** WordPress.org plugin directory slug. */
		slug: string;
		/** The plugin activation status. */
		status?: 'inactive' | 'active';
	};
	'plugins.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Limit results to those matching a string. */
		search?: string;
		/** Limits results to plugins with the given status. */
		status?: Array<'inactive' | 'active'>;
	};
	'plugins.update': {
		/** The plugin file without `.php`, for example `akismet/akismet`. */
		plugin: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** The plugin activation status. */
		status?: 'inactive' | 'active';
	};
	'posts.autosaves.create': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The format for the post. */
		format?:
			| 'standard'
			| 'aside'
			| 'chat'
			| 'gallery'
			| 'link'
			| 'image'
			| 'quote'
			| 'status'
			| 'video'
			| 'audio';
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** Whether or not the post should be treated as sticky. */
		sticky?: boolean;
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the category taxonomy. */
		categories?: Array<number>;
		/** The terms assigned to the post in the post_tag taxonomy. */
		tags?: Array<number>;
	};
	'posts.autosaves.get': {
		/** The ID for the parent of the autosave. */
		parent: number;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'posts.autosaves.list': {
		/** Unique identifier of the record. */
		id: number;
		/** The ID for the parent of the autosave. */
		parent?: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'posts.create': {
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The format for the post. */
		format?:
			| 'standard'
			| 'aside'
			| 'chat'
			| 'gallery'
			| 'link'
			| 'image'
			| 'quote'
			| 'status'
			| 'video'
			| 'audio';
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** Whether or not the post should be treated as sticky. */
		sticky?: boolean;
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the category taxonomy. */
		categories?: Array<number>;
		/** The terms assigned to the post in the post_tag taxonomy. */
		tags?: Array<number>;
	};
	'posts.delete': {
		/** Unique identifier for the post. */
		id: number;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'posts.get': {
		/** Unique identifier for the post. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Override the default excerpt length. */
		excerpt_length?: number;
		/** The password for the post if it is password protected. */
		password?: string;
	};
	'posts.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to posts published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to posts modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit result set to posts assigned to specific authors. */
		author?: Array<number>;
		/** Ensure result set excludes posts assigned to specific authors. */
		author_exclude?: Array<number>;
		/** Limit response to posts published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to posts modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** How to interpret the search input. */
		search_semantics?: 'exact';
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by post attribute. */
		orderby?:
			| 'author'
			| 'date'
			| 'id'
			| 'include'
			| 'modified'
			| 'parent'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
		/** Array of column names to be searched. */
		search_columns?: Array<'post_title' | 'post_content' | 'post_excerpt'>;
		/** Limit result set to posts with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to posts assigned one or more statuses. */
		status?: Array<
			| 'publish'
			| 'future'
			| 'draft'
			| 'pending'
			| 'private'
			| 'trash'
			| 'auto-draft'
			| 'inherit'
			| 'request-pending'
			| 'request-confirmed'
			| 'request-failed'
			| 'request-completed'
			| 'any'
		>;
		/** Limit result set based on relationship between multiple taxonomies. */
		tax_relation?: 'AND' | 'OR';
		/** Limit result set to items with specific terms assigned in the categories taxonomy. */
		categories?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
					/** Whether to include child terms in the terms limiting the result set. */
					include_children?: boolean;
					/** Whether items must be assigned all or any of the specified terms. */
					operator?: 'AND' | 'OR';
			  };
		/** Limit result set to items except those with specific terms assigned in the categories taxonomy. */
		categories_exclude?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
					/** Whether to include child terms in the terms limiting the result set. */
					include_children?: boolean;
			  };
		/** Limit result set to items with specific terms assigned in the tags taxonomy. */
		tags?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
					/** Whether items must be assigned all or any of the specified terms. */
					operator?: 'AND' | 'OR';
			  };
		/** Limit result set to items except those with specific terms assigned in the tags taxonomy. */
		tags_exclude?:
			| Array<number>
			| {
					/** Term IDs. */
					terms?: Array<number>;
			  };
		/** Limit result set to items that are sticky. */
		sticky?: boolean;
		/** Whether to ignore sticky posts or not. */
		ignore_sticky?: boolean;
		/** Limit result set to items assigned one or more given formats. */
		format?: Array<
			| 'standard'
			| 'aside'
			| 'chat'
			| 'gallery'
			| 'link'
			| 'image'
			| 'quote'
			| 'status'
			| 'video'
			| 'audio'
		>;
	};
	'posts.revisions.delete': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'posts.revisions.get': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'posts.revisions.list': {
		/** The ID for the parent of the revision. */
		parent: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'posts.update': {
		/** Unique identifier for the post. */
		id: number;
		/** The date the post was published, in the site's timezone. */
		date?: string | null;
		/** The date the post was published, as GMT. */
		date_gmt?: string | null;
		/** An alphanumeric identifier for the post unique to its type. */
		slug?: string;
		/** A named status for the post. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** A password to protect access to the content and excerpt. */
		password?: string;
		/** The title for the post. A string, or `{ raw }`. */
		title?:
			| string
			| {
					/** Title for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The content for the post. A string, or `{ raw }`. */
		content?:
			| string
			| {
					/** Content for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID for the author of the post. */
		author?: number;
		/** The excerpt for the post. A string, or `{ raw }`. */
		excerpt?:
			| string
			| {
					/** Excerpt for the post, as it exists in the database. */
					raw?: string;
			  };
		/** The ID of the featured media for the post. */
		featured_media?: number;
		/** Whether or not comments are open on the post. */
		comment_status?: 'open' | 'closed';
		/** Whether or not the post can be pinged. */
		ping_status?: 'open' | 'closed';
		/** The format for the post. */
		format?:
			| 'standard'
			| 'aside'
			| 'chat'
			| 'gallery'
			| 'link'
			| 'image'
			| 'quote'
			| 'status'
			| 'video'
			| 'audio';
		/** Meta fields. */
		meta?: {
			footnotes?: string;
		};
		/** Whether or not the post should be treated as sticky. */
		sticky?: boolean;
		/** The theme file to use to display the post. */
		template?: string;
		/** The terms assigned to the post in the category taxonomy. */
		categories?: Array<number>;
		/** The terms assigned to the post in the post_tag taxonomy. */
		tags?: Array<number>;
	};
	'rest.get': {
		/** The route under /wp-json, without a leading slash: `wp/v2/product`, `wp/v2/book/12`, `yoast/v1/get_head`, `acf/v3/options`. */
		route: string;
		/** Query string parameters, sent as given (lists as `key[]`, objects as `key[sub]`). */
		query?: Record<string, WordpressJsonValue>;
	};
	'rest.send': {
		/** The route under /wp-json, without a leading slash: `wp/v2/product`, `wp/v2/book/12`, `yoast/v1/get_head`, `acf/v3/options`. */
		route: string;
		/** The HTTP method. Default POST. */
		method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
		/** Query string parameters, sent as given (lists as `key[]`, objects as `key[sub]`). */
		query?: Record<string, WordpressJsonValue>;
		/** The JSON body. */
		body?: Record<string, WordpressJsonValue>;
	};
	'search.query': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit results to items of an object type. */
		type?: 'post' | 'term' | 'post-format';
		/** Limit results to items of one or more object subtypes. */
		subtype?: Array<'post' | 'page' | 'category' | 'post_tag' | 'any'>;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
	};
	'settings.get': Record<string, never>;
	'settings.update': {
		/** Site title. */
		title?: string;
		/** Site tagline. */
		description?: string;
		/** Site URL. */
		url?: string;
		/** This address is used for admin purposes, like new user notification. */
		email?: string;
		/** A city in the same timezone as you. */
		timezone?: string;
		/** A date format for all date strings. */
		date_format?: string;
		/** A time format for all time strings. */
		time_format?: string;
		/** A day number of the week that the week should start on. */
		start_of_week?: number;
		/** WordPress locale code. */
		language?: string;
		/** Convert emoticons like :-) and :-P to graphics on display. */
		use_smilies?: boolean;
		/** Default post category. */
		default_category?: number;
		/** Default post format. */
		default_post_format?: string;
		/** Blog pages show at most. */
		posts_per_page?: number;
		/** What to show on the front page */
		show_on_front?: string;
		/** The ID of the page that should be displayed on the front page */
		page_on_front?: number;
		/** The ID of the page that should display the latest posts */
		page_for_posts?: number;
		/** Allow link notifications from other blogs (pingbacks and trackbacks) on new articles. */
		default_ping_status?: 'open' | 'closed';
		/** Allow people to submit comments on new posts. */
		default_comment_status?: 'open' | 'closed';
		/** Site logo. */
		site_logo?: number;
		/** Site icon. */
		site_icon?: number;
	};
	'sidebars.get': {
		/** The id of a registered sidebar */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'sidebars.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'sidebars.update': {
		/** Unique identifier of the record. */
		id: string;
		/** Nested widgets. */
		widgets?: Array<Record<string, WordpressJsonValue> | string>;
	};
	'site.index': {
		context?: WordpressJsonValue;
	};
	'siteHealth.authorizationHeader': Record<string, never>;
	'siteHealth.backgroundUpdates': Record<string, never>;
	'siteHealth.directorySizes': Record<string, never>;
	'siteHealth.dotorgCommunication': Record<string, never>;
	'siteHealth.httpsStatus': Record<string, never>;
	'siteHealth.loopbackRequests': Record<string, never>;
	'siteHealth.pageCache': Record<string, never>;
	'statuses.get': {
		/** An alphanumeric identifier for the status. */
		status: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'statuses.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'tags.create': {
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'tags.delete': {
		/** Unique identifier for the term. */
		id: number;
		/** Required to be true, as terms do not support trashing. */
		force?: boolean;
	};
	'tags.get': {
		/** Unique identifier for the term. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'tags.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by term attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'include_slugs'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide terms not assigned to any posts. */
		hide_empty?: boolean;
		/** Limit result set to terms assigned to a specific post. */
		post?: number;
		/** Limit result set to terms with one or more specific slugs. */
		slug?: Array<string>;
	};
	'tags.update': {
		/** Unique identifier for the term. */
		id: number;
		/** HTML description of the term. */
		description?: string;
		/** HTML title for the term. */
		name?: string;
		/** An alphanumeric identifier for the term unique to its type. */
		slug?: string;
		/** Meta fields. */
		meta?: Record<string, WordpressJsonValue>;
	};
	'taxonomies.get': {
		/** An alphanumeric identifier for the taxonomy. */
		taxonomy: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'taxonomies.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Limit results to taxonomies associated with a specific post type. */
		type?: string;
	};
	'templateParts.autosaves.create': {
		/** The id of a template */
		id: string;
		/** Unique slug identifying the template. */
		slug?: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
		/** Where the template part is intended for use (header, footer, etc.) */
		area?: string;
	};
	'templateParts.autosaves.get': {
		/** The id of a template */
		parent: string;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templateParts.autosaves.list': {
		/** The id of a template */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templateParts.create': {
		/** Unique slug identifying the template. */
		slug: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
		/** Where the template part is intended for use (header, footer, etc.) */
		area?: string;
	};
	'templateParts.delete': {
		/** The id of a template */
		id: string;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'templateParts.get': {
		/** The id of a template */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templateParts.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Limit to the specified post id. */
		wp_id?: number;
		/** Limit to the specified template part area. */
		area?: string;
		/** Post type to get the templates for. */
		post_type?: string;
	};
	'templateParts.lookup': {
		/** The slug of the template to get the fallback for */
		slug: string;
		/** Indicates if a template is custom or part of the template hierarchy */
		is_custom?: boolean;
		/** The template prefix for the created template. This is used to extract the main template type, e.g. in `taxonomy-books` extracts the `taxonomy` */
		template_prefix?: string;
	};
	'templateParts.revisions.delete': {
		/** The id of a template */
		parent: string;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'templateParts.revisions.get': {
		/** The id of a template */
		parent: string;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templateParts.revisions.list': {
		/** The id of a template */
		parent: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'templateParts.update': {
		/** The id of a template */
		id: string;
		/** Unique slug identifying the template. */
		slug?: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
		/** Where the template part is intended for use (header, footer, etc.) */
		area?: string;
	};
	'templates.autosaves.create': {
		/** The id of a template */
		id: string;
		/** Unique slug identifying the template. */
		slug?: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
	};
	'templates.autosaves.get': {
		/** The id of a template */
		parent: string;
		/** The ID for the autosave. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templates.autosaves.list': {
		/** The id of a template */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templates.create': {
		/** Unique slug identifying the template. */
		slug: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
	};
	'templates.delete': {
		/** The id of a template */
		id: string;
		/** Whether to bypass Trash and force deletion. */
		force?: boolean;
	};
	'templates.get': {
		/** The id of a template */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templates.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Limit to the specified post id. */
		wp_id?: number;
		/** Limit to the specified template part area. */
		area?: string;
		/** Post type to get the templates for. */
		post_type?: string;
	};
	'templates.lookup': {
		/** The slug of the template to get the fallback for */
		slug: string;
		/** Indicates if a template is custom or part of the template hierarchy */
		is_custom?: boolean;
		/** The template prefix for the created template. This is used to extract the main template type, e.g. in `taxonomy-books` extracts the `taxonomy` */
		template_prefix?: string;
	};
	'templates.revisions.delete': {
		/** The id of a template */
		parent: string;
		/** Unique identifier for the revision. */
		id: number;
		/** Required to be true, as revisions do not support trashing. */
		force?: boolean;
	};
	'templates.revisions.get': {
		/** The id of a template */
		parent: string;
		/** Unique identifier for the revision. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'templates.revisions.list': {
		/** The id of a template */
		parent: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'relevance'
			| 'slug'
			| 'include_slugs'
			| 'title';
	};
	'templates.update': {
		/** The id of a template */
		id: string;
		/** Unique slug identifying the template. */
		slug?: string;
		/** Theme identifier for the template. */
		theme?: string;
		/** Type of template. */
		type?: string;
		/** Content of template. */
		content?:
			| {
					/** Content for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Title of template. */
		title?:
			| {
					/** Title for the template, as it exists in the database. */
					raw?: string;
			  }
			| string;
		/** Description of template. */
		description?: string;
		/** Status of template. */
		status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
		/** The ID for the author of the template. */
		author?: number;
	};
	'themes.get': {
		/** The theme's stylesheet. This uniquely identifies the theme. */
		stylesheet: string;
	};
	'themes.list': {
		/** Limit result set to themes assigned one or more statuses. */
		status?: Array<'active' | 'inactive'>;
	};
	'types.get': {
		/** An alphanumeric identifier for the post type. */
		type: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'types.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.applicationPasswords.create': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** A UUID provided by the application to uniquely identify it. It is recommended to use an UUID v5 with the URL or DNS namespace. */
		app_id?: string | '';
		/** The name of the application password. */
		name: string;
	};
	'users.applicationPasswords.delete': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** The application password uuid. */
		uuid: string;
	};
	'users.applicationPasswords.deleteAll': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
	};
	'users.applicationPasswords.get': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** The application password uuid. */
		uuid: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.applicationPasswords.introspect': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.applicationPasswords.list': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.applicationPasswords.update': {
		/** A user id, or `me` for the authenticated user. */
		user_id: number | string;
		/** The application password uuid. */
		uuid: string;
		/** A UUID provided by the application to uniquely identify it. It is recommended to use an UUID v5 with the URL or DNS namespace. */
		app_id?: string | '';
		/** The name of the application password. */
		name?: string;
	};
	'users.create': {
		/** Login name for the user. */
		username: string;
		/** Display name for the user. */
		name?: string;
		/** First name for the user. */
		first_name?: string;
		/** Last name for the user. */
		last_name?: string;
		/** The email address for the user. */
		email: string;
		/** URL of the user. */
		url?: string;
		/** Description of the user. */
		description?: string;
		/** Locale for the user. */
		locale?: '' | 'en_US';
		/** The nickname for the user. */
		nickname?: string;
		/** An alphanumeric identifier for the user. */
		slug?: string;
		/** Roles assigned to the user. */
		roles?: Array<string>;
		/** Password for the user (never included). */
		password: string;
		/** Meta fields. */
		meta?: {
			persisted_preferences?: {
				/** The date and time the preferences were updated. */
				_modified?: string;
			};
		};
	};
	'users.delete': {
		/** Unique identifier for the user. */
		id: number;
		/** Required to be true, as users do not support trashing. */
		force?: boolean;
		/** Reassign the deleted user's posts and links to this user ID. */
		reassign: number;
	};
	'users.deleteMe': {
		/** Required to be true, as users do not support trashing. */
		force?: boolean;
		/** Reassign the deleted user's posts and links to this user ID. */
		reassign: number;
	};
	'users.get': {
		/** Unique identifier for the user. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by user attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'registered_date'
			| 'slug'
			| 'include_slugs'
			| 'email'
			| 'url';
		/** Limit result set to users with one or more specific slugs. */
		slug?: Array<string>;
		/** Limit result set to users matching at least one specific role provided. Accepts csv list or single role. */
		roles?: Array<string>;
		/** Limit result set to users matching at least one specific capability provided. Accepts csv list or single capability. */
		capabilities?: Array<string>;
		/** Limit result set to users who are considered authors. */
		who?: 'authors';
		/** Limit result set to users who have published posts. */
		has_published_posts?: boolean | Array<string>;
		/** Array of column names to be searched. */
		search_columns?: Array<'email' | 'name' | 'id' | 'username' | 'slug'>;
	};
	'users.me': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'users.update': {
		/** Unique identifier for the user. */
		id: number;
		/** Login name for the user. */
		username?: string;
		/** Display name for the user. */
		name?: string;
		/** First name for the user. */
		first_name?: string;
		/** Last name for the user. */
		last_name?: string;
		/** The email address for the user. */
		email?: string;
		/** URL of the user. */
		url?: string;
		/** Description of the user. */
		description?: string;
		/** Locale for the user. */
		locale?: '' | 'en_US';
		/** The nickname for the user. */
		nickname?: string;
		/** An alphanumeric identifier for the user. */
		slug?: string;
		/** Roles assigned to the user. */
		roles?: Array<string>;
		/** Password for the user (never included). */
		password?: string;
		/** Meta fields. */
		meta?: {
			persisted_preferences?: {
				/** The date and time the preferences were updated. */
				_modified?: string;
			};
		};
	};
	'users.updateMe': {
		/** Login name for the user. */
		username?: string;
		/** Display name for the user. */
		name?: string;
		/** First name for the user. */
		first_name?: string;
		/** Last name for the user. */
		last_name?: string;
		/** The email address for the user. */
		email?: string;
		/** URL of the user. */
		url?: string;
		/** Description of the user. */
		description?: string;
		/** Locale for the user. */
		locale?: '' | 'en_US';
		/** The nickname for the user. */
		nickname?: string;
		/** An alphanumeric identifier for the user. */
		slug?: string;
		/** Roles assigned to the user. */
		roles?: Array<string>;
		/** Password for the user (never included). */
		password?: string;
		/** Meta fields. */
		meta?: {
			persisted_preferences?: {
				/** The date and time the preferences were updated. */
				_modified?: string;
			};
		};
	};
	'viewConfig.get': {
		/** Entity kind. */
		kind: string;
		/** Entity name. */
		name: string;
	};
	'widgetTypes.encode': {
		/** The widget type id. */
		id: string;
		/** Current instance settings of the widget. */
		instance?: Record<string, WordpressJsonValue>;
		/** Serialized widget form data to encode into instance settings. */
		form_data?: string;
	};
	'widgetTypes.get': {
		/** The widget type id. */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'widgetTypes.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'widgetTypes.render': {
		/** The widget type id. */
		id: string;
		/** Current instance settings of the widget. */
		instance?: Record<string, WordpressJsonValue>;
	};
	'widgets.create': {
		/** Unique identifier for the widget. */
		id?: string;
		/** The type of the widget. Corresponds to ID in widget-types endpoint. */
		id_base?: string;
		/** The sidebar the widget belongs to. */
		sidebar: string;
		/** Instance settings of the widget, if supported. A string, or `{ raw }`. */
		instance?:
			| string
			| {
					/** Base64 encoded representation of the instance settings. */
					encoded?: string;
					/** Cryptographic hash of the instance settings. */
					hash?: string;
					/** Unencoded instance settings, if supported. */
					raw?: Record<string, WordpressJsonValue>;
			  };
		/** URL-encoded form data from the widget admin form. Used to update a widget that does not support instance. Write only. */
		form_data?: string;
	};
	'widgets.delete': {
		/** Unique identifier of the record. */
		id: string;
		/** Whether to force removal of the widget, or move it to the inactive sidebar. */
		force?: boolean;
	};
	'widgets.get': {
		/** Unique identifier of the record. */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
	};
	'widgets.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'embed' | 'edit';
		/** The sidebar to return widgets for. */
		sidebar?: string;
	};
	'widgets.update': {
		/** Unique identifier for the widget. */
		id: string;
		/** The type of the widget. Corresponds to ID in widget-types endpoint. */
		id_base?: string;
		/** The sidebar the widget belongs to. */
		sidebar?: string;
		/** Instance settings of the widget, if supported. A string, or `{ raw }`. */
		instance?:
			| string
			| {
					/** Base64 encoded representation of the instance settings. */
					encoded?: string;
					/** Cryptographic hash of the instance settings. */
					hash?: string;
					/** Unencoded instance settings, if supported. */
					raw?: Record<string, WordpressJsonValue>;
			  };
		/** URL-encoded form data from the widget admin form. Used to update a widget that does not support instance. Write only. */
		form_data?: string;
	};
};

export type WordpressOperationOutputs = {
	'abilities.categories.get': WordpressAbilityCategory;
	'abilities.categories.list': {
		/** One page of results. */
		items: Array<WordpressAbilityCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'abilities.get': WordpressAbility;
	'abilities.list': {
		/** One page of results. */
		items: Array<WordpressAbility>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'abilities.run': WordpressJsonValue;
	'abilities.runDestructive': WordpressJsonValue;
	'abilities.runReadonly': WordpressJsonValue;
	'batch.run': WordpressJsonValue;
	'blockDirectory.search': {
		/** One page of results. */
		items: Array<WordpressBlockDirectoryItem>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'blockEditor.export': FileOutput;
	'blockEditor.navigationFallback': WordpressNavigationFallback;
	'blockEditor.urlDetails': WordpressJsonValue;
	'blockPatterns.categories': Array<WordpressBlockPatternCategory>;
	'blockPatterns.list': Array<WordpressBlockPattern>;
	'blockRenderer.render': WordpressRenderedBlock;
	'blockTypes.get': WordpressBlockType;
	'blockTypes.list': Array<WordpressBlockType>;
	'blockTypes.listByNamespace': Array<WordpressBlockType>;
	'blocks.autosaves.create': WordpressWpBlockRevision2;
	'blocks.autosaves.get': WordpressWpBlockRevision2;
	'blocks.autosaves.list': Array<WordpressWpBlockRevision2>;
	'blocks.create': WordpressWpBlock;
	'blocks.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpBlock | null;
				[key: string]: unknown;
		  }
		| WordpressWpBlock;
	'blocks.get': WordpressWpBlock;
	'blocks.list': {
		/** One page of results. */
		items: Array<WordpressWpBlock>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'blocks.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpBlockRevision | null;
				[key: string]: unknown;
		  }
		| WordpressWpBlockRevision;
	'blocks.revisions.get': WordpressWpBlockRevision;
	'blocks.revisions.list': {
		/** One page of results. */
		items: Array<WordpressWpBlockRevision>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'blocks.update': WordpressWpBlock;
	'categories.create': WordpressCategory;
	'categories.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressCategory | null;
				[key: string]: unknown;
		  }
		| WordpressCategory;
	'categories.get': WordpressCategory;
	'categories.list': {
		/** One page of results. */
		items: Array<WordpressCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'categories.update': WordpressCategory;
	'comments.create': WordpressComment;
	'comments.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressComment | null;
				[key: string]: unknown;
		  }
		| WordpressComment;
	'comments.get': WordpressComment;
	'comments.list': {
		/** One page of results. */
		items: Array<WordpressComment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'comments.update': WordpressComment;
	'fontCollections.get': WordpressFontCollection;
	'fontCollections.list': {
		/** One page of results. */
		items: Array<WordpressFontCollection>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'fontFamilies.create': WordpressWpFontFamily;
	'fontFamilies.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpFontFamily | null;
				[key: string]: unknown;
		  }
		| WordpressWpFontFamily;
	'fontFamilies.fontFaces.create': WordpressWpFontFace;
	'fontFamilies.fontFaces.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpFontFace | null;
				[key: string]: unknown;
		  }
		| WordpressWpFontFace;
	'fontFamilies.fontFaces.get': WordpressWpFontFace;
	'fontFamilies.fontFaces.list': {
		/** One page of results. */
		items: Array<WordpressWpFontFace>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'fontFamilies.get': WordpressWpFontFamily;
	'fontFamilies.list': {
		/** One page of results. */
		items: Array<WordpressWpFontFamily>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'fontFamilies.update': WordpressWpFontFamily;
	'globalStyles.get': WordpressWpGlobalStyles;
	'globalStyles.revisions.get': WordpressWpGlobalStylesRevision;
	'globalStyles.revisions.list': {
		/** One page of results. */
		items: Array<WordpressWpGlobalStylesRevision>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'globalStyles.theme': WordpressJsonValue;
	'globalStyles.themeVariations': WordpressJsonValue;
	'globalStyles.update': WordpressWpGlobalStyles;
	'iconCollections.get': WordpressIconCollection;
	'iconCollections.list': {
		/** One page of results. */
		items: Array<WordpressIconCollection>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'icons.get': WordpressIcon;
	'icons.list': {
		/** One page of results. */
		items: Array<WordpressIcon>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'icons.listByCollection': Array<WordpressIcon>;
	'media.create': WordpressAttachment;
	'media.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressAttachment | null;
				[key: string]: unknown;
		  }
		| WordpressAttachment;
	'media.edit': WordpressJsonValue;
	'media.finalize': WordpressAttachment;
	'media.get': WordpressAttachment;
	'media.list': {
		/** One page of results. */
		items: Array<WordpressAttachment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'media.postProcess': WordpressJsonValue;
	'media.sideload': WordpressAttachment;
	'media.update': WordpressAttachment;
	'menuItems.autosaves.create': WordpressNavMenuItemRevision;
	'menuItems.autosaves.get': WordpressNavMenuItemRevision;
	'menuItems.autosaves.list': Array<WordpressNavMenuItemRevision>;
	'menuItems.create': WordpressNavMenuItem;
	'menuItems.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressNavMenuItem | null;
				[key: string]: unknown;
		  }
		| WordpressNavMenuItem;
	'menuItems.get': WordpressNavMenuItem;
	'menuItems.list': {
		/** One page of results. */
		items: Array<WordpressNavMenuItem>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'menuItems.update': WordpressNavMenuItem;
	'menuLocations.get': WordpressMenuLocation;
	'menuLocations.list': Record<string, WordpressMenuLocation>;
	'menus.create': WordpressNavMenu;
	'menus.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressNavMenu | null;
				[key: string]: unknown;
		  }
		| WordpressNavMenu;
	'menus.get': WordpressNavMenu;
	'menus.list': {
		/** One page of results. */
		items: Array<WordpressNavMenu>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'menus.update': WordpressNavMenu;
	'navigation.autosaves.create': WordpressWpNavigationRevision2;
	'navigation.autosaves.get': WordpressWpNavigationRevision2;
	'navigation.autosaves.list': Array<WordpressWpNavigationRevision2>;
	'navigation.create': WordpressWpNavigation;
	'navigation.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpNavigation | null;
				[key: string]: unknown;
		  }
		| WordpressWpNavigation;
	'navigation.get': WordpressWpNavigation;
	'navigation.list': {
		/** One page of results. */
		items: Array<WordpressWpNavigation>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'navigation.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpNavigationRevision | null;
				[key: string]: unknown;
		  }
		| WordpressWpNavigationRevision;
	'navigation.revisions.get': WordpressWpNavigationRevision;
	'navigation.revisions.list': {
		/** One page of results. */
		items: Array<WordpressWpNavigationRevision>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'navigation.update': WordpressWpNavigation;
	'oembed.embed': WordpressJsonValue;
	'oembed.proxy': WordpressJsonValue;
	'pages.autosaves.create': WordpressPageRevision2;
	'pages.autosaves.get': WordpressPageRevision2;
	'pages.autosaves.list': Array<WordpressPageRevision2>;
	'pages.create': WordpressPage;
	'pages.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressPage | null;
				[key: string]: unknown;
		  }
		| WordpressPage;
	'pages.get': WordpressPage;
	'pages.list': {
		/** One page of results. */
		items: Array<WordpressPage>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pages.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressPageRevision | null;
				[key: string]: unknown;
		  }
		| WordpressPageRevision;
	'pages.revisions.get': WordpressPageRevision;
	'pages.revisions.list': {
		/** One page of results. */
		items: Array<WordpressPageRevision>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'pages.update': WordpressPage;
	'patternCategories.create': WordpressWpPatternCategory;
	'patternCategories.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpPatternCategory | null;
				[key: string]: unknown;
		  }
		| WordpressWpPatternCategory;
	'patternCategories.get': WordpressWpPatternCategory;
	'patternCategories.list': {
		/** One page of results. */
		items: Array<WordpressWpPatternCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'patternCategories.update': WordpressWpPatternCategory;
	'patternDirectory.search': {
		/** One page of results. */
		items: Array<WordpressPatternDirectoryItem>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'plugins.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressPlugin | null;
				[key: string]: unknown;
		  }
		| WordpressPlugin;
	'plugins.get': WordpressPlugin;
	'plugins.install': WordpressPlugin;
	'plugins.list': Array<WordpressPlugin>;
	'plugins.update': WordpressPlugin;
	'posts.autosaves.create': WordpressPostRevision2;
	'posts.autosaves.get': WordpressPostRevision2;
	'posts.autosaves.list': Array<WordpressPostRevision2>;
	'posts.create': WordpressPost;
	'posts.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressPost | null;
				[key: string]: unknown;
		  }
		| WordpressPost;
	'posts.get': WordpressPost;
	'posts.list': {
		/** One page of results. */
		items: Array<WordpressPost>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'posts.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressPostRevision | null;
				[key: string]: unknown;
		  }
		| WordpressPostRevision;
	'posts.revisions.get': WordpressPostRevision;
	'posts.revisions.list': {
		/** One page of results. */
		items: Array<WordpressPostRevision>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'posts.update': WordpressPost;
	'rest.get': WordpressJsonValue;
	'rest.send': WordpressJsonValue;
	'search.query': {
		/** One page of results. */
		items: Array<WordpressSearchResult>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'settings.get': WordpressSettings;
	'settings.update': WordpressSettings;
	'sidebars.get': WordpressSidebar;
	'sidebars.list': Array<WordpressSidebar>;
	'sidebars.update': WordpressSidebar;
	'site.index': WordpressJsonValue;
	'siteHealth.authorizationHeader': WordpressWpSiteHealthTest;
	'siteHealth.backgroundUpdates': WordpressWpSiteHealthTest;
	'siteHealth.directorySizes': WordpressJsonValue;
	'siteHealth.dotorgCommunication': WordpressWpSiteHealthTest;
	'siteHealth.httpsStatus': WordpressWpSiteHealthTest;
	'siteHealth.loopbackRequests': WordpressWpSiteHealthTest;
	'siteHealth.pageCache': WordpressJsonValue;
	'statuses.get': WordpressStatus;
	'statuses.list': Record<string, WordpressStatus>;
	'tags.create': WordpressTag;
	'tags.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressTag | null;
				[key: string]: unknown;
		  }
		| WordpressTag;
	'tags.get': WordpressTag;
	'tags.list': {
		/** One page of results. */
		items: Array<WordpressTag>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'tags.update': WordpressTag;
	'taxonomies.get': WordpressTaxonomy;
	'taxonomies.list': Record<string, WordpressTaxonomy>;
	'templateParts.autosaves.create': WordpressWpTemplatePart;
	'templateParts.autosaves.get': WordpressWpTemplatePart;
	'templateParts.autosaves.list': Array<WordpressWpTemplatePart>;
	'templateParts.create': WordpressWpTemplatePart2;
	'templateParts.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpTemplatePart2 | null;
				[key: string]: unknown;
		  }
		| WordpressWpTemplatePart2;
	'templateParts.get': WordpressWpTemplatePart2;
	'templateParts.list': Array<WordpressWpTemplatePart2>;
	'templateParts.lookup': WordpressJsonValue;
	'templateParts.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpTemplatePart | null;
				[key: string]: unknown;
		  }
		| WordpressWpTemplatePart;
	'templateParts.revisions.get': WordpressWpTemplatePart;
	'templateParts.revisions.list': {
		/** One page of results. */
		items: Array<WordpressWpTemplatePart>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'templateParts.update': WordpressWpTemplatePart2;
	'templates.autosaves.create': WordpressWpTemplate;
	'templates.autosaves.get': WordpressWpTemplate;
	'templates.autosaves.list': Array<WordpressWpTemplate>;
	'templates.create': WordpressWpTemplate2;
	'templates.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpTemplate2 | null;
				[key: string]: unknown;
		  }
		| WordpressWpTemplate2;
	'templates.get': WordpressWpTemplate2;
	'templates.list': Array<WordpressWpTemplate2>;
	'templates.lookup': WordpressJsonValue;
	'templates.revisions.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWpTemplate | null;
				[key: string]: unknown;
		  }
		| WordpressWpTemplate;
	'templates.revisions.get': WordpressWpTemplate;
	'templates.revisions.list': {
		/** One page of results. */
		items: Array<WordpressWpTemplate>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'templates.update': WordpressWpTemplate2;
	'themes.get': WordpressTheme;
	'themes.list': Array<WordpressTheme>;
	'types.get': WordpressType;
	'types.list': Record<string, WordpressType>;
	'users.applicationPasswords.create': WordpressApplicationPassword;
	'users.applicationPasswords.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressApplicationPassword | null;
				[key: string]: unknown;
		  }
		| WordpressApplicationPassword;
	'users.applicationPasswords.deleteAll':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressApplicationPassword | null;
				[key: string]: unknown;
		  }
		| WordpressApplicationPassword;
	'users.applicationPasswords.get': WordpressApplicationPassword;
	'users.applicationPasswords.introspect': WordpressApplicationPassword;
	'users.applicationPasswords.list': Array<WordpressApplicationPassword>;
	'users.applicationPasswords.update': WordpressApplicationPassword;
	'users.create': WordpressUser;
	'users.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressUser | null;
				[key: string]: unknown;
		  }
		| WordpressUser;
	'users.deleteMe':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressUser | null;
				[key: string]: unknown;
		  }
		| WordpressUser;
	'users.get': WordpressUser;
	'users.list': {
		/** One page of results. */
		items: Array<WordpressUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.me': WordpressUser;
	'users.update': WordpressUser;
	'users.updateMe': WordpressUser;
	'viewConfig.get': WordpressViewConfig;
	'widgetTypes.encode': WordpressJsonValue;
	'widgetTypes.get': WordpressWidgetType;
	'widgetTypes.list': Array<WordpressWidgetType>;
	'widgetTypes.render': WordpressJsonValue;
	'widgets.create': WordpressWidget;
	'widgets.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WordpressWidget | null;
				[key: string]: unknown;
		  }
		| WordpressWidget;
	'widgets.get': WordpressWidget;
	'widgets.list': Array<WordpressWidget>;
	'widgets.update': WordpressWidget;
};
