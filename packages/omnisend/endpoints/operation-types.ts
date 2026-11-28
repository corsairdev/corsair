// Generated from Omnisend's OpenAPI spec (https://api-docs.omnisend.com/llms.txt (OpenAPI blocks of the 108 reference pages, version 2026-03-15),
// fetched 2026-11-28); omnisend-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type OmnisendJsonValue =
	| null
	| boolean
	| number
	| string
	| OmnisendJsonValue[]
	| { [key: string]: OmnisendJsonValue | undefined };

export const OMNISEND_OPERATION_IDS = [
	'analytics.generateReport',
	'analytics.generateStatistics',
	'automations.copy',
	'automations.create',
	'automations.delete',
	'automations.deleteSchedule',
	'automations.disable',
	'automations.enable',
	'automations.get',
	'automations.getBlockUtm',
	'automations.getSchedule',
	'automations.getUtm',
	'automations.list',
	'automations.replaceBlocks',
	'automations.sendBlockTestEmail',
	'automations.setBlockUtm',
	'automations.setSchedule',
	'automations.update',
	'batches.create',
	'batches.get',
	'batches.list',
	'batches.listItems',
	'brands.connect',
	'brands.getCurrent',
	'campaigns.cancel',
	'campaigns.copy',
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.getUtm',
	'campaigns.list',
	'campaigns.restoreToDraft',
	'campaigns.resumeAbTest',
	'campaigns.selectAbTestWinner',
	'campaigns.send',
	'campaigns.sendTestEmail',
	'campaigns.setUtm',
	'campaigns.stopAbTest',
	'campaigns.update',
	'categories.create',
	'categories.delete',
	'categories.get',
	'categories.list',
	'categories.update',
	'contacts.addTags',
	'contacts.get',
	'contacts.list',
	'contacts.removeTags',
	'contacts.update',
	'contacts.updateByEmail',
	'contacts.upsert',
	'contentTranslations.listLanguages',
	'emailContent.get',
	'emailContent.render',
	'emailContent.replace',
	'events.defineSchema',
	'events.queryMetadata',
	'events.send',
	'events.updateSchema',
	'formAbSetups.create',
	'formAbSetups.delete',
	'formAbSetups.get',
	'formAbSetups.list',
	'formAbSetups.selectWinner',
	'formAbSetups.start',
	'formTemplates.get',
	'formTemplates.list',
	'formTemplates.render',
	'forms.create',
	'forms.delete',
	'forms.disable',
	'forms.enable',
	'forms.get',
	'forms.getPeriodicReport',
	'forms.getReport',
	'forms.list',
	'forms.listAbSetupReports',
	'forms.listContacts',
	'forms.render',
	'forms.update',
	'images.delete',
	'images.get',
	'images.list',
	'images.upload',
	'images.uploadFromUrl',
	'products.create',
	'products.delete',
	'products.get',
	'products.list',
	'products.replace',
	'segments.create',
	'segments.delete',
	'segments.get',
	'segments.getStatistics',
	'segments.list',
	'segments.replace',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.importFromHtml',
	'templates.list',
	'templates.render',
	'templates.replace',
	'universalLayouts.create',
	'universalLayouts.delete',
	'universalLayouts.get',
	'universalLayouts.list',
	'universalLayouts.replace',
] as const;

export type OmnisendOperationId = (typeof OMNISEND_OPERATION_IDS)[number];

/** Auto-close policy for a form A/B setup. */
export type OmnisendAbSetupAutoCloseInput = {
	/** Instant at which the test closes automatically. Must be in the future when the test is started. */
	endsAt?: string;
	/** Close the test as soon as one variant is a statistically significant winner. */
	stopOnSignificance?: boolean;
};

/** Action block configuration for creation. Exactly one action-specific field must be populated based on the type discriminator. The action-specific configuration **must** be nested under a key matching the `type` value. For example, when `type` is `"sendPush"`, the push fields go inside… */
export type OmnisendActionRequestInput = {
	/** Add tag action configuration */
	addTag?: OmnisendInputTagActionInput;
	/** Remove tag action configuration */
	removeTag?: OmnisendInputTagActionInput;
	/** Send email action configuration */
	sendEmail?: OmnisendSendEmailRequestInput;
	/** Send push notification action configuration */
	sendPush?: OmnisendSendPushRequestInput;
	/** Send SMS action configuration */
	sendSms?: OmnisendSendSmsRequestInput;
	/** Send webhook action configuration */
	sendWebhook?: OmnisendSendWebhookRequestInput;
	/** Action type discriminator */
	type:
		| 'sendEmail'
		| 'sendPush'
		| 'sendSms'
		| 'sendWebhook'
		| 'addTag'
		| 'removeTag'
		| 'unsubscribe';
	/** Unsubscribe action configuration */
	unsubscribe?: OmnisendUnsubscribeActionInput;
};

/** Gmail annotation settings */
export type OmnisendAnnotationInput = {
	/** Gmail discount description - description of the discount or promotion to display in Gmail promotion tab together with the discount code. */
	discountDescription?: string;
	/** Gmail annotation enabled */
	isEnabled?: boolean;
};

/** Campaign audience */
export type OmnisendAudienceInput = {
	/** Countries excluded from the SMS audience, as ISO 3166-1 alpha-2 codes (e.g. "US"). Only applicable to SMS campaigns. Recipients in these countries are not sent to. */
	excludedCountries?: Array<string>;
	/** Segments to exclude from the audience */
	excludedSegmentIDs?: Array<string>;
	/** Segments to include. Empty includes all subscribers */
	includedSegmentIDs?: Array<string>;
};

/** BlockComponent is a block nested inside a parent block, carrying one part of what that parent renders. Some parent blocks assign a 'role' to each of their parts, and then the parent's 'type' decides which roles it needs: a 'discount' block requires text/discount_code and accepts… */
export type OmnisendBlockComponentInput = {
	/** Button content of the component - used by roles 'discount_button' and 'product_button'. */
	button?: OmnisendButtonInput;
	/** Components nested inside this component. Only role 'product_prices' uses them. */
	components?: Array<OmnisendBlockComponentInput>;
	/** Component unique identifier - must be unique within the template */
	id?: string;
	/** Image content of the component. Product blocks use it with role 'product_image'. Countdown blocks require one without a role; its source is generated from countdown.timerID. */
	image?: OmnisendImageInput;
	/** Role the component plays inside its parent block - set only where the parent block assigns roles to its parts, and omitted otherwise. */
	role?:
		| 'discount_code'
		| 'discount_button'
		| 'discount_expiration_date'
		| 'menu_text'
		| 'product_image'
		| 'product_title'
		| 'product_description'
		| 'product_prices'
		| 'product_button'
		| 'product_current_price'
		| 'product_old_price';
	/** Style preset ID - ID of the style preset. ID must be present in template General Settings. */
	stylePresetID?: string;
	/** Style properties - style properties of the component */
	styleProperties?: OmnisendStylePropertiesInput;
	/** Text content of the component - supports HTML formatting and personalization tags. For role 'discount_code' this is the code the recipient sees; on a platform that issues its own codes it is replaced at send time, so it carries the placeholder XXXX-XXXX-XXXX. */
	text?: string;
	/** Component type. Only these block types can be nested as a component. */
	type?: 'text' | 'button' | 'image' | 'price';
};

/** Body settings for the template */
export type OmnisendBodyInput = {
	/** Body background color - hex color */
	backgroundColor: string;
	/** Body background image ID - must be present in Image API */
	backgroundImageID?: string;
	/** Body background repeat */
	backgroundRepeat?: 'repeat' | 'no-repeat';
	/** Body background size */
	backgroundSize?: 'contain' | 'cover' | 'auto';
};

/** Button block settings */
export type OmnisendButtonInput = {
	/** Button is full width */
	isFullWidth?: boolean;
	/** Button link */
	link?: string;
	/** Button text */
	text?: string;
	/** Button translation key - used for internationalization support */
	translationKey?: string;
};

/** Button preset for consistent design */
export type OmnisendButtonPresetInput = {
	/** Button preset unique identifier */
	id: string;
	/** Button preset name */
	name?: string;
	/** Button preset styles */
	styles: OmnisendButtonStyleInput;
};

/** Button preset style properties */
export type OmnisendButtonStyleInput = {
	/** Button background color - hex color or transparent */
	backgroundColor?: string;
	/** Button border style */
	border?: string;
	/** Button border radius - from 0px to 200px */
	borderRadius: string;
	/** Button font color - hex color */
	color: string;
	/** Button font family */
	fontFamily: string;
	/** Button font size - from 3px to 100px */
	fontSize: string;
	/** Button font style */
	fontStyle?: 'normal' | 'italic';
	/** Button font weight */
	fontWeight?: string;
	/** Button letter spacing - spacing between letters, from -1px to 120px */
	letterSpacing?: string;
	/** Button padding bottom - from 0px to 240px */
	paddingBottom?: string;
	/** Button padding left - from 0px to 120px */
	paddingLeft?: string;
	/** Button padding right - from 0px to 120px */
	paddingRight?: string;
	/** Button padding top - from 0px to 240px */
	paddingTop?: string;
	/** Button text decoration - omit for no decoration */
	textDecoration?: 'underline' | 'line-through';
};

/** Campaign message channel */
export type OmnisendCampaignChannelInput = 'email' | 'push' | 'sms';

/** UTM tag values. Providing empty values resets them to defaults. */
export type OmnisendCampaignsUTMTagsInput = {
	/** UTM campaign parameter (max 250 characters) */
	campaign?: string;
	/** UTM medium parameter (max 250 characters) */
	medium?: string;
	/** UTM source parameter (max 250 characters) */
	source?: string;
};

/** Column is a single column of the row */
export type OmnisendColumnInput = {
	/** Column blocks - used to group content into logical blocks */
	blocks?: Array<OmnisendEmailContentBlockInput>;
	/** Column unique identifier - must be unique within the template */
	id?: string;
	/** Column style properties - used to configure the column styling */
	styleProperties?: OmnisendStylePropertiesInput;
	/** Column width - used to set the width of the column */
	width?: string;
};

/** Channel subscription details. */
export type OmnisendContactChannelRequestInput = {
	/** Subscription status */
	status: 'subscribed' | 'nonSubscribed' | 'unsubscribed';
	/** Date when the channel status was last changed */
	statusChangedAt?: string;
};

/** Consent record. */
export type OmnisendContactConsentRequestInput = {
	/** Consent collection timestamp in RFC3339 format. Defaults to current time if not provided */
	createdAt?: string;
	/** IP address at time of consent */
	ip?: string;
	/** Source of consent */
	source?: string;
	/** User agent at time of consent */
	userAgent?: string;
};

/** Contact filter group containing one or more contact filters combined by a logical operator. */
export type OmnisendContactFilterGroupRequestInput = {
	/** Filters within this group. At least one filter is required. */
	filters: Array<OmnisendContactFilterRequestInput>;
	/** Logical operator combining filters within this group */
	logicalOperator: 'and' | 'or';
};

/** Contact filter condition applied to contact properties. Each of the 10 supported fields has a fixed set of allowed operators and a specific value shape: | Field | Operators | Value shape | |---|---|---| | `segmentID` | `eq`, `neq` | Segment ID string, e.g. `"000000000000000000000001"` | | `tag`… */
export type OmnisendContactFilterRequestInput = {
	/** Contact property name to filter on */
	field:
		| 'segmentID'
		| 'tag'
		| 'dateAdded'
		| 'firstName'
		| 'lastName'
		| 'gender'
		| 'country'
		| 'state'
		| 'city'
		| 'postalCode';
	/** Comparison operator — allowed values depend on the field; see the type description. */
	operator: 'eq' | 'neq' | 'gt' | 'lt' | 'contains' | 'notContains';
	/** Filter value as a string. For "gender" must be "m" or "f"; for "dateAdded" an ISO-8601 date in YYYY-MM-DD format. Required and non-empty for all contact filters. */
	value: string;
};

/** A unique contact identifier (email or phone). For phone: provide the full number with country code prefix in E.164 format (e.g. +1234567890). */
export type OmnisendContactIdentifierRequestInput = {
	/** Communication channels for this identifier */
	channels?: Record<string, OmnisendContactChannelRequestInput>;
	/** Consent information */
	consent?: OmnisendContactConsentRequestInput;
	/** Identifier value. For email: a valid email address. For phone: full phone number in E.164 format with country code prefix (e.g. +1234567890) */
	id: string;
	/** Whether to send a welcome message for this identifier. Defaults to true. Takes effect only if the welcome workflow is enabled. */
	sendWelcomeMessage?: boolean;
	/** Source of the identifier */
	source?: string;
	/** Identifier type */
	type: 'email' | 'phone';
};

/** Contact-level tracking consents. */
export type OmnisendContactTrackingConsentsRequestInput = {
	/** Email open tracking consent */
	emailOpen?: OmnisendEmailOpenTrackingConsentRequestInput;
};

/** Content settings for the template */
export type OmnisendContentSettingsInput = {
	/** Content background color - hex color */
	backgroundColor: string;
	/** Content text color - hex color */
	color: string;
	/** Content font family */
	fontFamily: string;
	/** Content font size - from 3px to 100px */
	fontSize: string;
	/** Content width - from 300px to 2000px */
	width: string;
};

/** Countdown block settings. The timer is identified by timerID; src is generated and signed by Omnisend. */
export type OmnisendCountdownInput = {
	/** Alternative text for the countdown image */
	alt?: string;
	/** Destination URL opened when the countdown is clicked */
	link?: string;
	/** Timer identifier returned by the timer API */
	timerID: string;
};

/** A/B test configuration for campaign creation. */
export type OmnisendCreateABTestInput = {
	settings: OmnisendCreateABTestSettingsInput;
	variants: OmnisendCreateABTestVariantsInput;
};

/** Decision time before selecting a winner. Same shape as booster delay. */
export type OmnisendCreateABTestDecisionTimeInput = {
	/** Number of time units to wait before selecting a winner */
	amount: number;
	/** Time unit: "h" for hours, "d" for days */
	unit: 'h' | 'd';
};

/** A/B test settings for campaign creation. */
export type OmnisendCreateABTestSettingsInput = {
	/** Time to wait before selecting a winner. Required unless testSizePercent is 100 */
	decisionTime?: OmnisendCreateABTestDecisionTimeInput;
	/** Percentage of the audience used for testing (10-100). When 100, all recipients get a variant (send-all mode) */
	testSizePercent: number;
	/** Metric used to determine the winner. Required unless testSizePercent is 100 */
	winningMetric?: 'openRate' | 'clickRate';
};

/** A/B test variant for creation. Email fields live under `content.email`. */
export type OmnisendCreateABTestVariantInput = {
	/** Variant content grouped by channel */
	content: OmnisendCreateABTestVariantContentInput;
};

/** Variant content grouped by channel for creation. */
export type OmnisendCreateABTestVariantContentInput = {
	/** Email content for this variant */
	email: OmnisendCreateABTestVariantEmailInput;
};

/** Email content fields for an A/B test variant creation. */
export type OmnisendCreateABTestVariantEmailInput = {
	/** Preview text shown in the inbox after the subject line */
	preheader?: string;
	/** Reply-to email address for recipient responses. Omit it and replies go to the sender address. Set it only when a specific address is required: it must be an address verified for the brand, and verification status is not exposed here, so an address that is guessed, or copied from another… */
	replyToEmail?: string;
	/** Sender email address. Omit it and the campaign is sent from the sender address configured for the brand. Set it only when a specific address is required: which addresses a brand may send from follows from its sender setup and is not exposed here, so an address that is guessed, or copied from… */
	senderEmail?: string;
	/** Display name of the sender */
	senderName?: string;
	/** Email subject line */
	subject: string;
	/** Template unique identifier. Must reference an existing template. */
	templateID: string;
};

/** A/B test variants object with keys "a" and "b". */
export type OmnisendCreateABTestVariantsInput = {
	a: OmnisendCreateABTestVariantInput;
	b: OmnisendCreateABTestVariantInput;
};

/** A/B test block configuration for creation. Contacts are randomly assigned to branch A (aBlocksPercentage %) or branch B (remainder). At least one of aBlocks or bBlocks must be non-empty. */
export type OmnisendCreateABTestingRequestInput = {
	/** Blocks executed for contacts in branch A. */
	aBlocks?: Array<OmnisendCreateBlockRequestInput>;
	/** Percentage of contacts routed to branch A. Branch B receives the remainder. */
	aBlocksPercentage: number;
	/** Blocks executed for contacts in branch B. */
	bBlocks?: Array<OmnisendCreateBlockRequestInput>;
};

/** Form A/B setup version to create. */
export type OmnisendCreateAbSetupVersionInput = {
	/** Variant form name */
	name?: string;
	/** Traffic distribution weight. Each weight must be at least 1 and both weights must sum to 100 */
	weight?: number;
};

/** Automation workflow block for creation. Exactly one of the type-specific fields (action, delay, split, abTesting) must be populated based on the type discriminator. **Constraint:** A `delay` block cannot end the workflow. It may be the final block inside a conditional-split branch when sibling… */
export type OmnisendCreateBlockRequestInput = {
	/** A/B test block configuration */
	abTesting?: OmnisendCreateABTestingRequestInput;
	/** Action block configuration */
	action?: OmnisendActionRequestInput;
	/** Delay block configuration */
	delay?: OmnisendCreateDelayRequestInput;
	/** Split block configuration */
	split?: OmnisendCreateSplitRequestInput;
	/** Client-provided block identifier, scoped to this request. Used in validation error messages and split filter cross-references. Replaced with a server-assigned id in the response. Must be unique within the request. */
	temporaryID: string;
	/** Block type discriminator */
	type: 'delay' | 'action' | 'split' | 'abTesting';
};

/** Delay settings for booster campaign */
export type OmnisendCreateBoosterDelayInput = {
	/** Amount of time units. Minimum 0 (SMS booster only — means "send together with parent"). Maximum 240 hours (or 10 days) */
	amount: number;
	/** Time unit: "h" for hours, "d" for days */
	unit: 'h' | 'd';
};

/** Booster settings for campaign creation */
export type OmnisendCreateBoosterSettingsInput = {
	/** Parent campaign ID to boost */
	campaignID: string;
	/** Delay before sending the booster after the parent campaign is sent. Only required when the parent campaign is in draft status */
	delay?: OmnisendCreateBoosterDelayInput;
	/** Which recipients to target: "nonOpeners" or "nonClickers" */
	sendTo: 'nonOpeners' | 'nonClickers';
};

/** Campaign content for creation */
export type OmnisendCreateContentInput = {
	/** Email content */
	email?: OmnisendCreateEmailInput;
	/** SMS content */
	sms?: OmnisendCreateSMSInput;
};

/** Delay block configuration for creation. **Constraint:** A delay block cannot be the last block in its sequence. At least one action block must follow it. This applies at all nesting levels, except a branch whose enclosing split or A/B test block has sibling blocks after it — there the delay… */
export type OmnisendCreateDelayRequestInput = {
	/** Days of the week when the delay is allowed to resolve. Omit to allow all days. */
	allowedWeekdays?: Array<
		| 'sunday'
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
	>;
	/** Duration configuration — required when mode is "duration" */
	duration?: OmnisendCreateDurationRequestInput;
	/** Delay mode discriminator */
	mode: 'duration' | 'immediate' | 'specificTime';
	/** Time in HH:MM 24-hour format — required when mode is "specificTime" */
	time?: string;
};

/** Duration configuration for delay creation. */
export type OmnisendCreateDurationRequestInput = {
	/** Duration amount — must be at least 1 */
	amount: number;
	/** Duration unit */
	units: 'm' | 'h' | 'd' | 'w' | 'M';
};

/** Email content for campaign creation */
export type OmnisendCreateEmailInput = {
	/** Email preheader text */
	preheader?: string;
	/** Reply-to email address for recipient responses. Omit it and replies go to the sender address. Set it only when a specific address is required: it must be an address verified for the brand, and verification status is not exposed here, so an address that is guessed, or copied from another… */
	replyToEmail?: string;
	/** Sender email address. Omit it and the campaign is sent from the sender address configured for the brand. Set it only when a specific address is required: which addresses a brand may send from follows from its sender setup and is not exposed here, so an address that is guessed, or copied from… */
	senderEmail?: string;
	/** Sender display name shown in the recipient's inbox */
	senderName?: string;
	/** Email subject line */
	subject?: string;
	/** Email template unique identifier. Required for regular email campaigns: creation is rejected without it, even when the campaign would be saved as a draft. Booster campaigns are exempt — they may still send content.email (e.g. to override the subject) but do not require a template, inheriting the… */
	templateID: string;
};

/** SMS content for campaign creation */
export type OmnisendCreateSMSInput = {
	/** Compliance text appended to every SMS */
	compliance: OmnisendCreateSMSComplianceInput;
	/** Image ID obtained from the Images API. When set, the message is delivered as MMS to US/CA recipients; other countries receive SMS without the image. Image must be JPEG, JPG, PNG, or GIF and not exceed 500 KB */
	imageID?: string;
	/** Auto-shorten links in message body. Default: true */
	isLinkShorteningEnabled?: boolean;
	/** SMS message body. When sent as SMS, the message (including the appended compliance text and unsubscribe link/keyword) must not exceed 9 SMS segments for either US/CA or other-country recipients. When sent as MMS, the message (including the appended compliance text) must not exceed 1600… */
	message: string;
};

/** SMS compliance text settings for creation */
export type OmnisendCreateSMSComplianceInput = {
	/** STOP keyword text for US/CA recipients */
	stopKeywordText: string;
	/** Unsubscribe link text for non-US/CA recipients */
	unsubscribeLinkText: string;
};

/** Sending settings for campaign creation */
export type OmnisendCreateSendingSettingsInput = {
	/** Whether timezone optimization is enabled. Only available with immediate or scheduled strategy, and only in email campaigns */
	isTZOptimizationEnabled?: boolean;
	/** Optimization objective for personalized sends. Required when strategy is "personalized", must not be set otherwise */
	optimizeFor?: 'opens' | 'clicks' | 'orders';
	/** Whether personalized sends avoid contact-local hours from 22:00 through 06:59. Defaults to true for personalized sends and must not be set for other strategies */
	respectQuietHours?: boolean;
	/** Campaign scheduled send time in RFC 3339 format. Required when strategy is "scheduled" or "personalized", must not be set for "immediate". For "scheduled" it must be in the future and within one year from now. For "personalized" only the calendar date in the brand timezone is used, not the… */
	scheduledAt?: string;
	/** Sending strategy. Default: immediate. "personalized" enables send time optimization and is only available for regular email campaigns in stores whose plan includes personalized send times and that are eligible for them */
	strategy?: 'immediate' | 'scheduled' | 'personalized';
};

/** Automation settings configuration for create. All sub-fields are optional — omit to use engine defaults. `sendingThresholds` does not accept `null` — sending `null` returns `400`. `frequencyLimiter` accepts `null` (treated the same as omitted: no limiter is set). `overlapLimiter` accepts `null`… */
export type OmnisendCreateSettingsRequestInput = {
	/** Frequency limiter — omit or null to leave the automation without a frequency limit. */
	frequencyLimiter?: OmnisendFrequencyLimiterRequestInput;
	/** Overlap limiter — omit (or send `null`) to disable the overlap check. When provided, the contact is skipped if they are currently in (or recently completed) the listed automations. */
	overlapLimiter?: OmnisendOverlapLimiterRequestInput;
	/** Sending thresholds — omit to use defaults (subscribed only). */
	sendingThresholds?: OmnisendSendingThresholdsRequestInput;
};

/** Conditional split block configuration for creation. Filter types (event, contact, message) can be mixed in one group. At least one of trueBlocks or falseBlocks must be non-empty. Sibling blocks placed after a split run for contacts from both branches — the branches re-converge on the shared… */
export type OmnisendCreateSplitRequestInput = {
	/** Blocks executed when the filter group evaluates to false. */
	falseBlocks?: Array<OmnisendCreateBlockRequestInput>;
	/** Filter group evaluated when contacts reach this block. At least one filter is required. */
	filterGroup: OmnisendSplitFilterGroupRequestInput;
	/** Blocks executed when the filter group evaluates to true. */
	trueBlocks?: Array<OmnisendCreateBlockRequestInput>;
};

/** Trigger condition for automation creation — specifies the event that starts the automation and optional event-property filter groups evaluated before the workflow is entered. Use the [event metadata endpoint](https://api-docs.omnisend.com/v2026-preview/reference/post_event_metadata_query) to… */
export type OmnisendCreateTriggerConditionInput = {
	/** Event system name that triggers the automation workflow (e.g. "placed order", "started checkout"). See the parent struct description for available built-in trigger events. */
	event: string;
	/** Event filter groups — multiple groups are combined with AND logic. */
	filterGroups?: Array<OmnisendEventFilterGroupRequestInput>;
	/** Integration platform that generated the event (e.g. "shopify", "omnisend", "api"). When the event supports multiple origins, this field is required and must match one of them. When the event has a single origin, this field can be omitted — the origin is selected automatically. Omit for built-in… */
	origin?: string;
};

/** Trigger configuration for automation creation. The condition.event field identifies what triggers the automation workflow. Most events are standard events received via the Events API (e.g. "placed order", "started checkout"). In addition, the following built-in trigger events are available… */
export type OmnisendCreateTriggerRequestInput = {
	/** Audience filter group for contact eligibility — contacts not matching the filters are not enrolled */
	audienceFilterGroup?: OmnisendContactFilterGroupRequestInput;
	/** Trigger event condition (event name + origin) */
	condition: OmnisendCreateTriggerConditionInput;
	/** Inactivity settings — the workflow fires only after the contact has been inactive for the specified period */
	inactivitySettings?: OmnisendInactivitySettingsRequestInput;
};

/** Custom font reference */
export type OmnisendCustomFontInput = {
	/** ID of the custom font */
	id?: string;
};

/** Discount block settings. This object configures the offer only — the parts the recipient sees (code, redeem button, expiry) are separate role-tagged blocks in the parent block's 'components'. See the notes on the Block 'type' field for the roles each discount block type requires. An offer needs… */
export type OmnisendDiscountInput = {
	/** ID of the custom collection that the discount applies to */
	appliesToCustomCollectionID?: number;
	/** ID of the specific resource (product, collection) that the discount applies to */
	appliesToID?: number;
	/** Type of resource the discount applies to */
	appliesToResource?: string;
	/** ID of the smart collection that the discount applies to */
	appliesToSmartCollectionID?: number;
	/** Discount code customers use to apply the discount. In 'discount' (Shopify, BigCommerce) and 'dynamicDiscount' (WooCommerce) blocks the code is not taken from here: the store issues a unique code per recipient when the email is sent, and it replaces both this value and the text of the… */
	code?: string;
	/** Whether the discount can be combined with other discounts */
	combinesWith?: OmnisendEmailContentDiscountCombinesWithInput;
	/** Conditions that must be met for the discount to apply */
	discountConditions?: string;
	/** Discount type */
	discountType?: 'percentage' | 'fixed_amount' | 'shipping';
	/** Number of days until the discount ends */
	endsIn?: string;
	/** When generating a discount code in integrated platforms, the discount can only be used once per customer */
	isAppliedOncePerCustomer?: boolean;
	/** Whether the redeem button is hidden in the discount block */
	isButtonHidden?: boolean;
	/** Whether the discount should be automatically applied to the order */
	isDiscountApplied?: boolean;
	/** Whether the discount should exclude items that are already on sale */
	isItemsOnSaleExcluded?: boolean;
	/** URL link for the discount */
	link?: string;
	/** Minimum order amount required for the discount to apply */
	minimumOrderAmount?: string;
	/** Text displayed to customers when they apply the discount */
	offerText?: string;
	/** Title of the discount */
	title?: string;
	/** Maximum number of times the discount can be used */
	usageLimit?: string;
	/** Date and time when the discount expires */
	validUntil?: string;
	/** Format of the expiration date */
	validUntilFormat?: string;
	/** Formatted expiration date */
	validUntilFormatted?: string;
	/** Fixed value of the discount */
	valueFixed?: string;
	/** Percentage value of the discount */
	valuePercentage?: string;
};

/** Duration amount and unit for inactivity settings. */
export type OmnisendDurationRequestInput = {
	/** Number of time units (must be > 0) */
	amount: number;
	/** Time unit */
	units: 'm' | 'h' | 'd' | 'w';
};

/** Dynamic list settings for repeating content blocks */
export type OmnisendDynamicListInput = {
	/** Number of columns in the list layout */
	columnCount?: number;
	/** Layout type for the list items */
	layout?: string;
	/** Data path for the list items source */
	listPath?: string;
	/** Maximum number of items to display */
	repetitionCount?: number;
};

/** Block is a single element in the email template */
export type OmnisendEmailContentBlockInput = {
	button?: OmnisendButtonInput;
	/** Components - the parts a block renders that are not covered by its own content field. Some blocks tag each part with a 'role', and which roles they need is decided by their 'type': a 'discount' block holds the code, the redeem button and the expiry date, a 'menu' block holds its items, a… */
	components?: Array<OmnisendBlockComponentInput>;
	countdown?: OmnisendCountdownInput;
	discount?: OmnisendDiscountInput;
	dynamicDiscount?: OmnisendDiscountInput;
	htmlCode?: OmnisendHTMLCodeInput;
	/** Block unique identifier - must be unique within the template */
	id?: string;
	image?: OmnisendImageInput;
	lineSpace?: OmnisendLineSpaceInput;
	logo?: OmnisendLogoInput;
	orderAddresses?: OmnisendOrderAddressesInput;
	orderProducts?: OmnisendOrderProductsInput;
	orderSummary?: OmnisendOrderSummaryInput;
	orderTotal?: OmnisendOrderTotalInput;
	preheader?: OmnisendPreheaderInput;
	product?: OmnisendProductInput;
	/** Block role */
	role?:
		| 'product_image'
		| 'product_title'
		| 'product_description'
		| 'product_prices'
		| 'product_button'
		| 'discount_code'
		| 'discount_button'
		| 'discount_expiration_date'
		| 'product_current_price'
		| 'product_old_price'
		| 'menu_text';
	/** Secondary style preset ID - ID of the secondary style preset. Used for order blocks styling as smaller text style. */
	secondaryStylePresetID?: string;
	social?: OmnisendSocialInput;
	staticDiscount?: OmnisendDiscountInput;
	/** Style preset ID - ID of the style preset. Used for Button or Text block styling. ID must be present in template General Settings. */
	stylePresetID?: string;
	/** Style properties - style properties of the block */
	styleProperties?: OmnisendStylePropertiesInput;
	/** Text content of the block - supports HTML formatting and personalization tags */
	text?: string;
	/** Block type. Notes: - 'html' is read-only and cannot be set on create/update. - 'menu' is a container block with no dedicated content field — items must be provided via 'components' as text blocks with role 'menu_text', and styling is configured through 'stylePresetID' and 'styleProperties'. -… */
	type?:
		| 'html'
		| 'htmlCode'
		| 'text'
		| 'image'
		| 'video'
		| 'logo'
		| 'menu'
		| 'social'
		| 'button'
		| 'product'
		| 'discount'
		| 'staticDiscount'
		| 'dynamicDiscount'
		| 'orderSummary'
		| 'orderProducts'
		| 'orderTotal'
		| 'orderAddresses'
		| 'lineSpace'
		| 'preheader'
		| 'price'
		| 'countdown';
	video?: OmnisendVideoInput;
};

/** Discount combines with settings */
export type OmnisendEmailContentDiscountCombinesWithInput = {
	/** Whether the discount can be combined with order-level discounts */
	isOrderDiscountsCombined?: boolean;
	/** Whether the discount can be combined with product-specific discounts */
	isProductDiscountsCombined?: boolean;
	/** Whether the discount can be combined with shipping discounts */
	isShippingDiscountsCombined?: boolean;
};

/** Settings for the section */
export type OmnisendEmailContentSettingsInput = {
	/** Background type - determines whether the section background is a color or image */
	backgroundType?: string;
	/** Custom fonts used in this section */
	customFonts?: Array<OmnisendCustomFontInput>;
	/** Dynamic list configuration for repeating content */
	dynamicList?: OmnisendDynamicListInput;
	/** Products to exclude from display when abandoned products section is used. Products are excluded from display if they are in the list of products that were abandoned by the contact. */
	excludeProducts?: Array<string>;
	/** Filter for the section - used to conditionally display content based on contact or event properties */
	filter?: OmnisendFilterInput;
	/** Whether to disable column stacking - used to display content in a single column */
	isColumnStackDisabled?: boolean;
	/** Whether to hide out of stock products from product sections */
	isOutOfStockHidden?: boolean;
	/** Whether to fit product images to the container - used to display product images in a single line */
	isProductImagesFitted?: boolean;
	/** Side by side product layout */
	sideBySideProductLayout?: string;
	/** Universal layout ID - ID of the universal layout the section references. If present, the section is a universal_layout reference whatever its type: it is returned with rows null, its content comes from the universal layout, and rows sent with it are rejected. Locked email content (a campaign… */
	universalLayoutID?: string;
};

/** Email open tracking consent record. */
export type OmnisendEmailOpenTrackingConsentRequestInput = {
	/** Consent status */
	status: 'given' | 'declined';
	/** Timestamp when the consent status was collected. Defaults to current time if not provided */
	statusDate?: string;
};

/** Event filter group containing one or more event property filters combined by a logical operator. */
export type OmnisendEventFilterGroupRequestInput = {
	/** Event filters within this group. At least one filter is required. */
	filters: Array<OmnisendEventFilterRequestInput>;
	/** Logical operator combining filters within this group */
	logicalOperator: 'and' | 'or';
};

/** Event filter condition applied to event properties. Use a property path returned by the [event metadata endpoint](https://api-docs.omnisend.com/v2026-preview/reference/post_event_metadata_query). Choose a numeric property when using numeric operators (`gt`, `gte`, `lt`, `lte`); applying them to… */
export type OmnisendEventFilterRequestInput = {
	/** Event property path to filter on */
	field: string;
	/** Comparison operator */
	operator:
		| 'eq'
		| 'neq'
		| 'gt'
		| 'gte'
		| 'lt'
		| 'lte'
		| 'contains'
		| 'notContains'
		| 'startsWith'
		| 'endsWith'
		| 'exists'
		| 'notExists'
		| 'in'
		| 'notIn';
	/** Filter value. Must match the property's data type (number for numeric properties, string for string properties). Omit for operators "exists" and "notExists". */
	value?: OmnisendJsonValue;
};

/** Exit condition configuration. When a contact triggers any exit condition event, they are immediately removed from the automation workflow. */
export type OmnisendExitConditionRequestInput = {
	/** Event system name that triggers the exit (e.g. "placed order", "started checkout"). Built-in trigger events ("birthday", "product back in stock") are not allowed. */
	event: string;
	/** Event filter group for the exit condition. */
	filterGroup?: OmnisendEventFilterGroupRequestInput;
	/** Integration platform that generated the event (e.g. "shopify", "omnisend", "api"). When the event supports multiple origins, this field is required and must match one of them. When the event has a single origin, this field can be omitted — the origin is selected automatically. Omit for the… */
	origin?: string;
};

/** Filter for conditional display of content */
export type OmnisendFilterInput = {
	/** Filter operator - logical operator to combine multiple filter rules */
	operator?: string;
	/** Filter rules - array of filter rules */
	rules?: Array<OmnisendRuleInput>;
};

/** Filter property for conditional display of content */
export type OmnisendFilterPropertyInput = {
	/** Filter property unique identifier */
	id?: string;
	/** Indicates whether the property is a built-in system property (true) or a user-defined custom property (false). */
	isSystem?: boolean;
	/** Filter property name */
	name?: string;
	/** Filter property type */
	type?: string;
};

/** Subscriber audience targeting. */
export type OmnisendFormAudienceInput = {
	/** Subscriber audience the form targets */
	type?: OmnisendFormAudienceTypeInput;
};

/** Subscriber audience type. */
export type OmnisendFormAudienceTypeInput = 'subscribers' | 'notSubscribers';

/** Auto-redirect configuration shown after a successful submission. */
export type OmnisendFormAutoRedirectInput = {
	/** Text shown during the redirect countdown */
	countdownText?: string;
	/** Delay before redirecting, in milliseconds. Range: 1000-60000 */
	delayMs?: number;
	/** Whether auto-redirect is enabled */
	isEnabled?: boolean;
	/** Whether the redirect opens in a new tab */
	shouldOpenInNewTab?: boolean;
	/** URL to redirect to after submission */
	url?: string;
};

