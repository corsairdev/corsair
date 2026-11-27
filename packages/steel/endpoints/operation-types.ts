// Generated from Steel's OpenAPI spec (https://docs.steel.dev/openapi.json,
// fetched 2026-11-27); steel-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type SteelJsonValue =
	| null
	| boolean
	| number
	| string
	| SteelJsonValue[]
	| { [key: string]: SteelJsonValue | undefined };

export const STEEL_OPERATION_IDS = [
	'apiKeys.create',
	'auth.jwks',
	'credentials.create',
	'credentials.delete',
	'credentials.list',
	'credentials.update',
	'extensions.delete',
	'extensions.deleteAll',
	'extensions.download',
	'extensions.list',
	'extensions.update',
	'extensions.upload',
	'files.delete',
	'files.download',
	'files.list',
	'files.upload',
	'profiles.create',
	'profiles.delete',
	'profiles.get',
	'profiles.list',
	'profiles.update',
	'projects.get',
	'projects.list',
	'secretConnections.create',
	'secretConnections.delete',
	'secretConnections.get',
	'secretConnections.list',
	'secretConnections.test',
	'secretConnections.update',
	'sessions.agentLogs',
	'sessions.agentTraces',
	'sessions.captchas.solve',
	'sessions.captchas.solveImage',
	'sessions.captchas.status',
	'sessions.commands.cancelExecution',
	'sessions.commands.getExecution',
	'sessions.commands.run',
	'sessions.computer',
	'sessions.context',
	'sessions.cost',
	'sessions.create',
	'sessions.credentials.attach',
	'sessions.credentials.detach',
	'sessions.credentials.detachVault',
	'sessions.credentials.list',
	'sessions.credentials.replace',
	'sessions.events',
	'sessions.files.delete',
	'sessions.files.deleteAll',
	'sessions.files.download',
	'sessions.files.downloadArchive',
	'sessions.files.list',
	'sessions.files.upload',
	'sessions.get',
	'sessions.hlsPlaylist',
	'sessions.list',
	'sessions.liveDetails',
	'sessions.logs',
	'sessions.metadata.replace',
	'sessions.metadata.update',
	'sessions.release',
	'sessions.releaseAll',
	'sessions.signalCatalog',
	'tools.pdf',
	'tools.scrape',
	'tools.screenshot',
	'vaults.create',
	'vaults.delete',
	'vaults.get',
	'vaults.list',
	'vaults.update',
] as const;

export type SteelOperationId = (typeof STEEL_OPERATION_IDS)[number];

export type SteelCommandInput =
	| {
			command: 'navigate';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			url: string;
	  }
	| {
			command: 'back';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			command: 'forward';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			command: 'reload';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			command: 'snapshot';
			/** Only lines with refs or values, and their ancestors. */
			compact?: boolean;
			/** Only lines up to this depth. */
			depth?: number;
			/** Only lines with refs. */
			interactive?: boolean;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			/** left by default. */
			button?: 'left' | 'right' | 'middle';
			/** 2 makes a double click and 3 a triple click. 1 by default. */
			clicks?: number;
			command: 'click';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			command: 'hover';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			command: 'focus';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			/** Replace the current content. */
			clear?: boolean;
			command: 'type';
			/** Milliseconds to wait between key presses. */
			delay?: number;
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
			text: string;
	  }
	| {
			command: 'fill';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
			value: string;
	  }
	| {
			command: 'press';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			key: string;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target?: SteelCommandTargetInput;
	  }
	| {
			action: 'down' | 'up';
			command: 'keyboard';
			/** One key, not a combination such as Control+a. */
			key: string;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			command: 'release';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			action: 'move' | 'down' | 'up' | 'click' | 'wheel';
			button?: 'left' | 'right' | 'middle';
			clicks?: number;
			command: 'mouse';
			deltaX?: number;
			deltaY?: number;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			x?: number;
			y?: number;
	  }
	| {
			command: 'select';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
			values: string | Array<string>;
	  }
	| {
			command: 'check';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			command: 'upload';
			expect?: SteelCommandExpectationInput;
			files: string | Array<string>;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			command: 'drag';
			frame?: SteelCommandFrameInput;
			source: SteelCommandTargetInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			command: 'uncheck';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
	  }
	| {
			/** The attribute to read with attr. */
			attribute?: string;
			command: 'get';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target?: SteelCommandTargetInput;
			what:
				| 'text'
				| 'html'
				| 'markdown'
				| 'value'
				| 'attr'
				| 'title'
				| 'url'
				| 'count'
				| 'box'
				| 'locator';
	  }
	| {
			command: 'is';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target: SteelCommandTargetInput;
			what: 'visible' | 'enabled' | 'checked';
	  }
	| {
			command: 'wait';
			/** Waits for the next download to finish. */
			download?: true;
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			load?: 'load' | 'domcontentloaded' | 'networkidle';
			ms?: number;
			state?: 'visible' | 'hidden' | 'attached' | 'detached';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target?: SteelCommandTargetInput;
			text?: string;
			/** Milliseconds. 10000 by default. */
			timeout?: number;
			/** A URL pattern. * matches any characters. */
			url?: string;
	  }
	| {
			command: 'screenshot';
			expect?: SteelCommandExpectationInput;
			format?: 'png' | 'jpeg' | 'webp';
			frame?: SteelCommandFrameInput;
			fullPage?: boolean;
			quality?: number;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target?: SteelCommandTargetInput;
	  }
	| {
			command: 'eval';
			/** An expression, or an async function body that gives its value with return. A promise result is awaited. */
			script: string;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			/** Milliseconds. 10000 by default. */
			timeout?: number;
	  }
	| {
			command: 'pdf';
			landscape?: boolean;
			printBackground?: boolean;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
	  }
	| {
			/** Pixels. 300 by default. */
			amount?: number;
			command: 'scroll';
			direction?: 'up' | 'down' | 'left' | 'right';
			expect?: SteelCommandExpectationInput;
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			target?: SteelCommandTargetInput;
	  }
	| {
			command: 'find';
			frame?: SteelCommandFrameInput;
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			/** A CSS selector or a locator, not a ref. */
			target: SteelCommandTargetInput;
	  }
	| {
			action: 'list' | 'new' | 'close';
			command: 'tab';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
			url?: string;
	  }
	| {
			action: 'accept' | 'dismiss';
			command: 'dialog';
			/** The id of the dialog, such as d-3, from dialog in a response. */
			dialog: string;
			/** The answer to a prompt. Works only with accept. A prompt gets its default text without it. */
			text?: string;
	  };

/** Fails the command when the element does not have this role or name. */
export type SteelCommandExpectationInput = {
	name?: string;
	role?: string;
};

/** The iframe to look in. List nested iframes from the outside in. */
export type SteelCommandFrameInput =
	| SteelCommandTargetInput
	| Array<SteelCommandTargetInput>;

/** Finds an element. Set exactly one of role, text, label, placeholder, alt, title, testid, css. */
export type SteelCommandLocatorInput = {
	alt?: string;
	css?: string;
	/** Match the whole text. Text matches a case-insensitive substring by default. */
	exact?: boolean;
	label?: string;
	/** The accessible name. Works only with role. */
	name?: string;
	/** Picks one of several matches. Negative values count from the end. */
	nth?: number;
	placeholder?: string;
	role?: string;
	testid?: string;
	text?: string;
	title?: string;
};

/** A ref from a snapshot such as e12, a CSS selector, or a locator. */
export type SteelCommandTargetInput = string | SteelCommandLocatorInput;

export type SteelApiKeyResponse = {
	createdAt?: string | null;
	id?: string | null;
	/** The full secret on creation or rotation only. Metadata reads return a masked preview. Store a newly created secret securely; it cannot be retrieved later. */
	key?: string | null;
	name?: string | null;
	/** The pinned project, or null for a global key, which binds to no project. */
	projectId?: string | null;
	/** `project` pins the key to one project. `global` authorizes access across the organization and has no project binding. */
	scopeType?: string | null;
	updatedAt?: string | null;
};

export type SteelCaptchaActionResponse = {
	/** Response message */
	message?: string | null;
	/** Whether the action was successful */
	success?: boolean | null;
};

export type SteelCaptchaStateResponse = Array<{
	/** Timestamp when the state was created */
	created?: number | null;
	/** Whether a captcha is currently being solved */
	isSolvingCaptcha?: boolean | null;
	/** Timestamp when the state was last updated */
	lastUpdated?: number | null;
	/** The page ID where the captcha is located */
	pageId?: string | null;
	/** Array of captcha tasks */
	tasks?: Array<SteelJsonValue> | null;
	/** The URL where the captcha is located */
	url?: string | null;
}>;

/** A JavaScript dialog: alert, confirm, prompt, or beforeunload. */
export type SteelCommandDialog = {
	defaultPrompt?: string | null;
	id?: string | null;
	message?: string | null;
	tab?: string | null;
	type?: string | null;
};

export type SteelCommandErrorInfo = {
	/** Error code, such as stale_ref or not_actionable. */
	code?: string | null;
	message?: string | null;
	/** More detail, such as covered or detached. */
	reason?: string | null;
};

/** Input still held down on a tab. It applies to later input until released. */
export type SteelCommandHeld = {
	/** A mouse button held down with mouse down. */
	button?: string | null;
	/** Keys still held down, for example with keyboard down. */
	keys?: Array<string> | null;
	tab?: string | null;
};

/** Result of one command, with the fields of that command. */
export type SteelCommandResult =
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			url?: string | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			/** False when there was no history entry. */
			navigated?: boolean | null;
			ok?: boolean | null;
			url?: string | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			ok?: boolean | null;
			snapshot?: string | null;
			snapshotId?: string | null;
	  }
	| {
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
	  }
	| {
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			ok?: boolean | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			ok?: boolean | null;
	  }
	| {
			/** The id of the dialog that the key answered. Absent when the key went to the page. */
			answered?: string | null;
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
	  }
	| {
			/** The mouse button that was let go. */
			button?: string | null;
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The keys that were let go. */
			keys?: Array<string> | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
	  }
	| {
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
			/** The values of the selected options. */
			selected?: Array<string> | null;
	  }
	| {
			checked?: boolean | null;
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
	  }
	| {
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			files?: Array<string> | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The value is a secret, so it is left out. */
			masked?: boolean | null;
			ok?: boolean | null;
			/** A string for text, html, markdown, value, attr, title, and url. A number for count. { x, y, width, height } or null for box. A list of locators for locator. */
			value?: SteelJsonValue | null;
			/** What was read. It tells the type of value. */
			what?: string | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			ok?: boolean | null;
			value?: boolean | null;
	  }
	| {
			bytes?: number | null;
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The downloaded file, for download. */
			file?: string | null;
			ok?: boolean | null;
			waited?: string | null;
	  }
	| {
			command?: string | null;
			data?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			format?: string | null;
			ok?: boolean | null;
	  }
	| {
			command?: string | null;
			/** A dialog that the command opened. It blocks the tab until it closes. */
			dialog?: SteelCommandDialog | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			/** The ids of tabs that opened while the command ran. */
			opened?: Array<string> | null;
			/** The result of the script as JSON. */
			value?: SteelJsonValue | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			moved?: boolean | null;
			ok?: boolean | null;
			x?: number | null;
			y?: number | null;
	  }
	| {
			command?: string | null;
			count?: number | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			matches?: Array<{
				name?: string | null;
				ref?: string | null;
				role?: string | null;
			}> | null;
			ok?: boolean | null;
	  }
	| {
			command?: string | null;
			/** What happened to the page: nothing, a change, or a possible change. */
			effect?: string | null;
			error?: SteelCommandErrorInfo | null;
			/** The page was still loading when the command returned. */
			loading?: boolean | null;
			ok?: boolean | null;
			tab?: string | null;
			tabs?: Array<{
				tab?: string | null;
				title?: string | null;
				url?: string | null;
			}> | null;
	  };

export type SteelComputerActionResponse = {
	/** Base64 encoded screenshot if requested */
	base64_image?: string | null;
	/** Error message if action failed */
	error?: string | null;
	/** Output message from the action */
	output?: string | null;
	/** System information */
	system?: string | null;
};

export type SteelCredentialList = {
	credentials?: Array<{
		/** Canonical http(s) origins, besides `origin`, this credential may be filled on, such as its login host or identity provider (e.g. `https://login.example.com`). Only the credential's origin and these ever match a page, exactly; at most 20. */
		additionalOrigins?: Array<string> | null;
		/** Date and time the credential was created */
		createdAt?: string | null;
		/** Label for the credential */
		label?: string | null;
		/** The namespace the credential is stored against. Defaults to "default". */
		namespace?: string | null;
		/** Website origin the credential is for */
		origin?: string | null;
		/** Date and time the credential was last updated */
		updatedAt?: string | null;
	}> | null;
};

export type SteelCredentialMetadata = {
	/** Canonical http(s) origins, besides `origin`, this credential may be filled on, such as its login host or identity provider (e.g. `https://login.example.com`). Only the credential's origin and these ever match a page, exactly; at most 20. */
	additionalOrigins?: Array<string> | null;
	/** Date and time the credential was created */
	createdAt?: string | null;
	/** Label for the credential */
	label?: string | null;
	/** The namespace the credential is stored against. Defaults to "default". */
	namespace?: string | null;
	/** Website origin the credential is for */
	origin?: string | null;
	/** Date and time the credential was last updated */
	updatedAt?: string | null;
};

export type SteelDeleteResponse = {
	message?: string | null;
};

/** Response containing a list of extensions for the organization */
export type SteelExtensionList = {
	/** Total number of extensions */
	count?: number | null;
	/** List of extensions for the organization */
	extensions?: Array<{
		/** Creation timestamp */
		createdAt?: string | null;
		/** Unique extension identifier (e.g., ext_12345) */
		id?: string | null;
		/** Extension name */
		name?: string | null;
		/** Last update timestamp */
		updatedAt?: string | null;
	}> | null;
};

export type SteelExtensionUploadResponse = {
	/** Creation timestamp */
	createdAt?: string | null;
	/** Unique extension identifier (e.g., ext_12345) */
	id?: string | null;
	/** Extension name */
	name?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
};

export type SteelFileDetails = {
	/** Timestamp when the file was created */
	lastModified?: string | null;
	/** Path to the file in the storage system */
	path?: string | null;
	/** Size of the file in bytes */
	size?: number | null;
};

export type SteelGetSessionAgentLogsResponse = {
	events?: Array<Record<string, SteelJsonValue>> | null;
	hasMore?: boolean | null;
	total?: number | null;
};

export type SteelGetSessionAgentTracesResponse = {
	events?: Array<Record<string, SteelJsonValue>> | null;
	hasMore?: boolean | null;
	total?: number | null;
};

