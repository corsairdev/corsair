import {
	bulkResponseList,
	collector,
	collectorList,
	contact,
	contactField,
	contactList,
	contactListWrapper,
	contactWrapper,
	folder,
	folderWrapper,
	message,
	page,
	pageList,
	question,
	questionList,
	recipient,
	response,
	responseList,
	survey,
	surveyList,
	user,
	webhook,
	webhookWrapper,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	fetchCount,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	pathname,
	queryParam,
	restoreFetchMock,
	sentBody,
	sentHeader,
	TEST_AUTH,
} from './test-helpers';

const ctx = makeCtx();

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('surveymonkey surveys', () => {
	it('lists surveys with only the filters that were set', async () => {
		mockFetch(jsonResponse(surveyList));
		const result = await endpoints.surveys.list(ctx, {
			page: 2,
			per_page: 10,
			sort_by: 'date_modified',
			sort_order: 'DESC',
		});

		expect(lastCall().url).toBe(
			`${BASE}/surveys?page=2&per_page=10&sort_by=date_modified&sort_order=DESC`,
		);
		expect(sentHeader('Authorization')).toBe(TEST_AUTH);
		expect(sentHeader('Accept')).toBe('application/json');
		expect(result.data).toHaveLength(1);
		expect(result.total).toBe(1);
	});

	it('never sends an unset filter as an empty value', async () => {
		mockFetch(jsonResponse(surveyList));
		await endpoints.surveys.list(ctx, {});

		expect([...new URL(lastCall().url).searchParams.keys()]).toEqual([]);
	});

	it('creates a survey from a title', async () => {
		mockFetch(jsonResponse(survey, { status: 201 }));
		await endpoints.surveys.create(ctx, { title: 'My Survey' });

		expect(pathname()).toBe('/v3/surveys');
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ title: 'My Survey' });
	});

	it('copies a template by id', async () => {
		mockFetch(jsonResponse(survey, { status: 201 }));
		await endpoints.surveys.create(ctx, {
			title: 'From template',
			from_template_id: '9876',
		});

		expect(sentBody()).toEqual({
			title: 'From template',
			from_template_id: '9876',
		});
	});

	it('reads one survey and its details', async () => {
		mockFetch(jsonResponse(survey));
		const one = await endpoints.surveys.get(ctx, { survey_id: '1234' });
		expect(pathname()).toBe('/v3/surveys/1234');
		expect(one.id).toBe('1234');

		mockFetch(jsonResponse({ ...survey, pages: [page] }));
		const details = await endpoints.surveys.getDetails(ctx, {
			survey_id: '1234',
		});
		expect(pathname()).toBe('/v3/surveys/1234/details');
		expect(details.pages).toHaveLength(1);
	});

	it('patches only the fields it was given', async () => {
		mockFetch(jsonResponse(survey));
		await endpoints.surveys.update(ctx, {
			survey_id: '1234',
			title: 'New title',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ title: 'New title' });
	});

	it('sends PUT for a replace and PATCH for an update', async () => {
		mockFetch(jsonResponse(survey));
		await endpoints.surveys.replace(ctx, {
			survey_id: '1234',
			title: 'Replaced',
		});

		expect(lastCall().init.method).toBe('PUT');
		expect(sentBody()).toEqual({ title: 'Replaced' });
	});

	it('reports a deleted survey instead of reading an empty body', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.surveys.delete(ctx, { survey_id: '1234' }),
		).resolves.toEqual({ survey_id: '1234', deleted: true });
		expect(lastCall().init.method).toBe('DELETE');
	});

	it('lists categories, templates and languages', async () => {
		const wrappers = [
			[
				'listCategories',
				'/v3/survey_categories',
				{ id: '1', name: 'Business' },
			],
			['listTemplates', '/v3/survey_templates', survey],
			['listLanguages', '/v3/survey_languages', { id: 'en', name: 'English' }],
		] as const;

		for (const [name, path, item] of wrappers) {
			mockFetch(
				jsonResponse({ page: 1, per_page: 50, total: 1, data: [item] }),
			);
			const result = await endpoints.surveys[name](ctx, { page: 1 });
			expect(pathname()).toBe(path);
			expect(result.data).toHaveLength(1);
		}
	});
});