/** Background image configuration. */
export type OmnisendFormBackgroundImageInput = {
	/** Background image fit */
	fit?: 'cover' | 'contain';
	/** ID references an existing image in the Images API. */
	id: string;
	/** Background image padding in pixels or percent */
	padding?: string;
	/** Background image position */
	position?: 'left' | 'right' | 'top' | 'back';
	/** Background image size in pixels or percent */
	size?: string;
};

/** Single content block within a column */
export type OmnisendFormBlockInput = {
	/** Button block configuration, present when the block type is button */
	button?: OmnisendFormButtonInput;
	/** Checkbox selection field configuration, present when the block type is checkboxField */
	checkboxField?: OmnisendFormCheckboxFieldInput;
	/** Countdown timer block configuration, present when the block type is countdownTimer */
	countdownTimer?: OmnisendFormCountdownTimerInput;
	/** Date input field configuration, present when the block type is dateField */
	dateField?: OmnisendFormDateFieldInput;
	/** Discount block configuration, present when the block type is discount */
	discount?: OmnisendFormDiscountInput;
	/** Dropdown selection field configuration, present when the block type is dropdownField */
	dropdownField?: OmnisendFormDropdownFieldInput;
	/** Email input field configuration, present when the block type is emailField */
	emailField?: OmnisendFormEmailFieldInput;
	/** Block unique identifier (read-only) */
	id?: string;
	/** Image block configuration, present when the block type is image */
	image?: OmnisendFormImageInput;
	/** Generic profile input field configuration, present when the block type is inputField */
	inputField?: OmnisendFormInputFieldInput;
	/** Legal consent block configuration, present when the block type is legal */
	legal?: OmnisendFormLegalInput;
	/** Line or space block configuration, present when the block type is lineSpace */
	lineSpace?: OmnisendFormLineSpaceInput;
	/** Mystery box game block configuration, present when the block type is mysteryBox. Requires Forms Plus (included in the Pro plan or as an add-on). */
	mysteryBox?: OmnisendFormMysteryBoxInput;
	/** Phone number input field configuration, present when the block type is phoneNumberField */
	phoneNumberField?: OmnisendFormPhoneNumberFieldInput;
	/** Radio selection field configuration, present when the block type is radioField */
	radioField?: OmnisendFormRadioFieldInput;
	/** Semantic role of the block within the form */
	role?: string;
	/** Scratch card game block configuration, present when the block type is scratchCard. Requires Forms Plus (included in the Pro plan or as an add-on). */
	scratchCard?: OmnisendFormScratchCardInput;
	/** Identifier of the style preset applied to the block */
	stylePresetID?: string;
	/** Block style properties */
	styleProperties?: OmnisendFormStylePropertiesInput;
	/** Text block content, present when the block type is text */
	text?: string;
	/** Content block type */
	type:
		| 'text'
		| 'image'
		| 'button'
		| 'lineSpace'
		| 'emailField'
		| 'legal'
		| 'phoneNumberField'
		| 'inputField'
		| 'dateField'
		| 'dropdownField'
		| 'radioField'
		| 'checkboxField'
		| 'wheelOfFortune'
		| 'discount'
		| 'countdownTimer'
		| 'mysteryBox'
		| 'scratchCard';
	/** Wheel-of-fortune block configuration, present when the block type is wheelOfFortune */
	wheelOfFortune?: OmnisendFormWheelOfFortuneInput;
};

/** Form body (container) presentation. */
export type OmnisendFormBodyInput = {
	/** Body background color */
	backgroundColor?: string;
	/** Body border color */
	borderColor?: string;
	/** Body border radius in pixels */
	borderRadius: string;
	/** Body border style */
	borderStyle: 'dotted' | 'solid' | 'dashed';
	/** Body border width in pixels */
	borderWidth: string;
};

/** Button block configuration. */
export type OmnisendFormButtonInput = {
	/** Custom contact property the button writes to */
	customProfileField?: string;
	/** Whether the button spans the full width */
	isFullWidth?: boolean;
	/** Whether clicking the button writes a value to a custom contact property, honored only for submit buttons */
	isMappedToCustomProperty?: boolean;
	/** URL opened when the button is clicked */
	link?: string;
	/** Button label text */
	text?: string;
	/** Button behavior when clicked */
	type?: 'link' | 'submit' | 'close' | 'nextStep';
	/** Value written to the custom contact property when the button is clicked */
	value?: string;
};

/** Named button style preset */
export type OmnisendFormButtonPresetInput = {
	/** Preset identifier */
	id: 'primary_button' | 'secondary_button' | 'tertiary_button';
	/** Preset name */
	name?: string;
	/** Styling applied to the preset */
	styles: OmnisendFormButtonStyleInput;
};

/** Styling applied to a button preset. */
export type OmnisendFormButtonStyleInput = {
	/** Button background color */
	backgroundColor?: string;
	/** Button border color */
	borderColor?: string;
	/** Button border radius in pixels. Range: 0-50 */
	borderRadius: string;
	/** Button border style */
	borderStyle: 'dotted' | 'solid' | 'dashed';
	/** Button border width in pixels */
	borderWidth: string;
	/** Button text color */
	color: string;
	/** Button font family */
	fontFamily: string;
	/** Button font size in pixels. Range: 8-96 */
	fontSize: string;
	/** Button font style */
	fontStyle: 'italic' | 'normal';
	/** Button font weight */
	fontWeight: 'bold' | 'normal';
	/** Button background color on hover */
	hoverBackgroundColor?: string;
	/** Button border color on hover */
	hoverBorderColor?: string;
	/** Button text color on hover */
	hoverColor?: string;
	/** Bottom padding in pixels */
	paddingBottom?: string;
	/** Left padding in pixels */
	paddingLeft?: string;
	/** Right padding in pixels */
	paddingRight?: string;
	/** Top padding in pixels */
	paddingTop?: string;
	/** Button text alignment */
	textAlign?: 'left' | 'center' | 'right';
	/** Button text decoration */
	textDecoration: 'underline' | 'none';
};

/** Shopping cart targeting rules. Available only for Shopify stores; requests for other platforms are rejected. Each threshold means "at least"; when both are set, both must hold. */
export type OmnisendFormCartTargetingInput = {
	/** Minimum number of items in the cart */
	itemCount?: number;
	/** Minimum cart value in minor currency units (e.g. 5000 means 50.00). Currency-agnostic */
	value?: number;
};