/** Events for a browser session */
export type SteelGetSessionEventsResponse = Array<SteelJsonValue>;

export type SteelGetSessionLogsResponse = {
	events?: Array<{
		id?: string | null;
		log?: string | null;
		timestamp?: string | null;
		type?: string | null;
	}> | null;
	hasMore?: boolean | null;
	total?: number | null;
};

/** A JSON Web Key Set (JWKS) containing a list of public keys. */
export type SteelJwks = {
	/** A list of JSON Web Keys. */
	keys?: Array<{
		/** The specific cryptographic algorithm used with the key (e.g., 'RS256'). */
		alg?: string | null;
		/** The exponent for the RSA public key. */
		e?: string | null;
		/** The unique identifier for the key. */
		kid?: string | null;
		/** The key type, identifying the algorithm family (e.g., 'RSA'). */
		kty?: string | null;
		/** The modulus for the RSA public key. */
		n?: string | null;
		/** The intended use of the public key (e.g., 'sig' for signature). */
		use?: string | null;
	}> | null;
};

export type SteelMultipleFiles = {
	/** Array of files for the current page */
	data?: Array<{
		/** Timestamp when the file was created */
		lastModified?: string | null;
		/** Path to the file in the storage system */
		path?: string | null;
		/** Size of the file in bytes */
		size?: number | null;
	}> | null;
};

export type SteelPdfResponse = {
	/** URL where the PDF is hosted */
	url?: string | null;
};

export type SteelProfile = {
	/** The date and time when the profile was created */
	createdAt?: string | null;
	/** The credentials configuration associated with the profile */
	credentialsConfig?: SteelJsonValue | null;
	/** The dimensions associated with the profile */
	dimensions?: {
		height?: number | null;
		width?: number | null;
	} | null;
	/** The extension IDs associated with the profile */
	extensionIds?: Array<string> | null;
	/** The fingerprint associated with the profile */
	fingerprint?: {
		fingerprint?: {
			audioCodecs?: Record<string, string | null> | null;
			battery?: {
				charging?: boolean | null;
				chargingTime?: number | null;
				dischargingTime?: number | null;
				level?: number | null;
			} | null;
			fonts?: Array<string | null> | null;
			mockWebRTC?: boolean | null;
			multimediaDevices?: {
				micros?: Array<{
					deviceId?: string | null;
					groupId?: string | null;
					kind?: string | null;
					label?: string | null;
				}> | null;
				speakers?: Array<{
					deviceId?: string | null;
					groupId?: string | null;
					kind?: string | null;
					label?: string | null;
				}> | null;
				webcams?: Array<{
					deviceId?: string | null;
					groupId?: string | null;
					kind?: string | null;
					label?: string | null;
				}> | null;
			} | null;
			navigator?: {
				appCodeName?: string | null;
				appName?: string | null;
				appVersion?: string | null;
				deviceMemory?: number | null;
				doNotTrack?: string | null;
				extraProperties?: {
					globalPrivacyControl?: boolean | null;
					installedApps?: Array<string | null> | null;
					pdfViewerEnabled?: boolean | null;
					vendorFlavors?: Array<string | null> | null;
				} | null;
				hardwareConcurrency?: number | null;
				language?: string | null;
				languages?: Array<string | null> | null;
				maxTouchPoints?: number | null;
				oscpu?: string | null;
				platform?: string | null;
				product?: string | null;
				productSub?: string | null;
				userAgent?: string | null;
				userAgentData?: {
					brands?: Array<{
						brand?: string | null;
						version?: string | null;
					}> | null;
					mobile?: boolean | null;
					platform?: string | null;
				} | null;
				vendor?: string | null;
				vendorSub?: string | null;
				webdriver?: boolean | null;
			} | null;
			pluginsData?: {
				mimeTypes?: Array<string | null> | null;
				plugins?: Array<{
					description?: string | null;
					filename?: string | null;
					mimeTypes?: Array<{
						description?: string | null;
						enabledPlugin?: string | null;
						suffixes?: string | null;
						type?: string | null;
					}> | null;
					name?: string | null;
				}> | null;
			} | null;
			screen?: {
				availHeight?: number | null;
				availLeft?: number | null;
				availTop?: number | null;
				availWidth?: number | null;
				clientHeight?: number | null;
				clientWidth?: number | null;
				colorDepth?: number | null;
				devicePixelRatio?: number | null;
				hasHDR?: boolean | null;
				height?: number | null;
				innerHeight?: number | null;
				innerWidth?: number | null;
				outerHeight?: number | null;
				outerWidth?: number | null;
				pageXOffset?: number | null;
				pageYOffset?: number | null;
				pixelDepth?: number | null;
				screenX?: number | null;
				width?: number | null;
			} | null;
			slim?: boolean | null;
			videoCard?: {
				renderer?: string | null;
				vendor?: string | null;
			} | null;
			videoCodecs?: Record<string, string | null> | null;
		} | null;
		headers?: {
			accept?: string | null;
			'accept-encoding'?: string | null;
			'accept-language'?: string | null;
			dnt?: string | null;
			'sec-ch-ua'?: string | null;
			'sec-ch-ua-mobile'?: string | null;
			'sec-ch-ua-platform'?: string | null;
			'sec-fetch-dest'?: string | null;
			'sec-fetch-mode'?: string | null;
			'sec-fetch-site'?: string | null;
			'sec-fetch-user'?: string | null;
			'upgrade-insecure-requests'?: string | null;
			'user-agent'?: string | null;
		} | null;
	} | null;
	/** The unique identifier for the profile */
	id?: string | null;
	/** The project ID associated with the profile */
	projectId?: string | null;
	/** The last session ID associated with the profile */
	sourceSessionId?: string | null;
	/** The status of the profile */
	status?: string | null;
	/** The date and time when the profile was last updated */
	updatedAt?: string | null;
	/** The proxy configuration associated with the profile */
	useProxyConfig?: SteelJsonValue | null;
	/** The user agent associated with the profile */
	userAgent?: string | null;
};

export type SteelProfileListResponse = {
	/** The total number of profiles */
	count?: number | null;
	/** The list of profiles */
	profiles?: Array<{
		/** The date and time when the profile was created */
		createdAt?: string | null;
		/** The credentials configuration associated with the profile */
		credentialsConfig?: SteelJsonValue | null;
		/** The dimensions associated with the profile */
		dimensions?: {
			height?: number | null;
			width?: number | null;
		} | null;
		/** The extension IDs associated with the profile */
		extensionIds?: Array<string> | null;
		/** The fingerprint associated with the profile */
		fingerprint?: {
			fingerprint?: {
				audioCodecs?: Record<string, string | null> | null;
				battery?: {
					charging?: boolean | null;
					chargingTime?: number | null;
					dischargingTime?: number | null;
					level?: number | null;
				} | null;
				fonts?: Array<string | null> | null;
				mockWebRTC?: boolean | null;
				multimediaDevices?: {
					micros?: Array<{
						deviceId?: string | null;
						groupId?: string | null;
						kind?: string | null;
						label?: string | null;
					}> | null;
					speakers?: Array<{
						deviceId?: string | null;
						groupId?: string | null;
						kind?: string | null;
						label?: string | null;
					}> | null;
					webcams?: Array<{
						deviceId?: string | null;
						groupId?: string | null;
						kind?: string | null;
						label?: string | null;
					}> | null;
				} | null;
				navigator?: {
					appCodeName?: string | null;
					appName?: string | null;
					appVersion?: string | null;
					deviceMemory?: number | null;
					doNotTrack?: string | null;
					extraProperties?: {
						globalPrivacyControl?: boolean | null;
						installedApps?: Array<string | null> | null;
						pdfViewerEnabled?: boolean | null;
						vendorFlavors?: Array<string | null> | null;
					} | null;
					hardwareConcurrency?: number | null;
					language?: string | null;
					languages?: Array<string | null> | null;
					maxTouchPoints?: number | null;
					oscpu?: string | null;
					platform?: string | null;
					product?: string | null;
					productSub?: string | null;
					userAgent?: string | null;
					userAgentData?: {
						brands?: Array<{
							brand?: string | null;
							version?: string | null;
						}> | null;
						mobile?: boolean | null;
						platform?: string | null;
					} | null;
					vendor?: string | null;
					vendorSub?: string | null;
					webdriver?: boolean | null;
				} | null;
				pluginsData?: {
					mimeTypes?: Array<string | null> | null;
					plugins?: Array<{
						description?: string | null;
						filename?: string | null;
						mimeTypes?: Array<{
							description?: string | null;
							enabledPlugin?: string | null;
							suffixes?: string | null;
							type?: string | null;
						}> | null;
						name?: string | null;
					}> | null;
				} | null;
				screen?: {
					availHeight?: number | null;
					availLeft?: number | null;
					availTop?: number | null;
					availWidth?: number | null;
					clientHeight?: number | null;
					clientWidth?: number | null;
					colorDepth?: number | null;
					devicePixelRatio?: number | null;
					hasHDR?: boolean | null;
					height?: number | null;
					innerHeight?: number | null;
					innerWidth?: number | null;
					outerHeight?: number | null;
					outerWidth?: number | null;
					pageXOffset?: number | null;
					pageYOffset?: number | null;
					pixelDepth?: number | null;
					screenX?: number | null;
					width?: number | null;
				} | null;
				slim?: boolean | null;
				videoCard?: {
					renderer?: string | null;
					vendor?: string | null;
				} | null;
				videoCodecs?: Record<string, string | null> | null;
			} | null;
			headers?: {
				accept?: string | null;
				'accept-encoding'?: string | null;
				'accept-language'?: string | null;
				dnt?: string | null;
				'sec-ch-ua'?: string | null;
				'sec-ch-ua-mobile'?: string | null;
				'sec-ch-ua-platform'?: string | null;
				'sec-fetch-dest'?: string | null;
				'sec-fetch-mode'?: string | null;
				'sec-fetch-site'?: string | null;
				'sec-fetch-user'?: string | null;
				'upgrade-insecure-requests'?: string | null;
				'user-agent'?: string | null;
			} | null;
		} | null;
		/** The unique identifier for the profile */
		id?: string | null;
		/** The project ID associated with the profile */
		projectId?: string | null;
		/** The last session ID associated with the profile */
		sourceSessionId?: string | null;
		/** The status of the profile */
		status?: string | null;
		/** The date and time when the profile was last updated */
		updatedAt?: string | null;
		/** The proxy configuration associated with the profile */
		useProxyConfig?: SteelJsonValue | null;
		/** The user agent associated with the profile */
		userAgent?: string | null;
	}> | null;
};

export type SteelProject = {
	createdAt?: string | null;
	id?: string | null;
	isDefault?: boolean | null;
	isProduction?: boolean | null;
	name?: string | null;
	promotedToProductionAt?: string | null;
	slug?: string | null;
	updatedAt?: string | null;
};

export type SteelProjectsResponse = {
	projects?: Array<{
		createdAt?: string | null;
		id?: string | null;
		isDefault?: boolean | null;
		isProduction?: boolean | null;
		name?: string | null;
		promotedToProductionAt?: string | null;
		slug?: string | null;
		updatedAt?: string | null;
	}> | null;
};

/** Response for releasing a single session. */
export type SteelReleaseSessionResponse = {
	/** Details about the outcome of the release operation */
	message?: string | null;
	/** Indicates if the session was successfully released */
	success?: boolean | null;
};

/** Response for releasing multiple sessions. */
export type SteelReleaseSessionsResponse = {
	/** Details about the outcome of the release operation */
	message?: string | null;
	/** Indicates if the sessions were successfully released */
	success?: boolean | null;
};

export type SteelRunCommandsResponse = {
	bodyExpired?: boolean | null;
	/** A dialog that is open on the tab and blocks it until it closes. */
	dialog?: SteelCommandDialog | null;
	/** What happened to the page: nothing, a change, or a possible change. */
	effect?: string | null;
	/** Set when the execution ran with after. Whether another execution, a quick action, or a browser restart changed the session since then. Input from CDP clients or the live view does not count. */
	epochChanged?: boolean | null;
	/** Tabs with keys or a mouse button still held down. Left out when nothing is held. */
	held?: Array<SteelCommandHeld> | null;
	/** The id of this execution. Use it to get or cancel the execution. */
	id?: string | null;
	/** Send it as after in the next request. */
	next?: string | null;
	observe?: {
		additions?: number | null;
		base?: string | null;
		diff?: string | null;
		error?: SteelCommandErrorInfo | null;
		full?: boolean | null;
		removals?: number | null;
		snapshot?: string | null;
		snapshotId?: string | null;
	} | null;
	/** The tab the execution used. */
	page?: {
		tab?: string | null;
		title?: string | null;
		url?: string | null;
	} | null;
	/** Commands started. */
	ran?: number | null;
	/** This is the stored result of an earlier request. Nothing ran again. */
	replayed?: boolean | null;
	results?: Array<SteelCommandResult> | null;
	state?: string | null;
	/** Why the execution stopped early, such as a cancel, a timeout, or a browser restart. A failed command has its error in results instead. */
	stopped?: SteelCommandErrorInfo | null;
};

/** Response from a successful scrape request */
export type SteelScrapeResponse = {
	content?: {
		/** Cleaned HTML content of the webpage */
		cleaned_html?: string | null;
		/** Raw HTML content of the webpage */
		html?: string | null;
		/** Webpage content converted to Markdown */
		markdown?: string | null;
		/** Webpage content in Readability format */
		readability?: Record<string, SteelJsonValue> | null;
	} | null;
	links?: Array<{
		/** Text content of the link */
		text?: string | null;
		/** URL of the link */
		url?: string | null;
	}> | null;
	metadata?: {
		/** Author of the article content */
		articleAuthor?: string | null;
		/** Author of the webpage content */
		author?: string | null;
		/** Canonical URL of the webpage */
		canonical?: string | null;
		/** Description of the webpage */
		description?: string | null;
		/** Favicon URL of the website */
		favicon?: string | null;
		/** JSON-LD structured data from the webpage */
		jsonLd?: SteelJsonValue | null;
		/** Keywords associated with the webpage */
		keywords?: string | null;
		/** Detected language of the webpage */
		language?: string | null;
		/** Last modification time of the content */
		modifiedTime?: string | null;
		/** Open Graph description */
		ogDescription?: string | null;
		/** Open Graph image URL */
		ogImage?: string | null;
		/** Open Graph site name */
		ogSiteName?: string | null;
		/** Open Graph title */
		ogTitle?: string | null;
		/** Open Graph URL */
		ogUrl?: string | null;
		/** Publication time of the content */
		publishedTime?: string | null;
		/** HTTP status code of the response */
		statusCode?: number | null;
		/** Timestamp when the scrape was performed */
		timestamp?: string | null;
		/** Title of the webpage */
		title?: string | null;
		/** Source URL of the scraped page */
		urlSource?: string | null;
	} | null;
	pdf?: {
		/** URL of the generated PDF */
		url?: string | null;
	} | null;
	screenshot?: {
		/** URL of the screenshot image */
		url?: string | null;
	} | null;
};

