import { asRecord } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { MoosendEndpoints } from '..';
import { envelopeErrorName, segment } from '../client';
import { compact, endpoint, success } from './call';

type CampaignContentInput = {
	name: string;
	subject: string;
	senderEmail: string;
	replyToEmail?: string;
	confirmationToEmail?: string;
	htmlContent?: string;
	webLocation?: string;
	mailingLists?: { mailingListId: string; segmentId?: number }[];
	trackInGoogleAnalytics?: boolean;
	isAB?: boolean;
	abCampaignType?: string;
	subjectB?: string;
	htmlContentB?: string;
	webLocationB?: string;
	senderEmailB?: string;
	hoursToTest?: number;
	listPercentage?: number;
	abWinnerSelectionType?: string;
};

function campaignBody(input: CampaignContentInput) {
	return compact({
		Name: input.name,
		Subject: input.subject,
		SenderEmail: input.senderEmail,
		ReplyToEmail: input.replyToEmail ?? input.senderEmail,
		ConfirmationToEmail: input.confirmationToEmail,
		HTMLContent: input.htmlContent,
		WebLocation: input.webLocation,
		MailingLists: input.mailingLists?.map(({ mailingListId, segmentId }) =>
			compact({ MailingListID: mailingListId, SegmentID: segmentId }),
		),
		TrackInGoogleAnalytics: input.trackInGoogleAnalytics,
		// Documented as required; a regular campaign sends false.
		IsAB: input.isAB ?? false,
		ABCampaignType: input.abCampaignType,
		SubjectB: input.subjectB,
		HTMLContentB: input.htmlContentB,
		WebLocationB: input.webLocationB,
		SenderEmailB: input.senderEmailB,
		HoursToTest: input.hoursToTest,
		ListPercentage: input.listPercentage,
		ABWinnerSelectionType: input.abWinnerSelectionType,
	});
}

const campaignPath = (campaignId: string, rest: string) =>
	`/campaigns/${segment(campaignId)}/${rest}`;

const listCampaigns = endpoint('campaignsList', {
	event: 'campaigns.list',
	request: ({ page, pageSize, sortBy, sortMethod }) => {
		if (pageSize !== undefined) {
			return {
				method: 'GET',
				path: `/campaigns/${segment(page ?? 1)}/${segment(pageSize)}.json`,
				query: { SortBy: sortBy, SortMethod: sortMethod },
			};
		}
		if (page !== undefined) {
			return { method: 'GET', path: `/campaigns/${segment(page)}.json` };
		}
		return { method: 'GET', path: '/campaigns.json' };
	},
	log: (_, result) => ({ campaigns: result.Campaigns.length }),
});

/**
 * Lists campaigns (drafts, scheduled and sent). An account with no campaigns
 * gets Moosend's `{Code: 400, Error: "CAMPAIGN_NOT_FOUND"}` from these list
 * routes (seen live 11-24); that is its "zero results", so it comes back as
 * an empty list. Every other failure still throws.
 */
export const list: MoosendEndpoints['campaignsList'] = async (ctx, input) => {
	try {
		return await listCampaigns(ctx, input);
	} catch (error) {
		if (
			error instanceof ApiError &&
			envelopeErrorName(error) === 'CAMPAIGN_NOT_FOUND' &&
			asRecord(error.body)?.Code === 400
		) {
			return { Paging: null, Campaigns: [] };
		}
		throw error;
	}
};

/** Reads one campaign with its content, sender and lists (no statistics). */
export const get = endpoint('campaignsGet', {
	event: 'campaigns.get',
	request: ({ campaignId }) => ({
		method: 'GET',
		path: campaignPath(campaignId, 'view.json'),
	}),
});

/** Creates a draft campaign; nothing is sent. */
export const create = endpoint('campaignsCreate', {
	event: 'campaigns.create',
	request: (input) => ({
		method: 'POST',
		path: '/campaigns/create.json',
		body: campaignBody(input),
	}),
	shape: (context) => ({ campaignId: context }),
});