/** Checkbox selection field configuration. */
export type OmnisendFormCheckboxFieldInput = {
	/** Custom contact property the input maps to */
	customProfileField?: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOptionInput>;
	/** Contact profile field the input maps to */
	profileField: 'custom';
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Click-outside-to-close behavior configuration. */
export type OmnisendFormClickOutsideInput = {
	/** Whether clicking outside the form closes it */
	isEnabled?: boolean;
};

/** Close button appearance. */
export type OmnisendFormCloseButtonInput = {
	/** Close button background color */
	backgroundColor?: string;
	/** Close button color */
	color: string;
	/** Whether the close button is visible */
	isVisible?: boolean;
	/** Distance from the chosen corner in px. When omitted or null on update, the stored value is kept */
	margins?: OmnisendFormCloseButtonMarginsInput;
	/** Top corner of the form the close button sits in. Defaults to right. When omitted or null on update, the stored value is kept */
	position?: 'left' | 'right';
};

/** Close button margins for one device, in px. Send all of top, left and right; an omitted value is stored as 0. */
export type OmnisendFormCloseButtonMarginValuesInput = {
	/** Distance from the left edge of the form, applied when position is left */
	left?: number;
	/** Distance from the right edge of the form, applied when position is right */
	right?: number;
	/** Distance from the top edge of the form */
	top?: number;
};

/** Close button margins per device, in px. Only top and the side matching position are applied. When sent, the whole object replaces the stored margins. */
export type OmnisendFormCloseButtonMarginsInput = {
	/** Desktop margins */
	desktop: OmnisendFormCloseButtonMarginValuesInput;
	/** Mobile margins (600px wide and below). When omitted, desktop margins are used */
	mobile?: OmnisendFormCloseButtonMarginValuesInput;
};

/** Column within a row containing content blocks */
export type OmnisendFormColumnInput = {
	/** Content blocks contained in the column */
	blocks: Array<OmnisendFormBlockInput>;
	/** Column unique identifier (read-only) */
	id?: string;
	/** Column style properties */
	styleProperties?: OmnisendFormStylePropertiesInput;
	/** Column width in pixels or percent */
	width: string;
};

/** Form content submitted when creating a form: general settings, steps, and optional success/subscribed/unavailable steps. */
export type OmnisendFormContentInput = {
	/** General presentation settings shared across the form */
	generalSettings: OmnisendFormGeneralSettingsInput;
	/** Form steps, each containing sections */
	steps: Array<OmnisendFormStepInput>;
	/** Step shown when the visitor is already subscribed */
	subscribedStep?: OmnisendFormStepInput;
	/** Step shown on the success page */
	successStep?: OmnisendFormStepInput;
	/** Teaser shown before or after the form */
	teaser?: OmnisendFormTeaserInput;
	/** Step shown when the form is unavailable */
	unavailablePageStep?: OmnisendFormStepInput;
};

/** Form container dimensions and overlay color. */
export type OmnisendFormContentSettingsInput = {
	/** Overlay color behind the form */
	color: string;
	/** Form container width in pixels */
	width: string;
};

/** Countdown timer block configuration. */
export type OmnisendFormCountdownTimerInput = {
	/** Countdown length in seconds, used for personalized timers */
	duration?: number;
	/** Countdown end timestamp (RFC 3339), used for fixed timers */
	endsAt?: string;
	/** Digit mask the timer renders; omitted means DD:HH:MM:SS */
	format?: 'DD:HH:MM:SS' | 'HH:MM:SS' | 'MM:SS';
	/** Countdown mode: fixed ends at a specific date, personalized counts down per visitor */
	type: 'fixed' | 'personalized';
};

/** Country targeting with optional state filtering */
export type OmnisendFormCountryInput = {
	/** ISO 3166-1 alpha-2 country code */
	code: string;
	/** Country name */
	name: string;
	/** States or regions within the country */
	states?: Array<OmnisendFormStateInput>;
};

/** Date input field configuration. */
export type OmnisendFormDateFieldInput = {
	/** Custom contact property the input maps to */
	customProfileField?: string;
	/** Message shown when the entered value is invalid */
	errorMessage: string;
	/** Accepted date input format */
	format: 'YYYY/MM/DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY';
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Contact profile field the input maps to */
	profileField: 'birthdate' | 'custom';
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Device targeting for a form. */
export type OmnisendFormDeviceInput = 'desktop' | 'mobile';

/** Discount block configuration. */
export type OmnisendFormDiscountInput = {
	/** Static discount code awarded to the visitor */
	code?: string;
	/** Confirmation message shown after the visitor copies the code */
	copiedMessage?: string;
	/** Whether a confirmation message is shown after the visitor copies the code */
	copiedMessageEnabled?: boolean;
	/** Discount source. `unique` is accepted only to keep the unique discount already stored on this item (matched by `id`); it cannot attach a new one */
	type?: 'wheelOfFortune' | 'static' | 'game' | 'unique';
};

/** Display trigger configuration controlling when a form appears. */
export type OmnisendFormDisplayInput = {
	/** Scroll depth percentage that triggers the form. Range: 0-100 */
	afterScrollDown?: number;
	/** Seconds elapsed on the page before the form appears */
	afterSeconds?: number;
	/** Number of viewed pages before the form appears */
	afterViewedPageCount?: number;
	/** Custom trigger mode activating the form */
	customTrigger?: 'only';
	/** Whether the form appears on exit intent */
	isExitIntentEnabled?: boolean;
};

/** Double opt-in configuration. */
export type OmnisendFormDoubleOptInInput = {
	/** Confirmation page content */
	confirmationPage?: OmnisendFormDoubleOptInConfirmationPageInput;
	/** Confirmation redirect settings */
	confirmationRedirect?: OmnisendFormDoubleOptInConfirmationRedirectInput;
	/** Confirmation email content */
	email?: OmnisendFormDoubleOptInEmailInput;
	/** Whether double opt-in is enabled */
	isEnabled?: boolean;
};

/** Double opt-in confirmation page content. */
export type OmnisendFormDoubleOptInConfirmationPageInput = {
	/** Text shown while the page auto-redirects */
	autoRedirectText?: string;
	/** Confirmation button label */
	buttonText?: string;
	/** Confirmation page body content */
	content: string;
	/** Whether the page auto-redirects after confirmation */
	isAutoRedirectEnabled?: boolean;
	/** Whether the confirmation button is shown */
	isButtonVisible?: boolean;
	/** Confirmation page title */
	title: string;
	/** URL to redirect to after confirmation */
	url?: string;
};

/** Double opt-in confirmation redirect settings. */
export type OmnisendFormDoubleOptInConfirmationRedirectInput = {
	/** Whether confirmation redirect is enabled */
	isEnabled?: boolean;
	/** URL to redirect to after confirmation */
	url?: string;
};

/** Double opt-in confirmation email content. */
export type OmnisendFormDoubleOptInEmailInput = {
	/** Confirmation button label */
	confirmationButton: string;
	/** Email body content */
	content: string;
	/** Email headline */
	headline: string;
	/** Verified double opt-in sender email */
	sendersEmail?: string;
	/** Sender name shown on the email */
	sendersName: string;
	/** Email subject line */
	subject: string;
};

/** Dropdown selection field configuration. */
export type OmnisendFormDropdownFieldInput = {
	/** Custom contact property the input maps to */
	customProfileField?: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOptionInput>;
	/** Placeholder text shown in the field */
	placeholder?: string;
	/** Contact profile field the input maps to */
	profileField: 'country' | 'gender' | 'custom';
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Email input field configuration. */
export type OmnisendFormEmailFieldInput = {
	/** Message shown when the entered value is invalid */
	errorMessage: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Placeholder text shown in the field */
	placeholder?: string;
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Styling for field labels. */
export type OmnisendFormFieldLabelStylesInput = {
	/** Label color */
	color: string;
	/** Bottom padding in pixels */
	paddingBottom?: string;
	/** Left padding in pixels */
	paddingLeft?: string;
	/** Right padding in pixels */
	paddingRight?: string;
	/** Top padding in pixels */
	paddingTop?: string;
};

/** Selectable option for dropdown, radio, or checkbox fields */
export type OmnisendFormFieldOptionInput = {
	/** Option label shown to the visitor */
	label: string;
	/** Option value submitted with the form */
	value: string;
};

/** Styling for field placeholders. */
export type OmnisendFormFieldPlaceholderStylesInput = {
	/** Placeholder color */
	color: string;
};

/** Styling for the input field itself. */
export type OmnisendFormFieldStyleInput = {
	/** Field background color */
	backgroundColor?: string;
	/** Field border color */
	borderColor: string;
	/** Field border radius in pixels. Range: 0-50 */
	borderRadius: string;
	/** Field border style */
	borderStyle: 'dotted' | 'solid' | 'dashed';
	/** Field border width in pixels */
	borderWidth: string;
	/** Field text color */
	color: string;
	/** Bottom padding in pixels */
	paddingBottom?: string;
	/** Left padding in pixels */
	paddingLeft?: string;
	/** Right padding in pixels */
	paddingRight?: string;
	/** Top padding in pixels */
	paddingTop?: string;
};

/** Styling shared across form input fields. */
export type OmnisendFormFieldStylesInput = {
	/** Validation error text color */
	errorColor: string;
	/** Styling for the input field itself */
	field: OmnisendFormFieldStyleInput;
	/** Field font family */
	fontFamily: string;
	/** Field font size in pixels. Range: 8-96 */
	fontSize: string;
	/** Field font style */
	fontStyle?: 'italic' | 'normal';
	/** Field font weight */
	fontWeight?: 'bold' | 'normal';
	/** Styling for field labels */
	label: OmnisendFormFieldLabelStylesInput;
	/** Styling for field placeholders */
	placeholder: OmnisendFormFieldPlaceholderStylesInput;
	/** Field text alignment */
	textAlign?: 'left' | 'center' | 'right';
	/** Field text decoration */
	textDecoration?: 'underline' | 'none';
};

/** Frequency configuration for repeat form displays. */
export type OmnisendFormFrequencyInput = {
	/** Time unit for the display frequency */
	type?: 'second' | 'minute' | 'hour' | 'day';
	/** Number of time units between repeat displays */
	value?: number;
};

/** Mystery box box */
export type OmnisendFormGameItemInput = {
	/** Alternative text for the box image */
	altText?: string;
	/** Box background color */
	backgroundColor: string;
	/** Box unique identifier (read-only) */
	id?: string;
	/** URL of the image shown on the box, used when type is image */
	imageUrl?: string;
	/** Text shown on the box, used when type is text */
	text?: string;
	/** Box text color */
	textColor?: string;
	/** Box content type */
	type: 'text' | 'image';
};

/** Game item appearance */
export type OmnisendFormGameItemStyleInput = {
	/** Border color */
	borderColor?: string;
	/** Corner radius in pixels. Range: 0-50 */
	borderRadius?: string;
	/** Border line style */
	borderStyle?: 'dotted' | 'solid' | 'dashed';
	/** Border width in pixels. Range: 0-60 */
	borderWidth?: string;
	/** Font family */
	fontFamily?: string;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string;
	/** Item width percentage. Range: 30-100 */
	width?: number;
};

/** Game reward. Exactly one reward is supported. */
export type OmnisendFormGameRewardInput = {
	/** Static discount code awarded to the visitor */
	discountCode?: string;
	/** Discount source; defaults to static when omitted. `unique` is accepted only to keep the unique discount already stored on this item (matched by `id`); it cannot attach a new one */
	discountType?: 'static' | 'unique';
	/** Reward unique identifier (read-only) */
	id?: string;
	/** Reward name. Required for scratch card, where it is revealed under the cover */
	name?: string;
};

/** General presentation settings shared across a form: content, body, link, presets, and field styles. */
export type OmnisendFormGeneralSettingsInput = {
	/** Background image configuration */
	backgroundImage?: OmnisendFormBackgroundImageInput;
	/** Form body presentation */
	body: OmnisendFormBodyInput;
	/** Named button style presets */
	buttonPresets: Array<OmnisendFormButtonPresetInput>;
	/** Close button appearance */
	closeButton?: OmnisendFormCloseButtonInput;
	/** Form container dimensions and overlay color */
	content: OmnisendFormContentSettingsInput;
	/** Styling shared across form input fields */
	fieldStyles: OmnisendFormFieldStylesInput;
	/** Link color settings */
	link: OmnisendFormLinkInput;
	/** Form position on the page */
	position?:
		| 'topLeft'
		| 'topCenter'
		| 'topRight'
		| 'middleLeft'
		| 'middleCenter'
		| 'middleRight'
		| 'bottomLeft'
		| 'bottomCenter'
		| 'bottomRight';
	/** Named text style presets */
	textPresets: Array<OmnisendFormTextPresetInput>;
};

/** Image block configuration. */
export type OmnisendFormImageInput = {
	/** Alternative text for the image */
	altText?: string;
	/** Image height in pixels */
	height?: number;
	/** ID references an existing image in the Images API. */
	id: string;
	/** URL opened when the image is clicked */
	link?: string;
	/** Rendered image width in pixels */
	resizeWidth?: number;
	/** Image width in pixels */
	width?: number;
};

/** Generic profile input field configuration. */
export type OmnisendFormInputFieldInput = {
	/** Custom contact property the input maps to */
	customProfileField?: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Placeholder text shown in the field */
	placeholder?: string;
	/** Contact profile field the input maps to */
	profileField:
		| 'firstName'
		| 'lastName'
		| 'address'
		| 'city'
		| 'state'
		| 'zipCode'
		| 'custom';
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Legal consent block configuration. */
export type OmnisendFormLegalInput = {
	/** Consent description */
	description?: string;
	/** Consent label shown next to the checkbox */
	label?: string;
	/** URL to the privacy policy */
	link?: string;
	/** Message shown when consent is required but not given */
	requiredMessage?: string;
	/** Consent type the block collects */
	type?: 'gdpr' | 'tcpa' | 'emailOpenTracking';
};

/** Line or space block configuration. */
export type OmnisendFormLineSpaceInput = {
	/** Divider border thickness in pixels (1-60) when type is line, or blank space height in pixels (12-240) when type is space */
	height?: number;
	/** Whether the block renders a divider line or blank space */
	type?: 'line' | 'space';
	/** Divider width as a percentage (1-100), only applicable when type is line */
	width?: number;
};

/** Link color settings. */
export type OmnisendFormLinkInput = {
	/** Link color */
	color: string;
};

/** Geographic location targeting. */
export type OmnisendFormLocationTargetingInput = {
	/** Countries the form is hidden in */
	excludes?: Array<OmnisendFormCountryInput>;
	/** Countries the form is shown in */
	includes?: Array<OmnisendFormCountryInput>;
};

/** Mystery box game: the visitor picks one of three boxes and always wins the reward. */
export type OmnisendFormMysteryBoxInput = {
	/** Box appearance */
	boxStyle?: OmnisendFormGameItemStyleInput;
	/** The three boxes shown to the visitor */
	boxes: Array<OmnisendFormGameItemInput>;
	/** Rewards. Exactly one reward is supported */
	rewards: Array<OmnisendFormGameRewardInput>;
};

/** Country restrictions for the phone number field. Empty or omitted means any supported country is allowed. */
export type OmnisendFormPhoneNumberCountryCodesInput = {
	/** These ISO 3166-1 alpha-2 country codes are not selectable */
	excludes?: Array<string>;
	/** Only these ISO 3166-1 alpha-2 country codes are selectable */
	includes?: Array<string>;
};

/** Phone number input field configuration. */
export type OmnisendFormPhoneNumberFieldInput = {
	/** Restricts which countries' dial codes are selectable */
	countryCodes?: OmnisendFormPhoneNumberCountryCodesInput;
	/** Default ISO 3166-1 alpha-2 country code */
	defaultCountryCode?: string;
	/** Message shown when the entered value is invalid */
	errorMessage: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Placeholder text shown in the field */
	placeholder?: string;
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** Radio selection field configuration. */
export type OmnisendFormRadioFieldInput = {
	/** Custom contact property the input maps to */
	customProfileField?: string;
	/** Whether the field is required */
	isRequired?: boolean;
	/** Field label */
	label?: string;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOptionInput>;
	/** Contact profile field the input maps to */
	profileField: 'gender' | 'custom';
	/** Message shown when the required field is left empty */
	requiredMessage?: string;
};

/** reCAPTCHA protection settings. */
export type OmnisendFormRecaptchaSettingsInput = {
	/** Whether reCAPTCHA protection is enabled */
	isEnabled?: boolean;
};

/** Responsive teaser margins. */
export type OmnisendFormResponsiveTeaserStyleInput = {
	/** Bottom margin in pixels */
	marginBottom?: string;
	/** Left margin in pixels */
	marginLeft?: string;
	/** Right margin in pixels */
	marginRight?: string;
	/** Top margin in pixels */
	marginTop?: string;
};

/** Row within a section containing up to four columns */
export type OmnisendFormRowInput = {
	/** Columns contained in the row */
	columns: Array<OmnisendFormColumnInput>;
	/** Row unique identifier (read-only) */
	id?: string;
	/** Row style properties */
	styleProperties?: OmnisendFormStylePropertiesInput;
};

/** Scheduling window during which a form is active. */
export type OmnisendFormSchedulingInput = {
	/** Scheduling window end timestamp (RFC 3339). Must be later than startsAt. */
	endsAt?: string;
	/** Scheduling window start timestamp (RFC 3339) */
	startsAt?: string;
};

/** Scratch card game: the visitor scratches the cover to reveal the reward name. */
export type OmnisendFormScratchCardInput = {
	/** Scratch brush size. Range: 5-80 */
	brushSize?: number;
	/** Card appearance */
	cardStyle?: OmnisendFormScratchCardStyleInput;
	/** Cover image the visitor scratches off */
	cover: OmnisendFormScratchCoverInput;
	/** Reward area background color under the cover */
	prizeBackgroundColor: string;
	/** Reward name text color under the cover */
	prizeTextColor: string;
	/** Percentage of the cover scratched before the reward is fully revealed. Range: 10-90 */
	revealThreshold?: number;
	/** Rewards. Exactly one reward is supported */
	rewards: Array<OmnisendFormGameRewardInput>;
};

/** Scratch card appearance */
export type OmnisendFormScratchCardStyleInput = {
	/** Border color */
	borderColor?: string;
	/** Corner radius in pixels. Range: 0-50 */
	borderRadius?: string;
	/** Border width in pixels. Range: 0-60 */
	borderWidth?: string;
	/** Font family */
	fontFamily?: string;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string;
	/** Card width percentage. Range: 30-100 */
	width?: number;
};

/** Scratch card cover image */
export type OmnisendFormScratchCoverInput = {
	/** Alternative text for the cover image */
	altText?: string;
	/** Cover background color */
	backgroundColor?: string;
	/** Cover unique identifier (read-only) */
	id?: string;
	/** URL of the cover image */
	imageUrl: string;
};

/** Form step section containing rows */
export type OmnisendFormSectionInput = {
	/** Section background image */
	backgroundImage?: OmnisendFormSectionBackgroundImageInput;
	/** Section unique identifier (read-only) */
	id?: string;
	/** Rows contained in the section */
	rows: Array<OmnisendFormRowInput>;
	/** Section style properties */
	styleProperties?: OmnisendFormStylePropertiesInput;
};

/** Section background image configuration. */
export type OmnisendFormSectionBackgroundImageInput = {
	/** Background image fit: cover (fill), contain (fit) or repeat (tile) */
	fit: 'cover' | 'contain' | 'repeat';
	/** ID references an existing image in the Images API. */
	id: string;
};

/** Segment membership targeting. */
export type OmnisendFormSegmentsInput = {
	/** Segment identifiers the form is hidden for */
	excludes?: Array<string>;
	/** Segment identifiers the form is shown for */
	includes?: Array<string>;
};

/** Social media sharing metadata. */
export type OmnisendFormSocialMediaSharingInput = {
	/** Shared preview description */
	description: string;
	/** ImageID references an existing image in the Images API. */
	imageID?: string;
	/** Shared preview title */
	title: string;
};

/** Traffic-source targeting rules. */
export type OmnisendFormSourceTargetingInput = {
	/** Traffic sources the form is hidden for */
	excludes?: Array<OmnisendFormSourceTypeInput>;
	/** Traffic sources the form is shown for */
	includes?: Array<OmnisendFormSourceTypeInput>;
};

/** Traffic source for form targeting rules. */
export type OmnisendFormSourceTypeInput =
	| 'googleAds'
	| 'organic'
	| 'direct'
	| 'facebook'
	| 'instagram'
	| 'omnisendCommunication';

/** State or region within a country */
export type OmnisendFormStateInput = {
	/** State or region code */
	code: string;
	/** State or region name */
	name: string;
};

/** A step of a form submitted when creating a form. */
export type OmnisendFormStepInput = {
	/** Sections contained in the step */
	sections: Array<OmnisendFormSectionInput>;
};

/** Style properties shared by sections, rows, columns and blocks. */
export type OmnisendFormStylePropertiesInput = {
	/** Horizontal alignment */
	alignment?: 'left' | 'center' | 'right';
	/** Background color */
	backgroundColor?: string;
	/** CSS border shorthand */
	border?: string;
	/** Border radius in pixels */
	borderRadius?: string;
	/** Primary color */
	color?: string;
	/** Divider color */
	dividerColor?: string;
	/** Font family */
	fontFamily?: string;
	/** Font size in pixels. Range: 8-96, except legal blocks which allow a minimum of 4 */
	fontSize?: string;
	/** Line height */
	lineHeight?: string;
	/** Opacity. Range: 0-1 */
	opacity?: number;
	/** Bottom padding in pixels */
	paddingBottom?: string;
	/** Left padding in pixels */
	paddingLeft?: string;
	/** Right padding in pixels */
	paddingRight?: string;
	/** Top padding in pixels */
	paddingTop?: string;
	/** Secondary color */
	secondaryColor?: string;
	/** Vertical alignment */
	verticalAlign?: 'top' | 'middle' | 'bottom';
};

/** Targeting rules controlling when and to whom a form is shown. */
export type OmnisendFormTargetingInput = {
	/** Subscriber audience targeting */
	audience?: OmnisendFormAudienceInput;
	/** Shopping cart threshold targeting. Only available for Shopify stores */
	cart?: OmnisendFormCartTargetingInput;
	/** Device the form is limited to */
	device?: OmnisendFormDeviceInput;
	/** Display trigger configuration */
	display?: OmnisendFormDisplayInput;
	/** Repeat-display frequency configuration */
	frequency?: OmnisendFormFrequencyInput;
	/** Whether targeting is limited to back-in-stock visitors */
	isBackInStock?: boolean;
	/** Shows the form one extra time when the visitor is most engaged. Shown in the form builder as "Personalized triggers". Works on popup, flyout and fullscreen forms; ignored on other display types, back-in-stock forms and forms shown only by a custom trigger. Requires Forms Plus (included in the… */
	isPersonalisedTargeting?: boolean;
	/** Geographic location targeting */
	location?: OmnisendFormLocationTargetingInput;
	/** Active scheduling window */
	scheduling?: OmnisendFormSchedulingInput;
	/** Segment membership targeting */
	segments?: OmnisendFormSegmentsInput;
	/** Traffic-source targeting */
	source?: OmnisendFormSourceTargetingInput;
	/** Page URL targeting rules */
	url?: OmnisendFormURLTargetingInput;
	/** UTM parameter targeting */
	utm?: OmnisendFormUTMTargetingInput;
};

/** Teaser shown before or after the form. */
export type OmnisendFormTeaserInput = {
	/** Teaser close button settings */
	closeButton?: OmnisendFormTeaserCloseButtonInput;
	/** Whether the teaser is enabled */
	isEnabled?: boolean;
	/** Teaser position on the page */
	position:
		| 'topLeft'
		| 'topCenter'
		| 'topRight'
		| 'middleLeft'
		| 'middleRight'
		| 'bottomLeft'
		| 'bottomCenter'
		| 'bottomRight';
	/** Teaser styling */
	styleProperties?: OmnisendFormTeaserStylePropertiesInput;
	/** Teaser text */
	text: string;
	/** When the teaser is shown relative to the form */
	visibility: 'before' | 'after' | 'always';
};

/** Teaser close button settings. */
export type OmnisendFormTeaserCloseButtonInput = {
	/** Whether the teaser close button is shown */
	isEnabled?: boolean;
};

/** Teaser styling. */
export type OmnisendFormTeaserStylePropertiesInput = {
	/** Background color */
	backgroundColor?: string;
	/** CSS border shorthand */
	border?: string;
	/** Border radius in pixels. Range: 0-50 */
	borderRadius?: string;
	/** Text color */
	color?: string;
	/** Teaser styling on desktop */
	desktopStyle: OmnisendFormResponsiveTeaserStyleInput;
	/** Font family */
	fontFamily?: string;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string;
	/** Font style */
	fontStyle?: 'italic' | 'normal';
	/** Font weight */
	fontWeight?: 'bold' | 'normal';
	/** Teaser styling on mobile */
	mobileStyle: OmnisendFormResponsiveTeaserStyleInput;
	/** Bottom padding in pixels */
	paddingBottom?: string;
	/** Left padding in pixels */
	paddingLeft?: string;
	/** Right padding in pixels */
	paddingRight?: string;
	/** Top padding in pixels */
	paddingTop?: string;
	/** Teaser shape */
	shape: 'rectangle' | 'circle' | 'triangle';
	/** Text decoration */
	textDecoration?: 'underline' | 'none';
};

/** Named text style preset */
export type OmnisendFormTextPresetInput = {
	/** Preset identifier */
	id:
		| 'heading_large'
		| 'heading_medium'
		| 'heading_small'
		| 'paragraph'
		| 'footnote';
	/** Preset name */
	name?: string;
	/** Styling applied to the preset */
	styles: OmnisendFormTextStyleInput;
};

/** Styling applied to a text preset. */
export type OmnisendFormTextStyleInput = {
	/** Text color */
	color: string;
	/** Text font family */
	fontFamily: string;
	/** Text font size in pixels. Range: 8-96 */
	fontSize: string;
	/** Text line height */
	lineHeight: '100%' | '115%' | '125%' | '150%' | '200%';
};

/** URL targeting rule */
export type OmnisendFormURLTargetInput = {
	/** Match mode for the URL rule */
	type: 'exact' | 'contains';
	/** URL or URL fragment to match */
	value: string;
};

/** URL targeting rules. */
export type OmnisendFormURLTargetingInput = {
	/** URLs the form is hidden on */
	excludes?: Array<OmnisendFormURLTargetInput>;
	/** URLs the form is shown on */
	includes?: Array<OmnisendFormURLTargetInput>;
};

/** UTM targeting rule */
export type OmnisendFormUTMTargetInput = {
	/** UTM parameter the rule matches */
	type: 'id' | 'source' | 'medium' | 'campaign' | 'term' | 'content';
	/** UTM value to match */
	value: string;
};

/** UTM parameter targeting. */
export type OmnisendFormUTMTargetingInput = {
	/** UTM rules the form is shown for */
	includes?: Array<OmnisendFormUTMTargetInput>;
};

/** Wheel-of-fortune block configuration submitted when creating a form. */
export type OmnisendFormWheelOfFortuneInput = {
	/** Font family of all slice texts. Must be one of the available system, web or brand fonts. When omitted the wheel uses the default font */
	fontFamily?: string;
	/** Font size of all slice texts, in px for a full-width wheel. Range: 8px-96px. When omitted the wheel uses 15px */
	fontSize?: string;
	/** Wheel pointer color */
	pointerColor: string;
	/** Wheel slices */
	slices: Array<OmnisendFormWheelOfFortuneSliceInput>;
	/** Wheel spin duration in seconds. Range: 1-30. When omitted the field stays unset and the wheel spins for 6 seconds */
	speed?: number;
	/** Wheel width percentage. Range: 30-100 */
	width?: number;
};

/** Wheel-of-fortune slice with server-generated identifier */
export type OmnisendFormWheelOfFortuneSliceInput = {
	/** Alternative text for the slice image */
	altText?: string;
	/** Slice background color */
	backgroundColor: string;
	/** Discount code awarded for the slice */
	discountCode?: string;
	/** Discount source for the slice. `unique` is accepted only to keep the unique discount already stored on this item (matched by `id`); it cannot attach a new one */
	discountType?: 'static' | 'unique';
	/** Slice unique identifier (read-only) */
	id?: string;
	/** URL to the slice image */
	imageUrl?: string;
	/** Whether the slice is a losing slice */
	isLosing?: boolean;
	/** Win probability percentage for the slice. Range: 0-100 */
	probability?: number;
	/** Slice label text */
	text?: string;
	/** Slice text color */
	textColor?: string;
	/** Slice content type. Defaults to text when omitted */
	type?: 'text' | 'image';
};

/** Frequency interval duration. Per-unit caps: 8760 hours, 365 days, 52 weeks. */
export type OmnisendFrequencyIntervalDurationRequestInput = {
	/** Number of time units. Must be at least 1 and within the per-unit cap. */
	amount: number;
	/** Time unit */
	units: 'h' | 'd' | 'w';
};

/** Frequency limiter — restricts how often the same contact can re-enter the automation. Provide an object to enable; omit or send `null` to disable. The `mode` field determines the limiting behavior: - "once": the contact can enter the automation only once per lifetime - "interval": requires… */
export type OmnisendFrequencyLimiterRequestInput = {
	/** Minimum interval before the contact can re-enter — required when mode is "interval" and forbidden when mode is "once". */
	duration?: OmnisendFrequencyIntervalDurationRequestInput;
	/** Frequency limiter mode */
	mode: 'once' | 'interval';
};

/** General settings for the template */
export type OmnisendGeneralSettingsInput = {
	/** Body settings */
	body: OmnisendBodyInput;
	/** Button presets */
	buttonPresets?: Array<OmnisendButtonPresetInput>;
	/** Content settings */
	content: OmnisendContentSettingsInput;
	/** Gmail settings */
	gmail?: OmnisendGmailInput;
	/** Logo settings */
	logo?: OmnisendLogoSettingsInput;
	/** Text presets */
	textPresets?: Array<OmnisendTextPresetInput>;
};

/** Gmail specific settings for email. */
export type OmnisendGmailInput = {
	/** Gmail annotation settings */
	annotation?: OmnisendAnnotationInput;
};

/** HTML code block with separate style and body content */
export type OmnisendHTMLCodeInput = {
	/** HTML body content that will be embedded in the email. */
	body?: string;
	/** CSS styles for the HTML content that will be embedded in the HTML header. */
	style?: string;
};

/** Social media icon with link and image source */
export type OmnisendIconInput = {
	/** Link to the social media profile or contact method */
	link?: string;
	/** Source path for the social media icon image */
	source?: string;
	/** Type of the social media platform */
	type?: string;
};

/** Image block for displaying images in the email */
export type OmnisendImageInput = {
	/** Image alt source - used as a fallback image if the original image fails to load */
	altSource?: string;
	/** Image alt text for accessibility */
	altText?: string;
	/** Image original height */
	height?: number;
	/** Image ID retrieved from Image API */
	id?: string;
	/** Whether the image is dynamic - used to identify whether the image is dynamically generated */
	isDynamic?: boolean;
	/** Whether the image is an external source - used to identify whether the image has an external source */
	isExternalSource?: boolean;
	/** Image destination path - where the image will redirect on click */
	link?: string;
	/** Image max height in pixels - absolute pixel height constraint for dynamic images (0-1000) */
	maxHeight?: number;
	/** Image max height percentage - used to identify the maximum height of the image as a percentage of the container */
	maxHeightPercentage?: number;
	/** Image name displayed in the email */
	name?: string;
	/** Resized image height - used when the image is resized to a different width or height than the original */
	resizeHeight?: number;
	/** Resized image width - used when the image is resized to a different width than the original */
	resizeWidth?: number;
	/** Image size in bytes */
	size?: number;
	/** Image source URL. */
	source?: string;
	/** Image state - used to identify the state of the image */
	state?: string;
	/** Image type (image/jpg, image/jpeg, image/png, image/gif) */
	type?: string;
	/** Image original width */
	width?: number;
};

/** Inactivity settings — fires the workflow only after the contact has gone quiet (no new triggering events) for the given duration. Each new triggering event resets the timer. Use this for abandoned-flow patterns where you want to wait for the contact to *not* complete the next step. Common… */
export type OmnisendInactivitySettingsRequestInput = {
	/** Inactivity period. Required when inactivitySettings is provided. */
	duration: OmnisendDurationRequestInput;
};

/** Action block configuration for full replacement. Exactly one action-specific field must be populated based on the type discriminator. The action-specific configuration **must** be nested under a key matching the `type` value. For example, when `type` is `"sendPush"`, the push fields go inside… */
export type OmnisendInputActionRequestInput = {
	/** Add tag action configuration */
	addTag?: OmnisendInputTagActionInput;
	/** Remove tag action configuration */
	removeTag?: OmnisendInputTagActionInput;
	/** Send email action configuration */
	sendEmail?: OmnisendInputSendEmailInput;
	/** Send push notification action configuration. The PUT shape matches POST — re-send the full block. */
	sendPush?: OmnisendSendPushRequestInput;
	/** Send SMS action configuration. The PUT shape matches POST — re-send the full block. */
	sendSms?: OmnisendSendSmsRequestInput;
	/** Send webhook action configuration. The PUT shape matches POST — re-send the full block. */
	sendWebhook?: OmnisendSendWebhookRequestInput;
	/** Action type discriminator */
	type:
		| 'sendEmail'
		| 'sendPush'
		| 'sendSms'
		| 'sendWebhook'
		| 'addTag'
		| 'removeTag'
		| 'unsubscribe';
	/** Unsubscribe action configuration */
	unsubscribe?: OmnisendUnsubscribeActionInput;
};

/** Send email action configuration for PUT (full replacement). For new blocks (identified by temporaryID): templateID is required. For existing blocks (identified by id): templateID must not be provided. `templateID` references an Email Template entity documented in the [Email Templates… */
export type OmnisendInputSendEmailInput = {
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. When true (default), the contact bypasses this block and continues to the next block in the workflow. When false, the workflow is canceled for this contact. */
	isSkipAllowed?: boolean;
	/** Email language locale in xx_XX format. Must be a supported language */
	language: string;
	/** Email preheader text displayed after the subject line in the recipient's inbox. Supports personalization tags. */
	preheader: string;
	/** Reply-to email address for recipient responses. Must be a verified email */
	replyToEmail?: string;
	/** Sender email address shown in the recipient's inbox. Omit to use the brand's default automation sender, the same one the automation editor prefills. Required only when the brand has no default sender; it must then be an address verified for the brand's sending domain */
	senderEmail?: string;
	/** Sender display name shown in the recipient's inbox */
	senderName: string;
	/** Email subject line displayed in the recipient's inbox. Supports personalization tags, e.g. [[contact.first_name]] */
	subject: string;
	/** Email template unique identifier. Required for new blocks (temporaryID) — automation email content is created from this template. Not allowed for existing blocks (id). To update an existing block, omit this field. To create a new block, use temporaryID instead of id. See [Email Templates… */
	templateID?: string;
};

/** Tag action configuration. */
export type OmnisendInputTagActionInput = {
	/** Tag value. Case-insensitive — normalized to lowercase before persistence. */
	value: string;
};

/** Horizontal line or space block for layout separation */
export type OmnisendLineSpaceInput = {
	/** Height of the line or space element in pixels */
	height?: number;
	/** type of line or space element */
	type?: string;
	/** Width of the line or space element in pixels */
	width?: number;
};

/** Logo block for displaying a logo in the email */
export type OmnisendLogoInput = {
	/** Link where the logo will redirect on click */
	link?: string;
	/** Resized width of the logo in pixels */
	resizeWidth?: number;
};

/** Logo settings for the template */
export type OmnisendLogoSettingsInput = {
	/** Logo alt text - alternative text for the logo for accessibility */
	altText?: string;
	/** Logo height in pixels */
	height?: number;
	/** Logo unique identifier */
	id?: string;
	/** Logo custom - whether the logo is a custom uploaded logo */
	isCustom?: boolean;
	/** Logo name */
	name?: string;
	/** Logo size - in bytes, up to 5MB */
	size?: number;
	/** Logo source - image URL (max 2083 characters) or personalisation tag */
	source?: string;
	/** Logo type - one of: image/jpg, image/jpeg, image/png, image/gif */
	type?: 'image/jpg' | 'image/jpeg' | 'image/png' | 'image/gif';
	/** Logo width in pixels - required when height is set */
	width?: number;
};

/** Postal address for billing or shipping */
export type OmnisendOrderAddressInput = {
	/** Primary address line */
	address1?: string;
	/** Secondary address line */
	address2?: string;
	/** City name */
	city?: string;
	/** Company name */
	company?: string;
	/** Country name */
	country?: string;
	/** ISO country code */
	countryCode?: string;
	/** First name */
	firstName?: string;
	/** Last name */
	lastName?: string;
	/** Phone number */
	phone?: string;
	/** State or province name */
	state?: string;
	/** State or province code */
	stateCode?: string;
	/** Postal code */
	zip?: string;
};

/** Visibility toggles for individual address fields */
export type OmnisendOrderAddressHiddenFieldsInput = {
	/** Whether the address line 1 is hidden */
	isAddress1Hidden?: boolean;
	/** Whether the address line 2 is hidden */
	isAddress2Hidden?: boolean;
	/** Whether the city is hidden */
	isCityHidden?: boolean;
	/** Whether the company is hidden */
	isCompanyHidden?: boolean;
	/** Whether the country is hidden */
	isCountryHidden?: boolean;
	/** Whether the name and surname are hidden */
	isNameSurnameHidden?: boolean;
	/** Whether the phone is hidden */
	isPhoneHidden?: boolean;
	/** Whether the state is hidden */
	isStateHidden?: boolean;
	/** Whether the zip code is hidden */
	isZipCodeHidden?: boolean;
};

/** Order addresses block displaying billing and shipping information */
export type OmnisendOrderAddressesInput = {
	/** Billing address */
	billing?: OmnisendOrderAddressInput;
	/** Fields to hide in the addresses block */
	hiddenFields?: OmnisendOrderAddressesHiddenFieldsInput;
	/** Shipping address */
	shipping?: OmnisendOrderAddressInput;
	/** Shipping methods used for the order */
	shippingMethods?: Array<OmnisendOrderShippingInput>;
	/** Section title */
	title?: string;
	/** Payment transactions for the order */
	transactions?: Array<OmnisendOrderTransactionInput>;
};

/** Visibility toggles for the order addresses section */
export type OmnisendOrderAddressesHiddenFieldsInput = {
	/** Billing address hidden fields */
	billing?: OmnisendOrderAddressHiddenFieldsInput;
	/** Whether the section title is hidden */
	isTitleHidden?: boolean;
	/** Shipping address hidden fields */
	shipping?: OmnisendOrderAddressHiddenFieldsInput;
};

/** Individual product within an order */
export type OmnisendOrderProductInput = {
	/** Price currency code */
	currency?: string;
	/** Discount amount applied */
	discountAmount?: string;
	/** Product image */
	image?: OmnisendImageInput;
	/** Product price */
	price?: string;
	/** Price after discount */
	priceWithDiscount?: string;
	/** Product identifier */
	productID?: string;
	/** Product page URL */
	productUrl?: string;
	/** Ordered quantity */
	quantity?: number;
	/** Stock keeping unit code */
	sku?: string;
	/** Product name */
	title?: string;
	/** Selected product variant */
	variant?: string;
	/** Product vendor name */
	vendor?: string;
	/** Product weight */
	weight?: number;
};

/** Order products block displaying ordered items */
export type OmnisendOrderProductsInput = {
	/** Fields to hide in the order products display */
	hiddenFields?: OmnisendOrderProductsHiddenFieldsInput;
	/** List of ordered products. Placeholder data — actual products are injected at render time. */
	products?: Array<OmnisendOrderProductInput>;
};

/** Visibility toggles for order product fields */
export type OmnisendOrderProductsHiddenFieldsInput = {
	/** Whether the discount amount is hidden */
	isDiscountAmountHidden?: boolean;
	/** Whether the image is hidden */
	isImageHidden?: boolean;
	/** Whether the price is hidden */
	isPriceHidden?: boolean;
	/** Whether the price with discount is hidden */
	isPriceWithDiscountHidden?: boolean;
	/** Whether the product ID is hidden */
	isProductIDHidden?: boolean;
	/** Whether the quantity is hidden */
	isQuantityHidden?: boolean;
	/** Whether the SKU is hidden */
	isSkuHidden?: boolean;
	/** Whether the title is hidden */
	isTitleHidden?: boolean;
	/** Whether the variant is hidden */
	isVariantHidden?: boolean;
	/** Whether the vendor is hidden */
	isVendorHidden?: boolean;
	/** Whether the weight is hidden */
	isWeightHidden?: boolean;
};

/** Shipping method details */
export type OmnisendOrderShippingInput = {
	/** Shipping price */
	price?: string;
	/** Shipping method name */
	title?: string;
};

/** Order summary block displaying order identification details */
export type OmnisendOrderSummaryInput = {
	/** Order date */
	date?: string;
	/** Date display format */
	dateFormat?: string;
	/** Fields to hide in the order summary */
	hiddenFields?: OmnisendOrderSummaryHiddenFieldsInput;
	/** Order identifier */
	orderID?: string;
	/** Summary section title */
	title?: string;
};

/** Visibility toggles for order summary fields */
export type OmnisendOrderSummaryHiddenFieldsInput = {
	/** Whether the date is hidden */
	isDateHidden?: boolean;
	/** Whether the order ID is hidden */
	isOrderIDHidden?: boolean;
	/** Whether the title is hidden */
	isTitleHidden?: boolean;
};

/** Tax line item applied to the order */
export type OmnisendOrderTaxInput = {
	/** Tax amount */
	price?: string;
	/** Tax rate */
	rate?: string;
	/** Tax name */
	title?: string;
};

/** Order total block displaying pricing breakdown */
export type OmnisendOrderTotalInput = {
	/** Currency code */
	currency?: string;
	/** Total discount amount */
	discountTotal?: string;
	/** Applied discount details */
	discounts?: Array<OmnisendOrderTotalDiscountInput>;
	/** Fields to hide in the order total */
	hiddenFields?: OmnisendOrderTotalHiddenFieldsInput;
	/** Whether the subtotal includes tax */
	isSubTotalTaxIncluded?: boolean;
	/** Final order total */
	orderTotal?: string;
	/** Shipping price */
	shippingPrice?: string;
	/** Subtotal amount before tax and shipping */
	subTotal?: string;
	/** Total tax amount */
	taxTotal?: string;
	/** Applied tax details */
	taxes?: Array<OmnisendOrderTaxInput>;
};

/** Discount applied to the order total */
export type OmnisendOrderTotalDiscountInput = {
	/** Discount amount */
	amount?: string;
	/** Discount code */
	code?: string;
	/** Discount type */
	type?: string;
};

/** Visibility toggles for order total fields */
export type OmnisendOrderTotalHiddenFieldsInput = {
	/** Whether the discount total is hidden */
	isDiscountTotalHidden?: boolean;
	/** Whether the order total is hidden */
	isOrderTotalHidden?: boolean;
	/** Whether the shipping price is hidden */
	isShippingPriceHidden?: boolean;
	/** Whether the subtotal is hidden */
	isSubTotalHidden?: boolean;
	/** Whether the tax total is hidden */
	isTaxTotalHidden?: boolean;
};

/** Payment transaction details */
export type OmnisendOrderTransactionInput = {
	/** Payment method used */
	payment?: string;
};

/** Overlap limiter — prevents enrolling a contact who is already in (or recently completed) one of the listed automations. The `mode` field selects the check: - "currentlyIn": skip the contact if they are currently active in any of the listed automations. `withinDays` must be omitted. -… */
export type OmnisendOverlapLimiterRequestInput = {
	/** Automation IDs to check for overlap. Must be non-empty when an OverlapLimiter object is provided. */
	automationIDs: Array<string>;
	/** Overlap check mode */
	mode: 'currentlyIn' | 'recentlyIn';
	/** Number of days to check — required when mode is "recentlyIn", forbidden when mode is "currentlyIn". */
	withinDays?: number;
};

/** A/B test block configuration for PATCH — only aBlocksPercentage is patchable. Branches (aBlocks, bBlocks) cannot be changed via PATCH. Use PUT /automations/{id}/blocks to restructure branches. */
export type OmnisendPatchABTestingRequestInput = {
	/** Percentage of contacts routed to branch A. Branch B receives the remainder. */
	aBlocksPercentage: number;
};

/** Action block configuration for partial update. Only the fields explicitly provided are updated. */
export type OmnisendPatchActionRequestInput = {
	/** Add tag action configuration */
	addTag?: OmnisendInputTagActionInput;
	/** Remove tag action configuration */
	removeTag?: OmnisendInputTagActionInput;
	/** Send email action configuration. Only provided fields are updated. */
	sendEmail?: OmnisendPatchSendEmailRequestInput;
	/** Send push action configuration. Only provided fields are updated. */
	sendPush?: OmnisendPatchSendPushRequestInput;
	/** Send SMS action configuration. Only provided fields are updated. */
	sendSms?: OmnisendPatchSendSmsRequestInput;
	/** Send webhook action configuration. Only provided fields are updated. */
	sendWebhook?: OmnisendPatchSendWebhookRequestInput;
	/** Action type discriminator. Required — asserts the stored action type; cannot be changed via PATCH. */
	type:
		| 'sendEmail'
		| 'sendPush'
		| 'sendSms'
		| 'sendWebhook'
		| 'addTag'
		| 'removeTag'
		| 'unsubscribe';
	/** Unsubscribe action configuration */
	unsubscribe?: OmnisendUnsubscribeActionInput;
};

/** Automation workflow block for PATCH — updates an existing block only. id is required to identify the target block. action.sendEmail is patched field-by-field (omitted fields unchanged). delay is replaced as a whole object — re-send the complete delay spec when changing any field.… */
export type OmnisendPatchBlockRequestInput = {
	/** A/B test block configuration. Only aBlocksPercentage is patchable. Branches are not changed via PATCH. */
	abTesting?: OmnisendPatchABTestingRequestInput;
	/** Action block configuration. Only provided fields are updated. */
	action?: OmnisendPatchActionRequestInput;
	/** Delay block configuration. Replaced in full when provided. */
	delay?: OmnisendUpdateDelayRequestInput;
	/** Server-assigned block ID. Required — identifies the target block to update. */
	id: string;
	/** Split block filterGroup. Replaced in full when provided. Branches are not changed via PATCH. */
	split?: OmnisendPatchSplitRequestInput;
	/** Block type discriminator. Required — asserts the stored block's type; cannot be changed via PATCH. */
	type: 'delay' | 'action' | 'split' | 'abTesting';
};

/** Send email action configuration for partial update. All fields are optional — only the fields explicitly provided are updated. `replyToEmail` accepts `null` or `""` to clear the existing value. */
export type OmnisendPatchSendEmailRequestInput = {
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. */
	isSkipAllowed?: boolean;
	/** Email language locale in xx_XX format. Must be a supported language. */
	language?: string;
	/** Email preheader text displayed after the subject line. Supports personalization tags. */
	preheader?: string;
	/** Reply-to email address. Must be a verified email. Send `null` or an empty string to clear the reply-to address. */
	replyToEmail?: string;
	/** Sender email address. Must be an address verified for the brand's sending domain. When the email block has no sender, the brand's default automation sender is used */
	senderEmail?: string;
	/** Sender display name shown in the recipient's inbox */
	senderName?: string;
	/** Email subject line. Supports personalization tags, e.g. [[contact.first_name]] */
	subject?: string;
};

/** Send push notification action configuration for partial update. All fields are optional — only the fields explicitly provided are updated. `iconID` and `imageID` accept `null` or `""` to clear the existing value. */
export type OmnisendPatchSendPushRequestInput = {
	/** Push notification body. Supports personalization tags. */
	body?: string;
	/** Click-through URL the recipient is taken to when tapping the notification. */
	clickUrl?: string;
	/** Optional icon image ID obtained from the Images API. Send `null` or an empty string to remove the existing icon. */
	iconID?: string;
	/** Optional image ID displayed below the push notification body. Send `null` or an empty string to remove the existing image. */
	imageID?: string;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. When true (default), the contact bypasses this block and continues to the next block in the workflow. When false, the workflow is canceled for this contact. */
	isSkipAllowed?: boolean;
	/** Push notification title. Supports personalization tags, e.g. [[contact.first_name]] */
	title?: string;
};

/** SMS action configuration for partial update. All fields are optional — only the fields explicitly provided are updated. `imageID` accepts `null` or `""` to remove the existing MMS image. `compliance` does not accept `null` — provide an object or omit the field. */
export type OmnisendPatchSendSmsRequestInput = {
	/** Compliance settings. When provided, all four fields are replaced atomically. Cannot be `null` — omit the field to leave compliance unchanged. */
	compliance?: OmnisendUpdateSmsComplianceInput;
	/** MMS image ID. Send `null` or an empty string to remove the existing image. */
	imageID?: string;
	/** Whether link shortening is enabled. */
	isLinkShorteningEnabled?: boolean;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. */
	isSkipAllowed?: boolean;
	/** SMS message body. Supports personalization tags, e.g. [[contact.first_name]] */
	message?: string;
};

/** Send webhook action configuration for partial update. All fields are optional — only the fields explicitly provided are updated. Send `null` or an empty array (`[]`) to clear all headers; omit `headers` to leave them unchanged. */
export type OmnisendPatchSendWebhookRequestInput = {
	/** Request body template (JSON). Supports personalization tags, e.g. [[contact.email]] */
	body?: string;
	/** Destination URL that receives the HTTP POST request. Must be HTTPS. */
	callbackUrl?: string;
	/** Custom HTTP headers sent with the webhook request. Replaced atomically when provided; send `null` or `[]` to clear. */
	headers?: Array<OmnisendWebhookHeaderInput>;
};

/** Automation settings patch. Each sub-field follows partial-update semantics: omit to leave unchanged, send a value to replace. `sendingThresholds` does not accept `null` — sending `null` returns `400`. `frequencyLimiter` accepts `null` to clear (disable) the existing limiter. `overlapLimiter`… */
export type OmnisendPatchSettingsRequestInput = {
	/** Frequency limiter. Send `null` to clear the existing limiter; provide an object to replace it. Omit to leave the current configuration unchanged. */
	frequencyLimiter?: OmnisendFrequencyLimiterRequestInput;
	/** Overlap limiter. When provided, replaces the existing limiter in full. Send `null` to clear the limiter entirely. */
	overlapLimiter?: OmnisendOverlapLimiterRequestInput;
	/** Sending thresholds. When provided, replaces the existing thresholds in full. */
	sendingThresholds?: OmnisendSendingThresholdsRequestInput;
};

/** Split block configuration for PATCH — only the filterGroup is replaced. Branches (trueBlocks, falseBlocks) cannot be changed via PATCH. Use PUT /automations/{id}/blocks to restructure branches. */
export type OmnisendPatchSplitRequestInput = {
	/** Filter group evaluated when contacts reach this block. At least one filter is required. */
	filterGroup: OmnisendSplitFilterGroupRequestInput;
};

/** Trigger condition for PATCH. When sent, the entire trigger condition (event, origin, and filter groups) is replaced in full — partial updates of individual condition fields are not supported. Omit `condition` to leave the existing trigger condition unchanged. Use the [event metadata… */
export type OmnisendPatchTriggerConditionInput = {
	/** Event system name that triggers the automation workflow (e.g. "placed order", "started checkout"). See the parent struct description for available built-in trigger events. */
	event: string;
	/** Event filter groups — multiple groups are combined with AND logic. */
	filterGroups?: Array<OmnisendEventFilterGroupRequestInput>;
	/** Integration platform that generated the event (e.g. "shopify", "omnisend", "api"). When the event supports multiple origins, this field is required and must match one of them. When the event has a single origin, this field can be omitted — the origin is selected automatically. Omit for built-in… */
	origin?: string;
};

/** Trigger configuration for PATCH. Tri-state per field — omit to leave unchanged, send a value to replace, send `null` to clear (where the schema marks the field nullable). Sending `null` for `condition` returns `400`. When condition is provided, the entire trigger condition (event, origin, and… */
export type OmnisendPatchTriggerRequestInput = {
	/** Audience filter group for contact eligibility. */
	audienceFilterGroup?: OmnisendContactFilterGroupRequestInput;
	/** Trigger condition. When provided, replaces the entire condition (event, origin, and filter groups) in full. */
	condition?: OmnisendPatchTriggerConditionInput;
	/** Inactivity settings — the workflow fires only after the contact has been inactive for the specified period. */
	inactivitySettings?: OmnisendInactivitySettingsRequestInput;
};

/** Preheader block to setup View in Browser link text formattings Text is formatted as ```Text<a href="https://view-inbrowser-link">LinkText</a>``` */
export type OmnisendPreheaderInput = {
	/** Preheader link text */
	linkText?: string;
	/** Preheader text */
	text?: string;
};

/** Product block for displaying product information */
export type OmnisendProductInput = {
	/** Product button text - text of the button that will redirect to the product page */
	buttonText?: string;
	/** Product description - displayed in the email */
	description?: string;
	/** Product ID - Omnisend product ID - can be retrieved from the Product API */
	id?: string;
	/** Product image ID - Omnisend image ID - can be retrieved from the Image API */
	imageID?: string;
	/** Product image URL - URL of the product image */
	imageUrl?: string;
	/** Product link - where the product will redirect on click */
	link?: string;
	/** Product price before discount */
	oldPrice?: string;
	/** Product original title - original title of the product */
	originalTitle?: string;
	/** Product price */
	price?: string;
	/** ID of connected platform product (e.g. Shopify product ID) */
	productID?: string;
	/** Product title - displayed in the email */
	title?: string;
};

/** Product recommender settings for the product recommendations section */
export type OmnisendProductRecommenderInput = {
	/** Categories to exclude from recommendations */
	excludeCategories?: Array<string>;
	/** Products to exclude from recommendations */
	excludeProducts?: Array<string>;
	/** Product recommender fallback type */
	fallbackType?: string;
	/** Categories to include in recommendations */
	includeCategories?: Array<string>;
	/** Whether to include out-of-stock products in recommendations */
	isOutOfStockIncluded?: boolean;
	/** Minimum price filter for product recommendations */
	priceFrom?: number;
	/** Number of days to exclude recently purchased products */
	purchaseExclusionDays?: number;
	/** Number of months to consider for recency-based recommendations */
	recencyMonths?: number;
	/** Product recommender type */
	type?: string;
};

/** Row is a single row of the section */
export type OmnisendRowInput = {
	/** Row columns - used to group content into logical columns */
	columns?: Array<OmnisendColumnInput>;
	/** Row unique identifier - must be unique within the template */
	id?: string;
	/** Row style properties - used to configure the row styling */
	styleProperties?: OmnisendStylePropertiesInput;
};

/** Filter rule for conditional display of content */
export type OmnisendRuleInput = {
	/** Filter operator - comparison operator for the filter condition */
	operator?: string;
	/** Filter property - property to filter on */
	property?: OmnisendFilterPropertyInput;
	/** Filter value - value to compare against the property */
	value?: string;
};

/** Section is a single section of the template */
export type OmnisendSectionInput = {
	/** Section unique identifier - must be unique within the template */
	id?: string;
	/** Section product recommender - used to configure the product recommender functionality */
	productRecommender?: OmnisendProductRecommenderInput;
	/** Section rows - used to group content into logical sections. Null for a section that references a universal layout, and must be null or empty when sent for one. Locked email content (a campaign that has started sending) is the exception: its universal layout sections keep the layout rows the… */
	rows?: Array<OmnisendRowInput> | null;
	/** Section settings - used to configure the section behavior and content */
	settings?: OmnisendEmailContentSettingsInput;
	/** Section style properties - used to configure the section styling */
	styleProperties?: OmnisendStylePropertiesInput;
	/** Section type - determines the section functionality and available content options. products_listing: manually selected products. product_recommender: personalized recommendations (requires productRecommender). product_cart_recovery: abandoned cart items. product_back_in_stock: restocked items.… */
	type?:
		| 'products_listing'
		| 'product_recommender'
		| 'product_cart_recovery'
		| 'product_back_in_stock'
		| 'badge'
		| 'preheader'
		| 'dynamic_list'
		| 'universal_layout'
		| '';
	/** Section visibility settings - used to show the section on mobile or desktop only. Omitted, or with neither flag true, the section shows on all devices. When sent, it must set at least one flag. */
	visibility?: OmnisendVisibilityInput;
};

/** A single filter condition applied to a specific entity. */
export type OmnisendSegmentConditionInput = {
	/** Entity type this condition applies to */
	entity?: string;
	/** List of filter criteria. Must contain at least one item. */
	filters: Array<OmnisendJsonValue>;
	/** Logical operator combining the filters within this condition */
	junction?: string;
};

/** Group of conditions combined with a logical junction. */
export type OmnisendSegmentConditionGroupInput = {
	/** List of conditions in this group */
	conditions?: Array<OmnisendSegmentConditionInput>;
};

/** Send email action configuration for automation creation. `templateID` references an Email Template entity documented in the [Email Templates API](https://api-docs.omnisend.com/reference/email-templates). */
export type OmnisendSendEmailRequestInput = {
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. When true (default), the contact bypasses this block and continues to the next block in the workflow. When false, the workflow is canceled for this contact. */
	isSkipAllowed?: boolean;
	/** Email language locale in xx_XX format. Must be a supported language */
	language: string;
	/** Email preheader text displayed after the subject line in the recipient's inbox. Supports personalization tags, e.g. [[contact.first_name]] */
	preheader: string;
	/** Reply-to email address for recipient responses. Must be a verified email */
	replyToEmail?: string;
	/** Sender email address shown in the recipient's inbox. Omit to use the brand's default automation sender, the same one the automation editor prefills. Required only when the brand has no default sender; it must then be an address verified for the brand's sending domain */
	senderEmail?: string;
	/** Sender display name shown in the recipient's inbox */
	senderName: string;
	/** Email subject line displayed in the recipient's inbox. Supports personalization tags, e.g. [[contact.first_name]] */
	subject: string;
	/** Email template unique identifier. Automation email content is created from this template. See [Email Templates API](https://api-docs.omnisend.com/reference/email-templates). */
	templateID: string;
};

/** Send push notification action configuration. Used for both POST (creation) and PUT (full replacement) — the request shape is identical for both. `iconID` and `imageID` reference image entities documented in the [Images API](https://api-docs.omnisend.com/reference/images). */
export type OmnisendSendPushRequestInput = {
	/** Push notification body shown beneath the title. Recommended up to 40 characters for best lockscreen visibility. Supports personalization tags, e.g. [[contact.first_name]] */
	body: string;
	/** Click-through URL the recipient is taken to when tapping the notification. */
	clickUrl: string;
	/** Optional icon image ID obtained from the Images API. Recommended size: 192×192 px (square). Larger square assets (384×384, 512×512) accepted for retina displays. Format: PNG, JPG, or GIF (non-animated). Maximum file size: 5 MB. When uploading via the Images API, the source URL must resolve to a… */
	iconID?: string;
	/** Optional image ID displayed below the push notification body. Recommended size: 360×180 px or larger with 2:1 aspect ratio (e.g. 720×360, 1024×512). Format: PNG, JPG, or GIF (non-animated). Maximum file size: 5 MB. Not supported on iOS / iPadOS / macOS Safari recipients — silently dropped on… */
	imageID?: string;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. When true (default), the contact bypasses this block and continues to the next block in the workflow. When false, the workflow is canceled for this contact. */
	isSkipAllowed?: boolean;
	/** Push notification title shown to recipients. Recommended up to 40 characters for best lockscreen visibility. Supports personalization tags, e.g. [[contact.first_name]] */
	title: string;
};

/** SMS action configuration. Used for both POST (creation) and PUT (full replacement). `imageID` references an image entity documented in the [Images API](https://api-docs.omnisend.com/reference/images). MMS images must be JPEG, PNG, or GIF and must not exceed 500 KB. */
export type OmnisendSendSmsRequestInput = {
	/** Compliance settings controlling opt-out keyword and unsubscribe link inclusion. */
	compliance: OmnisendSmsComplianceRequestInput;
	/** Optional MMS image ID obtained from the Images API. Must be JPEG, PNG, or GIF; max 500 KB. When uploading via the Images API, the source URL must resolve to a direct static asset (e.g. CDN or object-storage URL). Redirect-backed or CMS-routed URLs are rejected. */
	imageID?: string;
	/** Whether link shortening is enabled. Defaults to true when omitted. */
	isLinkShorteningEnabled?: boolean;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message. When true (default), the contact bypasses this block and continues to the next block in the workflow. When false, the workflow is canceled for this contact. */
	isSkipAllowed?: boolean;
	/** SMS message body. Supports personalization tags, e.g. [[contact.first_name]] */
	message: string;
};

/** Send webhook action configuration. Used for both POST (creation) and PUT (full replacement) — the request shape is identical for both. Sends an HTTP POST request to the specified URL with the provided headers and body. */
export type OmnisendSendWebhookRequestInput = {
	/** Request body template (JSON). Supports personalization tags, e.g. [[contact.email]] */
	body: string;
	/** Destination URL that receives the HTTP POST request. Must be HTTPS. */
	callbackUrl: string;
	/** Custom HTTP headers sent with the webhook request. */
	headers?: Array<OmnisendWebhookHeaderInput>;
};

/** Sending thresholds — controls which contacts receive messages at each send block (email, SMS) based on subscription status. When provided, both `email` and `sms` are required. Push notifications are always restricted to subscribed contacts and are not exposed here. When omitted, all channels… */
export type OmnisendSendingThresholdsRequestInput = {
	/** Email subscription threshold */
	email: 'subscribed' | 'nonSubscribed' | 'all';
	/** SMS subscription threshold. US non-subscribers are never reached on SMS regardless of this value — CTIA regulations restrict SMS to US contacts to subscribed only. */
	sms: 'subscribed' | 'nonSubscribed' | 'all';
};

/** SMS compliance settings for POST / PUT. Controls whether the opt-out keyword and unsubscribe link are included in the message. */
export type OmnisendSmsComplianceRequestInput = {
	/** Whether to append the opt-out keyword to the message. Defaults to true when omitted. */
	isStopKeywordIncluded?: boolean;
	/** Whether to append an unsubscribe link to the message. Defaults to true when omitted. */
	isUnsubscribeLinkIncluded?: boolean;
	/** Text appended as the opt-out keyword. Supports personalization tags. */
	stopKeywordText?: string;
	/** Text used for the unsubscribe link. Must contain [[unsubscribe_link]]. */
	unsubscribeLinkText?: string;
};

/** Social block for displaying social media icons and links */
export type OmnisendSocialInput = {
	/** Icons of the social media platforms */
	icons?: Array<OmnisendIconInput>;
	/** Shape of the social media icons */
	shape?: string;
	/** Size of the social media icons */
	size?: string;
};

/** Split filter group containing one or more filters of mixed types (event, contact, message) combined by a logical operator. */
export type OmnisendSplitFilterGroupRequestInput = {
	/** Filters within this group (each filter specifies its type). At least one filter is required. */
	filters: Array<OmnisendSplitFilterRequestInput>;
	/** Logical operator combining filters within this group */
	logicalOperator: 'and' | 'or';
};

/** Split filter — the `type` discriminator determines which fields and operators are valid. | type | field | operator | value | urlMatch | |---|---|---|---|---| | `event` | event property path (e.g. `total_price`, `cart.items.price`) | `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `contains`,… */
export type OmnisendSplitFilterRequestInput = {
	/** Property or attribute to filter on. For event filters: event property path. For contact filters: contact attribute name. For message filters: must be "blockID". */
	field: string;
	/** Comparison or engagement operator. Allowed values depend on the filter type and field. */
	operator: string;
	/** Filter type discriminator */
	type: 'event' | 'contact' | 'message';
	/** URL match condition. Applies only to clicked message filters (clickedEmail, clickedSms, clickedPush). Must be omitted for event, contact, and opened message filters. */
	urlMatch?: OmnisendUrlMatchRequestInput;
	/** Filter value. For event filters: must match the property's data type (number for numeric properties, string for string properties); omit only for operators "exists" and "notExists". For contact filters: always a string. For message filters: must be the ID of a message block (email/SMS/push) that… */
	value?: OmnisendJsonValue;
};

/** Style properties for the section */
export type OmnisendStylePropertiesInput = {
	/** Alignment - used to align the content horizontally */
	alignment?: string;
	/** Background color - used to set the background color of the content */
	backgroundColor?: string;
	/** Background image ID - ID of the background image asset. Must be present in Image API */
	backgroundImageID?: string;
	/** Background position - used to position the background image */
	backgroundPosition?: string;
	/** Background repeat - used to repeat the background image */
	backgroundRepeat?: string;
	/** Background size - used to size the background image */
	backgroundSize?: string;
	/** Border - used to add a border to the content */
	border?: string;
	/** Border radius */
	borderRadius?: string;
	/** Text color */
	color?: string;
	/** Divider color */
	dividerColor?: string;
	/** Font family */
	fontFamily?: string;
	/** Font size */
	fontSize?: string;
	/** Font style */
	fontStyle?: string;
	/** Font weight */
	fontWeight?: string;
	/** Inner padding */
	innerPadding?: string;
	/** Inner padding bottom */
	innerPaddingBottom?: string;
	/** Inner padding left */
	innerPaddingLeft?: string;
	/** Inner padding right */
	innerPaddingRight?: string;
	/** Inner padding top */
	innerPaddingTop?: string;
	/** Whether to exclude background paddings - used to exclude paddings from the background image */
	isBackgroundPaddingsExcluded?: boolean;
	/** Letter spacing - spacing between letters */
	letterSpacing?: string;
	/** Line height */
	lineHeight?: string;
	/** Link color */
	linkColor?: string;
	/** Padding */
	padding?: string;
	/** Padding bottom */
	paddingBottom?: string;
	/** Padding left */
	paddingLeft?: string;
	/** Padding right */
	paddingRight?: string;
	/** Padding top */
	paddingTop?: string;
	/** Price color - used to color the price text */
	priceColor?: string;
	/** Secondary color - used to color the secondary text */
	secondaryColor?: string;
	/** Text Background color - used to set the text background color */
	textBackgroundColor?: string;
	/** Text decoration */
	textDecoration?: string;
	/** Vertical alignment - used to align the content vertically */
	verticalAlign?: string;
};

/** Text preset for consistent typography */
export type OmnisendTextPresetInput = {
	/** Text preset unique identifier - must be unique within the template */
	id: string;
	/** Text preset name */
	name?: string;
	/** Text preset styles */
	styles: OmnisendTextStyleInput;
};

/** Text preset style properties */
export type OmnisendTextStyleInput = {
	/** Text preset color - hex color */
	color: string;
	/** Text preset font family */
	fontFamily: string;
	/** Text preset font size - from 3px to 100px */
	fontSize: string;
	/** Text preset letter spacing - spacing between letters, from -1px to 120px */
	letterSpacing?: string;
	/** Text preset line height - unitless from 1 to 2 or percentage from 100% to 200% */
	lineHeight: string;
};

/** UTM tracking tag values for an update request. All three fields must be provided — send an empty string to clear a field (which resets it to its default value on the next read). */
export type OmnisendUTMTagsInputInput = {
	/** UTM campaign parameter */
	campaign: string;
	/** UTM medium parameter */
	medium: string;
	/** UTM source parameter */
	source: string;
};

/** UTM variant tags for an A/B update request. Providing empty values resets them to defaults. */
export type OmnisendUTMVariantTagsInput = {
	/** UTM campaign parameter (max 250 characters) */
	campaign?: string;
	/** UTM medium parameter (max 250 characters) */
	medium?: string;
	/** UTM source parameter (max 250 characters) */
	source?: string;
};

/** UTM variant update entries for an A/B test campaign. */
export type OmnisendUTMVariantsUpdateInput = {
	/** Variant A tags */
	a?: OmnisendUTMVariantTagsInput;
	/** Variant B tags */
	b?: OmnisendUTMVariantTagsInput;
};

/** Unsubscribe action configuration. Contacts reaching this block are unsubscribed from the selected channels. This changes the contact's subscription status across the brand, not just in this automation. After this block, later send blocks on the same channel no longer reach the contact when the… */
export type OmnisendUnsubscribeActionInput = {
	/** Channels to unsubscribe the contact from. At least one, each value at most once. */
	channels: Array<'email' | 'sms' | 'push'>;
};

/** A/B test update block. Full replacement semantics. */
export type OmnisendUpdateABTestInput = {
	/** A/B test settings */
	settings?: OmnisendUpdateABTestSettingsInput;
	/** Per-variant content fields */
	variants?: OmnisendUpdateABTestVariantsInput;
};

/** Decision time for A/B test winner selection */
export type OmnisendUpdateABTestDecisionTimeInput = {
	/** Amount of time units */
	amount: number;
	/** Time unit: "h" (hours, 1–168) or "d" (days, 1–7) */
	unit: 'h' | 'd';
};

/** A/B test settings for update */
export type OmnisendUpdateABTestSettingsInput = {
	/** Time allowed before a winner is selected */
	decisionTime?: OmnisendUpdateABTestDecisionTimeInput;
	/** Percentage of audience used for the test (10–100) */
	testSizePercent?: number;
	/** Metric used to determine the winner */
	winningMetric?: 'openRate' | 'clickRate';
};

/** Content fields for a single A/B variant. Email fields live under `content.email`. */
export type OmnisendUpdateABTestVariantInput = {
	/** Variant content grouped by channel */
	content?: OmnisendUpdateABTestVariantContentInput;
};

/** Variant content grouped by channel for update. */
export type OmnisendUpdateABTestVariantContentInput = {
	/** Email content for this variant */
	email?: OmnisendUpdateABTestVariantEmailInput;
};

/** Email content fields for an A/B test variant update. */
export type OmnisendUpdateABTestVariantEmailInput = {
	/** Email preheader text */
	preheader?: string;
	/** Reply-to email address. Omit it to keep the current value; send an empty string to clear it, which makes replies go to the sender address. Any address set must be verified for the brand, and verification status is not exposed here, so an address that is guessed, or copied from another campaign,… */
	replyToEmail?: string;
	/** Sender email address. Omit it to keep the current sender, which the brand may already send from. Set it only when switching to a specific required address: which addresses a brand may send from follows from its sender setup and is not exposed here, so an address that is guessed, or copied from… */
	senderEmail?: string;
	/** Sender display name */
	senderName?: string;
	/** Email subject line */
	subject?: string;
};

/** Per-variant content for A/B test update */
export type OmnisendUpdateABTestVariantsInput = {
	/** Variant A content */
	a?: OmnisendUpdateABTestVariantInput;
	/** Variant B content */
	b?: OmnisendUpdateABTestVariantInput;
};

/** A/B test block configuration for full replacement (PUT). At least one of aBlocks or bBlocks must be non-empty. */
export type OmnisendUpdateABTestingRequestInput = {
	/** Blocks executed for contacts in branch A. */
	aBlocks?: Array<OmnisendUpdateBlockRequestInput>;
	/** Percentage of contacts routed to branch A. Branch B receives the remainder. */
	aBlocksPercentage: number;
	/** Blocks executed for contacts in branch B. */
	bBlocks?: Array<OmnisendUpdateBlockRequestInput>;
};

/** Automation workflow block for PUT — can create a new block (via temporaryID) or update an existing one (via id). Exactly one of the type-specific fields must be populated based on the type discriminator. **Constraint:** A `delay` block cannot end the workflow. During full block-tree replacement,… */
export type OmnisendUpdateBlockRequestInput = {
	/** A/B test block configuration */
	abTesting?: OmnisendUpdateABTestingRequestInput;
	/** Action block configuration */
	action?: OmnisendInputActionRequestInput;
	/** Delay block configuration */
	delay?: OmnisendUpdateDelayRequestInput;
	/** Server-assigned block ID. Required when updating an existing block. */
	id?: string;
	/** Split block configuration */
	split?: OmnisendUpdateSplitRequestInput;
	/** Client-provided identifier for new blocks, scoped to this request. Used in validation error messages. Omit when updating an existing block via blockID. Must be unique within the request. */
	temporaryID?: string;
	/** Block type discriminator */
	type: 'delay' | 'action' | 'split' | 'abTesting';
};

/** Delay settings for booster campaign */
export type OmnisendUpdateBoosterDelayInput = {
	/** Amount of time units. Minimum 0 (SMS booster only — means "send together with parent"). Maximum 240 hours (or 10 days) */
	amount: number;
	/** Time unit: "h" for hours, "d" for days */
	unit: 'h' | 'd';
};

/** Booster-specific settings for campaign update. */
export type OmnisendUpdateBoosterSettingsInput = {
	/** Delay before sending the booster after the parent campaign is sent. Only required when the parent campaign is in draft status */
	delay?: OmnisendUpdateBoosterDelayInput;
	/** Which recipients to target: "nonOpeners" or "nonClickers" */
	sendTo?: 'nonOpeners' | 'nonClickers';
};

/** Campaign content for update */
export type OmnisendUpdateContentInput = {
	/** Email content. Only specified fields will be updated */
	email?: OmnisendUpdateEmailInput;
	/** SMS content. Only specified fields will be updated */
	sms?: OmnisendUpdateSMSInput;
};

/** Delay block configuration for full replacement (PUT and PATCH). All fields of the delay are replaced atomically — this is not a partial update. Re-send the complete delay spec when changing any field, including mode. */
export type OmnisendUpdateDelayRequestInput = {
	/** Days of the week when the delay is allowed to resolve. Omit to allow all days. */
	allowedWeekdays?: Array<
		| 'sunday'
		| 'monday'
		| 'tuesday'
		| 'wednesday'
		| 'thursday'
		| 'friday'
		| 'saturday'
	>;
	/** Duration configuration — required when mode is "duration" */
	duration?: OmnisendUpdateDurationRequestInput;
	/** Delay mode discriminator */
	mode: 'duration' | 'immediate' | 'specificTime';
	/** Time in HH:MM 24-hour format — required when mode is "specificTime" */
	time?: string;
};

/** Duration configuration for delay replacement (PUT and PATCH). */
export type OmnisendUpdateDurationRequestInput = {
	/** Duration amount — must be at least 1 */
	amount: number;
	/** Duration unit */
	units: 'm' | 'h' | 'd' | 'w' | 'M';
};

/** Email content for campaign update */
export type OmnisendUpdateEmailInput = {
	/** Email preheader text */
	preheader?: string;
	/** Reply-to email address for recipient responses. Omit it to keep the current value; send an empty string to clear it, which makes replies go to the sender address. Any address set must be verified for the brand, and verification status is not exposed here, so an address that is guessed, or copied… */
	replyToEmail?: string;
	/** Sender email address. Omit it to keep the current sender, which the brand may already send from. Set it only when switching to a specific required address: which addresses a brand may send from follows from its sender setup and is not exposed here, so an address that is guessed, or copied from… */
	senderEmail?: string;
	/** Sender display name shown in the recipient's inbox */
	senderName?: string;
	/** Email subject line */
	subject?: string;
};

/** SMS content for campaign update */
export type OmnisendUpdateSMSInput = {
	/** Compliance text appended to every SMS */
	compliance?: OmnisendUpdateSMSComplianceInput;
	/** Image ID obtained from the Images API. When set, the message is delivered as MMS to US/CA recipients; other countries receive SMS without the image. Image must be JPEG, JPG, PNG, or GIF and not exceed 500 KB */
	imageID?: string;
	/** Auto-shorten links in message body */
	isLinkShorteningEnabled?: boolean;
	/** SMS message body. When sent as SMS, the message (including the appended compliance text and unsubscribe link/keyword) must not exceed 9 SMS segments for either US/CA or other-country recipients. When sent as MMS, the message (including the appended compliance text) must not exceed 1600… */
	message?: string;
};

/** SMS compliance text settings for update */
export type OmnisendUpdateSMSComplianceInput = {
	/** STOP keyword text for US/CA recipients */
	stopKeywordText?: string;
	/** Unsubscribe link text for non-US/CA recipients */
	unsubscribeLinkText?: string;
};

/** Sending settings for campaign update. Full object replacement - provide all fields applicable to the selected strategy (for personalized: strategy, scheduledAt, optimizeFor; omit isTZOptimizationEnabled) */
export type OmnisendUpdateSendingSettingsInput = {
	/** Whether timezone optimization is enabled. Only available with immediate or scheduled strategy, and only in email campaigns */
	isTZOptimizationEnabled?: boolean;
	/** Optimization objective for personalized sends. Required when strategy is "personalized", must not be set otherwise */
	optimizeFor?: 'opens' | 'clicks' | 'orders';
	/** Whether personalized sends avoid contact-local hours from 22:00 through 06:59. If omitted, retains the existing personalized value; defaults to true only when no value exists. Must not be set for other strategies */
	respectQuietHours?: boolean;
	/** Campaign scheduled send time in RFC 3339 format. Required when strategy is "scheduled" or "personalized", must not be set for "immediate". For "scheduled" it must be in the future and within one year from now. For "personalized" only the calendar date in the brand timezone is used, not the… */
	scheduledAt?: string;
	/** Sending strategy. "personalized" enables send time optimization and is only available for regular email campaigns in stores whose plan includes personalized send times and that are eligible for them */
	strategy?: 'immediate' | 'scheduled' | 'personalized';
};

/** SMS compliance settings for PATCH (full replacement of the compliance object). Both toggle fields are required when this object is provided. Cannot be aliased to SmsComplianceRequest: PATCH toggles are required; POST/PUT toggles are optional. */
export type OmnisendUpdateSmsComplianceInput = {
	/** Whether to append the opt-out keyword to the message. */
	isStopKeywordIncluded: boolean;
	/** Whether to append an unsubscribe link to the message. */
	isUnsubscribeLinkIncluded: boolean;
	/** Text appended as the opt-out keyword. Supports personalization tags. */
	stopKeywordText?: string;
	/** Text used for the unsubscribe link. Must contain [[unsubscribe_link]]. */
	unsubscribeLinkText?: string;
};

/** Conditional split block configuration for full replacement (PUT). All fields of the split are replaced atomically — this is not a partial update. Re-send the complete split spec when changing any field. At least one of trueBlocks or falseBlocks must be non-empty. Sibling blocks placed after a… */
export type OmnisendUpdateSplitRequestInput = {
	/** Blocks executed when the filter group evaluates to false. */
	falseBlocks?: Array<OmnisendUpdateBlockRequestInput>;
	/** Filter group evaluated when contacts reach this block. At least one filter is required. */
	filterGroup: OmnisendSplitFilterGroupRequestInput;
	/** Blocks executed when the filter group evaluates to true. */
	trueBlocks?: Array<OmnisendUpdateBlockRequestInput>;
};

/** URL match condition for clicked message filters (clickedEmail, clickedSms, clickedPush). When operator is "any", value may be omitted. For all other operators, value is required. */
export type OmnisendUrlMatchRequestInput = {
	/** URL match operator */
	operator: 'any' | 'is' | 'contains' | 'startsWith' | 'endsWith';
	/** URL string to match against. Required when operator is not "any". */
	value?: string;
};

export type OmnisendVariantInput = {
	/** DefaultImageUrl is recommended if more than one image is needed. Other product images should be added to the Images array. */
	defaultImageUrl?: string;
	/** Description is a short description of the product. It can be used in the email body. */
	description?: string;
	id: string;
	images?: Array<string>;
	price: number;
	sku?: string;
	/** Status can be inStock, outOfStock, or notAvailable. We recommended to keep it in sync with your shop product to ensure that Omnisend can avoid sending out-of-stock products to your customers. */
	status?: 'inStock' | 'outOfStock' | 'notAvailable';
	/** StrikeThroughPrice is the price before the discount. */
	strikeThroughPrice?: number;
	title: string;
	url: string;
};

/** Video block for displaying a video in the email */
export type OmnisendVideoInput = {
	/** Video alt text - alternative text for the video for accessibility */
	altText?: string;
	/** Video ID - Omnisend video ID - can be retrieved from the Video API */
	id?: string;
	/** Video image - image of the video thumbnail; width is required when height is set */
	image?: OmnisendImageInput;
	/** Video link - where the video will redirect on click */
	link?: string;
};

/** Section device visibility. The section shows on one device only when exactly one flag is true; omitted visibility or no true flag shows it on all devices. When sent, visibility must set isMobileVisible or isDesktopVisible; a visibility with no true flag is not stored. */
export type OmnisendVisibilityInput = {
	/** Whether the section is visible on desktop devices */
	isDesktopVisible?: boolean;
	/** Whether the section is visible on mobile devices */
	isMobileVisible?: boolean;
};

/** A single webhook HTTP header. */
export type OmnisendWebhookHeaderInput = {
	/** Header name */
	key?: string;
	/** Header value. The configured value is returned verbatim under the read scope. */
	value?: string;
};

/** A single property in a write request. Optional metadata fields are pointers to mirror the PUT preserve-on-omit semantics at each nested node. */
export type OmnisendWritePropertyNodeInput = {
	/** Longer explanation of the property. Omit on PUT to keep the stored value. */
	description?: string;
	/** Human-readable label. Optional; omit on PUT to keep the stored value. */
	displayName?: string;
	/** Logical grouping for UI presentation. Omit on PUT to keep the stored value. */
	group?: string;
	/** Child properties, only for struct-typed properties. */
	properties?: Record<string, OmnisendWritePropertyNodeInput>;
	/** Property data type */
	type:
		| 'string'
		| 'stringList'
		| 'integer'
		| 'integerList'
		| 'float'
		| 'floatList'
		| 'boolean'
		| 'booleanList'
		| 'date'
		| 'dateList'
		| 'struct'
		| 'structList';
};

export type OmnisendAnalyticsDimensionInput = {
	granularity?: string;
	name?: string;
};

export type OmnisendAnalyticsFilterInput = {
	name?: string;
	operator?: string;
	values?: Array<string>;
};

export type OmnisendAnalyticsMetricInput = {
	name?: string;
};

export type OmnisendContactDtoChannelInput = 'email' | 'sms';

export type OmnisendContactDtoConsentInput = {
	channel?: OmnisendContactDtoChannelInput;
	/** RFC3339 format */
	createdAt?: string;
	/** IP address of the user */
	ip?: string;
	source?: string;
	/** User agent of the device that user used to give consent */
	userAgent?: string;
};

export type OmnisendContactDtoContactInput = {
	/** Street, house number, apartment */
	address?: string;
	/** Format: YYYY-MM-DD. Example: 1990-01-01 */
	birthdate?: string;
	city?: string;
	consents?: Array<OmnisendContactDtoConsentInput>;
	country?: string;
	/** ISO Country code. You can find all country codes in Guides part. */
	countryCode?: string;
	/** You can add your own custom properties. Read more in https://api-docs.omnisend.com/reference/contacts#custom-properties */
	customProperties?: Record<string, OmnisendJsonValue>;
	email?: string;
	firstName?: string;
	gender?: 'm' | 'f';
	id?: string;
	lastName?: string;
	optIns?: Array<OmnisendContactDtoOptInInput>;
	optOuts?: Array<OmnisendContactDtoOptOutInput>;
	phone?: string;
	postalCode?: string;
	state?: string;
	/** Tags are labels you create to organize and manage your audience. */
	tags?: Array<string>;
};

export type OmnisendContactDtoOptInInput = {
	channel?: OmnisendContactDtoChannelInput;
	createdAt?: string;
	source?: string;
};

export type OmnisendContactDtoOptOutInput = {
	channel?: OmnisendContactDtoChannelInput;
	createdAt?: string;
	reason?: string;
	source?: string;
};

export type OmnisendReportsDateRangeInput = {
	from?: string;
	interval?: string;
	to?: string;
};

export type OmnisendReportsReportQueryInput = {
	alias?: string;
	dateRange?: OmnisendReportsDateRangeInput;
	dimensions?: Array<OmnisendAnalyticsDimensionInput>;
	filters?: Array<OmnisendAnalyticsFilterInput>;
	metrics?: Array<OmnisendAnalyticsMetricInput>;
};

export type OmnisendStatisticsDateRangeInput = {
	/** RFC3339/ISO8601 format */
	from?: string;
	/** RFC3339/ISO8601 format */
	to?: string;
};

export type OmnisendStatisticsReportQueryInput = {
	alias?: string;
	dateRange?: OmnisendStatisticsDateRangeInput;
	dimensions?: Array<OmnisendAnalyticsDimensionInput>;
	filters?: Array<OmnisendAnalyticsFilterInput>;
	metrics?: Array<OmnisendAnalyticsMetricInput>;
};

/** A/B test configuration. Variants are keyed by "a" and "b"; the parent campaign's `content` field is omitted because variants carry their own content. `result` is populated once a winner is selected and is `null` otherwise. */
export type OmnisendABTest = {
	/** Winner information (read-only). Null until winner is selected. */
	result?: OmnisendABTestResult | null;
	/** Test configuration */
	settings?: OmnisendABTestSettings | null;
	/** Variants keyed by "a" and "b" */
	variants?: OmnisendABTestVariants | null;
};

/** Decision time before selecting a winner. Same shape as booster delay. */
export type OmnisendABTestDecisionTime = {
	/** Amount of time units to wait */
	amount?: number | null;
	/** Time unit: "h" for hours, "d" for days */
	unit?: string | null;
};

/** A/B test result (read-only). */
export type OmnisendABTestResult = {
	/** Whether the winner was manually selected (read-only) */
	isManuallySelected?: boolean | null;
	/** When the winner was selected (read-only) */
	selectedAt?: string | null;
	/** Campaign ID of the winning variant (read-only). Matches variants.a.id or variants.b.id. */
	winnerVariantID?: string | null;
};

/** A/B test settings. */
export type OmnisendABTestSettings = {
	/** Time to wait before selecting the winner */
	decisionTime?: OmnisendABTestDecisionTime | null;
	/** Percentage of audience for the test phase (10-100) */
	testSizePercent?: number | null;
	/** Winner determination metric */
	winningMetric?: string | null;
};

/** A/B test variant. Email-specific fields live under `content.email`. */
export type OmnisendABTestVariant = {
	/** Variant content grouped by channel */
	content?: OmnisendABTestVariantContent | null;
	/** Variant campaign ID (read-only). Used for reporting API access. */
	id?: string | null;
};

/** A/B test variant content grouped by channel. */
export type OmnisendABTestVariantContent = {
	/** Email content for this variant */
	email?: OmnisendABTestVariantEmail | null;
};

/** Email content fields for an A/B test variant. */
export type OmnisendABTestVariantEmail = {
	/** Email content unique identifier referencing the variant's email design */
	contentID?: string | null;
	/** Preheader text */
	preheader?: string | null;
	/** Reply-to email address */
	replyToEmail?: string | null;
	/** Sender email address */
	senderEmail?: string | null;
	/** Sender display name */
	senderName?: string | null;
	/** Email subject line */
	subject?: string | null;
};

/** A/B test variants object with keys "a" and "b". */
export type OmnisendABTestVariants = {
	/** Variant A (null if not yet configured) */
	a?: OmnisendABTestVariant | null;
	/** Variant B (null if not yet configured) */
	b?: OmnisendABTestVariant | null;
};

/** A/B testing block configuration. Splits contacts randomly between two variants based on `aBlocksPercentage`. `bBlocks` receives the remaining percentage (100 - aBlocksPercentage). Each contact is assigned independently when reaching this block. To pick a winner, set `aBlocksPercentage` to 100… */
export type OmnisendABTesting = {
	/** Blocks for variant A */
	aBlocks?: Array<OmnisendBlock> | null;
	/** Percentage of contacts allocated to aBlocks (bBlocks gets 100 - aBlocksPercentage) */
	aBlocksPercentage?: number | null;
	/** Blocks for variant B */
	bBlocks?: Array<OmnisendBlock> | null;
};

/** Form A/B setup resource. */
export type OmnisendAbSetup = {
	/** Auto-close policy configured when the test was started (read-only). Absent when the test does not close automatically. */
	autoClose?: OmnisendAbSetupAutoClose | null;
	/** A/B setup creation timestamp (read-only) */
	createdAt?: string | null;
	/** A/B setup enable timestamp (read-only) */
	enabledAt?: string | null;
	/** A/B setup unique identifier (read-only) */
	id?: string | null;
	/** A/B setup launch timestamp (read-only) */
	launchedAt?: string | null;
	/** Main form of the A/B setup */
	mainForm?: OmnisendAbSetupMainFormResponse | null;
	/** A/B setup status (read-only) */
	status?: OmnisendAbStatus | null;
	/** A/B setup last update timestamp (read-only) */
	updatedAt?: string | null;
	/** Variant forms of the A/B setup */
	versions?: Array<OmnisendAbSetupVersionResponse> | null;
};

/** Auto-close policy for a form A/B setup. */
export type OmnisendAbSetupAutoClose = {
	/** Instant at which the test closes automatically. Must be in the future when the test is started. */
	endsAt?: string | null;
	/** Close the test as soon as one variant is a statistically significant winner. */
	stopOnSignificance?: boolean | null;
};

/** Main form of an A/B setup. */
export type OmnisendAbSetupMainFormResponse = {
	/** Form unique identifier (read-only) */
	formID?: string | null;
	/** Form name */
	name?: string | null;
	/** Form status (read-only) */
	status?: OmnisendStatus | null;
};

/** A/B setup report for a form */
export type OmnisendAbSetupReport = {
	/** A/B setup unique identifier (read-only) */
	abSetupID?: string | null;
	/** A/B test completion timestamp; omitted while the A/B test is still running (read-only) */
	completedAt?: string | null;
	/** A/B test start timestamp (read-only) */
	startedAt?: string | null;
	/** A/B setup status (read-only) */
	status?: string | null;
	/** Per-version statistics (read-only) */
	versionStatistics?: Array<OmnisendAbVersionStatistics> | null;
	/** Name of the version selected when the test completed; omitted when no winner was determined (read-only) */
	winner?: string | null;
};

/** Form A/B setup version (variant). */
export type OmnisendAbSetupVersionResponse = {
	/** Form unique identifier (read-only) */
	formID?: string | null;
	/** Form name */
	name?: string | null;
	/** Traffic distribution weight for the variant. Range: 0-100 */
	weight?: number | null;
};

/** Paginated list of form A/B setups. */
export type OmnisendAbSetupsResponse = {
	abSetups?: Array<OmnisendAbSetup> | null;
	paging?: OmnisendFormsPagingResponse | null;
};

/** A/B test status of a form. `disabled` is a launched A/B test that is currently paused. */
export type OmnisendAbStatus = string;

/** Statistics for a single A/B test version */
export type OmnisendAbVersionStatistics = {
	/** Percentage of eligible traffic routed to the version; split values of a setup add up to 100 (read-only) */
	splitValue?: number | null;
	/** Statistics for the version (read-only) */
	statistics?: OmnisendFormStatistics | null;
	/** Version name (read-only) */
	versionName?: string | null;
};

/** Action block configuration. Exactly one action-specific field is populated based on the type discriminator. */
export type OmnisendAction = {
	/** Add tag action configuration */
	addTag?: OmnisendTagAction | null;
	/** Remove tag action configuration */
	removeTag?: OmnisendTagAction | null;
	/** Send email action configuration */
	sendEmail?: OmnisendSendEmail | null;
	/** Send push notification action configuration */
	sendPush?: OmnisendSendPush | null;
	/** Send SMS action configuration */
	sendSms?: OmnisendSendSms | null;
	/** Send webhook action configuration */
	sendWebhook?: OmnisendSendWebhook | null;
	/** Action type discriminator */
	type?: string | null;
	/** Unsubscribe action configuration */
	unsubscribe?: OmnisendUnsubscribeAction | null;
};

/** Aggregated UTM tracking tags for all send-action blocks in an automation. */
export type OmnisendAggregateUTMResponse = {
	/** UTM tags per send-action block */
	blocks?: Array<OmnisendAggregateUTMResponseBlock> | null;
};

/** UTM tracking tags for a single block within the aggregate response. */
export type OmnisendAggregateUTMResponseBlock = {
	/** Block identifier */
	blockID?: string | null;
	/** UTM tag values */
	tags?: OmnisendUTMTags | null;
};

/** Gmail annotation settings */
export type OmnisendAnnotation = {
	/** Gmail discount description - description of the discount or promotion to display in Gmail promotion tab together with the discount code. */
	discountDescription?: string | null;
	/** Gmail annotation enabled */
	isEnabled?: boolean | null;
};

/** Campaign audience */
export type OmnisendAudience = {
	/** Countries excluded from the SMS audience, as ISO 3166-1 alpha-2 codes (e.g. "US"). Only applicable to SMS campaigns. Recipients in these countries are not sent to. */
	excludedCountries?: Array<string> | null;
	/** Segments to exclude from the audience */
	excludedSegmentIDs?: Array<string> | null;
	/** Segments to include. Empty includes all subscribers */
	includedSegmentIDs?: Array<string> | null;
};

/** Automation workflow resource */
export type OmnisendAutomation = {
	/** Automation workflow blocks (actions, delays, splits, A/B tests). Omitted from list responses with `view=summary` unless `include=blocks` is passed. */
	blocks?: Array<OmnisendBlock> | null;
	/** Brand identifier (read-only) */
	brandID?: string | null;
	/** Automation creation timestamp (read-only) */
	createdAt?: string | null;
	/** Timestamp when automation was disabled (read-only) */
	disabledAt?: string | null;
	/** Timestamp when automation was enabled (read-only) */
	enabledAt?: string | null;
	/** Exit conditions that remove contacts from the automation workflow (evaluated with OR logic) */
	exitConditions?: Array<OmnisendExitCondition> | null;
	/** Automation workflow unique identifier (read-only) */
	id?: string | null;
	/** Whether the automation workflow is enabled (read-only). Controlled via enable/disable actions. */
	isEnabled?: boolean | null;
	/** Automation workflow name */
	name?: string | null;
	/** Automation settings */
	settings?: OmnisendSettings | null;
	/** Automation trigger configuration */
	trigger?: OmnisendTrigger | null;
	/** Automation last update timestamp (read-only) */
	updatedAt?: string | null;
	/** Link to the automation workflow editor in the Omnisend app (read-only) */
	url?: string | null;
};

/** Automation workflow schedule. `startAt` enables the workflow and `endAt` disables it at the given time. Either one or both can be set. */
export type OmnisendAutomationSchedule = {
	/** What happens at `endAt` to contacts currently in the workflow */
	contactsInWorkflow?: string | null;
	/** Time when the workflow is disabled automatically (UTC, minute precision) */
	endAt?: string | null;
	/** Time when the workflow is enabled automatically (UTC, minute precision) */
	startAt?: string | null;
	/** Time when the scheduled start was attempted and skipped because the workflow had validation errors (read-only). The start is not retried; save the schedule again after fixing the workflow. */
	startFailedAt?: string | null;
};

export type OmnisendBatch = {
	batchID?: string | null;
	createdAt?: string | null;
	endedAt?: string | null;
	endpoint?: string | null;
	errors?: Array<OmnisendBatchItem> | null;
	errorsCount?: number | null;
	eventID?: string | null;
	finishedCount?: number | null;
	method?: string | null;
	origin?: string | null;
	responses?: Array<OmnisendBatchItem> | null;
	startedAt?: string | null;
	status?: string | null;
	totalCount?: number | null;
};

export type OmnisendBatchItem = {
	itemID?: string | null;
	request?: OmnisendJsonValue | null;
	response?: OmnisendJsonValue | null;
	responseCode?: number | null;
	status?: string | null;
};

/** Automation workflow block. Exactly one of delay, action, split, or abTesting is populated based on the type discriminator. */
export type OmnisendBlock = {
	/** A/B testing block configuration */
	abTesting?: OmnisendABTesting | null;
	/** Action block configuration */
	action?: OmnisendAction | null;
	/** Delay block configuration */
	delay?: OmnisendDelay | null;
	/** Block identifier */
	id?: string | null;
	/** Conditional split block configuration */
	split?: OmnisendSplit | null;
	/** Block type discriminator */
	type?: string | null;
};

/** BlockComponent is a block nested inside a parent block, carrying one part of what that parent renders. Some parent blocks assign a 'role' to each of their parts, and then the parent's 'type' decides which roles it needs: a 'discount' block requires text/discount_code and accepts… */
export type OmnisendBlockComponent = {
	/** Button content of the component - used by roles 'discount_button' and 'product_button'. */
	button?: OmnisendButton | null;
	/** Components nested inside this component. Only role 'product_prices' uses them. */
	components?: Array<OmnisendBlockComponent> | null;
	/** Deprecated: use Text instead. Read-only, will be removed in future versions. */
	html?: string | null;
	/** Component unique identifier - must be unique within the template */
	id?: string | null;
	/** Image content of the component. Product blocks use it with role 'product_image'. Countdown blocks require one without a role; its source is generated from countdown.timerID. */
	image?: OmnisendImage | null;
	/** Role the component plays inside its parent block - set only where the parent block assigns roles to its parts, and omitted otherwise. */
	role?: string | null;
	/** Style preset ID - ID of the style preset. ID must be present in template General Settings. */
	stylePresetID?: string | null;
	/** Style properties - style properties of the component */
	styleProperties?: OmnisendStyleProperties | null;
	/** Text content of the component - supports HTML formatting and personalization tags. For role 'discount_code' this is the code the recipient sees; on a platform that issues its own codes it is replaced at send time, so it carries the placeholder XXXX-XXXX-XXXX. */
	text?: string | null;
	/** Component type. Only these block types can be nested as a component. */
	type?: string | null;
};

/** Body settings for the template */
export type OmnisendBody = {
	/** Body background color - hex color */
	backgroundColor?: string | null;
	/** Body background image ID - must be present in Image API */
	backgroundImageID?: string | null;
	/** Body background repeat */
	backgroundRepeat?: string | null;
	/** Body background size */
	backgroundSize?: string | null;
};

/** Delay between the parent campaign send and the booster send. */
export type OmnisendBoosterDelay = {
	/** Amount of time units before the booster is sent */
	amount?: number | null;
	/** Time unit: "h" for hours, "d" for days */
	unit?: string | null;
};

/** Booster-specific settings. */
export type OmnisendBoosterSettings = {
	/** Parent campaign ID this booster follows up on */
	campaignID?: string | null;
	/** Delay between the parent's send and this booster's send */
	delay?: OmnisendBoosterDelay | null;
	/** Audience selector. The booster targets recipients of the parent who did NOT perform the implied action (`nonOpeners` did not open; `nonClickers` did not click). */
	sendTo?: string | null;
};

/** Button block settings */
export type OmnisendButton = {
	/** Button is full width */
	isFullWidth?: boolean | null;
	/** Button link */
	link?: string | null;
	/** Button text */
	text?: string | null;
	/** Button translation key - used for internationalization support */
	translationKey?: string | null;
};

/** Button preset for consistent design */
export type OmnisendButtonPreset = {
	/** Button preset unique identifier */
	id?: string | null;
	/** Button preset name */
	name?: string | null;
	/** Button preset styles */
	styles?: OmnisendButtonStyle | null;
};

/** Button preset style properties */
export type OmnisendButtonStyle = {
	/** Button background color - hex color or transparent */
	backgroundColor?: string | null;
	/** Button border style */
	border?: string | null;
	/** Button border radius - from 0px to 200px */
	borderRadius?: string | null;
	/** Button font color - hex color */
	color?: string | null;
	/** Button font family */
	fontFamily?: string | null;
	/** Button font size - from 3px to 100px */
	fontSize?: string | null;
	/** Button font style */
	fontStyle?: string | null;
	/** Button font weight */
	fontWeight?: string | null;
	/** Button letter spacing - spacing between letters, from -1px to 120px */
	letterSpacing?: string | null;
	/** Button padding bottom - from 0px to 240px */
	paddingBottom?: string | null;
	/** Button padding left - from 0px to 120px */
	paddingLeft?: string | null;
	/** Button padding right - from 0px to 120px */
	paddingRight?: string | null;
	/** Button padding top - from 0px to 240px */
	paddingTop?: string | null;
	/** Button text decoration - omit for no decoration */
	textDecoration?: string | null;
};

/** Campaign resource. When `type` is `booster`, the `boosterSettings` field is populated, identifying the parent campaign and the conditions under which the booster targets recipients of that parent. */
export type OmnisendCampaign = {
	/** A/B test configuration. Populated only when `type` is `abTest`; variants carry their own content (see `ABTest.variants`), so the top-level `content` field is omitted in that case. */
	abTest?: OmnisendABTest | null;
	/** Campaign audience */
	audience?: OmnisendAudience | null;
	/** Booster-specific settings. Populated only when `type` is `booster` and identifies the parent campaign and the conditions under which this booster targets recipients of that parent. */
	boosterSettings?: OmnisendBoosterSettings | null;
	/** Brand unique identifier (read-only) */
	brandID?: string | null;
	/** Campaign message channel */
	channel?: OmnisendCampaignChannel | null;
	/** Campaign content. Populated based on channel */
	content?: OmnisendContent | null;
	/** Campaign creation timestamp (read-only) */
	createdAt?: string | null;
	/** Campaign end timestamp (read-only) */
	endedAt?: string | null;
	/** Campaign unique identifier (read-only) */
	id?: string | null;
	/** Campaign language locale in xx_XX format */
	language?: string | null;
	/** Campaign name */
	name?: string | null;
	/** Campaign sending settings */
	sendingSettings?: OmnisendSendingSettings | null;
	/** Campaign start timestamp (read-only) */
	startedAt?: string | null;
	/** Campaign status */
	status?: OmnisendCampaignStatus | null;
	/** Campaign type. `booster` identifies a follow-up campaign sent to the audience of a parent campaign. */
	type?: OmnisendCampaignType | null;
	/** Campaign last update timestamp (read-only) */
	updatedAt?: string | null;
	/** Link to the campaign in the Omnisend app (read-only): the settings page of a draft campaign (for a booster, the parent campaign's booster page) or the report of a started, sent, canceled, stopped or expired campaign. Omitted for scheduled, paused, on-hold and error campaigns. */
	url?: string | null;
};

/** Campaign message channel */
export type OmnisendCampaignChannel = string;

/** Campaign status */
export type OmnisendCampaignStatus = string;

/** Campaign type */
export type OmnisendCampaignType = string;

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendCampaignsCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Cursor-based pagination metadata */
export type OmnisendCampaignsPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendCampaignsCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Paginated list of campaigns */
export type OmnisendCampaignsResponse = {
	/** List of campaigns */
	campaigns?: Array<OmnisendCampaign> | null;
	/** Pagination information */
	paging?: OmnisendCampaignsPagingResponse | null;
};

/** UTM settings for a campaign. Exactly one of `tags` (regular campaign) or `variants` (A/B test campaign) is present. */
export type OmnisendCampaignsUTMResponse = {
	/** UTM tags — present for regular campaigns */
	tags?: OmnisendCampaignsUTMTags | null;
	/** UTM variants — present for A/B campaigns */
	variants?: OmnisendUTMVariants | null;
};

/** UTM tag values. Providing empty values resets them to defaults. */
export type OmnisendCampaignsUTMTags = {
	/** UTM campaign parameter (max 250 characters) */
	campaign?: string | null;
	/** UTM medium parameter (max 250 characters) */
	medium?: string | null;
	/** UTM source parameter (max 250 characters) */
	source?: string | null;
};

/** A single product category entry in a list response */
export type OmnisendCategoryListItem = {
	/** Product category unique identifier (read-only) */
	categoryID?: string | null;
	/** Product category creation timestamp (read-only) */
	createdAt?: string | null;
	/** Product category name */
	title?: string | null;
	/** Product category last update timestamp (read-only) */
	updatedAt?: string | null;
};

/** Channel subscription status. */
export type OmnisendChannel = {
	/** Channel subscription status */
	status?: string | null;
	/** Timestamp when the channel status last changed */
	statusChangedAt?: string | null;
};

/** Column is a single column of the row */
export type OmnisendColumn = {
	/** Column blocks - used to group content into logical blocks */
	blocks?: Array<OmnisendEmailContentBlock> | null;
	/** Column unique identifier - must be unique within the template */
	id?: string | null;
	/** Column style properties - used to configure the column styling */
	styleProperties?: OmnisendStyleProperties | null;
	/** Column width - used to set the width of the column */
	width?: string | null;
};

/** Consent record for a contact channel. */
export type OmnisendConsent = {
	/** Channel type this consent applies to */
	channel?: string | null;
	/** Consent collection timestamp */
	createdAt?: string | null;
	/** IP address from which consent was collected */
	ip?: string | null;
	/** Source through which consent was obtained (e.g. omnisend-form, api) */
	source?: string | null;
	/** User agent string from the consent collection request */
	userAgent?: string | null;
};

/** Contact filter condition applied to contact properties. */
export type OmnisendContactFilter = {
	/** Contact property name to filter on */
	field?: string | null;
	/** Comparison operator */
	operator?: string | null;
	/** Filter value — type depends on the property */
	value?: OmnisendJsonValue | null;
};

/** Contact filter group containing one or more contact filters combined by a logical operator. */
export type OmnisendContactFilterGroup = {
	/** Contact filters within this group */
	filters?: Array<OmnisendContactFilter> | null;
	/** Logical operator combining filters within this group */
	logicalOperator?: string | null;
};

/** Contact resource representation. */
export type OmnisendContactResponse = {
	/** Contact Street, house number, apartment number */
	address?: string | null;
	/** Contact birthdate in YYYY-MM-DD format */
	birthdate?: string | null;
	/** Contact city */
	city?: string | null;
	/** Consent records per channel, sorted by collection date (read-only) */
	consents?: Array<OmnisendConsent> | null;
	/** Contact country name */
	country?: string | null;
	/** ISO 3166-1 alpha-2 country code */
	countryCode?: string | null;
	/** Contact creation timestamp (read-only) */
	createdAt?: string | null;
	/** Custom contact properties defined for the brand */
	customProperties?: Record<string, OmnisendJsonValue> | null;
	/** Primary email address derived from the email identifier (read-only) */
	email?: string | null;
	/** Contact first name */
	firstName?: string | null;
	/** Contact gender */
	gender?: string | null;
	/** Contact unique identifier (read-only) */
	id?: string | null;
	/** Contact identifiers with channel subscription details */
	identifiers?: Array<OmnisendIdentifier> | null;
	/** Contact last name */
	lastName?: string | null;
	/** Opt-in history per channel, sorted by date (read-only) */
	optIns?: Array<OmnisendOptIn> | null;
	/** Phone numbers derived from phone identifiers (read-only) */
	phone?: Array<string> | null;
	/** Contact postal or ZIP code */
	postalCode?: string | null;
	/** IDs of segments the contact belongs to (read-only) */
	segments?: Array<string> | null;
	/** State or province name */
	state?: string | null;
	/** Email channel subscription status derived from the primary email identifier (read-only) */
	status?: string | null;
	/** Most recent subscription status per channel, sorted by date (read-only) */
	statuses?: Array<OmnisendContactStatus> | null;
	/** Labels assigned to the contact */
	tags?: Array<string> | null;
	/** Contact-level tracking consents (read-only) */
	trackingConsents?: OmnisendContactTrackingConsents | null;
	/** Contact last updated timestamp (read-only) */
	updatedAt?: string | null;
};

/** Contact status per channel. */
export type OmnisendContactStatus = {
	/** Channel type */
	channel?: string | null;
	/** Channel subscription status */
	status?: string | null;
	/** Timestamp when the status last changed */
	statusChangedAt?: string | null;
};

/** Contact-level tracking consents. */
export type OmnisendContactTrackingConsents = {
	/** Email open tracking consent */
	emailOpen?: OmnisendEmailOpenTrackingConsent | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendContactsCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Cursor-based pagination metadata */
export type OmnisendContactsPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendContactsCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Campaign content */
export type OmnisendContent = {
	/** Email content */
	email?: OmnisendEmail | null;
	/** SMS content */
	sms?: OmnisendSMS | null;
};

/** Content settings for the template */
export type OmnisendContentSettings = {
	/** Content background color - hex color */
	backgroundColor?: string | null;
	/** Content text color - hex color */
	color?: string | null;
	/** Content font family */
	fontFamily?: string | null;
	/** Content font size - from 3px to 100px */
	fontSize?: string | null;
	/** Content width - from 300px to 2000px */
	width?: string | null;
};

/** Countdown block settings. The timer is identified by timerID; src is generated and signed by Omnisend. */
export type OmnisendCountdown = {
	/** Alternative text for the countdown image */
	alt?: string | null;
	/** Destination URL opened when the countdown is clicked */
	link?: string | null;
	/** Signed countdown image URL. Read-only; derived from timerID. */
	src?: string | null;
	/** Timer identifier returned by the timer API */
	timerID?: string | null;
};

export type OmnisendCreateBatchResponse = {
	batchID?: string | null;
	totalCount?: number | null;
};

/** Response returned after successfully creating a product category */
export type OmnisendCreateCategoryResponse = {
	/** Product category unique identifier */
	categoryID?: string | null;
};

export type OmnisendCreateProductResponse = {
	id?: string | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Custom font reference */
export type OmnisendCustomFont = {
	/** ID of the custom font */
	id?: string | null;
};

/** Value of a non-standard form field collected from a contact; the set of properties varies per form */
export type OmnisendCustomProperty = {
	/** Custom property name as configured on the form (read-only) */
	name?: string | null;
	/** Custom property value type (read-only) */
	type?: string | null;
	/** Custom property value; shape matches the declared type (read-only) */
	value?: Record<string, OmnisendJsonValue> | null;
};

/** Delay block configuration. The `mode` field determines the delay behavior: - "duration": wait for the specified amount of time units - "immediate": no wait, proceed to the next block - "specificTime": wait until the specified time of day in the brand's timezone `allowedWeekdays` is optional for… */
export type OmnisendDelay = {
	/** Restrict delay resolution to specific weekdays */
	allowedWeekdays?: Array<string> | null;
	/** Duration configuration — required when mode is "duration" */
	duration?: OmnisendDuration | null;
	/** Delay mode discriminator */
	mode?: string | null;
	/** Time of day in brand's timezone (HH:MM, 24h format) — required when mode is "specificTime". If the target time has already passed today, resolves the next day. */
	time?: string | null;
};

/** Discount block settings. This object configures the offer only — the parts the recipient sees (code, redeem button, expiry) are separate role-tagged blocks in the parent block's 'components'. See the notes on the Block 'type' field for the roles each discount block type requires. An offer needs… */
export type OmnisendDiscount = {
	/** ID of the custom collection that the discount applies to */
	appliesToCustomCollectionID?: number | null;
	/** ID of the specific resource (product, collection) that the discount applies to */
	appliesToID?: number | null;
	/** Type of resource the discount applies to */
	appliesToResource?: string | null;
	/** ID of the smart collection that the discount applies to */
	appliesToSmartCollectionID?: number | null;
	/** Discount code customers use to apply the discount. In 'discount' (Shopify, BigCommerce) and 'dynamicDiscount' (WooCommerce) blocks the code is not taken from here: the store issues a unique code per recipient when the email is sent, and it replaces both this value and the text of the… */
	code?: string | null;
	/** Whether the discount can be combined with other discounts */
	combinesWith?: OmnisendEmailContentDiscountCombinesWith | null;
	/** Conditions that must be met for the discount to apply */
	discountConditions?: string | null;
	/** Discount type */
	discountType?: string | null;
	/** Number of days until the discount ends */
	endsIn?: string | null;
	/** When generating a discount code in integrated platforms, the discount can only be used once per customer */
	isAppliedOncePerCustomer?: boolean | null;
	/** Whether the redeem button is hidden in the discount block */
	isButtonHidden?: boolean | null;
	/** Whether the discount should be automatically applied to the order */
	isDiscountApplied?: boolean | null;
	/** Whether the discount should exclude items that are already on sale */
	isItemsOnSaleExcluded?: boolean | null;
	/** URL link for the discount */
	link?: string | null;
	/** Minimum order amount required for the discount to apply */
	minimumOrderAmount?: string | null;
	/** Text displayed to customers when they apply the discount */
	offerText?: string | null;
	/** Title of the discount */
	title?: string | null;
	/** Maximum number of times the discount can be used */
	usageLimit?: string | null;
	/** Date and time when the discount expires */
	validUntil?: string | null;
	/** Format of the expiration date */
	validUntilFormat?: string | null;
	/** Formatted expiration date */
	validUntilFormatted?: string | null;
	/** Fixed value of the discount */
	valueFixed?: string | null;
	/** Percentage value of the discount */
	valuePercentage?: string | null;
};

/** Discount combination rules. */
export type OmnisendDiscountCombinesWith = {
	/** Whether this discount is compatible with order discounts */
	isOrderCompatible?: boolean | null;
	/** Whether this discount is compatible with product discounts */
	isProductCompatible?: boolean | null;
	/** Whether this discount is compatible with shipping discounts. Not applicable when discount type is "freeShipping" — always false in that case. */
	isShippingCompatible?: boolean | null;
};

/** Discount expiry configuration. */
export type OmnisendDiscountExpiry = {
	/** Date format for displaying the expiration date in the discount message. Valid values: "MMM DD, YYYY", "YYYY-MM-DD", "DD/MM/YYYY". */
	dateFormat?: string | null;
	/** Expiration display text shown before the expiration date in the discount message, e.g. "expires on Jan 15, 2026" */
	expirationText?: string | null;
	/** Number of days until the discount expires */
	expiresInDays?: number | null;
};

/** Discount scope — determines what orders or products the discount applies to. The `conditions` field controls scoping behavior: - "allOrders": discount applies to all orders, no extra fields needed - "minimumOrderAmount": discount requires a minimum order total, `minimumOrderAmount` is required -… */
export type OmnisendDiscountScope = {
	/** Collection identifier. Required when conditions is "collection". */
	collectionID?: number | null;
	/** Collection type. Required when conditions is "collection". */
	collectionType?: string | null;
	/** Scope conditions type. */
	conditions?: string | null;
	/** Minimum order amount (currency string). Required when conditions is "minimumOrderAmount". */
	minimumOrderAmount?: string | null;
};

/** Discount configuration. The `type` field determines the discount behavior and how `value` is interpreted: - "percentage": `value` is a whole number string representing the percentage (1-100), e.g. "10" - "fixedAmount": `value` is a currency amount string, e.g. "9.99" - "freeShipping": `value` is… */
export type OmnisendDiscountSettings = {
	/** Discount combination rules. Controls whether this discount can be combined with other active discounts. Null when not applicable for the connected store. */
	combinesWith?: OmnisendDiscountCombinesWith | null;
	/** Discount expiry configuration. Present when the discount code has an expiration period. Null when the discount does not expire. */
	expiry?: OmnisendDiscountExpiry | null;
	/** Whether items already on sale are excluded from this discount. False when not applicable for the connected store. */
	isItemsOnSaleExcluded?: boolean | null;
	/** Discount scope — determines what orders or products the discount applies to. */
	scope?: OmnisendDiscountScope | null;
	/** Discount type. Determines discount behavior and how `value` is interpreted. */
	type?: string | null;
	/** Discount value. Interpretation depends on `type`: - percentage: whole number string "1" to "100" (e.g. "10" = 10% off) - fixedAmount: currency amount string (e.g. "9.99") - freeShipping: omitted */
	value?: string | null;
};

/** Form display type, controlling how the form is presented to visitors. `popup` is a modal centered over the page (highest visibility, best for offers and exit-intent); `flyout` is a compact panel anchored to a corner (non-intrusive, always-on signup); `embedded` renders inline within the host… */
export type OmnisendDisplayType = string;

/** Duration configuration for a relative delay. */
export type OmnisendDuration = {
	/** Number of time units to wait */
	amount?: number | null;
	/** Time unit */
	units?: string | null;
};

/** Dynamic list settings for repeating content blocks */
export type OmnisendDynamicList = {
	/** Number of columns in the list layout */
	columnCount?: number | null;
	/** Layout type for the list items */
	layout?: string | null;
	/** Data path for the list items source */
	listPath?: string | null;
	/** Maximum number of items to display */
	repetitionCount?: number | null;
};

/** Email content */
export type OmnisendEmail = {
	/** Email content unique identifier referencing the campaign's email design */
	contentID?: string | null;
	/** Email preheader text displayed after the subject line in the recipient's inbox */
	preheader?: string | null;
	/** Reply-to email address for recipient responses */
	replyToEmail?: string | null;
	/** Sender email address shown in the recipient's inbox */
	senderEmail?: string | null;
	/** Sender display name shown in the recipient's inbox */
	senderName?: string | null;
	/** Email subject line displayed in the recipient's inbox */
	subject?: string | null;
};

/** Block is a single element in the email template */
export type OmnisendEmailContentBlock = {
	button?: OmnisendButton | null;
	/** Components - the parts a block renders that are not covered by its own content field. Some blocks tag each part with a 'role', and which roles they need is decided by their 'type': a 'discount' block holds the code, the redeem button and the expiry date, a 'menu' block holds its items, a… */
	components?: Array<OmnisendBlockComponent> | null;
	countdown?: OmnisendCountdown | null;
	discount?: OmnisendDiscount | null;
	dynamicDiscount?: OmnisendDiscount | null;
	/** Deprecated: use HTMLCode instead. Read-only, will be removed in future versions. */
	html?: string | null;
	htmlCode?: OmnisendHTMLCode | null;
	/** Block unique identifier - must be unique within the template */
	id?: string | null;
	image?: OmnisendImage | null;
	lineSpace?: OmnisendLineSpace | null;
	logo?: OmnisendLogo | null;
	orderAddresses?: OmnisendOrderAddresses | null;
	orderProducts?: OmnisendOrderProducts | null;
	orderSummary?: OmnisendOrderSummary | null;
	orderTotal?: OmnisendOrderTotal | null;
	preheader?: OmnisendPreheader | null;
	product?: OmnisendProduct | null;
	/** Block role */
	role?: string | null;
	/** Secondary style preset ID - ID of the secondary style preset. Used for order blocks styling as smaller text style. */
	secondaryStylePresetID?: string | null;
	social?: OmnisendSocial | null;
	staticDiscount?: OmnisendDiscount | null;
	/** Style preset ID - ID of the style preset. Used for Button or Text block styling. ID must be present in template General Settings. */
	stylePresetID?: string | null;
	/** Style properties - style properties of the block */
	styleProperties?: OmnisendStyleProperties | null;
	/** Text content of the block - supports HTML formatting and personalization tags */
	text?: string | null;
	/** Block type. Notes: - 'html' is read-only and cannot be set on create/update. - 'menu' is a container block with no dedicated content field — items must be provided via 'components' as text blocks with role 'menu_text', and styling is configured through 'stylePresetID' and 'styleProperties'. -… */
	type?: string | null;
	video?: OmnisendVideo | null;
};

/** Email content */
export type OmnisendEmailContentContent = {
	/** Content created at (read-only) */
	createdAt?: string | null;
	/** Content general settings - global and template level styles */
	generalSettings?: OmnisendGeneralSettings | null;
	/** Content unique identifier (read-only) */
	id?: string | null;
	/** Content sections */
	sections?: Array<OmnisendSection> | null;
	/** Content updated at (read-only) */
	updatedAt?: string | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendEmailContentCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Discount combines with settings */
export type OmnisendEmailContentDiscountCombinesWith = {
	/** Whether the discount can be combined with order-level discounts */
	isOrderDiscountsCombined?: boolean | null;
	/** Whether the discount can be combined with product-specific discounts */
	isProductDiscountsCombined?: boolean | null;
	/** Whether the discount can be combined with shipping discounts */
	isShippingDiscountsCombined?: boolean | null;
};

/** Cursor-based pagination metadata */
export type OmnisendEmailContentPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendEmailContentCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Settings for the section */
export type OmnisendEmailContentSettings = {
	/** Background type - determines whether the section background is a color or image */
	backgroundType?: string | null;
	/** Custom fonts used in this section */
	customFonts?: Array<OmnisendCustomFont> | null;
	/** Dynamic list configuration for repeating content */
	dynamicList?: OmnisendDynamicList | null;
	/** Products to exclude from display when abandoned products section is used. Products are excluded from display if they are in the list of products that were abandoned by the contact. */
	excludeProducts?: Array<string> | null;
	/** Filter for the section - used to conditionally display content based on contact or event properties */
	filter?: OmnisendFilter | null;
	/** Whether to disable column stacking - used to display content in a single column */
	isColumnStackDisabled?: boolean | null;
	/** Whether to hide out of stock products from product sections */
	isOutOfStockHidden?: boolean | null;
	/** Whether to fit product images to the container - used to display product images in a single line */
	isProductImagesFitted?: boolean | null;
	/** Side by side product layout */
	sideBySideProductLayout?: string | null;
	/** Universal layout ID - ID of the universal layout the section references. If present, the section is a universal_layout reference whatever its type: it is returned with rows null, its content comes from the universal layout, and rows sent with it are rejected. Locked email content (a campaign… */
	universalLayoutID?: string | null;
};

/** Email open tracking consent record. */
export type OmnisendEmailOpenTrackingConsent = {
	/** Consent status */
	status?: string | null;
	/** Timestamp when the consent status was collected */
	statusDate?: string | null;
};

/** Event filter condition applied to event properties. */
export type OmnisendEventFilter = {
	/** Event property path to filter on */
	field?: string | null;
	/** Comparison operator */
	operator?: string | null;
	/** Filter value — type depends on the property */
	value?: OmnisendJsonValue | null;
};

/** Event filter group containing one or more event filters combined by a logical operator. */
export type OmnisendEventFilterGroup = {
	/** Event filters within this group */
	filters?: Array<OmnisendEventFilter> | null;
	/** Logical operator combining filters within this group */
	logicalOperator?: string | null;
};

/** A single logical event with one schema variant. A logical event appears as multiple elements when its origins have different property structures (e.g. schema family omnisend vs shopify). */
export type OmnisendEventItem = {
	/** Human-readable label for the event */
	displayName?: string | null;
	/** True when the event schema was declared via the write API rather than inferred from the global lexicon or scraped traffic */
	explicitlyDefined?: boolean | null;
	/** Machine-readable event name (e.g. "placed order") */
	name?: string | null;
	/** List of origins that contributed to this event variant */
	origins?: Array<string> | null;
	/** Nested tree of properties belonging to this event variant, keyed by property name. Omitted when the request did not set includeProperties=true. */
	properties?: Record<string, OmnisendPropertyNode> | null;
};

/** Root response envelope for all event metadata endpoints. */
export type OmnisendEventsResponse = {
	/** List of event metadata entries */
	events?: Array<OmnisendEventItem> | null;
};

/** Exit condition that removes contacts from the automation workflow when a matching event occurs. */
export type OmnisendExitCondition = {
	/** Event name that triggers the exit */
	event?: string | null;
	/** Event filter group for the exit condition */
	filterGroup?: OmnisendEventFilterGroup | null;
	/** Integration platform that generated the event (e.g. "shopify", "omnisend", "api"). Each event supports a specific set of origins depending on the brand's e-commerce platform. Empty for built-in trigger events and the "subscribed to marketing" event */
	origin?: string | null;
};

/** A single field validation failure within a validation error response. */
export type OmnisendFieldError = {
	/** Error code indicating the type of failure */
	code?: string | null;
	/** Dot-separated path to the field that failed validation */
	field?: string | null;
	/** Human-readable explanation of what is wrong with the field value */
	message?: string | null;
};

/** Filter for conditional display of content */
export type OmnisendFilter = {
	/** Filter operator - logical operator to combine multiple filter rules */
	operator?: string | null;
	/** Filter rules - array of filter rules */
	rules?: Array<OmnisendRule> | null;
};

/** Filter property for conditional display of content */
export type OmnisendFilterProperty = {
	/** Filter property unique identifier */
	id?: string | null;
	/** Indicates whether the property is a built-in system property (true) or a user-defined custom property (false). */
	isSystem?: boolean | null;
	/** Filter property name */
	name?: string | null;
	/** Filter property type */
	type?: string | null;
};

/** Form resource returned after creation */
export type OmnisendForm = {
	/** A/B setup unique identifier the form belongs to (read-only) */
	abSetupID?: string | null;
	/** A/B test status of the form (read-only) */
	abStatus?: OmnisendAbStatus | null;
	/** Auto-redirect configuration applied after submission */
	autoRedirect?: OmnisendFormAutoRedirect | null;
	/** Click-outside-to-close behavior */
	clickOutside?: OmnisendFormClickOutside | null;
	/** Tags applied to contacts who submit the form */
	contactTags?: Array<string> | null;
	/** Form content */
	content?: OmnisendFormContentResponse | null;
	/** Form creation timestamp (read-only) */
	createdAt?: string | null;
	/** Form disable timestamp (read-only) */
	disabledAt?: string | null;
	/** Form display type */
	displayType?: OmnisendDisplayType | null;
	/** Double opt-in configuration */
	doubleOptIn?: OmnisendFormDoubleOptIn | null;
	/** Form enable timestamp (read-only) */
	enabledAt?: string | null;
	/** Form unique identifier (read-only) */
	id?: string | null;
	/** Form launch timestamp (read-only) */
	launchedAt?: string | null;
	/** Form name */
	name?: string | null;
	/** reCAPTCHA protection settings */
	recaptcha?: OmnisendFormRecaptchaSettings | null;
	/** Social media sharing metadata */
	socialMediaSharing?: OmnisendFormSocialMediaSharingResponse | null;
	/** Form status (read-only) */
	status?: OmnisendStatus | null;
	/** Form targeting rules */
	targeting?: OmnisendFormTargeting | null;
	/** Form last update timestamp (read-only) */
	updatedAt?: string | null;
};

/** A/B setup reports for a form; both running and completed setups are included */
export type OmnisendFormAbSetupReportsResponse = {
	/** A/B setup reports; empty when the form has none (read-only) */
	reports?: Array<OmnisendAbSetupReport> | null;
};

/** Subscriber audience targeting. */
export type OmnisendFormAudience = {
	/** Subscriber audience the form targets */
	type?: OmnisendFormAudienceType | null;
};

/** Subscriber audience type. */
export type OmnisendFormAudienceType = string;

/** Auto-redirect configuration shown after a successful submission. */
export type OmnisendFormAutoRedirect = {
	/** Text shown during the redirect countdown */
	countdownText?: string | null;
	/** Delay before redirecting, in milliseconds. Range: 1000-60000 */
	delayMs?: number | null;
	/** Whether auto-redirect is enabled */
	isEnabled?: boolean | null;
	/** Whether the redirect opens in a new tab */
	shouldOpenInNewTab?: boolean | null;
	/** URL to redirect to after submission */
	url?: string | null;
};

/** Background image returned in a form response. */
export type OmnisendFormBackgroundImageResponse = {
	/** Background image fit */
	fit?: string | null;
	/** Background image padding in pixels or percent */
	padding?: string | null;
	/** Background image position */
	position?: string | null;
	/** Background image size in pixels or percent */
	size?: string | null;
	/** URL to the background image */
	url?: string | null;
};

/** A single content block returned in a form response. */
export type OmnisendFormBlockResponse = {
	/** Button block configuration, present when the block type is button */
	button?: OmnisendFormButton | null;
	/** Checkbox selection field configuration, present when the block type is checkboxField */
	checkboxField?: OmnisendFormCheckboxField | null;
	/** Countdown timer block configuration, present when the block type is countdownTimer */
	countdownTimer?: OmnisendFormCountdownTimer | null;
	/** Date input field configuration, present when the block type is dateField */
	dateField?: OmnisendFormDateField | null;
	/** Discount block configuration, present when the block type is discount */
	discount?: OmnisendFormDiscountResponse | null;
	/** Dropdown selection field configuration, present when the block type is dropdownField */
	dropdownField?: OmnisendFormDropdownField | null;
	/** Email input field configuration, present when the block type is emailField */
	emailField?: OmnisendFormEmailField | null;
	/** Block unique identifier (read-only) */
	id?: string | null;
	/** Image block configuration, present when the block type is image */
	image?: OmnisendFormImageResponse | null;
	/** Generic profile input field configuration, present when the block type is inputField */
	inputField?: OmnisendFormInputField | null;
	/** Legal consent block configuration, present when the block type is legal */
	legal?: OmnisendFormLegal | null;
	/** Line or space block configuration, present when the block type is lineSpace */
	lineSpace?: OmnisendFormLineSpace | null;
	/** Mystery box game block configuration, present when the block type is mysteryBox. Requires Forms Plus (included in the Pro plan or as an add-on). */
	mysteryBox?: OmnisendFormMysteryBoxResponse | null;
	/** Phone number input field configuration, present when the block type is phoneNumberField */
	phoneNumberField?: OmnisendFormPhoneNumberField | null;
	/** Radio selection field configuration, present when the block type is radioField */
	radioField?: OmnisendFormRadioField | null;
	/** Semantic role of the block within the form */
	role?: string | null;
	/** Scratch card game block configuration, present when the block type is scratchCard. Requires Forms Plus (included in the Pro plan or as an add-on). */
	scratchCard?: OmnisendFormScratchCardResponse | null;
	/** Identifier of the style preset applied to the block */
	stylePresetId?: string | null;
	/** Block style properties */
	styleProperties?: OmnisendFormStyleProperties | null;
	/** Text block content, present when the block type is text */
	text?: string | null;
	/** Content block type */
	type?: string | null;
	/** Wheel-of-fortune block configuration, present when the block type is wheelOfFortune */
	wheelOfFortune?: OmnisendFormWheelOfFortuneResponse | null;
};

/** Form body (container) presentation. */
export type OmnisendFormBody = {
	/** Body background color */
	backgroundColor?: string | null;
	/** Body border color */
	borderColor?: string | null;
	/** Body border radius in pixels */
	borderRadius?: string | null;
	/** Body border style */
	borderStyle?: string | null;
	/** Body border width in pixels */
	borderWidth?: string | null;
};

/** Button block configuration. */
export type OmnisendFormButton = {
	/** Custom contact property the button writes to */
	customProfileField?: string | null;
	/** Whether the button spans the full width */
	isFullWidth?: boolean | null;
	/** Whether clicking the button writes a value to a custom contact property, honored only for submit buttons */
	isMappedToCustomProperty?: boolean | null;
	/** URL opened when the button is clicked */
	link?: string | null;
	/** Button label text */
	text?: string | null;
	/** Button behavior when clicked */
	type?: string | null;
	/** Value written to the custom contact property when the button is clicked */
	value?: string | null;
};

/** Named button style preset */
export type OmnisendFormButtonPreset = {
	/** Preset identifier */
	id?: string | null;
	/** Preset name */
	name?: string | null;
	/** Styling applied to the preset */
	styles?: OmnisendFormButtonStyle | null;
};

/** Styling applied to a button preset. */
export type OmnisendFormButtonStyle = {
	/** Button background color */
	backgroundColor?: string | null;
	/** Button border color */
	borderColor?: string | null;
	/** Button border radius in pixels. Range: 0-50 */
	borderRadius?: string | null;
	/** Button border style */
	borderStyle?: string | null;
	/** Button border width in pixels */
	borderWidth?: string | null;
	/** Button text color */
	color?: string | null;
	/** Button font family */
	fontFamily?: string | null;
	/** Button font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Button font style */
	fontStyle?: string | null;
	/** Button font weight */
	fontWeight?: string | null;
	/** Button background color on hover */
	hoverBackgroundColor?: string | null;
	/** Button border color on hover */
	hoverBorderColor?: string | null;
	/** Button text color on hover */
	hoverColor?: string | null;
	/** Bottom padding in pixels */
	paddingBottom?: string | null;
	/** Left padding in pixels */
	paddingLeft?: string | null;
	/** Right padding in pixels */
	paddingRight?: string | null;
	/** Top padding in pixels */
	paddingTop?: string | null;
	/** Button text alignment */
	textAlign?: string | null;
	/** Button text decoration */
	textDecoration?: string | null;
};

/** Shopping cart targeting rules. Available only for Shopify stores; requests for other platforms are rejected. Each threshold means "at least"; when both are set, both must hold. */
export type OmnisendFormCartTargeting = {
	/** Minimum number of items in the cart */
	itemCount?: number | null;
	/** Minimum cart value in minor currency units (e.g. 5000 means 50.00). Currency-agnostic */
	value?: number | null;
};

/** Checkbox selection field configuration. */
export type OmnisendFormCheckboxField = {
	/** Custom contact property the input maps to */
	customProfileField?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOption> | null;
	/** Contact profile field the input maps to */
	profileField?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Click-outside-to-close behavior configuration. */
export type OmnisendFormClickOutside = {
	/** Whether clicking outside the form closes it */
	isEnabled?: boolean | null;
};

/** Close button appearance. */
export type OmnisendFormCloseButton = {
	/** Close button background color */
	backgroundColor?: string | null;
	/** Close button color */
	color?: string | null;
	/** Whether the close button is visible */
	isVisible?: boolean | null;
	/** Distance from the chosen corner in px. When omitted or null on update, the stored value is kept */
	margins?: OmnisendFormCloseButtonMargins | null;
	/** Top corner of the form the close button sits in. Defaults to right. When omitted or null on update, the stored value is kept */
	position?: string | null;
};

/** Close button margins for one device, in px. Send all of top, left and right; an omitted value is stored as 0. */
export type OmnisendFormCloseButtonMarginValues = {
	/** Distance from the left edge of the form, applied when position is left */
	left?: number | null;
	/** Distance from the right edge of the form, applied when position is right */
	right?: number | null;
	/** Distance from the top edge of the form */
	top?: number | null;
};

/** Close button margins per device, in px. Only top and the side matching position are applied. When sent, the whole object replaces the stored margins. */
export type OmnisendFormCloseButtonMargins = {
	/** Desktop margins */
	desktop?: OmnisendFormCloseButtonMarginValues | null;
	/** Mobile margins (600px wide and below). When omitted, desktop margins are used */
	mobile?: OmnisendFormCloseButtonMarginValues | null;
};

/** A column within a row returned in a form response. */
export type OmnisendFormColumnResponse = {
	/** Content blocks contained in the column */
	blocks?: Array<OmnisendFormBlockResponse> | null;
	/** Column unique identifier (read-only) */
	id?: string | null;
	/** Column style properties */
	styleProperties?: OmnisendFormStyleProperties | null;
	/** Column width in pixels or percent */
	width?: string | null;
};

/** Contact who submitted a form */
export type OmnisendFormContact = {
	/** Contact street address (read-only) */
	address?: string | null;
	/** Contact birthday in "Mon Jan 02, 2006" format (read-only) */
	birthday?: string | null;
	/** Contact city (read-only) */
	city?: string | null;
	/** Contact country name (read-only) */
	country?: string | null;
	/** Custom properties collected on the form (read-only) */
	customProperties?: Array<OmnisendCustomProperty> | null;
	/** Discount code assigned to the contact on this form (read-only) */
	discount?: string | null;
	/** Contact email address (read-only) */
	email?: string | null;
	/** Contact first name (read-only) */
	firstName?: string | null;
	/** Contact gender (read-only) */
	gender?: string | null;
	/** Contact unique identifier (read-only) */
	id?: string | null;
	/** Contact last name (read-only) */
	lastName?: string | null;
	/** Contact mobile phone number in E.164 format (read-only) */
	phoneNumber?: string | null;
	/** Contact state or region (read-only) */
	state?: string | null;
	/** Signup timestamp on this form; may be later than the contact's creation time (read-only) */
	submittedAt?: string | null;
	/** Contact postal code (read-only) */
	zipCode?: string | null;
};

/** Paginated list of contacts who signed up through a form, ordered by contact creation time */
export type OmnisendFormContactListResponse = {
	/** Contacts who submitted the form (read-only) */
	contacts?: Array<OmnisendFormContact> | null;
	/** Pagination information (read-only) */
	paging?: OmnisendFormsPagingResponse | null;
};

/** Form content returned in a form response. */
export type OmnisendFormContentResponse = {
	/** General presentation settings shared across the form */
	generalSettings?: OmnisendFormGeneralSettingsResponse | null;
	/** Form steps, each a list of sections */
	steps?: Array<OmnisendFormStepResponse> | null;
	/** Step shown when the visitor is already subscribed */
	subscribedStep?: OmnisendFormStepResponse | null;
	/** Step shown on the success page */
	successStep?: OmnisendFormStepResponse | null;
	/** Teaser shown before or after the form */
	teaser?: OmnisendFormTeaser | null;
	/** Step shown when the form is unavailable */
	unavailablePageStep?: OmnisendFormStepResponse | null;
};

/** Form container dimensions and overlay color. */
export type OmnisendFormContentSettings = {
	/** Overlay color behind the form */
	color?: string | null;
	/** Form container width in pixels */
	width?: string | null;
};

/** Countdown timer block configuration. */
export type OmnisendFormCountdownTimer = {
	/** Countdown length in seconds, used for personalized timers */
	duration?: number | null;
	/** Countdown end timestamp (RFC 3339), used for fixed timers */
	endsAt?: string | null;
	/** Digit mask the timer renders; omitted means DD:HH:MM:SS */
	format?: string | null;
	/** Countdown mode: fixed ends at a specific date, personalized counts down per visitor */
	type?: string | null;
};

/** Country targeting with optional state filtering */
export type OmnisendFormCountry = {
	/** ISO 3166-1 alpha-2 country code */
	code?: string | null;
	/** Country name */
	name?: string | null;
	/** States or regions within the country */
	states?: Array<OmnisendFormState> | null;
};

/** Date input field configuration. */
export type OmnisendFormDateField = {
	/** Custom contact property the input maps to */
	customProfileField?: string | null;
	/** Message shown when the entered value is invalid */
	errorMessage?: string | null;
	/** Accepted date input format */
	format?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Contact profile field the input maps to */
	profileField?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Device targeting for a form. */
export type OmnisendFormDevice = string;

/** Discount block configuration. */
export type OmnisendFormDiscountResponse = {
	/** Static discount code awarded to the visitor */
	code?: string | null;
	/** Confirmation message shown after the visitor copies the code */
	copiedMessage?: string | null;
	/** Whether a confirmation message is shown after the visitor copies the code */
	copiedMessageEnabled?: boolean | null;
	/** (read-only) Unique discount identifier, present when type is unique */
	discountID?: string | null;
	/** Discount source: static code, wheel of fortune, game, or a unique discount attached in the form editor */
	type?: string | null;
};

/** Display trigger configuration controlling when a form appears. */
export type OmnisendFormDisplay = {
	/** Scroll depth percentage that triggers the form. Range: 0-100 */
	afterScrollDown?: number | null;
	/** Seconds elapsed on the page before the form appears */
	afterSeconds?: number | null;
	/** Number of viewed pages before the form appears */
	afterViewedPageCount?: number | null;
	/** Custom trigger mode activating the form */
	customTrigger?: string | null;
	/** Whether the form appears on exit intent */
	isExitIntentEnabled?: boolean | null;
};

/** Double opt-in configuration. */
export type OmnisendFormDoubleOptIn = {
	/** Confirmation page content */
	confirmationPage?: OmnisendFormDoubleOptInConfirmationPage | null;
	/** Confirmation redirect settings */
	confirmationRedirect?: OmnisendFormDoubleOptInConfirmationRedirect | null;
	/** Confirmation email content */
	email?: OmnisendFormDoubleOptInEmail | null;
	/** Whether double opt-in is enabled */
	isEnabled?: boolean | null;
};

/** Double opt-in confirmation page content. */
export type OmnisendFormDoubleOptInConfirmationPage = {
	/** Text shown while the page auto-redirects */
	autoRedirectText?: string | null;
	/** Confirmation button label */
	buttonText?: string | null;
	/** Confirmation page body content */
	content?: string | null;
	/** Whether the page auto-redirects after confirmation */
	isAutoRedirectEnabled?: boolean | null;
	/** Whether the confirmation button is shown */
	isButtonVisible?: boolean | null;
	/** Confirmation page title */
	title?: string | null;
	/** URL to redirect to after confirmation */
	url?: string | null;
};

/** Double opt-in confirmation redirect settings. */
export type OmnisendFormDoubleOptInConfirmationRedirect = {
	/** Whether confirmation redirect is enabled */
	isEnabled?: boolean | null;
	/** URL to redirect to after confirmation */
	url?: string | null;
};

/** Double opt-in confirmation email content. */
export type OmnisendFormDoubleOptInEmail = {
	/** Confirmation button label */
	confirmationButton?: string | null;
	/** Email body content */
	content?: string | null;
	/** Email headline */
	headline?: string | null;
	/** Verified double opt-in sender email */
	sendersEmail?: string | null;
	/** Sender name shown on the email */
	sendersName?: string | null;
	/** Email subject line */
	subject?: string | null;
};

/** Dropdown selection field configuration. */
export type OmnisendFormDropdownField = {
	/** Custom contact property the input maps to */
	customProfileField?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOption> | null;
	/** Placeholder text shown in the field */
	placeholder?: string | null;
	/** Contact profile field the input maps to */
	profileField?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Email input field configuration. */
export type OmnisendFormEmailField = {
	/** Message shown when the entered value is invalid */
	errorMessage?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Placeholder text shown in the field */
	placeholder?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Styling for field labels. */
export type OmnisendFormFieldLabelStyles = {
	/** Label color */
	color?: string | null;
	/** Bottom padding in pixels */
	paddingBottom?: string | null;
	/** Left padding in pixels */
	paddingLeft?: string | null;
	/** Right padding in pixels */
	paddingRight?: string | null;
	/** Top padding in pixels */
	paddingTop?: string | null;
};

/** Selectable option for dropdown, radio, or checkbox fields */
export type OmnisendFormFieldOption = {
	/** Option label shown to the visitor */
	label?: string | null;
	/** Option value submitted with the form */
	value?: string | null;
};

/** Styling for field placeholders. */
export type OmnisendFormFieldPlaceholderStyles = {
	/** Placeholder color */
	color?: string | null;
};

/** Styling for the input field itself. */
export type OmnisendFormFieldStyle = {
	/** Field background color */
	backgroundColor?: string | null;
	/** Field border color */
	borderColor?: string | null;
	/** Field border radius in pixels. Range: 0-50 */
	borderRadius?: string | null;
	/** Field border style */
	borderStyle?: string | null;
	/** Field border width in pixels */
	borderWidth?: string | null;
	/** Field text color */
	color?: string | null;
	/** Bottom padding in pixels */
	paddingBottom?: string | null;
	/** Left padding in pixels */
	paddingLeft?: string | null;
	/** Right padding in pixels */
	paddingRight?: string | null;
	/** Top padding in pixels */
	paddingTop?: string | null;
};

/** Styling shared across form input fields. */
export type OmnisendFormFieldStyles = {
	/** Validation error text color */
	errorColor?: string | null;
	/** Styling for the input field itself */
	field?: OmnisendFormFieldStyle | null;
	/** Field font family */
	fontFamily?: string | null;
	/** Field font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Field font style */
	fontStyle?: string | null;
	/** Field font weight */
	fontWeight?: string | null;
	/** Styling for field labels */
	label?: OmnisendFormFieldLabelStyles | null;
	/** Styling for field placeholders */
	placeholder?: OmnisendFormFieldPlaceholderStyles | null;
	/** Field text alignment */
	textAlign?: string | null;
	/** Field text decoration */
	textDecoration?: string | null;
};

/** Frequency configuration for repeat form displays. */
export type OmnisendFormFrequency = {
	/** Time unit for the display frequency */
	type?: string | null;
	/** Number of time units between repeat displays */
	value?: number | null;
};

/** Mystery box box */
export type OmnisendFormGameItem = {
	/** Alternative text for the box image */
	altText?: string | null;
	/** Box background color */
	backgroundColor?: string | null;
	/** Box unique identifier (read-only) */
	id?: string | null;
	/** URL of the image shown on the box, used when type is image */
	imageUrl?: string | null;
	/** Text shown on the box, used when type is text */
	text?: string | null;
	/** Box text color */
	textColor?: string | null;
	/** Box content type */
	type?: string | null;
};

/** Game item appearance */
export type OmnisendFormGameItemStyle = {
	/** Border color */
	borderColor?: string | null;
	/** Corner radius in pixels. Range: 0-50 */
	borderRadius?: string | null;
	/** Border line style */
	borderStyle?: string | null;
	/** Border width in pixels. Range: 0-60 */
	borderWidth?: string | null;
	/** Font family */
	fontFamily?: string | null;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Item width percentage. Range: 30-100 */
	width?: number | null;
};

/** Game reward as stored */
export type OmnisendFormGameRewardResponse = {
	/** Static discount code awarded to the visitor */
	discountCode?: string | null;
	/** (read-only) Unique discount identifier, present when discountType is unique */
	discountID?: string | null;
	/** Discount source: static, or unique when attached to a unique discount in the Omnisend app */
	discountType?: string | null;
	/** Reward unique identifier */
	id?: string | null;
	/** Reward name */
	name?: string | null;
};

/** General presentation settings returned in a form response. */
export type OmnisendFormGeneralSettingsResponse = {
	/** Background image configuration */
	backgroundImage?: OmnisendFormBackgroundImageResponse | null;
	/** Form body presentation */
	body?: OmnisendFormBody | null;
	/** Named button style presets */
	buttonPresets?: Array<OmnisendFormButtonPreset> | null;
	/** Close button appearance */
	closeButton?: OmnisendFormCloseButton | null;
	/** Form container dimensions and overlay color */
	content?: OmnisendFormContentSettings | null;
	/** Styling shared across form input fields */
	fieldStyles?: OmnisendFormFieldStyles | null;
	/** Link color settings */
	link?: OmnisendFormLink | null;
	/** Form position on the page */
	position?: string | null;
	/** Named text style presets */
	textPresets?: Array<OmnisendFormTextPreset> | null;
};

/** Image block returned in a form response. */
export type OmnisendFormImageResponse = {
	/** Alternative text for the image */
	altText?: string | null;
	/** Image height in pixels */
	height?: number | null;
	/** URL opened when the image is clicked */
	link?: string | null;
	/** Rendered image width in pixels */
	resizeWidth?: number | null;
	/** URL to the image */
	url?: string | null;
	/** Image width in pixels */
	width?: number | null;
};

/** Generic profile input field configuration. */
export type OmnisendFormInputField = {
	/** Custom contact property the input maps to */
	customProfileField?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Placeholder text shown in the field */
	placeholder?: string | null;
	/** Contact profile field the input maps to */
	profileField?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Legal consent block configuration. */
export type OmnisendFormLegal = {
	/** Consent description */
	description?: string | null;
	/** Consent label shown next to the checkbox */
	label?: string | null;
	/** URL to the privacy policy */
	link?: string | null;
	/** Message shown when consent is required but not given */
	requiredMessage?: string | null;
	/** Consent type the block collects */
	type?: string | null;
};

/** Line or space block configuration. */
export type OmnisendFormLineSpace = {
	/** Divider border thickness in pixels (1-60) when type is line, or blank space height in pixels (12-240) when type is space */
	height?: number | null;
	/** Whether the block renders a divider line or blank space */
	type?: string | null;
	/** Divider width as a percentage (1-100), only applicable when type is line */
	width?: number | null;
};

/** Link color settings. */
export type OmnisendFormLink = {
	/** Link color */
	color?: string | null;
};

/** Geographic location targeting. */
export type OmnisendFormLocationTargeting = {
	/** Countries the form is hidden in */
	excludes?: Array<OmnisendFormCountry> | null;
	/** Countries the form is shown in */
	includes?: Array<OmnisendFormCountry> | null;
};

/** Mystery box game returned in a form response. */
export type OmnisendFormMysteryBoxResponse = {
	/** Box appearance */
	boxStyle?: OmnisendFormGameItemStyle | null;
	/** The three boxes shown to the visitor */
	boxes?: Array<OmnisendFormGameItem> | null;
	/** Rewards. Exactly one reward is supported */
	rewards?: Array<OmnisendFormGameRewardResponse> | null;
};

/** Time-bucketed statistics for a form, one row per period of the granularity in effect */
export type OmnisendFormPeriodicReportResponse = {
	/** Form unique identifier (read-only) */
	formID?: string | null;
	/** Time bucket size used for the rows (read-only) */
	granularity?: string | null;
	/** Statistics rows, one per time bucket (read-only) */
	rows?: Array<OmnisendFormPeriodicRow> | null;
};

/** Statistics for a single time bucket */
export type OmnisendFormPeriodicRow = {
	/** Bucket start; format depends on granularity: RFC3339 for hour, date for day and week, YYYY-MM for month, YYYY for year (read-only) */
	period?: string | null;
	/** Statistics for the bucket (read-only) */
	statistics?: OmnisendFormReportStatistics | null;
};

/** Country restrictions for the phone number field. Empty or omitted means any supported country is allowed. */
export type OmnisendFormPhoneNumberCountryCodes = {
	/** These ISO 3166-1 alpha-2 country codes are not selectable */
	excludes?: Array<string> | null;
	/** Only these ISO 3166-1 alpha-2 country codes are selectable */
	includes?: Array<string> | null;
};

/** Phone number input field configuration. */
export type OmnisendFormPhoneNumberField = {
	/** Restricts which countries' dial codes are selectable */
	countryCodes?: OmnisendFormPhoneNumberCountryCodes | null;
	/** Default ISO 3166-1 alpha-2 country code */
	defaultCountryCode?: string | null;
	/** Message shown when the entered value is invalid */
	errorMessage?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Placeholder text shown in the field */
	placeholder?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** Radio selection field configuration. */
export type OmnisendFormRadioField = {
	/** Custom contact property the input maps to */
	customProfileField?: string | null;
	/** Whether the field is required */
	isRequired?: boolean | null;
	/** Field label */
	label?: string | null;
	/** Selectable options */
	options?: Array<OmnisendFormFieldOption> | null;
	/** Contact profile field the input maps to */
	profileField?: string | null;
	/** Message shown when the required field is left empty */
	requiredMessage?: string | null;
};

/** reCAPTCHA protection settings. */
export type OmnisendFormRecaptchaSettings = {
	/** Whether reCAPTCHA protection is enabled */
	isEnabled?: boolean | null;
};

/** Aggregated form performance counters. Views, interactions and submits form a funnel, so each counter is less than or equal to the previous one. */
export type OmnisendFormReportStatistics = {
	/** Number of views where the visitor engaged with the form without necessarily completing it (read-only) */
	interactions?: number | null;
	/** Number of contacts gained through the form; may differ from submits (read-only) */
	signups?: number | null;
	/** Number of submissions of the form (read-only) */
	submits?: number | null;
	/** Number of times the form was displayed to a visitor (read-only) */
	views?: number | null;
};

/** Responsive teaser margins. */
export type OmnisendFormResponsiveTeaserStyle = {
	/** Bottom margin in pixels */
	marginBottom?: string | null;
	/** Left margin in pixels */
	marginLeft?: string | null;
	/** Right margin in pixels */
	marginRight?: string | null;
	/** Top margin in pixels */
	marginTop?: string | null;
};

/** A row within a section returned in a form response. */
export type OmnisendFormRowResponse = {
	/** Columns contained in the row */
	columns?: Array<OmnisendFormColumnResponse> | null;
	/** Row unique identifier (read-only) */
	id?: string | null;
	/** Row style properties */
	styleProperties?: OmnisendFormStyleProperties | null;
};

/** Scheduling window during which a form is active. */
export type OmnisendFormScheduling = {
	/** Scheduling window end timestamp (RFC 3339). Must be later than startsAt. */
	endsAt?: string | null;
	/** Scheduling window start timestamp (RFC 3339) */
	startsAt?: string | null;
};

/** Scratch card game returned in a form response. */
export type OmnisendFormScratchCardResponse = {
	/** Scratch brush size. Range: 5-80 */
	brushSize?: number | null;
	/** Card appearance */
	cardStyle?: OmnisendFormScratchCardStyle | null;
	/** Cover image the visitor scratches off */
	cover?: OmnisendFormScratchCover | null;
	/** Reward area background color under the cover */
	prizeBackgroundColor?: string | null;
	/** Reward name text color under the cover */
	prizeTextColor?: string | null;
	/** Percentage of the cover scratched before the reward is fully revealed. Range: 10-90 */
	revealThreshold?: number | null;
	/** Rewards. Exactly one reward is supported */
	rewards?: Array<OmnisendFormGameRewardResponse> | null;
};

/** Scratch card appearance */
export type OmnisendFormScratchCardStyle = {
	/** Border color */
	borderColor?: string | null;
	/** Corner radius in pixels. Range: 0-50 */
	borderRadius?: string | null;
	/** Border width in pixels. Range: 0-60 */
	borderWidth?: string | null;
	/** Font family */
	fontFamily?: string | null;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Card width percentage. Range: 30-100 */
	width?: number | null;
};

/** Scratch card cover image */
export type OmnisendFormScratchCover = {
	/** Alternative text for the cover image */
	altText?: string | null;
	/** Cover background color */
	backgroundColor?: string | null;
	/** Cover unique identifier (read-only) */
	id?: string | null;
	/** URL of the cover image */
	imageUrl?: string | null;
};

/** Section background image returned in a form response. */
export type OmnisendFormSectionBackgroundImageResponse = {
	/** Background image fit */
	fit?: string | null;
	/** URL to the background image */
	url?: string | null;
};

/** A section of a form step returned in a form response. */
export type OmnisendFormSectionResponse = {
	/** Section background image */
	backgroundImage?: OmnisendFormSectionBackgroundImageResponse | null;
	/** Section unique identifier (read-only) */
	id?: string | null;
	/** Rows contained in the section */
	rows?: Array<OmnisendFormRowResponse> | null;
	/** Section style properties */
	styleProperties?: OmnisendFormStyleProperties | null;
};

/** Segment membership targeting. */
export type OmnisendFormSegments = {
	/** Segment identifiers the form is hidden for */
	excludes?: Array<string> | null;
	/** Segment identifiers the form is shown for */
	includes?: Array<string> | null;
};

/** Social media sharing metadata returned in a form response. */
export type OmnisendFormSocialMediaSharingResponse = {
	/** Shared preview description */
	description?: string | null;
	/** URL to the shared preview image */
	imageUrl?: string | null;
	/** Shared preview title */
	title?: string | null;
};

/** Traffic-source targeting rules. */
export type OmnisendFormSourceTargeting = {
	/** Traffic sources the form is hidden for */
	excludes?: Array<OmnisendFormSourceType> | null;
	/** Traffic sources the form is shown for */
	includes?: Array<OmnisendFormSourceType> | null;
};

/** Traffic source for form targeting rules. */
export type OmnisendFormSourceType = string;

/** State or region within a country */
export type OmnisendFormState = {
	/** State or region code */
	code?: string | null;
	/** State or region name */
	name?: string | null;
};

/** Aggregated form performance counters. Views, interactions and submits form a funnel, so each counter is less than or equal to the previous one. */
export type OmnisendFormStatistics = {
	/** Number of views where the visitor engaged with the form without necessarily completing it (read-only) */
	interactions?: number | null;
	/** Number of contacts gained through the form; may differ from submits (read-only) */
	signups?: number | null;
	/** Number of submissions of the form (read-only) */
	submits?: number | null;
	/** Number of times the form was displayed to a visitor (read-only) */
	views?: number | null;
};

export type OmnisendFormStatisticsByDevice = Record<
	string,
	OmnisendFormReportStatistics
>;

/** A step of a form returned in a form response. */
export type OmnisendFormStepResponse = {
	/** Sections contained in the step */
	sections?: Array<OmnisendFormSectionResponse> | null;
};

/** Style properties shared by sections, rows, columns and blocks. */
export type OmnisendFormStyleProperties = {
	/** Horizontal alignment */
	alignment?: string | null;
	/** Background color */
	backgroundColor?: string | null;
	/** CSS border shorthand */
	border?: string | null;
	/** Border radius in pixels */
	borderRadius?: string | null;
	/** Primary color */
	color?: string | null;
	/** Divider color */
	dividerColor?: string | null;
	/** Font family */
	fontFamily?: string | null;
	/** Font size in pixels. Range: 8-96, except legal blocks which allow a minimum of 4 */
	fontSize?: string | null;
	/** Line height */
	lineHeight?: string | null;
	/** Opacity. Range: 0-1 */
	opacity?: number | null;
	/** Bottom padding in pixels */
	paddingBottom?: string | null;
	/** Left padding in pixels */
	paddingLeft?: string | null;
	/** Right padding in pixels */
	paddingRight?: string | null;
	/** Top padding in pixels */
	paddingTop?: string | null;
	/** Secondary color */
	secondaryColor?: string | null;
	/** Vertical alignment */
	verticalAlign?: string | null;
};

/** Total and per-device statistics for a form. Device buckets without activity in the range are omitted. */
export type OmnisendFormSummaryReportResponse = {
	/** Form unique identifier (read-only) */
	formID?: string | null;
	/** Total statistics across all devices (read-only) */
	statistics?: OmnisendFormReportStatistics | null;
	/** Statistics grouped by device type: desktop, mobile, tablet (read-only) */
	statisticsByDevice?: OmnisendFormStatisticsByDevice | null;
};

/** Targeting rules controlling when and to whom a form is shown. */
export type OmnisendFormTargeting = {
	/** Subscriber audience targeting */
	audience?: OmnisendFormAudience | null;
	/** Shopping cart threshold targeting. Only available for Shopify stores */
	cart?: OmnisendFormCartTargeting | null;
	/** Device the form is limited to */
	device?: OmnisendFormDevice | null;
	/** Display trigger configuration */
	display?: OmnisendFormDisplay | null;
	/** Repeat-display frequency configuration */
	frequency?: OmnisendFormFrequency | null;
	/** Whether targeting is limited to back-in-stock visitors */
	isBackInStock?: boolean | null;
	/** Shows the form one extra time when the visitor is most engaged. Shown in the form builder as "Personalized triggers". Works on popup, flyout and fullscreen forms; ignored on other display types, back-in-stock forms and forms shown only by a custom trigger. Requires Forms Plus (included in the… */
	isPersonalisedTargeting?: boolean | null;
	/** Geographic location targeting */
	location?: OmnisendFormLocationTargeting | null;
	/** Active scheduling window */
	scheduling?: OmnisendFormScheduling | null;
	/** Segment membership targeting */
	segments?: OmnisendFormSegments | null;
	/** Traffic-source targeting */
	source?: OmnisendFormSourceTargeting | null;
	/** Page URL targeting rules */
	url?: OmnisendFormURLTargeting | null;
	/** UTM parameter targeting */
	utm?: OmnisendFormUTMTargeting | null;
};

/** Teaser shown before or after the form. */
export type OmnisendFormTeaser = {
	/** Teaser close button settings */
	closeButton?: OmnisendFormTeaserCloseButton | null;
	/** Whether the teaser is enabled */
	isEnabled?: boolean | null;
	/** Teaser position on the page */
	position?: string | null;
	/** Teaser styling */
	styleProperties?: OmnisendFormTeaserStyleProperties | null;
	/** Teaser text */
	text?: string | null;
	/** When the teaser is shown relative to the form */
	visibility?: string | null;
};

/** Teaser close button settings. */
export type OmnisendFormTeaserCloseButton = {
	/** Whether the teaser close button is shown */
	isEnabled?: boolean | null;
};

/** Teaser styling. */
export type OmnisendFormTeaserStyleProperties = {
	/** Background color */
	backgroundColor?: string | null;
	/** CSS border shorthand */
	border?: string | null;
	/** Border radius in pixels. Range: 0-50 */
	borderRadius?: string | null;
	/** Text color */
	color?: string | null;
	/** Teaser styling on desktop */
	desktopStyle?: OmnisendFormResponsiveTeaserStyle | null;
	/** Font family */
	fontFamily?: string | null;
	/** Font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Font style */
	fontStyle?: string | null;
	/** Font weight */
	fontWeight?: string | null;
	/** Teaser styling on mobile */
	mobileStyle?: OmnisendFormResponsiveTeaserStyle | null;
	/** Bottom padding in pixels */
	paddingBottom?: string | null;
	/** Left padding in pixels */
	paddingLeft?: string | null;
	/** Right padding in pixels */
	paddingRight?: string | null;
	/** Top padding in pixels */
	paddingTop?: string | null;
	/** Teaser shape */
	shape?: string | null;
	/** Text decoration */
	textDecoration?: string | null;
};

/** Named text style preset */
export type OmnisendFormTextPreset = {
	/** Preset identifier */
	id?: string | null;
	/** Preset name */
	name?: string | null;
	/** Styling applied to the preset */
	styles?: OmnisendFormTextStyle | null;
};

/** Styling applied to a text preset. */
export type OmnisendFormTextStyle = {
	/** Text color */
	color?: string | null;
	/** Text font family */
	fontFamily?: string | null;
	/** Text font size in pixels. Range: 8-96 */
	fontSize?: string | null;
	/** Text line height */
	lineHeight?: string | null;
};

/** URL targeting rule */
export type OmnisendFormURLTarget = {
	/** Match mode for the URL rule */
	type?: string | null;
	/** URL or URL fragment to match */
	value?: string | null;
};

/** URL targeting rules. */
export type OmnisendFormURLTargeting = {
	/** URLs the form is hidden on */
	excludes?: Array<OmnisendFormURLTarget> | null;
	/** URLs the form is shown on */
	includes?: Array<OmnisendFormURLTarget> | null;
};

/** UTM targeting rule */
export type OmnisendFormUTMTarget = {
	/** UTM parameter the rule matches */
	type?: string | null;
	/** UTM value to match */
	value?: string | null;
};

/** UTM parameter targeting. */
export type OmnisendFormUTMTargeting = {
	/** UTM rules the form is shown for */
	includes?: Array<OmnisendFormUTMTarget> | null;
};

/** Wheel-of-fortune block configuration returned in a form response. */
export type OmnisendFormWheelOfFortuneResponse = {
	/** Font family of all slice texts */
	fontFamily?: string | null;
	/** Font size of all slice texts, in px for a full-width wheel */
	fontSize?: string | null;
	/** Wheel pointer color */
	pointerColor?: string | null;
	/** Wheel slices */
	slices?: Array<OmnisendFormWheelOfFortuneSliceResponse> | null;
	/** Wheel spin duration in seconds */
	speed?: number | null;
	/** Wheel width percentage */
	width?: number | null;
};

/** Wheel-of-fortune slice returned in a form response. */
export type OmnisendFormWheelOfFortuneSliceResponse = {
	/** Alternative text for the slice image */
	altText?: string | null;
	/** Slice background color */
	backgroundColor?: string | null;
	/** Discount code awarded for the slice */
	discountCode?: string | null;
	/** (read-only) Unique discount identifier, present when discountType is unique */
	discountID?: string | null;
	/** Discount source for the slice */
	discountType?: string | null;
	/** Slice unique identifier (read-only) */
	id?: string | null;
	/** URL to the slice image */
	imageUrl?: string | null;
	/** Whether the slice is a losing slice */
	isLosing?: boolean | null;
	/** Win probability percentage for the slice. Range: 0-100 */
	probability?: number | null;
	/** Slice label text */
	text?: string | null;
	/** Slice text color */
	textColor?: string | null;
	/** Slice content type. Defaults to text when omitted */
	type?: string | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendFormsCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Cursor-based pagination metadata */
export type OmnisendFormsPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendFormsCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Template resource returned when fetching a single form template. */
export type OmnisendFormsTemplate = {
	/** Tags applied to contacts who submit forms created from this template */
	contactTags?: Array<string> | null;
	/** Template content */
	content?: OmnisendFormContentResponse | null;
	/** Template display type */
	displayType?: OmnisendDisplayType | null;
	/** Template unique identifier (read-only) */
	id?: string | null;
	/** Template name */
	name?: string | null;
	/** Template targeting rules */
	targeting?: OmnisendFormTargeting | null;
};

/** Frequency interval duration. The response always reports the duration in the largest time unit that divides it evenly: weeks when the interval is a whole number of weeks, otherwise days when it is a whole number of days, otherwise hours. For example, an input of `{amount: 7, units: "d"}` is… */
export type OmnisendFrequencyIntervalDuration = {
	/** Number of time units, expressed in the normalized `units`. */
	amount?: number | null;
	/** Time unit. Reflects the largest unit that evenly divides the configured interval (`w` > `d` > `h`) and may differ from the unit submitted on write. */
	units?: string | null;
};

/** Frequency limiter controls how often the same contact can enter the automation. When present, the limiter is active. Omit or set to null to disable. The `mode` field determines the limiting behavior: - "once": the contact can enter the automation only once per lifetime - "interval": the contact… */
export type OmnisendFrequencyLimiter = {
	/** Minimum interval before the contact can re-enter — required when mode is "interval" */
	duration?: OmnisendFrequencyIntervalDuration | null;
	/** Frequency limiter mode */
	mode?: string | null;
};

/** General settings for the template */
export type OmnisendGeneralSettings = {
	/** Body settings */
	body?: OmnisendBody | null;
	/** Button presets */
	buttonPresets?: Array<OmnisendButtonPreset> | null;
	/** Content settings */
	content?: OmnisendContentSettings | null;
	/** Gmail settings */
	gmail?: OmnisendGmail | null;
	/** Logo settings */
	logo?: OmnisendLogoSettings | null;
	/** Text presets */
	textPresets?: Array<OmnisendTextPreset> | null;
};

/** Response containing a paginated list of product categories */
export type OmnisendGetCategoriesResponse = {
	/** List of product categories */
	categories?: Array<OmnisendCategoryListItem> | null;
	/** Pagination information */
	paging?: OmnisendProductCategoriesPaging | null;
};

/** Product category details */
export type OmnisendGetCategoryResponse = {
	/** Product category unique identifier (read-only) */
	categoryID?: string | null;
	/** Product category creation timestamp (read-only) */
	createdAt?: string | null;
	/** Product category name */
	title?: string | null;
	/** Product category last update timestamp (read-only) */
	updatedAt?: string | null;
};

/** Segment resource representation. */
export type OmnisendGetSegmentResponse = {
	/** Segment archival timestamp, null if not archived (read-only) */
	archivedAt?: string | null;
	/** Condition groups defining the segment rules */
	conditionGroups?: Array<OmnisendSegmentConditionGroup> | null;
	/** Segment creation timestamp (read-only) */
	createdAt?: string | null;
	/** Whether the segment is marked as a favourite */
	isStarred?: boolean | null;
	/** Segment name */
	name?: string | null;
	/** Segment unique identifier (read-only) */
	segmentID?: string | null;
	/** Segment processing status (read-only) */
	status?: string | null;
	/** Segment last update timestamp (read-only) */
	updatedAt?: string | null;
	/** Link that opens the segment in the Omnisend app (read-only) */
	url?: string | null;
};

/** Segment statistics resource. */
export type OmnisendGetSegmentStatisticsResponse = {
	/** Segment contacts count (read-only) */
	contactsCount?: number | null;
};

/** Gmail specific settings for email. */
export type OmnisendGmail = {
	/** Gmail annotation settings */
	annotation?: OmnisendAnnotation | null;
};

/** HTML code block with separate style and body content */
export type OmnisendHTMLCode = {
	/** HTML body content that will be embedded in the email. */
	body?: string | null;
	/** CSS styles for the HTML content that will be embedded in the HTML header. */
	style?: string | null;
};

/** Social media icon with link and image source */
export type OmnisendIcon = {
	/** Link to the social media profile or contact method */
	link?: string | null;
	/** Source path for the social media icon image */
	source?: string | null;
	/** Type of the social media platform */
	type?: string | null;
};

/** Unique contact identifier (email or phone). */
export type OmnisendIdentifier = {
	/** Subscription status per channel, keyed by channel name */
	channels?: Record<string, OmnisendChannel> | null;
	/** Identifier value (email address or phone number) */
	id?: string | null;
	/** Identifier type */
	type?: string | null;
};

/** Image block for displaying images in the email */
export type OmnisendImage = {
	/** Image alt source - used as a fallback image if the original image fails to load */
	altSource?: string | null;
	/** Image alt text for accessibility */
	altText?: string | null;
	/** Image original height */
	height?: number | null;
	/** Image ID retrieved from Image API */
	id?: string | null;
	/** Whether the image is dynamic - used to identify whether the image is dynamically generated */
	isDynamic?: boolean | null;
	/** Whether the image is an external source - used to identify whether the image has an external source */
	isExternalSource?: boolean | null;
	/** Image destination path - where the image will redirect on click */
	link?: string | null;
	/** Image max height in pixels - absolute pixel height constraint for dynamic images (0-1000) */
	maxHeight?: number | null;
	/** Image max height percentage - used to identify the maximum height of the image as a percentage of the container */
	maxHeightPercentage?: number | null;
	/** Image name displayed in the email */
	name?: string | null;
	/** Resized image height - used when the image is resized to a different width or height than the original */
	resizeHeight?: number | null;
	/** Resized image width - used when the image is resized to a different width than the original */
	resizeWidth?: number | null;
	/** Image size in bytes */
	size?: number | null;
	/** Image source URL. */
	source?: string | null;
	/** Image state - used to identify the state of the image */
	state?: string | null;
	/** Image type (image/jpg, image/jpeg, image/png, image/gif) */
	type?: string | null;
	/** Image original width */
	width?: number | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendImagesCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Image is an external image resource. */
export type OmnisendImagesImage = {
	/** Image creation timestamp. */
	createdAt?: string | null;
	/** Image height in pixels. */
	height?: number | null;
	/** Unique image identifier. */
	id?: string | null;
	/** Image name. */
	name?: string | null;
	/** Image size in bytes. */
	size?: number | null;
	/** MIME type of the image. */
	type?: string | null;
	/** Public CDN URL of the image. */
	url?: string | null;
	/** Image width in pixels. */
	width?: number | null;
};

/** Cursor-based pagination metadata */
export type OmnisendImagesPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendImagesCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Trigger inactivity time defines how long a contact must remain inactive before the automation triggers. The contact must first match the trigger filters. If the trigger event fires again before the timer expires, the timer resets — ensuring the workflow starts only after the contact has finished… */
export type OmnisendInactivitySettings = {
	/** Inactivity period — the timer resets on each re-trigger */
	duration?: OmnisendDuration | null;
};

/** Language available for store content */
export type OmnisendLanguage = {
	/** Language code */
	code?: string | null;
	/** Display name of the language */
	name?: string | null;
};

/** Horizontal line or space block for layout separation */
export type OmnisendLineSpace = {
	/** Height of the line or space element in pixels */
	height?: number | null;
	/** type of line or space element */
	type?: string | null;
	/** Width of the line or space element in pixels */
	width?: number | null;
};

/** Paginated list of automations */
export type OmnisendListAutomationsResponse = {
	/** List of automations */
	automations?: Array<OmnisendAutomation> | null;
	/** Pagination information */
	paging?: OmnisendPagingResponse | null;
};

export type OmnisendListBatchesResponse = {
	batches?: Array<OmnisendBatch> | null;
	paging?: OmnisendPaging | null;
};

/** Paginated list of contacts. */
export type OmnisendListContactsResponse = {
	/** List of contact resources */
	contacts?: Array<OmnisendContactResponse> | null;
	/** Pagination metadata */
	paging?: OmnisendContactsPagingResponse | null;
};

/** Paginated list of forms. */
export type OmnisendListFormsResponse = {
	/** List of forms */
	forms?: Array<OmnisendForm> | null;
	/** Pagination information */
	paging?: OmnisendFormsPagingResponse | null;
};

export type OmnisendListProductsResponse = {
	paging?: OmnisendProductsPaging | null;
	products?: Array<OmnisendProductsProduct> | null;
};

/** ListResponse is the paginated image list response. */
export type OmnisendListResponse = {
	/** Returned images. */
	images?: Array<OmnisendImagesImage> | null;
	/** Cursor pagination metadata. */
	paging?: OmnisendImagesPagingResponse | null;
};

/** Paginated list of segments. */
export type OmnisendListSegmentsResponse = {
	/** Pagination metadata for navigating results */
	paging?: OmnisendSegmentsPagingResponse | null;
	/** List of segments on the current page */
	segments?: Array<OmnisendGetSegmentResponse> | null;
};

/** Paginated list of form templates. */
export type OmnisendListTemplatesResponse = {
	/** List of form templates */
	formTemplates?: Array<OmnisendFormsTemplate> | null;
	/** Pagination information */
	paging?: OmnisendFormsPagingResponse | null;
};

/** Represents the response for listing universal layouts */
export type OmnisendListUniversalLayoutsResponse = {
	/** Pagination information */
	paging?: OmnisendEmailContentPagingResponse | null;
	/** List of universal layouts */
	universalLayouts?: Array<OmnisendUniversalLayout> | null;
};

/** Logo block for displaying a logo in the email */
export type OmnisendLogo = {
	/** Link where the logo will redirect on click */
	link?: string | null;
	/** Resized width of the logo in pixels */
	resizeWidth?: number | null;
};

/** Logo settings for the template */
export type OmnisendLogoSettings = {
	/** Logo alt text - alternative text for the logo for accessibility */
	altText?: string | null;
	/** Logo height in pixels */
	height?: number | null;
	/** Logo unique identifier */
	id?: string | null;
	/** Logo custom - whether the logo is a custom uploaded logo */
	isCustom?: boolean | null;
	/** Logo name */
	name?: string | null;
	/** Logo size - in bytes, up to 5MB */
	size?: number | null;
	/** Logo source - image URL (max 2083 characters) or personalisation tag */
	source?: string | null;
	/** Logo type - one of: image/jpg, image/jpeg, image/png, image/gif */
	type?: string | null;
	/** Logo width in pixels - required when height is set */
	width?: number | null;
};

/** Contact opt-in record. */
export type OmnisendOptIn = {
	/** Channel type */
	channel?: string | null;
	/** Timestamp when the opt-in was recorded */
	optInAt?: string | null;
};

/** Postal address for billing or shipping */
export type OmnisendOrderAddress = {
	/** Primary address line */
	address1?: string | null;
	/** Secondary address line */
	address2?: string | null;
	/** City name */
	city?: string | null;
	/** Company name */
	company?: string | null;
	/** Country name */
	country?: string | null;
	/** ISO country code */
	countryCode?: string | null;
	/** First name */
	firstName?: string | null;
	/** Last name */
	lastName?: string | null;
	/** Phone number */
	phone?: string | null;
	/** State or province name */
	state?: string | null;
	/** State or province code */
	stateCode?: string | null;
	/** Postal code */
	zip?: string | null;
};

/** Visibility toggles for individual address fields */
export type OmnisendOrderAddressHiddenFields = {
	/** Whether the address line 1 is hidden */
	isAddress1Hidden?: boolean | null;
	/** Whether the address line 2 is hidden */
	isAddress2Hidden?: boolean | null;
	/** Whether the city is hidden */
	isCityHidden?: boolean | null;
	/** Whether the company is hidden */
	isCompanyHidden?: boolean | null;
	/** Whether the country is hidden */
	isCountryHidden?: boolean | null;
	/** Whether the name and surname are hidden */
	isNameSurnameHidden?: boolean | null;
	/** Whether the phone is hidden */
	isPhoneHidden?: boolean | null;
	/** Whether the state is hidden */
	isStateHidden?: boolean | null;
	/** Whether the zip code is hidden */
	isZipCodeHidden?: boolean | null;
};

/** Order addresses block displaying billing and shipping information */
export type OmnisendOrderAddresses = {
	/** Billing address */
	billing?: OmnisendOrderAddress | null;
	/** Fields to hide in the addresses block */
	hiddenFields?: OmnisendOrderAddressesHiddenFields | null;
	/** Shipping address */
	shipping?: OmnisendOrderAddress | null;
	/** Shipping methods used for the order */
	shippingMethods?: Array<OmnisendOrderShipping> | null;
	/** Section title */
	title?: string | null;
	/** Payment transactions for the order */
	transactions?: Array<OmnisendOrderTransaction> | null;
};

/** Visibility toggles for the order addresses section */
export type OmnisendOrderAddressesHiddenFields = {
	/** Billing address hidden fields */
	billing?: OmnisendOrderAddressHiddenFields | null;
	/** Whether the section title is hidden */
	isTitleHidden?: boolean | null;
	/** Shipping address hidden fields */
	shipping?: OmnisendOrderAddressHiddenFields | null;
};

/** Individual product within an order */
export type OmnisendOrderProduct = {
	/** Price currency code */
	currency?: string | null;
	/** Discount amount applied */
	discountAmount?: string | null;
	/** Product image */
	image?: OmnisendImage | null;
	/** Product price */
	price?: string | null;
	/** Price after discount */
	priceWithDiscount?: string | null;
	/** Product identifier */
	productID?: string | null;
	/** Product page URL */
	productUrl?: string | null;
	/** Ordered quantity */
	quantity?: number | null;
	/** Stock keeping unit code */
	sku?: string | null;
	/** Product name */
	title?: string | null;
	/** Selected product variant */
	variant?: string | null;
	/** Product vendor name */
	vendor?: string | null;
	/** Product weight */
	weight?: number | null;
};

/** Order products block displaying ordered items */
export type OmnisendOrderProducts = {
	/** Fields to hide in the order products display */
	hiddenFields?: OmnisendOrderProductsHiddenFields | null;
	/** List of ordered products. Placeholder data — actual products are injected at render time. */
	products?: Array<OmnisendOrderProduct> | null;
};

/** Visibility toggles for order product fields */
export type OmnisendOrderProductsHiddenFields = {
	/** Whether the discount amount is hidden */
	isDiscountAmountHidden?: boolean | null;
	/** Whether the image is hidden */
	isImageHidden?: boolean | null;
	/** Whether the price is hidden */
	isPriceHidden?: boolean | null;
	/** Whether the price with discount is hidden */
	isPriceWithDiscountHidden?: boolean | null;
	/** Whether the product ID is hidden */
	isProductIDHidden?: boolean | null;
	/** Whether the quantity is hidden */
	isQuantityHidden?: boolean | null;
	/** Whether the SKU is hidden */
	isSkuHidden?: boolean | null;
	/** Whether the title is hidden */
	isTitleHidden?: boolean | null;
	/** Whether the variant is hidden */
	isVariantHidden?: boolean | null;
	/** Whether the vendor is hidden */
	isVendorHidden?: boolean | null;
	/** Whether the weight is hidden */
	isWeightHidden?: boolean | null;
};

/** Shipping method details */
export type OmnisendOrderShipping = {
	/** Shipping price */
	price?: string | null;
	/** Shipping method name */
	title?: string | null;
};

/** Order summary block displaying order identification details */
export type OmnisendOrderSummary = {
	/** Order date */
	date?: string | null;
	/** Date display format */
	dateFormat?: string | null;
	/** Fields to hide in the order summary */
	hiddenFields?: OmnisendOrderSummaryHiddenFields | null;
	/** Order identifier */
	orderID?: string | null;
	/** Summary section title */
	title?: string | null;
};

/** Visibility toggles for order summary fields */
export type OmnisendOrderSummaryHiddenFields = {
	/** Whether the date is hidden */
	isDateHidden?: boolean | null;
	/** Whether the order ID is hidden */
	isOrderIDHidden?: boolean | null;
	/** Whether the title is hidden */
	isTitleHidden?: boolean | null;
};

/** Tax line item applied to the order */
export type OmnisendOrderTax = {
	/** Tax amount */
	price?: string | null;
	/** Tax rate */
	rate?: string | null;
	/** Tax name */
	title?: string | null;
};

/** Order total block displaying pricing breakdown */
export type OmnisendOrderTotal = {
	/** Currency code */
	currency?: string | null;
	/** Total discount amount */
	discountTotal?: string | null;
	/** Applied discount details */
	discounts?: Array<OmnisendOrderTotalDiscount> | null;
	/** Fields to hide in the order total */
	hiddenFields?: OmnisendOrderTotalHiddenFields | null;
	/** Whether the subtotal includes tax */
	isSubTotalTaxIncluded?: boolean | null;
	/** Final order total */
	orderTotal?: string | null;
	/** Shipping price */
	shippingPrice?: string | null;
	/** Subtotal amount before tax and shipping */
	subTotal?: string | null;
	/** Total tax amount */
	taxTotal?: string | null;
	/** Applied tax details */
	taxes?: Array<OmnisendOrderTax> | null;
};

/** Discount applied to the order total */
export type OmnisendOrderTotalDiscount = {
	/** Discount amount */
	amount?: string | null;
	/** Discount code */
	code?: string | null;
	/** Discount type */
	type?: string | null;
};

/** Visibility toggles for order total fields */
export type OmnisendOrderTotalHiddenFields = {
	/** Whether the discount total is hidden */
	isDiscountTotalHidden?: boolean | null;
	/** Whether the order total is hidden */
	isOrderTotalHidden?: boolean | null;
	/** Whether the shipping price is hidden */
	isShippingPriceHidden?: boolean | null;
	/** Whether the subtotal is hidden */
	isSubTotalHidden?: boolean | null;
	/** Whether the tax total is hidden */
	isTaxTotalHidden?: boolean | null;
};

/** Payment transaction details */
export type OmnisendOrderTransaction = {
	/** Payment method used */
	payment?: string | null;
};

/** Overlap limiter prevents a contact from entering this automation when they are already in, or were recently in, other specified automations. When present, the limiter is active. Omit or set to null to disable. The `mode` field determines the check: - "currentlyIn": skip the contact if they are… */
export type OmnisendOverlapLimiter = {
	/** Automation IDs to check for overlap */
	automationIDs?: Array<string> | null;
	/** Overlap check mode */
	mode?: string | null;
	/** Number of days to check — required when mode is "recentlyIn" */
	withinDays?: number | null;
};

export type OmnisendPaging = {
	limit?: number | null;
	next?: string | null;
	offset?: number | null;
	previous?: string | null;
};

/** Cursor-based pagination metadata */
export type OmnisendPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Preheader block to setup View in Browser link text formattings Text is formatted as ```Text<a href="https://view-inbrowser-link">LinkText</a>``` */
export type OmnisendPreheader = {
	/** Preheader link text */
	linkText?: string | null;
	/** Preheader text */
	text?: string | null;
};

/** Product block for displaying product information */
export type OmnisendProduct = {
	/** Product button text - text of the button that will redirect to the product page */
	buttonText?: string | null;
	/** Product description - displayed in the email */
	description?: string | null;
	/** Product ID - Omnisend product ID - can be retrieved from the Product API */
	id?: string | null;
	/** Product image ID - Omnisend image ID - can be retrieved from the Image API */
	imageID?: string | null;
	/** Product image URL - URL of the product image */
	imageUrl?: string | null;
	/** Product link - where the product will redirect on click */
	link?: string | null;
	/** Product price before discount */
	oldPrice?: string | null;
	/** Product original title - original title of the product */
	originalTitle?: string | null;
	/** Product price */
	price?: string | null;
	/** ID of connected platform product (e.g. Shopify product ID) */
	productID?: string | null;
	/** Product title - displayed in the email */
	title?: string | null;
};

/** Pagination metadata for list responses */
export type OmnisendProductCategoriesPaging = {
	/** Number of items per page. Range: 1-250. Default: 100 */
	limit?: number | null;
	/** URL to the next page of results */
	next?: string | null;
	/** Current page offset */
	offset?: number | null;
	/** URL to the previous page of results */
	previous?: string | null;
};

/** Product recommender settings for the product recommendations section */
export type OmnisendProductRecommender = {
	/** Categories to exclude from recommendations */
	excludeCategories?: Array<string> | null;
	/** Products to exclude from recommendations */
	excludeProducts?: Array<string> | null;
	/** Product recommender fallback type */
	fallbackType?: string | null;
	/** Categories to include in recommendations */
	includeCategories?: Array<string> | null;
	/** Whether to include out-of-stock products in recommendations */
	isOutOfStockIncluded?: boolean | null;
	/** Minimum price filter for product recommendations */
	priceFrom?: number | null;
	/** Number of days to exclude recently purchased products */
	purchaseExclusionDays?: number | null;
	/** Number of months to consider for recency-based recommendations */
	recencyMonths?: number | null;
	/** Product recommender type */
	type?: string | null;
};

export type OmnisendProductsPaging = {
	limit?: number | null;
	next?: string | null;
	offset?: number | null;
	previous?: string | null;
};

export type OmnisendProductsProduct = {
	categoryIDs?: Array<string> | null;
	createdAt?: string | null;
	currency?: string | null;
	/** DefaultImageUrl is recommended if more than one image is needed. Other product images should be added to the Images array. */
	defaultImageUrl?: string | null;
	/** Description is a short description of the product. It can be used in the email body. */
	description?: string | null;
	id?: string | null;
	images?: Array<string> | null;
	/** Status can be inStock, outOfStock, or notAvailable. We recommended to keep it in sync with your shop product to ensure that Omnisend can avoid sending out-of-stock products to your customers. */
	status?: string | null;
	/** Tags can be used to categorize products. */
	tags?: Array<string> | null;
	title?: string | null;
	/** Product type can be used to categorize products. */
	type?: string | null;
	updatedAt?: string | null;
	/** Url should point to the product page on the website. */
	url?: string | null;
	/** Product variants are different versions of the same product. For example, a T-shirt can have different sizes and colors. */
	variants?: Array<OmnisendVariant> | null;
	/** Vendor is the manufacturer or the brand of the product. */
	vendor?: string | null;
};

/** A single property within an event. Struct properties nest their children under the recursive properties map. */
export type OmnisendPropertyNode = {
	/** Longer explanation of the property's meaning and allowed values */
	description?: string | null;
	/** Human-readable label for the property */
	displayName?: string | null;
	/** True when the property was declared via the write API rather than inferred from the global lexicon or scraped traffic */
	explicitlyDefined?: boolean | null;
	/** Logical grouping for UI presentation (e.g. "Core", "Address") */
	group?: string | null;
	/** Child properties, present only for struct-typed properties. */
	properties?: Record<string, OmnisendPropertyNode> | null;
	/** Property data type */
	type?: string | null;
};

/** Rendered form split into display steps. */
export type OmnisendRenderFormResponse = {
	/** Rendered form steps */
	steps?: Array<OmnisendRenderedStepResponse> | null;
};

/** Single rendered display step. */
export type OmnisendRenderedStepResponse = {
	/** Rendered step HTML */
	html?: string | null;
	/** Rendered step name */
	name?: string | null;
};

export type OmnisendReplaceProductResponse = {
	id?: string | null;
};

/** Row is a single row of the section */
export type OmnisendRow = {
	/** Row columns - used to group content into logical columns */
	columns?: Array<OmnisendColumn> | null;
	/** Row unique identifier - must be unique within the template */
	id?: string | null;
	/** Row style properties - used to configure the row styling */
	styleProperties?: OmnisendStyleProperties | null;
};

/** Filter rule for conditional display of content */
export type OmnisendRule = {
	/** Filter operator - comparison operator for the filter condition */
	operator?: string | null;
	/** Filter property - property to filter on */
	property?: OmnisendFilterProperty | null;
	/** Filter value - value to compare against the property */
	value?: string | null;
};

/** SMS message content */
export type OmnisendSMS = {
	/** Compliance text appended to every SMS */
	compliance?: OmnisendSMSCompliance | null;
	/** Image ID obtained from the Images API. When set, the message is delivered as MMS to US/CA recipients; other countries receive SMS without the image. Image must be JPEG, JPG, PNG, or GIF and not exceed 500 KB */
	imageID?: string | null;
	/** Auto-shorten links in message body */
	isLinkShorteningEnabled?: boolean | null;
	/** SMS message body. When sent as SMS, the message (including the appended compliance text and unsubscribe link/keyword) must not exceed 9 SMS segments for either US/CA or other-country recipients. When sent as MMS, the message (including the appended compliance text) must not exceed 1600… */
	message?: string | null;
	/** Sender display name. Max 250 chars */
	senderName?: string | null;
};

/** SMS compliance text settings */
export type OmnisendSMSCompliance = {
	/** STOP keyword text for US/CA recipients. Max 250 chars */
	stopKeywordText?: string | null;
	/** Unsubscribe link text for non-US/CA recipients. Max 250 chars */
	unsubscribeLinkText?: string | null;
};

/** Saved automation workflow schedule. */
export type OmnisendSaveAutomationScheduleResponse = {
	/** Saved schedule */
	schedule?: OmnisendAutomationSchedule | null;
	/** Problems that would stop the workflow from being enabled at `startAt`. The schedule is saved regardless. A workflow problem points at its `field`. An account problem, such as blocked email sending or an unverified sender domain, has an empty `field`. Empty when the workflow can be enabled */
	warnings?: Array<OmnisendFieldError> | null;
	/** What happens when `warnings` are not resolved before `startAt`. Present only when `warnings` is not empty */
	warningsDetail?: string | null;
};

/** Section is a single section of the template */
export type OmnisendSection = {
	/** Section unique identifier - must be unique within the template */
	id?: string | null;
	/** Section product recommender - used to configure the product recommender functionality */
	productRecommender?: OmnisendProductRecommender | null;
	/** Section rows - used to group content into logical sections. Null for a section that references a universal layout, and must be null or empty when sent for one. Locked email content (a campaign that has started sending) is the exception: its universal layout sections keep the layout rows the… */
	rows?: Array<OmnisendRow> | null;
	/** Section settings - used to configure the section behavior and content */
	settings?: OmnisendEmailContentSettings | null;
	/** Section style properties - used to configure the section styling */
	styleProperties?: OmnisendStyleProperties | null;
	/** Section type - determines the section functionality and available content options. products_listing: manually selected products. product_recommender: personalized recommendations (requires productRecommender). product_cart_recovery: abandoned cart items. product_back_in_stock: restocked items.… */
	type?: string | null;
	/** Section visibility settings - used to show the section on mobile or desktop only. Omitted, or with neither flag true, the section shows on all devices. When sent, it must set at least one flag. */
	visibility?: OmnisendVisibility | null;
};

/** A single filter condition applied to a specific entity. */
export type OmnisendSegmentCondition = {
	/** Entity type this condition applies to */
	entity?: string | null;
	/** List of filter criteria. Must contain at least one item. */
	filters?: Array<OmnisendJsonValue> | null;
	/** Logical operator combining the filters within this condition */
	junction?: string | null;
};

/** Group of conditions combined with a logical junction. */
export type OmnisendSegmentConditionGroup = {
	/** List of conditions in this group */
	conditions?: Array<OmnisendSegmentCondition> | null;
};

/** Cursor pointers for paginating forward and backward through results */
export type OmnisendSegmentsCursorsResponse = {
	/** Opaque cursor for fetching the next page of results */
	after?: string | null;
	/** Opaque cursor for fetching the previous page of results */
	before?: string | null;
};

/** Cursor-based pagination metadata */
export type OmnisendSegmentsPagingResponse = {
	/** Cursor values for navigating between pages */
	cursors?: OmnisendSegmentsCursorsResponse | null;
	/** Whether there are more items available beyond the current page */
	hasMore?: boolean | null;
	/** Maximum number of items returned per page */
	limit?: number | null;
};

/** Send email action configuration. `contentID` references an Email Template entity documented in the [Email Templates API](https://api-docs.omnisend.com/reference/email-templates). */
export type OmnisendSendEmail = {
	/** Email content unique identifier referencing the automation's email design (read-only). See [Email Templates API](https://api-docs.omnisend.com/reference/email-templates). */
	contentID?: string | null;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message — for example, the contact has not opted in for this channel or does not meet the automation's `sendingThresholds`. When true (default), the contact bypasses this block and continues to the next block… */
	isSkipAllowed?: boolean | null;
	/** Email language locale in xx_XX format. Must be a supported language */
	language?: string | null;
	/** Email preheader text displayed after the subject line in the recipient's inbox. Supports personalization tags, e.g. [[contact.first_name]] */
	preheader?: string | null;
	/** Reply-to email address for recipient responses. Must be a verified email */
	replyToEmail?: string | null;
	/** Sender email address shown in the recipient's inbox */
	senderEmail?: string | null;
	/** Sender display name shown in the recipient's inbox */
	senderName?: string | null;
	/** Email subject line displayed in the recipient's inbox. Supports personalization tags, e.g. [[contact.first_name]] */
	subject?: string | null;
};

/** Send push notification action configuration. */
export type OmnisendSendPush = {
	/** Push notification body text. Supports personalization tags, e.g. [[contact.first_name]] */
	body?: string | null;
	/** Destination URL where the customer is redirected when clicking the push notification. Supports personalization tags. */
	clickUrl?: string | null;
	/** Optional icon image ID obtained from the Images API. Recommended size: 192x192 pixels. When omitted, the browser default icon is used. */
	iconID?: string | null;
	/** Optional image ID obtained from the Images API displayed below the push notification body. Recommended size: 360x180 pixels (2:1 aspect ratio). Not supported on iOS devices. */
	imageID?: string | null;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message — for example, the contact has not opted in for this channel or does not meet the automation's `sendingThresholds`. When true (default), the contact bypasses this block and continues to the next block… */
	isSkipAllowed?: boolean | null;
	/** Push notification title. Supports personalization tags, e.g. [[contact.first_name]] */
	title?: string | null;
};

/** Send SMS action configuration. */
export type OmnisendSendSms = {
	/** SMS compliance text settings. Required on create. */
	compliance?: OmnisendSmsCompliance | null;
	/** Discount configuration for this SMS block. Present when per-block discount mode is active and a discount is configured for this block. Null when global discount mode is active (discount is managed at the settings level) or when no discount is configured for this block. The discount is applied at… */
	discountSettings?: OmnisendDiscountSettings | null;
	/** Image ID obtained from the Images API. When set, the message is delivered as MMS to US/CA recipients; other countries receive SMS without the image. */
	imageID?: string | null;
	/** Whether links in the SMS body are automatically shortened */
	isLinkShorteningEnabled?: boolean | null;
	/** Whether skipping this block is allowed when the contact is not eligible to receive this message — for example, the contact has not opted in for this channel or does not meet the automation's `sendingThresholds`. When true (default), the contact bypasses this block and continues to the next block… */
	isSkipAllowed?: boolean | null;
	/** SMS message body. Supports personalization tags, e.g. [[contact.first_name]] */
	message?: string | null;
};

/** Sends an HTTP POST request to the specified URL with the provided headers and body. */
export type OmnisendSendWebhook = {
	/** Request body template (JSON). Supports personalization tags, e.g. [[contact.email]] */
	body?: string | null;
	/** Webhook callback URL — destination that receives the HTTP POST request */
	callbackUrl?: string | null;
	/** Custom HTTP headers sent with the webhook request */
	headers?: Array<OmnisendWebhookHeader> | null;
};

/** Campaign sending settings */
export type OmnisendSendingSettings = {
	/** Whether timezone optimization is enabled. Only available with immediate or scheduled strategy, and only in email campaigns */
	isTZOptimizationEnabled?: boolean | null;
	/** Optimization objective for personalized sends. Present when strategy is personalized */
	optimizeFor?: string | null;
	/** Whether personalized sends avoid contact-local hours from 22:00 through 06:59 */
	respectQuietHours?: boolean | null;
	/** Scheduled send time in RFC 3339 format. Present when strategy is scheduled or personalized */
	scheduledAt?: string | null;
	/** Sending strategy */
	strategy?: string | null;
};

/** Sending thresholds control which contacts receive messages at each send block (email, SMS, push) based on their subscription status. These settings do not affect which contacts enter the automation — only who receives messages when they reach a send block. Contacts who don't meet the threshold… */
export type OmnisendSendingThresholds = {
	/** Email subscription threshold */
	email?: string | null;
	/** SMS subscription threshold. US non-subscribers are never reached on SMS regardless of this value — CTIA regulations restrict SMS to US contacts to subscribed only. */
	sms?: string | null;
};

/** Automation settings. */
export type OmnisendSettings = {
	/** Global discount configuration shared across all SMS blocks and email content in this automation. Present when global discount mode is active. Null when discounts are managed independently per block (per-block mode). Check this field to determine the active discount mode: non-null = global mode,… */
	discount?: OmnisendDiscountSettings | null;
	/** Frequency limiter configuration — omit or null to disable */
	frequencyLimiter?: OmnisendFrequencyLimiter | null;
	/** Overlap limiter configuration — omit or null to disable */
	overlapLimiter?: OmnisendOverlapLimiter | null;
	/** Sending thresholds — always populated. Defaults to {email: "subscribed", sms: "subscribed"} when no override is set. */
	sendingThresholds?: OmnisendSendingThresholds | null;
};

/** SMS compliance text settings. Controls opt-out and unsubscribe text appended to the SMS body. By default, both stop keyword and unsubscribe link are enabled. When enabled, the corresponding text field is required. */
export type OmnisendSmsCompliance = {
	/** Whether stop keyword text is included in the SMS (default: true). When true, stopKeywordText is required. */
	isStopKeywordIncluded?: boolean | null;
	/** Whether unsubscribe link text is included in the SMS (default: true). When true, unsubscribeLinkText is required. */
	isUnsubscribeLinkIncluded?: boolean | null;
	/** STOP keyword text appended to the SMS for US/CA recipients. Required when isStopKeywordIncluded is true. */
	stopKeywordText?: string | null;
	/** Unsubscribe link text appended to the SMS for non-US/CA recipients. Required when isUnsubscribeLinkIncluded is true. */
	unsubscribeLinkText?: string | null;
};

/** Social block for displaying social media icons and links */
export type OmnisendSocial = {
	/** Icons of the social media platforms */
	icons?: Array<OmnisendIcon> | null;
	/** Shape of the social media icons */
	shape?: string | null;
	/** Size of the social media icons */
	size?: string | null;
};

/** Conditional split block configuration. */
export type OmnisendSplit = {
	/** Blocks executed when split condition is not met (false path) */
	falseBlocks?: Array<OmnisendBlock> | null;
	/** Split evaluation filter group */
	filterGroup?: OmnisendSplitFilterGroup | null;
	/** Blocks executed when split condition is met (true path) */
	trueBlocks?: Array<OmnisendBlock> | null;
};

/** Split filter condition. The type discriminator determines the filter category. For event/contact filters, field and operator follow the same rules as EventFilter/ContactFilter. For message filters, field is always "blockID", value is the block ID, and operator is an engagement action (e.g.… */
export type OmnisendSplitFilter = {
	/** Property to filter on (event: property path; contact: property name; message: always "blockID") */
	field?: string | null;
	/** Operator (event/contact: comparison operator; message: engagement operator such as "openedEmail", "clickedEmail", "clickedSms", "openedPush", "clickedPush") */
	operator?: string | null;
	/** Filter type discriminator */
	type?: string | null;
	/** URL match condition — applies only to clicked message filters */
	urlMatch?: OmnisendUrlMatch | null;
	/** Filter value (event/contact: filter value; message: block ID) */
	value?: OmnisendJsonValue | null;
};

/** Split filter group containing one or more filters of mixed types (event, contact, message) combined by a logical operator. At least one filter is required. */
export type OmnisendSplitFilterGroup = {
	/** Filters within this group (each filter specifies its type) */
	filters?: Array<OmnisendSplitFilter> | null;
	/** Logical operator combining filters within this group */
	logicalOperator?: string | null;
};

/** Form status. */
export type OmnisendStatus = string;

/** Store content languages and the default language */
export type OmnisendStoreLanguagesResponse = {
	/** Default language code used for the store's content */
	defaultLanguage?: string | null;
	/** Languages available for the store's content */
	languages?: Array<OmnisendLanguage> | null;
};

/** Style properties for the section */
export type OmnisendStyleProperties = {
	/** Alignment - used to align the content horizontally */
	alignment?: string | null;
	/** Background color - used to set the background color of the content */
	backgroundColor?: string | null;
	/** Background image ID - ID of the background image asset. Must be present in Image API */
	backgroundImageID?: string | null;
	/** Background position - used to position the background image */
	backgroundPosition?: string | null;
	/** Background repeat - used to repeat the background image */
	backgroundRepeat?: string | null;
	/** Background size - used to size the background image */
	backgroundSize?: string | null;
	/** Border - used to add a border to the content */
	border?: string | null;
	/** Border radius */
	borderRadius?: string | null;
	/** Text color */
	color?: string | null;
	/** Divider color */
	dividerColor?: string | null;
	/** Font family */
	fontFamily?: string | null;
	/** Font size */
	fontSize?: string | null;
	/** Font style */
	fontStyle?: string | null;
	/** Font weight */
	fontWeight?: string | null;
	/** Inner padding */
	innerPadding?: string | null;
	/** Inner padding bottom */
	innerPaddingBottom?: string | null;
	/** Inner padding left */
	innerPaddingLeft?: string | null;
	/** Inner padding right */
	innerPaddingRight?: string | null;
	/** Inner padding top */
	innerPaddingTop?: string | null;
	/** Whether to exclude background paddings - used to exclude paddings from the background image */
	isBackgroundPaddingsExcluded?: boolean | null;
	/** Letter spacing - spacing between letters */
	letterSpacing?: string | null;
	/** Line height */
	lineHeight?: string | null;
	/** Link color */
	linkColor?: string | null;
	/** Padding */
	padding?: string | null;
	/** Padding bottom */
	paddingBottom?: string | null;
	/** Padding left */
	paddingLeft?: string | null;
	/** Padding right */
	paddingRight?: string | null;
	/** Padding top */
	paddingTop?: string | null;
	/** Price color - used to color the price text */
	priceColor?: string | null;
	/** Secondary color - used to color the secondary text */
	secondaryColor?: string | null;
	/** Text Background color - used to set the text background color */
	textBackgroundColor?: string | null;
	/** Text decoration */
	textDecoration?: string | null;
	/** Vertical alignment - used to align the content vertically */
	verticalAlign?: string | null;
};

/** Tag action configuration. Used by both addTag and removeTag action types. */
export type OmnisendTagAction = {
	/** Tag value. Case-insensitive — values are normalized to lowercase on create. */
	value?: string | null;
};

/** Email template */
export type OmnisendTemplate = {
	/** Template created at (read-only) */
	createdAt?: string | null;
	/** Template general settings - global and template level styles */
	generalSettings?: OmnisendGeneralSettings | null;
	/** Template unique identifier (read-only) */
	id?: string | null;
	/** Template name */
	name?: string | null;
	/** Template sections */
	sections?: Array<OmnisendSection> | null;
	/** Template updated at (read-only) */
	updatedAt?: string | null;
};

/** Email template list item */
export type OmnisendTemplateListItem = {
	/** Template created at (read-only) */
	createdAt?: string | null;
	/** Template unique identifier (read-only) */
	id?: string | null;
	/** Template name */
	name?: string | null;
	/** Template updated at (read-only) */
	updatedAt?: string | null;
};

/** List of email templates with pagination */
export type OmnisendTemplateListResponse = {
	/** Pagination information */
	paging?: OmnisendEmailContentPagingResponse | null;
	/** List of email templates */
	templates?: Array<OmnisendTemplateListItem> | null;
};

/** Text preset for consistent typography */
export type OmnisendTextPreset = {
	/** Text preset unique identifier - must be unique within the template */
	id?: string | null;
	/** Text preset name */
	name?: string | null;
	/** Text preset styles */
	styles?: OmnisendTextStyle | null;
};

/** Text preset style properties */
export type OmnisendTextStyle = {
	/** Text preset color - hex color */
	color?: string | null;
	/** Text preset font family */
	fontFamily?: string | null;
	/** Text preset font size - from 3px to 100px */
	fontSize?: string | null;
	/** Text preset letter spacing - spacing between letters, from -1px to 120px */
	letterSpacing?: string | null;
	/** Text preset line height - unitless from 1 to 2 or percentage from 100% to 200% */
	lineHeight?: string | null;
};

/** Automation trigger configuration. */
export type OmnisendTrigger = {
	/** Audience filter group for contact eligibility */
	audienceFilterGroup?: OmnisendContactFilterGroup | null;
	/** Trigger condition — the event (and event-property filters) that triggers the automation workflow. */
	condition?: OmnisendTriggerCondition | null;
	/** Inactivity settings for the trigger */
	inactivitySettings?: OmnisendInactivitySettings | null;
};

/** Trigger condition — the event that triggers the automation workflow, together with optional event-property filters. The `event` field identifies what triggers the automation workflow. Most events are standard events received via the Events API (e.g. "placed order", "started checkout"). In… */
export type OmnisendTriggerCondition = {
	/** Event name that triggers the automation workflow */
	event?: string | null;
	/** Event filter groups — multiple groups are combined with AND logic. Each group combines its filters using the group's logicalOperator. */
	filterGroups?: Array<OmnisendEventFilterGroup> | null;
	/** Integration platform that generated the event (e.g. "shopify", "omnisend", "api"). Always populated for events received via the Events API — reflects the resolved origin, even when it was auto-selected because the event has a single origin. Empty for built-in trigger events and the "subscribed… */
	origin?: string | null;
};

/** UTM tracking tags for a single automation block. */
export type OmnisendUTMResponse = {
	/** UTM tag values */
	tags?: OmnisendUTMTags | null;
};

/** UTM tracking tag values. */
export type OmnisendUTMTags = {
	/** UTM campaign parameter */
	campaign?: string | null;
	/** UTM medium parameter */
	medium?: string | null;
	/** UTM source parameter */
	source?: string | null;
};

/** UTM variant entry for an A/B test campaign. */
export type OmnisendUTMVariant = {
	/** Variant campaign ID (read-only) */
	id?: string | null;
	/** UTM tags for this variant */
	tags?: OmnisendCampaignsUTMTags | null;
};

/** UTM variants for an A/B test campaign. */
export type OmnisendUTMVariants = {
	/** Variant A UTM settings */
	a?: OmnisendUTMVariant | null;
	/** Variant B UTM settings */
	b?: OmnisendUTMVariant | null;
};

/** Represents a universal layout in the external API */
export type OmnisendUniversalLayout = {
	/** Universal layout content - the section structure */
	content?: OmnisendSection | null;
	/** Universal layout created at (read-only) */
	createdAt?: string | null;
	/** Universal layout unique identifier (read-only) */
	id?: string | null;
	/** Universal layout name */
	name?: string | null;
	/** Universal layout snapshot state (read-only) */
	snapshotState?: string | null;
	/** Universal layout snapshot URL (read-only) */
	snapshotUrl?: string | null;
	/** Universal layout updated at (read-only) */
	updatedAt?: string | null;
};

/** Unsubscribe action configuration. Contacts reaching this block are unsubscribed from the selected channels. This changes the contact's subscription status across the brand, not just in this automation. After this block, later send blocks on the same channel no longer reach the contact when the… */
export type OmnisendUnsubscribeAction = {
	/** Channels to unsubscribe the contact from. At least one, each value at most once. */
	channels?: Array<string> | null;
};

/** Response returned after successfully updating a product category */
export type OmnisendUpdateCategoryResponse = {
	/** Product category unique identifier (read-only) */
	categoryID?: string | null;
};

/** URL match condition for clicked message filters. */
export type OmnisendUrlMatch = {
	/** URL match operator */
	operator?: string | null;
	/** URL string to match against */
	value?: string | null;
};

export type OmnisendVariant = {
	/** DefaultImageUrl is recommended if more than one image is needed. Other product images should be added to the Images array. */
	defaultImageUrl?: string | null;
	/** Description is a short description of the product. It can be used in the email body. */
	description?: string | null;
	id?: string | null;
	images?: Array<string> | null;
	price?: number | null;
	sku?: string | null;
	/** Status can be inStock, outOfStock, or notAvailable. We recommended to keep it in sync with your shop product to ensure that Omnisend can avoid sending out-of-stock products to your customers. */
	status?: string | null;
	/** StrikeThroughPrice is the price before the discount. */
	strikeThroughPrice?: number | null;
	title?: string | null;
	url?: string | null;
};

/** Video block for displaying a video in the email */
export type OmnisendVideo = {
	/** Video alt text - alternative text for the video for accessibility */
	altText?: string | null;
	/** Video ID - Omnisend video ID - can be retrieved from the Video API */
	id?: string | null;
	/** Video image - image of the video thumbnail; width is required when height is set */
	image?: OmnisendImage | null;
	/** Video link - where the video will redirect on click */
	link?: string | null;
};

/** Section device visibility. The section shows on one device only when exactly one flag is true; omitted visibility or no true flag shows it on all devices. When sent, visibility must set isMobileVisible or isDesktopVisible; a visibility with no true flag is not stored. */
export type OmnisendVisibility = {
	/** Whether the section is visible on desktop devices */
	isDesktopVisible?: boolean | null;
	/** Whether the section is visible on mobile devices */
	isMobileVisible?: boolean | null;
};

/** A single webhook HTTP header. */
export type OmnisendWebhookHeader = {
	/** Header name */
	key?: string | null;
	/** Header value. The configured value is returned verbatim under the read scope. */
	value?: string | null;
};

/** Response envelope for the POST/PUT write endpoints, echoing the stored event. */
export type OmnisendWriteEventResponse = {
	/** The stored event after the write was applied */
	event?: OmnisendEventItem | null;
};

export type OmnisendAnalyticsDimensionHeader = {
	granularity?: string | null;
	name?: string | null;
};

export type OmnisendAnalyticsMetricHeader = {
	name?: string | null;
};

export type OmnisendAnalyticsReportResultRow = Record<
	string,
	OmnisendJsonValue
>;

export type OmnisendReportsReportResponse = {
	reports?: Array<OmnisendReportsReportResult> | null;
};

export type OmnisendReportsReportResult = {
	alias?: string | null;
	dimensions?: Array<OmnisendAnalyticsDimensionHeader> | null;
	metrics?: Array<OmnisendAnalyticsMetricHeader> | null;
	rows?: Array<OmnisendAnalyticsReportResultRow> | null;
};

export type OmnisendStatisticsReportResponse = {
	statistics?: Array<OmnisendStatisticsReportResult> | null;
};

export type OmnisendStatisticsReportResult = {
	alias?: string | null;
	dimensions?: Array<OmnisendAnalyticsDimensionHeader> | null;
	metrics?: Array<OmnisendAnalyticsMetricHeader> | null;
	rows?: Array<OmnisendAnalyticsReportResultRow> | null;
};

export type OmnisendOperationInputs = {
	'analytics.generateReport': {
		queries?: Array<OmnisendReportsReportQueryInput>;
	};
	'analytics.generateStatistics': {
		queries?: Array<OmnisendStatisticsReportQueryInput>;
	};
	'automations.copy': {
		/** Automation workflow ID to copy (24 character hexadecimal) */
		id: string;
		/** Custom name for the copied automation workflow. When omitted, defaults to "Copy of: <original name>". */
		name?: string;
	};
	'automations.create': {
		/** Automation workflow blocks (actions, delays, splits, A/B tests). At least one block is required. */
		blocks: Array<OmnisendCreateBlockRequestInput>;
		/** Exit conditions. When a contact triggers any of these events, they are immediately removed from the workflow. Multiple exit conditions are evaluated with OR logic. */
		exitConditions?: Array<OmnisendExitConditionRequestInput>;
		/** Automation workflow name */
		name: string;
		/** Automation settings (sending thresholds, frequency, overlap, etc.). Omit to use engine defaults. */
		settings?: OmnisendCreateSettingsRequestInput;
		/** Trigger configuration */
		trigger: OmnisendCreateTriggerRequestInput;
	};
	'automations.delete': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
	};
	'automations.deleteSchedule': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
	};
	'automations.disable': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** What to do with contacts currently in the workflow */
		contactsInWorkflow: 'keep' | 'exit';
	};
	'automations.enable': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Whether to enroll contacts who already meet the trigger conditions. When omitted or false, only future trigger events are processed. When `enrollExisting=true`: - **Event-based triggers** (e.g. "placed order", "started checkout"): contacts whose trigger event occurred within the first delay… */
		enrollExisting?: boolean;
	};
	'automations.get': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
	};
	'automations.getBlockUtm': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Block identifier */
		blockID: string;
	};
	'automations.getSchedule': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
	};
	'automations.getUtm': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
	};
	'automations.list': {
		/** Number of items per page. Range: 1-250. Default: 100 */
		limit?: number;
		/** Opaque cursor for the next page */
		after?: string;
		/** Opaque cursor for the previous page */
		before?: string;
		/** Sort field. Default: createdAt */
		sort?: 'createdAt' | 'updatedAt';
		/** Sort direction. Default: desc */
		direction?: 'asc' | 'desc';
		/** If true, only enabled automations; if false, only disabled. Omit for no filter. */
		isEnabled?: boolean;
		/** Filter by name (partial match, max 200 characters) */
		nameContains?: string;
		/** Filter automations created after this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		createdAtFrom?: string;
		/** Filter automations created before this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		createdAtTo?: string;
		/** Filter automations updated after this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		updatedAtFrom?: string;
		/** Filter automations updated before this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		updatedAtTo?: string;
		/** Response shape. `summary` omits the heavy `blocks` tree from every item. Omit for the full representation. */
		view?: 'summary';
		/** Heavy sections to keep in summary view (repeatable or comma-separated): `blocks` (full workflow blocks tree). Only meaningful together with `view=summary`. */
		include?: Array<'blocks'>;
	};
	'automations.replaceBlocks': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Full block list. Replaces the entire block tree. At least one block is required. Blocks with id update existing blocks; blocks with temporaryID create new ones. Existing blocks not included in this array are removed. */
		blocks: Array<OmnisendUpdateBlockRequestInput>;
	};
	'automations.sendBlockTestEmail': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Block identifier */
		blockID: string;
		/** Email addresses to deliver the test email to (1 to 5 recipients). */
		recipients: Array<string>;
	};
	'automations.setBlockUtm': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Block identifier */
		blockID: string;
		/** UTM tag values */
		tags: OmnisendUTMTagsInputInput;
	};
	'automations.setSchedule': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** What to do at `endAt` with contacts currently in the workflow. Required when `endAt` is set. */
		contactsInWorkflow?: 'keep' | 'exit';
		/** Time to disable the workflow (RFC 3339). Seconds are truncated. Must be after `startAt`. */
		endAt?: string;
		/** Time to enable the workflow (RFC 3339). Seconds are truncated. Not allowed for an enabled workflow. */
		startAt?: string;
	};
	'automations.update': {
		/** Automation workflow ID (24 character hexadecimal) */
		id: string;
		/** Automation workflow blocks. Each entry updates an existing block matched by `id`; fields within each block are applied as a partial update. The array does **not** reshape the block list — adding or removing blocks is not supported through this endpoint (use the dedicated block endpoints for… */
		blocks?: Array<OmnisendPatchBlockRequestInput>;
		/** Exit condition list. Replaces all existing exit conditions when provided. Send `null` or an empty array (`[]`) to clear all exit conditions; omit to leave unchanged. */
		exitConditions?: Array<OmnisendExitConditionRequestInput>;
		/** Automation workflow name */
		name?: string;
		/** Automation settings patch. Only provided sub-fields are updated. */
		settings?: OmnisendPatchSettingsRequestInput;
		/** Trigger configuration. Only provided sub-fields are updated. */
		trigger?: OmnisendPatchTriggerRequestInput;
	};
	'batches.create': {
		endpoint: 'products' | 'contacts' | 'events' | 'categories';
		items: Array<OmnisendJsonValue>;
		method: 'POST' | 'PUT';
		origin?: string;
	};
	'batches.get': {
		/** Batch ID */
		batchID: string;
	};
	'batches.list': {
		/** Offset (minimum 0) */
		offset?: number;
		/** Limit (1-250) */
		limit?: number;
		/** Status */
		status?: 'pending' | 'inProgress' | 'finished' | 'stopped';
		/** Date from (format: yyyy-mm-dd) */
		dateFrom?: string;
		/** Date to (format: yyyy-mm-dd) */
		dateTo?: string;
		/** Endpoint */
		endpoint: 'products' | 'contacts' | 'events';
	};
	'batches.listItems': {
		/** Batch ID */
		batchID: string;
	};
	'brands.connect': {
		currency?: string;
		platform: string;
		version: string;
		website: string;
	};
	'brands.getCurrent': Record<string, never>;
	'campaigns.cancel': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.copy': {
		/** Campaign ID to copy (24 character hexadecimal) */
		id: string;
	};
	'campaigns.create': {
		/** A/B test configuration. Required when type is "abTest". Variants carry per-variant content; omit the top-level content field. */
		abTest?: OmnisendCreateABTestInput;
		/** Campaign audience. Included and excluded segments must not overlap */
		audience?: OmnisendAudienceInput;
		/** Booster settings. Required when type is "booster" */
		boosterSettings?: OmnisendCreateBoosterSettingsInput;
		/** Campaign message channel */
		channel: OmnisendCampaignChannelInput;
		/** Campaign content. Required for regular campaigns (not required for booster or abTest). Populated based on channel */
		content?: OmnisendCreateContentInput;
		/** Campaign language locale in xx_XX format. Optional; defaults to en_US when not provided. Must be a supported language when specified */
		language?: string;
		/** Campaign name. Required for regular and abTest campaigns (not required for booster) */
		name?: string;
		/** Campaign sending settings */
		sendingSettings?: OmnisendCreateSendingSettingsInput;
		/** Campaign type. When `type` is `booster`, there are two supported flows: Flow 1 — draft parent + draft booster: Create a draft parent campaign, then create a draft booster for it (set `boosterSettings.delay` to control when it fires). Send the parent; the booster is scheduled automatically based… */
		type: 'regular' | 'booster' | 'abTest';
	};
	'campaigns.delete': {
		/** Campaign ID */
		id: string;
	};
	'campaigns.get': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.getUtm': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.list': {
		/** Number of items per page. Range: 1-250. Default: 100 */
		limit?: number;
		/** Opaque cursor for the next page */
		after?: string;
		/** Opaque cursor for the previous page */
		before?: string;
		/** Sort field. Default: createdAt */
		sort?: 'createdAt' | 'updatedAt' | 'name';
		/** Sort direction. Default: desc */
		direction?: 'asc' | 'desc';
		/** Filter by status (repeatable for OR logic) */
		status?: Array<
			| 'error'
			| 'onHold'
			| 'sent'
			| 'paused'
			| 'started'
			| 'stopped'
			| 'expired'
			| 'draft'
			| 'scheduled'
			| 'canceled'
		>;
		/** Filter by name (partial match, max 200 characters) */
		nameContains?: string;
		/** Filter by message channel (repeatable for OR logic) */
		channel?: Array<'email' | 'sms' | 'push'>;
		/** Filter by campaign type. Use `booster` to list only boosters, `abTest` to list only A/B test parents. */
		type?: 'regular' | 'booster' | 'abTest';
		/** Filter to boosters of the given parent campaign ID. Implies type=booster. */
		parentCampaignID?: string;
		/** Filter campaigns created after this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		createdAtFrom?: string;
		/** Filter campaigns created before this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		createdAtTo?: string;
		/** Filter campaigns updated after this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		updatedAtFrom?: string;
		/** Filter campaigns updated before this timestamp (ISO 8601, e.g. 2026-01-01T00:00:00Z) */
		updatedAtTo?: string;
		/** Response shape. `summary` omits the heavy `content` and `abTest` sections from every item. Omit for the full representation. */
		view?: 'summary';
		/** Heavy sections to keep in summary view (repeatable or comma-separated): `content` (full email/SMS/push content), `abTest` (A/B variants, settings and result). Only meaningful together with `view=summary`. */
		include?: Array<'content' | 'abTest'>;
	};
	'campaigns.restoreToDraft': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.resumeAbTest': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.selectAbTestWinner': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
		/** ID of the variant to promote as the winner */
		variantID: string;
	};
	'campaigns.send': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.sendTestEmail': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
		/** Email addresses that receive the test send. Between 1 and 5 addresses. */
		recipients: Array<string>;
	};
	'campaigns.setUtm': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
		/** Tags for a regular campaign — omit for A/B campaigns */
		tags?: OmnisendCampaignsUTMTagsInput;
		/** Variants for an A/B test campaign — omit for regular campaigns */
		variants?: OmnisendUTMVariantsUpdateInput;
	};
	'campaigns.stopAbTest': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
	};
	'campaigns.update': {
		/** Campaign ID (24 character hexadecimal) */
		id: string;
		/** A/B test settings. Only applicable to A/B campaigns (campaigns with type "abTest"). Full replacement — all provided variant and setting fields replace existing values. templateID / contentID are excluded: templates are set at create time and cannot be changed via PATCH. */
		abTest?: OmnisendUpdateABTestInput;
		/** Campaign audience. Included and excluded segments must not overlap */
		audience?: OmnisendAudienceInput;
		/** Booster-specific settings. Only applicable to booster campaigns (campaigns with type "booster"). */
		boosterSettings?: OmnisendUpdateBoosterSettingsInput;
		/** Campaign content. Only specified fields will be updated */
		content?: OmnisendUpdateContentInput;
		/** Campaign language locale in xx_XX format. Must be a supported language */
		language?: string;
		/** Campaign name */
		name?: string;
		/** Campaign sending settings. Full object replacement - all fields must be provided when updating */
		sendingSettings?: OmnisendUpdateSendingSettingsInput;
	};
	'categories.create': {
		/** Product category unique identifier. Range: 1-100 characters */
		categoryID: string;
		/** Product category name. Max 255 characters */
		title: string;
	};
	'categories.delete': {
		/** Product category ID */
		categoryID: string;
	};
	'categories.get': {
		/** Product category ID */
		categoryID: string;
	};
	'categories.list': {
		/** Offset */
		offset?: number;
		/** Limit */
		limit?: number;
		/** Sort by */
		sort?: 'title' | 'updatedAt' | 'createdAt';
	};
	'categories.update': {
		/** Product category ID */
		categoryID: string;
		/** Product category name. Max 255 characters */
		title: string;
	};
	'contacts.addTags': {
		/** Contact IDs to add tags to */
		contactIDs?: Array<string>;
		/** Emails of contacts to add tags to */
		emails?: Array<string>;
		/** Phone numbers of contacts to add tags to, in E.164 format */
		phones?: Array<string>;
		/** Segment ID whose contacts get the tags */
		segmentID?: string;
		/** Tags to add */
		tags: Array<string>;
	};
	'contacts.get': {
		/** Contact ID */
		id: string;
	};
	'contacts.list': {
		/** Number of items per page. Range: 1-250. Default: 100 */
		limit?: number;
		/** Opaque cursor for fetching the next page (from paging.cursors.after) */
		after?: string;
		/** Opaque cursor for fetching the previous page (from paging.cursors.before) */
		before?: string;
		/** Sort field. Default: createdAt */
		sort?: 'createdAt' | 'updatedAt';
		/** Sort direction. Default: desc */
		direction?: 'asc' | 'desc';
		/** Filter by email address */
		email?: string;
		/** Filter by phone number */
		phone?: string;
		/** Contact subscription status filter. Cannot be combined with tag */
		status?: 'subscribed' | 'unsubscribed' | 'nonSubscribed';
		/** Filter by segment ID */
		segmentID?: string;
		/** Filter by tag. Cannot be combined with status */
		tag?: string;
		/** Filter contacts updated at or after this RFC3339 timestamp. Cannot be combined with email, phone, status, segmentID, or tag */
		updatedAtFrom?: string;
	};
	'contacts.removeTags': {
		/** Contact IDs to remove tags from */
		contactIDs?: Array<string>;
		/** Emails of contacts to remove tags from */
		emails?: Array<string>;
		/** Phone numbers of contacts to remove tags from, in E.164 format */
		phones?: Array<string>;
		/** Segment ID whose contacts lose the tags */
		segmentID?: string;
		/** Tags to remove */
		tags: Array<string>;
	};
	'contacts.update': {
		/** Contact ID */
		id: string;
		/** Street, house number, apartment number. */
		address?: string;
		/** Contact birthdate in YYYY-MM-DD format */
		birthdate?: string;
		/** City */
		city?: string;
		/** Country name. Used to derive ISO country code when countryCode is not provided */
		country?: string;
		/** ISO 3166-1 alpha-2 country code. Takes priority over country when both are provided */
		countryCode?: string;
		/** Contact creation timestamp. If provided, stored as "externalCreated" custom property */
		createdAt?: string;
		/** You can add your own custom properties. Read more in https://api-docs.omnisend.com/reference/contacts#custom-properties */
		customProperties?: Record<string, OmnisendJsonValue>;
		/** Contact first name */
		firstName?: string;
		/** Contact gender. m - male, f - female */
		gender?: 'm' | 'f';
		/** Contact identifiers (email and/or phone) */
		identifiers?: Array<OmnisendContactIdentifierRequestInput>;
		/** Contact last name */
		lastName?: string;
		/** Postal or zip code */
		postalCode?: string;
		/** State or region */
		state?: string;
		/** Labels assigned to the contact. When creating a contact, it is strongly advised to include a source tag, e.g. "source: shopify". */
		tags?: Array<string>;
		/** Contact-level tracking consents */
		trackingConsents?: OmnisendContactTrackingConsentsRequestInput;
	};
	'contacts.updateByEmail': {
		/** Contact email address */
		email: string;
		/** Street, house number, apartment number. */
		address?: string;
		/** Contact birthdate in YYYY-MM-DD format */
		birthdate?: string;
		/** City */
		city?: string;
		/** Country name. Used to derive ISO country code when countryCode is not provided */
		country?: string;
		/** ISO 3166-1 alpha-2 country code. Takes priority over country when both are provided */
		countryCode?: string;
		/** Contact creation timestamp. If provided, stored as "externalCreated" custom property */
		createdAt?: string;
		/** You can add your own custom properties. Read more in https://api-docs.omnisend.com/reference/contacts#custom-properties */
		customProperties?: Record<string, OmnisendJsonValue>;
		/** Contact first name */
		firstName?: string;
		/** Contact gender. m - male, f - female */
		gender?: 'm' | 'f';
		/** Contact identifiers (email and/or phone) */
		identifiers?: Array<OmnisendContactIdentifierRequestInput>;
		/** Contact last name */
		lastName?: string;
		/** Postal or zip code */
		postalCode?: string;
		/** State or region */
		state?: string;
		/** Labels assigned to the contact. When creating a contact, it is strongly advised to include a source tag, e.g. "source: shopify". */
		tags?: Array<string>;
		/** Contact-level tracking consents */
		trackingConsents?: OmnisendContactTrackingConsentsRequestInput;
	};
	'contacts.upsert': {
		/** Street, house number, apartment number. */
		address?: string;
		/** Contact birthdate in YYYY-MM-DD format */
		birthdate?: string;
		/** City */
		city?: string;
		/** Country name. Used to derive ISO country code when countryCode is not provided */
		country?: string;
		/** ISO 3166-1 alpha-2 country code. Takes priority over country when both are provided */
		countryCode?: string;
		/** Contact creation timestamp. If provided, stored as "externalCreated" custom property */
		createdAt?: string;
		/** You can add your own custom properties. Read more in https://api-docs.omnisend.com/reference/contacts#custom-properties */
		customProperties?: Record<string, OmnisendJsonValue>;
		/** Contact first name */
		firstName?: string;
		/** Contact gender. m - male, f - female */
		gender?: 'm' | 'f';
		/** Contact identifiers (email and/or phone) */
		identifiers?: Array<OmnisendContactIdentifierRequestInput>;
		/** Contact last name */
		lastName?: string;
		/** Postal or zip code */
		postalCode?: string;
		/** State or region */
		state?: string;
		/** Labels assigned to the contact. When creating a contact, it is strongly advised to include a source tag, e.g. "source: shopify". */
		tags?: Array<string>;
		/** Contact-level tracking consents */
		trackingConsents?: OmnisendContactTrackingConsentsRequestInput;
	};
	'contentTranslations.listLanguages': Record<string, never>;
	'emailContent.get': {
		/** Content ID (24 character hexadecimal) */
		id: string;
	};
	'emailContent.render': {
		/** Content ID (24 character hexadecimal) */
		id: string;
	};
	'emailContent.replace': {
		/** Content ID (24 character hexadecimal) */
		id: string;
		/** Content general settings - global and template level styles */
		generalSettings?: OmnisendGeneralSettingsInput;
		/** Content sections */
		sections?: Array<OmnisendSectionInput>;
	};
	'events.defineSchema': {
		/** Human-readable label. Required on POST; omit on PUT to keep the stored value. */
		displayName?: string;
		/** Machine-readable event name */
		name: string;
		/** Single origin the schema belongs to */
		origin: string;
		/** Property tree keyed by property name. Required with at least one key on POST; on PUT only the keys present are merged. */
		properties?: Record<string, OmnisendWritePropertyNodeInput>;
	};
	'events.queryMetadata': {
		/** Event category, resolved against the requested Omnisend-Version */
		category: 'automations' | 'events' | 'segments';
		/** Optional list of event names to filter by */
		events?: Array<string>;
		/** When true, brand-custom events are omitted. When false or omitted, custom events are included. Set this to `true` when only well-known events are needed, for a more predictable response size. */
		excludeCustomEvents?: boolean;
		/** When true, response items include the nested property tree. When false or omitted, only event-level metadata is returned. */
		includeProperties?: boolean;
		/** Optional list of origins to filter by (OR-combined) */
		origins?: Array<string>;
	};
	'events.send': {
		/** Contact information, contact will be created or updated based on the data provided here. */
		contact?: OmnisendContactDtoContactInput;
		/** UUID of the event (v4, v5, v6, v7). Along with 'eventTime' used for historical event deduplication (not working on real-time events used for automations). If not provided, it will be generated automatically. */
		eventID?: string;
		/** Check event documentation to find what event names you need to specify for each event. */
		eventName?: string;
		/** ISO 8601 timestamp. Accepts RFC 3339 (e.g. "2021-07-01T00:00:00Z") and the space-separated form "YYYY-MM-DD HH:MM:SS±HH:MM" (e.g. "2021-07-01 00:00:00+02:00"). Timestamps earlier than UTC midnight 10 years before the current date are rejected. Optional; defaults to current time. */
		eventTime?: string;
		/** Required ONLY for recommended events. Check event documentation to find what version you need to specify for each event. For custom events you should leave it empty. */
		eventVersion?: string;
		/** It should be based on the source of event API. If you are building platform or app integration it should have dedicated origin. Otherwise it should be "api". */
		origin?: string;
		/** Event properties, you can check events guides section to see what recommended properties you should provide for each event. Not providing recommending properties can result some of the features not working properly. */
		properties?: Record<string, OmnisendJsonValue>;
	};
	'events.updateSchema': {
		/** Human-readable label. Required on POST; omit on PUT to keep the stored value. */
		displayName?: string;
		/** Machine-readable event name */
		name: string;
		/** Single origin the schema belongs to */
		origin: string;
		/** Property tree keyed by property name. Required with at least one key on POST; on PUT only the keys present are merged. */
		properties?: Record<string, OmnisendWritePropertyNodeInput>;
	};
	'formAbSetups.create': {
		/** Main form unique identifier */
		formID: string;
		/** Two competing form variants. When omitted, both variants use a weight of 50 */
		versions?: Array<OmnisendCreateAbSetupVersionInput>;
	};
	'formAbSetups.delete': {
		/** Form A/B setup ID */
		abSetupID: string;
	};
	'formAbSetups.get': {
		/** Form A/B setup ID */
		abSetupID: string;
	};
	'formAbSetups.list': {
		/** Page size (1-250) */
		limit?: number;
		/** Cursor for next page (base64-encoded, obtained from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, obtained from previous response) */
		before?: string;
		/** Sort field (only needed on first request) */
		sort?: 'createdAt' | 'launchedAt' | 'enabledAt' | 'updatedAt';
		/** Sort direction (only needed on first request) */
		direction?: 'asc' | 'desc';
		/** Filter by status */
		status?: 'draft' | 'enabled' | 'disabled';
	};
	'formAbSetups.selectWinner': {
		/** Form A/B setup ID */
		abSetupID: string;
		/** Winner version form ID. */
		versionFormID: string;
	};
	'formAbSetups.start': {
		/** Form A/B setup ID */
		abSetupID: string;
		/** Optional auto-close policy applied when the test starts. Omit for a test that never closes automatically. */
		autoClose?: OmnisendAbSetupAutoCloseInput;
	};
	'formTemplates.get': {
		/** Template ID */
		templateID: string;
	};
	'formTemplates.list': {
		/** Page size (1-250) */
		limit?: number;
		/** Cursor for next page (base64-encoded, obtained from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, obtained from previous response) */
		before?: string;
		/** Sort field (only needed on first request) */
		sort?: 'createdAt';
		/** Sort direction (only needed on first request) */
		direction?: 'asc' | 'desc';
		/** Filter by display type */
		displayType?:
			| 'popup'
			| 'landingPage'
			| 'embedded'
			| 'flyout'
			| 'fullscreen';
	};
	'formTemplates.render': {
		/** Template ID */
		templateID: string;
	};
	'forms.create': {
		/** Auto-redirect configuration applied after submission */
		autoRedirect?: OmnisendFormAutoRedirectInput;
		/** Click-outside-to-close behavior */
		clickOutside?: OmnisendFormClickOutsideInput;
		/** Tags applied to contacts who submit the form */
		contactTags?: Array<string>;
		/** Form content */
		content: OmnisendFormContentInput;
		/** Form display type */
		displayType: 'popup' | 'landingPage' | 'embedded' | 'flyout' | 'fullscreen';
		/** Double opt-in configuration */
		doubleOptIn?: OmnisendFormDoubleOptInInput;
		/** Form name */
		name: string;
		/** reCAPTCHA protection settings */
		recaptcha?: OmnisendFormRecaptchaSettingsInput;
		/** Social media sharing metadata */
		socialMediaSharing?: OmnisendFormSocialMediaSharingInput;
		/** Form targeting rules */
		targeting?: OmnisendFormTargetingInput;
	};
	'forms.delete': {
		/** Form ID */
		formID: string;
	};
	'forms.disable': {
		/** Form ID */
		formID: string;
	};
	'forms.enable': {
		/** Form ID */
		formID: string;
	};
	'forms.get': {
		/** Form ID */
		formID: string;
	};
	'forms.getPeriodicReport': {
		/** Form ID (24 character hexadecimal) */
		formID: string;
		/** Start of the date range, inclusive (RFC3339, e.g. 2024-01-01T00:00:00Z) */
		createdAtFrom: string;
		/** End of the date range, inclusive (RFC3339, e.g. 2024-01-31T23:59:59Z) */
		createdAtTo: string;
		/** Time bucket granularity */
		granularity?: 'hour' | 'day' | 'week' | 'month' | 'year';
	};
	'forms.getReport': {
		/** Form ID (24 character hexadecimal) */
		formID: string;
		/** Start of the date range, inclusive (RFC3339, e.g. 2024-01-01T00:00:00Z) */
		createdAtFrom: string;
		/** End of the date range, inclusive (RFC3339, e.g. 2024-01-31T23:59:59Z) */
		createdAtTo: string;
	};
	'forms.list': {
		/** Page size (1-250) */
		limit?: number;
		/** Cursor for next page (base64-encoded, obtained from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, obtained from previous response) */
		before?: string;
		/** Sort field (only needed on first request) */
		sort?: 'createdAt' | 'updatedAt' | 'name';
		/** Sort direction (only needed on first request) */
		direction?: 'asc' | 'desc';
	};
	'forms.listAbSetupReports': {
		/** Form ID (24 character hexadecimal) */
		formID: string;
	};
	'forms.listContacts': {
		/** Form ID (24 character hexadecimal) */
		formID: string;
		/** Number of items to return (max 250) */
		limit?: number;
		/** Sort field. Contacts are ordered by contact creation time embedded in the contact ID. Note: the response 'date' field reflects when the contact submitted this form (signup time) and may differ from the sort key for existing subscribers. */
		sort?: 'createdAt';
		/** Sort direction */
		direction?: 'asc' | 'desc';
		/** Cursor for forward pagination */
		after?: string;
		/** Cursor for backward pagination */
		before?: string;
	};
	'forms.render': {
		/** Form ID */
		formID: string;
	};
	'forms.update': {
		/** Form ID */
		formID: string;
		/** Auto-redirect configuration applied after submission */
		autoRedirect?: OmnisendFormAutoRedirectInput | null;
		/** Click-outside-to-close behavior */
		clickOutside?: OmnisendFormClickOutsideInput | null;
		/** Tags applied to contacts who submit the form */
		contactTags?: Array<string> | null;
		/** Form content */
		content?: OmnisendFormContentInput;
		/** Form display type */
		displayType?:
			| 'popup'
			| 'landingPage'
			| 'embedded'
			| 'flyout'
			| 'fullscreen';
		/** Double opt-in configuration */
		doubleOptIn?: OmnisendFormDoubleOptInInput | null;
		/** Form name */
		name?: string;
		/** reCAPTCHA protection settings */
		recaptcha?: OmnisendFormRecaptchaSettingsInput | null;
		/** Social media sharing metadata */
		socialMediaSharing?: OmnisendFormSocialMediaSharingInput | null;
		/** Form targeting rules */
		targeting?: OmnisendFormTargetingInput;
	};
	'images.delete': {
		/** Image ID */
		id: string;
	};
	'images.get': {
		/** Image ID */
		id: string;
	};
	'images.list': {
		/** Number of images per page (1-250) */
		limit?: number;
		/** Cursor for next page (base64-encoded, from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, from previous response) */
		before?: string;
		/** Field to sort by */
		sort?: 'createdAt' | 'name';
		/** Sort order */
		direction?: 'asc' | 'desc';
		/** Filter images by name (partial match, case-insensitive, max 200 characters) */
		nameContains?: string;
	};
	'images.upload': {
		/** Image file to upload (JPEG, PNG, GIF, or WebP, max 5MB) */
		file: FileInput;
		/** Custom name for the image. Defaults to the filename if not provided */
		name?: string;
	};
	'images.uploadFromUrl': {
		/** Custom name for the image. If not provided, the filename will be extracted from the URL */
		name?: string;
		/** URL of the image to upload. Must be publicly accessible (HTTPS, PNG, JPEG, GIF, or WebP, max 5MB) */
		url: string;
	};
	'products.create': {
		categoryIDs?: Array<string>;
		createdAt?: string;
		currency: string;
		/** DefaultImageUrl is recommended if more than one image is needed. Other product images should be added to the Images array. */
		defaultImageUrl?: string;
		/** Description is a short description of the product. It can be used in the email body. */
		description?: string;
		id: string;
		images?: Array<string>;
		/** Status can be inStock, outOfStock, or notAvailable. We recommended to keep it in sync with your shop product to ensure that Omnisend can avoid sending out-of-stock products to your customers. */
		status: 'inStock' | 'outOfStock' | 'notAvailable';
		/** Tags can be used to categorize products. */
		tags?: Array<string>;
		title: string;
		/** Product type can be used to categorize products. */
		type?: string;
		updatedAt?: string;
		/** Url should point to the product page on the website. */
		url: string;
		/** Product variants are different versions of the same product. For example, a T-shirt can have different sizes and colors. */
		variants?: Array<OmnisendVariantInput>;
		/** Vendor is the manufacturer or the brand of the product. */
		vendor?: string;
	};
	'products.delete': {
		/** Product ID */
		productID: string;
	};
	'products.get': {
		/** Product ID */
		productID: string;
	};
	'products.list': {
		/** Offset */
		offset?: number;
		/** Limit */
		limit?: number;
		/** Sort by */
		sort?: 'date' | 'updatedAt' | 'createdAt';
		/** Filter by products whose title contains this value (case-insensitive) */
		titleContains?: string;
	};
	'products.replace': {
		/** Product ID */
		productID: string;
		categoryIDs?: Array<string>;
		createdAt?: string;
		currency: string;
		/** DefaultImageUrl is recommended if more than one image is needed. Other product images should be added to the Images array. */
		defaultImageUrl?: string;
		/** Description is a short description of the product. It can be used in the email body. */
		description?: string;
		id: string;
		images?: Array<string>;
		/** Status can be inStock, outOfStock, or notAvailable. We recommended to keep it in sync with your shop product to ensure that Omnisend can avoid sending out-of-stock products to your customers. */
		status: 'inStock' | 'outOfStock' | 'notAvailable';
		/** Tags can be used to categorize products. */
		tags?: Array<string>;
		title: string;
		/** Product type can be used to categorize products. */
		type?: string;
		updatedAt?: string;
		/** Url should point to the product page on the website. */
		url: string;
		/** Product variants are different versions of the same product. For example, a T-shirt can have different sizes and colors. */
		variants?: Array<OmnisendVariantInput>;
		/** Vendor is the manufacturer or the brand of the product. */
		vendor?: string;
	};
	'segments.create': {
		/** Condition groups defining the segment rules */
		conditionGroups: Array<OmnisendSegmentConditionGroupInput>;
		/** Name of the segment */
		name: string;
	};
	'segments.delete': {
		/** Segment ID */
		segmentID: string;
	};
	'segments.get': {
		/** Segment ID (24 character hexadecimal) */
		segmentID: string;
	};
	'segments.getStatistics': {
		/** Segment ID (24 character hexadecimal) */
		segmentID: string;
	};
	'segments.list': {
		/** Page size (1-250) */
		limit?: number;
		/** Cursor for next page (base64-encoded, obtained from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, obtained from previous response) */
		before?: string;
		/** Sort field (only needed on first request) */
		sort?: 'createdAt' | 'name';
		/** Sort direction (only needed on first request) */
		direction?: 'asc' | 'desc';
	};
	'segments.replace': {
		/** Segment ID */
		segmentID: string;
		/** Condition groups defining the segment rules */
		conditionGroups: Array<OmnisendSegmentConditionGroupInput>;
		/** Name of the segment */
		name: string;
	};
	'templates.create': {
		/** Template general settings - global and template level styles */
		generalSettings?: OmnisendGeneralSettingsInput;
		/** Template name */
		name?: string;
		/** Template sections */
		sections?: Array<OmnisendSectionInput>;
	};
	'templates.delete': {
		/** Email Template ID (24 character hexadecimal) */
		id: string;
	};
	'templates.get': {
		/** Email Template ID (24 character hexadecimal) */
		id: string;
	};
	'templates.importFromHtml': {
		/** Raw HTML content to import */
		html: string;
		/** Template name */
		name: string;
	};
	'templates.list': {
		/** Number of items per page (1-100, default 50) */
		limit?: number;
		/** Cursor for next page (base64-encoded, from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, from previous response) */
		before?: string;
		/** Sort field (createdAt, name; default createdAt) */
		sort?: 'createdAt' | 'name';
		/** Sort direction (asc, desc; default desc) */
		direction?: 'asc' | 'desc';
		/** Filter templates by name (case-insensitive partial match, max 200 characters) */
		nameContains?: string;
	};
	'templates.render': {
		/** Email Template ID (24 character hexadecimal) */
		id: string;
	};
	'templates.replace': {
		/** Email Template ID (24 character hexadecimal) */
		id: string;
		/** Template general settings - global and template level styles */
		generalSettings?: OmnisendGeneralSettingsInput;
		/** Template name */
		name?: string;
		/** Template sections */
		sections?: Array<OmnisendSectionInput>;
	};
	'universalLayouts.create': {
		/** Universal layout content - the section structure */
		content?: OmnisendSectionInput;
		/** Universal layout name */
		name?: string;
	};
	'universalLayouts.delete': {
		/** Universal Layout ID (24 character hexadecimal) */
		id: string;
	};
	'universalLayouts.get': {
		/** Universal Layout ID (24 character hexadecimal) */
		id: string;
	};
	'universalLayouts.list': {
		/** Number of items per page (1-250, default 100) */
		limit?: number;
		/** Cursor for next page (base64-encoded, from previous response) */
		after?: string;
		/** Cursor for previous page (base64-encoded, from previous response) */
		before?: string;
		/** Filter layouts by name (case-insensitive partial match, max 200 characters) */
		nameContains?: string;
	};
	'universalLayouts.replace': {
		/** Universal Layout ID (24 character hexadecimal) */
		id: string;
		/** Universal layout content - the section structure */
		content?: OmnisendSectionInput;
		/** Universal layout name */
		name?: string;
	};
};

