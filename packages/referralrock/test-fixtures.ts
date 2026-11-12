// Fixtures follow the published samples on api.referralrock.com/Help, whose
// field names and types come from the API's own C# contracts. The two error
// bodies are the live responses a keyless and a badly-authenticated call return.

export const MEMBER_ID = '19548e00-1a17-42e1-b18b-b7bf140cd21d';
export const PROGRAM_ID = '86de93f6-95a8-473d-bb68-b9645f6e9880';
export const REFERRAL_ID = 'ad740c78-1a12-448f-b628-1dd193723d38';
export const REWARD_ID = 'bd851d89-2a23-4490-c739-2ee204834e49';

/** The live structured 401, for a request with no Authorization header. */
export const NO_AUTH = {
	response: {
		status_code: 401,
		status_message: 'Unauthorized',
		body: 'Authorization has been denied for this request.',
	},
};

/** The live 401 for a credential the host rejected, which arrives as HTML. */
export const BAD_AUTH_HTML =
	'You do not have permission to view this directory or page.';

/** The live 404 for a route the API does not expose. */
export const NOT_FOUND = {
	Message:
		"No HTTP resource was found that matches the request URI 'https://rrprod02-api-a.azurewebsites.net/api/memberstats/getsingle'.",
};

export const PROGRAM = {
	id: PROGRAM_ID,
	isActive: true,
	name: 'acme-referrals',
	type: 'referral',
	title: 'Refer a friend',
	memberOffer: 'Get $10',
	referralOffer: 'Get $10 off',
	directUrl: 'https://acme.referralrock.com/refer',
	widgetUrl: 'https://acme.referralrock.com/widget',
};

export const PROGRAM_SET = { offset: 0, total: 1, programs: [PROGRAM] };

export const MEMBER = {
	id: MEMBER_ID,
	displayName: 'Sam Rivera',
	firstName: 'Sam',
	lastName: 'Rivera',
	email: 'sam@example.com',
	phone: '555-0100',
	externalIdentifier: 'ext-1',
	dateOfBirth: '1990-01-01T00:00:00.000Z',
	addressLine1: '1 Market St',
	addressLine2: null,
	city: 'San Francisco',
	region: 'CA',
	countrySubdivision: 'CA',
	country: 'US',
	postalCode: '94105',
	disabledFlag: false,
	disabledReason: null,
	customOverrideURL: null,
	payoutInfo: {
		payoutType: 'paypal',
		useDefaultValues: true,
		email: 'sam@example.com',
	},
	customOption1Name: 'Tier',
	customOption1Value: 'Gold',
	customText1Name: 'Team',
	customText1Value: 'West',
	customText2Name: null,
	customText2Value: null,
	programId: PROGRAM_ID,
	programTitle: 'Refer a friend',
	programName: 'acme-referrals',
	referralCode: 'SAM123',
	referralUrl: 'https://acme.referralrock.com/refer/SAM123',
	memberUrl: 'https://acme.referralrock.com/member/SAM123',
	emailShares: 4,
	socialShares: 2,
	views: 40,
	referrals: 3,
	lastShare: '2026-11-01T00:00:00.000Z',
	referralsApproved: 1,
	referralsQualified: 1,
	referralsPending: 1,
	referralsApprovedAmount: 100,
	rewardsPendingAmount: 10,
	rewardsIssuedAmount: 10,
	rewardAmountTotal: 20,
	rewards: 2,
	createDt: '2026-01-10T10:00:00.000Z',
	status: 'Active',
	utmSource: null,
	utmMedium: null,
	utmCampaign: null,
	activatedDate: '2026-01-10T10:00:00.000Z',
	lastActiveDate: '2026-11-01T00:00:00.000Z',
};

export const MEMBER_SET = {
	offset: 0,
	total: 1,
	members: [MEMBER],
	message: '',
};

export const MEMBER_SET_MORE = {
	offset: 0,
	total: 5,
	members: [MEMBER],
	message: '',
};

