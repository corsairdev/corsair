import { createCorsair } from 'corsair/core';
import * as client from './client';
import { dovetail } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

describe('Dovetail API Endpoints', () => {
	const dovetailPlugin = dovetail({ key: 'test-api-token' });
	const corsair = createCorsair({
		plugins: [dovetailPlugin],
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Channels operations', () => {
		it('channels.create calls POST /v1/channels', async () => {
			const mockResponse = {
				data: {
					id: 'chn_1',
					title: 'NPS Feedback',
					content_type: 'NPS_FEEDBACK',
				},
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.create({
				title: 'NPS Feedback',
				content_type: 'NPS_FEEDBACK',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						title: 'NPS Feedback',
						content_type: 'NPS_FEEDBACK',
					},
				}),
			);
		});

		it('channels.update calls PATCH /v1/channels/{id}', async () => {
			const mockResponse = {
				data: { id: 'chn_1', title: 'Updated Title' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.update({
				channel_id: 'chn_1',
				title: 'Updated Title',
				context: 'Some context',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/chn_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'Updated Title', context: 'Some context' },
				}),
			);
		});

		it('channels.delete calls DELETE /v1/channels/{id}', async () => {
			const mockResponse = {
				data: {
					id: 'chn_1',
					title: 'Deleted',
					deleted: true,
					deleted_at: '2025-01-01T00:00:00Z',
				},
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.delete({
				channel_id: 'chn_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/chn_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('channels.createDataPoint calls POST /v1/channels/data', async () => {
			const mockResponse = {
				data: { id: 'dp_1', text: 'Great product' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.createDataPoint({
				channel_id: 'chn_1',
				text: 'Great product',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/data',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { channel_id: 'chn_1', text: 'Great product' },
				}),
			);
		});

		it('channels.createTopic calls POST /v1/channels/topics', async () => {
			const mockResponse = {
				data: { id: 'top_1', title: 'UX issues' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.createTopic({
				channel_id: 'chn_1',
				title: 'UX issues',
				description: 'Discussions around UX',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/topic',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						channel_id: 'chn_1',
						title: 'UX issues',
						description: 'Discussions around UX',
					},
				}),
			);
		});

		it('channels.updateTopic calls PATCH /v1/channels/topics/{id}', async () => {
			const mockResponse = {
				data: { id: 'top_1', title: 'Revised topic' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.updateTopic({
				topic_id: 'top_1',
				title: 'Revised topic',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/topic/top_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'Revised topic' },
				}),
			);
		});

		it('channels.deleteTopic calls DELETE /v1/channels/topics/{id}', async () => {
			const mockResponse = {
				data: {
					id: 'top_1',
					title: 'Topic',
					deleted: true,
					deleted_at: '2025-01-01T00:00:00Z',
				},
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.channels.deleteTopic({
				topic_id: 'top_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/channels/topic/top_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Contacts operations', () => {
		it('contacts.create calls POST /v1/contacts', async () => {
			const mockResponse = {
				data: { id: 'cnt_1', name: 'Alice' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.contacts.create({
				name: 'Alice',
				email: 'alice@example.com',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/contacts',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { name: 'Alice', email: 'alice@example.com' },
				}),
			);
		});

		it('contacts.get calls GET /v1/contacts/{id}', async () => {
			const mockResponse = {
				data: { id: 'cnt_1', name: 'Alice' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.contacts.get({
				contact_id: 'cnt_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/contacts/cnt_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('contacts.list calls GET /v1/contacts with pagination', async () => {
			const mockResponse = {
				data: [{ id: 'cnt_1', name: 'Alice' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.contacts.list({
				page: { limit: 10, start_cursor: 'cur_1' },
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/contacts',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					query: { 'page[limit]': 10, 'page[start_cursor]': 'cur_1' },
				}),
			);
		});

		it('contacts.update calls PATCH /v1/contacts/{id}', async () => {
			const mockResponse = {
				data: { id: 'cnt_1', name: 'Alice Updated' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.contacts.update({
				contact_id: 'cnt_1',
				name: 'Alice Updated',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/contacts/cnt_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { name: 'Alice Updated' },
				}),
			);
		});
	});

	describe('Data operations', () => {
		it('data.create calls POST /v1/data', async () => {
			const mockResponse = {
				data: { id: 'dat_1', title: 'Data Item' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.create({
				project_id: 'prj_1',
				title: 'Data Item',
				content: 'Some notes',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						project_id: 'prj_1',
						title: 'Data Item',
						content: 'Some notes',
					},
				}),
			);
		});

		it('data.get calls GET /v1/data/{id}', async () => {
			const mockResponse = {
				data: { id: 'dat_1', title: 'Data Item' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.get({
				data_id: 'dat_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data/dat_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('data.list calls GET /v1/data with filter and sort', async () => {
			const mockResponse = {
				data: [{ id: 'dat_1', title: 'Data Item' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.list({
				filter: { project_id: 'prj_1', title: 'Test' },
				sort: 'created_at',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					query: {
						'filter[project_id]': 'prj_1',
						'filter[title]': 'Test',
						sort: 'created_at',
					},
				}),
			);
		});

		it('data.update calls PATCH /v1/data/{id}', async () => {
			const mockResponse = {
				data: { id: 'dat_1', title: 'New Title' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.update({
				data_id: 'dat_1',
				title: 'New Title',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data/dat_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'New Title' },
				}),
			);
		});

		it('data.delete calls DELETE /v1/data/{id}', async () => {
			const mockResponse = {
				data: { id: 'dat_1', title: 'Item' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.delete({
				data_id: 'dat_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data/dat_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('data.export calls GET /v1/data/{id}/export/{type}', async () => {
			const mockResponse = {
				data: { id: 'dat_1', content_markdown: '# Title' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.export({
				data_id: 'dat_1',
				type: 'markdown',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data/dat_1/export/markdown',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('data.importFile calls POST /v1/data/import-file', async () => {
			const mockResponse = {
				data: { id: 'dat_1', title: 'Imported' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.data.importFile({
				project_id: 'prj_1',
				url: 'https://example.com/audio.mp3',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/data/import/file',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						project_id: 'prj_1',
						url: 'https://example.com/audio.mp3',
					},
				}),
			);
		});
	});

	describe('Docs operations', () => {
		it('docs.create calls POST /v1/docs', async () => {
			const mockResponse = {
				data: { id: 'doc_1', title: 'Research Doc' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.create({
				project_id: 'prj_1',
				title: 'Research Doc',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { project_id: 'prj_1', title: 'Research Doc' },
				}),
			);
		});

		it('docs.get calls GET /v1/docs/{id}', async () => {
			const mockResponse = {
				data: { id: 'doc_1', title: 'Research Doc' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.get({
				doc_id: 'doc_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/doc_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('docs.list calls GET /v1/docs', async () => {
			const mockResponse = {
				data: [{ id: 'doc_1', title: 'Research Doc' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.list({
				filter: { project_id: 'prj_1' },
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					query: { 'filter[project_id]': 'prj_1' },
				}),
			);
		});

		it('docs.update calls PATCH /v1/docs/{id}', async () => {
			const mockResponse = {
				data: { id: 'doc_1', title: 'New Doc Title' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.update({
				doc_id: 'doc_1',
				title: 'New Doc Title',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/doc_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'New Doc Title' },
				}),
			);
		});

		it('docs.delete calls DELETE /v1/docs/{id}', async () => {
			const mockResponse = {
				data: { id: 'doc_1', title: 'Doc' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.delete({
				doc_id: 'doc_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/doc_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('docs.export calls GET /v1/docs/{id}/export/{type}', async () => {
			const mockResponse = {
				data: { id: 'doc_1', content_html: '<h1>Doc</h1>' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.export({
				doc_id: 'doc_1',
				type: 'html',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/doc_1/export/html',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('docs.importFile calls POST /v1/docs/import-file', async () => {
			const mockResponse = {
				data: { id: 'doc_1', title: 'Imported Doc' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.importFile({
				title: 'Imported Doc',
				project_id: 'prj_1',
				url: 'https://example.com/doc.pdf',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/import/file',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						title: 'Imported Doc',
						project_id: 'prj_1',
						url: 'https://example.com/doc.pdf',
					},
				}),
			);
		});

		it('docs.listUserDocs calls GET /v1/users/{id}/docs', async () => {
			const mockResponse = {
				data: [{ id: 'doc_1', title: 'User Doc' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.docs.listUserDocs({
				user_id: 'me',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/docs/user/me',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Insights operations', () => {
		it('insights.create calls POST /v1/insights', async () => {
			const mockResponse = {
				data: { id: 'ins_1', title: 'Key Finding' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.create({
				title: 'Key Finding',
				project_id: 'prj_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { title: 'Key Finding', project_id: 'prj_1' },
				}),
			);
		});

		it('insights.get calls GET /v1/insights/{id}', async () => {
			const mockResponse = {
				data: { id: 'ins_1', title: 'Key Finding' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.get({
				insight_id: 'ins_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/ins_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('insights.list calls GET /v1/insights', async () => {
			const mockResponse = {
				data: [{ id: 'ins_1', title: 'Key Finding' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.list({
				filter: { project_id: 'prj_1' },
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					query: { 'filter[project_id]': 'prj_1' },
				}),
			);
		});

		it('insights.update calls PATCH /v1/insights/{id}', async () => {
			const mockResponse = {
				data: { id: 'ins_1', title: 'Updated Insight' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.update({
				insight_id: 'ins_1',
				title: 'Updated Insight',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/ins_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'Updated Insight' },
				}),
			);
		});

		it('insights.delete calls DELETE /v1/insights/{id}', async () => {
			const mockResponse = {
				data: { id: 'ins_1', title: 'Insight' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.delete({
				insight_id: 'ins_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/ins_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('insights.export calls GET /v1/insights/{id}/export/{type}', async () => {
			const mockResponse = {
				data: { id: 'ins_1', content_markdown: '# Insight' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.export({
				insight_id: 'ins_1',
				type: 'markdown',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/ins_1/export/markdown',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('insights.importFile calls POST /v1/insights/import-file', async () => {
			const mockResponse = {
				data: { id: 'ins_1', title: 'Imported Insight' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.importFile({
				title: 'Imported Insight',
				url: 'https://example.com/insight.pdf',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/import/file',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						title: 'Imported Insight',
						url: 'https://example.com/insight.pdf',
					},
				}),
			);
		});

		it('insights.listUserInsights calls GET /v1/users/{id}/insights', async () => {
			const mockResponse = {
				data: [{ id: 'ins_1', title: 'User Insight' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.insights.listUserInsights({
				user_id: 'usr_123',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/insights/user/usr_123',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Notes operations', () => {
		it('notes.create calls POST /v1/notes', async () => {
			const mockResponse = {
				data: { id: 'not_1', title: 'Meeting Notes' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.create({
				project_id: 'prj_1',
				title: 'Meeting Notes',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { project_id: 'prj_1', title: 'Meeting Notes' },
				}),
			);
		});

		it('notes.get calls GET /v1/notes/{id}', async () => {
			const mockResponse = {
				data: { id: 'not_1', title: 'Meeting Notes' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.get({
				note_id: 'not_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes/not_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('notes.list calls GET /v1/notes', async () => {
			const mockResponse = {
				data: [{ id: 'not_1', title: 'Meeting Notes' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.list({
				filter: { project_id: 'prj_1' },
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes',
				'test-api-token',
				expect.objectContaining({
					method: 'GET',
					query: { 'filter[project_id]': 'prj_1' },
				}),
			);
		});

		it('notes.update calls PATCH /v1/notes/{id}', async () => {
			const mockResponse = {
				data: { id: 'not_1', title: 'Q1 Review' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.update({
				note_id: 'not_1',
				title: 'Q1 Review',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes/not_1',
				'test-api-token',
				expect.objectContaining({
					method: 'PATCH',
					body: { title: 'Q1 Review' },
				}),
			);
		});

		it('notes.delete calls DELETE /v1/notes/{id}', async () => {
			const mockResponse = {
				data: { id: 'not_1', title: 'Note' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.delete({
				note_id: 'not_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes/not_1',
				'test-api-token',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});

		it('notes.export calls GET /v1/notes/{id}/export/{type}', async () => {
			const mockResponse = {
				data: { id: 'not_1', content_markdown: '# Note' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.export({
				note_id: 'not_1',
				type: 'markdown',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes/not_1/export/markdown',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('notes.importFile calls POST /v1/notes/import-file', async () => {
			const mockResponse = {
				data: { id: 'not_1', title: 'Imported Note' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.notes.importFile({
				project_id: 'prj_1',
				title: 'Imported Note',
				url: 'https://example.com/recording.mp3',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/notes/import/file',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: {
						project_id: 'prj_1',
						title: 'Imported Note',
						url: 'https://example.com/recording.mp3',
					},
				}),
			);
		});
	});

	describe('Projects operations', () => {
		it('projects.create calls POST /v1/projects', async () => {
			const mockResponse = {
				data: { id: 'prj_1', title: 'New Project' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.projects.create({
				title: 'New Project',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/projects',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { title: 'New Project' },
				}),
			);
		});

		it('projects.get calls GET /v1/projects/{id}', async () => {
			const mockResponse = {
				data: { id: 'prj_1', title: 'Project' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.projects.get({
				project_id: 'prj_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/projects/prj_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('projects.list calls GET /v1/projects', async () => {
			const mockResponse = {
				data: [{ id: 'prj_1', title: 'Project' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.projects.list({});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/projects',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Folders operations', () => {
		it('folders.get calls GET /v1/folders/{id}', async () => {
			const mockResponse = {
				data: { id: 'fld_1', title: 'Folder' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.folders.get({
				folder_id: 'fld_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/folders/fld_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('folders.list calls GET /v1/folders', async () => {
			const mockResponse = {
				data: [{ id: 'fld_1', title: 'Folder' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.folders.list({});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/folders',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Files operations', () => {
		it('files.get calls GET /v1/files/{id}', async () => {
			const mockResponse = {
				data: { id: 'fil_1', name: 'report.pdf' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.files.get({
				file_id: 'fil_1',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/files/fil_1',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Highlights operations', () => {
		it('highlights.list calls GET /v1/highlights', async () => {
			const mockResponse = {
				data: [{ id: 'hl_1', text: 'Important quote' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.highlights.list({});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/highlights',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Tags operations', () => {
		it('tags.list calls GET /v1/tags', async () => {
			const mockResponse = {
				data: [{ id: 'tag_1', title: 'Feature Request' }],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.tags.list({});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/tags',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Token operations', () => {
		it('token.getInfo calls GET /v1/token/info', async () => {
			const mockResponse = {
				data: { id: 'tok_1', subdomain: 'acme-corp' },
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.token.getInfo({});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/token/info',
				'test-api-token',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Search operations', () => {
		it('search.magicSearch calls POST /v1/search', async () => {
			const mockResponse = {
				highlights: [],
				notes: [],
				insights: [],
			};
			const spy = jest
				.spyOn(client, 'makeDovetailRequest')
				.mockResolvedValue(mockResponse);

			const result = await corsair.dovetail.api.search.magicSearch({
				query: 'churn',
			});

			expect(result).toEqual(mockResponse);
			expect(spy).toHaveBeenCalledWith(
				'/v1/search',
				'test-api-token',
				expect.objectContaining({
					method: 'POST',
					body: { query: 'churn' },
				}),
			);
		});
	});
});
