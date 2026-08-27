import { Message, Subscriptions, Viewer } from './endpoints';
import * as client from './client';

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeVestaboardRequest: jest.fn(),
	};
});

describe('Vestaboard Endpoints Unit Tests', () => {
	const mockCtx = {
		key: 'test-rw-key',
		options: { key: 'test-rw-key', apiSecret: 'test-secret' },
		db: {
			messages: { upsertByEntityId: jest.fn() },
			subscriptions: { upsertByEntityId: jest.fn() },
			viewer: { upsertByEntityId: jest.fn() },
		},
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('message.get fetches message and upserts to db', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			currentMessage: { id: 'msg-1', text: 'Hello Vestaboard' },
		});

		const res = await Message.get(mockCtx, {});
		expect(res.currentMessage?.text).toBe('Hello Vestaboard');
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'/',
			'test-rw-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockCtx.db.messages.upsertByEntityId).toHaveBeenCalledWith('msg-1', expect.any(Object));
	});

	it('message.post sends text message', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			status: 'ok',
			id: 'msg-2',
		});

		const res = await Message.post(mockCtx, { text: 'New Message' });
		expect(res.status).toBe('ok');
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'/',
			'test-rw-key',
			expect.objectContaining({
				method: 'POST',
				body: { text: 'New Message' },
			}),
		);
	});

	it('message.clear sends empty 6x22 board', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			status: 'ok',
		});

		const res = await Message.clear(mockCtx, {});
		expect(res.cleared).toBe(true);
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'/',
			'test-rw-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.arrayContaining([expect.any(Array)]),
			}),
		);
	});

	it('subscriptions.list retrieves subscriptions', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			subscriptions: [
				{ _id: 'sub-1', _created: 123 },
				{ _id: 'sub-2', _created: 456 },
			],
		});

		const res = await Subscriptions.list(mockCtx, {});
		expect(res.subscriptions).toHaveLength(2);
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'subscriptions',
			'test-rw-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockCtx.db.subscriptions.upsertByEntityId).toHaveBeenCalledTimes(2);
	});

	it('subscriptions.get retrieves message for subscription', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			currentMessage: { id: 'msg-sub-1', text: 'Sub Msg' },
		});

		const res = await Subscriptions.get(mockCtx, { subscriptionId: 'sub-1' });
		expect(res.currentMessage?.text).toBe('Sub Msg');
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'subscriptions/sub-1/message',
			'test-rw-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('subscriptions.postMessage sends message to subscription', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			status: 'ok',
			id: 'msg-sub-post',
		});

		const res = await Subscriptions.postMessage(mockCtx, {
			subscriptionId: 'sub-1',
			text: 'Hello Sub',
		});
		expect(res.status).toBe('ok');
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'subscriptions/sub-1/message',
			'test-rw-key',
			expect.objectContaining({
				method: 'POST',
				body: { text: 'Hello Sub' },
			}),
		);
	});

	it('viewer.get retrieves viewer info and upserts to db', async () => {
		(client.makeVestaboardRequest as jest.Mock).mockResolvedValue({
			_id: 'viewer-1',
			type: 'installation',
		});

		const res = await Viewer.get(mockCtx, {});
		expect(res._id).toBe('viewer-1');
		expect(client.makeVestaboardRequest).toHaveBeenCalledWith(
			'viewer',
			'test-rw-key',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(mockCtx.db.viewer.upsertByEntityId).toHaveBeenCalledWith('viewer-1', expect.any(Object));
	});
});