export const REFERRAL = {
	id: REFERRAL_ID,
	displayName: 'Jordan Lee',
	firstName: 'Jordan',
	lastName: 'Lee',
	fullName: 'Jordan Lee',
	email: 'jordan@example.com',
	externalIdentifier: 'order-42',
	phoneNumber: '555-0111',
	amount: 250,
	amountFormatted: '$250.00',
	preferredContact: 'email',
	createDate: '2026-11-01T00:00:00.000Z',
	updateDate: '2026-11-02T00:00:00.000Z',
	source: 'link',
	programId: PROGRAM_ID,
	programName: 'acme-referrals',
	programTitle: 'Refer a friend',
	referringMemberId: MEMBER_ID,
	referringMemberName: 'Sam Rivera',
	memberEmail: 'sam@example.com',
	memberReferralCode: 'SAM123',
	memberExternalIdentifier: 'ext-1',
	approvedDate: '2026-11-02T00:00:00.000Z',
	qualifiedDate: '2026-11-03T00:00:00.000Z',
	status: 'Qualified',
	companyName: 'Acme Inc',
	note: 'Referred after a demo',
	publicNote: '',
	conversionNote: '',
	customOption1Name: null,
	customOption2Name: null,
	customText1Name: null,
	customText2Name: null,
	customText3Name: null,
	customOption1Value: null,
	customOption2Value: null,
	customText1Value: null,
	customText2Value: null,
	customText3Value: null,
	utmSource: 'newsletter',
	utmMedium: 'email',
	utmCampaign: 'nov',
	addressLine1: null,
	addressLine2: null,
	city: 'San Francisco',
	region: 'CA',
	postalCode: '94105',
	country: 'US',
};

export const REFERRAL_SET = {
	offset: 0,
	total: 1,
	referrals: [REFERRAL],
	message: '',
};

export const REWARD = {
	id: REWARD_ID,
	payoutId: 'paypal',
	payoutDescription: 'PayPal',
	programId: PROGRAM_ID,
	programName: 'acme-referrals',
	memberId: MEMBER_ID,
	referralId: REFERRAL_ID,
	type: 'Member',
	recipientId: MEMBER_ID,
	recipientName: 'Sam Rivera',
	recipientEmailAddress: 'sam@example.com',
	recipientExternalIdentifier: 'ext-1',
	externalIdentifier: 'reward-1',
	status: 'Issued',
	amount: 10,
	createDate: '2026-11-03T00:00:00.000Z',
	issueDate: '2026-11-04T00:00:00.000Z',
	eligibilityDate: '2026-11-03T00:00:00.000Z',
	description: 'Referral bonus',
	transactionID: null,
	updateDate: '2026-11-04T00:00:00.000Z',
	referralDisplayName: 'Jordan Lee',
	currencyCode: 'USD',
	source: 'rule',
	programRewardRuleId: 'rule-1',
	paymentType: 'paypal',
	paymentCode: null,
	completeNote: null,
	reason: null,
	reasonOther: null,
};

export const REWARD_SET = {
	offset: 0,
	total: 1,
	rewards: [REWARD],
	message: '',
};

/**
 * `POST /api/rewards` answers an array of results, one per reward info sent,
 * each echoing the queries beside the reward and a `resultInfo`.
 */
export const REWARD_CREATED = [
	{
		memberQuery: { primaryInfo: { memberId: MEMBER_ID } },
		referralQuery: null,
		reward: REWARD,
		resultInfo: { Status: 'Success', Message: 'Reward created' },
	},
];

/** The live 400 for a member whose email is already in use. */
export const MEMBER_REJECTED = {
	message: 'Email address is already being used by existing member',
	member: null,
};

/** The live 200 for a reward create Referral Rock refused. */
export const REWARD_REFUSED = [
	{
		memberQuery: { primaryInfo: { memberId: MEMBER_ID } },
		referralQuery: null,
		reward: null,
		resultInfo: { Status: 'Failed', Message: 'No match found' },
	},
];