export type OmnisendOperationOutputs = {
	'analytics.generateReport': OmnisendReportsReportResponse;
	'analytics.generateStatistics': OmnisendStatisticsReportResponse;
	'automations.copy': OmnisendAutomation;
	'automations.create': OmnisendAutomation;
	'automations.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'automations.deleteSchedule': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'automations.disable': OmnisendAutomation;
	'automations.enable': OmnisendAutomation;
	'automations.get': OmnisendAutomation;
	'automations.getBlockUtm': OmnisendUTMResponse;
	'automations.getSchedule':
		| OmnisendAutomationSchedule
		| {
				/** Omnisend accepted the call; it answered with no body. */ success: true;
		  };
	'automations.getUtm': OmnisendAggregateUTMResponse;
	'automations.list': OmnisendListAutomationsResponse;
	'automations.replaceBlocks': OmnisendAutomation;
	'automations.sendBlockTestEmail': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'automations.setBlockUtm': OmnisendUTMResponse;
	'automations.setSchedule': OmnisendSaveAutomationScheduleResponse;
	'automations.update': OmnisendAutomation;
	'batches.create': OmnisendCreateBatchResponse;
	'batches.get': OmnisendBatch;
	'batches.list': OmnisendListBatchesResponse;
	'batches.listItems': OmnisendBatch;
	'brands.connect': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'brands.getCurrent': FileOutput;
	'campaigns.cancel': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.copy': OmnisendCampaign;
	'campaigns.create': OmnisendCampaign;
	'campaigns.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.get': OmnisendCampaign;
	'campaigns.getUtm': OmnisendCampaignsUTMResponse;
	'campaigns.list': OmnisendCampaignsResponse;
	'campaigns.restoreToDraft': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.resumeAbTest': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.selectAbTestWinner': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.send': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.sendTestEmail': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.setUtm': OmnisendCampaignsUTMResponse;
	'campaigns.stopAbTest': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'campaigns.update': OmnisendCampaign;
	'categories.create': OmnisendCreateCategoryResponse;
	'categories.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'categories.get': OmnisendGetCategoryResponse;
	'categories.list': OmnisendGetCategoriesResponse;
	'categories.update': OmnisendUpdateCategoryResponse;
	'contacts.addTags': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.get': OmnisendContactResponse;
	'contacts.list': OmnisendListContactsResponse;
	'contacts.removeTags': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'contacts.update': OmnisendContactResponse;
	'contacts.updateByEmail': OmnisendContactResponse;
	'contacts.upsert': OmnisendContactResponse;
	'contentTranslations.listLanguages': OmnisendStoreLanguagesResponse;
	'emailContent.get': OmnisendEmailContentContent;
	'emailContent.render': Record<string, string>;
	'emailContent.replace': OmnisendEmailContentContent;
	'events.defineSchema': OmnisendWriteEventResponse;
	'events.queryMetadata': OmnisendEventsResponse;
	'events.send': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'events.updateSchema': OmnisendWriteEventResponse;
	'formAbSetups.create': OmnisendAbSetup;
	'formAbSetups.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'formAbSetups.get': OmnisendAbSetup;
	'formAbSetups.list': OmnisendAbSetupsResponse;
	'formAbSetups.selectWinner': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'formAbSetups.start': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'formTemplates.get': OmnisendFormsTemplate;
	'formTemplates.list': OmnisendListTemplatesResponse;
	'formTemplates.render': OmnisendRenderFormResponse;
	'forms.create': OmnisendForm;
	'forms.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'forms.disable': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'forms.enable': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'forms.get': OmnisendForm;
	'forms.getPeriodicReport': OmnisendFormPeriodicReportResponse;
	'forms.getReport': OmnisendFormSummaryReportResponse;
	'forms.list': OmnisendListFormsResponse;
	'forms.listAbSetupReports': OmnisendFormAbSetupReportsResponse;
	'forms.listContacts': OmnisendFormContactListResponse;
	'forms.render': OmnisendRenderFormResponse;
	'forms.update': OmnisendForm;
	'images.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'images.get': OmnisendImagesImage;
	'images.list': OmnisendListResponse;
	'images.upload': OmnisendImagesImage;
	'images.uploadFromUrl': OmnisendImagesImage;
	'products.create': OmnisendCreateProductResponse;
	'products.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'products.get': OmnisendProductsProduct;
	'products.list': OmnisendListProductsResponse;
	'products.replace': OmnisendReplaceProductResponse;
	'segments.create': OmnisendGetSegmentResponse;
	'segments.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'segments.get': OmnisendGetSegmentResponse;
	'segments.getStatistics': OmnisendGetSegmentStatisticsResponse;
	'segments.list': OmnisendListSegmentsResponse;
	'segments.replace': OmnisendGetSegmentResponse;
	'templates.create': OmnisendTemplate;
	'templates.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'templates.get': OmnisendTemplate;
	'templates.importFromHtml': OmnisendTemplate;
	'templates.list': OmnisendTemplateListResponse;
	'templates.render': Record<string, string>;
	'templates.replace': OmnisendTemplate;
	'universalLayouts.create': OmnisendUniversalLayout;
	'universalLayouts.delete': {
		/** Omnisend accepted the call; it answered with no body. */
		success: true;
	};
	'universalLayouts.get': OmnisendUniversalLayout;
	'universalLayouts.list': OmnisendListUniversalLayoutsResponse;
	'universalLayouts.replace': OmnisendUniversalLayout;
};
