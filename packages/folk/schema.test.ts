import {
	CompaniesCreateInputSchema,
	CompaniesListInputSchema,
	CompanySchema,
	CreditItemSchema,
	CreditsGetResponseSchema,
	GroupMemberSchema,
	GroupMembersAddInputSchema,
	GroupSchema,
	GroupsCreateInputSchema,
	InteractionSchema,
	InteractionsCreateInputSchema,
	NoteSchema,
	NotesCreateInputSchema,
	PeopleCreateInputSchema,
	PeopleListInputSchema,
	PersonSchema,
	UserSchema,
	UsersGetInputSchema,
} from './endpoints/types';
import * as folkPackage from './index';
import { FolkSchema } from './schema';

describe('Folk schema and types', () => {
	it('declares a semver version and empty entities map', () => {
		expect(FolkSchema.version).toBeDefined();
		expect(FolkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof FolkSchema.entities).toBe('object');
		expect(FolkSchema.entities).toEqual({});
	});

	describe('Person schemas', () => {
		it('parses valid person input and rejects extra undocumented fields due to strict mode', () => {
			const valid = {
				firstName: 'John',
				lastName: 'Doe',
				gender: 'Male',
				birthday: '1990-01-01',
				groups: [{ id: 'grp_123' }],
				emails: ['john@example.com'],
			};
			expect(PeopleCreateInputSchema.parse(valid)).toEqual(valid);

			const invalidExtra = {
				...valid,
				undocumentedCallback: 'https://evil.com/hook',
			};
			expect(() => PeopleCreateInputSchema.parse(invalidExtra)).toThrow();
		});

		it('parses realistic person output object', () => {
			const person = {
				id: 'per_183ed5cc-3182-45de-84d1-d520f2604810',
				firstName: 'John',
				lastName: 'Doe',
				fullName: 'John Doe',
				description: 'Engineer',
				birthday: '1985-05-20',
				gender: 'Male',
				jobTitle: 'Developer',
				createdAt: '2025-01-01T00:00:00.000Z',
				createdBy: {
					id: 'usr_1',
					fullName: 'Admin',
					email: 'admin@example.com',
				},
				groups: [{ id: 'grp_1', name: 'Engineering' }],
				companies: [{ id: 'com_1', name: 'Tech Corp' }],
				addresses: ['123 Main St'],
				emails: ['john@example.com'],
				phones: ['+123456789'],
				urls: ['https://example.com'],
				customFieldValues: {
					grp_1: {
						Status: 'Active',
						Score: 95,
					},
				},
			};
			expect(PersonSchema.parse(person)).toEqual(person);
		});

		it('validates people query parameters and pagination limits', () => {
			expect(
				PeopleListInputSchema.parse({ limit: 50, cursor: 'cur_abc' }),
			).toEqual({
				limit: 50,
				cursor: 'cur_abc',
			});

			expect(() => PeopleListInputSchema.parse({ limit: 150 })).toThrow();
			expect(() => PeopleListInputSchema.parse({ limit: 0 })).toThrow();
		});
	});

	describe('Company schemas', () => {
		it('validates company create input requiring name and accepting valid employee ranges', () => {
			const valid = {
				name: 'Acme Corp',
				employeeRange: '51-200',
				fundingRaised: 5000000,
			};
			expect(CompaniesCreateInputSchema.parse(valid)).toEqual(valid);

			expect(() =>
				CompaniesCreateInputSchema.parse({
					name: 'Acme',
					employeeRange: 'invalid-range',
				}),
			).toThrow();

			expect(() =>
				CompaniesCreateInputSchema.parse({
					description: 'Missing name',
				}),
			).toThrow();
		});

		it('parses company output schema', () => {
			const company = {
				id: 'com_123',
				name: 'Tech Inc',
				industry: 'Software',
				foundationYear: 2020,
			};
			expect(CompanySchema.parse(company)).toEqual(company);
		});

		it('validates companies list input strictness', () => {
			expect(
				CompaniesListInputSchema.parse({
					limit: 20,
					combinator: 'or',
				}),
			).toEqual({ limit: 20, combinator: 'or' });

			expect(() =>
				CompaniesListInputSchema.parse({
					limit: 20,
					unknownProp: true,
				}),
			).toThrow();
		});
	});

	describe('Group and GroupMember schemas', () => {
		it('validates group create input requires name and visibility', () => {
			expect(
				GroupsCreateInputSchema.parse({
					name: 'Investors',
					visibility: 'public',
					emoji: '🤝',
				}),
			).toEqual({
				name: 'Investors',
				visibility: 'public',
				emoji: '🤝',
			});

			expect(() =>
				GroupsCreateInputSchema.parse({
					name: 'Investors',
					visibility: 'invalid-visibility',
				}),
			).toThrow();
		});

		it('validates group member add requires valid role enum', () => {
			expect(
				GroupMembersAddInputSchema.parse({
					groupId: 'grp_123',
					id: 'usr_456',
					role: 'contributor',
				}),
			).toEqual({
				groupId: 'grp_123',
				id: 'usr_456',
				role: 'contributor',
			});

			expect(() =>
				GroupMembersAddInputSchema.parse({
					groupId: 'grp_123',
					id: 'usr_456',
					role: 'superadmin',
				}),
			).toThrow();
		});

		it('parses group and group member output schemas', () => {
			expect(
				GroupSchema.parse({
					id: 'grp_1',
					name: 'Core',
					visibility: 'private',
				}),
			).toEqual({
				id: 'grp_1',
				name: 'Core',
				visibility: 'private',
			});

			expect(
				GroupMemberSchema.parse({
					id: 'usr_1',
					fullName: 'Alice',
					email: 'alice@example.com',
					role: 'admin',
				}),
			).toEqual({
				id: 'usr_1',
				fullName: 'Alice',
				email: 'alice@example.com',
				role: 'admin',
			});
		});
	});

	it('keeps makeFolkRequest out of the package entry point', () => {
		expect('makeFolkRequest' in folkPackage).toBe(false);
		expect(typeof folkPackage.folk).toBe('function');
		expect(typeof folkPackage.FolkAPIError).toBe('function');
	});

	describe('Folk documented response shapes', () => {
		it('accepts a group whose createdBy is a user ID and a group owner', () => {
			expect(
				GroupSchema.parse({
					id: 'grp_1',
					name: 'Core',
					visibility: 'private',
					createdBy: 'usr_1',
					emoji: null,
				}).createdBy,
			).toBe('usr_1');
			expect(
				GroupMemberSchema.parse({
					id: 'usr_1',
					fullName: 'Alice',
					email: 'alice@example.com',
					role: 'owner',
				}).role,
			).toBe('owner');
		});

		it('accepts imported email interactions with several recipients and object content', () => {
			const email = {
				id: 'eml_1',
				entity: { entityType: 'person', id: 'per_1', fullName: 'John Doe' },
				dateTime: '2025-07-17T09:00:00.000Z',
				url: null,
				privacyLevel: 'subjectOnly',
				interactionType: 'email',
				from: { type: 'email', value: 'jane@example.com', name: 'Jane' },
				to: [
					{ type: 'email', value: 'john@example.com', name: 'John' },
					{ type: 'email', value: 'amy@example.com' },
				],
				content: { subject: 'Project kickoff', snippet: 'Hi John' },
			};
			const parsed = InteractionSchema.parse(email);
			expect(Array.isArray(parsed.to)).toBe(true);
			expect(parsed.content).toEqual({
				subject: 'Project kickoff',
				snippet: 'Hi John',
			});
		});

		it('accepts notes written by the assistant and records with a null createdAt', () => {
			const note = NoteSchema.parse({
				id: 'nte_1',
				entity: { id: 'per_1', entityType: 'person', fullName: 'John Doe' },
				content: 'Summary',
				visibility: 'public',
				author: { type: 'assistant', fullName: 'folk assistant' },
				createdAt: null,
				parentNote: null,
			});
			expect(note.author?.type).toBe('assistant');
			expect(
				PersonSchema.parse({ id: 'per_1', createdAt: null }).createdAt,
			).toBeNull();
			expect(
				CompanySchema.parse({ id: 'com_1', name: 'Acme', createdAt: null })
					.createdAt,
			).toBeNull();
		});
	});

	describe('Interaction schemas', () => {
		it('validates interaction create requires entity, dateTime, title, and content', () => {
			const valid = {
				entity: { id: 'per_123' },
				dateTime: '2025-07-17T09:00:00.000Z',
				title: 'Intro call',
				content: 'Met via Zoom to discuss partnership',
				activityType: 'call',
			};
			expect(InteractionsCreateInputSchema.parse(valid)).toEqual(valid);

			expect(() =>
				InteractionsCreateInputSchema.parse({
					dateTime: '2025-07-17T09:00:00.000Z',
					title: 'Intro call',
				}),
			).toThrow();
		});

		it('parses interaction output schema', () => {
			const interaction = {
				id: 'int_123',
				title: 'Coffee meet',
				content: 'Good chat',
				activityType: 'coffee',
				dateTime: '2025-07-17T09:00:00.000Z',
			};
			expect(InteractionSchema.parse(interaction)).toEqual(interaction);
		});
	});

	describe('Note schemas', () => {
		it('validates note create input requires entity, content, and visibility', () => {
			const valid = {
				entity: { id: 'per_123' },
				content: 'Follow-up note',
				visibility: 'private' as const,
			};
			expect(NotesCreateInputSchema.parse(valid)).toEqual(valid);

			expect(() =>
				NotesCreateInputSchema.parse({
					entity: { id: 'per_123' },
					content: 'Missing visibility',
				}),
			).toThrow();
		});

		it('parses note output schema', () => {
			const note = {
				id: 'nte_123',
				content: 'Note text',
				visibility: 'public',
				createdAt: '2025-01-01T00:00:00.000Z',
			};
			expect(NoteSchema.parse(note)).toEqual(note);
		});
	});

	describe('User and Credit schemas', () => {
		it('parses user schemas', () => {
			expect(UsersGetInputSchema.parse({ userId: 'usr_123' })).toEqual({
				userId: 'usr_123',
			});

			expect(
				UserSchema.parse({
					id: 'usr_123',
					fullName: 'Jane Doe',
					email: 'jane@example.com',
				}),
			).toEqual({
				id: 'usr_123',
				fullName: 'Jane Doe',
				email: 'jane@example.com',
			});
		});

		it('parses credit balance response schema', () => {
			const payload = {
				data: {
					items: [
						{
							feature: 'person_enrichment',
							scope: 'workspace',
							used: 50,
							limit: 500,
							periodStart: '2026-01-01T00:00:00.000Z',
							periodEnd: '2026-02-01T00:00:00.000Z',
						},
					],
				},
			};
			expect(CreditsGetResponseSchema.parse(payload)).toEqual(payload);
			expect(CreditItemSchema.parse(payload.data.items[0])).toEqual(
				payload.data.items[0],
			);
		});
	});
});
