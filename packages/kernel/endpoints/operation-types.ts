// Generated from Kernel's OpenAPI spec (https://api.onkernel.com/openapi.json,
// fetched 2026-11-20); kernel-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type KernelJsonValue =
	| null
	| boolean
	| number
	| string
	| KernelJsonValue[]
	| { [key: string]: KernelJsonValue | undefined };

export const KERNEL_OPERATION_IDS = [
	'apiKeys.create',
	'apiKeys.delete',
	'apiKeys.get',
	'apiKeys.list',
	'apiKeys.rotate',
	'apiKeys.update',
	'apps.list',
	'auditLogs.exportChunk',
	'auditLogs.exportDestinations.create',
	'auditLogs.exportDestinations.delete',
	'auditLogs.exportDestinations.get',
	'auditLogs.exportDestinations.list',
	'auditLogs.exportDestinations.test',
	'auditLogs.exportDestinations.update',
	'auditLogs.list',
	'auth.connections.create',
	'auth.connections.delete',
	'auth.connections.exchange',
	'auth.connections.get',
	'auth.connections.list',
	'auth.connections.login',
	'auth.connections.submit',
	'auth.connections.timeline',
	'auth.connections.update',
	'auth.context.get',
	'browserPools.acquire',
	'browserPools.create',
	'browserPools.delete',
	'browserPools.flush',
	'browserPools.get',
	'browserPools.list',
	'browserPools.release',
	'browserPools.update',
	'browsers.computer.batch',
	'browsers.computer.captureScreenshot',
	'browsers.computer.clickMouse',
	'browsers.computer.dragMouse',
	'browsers.computer.getMousePosition',
	'browsers.computer.moveMouse',
	'browsers.computer.pressKey',
	'browsers.computer.readClipboard',
	'browsers.computer.scroll',
	'browsers.computer.setCursorVisibility',
	'browsers.computer.typeText',
	'browsers.computer.writeClipboard',
	'browsers.create',
	'browsers.curl',
	'browsers.delete',
	'browsers.fs.createDirectory',
	'browsers.fs.deleteDirectory',
	'browsers.fs.deleteFile',
	'browsers.fs.downloadDirZip',
	'browsers.fs.fileInfo',
	'browsers.fs.listFiles',
	'browsers.fs.move',
	'browsers.fs.readFile',
	'browsers.fs.setFilePermissions',
	'browsers.fs.upload',
	'browsers.fs.uploadZip',
	'browsers.fs.watch.start',
	'browsers.fs.watch.stop',
	'browsers.fs.writeFile',
	'browsers.get',
	'browsers.list',
	'browsers.liveView.create',
	'browsers.loadExtensions',
	'browsers.playwright.execute',
	'browsers.playwright.executors.delete',
	'browsers.playwright.executors.list',
	'browsers.process.exec',
	'browsers.process.kill',
	'browsers.process.resize',
	'browsers.process.spawn',
	'browsers.process.status',
	'browsers.process.stdin',
	'browsers.repl',
	'browsers.replays.download',
	'browsers.replays.list',
	'browsers.replays.start',
	'browsers.replays.stop',
	'browsers.saveProfile',
	'browsers.telemetry.events',
	'browsers.update',
	'browsers.webmcp.customTools.add',
	'browsers.webmcp.customTools.list',
	'browsers.webmcp.customTools.remove',
	'browsers.webmcp.invokeTool',
	'browsers.webmcp.listTools',
	'configRegistry.analyses.cancel',
	'configRegistry.analyses.get',
	'configRegistry.analyses.list',
	'configRegistry.list',
	'configRegistry.lookup',
	'configRegistry.resolve',
	'credentialProviders.create',
	'credentialProviders.delete',
	'credentialProviders.get',
	'credentialProviders.list',
	'credentialProviders.listItems',
	'credentialProviders.test',
	'credentialProviders.update',
	'credentials.create',
	'credentials.delete',
	'credentials.get',
	'credentials.list',
	'credentials.totpCode',
	'credentials.update',
	'deployments.create',
	'deployments.delete',
	'deployments.get',
	'deployments.list',
	'extensions.delete',
	'extensions.download',
	'extensions.downloadFromChromeStore',
	'extensions.get',
	'extensions.list',
	'extensions.upload',
	'invocations.create',
	'invocations.deleteBrowsers',
	'invocations.get',
	'invocations.list',
	'invocations.listBrowsers',
	'invocations.update',
	'organization.entitlements.get',
	'organization.limits.get',
	'organization.limits.update',
	'profiles.create',
	'profiles.delete',
	'profiles.download',
	'profiles.get',
	'profiles.list',
	'profiles.update',
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.limits.get',
	'projects.limits.update',
	'projects.list',
	'projects.update',
	'proxies.check',
	'proxies.create',
	'proxies.delete',
	'proxies.get',
	'proxies.list',
	'proxies.update',
	'proxyIPs.get',
	'proxyIPs.list',
	'reportTypes.get',
	'reportTypes.list',
	'reportTypes.versions.get',
	'reports.create',
	'reports.get',
	'reports.list',
	'search.contents.fetch',
	'search.create',
	'search.get',
	'search.providers.list',
	'tasks.create',
	'tasks.get',
	'tasks.linkBrowsers',
	'tasks.list',
	'telemetry.destinations.create',
	'telemetry.destinations.delete',
	'telemetry.destinations.get',
	'telemetry.destinations.list',
	'telemetry.destinations.update',
	'vaultProviderConfigs.create',
	'vaultProviderConfigs.delete',
	'vaultProviderConfigs.get',
	'vaultProviderConfigs.list',
	'vaultProviderConfigs.update',
	'vaults.delete',
	'vaults.get',
	'vaults.getEncryptionKey',
	'vaults.items.delete',
	'vaults.items.events',
	'vaults.items.get',
	'vaults.items.list',
	'vaults.items.performOperation',
	'vaults.items.update',
	'vaults.items.upsert',
	'vaults.list',
	'vaults.upsert',
] as const;

export type KernelOperationId = (typeof KERNEL_OPERATION_IDS)[number];

/** Start enrollment of a card in a connected Kernel wallet, including its first card, only when the wallet advertises add_payment_method. Returns a new payment method in pending_enrollment with a single-use action. Card details go directly to the card vault and are never accepted by this API. With… */
export type KernelAddPaymentMethodVaultItemOperationRequestInput = {
	/** hosted returns a card_enrollment link for the cardholder. server returns a card_ingest URL for the card's issuer to post the card to server to server. */
	enrollment?: 'hosted' | 'server';
	type: 'add_payment_method';
};

/** AgentCard reusable live payment card. Test-mode card creation is not supported. Each checkout creates an authorization for spec.merchant / spec.amount that the cardholder approves, unless AgentCard runs it under one of the cardholder's autopilot rules. The card stays ready after each authorization. */
export type KernelAgentCardCardVaultItemSpecInput = {
	/** Integer amount in minor currency units. */
	amount: number;
	/** Opaque card ID returned by AgentCard for a card in the connected wallet. Pass it through unchanged without assuming a prefix or format. Omitted, the cardholder picks on the approval screen. */
	card_id?: string;
	/** Origin of the top-level checkout page, such as https://shop.example.com: https, a lowercase host, a port only when it is not 443, and no path. http is accepted only for localhost test pages. Checkouts without a preparation send it to AgentCard, which uses it to match the cardholder's autopilot… */
	checkout_origin?: string;
	currency: string;
	/** Discount as a positive number of minor currency units; 500 takes 5.00 off. Requires line_items. */
	discount?: number;
	/** What the next checkout buys, listed on the cardholder's approval screen above the total. Display only: the cardholder approves amount, or the amount the processor charges, and a line total that disagrees with it changes nothing they pay. Amounts are in minor units of currency. Sent only for… */
	line_items?: Array<KernelAgentCardLineItemInput>;
	/** Merchant name shown on the cardholder's approval screen. */
	merchant: string;
	provider: 'agentcard';
	/** Shipping charge in minor currency units. Requires line_items. */
	shipping?: number;
	/** Cart subtotal in minor currency units. Requires line_items. */
	subtotal?: number;
	/** Tax in minor currency units. Requires line_items. */
	tax?: number;
	/** Wallet item key used to authorize checkouts. */
	wallet: string;
};

/** One product on the AgentCard approval screen. */
export type KernelAgentCardLineItemInput = {
	/** The line's total in minor currency units. Shown instead of unit_amount times quantity when both are set; a line with neither shows without a price. */
	amount?: number;
	/** Shown beside the title. */
	brand?: string;
	/** https URL of the product's picture. AgentCard shows pictures only from the image hosts it allows and shows the line without one otherwise. */
	image_url?: string;
	/** The options the shopper chose, such as "Size S · Pink". */
	options?: string;
	quantity: number;
	/** The product's name as the store shows it. */
	title: string;
	/** Price of one, in minor currency units. The line shows unit_amount times quantity. */
	unit_amount?: number;
};

export type KernelAgentCardPreparedProcessorInput =
	| 'square'
	| 'braintree'
	| 'worldpay'
	| 'bambora'
	| 'mercado_pago'
	| 'adyen';

/** AgentCard wallet. Omit provider_config to use Kernel-managed credentials, or select a customer-owned configuration. Mode (sandbox vs live) is determined by the selected credential; there is no per-item test flag. Without user_id, creation returns a hosted enrollment action and Kernel polls until… */
export type KernelAgentCardWalletVaultItemSpecInput = {
	provider: 'agentcard';
	/** Select an AgentCard configuration. The wallet's configuration cannot be changed after creation. */
	provider_config?: KernelVaultProviderConfigReferenceInput;
	user_id?: string;
};

export type KernelApiKeyPolicyInput = {
	/** Allow statements. Every action and resource not listed is denied. */
	statements: Array<KernelApiKeyPolicyStatementInput>;
};

/** A condition narrows a policy statement to requests matching its constraint: the request attribute, a comparison operator, and that operator's values. */
export type KernelApiKeyPolicyConditionInput = {
	/** Request attribute the condition constrains. `source_ip` restricts the statement to requests whose client address falls inside one of `values`. */
	key: 'source_ip';
	/** Comparison the condition applies between the request attribute and values. */
	operator: 'in';
	/** Values the request attribute must match. For `source_ip`, CIDR networks: a bare address without a mask is rejected, and so are an entry with host bits set and an IPv4 network written in IPv6 notation. */
	values: Array<string>;
};

export type KernelApiKeyPolicyStatementInput = {
	/** Permitted action, such as browsers:use or vaults:read. */
	action: string;
	/** Optional condition narrowing the statement to matching requests. A statement without a condition matches any request on its action and resource. */
	condition?: KernelApiKeyPolicyConditionInput;
	/** Resource the action applies to, in the format projects/{project_id}/{kind}/{id}. Wildcards are supported. */
	resource: string;
};

/** Let a browser attached to the item's vault sign in with a stored passkey. Only invoke when the item advertises `arm_passkey`. Returns immediately; there is no time limit. While armed, when a page in that browser whose origin matches the passkey's relying party asks for a passkey… */
export type KernelArmPasskeyVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** Passkey field to arm. Required when more than one passkey field holds a passkey. */
	field?: string;
	type: 'arm_passkey';
};

/** Authorize a Link, Kernel or Shop Pay card using its existing purchase specification. Use only after explicit user approval and when the item advertises authorize; follow the advertised operation's description. For a Link or Shop Pay card, pass browser_id and page_url together while the browser… */
export type KernelAuthorizeVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. The browser must have this vault attached. */
	browser_id?: string;
	/** Exact current top-level URL of the final checkout page open in browser_id. */
	page_url?: string;
	type: 'authorize';
};

export type KernelBrowserAllowlistStateInput = {
	/** Revision against which that mutation was accepted; reuse it when retrying the mutation. */
	base_revision?: string;
	/** ID of the last conditional allowlist update saved on this browser. */
	mutation_id?: string;
	/** Opaque revision to pass as network.expected_allowlist_revision on an update. */
	revision: string;
};

/** Automatic CAPTCHA solving configuration. */
export type KernelBrowserCaptchaSolverInput = {
	/** Whether the browser automatically solves CAPTCHAs. */
	enabled: boolean;
};

/** A browser-control CDP method the proxy reports. The set covers the commands an agent drives the browser with; configuration, DOM and Runtime bookkeeping, and Chrome-specific UI commands are outside it. Canonical definitions: devtools-protocol@2d019e73. */
export type KernelBrowserCdpCommandMethodInput =
	| 'Input.dispatchMouseEvent'
	| 'Input.dispatchKeyEvent'
	| 'Input.insertText'
	| 'Input.imeSetComposition'
	| 'Input.dispatchTouchEvent'
	| 'Input.dispatchDragEvent'
	| 'Input.cancelDragging'
	| 'Input.emulateTouchFromMouseEvent'
	| 'Input.synthesizePinchGesture'
	| 'Input.synthesizeScrollGesture'
	| 'Input.synthesizeTapGesture'
	| 'DOM.setFileInputFiles'
	| 'DOM.focus'
	| 'DOM.scrollIntoViewIfNeeded'
	| 'Page.bringToFront'
	| 'Page.captureScreenshot'
	| 'Page.captureSnapshot'
	| 'Page.handleJavaScriptDialog'
	| 'Page.navigate'
	| 'Page.navigateToHistoryEntry'
	| 'Page.reload'
	| 'Page.printToPDF'
	| 'Page.startScreencast'
	| 'Page.stopScreencast'
	| 'Page.stopLoading'
	| 'Page.close'
	| 'Page.setWebLifecycleState'
	| 'Target.activateTarget'
	| 'Target.closeTarget'
	| 'Target.createTarget'
	| 'Target.createBrowserContext'
	| 'Target.disposeBrowserContext'
	| 'Target.openDevTools'
	| 'Browser.cancelDownload'
	| 'Browser.close'
	| 'Browser.setWindowBounds'
	| 'Browser.setContentsSize'
	| 'Autofill.trigger';

/** Extension selection for the browser session. Provide either id or name of an extension uploaded to Kernel. */
export type KernelBrowserExtensionInput = {
	/** Extension ID to load for this browser session */
	id?: string;
	/** Extension name to load for this browser session (instead of id). Must be 1-255 characters, using letters, numbers, dots, underscores, or hyphens. */
	name?: string;
};

/** Overrides for browser attributes presented to websites. */
export type KernelBrowserFingerprintInput = {
	/** Operating system the browser reports to websites. */
	os: 'linux' | 'macos';
};

/** `read` shows the browser without accepting input. `control` also lets the viewer drive the browser through the live view. */
export type KernelBrowserLiveViewScopeInput = 'read' | 'control';

export type KernelBrowserLocationRequestInput = {
	/** Session-only supported canonical BCP 47 locale override. Omit to use the default for the browser's region. */
	locale?: string;
	/** Session-only IANA timezone override. Omit to use the default for the browser's region. */
	timezone?: string;
};

/** Omit a field to leave it unchanged, set a string override, or set null to clear the override and use the default for the browser's region. */
export type KernelBrowserLocationUpdateRequestInput = {
	/** Session-only supported canonical BCP 47 locale override. Null clears the override and uses the browser region's default. */
	locale?: string | null;
	/** Session-only IANA timezone override. Null clears the override and uses the browser region's default. */
	timezone?: string | null;
};

/** Memory requested for a non-GPU browser. Headless browsers support 1GiB (default), 2GiB, or 4GiB; headful browsers support 8GiB (default) or 16GiB. */
export type KernelBrowserMemoryRequestInput =
	| '1GiB'
	| '2GiB'
	| '4GiB'
	| '8GiB'
	| '16GiB';

/** Network configuration for a browser session or browser pool. */
export type KernelBrowserNetworkConfigInput = {
	/** Egress allowlist for a browser session: the only destinations the browser may reach through Kernel-managed egress. Any other destination is refused with a 403 whose X-Kernel-Proxy-Error header is network_policy_denied, so pages cannot load or send data to unlisted hosts, including with fetch()… */
	allowed_hosts?: Array<string>;
	/** Concurrency metadata for a browser's saved allowlist configuration. Browser pools omit it. This remains present after removal so an uncertain removal can be retried. It does not prove proxy or VM application completed. Do not include it in creation or pool updates. */
	allowlist_state?: KernelBrowserAllowlistStateInput;
	/** Destinations the browser reaches directly through the session's own network instead of through Kernel-managed egress — for private hosts reachable over a VPN or tunnel the session has joined (e.g. a Tailscale tailnet). By default, private IP ranges already route directly: RFC1918 (10.0.0.0/8,… */
	private_hosts?: Array<string>;
	/** Per-destination proxy routes for a browser session. A destination hostname is matched against every route's hosts, regardless of port; route order does not matter. An exact hostname beats a wildcard, and a longer wildcard suffix beats a shorter one (for a.b.example.com: "a.b.example.com" >… */
	proxy_routes?: Array<KernelBrowserProxyRouteInput>;
};

/** Network configuration changes for a running browser session. Other network settings can only be set at creation. */
export type KernelBrowserNetworkUpdateInput = {
	/** Replaces the session's egress allowlist, using the same entry rules as network.allowed_hosts on create. Only an allowlist the browser was created with can be changed: a browser created without one can't be given one, and an allowlist removed with null can't be added back. Omit to leave the… */
	allowed_hosts?: Array<string> | null;
	/** The network.allowlist_state.revision from the browser's last saved snapshot. Supply together with mutation_id to opt into conditional allowlist updates. The revision is checked atomically with the configuration write. A stale request returns 409 stale_network without changing the allowlist. A… */
	expected_allowlist_revision?: string;
	/** A unique ID for this allowlist update, supplied together with expected_allowlist_revision. Reuse both values and the identical allowed_hosts payload when retrying an uncertain update. If it is still the current mutation, the retry finishes proxy and VM application without creating another… */
	mutation_id?: string;
};

/** Profile configuration for browsers in a pool. Provide either id or name. Profiles must be created beforehand. Unlike single browser sessions, pools load the profile read-only and never persist changes back to it, so save_changes is omitted here. Any save_changes value sent on a pool profile is… */
export type KernelBrowserPoolProfileInput = {
	/** Profile ID to load for browsers in this pool */
	id?: string;
	/** Profile name to load for browsers in this pool (instead of id). Must be 1-255 characters, using letters, numbers, dots, underscores, or hyphens. */
	name?: string;
};

/** Profile selection for the browser session. Provide either id or name. If specified, the matching profile will be loaded into the browser session. Profiles must be created beforehand. */
export type KernelBrowserProfileInput = {
	/** Profile ID to load for this browser session */
	id?: string;
	/** Profile name to load for this browser session (instead of id). Must be 1-255 characters, using letters, numbers, dots, underscores, or hyphens. */
	name?: string;
	/** If true, save changes made during the session back to the profile when the session ends. */
	save_changes?: boolean;
};

/** Browser proxy configuration. Provide exactly one of mode, id, or name; an empty object is invalid. Set mode to direct for no proxy. Set mode to default to use Kernel's default stealth proxy for browsers with CAPTCHA solving enabled, including stealth browsers, or direct egress otherwise. Select… */
export type KernelBrowserProxyConfigInput = {
	/** Proxy ID. */
	id?: string;
	mode?: KernelBrowserProxyModeInput;
	/** Proxy name. Must match exactly one active proxy in the project. */
	name?: string;
};

/** Proxy egress mode. direct forces no proxy. default uses Kernel's default stealth proxy for browsers with CAPTCHA solving enabled, including stealth browsers, or direct egress otherwise. default is primarily useful on browser update to restore the browser default after selected-proxy egress. */
export type KernelBrowserProxyModeInput = 'direct' | 'default';

export type KernelBrowserProxyRouteInput = {
	/** Exact hostnames or leading *. wildcard patterns (subdomains only); patterns cannot include ports, and matching ignores the destination port. Hosts not matched by any route use the session's top-level proxy (or the browser default when proxy is omitted). */
	hosts: Array<string>;
	proxy: KernelBrowserProxyRouteTargetInput;
};

/** Select an active non-direct proxy by ID or name. Responses always use ID. */
export type KernelBrowserProxyRouteTargetInput = {
	id?: string;
	name?: string;
};

/** Per-category telemetry capture settings layered onto the default set. The operational signals (control, connection, system, captcha) are on by default and are opt-out: set one to enabled=false to stop capturing it. The CDP categories (console, network, page, interaction), screenshot and platform… */
export type KernelBrowserTelemetryCategoriesConfigInput = {
	/** Captcha solver tasks and visible challenge outcomes. On by default. */
	captcha?: KernelBrowserTelemetryCategoryConfigInput;
	/** Client attach/detach lifecycle for the CDP proxy and live view. On by default. */
	connection?: KernelBrowserTelemetryCategoryConfigInput;
	/** Console output (log, warn, error) and uncaught exceptions. CDP category; off by default. */
	console?: KernelBrowserTelemetryCategoryConfigInput;
	/** Agent-driven actions against the browser — computer-control calls, Playwright code execution, screenshots, clipboard access, and browser-control commands sent over the CDP proxy. On by default. */
	control?: KernelBrowserTelemetryControlConfigInput;
	/** User interaction events including clicks, keydowns, and scroll-settled events. CDP category; off by default. */
	interaction?: KernelBrowserTelemetryCategoryConfigInput;
	/** HTTP request and response metadata including URL, method, status code, and timing. Request post data is forwarded as-is from CDP. Text response bodies are truncated at 8 KB for structured types (JSON, XML, form data) and 4 KB for other text types. Binary responses (images, fonts, media) are… */
	network?: KernelBrowserTelemetryCategoryConfigInput;
	/** Page lifecycle events including navigation, DOMContentLoaded, load, layout shifts, and LCP. CDP category; off by default. */
	page?: KernelBrowserTelemetryCategoryConfigInput;
	/** In-VM API calls that manage the browser VM rather than drive the browser (recording, filesystem, process, telemetry and browser configuration). Mostly platform-induced; off by default and must be opted into. */
	platform?: KernelBrowserTelemetryCategoryConfigInput;
	/** Periodic base64-encoded viewport screenshots. High volume; off by default and must be opted into. */
	screenshot?: KernelBrowserTelemetryCategoryConfigInput;
	/** Browser VM health, such as out-of-memory kills and managed-service crashes. On by default. */
	system?: KernelBrowserTelemetryCategoryConfigInput;
};

/** Per-category telemetry configuration. */
export type KernelBrowserTelemetryCategoryConfigInput = {
	/** Whether this category is captured. Operational categories (control, connection, system, captcha) default to true; set false to opt out. CDP categories (console, network, page, interaction), screenshot and platform default to false; set true to opt in. */
	enabled?: boolean;
};

/** Settings for the cdp_command events the CDP proxy reports. */
export type KernelBrowserTelemetryCdpControlConfigInput = {
	/** Methods to leave out of the cdp_command stream. Omit the list to keep the current one; send an empty list to report every supported method again. Exclusion is a telemetry setting only: an excluded command is still relayed to the browser unchanged, it simply produces no event. Use it to drop the… */
	excluded_methods?: Array<KernelBrowserCdpCommandMethodInput>;
};

/** Configuration for the control category. Same enabled semantics as any other category, plus settings for the browser-control commands the CDP proxy reports. */
export type KernelBrowserTelemetryControlConfigInput = {
	/** Settings for the cdp_command events the CDP proxy reports. Merged independently of enabled, so a later update that only sets enabled keeps the current exclusion list. */
	cdp?: KernelBrowserTelemetryCdpControlConfigInput;
	/** Whether this category is captured. Control is on by default; set false to opt out. */
	enabled?: boolean;
};

/** Export destinations for a session's captured telemetry, by protocol. Honored when creating a browser, including the browser a managed auth connection creates for a login. Browser pools do not support export and reject it; on a browser update it is ignored, so the session keeps the destination it… */
export type KernelBrowserTelemetryExportRequestConfigInput = {
	/** Export captured telemetry over OTLP to one of the org's configured destinations. */
	otlp?: KernelBrowserTelemetryOTLPExportRequestConfigInput;
};

/** OTLP export settings for a browser session. */
export type KernelBrowserTelemetryOTLPExportRequestConfigInput = {
	/** OTLP destination to export this session's captured telemetry to. Provide either id or name. Requires telemetry capture to be enabled. */
	destination?: KernelOTLPDestinationRefInput;
	/** Whether to export captured telemetry over OTLP. Setting destination implies enabled=true, so this only needs to be set explicitly to disable export (enabled=false with a destination is rejected). */
	enabled?: boolean;
};

/** Telemetry request configuration for a browser session. */
export type KernelBrowserTelemetryRequestConfigInput = {
	/** Per-category capture flags. The operational categories (control, connection, system, captcha) are captured whenever telemetry is enabled; set one to enabled=false to opt out. The CDP categories (console, network, page, interaction), screenshot and platform are off by default; set enabled=true to… */
	browser?: KernelBrowserTelemetryCategoriesConfigInput;
	/** Request shortcut for browser telemetry capture. True enables capture; with no browser category settings it captures the default set (control, connection, system, captcha), and any browser category settings are layered onto that default set. On update, enabled=true resolves the config fresh from… */
	enabled?: boolean;
	/** Where to export this session's captured telemetry. Omit to capture without exporting. */
	export?: KernelBrowserTelemetryExportRequestConfigInput;
	/** Whether to persist this session's captured telemetry to Kernel storage. */
	storage?: KernelBrowserTelemetryStorageRequestConfigInput;
};

/** Kernel storage settings for a session's captured telemetry. */
export type KernelBrowserTelemetryStorageRequestConfigInput = {
	/** Whether captured telemetry is persisted to Kernel storage. Defaults to true. Setting false requires an OTLP destination and cannot be changed after the browser is created. */
	enabled?: boolean;
};

/** Video memory (VRAM) of a GPU browser session. 3GiB sessions have 4 vCPU and 6GiB memory. 6GiB sessions have 8 vCPU and 12GiB memory. 2GiB and 4GiB are deprecated aliases for 3GiB and 6GiB: they are accepted on create and never returned. */
export type KernelBrowserVideoMemoryInput = '3GiB' | '6GiB' | '2GiB' | '4GiB';

/** Initial browser window size in pixels with optional refresh rate. If omitted, image defaults apply (1920x1080@25). For GPU images, the default is 1920x1080@60. Arbitrary viewport dimensions and refresh rates are accepted. Known-good presets include: 2560x1440@10, 1920x1080@25, 1920x1200@25,… */
export type KernelBrowserViewportInput = {
	/** Browser window height in pixels. Any positive integer is accepted; headful browsers require at least 64. */
	height: number;
	/** Display refresh rate in Hz. Any positive integer is accepted; if omitted, GPU browsers default to 60 and other browsers derive it from width and height. */
	refresh_rate?: number;
	/** Browser window width in pixels. Any positive integer is accepted; headful browsers require at least 64. */
	width: number;
};

/** Viewport configuration for updating a browser session. Extends BrowserViewport with update-only options. */
export type KernelBrowserViewportUpdateInput = KernelBrowserViewportInput & {
	/** If true, allow the viewport change even when a live view or recording/replay is active. Active recordings will be gracefully stopped and restarted at the new resolution as separate segments. If false (default), the resize is refused when a live view or recording is active. */
	force?: boolean;
};

/** Card items are supported for Link and Kernel purchases and are required for AgentCard reusable cards. Where enabled, Link and Kernel purchases can also be created as payment_request items. */
export type KernelCardVaultItemRequestInput = {
	spec: KernelCardVaultItemSpecInput;
	type: 'card';
};

export type KernelCardVaultItemSpecInput =
	| KernelLinkCardVaultItemSpecInput
	| KernelAgentCardCardVaultItemSpecInput
	| KernelKernelCardVaultItemSpecInput
	| KernelShopPayCardVaultItemSpecInput
	| KernelVgsCardVaultItemSpecInput;

export type KernelCardVaultItemUpdateRequestInput = {
	spec: KernelCardVaultItemSpecInput;
	type?: 'card';
};

export type KernelClickMouseRequestInput = {
	/** Mouse button to interact with */
	button?: 'left' | 'right' | 'middle' | 'back' | 'forward';
	/** Type of click action */
	click_type?: 'down' | 'up' | 'click';
	/** Modifier keys to hold during the click */
	hold_keys?: Array<string>;
	/** Number of times to repeat the click */
	num_clicks?: number;
	/** Y coordinate of the click position */
	y: number;
	/** X coordinate of the click position */
	x: number;
};

/** Return the credential item with its collection action. Supported for ready and pending_collection credential items. Always render the same form from every form-supported field; totp and passkey fields have no form input and are omitted. No caller-selected field subsets or form overrides are… */
export type KernelCollectVaultItemOperationRequestInput = {
	type: 'collect';
};

/** A single computer action to execute as part of a batch. The `type` field selects which action to perform, and the corresponding field contains the action parameters. Exactly one action field matching the type must be provided. */
export type KernelComputerActionInput = {
	click_mouse?: KernelClickMouseRequestInput;
	drag_mouse?: KernelDragMouseRequestInput;
	move_mouse?: KernelMoveMouseRequestInput;
	press_key?: KernelPressKeyRequestInput;
	scroll?: KernelScrollRequestInput;
	set_cursor?: KernelSetCursorRequestInput;
	sleep?: KernelSleepActionInput;
	/** The type of action to perform. */
	type:
		| 'click_mouse'
		| 'move_mouse'
		| 'type_text'
		| 'press_key'
		| 'scroll'
		| 'drag_mouse'
		| 'set_cursor'
		| 'sleep';
	type_text?: KernelTypeTextRequestInput;
};

/** Report a real merchant transaction outcome for an issued Kernel Visa or Shop Pay credential. Shop Pay accepts PURCHASE, AUTHORIZATION and CAPTURE. Never infer success from filling checkout or receiving a credential. Supply the observed status, transaction type, actual amount, currency and… */
export type KernelConfirmTransactionVaultItemOperationRequestInput = {
	/** Actual transaction amount in minor units, no greater than the approved limit. */
	amount: number;
	/** Must match the approved purchase currency. */
	currency: string;
	/** Why the purchase did not succeed, for any other outcome, such as 3ds_challenge, captcha, login_required, timeout or site_error. payment_declined goes only with DECLINED, which takes no other code. Shop Pay reports it; other providers ignore it. */
	failure_code?: string;
	/** Time the merchant outcome was observed. */
	occurred_at: string;
	/** The merchant's order number, for an APPROVED outcome. Shop Pay reports it; other providers ignore it. */
	order_id?: string;
	/** The merchant's https order page, for an APPROVED outcome. Shop Pay reports it; other providers ignore it. */
	order_url?: string;
	status: 'APPROVED' | 'DECLINED' | 'PENDING' | 'ERROR' | 'CANCELLED';
	transaction_type:
		| 'PURCHASE'
		| 'AUTHORIZATION'
		| 'CAPTURE'
		| 'REFUND'
		| 'REVERSAL'
		| 'VERIFICATION'
		| 'CHARGEBACK'
		| 'FRAUD';
	type: 'confirm_transaction';
};

/** Configuration for a custom proxy (e.g., private proxy server). */
export type KernelCreateCustomProxyConfigInput = {
	/** PEM-encoded CA certificate bundle the proxy re-signs upstream TLS with. Provide when the proxy terminates TLS (MITM) so the browser trusts its certificates. May contain multiple concatenated certificates. */
	ca_bundle?: string;
	/** Proxy host address or IP. */
	host: string;
	/** Password for proxy authentication. */
	password?: string;
	/** Proxy port. */
	port: number;
	/** Username for proxy authentication. */
	username?: string;
};

export type KernelCredentialAccountVaultItemRequestInput = {
	spec: KernelOnePasswordCredentialAccountSpecInput;
	type: 'credential_account';
};

/** Reference to credentials for the auth connection. Use one of: - { name } for Kernel credentials - { provider, path } for external provider item - { provider, auto: true } for external provider domain lookup */
export type KernelCredentialReferenceInput = {
	/** If true, lookup by domain from the specified provider */
	auto?: boolean;
	/** Kernel credential name */
	name?: string;
	/** Provider-specific path (e.g., "VaultName/ItemName" for 1Password) */
	path?: string;
	/** External provider name (e.g., "my-1p") */
	provider?: string;
};

/** Alternative to value for custom credential collection web apps. Use this only if you run your own credential collection web app and want values encrypted in the browser, sent to your backend still encrypted, and forwarded to Kernel's API still encrypted. In every other case, including… */
export type KernelCredentialVaultEncryptedValueInput = string;

/** A field definition without a value. Field updates add fields with this shape and set their values in `fields`. */
export type KernelCredentialVaultFieldDefinitionInputInput = {
	/** Optional human-readable display label. It is returned as non-secret metadata and never affects value keys, updates, or browser fills. Use single-line, trimmed display text without control or formatting characters. The server enforces a 128-byte UTF-8 limit. */
	label?: string;
	/** Unique stable field name used to key values, updates, and browser fills. */
	name: string;
	required?: boolean;
	/** Set false explicitly for ordinary usernames, email addresses, and other non-secret identifiers. Reserve true for secrets such as passwords, API tokens, and TOTP seeds. Password, totp, and passkey fields must be true. Omission defaults to true for safety; do not rely on that default for every… */
	sensitive?: boolean;
	type: KernelCredentialVaultFieldTypeInput;
};

export type KernelCredentialVaultFieldInputInput = {
	encrypted_value?: KernelCredentialVaultEncryptedValueInput;
	/** Optional human-readable display label. It is returned as non-secret metadata and never affects value keys, updates, or browser fills. Use single-line, trimmed display text without control or formatting characters. The server enforces a 128-byte UTF-8 limit. */
	label?: string;
	/** Unique stable field name used to key values, updates, and browser fills. */
	name: string;
	required?: boolean;
	/** Set false explicitly for ordinary usernames, email addresses, and other non-secret identifiers. Reserve true for secrets such as passwords, API tokens, and TOTP seeds. Password, totp, and passkey fields must be true. Omission defaults to true for safety; do not rely on that default for every… */
	sensitive?: boolean;
	type: KernelCredentialVaultFieldTypeInput;
	/** Optional initial value satisfying the declared type, at most 16 KiB in UTF-8 bytes. Omit to leave unset; null and empty strings are rejected on creation. Sensitive values are encrypted and never copied into the returned spec. Use this unless your own credential collection web app encrypts values… */
	value?: string;
};

/** Text, email, and password have form inputs; totp and passkey do not and are omitted from both Kernel-hosted and customer React forms. Password, totp, and passkey must be sensitive. A totp value is an RFC 4648 Base32 generator seed (case-insensitive, optional trailing padding), not an otpauth URI… */
export type KernelCredentialVaultFieldTypeInput =
	| 'text'
	| 'email'
	| 'password'
	| 'totp'
	| 'passkey';

/** Set exactly one of value or encrypted_value. Use value unless the update comes from your own credential collection web app that encrypts values in the browser; see encrypted_value. */
export type KernelCredentialVaultFieldUpdateInput = {
	encrypted_value?: KernelCredentialVaultEncryptedValueInput;
	/** Replacement value (at most 16 KiB in UTF-8 bytes), or null or an empty string to immediately clear the stored value. Clearing a required form-supported field reopens collection; clearing an optional field does not prevent readiness. Values must satisfy the declared field type. For totp, value is… */
	value?: string | null;
};

/** Ask the end-user whether to link their site credential through 1Password. If they choose 1Password, connect their account and request access to a login in their own non-shared vault; passkeys are not supported. If they decline or that path fails, collect a Kernel-hosted credential item instead.… */
export type KernelCredentialVaultItemRequestInput = {
	spec: KernelCredentialVaultItemSpecInputInput;
	type: 'credential';
};

export type KernelCredentialVaultItemSpecInputInput =
	| KernelKernelCredentialVaultItemSpecInputInput
	| KernelOnePasswordCredentialVaultItemSpecInputInput
	| KernelManagedAuthCredentialVaultItemSpecInputInput;

export type KernelCredentialVaultItemSpecUpdateInput = {
	/** Field definitions to append, with the same defaults as creation. Set their values in `fields` in the same update. Names must be unique after removals; at most 32 fields may result. A required totp or passkey field needs a value in `fields`. */
	add_fields?: Array<KernelCredentialVaultFieldDefinitionInputInput>;
	/** Recognizable site or service name used as the form title, without suffixes such as sign-in credentials. An empty string clears it. Display text only, not an enforced destination policy. The server also enforces a 16 KiB UTF-8 byte limit. */
	description?: string;
	fields?: Record<string, KernelCredentialVaultFieldUpdateInput>;
	/** Names of fields to delete with their values. Unknown names return 400. At least one field must remain. */
	remove_fields?: Array<string>;
};

/** Atomically update description, field definitions, and selected values. Omitted properties are preserved. `remove_fields` deletes definitions and their values, then `add_fields` appends definitions, then `fields` sets values, including for added fields. An existing field's definition cannot be… */
export type KernelCredentialVaultItemUpdateRequestInput = {
	/** Optional immutable item ID precondition. Returns 409 if the key now identifies a different item. Accepted writes target this immutable ID, preventing replacement-key races. Supply this when submitting a form bound to a previously read item. */
	expected_item_id?: string;
	spec: KernelCredentialVaultItemSpecUpdateInput;
	type: 'credential';
	/** Expected current item version from the latest read. */
	version: number;
};

export type KernelCustomerManagedOAuthClientInput = {
	provider_config: KernelVaultProviderConfigReferenceInput;
	type: 'customer_managed';
};

/** Configuration for a deprecated datacenter proxy. Use an ISP proxy instead. */
export type KernelDatacenterProxyConfigInput = {
	/** ISO 3166 country code. Defaults to US if not provided. */
	country?: string;
};

/** Source from which to fetch application code. */
export type KernelDeploymentSourceInput = {
	/** Authentication for private repositories. */
	auth?: {
		/** Auth method */
		method: 'github_token';
		/** GitHub PAT or installation access token */
		token: string;
	};
	/** Relative path to the application entrypoint within the selected path. */
	entrypoint: string;
	/** Path within the repo to deploy (omit to use repo root). */
	path?: string;
	/** Git ref (branch, tag, or commit SHA) to fetch. */
	ref: string;
	/** Source type identifier. */
	type: 'github';
	/** Base repository URL (without blob/tree suffixes). */
	url: string;
};

/** Stop a browser from using this item's passkeys: removes its armed passkeys and its pending registration into this item. Pages that already loaded keep Kernel's WebAuthn handler but get the browser's own behavior. */
export type KernelDisarmPasskeyVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** Limit disarming to one passkey field. Omit to disarm every passkey field of the item. */
	field?: string;
	type: 'disarm_passkey';
};

export type KernelDragMouseRequestInput = {
	/** Mouse button to drag with */
	button?: 'left' | 'middle' | 'right';
	/** Delay in milliseconds between button down and starting to move along the path. */
	delay?: number;
	/** Target total duration in milliseconds for the entire drag movement when smooth=true. Omit for automatic timing based on total path length. */
	duration_ms?: number;
	/** Modifier keys to hold during the drag */
	hold_keys?: Array<string>;
	/** Ordered list of [x, y] coordinate pairs to move through while dragging. Must contain at least 2 points. */
	path: Array<Array<number>>;
	/** Use human-like Bezier curves between path waypoints instead of linear interpolation. When true, steps_per_segment and step_delay_ms are ignored. */
	smooth?: boolean;
	/** Delay in milliseconds between relative steps while dragging (not the initial delay). */
	step_delay_ms?: number;
	/** Number of relative move steps per segment in the path. Minimum 1. */
	steps_per_segment?: number;
};

/** Use a vault item in a browser session, for example to fill a login or payment form. Only invoke when the item advertises `fill`; the advertised operation describes the inputs that item needs. Requires `browser_id` and usually `page_url`; some items also require `fields`. Browser and vault must… */
export type KernelFillVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** Field bindings, when the item's advertised fill operation requires them. Each selector is searched in the main frame and all descendant frames and must resolve to exactly one editable input or select, matched directly or through a containing element; zero or multiple candidates fail, and no two… */
	fields?: Array<KernelVaultFillFieldInput>;
	/** Exact current top-level page URL, including path, query, and fragment. Must match exactly one open page in the browser; zero or multiple matches fail. No prefix or glob matching. When an item allows omitting it, the browser must have exactly one open page. */
	page_url?: string;
	/** Ignored. Fill sets no operation deadline; typing pace adapts to the length of the values instead. Accepted for compatibility. */
	timeout_ms?: number;
	type: 'fill';
};

/** The customer's backend completes Link OAuth and supplies the resulting tokens. For a new wallet, Kernel verifies the access token can access Link payment methods without consuming or rotating the refresh token. Valid access creates a wallet with state.status=connected. An expired, invalid,… */
export type KernelImportedLinkAuthorizationInputInput = {
	client: KernelCustomerManagedOAuthClientInput;
	method: 'oauth';
	token_refresh?: KernelLinkTokenRefreshInput;
	tokens: KernelLinkWalletTokenInputInput;
};

/** Configuration for an ISP proxy. */
export type KernelIspProxyConfigInput = {
	/** ISO 3166 country code. Supported countries are US, GB, FR, DE, SG, and KR. Defaults to US if not provided, or to the country of ip_address when that is set. */
	country?: string;
	/** Reserved exit IP to pin the proxy to. Available only to organizations with a reserved ISP allocation; the IP must be active in it (see GET /proxy_ips) and, when country is also set, in that country. Omit to let Kernel choose an IP. A proxy read includes it only when the proxy's primary exit IP… */
	ip_address?: string;
};

/** Changes to an ISP proxy's exit IP. Accepted only for proxies of type `isp`. */
export type KernelIspProxyUpdateConfigInput = {
	/** Reserved exit IP to move the proxy to. The IP must be active in the organization's allocation and in the proxy's country. The proxy keeps its ID. The new endpoint is probed before anything changes; a failed probe leaves the proxy as it was. Live browsers open new connections on the new IP within… */
	ip_address: string;
};

/** One live purchase with a Kernel-enrolled card. Authorization obtains an agentic network token number, expiry and one-time 3-digit code. They are stored encrypted for the fill operation, which types them only on merchant_url's origin; the merchant's own checkout submits the payment. The one-time… */
export type KernelKernelCardVaultItemSpecInput = {
	/** Integer amount in minor currency units (at most 1000000), bound to the one-time code. */
	amount: number;
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency: string;
	/** Single-use cards only. From this time the card is expired and can no longer be filled; Kernel deletes its stored details shortly after. Deleting the card, its wallet or its vault deletes them immediately. Defaults to 2 hours after creation, capped at the end of the card's expiry month; a… */
	expires_at?: string;
	/** Actual merchant category when known. Omit rather than invent a category. */
	merchant_category?: string;
	/** Actual merchant MCC when known. Omit rather than invent a code. 0000 is not accepted. */
	merchant_category_code?: string;
	/** The merchant's ISO 3166-1 alpha-2 country code. Required for Visa cards, whose one-time code is issued for the merchant's country. */
	merchant_country?: string;
	merchant_name: string;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url: string;
	/** Wallet-scoped payment method ID from the wallet's payment_methods expansion. Omission selects the wallet's default card, ID card, for compatibility with existing requests; it never falls back to another method, and a wallet without a default card requires the ID. The purchase is bound to the… */
	payment_method_id?: string;
	provider: 'kernel';
	single_use_card?: KernelKernelSingleUseCardInput;
	/** Key of the Kernel wallet item whose enrolled card pays. */
	wallet: string;
};

/** Credential fields are for login and other non-payment credentials. Do not store, collect, or fill credit card data in credential items. Use wallet, payment_request and card item types for credit cards and payment checkout instead. Field order is preserved in the user-facing collection form, so… */
export type KernelKernelCredentialVaultItemSpecInputInput = {
	/** The site's recognizable display name, used verbatim as the user-facing form title (for example, Hacker News). Use only the site or service name; do not append sign-in, login, credentials, or task instructions. This is display text, not an enforced destination policy. At most 16 KiB in UTF-8 bytes. */
	description?: string;
	/** Ordered field definitions. Use the website's top-to-bottom field order; the collection form renders this order unchanged. */
	fields: Array<KernelCredentialVaultFieldInputInput>;
	provider: 'kernel';
};

/** Kernel starts and completes the user's Link authorization flow. */
export type KernelKernelManagedLinkAuthorizationInputInput = {
	client: KernelKernelManagedOAuthClientInput;
	method: 'oauth';
};

export type KernelKernelManagedOAuthClientInput = {
	type: 'kernel_managed';
};

/** One live purchase funded by the Kernel wallet payment method named by payment_method_id. The method must be active and eligible when the request is created. The purchase is bound to that method; later operations cannot switch funding, and removing the method makes the purchase unusable rather… */
export type KernelKernelPaymentRequestVaultItemSpecInput = {
	/** Integer amount in minor currency units (at most 1000000), bound to the one-time code. */
	amount: number;
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency: string;
	/** Actual merchant category when known. Omit rather than invent a category. */
	merchant_category?: string;
	/** Actual merchant MCC when known. Omit rather than invent a code. 0000 is not accepted. */
	merchant_category_code?: string;
	/** The merchant's ISO 3166-1 alpha-2 country code. Required for Visa cards, whose one-time code is issued for the merchant's country. */
	merchant_country?: string;
	merchant_name: string;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url: string;
	/** Payment method ID from the wallet's payment_methods expansion. */
	payment_method_id: string;
	provider: 'kernel';
	/** Key of the Kernel wallet item that owns the payment method. */
	wallet: string;
};

/** Details of a card the caller supplies, such as a single-use virtual card from its issuer. Mutually exclusive with payment_method_id. The card details are stored encrypted for fill and never returned; reads return only reference. Kernel deletes them shortly after the card's expires_at; deleting… */
export type KernelKernelSingleUseCardInput = {
	billing_address?: KernelSingleUseCardBillingAddressInput;
	cvc: string;
	exp_month: string;
	exp_year: string;
	/** Cardholder name, filled as billing_name. */
	name?: string;
	/** Card number; must pass the Luhn check. */
	number: string;
	/** The caller's identifier for the card, such as the issuer's card ID. Returned unchanged on reads. */
	reference?: string;
};

/** Cards stored with Kernel-managed credentials, each a payment method of the wallet. Each card is enrolled through a card_enrollment action: the cardholder enters the card and their email on a Kernel-hosted page. Where the wallet advertises add_payment_method, creation returns an empty connected… */
export type KernelKernelWalletVaultItemSpecInput = {
	provider: 'kernel';
};

/** Live Link card request. Test-mode card creation is not supported. The spec can be changed with PATCH until the card is authorized at a checkout. Authorize it with the browser at final checkout: Kernel inspects the checkout through WebMCP and internally chooses a merchant-bound Link Pay Token… */
export type KernelLinkCardVaultItemSpecInput = {
	/** Integer amount in minor currency units, at most 50000. With recurring, the spending limit per period, not a lifetime total. */
	amount: number;
	context: string;
	currency: string;
	line_items?: Array<KernelLinkLineItemInput>;
	merchant_name: string;
	merchant_url: string;
	metadata?: Record<string, string>;
	/** Payment-method ID returned by the referenced wallet's payment-method listing. The provider decides whether the selected funding method can satisfy the card request. */
	payment_method_id: string;
	provider: 'link';
	recurring?: KernelLinkRecurringInput;
	totals?: Array<KernelLinkTotalInput>;
	/** Connected Link wallet item key. */
	wallet: string;
};

export type KernelLinkLineItemInput = {
	description?: string;
	image_url?: string;
	name: string;
	product_url?: string;
	quantity?: number;
	sku?: string;
	totals?: Array<KernelLinkTotalInput>;
	/** Unit amount in minor currency units. */
	unit_amount?: number;
	url?: string;
};

/** Recurring terms for a subscription or other repeated purchase. The amount becomes the spending limit for each period of interval_count intervals, for example every 2 weeks. The merchant schedules charges. The card stays ready after each charge until it expires or is deleted; do not create a new… */
export type KernelLinkRecurringInput = {
	interval: 'day' | 'week' | 'month' | 'year';
	/** Number of intervals per period. Link defaults it to 1. */
	interval_count?: number;
};

/** Who refreshes an imported Link grant. kernel (default) means Kernel holds and rotates the refresh token. customer means your backend keeps the refresh token and replaces the access token with update_access_token; Kernel never refreshes or revokes the grant. Fixed at wallet creation. */
export type KernelLinkTokenRefreshInput = 'kernel' | 'customer';

export type KernelLinkTotalInput = {
	/** Total amount in minor currency units. */
	amount: number;
	display_text: string;
	type: string;
};

/** Send the tokens from your backend. Supply a currently valid access token. With token_refresh=kernel, also send the refresh token from the same Link grant under the referenced client; Kernel refreshes when needed after import and uses the expiry returned by Link for subsequent tokens. With… */
export type KernelLinkWalletTokenInputInput = {
	access_token: string;
	/** Required with token_refresh=kernel; rejected with token_refresh=customer. */
	refresh_token?: string;
};

export type KernelLinkWalletVaultItemRequestSpecInput = {
	authorization:
		| KernelKernelManagedLinkAuthorizationInputInput
		| KernelImportedLinkAuthorizationInputInput;
	provider: 'link';
};

/** Browser configuration applied to browser sessions created for a managed auth connection. Managed auth controls the profile, headless mode, timeout, start URL, kiosk mode, and viewport. */
export type KernelManagedAuthBrowserConfigInput = {
	/** Automatic CAPTCHA solving for managed auth browser sessions. When provided without stealth, stealth no longer defaults to true. Enabling it does not select a proxy: a connection on direct egress stays there; set proxy.mode=default for Kernel's default stealth proxy. Turning it off on a… */
	captcha_solver?: KernelBrowserCaptchaSolverInput;
	/** Browser locale for the connection's login, reauthentication, and health-check sessions. Set on create or update; not supported on login. */
	location?: KernelManagedAuthBrowserLocationInput;
	/** Proxy configuration for managed auth browser sessions. Omit on create to derive the default from stealth, or on update and login to preserve or inherit the connection default. */
	proxy?: KernelBrowserProxyConfigInput;
	/** Browser region. Omit on create to use us-east, on update to keep the current region, or on login to inherit it. Login overrides apply only to that login. Non-default regions require an eligible plan and organization access. */
	region?: KernelRegionInput;
	/** Whether managed auth browser sessions use stealth mode: CAPTCHA solving with Kernel's default stealth proxy unless proxy is set. Defaults to true when neither stealth nor captcha_solver is provided. Cannot be combined with captcha_solver.enabled=false. Setting it does not change an existing… */
	stealth?: boolean;
	/** Browser telemetry configuration using the same semantics as browser create. */
	telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
};

/** Browser locale applied to browser sessions created for a managed auth connection. */
export type KernelManagedAuthBrowserLocationInput = {
	/** Supported canonical BCP 47 locale for the browser's language and Accept-Language header. Omit to use the default for the browser's region, or omit on update to keep the current locale. Null clears it on update. */
	locale?: string | null;
};

/** A credential backed by a managed auth connection. The item stores no values: it reads the connection's saved credential at fill time, so updates made through managed auth apply immediately. The connection must be in the vault's project and hold a saved Kernel credential. The check is the saved… */
export type KernelManagedAuthCredentialVaultItemSpecInputInput = {
	/** ID of the managed auth connection whose saved credential this item reads. List connections with `GET /auth/connections`. */
	connection_id: string;
	/** Optional display text for the item, such as the site or service name. Set at creation and cannot be changed later; repeating the request with a different description returns 409. At most 16 KiB in UTF-8 bytes. */
	description?: string;
	provider: 'managed_auth';
};

/** Configuration for mobile proxies. */
export type KernelMobileProxyConfigInput = {
	/** Provider city alias. Mobile carrier routing can make observed geo vary. */
	city?: string;
	/** ISO 3166 country code. If omitted, the proxy uses the global pool without country targeting. */
	country?: string;
	/** US-only state code. Mobile carrier routing can make observed geo vary. */
	state?: string;
};

export type KernelMoveMouseRequestInput = {
	/** Target total duration in milliseconds for the mouse movement when smooth=true. Omit for automatic timing based on distance. */
	duration_ms?: number;
	/** Modifier keys to hold during the move */
	hold_keys?: Array<string>;
	/** Use human-like Bezier curve path instead of instant mouse movement. */
	smooth?: boolean;
	/** Y coordinate to move the cursor to */
	y: number;
	/** X coordinate to move the cursor to */
	x: number;
};

/** OTLP destination selection. Provide either id or name. The destination must be customer-visible in the authenticated organization. A project-scoped credential can select any such destination for workloads in its project. */
export type KernelOTLPDestinationRefInput = {
	/** OTLP destination ID */
	id?: string;
	/** OTLP destination name */
	name?: string;
};

export type KernelOnePasswordCredentialAccountSpecInput = {
	authorization: KernelOnePasswordOAuthAuthorizationInput;
	provider: '1password';
};

export type KernelOnePasswordCredentialRequestEntryInput = {
	/** 1Password's ID for this entry in an access request you created. Supply it only with resolved. */
	id?: string;
	keywords?: Array<string>;
	parameters: {
		website: string;
	};
	reason?: string;
	/** Must be login. */
	type: string;
};

/** Credential Request v2 input sent to the extension. A credential item may request up to five login entries. */
export type KernelOnePasswordCredentialRequestsInput = {
	entries: Array<KernelOnePasswordCredentialRequestEntryInput>;
	goal?: string;
	/** Must be 2. */
	version: number;
};

/** A login request backed by a connected 1Password account or by a customer-supplied access token and matching integration key. Supply either account or both secrets, never both. Supplied secrets are write-only and never returned. Supply requests for new items; website remains supported for… */
export type KernelOnePasswordCredentialVaultItemSpecInputInput = {
	/** ID of an approved access request you created with this access_token and integration_key. Requires resolved. */
	access_request_id?: string;
	/** Customer-supplied 1Password broker token. Requires integration_key; stored encrypted on this item. Omit if providing a connected credential_account item via the account field. */
	access_token?: string;
	/** Optional supplied token expiry metadata for stored-token credentials. Omit if providing a connected credential_account item via the account field. */
	access_token_expires_at?: string;
	/** Key of a connected credential_account item in the same vault. Omit for stored-token credentials. */
	account?: string;
	/** Matching customer-supplied integration key. Requires access_token; stored encrypted on this item. Omit if providing a connected credential_account item via the account field. */
	integration_key?: string;
	provider: '1password';
	requests?: KernelOnePasswordCredentialRequestsInput;
	/** Granted logins from 1Password's status for access_request_id, as returned by the 1Password SDK or extension. Requires access_request_id and an id on every requests entry. entryId may be omitted only when requests has one entry. Kernel doesn't verify the references; 1Password checks them when… */
	resolved?: Array<KernelOnePasswordResolvedAccessRequestEntryInput>;
	/** Legacy single-login shorthand. Supply requests instead. */
	website?: string;
};

/** End this account's 1Password connection and keep the item so it can be linked again. Fills stop at once. When no other vault uses the person's connection, Kernel revokes it at 1Password; if 1Password has not confirmed yet, this returns 409 provider_revocation_pending and Kernel keeps retrying.… */
export type KernelOnePasswordDisconnectVaultItemOperationRequestInput = {
	type: '1pw_disconnect';
};

/** Fill and submit an approved 1Password login in the selected browser page. The 1Password extension decides whether the approved login matches the page and refuses pages that don't. Supply entry_id when several entries are approved and the page origin does not identify exactly one of them, and… */
export type KernelOnePasswordFillVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** ID of an approved request entry. Required when several entries are approved and the page's origin does not match exactly one of them. */
	entry_id?: string;
	/** Exact current top-level page URL. Must match exactly one open page in the browser unless target_id is supplied. */
	page_url: string;
	/** CDP target ID of the page to fill, such as tab.target_id from playwright.execute. Use it when several open pages have page_url. The page's current URL must equal page_url. Kernel brings the page to the front of its window before filling. */
	target_id?: string;
	timeout_ms?: number;
	type: '1pw_fill';
};

export type KernelOnePasswordOAuthAuthorizationInput = {
	client: KernelKernelManagedOAuthClientInput;
	method: 'oauth';
};

/** Retrieve the status of a 1Password access request after presenting the approval link. Kernel paces checks on 1Password's schedule, timed from the first status check (at once, then every 2 seconds, slowing to every 10 and 20 seconds). Each call reads a fresh status, waiting up to 20 seconds for… */
export type KernelOnePasswordPollAccessVaultItemOperationRequestInput = {
	/** How long to keep checking on the schedule. The call still waits for its first scheduled check, at most 20 seconds, when that comes later. */
	timeout_seconds?: number;
	type: '1pw_access_request_status';
};

/** Kernel encountered a recoverable error while linking this 1Password account. Use this action to get a new link to recover the connection. After recovery completes, start a new authorization on the same item. */
export type KernelOnePasswordRecoverVaultItemOperationRequestInput = {
	type: '1pw_recover';
};

/** Request access to login entries in the end-user's own, non-shared 1Password vault. No browser is needed; the end-user approves access in the 1Password app. Shared-vault items and passkeys are not supported. Per-entry reason and keywords overrides are only supported for a single login entry. */
export type KernelOnePasswordRequestAccessVaultItemOperationRequestInput = {
	goal?: string;
	keywords?: Array<string>;
	reason?: string;
	type: '1pw_create_access_request';
};

export type KernelOnePasswordResolvedAccessRequestEntryInput = {
	/** The requested entry this login satisfies, when known. */
	entryId?: string;
	/** 1Password credential reference. Pass it unchanged as resourcePath to the extension's fillCredential or to the 1Password SDK. */
	reference: string;
};

/** Replace only the access token on a stored-token 1Password credential. Preserves its integration key, request and approved references. Does not invoke 1Password or retry a pending/uncertain operation. For a wallet whose grant your backend refreshes, use update_access_token instead. */
export type KernelOnePasswordUpdateAccessTokenVaultItemOperationRequestInput = {
	access_token: string;
	/** Optional supplied expiry. Omit to clear the old expiry. */
	access_token_expires_at?: string;
	type: '1pw_update_access_token';
};

/** Create one Link or Kernel purchase under its wallet, where payment requests are enabled for the organization. Kernel requests must select payment_method_id explicitly. */
export type KernelPaymentRequestVaultItemRequestInput = {
	spec: KernelPaymentRequestVaultItemSpecInput;
	type: 'payment_request';
};

export type KernelPaymentRequestVaultItemSpecInput =
	| KernelLinkCardVaultItemSpecInput
	| KernelKernelPaymentRequestVaultItemSpecInput;

export type KernelPaymentRequestVaultItemUpdateRequestInput = {
	spec: KernelPaymentRequestVaultItemSpecInput;
	type: 'payment_request';
};

/** Name of a Playwright executor. Calls with the same name run in the same executor, one at a time; the first call with a new name creates it. Calls on different executors run concurrently. 'default' names the executor that runs calls without a name. */
export type KernelPlaywrightExecutorNameInput = string;

/** Prepare an unused AgentCard card for a supported checkout. Deliver the returned approval URL and keep the approval page open. Poll the item until ready_to_submit, then submit native Pay before preparation.expires_at. Readiness lasts at most 30 seconds. Unused preparations expire automatically.… */
export type KernelPrepareCheckoutVaultItemOperationRequestInput = {
	checkout: KernelVaultCheckoutContextInput;
	type: 'prepare_checkout';
};

export type KernelPressKeyRequestInput = {
	/** Duration to hold the keys down in milliseconds. If omitted or 0, keys are tapped. */
	duration?: number;
	/** Optional modifier keys to hold during the key press sequence. */
	hold_keys?: Array<string>;
	/** List of key symbols to press. Each item should be a key symbol supported by xdotool (see X11 keysym definitions). Examples include "Return", "Shift", "Ctrl", "Alt", "F5". Items in this list could also be combinations, e.g. "Ctrl+t" or "Ctrl+Shift+Tab". Use X11 names for punctuation in… */
	keys: Array<string>;
};

/** Whether the IP can currently be assigned. An excluded IP is listed but cannot be pinned or moved to; proxies already on it keep working. */
export type KernelProxyIpStatusInput = 'active' | 'excluded';

/** Proxy selection. Provide either id or name. The proxy must be in the same project as the resource referencing it. When selecting by name, the name must match exactly one active proxy in the project. Ambiguous names return a 400; use id for stable references. */
export type KernelProxyRefInput = {
	/** Proxy ID */
	id?: string;
	/** Proxy name */
	name?: string;
};

/** Geographic region for hosting browser sessions or pools. */
export type KernelRegionInput =
	| 'us-east'
	| 'us-west'
	| 'eu-west'
	| 'ap-southeast';

/** Let a browser attached to the item's vault create a passkey on a website and store it in an empty passkey field. Only invoke when the item advertises `register_passkey`; declare the field first, for example by adding an optional passkey field with a credential update. Returns immediately; there… */
export type KernelRegisterPasskeyVaultItemOperationRequestInput = {
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** Empty passkey field to store the new passkey in. Required when more than one passkey field is empty. */
	field?: string;
	type: 'register_passkey';
};

/** Remove one payment method from a Kernel wallet, only when the wallet advertises remove_payment_method. Removal deletes the stored card and blocks new purchases, fills and confirmations funded by it without affecting the wallet's other payment methods; the wallet stays connected even with no… */
export type KernelRemovePaymentMethodVaultItemOperationRequestInput = {
	/** ID from the wallet's payment_methods expansion. */
	payment_method_id: string;
	type: 'remove_payment_method';
};

/** Configuration for residential proxies. */
export type KernelResidentialProxyConfigInput = {
	/** Autonomous system number. See https://bgp.potaroo.net/cidr/autnums.html */
	asn?: string;
	/** City name (no spaces, e.g. `sanfrancisco`). If provided, `country` must also be provided. */
	city?: string;
	/** ISO 3166 country code. If omitted, the proxy uses the global pool without country targeting. */
	country?: string;
	/** Operating system of the residential device. */
	os?: 'windows' | 'macos' | 'android';
	/** Two-letter state code. */
	state?: string;
	/** US ZIP code. */
	zip?: string;
};

/** Explicitly prepare a fresh local verification session for the same Kernel Visa purchase and connected wallet, only when restart_verification is advertised. Kernel must have durable proof of an initial attestation failure before intent dispatch. Replaces the spend_approval capability and discards… */
export type KernelRestartVerificationVaultItemOperationRequestInput = {
	type: 'restart_verification';
};

export type KernelScreenshotRegionInput = {
	/** Height of the region in pixels */
	height: number;
	/** Y coordinate of the region's top-left corner */
	y: number;
	/** Width of the region in pixels */
	width: number;
	/** X coordinate of the region's top-left corner */
	x: number;
};

export type KernelScrollRequestInput = {
	/** Horizontal scroll amount in xdotool "wheel units." Positive scrolls right, negative scrolls left. */
	delta_x?: number;
	/** Vertical scroll amount in xdotool "wheel units." Positive scrolls down, negative scrolls up. */
	delta_y?: number;
	/** Modifier keys to hold during the scroll */
	hold_keys?: Array<string>;
	/** Y coordinate at which to perform the scroll */
	y: number;
	/** X coordinate at which to perform the scroll */
	x: number;
};

export type KernelSearchAutoStrategyInput = {
	fallback_on?: KernelSearchFallbackConditionsInput;
	provider_options?: KernelSearchProviderOptionsInput;
	/** Let Kernel choose an eligible provider by capability fit. */
	type: 'auto';
};

export type KernelSearchBraveOptionsInput = {
	/** Provider-native count. Lower-only alias for max_results; cannot raise the effective result cap. */
	count?: number;
	/** Request additional snippets from Brave. */
	extra_snippets?: boolean;
	/** Goggles re-ranking definition URL. */
	goggles?: string;
	/** Deprecated Brave Goggle identifier. Prefer goggles. */
	goggles_id?: string;
	/** Include Brave's fetch metadata. */
	include_fetch_metadata?: boolean;
	/** Page offset supported by Brave. */
	offset?: number;
	/** Brave search operators. */
	operators?: string;
	/** Comma-separated result types to include, e.g. "web,news". */
	result_filter?: string;
	/** Language of the search, e.g. "en". */
	search_lang?: string;
	/** Apply Brave's query spellcheck. */
	spellcheck?: boolean;
	/** Language for UI strings in the response. */
	ui_lang?: string;
	/** Measurement units. */
	units?: 'metric' | 'imperial';
};

export type KernelSearchBraveTargetInput = {
	options?: KernelSearchBraveOptionsInput;
	provider: 'brave';
};

export type KernelSearchBrowserOptionsInput = {
	/** Existing browser session ID authorized for the caller and selected project. Reuses its cookies, proxy, and browser configuration; requests follow that browser's existing network access behavior, with no additional destination allowlist in this endpoint. Kernel does not delete a caller-supplied… */
	browser_id?: string;
	/** Curl uses the browser HTTP stack without navigation or JavaScript execution. Render navigates a temporary page and extracts from its DOM. The selected mode is used for the retrieval. */
	mode?: 'curl' | 'render';
};

export type KernelSearchContentFormatInput = 'markdown' | 'text';

export type KernelSearchContentOptionsInput = {
	/** Requires source=auto or source=browser in deferred retrieval. */
	browser?: KernelSearchBrowserOptionsInput;
	format?: KernelSearchContentFormatInput;
	/** For source=auto, maximum acceptable age of retained provider content, measured from when the search received it from the provider. A value of 0 disables reuse of retained content, so every result is fetched through a browser. source=provider reuses retained provider content without freshness… */
	max_age_hours?: number;
	/** Per-result Unicode character limit after extraction. Retained provider content cannot exceed what was stored at search time; such results report truncated when the stored text was already truncated. */
	max_chars?: number;
	/** auto uses retained provider content within max_age_hours; for deferred retrieval it falls back to a Kernel browser (caller-supplied or temporary) for results without it. Inline retrieval never uses a browser. provider reuses retained provider content when available, without freshness validation,… */
	source?: 'auto' | 'provider' | 'browser';
	/** Per-result deadline including capacity acquisition, retrieval, and extraction. Also bounded by the overall request deadline. */
	timeout_ms?: number;
};

export type KernelSearchContextMarkdownOptionsInput = {
	enabled?: boolean;
	includeFrames?: boolean;
	includeImages?: boolean;
	includeLinks?: boolean;
	maxAgeMs?: number;
	pdf?: {
		shouldParse?: boolean;
	};
	shortenBase64Images?: boolean;
	timeoutMS?: number;
	useMainContentOnly?: boolean;
	waitForMs?: number;
};

export type KernelSearchContextOptionsInput = {
	/** ISO 3166-1 alpha-2 country code. */
	country?: string;
	/** Blocklist of result domains. */
	excludeDomains?: Array<string>;
	/** Restrict results to content published within this window. */
	freshness?: 'last_24_hours' | 'last_week' | 'last_month' | 'last_year';
	/** Allowlist of result domains. */
	includeDomains?: Array<string>;
	markdownOptions?: KernelSearchContextMarkdownOptionsInput;
	/** Number of results to request from Context.dev. */
	numResults?: number;
	/** Expand the query into multiple parallel variants. */
	queryFanout?: boolean;
	/** Usage tracking tags. */
	tags?: Array<string>;
	/** Context.dev request timeout in milliseconds. */
	timeoutMS?: number;
};

export type KernelSearchContextTargetInput = {
	options?: KernelSearchContextOptionsInput;
	provider: 'context';
};

export type KernelSearchExaOptionsInput = {
	/** Provider data-category hint. */
	category?: string;
	/** Provider-native compliance controls. Requires support and authorization on the provider account. */
	compliance?: string;
	contents?: KernelSearchExaOptionsContentsInput;
	/** Provider-native cache-age control. Unlike content.max_age_hours, this retains Exa semantics, including any native sentinel values. It does not imply a cross-provider freshness guarantee. */
	maxAgeHours?: number;
	/** Provider-native count. Lower-only alias for max_results. */
	numResults?: number;
	/** Search mode supported by Exa. */
	type?: 'auto' | 'fast' | 'instant';
};

/** Provider-native content retrieval. Available without requesting Kernel browser retrieval; may incur provider retrieval charges. */
export type KernelSearchExaOptionsContentsInput = {
	/** Return query-relevant provider excerpts. Defaults to true for Exa search requests; set false to disable. */
	highlights?: boolean;
	/** Return provider page text. */
	text?: boolean;
};

export type KernelSearchExaTargetInput = {
	options?: KernelSearchExaOptionsInput;
	provider: 'exa';
};

export type KernelSearchFallbackConditionInput = 'error' | 'timeout' | 'empty';

/** Conditions that advance to the next provider under auto routing or an explicit providers chain. Ignored when provider pins a single provider. error means a retryable provider failure, including rate limiting, not invalid caller input or caller quotas. empty means zero results after required… */
export type KernelSearchFallbackConditionsInput =
	Array<KernelSearchFallbackConditionInput>;

export type KernelSearchFallbackStrategyInput = {
	fallback_on?: KernelSearchFallbackConditionsInput;
	/** Ordered provider targets. Provider names must be unique. */
	providers: Array<KernelSearchProviderTargetInput>;
	/** Try providers in order and advance when fallback_on matches the outcome. */
	type: 'fallback';
};

export type KernelSearchOctenOptionsInput = {
	count?: number;
	end_time?: string;
	exclude_domains?: Array<string>;
	exclude_text?: Array<string>;
	format?: 'markdown' | 'text';
	full_content?: {
		enable?: boolean;
		max_tokens?: number;
	};
	highlight?: {
		enable?: boolean;
		max_tokens?: number;
	};
	include_domains?: Array<string>;
	include_images?: boolean;
	include_text?: Array<string>;
	language?: Array<string>;
	safesearch?: 'off' | 'strict';
	start_time?: string;
	time_basis?: 'auto' | 'published' | 'crawled';
	time_range?: 'day' | 'week' | 'month' | 'year' | 'd' | 'w' | 'm' | 'y';
	topic?: 'general' | 'news';
};

export type KernelSearchOctenTargetInput = {
	options?: KernelSearchOctenOptionsInput;
	provider: 'octen';
};

export type KernelSearchParallelOptionsInput = {
	advanced_settings?: KernelSearchParallelOptionsAdvancedSettingsInput;
	/** Client model hint. */
	client_model?: string;
	/** Cap total characters returned. */
	max_chars_total?: number;
	/** Search mode. Basic is used when omitted; each mode can have different latency and charges. */
	mode?: 'turbo' | 'fast' | 'basic' | 'advanced';
	/** The goal behind the search, stated separately from the query. */
	objective?: string;
	/** Provider-native multi-query search. Defaults to [query] for this provider. */
	search_queries?: Array<string>;
	/** Group related searches. */
	session_id?: string;
};

/** Explicit search settings. Unified search parameters are re-applied to overlapping settings; native result counts are lower-only. */
export type KernelSearchParallelOptionsAdvancedSettingsInput = {
	excerpt_settings?: KernelSearchParallelOptionsAdvancedSettingsExcerptSettingsInput;
	fetch_policy?: KernelSearchParallelOptionsAdvancedSettingsFetchPolicyInput;
	/** Native ISO 3166-1 alpha-2 location preference. */
	location?: string | null;
	/** Native count; lower-only alias for unified max_results. */
	max_results?: number | null;
	source_policy?: KernelSearchParallelOptionsAdvancedSettingsSourcePolicyInput;
};

export type KernelSearchParallelOptionsAdvancedSettingsExcerptSettingsInput = {
	max_chars_per_result?: number | null;
};

export type KernelSearchParallelOptionsAdvancedSettingsFetchPolicyInput = {
	/** When false, the provider may return cached content after live fetching fails. */
	disable_cache_fallback?: boolean;
	/** Native live-fetch trigger; minimum 600 seconds. Not the unified hard-freshness control. */
	max_age_seconds?: number | null;
	/** Native live-fetch timeout, bounded by the remaining overall deadline. */
	timeout_seconds?: number | null;
};

export type KernelSearchParallelOptionsAdvancedSettingsSourcePolicyInput = {
	/** Native publication-date lower bound. */
	after_date?: string | null;
	/** Native exclusions; the provider ignores these when native include_domains is non-empty. */
	exclude_domains?: Array<string>;
	/** Native domain/path restrictions. Explicit unified domain parameters take precedence. Combined include/exclude native lists cannot exceed 200 entries. */
	include_domains?: Array<string>;
};

export type KernelSearchParallelTargetInput = {
	options?: KernelSearchParallelOptionsInput;
	provider: 'parallel';
};

export type KernelSearchPerplexityOptionsInput = {
	/** MM/DD/YYYY. Filters by last-updated date, not published date. */
	last_updated_after_filter?: string;
	/** MM/DD/YYYY upper bound on last-updated date. */
	last_updated_before_filter?: string;
	/** Provider-native count. Lower-only alias for max_results. */
	max_results?: number;
	/** Values outside the documented range are rejected. */
	max_tokens?: number;
	/** Per-page token cap. */
	max_tokens_per_page?: number;
	/** Provider-native multi-query form, applied only to Perplexity. Other fallback providers receive the top-level query. Each query may incur a separate provider charge. */
	query?: Array<string>;
	/** Amount of page content Perplexity extracts per result. Defaults to medium unless max_tokens or max_tokens_per_page is set. */
	search_context_size?: 'low' | 'medium' | 'high';
	/** ISO 639-1 language codes, max 20. */
	search_language_filter?: Array<string>;
};

export type KernelSearchPerplexityTargetInput = {
	options?: KernelSearchPerplexityOptionsInput;
	provider: 'perplexity';
};

export type KernelSearchPinnedStrategyInput = {
	provider: KernelSearchProviderTargetInput;
	/** Use exactly the selected provider with no cross-provider fallback. */
	type: 'pinned';
};

/** Provider targets available to auto routing, each paired with typed native options. Provider names must be unique. */
export type KernelSearchProviderOptionsInput =
	Array<KernelSearchProviderTargetInput>;

/** Concrete search provider. Matches the slugs returned by GET /search/providers. */
export type KernelSearchProviderSlugInput =
	| 'brave'
	| 'exa'
	| 'perplexity'
	| 'context'
	| 'parallel'
	| 'octen'
	| 'you'
	| 'tavily';

/** Provider name paired with its typed native options. */
export type KernelSearchProviderTargetInput =
	| KernelSearchBraveTargetInput
	| KernelSearchExaTargetInput
	| KernelSearchPerplexityTargetInput
	| KernelSearchContextTargetInput
	| KernelSearchParallelTargetInput
	| KernelSearchOctenTargetInput
	| KernelSearchYouTargetInput
	| KernelSearchTavilyTargetInput;

/** Typed provider selection and routing strategy. */
export type KernelSearchStrategyInput =
	| KernelSearchAutoStrategyInput
	| KernelSearchPinnedStrategyInput
	| KernelSearchFallbackStrategyInput;

export type KernelSearchTavilyOptionsInput = {
	/** Allow the provider to choose search parameters. May select a different billing tier; explicit caller values retain provider-native precedence. */
	auto_parameters?: boolean;
	/** Provider excerpts per source, up to 500 characters each. */
	chunks_per_source?: number;
	/** Require the quoted phrases in the query verbatim, bypassing semantic matches. */
	exact_match?: boolean;
	/** Strictly filter non-matching languages. Requires `language`. */
	filter_by_language?: boolean;
	/** Request the provider's generated answer. Returned as answer on the search response, independently of include_raw. */
	include_answer?: boolean | 'basic' | 'advanced';
	/** Native filter versus ranking boost semantics. Boost influences ranking rather than restricting results to the listed domains. Requires include_domains. */
	include_domains_mode?: 'filter' | 'boost';
	/** Favicon URL per result. */
	include_favicon?: boolean;
	/** Describe each image. Needs include_images. */
	include_image_descriptions?: boolean;
	/** Query-related images plus per-result images. */
	include_images?: boolean;
	/** Request native full-page content. Defaults to markdown when omitted for this provider, False disables that native retrieval; it does not disable explicitly requested Kernel browser retrieval. */
	include_raw_content?: boolean | 'markdown' | 'text';
	/** ISO 639-1 code or English language name. Ranking boost unless filter_by_language. */
	language?: string;
	/** Provider-native count. Lower-only alias for max_results. */
	max_results?: number;
	/** Provider relevance and latency tier. Some tiers cannot be combined with native safe search; conflicts are described in warnings. */
	search_depth?: 'advanced' | 'basic' | 'fast' | 'ultra-fast';
	/** Provider corpus selector. Publication metadata depends on the selected topic. */
	topic?: 'general' | 'news' | 'finance';
};

export type KernelSearchTavilyTargetInput = {
	options?: KernelSearchTavilyOptionsInput;
	provider: 'tavily';
};

export type KernelSearchYouOptionsInput = {
	/** Prefer these domains without excluding others. Cannot be combined with include_domains if the provider does not accept the combination. */
	boost_domains?: Array<string>;
	/** Provider-native per-section count. Lower-only alias for max_results. Web and news sections may produce more rows than Kernel returns. */
	count?: number;
	/** Native extraction timeout in seconds, bounded by the remaining Kernel request deadline. */
	crawl_timeout?: number;
	extraction?: KernelSearchYouOptionsExtractionInput;
	/** Request licensed-data output. URL-less knowledge entries are not converted into web results; include_raw exposes the full provider response separately. */
	knowledge?: 'core';
	/** BCP 47 result language from You.com's 51-value enum, e.g. "EN", "JA". Default EN. */
	language?: string;
	/** Page offset supported by You.com. */
	offset?: number;
};

/** Provider-native page extraction. Both modes may incur per-row charges; full_page may retrieve web and news rows. */
export type KernelSearchYouOptionsExtractionInput = {
	extraction_mode: 'highlights' | 'full_page';
	full_page?: KernelSearchYouOptionsExtractionFullPageInput;
};

export type KernelSearchYouOptionsExtractionFullPageInput = {
	extraction_formats?: Array<KernelSearchYouOptionsExtractionFullPageExtractionFormatsItemInput>;
};

export type KernelSearchYouOptionsExtractionFullPageExtractionFormatsItemInput =
	| 'html'
	| 'markdown';

export type KernelSearchYouTargetInput = {
	options?: KernelSearchYouOptionsInput;
	provider: 'you';
};

export type KernelSetCursorRequestInput = {
	/** Whether the cursor should be hidden or visible */
	hidden: boolean;
};

/** Shop Pay purchase. amount is the limit the shopper approves; totals must include exactly one positive total no higher than it. context is shown to the shopper when they approve. Authorize it with the browser at final checkout: Kernel sends that page to Shop as the merchant and the card fills… */
export type KernelShopPayCardVaultItemSpecInput = {
	/** Approval limit in minor currency units, at most 1000000. */
	amount: number;
	/** What is being bought and why, written for the shopper. */
	context: string;
	/** Shop accepts USD spend requests only. */
	currency: string;
	line_items?: Array<KernelShopPayLineItemInput>;
	/** ISO 3166-1 alpha-2 country of the merchant. */
	merchant_country?: string;
	merchant_name: string;
	/** The merchant's https URL. */
	merchant_url: string;
	/** Card ID from the wallet's payment_methods expansion. Omit it to use the shopper's preferred card. */
	payment_method_id?: string;
	provider: 'shop_pay';
	totals: Array<KernelShopPayTotalInput>;
	/** Connected Shop Pay wallet item key. */
	wallet: string;
};

export type KernelShopPayLineItemInput = {
	name: string;
	quantity: number;
	/** Unit price in minor currency units. */
	unit_amount: number;
};

export type KernelShopPayOAuthAuthorizationInput = {
	client: KernelKernelManagedOAuthClientInput;
	method: 'oauth';
};

export type KernelShopPayTotalInput = {
	/** Amount in minor currency units; discounts are negative. */
	amount: number;
	/** For example subtotal, fulfillment, tax, discount or total. */
	type: string;
};

/** Shop Pay wallet connected through Kernel's Shop app. Creation returns a shop_pay_oauth action: the shopper signs in to Shop and approves the connection, and the wallet connects. The connected wallet's payment_methods expansion lists the shopper's saved Shop Pay cards. */
export type KernelShopPayWalletVaultItemSpecInput = {
	authorization: KernelShopPayOAuthAuthorizationInput;
	provider: 'shop_pay';
};

/** Billing address filled with the billing_* fill fields. Never returned. */
export type KernelSingleUseCardBillingAddressInput = {
	city?: string;
	/** ISO 3166-1 alpha-2 code. */
	country?: string;
	line1?: string;
	line2?: string;
	postal_code?: string;
	state?: string;
};

/** Pause execution for a specified duration. */
export type KernelSleepActionInput = {
	/** Duration to sleep in milliseconds. */
	duration_ms: number;
};

/** User-defined key-value tags. */
export type KernelTagsInput = Record<string, string>;

/** Caller-defined string key-value pairs for grouping and filtering tasks, such as a user or thread ID. At most 20 keys; keys are 1-64 characters, values at most 256 characters, and keys and values together at most 4 KB. */
export type KernelTaskMetadataInput = Record<string, string>;

export type KernelTypeTextRequestInput = {
	/** Delay in milliseconds between keystrokes */
	delay?: number;
	/** Text to type on the browser instance */
	text: string;
};

/** Replace the stored access token on a wallet whose grant your backend refreshes, such as a Link wallet imported with token_refresh=customer. The token must come from the grant the wallet was imported with. Kernel stores it without contacting the provider and never refreshes or revokes the grant.… */
export type KernelUpdateAccessTokenVaultItemOperationRequestInput = {
	access_token: string;
	type: 'update_access_token';
};

export type KernelVaultAgentCardProviderClientCredentialsInput =
	KernelVaultOAuthClientCredentialsInput;

/** Register application credentials for AgentCard wallet enrollment and checkout approvals. Kernel obtains application access tokens using client_credentials. */
export type KernelVaultAgentCardProviderConfigRequestInput = {
	credentials: KernelVaultAgentCardProviderClientCredentialsInput;
	/** Unique within the organization. */
	name: string;
	provider: 'agentcard';
};

/** Required when preparing an unused AgentCard card for a supported checkout processor. Consent is bound to this browser and declared merchant origin, not a tab. Wait for the item's ready_to_submit status before native Pay and submit within its readiness deadline. Unused preparations expire… */
export type KernelVaultCheckoutContextInput = {
	/** Active browser session with this vault bound to it. */
	browser_id: string;
	/** Use production or sandbox for Square, Braintree, Worldpay and Adyen; shared for Bambora and Mercado Pago. Shared endpoints do not establish test mode. Merchant credentials/configuration determine processor test mode, independently of the AgentCard credential mode. */
	environment: 'production' | 'sandbox' | 'shared';
	/** Canonical HTTPS origin of the top-level merchant document, not a processor iframe. HTTP localhost is accepted for tests. */
	merchant_origin: string;
	/** Checkout processor. Omit for Square compatibility. Adyen supports fresh-card Sessions requests on Adyen hosts only. Use public dummy card fields, not vault aliases. The unique armed preparation is associated with the subsequent eligible request from this browser and declared merchant origin;… */
	psp?: KernelAgentCardPreparedProcessorInput;
};

export type KernelVaultFillFieldInput = {
	/** A credential field name from the item's declared fields (Kernel) or state.fields from a single-item read (managed auth), or a supported card field. Unset credential fields cannot be filled. */
	field: string;
	/** Required only for a card's combined expiration field. Forbidden for other card fields and all credential fields. */
	format?: 'MM/YY' | 'MM/YYYY';
	selector: string;
};

export type KernelVaultItemExpansionTypeInput =
	| 'payment_methods'
	| 'link_user_info'
	| 'link_shipping_addresses';

export type KernelVaultItemOperationRequestInput =
	| KernelAuthorizeVaultItemOperationRequestInput
	| KernelRestartVerificationVaultItemOperationRequestInput
	| KernelConfirmTransactionVaultItemOperationRequestInput
	| KernelCollectVaultItemOperationRequestInput
	| KernelPrepareCheckoutVaultItemOperationRequestInput
	| KernelFillVaultItemOperationRequestInput
	| KernelArmPasskeyVaultItemOperationRequestInput
	| KernelRegisterPasskeyVaultItemOperationRequestInput
	| KernelDisarmPasskeyVaultItemOperationRequestInput
	| KernelOnePasswordRequestAccessVaultItemOperationRequestInput
	| KernelOnePasswordPollAccessVaultItemOperationRequestInput
	| KernelOnePasswordFillVaultItemOperationRequestInput
	| KernelOnePasswordRecoverVaultItemOperationRequestInput
	| KernelOnePasswordDisconnectVaultItemOperationRequestInput
	| KernelOnePasswordUpdateAccessTokenVaultItemOperationRequestInput
	| KernelUpdateAccessTokenVaultItemOperationRequestInput
	| KernelWebMCPInvokeVaultItemOperationRequestInput
	| KernelAddPaymentMethodVaultItemOperationRequestInput
	| KernelRemovePaymentMethodVaultItemOperationRequestInput;

export type KernelVaultItemRequestInput =
	| KernelWalletVaultItemRequestInput
	| KernelCardVaultItemRequestInput
	| KernelPaymentRequestVaultItemRequestInput
	| KernelCredentialAccountVaultItemRequestInput
	| KernelCredentialVaultItemRequestInput;

/** Type must match the stored item; an update cannot change item type. Legacy card updates may omit type; payment_request updates require it. Credential updates require explicit type and version. Wallet updates are unsupported. */
export type KernelVaultItemUpdateRequestInput =
	| KernelCardVaultItemUpdateRequestInput
	| KernelPaymentRequestVaultItemUpdateRequestInput
	| KernelCredentialVaultItemUpdateRequestInput;

export type KernelVaultLinkProviderClientCredentialsInput = {
	client_id: string;
	client_secret: string;
	/** Stripe publishable key for the account that owns the Link OAuth client. Link requires it as the bearer credential when Kernel refreshes or revokes imported wallet grants; without it, those wallets stop working when the imported access token expires. */
	publishable_key?: string;
};

/** Register a customer-owned Link OAuth client for refreshing and revoking imported wallet grants. The customer is responsible for initiating OAuth flows to connect a user's wallet and handling the redirect to obtain a Link access token and refresh token. */
export type KernelVaultLinkProviderConfigRequestInput = {
	credentials: KernelVaultLinkProviderClientCredentialsInput;
	/** Unique within the organization. */
	name: string;
	provider: 'link';
};

export type KernelVaultOAuthClientCredentialsInput = {
	client_id: string;
	client_secret: string;
};

/** Select a provider config by ID or name. Responses return the ID. Renaming a config does not change existing wallet bindings; an item cannot switch to a different config after creation. */
export type KernelVaultProviderConfigReferenceInput = {
	id?: string;
	name?: string;
};

/** Provider-specific settings and credentials for a configuration shared across the organization's projects. */
export type KernelVaultProviderConfigRequestInput =
	| KernelVaultLinkProviderConfigRequestInput
	| KernelVaultAgentCardProviderConfigRequestInput
	| KernelVaultVgsProviderConfigRequestInput;

/** Reference to a project-scoped vault. Provide exactly one of id or name. */
export type KernelVaultReferenceInput = {
	id?: string;
	name?: string;
};

/** Register a service account for a customer-managed VGS vault. Kernel fetches a token, requires the aliases:read scope, and then looks up an alias that does not exist to confirm the account reaches vault_id in environment. If either check fails, nothing is stored. */
export type KernelVaultVgsProviderConfigRequestInput = {
	credentials: KernelVaultVgsProviderCredentialsInput;
	/** Unique within the organization. */
	name: string;
	provider: 'vgs';
};

/** A VGS service account with the aliases:read scope on the customer's vault, which Kernel uses to reveal the aliases each purchase sends. */
export type KernelVaultVgsProviderCredentialsInput = {
	client_id: string;
	client_secret: string;
	/** The vault's VGS environment. */
	environment: 'sandbox' | 'live';
	/** The customer's VGS vault ID. */
	vault_id: string;
};

export type KernelVaultWebMCPBindingInput = {
	/** A declared, populated credential field or supported card field. A TOTP field supplies a fresh code, never its seed. Passkey fields cannot be filled. */
	field: string;
	/** Required for card expiration (MM/YY or MM/YYYY), forbidden for other fields. Invalid formats are rejected before invocation. */
	format?: string;
	/** RFC 6901 JSON Pointer to an existing null value in input. Object keys are exact; array indices must be canonical and in range. No root or array-append paths. Each path and each field may occur only once. */
	input_path: string;
};

/** The card supplied to a purchase, as aliases in the customer's VGS vault. With card_mode full it is a whole card: a persistent alias of its number, a freshly collected volatile alias of its security code, its expiry and its last four digits. With card_mode cvc_only it is a CVC alias alone,… */
export type KernelVgsCardInputInput = {
	/** A volatile alias of a freshly collected security code in the customer's vault. It must still exist when authorize runs. Required in both modes. */
	cvc_alias: string;
	/** Required with card_mode full, rejected with card_mode cvc_only. */
	exp_month?: number;
	/** Required with card_mode full, rejected with card_mode cvc_only. */
	exp_year?: number;
	/** The card number's last four digits, checked against the revealed alias. Required with card_mode full, rejected with card_mode cvc_only. */
	last4?: string;
	/** A persistent alias of the card number in the customer's vault. Required with card_mode full, rejected with card_mode cvc_only. */
	pan_alias?: string;
};

/** One live purchase with a card in the customer's VGS vault. With card_mode full, authorize reveals card.pan_alias and card.cvc_alias through Kernel's VGS outbound proxy; with card_mode cvc_only, for a card the merchant already holds on file whose checkout page asks only for the security code, it… */
export type KernelVgsCardVaultItemSpecInput = {
	/** Integer amount in minor currency units (at most 1000000). */
	amount: number;
	/** Required when creating the card. Never returned. */
	card?: KernelVgsCardInputInput;
	/** Which card this purchase supplies, and the only part of it a read returns. full is a whole card from the customer's vault. cvc_only is a card the merchant already holds on file, whose checkout page asks for nothing but the security code. It must match spec.card: a full card that is missing… */
	card_mode?: 'full' | 'cvc_only';
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency: string;
	merchant_name: string;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url: string;
	provider: 'vgs';
	/** Key of the VGS wallet item whose configuration reads the aliases. */
	wallet: string;
};

/** Cards kept in the customer's own VGS vault. The wallet binds a VGS provider configuration and is connected on creation; it holds no cards and has no payment methods. Each purchase is a card item that carries the card's aliases from the customer's vault. The configuration binding cannot be… */
export type KernelVgsWalletVaultItemSpecInput = {
	provider: 'vgs';
	/** Select a VGS configuration. Required, because there are no Kernel-managed VGS credentials for this provider. */
	provider_config: KernelVaultProviderConfigReferenceInput;
};

export type KernelWalletVaultItemRequestInput = {
	spec:
		| KernelLinkWalletVaultItemRequestSpecInput
		| KernelAgentCardWalletVaultItemSpecInput
		| KernelKernelWalletVaultItemSpecInput
		| KernelShopPayWalletVaultItemSpecInput
		| KernelVgsWalletVaultItemSpecInput;
	type: 'wallet';
};

/** Invoke a WebMCP tool using values from a vaulted item. The browser must be attached to the item's vault. Discover the tool_ref, inputSchema, and source with GET /browsers/{id_or_name}/webmcp/tools or webmcp.listTools() in the Browser REPL (POST /browsers/{id_or_name}/repl) before invoking it.… */
export type KernelWebMCPInvokeVaultItemOperationRequestInput = {
	bindings: Array<KernelVaultWebMCPBindingInput>;
	/** Browser session ID, not a reusable browser name. */
	browser_id: string;
	/** Public tool arguments with an existing null slot at each binding path. At most 64 KiB after JSON serialization, including substituted values. Never include vault values here. */
	input: Record<string, KernelJsonValue>;
	/** Exact top-level URL from the discovered tool source (fragment omitted). This pins the target page; it does not authorize a destination. */
	page_url: string;
	/** Tool invocation timeout in seconds; preflight and response handling have an additional bounded allowance. An indeterminate outcome is not retried. */
	timeout_sec?: number;
	/** Opaque reference to the exact live WebMCP registration. */
	tool_ref: string;
	type: 'webmcp_invoke';
};

/** The payment method created in pending_enrollment. Deliver a card_enrollment action.url to the cardholder; it is a single-use capability and must not be logged. A card_ingest action.url is posted to by the card's issuer. Observe completion through the wallet's payment_methods expansion. */
export type KernelAddPaymentMethodVaultItemOperationResult = {
	payment_method?: KernelVaultPaymentMethod | null;
	type?: string | null;
};

export type KernelAgentCardCardState = {
	aliases?: KernelVaultCardAliases | null;
	authorization?: KernelAgentCardCheckoutAuthorization | null;
	masks?: KernelVaultItemMasks | null;
	preparation?: KernelAgentCardCheckoutPreparation | null;
	provider?: string | null;
	/** ready_to_submit is device readiness for at most 30 seconds. consumed means the prepared attempt has settled, not that an order succeeded. stopped cannot be reused. outcome_unknown requires merchant reconciliation and blocks new requests. recovery_required means the original checkout outcome is… */
	status?: string | null;
	status_reason?: string | null;
};

/** AgentCard reusable live payment card. Test-mode card creation is not supported. Each checkout creates an authorization for spec.merchant / spec.amount that the cardholder approves, unless AgentCard runs it under one of the cardholder's autopilot rules. The card stays ready after each authorization. */
export type KernelAgentCardCardVaultItemSpec = {
	/** Integer amount in minor currency units. */
	amount?: number | null;
	/** Opaque card ID returned by AgentCard for a card in the connected wallet. Pass it through unchanged without assuming a prefix or format. Omitted, the cardholder picks on the approval screen. */
	card_id?: string | null;
	/** Origin of the top-level checkout page, such as https://shop.example.com: https, a lowercase host, a port only when it is not 443, and no path. http is accepted only for localhost test pages. Checkouts without a preparation send it to AgentCard, which uses it to match the cardholder's autopilot… */
	checkout_origin?: string | null;
	currency?: string | null;
	/** Discount as a positive number of minor currency units; 500 takes 5.00 off. Requires line_items. */
	discount?: number | null;
	/** What the next checkout buys, listed on the cardholder's approval screen above the total. Display only: the cardholder approves amount, or the amount the processor charges, and a line total that disagrees with it changes nothing they pay. Amounts are in minor units of currency. Sent only for… */
	line_items?: Array<KernelAgentCardLineItem> | null;
	/** Merchant name shown on the cardholder's approval screen. */
	merchant?: string | null;
	provider?: string | null;
	/** Shipping charge in minor currency units. Requires line_items. */
	shipping?: number | null;
	/** Cart subtotal in minor currency units. Requires line_items. */
	subtotal?: number | null;
	/** Tax in minor currency units. Requires line_items. */
	tax?: number | null;
	/** Wallet item key used to authorize checkouts. */
	wallet?: string | null;
};

/** The in-flight or most recent checkout authorization. Present while a checkout is pending approval and after it settles. */
export type KernelAgentCardCheckoutAuthorization = {
	actual_cents?: number | null;
	/** Display amount shown on the approval screen. */
	amount?: string | null;
	/** Source of the approved amount. `processor` is read from the processor request or payment; `agent` is the item's declared amount; `page` is the checkout page total; `none` means no amount was named. `display_only` appears only on authorizations recovered without a provider read. `agent` and… */
	amount_authority?: string | null;
	amount_cents?: number | null;
	/** Whether the processor charged the approved amount. Absent when there was no charge to compare, including tokenization checkouts. */
	amount_verified?: boolean | null;
	approval_url?: string | null;
	/** Browser session that submitted the checkout. */
	browser_id?: string | null;
	/** Amount the processor reported collecting. Absent when the provider didn't observe a charge. */
	charged_amount_cents?: number | null;
	/** Currency of `charged_amount_cents`. Absent when the provider didn't observe a charge. */
	charged_currency?: string | null;
	/** What the processor collected. `none` means the checkout produced a token or payment method that the merchant charges later. Absent when the provider reported nothing, which is common for tokenization checkouts; use item events and the merchant's order record instead. */
	charged_kind?: string | null;
	created_at?: string | null;
	currency?: string | null;
	expected_cents?: number | null;
	expires_at?: string | null;
	id?: string | null;
	merchant?: string | null;
	psp?: string | null;
	psp_error_code?: string | null;
	reason?: string | null;
	replay_attempted?: boolean | null;
	/** Whether the processor response was delivered to the browser. */
	replay_delivered?: boolean | null;
	/** HTTP status of the replayed processor response. */
	replay_status?: number | null;
	status?: string | null;
};

/** One-use processor-bound checkout preparation. Keep the approval page open through device handoff, including Adyen encryption. The amount is declared by the caller and does not constrain the merchant's eventual charge. Adyen device approval and browser Authorised responses are not capture or… */
export type KernelAgentCardCheckoutPreparation = {
	approval_url?: string | null;
	browser_id?: string | null;
	created_at?: string | null;
	environment?: string | null;
	/** When ready, the absolute deadline to submit the first native request; no later than provider readiness expiry or 30 seconds after Kernel first observes readiness. Polling never extends this deadline. */
	expires_at?: string | null;
	id?: string | null;
	merchant_origin?: string | null;
	psp?: KernelAgentCardPreparedProcessor | null;
	/** Preparation consumed means egress claimed the preparation and it cannot be reused. It does not mean the attempt settled. Use the enclosing item's status as the lifecycle indicator; item consumed means the attempt settled, not that an order or charge succeeded. */
	status?: string | null;
};

/** One product on the AgentCard approval screen. */
export type KernelAgentCardLineItem = {
	/** The line's total in minor currency units. Shown instead of unit_amount times quantity when both are set; a line with neither shows without a price. */
	amount?: number | null;
	/** Shown beside the title. */
	brand?: string | null;
	/** https URL of the product's picture. AgentCard shows pictures only from the image hosts it allows and shows the line without one otherwise. */
	image_url?: string | null;
	/** The options the shopper chose, such as "Size S · Pink". */
	options?: string | null;
	quantity?: number | null;
	/** The product's name as the store shows it. */
	title?: string | null;
	/** Price of one, in minor currency units. The line shows unit_amount times quantity. */
	unit_amount?: number | null;
};

export type KernelAgentCardPreparedProcessor = string;

export type KernelAgentCardWalletState = {
	provider?: string | null;
	status?: string | null;
	status_reason?: string | null;
	/** AgentCard user id linked to this wallet. Present once connected. */
	user_id?: string | null;
};

/** AgentCard wallet. Omit provider_config to use Kernel-managed credentials, or select a customer-owned configuration. Mode (sandbox vs live) is determined by the selected credential; there is no per-item test flag. Without user_id, creation returns a hosted enrollment action and Kernel polls until… */
export type KernelAgentCardWalletVaultItemSpec = {
	provider?: string | null;
	/** Select an AgentCard configuration. The wallet's configuration cannot be changed after creation. */
	provider_config?: KernelVaultProviderConfigReference | null;
	user_id?: string | null;
};

export type KernelApiKey = {
	/** When the API key was created */
	created_at?: string | null;
	/** Human audit creator, or null after creator deletion. Not the service credential's principal. */
	created_by?: KernelApiKeyCreator | null;
	/** When the API key was deleted (soft-deleted). Null for keys that have not been deleted. */
	deleted_at?: string | null;
	/** When the API key expires */
	expires_at?: string | null;
	/** Unique API key identifier */
	id?: string | null;
	/** When the API key last authenticated a request, accurate to within about 20 minutes. Null if the key has not been used since last-use tracking began. */
	last_used_at?: string | null;
	/** Masked version of the API key */
	masked_key?: string | null;
	/** Label for the API key. API keys are not addressable by name; use the ID or key identifier for stable references. */
	name?: string | null;
	/** Permissions granted to a scoped API key. Absent for an ordinary key, which keeps unrestricted access within its organization or project. */
	policy?: KernelApiKeyPolicy | null;
	principal?: KernelApiKeyPrincipal | null;
	/** Project identifier for project-scoped API keys. Null means org-wide. */
	project_id?: string | null;
	/** Project name for project-scoped API keys. Null means the key is org-wide or the project name is unavailable. */
	project_name?: string | null;
	/** Organization-owned service principal, when linked. */
	service_account_id?: string | null;
};

export type KernelApiKeyCreator = {
	/** Email address of the creator. */
	email?: string | null;
	/** Kernel user ID of the creator. */
	id?: string | null;
	/** Display name of the creator, if available. */
	name?: string | null;
};

export type KernelApiKeyPolicy = {
	/** Allow statements. Every action and resource not listed is denied. */
	statements?: Array<KernelApiKeyPolicyStatement> | null;
};

/** A condition narrows a policy statement to requests matching its constraint: the request attribute, a comparison operator, and that operator's values. */
export type KernelApiKeyPolicyCondition = {
	/** Request attribute the condition constrains. `source_ip` restricts the statement to requests whose client address falls inside one of `values`. */
	key?: string | null;
	/** Comparison the condition applies between the request attribute and values. */
	operator?: string | null;
	/** Values the request attribute must match. For `source_ip`, CIDR networks: a bare address without a mask is rejected, and so are an entry with host bits set and an IPv4 network written in IPv6 notation. */
	values?: Array<string> | null;
};

export type KernelApiKeyPolicyStatement = {
	/** Permitted action, such as browsers:use or vaults:read. */
	action?: string | null;
	/** Optional condition narrowing the statement to matching requests. A statement without a condition matches any request on its action and resource. */
	condition?: KernelApiKeyPolicyCondition | null;
	/** Resource the action applies to, in the format projects/{project_id}/{kind}/{id}. Wildcards are supported. */
	resource?: string | null;
};

export type KernelApiKeyPrincipal = {
	id?: string | null;
	type?: string | null;
};

/** An action available on the app */
export type KernelAppAction = {
	/** JSON Schema (draft-07) describing the expected input payload. Null if schema could not be automatically generated. */
	input_schema?: Record<string, KernelJsonValue> | null;
	/** Name of the action */
	name?: string | null;
	/** JSON Schema (draft-07) describing the expected output payload. Null if schema could not be automatically generated. */
	output_schema?: Record<string, KernelJsonValue> | null;
};

/** Summary of an application version. */
export type KernelAppVersionSummary = {
	/** List of actions available on the app */
	actions?: Array<KernelAppAction> | null;
	/** Name of the application */
	app_name?: string | null;
	/** Deployment ID */
	deployment?: string | null;
	/** Environment variables configured for this app version. Values are redacted for API key, OAuth, and managed-auth callers, which receive every key with an empty string value. Only dashboard sessions receive the actual values. */
	env_vars?: Record<string, string> | null;
	/** Unique identifier for the app version */
	id?: string | null;
	/** Deployment region code */
	region?: string | null;
	/** Version label for the application */
	version?: string | null;
};

export type KernelAuditLogEntry = {
	/** Authentication strategy used for the request. */
	auth_strategy?: string | null;
	/** Client IP address. */
	client_ip?: string | null;
	/** Request host. */
	domain?: string | null;
	/** Request duration in milliseconds. */
	duration_ms?: number | null;
	/** Email of the authenticated user at request time, if any. */
	email?: string | null;
	/** HTTP method. */
	method?: string | null;
	/** Request path. */
	path?: string | null;
	/** Matched API route pattern, if available. */
	route?: string | null;
	/** HTTP response status code. */
	status?: number | null;
	/** UTC time when the request was received. */
	timestamp?: string | null;
	/** User agent header. */
	user_agent?: string | null;
	/** ID of the authenticated user, if any. */
	user_id?: string | null;
};

/** An organization-scoped audit log export destination. Delivery is at-least-once for rows visible when their window is committed: a delivery that is retried rewrites the same object, and the same `event_id` can appear in more than one object, so consumers must deduplicate on `event_id`. Each… */
export type KernelAuditLogExportDestination = {
	bucket?: string | null;
	consecutive_failures?: number | null;
	created_at?: string | null;
	external_id?: string | null;
	format?: string | null;
	id?: string | null;
	/** The Kernel role that assumes `role_arn` in your account to deliver logs. Allow this role as the principal in your role's trust policy, and require `external_id` as the `sts:ExternalId` condition. Recreating a destination issues a new `external_id`, which the trust policy has to be updated to match. */
	kernel_role_arn?: string | null;
	kms_key_id?: string | null;
	/** Sanitized description of the most recent delivery failure. */
	last_error?: string | null;
	last_error_at?: string | null;
	/** Opaque, versioned checkpoint for forward-only continuous export. This value is not compatible with audit-log list page tokens. Delivery starts at the moment the destination is activated, so events recorded before that are not delivered. Pausing stops delivery and resuming starts again from the… */
	last_exported_cursor?: string | null;
	last_success_at?: string | null;
	next_attempt_at?: string | null;
	prefix?: string | null;
	region?: string | null;
	role_arn?: string | null;
	/** Pausing prevents new delivery attempts. An S3 upload already in progress may complete after the pause response; its rows can appear again after the destination is resumed. */
	status?: string | null;
	type?: string | null;
	updated_at?: string | null;
};

export type KernelAuditLogExportDestinationTestResult = {
	error?: {
		code?: string | null;
		message?: string | null;
	} | null;
	stage?: string | null;
	success?: boolean | null;
};

/** The identity and authorization context resolved for the current request. */
export type KernelAuthContext = {
	authentication?: KernelAuthContextAuthentication | null;
	authorization?: KernelAuthContextAuthorization | null;
	organization?: KernelAuthContextOrganization | null;
	principal?: KernelAuthContextPrincipal | null;
	workload_identity?: KernelAuthContextWorkloadIdentity | null;
};

export type KernelAuthContextAuthentication = {
	/** The API key ID when authenticated with an API key; null for session credentials. */
	credential_id?: string | null;
	/** The credential format used to authenticate the request. */
	method?: string | null;
	/** The source classification resolved by authentication middleware. */
	source?: string | null;
};

/** The credential's maximum scope and the effective scope selected for this request. Future permission data can be added without changing scope semantics. */
export type KernelAuthContextAuthorization = {
	credential_scope?: KernelAuthContextScope | null;
	/** Current effective paired policy for a service-account principal. Omitted for legacy human/client identities. */
	effective_policy?: KernelApiKeyPolicy | null;
	effective_scope?: KernelAuthContextScope | null;
};

export type KernelAuthContextOrganization = {
	/** The authenticated Kernel organization ID. */
	id?: string | null;
};

export type KernelAuthContextPrincipal = {
	/** The authenticated API key, user or organization-owned service-account ID. */
	id?: string | null;
	/** The kind of principal authenticated for the request. */
	type?: string | null;
};

/** A scope within the authenticated organization. A null project_id represents organization-wide scope. */
export type KernelAuthContextScope = {
	/** The Kernel project ID, or null when the scope is organization-wide. */
	project_id?: string | null;
};

export type KernelAuthContextWorkloadIdentity = {
	/** Digest of the verified external subject. Never the original assertion or arbitrary claims. */
	external_subject_digest?: string | null;
	federation_rule_id?: string | null;
	issuer_id?: string | null;
};

/** Live data that can currently be requested by passing its type to the item GET expand parameter. */
export type KernelAvailableVaultItemExpansion = {
	description?: string | null;
	type?: KernelVaultItemExpansionType | null;
};

/** An operation that is currently valid for this item. Read the description before invoking it through the item operations endpoint. */
export type KernelAvailableVaultItemOperation = {
	description?: string | null;
	type?: KernelVaultItemOperationType | null;
};

export type KernelBrowser = {
	/** Metro-API HTTP base URL for this browser session. */
	base_url?: string | null;
	/** Remote URL for live viewing the browser session. Only available for non-headless browsers. */
	browser_live_view_url?: string | null;
	captcha_solver?: KernelBrowserCaptchaSolver | null;
	/** Websocket URL for Chrome DevTools Protocol connections to the browser session */
	cdp_ws_url?: string | null;
	/** Custom Chrome enterprise policy overrides that were applied to this browser session, if any. Echoed back for verification. Keys are Chrome enterprise policy names. */
	chrome_policy?: Record<string, KernelJsonValue> | null;
	/** Provisional browser-session usage cost on GET detail responses. Omitted from list and other browser responses. */
	cost?: KernelBrowserCost | null;
	/** When the browser session was created. */
	created_at?: string | null;
	/** When the browser session was soft-deleted. Only present for deleted sessions. */
	deleted_at?: string | null;
	/** Fingerprint applied to this browser session. Omitted when the session was created without one. */
	fingerprint?: KernelBrowserFingerprint | null;
	/** Whether GPU acceleration is enabled for the browser session (only supported for headful sessions). */
	gpu?: boolean | null;
	/** Whether the browser session is running in headless mode. */
	headless?: boolean | null;
	/** Whether the browser session is running in kiosk mode. */
	kiosk_mode?: boolean | null;
	/** When the pooled browser session was last leased. Only present for leased pooled sessions. */
	leased_at?: string | null;
	/** Effective browser timezone and locale with per-field provenance. */
	location?: KernelBrowserLocation | null;
	/** Memory allocated to the browser session. */
	memory?: KernelBrowserMemory | null;
	/** Human-readable name of the browser session, if one was set at creation. */
	name?: string | null;
	/** Network configuration the session was created with, if any. Omitted when the session has no network configuration. */
	network?: KernelBrowserNetworkConfig | null;
	pool?: KernelBrowserPoolRef | null;
	profile?: KernelProfile | null;
	/** Whether changes made during this browser session are saved back to its profile when the session ends. Omitted when no profile is attached. */
	profile_save_changes?: boolean | null;
	/** Resolved proxy configuration for this browser session. */
	proxy?: KernelBrowserProxy | null;
	/** ID of the proxy associated with this browser session, if any. Deprecated in favor of proxy. */
	proxy_id?: string | null;
	/** Geographic region of the browser session. Fixed once the session is created. */
	region?: KernelRegion | null;
	/** Replay recording started by `start_replay` when this browser was created or acquired. Omitted otherwise; list replays with `GET /browsers/{id_or_name}/replays`. */
	replay?: KernelBrowserReplay | null;
	/** Unique identifier for the browser session */
	session_id?: string | null;
	/** URL the session was most recently asked to navigate to, if any. Recorded for debugging. Navigation is fire-and-forget — the URL is dispatched to the browser without waiting for it to load, and any errors (DNS failure, bad status, timeout) are silently dropped. Captures what was requested, not… */
	start_url?: string | null;
	/** Whether the browser session has CAPTCHA solving enabled, in which case proxy.mode=default uses Kernel's default stealth proxy. A browser created with only captcha_solver reports true with proxy.mode=direct. Deprecated in favor of captcha_solver and proxy. */
	stealth?: boolean | null;
	/** User-defined key-value tags that were set on this browser session, if any. Echoed back when present. */
	tags?: KernelTags | null;
	/** Active telemetry configuration for the session, if any. */
	telemetry?: KernelBrowserTelemetryConfig | null;
	/** The number of seconds of inactivity before the browser session is terminated. */
	timeout_seconds?: number | null;
	usage?: KernelBrowserUsage | null;
	usage_status?: KernelBrowserUsageStatus | null;
	/** Vaults linked when the browser session was created. */
	vaults?: Array<KernelVaultReference> | null;
	/** Video memory (VRAM) of the GPU browser session. Only present when gpu is true. */
	video_memory?: KernelBrowserVideoMemory | null;
	viewport?: KernelBrowserViewport | null;
	/** Websocket URL for WebDriver BiDi connections to the browser session */
	webdriver_ws_url?: string | null;
};

export type KernelBrowserAllowlistState = {
	/** Revision against which that mutation was accepted; reuse it when retrying the mutation. */
	base_revision?: string | null;
	/** ID of the last conditional allowlist update saved on this browser. */
	mutation_id?: string | null;
	/** Opaque revision to pass as network.expected_allowlist_revision on an update. */
	revision?: string | null;
};

/** An agent-driven HTTP call that drives the browser, handled by the in-VM API server. Calls that manage the VM instead emit platform_api_call. */
export type KernelBrowserApiCallEvent = {
	category?: string | null;
	data?: {
		/** Source submitted to the Playwright code-execution endpoint, capped at 8192 bytes like every other captured string. A capped value is cut on a character boundary and ends in `...[truncated]`. Absent for every other operation. */
		code?: string | null;
		/** Wall-clock duration of the handler in milliseconds. */
		duration_ms?: number | null;
		/** Matched route's operation, named as the in-VM API names its handler (e.g. ProcessExec, TakeScreenshot). */
		operation_id?: string | null;
		/** Per-request identifier from the in-VM API request middleware. */
		request_id?: string | null;
		/** HTTP response status code. */
		status?: number | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** CDP Runtime.StackTrace representing the JavaScript call stack at the time of an event. Fields use CDP naming conventions rather than snake_case to match the Chrome DevTools Protocol wire format. */
export type KernelBrowserCallStack = {
	/** Ordered list of call frames, outermost first. */
	callFrames?: Array<{
		/** Zero-based column number within the line. */
		columnNumber?: number | null;
		/** JavaScript function name, or empty string for anonymous functions. */
		functionName?: string | null;
		/** Zero-based line number within the script. */
		lineNumber?: number | null;
		/** CDP script identifier. */
		scriptId?: string | null;
		/** URL or name of the script file. */
		url?: string | null;
	}> | null;
	/** Optional label for the stack trace (e.g. async cause). */
	description?: string | null;
	/** Parent stack trace for async stacks. */
	parent?: KernelBrowserCallStack | null;
};

/** Opaque identifier shared by events for one visible challenge. An image-grid captcha may create multiple task_id values for one challenge_id. The same value may continue across a page reload when the challenge episode continues. It does not indicate task ordering or challenge completion. */
export type KernelBrowserCaptchaChallengeID = string;

/** A captcha challenge reached an observed or inferred terminal outcome. */
export type KernelBrowserCaptchaChallengeResultEvent = {
	category?: string | null;
	/** An observed challenge emits one outcome across any number of solver tasks. For eligible providers without a widget observer, each successful token task emits an inferred solved result instead; multiple such results may belong to one challenge. Failed tasks and image_challenge rounds produce no… */
	data?: {
		captcha_provider?: KernelBrowserCaptchaProvider | null;
		/** Deprecated: use captcha_provider. */
		captcha_type?: KernelBrowserCaptchaType | null;
		challenge_id?: KernelBrowserCaptchaChallengeID | null;
		/** Wall-clock duration from the challenge appearing to its terminal outcome, covering every solver attempt in between. For an inferred result, the duration of its solver task. */
		duration_ms?: number | null;
		/** True when the relay derived this result from a successful token task without observing the page. An inferred result has task_id instead of challenge_id. Absent on page-observed results. */
		inferred?: boolean | null;
		/** Terminal outcome of a challenge. solved: the page observed the challenge clear after a solver attempt, or an inferred result reports a token for the whole widget without page observation. failure: a terminal solver failure occurred, or all attempts ended while the challenge remained. timeout:… */
		status?: string | null;
		/** The task_id of the solver task an inferred result was derived from. Join on it to pair the result with that task's captcha_solve_started and captcha_solve_result. Present only when inferred is true. */
		task_id?: string | null;
		/** Host of the page where the challenge appeared. */
		website_host?: string | null;
		/** Path of the page where the challenge appeared. Query string excluded. */
		website_path?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Captcha product the challenge belongs to, not the service that solved it. Enterprise reCAPTCHA variants are grouped into their version bucket (recaptcha_v2 or recaptcha_v3), FunCaptcha uses arkose, press-and-hold challenges served by HUMAN (formerly PerimeterX) use human, and unlisted products,… */
export type KernelBrowserCaptchaProvider = string;

/** A captcha solve attempt reached a terminal outcome. */
export type KernelBrowserCaptchaSolveResultEvent = {
	category?: string | null;
	data?: {
		captcha_provider?: KernelBrowserCaptchaProvider | null;
		/** Deprecated: use captcha_provider and task_kind. */
		captcha_type?: KernelBrowserCaptchaType | null;
		challenge_id?: KernelBrowserCaptchaChallengeID | null;
		/** Wall-clock duration from solve start to terminal outcome. Authoritative solve timing; do not derive it from the gap to a captcha_solve_started event, whose delivery and ordering are not guaranteed. */
		duration_ms?: number | null;
		/** Solver-specific error code on failure (e.g. ERROR_CAPTCHA_UNSOLVABLE). Absent on success. */
		error_code?: string | null;
		/** Captured hCaptcha recognition media, when known. */
		media?: string | null;
		/** Terminal outcome. success: solver returned a usable solution. failure: solver returned an error (see error_code). timeout: solver did not return within the caller's wait budget. abandoned: caller cancelled or the page navigated away mid-solve. */
		status?: string | null;
		/** Opaque identifier shared with the matching captcha_solve_started. */
		task_id?: string | null;
		/** What the solver task produces. Absent when the producer cannot tell. */
		task_kind?: KernelBrowserCaptchaTaskKind | null;
		/** Host of the page where the captcha was solved. */
		website_host?: string | null;
		/** Path of the page where the captcha was solved. Query string excluded. */
		website_path?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A captcha solver accepted a task. */
export type KernelBrowserCaptchaSolveStartedEvent = {
	category?: string | null;
	/** Per-task payload. A visible challenge may create multiple tasks. When present, task_id correlates this event with a captcha_solve_result, while challenge_id groups tasks from the same challenge. Events may arrive out of order or be absent, so their arrival does not indicate current solve state. */
	data?: {
		captcha_provider?: KernelBrowserCaptchaProvider | null;
		/** Deprecated: use captcha_provider and task_kind. */
		captcha_type?: KernelBrowserCaptchaType | null;
		challenge_id?: KernelBrowserCaptchaChallengeID | null;
		/** Captured hCaptcha recognition media, when known. */
		media?: string | null;
		/** Opaque identifier shared with the matching captcha_solve_result. */
		task_id?: string | null;
		/** What the solver task produces. Absent when the producer cannot tell. */
		task_kind?: KernelBrowserCaptchaTaskKind | null;
		/** Host of the page where the captcha is being solved. May be empty for solver tasks that carry no page URL. */
		website_host?: string | null;
		/** Path of the page where the captcha is being solved. Query string excluded. */
		website_path?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Automatic CAPTCHA solving configuration. */
export type KernelBrowserCaptchaSolver = {
	/** Whether the browser automatically solves CAPTCHAs. */
	enabled?: boolean | null;
};

/** What a solver task produces. token: a single answer for the whole challenge, such as a widget's response token or a text captcha's text, so a successful task is the challenge's final answer. image_challenge: the answer to one image round (grid selection, point click, drag), after which the… */
export type KernelBrowserCaptchaTaskKind = string;

/** Captcha kind. Enterprise reCAPTCHA variants are grouped into their version bucket (recaptcha_v2 or recaptcha_v3), press-and-hold challenges use press_and_hold, and unlisted kinds use other. Its values are frozen: image rounds submitted as a plain ComplexImageTask report other, and press-and-hold… */
export type KernelBrowserCaptchaType = string;

/** Which kind of value autofill filled. Canonical values from devtools-protocol@2d019e73. */
export type KernelBrowserCdpAutofillMode = string;

/** Sanitized `Autofill.trigger` arguments. Canonical input: `Autofill.trigger` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpAutofillTriggerCommandData = {
	/** Number of address fields the command filled. Their names and values are never captured. */
	address_field_count?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Opaque backend node identifier of the field that was autofilled. */
	field_id?: number | null;
	/** Opaque frame identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	frame_id?: string | null;
	method?: string | null;
	/** What was filled: `card` or `address`. The values themselves are never captured. */
	mode?: KernelBrowserCdpAutofillMode | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Browser.cancelDownload` arguments. Canonical input: `Browser.cancelDownload` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpBrowserCancelDownloadCommandData = {
	/** Opaque browser context identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	browser_context_id?: string | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Opaque identifier of the download that was cancelled. Clipped to 128 characters; a longer value is not a real identifier. */
	download_guid?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Browser.close` arguments. Canonical input: `Browser.close` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or redacted… */
export type KernelBrowserCdpBrowserCloseCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Browser.setContentsSize` arguments. Canonical input: `Browser.setContentsSize` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpBrowserSetContentsSizeCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Contents height in DIP. */
	height?: number | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Contents width in DIP. */
	width?: number | null;
	/** Browser window identifier. */
	window_id?: number | null;
};

/** Sanitized `Browser.setWindowBounds` arguments. Canonical input: `Browser.setWindowBounds` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpBrowserSetWindowBoundsCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Window height in DIP. */
	height?: number | null;
	/** Window x position in screen coordinates. */
	left?: number | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Window y position in screen coordinates. */
	top?: number | null;
	/** Window width in DIP. */
	width?: number | null;
	/** Browser window identifier. */
	window_id?: number | null;
	/** Window state requested (`normal`, `minimized`, `maximized`, `fullscreen`). A value the protocol does not define is reported as `other`. */
	window_state?: KernelBrowserCdpWindowState | null;
};

/** A browser-control command a client sent over the CDP WebSocket proxy: input gestures, navigation, dialog handling, file selection and screenshots. Configuration commands and the DOM/Runtime traffic a client library issues on the caller's behalf are not reported. One event per browser-control… */
export type KernelBrowserCdpCommandEvent = {
	category?: string | null;
	data?: KernelBrowserCdpCommandEventData | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Per-command payload for `cdp_command` events, discriminated by `method`. Each variant carries only the arguments approved for that command: values that could hold a secret — typed and composition text, URLs, referrers, scripts, templates, file paths, drag contents and autofill values — are… */
export type KernelBrowserCdpCommandEventData =
	| KernelBrowserCdpInputDispatchMouseEventCommandData
	| KernelBrowserCdpInputDispatchKeyEventCommandData
	| KernelBrowserCdpInputInsertTextCommandData
	| KernelBrowserCdpInputImeSetCompositionCommandData
	| KernelBrowserCdpInputDispatchTouchEventCommandData
	| KernelBrowserCdpInputDispatchDragEventCommandData
	| KernelBrowserCdpInputCancelDraggingCommandData
	| KernelBrowserCdpInputEmulateTouchFromMouseEventCommandData
	| KernelBrowserCdpInputSynthesizePinchGestureCommandData
	| KernelBrowserCdpInputSynthesizeScrollGestureCommandData
	| KernelBrowserCdpInputSynthesizeTapGestureCommandData
	| KernelBrowserCdpDomSetFileInputFilesCommandData
	| KernelBrowserCdpDomFocusCommandData
	| KernelBrowserCdpDomScrollIntoViewIfNeededCommandData
	| KernelBrowserCdpPageBringToFrontCommandData
	| KernelBrowserCdpPageCaptureScreenshotCommandData
	| KernelBrowserCdpPageCaptureSnapshotCommandData
	| KernelBrowserCdpPageHandleJavaScriptDialogCommandData
	| KernelBrowserCdpPageNavigateCommandData
	| KernelBrowserCdpPageNavigateToHistoryEntryCommandData
	| KernelBrowserCdpPageReloadCommandData
	| KernelBrowserCdpPagePrintToPdfCommandData
	| KernelBrowserCdpPageStartScreencastCommandData
	| KernelBrowserCdpPageStopScreencastCommandData
	| KernelBrowserCdpPageStopLoadingCommandData
	| KernelBrowserCdpPageCloseCommandData
	| KernelBrowserCdpPageSetWebLifecycleStateCommandData
	| KernelBrowserCdpTargetActivateTargetCommandData
	| KernelBrowserCdpTargetCloseTargetCommandData
	| KernelBrowserCdpTargetCreateTargetCommandData
	| KernelBrowserCdpTargetCreateBrowserContextCommandData
	| KernelBrowserCdpTargetDisposeBrowserContextCommandData
	| KernelBrowserCdpTargetOpenDevToolsCommandData
	| KernelBrowserCdpBrowserCancelDownloadCommandData
	| KernelBrowserCdpBrowserCloseCommandData
	| KernelBrowserCdpBrowserSetWindowBoundsCommandData
	| KernelBrowserCdpBrowserSetContentsSizeCommandData
	| KernelBrowserCdpAutofillTriggerCommandData;

/** A browser-control CDP method the proxy reports. The set covers the commands an agent drives the browser with; configuration, DOM and Runtime bookkeeping, and Chrome-specific UI commands are outside it. Canonical definitions: devtools-protocol@2d019e73. */
export type KernelBrowserCdpCommandMethod = string;

/** An external client (e.g. customer SDK, Playwright, Puppeteer) connected to the CDP WebSocket proxy on this VM. */
export type KernelBrowserCdpConnectEvent = {
	category?: string | null;
	data?: {
		/** Identifies this CDP proxy connection, matching the connection_id on the cdp_command events that arrived on it. Two clients driving the same browser are told apart by this. */
		connection_id?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** An external client disconnected from the CDP WebSocket proxy on this VM. Pair with the immediately preceding cdp_connect on the same stream. */
export type KernelBrowserCdpDisconnectEvent = {
	category?: string | null;
	data?: {
		/** Identifies this CDP proxy connection, matching the connection_id on the cdp_command events that arrived on it. Two clients driving the same browser are told apart by this. */
		connection_id?: string | null;
		/** Wall-clock duration of the connection in milliseconds. */
		duration_ms?: number | null;
		/** Number of CDP messages relayed across the connection in either direction. */
		message_count?: number | null;
		/** Why the connection ended. client_close: the client initiated the close. upstream_changed: Chromium restarted mid-session and the proxy tore down so the client could reconnect against the new upstream. upstream_error: upstream dial or message pump errored. context_cancelled: the request context… */
		reason?: string | null;
		/** Number of forwarded client frames the classifier never saw, because it could not keep up or because classification failed. An upper bound on lost commands rather than a count: a saturated queue turns away whatever arrives next, which may be library traffic that would have produced no event.… */
		telemetry_dropped?: number | null;
		/** Number of forwarded client commands that produced no cdp_command event because their method is listed in control.cdp.excluded_methods. Configuration rather than loss, so it is counted apart from telemetry_dropped. */
		telemetry_excluded?: number | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Sanitized `DOM.focus` arguments. Canonical input: `DOM.focus` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or redacted decision… */
export type KernelBrowserCdpDomFocusCommandData = {
	/** Opaque backend DOM node identifier the command targeted. */
	backend_node_id?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** Opaque DOM node identifier the command targeted. */
	node_id?: number | null;
	/** Opaque Runtime remote object identifier the command targeted. Clipped to 128 characters; a longer value is not a real identifier. */
	object_id?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `DOM.scrollIntoViewIfNeeded` arguments. Canonical input: `DOM.scrollIntoViewIfNeeded` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command… */
export type KernelBrowserCdpDomScrollIntoViewIfNeededCommandData = {
	/** Opaque backend DOM node identifier the command targeted. */
	backend_node_id?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** Opaque DOM node identifier the command targeted. */
	node_id?: number | null;
	/** Opaque Runtime remote object identifier the command targeted. Clipped to 128 characters; a longer value is not a real identifier. */
	object_id?: string | null;
	/** Height of the rect the command scrolled to. */
	rect_height?: number | null;
	/** Width of the rect the command scrolled to. */
	rect_width?: number | null;
	/** X offset of the rect the command scrolled to, relative to the node. */
	rect_x?: number | null;
	/** Y offset of the rect the command scrolled to, relative to the node. */
	rect_y?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `DOM.setFileInputFiles` arguments. Canonical input: `DOM.setFileInputFiles` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpDomSetFileInputFilesCommandData = {
	/** Opaque backend DOM node identifier the command targeted. */
	backend_node_id?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Number of files handed to the input. File paths are never captured. */
	file_count?: number | null;
	method?: string | null;
	/** Opaque DOM node identifier the command targeted. */
	node_id?: number | null;
	/** Opaque Runtime remote object identifier the command targeted. Clipped to 128 characters; a longer value is not a real identifier. */
	object_id?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Drag event phase. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpDragEventType = string;

/** Top-level MIME category of a drag item, from the IANA registry rather than the protocol; a drag item's subtype names the file, so only the category is reported. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpDragMimeCategory = string;

/** Input source a synthesized gesture emulates. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpGestureSourceType = string;

/** Sanitized `Input.cancelDragging` arguments. Canonical input: `Input.cancelDragging` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpInputCancelDraggingCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Input.dispatchDragEvent` arguments. Canonical input: `Input.dispatchDragEvent` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpInputDispatchDragEventCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Number of files in the drag payload. File paths are never captured. */
	drag_file_count?: number | null;
	/** Number of items in the drag payload. Item contents are never captured. */
	drag_item_count?: number | null;
	/** Distinct top-level MIME categories of the drag items (e.g. `text`, `image`, `application`). Subtypes and contents are never captured. A value the protocol does not define is reported as `other`. */
	drag_mime_categories?: Array<KernelBrowserCdpDragMimeCategory> | null;
	/** Bit field of allowed drag operations (1=copy, 2=link, 16=move). */
	drag_operations_mask?: number | null;
	/** Drag event phase: `dragEnter`, `dragOver`, `drop` or `dragCancel`. A value the protocol does not define is reported as `other`. */
	event_type?: KernelBrowserCdpDragEventType | null;
	method?: string | null;
	/** Bit field of held modifier keys (1=Alt, 2=Ctrl, 4=Meta, 8=Shift). */
	modifiers?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
};

/** Sanitized `Input.dispatchKeyEvent` arguments. Canonical input: `Input.dispatchKeyEvent` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpInputDispatchKeyEventCommandData = {
	/** Whether the event was generated by key repeat. */
	auto_repeat?: boolean | null;
	/** Number of editing commands (e.g. `selectAll`) carried by the event. */
	command_count?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Key event phase: `keyDown`, `keyUp`, `rawKeyDown` or `char`. A value the protocol does not define is reported as `other`. */
	event_type?: KernelBrowserCdpKeyEventType | null;
	/** Whether the key is on the numeric keypad. */
	is_keypad?: boolean | null;
	/** Whether the event is a system key event. */
	is_system_key?: boolean | null;
	/** Keyboard location (1=left, 2=right, 3=numpad). */
	location?: number | null;
	method?: string | null;
	/** Bit field of held modifier keys (1=Alt, 2=Ctrl, 4=Meta, 8=Shift). */
	modifiers?: number | null;
	/** Key that commands the page rather than typing into it (e.g. `Enter`, `Tab`, `ArrowDown`, `F5`). Keys that produce a character are never captured; those are counted by `text_length`. */
	named_key?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Number of characters the command submitted. The text itself is never captured. */
	text_length?: number | null;
};

/** Sanitized `Input.dispatchMouseEvent` arguments. Canonical input: `Input.dispatchMouseEvent` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpInputDispatchMouseEventCommandData = {
	/** Button named by the command (`none`, `left`, `middle`, `right`, `back`, `forward`). A value the protocol does not define is reported as `other`. */
	button?: KernelBrowserCdpMouseButton | null;
	/** Bit field of buttons held down. Non-zero on a `mouseMoved` means the move is a drag path. */
	buttons?: number | null;
	/** Number of times the button was clicked (2 is a double click). */
	click_count?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Horizontal scroll delta, for `mouseWheel`. */
	delta_x?: number | null;
	/** Vertical scroll delta, for `mouseWheel`. */
	delta_y?: number | null;
	/** Mouse event phase: `mousePressed`, `mouseReleased`, `mouseMoved` or `mouseWheel`. A value the protocol does not define is reported as `other`. */
	event_type?: KernelBrowserCdpMouseEventType | null;
	/** Normalized pressure, 0 to 1. */
	force?: number | null;
	method?: string | null;
	/** Bit field of held modifier keys (1=Alt, 2=Ctrl, 4=Meta, 8=Shift). */
	modifiers?: number | null;
	/** Pointer that generated the event (`mouse` or `pen`). A value the protocol does not define is reported as `other`. */
	pointer_type?: KernelBrowserCdpPointerType | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Normalized tangential pressure, -1 to 1. */
	tangential_pressure?: number | null;
	/** Pen tilt from the Y-Z plane, in degrees. */
	tilt_x?: number | null;
	/** Pen tilt from the X-Z plane, in degrees. */
	tilt_y?: number | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Pen clockwise rotation, in degrees. */
	twist?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
};

/** Sanitized `Input.dispatchTouchEvent` arguments. Canonical input: `Input.dispatchTouchEvent` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpInputDispatchTouchEventCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Touch event phase: `touchStart`, `touchEnd`, `touchMove` or `touchCancel`. A value the protocol does not define is reported as `other`. */
	event_type?: KernelBrowserCdpTouchEventType | null;
	/** Normalized pressure of the first touch point, 0 to 1. */
	force?: number | null;
	method?: string | null;
	/** Bit field of held modifier keys (1=Alt, 2=Ctrl, 4=Meta, 8=Shift). */
	modifiers?: number | null;
	/** Horizontal radius of the first touch point. */
	radius_x?: number | null;
	/** Vertical radius of the first touch point. */
	radius_y?: number | null;
	/** Rotation of the first touch point, in degrees. */
	rotation_angle?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Normalized tangential pressure of the first touch point, -1 to 1. */
	tangential_pressure?: number | null;
	/** Tilt of the first touch point from the Y-Z plane, in degrees. */
	tilt_x?: number | null;
	/** Tilt of the first touch point from the X-Z plane, in degrees. */
	tilt_y?: number | null;
	/** Number of active touch points the command carried. */
	touch_point_count?: number | null;
	/** Viewport y coordinate of the first touch point. */
	y?: number | null;
	/** Clockwise rotation of the first touch point, in degrees. */
	twist?: number | null;
	/** Viewport x coordinate of the first touch point. Touch coordinates live inside `touchPoints`, so this is the primary point rather than a command-level argument. */
	x?: number | null;
};

/** Sanitized `Input.emulateTouchFromMouseEvent` arguments. Canonical input: `Input.emulateTouchFromMouseEvent` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of… */
export type KernelBrowserCdpInputEmulateTouchFromMouseEventCommandData = {
	/** Button named by the command. A value the protocol does not define is reported as `other`. */
	button?: KernelBrowserCdpMouseButton | null;
	/** Number of times the button was clicked. */
	click_count?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Horizontal scroll delta. */
	delta_x?: number | null;
	/** Vertical scroll delta. */
	delta_y?: number | null;
	/** Mouse event phase being emulated as touch. A value the protocol does not define is reported as `other`. */
	event_type?: KernelBrowserCdpMouseEventType | null;
	method?: string | null;
	/** Bit field of held modifier keys (1=Alt, 2=Ctrl, 4=Meta, 8=Shift). */
	modifiers?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
};

/** Sanitized `Input.imeSetComposition` arguments. Canonical input: `Input.imeSetComposition` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpInputImeSetCompositionCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** Replacement range end offset. */
	replacement_end?: number | null;
	/** Replacement range start offset. */
	replacement_start?: number | null;
	/** Selection end offset within the composition. */
	selection_end?: number | null;
	/** Selection start offset within the composition. */
	selection_start?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Number of characters in the composition. The text itself is never captured. */
	text_length?: number | null;
};

/** Sanitized `Input.insertText` arguments. Canonical input: `Input.insertText` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpInputInsertTextCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Number of characters inserted. The text itself is never captured. */
	text_length?: number | null;
};

/** Sanitized `Input.synthesizePinchGesture` arguments. Canonical input: `Input.synthesizePinchGesture` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this… */
export type KernelBrowserCdpInputSynthesizePinchGestureCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Input source the synthesized gesture emulates. A value the protocol does not define is reported as `other`. */
	gesture_source_type?: KernelBrowserCdpGestureSourceType | null;
	method?: string | null;
	/** Relative pointer speed, in pixels per second. */
	relative_speed?: number | null;
	/** Relative scale of the pinch (>1 zooms in). */
	scale_factor?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
};

/** Sanitized `Input.synthesizeScrollGesture` arguments. Canonical input: `Input.synthesizeScrollGesture` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this… */
export type KernelBrowserCdpInputSynthesizeScrollGestureCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Input source the synthesized gesture emulates. A value the protocol does not define is reported as `other`. */
	gesture_source_type?: KernelBrowserCdpGestureSourceType | null;
	method?: string | null;
	/** Whether fling was suppressed. */
	prevent_fling?: boolean | null;
	/** Number of additional repeats of the scroll. */
	repeat_count?: number | null;
	/** Delay between repeats, in milliseconds. */
	repeat_delay_ms?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Swipe speed in pixels per second. */
	speed?: number | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
	/** Horizontal scroll distance in CSS pixels; positive scrolls left. */
	x_distance?: number | null;
	/** Additional horizontal distance scrolled past the end. */
	x_overscroll?: number | null;
	/** Vertical scroll distance in CSS pixels; positive scrolls up. */
	y_distance?: number | null;
	/** Additional vertical distance scrolled past the end. */
	y_overscroll?: number | null;
};

/** Sanitized `Input.synthesizeTapGesture` arguments. Canonical input: `Input.synthesizeTapGesture` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command… */
export type KernelBrowserCdpInputSynthesizeTapGestureCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Duration between touchdown and touchup, in milliseconds. */
	duration?: number | null;
	/** Input source the synthesized gesture emulates. A value the protocol does not define is reported as `other`. */
	gesture_source_type?: KernelBrowserCdpGestureSourceType | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Number of times to tap (2 is a double tap). */
	tap_count?: number | null;
	/** Viewport y coordinate in CSS pixels. */
	y?: number | null;
	/** Viewport x coordinate in CSS pixels. */
	x?: number | null;
};

/** Key event phase. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpKeyEventType = string;

/** Mouse button named by a command. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpMouseButton = string;

/** Mouse event phase. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpMouseEventType = string;

/** Sanitized `Page.bringToFront` arguments. Canonical input: `Page.bringToFront` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpPageBringToFrontCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.captureScreenshot` arguments. Canonical input: `Page.captureScreenshot` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpPageCaptureScreenshotCommandData = {
	/** Whether the capture extended past the viewport. */
	capture_beyond_viewport?: boolean | null;
	/** Clip region height in CSS pixels. */
	clip_height?: number | null;
	/** Clip region page scale factor. */
	clip_scale?: number | null;
	/** Clip region width in CSS pixels. */
	clip_width?: number | null;
	/** Clip region x offset in CSS pixels. */
	clip_x?: number | null;
	/** Clip region y offset in CSS pixels. */
	clip_y?: number | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Image format requested (`jpeg`, `png` or `webp`). A value the protocol does not define is reported as `other`. */
	format?: KernelBrowserCdpScreenshotFormat | null;
	/** Whether the capture was taken from the surface rather than the view. */
	from_surface?: boolean | null;
	method?: string | null;
	/** Whether encoding favored speed over size. */
	optimize_for_speed?: boolean | null;
	/** Compression quality, 0 to 100, for lossy formats. */
	quality?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.captureSnapshot` arguments. Canonical input: `Page.captureSnapshot` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpPageCaptureSnapshotCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Snapshot format requested (`mhtml`). A value the protocol does not define is reported as `other`. */
	format?: KernelBrowserCdpSnapshotFormat | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.close` arguments. Canonical input: `Page.close` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or redacted… */
export type KernelBrowserCdpPageCloseCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.handleJavaScriptDialog` arguments. Canonical input: `Page.handleJavaScriptDialog` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command… */
export type KernelBrowserCdpPageHandleJavaScriptDialogCommandData = {
	/** Whether the dialog was accepted or dismissed. */
	accept?: boolean | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** Number of characters entered into a prompt dialog. The text itself is never captured. */
	prompt_text_length?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.navigate` arguments. Canonical input: `Page.navigate` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or redacted… */
export type KernelBrowserCdpPageNavigateCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Opaque frame identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	frame_id?: string | null;
	method?: string | null;
	/** Referrer policy named by the command. A value the protocol does not define is reported as `other`. */
	referrer_policy?: KernelBrowserCdpReferrerPolicy | null;
	/** Whether the command carried a referrer. The referrer itself is never captured. */
	referrer_present?: boolean | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Navigation reason reported by the caller (e.g. `link`, `typed`, `reload`). A value the protocol does not define is reported as `other`. */
	transition_type?: KernelBrowserCdpTransitionType | null;
	/** Scheme of the destination URL (e.g. `https`, `about`, `data`). The rest of the URL is never captured. */
	url_scheme?: string | null;
};

/** Sanitized `Page.navigateToHistoryEntry` arguments. Canonical input: `Page.navigateToHistoryEntry` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command… */
export type KernelBrowserCdpPageNavigateToHistoryEntryCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** History entry the command navigated to. */
	entry_id?: number | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.printToPDF` arguments. Canonical input: `Page.printToPDF` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpPagePrintToPdfCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Whether a header and footer were rendered. */
	display_header_footer?: boolean | null;
	/** Whether a footer template was supplied. The template itself is never captured. */
	footer_template_present?: boolean | null;
	/** Whether a document outline was embedded. */
	generate_document_outline?: boolean | null;
	/** Whether a tagged (accessible) PDF was requested. */
	generate_tagged_pdf?: boolean | null;
	/** Whether a header template was supplied. The template itself is never captured. */
	header_template_present?: boolean | null;
	/** Whether the page was laid out in landscape. */
	landscape?: boolean | null;
	/** Bottom margin in inches. */
	margin_bottom?: number | null;
	/** Left margin in inches. */
	margin_left?: number | null;
	/** Right margin in inches. */
	margin_right?: number | null;
	/** Top margin in inches. */
	margin_top?: number | null;
	method?: string | null;
	/** Whether a page range was supplied. */
	page_ranges_present?: boolean | null;
	/** Paper height in inches. */
	paper_height?: number | null;
	/** Paper width in inches. */
	paper_width?: number | null;
	/** Whether the CSS page size was preferred over the paper size. */
	prefer_css_page_size?: boolean | null;
	/** Whether background graphics were printed. */
	print_background?: boolean | null;
	/** Page render scale. */
	scale?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** How the PDF was returned (`ReturnAsBase64` or `ReturnAsStream`). A value the protocol does not define is reported as `other`. */
	transfer_mode?: KernelBrowserCdpPdfTransferMode | null;
};

/** Sanitized `Page.reload` arguments. Canonical input: `Page.reload` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or redacted… */
export type KernelBrowserCdpPageReloadCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Whether the reload bypassed the cache. */
	ignore_cache?: boolean | null;
	/** Opaque document loader identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	loader_id?: string | null;
	method?: string | null;
	/** Number of characters in the injected script. */
	script_length?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.setWebLifecycleState` arguments. Canonical input: `Page.setWebLifecycleState` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has… */
export type KernelBrowserCdpPageSetWebLifecycleStateCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Lifecycle state applied (`frozen` or `active`). A value the protocol does not define is reported as `other`. */
	state?: KernelBrowserCdpWebLifecycleState | null;
};

/** Sanitized `Page.startScreencast` arguments. Canonical input: `Page.startScreencast` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpPageStartScreencastCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Frame sampling interval. */
	every_nth_frame?: number | null;
	/** Frame format requested (`jpeg` or `png`). A value the protocol does not define is reported as `other`. */
	format?: KernelBrowserCdpScreencastFormat | null;
	/** Maximum frame height in pixels. */
	max_height?: number | null;
	/** Maximum frame width in pixels. */
	max_width?: number | null;
	method?: string | null;
	/** Compression quality, 0 to 100. */
	quality?: number | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.stopLoading` arguments. Canonical input: `Page.stopLoading` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpPageStopLoadingCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Page.stopScreencast` arguments. Canonical input: `Page.stopScreencast` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpPageStopScreencastCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** How a generated PDF is returned. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpPdfTransferMode = string;

/** Pointer that generated an input event. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpPointerType = string;

/** Referrer policy named by a navigation. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpReferrerPolicy = string;

/** Frame format requested for a screencast. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpScreencastFormat = string;

/** Image format requested for a screenshot. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpScreenshotFormat = string;

/** Format requested for a page snapshot. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpSnapshotFormat = string;

/** Sanitized `Target.activateTarget` arguments. Canonical input: `Target.activateTarget` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a… */
export type KernelBrowserCdpTargetActivateTargetCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Opaque target identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	target_id?: string | null;
};

/** Sanitized `Target.closeTarget` arguments. Canonical input: `Target.closeTarget` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained or… */
export type KernelBrowserCdpTargetCloseTargetCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Opaque target identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	target_id?: string | null;
};

/** Sanitized `Target.createBrowserContext` arguments. Canonical input: `Target.createBrowserContext` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command… */
export type KernelBrowserCdpTargetCreateBrowserContextCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Whether the context is disposed when the debugging session detaches. */
	dispose_on_detach?: boolean | null;
	method?: string | null;
	/** Whether a proxy bypass list was configured. */
	proxy_bypass_list_present?: boolean | null;
	/** Whether a proxy was configured. The proxy address is never captured. */
	proxy_server_present?: boolean | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Number of origins granted universal network access. The origins themselves are never captured. */
	universal_network_access_origin_count?: number | null;
};

/** Sanitized `Target.createTarget` arguments. Canonical input: `Target.createTarget` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpTargetCreateTargetCommandData = {
	/** Whether the target was created in the background. */
	background?: boolean | null;
	/** Opaque browser context identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	browser_context_id?: string | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	/** Whether BeginFrame control was enabled (headless only). */
	enable_begin_frame_control?: boolean | null;
	/** Whether the new target was focused. */
	focus?: boolean | null;
	/** Whether a tab target rather than a page target was created. */
	for_tab?: boolean | null;
	/** Window height in DIP. */
	height?: number | null;
	/** Whether the target was created hidden. */
	hidden?: boolean | null;
	/** Window x position in screen coordinates. */
	left?: number | null;
	method?: string | null;
	/** Whether a new window was requested. */
	new_window?: boolean | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Window y position in screen coordinates. */
	top?: number | null;
	/** Scheme of the destination URL (e.g. `https`, `about`, `data`). The rest of the URL is never captured. */
	url_scheme?: string | null;
	/** Window width in DIP. */
	width?: number | null;
	/** Window state requested (`normal`, `minimized`, `maximized`, `fullscreen`). A value the protocol does not define is reported as `other`. */
	window_state?: KernelBrowserCdpWindowState | null;
};

/** Sanitized `Target.disposeBrowserContext` arguments. Canonical input: `Target.disposeBrowserContext` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this… */
export type KernelBrowserCdpTargetDisposeBrowserContextCommandData = {
	/** Opaque browser context identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	browser_context_id?: string | null;
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
};

/** Sanitized `Target.openDevTools` arguments. Canonical input: `Target.openDevTools` in devtools-protocol@2d019e73, pinned at https://github.com/ChromeDevTools/devtools-protocol/blob/2d019e73eb371d1d6985d26d395d78bd8f8a22ba/json/browser_protocol.json. Every argument of this command has a retained… */
export type KernelBrowserCdpTargetOpenDevToolsCommandData = {
	/** The command's JSON-RPC id, so the command can be joined to the result the browser returned for it. Absent when the client sent none. */
	command_id?: number | null;
	/** Identifies the CDP proxy connection the command arrived on, matching `cdp_connect` and `cdp_disconnect`. Two clients driving the same browser are told apart by this. */
	connection_id?: string | null;
	method?: string | null;
	/** DevTools panel opened. Clipped to 128 characters; a longer value is not a real identifier. */
	panel_id?: string | null;
	/** CDP session identifier the command was addressed to. Absent for browser-level commands. Clipped to 128 characters. */
	session_id?: string | null;
	/** Opaque target identifier. Clipped to 128 characters; a longer value is not a real identifier. */
	target_id?: string | null;
};

/** Touch event phase. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpTouchEventType = string;

/** Navigation reason reported by the caller. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpTransitionType = string;

/** Page lifecycle state applied. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpWebLifecycleState = string;

/** Browser window state requested. Canonical values from devtools-protocol@2d019e73. `other` stands for a value outside that set, so a client cannot put an arbitrary string into the stream. */
export type KernelBrowserCdpWindowState = string;

/** A browser console error or uncaught JavaScript exception event. Emitted from two distinct CDP sources with different data shapes. Runtime.consoleAPICalled (console.error calls) produces level, text, args, and stack_trace. Runtime.exceptionThrown (uncaught exceptions) produces text, line, column,… */
export type KernelBrowserConsoleErrorEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** All console arguments coerced to strings. Present only when sourced from Runtime.consoleAPICalled. */
				args?: Array<string> | null;
				/** Column number in the script where the exception was thrown. Present only when sourced from Runtime.exceptionThrown. */
				column?: number | null;
				/** CDP console type value, always "error". Present only when sourced from Runtime.consoleAPICalled. */
				level?: string | null;
				/** Line number in the script where the exception was thrown. Present only when sourced from Runtime.exceptionThrown. */
				line?: number | null;
				/** URL of the script file that threw the exception. Present only when sourced from Runtime.exceptionThrown. */
				source_url?: string | null;
				stack_trace?: KernelBrowserCallStack | null;
				/** Human-readable error text, as the browser console would display it. For console.error() calls, the first argument coerced to a string. For uncaught exceptions, the prefix and error message, e.g. "Uncaught Error: boom" or "Uncaught (in promise) TypeError: x is not a function". */
				text?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser console log event (console.log, console.info, console.warn, etc.). */
export type KernelBrowserConsoleLogEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** All console arguments coerced to strings. */
				args?: Array<string> | null;
				/** CDP Runtime.consoleAPICalled type, passed through unfiltered from Chrome. error is routed to console_error events instead; all other CDP console types appear here. See CDP spec for the full enum. */
				level?: string | null;
				stack_trace?: KernelBrowserCallStack | null;
				/** First console argument coerced to string. */
				text?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

export type KernelBrowserCost = {
	/** Time of the live uptime read or durable billing checkpoint. A running or recently deleted session may accrue additional usage. */
	as_of?: string | null;
	/** Gross provisional USD browser-meter cost before credits, subscriptions, tax, and adjustments. Present only with provisional status, including zero for a completed zero-uptime session. Not an invoice total. */
	estimated_usage_spend_usd?: string | null;
	/** Pending means the billing checkpoint or rate calculation is not ready; unavailable means the session cannot currently be priced safely. */
	status?: string | null;
};

/** Structured response from the browser curl request. */
export type KernelBrowserCurlResult = {
	/** Response body (UTF-8 string or base64 depending on request). */
	body?: string | null;
	/** Total request duration in milliseconds. */
	duration_ms?: number | null;
	/** Response headers (multi-value). */
	headers?: Record<string, Array<string>> | null;
	/** HTTP status code from target. */
	status?: number | null;
};

/** Browser event context stamped by the browser monitor onto all CDP-sourced events. Identifies the target, frame, and navigation epoch in which the event occurred. */
export type KernelBrowserEventContext = {
	/** CDP frame identifier within the target. */
	frame_id?: string | null;
	/** CDP document loader identifier, reset on each navigation. */
	loader_id?: string | null;
	/** Monotonically increasing navigation sequence number, incremented on each top-level navigation within the target. */
	nav_seq?: number | null;
	/** CDP session identifier for the target connection. */
	session_id?: string | null;
	/** Browser target identifier (stable across navigations within a tab). */
	target_id?: string | null;
	target_type?: KernelBrowserTargetType | null;
	/** URL relevant to this event — page URL for navigation and page events, request URL for network events. */
	url?: string | null;
};

/** Provenance metadata identifying which producer emitted the event. */
export type KernelBrowserEventSource = {
	/** Producer-specific event name (e.g. Runtime.consoleAPICalled for CDP-sourced console events, Runtime.exceptionThrown for uncaught exceptions). */
	event?: string | null;
	/** Event producer. cdp: Chrome DevTools Protocol events from the browser. kernel_api: Kernel API server. extension: injected Chrome extension. local_process: system process running alongside the browser. */
	kind?: string | null;
	/** Producer-specific context (e.g. CDP target/session/frame IDs). */
	metadata?: Record<string, string> | null;
};

/** Extension selection for the browser session. Provide either id or name of an extension uploaded to Kernel. */
export type KernelBrowserExtension = {
	/** Extension ID to load for this browser session */
	id?: string | null;
	/** Extension name to load for this browser session (instead of id). Must be 1-255 characters, using letters, numbers, dots, underscores, or hyphens. */
	name?: string | null;
};

/** Overrides for browser attributes presented to websites. */
export type KernelBrowserFingerprint = {
	/** Operating system the browser reports to websites. */
	os?: string | null;
};

/** HTTP headers map forwarded as-is from CDP without normalization. Values are typically strings but may be any JSON type. */
export type KernelBrowserHttpHeaders = Record<string, KernelJsonValue>;

/** A browser user click event captured via injected page script. */
export type KernelBrowserInteractionClickEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** CSS selector path to the clicked element. */
				selector?: string | null;
				/** HTML tag name of the clicked element in uppercase (e.g. BUTTON, A, DIV). */
				tag?: string | null;
				/** Visible text content of the clicked element, trimmed. */
				text?: string | null;
				/** Viewport y-coordinate of the click in CSS pixels. */
				y?: number | null;
				/** Viewport x-coordinate of the click in CSS pixels. */
				x?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser keyboard event captured via injected page script. */
export type KernelBrowserInteractionKeyEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Key value from the KeyboardEvent (e.g. Enter, Backspace, a). */
				key?: string | null;
				/** CSS selector path to the element that had focus when the key was pressed. */
				selector?: string | null;
				/** HTML tag name of the focused element in uppercase (e.g. INPUT, TEXTAREA, DIV). */
				tag?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser scroll settled event emitted after scroll position stops changing, captured via injected page script. */
export type KernelBrowserInteractionScrollSettledEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Scroll x-position at the start of the scroll gesture in CSS pixels. */
				from_x?: number | null;
				/** Scroll y-position at the start of the scroll gesture in CSS pixels. */
				from_y?: number | null;
				/** CSS selector path to the scrolled element. */
				target_selector?: string | null;
				/** Final scroll x-position after the gesture settled in CSS pixels. */
				to_x?: number | null;
				/** Final scroll y-position after the gesture settled in CSS pixels. */
				to_y?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

export type KernelBrowserLiveView = {
	/** When the URL expires. Absent when it stays valid until the browser is deleted. */
	expires_at?: string | null;
	scope?: KernelBrowserLiveViewScope | null;
	/** Live view URL. Treat it as a credential. */
	url?: string | null;
};

/** A live view client connected to the headful browser's WebRTC server. Headful only; not emitted for headless images. */
export type KernelBrowserLiveViewConnectEvent = {
	category?: string | null;
	data?: {
		/** Live view session identifier. Stable across reconnects, so a transient network blip can emit two events with the same session_id. */
		session_id?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A live view client disconnected from the headful browser's WebRTC server. Pair with live_view_connect by session_id. */
export type KernelBrowserLiveViewDisconnectEvent = {
	category?: string | null;
	data?: {
		/** Wall-clock duration of the connection in milliseconds. */
		duration_ms?: number | null;
		/** Live view session identifier; matches the corresponding live_view_connect event. */
		session_id?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** `read` shows the browser without accepting input. `control` also lets the viewer drive the browser through the live view. */
export type KernelBrowserLiveViewScope = string;

export type KernelBrowserLocation = {
	/** Effective canonical BCP 47 formatting locale selected for the browser session. */
	locale?: string | null;
	locale_source?: KernelBrowserLocationSource | null;
	/** Effective IANA timezone selected for the browser session. */
	timezone?: string | null;
	timezone_source?: KernelBrowserLocationSource | null;
};

/** Where one effective browser location field came from. `override` is set explicitly on the session; `default` comes from the browser's region. */
export type KernelBrowserLocationSource = string;

/** Memory allocated to the browser session. */
export type KernelBrowserMemory = string;

/** The CDP connection to Chrome was lost. Telemetry events may be dropped until monitor_reconnected arrives. In-progress computed state is discarded rather than paused, so computed events still pending for the current navigation (network_idle, page_layout_settled, page_navigation_settled) never… */
export type KernelBrowserMonitorDisconnectedEvent = {
	category?: string | null;
	data?: {
		/** Reason for the disconnection. chrome_restarted: Chrome process restarted. */
		reason?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** The CDP session could not be initialized. */
export type KernelBrowserMonitorInitFailedEvent = {
	category?: string | null;
	data?: {
		/** The CDP method or initialization step that failed (e.g. Target.setAutoAttach). */
		step?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** The CDP connection to Chrome could not be re-established after exhausting all reconnection attempts. No further telemetry events will arrive on this session. */
export type KernelBrowserMonitorReconnectFailedEvent = {
	category?: string | null;
	data?: {
		/** Reason for the reconnection failure. reconnect_exhausted: all retry attempts were used up without successfully restoring the CDP connection. */
		reason?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** The CDP connection to Chrome was successfully re-established after a disconnection. Events emitted during the gap are lost. Computed state is reset, so navigation and network tracking restart fresh from this point. */
export type KernelBrowserMonitorReconnectedEvent = {
	category?: string | null;
	data?: {
		/** Wall-clock time in milliseconds taken to reconnect after the disconnection. */
		reconnect_duration_ms?: number | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A periodic screenshot of the browser viewport. */
export type KernelBrowserMonitorScreenshotEvent = {
	category?: string | null;
	data?: {
		/** Base64-encoded PNG screenshot of the browser viewport. */
		png?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Network configuration for a browser session or browser pool. */
export type KernelBrowserNetworkConfig = {
	/** Egress allowlist for a browser session: the only destinations the browser may reach through Kernel-managed egress. Any other destination is refused with a 403 whose X-Kernel-Proxy-Error header is network_policy_denied, so pages cannot load or send data to unlisted hosts, including with fetch()… */
	allowed_hosts?: Array<string> | null;
	/** Concurrency metadata for a browser's saved allowlist configuration. Browser pools omit it. This remains present after removal so an uncertain removal can be retried. It does not prove proxy or VM application completed. Do not include it in creation or pool updates. */
	allowlist_state?: KernelBrowserAllowlistState | null;
	/** Destinations the browser reaches directly through the session's own network instead of through Kernel-managed egress — for private hosts reachable over a VPN or tunnel the session has joined (e.g. a Tailscale tailnet). By default, private IP ranges already route directly: RFC1918 (10.0.0.0/8,… */
	private_hosts?: Array<string> | null;
	/** Per-destination proxy routes for a browser session. A destination hostname is matched against every route's hosts, regardless of port; route order does not matter. An exact hostname beats a wildcard, and a longer wildcard suffix beats a shorter one (for a.b.example.com: "a.b.example.com" >… */
	proxy_routes?: Array<KernelBrowserProxyRoute> | null;
};

/** A browser network idle event emitted after a 500ms quiet period with no in-flight HTTP requests. */
export type KernelBrowserNetworkIdleEvent = {
	category?: string | null;
	data?: KernelBrowserEventContext | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser network loading failed event. If the request was already in flight when CDP attached (no prior network_request was emitted for it), url, frame_id, loader_id, and resource_type are absent; BrowserEventContext is partially populated in that case. */
export type KernelBrowserNetworkLoadingFailedEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** True if the request was canceled by the browser or page script. */
				canceled?: boolean | null;
				/** Network error description (e.g. net::ERR_CONNECTION_REFUSED). */
				error_text?: string | null;
				/** CDP request identifier matching the originating network_request event. */
				request_id?: string | null;
				/** CDP Network.ResourceType for the request, passed through as-is from Chrome. Known values include Document, Fetch, XHR, Script, Stylesheet, Image, Media, Font, TextTrack, EventSource, WebSocket, Manifest, Prefetch, Other, and more. */
				resource_type?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser network request sent event. */
export type KernelBrowserNetworkRequestEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** URL of the document that initiated the request. */
				document_url?: string | null;
				/** Request headers. */
				headers?: KernelBrowserHttpHeaders | null;
				/** CDP Initiator.type indicating what caused the request, passed through as-is from Chrome. Known values include script, parser, preload, and other. */
				initiator_type?: string | null;
				/** True if this request is the result of a redirect. */
				is_redirect?: boolean | null;
				/** HTTP method as sent on the wire (e.g. GET, POST). */
				method?: string | null;
				/** Request body for POST/PUT requests, if available. */
				post_data?: string | null;
				/** Original URL before the redirect, present when is_redirect is true. */
				redirect_url?: string | null;
				/** CDP request identifier, unique within the session. */
				request_id?: string | null;
				/** CDP Network.ResourceType for the request, passed through as-is from Chrome. Known values include Document, Fetch, XHR, Script, Stylesheet, Image, Media, Font, TextTrack, EventSource, WebSocket, Manifest, Prefetch, Other, and more. */
				resource_type?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser network response received event. Fired after the response body is fully received, not when headers arrive. */
export type KernelBrowserNetworkResponseEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Truncated response body, present only for text MIME types. */
				body?: string | null;
				/** Response headers. */
				headers?: KernelBrowserHttpHeaders | null;
				/** HTTP method of the original request. */
				method?: string | null;
				/** MIME type of the response (e.g. text/html, application/json). */
				mime_type?: string | null;
				/** CDP request identifier matching the originating network_request event. */
				request_id?: string | null;
				/** CDP Network.ResourceType for the request, passed through as-is from Chrome. Known values include Document, Fetch, XHR, Script, Stylesheet, Image, Media, Font, TextTrack, EventSource, WebSocket, Manifest, Prefetch, Other, and more. */
				resource_type?: string | null;
				/** HTTP response status code. */
				status?: number | null;
				/** HTTP response status text (e.g. OK, Not Found). */
				status_text?: string | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A page's renderer process crashed (an "Aw, Snap!" failure) while the browser process itself stayed alive. Reported on the crashed page's session, with the session and target ids on `source.metadata`. Captured only while the `page` category is enabled. */
export type KernelBrowserPageCrashedEvent = {
	category?: string | null;
	data?: {
		/** CDP target identifier of the crashed page. */
		target_id?: string | null;
		target_type?: KernelBrowserTargetType | null;
		/** URL the page was on when its renderer process crashed. */
		url?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser DOMContentLoaded event (CDP Page.domContentEventFired). */
export type KernelBrowserPageDomContentLoadedEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Chrome monotonic clock value in seconds at which DOMContentLoaded fired, relative to browser process start (not Unix epoch). Use ts for wall-clock time. */
				cdp_timestamp?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser layout settled event emitted 1 second after page load with no intervening layout shifts, indicating visual stability. Each layout shift resets the 1-second timer. */
export type KernelBrowserPageLayoutSettledEvent = {
	category?: string | null;
	data?: KernelBrowserEventContext | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser cumulative layout shift (CLS) event from the Performance Timeline API. */
export type KernelBrowserPageLayoutShiftEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Duration of the layout shift entry in milliseconds (always 0 for layout shifts per spec). */
				duration?: number | null;
				/** PerformanceLayoutShift attributes from the Performance Timeline entry. */
				layout_shift_details?: {
					/** True if the layout shift was preceded by user input within 500ms, excluding it from CLS. */
					had_recent_input?: boolean | null;
					/** Layout shift score for this entry (contribution to CLS). */
					value?: number | null;
				} | null;
				/** CDP frame identifier of the frame where the layout shift occurred. */
				source_frame_id?: string | null;
				/** Performance Timeline timestamp of the layout shift in milliseconds. */
				time?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser Largest Contentful Paint (LCP) event from the Performance Timeline API. */
export type KernelBrowserPageLcpEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** LargestContentfulPaint attributes from the Performance Timeline entry. */
				lcp_details?: {
					/** id attribute of the LCP element, if present. */
					element_id?: string | null;
					/** Load time of the LCP element in milliseconds. */
					load_time?: number | null;
					/** CDP DOM node identifier of the LCP element. */
					node_id?: number | null;
					/** Render time of the LCP element in milliseconds; 0 for cross-origin images without Timing-Allow-Origin. */
					render_time?: number | null;
					/** Visible area of the LCP element in pixels squared. */
					size?: number | null;
					/** URL of the LCP element for image or video elements. */
					url?: string | null;
				} | null;
				/** CDP frame identifier of the frame where the LCP element was rendered. */
				source_frame_id?: string | null;
				/** Performance Timeline timestamp of the LCP entry in milliseconds. */
				time?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser page load event (CDP Page.loadEventFired). */
export type KernelBrowserPageLoadEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Chrome monotonic clock value in seconds at which the load event fired, relative to browser process start (not Unix epoch). Use ts for wall-clock time. */
				cdp_timestamp?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser page navigation started event (CDP Page.frameNavigated). Carries nav context fields inline but not nav_seq, as this event resets the navigation epoch. */
export type KernelBrowserPageNavigationEvent = {
	category?: string | null;
	data?: {
		/** CDP frame identifier of the navigated frame. */
		frame_id?: string | null;
		/** New CDP document loader identifier assigned for this navigation. */
		loader_id?: string | null;
		/** Parent frame identifier for subframe navigations; absent for top-level navigations. */
		parent_frame_id?: string | null;
		/** CDP session identifier. */
		session_id?: string | null;
		/** Browser target identifier. */
		target_id?: string | null;
		target_type?: KernelBrowserTargetType | null;
		/** URL navigated to. */
		url?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Emitted when page_dom_content_loaded and page_layout_settled have both fired for the same navigation, indicating the page is loaded and visually stable. Independent of network_idle; a single pending request does not block it. */
export type KernelBrowserPageNavigationSettledEvent = {
	category?: string | null;
	data?: KernelBrowserEventContext | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A new browser tab or target was opened (CDP Target.attachedToTarget for page targets). Fires before a CDP session is attached to the new target, so session_id, frame_id, loader_id, and nav_seq are absent; this event does not compose BrowserEventContext. Consumers reading context fields… */
export type KernelBrowserPageTabOpenedEvent = {
	category?: string | null;
	data?: {
		/** Target identifier of the tab that opened this one, if any. */
		opener_id?: string | null;
		/** CDP target identifier for the newly opened tab. */
		target_id?: string | null;
		target_type?: KernelBrowserTargetType | null;
		/** Initial page title of the new tab. */
		title?: string | null;
		/** Initial URL of the new tab. */
		url?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** An HTTP call that manages the browser VM rather than driving the browser, handled by the in-VM API server — recording lifecycle, filesystem and process management, telemetry and browser configuration. Mostly platform-induced (e.g. profile save, replay capture) rather than agent actions. */
export type KernelBrowserPlatformApiCallEvent = {
	category?: string | null;
	data?: {
		/** Wall-clock duration of the handler in milliseconds. */
		duration_ms?: number | null;
		/** Matched route's operation, named as the in-VM API names its handler (e.g. ProcessExec, StartRecording). */
		operation_id?: string | null;
		/** Per-request identifier from the in-VM API request middleware. */
		request_id?: string | null;
		/** HTTP response status code. */
		status?: number | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** A browser pool containing multiple identically configured browsers. */
export type KernelBrowserPool = {
	/** Number of browsers currently acquired from the pool */
	acquired_count?: number | null;
	/** Number of browsers currently available in the pool */
	available_count?: number | null;
	/** Configuration used to create all browsers in this pool */
	browser_pool_config?: KernelBrowserPoolConfig | null;
	/** Timestamp when the browser pool was created */
	created_at?: string | null;
	/** Resolved extension IDs attached to the pool, in configured load order. Empty when no extensions are attached. Authoritative for programmatic consumers; the extensions inside `browser_pool_config` reflect the configured selector (echoed as sent on create). */
	extension_ids?: Array<string> | null;
	/** Unique identifier for the browser pool */
	id?: string | null;
	/** Browser pool name, if set */
	name?: string | null;
	/** Resolved profile ID the pool is attached to. Omitted when no profile is attached. Authoritative for programmatic consumers; the profile inside `browser_pool_config` reflects the configured selector (echoed as sent on create). */
	profile_id?: string | null;
	/** Geographic region of the browser pool. Fixed once the pool is created. */
	region?: KernelRegion | null;
};

/** Effective browser pool configuration returned by the API. */
export type KernelBrowserPoolConfig = {
	captcha_solver?: KernelBrowserCaptchaSolver | null;
	/** Custom Chrome enterprise policy overrides applied to all browsers in this pool. Keys are Chrome enterprise policy names; values must match their expected types. Blocked: kernel-managed policies (extensions, proxy, CDP/automation). See https://chromeenterprise.google/policies/ The serialized JSON… */
	chrome_policy?: Record<string, KernelJsonValue> | null;
	/** List of browser extensions to load into the session. Provide each by id or name. */
	extensions?: Array<KernelBrowserExtension> | null;
	/** Percentage of the pool to fill per minute. The cap is 25 for most organizations but can be raised per-organization, so only the lower bound is enforced here. */
	fill_rate_per_minute?: number | null;
	/** If true, launches the browser using a headless image. */
	headless?: boolean | null;
	/** If true, launches the browser in kiosk mode to hide address bar and tabs in live view. */
	kiosk_mode?: boolean | null;
	/** Memory allocated to newly-warmed browsers in this pool. */
	memory?: KernelBrowserMemory | null;
	/** Optional name for the browser pool. Must be unique within the project. */
	name?: string | null;
	/** Network configuration applied to browsers in this pool, if any. Omitted when the pool has no network configuration. */
	network?: KernelBrowserNetworkConfig | null;
	/** Profile selection for browsers in the pool. */
	profile?: KernelBrowserPoolProfile | null;
	/** Optional proxy associated to the browser session. References a proxy in the same project as the browser session. */
	proxy_id?: string | null;
	/** When true, flush idle browsers when the profile the pool uses is updated, so pool browsers pick up the latest profile data. When a profile is provided during creation, this defaults to true. Requires a profile to be set on the pool. */
	refresh_on_profile_update?: boolean | null;
	/** Number of browsers maintained in the pool. The maximum size is determined by your organization's pooled sessions limit (the sum of all pool sizes cannot exceed your limit). */
	size?: number | null;
	/** Start replay recording automatically when a browser is acquired from this pool. */
	start_replay?: boolean | null;
	/** Optional URL to navigate to when a new browser is warmed into the pool. Best-effort: failures to navigate do not fail pool fill. Only applied to newly-warmed browsers; browsers reused via release/acquire keep whatever URL the previous lease left them on. Accepts any URL Chromium can resolve,… */
	start_url?: string | null;
	/** Whether browsers in this pool use stealth mode, which is CAPTCHA solving with Kernel's default stealth proxy unless proxy_id is set. A pool with only captcha_solver enabled reports false. Deprecated in favor of captcha_solver and proxy_id. */
	stealth?: boolean | null;
	/** Active telemetry configuration applied to browsers warmed into this pool, if any. */
	telemetry?: KernelBrowserTelemetryConfig | null;
	/** Default idle timeout in seconds for browsers acquired from this pool before they are destroyed. Minimum 10, maximum 259200 (72 hours). */
	timeout_seconds?: number | null;
	/** Browser viewport used for newly-warmed browsers in this pool. */
	viewport?: KernelBrowserViewport | null;
};

/** Profile configuration for browsers in a pool. Provide either id or name. Profiles must be created beforehand. Unlike single browser sessions, pools load the profile read-only and never persist changes back to it, so save_changes is omitted here. Any save_changes value sent on a pool profile is… */
export type KernelBrowserPoolProfile = {
	/** Profile ID to load for browsers in this pool */
	id?: string | null;
	/** Profile name to load for browsers in this pool (instead of id). Must be 1-255 characters, using letters, numbers, dots, underscores, or hyphens. */
	name?: string | null;
};

/** Browser pool this session was acquired from, if any. */
export type KernelBrowserPoolRef = {
	/** Browser pool ID */
	id?: string | null;
	/** Browser pool name, if set */
	name?: string | null;
};

/** Resolved proxy configuration for a browser session. Selected proxies are returned by stable ID. */
export type KernelBrowserProxy = {
	/** Selected proxy ID. */
	id?: string | null;
	mode?: KernelBrowserProxyMode | null;
	/** Selected proxy name. */
	name?: string | null;
};

/** Browser proxy configuration. Provide exactly one of mode, id, or name; an empty object is invalid. Set mode to direct for no proxy. Set mode to default to use Kernel's default stealth proxy for browsers with CAPTCHA solving enabled, including stealth browsers, or direct egress otherwise. Select… */
export type KernelBrowserProxyConfig = {
	/** Proxy ID. */
	id?: string | null;
	mode?: KernelBrowserProxyMode | null;
	/** Proxy name. Must match exactly one active proxy in the project. */
	name?: string | null;
};

/** A branded proxy-layer failure observed by the browser. Emitted when the metro egress host-proxy serves a branded error page whose response carries the X-Kernel-Proxy-Error header: a 502 for proxy-layer failures, or a 403 when the session's network policy blocks the destination. Low-volume and… */
export type KernelBrowserProxyErrorEvent = {
	category?: string | null;
	data?:
		| (KernelBrowserEventContext & {
				/** Proxy-layer error code: the X-Kernel-Proxy-Error response header value from a branded error page served by the metro egress host-proxy. Values mirror what the proxy emits: destination_blocked, destination_route_unavailable, network_policy_denied, provider_blacklisted, provider_unreachable,… */
				code?: string | null;
				/** HTTP method of the failed request, when known. */
				method?: string | null;
				/** Sanitized X-Kernel-Proxy-Error header value, present only when code is unknown. Surrounding whitespace is removed, the value is lowercased, characters outside [a-z0-9_] are replaced with _, and the result is truncated to at most 64 characters. */
				raw_code?: string | null;
				/** CDP request identifier matching the originating request. */
				request_id?: string | null;
				/** CDP Network.ResourceType for the request, when known. */
				resource_type?: string | null;
				/** HTTP response status of the branded error page (502, or 403 for network_policy_denied). */
				status?: number | null;
		  })
		| null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** Proxy egress mode. direct forces no proxy. default uses Kernel's default stealth proxy for browsers with CAPTCHA solving enabled, including stealth browsers, or direct egress otherwise. default is primarily useful on browser update to restore the browser default after selected-proxy egress. */
export type KernelBrowserProxyMode = string;

export type KernelBrowserProxyRoute = {
	/** Exact hostnames or leading *. wildcard patterns (subdomains only); patterns cannot include ports, and matching ignores the destination port. Hosts not matched by any route use the session's top-level proxy (or the browser default when proxy is omitted). */
	hosts?: Array<string> | null;
	proxy?: KernelBrowserProxyRouteTarget | null;
};

/** Select an active non-direct proxy by ID or name. Responses always use ID. */
export type KernelBrowserProxyRouteTarget = {
	id?: string | null;
	name?: string | null;
};

/** Ordered discriminated union of Browser REPL output items. */
export type KernelBrowserReplContent =
	| KernelBrowserReplTextContent
	| KernelBrowserReplImageContent;

export type KernelBrowserReplImageContent = {
	data_b64?: string | null;
	mime_type?: string | null;
	type?: string | null;
};

/** Result of Browser REPL code execution. */
export type KernelBrowserReplResult = {
	/** Optional ordered text/image output produced by the execution. */
	content?: Array<KernelBrowserReplContent> | null;
	/** True if text or image output was dropped or truncated due to response limits. */
	content_truncated?: boolean | null;
	/** Wall-clock execution time in milliseconds. */
	duration_ms?: number | null;
	/** Error message if execution failed. */
	error?: string | null;
	/** CUID2 identifying the exact state-holding REPL process used for this execution. Stable across calls and Chromium reconnects; changes after an API restart, explicit reset, execution timeout, or REPL crash. */
	repl_id?: string | null;
	/** True if the REPL identified by `repl_id` was terminated by this request. The next request lazily starts a fresh REPL with a new `repl_id`. */
	repl_terminated?: boolean | null;
	/** Stack trace if execution failed. */
	stack?: string | null;
	/** Whether the code executed successfully. */
	success?: boolean | null;
};

export type KernelBrowserReplTextContent = {
	/** `write` is emitted by `repl.write`; `stdout` and `stderr` are emitted by console methods. */
	channel?: string | null;
	text?: string | null;
	type?: string | null;
};

/** Information about a browser replay recording. */
export type KernelBrowserReplay = {
	/** Timestamp when replay finished */
	finished_at?: string | null;
	/** Unique identifier for the replay recording. */
	replay_id?: string | null;
	/** URL for viewing the replay recording. */
	replay_view_url?: string | null;
	/** Timestamp when replay started */
	started_at?: string | null;
};

/** A managed service exited unexpectedly. Intentional stops do not produce this event; only unexpected exits and terminal restart-give-up transitions do. */
export type KernelBrowserServiceCrashedEvent = {
	category?: string | null;
	data?: {
		/** Lifecycle phase the crash occurred in. startup: the process died before reaching a healthy running state. running: a previously healthy process died unexpectedly. gave_up: the process manager exhausted its restart attempts and stopped trying. */
		phase?: string | null;
		/** PID of the crashed process. Absent when the process manager gave up after exhausting restart attempts. */
		pid?: number | null;
		/** Program name of the crashed service (e.g. chromium, mutter, kernel-images-api). */
		service_name?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** The Linux kernel OOM-killer terminated a process inside the VM. Fires for any process killed by the kernel due to memory exhaustion, including Chrome renderer subprocesses that are not supervised. */
export type KernelBrowserSystemOomKillEvent = {
	category?: string | null;
	data?: {
		/** Why the kernel decided to OOM-kill. none means global memory exhaustion; memcg means a cgroup memory limit was hit; cpuset / memory_policy are NUMA/policy-driven kills. Absent on kernels older than 5.0. */
		constraint?: string | null;
		/** Free system memory in KiB at the time of the kill. Assumes a 4 KiB page size. Does not include reclaimable caches. Absent if the kernel did not emit a parseable Mem-Info section. */
		mem_free_kb?: number | null;
		/** Total system memory in KiB at the time of the kill. Assumes a 4 KiB page size. Absent if the kernel did not emit a parseable Mem-Info section. */
		mem_total_kb?: number | null;
		/** PID of the killed process. */
		pid?: number | null;
		/** Comm of the killed process as reported by the kernel (max 15 chars, truncated by the kernel). */
		process_name?: string | null;
		/** Resident set size of the killed process in KiB (sum of anon-rss, file-rss, and shmem-rss). */
		rss_kb?: number | null;
		/** Top processes by resident-set-size at the moment of the kill, sorted descending. Empty if the kernel did not emit the Tasks state table. Capped at 5 entries. */
		top_tasks?: Array<{
			/** Comm of the process (max 15 chars, truncated by the kernel). */
			name?: string | null;
			/** PID of the process. */
			pid?: number | null;
			/** Resident set size in KiB at the moment of the kill. */
			rss_kb?: number | null;
		}> | null;
		/** PID of the triggering process. Absent if the kernel did not emit the standard header line. */
		trigger_pid?: number | null;
		/** Comm of the process whose allocation request caused the kernel to invoke the OOM-killer. Often the same as process_name but can differ. Max 15 chars. */
		trigger_process_name?: string | null;
	} | null;
	source?: KernelBrowserEventSource | null;
	/** True if the data field was truncated due to size limits. */
	truncated?: boolean | null;
	/** Event timestamp in Unix microseconds. */
	ts?: number | null;
	type?: string | null;
};

/** CDP target type of the page that produced the event. */
export type KernelBrowserTargetType = string;

/** Per-category telemetry capture settings layered onto the default set. The operational signals (control, connection, system, captcha) are on by default and are opt-out: set one to enabled=false to stop capturing it. The CDP categories (console, network, page, interaction), screenshot and platform… */
export type KernelBrowserTelemetryCategoriesConfig = {
	/** Captcha solver tasks and visible challenge outcomes. On by default. */
	captcha?: KernelBrowserTelemetryCategoryConfig | null;
	/** Client attach/detach lifecycle for the CDP proxy and live view. On by default. */
	connection?: KernelBrowserTelemetryCategoryConfig | null;
	/** Console output (log, warn, error) and uncaught exceptions. CDP category; off by default. */
	console?: KernelBrowserTelemetryCategoryConfig | null;
	/** Agent-driven actions against the browser — computer-control calls, Playwright code execution, screenshots, clipboard access, and browser-control commands sent over the CDP proxy. On by default. */
	control?: KernelBrowserTelemetryControlConfig | null;
	/** User interaction events including clicks, keydowns, and scroll-settled events. CDP category; off by default. */
	interaction?: KernelBrowserTelemetryCategoryConfig | null;
	/** HTTP request and response metadata including URL, method, status code, and timing. Request post data is forwarded as-is from CDP. Text response bodies are truncated at 8 KB for structured types (JSON, XML, form data) and 4 KB for other text types. Binary responses (images, fonts, media) are… */
	network?: KernelBrowserTelemetryCategoryConfig | null;
	/** Page lifecycle events including navigation, DOMContentLoaded, load, layout shifts, and LCP. CDP category; off by default. */
	page?: KernelBrowserTelemetryCategoryConfig | null;
	/** In-VM API calls that manage the browser VM rather than drive the browser (recording, filesystem, process, telemetry and browser configuration). Mostly platform-induced; off by default and must be opted into. */
	platform?: KernelBrowserTelemetryCategoryConfig | null;
	/** Periodic base64-encoded viewport screenshots. High volume; off by default and must be opted into. */
	screenshot?: KernelBrowserTelemetryCategoryConfig | null;
	/** Browser VM health, such as out-of-memory kills and managed-service crashes. On by default. */
	system?: KernelBrowserTelemetryCategoryConfig | null;
};

/** Per-category telemetry configuration. */
export type KernelBrowserTelemetryCategoryConfig = {
	/** Whether this category is captured. Operational categories (control, connection, system, captcha) default to true; set false to opt out. CDP categories (console, network, page, interaction), screenshot and platform default to false; set true to opt in. */
	enabled?: boolean | null;
};

/** Settings for the cdp_command events the CDP proxy reports. */
export type KernelBrowserTelemetryCdpControlConfig = {
	/** Methods to leave out of the cdp_command stream. Omit the list to keep the current one; send an empty list to report every supported method again. Exclusion is a telemetry setting only: an excluded command is still relayed to the browser unchanged, it simply produces no event. Use it to drop the… */
	excluded_methods?: Array<KernelBrowserCdpCommandMethod> | null;
};

/** Active telemetry configuration for a browser session. */
export type KernelBrowserTelemetryConfig = {
	/** Per-category enable/disable flags. */
	browser?: KernelBrowserTelemetryCategoriesConfig | null;
	/** Where the session's captured telemetry is being exported. Omitted when the export state is unknown. */
	export?: KernelBrowserTelemetryExportConfig | null;
	/** Whether the session's captured telemetry is persisted to Kernel storage. Omitted for browsers created before this setting existed, which persist it. */
	storage?: KernelBrowserTelemetryStorageConfig | null;
};

/** Configuration for the control category. Same enabled semantics as any other category, plus settings for the browser-control commands the CDP proxy reports. */
export type KernelBrowserTelemetryControlConfig = {
	/** Settings for the cdp_command events the CDP proxy reports. Merged independently of enabled, so a later update that only sets enabled keeps the current exclusion list. */
	cdp?: KernelBrowserTelemetryCdpControlConfig | null;
	/** Whether this category is captured. Control is on by default; set false to opt out. */
	enabled?: boolean | null;
};

/** Union type representing any browser telemetry event. Discriminated on `type`. Each event's `category` determines when it is captured. The CDP collector-health events (monitor_disconnected, monitor_reconnected, monitor_reconnect_failed, monitor_init_failed) use the `monitor` category, which is… */
export type KernelBrowserTelemetryEvent =
	| KernelBrowserConsoleLogEvent
	| KernelBrowserConsoleErrorEvent
	| KernelBrowserNetworkRequestEvent
	| KernelBrowserNetworkResponseEvent
	| KernelBrowserNetworkLoadingFailedEvent
	| KernelBrowserNetworkIdleEvent
	| KernelBrowserProxyErrorEvent
	| KernelBrowserPageNavigationEvent
	| KernelBrowserPageDomContentLoadedEvent
	| KernelBrowserPageLoadEvent
	| KernelBrowserPageTabOpenedEvent
	| KernelBrowserPageCrashedEvent
	| KernelBrowserPageLayoutShiftEvent
	| KernelBrowserPageLcpEvent
	| KernelBrowserPageLayoutSettledEvent
	| KernelBrowserPageNavigationSettledEvent
	| KernelBrowserInteractionClickEvent
	| KernelBrowserInteractionKeyEvent
	| KernelBrowserInteractionScrollSettledEvent
	| KernelBrowserMonitorScreenshotEvent
	| KernelBrowserMonitorDisconnectedEvent
	| KernelBrowserMonitorReconnectedEvent
	| KernelBrowserMonitorReconnectFailedEvent
	| KernelBrowserMonitorInitFailedEvent
	| KernelBrowserApiCallEvent
	| KernelBrowserPlatformApiCallEvent
	| KernelBrowserCdpCommandEvent
	| KernelBrowserCdpConnectEvent
	| KernelBrowserCdpDisconnectEvent
	| KernelBrowserLiveViewConnectEvent
	| KernelBrowserLiveViewDisconnectEvent
	| KernelBrowserCaptchaSolveStartedEvent
	| KernelBrowserCaptchaSolveResultEvent
	| KernelBrowserCaptchaChallengeResultEvent
	| KernelBrowserSystemOomKillEvent
	| KernelBrowserServiceCrashedEvent;

/** Envelope wrapping a browser telemetry event with its monotonic sequence number. Each SSE data: frame carries one envelope as JSON. The seq value is also emitted as the SSE id: field so clients can pass it as Last-Event-ID on reconnect. */
export type KernelBrowserTelemetryEventEnvelope = {
	event?: KernelBrowserTelemetryEvent | null;
	/** Process-monotonic sequence number assigned by the browser VM. Pass as Last-Event-ID on reconnect to resume without gaps. Gaps in received seq values indicate dropped events. */
	seq?: number | null;
};

/** Active export state for a session's captured telemetry, by protocol. */
export type KernelBrowserTelemetryExportConfig = {
	/** Active OTLP export state. */
	otlp?: KernelBrowserTelemetryOTLPExportConfig | null;
};

/** Export destinations for a session's captured telemetry, by protocol. Honored when creating a browser, including the browser a managed auth connection creates for a login. Browser pools do not support export and reject it; on a browser update it is ignored, so the session keeps the destination it… */
export type KernelBrowserTelemetryExportRequestConfig = {
	/** Export captured telemetry over OTLP to one of the org's configured destinations. */
	otlp?: KernelBrowserTelemetryOTLPExportRequestConfig | null;
};

/** Active OTLP export state for a browser session. */
export type KernelBrowserTelemetryOTLPExportConfig = {
	/** ID of the OTLP destination the session is bound to. Omitted when the session is not exporting. */
	destination?: string | null;
	/** Whether the session is exporting captured telemetry over OTLP. */
	enabled?: boolean | null;
};

/** OTLP export settings for a browser session. */
export type KernelBrowserTelemetryOTLPExportRequestConfig = {
	/** OTLP destination to export this session's captured telemetry to. Provide either id or name. Requires telemetry capture to be enabled. */
	destination?: KernelOTLPDestinationRef | null;
	/** Whether to export captured telemetry over OTLP. Setting destination implies enabled=true, so this only needs to be set explicitly to disable export (enabled=false with a destination is rejected). */
	enabled?: boolean | null;
};

/** Telemetry request configuration for a browser session. */
export type KernelBrowserTelemetryRequestConfig = {
	/** Per-category capture flags. The operational categories (control, connection, system, captcha) are captured whenever telemetry is enabled; set one to enabled=false to opt out. The CDP categories (console, network, page, interaction), screenshot and platform are off by default; set enabled=true to… */
	browser?: KernelBrowserTelemetryCategoriesConfig | null;
	/** Request shortcut for browser telemetry capture. True enables capture; with no browser category settings it captures the default set (control, connection, system, captcha), and any browser category settings are layered onto that default set. On update, enabled=true resolves the config fresh from… */
	enabled?: boolean | null;
	/** Where to export this session's captured telemetry. Omit to capture without exporting. */
	export?: KernelBrowserTelemetryExportRequestConfig | null;
	/** Whether to persist this session's captured telemetry to Kernel storage. */
	storage?: KernelBrowserTelemetryStorageRequestConfig | null;
};

/** Kernel storage state for a session's captured telemetry. */
export type KernelBrowserTelemetryStorageConfig = {
	/** Whether captured telemetry is persisted to Kernel storage. When off, the session's events are only available on the live stream and through any configured export. */
	enabled?: boolean | null;
};

/** Kernel storage settings for a session's captured telemetry. */
export type KernelBrowserTelemetryStorageRequestConfig = {
	/** Whether captured telemetry is persisted to Kernel storage. Defaults to true. Setting false requires an OTLP destination and cannot be changed after the browser is created. */
	enabled?: boolean | null;
};

/** Session usage metrics. */
export type KernelBrowserUsage = {
	/** Time in milliseconds the session was actively running. */
	uptime_ms?: number | null;
};

/** Whether final usage billing is still pending or complete. Only present for deleted sessions. */
export type KernelBrowserUsageStatus = string;

/** Video memory (VRAM) of a GPU browser session. 3GiB sessions have 4 vCPU and 6GiB memory. 6GiB sessions have 8 vCPU and 12GiB memory. 2GiB and 4GiB are deprecated aliases for 3GiB and 6GiB: they are accepted on create and never returned. */
export type KernelBrowserVideoMemory = string;

/** Initial browser window size in pixels with optional refresh rate. If omitted, image defaults apply (1920x1080@25). For GPU images, the default is 1920x1080@60. Arbitrary viewport dimensions and refresh rates are accepted. Known-good presets include: 2560x1440@10, 1920x1080@25, 1920x1200@25,… */
export type KernelBrowserViewport = {
	/** Browser window height in pixels. Any positive integer is accepted; headful browsers require at least 64. */
	height?: number | null;
	/** Display refresh rate in Hz. Any positive integer is accepted; if omitted, GPU browsers default to 60 and other browsers derive it from width and height. */
	refresh_rate?: number | null;
	/** Browser window width in pixels. Any positive integer is accepted; headful browsers require at least 64. */
	width?: number | null;
};

export type KernelCardEnrollmentAction = {
	/** Secret bearer capability for embedded card capture with @onkernel/vault-react. Present only for Kernel wallets; never for AgentCard. Treat it like the enrollment URL and do not log or persist it in browser storage. */
	capture_token?: string | null;
	name?: string | null;
	url?: string | null;
};

export type KernelCardVaultItem = {
	action?: KernelVaultItemAction | null;
	available_expansions?: Array<KernelAvailableVaultItemExpansion> | null;
	available_operations?: Array<KernelAvailableVaultItemOperation> | null;
	created_at?: string | null;
	expires_at?: string | null;
	id?: string | null;
	/** Immutable item key assigned when the item is created. */
	key?: string | null;
	spec?: KernelCardVaultItemSpec | null;
	state?: KernelCardVaultItemState | null;
	type?: string | null;
	updated_at?: string | null;
};

export type KernelCardVaultItemSpec =
	| KernelLinkCardVaultItemSpec
	| KernelAgentCardCardVaultItemSpec
	| KernelKernelCardVaultItemSpec
	| KernelShopPayCardVaultItemSpec
	| KernelVgsCardVaultItemSpec;

export type KernelCardVaultItemState =
	| KernelLinkCardState
	| KernelAgentCardCardState
	| KernelKernelCardState
	| KernelShopPayCardState
	| KernelVgsCardState;

export type KernelClipboardContent = {
	/** Current clipboard text content */
	text?: string | null;
};

export type KernelCollectAction = {
	name?: string | null;
};

export type KernelConfigRegistryAnalysis = {
	/** Time the analysis was created. */
	created_at?: string | null;
	/** Deadline after which a still-running analysis becomes expired. */
	expires_at?: string | null;
	/** Present for failed, canceled, or expired analyses. Messages contain safe retry guidance rather than internal workflow errors. */
	failure?: KernelError | null;
	/** Time the analysis reached a terminal status. Null while it is running. */
	finished_at?: string | null;
	/** Discovery run ID used to poll analysis status. */
	id?: string | null;
	/** The workload description supplied for this analysis. Null when the analysis only tested connectivity. */
	intent?: string | null;
	status?: KernelConfigRegistryAnalysisStatus | null;
};

/** Lifecycle status of a background analysis. */
export type KernelConfigRegistryAnalysisStatus = string;

export type KernelConfigRegistryAnalysisSummary = {
	analysis?: KernelConfigRegistryAnalysis | null;
	target?: KernelConfigRegistryTarget | null;
};

/** Browser settings that can be passed directly to `POST /browsers`. */
export type KernelConfigRegistryBrowser = {
	gpu?: boolean | null;
	headless?: boolean | null;
	stealth?: boolean | null;
	viewport?: KernelBrowserViewport | null;
};

/** Direct egress recipe. Pass `{ "mode": "direct" }` as the browser's `proxy`. */
export type KernelConfigRegistryDirectProxy = {
	mode?: string | null;
};

export type KernelConfigRegistryEvidence = {
	accessed?: number | null;
	blocked?: number | null;
	inconclusive?: number | null;
	/** Most recent contributing observation. Recommendations remain eligible regardless of age and can be returned while a new analysis refreshes them. */
	last_observed_at?: string | null;
	/** Most recent contributing run whose evidence supported recommending this configuration. Omitted when no individual run independently met the recommendation threshold. */
	last_supported_at?: string | null;
	run_count?: number | null;
	/** Number of judged trials. */
	sample_size?: number | null;
	/** Accessed trials divided by judged trials. Inconclusive trials are excluded. */
	success_rate?: number | null;
};

export type KernelConfigRegistryLookupResponse = {
	/** Short advisory markdown to facilitate navigating this target. Returned even when no configuration reached the target, since knowing what prevented success is useful without a configuration. Not verified against this target. Null when nothing applicable was observed or no notes exist. */
	guidance?: string | null;
	/** Recommendation or structured no-recommendation result from current knowledge. Only the proxy_restricted code is reported here. Null for every other outcome, including a target analyzed without a working configuration. */
	recommendation?: KernelConfigRegistryRecommendationResult | null;
	target?: KernelConfigRegistryTarget | null;
	/** Working configurations for the target, ordered with the recommended configuration first. */
	working_configurations?: Array<KernelConfigRegistryRecommendation> | null;
};

/** Managed proxy recipe. `create` is a non-idempotent `POST /proxies` payload: create the resource once, retain its ID, and reuse that ID as the browser's `proxy.id`. Do not submit this recipe before every browser session. */
export type KernelConfigRegistryManagedProxy = {
	create?: KernelProxyCreateRequest | null;
	mode?: string | null;
};

export type KernelConfigRegistryNoRecommendation = {
	/** Machine-readable reason Kernel cannot currently provide a config recommendation. */
	code?: string | null;
	/** Human-readable explanation suitable for display. */
	message?: string | null;
	type?: string | null;
};

/** Proxy recipe for the recommended browser. */
export type KernelConfigRegistryProxy =
	| KernelConfigRegistryDirectProxy
	| KernelConfigRegistryManagedProxy;

export type KernelConfigRegistryRecommendation = {
	browser?: KernelConfigRegistryBrowser | null;
	evidence?: KernelConfigRegistryEvidence | null;
	/** Specificity of knowledge matched for this recommendation. Exact matches use knowledge for the requested target; host and domain matches use broader fallback knowledge. */
	match_scope?: string | null;
	/** Target value that supplied the recommendation. */
	matched_target?: string | null;
	proxy?: KernelConfigRegistryProxy | null;
	type?: string | null;
};

/** A recommendation or a structured no-recommendation result. */
export type KernelConfigRegistryRecommendationResult =
	| KernelConfigRegistryRecommendation
	| KernelConfigRegistryNoRecommendation;

export type KernelConfigRegistryRecommendationSummary = {
	/** ID of the most recently requested analysis for this exact target. */
	analysis_id?: string | null;
	/** Lifecycle status of the most recently requested analysis for this exact target. */
	analysis_status?: KernelConfigRegistryAnalysisStatus | null;
	/** Most recent time the selected project requested an analysis for this exact target. */
	last_requested_at?: string | null;
	/** Recommendation produced by the latest analysis. Null when that analysis did not produce one. */
	recommendation?: KernelConfigRegistryRecommendation | null;
	/** Display label for the recommended browser configuration. */
	recommended_config_label?: string | null;
	/** Success rate for the recommended configuration. Null when the latest analysis did not produce one. */
	success_rate?: number | null;
	/** Normalized exact target previously analyzed by the selected project, including scheme, host, port, and path. */
	target?: string | null;
};

export type KernelConfigRegistryResponse = {
	/** Pollable analysis after workflow submission is acknowledged. Null when no refresh was submitted. */
	analysis?: KernelConfigRegistryAnalysis | null;
	/** Short advisory markdown to facilitate navigating this target. Returned even when no configuration reached the target, since knowing what prevented success is useful without a configuration. Not verified against this target. Null when nothing applicable was observed or no notes exist. */
	guidance?: string | null;
	/** Recommendation or structured no-recommendation result for a completed analysis. Null before the analysis produces an outcome. */
	recommendation?: KernelConfigRegistryRecommendationResult | null;
	target?: KernelConfigRegistryTarget | null;
	/** Working configurations for the target, ordered with the recommended configuration first. */
	working_configurations?: Array<KernelConfigRegistryRecommendation> | null;
	/** How far the workload pass got, when an intent was supplied and a pass ran. A run outcome rather than advice, so it is reported whether or not any guidance could be assembled. Null when no intent was supplied or no pass ran. */
	workload_outcome?: string | null;
};

export type KernelConfigRegistryTarget = {
	/** Registrable domain. */
	domain?: string | null;
	/** Full hostname, including subdomain. */
	host?: string | null;
	/** Exact normalized scheme, host, port, and path used for lookup. */
	normalized?: string | null;
};

/** Configuration for a custom proxy (e.g., private proxy server). */
export type KernelCreateCustomProxyConfig = {
	/** PEM-encoded CA certificate bundle the proxy re-signs upstream TLS with. Provide when the proxy terminates TLS (MITM) so the browser trusts its certificates. May contain multiple concatenated certificates. */
	ca_bundle?: string | null;
	/** Proxy host address or IP. */
	host?: string | null;
	/** Password for proxy authentication. */
	password?: string | null;
	/** Proxy port. */
	port?: number | null;
	/** Username for proxy authentication. */
	username?: string | null;
};

/** API key returned immediately after creation. Includes the plaintext key once. */
export type KernelCreatedApiKey = KernelApiKey & {
	/** Plaintext API key. Only returned once when the key is created. */
	key?: string | null;
};

/** A stored credential for automatic re-authentication */
export type KernelCredential = {
	/** When the credential was created */
	created_at?: string | null;
	/** Target domain this credential is for */
	domain?: string | null;
	/** Whether this credential has a TOTP secret configured for automatic 2FA */
	has_totp_secret?: boolean | null;
	/** Whether this credential has stored values (email, password, etc.) */
	has_values?: boolean | null;
	/** Unique identifier for the credential */
	id?: string | null;
	/** Unique name for the credential within the project */
	name?: string | null;
	/** If set, indicates this credential should be used with the specified SSO provider (e.g., google, github, microsoft). When the target site has a matching SSO button, it will be clicked first before filling credential values on the identity provider's login page. */
	sso_provider?: string | null;
	/** HMAC algorithm used to generate TOTP codes. Defaults to SHA1 for credentials created before this metadata was stored. */
	totp_algorithm?: string | null;
	/** Current TOTP code. Only included in create/update responses when totp_secret was just set. */
	totp_code?: string | null;
	/** When the totp_code expires. Only included when totp_code is present. */
	totp_code_expires_at?: string | null;
	/** Number of digits in generated TOTP codes. Defaults to 6 for credentials created before this metadata was stored. */
	totp_digits?: number | null;
	/** TOTP rotation period in seconds. Defaults to 30 for credentials created before this metadata was stored. */
	totp_period?: number | null;
	/** When the credential was last updated */
	updated_at?: string | null;
	/** The field names stored in this credential's values (e.g., username, password). Values themselves are never returned. Included on single-credential responses (create, get by id or name, update); omitted from list responses. */
	value_keys?: Array<string> | null;
};

export type KernelCredentialAccountVaultItem = {
	action?: KernelOnePasswordOAuthAction | null;
	available_expansions?: Array<KernelAvailableVaultItemExpansion> | null;
	/** Advertises 1pw_recover when Kernel can recover a failed account link. Recovery is unavailable while authorization is pending or after the connection has already been reset. */
	available_operations?: Array<KernelAvailableVaultItemOperation> | null;
	created_at?: string | null;
	expires_at?: string | null;
	id?: string | null;
	/** Immutable item key assigned when the item is created. */
	key?: string | null;
	spec?: KernelOnePasswordCredentialAccountSpec | null;
	state?: KernelOnePasswordCredentialAccountState | null;
	type?: string | null;
	updated_at?: string | null;
};

/** One schema-derived form for the item, available in ready or pending_collection state. Render every form-supported field as editable; omit totp and passkey fields and preserve their stored values. Prefill non-sensitive values, and allow existing sensitive values to be preserved or replaced… */
export type KernelCredentialCollectionAction = {
	/** Expiry of the Kernel-hosted collection link (30 minutes after issuance). */
	expires_at?: string | null;
	name?: string | null;
	/** Time-scoped hosted form URL (vault.kernel.sh in production). Open this URL as returned; treat it as a secret. */
	url?: string | null;
};

/** An external credential provider (e.g., 1Password) for automatic credential lookup */
export type KernelCredentialProvider = {
	/** When the credential provider was created */
	created_at?: string | null;
	/** Whether the provider is enabled for credential lookups */
	enabled?: boolean | null;
	/** Unique identifier for the credential provider */
	id?: string | null;
	/** Human-readable name for this provider instance */
	name?: string | null;
	/** Priority order for credential lookups (lower numbers are checked first) */
	priority?: number | null;
	/** Type of credential provider */
	provider_type?: string | null;
	/** When the credential provider was last updated */
	updated_at?: string | null;
};

/** A credential item from an external provider (e.g., a 1Password login item) */
export type KernelCredentialProviderItem = {
	/** Unique identifier for the item within the provider */
	id?: string | null;
	/** Path to reference this item (VaultName/ItemTitle format) */
	path?: string | null;
	/** Display name of the credential item */
	title?: string | null;
	/** URLs associated with this credential */
	urls?: Array<string> | null;
	/** ID of the vault containing this item */
	vault_id?: string | null;
	/** Name of the vault containing this item */
	vault_name?: string | null;
};

/** Result of testing a credential provider connection */
export type KernelCredentialProviderTestResult = {
	/** Error message if the test failed */
	error?: string | null;
	/** Whether the connection test was successful */
	success?: boolean | null;
	/** List of vaults accessible by the service account */
	vaults?: Array<{
		/** Vault ID */
		id?: string | null;
		/** Vault name */
		name?: string | null;
	}> | null;
};

/** Reference to credentials for the auth connection. Use one of: - { name } for Kernel credentials - { provider, path } for external provider item - { provider, auto: true } for external provider domain lookup */
export type KernelCredentialReference = {
	/** If true, lookup by domain from the specified provider */
	auto?: boolean | null;
	/** Kernel credential name */
	name?: string | null;
	/** Provider-specific path (e.g., "VaultName/ItemName" for 1Password) */
	path?: string | null;
	/** External provider name (e.g., "my-1p") */
	provider?: string | null;
};

export type KernelCredentialVaultFieldDefinition = {
	/** Optional human-readable display label. It is returned as non-secret metadata and never affects value keys, updates, or browser fills. Use single-line, trimmed display text without control or formatting characters. The server enforces a 128-byte UTF-8 limit. */
	label?: string | null;
	/** Stable field name used to key values, updates, and browser fills. */
	name?: string | null;
	/** Whether a nonempty value is required for readiness and form submission. */
	required?: boolean | null;
	/** Whether the value is omitted from every item response. Reserve true for secrets such as passwords, API tokens, and TOTP seeds. Ordinary usernames and email addresses should be false so the form can display and prefill them. */
	sensitive?: boolean | null;
	type?: KernelCredentialVaultFieldType | null;
};

export type KernelCredentialVaultFieldState = {
	has_value?: boolean | null;
	/** Present exactly when has_value is true and the field is not sensitive. Reflects the latest developer or human edit. For totp, has_value indicates a stored seed; neither the seed nor a generated code is returned. */
	value?: string | null;
};

/** Text, email, and password have form inputs; totp and passkey do not and are omitted from both Kernel-hosted and customer React forms. Password, totp, and passkey must be sensitive. A totp value is an RFC 4648 Base32 generator seed (case-insensitive, optional trailing padding), not an otpauth URI… */
export type KernelCredentialVaultFieldType = string;

export type KernelCredentialVaultItem = {
	action?: KernelCredentialVaultItemAction | null;
	available_expansions?: Array<KernelAvailableVaultItemExpansion> | null;
	/** Kernel credentials advertise collect and fill when eligible. 1Password credentials advertise 1pw_create_access_request until a request is made, 1pw_access_request_status while its approval is pending (and 1pw_create_access_request again once the 3-minute status-check window has passed), and… */
	available_operations?: Array<KernelAvailableVaultItemOperation> | null;
	created_at?: string | null;
	id?: string | null;
	/** Immutable item key assigned when the item is created. */
	key?: string | null;
	spec?: KernelCredentialVaultItemSpec | null;
	state?: KernelCredentialVaultItemState | null;
	type?: string | null;
	updated_at?: string | null;
	/** Starts at 1 and increments on PATCH and successful hosted submission, but not collection-link renewal. Managed auth credentials stay at 1; changes to the underlying credential are read at fill time and do not change the version. */
	version?: number | null;
};

export type KernelCredentialVaultItemAction =
	| KernelCredentialCollectionAction
	| KernelOnePasswordAccessApprovalAction;

export type KernelCredentialVaultItemSpec =
	| KernelKernelCredentialVaultItemSpec
	| KernelOnePasswordCredentialVaultItemSpec
	| KernelManagedAuthCredentialVaultItemSpec;

export type KernelCredentialVaultItemState =
	| KernelKernelCredentialVaultItemState
	| KernelOnePasswordCredentialVaultItemState
	| KernelManagedAuthCredentialVaultItemState;

/** Configuration for a custom proxy (e.g., private proxy server). */
export type KernelCustomProxyConfig = {
	/** Whether the proxy has a custom CA bundle configured. */
	has_ca_bundle?: boolean | null;
	/** Whether the proxy has a password. */
	has_password?: boolean | null;
	/** Proxy host address or IP. */
	host?: string | null;
	/** Proxy port. */
	port?: number | null;
	/** Username for proxy authentication. */
	username?: string | null;
};

export type KernelCustomWebMCPDefinition = {
	id?: string | null;
	kind?: string | null;
	match?: KernelCustomWebMCPMatch | null;
	namespace?: string | null;
	tool?: KernelWebMCPToolMetadata | null;
};

export type KernelCustomWebMCPMatch = {
	url_patterns?: Array<string> | null;
};

export type KernelCustomWebMCPToolsResponse = {
	tools?: Array<KernelCustomWebMCPDefinition> | null;
};

export type KernelCustomerManagedOAuthClient = {
	provider_config?: KernelVaultProviderConfigReference | null;
	type?: string | null;
};

/** Configuration for a deprecated datacenter proxy. Use an ISP proxy instead. */
export type KernelDatacenterProxyConfig = {
	/** ISO 3166 country code. Defaults to US if not provided. */
	country?: string | null;
};

/** Deployment record information. */
export type KernelDeployment = {
	/** Timestamp when the deployment was created */
	created_at?: string | null;
	/** Relative path to the application entrypoint */
	entrypoint_rel_path?: string | null;
	/** Environment variables configured for this deployment. Values are redacted for API key, OAuth, and managed-auth callers, which receive every key with an empty string value. Only dashboard sessions receive the actual values. */
	env_vars?: Record<string, string> | null;
	/** Unique identifier for the deployment */
	id?: string | null;
	/** Deployment region code */
	region?: string | null;
	/** Hex-encoded SHA-256 checksum of the source archive. For file uploads, this hashes the uploaded archive; for GitHub-sourced deployments, this hashes the GitHub archive downloaded by the API. Omitted for deployments created before this field was recorded. */
	source_checksum?: string | null;
	/** For GitHub-sourced deployments, the subpath within the repository that was used as the deploy root. Omitted when the repo root was used or for file uploads. */
	source_path?: string | null;
	/** For GitHub-sourced deployments, the git ref as requested at deploy time (branch, tag, or commit SHA — not resolved to a commit). Omitted for file uploads. */
	source_ref?: string | null;
	/** Origin of the deployed source code. This is read-only response provenance; `file` indicates an uploaded archive and `github` indicates a repository fetched by the API. */
	source_type?: string | null;
	/** For GitHub-sourced deployments, the repository URL that was fetched. Omitted for file uploads. */
	source_url?: string | null;
	/** Current status of the deployment */
	status?: string | null;
	/** Status reason */
	status_reason?: string | null;
	/** Timestamp when the deployment was last updated */
	updated_at?: string | null;
};

/** A discovered form field */
export type KernelDiscoveredField = {
	/** Contextual help text near the field that tells the user what to enter (e.g., "Enter the phone ending in (***) ***-**92") */
	hint?: string | null;
	/** Field label */
	label?: string | null;
	/** If this field is associated with an MFA option, the type of that option (e.g., password field linked to "Enter password" option) */
	linked_mfa_type?: KernelMFAType | null;
	/** Field name */
	name?: string | null;
	/** Field placeholder */
	placeholder?: string | null;
	/** Whether field is required */
	required?: boolean | null;
	/** CSS selector for the field */
	selector?: string | null;
	/** Field type */
	type?: string | null;
};

export type KernelEmbeddedCeremonyAction = {
	name?: string | null;
};

export type KernelError = {
	/** Application-specific error code (machine-readable) */
	code?: string | null;
	/** Additional error details (for multiple errors) */
	details?: Array<KernelErrorDetail> | null;
	inner_error?: KernelErrorDetail | null;
	/** Human-readable error description for debugging */
	message?: string | null;
};

export type KernelErrorDetail = {
	/** Lower-level error code providing more specific detail */
	code?: string | null;
	/** Further detail about the error */
	message?: string | null;
};

/** Result of Playwright code execution */
export type KernelExecutePlaywrightResult = {
	/** Error message if execution failed */
	error?: string | null;
	/** The value returned by the code (if any) */
	result?: KernelJsonValue | null;
	/** Standard error from the execution */
	stderr?: string | null;
	/** Standard output from the execution */
	stdout?: string | null;
	/** Whether the code executed successfully */
	success?: boolean | null;
	tab?: KernelPlaywrightTab | null;
};

/** A browser extension uploaded to Kernel. */
export type KernelExtension = {
	/** SHA-256 checksum, encoded as lowercase hexadecimal, of the exact uploaded extension archive bytes. This is not a normalized checksum of the extension contents; archive metadata, file ordering, and compression can change the checksum for otherwise identical contents. Omitted for legacy rows and… */
	checksum?: string | null;
	/** Timestamp when the extension was created */
	created_at?: string | null;
	/** Unique identifier for the extension */
	id?: string | null;
	/** Timestamp when the extension was last used */
	last_used_at?: string | null;
	/** Optional, easier-to-reference name for the extension. Must be unique within the project. */
	name?: string | null;
	/** Size of the extension archive in bytes */
	size_bytes?: number | null;
};

export type KernelFileInfo = {
	/** Whether the path is a directory. */
	is_dir?: boolean | null;
	/** Last modification time. */
	mod_time?: string | null;
	/** File mode bits (e.g., "drwxr-xr-x" or "-rw-r--r--"). */
	mode?: string | null;
	/** Base name of the file or directory. */
	name?: string | null;
	/** Absolute path. */
	path?: string | null;
	/** Size in bytes. 0 for directories. */
	size_bytes?: number | null;
};

export type KernelFillVaultItemOperationResult = {
	/** One result per request binding, in request order; empty when the fill used no bindings. After the first failed or unknown field, all remaining fields are not_attempted. */
	fields?: Array<KernelVaultFillFieldResult> | null;
	/** Completed when the fill finished. Failed when execution stopped with known outcomes. Unknown when an outcome cannot be determined. Completed means values were supplied to the page, not that the site accepted or submitted them. */
	status?: string | null;
	type?: string | null;
};

export type KernelInvocation = {
	/** Name of the action invoked */
	action_name?: string | null;
	/** Name of the application */
	app_name?: string | null;
	/** RFC 3339 Nanoseconds timestamp when the invocation finished (null if still running) */
	finished_at?: string | null;
	/** ID of the invocation */
	id?: string | null;
	/** The action result or detailed failure output. Often a JSON-encoded value, but failures may contain plain text. May contain sensitive application data. */
	output?: string | null;
	/** Payload provided to the invocation. This is a string that can be parsed as JSON. */
	payload?: string | null;
	/** RFC 3339 Nanoseconds timestamp when the invocation started */
	started_at?: string | null;
	/** Status of the invocation */
	status?: string | null;
	/** A nonempty, customer-safe summary of the recorded failure output, always present when status is failed and omitted otherwise, including in the first failed invocation_state event. Recognized messages receive a specific summary; other failures receive a generic summary. Message matching does not… */
	status_reason?: string | null;
	/** Version label for the application */
	version?: string | null;
};

export type KernelInvokeResponse = {
	/** Name of the action invoked */
	action_name?: string | null;
	/** ID of the invocation */
	id?: string | null;
	/** The action result or detailed failure output. Often a JSON-encoded value, but failures may contain plain text. May contain sensitive application data. */
	output?: string | null;
	/** Status of the invocation */
	status?: string | null;
	/** A nonempty, customer-safe summary of the recorded failure output, always present when status is failed and omitted otherwise. Recognized messages receive a specific summary; other failures receive a generic summary. Message matching does not establish whether the failure originated in the… */
	status_reason?: string | null;
};

/** Configuration for an ISP proxy. */
export type KernelIspProxyConfig = {
	/** ISO 3166 country code. Supported countries are US, GB, FR, DE, SG, and KR. Defaults to US if not provided, or to the country of ip_address when that is set. */
	country?: string | null;
	/** Reserved exit IP to pin the proxy to. Available only to organizations with a reserved ISP allocation; the IP must be active in it (see GET /proxy_ips) and, when country is also set, in that country. Omit to let Kernel choose an IP. A proxy read includes it only when the proxy's primary exit IP… */
	ip_address?: string | null;
};

/** A ready Kernel card funded by a payment method supports authorize, fill, then submit checkout. A single-use card (source single_use_card) is ready on creation, supports only fill, and is expired from expires_at; Kernel deletes its stored details shortly after expires_at. It has no… */
export type KernelKernelCardState = {
	/** Informational registrable domain. Fill is locked to merchant_url's exact origin, except that a single-use card fills on any https page of this registrable domain. */
	domains?: Array<string> | null;
	/** Whether payment_method_id can still fund this purchase. unavailable means the method is being removed or awaits recovery, so authorization, fill and confirmation are refused until it recovers. removed means the method was removed from its wallet, so this purchase can no longer be paid; create a… */
	funding_status?: string | null;
	masks?: KernelVaultItemMasks | null;
	/** Wallet-scoped ID of the payment method funding this purchase. It is bound when the purchase is created and never changes; purchases created before payment methods could be selected report the wallet's default card, card. */
	payment_method_id?: string | null;
	provider?: string | null;
	/** payment_method for a purchase funded by a wallet payment method; single_use_card for a card whose details were supplied with single_use_card. */
	source?: string | null;
	/** pending_authorization waits for cardholder approval on Visa purchases or fresh security-code collection on alias-mode purchases through the spend_approval action; an unused link expires after 30 minutes. Alias-mode cards become ready after collection and expire at the temporary security-code… */
	status?: string | null;
	status_reason?: string | null;
};

/** One live purchase with a Kernel-enrolled card. Authorization obtains an agentic network token number, expiry and one-time 3-digit code. They are stored encrypted for the fill operation, which types them only on merchant_url's origin; the merchant's own checkout submits the payment. The one-time… */
export type KernelKernelCardVaultItemSpec = {
	/** Integer amount in minor currency units (at most 1000000), bound to the one-time code. */
	amount?: number | null;
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency?: string | null;
	/** Single-use cards only. From this time the card is expired and can no longer be filled; Kernel deletes its stored details shortly after. Deleting the card, its wallet or its vault deletes them immediately. Defaults to 2 hours after creation, capped at the end of the card's expiry month; a… */
	expires_at?: string | null;
	/** Actual merchant category when known. Omit rather than invent a category. */
	merchant_category?: string | null;
	/** Actual merchant MCC when known. Omit rather than invent a code. 0000 is not accepted. */
	merchant_category_code?: string | null;
	/** The merchant's ISO 3166-1 alpha-2 country code. Required for Visa cards, whose one-time code is issued for the merchant's country. */
	merchant_country?: string | null;
	merchant_name?: string | null;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url?: string | null;
	/** Wallet-scoped payment method ID from the wallet's payment_methods expansion. Omission selects the wallet's default card, ID card, for compatibility with existing requests; it never falls back to another method, and a wallet without a default card requires the ID. The purchase is bound to the… */
	payment_method_id?: string | null;
	provider?: string | null;
	single_use_card?: KernelKernelSingleUseCard | null;
	/** Key of the Kernel wallet item whose enrolled card pays. */
	wallet?: string | null;
};

export type KernelKernelCredentialVaultItemSpec = {
	/** Recognizable site or service name displayed verbatim as the form title, without suffixes such as sign-in credentials. Display text only, not an enforced destination policy. */
	description?: string | null;
	/** Ordered field definitions rendered in this order by credential collection forms. */
	fields?: Array<KernelCredentialVaultFieldDefinition> | null;
	provider?: string | null;
};

export type KernelKernelCredentialVaultItemState = {
	/** Exactly one entry for each declared field. */
	fields?: Record<string, KernelCredentialVaultFieldState> | null;
	provider?: string | null;
	/** Ready means all required fields have values, not that a login succeeded. Optional fields may remain unset. */
	status?: string | null;
};

export type KernelKernelManagedOAuthClient = {
	type?: string | null;
};

/** One live purchase funded by the Kernel wallet payment method named by payment_method_id. The method must be active and eligible when the request is created. The purchase is bound to that method; later operations cannot switch funding, and removing the method makes the purchase unusable rather… */
export type KernelKernelPaymentRequestVaultItemSpec = {
	/** Integer amount in minor currency units (at most 1000000), bound to the one-time code. */
	amount?: number | null;
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency?: string | null;
	/** Actual merchant category when known. Omit rather than invent a category. */
	merchant_category?: string | null;
	/** Actual merchant MCC when known. Omit rather than invent a code. 0000 is not accepted. */
	merchant_category_code?: string | null;
	/** The merchant's ISO 3166-1 alpha-2 country code. Required for Visa cards, whose one-time code is issued for the merchant's country. */
	merchant_country?: string | null;
	merchant_name?: string | null;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url?: string | null;
	/** Payment method ID from the wallet's payment_methods expansion. */
	payment_method_id?: string | null;
	provider?: string | null;
	/** Key of the Kernel wallet item that owns the payment method. */
	wallet?: string | null;
};

/** Details of a card the caller supplies, such as a single-use virtual card from its issuer. Mutually exclusive with payment_method_id. The card details are stored encrypted for fill and never returned; reads return only reference. Kernel deletes them shortly after the card's expires_at; deleting… */
export type KernelKernelSingleUseCard = {
	billing_address?: KernelSingleUseCardBillingAddress | null;
	cvc?: string | null;
	exp_month?: string | null;
	exp_year?: string | null;
	/** Cardholder name, filled as billing_name. */
	name?: string | null;
	/** Card number; must pass the Luhn check. */
	number?: string | null;
	/** The caller's identifier for the card, such as the issuer's card ID. Returned unchanged on reads. */
	reference?: string | null;
};

export type KernelKernelWalletState = {
	provider?: string | null;
	/** connected means the wallet is usable. It holds zero or more cards as payment methods, listed by the payment_methods expansion, and each can pay once it reports capabilities.single_use_card.eligible. A wallet with no cards, before its first card or after its last is removed, is still connected.… */
	status?: string | null;
	status_reason?: string | null;
};

/** Cards stored with Kernel-managed credentials, each a payment method of the wallet. Each card is enrolled through a card_enrollment action: the cardholder enters the card and their email on a Kernel-hosted page. Where the wallet advertises add_payment_method, creation returns an empty connected… */
export type KernelKernelWalletVaultItemSpec = {
	provider?: string | null;
};

/** Link's agent wallet spend limits, per transaction and over rolling periods. */
export type KernelLinkAgentWalletSpendLimits = {
	daily?: KernelLinkRollingSpendLimit | null;
	per_transaction?: KernelLinkSpendLimit | null;
	thirty_day?: KernelLinkRollingSpendLimit | null;
};

/** Verification Link requires from the user before the agent wallet can spend. */
export type KernelLinkAgentWalletStepUp = {
	/** URL where the user completes verification; null when no action is available. */
	action_url?: string | null;
	/** Link status such as not_required, ssn_verification, identity_verification, contact_support or complete. */
	status?: string | null;
};

/** Issued Link cards retain encrypted card material for the fill operation. Link cards do not expose aliases or support egress substitution. */
export type KernelLinkCardState = {
	/** The Link spend request's credential_type, set when authorize sends the request to Link. Absent before authorize and after Link rejects the request; a ready card without it fills like card. card is a Link virtual card; fill it with field bindings. link_pay_token is a Link Pay Token that Kernel… */
	credential_type?: string | null;
	domains?: Array<string> | null;
	masks?: KernelVaultItemMasks | null;
	provider?: string | null;
	/** recovery_required means an original provider operation has an unresolved outcome and the card cannot be used. Reads keep observing a known provider request and may clear the recovery. To continue, delete this card and create a new one; deleting cancels the original request when its ID is known… */
	status?: string | null;
	status_reason?: string | null;
};

/** Live Link card request. Test-mode card creation is not supported. The spec can be changed with PATCH until the card is authorized at a checkout. Authorize it with the browser at final checkout: Kernel inspects the checkout through WebMCP and internally chooses a merchant-bound Link Pay Token… */
export type KernelLinkCardVaultItemSpec = {
	/** Integer amount in minor currency units, at most 50000. With recurring, the spending limit per period, not a lifetime total. */
	amount?: number | null;
	context?: string | null;
	currency?: string | null;
	line_items?: Array<KernelLinkLineItem> | null;
	merchant_name?: string | null;
	merchant_url?: string | null;
	metadata?: Record<string, string> | null;
	/** Payment-method ID returned by the referenced wallet's payment-method listing. The provider decides whether the selected funding method can satisfy the card request. */
	payment_method_id?: string | null;
	provider?: string | null;
	recurring?: KernelLinkRecurring | null;
	totals?: Array<KernelLinkTotal> | null;
	/** Connected Link wallet item key. */
	wallet?: string | null;
};

export type KernelLinkLineItem = {
	description?: string | null;
	image_url?: string | null;
	name?: string | null;
	product_url?: string | null;
	quantity?: number | null;
	sku?: string | null;
	totals?: Array<KernelLinkTotal> | null;
	/** Unit amount in minor currency units. */
	unit_amount?: number | null;
	url?: string | null;
};

export type KernelLinkOAuthAction = {
	name?: string | null;
	url?: string | null;
};

export type KernelLinkOAuthAuthorization = {
	client?: KernelLinkOAuthClient | null;
	method?: string | null;
	token_refresh?: KernelLinkTokenRefresh | null;
};

export type KernelLinkOAuthClient =
	| KernelKernelManagedOAuthClient
	| KernelCustomerManagedOAuthClient;

/** Recurring terms for a subscription or other repeated purchase. The amount becomes the spending limit for each period of interval_count intervals, for example every 2 weeks. The merchant schedules charges. The card stays ready after each charge until it expires or is deleted; do not create a new… */
export type KernelLinkRecurring = {
	interval?: string | null;
	/** Number of intervals per period. Link defaults it to 1. */
	interval_count?: number | null;
};

export type KernelLinkRollingSpendLimit = {
	/** Null means unlimited. */
	limit?: number | null;
	/** Amount still available in the rolling period; null means unlimited. */
	remaining?: number | null;
	/** Amount already spent in the rolling period. */
	used?: number | null;
};

/** One entry of Link's `GET /shipping_addresses` response, passed through as Link reports it. Kernel never stores it. */
export type KernelLinkShippingAddress = {
	address?: KernelLinkShippingAddressDetails | null;
	/** Link shipping address ID. */
	id?: string | null;
	is_default?: boolean | null;
	nickname?: string | null;
};

/** Link's nullable postal address fields. Omitted from the shipping address when Link reports null. */
export type KernelLinkShippingAddressDetails = {
	/** State, province or region. */
	administrative_area?: string | null;
	country_code?: string | null;
	dependent_locality?: string | null;
	line_1?: string | null;
	line_2?: string | null;
	/** City or town. */
	locality?: string | null;
	name?: string | null;
	postal_code?: string | null;
	sorting_code?: string | null;
};

export type KernelLinkSpendLimit = {
	/** Null means unlimited. */
	limit?: number | null;
};

/** Who refreshes an imported Link grant. kernel (default) means Kernel holds and rotates the refresh token. customer means your backend keeps the refresh token and replaces the access token with update_access_token; Kernel never refreshes or revokes the grant. Fixed at wallet creation. */
export type KernelLinkTokenRefresh = string;

export type KernelLinkTotal = {
	/** Total amount in minor currency units. */
	amount?: number | null;
	display_text?: string | null;
	type?: string | null;
};

/** Link's `GET /userinfo` response for the connected wallet, passed through as Link reports it when the `link_user_info` expansion is requested. Kernel never stores it. Null fields are null at Link; omitted fields were not reported. Amounts are in the minor unit of `default_spend_request_currency`. */
export type KernelLinkUserInfo = {
	address?: KernelLinkUserInfoAddress | null;
	agent_wallet_spend_limits?: KernelLinkAgentWalletSpendLimits | null;
	agent_wallet_step_up?: KernelLinkAgentWalletStepUp | null;
	/** Lowercase ISO currency Link applies to a spend request created without one. */
	default_spend_request_currency?: string | null;
	/** Whether the user can fund purchases from a Link balance. */
	eligible_for_balance?: boolean | null;
	email?: string | null;
	first_name?: string | null;
	/** Stable Link user ID. */
	id?: string | null;
	last_name?: string | null;
	name?: string | null;
	phone?: string | null;
};

/** The Link user's postal address. Omitted when Link reports none. */
export type KernelLinkUserInfoAddress = {
	city?: string | null;
	country?: string | null;
	line1?: string | null;
	line2?: string | null;
	postal_code?: string | null;
	state?: string | null;
};

export type KernelLinkWalletState = {
	provider?: string | null;
	status?: string | null;
	status_reason?: string | null;
};

export type KernelLinkWalletVaultItemSpec = {
	authorization?: KernelLinkOAuthAuthorization | null;
	provider?: string | null;
};

/** Array of file or directory information entries. */
export type KernelListFiles = Array<KernelFileInfo>;

/** Response from starting a login flow */
export type KernelLoginResponse = {
	/** When the login flow expires */
	flow_expires_at?: string | null;
	/** Type of login flow started */
	flow_type?: string | null;
	/** One-time code for handoff (internal use) */
	handoff_code?: string | null;
	/** URL to redirect user to for login */
	hosted_url?: string | null;
	/** Auth connection ID */
	id?: string | null;
	/** Browser live view URL for watching the login flow */
	live_view_url?: string | null;
};

/** An MFA method option for verification */
export type KernelMFAOption = {
	/** Additional instructions from the site */
	description?: string | null;
	/** The visible option text */
	label?: string | null;
	/** The masked destination (phone/email) if shown */
	target?: string | null;
	type?: KernelMFAType | null;
};

/** The MFA delivery method type. Includes 'password' for auth method selection pages and 'switch' for generic method-switcher links like "Use another method" that do not name a specific method. */
export type KernelMFAType = string;

/** Managed authentication that keeps a profile logged into a specific domain. Flow fields (flow_status, flow_step, discovered_fields, mfa_options) reflect the most recent login flow and are null when no flow has been initiated. */
export type KernelManagedAuth = {
	/** Additional hostname roots valid for this auth flow, besides the primary domain. Each value allows credential entry on that exact hostname and its subdomains. Leading `www.` and `*.` labels are normalized away. When omitted or empty, credential entry is unrestricted. The following SSO/OAuth… */
	allowed_domains?: Array<string> | null;
	/** Whether automatic re-authentication is permitted for this connection. This is an opt-in flag only — it does not check whether re-auth is actually feasible. Even when true, re-auth only runs when the system has what it needs to perform it (for example, saved credentials for the required login… */
	auto_reauth?: boolean | null;
	/** Default browser configuration for login, reauthentication, and health-check sessions. */
	browser?: KernelManagedAuthBrowserConfig | null;
	/** ID of the underlying browser session driving the current flow (present when flow in progress). Use this to inspect or terminate the browser session via the `/browsers` API. */
	browser_session_id?: string | null;
	/** Deprecated. Use browser.telemetry. Retained during migration for existing clients. */
	browser_telemetry?: KernelBrowserTelemetryRequestConfig | null;
	/** Whether this connection's stored requirements are eligible for unattended re-authentication. A true value can represent either fully satisfiable requirements or a best-effort attempt. It does not account for whether automatic re-authentication is enabled or parent workflow state such as an… */
	can_reauth?: boolean | null;
	/** Machine-readable reason for the current value of `can_reauth`. Affirmative values (requirements are eligible for unattended re-authentication): - `external_credential` — an external credential provider is attached - `cua_has_credential` — CUA flow with a stored credential - `has_credential` —… */
	can_reauth_reason?: string | null;
	/** Canonical choices awaiting selection. Prefer this over pending_sso_buttons, mfa_options, and sign_in_options when present. */
	choices?: Array<KernelManagedAuthChoice> | null;
	credential?: KernelCredentialReference | null;
	/** Fields awaiting input (present when flow_step=awaiting_input; may also be present with awaiting_external_action as fallback actions) */
	discovered_fields?: Array<KernelDiscoveredField> | null;
	/** Target domain for authentication */
	domain?: string | null;
	/** Machine-readable error code (present when flow_status=failed) */
	error_code?: string | null;
	/** Error message (present when flow_status=failed) */
	error_message?: string | null;
	/** Instructions for external action (present when flow_step=awaiting_external_action) */
	external_action_message?: string | null;
	/** Canonical fields awaiting input. Prefer this over discovered_fields when present. */
	fields?: Array<KernelManagedAuthField> | null;
	/** When the current flow expires (null when no flow in progress). A flow past this timestamp is no longer valid and its `flow_status` will be `EXPIRED`. Clients may start a new login to supersede a stale `IN_PROGRESS` flow past this timestamp. */
	flow_expires_at?: string | null;
	/** Current flow status (null when no flow in progress) */
	flow_status?: string | null;
	/** Current step in the flow (null when no flow in progress) */
	flow_step?: string | null;
	/** Type of the current flow (null when no flow in progress) */
	flow_type?: string | null;
	/** Interval in seconds between automatic health checks. When set, the system periodically verifies the authentication status and triggers re-authentication if needed. Maximum is 86400 (24 hours). Default is 3600 (1 hour) or your plan minimum, whichever is larger. The minimum depends on your plan:… */
	health_check_interval?: number | null;
	/** Why health checks cannot verify this connection. Present when health checks are enabled but no auth check URL is available; a recent last_auth_check_at is not evidence of a valid session. */
	health_check_unavailable_reason?: string | null;
	/** Whether periodic health checks are enabled for this connection. When false, the system will not automatically verify authentication status, and `auto_reauth` has no effect on the automatic flow (since re-auth is only triggered by a failed scheduled health check). Manually triggering a health… */
	health_checks?: boolean | null;
	/** Whether a login blocked by a CAPTCHA the browser cannot solve pauses at AWAITING_HUMAN_INTERVENTION so a person can complete it in the live view. */
	hitl?: boolean | null;
	/** URL to redirect user to for hosted login (present when flow in progress) */
	hosted_url?: string | null;
	/** Unique identifier for the auth connection */
	id?: string | null;
	/** Opaque identifier for the current canonical interaction. Required when submitting fields or choices and changes for each new actionable pause. */
	interaction_id?: string | null;
	/** Deprecated alias for `last_auth_check_at`. Despite the name, this is the last health-check timestamp, not the last successful authentication. Use `last_auth_check_at` instead. */
	last_auth_at?: string | null;
	/** When the most recent auth health check ran for this connection, regardless of outcome. Updated on every health check and does not by itself indicate that the profile is currently authenticated - use `status` for that. May be newer than `flow_expires_at` when a flow is still in progress because… */
	last_auth_check_at?: string | null;
	/** Browser live view URL for debugging (present when flow in progress) */
	live_view_url?: string | null;
	/** Optional login page URL to skip discovery */
	login_url?: string | null;
	/** MFA method options (present when flow_step=awaiting_input; may also be present with awaiting_external_action as fallback actions) */
	mfa_options?: Array<KernelMFAOption> | null;
	/** SSO buttons available (present when flow_step=awaiting_input; may also be present with awaiting_external_action as fallback actions) */
	pending_sso_buttons?: Array<KernelSSOButton> | null;
	/** URL where the browser landed after successful login */
	post_login_url?: string | null;
	/** Name of the profile associated with this auth connection */
	profile_name?: string | null;
	/** Deprecated. Read browser.proxy instead. Retained during migration for existing clients. */
	proxy_id?: string | null;
	/** Whether to record browser session replays for this connection by default. Useful for debugging login flows. Can be overridden per-login. */
	record_session?: boolean | null;
	/** Whether credentials are saved after every successful login. One-time codes (TOTP, SMS, etc.) are not saved. */
	save_credentials?: boolean | null;
	/** Non-MFA choices presented during the auth flow, such as account selection or org pickers (present when flow_step=awaiting_input; may also be present with awaiting_external_action as fallback actions). */
	sign_in_options?: Array<KernelSignInOption> | null;
	/** SSO provider being used (e.g., google, github, microsoft) */
	sso_provider?: string | null;
	/** Last known authentication status of the managed profile. An inconclusive health check preserves this status and does not verify the current session. */
	status?: string | null;
	/** Visible error message from the website (e.g., 'Incorrect password'). Present when the website displays an error during login. */
	website_error?: string | null;
};

/** Browser configuration applied to browser sessions created for a managed auth connection. Managed auth controls the profile, headless mode, timeout, start URL, kiosk mode, and viewport. */
export type KernelManagedAuthBrowserConfig = {
	/** Automatic CAPTCHA solving for managed auth browser sessions. When provided without stealth, stealth no longer defaults to true. Enabling it does not select a proxy: a connection on direct egress stays there; set proxy.mode=default for Kernel's default stealth proxy. Turning it off on a… */
	captcha_solver?: KernelBrowserCaptchaSolver | null;
	/** Browser locale for the connection's login, reauthentication, and health-check sessions. Set on create or update; not supported on login. */
	location?: KernelManagedAuthBrowserLocation | null;
	/** Proxy configuration for managed auth browser sessions. Omit on create to derive the default from stealth, or on update and login to preserve or inherit the connection default. */
	proxy?: KernelBrowserProxyConfig | null;
	/** Browser region. Omit on create to use us-east, on update to keep the current region, or on login to inherit it. Login overrides apply only to that login. Non-default regions require an eligible plan and organization access. */
	region?: KernelRegion | null;
	/** Whether managed auth browser sessions use stealth mode: CAPTCHA solving with Kernel's default stealth proxy unless proxy is set. Defaults to true when neither stealth nor captcha_solver is provided. Cannot be combined with captcha_solver.enabled=false. Setting it does not change an existing… */
	stealth?: boolean | null;
	/** Browser telemetry configuration using the same semantics as browser create. */
	telemetry?: KernelBrowserTelemetryRequestConfig | null;
};

/** Browser locale applied to browser sessions created for a managed auth connection. */
export type KernelManagedAuthBrowserLocation = {
	/** Supported canonical BCP 47 locale for the browser's language and Accept-Language header. Omit to use the default for the browser's region, or omit on update to keep the current locale. Null clears it on update. */
	locale?: string | null;
};

/** Canonical auth-flow choice awaiting user selection. */
export type KernelManagedAuthChoice = {
	/** Context captured for a choice. */
	context?: string | null;
	/** Additional context for the choice. */
	description?: string | null;
	/** Display text captured for a choice. */
	display_text?: string | null;
	/** Stable choice identifier for canonical submit. */
	id?: string | null;
	/** Human-readable choice label. */
	label?: string | null;
	/** Masked phone number or email address shown for an MFA choice. */
	masked_destination?: string | null;
	/** Semantic MFA method. Choice id remains the stable identity of the exact option selected. */
	mfa_type?: KernelManagedAuthMFAMethod | null;
	/** Selector for the visible choice, when available. */
	observed_selector?: string | null;
	/** Choice type. A `human_intervention` choice confirms the person finished the challenge in the live view. */
	type?: string | null;
};

export type KernelManagedAuthCredentialVaultField = {
	type?: KernelCredentialVaultFieldType | null;
};

export type KernelManagedAuthCredentialVaultItemSpec = {
	/** ID of the managed auth connection whose saved credential this item reads. List connections with `GET /auth/connections`. */
	connection_id?: string | null;
	/** Display text supplied when the item was created. Omitted when none was given. */
	description?: string | null;
	provider?: string | null;
};

export type KernelManagedAuthCredentialVaultItemState = {
	/** One entry per non-empty value on the connection's saved credential, keyed by the field name to use in fill bindings. Included on single-item responses (create and get) and omitted from list responses, like `value_keys` on credentials. Empty when unavailable or when every stored value is empty. A… */
	fields?: Record<string, KernelManagedAuthCredentialVaultField> | null;
	provider?: string | null;
	/** Items are created ready, which means the connection has a saved Kernel credential that stores values or a TOTP seed (what has_values or has_totp_secret report on credentials), not that a login succeeded. Unavailable means it no longer does; such items advertise no operations. */
	status?: string | null;
	/** Present when status is unavailable. connection_not_found means the connection was deleted. no_credential means the connection's credential was deleted or emptied after the item was created. external_credential means the connection was moved to an external credential provider. */
	status_reason?: string | null;
};

/** Response from exchange endpoint */
export type KernelManagedAuthExchangeResponse = {
	/** Invocation ID */
	invocation_id?: string | null;
	/** JWT token with invocation_id claim (30 minute TTL) */
	jwt?: string | null;
};

/** Canonical field awaiting user input. */
export type KernelManagedAuthField = {
	/** Context shown near the field, including a masked code destination. */
	hint?: string | null;
	/** Stable field identifier for canonical submit. */
	id?: string | null;
	/** Virtual keyboard hint, independent of field type and browser validation. */
	input_mode?: string | null;
	/** Human-readable label shown to the user. */
	label?: string | null;
	/** Selector for the visible field, when available. */
	observed_selector?: string | null;
	/** Why the field requires user input. */
	reason?: string | null;
	/** Credential reference name to store the submitted value under. */
	ref?: string | null;
	/** Whether this field is required. */
	required?: boolean | null;
	/** Managed-auth field type. */
	type?: string | null;
};

/** Canonical MFA method, independent of a site's stable choice identifier. */
export type KernelManagedAuthMFAMethod = string;

/** A single event in an auth connection's history — a login attempt, an automatic re-auth attempt, or a health check. */
export type KernelManagedAuthTimelineEvent = {
	/** Browser session that produced the event, if one was created. */
	browser_session_id?: string | null;
	/** When the login/reauth attempt first reached a terminal status. Stable across retries and subsequent cleanup writes. Absent for in-progress attempts, health checks, and historical attempts without a recorded completion time. */
	completed_at?: string | null;
	/** Machine-readable error code. Present when a login/reauth event failed. */
	error_code?: string | null;
	/** Human-readable error message. Present when a login/reauth event failed. */
	error_message?: string | null;
	/** Identifier of the underlying login/reauth session or health check. */
	id?: string | null;
	/** The session state observed before this event. Present for health_check events that recorded a prior state. */
	previous_status?: string | null;
	/** Replay recording ID for the event's browser session, if session recording was enabled. */
	replay_id?: string | null;
	/** Outcome of the event. For login/reauth events this is the flow status (IN_PROGRESS, SUCCESS, EXPIRED, CANCELED, FAILED). For health_check events it is the observed session state (AUTHENTICATED, NEEDS_AUTH). */
	status?: string | null;
	/** The step the flow reached. Present for login/reauth events. */
	step?: string | null;
	/** Whether browser telemetry capture started for this event's browser session. */
	telemetry_captured?: boolean | null;
	/** When the event occurred. */
	timestamp?: string | null;
	/** The kind of event. "login" and "reauth" are authentication attempts; "health_check" is a periodic session-validity check. */
	type?: string | null;
	/** When the event was last updated. Present for login/reauth events. */
	updated_at?: string | null;
	/** Visible error message from the website (e.g., 'Incorrect password'). Present when the website displayed an error during the attempt. */
	website_error?: string | null;
};

export type KernelMfaAction = {
	name?: string | null;
};

/** Configuration for mobile proxies. */
export type KernelMobileProxyConfig = {
	/** Provider city alias. Mobile carrier routing can make observed geo vary. */
	city?: string | null;
	/** ISO 3166 country code. If omitted, the proxy uses the global pool without country targeting. */
	country?: string | null;
	/** US-only state code. Mobile carrier routing can make observed geo vary. */
	state?: string | null;
};

export type KernelMousePositionResponse = {
	/** Y coordinate of the cursor */
	y?: number | null;
	/** X coordinate of the cursor */
	x?: number | null;
};

/** An OTLP endpoint to export browser session telemetry to. Reference one from `telemetry.export.otlp.destination` when creating a browser to export that session's captured telemetry to it. */
export type KernelOTLPDestination = {
	/** Failed deliveries since the last success, as observed by the relay process that wrote the latest outcome. Zero means the most recently recorded outcome succeeded. */
	consecutive_failures?: number | null;
	created_at?: string | null;
	description?: string | null;
	/** OTLP/HTTP endpoint telemetry is sent to. */
	endpoint?: string | null;
	/** Headers sent with each export request. Names are returned in canonical form (`Authorization`, not `authorization`). Non-dashboard reads return values redacted as empty strings, so the keys are visible but the credentials are not. Dashboard reads return the stored values. */
	headers?: Record<string, string> | null;
	id?: string | null;
	/** Sanitized class of the delivery failure recorded at `last_error_at`. It is retained after a later success, so its presence does not mean the destination is currently failing. Response bodies, endpoint URLs, credentials, and raw transport errors are never returned. */
	last_error?: string | null;
	/** Timestamp of the most recent failed delivery. It is retained after a later success, so it can predate `last_export_at`. Read `consecutive_failures` to tell whether the destination is currently failing. */
	last_error_at?: string | null;
	/** Timestamp of the most recent successful delivery. Moves only on success. */
	last_export_at?: string | null;
	/** Unique within the organization. Usable in place of the ID when selecting a destination, so it cannot be shaped like an ID. */
	name?: string | null;
	updated_at?: string | null;
};

/** OTLP destination selection. Provide either id or name. The destination must be customer-visible in the authenticated organization. A project-scoped credential can select any such destination for workloads in its project. */
export type KernelOTLPDestinationRef = {
	/** OTLP destination ID */
	id?: string | null;
	/** OTLP destination name */
	name?: string | null;
};

/** Generic OK response. */
export type KernelOkResponse = {
	/** Indicates success. */
	ok?: boolean | null;
};

export type KernelOnePasswordAccessApprovalAction = {
	/** The access_request_reference value from url, for approving inside your own iOS or Android app with 1Password's action extension or authorization activity. Pass it unchanged; the grant comes back to your app, and 1pw_access_request_status records it in Kernel. Treat it like url, which carries the… */
	access_request_reference?: string | null;
	/** Steps for the agent to hand approval to the human and poll the resulting decision. */
	instructions?: string | null;
	name?: string | null;
	/** Native 1Password approval link. Present it to the account owner unchanged, except that you may append `&return_url=<URL-encoded URL>` so 1Password sends them back to your app after they decide (1Password 8.12.46 or later on iOS, Android and desktop). It does not grant access until they approve… */
	url?: string | null;
};

/** Non-secret broker state. Granted credential references are returned in resolved only for credentials with a customer-supplied access token; otherwise they stay encrypted server-side and can only be used by the fill operation. */
export type KernelOnePasswordAccessRequestState = {
	/** Provider-created timestamp as returned by the broker. */
	createdAt?: string | null;
	/** Login entries returned directly on accessRequest by the observed extension build. Omitted when the provider does not supply them. */
	entries?: Array<KernelOnePasswordReturnedRequestEntry> | null;
	/** Goal echoed by the observed createAccessRequest response when present. */
	goal?: string | null;
	granted_count?: number | null;
	has_autofill_token?: boolean | null;
	id?: string | null;
	/** Opaque provider identity returned by the broker. */
	identity?: string | null;
	/** Provider path if supplied in the broker response. */
	path?: string | null;
	request?: KernelOnePasswordReturnedRequest | null;
	/** Granted logins in the shape 1Password's getAccessRequestStatus returns. Present only for ready credentials with a customer-supplied access token, on single-item responses to callers that can use the vault. Each reference works only with that credential's access token and integration key. */
	resolved?: Array<KernelOnePasswordResolvedAccessRequestEntry> | null;
	/** One of pending, resolved, denied, failed, expired, or unknown. expired returns the item to pending_authorization so access can be requested again; unknown is a state 1Password added later and is treated as failed. */
	state?: string | null;
};

export type KernelOnePasswordCredentialAccountSpec = {
	authorization?: KernelOnePasswordOAuthAuthorization | null;
	provider?: string | null;
};

export type KernelOnePasswordCredentialAccountState = {
	provider?: string | null;
	/** revoking means the account was deleted or disconnected and Kernel is waiting for 1Password to confirm the revoke; it cannot be used and Kernel keeps retrying. */
	status?: string | null;
	status_reason?: string | null;
};

export type KernelOnePasswordCredentialRequestEntry = {
	/** 1Password's ID for this entry in an access request you created. Supply it only with resolved. */
	id?: string | null;
	keywords?: Array<string> | null;
	parameters?: {
		website?: string | null;
	} | null;
	reason?: string | null;
	/** Must be login. */
	type?: string | null;
};

/** Credential Request v2 input sent to the extension. A credential item may request up to five login entries. */
export type KernelOnePasswordCredentialRequests = {
	entries?: Array<KernelOnePasswordCredentialRequestEntry> | null;
	goal?: string | null;
	/** Must be 2. */
	version?: number | null;
};

/** Stored-token credentials omit account and never return access_token or integration_key. */
export type KernelOnePasswordCredentialVaultItemSpec = {
	/** Customer-supplied expiry metadata, if provided. */
	access_token_expires_at?: string | null;
	account?: string | null;
	provider?: string | null;
	requests?: KernelOnePasswordCredentialRequests | null;
};

export type KernelOnePasswordCredentialVaultItemState = {
	access_request?: KernelOnePasswordAccessRequestState | null;
	/** Opaque request ID returned by the 1Password broker after a successful createAccessRequest call. */
	access_request_id?: string | null;
	provider?: string | null;
	status?: string | null;
	status_reason?: string | null;
};

/** The submission result reported by the 1Password extension when available. Kernel returns fill_unknown if the extension call has no conclusive result. Inspect the page to determine successful authentication on the website. */
export type KernelOnePasswordFillVaultItemOperationResult = {
	/** Present for fill_failed, and for fill_unknown when the extension reported autosubmitFailed (it filled and submitted the form but could not confirm the fill finished). These are allowlisted 1Password extension codes, never raw errors, secrets, or page content. */
	error_code?: string | null;
	/** Kernel's outcome of the extension call. fill_submitted means the extension reported submission, not website authentication. fill_failed means the extension returned a known failure and includes error_code. fill_unknown means the form may have been filled or submitted without a conclusive result;… */
	status?: string | null;
	type?: string | null;
};

export type KernelOnePasswordOAuthAction = {
	/** 1Password connect link for the same authorization, for the person to open on their own device. In 1Password for iOS or Android it opens the app to approve the connection. Anywhere else it opens 1Password in the browser, where someone without 1Password can sign up; if the account is still pending… */
	connect_url?: string | null;
	name?: string | null;
	/** 1Password-hosted OAuth authorization URL for the human to open. */
	url?: string | null;
};

export type KernelOnePasswordOAuthAuthorization = {
	client?: KernelKernelManagedOAuthClient | null;
	method?: string | null;
};

export type KernelOnePasswordResolvedAccessRequestEntry = {
	/** The requested entry this login satisfies, when known. */
	entryId?: string | null;
	/** 1Password credential reference. Pass it unchanged as resourcePath to the extension's fillCredential or to the 1Password SDK. */
	reference?: string | null;
};

/** The request object if returned by the extension. The observed create response may omit entries; no entry IDs are invented. */
export type KernelOnePasswordReturnedRequest = {
	entries?: Array<KernelOnePasswordReturnedRequestEntry> | null;
	goal?: string | null;
	version?: number | null;
};

export type KernelOnePasswordReturnedRequestEntry = {
	id?: string | null;
	keywords?: Array<string> | null;
	parameters?: {
		website?: string | null;
	} | null;
	reason?: string | null;
	type?: string | null;
};

export type KernelOrgBrowserExtensionEntitlement = {
	/** Whether browser extensions are available. */
	enabled?: boolean | null;
	/** Maximum active custom extensions the organization may store. Null means unlimited. Loading stored extensions into a browser is not plan-limited. */
	max_stored_per_org?: number | null;
};

export type KernelOrgBrowserReplayEntitlement = {
	/** Whether browser replay recording is available. */
	enabled?: boolean | null;
	/** Number of days browser replays are retained, matching the replay reaper policy. */
	retention_days?: number | null;
};

export type KernelOrgEntitlementFeature = {
	/** Whether the organization is entitled to use this feature. */
	enabled?: boolean | null;
};

export type KernelOrgEntitlementFeatures = {
	browser_extensions?: KernelOrgBrowserExtensionEntitlement | null;
	browser_pools?: KernelOrgEntitlementFeature | null;
	browser_replays?: KernelOrgBrowserReplayEntitlement | null;
	credential_providers?: KernelOrgEntitlementFeature | null;
	credentials?: KernelOrgEntitlementFeature | null;
	custom_proxies?: KernelOrgEntitlementFeature | null;
	file_io?: KernelOrgEntitlementFeature | null;
	gpu?: KernelOrgEntitlementFeature | null;
	managed_auth?: KernelOrgManagedAuthEntitlement | null;
	managed_proxies?: KernelOrgEntitlementFeature | null;
	profiles?: KernelOrgEntitlementFeature | null;
	proxy_bypass_hosts?: KernelOrgEntitlementFeature | null;
	/** Whether the Search API is enabled for the organization by its rollout feature flag. */
	search?: KernelOrgEntitlementFeature | null;
	/** Whether the organization can access vaults, using the same access check as vault API routes. */
	vaults?: KernelOrgEntitlementFeature | null;
};

export type KernelOrgEntitlementLimits = {
	/** Effective org-level default concurrent invocation ceiling for apps without an app-specific override. App-specific overrides are not represented here. */
	default_max_concurrent_invocations_per_app?: number | null;
	/** Effective organization-wide ceiling shared by on-demand browsers and browser pool reservations. */
	max_concurrent_browsers?: number | null;
	/** Effective organization-wide concurrent app invocation ceiling. */
	max_concurrent_invocations?: number | null;
	/** Maximum non-deleted vaults allowed org-wide across all projects. Null means unlimited. The vaults feature flag still controls access. */
	max_vaults?: number | null;
};

export type KernelOrgEntitlementPlan = {
	/** The plan used to resolve plan-based access. Active trials resolve to START_UP regardless of the contractual plan. */
	effective_id?: string | null;
	/** The organization's contractual plan identifier. Use the resolved feature and limit values, not this field, for access decisions. */
	id?: string | null;
	/** Whether the organization is currently within its trial period. */
	is_trialing?: boolean | null;
	/** Current billing status of the contractual plan, or null when no billing status is recorded. Status-sensitive feature values already account for it. */
	status?: string | null;
	/** Configured trial end timestamp, or null when the organization has no trial. A past timestamp may be returned when is_trialing is false. */
	trial_ends_at?: string | null;
};

/** Effective feature access and constraints for the authenticated organization. Values already include trial treatment, plan status, and organization-specific overrides; consumers should use these resolved values instead of comparing plan IDs. */
export type KernelOrgEntitlements = {
	features?: KernelOrgEntitlementFeatures | null;
	limits?: KernelOrgEntitlementLimits | null;
	plan?: KernelOrgEntitlementPlan | null;
};

export type KernelOrgLimits = {
	/** The organization's current non-deleted managed auth connections, counted org-wide across every project. Compare against max_auth_connections to show remaining capacity before a create is rejected with 403 insufficient_plan. */
	auth_connections_used?: number | null;
	/** Number of concurrent browser slots currently available to the organization. This is the effective concurrency limit minus active on-demand sessions and browser pool reservations, floored at zero. Null when usage cannot be read. */
	concurrent_sessions_available?: number | null;
	/** Current organization-wide concurrent browser usage, including active on-demand sessions and browser pool reservations. Null when usage cannot be read. */
	concurrent_sessions_used?: number | null;
	/** Default maximum concurrent browsers applied to every project that has no explicit per-project override. Null means no org-level default, so such projects are uncapped (only the org-wide limit applies). Applies to existing and newly created projects. */
	default_project_max_concurrent_sessions?: number | null;
	/** Maximum managed auth connections the organization's plan allows. Null means unlimited. Counted org-wide, so it cannot be multiplied across projects. */
	max_auth_connections?: number | null;
	/** The organization's effective concurrency limit — the maximum browsers running at once, covering both on-demand sessions and browser pool reservations — from its plan or an override. Read-only and shared across all projects in the org; a per-project default cannot exceed it. */
	max_concurrent_sessions?: number | null;
	/** Maximum non-deleted vaults allowed org-wide across all projects. Null means unlimited. */
	max_vaults?: number | null;
	/** Smallest health_check_interval the organization's plan accepts on a managed auth connection. Requests below this are rejected with 400. Existing connections stored below the floor are grandfathered until edited. */
	min_health_check_interval_seconds?: number | null;
	/** Current non-deleted vault count across all projects in the organization. */
	vaults_used?: number | null;
};

export type KernelOrgManagedAuthEntitlement = {
	/** Whether managed auth is available. */
	enabled?: boolean | null;
	/** Effective interval in seconds used when a connection is created without an explicit health-check interval. */
	health_check_interval_default_seconds?: number | null;
	/** Maximum accepted managed auth health-check interval in seconds. */
	health_check_interval_max_seconds?: number | null;
	/** Minimum accepted managed auth health-check interval in seconds. */
	health_check_interval_min_seconds?: number | null;
	/** Maximum active managed auth connections in the organization. Null means unlimited. */
	max_connections?: number | null;
};

export type KernelPasskeyVaultItemOperationResult = {
	/** Relying party the armed passkey answers for. Returned by arm_passkey. */
	rp_id?: string | null;
	/** armed means the browser will answer matching passkey requests; it does not mean a page has asked yet. disarmed means the browser no longer uses this item's passkeys. */
	status?: string | null;
	type?: string | null;
};

/** One purchase from a Link or Kernel wallet, parented by that wallet. It has the same lifecycle, operations and fill behavior as a Link or Kernel card item. AgentCard reusable cards remain card items. */
export type KernelPaymentRequestVaultItem = {
	action?: KernelVaultItemAction | null;
	available_expansions?: Array<KernelAvailableVaultItemExpansion> | null;
	available_operations?: Array<KernelAvailableVaultItemOperation> | null;
	created_at?: string | null;
	expires_at?: string | null;
	id?: string | null;
	/** Immutable item key assigned when the item is created. */
	key?: string | null;
	spec?: KernelPaymentRequestVaultItemSpec | null;
	state?: KernelPaymentRequestVaultItemState | null;
	type?: string | null;
	updated_at?: string | null;
};

export type KernelPaymentRequestVaultItemSpec =
	| KernelLinkCardVaultItemSpec
	| KernelKernelPaymentRequestVaultItemSpec;

export type KernelPaymentRequestVaultItemState =
	| KernelLinkCardState
	| KernelKernelCardState;

/** A Playwright executor on the browser */
export type KernelPlaywrightExecutor = {
	/** Whether a call is running on the executor */
	busy?: boolean | null;
	/** When the executor was created */
	created_at?: string | null;
	/** When the most recent call on the executor started */
	last_used_at?: string | null;
	name?: KernelPlaywrightExecutorName | null;
	/** CDP page target ID of the executor's tab, once it has one. The default executor owns no tab. */
	target_id?: string | null;
	/** Current URL of the executor's tab, when it is open */
	url?: string | null;
};

/** The default executor followed by the named executors */
export type KernelPlaywrightExecutorList = {
	executors?: Array<KernelPlaywrightExecutor> | null;
};

/** Name of a Playwright executor. Calls with the same name run in the same executor, one at a time; the first call with a new name creates it. Calls on different executors run concurrently. 'default' names the executor that runs calls without a name. */
export type KernelPlaywrightExecutorName = string;

/** The tab 'page' was bound to for this call. Absent if the call failed before binding a tab. */
export type KernelPlaywrightTab = {
	/** Whether this call opened the tab. For a named executor this happens on its first call and after its previous tab was closed. For the default executor it happens only when the browser had no open page. */
	created?: boolean | null;
	/** CDP page target ID of the tab */
	target_id?: string | null;
};

/** Result of a synchronous command execution. */
export type KernelProcessExecResult = {
	/** Execution duration in milliseconds. */
	duration_ms?: number | null;
	/** Process exit code. */
	exit_code?: number | null;
	/** Base64-encoded stderr buffer. */
	stderr_b64?: string | null;
	/** Base64-encoded stdout buffer. */
	stdout_b64?: string | null;
};

/** Information about a spawned process. */
export type KernelProcessSpawnResult = {
	/** OS process ID. */
	pid?: number | null;
	/** Server-assigned identifier for the process. */
	process_id?: string | null;
	/** Timestamp when the process started. */
	started_at?: string | null;
};

/** Current status of a process. */
export type KernelProcessStatus = {
	/** Estimated CPU usage percentage. */
	cpu_pct?: number | null;
	/** Exit code if the process has exited. */
	exit_code?: number | null;
	/** Estimated resident memory usage in bytes. */
	mem_bytes?: number | null;
	/** Process state. */
	state?: string | null;
};

/** Result of writing to stdin. */
export type KernelProcessStdinResult = {
	/** Number of bytes written. */
	written_bytes?: number | null;
};

/** Browser profile metadata. */
export type KernelProfile = {
	/** Timestamp when the profile was created */
	created_at?: string | null;
	/** Unique identifier for the profile */
	id?: string | null;
	/** Timestamp when the profile was last used */
	last_used_at?: string | null;
	/** Optional, easier-to-reference name for the profile */
	name?: string | null;
	/** Timestamp when the profile was last updated */
	updated_at?: string | null;
};

export type KernelProject = {
	/** When the project was created */
	created_at?: string | null;
	/** Unique project identifier */
	id?: string | null;
	/** Project name */
	name?: string | null;
	/** Project status */
	status?: string | null;
	/** When the project was last updated */
	updated_at?: string | null;
};

export type KernelProjectLimits = {
	/** Maximum concurrent app invocations for this project. Null means no project-level cap. */
	max_concurrent_invocations?: number | null;
	/** Maximum concurrent browsers for this project, covering both on-demand sessions (`browsers.create()`) and browser pool reservations. Null means no project-level cap. */
	max_concurrent_sessions?: number | null;
	/** Deprecated: pooled browsers now count toward `max_concurrent_sessions`. Always null. */
	max_pooled_sessions?: number | null;
};

/** Configuration for routing traffic through a proxy. */
export type KernelProxy = {
	/** Hostnames that should bypass the parent proxy and connect directly. */
	bypass_hosts?: Array<string> | null;
	/** Configuration specific to the selected proxy `type`. */
	config?:
		| (
				| KernelDatacenterProxyConfig
				| KernelIspProxyConfig
				| KernelResidentialProxyConfig
				| KernelMobileProxyConfig
				| KernelCustomProxyConfig
		  )
		| null;
	id?: string | null;
	/** IP address that the proxy uses when making requests. */
	ip_address?: string | null;
	/** Timestamp of the last health check performed on this proxy. */
	last_checked?: string | null;
	/** Readable name of the proxy. */
	name?: string | null;
	/** Protocol to use for the proxy connection. */
	protocol?: string | null;
	/** Current health status of the proxy. */
	status?: string | null;
	/** Proxy type to use. In terms of quality for avoiding bot-detection, from best to worst: `mobile` > `residential` > `isp`. `datacenter` is deprecated; use `isp` instead. Existing datacenter proxies remain supported. */
	type?: string | null;
};

/** Configuration for routing traffic through a proxy. */
export type KernelProxyCreateRequest = {
	/** Hostnames that should bypass the parent proxy and connect directly. */
	bypass_hosts?: Array<string> | null;
	/** Configuration specific to the selected proxy `type`. */
	config?:
		| (
				| KernelDatacenterProxyConfig
				| KernelIspProxyConfig
				| KernelResidentialProxyConfig
				| KernelMobileProxyConfig
				| KernelCreateCustomProxyConfig
		  )
		| null;
	/** Readable name of the proxy. */
	name?: string | null;
	/** Protocol to use for the proxy connection. */
	protocol?: string | null;
	/** Proxy type to use. In terms of quality for avoiding bot-detection, from best to worst: `mobile` > `residential` > `isp`. `datacenter` is deprecated; use `isp` instead. Datacenter proxy creation remains supported for backward compatibility. */
	type?: string | null;
};

/** One IP address reserved for the organization's ISP proxies. */
export type KernelProxyIp = {
	/** ISO 3166 country code of the IP. */
	country?: string | null;
	/** Reserved exit IP address. */
	ip_address?: string | null;
	status?: KernelProxyIpStatus | null;
};

/** A reserved IP with the ISP proxies using it as their primary exit. Reservations are organization-wide, so proxy_count covers every project while proxies lists only those in the current project. */
export type KernelProxyIpDetail = {
	/** ISO 3166 country code of the IP. */
	country?: string | null;
	/** Reserved exit IP address. */
	ip_address?: string | null;
	/** ISP proxies in the current project whose primary exit IP is this address. */
	proxies?: Array<KernelProxyIpProxy> | null;
	/** Number of ISP proxies across the organization whose primary exit IP is this address. */
	proxy_count?: number | null;
	status?: KernelProxyIpStatus | null;
};

/** An ISP proxy whose primary exit is the reserved IP. */
export type KernelProxyIpProxy = {
	id?: string | null;
	name?: string | null;
};

/** Whether the IP can currently be assigned. An excluded IP is listed but cannot be pinned or moved to; proxies already on it keep working. */
export type KernelProxyIpStatus = string;

export type KernelPushApprovalAction = {
	name?: string | null;
};

/** Geographic region for hosting browser sessions or pools. */
export type KernelRegion = string;

export type KernelRemovePaymentMethodVaultItemOperationResult = {
	payment_method_id?: string | null;
	status?: string | null;
	type?: string | null;
};

/** A typed, schema-validated report an agent submitted against a task. Reports are immutable. */
export type KernelReport = {
	/** When the report was submitted */
	created_at?: string | null;
	/** Report data, matching the report type's schema */
	data?: Record<string, KernelJsonValue> | null;
	/** Unique identifier for the report */
	id?: string | null;
	/** When the reported event happened */
	occurred_at?: string | null;
	/** Version of the report type's schema that data was validated against */
	schema_version?: number | null;
	/** ID of the browser the report was observed in, if any */
	session_id?: string | null;
	/** ID of the task the report belongs to */
	task_id?: string | null;
	/** Report type name */
	type?: string | null;
};

/** A kind of report agents can submit against a task, with its versions and the JSON Schema of its latest version. A shipped version never changes; changes ship as new versions. */
export type KernelReportType = {
	/** What the report type records and when to submit it */
	description?: string | null;
	/** Highest version that is not retired. A report submitted without a schema_version uses this version. It is 0 when every version is retired. */
	latest_version?: number | null;
	/** JSON Schema (draft 2020-12) of the latest version, which a report's data must match. Its field descriptions and examples describe what to send. Null when every version is retired. */
	schema?: Record<string, KernelJsonValue> | null;
	/** Report type name, such as task.result */
	type?: string | null;
	/** Every version of the type, oldest first, including retired versions. */
	versions?: Array<KernelReportTypeVersionSummary> | null;
};

/** A kind of report agents can submit against a task. Retrieve the type for the JSON Schema of its data. */
export type KernelReportTypeSummary = {
	/** What the report type records and when to submit it */
	description?: string | null;
	/** Highest version that is not retired. A report submitted without a schema_version uses this version. It is 0 when every version is retired. */
	latest_version?: number | null;
	/** Report type name, such as task.result */
	type?: string | null;
};

/** One immutable schema version of a report type. */
export type KernelReportTypeVersion = {
	/** Whether the version is retired. Retired versions are no longer accepted for new reports; existing reports keep them. */
	retired?: boolean | null;
	/** JSON Schema (draft 2020-12) that a report's data must match. Its field descriptions and examples describe what to send. */
	schema?: Record<string, KernelJsonValue> | null;
	/** Report type name, such as task.result */
	type?: string | null;
	/** Schema version number, starting at 1. */
	version?: number | null;
};

/** One schema version of a report type, without its schema. */
export type KernelReportTypeVersionSummary = {
	/** Whether the version is retired. Retired versions are no longer accepted for new reports; existing reports keep them. */
	retired?: boolean | null;
	/** Schema version number, starting at 1. */
	version?: number | null;
};

/** Configuration for residential proxies. */
export type KernelResidentialProxyConfig = {
	/** Autonomous system number. See https://bgp.potaroo.net/cidr/autnums.html */
	asn?: string | null;
	/** City name (no spaces, e.g. `sanfrancisco`). If provided, `country` must also be provided. */
	city?: string | null;
	/** ISO 3166 country code. If omitted, the proxy uses the global pool without country targeting. */
	country?: string | null;
	/** Operating system of the residential device. */
	os?: string | null;
	/** Two-letter state code. */
	state?: string | null;
	/** US ZIP code. */
	zip?: string | null;
};

/** An SSO button for signing in with an external identity provider */
export type KernelSSOButton = {
	/** Visible button text */
	label?: string | null;
	/** Identity provider name */
	provider?: string | null;
	/** XPath selector for the button */
	selector?: string | null;
};

/** Retained search results and provider attempt history. */
export type KernelSearch = {
	/** Provider-generated answer when requested (e.g. via Tavily include_answer or Perplexity). Preserved independently of include_raw. */
	answer?: string | null;
	attempts?: Array<KernelSearchAttempt> | null;
	/** Expiration of result IDs for deferred retrieval. Results expire 24 hours after search completion. */
	expires_at?: string | null;
	/** Search resource ID. Request tracing uses X-Request-Id. */
	id?: string | null;
	/** Concrete serving provider, never auto or fallback. */
	provider?: string | null;
	/** Echo of the query. Native multi-query inputs are visible in the selected strategy target and the optional raw response. */
	query?: string | null;
	/** Full serving-provider response, including top-level metadata that does not belong to a result. Present only with include_raw=true; untrusted provider data. */
	raw?: KernelJsonValue | null;
	results?: Array<KernelSearchResult> | null;
	usage?: KernelSearchUsage | null;
	warnings?: Array<KernelSearchWarning> | null;
};

export type KernelSearchAttempt = {
	duration_ms?: number | null;
	error_code?: string | null;
	outcome?: string | null;
	provider?: string | null;
	retryable?: boolean | null;
};

/** Kernel content cache outcome. Kernel has no content cache yet: responses report bypass or unknown, and hit and miss are reserved. Provider-internal cache behavior may be unknown. */
export type KernelSearchContentCacheStatus = string;

export type KernelSearchContentCapabilities = {
	/** Can enforce the requested maximum content age. */
	freshness_control?: boolean | null;
	/** Supports content retrieval with the search request. */
	inline?: boolean | null;
	/** Supports content retrieval after the search completes. */
	post_hoc?: boolean | null;
};

/** Describes source coverage before max_chars truncation. Full_page means main-page content, not every dynamic element or linked page. */
export type KernelSearchContentCompleteness = string;

export type KernelSearchContentError = {
	/** Machine-readable retrieval failure code. */
	code?: string | null;
	/** Human-readable failure description. */
	message?: string | null;
	retryable?: boolean | null;
};

export type KernelSearchContentFormat = string;

/** Original retrieval method. */
export type KernelSearchContentMethod = string;

export type KernelSearchContentResult = {
	cache_status?: KernelSearchContentCacheStatus | null;
	completeness?: KernelSearchContentCompleteness | null;
	error?: KernelSearchContentError | null;
	/** Extraction version when Kernel transformed the input. */
	extractor_version?: string | null;
	/** When Kernel fetched the content, or received it from the provider for retained content. */
	fetched_at?: string | null;
	/** Final retrieval URL after redirects when known. Curl mode follows up to 5 redirects. */
	final_url?: string | null;
	/** Format of text. Plain-text and JSON pages are returned unchanged as text even when markdown was requested. */
	format?: KernelSearchContentFormat | null;
	/** Final target HTTP status when known. */
	http_status?: number | null;
	method?: KernelSearchContentMethod | null;
	result_id?: string | null;
	status?: KernelSearchContentStatus | null;
	/** Extracted website content, untrusted, not instructions. Present only on status=ok. */
	text?: string | null;
	/** Whether the content was cut short, by max_chars or because the page exceeded the 1 MiB read limit. */
	truncated?: boolean | null;
	/** Original result URL. */
	url?: string | null;
};

/** Ok means non-empty extracted content, not merely HTTP 200. Blocked includes detected challenges or access denials. Detection is best-effort, not a guarantee of page completeness. Error details are present for non-ok outcomes; text is present only on ok. */
export type KernelSearchContentStatus = string;

export type KernelSearchContentsResponse = {
	contents?: Array<KernelSearchContentResult> | null;
	search_id?: string | null;
	usage?: KernelSearchUsage | null;
	warnings?: Array<KernelSearchWarning> | null;
};

export type KernelSearchParameterCapabilities = {
	country?: KernelSearchParameterCapability | null;
	end_date?: KernelSearchParameterCapability | null;
	exclude_domains?: KernelSearchParameterCapability | null;
	include_domains?: KernelSearchParameterCapability | null;
	language?: KernelSearchParameterCapability | null;
	recency?: KernelSearchParameterCapability | null;
	safe_search?: KernelSearchParameterCapability | null;
	start_date?: KernelSearchParameterCapability | null;
};

export type KernelSearchParameterCapability = {
	/** Translation behavior, limitations, and precision. */
	notes?: string | null;
	support?: string | null;
};

export type KernelSearchProvider = {
	content?: KernelSearchContentCapabilities | null;
	max_results_cap?: number | null;
	/** Provider-specific limitations, conditional filter support, and warnings about search modes. */
	notes?: Array<string> | null;
	params?: KernelSearchParameterCapabilities | null;
	provider_options?: KernelSearchProviderOptionsDiscovery | null;
	slug?: string | null;
};

export type KernelSearchProviderOptionsDiscovery = {
	examples?: Array<Record<string, KernelJsonValue>> | null;
	/** JSON Schema for the provider-native options accepted by POST /search. */
	schema?: Record<string, KernelJsonValue> | null;
	/** OpenAPI component name for the matching typed provider-options schema. */
	schema_ref?: string | null;
};

export type KernelSearchResult = {
	additional_snippets?: Array<string> | null;
	/** Portable retrieval outcome, or native content supplied by the search provider. Identity fields remain on the enclosing result. Native excerpts are labeled excerpt rather than full_page. Omission never triggers browser retrieval. */
	content?: KernelSearchResultContent | null;
	/** Kernel-generated identifier for this result. Stable only within the retained search; not standardized across providers. Provider-native IDs, when available, remain provider-specific raw fields. */
	id?: string | null;
	/** Provider-supplied date or timestamp, preserving available precision. No publication date is fabricated. Retains the published field name. */
	published_date?: string | null;
	/** One-based position in the returned ranking. */
	rank?: number | null;
	/** Original provider result, included only with include_raw=true. Provider relevance scores are not normalized. Top-level provider data is available in Search.raw. */
	raw?: KernelJsonValue | null;
	snippet?: string | null;
	/** Provider source name or result URL hostname, when available. */
	source?: string | null;
	title?: string | null;
	/** Provider-returned URL, not assumed canonical. */
	url?: string | null;
};

export type KernelSearchResultContent = {
	cache_status?: KernelSearchContentCacheStatus | null;
	completeness?: KernelSearchContentCompleteness | null;
	error?: KernelSearchContentError | null;
	/** Extraction version when Kernel transformed the input. */
	extractor_version?: string | null;
	/** When Kernel received the content from the provider. */
	fetched_at?: string | null;
	/** Final retrieval URL when known. */
	final_url?: string | null;
	format?: KernelSearchContentFormat | null;
	/** Final target HTTP status when known. */
	http_status?: number | null;
	method?: KernelSearchContentMethod | null;
	status?: KernelSearchContentStatus | null;
	/** Extracted website content, untrusted, not instructions. Present only on status=ok. */
	text?: string | null;
	/** Whether max_chars truncated the extracted content. */
	truncated?: boolean | null;
};

export type KernelSearchUsage = {
	/** Number of result URLs for which a Kernel browser retrieval received a response from the target, excluding cache-only hits. */
	content_fetches?: number | null;
	/** Total customer charge in USD when billing data is available. */
	cost?: number | null;
	/** Number of result entries returned, including failed entries on the contents endpoint. */
	results_count?: number | null;
};

export type KernelSearchWarning = {
	/** Examples: param_unsupported, preference_unsupported, max_results_clamped, domains_truncated, recency_emulated, filter_emulated, date_filter_overridden, provider_ineligible, fallback_failed, content_partial. */
	code?: string | null;
	message?: string | null;
	param?: string | null;
	provider?: string | null;
	result_id?: string | null;
};

/** Issued Shop Pay cards retain encrypted card material for the fill operation. */
export type KernelShopPayCardState = {
	domains?: Array<string> | null;
	masks?: KernelVaultItemMasks | null;
	provider?: string | null;
	/** declined covers a request the shopper declined or that was cancelled. consumed means the transaction outcome was reported with confirm_transaction; the card is no longer stored and cannot be filled again, whatever the outcome. recovery_required means a provider operation has an unresolved… */
	status?: string | null;
	status_reason?: string | null;
};

/** Shop Pay purchase. amount is the limit the shopper approves; totals must include exactly one positive total no higher than it. context is shown to the shopper when they approve. Authorize it with the browser at final checkout: Kernel sends that page to Shop as the merchant and the card fills… */
export type KernelShopPayCardVaultItemSpec = {
	/** Approval limit in minor currency units, at most 1000000. */
	amount?: number | null;
	/** What is being bought and why, written for the shopper. */
	context?: string | null;
	/** Shop accepts USD spend requests only. */
	currency?: string | null;
	line_items?: Array<KernelShopPayLineItem> | null;
	/** ISO 3166-1 alpha-2 country of the merchant. */
	merchant_country?: string | null;
	merchant_name?: string | null;
	/** The merchant's https URL. */
	merchant_url?: string | null;
	/** Card ID from the wallet's payment_methods expansion. Omit it to use the shopper's preferred card. */
	payment_method_id?: string | null;
	provider?: string | null;
	totals?: Array<KernelShopPayTotal> | null;
	/** Connected Shop Pay wallet item key. */
	wallet?: string | null;
};

export type KernelShopPayLineItem = {
	name?: string | null;
	quantity?: number | null;
	/** Unit price in minor currency units. */
	unit_amount?: number | null;
};

export type KernelShopPayOAuthAction = {
	name?: string | null;
	/** Shop sign-in page where the shopper connects their Shop account to Kernel. */
	url?: string | null;
};

export type KernelShopPayOAuthAuthorization = {
	client?: KernelKernelManagedOAuthClient | null;
	method?: string | null;
};

export type KernelShopPayTotal = {
	/** Amount in minor currency units; discounts are negative. */
	amount?: number | null;
	/** For example subtotal, fulfillment, tax, discount or total. */
	type?: string | null;
};

export type KernelShopPayWalletState = {
	provider?: string | null;
	status?: string | null;
	status_reason?: string | null;
};

/** Shop Pay wallet connected through Kernel's Shop app. Creation returns a shop_pay_oauth action: the shopper signs in to Shop and approves the connection, and the wallet connects. The connected wallet's payment_methods expansion lists the shopper's saved Shop Pay cards. */
export type KernelShopPayWalletVaultItemSpec = {
	authorization?: KernelShopPayOAuthAuthorization | null;
	provider?: string | null;
};

/** A non-MFA choice presented during the auth flow (e.g. account selection, org picker) */
export type KernelSignInOption = {
	/** Additional context such as email address or org name */
	description?: string | null;
	/** Unique identifier for this option (used to submit selection back) */
	id?: string | null;
	/** Display text for the option */
	label?: string | null;
};

/** Billing address filled with the billing_* fill fields. Never returned. */
export type KernelSingleUseCardBillingAddress = {
	city?: string | null;
	/** ISO 3166-1 alpha-2 code. */
	country?: string | null;
	line1?: string | null;
	line2?: string | null;
	postal_code?: string | null;
	state?: string | null;
};

export type KernelSpendApprovalAction = {
	name?: string | null;
	url?: string | null;
};

/** Response from submitting field values */
export type KernelSubmitFieldsResponse = {
	/** Whether the submission was accepted for processing */
	accepted?: boolean | null;
};

/** User-defined key-value tags. */
export type KernelTags = Record<string, string>;

/** A goal an agent works toward. Reports are submitted against a task, and browsers can be linked to it. Tasks are immutable apart from added browser links. */
export type KernelTask = {
	/** When the task was created */
	created_at?: string | null;
	/** What the task is meant to accomplish */
	description?: string | null;
	/** Unique identifier for the task */
	id?: string | null;
	metadata?: KernelTaskMetadata | null;
	/** IDs of browsers linked to the task, oldest link first. Linked browsers may since have been deleted. */
	session_ids?: Array<string> | null;
	/** When work on the task started */
	started_at?: string | null;
	/** Hostname of the website the task targets */
	target_website?: string | null;
};

/** Caller-defined string key-value pairs for grouping and filtering tasks, such as a user or thread ID. At most 20 keys; keys are 1-64 characters, values at most 256 characters, and keys and values together at most 4 KB. */
export type KernelTaskMetadata = Record<string, string>;

export type KernelVault = {
	created_at?: string | null;
	id?: string | null;
	/** Immutable name assigned when the vault is created. */
	name?: string | null;
	updated_at?: string | null;
};

/** Response schema for an AgentCard configuration, without secret credentials. Kernel generates the ID and timestamps and introspects test_mode from the credentials. Configuration creation uses VaultAgentCardProviderConfigRequest. */
export type KernelVaultAgentCardProviderConfig = {
	client_id?: string | null;
	created_at?: string | null;
	id?: string | null;
	name?: string | null;
	provider?: string | null;
	/** Introspected mode of the selected credential; true means sandbox objects. */
	test_mode?: boolean | null;
	updated_at?: string | null;
};

export type KernelVaultCardAliases = {
	cvc?: string | null;
	exp_month?: string | null;
	exp_year?: string | null;
	number?: string | null;
};

/** Public key for encrypted_value on credential fields. Use this only if you run your own credential collection web app and want values encrypted in the browser, sent to your backend still encrypted, and forwarded to Kernel's API still encrypted. In every other case, including server-side code that… */
export type KernelVaultEncryptionKey = {
	/** JWE key management algorithm. */
	alg?: string | null;
	/** JWE content encryption algorithm. */
	enc?: string | null;
	jwk?: KernelVaultEncryptionPublicJWK | null;
	/** Key ID. Set it as the kid protected header of every encrypted_value. */
	kid?: string | null;
};

/** P-256 public key in JWK form. */
export type KernelVaultEncryptionPublicJWK = {
	crv?: string | null;
	kty?: string | null;
	/** Base64url-encoded y coordinate. */
	y?: string | null;
	/** Base64url-encoded x coordinate. */
	x?: string | null;
};

export type KernelVaultFillFieldResult = {
	/** Present only for failed or unknown fields. Never includes secret values, DOM content, or raw browser errors. */
	error_code?: string | null;
	/** Zero-based index into the request fields array. */
	index?: number | null;
	/** Filled means the fill action completed, not that the website retained or accepted the value. */
	status?: string | null;
};

export type KernelVaultItem =
	| KernelWalletVaultItem
	| KernelCardVaultItem
	| KernelPaymentRequestVaultItem
	| KernelCredentialAccountVaultItem
	| KernelCredentialVaultItem;

export type KernelVaultItemAction =
	| KernelLinkOAuthAction
	| KernelShopPayOAuthAction
	| KernelOnePasswordOAuthAction
	| KernelSpendApprovalAction
	| KernelPushApprovalAction
	| KernelCollectAction
	| KernelMfaAction
	| KernelEmbeddedCeremonyAction
	| KernelCardEnrollmentAction;

export type KernelVaultItemEvent = {
	/** Browser session associated with the event, when applicable. */
	browser_id?: string | null;
	created_at?: string | null;
	data?: Record<string, KernelJsonValue> | null;
	id?: string | null;
	name?: string | null;
};

/** Live, non-persisted data requested through the item GET expand parameter. */
export type KernelVaultItemExpanded = {
	/** Link's saved shipping addresses, present when the `link_shipping_addresses` expansion is requested. */
	link_shipping_addresses?: Array<KernelLinkShippingAddress> | null;
	link_user_info?: KernelLinkUserInfo | null;
	payment_methods?: Array<KernelVaultPaymentMethod> | null;
};

export type KernelVaultItemExpansionType = string;

export type KernelVaultItemMasks = {
	brand?: string | null;
	last4?: string | null;
	/** Last four digits of the network token presented to the merchant. */
	token_last4?: string | null;
};

/** Authorization and preparation return the existing item shape. Fill and passkey operations return value-free results; WebMCP invocation returns the tool's output. None persist transient outcomes on the item. Payment-method operations return the affected wallet payment method. */
export type KernelVaultItemOperationResponse =
	| KernelVaultItem
	| KernelFillVaultItemOperationResult
	| KernelPasskeyVaultItemOperationResult
	| KernelOnePasswordFillVaultItemOperationResult
	| KernelWebMCPInvokeVaultItemOperationResult
	| KernelAddPaymentMethodVaultItemOperationResult
	| KernelRemovePaymentMethodVaultItemOperationResult;

export type KernelVaultItemOperationType = string;

/** Response schema for a Link configuration, without secret credentials. Kernel generates the ID and timestamps. Configuration creation uses VaultLinkProviderConfigRequest. */
export type KernelVaultLinkProviderConfig = {
	/** OAuth client identity; immutable. Secret credentials are never returned. */
	client_id?: string | null;
	created_at?: string | null;
	id?: string | null;
	/** Unique within the organization. */
	name?: string | null;
	provider?: string | null;
	/** Stripe publishable key sent to Link when refreshing and revoking wallet grants. Omitted when not configured. */
	publishable_key?: string | null;
	updated_at?: string | null;
};

export type KernelVaultPaymentMethod = {
	action?: KernelVaultPaymentMethodAction | null;
	capabilities?: KernelVaultPaymentMethodCapabilities | null;
	display?: KernelVaultPaymentMethodDisplay | null;
	/** Expiry of a pending enrollment link or ingest URL. */
	expires_at?: string | null;
	id?: string | null;
	/** For Kernel wallets, true for the default card, ID card, which a Kernel card item that omits payment_method_id selects. Wallets created with payment methods enabled have no default card. */
	is_default?: boolean | null;
	/** Kernel wallets only. The issuer's reference for a card it pushed with a card_ingest URL. */
	issuer_reference?: string | null;
	/** Provider that issued this payment-method ID. */
	provider?: string | null;
	/** Kernel wallets only. pending_enrollment means a card_enrollment link or card_ingest URL is open; active means the card is stored and can pay when capabilities.single_use_card.eligible is true; removal_pending means removal started but the provider outcome is unknown, so retry… */
	status?: string | null;
	status_reason?: string | null;
	/** Provider-neutral payment-method type normalized to lowercase. */
	type?: string | null;
	/** Kernel wallets only. When a card pushed with a card_ingest URL stops being usable, as its issuer set. */
	valid_until?: string | null;
};

/** The open enrollment of a pending payment method. card_enrollment is a single-use hosted link for the cardholder. card_ingest is a single-use URL on a Kernel ingest hostname served by the card vault, which the card's issuer posts the card to from its backend; Kernel never receives the card number… */
export type KernelVaultPaymentMethodAction = {
	/** Secret bearer capability for embedded card capture with @onkernel/vault-react. Present only on card_enrollment for Kernel wallets; never for AgentCard. Treat it like the enrollment URL and do not log or persist it in browser storage. */
	capture_token?: string | null;
	name?: string | null;
	url?: string | null;
};

/** Provider-reported advisory capabilities. A missing capability is unknown, not ineligible; only eligible=false is an explicit negative signal. */
export type KernelVaultPaymentMethodCapabilities = {
	single_use_card?: KernelVaultPaymentMethodCapability | null;
};

export type KernelVaultPaymentMethodCapability = {
	eligible?: boolean | null;
	reasons?: Array<string> | null;
};

export type KernelVaultPaymentMethodDisplay = {
	brand?: string | null;
	label?: string | null;
	last4?: string | null;
};

export type KernelVaultProviderConfig =
	| KernelVaultLinkProviderConfig
	| KernelVaultAgentCardProviderConfig
	| KernelVaultVgsProviderConfig;

/** Select a provider config by ID or name. Responses return the ID. Renaming a config does not change existing wallet bindings; an item cannot switch to a different config after creation. */
export type KernelVaultProviderConfigReference = {
	id?: string | null;
	name?: string | null;
};

/** Reference to a project-scoped vault. Provide exactly one of id or name. */
export type KernelVaultReference = {
	id?: string | null;
	name?: string | null;
};

/** Response schema for a customer-managed VGS vault configuration, without the client secret. Kernel generates the ID and timestamps. Configuration creation uses VaultVgsProviderConfigRequest. */
export type KernelVaultVgsProviderConfig = {
	/** Service account identity; immutable. The client secret is never returned. */
	client_id?: string | null;
	created_at?: string | null;
	/** The vault's VGS environment; immutable. */
	environment?: string | null;
	id?: string | null;
	/** Unique within the organization. */
	name?: string | null;
	provider?: string | null;
	updated_at?: string | null;
	/** The customer's VGS vault ID; immutable. */
	vault_id?: string | null;
};

/** The card supplied to a purchase, as aliases in the customer's VGS vault. With card_mode full it is a whole card: a persistent alias of its number, a freshly collected volatile alias of its security code, its expiry and its last four digits. With card_mode cvc_only it is a CVC alias alone,… */
export type KernelVgsCardInput = {
	/** A volatile alias of a freshly collected security code in the customer's vault. It must still exist when authorize runs. Required in both modes. */
	cvc_alias?: string | null;
	/** Required with card_mode full, rejected with card_mode cvc_only. */
	exp_month?: number | null;
	/** Required with card_mode full, rejected with card_mode cvc_only. */
	exp_year?: number | null;
	/** The card number's last four digits, checked against the revealed alias. Required with card_mode full, rejected with card_mode cvc_only. */
	last4?: string | null;
	/** A persistent alias of the card number in the customer's vault. Required with card_mode full, rejected with card_mode cvc_only. */
	pan_alias?: string | null;
};

/** A ready VGS card supports fill, then submit checkout, until expires_at. Kernel does not observe whether the merchant charged the card. masks.last4 is the card's last four digits. */
export type KernelVgsCardState = {
	/** Informational registrable domain. Fill is locked to merchant_url's exact origin. */
	domains?: Array<string> | null;
	masks?: KernelVaultItemMasks | null;
	provider?: string | null;
	/** requested until authorize reveals the aliases; if the reveal fails before anything is stored, authorize returns 503 provider_unavailable and the card stays requested. declined means authorize was refused: invalid_card for aliases that do not match the card or a card that has expired (fix the… */
	status?: string | null;
	status_reason?: string | null;
};

/** One live purchase with a card in the customer's VGS vault. With card_mode full, authorize reveals card.pan_alias and card.cvc_alias through Kernel's VGS outbound proxy; with card_mode cvc_only, for a card the merchant already holds on file whose checkout page asks only for the security code, it… */
export type KernelVgsCardVaultItemSpec = {
	/** Integer amount in minor currency units (at most 1000000). */
	amount?: number | null;
	/** Required when creating the card. Never returned. */
	card?: KernelVgsCardInput | null;
	/** Which card this purchase supplies, and the only part of it a read returns. full is a whole card from the customer's vault. cvc_only is a card the merchant already holds on file, whose checkout page asks for nothing but the security code. It must match spec.card: a full card that is missing… */
	card_mode?: string | null;
	/** ISO 4217 code. Supported: aud, brl, cad, chf, czk, dkk, eur, gbp, hkd, inr, jpy, krw, mxn, nok, nzd, pln, sek, sgd, usd, zar. */
	currency?: string | null;
	merchant_name?: string | null;
	/** Merchant checkout URL. Fill is allowed only on this URL's origin. */
	merchant_url?: string | null;
	provider?: string | null;
	/** Key of the VGS wallet item whose configuration reads the aliases. */
	wallet?: string | null;
};

export type KernelVgsWalletState = {
	provider?: string | null;
	/** A VGS wallet is connected on creation. pending_authorization or degraded means its creation did not finish; reading the wallet retries it, and a wallet that stays degraded can be deleted and created again. Whether its configuration's credentials still work is checked when a card is authorized. */
	status?: string | null;
	status_reason?: string | null;
};

/** Cards kept in the customer's own VGS vault. The wallet binds a VGS provider configuration and is connected on creation; it holds no cards and has no payment methods. Each purchase is a card item that carries the card's aliases from the customer's vault. The configuration binding cannot be… */
export type KernelVgsWalletVaultItemSpec = {
	provider?: string | null;
	/** Select a VGS configuration. Required, because there are no Kernel-managed VGS credentials for this provider. */
	provider_config?: KernelVaultProviderConfigReference | null;
};

export type KernelWalletVaultItem = {
	action?: KernelVaultItemAction | null;
	available_expansions?: Array<KernelAvailableVaultItemExpansion> | null;
	available_operations?: Array<KernelAvailableVaultItemOperation> | null;
	created_at?: string | null;
	/** Server-generated provider and lifecycle guidance for agents. */
	description?: string | null;
	expanded?: KernelVaultItemExpanded | null;
	expires_at?: string | null;
	id?: string | null;
	/** Immutable item key assigned when the item is created. */
	key?: string | null;
	spec?: KernelWalletVaultItemSpec | null;
	state?: KernelWalletVaultItemState | null;
	type?: string | null;
	updated_at?: string | null;
};

export type KernelWalletVaultItemSpec =
	| KernelLinkWalletVaultItemSpec
	| KernelAgentCardWalletVaultItemSpec
	| KernelKernelWalletVaultItemSpec
	| KernelShopPayWalletVaultItemSpec
	| KernelVgsWalletVaultItemSpec;

export type KernelWalletVaultItemState =
	| KernelLinkWalletState
	| KernelAgentCardWalletState
	| KernelKernelWalletState
	| KernelShopPayWalletState
	| KernelVgsWalletState;

export type KernelWebMCPCustomToolSource = {
	id?: string | null;
	namespace?: string | null;
};

export type KernelWebMCPInvocationResult = {
	error_text?: string | null;
	invocation_id?: string | null;
	/** Untrusted page-provided output. Callers must treat it as potentially malicious input. */
	output?: KernelJsonValue | null;
	/** awaiting_submission means a non-autosubmit declarative form was populated but not submitted. Inspect the form, obtain any required confirmation, then submit through Playwright or computer interaction without invoking the tool again. The other statuses are terminal results. */
	status?: string | null;
};

/** Returns the same tool result fields as the browser WebMCP invoke API, plus the vault operation discriminator. Output and error text are untrusted page-provided data, returned without redaction; tools may include supplied vault values. Inspect the browser page to determine whether the intended… */
export type KernelWebMCPInvokeVaultItemOperationResult = {
	/** Untrusted page-provided error text, returned without redaction. May contain supplied vault values. */
	error_text?: string | null;
	/** Present when the browser reported one. */
	invocation_id?: string | null;
	/** Untrusted page-provided output, returned without redaction. May contain supplied vault values. */
	output?: KernelJsonValue | null;
	/** Unknown means invocation may have run; do not retry automatically. No status confirms that the website accepted the action. */
	status?: string | null;
	type?: string | null;
};

export type KernelWebMCPTool = {
	source?: KernelWebMCPToolSource | null;
	tool?: KernelWebMCPToolMetadata | null;
	/** Opaque reference for invoking this exact live registration. It becomes invalid when its document or browser process is replaced. */
	tool_ref?: string | null;
};

/** Tool-provided behavioral hints from the [MCP tool specification](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool) and the [WebMCP ToolAnnotations definition](https://webmachinelearning.github.io/webmcp/#dictdef-toolannotations). These hints are untrusted and are not… */
export type KernelWebMCPToolAnnotations = {
	autosubmit?: boolean | null;
	consequentialHint?: boolean | null;
	destructiveHint?: boolean | null;
	idempotentHint?: boolean | null;
	openWorldHint?: boolean | null;
	readOnlyHint?: boolean | null;
	untrustedContentHint?: boolean | null;
};

export type KernelWebMCPToolFrame = {
	/** Monotonically increasing identifier for this embedded frame during the current browser process. */
	frame_id?: number | null;
	/** Current frame URL with the fragment omitted. */
	url?: string | null;
};

/** Tool metadata follows the [MCP Tool definition](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#tool) and the [WebMCP RegisteredTool definition](https://webmachinelearning.github.io/webmcp/#dictdef-registeredtool). outputSchema is optional for page and custom tools. */
export type KernelWebMCPToolMetadata = {
	annotations?: KernelWebMCPToolAnnotations | null;
	description?: string | null;
	inputSchema?: Record<string, KernelJsonValue> | null;
	name?: string | null;
	outputSchema?: Record<string, KernelJsonValue> | null;
	title?: string | null;
};

export type KernelWebMCPToolSource = {
	custom?: KernelWebMCPCustomToolSource | null;
	/** Embedded frame that registered the tool, or null when the top-level page registered it. */
	frame?: KernelWebMCPToolFrame | null;
	/** Current title of the top-level page. */
	page_title?: string | null;
	/** Current URL of the top-level page with the fragment omitted. */
	page_url?: string | null;
	/** Monotonically increasing identifier for the tab during the current browser process. */
	tab_id?: number | null;
	/** CDP target ID for a custom tool's registration tab; omitted for page-provided tools. */
	target_id?: string | null;
	/** Monotonically increasing identifier for the browser window during the current browser process. */
	window_id?: number | null;
};

export type KernelWebMCPToolsResponse = {
	tools?: Array<KernelWebMCPTool> | null;
};

export type KernelOperationInputs = {
	'apiKeys.create': {
		/** Number of days until expiry, up to 3650. Use null for never. Cannot be combined with expires_at. */
		days_to_expire?: number | null;
		/** Exact expiry time. Must be in the future and no later than the issuing credential's own expiry. Cannot be combined with days_to_expire. */
		expires_at?: string | null;
		/** Label for the API key (1-255 characters). API keys are not addressable by name. */
		name: string;
		/** Issue a scoped key that may only perform the listed actions on the listed resources. A statement may carry a condition; a `source_ip` condition restricts the statement to requests from inside its CIDR networks. */
		policy?: KernelApiKeyPolicyInput;
		/** Unique project identifier */
		project_id?: string | null;
		/** Link to an active same-organization service account. Requires an organization administrator, explicit project and nonempty policy. Omit for a personal key. */
		service_account_id?: string;
	};
	'apiKeys.delete': {
		/** API key ID */
		id: string;
	};
	'apiKeys.get': {
		/** API key ID */
		id: string;
		/** When true, return the API key even if it has been deleted (soft-deleted), for audit purposes. Defaults to false, which returns 404 for a deleted key. */
		include_deleted?: boolean;
	};
	'apiKeys.list': {
		/** Maximum number of results to return */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Case-insensitive substring match against API key name, creator, and project. API key identifiers and masked keys match by exact value or prefix. */
		query?: string;
		/** Exact-match filter on API key name using the database collation. In production, matching is case- and accent-insensitive. Names are not required to be unique, so multiple keys may match. When status=all or include_deleted=true is set, soft-deleted keys with the same name may also match. */
		name?: string;
		/** Field to sort API keys by. Keys with no expiry or no recorded use sort last for expires_at and last_used_at in either direction. */
		sort_by?: 'created_at' | 'name' | 'expires_at' | 'last_used_at';
		/** Sort direction for API keys. */
		sort_direction?: 'asc' | 'desc';
		/** Filter API keys by status. "active" returns keys that are neither deleted nor expired (default), "expired" returns keys that are not deleted and whose expiry has passed, "deleted" returns only soft-deleted keys, "all" returns every key. */
		status?: 'active' | 'expired' | 'deleted' | 'all';
		/** Return only keys that belong to this service account. */
		service_account_id?: string;
		/** Return only keys that act as a user, or only keys that act as a service account. */
		principal_type?: 'user' | 'service_account';
		/** Return only keys created by this user ID. This is the same person the key's created_by field describes. */
		created_by?: string;
		/** Return only keys scoped to this project ID. The value "org" returns keys that are not scoped to a project. */
		project_id?: string;
		/** Deprecated: use status=all instead. When true, include deleted (soft-deleted) API keys in the results for audit purposes. */
		include_deleted?: boolean;
	};
	'apiKeys.rotate': {
		/** API key ID */
		id: string;
		/** Lifetime in days for the new key, up to 3650. Omit to reuse the rotated key's original lifetime, or never-expires if it had none. */
		days_to_expire?: number | null;
		/** Grace period in days before the rotated key expires. Use 0 to expire it immediately. Omit for the default grace period of 7 days. */
		expire_in_days?: number | null;
	};
	'apiKeys.update': {
		/** API key ID */
		id: string;
		/** New API key name */
		name?: string;
		/** Permissions that fully replace the key's policy. Attaching a policy to a key without one makes the key scoped: every action and resource the policy does not list is denied. The key's credential, name, project, and expiry are unchanged, so consumers never need the key redistributed. A `source_ip`… */
		policy?: KernelApiKeyPolicyInput;
	};
	'apps.list': {
		/** Filter results by application name. */
		app_name?: string;
		/** Filter results by version label. */
		version?: string;
		/** Limit the number of apps to return. */
		limit?: number;
		/** Offset the number of apps to return. */
		offset?: number;
		/** Search apps by name. */
		query?: string;
	};
	'auditLogs.exportChunk': {
		/** Lower bound (inclusive) for the audit record timestamp. */
		start: string;
		/** Upper bound (exclusive) for the audit record timestamp. */
		end: string;
		/** Filter by authentication strategy. */
		auth_strategy?: string;
		/** Filter by service name. */
		service?: string;
		/** Filter by HTTP method. */
		method?: string;
		/** Filter out results by HTTP method. */
		exclude_method?: Array<string>;
		/** Free-text search over path, user ID, email, client IP, and status. */
		search?: string;
		/** Additional user IDs to OR into free-text search. */
		search_user_id?: Array<string>;
		/** Opaque cursor from X-Next-Cursor for the next chunk of older records. */
		cursor?: string;
		/** Maximum number of records to return in this chunk. */
		limit?: number;
		/** Encoding for the returned chunk. */
		format?: 'jsonl' | 'jsonl.gz';
	};
	'auditLogs.exportDestinations.create': {
		bucket: string;
		format: 'jsonl.gz';
		kms_key_id?: string;
		prefix: string;
		region: string;
		role_arn: string;
		type: 's3';
	};
	'auditLogs.exportDestinations.delete': {
		id: string;
	};
	'auditLogs.exportDestinations.get': {
		id: string;
	};
	'auditLogs.exportDestinations.list': {
		/** Limit the number of destinations to return. */
		limit?: number;
		/** Offset the number of destinations to return. */
		offset?: number;
	};
	'auditLogs.exportDestinations.test': {
		id: string;
	};
	'auditLogs.exportDestinations.update': {
		id: string;
		bucket?: string;
		/** KMS key ID, alias, or ARN. Set to an empty string to remove the configured KMS key; omit or send null to leave unchanged. */
		kms_key_id?: string | null;
		prefix?: string;
		region?: string;
		role_arn?: string;
		status?: 'active' | 'paused';
	};
	'auditLogs.list': {
		/** Lower bound (inclusive) for the audit record timestamp. */
		start: string;
		/** Upper bound (exclusive) for the audit record timestamp. */
		end: string;
		/** Filter by authentication strategy. */
		auth_strategy?: string;
		/** Filter by service name. */
		service?: string;
		/** Filter by HTTP method. */
		method?: string;
		/** Filter out results by HTTP method. */
		exclude_method?: Array<string>;
		/** Free-text search over path, user ID, email, client IP, and status. */
		search?: string;
		/** Additional user IDs to OR into free-text search. */
		search_user_id?: Array<string>;
		/** Maximum number of results to return. */
		limit?: number;
		/** Opaque page token from X-Next-Page-Token for the next page of older records. */
		page_token?: string;
	};
	'auth.connections.create': {
		/** Additional hostname roots valid for this auth flow, besides the primary domain. Each value allows credential entry on that exact hostname and its subdomains. Leading `www.` and `*.` labels are normalized away. When omitted or empty, credential entry is unrestricted. The following SSO/OAuth… */
		allowed_domains?: Array<string>;
		/** Whether to permit automatic re-authentication when a scheduled health check detects an expired session. This is an opt-in flag only — it does not check whether re-auth is actually feasible. Even when true, re-auth only runs when the system has what it needs to perform it (for example, saved… */
		auto_reauth?: boolean;
		/** Default browser configuration for login, reauthentication, and health-check sessions. */
		browser?: KernelManagedAuthBrowserConfigInput;
		/** Deprecated. Use browser.telemetry. Retained during migration for existing clients. */
		browser_telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		credential?: KernelCredentialReferenceInput;
		/** Domain for authentication */
		domain: string;
		/** Interval in seconds between automatic health checks. When set, the system periodically verifies the authentication status and triggers re-authentication if needed. Maximum is 86400 (24 hours). Default is 3600 (1 hour) or your plan minimum, whichever is larger. The minimum depends on your plan:… */
		health_check_interval?: number;
		/** Whether to enable periodic health checks. When false, the system will not automatically verify authentication status, and `auto_reauth` has no effect on the automatic flow (since re-auth is only triggered by a failed scheduled health check). Defaults to true. */
		health_checks?: boolean;
		/** Whether a login blocked by a CAPTCHA the browser cannot solve pauses for a person instead of failing. The flow moves to AWAITING_HUMAN_INTERVENTION with a `human_intervention` choice; the person completes the challenge in `live_view_url`, then submits that choice to resume. Reauthentication… */
		hitl?: boolean;
		/** Optional login page URL to skip discovery */
		login_url?: string;
		/** Name of the profile to manage authentication for. If the profile does not exist, it is created automatically. */
		profile_name: string;
		/** Deprecated. Use browser.proxy. Retained during migration for existing clients. */
		proxy?: KernelProxyRefInput;
		/** Whether to record browser sessions for this connection by default. Useful for debugging. Can be overridden per-login. Defaults to false. */
		record_session?: boolean;
		/** Whether to save credentials after every successful login. Defaults to true. One-time codes (TOTP, SMS, etc.) are not saved. */
		save_credentials?: boolean;
	};
	'auth.connections.delete': {
		/** Auth connection ID */
		id: string;
	};
	'auth.connections.exchange': {
		/** Auth connection ID */
		id: string;
		/** Handoff code from start endpoint */
		code: string;
	};
	'auth.connections.get': {
		/** Auth connection ID */
		id: string;
	};
	'auth.connections.list': {
		/** Filter by profile name */
		profile_name?: string;
		/** Filter by domain */
		domain?: string;
		/** Maximum number of results to return */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Search auth connections by ID, domain, or profile name. */
		query?: string;
	};
	'auth.connections.login': {
		/** Auth connection ID */
		id: string;
		/** Browser configuration override for this login. Omitted properties inherit the connection defaults. */
		browser?: KernelManagedAuthBrowserConfigInput;
		/** Deprecated. Use browser.telemetry. Retained during migration for existing clients. */
		browser_telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		/** Deprecated. Use browser.proxy. Retained during migration for existing clients. */
		proxy?: KernelProxyRefInput;
		/** Override the connection's default for recording this login's browser session. When omitted, the connection's record_session default is used. */
		record_session?: boolean;
		/** Controls whether this login reads and writes learned domain skills. Automatic reauths inherit the selected mode until a later accepted login sets enabled or omits this field. Defaults to enabled when omitted. */
		skill_mode?: 'enabled' | 'disabled';
	};
	'auth.connections.submit': {
		/** Auth connection ID */
		id: string;
		/** Canonical map of field ID to submitted value. */
		field_values?: Record<string, string>;
		/** Map of field name to value */
		fields?: Record<string, string>;
		/** Opaque interaction ID returned with canonical fields and choices. Required for canonical submissions. */
		interaction_id?: string;
		/** The MFA method type to select (when mfa_options were returned) */
		mfa_option_id?: string;
		/** Canonical choice ID selected by the user. */
		selected_choice_id?: string;
		/** The sign-in option ID to select (when sign_in_options were returned) */
		sign_in_option_id?: string;
		/** XPath selector for the SSO button to click (ODA). Use sso_provider instead for CUA. */
		sso_button_selector?: string;
		/** SSO provider to click, matching the provider field from pending_sso_buttons (e.g., "google", "github"). Cannot be used with sso_button_selector. */
		sso_provider?: string;
	};
	'auth.connections.timeline': {
		/** Auth connection ID */
		id: string;
		/** Filter the timeline to a single event type. */
		type?: 'login' | 'reauth' | 'health_check';
		/** Maximum number of events to return */
		limit?: number;
		/** Number of events to skip */
		offset?: number;
	};
	'auth.connections.update': {
		/** Auth connection ID */
		id: string;
		/** Additional hostname roots valid for this auth flow. Each value allows credential entry on that exact hostname and its subdomains; leading `www.` and `*.` labels are normalized away. An empty list leaves credential entry unrestricted. Replaces the existing list. */
		allowed_domains?: Array<string>;
		/** Whether automatic re-authentication is permitted for this connection. This is an opt-in flag only — it does not check whether re-auth is actually feasible. Even when true, re-auth only runs when the system has what it needs to perform it (for example, saved credentials for the required login… */
		auto_reauth?: boolean;
		/** Browser configuration updates for future login, reauthentication, and health-check sessions. Omitted properties remain unchanged. */
		browser?: KernelManagedAuthBrowserConfigInput;
		/** Deprecated. Use browser.telemetry. Retained during migration for existing clients. */
		browser_telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		credential?: KernelCredentialReferenceInput;
		/** Interval in seconds between automatic health checks */
		health_check_interval?: number;
		/** Whether periodic health checks are enabled. When set to false, the system will not automatically verify authentication status, and `auto_reauth` has no effect on the automatic flow (since re-auth is only triggered by a failed scheduled health check). */
		health_checks?: boolean;
		/** Whether a login blocked by a CAPTCHA the browser cannot solve pauses for a person instead of failing */
		hitl?: boolean;
		/** Login page URL. Set to empty string to clear. */
		login_url?: string;
		/** Deprecated. Use browser.proxy. Retained during migration for existing clients. */
		proxy?: KernelProxyRefInput;
		/** Whether to record browser sessions for this connection by default */
		record_session?: boolean;
		/** Whether to save credentials after every successful login */
		save_credentials?: boolean;
	};
	'auth.context.get': Record<string, never>;
	'browserPools.acquire': {
		/** Browser pool ID or name */
		id_or_name: string;
		/** Maximum number of seconds to wait for a browser to be available. Defaults to the calculated time it would take to fill the pool at the currently configured fill rate. */
		acquire_timeout_seconds?: number;
		/** Optional human-readable name for the acquired browser session, used to find it later in the dashboard. Must be unique among active sessions within the pool's project. Applies to this lease only and is cleared when the browser is released back to the pool. */
		name?: string;
		/** Optional profile to load before returning the acquired browser. The pool itself must not already have a profile configured. A browser loaded with an acquire-time profile is destroyed and replaced on release instead of being reused, so profile state cannot leak into another lease. Set… */
		profile?: KernelBrowserProfileInput;
		/** Start replay recording immediately for the acquired browser. Omit to use the pool's configured default. */
		start_replay?: boolean;
		/** Optional URL to navigate the acquired browser to. Overrides the pool's start_url for this acquire only. Best-effort: failures to navigate do not fail the acquire. */
		start_url?: string;
		/** Optional user-defined key-value tags for the acquired browser session, used to find and group sessions later. Applies to this lease only and are cleared when the browser is released back to the pool. Up to 50 pairs. */
		tags?: KernelTagsInput;
		/** Telemetry override for the acquired browser, applied to this lease only. Merges onto the browser's current (pool-inherited) telemetry using the same per-category semantics as PATCH /browsers: provided categories override the current configuration, omitted categories are inherited. Set enabled to… */
		telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
	};
	'browserPools.create': {
		/** Automatic CAPTCHA solving for browsers in this pool. Disabled by default. Enabling it does not select a proxy: when proxy_id is omitted, browsers use direct egress unless stealth=true. */
		captcha_solver?: KernelBrowserCaptchaSolverInput;
		/** Custom Chrome enterprise policy overrides applied to all browsers in this pool. Keys are Chrome enterprise policy names; values must match their expected types. Blocked: kernel-managed policies (extensions, proxy, CDP/automation). See https://chromeenterprise.google/policies/ The serialized JSON… */
		chrome_policy?: Record<string, KernelJsonValue>;
		/** List of browser extensions to load into the session. Provide each by id or name. */
		extensions?: Array<KernelBrowserExtensionInput>;
		/** Percentage of the pool to fill per minute. Defaults to 25. The cap is 25 for most organizations but can be raised per-organization, so only the lower bound is enforced here. */
		fill_rate_per_minute?: number;
		/** If true, launches the browser using a headless image. Defaults to false. */
		headless?: boolean;
		/** If true, launches the browser in kiosk mode to hide address bar and tabs in live view. Defaults to false. */
		kiosk_mode?: boolean;
		/** Memory for browsers in this pool. Headless: 1GiB (default), 2GiB, or 4GiB. Headful: 8GiB (default) or 16GiB. */
		memory?: KernelBrowserMemoryRequestInput;
		/** Optional name for the browser pool. Must be unique within the project. */
		name?: string;
		/** Network configuration applied to browsers in this pool. Egress allowlists and proxy routes require proxy-v3; the pool will not provision browsers through Envoy if proxy-v3 is unavailable. */
		network?: KernelBrowserNetworkConfigInput;
		/** Profile selection for browsers in the pool. */
		profile?: KernelBrowserPoolProfileInput;
		/** Optional proxy to associate to the browser session. Must reference a proxy in the same project as the browser session. */
		proxy_id?: string;
		/** When true, flush idle browsers when the profile the pool uses is updated, so pool browsers pick up the latest profile data. When a profile is provided during creation, this defaults to true. Requires a profile to be set on the pool. */
		refresh_on_profile_update?: boolean;
		/** Geographic region for the browser pool. It is fixed once the pool is created. Region selection requires a Start-Up or Enterprise plan, defaults to us-east when omitted on create. */
		region?: KernelRegionInput;
		/** Number of browsers to maintain in the pool. The maximum size is determined by your organization's pooled sessions limit (the sum of all pool sizes cannot exceed your limit). */
		size: number;
		/** Start replay recording automatically when a browser is acquired from this pool. */
		start_replay?: boolean;
		/** Optional URL to navigate to when a new browser is warmed into the pool. Best-effort: failures to navigate do not fail pool fill. Only applied to newly-warmed browsers; browsers reused via release/acquire keep whatever URL the previous lease left them on. Accepts any URL Chromium can resolve,… */
		start_url?: string;
		/** If true, enables the CAPTCHA solver and, when proxy_id is omitted, uses Kernel's default stealth proxy. Defaults to false. Cannot be combined with captcha_solver.enabled=false. Deprecated in favor of captcha_solver and proxy_id. */
		stealth?: boolean;
		/** Telemetry configuration applied to browsers warmed into this pool. Set enabled to true to start capture using the default set, or provide browser category settings. If omitted, null, set to an empty object ({}), set to enabled: false without browser category settings, or all four CDP categories… */
		telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		/** Default idle timeout in seconds for browsers acquired from this pool before they are destroyed. Defaults to 600 seconds. Minimum 10, maximum 259200 (72 hours). */
		timeout_seconds?: number;
		/** Browser viewport used for newly-warmed browsers in this pool. */
		viewport?: KernelBrowserViewportInput;
	};
	'browserPools.delete': {
		/** Browser pool ID or name */
		id_or_name: string;
		/** If true, force delete even if browsers are currently leased. Leased browsers will be terminated. */
		force?: boolean;
	};
	'browserPools.flush': {
		/** Browser pool ID or name */
		id_or_name: string;
	};
	'browserPools.get': {
		/** Browser pool ID or name */
		id_or_name: string;
	};
	'browserPools.list': {
		/** Limit the number of browser pools to return. */
		limit?: number;
		/** Offset the number of browser pools to return. */
		offset?: number;
		/** Case-insensitive substring match against browser pool name. IDs match by exact value. */
		query?: string;
		/** Exact-match filter on browser pool name using the database collation. In production, matching is case- and accent-insensitive. During the default-project migration, unscoped requests prefer a concrete default-project browser pool over a legacy unscoped browser pool with the same name. */
		name?: string;
		/** Filter pools by geographic region. Omit to list pools in all regions. */
		region?: KernelRegionInput;
	};
	'browserPools.release': {
		/** Browser pool ID or name */
		id_or_name: string;
		/** Whether to reuse the browser instance or destroy it and create a new one. Defaults to true. A reused browser keeps the configuration it was created with, so it does not pick up pool configuration changes made while it was in use. Release with `reuse: false`, or flush the pool afterward, to… */
		reuse?: boolean;
		/** Browser session ID to release back to the pool */
		session_id: string;
	};
	'browserPools.update': {
		/** Browser pool ID or name */
		id_or_name: string;
		/** If provided, replaces whether browsers in this pool automatically solve CAPTCHAs. Enabling it on a pool with direct egress keeps direct egress unless proxy_id or stealth=true is also set. */
		captcha_solver?: KernelBrowserCaptchaSolverInput;
		/** If provided, replaces the custom Chrome enterprise policy overrides applied to all browsers in this pool. Empty object clears any previously-set policy. Keys are Chrome enterprise policy names; values must match their expected types. Blocked: kernel-managed policies (extensions, proxy,… */
		chrome_policy?: Record<string, KernelJsonValue>;
		/** Whether to discard all idle browsers and rebuild them immediately with the new configuration. Defaults to false. Only browsers that are idle when the update runs are rebuilt. A browser that is in use during the update keeps its original configuration, except that its allowlist is reset to the… */
		discard_all_idle?: boolean;
		/** Optional optimistic concurrency precondition. Send the network configuration from the last pool response, or {} when it has no network configuration. The entire update is rejected with 409 stale_network if the saved network differs, checked atomically with the write. Omit for unconditional… */
		expected_network?: KernelBrowserNetworkConfigInput;
		/** If provided, replaces the extension list. Empty array clears all previously-selected extensions. Omit this field to leave extensions unchanged. */
		extensions?: Array<KernelBrowserExtensionInput>;
		/** If provided, replaces the percentage of the pool to fill per minute. The cap is 25 for most organizations but can be raised per-organization, so only the lower bound is enforced here. */
		fill_rate_per_minute?: number;
		/** If provided, replaces whether browsers launch using a headless image. */
		headless?: boolean;
		/** If provided, replaces whether browsers launch in kiosk mode. */
		kiosk_mode?: boolean;
		/** Memory requested for newly-warmed browsers in this pool: 1GiB, 2GiB, or 4GiB for headless, 8GiB or 16GiB for headful. Existing browsers retain their original allocation. Use discard_all_idle to replace idle browsers. */
		memory?: '1GiB' | '2GiB' | '4GiB' | '8GiB' | '16GiB';
		/** If provided, replaces the pool name. Empty string is a no-op; the pool name cannot be cleared or reset to empty once assigned. */
		name?: string;
		/** If provided, replaces the pool's network configuration. Omit to leave the existing configuration unchanged; an empty object ({}) removes it, while network: {private_hosts: []} or network: {proxy_routes: []} sets an explicit empty list; allowed_hosts must be non-empty when supplied. Egress… */
		network?: KernelBrowserNetworkConfigInput;
		/** If provided, replaces the previously-selected profile. To clear the profile reference, send `{ "id": "" }` or `{ "name": "" }`. An empty object (no id or name) is rejected as 400. */
		profile?: KernelBrowserPoolProfileInput;
		/** Empty string clears the previously-selected proxy. Omit this field to leave the proxy unchanged. */
		proxy_id?: string;
		/** If provided, replaces whether idle browsers are flushed when the profile the pool uses is updated. When the pool's profile reference is changed (including newly attached) and this field is omitted, it defaults to true. Re-sending the same profile reference leaves this setting unchanged. Clearing… */
		refresh_on_profile_update?: boolean;
		/** If provided, replaces the number of browsers to maintain in the pool. The maximum size is determined by your organization's pooled sessions limit (the sum of all pool sizes cannot exceed your limit). */
		size?: number;
		/** If provided, replaces whether replay recording starts automatically for future acquired browsers. */
		start_replay?: boolean;
		/** If provided, replaces the URL to navigate to when a new browser is warmed into the pool. Empty string clears the previously-set URL. Omit this field to leave it unchanged. */
		start_url?: string;
		/** If provided, replaces whether browsers launch in stealth mode. stealth=true without proxy_id moves a pool on direct egress to Kernel's default stealth proxy. Cannot be combined with captcha_solver.enabled=false. Deprecated in favor of captcha_solver and proxy_id. */
		stealth?: boolean;
		/** If provided, updates the pool's telemetry configuration. Omit, set to null, or set to an empty object ({}) to leave the existing configuration unchanged. Set enabled to true to enable capture using the default set. Set enabled to false to clear the pool's telemetry. Provide browser category… */
		telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		/** If provided, replaces the default idle timeout in seconds for browsers acquired from this pool before they are destroyed. Minimum 10, maximum 259200 (72 hours). */
		timeout_seconds?: number;
		/** If provided, replaces the viewport with the new width/height/refresh_rate. Because width and height are required and must be positive, the viewport cannot be cleared; omit this field to leave it unchanged. */
		viewport?: KernelBrowserViewportInput;
	};
	'browsers.computer.batch': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Ordered list of actions to execute. Execution stops on the first error. */
		actions: Array<KernelComputerActionInput>;
	};
	'browsers.computer.captureScreenshot': {
		/** Browser session ID or name */
		id_or_name: string;
		region?: KernelScreenshotRegionInput;
	};
	'browsers.computer.clickMouse': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Mouse button to interact with */
		button?: 'left' | 'right' | 'middle' | 'back' | 'forward';
		/** Type of click action */
		click_type?: 'down' | 'up' | 'click';
		/** Modifier keys to hold during the click */
		hold_keys?: Array<string>;
		/** Number of times to repeat the click */
		num_clicks?: number;
		/** Y coordinate of the click position */
		y: number;
		/** X coordinate of the click position */
		x: number;
	};
	'browsers.computer.dragMouse': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Mouse button to drag with */
		button?: 'left' | 'middle' | 'right';
		/** Delay in milliseconds between button down and starting to move along the path. */
		delay?: number;
		/** Target total duration in milliseconds for the entire drag movement when smooth=true. Omit for automatic timing based on total path length. */
		duration_ms?: number;
		/** Modifier keys to hold during the drag */
		hold_keys?: Array<string>;
		/** Ordered list of [x, y] coordinate pairs to move through while dragging. Must contain at least 2 points. */
		path: Array<Array<number>>;
		/** Use human-like Bezier curves between path waypoints instead of linear interpolation. When true, steps_per_segment and step_delay_ms are ignored. */
		smooth?: boolean;
		/** Delay in milliseconds between relative steps while dragging (not the initial delay). */
		step_delay_ms?: number;
		/** Number of relative move steps per segment in the path. Minimum 1. */
		steps_per_segment?: number;
	};
	'browsers.computer.getMousePosition': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.computer.moveMouse': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Target total duration in milliseconds for the mouse movement when smooth=true. Omit for automatic timing based on distance. */
		duration_ms?: number;
		/** Modifier keys to hold during the move */
		hold_keys?: Array<string>;
		/** Use human-like Bezier curve path instead of instant mouse movement. */
		smooth?: boolean;
		/** Y coordinate to move the cursor to */
		y: number;
		/** X coordinate to move the cursor to */
		x: number;
	};
	'browsers.computer.pressKey': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Duration to hold the keys down in milliseconds. If omitted or 0, keys are tapped. */
		duration?: number;
		/** Optional modifier keys to hold during the key press sequence. */
		hold_keys?: Array<string>;
		/** List of key symbols to press. Each item should be a key symbol supported by xdotool (see X11 keysym definitions). Examples include "Return", "Shift", "Ctrl", "Alt", "F5". Items in this list could also be combinations, e.g. "Ctrl+t" or "Ctrl+Shift+Tab". Use X11 names for punctuation in… */
		keys: Array<string>;
	};
	'browsers.computer.readClipboard': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.computer.scroll': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Horizontal scroll amount in xdotool "wheel units." Positive scrolls right, negative scrolls left. */
		delta_x?: number;
		/** Vertical scroll amount in xdotool "wheel units." Positive scrolls down, negative scrolls up. */
		delta_y?: number;
		/** Modifier keys to hold during the scroll */
		hold_keys?: Array<string>;
		/** Y coordinate at which to perform the scroll */
		y: number;
		/** X coordinate at which to perform the scroll */
		x: number;
	};
	'browsers.computer.setCursorVisibility': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Whether the cursor should be hidden or visible */
		hidden: boolean;
	};
	'browsers.computer.typeText': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Delay in milliseconds between keystrokes */
		delay?: number;
		/** Text to type on the browser instance */
		text: string;
	};
	'browsers.computer.writeClipboard': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Text to write to the system clipboard */
		text: string;
	};
	'browsers.create': {
		/** Automatic CAPTCHA solving. Disabled by default. Enabling it does not select a proxy: when proxy is omitted, the browser uses direct egress unless stealth=true. */
		captcha_solver?: KernelBrowserCaptchaSolverInput;
		/** Custom Chrome enterprise policy overrides applied to this browser session. Keys are Chrome enterprise policy names; values must match their expected types. Blocked: kernel-managed policies (extensions, proxy, CDP/automation). See https://chromeenterprise.google/policies/ */
		chrome_policy?: Record<string, KernelJsonValue>;
		/** List of browser extensions to load into the session. Provide each by id or name. */
		extensions?: Array<KernelBrowserExtensionInput>;
		/** Closed beta: contact Kernel to enable fingerprint overrides for your organization. Overrides browser attributes presented to websites for this session. Supports linux and macos and requires captcha_solver.enabled=true, headless=false, gpu=false, and default memory. Omit to preserve the default… */
		fingerprint?: KernelBrowserFingerprintInput;
		/** If true, enables GPU acceleration for the browser session. Requires Start-Up or Enterprise plan, headless=false, and region=us-east. */
		gpu?: boolean;
		/** If true, launches the browser using a headless image (no VNC/GUI). Defaults to false. */
		headless?: boolean;
		/** action invocation ID */
		invocation_id?: string;
		/** If true, launches the browser in kiosk mode to hide address bar and tabs in live view. */
		kiosk_mode?: boolean;
		/** Optional session-only timezone and locale overrides. Each omitted field uses the default for the browser's region. start_url opens once the location applies. */
		location?: KernelBrowserLocationRequestInput;
		/** Memory for a non-GPU browser. Headless: 1GiB (default), 2GiB, or 4GiB. Headful: 8GiB (default) or 16GiB. */
		memory?: KernelBrowserMemoryRequestInput;
		/** Optional human-readable name for the browser session, used to find it later in the dashboard. Must be unique among active sessions within the project. Can be changed later via PATCH /browsers/{id_or_name}. */
		name?: string;
		/** Network configuration for the browser session. Only allowed_hosts can be changed after creation, with PATCH /browsers/{id_or_name}. */
		network?: KernelBrowserNetworkConfigInput;
		profile?: KernelBrowserProfileInput;
		/** Proxy configuration for the browser session. Cannot be combined with proxy_id. Omit to use direct egress, or Kernel's default stealth proxy when stealth=true. Set mode to direct to force direct egress. Set mode to default to use Kernel's default stealth proxy when captcha_solver.enabled=true, or… */
		proxy?: KernelBrowserProxyConfigInput;
		/** Optional proxy to associate to the browser session. Must reference a proxy in the same project as the browser session. Deprecated in favor of proxy. */
		proxy_id?: string;
		/** Geographic region for the browser session. It is fixed once the session is created. Region selection requires a Start-Up or Enterprise plan, defaults to us-east when omitted on create. */
		region?: KernelRegionInput;
		/** Start replay recording as part of creating this browser session. */
		start_replay?: boolean;
		/** Optional URL to open when the browser session is created. Navigation is best-effort, so navigation failures do not prevent the session from being created. */
		start_url?: string;
		/** If true, enables the CAPTCHA solver and, when proxy is omitted, uses Kernel's default stealth proxy. Defaults to false. Equivalent to captcha_solver.enabled=true with proxy.mode=default. Cannot be combined with captcha_solver.enabled=false. Deprecated in favor of captcha_solver and proxy. */
		stealth?: boolean;
		/** Optional user-defined key-value tags for the browser session, used to find and group sessions later. Can be changed later via PATCH /browsers/{id_or_name}. Up to 50 pairs. */
		tags?: KernelTagsInput;
		/** Telemetry configuration for the browser session. Set enabled to true to start capture using VM defaults, or provide browser category settings. If omitted, null, set to an empty object ({}), set to enabled: false without browser category settings, or all four categories are explicitly disabled,… */
		telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		/** The number of seconds of inactivity before the browser session is terminated. Activity includes CDP connections and live view connections. Defaults to 60 seconds. Minimum allowed is 10 seconds. Maximum allowed is 259200 (72 hours). We check for inactivity every 5 seconds, so the actual timeout… */
		timeout_seconds?: number;
		/** Project-scoped vaults to link to the browser session. Links are immutable after creation. */
		vaults?: Array<KernelVaultReferenceInput>;
		/** Video memory (VRAM) for a GPU browser session. Requires gpu=true. Defaults to 3GiB, which comes with 4 vCPU and 6GiB memory. 6GiB comes with 8 vCPU and 12GiB memory. 2GiB and 4GiB are deprecated aliases for 3GiB and 6GiB. */
		video_memory?: KernelBrowserVideoMemoryInput;
		viewport?: KernelBrowserViewportInput;
	};
	'browsers.curl': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Request body (for POST/PUT/PATCH). */
		body?: string;
		/** Custom headers merged with browser defaults. */
		headers?: Record<string, string>;
		/** HTTP method. */
		method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
		/** Encoding for the response body. Use base64 for binary content. */
		response_encoding?: 'utf8' | 'base64';
		/** Request timeout in milliseconds. */
		timeout_ms?: number;
		/** Target URL (must be http or https). */
		url: string;
	};
	'browsers.delete': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.fs.createDirectory': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Optional directory mode (octal string, e.g. 755). Defaults to 755. */
		mode?: string;
		/** Absolute directory path to create. */
		path: string;
	};
	'browsers.fs.deleteDirectory': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute path to delete. */
		path: string;
	};
	'browsers.fs.deleteFile': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute path to delete. */
		path: string;
	};
	'browsers.fs.downloadDirZip': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute directory path to archive and download. */
		path: string;
	};
	'browsers.fs.fileInfo': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute path of the file or directory. */
		path: string;
	};
	'browsers.fs.listFiles': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute directory path. */
		path: string;
	};
	'browsers.fs.move': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute destination path. */
		dest_path: string;
		/** Absolute source path. */
		src_path: string;
	};
	'browsers.fs.readFile': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute file path to read. */
		path: string;
	};
	'browsers.fs.setFilePermissions': {
		/** Browser session ID or name */
		id_or_name: string;
		/** New group name or GID. */
		group?: string;
		/** File mode bits (octal string, e.g. 644). */
		mode: string;
		/** New owner username or UID. */
		owner?: string;
		/** Absolute path whose permissions are to be changed. */
		path: string;
	};
	'browsers.fs.upload': {
		/** Browser session ID or name */
		id_or_name: string;
		files: Array<{
			/** Absolute destination path to write the file. */
			dest_path: string;
			file: FileInput;
		}>;
	};
	'browsers.fs.uploadZip': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Absolute destination directory to extract the archive to. */
		dest_path: string;
		zip_file: FileInput;
	};
	'browsers.fs.watch.start': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Directory to watch. */
		path: string;
		/** Whether to watch recursively. */
		recursive?: boolean;
	};
	'browsers.fs.watch.stop': {
		/** Browser session ID or name */
		id_or_name: string;
		watch_id: string;
	};
	'browsers.fs.writeFile': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Destination absolute file path. */
		path: string;
		/** Optional file mode (octal string, e.g. 644). Defaults to 644. */
		mode?: string;
		/** The file contents to write. */
		file: FileInput;
	};
	'browsers.get': {
		/** Browser session ID or name */
		id_or_name: string;
		/** When true, includes soft-deleted browser sessions in the lookup. */
		include_deleted?: boolean;
	};
	'browsers.list': {
		/** Filter sessions by status. "active" returns only active sessions (default), "deleted" returns only soft-deleted sessions, "all" returns both. */
		status?: 'active' | 'deleted' | 'all';
		/** Deprecated: Use status=all instead. When true, includes soft-deleted browser sessions in the results alongside active sessions. */
		include_deleted?: boolean;
		/** Maximum number of results to return. Defaults to 20, maximum 100. */
		limit?: number;
		/** Number of results to skip. Defaults to 0. */
		offset?: number;
		/** Search browsers by name, session ID, profile name or ID, proxy ID, or pool name. */
		query?: string;
		/** Filter sessions by tag key-value pairs using deepObject style, e.g. ?tags[team]=backend&tags[env]=staging. Multiple pairs are ANDed: a session must match every supplied pair exactly. */
		tags?: Record<string, string>;
		/** Filter sessions by geographic region. Omit to list sessions in all regions. */
		region?: KernelRegionInput;
	};
	'browsers.liveView.create': {
		/** Browser session ID or name */
		id_or_name: string;
		scope?: KernelBrowserLiveViewScopeInput;
		/** Seconds until the URL expires. Omit to keep it valid until the browser is deleted. */
		ttl_seconds?: number;
	};
	'browsers.loadExtensions': {
		/** Browser session ID or name */
		id_or_name: string;
		/** List of extensions to upload and activate */
		extensions: Array<{
			/** Folder name to place the extension under /home/kernel/extensions/<name> */
			name: string;
			/** Zip archive containing an unpacked Chromium extension (must include manifest.json) */
			zip_file: FileInput;
		}>;
	};
	'browsers.playwright.execute': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Makes retrying the call safe. A call with a key already used on this browser returns the first call's response instead of running the code again, waiting for it if it is still running. A call with a key keeps running for 10 seconds after its last caller disconnects, so a retry can collect its… */
		idempotency_key?: string;
		/** TypeScript/JavaScript code to execute. The code has access to 'page', 'context', and 'browser' variables. It runs within a function, so you can use a return statement at the end to return a value. This value is returned as the `result` property in the response. Example: "await… */
		code: string;
		executor?: KernelPlaywrightExecutorNameInput;
		/** Maximum execution time in seconds. Default is 60. */
		timeout_sec?: number;
	};
	'browsers.playwright.executors.delete': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Executor name */
		name: KernelPlaywrightExecutorNameInput;
		/** Close the executor's tab. Defaults to true. */
		close_tab?: boolean;
	};
	'browsers.playwright.executors.list': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.process.exec': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Command arguments. */
		args?: Array<string>;
		/** Run the process with root privileges. */
		as_root?: boolean;
		/** Run the process as this user. */
		as_user?: string | null;
		/** Executable or shell command to run. */
		command: string;
		/** Working directory (absolute path) to run the command in. */
		cwd?: string | null;
		/** Environment variables to set for the process. */
		env?: Record<string, string>;
		/** Maximum execution time in seconds. */
		timeout_sec?: number | null;
	};
	'browsers.process.kill': {
		/** Browser session ID or name */
		id_or_name: string;
		process_id: string;
		/** Signal to send. */
		signal: 'TERM' | 'KILL' | 'INT' | 'HUP';
	};
	'browsers.process.resize': {
		/** Browser session ID or name */
		id_or_name: string;
		process_id: string;
		/** New terminal columns. */
		cols: number;
		/** New terminal rows. */
		rows: number;
	};
	'browsers.process.spawn': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Command arguments. */
		args?: Array<string>;
		/** Run the process with root privileges. */
		as_root?: boolean;
		/** Run the process as this user. */
		as_user?: string | null;
		/** Executable or shell command to run. */
		command: string;
		/** Working directory (absolute path) to run the command in. */
		cwd?: string | null;
		/** Environment variables to set for the process. */
		env?: Record<string, string>;
		/** Maximum execution time in seconds. */
		timeout_sec?: number | null;
		/** Allocate a pseudo-terminal (PTY) for interactive shells. */
		allocate_tty?: boolean;
		/** Initial terminal columns. Only used when allocate_tty is true. */
		cols?: number;
		/** Initial terminal rows. Only used when allocate_tty is true. */
		rows?: number;
	};
	'browsers.process.status': {
		/** Browser session ID or name */
		id_or_name: string;
		process_id: string;
	};
	'browsers.process.stdin': {
		/** Browser session ID or name */
		id_or_name: string;
		process_id: string;
		/** Base64-encoded data to write. */
		data_b64: string;
	};
	'browsers.repl': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Makes retrying the call safe. A call with a key already used on this browser returns the first call's response instead of running the code again, waiting for it if it is still running. A call with a key keeps running for 10 seconds after its last caller disconnects, so a retry can collect its… */
		idempotency_key?: string;
		/** JavaScript evaluated in a persistent Node.js runtime. Top-level bindings persist until the browser VM's API process exits, the REPL is reset, or the REPL is terminated after a crash or timeout. Static top-level imports are unsupported; use dynamic `import()`. Expression values are ignored; emit… */
		code: string;
		/** Terminate the current REPL, start a fresh one, and then evaluate code. */
		reset?: boolean;
		/** Maximum execution time in seconds. Default is 60. */
		timeout_sec?: number;
	};
	'browsers.replays.download': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Replay recording identifier */
		replay_id: string;
	};
	'browsers.replays.list': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.replays.start': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Recording framerate in fps. Values above 20 require GPU to be enabled on the browser session. */
		framerate?: number;
		/** Maximum recording duration in seconds. */
		max_duration_in_seconds?: number;
		/** Record audio in addition to video. When false (the default), the recording is video-only. */
		record_audio?: boolean;
	};
	'browsers.replays.stop': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Replay recording identifier */
		replay_id: string;
	};
	'browsers.saveProfile': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Existing profile ID to overwrite. */
		id?: string;
		/** Profile name to overwrite or create. */
		name?: string;
	};
	'browsers.telemetry.events': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Opaque pagination cursor: pass the X-Next-Offset value from the previous response to fetch the next page. When set, paging continues from this cursor and since is ignored, while until still bounds the page. It is not an event's seq field, so do not derive it from the response body. */
		offset?: number;
		/** Start of the window: an RFC-3339 timestamp, or a duration like 5m meaning that long ago. Defaults to 5m. Ignored when offset is set. */
		since?: string;
		/** End of the window (exclusive): an RFC-3339 timestamp, or a duration like 5m meaning that long ago. */
		until?: string;
		/** Maximum number of events per page. Defaults to 20. */
		limit?: number;
		/** Restrict results to these event categories. Repeat the parameter for multiple values. */
		category?: Array<
			| 'console'
			| 'network'
			| 'page'
			| 'interaction'
			| 'control'
			| 'platform'
			| 'connection'
			| 'system'
			| 'screenshot'
			| 'captcha'
			| 'monitor'
		>;
		/** Restrict results to these event types, such as page_crashed or captcha_challenge_result. Repeat the parameter for multiple values. Combines with category: when both are set an event must match both. */
		type?: Array<string>;
		/** Read direction. asc (default) reads oldest first, starting from since or the offset cursor. desc reads newest first: each request returns one page of up to limit records ending at the offset cursor (or until, or the newest archived event); combining desc with since is rejected with a 400. */
		order?: string;
	};
	'browsers.update': {
		/** Browser session ID or name */
		id_or_name: string;
		/** If true, stealth browsers connect directly instead of using the default stealth proxy. Deprecated in favor of proxy.mode. */
		disable_default_proxy?: boolean;
		/** Session-only timezone and locale overrides. Omit the object or a field to leave it unchanged; set a string to override; set null to clear that field and use the browser region's default. A browser that cannot change location refuses the request before anything changes. The location applies after… */
		location?: KernelBrowserLocationUpdateRequestInput;
		/** Human-readable name for the browser session. Omit to leave unchanged, set to an empty string to clear the name. When set, must be unique among active sessions within the project. */
		name?: string | null;
		/** Network configuration changes to apply to the running browser session. */
		network?: KernelBrowserNetworkUpdateInput;
		/** Profile to load into the browser session. Only allowed if the session does not already have a profile loaded. */
		profile?: KernelBrowserProfileInput;
		/** Proxy configuration to apply. Omit to leave the current configuration unchanged. Cannot be combined with proxy_id or disable_default_proxy. Set mode to direct to switch to direct egress. Set mode to default to use Kernel's default stealth proxy for a browser with CAPTCHA solving enabled, or… */
		proxy?: KernelBrowserProxyConfigInput;
		/** ID of the proxy to use. Omit to leave unchanged, set to empty string to remove proxy. Deprecated in favor of proxy. */
		proxy_id?: string | null;
		/** Optional URL to navigate the browser to after applying this update. When a profile is loaded in the same update, this overrides the profile's restored tabs. Navigation is best-effort, so failures do not fail the update. Omit or set to an empty string to leave the current page unchanged. */
		start_url?: string;
		/** User-defined key-value tags for the browser session. Omit to leave unchanged. Provide a map to replace the entire tag set (full replace, not a merge). Set to an empty object ({}) to clear all tags. Up to 50 pairs. */
		tags?: KernelTagsInput | null;
		/** Telemetry configuration. Omit, set to null, or set to an empty object ({}) to leave the existing configuration unchanged. Set enabled to true to enable capture using VM defaults. Set enabled to false to stop capture. Provide browser category settings for per-category updates. Explicitly… */
		telemetry?: KernelBrowserTelemetryRequestConfigInput | null;
		/** Viewport configuration to apply to the browser session. */
		viewport?: KernelBrowserViewportUpdateInput;
	};
	'browsers.webmcp.customTools.add': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Atomically replace all existing tools in this namespace with this batch when true. */
		force_overwrite_namespace?: boolean;
		namespace: string;
		/** JavaScript expression that evaluates to a non-empty array of custom tool definitions. Limited to 8,000,000 bytes when UTF-8 encoded, so multi-byte characters reduce the allowed character count. */
		source: string;
	};
	'browsers.webmcp.customTools.list': {
		/** Browser session ID or name */
		id_or_name: string;
	};
	'browsers.webmcp.customTools.remove': {
		/** Browser session ID or name */
		id_or_name: string;
		id: string;
	};
	'browsers.webmcp.invokeTool': {
		/** Browser session ID or name */
		id_or_name: string;
		/** Tool input, limited to 4 MiB after JSON serialization. */
		input: Record<string, KernelJsonValue>;
		timeout_sec?: number;
		tool_ref: string;
	};
	'browsers.webmcp.listTools': {
		/** Exclude custom tools when true. */
		exclude_custom?: boolean;
		/** Browser session ID or name */
		id_or_name: string;
	};
	'configRegistry.analyses.cancel': {
		id: string;
	};
	'configRegistry.analyses.get': {
		id: string;
	};
	'configRegistry.analyses.list': {
		limit?: number;
		offset?: number;
		/** Case-insensitive substring search over requested URLs. */
		search?: string;
	};
	'configRegistry.list': {
		limit?: number;
		offset?: number;
		/** Case-insensitive substring search over normalized targets, including domain, subdomain, and path. */
		search?: string;
		sort_by?:
			| 'target'
			| 'analysis_status'
			| 'recommended_config'
			| 'last_requested_at'
			| 'success_rate';
		sort_order?: 'asc' | 'desc';
	};
	'configRegistry.lookup': {
		/** ISO 3166 country codes Kernel may use when returning a proxy configuration. When omitted, Kernel uses its default country selection. */
		allowed_proxy_countries?: Array<string>;
		/** Public HTTP(S) URL to look up. */
		url: string;
	};
	'configRegistry.resolve': {
		/** ISO 3166 country codes Kernel may use when searching for or returning a proxy configuration. Kernel may test a subset of allowed countries. When omitted, Kernel uses its default country selection. */
		allowed_proxy_countries?: Array<string>;
		/** Plain-language description of the workload you intend to run against this target, in a sentence or two. Requires an https target, because the pass treats any non-HTTPS destination as off-site and will not drive an http one. Kernel uses it to drive the browser further into the site, where it can… */
		intent?: string;
		/** Public HTTP(S) URL to refresh. */
		url: string;
	};
	'credentialProviders.create': {
		/** How long to cache credential lists (default 300 seconds) */
		cache_ttl_seconds?: number;
		/** Human-readable name for this provider instance (unique per org). Surrounding whitespace is trimmed and the trimmed value must be non-empty. */
		name: string;
		/** Type of credential provider */
		provider_type: 'onepassword';
		/** Service account token for the provider (e.g., 1Password service account token) */
		token: string;
	};
	'credentialProviders.delete': {
		/** Credential provider ID */
		id: string;
	};
	'credentialProviders.get': {
		/** Credential provider ID */
		id: string;
	};
	'credentialProviders.list': {
		/** Limit the number of credential providers to return. */
		limit?: number;
		/** Offset the number of credential providers to return. */
		offset?: number;
		/** Case-insensitive substring match against credential provider name. IDs match by exact value. */
		query?: string;
	};
	'credentialProviders.listItems': {
		/** Credential provider ID */
		id: string;
	};
	'credentialProviders.test': {
		/** Credential provider ID */
		id: string;
	};
	'credentialProviders.update': {
		/** Credential provider ID */
		id: string;
		/** How long to cache credential lists */
		cache_ttl_seconds?: number;
		/** Whether the provider is enabled for credential lookups */
		enabled?: boolean;
		/** Human-readable name for this provider instance. Surrounding whitespace is trimmed and the trimmed value must be non-empty. */
		name?: string;
		/** Priority order for credential lookups (lower numbers are checked first) */
		priority?: number;
		/** New service account token (to rotate credentials) */
		token?: string;
	};
	'credentials.create': {
		/** Target domain this credential is for */
		domain: string;
		/** Unique name for the credential within the project */
		name: string;
		/** If set, indicates this credential should be used with the specified SSO provider (e.g., google, github, microsoft). When the target site has a matching SSO button, it will be clicked first before filling credential values on the identity provider's login page. */
		sso_provider?: string;
		/** HMAC algorithm used to generate TOTP codes. Defaults to SHA1 and is ignored when an `otpauth://` URI supplies the algorithm. */
		totp_algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
		/** Number of digits in generated TOTP codes. Defaults to 6 and is ignored when an `otpauth://` URI supplies the digit count. */
		totp_digits?: number;
		/** TOTP rotation period in seconds. Defaults to 30 and is ignored when an `otpauth://` URI supplies the period. */
		totp_period?: number;
		/** Accepts a 16-128 character base32-encoded TOTP secret or an `otpauth://totp/...` URI. The range accepts existing shorter seeds and longer seeds regardless of HMAC algorithm; RFC 6238 recommends unpadded base32 lengths of 32/52/103 for SHA1/SHA256/SHA512. Only URI parameters present override the… */
		totp_secret?: string;
		/** Field name to value mapping (e.g., username, password) */
		values: Record<string, string>;
	};
	'credentials.delete': {
		/** Credential ID or name */
		id_or_name: string;
	};
	'credentials.get': {
		/** Credential ID or name */
		id_or_name: string;
	};
	'credentials.list': {
		/** Filter by domain */
		domain?: string;
		/** Maximum number of results to return */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Case-insensitive substring match against credential name or domain. IDs match by exact value. */
		query?: string;
	};
	'credentials.totpCode': {
		/** Credential ID or name */
		id_or_name: string;
	};
	'credentials.update': {
		/** Credential ID or name */
		id_or_name: string;
		/** New name for the credential */
		name?: string;
		/** Field names to remove from the credential's stored values. Removals are applied before `values` are merged, so a key present in both is kept with its new value. */
		remove_value_keys?: Array<string>;
		/** If set, indicates this credential should be used with the specified SSO provider. Set to empty string or null to remove. */
		sso_provider?: string | null;
		/** HMAC algorithm used to generate TOTP codes. Requires totp_secret and is ignored when an `otpauth://` URI supplies the algorithm. */
		totp_algorithm?: 'SHA1' | 'SHA256' | 'SHA512';
		/** Number of digits in generated TOTP codes. Requires totp_secret and is ignored when an `otpauth://` URI supplies the digit count. */
		totp_digits?: number;
		/** TOTP rotation period in seconds. Requires totp_secret and is ignored when an `otpauth://` URI supplies the period. */
		totp_period?: number;
		/** Accepts a 16-128 character base32-encoded TOTP secret or an `otpauth://totp/...` URI. Only URI parameters present override the corresponding explicit TOTP fields. When rotating a raw secret, omitted fields preserve their existing values; a new URI defaults unspecified fields to SHA1/6/30. Set to… */
		totp_secret?: string;
		/** Field name to value mapping. Values are merged with existing values (new keys added, existing keys overwritten). */
		values?: Record<string, string>;
	};
	'deployments.create': {
		/** Relative path to the entrypoint of the application */
		entrypoint_rel_path?: string;
		/** Map of environment variables to set for the deployed application. Each key-value pair represents an environment variable. */
		env_vars?: Record<string, string>;
		/** ZIP file containing the application source directory */
		file?: FileInput;
		/** Allow overwriting an existing app version */
		force?: boolean;
		/** Region for deployment. Currently we only support "aws.us-east-1a" */
		region?: 'aws.us-east-1a';
		source?: KernelDeploymentSourceInput;
		/** Version of the application. Can be any string. */
		version?: string;
	};
	'deployments.delete': {
		/** Deployment ID */
		id: string;
	};
	'deployments.get': {
		/** Deployment ID */
		id: string;
	};
	'deployments.list': {
		/** Filter results by application name. */
		app_name?: string;
		/** Filter results by application version. Requires app_name to be set. */
		app_version?: string;
		/** Limit the number of deployments to return. */
		limit?: number;
		/** Offset the number of deployments to return. */
		offset?: number;
		/** Search deployments by ID or app name. */
		query?: string;
	};
	'extensions.delete': {
		/** Extension ID or extension name */
		id_or_name: string;
	};
	'extensions.download': {
		/** Extension ID or name */
		id_or_name: string;
	};
	'extensions.downloadFromChromeStore': {
		/** Chrome Web Store URL for the extension. */
		url: string;
		/** Target operating system for the extension package. Defaults to linux. */
		os?: 'win' | 'mac' | 'linux';
	};
	'extensions.get': {
		/** Extension ID or name */
		id_or_name: string;
	};
	'extensions.list': {
		/** Limit the number of extensions to return. */
		limit?: number;
		/** Offset the number of extensions to return. */
		offset?: number;
		/** Case-insensitive substring match against extension name. IDs match by exact value. */
		query?: string;
		/** Exact-match filter on extension name using the database collation. In production, matching is case- and accent-insensitive. During the default-project migration, unscoped requests prefer a concrete default-project extension over a legacy unscoped extension with the same name. */
		name?: string;
	};
	'extensions.upload': {
		/** ZIP file containing the browser extension. */
		file: FileInput;
		/** Optional unique name within the project to reference this extension. */
		name?: string;
	};
	'invocations.create': {
		/** Name of the action to invoke */
		action_name: string;
		/** Name of the application */
		app_name: string;
		/** If true, invoke asynchronously. When set, the API responds 202 Accepted with status "queued". */
		async?: boolean;
		/** Timeout in seconds for async invocations (min 10, max 3600). Only applies when async is true. */
		async_timeout_seconds?: number;
		/** Input data for the action, sent as a JSON string. */
		payload?: string;
		/** Version of the application */
		version: string;
	};
	'invocations.deleteBrowsers': {
		/** Invocation ID */
		id: string;
	};
	'invocations.get': {
		/** The invocation ID */
		id: string;
	};
	'invocations.list': {
		/** Filter results by application name. */
		app_name?: string;
		/** Filter results by application version. */
		version?: string;
		/** Filter results by action name. */
		action_name?: string;
		/** Filter results by deployment ID. */
		deployment_id?: string;
		/** Filter results by invocation status. */
		status?: 'queued' | 'running' | 'succeeded' | 'failed';
		/** Show invocations that have started since the given time (RFC timestamps or durations like 5m). */
		since?: string;
		/** Limit the number of invocations to return. */
		limit?: number;
		/** Offset the number of invocations to return. */
		offset?: number;
		/** Search invocations by ID, app name, or action name. */
		query?: string;
	};
	'invocations.listBrowsers': {
		/** Invocation ID */
		id: string;
	};
	'invocations.update': {
		/** Invocation ID */
		id: string;
		/** Updated output of the invocation rendered as JSON string. */
		output?: string;
		/** New status for the invocation. */
		status: 'succeeded' | 'failed';
	};
	'organization.entitlements.get': Record<string, never>;
	'organization.limits.get': Record<string, never>;
	'organization.limits.update': {
		/** Default maximum concurrent browsers for projects without an explicit override. Set to 0 to remove the default; omit to leave unchanged. Cannot exceed the organization's concurrency limit. */
		default_project_max_concurrent_sessions?: number | null;
	};
	'profiles.create': {
		/** Optional name of the profile. Must be unique within the logical project; during the default-project migration, unscoped profiles and profiles in the org default project are treated as the same project. */
		name?: string;
	};
	'profiles.delete': {
		/** Profile ID or profile name */
		id_or_name: string;
	};
	'profiles.download': {
		/** Profile ID or name */
		id_or_name: string;
		/** Response format for current profile archives. Legacy profiles are always returned as JSON. */
		format?: 'tar.zst' | 'tar';
	};
	'profiles.get': {
		/** Profile ID or name */
		id_or_name: string;
	};
	'profiles.list': {
		/** Limit the number of profiles to return. */
		limit?: number;
		/** Offset the number of profiles to return. */
		offset?: number;
		/** Case-insensitive substring match against profile name or ID. */
		query?: string;
		/** Exact-match filter on profile name using the database collation. In production, matching is case- and accent-insensitive. During the default-project migration, unscoped requests prefer a concrete default-project profile over a legacy unscoped profile with the same name. */
		name?: string;
	};
	'profiles.update': {
		/** Profile ID or profile name */
		id_or_name: string;
		/** New profile name. Must be unique within the logical project; during the default-project migration, unscoped profiles and profiles in the org default project are treated as the same project. */
		name: string;
	};
	'projects.create': {
		/** Project name (1-255 Unicode code points; cannot contain `/` or `%`) */
		name: string;
	};
	'projects.delete': {
		/** Project ID or name */
		id_or_name: string;
	};
	'projects.get': {
		/** Project ID or name */
		id_or_name: string;
	};
	'projects.limits.get': {
		/** Project ID or name */
		id_or_name: string;
	};
	'projects.limits.update': {
		/** Project ID or name */
		id_or_name: string;
		/** Maximum concurrent app invocations for this project. Set to 0 to remove the cap; omit to leave unchanged. */
		max_concurrent_invocations?: number | null;
		/** Maximum concurrent browsers for this project, covering both on-demand sessions and browser pool reservations. Set to 0 to remove the cap; omit to leave unchanged. */
		max_concurrent_sessions?: number | null;
		/** Deprecated: pooled browsers now count toward `max_concurrent_sessions`. Requests that set this field are rejected with a 400. */
		max_pooled_sessions?: number | null;
	};
	'projects.list': {
		/** Maximum number of results to return */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Case-insensitive substring match against project name */
		query?: string;
		/** Exact-match filter on project name using the database collation. In production, matching is case- and accent-insensitive. */
		name?: string;
	};
	'projects.update': {
		/** Project ID or name */
		id_or_name: string;
		/** New project name (1-255 Unicode code points; cannot contain `/` or `%`) */
		name?: string;
		/** New project status */
		status?: 'active' | 'archived';
	};
	'proxies.check': {
		/** Proxy ID. Name-based addressing is supported only for retrieval. */
		id_or_name: string;
		/** An optional URL to test reachability against. If provided, the proxy check will test connectivity to this URL instead of the default test URLs. Only HTTP and HTTPS schemes are allowed, and the URL must resolve to a public IP address. For ISP proxies, the exit IP is stable, so a successful check… */
		url?: string;
	};
	'proxies.create': {
		/** Hostnames that should bypass the parent proxy and connect directly. */
		bypass_hosts?: Array<string>;
		/** Configuration specific to the selected proxy `type`. */
		config?:
			| KernelDatacenterProxyConfigInput
			| KernelIspProxyConfigInput
			| KernelResidentialProxyConfigInput
			| KernelMobileProxyConfigInput
			| KernelCreateCustomProxyConfigInput;
		/** Readable name of the proxy. */
		name?: string;
		/** Protocol to use for the proxy connection. */
		protocol?: 'http' | 'https';
		/** Proxy type to use. In terms of quality for avoiding bot-detection, from best to worst: `mobile` > `residential` > `isp`. `datacenter` is deprecated; use `isp` instead. Datacenter proxy creation remains supported for backward compatibility. */
		type: 'datacenter' | 'isp' | 'residential' | 'mobile' | 'custom';
	};
	'proxies.delete': {
		/** Proxy ID. Name-based addressing is supported only for retrieval. */
		id_or_name: string;
	};
	'proxies.get': {
		id_or_name: string;
	};
	'proxies.list': {
		/** Limit the number of proxies to return. */
		limit?: number;
		/** Offset the number of proxies to return. */
		offset?: number;
		/** Case-insensitive substring match against proxy name, host, or IP address. IDs match by exact value. */
		query?: string;
		/** Exact-match filter on proxy name using the database collation. In production, matching is case- and accent-insensitive. Names are not required to be unique, so multiple proxies may match. */
		name?: string;
		/** Exact match on the primary exit IP of ISP proxies. Must be an IPv4 address. Only ISP proxies are matched: the ip_address shown on other proxy types is a one-time observation, not a stable identity. */
		ip_address?: string;
	};
	'proxies.update': {
		/** Proxy ID. Name-based addressing is supported only for retrieval. */
		id_or_name: string;
		/** Type-specific changes. Only ISP proxies accept a config update. */
		config?: KernelIspProxyUpdateConfigInput;
		/** New proxy name. Proxy names are trimmed and length-checked only; duplicates are allowed because proxies are updated by ID, not by name. */
		name?: string;
	};
	'proxyIPs.get': {
		ip_address: string;
	};
	'proxyIPs.list': {
		/** Limit the number of IPs to return. */
		limit?: number;
		/** Offset the number of IPs to return. */
		offset?: number;
		/** ISO 3166 country code to filter by. Must be a country ISP proxies support. */
		country?: string;
		/** Filter by whether the IP can currently be assigned. */
		status?: KernelProxyIpStatusInput;
	};
	'reportTypes.get': {
		/** Report type name, such as task.result */
		type: string;
	};
	'reportTypes.list': {
		/** Task the agent is finding a report type for. */
		task_id: string;
		/** Limit the number of report types to return. */
		limit?: number;
		/** Offset the number of report types to return. */
		offset?: number;
	};
	'reportTypes.versions.get': {
		/** Report type name, such as task.result */
		type: string;
		/** Schema version number, starting at 1. */
		version: number;
	};
	'reports.create': {
		/** Makes retrying the create safe. A retry with the same key and the same request returns the record the first call created, with status 200, instead of creating another. Reusing a key with a different request returns 422. Keys are scoped to the project and do not expire. The Kernel SDKs send a key… */
		idempotency_key?: string;
		/** Report data. It must match the schema of the report type's version and encode to at most 16 KB of JSON. */
		data: Record<string, KernelJsonValue>;
		/** When the reported event happened. Defaults to the time the report is submitted. Must be no more than 5 minutes in the future or 30 days in the past. */
		occurred_at?: string;
		/** Version of the report type's schema to validate data against. Defaults to the type's latest version, which the response returns. */
		schema_version?: number;
		/** ID of the browser the report was observed in. It must belong to the task's project; deleted browsers are accepted. The browser is linked to the task if it is not already. */
		session_id?: string;
		/** ID of the task to report against. */
		task_id: string;
		/** Report type name. List report types to see the available types and their schemas. */
		type: string;
	};
	'reports.get': {
		/** Report ID */
		id: string;
	};
	'reports.list': {
		/** Task whose reports to list. */
		task_id: string;
		/** Only return reports of this type. */
		type?: string;
		/** Limit the number of reports to return. */
		limit?: number;
		/** Offset the number of reports to return. */
		offset?: number;
	};
	'search.contents.fetch': {
		/** Search resource ID returned by POST /search. */
		id: string;
		/** Defaults to source:auto when omitted. */
		content?: KernelSearchContentOptionsInput;
		/** Maximum number of search results to fetch when result_ids is omitted, starting from rank 1. Mutually exclusive with result_ids. */
		limit?: number;
		/** Kernel-generated IDs from the referenced retained search, in desired response order. They are not provider-standard IDs. Mutually exclusive with limit. */
		result_ids?: Array<string>;
		/** Overall deadline across all selected results. */
		timeout_ms?: number;
	};
	'search.create': {
		/** Optional portable content retrieval. Pass true for defaults or an options object. Omission never starts Kernel browser work; provider-supplied content is still returned when available, including when requested through native options. Both inline and deferred retrieval use the same options schema. */
		content?: true | KernelSearchContentOptionsInput;
		/** ISO 3166-1 alpha-2 search locale preference. */
		country?: string;
		/** Inclusive publication-date upper bound; must not precede start_date. If recency is also supplied, recency takes precedence with a warning. Unsupported or approximated filtering is reported, or rejected under strict_params. */
		end_date?: string;
		/** Hostname exclusions, with the same best-effort/strict behavior as include_domains. Provider-specific combinations that cannot be represented are reported via warnings or rejected in strict mode. */
		exclude_domains?: Array<string>;
		/** Hostname inclusion preference, matching a hostname and its subdomains. Empty means unrestricted. Translated, emulated, or dropped with a warning according to provider capability unless strict_params is true. Native boost modes remain advisory and are identified in warnings. */
		include_domains?: Array<string>;
		/** Include untouched per-result payloads and the full serving-provider response in raw fields. Off by default; native top-level outputs such as answer remain available without it. */
		include_raw?: boolean;
		/** BCP 47 search language preference. */
		language?: string;
		/** Requested result count from 1 through 100. The effective count is clamped to the serving provider's cap with a warning. Effective native counts are the lower of this limit and supplied provider-native count aliases. Strict mode rejects unsupported counts. */
		max_results?: number;
		/** Primary search query. A provider-native multi-query option applies only to that provider; other providers in a fallback chain receive this query. */
		query: string;
		/** Relative search window. Takes precedence over start_date/end_date with a warning if both are set. Provider-native recency behavior is retained, including documented hour-to-day widening. Unsupported filters are rejected only in strict mode. */
		recency?: 'hour' | 'day' | 'week' | 'month' | 'year';
		/** Optional safety preference. Omit to use provider defaults. Unsupported values are dropped with a warning unless strict_params is true. A search filter is not an authorization boundary. */
		safe_search?: 'off' | 'moderate' | 'strict';
		/** Inclusive publication-date lower bound. If recency is also supplied, recency takes precedence with a warning. Provider date semantics, precision, and unsupported filters are reported; unknown source dates are not fabricated or universally post-filtered. */
		start_date?: string;
		/** Omitted strategy defaults to auto. */
		strategy?: KernelSearchStrategyInput;
		/** When false, unsupported portable parameters are omitted and approximations are described in warnings. When true, every supplied portable parameter must be honored exactly. Requests that cannot be served with those parameters are rejected. This does not guarantee identical rankings or document… */
		strict_params?: boolean;
		/** Overall deadline across search attempts and inline retrieval. No new attempt starts after the deadline. Completed search results survive inline retrieval timeouts. */
		timeout_ms?: number;
	};
	'search.get': {
		/** Search resource ID returned by POST /search. */
		id: string;
	};
	'search.providers.list': {
		/** Optional concrete provider slug filter. Omit to list every provider. A slug that is not listed returns an empty array. */
		slug?: KernelSearchProviderSlugInput;
	};
	'tasks.create': {
		/** Makes retrying the create safe. A retry with the same key and the same request returns the record the first call created, with status 200, instead of creating another. Reusing a key with a different request returns 422. Keys are scoped to the project and do not expire. The Kernel SDKs send a key… */
		idempotency_key?: string;
		/** What the task is meant to accomplish, at most 4 KB. */
		description: string;
		metadata?: KernelTaskMetadataInput;
		/** IDs of browsers to link to the task. Each must belong to the request's project; deleted browsers can be linked. */
		session_ids?: Array<string>;
		/** When work on the task started. Defaults to the time the task is created. Must be no more than 5 minutes in the future or 30 days in the past. */
		started_at?: string;
		/** Hostname of the website the task targets, without a scheme or path. */
		target_website?: string;
	};
	'tasks.get': {
		/** Task ID */
		id: string;
	};
	'tasks.linkBrowsers': {
		/** Task ID */
		id: string;
		/** IDs of browsers to link. Each must belong to the task's project; deleted browsers can be linked. Browsers already linked are ignored. A task can have at most 100 linked browsers. */
		session_ids: Array<string>;
	};
	'tasks.list': {
		/** Limit the number of tasks to return. */
		limit?: number;
		/** Offset the number of tasks to return. */
		offset?: number;
		/** Only return tasks linked to this browser ID. */
		session_id?: string;
	};
	'telemetry.destinations.create': {
		description?: string;
		/** Base endpoint of the OTLP/HTTP collector, without a signal path. Kernel appends the signal path itself, so pass `https://api.honeycomb.io` rather than `https://api.honeycomb.io/v1/logs`. If your provider's docs give you a signal-specific URL, drop the trailing `/v1/logs`, `/v1/traces`, or… */
		endpoint: string;
		/** Headers sent with each export request, typically an ingestion key. Encrypted at rest and returned redacted. Names and values must be valid HTTP header tokens, and the names and values together cannot exceed 8192 bytes. Names are matched case-insensitively and stored canonicalized, so supplying… */
		headers?: Record<string, string>;
		/** Unique within the organization. */
		name: string;
	};
	'telemetry.destinations.delete': {
		/** OTLP destination ID or name */
		id_or_name: string;
	};
	'telemetry.destinations.get': {
		/** OTLP destination ID or name */
		id_or_name: string;
	};
	'telemetry.destinations.list': {
		/** Limit the number of destinations to return. */
		limit?: number;
		/** Offset the number of destinations to return. */
		offset?: number;
		/** Case-insensitive substring match against destination name or endpoint. IDs match by exact value. */
		query?: string;
		/** Exact-match filter on destination name using the database collation. In production, matching is case- and accent-insensitive. */
		name?: string;
	};
	'telemetry.destinations.update': {
		/** OTLP destination ID or name */
		id_or_name: string;
		description?: string;
		/** Base endpoint of the OTLP/HTTP collector, without a signal path. Same rules as on create. */
		endpoint?: string;
		/** Edits stored headers key by key rather than replacing the map. A string value adds or replaces that header, `null` deletes it, and any key you omit is left as it is. Names are matched case-insensitively, so `authorization` replaces a stored `Authorization` rather than adding a second entry. This… */
		headers?: Record<string, string | null>;
		name?: string;
	};
	'vaultProviderConfigs.create': {} & KernelVaultProviderConfigRequestInput;
	'vaultProviderConfigs.delete': {
		/** Provider configuration ID or name in the organization. */
		id_or_name: string;
	};
	'vaultProviderConfigs.get': {
		/** Provider configuration ID or name in the organization. */
		id_or_name: string;
	};
	'vaultProviderConfigs.list': {
		limit?: number;
		offset?: number;
	};
	'vaultProviderConfigs.update': {
		/** Provider configuration ID or name in the organization. */
		id_or_name: string;
		/** Fields to update. Omitted credentials are left unchanged. A rejected update leaves existing credentials unchanged. */
		credentials?: {
			client_secret?: string;
			/** Link configurations only. Stripe publishable key sent to Link when refreshing and revoking wallet grants. */
			publishable_key?: string;
		};
		/** Unique within the organization. */
		name?: string;
	};
	'vaults.delete': {
		id_or_name: string;
	};
	'vaults.get': {
		id_or_name: string;
	};
	'vaults.getEncryptionKey': {
		id_or_name: string;
	};
	'vaults.items.delete': {
		id_or_name: string;
		key: string;
	};
	'vaults.items.events': {
		id_or_name: string;
		key: string;
		/** Return events after this event ID. */
		after?: string;
		/** When true, also finds deleted items, and deleted vaults by ID only. `key` then also accepts an item ID, which takes precedence over a key with the same value; the lookup order is the item ID, then the live item with that key, then the most recently deleted one. `wait` is ignored for a deleted… */
		include_deleted?: boolean;
		/** Long-poll for new events for up to this many seconds. */
		wait?: number;
	};
	'vaults.items.get': {
		id_or_name: string;
		key: string;
		/** Hold for up to this many seconds while the item is pending authorization, approval, or credential collection. Return the current item when ready or when the wait elapses. This does not wait for edits to an already-ready credential; poll GET without wait and compare version to observe changes… */
		wait?: number;
		/** Live fields advertised by `available_expansions` to include in `expanded`. */
		expand?: Array<KernelVaultItemExpansionTypeInput>;
	};
	'vaults.items.list': {
		id_or_name: string;
	};
	'vaults.items.performOperation': {
		id_or_name: string;
		key: string;
	} & KernelVaultItemOperationRequestInput;
	'vaults.items.update': {
		id_or_name: string;
		key: string;
	} & KernelVaultItemUpdateRequestInput;
	'vaults.items.upsert': {
		id_or_name: string;
		key: string;
	} & KernelVaultItemRequestInput;
	'vaults.list': {
		limit?: number;
		offset?: number;
		/** Case-insensitive substring match against vault name. IDs match by exact value. */
		query?: string;
	};
	'vaults.upsert': {
		/** Immutable name used to create or retrieve the vault. */
		name: string;
	};
};

export type KernelOperationOutputs = {
	'apiKeys.create': KernelCreatedApiKey;
	'apiKeys.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'apiKeys.get': KernelApiKey;
	'apiKeys.list': {
		/** This page of results. */
		items: Array<KernelApiKey>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'apiKeys.rotate': KernelCreatedApiKey;
	'apiKeys.update': KernelApiKey;
	'apps.list': {
		/** This page of results. */
		items: Array<KernelAppVersionSummary>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'auditLogs.exportChunk': FileOutput & {
		/** True when another chunk follows; pass next_cursor as cursor to read it. */
		has_more: boolean;
		/** Pass as cursor to read the next chunk. */
		next_cursor: string | null;
	};
	'auditLogs.exportDestinations.create': KernelAuditLogExportDestination;
	'auditLogs.exportDestinations.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'auditLogs.exportDestinations.get': KernelAuditLogExportDestination;
	'auditLogs.exportDestinations.list': {
		/** This page of results. */
		items: Array<KernelAuditLogExportDestination>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'auditLogs.exportDestinations.test': KernelAuditLogExportDestinationTestResult;
	'auditLogs.exportDestinations.update': KernelAuditLogExportDestination;
	'auditLogs.list': {
		/** This page of results. */
		items: Array<KernelAuditLogEntry>;
		/** True when more results follow; pass next_page_token as page_token to read them. */
		has_more: boolean;
		/** Value for `page_token` that reads the next page, or null on the last page. */
		next_page_token: string | null;
	};
	'auth.connections.create': KernelManagedAuth;
	'auth.connections.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'auth.connections.exchange': KernelManagedAuthExchangeResponse;
	'auth.connections.get': KernelManagedAuth;
	'auth.connections.list': {
		/** This page of results. */
		items: Array<KernelManagedAuth>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'auth.connections.login': KernelLoginResponse;
	'auth.connections.submit': KernelSubmitFieldsResponse;
	'auth.connections.timeline': {
		/** This page of results. */
		items: Array<KernelManagedAuthTimelineEvent>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'auth.connections.update': KernelManagedAuth;
	'auth.context.get': KernelAuthContext;
	'browserPools.acquire': KernelBrowser | null;
	'browserPools.create': KernelBrowserPool;
	'browserPools.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browserPools.flush': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browserPools.get': KernelBrowserPool;
	'browserPools.list': {
		/** This page of results. */
		items: Array<KernelBrowserPool>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'browserPools.release': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browserPools.update': KernelBrowserPool;
	'browsers.computer.batch': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.captureScreenshot': FileOutput;
	'browsers.computer.clickMouse': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.dragMouse': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.getMousePosition': KernelMousePositionResponse;
	'browsers.computer.moveMouse': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.pressKey': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.readClipboard': KernelClipboardContent;
	'browsers.computer.scroll': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.setCursorVisibility': KernelOkResponse;
	'browsers.computer.typeText': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.computer.writeClipboard': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.create': KernelBrowser;
	'browsers.curl': KernelBrowserCurlResult;
	'browsers.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.createDirectory': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.deleteDirectory': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.deleteFile': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.downloadDirZip': FileOutput;
	'browsers.fs.fileInfo': KernelFileInfo;
	'browsers.fs.listFiles': KernelListFiles;
	'browsers.fs.move': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.readFile': FileOutput;
	'browsers.fs.setFilePermissions': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.upload': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.uploadZip': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.watch.start': {
		/** Unique identifier for the directory watch */
		watch_id?: string | null;
	};
	'browsers.fs.watch.stop': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.fs.writeFile': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.get': KernelBrowser;
	'browsers.list': {
		/** This page of results. */
		items: Array<KernelBrowser>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'browsers.liveView.create': KernelBrowserLiveView;
	'browsers.loadExtensions': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.playwright.execute': KernelExecutePlaywrightResult;
	'browsers.playwright.executors.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.playwright.executors.list': KernelPlaywrightExecutorList;
	'browsers.process.exec': KernelProcessExecResult;
	'browsers.process.kill': KernelOkResponse;
	'browsers.process.resize': KernelOkResponse;
	'browsers.process.spawn': KernelProcessSpawnResult;
	'browsers.process.status': KernelProcessStatus;
	'browsers.process.stdin': KernelProcessStdinResult;
	'browsers.repl': KernelBrowserReplResult;
	'browsers.replays.download': FileOutput;
	'browsers.replays.list': Array<KernelBrowserReplay>;
	'browsers.replays.start': KernelBrowserReplay;
	'browsers.replays.stop': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.saveProfile': KernelProfile;
	'browsers.telemetry.events': {
		/** This page of results. */
		items: Array<KernelBrowserTelemetryEventEnvelope>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'browsers.update': KernelBrowser;
	'browsers.webmcp.customTools.add': KernelCustomWebMCPToolsResponse;
	'browsers.webmcp.customTools.list': KernelCustomWebMCPToolsResponse;
	'browsers.webmcp.customTools.remove': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'browsers.webmcp.invokeTool': KernelWebMCPInvocationResult;
	'browsers.webmcp.listTools': KernelWebMCPToolsResponse;
	'configRegistry.analyses.cancel': KernelConfigRegistryResponse;
	'configRegistry.analyses.get': KernelConfigRegistryResponse;
	'configRegistry.analyses.list': {
		/** This page of results. */
		items: Array<KernelConfigRegistryAnalysisSummary>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'configRegistry.list': {
		/** This page of results. */
		items: Array<KernelConfigRegistryRecommendationSummary>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'configRegistry.lookup': KernelConfigRegistryLookupResponse;
	'configRegistry.resolve': KernelConfigRegistryResponse;
	'credentialProviders.create': KernelCredentialProvider;
	'credentialProviders.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'credentialProviders.get': KernelCredentialProvider;
	'credentialProviders.list': {
		/** This page of results. */
		items: Array<KernelCredentialProvider>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'credentialProviders.listItems': {
		items?: Array<KernelCredentialProviderItem> | null;
	};
	'credentialProviders.test': KernelCredentialProviderTestResult;
	'credentialProviders.update': KernelCredentialProvider;
	'credentials.create': KernelCredential;
	'credentials.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'credentials.get': KernelCredential;
	'credentials.list': {
		/** This page of results. */
		items: Array<KernelCredential>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'credentials.totpCode': {
		/** Current 6-digit TOTP code */
		code?: string | null;
		/** When this code expires (ISO 8601 timestamp) */
		expires_at?: string | null;
	};
	'credentials.update': KernelCredential;
	'deployments.create': KernelDeployment;
	'deployments.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'deployments.get': KernelDeployment;
	'deployments.list': {
		/** This page of results. */
		items: Array<KernelDeployment>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'extensions.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'extensions.download': FileOutput;
	'extensions.downloadFromChromeStore': FileOutput;
	'extensions.get': KernelExtension;
	'extensions.list': {
		/** This page of results. */
		items: Array<KernelExtension>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'extensions.upload': KernelExtension;
	'invocations.create': KernelInvokeResponse;
	'invocations.deleteBrowsers': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'invocations.get': KernelInvocation;
	'invocations.list': {
		/** This page of results. */
		items: Array<KernelInvocation>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'invocations.listBrowsers': {
		browsers?: Array<KernelBrowser> | null;
	};
	'invocations.update': KernelInvocation;
	'organization.entitlements.get': KernelOrgEntitlements;
	'organization.limits.get': KernelOrgLimits;
	'organization.limits.update': KernelOrgLimits;
	'profiles.create': KernelProfile;
	'profiles.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'profiles.download': FileOutput;
	'profiles.get': KernelProfile;
	'profiles.list': {
		/** This page of results. */
		items: Array<KernelProfile>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'profiles.update': KernelProfile;
	'projects.create': KernelProject;
	'projects.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'projects.get': KernelProject;
	'projects.limits.get': KernelProjectLimits;
	'projects.limits.update': KernelProjectLimits;
	'projects.list': {
		/** This page of results. */
		items: Array<KernelProject>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'projects.update': KernelProject;
	'proxies.check': KernelProxy;
	'proxies.create': KernelProxy;
	'proxies.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'proxies.get': KernelProxy;
	'proxies.list': {
		/** This page of results. */
		items: Array<KernelProxy>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'proxies.update': KernelProxy;
	'proxyIPs.get': KernelProxyIpDetail;
	'proxyIPs.list': {
		/** This page of results. */
		items: Array<KernelProxyIp>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'reportTypes.get': KernelReportType;
	'reportTypes.list': {
		/** This page of results. */
		items: Array<KernelReportTypeSummary>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'reportTypes.versions.get': KernelReportTypeVersion;
	'reports.create': KernelReport;
	'reports.get': KernelReport;
	'reports.list': {
		/** This page of results. */
		items: Array<KernelReport>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'search.contents.fetch': KernelSearchContentsResponse;
	'search.create': KernelSearch;
	'search.get': KernelSearch;
	'search.providers.list': Array<KernelSearchProvider>;
	'tasks.create': KernelTask;
	'tasks.get': KernelTask;
	'tasks.linkBrowsers': KernelTask;
	'tasks.list': {
		/** This page of results. */
		items: Array<KernelTask>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'telemetry.destinations.create': KernelOTLPDestination;
	'telemetry.destinations.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'telemetry.destinations.get': KernelOTLPDestination;
	'telemetry.destinations.list': {
		/** This page of results. */
		items: Array<KernelOTLPDestination>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'telemetry.destinations.update': KernelOTLPDestination;
	'vaultProviderConfigs.create': KernelVaultProviderConfig;
	'vaultProviderConfigs.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'vaultProviderConfigs.get': KernelVaultProviderConfig;
	'vaultProviderConfigs.list': {
		/** This page of results. */
		items: Array<KernelVaultProviderConfig>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'vaultProviderConfigs.update': KernelVaultProviderConfig;
	'vaults.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'vaults.get': KernelVault;
	'vaults.getEncryptionKey': KernelVaultEncryptionKey;
	'vaults.items.delete': {
		/** Kernel accepted the call; it answers with no body. */
		success: true;
	};
	'vaults.items.events': Array<KernelVaultItemEvent>;
	'vaults.items.get': KernelVaultItem;
	'vaults.items.list': Array<KernelVaultItem>;
	'vaults.items.performOperation': KernelVaultItemOperationResponse;
	'vaults.items.update': KernelVaultItem;
	'vaults.items.upsert': KernelVaultItem;
	'vaults.list': {
		/** This page of results. */
		items: Array<KernelVault>;
		/** True when more results follow; pass next_offset as offset to read them. */
		has_more: boolean;
		/** Value for `offset` that reads the next page, or null on the last page. */
		next_offset: number | null;
	};
	'vaults.upsert': KernelVault;
};
