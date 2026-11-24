import { segment } from '../client';
import { compact, endpoint, success } from './call';

type ListSettingsInput = {
	name: string;
	confirmationPage?: string;
	redirectAfterUnsubscribePage?: string;
	preferences?: {
		selectType: 'SingleSelect' | 'MultiSelect';
		options: string[];
		isRequired?: boolean;
	};
	preferencePageId?: string;
};

function listBody(input: ListSettingsInput) {
	return compact({
		Name: input.name,
		ConfirmationPage: input.confirmationPage,
		RedirectAfterUnsubscribePage: input.redirectAfterUnsubscribePage,
		Preferences: input.preferences
			? compact({
					SelectType: input.preferences.selectType,
					Options: input.preferences.options,
					IsRequired: input.preferences.isRequired,
				})
			: undefined,
		PreferencePageId: input.preferencePageId,
	});
}

// unknown: the log helper ignores the parsed input and only counts the
// already-validated lists, so their exact types do not matter here.
const listCount = (_: unknown, result: { MailingLists: unknown[] }) => ({
	lists: result.MailingLists.length,
});

/** Lists the active mailing lists (first page; Moosend pages by 10). */
export const list = endpoint('listsList', {
	event: 'lists.list',
	request: ({ withStatistics, sortBy, sortMethod }) => ({
		method: 'GET',
		path: '/lists.json',
		query: {
			WithStatistics: withStatistics,
			SortBy: sortBy,
			SortMethod: sortMethod,
		},
	}),
	log: listCount,
});

/** Lists mailing lists one page at a time. */
export const listPaged = endpoint('listsListPaged', {
	event: 'lists.listPaged',
	request: ({ page, pageSize, sortBy, sortMethod }) => ({
		method: 'GET',
		path: `/lists/${segment(page)}/${segment(pageSize)}.json`,
		query: { SortBy: sortBy, SortMethod: sortMethod },
	}),
	log: listCount,
});

/** Reads one mailing list with its custom field definitions. */
export const get = endpoint('listsGet', {
	event: 'lists.get',
	request: ({ mailingListId, withStatistics }) => ({
		method: 'GET',
		path: `/lists/${segment(mailingListId)}/details.json`,
		query: { WithStatistics: withStatistics },
	}),
});

/** Creates an empty mailing list; Moosend answers with its ID. */
export const create = endpoint('listsCreate', {
	event: 'lists.create',
	request: (input) => ({
		method: 'POST',
		path: '/lists/create.json',
		body: listBody(input),
	}),
	shape: (context) => ({ mailingListId: context }),
});

/** Renames a list or changes its pages and preferences. */
export const update = endpoint('listsUpdate', {
	event: 'lists.update',
	request: ({ mailingListId, ...settings }) => ({
		method: 'POST',
		path: `/lists/${segment(mailingListId)}/update.json`,
		body: listBody(settings),
	}),
	shape: (context) => ({ mailingListId: context }),
});

/** Deletes a mailing list and its subscribers. */
export const remove = endpoint('listsDelete', {
	event: 'lists.delete',
	request: ({ mailingListId }) => ({
		method: 'DELETE',
		path: `/lists/${segment(mailingListId)}/delete.json`,
	}),
	shape: success,
});

type CustomFieldInput = {
	name: string;
	type?: string;
	options?: string[];
	isRequired?: boolean;
	isHidden?: boolean;
};

function customFieldBody(input: CustomFieldInput) {
	return compact({
		Name: input.name,
		CustomFieldType: input.type,
		// Moosend takes the dropdown choices as one comma-separated string.
		Options: input.options?.join(','),
		IsRequired: input.isRequired,
		IsHidden: input.isHidden,
	});
}

/** Adds a custom field to a list; Moosend answers with its ID. */
export const createCustomField = endpoint('customFieldsCreate', {
	event: 'customFields.create',
	request: ({ mailingListId, ...field }) => ({
		method: 'POST',
		path: `/lists/${segment(mailingListId)}/customfields/create.json`,
		body: customFieldBody(field),
	}),
	shape: (context) => ({ customFieldId: context }),
});

/** Changes a custom field's name, type, options or visibility. */
export const updateCustomField = endpoint('customFieldsUpdate', {
	event: 'customFields.update',
	request: ({ mailingListId, customFieldId, ...field }) => ({
		method: 'POST',
		path: `/lists/${segment(mailingListId)}/customfields/${segment(customFieldId)}/update.json`,
		body: customFieldBody(field),
	}),
	shape: success,
});

/** Removes a custom field and every subscriber's value for it. */
export const removeCustomField = endpoint('customFieldsDelete', {
	event: 'customFields.delete',
	request: ({ mailingListId, customFieldId }) => ({
		method: 'DELETE',
		path: `/lists/${segment(mailingListId)}/customfields/${segment(customFieldId)}/delete.json`,
	}),
	shape: success,
});
