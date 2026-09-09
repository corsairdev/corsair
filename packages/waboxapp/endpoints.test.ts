import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { WABOXAPP_API_BASE } from './client';
import {
	getStatus,
	sendChat,
	sendImage,
	sendLink,
	sendMedia,
} from './endpoints';
import type { WaboxappContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const ctx = {
	key: 'tok12345',
	options: { uid: '34666123456' },
	keys: { get_uid: async () => undefined },
} as unknown as WaboxappContext;

beforeEach(() => {
	mockRequest.mockReset();
	mockLogEvent.mockClear();
});

describe('messages.sendChat', () => {
	it('posts form fields to send/chat', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, custom_uid: 'msg-1' });
		const result = await sendChat(ctx, {
			to: '34666789123',
			text: 'Hello from Corsair',
			custom_uid: 'msg-1',
		});
		expect(result).toEqual({ success: true, custom_uid: 'msg-1' });
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: WABOXAPP_API_BASE }),
			expect.objectContaining({
				method: 'POST',
				url: 'send/chat',
				body: expect.objectContaining({
					token: 'tok12345',
					uid: '34666123456',
					to: '34666789123',
					text: 'Hello from Corsair',
					custom_uid: 'msg-1',
				}),
			}),
		);
	});
});

describe('messages.sendImage', () => {
	it('posts to send/image', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, custom_uid: 'msg-2' });
		const result = await sendImage(ctx, {
			to: '34666789123',
			url: 'https://example.com/pic.png',
			custom_uid: 'msg-2',
		});
		expect(result.custom_uid).toBe('msg-2');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: 'send/image' }),
		);
	});
});

describe('messages.sendLink', () => {
	it('posts to send/link', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, custom_uid: 'msg-3' });
		await sendLink(ctx, {
			to: '34666789123',
			url: 'https://example.com',
			custom_uid: 'msg-3',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: 'send/link' }),
		);
	});
});

describe('messages.sendMedia', () => {
	it('posts to send/media', async () => {
		mockRequest.mockResolvedValueOnce({ success: true, custom_uid: 'msg-4' });
		await sendMedia(ctx, {
			to: '34666789123',
			url: 'https://example.com/file.pdf',
			custom_uid: 'msg-4',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ url: 'send/media' }),
		);
	});
});

describe('accounts.getStatus', () => {
	it('gets status/{uid}', async () => {
		mockRequest.mockResolvedValueOnce({
			success: true,
			uid: '34666123456',
			alias: 'desk',
		});
		const result = await getStatus(ctx, {});
		expect(result.alias).toBe('desk');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: WABOXAPP_API_BASE }),
			expect.objectContaining({
				method: 'GET',
				url: 'status/34666123456',
			}),
		);
	});
});
