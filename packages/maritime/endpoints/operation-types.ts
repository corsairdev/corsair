// Generated from Maritime's OpenAPI spec (https://api.maritime.sh/openapi.json,
// fetched 2026-11-27) and maritime-sdk 0.13.0 where the spec is silent; maritime-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type MaritimeJsonValue =
	| null
	| boolean
	| number
	| string
	| MaritimeJsonValue[]
	| { [key: string]: MaritimeJsonValue | undefined };

export const MARITIME_OPERATION_IDS = [
	'account.delete',
	'account.limits',
	'activity.list',
	'agentTemplates.list',
	'agents.activity',
	'agents.browserLiveView',
	'agents.capabilities.change',
	'agents.capabilities.get',
	'agents.channels.get',
	'agents.channels.update',
	'agents.channels.validateTelegram',
	'agents.chat.getTurn',
	'agents.chat.send',
	'agents.create',
	'agents.createOwnerLink',
	'agents.delete',
	'agents.desktop.getMode',
	'agents.desktop.takeover',
	'agents.desktop.updateConfig',
	'agents.diagnostic',
	'agents.duplicate',
	'agents.env.create',
	'agents.env.delete',
	'agents.env.list',
	'agents.env.update',
	'agents.exec.cancel',
	'agents.exec.get',
	'agents.exec.run',
	'agents.files.delete',
	'agents.files.download',
	'agents.files.list',
	'agents.files.mkdir',
	'agents.files.move',
	'agents.files.upload',
	'agents.files.write',
	'agents.get',
	'agents.getStopOperation',
	'agents.gmail.connect',
	'agents.gmail.disconnect',
	'agents.gmail.enable',
	'agents.gmail.status',
	'agents.hermes.pairings.allow',
	'agents.hermes.pairings.approve',
	'agents.hermes.pairings.list',
	'agents.hermes.pairings.revoke',
	'agents.inkboxIdentity',
	'agents.invoke',
	'agents.list',
	'agents.listServers',
	'agents.llm.calls',
	'agents.llm.deleteSpendLimit',
	'agents.llm.getSpendLimit',
	'agents.llm.reset',
	'agents.llm.setSpendLimit',
	'agents.llm.status',
	'agents.logs',
	'agents.maritimeTelegram.connect',
	'agents.maritimeTelegram.disconnect',
	'agents.maritimeTelegram.status',
	'agents.reloadEnv',
	'agents.resetToUpstream',
	'agents.resize',
	'agents.restart',
	'agents.setVisibility',
	'agents.shareLinks.create',
	'agents.shareLinks.list',
	'agents.shareLinks.revoke',
	'agents.shareLinks.revokeForEndUser',
	'agents.signedWebhook.delete',
	'agents.signedWebhook.get',
	'agents.signedWebhook.set',
	'agents.skills.delete',
	'agents.skills.export',
	'agents.skills.install',
	'agents.skills.list',
	'agents.skills.search',
	'agents.skills.setAllowlist',
	'agents.skills.setEnv',
	'agents.skills.upload',
	'agents.sleep',
	'agents.start',
	'agents.stats',
	'agents.stop',
	'agents.triggers.create',
	'agents.triggers.delete',
	'agents.triggers.list',
	'agents.triggers.update',
	'agents.update',
	'agents.webhookToken.get',
	'agents.webhookToken.rotate',
	'agents.whatsapp.cancel',
	'agents.whatsapp.log',
	'agents.whatsapp.pairings.approve',
	'agents.whatsapp.pairings.deny',
	'agents.whatsapp.pairings.list',
	'agents.whatsapp.start',
	'agents.whatsapp.status',
	'apiKeys.create',
	'apiKeys.list',
	'apiKeys.revoke',
	'appium.sessions.get',
	'appium.sessions.list',
	'apps.delete',
	'apps.get',
	'apps.list',
	'apps.upload',
	'billing.agentPay.createLink',
	'billing.agents',
	'billing.cancelSwitchToUsage',
	'billing.config',
	'billing.machineTypes',
	'billing.meteredUsage',
	'billing.plan.change',
	'billing.plan.changeWithTrial',
	'billing.plan.preview',
	'billing.plan.resume',
	'billing.retryPayment',
	'billing.summary',
	'billing.switchToUsage',
	'billing.trial.cancel',
	'billing.trial.get',
	'billing.trial.start',
	'billing.usage',
	'computers.actions',
	'computers.completeTakeover',
	'computers.create',
	'computers.createViewer',
	'computers.delete',
	'computers.exec',
	'computers.files.list',
	'computers.files.read',
	'computers.files.write',
	'computers.get',
	'computers.installApp',
	'computers.list',
	'computers.screenshot',
	'computers.sessions.close',
	'computers.sessions.list',
	'computers.sleep',
	'computers.tools.call',
	'computers.tools.list',
	'computers.usage',
	'computers.wake',
	'deletedAgents.get',
	'deletedAgents.list',
	'deployments.cancel',
	'deployments.create',
	'deployments.get',
	'deployments.list',
	'deployments.listForAgent',
	'deployments.uploadZip',
	'domains.check',
	'domains.create',
	'domains.delete',
	'domains.get',
	'domains.labels.delete',
	'domains.labels.list',
	'domains.labels.set',
	'domains.list',
	'endUsers.activity',
	'endUsers.agents.create',
	'endUsers.agents.list',
	'endUsers.delete',
	'endUsers.get',
	'endUsers.list',
	'endUsers.policy.delete',
	'endUsers.policy.get',
	'endUsers.policy.set',
	'endUsers.resume',
	'endUsers.summary',
	'endUsers.suspend',
	'endUsers.tokens.create',
	'endUsers.tokens.revoke',
	'endUsers.upsert',
	'feedback.create',
	'feedback.list',
	'fleet.activity',
	'fleet.batchCreate',
	'fleet.overview',
	'fleet.propagate',
	'fleet.summary',
	'health.check',
	'llmSpendLimit.deleteDefault',
	'llmSpendLimit.getDefault',
	'llmSpendLimit.setDefault',
	'logs.list',
	'network.activity',
	'network.install.get',
	'network.install.unixScript',
	'network.install.windowsScript',
	'network.presets.create',
	'network.presets.delete',
	'network.presets.list',
	'network.presets.update',
	'network.privateNetworks.addResource',
	'network.privateNetworks.create',
	'network.privateNetworks.createInstall',
	'network.privateNetworks.delete',
	'network.privateNetworks.deleteResource',
	'network.privateNetworks.list',
	'network.privateNetworks.update',
	'network.settings.get',
	'network.settings.update',
	'network.workloads.get',
	'network.workloads.newIp',
	'network.workloads.test',
	'network.workloads.update',
	'notifications.list',
	'notifications.markRead',
	'notifications.readAll',
	'notifications.unreadCount',
	'organizations.create',
	'organizations.delete',
	'organizations.invites.accept',
	'organizations.invites.create',
	'organizations.invites.list',
	'organizations.invites.preview',
	'organizations.invites.resend',
	'organizations.invites.revoke',
	'organizations.leave',
	'organizations.me',
	'organizations.members.changeRole',
	'organizations.members.list',
	'organizations.members.remove',
	'organizations.rename',
	'plans.cancel',
	'plans.launchPromo',
	'plans.list',
	'plans.portal',
	'plans.subscribe',
	'preferences.get',
	'preferences.update',
	'projects.bindings.list',
	'projects.bindings.reassign',
	'projects.bindings.unbind',
	'projects.claimCodes.create',
	'projects.claimCodes.list',
	'projects.get',
	'projects.list',
	'projects.messages.get',
	'projects.messages.send',
	'projects.syncInstances',
	'projects.telegram.connect',
	'projects.telegram.disconnect',
	'projects.update',
	'projects.usage',
	'projects.users.get',
	'projects.users.list',
	'projects.users.unbind',
	'sandboxKeys.create',
	'sandboxKeys.list',
	'sandboxKeys.revoke',
	'sandboxWebhooks.create',
	'sandboxWebhooks.delete',
	'sandboxWebhooks.deliveries',
	'sandboxWebhooks.list',
	'sandboxes.code.run',
	'sandboxes.commands.get',
	'sandboxes.commands.history',
	'sandboxes.commands.kill',
	'sandboxes.commands.run',
	'sandboxes.create',
	'sandboxes.createScreenViewer',
	'sandboxes.createUrl',
	'sandboxes.ephemeral.create',
	'sandboxes.ephemeral.extend',
	'sandboxes.ephemeral.kill',
	'sandboxes.ephemeral.list',
	'sandboxes.files.delete',
	'sandboxes.files.list',
	'sandboxes.files.read',
	'sandboxes.files.write',
	'sandboxes.get',
	'sandboxes.info',
	'sandboxes.kill',
	'sandboxes.list',
	'sandboxes.pause',
	'sandboxes.promote',
	'sandboxes.rotateSecret',
	'sandboxes.save',
	'sandboxes.update',
	'sandboxes.usage',
	'secrets.delete',
	'secrets.list',
	'secrets.set',
	'servers.list',
	'servers.release',
	'servers.rent',
	'snapshots.delete',
	'snapshots.get',
	'snapshots.list',
	'stripe.createPortalSession',
	'stripe.invoices',
	'stripe.paymentMethods',
	'stripe.subscriptions.cancel',
	'stripe.subscriptions.list',
	'swarms.cancel',
	'swarms.create',
	'swarms.get',
	'swarms.getAccess',
	'swarms.list',
	'swarms.requestAccess',
	'swarms.results',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
	'usage.daily',
	'usage.report',
	'usage.sandboxes',
	'wallet.apiUsage',
	'wallet.autoRecharge.get',
	'wallet.autoRecharge.set',
	'wallet.balance',
	'wallet.browserUsage',
	'wallet.checkDeployBalance',
	'wallet.claimSignupBonus',
	'wallet.paymentMethod',
	'wallet.planUsage',
	'wallet.purchaseApiCredits',
	'wallet.redeemPromo',
	'wallet.topup',
	'wallet.transactions',
	'wallet.validatePromoCode',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.deliveries.list',
	'webhooks.deliveries.replay',
	'webhooks.list',
	'webhooks.test',
	'webhooks.update',
] as const;

export type MaritimeOperationId = (typeof MARITIME_OPERATION_IDS)[number];

/** One canonical desktopd action (desktopd/mcp_server.py COMPUTER_PROPS shape). */
export type MaritimeActionRequestInput = {
	action: string;
	coordinate?: Array<number> | null;
	startCoordinate?: Array<number> | null;
	text?: string | null;
	modifier?: string | null;
	key?: string | null;
	repeat?: number | null;
	scrollDirection?: 'up' | 'down' | 'left' | 'right' | null;
	scrollAmount?: number | null;
	duration?: number | null;
	region?: Array<number> | null;
	package?: string | null;
	url?: string | null;
	path?: string | null;
	detail?: boolean | null;
	noScreenshot?: boolean | null;
	format?: 'png' | 'jpeg' | null;
	quality?: number | null;
};

export type MaritimeExitChoiceInput = {
	mode?: 'shared' | 'fixed' | 'country' | 'through';
	countryCode?: string | null;
	state?: string | null;
	city?: string | null;
	session?: 'sticky' | 'rotating' | null;
	throughNetworkId?: string | null;
};

export type MaritimeInitialEnvVarInput = {
	key: string;
	value: string;
	isSecret?: boolean;
};

export type MaritimeInputInInput = {
	args?: Array<string>;
	env?: Record<string, string>;
	files?: Record<string, string>;
};

export type MaritimeInternetPolicyInput = {
	mode?: 'all' | 'none' | 'list';
	presetId?: string | null;
	allow?: Array<string>;
	deny?: Array<string>;
};

/** The screen size of a new computer, in pixels. */
export type MaritimeScreenRequestInput = {
	width: number;
	height: number;
};

export type MaritimeSizeInInput = {
	vcpus?: number;
	memoryGb?: number;
};

export type MaritimeAccountActivityEvent = {
	id?: string | null;
	timestamp?: string | null;
	type?: string | null;
	success?: boolean | null;
	triggerType?: string | null;
	toolName?: string | null;
	llmModel?: string | null;
	lifecyclePhase?: string | null;
	errorClass?: string | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	latencyMs?: number | null;
	agentId?: string | null;
	agentName?: string | null;
	source?: string | null;
	machineKind?: string | null;
	externalId?: string | null;
	message?: string | null;
	detail?: string | null;
	deleted?: boolean | null;
};

export type MaritimeAccountActivityPage = {
	events?: Array<MaritimeAccountActivityEvent> | null;
	nextBefore?: string | null;
};

export type MaritimeAccountAddressOut = {
	region?: string | null;
	ip?: string | null;
	status?: string | null;
};

export type MaritimeAccountDefaultResponse = {
	monthlyLimitCents?: number | null;
};

export type MaritimeAccountLimitsResponse = {
	plan?: string | null;
	billingModel?: string | null;
	includedMachines?: number | null;
	machines?: number | null;
	maxAwakeMachines?: number | null;
	awakeMachines?: number | null;
	minMemMb?: number | null;
	maxMemMb?: number | null;
	maxDiskGb?: number | null;
	agentCreatesPerMinute?: number | null;
	agentDuplicatesPerMinute?: number | null;
};

export type MaritimeAccountSettings = {
	cutOff?: boolean | null;
	allowFixed?: boolean | null;
	allowCountry?: boolean | null;
	allowThrough?: boolean | null;
	patientData?: boolean | null;
	hasOwnProxy?: boolean | null;
	countryDataCapGb?: number | null;
	fixedAddresses?: Array<MaritimeAccountAddressOut> | null;
};

