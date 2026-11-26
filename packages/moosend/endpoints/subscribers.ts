import { segment } from '../client';
import { compact, customFieldPairs, endpoint, success } from './call';

type SubscriberFieldsInput = {
	email: string;
	name?: string;
	customFields?: Record<string, string | number | boolean>;
	tags?: string[];
	preferences?: string[];
};

function subscriberBody(input: SubscriberFieldsInput) {
	return compact({
		Email: input.email,
		Name: input.name,
		CustomFields: customFieldPairs(input.customFields),
		Tags: input.tags,
		Preferences: input.preferences,
	});
}

const listPath = (mailingListId: string, rest: string) =>
	`/subscribers/${segment(mailingListId)}/${rest}`;

/** Lists one status of a list's subscribers, one page at a time. */
export const list = endpoint('subscribersList', {
	event: 'subscribers.list',
	request: ({ mailingListId, status, page, pageSize }) => ({
		method: 'GET',
		path: `/lists/${segment(mailingListId)}/subscribers/${segment(status ?? 'Subscribed')}.json`,
		query: { Page: page, PageSize: pageSize },
	}),
	log: (_, result) => ({ subscribers: result.Subscribers.length }),
});

/** Finds a subscriber by email in one list. */
export const getByEmail = endpoint('subscribersGetByEmail', {
	event: 'subscribers.getByEmail',
	request: ({ mailingListId, email }) => ({
		method: 'GET',
		path: listPath(mailingListId, 'view.json'),
		query: { Email: email },
	}),
});

/** Finds a subscriber by ID in one list. */
export const getById = endpoint('subscribersGetById', {
	event: 'subscribers.getById',
	request: ({ mailingListId, subscriberId }) => ({
		method: 'GET',
		path: listPath(mailingListId, `find/${segment(subscriberId)}.json`),
	}),
});

/** Finds a subscriber by ID without knowing its list. */
export const getByIdAnyList = endpoint('subscribersGetByIdAnyList', {
	event: 'subscribers.getByIdAnyList',
	request: ({ subscriberId }) => ({
		method: 'GET',
		path: `/subscribers/${segment(subscriberId)}.json`,
	}),
});

/** Adds a subscriber, or updates the one with that email (an upsert). */
export const subscribe = endpoint('subscribersSubscribe', {
	event: 'subscribers.subscribe',
	request: ({ mailingListId, hasExternalDoubleOptIn, ...fields }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'subscribe.json'),
		body: compact({
			...subscriberBody(fields),
			HasExternalDoubleOptIn: hasExternalDoubleOptIn,
		}),
	}),
});

/** Adds up to 1,000 subscribers; Moosend skips invalid addresses. */
export const subscribeMany = endpoint('subscribersSubscribeMany', {
	event: 'subscribers.subscribeMany',
	request: ({ mailingListId, subscribers, hasExternalDoubleOptIn }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'subscribe_many.json'),
		body: compact({
			HasExternalDoubleOptIn: hasExternalDoubleOptIn,
			Subscribers: subscribers.map(subscriberBody),
		}),
	}),
	shape: (context, envelope) => ({
		subscribers: context,
		notice: envelope.notice,
	}),
	log: (parsed, result) => ({
		sent: parsed.subscribers.length,
		added: result.subscribers.length,
	}),
});

/** Updates a subscriber's email, name, custom fields, tags or preferences. */
export const update = endpoint('subscribersUpdate', {
	event: 'subscribers.update',
	request: ({
		mailingListId,
		subscriberId,
		hasExternalDoubleOptIn,
		...fields
	}) => ({
		method: 'POST',
		path: listPath(mailingListId, `update/${segment(subscriberId)}.json`),
		body: compact({
			...subscriberBody(fields),
			HasExternalDoubleOptIn: hasExternalDoubleOptIn,
		}),
	}),
});

