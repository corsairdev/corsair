import * as clientModule from './client';
import { clickmeeting } from './index';

describe('ClickMeeting Plugin Endpoints', () => {
	const mockMakeRequest = jest.spyOn(clientModule, 'makeClickmeetingRequest');

	const plugin = clickmeeting({
		key: 'test_api_key',
	});

	const mockContext: any = {
		key: 'test_api_key',
		authType: 'api_key',
		options: { key: 'test_api_key' },
		keys: {
			get_api_key: async () => 'test_api_key',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should get ping status', async () => {
		mockMakeRequest.mockResolvedValueOnce({ ping: 'pong' });
		const result = await plugin.endpoints!.utility.getPing(mockContext, {});
		expect(mockMakeRequest).toHaveBeenCalledWith('/ping', 'test_api_key', {
			method: 'GET',
		});
		expect(result).toEqual({ ping: 'pong' });
	});

	it('should get conference list', async () => {
		const mockConferences = [{ id: 101, name: 'AI Webinar', status: 'active' }];
		mockMakeRequest.mockResolvedValueOnce(mockConferences);
		const result = await plugin.endpoints!.conferences.getConferences(
			mockContext,
			{
				status: 'active',
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/active',
			'test_api_key',
			{
				method: 'GET',
				query: undefined,
			},
		);
		expect(result).toEqual(mockConferences);
	});

	it('should get conference details', async () => {
		const mockDetails = {
			id: 101,
			name: 'AI Webinar',
			room_url: 'https://clickmeeting.com/ai',
		};
		mockMakeRequest.mockResolvedValueOnce(mockDetails);
		const result = await plugin.endpoints!.conferences.getConferenceDetails(
			mockContext,
			{
				roomId: 101,
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/101',
			'test_api_key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockDetails);
	});

	it('should create a conference room', async () => {
		const mockCreated = { id: 202, name: 'Hackathon Workshop' };
		mockMakeRequest.mockResolvedValueOnce(mockCreated);
		const result = await plugin.endpoints!.conferences.createConference(
			mockContext,
			{
				name: 'Hackathon Workshop',
				room_type: 'webinar',
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences',
			'test_api_key',
			{
				method: 'POST',
				body: { name: 'Hackathon Workshop', room_type: 'webinar' },
			},
		);
		expect(result).toEqual(mockCreated);
	});

	it('should delete a conference room', async () => {
		mockMakeRequest.mockResolvedValueOnce({ status: 'deleted' });
		const result = await plugin.endpoints!.conferences.deleteConference(
			mockContext,
			{
				roomId: 202,
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/202',
			'test_api_key',
			{
				method: 'DELETE',
			},
		);
		expect(result).toEqual({ status: 'deleted' });
	});

	it('should generate autologin URL hash', async () => {
		mockMakeRequest.mockResolvedValueOnce({ autologin_hash: 'abc123hash' });
		const result = await plugin.endpoints!.conferences.generateAutologinUrl(
			mockContext,
			{
				roomId: 101,
				email: 'user@example.com',
				nickname: 'DevUser',
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/101/autologin-hash',
			'test_api_key',
			{
				method: 'POST',
				body: { email: 'user@example.com', nickname: 'DevUser' },
			},
		);
		expect(result).toEqual({ autologin_hash: 'abc123hash' });
	});

	it('should create access tokens', async () => {
		mockMakeRequest.mockResolvedValueOnce({ tokens: ['token_1', 'token_2'] });
		const result = await plugin.endpoints!.tokens.createAccessTokens(
			mockContext,
			{
				roomId: 101,
				how_many: 2,
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/101/tokens',
			'test_api_key',
			{
				method: 'POST',
				body: { how_many: 2 },
			},
		);
		expect(result).toEqual({ tokens: ['token_1', 'token_2'] });
	});

	it('should register a participant', async () => {
		mockMakeRequest.mockResolvedValueOnce({ registration_hash: 'reg_xyz' });
		const result = await plugin.endpoints!.registrations.registerParticipant(
			mockContext,
			{
				roomId: 101,
				registration: { email: 'test@example.com', first_name: 'Test' },
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/101/registration',
			'test_api_key',
			{
				method: 'POST',
				body: {
					registration: { email: 'test@example.com', first_name: 'Test' },
				},
			},
		);
		expect(result).toEqual({ registration_hash: 'reg_xyz' });
	});

	it('should get session recordings', async () => {
		const mockRecordings = [
			{ id: 501, duration: 3600, recording_url: 'https://download' },
		];
		mockMakeRequest.mockResolvedValueOnce(mockRecordings);
		const result = await plugin.endpoints!.recordings.getSessionRecordings(
			mockContext,
			{
				roomId: 101,
			},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/conferences/101/recordings',
			'test_api_key',
			{
				method: 'GET',
			},
		);
		expect(result).toEqual(mockRecordings);
	});

	it('should get file library and file details', async () => {
		const mockFiles = [{ id: 901, name: 'presentation.pdf' }];
		mockMakeRequest.mockResolvedValueOnce(mockFiles);
		const result = await plugin.endpoints!.files.getFileLibrary(
			mockContext,
			{},
		);
		expect(mockMakeRequest).toHaveBeenCalledWith(
			'/file-library',
			'test_api_key',
			{
				method: 'GET',
				query: undefined,
			},
		);
		expect(result).toEqual(mockFiles);
	});
});