/** A desktopd action result with camelCase names; extra detail keys pass through. */
export type MaritimeActionResult = {
	action?: string | null;
	ok?: boolean | null;
	isError?: boolean | null;
	error?: string | null;
	frameId?: number | null;
	imageB64?: string | null;
	width?: number | null;
	height?: number | null;
	mime?: string | null;
	scale?: number | null;
	coordinate?: Array<number> | null;
	blocked?: boolean | null;
	mode?: string | null;
	reason?: string | null;
	hint?: string | null;
	note?: string | null;
};

export type MaritimeActivityEvent = {
	id?: string | null;
	timestamp?: string | null;
	type?: string | null;
	success?: boolean | null;
	triggerType?: string | null;
	toolName?: string | null;
	llmModel?: string | null;
	lifecyclePhase?: string | null;
	errorClass?: string | null;
	promptTokens?: number | null;
	completionTokens?: number | null;
	latencyMs?: number | null;
};

export type MaritimeActivityItem = {
	id?: string | null;
	at?: string | null;
	networkId?: string | null;
	resourceId?: string | null;
	resourceName?: string | null;
	workloadKind?: string | null;
	workloadId?: string | null;
	kind?: string | null;
	destination?: string | null;
	outcome?: string | null;
	bytesIn?: number | null;
	bytesOut?: number | null;
	durationMs?: number | null;
};

export type MaritimeActivityList = {
	items?: Array<MaritimeActivityItem> | null;
};

export type MaritimeActivityPage = {
	events?: Array<MaritimeActivityEvent> | null;
	nextBefore?: string | null;
};

export type MaritimeAgentBillingResponse = {
	agentId?: string | null;
	agentName?: string | null;
	/** Deprecated. A retired per-agent pricing label kept for old clients. It is not what the account is billed. */
	tier?: string | null;
	/** Deprecated. A retired per-agent pricing label kept for old clients. It is not what the account is billed. */
	cost?: number | null;
	invocations?: number | null;
	computeMinutes?: number | null;
	computeMinutesThisPeriod?: number | null;
	invocationsThisPeriod?: number | null;
	limitMinutes?: number | null;
	usagePercent?: number | null;
};

export type MaritimeAgentDiagnosticResponse = {
	source?: string | null;
	code?: string | null;
	title?: string | null;
	message?: string | null;
	action?: string | null;
	deploymentId?: string | null;
	technicalDetails?: string | null;
};

export type MaritimeAgentResponse = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	instructions?: string | null;
	externalId?: string | null;
	framework?: string | null;
	tier?: string | null;
	status?: string | null;
	githubRepo?: string | null;
	autoPair?: boolean | null;
	exposedPort?: number | null;
	healthCheckPath?: string | null;
	hasWebUi?: boolean | null;
	templateId?: string | null;
	publicPlay?: boolean | null;
	publicWeb?: boolean | null;
	publicUrl?: string | null;
	visibility?: string | null;
	webUrl?: string | null;
	desktopEnabled?: boolean | null;
	invocationCount?: number | null;
	totalComputeSeconds?: number | null;
	memMb?: number | null;
	vcpus?: number | null;
	idleTtlSeconds?: number | null;
	diskMb?: number | null;
	computeMinutesLimit?: number | null;
	sleepPolicy?: string | null;
	lastStartedAt?: string | null;
	lastActiveAt?: string | null;
	statusChangedAt?: string | null;
	derivedImageTag?: string | null;
	imageName?: string | null;
	browserbaseConfigured?: boolean | null;
	projectId?: string | null;
	projectRole?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
};

export type MaritimeAgentSpendLimitResponse = {
	monthlyLimitCents?: number | null;
	source?: string | null;
	spentThisMonthCents?: number | null;
	limitReached?: boolean | null;
	periodStart?: string | null;
	periodEnd?: string | null;
};

export type MaritimeAgentUsage = {
	agentId?: string | null;
	source?: string | null;
	agentName?: string | null;
	externalUserId?: string | null;
	projectId?: string | null;
	computeMinutes?: number | null;
	hostingCostCents?: number | null;
	slotCostCents?: number | null;
	addOnCostCents?: number | null;
	llmCostCents?: number | null;
	totalCostCents?: number | null;
};

/** Returned only on creation. Includes the raw key (shown once). */
export type MaritimeApiKeyCreated = {
	id?: string | null;
	name?: string | null;
	key_prefix?: string | null;
	scopes?: Array<string> | null;
	is_active?: boolean | null;
	project_id?: string | null;
	fleet_id?: string | null;
	last_used_at?: string | null;
	expires_at?: string | null;
	created_at?: string | null;
	computer_sessions_30d?: number | null;
	/** Full API key. Store securely, shown only once */
	raw_key?: string | null;
};

export type MaritimeApiKeyResponse = {
	id?: string | null;
	name?: string | null;
	key_prefix?: string | null;
	scopes?: Array<string> | null;
	is_active?: boolean | null;
	project_id?: string | null;
	fleet_id?: string | null;
	last_used_at?: string | null;
	expires_at?: string | null;
	created_at?: string | null;
	computer_sessions_30d?: number | null;
};

/** The result of ``adb install``: ``output`` is what it printed. */
export type MaritimeAppInstallOut = {
	ok?: boolean | null;
	output?: string | null;
};

/** One Appium session with download URLs of its recordings, valid for one hour. ``capabilities`` are the capabilities the client asked for, with secret values replaced by ``***``. */
export type MaritimeAppiumSessionDetailOut = {
	id?: string | null;
	computerId?: string | null;
	phoneNumber?: number | null;
	phoneName?: string | null;
	name?: string | null;
	build?: string | null;
	status?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	durationS?: number | null;
	commandCount?: number | null;
	hasVideo?: boolean | null;
	hasLogcat?: boolean | null;
	hasCommands?: boolean | null;
	error?: string | null;
	videoUrl?: string | null;
	logcatUrl?: string | null;
	commandsUrl?: string | null;
	capabilities?: Record<string, MaritimeJsonValue> | null;
};

export type MaritimeAppiumSessionListOut = {
	sessions?: Array<MaritimeAppiumSessionOut> | null;
};

/** One Appium session on a Metal phone. ``duration_s`` counts to now while the session is active. */
export type MaritimeAppiumSessionOut = {
	id?: string | null;
	computerId?: string | null;
	phoneNumber?: number | null;
	phoneName?: string | null;
	name?: string | null;
	build?: string | null;
	status?: string | null;
	startedAt?: string | null;
	endedAt?: string | null;
	durationS?: number | null;
	commandCount?: number | null;
	hasVideo?: boolean | null;
	hasLogcat?: boolean | null;
	hasCommands?: boolean | null;
	error?: string | null;
};

/** The product an end user's agent was stamped from: the base agent of its project. */
export type MaritimeBaseAgentRef = {
	id?: string | null;
	name?: string | null;
};

export type MaritimeBatchResult = {
	results?: Array<MaritimeActionResult> | null;
};

/** Live pricing configuration (plan 20). `v2_enabled` gates the new wallet-first UI: when False the frontend renders the legacy UI. */
export type MaritimeBillingConfigResponse = {
	v2Enabled?: boolean | null;
	agentFeeCentsPerMonth?: number | null;
	maxConcurrentActive?: number | null;
	bundles?: Record<string, MaritimeCreditBundleSpec> | null;
};

export type MaritimeBillingInfoResponse = {
	totalAgents?: number | null;
	totalCost?: number | null;
	computeMinutes?: number | null;
	agents?: Array<MaritimeAgentBillingResponse> | null;
	billingPeriod?: string | null;
};

export type MaritimeComputerListOut = {
	computers?: Array<MaritimeComputerOut> | null;
};

export type MaritimeComputerOut = {
	id?: string | null;
	os?: string | null;
	arch?: string | null;
	externalUserId?: string | null;
	name?: string | null;
	status?: string | null;
	screen?: MaritimeScreenOut | null;
	mode?: string | null;
	modeReason?: string | null;
	takeoverSeq?: number | null;
	takeoverExpiresAt?: string | null;
	lastTakeoverResult?: string | null;
	lastTakeoverNote?: string | null;
	lastActionAt?: string | null;
	lastWakeMs?: number | null;
	lastWakeMethod?: string | null;
	errorMessage?: string | null;
	session?: MaritimeSessionSummaryOut | null;
	device?: MaritimeDeviceOut | null;
	createdAt?: string | null;
};

export type MaritimeComputerUsageOut = {
	computerId?: string | null;
	externalUserId?: string | null;
	invocations?: number | null;
	wallSeconds?: number | null;
	actions?: number | null;
	screenshots?: number | null;
};

export type MaritimeConnectorOut = {
	id?: string | null;
	hostname?: string | null;
	connected?: boolean | null;
	lastSeenAt?: string | null;
	allow?: Array<string> | null;
	allowsInternet?: boolean | null;
};

export type MaritimeCountryOption = {
	available?: boolean | null;
	reason?: string | null;
	countries?: Array<MaritimeCountryOut> | null;
	ownProxy?: boolean | null;
	residential?: boolean | null;
	states?: Array<MaritimeCountryOut> | null;
	priceLabel?: string | null;
	upfrontDueCents?: number | null;
};

export type MaritimeCountryOut = {
	code?: string | null;
	name?: string | null;
};

export type MaritimeCreditBundleSpec = {
	priceCents?: number | null;
	creditCents?: number | null;
	concurrent?: number | null;
};

/** Response containing Stripe Customer Portal URL. */
export type MaritimeCustomerPortalResponse = {
	url?: string | null;
};

export type MaritimeDailyUsageReport = {
	periodStart?: string | null;
	periodEnd?: string | null;
	hostingBasis?: string | null;
	plan?: string | null;
	days?: Array<MaritimeDayUsage> | null;
};

export type MaritimeDayUsage = {
	day?: string | null;
	computeMinutes?: number | null;
	hostingCostCents?: number | null;
	llmCostCents?: number | null;
	totalCostCents?: number | null;
};

export type MaritimeDeletedAgentResponse = {
	agentId?: string | null;
	externalId?: string | null;
	name?: string | null;
	framework?: string | null;
	finalStatus?: string | null;
	deletedAt?: string | null;
	deployments?: Array<Record<string, string | null>> | null;
	logs?: Array<Record<string, string | null>> | null;
	executions?: Array<Record<string, (string | number) | null>> | null;
};

export type MaritimeDeploymentListResponse = {
	id?: string | null;
	agentId?: string | null;
	agentName?: string | null;
	framework?: string | null;
	status?: string | null;
	commitSha?: string | null;
	startedAt?: string | null;
	completedAt?: string | null;
};

export type MaritimeDeploymentResponse = {
	id?: string | null;
	agentId?: string | null;
	status?: string | null;
	commitSha?: string | null;
	imageRef?: string | null;
	buildLog?: string | null;
	startedAt?: string | null;
	completedAt?: string | null;
	failureKind?: string | null;
	errorCode?: string | null;
	errorTitle?: string | null;
	errorMessage?: string | null;
	errorAction?: string | null;
};

/** The physical phone behind a Metal computer, as of ``checked_at``. */
export type MaritimeDeviceOut = {
	number?: number | null;
	model?: string | null;
	androidVersion?: string | null;
	batteryPercent?: number | null;
	temperatureC?: number | null;
	charging?: boolean | null;
	online?: boolean | null;
	checkedAt?: string | null;
	adbPort?: number | null;
};

/** One record to add at the DNS provider. ``purpose`` is ``routing``, ``ownership``, or ``certificate``. */
export type MaritimeDnsRecordItem = {
	type?: string | null;
	name?: string | null;
	value?: string | null;
	purpose?: string | null;
};

/** One domain with the records it still needs and where it is in its life. ``url`` is the HTTPS address of an exact domain, and ``None`` for a wildcard, whose addresses are ``https://<label>.<base>/``. */
export type MaritimeDomainItem = {
	id?: string | null;
	hostname?: string | null;
	kind?: string | null;
	agentId?: string | null;
	state?: string | null;
	url?: string | null;
	dnsRecords?: Array<MaritimeDnsRecordItem> | null;
	error?: string | null;
	createdAt?: string | null;
	liveAt?: string | null;
	checkedAt?: string | null;
};

/** The account's domains. ``enabled`` is False when this deployment cannot add domains. */
export type MaritimeDomainList = {
	items?: Array<MaritimeDomainItem> | null;
	enabled?: boolean | null;
};

export type MaritimeDuplicateAgentResponse = {
	projectId?: string | null;
	created?: Array<MaritimeAgentResponse> | null;
};

/** An end user's most recent activity, newest first. */
export type MaritimeEndUserActivity = {
	items?: Array<MaritimeEndUserActivityItem> | null;
};

/** One line of an end user's timeline. */
export type MaritimeEndUserActivityItem = {
	kind?: string | null;
	at?: string | null;
	agentId?: string | null;
	agentName?: string | null;
	text?: string | null;
	reply?: string | null;
	replies?: Array<string> | null;
	images?: Array<string> | null;
	repliedAt?: string | null;
	status?: string | null;
	computeSeconds?: number | null;
	scheduled?: boolean | null;
	scheduleLabel?: string | null;
};

/** One agent of an end user, as listed on the end user. */
export type MaritimeEndUserAgentSummary = {
	id?: string | null;
	name?: string | null;
	status?: string | null;
	framework?: string | null;
	templateId?: string | null;
	projectId?: string | null;
	projectRole?: string | null;
	baseAgent?: MaritimeBaseAgentRef | null;
	createdAt?: string | null;
	lastActiveAt?: string | null;
};

