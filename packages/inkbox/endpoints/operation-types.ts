// Generated from Inkbox's OpenAPI spec (https://inkbox.ai/api/openapi.json,
// fetched 2026-11-23); inkbox-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type InkboxJsonValue =
	| null
	| boolean
	| number
	| string
	| InkboxJsonValue[]
	| { [key: string]: InkboxJsonValue | undefined };

export const INKBOX_OPERATION_IDS = [
	'a2a.contactRules.create',
	'a2a.contactRules.delete',
	'a2a.contactRules.list',
	'a2a.contactRules.listForOrg',
	'a2a.contactRules.update',
	'a2a.contexts.get',
	'a2a.contexts.list',
	'a2a.contexts.update',
	'a2a.invitations.accept',
	'a2a.invitations.create',
	'a2a.invitations.decline',
	'a2a.invitations.get',
	'a2a.invitations.list',
	'a2a.invitations.preview',
	'a2a.invitations.revoke',
	'a2a.listDirectory',
	'a2a.messages.list',
	'a2a.previewCard',
	'a2a.sentContexts.get',
	'a2a.sentContexts.list',
	'a2a.sentTasks.get',
	'a2a.sentTasks.list',
	'a2a.settings.get',
	'a2a.settings.listForOrg',
	'a2a.settings.update',
	'a2a.tasks.get',
	'a2a.tasks.list',
	'a2a.tasks.reply',
	'account.whoami',
	'agentSignup.getStatus',
	'agentSignup.resendVerification',
	'agentSignup.verify',
	'apiKeys.create',
	'apiKeys.getCurrent',
	'apiKeys.revokeCurrent',
	'billing.callingCountries.buy',
	'billing.callingCountries.cancel',
	'billing.callingCountries.list',
	'billing.callingCountries.quote',
	'billing.callingCountries.resume',
	'billing.changePlan',
	'billing.createCheckoutSession',
	'billing.createPortalSession',
	'billing.getPricing',
	'billing.getSubscription',
	'billing.getUsage',
	'billing.identityPacks.buy',
	'billing.identityPacks.change',
	'billing.identityPacks.list',
	'billing.identityPacks.quote',
	'billing.lineBundles.buy',
	'billing.lineBundles.change',
	'billing.lineBundles.list',
	'billing.lineBundles.quote',
	'billing.setVoicePacks',
	'billing.settings.get',
	'billing.settings.update',
	'billing.usageAlerts.delete',
	'billing.usageAlerts.list',
	'billing.usageAlerts.save',
	'compliance.brand.delete',
	'compliance.brand.get',
	'compliance.brand.register',
	'compliance.brand.resendTwoFactorEmail',
	'compliance.brand.sendSmsOtp',
	'compliance.brand.update',
	'compliance.brand.verifySmsOtp',
	'compliance.campaign.delete',
	'compliance.campaign.get',
	'compliance.campaign.getActive',
	'compliance.campaign.register',
	'compliance.campaign.resubmit',
	'compliance.campaign.setActive',
	'compliance.campaign.update',
	'compliance.uploadOptInEvidence',
	'contacts.bulkDelete',
	'contacts.communicationPolicy.get',
	'contacts.communicationPolicy.preview',
	'contacts.communicationPolicy.set',
	'contacts.create',
	'contacts.createWithPermissions',
	'contacts.delete',
	'contacts.exportVcard',
	'contacts.exportVcards',
	'contacts.facts.create',
	'contacts.facts.delete',
	'contacts.facts.get',
	'contacts.facts.list',
	'contacts.facts.resolveCitation',
	'contacts.facts.update',
	'contacts.get',
	'contacts.getCorrespondence',
	'contacts.import',
	'contacts.list',
	'contacts.lookup',
	'contacts.merge',
	'contacts.previewImport',
	'contacts.update',
	'domains.create',
	'domains.delete',
	'domains.forceDelete',
	'domains.get',
	'domains.getDnsRecords',
	'domains.getHealth',
	'domains.list',
	'domains.restore',
	'domains.rotateDkim',
	'domains.setDefault',
	'domains.verify',
	'hostedChat.answerInteraction',
	'hostedChat.conversations.create',
	'hostedChat.conversations.get',
	'hostedChat.conversations.list',
	'hostedChat.conversations.listMessages',
	'hostedChat.conversations.rename',
	'hostedChat.files.download',
	'hostedChat.files.get',
	'hostedChat.files.upload',
	'hostedChat.getStatus',
	'hostedChat.turns.cancel',
	'hostedChat.turns.create',
	'hostedChat.turns.get',
	'hostedWorkspace.environment.get',
	'hostedWorkspace.environment.update',
	'hostedWorkspace.get',
	'hostedWorkspace.getOperation',
	'hostedWorkspace.getUsage',
	'hostedWorkspace.getUsageHistory',
	'hostedWorkspace.ports.get',
	'hostedWorkspace.ports.rotateToken',
	'hostedWorkspace.ports.update',
	'hostedWorkspace.resize',
	'hostedWorkspace.runAction',
	'hostedWorkspace.schedules.create',
	'hostedWorkspace.schedules.delete',
	'hostedWorkspace.schedules.list',
	'hostedWorkspace.schedules.listOccurrences',
	'hostedWorkspace.schedules.preview',
	'hostedWorkspace.schedules.update',
	'hostedWorkspace.terminals.close',
	'hostedWorkspace.terminals.create',
	'hostedWorkspace.terminals.createTicket',
	'hostedWorkspace.terminals.list',
	'hosting.callTool',
	'hosting.deliveries.list',
	'hosting.deliveries.retry',
	'hosting.get',
	'hosting.set',
	'identities.avatar.delete',
	'identities.avatar.get',
	'identities.avatar.getMetadata',
	'identities.avatar.setFromStagedMedia',
	'identities.avatar.upload',
	'identities.companion.get',
	'identities.companion.getHistory',
	'identities.companion.listConversations',
	'identities.companion.update',
	'identities.connectImessageNumber',
	'identities.contactAccess.get',
	'identities.contactAccess.update',
	'identities.contactPermissions.get',
	'identities.contactPermissions.list',
	'identities.contactPermissions.update',
	'identities.create',
	'identities.createTunnel',
	'identities.delete',
	'identities.disconnectImessageNumber',
	'identities.domainAffiliation.get',
	'identities.domainAffiliation.remove',
	'identities.domainAffiliation.set',
	'identities.get',
	'identities.getChannelStatus',
	'identities.getCurrent',
	'identities.list',
	'identities.listContactCommunicationPolicies',
	'identities.mailContactRules.create',
	'identities.mailContactRules.delete',
	'identities.mailContactRules.get',
	'identities.mailContactRules.list',
	'identities.mailContactRules.update',
	'identities.phoneContactRules.create',
	'identities.phoneContactRules.delete',
	'identities.phoneContactRules.get',
	'identities.phoneContactRules.list',
	'identities.phoneContactRules.update',
	'identities.releasePhoneNumber',
	'identities.signingKey.createOrRotate',
	'identities.signingKey.getStatus',
	'identities.slackContactRules.create',
	'identities.slackContactRules.delete',
	'identities.slackContactRules.get',
	'identities.slackContactRules.list',
	'identities.slackContactRules.update',
	'identities.update',
	'imessage.assignments.list',
	'imessage.assignments.release',
	'imessage.checkCapability',
	'imessage.connect',
	'imessage.contactRules.create',
	'imessage.contactRules.delete',
	'imessage.contactRules.get',
	'imessage.contactRules.list',
	'imessage.contactRules.listForOrg',
	'imessage.contactRules.update',
	'imessage.conversations.get',
	'imessage.conversations.getThread',
	'imessage.conversations.list',
	'imessage.disconnect',
	'imessage.getMediaPlayback',
	'imessage.getOnboarding',
	'imessage.getTriageNumber',
	'imessage.markRead',
	'imessage.messages.get',
	'imessage.messages.getThread',
	'imessage.messages.list',
	'imessage.messages.send',
	'imessage.numbers.claim',
	'imessage.numbers.list',
	'imessage.reactions.remove',
	'imessage.reactions.send',
	'imessage.router.get',
	'imessage.router.getAvatar',
	'imessage.router.getConversation',
	'imessage.router.listConversations',
	'imessage.router.listMessages',
	'imessage.router.update',
	'imessage.router.updateConnectOnboarding',
	'imessage.sendTyping',
	'imessage.uploadMedia',
	'inbound.checkSignature',
	'inbound.events.get',
	'inbound.events.list',
	'inbound.events.replay',
	'inbound.events.reportResult',
	'inbound.sources.create',
	'inbound.sources.delete',
	'inbound.sources.get',
	'inbound.sources.list',
	'inbound.sources.rotate',
	'inbound.sources.update',
	'mail.drafts.addAttachments',
	'mail.drafts.create',
	'mail.drafts.delete',
	'mail.drafts.duplicate',
	'mail.drafts.get',
	'mail.drafts.getAttachment',
	'mail.drafts.list',
	'mail.drafts.removeAttachment',
	'mail.drafts.send',
	'mail.drafts.update',
	'mail.imports.cancel',
	'mail.imports.create',
	'mail.imports.get',
	'mail.imports.list',
	'mail.imports.reissueUploadUrl',
	'mail.imports.start',
	'mail.listOrgContactRules',
	'mail.mailboxes.get',
	'mail.mailboxes.getById',
	'mail.mailboxes.list',
	'mail.mailboxes.update',
	'mail.messages.delete',
	'mail.messages.forward',
	'mail.messages.get',
	'mail.messages.getAttachment',
	'mail.messages.list',
	'mail.messages.replyAll',
	'mail.messages.search',
	'mail.messages.send',
	'mail.messages.updateFlags',
	'mail.threads.delete',
	'mail.threads.get',
	'mail.threads.list',
	'mail.threads.listFolders',
	'mail.threads.update',
	'mail.visibleMessages.delete',
	'mail.visibleMessages.get',
	'mail.visibleMessages.getAttachment',
	'mail.visibleMessages.list',
	'mail.visibleMessages.search',
	'mail.visibleMessages.updateFlags',
	'mail.visibleThreads.delete',
	'mail.visibleThreads.get',
	'mail.visibleThreads.list',
	'mail.visibleThreads.update',
	'messageSends.lookup',
	'notes.access.grant',
	'notes.access.list',
	'notes.access.revoke',
	'notes.create',
	'notes.delete',
	'notes.get',
	'notes.list',
	'notes.update',
	'organizationDomains.create',
	'organizationDomains.delete',
	'organizationDomains.get',
	'organizationDomains.list',
	'organizationDomains.verify',
	'phone.calls.get',
	'phone.calls.getSettings',
	'phone.calls.hangup',
	'phone.calls.list',
	'phone.calls.listMcpActivity',
	'phone.calls.listToolInvocations',
	'phone.calls.listTranscripts',
	'phone.calls.place',
	'phone.incomingCallAction.get',
	'phone.incomingCallAction.set',
	'phone.listOrgContactRules',
	'phone.media.getPlayback',
	'phone.numbers.get',
	'phone.numbers.list',
	'phone.numbers.provision',
	'phone.numbers.release',
	'phone.numbers.searchTranscripts',
	'phone.numbers.update',
	'phone.smsOptIns.get',
	'phone.smsOptIns.list',
	'phone.smsOptIns.optIn',
	'phone.smsOptIns.optOut',
	'phone.textConversations.get',
	'phone.textConversations.list',
	'phone.textConversations.update',
	'phone.textConversations.updateById',
	'phone.texts.delete',
	'phone.texts.get',
	'phone.texts.list',
	'phone.texts.search',
	'phone.texts.send',
	'phone.texts.update',
	'slack.actions.get',
	'slack.actions.getByKey',
	'slack.applications.getRemoval',
	'slack.applications.prepare',
	'slack.applications.remove',
	'slack.archive.backfill',
	'slack.archive.getCoverage',
	'slack.archive.getSettings',
	'slack.archive.listMessages',
	'slack.archive.purge',
	'slack.archive.search',
	'slack.archive.updateSettings',
	'slack.connections.disconnect',
	'slack.connections.getCapabilities',
	'slack.connections.importContacts',
	'slack.connections.list',
	'slack.connections.listAvailable',
	'slack.conversations.get',
	'slack.conversations.join',
	'slack.conversations.leave',
	'slack.conversations.list',
	'slack.conversations.listMembers',
	'slack.conversations.open',
	'slack.conversations.setProcessingStatus',
	'slack.files.download',
	'slack.files.get',
	'slack.files.getPreview',
	'slack.files.upload',
	'slack.getCachedMedia',
	'slack.installations.start',
	'slack.listEmoji',
	'slack.listOrgContactRules',
	'slack.messages.delete',
	'slack.messages.get',
	'slack.messages.getContext',
	'slack.messages.getPermalink',
	'slack.messages.list',
	'slack.messages.send',
	'slack.messages.update',
	'slack.operations.get',
	'slack.operations.getByKey',
	'slack.pins.add',
	'slack.pins.list',
	'slack.pins.remove',
	'slack.provisioningWorkspaces.list',
	'slack.provisioningWorkspaces.save',
	'slack.reactions.add',
	'slack.reactions.list',
	'slack.reactions.remove',
	'slack.search',
	'slack.streams.append',
	'slack.streams.start',
	'slack.streams.stop',
	'slack.users.get',
	'slack.users.list',
	'tunnels.get',
	'tunnels.list',
	'tunnels.signCsr',
	'tunnels.update',
	'vault.getInfo',
	'vault.getUnlockBundle',
	'vault.initialize',
	'vault.keys.list',
	'vault.keys.updatePrimary',
	'vault.secrets.create',
	'vault.secrets.get',
	'vault.secrets.grantAccess',
	'vault.secrets.list',
	'vault.secrets.listAccess',
	'vault.secrets.revokeAccess',
	'vault.secrets.update',
	'voiceAgent.getConfig',
	'voiceAgent.listVoices',
	'voiceAgent.mcpServers.cancelAuthorization',
	'voiceAgent.mcpServers.create',
	'voiceAgent.mcpServers.delete',
	'voiceAgent.mcpServers.disconnect',
	'voiceAgent.mcpServers.get',
	'voiceAgent.mcpServers.getAuthorization',
	'voiceAgent.mcpServers.getCatalog',
	'voiceAgent.mcpServers.list',
	'voiceAgent.mcpServers.refresh',
	'voiceAgent.mcpServers.startAuthorization',
	'voiceAgent.mcpServers.test',
	'voiceAgent.mcpServers.update',
	'voiceAgent.setAuthorityMode',
	'voiceAgent.setConfig',
	'webhooks.deliveries.list',
	'webhooks.deliveries.replay',
	'webhooks.getCatalog',
	'webhooks.subscriptions.create',
	'webhooks.subscriptions.delete',
	'webhooks.subscriptions.get',
	'webhooks.subscriptions.list',
	'webhooks.subscriptions.update',
	'whatsapp.assignments.list',
	'whatsapp.assignments.release',
	'whatsapp.connect',
	'whatsapp.conversations.get',
	'whatsapp.conversations.getThread',
	'whatsapp.conversations.list',
	'whatsapp.disconnect',
	'whatsapp.getLimits',
	'whatsapp.getOnboarding',
	'whatsapp.getTriageNumber',
	'whatsapp.markRead',
	'whatsapp.media.get',
	'whatsapp.media.getPlayback',
	'whatsapp.media.upload',
	'whatsapp.messages.get',
	'whatsapp.messages.getThread',
	'whatsapp.messages.list',
	'whatsapp.messages.send',
	'whatsapp.numbers.assign',
	'whatsapp.numbers.list',
	'whatsapp.reactions.delete',
	'whatsapp.reactions.get',
	'whatsapp.reactions.send',
	'whatsapp.router.get',
	'whatsapp.router.listConversations',
	'whatsapp.router.listMessages',
	'whatsapp.router.update',
	'whatsapp.sendTyping',
] as const;

export type InkboxOperationId = (typeof INKBOX_OPERATION_IDS)[number];

export type InkboxA2ADataPartInput = {
	data: InkboxJsonValue;
	metadata?: Record<string, InkboxJsonValue> | null;
};

export type InkboxA2AHistoryDirectionInput = 'inbound' | 'outbound' | 'both';

export type InkboxA2AMessageRoleInput = 'caller' | 'agent';

export type InkboxA2AReplyIntentInput =
	| 'progress'
	| 'ask_caller'
	| 'complete'
	| 'fail';

export type InkboxA2ARuleActionInput = 'allow' | 'block';

export type InkboxA2ARuleDirectionInput = 'inbound' | 'outbound' | 'both';

export type InkboxA2ASkillInput = {
	id: string;
	name: string;
	description: string;
	tags: Array<string>;
	examples?: Array<string>;
	inputModes?: Array<string>;
	outputModes?: Array<string>;
};

export type InkboxA2ATaskStateInput =
	| 'submitted'
	| 'working'
	| 'input_required'
	| 'completed'
	| 'failed'
	| 'canceled';

export type InkboxA2ATextPartInput = {
	text: string;
	metadata?: Record<string, InkboxJsonValue> | null;
};

export type InkboxA2AWebhookEventTypeInput =
	| 'a2a.task.created'
	| 'a2a.task.message'
	| 'a2a.task.canceled'
	| 'a2a.sent_task.updated';

export type InkboxAgentHandlerInput = {
	type?: 'agent';
	instructions?: string | null;
};

export type InkboxAgentIdentityMailboxCreateRequestInput = {
	/** Optional mailbox email local part to use before the sending domain. On the platform domain it must equal agent_handle (the server forces it). Omit on the platform domain to use agent_handle automatically; supply for a custom domain to pick a specific local part. */
	email_local_part?: string | null;
	/** Optional sending-domain name (e.g. 'assistant.alexwilcox.io'). Omit to inherit the org's default (custom domain if verified, else inkboxmail.com); pass null to force the platform default; pass a verified custom-domain string to bind this mailbox to it. */
	sending_domain?: string | null;
};

export type InkboxAgentIdentityPhoneNumberCreateRequestInput = {
	/** Type of phone number to provision. Only 'local' is supported; toll-free is no longer offered. */
	type?: InkboxNumberTypeInput;
	/** Optional US state abbreviation filter. Only used for local numbers. */
	state?: string | null;
	/** How to handle inbound calls: hosted_agent (the platform voice agent answers, zero setup — the default wherever the hosted agent is available, so the number is callable right away), auto_accept, auto_reject, webhook, or forward with one phone or SIP destination. */
	incoming_call_action?: InkboxIncomingCallActionInput;
	/** WebSocket URL (wss://) for audio bridging. Required when incoming_call_action is 'auto_accept'. */
	client_websocket_url?: string | null;
	/** Webhook URL (https://) for incoming call notifications. Required when incoming_call_action is 'webhook'. */
	incoming_call_webhook_url?: string | null;
	forwarding_target_type?: InkboxForwardingTargetTypeInput | null;
	forwarding_phone_number?: string | null;
	forwarding_sip_uri?: string | null;
};

export type InkboxAgentIdentityTunnelCreateRequestInput = {
	/** Where TLS terminates. Defaults to edge. */
	tls_mode?: InkboxTLSModeInput;
};

export type InkboxAgentPortSettingInput = {
	port: number;
	/** Reachable by anyone, without a port token. */
	public?: boolean;
};

export type InkboxApprovalAnswerInput = {
	kind: 'approval';
	decision: 'approve_once' | 'deny';
};

export type InkboxAttachmentUploadInput = {
	filename: string;
	/** MIME type, e.g. image/jpeg */
	content_type: string;
	/** Base64-encoded file content */
	content_base64: string;
	/** Mark this part as an inline image referenced from body_html as cid:<content_id> (e.g. <img src="cid:chart1">). Surrounding angle brackets are optional. Omit for a normal attachment. */
	content_id?: string | null;
};

export type InkboxBillingIntervalInput = 'month' | 'year';

export type InkboxBrandAltBusinessIdTypeInput = 'DUNS' | 'GIIN' | 'LEI';

export type InkboxBrandCountryInput = 'US' | 'CA';

export type InkboxBrandEntityTypeInput =
	| 'PRIVATE_PROFIT'
	| 'PUBLIC_PROFIT'
	| 'NON_PROFIT'
	| 'GOVERNMENT'
	| 'SOLE_PROPRIETOR';

export type InkboxBrandStockExchangeInput =
	| 'NYSE'
	| 'NASDAQ'
	| 'AMEX'
	| 'AMX'
	| 'ASX'
	| 'B3'
	| 'BME'
	| 'BSE'
	| 'FRA'
	| 'ICEX'
	| 'JPX'
	| 'JSE'
	| 'KRX'
	| 'LON'
	| 'NSE'
	| 'OMX'
	| 'SEHK'
	| 'SSE'
	| 'STO'
	| 'SWX'
	| 'SZSE'
	| 'TSX'
	| 'TWSE'
	| 'VSE';

export type InkboxBrandVerticalInput =
	| 'PROFESSIONAL'
	| 'REAL_ESTATE'
	| 'HEALTHCARE'
	| 'HUMAN_RESOURCES'
	| 'ENERGY'
	| 'ENTERTAINMENT'
	| 'RETAIL'
	| 'TRANSPORTATION'
	| 'AGRICULTURE'
	| 'INSURANCE'
	| 'POSTAL'
	| 'EDUCATION'
	| 'HOSPITALITY'
	| 'FINANCIAL'
	| 'POLITICAL'
	| 'GAMBLING'
	| 'LEGAL'
	| 'CONSTRUCTION'
	| 'NGO'
	| 'MANUFACTURING'
	| 'GOVERNMENT'
	| 'TECHNOLOGY'
	| 'COMMUNICATION';

export type InkboxCallModeInput = 'client_websocket' | 'hosted_agent';

export type InkboxCallOriginInput =
	| 'dedicated_number'
	| 'shared_imessage_number'
	| 'dedicated_imessage_number';

export type InkboxCampaignUseCaseInput =
	| 'ACCOUNT_NOTIFICATION'
	| 'AGENTS_FRANCHISES'
	| 'CARRIER_EXEMPT'
	| 'CHARITY'
	| 'CUSTOMER_CARE'
	| 'DELIVERY_NOTIFICATION'
	| 'EMERGENCY'
	| 'FRAUD_ALERT'
	| 'HIGHER_EDUCATION'
	| 'K12_EDUCATION'
	| 'LOW_VOLUME'
	| 'MARKETING'
	| 'MIXED'
	| 'POLITICAL'
	| 'POLLING_VOTING'
	| 'PROXY'
	| 'PUBLIC_SAFETY_RESTRICTED'
	| 'PUBLIC_SERVICE_ANNOUNCEMENT'
	| 'SECURITY_ALERT'
	| 'SOCIAL'
	| 'SWEEPSTAKE'
	| '2FA'
	| 'UCAAS_LOW'
	| 'M2M'
	| 'SOLE_PROPRIETOR'
	| 'TRIAL'
	| 'UCAAS_HIGH';

export type InkboxContactAddressItemInput = {
	street?: string | null;
	city?: string | null;
	region?: string | null;
	postal?: string | null;
	country?: string | null;
	label?: string | null;
};

export type InkboxContactAddressUpdateInput = {
	kind: 'email' | 'phone';
	value: string;
	action: 'inherit' | 'allow' | 'block';
	direction?: InkboxRuleDirectionInput;
	expected_action?: 'inherit' | 'allow' | 'block' | null;
	expected_inbound_action?: 'inherit' | 'allow' | 'block' | null;
	expected_outbound_action?: 'inherit' | 'allow' | 'block' | null;
};

export type InkboxContactChannelAccessUpdateInput = {
	visible?: boolean;
	contactable?: Array<string>;
	inbound_contactable?: Array<string>;
	outbound_contactable?: Array<string>;
};

export type InkboxContactCreatePermissionsInput = {
	identity_id: string;
	addresses?: Array<InkboxContactInitialAddressPermissionInput>;
	profile?: 'inherit' | 'allow' | 'block' | null;
	memories?: 'inherit' | 'allow' | 'block' | null;
};

export type InkboxContactCustomFieldItemInput = {
	label: string;
	value: string;
};

export type InkboxContactDateItemInput = {
	date: string;
	label: string;
};

export type InkboxContactEmailItemInput = {
	value: string;
	label?: string | null;
	is_primary?: boolean;
};

export type InkboxContactIdentityVisibilityDecisionsInput = {
	profile: 'inherit' | 'allow' | 'block';
	memories: 'inherit' | 'allow' | 'block';
	identity_id: string;
};

export type InkboxContactInitialAccessInput = {
	email?: InkboxContactChannelAccessUpdateInput;
	phone?: InkboxContactChannelAccessUpdateInput;
	profile?: boolean;
	memories?: boolean;
	identity_id: string;
};

export type InkboxContactInitialAddressPermissionInput = {
	kind: 'email' | 'phone';
	value: string;
	action: 'inherit' | 'allow' | 'block';
	direction?: InkboxRuleDirectionInput;
	expected_inbound_action?: 'inherit' | 'allow' | 'block' | null;
	expected_outbound_action?: 'inherit' | 'allow' | 'block' | null;
};

export type InkboxContactInitialPermissionsInput = {
	emails?: Record<string, boolean>;
	phones?: Record<string, boolean>;
	inbound_emails?: Record<string, boolean>;
	outbound_emails?: Record<string, boolean>;
	inbound_phones?: Record<string, boolean>;
	outbound_phones?: Record<string, boolean>;
	profile?: boolean;
	memories?: boolean;
	identity_id: string;
};

export type InkboxContactPhoneItemRequestInput = {
	/** Phone number in E.164 format (e.g. '+15551234567'). */
	value_e164: string;
	label?: string | null;
	is_primary?: boolean;
};

export type InkboxContactReviewStatusInput = 'unreviewed' | 'confirmed';

export type InkboxContactVisibilityDecisionsInput = {
	profile: 'inherit' | 'allow' | 'block';
	memories: 'inherit' | 'allow' | 'block';
};

export type InkboxContactVisibilityPolicyInput = {
	defaults: InkboxContactVisibilityDecisionsInput;
	identities: Array<InkboxContactIdentityVisibilityDecisionsInput>;
};

export type InkboxContactWebsiteItemInput = {
	url: string;
	label?: string | null;
};

export type InkboxCorrespondenceContentModeInput =
	| 'metadata'
	| 'preview'
	| 'full';

export type InkboxCorrespondenceOrderInput = 'asc' | 'desc';

export type InkboxCorrespondenceTranscriptModeInput =
	| 'none'
	| 'abridged'
	| 'full';

export type InkboxDraftRecipientsInput = {
	to?: Array<string> | null;
	cc?: Array<string> | null;
	bcc?: Array<string> | null;
};

export type InkboxEnvironmentVariableInput = {
	value: string;
	secret?: boolean;
};

export type InkboxFileReferenceInput = {
	type?: 'file';
	file_id: string;
};

export type InkboxFilterModeInput = 'whitelist' | 'blacklist';

export type InkboxForwardModeInput = 'inline' | 'wrapped';

export type InkboxForwardingTargetTypeInput = 'phone' | 'sip';

export type InkboxHostedAgentAuthorityModeInput = 'contact_scoped' | 'yolo';

export type InkboxIMessageRuleActionInput = 'allow' | 'block';

export type InkboxIMessageRuleMatchTypeInput = 'exact_number';

export type InkboxIMessageSendStyleInput =
	| 'celebration'
	| 'shooting_star'
	| 'fireworks'
	| 'lasers'
	| 'love'
	| 'confetti'
	| 'balloons'
	| 'spotlight'
	| 'echo'
	| 'invisible'
	| 'gentle'
	| 'loud'
	| 'slam';

export type InkboxIMessageSendableReactionTypeInput =
	| 'love'
	| 'like'
	| 'dislike'
	| 'laugh'
	| 'emphasize'
	| 'question'
	| 'eyes';

export type InkboxIMessageWebhookEventTypeInput =
	| 'imessage.received'
	| 'imessage.reaction_received'
	| 'imessage.sent'
	| 'imessage.delivered'
	| 'imessage.delivery_failed';

export type InkboxInboundSignatureInput = {
	/** ``base64`` decodes the secret first, ignoring a leading ``whsec_``. */
	secret_encoding?: 'text' | 'base64';
	/** Header holding the signature. */
	header: string;
	/** ``whole``: the header value is the signature. ``prefix``: the value after ``format_value``. ``list``: every item under key ``format_value`` in a list like ``t=1,v1=ab`` or ``v1,ab v1,cd``. */
	format?: 'whole' | 'prefix' | 'list';
	format_value?: string | null;
	algorithm?: 'sha256' | 'sha1' | 'sha512';
	encoding?: 'hex' | 'base64';
	signed_content?: string;
	/** ``header``: the header named ``timestamp_value``. ``list``: key ``timestamp_value`` in the signature header list. */
	timestamp_from?: 'none' | 'header' | 'list';
	timestamp_value?: string | null;
	max_age_seconds?: number | null;
	/** Signing secret copied from the sender. */
	secret: string;
};

export type InkboxIncomingCallActionInput =
	| 'auto_accept'
	| 'auto_reject'
	| 'webhook'
	| 'hosted_agent'
	| 'forward';

export type InkboxJsonValueInput = InkboxJsonValue;

export type InkboxMailImportFormatInput = 'mbox' | 'eml' | 'zip' | 'auto';

export type InkboxMailRuleActionInput = 'allow' | 'block';

export type InkboxMailRuleMatchTypeInput = 'exact_email' | 'domain';

export type InkboxMailWebhookEventTypeInput =
	| 'message.received'
	| 'message.sent'
	| 'message.forwarded'
	| 'message.delivered'
	| 'message.bounced'
	| 'message.failed';

export type InkboxMcpBearerAuthInput = {
	type: 'bearer';
	token: string;
};

export type InkboxMcpContextSelectionsInput = {
	mode?: 'selected' | 'all';
	prompts?: Array<InkboxMcpPromptSelectionInput>;
	resources?: Array<string>;
	skills?: Array<InkboxMcpSkillSelectionInput>;
};

export type InkboxMcpHeaderAuthInput = {
	type: 'header';
	token: string;
	header_name: string;
	value_prefix?: string;
};

export type InkboxMcpNoAuthInput = {
	type?: 'none';
};

export type InkboxMcpOAuthAuthInput = {
	type: 'oauth';
	issuer?: string | null;
	scopes?: Array<string>;
	client_id?: string | null;
	client_secret?: string | null;
	token_endpoint_auth_method?:
		| 'none'
		| 'client_secret_basic'
		| 'client_secret_post';
	profile?: 'standard' | 'offline_consent';
};

export type InkboxMcpPromptSelectionInput = {
	name: string;
	arguments?: Record<string, string>;
};

export type InkboxMcpSkillSelectionInput = {
	uri: string;
	manifest_digest: string;
};

export type InkboxMessageDirectionInput = 'inbound' | 'outbound';

export type InkboxMessageTranscriptionEventTypeInput =
	'message.transcription_finished';

export type InkboxNumberTypeInput = 'local' | 'toll_free';

export type InkboxOnVoicemailInput = 'hang_up' | 'leave_message' | 'ignore';

export type InkboxPhoneCallLifecycleWebhookEventTypeInput = 'call.ended';

export type InkboxPhoneRuleActionInput = 'allow' | 'block';

export type InkboxPhoneRuleMatchTypeInput = 'exact_number';

export type InkboxPhoneTextWebhookEventTypeInput =
	| 'text.received'
	| 'text.sent'
	| 'text.delivered'
	| 'text.delivery_failed'
	| 'text.delivery_unconfirmed';

export type InkboxPlanInput =
	| 'free'
	| 'hobbyist'
	| 'developer'
	| 'startup'
	| 'enterprise';

export type InkboxQuestionAnswerInput = {
	kind: 'question';
	answers: Record<string, string | Array<string>>;
};

export type InkboxRecipientsInput = {
	to?: Array<string> | null;
	cc?: Array<string> | null;
	bcc?: Array<string> | null;
};

export type InkboxRuleDirectionInput = 'inbound' | 'outbound' | 'both';

export type InkboxScheduleFieldsInput = {
	name?: string | null;
	task?: InkboxScheduleTaskInput | null;
	timing?: InkboxScheduleTimingInput | null;
	enabled?: boolean | null;
	catch_up?: boolean | null;
	reauthorize?: boolean | null;
};

export type InkboxScheduleTaskInput = {
	kind: 'prompt' | 'script';
	prompt?: string | null;
	script?: string | null;
};

export type InkboxScheduleTimingInput = {
	kind: 'once' | 'interval' | 'cron';
	timezone?: string | null;
	at?: string | null;
	seconds?: number | null;
	expression?: string | null;
};

export type InkboxScriptHandlerInput = {
	type: 'script';
	command: string;
};

export type InkboxSendingDomainStatusInput =
	| 'not_started'
	| 'awaiting_ownership'
	| 'pending'
	| 'dns_invalid'
	| 'verifying'
	| 'verified'
	| 'failed'
	| 'pending_dkim_rotation'
	| 'degraded'
	| 'pending_deletion';

export type InkboxSlackPlanUpdateInput = {
	type: 'plan_update';
	title: string;
};

export type InkboxSlackRuleActionInput = 'allow' | 'block';

export type InkboxSlackRuleMatchTypeInput = 'exact_user' | 'workspace';

export type InkboxSlackTaskUpdateInput = {
	type: 'task_update';
	id: string;
	title: string;
	status: 'in_progress' | 'complete' | 'error';
	details?: string | null;
	output?: string | null;
};

export type InkboxSlackWebhookEventTypeInput =
	| 'slack.dm_received'
	| 'slack.group_dm_received'
	| 'slack.channel_message_received'
	| 'slack.mention_received'
	| 'slack.thread_reply_received'
	| 'slack.message_updated'
	| 'slack.message_deleted'
	| 'slack.reaction_added'
	| 'slack.reaction_removed'
	| 'slack.member_joined'
	| 'slack.member_left'
	| 'slack.channel_updated'
	| 'slack.file_shared'
	| 'slack.file_changed'
	| 'slack.file_deleted'
	| 'slack.pin_added'
	| 'slack.pin_removed'
	| 'slack.connection_changed'
	| 'slack.message_sent'
	| 'slack.message_send_failed'
	| 'slack.message_send_unknown'
	| 'slack.interaction'
	| 'slack.session_stopped';

export type InkboxSmsOptInStatusInput = 'opted_in' | 'opted_out';

export type InkboxStagedAttachmentReferenceInput = {
	media_handle: string;
	filename: string;
	content_hash: string;
	content_type: string;
	/** Mark this part as an inline image referenced from body_html as cid:<content_id> (e.g. <img src="cid:chart1">). Requires an image/* content_type. Omit for a normal attachment. */
	content_id?: string | null;
};

export type InkboxStagedIMessageMediaBindingInput = {
	handle: string;
	content_hash: string;
};

export type InkboxStagedTextMediaBindingInput = {
	handle: string;
	content_hash: string;
};

export type InkboxStagedWhatsAppMediaBindingInput = {
	handle: string;
	content_hash: string;
};

export type InkboxTLSModeInput = 'edge' | 'passthrough';

export type InkboxTerminalSizeInput = {
	rows?: number;
	cols?: number;
};

export type InkboxTextContentInput = {
	type?: 'text';
	text: string;
};

export type InkboxThreadFolderInput = 'inbox' | 'spam' | 'blocked' | 'archive';

export type InkboxVaultKeyCreateInput = {
	id: string;
	/** AES-256-GCM ciphertext wrapping the org encryption key (base64) */
	wrapped_org_encryption_key: string;
	/** SHA-256(masterKey) hex digest, required for server-side row lookup */
	auth_hash: string;
	key_type?: InkboxVaultKeyTypeInput;
};

export type InkboxVaultKeyTypeInput = 'primary' | 'recovery';

export type InkboxVaultSecretTypeInput =
	| 'api_key'
	| 'key_pair'
	| 'login'
	| 'ssh_key'
	| 'other';

export type InkboxVoicePackInput = 'minutes_250' | 'minutes_2000';

export type InkboxVoicemailDetectionInput = 'enabled' | 'disabled';

export type InkboxWebhookContextConfigInput = {
	email?:
		| (
				| InkboxWebhookContextCountConfigInput
				| InkboxWebhookContextWindowConfigInput
		  )
		| null;
	texts?:
		| (
				| InkboxWebhookContextCountConfigInput
				| InkboxWebhookContextWindowConfigInput
		  )
		| null;
	calls?:
		| (
				| InkboxWebhookContextCountConfigInput
				| InkboxWebhookContextWindowConfigInput
		  )
		| null;
};

export type InkboxWebhookContextCountConfigInput = {
	mode: 'count';
	count: number;
};

export type InkboxWebhookContextWindowConfigInput = {
	mode: 'window';
	hours: number;
};

export type InkboxWhatsAppWebhookEventTypeInput =
	| 'whatsapp.reaction_received'
	| 'whatsapp.received'
	| 'whatsapp.sent'
	| 'whatsapp.delivered'
	| 'whatsapp.delivery_failed'
	| 'whatsapp.delivery_unconfirmed';

export type InkboxA2ACallerResponse = {
	identity_id?: string | null;
	organization_id?: string | null;
	handle?: string | null;
	trust_tier?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
};

