// Context bodies captured from the live Moosend v3 API on 11-24 (trial
// account, throwaway list), trimmed. The sender address is replaced with
// sender@example.com; every other value is as Moosend sent it.

export const LIST_ID = '15c677cb-e8b2-438f-b338-1dc393caf0f3';
export const SUBSCRIBER_ID = 'dc3bdb0f-cbdd-a2b5-8c0f-ebcfee204170';
export const CAMPAIGN_ID = '5b52365a-f2ad-4978-9232-d7a3194b6b65';
export const SEGMENT_ID = 587912;

export const paging = {
	PageSize: 10,
	CurrentPage: 1,
	TotalResults: 1,
	TotalPageCount: 1,
	SortExpression: null,
	SortIsAscending: false,
};

export const mailingList = {
	ID: LIST_ID,
	Name: 'corsair-plugin-test',
	ActiveMemberCount: 0,
	BouncedMemberCount: 0,
	RemovedMemberCount: 0,
	UnsubscribedMemberCount: 0,
	Status: 0,
	CustomFieldsDefinition: [],
	CreatedBy: '83fa5ba16e2a4056a40aaf626dacd5ed',
	CreatedOn: '/Date(1795515243966)/',
	UpdatedBy: null,
	UpdatedOn: '/Date(-62135596800000)/',
	Preferences: {
		FallbackValue: null,
		IsRequired: false,
		Options: [],
		SelectType: 0,
	},
};

export const subscriber = {
	ID: SUBSCRIBER_ID,
	Name: 'Plugin Test',
	Mobile: null,
	Email: 'corsair-plugin-test-1@example.com',
	CreatedOn: '/Date(1795515254843)/',
	UpdatedOn: null,
	UnsubscribedOn: null,
	UnsubscribedFromID: null,
	SubscribeType: 1,
	SubscribeMethod: 2,
	CustomFields: [
		{
			CustomFieldID: 'd7d6775a-c56a-45bf-a69d-649c905647a2',
			Name: 'Country',
			Value: 'NL',
		},
	],
	RemovedOn: null,
	Tags: ['corsair-test'],
	Preferences: null,
};

export const segment = {
	ID: SEGMENT_ID,
	Name: 'corsair-seg',
	MatchType: 0,
	Criteria: [
		{
			ID: 1048383,
			SegmentID: SEGMENT_ID,
			Field: 3,
			CustomFieldID: null,
			Comparer: 6,
			Value: 'example.com',
			DateFrom: null,
			DateTo: null,
			OtherMailingListID: null,
			CampaignID: null,
			ProductCode: null,
			DateFunction: null,
			LastXMinutes: null,
			WebsiteId: null,
		},
	],
	CreatedBy: '::ffff:172.26.64.95',
	CreatedOn: '/Date(1795515305612+0000)/',
	UpdatedBy: '::ffff:172.26.64.95',
	UpdatedOn: '/Date(1795515305612+0000)/',
	FetchType: 0,
	FetchValue: 0,
	Description: "(Member Email ends with 'example.com')",
	SortBy: null,
	SegmentType: 1,
};

export const sender = {
	ID: '6801990c-e6c6-4816-bb18-597de8299188',
	Name: 'corsairplugintest Owner',
	Email: 'sender@example.com',
	CreatedOn: '/Date(1795514611000)/',
	IsEnabled: true,
	SpfVerified: false,
	DkimVerified: false,
	DkimPublic: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQ',
	DmarcVerified: false,
	IsVerified: true,
};

export const campaignListItem = {
	ID: CAMPAIGN_ID,
	Name: 'corsair-plugin-test',
	Subject: 'corsair plugin test (never sent)',
	SiteName: 'corsairplugintest',
	ConfirmationTo: 'sender@example.com',
	CreatedOn: '/Date(1795515329981+0000)/',
	ABHoursToTest: null,
	ABCampaignType: null,
	ABWinner: null,
	ABWinnerSelectionType: null,
	Status: 0,
	DeliveredOn: null,
	ScheduledFor: null,
	ScheduledForTimezone: null,
	MailingLists: [
		{
			Campaign: null,
			MailingList: { ...mailingList, Preferences: null },
			Segment: null,
		},
	],
	TotalSent: 0,
	TotalOpens: 0,
	UniqueOpens: 0,
	TotalBounces: 0,
	TotalForwards: 0,
	UniqueForwards: 0,
	TotalLinkClicks: 0,
	UniqueLinkClicks: 0,
	RecipientsCount: 0,
	IsTransactional: false,
	TotalComplaints: 0,
	TotalUnsubscribes: 0,
	CampaignSource: null,
	CampaignType: 'Regular',
};

export const campaign = {
	ID: CAMPAIGN_ID,
	Name: 'corsair-plugin-test',
	Subject: 'corsair plugin test (never sent)',
	WebLocation: null,
	HTMLContent: '<html><body><p>test</p></body></html>',
	PlainContent: '\r\rtest',
	Sender: sender,
	DeliveredOn: null,
	ReplyToEmail: sender,
	CreatedOn: '/Date(1795515329981+0000)/',
	UpdatedOn: '/Date(1795515329981+0000)/',
	ScheduledFor: null,
	Timezone: null,
	FormatType: 0,
	ABCampaignData: null,
	MailingLists: [{ MailingListID: LIST_ID, SegmentID: 0 }],
	ConfirmationTo: 'sender@example.com',
	Status: 0,
	IsTransactional: false,
};

export const campaignSummary = {
	CampaignID: CAMPAIGN_ID,
	ABVersion: null,
	CampaignName: 'corsair-plugin-test-2',
	CampaignSubject: 'corsair plugin test 2 (never sent)',
	MailingLists: [{ MailingListID: LIST_ID, SegmentID: SEGMENT_ID }],
	CampaignDeliveredOn: null,
	To: null,
	From: null,
	TotalOpens: 0,
	UniqueOpens: 0,
	TotalBounces: 0,
	TotalComplaints: 0,
	TotalForwards: 0,
	UniqueForwards: 0,
	TotalUnsubscribes: 0,
	TotalLinkClicks: 0,
	UniqueLinkClicks: 0,
	Sent: 0,
};

export const emptyAnalytics = {
	Paging: { ...paging, PageSize: 0, TotalResults: 0, TotalPageCount: 0 },
	Analytics: [],
};

export const openedRow = {
	Context: 'NL',
	ContextName: 'Netherlands',
	ContextDescription: null,
	TotalCount: 3,
	UniqueCount: 2,
	Timestamp: '/Date(1795515329981+0000)/',
};
