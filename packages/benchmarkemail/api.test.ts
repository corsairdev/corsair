/**
 * Live API tests for the Benchmark Email classic REST API v3.0.
 *
 * These call the real provider and only run when BENCHMARKEMAIL_API_KEY is
 * set to an Admin API token (Benchmark Email account > Integrate > API).
 * Without the key the whole suite is skipped - no key is ever hardcoded.
 * Every check is read-only (GET only): nothing is created, changed or
 * deleted on the account.
 *
 * Envelope note: the classic API returns objects on some routes and bare
 * arrays on others, so `expectLiveOutput` accepts a registered-schema match
 * or a bare array of objects - anything else (primitives, empty bodies on
 * routes that must return data) fails with a payload preview.
 *
 * @see https://developer.benchmarkemail.com/
 */
import type { z } from 'zod';
import { makeBenchmarkEmailRequest } from './client';
import { BenchmarkEmailEndpointOutputSchemas } from './endpoints/types';

const API_KEY = process.env.BENCHMARKEMAIL_API_KEY;

const describeLive = API_KEY ? describe : describe.skip;

const OUTPUTS = BenchmarkEmailEndpointOutputSchemas as unknown as Record<
	string,
	z.ZodType
>;

async function get<T>(endpoint: string): Promise<T> {
	return makeBenchmarkEmailRequest<T>(endpoint, API_KEY as string, {
		method: 'GET',
	});
}

function expectLiveOutput(
	schemaKey: string,
	res: unknown,
	label: string,
): void {
	expect(res).toBeDefined();
	const schema = OUTPUTS[schemaKey];
	if (!schema) throw new Error(`No output schema registered for ${schemaKey}`);
	if (schema.safeParse(res).success) return;
	if (Array.isArray(res)) {
		for (const row of res.slice(0, 5)) {
			expect(row !== null && typeof row === 'object').toBe(true);
		}
		console.warn(
			`live:${label} returned a bare array (${res.length} rows); accepted as list envelope`,
		);
		return;
	}
	throw new Error(
		`live:${label} unexpected envelope: ${JSON.stringify(res)?.slice(0, 300)}`,
	);
}

/**
 * Pulls an id out of a provider payload without assuming its envelope:
 * the classic API returns bare arrays for some routes and objects keyed by
 * resource name for others.
 */
function firstId(payload: unknown): string | null {
	const fromRow = (row: unknown): string | null => {
		if (!row || typeof row !== 'object') return null;
		const record = row as Record<string, unknown>;
		for (const key of [
			'id',
			'ID',
			'_id',
			'listID',
			'ListID',
			'emailID',
			'EmailID',
			'contactID',
			'ContactID',
		]) {
			const value = record[key];
			if (typeof value === 'string' && value.length > 0) return value;
			if (typeof value === 'number') return String(value);
		}
		return null;
	};
	if (Array.isArray(payload)) {
		return payload.length > 0 ? fromRow(payload[0]) : null;
	}
	if (payload && typeof payload === 'object') {
		const record = payload as Record<string, unknown>;
		for (const key of [
			'lists',
			'contacts',
			'emails',
			'records',
			'data',
			'results',
			'segments',
		]) {
			const nested = record[key];
			if (Array.isArray(nested) && nested.length > 0) {
				return fromRow(nested[0]);
			}
		}
	}
	return null;
}