export type InkboxA2AContactRuleResponse = {
	id?: string | null;
	action?: InkboxA2ARuleAction | null;
	match_type?: InkboxA2ARuleMatchType | null;
	match_target?: string | null;
	direction?: InkboxA2ARuleDirection | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxA2AContextPage = {
	items?: Array<InkboxA2AContextResponse> | null;
	next_cursor?: string | null;
};

export type InkboxA2AContextResponse = {
	id?: string | null;
	name?: string | null;
	caller?: InkboxA2ACallerResponse | null;
	target?: InkboxA2ATargetResponse | null;
	tasks?: Array<InkboxA2ATaskResponse> | null;
	tasks_truncated?: boolean | null;
	created_at?: string | null;
	last_activity_at?: string | null;
};

export type InkboxA2ADirectoryItem = {
	card_url?: string | null;
	card?: Record<string, InkboxJsonValue> | null;
	visibility?: InkboxA2ADirectoryVisibility | null;
};

export type InkboxA2ADirectoryPage = {
	items?: Array<InkboxA2ADirectoryItem> | null;
	next_cursor?: string | null;
};

export type InkboxA2ADirectoryVisibility = string;

export type InkboxA2AHistoryMessagePage = {
	items?: Array<InkboxA2AHistoryMessageResponse> | null;
	next_cursor?: string | null;
};

export type InkboxA2AHistoryMessageResponse = {
	id?: string | null;
	message_id?: string | null;
	role?: InkboxA2AMessageRole | null;
	parts?: Array<Record<string, InkboxJsonValue>> | null;
	metadata?: Record<string, InkboxJsonValue> | null;
	extensions?: Array<string> | null;
	reference_task_ids?: Array<string> | null;
	created_at?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
	task_id?: string | null;
	context_id?: string | null;
	task_state?: InkboxA2ATaskState | null;
	caller?: InkboxA2ACallerResponse | null;
	target?: InkboxA2ATargetResponse | null;
};

export type InkboxA2AIdentityContactRuleResponse = {
	id?: string | null;
	action?: InkboxA2ARuleAction | null;
	match_type?: InkboxA2ARuleMatchType | null;
	match_target?: string | null;
	direction?: InkboxA2ARuleDirection | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	agent_identity_id?: string | null;
};

export type InkboxA2AInvitationAcceptResponse = {
	invitation_id?: string | null;
	invitee_identity_id?: string | null;
	invitee_agent_handle?: string | null;
	peer_agent_handles?: Array<string> | null;
	accepted_at?: string | null;
	status?: string | null;
};

export type InkboxA2AInvitationDeclineResponse = {
	status?: string | null;
};

export type InkboxA2AInvitationEmailStatus = string;

export type InkboxA2AInvitationPage = {
	items?: Array<InkboxA2AInvitationResponse> | null;
	next_cursor?: string | null;
};

export type InkboxA2AInvitationPreviewResponse = {
	inviter_email?: string | null;
	peer_agent_handles?: Array<string> | null;
	expires_at?: string | null;
	agent_handoff_prompt?: string | null;
};

export type InkboxA2AInvitationResponse = {
	id?: string | null;
	issuer_organization_id?: string | null;
	inviter_email?: string | null;
	peer_agent_handles?: Array<string> | null;
	recipient_email?: string | null;
	status?: (InkboxA2AInvitationStatus | string) | null;
	invitee_identity_id?: string | null;
	invitee_agent_handle?: string | null;
	invitee_organization_id?: string | null;
	email_status?: InkboxA2AInvitationEmailStatus | null;
	email_sent_at?: string | null;
	expires_at?: string | null;
	accepted_at?: string | null;
	declined_at?: string | null;
	revoked_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxA2AInvitationSignupSummary = {
	invitation_id?: string | null;
	status?: InkboxA2AInvitationStatus | null;
	invitee_identity_id?: string | null;
	invitee_agent_handle?: string | null;
	peer_agent_handles?: Array<string> | null;
	accepted_at?: string | null;
};

export type InkboxA2AInvitationStatus = string;

export type InkboxA2AInvitationUnboundCreateResponse = {
	id?: string | null;
	issuer_organization_id?: string | null;
	inviter_email?: string | null;
	peer_agent_handles?: Array<string> | null;
	recipient_email?: string | null;
	status?: (InkboxA2AInvitationStatus | string) | null;
	invitee_identity_id?: string | null;
	invitee_agent_handle?: string | null;
	invitee_organization_id?: string | null;
	email_status?: InkboxA2AInvitationEmailStatus | null;
	email_sent_at?: string | null;
	expires_at?: string | null;
	accepted_at?: string | null;
	declined_at?: string | null;
	revoked_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	invitation_token?: string | null;
	invitation_url?: string | null;
	agent_handoff_prompt?: string | null;
};

export type InkboxA2AMessageResponse = {
	id?: string | null;
	message_id?: string | null;
	role?: InkboxA2AMessageRole | null;
	parts?: Array<Record<string, InkboxJsonValue>> | null;
	metadata?: Record<string, InkboxJsonValue> | null;
	extensions?: Array<string> | null;
	reference_task_ids?: Array<string> | null;
	created_at?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
};

export type InkboxA2AMessageRole = string;

export type InkboxA2ARuleAction = string;

export type InkboxA2ARuleDirection = string;

export type InkboxA2ARuleMatchType = string;

export type InkboxA2ASettingsIdentityResponse = {
	id?: string | null;
	agent_handle?: string | null;
};

export type InkboxA2ASettingsListItem = {
	identity?: InkboxA2ASettingsIdentityResponse | null;
	settings?: InkboxA2ASettingsResponse | null;
};

export type InkboxA2ASettingsListResponse = {
	items?: Array<InkboxA2ASettingsListItem> | null;
};

export type InkboxA2ASettingsResponse = {
	enabled?: boolean | null;
	publicly_discoverable?: boolean | null;
	allow_public_egress?: boolean | null;
	filter_mode?: InkboxFilterMode | null;
	skills?: Array<InkboxA2ASkill> | null;
	card_url?: string | null;
	inbound_task_count?: number | null;
	outbound_task_count?: number | null;
	updated_at?: string | null;
};

export type InkboxA2ASkill = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	tags?: Array<string> | null;
	examples?: Array<string> | null;
	inputModes?: Array<string> | null;
	outputModes?: Array<string> | null;
};

export type InkboxA2ATargetResponse = {
	identity_id?: string | null;
	organization_id?: string | null;
	handle?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
};

export type InkboxA2ATaskPage = {
	items?: Array<InkboxA2ATaskResponse> | null;
	next_cursor?: string | null;
};

export type InkboxA2ATaskResponse = {
	id?: string | null;
	context_id?: string | null;
	state?: InkboxA2ATaskState | null;
	caller?: InkboxA2ACallerResponse | null;
	target?: InkboxA2ATargetResponse | null;
	messages?: Array<InkboxA2AMessageResponse> | null;
	history_truncated?: boolean | null;
	completed_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxA2ATaskState = string;

export type InkboxA2AWebhookCaller = {
	identity_id?: string | null;
	organization_id?: string | null;
	handle?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
};

export type InkboxA2AWebhookData = {
	task_id?: string | null;
	context_id?: string | null;
	state?: InkboxA2ATaskState | null;
	caller?: InkboxA2AWebhookCaller | null;
	sender?: InkboxA2AWebhookCaller | null;
	message_id?: string | null;
	parts?: Array<Record<string, InkboxJsonValue>> | null;
};

export type InkboxA2AWebhookEventType = string;

export type InkboxA2AWebhookPayload = {
	/** Stable per-event id (evt_...); idempotency key across retries. */
	id?: string | null;
	event_type?: InkboxA2AWebhookEventType | null;
	timestamp?: string | null;
	data?: InkboxA2AWebhookData | null;
};

export type InkboxAgent = {
	last_delivery_failure?: InkboxDeliveryFailure | null;
	state?: string | null;
	observed_at?: string | null;
	stale?: boolean | null;
	generation?: number | null;
	applied_generation?: number | null;
};

export type InkboxAgentAddress = {
	url?: string | null;
	/** Send back on update to avoid overwriting a concurrent change. */
	version?: number | null;
	default_port?: number | null;
	ports?: Array<InkboxAgentPort> | null;
};

export type InkboxAgentClaimResponse = {
	claim_status?: InkboxAgentClaimStatus | null;
	organization_id?: string | null;
	message?: string | null;
	invitation?: InkboxA2AInvitationSignupSummary | null;
};

export type InkboxAgentClaimStatus = string;

export type InkboxAgentHandler = {
	type?: string | null;
	instructions?: string | null;
};

export type InkboxAgentIdentityDetailResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	id?: string | null;
	organization_id?: string | null;
	agent_handle?: string | null;
	display_name?: string | null;
	description?: string | null;
	status?: InkboxResourceStatus | null;
	whatsapp_enabled?: boolean | null;
	whatsapp_configured?: boolean | null;
	whatsapp_number?: string | null;
	imessage_enabled?: boolean | null;
	contact_sharing_enabled?: boolean | null;
	imessage_filter_mode?: InkboxFilterMode | null;
	mail_filter_mode?: InkboxFilterMode | null;
	phone_filter_mode?: InkboxFilterMode | null;
	slack_filter_mode?: InkboxFilterMode | null;
	slack_inbound_filter_mode?: InkboxFilterMode | null;
	slack_outbound_filter_mode?: InkboxFilterMode | null;
	mail_inbound_filter_mode?: InkboxFilterMode | null;
	mail_outbound_filter_mode?: InkboxFilterMode | null;
	phone_inbound_filter_mode?: InkboxFilterMode | null;
	phone_outbound_filter_mode?: InkboxFilterMode | null;
	email_address?: string | null;
	has_avatar?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	signing_key_configured?: boolean | null;
	signing_key_created_at?: string | null;
	hosting_mode?: string | null;
	mailbox?: InkboxMailboxResponse | null;
	phone_number?: InkboxPhoneNumberResponse | null;
	imessage_number?: InkboxAgentIdentityIMessageNumberResponse | null;
	tunnel?: InkboxTunnelSummaryResponse | null;
};

export type InkboxAgentIdentityIMessageNumberResponse = {
	id?: string | null;
	number?: string | null;
	type?: string | null;
	line_role?: string | null;
	status?: InkboxIMessageNumberStatus | null;
	/** Deprecated compatibility field; dedicated lines can initiate. */
	inbound_only?: boolean | null;
};

export type InkboxAgentIdentityResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	id?: string | null;
	organization_id?: string | null;
	agent_handle?: string | null;
	display_name?: string | null;
	description?: string | null;
	status?: InkboxResourceStatus | null;
	whatsapp_enabled?: boolean | null;
	whatsapp_configured?: boolean | null;
	whatsapp_number?: string | null;
	imessage_enabled?: boolean | null;
	contact_sharing_enabled?: boolean | null;
	imessage_filter_mode?: InkboxFilterMode | null;
	mail_filter_mode?: InkboxFilterMode | null;
	phone_filter_mode?: InkboxFilterMode | null;
	slack_filter_mode?: InkboxFilterMode | null;
	slack_inbound_filter_mode?: InkboxFilterMode | null;
	slack_outbound_filter_mode?: InkboxFilterMode | null;
	mail_inbound_filter_mode?: InkboxFilterMode | null;
	mail_outbound_filter_mode?: InkboxFilterMode | null;
	phone_inbound_filter_mode?: InkboxFilterMode | null;
	phone_outbound_filter_mode?: InkboxFilterMode | null;
	email_address?: string | null;
	has_avatar?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	signing_key_configured?: boolean | null;
	signing_key_created_at?: string | null;
};

export type InkboxAgentPort = {
	port?: number | null;
	public?: boolean | null;
	/** Null when the handle is longer than 56 characters. */
	url?: string | null;
	/** Shareable link carrying the port token; on the base address for the default port when ``url`` is null. */
	token_url?: string | null;
};

export type InkboxAgentRestrictions = {
	max_sends_per_day?: number | null;
	allowed_recipients?: Array<string> | null;
	can_receive?: boolean | null;
	can_create_mailboxes?: boolean | null;
};

export type InkboxAgentSignupStatusResponse = {
	claim_status?: InkboxAgentClaimStatus | null;
	human_state?: InkboxHumanState | null;
	human_email?: string | null;
	restrictions?: InkboxAgentRestrictions | null;
};

export type InkboxAlertResponse = {
	metric?: string | null;
	threshold?: number | null;
	mailbox_id?: string | null;
	enabled?: boolean | null;
	is_default?: boolean | null;
	id?: string | null;
};

export type InkboxApexMxWarning = {
	current_mx_targets?: Array<string> | null;
	acknowledged?: boolean | null;
};

export type InkboxApiKey = {
	id?: string | null;
	organization_id?: string | null;
	created_by?: string | null;
	creator_type?: InkboxObjectCreatorType | null;
	scoped_identity_id?: string | null;
	label?: string | null;
	description?: string | null;
	status?: InkboxApiKeyStatus | null;
	last4?: string | null;
	display_prefix?: string | null;
	last_used_at?: string | null;
	expires_at?: string | null;
	revoked_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxApiKeyStatus = string;

export type InkboxArtifactData = {
	id?: string | null;
	revision?: number | null;
	created_sequence?: number | null;
	turn_id?: string | null;
	resource_type?: string | null;
	file_id?: string | null;
	name?: string | null;
	media_type?: string | null;
	size_bytes?: number | null;
	availability?: string | null;
};

export type InkboxAttachmentDownloadResponse = {
	attachment_ref?: string | null;
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
	url?: string | null;
	expires_in?: number | null;
};

export type InkboxAttachmentMetadataResponse = {
	attachment_ref?: string | null;
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
};

export type InkboxAttachmentTranscription = {
	status?: string | null;
	text?: string | null;
	error_code?: string | null;
};

export type InkboxAutomation = {
	idle_stop_enabled?: boolean | null;
	idle_timeout_seconds?: number | null;
	schedules_may_start?: boolean | null;
	selected_events_may_start?: boolean | null;
};

export type InkboxBillingInterval = string;

export type InkboxBillingSettingsResponse = {
	/** Monthly SMS+voice overage spend limit in cents; None = no limit. Once cycle-to-date overage spend reaches it, overage-incurring sends and calls are refused (402) until the cycle resets or the limit is raised. Usage within included allowances is never blocked; inbound and in-flight usage can… */
	overage_cap_cents?: number | null;
	/** When true and the organization is on a paid plan, outbound emails omit the 'Sent via Inkbox' footer. Automatically set to true when upgrading from Free to any paid plan. On the Free plan the footer always applies. */
	remove_branding_footer?: boolean | null;
};

export type InkboxBlocker = {
	code?: string | null;
	message?: string | null;
	scope?: string | null;
	retryable?: boolean | null;
	actions?: Array<string> | null;
};

export type InkboxBoundedMessageDetailResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	from_address?: string | null;
	from_display_name?: string | null;
	sender_contact_name?: string | null;
	reply_to?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	direction?: InkboxMessageDirection | null;
	status?: InkboxMessageStatus | null;
	is_read?: boolean | null;
	is_starred?: boolean | null;
	has_attachments?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	body_text?: string | null;
	body_html?: string | null;
	body_truncated?: boolean | null;
	bcc_addresses?: Array<string> | null;
	in_reply_to?: string | null;
	references?: Array<string> | null;
	attachments?: Array<InkboxAttachmentMetadataResponse> | null;
};

export type InkboxBoundedThreadDetailResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	subject?: string | null;
	folder?: InkboxThreadFolder | null;
	message_count?: number | null;
	last_message_at?: string | null;
	created_at?: string | null;
	messages?: Array<InkboxSafeMessageResponse> | null;
	messages_has_more?: boolean | null;
};

export type InkboxBrandOptionalAttributes = {
	taxExemptStatus?: string | null;
};

export type InkboxBrandRegistrationResponse = {
	brandRelationship?: string | null;
	country?: string | null;
	displayName?: string | null;
	email?: string | null;
	entityType?: string | null;
	vertical?: string | null;
	altBusinessId?: string | null;
	altBusinessIdType?: string | null;
	brandId?: string | null;
	businessContactEmail?: string | null;
	city?: string | null;
	companyName?: string | null;
	createdAt?: string | null;
	cspId?: string | null;
	ein?: string | null;
	failureReasons?: (string | Array<InkboxRegistryFailureReason>) | null;
	firstName?: string | null;
	identityStatus?: string | null;
	ipAddress?: string | null;
	isReseller?: boolean | null;
	lastName?: string | null;
	mobilePhone?: string | null;
	mock?: boolean | null;
	optionalAttributes?: InkboxBrandOptionalAttributes | null;
	phone?: string | null;
	postalCode?: string | null;
	referenceId?: string | null;
	state?: string | null;
	status?: string | null;
	stockExchange?: string | null;
	stockSymbol?: string | null;
	street?: string | null;
	tcrBrandId?: string | null;
	universalEin?: string | null;
	updatedAt?: string | null;
	webhookFailoverURL?: string | null;
	webhookURL?: string | null;
	website?: string | null;
};

export type InkboxBrandSmsOtpTriggerResponse = {
	/** The registry-side brand UUID the OTP was triggered for. */
	brand_id?: string | null;
	/** Carrier-registry reference id for this OTP attempt. Useful for debugging if a customer reports they never received the SMS. */
	reference_id?: string | null;
};

export type InkboxBundleAgreement = {
	id?: string | null;
	code?: string | null;
	name?: string | null;
	line_kind?: string | null;
	monthly_amount?: string | null;
	status?: string | null;
	paid_through?: string | null;
	cancel_at_period_end?: boolean | null;
	change_pending?: boolean | null;
};

export type InkboxBundleOffer = {
	code?: string | null;
	name?: string | null;
	line_kind?: string | null;
	monthly_amount?: string | null;
	voice_seconds?: number | null;
	messages?: number | null;
};

export type InkboxBundleQuoteResponse = {
	quote?: string | null;
	expires_at?: number | null;
	code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	bundle_amount_cents?: number | null;
	amount_due_cents?: number | null;
	invoice_total_cents?: number | null;
	currency?: string | null;
	voice_seconds?: number | null;
	messages?: number | null;
	period_end?: string | null;
};

export type InkboxBundlesResponse = {
	offers?: Array<InkboxBundleOffer> | null;
	agreements?: Array<InkboxBundleAgreement> | null;
	voice_seconds_remaining?: number | null;
	messages_remaining?: number | null;
	/** Line slots the organization's paid bundles add on top of its plan limits. */
	capacity?: InkboxLineCapacity | null;
};

export type InkboxCallCommandResponse = {
	call_id?: string | null;
	state?: string | null;
};

export type InkboxCallConnectionKind = string;

export type InkboxCallConnectionStatus = string;

export type InkboxCallConnectionTrigger = string;

export type InkboxCallCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	remote_phone_number?: string | null;
	local_phone_number?: string | null;
	started_at?: string | null;
	ended_at?: string | null;
	duration_seconds?: number | null;
	connections?: Array<InkboxPhoneCallConnectionResponse> | null;
	transcript?: Array<InkboxCorrespondenceTranscriptEntry> | null;
	transcript_abridged?: boolean | null;
	transcript_unavailable?: boolean | null;
};

export type InkboxCallDirection = string;

export type InkboxCallForwardingStatus = string;

export type InkboxCallMode = string;

export type InkboxCallOrigin = string;

export type InkboxCallOutcome = string;

export type InkboxCallSettingsProjection = {
	agent_identity_id?: string | null;
	incoming_call_action?: string | null;
	client_websocket_configured?: boolean | null;
	incoming_webhook_configured?: boolean | null;
	forwarding_target_type?: string | null;
	forwarding_target?: string | null;
	hosted_agent?: InkboxHostedAgentSettingsProjection | null;
};

export type InkboxCallStatus = string;

export type InkboxCallingCountriesResponse = {
	countries?: Array<InkboxCallingCountryResponse> | null;
	agreements?: Array<InkboxCountryAgreementResponse> | null;
	included_country_codes?: Array<string> | null;
};

export type InkboxCallingCountryResponse = {
	country_code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	currency?: string | null;
	status?: string | null;
	agreement_id?: string | null;
};

export type InkboxCampaignActiveStateResponse = {
	active?: boolean | null;
};

export type InkboxCampaignActiveToggleResponse = {
	active?: boolean | null;
	local_numbers_scheduled_for_migration?: number | null;
};

export type InkboxCampaignRegistrationResponse = {
	brandId?: string | null;
	campaignId?: string | null;
	cspId?: string | null;
	description?: string | null;
	mock?: boolean | null;
	subUsecases?: Array<string> | null;
	termsAndConditions?: boolean | null;
	usecase?: string | null;
	ageGated?: boolean | null;
	autoRenewal?: boolean | null;
	billedDate?: string | null;
	brandDisplayName?: string | null;
	/** Campaign status */
	campaignStatus?: string | null;
	createDate?: string | null;
	directLending?: boolean | null;
	embeddedLink?: boolean | null;
	embeddedLinkSample?: string | null;
	embeddedPhone?: boolean | null;
	failureReasons?: (string | Array<InkboxRegistryFailureReason>) | null;
	helpKeywords?: string | null;
	helpMessage?: string | null;
	isTMobileNumberPoolingEnabled?: boolean | null;
	isTMobileRegistered?: boolean | null;
	isTMobileSuspended?: boolean | null;
	messageFlow?: string | null;
	nextRenewalOrExpirationDate?: string | null;
	numberPool?: boolean | null;
	optinKeywords?: string | null;
	optinMessage?: string | null;
	optoutKeywords?: string | null;
	optoutMessage?: string | null;
	privacyPolicyLink?: string | null;
	referenceId?: string | null;
	resellerId?: string | null;
	sample1?: string | null;
	sample2?: string | null;
	sample3?: string | null;
	sample4?: string | null;
	sample5?: string | null;
	status?: string | null;
	submissionStatus?: string | null;
	subscriberHelp?: boolean | null;
	subscriberOptin?: boolean | null;
	subscriberOptout?: boolean | null;
	tcrBrandId?: string | null;
	tcrCampaignId?: string | null;
	termsAndConditionsLink?: string | null;
	vertical?: string | null;
	webhookFailoverURL?: string | null;
	webhookURL?: string | null;
};

export type InkboxCancellation = {
	id?: string | null;
	cancellation_requested?: boolean | null;
	terminal?: boolean | null;
};

export type InkboxCapabilities = {
	pause_resume?: boolean | null;
	permission_mode_selection?: boolean | null;
	model_selection?: boolean | null;
	send_message?: boolean | null;
	cancel_turn?: boolean | null;
	approvals?: boolean | null;
	questions?: boolean | null;
	attachments?: boolean | null;
	tool_activity?: boolean | null;
};

export type InkboxCatalogRateResponse = {
	code?: string | null;
	name?: string | null;
	kind?: string | null;
	unit?: string | null;
	currency?: string | null;
	published_amount?: string | null;
	amount?: string | null;
	pricing_state?: string | null;
};

export type InkboxChannelUsageResponse = {
	/** Usage channel key (UsageEventType, e.g. 'sms_outbound'). */
	event_type?: string | null;
	/** Total usage this cycle (messages, or call seconds for voice). */
	count?: number | null;
	/** Units beyond the included allowance this cycle. */
	overage?: number | null;
	/** Estimated overage cost in cents (from published rates). None for unpriced channels (email, iMessage). */
	est_overage_cents?: number | null;
	/** For SMS channels: portion of 'count' carried on the org's own 10DLC campaign (the rest rode the Inkbox-managed campaign). None on non-SMS channels. */
	own_campaign_count?: number | null;
};

export type InkboxCheckoutSessionResponse = {
	/** Stripe Checkout session URL. */
	url?: string | null;
};

export type InkboxChoice = {
	id?: string | null;
	label?: string | null;
};

export type InkboxCompanionConfigResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	enabled?: boolean | null;
	config_revision?: number | null;
	readiness?: Record<string, InkboxCompanionReadiness> | null;
};

export type InkboxCompanionConversation = {
	scope_id?: string | null;
	conversation_id?: string | null;
	channel?: string | null;
	status?: string | null;
	activation_id?: string | null;
	reply_ready?: boolean | null;
	reasons?: Array<string> | null;
};

export type InkboxCompanionConversationsResponse = {
	items?: Array<InkboxCompanionConversation> | null;
	total?: number | null;
};

export type InkboxCompanionHistoryEntry = {
	id?: string | null;
	author?: string | null;
	occurred_at?: string | null;
	text?: string | null;
	historical?: boolean | null;
	is_trigger?: boolean | null;
	attachments?: Array<Record<string, InkboxJsonValue>> | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
};

export type InkboxCompanionHistoryResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	scope_id?: string | null;
	activation_id?: string | null;
	conversation_id?: string | null;
	channel?: string | null;
	items?: Array<InkboxCompanionHistoryEntry> | null;
	history_complete?: boolean | null;
	next_cursor?: string | null;
	reply_context?: InkboxCompanionReplyContext | null;
};

export type InkboxCompanionReadiness = {
	ready?: boolean | null;
	reasons?: Array<string> | null;
};

export type InkboxCompanionReplyContext = {
	channel?: string | null;
	conversation_id?: string | null;
	connection_id?: string | null;
	slack_conversation_id?: string | null;
	thread_ts?: string | null;
	reply_to_message_id?: string | null;
	to?: Array<string> | null;
	cc?: Array<string> | null;
};

export type InkboxCompanionWebhookMetadata = {
	scope_id?: string | null;
	conversation_id?: string | null;
	channel?: string | null;
	phase?: string | null;
	sequence?: number | null;
	activation_id?: string | null;
	history?: Array<InkboxCompanionHistoryEntry> | null;
	history_complete?: boolean | null;
	history_next_cursor?: string | null;
	reply_context?: InkboxCompanionReplyContext | null;
};

export type InkboxComputer = {
	state?: string | null;
	desired_state?: string | null;
	pause_requested?: boolean | null;
	shape_id?: string | null;
	version?: number | null;
	created_at?: string | null;
	tier?: string | null;
	vcpus?: number | null;
	memory_bytes?: number | null;
	disk_bytes?: number | null;
	software?: Record<string, string | null> | null;
	operation?: InkboxOperation | null;
};

export type InkboxConfiguration = {
	environment_version?: number | null;
	applied_environment_version?: number | null;
	pending?: boolean | null;
	last_error?: string | null;
};

export type InkboxConnectIMessageResponse = {
	assignment?: InkboxIMessageAssignmentResponse | null;
	conversation_id?: string | null;
	/** Assigned E.164 number for an organization-owned shared pool or personal dedicated line; otherwise null. */
	assigned_number?: string | null;
	message?: InkboxIMessageMessageResponse | null;
	already_connected?: boolean | null;
};

export type InkboxConnectWhatsAppResponse = {
	assignment?: InkboxWhatsAppAssignmentResponse | null;
	conversation_id?: string | null;
	/** The organization-owned shared number the recipient should message; null on Inkbox's global shared numbers, which the recipient learns from the router. */
	assigned_number?: string | null;
	already_connected?: boolean | null;
	/** True until the recipient sends a message; replies are rejected until then. */
	awaiting_inbound?: boolean | null;
};

export type InkboxContactAccessResponse = {
	id?: string | null;
	contact_id?: string | null;
	identity_id?: string | null;
	created_at?: string | null;
};

export type InkboxContactAccessSettingsResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	email?: InkboxContactChannelAccessResponse | null;
	phone?: InkboxContactChannelAccessResponse | null;
	profile?: boolean | null;
	memories?: boolean | null;
};

export type InkboxContactAddressItem = {
	street?: string | null;
	city?: string | null;
	region?: string | null;
	postal?: string | null;
	country?: string | null;
	label?: string | null;
};

export type InkboxContactAddressPermission = {
	kind?: string | null;
	value?: string | null;
	label?: string | null;
	action?: string | null;
	allowed?: boolean | null;
	inbound_action?: string | null;
	outbound_action?: string | null;
	allowed_inbound?: boolean | null;
	allowed_outbound?: boolean | null;
};

export type InkboxContactBulkDeleteResponse = {
	deleted_count?: number | null;
	error_count?: number | null;
	results?: Array<InkboxContactBulkDeleteResponseItem> | null;
};

export type InkboxContactBulkDeleteResponseItem = {
	contact_id?: string | null;
	status?: string | null;
	error?: string | null;
	error_code?: string | null;
};

export type InkboxContactChannelAccessResponse = {
	visible?: boolean | null;
	contactable?: Array<string> | null;
	inbound_contactable?: Array<string> | null;
	outbound_contactable?: Array<string> | null;
};

export type InkboxContactCommunicationPolicyPage = {
	notices?: Array<InkboxResponseNotice> | null;
	items?: Array<InkboxContactCommunicationPreview> | null;
	limit?: number | null;
	offset?: number | null;
	has_more?: boolean | null;
};

export type InkboxContactCommunicationPolicyResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	contact_id?: string | null;
	revision?: number | null;
	identity_id?: string | null;
	addresses?: Array<InkboxContactAddressPermission> | null;
	effective_visibility?: InkboxContactVisibilityResult | null;
	visibility?: InkboxContactVisibilityPolicy | null;
};

export type InkboxContactCommunicationPreview = {
	notices?: Array<InkboxResponseNotice> | null;
	identity_id?: string | null;
	contact?: InkboxContactListResponse | null;
	email?: boolean | null;
	phone?: boolean | null;
	inbound_email?: boolean | null;
	outbound_email?: boolean | null;
	inbound_phone?: boolean | null;
	outbound_phone?: boolean | null;
	full_profile?: boolean | null;
	visibility?: InkboxContactVisibilityResult | null;
};

export type InkboxContactCorrespondenceResponse = {
	contact_id?: string | null;
	identity_id?: string | null;
	items?: Array<
		| InkboxEmailCorrespondenceItem
		| InkboxSmsCorrespondenceItem
		| InkboxIMessageCorrespondenceItem
		| InkboxWhatsAppCorrespondenceItem
		| InkboxCallCorrespondenceItem
		| InkboxSlackCorrespondenceItem
	> | null;
	channels?: Array<InkboxCorrespondenceChannelResult> | null;
	next_cursor?: string | null;
};

export type InkboxContactCreationSource = string;

export type InkboxContactCustomFieldItem = {
	label?: string | null;
	value?: string | null;
};

export type InkboxContactDateItem = {
	date?: string | null;
	label?: string | null;
};

export type InkboxContactEmailItem = {
	value?: string | null;
	label?: string | null;
	is_primary?: boolean | null;
};

export type InkboxContactFactCitationDetailResponse = {
	source_type?: string | null;
	source_id?: string | null;
	source_locator?: Record<string, InkboxJsonValue> | null;
	source_url?: string | null;
};

export type InkboxContactFactCitationResponse = {
	source_type?: string | null;
	availability?: string | null;
	source_id?: string | null;
	source_url?: string | null;
	source_locator?: Record<string, InkboxJsonValue> | null;
};

export type InkboxContactFactDeleteResponse = {
	deleted_fact_id?: string | null;
	memory_count?: number | null;
	latest_memory?: InkboxContactMemorySummary | null;
};

export type InkboxContactFactResponse = {
	id?: string | null;
	contact_id?: string | null;
	content?: string | null;
	confidence?: string | null;
	origin?: string | null;
	kind?: string | null;
	expires_at?: string | null;
	locked_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	citations?: Array<InkboxContactFactCitationResponse> | null;
};

export type InkboxContactIdentityVisibilityDecisions = {
	profile?: string | null;
	memories?: string | null;
	identity_id?: string | null;
};

export type InkboxContactImportConflict = {
	index?: number | null;
	contact_ids?: Array<string> | null;
};

export type InkboxContactImportPreviewResponse = {
	contact_count?: number | null;
	conflicts?: Array<InkboxContactImportConflict> | null;
	payload_hash?: string | null;
	preview_hash?: string | null;
};

export type InkboxContactImportResponse = {
	created_count?: number | null;
	error_count?: number | null;
	results?: Array<InkboxContactImportResponseItem> | null;
};

export type InkboxContactImportResponseItem = {
	index?: number | null;
	status?: string | null;
	contact?: InkboxContactResponse | null;
	error?: string | null;
	conflicting_contact_id?: string | null;
};

export type InkboxContactListResponse = {
	id?: string | null;
	organization_id?: string | null;
	preferred_name?: string | null;
	name_prefix?: string | null;
	given_name?: string | null;
	middle_name?: string | null;
	family_name?: string | null;
	name_suffix?: string | null;
	company_name?: string | null;
	job_title?: string | null;
	birthday?: string | null;
	notes?: string | null;
	emails?: Array<InkboxContactEmailItem> | null;
	phones?: Array<InkboxContactPhoneItemResponse> | null;
	slack_accounts?: Array<InkboxContactSlackAccount> | null;
	websites?: Array<InkboxContactWebsiteItem> | null;
	dates?: Array<InkboxContactDateItem> | null;
	addresses?: Array<InkboxContactAddressItem> | null;
	custom_fields?: Array<InkboxContactCustomFieldItem> | null;
	creation_source?: InkboxContactCreationSource | null;
	review_status?: InkboxContactReviewStatus | null;
	reviewed_at?: string | null;
	reviewed_by?: string | null;
	preferred_name_source?: InkboxContactNameSource | null;
	preferred_name_locked_at?: string | null;
	created_by_identity_id?: string | null;
	merged_into_contact_id?: string | null;
	is_auto_created?: boolean | null;
	is_confirmed?: boolean | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Raw ``contact_access`` rows for this contact, inlined so the console can skip a follow-up ``GET /contacts/{id}/access`` per row. Either a single wildcard row (``identity_id=null``), an explicit per-identity list, or empty when the contact has zero legacy rows. These rows do not determine… */
	access?: Array<InkboxContactAccessResponse> | null;
	memory_count?: number | null;
	latest_memory?: InkboxContactMemorySummary | null;
};

export type InkboxContactMemorySummary = {
	id?: string | null;
	content?: string | null;
	updated_at?: string | null;
};

export type InkboxContactMutationResponse = {
	id?: string | null;
	organization_id?: string | null;
	preferred_name?: string | null;
	name_prefix?: string | null;
	given_name?: string | null;
	middle_name?: string | null;
	family_name?: string | null;
	name_suffix?: string | null;
	company_name?: string | null;
	job_title?: string | null;
	birthday?: string | null;
	notes?: string | null;
	emails?: Array<InkboxContactEmailItem> | null;
	phones?: Array<InkboxContactPhoneItemResponse> | null;
	slack_accounts?: Array<InkboxContactSlackAccount> | null;
	websites?: Array<InkboxContactWebsiteItem> | null;
	dates?: Array<InkboxContactDateItem> | null;
	addresses?: Array<InkboxContactAddressItem> | null;
	custom_fields?: Array<InkboxContactCustomFieldItem> | null;
	creation_source?: InkboxContactCreationSource | null;
	review_status?: InkboxContactReviewStatus | null;
	reviewed_at?: string | null;
	reviewed_by?: string | null;
	preferred_name_source?: InkboxContactNameSource | null;
	preferred_name_locked_at?: string | null;
	created_by_identity_id?: string | null;
	merged_into_contact_id?: string | null;
	is_auto_created?: boolean | null;
	is_confirmed?: boolean | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Raw ``contact_access`` rows for this contact, inlined so the console can skip a follow-up ``GET /contacts/{id}/access`` per row. Either a single wildcard row (``identity_id=null``), an explicit per-identity list, or empty when the contact has zero legacy rows. These rows do not determine… */
	access?: Array<InkboxContactAccessResponse> | null;
	memory_count?: number | null;
	latest_memory?: InkboxContactMemorySummary | null;
};

export type InkboxContactNameSource = string;

export type InkboxContactPermissionEffective = {
	profile?: boolean | null;
	memories?: boolean | null;
	email?: string | null;
	phone?: string | null;
	inbound_email?: string | null;
	outbound_email?: string | null;
	inbound_phone?: string | null;
	outbound_phone?: string | null;
};

export type InkboxContactPermissionEntry = {
	contact?: InkboxContactPermissionSummary | null;
	revision?: number | null;
	visibility?: InkboxContactPermissionVisibility | null;
	effective?: InkboxContactPermissionEffective | null;
	access?: InkboxContactAccessSettingsResponse | null;
};

export type InkboxContactPermissionPage = {
	notices?: Array<InkboxResponseNotice> | null;
	items?: Array<InkboxContactPermissionEntry> | null;
	limit?: number | null;
	offset?: number | null;
	has_more?: boolean | null;
};

export type InkboxContactPermissionSummary = {
	id?: string | null;
	preferred_name?: string | null;
	given_name?: string | null;
	family_name?: string | null;
	company_name?: string | null;
	review_status?: InkboxContactReviewStatus | null;
	emails?: Array<InkboxContactEmailItem> | null;
	phones?: Array<InkboxContactPhoneItemResponse> | null;
};

export type InkboxContactPermissionVisibility = {
	defaults?: InkboxContactVisibilityDecisions | null;
	identity_override?: InkboxContactVisibilityDecisions | null;
};

export type InkboxContactPermissionsResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	emails?: Record<string, boolean> | null;
	phones?: Record<string, boolean> | null;
	inbound_emails?: Record<string, boolean> | null;
	outbound_emails?: Record<string, boolean> | null;
	inbound_phones?: Record<string, boolean> | null;
	outbound_phones?: Record<string, boolean> | null;
	profile?: boolean | null;
	memories?: boolean | null;
};

export type InkboxContactPhoneItemResponse = {
	value_e164?: string | null;
	label?: string | null;
	is_primary?: boolean | null;
};

export type InkboxContactResponse = {
	id?: string | null;
	organization_id?: string | null;
	preferred_name?: string | null;
	name_prefix?: string | null;
	given_name?: string | null;
	middle_name?: string | null;
	family_name?: string | null;
	name_suffix?: string | null;
	company_name?: string | null;
	job_title?: string | null;
	birthday?: string | null;
	notes?: string | null;
	emails?: Array<InkboxContactEmailItem> | null;
	phones?: Array<InkboxContactPhoneItemResponse> | null;
	slack_accounts?: Array<InkboxContactSlackAccount> | null;
	websites?: Array<InkboxContactWebsiteItem> | null;
	dates?: Array<InkboxContactDateItem> | null;
	addresses?: Array<InkboxContactAddressItem> | null;
	custom_fields?: Array<InkboxContactCustomFieldItem> | null;
	creation_source?: InkboxContactCreationSource | null;
	review_status?: InkboxContactReviewStatus | null;
	reviewed_at?: string | null;
	reviewed_by?: string | null;
	preferred_name_source?: InkboxContactNameSource | null;
	preferred_name_locked_at?: string | null;
	created_by_identity_id?: string | null;
	merged_into_contact_id?: string | null;
	is_auto_created?: boolean | null;
	is_confirmed?: boolean | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Raw ``contact_access`` rows for this contact, inlined so the console can skip a follow-up ``GET /contacts/{id}/access`` per row. Either a single wildcard row (``identity_id=null``), an explicit per-identity list, or empty when the contact has zero legacy rows. These rows do not determine… */
	access?: Array<InkboxContactAccessResponse> | null;
};

export type InkboxContactReviewStatus = string;

export type InkboxContactSlackAccount = {
	workspace_id?: string | null;
	user_id?: string | null;
	workspace_name?: string | null;
};

