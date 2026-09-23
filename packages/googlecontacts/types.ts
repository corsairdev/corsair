export type FieldMetadata = {
	primary?: boolean;
	verified?: boolean;
	source?: { type?: string; id?: string };
};

export type PersonName = {
	metadata?: FieldMetadata;
	displayName?: string;
	familyName?: string;
	givenName?: string;
	middleName?: string;
	honorificPrefix?: string;
	honorificSuffix?: string;
};

export type EmailAddress = {
	metadata?: FieldMetadata;
	value?: string;
	type?: string;
	displayName?: string;
};

export type PhoneNumber = {
	metadata?: FieldMetadata;
	value?: string;
	canonicalForm?: string;
	type?: string;
};

export type Organization = {
	metadata?: FieldMetadata;
	name?: string;
	title?: string;
	department?: string;
};

export type Address = {
	metadata?: FieldMetadata;
	formattedValue?: string;
	streetAddress?: string;
	city?: string;
	region?: string;
	postalCode?: string;
	country?: string;
	countryCode?: string;
	type?: string;
};

export type Photo = {
	metadata?: FieldMetadata;
	url?: string;
	default?: boolean;
};

export type Biography = {
	metadata?: FieldMetadata;
	value?: string;
	contentType?: string;
};

export type Membership = {
	metadata?: FieldMetadata;
	contactGroupMembership?: {
		contactGroupId?: string;
		contactGroupResourceName?: string;
	};
};

export type PersonMetadata = {
	sources?: Array<{ type?: string; id?: string; etag?: string }>;
	deleted?: boolean;
	objectType?: string;
};

export type Person = {
	resourceName: string;
	etag?: string;
	metadata?: PersonMetadata;
	names?: PersonName[];
	emailAddresses?: EmailAddress[];
	phoneNumbers?: PhoneNumber[];
	organizations?: Organization[];
	addresses?: Address[];
	photos?: Photo[];
	biographies?: Biography[];
	memberships?: Membership[];
};

export type ListConnectionsResponse = {
	connections?: Person[];
	nextPageToken?: string;
	nextSyncToken?: string;
	totalPeople?: number;
	totalItems?: number;
};

export type ListOtherContactsResponse = {
	otherContacts?: Person[];
	nextPageToken?: string;
	nextSyncToken?: string;
	totalSize?: number;
};

export type SearchResponse = {
	results?: Array<{ person?: Person }>;
};

export type ContactGroup = {
	resourceName: string;
	etag?: string;
	metadata?: { updateTime?: string; deleted?: boolean };
	groupType?: string;
	name?: string;
	formattedName?: string;
	memberResourceNames?: string[];
	memberCount?: number;
};

export type ListContactGroupsResponse = {
	contactGroups?: ContactGroup[];
	nextPageToken?: string;
	nextSyncToken?: string;
	totalItems?: number;
};

export type ModifyContactGroupMembersResponse = {
	notFoundResourceNames?: string[];
	canNotRemoveLastContactGroupResourceNames?: string[];
};