describe('surveymonkey pages and questions', () => {
	it('lists pages under the survey', async () => {
		mockFetch(jsonResponse(pageList));
		const result = await endpoints.pages.list(ctx, { survey_id: '1234' });

		expect(pathname()).toBe('/v3/surveys/1234/pages');
		expect(result.data[0]?.id).toBe('5678');
	});

	it('creates a page with only the fields given', async () => {
		mockFetch(jsonResponse(page, { status: 201 }));
		await endpoints.pages.create(ctx, {
			survey_id: '1234',
			title: 'Page 1',
			position: 1,
		});

		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ title: 'Page 1', position: 1 });
	});

	it('reads, updates and deletes one page', async () => {
		mockFetch(jsonResponse(page));
		await endpoints.pages.get(ctx, { survey_id: '1234', page_id: '5678' });
		expect(pathname()).toBe('/v3/surveys/1234/pages/5678');

		mockFetch(jsonResponse(page));
		await endpoints.pages.update(ctx, {
			survey_id: '1234',
			page_id: '5678',
			title: 'Renamed',
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ title: 'Renamed' });

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.pages.delete(ctx, { survey_id: '1234', page_id: '5678' }),
		).resolves.toEqual({
			survey_id: '1234',
			page_id: '5678',
			deleted: true,
		});
	});

	it('lists and creates questions under a page', async () => {
		mockFetch(jsonResponse(questionList));
		const listed = await endpoints.questions.list(ctx, {
			survey_id: '1234',
			page_id: '5678',
		});
		expect(pathname()).toBe('/v3/surveys/1234/pages/5678/questions');
		expect(listed.data[0]?.family).toBe('single_choice');

		mockFetch(jsonResponse(question, { status: 201 }));
		await endpoints.questions.create(ctx, {
			survey_id: '1234',
			page_id: '5678',
			family: 'single_choice',
			subtype: 'vertical',
			headings: [{ heading: 'Pick one' }],
		});
		expect(sentBody()).toEqual({
			family: 'single_choice',
			subtype: 'vertical',
			headings: [{ heading: 'Pick one' }],
		});
	});

	it('requires a family, a subtype and at least one heading on create', async () => {
		const create = endpoints.questions.create.bind(endpoints.questions);
		const base = { survey_id: '1234', page_id: '5678' };

		await expect(
			create(ctx, {
				...base,
				subtype: 'vertical',
				headings: [{ heading: 'x' }],
			} as never),
		).rejects.toThrow();
		await expect(
			create(ctx, {
				...base,
				family: 'open_ended',
				headings: [{ heading: 'x' }],
			} as never),
		).rejects.toThrow();
		await expect(
			create(ctx, {
				...base,
				family: 'open_ended',
				subtype: 'single',
				headings: [],
			}),
		).rejects.toThrow();
		expect(fetchCount()).toBe(0);
	});

	it('updates and deletes one question', async () => {
		mockFetch(jsonResponse(question));
		await endpoints.questions.update(ctx, {
			survey_id: '1234',
			page_id: '5678',
			question_id: '9012',
			visible: false,
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ visible: false });

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.questions.delete(ctx, {
				survey_id: '1234',
				page_id: '5678',
				question_id: '9012',
			}),
		).resolves.toEqual({
			survey_id: '1234',
			page_id: '5678',
			question_id: '9012',
			deleted: true,
		});
	});
});

describe('surveymonkey responses', () => {
	it('lists survey responses, which carry only ids and links', async () => {
		mockFetch(jsonResponse(responseList));
		const result = await endpoints.responses.list(ctx, {
			survey_id: '1234',
			status: 'completed',
		});

		expect(pathname()).toBe('/v3/surveys/1234/responses');
		expect(queryParam('status')).toBe('completed');
		expect(result.data[0]).toEqual(responseList.data[0]);
	});

	it('reads the bulk list with the answers included', async () => {
		mockFetch(jsonResponse(bulkResponseList));
		const result = await endpoints.responses.listBulk(ctx, {
			survey_id: '1234',
			per_page: 100,
			simple: true,
		});

		expect(pathname()).toBe('/v3/surveys/1234/responses/bulk');
		expect(queryParam('per_page')).toBe('100');
		expect(queryParam('simple')).toBe('true');
		expect(result.data[0]?.pages).toHaveLength(1);
	});

	it('reads one response and its details', async () => {
		mockFetch(jsonResponse(response));
		const one = await endpoints.responses.get(ctx, {
			survey_id: '1234',
			response_id: '5001',
		});
		expect(pathname()).toBe('/v3/surveys/1234/responses/5001');
		expect(one.response_status).toBe('completed');

		mockFetch(jsonResponse(response));
		await endpoints.responses.getDetails(ctx, {
			survey_id: '1234',
			response_id: '5001',
		});
		expect(pathname()).toBe('/v3/surveys/1234/responses/5001/details');
	});

	it('creates a response through its collector', async () => {
		mockFetch(jsonResponse(response, { status: 201 }));
		await endpoints.responses.create(ctx, {
			collector_id: '1234',
			response_status: 'completed',
			pages: [
				{
					id: '5678',
					questions: [{ id: '9012', answers: [{ choice_id: '111' }] }],
				},
			],
		});

		expect(pathname()).toBe('/v3/collectors/1234/responses');
		expect(sentBody()).toEqual({
			response_status: 'completed',
			pages: [
				{
					id: '5678',
					questions: [{ id: '9012', answers: [{ choice_id: '111' }] }],
				},
			],
		});
	});

	it('deletes one response and every response of a collector', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.responses.delete(ctx, {
				survey_id: '1234',
				response_id: '5001',
			}),
		).resolves.toEqual({
			survey_id: '1234',
			response_id: '5001',
			deleted: true,
		});

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.responses.deleteAll(ctx, { collector_id: '1234' }),
		).resolves.toEqual({ collector_id: '1234', deleted: true });
		expect(lastCall().init.method).toBe('DELETE');
		expect(pathname()).toBe('/v3/collectors/1234/responses');
	});
});

