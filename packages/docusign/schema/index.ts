import {
	DocusignAccount,
	DocusignBrand,
	DocusignBulkSendList,
	DocusignConnectConfiguration,
	DocusignContact,
	DocusignCustomTab,
	DocusignDocument,
	DocusignEnvelope,
	DocusignGroup,
	DocusignPermissionProfile,
	DocusignRecipient,
	DocusignSigningGroup,
	DocusignTemplate,
	DocusignUser,
	DocusignWorkspace,
} from './database';

export * from './database';

export const DocusignSchema = {
	version: '1.0.0',
	entities: {
		envelopes: DocusignEnvelope,
		recipients: DocusignRecipient,
		documents: DocusignDocument,
		templates: DocusignTemplate,
		users: DocusignUser,
		groups: DocusignGroup,
		signingGroups: DocusignSigningGroup,
		brands: DocusignBrand,
		accounts: DocusignAccount,
		permissionProfiles: DocusignPermissionProfile,
		workspaces: DocusignWorkspace,
		bulkSendLists: DocusignBulkSendList,
		connectConfigurations: DocusignConnectConfiguration,
		customTabs: DocusignCustomTab,
		contacts: DocusignContact,
	},
} as const;
