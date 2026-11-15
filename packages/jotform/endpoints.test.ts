import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import * as client from './client';
import {
	Folders,
	Forms,
	Labels,
	Reports,
	Submissions,
	System,
	User,
} from './endpoints';
import type { JotformContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeJotformRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeJotformRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): JotformContext {
	const ctx: JotformContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return ctx;
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('User Endpoints', () => {
	it('user.get', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { username: 'testuser', email: 'test@example.com' },
		});

		const res = await User.get(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user', ctx.key, {
			method: 'GET',
		});
		expect(res.content.username).toBe('testuser');
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'jotform.user.get',
			{ status: 'success' },
			'completed',
		);
	});

	it('user.getForms', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: '123', title: 'Test Form' }],
			resultSet: { offset: 0, limit: 20, count: 1 },
		});

		const res = await User.getForms(ctx, { offset: 0, limit: 10 });
		expect(mockedRequest).toHaveBeenCalledWith('/user/forms', ctx.key, {
			method: 'GET',
			query: { offset: 0, limit: 10 },
		});
		expect(res.content).toHaveLength(1);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'jotform.user.getForms',
			{ count: 1 },
			'completed',
		);
	});

	it('user.getSubmissions', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'sub-1', form_id: '123' }],
			resultSet: { offset: 0, limit: 20, count: 1 },
		});

		const res = await User.getSubmissions(ctx, { limit: 5 });
		expect(mockedRequest).toHaveBeenCalledWith('/user/submissions', ctx.key, {
			method: 'GET',
			query: { limit: 5 },
		});
		expect(res.content).toHaveLength(1);
	});

	it('user.getFolders', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'folder-1', name: 'My Folder' }],
		});

		const res = await User.getFolders(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/folders', ctx.key, {
			method: 'GET',
		});
		expect(res.responseCode).toBe(200);
	});

	it('user.getHistory', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ type: 'formCreation', date: '2026-01-01' }],
		});

		const res = await User.getHistory(ctx, { action: 'formCreation' });
		expect(mockedRequest).toHaveBeenCalledWith('/user/history', ctx.key, {
			method: 'GET',
			query: { action: 'formCreation' },
		});
		expect(res.content).toHaveLength(1);
	});

	it('user.getSettings and user.updateSettings', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { company: 'ACME Corp' },
		});

		await User.getSettings(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/settings', ctx.key, {
			method: 'GET',
		});

		await User.updateSettings(ctx, { company: 'ACME Corp' });
		expect(mockedRequest).toHaveBeenCalledWith('/user/settings', ctx.key, {
			method: 'POST',
			body: { company: 'ACME Corp' },
		});
	});

	it('user.getSettingByKey', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: 'America/New_York',
		});

		const res = await User.getSettingByKey(ctx, { key: 'time_zone' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/user/settings/time_zone',
			ctx.key,
			{ method: 'GET' },
		);
		expect(res.content).toBe('America/New_York');
	});

	it('user.getSubusers', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ owner: 'testuser', username: 'subuser1' }],
		});

		const res = await User.getSubusers(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/subusers', ctx.key, {
			method: 'GET',
		});
		expect(res.content).toHaveLength(1);
	});

	it('user.getUsage', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { submissions: 100, api: 25 },
		});

		const res = await User.getUsage(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/usage', ctx.key, {
			method: 'GET',
		});
		expect(res.content.submissions).toBe(100);
	});

	it('user.getReports', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'rep-1', title: 'Monthly Report' }],
		});

		const res = await User.getReports(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/reports', ctx.key, {
			method: 'GET',
		});
		expect(res.content).toHaveLength(1);
	});

	it('user.getInvoices', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'inv-1', amount: '19.00' }],
		});

		const res = await User.getInvoices(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/invoices', ctx.key, {
			method: 'GET',
		});
		expect(res.content).toHaveLength(1);
	});

	it('user.getLabels', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { 'label-1': { name: 'Operations' } },
		});

		const res = await User.getLabels(ctx, { addResources: true });
		expect(mockedRequest).toHaveBeenCalledWith('/user/labels', ctx.key, {
			method: 'GET',
			query: { addResources: 'true' },
		});
		expect(res.responseCode).toBe(200);
	});

	it('user.login and user.logout and user.register', async () => {
		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { appKey: 'new-key' },
		});

		await User.login(ctx, { username: 'testuser', password: 'secretpassword' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/user/login',
			undefined,
			expect.objectContaining({
				method: 'POST',
				contentType: 'application/x-www-form-urlencoded',
			}),
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: true,
		});

		await User.logout(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith('/user/logout', undefined, {
			method: 'GET',
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { username: 'registered' },
		});

		await User.register(ctx, {
			username: 'registered',
			password: 'password123',
			email: 'reg@example.com',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/user/register',
			undefined,
			expect.objectContaining({
				method: 'POST',
				contentType: 'application/x-www-form-urlencoded',
			}),
		);
	});
});