export type InkboxContactVCardExportResponse = {
	content_type?: string | null;
	contact_count?: number | null;
	vcard?: string | null;
};

export type InkboxContactVisibilityDecisions = {
	profile?: string | null;
	memories?: string | null;
};

export type InkboxContactVisibilityPolicy = {
	defaults?: InkboxContactVisibilityDecisions | null;
	identities?: Array<InkboxContactIdentityVisibilityDecisions> | null;
};

export type InkboxContactVisibilityResult = {
	profile?: boolean | null;
	memories?: boolean | null;
};

export type InkboxContactWebsiteItem = {
	url?: string | null;
	label?: string | null;
};

export type InkboxConversation = {
	permission_mode?: string | null;
	created_at?: string | null;
	last_active_at?: string | null;
	id?: string | null;
	identity_id?: string | null;
	title?: string | null;
	origin?: string | null;
	capabilities?: InkboxCapabilities | null;
	history_completeness?: string | null;
};

export type InkboxConversationPage = {
	items?: Array<InkboxConversation> | null;
	next_cursor?: string | null;
};

export type InkboxCorrespondenceAttachmentMetadata = {
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
};

export type InkboxCorrespondenceChannel = string;

export type InkboxCorrespondenceChannelResult = {
	channel?: InkboxCorrespondenceChannel | null;
	status?: InkboxCorrespondenceChannelStatus | null;
	returned?: number | null;
};

export type InkboxCorrespondenceChannelStatus = string;

export type InkboxCorrespondenceMediaMetadata = {
	count?: number | null;
};

export type InkboxCorrespondenceTranscriptEntry = {
	id?: string | null;
	seq?: number | null;
	party?: string | null;
	phone_number?: string | null;
	text?: string | null;
	ts_ms?: number | null;
	marker?: string | null;
	omitted_turns?: number | null;
	omitted_ms?: number | null;
};

export type InkboxCountryAgreementResponse = {
	id?: string | null;
	name?: string | null;
	country_codes?: Array<string> | null;
	monthly_amount?: string | null;
	currency?: string | null;
	status?: string | null;
	covered_through?: string | null;
	cancel_at_period_end?: boolean | null;
	change_pending?: boolean | null;
	created_at?: string | null;
};

export type InkboxCountryQuoteLine = {
	country_code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	amount_cents?: number | null;
};

export type InkboxCountryQuoteResponse = {
	quote?: string | null;
	expires_at?: number | null;
	monthly_amount?: string | null;
	country_amount_cents?: number | null;
	invoice_total_cents?: number | null;
	amount_due_cents?: number | null;
	currency?: string | null;
	renewal_at?: number | null;
	items?: Array<InkboxCountryQuoteLine> | null;
};

export type InkboxCreateApiKeyResponse = {
	/** Full API key string. Shown once, cannot be retrieved later. */
	api_key?: string | null;
	record?: InkboxApiKey | null;
};

export type InkboxCreateDomainResponse = {
	domain?: InkboxDomainResponse | null;
	dns_records?: Array<InkboxDnsRecordResponse> | null;
	apex_mx_warning?: InkboxApexMxWarning | null;
	spf_lookup_report?: InkboxSpfLookupReportResponse | null;
};

export type InkboxCreditBalance = {
	currency?: string | null;
	one_time?: boolean | null;
	grant_microusd?: number | null;
	settled_microusd?: number | null;
	reserved_microusd?: number | null;
	available_microusd?: number | null;
	activated?: boolean | null;
	eligible?: boolean | null;
	exhausted?: boolean | null;
};

