import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeClassmarkerRequest } from './client';
import { addAccessCodes, deleteAccessCodes } from './endpoints/access-lists';
import {
	createCategory,
	createParentCategory,
	getAllCategories,
	updateCategory,
	updateParentCategory,
} from './endpoints/categories';
import { getAllGroupsLinksExams } from './endpoints/groups-links-exams';
import {
	createQuestion,
	getQuestion,
	listQuestions,
	updateQuestion,
} from './endpoints/questions';
import {
	getRecentResultsForAllGroups,
	getRecentResultsForAllLinks,
	getRecentResultsForGroupExam,
	getRecentResultsForLinkExam,
} from './endpoints/recent-results';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeClassmarkerRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeClassmarkerRequest);
const mockLog = jest.mocked(logEventFromContext);

const okEnvelope = {
	status: 'ok',
	request_path: 'v1',
	server_timestamp: 1,
};

function createContext(key = 'packed-key') {
	return {
		key,
		$getAccountId: async () => 'account-id',
	} as unknown as Parameters<typeof getAllGroupsLinksExams>[0];
}

describe('ClassMarker endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('requires auth key', async () => {
		await expect(
			getAllGroupsLinksExams(createContext(''), {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('gets groups, links, and exams', async () => {
		mockRequest.mockResolvedValueOnce({ ...okEnvelope, groups: [], links: [] });
		const ctx = createContext();

		await getAllGroupsLinksExams(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('/v1.json', 'packed-key', {
			method: 'GET',
			query: undefined,
			body: undefined,
		});
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'classmarker.getAllGroupsLinksExams',
			{},
			'completed',
		);
	});

	it('gets recent results for all groups', async () => {
		mockRequest.mockResolvedValueOnce({ ...okEnvelope, results: [] });
		const ctx = createContext();

		await getRecentResultsForAllGroups(ctx, {
			finishedAfterTimestamp: 123,
			limit: 200,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/groups/recent_results.json',
			'packed-key',
			{
				method: 'GET',
				query: { finishedAfterTimestamp: 123, limit: 200 },
				body: undefined,
			},
		);
	});

	it('gets recent results for all links', async () => {
		mockRequest.mockResolvedValueOnce({ ...okEnvelope, results: [] });
		const ctx = createContext();

		await getRecentResultsForAllLinks(ctx, {
			finishedAfterTimestamp: 321,
			limit: 10,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/links/recent_results.json',
			'packed-key',
			{
				method: 'GET',
				query: { finishedAfterTimestamp: 321, limit: 10 },
				body: undefined,
			},
		);
	});

	it('gets recent results for a group exam', async () => {
		mockRequest.mockResolvedValueOnce({ ...okEnvelope, results: [] });
		const ctx = createContext();

		await getRecentResultsForGroupExam(ctx, {
			group_id: 1,
			test_id: 2,
			finishedAfterTimestamp: 111,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/groups/1/tests/2/recent_results.json',
			'packed-key',
			{
				method: 'GET',
				query: { finishedAfterTimestamp: 111, limit: undefined },
				body: undefined,
			},
		);
	});

	it('gets recent results for a link exam', async () => {
		mockRequest.mockResolvedValueOnce({ ...okEnvelope, results: [] });
		const ctx = createContext();

		await getRecentResultsForLinkExam(ctx, {
			link_id: 5,
			test_id: 6,
			limit: 7,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/links/5/tests/6/recent_results.json',
			'packed-key',
			{
				method: 'GET',
				query: { finishedAfterTimestamp: undefined, limit: 7 },
				body: undefined,
			},
		);
	});

	it('adds access codes', async () => {
		mockRequest.mockResolvedValueOnce({
			...okEnvelope,
			access_lists: { access_list: { access_list_id: 9 } },
		});
		const ctx = createContext();

		await addAccessCodes(ctx, {
			access_list_id: 9,
			access_codes: ['A', 'B'],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/accesslists/9.json',
			'packed-key',
			{
				method: 'POST',
				query: undefined,
				body: ['A', 'B'],
			},
		);
	});

	it('deletes access codes', async () => {
		mockRequest.mockResolvedValueOnce({
			...okEnvelope,
			access_lists: { access_list: { access_list_id: 9 } },
		});
		const ctx = createContext();

		await deleteAccessCodes(ctx, {
			access_list_id: 9,
			access_codes: ['A'],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/accesslists/9.json',
			'packed-key',
			{
				method: 'DELETE',
				query: undefined,
				body: ['A'],
			},
		);
	});

	it('lists categories', async () => {
		mockRequest.mockResolvedValueOnce({
			...okEnvelope,
			data: { parent_categories: [] },
		});
		const ctx = createContext();

		await getAllCategories(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/categories.json',
			'packed-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
			},
		);
	});

	it('creates and updates categories', async () => {
		mockRequest
			.mockResolvedValueOnce({
				...okEnvelope,
				data: {
					parent_category: { parent_category_id: 1, parent_category_name: 'A' },
				},
			})
			.mockResolvedValueOnce({
				...okEnvelope,
				data: {
					parent_category: { parent_category_id: 1, parent_category_name: 'B' },
				},
			})
			.mockResolvedValueOnce({
				...okEnvelope,
				data: {
					category: {
						category_id: 2,
						category_name: 'Child',
						parent_category_id: 1,
					},
				},
			})
			.mockResolvedValueOnce({
				...okEnvelope,
				data: {
					category: {
						category_id: 2,
						category_name: 'Child 2',
						parent_category_id: 1,
					},
				},
			});

		const ctx = createContext();

		await createParentCategory(ctx, {
			parent_category_name: 'A',
			verify_only: false,
		});
		await updateParentCategory(ctx, {
			parent_category_id: 1,
			parent_category_name: 'B',
		});
		await createCategory(ctx, {
			category_name: 'Child',
			parent_category_id: 1,
		});
		await updateCategory(ctx, {
			category_id: 2,
			category_name: 'Child 2',
			parent_category_id: 1,
		});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/categories/parent_category.json',
			'packed-key',
			{
				method: 'POST',
				query: { verify_only: false },
				body: { parent_category_name: 'A' },
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/categories/parent_category/1.json',
			'packed-key',
			{
				method: 'PUT',
				query: { verify_only: undefined },
				body: { parent_category_name: 'B' },
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/categories/category.json',
			'packed-key',
			{
				method: 'POST',
				query: { verify_only: undefined },
				body: { category_name: 'Child', parent_category_id: 1 },
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			4,
			'/v1/categories/category/2.json',
			'packed-key',
			{
				method: 'PUT',
				query: { verify_only: undefined },
				body: { category_name: 'Child 2', parent_category_id: 1 },
			},
		);
	});

	it('lists and gets questions', async () => {
		mockRequest
			.mockResolvedValueOnce({
				...okEnvelope,
				questions: [
					{ question_id: 1, question: 'Q', question_type: 'multiplechoice' },
				],
			})
			.mockResolvedValueOnce({
				question_id: 1,
				question: 'Q',
				question_type: 'multiplechoice',
			});

		const ctx = createContext();

		await listQuestions(ctx, { page: 2 });
		await getQuestion(ctx, { question_id: 1 });

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/questions.json',
			'packed-key',
			{
				method: 'GET',
				query: { page: 2 },
				body: undefined,
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/questions/1.json',
			'packed-key',
			{
				method: 'GET',
				query: undefined,
				body: undefined,
			},
		);
	});

	it('creates and updates questions', async () => {
		mockRequest
			.mockResolvedValueOnce({
				question_id: 1,
				question: 'Q',
				question_type: 'multiplechoice',
			})
			.mockResolvedValueOnce({
				question_id: 1,
				question: 'Q2',
				question_type: 'multiplechoice',
			});

		const ctx = createContext();
		const body = {
			question: 'Q',
			question_type: 'multiplechoice',
			options: { A: { content: 'A' } },
			correct_options: ['A'],
		};

		await createQuestion(ctx, { question: body, verify_only: true });
		await updateQuestion(ctx, { question_id: 1, question: body });

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/questions.json',
			'packed-key',
			{
				method: 'POST',
				query: { verify_only: true },
				body,
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/questions/1.json',
			'packed-key',
			{
				method: 'PUT',
				query: { verify_only: undefined },
				body,
			},
		);
	});

	it('rejects invalid input and does not call API', async () => {
		const ctx = createContext();

		await expect(
			addAccessCodes(ctx, { access_list_id: 1, access_codes: [] }),
		).rejects.toThrow();
		await expect(listQuestions(ctx, { page: 0 })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