export type SteelScreenshotResponse = {
	/** URL where the screenshot is hosted */
	url?: string | null;
};

/** Session context data returned from a browser session. */
export type SteelSessionContextResponse = {
	/** Cookies to initialize in the session */
	cookies?: Array<{
		/** The domain of the cookie */
		domain?: string | null;
		/** The expiration date of the cookie */
		expires?: number | null;
		/** Whether the cookie is HTTP only */
		httpOnly?: boolean | null;
		/** The name of the cookie */
		name?: string | null;
		/** The partition key of the cookie */
		partitionKey?: {
			/** Indicates if the cookie has any ancestors that are cross-site to the topLevelSite. */
			hasCrossSiteAncestor?: boolean | null;
			/** The site of the top-level URL the browser was visiting at the start of the request to the endpoint that set the cookie. */
			topLevelSite?: string | null;
		} | null;
		/** The path of the cookie */
		path?: string | null;
		/** The priority of the cookie */
		priority?: string | null;
		/** Whether the cookie is a same party cookie */
		sameParty?: boolean | null;
		/** The same site attribute of the cookie */
		sameSite?: string | null;
		/** Whether the cookie is secure */
		secure?: boolean | null;
		/** Whether the cookie is a session cookie */
		session?: boolean | null;
		/** The size of the cookie */
		size?: number | null;
		/** The source port of the cookie */
		sourcePort?: number | null;
		/** The source scheme of the cookie */
		sourceScheme?: string | null;
		/** The URL of the cookie */
		url?: string | null;
		/** The value of the cookie */
		value?: string | null;
	}> | null;
	/** Domain-specific indexedDB items to initialize in the session */
	indexedDB?: Record<
		string,
		Array<{
			data?: Array<{
				id?: number | null;
				name?: string | null;
				records?: Array<{
					blobFiles?: Array<{
						blobNumber?: number | null;
						filename?: string | null;
						lastModified?: string | null;
						mimeType?: string | null;
						path?: string | null;
						size?: number | null;
					}> | null;
					key?: SteelJsonValue | null;
					value?: SteelJsonValue | null;
				}> | null;
			}> | null;
			id?: number | null;
			name?: string | null;
		}>
	> | null;
	/** Domain-specific localStorage items to initialize in the session */
	localStorage?: Record<string, Record<string, string>> | null;
	/** Domain-specific sessionStorage items to initialize in the session */
	sessionStorage?: Record<string, Record<string, string>> | null;
};

/** Session cost breakdown in US dollars */
export type SteelSessionCostResponse = {
	/** Currency used for the cost values */
	currency?: string | null;
	/** Session ID */
	id?: string | null;
	/** Exact total session cost in US dollars (e.g. 0.031905), with no rounding to whole cents. Rounded only to micro-dollar precision (6 decimal places) for precise billing passthrough. */
	totalCost?: number | null;
	/** Cost unit. Values are expressed in US dollars. */
	unit?: string | null;
	/** Billable usage inputs used to calculate the costs */
	usage?: {
		browser?: {
			/** Billing unit for browser usage */
			unit?: string | null;
			/** Billable browser usage value */
			value?: number | null;
		} | null;
		captcha?: {
			/** Billable captcha solves */
			solves?: number | null;
		} | null;
		proxy?: {
			/** Billable Steel proxy bytes for the session */
			bytes?: number | null;
		} | null;
	} | null;
};

/** The credentials a session is bound to */
export type SteelSessionCredentialsResponse = {
	/** Bindings, including KV references with their allowed origins and soft-deleted targets. */
	bindings?: Array<
		| string
		| {
				allowedOrigins?: Array<string> | null;
				reference?: string | null;
		  }
	> | null;
	/** Live credentials bound to the session, oldest binding first. No values. */
	credentials?: Array<{
		/** Other origins the credential may be filled on */
		additionalOrigins?: Array<string> | null;
		/** The credential's id (a Secret of kind `credential`) */
		id?: string | null;
		/** The credential's name */
		name?: string | null;
		/** The credential's namespace */
		namespace?: string | null;
		/** The website origin the credential is for */
		origin?: string | null;
	}> | null;
	/** Whether the session was created with a `credentials` configuration. Only then can credentials be attached; otherwise attach and replace answer 409 `credentials_not_enabled`. */
	credentialsEnabled?: boolean | null;
	/** `explicit`: the session fills only the credentials listed here. `implicit`: it fills credentials stored for its namespace and the page origin. */
	lookup?: string | null;
};

export type SteelSessionLiveDetailsResponse = {
	pages?: Array<{
		favicon?: string | null;
		id?: string | null;
		sessionViewerFullscreenUrl?: string | null;
		sessionViewerUrl?: string | null;
		title?: string | null;
		url?: string | null;
	}> | null;
	sessionViewerFullscreenUrl?: string | null;
	sessionViewerUrl?: string | null;
	wsUrl?: string | null;
};

export type SteelSessionMetadataResponse = {
	/** Customer-defined flat metadata. Values are always strings: numbers and booleans sent on write come back in their string form. */
	metadata?: Record<string, string> | null;
};

/** Represents the data structure for a browser session, including its configuration and status. */
export type SteelSessionResponse = {
	/** Browser mode used for this session. */
	browserMode?: string | null;
	/** Timestamp when the session started */
	createdAt?: string | null;
	/** Amount of credits consumed by the session */
	creditsUsed?: number | null;
	/** Configuration for the debug URL and session viewer. Controls interaction capabilities and cursor visibility. */
	debugConfig?: {
		/** Whether interaction is allowed via the debug URL viewer. When false, the session viewer is view-only. */
		interactive?: boolean | null;
		/** Whether the OS-level mouse cursor is shown in the WebRTC stream (headful mode only). */
		systemCursor?: boolean | null;
	} | null;
	/** URL for debugging the session */
	debugUrl?: string | null;
	/** Device configuration for the session */
	deviceConfig?: {
		device?: string | null;
	} | null;
	/** Viewport and browser window dimensions for the session */
	dimensions?: {
		/** Height of the browser window */
		height?: number | null;
		/** Width of the browser window */
		width?: number | null;
	} | null;
	/** Duration of the session in milliseconds */
	duration?: number | null;
	/** Number of events processed in the session */
	eventCount?: number | null;
	/** Launch the browser in fullscreen mode, covering the full screen with no Chrome UI. */
	fullscreen?: boolean | null;
	/** Indicates if the session is headless or headful */
	headless?: boolean | null;
	/** Unique identifier for the session */
	id?: string | null;
	/** Inactivity timeout in milliseconds, if one was set when the session was created */
	inactivityTimeout?: number | null;
	/** Indicates if Selenium is used in the session */
	isSelenium?: boolean | null;
	/** Customer-defined flat metadata. Values are always strings: numbers and booleans sent on write come back in their string form. */
	metadata?: Record<string, string> | null;
	/** Bandwidth optimizations that were applied to the session. */
	optimizeBandwidth?: {
		blockHosts?: Array<string> | null;
		blockImages?: boolean | null;
		blockMedia?: boolean | null;
		blockStylesheets?: boolean | null;
		blockUrlPatterns?: Array<string> | null;
	} | null;
	/** This flag will persist the profile for the session. */
	persistProfile?: boolean | null;
	/** The ID of the profile associated with the session */
	profileId?: string | null;
	/** The project associated with the session */
	projectId?: string | null;
	/** Amount of data transmitted through the proxy */
	proxyBytesUsed?: number | null;
	/** Source of the proxy used for the session */
	proxySource?: string | null;
	/** The region where the session was created. */
	region?: string | null;
	/** Why the session reached a terminal state. Null while the session is live, or when the reason is unknown (e.g. sessions created before this was tracked). One of: user_requested (released via the API/SDK), timeout (hard `timeout` elapsed), inactivity_timeout (no activity for the configured… */
	releaseReason?: string | null;
	/** URL to view session details */
	sessionViewerUrl?: string | null;
	/** Signals observed during the session. Filled in within a few seconds after the session ends, and empty until then. An empty list does not mean nothing happened: detection is heuristic and coverage is incomplete. */
	signals?: Array<string> | null;
	/** Indicates if captcha solving is enabled */
	solveCaptcha?: boolean | null;
	/** Status of the session */
	status?: string | null;
	/** Stealth configuration for the session */
	stealthConfig?: {
		/** When true, captchas will be automatically solved when detected. When false, use the solve endpoints to manually initiate solving. */
		autoCaptchaSolving?: boolean | null;
		/** This flag will make the browser act more human-like by moving the mouse in a more natural way */
		humanizeInteractions?: boolean | null;
		/** This flag will skip the fingerprint generation for the session. */
		skipFingerprintInjection?: boolean | null;
	} | null;
	/** Session timeout duration in milliseconds */
	timeout?: number | null;
	/** User agent string used in the session */
	userAgent?: string | null;
	/** URL for the session's WebSocket connection */
	websocketUrl?: string | null;
};

/** Current customer-visible signal definitions, not per-session detection evidence */
export type SteelSessionSignalCatalogResponse = {
	/** Interpretation and coverage limitations of session signals */
	semantics?: string | null;
	signals?: Array<{
		description?: string | null;
		label?: string | null;
		severity?: string | null;
		source?: string | null;
		value?: string | null;
	}> | null;
};

/** Response containing a list of browser sessions with pagination details. */
export type SteelSessionsResponse = {
	/** Cursor for the next page of results. Null if no more pages. */
	nextCursor?: string | null;
	/** List of browser sessions */
	sessions?: Array<{
		/** Browser mode used for this session. */
		browserMode?: string | null;
		/** Timestamp when the session started */
		createdAt?: string | null;
		/** Amount of credits consumed by the session */
		creditsUsed?: number | null;
		/** Configuration for the debug URL and session viewer. Controls interaction capabilities and cursor visibility. */
		debugConfig?: {
			/** Whether interaction is allowed via the debug URL viewer. When false, the session viewer is view-only. */
			interactive?: boolean | null;
			/** Whether the OS-level mouse cursor is shown in the WebRTC stream (headful mode only). */
			systemCursor?: boolean | null;
		} | null;
		/** URL for debugging the session */
		debugUrl?: string | null;
		/** Device configuration for the session */
		deviceConfig?: {
			device?: string | null;
		} | null;
		/** Viewport and browser window dimensions for the session */
		dimensions?: {
			/** Height of the browser window */
			height?: number | null;
			/** Width of the browser window */
			width?: number | null;
		} | null;
		/** Duration of the session in milliseconds */
		duration?: number | null;
		/** Number of events processed in the session */
		eventCount?: number | null;
		/** Launch the browser in fullscreen mode, covering the full screen with no Chrome UI. */
		fullscreen?: boolean | null;
		/** Indicates if the session is headless or headful */
		headless?: boolean | null;
		/** Unique identifier for the session */
		id?: string | null;
		/** Inactivity timeout in milliseconds, if one was set when the session was created */
		inactivityTimeout?: number | null;
		/** Indicates if Selenium is used in the session */
		isSelenium?: boolean | null;
		/** Customer-defined flat metadata. Values are always strings: numbers and booleans sent on write come back in their string form. */
		metadata?: Record<string, string> | null;
		/** Bandwidth optimizations that were applied to the session. */
		optimizeBandwidth?: {
			blockHosts?: Array<string> | null;
			blockImages?: boolean | null;
			blockMedia?: boolean | null;
			blockStylesheets?: boolean | null;
			blockUrlPatterns?: Array<string> | null;
		} | null;
		/** This flag will persist the profile for the session. */
		persistProfile?: boolean | null;
		/** The ID of the profile associated with the session */
		profileId?: string | null;
		/** The project associated with the session */
		projectId?: string | null;
		/** Amount of data transmitted through the proxy */
		proxyBytesUsed?: number | null;
		/** Source of the proxy used for the session */
		proxySource?: string | null;
		/** The region where the session was created. */
		region?: string | null;
		/** Why the session reached a terminal state. Null while the session is live, or when the reason is unknown (e.g. sessions created before this was tracked). One of: user_requested (released via the API/SDK), timeout (hard `timeout` elapsed), inactivity_timeout (no activity for the configured… */
		releaseReason?: string | null;
		/** URL to view session details */
		sessionViewerUrl?: string | null;
		/** Signals observed during the session. Filled in within a few seconds after the session ends, and empty until then. An empty list does not mean nothing happened: detection is heuristic and coverage is incomplete. */
		signals?: Array<string> | null;
		/** Indicates if captcha solving is enabled */
		solveCaptcha?: boolean | null;
		/** Status of the session */
		status?: string | null;
		/** Stealth configuration for the session */
		stealthConfig?: {
			/** When true, captchas will be automatically solved when detected. When false, use the solve endpoints to manually initiate solving. */
			autoCaptchaSolving?: boolean | null;
			/** This flag will make the browser act more human-like by moving the mouse in a more natural way */
			humanizeInteractions?: boolean | null;
			/** This flag will skip the fingerprint generation for the session. */
			skipFingerprintInjection?: boolean | null;
		} | null;
		/** Session timeout duration in milliseconds */
		timeout?: number | null;
		/** User agent string used in the session */
		userAgent?: string | null;
		/** URL for the session's WebSocket connection */
		websocketUrl?: string | null;
	}> | null;
	/** Exact number of live sessions in the organization/project scope. Only included for status=live without metadata, signal, releaseReason, createdAfter or createdBefore filters. Other queries omit this field; use nextCursor to paginate until it is null. */
	totalCount?: number | null;
};

export type SteelSuccessResponse = {
	success?: boolean | null;
};

export type SteelVault = {
	createdAt?: string | null;
	description?: string | null;
	id?: string | null;
	/** 1–63 lowercase letters, digits, hyphens, underscores or dots; must start with a letter or digit. */
	name?: string | null;
	projectId?: string | null;
	updatedAt?: string | null;
};

export type SteelVaultList = {
	vaults?: Array<{
		createdAt?: string | null;
		description?: string | null;
		id?: string | null;
		/** 1–63 lowercase letters, digits, hyphens, underscores or dots; must start with a letter or digit. */
		name?: string | null;
		projectId?: string | null;
		updatedAt?: string | null;
	}> | null;
};