/** One end user with its agents and access rollups. */
export type MaritimeEndUserDetail = {
	id?: string | null;
	externalId?: string | null;
	displayName?: string | null;
	metadata?: Record<string, (string | number | boolean) | null> | null;
	tags?: Array<string> | null;
	status?: string | null;
	policy?: Record<string, number> | null;
	agentCount?: number | null;
	agents?: Array<MaritimeEndUserAgentSummary> | null;
	aiSpendCents30d?: number | null;
	messageCount?: number | null;
	lastMessage?: MaritimeEndUserLastMessage | null;
	activity14d?: Array<number> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	lastActiveAt?: string | null;
	liveTokenCount?: number | null;
};

/** The last thing said between the end user and their agent. */
export type MaritimeEndUserLastMessage = {
	at?: string | null;
	fromAgent?: boolean | null;
	text?: string | null;
	imageCount?: number | null;
	failed?: boolean | null;
};

/** One page of end users. */
export type MaritimeEndUserList = {
	items?: Array<MaritimeEndUserResponse> | null;
	nextCursor?: string | null;
};

/** The policy after a change and how many agents it was applied to. */
export type MaritimeEndUserPolicyResponse = {
	policy?: Record<string, number> | null;
	appliedToAgents?: number | null;
};

/** One end user with its rollups. */
export type MaritimeEndUserResponse = {
	id?: string | null;
	externalId?: string | null;
	displayName?: string | null;
	metadata?: Record<string, (string | number | boolean) | null> | null;
	tags?: Array<string> | null;
	status?: string | null;
	policy?: Record<string, number> | null;
	agentCount?: number | null;
	agents?: Array<MaritimeEndUserAgentSummary> | null;
	aiSpendCents30d?: number | null;
	messageCount?: number | null;
	lastMessage?: MaritimeEndUserLastMessage | null;
	activity14d?: Array<number> | null;
	createdAt?: string | null;
	updatedAt?: string | null;
	lastActiveAt?: string | null;
};

/** The account's users now and per day, oldest day first. */
export type MaritimeEndUserSummary = {
	totalUsers?: number | null;
	activeUsers7d?: number | null;
	neverMessaged?: number | null;
	messages?: number | null;
	days?: Array<MaritimeEndUserSummaryDay> | null;
};

/** One UTC day of the account's users. */
export type MaritimeEndUserSummaryDay = {
	day?: string | null;
	users?: number | null;
	newUsers?: number | null;
	activeUsers?: number | null;
	messages?: number | null;
	usingUsers?: number | null;
	aiCents?: number | null;
};

/** A minted token. ``token`` is shown once. */
export type MaritimeEndUserTokenResponse = {
	token?: string | null;
	agentId?: string | null;
	scopes?: Array<string> | null;
	expiresAt?: string | null;
};

export type MaritimeEnvVarResponse = {
	id?: string | null;
	agentId?: string | null;
	key?: string | null;
	value?: string | null;
	isSecret?: boolean | null;
	warning?: string | null;
};

export type MaritimeExecOut = {
	exitCode?: number | null;
	stdout?: string | null;
	stderr?: string | null;
};

export type MaritimeExitChoice = {
	mode?: string | null;
	countryCode?: string | null;
	state?: string | null;
	city?: string | null;
	session?: string | null;
	throughNetworkId?: string | null;
};

export type MaritimeFeedbackResponse = {
	id?: string | null;
	kind?: string | null;
	subject?: string | null;
	message?: string | null;
	agentId?: string | null;
	requestId?: string | null;
	statusCode?: number | null;
	tool?: string | null;
	createdAt?: string | null;
};

export type MaritimeFileEntry = {
	name?: string | null;
	size?: number | null;
	isDir?: boolean | null;
	mtime?: number | null;
};

export type MaritimeFileListOut = {
	path?: string | null;
	entries?: Array<MaritimeFileEntry> | null;
};

export type MaritimeFixedAddressOut = {
	ip?: string | null;
	status?: string | null;
};

export type MaritimeFixedOption = {
	available?: boolean | null;
	reason?: string | null;
	priceLabel?: string | null;
};

export type MaritimeFrontDoorUser = {
	externalUserId?: string | null;
	agentId?: string | null;
	agentStatus?: string | null;
	displayName?: string | null;
	messageCount?: number | null;
	lastActiveAt?: string | null;
	createdAt?: string | null;
};

export type MaritimeInstallCommands = {
	windows?: string | null;
	macos?: string | null;
	linux?: string | null;
};

export type MaritimeInstallInfo = {
	networkName?: string | null;
	resources?: Array<MaritimeInstallResourceOut> | null;
	allowInternet?: boolean | null;
	commands?: MaritimeInstallCommands | null;
	expiresAt?: string | null;
	edgeHost?: string | null;
};

export type MaritimeInstallOut = {
	token?: string | null;
	expiresAt?: string | null;
	itUrl?: string | null;
	allowInternet?: boolean | null;
	commands?: MaritimeInstallCommands | null;
};

export type MaritimeInstallResourceOut = {
	name?: string | null;
	target?: string | null;
};

export type MaritimeInternetOptions = {
	presets?: Array<MaritimePresetOut> | null;
	fixed?: MaritimeFixedOption | null;
	country?: MaritimeCountryOption | null;
	through?: MaritimeThroughOption | null;
};

export type MaritimeInternetPolicy = {
	mode?: string | null;
	presetId?: string | null;
	allow?: Array<string> | null;
	deny?: Array<string> | null;
};

export type MaritimeInviteAcceptedResponse = {
	organization?: MaritimeOrganizationResponse | null;
};

export type MaritimeInvitePreviewResponse = {
	organizationId?: string | null;
	organizationName?: string | null;
	inviterName?: string | null;
	email?: string | null;
	role?: string | null;
	expiresAt?: string | null;
};

export type MaritimeInviteResponse = {
	id?: string | null;
	email?: string | null;
	role?: string | null;
	invitedBy?: string | null;
	invitedByName?: string | null;
	createdAt?: string | null;
	expiresAt?: string | null;
	link?: string | null;
};

/** Invoice details with PDF link. ``product`` names what the invoice billed: ``agents`` (the seat plan), ``computers``, ``ai_credits``, ``credits`` (legacy bundles) or None when unknown. */
export type MaritimeInvoiceResponse = {
	id?: string | null;
	stripeInvoiceId?: string | null;
	product?: string | null;
	amountPaid?: number | null;
	currency?: string | null;
	status?: string | null;
	invoicePdfUrl?: string | null;
	hostedInvoiceUrl?: string | null;
	amountDue?: number | null;
	paymentFailed?: boolean | null;
	billingPeriodStart?: string | null;
	billingPeriodEnd?: string | null;
	paidAt?: string | null;
	createdAt?: string | null;
};

/** One name under a wildcard domain: an agent's, or a sandbox port's with ``agentId`` null. */
export type MaritimeLabelItem = {
	id?: string | null;
	label?: string | null;
	agentId?: string | null;
	sandboxId?: string | null;
	port?: number | null;
	url?: string | null;
};

export type MaritimeLabelList = {
	items?: Array<MaritimeLabelItem> | null;
};

export type MaritimeLiveViewResponse = {
	liveViewUrl?: string | null;
	sessionId?: string | null;
	startedAt?: string | null;
	reason?: string | null;
};

export type MaritimeLlmCall = {
	id?: string | null;
	timestamp?: string | null;
	model?: string | null;
	promptTokens?: number | null;
	cachedTokens?: number | null;
	completionTokens?: number | null;
	reasoningTokens?: number | null;
	costCents?: number | null;
	upstreamRequestId?: string | null;
};

export type MaritimeLlmCallPage = {
	calls?: Array<MaritimeLlmCall> | null;
	nextBefore?: string | null;
};

export type MaritimeLogEntryResponse = {
	id?: string | null;
	agentId?: string | null;
	level?: string | null;
	message?: string | null;
	timestamp?: string | null;
	source?: string | null;
};

export type MaritimeMeResponse = {
	userId?: string | null;
	enabled?: boolean | null;
	organization?: MaritimeOrganizationResponse | null;
	own?: MaritimeOrganizationResponse | null;
	memberships?: Array<MaritimeOrganizationResponse> | null;
};

export type MaritimeMemberResponse = {
	userId?: string | null;
	name?: string | null;
	email?: string | null;
	role?: string | null;
	joinedAt?: string | null;
};

export type MaritimeMessageState = {
	messageId?: string | null;
	externalUserId?: string | null;
	agentId?: string | null;
	status?: string | null;
	reply?: string | null;
	error?: string | null;
	userCreated?: boolean | null;
	metadata?: Record<string, MaritimeJsonValue> | null;
	createdAt?: string | null;
	repliedAt?: string | null;
};

export type MaritimeMetalAppListOut = {
	apps?: Array<MaritimeMetalAppOut> | null;
};

/** An APK the account uploaded. ``app_url`` is what ``appium:app`` takes. */
export type MaritimeMetalAppOut = {
	id?: string | null;
	name?: string | null;
	sha256?: string | null;
	sizeBytes?: number | null;
	appUrl?: string | null;
	createdAt?: string | null;
};

/** The only response that carries a link secret, inside ``url``. */
export type MaritimeMintedLinkResponse = {
	id?: string | null;
	url?: string | null;
	expiresAt?: string | null;
};

export type MaritimeNetworkRef = {
	id?: string | null;
	name?: string | null;
};

/** Names the finite operation kinds in the Fleet API. */
export type MaritimeOperationKind = string;

/** Contains immutable resource references produced by a successful workflow. */
export type MaritimeOperationResult = {
	agent_id?: string | null;
	snapshot_id?: string | null;
	delivery_id?: string | null;
	deletion_report_id?: string | null;
	boot_id?: string | null;
	drain_outcome?: string | null;
};

/** Contains one immutable, contract-shaped observation of a durable operation. */
export type MaritimeOperationSnapshot = {
	id?: string | null;
	kind?: MaritimeOperationKind | null;
	state?: MaritimeOperationState | null;
	created_at?: string | null;
	updated_at?: string | null;
	deadline_at?: string | null;
	agent_id?: string | null;
	queue_reason?: string | null;
	result?: MaritimeOperationResult | null;
	error?: MaritimeProblem | null;
	targets?: Array<MaritimeTargetResult> | null;
	outcome?: string | null;
};

/** Names operation states, including immutable terminal outcomes. */
export type MaritimeOperationState = string;

export type MaritimeOrganizationResponse = {
	id?: string | null;
	name?: string | null;
	role?: string | null;
};

/** Payment method display metadata. */
export type MaritimePaymentMethodResponse = {
	id?: string | null;
	type?: string | null;
	cardBrand?: string | null;
	cardLast4?: string | null;
	cardExpMonth?: number | null;
	cardExpYear?: number | null;
	isDefault?: boolean | null;
};

export type MaritimePreferences = {
	trace_collection_enabled?: boolean | null;
	tos_accepted?: boolean | null;
};

export type MaritimePresetList = {
	presets?: Array<MaritimePresetOut> | null;
};

export type MaritimePresetOut = {
	id?: string | null;
	name?: string | null;
	allow?: Array<string> | null;
	deny?: Array<string> | null;
	builtIn?: boolean | null;
	inUse?: number | null;
};

export type MaritimePrivateNetworkList = {
	networks?: Array<MaritimePrivateNetworkOut> | null;
};

export type MaritimePrivateNetworkOut = {
	id?: string | null;
	name?: string | null;
	createdAt?: string | null;
	cutOff?: boolean | null;
	status?: string | null;
	statusDetail?: string | null;
	allowsInternet?: boolean | null;
	connectors?: Array<MaritimeConnectorOut> | null;
	resources?: Array<MaritimeResourceOut> | null;
};

/** Contains a content-free error supplied by the workflow owner. */
export type MaritimeProblem = {
	type?: string | null;
	title?: string | null;
	status?: number | null;
	code?: string | null;
	detail?: string | null;
	request_id?: string | null;
	retryable?: boolean | null;
	violations?: Array<MaritimeViolation> | null;
};

export type MaritimeProjectChannelResponse = {
	id?: string | null;
	channelType?: string | null;
	botUsername?: string | null;
	webhookUrl?: string | null;
	enabled?: boolean | null;
	bindingCount?: number | null;
};

export type MaritimeProjectInstanceSummary = {
	id?: string | null;
	name?: string | null;
	status?: string | null;
	projectRole?: string | null;
	bindingCount?: number | null;
	lastActiveAt?: string | null;
};

export type MaritimeProjectResponse = {
	id?: string | null;
	name?: string | null;
	baseAgentId?: string | null;
	newChatPolicy?: string | null;
	maxInstances?: number | null;
	warmPoolSize?: number | null;
	instanceComputeMinutesLimit?: number | null;
	warmReady?: number | null;
	instances?: Array<MaritimeProjectInstanceSummary> | null;
	channels?: Array<MaritimeProjectChannelResponse> | null;
	createdAt?: string | null;
};

export type MaritimeResourceOut = {
	id?: string | null;
	networkId?: string | null;
	name?: string | null;
	target?: string | null;
	address?: string | null;
	approved?: boolean | null;
};

export type MaritimeRevokedCount = {
	revoked?: number | null;
};

export type MaritimeScreenOut = {
	width?: number | null;
	height?: number | null;
	modelWidth?: number | null;
};

export type MaritimeSessionListOut = {
	sessions?: Array<MaritimeSessionOut> | null;
};

