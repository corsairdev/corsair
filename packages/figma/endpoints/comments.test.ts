import { logEventFromContext } from 'corsair/core';
import { makeFigmaRequest } from '../client';
import { Comments } from './index';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('../client', () => {
	const original = jest.requireActual('../client');
	return {
		...original,
		makeFigmaRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeFigmaRequest);
const mockLog = jest.mocked(logEventFromContext);

function createContext() {
	return {
		key: 'test-key',
		db: {
			comments: {
				findByEntityId: jest.fn(async () => ({
					data: { id: 'comment-1', message: 'hi', resolved_at: null },
				})),
				upsertByEntityId: jest.fn(async () => undefined),
				deleteByEntityId: jest.fn(async () => true),
			},
		},
	};
}

const INPUT = { file_key: 'file-1', comment_id: 'comment-1' };

describe('figma comments.delete', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('removes the local comment row instead of marking it resolved', async () => {
		mockRequest.mockResolvedValue({ status: 200, error: false });
		const ctx = createContext();

		const result = await Comments.delete(ctx as never, INPUT);

		expect(result).toEqual({ status: 200, error: false });
		expect(mockRequest).toHaveBeenCalledWith(
			'v1/files/file-1/comments/comment-1',
			'test-key',
			{ method: 'DELETE' },
		);
		expect(ctx.db.comments.deleteByEntityId).toHaveBeenCalledWith('comment-1');
		expect(ctx.db.comments.upsertByEntityId).not.toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'figma.comments.delete',
			INPUT,
			'completed',
		);
	});

	it('keeps the local row when the Figma DELETE fails', async () => {
		mockRequest.mockRejectedValue(new Error('Not found'));
		const ctx = createContext();

		await expect(Comments.delete(ctx as never, INPUT)).rejects.toThrow(
			'Not found',
		);
		expect(ctx.db.comments.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('still returns the Figma response when the local delete fails', async () => {
		mockRequest.mockResolvedValue({ status: 200, error: false });
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const ctx = createContext();
		ctx.db.comments.deleteByEntityId.mockRejectedValue(new Error('db down'));

		await expect(Comments.delete(ctx as never, INPUT)).resolves.toEqual({
			status: 200,
			error: false,
		});
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
