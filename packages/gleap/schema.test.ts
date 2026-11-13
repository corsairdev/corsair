import {
	BoardSchema,
	BoardsCreateInputSchema,
	BoardsDeleteInputSchema,
	BoardsListInputSchema,
	BoardsUpdateInputSchema,
	CompaniesCreateOrUpdateInputSchema,
	CompaniesDeleteInputSchema,
	CompaniesGetInputSchema,
	CompaniesListInputSchema,
	CompanySchema,
	FeedbackRateConversationInputSchema,
	FeedbackRateMessageInputSchema,
	FeedbackSurveysGetInputSchema,
	FeedbackSurveysListInputSchema,
	FeedbackSurveysResponsesInputSchema,
	FeedbackSurveysStatsInputSchema,
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
	MessageSchema,
	MessagesCreateInputSchema,
	MessagesCreateThreadInputSchema,
	MessagesDeleteInputSchema,
	MessagesGetThreadInputSchema,
	MessagesListInputSchema,
	MessagesUpdateInputSchema,
	SessionSchema,
	SessionsActivitiesInputSchema,
	SessionsCreateInputSchema,
	SessionsDeleteInputSchema,
	SessionsGetByUserIdInputSchema,
	SessionsGetInputSchema,
	SessionsListInputSchema,
	SessionsSearchInputSchema,
	SessionsUpdateInputSchema,
	SurveySchema,
	TeamSchema,
	TeamsCreateInputSchema,
	TeamsDeleteInputSchema,
	TeamsListInputSchema,
	TeamsUpdateInputSchema,
	TicketSchema,
	TicketsCountsInputSchema,
	TicketsCreateInputSchema,
	TicketsDeleteInputSchema,
	TicketsGetInputSchema,
	TicketsListInputSchema,
	TicketsSearchInputSchema,
	TicketsUpdateInputSchema,
	UserSchema,
	UsersGetMeInputSchema,
	UsersListInputSchema,
	UsersUpdateInputSchema,
} from './endpoints/types';
import { gleap, gleapEndpointMeta, gleapEndpointSchemas } from './index';
import { GleapSchema } from './schema';
import { gleapEntities } from './schema/database';