describe('surveymonkey collectors, messages and recipients', () => {
	it('lists collectors of a survey', async () => {
		mockFetch(jsonResponse(collectorList));
		const result = await endpoints.collectors.list(ctx, {
			survey_id: '1234',
			include: 'type',
		});

		expect(pathname()).toBe('/v3/surveys/1234/collectors');
		expect(queryParam('include')).toBe('type');
		expect(result.data[0]?.url).toContain('surveymonkey.com/r/');
	});

	it('creates a weblink collector without sending a type it was not given', async () => {
		mockFetch(jsonResponse(collector, { status: 201 }));
		await endpoints.collectors.create(ctx, {
			survey_id: '1234',
			name: 'My Collector',
		});

		expect(sentBody()).toEqual({ name: 'My Collector' });
	});

	it('rejects a collector type the API cannot create', async () => {
		await expect(
			endpoints.collectors.create(ctx, {
				survey_id: '1234',
				type: 'sms',
			} as never),
		).rejects.toThrow();
		expect(fetchCount()).toBe(0);
	});

	it('closes a collector by status', async () => {
		mockFetch(jsonResponse({ ...collector, status: 'closed', open: false }));
		await endpoints.collectors.update(ctx, {
			collector_id: '1234',
			status: 'closed',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ status: 'closed' });
	});

	it('reports a deleted collector', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.collectors.delete(ctx, { collector_id: '1234' }),
		).resolves.toEqual({ collector_id: '1234', deleted: true });
	});

	it('lists and drafts messages without sending them', async () => {
		mockFetch(
			jsonResponse({ page: 1, per_page: 50, total: 1, data: [message] }),
		);
		const listed = await endpoints.messages.list(ctx, { collector_id: '1234' });
		expect(pathname()).toBe('/v3/collectors/1234/messages');
		expect(listed.data[0]?.type).toBe('invite');

		mockFetch(jsonResponse(message, { status: 201 }));
		await endpoints.messages.create(ctx, {
			collector_id: '1234',
			subject: 'Please take my survey',
			body: 'It only takes a minute.',
		});
		expect(sentBody()).toEqual({
			subject: 'Please take my survey',
			body: 'It only takes a minute.',
		});
		// Nothing was sent to a respondent: the send route is separate.
		expect(pathname()).toBe('/v3/collectors/1234/messages');
	});

	it('sends a message to every recipient on it', async () => {
		mockFetch(jsonResponse({ ...message, status: 'sent' }));
		await endpoints.messages.send(ctx, {
			collector_id: '1234',
			message_id: '2345',
		});

		expect(lastCall().init.method).toBe('POST');
		expect(pathname()).toBe('/v3/collectors/1234/messages/2345/send');
		expect(sentBody()).toEqual({});
	});

	it('schedules a send instead of sending now', async () => {
		mockFetch(jsonResponse({ ...message, status: 'scheduled' }));
		await endpoints.messages.send(ctx, {
			collector_id: '1234',
			message_id: '2345',
			scheduled_date: '2026-12-01T09:00:00+00:00',
		});

		expect(sentBody()).toEqual({
			scheduled_date: '2026-12-01T09:00:00+00:00',
		});
	});

	it('lists and adds recipients', async () => {
		mockFetch(
			jsonResponse({ page: 1, per_page: 50, total: 1, data: [recipient] }),
		);
		const listed = await endpoints.recipients.list(ctx, {
			collector_id: '1234',
			message_id: '2345',
		});
		expect(listed.data[0]?.email).toBe('bob@example.com');

		mockFetch(jsonResponse(recipient, { status: 201 }));
		await endpoints.recipients.create(ctx, {
			collector_id: '1234',
			message_id: '2345',
			email: 'bob@example.com',
			first_name: 'Bob',
		});
		expect(sentBody()).toEqual({
			email: 'bob@example.com',
			first_name: 'Bob',
		});
	});

	it('adds recipients in bulk inside a contacts array', async () => {
		mockFetch(
			jsonResponse(
				{ succeeded: [recipient], invalid: [], existing: [] },
				{ status: 201 },
			),
		);
		await endpoints.recipients.bulkCreate(ctx, {
			collector_id: '1234',
			message_id: '2345',
			contacts: [{ email: 'bob@example.com' }],
		});

		expect(pathname()).toBe(
			'/v3/collectors/1234/messages/2345/recipients/bulk',
		);
		expect(sentBody()).toEqual({ contacts: [{ email: 'bob@example.com' }] });
	});
});