export type MaritimeSessionOut = {
	id?: string | null;
	computerId?: string | null;
	startedAt?: string | null;
	lastActionAt?: string | null;
	endedAt?: string | null;
	wallSeconds?: number | null;
	actions?: number | null;
	screenshots?: number | null;
	bytesOut?: number | null;
	invocationsCharged?: number | null;
	endReason?: string | null;
	client?: string | null;
	modelHint?: string | null;
	graceUntil?: string | null;
};

/** The open session on a computer, as the dashboard list shows it. */
export type MaritimeSessionSummaryOut = {
	id?: string | null;
	startedAt?: string | null;
	lastActionAt?: string | null;
	actions?: number | null;
	screenshots?: number | null;
	client?: string | null;
};

/** One live link, without its secret. */
export type MaritimeShareLinkItem = {
	id?: string | null;
	kind?: string | null;
	endUserExternalId?: string | null;
	expiresAt?: string | null;
	createdAt?: string | null;
	lastUsedAt?: string | null;
};

export type MaritimeShareLinkList = {
	items?: Array<MaritimeShareLinkItem> | null;
};

export type MaritimeSignedWebhookResponse = {
	path?: string | null;
	scheme?: string | null;
	url?: string | null;
};

/** Subscription status information. */
export type MaritimeSubscriptionResponse = {
	id?: string | null;
	agentId?: string | null;
	agentName?: string | null;
	tier?: string | null;
	status?: string | null;
	cancelAtPeriodEnd?: boolean | null;
	currentPeriodStart?: string | null;
	currentPeriodEnd?: string | null;
	canceledAt?: string | null;
};

export type MaritimeTakeoverCompleteOut = {
	takeoverSeq?: number | null;
	screenshot?: MaritimeActionResult | null;
};

/** Records an individual group-wake target without hiding its failure. */
export type MaritimeTargetResult = {
	agent_id?: string | null;
	state?: string | null;
	error?: MaritimeProblem | null;
};

/** Reports the state of one exact builtin delivery identity. */
export type MaritimeTemplateTurnReceipt = {
	delivery_id?: string | null;
	state?: string | null;
	response?: string | null;
	error?: string | null;
};

export type MaritimeTestResult = {
	destination?: string | null;
	reached?: boolean | null;
	durationMs?: number | null;
	reason?: string | null;
};

export type MaritimeThroughOption = {
	available?: boolean | null;
	reason?: string | null;
	networks?: Array<MaritimeNetworkRef> | null;
};

export type MaritimeTriggerResponse = {
	id?: string | null;
	agentId?: string | null;
	type?: string | null;
	config?: Record<string, MaritimeJsonValue> | null;
	enabled?: boolean | null;
};

export type MaritimeUsageOut = {
	from?: string | null;
	to?: string | null;
	invocations?: number | null;
	wallSeconds?: number | null;
	actions?: number | null;
	screenshots?: number | null;
	computers?: Array<MaritimeComputerUsageOut> | null;
};

export type MaritimeUsageReport = {
	periodStart?: string | null;
	periodEnd?: string | null;
	hostingBasis?: string | null;
	plan?: string | null;
	computeMinutes?: number | null;
	hostingCostCents?: number | null;
	llmCostCents?: number | null;
	totalCostCents?: number | null;
	agents?: Array<MaritimeAgentUsage> | null;
};

export type MaritimeViewerOut = {
	url?: string | null;
	expiresAt?: string | null;
	mode?: string | null;
};

/** Contains a safe field validation failure. */
export type MaritimeViolation = {
	field?: string | null;
	reason?: string | null;
};

export type MaritimeWakeOut = {
	status?: string | null;
	wakeMs?: number | null;
	method?: string | null;
};

export type MaritimeWalletBalanceResponse = {
	balanceCents?: number | null;
	balanceDollars?: number | null;
};

export type MaritimeWebhookCreated = {
	id?: string | null;
	url?: string | null;
	events?: Array<string> | null;
	isActive?: boolean | null;
	lastDeliveredAt?: string | null;
	lastStatusCode?: number | null;
	consecutiveFailures?: number | null;
	createdAt?: string | null;
	/** Signing secret, shown once. Verify X-Maritime-Signature with it. */
	secret?: string | null;
};

export type MaritimeWebhookDeliveryResponse = {
	id?: string | null;
	subscriptionId?: string | null;
	event?: string | null;
	status?: string | null;
	attempts?: number | null;
	nextAttemptAt?: string | null;
	lastStatusCode?: number | null;
	lastError?: string | null;
	createdAt?: string | null;
	deliveredAt?: string | null;
	payload?: Record<string, MaritimeJsonValue> | null;
};

export type MaritimeWebhookResponse = {
	id?: string | null;
	url?: string | null;
	events?: Array<string> | null;
	isActive?: boolean | null;
	lastDeliveredAt?: string | null;
	lastStatusCode?: number | null;
	consecutiveFailures?: number | null;
	createdAt?: string | null;
};

export type MaritimeWorkloadNetwork = {
	kind?: string | null;
	workloadId?: string | null;
	cutOff?: boolean | null;
	internet?: MaritimeInternetPolicy | null;
	exit?: MaritimeExitChoice | null;
	exitIp?: string | null;
	fixedAddress?: MaritimeFixedAddressOut | null;
	enforcement?: string | null;
	metadataUrl?: string | null;
	options?: MaritimeInternetOptions | null;
	access?: Array<string> | null;
	availableResources?: Array<MaritimeResourceOut> | null;
};