describe('Forms Endpoints', () => {
	it('forms.get and forms.delete and forms.clone', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'form-123', title: 'Survey' },
		});

		await Forms.get(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith('/form/form-123', ctx.key, {
			method: 'GET',
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { status: 'DELETED' },
		});
		await Forms.delete(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith('/form/form-123', ctx.key, {
			method: 'DELETE',
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { id: 'form-clone', title: 'Clone of Survey' },
		});
		await Forms.clone(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/clone',
			ctx.key,
			{ method: 'POST' },
		);
	});

	it('forms.create and forms.createForms', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'new-form', url: 'https://form.jotform.com/new-form' },
		});

		await Forms.create(ctx, {
			properties: { title: 'New Form' },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/form', ctx.key, {
			method: 'POST',
			body: { properties: { title: 'New Form' } },
		});

		await Forms.createForms(ctx, {
			formContent: { properties: { title: 'Batch Form' } },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/form', ctx.key, {
			method: 'PUT',
			body: { properties: { title: 'Batch Form' } },
		});
	});

	it('forms.getFiles', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ name: 'file.pdf', url: 'https://example.com/file.pdf' }],
		});

		const res = await Forms.getFiles(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/files',
			ctx.key,
			{ method: 'GET' },
		);
		expect(res.content).toHaveLength(1);
	});

	it('forms question endpoints (getQuestions, getQuestion, createQuestion, createQuestions, updateQuestion, deleteQuestion)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { '1': { text: 'Full Name', type: 'control_fullname' } },
		});

		await Forms.getQuestions(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/questions',
			ctx.key,
			{ method: 'GET' },
		);

		await Forms.getQuestion(ctx, { id: 'form-123', qid: '1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/question/1',
			ctx.key,
			{ method: 'GET' },
		);

		await Forms.createQuestion(ctx, {
			id: 'form-123',
			question: { type: 'control_textbox', text: 'Email' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/questions',
			ctx.key,
			{
				method: 'POST',
				body: { type: 'control_textbox', text: 'Email' },
			},
		);

		await Forms.createQuestions(ctx, {
			id: 'form-123',
			questions: [{ type: 'control_textbox', text: 'Phone' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/questions',
			ctx.key,
			{
				method: 'PUT',
				body: [{ type: 'control_textbox', text: 'Phone' }],
			},
		);

		await Forms.updateQuestion(ctx, {
			id: 'form-123',
			qid: '1',
			question: { text: 'Your Name' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/question/1',
			ctx.key,
			{
				method: 'POST',
				body: { text: 'Your Name' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: 'Question 1 deleted',
		});
		await Forms.deleteQuestion(ctx, { id: 'form-123', qid: '1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/question/1',
			ctx.key,
			{ method: 'DELETE' },
		);
	});

	it('forms property endpoints (getProperties, getProperty, setProperties)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { formWidth: '690' },
		});

		await Forms.getProperties(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/properties',
			ctx.key,
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: '690',
		});
		await Forms.getProperty(ctx, { id: 'form-123', key: 'formWidth' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/properties/formWidth',
			ctx.key,
			{ method: 'GET' },
		);

		await Forms.setProperties(ctx, {
			id: 'form-123',
			properties: { formWidth: '700' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/properties',
			ctx.key,
			{
				method: 'POST',
				body: { formWidth: '700' },
			},
		);
	});

	it('forms report endpoints (getReports, createReport)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'rep-1', title: 'Grid Report' }],
		});

		await Forms.getReports(ctx, { id: 'form-123' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/reports',
			ctx.key,
			{ method: 'GET' },
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { id: 'rep-2', title: 'Excel Report', type: 'excel' },
		});
		await Forms.createReport(ctx, {
			id: 'form-123',
			title: 'Excel Report',
			list_type: 'excel',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/reports',
			ctx.key,
			{
				method: 'POST',
				body: { title: 'Excel Report', list_type: 'excel' },
			},
		);
	});

	it('forms submission endpoints (getSubmissions, createSubmission, createSubmissions)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'sub-1', form_id: 'form-123' }],
		});

		await Forms.getSubmissions(ctx, { id: 'form-123', limit: 10 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/submissions',
			ctx.key,
			{
				method: 'GET',
				query: { limit: 10 },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: { id: 'sub-new' },
		});
		await Forms.createSubmission(ctx, {
			id: 'form-123',
			submission: { '1': 'John Doe' },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/submissions',
			ctx.key,
			{
				method: 'POST',
				body: { '1': 'John Doe' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'sub-batch-1' }],
		});
		await Forms.createSubmissions(ctx, {
			id: 'form-123',
			submissions: [{ '1': 'Batch entry' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/form/form-123/submissions',
			ctx.key,
			{
				method: 'PUT',
				body: [{ '1': 'Batch entry' }],
			},
		);
	});
});

describe('Submissions, Reports, Folders, Labels, and System Endpoints', () => {
	it('submissions.get, submissions.update, submissions.delete', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'sub-999', form_id: 'form-123' },
		});

		await Submissions.get(ctx, { id: 'sub-999' });
		expect(mockedRequest).toHaveBeenCalledWith('/submission/sub-999', ctx.key, {
			method: 'GET',
		});

		await Submissions.update(ctx, {
			id: 'sub-999',
			submission: { '1': 'Updated' },
		});
		expect(mockedRequest).toHaveBeenCalledWith('/submission/sub-999', ctx.key, {
			method: 'POST',
			body: { '1': 'Updated' },
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: 'Submission sub-999 deleted',
		});
		await Submissions.delete(ctx, { id: 'sub-999' });
		expect(mockedRequest).toHaveBeenCalledWith('/submission/sub-999', ctx.key, {
			method: 'DELETE',
		});
	});

	it('reports.get and reports.delete', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'rep-999', title: 'Report' },
		});

		await Reports.get(ctx, { id: 'rep-999' });
		expect(mockedRequest).toHaveBeenCalledWith('/report/rep-999', ctx.key, {
			method: 'GET',
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: true,
		});
		await Reports.delete(ctx, { id: 'rep-999' });
		expect(mockedRequest).toHaveBeenCalledWith('/report/rep-999', ctx.key, {
			method: 'DELETE',
		});
	});

	it('folders (get, create, update, delete)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'fold-1', name: 'My Folder' },
		});

		await Folders.get(ctx, { id: 'fold-1' });
		expect(mockedRequest).toHaveBeenCalledWith('/folder/fold-1', ctx.key, {
			method: 'GET',
		});

		await Folders.create(ctx, { name: 'New Folder', color: '#ff0000' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/folder',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				contentType: 'application/x-www-form-urlencoded',
			}),
		);

		await Folders.update(ctx, { id: 'fold-1', name: 'Updated Folder' });
		expect(mockedRequest).toHaveBeenCalledWith('/folder/fold-1', ctx.key, {
			method: 'PUT',
			body: { name: 'Updated Folder' },
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: 'Folder deleted',
		});
		await Folders.delete(ctx, { id: 'fold-1' });
		expect(mockedRequest).toHaveBeenCalledWith('/folder/fold-1', ctx.key, {
			method: 'DELETE',
		});
	});

	it('labels (get, create, update, delete, getResources, addResources, removeResources)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { id: 'lbl-1', name: 'Marketing' },
		});

		await Labels.get(ctx, { id: 'lbl-1' });
		expect(mockedRequest).toHaveBeenCalledWith('/label/lbl-1', ctx.key, {
			method: 'GET',
		});

		await Labels.create(ctx, { name: 'New Label', color: '#00ff00' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/label',
			ctx.key,
			expect.objectContaining({
				method: 'POST',
				contentType: 'application/x-www-form-urlencoded',
			}),
		);

		await Labels.update(ctx, { id: 'lbl-1', name: 'Updated Label' });
		expect(mockedRequest).toHaveBeenCalledWith('/label/lbl-1', ctx.key, {
			method: 'PUT',
			body: { name: 'Updated Label' },
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: 'Label deleted',
		});
		await Labels.delete(ctx, { id: 'lbl-1' });
		expect(mockedRequest).toHaveBeenCalledWith('/label/lbl-1', ctx.key, {
			method: 'DELETE',
		});

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'form-1', type: 'form' }],
		});
		await Labels.getResources(ctx, { id: 'lbl-1', limit: 20 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/label/lbl-1/resources',
			ctx.key,
			{
				method: 'GET',
				query: { limit: 20 },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: [{ id: 'form-1', type: 'form' }],
		});
		await Labels.addResources(ctx, {
			id: 'lbl-1',
			resources: [{ id: 'form-1', type: 'form' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/label/lbl-1/add-resources',
			ctx.key,
			{
				method: 'PUT',
				body: { resources: [{ id: 'form-1', type: 'form' }] },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			responseCode: 200,
			message: 'success',
			content: [],
		});
		await Labels.removeResources(ctx, {
			id: 'lbl-1',
			resources: [{ id: 'form-1', type: 'form' }],
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/label/lbl-1/remove-resources',
			ctx.key,
			{
				method: 'PUT',
				body: { resources: [{ id: 'form-1', type: 'form' }] },
			},
		);
	});

	it('system.getPlan (public endpoint)', async () => {
		mockedRequest.mockResolvedValue({
			responseCode: 200,
			message: 'success',
			content: { name: 'FREE', submissions: 100 },
		});

		const res = await System.getPlan(ctx, { planName: 'FREE' });
		expect(mockedRequest).toHaveBeenCalledWith('/system/plan/FREE', undefined, {
			method: 'GET',
		});
		expect(res.content.name).toBe('FREE');
	});

	it('rejects invalid input before network I/O', async () => {
		// `unknown` because a rejection value has no static type; assertions narrow it.
		const err = await Forms.get(ctx, { id: '' }).catch(
			(caught: unknown) => caught,
		);
		expect(err).toBeInstanceOf(ZodError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