export type SteelOperationInputs = {
	'apiKeys.create': {
		/** A human-readable label for the new key. Defaults to Default. */
		name?: string;
		/** The active project to bind the new key to, belonging to the authenticated organization. Required when authenticating with a global API key. Dashboard users may omit it to use their default project. */
		projectId?: string;
		/** Defaults to `project`. Global API keys may only create project-scoped keys. Only organization admins using dashboard authentication may create a `global` key; projectId is ignored for those keys. */
		scopeType?: 'project' | 'global';
	};
	'auth.jwks': Record<string, never>;
	'credentials.create': {
		/** Canonical http(s) origins, besides `origin`, this credential may be filled on, such as its login host or identity provider (e.g. `https://login.example.com`). Only the credential's origin and these ever match a page, exactly; at most 20. */
		additionalOrigins?: Array<string>;
		/** Label for the credential */
		label?: string;
		/** The namespace the credential is stored against. Defaults to "default". */
		namespace?: string;
		/** Website origin the credential is for */
		origin?: string;
		/** Project to store the credential in. */
		projectId?: string;
		/** Value for the credential */
		value: Record<string, string>;
	};
	'credentials.delete': {
		/** The namespace the credential is stored against. Defaults to "default". */
		namespace?: string;
		/** Website origin the credential is for */
		origin: string;
		/** Project to delete the credential from. */
		projectId?: string;
	};
	'credentials.list': {
		/** Project to query credentials from. */
		projectId?: string;
		/** namespace credential is stored against */
		namespace?: string;
		/** website origin the credential is for */
		origin?: string;
	};
	'credentials.update': {
		/** Canonical http(s) origins, besides `origin`, this credential may be filled on, such as its login host or identity provider (e.g. `https://login.example.com`). Only the credential's origin and these ever match a page, exactly; at most 20. Replaces the current list; [] clears it. */
		additionalOrigins?: Array<string>;
		/** Label for the credential */
		label?: string;
		/** The namespace the credential is stored against. Defaults to "default". */
		namespace?: string;
		/** Website origin the credential is for */
		origin?: string;
		/** Project to update the credential in. */
		projectId?: string;
		/** Value for the credential */
		value?: Record<string, string>;
	};
	'extensions.delete': {
		/** Extension ID */
		extensionId: string;
	};
	'extensions.deleteAll': Record<string, never>;
	'extensions.download': {
		/** Extension ID */
		extensionId: string;
	};
	'extensions.list': Record<string, never>;
	'extensions.update': {
		/** Extension ID */
		extensionId: string;
		/** Extension .zip/.crx file */
		file?: FileInput;
		/** Extension URL */
		url?: string;
	};
	'extensions.upload': {
		/** Extension .zip/.crx file */
		file?: FileInput;
		/** Extension URL */
		url?: string;
	};
	'files.delete': {
		path: string;
	};
	'files.download': {
		path: string;
	};
	'files.list': Record<string, never>;
	'files.upload': {
		/** The file to upload (binary) or URL string to download from */
		file: FileInput;
		/** Path to the file in the storage system */
		path?: string;
	};
	'profiles.create': {
		/** The dimensions associated with the profile */
		dimensions?: {
			height: number;
			width: number;
		};
		/** Project to create the profile in */
		projectId?: string;
		/** The proxy associated with the profile */
		proxyUrl?: string;
		/** JSON-encoded proxy configuration associated with the profile. For fixed IPs, send {"type":"fixed","id":"fixed:<id>"}. */
		useProxy?: string;
		/** The user agent associated with the profile */
		userAgent?: string;
		/** The user data directory associated with the profile */
		userDataDir: FileInput;
	};
	'profiles.delete': {
		/** Project to query profiles from */
		projectId?: string;
		id: string;
	};
	'profiles.get': {
		/** Project to query profiles from */
		projectId?: string;
		id: string;
	};
	'profiles.list': {
		/** Project to query profiles from */
		projectId?: string;
	};
	'profiles.update': {
		/** Project to query profiles from */
		projectId?: string;
		id: string;
		/** The dimensions associated with the profile */
		dimensions?: {
			height: number;
			width: number;
		};
		/** Project to create the profile in */
		targetProjectId?: string;
		/** The proxy associated with the profile */
		proxyUrl?: string;
		/** JSON-encoded proxy configuration associated with the profile. For fixed IPs, send {"type":"fixed","id":"fixed:<id>"}. */
		useProxy?: string;
		/** The user agent associated with the profile */
		userAgent?: string;
		/** The user data directory associated with the profile */
		userDataDir: FileInput;
	};
	'projects.get': {
		id: string;
	};
	'projects.list': Record<string, never>;
	'secretConnections.create': {
		/** Write-only provider authentication. Supply a service account token for 1Password, a token for HashiCorp token auth, or a role ID and secret ID for HashiCorp AppRole. */
		auth: {
			mount?: string;
			/** Write-only; never returned by the API. */
			roleId?: string;
			/** Write-only; never returned by the API. */
			secretId?: string;
			/** Write-only; never returned by the API. */
			serviceAccountToken?: string;
			/** Write-only; never returned by the API. */
			token?: string;
			type?: 'token' | 'approle';
		};
		config?: {
			address: string;
			caPem?: string;
			namespace?: string;
		};
		name: string;
		projectId?: string;
		provider: '1password' | 'hashicorp_vault';
		tokenBudget?: {
			burst: number;
			/** Tokens per second, with at most three decimal places. */
			refillPerSecond: number;
		} | null;
	};
	'secretConnections.delete': {
		projectId?: string;
		id: string;
	};
	'secretConnections.get': {
		projectId?: string;
		id: string;
	};
	'secretConnections.list': {
		projectId?: string;
	};
	'secretConnections.test': {
		projectId?: string;
		id: string;
	};
	'secretConnections.update': {
		projectId?: string;
		id: string;
		/** Write-only provider authentication. Supply a service account token for 1Password, a token for HashiCorp token auth, or a role ID and secret ID for HashiCorp AppRole. */
		auth?: {
			mount?: string;
			/** Write-only; never returned by the API. */
			roleId?: string;
			/** Write-only; never returned by the API. */
			secretId?: string;
			/** Write-only; never returned by the API. */
			serviceAccountToken?: string;
			/** Write-only; never returned by the API. */
			token?: string;
			type?: 'token' | 'approle';
		};
		config?: {
			address: string;
			caPem?: string;
			namespace?: string;
		};
		enabled?: boolean;
		name?: string;
		tokenBudget?: {
			burst: number;
			/** Tokens per second, with at most three decimal places. */
			refillPerSecond: number;
		} | null;
	};
	'sessions.agentLogs': {
		namespace?: string;
		startTime?: string;
		endTime?: string;
		eventTypes?: Array<string>;
		limit?: number;
		offset?: number;
		id: string;
	};
	'sessions.agentTraces': {
		namespace?: string;
		startTime?: string;
		endTime?: string;
		eventTypes?: Array<string>;
		limit?: number;
		offset?: number;
		id: string;
	};
	'sessions.captchas.solve': {
		/** Session ID */
		sessionId: string;
		/** The page ID where the captcha is located */
		pageId?: string;
		/** The task ID of the specific captcha to solve */
		taskId?: string;
		/** The URL where the captcha is located */
		url?: string;
	};
	'sessions.captchas.solveImage': {
		/** Session ID */
		sessionId: string;
		/** XPath to the captcha image element */
		imageXPath: string;
		/** XPath to the captcha input element */
		inputXPath: string;
		/** URL where the captcha is located. Defaults to the current page URL */
		url?: string;
	};
	'sessions.captchas.status': {
		/** Session ID */
		sessionId: string;
	};
	'sessions.commands.cancelExecution': {
		/** Session ID */
		sessionId: string;
		/** Execution ID, such as x-1, from the id of a run */
		executionId: string;
	};
	'sessions.commands.getExecution': {
		/** Session ID */
		sessionId: string;
		/** Execution ID, such as x-1, from the id of a run */
		executionId: string;
	};
	'sessions.commands.run': {
		/** Session ID */
		sessionId: string;
		/** A random value. A retry with the same key returns the stored result. */
		idempotency_key?: string;
		/** The next value from your last response. A retry with the same after and commands runs only once. */
		after?: string;
		/** One command, or an array of up to 50. They run in order and stop at the first failure. Commands that already ran are not undone. */
		commands: SteelCommandInput | Array<SteelCommandInput>;
		/** Returns a snapshot, or a diff against the last one, after the commands. */
		observe?: {
			/** A snapshot id to diff against. */
			base?: string;
			/** Only lines with refs or values, and their ancestors. */
			compact?: boolean;
			/** Only lines up to this depth. */
			depth?: number;
			/** Only lines with refs. */
			interactive?: boolean;
			mode: 'snapshot' | 'diff';
			/** A tab id such as t2. A command on a ref does not need it. */
			tab?: string;
		};
	};
	'sessions.computer': {
		/** Session ID */
		sessionId: string;
		action:
			| 'move_mouse'
			| 'click_mouse'
			| 'drag_mouse'
			| 'scroll'
			| 'press_key'
			| 'type_text'
			| 'wait'
			| 'take_screenshot'
			| 'get_cursor_position';
		/** X and Y coordinates [x, y] */
		coordinates?: Array<number>;
		hold_keys?: Array<string>;
		/** Whether to take a screenshot after the action */
		screenshot?: boolean;
		/** Mouse button to click. Defaults to 'left' */
		button?: 'left' | 'right' | 'middle' | 'back' | 'forward';
		/** Type of click (down, up, or click). Defaults to 'click' */
		click_type?: 'down' | 'up' | 'click';
		/** Number of clicks. Defaults to 1 */
		num_clicks?: number;
		/** Array of [x, y] coordinate pairs */
		path?: Array<Array<number>>;
		/** Horizontal scroll amount. Defaults to 0 */
		delta_x?: number;
		/** Vertical scroll amount. Defaults to 0 */
		delta_y?: number;
		duration?: number;
		/** Keys to press */
		keys?: Array<string>;
		/** Text to type */
		text?: string;
	};
	'sessions.context': {
		id: string;
	};
	'sessions.cost': {
		id: string;
	};
	'sessions.create': {
		/** Block ads in the browser session. Default is true. */
		blockAds?: boolean;
		/** PEM-encoded root CA certificates to trust in this session. THIS IS CURRENTLY AN EXPERIMENTAL FEATURE. */
		caCertificates?: Array<string>;
		/** Number of sessions to create concurrently (check your plan limit) */
		concurrency?: number;
		/** Configuration for session credentials. Set enabled to false to disable credentials, including those inherited from a profile. Credentials are opt-in at creation; only credentials-enabled sessions can have credentials attached later (otherwise 409 `credentials_not_enabled`). */
		credentials?: {
			autoSubmit?: boolean;
			/** At most 100 bindings. KV references may use { reference, allowedOrigins }, with at most 20 canonical HTTP(S) origins; omitted or empty origins match nothing. */
			bindings?: Array<
				| string
				| {
						allowedOrigins: Array<string>;
						reference: string;
				  }
			>;
			blurFields?: boolean;
			/** Bind the session to these credentials (ids of Secrets of kind `credential` in the session's project). A bound session only ever fills these, never others by namespace and origin. Implies `lookup: "explicit"`. Change them later with /v1/sessions/{id}/credentials. Errors: 400… */
			credentialIds?: Array<string>;
			/** Credential provider to use for runtime credential resolution. Defaults to "steel". */
			credentialProvider?: string;
			/** Allow any script on the page, including third-party scripts, to request credential form operations through DOM events. Disabled by default. */
			domTrigger?: boolean;
			/** Set to false to disable credential injection for this session. */
			enabled?: boolean;
			/** Deprecated and ignored: credentials only ever match their own origin or their additionalOrigins. */
			exactOrigin?: boolean;
			/** `implicit` (default without credentialIds or bindings): fill credentials stored for the session's namespace and the page origin. `explicit` (default when credentialIds or bindings is supplied): fill only direct credentials and credentials in bound Vaults, including future members; with none… */
			lookup?: 'implicit' | 'explicit';
			/** Optional allowlist of credential origins to inject into this session. */
			origins?: Array<string>;
		};
		/** Configuration for the debug URL and session viewer. Controls interaction capabilities, cursor visibility, and other debug-related settings. */
		debugConfig?: {
			/** Allow interaction with the browser session via the debug URL viewer. When false, the session viewer will be view-only. Default is true. */
			interactive?: boolean;
			/** Show the OS-level mouse cursor in the WebRTC stream (headful mode only). When false, the system cursor will not be rendered in the stream. Default is true. */
			systemCursor?: boolean;
		};
		/** Device configuration for the session. Specify 'mobile' for mobile device fingerprints and configurations. */
		deviceConfig?: {
			device?: 'desktop' | 'mobile';
		};
		/** Viewport and browser window dimensions for the session. Mobile sessions require dimensions of at least 508x1074; smaller mobile dimensions are rejected with a 400 response. */
		dimensions?: {
			/** Height of the session */
			height: number;
			/** Width of the session */
			width: number;
		};
		/** Enable experimental features for the session. */
		experimentalFeatures?: Array<string>;
		/** Array of extension IDs to install in the session. Use ['all_ext'] to install all uploaded extensions. */
		extensionIds?: Array<string>;
		/** Launch the browser in fullscreen mode, covering the full screen with no Chrome UI. Default is false. */
		fullscreen?: boolean;
		/** Enable headless browser mode (disable Headful mode) */
		headless?: boolean;
		/** Inactivity timeout in milliseconds. When set, the session is released if no CDP command or remote input is received for this duration, even if `timeout` has not yet elapsed. Note that `timeout` remains the hard cap on session lifetime: if `inactivityTimeout` is greater than or equal to the… */
		inactivityTimeout?: number;
		/** Deprecated. Selenium sessions are no longer supported, and a request that sets this to true is rejected with 400. Connect over CDP with Playwright or Puppeteer instead. */
		isSelenium?: boolean;
		/** Customer-defined flat metadata: up to 50 keys and 8192 UTF-8 JSON bytes. Keys must start with a letter, use only letters, digits, underscores, dots or hyphens, and be at most 64 characters; steel_ is reserved. Values are strings (up to 1024 characters, valid Unicode without NUL), finite numbers… */
		metadata?: Record<string, string | number | boolean>;
		/** The namespace the session should be created against. Defaults to "default". */
		namespace?: string;
		/** Enable bandwidth optimizations. Passing true enables all flags (except hosts/patterns). Object allows granular control. */
		optimizeBandwidth?:
			| boolean
			| {
					blockHosts?: Array<string>;
					blockImages?: boolean;
					blockMedia?: boolean;
					blockStylesheets?: boolean;
					blockUrlPatterns?: Array<string>;
			  };
		/** This flag will persist the user profile for the session. */
		persistProfile?: boolean;
		/** This flag will set the profile for the session. */
		profileId?: string;
		/** The project to create the session in. When provided, the session namespace is resolved from the project. */
		projectId?: string;
		/** Custom proxy URL for the browser session. Overrides useProxy, disabling Steel-provided proxies in favor of your specified proxy. Format: http(s)://username:password@hostname:port or socks5://username:password@hostname:port */
		proxyUrl?: string;
		/** Record the headful session for playback after it ends. Default is true. Disabling recording does not affect live WHEP viewing. */
		recording?: boolean;
		/** The desired region for the session. Available: us-east, us-west, us-central, eu-west, eu-central, ap-northeast, ap-southeast, sa-east. Legacy codes (iad, lax, ord) are also accepted. */
		region?: SteelJsonValue;
		/** Session context data to be used in the created session. Sessions will start with an empty context by default. */
		sessionContext?: {
			/** Cookies to initialize in the session */
			cookies?: Array<{
				/** The domain of the cookie */
				domain?: string;
				/** The expiration date of the cookie */
				expires?: number;
				/** Whether the cookie is HTTP only */
				httpOnly?: boolean;
				/** The name of the cookie */
				name: string;
				/** The partition key of the cookie */
				partitionKey?: {
					/** Indicates if the cookie has any ancestors that are cross-site to the topLevelSite. */
					hasCrossSiteAncestor: boolean;
					/** The site of the top-level URL the browser was visiting at the start of the request to the endpoint that set the cookie. */
					topLevelSite: string;
				};
				/** The path of the cookie */
				path?: string;
				/** The priority of the cookie */
				priority?: 'Low' | 'Medium' | 'High';
				/** Whether the cookie is a same party cookie */
				sameParty?: boolean;
				/** The same site attribute of the cookie */
				sameSite?: 'Strict' | 'Lax' | 'None';
				/** Whether the cookie is secure */
				secure?: boolean;
				/** Whether the cookie is a session cookie */
				session?: boolean;
				/** The size of the cookie */
				size?: number;
				/** The source port of the cookie */
				sourcePort?: number;
				/** The source scheme of the cookie */
				sourceScheme?: 'Unset' | 'NonSecure' | 'Secure';
				/** The URL of the cookie */
				url?: string;
				/** The value of the cookie */
				value: string;
			}>;
			/** Domain-specific indexedDB items to initialize in the session */
			indexedDB?: Record<
				string,
				Array<{
					data: Array<{
						id: number;
						name: string;
						records: Array<{
							blobFiles?: Array<{
								blobNumber: number;
								filename?: string;
								lastModified?: string;
								mimeType: string;
								path?: string;
								size: number;
							}>;
							key: SteelJsonValue;
							value: SteelJsonValue;
						}>;
					}>;
					id: number;
					name: string;
				}>
			>;
			/** Domain-specific localStorage items to initialize in the session */
			localStorage?: Record<string, Record<string, string>>;
			/** Domain-specific sessionStorage items to initialize in the session */
			sessionStorage?: Record<string, Record<string, string>>;
		};
		/** Deprecated. A session ID of your choice. Steel will reject it in a future release, because the ID that Steel generates records where the session runs. Omit it, use the `id` in the response, and put your own ID in `metadata`. */
		sessionId?: string;
		/** Enable automatic captcha solving. Default is false. */
		solveCaptcha?: boolean;
		/** Stealth configuration for the session */
		stealthConfig?: {
			/** When true, captchas will be automatically solved when detected. When false, use the solve endpoints to manually initiate solving. */
			autoCaptchaSolving?: boolean;
			/** This flag will make the browser act more human-like by moving the mouse in a more natural way. */
			humanizeInteractions?: boolean;
			/** This flag will skip the fingerprint generation for the session. */
			skipFingerprintInjection?: boolean;
		};
		/** Session timeout duration in milliseconds. Default is 300000 (5 minutes). On Launch and Scale, a value over the plan's maximum runs at the maximum; the response's `timeout` shows the value used. */
		timeout?: number;
		useProxy?:
			| (
					| boolean
					| (
							| {
									/** Geographic location for the proxy */
									geolocation: {
										/** City name (e.g., 'NEW_YORK', 'LOS_ANGELES') */
										city?:
											| 'A_CORUNA'
											| 'ABIDJAN'
											| 'ABU_DHABI'
											| 'ABUJA'
											| 'ACAPULCO_DE JUAREZ'
											| 'ACCRA'
											| 'ADANA'
											| 'ADAPAZARI'
											| 'ADDIS_ABABA'
											| 'ADELAIDE'
											| 'AFYONKARAHISAR'
											| 'AGADIR'
											| 'AGUAS_LINDAS DE GOIAS'
											| 'AGUASCALIENTES'
											| 'AHMEDABAD'
											| 'AIZAWL'
											| 'AJMAN'
											| 'AKRON'
											| 'AKSARAY'
											| 'AL_AIN CITY'
											| 'AL_MANSURAH'
											| 'AL_QATIF'
											| 'ALAJUELA'
											| 'ALBANY'
											| 'ALBUQUERQUE'
											| 'ALEXANDRIA'
											| 'ALGIERS'
											| 'ALICANTE'
											| 'ALMADA'
											| 'ALMATY'
											| 'ALMERE_STAD'
											| 'ALVORADA'
											| 'AMADORA'
											| 'AMASYA'
											| 'AMBATO'
											| 'AMERICANA'
											| 'AMMAN'
											| 'AMSTERDAM'
											| 'ANANINDEUA'
											| 'ANAPOLIS'
											| 'ANGELES_CITY'
											| 'ANGERS'
											| 'ANGRA_DOS REIS'
											| 'ANKARA'
											| 'ANTAKYA'
											| 'ANTALYA'
											| 'ANTANANARIVO'
											| 'ANTIPOLO_CITY'
											| 'ANTOFAGASTA'
											| 'ANTWERP'
											| 'APARECIDA_DE GOIANIA'
											| 'APODACA'
											| 'ARACAJU'
											| 'ARACATUBA'
											| 'ARAD'
											| 'ARAGUAINA'
											| 'ARAPIRACA'
											| 'ARARAQUARA'
											| 'AREQUIPA'
											| 'ARICA'
											| 'ARLINGTON'
											| 'ARYANAH'
											| 'ASTANA'
											| 'ASUNCION'
											| 'ASYUT'
											| 'ATAKUM'
											| 'ATHENS'
											| 'ATIBAIA'
											| 'ATLANTA'
											| 'AUBURN'
											| 'AUCKLAND'
											| 'AURORA'
											| 'AUSTIN'
											| 'AVELLANEDA'
											| 'AYDIN'
											| 'AZCAPOTZALCO'
											| 'BACOLOD_CITY'
											| 'BACOOR'
											| 'BAGHDAD'
											| 'BAGUIO_CITY'
											| 'BAHIA_BLANCA'
											| 'BAKERSFIELD'
											| 'BAKU'
											| 'BALIKESIR'
											| 'BALIKPAPAN'
											| 'BALNEARIO_CAMBORIU'
											| 'BALTIMORE'
											| 'BANDAR_LAMPUNG'
											| 'BANDAR_SERI BEGAWAN'
											| 'BANDUNG'
											| 'BANGKOK'
											| 'BANJA_LUKA'
											| 'BANJARMASIN'
											| 'BARCELONA'
											| 'BARI'
											| 'BARQUISIMETO'
											| 'BARRA_MANSA'
											| 'BARRANQUILLA'
											| 'BARUERI'
											| 'BATAM'
											| 'BATANGAS'
											| 'BATMAN'
											| 'BATNA_CITY'
											| 'BATON_ROUGE'
											| 'BATUMI'
											| 'BAURU'
											| 'BEIRUT'
											| 'BEJAIA'
											| 'BEKASI'
											| 'BELEM'
											| 'BELFAST'
											| 'BELFORD_ROXO'
											| 'BELGRADE'
											| 'BELO_HORIZONTE'
											| 'BENGALURU'
											| 'BENI_MELLAL'
											| 'BERAZATEGUI'
											| 'BERN'
											| 'BETIM'
											| 'BHARATPUR'
											| 'BHOPAL'
											| 'BHUBANESWAR'
											| 'BIALYSTOK'
											| 'BIEN_HOA'
											| 'BILBAO'
											| 'BILECIK'
											| 'BIRATNAGAR'
											| 'BIRMINGHAM'
											| 'BISHKEK'
											| 'BIZERTE'
											| 'BLIDA'
											| 'BLOEMFONTEIN'
											| 'BLOOMINGTON'
											| 'BLUMENAU'
											| 'BOA_VISTA'
											| 'BOCHUM'
											| 'BOGOR'
											| 'BOGOTA'
											| 'BOISE'
											| 'BOKSBURG'
											| 'BOLOGNA'
											| 'BOLU'
											| 'BORDEAUX'
											| 'BOSTON'
											| 'BOTUCATU'
											| 'BRADFORD'
											| 'BRAGA'
											| 'BRAGANCA_PAULISTA'
											| 'BRAMPTON'
											| 'BRASILIA'
											| 'BRASOV'
											| 'BRATISLAVA'
											| 'BREMEN'
											| 'BRESCIA'
											| 'BREST'
											| 'BRIDGETOWN'
											| 'BRISBANE'
											| 'BRISTOL'
											| 'BRNO'
											| 'BROOKLYN'
											| 'BRUSSELS'
											| 'BUCARAMANGA'
											| 'BUCHAREST'
											| 'BUDAPEST'
											| 'BUENOS_AIRES'
											| 'BUFFALO'
											| 'BUK_GU'
											| 'BUKHARA'
											| 'BURGAS'
											| 'BURNABY'
											| 'BURSA'
											| 'BUTUAN'
											| 'BYDGOSZCZ'
											| 'CABANATUAN_CITY'
											| 'CABO_FRIO'
											| 'CABUYAO'
											| 'CACHOEIRO_DE ITAPEMIRIM'
											| 'CAGAYAN_DE ORO'
											| 'CAGLIARI'
											| 'CAIRO'
											| 'CALAMBA'
											| 'CALGARY'
											| 'CALOOCAN_CITY'
											| 'CAMACARI'
											| 'CAMARAGIBE'
											| 'CAMPECHE'
											| 'CAMPINA_GRANDE'
											| 'CAMPINAS'
											| 'CAMPO_GRANDE'
											| 'CAMPO_LARGO'
											| 'CAMPOS_DOS GOYTACAZES'
											| 'CAN_THO'
											| 'CANOAS'
											| 'CANTON'
											| 'CAPE_TOWN'
											| 'CARACAS'
											| 'CARAGUATATUBA'
											| 'CARAPICUIBA'
											| 'CARDIFF'
											| 'CARIACICA'
											| 'CARMONA'
											| 'CARTAGENA'
											| 'CARUARU'
											| 'CASABLANCA'
											| 'CASCAVEL'
											| 'CASEROS'
											| 'CASTANHAL'
											| 'CASTRIES'
											| 'CATALAO'
											| 'CATAMARCA'
											| 'CATANDUVA'
											| 'CATANIA'
											| 'CAUCAIA'
											| 'CAXIAS_DO SUL'
											| 'CEBU_CITY'
											| 'CENTRAL'
											| 'CENTRO'
											| 'CENTURION'
											| 'CHAGUANAS'
											| 'CHANDIGARH'
											| 'CHANDLER'
											| 'CHANG_HUA'
											| 'CHAPECO'
											| 'CHARLESTON'
											| 'CHARLOTTE'
											| 'CHELYABINSK'
											| 'CHENNAI'
											| 'CHERKASY'
											| 'CHERNIVTSI'
											| 'CHIA'
											| 'CHIANG_MAI'
											| 'CHICLAYO'
											| 'CHIHUAHUA_CITY'
											| 'CHIMBOTE'
											| 'CHISINAU'
											| 'CHITTAGONG'
											| 'CHRISTCHURCH'
											| 'CINCINNATI'
											| 'CIREBON'
											| 'CITY_OF MUNTINLUPA'
											| 'CIUDAD_DEL ESTE'
											| 'CIUDAD_GUAYANA'
											| 'CIUDAD_JUAREZ'
											| 'CIUDAD_NEZAHUALCOYOTL'
											| 'CIUDAD_OBREGON'
											| 'CLEVELAND'
											| 'CLUJ_NAPOCA'
											| 'COCHABAMBA'
											| 'COIMBATORE'
											| 'COIMBRA'
											| 'COLOGNE'
											| 'COLOMBO'
											| 'COLORADO_SPRINGS'
											| 'COLUMBIA'
											| 'COLUMBUS'
											| 'COMODORO_RIVADAVIA'
											| 'CONCEPCION'
											| 'CONCORD'
											| 'CONSTANTA'
											| 'CONSTANTINE'
											| 'CONTAGEM'
											| 'COPENHAGEN'
											| 'CORDOBA'
											| 'CORRIENTES'
											| 'CORUM'
											| 'COTIA'
											| 'COVENTRY'
											| 'CRAIOVA'
											| 'CRICIUMA'
											| 'CROYDON'
											| 'CUAUTITLAN_IZCALLI'
											| 'CUCUTA'
											| 'CUENCA'
											| 'CUERNAVACA'
											| 'CUIABA'
											| 'CULIACAN'
											| 'CURITIBA'
											| 'CUSCO'
											| 'DA_NANG'
											| 'DAGUPAN'
											| 'DAKAR'
											| 'DALLAS'
											| 'DAMIETTA'
											| 'DAMMAM'
											| 'DAR_ES SALAAM'
											| 'DASMARINAS'
											| 'DAVAO_CITY'
											| 'DAYTON'
											| 'DEBRECEN'
											| 'DECATUR'
											| 'DEHRADUN'
											| 'DELHI'
											| 'DENIZLI'
											| 'DENPASAR'
											| 'DENVER'
											| 'DEPOK'
											| 'DERBY'
											| 'DETROIT'
											| 'DHAKA'
											| 'DIADEMA'
											| 'DIVINOPOLIS'
											| 'DIYARBAKIR'
											| 'DJELFA'
											| 'DNIPRO'
											| 'DOHA'
											| 'DORTMUND'
											| 'DOURADOS'
											| 'DRESDEN'
											| 'DUBAI'
											| 'DUBLIN'
											| 'DUEZCE'
											| 'DUISBURG'
											| 'DUQUE_DE CAXIAS'
											| 'DURANGO'
											| 'DURBAN'
											| 'DUSSELDORF'
											| 'ECATEPEC'
											| 'EDINBURGH'
											| 'EDIRNE'
											| 'EDMONTON'
											| 'EL_JADIDA'
											| 'EL_PASO'
											| 'ELAZIG'
											| 'EMBU'
											| 'ENSENADA'
											| 'ERBIL'
											| 'ERZURUM'
											| 'ESKISEHIR'
											| 'ESPOO'
											| 'ESSEN'
											| 'FAISALABAD'
											| 'FAYETTEVILLE'
											| 'FAZENDA_RIO GRANDE'
											| 'FEIRA_DE SANTANA'
											| 'FES'
											| 'FLORENCE'
											| 'FLORENCIO_VARELA'
											| 'FLORIANOPOLIS'
											| 'FONTANA'
											| 'FORMOSA'
											| 'FORT_LAUDERDALE'
											| 'FORT_WAYNE'
											| 'FORT_WORTH'
											| 'FORTALEZA'
											| 'FOZ_DO IGUACU'
											| 'FRANCA'
											| 'FRANCISCO_MORATO'
											| 'FRANCO_DA ROCHA'
											| 'FRANKFURT_AM MAIN'
											| 'FREDERICKSBURG'
											| 'FRESNO'
											| 'FUNCHAL'
											| 'GABORONE'
											| 'GAINESVILLE'
											| 'GALATI'
											| 'GANGNAM_GU'
											| 'GARANHUNS'
											| 'GATINEAU'
											| 'GAZIANTEP'
											| 'GDANSK'
											| 'GDYNIA'
											| 'GENERAL_TRIAS'
											| 'GENEVA'
											| 'GENOA'
											| 'GEORGE_TOWN'
											| 'GEORGETOWN'
											| 'GHAZIABAD'
											| 'GHENT'
											| 'GIJON'
											| 'GIRESUN'
											| 'GIZA'
											| 'GLASGOW'
											| 'GLENDALE'
											| 'GLIWICE'
											| 'GOIANIA'
											| 'GOMEL'
											| 'GOTHENBURG'
											| 'GOVERNADOR_VALADARES'
											| 'GOYANG_SI'
											| 'GRANADA'
											| 'GRAND_RAPIDS'
											| 'GRAVATAI'
											| 'GRAZ'
											| 'GREENSBORO'
											| 'GREENVILLE'
											| 'GUADALAJARA'
											| 'GUADALUPE'
											| 'GUANGZHOU'
											| 'GUARAPUAVA'
											| 'GUARATINGUETA'
											| 'GUARUJA'
											| 'GUARULHOS'
											| 'GUATEMALA_CITY'
											| 'GUAYAQUIL'
											| 'GUJRANWALA'
											| 'GURUGRAM'
											| 'GUSTAVO_ADOLFO MADERO'
											| 'GUWAHATI'
											| 'GWANAK_GU'
											| 'HACKNEY'
											| 'HAIFA'
											| 'HAIPHONG'
											| 'HAMBURG'
											| 'HAMILTON'
											| 'HANOI'
											| 'HANOVER'
											| 'HARARE'
											| 'HAVANA'
											| 'HELSINKI'
											| 'HENDERSON'
											| 'HEREDIA'
											| 'HERMOSILLO'
											| 'HIALEAH'
											| 'HO_CHI MINH CITY'
											| 'HOLLYWOOD'
											| 'HOLON'
											| 'HONOLULU'
											| 'HORTOLANDIA'
											| 'HRODNA'
											| 'HSINCHU'
											| 'HUANCAYO'
											| 'HUANUCO'
											| 'HULL'
											| 'HURLINGHAM'
											| 'HYDERABAD'
											| 'IASI'
											| 'IBAGUE'
											| 'ICA'
											| 'ILAM'
											| 'ILFORD'
											| 'ILIGAN'
											| 'ILOILO_CITY'
											| 'IMPERATRIZ'
											| 'IMUS'
											| 'INCHEON'
											| 'INDAIATUBA'
											| 'INDIANAPOLIS'
											| 'INDORE'
											| 'IPATINGA'
											| 'IPOH'
											| 'IQUIQUE'
											| 'IRVINE'
											| 'ISIDRO_CASANOVA'
											| 'ISLAMABAD'
											| 'ISLINGTON'
											| 'ISMAILIA'
											| 'ISPARTA'
											| 'ISTANBUL'
											| 'ITABORAI'
											| 'ITABUNA'
											| 'ITAJAI'
											| 'ITANHAEM'
											| 'ITAPEVI'
											| 'ITAQUAQUECETUBA'
											| 'ITUZAINGO'
											| 'IZMIR'
											| 'IZTAPALAPA'
											| 'JABOATAO_DOS GUARARAPES'
											| 'JACAREI'
											| 'JACKSON'
											| 'JACKSONVILLE'
											| 'JAIPUR'
											| 'JAKARTA'
											| 'JARAGUA_DO SUL'
											| 'JAU'
											| 'JEDDAH'
											| 'JEMBER'
											| 'JERUSALEM'
											| 'JOAO_MONLEVADE'
											| 'JOAO_PESSOA'
											| 'JODHPUR'
											| 'JOHANNESBURG'
											| 'JOHOR_BAHRU'
											| 'JOINVILLE'
											| 'JOSE_C PAZ'
											| 'JOSE_MARIA EZEIZA'
											| 'JUAREZ'
											| 'JUAZEIRO_DO NORTE'
											| 'JUIZ_DE FORA'
											| 'JUNDIAI'
											| 'KAHRAMANMARAS'
											| 'KAMPALA'
											| 'KANPUR'
											| 'KANSAS_CITY'
											| 'KAOHSIUNG_CITY'
											| 'KARABUK'
											| 'KARACHI'
											| 'KARLSRUHE'
											| 'KARNAL'
											| 'KASKI'
											| 'KASTAMONU'
											| 'KATHMANDU'
											| 'KATOWICE'
											| 'KATSINA'
											| 'KATY'
											| 'KAUNAS'
											| 'KAYSERI'
											| 'KAZAN'
											| 'KECSKEMET'
											| 'KEDIRI'
											| 'KENITRA'
											| 'KHARKIV'
											| 'KHMELNYTSKYI'
											| 'KHON_KAEN'
											| 'KIELCE'
											| 'KIGALI'
											| 'KINGSTON'
											| 'KIRKLARELI'
											| 'KISSIMMEE'
											| 'KITCHENER'
											| 'KLAIPEDA'
											| 'KNOXVILLE'
											| 'KOCHI'
											| 'KOLKATA'
											| 'KOLLAM'
											| 'KONYA'
											| 'KOSEKOY'
											| 'KOSICE'
											| 'KOTA_KINABALU'
											| 'KOZHIKODE'
											| 'KRAKOW'
											| 'KRASNODAR'
											| 'KRYVYI_RIH'
											| 'KUALA_LUMPUR'
											| 'KUCHING'
											| 'KUTAHYA'
											| 'KUTAISI'
											| 'KUWAIT_CITY'
											| 'KYIV'
											| 'LA_PAZ'
											| 'LA_PLATA'
											| 'LA_RIOJA'
											| 'LA_SERENA'
											| 'LAFAYETTE'
											| 'LAFERRERE'
											| 'LAGES'
											| 'LAGOS'
											| 'LAHORE'
											| 'LAHUG'
											| 'LAKE_WORTH'
											| 'LAKELAND'
											| 'LANCASTER'
											| 'LANUS'
											| 'LAS_PALMAS DE GRAN CANARIA'
											| 'LAS_PINAS'
											| 'LAS_VEGAS'
											| 'LAUSANNE'
											| 'LAVAL'
											| 'LAWRENCEVILLE'
											| 'LE_MANS'
											| 'LEEDS'
											| 'LEICESTER'
											| 'LEIPZIG'
											| 'LEON'
											| 'LEXINGTON'
											| 'LIBREVILLE'
											| 'LIEGE'
											| 'LILLE'
											| 'LIMA'
											| 'LIMASSOL'
											| 'LIMEIRA'
											| 'LINCOLN'
											| 'LINHARES'
											| 'LIPA_CITY'
											| 'LISBON'
											| 'LIVERPOOL'
											| 'LJUBLJANA'
											| 'LODZ'
											| 'LOJA'
											| 'LOMAS_DE ZAMORA'
											| 'LOME'
											| 'LONDRINA'
											| 'LONG_BEACH'
											| 'LONGUEUIL'
											| 'LOUISVILLE'
											| 'LUANDA'
											| 'LUBLIN'
											| 'LUCENA_CITY'
											| 'LUCKNOW'
											| 'LUDHIANA'
											| 'LUSAKA'
											| 'LUXEMBOURG'
											| 'LUZIANIA'
											| 'LVIV'
											| 'LYON'
											| 'MABALACAT'
											| 'MACAE'
											| 'MACAO'
											| 'MACAPA'
											| 'MACEIO'
											| 'MACHALA'
											| 'MADISON'
											| 'MADRID'
											| 'MAGE'
											| 'MAGELANG'
											| 'MAGNESIA_AD SIPYLUM'
											| 'MAKASSAR'
											| 'MAKATI_CITY'
											| 'MALABON'
											| 'MALAGA'
											| 'MALANG'
											| 'MALAPPURAM'
											| 'MALDONADO'
											| 'MALE'
											| 'MALMO'
											| 'MANADO'
											| 'MANAGUA'
											| 'MANAMA'
											| 'MANAUS'
											| 'MANCHESTER'
											| 'MANDALUYONG_CITY'
											| 'MANILA'
											| 'MANIZALES'
											| 'MANNHEIM'
											| 'MAPUTO'
											| 'MAR_DEL PLATA'
											| 'MARABA'
											| 'MARACAIBO'
											| 'MARACANAU'
											| 'MARACAY'
											| 'MARDIN'
											| 'MARIBOR'
											| 'MARICA'
											| 'MARIETTA'
											| 'MARIKINA_CITY'
											| 'MARILIA'
											| 'MARINGA'
											| 'MARRAKESH'
											| 'MARSEILLE'
											| 'MAUA'
											| 'MAZATLAN'
											| 'MEDAN'
											| 'MEDELLIN'
											| 'MEDINA'
											| 'MEERUT'
											| 'MEKNES'
											| 'MELBOURNE'
											| 'MEMPHIS'
											| 'MENDOZA'
											| 'MERIDA'
											| 'MERKEZ'
											| 'MERLO'
											| 'MERSIN'
											| 'MESA'
											| 'MEXICALI'
											| 'MEXICO_CITY'
											| 'MILAN'
											| 'MILTON_KEYNES'
											| 'MILWAUKEE'
											| 'MINNEAPOLIS'
											| 'MINSK'
											| 'MISKOLC'
											| 'MISSISSAUGA'
											| 'MOGI_DAS CRUZES'
											| 'MOHALI'
											| 'MONROE'
											| 'MONTE_GRANDE'
											| 'MONTEGO_BAY'
											| 'MONTERREY'
											| 'MONTES_CLAROS'
											| 'MONTEVIDEO'
											| 'MONTGOMERY'
											| 'MONTPELLIER'
											| 'MONTREAL'
											| 'MORELIA'
											| 'MORENO'
											| 'MORON'
											| 'MOSSORO'
											| 'MUGLA'
											| 'MULTAN'
											| 'MUMBAI'
											| 'MUNICH'
											| 'MURCIA'
											| 'MUSCAT'
											| 'MUZAFFARGARH'
											| 'MYKOLAYIV'
											| 'NAALDWIJK'
											| 'NAGA'
											| 'NAGPUR'
											| 'NAIROBI'
											| 'NANTES'
											| 'NAPLES'
											| 'NASHVILLE'
											| 'NASSAU'
											| 'NASUGBU'
											| 'NATAL'
											| 'NAUCALPAN'
											| 'NAVI_MUMBAI'
											| 'NEIVA'
											| 'NEUQUEN'
											| 'NEVSEHIR'
											| 'NEW_DELHI'
											| 'NEW_ORLEANS'
											| 'NEW_TAIPEI'
											| 'NEWARK'
											| 'NEWCASTLE_UPON TYNE'
											| 'NHA_TRANG'
											| 'NICE'
											| 'NICOSIA'
											| 'NILOPOLIS'
											| 'NIS'
											| 'NITEROI'
											| 'NITRA'
											| 'NIZHNIY_NOVGOROD'
											| 'NOGALES'
											| 'NOIDA'
											| 'NORTHAMPTON'
											| 'NORWICH'
											| 'NOTTINGHAM'
											| 'NOVA_FRIBURGO'
											| 'NOVA_IGUACU'
											| 'NOVI_SAD'
											| 'NOVO_HAMBURGO'
											| 'NOVOSIBIRSK'
											| 'NUREMBERG'
											| 'OAKLAND'
											| 'OAXACA_CITY'
											| 'ODESA'
											| 'OKLAHOMA_CITY'
											| 'OLINDA'
											| 'OLOMOUC'
											| 'OLONGAPO_CITY'
											| 'OLSZTYN'
											| 'OMAHA'
											| 'ORADEA'
											| 'ORAN'
											| 'ORDU'
											| 'ORLANDO'
											| 'OSASCO'
											| 'OSLO'
											| 'OSMANIYE'
											| 'OSTRAVA'
											| 'OTTAWA'
											| 'OUJDA'
											| 'OURINHOS'
											| 'PACHUCA'
											| 'PADOVA'
											| 'PALAKKAD'
											| 'PALEMBANG'
											| 'PALERMO'
											| 'PALHOCA'
											| 'PALMA'
											| 'PALMAS'
											| 'PANAMA_CITY'
											| 'PARAMARIBO'
											| 'PARANA'
											| 'PARANAGUA'
											| 'PARANAQUE_CITY'
											| 'PARAUAPEBAS'
											| 'PARIS'
											| 'PARNAIBA'
											| 'PARNAMIRIM'
											| 'PASSO_FUNDO'
											| 'PASTO'
											| 'PATAN'
											| 'PATNA'
											| 'PATOS_DE MINAS'
											| 'PAULISTA'
											| 'PECS'
											| 'PEKANBARU'
											| 'PELOTAS'
											| 'PEORIA'
											| 'PEREIRA'
											| 'PERM'
											| 'PERTH'
											| 'PESCARA'
											| 'PESHAWAR'
											| 'PETAH_TIKVA'
											| 'PETALING_JAYA'
											| 'PETROLINA'
											| 'PETROPOLIS'
											| 'PHILADELPHIA'
											| 'PHNOM_PENH'
											| 'PHOENIX'
											| 'PILAR'
											| 'PINDAMONHANGABA'
											| 'PIRACICABA'
											| 'PITESTI'
											| 'PITTSBURGH'
											| 'PIURA'
											| 'PLANO'
											| 'PLOIESTI'
											| 'PLOVDIV'
											| 'PLYMOUTH'
											| 'POCOS_DE CALDAS'
											| 'PODGORICA'
											| 'POLTAVA'
											| 'PONTA_GROSSA'
											| 'PONTIANAK'
											| 'POPAYAN'
											| 'PORT_AU PRINCE'
											| 'PORT_ELIZABETH'
											| 'PORT_HARCOURT'
											| 'PORT_LOUIS'
											| 'PORT_MONTT'
											| 'PORT_OF SPAIN'
											| 'PORT_SAID'
											| 'PORTLAND'
											| 'PORTO'
											| 'PORTO_ALEGRE'
											| 'PORTO_SEGURO'
											| 'PORTO_VELHO'
											| 'PORTOVIEJO'
											| 'POSADAS'
											| 'POUSO_ALEGRE'
											| 'POZNAN'
											| 'PRAGUE'
											| 'PRAIA_GRANDE'
											| 'PRESIDENTE_PRUDENTE'
											| 'PRETORIA'
											| 'PRISTINA'
											| 'PROVIDENCE'
											| 'PUCALLPA'
											| 'PUCHONG_BATU DUA BELAS'
											| 'PUEBLA_CITY'
											| 'PUNE'
											| 'QUEBEC'
											| 'QUEENS'
											| 'QUEIMADOS'
											| 'QUERETARO_CITY'
											| 'QUEZON_CITY'
											| 'QUILMES'
											| 'QUITO'
											| 'RABAT'
											| 'RAIPUR'
											| 'RAJKOT'
											| 'RAJSHAHI'
											| 'RALEIGH'
											| 'RAMAT_GAN'
											| 'RANCAGUA'
											| 'RANCHI'
											| 'RAS_AL KHAIMAH'
											| 'RAWALPINDI'
											| 'READING'
											| 'RECIFE'
											| 'REGINA'
											| 'RENNES'
											| 'RENO'
											| 'RESISTENCIA'
											| 'REYKJAVIK'
											| 'REYNOSA'
											| 'RIBEIRAO_DAS NEVES'
											| 'RIBEIRAO_PRETO'
											| 'RICHMOND'
											| 'RIGA'
											| 'RIO_BRANCO'
											| 'RIO_CLARO'
											| 'RIO_CUARTO'
											| 'RIO_DE JANEIRO'
											| 'RIO_DO SUL'
											| 'RIO_GALLEGOS'
											| 'RIO_GRANDE'
											| 'RISHON_LETSIYYON'
											| 'RIVERSIDE'
											| 'RIYADH'
											| 'RIZE'
											| 'ROCHESTER'
											| 'ROME'
											| 'RONDONOPOLIS'
											| 'ROSARIO'
											| 'ROSEAU'
											| 'ROSTOV_ON DON'
											| 'ROTTERDAM'
											| 'ROUEN'
											| 'ROUSSE'
											| 'RZESZOW'
											| 'SACRAMENTO'
											| 'SAGAR'
											| 'SAINT_PAUL'
											| 'SALE'
											| 'SALT_LAKE CITY'
											| 'SALTA'
											| 'SALTILLO'
											| 'SALVADOR'
											| 'SAMARA'
											| 'SAMARINDA'
											| 'SAMARKAND'
											| 'SAMSUN'
											| 'SAN_ANTONIO'
											| 'SAN_DIEGO'
											| 'SAN_FERNANDO'
											| 'SAN_FRANCISCO'
											| 'SAN_JOSE'
											| 'SAN_JOSE DEL MONTE'
											| 'SAN_JUAN'
											| 'SAN_JUSTO'
											| 'SAN_LUIS'
											| 'SAN_LUIS POTOSI CITY'
											| 'SAN_MIGUEL'
											| 'SAN_MIGUEL DE TUCUMAN'
											| 'SAN_PABLO CITY'
											| 'SAN_PEDRO'
											| 'SAN_PEDRO SULA'
											| 'SAN_SALVADOR'
											| 'SAN_SALVADOR DE JUJUY'
											| 'SANAA'
											| 'SANLIURFA'
											| 'SANTA_CRUZ'
											| 'SANTA_CRUZ DE TENERIFE'
											| 'SANTA_CRUZ DO SUL'
											| 'SANTA_FE'
											| 'SANTA_LUZIA'
											| 'SANTA_MARIA'
											| 'SANTA_MARTA'
											| 'SANTA_ROSA'
											| 'SANTAREM'
											| 'SANTIAGO'
											| 'SANTIAGO_DE CALI'
											| 'SANTIAGO_DE LOS CABALLEROS'
											| 'SANTO_ANDRE'
											| 'SANTO_DOMINGO'
											| 'SANTO_DOMINGO ESTE'
											| 'SANTOS'
											| 'SAO_BERNARDO DO CAMPO'
											| 'SAO_CARLOS'
											| 'SAO_GONCALO'
											| 'SAO_JOAO DE MERITI'
											| 'SAO_JOSE'
											| 'SAO_JOSE DO RIO PRETO'
											| 'SAO_JOSE DOS CAMPOS'
											| 'SAO_JOSE DOS PINHAIS'
											| 'SAO_LEOPOLDO'
											| 'SAO_LUIS'
											| 'SAO_PAULO'
											| 'SAO_VICENTE'
											| 'SARAJEVO'
											| 'SASKATOON'
											| 'SCARBOROUGH'
											| 'SEATTLE'
											| 'SEMARANG'
											| 'SEO_GU'
											| 'SEONGNAM_SI'
											| 'SEOUL'
											| 'SERRA'
											| 'SETE_LAGOAS'
											| 'SETIF'
											| 'SETUBAL'
											| 'SEVILLE'
											| 'SFAX'
											| 'SHAH_ALAM'
											| 'SHANGHAI'
											| 'SHARJAH'
											| 'SHEFFIELD'
											| 'SHENZHEN'
											| 'SHIMLA'
											| 'SIAULIAI'
											| 'SIBIU'
											| 'SIDOARJO'
											| 'SIKAR'
											| 'SILVER_SPRING'
											| 'SINOP'
											| 'SIVAS'
											| 'SKIKDA'
											| 'SKOPJE'
											| 'SLOUGH'
											| 'SOBRAL'
											| 'SOFIA'
											| 'SOROCABA'
											| 'SOUSSE'
											| 'SOUTH_TANGERANG'
											| 'SOUTHAMPTON'
											| 'SOUTHWARK'
											| 'SPLIT'
											| 'SPOKANE'
											| 'SPRING'
											| 'SPRINGFIELD'
											| 'ST_LOUIS'
											| 'ST_PETERSBURG'
											| 'STARA_ZAGORA'
											| 'STATEN_ISLAND'
											| 'STOCKHOLM'
											| 'STOCKTON'
											| 'STOKE_ON TRENT'
											| 'STRASBOURG'
											| 'STUTTGART'
											| 'SUMARE'
											| 'SURABAYA'
											| 'SURAKARTA'
											| 'SURAT'
											| 'SURREY'
											| 'SUWON'
											| 'SUZANO'
											| 'SYDNEY'
											| 'SZCZECIN'
											| 'SZEGED'
											| 'SZEKESFEHERVAR'
											| 'TABOAO_DA SERRA'
											| 'TACNA'
											| 'TACOMA'
											| 'TAGUIG'
											| 'TAICHUNG'
											| 'TAINAN_CITY'
											| 'TAIPEI'
											| 'TALAVERA'
											| 'TALCA'
											| 'TALLAHASSEE'
											| 'TALLINN'
											| 'TAMPA'
											| 'TAMPERE'
											| 'TAMPICO'
											| 'TANGERANG'
											| 'TANGIER'
											| 'TANTA'
											| 'TANZA'
											| 'TAOYUAN_DISTRICT'
											| 'TAPPAHANNOCK'
											| 'TARLAC_CITY'
											| 'TASHKENT'
											| 'TASIKMALAYA'
											| 'TATUI'
											| 'TAUBATE'
											| 'TBILISI'
											| 'TEGUCIGALPA'
											| 'TEHRAN'
											| 'TEIXEIRA_DE FREITAS'
											| 'TEKIRDAG'
											| 'TEL_AVIV'
											| 'TEMUCO'
											| 'TEPIC'
											| 'TERESINA'
											| 'TERNOPIL'
											| 'TERRASSA'
											| 'TETOUAN'
											| 'THANE'
											| 'THE_BRONX'
											| 'THE_HAGUE'
											| 'THESSALONIKI'
											| 'THIRUVANANTHAPURAM'
											| 'THRISSUR'
											| 'TIJUANA'
											| 'TIMISOARA'
											| 'TIRANA'
											| 'TLALNEPANTLA'
											| 'TLAXCALA_CITY'
											| 'TLEMCEN'
											| 'TOKAT_PROVINCE'
											| 'TOKYO'
											| 'TOLUCA'
											| 'TORONTO'
											| 'TORREON'
											| 'TOULOUSE'
											| 'TRABZON'
											| 'TRUJILLO'
											| 'TUBARAO'
											| 'TUCSON'
											| 'TUGUEGARAO_CITY'
											| 'TULSA'
											| 'TUNIS'
											| 'TUNJA'
											| 'TURIN'
											| 'TUXTLA_GUTIERREZ'
											| 'TUZLA'
											| 'UBERABA'
											| 'UBERLANDIA'
											| 'UFA'
											| 'ULAN_BATOR'
											| 'UMEDA'
											| 'URDANETA'
											| 'USAK'
											| 'VADODARA'
											| 'VALENCIA'
											| 'VALINHOS'
											| 'VALLADOLID'
											| 'VALLEDUPAR'
											| 'VALPARAISO'
											| 'VALPARAISO_DE GOIAS'
											| 'VAN'
											| 'VANCOUVER'
											| 'VARANASI'
											| 'VARGINHA'
											| 'VARNA'
											| 'VARZEA_PAULISTA'
											| 'VENUSTIANO_CARRANZA'
											| 'VERACRUZ'
											| 'VERONA'
											| 'VIAMAO'
											| 'VICTORIA'
											| 'VIENNA'
											| 'VIENTIANE'
											| 'VIGO'
											| 'VIJAYAWADA'
											| 'VILA_NOVA DE GAIA'
											| 'VILA_VELHA'
											| 'VILLA_BALLESTER'
											| 'VILLAVICENCIO'
											| 'VILNIUS'
											| 'VINA_DEL MAR'
											| 'VINNYTSIA'
											| 'VIRGINIA_BEACH'
											| 'VISAKHAPATNAM'
											| 'VITORIA'
											| 'VITORIA_DA CONQUISTA'
											| 'VITORIA_DE SANTO ANTAO'
											| 'VOLTA_REDONDA'
											| 'VORONEZH'
											| 'WARSAW'
											| 'WASHINGTON'
											| 'WELLINGTON'
											| 'WEST_PALM BEACH'
											| 'WICHITA'
											| 'WILLEMSTAD'
											| 'WILMINGTON'
											| 'WINDHOEK'
											| 'WINDSOR'
											| 'WINNIPEG'
											| 'WOLVERHAMPTON'
											| 'WOODBRIDGE'
											| 'WROCLAW'
											| 'WUPPERTAL'
											| 'XALAPA'
											| 'YALOVA'
											| 'YANGON'
											| 'YEKATERINBURG'
											| 'YEREVAN'
											| 'YOGYAKARTA'
											| 'YOKOHAMA'
											| 'YONGIN_SI'
											| 'ZABRZE'
											| 'ZAGAZIG'
											| 'ZAGREB'
											| 'ZAMBOANGA_CITY'
											| 'ZAPOPAN'
											| 'ZAPORIZHZHYA'
											| 'ZARAGOZA'
											| 'ZHONGLI_DISTRICT'
											| 'ZIELONA_GORA'
											| 'ZONGULDAK'
											| 'ZURICH';
										/** Country code (e.g., 'US', 'GB', 'DE') - ISO 3166-1 alpha-2 */
										country:
											| 'US'
											| 'CA'
											| 'MX'
											| 'GB'
											| 'DE'
											| 'FR'
											| 'IT'
											| 'ES'
											| 'PL'
											| 'NL'
											| 'SE'
											| 'NO'
											| 'DK'
											| 'FI'
											| 'CH'
											| 'AT'
											| 'BE'
											| 'IE'
											| 'PT'
											| 'GR'
											| 'CZ'
											| 'HU'
											| 'RO'
											| 'BG'
											| 'SK'
											| 'SI'
											| 'HR'
											| 'EE'
											| 'LV'
											| 'LT'
											| 'LU'
											| 'MT'
											| 'CY'
											| 'IS'
											| 'LI'
											| 'MC'
											| 'SM'
											| 'VA'
											| 'JP'
											| 'KR'
											| 'CN'
											| 'HK'
											| 'TW'
											| 'SG'
											| 'AU'
											| 'NZ'
											| 'IN'
											| 'TH'
											| 'MY'
											| 'PH'
											| 'ID'
											| 'VN'
											| 'AF'
											| 'BD'
											| 'BN'
											| 'KH'
											| 'LA'
											| 'LK'
											| 'MM'
											| 'NP'
											| 'PK'
											| 'FJ'
											| 'PG'
											| 'AE'
											| 'SA'
											| 'IL'
											| 'TR'
											| 'IR'
											| 'IQ'
											| 'JO'
											| 'KW'
											| 'LB'
											| 'OM'
											| 'QA'
											| 'BH'
											| 'YE'
											| 'SY'
											| 'ZA'
											| 'EG'
											| 'MA'
											| 'NG'
											| 'KE'
											| 'DZ'
											| 'AO'
											| 'BW'
											| 'ET'
											| 'GH'
											| 'CI'
											| 'LY'
											| 'MZ'
											| 'RW'
											| 'SN'
											| 'TN'
											| 'UG'
											| 'ZM'
											| 'ZW'
											| 'TZ'
											| 'MU'
											| 'SC'
											| 'BR'
											| 'AR'
											| 'CL'
											| 'CO'
											| 'PE'
											| 'VE'
											| 'EC'
											| 'UY'
											| 'PY'
											| 'BO'
											| 'CR'
											| 'CU'
											| 'DO'
											| 'GT'
											| 'HN'
											| 'JM'
											| 'NI'
											| 'PA'
											| 'SV'
											| 'TT'
											| 'BB'
											| 'BZ'
											| 'GY'
											| 'SR'
											| 'RU'
											| 'UA'
											| 'BY'
											| 'KZ'
											| 'UZ'
											| 'AZ'
											| 'GE'
											| 'AM'
											| 'MD'
											| 'MK'
											| 'AL'
											| 'BA'
											| 'RS'
											| 'ME'
											| 'XK'
											| 'MN'
											| 'KG'
											| 'TJ'
											| 'TM';
										/** State code (e.g., 'NY', 'CA') - US states only */
										state?:
											| 'AL'
											| 'AK'
											| 'AZ'
											| 'AR'
											| 'CA'
											| 'CO'
											| 'CT'
											| 'DE'
											| 'FL'
											| 'GA'
											| 'HI'
											| 'ID'
											| 'IL'
											| 'IN'
											| 'IA'
											| 'KS'
											| 'KY'
											| 'LA'
											| 'ME'
											| 'MD'
											| 'MA'
											| 'MI'
											| 'MN'
											| 'MS'
											| 'MO'
											| 'MT'
											| 'NE'
											| 'NV'
											| 'NH'
											| 'NJ'
											| 'NM'
											| 'NY'
											| 'NC'
											| 'ND'
											| 'OH'
											| 'OK'
											| 'OR'
											| 'PA'
											| 'RI'
											| 'SC'
											| 'SD'
											| 'TN'
											| 'TX'
											| 'UT'
											| 'VT'
											| 'VA'
											| 'WA'
											| 'WV'
											| 'WI'
											| 'WY'
											| 'DC'
											| 'PR'
											| 'GU'
											| 'VI';
									};
							  }
							| {
									/** Proxy server URL */
									server: string;
							  }
							| {
									/** Specific fixed IP identifier. Omit to use any active fixed IP owned by the org. */
									id?: string;
									/** Use Steel fixed IP proxies */
									type: 'fixed';
							  }
					  )
			  )
			| SteelJsonValue;
		/** Custom user agent string for the browser session */
		userAgent?: string;
	};
	'sessions.credentials.attach': {
		id: string;
		/** At most 100 bindings; KV bindings may specify allowedOrigins. */
		bindings?: Array<
			| string
			| {
					allowedOrigins: Array<string>;
					reference: string;
			  }
		>;
		/** Ids of credentials (Secrets of kind `credential`) in the session's project. Binding makes the session's lookup `explicit` for good. */
		credentialIds?: Array<string>;
	};
	'sessions.credentials.detach': {
		/** The session id */
		id: string;
		/** The credential id to detach */
		credentialId: string;
	};
	'sessions.credentials.detachVault': {
		/** Vault or item reference to detach */
		reference: string;
		id: string;
	};
	'sessions.credentials.list': {
		id: string;
	};
	'sessions.credentials.replace': {
		id: string;
		/** At most 100 bindings; KV bindings may specify allowedOrigins. */
		bindings?: Array<
			| string
			| {
					allowedOrigins: Array<string>;
					reference: string;
			  }
		>;
		/** Ids of credentials (Secrets of kind `credential`) in the session's project. Binding makes the session's lookup `explicit` for good. */
		credentialIds?: Array<string>;
	};
	'sessions.events': {
		/** Compress the events */
		compressed?: boolean;
		/** Optional pagination limit */
		limit?: number;
		/** Opaque pagination token. Pass the Next-Cursor header value to get the next page. */
		pointer?: string;
		id: string;
	};
	'sessions.files.delete': {
		sessionId: string;
		path: string;
	};
	'sessions.files.deleteAll': {
		sessionId: string;
	};
	'sessions.files.download': {
		sessionId: string;
		path: string;
	};
	'sessions.files.downloadArchive': {
		sessionId: string;
	};
	'sessions.files.list': {
		sessionId: string;
	};
	'sessions.files.upload': {
		sessionId: string;
		/** The file to upload (binary) or URL string to download from */
		file: FileInput;
		/** Path to the file in the storage system */
		path?: string;
	};
	'sessions.get': {
		id: string;
	};
	'sessions.hlsPlaylist': {
		id: string;
	};
	'sessions.list': {
		/** Cursor ID for pagination */
		cursorId?: string;
		/** Number of sessions to return. Default is 50, max is 100. */
		limit?: number;
		/** Filter sessions by current status */
		status?: 'live' | 'released' | 'failed';
		/** Filter released sessions by why they ended. Live sessions have no release reason and are excluded whenever this is set. Without an explicit status, matching failed sessions are included. */
		releaseReason?:
			| 'user_requested'
			| 'timeout'
			| 'inactivity_timeout'
			| 'creation_timeout'
			| 'startup_failed'
			| 'browser_closed'
			| 'browser_crashed';
		/** Filter sessions by project */
		projectId?: string;
		/** Only sessions created at or after this ISO 8601 timestamp, e.g. 2026-10-01T00:00:00Z. */
		createdAfter?: string;
		/** Only sessions created before this ISO 8601 timestamp. */
		createdBefore?: string;
		/** Signals the session must carry; repeat the parameter to require several. All must match. Derived signals are finalized at release. */
		signal?: Array<
			| 'captcha_encountered'
			| 'proxy_connection_failed'
			| 'session_timeout_exceeded'
			| 'bot_detection_triggered'
			| 'context_restored'
		>;
		/** Exact-match metadata filters, e.g. metadata[environment]=production. All entries must match. Values match the stored string exactly; numbers and booleans are stored as strings, so metadata[attempt]=3 matches attempt sent as 3 or "3". */
		metadata?: Record<string, string>;
	};
	'sessions.liveDetails': {
		id: string;
	};
	'sessions.logs': {
		namespace?: string;
		startTime?: string;
		endTime?: string;
		eventTypes?: Array<string>;
		limit?: number;
		offset?: number;
		id: string;
	};
	'sessions.metadata.replace': {
		id: string;
		/** Customer-defined flat metadata: up to 50 keys and 8192 UTF-8 JSON bytes. Keys must start with a letter, use only letters, digits, underscores, dots or hyphens, and be at most 64 characters; steel_ is reserved. Values are strings (up to 1024 characters, valid Unicode without NUL), finite numbers… */
		metadata: Record<string, string | number | boolean>;
	};
	'sessions.metadata.update': {
		id: string;
		/** Metadata keys to change, up to 100 per update. Keys follow the same rules as metadata keys. Send a string, finite number or boolean to set a key, or null to remove it; keys you leave out are kept. The merged metadata must stay within 50 keys and 8192 UTF-8 JSON bytes. */
		metadata: Record<string, string | number | boolean | never | null>;
	};
	'sessions.release': {
		id: string;
	};
	'sessions.releaseAll': {
		/** Release sessions only within this project */
		projectId?: string;
	};
	'sessions.signalCatalog': Record<string, never>;
	'tools.pdf': {
		/** Delay before generating the PDF (in milliseconds) */
		delay?: number;
		/** Project to execute the PDF generation in. */
		projectId?: string;
		/** The desired region for the action to be performed in */
		region?: SteelJsonValue;
		/** URL of the webpage to convert to PDF */
		url: string;
		/** Use a Steel-provided residential proxy for generating the PDF */
		useProxy?: boolean;
	};
	'tools.scrape': {
		/** Delay before scraping (in milliseconds) */
		delay?: number;
		/** Desired format(s) for the scraped content. Default is `html`. */
		format?: Array<'html' | 'readability' | 'cleaned_html' | 'markdown'>;
		/** Include a PDF in the response */
		pdf?: boolean;
		/** Project to execute the scrape in. */
		projectId?: string;
		/** The desired region for the action to be performed in */
		region?: SteelJsonValue;
		/** Include a screenshot in the response */
		screenshot?: boolean;
		/** URL of the webpage to scrape. A URL without a scheme is fetched over HTTPS. */
		url: string;
		/** Use a Steel-provided residential proxy for the scrape */
		useProxy?: boolean;
	};
	'tools.screenshot': {
		/** Delay before capturing the screenshot (in milliseconds) */
		delay?: number;
		/** Capture the full page screenshot. Default is `false`. */
		fullPage?: boolean;
		/** Project to execute the screenshot in. */
		projectId?: string;
		/** The desired region for the action to be performed in */
		region?: SteelJsonValue;
		/** URL of the webpage to capture */
		url: string;
		/** Use a Steel-provided residential proxy for capturing the screenshot */
		useProxy?: boolean;
	};
	'vaults.create': {
		description?: string | null;
		/** 1–63 lowercase letters, digits, hyphens, underscores or dots; must start with a letter or digit. */
		name: string;
		projectId?: string;
	};
	'vaults.delete': {
		projectId?: string;
		id: string;
	};
	'vaults.get': {
		projectId?: string;
		id: string;
	};
	'vaults.list': {
		projectId?: string;
	};
	'vaults.update': {
		projectId?: string;
		id: string;
		description?: string | null;
		/** 1–63 lowercase letters, digits, hyphens, underscores or dots; must start with a letter or digit. */
		name?: string;
	};
};

