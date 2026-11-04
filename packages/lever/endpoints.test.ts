import { makeLeverBinaryRequest, makeLeverRequest } from './client';
import {
	addOpportunityLinks,
	addOpportunitySources,
	addOpportunityTags,
	addRequisitionFieldOptions,
	applyToPosting,
	createFeedback,
	createFeedbackTemplate,
	createForm,
	createFormTemplate,
	createInterview,
	createNote,
	createOpportunity,
	createPanel,
	createPosting,
	createRequisition,
	createRequisitionField,
	createUser,
	createWebhook,
	deactivateUser,
	deleteFeedback,
	deleteFeedbackTemplate,
	deleteFile,
	deleteFormTemplate,
	deleteInterview,
	deleteNote,
	deletePanel,
	deleteRequisition,
	deleteRequisitionField,
	deleteRequisitionFieldOptions,
	deleteWebhook,
	downloadFile,
	downloadOpportunityOffer,
	downloadResume,
	listApplications,
	listArchiveReasons,
	listAuditEvents,
	listDeletedApplications,
	listDeletedOpportunities,
	listDeletedPostings,
	listDispositionStages,
	listFeedback,
	listFeedbackTemplates,
	listFiles,
	listForms,
	listFormTemplates,
	listInterviews,
	listNotes,
	listOpportunities,
	listOpportunityFileActions,
	listOpportunityOffers,
	listPanels,
	listPostings,
	listPostingUsers,
	listReferrals,
	listRequisitionFields,
	listRequisitions,
	listResumes,
	listSources,
	listStages,
	listTags,
	listUsers,
	listWebhooks,
	reactivateUser,
	removeOpportunityLinks,
	removeOpportunitySources,
	removeOpportunityTags,
	replaceRequisitionFieldOptions,
	retrieveApplication,
	retrieveArchiveReason,
	retrieveContact,
	retrieveDiversitySurvey,
	retrieveEeoResponsesAnonymous,
	retrieveEeoResponsesWithPii,
	retrieveFeedback,
	retrieveFeedbackTemplate,
	retrieveFile,
	retrieveForm,
	retrieveFormTemplate,
	retrieveInterview,
	retrieveNote,
	retrieveOpportunity,
	retrievePanel,
	retrievePosting,
	retrievePostingApplicationQuestions,
	retrieveReferral,
	retrieveRequisition,
	retrieveRequisitionField,
	retrieveResume,
	retrieveStage,
	retrieveUser,
	updateContact,
	updateFeedback,
	updateFeedbackTemplate,
	updateFormTemplate,
	updateInterview,
	updateNote,
	updateOpportunityArchivedState,
	updateOpportunityStage,
	updatePanel,
	updatePosting,
	updateRequisition,
	updateRequisitionField,
	updateUser,
	updateWebhook,
} from './endpoints';

jest.mock('./client', () => ({
	makeLeverBinaryRequest: jest.fn(),
	makeLeverRequest: jest.fn(),
}));

const request = jest.mocked(makeLeverRequest);
const binaryRequest = jest.mocked(makeLeverBinaryRequest);

