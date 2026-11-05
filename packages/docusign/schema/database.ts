import { z } from 'zod';

// Nested DocuSign sub-objects (addresses, tabs, branding blocks) are stored as JSON.
const JsonObject = z.record(z.string(), z.json());
const JsonList = z.array(JsonObject);

/**
 * Envelope as returned by `Envelopes: get` and the `Envelopes: create` summary.
 * https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopes/get/
 */
export const DocusignEnvelope = z.object({
	envelopeId: z.string(),
	status: z.string().optional(),
	emailSubject: z.string().optional(),
	emailBlurb: z.string().optional(),
	uri: z.string().optional(),
	envelopeUri: z.string().optional(),
	documentsUri: z.string().optional(),
	recipientsUri: z.string().optional(),
	templatesUri: z.string().optional(),
	customFieldsUri: z.string().optional(),
	notificationUri: z.string().optional(),
	attachmentsUri: z.string().optional(),
	brandId: z.string().optional(),
	allowMarkup: z.string().optional(),
	allowReassign: z.string().optional(),
	allowViewHistory: z.string().optional(),
	enableWetSign: z.string().optional(),
	isSignatureProviderEnvelope: z.string().optional(),
	purgeState: z.string().optional(),
	voidedReason: z.string().optional(),
	createdDateTime: z.string().optional(),
	sentDateTime: z.string().optional(),
	deliveredDateTime: z.string().optional(),
	completedDateTime: z.string().optional(),
	declinedDateTime: z.string().optional(),
	voidedDateTime: z.string().optional(),
	deletedDateTime: z.string().optional(),
	initialSentDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
	statusChangedDateTime: z.string().optional(),
	statusDateTime: z.string().optional(),
	sender: JsonObject.optional(),
	customFields: JsonObject.optional(),
	notification: JsonObject.optional(),
});

/**
 * Recipient of an envelope, flattened from the `Recipients` object returned by
 * `EnvelopeRecipients: list`. `recipientType` is the key of the array it came
 * from (signers, carbonCopies, agents, ...).
 * https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/enveloperecipients/list/
 */
export const DocusignRecipient = z.object({
	envelopeId: z.string(),
	recipientId: z.string(),
	recipientType: z.string(),
	recipientIdGuid: z.string().optional(),
	name: z.string().optional(),
	userName: z.string().optional(),
	email: z.string().optional(),
	roleName: z.string().optional(),
	routingOrder: z.string().optional(),
	status: z.string().optional(),
	clientUserId: z.string().optional(),
	userId: z.string().optional(),
	note: z.string().optional(),
	deliveryMethod: z.string().optional(),
	declinedReason: z.string().optional(),
	sentDateTime: z.string().optional(),
	deliveredDateTime: z.string().optional(),
	signedDateTime: z.string().optional(),
	declinedDateTime: z.string().optional(),
	tabs: JsonObject.optional(),
});

/**
 * Document of an envelope, from `EnvelopeDocuments: list`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/envelopes/envelopedocuments/list/
 */
export const DocusignDocument = z.object({
	envelopeId: z.string(),
	documentId: z.string(),
	documentIdGuid: z.string().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	uri: z.string().optional(),
	order: z.string().optional(),
	display: z.string().optional(),
	includeInDownload: z.string().optional(),
	signerMustAcknowledge: z.string().optional(),
	templateRequired: z.string().optional(),
	containsPdfFormFields: z.string().optional(),
	pages: JsonList.optional(),
});

/**
 * Template, from `Templates: list` and `Templates: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/templates/templates/get/
 */
export const DocusignTemplate = z.object({
	templateId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	uri: z.string().optional(),
	shared: z.string().optional(),
	pageCount: z.number().optional(),
	folderId: z.string().optional(),
	folderName: z.string().optional(),
	folderUri: z.string().optional(),
	emailSubject: z.string().optional(),
	emailBlurb: z.string().optional(),
	created: z.string().optional(),
	lastModified: z.string().optional(),
	lastUsed: z.string().optional(),
	owner: JsonObject.optional(),
	recipients: JsonObject.optional(),
	documents: JsonList.optional(),
});

/**
 * User, from `Users: list` and `Users: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/users/users/get/
 */
export const DocusignUser = z.object({
	userId: z.string(),
	userName: z.string().optional(),
	email: z.string().optional(),
	title: z.string().optional(),
	firstName: z.string().optional(),
	middleName: z.string().optional(),
	lastName: z.string().optional(),
	suffixName: z.string().optional(),
	company: z.string().optional(),
	jobTitle: z.string().optional(),
	userStatus: z.string().optional(),
	userType: z.string().optional(),
	isAdmin: z.string().optional(),
	loginStatus: z.string().optional(),
	permissionProfileId: z.string().optional(),
	permissionProfileName: z.string().optional(),
	countryCode: z.string().optional(),
	uri: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastLogin: z.string().optional(),
	userAddedToAccountDateTime: z.string().optional(),
	enableConnectForUser: z.string().optional(),
	groupList: JsonList.optional(),
});

/**
 * Group, from `Groups: list`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/usergroups/groups/list/
 */
export const DocusignGroup = z.object({
	groupId: z.string(),
	groupName: z.string().optional(),
	groupType: z.string().optional(),
	permissionProfileId: z.string().optional(),
	usersCount: z.string().optional(),
});

/**
 * Signing group, from `SigningGroups: list` and `SigningGroups: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/signinggroups/signinggroups/get/
 */
