import { makeSalesflareRequest } from './client';
import {
	addAccountContacts,
	addAccountUsers,
	createAccount,
	createCall,
	createContact,
	createCustomFieldSub,
	createMeeting,
	createMessage,
	createMessageFeedback,
	createOpportunity,
	createTag,
	createTask,
	createWorkflow,
	deleteAccount,
	deleteContact,
	deleteCustomField,
	deleteMeeting,
	deleteMessage,
	deleteOpportunity,
	deleteTag,
	deleteTask,
	listAccountFeed,
	listAccountMessages,
	listAccounts,
	listCampaignMergeFields,
	listContacts,
	listCurrencies,
	listCustomFieldOptions,
	listCustomFields,
	listCustomFieldTypes,
	listEmailDataSources,
	listFilterFields,
	listGroups,
	listMyContacts,
	listOpportunities,
	listPersons,
	listPipelines,
	listStages,
	listTags,
	listTagUsage,
	listTasks,
	listUsers,
	listWorkflows,
	retrieveAccount,
	retrieveAiSettings,
	retrieveContact,
	retrieveCurrentUser,
	retrieveCustomField,
	retrieveGroup,
	retrieveMeeting,
	retrieveOpportunity,
	retrieveStage,
	retrieveTag,
	retrieveUser,
	retrieveWorkflow,
	updateAccount,
	updateAccountContacts,
	updateAccountUsers,
	updateAiSettings,
	updateCall,
	updateContact,
	updateCustomField,
	updateEmailDataSource,
	updateMeeting,
	updateMessage,
	updateOpportunity,
	updateTag,
	updateTask,
	updateWorkflow,
	updateWorkflowAudience,
} from './endpoints';

jest.mock('./client', () => ({
	makeSalesflareRequest: jest.fn(),
}));

const request = jest.mocked(makeSalesflareRequest);

