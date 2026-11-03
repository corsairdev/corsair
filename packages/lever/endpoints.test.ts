import { makeLeverRequest } from './client';
import {
	addOpportunityLinks,
	addOpportunitySources,
	addOpportunityTags,
	applyToPosting,
	createInterview,
	createNote,
	createOpportunity,
	createPosting,
	deleteInterview,
	deleteNote,
	listApplications,
	listArchiveReasons,
	listDeletedApplications,
	listDeletedOpportunities,
	listDeletedPostings,
	listInterviews,
	listNotes,
	listOpportunities,
	listOpportunityFileActions,
	listPostings,
	listPostingUsers,
	listStages,
	removeOpportunityLinks,
	removeOpportunitySources,
	removeOpportunityTags,
	retrieveApplication,
	retrieveArchiveReason,
	retrieveInterview,
	retrieveNote,
	retrieveOpportunity,
	retrievePosting,
	retrievePostingApplicationQuestions,
	retrieveStage,
	updateInterview,
	updateNote,
	updateOpportunityArchivedState,
	updateOpportunityStage,
	updatePosting,
} from './endpoints';

jest.mock('./client', () => ({
	makeLeverRequest: jest.fn(),
}));

const request = jest.mocked(makeLeverRequest);

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

	it('rejects missing and unsafe path identifiers before any request', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await expect(
			retrieveOpportunity(ctx, { include: 'applications' }),
		).rejects.toThrow('Invalid Lever opportunityId');
		await expect(
			retrieveOpportunity(ctx, { opportunityId: '../users' }),
		).rejects.toThrow('Invalid Lever opportunityId');
		await expect(
			retrieveApplication(ctx, { opportunityId: 'opp-1' }),
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