describe('Lever endpoint request seams', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue({ data: [], has_more: false });
	});

	it('lists opportunities with documented filters and pagination', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await listOpportunities(ctx, { offset: 50, stage: 'stage-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities', {
			method: 'GET',
			query: { offset: 50, stage: 'stage-1' },
		});
	});

	it('retrieves an opportunity with its include parameter', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await retrieveOpportunity(ctx, {
			opportunityId: 'opp-1',
			include: 'applications',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1', {
			method: 'GET',
			query: { include: 'applications' },
		});
	});

	it('covers the opportunity list and lifecycle routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listDeletedOpportunities(ctx, { offset: 10 });
		await listOpportunityFileActions(ctx, { opportunityId: 'opp-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/deleted', {
			method: 'GET',
			query: { offset: 10 },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/file_actions',
			{
				method: 'GET',
			},
		);
	});

	it('creates an opportunity with the documented payload', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		const input = {
			name: 'Jane Doe',
			headline: 'Backend engineer',
			emails: ['jane@example.com'],
		};
		await createOpportunity(ctx, input);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities', {
			method: 'POST',
			body: input,
		});
	});

	it('routes opportunity stage and archived-state updates to the documented routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await updateOpportunityStage(ctx, {
			opportunityId: 'opp-1',
			stageID: 'stage-2',
		});
		await updateOpportunityArchivedState(ctx, {
			opportunityId: 'opp-1',
			archived: true,
			reasonID: 'reason-1',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/stage', {
			method: 'PUT',
			body: { stageID: 'stage-2' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/archived', {
			method: 'PUT',
			body: { archived: true, reasonID: 'reason-1' },
		});
	});

	it('sends link, tag, and source mutations as request bodies', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await addOpportunityLinks(ctx, {
			opportunityId: 'opp-1',
			contactIDs: ['con-1'],
		});
		await removeOpportunityLinks(ctx, {
			opportunityId: 'opp-1',
			contactIDs: ['con-1'],
		});
		await addOpportunityTags(ctx, { opportunityId: 'opp-1', tags: ['remote'] });
		await removeOpportunityTags(ctx, {
			opportunityId: 'opp-1',
			tags: ['remote'],
		});
		await addOpportunitySources(ctx, {
			opportunityId: 'opp-1',
			sourceIDs: ['src-1'],
		});
		await removeOpportunitySources(ctx, {
			opportunityId: 'opp-1',
			sourceIDs: ['src-1'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/addLinks', {
			method: 'POST',
			body: { contactIDs: ['con-1'] },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/removeLinks',
			{
				method: 'POST',
				body: { contactIDs: ['con-1'] },
			},
		);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/addTags', {
			method: 'POST',
			body: { tags: ['remote'] },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/removeTags',
			{
				method: 'POST',
				body: { tags: ['remote'] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/addSources',
			{
				method: 'POST',
				body: { sourceIDs: ['src-1'] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/removeSources',
			{
				method: 'POST',
				body: { sourceIDs: ['src-1'] },
			},
		);
	});

	it('covers the application routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listApplications(ctx, { opportunityId: 'opp-1' });
		await retrieveApplication(ctx, {
			opportunityId: 'opp-1',
			applicationId: 'app-1',
		});
		await listDeletedApplications(ctx, {});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/applications',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/applications/app-1',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenCalledWith(ctx, '/applications/deleted', {
			method: 'GET',
			query: {},
		});
	});

	it('covers the posting routes including the apply flow', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listPostings(ctx, {});
		await retrievePosting(ctx, { postingId: 'post-1' });
		await listDeletedPostings(ctx, {});
		await createPosting(ctx, { text: 'Software Engineer' });
		await updatePosting(ctx, { postingId: 'post-1', text: 'Staff Engineer' });
		await retrievePostingApplicationQuestions(ctx, { postingId: 'post-1' });
		await listPostingUsers(ctx, { postingId: 'post-1' });
		await applyToPosting(ctx, {
			postingId: 'post-1',
			name: 'Jane Doe',
			email: 'jane@example.com',
		});

		expect(request).toHaveBeenCalledWith(ctx, '/postings', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/post-1', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/deleted', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings', {
			method: 'POST',
			body: { text: 'Software Engineer' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/post-1', {
			method: 'POST',
			body: { text: 'Staff Engineer' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/post-1/apply', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/post-1/users', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/postings/post-1/apply', {
			method: 'POST',
			body: { name: 'Jane Doe', email: 'jane@example.com' },
		});
	});

	it('covers the interview routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listInterviews(ctx, { opportunityId: 'opp-1' });
		await retrieveInterview(ctx, {
			opportunityId: 'opp-1',
			interviewId: 'int-1',
		});
		await createInterview(ctx, {
			opportunityId: 'opp-1',
			date: 1700000000000,
		});
		await updateInterview(ctx, {
			opportunityId: 'opp-1',
			interviewId: 'int-1',
			date: 1700000000001,
		});
		await deleteInterview(ctx, {
			opportunityId: 'opp-1',
			interviewId: 'int-1',
		});

		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/interviews',
			{
				method: 'GET',
				query: { expand: undefined },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/interviews/int-1',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/interviews',
			{
				method: 'POST',
				body: { date: 1700000000000 },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/interviews/int-1',
			{ method: 'PUT', body: { date: 1700000000001 } },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/interviews/int-1',
			{ method: 'DELETE' },
		);
	});

	it('covers the note routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listNotes(ctx, { opportunityId: 'opp-1' });
		await retrieveNote(ctx, { opportunityId: 'opp-1', noteId: 'note-1' });
		await createNote(ctx, { opportunityId: 'opp-1', value: 'Great profile' });
		await updateNote(ctx, {
			opportunityId: 'opp-1',
			noteId: 'note-1',
			value: 'Updated note',
		});
		await deleteNote(ctx, { opportunityId: 'opp-1', noteId: 'note-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/notes', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/notes/note-1',
			{
				method: 'GET',
			},
		);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/notes', {
			method: 'POST',
			body: { value: 'Great profile' },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/notes/note-1',
			{
				method: 'PUT',
				body: { value: 'Updated note' },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/notes/note-1',
			{
				method: 'DELETE',
			},
		);
	});

	it('covers the archive reason and stage reference routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listArchiveReasons(ctx, {});
		await retrieveArchiveReason(ctx, { archiveReasonId: 'arch-1' });
		await listStages(ctx, {});
		await retrieveStage(ctx, { stageId: 'stage-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/archive_reasons', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/archive_reasons/arch-1', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/stages', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/stages/stage-1', {
			method: 'GET',
		});
	});

	it('covers the panel routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listPanels(ctx, { opportunityId: 'opp-1' });
		await retrievePanel(ctx, { opportunityId: 'opp-1', panelId: 'panel-1' });
		await createPanel(ctx, {
			opportunityId: 'opp-1',
			note: 'Panel for Rachel',
		});
		await updatePanel(ctx, {
			opportunityId: 'opp-1',
			panelId: 'panel-1',
			note: 'Updated panel',
		});
		await deletePanel(ctx, { opportunityId: 'opp-1', panelId: 'panel-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/panels', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/panels/panel-1',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/panels', {
			method: 'POST',
			body: { note: 'Panel for Rachel' },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/panels/panel-1',
			{ method: 'PUT', body: { note: 'Updated panel' } },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/panels/panel-1',
			{ method: 'DELETE' },
		);
	});

	it('covers the feedback routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listFeedback(ctx, { opportunityId: 'opp-1' });
		await retrieveFeedback(ctx, { opportunityId: 'opp-1', feedbackId: 'fb-1' });
		await createFeedback(ctx, {
			opportunityId: 'opp-1',
			fieldValues: [{ id: 'fv-1', value: '4' }],
		});
		await updateFeedback(ctx, {
			opportunityId: 'opp-1',
			feedbackId: 'fb-1',
			completedAt: 1600275449372,
		});
		await deleteFeedback(ctx, { opportunityId: 'opp-1', feedbackId: 'fb-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/feedback', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/feedback/fb-1',
			{ method: 'GET' },
		);
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/feedback', {
			method: 'POST',
			body: { fieldValues: [{ id: 'fv-1', value: '4' }] },
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/feedback/fb-1',
			{ method: 'PUT', body: { completedAt: 1600275449372 } },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/feedback/fb-1',
			{ method: 'DELETE' },
		);
	});

	it('covers the feedback template routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listFeedbackTemplates(ctx, {});
		await retrieveFeedbackTemplate(ctx, { feedbackTemplateId: 'ft-1' });
		await createFeedbackTemplate(ctx, { text: 'Phone Screen Feedback Form' });
		await updateFeedbackTemplate(ctx, {
			feedbackTemplateId: 'ft-1',
			text: 'Updated form',
		});
		await deleteFeedbackTemplate(ctx, { feedbackTemplateId: 'ft-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/feedback_templates', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/feedback_templates/ft-1', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/feedback_templates', {
			method: 'POST',
			body: { text: 'Phone Screen Feedback Form' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/feedback_templates/ft-1', {
			method: 'PUT',
			body: { text: 'Updated form' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/feedback_templates/ft-1', {
			method: 'DELETE',
		});
	});

	it('covers the file routes for an opportunity', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await listFiles(ctx, { opportunityId: 'opp-1' });
		await retrieveFile(ctx, { opportunityId: 'opp-1', fileId: 'file-1' });
		binaryRequest.mockResolvedValue({
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		});
		await downloadFile(ctx, { opportunityId: 'opp-1', fileId: 'file-1' });
		await deleteFile(ctx, { opportunityId: 'opp-1', fileId: 'file-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/files', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/files/file-1',
			{ method: 'GET' },
		);
		expect(binaryRequest).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/files/file-1/download',
			{ headers: { Accept: 'application/octet-stream' } },
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/files/file-1',
			{ method: 'DELETE' },
		);
	});

	it('covers the form template routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listFormTemplates(ctx, {});
		await retrieveFormTemplate(ctx, { formTemplateId: 'form-1' });
		await createFormTemplate(ctx, { title: 'Application' });
		await updateFormTemplate(ctx, {
			formTemplateId: 'form-1',
			title: 'Updated application',
		});
		await deleteFormTemplate(ctx, { formTemplateId: 'form-1' });

		expect(request).toHaveBeenCalledWith(ctx, '/form_templates', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/form_templates/form-1', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/form_templates', {
			method: 'POST',
			body: { title: 'Application' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/form_templates/form-1', {
			method: 'PUT',
			body: { title: 'Updated application' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/form_templates/form-1', {
			method: 'DELETE',
		});
	});

	it('covers the requisition field routes including option management', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listRequisitionFields(ctx, {});
		await retrieveRequisitionField(ctx, { requisitionFieldId: 'rf-1' });
		await createRequisitionField(ctx, {
			text: 'Work type',
			type: 'dropdown',
		});
		await updateRequisitionField(ctx, {
			requisitionFieldId: 'rf-1',
			text: 'Work type',
			type: 'dropdown',
		});
		await deleteRequisitionField(ctx, { requisitionFieldId: 'rf-1' });
		await addRequisitionFieldOptions(ctx, {
			requisitionFieldId: 'rf-1',
			values: [{ text: 'hourly' }],
		});
		await replaceRequisitionFieldOptions(ctx, {
			requisitionFieldId: 'rf-1',
			values: [{ id: 'opt-1', text: 'remote' }],
		});
		await deleteRequisitionFieldOptions(ctx, {
			requisitionFieldId: 'rf-1',
			values: ['opt-1'],
		});

		expect(request).toHaveBeenCalledWith(ctx, '/requisition_fields', {
			method: 'GET',
			query: {},
		});
		expect(request).toHaveBeenCalledWith(ctx, '/requisition_fields/rf-1', {
			method: 'GET',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/requisition_fields', {
			method: 'POST',
			body: { text: 'Work type', type: 'dropdown' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/requisition_fields/rf-1', {
			method: 'PUT',
			body: { text: 'Work type', type: 'dropdown' },
		});
		expect(request).toHaveBeenCalledWith(ctx, '/requisition_fields/rf-1', {
			method: 'DELETE',
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/requisition_fields/rf-1/options',
			{
				method: 'POST',
				body: { values: [{ text: 'hourly' }] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/requisition_fields/rf-1/options',
			{
				method: 'PUT',
				body: { values: [{ id: 'opt-1', text: 'remote' }] },
			},
		);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/requisition_fields/rf-1/options',
			{
				method: 'DELETE',
				body: { values: ['opt-1'] },
			},
		);
	});

	it('covers the requisitions routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listRequisitions(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/requisitions', {
			method: 'GET',
			query: {},
		});
		await retrieveRequisition(ctx, { requisitionId: 'req-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/requisitions/req-1', {
			method: 'GET',
		});
		await createRequisition(ctx, { title: 'Senior Engineer requisition' });
		expect(request).toHaveBeenCalledWith(ctx, '/requisitions', {
			method: 'POST',
			body: { title: 'Senior Engineer requisition' },
		});
		await updateRequisition(ctx, {
			requisitionId: 'req-1',
			title: 'Updated requisition',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/requisitions/req-1', {
			method: 'PUT',
			body: { title: 'Updated requisition' },
		});
		await deleteRequisition(ctx, { requisitionId: 'req-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/requisitions/req-1', {
			method: 'DELETE',
		});
	});

	it('covers the forms routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listForms(ctx, { opportunityId: 'opp-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/forms', {
			method: 'GET',
		});
		await retrieveForm(ctx, { opportunityId: 'opp-1', formId: 'form-1' });
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/forms/form-1',
			{ method: 'GET' },
		);
		await createForm(ctx, { opportunityId: 'opp-1', formTemplateId: 'form-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/forms', {
			method: 'POST',
			body: { formTemplateId: 'form-1' },
		});
	});

	it('covers the resumes routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listResumes(ctx, { opportunityId: 'opp-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/resumes', {
			method: 'GET',
		});
		await retrieveResume(ctx, { opportunityId: 'opp-1', resumeId: 'res-1' });
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/resumes/res-1',
			{ method: 'GET' },
		);
		binaryRequest.mockResolvedValue({
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		});
		await downloadResume(ctx, { opportunityId: 'opp-1', resumeId: 'res-1' });
		expect(binaryRequest).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/resumes/res-1/download',
			{ headers: { Accept: 'application/octet-stream' } },
		);
	});

	it('covers the users routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listUsers(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/users', {
			method: 'GET',
			query: {},
		});
		await retrieveUser(ctx, { userId: 'user-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/users/user-1', {
			method: 'GET',
		});
		await createUser(ctx, {
			name: 'Chandler Bing',
			email: 'chandler@example.com',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/users', {
			method: 'POST',
			body: { name: 'Chandler Bing', email: 'chandler@example.com' },
		});
		await updateUser(ctx, { userId: 'user-1', name: 'Chandler Bing' });
		expect(request).toHaveBeenCalledWith(ctx, '/users/user-1', {
			method: 'PUT',
			body: { name: 'Chandler Bing' },
		});
		await deactivateUser(ctx, { userId: 'user-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/users/user-1/deactivate', {
			method: 'POST',
			body: undefined,
		});
		await reactivateUser(ctx, { userId: 'user-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/users/user-1/reactivate', {
			method: 'POST',
			body: undefined,
		});
	});

	it('covers the referrals and contacts routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listReferrals(ctx, { opportunityId: 'opp-1' });
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/referrals',
			{ method: 'GET' },
		);
		await retrieveReferral(ctx, {
			opportunityId: 'opp-1',
			referralId: 'ref-1',
		});
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/referrals/ref-1',
			{ method: 'GET' },
		);
		await retrieveContact(ctx, { contactId: 'con-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/contacts/con-1', {
			method: 'GET',
		});
		await updateContact(ctx, { contactId: 'con-1', name: 'Jane Doe' });
		expect(request).toHaveBeenCalledWith(ctx, '/contacts/con-1', {
			method: 'PUT',
			body: { name: 'Jane Doe' },
		});
	});

	it('covers the webhooks and workspace reference reads routes', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		request.mockResolvedValue({});
		await listWebhooks(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/webhooks', {
			method: 'GET',
			query: {},
		});
		await createWebhook(ctx, {
			url: 'https://example.test/hook',
			event: 'candidateStageChange',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/webhooks', {
			method: 'POST',
			body: { url: 'https://example.test/hook', event: 'candidateStageChange' },
		});
		await updateWebhook(ctx, {
			webhookId: 'wh-1',
			url: 'https://example.test/hook',
		});
		expect(request).toHaveBeenCalledWith(ctx, '/webhooks/wh-1', {
			method: 'PUT',
			body: { url: 'https://example.test/hook' },
		});
		await deleteWebhook(ctx, { webhookId: 'wh-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/webhooks/wh-1', {
			method: 'DELETE',
		});
		await listAuditEvents(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/audit_events', {
			method: 'GET',
			query: {},
		});
		await listSources(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/sources', {
			method: 'GET',
			query: {},
		});
		await listTags(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/tags', {
			method: 'GET',
			query: {},
		});
		await listDispositionStages(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/disposition_stages', {
			method: 'GET',
			query: {},
		});
		await retrieveDiversitySurvey(ctx, { postingId: 'post-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/surveys/diversity/post-1', {
			method: 'GET',
		});
		await retrieveEeoResponsesWithPii(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/eeo/responses/pii', {
			method: 'GET',
			query: {},
		});
		await retrieveEeoResponsesAnonymous(ctx, {});
		expect(request).toHaveBeenCalledWith(ctx, '/eeo/responses', {
			method: 'GET',
			query: {},
		});
		await listOpportunityOffers(ctx, { opportunityId: 'opp-1' });
		expect(request).toHaveBeenCalledWith(ctx, '/opportunities/opp-1/offers', {
			method: 'GET',
		});
		binaryRequest.mockResolvedValue({
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		});
		await downloadOpportunityOffer(ctx, {
			opportunityId: 'opp-1',
			offerId: 'offer-1',
		});
		expect(binaryRequest).toHaveBeenCalledWith(
			ctx,
			'/opportunities/opp-1/offers/offer-1/download',
			{ headers: { Accept: 'application/octet-stream' } },
		);
	});

	it('rejects missing and unsafe path identifiers before any request', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await expect(
			retrieveOpportunity(ctx, { include: 'applications' } as never),
		).rejects.toThrow('Invalid Lever opportunityId');
		await expect(
			retrieveOpportunity(ctx, { opportunityId: '../users' }),
		).rejects.toThrow('Invalid Lever opportunityId');
		await expect(
			retrieveApplication(ctx, { opportunityId: 'opp-1' } as never),
		).rejects.toThrow('Invalid Lever applicationId');
		await expect(retrievePosting(ctx, {} as never)).rejects.toThrow(
			'Invalid Lever postingId',
		);
		await expect(retrieveStage(ctx, { stageId: '.' } as never)).rejects.toThrow(
			'Invalid Lever stageId',
		);
		expect(request).not.toHaveBeenCalled();
	});
});