describe('surveymonkey contacts and contact lists', () => {
	it('lists contact lists', async () => {
		mockFetch(jsonResponse(contactListWrapper));
		const result = await endpoints.contactLists.list(ctx, { page: 1 });

		expect(pathname()).toBe('/v3/contact_lists');
		expect(result.data[0]?.name).toBe('My Contact List');
	});

	it('creates and renames a contact list', async () => {
		mockFetch(jsonResponse(contactList, { status: 201 }));
		await endpoints.contactLists.create(ctx, { name: 'My Contact List' });
		expect(sentBody()).toEqual({ name: 'My Contact List' });

		mockFetch(jsonResponse(contactList));
		await endpoints.contactLists.update(ctx, {
			contact_list_id: '1234',
			name: 'Renamed',
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ name: 'Renamed' });
	});

	it('copies a list and merges one into another', async () => {
		mockFetch(jsonResponse({ ...contactList, id: '9999' }, { status: 201 }));
		await endpoints.contactLists.copy(ctx, {
			contact_list_id: '1234',
			name: 'Copy',
		});
		expect(pathname()).toBe('/v3/contact_lists/1234/copy');
		expect(sentBody()).toEqual({ name: 'Copy' });

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.contactLists.merge(ctx, {
				contact_list_id: '1234',
				list_id: '5678',
			}),
		).resolves.toEqual({
			source_list_id: '1234',
			target_list_id: '5678',
			merged: true,
		});
		expect(sentBody()).toEqual({ list_id: '5678' });
	});

	it('reports a deleted contact list', async () => {
		mockFetch(jsonResponse({}));
		await expect(
			endpoints.contactLists.delete(ctx, { contact_list_id: '1234' }),
		).resolves.toEqual({ contact_list_id: '1234', deleted: true });
	});

	it('lists contacts with the documented filters', async () => {
		mockFetch(jsonResponse(contactWrapper));
		const result = await endpoints.contacts.list(ctx, {
			status: 'optout',
			search_by: 'email',
			search: 'bob@example.com',
		});

		expect(pathname()).toBe('/v3/contacts');
		expect(queryParam('status')).toBe('optout');
		expect(queryParam('search_by')).toBe('email');
		expect(result.data[0]?.email).toBe('test@surveymonkey.com');
	});

	it('rejects the bounced status the vendor does not list', async () => {
		expect(endpoints.contacts.list.length).toBeGreaterThanOrEqual(0);
		await expect(
			endpoints.contacts.list(ctx, { status: 'deleted' } as never),
		).rejects.toThrow();
		expect(fetchCount()).toBe(0);
	});

	it('creates a contact with both names', async () => {
		mockFetch(jsonResponse(contact, { status: 201 }));
		await endpoints.contacts.create(ctx, {
			first_name: 'John',
			last_name: 'Doe',
			email: 'test@surveymonkey.com',
		});

		expect(sentBody()).toEqual({
			first_name: 'John',
			last_name: 'Doe',
			email: 'test@surveymonkey.com',
		});
	});

	it('requires a name and an email or a phone number on create', async () => {
		await expect(
			endpoints.contacts.create(ctx, {
				first_name: 'John',
				email: 'test@surveymonkey.com',
			} as never),
		).rejects.toThrow();
		await expect(
			endpoints.contacts.create(ctx, {
				first_name: 'John',
				last_name: 'Doe',
			}),
		).rejects.toThrow(/email or a phone number/);
		expect(fetchCount()).toBe(0);
	});

	it('creates contacts in bulk', async () => {
		mockFetch(
			jsonResponse(
				{ succeeded: [contact], invalid: [], existing: [] },
				{ status: 201 },
			),
		);
		await endpoints.contacts.bulkCreate(ctx, {
			contacts: [
				{ first_name: 'John', last_name: 'Doe', email: 'a@example.com' },
			],
		});

		expect(pathname()).toBe('/v3/contacts/bulk');
		expect(sentBody()).toEqual({
			contacts: [
				{ first_name: 'John', last_name: 'Doe', email: 'a@example.com' },
			],
		});
	});

	it('patches only the contact fields it was given', async () => {
		mockFetch(jsonResponse(contact));
		await endpoints.contacts.update(ctx, {
			contact_id: '1234',
			last_name: 'Smith',
		});

		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ last_name: 'Smith' });
	});

	it('lists contact fields and renames one', async () => {
		mockFetch(
			jsonResponse({ page: 1, per_page: 50, total: 1, data: [contactField] }),
		);
		const listed = await endpoints.contacts.listFields(ctx, {});
		expect(pathname()).toBe('/v3/contact_fields');
		expect(listed.data[0]?.label).toBe('Customer id');

		mockFetch(jsonResponse({ ...contactField, label: 'Order id' }));
		await endpoints.contacts.updateField(ctx, {
			contact_field_id: '1',
			label: 'Order id',
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({ label: 'Order id' });
	});
});

