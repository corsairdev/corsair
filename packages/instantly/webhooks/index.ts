import * as Events from './events';

export const EmailWebhooks = {
	sent: Events.emailSent,
	opened: Events.emailOpened,
	linkClicked: Events.emailLinkClicked,
	bounced: Events.emailBounced,
	replyReceived: Events.replyReceived,
	autoReplyReceived: Events.autoReplyReceived,
};

export const LeadWebhooks = {
	unsubscribed: Events.leadUnsubscribed,
	interested: Events.leadInterested,
	notInterested: Events.leadNotInterested,
	neutral: Events.leadNeutral,
	meetingBooked: Events.leadMeetingBooked,
	meetingCompleted: Events.leadMeetingCompleted,
	closed: Events.leadClosed,
	outOfOffice: Events.leadOutOfOffice,
	wrongPerson: Events.leadWrongPerson,
	noShow: Events.leadNoShow,
	customLabel: Events.customLabel,
};

export const CampaignWebhooks = {
	completed: Events.campaignCompleted,
};

export const AccountWebhooks = {
	error: Events.accountError,
};

export * from './tenant-matcher';
export * from './types';