describe('Salesflare endpoint request seams', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue([]);
	});

	// never: every route-seam call passes a provider-shaped literal whose exact
	// type the generic runtime boundary cannot express; the same shapes are
	// validated against the zod contracts by the schema-boundary suite.
	it('covers every registered operation route', async () => {
		// never: the fixture provides exactly the context fields these handlers
		// read (key, options, $getAccountId); omitted runtime services are not
		// exercised by this plugin's endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await listAccounts(ctx, {
			id: [1],
			details: true,
			search: 'search-1',
			name: 'name-1',
			creation_after: 'creation_after-1',
			creation_before: 'creation_before-1',
			min_size: 1,
			max_size: 1,
			domain: ['domain-1'],
			tag: [1],
			'tag.name': ['tag.name-1'],
			'address.country': ['address.country-1'],
			'address.city': ['address.city-1'],
			'address.state_region': ['address.state_region-1'],
			hotness: 1,
			offset: 1,
			custom: 'custom-1',
			order_by: ['order_by-1'],
			q: 'q-1',
			limit: 1,
			export: 'export-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts', {
			method: 'GET',
			query: {
				id: [1],
				details: true,
				search: 'search-1',
				name: 'name-1',
				creation_after: 'creation_after-1',
				creation_before: 'creation_before-1',
				min_size: 1,
				max_size: 1,
				domain: ['domain-1'],
				tag: [1],
				'tag.name': ['tag.name-1'],
				'address.country': ['address.country-1'],
				'address.city': ['address.city-1'],
				'address.state_region': ['address.state_region-1'],
				hotness: 1,
				offset: 1,
				custom: 'custom-1',
				order_by: ['order_by-1'],
				q: 'q-1',
				limit: 1,
				export: 'export-1',
			},
		});
		await createAccount(ctx, {
			update_if_exists: true,
			owner: 1,
			name: 'name-1',
			domain: 'domain-1',
			picture: 'picture-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts', {
			method: 'POST',
			query: { update_if_exists: true },
			body: {
				owner: 1,
				name: 'name-1',
				domain: 'domain-1',
				picture: 'picture-1',
			},
		});
		await listContacts(ctx, {
			id: [1],
			name: 'name-1',
			email: 'email-1',
			phone_number: 'phone_number-1',
			domain: 'domain-1',
			modification_after: 'modification_after-1',
			modification_before: 'modification_before-1',
			creation_after: 'creation_after-1',
			creation_before: 'creation_before-1',
			account: [1],
			tag: [1],
			'tag.name': ['tag.name-1'],
			'position.role': ['position.role-1'],
			'address.country': ['address.country-1'],
			'address.state_region': ['address.state_region-1'],
			'address.city': ['address.city-1'],
			includeArchived: true,
			search: 'search-1',
			type: 'customer',
			limit: 1,
			offset: 1,
			custom: 'custom-1',
			order_by: ['order_by-1'],
			export: 'export-1',
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/contacts', {
			method: 'GET',
			query: {
				id: [1],
				name: 'name-1',
				email: 'email-1',
				phone_number: 'phone_number-1',
				domain: 'domain-1',
				modification_after: 'modification_after-1',
				modification_before: 'modification_before-1',
				creation_after: 'creation_after-1',
				creation_before: 'creation_before-1',
				account: [1],
				tag: [1],
				'tag.name': ['tag.name-1'],
				'position.role': ['position.role-1'],
				'address.country': ['address.country-1'],
				'address.state_region': ['address.state_region-1'],
				'address.city': ['address.city-1'],
				includeArchived: true,
				search: 'search-1',
				type: 'customer',
				limit: 1,
				offset: 1,
				custom: 'custom-1',
				order_by: ['order_by-1'],
				export: 'export-1',
				q: 'q-1',
			},
		});
		await createContact(ctx, {
			force: true,
			owner: 1,
			domain: 'domain-1',
			email: 'email-1',
			prefix: 'prefix-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/contacts', {
			method: 'POST',
			query: { force: true },
			body: {
				owner: 1,
				domain: 'domain-1',
				email: 'email-1',
				prefix: 'prefix-1',
			},
		});
		await listCurrencies(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/currencies', { method: 'GET' });
		await listGroups(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups', { method: 'GET' });
		await retrieveCurrentUser(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/me', { method: 'GET' });
		await listOpportunities(ctx, {
			search: 'search-1',
			id: 1,
			name: 'name-1',
			status: 'status-1',
			stage: 1,
			'stage.name': 'stage.name-1',
			owner: 1,
			team_member: 1,
			owner_group: 1,
			assignee_group: 1,
			team_member_group: 1,
			account: 1,
			assignee: 1,
			min_value: 1,
			max_value: 1,
			close_after: 'close_after-1',
			close_before: 'close_before-1',
			creation_after: 'creation_after-1',
			creation_before: 'creation_before-1',
			closed: true,
			done: true,
			tag: [1],
			'tag.name': 'tag.name-1',
			hotness: 1,
			limit: 1,
			offset: 1,
			order_by: ['order_by-1'],
			pipeline: 1,
			custom: 'custom-1',
			details: true,
			export: 'export-1',
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities', {
			method: 'GET',
			query: {
				search: 'search-1',
				id: 1,
				name: 'name-1',
				status: 'status-1',
				stage: 1,
				'stage.name': 'stage.name-1',
				owner: 1,
				team_member: 1,
				owner_group: 1,
				assignee_group: 1,
				team_member_group: 1,
				account: 1,
				assignee: 1,
				min_value: 1,
				max_value: 1,
				close_after: 'close_after-1',
				close_before: 'close_before-1',
				creation_after: 'creation_after-1',
				creation_before: 'creation_before-1',
				closed: true,
				done: true,
				tag: [1],
				'tag.name': 'tag.name-1',
				hotness: 1,
				limit: 1,
				offset: 1,
				order_by: ['order_by-1'],
				pipeline: 1,
				custom: 'custom-1',
				details: true,
				export: 'export-1',
				q: 'q-1',
			},
		});
		await createOpportunity(ctx, {
			owner: 1,
			account: 1,
			stage: 1,
			lost_reason: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities', {
			method: 'POST',
			body: { owner: 1, account: 1, stage: 1, lost_reason: 1 },
		});
		await listPersons(ctx, {
			id: [1],
			name: 'name-1',
			email: 'email-1',
			search: 'search-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/persons', {
			method: 'GET',
			query: { id: [1], name: 'name-1', email: 'email-1', search: 'search-1' },
		});
		await listPipelines(ctx, {
			search: 'search-1',
			order_by: ['order_by-1'],
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/pipelines', {
			method: 'GET',
			query: { search: 'search-1', order_by: ['order_by-1'], q: 'q-1' },
		});
		await listStages(ctx, {
			id: 1,
			name: 'name-1',
			'pipeline.id': 1,
			'pipeline.name': 'pipeline.name-1',
			order_by: 'order_by-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/stages', {
			method: 'GET',
			query: {
				id: 1,
				name: 'name-1',
				'pipeline.id': 1,
				'pipeline.name': 'pipeline.name-1',
				order_by: 'order_by-1',
			},
		});
		await listTags(ctx, {
			id: [1],
			name: 'name-1',
			limit: 1,
			offset: 1,
			order_by: ['order_by-1'],
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags', {
			method: 'GET',
			query: {
				id: [1],
				name: 'name-1',
				limit: 1,
				offset: 1,
				order_by: ['order_by-1'],
				q: 'q-1',
			},
		});
		await createTag(ctx, { name: 'name-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags', {
			method: 'POST',
			body: { name: 'name-1' },
		});
		await listTasks(ctx, {
			id: [1],
			search: 'search-1',
			assignees: [1],
			type: [1],
			account: [1],
			order_by: ['order_by-1'],
			limit: 1,
			offset: 1,
			export: 'export-1',
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tasks', {
			method: 'GET',
			query: {
				id: [1],
				search: 'search-1',
				assignees: [1],
				type: [1],
				account: [1],
				order_by: ['order_by-1'],
				limit: 1,
				offset: 1,
				export: 'export-1',
				q: 'q-1',
			},
		});
		await createTask(ctx, {
			account: 1,
			description: 'description-1',
			reminder_date: 'reminder_date-1',
			assignees: [1],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tasks', {
			method: 'POST',
			body: {
				account: 1,
				description: 'description-1',
				reminder_date: 'reminder_date-1',
				assignees: [1],
			},
		});
		await listUsers(ctx, {
			id: [1],
			name: 'name-1',
			email: 'email-1',
			search: 'search-1',
			limit: 1,
			offset: 1,
			order_by: ['order_by-1'],
			onlyEnabled: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users', {
			method: 'GET',
			query: {
				id: [1],
				name: 'name-1',
				email: 'email-1',
				search: 'search-1',
				limit: 1,
				offset: 1,
				order_by: ['order_by-1'],
				onlyEnabled: true,
			},
		});
		await listWorkflows(ctx, {
			limit: 1,
			offset: 1,
			order_by: ['order_by-1'],
			search: 'search-1',
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/workflows', {
			method: 'GET',
			query: {
				limit: 1,
				offset: 1,
				order_by: ['order_by-1'],
				search: 'search-1',
				q: 'q-1',
			},
		});
		await createWorkflow(ctx, {
			name: 'name-1',
			status: 'live',
			status_message: 'status_message-1',
			record_type: 'contact',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/workflows', {
			method: 'POST',
			body: {
				name: 'name-1',
				status: 'live',
				status_message: 'status_message-1',
				record_type: 'contact',
			},
		});
		await retrieveAccount(ctx, { accountId: 'account_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1', {
			method: 'GET',
		});
		await updateAccount(ctx, {
			accountId: 'account_id-1',
			name: 'name-1',
			domain: 'domain-1',
			picture: 'picture-1',
			size: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1', {
			method: 'PUT',
			body: {
				name: 'name-1',
				domain: 'domain-1',
				picture: 'picture-1',
				size: 1,
			},
		});
		await deleteAccount(ctx, { accountId: 'account_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1', {
			method: 'DELETE',
		});
		await listCampaignMergeFields(ctx, {
			placeholder: 'placeholder-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/campaigns/mergefields', {
			method: 'GET',
		});
		await retrieveContact(ctx, { contactId: 'contact_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/contacts/contact_id-1', {
			method: 'GET',
		});
		await updateContact(ctx, {
			contactId: 'contact_id-1',
			force: true,
			prefix: 'prefix-1',
			firstname: 'firstname-1',
			middle: 'middle-1',
			lastname: 'lastname-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/contacts/contact_id-1', {
			method: 'PUT',
			query: { force: true },
			body: {
				prefix: 'prefix-1',
				firstname: 'firstname-1',
				middle: 'middle-1',
				lastname: 'lastname-1',
			},
		});
		await deleteContact(ctx, { contactId: 'contact_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/contacts/contact_id-1', {
			method: 'DELETE',
		});
		await listCustomFieldTypes(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/customfields/types', {
			method: 'GET',
		});
		await listCustomFields(ctx, {
			itemClass: 'itemClass-1',
			includeDisabled: true,
			pipeline: 1,
			name: 'name-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/customfields/itemClass-1', {
			method: 'GET',
			query: { includeDisabled: true, pipeline: 1, name: 'name-1' },
		});
		await createCustomFieldSub(ctx, {
			itemClass: 'itemClass-1',
			type: 1,
			name: 'name-1',
			enabled: true,
			archived: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/customfields/itemClass-1', {
			method: 'POST',
			body: { type: 1, name: 'name-1', enabled: true, archived: true },
		});
		await listEmailDataSources(ctx, { includeTeamDataSources: true } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/email', {
			method: 'GET',
			query: { includeTeamDataSources: true },
		});
		await listFilterFields(ctx, {
			entity: 'entity-1',
			pipeline: 1,
			includePipelineSpecificPredefinedFilterFields: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/filterfields/entity-1', {
			method: 'GET',
			query: {
				pipeline: 1,
				includePipelineSpecificPredefinedFilterFields: true,
			},
		});
		await retrieveGroup(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/groups/id-1', {
			method: 'GET',
		});
		await listMyContacts(ctx, {
			id: [1],
			name: 'name-1',
			email: 'email-1',
			phone_number: 'phone_number-1',
			domain: 'domain-1',
			modification_after: 'modification_after-1',
			modification_before: 'modification_before-1',
			creation_after: 'creation_after-1',
			creation_before: 'creation_before-1',
			account: [1],
			tag: [1],
			'tag.name': ['tag.name-1'],
			'position.role': ['position.role-1'],
			'address.country': ['address.country-1'],
			'address.state_region': ['address.state_region-1'],
			'address.city': ['address.city-1'],
			includeArchived: true,
			search: 'search-1',
			type: 'customer',
			limit: 1,
			offset: 1,
			custom: 'custom-1',
			order_by: ['order_by-1'],
			export: 'export-1',
			q: 'q-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/me/contacts', {
			method: 'GET',
			query: {
				id: [1],
				name: 'name-1',
				email: 'email-1',
				phone_number: 'phone_number-1',
				domain: 'domain-1',
				modification_after: 'modification_after-1',
				modification_before: 'modification_before-1',
				creation_after: 'creation_after-1',
				creation_before: 'creation_before-1',
				account: [1],
				tag: [1],
				'tag.name': ['tag.name-1'],
				'position.role': ['position.role-1'],
				'address.country': ['address.country-1'],
				'address.state_region': ['address.state_region-1'],
				'address.city': ['address.city-1'],
				includeArchived: true,
				search: 'search-1',
				type: 'customer',
				limit: 1,
				offset: 1,
				custom: 'custom-1',
				order_by: ['order_by-1'],
				export: 'export-1',
				q: 'q-1',
			},
		});
		await retrieveMeeting(ctx, { meetingId: 'meeting_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/meetings/meeting_id-1', {
			method: 'GET',
		});
		await updateMeeting(ctx, {
			meetingId: 'meeting_id-1',
			calendar_id: 'calendar_id-1',
			external_id: 'external_id-1',
			minutes: 'minutes-1',
			notes: 'notes-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/meetings/meeting_id-1', {
			method: 'PUT',
			body: {
				calendar_id: 'calendar_id-1',
				external_id: 'external_id-1',
				minutes: 'minutes-1',
				notes: 'notes-1',
			},
		});
		await deleteMeeting(ctx, { meetingId: 'meeting_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/meetings/meeting_id-1', {
			method: 'DELETE',
		});
		await retrieveOpportunity(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/id-1', {
			method: 'GET',
		});
		await updateOpportunity(ctx, {
			id: 'id-1',
			owner: 1,
			account: 1,
			stage: 1,
			lost_reason: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/id-1', {
			method: 'PUT',
			body: { owner: 1, account: 1, stage: 1, lost_reason: 1 },
		});
		await deleteOpportunity(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/id-1', {
			method: 'DELETE',
		});
		await retrieveAiSettings(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/settings/ai', {
			method: 'GET',
		});
		await updateAiSettings(ctx, { placeholder: 'placeholder-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/settings/ai', {
			method: 'PUT',
			body: { placeholder: 'placeholder-1' },
		});
		await retrieveStage(ctx, { stageId: 'stage_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/stages/stage_id-1', {
			method: 'GET',
		});
		await retrieveTag(ctx, { tagId: 'tag_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags/tag_id-1', {
			method: 'GET',
		});
		await updateTag(ctx, { tagId: 'tag_id-1', name: 'name-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags/tag_id-1', {
			method: 'PUT',
			body: { name: 'name-1' },
		});
		await deleteTag(ctx, { tagId: 'tag_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags/tag_id-1', {
			method: 'DELETE',
		});
		await retrieveUser(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/users/id-1', { method: 'GET' });
		await retrieveWorkflow(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/workflows/id-1', {
			method: 'GET',
		});
		await updateWorkflow(ctx, {
			id: 'id-1',
			name: 'name-1',
			status: 'live',
			status_message: 'status_message-1',
			record_type: 'contact',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/workflows/id-1', {
			method: 'PUT',
			body: {
				name: 'name-1',
				status: 'live',
				status_message: 'status_message-1',
				record_type: 'contact',
			},
		});
		await listAccountMessages(ctx, {
			accountId: 'account_id-1',
			before: 'before-1',
			after: 'after-1',
			limit: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/accounts/account_id-1/messages',
			{
				method: 'GET',
				query: { before: 'before-1', after: 'after-1', limit: 1 },
			},
		);
		await listAccountFeed(ctx, {
			accountId: 'account_id-1',
			before: 'before-1',
			after: 'after-1',
			limit: 1,
			types: ['email'],
			contacts: [1],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1/feed', {
			method: 'GET',
			query: {
				before: 'before-1',
				after: 'after-1',
				limit: 1,
				types: ['email'],
				contacts: [1],
			},
		});
		await retrieveCustomField(ctx, {
			itemClass: 'itemClass-1',
			id: 'id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/customfields/itemClass-1/id-1',
			{ method: 'GET' },
		);
		await updateCustomField(ctx, {
			itemClass: 'itemClass-1',
			id: '42',
			type: 1,
			name: 'name-1',
			enabled: true,
			archived: true,
		} as never);
		// The provider requires the id in the body too (live 400 without it).
		expect(request).toHaveBeenCalledWith(ctx, '/customfields/itemClass-1/42', {
			method: 'PUT',
			body: { id: 42, type: 1, name: 'name-1', enabled: true, archived: true },
		});
		await deleteCustomField(ctx, {
			itemClass: 'itemClass-1',
			id: 'id-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/customfields/itemClass-1/id-1',
			{ method: 'DELETE' },
		);
		await listTagUsage(ctx, { tagId: 'tag_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tags/tag_id-1/usage', {
			method: 'GET',
		});
		await listCustomFieldOptions(ctx, {
			itemClass: 'itemClass-1',
			customFieldApiField: 'customFieldApiField-1',
			searchString: 'searchString-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/customfields/itemClass-1/customFieldApiField-1/options',
			{ method: 'GET', query: { searchString: 'searchString-1' } },
		);
		await createCall(ctx, {
			date: 'date-1',
			end_date: 'end_date-1',
			subject: 'subject-1',
			description: 'description-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/calls', {
			method: 'POST',
			body: {
				date: 'date-1',
				end_date: 'end_date-1',
				subject: 'subject-1',
				description: 'description-1',
			},
		});
		await createMeeting(ctx, {
			date: 'date-1',
			end_date: 'end_date-1',
			subject: 'subject-1',
			description: 'description-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/meetings', {
			method: 'POST',
			body: {
				date: 'date-1',
				end_date: 'end_date-1',
				subject: 'subject-1',
				description: 'description-1',
			},
		});
		await createMessage(ctx, {
			account: 1,
			body: 'body-1',
			mentions: [1],
			date: 'date-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/messages', {
			method: 'POST',
			body: { account: 1, body: 'body-1', mentions: [1], date: 'date-1' },
		});
		await addAccountUsers(ctx, {
			accountId: 'account_id-1',
			id: 1,
			_dirty: true,
			_deleted: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1/users', {
			method: 'POST',
			body: { id: 1, _dirty: true, _deleted: true },
		});
		await updateAccountUsers(ctx, {
			accountId: 'account_id-1',
			id: 1,
			_dirty: true,
			_deleted: true,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/accounts/account_id-1/users', {
			method: 'PUT',
			body: { id: 1, _dirty: true, _deleted: true },
		});
		await addAccountContacts(ctx, {
			accountId: 'account_id-1',
			id: 1,
			_dirty: true,
			_deleted: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/accounts/account_id-1/contacts',
			{ method: 'POST', body: { id: 1, _dirty: true, _deleted: true } },
		);
		await updateAccountContacts(ctx, {
			accountId: 'account_id-1',
			id: 1,
			_dirty: true,
			_deleted: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/accounts/account_id-1/contacts',
			{ method: 'PUT', body: { id: 1, _dirty: true, _deleted: true } },
		);
		await createMessageFeedback(ctx, {
			messageId: 'message_id-1',
			feedback: 'feedback-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/messages/message_id-1/feedback',
			{ method: 'POST', body: { feedback: 'feedback-1' } },
		);
		await updateCall(ctx, {
			meetingId: 'meeting_id-1',
			calendar_id: 'calendar_id-1',
			external_id: 'external_id-1',
			minutes: 'minutes-1',
			notes: 'notes-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/calls/meeting_id-1', {
			method: 'PUT',
			body: {
				calendar_id: 'calendar_id-1',
				external_id: 'external_id-1',
				minutes: 'minutes-1',
				notes: 'notes-1',
			},
		});
		await updateMessage(ctx, {
			messageId: 'message_id-1',
			account: 1,
			body: 'body-1',
			mentions: [1],
			date: 'date-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/messages/message_id-1', {
			method: 'PUT',
			body: { account: 1, body: 'body-1', mentions: [1], date: 'date-1' },
		});
		await deleteMessage(ctx, { messageId: 'message_id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/messages/message_id-1', {
			method: 'DELETE',
		});
		await updateTask(ctx, {
			id: 'id-1',
			account: 1,
			description: 'description-1',
			reminder_date: 'reminder_date-1',
			assignees: [1],
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tasks/id-1', {
			method: 'PUT',
			body: {
				account: 1,
				description: 'description-1',
				reminder_date: 'reminder_date-1',
				assignees: [1],
			},
		});
		await deleteTask(ctx, { id: 'id-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/tasks/id-1', {
			method: 'DELETE',
		});
		await updateEmailDataSource(ctx, {
			id: 'id-1',
			email_signature: 'email_signature-1',
			add_signature_to_campaign: true,
			add_signature_to_replies: true,
			max_emails_day: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/datasources/email/id-1', {
			method: 'PUT',
			body: {
				email_signature: 'email_signature-1',
				add_signature_to_campaign: true,
				add_signature_to_replies: true,
				max_emails_day: 1,
			},
		});
		await updateWorkflowAudience(ctx, {
			id: 'id-1',
			recordId: 'record_id-1',
			exited: true,
			met_goal: true,
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/workflows/id-1/audience/record_id-1',
			{ method: 'PUT', body: { exited: true, met_goal: true } },
		);
	});
});