export type InkboxCursorPageMailImportJobResponse = {
	items?: Array<InkboxMailImportJobResponse> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxCursorPageMessageResponse = {
	items?: Array<InkboxMessageResponse> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxCursorPageSafeMessageResponse = {
	items?: Array<InkboxSafeMessageResponse> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxCursorPageThreadResponse = {
	items?: Array<InkboxThreadResponse> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxDeliveryFailure = {
	event_id?: string | null;
	code?: string | null;
	finished_unix_ms?: number | null;
};

export type InkboxDisconnectIMessageResponse = {
	assignment_id?: string | null;
	disconnected?: boolean | null;
};

export type InkboxDisconnectWhatsAppResponse = {
	assignment_id?: string | null;
	disconnected?: boolean | null;
};

export type InkboxDnsRecordHealthSummary = {
	type?: string | null;
	host?: string | null;
	purpose?: InkboxDnsRecordPurpose | null;
	status?: InkboxDnsRecordStatus | null;
	required?: boolean | null;
};

export type InkboxDnsRecordPurpose = string;

export type InkboxDnsRecordResponse = {
	type?: string | null;
	host?: string | null;
	value?: string | null;
	ttl?: number | null;
	purpose?: InkboxDnsRecordPurpose | null;
	status?: InkboxDnsRecordStatus | null;
	is_required?: boolean | null;
	is_inkbox_branded?: boolean | null;
	observed_values?: Array<string> | null;
};

export type InkboxDnsRecordStatus = string;

export type InkboxDnsRecordsResponse = {
	dns_records?: Array<InkboxDnsRecordResponse> | null;
};

export type InkboxDomainAffiliationAssertion = {
	domain?: string | null;
	verifier?: string | null;
	last_success_at?: string | null;
	valid_until?: string | null;
};

export type InkboxDomainClaimState = string;

export type InkboxDomainHealthResponse = {
	domain?: InkboxDomainHealthSummary | null;
	dns_records?: Array<InkboxDnsRecordHealthSummary> | null;
};

export type InkboxDomainHealthSummary = {
	id?: string | null;
	domain?: string | null;
	mail_from_subdomain?: string | null;
	is_default?: boolean | null;
	status?: InkboxSendingDomainStatus | null;
	ownership_validated?: boolean | null;
	verified_at?: string | null;
	last_checked_at?: string | null;
	degraded_since?: string | null;
};

export type InkboxDomainResponse = {
	id?: string | null;
	organization_id?: string | null;
	domain?: string | null;
	mail_from_subdomain?: string | null;
	is_default?: boolean | null;
	status?: InkboxSendingDomainStatus | null;
	failure_reason?: string | null;
	verified_at?: string | null;
	last_checked_at?: string | null;
	dkim_selector?: string | null;
	ownership_token?: string | null;
};

export type InkboxDomainTxtRecord = {
	type?: string | null;
	name?: string | null;
	value?: string | null;
};

export type InkboxDomainWithDnsRecordsResponse = {
	domain?: InkboxDomainResponse | null;
	dns_records?: Array<InkboxDnsRecordResponse> | null;
};

export type InkboxDraftAttachmentResponse = {
	part_index?: number | null;
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
	content_id?: string | null;
	is_inline?: boolean | null;
};

export type InkboxDraftDetailResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	from_address?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	bcc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	has_attachments?: boolean | null;
	attachment_count?: number | null;
	generation?: number | null;
	send_state?: InkboxDraftSendState | null;
	track_opens?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	body_text?: string | null;
	body_html?: string | null;
	reply_to?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	in_reply_to?: string | null;
	references?: Array<string> | null;
	forward_source_message_id?: string | null;
	forward_note_text?: string | null;
	forward_note_html?: string | null;
	attachment_metadata?: Array<InkboxDraftAttachmentResponse> | null;
};

export type InkboxDraftListResponse = {
	items?: Array<InkboxDraftSummaryResponse> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxDraftSendState = string;

export type InkboxDraftSummaryResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	from_address?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	bcc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	has_attachments?: boolean | null;
	attachment_count?: number | null;
	generation?: number | null;
	send_state?: InkboxDraftSendState | null;
	track_opens?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxEmailCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	mailbox_email?: string | null;
	thread_id?: string | null;
	from_address?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	bcc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	body_text?: string | null;
	content_unavailable?: boolean | null;
	attachments?: Array<InkboxCorrespondenceAttachmentMetadata> | null;
};

export type InkboxEndedBy = string;

export type InkboxEntitlementsResponse = {
	/** True when the active subscription price matches a custom_plans row. */
	is_custom?: boolean | null;
	/** Plan display name — the custom plan's name, else the tier name. */
	display_name?: string | null;
	/** Flat recurring plan fee in cents per plan_amount_interval; None when it can't be determined. */
	plan_amount_cents?: number | null;
	/** Renewal cadence plan_amount_cents is charged at ('month' or 'year'). */
	plan_amount_interval?: InkboxBillingInterval | null;
	/** Phone-enabled identities cap (resolved PHONE_NUMBERS quota). */
	phone_numbers?: number | null;
	/** Custom email domains cap (resolved MAIL_SENDING_DOMAINS_ACTIVE quota). */
	sending_domains?: number | null;
	/** Agent-identity cap (resolved IDENTITIES_ACTIVE quota). */
	identities?: number | null;
	/** Whether this organization can configure automatic custom email signatures. */
	mail_custom_signatures_enabled?: boolean | null;
	/** Stored-mail cap per mailbox in bytes (resolved MAIL_STORAGE_BYTES_PER_IDENTITY quota). */
	mail_storage_bytes_per_identity?: number | null;
	/** Org-wide shared-pool iMessage messages per billing cycle (resolved IMESSAGE_MESSAGES_PER_ORG_PER_CYCLE quota; dedicated-line traffic has its own cap). */
	imessage_messages_per_org_per_cycle?: number | null;
	/** Org-wide dedicated-line iMessage messages per billing cycle (resolved IMESSAGE_DEDICATED_MESSAGES_PER_ORG_PER_CYCLE quota); None/0 when the plan includes no dedicated lines. */
	imessage_dedicated_messages_per_org_per_cycle?: number | null;
	/** For Startup subscriptions: 'outbound' identifies the current $200 plan; 'inbound' identifies a grandfathered retired $180 price. None on other plans. */
	startup_variant?: InkboxStartupVariant | null;
	/** Recipients each agent identity can have connected at a time over shared iMessage lines (resolved IMESSAGE_UNIQUE_RECIPIENTS_PER_AGENT_IDENTITY quota). */
	imessage_unique_recipients_per_agent_identity?: number | null;
	/** Deprecated compatibility field; use sms_allowance_per_org_per_cycle. */
	sms_allowance_per_identity?: number | null;
	/** Deprecated compatibility field; use voice_sec_allowance_per_org_per_cycle. */
	voice_sec_allowance_per_identity?: number | null;
	allowance_scope?: string | null;
	/** Included SMS/MMS shared across the organization. */
	sms_allowance_per_org_per_cycle?: number | null;
	/** Included voice seconds shared across the organization. */
	voice_sec_allowance_per_org_per_cycle?: number | null;
	/** Total organization-owned iMessage lines, shared across personal, private-pool, and router roles. */
	imessage_lines?: number | null;
	/** Occupied organization line slots, including paused lines. */
	imessage_lines_used?: number | null;
	/** Deprecated legacy line-budget input; imessage_lines is authoritative. */
	imessage_personal_lines?: number | null;
	/** Deprecated legacy line-budget input; imessage_lines is authoritative. */
	imessage_shared_lines?: number | null;
	/** Deprecated legacy line-budget input; imessage_lines is authoritative. */
	imessage_router_lines?: number | null;
	/** Whether iMessage is included on the plan's identities. */
	imessage_enabled?: boolean | null;
	/** Dedicated inbound (receive/reply-only) iMessage lines the org may claim (resolved IMESSAGE_DEDICATED_INBOUND_LINES quota; 0 when the plan includes none). */
	dedicated_imessage_inbound_lines?: number | null;
	/** Dedicated outbound (may initiate) iMessage lines the org may claim (resolved IMESSAGE_DEDICATED_OUTBOUND_LINES quota; 0 when the plan includes none). */
	dedicated_imessage_outbound_lines?: number | null;
	/** iMessage volume included per billing cycle before overage billing; None when the plan has no such term. */
	imessage_included_messages_per_cycle?: number | null;
	/** Price in cents per additional 1M iMessages (or portion thereof) beyond the included volume; None when the plan has no such term. */
	imessage_overage_cents_per_million?: number | null;
	/** Monthly fee in cents per carrier-approved 10DLC campaign; None when the fee isn't offered in this environment. */
	campaign_fee_cents?: number | null;
	/** Whether the org is currently being billed the 10DLC campaign fee. */
	campaign_fee_active?: boolean | null;
	/** Recurring minute packs on offer with the org's current quantities; None when minute packs aren't offered in this environment. */
	voice_packs?: Array<InkboxVoicePackResponse> | null;
	/** Recurring charges on the plan subscription that plan_amount_cents, voice_packs, the campaign fee and the line and calling-destination add-ons don't cover. */
	other_recurring_items?: Array<InkboxRecurringItemResponse> | null;
};

export type InkboxEnvironment = {
	version?: number | null;
	items?: Array<InkboxEnvironmentEntry> | null;
	applies_to?: string | null;
	supported?: boolean | null;
};

export type InkboxEnvironmentEntry = {
	name?: string | null;
	secret?: boolean | null;
	is_set?: boolean | null;
	value?: string | null;
};

export type InkboxEnvironmentReceipt = {
	version?: number | null;
	applies_to?: string | null;
};

export type InkboxExecReceipt = {
	exec_id?: string | null;
	state?: string | null;
	exit_code?: number | null;
	signal?: number | null;
	stdout_bytes?: number | null;
	stderr_bytes?: number | null;
	stdout_truncated?: boolean | null;
	stderr_truncated?: boolean | null;
};

export type InkboxFileContent = {
	type?: string | null;
	file_id?: string | null;
	name?: string | null;
	media_type?: string | null;
	size_bytes?: number | null;
	availability?: string | null;
};

export type InkboxFileDownload = {
	file_id?: string | null;
	data_base64?: string | null;
};

export type InkboxFileReceipt = {
	file?: InkboxFileContent | null;
	operation_id?: string | null;
};

export type InkboxFilterMode = string;

export type InkboxFilterModeChangeNotice = {
	new_filter_mode?: InkboxFilterMode | null;
	/** 'block' or 'allow'; the action whose rules are now redundant. */
	redundant_rule_action?: string | null;
	/** Count of active rules whose action equals redundant_rule_action. 0 = clean flip; >0 = console UI should prompt the operator to review. */
	redundant_rule_count?: number | null;
};

export type InkboxForwardingTargetType = string;

export type InkboxFunding = {
	applied?: InkboxFundingSource | null;
	selected_binding_id?: string | null;
	pending?: boolean | null;
	credits?: InkboxCreditBalance | null;
	observed_at?: string | null;
	blockers?: Array<InkboxBlocker> | null;
};

export type InkboxFundingSource = {
	source?: string | null;
	binding_id?: string | null;
	key_revoked?: boolean | null;
};

export type InkboxHangupReason = string;

export type InkboxHistoryPage = {
	items?: Array<
		| InkboxMessageData
		| InkboxTurnData
		| InkboxToolData
		| InkboxInteractionData
		| InkboxArtifactData
	> | null;
	sequence?: number | null;
	next_cursor?: string | null;
};

export type InkboxHostedAgentAuthorityMode = string;

export type InkboxHostedAgentConfig = {
	agent_identity_id?: string | null;
	voice?: string | null;
	/** Compatibility field; accepted values are not stored or used. */
	model?: string | null;
	effective_voice?: string | null;
	/** Informational platform-selected runtime identifier; not a configurable model. */
	effective_model?: string | null;
	instructions?: string | null;
	/** Voice AI authority for incoming and outbound calls. Unconfigured identities default to yolo. */
	authority_mode?: InkboxHostedAgentAuthorityMode | null;
};

export type InkboxHostedAgentSettingsProjection = {
	/** Compatibility field; always null. */
	model?: string | null;
	voice?: string | null;
	/** Server-selected model used for hosted calls. */
	effective_model?: string | null;
	effective_voice?: string | null;
	instructions_configured?: boolean | null;
};

export type InkboxHostedAgentToolInvocationProjection = {
	id?: string | null;
	call_id?: string | null;
	tool_name?: string | null;
	status?: string | null;
	result?: Record<string, (string | number | boolean) | null> | null;
	started_at?: string | null;
	completed_at?: string | null;
	source?: string | null;
	connection_id?: string | null;
	config_version?: number | null;
	connection_label?: string | null;
	server_url?: string | null;
	error_code?: string | null;
	observation_coverage?: string | null;
	arguments_available?: boolean | null;
	result_available?: boolean | null;
	observed_at?: string | null;
};

export type InkboxHostedAgentToolInvocationProjectionPage = {
	items?: Array<InkboxHostedAgentToolInvocationProjection> | null;
	limit?: number | null;
	offset?: number | null;
	has_more?: boolean | null;
	incomplete?: boolean | null;
};

export type InkboxHostedAgentVoiceCatalog = {
	voices?: Array<InkboxHostedAgentVoiceOption> | null;
	default_voice?: string | null;
};

export type InkboxHostedAgentVoiceOption = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	provider?: InkboxHostedVoiceProvider | null;
	/** Whether your organization can currently select this voice. */
	available?: boolean | null;
	/** Prerecorded voice sample URL, or null when unavailable. */
	preview_url?: string | null;
	/** Report whether this voice supports external MCP connections. */
	mcp_supported?: boolean | null;
};

export type InkboxHostedMcpActivity = {
	id?: string | null;
	connection_label?: string | null;
	tool_name?: string | null;
	status?: string | null;
	error_code?: string | null;
	started_at?: string | null;
	completed_at?: string | null;
};

export type InkboxHostedMcpActivityPage = {
	items?: Array<InkboxHostedMcpActivity> | null;
	limit?: number | null;
	offset?: number | null;
	has_more?: boolean | null;
	incomplete?: boolean | null;
};

export type InkboxHostedMcpAuthView = {
	type?: string | null;
	configured?: boolean | null;
	header_name?: string | null;
	value_prefix?: string | null;
	status?: string | null;
	expires_at?: string | null;
	refresh_supported?: boolean | null;
	requested_scopes?: Array<string> | null;
	granted_scopes?: Array<string> | null;
	error_code?: string | null;
	issuer?: string | null;
	callback_uri?: string | null;
};

export type InkboxHostedMcpCatalog = {
	tools?: Array<Record<string, InkboxJsonValue>> | null;
	prompts?: Array<Record<string, InkboxJsonValue>> | null;
	resources?: Array<Record<string, InkboxJsonValue>> | null;
	skills?: Array<Record<string, InkboxJsonValue>> | null;
	next_cursor?: string | null;
	config_version?: number | null;
	catalog_version?: string | null;
};

export type InkboxHostedMcpConnectionList = {
	connections?: Array<InkboxHostedMcpConnectionView> | null;
};

export type InkboxHostedMcpConnectionView = {
	id?: string | null;
	agent_identity_id?: string | null;
	label?: string | null;
	url?: string | null;
	transport?: string | null;
	auth?: InkboxHostedMcpAuthView | null;
	enabled?: boolean | null;
	allowed_tools?: Array<string> | null;
	context?: InkboxMcpContextSelections | null;
	config_version?: number | null;
	preparation_status?: string | null;
	health_code?: string | null;
	capabilities?: Record<string, boolean> | null;
	catalog_version?: string | null;
	catalog_fetched_at?: string | null;
};

export type InkboxHostedMcpOAuthAuthorization = {
	id?: string | null;
	connection_id?: string | null;
	agent_identity_id?: string | null;
	status?: string | null;
	expires_at?: string | null;
	connect_url?: string | null;
	config_version?: number | null;
	requested_scopes?: Array<string> | null;
	error_code?: string | null;
};

export type InkboxHostedMcpTestResult = {
	success?: boolean | null;
	code?: string | null;
	config_version?: number | null;
};

export type InkboxHostedVoiceProvider = string;

export type InkboxHostingDeliveriesView = {
	items?: Array<InkboxHostingDeliveryView> | null;
	next_before?: string | null;
};

export type InkboxHostingDeliveryRetry = {
	queued?: boolean | null;
};

export type InkboxHostingDeliveryView = {
	id?: string | null;
	event?: string | null;
	state?: string | null;
	attempts?: number | null;
	received_at?: string | null;
	last_error?: string | null;
	retryable?: boolean | null;
};

export type InkboxHostingQuotaBlocker = {
	resource?: string | null;
	usage?: number | null;
	limit?: number | null;
};

export type InkboxHostingView = {
	mode?: string | null;
	identity_id?: string | null;
	machine_id?: string | null;
	harness?: string | null;
	tier?: string | null;
	/** Initial shape preference; workspace.computer.shape_id reports the current allocation. */
	shape_id?: string | null;
	state?: string | null;
	generation?: number | null;
	applied_generation?: number | null;
	default_model?: string | null;
	instructions?: string | null;
	trigger_events?: Array<string> | null;
	default_trigger_events?: Array<string> | null;
	/** Derived equality with default_trigger_events; retained for older clients. */
	follow_defaults?: boolean | null;
	credential_binding_id?: string | null;
	idle_stop_enabled?: boolean | null;
	idle_timeout_seconds?: number | null;
	last_error?: string | null;
	quota_blocker?: InkboxHostingQuotaBlocker | null;
	updated_at?: string | null;
	/** The hosted agent's address, e.g. https://{handle}.inkbox.sh. */
	url?: string | null;
	/** How Inkbox events reach the agent: internally, or over the identity's tunnel. */
	delivery?: string | null;
};

export type InkboxHumanState = string;

export type InkboxIMessageAssignmentResponse = {
	id?: string | null;
	remote_number?: string | null;
	agent_identity_id?: string | null;
	organization_id?: string | null;
	status?: InkboxIMessageAssignmentStatus | null;
	released_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageAssignmentStatus = string;

export type InkboxIMessageContactRuleResponse = {
	contact?: InkboxContactResponse | null;
	id?: string | null;
	agent_identity_id?: string | null;
	direction?: InkboxRuleDirection | null;
	action?: InkboxIMessageRuleAction | null;
	match_type?: InkboxIMessageRuleMatchType | null;
	match_target?: string | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageConversationResponse = {
	id?: string | null;
	assignment_id?: string | null;
	assignment_status?: InkboxIMessageAssignmentStatus | null;
	remote_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	group_creation_status?: InkboxIMessageGroupCreationStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageConversationSummary = {
	id?: string | null;
	assignment_id?: string | null;
	assignment_status?: InkboxIMessageAssignmentStatus | null;
	remote_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	group_creation_status?: InkboxIMessageGroupCreationStatus | null;
	latest_text?: string | null;
	latest_message_at?: string | null;
	latest_direction?: InkboxIMessageDirection | null;
	latest_has_media?: boolean | null;
	unread_count?: number | null;
	total_count?: number | null;
};

export type InkboxIMessageCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	conversation_id?: string | null;
	remote_handle?: string | null;
	sender_handle?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	service?: string | null;
	text?: string | null;
	media?: InkboxCorrespondenceMediaMetadata | null;
};

export type InkboxIMessageDedicatedNumberResponse = {
	id?: string | null;
	number?: string | null;
	type?: string | null;
	line_role?: string | null;
	status?: string | null;
	/** Deprecated compatibility field; dedicated lines can initiate. */
	inbound_only?: boolean | null;
	agent_identity_id?: string | null;
	agent_handle?: string | null;
};

export type InkboxIMessageDirection = string;

export type InkboxIMessageGroupCreationStatus = string;

export type InkboxIMessageGroupSendCommandResponse = {
	message_id?: string | null;
	conversation_id?: string | null;
	recipients?: Array<string> | null;
	is_group?: boolean | null;
	group_creation_status?: string | null;
	status?: string | null;
};

export type InkboxIMessageMediaItem = {
	transcription?: InkboxAttachmentTranscription | null;
	id?: string | null;
	content_type?: string | null;
	size?: number | null;
	url?: string | null;
};

export type InkboxIMessageMessageReaction = {
	id?: string | null;
	direction?: InkboxIMessageDirection | null;
	reaction?: InkboxIMessageReactionType | null;
	custom_emoji?: string | null;
	remote_number?: string | null;
	part_index?: number | null;
	created_at?: string | null;
};

export type InkboxIMessageMessageResponse = {
	provider_message_handle?: string | null;
	id?: string | null;
	conversation_id?: string | null;
	assignment_id?: string | null;
	/** Visible native reply target, when resolved. Null does not prove the message is not a reply. */
	reply_to_message_id?: string | null;
	/** Thread identifier when resolved, including standalone messages; does not imply replies exist. */
	thread_id?: string | null;
	/** Visible thread root when resolved; a standalone message is its own root. */
	thread_root_message_id?: string | null;
	direction?: InkboxIMessageDirection | null;
	remote_number?: string | null;
	sender_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	content?: string | null;
	message_type?: InkboxIMessageType | null;
	service?: InkboxIMessageService | null;
	send_style?: InkboxIMessageSendStyle | null;
	media?: Array<InkboxIMessageMediaItem> | null;
	was_downgraded?: boolean | null;
	status?: InkboxIMessageStatus | null;
	error_code?: string | null;
	error_message?: string | null;
	error_reason?: string | null;
	error_detail?: string | null;
	is_read?: boolean | null;
	is_blocked?: boolean | null;
	recipients?: Array<InkboxIMessageRecipientResponse> | null;
	reactions?: Array<InkboxIMessageMessageReaction> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageNumberStatus = string;

export type InkboxIMessageReactionCommandResponse = {
	reaction_id?: string | null;
	message_id?: string | null;
	reaction?: string | null;
	/** Resolved message ID to read for this reaction. May be absent on older replayed results. */
	target_message_id?: string | null;
	/** Resolved multipart index. May be absent on older replayed results. */
	part_index?: number | null;
};

export type InkboxIMessageReactionResponse = {
	provider_message_handle?: string | null;
	id?: string | null;
	conversation_id?: string | null;
	assignment_id?: string | null;
	target_message_id?: string | null;
	direction?: InkboxIMessageDirection | null;
	reaction?: InkboxIMessageReactionType | null;
	custom_emoji?: string | null;
	remote_number?: string | null;
	part_index?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageReactionType = string;

export type InkboxIMessageReadCommandResponse = {
	conversation_id?: string | null;
	recipient?: string | null;
	updated_count?: number | null;
};

export type InkboxIMessageRecipientResponse = {
	remote_number?: string | null;
	delivery_status?: InkboxIMessageStatus | null;
	service?: InkboxIMessageService | null;
	error_code?: string | null;
	error_message?: string | null;
	error_reason?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
};

export type InkboxIMessageRouterConfigResponse = {
	vcard_display_name?: string | null;
	vcard_company_name?: string | null;
	vcard_email_address?: string | null;
	vcard_note?: string | null;
	contact_sharing_enabled?: boolean | null;
	welcome_message?: string | null;
	help_message?: string | null;
	send_first_contact_onboarding_on_connect?: boolean | null;
	include_agent_email_in_contact_card?: boolean | null;
	include_agent_note_in_contact_card?: boolean | null;
	connect_reply_template?: string | null;
	reconnect_reply_template?: string | null;
	has_custom_avatar?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageRouterConversationPage = {
	items?: Array<InkboxIMessageRouterConversationSummary> | null;
	next_cursor?: string | null;
};

export type InkboxIMessageRouterConversationResponse = {
	id?: string | null;
	local_number?: string | null;
	remote_number?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageRouterConversationSummary = {
	id?: string | null;
	local_number?: string | null;
	remote_number?: string | null;
	latest_text?: string | null;
	latest_direction?: InkboxIMessageDirection | null;
	latest_message_at?: string | null;
	total_count?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIMessageRouterLineResponse = {
	id?: string | null;
	number?: string | null;
	status?: InkboxIMessageNumberStatus | null;
};

export type InkboxIMessageRouterMessagePage = {
	items?: Array<InkboxIMessageRouterMessageResponse> | null;
	next_cursor?: string | null;
};

export type InkboxIMessageRouterMessageResponse = {
	id?: string | null;
	conversation_id?: string | null;
	direction?: InkboxIMessageDirection | null;
	content?: string | null;
	created_at?: string | null;
};

export type InkboxIMessageRouterResponse = {
	line?: InkboxIMessageRouterLineResponse | null;
	config?: InkboxIMessageRouterConfigResponse | null;
};

export type InkboxIMessageRuleAction = string;

export type InkboxIMessageRuleMatchType = string;

export type InkboxIMessageSendCommandResponse = {
	message_id?: string | null;
	conversation_id?: string | null;
	recipient?: string | null;
	status?: string | null;
};

export type InkboxIMessageSendStyle = string;

export type InkboxIMessageService = string;

export type InkboxIMessageStatus = string;

export type InkboxIMessageThreadResponse = {
	conversation_id?: string | null;
	thread_id?: string | null;
	thread_root_message_id?: string | null;
	messages?: Array<InkboxIMessageMessageResponse> | null;
	next_cursor?: string | null;
};

export type InkboxIMessageTranscriptionData = {
	message?: InkboxWebhookIMessageMessage | null;
	reaction?: InkboxIMessageReactionResponse | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
	channel?: string | null;
	message_id?: string | null;
};

export type InkboxIMessageTriageNumberResponse = {
	number?: string | null;
	connect_command?: string | null;
	sms_link?: string | null;
	connect_qr_png_data_url?: string | null;
};

export type InkboxIMessageType = string;

export type InkboxIMessageWebhookData = {
	message?: InkboxWebhookIMessageMessage | null;
	reaction?: InkboxIMessageReactionResponse | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
};

export type InkboxIMessageWebhookEventType = string;

export type InkboxIMessageWebhookPayload = {
	/** Stable per-event id (evt_...); idempotency key, stable across replays. */
	id?: string | null;
	/** The type of iMessage event that triggered this webhook. */
	event_type?: InkboxIMessageWebhookEventType | null;
	/** ISO 8601 timestamp of when the event occurred. */
	timestamp?: string | null;
	data?: InkboxIMessageWebhookData | null;
	companion?: InkboxCompanionWebhookMetadata | null;
};

export type InkboxIdentityAvatarChangeResponse = {
	identity_id?: string | null;
	agent_handle?: string | null;
	has_avatar?: boolean | null;
	sha256?: string | null;
};

export type InkboxIdentityAvatarMetadataResponse = {
	agent_handle?: string | null;
	has_avatar?: boolean | null;
	content_type?: string | null;
	authorized_url?: string | null;
	expires_at?: string | null;
};

export type InkboxIdentityChannelCountResponse = {
	/** Usage channel key (UsageEventType). */
	event_type?: string | null;
	/** This identity's usage on the channel this cycle. */
	count?: number | null;
	/** For SMS channels: portion of 'count' carried on the org's own 10DLC campaign. None on non-SMS channels. */
	own_campaign_count?: number | null;
};

export type InkboxIdentityChannelStatusResponse = {
	agent_handle?: string | null;
	email?: InkboxIdentityEmailChannelResponse | null;
	sending_domain?: InkboxIdentitySendingDomainStatusResponse | null;
	phone?: InkboxIdentityPhoneChannelResponse | null;
	imessage?: InkboxIdentityIMessageChannelResponse | null;
	whatsapp?: InkboxWhatsAppChannelResponse | null;
	calling_available?: boolean | null;
	sms_available?: boolean | null;
};

export type InkboxIdentityDomainAffiliationResponse = {
	domain_claim_id?: string | null;
	domain?: string | null;
	affiliation?: InkboxDomainAffiliationAssertion | null;
};

export type InkboxIdentityEmailChannelResponse = {
	assigned?: boolean | null;
	address?: string | null;
	status?: string | null;
};

export type InkboxIdentityIMessageAwaitingInboundResponse = {
	remote_number?: string | null;
	connected_at?: string | null;
};

export type InkboxIdentityIMessageChannelResponse = {
	enabled?: boolean | null;
	dedicated_number?: string | null;
	status?: string | null;
	awaiting_inbound?: Array<InkboxIdentityIMessageAwaitingInboundResponse> | null;
};

export type InkboxIdentityPackAgreement = {
	id?: string | null;
	code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	currency?: string | null;
	status?: string | null;
	paid_through?: string | null;
	cancel_at_period_end?: boolean | null;
	change_pending?: boolean | null;
	renewal_processing?: boolean | null;
	payment_url?: string | null;
	can_cancel?: boolean | null;
	can_resume?: boolean | null;
	created_at?: string | null;
};

export type InkboxIdentityPackCapacity = {
	used?: number | null;
	baseline?: number | null;
	paid_slots?: number | null;
	processing_slots?: number | null;
	total?: number | null;
	renewing_packs?: number | null;
	paid_packs?: number | null;
};

export type InkboxIdentityPackMutationResponse = {
	agreement_id?: string | null;
	status?: string | null;
	payment_url?: string | null;
};

export type InkboxIdentityPackOffer = {
	code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	currency?: string | null;
	identity_slots?: number | null;
};

export type InkboxIdentityPackQuote = {
	code?: string | null;
	name?: string | null;
	monthly_amount?: string | null;
	currency?: string | null;
	identity_slots?: number | null;
	quote?: string | null;
	expires_at?: number | null;
	amount_due_cents?: number | null;
	invoice_total_cents?: number | null;
	pack_amount_cents?: number | null;
	renewal_at?: number | null;
	payment_mode?: string | null;
	payment_method_available?: boolean | null;
};

export type InkboxIdentityPacksResponse = {
	offer?: InkboxIdentityPackOffer | null;
	agreements?: Array<InkboxIdentityPackAgreement> | null;
	capacity?: InkboxIdentityPackCapacity | null;
	mail_storage_bytes_per_identity?: number | null;
	billing_account_available?: boolean | null;
	payment_method_available?: boolean | null;
	eligible?: boolean | null;
	eligibility_reason?: string | null;
	next_cursor?: string | null;
};

export type InkboxIdentityPhoneChannelResponse = {
	assigned?: boolean | null;
	id?: string | null;
	number?: string | null;
	status?: string | null;
	sms_status?: string | null;
};

export type InkboxIdentitySendingDomainStatusResponse = {
	kind?: string | null;
	domain?: string | null;
	status?: string | null;
};

export type InkboxIdentityUsageResponse = {
	/** Agent identity id, or None for the 'Unattributed' bucket (usage with no originating identity, e.g. outbound email). */
	identity_id?: string | null;
	/** Agent handle, if the identity is known. */
	handle?: string | null;
	/** Identity display name, if set. */
	display_name?: string | null;
	/** Per-channel usage counts for this identity. */
	channels?: Array<InkboxIdentityChannelCountResponse> | null;
	/** Combined in+out SMS drawn against this identity's allowance this cycle. None when the identity used no SMS. */
	sms_used?: number | null;
	/** Included SMS allowance for the identity. */
	sms_limit?: number | null;
	/** Combined in+out call seconds drawn this cycle. None when unused. */
	voice_sec_used?: number | null;
	/** Included voice allowance for the identity, in seconds. */
	voice_sec_limit?: number | null;
};

export type InkboxInboundEventDetail = {
	id?: string | null;
	source_id?: string | null;
	received_at?: string | null;
	status?: string | null;
	attempts?: number | null;
	last_error?: string | null;
	signature_verified?: boolean | null;
	content_type?: string | null;
	size_bytes?: number | null;
	request?: InkboxInboundRequest | null;
};

export type InkboxInboundEventPage = {
	events?: Array<InkboxInboundEventView> | null;
	next_cursor?: string | null;
};

export type InkboxInboundEventView = {
	id?: string | null;
	source_id?: string | null;
	received_at?: string | null;
	status?: string | null;
	attempts?: number | null;
	last_error?: string | null;
	signature_verified?: boolean | null;
	content_type?: string | null;
	size_bytes?: number | null;
};

export type InkboxInboundRequest = {
	method?: string | null;
	query?: Record<string, string> | null;
	headers?: Record<string, string> | null;
	content_type?: string | null;
	body?: string | null;
	body_encoding?: string | null;
};

export type InkboxInboundSignatureView = {
	/** ``base64`` decodes the secret first, ignoring a leading ``whsec_``. */
	secret_encoding?: string | null;
	/** Header holding the signature. */
	header?: string | null;
	/** ``whole``: the header value is the signature. ``prefix``: the value after ``format_value``. ``list``: every item under key ``format_value`` in a list like ``t=1,v1=ab`` or ``v1,ab v1,cd``. */
	format?: string | null;
	/** The prefix or list key. */
	format_value?: string | null;
	algorithm?: string | null;
	encoding?: string | null;
	/** What was signed: ``{body}`` plus optional ``{timestamp}``, ``{header:Name}`` and fixed text, for example ``{timestamp}.{body}``. */
	signed_content?: string | null;
	/** ``header``: the header named ``timestamp_value``. ``list``: key ``timestamp_value`` in the signature header list. */
	timestamp_from?: string | null;
	timestamp_value?: string | null;
	/** Reject requests whose Unix timestamp is further than this from now. */
	max_age_seconds?: number | null;
};

export type InkboxInboundSourceList = {
	sources?: Array<InkboxInboundSourceView> | null;
};

export type InkboxInboundSourceView = {
	id?: string | null;
	name?: string | null;
	/** Give this URL to the sender. Anyone with it can post events. */
	url?: string | null;
	signature?: InkboxInboundSignatureView | null;
	handler?: (InkboxAgentHandler | InkboxScriptHandler) | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxIncomingCallAction = string;

export type InkboxIncomingCallActionResponse = {
	agent_identity_id?: string | null;
	incoming_call_action?: InkboxIncomingCallAction | null;
	client_websocket_url?: string | null;
	incoming_call_webhook_url?: string | null;
	forwarding_target_type?: InkboxForwardingTargetType | null;
	forwarding_phone_number?: string | null;
	forwarding_sip_uri?: string | null;
};

export type InkboxInteractionData = {
	id?: string | null;
	revision?: number | null;
	created_sequence?: number | null;
	turn_id?: string | null;
	resource_type?: string | null;
	auto_approve?: boolean | null;
	decision?: string | null;
	kind?: string | null;
	version?: number | null;
	status?: string | null;
	expires_at?: string | null;
	title?: string | null;
	detail?: string | null;
	effective_scope?: string | null;
	tool_call_id?: string | null;
	decisions?: Array<string> | null;
	fields?: Array<InkboxQuestionField> | null;
};

export type InkboxInteractionReceipt = {
	id?: string | null;
	version?: number | null;
	status?: string | null;
};

export type InkboxLapsedSubscriptionResponse = {
	/** Tier the lapsed subscription is for. */
	plan?: InkboxPlan | null;
	/** The custom plan's name, else the tier name. */
	display_name?: string | null;
	/** Why the subscription lapsed: unpaid invoices, an incomplete first payment, or a pause. */
	status?: string | null;
	/** Flat recurring plan fee in cents per plan_amount_interval; None when the subscription has no fixed price. */
	plan_amount_cents?: number | null;
	/** Renewal cadence plan_amount_cents is charged at ('month' or 'year'). */
	plan_amount_interval?: InkboxBillingInterval | null;
};

export type InkboxLineCapacity = {
	/** VoIP line slots added to the phone number limit. */
	voip?: number | null;
	/** Dedicated iMessage line slots added to the iMessage line limits. */
	imessage?: number | null;
};

export type InkboxListTunnelsResponse = {
	tunnels?: Array<InkboxTunnelResponse> | null;
};

export type InkboxListWebhookCatalogResponse = {
	supports_identity_subscriptions?: boolean | null;
	events?: Array<InkboxWebhookCatalogRow> | null;
	example_signature_headers?: string | null;
};

export type InkboxListWebhookDeliveriesResponse = {
	deliveries?: Array<InkboxWebhookDeliveryResponse> | null;
};

export type InkboxListWebhookSubscriptionsResponse = {
	subscriptions?: Array<InkboxWebhookSubscriptionResponse> | null;
};

export type InkboxMailBodyState = string;

export type InkboxMailIdentityContactRuleResponse = {
	contact?: InkboxContactResponse | null;
	id?: string | null;
	agent_identity_id?: string | null;
	direction?: InkboxRuleDirection | null;
	action?: InkboxMailRuleAction | null;
	match_type?: InkboxMailRuleMatchType | null;
	match_target?: string | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxMailImportFormat = string;

export type InkboxMailImportJobCreateResponse = {
	job?: InkboxMailImportJobResponse | null;
	upload?: InkboxMailImportUploadTarget | null;
};

export type InkboxMailImportJobResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	status?: InkboxMailImportJobStatus | null;
	source_format?: InkboxMailImportFormat | null;
	original_addresses?: Array<string> | null;
	mark_as_read?: boolean | null;
	upload_size_bytes?: number | null;
	messages_processed?: number | null;
	messages_imported?: number | null;
	messages_skipped_duplicate?: number | null;
	messages_failed?: number | null;
	messages_rejected_unsafe?: number | null;
	error_detail?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	started_at?: string | null;
	finished_at?: string | null;
};

export type InkboxMailImportJobStatus = string;

export type InkboxMailImportUploadTarget = {
	url?: string | null;
	fields?: Record<string, string> | null;
	expires_in_seconds?: number | null;
};

export type InkboxMailRuleAction = string;

export type InkboxMailRuleMatchType = string;

export type InkboxMailWebhookData = {
	message?: InkboxMailWebhookMessageData | null;
	contacts?: Array<InkboxWebhookMailContact> | null;
	agent_identities?: Array<InkboxWebhookMailAgentIdentity> | null;
};

export type InkboxMailWebhookEventType = string;

export type InkboxMailWebhookMessageData = {
	id?: string | null;
	mailbox_id?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	from_address?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	bcc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	email_address?: string | null;
	body?: string | null;
	body_state?: InkboxMailBodyState | null;
	body_truncated?: boolean | null;
	body_total_chars?: number | null;
	body_included_chars?: number | null;
	direction?: InkboxMessageDirection | null;
	status?: InkboxMessageStatus | null;
	has_attachments?: boolean | null;
	created_at?: string | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
};

export type InkboxMailWebhookPayload = {
	/** Stable per-event id (evt_...); idempotency key, stable across replays. */
	id?: string | null;
	/** The type of mail event that triggered this webhook. */
	event_type?: InkboxMailWebhookEventType | null;
	/** ISO 8601 timestamp of when the event occurred. */
	timestamp?: string | null;
	data?: InkboxMailWebhookData | null;
	companion?: InkboxCompanionWebhookMetadata | null;
};

export type InkboxMailboxResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	id?: string | null;
	email_address?: string | null;
	status?: InkboxResourceStatus | null;
	/** Bare domain the mailbox sends from, derived from email_address. Matches the platform default (inkboxmail.com) or the customer's verified custom domain. */
	sending_domain?: string | null;
	filter_mode?: InkboxFilterMode | null;
	inbound_filter_mode?: InkboxFilterMode | null;
	outbound_filter_mode?: InkboxFilterMode | null;
	/** ID of the agent identity that owns this mailbox, or null on tombstones / system mailboxes. */
	agent_identity_id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Live storage used by this inbox, in bytes. */
	storage_used_bytes?: number | null;
	/** Resolved plan-tiered storage cap in bytes; null when the route did not resolve it (the ORM does not carry the cap). */
	storage_limit_bytes?: number | null;
	signature_html?: string | null;
	signature_text?: string | null;
	signature_enabled?: boolean | null;
	filter_mode_change_notice?: InkboxFilterModeChangeNotice | null;
	unread_count?: number | null;
};

export type InkboxMarkIMessageReadResponse = {
	conversation_id?: string | null;
	updated_count?: number | null;
};

export type InkboxMarkWhatsAppReadResponse = {
	conversation_id?: string | null;
	updated_count?: number | null;
	/** True when WhatsApp read receipts were sent for the marked messages. False when there was nothing to acknowledge, the conversation is a group, or this number does not support read receipts yet; local read state is updated either way. */
	read_receipts_sent?: boolean | null;
};

export type InkboxMcpContextSelections = {
	mode?: string | null;
	prompts?: Array<InkboxMcpPromptSelection> | null;
	resources?: Array<string> | null;
	skills?: Array<InkboxMcpSkillSelection> | null;
};

export type InkboxMcpPromptSelection = {
	name?: string | null;
	arguments?: Record<string, string> | null;
};

export type InkboxMcpSkillSelection = {
	uri?: string | null;
	manifest_digest?: string | null;
};

export type InkboxMessageData = {
	id?: string | null;
	revision?: number | null;
	created_sequence?: number | null;
	turn_id?: string | null;
	resource_type?: string | null;
	phase?: string | null;
	role?: string | null;
	content?: Array<InkboxOutputText | InkboxFileContent> | null;
	completed?: boolean | null;
};

export type InkboxMessageDetailResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	from_address?: string | null;
	from_display_name?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	direction?: InkboxMessageDirection | null;
	status?: InkboxMessageStatus | null;
	is_read?: boolean | null;
	is_starred?: boolean | null;
	has_attachments?: boolean | null;
	reply_to?: string | null;
	first_opened_at?: string | null;
	open_count?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	sending_domain_warning?: string | null;
	import_job_id?: string | null;
	body_text?: string | null;
	body_html?: string | null;
	bcc_addresses?: Array<string> | null;
	in_reply_to?: string | null;
	references?: Array<string> | null;
	attachment_metadata?: Array<Record<string, InkboxJsonValue>> | null;
	ses_message_id?: string | null;
	reply_all_recipients?: InkboxReplyAllRecipients | null;
};

export type InkboxMessageDirection = string;

export type InkboxMessageResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	from_address?: string | null;
	from_display_name?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	direction?: InkboxMessageDirection | null;
	status?: InkboxMessageStatus | null;
	is_read?: boolean | null;
	is_starred?: boolean | null;
	has_attachments?: boolean | null;
	reply_to?: string | null;
	first_opened_at?: string | null;
	open_count?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	sending_domain_warning?: string | null;
	import_job_id?: string | null;
};

export type InkboxMessageSendLookup = {
	message_id?: string | null;
};

export type InkboxMessageStatus = string;

export type InkboxMessageTranscriptionEventType = string;

export type InkboxMessageTranscriptionWebhookPayload = {
	id?: string | null;
	event_type?: InkboxMessageTranscriptionEventType | null;
	timestamp?: string | null;
	data?:
		| (
				| InkboxTextTranscriptionData
				| InkboxIMessageTranscriptionData
				| InkboxWhatsAppTranscriptionData
				| InkboxSlackTranscriptionData
		  )
		| null;
};

export type InkboxMessagingCapability = string;

export type InkboxNoteAccessResponse = {
	id?: string | null;
	note_id?: string | null;
	identity_id?: string | null;
	created_at?: string | null;
};

export type InkboxNoteResponse = {
	id?: string | null;
	organization_id?: string | null;
	created_by?: string | null;
	title?: string | null;
	body?: string | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Raw ``note_access`` rows for this note, inlined so the console can skip a follow-up ``GET /notes/{id}/access`` per row. Empty when the note has zero grants (typical for human-authored notes); not a 'not loaded' sentinel — every response path populates this field. */
	access?: Array<InkboxNoteAccessResponse> | null;
};

export type InkboxNumberList = {
	numbers?: Array<InkboxNumberView> | null;
	has_more?: boolean | null;
};

export type InkboxNumberType = string;

export type InkboxNumberView = {
	id?: string | null;
	number?: string | null;
	agent_identity_id?: string | null;
	revision?: number | null;
	state?: string | null;
	binding_state?: string | null;
	assignable?: boolean | null;
	unavailable_reason?: string | null;
};

export type InkboxObjectCreatorType = string;

export type InkboxOnVoicemail = string;

export type InkboxOperation = {
	id?: string | null;
	machine_id?: string | null;
	kind?: string | null;
	state?: string | null;
	error_code?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxOperationReceipt = {
	operation_id?: string | null;
};

export type InkboxOptInEvidenceUploadResponse = {
	url?: string | null;
};

export type InkboxOrganizationDomainPage = {
	items?: Array<InkboxOrganizationDomainResponse> | null;
	next_cursor?: string | null;
};

export type InkboxOrganizationDomainResponse = {
	id?: string | null;
	domain?: string | null;
	state?: InkboxDomainClaimState | null;
	dns_record?: InkboxDomainTxtRecord | null;
	verified_at?: string | null;
	last_checked_at?: string | null;
	last_success_at?: string | null;
	valid_until?: string | null;
	pending_expires_at?: string | null;
	next_check_at?: string | null;
	last_check_result?: string | null;
	ownership_conflict?: boolean | null;
	recovery_action?: string | null;
	created_at?: string | null;
};

export type InkboxOutputText = {
	type?: string | null;
	text?: string | null;
};

export type InkboxPhoneCallConnectionResponse = {
	id?: string | null;
	kind?: InkboxCallConnectionKind | null;
	trigger?: InkboxCallConnectionTrigger | null;
	status?: InkboxCallConnectionStatus | null;
	target_type?: InkboxForwardingTargetType | null;
	target?: string | null;
	requested_at?: string | null;
	dialing_at?: string | null;
	connected_at?: string | null;
	ended_at?: string | null;
	failure_code?: string | null;
};

export type InkboxPhoneCallEndedWebhookData = {
	call?: InkboxWebhookPhoneCall | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
	transcript?: InkboxWebhookCallTranscript | null;
	transcript_url?: string | null;
	outcome?: InkboxCallOutcome | null;
	post_call_action_items?: Array<InkboxWebhookPostCallAction> | null;
};

export type InkboxPhoneCallEndedWebhookPayload = {
	/** Stable per-event id (evt_...); idempotency key, stable across replays. */
	id?: string | null;
	/** The type of call-lifecycle event that triggered this webhook. */
	event_type?: InkboxPhoneCallLifecycleWebhookEventType | null;
	/** ISO 8601 timestamp of when the event occurred. */
	timestamp?: string | null;
	data?: InkboxPhoneCallEndedWebhookData | null;
};

export type InkboxPhoneCallForwardingResponse = {
	id?: string | null;
	trigger?: string | null;
	status?: InkboxCallForwardingStatus | null;
	target_type?: InkboxForwardingTargetType | null;
	target?: string | null;
	requested_at?: string | null;
	dialing_at?: string | null;
	forwarded_at?: string | null;
	ended_at?: string | null;
	failure_code?: string | null;
};

export type InkboxPhoneCallLifecycleWebhookEventType = string;

export type InkboxPhoneCallResponse = {
	id?: string | null;
	origin?: InkboxCallOrigin | null;
	local_phone_number?: string | null;
	remote_phone_number?: string | null;
	direction?: InkboxCallDirection | null;
	status?: InkboxCallStatus | null;
	client_websocket_url?: string | null;
	mode?: InkboxCallMode | null;
	hosted_agent_authority_mode?: InkboxHostedAgentAuthorityMode | null;
	voicemail_detection?: InkboxVoicemailDetection | null;
	on_voicemail?: InkboxOnVoicemail | null;
	reason?: string | null;
	post_call_action_items?: Array<InkboxPostCallActionResponse> | null;
	connections?: Array<InkboxPhoneCallConnectionResponse> | null;
	forwardings?: Array<InkboxPhoneCallForwardingResponse> | null;
	use_inkbox_tts?: boolean | null;
	use_inkbox_stt?: boolean | null;
	hangup_reason?: InkboxHangupReason | null;
	ended_by?: InkboxEndedBy | null;
	provider_hangup_cause?: string | null;
	started_at?: string | null;
	ended_at?: string | null;
	is_blocked?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxPhoneCallWithRateLimitResponse = {
	id?: string | null;
	origin?: InkboxCallOrigin | null;
	local_phone_number?: string | null;
	remote_phone_number?: string | null;
	direction?: InkboxCallDirection | null;
	status?: InkboxCallStatus | null;
	client_websocket_url?: string | null;
	mode?: InkboxCallMode | null;
	hosted_agent_authority_mode?: InkboxHostedAgentAuthorityMode | null;
	voicemail_detection?: InkboxVoicemailDetection | null;
	on_voicemail?: InkboxOnVoicemail | null;
	reason?: string | null;
	post_call_action_items?: Array<InkboxPostCallActionResponse> | null;
	connections?: Array<InkboxPhoneCallConnectionResponse> | null;
	forwardings?: Array<InkboxPhoneCallForwardingResponse> | null;
	use_inkbox_tts?: boolean | null;
	use_inkbox_stt?: boolean | null;
	hangup_reason?: InkboxHangupReason | null;
	ended_by?: InkboxEndedBy | null;
	provider_hangup_cause?: string | null;
	started_at?: string | null;
	ended_at?: string | null;
	is_blocked?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	rate_limit?: InkboxRateLimitInfo | null;
};

export type InkboxPhoneIdentityContactRuleResponse = {
	contact?: InkboxContactResponse | null;
	id?: string | null;
	agent_identity_id?: string | null;
	direction?: InkboxRuleDirection | null;
	action?: InkboxPhoneRuleAction | null;
	match_type?: InkboxPhoneRuleMatchType | null;
	match_target?: string | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxPhoneNumberResponse = {
	notices?: Array<InkboxResponseNotice> | null;
	id?: string | null;
	number?: string | null;
	type?: InkboxNumberType | null;
	status?: InkboxPhoneNumberStatus | null;
	sms_status?: InkboxSmsStatus | null;
	sms_error_code?: string | null;
	sms_error_detail?: string | null;
	sms_ready_at?: string | null;
	incoming_call_action?: InkboxIncomingCallAction | null;
	client_websocket_url?: string | null;
	incoming_call_webhook_url?: string | null;
	forwarding_target_type?: InkboxForwardingTargetType | null;
	forwarding_phone_number?: string | null;
	forwarding_sip_uri?: string | null;
	filter_mode?: InkboxFilterMode | null;
	inbound_filter_mode?: InkboxFilterMode | null;
	outbound_filter_mode?: InkboxFilterMode | null;
	/** ISO 3166-1 alpha-2 country code (e.g. 'US' or 'GB'). */
	country?: string | null;
	/** 2-letter US state abbreviation for LOCAL numbers (e.g. 'NY'). Null when unknown or not applicable, including numbers without a US state. */
	state?: string | null;
	/** ID of the agent identity that owns this phone number, or null if the number is standalone (not tied to any agent). */
	agent_identity_id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	filter_mode_change_notice?: InkboxFilterModeChangeNotice | null;
};

export type InkboxPhoneNumberStatus = string;

export type InkboxPhoneRuleAction = string;

export type InkboxPhoneRuleMatchType = string;

export type InkboxPhoneTextWebhookData = {
	text_message?: InkboxWebhookTextMessage | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
	recipient_phone_number?: string | null;
};

export type InkboxPhoneTextWebhookEventType = string;

export type InkboxPhoneTextWebhookPayload = {
	/** Stable per-event id (evt_...); idempotency key, stable across replays. */
	id?: string | null;
	/** The type of text event that triggered this webhook. */
	event_type?: InkboxPhoneTextWebhookEventType | null;
	/** ISO 8601 timestamp of when the event occurred. */
	timestamp?: string | null;
	data?: InkboxPhoneTextWebhookData | null;
	companion?: InkboxCompanionWebhookMetadata | null;
};

export type InkboxPhoneTranscriptResponse = {
	id?: string | null;
	call_id?: string | null;
	seq?: number | null;
	ts_ms?: number | null;
	party?: InkboxTranscriptParty | null;
	text?: string | null;
	phone_number?: string | null;
	created_at?: string | null;
};

export type InkboxPlan = string;

export type InkboxPortalSessionResponse = {
	/** Stripe billing portal session URL. */
	url?: string | null;
};

export type InkboxPostCallActionResponse = {
	id?: string | null;
	seq?: number | null;
	action?: string | null;
	details?: string | null;
	status?: InkboxPostCallActionStatus | null;
};

export type InkboxPostCallActionStatus = string;

export type InkboxPricingResponse = {
	prices?: Array<InkboxCatalogRateResponse> | null;
};

export type InkboxQuestionField = {
	id?: string | null;
	label?: string | null;
	required?: boolean | null;
	type?: string | null;
	choices?: Array<InkboxChoice> | null;
	allow_free_text?: boolean | null;
};

export type InkboxRateLimitInfo = {
	calls_used?: number | null;
	calls_remaining?: number | null;
	calls_limit?: number | null;
	minutes_used?: number | null;
	minutes_remaining?: number | null;
	minutes_limit?: number | null;
};

export type InkboxRecipientResponse = {
	recipient_phone_number?: string | null;
	delivery_status?: InkboxSmsDeliveryStatus | null;
	carrier?: string | null;
	line_type?: string | null;
	error_code?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
};

export type InkboxRecurringItemResponse = {
	/** Product name, as it appears on invoices. */
	name?: string | null;
	/** Units billed each interval. */
	quantity?: number | null;
	/** Unit price × quantity in cents per interval; None when the price has no fixed unit amount. */
	amount_cents?: number | null;
	/** Renewal cadence amount_cents is charged at ('month' or 'year'). */
	interval?: InkboxBillingInterval | null;
};

export type InkboxRegistryFailureReason = {
	fields?: Array<string> | null;
	description?: string | null;
};

export type InkboxReplyAllRecipients = {
	to?: Array<string> | null;
	cc?: Array<string> | null;
};

export type InkboxResizeReceipt = {
	operation_id?: string | null;
	version?: number | null;
	snapshot_id?: string | null;
};

export type InkboxResourceStatus = string;

export type InkboxResponseNotice = {
	code?: string | null;
	level?: string | null;
	message?: string | null;
};

export type InkboxRotateDkimResponse = {
	domain?: InkboxDomainResponse | null;
	new_selector?: string | null;
	new_dkim_txt_value?: string | null;
};

export type InkboxRouterMessage = {
	id?: string | null;
	direction?: string | null;
	content?: string | null;
	status?: string | null;
	created_at?: string | null;
};

export type InkboxRouterMessages = {
	items?: Array<InkboxRouterMessage> | null;
	has_more?: boolean | null;
};

export type InkboxRouterResponse = {
	router?: InkboxRouterView | null;
};

export type InkboxRouterThread = {
	remote_number?: string | null;
	last_message_at?: string | null;
	latest_text?: string | null;
	message_count?: number | null;
};

export type InkboxRouterThreads = {
	items?: Array<InkboxRouterThread> | null;
	has_more?: boolean | null;
};

export type InkboxRouterView = {
	id?: string | null;
	number?: string | null;
	revision?: number | null;
	state?: string | null;
	profile_display_name?: string | null;
	accepting_new_connections?: boolean | null;
};

export type InkboxRuleDirection = string;

export type InkboxSafeMessageResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	thread_id?: string | null;
	message_id?: string | null;
	from_address?: string | null;
	from_display_name?: string | null;
	sender_contact_name?: string | null;
	reply_to?: string | null;
	to_addresses?: Array<string> | null;
	cc_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	direction?: InkboxMessageDirection | null;
	status?: InkboxMessageStatus | null;
	is_read?: boolean | null;
	is_starred?: boolean | null;
	has_attachments?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxSchedule = {
	controller_effective_state?: string | null;
	native_sync_status?: string | null;
	conversation_id?: string | null;
	id?: string | null;
	revision?: number | null;
	display?: Record<string, InkboxJsonValue> | null;
	timing?: Record<string, InkboxJsonValue> | null;
	timezone?: string | null;
	enabled?: boolean | null;
	registration_status?: string | null;
	registration_error?: string | null;
	next_run_at?: string | null;
	last_result?: InkboxScheduleOccurrence | null;
	allowed_actions?: Array<string> | null;
};

export type InkboxScheduleHistory = {
	items?: Array<InkboxScheduleOccurrence> | null;
	conversation_id?: string | null;
	history_completeness?: string | null;
};

export type InkboxScheduleOccurrence = {
	id?: string | null;
	intended_due_at?: string | null;
	started_at?: string | null;
	finished_at?: string | null;
	output_references?: Array<InkboxScheduleOutputReference> | null;
	state?: string | null;
	reason?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxScheduleOutputReference = {
	conversation_id?: string | null;
	message_id?: string | null;
	availability?: string | null;
};

export type InkboxSchedulePage = {
	items?: Array<InkboxSchedule> | null;
	next_cursor?: string | null;
	computer_state?: string | null;
	capabilities?: Record<string, InkboxJsonValue> | null;
};

export type InkboxSchedulePreviewResult = {
	timing?: InkboxScheduleTiming | null;
	next_occurrences?: Array<string> | null;
};

export type InkboxScheduleReceipt = {
	controller_effective_state?: string | null;
	native_sync_status?: string | null;
	command_id?: string | null;
	state?: string | null;
	registration_status?: string | null;
	schedule_id?: string | null;
	revision?: number | null;
	deleted?: boolean | null;
};

export type InkboxScheduleTiming = {
	kind?: string | null;
	timezone?: string | null;
	at?: string | null;
	seconds?: number | null;
	expression?: string | null;
};

export type InkboxScriptHandler = {
	type?: string | null;
	command?: string | null;
};

export type InkboxSendIMessageResponse = {
	message?: InkboxIMessageMessageResponse | null;
};

export type InkboxSendWhatsAppResponse = {
	message?: InkboxWhatsAppMessageResponse | null;
};

export type InkboxSendingDomainStatus = string;

export type InkboxSetDefaultResponse = {
	/** Bare domain name now serving as the org's default for new mailbox creations. ``None`` means no custom default is set and mailboxes fall back to the platform domain. */
	default_domain?: string | null;
};

export type InkboxSignCsrResponse = {
	cert_pem?: string | null;
	chain_pem?: string | null;
	cert_fingerprint_sha256?: string | null;
	cert_expires_at?: string | null;
};

export type InkboxSignatureCheckResult = {
	verified?: boolean | null;
	/** Why verification failed; null when it passed. */
	reason?: string | null;
};

export type InkboxSigningKeyCreateResponse = {
	/** Plaintext signing key (shown once — store it securely) */
	signing_key?: string | null;
	/** When the key was created (or rotated) */
	created_at?: string | null;
};

export type InkboxSigningKeyStatusResponse = {
	/** Whether the caller's organization has a signing key configured */
	configured?: boolean | null;
	/** When the key was created (or last rotated), if configured */
	created_at?: string | null;
};

export type InkboxSlackActionResponse = {
	id?: string | null;
	connection_id?: string | null;
	status?: string | null;
	conversation_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	error_code?: string | null;
	/** Immediate retry delay in seconds; null on stored outcomes. */
	retry_after?: number | null;
};

export type InkboxSlackActorProfile = {
	id?: string | null;
	name?: string | null;
	real_name?: string | null;
	is_bot?: boolean | null;
	is_app_user?: boolean | null;
	deleted?: boolean | null;
	team_id?: string | null;
	tz?: string | null;
	tz_label?: string | null;
	tz_offset?: number | null;
	profile?: InkboxSlackProfileFields | null;
};

export type InkboxSlackApplicationRemovalResponse = {
	operation_id?: string | null;
	status?: string | null;
	deletion_status?: string | null;
	deletion_error_code?: string | null;
};

export type InkboxSlackArchiveCoverageList = {
	coverage?: Array<InkboxSlackArchiveCoverageResponse> | null;
	next_cursor?: string | null;
};

export type InkboxSlackArchiveCoverageResponse = {
	conversation_id?: string | null;
	thread_ts?: string | null;
	status?: string | null;
	imported_count?: number | null;
	oldest_ts?: string | null;
	newest_ts?: string | null;
	error_code?: string | null;
	updated_at?: string | null;
	includes_all_threads?: boolean | null;
	/** Last observed membership callback, not current access authority. */
	access_revoked?: boolean | null;
};

export type InkboxSlackArchiveIncluded = {
	conversations?: Record<string, InkboxSlackCachedConversation> | null;
	actors?: Record<string, InkboxSlackCachedActor> | null;
	emoji?: Record<string, InkboxSlackCachedEmoji> | null;
	files?: Record<string, InkboxSlackCachedFile> | null;
};

export type InkboxSlackArchiveMessagesResponse = {
	messages?: Array<InkboxSlackArchivedMessageResponse> | null;
	next_cursor?: string | null;
	/** Oldest scanned position for a nonterminal chronological page, before access filtering. Not necessarily a visible message; null for search and exhausted pages. */
	page_boundary?: InkboxSlackArchivePageBoundary | null;
	source?: string | null;
	included?: InkboxSlackArchiveIncluded | null;
};

export type InkboxSlackArchivePageBoundary = {
	message_ts?: string | null;
	id?: string | null;
};

export type InkboxSlackArchiveSettingsResponse = {
	retention_days?: number | null;
	revision?: number | null;
};

export type InkboxSlackArchivedMessageResponse = {
	sender_access?: string | null;
	id?: string | null;
	connection_id?: string | null;
	conversation_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	user_id?: string | null;
	bot_id?: string | null;
	subtype?: string | null;
	edited_ts?: string | null;
	reply_count?: number | null;
	text?: string | null;
	/** Retained file metadata. Audio files carry an additive transcription object (status, text, error_code): a received file once enrolled, and a sent voice note with its original text. It is omitted for other files. */
	files?: Array<Record<string, InkboxJsonValue>> | null;
	mentioned?: boolean | null;
	source?: string | null;
	captured_at?: string | null;
	blocks?: Array<Record<string, InkboxJsonValue>> | null;
	attachments?: Array<Record<string, InkboxJsonValue>> | null;
	latest_reply?: string | null;
	reactions?: Array<InkboxSlackCachedReaction> | null;
	reactions_complete?: boolean | null;
};

export type InkboxSlackAvailableConnection = {
	id?: string | null;
	identity_id?: string | null;
	agent_handle?: string | null;
	workspace_id?: string | null;
	workspace_name?: string | null;
};

export type InkboxSlackAvailableConnectionsResponse = {
	connections?: Array<InkboxSlackAvailableConnection> | null;
};

export type InkboxSlackCachedActor = {
	id?: string | null;
	kind?: string | null;
	name?: string | null;
	avatar_url?: string | null;
	avatar_cached?: boolean | null;
	deleted?: boolean | null;
	status?: string | null;
	fetched_at?: string | null;
};

export type InkboxSlackCachedConversation = {
	id?: string | null;
	name?: string | null;
	title?: string | null;
	type?: string | null;
	topic?: string | null;
	purpose?: string | null;
	counterpart_user_id?: string | null;
	member_ids?: Array<string> | null;
	members_complete?: boolean | null;
	is_archived?: boolean | null;
	is_private?: boolean | null;
	status?: string | null;
	fetched_at?: string | null;
};

export type InkboxSlackCachedEmoji = {
	name?: string | null;
	alias_of?: string | null;
	image_url?: string | null;
	image_cached?: boolean | null;
	status?: string | null;
};

export type InkboxSlackCachedEmojiPage = {
	emoji?: Array<InkboxSlackCachedEmoji> | null;
	next_cursor?: string | null;
	status?: string | null;
	error_code?: string | null;
};

export type InkboxSlackCachedFile = {
	id?: string | null;
	name?: string | null;
	title?: string | null;
	mimetype?: string | null;
	size?: number | null;
	content_cached?: boolean | null;
	preview_cached?: boolean | null;
	preview_url?: string | null;
	status?: string | null;
	error_code?: string | null;
};

export type InkboxSlackCachedReaction = {
	name?: string | null;
	count?: number | null;
	users?: Array<string> | null;
	users_complete?: boolean | null;
	reacted?: boolean | null;
};

export type InkboxSlackCapabilitiesResponse = {
	connection_id?: string | null;
	scopes?: Array<string> | null;
	missing_scopes?: Array<string> | null;
	capabilities?: Record<string, InkboxSlackCapability> | null;
	native_processing_status?: string | null;
	native_task_streaming?: string | null;
	max_upload_bytes?: number | null;
};

export type InkboxSlackCapability = {
	required_scopes?: Array<string> | null;
	missing_scopes?: Array<string> | null;
	scopes_satisfied?: boolean | null;
};

export type InkboxSlackConnectionResponse = {
	id?: string | null;
	identity_id?: string | null;
	workspace_id?: string | null;
	workspace_name?: string | null;
	bot_user_id?: string | null;
	status?: string | null;
	scopes?: Array<string> | null;
	created_at?: string | null;
	/** Installation version; invalidate local display caches when it changes. */
	generation?: number | null;
};

export type InkboxSlackConnectionsResponse = {
	connections?: Array<InkboxSlackConnectionResponse> | null;
	application_generation?: number | null;
	provisioning_workspace?: InkboxSlackProvisioningWorkspaceResponse | null;
	installation_available?: boolean | null;
	/** A provider app is known to exist, even when Slack is disabled. */
	application_created?: boolean | null;
	setup?: InkboxSlackSetupStatus | null;
};

export type InkboxSlackContactImportResponse = {
	imported_count?: number | null;
	skipped_count?: number | null;
	contact_ids?: Array<string> | null;
	next_cursor?: string | null;
};

export type InkboxSlackContactRuleResponse = {
	contact?: InkboxContactResponse | null;
	id?: string | null;
	agent_identity_id?: string | null;
	action?: InkboxSlackRuleAction | null;
	match_type?: InkboxSlackRuleMatchType | null;
	match_target?: string | null;
	direction?: InkboxRuleDirection | null;
	status?: InkboxResourceStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxSlackConversationsResponse = {
	conversations?: Array<Record<string, InkboxJsonValue>> | null;
	next_cursor?: string | null;
};

export type InkboxSlackCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	connection_id?: string | null;
	conversation_id?: string | null;
	workspace_id?: string | null;
	user_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	text?: string | null;
	text_truncated?: boolean | null;
	media?: InkboxCorrespondenceMediaMetadata | null;
	sender_access?: string | null;
};

export type InkboxSlackFileResponse = {
	id?: string | null;
	name?: string | null;
	title?: string | null;
	mimetype?: string | null;
	size?: number | null;
	downloadable?: boolean | null;
};

export type InkboxSlackInstallResponse = {
	authorization_url?: string | null;
	expires_at?: string | null;
};

export type InkboxSlackMembersResponse = {
	members?: Array<string> | null;
	next_cursor?: string | null;
};

export type InkboxSlackMessageContextResponse = {
	messages?: Array<Record<string, InkboxJsonValue>> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
	window?: string | null;
	complete?: boolean | null;
};

export type InkboxSlackMessageKind = string;

export type InkboxSlackMessagesResponse = {
	messages?: Array<Record<string, InkboxJsonValue>> | null;
	next_cursor?: string | null;
	has_more?: boolean | null;
};

export type InkboxSlackOperationResponse = {
	id?: string | null;
	connection_id?: string | null;
	operation?: string | null;
	status?: string | null;
	conversation_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	file_id?: string | null;
	error_code?: string | null;
	retry_after?: number | null;
	processing_status?: string | null;
	agent_status?: string | null;
};

export type InkboxSlackPermalinkResponse = {
	conversation_id?: string | null;
	message_ts?: string | null;
	permalink?: string | null;
};

export type InkboxSlackPinsResponse = {
	items?: Array<Record<string, InkboxJsonValue>> | null;
	truncated?: boolean | null;
};

export type InkboxSlackProfileFields = {
	display_name?: string | null;
	real_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	email?: string | null;
	phone?: string | null;
	title?: string | null;
	status_text?: string | null;
	status_emoji?: string | null;
	image_48?: string | null;
	image_72?: string | null;
	image_192?: string | null;
};

export type InkboxSlackProvisioningWorkspaceResponse = {
	id?: string | null;
	workspace_id?: string | null;
	workspace_name?: string | null;
	user_id?: string | null;
	user_name?: string | null;
	status?: string | null;
	token_expires_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxSlackProvisioningWorkspacesResponse = {
	workspaces?: Array<InkboxSlackProvisioningWorkspaceResponse> | null;
};

export type InkboxSlackReactionsResponse = {
	conversation_id?: string | null;
	message_ts?: string | null;
	reactions?: Array<Record<string, InkboxJsonValue>> | null;
};

export type InkboxSlackRuleAction = string;

export type InkboxSlackRuleMatchType = string;

export type InkboxSlackSetupStatus = {
	status?: string | null;
	provisioning_workspace_id?: string | null;
	retry_at?: string | null;
	error_code?: string | null;
};

export type InkboxSlackTranscriptionData = {
	identity_id?: string | null;
	connection_id?: string | null;
	workspace_id?: string | null;
	conversation_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	message_id?: string | null;
	sender_access?: string | null;
	actor_id?: string | null;
	actor_profile?: InkboxSlackActorProfile | null;
	contact_id?: string | null;
	message_kinds?: Array<InkboxSlackMessageKind> | null;
	/** Event-specific content and references, excluding transport credentials. */
	event?: Record<string, InkboxJsonValue> | null;
	channel?: string | null;
};

export type InkboxSlackUsersResponse = {
	users?: Array<Record<string, InkboxJsonValue>> | null;
	next_cursor?: string | null;
};

export type InkboxSlackWebhookData = {
	identity_id?: string | null;
	connection_id?: string | null;
	workspace_id?: string | null;
	conversation_id?: string | null;
	message_ts?: string | null;
	thread_ts?: string | null;
	/** Retained Slack message ID; matches message.transcription_finished data.message_id. */
	message_id?: string | null;
	sender_access?: string | null;
	actor_id?: string | null;
	actor_profile?: InkboxSlackActorProfile | null;
	contact_id?: string | null;
	message_kinds?: Array<InkboxSlackMessageKind> | null;
	/** Event-specific content and references, excluding transport credentials. */
	event?: Record<string, InkboxJsonValue> | null;
};

export type InkboxSlackWebhookEventType = string;

export type InkboxSlackWebhookPayload = {
	id?: string | null;
	event_type?: InkboxSlackWebhookEventType | null;
	timestamp?: string | null;
	data?: InkboxSlackWebhookData | null;
	companion?: InkboxCompanionWebhookMetadata | null;
};

export type InkboxSmsCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	conversation_id?: string | null;
	local_resource_id?: string | null;
	local_phone_number?: string | null;
	sender_phone_number?: string | null;
	participants?: Array<string> | null;
	matched_contact_phone?: string | null;
	is_group?: boolean | null;
	text?: string | null;
	media?: InkboxCorrespondenceMediaMetadata | null;
};

export type InkboxSmsDeliveryStatus = string;

export type InkboxSmsOptInResponse = {
	id?: string | null;
	organization_id?: string | null;
	receiver_number?: string | null;
	status?: InkboxSmsOptInStatus | null;
	source?: InkboxSmsOptInSource | null;
	opted_in_at?: string | null;
	opted_out_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxSmsOptInSource = string;

export type InkboxSmsOptInStatus = string;

export type InkboxSmsStatus = string;

export type InkboxSnapshot = {
	permission_mode?: string | null;
	created_at?: string | null;
	last_active_at?: string | null;
	id?: string | null;
	identity_id?: string | null;
	title?: string | null;
	origin?: string | null;
	capabilities?: InkboxCapabilities | null;
	history_completeness?: string | null;
	sequence?: number | null;
	snapshot_token?: string | null;
	event_cursor?: string | null;
	items?: Array<
		| InkboxMessageData
		| InkboxTurnData
		| InkboxToolData
		| InkboxInteractionData
		| InkboxArtifactData
	> | null;
	pending_interactions?: Array<InkboxInteractionData> | null;
	current_turn?: InkboxTurnData | null;
	next_cursor?: string | null;
};

export type InkboxSpfLookupReportResponse = {
	current?: number | null;
	limit?: number | null;
	mechanisms?: Array<string> | null;
};

export type InkboxStartupVariant = string;

export type InkboxStorageUsagePage = {
	items?: Array<InkboxStorageUsageRow> | null;
	next_cursor?: string | null;
	used_bytes?: number | null;
	capacity_bytes?: number | null;
	mailbox_count?: number | null;
	full_mailbox_count?: number | null;
	max_usage_percent?: number | null;
};

export type InkboxStorageUsageRow = {
	id?: string | null;
	agent_identity_id?: string | null;
	email_address?: string | null;
	storage_used_bytes?: number | null;
	storage_limit_bytes?: number | null;
};

export type InkboxSubscriptionStatusResponse = {
	/** Whether payment-method and invoice management is available. */
	billing_account_available?: boolean | null;
	/** Org's current plan; FREE when no paid subscription is active. */
	plan?: InkboxPlan | null;
	/** Stripe subscription status (active, past_due, ...) or None on Free. */
	status?: string | null;
	/** Whether the subscription is set to cancel at the period boundary. */
	cancel_at_period_end?: boolean | null;
	/** Unix seconds when the current monthly usage cycle ends, if subscribed. Allowances reset and usage is billed at this boundary. */
	current_period_end?: number | null;
	/** How often the plan fee renews ('month' or 'year'); None on Free. */
	billing_interval?: InkboxBillingInterval | null;
	/** Unix seconds when the plan fee next renews. Equals current_period_end on monthly plans; up to a year out on yearly plans. */
	plan_period_end?: number | null;
	/** Plan the subscription will switch to at period end (FREE = scheduled cancel), if any. */
	pending_plan?: InkboxPlan | null;
	/** Unix seconds when the pending plan change / cancellation takes effect. */
	pending_change_date?: number | null;
	/** When the pending plan is Startup: which flat-price variant the scheduled switch lands on. None otherwise. */
	pending_startup_variant?: InkboxStartupVariant | null;
	/** Renewal cadence of the pending paid plan, if a switch is scheduled. */
	pending_billing_interval?: InkboxBillingInterval | null;
	/** True when the subscription's flat price is the retired $25 Developer price (sunset migration pending); the console surfaces the phase-out banner from this. */
	legacy_developer_price?: boolean | null;
	/** False when Stripe isn't configured server-side; the UI hides upgrade actions. */
	stripe_configured?: boolean | null;
	/** Whether yearly plan billing can be selected. */
	annual_billing_available?: boolean | null;
	/** Stripe customer account balance in cents (negative = credit available, positive = amount owed). None on Free with no customer yet, or if the read failed. */
	balance?: number | null;
	/** Amount due in cents on the upcoming invoice (plan fee + metered overage accrued so far this cycle), net of any account credit. None when there's no subscription (Free) or the preview read failed. */
	estimated_next_bill?: number | null;
	/** Whether custom email signatures are available to this organization, including account-specific overrides, regardless of subscription status. */
	mail_custom_signatures_enabled?: boolean | null;
	/** Resolved organization entitlements, including additional grants on Free. May be absent from plan-change responses. */
	entitlements?: InkboxEntitlementsResponse | null;
	/** On Free only: a plan subscription that is unpaid, incomplete or paused and still needs the customer to act. Informational; it grants no plan, and `plan` and `status` keep describing the organization's effective billing state. */
	lapsed_subscription?: InkboxLapsedSubscriptionResponse | null;
};

export type InkboxTLSMode = string;

export type InkboxTerminal = {
	id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	terminal?: boolean | null;
	state?: string | null;
	exit_code?: number | null;
	stdout_offset?: number | null;
	stderr_offset?: number | null;
	output_truncated?: boolean | null;
};

export type InkboxTerminalPage = {
	items?: Array<InkboxTerminal> | null;
	next_cursor?: string | null;
	computer_state?: string | null;
};

export type InkboxTerminalReceipt = {
	id?: string | null;
	operation_id?: string | null;
	receipt?: InkboxExecReceipt | null;
};

export type InkboxTerminalTicket = {
	ticket?: string | null;
	expires_at?: string | null;
	url?: string | null;
};

export type InkboxTextConversationSummary = {
	remote_phone_number?: string | null;
	id?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	latest_text?: string | null;
	latest_direction?: InkboxTextDirection | null;
	latest_type?: InkboxTextType | null;
	latest_has_media?: boolean | null;
	latest_message_at?: string | null;
	unread_count?: number | null;
	total_count?: number | null;
};

export type InkboxTextConversationUpdateResponse = {
	remote_phone_number?: string | null;
	conversation_id?: string | null;
	is_read?: boolean | null;
	updated_count?: number | null;
};

export type InkboxTextDirection = string;

export type InkboxTextMediaItem = {
	transcription?: InkboxAttachmentTranscription | null;
	id?: string | null;
	content_type?: string | null;
	size?: number | null;
	url?: string | null;
};

export type InkboxTextMessageOrigin = string;

export type InkboxTextMessageResponse = {
	id?: string | null;
	direction?: InkboxTextDirection | null;
	local_phone_number?: string | null;
	remote_phone_number?: string | null;
	text?: string | null;
	type?: InkboxTextType | null;
	media?: Array<InkboxTextMediaItem> | null;
	is_read?: boolean | null;
	delivery_status?: InkboxSmsDeliveryStatus | null;
	origin?: InkboxTextMessageOrigin | null;
	error_code?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
	conversation_id?: string | null;
	sender_phone_number?: string | null;
	recipients?: Array<InkboxRecipientResponse> | null;
	is_blocked?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxTextSendCommandResponse = {
	message_id?: string | null;
	conversation_id?: string | null;
	recipients?: Array<string> | null;
	type?: string | null;
	delivery_status?: string | null;
	error?: string | null;
	rule?: string | null;
	message?: string | null;
};

export type InkboxTextTranscriptionData = {
	text_message?: InkboxWebhookTextMessage | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
	recipient_phone_number?: string | null;
	channel?: string | null;
	message_id?: string | null;
};

export type InkboxTextType = string;

export type InkboxThreadDetailResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	subject?: string | null;
	folder?: InkboxThreadFolder | null;
	message_count?: number | null;
	last_message_at?: string | null;
	created_at?: string | null;
	messages?: Array<InkboxMessageResponse> | null;
};

export type InkboxThreadFolder = string;

export type InkboxThreadResponse = {
	id?: string | null;
	mailbox_id?: string | null;
	subject?: string | null;
	folder?: InkboxThreadFolder | null;
	message_count?: number | null;
	last_message_at?: string | null;
	created_at?: string | null;
};

export type InkboxToolData = {
	id?: string | null;
	revision?: number | null;
	created_sequence?: number | null;
	turn_id?: string | null;
	resource_type?: string | null;
	title?: string | null;
	status?: string | null;
	detail?: string | null;
};

export type InkboxTranscriptParty = string;

export type InkboxTunnelResponse = {
	id?: string | null;
	organization_id?: string | null;
	tunnel_name?: string | null;
	/** Identifier of the identity associated with this tunnel, when available. */
	agent_identity_id?: string | null;
	tls_mode?: InkboxTLSMode | null;
	cert_pem?: string | null;
	cert_fingerprint_sha256?: string | null;
	cert_expires_at?: string | null;
	status?: InkboxTunnelStatus | null;
	last_connected_at?: string | null;
	/** Caller IP (leftmost X-Forwarded-For hop, falling back to the direct peer) recorded at the most recent /_system/hello. */
	last_connected_ip_addr?: string | null;
	/** Best-effort timestamp of the most recently observed transition from connected to disconnected. Null means no disconnect has been recorded. Use ``currently_connected`` for current liveness. */
	last_disconnected_at?: string | null;
	/** Live agent-connection state at read time: true if at least one agent connection is registered in Redis. Always resolved live on every tunnels endpoint — runtime state never appears as a stale placeholder. Identity payloads embed ``TunnelSummaryResponse`` instead, which carries no liveness. */
	currently_connected?: boolean | null;
	/** Per-tunnel public hostname, e.g. ``my-agent.inkboxwire.com`` in production (non-production environments include the environment label in the tunnel zone, e.g. ``my-agent.beta.inkboxwire.com``). Use this for constructing the public URL the third party hits. */
	public_host?: string | null;
	/** Tunnel zone host, e.g. ``inkboxwire.com`` in production. Use this as the data-plane h2 endpoint — the agent connects to ``https://{zone}/_system/connect``, not to ``https://{public_host}/_system/connect``. */
	zone?: string | null;
	/** Customer-supplied free-form metadata, set via ``PATCH /tunnels/{id}`` with ``metadata={...}``. Returned as-is on read. Empty dict (``{}``) when unset or cleared. Capped at 4 KB serialized JSON; over-limit writes return 422. */
	metadata?: Record<string, InkboxJsonValue> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxTunnelStatus = string;

export type InkboxTunnelSummaryResponse = {
	id?: string | null;
	tunnel_name?: string | null;
	/** Identifier of the identity associated with this tunnel, when available. */
	agent_identity_id?: string | null;
	tls_mode?: InkboxTLSMode | null;
	status?: InkboxTunnelStatus | null;
	public_host?: string | null;
	zone?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxTurn = {
	id?: string | null;
	conversation_id?: string | null;
	status?: string | null;
	terminal?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	blocker?: InkboxBlocker | null;
};

export type InkboxTurnData = {
	id?: string | null;
	revision?: number | null;
	created_sequence?: number | null;
	turn_id?: string | null;
	resource_type?: string | null;
	status?: string | null;
	terminal?: boolean | null;
	conversation_id?: string | null;
	blocker?: InkboxBlocker | null;
};

export type InkboxUploadIMessageMediaResponse = {
	media_url?: string | null;
	content_type?: string | null;
	size?: number | null;
};

export type InkboxUsage = {
	machine_id?: string | null;
	state?: string | null;
	source?: string | null;
	status?: string | null;
	sampled_at?: string | null;
	fresh_for_seconds?: number | null;
	allocated?: Record<string, number> | null;
	measured?: Record<string, number | null> | null;
	cpu_basis?: string | null;
	storage_warning?: Record<string, InkboxJsonValue> | null;
};

export type InkboxUsageHistory = {
	machine_id?: string | null;
	source?: string | null;
	from?: string | null;
	to?: string | null;
	resolution_seconds?: number | null;
	sample_interval_seconds?: number | null;
	missing_intervals?: string | null;
	items?: Array<Record<string, InkboxJsonValue>> | null;
};

export type InkboxUsageSummaryResponse = {
	storage?: InkboxStorageUsagePage | null;
	/** Unix seconds for the start of the current usage cycle. */
	cycle_start?: number | null;
	/** Unix seconds for the end of the current usage cycle (Stripe period end, or the calendar-month boundary for orgs with no subscription). */
	cycle_end?: number | null;
	/** Org's current plan (free/hobbyist/developer/startup/enterprise). */
	plan?: string | null;
	/** Org-wide totals, one per channel with usage this cycle. */
	channels?: Array<InkboxChannelUsageResponse> | null;
	/** Per-identity usage breakdown. */
	identities?: Array<InkboxIdentityUsageResponse> | null;
	/** Deprecated compatibility field; zero because allowances are shared by the organization. */
	sms_allowance_per_identity?: number | null;
	/** Deprecated compatibility field; zero because allowances are shared by the organization. */
	voice_sec_allowance_per_identity?: number | null;
	allowance_scope?: string | null;
	/** SMS/MMS included across the organization per billing cycle. */
	sms_allowance_per_org_per_cycle?: number | null;
	/** Voice seconds included across the organization per billing cycle. */
	voice_sec_allowance_per_org_per_cycle?: number | null;
	/** Debits against the shared SMS/MMS allowance. */
	sms_allowance_used?: number | null;
	/** Debits against the shared voice allowance, in seconds. */
	voice_sec_allowance_used?: number | null;
	/** Shared included SMS/MMS remaining. */
	sms_allowance_remaining?: number | null;
	/** Shared included voice seconds remaining, before minute packs. */
	voice_sec_allowance_remaining?: number | null;
	/** Additional included SMS/MMS preserved for this cycle. */
	sms_allowance_credit?: number | null;
	/** Additional included voice seconds preserved for this cycle. */
	voice_sec_allowance_credit?: number | null;
	/** Org's monthly SMS+voice overage spend limit in cents; None when unset. */
	overage_cap_cents?: number | null;
	/** Contract-priced SMS and voice overage in cents; null when historical pricing is unavailable. */
	overage_spend_cents?: number | null;
	/** Shared-pool iMessage messages this cycle (both directions) — the count the plan's shared iMessage cap is enforced against. */
	imessage_shared_messages?: number | null;
	/** Dedicated-line iMessage messages this cycle (both directions) — the count the dedicated-line cap is enforced against. */
	imessage_dedicated_messages?: number | null;
	/** Resolved shared-service iMessage message limit per billing cycle; zero means no allowance. */
	imessage_messages_per_org_per_cycle?: number | null;
	/** Resolved dedicated-line iMessage message limit per billing cycle; zero means no allowance. */
	imessage_dedicated_messages_per_org_per_cycle?: number | null;
	/** Unique shared-pool iMessage recipients this cycle. Reported only; recipients are capped per agent when they connect. */
	imessage_unique_recipients?: number | null;
	/** Non-deleted agent identities in the org — the count the plan's identity cap is enforced against on create. */
	identities_used?: number | null;
	/** Effective identity capacity, including grants and covered identity packs. */
	identities_included?: number | null;
	/** Resolved identity capacity before identity packs. */
	identities_baseline?: number | null;
	/** Additional identity slots with paid or renewal-processing coverage. */
	identity_pack_slots?: number | null;
	/** Voice seconds available this cycle from minute packs, shared across the org. Drawn after each identity's included allowance and before overage. */
	voice_pack_sec_granted?: number | null;
	/** Minute-pack voice seconds used so far this cycle. */
	voice_pack_sec_used?: number | null;
};

export type InkboxVaultInitializeResponse = {
	vault_id?: string | null;
	vault_key_id?: string | null;
	recovery_key_count?: number | null;
};

export type InkboxVaultKeyResponse = {
	id?: string | null;
	key_type?: InkboxVaultKeyType | null;
	created_by?: string | null;
	invalidated_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxVaultKeyType = string;

export type InkboxVaultResponse = {
	id?: string | null;
	organization_id?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	key_count?: number | null;
	secret_count?: number | null;
	recovery_key_count?: number | null;
};

export type InkboxVaultSecretAccessResponse = {
	id?: string | null;
	vault_secret_id?: string | null;
	identity_id?: string | null;
	created_at?: string | null;
};

export type InkboxVaultSecretDetailResponse = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	secret_type?: InkboxVaultSecretType | null;
	access?: Array<InkboxVaultSecretAccessResponse> | null;
	created_at?: string | null;
	updated_at?: string | null;
	encrypted_payload?: string | null;
};

export type InkboxVaultSecretResponse = {
	id?: string | null;
	name?: string | null;
	description?: string | null;
	secret_type?: InkboxVaultSecretType | null;
	access?: Array<InkboxVaultSecretAccessResponse> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxVaultSecretType = string;

export type InkboxVaultUnlockResponse = {
	wrapped_org_encryption_key?: string | null;
	wrapped_org_encryption_keys?: Array<InkboxWrappedKeyEntry> | null;
	encrypted_secrets?: Array<InkboxVaultSecretDetailResponse> | null;
};

export type InkboxVoicePack = string;

export type InkboxVoicePackResponse = {
	/** Pack size key. */
	pack?: InkboxVoicePack | null;
	/** Voice minutes the pack adds each billing cycle. */
	minutes?: number | null;
	/** Monthly price of one pack, in cents. */
	price_cents?: number | null;
	/** How many of this pack the org currently has. */
	quantity?: number | null;
	/** Packs removed from renewal whose current-cycle minutes have not expired; null when unavailable. */
	ending_quantity?: number | null;
	/** Unix timestamp when the removed packs' current-cycle minutes expire; null when none or unavailable. */
	ending_at?: number | null;
};

export type InkboxVoicePacksResponse = {
	/** Every pack size with the org's quantity. */
	packs?: Array<InkboxVoicePackResponse> | null;
	/** Voice seconds available this cycle from minute packs. */
	voice_pack_sec_granted?: number | null;
	/** Minute-pack voice seconds used so far this cycle. */
	voice_pack_sec_used?: number | null;
};

export type InkboxVoicemailDetection = string;

export type InkboxWebhookAgentIdentity = {
	id?: string | null;
	agent_handle?: string | null;
	display_name?: string | null;
};

export type InkboxWebhookCallTranscript = {
	entries?: Array<InkboxWebhookTranscriptEntry> | null;
	abridged?: boolean | null;
	url?: string | null;
};

export type InkboxWebhookCatalogRow = {
	event_type?: string | null;
	resource_type?: InkboxWebhookDestinationResourceType | null;
	delivery_path?: string | null;
	payload_schema?: string | null;
	summary?: string | null;
	description?: string | null;
	trigger_text?: string | null;
	delivery_text?: string | null;
	response_text?: string | null;
	response_required?: boolean | null;
	example_payload?: string | null;
	example_response?: string | null;
};

export type InkboxWebhookContact = {
	id?: string | null;
	name?: string | null;
	memories?: Array<string> | null;
};

export type InkboxWebhookContextBlock = {
	scope?: InkboxWebhookContextScope | null;
	mode?: InkboxWebhookContextMode | null;
	requested?: number | null;
	hours?: number | null;
	items?: Array<
		| InkboxWebhookContextMailItem
		| InkboxWebhookContextTextItem
		| InkboxWebhookContextCallItem
	> | null;
	truncated?: boolean | null;
	skipped?: InkboxWebhookContextSkipReason | null;
};

export type InkboxWebhookContextCallItem = {
	call_id?: string | null;
	direction?: string | null;
	remote_number?: string | null;
	duration?: number | null;
	started_at?: string | null;
	abridged?: boolean | null;
	transcript?: Array<InkboxWebhookTranscriptEntry> | null;
};

export type InkboxWebhookContextConfig = {
	email?:
		| (InkboxWebhookContextCountConfig | InkboxWebhookContextWindowConfig)
		| null;
	texts?:
		| (InkboxWebhookContextCountConfig | InkboxWebhookContextWindowConfig)
		| null;
	calls?:
		| (InkboxWebhookContextCountConfig | InkboxWebhookContextWindowConfig)
		| null;
};

export type InkboxWebhookContextCountConfig = {
	mode?: string | null;
	count?: number | null;
};

export type InkboxWebhookContextMailItem = {
	id?: string | null;
	direction?: string | null;
	from_address?: string | null;
	to_addresses?: Array<string> | null;
	subject?: string | null;
	snippet?: string | null;
	email_address?: string | null;
	created_at?: string | null;
};

export type InkboxWebhookContextMode = string;

export type InkboxWebhookContextScope = string;

export type InkboxWebhookContextSkipReason = string;

export type InkboxWebhookContextTextChannel = string;

export type InkboxWebhookContextTextItem = {
	id?: string | null;
	channel?: InkboxWebhookContextTextChannel | null;
	direction?: string | null;
	sender?: string | null;
	text?: string | null;
	text_truncated?: boolean | null;
	status?: string | null;
	media?: Record<string, InkboxJsonValue> | null;
	created_at?: string | null;
};

export type InkboxWebhookContextWindowConfig = {
	mode?: string | null;
	hours?: number | null;
};

export type InkboxWebhookDeliveryResponse = {
	id?: string | null;
	organization_id?: string | null;
	replayable?: boolean | null;
	replay_unavailable_reason?: string | null;
	/** Subscription this delivery targeted; null for incoming-call deliveries. */
	webhook_subscription_id?: string | null;
	/** Phone number for incoming-call deliveries (which have no subscription). */
	phone_number_id?: string | null;
	/** Envelope event id (evt_...), or the call id for incoming-call rows. */
	event_id?: string | null;
	event_type?: string | null;
	url?: string | null;
	/** Delivered request body; contact enrichment is omitted from identity-scoped history. */
	request_payload?: string | null;
	/** HTTP status returned by the endpoint; null on transport failure. */
	response_status?: number | null;
	/** Truncated response snippet; omitted when contact enrichment is removed from scoped history. */
	response_body?: string | null;
	/** Transport error summary, if any. */
	error_detail?: string | null;
	duration_ms?: number | null;
	/** True if this row was produced by a manual replay. */
	is_replay?: boolean | null;
	created_at?: string | null;
};

export type InkboxWebhookDestinationResourceType = string;

export type InkboxWebhookIMessageMessage = {
	provider_message_handle?: string | null;
	id?: string | null;
	conversation_id?: string | null;
	assignment_id?: string | null;
	/** Visible native reply target, when resolved. Null does not prove the message is not a reply. */
	reply_to_message_id?: string | null;
	/** Thread identifier when resolved, including standalone messages; does not imply replies exist. */
	thread_id?: string | null;
	/** Visible thread root when resolved; a standalone message is its own root. */
	thread_root_message_id?: string | null;
	direction?: InkboxIMessageDirection | null;
	remote_number?: string | null;
	sender_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	content?: string | null;
	message_type?: InkboxIMessageType | null;
	service?: InkboxIMessageService | null;
	send_style?: InkboxIMessageSendStyle | null;
	media?: Array<InkboxIMessageMediaItem> | null;
	was_downgraded?: boolean | null;
	status?: InkboxIMessageStatus | null;
	error_code?: string | null;
	error_message?: string | null;
	error_reason?: string | null;
	error_detail?: string | null;
	is_read?: boolean | null;
	is_blocked?: boolean | null;
	recipients?: Array<InkboxIMessageRecipientResponse> | null;
	reactions?: Array<InkboxIMessageMessageReaction> | null;
	created_at?: string | null;
	updated_at?: string | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
};

export type InkboxWebhookMailAgentIdentity = {
	bucket?: string | null;
	address?: string | null;
	id?: string | null;
	agent_handle?: string | null;
	display_name?: string | null;
};

export type InkboxWebhookMailContact = {
	bucket?: string | null;
	address?: string | null;
	id?: string | null;
	name?: string | null;
	memories?: Array<string> | null;
};

export type InkboxWebhookPhoneCall = {
	id?: string | null;
	origin?: InkboxCallOrigin | null;
	local_phone_number?: string | null;
	remote_phone_number?: string | null;
	direction?: InkboxCallDirection | null;
	status?: InkboxCallStatus | null;
	mode?: InkboxCallMode | null;
	hosted_agent_authority_mode?: InkboxHostedAgentAuthorityMode | null;
	voicemail_detection?: InkboxVoicemailDetection | null;
	on_voicemail?: InkboxOnVoicemail | null;
	reason?: string | null;
	connections?: Array<InkboxPhoneCallConnectionResponse> | null;
	forwardings?: Array<InkboxPhoneCallForwardingResponse> | null;
	hangup_reason?: InkboxHangupReason | null;
	ended_by?: InkboxEndedBy | null;
	provider_hangup_cause?: string | null;
	started_at?: string | null;
	ended_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	duration_seconds?: number | null;
};

export type InkboxWebhookPostCallAction = {
	id?: string | null;
	seq?: number | null;
	action?: string | null;
	details?: string | null;
	status?: InkboxPostCallActionStatus | null;
};

export type InkboxWebhookRecipient = {
	recipient_phone_number?: string | null;
	delivery_status?: InkboxSmsDeliveryStatus | null;
	carrier?: string | null;
	line_type?: string | null;
	error_code?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
};

export type InkboxWebhookSubscriptionCreateResponse = {
	id?: string | null;
	organization_id?: string | null;
	mailbox_id?: string | null;
	phone_number_id?: string | null;
	agent_identity_id?: string | null;
	owner_identity_id?: string | null;
	url?: string | null;
	event_types?: Array<
		| InkboxMailWebhookEventType
		| InkboxPhoneTextWebhookEventType
		| InkboxPhoneCallLifecycleWebhookEventType
		| InkboxIMessageWebhookEventType
		| InkboxMessageTranscriptionEventType
		| InkboxWhatsAppWebhookEventType
		| InkboxA2AWebhookEventType
		| InkboxSlackWebhookEventType
	> | null;
	context_config?: InkboxWebhookContextConfig | null;
	auth_token?: string | null;
	has_auth_token?: boolean | null;
	status?: InkboxWebhookSubscriptionStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
	signing_key?: string | null;
};

export type InkboxWebhookSubscriptionResponse = {
	id?: string | null;
	organization_id?: string | null;
	mailbox_id?: string | null;
	phone_number_id?: string | null;
	agent_identity_id?: string | null;
	owner_identity_id?: string | null;
	url?: string | null;
	event_types?: Array<
		| InkboxMailWebhookEventType
		| InkboxPhoneTextWebhookEventType
		| InkboxPhoneCallLifecycleWebhookEventType
		| InkboxIMessageWebhookEventType
		| InkboxMessageTranscriptionEventType
		| InkboxWhatsAppWebhookEventType
		| InkboxA2AWebhookEventType
		| InkboxSlackWebhookEventType
	> | null;
	context_config?: InkboxWebhookContextConfig | null;
	auth_token?: string | null;
	has_auth_token?: boolean | null;
	status?: InkboxWebhookSubscriptionStatus | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxWebhookSubscriptionStatus = string;

export type InkboxWebhookTextMessage = {
	id?: string | null;
	direction?: InkboxTextDirection | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
	local_phone_number?: string | null;
	remote_phone_number?: string | null;
	text?: string | null;
	type?: InkboxTextType | null;
	media?: Array<InkboxTextMediaItem> | null;
	is_read?: boolean | null;
	delivery_status?: InkboxSmsDeliveryStatus | null;
	origin?: InkboxTextMessageOrigin | null;
	error_code?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
	conversation_id?: string | null;
	sender_phone_number?: string | null;
	recipients?: Array<InkboxWebhookRecipient> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxWebhookTranscriptEntry = {
	party?: string | null;
	phone_number?: string | null;
	text?: string | null;
	ts_ms?: number | null;
	truncated?: boolean | null;
	marker?: string | null;
	omitted_turns?: number | null;
	omitted_ms?: number | null;
};

export type InkboxWebhookWhatsAppMessage = {
	id?: string | null;
	agent_identity_id?: string | null;
	conversation_id?: string | null;
	/** Stable direct-history ID across number changes; conversation_id retains its physical source. */
	logical_conversation_id?: string | null;
	direction?: string | null;
	/** This agent's WhatsApp number; null on Inkbox's global shared numbers. */
	local_number?: string | null;
	remote_number?: string | null;
	sender_number?: string | null;
	participants?: Array<string> | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
	is_group?: boolean | null;
	agent_mentioned?: boolean | null;
	mentions?: Array<InkboxWhatsAppMentionResponse> | null;
	group_name?: string | null;
	unresolved_participant_count?: number | null;
	reply_to_message_id?: string | null;
	thread_id?: string | null;
	thread_root_message_id?: string | null;
	reactions?: Array<InkboxWhatsAppReactionResponse> | null;
	content?: string | null;
	media?: Array<InkboxWhatsAppMediaResponse> | null;
	status?: InkboxWhatsAppMessageStatus | null;
	delivery_state?: InkboxWhatsAppDeliveryState | null;
	recipients?: Array<InkboxWhatsAppRecipientResponse> | null;
	is_read?: boolean | null;
	is_blocked?: boolean | null;
	error_code?: string | null;
	error_detail?: string | null;
	source_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
	status_observed_at?: string | null;
	status_refresh_pending?: boolean | null;
};

export type InkboxWhatsAppAssignmentResponse = {
	id?: string | null;
	remote_number?: string | null;
	agent_identity_id?: string | null;
	organization_id?: string | null;
	status?: string | null;
	released_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxWhatsAppChannelResponse = {
	enabled?: boolean | null;
	number?: string | null;
	status?: InkboxWhatsAppChannelState | null;
};

export type InkboxWhatsAppChannelState = string;

export type InkboxWhatsAppConversationResponse = {
	id?: string | null;
	agent_identity_id?: string | null;
	/** Existing conversation on the current route, or null when no current conversation exists. */
	active_conversation_id?: string | null;
	/** The shared-number connection this conversation runs on; null on a dedicated number. */
	assignment_id?: string | null;
	/** Whether that connection is still active; null on a dedicated number. */
	assignment_status?: string | null;
	/** This agent's WhatsApp number; null on Inkbox's global shared numbers. */
	local_number?: string | null;
	remote_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	group_name?: string | null;
	unresolved_participant_count?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type InkboxWhatsAppConversationSummary = {
	id?: string | null;
	agent_identity_id?: string | null;
	/** Existing conversation on the current route, or null when no current conversation exists. */
	active_conversation_id?: string | null;
	/** The shared-number connection this conversation runs on; null on a dedicated number. */
	assignment_id?: string | null;
	/** Whether that connection is still active; null on a dedicated number. */
	assignment_status?: string | null;
	/** This agent's WhatsApp number; null on Inkbox's global shared numbers. */
	local_number?: string | null;
	remote_number?: string | null;
	participants?: Array<string> | null;
	is_group?: boolean | null;
	group_name?: string | null;
	unresolved_participant_count?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	latest_text?: string | null;
	latest_message_at?: string | null;
	latest_direction?: string | null;
	latest_has_media?: boolean | null;
	unread_count?: number | null;
	total_count?: number | null;
};

export type InkboxWhatsAppCorrespondenceItem = {
	source_id?: string | null;
	direction?: string | null;
	occurred_at?: string | null;
	identity_id?: string | null;
	status?: string | null;
	detail_url?: string | null;
	channel?: string | null;
	conversation_id?: string | null;
	local_number?: string | null;
	remote_number?: string | null;
	participants?: Array<string> | null;
	text?: string | null;
	media?: InkboxCorrespondenceMediaMetadata | null;
};

export type InkboxWhatsAppDeliveryState = string;

export type InkboxWhatsAppLimitsResponse = {
	agent_identity_id?: string | null;
	limits?: Record<string, number> | null;
	usage?: Record<string, number> | null;
};

export type InkboxWhatsAppMediaResponse = {
	transcription?: InkboxAttachmentTranscription | null;
	id?: string | null;
	filename?: string | null;
	content_type?: string | null;
	size?: number | null;
	status?: InkboxWhatsAppMediaStatus | null;
	url?: string | null;
};

export type InkboxWhatsAppMediaStatus = string;

export type InkboxWhatsAppMentionResponse = {
	text?: string | null;
	phone_number?: string | null;
	is_agent?: boolean | null;
};

export type InkboxWhatsAppMessageResponse = {
	id?: string | null;
	agent_identity_id?: string | null;
	conversation_id?: string | null;
	/** Stable direct-history ID across number changes; conversation_id retains its physical source. */
	logical_conversation_id?: string | null;
	direction?: string | null;
	/** This agent's WhatsApp number; null on Inkbox's global shared numbers. */
	local_number?: string | null;
	remote_number?: string | null;
	sender_number?: string | null;
	participants?: Array<string> | null;
	/** Admission of this inbound message at receipt: direct passed contact rules (including allowed by default); sponsored was default-filtered and is delivered under conversation sponsorship. Not sender trust or command permission. Absent when unknown or inapplicable, including outbound and… */
	sender_access?: string | null;
	is_group?: boolean | null;
	agent_mentioned?: boolean | null;
	mentions?: Array<InkboxWhatsAppMentionResponse> | null;
	group_name?: string | null;
	unresolved_participant_count?: number | null;
	reply_to_message_id?: string | null;
	thread_id?: string | null;
	thread_root_message_id?: string | null;
	reactions?: Array<InkboxWhatsAppReactionResponse> | null;
	content?: string | null;
	media?: Array<InkboxWhatsAppMediaResponse> | null;
	status?: InkboxWhatsAppMessageStatus | null;
	delivery_state?: InkboxWhatsAppDeliveryState | null;
	recipients?: Array<InkboxWhatsAppRecipientResponse> | null;
	is_read?: boolean | null;
	is_blocked?: boolean | null;
	error_code?: string | null;
	error_detail?: string | null;
	source_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
	status_observed_at?: string | null;
	status_refresh_pending?: boolean | null;
};

export type InkboxWhatsAppMessageStatus = string;

export type InkboxWhatsAppOnboardingResponse = {
	agent_identity_id?: string | null;
	/** The router number the person messages. */
	triage_number?: string | null;
	/** The text the person sends, for example ``connect @handle``. */
	connect_command?: string | null;
	/** A wa.me link that opens the connect command as a draft to the router. */
	connect_link?: string | null;
	/** A PNG data URL of a QR code for the same link. */
	connect_qr_png_data_url?: string | null;
	/** Whether WhatsApp is enabled for this agent. */
	ready?: boolean | null;
	/** Compatibility alias for the router number. */
	number?: string | null;
	/** Compatibility alias for the recipient's connect command. */
	message_text?: string | null;
	/** Compatibility alias for the router connect link. */
	message_link?: string | null;
	/** Compatibility alias for the router connect QR code. */
	message_qr_png_data_url?: string | null;
};

export type InkboxWhatsAppReactionCommandResponse = {
	reaction?: InkboxWhatsAppReactionResponse | null;
};

export type InkboxWhatsAppReactionResponse = {
	id?: string | null;
	target_message_id?: string | null;
	conversation_id?: string | null;
	agent_identity_id?: string | null;
	direction?: string | null;
	remote_number?: string | null;
	reaction?: string | null;
	custom_emoji?: string | null;
	emoji?: string | null;
	status?: string | null;
	revision?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
	removed_at?: string | null;
};

export type InkboxWhatsAppRecipientResponse = {
	remote_number?: string | null;
	delivery_status?: InkboxWhatsAppMessageStatus | null;
	delivery_state?: InkboxWhatsAppDeliveryState | null;
	error_code?: string | null;
	error_detail?: string | null;
	sent_at?: string | null;
	delivered_at?: string | null;
	failed_at?: string | null;
};

export type InkboxWhatsAppThreadResponse = {
	conversation_id?: string | null;
	thread_id?: string | null;
	thread_root_message_id?: string | null;
	messages?: Array<InkboxWhatsAppMessageResponse> | null;
	next_cursor?: string | null;
};

export type InkboxWhatsAppTranscriptionData = {
	message?: InkboxWebhookWhatsAppMessage | null;
	reaction?: InkboxWhatsAppReactionResponse | null;
	context?: Record<string, InkboxWebhookContextBlock> | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
	channel?: string | null;
	message_id?: string | null;
};

export type InkboxWhatsAppTriageNumberResponse = {
	number?: string | null;
	/** ``connect @handle`` for a selected agent; a generic placeholder otherwise. */
	connect_command?: string | null;
	/** A wa.me link that opens the connect command as a draft to the router. */
	whatsapp_link?: string | null;
	/** A PNG data URL of a QR code for the same link. */
	connect_qr_png_data_url?: string | null;
};

export type InkboxWhatsAppWebhookData = {
	message?: InkboxWebhookWhatsAppMessage | null;
	reaction?: InkboxWhatsAppReactionResponse | null;
	context?: Record<string, InkboxWebhookContextBlock> | null;
	contacts?: Array<InkboxWebhookContact> | null;
	agent_identities?: Array<InkboxWebhookAgentIdentity> | null;
};

export type InkboxWhatsAppWebhookEventType = string;

export type InkboxWhatsAppWebhookPayload = {
	id?: string | null;
	event_type?: InkboxWhatsAppWebhookEventType | null;
	timestamp?: string | null;
	data?: InkboxWhatsAppWebhookData | null;
};

export type InkboxWorkspace = {
	identity_id?: string | null;
	machine_id?: string | null;
	observed_at?: string | null;
	computer?: InkboxComputer | null;
	agent?: InkboxAgent | null;
	automation?: InkboxAutomation | null;
	funding?: InkboxFunding | null;
	configuration?: InkboxConfiguration | null;
	capabilities?: InkboxCapabilities | null;
	allowed_actions?: Array<string> | null;
	hosting?: InkboxHostingView | null;
	links?: Array<InkboxWorkspaceLink> | null;
	unavailable_sections?: Array<string> | null;
};

export type InkboxWorkspaceLink = {
	resource?: string | null;
	path?: string | null;
};

export type InkboxWrappedKeyEntry = {
	id?: string | null;
	auth_hash?: string | null;
	wrapped_org_encryption_key?: string | null;
};

export type InkboxOperationInputs = {
	'a2a.contactRules.create': {
		agent_handle: string;
		action: InkboxA2ARuleActionInput;
		match_type?: 'handle';
		match_target: string;
		direction?: 'inbound' | 'outbound' | 'both';
	};
	'a2a.contactRules.delete': {
		rule_id: string;
		agent_handle: string;
	};
	'a2a.contactRules.list': {
		agent_handle: string;
	};
	'a2a.contactRules.listForOrg': {
		agent_identity_id?: string | null;
		action?: InkboxA2ARuleActionInput | null;
		direction?: InkboxA2ARuleDirectionInput | null;
		limit?: number;
		offset?: number;
	};
	'a2a.contactRules.update': {
		rule_id: string;
		agent_handle: string;
		action?: InkboxA2ARuleActionInput | null;
		direction?: 'inbound' | 'outbound' | 'both' | null;
	};
	'a2a.contexts.get': {
		context_id: string;
		agent_handle: string;
	};
	'a2a.contexts.list': {
		agent_handle: string;
		/** Context direction relative to the identity in the path. */
		direction?: InkboxA2AHistoryDirectionInput;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.contexts.update': {
		context_id: string;
		agent_handle: string;
		name: string;
	};
	'a2a.invitations.accept': {
		invitation_token: string;
	};
	'a2a.invitations.create': {
		peer_agent_handles: Array<string>;
		recipient_email?: string | null;
		expires_in_seconds?: number;
	};
	'a2a.invitations.decline': {
		invitation_token: string;
	};
	'a2a.invitations.get': {
		invitation_id: string;
	};
	'a2a.invitations.list': {
		status?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.invitations.preview': {
		invitation_token: string;
	};
	'a2a.invitations.revoke': {
		invitation_id: string;
	};
	'a2a.listDirectory': {
		q?: string | null;
		cursor?: string | null;
		limit?: number;
		verified_domain?: string | null;
	};
	'a2a.messages.list': {
		agent_handle: string;
		/** Task direction relative to the identity in the path. */
		direction?: InkboxA2AHistoryDirectionInput;
		requester_handle?: string | null;
		worker_handle?: string | null;
		task_id?: string | null;
		context_id?: string | null;
		/** Message author role; this is independent of task direction. */
		role?: InkboxA2AMessageRoleInput | null;
		/** Full-text search over message content; results remain newest first. */
		q?: string | null;
		since?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.previewCard': {
		agent_handle: string;
	};
	'a2a.sentContexts.get': {
		context_id: string;
		agent_handle: string;
	};
	'a2a.sentContexts.list': {
		agent_handle: string;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.sentTasks.get': {
		task_id: string;
		agent_handle: string;
	};
	'a2a.sentTasks.list': {
		agent_handle: string;
		requester_handle?: string | null;
		worker_handle?: string | null;
		state?: InkboxA2ATaskStateInput | null;
		context_id?: string | null;
		/** Full-text search over task message content; results remain newest first. */
		q?: string | null;
		since?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.settings.get': {
		agent_handle: string;
	};
	'a2a.settings.listForOrg': {
		enabled?: boolean | null;
	};
	'a2a.settings.update': {
		agent_handle: string;
		enabled?: boolean | null;
		publicly_discoverable?: boolean | null;
		allow_public_egress?: boolean | null;
		filter_mode?: InkboxFilterModeInput | null;
		skills?: Array<InkboxA2ASkillInput> | null;
	};
	'a2a.tasks.get': {
		task_id: string;
		agent_handle: string;
	};
	'a2a.tasks.list': {
		agent_handle: string;
		/** Task direction relative to the identity in the path. */
		direction?: InkboxA2AHistoryDirectionInput;
		requester_handle?: string | null;
		worker_handle?: string | null;
		state?: InkboxA2ATaskStateInput | null;
		context_id?: string | null;
		/** Full-text search over task message content; results remain newest first. */
		q?: string | null;
		since?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'a2a.tasks.reply': {
		task_id: string;
		agent_handle: string;
		intent: InkboxA2AReplyIntentInput;
		parts: Array<InkboxA2ATextPartInput | InkboxA2ADataPartInput>;
	};
	'account.whoami': Record<string, never>;
	'agentSignup.getStatus': Record<string, never>;
	'agentSignup.resendVerification': Record<string, never>;
	'agentSignup.verify': {
		/** 6-digit verification code sent to the human's email. */
		verification_code: string;
	};
	'apiKeys.create': {
		label: string;
		description?: string | null;
		/** Scope this key to a specific agent identity. Omit or null for an admin (unscoped) key with full org-wide authority. */
		scoped_identity_id?: string | null;
	};
	'apiKeys.getCurrent': Record<string, never>;
	'apiKeys.revokeCurrent': Record<string, never>;
	'billing.callingCountries.buy': {
		country_code?: string | null;
		country_codes?: Array<string> | null;
		quote: string;
		request_key: string;
	};
	'billing.callingCountries.cancel': {
		agreement_id: string;
	};
	'billing.callingCountries.list': Record<string, never>;
	'billing.callingCountries.quote': {
		country_code?: string | null;
		country_codes?: Array<string> | null;
	};
	'billing.callingCountries.resume': {
		agreement_id: string;
	};
	'billing.changePlan': {
		/** Target plan: a self-serve plan or 'free' (cancel). */
		plan: InkboxPlanInput;
		/** Startup only: pass the fixed value 'outbound' when selecting the supported $200 plan. Omit or pass null while keeping the current Startup subscription to clear a pending change without changing its legacy price. */
		startup_variant?: 'outbound' | null;
		/** Plan fee renewal cadence to switch to: 'month' or 'year'. Omit to keep the current cadence. Moving to yearly takes effect immediately (prorated); moving from yearly to monthly takes effect at the yearly renewal. */
		interval?: InkboxBillingIntervalInput | null;
	};
	'billing.createCheckoutSession': {
		/** Plan to subscribe to. Must be a self-serve plan. */
		plan: InkboxPlanInput;
		/** Startup only: the supported $200 dedicated-line option. The fixed value is 'outbound'; ignored for other plans. */
		startup_variant?: 'outbound';
		/** How often the plan fee renews: 'month' or 'year'. Usage and add-ons bill monthly either way. */
		interval?: InkboxBillingIntervalInput;
		/** Absolute URL Stripe returns to after a completed checkout. Must be https on an inkbox.ai host (localhost allowed in dev). */
		success_url: string;
		/** Absolute URL Stripe returns to if the user cancels checkout. Same host restrictions as success_url. */
		cancel_url: string;
	};
	'billing.createPortalSession': {
		/** Absolute URL Stripe returns to when the user leaves the billing portal. Must be https on an inkbox.ai host (localhost allowed in dev). */
		return_url: string;
	};
	'billing.getPricing': Record<string, never>;
	'billing.getSubscription': Record<string, never>;
	'billing.getUsage': Record<string, never>;
	'billing.identityPacks.buy': {
		quote: string;
		request_key: string;
	};
	'billing.identityPacks.change': {
		agreement_id: string;
		action: 'cancel' | 'resume';
		request_key: string;
	};
	'billing.identityPacks.list': {
		cursor?: string | null;
		limit?: number;
	};
	'billing.identityPacks.quote': Record<string, never>;
	'billing.lineBundles.buy': {
		code: 'voip_line_bundle' | 'personal_imessage_line_bundle';
		quote: string;
		request_key: string;
	};
	'billing.lineBundles.change': {
		agreement_id: string;
		action: 'cancel' | 'resume';
	};
	'billing.lineBundles.list': Record<string, never>;
	'billing.lineBundles.quote': {
		code: 'voip_line_bundle' | 'personal_imessage_line_bundle';
	};
	'billing.setVoicePacks': {
		/** Pack size to change. */
		pack: InkboxVoicePackInput;
		/** Desired number of this pack; 0 removes it. */
		quantity: number;
	};
	'billing.settings.get': Record<string, never>;
	'billing.settings.update': {
		/** Monthly SMS+voice overage spend limit in cents. Omit to leave unchanged; null clears the limit; 0 blocks all overage-incurring sends and calls. */
		overage_cap_cents?: number | null;
		/** Set true to remove the 'Sent via Inkbox' footer from outbound emails (paid plans only; 403 on Free). Omit or null to leave unchanged. */
		remove_branding_footer?: boolean | null;
	};
	'billing.usageAlerts.delete': {
		rule_id: string;
	};
	'billing.usageAlerts.list': Record<string, never>;
	'billing.usageAlerts.save': {
		rule_id: string;
		metric: 'identities' | 'storage' | 'sms' | 'voice' | 'overage';
		threshold: number;
		mailbox_id?: string | null;
		enabled?: boolean;
	};
	'compliance.brand.delete': Record<string, never>;
	'compliance.brand.get': Record<string, never>;
	'compliance.brand.register': {
		entity_type: InkboxBrandEntityTypeInput;
		display_name: string;
		email: string;
		vertical: InkboxBrandVerticalInput;
		country: InkboxBrandCountryInput;
		phone: string;
		website: string;
		street: string;
		city: string;
		state: string;
		postal_code: string;
		company_name?: string | null;
		ein?: string | null;
		first_name?: string | null;
		last_name?: string | null;
		mobile_phone?: string | null;
		business_contact_email?: string | null;
		stock_symbol?: string | null;
		stock_exchange?: InkboxBrandStockExchangeInput | null;
	};
	'compliance.brand.resendTwoFactorEmail': Record<string, never>;
	'compliance.brand.sendSmsOtp': Record<string, never>;
	'compliance.brand.update': {
		country: InkboxBrandCountryInput;
		display_name: string;
		email: string;
		entity_type: InkboxBrandEntityTypeInput;
		vertical: InkboxBrandVerticalInput;
		phone: string;
		website: string;
		street: string;
		city: string;
		state: string;
		postal_code: string;
		alt_business_id?: string | null;
		alt_business_id_type?: InkboxBrandAltBusinessIdTypeInput | null;
		company_name?: string | null;
		ein?: string | null;
		first_name?: string | null;
		last_name?: string | null;
		business_contact_email?: string | null;
		stock_symbol?: string | null;
		stock_exchange?: InkboxBrandStockExchangeInput | null;
	};
	'compliance.brand.verifySmsOtp': {
		/** One-time PIN the customer received via SMS. */
		otp_pin: string;
	};
	'compliance.campaign.delete': Record<string, never>;
	'compliance.campaign.get': Record<string, never>;
	'compliance.campaign.getActive': Record<string, never>;
	'compliance.campaign.register': {
		brand_id: string;
		usecase: InkboxCampaignUseCaseInput;
		description: string;
		message_flow: string;
		help_message: string;
		sample1: string;
		sample2: string;
		sample3: string;
		sample4: string;
		sample5?: string | null;
		optin_keywords: string;
		optout_keywords: string;
		help_keywords: string;
		optin_message: string;
		optout_message: string;
		embedded_link?: boolean;
		embedded_link_sample?: string | null;
		embedded_phone?: boolean;
		age_gated?: boolean;
		direct_lending?: boolean;
		privacy_policy_link: string;
		terms_and_conditions_link: string;
		sub_usecases?: Array<string> | null;
	};
	'compliance.campaign.resubmit': {
		brand_id: string;
		usecase: InkboxCampaignUseCaseInput;
		description: string;
		message_flow: string;
		help_message: string;
		sample1: string;
		sample2: string;
		sample3: string;
		sample4: string;
		sample5?: string | null;
		optin_keywords: string;
		optout_keywords: string;
		help_keywords: string;
		optin_message: string;
		optout_message: string;
		embedded_link?: boolean;
		embedded_link_sample?: string | null;
		embedded_phone?: boolean;
		age_gated?: boolean;
		direct_lending?: boolean;
		privacy_policy_link: string;
		terms_and_conditions_link: string;
		sub_usecases?: Array<string> | null;
	};
	'compliance.campaign.setActive': {
		active: boolean;
	};
	'compliance.campaign.update': {
		help_message?: string | null;
		message_flow?: string | null;
		sample1?: string | null;
		sample2?: string | null;
		sample3?: string | null;
		sample4?: string | null;
		sample5?: string | null;
	};
	'compliance.uploadOptInEvidence': {
		file: FileInput;
	};
	'contacts.bulkDelete': {
		contact_ids: Array<string>;
	};
	'contacts.communicationPolicy.get': {
		contact_id: string;
		identity_id?: string | null;
	};
	'contacts.communicationPolicy.preview': {
		contact_id: string;
		identity_id: string;
	};
	'contacts.communicationPolicy.set': {
		contact_id: string;
		expected_revision: number;
		identity_id: string;
		addresses: Array<InkboxContactAddressUpdateInput>;
		visibility?: InkboxContactVisibilityPolicyInput | null;
	};
	'contacts.create': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		preferred_name?: string | null;
		name_prefix?: string | null;
		given_name?: string | null;
		middle_name?: string | null;
		family_name?: string | null;
		name_suffix?: string | null;
		company_name?: string | null;
		job_title?: string | null;
		birthday?: string | null;
		notes?: string | null;
		emails?: Array<InkboxContactEmailItemInput>;
		phones?: Array<InkboxContactPhoneItemRequestInput>;
		websites?: Array<InkboxContactWebsiteItemInput>;
		dates?: Array<InkboxContactDateItemInput>;
		addresses?: Array<InkboxContactAddressItemInput>;
		custom_fields?: Array<InkboxContactCustomFieldItemInput>;
		/** Deprecated. Non-null values are rejected; use contact communication policies instead. */
		access_identity_ids?: Array<string> | null;
	};
	'contacts.createWithPermissions': {
		preferred_name?: string | null;
		name_prefix?: string | null;
		given_name?: string | null;
		middle_name?: string | null;
		family_name?: string | null;
		name_suffix?: string | null;
		company_name?: string | null;
		job_title?: string | null;
		birthday?: string | null;
		notes?: string | null;
		emails?: Array<InkboxContactEmailItemInput>;
		phones?: Array<InkboxContactPhoneItemRequestInput>;
		websites?: Array<InkboxContactWebsiteItemInput>;
		dates?: Array<InkboxContactDateItemInput>;
		addresses?: Array<InkboxContactAddressItemInput>;
		custom_fields?: Array<InkboxContactCustomFieldItemInput>;
		/** Deprecated. Non-null values are rejected; use contact communication policies instead. */
		access_identity_ids?: Array<string> | null;
		/** Initial permissions for one agent, saved atomically. Requires an admin API key or the Console. */
		permissions:
			| InkboxContactInitialPermissionsInput
			| InkboxContactCreatePermissionsInput
			| InkboxContactInitialAccessInput;
	};
	'contacts.delete': {
		contact_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'contacts.exportVcard': {
		contact_id: string;
	};
	'contacts.exportVcards': {
		contact_ids: Array<string>;
	};
	'contacts.facts.create': {
		contact_id: string;
		content: string;
		kind: 'profile' | 'preference' | 'context';
	};
	'contacts.facts.delete': {
		contact_id: string;
		fact_id: string;
	};
	'contacts.facts.get': {
		contact_id: string;
		fact_id: string;
	};
	'contacts.facts.list': {
		contact_id: string;
		/** Include context memories whose deadline has passed. */
		include_expired?: boolean;
		limit?: number | null;
		offset?: number;
	};
	'contacts.facts.resolveCitation': {
		contact_id: string;
		fact_id: string;
		citation_id: string;
	};
	'contacts.facts.update': {
		contact_id: string;
		fact_id: string;
		content?: string | null;
		kind?: 'profile' | 'preference' | 'context' | null;
	};
	'contacts.get': {
		contact_id: string;
	};
	'contacts.getCorrespondence': {
		contact_id: string;
		/** Channels to include. Repeat the parameter or use comma-separated values. */
		channels?: Array<string>;
		after?: string | null;
		before?: string | null;
		limit_per_channel?: number;
		email_limit?: number | null;
		sms_limit?: number | null;
		imessage_limit?: number | null;
		calls_limit?: number | null;
		whatsapp_limit?: number | null;
		cursor?: string | null;
		order?: InkboxCorrespondenceOrderInput;
		content?: InkboxCorrespondenceContentModeInput;
		transcripts?: InkboxCorrespondenceTranscriptModeInput;
		include_failed?: boolean;
		identity_id?: string | null;
	};
	'contacts.import': {
		vcardPreviewHash?: string | null;
		/** The vCard text to import: one or more cards, UTF-8, at most 10 MiB and 2,500 cards. */
		vcard: string;
	};
	'contacts.list': {
		/** Case-insensitive substring match over name fields. */
		q?: string | null;
		limit?: number;
		offset?: number;
		order?: 'name' | 'recent';
		review_status?: Array<InkboxContactReviewStatusInput> | null;
	};
	'contacts.lookup': {
		email?: string | null;
		/** Substring match on stored email value (case-insensitive). */
		email_contains?: string | null;
		/** Suffix match on '@<domain>'. Leading '@' is tolerated. */
		email_domain?: string | null;
		phone?: string | null;
		/** Substring match on stored E.164 phone value. */
		phone_contains?: string | null;
	};
	'contacts.merge': {
		contact_id: string;
		losing_contact_ids: Array<string>;
		field_sources?: Record<string, string>;
	};
	'contacts.previewImport': {
		vcard: string;
	};
	'contacts.update': {
		contact_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		preferred_name?: string | null;
		name_prefix?: string | null;
		given_name?: string | null;
		middle_name?: string | null;
		family_name?: string | null;
		name_suffix?: string | null;
		company_name?: string | null;
		job_title?: string | null;
		birthday?: string | null;
		notes?: string | null;
		emails?: Array<InkboxContactEmailItemInput> | null;
		phones?: Array<InkboxContactPhoneItemRequestInput> | null;
		websites?: Array<InkboxContactWebsiteItemInput> | null;
		dates?: Array<InkboxContactDateItemInput> | null;
		addresses?: Array<InkboxContactAddressItemInput> | null;
		custom_fields?: Array<InkboxContactCustomFieldItemInput> | null;
		review_status?: InkboxContactReviewStatusInput | null;
	};
	'domains.create': {
		domain: string;
		apex_mx_acknowledged?: boolean;
	};
	'domains.delete': {
		domain_id: string;
	};
	'domains.forceDelete': {
		domain_id: string;
	};
	'domains.get': {
		domain_id: string;
	};
	'domains.getDnsRecords': {
		domain_id: string;
	};
	'domains.getHealth': {
		domain_id: string;
	};
	'domains.list': {
		/** Filter to rows in this lifecycle status. Omit to return every row in the org regardless of state. The mailbox-create dropdown reads from `?status=verified`. */
		status?: InkboxSendingDomainStatusInput | null;
	};
	'domains.restore': {
		domain_id: string;
	};
	'domains.rotateDkim': {
		domain_id: string;
	};
	'domains.setDefault': {
		domain_name: string;
	};
	'domains.verify': {
		domain_id: string;
	};
	'hostedChat.answerInteraction': {
		conversation_id: string;
		interaction_id: string;
		agent_handle: string;
		expected_version: number;
		response: InkboxApprovalAnswerInput | InkboxQuestionAnswerInput;
	};
	'hostedChat.conversations.create': {
		agent_handle: string;
		title?: string;
	};
	'hostedChat.conversations.get': {
		conversation_id: string;
		agent_handle: string;
	};
	'hostedChat.conversations.list': {
		agent_handle: string;
		after?: string | null;
		limit?: number;
		origin?: 'chat' | 'communication' | 'schedule' | null;
	};
	'hostedChat.conversations.listMessages': {
		conversation_id: string;
		agent_handle: string;
		after?: string | null;
		snapshot?: string | null;
		limit?: number;
	};
	'hostedChat.conversations.rename': {
		conversation_id: string;
		agent_handle: string;
		title?: string | null;
		permission_mode?: 'ask' | 'yolo' | null;
	};
	'hostedChat.files.download': {
		file_id: string;
		agent_handle: string;
	};
	'hostedChat.files.get': {
		file_id: string;
		agent_handle: string;
	};
	'hostedChat.files.upload': {
		agent_handle: string;
		name: string;
		media_type?: string;
		data_base64: string;
	};
	'hostedChat.getStatus': {
		agent_handle: string;
	};
	'hostedChat.turns.cancel': {
		conversation_id: string;
		turn_id: string;
		agent_handle: string;
	};
	'hostedChat.turns.create': {
		conversation_id: string;
		agent_handle: string;
		model?:
			| 'gpt-6-luna'
			| 'gpt-6.1-terra'
			| 'gpt-6.1-sol'
			| 'gpt-6-astra'
			| 'claude-haiku-5-5'
			| 'claude-sonnet-5-5'
			| 'claude-opus-5-5'
			| 'claude-fable-5-2'
			| 'deepseek-flash'
			| 'deepseek-v4-pro'
			| null;
		content: Array<InkboxTextContentInput | InkboxFileReferenceInput>;
	};
	'hostedChat.turns.get': {
		conversation_id: string;
		turn_id: string;
		agent_handle: string;
	};
	'hostedWorkspace.environment.get': {
		agent_handle: string;
	};
	'hostedWorkspace.environment.update': {
		agent_handle: string;
		expected_version: number;
		set?: Record<string, InkboxEnvironmentVariableInput>;
		remove?: Array<string>;
	};
	'hostedWorkspace.get': {
		agent_handle: string;
	};
	'hostedWorkspace.getOperation': {
		operation_id: string;
		agent_handle: string;
	};
	'hostedWorkspace.getUsage': {
		agent_handle: string;
	};
	'hostedWorkspace.getUsageHistory': {
		agent_handle: string;
		window?: '1h' | '24h' | '7d' | '30d';
	};
	'hostedWorkspace.ports.get': {
		agent_handle: string;
	};
	'hostedWorkspace.ports.rotateToken': {
		port: number;
		agent_handle: string;
	};
	'hostedWorkspace.ports.update': {
		agent_handle: string;
		/** The ``version`` last read; a changed version returns 409 ``stale_version``. */
		version: number;
		default_port?: number | null;
		ports?: Array<InkboxAgentPortSettingInput> | null;
	};
	'hostedWorkspace.resize': {
		agent_handle: string;
		/** v1-cpu4-ram8gb is available on paid plans. */
		shape_id: 'v1-cpu2-ram4gb' | 'v1-cpu4-ram8gb';
		expected_version: number;
		disk_bytes?: number | null;
	};
	'hostedWorkspace.runAction': {
		action: 'start' | 'stop' | 'pause' | 'resume';
		agent_handle: string;
	};
	'hostedWorkspace.schedules.create': {
		agent_handle: string;
		expected_revision: number;
		fields?: InkboxScheduleFieldsInput;
	};
	'hostedWorkspace.schedules.delete': {
		schedule_id: string;
		agent_handle: string;
		expected_revision: number;
		fields?: InkboxScheduleFieldsInput;
	};
	'hostedWorkspace.schedules.list': {
		agent_handle: string;
		after?: string | null;
		limit?: number;
	};
	'hostedWorkspace.schedules.listOccurrences': {
		schedule_id: string;
		agent_handle: string;
	};
	'hostedWorkspace.schedules.preview': {
		agent_handle: string;
		timing: InkboxScheduleTimingInput;
	};
	'hostedWorkspace.schedules.update': {
		schedule_id: string;
		agent_handle: string;
		expected_revision: number;
		fields?: InkboxScheduleFieldsInput;
	};
	'hostedWorkspace.terminals.close': {
		terminal_id: string;
		agent_handle: string;
	};
	'hostedWorkspace.terminals.create': {
		agent_handle: string;
		argv?: Array<string>;
		env?: Record<string, string>;
		cwd?: string;
		timeout_ms?: number;
		output_limit_bytes?: number;
		pty?: InkboxTerminalSizeInput;
	};
	'hostedWorkspace.terminals.createTicket': {
		terminal_id: string;
		agent_handle: string;
	};
	'hostedWorkspace.terminals.list': {
		agent_handle: string;
		after?: string | null;
		limit?: number;
	};
	'hosting.callTool': {
		agent_handle: string;
		jsonrpc: '2.0';
		id?: (string | number) | null;
		method: string;
		params?: Record<string, InkboxJsonValueInput>;
	};
	'hosting.deliveries.list': {
		agent_handle: string;
		before?: string | null;
	};
	'hosting.deliveries.retry': {
		delivery_id: string;
		agent_handle: string;
	};
	'hosting.get': {
		agent_handle: string;
	};
	'hosting.set': {
		agent_handle: string;
		expected_generation: number;
		enabled?: boolean;
		harness?:
			| 'codex'
			| 'hermes'
			| 'claude_code'
			| 'opencode'
			| 'deepseek'
			| 'openclaw'
			| null;
		tier?: 'medium' | null;
		/** Initial compute shape; defaults to v1-cpu2-ram4gb. v1-cpu4-ram8gb is available on paid plans. Use workspace resize to change an existing computer. */
		shape_id?: 'v1-cpu2-ram4gb' | 'v1-cpu4-ram8gb' | null;
		default_model?:
			| 'gpt-6-luna'
			| 'gpt-6.1-terra'
			| 'gpt-6.1-sol'
			| 'gpt-6-astra'
			| 'claude-haiku-5-5'
			| 'claude-sonnet-5-5'
			| 'claude-opus-5-5'
			| 'claude-fable-5-2'
			| 'deepseek-flash'
			| 'deepseek-v4-pro'
			| null;
		instructions?: string | null;
		trigger_events?: Array<
			| InkboxMailWebhookEventTypeInput
			| InkboxPhoneTextWebhookEventTypeInput
			| InkboxPhoneCallLifecycleWebhookEventTypeInput
			| InkboxIMessageWebhookEventTypeInput
			| InkboxMessageTranscriptionEventTypeInput
			| InkboxWhatsAppWebhookEventTypeInput
			| InkboxA2AWebhookEventTypeInput
			| InkboxSlackWebhookEventTypeInput
		> | null;
		/** Legacy reset shortcut; true selects the current defaults. No automatic following. */
		follow_defaults?: boolean | null;
		/** Omit to preserve the current key. Null selects included credits; a UUID selects a saved key. */
		credential_binding_id?: string | null;
		/** Automatic idle shutdown is required; only true is accepted. */
		idle_stop_enabled?: true | null;
		reset_instructions?: boolean;
		/** Sleep after 1 or 5 minutes of inactivity. New agents default to 60 seconds. */
		idle_timeout_seconds?: 60 | 300 | null;
	};
	'identities.avatar.delete': {
		agent_handle: string;
	};
	'identities.avatar.get': {
		agent_handle: string;
	};
	'identities.avatar.getMetadata': {
		agent_handle: string;
	};
	'identities.avatar.setFromStagedMedia': {
		agent_handle: string;
		staged_media_handle: string;
	};
	'identities.avatar.upload': {
		agent_handle: string;
		file: FileInput;
	};
	'identities.companion.get': {
		agent_handle: string;
	};
	'identities.companion.getHistory': {
		activation_id: string;
		agent_handle: string;
		limit?: number;
		cursor?: string | null;
	};
	'identities.companion.listConversations': {
		agent_handle: string;
		channel?: 'mail' | 'phone' | 'imessage' | 'slack' | 'whatsapp' | null;
		limit?: number;
		offset?: number;
	};
	'identities.companion.update': {
		agent_handle: string;
		enabled?: boolean;
	};
	'identities.connectImessageNumber': {
		agent_handle: string;
		imessage_number_id: string;
	};
	'identities.contactAccess.get': {
		contact_id: string;
		agent_handle: string;
	};
	'identities.contactAccess.update': {
		contact_id: string;
		agent_handle: string;
		email?: InkboxContactChannelAccessUpdateInput;
		phone?: InkboxContactChannelAccessUpdateInput;
		profile?: boolean;
		memories?: boolean;
	};
	'identities.contactPermissions.get': {
		contact_id: string;
		agent_handle: string;
	};
	'identities.contactPermissions.list': {
		agent_handle: string;
		q?: string | null;
		limit?: number;
		offset?: number;
		order?: 'name' | 'recent';
		review_status?: Array<InkboxContactReviewStatusInput> | null;
	};
	'identities.contactPermissions.update': {
		contact_id: string;
		agent_handle: string;
		emails?: Record<string, boolean>;
		phones?: Record<string, boolean>;
		inbound_emails?: Record<string, boolean>;
		outbound_emails?: Record<string, boolean>;
		inbound_phones?: Record<string, boolean>;
		outbound_phones?: Record<string, boolean>;
		profile?: boolean;
		memories?: boolean;
	};
	'identities.create': {
		/** Agent handle for the identity. A leading '@' is stripped automatically and the handle must be globally unique. */
		agent_handle: string;
		/** Human-readable display name for the identity. Defaults to agent_handle if omitted. */
		display_name?: string | null;
		/** Free-form description of what the identity is. Visible only to your org. */
		description?: string | null;
		/** Whether this identity can be reached through the shared iMessage service. Defaults to false; set true to opt in. */
		imessage_enabled?: boolean;
		/** Whether this identity can be reached through WhatsApp. Defaults to false; set true to opt in. Paid plans include WhatsApp through shared numbers on one agent; other WhatsApp access is invite-only while in beta. */
		whatsapp_enabled?: boolean;
		/** Whether an attached dedicated iMessage line automatically shares this identity's name and optional avatar. Defaults to true. */
		contact_sharing_enabled?: boolean;
		/** Claim and attach a dedicated iMessage line during identity creation. Requires imessage_enabled=true. */
		claim_imessage_number?: true | null;
		/** Optional mailbox-spec; the mailbox is always created. Omit to default to the org's sending domain with a server-chosen local part. */
		mailbox?: InkboxAgentIdentityMailboxCreateRequestInput | null;
		/** Optional tunnel-spec. Unless `hosted` is true, the tunnel is provisioned with name = agent_handle; this body only opts into PASSTHROUGH or sets a description. */
		tunnel?: InkboxAgentIdentityTunnelCreateRequestInput | null;
		/** Create the identity for an Inkbox-hosted agent. Hosted agents receive events without a tunnel, so none is created and `tunnel` must be omitted. */
		hosted?: boolean;
		/** Optional phone-number provisioning payload to create and link a phone number to the identity during identity creation. */
		phone_number?: InkboxAgentIdentityPhoneNumberCreateRequestInput | null;
		/** Optional vault secret attachment request to scope vault secret access to the newly created agent identity. */
		vault_secret_ids?: (string | Array<string> | '*' | 'all') | null;
	};
	'identities.createTunnel': {
		agent_handle: string;
	};
	'identities.delete': {
		agent_handle: string;
	};
	'identities.disconnectImessageNumber': {
		agent_handle: string;
	};
	'identities.domainAffiliation.get': {
		agent_handle: string;
	};
	'identities.domainAffiliation.remove': {
		agent_handle: string;
	};
	'identities.domainAffiliation.set': {
		agent_handle: string;
		domain_claim_id: string;
	};
	'identities.get': {
		agent_handle: string;
	};
	'identities.getChannelStatus': {
		agent_handle: string;
	};
	'identities.getCurrent': Record<string, never>;
	'identities.list': Record<string, never>;
	'identities.listContactCommunicationPolicies': {
		agent_handle: string;
		limit?: number;
		offset?: number;
	};
	'identities.mailContactRules.create': {
		agent_handle: string;
		direction?: InkboxRuleDirectionInput;
		action: InkboxMailRuleActionInput;
		match_type: InkboxMailRuleMatchTypeInput;
		/** What the rule matches against. For EXACT_EMAIL: a full email address (stored lowercased). For DOMAIN: a bare domain like 'gmail.com'. */
		match_target: string;
	};
	'identities.mailContactRules.delete': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.mailContactRules.get': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.mailContactRules.list': {
		agent_handle: string;
		/** Filter by allow or block. */
		action?: InkboxMailRuleActionInput | null;
		/** Filter by exact_email or domain. */
		match_type?: InkboxMailRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'identities.mailContactRules.update': {
		rule_id: string;
		agent_handle: string;
		action?: InkboxMailRuleActionInput | null;
		direction?: InkboxRuleDirectionInput | null;
		apply_to?: 'inbound' | 'outbound' | null;
	};
	'identities.phoneContactRules.create': {
		agent_handle: string;
		direction?: InkboxRuleDirectionInput;
		action: InkboxPhoneRuleActionInput;
		/** Match type (only 'exact_number' in v1). */
		match_type?: InkboxPhoneRuleMatchTypeInput;
		/** Phone number to match, in E.164 format. */
		match_target: string;
	};
	'identities.phoneContactRules.delete': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.phoneContactRules.get': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.phoneContactRules.list': {
		agent_handle: string;
		/** Filter by allow or block. */
		action?: InkboxPhoneRuleActionInput | null;
		/** Filter by match type (only 'exact_number' in v1). */
		match_type?: InkboxPhoneRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'identities.phoneContactRules.update': {
		rule_id: string;
		agent_handle: string;
		action?: InkboxPhoneRuleActionInput | null;
		direction?: InkboxRuleDirectionInput | null;
		apply_to?: 'inbound' | 'outbound' | null;
	};
	'identities.releasePhoneNumber': {
		agent_handle: string;
	};
	'identities.signingKey.createOrRotate': {
		agent_handle: string;
	};
	'identities.signingKey.getStatus': {
		agent_handle: string;
	};
	'identities.slackContactRules.create': {
		agent_handle: string;
		direction?: InkboxRuleDirectionInput;
		action: InkboxSlackRuleActionInput;
		match_type: InkboxSlackRuleMatchTypeInput;
		match_target: string;
	};
	'identities.slackContactRules.delete': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.slackContactRules.get': {
		rule_id: string;
		agent_handle: string;
	};
	'identities.slackContactRules.list': {
		agent_handle: string;
		/** Filter by allow or block. */
		action?: InkboxSlackRuleActionInput | null;
		/** Filter by exact_user or workspace. */
		match_type?: InkboxSlackRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'identities.slackContactRules.update': {
		rule_id: string;
		agent_handle: string;
		action?: InkboxSlackRuleActionInput | null;
		direction?: InkboxRuleDirectionInput | null;
		apply_to?: 'inbound' | 'outbound' | null;
	};
	'identities.update': {
		agent_handle: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** New human-readable display name for the identity. Omit to leave unchanged; send null to clear. */
		display_name?: string | null;
		/** New free-form description of what the identity is. Omit to leave unchanged; send null to clear. */
		description?: string | null;
		/** Whether this identity can be reached through the shared iMessage service. Omit to leave unchanged. */
		imessage_enabled?: boolean | null;
		/** Whether this identity can be reached through WhatsApp shared numbers and routers. Omit to leave unchanged. */
		whatsapp_enabled?: boolean | null;
		/** Whether an attached dedicated iMessage line automatically shares this identity's name and optional avatar. Omit to leave unchanged. */
		contact_sharing_enabled?: boolean | null;
		/** Dedicated iMessage number to attach. Send a number UUID to attach or atomically swap from the current dedicated number, null to move to the shared service, or omit to leave unchanged. Available to admin-scoped API keys and JWT callers. */
		imessage_number_id?: string | null;
		/** Claim and attach a dedicated iMessage line. Omit to avoid provisioning. Requires an Idempotency-Key header when supplied. */
		claim_imessage_number?: true | null;
		/** Alias of phone_filter_mode for the shared SMS, calls, and iMessage list. Manage with admin credentials or through the Console; omit to leave unchanged. */
		imessage_filter_mode?: InkboxFilterModeInput | null;
		/** Whitelist/blacklist mode for this identity's mail contact rules. Manage with admin credentials or through the Console; omit to leave unchanged. */
		mail_filter_mode?: InkboxFilterModeInput | null;
		/** Whitelist/blacklist mode for this identity's SMS, calls, and iMessage list. Manage with admin credentials or through the Console; omit to leave unchanged. */
		phone_filter_mode?: InkboxFilterModeInput | null;
		/** Shared Slack whitelist or blacklist mode; resets directional overrides. */
		slack_filter_mode?: InkboxFilterModeInput | null;
		/** Slack inbound whitelist or blacklist mode. */
		slack_inbound_filter_mode?: InkboxFilterModeInput | null;
		/** Slack outbound whitelist or blacklist mode. */
		slack_outbound_filter_mode?: InkboxFilterModeInput | null;
		/** Email receiving mode. Omit to leave unchanged; null is not accepted. */
		mail_inbound_filter_mode?: InkboxFilterModeInput | null;
		/** Email sending mode. Omit to leave unchanged; null is not accepted. */
		mail_outbound_filter_mode?: InkboxFilterModeInput | null;
		/** Receiving mode for calls, SMS and iMessage. Omit to leave unchanged; null is not accepted. */
		phone_inbound_filter_mode?: InkboxFilterModeInput | null;
		/** Sending mode for calls, SMS and iMessage. Omit to leave unchanged; null is not accepted. */
		phone_outbound_filter_mode?: InkboxFilterModeInput | null;
	};
	'imessage.assignments.list': {
		/** Narrow to one agent identity. Ignored for agent-scoped keys (always their own identity). */
		agent_identity_id?: string | null;
		limit?: number;
		offset?: number;
	};
	'imessage.assignments.release': {
		assignment_id: string;
	};
	'imessage.checkCapability': {
		/** Recipient phone number in E.164 format. */
		number: string;
	};
	'imessage.connect': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		agent_identity_id: string;
		/** Phone number in E.164 format (e.g. '+15551234567'). */
		recipient_number: string;
		first_message?: string | null;
	};
	'imessage.contactRules.create': {
		agent_handle: string;
		direction?: InkboxRuleDirectionInput;
		action: InkboxIMessageRuleActionInput;
		/** Match type (only 'exact_number' in v1). */
		match_type?: InkboxIMessageRuleMatchTypeInput;
		/** Phone number to match, in E.164 format. */
		match_target: string;
	};
	'imessage.contactRules.delete': {
		rule_id: string;
		agent_handle: string;
	};
	'imessage.contactRules.get': {
		rule_id: string;
		agent_handle: string;
	};
	'imessage.contactRules.list': {
		agent_handle: string;
		/** Filter by allow or block. */
		action?: InkboxIMessageRuleActionInput | null;
		/** Filter by match type (only 'exact_number' in v1). */
		match_type?: InkboxIMessageRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		limit?: number;
		offset?: number;
	};
	'imessage.contactRules.listForOrg': {
		/** Narrow to one agent identity. Omit to list across every visible identity. */
		agent_identity_id?: string | null;
		/** Filter by allow or block. */
		action?: InkboxIMessageRuleActionInput | null;
		/** Filter by match type (only 'exact_number' in v1). */
		match_type?: InkboxIMessageRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		limit?: number;
		offset?: number;
	};
	'imessage.contactRules.update': {
		rule_id: string;
		agent_handle: string;
		action?: InkboxIMessageRuleActionInput | null;
		direction?: InkboxRuleDirectionInput | null;
		apply_to?: 'inbound' | 'outbound' | null;
	};
	'imessage.conversations.get': {
		conversation_id: string;
		agent_identity_id?: string | null;
	};
	'imessage.conversations.getThread': {
		conversation_id: string;
		thread_id: string;
		agent_identity_id?: string | null;
		limit?: number;
		cursor?: string | null;
	};
	'imessage.conversations.list': {
		agent_identity_id?: string | null;
		limit?: number;
		offset?: number;
		is_blocked?: boolean | null;
		include_groups?: boolean;
		participants?: Array<string> | null;
		contact_id?: string | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'imessage.disconnect': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		agent_identity_id: string;
		/** Phone number in E.164 format (e.g. '+15551234567'). */
		recipient_number: string;
	};
	'imessage.getMediaPlayback': {
		media_id: string;
		agent_identity_id?: string | null;
	};
	'imessage.getOnboarding': {
		agent_identity_id?: string | null;
	};
	'imessage.getTriageNumber': {
		/** Resolve the connect command + link/QR for this agent identity. Org-wide callers (admin keys / JWT) may pass any identity in the org; agent-scoped keys may only pass their own. */
		agent_identity_id?: string | null;
	};
	'imessage.markRead': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		conversation_id: string;
		recipient?: string | null;
	};
	'imessage.messages.get': {
		message_id: string;
		agent_identity_id?: string | null;
	};
	'imessage.messages.getThread': {
		message_id: string;
		agent_identity_id?: string | null;
		limit?: number;
		cursor?: string | null;
	};
	'imessage.messages.list': {
		agent_identity_id?: string | null;
		conversation_id?: string | null;
		thread_id?: string | null;
		include_groups?: boolean;
		limit?: number;
		offset?: number;
		is_read?: boolean | null;
		is_blocked?: boolean | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'imessage.messages.send': {
		/** Agent identity to send as. Required for org-wide callers when sending by `to`; ignored for agent-scoped keys. */
		agent_identity_id?: string | null;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Use idempotency-replay with Idempotency-Key to replay the original send result. */
		prefer?: string | null;
		/** One recipient or a list of 1–8 recipients. Lists with two or more members start or select a best-known exact-membership group. Mutually exclusive with conversation_id. */
		to?: (string | Array<string>) | null;
		/** Existing conversation to reply into. Mutually exclusive with to. */
		conversation_id?: string | null;
		/** Message to reply to within conversation_id. Omit for an ordinary message. */
		reply_to_message_id?: string | null;
		/** Allow an ordinary message in the same conversation when, before sending, the reply target is known to use SMS, RCS, or downgraded transport, or is a text-only inbound reaction notice that cannot anchor a native reply. Set false to require a native reply. A native reply the provider definitely… */
		plain_reply_fallback?: boolean;
		text?: string | null;
		media_urls?: Array<string> | null;
		staged_media?: Array<InkboxStagedIMessageMediaBindingInput>;
		send_style?: InkboxIMessageSendStyleInput | null;
		/** Speak text in the agent's hosted voice and send it as a native iMessage voice note instead of text. Text is required, is limited to 600 characters, and cannot be combined with media. */
		send_as_voice_note?: boolean;
		/** When a voice note can't be produced before the message is accepted, for example because the text is longer than 600 characters, send the text as an ordinary message instead. Set false to fail the request. Ignored unless send_as_voice_note is true. */
		fallback_to_text?: boolean;
	};
	'imessage.numbers.claim': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'imessage.numbers.list': Record<string, never>;
	'imessage.reactions.remove': {
		reaction_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'imessage.reactions.send': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Received message ID. A media-only attachment resolves to its original multipart message and part; the response identifies that canonical target. For text with attachments, use the original message ID and an explicit part_index. */
		message_id: string;
		reaction: InkboxIMessageSendableReactionTypeInput;
		/** Part of the original multipart message. Use 0 for an individual attachment message ID; its part is resolved automatically. */
		part_index?: number;
	};
	'imessage.router.get': Record<string, never>;
	'imessage.router.getAvatar': Record<string, never>;
	'imessage.router.getConversation': {
		conversation_id: string;
	};
	'imessage.router.listConversations': {
		limit?: number;
		cursor?: string | null;
	};
	'imessage.router.listMessages': {
		conversation_id: string;
		limit?: number;
		cursor?: string | null;
	};
	'imessage.router.update': {
		vcard_display_name?: string | null;
		vcard_company_name?: string | null;
		vcard_email_address?: string | null;
		vcard_note?: string | null;
		contact_sharing_enabled?: boolean | null;
		welcome_message?: string | null;
		help_message?: string | null;
		include_agent_email_in_contact_card?: boolean | null;
		include_agent_note_in_contact_card?: boolean | null;
		connect_reply_template?: string | null;
		reconnect_reply_template?: string | null;
	};
	'imessage.router.updateConnectOnboarding': {
		send_first_contact_onboarding_on_connect: boolean;
	};
	'imessage.sendTyping': {
		conversation_id: string;
	};
	'imessage.uploadMedia': {
		file: FileInput;
	};
	'inbound.checkSignature': {
		agent_handle: string;
		signature?: InkboxInboundSignatureInput | null;
		/** Check against this source's saved settings instead. */
		source_id?: string | null;
		headers: Record<string, string>;
		body: string;
		body_encoding?: 'utf8' | 'base64';
	};
	'inbound.events.get': {
		source_id: string;
		event_id: string;
		agent_handle: string;
	};
	'inbound.events.list': {
		source_id: string;
		agent_handle: string;
		limit?: number;
		cursor?: string | null;
	};
	'inbound.events.replay': {
		source_id: string;
		event_id: string;
		agent_handle: string;
	};
	'inbound.events.reportResult': {
		source_id: string;
		event_id: string;
		agent_handle: string;
		status: 'failed';
		error: string;
		/** The ``delivery_id`` of the delivery being reported. */
		delivery_id: string;
	};
	'inbound.sources.create': {
		agent_handle: string;
		name: string;
		signature?: InkboxInboundSignatureInput | null;
		handler?: InkboxAgentHandlerInput | InkboxScriptHandlerInput;
	};
	'inbound.sources.delete': {
		source_id: string;
		agent_handle: string;
	};
	'inbound.sources.get': {
		source_id: string;
		agent_handle: string;
	};
	'inbound.sources.list': {
		agent_handle: string;
	};
	'inbound.sources.rotate': {
		source_id: string;
		agent_handle: string;
	};
	'inbound.sources.update': {
		source_id: string;
		agent_handle: string;
		name?: string | null;
		signature?: InkboxInboundSignatureInput | null;
		handler?: (InkboxAgentHandlerInput | InkboxScriptHandlerInput) | null;
	};
	'mail.drafts.addAttachments': {
		draft_id: string;
		email_address: string;
		generation: number;
		attachments: Array<InkboxAttachmentUploadInput>;
	};
	'mail.drafts.create': {
		email_address: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		recipients?: InkboxDraftRecipientsInput;
		subject?: string | null;
		body_text?: string | null;
		body_html?: string | null;
		reply_to?: string | null;
		thread_id?: string | null;
		in_reply_to_message_id?: string | null;
		references?: Array<string> | null;
		attachments?: Array<InkboxAttachmentUploadInput> | null;
		track_opens?: boolean;
		forward_message_id?: string | null;
		forward_mode?: InkboxForwardModeInput;
		include_original_attachments?: boolean;
		forward_note_text?: string | null;
		forward_note_html?: string | null;
	};
	'mail.drafts.delete': {
		draft_id: string;
		email_address: string;
		generation: number;
	};
	'mail.drafts.duplicate': {
		draft_id: string;
		email_address: string;
		generation: number;
	};
	'mail.drafts.get': {
		draft_id: string;
		email_address: string;
	};
	'mail.drafts.getAttachment': {
		draft_id: string;
		part_index: number;
		email_address: string;
		generation: number;
	};
	'mail.drafts.list': {
		email_address: string;
		cursor?: string | null;
		limit?: number;
	};
	'mail.drafts.removeAttachment': {
		draft_id: string;
		part_index: number;
		email_address: string;
		generation: number;
	};
	'mail.drafts.send': {
		draft_id: string;
		email_address: string;
		generation: number;
	};
	'mail.drafts.update': {
		draft_id: string;
		email_address: string;
		generation: number;
		recipients?: InkboxDraftRecipientsInput | null;
		subject?: string | null;
		body_text?: string | null;
		body_html?: string | null;
		reply_to?: string | null;
		thread_id?: string | null;
		in_reply_to_message_id?: string | null;
		references?: Array<string> | null;
		track_opens?: boolean;
		forward_note_text?: string | null;
		forward_note_html?: string | null;
	};
	'mail.imports.cancel': {
		job_id: string;
		email_address: string;
	};
	'mail.imports.create': {
		email_address: string;
		source_format?: InkboxMailImportFormatInput;
		original_addresses?: Array<string> | null;
		mark_as_read?: boolean;
	};
	'mail.imports.get': {
		job_id: string;
		email_address: string;
	};
	'mail.imports.list': {
		email_address: string;
		cursor?: string | null;
		limit?: number;
	};
	'mail.imports.reissueUploadUrl': {
		job_id: string;
		email_address: string;
	};
	'mail.imports.start': {
		job_id: string;
		email_address: string;
	};
	'mail.listOrgContactRules': {
		/** Narrow to a single agent identity. Omit to list across every identity in the org. */
		agent_identity_id?: string | null;
		/** Filter by allow or block. */
		action?: InkboxMailRuleActionInput | null;
		/** Filter by exact_email or domain. */
		match_type?: InkboxMailRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'mail.mailboxes.get': {
		email_address: string;
		include_unread_count?: boolean;
	};
	'mail.mailboxes.getById': {
		mailbox_id: string;
		include_unread_count?: boolean;
	};
	'mail.mailboxes.list': {
		limit?: number | null;
		offset?: number;
		include_unread_count?: boolean;
	};
	'mail.mailboxes.update': {
		email_address: string;
		/** Contact-rule filter mode. 'whitelist' = only counterparties matching an active rule are allowed; 'blacklist' = all counterparties are allowed except those matching an active rule. Applies symmetrically to inbound receipt and outbound send. Modifying this field requires an admin-scoped API key.… */
		filter_mode?: InkboxFilterModeInput | null;
		/** HTML signature fragment. Sanitized before saving. Null clears it; omitted fields are unchanged. When supplied without signature_text, a plain-text fallback is generated. Images require absolute HTTPS URLs. */
		signature_html?: string | null;
		/** Plain-text signature. Null clears it; omitted fields are unchanged unless HTML is updated. When null, sending derives text from signature_html if present. */
		signature_text?: string | null;
		/** Automatically insert the saved signature when the organization has custom signatures enabled. Defaults to false. Omit to leave unchanged; null is rejected. */
		signature_enabled?: boolean | null;
	};
	'mail.messages.delete': {
		message_id: string;
		email_address: string;
	};
	'mail.messages.forward': {
		message_id: string;
		email_address: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Use idempotency-replay with Idempotency-Key to replay the original send result. */
		prefer?: string | null;
		recipients: InkboxRecipientsInput;
		mode?: InkboxForwardModeInput;
		subject?: string | null;
		body_text?: string | null;
		body_html?: string | null;
		additional_attachments?: Array<InkboxAttachmentUploadInput> | null;
		additional_staged_attachments?: Array<InkboxStagedAttachmentReferenceInput> | null;
		include_original_attachments?: boolean;
		reply_to?: string | null;
		/** Embed an open-tracking pixel in the forward's HTML body. The outgoing forward must have an HTML part (the caller note in wrapped mode; caller note or original HTML in inline mode); rejected with 422 otherwise. */
		track_opens?: boolean;
	};
	'mail.messages.get': {
		message_id: string;
		email_address: string;
	};
	'mail.messages.getAttachment': {
		message_id: string;
		filename: string;
		email_address: string;
	};
	'mail.messages.list': {
		email_address: string;
		cursor?: string | null;
		limit?: number;
		direction?: InkboxMessageDirectionInput | null;
		/** Filter by thread folder. Omit to list all. */
		folder?: InkboxThreadFolderInput | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'mail.messages.replyAll': {
		message_id: string;
		email_address: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Use idempotency-replay with Idempotency-Key to replay the original send result. */
		prefer?: string | null;
		subject?: string | null;
		body_text?: string | null;
		body_html?: string | null;
		attachments?: Array<InkboxAttachmentUploadInput> | null;
		staged_attachments?: Array<InkboxStagedAttachmentReferenceInput> | null;
		reply_to?: string | null;
		approved_recipients?: InkboxRecipientsInput | null;
		track_opens?: boolean;
	};
	'mail.messages.search': {
		email_address: string;
		/** Search query */
		q: string;
		limit?: number;
	};
	'mail.messages.send': {
		email_address: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Use idempotency-replay with Idempotency-Key to replay the original send result. */
		prefer?: string | null;
		recipients: InkboxRecipientsInput;
		subject: string;
		body_text?: string | null;
		body_html?: string | null;
		/** Attach this message to an existing conversation. Preferred over in_reply_to_message_id when replying; pass the thread_id returned by the list/get endpoints. */
		thread_id?: string | null;
		/** Message-ID of the email being replied to */
		in_reply_to_message_id?: string | null;
		attachments?: Array<InkboxAttachmentUploadInput> | null;
		staged_attachments?: Array<InkboxStagedAttachmentReferenceInput> | null;
		/** Optional Reply-To address. If set, recipients' mail clients route replies here instead of the From mailbox. */
		reply_to?: string | null;
		/** Embed an open-tracking pixel in the HTML body. Requires body_html; a send with track_opens and no HTML body is rejected with 422. Opens surface as first_opened_at/open_count on the message. Note: tracking pixels can raise spam scores. */
		track_opens?: boolean;
	};
	'mail.messages.updateFlags': {
		message_id: string;
		email_address: string;
		is_read?: boolean | null;
		is_starred?: boolean | null;
	};
	'mail.threads.delete': {
		thread_id: string;
		email_address: string;
	};
	'mail.threads.get': {
		thread_id: string;
		email_address: string;
	};
	'mail.threads.list': {
		email_address: string;
		/** Filter by folder. Omit to list all. */
		folder?: InkboxThreadFolderInput | null;
		cursor?: string | null;
		limit?: number;
		participants?: Array<string> | null;
		contact_id?: string | null;
	};
	'mail.threads.listFolders': {
		email_address: string;
	};
	'mail.threads.update': {
		thread_id: string;
		email_address: string;
		folder?: InkboxThreadFolderInput | null;
	};
	'mail.visibleMessages.delete': {
		message_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'mail.visibleMessages.get': {
		message_id: string;
		max_body_chars?: number;
	};
	'mail.visibleMessages.getAttachment': {
		message_id: string;
		attachment_ref: string;
	};
	'mail.visibleMessages.list': {
		mailbox_id?: string | null;
		cursor?: string | null;
		limit?: number;
		direction?: InkboxMessageDirectionInput | null;
		folder?: InkboxThreadFolderInput | null;
		unread_only?: boolean;
	};
	'mail.visibleMessages.search': {
		/** Search query */
		q: string;
		mailbox_id?: string | null;
		limit?: number;
	};
	'mail.visibleMessages.updateFlags': {
		message_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		is_read?: boolean | null;
		is_starred?: boolean | null;
	};
	'mail.visibleThreads.delete': {
		thread_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'mail.visibleThreads.get': {
		thread_id: string;
		limit?: number;
	};
	'mail.visibleThreads.list': {
		mailbox_id?: string | null;
		folder?: InkboxThreadFolderInput | null;
		cursor?: string | null;
		limit?: number;
		participants?: Array<string> | null;
		contact_id?: string | null;
	};
	'mail.visibleThreads.update': {
		thread_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		folder?: InkboxThreadFolderInput | null;
	};
	'messageSends.lookup': {
		sender_kind:
			| 'mailbox'
			| 'phone_number'
			| 'imessage_identity'
			| 'whatsapp_identity';
		sender_id: string;
		operation:
			| 'mail.send'
			| 'mail.reply'
			| 'mail.reply_all'
			| 'mail.forward'
			| 'text.send'
			| 'imessage.send'
			| 'whatsapp.send';
		/** The Idempotency-Key the earlier request was sent with. */
		idempotencyKey: string;
	};
	'notes.access.grant': {
		note_id: string;
		identity_id: string;
	};
	'notes.access.list': {
		note_id: string;
	};
	'notes.access.revoke': {
		note_id: string;
		identity_id: string;
	};
	'notes.create': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		title?: string | null;
		body: string;
	};
	'notes.delete': {
		note_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'notes.get': {
		note_id: string;
	};
	'notes.list': {
		/** Full-text query against title + body. */
		q?: string | null;
		/** Filter to notes granted to this identity (joins against the note_access table). */
		identity_id?: string | null;
		limit?: number;
		offset?: number;
		order?: 'recent' | 'created';
	};
	'notes.update': {
		note_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		title?: string | null;
		body?: string | null;
	};
	'organizationDomains.create': {
		domain: string;
	};
	'organizationDomains.delete': {
		claim_id: string;
	};
	'organizationDomains.get': {
		claim_id: string;
	};
	'organizationDomains.list': {
		cursor?: string | null;
		limit?: number;
	};
	'organizationDomains.verify': {
		claim_id: string;
	};
	'phone.calls.get': {
		call_id: string;
	};
	'phone.calls.getSettings': {
		agent_identity_id?: string | null;
	};
	'phone.calls.hangup': {
		call_id: string;
		async_command?: boolean;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'phone.calls.list': {
		/** Agent identity to list calls for. Agent-scoped keys resolve their own; required for admin/JWT. */
		agent_identity_id?: string | null;
		limit?: number;
		offset?: number;
		is_blocked?: boolean | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'phone.calls.listMcpActivity': {
		call_id: string;
		limit?: number;
		offset?: number;
	};
	'phone.calls.listToolInvocations': {
		call_id: string;
		limit?: number;
		offset?: number;
	};
	'phone.calls.listTranscripts': {
		call_id: string;
	};
	'phone.calls.place': {
		async_command?: boolean;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Line backing the call: dedicated_number | shared_imessage_number | dedicated_imessage_number. The dedicated iMessage line calls anyone (contact rules only) and surfaces its number as caller ID. */
		origination?: InkboxCallOriginInput;
		/** Source phone number, in E.164 format. Required for dedicated_number origination. */
		from_number?: string | null;
		/** Destination phone number to dial, in E.164 format. */
		to_number: string;
		/** Agent identity placing the call (required for shared_imessage_number under admin/JWT). */
		agent_identity_id?: string | null;
		/** WebSocket URL (wss://) for audio bridging. Falls back to phone number's client_websocket_url. */
		client_websocket_url?: string | null;
		/** Who runs the call: client_websocket (your agent over the media WebSocket, default) or hosted_agent (the platform-hosted call agent). */
		mode?: InkboxCallModeInput;
		/** Optional hosted-agent data-scope override: contact_scoped or yolo. Omit to inherit the identity's saved default. */
		hosted_agent_authority_mode?: InkboxHostedAgentAuthorityModeInput | null;
		/** Seconds to wait for recipient speech before a proactive hosted outbound greeting. Omit or send null for 1.5 seconds; 0 opens immediately. Only valid with mode=hosted_agent. Recipient speech cancels the proactive greeting; this is not a delay before every reply. */
		outbound_greeting_wait_seconds?: number | null;
		/** What to do when the call reaches voicemail. leave_message (default with mode=hosted_agent) has the hosted agent leave a message after the beep, then end the call; hang_up (default otherwise) ends the call once a voicemail beep is detected; ignore turns detection off and treats whatever answers… */
		on_voicemail?: InkboxOnVoicemailInput | null;
		/** What the hosted agent should say when leaving a voicemail. Only valid with on_voicemail=leave_message; when omitted, the agent composes a short message from reason. */
		voicemail_message?: string | null;
		/** Deprecated: use on_voicemail. enabled is on_voicemail=hang_up and disabled is on_voicemail=ignore. */
		voicemail_detection?: InkboxVoicemailDetectionInput;
		/** Task brief for the hosted agent, e.g. what to accomplish on the call. Required with mode=hosted_agent; invalid otherwise. */
		reason?: string | null;
	};
	'phone.incomingCallAction.get': {
		agent_identity_id?: string | null;
	};
	'phone.incomingCallAction.set': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		incoming_call_action: InkboxIncomingCallActionInput;
		agent_identity_id?: string | null;
		client_websocket_url?: string | null;
		incoming_call_webhook_url?: string | null;
		forwarding_target_type?: InkboxForwardingTargetTypeInput | null;
		forwarding_phone_number?: string | null;
		forwarding_sip_uri?: string | null;
	};
	'phone.listOrgContactRules': {
		/** Narrow to a single agent identity. Omit to list across every identity in the org. */
		agent_identity_id?: string | null;
		/** Filter by allow or block. */
		action?: InkboxPhoneRuleActionInput | null;
		/** Filter by match type (only 'exact_number' in v1). */
		match_type?: InkboxPhoneRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'phone.media.getPlayback': {
		media_id: string;
		agent_identity_id?: string | null;
	};
	'phone.numbers.get': {
		phone_number_id: string;
	};
	'phone.numbers.list': {
		limit?: number | null;
		offset?: number;
	};
	'phone.numbers.provision': {
		/** Agent identity handle to assign this number to (e.g. 'sales-agent' or '@sales-agent'). */
		agent_handle: string;
		/** Type of phone number to provision. Only 'local' is supported; toll-free is no longer offered. */
		type?: InkboxNumberTypeInput;
		/** US state abbreviation (e.g. 'NY', 'CA'). Only used for local numbers. */
		state?: string | null;
		/** How to handle inbound calls: hosted_agent (the platform voice agent answers, zero setup — the default wherever the hosted agent is available, so the number is callable right away), auto_accept, auto_reject, webhook, or forward with one phone or SIP destination. */
		incoming_call_action?: InkboxIncomingCallActionInput;
		/** WebSocket URL (wss://) for audio bridging. Required when incoming_call_action is 'auto_accept'. */
		client_websocket_url?: string | null;
		/** Webhook URL for incoming call notifications. Required when incoming_call_action is 'webhook'. */
		incoming_call_webhook_url?: string | null;
		forwarding_target_type?: InkboxForwardingTargetTypeInput | null;
		forwarding_phone_number?: string | null;
		forwarding_sip_uri?: string | null;
	};
	'phone.numbers.release': {
		phone_number_id: string;
	};
	'phone.numbers.searchTranscripts': {
		phone_number_id: string;
		q: string;
		/** Filter by party: local or remote */
		party?: string | null;
		limit?: number;
	};
	'phone.numbers.update': {
		phone_number_id: string;
		/** How to handle inbound calls: auto_accept, auto_reject, webhook, hosted_agent, or forward with one phone or SIP destination. */
		incoming_call_action?: InkboxIncomingCallActionInput | null;
		/** WebSocket URL (wss://) for audio bridging on auto_accept. */
		client_websocket_url?: string | null;
		/** Webhook URL for incoming call notifications. Set to null to unsubscribe. */
		incoming_call_webhook_url?: string | null;
		forwarding_target_type?: InkboxForwardingTargetTypeInput | null;
		forwarding_phone_number?: string | null;
		forwarding_sip_uri?: string | null;
		/** Contact-rule filter mode (single field; covers both voice calls and SMS). 'whitelist' = only counterparties matching an active rule are allowed; 'blacklist' = all counterparties are allowed except those matching an active rule. Applies symmetrically to inbound receipt and outbound dial/send.… */
		filter_mode?: InkboxFilterModeInput | null;
	};
	'phone.smsOptIns.get': {
		/** Recipient phone number in E.164 format (e.g. +15551234567). */
		receiver_number: string;
	};
	'phone.smsOptIns.list': {
		/** Filter by consent state. Omit to return both. */
		status?: InkboxSmsOptInStatusInput | null;
		/** Max rows to return. */
		limit?: number;
		/** Number of rows to skip. */
		offset?: number;
	};
	'phone.smsOptIns.optIn': {
		/** Recipient phone number in E.164 format (e.g. +15551234567). */
		receiver_number: string;
	};
	'phone.smsOptIns.optOut': {
		/** Recipient phone number in E.164 format (e.g. +15551234567). */
		receiver_number: string;
	};
	'phone.textConversations.get': {
		phone_number_id: string;
		/** Conversation UUID (canonical for 1:1 + group threads) or a remote phone number / short code / sender ID (transitional fallback — 1:1 only). */
		key: string;
		limit?: number;
		offset?: number;
	};
	'phone.textConversations.list': {
		phone_number_id: string;
		limit?: number;
		offset?: number;
		/** Default ``false`` hides group conversations from the listing — old clients see only 1:1 threads, byte-for-byte the same as before. Pass ``true`` to also include group threads. */
		include_groups?: boolean;
		is_blocked?: boolean | null;
		participants?: Array<string> | null;
		contact_id?: string | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'phone.textConversations.update': {
		phone_number_id: string;
		key: string;
		is_read: boolean;
	};
	'phone.textConversations.updateById': {
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		is_read: boolean;
	};
	'phone.texts.delete': {
		message_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'phone.texts.get': {
		phone_number_id: string;
		text_id: string;
	};
	'phone.texts.list': {
		phone_number_id: string;
		limit?: number;
		offset?: number;
		/** Filter by read state: true for read, false for unread, omit for all. */
		is_read?: boolean | null;
		/** Filter by blocked state: true for only blocked, false for only non-blocked, omit for all. Agent-scoped callers never see blocked rows regardless of this filter. */
		is_blocked?: boolean | null;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'phone.texts.search': {
		phone_number_id: string;
		q: string;
		limit?: number;
		is_blocked?: boolean | null;
	};
	'phone.texts.send': {
		phone_number_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		/** Use idempotency-replay with Idempotency-Key to replay the original send result. */
		prefer?: string | null;
		/** One recipient (1:1) or a list of 1–8 recipients (1:1 with N=1, or group MMS when N≥2). Each recipient is an E.164 number. Mutually exclusive with ``conversation_id``. */
		to?: (string | Array<string>) | null;
		/** Existing conversation to reply into. The server resolves this to the conversation's participants list and sends to all of them. Mutually exclusive with ``to``. */
		conversation_id?: string | null;
		text?: string | null;
		/** Publicly-fetchable media URLs to attach */
		media_urls?: Array<string> | null;
		staged_media?: Array<InkboxStagedTextMediaBindingInput>;
		/** Speak text in the agent's hosted voice and send it as an MP3 audio file in an MMS instead of text. Text is required, is limited to 600 characters, and cannot be combined with media. */
		send_as_voice_note?: boolean;
		/** When a voice note can't be produced before the message is accepted, for example because the text is longer than 600 characters, send the text as an ordinary message instead. Set false to fail the request. Ignored unless send_as_voice_note is true. */
		fallback_to_text?: boolean;
	};
	'phone.texts.update': {
		phone_number_id: string;
		text_id: string;
		is_read?: boolean | null;
		status?: 'deleted' | null;
	};
	'slack.actions.get': {
		connection_id: string;
		action_id: string;
	};
	'slack.actions.getByKey': {
		connection_id: string;
		/** The Idempotency-Key the earlier request was sent with. */
		idempotencyKey: string;
	};
	'slack.applications.getRemoval': {
		operation_id: string;
	};
	'slack.applications.prepare': {
		identity_id: string;
		provisioning_workspace_id: string;
	};
	'slack.applications.remove': {
		identity_id: string;
		expected_application_generation: number;
		request_id: string;
	};
	'slack.archive.backfill': {
		connection_id: string;
		restart?: boolean;
		conversation_id: string;
		thread_ts?: string | null;
	};
	'slack.archive.getCoverage': {
		connection_id: string;
		cursor?: string | null;
		limit?: number;
	};
	'slack.archive.getSettings': {
		connection_id: string;
	};
	'slack.archive.listMessages': {
		connection_id: string;
		conversation_id?: string | null;
		thread_ts?: string | null;
		before_ts?: string | null;
		after_ts?: string | null;
		cursor?: string | null;
		limit?: number;
		/** Return only the latest matching message per conversation; limit counts conversations. */
		latest_per_conversation?: boolean;
		/** Page roots, broadcasts, and replies with no retained parent. */
		roots_only?: boolean;
		/** Optional cached expansions: conversation,sender,reactions,files. */
		include?: string | null;
		/** Return only this retained message, such as a received event's data.message_id. */
		message_id?: string | null;
	};
	'slack.archive.purge': {
		connection_id: string;
	};
	'slack.archive.search': {
		connection_id: string;
		q: string;
		conversation_id?: string | null;
		user_id?: string | null;
		after_ts?: string | null;
		before_ts?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'slack.archive.updateSettings': {
		connection_id: string;
		retention_days?: number | null;
	};
	'slack.connections.disconnect': {
		connection_id: string;
	};
	'slack.connections.getCapabilities': {
		connection_id: string;
	};
	'slack.connections.importContacts': {
		connection_id: string;
		cursor?: string | null;
		limit?: number;
		conversation_id?: string | null;
	};
	'slack.connections.list': {
		identity_id: string;
	};
	'slack.connections.listAvailable': {
		identity_id?: string | null;
	};
	'slack.conversations.get': {
		connection_id: string;
		conversation_id: string;
	};
	'slack.conversations.join': {
		connection_id: string;
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'slack.conversations.leave': {
		connection_id: string;
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'slack.conversations.list': {
		connection_id: string;
		limit?: number;
		cursor?: string | null;
		include_unjoined?: boolean;
	};
	'slack.conversations.listMembers': {
		connection_id: string;
		conversation_id: string;
		limit?: number;
		cursor?: string | null;
	};
	'slack.conversations.open': {
		connection_id: string;
		user_ids: Array<string>;
	};
	'slack.conversations.setProcessingStatus': {
		connection_id: string;
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		thread_ts: string;
		status: 'active' | 'processing' | 'suspended' | 'closed';
	};
	'slack.files.download': {
		connection_id: string;
		file_id: string;
	};
	'slack.files.get': {
		connection_id: string;
		file_id: string;
	};
	'slack.files.getPreview': {
		connection_id: string;
		file_id: string;
	};
	'slack.files.upload': {
		connection_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		conversation_id: string;
		filename: string;
		content_base64: string;
		title?: string | null;
		initial_comment?: string | null;
		thread_ts?: string | null;
	};
	'slack.getCachedMedia': {
		connection_id: string;
		kind: string;
		resource_id: string;
	};
	'slack.installations.start': {
		identity_id: string;
		workspace_id?: string | null;
		return_url?: string | null;
	};
	'slack.listEmoji': {
		connection_id: string;
		q?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'slack.listOrgContactRules': {
		/** Narrow to a single agent identity. Omit to list across every identity in the org. */
		agent_identity_id?: string | null;
		/** Filter by allow or block. */
		action?: InkboxSlackRuleActionInput | null;
		/** Filter by exact_user or workspace. */
		match_type?: InkboxSlackRuleMatchTypeInput | null;
		/** Filter by applicable direction; both selects only bidirectional rules. */
		direction?: InkboxRuleDirectionInput | null;
		/** Max rules to return. */
		limit?: number;
		/** Number of rules to skip. */
		offset?: number;
	};
	'slack.messages.delete': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'slack.messages.get': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		thread_ts?: string | null;
	};
	'slack.messages.getContext': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		limit?: number;
		thread_ts?: string | null;
	};
	'slack.messages.getPermalink': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
	};
	'slack.messages.list': {
		connection_id: string;
		conversation_id: string;
		limit?: number;
		cursor?: string | null;
		thread_ts?: string | null;
	};
	'slack.messages.send': {
		connection_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		conversation_id: string;
		text: string;
		thread_ts?: string | null;
		/** Speak text in the agent's hosted voice and send it as an MP3 audio file instead of text. Text is required, is limited to 600 characters, and cannot be combined with media. */
		send_as_voice_note?: boolean;
		/** When a voice note can't be produced before the message is accepted, for example because the text is longer than 600 characters, send the text as an ordinary message instead. Set false to fail the request. Ignored unless send_as_voice_note is true. */
		fallback_to_text?: boolean;
	};
	'slack.messages.update': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		text: string;
	};
	'slack.operations.get': {
		connection_id: string;
		operation_id: string;
	};
	'slack.operations.getByKey': {
		connection_id: string;
		/** The Idempotency-Key the earlier request was sent with. */
		idempotencyKey: string;
	};
	'slack.pins.add': {
		connection_id: string;
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		message_ts: string;
	};
	'slack.pins.list': {
		connection_id: string;
		conversation_id: string;
	};
	'slack.pins.remove': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'slack.provisioningWorkspaces.list': Record<string, never>;
	'slack.provisioningWorkspaces.save': {
		access_token: string;
		refresh_token: string;
	};
	'slack.reactions.add': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		name: string;
	};
	'slack.reactions.list': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
	};
	'slack.reactions.remove': {
		connection_id: string;
		conversation_id: string;
		message_ts: string;
		name: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'slack.search': {
		q: string;
		identity_id?: string | null;
		connection_id?: string | null;
		conversation_id?: string | null;
		user_id?: string | null;
		after_ts?: string | null;
		before_ts?: string | null;
		cursor?: string | null;
		limit?: number;
	};
	'slack.streams.append': {
		connection_id: string;
		conversation_id: string;
		stream_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		chunks: Array<InkboxSlackTaskUpdateInput | InkboxSlackPlanUpdateInput>;
	};
	'slack.streams.start': {
		connection_id: string;
		conversation_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		thread_ts: string;
		recipient_user_id: string;
		recipient_team_id: string;
		task_display_mode?: 'timeline' | 'plan';
		chunks: Array<InkboxSlackTaskUpdateInput | InkboxSlackPlanUpdateInput>;
	};
	'slack.streams.stop': {
		connection_id: string;
		conversation_id: string;
		stream_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		chunks?: Array<InkboxSlackTaskUpdateInput | InkboxSlackPlanUpdateInput>;
	};
	'slack.users.get': {
		connection_id: string;
		user_id: string;
	};
	'slack.users.list': {
		connection_id: string;
		limit?: number;
		cursor?: string | null;
	};
	'tunnels.get': {
		tunnel_id: string;
	};
	'tunnels.list': Record<string, never>;
	'tunnels.signCsr': {
		tunnel_id: string;
		/** PEM-encoded CSR. CN must equal the tunnel hostname. */
		csr_pem: string;
	};
	'tunnels.update': {
		tunnel_id: string;
		/** Free-form metadata dict; pass ``null`` or ``{}`` to clear (both clear to ``{}`` since the underlying column is non-nullable). Capped at 4 KB serialized JSON. */
		metadata?: Record<string, InkboxJsonValue> | null;
	};
	'vault.getInfo': Record<string, never>;
	'vault.getUnlockBundle': {
		auth_hash?: string | null;
	};
	'vault.initialize': {
		/** The primary vault key to create alongside the vault. */
		vault_key: InkboxVaultKeyCreateInput;
		/** Exactly four recovery keys, each wrapping the same org encryption key with a different recovery-code-derived master key. */
		recovery_keys: Array<InkboxVaultKeyCreateInput>;
	};
	'vault.keys.list': {
		type?: InkboxVaultKeyTypeInput | null;
	};
	'vault.keys.updatePrimary': {
		id: string;
		/** AES-256-GCM ciphertext wrapping the org encryption key (base64) */
		wrapped_org_encryption_key: string;
		/** SHA-256(newMasterKey) hex digest for the new primary key */
		auth_hash: string;
		/** Stored auth hash of the current primary vault key */
		current_auth_hash?: string | null;
		/** Stored auth hash of a recovery code */
		recovery_auth_hash?: string | null;
	};
	'vault.secrets.create': {
		id: string;
		/** Plaintext display name for listing the secret, such as 'AWS Production'. */
		name: string;
		/** Optional freeform context describing when and how to use this credential. */
		description?: string | null;
		/** Credential category hint used by clients, such as 'login', 'ssh_key', 'api_key', or 'other'. */
		secret_type: InkboxVaultSecretTypeInput;
		/** AES-256-GCM ciphertext (base64), opaque to server */
		encrypted_payload: string;
	};
	'vault.secrets.get': {
		secret_id: string;
	};
	'vault.secrets.grantAccess': {
		secret_id: string;
		identity_id: string;
	};
	'vault.secrets.list': {
		secret_type?: InkboxVaultSecretTypeInput | null;
		limit?: number | null;
		offset?: number;
	};
	'vault.secrets.listAccess': {
		secret_id: string;
	};
	'vault.secrets.revokeAccess': {
		secret_id: string;
		identity_id: string;
	};
	'vault.secrets.update': {
		secret_id: string;
		/** Optional new plaintext display name for the secret. */
		name?: string | null;
		/** Optional new freeform description for the secret. */
		description?: string | null;
		/** Optional replacement AES-256-GCM ciphertext payload (base64). */
		encrypted_payload?: string | null;
	};
	'voiceAgent.getConfig': {
		/** Target identity. Agent-scoped keys resolve their own; required for admin/JWT. */
		agent_identity_id?: string | null;
	};
	'voiceAgent.listVoices': Record<string, never>;
	'voiceAgent.mcpServers.cancelAuthorization': {
		connection_id: string;
		transaction_id: string;
	};
	'voiceAgent.mcpServers.create': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		agent_identity_id?: string | null;
		label: string;
		url: string;
		transport?: 'streamable_http' | 'sse';
		auth?:
			| InkboxMcpNoAuthInput
			| InkboxMcpBearerAuthInput
			| InkboxMcpHeaderAuthInput
			| InkboxMcpOAuthAuthInput;
		enabled?: boolean;
		allowed_tools?: Array<string> | null;
		context?: InkboxMcpContextSelectionsInput;
	};
	'voiceAgent.mcpServers.delete': {
		connection_id: string;
	};
	'voiceAgent.mcpServers.disconnect': {
		connection_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		expected_version: number;
	};
	'voiceAgent.mcpServers.get': {
		connection_id: string;
	};
	'voiceAgent.mcpServers.getAuthorization': {
		connection_id: string;
		transaction_id: string;
	};
	'voiceAgent.mcpServers.getCatalog': {
		connection_id: string;
		cursor?: number;
		limit?: number;
		skill_uri?: string | null;
	};
	'voiceAgent.mcpServers.list': {
		agent_identity_id?: string | null;
	};
	'voiceAgent.mcpServers.refresh': {
		connection_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
	};
	'voiceAgent.mcpServers.startAuthorization': {
		connection_id: string;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		expected_version: number;
	};
	'voiceAgent.mcpServers.test': {
		connection_id: string;
	};
	'voiceAgent.mcpServers.update': {
		connection_id: string;
		expected_version: number;
		label?: string | null;
		url?: string | null;
		transport?: 'streamable_http' | 'sse' | null;
		auth?:
			| (
					| InkboxMcpNoAuthInput
					| InkboxMcpBearerAuthInput
					| InkboxMcpHeaderAuthInput
					| InkboxMcpOAuthAuthInput
			  )
			| null;
		enabled?: boolean | null;
		allowed_tools?: Array<string> | null;
		context?: InkboxMcpContextSelectionsInput | null;
	};
	'voiceAgent.setAuthorityMode': {
		agent_identity_id: string;
		authority_mode: InkboxHostedAgentAuthorityModeInput;
	};
	'voiceAgent.setConfig': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		agent_identity_id?: string | null;
		voice?: string | null;
		/** Compatibility field; accepted but ignored. */
		model?: string | null;
		instructions?: string | null;
	};
	'webhooks.deliveries.list': {
		agent_identity_id?: string | null;
		subscription_id?: string | null;
		phone_number_id?: string | null;
		event_type?: string | null;
		success?: boolean | null;
		limit?: number;
		offset?: number;
	};
	'webhooks.deliveries.replay': {
		delivery_id: string;
	};
	'webhooks.getCatalog': Record<string, never>;
	'webhooks.subscriptions.create': {
		mailbox_id?: string | null;
		phone_number_id?: string | null;
		agent_identity_id?: string | null;
		url: string;
		event_types: Array<
			| InkboxMailWebhookEventTypeInput
			| InkboxPhoneTextWebhookEventTypeInput
			| InkboxPhoneCallLifecycleWebhookEventTypeInput
			| InkboxIMessageWebhookEventTypeInput
			| InkboxMessageTranscriptionEventTypeInput
			| InkboxWhatsAppWebhookEventTypeInput
			| InkboxA2AWebhookEventTypeInput
			| InkboxSlackWebhookEventTypeInput
		>;
		/** Optional per-class conversation context (email/texts/calls) included in received-event payloads. Omit or null for none. */
		context_config?: InkboxWebhookContextConfigInput | null;
		/** Optional bearer token for endpoints that require it; sent as 'Authorization: Bearer <token>' on every delivery and returned on subscription reads. */
		auth_token?: string | null;
	};
	'webhooks.subscriptions.delete': {
		sub_id: string;
		scope?: 'identity' | null;
	};
	'webhooks.subscriptions.get': {
		sub_id: string;
	};
	'webhooks.subscriptions.list': {
		mailbox_id?: string | null;
		phone_number_id?: string | null;
		agent_identity_id?: string | null;
		url?: string | null;
		event_type?:
			| (
					| InkboxMailWebhookEventTypeInput
					| InkboxPhoneTextWebhookEventTypeInput
					| InkboxPhoneCallLifecycleWebhookEventTypeInput
					| InkboxIMessageWebhookEventTypeInput
					| InkboxMessageTranscriptionEventTypeInput
					| InkboxWhatsAppWebhookEventTypeInput
					| InkboxA2AWebhookEventTypeInput
					| InkboxSlackWebhookEventTypeInput
			  )
			| null;
		limit?: number | null;
		offset?: number;
		scope?: 'identity' | null;
	};
	'webhooks.subscriptions.update': {
		sub_id: string;
		scope?: 'identity' | null;
		url?: string | null;
		event_types?: Array<
			| InkboxMailWebhookEventTypeInput
			| InkboxPhoneTextWebhookEventTypeInput
			| InkboxPhoneCallLifecycleWebhookEventTypeInput
			| InkboxIMessageWebhookEventTypeInput
			| InkboxMessageTranscriptionEventTypeInput
			| InkboxWhatsAppWebhookEventTypeInput
			| InkboxA2AWebhookEventTypeInput
			| InkboxSlackWebhookEventTypeInput
		> | null;
		context_config?: InkboxWebhookContextConfigInput | null;
		auth_token?: string | null;
	};
	'whatsapp.assignments.list': {
		/** Narrow to one agent identity. Ignored for agent-scoped keys (always their own identity). */
		agent_identity_id?: string | null;
		limit?: number;
		offset?: number;
	};
	'whatsapp.assignments.release': {
		assignment_id: string;
	};
	'whatsapp.connect': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		agent_identity_id: string;
		/** Phone number in E.164 format (e.g. '+15551234567'). */
		recipient_number: string;
	};
	'whatsapp.conversations.get': {
		conversation_id: string;
		agent_identity_id?: string | null;
	};
	'whatsapp.conversations.getThread': {
		conversation_id: string;
		thread_id: string;
		agent_identity_id?: string | null;
		limit?: number;
		cursor?: string | null;
	};
	'whatsapp.conversations.list': {
		agent_identity_id?: string | null;
		offset?: number;
		limit?: number;
		is_blocked?: boolean | null;
		participants?: Array<string> | null;
		contact_id?: string | null;
		include_groups?: boolean;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'whatsapp.disconnect': {
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string;
		agent_identity_id: string;
		/** Phone number in E.164 format (e.g. '+15551234567'). */
		recipient_number: string;
	};
	'whatsapp.getLimits': {
		agent_identity_id?: string | null;
	};
	'whatsapp.getOnboarding': {
		agent_identity_id?: string | null;
	};
	'whatsapp.getTriageNumber': {
		/** Resolve the connect command, link and QR for this agent identity. Organization-wide callers may pass any identity in the organization; agent-scoped keys only their own. */
		agent_identity_id?: string | null;
	};
	'whatsapp.markRead': {
		agent_identity_id?: string | null;
		conversation_id: string;
		/** Mark only messages up to and including this one; omit to mark every unread message. */
		through_message_id?: string | null;
	};
	'whatsapp.media.get': {
		media_id: string;
		agent_identity_id?: string | null;
	};
	'whatsapp.media.getPlayback': {
		media_id: string;
		agent_identity_id?: string | null;
	};
	'whatsapp.media.upload': {
		agent_identity_id?: string | null;
		/** Recipient this attachment is for. Required when the agent replies through a shared number instead of its own dedicated number. */
		recipient_number?: string | null;
		file: FileInput;
	};
	'whatsapp.messages.get': {
		message_id: string;
		agent_identity_id?: string | null;
	};
	'whatsapp.messages.getThread': {
		message_id: string;
		agent_identity_id?: string | null;
		limit?: number;
		cursor?: string | null;
	};
	'whatsapp.messages.list': {
		agent_identity_id?: string | null;
		conversation_id?: string | null;
		offset?: number;
		limit?: number;
		is_read?: boolean | null;
		is_blocked?: boolean | null;
		thread_id?: string | null;
		include_groups?: boolean;
		/** Filter created_at >= this date/datetime. Bare date => whole day in tz. */
		start_datetime?: string | null;
		/** Filter created_at <= this date/datetime. Bare date => whole day inclusive. */
		end_datetime?: string | null;
		/** IANA zone (e.g. America/New_York) for zone-less values; default UTC. */
		tz?: string | null;
	};
	'whatsapp.messages.send': {
		agent_identity_id?: string | null;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		to?: string | null;
		conversation_id?: string | null;
		reply_to_message_id?: string | null;
		/** Allow a plain reply only when the target is known before sending to lack native reply support. All currently supported WhatsApp targets support native replies, so this option does not bypass unavailable targets or quote evidence. Rejected or uncertain sends are never retried as plain messages.… */
		plain_reply_fallback?: boolean;
		text?: string | null;
		/** Play an attached MP4 video as an animation. */
		gif_playback?: boolean;
		media_ids?: Array<string>;
		staged_media?: Array<InkboxStagedWhatsAppMediaBindingInput>;
		/** Speak text in the agent's hosted voice and send it as a native WhatsApp voice note instead of text. Text is required, is limited to 600 characters, and cannot be combined with media. */
		send_as_voice_note?: boolean;
		/** When a voice note can't be produced before the message is accepted, for example because the text is longer than 600 characters, send the text as an ordinary message instead. Set false to fail the request. Ignored unless send_as_voice_note is true. */
		fallback_to_text?: boolean;
	};
	'whatsapp.numbers.assign': {
		account_id: string;
		agent_identity_id: string | null;
		expected_revision: number;
		confirmed_imessage_number?: string | null;
	};
	'whatsapp.numbers.list': {
		offset?: number;
	};
	'whatsapp.reactions.delete': {
		reaction_id: string;
		agent_identity_id?: string | null;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
	};
	'whatsapp.reactions.get': {
		reaction_id: string;
		agent_identity_id?: string | null;
	};
	'whatsapp.reactions.send': {
		agent_identity_id?: string | null;
		/** Idempotency-Key header: a retry with the same key and body returns what this key already did instead of doing it again. Leave it out and the plugin sends a new random key. */
		idempotencyKey?: string | null;
		message_id: string;
		reaction?:
			| 'love'
			| 'like'
			| 'dislike'
			| 'laugh'
			| 'emphasize'
			| 'question'
			| 'eyes'
			| null;
		custom_emoji?: string | null;
	};
	'whatsapp.router.get': Record<string, never>;
	'whatsapp.router.listConversations': {
		offset?: number;
		limit?: number;
	};
	'whatsapp.router.listMessages': {
		/** Phone number in E.164 format (e.g. '+15551234567'). */
		remote_number: string;
		offset?: number;
		limit?: number;
	};
	'whatsapp.router.update': {
		expected_router_id: string;
		expected_revision: number;
		profile_display_name?: string | null;
		accepting_new_connections?: boolean | null;
	};
	'whatsapp.sendTyping': {
		agent_identity_id?: string | null;
		conversation_id: string;
	};
};

export type InkboxOperationOutputs = {
	'a2a.contactRules.create': InkboxA2AContactRuleResponse;
	'a2a.contactRules.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'a2a.contactRules.list': Array<InkboxA2AContactRuleResponse>;
	'a2a.contactRules.listForOrg': Array<InkboxA2AIdentityContactRuleResponse>;
	'a2a.contactRules.update': InkboxA2AContactRuleResponse;
	'a2a.contexts.get': InkboxA2AContextResponse;
	'a2a.contexts.list': InkboxA2AContextPage;
	'a2a.contexts.update': InkboxA2AContextResponse;
	'a2a.invitations.accept': InkboxA2AInvitationAcceptResponse;
	'a2a.invitations.create':
		| InkboxA2AInvitationUnboundCreateResponse
		| InkboxA2AInvitationResponse;
	'a2a.invitations.decline': InkboxA2AInvitationDeclineResponse;
	'a2a.invitations.get': InkboxA2AInvitationResponse;
	'a2a.invitations.list': InkboxA2AInvitationPage;
	'a2a.invitations.preview': InkboxA2AInvitationPreviewResponse;
	'a2a.invitations.revoke': InkboxA2AInvitationResponse;
	'a2a.listDirectory': InkboxA2ADirectoryPage;
	'a2a.messages.list': InkboxA2AHistoryMessagePage;
	'a2a.previewCard': Record<string, InkboxJsonValue>;
	'a2a.sentContexts.get': InkboxA2AContextResponse;
	'a2a.sentContexts.list': InkboxA2AContextPage;
	'a2a.sentTasks.get': InkboxA2ATaskResponse;
	'a2a.sentTasks.list': InkboxA2ATaskPage;
	'a2a.settings.get': InkboxA2ASettingsResponse;
	'a2a.settings.listForOrg': InkboxA2ASettingsListResponse;
	'a2a.settings.update': InkboxA2ASettingsResponse;
	'a2a.tasks.get': InkboxA2ATaskResponse;
	'a2a.tasks.list': InkboxA2ATaskPage;
	'a2a.tasks.reply': InkboxA2ATaskResponse;
	'account.whoami': Record<string, InkboxJsonValue>;
	'agentSignup.getStatus': InkboxAgentSignupStatusResponse;
	'agentSignup.resendVerification': InkboxAgentClaimResponse;
	'agentSignup.verify': InkboxAgentClaimResponse;
	'apiKeys.create': InkboxCreateApiKeyResponse;
	'apiKeys.getCurrent': InkboxApiKey;
	'apiKeys.revokeCurrent': InkboxApiKey;
	'billing.callingCountries.buy': InkboxCallingCountriesResponse;
	'billing.callingCountries.cancel': InkboxCallingCountriesResponse;
	'billing.callingCountries.list': InkboxCallingCountriesResponse;
	'billing.callingCountries.quote': InkboxCountryQuoteResponse;
	'billing.callingCountries.resume': InkboxCallingCountriesResponse;
	'billing.changePlan': InkboxSubscriptionStatusResponse;
	'billing.createCheckoutSession': InkboxCheckoutSessionResponse;
	'billing.createPortalSession': InkboxPortalSessionResponse;
	'billing.getPricing': InkboxPricingResponse;
	'billing.getSubscription': InkboxSubscriptionStatusResponse;
	'billing.getUsage': InkboxUsageSummaryResponse;
	'billing.identityPacks.buy': InkboxIdentityPackMutationResponse;
	'billing.identityPacks.change': InkboxIdentityPackMutationResponse;
	'billing.identityPacks.list': InkboxIdentityPacksResponse;
	'billing.identityPacks.quote': InkboxIdentityPackQuote;
	'billing.lineBundles.buy': InkboxBundlesResponse;
	'billing.lineBundles.change': InkboxBundlesResponse;
	'billing.lineBundles.list': InkboxBundlesResponse;
	'billing.lineBundles.quote': InkboxBundleQuoteResponse;
	'billing.setVoicePacks': InkboxVoicePacksResponse;
	'billing.settings.get': InkboxBillingSettingsResponse;
	'billing.settings.update': InkboxBillingSettingsResponse;
	'billing.usageAlerts.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'billing.usageAlerts.list': Array<InkboxAlertResponse>;
	'billing.usageAlerts.save': InkboxAlertResponse;
	'compliance.brand.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'compliance.brand.get': InkboxBrandRegistrationResponse;
	'compliance.brand.register': InkboxBrandRegistrationResponse;
	'compliance.brand.resendTwoFactorEmail': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'compliance.brand.sendSmsOtp': InkboxBrandSmsOtpTriggerResponse;
	'compliance.brand.update': InkboxBrandRegistrationResponse;
	'compliance.brand.verifySmsOtp': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'compliance.campaign.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'compliance.campaign.get': InkboxCampaignRegistrationResponse;
	'compliance.campaign.getActive': InkboxCampaignActiveStateResponse;
	'compliance.campaign.register': InkboxCampaignRegistrationResponse;
	'compliance.campaign.resubmit': InkboxCampaignRegistrationResponse;
	'compliance.campaign.setActive': InkboxCampaignActiveToggleResponse;
	'compliance.campaign.update': InkboxCampaignRegistrationResponse;
	'compliance.uploadOptInEvidence': InkboxOptInEvidenceUploadResponse;
	'contacts.bulkDelete': InkboxContactBulkDeleteResponse;
	'contacts.communicationPolicy.get': InkboxContactCommunicationPolicyResponse;
	'contacts.communicationPolicy.preview': InkboxContactCommunicationPreview;
	'contacts.communicationPolicy.set': InkboxContactCommunicationPolicyResponse;
	'contacts.create': InkboxContactMutationResponse;
	'contacts.createWithPermissions': InkboxContactMutationResponse;
	'contacts.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'contacts.exportVcard': FileOutput;
	'contacts.exportVcards': InkboxContactVCardExportResponse;
	'contacts.facts.create': InkboxContactFactResponse;
	'contacts.facts.delete': InkboxContactFactDeleteResponse;
	'contacts.facts.get': InkboxContactFactResponse;
	'contacts.facts.list': Array<InkboxContactFactResponse>;
	'contacts.facts.resolveCitation': InkboxContactFactCitationDetailResponse;
	'contacts.facts.update': InkboxContactFactResponse;
	'contacts.get': InkboxContactResponse;
	'contacts.getCorrespondence': InkboxContactCorrespondenceResponse;
	'contacts.import': InkboxContactImportResponse;
	'contacts.list': Array<InkboxContactListResponse>;
	'contacts.lookup': Array<InkboxContactResponse>;
	'contacts.merge': InkboxContactMutationResponse;
	'contacts.previewImport': InkboxContactImportPreviewResponse;
	'contacts.update': InkboxContactMutationResponse;
	'domains.create': InkboxCreateDomainResponse;
	'domains.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'domains.forceDelete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'domains.get': InkboxDomainWithDnsRecordsResponse;
	'domains.getDnsRecords': InkboxDnsRecordsResponse;
	'domains.getHealth': InkboxDomainHealthResponse;
	'domains.list': Array<InkboxDomainResponse>;
	'domains.restore': InkboxDomainResponse;
	'domains.rotateDkim': InkboxRotateDkimResponse;
	'domains.setDefault': InkboxSetDefaultResponse;
	'domains.verify': InkboxDomainWithDnsRecordsResponse;
	'hostedChat.answerInteraction': InkboxInteractionReceipt;
	'hostedChat.conversations.create': InkboxConversation;
	'hostedChat.conversations.get': InkboxSnapshot;
	'hostedChat.conversations.list': InkboxConversationPage;
	'hostedChat.conversations.listMessages': InkboxHistoryPage;
	'hostedChat.conversations.rename': InkboxConversation;
	'hostedChat.files.download': InkboxFileDownload;
	'hostedChat.files.get': InkboxFileContent;
	'hostedChat.files.upload': InkboxFileReceipt;
	'hostedChat.getStatus': InkboxWorkspace;
	'hostedChat.turns.cancel': InkboxCancellation;
	'hostedChat.turns.create': InkboxTurn;
	'hostedChat.turns.get': InkboxTurn;
	'hostedWorkspace.environment.get': InkboxEnvironment;
	'hostedWorkspace.environment.update': InkboxEnvironmentReceipt;
	'hostedWorkspace.get': InkboxWorkspace;
	'hostedWorkspace.getOperation': InkboxOperation;
	'hostedWorkspace.getUsage': InkboxUsage;
	'hostedWorkspace.getUsageHistory': InkboxUsageHistory;
	'hostedWorkspace.ports.get': InkboxAgentAddress;
	'hostedWorkspace.ports.rotateToken': InkboxAgentAddress;
	'hostedWorkspace.ports.update': InkboxAgentAddress;
	'hostedWorkspace.resize': InkboxResizeReceipt;
	'hostedWorkspace.runAction': InkboxOperationReceipt;
	'hostedWorkspace.schedules.create': InkboxScheduleReceipt;
	'hostedWorkspace.schedules.delete': InkboxScheduleReceipt;
	'hostedWorkspace.schedules.list': InkboxSchedulePage;
	'hostedWorkspace.schedules.listOccurrences': InkboxScheduleHistory;
	'hostedWorkspace.schedules.preview': InkboxSchedulePreviewResult;
	'hostedWorkspace.schedules.update': InkboxScheduleReceipt;
	'hostedWorkspace.terminals.close': InkboxOperationReceipt;
	'hostedWorkspace.terminals.create': InkboxTerminalReceipt;
	'hostedWorkspace.terminals.createTicket': InkboxTerminalTicket;
	'hostedWorkspace.terminals.list': InkboxTerminalPage;
	'hosting.callTool': InkboxJsonValue;
	'hosting.deliveries.list': InkboxHostingDeliveriesView;
	'hosting.deliveries.retry': InkboxHostingDeliveryRetry;
	'hosting.get': InkboxHostingView;
	'hosting.set': InkboxHostingView;
	'identities.avatar.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.avatar.get': FileOutput;
	'identities.avatar.getMetadata': InkboxIdentityAvatarMetadataResponse;
	'identities.avatar.setFromStagedMedia': InkboxIdentityAvatarChangeResponse;
	'identities.avatar.upload': InkboxAgentIdentityResponse;
	'identities.companion.get': InkboxCompanionConfigResponse;
	'identities.companion.getHistory': InkboxCompanionHistoryResponse;
	'identities.companion.listConversations': InkboxCompanionConversationsResponse;
	'identities.companion.update': InkboxCompanionConfigResponse;
	'identities.connectImessageNumber': InkboxAgentIdentityIMessageNumberResponse;
	'identities.contactAccess.get': InkboxContactAccessSettingsResponse;
	'identities.contactAccess.update': InkboxContactAccessSettingsResponse;
	'identities.contactPermissions.get': InkboxContactPermissionsResponse;
	'identities.contactPermissions.list': InkboxContactPermissionPage;
	'identities.contactPermissions.update': InkboxContactPermissionsResponse;
	'identities.create': InkboxAgentIdentityDetailResponse;
	'identities.createTunnel': InkboxTunnelResponse;
	'identities.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.disconnectImessageNumber': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.domainAffiliation.get': InkboxIdentityDomainAffiliationResponse;
	'identities.domainAffiliation.remove': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.domainAffiliation.set': InkboxIdentityDomainAffiliationResponse;
	'identities.get': InkboxAgentIdentityDetailResponse;
	'identities.getChannelStatus': InkboxIdentityChannelStatusResponse;
	'identities.getCurrent': InkboxAgentIdentityDetailResponse;
	'identities.list': Array<InkboxAgentIdentityDetailResponse>;
	'identities.listContactCommunicationPolicies': InkboxContactCommunicationPolicyPage;
	'identities.mailContactRules.create': InkboxMailIdentityContactRuleResponse;
	'identities.mailContactRules.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.mailContactRules.get': InkboxMailIdentityContactRuleResponse;
	'identities.mailContactRules.list': Array<InkboxMailIdentityContactRuleResponse>;
	'identities.mailContactRules.update': InkboxMailIdentityContactRuleResponse;
	'identities.phoneContactRules.create': InkboxPhoneIdentityContactRuleResponse;
	'identities.phoneContactRules.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.phoneContactRules.get': InkboxPhoneIdentityContactRuleResponse;
	'identities.phoneContactRules.list': Array<InkboxPhoneIdentityContactRuleResponse>;
	'identities.phoneContactRules.update': InkboxPhoneIdentityContactRuleResponse;
	'identities.releasePhoneNumber': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.signingKey.createOrRotate': InkboxSigningKeyCreateResponse;
	'identities.signingKey.getStatus': InkboxSigningKeyStatusResponse;
	'identities.slackContactRules.create': InkboxSlackContactRuleResponse;
	'identities.slackContactRules.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'identities.slackContactRules.get': InkboxSlackContactRuleResponse;
	'identities.slackContactRules.list': Array<InkboxSlackContactRuleResponse>;
	'identities.slackContactRules.update': InkboxSlackContactRuleResponse;
	'identities.update': InkboxAgentIdentityDetailResponse;
	'imessage.assignments.list': Array<InkboxIMessageAssignmentResponse>;
	'imessage.assignments.release': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'imessage.checkCapability': InkboxMessagingCapability;
	'imessage.connect': InkboxConnectIMessageResponse;
	'imessage.contactRules.create': InkboxIMessageContactRuleResponse;
	'imessage.contactRules.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'imessage.contactRules.get': InkboxIMessageContactRuleResponse;
	'imessage.contactRules.list': Array<InkboxIMessageContactRuleResponse>;
	'imessage.contactRules.listForOrg': Array<InkboxIMessageContactRuleResponse>;
	'imessage.contactRules.update': InkboxIMessageContactRuleResponse;
	'imessage.conversations.get': InkboxIMessageConversationResponse;
	'imessage.conversations.getThread': InkboxIMessageThreadResponse;
	'imessage.conversations.list': Array<InkboxIMessageConversationSummary>;
	'imessage.disconnect': InkboxDisconnectIMessageResponse;
	'imessage.getMediaPlayback': FileOutput;
	'imessage.getOnboarding': Record<string, InkboxJsonValue>;
	'imessage.getTriageNumber': InkboxIMessageTriageNumberResponse;
	'imessage.markRead':
		| InkboxMarkIMessageReadResponse
		| InkboxIMessageReadCommandResponse;
	'imessage.messages.get': InkboxIMessageMessageResponse;
	'imessage.messages.getThread': InkboxIMessageThreadResponse;
	'imessage.messages.list': Array<InkboxIMessageMessageResponse>;
	'imessage.messages.send':
		| InkboxSendIMessageResponse
		| InkboxIMessageSendCommandResponse
		| InkboxIMessageGroupSendCommandResponse;
	'imessage.numbers.claim': InkboxIMessageDedicatedNumberResponse;
	'imessage.numbers.list': Array<InkboxIMessageDedicatedNumberResponse>;
	'imessage.reactions.remove': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'imessage.reactions.send':
		| InkboxIMessageReactionResponse
		| InkboxIMessageReactionCommandResponse;
	'imessage.router.get': InkboxIMessageRouterResponse;
	'imessage.router.getAvatar': FileOutput;
	'imessage.router.getConversation': InkboxIMessageRouterConversationResponse;
	'imessage.router.listConversations': InkboxIMessageRouterConversationPage;
	'imessage.router.listMessages': InkboxIMessageRouterMessagePage;
	'imessage.router.update': InkboxIMessageRouterResponse;
	'imessage.router.updateConnectOnboarding': InkboxIMessageRouterResponse;
	'imessage.sendTyping': Record<string, string>;
	'imessage.uploadMedia': InkboxUploadIMessageMediaResponse;
	'inbound.checkSignature': InkboxSignatureCheckResult;
	'inbound.events.get': InkboxInboundEventDetail;
	'inbound.events.list': InkboxInboundEventPage;
	'inbound.events.replay': InkboxInboundEventView;
	'inbound.events.reportResult': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'inbound.sources.create': InkboxInboundSourceView;
	'inbound.sources.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'inbound.sources.get': InkboxInboundSourceView;
	'inbound.sources.list': InkboxInboundSourceList;
	'inbound.sources.rotate': InkboxInboundSourceView;
	'inbound.sources.update': InkboxInboundSourceView;
	'mail.drafts.addAttachments': InkboxDraftDetailResponse;
	'mail.drafts.create': InkboxDraftDetailResponse;
	'mail.drafts.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'mail.drafts.duplicate': InkboxDraftDetailResponse;
	'mail.drafts.get': InkboxDraftDetailResponse;
	'mail.drafts.getAttachment': FileOutput;
	'mail.drafts.list': InkboxDraftListResponse;
	'mail.drafts.removeAttachment': InkboxDraftDetailResponse;
	'mail.drafts.send': InkboxMessageResponse;
	'mail.drafts.update': InkboxDraftDetailResponse;
	'mail.imports.cancel': InkboxMailImportJobResponse;
	'mail.imports.create': InkboxMailImportJobCreateResponse;
	'mail.imports.get': InkboxMailImportJobResponse;
	'mail.imports.list': InkboxCursorPageMailImportJobResponse;
	'mail.imports.reissueUploadUrl': InkboxMailImportUploadTarget;
	'mail.imports.start': InkboxMailImportJobResponse;
	'mail.listOrgContactRules': Array<InkboxMailIdentityContactRuleResponse>;
	'mail.mailboxes.get': InkboxMailboxResponse;
	'mail.mailboxes.getById': InkboxMailboxResponse;
	'mail.mailboxes.list': Array<InkboxMailboxResponse>;
	'mail.mailboxes.update': InkboxMailboxResponse;
	'mail.messages.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'mail.messages.forward': InkboxMessageResponse;
	'mail.messages.get': InkboxMessageDetailResponse;
	'mail.messages.getAttachment': InkboxJsonValue;
	'mail.messages.list': InkboxCursorPageMessageResponse;
	'mail.messages.replyAll': InkboxMessageResponse;
	'mail.messages.search': InkboxCursorPageMessageResponse;
	'mail.messages.send': InkboxMessageResponse;
	'mail.messages.updateFlags': InkboxMessageResponse;
	'mail.threads.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'mail.threads.get': InkboxThreadDetailResponse;
	'mail.threads.list': InkboxCursorPageThreadResponse;
	'mail.threads.listFolders': Array<InkboxThreadFolder>;
	'mail.threads.update': InkboxThreadResponse;
	'mail.visibleMessages.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'mail.visibleMessages.get': InkboxBoundedMessageDetailResponse;
	'mail.visibleMessages.getAttachment': InkboxAttachmentDownloadResponse;
	'mail.visibleMessages.list': InkboxCursorPageSafeMessageResponse;
	'mail.visibleMessages.search': InkboxCursorPageMessageResponse;
	'mail.visibleMessages.updateFlags': InkboxMessageResponse;
	'mail.visibleThreads.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'mail.visibleThreads.get': InkboxBoundedThreadDetailResponse;
	'mail.visibleThreads.list': InkboxCursorPageThreadResponse;
	'mail.visibleThreads.update': InkboxThreadResponse;
	'messageSends.lookup': InkboxMessageSendLookup;
	'notes.access.grant': InkboxNoteAccessResponse;
	'notes.access.list': Array<InkboxNoteAccessResponse>;
	'notes.access.revoke': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'notes.create': InkboxNoteResponse;
	'notes.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'notes.get': InkboxNoteResponse;
	'notes.list': Array<InkboxNoteResponse>;
	'notes.update': InkboxNoteResponse;
	'organizationDomains.create': InkboxOrganizationDomainResponse;
	'organizationDomains.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'organizationDomains.get': InkboxOrganizationDomainResponse;
	'organizationDomains.list': InkboxOrganizationDomainPage;
	'organizationDomains.verify': InkboxOrganizationDomainResponse;
	'phone.calls.get': InkboxPhoneCallResponse;
	'phone.calls.getSettings': InkboxCallSettingsProjection;
	'phone.calls.hangup': InkboxPhoneCallResponse | InkboxCallCommandResponse;
	'phone.calls.list': Array<InkboxPhoneCallResponse>;
	'phone.calls.listMcpActivity': InkboxHostedMcpActivityPage;
	'phone.calls.listToolInvocations': InkboxHostedAgentToolInvocationProjectionPage;
	'phone.calls.listTranscripts': Array<InkboxPhoneTranscriptResponse>;
	'phone.calls.place':
		| InkboxPhoneCallWithRateLimitResponse
		| InkboxCallCommandResponse;
	'phone.incomingCallAction.get': InkboxIncomingCallActionResponse;
	'phone.incomingCallAction.set': InkboxIncomingCallActionResponse;
	'phone.listOrgContactRules': Array<InkboxPhoneIdentityContactRuleResponse>;
	'phone.media.getPlayback': FileOutput;
	'phone.numbers.get': InkboxPhoneNumberResponse;
	'phone.numbers.list': Array<InkboxPhoneNumberResponse>;
	'phone.numbers.provision': InkboxPhoneNumberResponse;
	'phone.numbers.release': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'phone.numbers.searchTranscripts': Array<InkboxPhoneTranscriptResponse>;
	'phone.numbers.update': InkboxPhoneNumberResponse;
	'phone.smsOptIns.get': InkboxSmsOptInResponse;
	'phone.smsOptIns.list': Array<InkboxSmsOptInResponse>;
	'phone.smsOptIns.optIn': InkboxSmsOptInResponse;
	'phone.smsOptIns.optOut': InkboxSmsOptInResponse;
	'phone.textConversations.get': Array<InkboxTextMessageResponse>;
	'phone.textConversations.list': Array<InkboxTextConversationSummary>;
	'phone.textConversations.update': InkboxTextConversationUpdateResponse;
	'phone.textConversations.updateById': Record<string, InkboxJsonValue>;
	'phone.texts.delete': Record<string, InkboxJsonValue>;
	'phone.texts.get': InkboxTextMessageResponse;
	'phone.texts.list': Array<InkboxTextMessageResponse>;
	'phone.texts.search': Array<InkboxTextMessageResponse>;
	'phone.texts.send': InkboxTextMessageResponse | InkboxTextSendCommandResponse;
	'phone.texts.update': InkboxTextMessageResponse;
	'slack.actions.get': InkboxSlackActionResponse;
	'slack.actions.getByKey': InkboxSlackActionResponse;
	'slack.applications.getRemoval': InkboxSlackApplicationRemovalResponse;
	'slack.applications.prepare': InkboxSlackSetupStatus;
	'slack.applications.remove': InkboxSlackApplicationRemovalResponse;
	'slack.archive.backfill': InkboxSlackArchiveCoverageResponse;
	'slack.archive.getCoverage': InkboxSlackArchiveCoverageList;
	'slack.archive.getSettings': InkboxSlackArchiveSettingsResponse;
	'slack.archive.listMessages': InkboxSlackArchiveMessagesResponse;
	'slack.archive.purge': Record<string, string>;
	'slack.archive.search': InkboxSlackArchiveMessagesResponse;
	'slack.archive.updateSettings': InkboxSlackArchiveSettingsResponse;
	'slack.connections.disconnect': InkboxSlackConnectionResponse;
	'slack.connections.getCapabilities': InkboxSlackCapabilitiesResponse;
	'slack.connections.importContacts': InkboxSlackContactImportResponse;
	'slack.connections.list': InkboxSlackConnectionsResponse;
	'slack.connections.listAvailable': InkboxSlackAvailableConnectionsResponse;
	'slack.conversations.get': Record<string, InkboxJsonValue>;
	'slack.conversations.join': InkboxSlackOperationResponse;
	'slack.conversations.leave': InkboxSlackOperationResponse;
	'slack.conversations.list': InkboxSlackConversationsResponse;
	'slack.conversations.listMembers': InkboxSlackMembersResponse;
	'slack.conversations.open': Record<string, InkboxJsonValue>;
	'slack.conversations.setProcessingStatus': InkboxSlackOperationResponse;
	'slack.files.download': FileOutput;
	'slack.files.get': InkboxSlackFileResponse;
	'slack.files.getPreview': FileOutput;
	'slack.files.upload': InkboxSlackOperationResponse;
	'slack.getCachedMedia': FileOutput;
	'slack.installations.start': InkboxSlackInstallResponse;
	'slack.listEmoji': InkboxSlackCachedEmojiPage;
	'slack.listOrgContactRules': Array<InkboxSlackContactRuleResponse>;
	'slack.messages.delete': InkboxSlackOperationResponse;
	'slack.messages.get': Record<string, InkboxJsonValue>;
	'slack.messages.getContext': InkboxSlackMessageContextResponse;
	'slack.messages.getPermalink': InkboxSlackPermalinkResponse;
	'slack.messages.list': InkboxSlackMessagesResponse;
	'slack.messages.send': InkboxSlackActionResponse;
	'slack.messages.update': InkboxSlackOperationResponse;
	'slack.operations.get': InkboxSlackOperationResponse;
	'slack.operations.getByKey': InkboxSlackOperationResponse;
	'slack.pins.add': InkboxSlackOperationResponse;
	'slack.pins.list': InkboxSlackPinsResponse;
	'slack.pins.remove': InkboxSlackOperationResponse;
	'slack.provisioningWorkspaces.list': InkboxSlackProvisioningWorkspacesResponse;
	'slack.provisioningWorkspaces.save': InkboxSlackProvisioningWorkspaceResponse;
	'slack.reactions.add': InkboxSlackOperationResponse;
	'slack.reactions.list': InkboxSlackReactionsResponse;
	'slack.reactions.remove': InkboxSlackOperationResponse;
	'slack.search': InkboxSlackArchiveMessagesResponse;
	'slack.streams.append': InkboxSlackOperationResponse;
	'slack.streams.start': InkboxSlackOperationResponse;
	'slack.streams.stop': InkboxSlackOperationResponse;
	'slack.users.get': Record<string, InkboxJsonValue>;
	'slack.users.list': InkboxSlackUsersResponse;
	'tunnels.get': InkboxTunnelResponse;
	'tunnels.list': InkboxListTunnelsResponse;
	'tunnels.signCsr': InkboxSignCsrResponse;
	'tunnels.update': InkboxTunnelResponse;
	'vault.getInfo': InkboxVaultResponse;
	'vault.getUnlockBundle': InkboxVaultUnlockResponse;
	'vault.initialize': InkboxVaultInitializeResponse;
	'vault.keys.list': Array<InkboxVaultKeyResponse>;
	'vault.keys.updatePrimary': InkboxVaultKeyResponse;
	'vault.secrets.create': InkboxVaultSecretResponse;
	'vault.secrets.get': InkboxVaultSecretDetailResponse;
	'vault.secrets.grantAccess': InkboxVaultSecretAccessResponse;
	'vault.secrets.list': Array<InkboxVaultSecretResponse>;
	'vault.secrets.listAccess': Array<InkboxVaultSecretAccessResponse>;
	'vault.secrets.revokeAccess': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'vault.secrets.update': InkboxVaultSecretResponse;
	'voiceAgent.getConfig': InkboxHostedAgentConfig;
	'voiceAgent.listVoices': InkboxHostedAgentVoiceCatalog;
	'voiceAgent.mcpServers.cancelAuthorization': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'voiceAgent.mcpServers.create': InkboxHostedMcpConnectionView;
	'voiceAgent.mcpServers.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'voiceAgent.mcpServers.disconnect': InkboxHostedMcpTestResult;
	'voiceAgent.mcpServers.get': InkboxHostedMcpConnectionView;
	'voiceAgent.mcpServers.getAuthorization': InkboxHostedMcpOAuthAuthorization;
	'voiceAgent.mcpServers.getCatalog': InkboxHostedMcpCatalog;
	'voiceAgent.mcpServers.list': InkboxHostedMcpConnectionList;
	'voiceAgent.mcpServers.refresh': InkboxHostedMcpTestResult;
	'voiceAgent.mcpServers.startAuthorization': InkboxHostedMcpOAuthAuthorization;
	'voiceAgent.mcpServers.test': InkboxHostedMcpTestResult;
	'voiceAgent.mcpServers.update': InkboxHostedMcpConnectionView;
	'voiceAgent.setAuthorityMode': InkboxHostedAgentConfig;
	'voiceAgent.setConfig': InkboxHostedAgentConfig;
	'webhooks.deliveries.list': InkboxListWebhookDeliveriesResponse;
	'webhooks.deliveries.replay': InkboxWebhookDeliveryResponse;
	'webhooks.getCatalog': InkboxListWebhookCatalogResponse;
	'webhooks.subscriptions.create': InkboxWebhookSubscriptionCreateResponse;
	'webhooks.subscriptions.delete': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'webhooks.subscriptions.get': InkboxWebhookSubscriptionResponse;
	'webhooks.subscriptions.list': InkboxListWebhookSubscriptionsResponse;
	'webhooks.subscriptions.update': InkboxWebhookSubscriptionResponse;
	'whatsapp.assignments.list': Array<InkboxWhatsAppAssignmentResponse>;
	'whatsapp.assignments.release': {
		/** Inkbox accepted the call; it answers with no body. */
		success: true;
	};
	'whatsapp.connect': InkboxConnectWhatsAppResponse;
	'whatsapp.conversations.get': InkboxWhatsAppConversationResponse;
	'whatsapp.conversations.getThread': InkboxWhatsAppThreadResponse;
	'whatsapp.conversations.list': Array<InkboxWhatsAppConversationSummary>;
	'whatsapp.disconnect': InkboxDisconnectWhatsAppResponse;
	'whatsapp.getLimits': InkboxWhatsAppLimitsResponse;
	'whatsapp.getOnboarding': InkboxWhatsAppOnboardingResponse;
	'whatsapp.getTriageNumber': InkboxWhatsAppTriageNumberResponse;
	'whatsapp.markRead': InkboxMarkWhatsAppReadResponse;
	'whatsapp.media.get': InkboxWhatsAppMediaResponse;
	'whatsapp.media.getPlayback': FileOutput;
	'whatsapp.media.upload': InkboxWhatsAppMediaResponse;
	'whatsapp.messages.get': InkboxWhatsAppMessageResponse;
	'whatsapp.messages.getThread': InkboxWhatsAppThreadResponse;
	'whatsapp.messages.list': Array<InkboxWhatsAppMessageResponse>;
	'whatsapp.messages.send': InkboxSendWhatsAppResponse;
	'whatsapp.numbers.assign': InkboxNumberView;
	'whatsapp.numbers.list': InkboxNumberList;
	'whatsapp.reactions.delete': InkboxWhatsAppReactionCommandResponse;
	'whatsapp.reactions.get': InkboxWhatsAppReactionCommandResponse;
	'whatsapp.reactions.send': InkboxWhatsAppReactionCommandResponse;
	'whatsapp.router.get': InkboxRouterResponse;
	'whatsapp.router.listConversations': InkboxRouterThreads;
	'whatsapp.router.listMessages': InkboxRouterMessages;
	'whatsapp.router.update': InkboxRouterResponse;
	'whatsapp.sendTyping': Record<string, string>;
};

export type InkboxWebhookPayloads = {
	'a2a.taskEvent': InkboxA2AWebhookPayload;
	'imessage.messageEvent': InkboxIMessageWebhookPayload;
	'mail.messageEvent': InkboxMailWebhookPayload;
	'phone.callEnded': InkboxPhoneCallEndedWebhookPayload;
	'phone.textEvent': InkboxPhoneTextWebhookPayload;
	'slack.event': InkboxSlackWebhookPayload;
	'transcriptions.finished': InkboxMessageTranscriptionWebhookPayload;
	'whatsapp.messageEvent': InkboxWhatsAppWebhookPayload;
};