export const DocusignSigningGroup = z.object({
	signingGroupId: z.string(),
	groupName: z.string().optional(),
	groupType: z.string().optional(),
	groupEmail: z.string().optional(),
	created: z.string().optional(),
	createdBy: z.string().optional(),
	modified: z.string().optional(),
	modifiedBy: z.string().optional(),
	users: JsonList.optional(),
});

/**
 * Brand, from `AccountBrands: list` and `AccountBrands: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/accounts/accountbrands/get/
 */
export const DocusignBrand = z.object({
	brandId: z.string(),
	brandName: z.string().optional(),
	brandCompany: z.string().optional(),
	defaultBrandLanguage: z.string().optional(),
	isOverridingCompanyName: z.boolean().optional(),
	isSendingDefault: z.boolean().optional(),
	isSigningDefault: z.boolean().optional(),
	brandLanguages: z.array(z.string()).optional(),
	colors: JsonList.optional(),
	logos: JsonObject.optional(),
	links: JsonList.optional(),
	emailContent: JsonList.optional(),
	landingPages: JsonList.optional(),
	resources: JsonObject.optional(),
});

/**
 * Account, from `Accounts: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/accounts/accounts/get/
 */
export const DocusignAccount = z.object({
	accountIdGuid: z.string(),
	accountName: z.string().optional(),
	externalAccountId: z.string().optional(),
	planName: z.string().optional(),
	planClassification: z.string().optional(),
	planStartDate: z.string().optional(),
	planEndDate: z.string().optional(),
	currentPlanId: z.string().optional(),
	currencyCode: z.string().optional(),
	createdDate: z.string().optional(),
	billingPeriodStartDate: z.string().optional(),
	billingPeriodEndDate: z.string().optional(),
	billingPeriodEnvelopesAllowed: z.string().optional(),
	billingPeriodEnvelopesSent: z.string().optional(),
	billingPeriodDaysRemaining: z.string().optional(),
	connectPermission: z.string().optional(),
	distributorCode: z.string().optional(),
	envelopeSendingBlocked: z.string().optional(),
	suspensionStatus: z.string().optional(),
	suspensionDate: z.string().optional(),
	usesAPI: z.string().optional(),
});

/**
 * Permission profile, from `AccountPermissionProfiles: list` and `: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/accounts/accountpermissionprofiles/get/
 */
export const DocusignPermissionProfile = z.object({
	permissionProfileId: z.string(),
	permissionProfileName: z.string().optional(),
	modifiedByUsername: z.string().optional(),
	modifiedDateTime: z.string().optional(),
	userCount: z.string().optional(),
	settings: JsonObject.optional(),
});

/**
 * Workspace, from `Workspace: list` and `Workspace: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/workspaces/workspace/get/
 */
export const DocusignWorkspace = z.object({
	workspaceId: z.string(),
	workspaceName: z.string().optional(),
	workspaceDescription: z.string().optional(),
	workspaceUri: z.string().optional(),
	status: z.string().optional(),
	created: z.string().optional(),
	lastModified: z.string().optional(),
	billableAccountId: z.string().optional(),
	createdByInfo: JsonObject.optional(),
	lastModifiedByInfo: JsonObject.optional(),
});

/**
 * Bulk send list summary, from `BulkSendLists: list`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/bulkenvelopes/bulksend/list/
 */
export const DocusignBulkSendList = z.object({
	listId: z.string(),
	name: z.string().optional(),
	createdDate: z.string().optional(),
	createdByUser: z.string().optional(),
});

/**
 * Connect configuration, from `ConnectConfigurations: list`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/connect/connectconfigurations/list/
 */
export const DocusignConnectConfiguration = z.object({
	connectId: z.string(),
	name: z.string().optional(),
	urlToPublishTo: z.string().optional(),
	configurationType: z.string().optional(),
	allUsers: z.string().optional(),
	allowEnvelopePublish: z.string().optional(),
	enableLog: z.string().optional(),
	includeDocuments: z.string().optional(),
	includeCertificateOfCompletion: z.string().optional(),
	includeHMAC: z.string().optional(),
	includeTimeZoneInformation: z.string().optional(),
	requiresAcknowledgement: z.string().optional(),
	useSoapInterface: z.string().optional(),
	userIds: z.array(z.string()).optional(),
	envelopeEvents: z.array(z.string()).optional(),
	recipientEvents: z.array(z.string()).optional(),
});

/**
 * Custom tab definition, from `CustomTabs: list`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/accounts/tabs/list/
 */
export const DocusignCustomTab = z.object({
	customTabId: z.string(),
	tabLabel: z.string().optional(),
	type: z.string().optional(),
	anchor: z.string().optional(),
	shared: z.string().optional(),
	required: z.string().optional(),
	locked: z.string().optional(),
	height: z.string().optional(),
	width: z.string().optional(),
	lastModified: z.string().optional(),
	lastModifiedByDisplayName: z.string().optional(),
	createdByDisplayName: z.string().optional(),
});

/**
 * Contact, from `Contacts: get`.
 * https://developers.docusign.com/docs/esign-rest-api/reference/contacts/contacts/get/
 */
export const DocusignContact = z.object({
	contactId: z.string(),
	name: z.string().optional(),
	organization: z.string().optional(),
	shared: z.string().optional(),
	contactUri: z.string().optional(),
	emails: z.array(z.string()).optional(),
	contactPhoneNumbers: JsonList.optional(),
});