/** Unsubscribes an email from one list. */
export const unsubscribe = endpoint('subscribersUnsubscribe', {
	event: 'subscribers.unsubscribe',
	request: ({ mailingListId, email }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'unsubscribe.json'),
		body: { Email: email },
	}),
	shape: success,
});

/** Unsubscribes an email from one list and credits the campaign with it. */
export const unsubscribeFromCampaign = endpoint(
	'subscribersUnsubscribeFromCampaign',
	{
		event: 'subscribers.unsubscribeFromCampaign',
		request: ({ mailingListId, campaignId, email }) => ({
			method: 'POST',
			path: listPath(mailingListId, `${segment(campaignId)}/unsubscribe.json`),
			body: { Email: email },
		}),
		shape: success,
	},
);

/** Unsubscribes an email from every list in the account. */
export const unsubscribeFromAccount = endpoint(
	'subscribersUnsubscribeFromAccount',
	{
		event: 'subscribers.unsubscribeFromAccount',
		request: ({ email }) => ({
			method: 'POST',
			path: '/subscribers/unsubscribe.json',
			body: { Email: email },
		}),
		shape: success,
	},
);

/** Marks a subscriber as removed from a list (status Removed). */
export const remove = endpoint('subscribersRemove', {
	event: 'subscribers.remove',
	request: ({ mailingListId, email }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'remove.json'),
		body: { Email: email },
	}),
	shape: success,
});

/** Marks up to 1,000 subscribers as removed from a list. */
export const removeMany = endpoint('subscribersRemoveMany', {
	event: 'subscribers.removeMany',
	request: ({ mailingListId, emails }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'remove_many.json'),
		// Moosend takes this list as one comma-separated string.
		body: { Emails: emails.join(',') },
	}),
	log: (_, result) => ({
		processed: result.EmailsProcessed ?? undefined,
		ignored: result.EmailsIgnored ?? undefined,
	}),
});

/** Deletes a subscriber from a list for good. */
export const deleteOne = endpoint('subscribersDelete', {
	event: 'subscribers.delete',
	request: ({ mailingListId, email }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'delete.json'),
		body: { Email: email },
	}),
	shape: success,
});

/** Deletes up to 1,000 subscribers from a list for good. */
export const deleteMany = endpoint('subscribersDeleteMany', {
	event: 'subscribers.deleteMany',
	request: ({ mailingListId, emails }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'delete_many.json'),
		body: { Emails: emails },
	}),
	log: (_, result) => ({
		processed: result.EmailsProcessed ?? undefined,
		ignored: result.EmailsIgnored ?? undefined,
	}),
});

/** Deletes an email from every list in the account for good. */
export const deleteFromAccount = endpoint('subscribersDeleteFromAccount', {
	event: 'subscribers.deleteFromAccount',
	request: ({ email, includeAllSubAccounts }) => ({
		method: 'POST',
		path: '/subscribers/delete.json',
		body: compact({
			Email: email,
			IncludeAllSubAccounts: includeAllSubAccounts,
		}),
	}),
	shape: success,
});

type MembersTags = { subscriberId: string; tags: string[] }[];

const membersTags = (members: MembersTags) =>
	members.map(({ subscriberId, tags }) => ({
		MemberId: subscriberId,
		Tags: tags,
	}));

/** Adds tags to up to 1,000 subscribers of one list. */
export const addTags = endpoint('subscribersAddTags', {
	event: 'subscribers.addTags',
	request: ({ mailingListId, members }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'add_tags.json'),
		body: { MembersTags: membersTags(members) },
	}),
	shape: success,
	log: (parsed) => ({ members: parsed.members.length }),
});

/** Removes tags from up to 1,000 subscribers of one list. */
export const removeTags = endpoint('subscribersRemoveTags', {
	event: 'subscribers.removeTags',
	request: ({ mailingListId, members }) => ({
		method: 'POST',
		path: listPath(mailingListId, 'delete_tags.json'),
		body: { MembersTags: membersTags(members) },
	}),
	shape: success,
	log: (parsed) => ({ members: parsed.members.length }),
});