/** Changes a draft campaign; nothing is sent. */
export const update = endpoint('campaignsUpdate', {
	event: 'campaigns.update',
	request: ({ campaignId, ...content }) => ({
		method: 'POST',
		path: campaignPath(campaignId, 'update.json'),
		body: campaignBody(content),
	}),
	shape: success,
});

/** Copies a campaign into a new draft and returns the copy. */
export const clone = endpoint('campaignsClone', {
	event: 'campaigns.clone',
	request: ({ campaignId }) => ({
		method: 'POST',
		path: campaignPath(campaignId, 'clone.json'),
	}),
});

/** Deletes a campaign. */
export const remove = endpoint('campaignsDelete', {
	event: 'campaigns.delete',
	request: ({ campaignId }) => ({
		method: 'DELETE',
		path: campaignPath(campaignId, 'delete.json'),
	}),
	shape: success,
});

/** Sends a draft campaign to its lists now. */
export const send = endpoint('campaignsSend', {
	event: 'campaigns.send',
	request: ({ campaignId }) => ({
		method: 'POST',
		path: campaignPath(campaignId, 'send.json'),
	}),
	shape: success,
});

/** Emails a test copy of a campaign to the given addresses. */
export const sendTest = endpoint('campaignsSendTest', {
	event: 'campaigns.sendTest',
	request: ({ campaignId, testEmails }) => ({
		method: 'POST',
		// The current docs say send-test; that route answers 404 (11-24).
		path: campaignPath(campaignId, 'send_test.json'),
		body: { TestEmails: testEmails },
	}),
	shape: success,
	log: (parsed) => ({ recipients: parsed.testEmails.length }),
});

/** Schedules a draft campaign to send later. */
export const schedule = endpoint('campaignsSchedule', {
	event: 'campaigns.schedule',
	request: ({ campaignId, dateTime, timezone }) => ({
		method: 'POST',
		path: campaignPath(campaignId, 'schedule.json'),
		body: compact({ DateTime: dateTime, Timezone: timezone }),
	}),
	shape: success,
});

/** Cancels a scheduled send; the campaign goes back to draft. */
export const unschedule = endpoint('campaignsUnschedule', {
	event: 'campaigns.unschedule',
	request: ({ campaignId }) => ({
		method: 'POST',
		path: campaignPath(campaignId, 'unschedule.json'),
	}),
	shape: success,
});

/** Reads a campaign's totals: sent, opens, clicks, bounces, unsubscribes. */
export const summary = endpoint('campaignsSummary', {
	event: 'campaigns.summary',
	request: ({ campaignId }) => ({
		method: 'GET',
		// The current docs say view-summary; only view_summary works (11-24).
		path: campaignPath(campaignId, 'view_summary.json'),
	}),
});

/** Reads the A and B versions' totals of an A/B campaign. */
export const abSummary = endpoint('campaignsAbSummary', {
	event: 'campaigns.abSummary',
	request: ({ campaignId }) => ({
		method: 'GET',
		path: campaignPath(campaignId, 'view_ab_summary.json'),
	}),
});

/** Lists who received, opened, clicked, bounced or unsubscribed, by type. */
export const stats = endpoint('campaignsStats', {
	event: 'campaigns.stats',
	request: ({ campaignId, type, page, pageSize, from, to }) => ({
		method: 'GET',
		path: campaignPath(campaignId, `stats/${segment(type ?? 'Sent')}.json`),
		query: { Page: page, PageSize: pageSize, From: from, To: to },
	}),
	log: (_, result) => ({ rows: result.Analytics.length }),
});

/** Opens per country for a sent campaign. */
export const activityByLocation = endpoint('campaignsActivityByLocation', {
	event: 'campaigns.activityByLocation',
	request: ({ campaignId }) => ({
		method: 'GET',
		path: campaignPath(campaignId, 'stats/countries.json'),
	}),
});

/** Clicks per link for a sent campaign. */
export const linkActivity = endpoint('campaignsLinkActivity', {
	event: 'campaigns.linkActivity',
	request: ({ campaignId }) => ({
		method: 'GET',
		path: campaignPath(campaignId, 'stats/links.json'),
	}),
});