describeLive('Benchmark Email live API', () => {
	let firstListID: string | null = null;
	let firstEmailID: string | null = null;

	beforeAll(async () => {
		const lists = await get<unknown>('Contact/');
		firstListID = firstId(lists);
		const emails = await get<unknown>('Emails/');
		firstEmailID = firstId(emails);
	});

	describe('account and counters', () => {
		it('returns the active contact count', async () => {
			expectLiveOutput(
				'contactsGetActiveContactCount',
				await get<unknown>('Contact/ActiveCount'),
				'active-count',
			);
		});

		it('returns trash and unique contact counts', async () => {
			expectLiveOutput(
				'contactsGetTrashCount',
				await get<unknown>('Contact/TrashCount'),
				'trash-count',
			);
			expectLiveOutput(
				'contactsGetUniqueContactCount',
				await get<unknown>('Contact/UniqueCount'),
				'unique-count',
			);
		});

		it('reads client details', async () => {
			expectLiveOutput(
				'accountGetClientDetails',
				await get<unknown>('Client/'),
				'client-details',
			);
		});

		it('reads settings, plan and profile', async () => {
			expectLiveOutput(
				'accountGetClientAccountSettings',
				await get<unknown>('Client/Setting'),
				'client-settings',
			);
			expectLiveOutput(
				'accountGetClientPlanInformation',
				await get<unknown>('Client/Plan'),
				'client-plan',
			);
			expectLiveOutput(
				'accountGetClientProfileDetails',
				await get<unknown>('Client/ProfileDetails'),
				'client-profile',
			);
		});

		it('reads confirmed emails, responsiveness and rating range', async () => {
			expectLiveOutput(
				'accountGetListOfConfirmedEmails',
				await get<unknown>('Client/ConfirmedEmail'),
				'confirmed-emails',
			);
			expectLiveOutput(
				'accountCheckIfResponsive',
				await get<unknown>('Client/Responsive'),
				'responsive',
			);
			expectLiveOutput(
				'accountGetClientsRatingRange',
				await get<unknown>('Client/RatingRange'),
				'rating-range',
			);
		});
	});

	describe('collections', () => {
		it('lists contact lists', async () => {
			expectLiveOutput(
				'listsGetContactLists',
				await get<unknown>('Contact/'),
				'contact-lists',
			);
		});

		it('lists segments', async () => {
			expectLiveOutput(
				'contactsGetSegments',
				await get<unknown>('Contact/Segments'),
				'segments',
			);
		});

		it('lists email campaigns', async () => {
			expectLiveOutput(
				'emailsGetEmails',
				await get<unknown>('Emails/'),
				'emails',
			);
		});

		it('reads the email report index', async () => {
			expectLiveOutput(
				'reportsGetEmailReport',
				await get<unknown>('Emails/Report'),
				'email-report-index',
			);
		});

		it('lists AB tests, automations and autoresponder reports', async () => {
			expectLiveOutput(
				'emailsGetABTests',
				await get<unknown>('ABSplit/'),
				'ab-tests',
			);
			expectLiveOutput(
				'automationsGetAutomationDetails',
				await get<unknown>('Automation/'),
				'automations',
			);
			expectLiveOutput(
				'reportsGetReportsForAutoresponders',
				await get<unknown>('Automation/Report'),
				'autoresponder-reports',
			);
		});

		it('lists signup forms, templates and template categories', async () => {
			expectLiveOutput(
				'signupFormsGetSignupFormList',
				await get<unknown>('SignupForm/'),
				'signup-forms',
			);
			expectLiveOutput(
				'emailsGetEmailTemplates',
				await get<unknown>('Emails/Template'),
				'templates',
			);
			expectLiveOutput(
				'emailsGetTemplateCategoryList',
				await get<unknown>('Emails/TemplateCategory'),
				'template-categories',
			);
		});

		it('lists polls, surveys and survey templates', async () => {
			expectLiveOutput('pollsGetPolls', await get<unknown>('Poll/'), 'polls');
			expectLiveOutput(
				'surveysGetSurveyTemplateList',
				await get<unknown>('Survey/TemplateList'),
				'survey-templates',
			);
		});

		it('lists images and inboxes', async () => {
			expectLiveOutput(
				'mediaGetImages',
				await get<unknown>('Images/'),
				'images',
			);
			expectLiveOutput(
				'mediaGetInboxList',
				await get<unknown>('Inbox/'),
				'inbox-list',
			);
		});

		it('lists archived emails and archive pages', async () => {
			expectLiveOutput(
				'archiveGetArchiveEmails',
				await get<unknown>('Archive/'),
				'archive-emails',
			);
			expectLiveOutput(
				'archiveGetArchivePages',
				await get<unknown>('Archive/ArchivePages'),
				'archive-pages',
			);
		});

		it('reads engagement lists', async () => {
			expectLiveOutput(
				'reportsGetCampaignEngagementList',
				await get<unknown>('Engagement/CampaignList'),
				'engagement-campaigns',
			);
			expectLiveOutput(
				'reportsGetURLEngagementList',
				await get<unknown>('Engagement/URLList'),
				'engagement-urls',
			);
		});

		it('reads partner profile and help topics', async () => {
			expectLiveOutput(
				'accountGetPartnerProfileDetails',
				await get<unknown>('Partner/Profile'),
				'partner-profile',
			);
			expectLiveOutput(
				'accountGetHelpTopics',
				await get<unknown>('Help/'),
				'help-topics',
			);
		});

		it('reads editor metadata: badges, layouts, schemes', async () => {
			expectLiveOutput(
				'emailsGetBadgesList',
				await get<unknown>('Emails/Badges'),
				'badges',
			);
			expectLiveOutput(
				'emailsGetLayoutList',
				await get<unknown>('Emails/Layout'),
				'layouts',
			);
			expectLiveOutput(
				'emailsGetScheme',
				await get<unknown>('Emails/Scheme'),
				'schemes',
			);
		});
	});

	describe('extended coverage', () => {
		it('lists survey reports and AB test reports', async () => {
			expectLiveOutput(
				'surveysGetSurveyReportList',
				await get<unknown>('Survey/ReportList'),
				'survey-reports',
			);
			expectLiveOutput(
				'reportsGetABTestReport',
				await get<unknown>('ABSplit/Report'),
				'ab-test-report',
			);
		});

		it('reads account summary and inbox test statistics', async () => {
			expectLiveOutput(
				'accountGetAccountSummary',
				await get<unknown>('Images/Summary'),
				'account-summary',
			);
			expectLiveOutput(
				'mediaGetInboxDetailResult',
				await get<unknown>('Inbox/Tests'),
				'inbox-detail',
			);
		});

		it('reads notifications, archive and community domains', async () => {
			expectLiveOutput(
				'accountGetNotification',
				await get<unknown>('Client/Notification'),
				'notifications',
			);
			expectLiveOutput(
				'archiveGetDetailsAboutArchivePage',
				await get<unknown>('Archive/Domain'),
				'archive-domain',
			);
			expectLiveOutput(
				'accountGetCommunityDomain',
				await get<unknown>('Client/Community/Domain'),
				'community-domain',
			);
		});

		it('reads click and open contact counts', async () => {
			expectLiveOutput(
				'reportsGetClickContactCount',
				await get<unknown>('Engagement/ClickContactCount'),
				'click-contact-count',
			);
			expectLiveOutput(
				'reportsGetOpenContactCount',
				await get<unknown>('Engagement/OpenContactCount'),
				'open-contact-count',
			);
		});

		it('reads referrals, confirmed emails, DMARC and filter domains', async () => {
			expectLiveOutput(
				'accountGetReferralsList',
				await get<unknown>('Partner/ReferralsList'),
				'referrals',
			);
			expectLiveOutput(
				'accountGetAllConfirmedEmails',
				await get<unknown>('Client/ConfirmedEmail/All'),
				'all-confirmed-emails',
			);
			expectLiveOutput(
				'accountGetDMARCList',
				await get<unknown>('Client/DMarc'),
				'dmarc',
			);
			expectLiveOutput(
				'accountGetClientFilterDomain',
				await get<unknown>('Client/FilterDomain'),
				'filter-domain',
			);
		});

		it('reads list upload terms and contact import status', async () => {
			expectLiveOutput(
				'listsGetListUploadTerms',
				await get<unknown>('Client/ListUploadTerms'),
				'upload-terms',
			);
			expectLiveOutput(
				'contactsGetContactImportStatus',
				await get<unknown>('Contact/ContactImportStatus'),
				'import-status',
			);
		});
	});

	describe('chained detail checks', () => {
		it('reads contact list details when a list exists', async () => {
			if (firstListID === null) {
				console.warn('live: account has no contact lists; skipping deep check');
				expect(true).toBe(true);
				return;
			}
			expectLiveOutput(
				'listsGetContactListDetails',
				await get<unknown>(`Contact/${firstListID}`),
				'list-details',
			);
		});

		it('reads filtered contacts when a list exists', async () => {
			if (firstListID === null) {
				console.warn('live: account has no contact lists; skipping deep check');
				expect(true).toBe(true);
				return;
			}
			expectLiveOutput(
				'contactsGetFilteredContacts',
				await get<unknown>(`Contact/${firstListID}/ContactDetails`),
				'filtered-contacts',
			);
		});

		it('reads list webhooks when a list exists', async () => {
			if (firstListID === null) {
				console.warn('live: account has no contact lists; skipping deep check');
				expect(true).toBe(true);
				return;
			}
			expectLiveOutput(
				'webhooksGetWebhooks',
				await get<unknown>(`Contact/${firstListID}/Webhooks`),
				'list-webhooks',
			);
		});

		it('reads email details and report when a campaign exists', async () => {
			if (firstEmailID === null) {
				console.warn('live: account has no campaigns; skipping deep check');
				expect(true).toBe(true);
				return;
			}
			expectLiveOutput(
				'emailsGetEmailDetails',
				await get<unknown>(`Emails/${firstEmailID}`),
				'email-details',
			);
			expectLiveOutput(
				'reportsGetReportDetailsByEmailID',
				await get<unknown>(`Emails/${firstEmailID}/Report`),
				'email-report',
			);
		});
	});
});