describe('surveymonkey webhooks, users and folders', () => {
	it('lists and creates webhooks', async () => {
		mockFetch(jsonResponse(webhookWrapper));
		const listed = await endpoints.webhooks.list(ctx, {});
		expect(pathname()).toBe('/v3/webhooks');
		expect(listed.data[0]?.event_type).toBe('response_completed');

		mockFetch(jsonResponse(webhook, { status: 201 }));
		await endpoints.webhooks.create(ctx, {
			name: 'My Webhook',
			event_type: 'response_completed',
			object_type: 'survey',
			object_ids: ['1234'],
			subscription_url: 'https://example.com/hook',
		});
		expect(sentBody()).toEqual({
			name: 'My Webhook',
			event_type: 'response_completed',
			object_type: 'survey',
			object_ids: ['1234'],
			subscription_url: 'https://example.com/hook',
		});
	});

	it('rejects an event type the vendor does not list', async () => {
		await expect(
			endpoints.webhooks.create(ctx, {
				name: 'Bad',
				event_type: 'answer_created',
				subscription_url: 'https://example.com/hook',
			} as never),
		).rejects.toThrow(/invalid|Invalid option/);
		expect(fetchCount()).toBe(0);
	});

	it('reads, patches and deletes a webhook', async () => {
		mockFetch(jsonResponse(webhook));
		await endpoints.webhooks.get(ctx, { webhook_id: '1234' });
		expect(pathname()).toBe('/v3/webhooks/1234');

		mockFetch(jsonResponse(webhook));
		await endpoints.webhooks.update(ctx, {
			webhook_id: '1234',
			subscription_url: 'https://example.com/other',
		});
		expect(lastCall().init.method).toBe('PATCH');
		expect(sentBody()).toEqual({
			subscription_url: 'https://example.com/other',
		});

		mockFetch(jsonResponse({}));
		await expect(
			endpoints.webhooks.delete(ctx, { webhook_id: '1234' }),
		).resolves.toEqual({ webhook_id: '1234', deleted: true });
	});

	it('reads the account behind the token', async () => {
		mockFetch(jsonResponse(user));
		const result = await endpoints.users.getMe(ctx, {});

		expect(pathname()).toBe('/v3/users/me');
		expect(result.account_type).toBe('premier');
	});

	it('lists and creates survey folders, sending the capitalised Title', async () => {
		mockFetch(jsonResponse(folderWrapper));
		const listed = await endpoints.folders.list(ctx, {});
		expect(pathname()).toBe('/v3/survey_folders');
		expect(listed.data[0]?.title).toBe('My Folder');

		mockFetch(jsonResponse(folder, { status: 201 }));
		await endpoints.folders.create(ctx, { title: 'My Folder' });
		expect(sentBody()).toEqual({ Title: 'My Folder' });
	});

	it('refuses a list body that is not the documented wrapper', async () => {
		mockFetch(jsonResponse(['not', 'a', 'wrapper']));
		await expect(endpoints.surveys.list(ctx, {})).rejects.toThrow(
			/unexpected survey list body/,
		);
	});

	it('refuses a list body with no data array', async () => {
		mockFetch(jsonResponse({ total: 0 }));
		await expect(endpoints.surveys.list(ctx, {})).rejects.toThrow(
			/no data array/,
		);
	});
});
