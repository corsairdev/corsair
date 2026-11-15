// Fixtures are built from the OpenAPI definitions Raisely publishes inside each
// reference page (https://developers.raisely.com/llms.txt), and from the live
// problem document a keyless call returns.

export const CAMPAIGN_UUID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
export const DONATION_UUID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const PROFILE_UUID = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
export const DESIGNATION_UUID = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

/** The live 403 problem document, verbatim from a keyless call. */
export const FORBIDDEN = {
	detail: 'You are not authorized to do that',
	type: '/errors/types/forbidden',
	status: 403,
	instance: '/errors/occurance/3AuL:BU1dG',
	time: '2026-11-10T21:27:13.755Z',
	code: 'forbidden',
	errors: [{ message: 'You are not authorized to do that', code: 'forbidden' }],
};

/** A validation problem document naming two fields. */
export const VALIDATION_ERROR = {
	detail: 'The donation could not be created',
	type: '/errors/types/validation-error',
	status: 422,
	instance: '/errors/occurance/9XyZ:1a2b',
	code: 'validation-error',
	errors: [
		{ message: 'amount is required', code: 'required' },
		{ message: 'currency must be a 3-letter code', code: 'invalid' },
	],
};

export const NOT_FOUND = {
	detail: 'Donation not found',
	type: '/errors/types/not-found',
	status: 404,
	instance: '/errors/occurance/5AbC:9z8y',
	code: 'not-found',
	errors: [{ message: 'Donation not found', code: 'not-found' }],
};

export const PAGINATION = {
	total: 1,
	pages: 1,
	offset: 0,
	limit: 100,
	prevUrl: null,
	nextUrl: null,
};

export const PAGINATION_MORE = {
	total: 250,
	pages: 3,
	offset: 0,
	limit: 100,
	prevUrl: null,
	nextUrl: 'https://api.raisely.com/v3/campaigns?offset=100',
};

export const CAMPAIGN = {
	uuid: CAMPAIGN_UUID,
	name: 'Clean Water 2026',
	path: 'clean-water-2026',
	url: 'https://clean-water-2026.raisely.com',
	mode: 'live',
	status: 'active',
	currency: 'USD',
	goal: 100000,
	total: 42000,
	totalPercent: 42,
	grandTotal: 42000,
	version: '2',
	theme: 'default',
	primaryDomain: 'clean-water-2026.raisely.com',
	organisationUuid: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
	campaignEndsAt: '2026-12-31T00:00:00.000Z',
	createdAt: '2026-01-01T00:00:00.000Z',
	deletedAt: null,
	defaultDesignation: DESIGNATION_UUID,
	isTaxDeductible: true,
	enablePartialTaxReceipting: false,
	allowExperiments: false,
	showRaiselyCheckbox: true,
	publicKey: 'pub_123',
	privateKey: 'priv_456',
	profile: {
		uuid: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
		name: 'Clean Water 2026',
		path: 'clean-water-2026',
		photoUrl: null,
	},
	urls: ['https://clean-water-2026.raisely.com'],
	// The campaign config is a deep theme tree this plugin never reads.
	config: { theme: { primaryColor: '#1171e4' } },
	public: { tagline: 'Water for everyone' },
	private: { internalCode: 'CW26' },
};

export const CAMPAIGN_PAGE = { data: [CAMPAIGN], pagination: PAGINATION };
export const CAMPAIGN_PAGE_MORE = {
	data: [CAMPAIGN],
	pagination: PAGINATION_MORE,
};

export const DONATION = {
	uuid: DONATION_UUID,
	id: 9001,
	amount: 2500,
	amountRefunded: 0,
	currency: 'USD',
	currencySymbol: '$',
	campaignCurrency: 'USD',
	campaignAmount: 2500,
	campaignUuid: CAMPAIGN_UUID,
	displayTotal: 2500,
	donationTotal: 2500,
	organisationUuid: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
	profileUuid: PROFILE_UUID,
	profile: { uuid: PROFILE_UUID, name: 'Jordan Lee', path: 'jordan-lee' },
	date: '2026-11-01T12:00:00.000Z',
	createdAt: '2026-11-01T12:00:00.000Z',
	email: 'jordan@example.com',
	firstName: 'Jordan',
	lastName: 'Lee',
	fullName: 'Jordan Lee',
	preferredName: 'Jo',
	message: 'Glad to help',
	anonymous: false,
	method: 'CREDIT_CARD',
	methodType: 'card',
	mode: 'LIVE',
	status: 'successful',
	processing: 'complete',
	declineCode: null,
	isFraud: false,
	isSuspicious: false,
	fee: 75,
	feeOptIn: true,
	feeModel: 'standard',
	gst: 0,
	includesGiftAid: false,
	giftAidText: null,
	country: 'US',
	postcode: '94105',
	phoneNumber: null,
	designationUuid: DESIGNATION_UUID,
	designation: {
		uuid: DESIGNATION_UUID,
		name: 'Wells',
		publicName: 'Building wells',
	},
	allocations: [],
	public: { dedication: 'For Sam' },
	private: { reconciled: true },
};

export const DONATION_PAGE = { data: [DONATION], pagination: PAGINATION };

export const PROFILE = {
	uuid: PROFILE_UUID,
	name: 'Jordan Lee',
	path: 'jordan-lee',
	photoUrl: 'https://cdn.example.com/jordan.png',
	type: 'individual',
	status: 'active',
	description: 'Running 42km for clean water',
	currency: 'USD',
	goal: 5000,
	total: 2500,
	grandTotal: 2500,
	campaignTotal: 2500,
	campaignDisplayTotal: 2500,
	activityTotal: 42,
	activityTotalPercent: 100,
	donationCount: 1,
	donationRecordCount: 1,
	uniqueDonors: 1,
	selfDonationTotal: 0,
	nonSelfDonationTotal: 2500,
	exerciseTotal: 42,
	exerciseTotalTime: 3600,
	exerciseGoal: 42,
	exerciseGoalTime: 3600,
	isCampaignProfile: false,
	paid: false,
	shared: true,
	pronouns: 'they/them',
	fundraiserTheme: 'default',
	facebookFundraiserId: null,
	subscriptionCount: 0,
	teamProfileCount: 0,
	organisationProfileCount: 0,
	individualProfileCount: 0,
	campaignUuid: CAMPAIGN_UUID,
	userUuid: '11111111-1111-1111-1111-111111111111',
	parentUuid: null,
	createdAt: '2026-10-01T00:00:00.000Z',
	updatedAt: '2026-11-01T00:00:00.000Z',
	user: {
		uuid: '11111111-1111-1111-1111-111111111111',
		email: 'jordan@example.com',
	},
	parent: null,
	teamProfile: null,
	organisationProfile: null,
	tags: ['running'],
	public: { teamName: 'Water Runners' },
	private: { tshirtSize: 'M' },
};

export const PROFILE_PAGE = { data: [PROFILE], pagination: PAGINATION };

export const DESIGNATION = {
	uuid: DESIGNATION_UUID,
	name: 'Wells',
	publicName: 'Building wells',
	externalId: 'W-1',
	status: 'active',
	organisationId: 12,
	createdAt: '2026-01-05T00:00:00.000Z',
	updatedAt: '2026-02-05T00:00:00.000Z',
};

export const DESIGNATION_PAGE = {
	data: [DESIGNATION],
	pagination: PAGINATION,
};
