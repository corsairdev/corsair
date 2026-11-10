import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const getOverview: InboxkitEndpoints['emailInsightsGetOverview'] = (
	ctx,
	input,
) =>
	call(ctx, 'emailInsightsGetOverview', input, (query) => ({
		method: 'GET',
		path: '/v1/api/email-insights/workspace/overview',
		query,
	}));

export const getMailboxesHealth: InboxkitEndpoints['emailInsightsGetMailboxesHealth'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetMailboxesHealth', input, (query) => ({
			method: 'GET',
			path: '/v1/api/email-insights/workspace/mailboxes-health',
			query,
		}));

export const getDailyStats: InboxkitEndpoints['emailInsightsGetDailyStats'] = (
	ctx,
	input,
) =>
	call(ctx, 'emailInsightsGetDailyStats', input, (query) => ({
		method: 'GET',
		path: '/v1/api/email-insights/workspace/daily-stats',
		query,
	}));

export const getHighBounceMailboxes: InboxkitEndpoints['emailInsightsGetHighBounceMailboxes'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetHighBounceMailboxes', input, (query) => ({
			method: 'GET',
			path: '/v1/api/email-insights/workspace/high-bounce-mailboxes',
			query,
		}));

export const getCampaignReplyRate: InboxkitEndpoints['emailInsightsGetCampaignReplyRate'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetCampaignReplyRate', input, (query) => ({
			method: 'GET',
			path: '/v1/api/email-insights/workspace/campaign-reply-rate',
			query,
		}));

export const getWorkspaceActivity: InboxkitEndpoints['emailInsightsGetWorkspaceActivity'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetWorkspaceActivity', input, (query) => ({
			method: 'GET',
			path: '/v1/api/email-insights/workspace/activity',
			query,
		}));

export const getMailboxStats: InboxkitEndpoints['emailInsightsGetMailboxStats'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetMailboxStats', input, ({ uid, ...query }) => ({
			method: 'GET',
			path: `/v1/api/email-insights/mailbox/${segment(uid)}/stats`,
			query,
		}));

export const getMailboxDeliverability: InboxkitEndpoints['emailInsightsGetMailboxDeliverability'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxDeliverability',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/deliverability`,
				query,
			}),
		);

export const getMailboxHealth: InboxkitEndpoints['emailInsightsGetMailboxHealth'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetMailboxHealth', input, ({ uid }) => ({
			method: 'GET',
			path: `/v1/api/email-insights/mailbox/${segment(uid)}/health`,
		}));

export const getMailboxTrends: InboxkitEndpoints['emailInsightsGetMailboxTrends'] =
	(ctx, input) =>
		call(ctx, 'emailInsightsGetMailboxTrends', input, ({ uid, ...query }) => ({
			method: 'GET',
			path: `/v1/api/email-insights/mailbox/${segment(uid)}/trends`,
			query,
		}));

export const getMailboxBounceEvents: InboxkitEndpoints['emailInsightsGetMailboxBounceEvents'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxBounceEvents',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/bounce-events`,
				query,
			}),
		);

export const getMailboxActivity: InboxkitEndpoints['emailInsightsGetMailboxActivity'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxActivity',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/activity`,
				query,
			}),
		);

export const getMailboxTopRecipients: InboxkitEndpoints['emailInsightsGetMailboxTopRecipients'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxTopRecipients',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/top-recipients`,
				query,
			}),
		);

export const getMailboxTopRecipientDomains: InboxkitEndpoints['emailInsightsGetMailboxTopRecipientDomains'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxTopRecipientDomains',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/top-recipient-domains`,
				query,
			}),
		);

export const getMailboxMessageBreakdown: InboxkitEndpoints['emailInsightsGetMailboxMessageBreakdown'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxMessageBreakdown',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/message-breakdown`,
				query,
			}),
		);

export const getMailboxSubjectAnalysis: InboxkitEndpoints['emailInsightsGetMailboxSubjectAnalysis'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxSubjectAnalysis',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/subject-analysis`,
				query,
			}),
		);

export const getMailboxReplyTimeHeatmap: InboxkitEndpoints['emailInsightsGetMailboxReplyTimeHeatmap'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxReplyTimeHeatmap',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/reply-time-heatmap`,
				query,
			}),
		);

export const getMailboxReplyRateByDomain: InboxkitEndpoints['emailInsightsGetMailboxReplyRateByDomain'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxReplyRateByDomain',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/reply-rate-by-domain`,
				query,
			}),
		);

export const getMailboxVelocityOverlay: InboxkitEndpoints['emailInsightsGetMailboxVelocityOverlay'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxVelocityOverlay',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/velocity-overlay`,
				query,
			}),
		);

export const getMailboxWarmupStats: InboxkitEndpoints['emailInsightsGetMailboxWarmupStats'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxWarmupStats',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/warmup-stats`,
				query,
			}),
		);

export const getMailboxAuthFailures: InboxkitEndpoints['emailInsightsGetMailboxAuthFailures'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxAuthFailures',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/auth-failures`,
				query,
			}),
		);

export const getMailboxFirstTouchFunnel: InboxkitEndpoints['emailInsightsGetMailboxFirstTouchFunnel'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxFirstTouchFunnel',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/first-touch-funnel`,
				query,
			}),
		);

export const getMailboxSendingIpBreakdown: InboxkitEndpoints['emailInsightsGetMailboxSendingIpBreakdown'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxSendingIpBreakdown',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/sending-ip-breakdown`,
				query,
			}),
		);

export const getMailboxRecipientEspBreakdown: InboxkitEndpoints['emailInsightsGetMailboxRecipientEspBreakdown'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxRecipientEspBreakdown',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/recipient-esp-breakdown`,
				query,
			}),
		);

export const getMailboxBodyTemplates: InboxkitEndpoints['emailInsightsGetMailboxBodyTemplates'] =
	(ctx, input) =>
		call(
			ctx,
			'emailInsightsGetMailboxBodyTemplates',
			input,
			({ uid, ...query }) => ({
				method: 'GET',
				path: `/v1/api/email-insights/mailbox/${segment(uid)}/body-templates`,
				query,
			}),
		);