describe('Gleap schema', () => {
	it('declares a valid semver version', () => {
		expect(GleapSchema.version).toBeDefined();
		expect(GleapSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(GleapSchema.entities).toBe(gleapEntities);
		expect(GleapSchema.entities).toEqual({});
	});

	it('keeps schemas, metadata and nested endpoints in exact sync', () => {
		const plugin = gleap();
		const nestedOps: string[] = [];

		for (const [groupKey, group] of Object.entries(plugin.endpoints ?? {})) {
			if (!group) continue;
			for (const opKey of Object.keys(group)) {
				nestedOps.push(`${groupKey}.${opKey}`);
			}
		}

		const schemaKeys = Object.keys(gleapEndpointSchemas);
		const metaKeys = Object.keys(gleapEndpointMeta);

		expect(nestedOps.sort()).toEqual(schemaKeys.sort());
		expect(nestedOps.sort()).toEqual(metaKeys.sort());

		// Total operations assertion
		expect(nestedOps.length).toBe(42);
	});
});

describe('Ticket schemas', () => {
	it('validates TicketSchema and required fields', () => {
		const sampleTicket = {
			id: 'ticket_1',
			title: 'Login failure',
			description: 'Cannot login with OAuth',
			type: 'BUG',
			status: 'OPEN',
			priority: 'HIGH',
			session: 'session_1',
			customData: { appVersion: '2.4.0' },
			createdAt: '2026-11-13T10:00:00Z',
		};
		expect(TicketSchema.safeParse(sampleTicket).success).toBe(true);

		const invalidInput = TicketsGetInputSchema.safeParse({ ticketId: '' });
		expect(invalidInput.success).toBe(false);
	});

	it('validates TicketsListInputSchema and TicketsCreateInputSchema', () => {
		expect(
			TicketsListInputSchema.safeParse({
				type: 'BUG',
				status: 'OPEN',
				limit: 20,
			}).success,
		).toBe(true);

		expect(
			TicketsCreateInputSchema.safeParse({
				title: 'New bug',
				type: 'BUG',
				priority: 'MEDIUM',
			}).success,
		).toBe(true);

		expect(
			TicketsUpdateInputSchema.safeParse({
				ticketId: 'ticket_1',
				status: 'DONE',
			}).success,
		).toBe(true);

		expect(
			TicketsDeleteInputSchema.safeParse({
				ticketId: 'ticket_1',
			}).success,
		).toBe(true);

		expect(
			TicketsSearchInputSchema.safeParse({
				searchTerm: 'crash',
			}).success,
		).toBe(true);

		expect(
			TicketsCountsInputSchema.safeParse({
				project: 'proj_1',
			}).success,
		).toBe(true);
	});
});

describe('Message schemas', () => {
	it('validates MessageSchema and message operations', () => {
		const sampleMessage = {
			id: 'msg_1',
			ticket: 'ticket_1',
			comment: 'Hello from support',
			type: 'TEXT',
			isNote: false,
			createdAt: '2026-11-13T11:00:00Z',
		};
		expect(MessageSchema.safeParse(sampleMessage).success).toBe(true);

		expect(
			MessagesCreateInputSchema.safeParse({
				ticket: 'ticket_1',
				content: 'Support response',
			}).success,
		).toBe(true);

		expect(MessagesCreateInputSchema.safeParse({ ticket: '' }).success).toBe(
			false,
		);

		expect(
			MessagesUpdateInputSchema.safeParse({
				messageId: 'msg_1',
				content: 'Updated comment',
			}).success,
		).toBe(true);

		expect(
			MessagesDeleteInputSchema.safeParse({ messageId: 'msg_1' }).success,
		).toBe(true);

		expect(
			MessagesGetThreadInputSchema.safeParse({ messageId: 'msg_1' }).success,
		).toBe(true);

		expect(
			MessagesCreateThreadInputSchema.safeParse({
				messageId: 'msg_1',
				content: 'Thread reply',
			}).success,
		).toBe(true);

		expect(
			MessagesListInputSchema.safeParse({ ticket: 'ticket_1', limit: 30 })
				.success,
		).toBe(true);
	});
});

describe('Session schemas', () => {
	it('validates SessionSchema and session inputs', () => {
		const sampleSession = {
			id: 'sess_1',
			userId: 'usr_123',
			name: 'John Doe',
			email: 'john@example.com',
			customData: { tier: 'pro' },
		};
		expect(SessionSchema.safeParse(sampleSession).success).toBe(true);

		expect(
			SessionsCreateInputSchema.safeParse({
				userId: 'usr_123',
				name: 'John Doe',
				email: 'john@example.com',
			}).success,
		).toBe(true);

		expect(
			SessionsGetInputSchema.safeParse({ sessionId: 'sess_1' }).success,
		).toBe(true);

		expect(
			SessionsGetByUserIdInputSchema.safeParse({ userId: 'usr_123' }).success,
		).toBe(true);

		expect(
			SessionsUpdateInputSchema.safeParse({
				sessionId: 'sess_1',
				name: 'Jane Doe',
			}).success,
		).toBe(true);

		expect(
			SessionsDeleteInputSchema.safeParse({ sessionId: 'sess_1' }).success,
		).toBe(true);

		expect(
			SessionsSearchInputSchema.safeParse({ query: 'john@example.com' })
				.success,
		).toBe(true);

		expect(
			SessionsActivitiesInputSchema.safeParse({ sessionId: 'sess_1' }).success,
		).toBe(true);

		expect(
			SessionsListInputSchema.safeParse({ skip: 0, limit: 50 }).success,
		).toBe(true);
	});
});

describe('User schemas', () => {
	it('validates UserSchema and user inputs', () => {
		const sampleUser = {
			id: 'user_1',
			name: 'Teammate',
			email: 'team@example.com',
			role: 'ADMIN',
		};
		expect(UserSchema.safeParse(sampleUser).success).toBe(true);

		expect(UsersGetMeInputSchema.safeParse({}).success).toBe(true);
		expect(UsersListInputSchema.safeParse({}).success).toBe(true);
		expect(
			UsersUpdateInputSchema.safeParse({
				userId: 'user_1',
				name: 'Updated Name',
			}).success,
		).toBe(true);
	});
});

describe('Feedback & Surveys schemas', () => {
	it('validates CSAT conversation rating input bounds (0 to 10)', () => {
		expect(
			FeedbackRateConversationInputSchema.safeParse({
				conversationId: 'conv_1',
				rating: 10,
			}).success,
		).toBe(true);

		expect(
			FeedbackRateConversationInputSchema.safeParse({
				conversationId: 'conv_1',
				rating: 0,
			}).success,
		).toBe(true);

		expect(
			FeedbackRateConversationInputSchema.safeParse({
				conversationId: 'conv_1',
				rating: 11,
			}).success,
		).toBe(false);

		expect(
			FeedbackRateConversationInputSchema.safeParse({
				conversationId: 'conv_1',
				rating: -1,
			}).success,
		).toBe(false);
	});

	it('validates message rating input', () => {
		expect(
			FeedbackRateMessageInputSchema.safeParse({
				messageId: 'msg_1',
				rating: 'up',
			}).success,
		).toBe(true);
	});

	it('validates survey schemas', () => {
		const sampleSurvey = {
			id: 'srv_1',
			name: 'CSAT Q4',
			status: 'ACTIVE',
		};
		expect(SurveySchema.safeParse(sampleSurvey).success).toBe(true);

		expect(
			FeedbackSurveysListInputSchema.safeParse({ limit: 10 }).success,
		).toBe(true);

		expect(
			FeedbackSurveysGetInputSchema.safeParse({ surveyId: 'srv_1' }).success,
		).toBe(true);

		expect(
			FeedbackSurveysResponsesInputSchema.safeParse({ surveyId: 'srv_1' })
				.success,
		).toBe(true);

		expect(
			FeedbackSurveysStatsInputSchema.safeParse({
				surveyId: 'srv_1',
				version: '1',
			}).success,
		).toBe(true);
	});
});

describe('Teams schemas', () => {
	it('validates TeamSchema and team operations', () => {
		const sampleTeam = {
			id: 'team_1',
			name: 'Tier 1 Support',
			assignmentMethod: 'round_robin',
			members: ['user_1', 'user_2'],
		};
		expect(TeamSchema.safeParse(sampleTeam).success).toBe(true);

		expect(
			TeamsCreateInputSchema.safeParse({
				name: 'Support Team',
			}).success,
		).toBe(true);

		expect(TeamsCreateInputSchema.safeParse({ name: '' }).success).toBe(false);

		expect(
			TeamsUpdateInputSchema.safeParse({
				teamId: 'team_1',
				name: 'New Name',
			}).success,
		).toBe(true);

		expect(TeamsDeleteInputSchema.safeParse({ teamId: 'team_1' }).success).toBe(
			true,
		);

		expect(TeamsListInputSchema.safeParse({}).success).toBe(true);
	});
});

describe('Boards schemas', () => {
	it('validates BoardSchema and board operations', () => {
		const sampleBoard = {
			type: 'BUG',
			name: 'Bugs Board',
			path: '/bugs',
		};
		expect(BoardSchema.safeParse(sampleBoard).success).toBe(true);

		expect(
			BoardsCreateInputSchema.safeParse({
				name: 'Feedback Board',
			}).success,
		).toBe(true);

		expect(
			BoardsUpdateInputSchema.safeParse({
				type: 'BUG',
				name: 'Issue Tracker',
			}).success,
		).toBe(true);

		expect(BoardsDeleteInputSchema.safeParse({ type: 'BUG' }).success).toBe(
			true,
		);

		expect(BoardsListInputSchema.safeParse({}).success).toBe(true);
	});
});

describe('Companies schemas', () => {
	it('validates CompanySchema and company operations', () => {
		const sampleCompany = {
			companyId: 'comp_1',
			name: 'Acme Corp',
			domain: 'acme.example.com',
			plan: 'Enterprise',
		};
		expect(CompanySchema.safeParse(sampleCompany).success).toBe(true);

		expect(
			CompaniesCreateOrUpdateInputSchema.safeParse({
				companyId: 'comp_1',
				name: 'Acme Corp',
			}).success,
		).toBe(true);

		expect(
			CompaniesGetInputSchema.safeParse({ companyId: 'comp_1' }).success,
		).toBe(true);

		expect(
			CompaniesDeleteInputSchema.safeParse({ companyId: 'comp_1' }).success,
		).toBe(true);

		expect(
			CompaniesListInputSchema.safeParse({ limit: 50, search: 'Acme' })
				.success,
		).toBe(true);
	});
});
