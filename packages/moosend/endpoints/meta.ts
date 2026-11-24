/**
 * Risk level and description per operation. `destructive` (R8): sends
 * email, re-subscribes or unsubscribes people, or deletes data for good.
 */
export const moosendEndpointMeta = {
	'lists.list': {
		riskLevel: 'read',
		description:
			'List the active mailing lists with subscriber counts and custom field definitions (first page of 10)',
	},
	'lists.listPaged': {
		riskLevel: 'read',
		description: 'List mailing lists one page at a time',
	},
	'lists.get': {
		riskLevel: 'read',
		description: 'Read one mailing list with its custom field definitions',
	},
	'lists.create': {
		riskLevel: 'write',
		description: 'Create an empty mailing list',
	},
	'lists.update': {
		riskLevel: 'write',
		description:
			"Change a mailing list's name, confirmation and unsubscribe pages, or preferences",
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a mailing list and its subscribers; cannot be undone',
	},
	'customFields.create': {
		riskLevel: 'write',
		description:
			'Add a custom field (text, number, date, dropdown or checkbox) to a mailing list',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: "Change a custom field's name, type, options or visibility",
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description:
			"Remove a custom field and every subscriber's value for it; cannot be undone",
	},
	'subscribers.list': {
		riskLevel: 'read',
		description:
			"List a mailing list's subscribed, unsubscribed, bounced or removed members, one page at a time",
	},
	'subscribers.getByEmail': {
		riskLevel: 'read',
		description: 'Find a subscriber by email address in one mailing list',
	},
	'subscribers.getById': {
		riskLevel: 'read',
		description: 'Find a subscriber by ID in one mailing list',
	},
	'subscribers.getByIdAnyList': {
		riskLevel: 'read',
		description: 'Find a subscriber by ID without naming the mailing list',
	},
	'subscribers.subscribe': {
		riskLevel: 'destructive',
		description:
			'Add a subscriber or update the one with that email; re-subscribes an unsubscribed contact, clears custom fields left out, and on a double opt-in list emails a confirmation unless hasExternalDoubleOptIn is true',
	},
	'subscribers.subscribeMany': {
		riskLevel: 'destructive',
		description:
			'Add or update up to 1,000 subscribers in one call (same effects as subscribe); Moosend skips invalid addresses and reports them in notice',
	},
	'subscribers.update': {
		riskLevel: 'write',
		description:
			"Update a subscriber's email, name, tags, preferences and custom fields; custom fields left out are cleared",
	},
	'subscribers.unsubscribe': {
		riskLevel: 'destructive',
		description: 'Unsubscribe an email address from one mailing list',
	},
	'subscribers.unsubscribeFromCampaign': {
		riskLevel: 'destructive',
		description:
			'Unsubscribe an email address from one mailing list and count it against a campaign',
	},
	'subscribers.unsubscribeFromAccount': {
		riskLevel: 'destructive',
		description:
			'Unsubscribe an email address from every mailing list in the account',
	},
	'subscribers.remove': {
		riskLevel: 'destructive',
		description:
			'Mark a subscriber as removed from one mailing list (no more campaigns)',
	},
	'subscribers.removeMany': {
		riskLevel: 'destructive',
		description:
			'Mark up to 1,000 subscribers as removed from one mailing list',
	},
	'subscribers.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a subscriber from one mailing list for good; cannot be undone',
	},
	'subscribers.deleteMany': {
		riskLevel: 'destructive',
		description:
			'Delete up to 1,000 subscribers from one mailing list for good; cannot be undone',
	},
	'subscribers.deleteFromAccount': {
		riskLevel: 'destructive',
		description:
			'Delete an email address from every mailing list in the account (and optionally its sub-accounts); cannot be undone',
	},
	'subscribers.addTags': {
		riskLevel: 'write',
		description: 'Add tags to up to 1,000 subscribers of one mailing list',
	},
	'subscribers.removeTags': {
		riskLevel: 'write',
		description: 'Remove tags from up to 1,000 subscribers of one mailing list',
	},
	'segments.list': {
		riskLevel: 'read',
		description: "List a mailing list's segments with their criteria",
	},
	'segments.get': {
		riskLevel: 'read',
		description: 'Read one segment with its criteria',
	},
	'segments.members': {
		riskLevel: 'read',
		description: 'List the subscribers a segment matches, one page at a time',
	},
	'segments.create': {
		riskLevel: 'write',
		description: 'Create a segment of a mailing list, empty or with criteria',
	},
	'segments.update': {
		riskLevel: 'write',
		description:
			"Change a segment's name and match settings; criteria, when given, replace all existing ones",
	},
	'segments.addCriteria': {
		riskLevel: 'write',
		description:
			'Add one criterion to a segment; returns its position for updateCriteria',
	},
	'segments.updateCriteria': {
		riskLevel: 'write',
		description:
			'Change one segment criterion, addressed by its position (1 = first)',
	},
	'segments.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a segment; its subscribers stay on the list. Cannot be undone',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'List campaigns (drafts, scheduled and sent) with their totals, optionally by page and page size',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Read one campaign with its content, sender and mailing lists (no statistics)',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a draft campaign (regular or A/B); nothing is sent',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Change a draft campaign; nothing is sent',
	},
	'campaigns.clone': {
		riskLevel: 'write',
		description: 'Copy a campaign into a new draft and return the copy',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign; cannot be undone',
	},
	'campaigns.send': {
		riskLevel: 'destructive',
		description: 'Send a draft campaign to its mailing lists now',
	},
	'campaigns.sendTest': {
		riskLevel: 'destructive',
		description: 'Email a test copy of a campaign to up to 5 addresses',
	},
	'campaigns.schedule': {
		riskLevel: 'destructive',
		description: 'Schedule a draft campaign to be sent at a set time',
	},
	'campaigns.unschedule': {
		riskLevel: 'write',
		description: 'Cancel a scheduled send; the campaign goes back to draft',
	},
	'campaigns.summary': {
		riskLevel: 'read',
		description:
			"Read a campaign's totals: sent, opens, clicks, bounces, complaints, unsubscribes",
	},
	'campaigns.abSummary': {
		riskLevel: 'read',
		description: "Read an A/B campaign's totals per version",
	},
	'campaigns.stats': {
		riskLevel: 'read',
		description:
			'List per-recipient campaign activity of one type (sent, opened, clicked, bounced, unsubscribed, complained), with paging and dates',
	},
	'campaigns.activityByLocation': {
		riskLevel: 'read',
		description: 'Count campaign opens per country',
	},
	'campaigns.linkActivity': {
		riskLevel: 'read',
		description: 'Count campaign clicks per link',
	},
	'senders.list': {
		riskLevel: 'read',
		description:
			'List the account senders (from addresses) with their SPF, DKIM and DMARC checks',
	},
	'senders.get': {
		riskLevel: 'read',
		description: 'Read one sender by email address',
	},
	'transactional.send': {
		riskLevel: 'destructive',
		description:
			'Send a transactional email (from a template or inline content) to the given recipients',
	},
} as const;