export type MaritimeOperationInputs = {
	'account.delete': {
		reason?: string | null;
	};
	'account.limits': Record<string, never>;
	'activity.list': {
		limit?: number;
		/** Only these types (repeat for several). Default: all three. */
		type?: Array<'lifecycle' | 'error' | 'trigger_fired'>;
		/** Only entries strictly older than this ISO timestamp (pagination cursor). */
		before?: string;
		/** Only entries at or after this ISO timestamp. */
		since?: string;
		/** Only entries at or before this ISO timestamp. */
		until?: string;
		/** Only the events of this agent or computer. */
		agent_id?: string;
		/** Only the events of the machines of this end user (the external id). */
		external_id?: string;
	};
	'agentTemplates.list': Record<string, never>;
	'agents.activity': {
		agent_id: string;
		limit?: number;
		/** Only entries strictly older than this ISO timestamp (pagination cursor). */
		before?: string;
		type?:
			| 'trigger_fired'
			| 'llm_call'
			| 'tool_call'
			| 'lifecycle'
			| 'error'
			| 'outcome';
	};
	'agents.browserLiveView': {
		agent_id: string;
	};
	'agents.capabilities.change': {
		agent_id: string;
		capability: 'identity' | 'browser';
		action: 'add' | 'remove';
	};
	'agents.capabilities.get': {
		agent_id: string;
	};
	'agents.channels.get': {
		agent_id: string;
	};
	'agents.channels.update': {
		agent_id: string;
		channels: Record<string, MaritimeJsonValue>;
		auto_start?: boolean;
	};
	'agents.channels.validateTelegram': {
		agent_id: string;
		bot_token: string;
	};
	'agents.chat.getTurn': {
		agent_id: string;
		delivery_id: string;
	};
	'agents.chat.send': {
		agent_id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** X-Maritime-Chat-Result header. 'turns-v1' answers with a turn receipt (pending, reply or failure) instead of the legacy reply; read a pending turn with agents.chat.getTurn. */
		chat_result?: string;
		message: string;
		conversation_id?: string | null;
		/** String key-value pairs delivered to the agent's container with this message only, for example the sender's user id and a short-lived token for your own tools. Maritime does not store or log them and does not show them to the model. */
		context?: Record<string, string> | null;
	};
	'agents.create': {
		name: string;
		description?: string | null;
		externalId?: string | null;
		instructions?: string | null;
		framework?: string;
		tier?: string;
		memMb?: number | null;
		vcpus?: number | null;
		idleTtlSeconds?: number | null;
		diskGb?: number | null;
		computeMinutesLimit?: number | null;
		githubRepo?: string | null;
		branch?: string | null;
		imageName?: string | null;
		templateId?: string | null;
		autoPair?: boolean;
		gatewayPassword?: string | null;
		serverId?: string | null;
		initialEnvVars?: Array<MaritimeInitialEnvVarInput>;
		useMaritimeLlm?: boolean;
		exposedPort?: number | null;
		healthCheckPath?: string | null;
		hasWebUi?: boolean;
		publicWeb?: boolean;
		desktop?: boolean;
		uploadS3Key?: string | null;
		addOns?: Array<string>;
		network?: Record<string, MaritimeJsonValue> | null;
	};
	'agents.createOwnerLink': {
		agent_id: string;
	};
	'agents.delete': {
		agent_id: string;
	};
	'agents.desktop.getMode': {
		agent_id: string;
	};
	'agents.desktop.takeover': {
		agent_id: string;
		mode: string;
		reason?: string | null;
		success?: boolean;
		note?: string | null;
	};
	'agents.desktop.updateConfig': {
		agent_id: string;
		enabled: boolean;
	};
	'agents.diagnostic': {
		agent_id: string;
	};
	'agents.duplicate': {
		agent_id: string;
		count?: number;
		namePrefix?: string | null;
	};
	'agents.env.create': {
		agent_id: string;
		key: string;
		value: string;
		isSecret?: boolean;
	};
	'agents.env.delete': {
		agent_id: string;
		key: string;
	};
	'agents.env.list': {
		agent_id: string;
	};
	'agents.env.update': {
		agent_id: string;
		key: string;
		value: string;
		isSecret?: boolean | null;
	};
	'agents.exec.cancel': {
		agent_id: string;
		execution_id: string;
	};
	'agents.exec.get': {
		agent_id: string;
		execution_id: string;
	};
	'agents.exec.run': {
		agent_id: string;
		/** A shell string, or an array of arguments the server shell-quotes. */
		command: string | Array<string>;
		/** true answers 202 at once with an executionId (read it with agents.exec.get); false (default) waits. */
		detached?: boolean;
		/** Execution limit in seconds. Default 60 attached, 3,600 detached. */
		timeout?: number;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.files.delete': {
		agent_id: string;
		path: string;
	};
	'agents.files.download': {
		agent_id: string;
		path: string;
	};
	'agents.files.list': {
		agent_id: string;
		path?: string;
	};
	'agents.files.mkdir': {
		agent_id: string;
		/** Absolute path of the new directory. */
		path: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.files.move': {
		agent_id: string;
		/** Absolute source path. */
		from: string;
		/** Absolute destination path; 409 if it exists. */
		to: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.files.upload': {
		agent_id: string;
		file: FileInput;
		message?: string | null;
		dest_dir?: string | null;
	};
	'agents.files.write': {
		agent_id: string;
		/** Absolute path on the agent's volume (the root files.list reports). */
		path: string;
		/** UTF-8 text to write. */
		content: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.get': {
		agent_id: string;
	};
	'agents.getStopOperation': {
		agent_id: string;
		operation_id: string;
	};
	'agents.gmail.connect': {
		agent_id: string;
	};
	'agents.gmail.disconnect': {
		agent_id: string;
	};
	'agents.gmail.enable': {
		agent_id: string;
	};
	'agents.gmail.status': {
		agent_id: string;
	};
	'agents.hermes.pairings.allow': {
		agent_id: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.hermes.pairings.approve': {
		agent_id: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.hermes.pairings.list': {
		agent_id: string;
	};
	'agents.hermes.pairings.revoke': {
		agent_id: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.inkboxIdentity': {
		agent_id: string;
	};
	'agents.invoke': {
		agent_id: string;
		/** The agent's invoke token (agents.webhookToken.get). Calls without one still work for now but are being phased out. */
		token?: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'agents.list': {
		/** Filter by exact agent name */
		name?: string;
		/** Filter by caller-supplied external id (exact match) */
		externalId?: string;
	};
	'agents.listServers': Record<string, never>;
	'agents.llm.calls': {
		agent_id: string;
		limit?: number;
		/** Only entries strictly older than this ISO timestamp (pagination cursor). */
		before?: string;
	};
	'agents.llm.deleteSpendLimit': {
		agent_id: string;
	};
	'agents.llm.getSpendLimit': {
		agent_id: string;
	};
	'agents.llm.reset': {
		agent_id: string;
	};
	'agents.llm.setSpendLimit': {
		agent_id: string;
		monthlyLimitCents: number | null;
	};
	'agents.llm.status': {
		agent_id: string;
	};
	'agents.logs': {
		agent_id: string;
		limit?: number;
		level?: string;
		/** Only entries strictly older than this ISO timestamp (pagination cursor). */
		before?: string;
	};
	'agents.maritimeTelegram.connect': {
		agent_id: string;
	};
	'agents.maritimeTelegram.disconnect': {
		agent_id: string;
	};
	'agents.maritimeTelegram.status': {
		agent_id: string;
	};
	'agents.reloadEnv': {
		agent_id: string;
	};
	'agents.resetToUpstream': {
		agent_id: string;
	};
	'agents.resize': {
		agent_id: string;
		mem_mb?: number | null;
		disk_gb?: number | null;
		always_on?: boolean | null;
	};
	'agents.restart': {
		agent_id: string;
	};
	'agents.setVisibility': {
		agent_id: string;
		visibility: 'private' | 'public';
	};
	'agents.shareLinks.create': {
		agent_id: string;
		ttlSeconds?: number | null;
		endUserExternalId?: string | null;
	};
	'agents.shareLinks.list': {
		agent_id: string;
	};
	'agents.shareLinks.revoke': {
		agent_id: string;
		link_id: string;
	};
	'agents.shareLinks.revokeForEndUser': {
		agent_id: string;
		endUserExternalId: string;
	};
	'agents.signedWebhook.delete': {
		agent_id: string;
	};
	'agents.signedWebhook.get': {
		agent_id: string;
	};
	'agents.signedWebhook.set': {
		agent_id: string;
		path: string;
		scheme: 'spectrum_v0';
		secret: string;
	};
	'agents.skills.delete': {
		agent_id: string;
		skill_name: string;
	};
	'agents.skills.export': {
		agent_id: string;
		skill_name: string;
	};
	'agents.skills.install': {
		agent_id: string;
		slug?: string | null;
		git?: string | null;
		version?: string | null;
		force?: boolean;
		env?: Record<string, string> | null;
	};
	'agents.skills.list': {
		agent_id: string;
	};
	'agents.skills.search': {
		agent_id: string;
		/** ClawHub search query (empty returns nothing) */
		q?: string;
		limit?: number;
	};
	'agents.skills.setAllowlist': {
		agent_id: string;
		allowlist?: Array<string> | null;
	};
	'agents.skills.setEnv': {
		agent_id: string;
		env: Record<string, string>;
	};
	'agents.skills.upload': {
		agent_id: string;
		archiveBase64: string;
		name?: string | null;
		env?: Record<string, string> | null;
	};
	'agents.sleep': {
		agent_id: string;
	};
	'agents.start': {
		agent_id: string;
	};
	'agents.stats': {
		agent_id: string;
	};
	'agents.stop': {
		agent_id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		drain_timeout_seconds?: number;
		force?: boolean;
		deadline_at?: string;
	};
	'agents.triggers.create': {
		agent_id: string;
		type: string;
		config?: Record<string, MaritimeJsonValue>;
		enabled?: boolean;
	};
	'agents.triggers.delete': {
		agent_id: string;
		trigger_id: string;
	};
	'agents.triggers.list': {
		agent_id: string;
	};
	'agents.triggers.update': {
		agent_id: string;
		trigger_id: string;
		config?: Record<string, MaritimeJsonValue> | null;
		enabled?: boolean | null;
	};
	'agents.update': {
		agent_id: string;
		name?: string | null;
		description?: string | null;
		instructions?: string | null;
		framework?: string | null;
		tier?: string | null;
		githubRepo?: string | null;
		autoPair?: boolean | null;
		exposedPort?: number | null;
		healthCheckPath?: string | null;
		hasWebUi?: boolean | null;
		publicPlay?: boolean | null;
	};
	'agents.webhookToken.get': {
		agent_id: string;
	};
	'agents.webhookToken.rotate': {
		agent_id: string;
	};
	'agents.whatsapp.cancel': {
		agent_id: string;
	};
	'agents.whatsapp.log': {
		agent_id: string;
	};
	'agents.whatsapp.pairings.approve': {
		agent_id: string;
		code: string;
	};
	'agents.whatsapp.pairings.deny': {
		agent_id: string;
		code: string;
	};
	'agents.whatsapp.pairings.list': {
		agent_id: string;
	};
	'agents.whatsapp.start': {
		agent_id: string;
	};
	'agents.whatsapp.status': {
		agent_id: string;
	};
	'apiKeys.create': {
		/** Human-readable name for this key */
		name: string;
		/** Scopes: provision (create), deploy (lifecycle/chat), secrets (env vars), manage (delete + everything, wildcard). fleet grants the automatically bound fleet; nova is legacy and exclusive. Defaults to full access; pass a narrower set to restrict a key. */
		scopes?: Array<string>;
		/** Key expiry in days from now. Null = never expires */
		expires_in_days?: number | null;
		/** Restrict this key to one project (plan 22 §3). Scoped keys only work on the /api/v1 partner surface (front door, usage) for that project; every other endpoint rejects them. */
		project_id?: string | null;
	};
	'apiKeys.list': Record<string, never>;
	'apiKeys.revoke': {
		key_id: string;
	};
	'appium.sessions.get': {
		session_id: string;
	};
	'appium.sessions.list': {
		computerId?: string;
		limit?: number;
	};
	'apps.delete': {
		app_id: string;
	};
	'apps.get': {
		app_id: string;
	};
	'apps.list': Record<string, never>;
	'apps.upload': {
		/** The APK: a public URL, {url}, or {base64, filename}. */
		file: FileInput;
	};
	'billing.agentPay.createLink': {
		plan?: string;
	};
	'billing.agents': Record<string, never>;
	'billing.cancelSwitchToUsage': Record<string, never>;
	'billing.config': Record<string, never>;
	'billing.machineTypes': Record<string, never>;
	'billing.meteredUsage': Record<string, never>;
	'billing.plan.change': {
		plan: string;
		returnPath?: string | null;
		confirm?: boolean;
		promoCode?: string | null;
	};
	'billing.plan.changeWithTrial': {
		plan: string;
		returnPath?: string | null;
		confirm?: boolean;
		promoCode?: string | null;
	};
	'billing.plan.preview': {
		plan: string;
	};
	'billing.plan.resume': Record<string, never>;
	'billing.retryPayment': Record<string, never>;
	'billing.summary': Record<string, never>;
	'billing.switchToUsage': {
		plan: string;
	};
	'billing.trial.cancel': Record<string, never>;
	'billing.trial.get': Record<string, never>;
	'billing.trial.start': {
		returnPath?: string | null;
	};
	'billing.usage': Record<string, never>;
	'computers.actions': {
		computer_id: string;
		action?: string;
		coordinate?: Array<number> | null;
		startCoordinate?: Array<number> | null;
		text?: string | null;
		modifier?: string | null;
		key?: string | null;
		repeat?: number | null;
		scrollDirection?: 'up' | 'down' | 'left' | 'right' | null;
		scrollAmount?: number | null;
		duration?: number | null;
		region?: Array<number> | null;
		package?: string | null;
		url?: string | null;
		path?: string | null;
		detail?: boolean | null;
		noScreenshot?: boolean | null;
		format?: 'png' | 'jpeg' | null;
		quality?: number | null;
		actions?: Array<MaritimeActionRequestInput>;
	};
	'computers.completeTakeover': {
		computer_id: string;
		success?: boolean;
		note?: string;
	};
	'computers.create': {
		externalUserId?: string | null;
		name?: string | null;
		os?: 'linux' | 'windows' | 'android';
		arch?: 'x86_64' | 'arm64';
		screen?: MaritimeScreenRequestInput | null;
		network?: Record<string, MaritimeJsonValue> | null;
	};
	'computers.createViewer': {
		computer_id: string;
		mode?: 'watch' | 'control';
		ttlS?: number;
		reason?: string | null;
	};
	'computers.delete': {
		computer_id: string;
	};
	'computers.exec': {
		computer_id: string;
		command: string;
		timeoutS?: number;
	};
	'computers.files.list': {
		computer_id: string;
		path: string;
	};
	'computers.files.read': {
		computer_id: string;
		path: string;
	};
	'computers.files.write': {
		computer_id: string;
		path: string;
		/** The file content: UTF-8 text, or base64 when encoding is base64. */
		content: string;
		/** How content is written: 'utf8' (default) or 'base64' for binary data. */
		encoding?: 'utf8' | 'base64';
	};
	'computers.get': {
		computer_id: string;
	};
	'computers.installApp': {
		computer_id: string;
		appId: string;
		grantPermissions?: boolean;
	};
	'computers.list': {
		externalUserId?: string;
	};
	'computers.screenshot': {
		computer_id: string;
		format?: string;
		quality?: number;
	};
	'computers.sessions.close': {
		computer_id: string;
	};
	'computers.sessions.list': {
		computer_id: string;
	};
	'computers.sleep': {
		computer_id: string;
	};
	'computers.tools.call': {
		/** The computer id. */
		computer_id: string;
		/** The tool name from computers.tools.list. */
		tool: string;
		/** The tool's arguments, up to 16 KiB. */
		arguments?: Record<string, MaritimeJsonValue>;
	};
	'computers.tools.list': {
		/** The computer id. */
		computer_id: string;
	};
	'computers.usage': {
		from?: string;
		to?: string;
		externalUserId?: string;
	};
	'computers.wake': {
		computer_id: string;
	};
	'deletedAgents.get': {
		agent_id: string;
	};
	'deletedAgents.list': {
		externalId: string;
	};
	'deployments.cancel': {
		deployment_id: string;
	};
	'deployments.create': {
		agentId: string;
		source?: 'github' | 'docker' | 'template' | 'zip';
		repoUrl?: string | null;
		imageName?: string | null;
		branch?: string | null;
		uploadS3Key?: string | null;
	};
	'deployments.get': {
		deployment_id: string;
	};
	'deployments.list': Record<string, never>;
	'deployments.listForAgent': {
		agent_id: string;
		limit?: number;
	};
	'deployments.uploadZip': {
		file: FileInput;
	};
	'domains.check': {
		domain_id: string;
	};
	'domains.create': {
		hostname: string;
		agentId?: string | null;
	};
	'domains.delete': {
		domain_id: string;
	};
	'domains.get': {
		domain_id: string;
	};
	'domains.labels.delete': {
		domain_id: string;
		label: string;
	};
	'domains.labels.list': {
		domain_id: string;
	};
	'domains.labels.set': {
		domain_id: string;
		label: string;
		agentId?: string | null;
		sandboxId?: string | null;
		port?: number | null;
	};
	'domains.list': {
		agentId?: string;
	};
	'endUsers.activity': {
		external_id: string;
		limit?: number;
	};
	'endUsers.agents.create': {
		external_id: string;
		name?: string | null;
		description?: string | null;
		externalId?: string | null;
		instructions?: string | null;
		framework?: string;
		tier?: string;
		memMb?: number | null;
		vcpus?: number | null;
		idleTtlSeconds?: number | null;
		diskGb?: number | null;
		computeMinutesLimit?: number | null;
		githubRepo?: string | null;
		branch?: string | null;
		imageName?: string | null;
		templateId?: string | null;
		autoPair?: boolean;
		gatewayPassword?: string | null;
		serverId?: string | null;
		initialEnvVars?: Array<MaritimeInitialEnvVarInput>;
		useMaritimeLlm?: boolean;
		exposedPort?: number | null;
		healthCheckPath?: string | null;
		hasWebUi?: boolean;
		publicWeb?: boolean;
		desktop?: boolean;
		uploadS3Key?: string | null;
		addOns?: Array<string>;
		network?: Record<string, MaritimeJsonValue> | null;
	};
	'endUsers.agents.list': {
		external_id: string;
	};
	'endUsers.delete': {
		external_id: string;
	};
	'endUsers.get': {
		external_id: string;
	};
	'endUsers.list': {
		status?: string;
		tag?: string;
		externalIdPrefix?: string;
		lastActiveBefore?: string;
		lastActiveAfter?: string;
		/** Matches an external id prefix or a display name */
		q?: string;
		/** Only users of this agent group */
		projectId?: string;
		/** Only the user that owns this agent */
		agentId?: string;
		/** created or lastActive */
		sort?: string;
		cursor?: string;
		limit?: number;
	};
	'endUsers.policy.delete': {
		external_id: string;
	};
	'endUsers.policy.get': {
		external_id: string;
	};
	'endUsers.policy.set': {
		external_id: string;
		policy: Record<string, number | null>;
	};
	'endUsers.resume': {
		external_id: string;
	};
	'endUsers.summary': {
		days?: number;
		/** Comma-separated tags; users with any are left out */
		excludeTags?: string;
	};
	'endUsers.suspend': {
		external_id: string;
	};
	'endUsers.tokens.create': {
		external_id: string;
		agentId?: string | null;
		scopes?: Array<string> | null;
		ttlSeconds?: number | null;
	};
	'endUsers.tokens.revoke': {
		external_id: string;
	};
	'endUsers.upsert': {
		external_id: string;
		displayName?: string | null;
		metadata?: Record<string, (string | number | boolean) | null> | null;
		tags?: Array<string> | null;
	};
	'feedback.create': {
		/** What went wrong, in plain words. Include what you expected. */
		message: string;
		/** What the report is about: one of ['api', 'cli', 'computers', 'dashboard', 'docs', 'other', 'sdk']. */
		kind?: string;
		/** The page URL, endpoint, SDK method or CLI command the report concerns. */
		subject?: string | null;
		/** The Maritime agent the report is about, when there is one. */
		agentId?: string | null;
		/** The X-Request-Id of the failing call, when the report is about one. */
		requestId?: string | null;
		/** HTTP status of the failing call, when the report is about one. */
		statusCode?: number | null;
		/** Who is sending, e.g. "claude-code/2.1.0" or "codex". */
		tool?: string | null;
		/** Up to 20 flat key/value pairs (SDK version, OS, ...). Never put secrets or env values here. */
		context?: Record<string, (string | number | boolean) | null> | null;
	};
	'feedback.list': Record<string, never>;
	'fleet.activity': {
		hours?: number;
		group?: string;
		tzOffsetMinutes?: number;
	};
	'fleet.batchCreate': {
		namePrefix: string;
		count: number;
		templateId?: string | null;
		framework?: string | null;
		githubRepo?: string | null;
		instructions?: string | null;
		tier?: string | null;
		idleTtlSeconds?: number | null;
		envVars?: Array<MaritimeInitialEnvVarInput>;
	};
	'fleet.overview': Record<string, never>;
	'fleet.propagate': {
		path: string;
		content: string;
		agentIds: Array<string>;
		restart?: boolean;
	};
	'fleet.summary': Record<string, never>;
	'health.check': Record<string, never>;
	'llmSpendLimit.deleteDefault': Record<string, never>;
	'llmSpendLimit.getDefault': Record<string, never>;
	'llmSpendLimit.setDefault': {
		monthlyLimitCents: number;
	};
	'logs.list': {
		limit?: number;
		level?: string;
		/** Only entries strictly older than this ISO timestamp (pagination cursor). */
		before?: string;
	};
	'network.activity': {
		networkId?: string;
		workloadKind?: string;
		workloadId?: string;
		limit?: number;
	};
	'network.install.get': {
		token: string;
	};
	'network.install.unixScript': {
		token: string;
	};
	'network.install.windowsScript': {
		token: string;
	};
	'network.presets.create': {
		name: string;
		allow?: Array<string>;
		deny?: Array<string>;
	};
	'network.presets.delete': {
		preset_id: string;
	};
	'network.presets.list': Record<string, never>;
	'network.presets.update': {
		preset_id: string;
		name?: string | null;
		allow?: Array<string> | null;
		deny?: Array<string> | null;
	};
	'network.privateNetworks.addResource': {
		network_id: string;
		name: string;
		target: string;
	};
	'network.privateNetworks.create': {
		name: string;
	};
	'network.privateNetworks.createInstall': {
		network_id: string;
		allowInternet?: boolean;
	};
	'network.privateNetworks.delete': {
		network_id: string;
	};
	'network.privateNetworks.deleteResource': {
		resource_id: string;
	};
	'network.privateNetworks.list': Record<string, never>;
	'network.privateNetworks.update': {
		network_id: string;
		name?: string | null;
		cutOff?: boolean | null;
	};
	'network.settings.get': Record<string, never>;
	'network.settings.update': {
		cutOff?: boolean | null;
		allowFixed?: boolean | null;
		allowCountry?: boolean | null;
		allowThrough?: boolean | null;
		patientData?: boolean | null;
		ownProxyUrl?: string | null;
		countryDataCapGb?: number | null;
	};
	'network.workloads.get': {
		kind: string;
		workload_id: string;
	};
	'network.workloads.newIp': {
		kind: string;
		workload_id: string;
	};
	'network.workloads.test': {
		kind: string;
		workload_id: string;
		destination: string;
	};
	'network.workloads.update': {
		kind: string;
		workload_id: string;
		access?: Array<string> | null;
		cutOff?: boolean | null;
		internet?: MaritimeInternetPolicyInput | null;
		exit?: MaritimeExitChoiceInput | null;
	};
	'notifications.list': Record<string, never>;
	'notifications.markRead': {
		notification_id: string;
	};
	'notifications.readAll': Record<string, never>;
	'notifications.unreadCount': Record<string, never>;
	'organizations.create': {
		name: string;
	};
	'organizations.delete': {
		organization_id: string;
	};
	'organizations.invites.accept': {
		token: string;
	};
	'organizations.invites.create': {
		organization_id: string;
		email: string;
		role?: string;
	};
	'organizations.invites.list': {
		organization_id: string;
	};
	'organizations.invites.preview': {
		token: string;
	};
	'organizations.invites.resend': {
		organization_id: string;
		invite_id: string;
	};
	'organizations.invites.revoke': {
		organization_id: string;
		invite_id: string;
	};
	'organizations.leave': {
		organization_id: string;
	};
	'organizations.me': Record<string, never>;
	'organizations.members.changeRole': {
		organization_id: string;
		user_id: string;
		role: string;
	};
	'organizations.members.list': {
		organization_id: string;
	};
	'organizations.members.remove': {
		organization_id: string;
		user_id: string;
	};
	'organizations.rename': {
		organization_id: string;
		name: string;
	};
	'plans.cancel': {
		reason?: string | null;
		comment?: string | null;
	};
	'plans.launchPromo': Record<string, never>;
	'plans.list': Record<string, never>;
	'plans.portal': {
		flow?: string | null;
	};
	'plans.subscribe': {
		plan: string;
	};
	'preferences.get': Record<string, never>;
	'preferences.update': {
		trace_collection_enabled?: boolean | null;
		tos_accepted?: boolean | null;
	};
	'projects.bindings.list': {
		project_id: string;
	};
	'projects.bindings.reassign': {
		project_id: string;
		binding_id: string;
		agentId: string;
	};
	'projects.bindings.unbind': {
		project_id: string;
		binding_id: string;
	};
	'projects.claimCodes.create': {
		project_id: string;
		count?: number;
		targetAgentId?: string | null;
		expiresInHours?: number | null;
	};
	'projects.claimCodes.list': {
		project_id: string;
	};
	'projects.get': {
		project_id: string;
	};
	'projects.list': Record<string, never>;
	'projects.messages.get': {
		project_id: string;
		message_id: string;
	};
	'projects.messages.send': {
		project_id: string;
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		/** The caller's own end-user id (opaque to Maritime) */
		externalUserId: string;
		message: string;
		/** Seconds to wait for the reply inline; 0 = ack immediately */
		wait?: number;
		/** Claim code, for projects with new_chat_policy=claim */
		claimCode?: string | null;
		displayName?: string | null;
		/** Opaque passthrough, echoed on reads and reply webhooks */
		metadata?: Record<string, MaritimeJsonValue> | null;
	};
	'projects.syncInstances': {
		project_id: string;
	};
	'projects.telegram.connect': {
		project_id: string;
		botToken: string;
	};
	'projects.telegram.disconnect': {
		project_id: string;
	};
	'projects.update': {
		project_id: string;
		name?: string | null;
		newChatPolicy?: string | null;
		maxInstances?: number | null;
		warmPoolSize?: number | null;
		instanceComputeMinutesLimit?: number | null;
	};
	'projects.usage': {
		project_id: string;
	};
	'projects.users.get': {
		project_id: string;
		external_user_id: string;
	};
	'projects.users.list': {
		project_id: string;
	};
	'projects.users.unbind': {
		project_id: string;
		external_user_id: string;
		delete_agent?: boolean;
	};
	'sandboxKeys.create': {
		/** The sandbox id the key is for. */
		sandbox: string;
		/** Lifetime, 60 to 2,592,000 seconds. Default 86,400. */
		ttlSeconds?: number;
	};
	'sandboxKeys.list': {
		/** The sandbox id. */
		sandbox: string;
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxKeys.revoke': {
		key_id: string;
	};
	'sandboxWebhooks.create': {
		/** An https URL. */
		url: string;
		/** At least one event type. */
		events: Array<
			| 'sandbox.created'
			| 'sandbox.running'
			| 'sandbox.paused'
			| 'sandbox.resumed'
			| 'sandbox.ended'
			| 'sandbox.pause_failed'
			| 'sandbox.error'
		>;
	};
	'sandboxWebhooks.delete': {
		webhook_id: string;
	};
	'sandboxWebhooks.deliveries': {
		webhook_id: string;
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxWebhooks.list': {
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxes.code.run': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** The code to run. */
		code: string;
		/** 'python' (the only language). */
		language?: 'python';
		/** A kernel context name; calls without one share the default context. */
		context?: string;
	};
	'sandboxes.commands.get': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** The command id from sandboxes.commands.run. */
		command_id: string;
	};
	'sandboxes.commands.history': {
		sandbox_id: string;
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxes.commands.kill': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** The command id. */
		command_id: string;
		/** SIGTERM (default; SIGKILL follows after 10 seconds) or SIGKILL. */
		signal?: 'SIGTERM' | 'SIGKILL';
	};
	'sandboxes.commands.run': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** A string runs through /bin/sh -c; an array runs as argv with no shell. */
		cmd: string | Array<string>;
		/** Absolute working directory. Default: the home directory of 'user'. */
		cwd?: string;
		/** Extra environment variables. */
		env?: Record<string, string>;
		/** UTF-8 text sent to the process, then stdin closes. */
		stdin?: string;
		/** true returns at once with the command id (read it with sandboxes.commands.get); false (default) waits for the exit. */
		background?: boolean;
		/** Kill the command after this long, 1 to 3,600. Default 60 in the foreground, none in the background. */
		timeoutSeconds?: number;
	};
	'sandboxes.create': {
		/** A name; creating with a name a live sandbox already has returns that sandbox. */
		name?: string;
		/** What to start from: a saved snapshot name, a stock or customer template name, or a public OCI image. Default 'base'. */
		from?: string;
		/** A size preset: small (default), medium, large or xlarge. vcpu, memoryMib and diskGib override its values. */
		size?: 'small' | 'medium' | 'large' | 'xlarge';
		/** vCPUs, 1 to 16. */
		vcpu?: number;
		/** Memory in MiB: 1,024 to 65,536, whole GiB. */
		memoryMib?: number;
		/** Disk in GiB, 5 to 500. */
		diskGib?: number;
		/** 'linux' gives the sandbox a desktop screen (see sandboxes.createScreenViewer). */
		screen?: 'none' | 'linux';
		/** Outbound network policy. */
		network?: {
			/** 'all', 'none', or 'allowlist' with hosts. */
			egress: 'all' | 'none' | 'allowlist';
			/** Allowlisted hosts for egress 'allowlist': exact names or *.domain wildcards. */
			hosts?: Array<string>;
		};
		/** Your end user's id, for per-user caps and usage. */
		endUser?: string;
		/** Count the sandbox against the end user (endUser) rather than the account. */
		forEndUser?: boolean;
		/** Environment variables for every command. */
		env?: Record<string, string>;
		/** Your own string labels; sandboxes.list filters on them. */
		metadata?: Record<string, string>;
		/** Seconds without activity before onIdle acts, 60 to 86,400. Default 300. */
		idleTimeoutSeconds?: number;
		/** What going idle does: 'pause' (default) or 'kill'. */
		onIdle?: 'pause' | 'kill';
		/** Kills the sandbox this long after it starts running, whatever its activity: 60 to 86,400. */
		timeLimitSeconds?: number;
		/** Never pause or end for idleness. */
		keepAwake?: boolean;
		/** Fail at once when there is no capacity instead of waiting. */
		failFast?: boolean;
	};
	'sandboxes.createScreenViewer': {
		sandbox_id: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'sandboxes.createUrl': {
		sandbox_id: string;
		/** The port a server in the sandbox listens on. */
		port: number;
		/** true (default): the URL carries the sandbox urlToken and the port stays private. false makes the port public. */
		token?: boolean;
	};
	'sandboxes.ephemeral.create': {
		/** A name; creating with a name a live sandbox already has returns that sandbox. */
		name?: string;
		/** What to start from: a saved snapshot name, a stock or customer template name, or a public OCI image. Default 'base'. */
		from?: string;
		/** A size preset: small (default), medium, large or xlarge. vcpu, memoryMib and diskGib override its values. */
		size?: 'small' | 'medium' | 'large' | 'xlarge';
		/** vCPUs, 1 to 16. */
		vcpu?: number;
		/** Memory in MiB: 1,024 to 65,536, whole GiB. */
		memoryMib?: number;
		/** Disk in GiB, 5 to 500. */
		diskGib?: number;
		/** 'linux' gives the sandbox a desktop screen (see sandboxes.createScreenViewer). */
		screen?: 'none' | 'linux';
		/** Outbound network policy. */
		network?: {
			/** 'all', 'none', or 'allowlist' with hosts. */
			egress: 'all' | 'none' | 'allowlist';
			/** Allowlisted hosts for egress 'allowlist': exact names or *.domain wildcards. */
			hosts?: Array<string>;
		};
		/** Your end user's id, for per-user caps and usage. */
		endUser?: string;
		/** Count the sandbox against the end user (endUser) rather than the account. */
		forEndUser?: boolean;
		/** Environment variables for every command. */
		env?: Record<string, string>;
		/** Your own string labels; sandboxes.list filters on them. */
		metadata?: Record<string, string>;
		/** Minutes without activity before the sandbox ends: 1 to 60. Default 5. */
		idleMinutes?: number;
		/** Minutes until the sandbox ends whatever its activity: 5 to 1440. Default 1440. */
		timeLimitMinutes?: number;
		/** What going idle does: 'kill' (default) or 'pause'. */
		onIdle?: 'kill' | 'pause';
	};
	'sandboxes.ephemeral.extend': {
		sandbox_id: string;
		/** Minutes from now until the time limit ends the sandbox: 5 to 1440. Default 1440. */
		timeLimitMinutes?: number;
	};
	'sandboxes.ephemeral.kill': {
		sandbox_id: string;
	};
	'sandboxes.ephemeral.list': {
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxes.files.delete': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** Absolute path. */
		path: string;
		/** Remove a directory and everything in it. */
		recursive?: boolean;
	};
	'sandboxes.files.list': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** Absolute path of the directory. */
		path: string;
	};
	'sandboxes.files.read': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** Absolute path of the file. */
		path: string;
	};
	'sandboxes.files.write': {
		/** The sandbox id (sbx-...) or name. The plugin reads its data plane URL and secret first. */
		sandbox_id: string;
		/** Absolute path; parent directories are created. */
		path: string;
		/** The file content: UTF-8 text, or base64 when encoding is base64. */
		content: string;
		/** How content is written: 'utf8' (default) or 'base64' for binary data. */
		encoding?: 'utf8' | 'base64';
	};
	'sandboxes.get': {
		id_or_name: string;
	};
	'sandboxes.info': {
		sandbox_id: string;
	};
	'sandboxes.kill': {
		sandbox_id: string;
	};
	'sandboxes.list': {
		/** Only sandboxes in these states. */
		state?: Array<
			'starting' | 'running' | 'pausing' | 'paused' | 'resuming' | 'ended'
		>;
		/** Only sandboxes whose name starts with this. */
		namePrefix?: string;
		/** Only sandboxes of this end user. */
		endUser?: string;
		/** Only sandboxes with these metadata values (sent as metadata[key]=value). */
		metadata?: Record<string, string>;
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'sandboxes.pause': {
		sandbox_id: string;
	};
	'sandboxes.promote': {
		sandbox_id: string;
	} & { [key: string]: MaritimeJsonValue | undefined };
	'sandboxes.rotateSecret': {
		sandbox_id: string;
	};
	'sandboxes.save': {
		sandbox_id: string;
		/** The snapshot name: pass it as from to sandboxes.create. */
		name: string;
	};
	'sandboxes.update': {
		sandbox_id: string;
		/** Replaces the metadata labels. */
		metadata?: Record<string, string>;
		/** Seconds without activity before onIdle acts. */
		idleTimeoutSeconds?: number;
		/** Never pause or end for idleness. */
		keepAwake?: boolean;
		/** Outbound network policy. */
		network?: {
			/** 'all', 'none', or 'allowlist' with hosts. */
			egress: 'all' | 'none' | 'allowlist';
			/** Allowlisted hosts for egress 'allowlist': exact names or *.domain wildcards. */
			hosts?: Array<string>;
		};
	};
	'sandboxes.usage': {
		sandbox_id: string;
	};
	'secrets.delete': {
		name: string;
	};
	'secrets.list': {
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'secrets.set': {
		name: string;
		/** The secret value, at most 32 KiB. Never returned. */
		value: string;
	};
	'servers.list': Record<string, never>;
	'servers.release': Record<string, never>;
	'servers.rent': Record<string, never>;
	'snapshots.delete': {
		name: string;
	};
	'snapshots.get': {
		name: string;
	};
	'snapshots.list': {
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'stripe.createPortalSession': Record<string, never>;
	'stripe.invoices': Record<string, never>;
	'stripe.paymentMethods': Record<string, never>;
	'stripe.subscriptions.cancel': {
		subscription_id: string;
		immediate?: boolean;
	};
	'stripe.subscriptions.list': Record<string, never>;
	'swarms.cancel': {
		swarm_id: string;
	};
	'swarms.create': {
		/** Idempotency-Key header: a retry with the same key returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotency_key?: string;
		name?: string | null;
		template?: string | null;
		image?: string | null;
		size?: MaritimeSizeInInput;
		count?: number | null;
		command: string | Array<string>;
		inputs?: Array<MaritimeInputInInput> | null;
		timeoutSeconds?: number;
		concurrency?: number | null;
		resultPath?: string | null;
		idempotencyKey?: string | null;
	};
	'swarms.get': {
		swarm_id: string;
	};
	'swarms.getAccess': Record<string, never>;
	'swarms.list': {
		limit?: number;
	};
	'swarms.requestAccess': Record<string, never>;
	'swarms.results': {
		swarm_id: string;
	};
	'templates.create': {
		/** The template name; pass it as from to sandboxes.create. */
		name: string;
		/** A public image reference. Give image or dockerfile, not both. */
		image?: string;
		/** Dockerfile text, at most 64 KiB. Give image or dockerfile, not both. */
		dockerfile?: string;
		/** The command that starts in every new sandbox. */
		startCmd?: string;
		/** The command whose success means a new sandbox is ready. */
		readyCmd?: string;
		/** A size preset: small (default), medium, large or xlarge. vcpu, memoryMib and diskGib override its values. */
		size?: 'small' | 'medium' | 'large' | 'xlarge';
		/** vCPUs, 1 to 16. */
		vcpu?: number;
		/** Memory in MiB: 1,024 to 65,536, whole GiB. */
		memoryMib?: number;
		/** Disk in GiB, 5 to 500. */
		diskGib?: number;
	};
	'templates.delete': {
		name: string;
	};
	'templates.get': {
		name: string;
	};
	'templates.list': {
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'usage.daily': {
		/** ISO start (default: to - 30d) */
		from?: string;
		/** ISO end (default: now) */
		to?: string;
	};
	'usage.report': {
		/** ISO start (default: to - 30d) */
		from?: string;
		/** ISO end (default: now) */
		to?: string;
		projectId?: string;
		externalUserId?: string;
	};
	'usage.sandboxes': {
		/** RFC 3339 start of the window. */
		from: string;
		/** RFC 3339 end of the window. */
		to: string;
		/** Only this sandbox. */
		sandbox?: string;
		/** Only this end user. */
		endUser?: string;
		/** Page size, 1 to 100 (Maritime default 50). */
		limit?: number;
		/** The previous page's nextCursor. */
		cursor?: string;
	};
	'wallet.apiUsage': Record<string, never>;
	'wallet.autoRecharge.get': Record<string, never>;
	'wallet.autoRecharge.set': {
		enabled: boolean;
		thresholdCents?: number | null;
		amountCents?: number | null;
	};
	'wallet.balance': Record<string, never>;
	'wallet.browserUsage': Record<string, never>;
	'wallet.checkDeployBalance': Record<string, never>;
	'wallet.claimSignupBonus': Record<string, never>;
	'wallet.paymentMethod': Record<string, never>;
	'wallet.planUsage': Record<string, never>;
	'wallet.purchaseApiCredits': {
		/** AI credits to buy, in cents, minimum $5 (500) */
		amount_cents: number;
	};
	'wallet.redeemPromo': {
		code: string;
	};
	'wallet.topup': {
		/** Amount in cents, minimum $5 (500) */
		amount_cents: number;
		/** Path to redirect to after checkout (e.g. /enterprise) */
		return_path?: string | null;
	};
	'wallet.transactions': {
		limit?: number;
		offset?: number;
		wallet?: string;
	};
	'wallet.validatePromoCode': {
		code: string;
	};
	'webhooks.create': {
		/** HTTPS endpoint that will receive POSTed events (public hosts only) */
		url: string;
		/** Events to receive (subset of ['agent.deployed', 'agent.error', 'agent.restarted', 'agent.sleeping', 'agent.stopped', 'agent.woken', 'exec.finished', 'message.failed', 'message.reply']). Empty = all. */
		events?: Array<string>;
	};
	'webhooks.delete': {
		sub_id: string;
	};
	'webhooks.deliveries.list': {
		sub_id: string;
		status?: string;
		limit?: number;
	};
	'webhooks.deliveries.replay': {
		delivery_id: string;
	};
	'webhooks.list': Record<string, never>;
	'webhooks.test': {
		sub_id: string;
	};
	'webhooks.update': {
		sub_id: string;
		events?: Array<string> | null;
		isActive?: boolean | null;
	};
};

export type MaritimeOperationOutputs = {
	'account.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'account.limits': MaritimeAccountLimitsResponse;
	'activity.list': MaritimeAccountActivityPage;
	'agentTemplates.list': MaritimeJsonValue;
	'agents.activity': MaritimeActivityPage;
	'agents.browserLiveView': MaritimeLiveViewResponse;
	'agents.capabilities.change': MaritimeJsonValue;
	'agents.capabilities.get': MaritimeJsonValue;
	'agents.channels.get': MaritimeJsonValue;
	'agents.channels.update': MaritimeJsonValue;
	'agents.channels.validateTelegram': MaritimeJsonValue;
	'agents.chat.getTurn': MaritimeTemplateTurnReceipt;
	'agents.chat.send': MaritimeJsonValue;
	'agents.create': MaritimeAgentResponse;
	'agents.createOwnerLink': MaritimeMintedLinkResponse;
	'agents.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.desktop.getMode': MaritimeJsonValue;
	'agents.desktop.takeover': MaritimeJsonValue;
	'agents.desktop.updateConfig': MaritimeJsonValue;
	'agents.diagnostic': MaritimeAgentDiagnosticResponse | null;
	'agents.duplicate': MaritimeDuplicateAgentResponse;
	'agents.env.create': MaritimeEnvVarResponse;
	'agents.env.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.env.list': Array<MaritimeEnvVarResponse>;
	'agents.env.update': MaritimeEnvVarResponse;
	'agents.exec.cancel': MaritimeJsonValue;
	'agents.exec.get': MaritimeJsonValue;
	'agents.exec.run': MaritimeJsonValue;
	'agents.files.delete': MaritimeJsonValue;
	'agents.files.download': FileOutput;
	'agents.files.list': MaritimeJsonValue;
	'agents.files.mkdir': MaritimeJsonValue;
	'agents.files.move': MaritimeJsonValue;
	'agents.files.upload': MaritimeJsonValue;
	'agents.files.write': MaritimeJsonValue;
	'agents.get': MaritimeAgentResponse;
	'agents.getStopOperation': MaritimeOperationSnapshot;
	'agents.gmail.connect': MaritimeJsonValue;
	'agents.gmail.disconnect': MaritimeJsonValue;
	'agents.gmail.enable': MaritimeJsonValue;
	'agents.gmail.status': MaritimeJsonValue;
	'agents.hermes.pairings.allow': MaritimeJsonValue;
	'agents.hermes.pairings.approve': MaritimeJsonValue;
	'agents.hermes.pairings.list': MaritimeJsonValue;
	'agents.hermes.pairings.revoke': MaritimeJsonValue;
	'agents.inkboxIdentity': MaritimeJsonValue;
	'agents.invoke': MaritimeJsonValue;
	'agents.list': MaritimeJsonValue;
	'agents.listServers': MaritimeJsonValue;
	'agents.llm.calls': MaritimeLlmCallPage;
	'agents.llm.deleteSpendLimit': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.llm.getSpendLimit': MaritimeAgentSpendLimitResponse;
	'agents.llm.reset': MaritimeJsonValue;
	'agents.llm.setSpendLimit': MaritimeAgentSpendLimitResponse;
	'agents.llm.status': MaritimeJsonValue;
	'agents.logs': Array<MaritimeLogEntryResponse>;
	'agents.maritimeTelegram.connect': MaritimeJsonValue;
	'agents.maritimeTelegram.disconnect': MaritimeJsonValue;
	'agents.maritimeTelegram.status': MaritimeJsonValue;
	'agents.reloadEnv': MaritimeAgentResponse;
	'agents.resetToUpstream': MaritimeAgentResponse;
	'agents.resize': MaritimeJsonValue;
	'agents.restart': MaritimeAgentResponse;
	'agents.setVisibility': MaritimeAgentResponse;
	'agents.shareLinks.create': MaritimeMintedLinkResponse;
	'agents.shareLinks.list': MaritimeShareLinkList;
	'agents.shareLinks.revoke': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.shareLinks.revokeForEndUser': MaritimeRevokedCount;
	'agents.signedWebhook.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.signedWebhook.get': MaritimeSignedWebhookResponse;
	'agents.signedWebhook.set': MaritimeSignedWebhookResponse;
	'agents.skills.delete': MaritimeJsonValue;
	'agents.skills.export': MaritimeJsonValue;
	'agents.skills.install': MaritimeJsonValue;
	'agents.skills.list': MaritimeJsonValue;
	'agents.skills.search': MaritimeJsonValue;
	'agents.skills.setAllowlist': MaritimeJsonValue;
	'agents.skills.setEnv': MaritimeJsonValue;
	'agents.skills.upload': MaritimeJsonValue;
	'agents.sleep': MaritimeAgentResponse;
	'agents.start': MaritimeAgentResponse;
	'agents.stats': MaritimeJsonValue;
	'agents.stop': MaritimeAgentResponse | MaritimeOperationSnapshot;
	'agents.triggers.create': MaritimeTriggerResponse;
	'agents.triggers.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'agents.triggers.list': Array<MaritimeTriggerResponse>;
	'agents.triggers.update': MaritimeTriggerResponse;
	'agents.update': MaritimeAgentResponse;
	'agents.webhookToken.get': MaritimeJsonValue;
	'agents.webhookToken.rotate': MaritimeJsonValue;
	'agents.whatsapp.cancel': MaritimeJsonValue;
	'agents.whatsapp.log': MaritimeJsonValue;
	'agents.whatsapp.pairings.approve': MaritimeJsonValue;
	'agents.whatsapp.pairings.deny': MaritimeJsonValue;
	'agents.whatsapp.pairings.list': MaritimeJsonValue;
	'agents.whatsapp.start': MaritimeJsonValue;
	'agents.whatsapp.status': MaritimeJsonValue;
	'apiKeys.create': MaritimeApiKeyCreated;
	'apiKeys.list': Array<MaritimeApiKeyResponse>;
	'apiKeys.revoke': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'appium.sessions.get': MaritimeAppiumSessionDetailOut;
	'appium.sessions.list': MaritimeAppiumSessionListOut;
	'apps.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'apps.get': MaritimeMetalAppOut;
	'apps.list': MaritimeMetalAppListOut;
	'apps.upload': MaritimeMetalAppOut;
	'billing.agentPay.createLink': MaritimeJsonValue;
	'billing.agents': Array<MaritimeAgentBillingResponse>;
	'billing.cancelSwitchToUsage': MaritimeJsonValue;
	'billing.config': MaritimeBillingConfigResponse;
	'billing.machineTypes': MaritimeJsonValue;
	'billing.meteredUsage': MaritimeJsonValue;
	'billing.plan.change': MaritimeJsonValue;
	'billing.plan.changeWithTrial': MaritimeJsonValue;
	'billing.plan.preview': MaritimeJsonValue;
	'billing.plan.resume': MaritimeJsonValue;
	'billing.retryPayment': MaritimeJsonValue;
	'billing.summary': MaritimeBillingInfoResponse;
	'billing.switchToUsage': MaritimeJsonValue;
	'billing.trial.cancel': MaritimeJsonValue;
	'billing.trial.get': MaritimeJsonValue;
	'billing.trial.start': MaritimeJsonValue;
	'billing.usage': MaritimeJsonValue;
	'computers.actions': MaritimeActionResult | MaritimeBatchResult;
	'computers.completeTakeover': MaritimeTakeoverCompleteOut;
	'computers.create': MaritimeComputerOut;
	'computers.createViewer': MaritimeViewerOut;
	'computers.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'computers.exec': MaritimeExecOut;
	'computers.files.list': MaritimeFileListOut;
	'computers.files.read': FileOutput;
	'computers.files.write': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'computers.get': MaritimeComputerOut;
	'computers.installApp': MaritimeAppInstallOut;
	'computers.list': MaritimeComputerListOut;
	'computers.screenshot': FileOutput;
	'computers.sessions.close':
		| MaritimeSessionOut
		| {
				/** Maritime accepted the call; it answered with no body. */ success: true;
		  };
	'computers.sessions.list': MaritimeSessionListOut;
	'computers.sleep': MaritimeComputerOut;
	'computers.tools.call': MaritimeJsonValue;
	'computers.tools.list': MaritimeJsonValue;
	'computers.usage': MaritimeUsageOut;
	'computers.wake': MaritimeWakeOut;
	'deletedAgents.get': MaritimeDeletedAgentResponse;
	'deletedAgents.list': Array<MaritimeDeletedAgentResponse>;
	'deployments.cancel': MaritimeDeploymentResponse;
	'deployments.create': MaritimeDeploymentResponse;
	'deployments.get': MaritimeDeploymentResponse;
	'deployments.list': Array<MaritimeDeploymentListResponse>;
	'deployments.listForAgent': Array<MaritimeDeploymentResponse>;
	'deployments.uploadZip': MaritimeJsonValue;
	'domains.check': MaritimeDomainItem;
	'domains.create': MaritimeDomainItem;
	'domains.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'domains.get': MaritimeDomainItem;
	'domains.labels.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'domains.labels.list': MaritimeLabelList;
	'domains.labels.set': MaritimeLabelItem;
	'domains.list': MaritimeDomainList;
	'endUsers.activity': MaritimeEndUserActivity;
	'endUsers.agents.create': MaritimeAgentResponse;
	'endUsers.agents.list': Array<MaritimeAgentResponse>;
	'endUsers.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'endUsers.get': MaritimeEndUserDetail;
	'endUsers.list': MaritimeEndUserList;
	'endUsers.policy.delete': MaritimeEndUserPolicyResponse;
	'endUsers.policy.get': MaritimeEndUserPolicyResponse;
	'endUsers.policy.set': MaritimeEndUserPolicyResponse;
	'endUsers.resume': MaritimeEndUserResponse;
	'endUsers.summary': MaritimeEndUserSummary;
	'endUsers.suspend': MaritimeEndUserResponse;
	'endUsers.tokens.create': MaritimeEndUserTokenResponse;
	'endUsers.tokens.revoke': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'endUsers.upsert': MaritimeEndUserResponse;
	'feedback.create': MaritimeFeedbackResponse;
	'feedback.list': Array<MaritimeFeedbackResponse>;
	'fleet.activity': MaritimeJsonValue;
	'fleet.batchCreate': MaritimeJsonValue;
	'fleet.overview': Record<string, MaritimeJsonValue>;
	'fleet.propagate': MaritimeJsonValue;
	'fleet.summary': Record<string, MaritimeJsonValue>;
	'health.check': MaritimeJsonValue;
	'llmSpendLimit.deleteDefault': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'llmSpendLimit.getDefault': MaritimeAccountDefaultResponse;
	'llmSpendLimit.setDefault': MaritimeAccountDefaultResponse;
	'logs.list': Array<MaritimeLogEntryResponse>;
	'network.activity': MaritimeActivityList;
	'network.install.get': MaritimeInstallInfo;
	'network.install.unixScript': {
		/** The body as text. */
		text: string;
	};
	'network.install.windowsScript': {
		/** The body as text. */
		text: string;
	};
	'network.presets.create': MaritimePresetOut;
	'network.presets.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'network.presets.list': MaritimePresetList;
	'network.presets.update': MaritimePresetOut;
	'network.privateNetworks.addResource': MaritimeResourceOut;
	'network.privateNetworks.create': MaritimePrivateNetworkOut;
	'network.privateNetworks.createInstall': MaritimeInstallOut;
	'network.privateNetworks.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'network.privateNetworks.deleteResource': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'network.privateNetworks.list': MaritimePrivateNetworkList;
	'network.privateNetworks.update': MaritimePrivateNetworkOut;
	'network.settings.get': MaritimeAccountSettings;
	'network.settings.update': MaritimeAccountSettings;
	'network.workloads.get': MaritimeWorkloadNetwork;
	'network.workloads.newIp': MaritimeWorkloadNetwork;
	'network.workloads.test': MaritimeTestResult;
	'network.workloads.update': MaritimeWorkloadNetwork;
	'notifications.list': MaritimeJsonValue;
	'notifications.markRead': MaritimeJsonValue;
	'notifications.readAll': MaritimeJsonValue;
	'notifications.unreadCount': MaritimeJsonValue;
	'organizations.create': MaritimeOrganizationResponse;
	'organizations.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'organizations.invites.accept': MaritimeInviteAcceptedResponse;
	'organizations.invites.create': MaritimeInviteResponse;
	'organizations.invites.list': Array<MaritimeInviteResponse>;
	'organizations.invites.preview': MaritimeInvitePreviewResponse;
	'organizations.invites.resend': MaritimeInviteResponse;
	'organizations.invites.revoke': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'organizations.leave': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'organizations.me': MaritimeMeResponse;
	'organizations.members.changeRole': MaritimeMemberResponse;
	'organizations.members.list': Array<MaritimeMemberResponse>;
	'organizations.members.remove': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'organizations.rename': MaritimeOrganizationResponse;
	'plans.cancel': MaritimeJsonValue;
	'plans.launchPromo': MaritimeJsonValue;
	'plans.list': MaritimeJsonValue;
	'plans.portal': MaritimeJsonValue;
	'plans.subscribe': MaritimeJsonValue;
	'preferences.get': MaritimePreferences;
	'preferences.update': MaritimePreferences;
	'projects.bindings.list': MaritimeJsonValue;
	'projects.bindings.reassign': MaritimeJsonValue;
	'projects.bindings.unbind': MaritimeJsonValue;
	'projects.claimCodes.create': MaritimeJsonValue;
	'projects.claimCodes.list': MaritimeJsonValue;
	'projects.get': MaritimeProjectResponse;
	'projects.list': MaritimeJsonValue;
	'projects.messages.get': MaritimeMessageState;
	'projects.messages.send': MaritimeJsonValue;
	'projects.syncInstances': MaritimeJsonValue;
	'projects.telegram.connect': MaritimeProjectChannelResponse;
	'projects.telegram.disconnect': MaritimeJsonValue;
	'projects.update': MaritimeProjectResponse;
	'projects.usage': MaritimeJsonValue;
	'projects.users.get': MaritimeFrontDoorUser;
	'projects.users.list': Array<MaritimeFrontDoorUser>;
	'projects.users.unbind': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'sandboxKeys.create': MaritimeJsonValue;
	'sandboxKeys.list': MaritimeJsonValue;
	'sandboxKeys.revoke': MaritimeJsonValue;
	'sandboxWebhooks.create': MaritimeJsonValue;
	'sandboxWebhooks.delete': MaritimeJsonValue;
	'sandboxWebhooks.deliveries': MaritimeJsonValue;
	'sandboxWebhooks.list': MaritimeJsonValue;
	'sandboxes.code.run': {
		results?: Array<Record<string, MaritimeJsonValue>> | null;
		logs?: {
			stdout?: Array<string> | null;
			stderr?: Array<string> | null;
		} | null;
		error?: {
			name?: string | null;
			value?: string | null;
			traceback?: string | null;
		} | null;
		executionCount?: number | null;
	};
	'sandboxes.commands.get': {
		id?: string | null;
		sandboxId?: string | null;
		cmd?: (string | Array<string>) | null;
		cwd?: string | null;
		background?: boolean | null;
		/** 'running', 'exited' or 'killed'. */
		state?: string | null;
		exitCode?: number | null;
		signal?: string | null;
		startedAt?: string | null;
		endedAt?: string | null;
		/** The first 1 MiB of output. */
		stdout?: string | null;
		stderr?: string | null;
		truncated?: boolean | null;
	};
	'sandboxes.commands.history': MaritimeJsonValue;
	'sandboxes.commands.kill': {
		id?: string | null;
		sandboxId?: string | null;
		cmd?: (string | Array<string>) | null;
		cwd?: string | null;
		background?: boolean | null;
		/** 'running', 'exited' or 'killed'. */
		state?: string | null;
		exitCode?: number | null;
		signal?: string | null;
		startedAt?: string | null;
		endedAt?: string | null;
		/** The first 1 MiB of output. */
		stdout?: string | null;
		stderr?: string | null;
		truncated?: boolean | null;
	};
	'sandboxes.commands.run': {
		id?: string | null;
		sandboxId?: string | null;
		cmd?: (string | Array<string>) | null;
		cwd?: string | null;
		background?: boolean | null;
		/** 'running', 'exited' or 'killed'. */
		state?: string | null;
		exitCode?: number | null;
		signal?: string | null;
		startedAt?: string | null;
		endedAt?: string | null;
		/** The first 1 MiB of output. */
		stdout?: string | null;
		stderr?: string | null;
		truncated?: boolean | null;
	};
	'sandboxes.create': MaritimeJsonValue;
	'sandboxes.createScreenViewer': MaritimeJsonValue;
	'sandboxes.createUrl': MaritimeJsonValue;
	'sandboxes.ephemeral.create': MaritimeJsonValue;
	'sandboxes.ephemeral.extend': MaritimeJsonValue;
	'sandboxes.ephemeral.kill': MaritimeJsonValue;
	'sandboxes.ephemeral.list': MaritimeJsonValue;
	'sandboxes.files.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'sandboxes.files.list': {
		data?: Array<{
			path?: string | null;
			/** 'file', 'dir' or 'symlink'. */
			type?: string | null;
			sizeBytes?: number | null;
			modifiedAt?: string | null;
		}> | null;
	};
	'sandboxes.files.read': FileOutput;
	'sandboxes.files.write': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'sandboxes.get': MaritimeJsonValue;
	'sandboxes.info': MaritimeJsonValue;
	'sandboxes.kill': MaritimeJsonValue;
	'sandboxes.list': MaritimeJsonValue;
	'sandboxes.pause': MaritimeJsonValue;
	'sandboxes.promote': MaritimeJsonValue;
	'sandboxes.rotateSecret': MaritimeJsonValue;
	'sandboxes.save': MaritimeJsonValue;
	'sandboxes.update': MaritimeJsonValue;
	'sandboxes.usage': MaritimeJsonValue;
	'secrets.delete': MaritimeJsonValue;
	'secrets.list': MaritimeJsonValue;
	'secrets.set': MaritimeJsonValue;
	'servers.list': MaritimeJsonValue;
	'servers.release': MaritimeJsonValue;
	'servers.rent': MaritimeJsonValue;
	'snapshots.delete': MaritimeJsonValue;
	'snapshots.get': MaritimeJsonValue;
	'snapshots.list': MaritimeJsonValue;
	'stripe.createPortalSession': MaritimeCustomerPortalResponse;
	'stripe.invoices': Array<MaritimeInvoiceResponse>;
	'stripe.paymentMethods': Array<MaritimePaymentMethodResponse>;
	'stripe.subscriptions.cancel': MaritimeJsonValue;
	'stripe.subscriptions.list': Array<MaritimeSubscriptionResponse>;
	'swarms.cancel': MaritimeJsonValue;
	'swarms.create': MaritimeJsonValue;
	'swarms.get': MaritimeJsonValue;
	'swarms.getAccess': Record<string, MaritimeJsonValue>;
	'swarms.list': Record<string, MaritimeJsonValue>;
	'swarms.requestAccess': Record<string, MaritimeJsonValue>;
	'swarms.results': MaritimeJsonValue;
	'templates.create': MaritimeJsonValue;
	'templates.delete': MaritimeJsonValue;
	'templates.get': MaritimeJsonValue;
	'templates.list': MaritimeJsonValue;
	'usage.daily': MaritimeDailyUsageReport;
	'usage.report': MaritimeUsageReport;
	'usage.sandboxes': MaritimeJsonValue;
	'wallet.apiUsage': MaritimeJsonValue;
	'wallet.autoRecharge.get': MaritimeJsonValue;
	'wallet.autoRecharge.set': MaritimeJsonValue;
	'wallet.balance': MaritimeWalletBalanceResponse;
	'wallet.browserUsage': MaritimeJsonValue;
	'wallet.checkDeployBalance': MaritimeJsonValue;
	'wallet.claimSignupBonus': MaritimeJsonValue;
	'wallet.paymentMethod': MaritimeJsonValue;
	'wallet.planUsage': MaritimeJsonValue;
	'wallet.purchaseApiCredits': MaritimeJsonValue;
	'wallet.redeemPromo': MaritimeJsonValue;
	'wallet.topup': MaritimeJsonValue;
	'wallet.transactions': MaritimeJsonValue;
	'wallet.validatePromoCode': MaritimeJsonValue;
	'webhooks.create': MaritimeWebhookCreated;
	'webhooks.delete': {
		/** Maritime accepted the call; it answered with no body. */
		success: true;
	};
	'webhooks.deliveries.list': Array<MaritimeWebhookDeliveryResponse>;
	'webhooks.deliveries.replay': MaritimeWebhookDeliveryResponse;
	'webhooks.list': Array<MaritimeWebhookResponse>;
	'webhooks.test': MaritimeJsonValue;
	'webhooks.update': MaritimeWebhookResponse;
};