export type SteelOperationOutputs = {
	'apiKeys.create': SteelApiKeyResponse;
	'auth.jwks': SteelJwks;
	'credentials.create': SteelCredentialMetadata;
	'credentials.delete': SteelSuccessResponse;
	'credentials.list': SteelCredentialList;
	'credentials.update': SteelCredentialMetadata;
	'extensions.delete': SteelDeleteResponse;
	'extensions.deleteAll': SteelDeleteResponse;
	'extensions.download': FileOutput;
	'extensions.list': SteelExtensionList;
	'extensions.update': SteelExtensionUploadResponse;
	'extensions.upload': SteelExtensionUploadResponse;
	'files.delete': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'files.download': FileOutput;
	'files.list': SteelMultipleFiles;
	'files.upload': SteelFileDetails;
	'profiles.create': SteelProfile;
	'profiles.delete': SteelProfile;
	'profiles.get': SteelProfile;
	'profiles.list': SteelProfileListResponse;
	'profiles.update': SteelProfile;
	'projects.get': SteelProject;
	'projects.list': SteelProjectsResponse;
	'secretConnections.create': {
		createdAt?: string | null;
		enabled?: boolean | null;
		id?: string | null;
		name?: string | null;
		provider?: string | null;
		tokenBudget?: {
			burst?: number | null;
			/** Tokens per second, with at most three decimal places. */
			refillPerSecond?: number | null;
		} | null;
		updatedAt?: string | null;
		/** For 1Password, a SHA-256 diagnostic fingerprint of sorted accessible vault IDs. For HashiCorp Vault, a SHA-256 fingerprint of the normalized endpoint and namespace. Neither proves immutable account or server identity. */
		vaultFingerprint?: string | null;
		version?: number | null;
	};
	'secretConnections.delete': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'secretConnections.get': {
		createdAt?: string | null;
		enabled?: boolean | null;
		id?: string | null;
		name?: string | null;
		provider?: string | null;
		tokenBudget?: {
			burst?: number | null;
			/** Tokens per second, with at most three decimal places. */
			refillPerSecond?: number | null;
		} | null;
		updatedAt?: string | null;
		/** For 1Password, a SHA-256 diagnostic fingerprint of sorted accessible vault IDs. For HashiCorp Vault, a SHA-256 fingerprint of the normalized endpoint and namespace. Neither proves immutable account or server identity. */
		vaultFingerprint?: string | null;
		version?: number | null;
	};
	'secretConnections.list': {
		connections?: Array<{
			createdAt?: string | null;
			enabled?: boolean | null;
			id?: string | null;
			name?: string | null;
			provider?: string | null;
			tokenBudget?: {
				burst?: number | null;
				/** Tokens per second, with at most three decimal places. */
				refillPerSecond?: number | null;
			} | null;
			updatedAt?: string | null;
			/** For 1Password, a SHA-256 diagnostic fingerprint of sorted accessible vault IDs. For HashiCorp Vault, a SHA-256 fingerprint of the normalized endpoint and namespace. Neither proves immutable account or server identity. */
			vaultFingerprint?: string | null;
			version?: number | null;
		}> | null;
	};
	'secretConnections.test': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'secretConnections.update': {
		createdAt?: string | null;
		enabled?: boolean | null;
		id?: string | null;
		name?: string | null;
		provider?: string | null;
		tokenBudget?: {
			burst?: number | null;
			/** Tokens per second, with at most three decimal places. */
			refillPerSecond?: number | null;
		} | null;
		updatedAt?: string | null;
		/** For 1Password, a SHA-256 diagnostic fingerprint of sorted accessible vault IDs. For HashiCorp Vault, a SHA-256 fingerprint of the normalized endpoint and namespace. Neither proves immutable account or server identity. */
		vaultFingerprint?: string | null;
		version?: number | null;
	};
	'sessions.agentLogs': SteelGetSessionAgentLogsResponse;
	'sessions.agentTraces': SteelGetSessionAgentTracesResponse;
	'sessions.captchas.solve': SteelCaptchaActionResponse;
	'sessions.captchas.solveImage': SteelCaptchaActionResponse;
	'sessions.captchas.status': SteelCaptchaStateResponse;
	'sessions.commands.cancelExecution': SteelRunCommandsResponse;
	'sessions.commands.getExecution': SteelRunCommandsResponse;
	'sessions.commands.run': SteelRunCommandsResponse;
	'sessions.computer': SteelComputerActionResponse;
	'sessions.context': SteelSessionContextResponse;
	'sessions.cost': SteelSessionCostResponse;
	'sessions.create': SteelSessionResponse;
	'sessions.credentials.attach': SteelSessionCredentialsResponse;
	'sessions.credentials.detach': SteelSessionCredentialsResponse;
	'sessions.credentials.detachVault': SteelSessionCredentialsResponse;
	'sessions.credentials.list': SteelSessionCredentialsResponse;
	'sessions.credentials.replace': SteelSessionCredentialsResponse;
	'sessions.events': {
		/** This page of results. */
		events: SteelGetSessionEventsResponse;
		/** Pass as pointer to read the next page; null on the last page. */
		nextCursor: string | null;
	};
	'sessions.files.delete': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'sessions.files.deleteAll': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'sessions.files.download': FileOutput;
	'sessions.files.downloadArchive': FileOutput;
	'sessions.files.list': SteelMultipleFiles;
	'sessions.files.upload': SteelFileDetails;
	'sessions.get': SteelSessionResponse;
	'sessions.hlsPlaylist': FileOutput;
	'sessions.list': SteelSessionsResponse;
	'sessions.liveDetails': SteelSessionLiveDetailsResponse;
	'sessions.logs': SteelGetSessionLogsResponse;
	'sessions.metadata.replace': SteelSessionMetadataResponse;
	'sessions.metadata.update': SteelSessionMetadataResponse;
	'sessions.release': SteelReleaseSessionResponse;
	'sessions.releaseAll': SteelReleaseSessionsResponse;
	'sessions.signalCatalog': SteelSessionSignalCatalogResponse;
	'tools.pdf': SteelPdfResponse;
	'tools.scrape': SteelScrapeResponse;
	'tools.screenshot': SteelScreenshotResponse;
	'vaults.create': SteelVault;
	'vaults.delete': {
		/** Steel accepted the call; it answered with no body. */
		success: true;
	};
	'vaults.get': SteelVault;
	'vaults.list': SteelVaultList;
	'vaults.update': SteelVault;
};
