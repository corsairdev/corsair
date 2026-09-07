import * as clientModule from './client';
import { clickmeeting } from './index';

describe('ClickMeeting Plugin Endpoints - Complete 42 Endpoints Suite', () => {
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

	// ─────────────────────────────────────────────────────────────────────────
	// 1. Utility Endpoints (4)
	// ─────────────────────────────────────────────────────────────────────────
	describe('utility endpoints', () => {
		it('getPing', async () => {
			mockMakeRequest.mockResolvedValueOnce({ ping: 'pong' });
			const result = await plugin.endpoints!.utility.getPing(mockContext, {});
			expect(mockMakeRequest).toHaveBeenCalledWith('/ping', 'test_api_key', {
				method: 'GET',
			});
			expect(result).toEqual({ ping: 'pong' });
		});

		it('getTimeZoneList', async () => {
			mockMakeRequest.mockResolvedValueOnce([
				'Europe/Warsaw',
				'America/New_York',
			]);
			const result = await plugin.endpoints!.utility.getTimeZoneList(
				mockContext,
				{},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/time_zone_list',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(['Europe/Warsaw', 'America/New_York']);
		});

		it('getTimeZoneListByCountry', async () => {
			mockMakeRequest.mockResolvedValueOnce([
				'America/New_York',
				'America/Chicago',
			]);
			const result = await plugin.endpoints!.utility.getTimeZoneListByCountry(
				mockContext,
				{
					country: 'US',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/time_zone_list/US',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(['America/New_York', 'America/Chicago']);
		});

		it('getPhoneGateways', async () => {
			const mockGateways = [{ country: 'US', phone: '+123456789' }];
			mockMakeRequest.mockResolvedValueOnce(mockGateways);
			const result = await plugin.endpoints!.utility.getPhoneGateways(
				mockContext,
				{},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/phone_gateways',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockGateways);
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 2. Conferences Endpoints (9)
	// ─────────────────────────────────────────────────────────────────────────
	describe('conferences endpoints', () => {
		it('getConferences', async () => {
			const mockConferences = [
				{ id: 101, name: 'AI Webinar', status: 'active' },
			];
			mockMakeRequest.mockResolvedValueOnce(mockConferences);
			const result = await plugin.endpoints!.conferences.getConferences(
				mockContext,
				{
					status: 'active',
					page: 1,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/active',
				'test_api_key',
				{
					method: 'GET',
					query: { page: 1 },
				},
			);
			expect(result).toEqual(mockConferences);
		});

		it('getConferenceDetails', async () => {
			const mockDetails = { conference: { id: 101, name: 'AI Webinar' } };
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

		it('createConference', async () => {
			const mockCreated = { room: { id: 202, name: 'Hackathon Workshop' } };
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

		it('updateConference', async () => {
			const mockUpdated = { id: 101, name: 'Updated Name' };
			mockMakeRequest.mockResolvedValueOnce(mockUpdated);
			const result = await plugin.endpoints!.conferences.updateConference(
				mockContext,
				{
					roomId: 101,
					name: 'Updated Name',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101',
				'test_api_key',
				{
					method: 'PUT',
					body: { name: 'Updated Name' },
				},
			);
			expect(result).toEqual(mockUpdated);
		});

		it('deleteConference', async () => {
			mockMakeRequest.mockResolvedValueOnce({ status: 'deleted' });
			const result = await plugin.endpoints!.conferences.deleteConference(
				mockContext,
				{
					roomId: 101,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101',
				'test_api_key',
				{
					method: 'DELETE',
				},
			);
			expect(result).toEqual({ status: 'deleted' });
		});

		it('getConferenceFiles', async () => {
			const mockFiles = [{ id: 1, name: 'slides.pdf' }];
			mockMakeRequest.mockResolvedValueOnce(mockFiles);
			const result = await plugin.endpoints!.conferences.getConferenceFiles(
				mockContext,
				{
					roomId: 101,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library/conferences/101',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockFiles);
		});

		it('getConferenceSkins', async () => {
			const mockSkins = [{ id: 1, name: 'Default Skin' }];
			mockMakeRequest.mockResolvedValueOnce(mockSkins);
			const result = await plugin.endpoints!.conferences.getConferenceSkins(
				mockContext,
				{},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/skins',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockSkins);
		});

		it('sendInvitation', async () => {
			mockMakeRequest.mockResolvedValueOnce({ status: 'sent', queued: 1 });
			const result = await plugin.endpoints!.conferences.sendInvitation(
				mockContext,
				{
					roomId: 101,
					lang: 'en',
					attendees: ['user@example.com'],
					role: 'listener',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/invitation/email/en',
				'test_api_key',
				{
					method: 'POST',
					body: { attendees: ['user@example.com'], role: 'listener' },
				},
			);
			expect(result).toEqual({ status: 'sent', queued: 1 });
		});

		it('generateAutologinUrl', async () => {
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
				'/conferences/101/room/autologin_hash',
				'test_api_key',
				{
					method: 'POST',
					body: { email: 'user@example.com', nickname: 'DevUser' },
				},
			);
			expect(result).toEqual({ autologin_hash: 'abc123hash' });
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 3. Tokens Endpoints (3)
	// ─────────────────────────────────────────────────────────────────────────
	describe('tokens endpoints', () => {
		it('createAccessTokens', async () => {
			mockMakeRequest.mockResolvedValueOnce({
				access_tokens: [{ token: 'token_1' }],
			});
			const result = await plugin.endpoints!.tokens.createAccessTokens(
				mockContext,
				{
					roomId: 101,
					how_many: 1,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/tokens',
				'test_api_key',
				{
					method: 'POST',
					body: { how_many: 1 },
				},
			);
			expect(result).toEqual({ access_tokens: [{ token: 'token_1' }] });
		});

		it('listAccessTokens', async () => {
			const mockTokens = {
				access_tokens: [{ token: 'token_1', status: 'active' }],
			};
			mockMakeRequest.mockResolvedValueOnce(mockTokens);
			const result = await plugin.endpoints!.tokens.listAccessTokens(
				mockContext,
				{
					roomId: 101,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/tokens',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockTokens);
		});

		it('getTokenByEmail', async () => {
			const mockToken = {
				access_tokens: [{ token: 'token_abc123', email: 'user@example.com' }],
			};
			mockMakeRequest.mockResolvedValueOnce(mockToken);
			const result = await plugin.endpoints!.tokens.getTokenByEmail(
				mockContext,
				{
					roomId: 101,
					email: 'user@example.com',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/token',
				'test_api_key',
				{
					method: 'POST',
					body: { email: 'user@example.com' },
				},
			);
			expect(result).toEqual(mockToken);
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 4. Registrations Endpoints (4)
	// ─────────────────────────────────────────────────────────────────────────
	describe('registrations endpoints', () => {
		it('registerParticipant', async () => {
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
					body: expect.stringContaining(
						'registration%5Bemail%5D=test%40example.com',
					),
					mediaType: 'application/x-www-form-urlencoded',
				},
			);
			expect(result).toEqual({ registration_hash: 'reg_xyz' });
		});

		it('getRegistrations', async () => {
			const mockRegistrations = [
				{ id: 1, email: 'test@example.com', status: 'confirmed' },
			];
			mockMakeRequest.mockResolvedValueOnce(mockRegistrations);
			const result = await plugin.endpoints!.registrations.getRegistrations(
				mockContext,
				{
					roomId: 101,
					status: 'all',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/registrations/all',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockRegistrations);
		});

		it('listRegistrationsByStatus', async () => {
			const mockRegistrations = [
				{ id: 1, email: 'test@example.com', status: 'confirmed' },
			];
			mockMakeRequest.mockResolvedValueOnce(mockRegistrations);
			const result =
				await plugin.endpoints!.registrations.listRegistrationsByStatus(
					mockContext,
					{
						roomId: 101,
						status: 'confirmed',
					},
				);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/registrations/confirmed',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockRegistrations);
		});

		it('createContact', async () => {
			const mockContact = {
				id: 50,
				email: 'lead@example.com',
				first_name: 'Jane',
			};
			mockMakeRequest.mockResolvedValueOnce(mockContact);
			const result = await plugin.endpoints!.registrations.createContact(
				mockContext,
				{
					email: 'lead@example.com',
					first_name: 'Jane',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/contacts',
				'test_api_key',
				{
					method: 'POST',
					body: { email: 'lead@example.com', first_name: 'Jane' },
				},
			);
			expect(result).toEqual(mockContact);
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 5. Sessions Endpoints (11)
	// ─────────────────────────────────────────────────────────────────────────
	describe('sessions endpoints', () => {
		it('getConferenceSessions', async () => {
			const mockSessions = [{ id: 201, starts_at: '2026-09-01 10:00:00' }];
			mockMakeRequest.mockResolvedValueOnce(mockSessions);
			const result = await plugin.endpoints!.sessions.getConferenceSessions(
				mockContext,
				{
					roomId: 101,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockSessions);
		});

		it('getSessionDetails', async () => {
			const mockDetail = { id: 201, duration: 3600, attendees_count: 25 };
			mockMakeRequest.mockResolvedValueOnce(mockDetail);
			const result = await plugin.endpoints!.sessions.getSessionDetails(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockDetail);
		});

		it('getSessionAttendees', async () => {
			const mockAttendees = [
				{ id: 301, nickname: 'John', email: 'john@example.com' },
			];
			mockMakeRequest.mockResolvedValueOnce(mockAttendees);
			const result = await plugin.endpoints!.sessions.getSessionAttendees(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/attendees',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockAttendees);
		});

		it('getSessionAttendeeDetails', async () => {
			const mockAttendee = { id: 301, nickname: 'John', duration: 1800 };
			mockMakeRequest.mockResolvedValueOnce(mockAttendee);
			const result = await plugin.endpoints!.sessions.getSessionAttendeeDetails(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
					attendeeId: 301,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/attendees/301',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockAttendee);
		});

		it('generateSessionPdfReport', async () => {
			mockMakeRequest.mockResolvedValueOnce({
				status: 'queued',
				report_url: 'https://report.pdf',
			});
			const result = await plugin.endpoints!.sessions.generateSessionPdfReport(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
					lang: 'en',
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/generate-pdf/en',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual({
				status: 'queued',
				report_url: 'https://report.pdf',
			});
		});

		it('getSessionRegistrations', async () => {
			const mockRegs = [{ id: 1, email: 'att@example.com' }];
			mockMakeRequest.mockResolvedValueOnce(mockRegs);
			const result = await plugin.endpoints!.sessions.getSessionRegistrations(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/registrations',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockRegs);
		});

		it('getSessionPolls', async () => {
			const mockPolls = [{ id: 401, name: 'Satisfaction Poll' }];
			mockMakeRequest.mockResolvedValueOnce(mockPolls);
			const result = await plugin.endpoints!.sessions.getSessionPolls(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/polls',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockPolls);
		});

		it('getSessionPollDetails', async () => {
			const mockPollDetail = {
				id: 401,
				name: 'Satisfaction Poll',
				questions: [],
			};
			mockMakeRequest.mockResolvedValueOnce(mockPollDetail);
			const result = await plugin.endpoints!.sessions.getSessionPollDetails(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
					pollId: 401,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/polls/401',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockPollDetail);
		});

		it('getSessionSurveys', async () => {
			const mockSurveys = [{ id: 501, name: 'Exit Survey' }];
			mockMakeRequest.mockResolvedValueOnce(mockSurveys);
			const result = await plugin.endpoints!.sessions.getSessionSurveys(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/surveys',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockSurveys);
		});

		it('getSessionSurveyDetails', async () => {
			const mockSurveyDetail = { id: 501, name: 'Exit Survey', answers: [] };
			mockMakeRequest.mockResolvedValueOnce(mockSurveyDetail);
			const result = await plugin.endpoints!.sessions.getSessionSurveyDetails(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
					surveyId: 501,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/surveys/501',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockSurveyDetail);
		});

		it('getSessionQaHistory', async () => {
			const mockQa = [{ id: 1, question: 'Is this recorded?', answer: 'Yes' }];
			mockMakeRequest.mockResolvedValueOnce(mockQa);
			const result = await plugin.endpoints!.sessions.getSessionQaHistory(
				mockContext,
				{
					roomId: 101,
					sessionId: 201,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/sessions/201/qa',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockQa);
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 6. Recordings Endpoints (4)
	// ─────────────────────────────────────────────────────────────────────────
	describe('recordings endpoints', () => {
		it('getSessionRecordings', async () => {
			const mockRecordings = [
				{ id: 601, duration: 3600, recording_url: 'https://download' },
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

		it('getSessionRecordingDetails', async () => {
			const mockDetail = {
				id: 601,
				duration: 3600,
				recording_url: 'https://download',
			};
			mockMakeRequest.mockResolvedValueOnce(mockDetail);
			const result =
				await plugin.endpoints!.recordings.getSessionRecordingDetails(
					mockContext,
					{
						roomId: 101,
						recordingId: 601,
					},
				);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/recordings/601',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockDetail);
		});

		it('deleteRecording', async () => {
			mockMakeRequest.mockResolvedValueOnce({ status: 'deleted' });
			const result = await plugin.endpoints!.recordings.deleteRecording(
				mockContext,
				{
					roomId: 101,
					recordingId: 601,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/recordings/601',
				'test_api_key',
				{
					method: 'DELETE',
				},
			);
			expect(result).toEqual({ status: 'deleted' });
		});

		it('deleteRecordings', async () => {
			mockMakeRequest.mockResolvedValueOnce({
				status: 'deleted',
				deleted_count: 3,
			});
			const result = await plugin.endpoints!.recordings.deleteRecordings(
				mockContext,
				{
					roomId: 101,
				},
			);
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/conferences/101/recordings',
				'test_api_key',
				{
					method: 'DELETE',
				},
			);
			expect(result).toEqual({ status: 'deleted', deleted_count: 3 });
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 7. Chats Endpoints (2)
	// ─────────────────────────────────────────────────────────────────────────
	describe('chats endpoints', () => {
		it('getChats', async () => {
			const mockChats = [{ id: 701, conference_id: 101 }];
			mockMakeRequest.mockResolvedValueOnce(mockChats);
			const result = await plugin.endpoints!.chats.getChats(mockContext, {
				page: 1,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith('/chats', 'test_api_key', {
				method: 'GET',
				query: { page: 1 },
			});
			expect(result).toEqual(mockChats);
		});

		it('getChatDetails', async () => {
			const mockChat = { id: 701, messages: [] };
			mockMakeRequest.mockResolvedValueOnce(mockChat);
			const result = await plugin.endpoints!.chats.getChatDetails(mockContext, {
				chatId: 701,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/chats/701',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockChat);
		});
	});

	// ─────────────────────────────────────────────────────────────────────────
	// 8. Files Endpoints (5)
	// ─────────────────────────────────────────────────────────────────────────
	describe('files endpoints', () => {
		it('getFileLibrary', async () => {
			const mockFiles = [{ id: 801, name: 'presentation.pdf' }];
			mockMakeRequest.mockResolvedValueOnce(mockFiles);
			const result = await plugin.endpoints!.files.getFileLibrary(mockContext, {
				page: 1,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library',
				'test_api_key',
				{
					method: 'GET',
					query: { page: 1 },
				},
			);
			expect(result).toEqual(mockFiles);
		});

		it('getFileDetails', async () => {
			const mockFile = { id: 801, name: 'presentation.pdf', size: 1024 };
			mockMakeRequest.mockResolvedValueOnce(mockFile);
			const result = await plugin.endpoints!.files.getFileDetails(mockContext, {
				fileId: 801,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library/801',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockFile);
		});

		it('uploadFile', async () => {
			const mockUpload = { id: 802, name: 'doc.pdf', status: 'uploaded' };
			mockMakeRequest.mockResolvedValueOnce(mockUpload);
			const result = await plugin.endpoints!.files.uploadFile(mockContext, {
				name: 'doc.pdf',
				content: 'SGVsbG8gV29ybGQ=',
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library',
				'test_api_key',
				{
					method: 'POST',
					body: expect.any(FormData),
				},
			);
			expect(result).toEqual(mockUpload);
		});

		it('uploadFile with data URI', async () => {
			const mockUpload = { id: 803, name: 'image.png', status: 'uploaded' };
			mockMakeRequest.mockResolvedValueOnce(mockUpload);
			const result = await plugin.endpoints!.files.uploadFile(mockContext, {
				name: 'image.png',
				content:
					'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
			});
			expect(result).toEqual(mockUpload);
		});

		it('deleteFile', async () => {
			mockMakeRequest.mockResolvedValueOnce({ status: 'deleted' });
			const result = await plugin.endpoints!.files.deleteFile(mockContext, {
				fileId: 801,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library/801',
				'test_api_key',
				{
					method: 'DELETE',
				},
			);
			expect(result).toEqual({ status: 'deleted' });
		});

		it('downloadFile', async () => {
			const mockDownload = {
				download_url: 'https://clickmeeting.com/files/download',
			};
			mockMakeRequest.mockResolvedValueOnce(mockDownload);
			const result = await plugin.endpoints!.files.downloadFile(mockContext, {
				fileId: 801,
			});
			expect(mockMakeRequest).toHaveBeenCalledWith(
				'/file-library/801/download',
				'test_api_key',
				{
					method: 'GET',
				},
			);
			expect(result).toEqual(mockDownload);
		});
	});
});
