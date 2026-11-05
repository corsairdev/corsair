import { LeverEndpointInputSchemas } from './endpoints/types';
import { lever, leverEndpointSchemas } from './index';
import { LeverSchema } from './schema';

jest.mock('./client', () => ({
	makeLeverBinaryRequest: jest.fn(),
	makeLeverRequest: jest.fn(),
}));

import { makeLeverBinaryRequest, makeLeverRequest } from './client';

describe('Lever schema', () => {
	it('declares a semver version', () => {
		expect(LeverSchema.version).toBeDefined();
		expect(LeverSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof LeverSchema.entities).toBe('object');
		expect(LeverSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(LeverSchema.entities))).toBe(true);
		for (const entity of Object.values(LeverSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers the full current Lever operation catalog', () => {
		expect(Object.keys(leverEndpointSchemas).length).toBeGreaterThanOrEqual(38);
	});

	it('enforces endpoint schemas at the bound endpoint boundary', async () => {
		const request = jest.mocked(makeLeverRequest);
		const binaryRequest = jest.mocked(makeLeverBinaryRequest);
		binaryRequest.mockResolvedValue({
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		});
		request.mockClear();
		request.mockResolvedValue({ data: [], hasNext: false });
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		if (!plugin.endpoints) throw new Error('Lever endpoints are missing');

		await expect(
			plugin.endpoints.opportunities.list(ctx, { offset: -1 } as never),
		).rejects.toThrow();
		expect(request).not.toHaveBeenCalled();

		await expect(plugin.endpoints.opportunities.list(ctx, {})).resolves.toEqual(
			{ data: [], hasNext: false },
		);

		request.mockResolvedValue({ invalid: true });
		await expect(
			plugin.endpoints.opportunities.list(ctx, {}),
		).rejects.toThrow();
	});

	it('requires every path parameter at the schema boundary', () => {
		const opportunityOperations = [
			'retrieveOpportunity',
			'listOpportunityFileActions',
			'listApplications',
			'listInterviews',
			'listNotes',
			'listPanels',
			'listFeedback',
			'listFiles',
		] as const;
		for (const operation of opportunityOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ opportunityId: 'opp-1' }).success).toBe(true);
		}

		const twoIdOperations = [
			'retrieveApplication',
			'retrieveInterview',
			'updateInterview',
			'deleteInterview',
			'retrieveNote',
			'updateNote',
			'deleteNote',
			'retrievePanel',
			'retrieveFeedback',
		] as const;
		for (const operation of twoIdOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({ opportunityId: 'opp-1' }).success).toBe(false);
		}
		expect(
			LeverEndpointInputSchemas.retrieveApplication.safeParse({
				opportunityId: 'opp-1',
				applicationId: 'app-1',
			}).success,
		).toBe(true);
		expect(
			LeverEndpointInputSchemas.retrieveInterview.safeParse({
				opportunityId: 'opp-1',
				interviewId: 'int-1',
			}).success,
		).toBe(true);
		expect(
			LeverEndpointInputSchemas.deleteNote.safeParse({
				opportunityId: 'opp-1',
				noteId: 'note-1',
			}).success,
		).toBe(true);

		const bodyRequiredOperations = [
			[
				'addOpportunityLinks',
				{ opportunityId: 'opp-1', links: ['linkedin.com/in/jane'] },
			],
			[
				'removeOpportunityLinks',
				{ opportunityId: 'opp-1', links: ['linkedin.com/in/jane'] },
			],
			['addOpportunityTags', { opportunityId: 'opp-1', tags: ['remote'] }],
			['removeOpportunityTags', { opportunityId: 'opp-1', tags: ['remote'] }],
			['addOpportunitySources', { opportunityId: 'opp-1', sources: ['Gild'] }],
			[
				'removeOpportunitySources',
				{ opportunityId: 'opp-1', sources: ['Gild'] },
			],
			['createOpportunity', { perform_as: 'user-1', name: 'Jane Doe' }],
			['updateOpportunityStage', { opportunityId: 'opp-1', stage: 'stage-2' }],
			[
				'updateOpportunityArchivedState',
				{ opportunityId: 'opp-1', reason: null },
			],
			['createNote', { opportunityId: 'opp-1', value: 'note text' }],
			[
				'updateNote',
				{
					opportunityId: 'opp-1',
					noteId: 'note-1',
					values: [{ value: 'note text' }],
				},
			],
			[
				'applyToPosting',
				{
					postingId: 'post-1',
					personalInformation: [{ name: 'fullName', value: 'Jane Doe' }],
				},
			],
			['createPosting', { perform_as: 'user-1', text: 'Software Engineer' }],
			[
				'createInterview',
				{
					opportunityId: 'opp-1',
					perform_as: 'user-1',
					panel: 'panel-1',
					interviewers: [{ id: 'user-2' }],
					date: 1700000000000,
					duration: 30,
				},
			],
			[
				'createPanel',
				{
					opportunityId: 'opp-1',
					perform_as: 'user-1',
					timezone: 'America/Los_Angeles',
					interviews: [{ date: 1700000000000, duration: 30 }],
				},
			],
			[
				'updatePanel',
				{
					opportunityId: 'opp-1',
					panelId: 'panel-1',
					perform_as: 'user-1',
					timezone: 'America/Los_Angeles',
					interviews: [{ date: 1700000000000, duration: 30 }],
				},
			],
			[
				'createFeedback',
				{
					opportunityId: 'opp-1',
					perform_as: 'user-1',
					baseTemplateId: 'ft-1',
					fieldValues: [{ id: 'fv-1', value: ['a', 'b'] }],
				},
			],
			[
				'updateFeedback',
				{
					opportunityId: 'opp-1',
					feedbackId: 'fb-1',
					perform_as: 'user-1',
					completedAt: 1600275449372,
				},
			],
			['createFeedbackTemplate', { text: 'Phone Screen Feedback Form' }],
			[
				'updateFeedbackTemplate',
				{ feedbackTemplateId: 'ft-1', text: 'Updated form' },
			],
			['updateFormTemplate', { formTemplateId: 'f-1', text: 'Offer info' }],
			[
				'createFormTemplate',
				{ text: 'Offer info', fields: [{ type: 'date', text: 'Start Date' }] },
			],
			[
				'createRequisitionField',
				{ id: 'work_type', text: 'Work type', type: 'dropdown' },
			],
			[
				'updateRequisitionField',
				{ requisitionFieldId: 'rf-1', text: 'Work type', type: 'dropdown' },
			],
			[
				'addRequisitionFieldOptions',
				{ requisitionFieldId: 'rf-1', values: [{ text: 'hourly' }] },
			],
			[
				'replaceRequisitionFieldOptions',
				{
					requisitionFieldId: 'rf-1',
					values: [{ id: 'opt-1', text: 'remote' }],
				},
			],
			[
				'deleteRequisitionFieldOptions',
				{ requisitionFieldId: 'rf-1', values: ['opt-1'] },
			],
			[
				'createRequisition',
				{ requisitionCode: 'ENG-9', name: 'Engineer', headcountTotal: 1 },
			],
			[
				'createForm',
				{
					opportunityId: 'opp-1',
					baseTemplateId: 'form-1',
					fields: [{ type: 'currency', text: 'Compensation', value: 75000 }],
				},
			],
			['createUser', { name: 'Chandler Bing', email: 'chandler@example.com' }],
			['updateUser', { userId: 'user-1', name: 'Chandler Bing' }],
			['updateContact', { contactId: 'con-1', name: 'Jane Doe' }],
			[
				'createWebhook',
				{ url: 'https://example.test/hook', event: 'candidateStageChange' },
			],
			[
				'updateWebhook',
				{ webhookId: 'wh-1', url: 'https://example.test/hook' },
			],
		] as const;
		for (const [operation, validInput] of bodyRequiredOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(validInput as never).success).toBe(true);
		}

		expect(
			LeverEndpointInputSchemas.retrievePosting.safeParse({}).success,
		).toBe(false);
		expect(
			LeverEndpointInputSchemas.retrievePosting.safeParse({
				postingId: 'post-1',
			}).success,
		).toBe(true);
		expect(LeverEndpointInputSchemas.retrieveStage.safeParse({}).success).toBe(
			false,
		);
		expect(
			LeverEndpointInputSchemas.retrieveStage.safeParse({ stageId: 'stage-1' })
				.success,
		).toBe(true);
		const singleIdOperations = [
			['retrieveFeedbackTemplate', { feedbackTemplateId: 'ft-1' }],
			['retrieveFormTemplate', { formTemplateId: 'form-1' }],
			['retrieveRequisitionField', { requisitionFieldId: 'rf-1' }],
			['retrieveUser', { userId: 'user-1' }],
			['retrieveContact', { contactId: 'con-1' }],
			['retrieveDiversitySurvey', { postingId: 'post-1' }],
			['retrieveRequisition', { requisitionId: 'req-1' }],
		] as const;
		for (const [operation, validInput] of singleIdOperations) {
			const schema =
				LeverEndpointInputSchemas[
					operation as keyof typeof LeverEndpointInputSchemas
				];
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(validInput as never).success).toBe(true);
		}

		expect(
			LeverEndpointInputSchemas.retrieveArchiveReason.safeParse({}).success,
		).toBe(false);
		expect(
			LeverEndpointInputSchemas.retrieveArchiveReason.safeParse({
				archiveReasonId: 'arch-1',
			}).success,
		).toBe(true);
	});

	it('requires perform_as on every write Lever rejects without it', () => {
		const writesRequiringPerformAs = [
			['createOpportunity', { name: 'Jane Doe' }],
			['createPosting', { text: 'Software Engineer' }],
			['updatePosting', { postingId: 'post-1', text: 'Staff Engineer' }],
			[
				'createInterview',
				{
					opportunityId: 'opp-1',
					panel: 'panel-1',
					interviewers: [{ id: 'user-2' }],
					date: 1700000000000,
					duration: 30,
				},
			],
			['deleteInterview', { opportunityId: 'opp-1', interviewId: 'int-1' }],
			[
				'createPanel',
				{
					opportunityId: 'opp-1',
					timezone: 'America/Los_Angeles',
					interviews: [{ duration: 30 }],
				},
			],
			['deletePanel', { opportunityId: 'opp-1', panelId: 'panel-1' }],
			['createFeedback', { opportunityId: 'opp-1', baseTemplateId: 'ft-1' }],
			['updateFeedback', { opportunityId: 'opp-1', feedbackId: 'fb-1' }],
			['deleteFeedback', { opportunityId: 'opp-1', feedbackId: 'fb-1' }],
			['deleteFile', { opportunityId: 'opp-1', fileId: 'file-1' }],
		] as const;
		for (const [operation, input] of writesRequiringPerformAs) {
			const schema = LeverEndpointInputSchemas[operation];
			expect(schema.safeParse(input).success).toBe(false);
			expect(schema.safeParse({ ...input, perform_as: 'user-1' }).success).toBe(
				true,
			);
		}
	});

	it('rejects the field names Lever does not read', () => {
		const schemas = LeverEndpointInputSchemas;
		// Lever reads `stage`, `reason`, `links`, `sources`, `categories`,
		// `baseTemplateId`/`fields` and `values`, not the names below.
		expect(
			schemas.updateOpportunityStage.safeParse({
				opportunityId: 'opp-1',
				stageID: 'stage-2',
			}).success,
		).toBe(false);
		expect(
			schemas.updateOpportunityArchivedState.safeParse({
				opportunityId: 'opp-1',
				archived: true,
				reasonID: 'reason-1',
			}).success,
		).toBe(false);
		expect(
			schemas.addOpportunityLinks.safeParse({
				opportunityId: 'opp-1',
				contactIDs: ['con-1'],
			}).success,
		).toBe(false);
		expect(
			schemas.addOpportunitySources.safeParse({
				opportunityId: 'opp-1',
				sourceIDs: ['src-1'],
			}).success,
		).toBe(false);
		expect(
			schemas.createForm.safeParse({
				opportunityId: 'opp-1',
				formTemplateId: 'form-1',
				values: [{ id: 'field-1', value: 'x' }],
			}).success,
		).toBe(false);
		expect(
			schemas.createFormTemplate.safeParse({ title: 'Application' }).success,
		).toBe(false);
		expect(
			schemas.createRequisition.safeParse({ title: 'Engineer' }).success,
		).toBe(false);
		expect(
			schemas.updateNote.safeParse({
				opportunityId: 'opp-1',
				noteId: 'note-1',
				value: 'text',
			}).success,
		).toBe(false);
		// Posting team and location belong under categories; loose top-level
		// keys are stripped rather than sent.
		const posting = schemas.createPosting.parse({
			perform_as: 'user-1',
			text: 'Engineer',
			team: 'Platform',
			categories: { team: 'Platform', location: 'Remote' },
		});
		expect(posting).not.toHaveProperty('team');
		expect(posting.categories).toEqual({
			team: 'Platform',
			location: 'Remote',
		});
	});

	it('pages with the opaque next token and a 1-100 limit', async () => {
		const listInput = LeverEndpointInputSchemas.listOpportunities;
		expect(listInput.safeParse({ offset: 100 }).success).toBe(false);
		expect(
			listInput.safeParse({
				offset: '0.1414895548650.a6070140-33db-407c-91f5-2760e15c8e94',
				limit: 100,
			}).success,
		).toBe(true);
		expect(listInput.safeParse({ limit: 101 }).success).toBe(false);
		expect(
			LeverEndpointInputSchemas.listDeletedPostings.safeParse({}).success,
		).toBe(false);

		const request = jest.mocked(makeLeverRequest);
		request.mockClear();
		const page = {
			data: [{ id: 'opp-1' }],
			hasNext: true,
			next: '0.1414895548650.a6070140',
		};
		request.mockResolvedValue(page);
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		if (!plugin.endpoints) throw new Error('Lever endpoints are missing');
		const result = await plugin.endpoints.opportunities.list(ctx, {
			offset: page.next,
		});
		expect(result.hasNext).toBe(true);
		expect(result.next).toBe(page.next);
	});

	it('accepts the object envelopes of EEO responses and disposition stages', () => {
		const outputs = leverEndpointSchemas;
		const eeo = {
			data: { eeoResponses: [{ gender: 'Female', posting: 'post-1' }] },
		};
		const stages = {
			data: {
				stages: [{ id: 'lead-new', text: 'New lead', pipeline: 'lead' }],
				archiveReasons: [{ id: 'arch-1', text: 'Hired', type: 'hired' }],
			},
		};
		expect(outputs['eeo.retrieveWithPii'].output?.safeParse(eeo).success).toBe(
			true,
		);
		expect(
			outputs['eeo.retrieveAnonymous'].output?.safeParse(eeo).success,
		).toBe(true);
		expect(
			outputs['dispositionStages.list'].output?.safeParse(stages).success,
		).toBe(true);
	});

	it('types resource responses and rejects malformed records', async () => {
		const out = (path: keyof typeof leverEndpointSchemas) => {
			const schema = leverEndpointSchemas[path].output;
			if (!schema) throw new Error(`Missing output schema for ${path}`);
			return schema;
		};
		const retrieve = out('opportunities.retrieve');

		// The bare object and a record without its id are not opportunities.
		expect(retrieve.safeParse({ invalid: true }).success).toBe(false);
		expect(retrieve.safeParse({ data: { name: 'Jane Doe' } }).success).toBe(
			false,
		);
		// Documented fields are typed.
		expect(
			retrieve.safeParse({ data: { id: 'opp-1', emails: 'jane@x.test' } })
				.success,
		).toBe(false);
		// An expanded field (object instead of ID), an origin Lever added after
		// this plugin shipped, and an undocumented field all still parse.
		const parsed = retrieve.parse({
			data: {
				id: 'opp-1',
				stage: { id: 'stage-1', text: 'New applicant' },
				origin: 'a-new-origin',
				archived: null,
				someNewField: 42,
			},
		});
		expect(parsed).toMatchObject({
			data: { id: 'opp-1', origin: 'a-new-origin', someNewField: 42 },
		});

		// unknown: these payloads are deliberately malformed responses for
		// different operations, so no single response type can describe them.
		const malformed: [keyof typeof leverEndpointSchemas, unknown][] = [
			['opportunities.list', { data: [{ name: 'no id' }] }],
			['postings.retrieve', { data: { text: 'Engineer' } }],
			['users.list', { data: [{ name: 'Chandler' }], hasNext: false }],
			['stages.retrieve', { data: { text: 'New lead' } }],
			['archiveReasons.list', { data: [{ text: 'Underqualified' }] }],
			['sources.list', { data: [{ count: 3 }] }],
			['notes.retrieve', { data: { text: 'Note' } }],
			['feedback.list', { data: [{ text: 'On-site' }] }],
			['forms.retrieve', { data: { text: 'Offer information' } }],
			['interviews.retrieve', { data: { subject: 'On-site' } }],
			['offers.list', { data: [{ status: 'signed' }] }],
			['referrals.retrieve', { data: { type: 'referral' } }],
			['files.list', { data: [{ name: 'cv.pdf' }] }],
			['resumes.retrieve', { data: { createdAt: 1 } }],
			['requisitions.retrieve', { data: { name: 'Engineer' } }],
			['requisitionFields.list', { data: [{ text: 'Cost center' }] }],
			['webhooks.list', { data: [{ url: 'https://example.test/hook' }] }],
			['contacts.retrieve', { data: { name: 'Jane Doe' } }],
			['eeo.retrieveWithPii', { data: [] }],
			['dispositionStages.list', { data: [] }],
			['notes.create', { data: {} }],
			['postings.apply', { data: { id: 'app-1' } }],
		];
		for (const [path, payload] of malformed) {
			expect([path, out(path).safeParse(payload).success]).toEqual([
				path,
				false,
			]);
		}

		// New status values from Lever never fail parsing.
		expect(
			out('postings.retrieve').safeParse({
				data: { id: 'post-1', state: 'a-new-state' },
			}).success,
		).toBe(true);
		expect(
			out('users.retrieve').safeParse({
				data: { id: 'user-1', accessRole: 'custom-role-id' },
			}).success,
		).toBe(true);

		// The bound endpoint enforces the contract on live responses too.
		const request = jest.mocked(makeLeverRequest);
		request.mockClear();
		request.mockResolvedValue({ invalid: true });
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		if (!plugin.endpoints) throw new Error('Lever endpoints are missing');
		await expect(
			plugin.endpoints.opportunities.retrieve(ctx, { opportunityId: 'opp-1' }),
		).rejects.toThrow();
		request.mockResolvedValue({ data: { id: 'opp-1', name: 'Jane Doe' } });
		const opportunity = await plugin.endpoints.opportunities.retrieve(ctx, {
			opportunityId: 'opp-1',
		});
		expect(opportunity.data.id).toBe('opp-1');
		expect(opportunity.data.name).toBe('Jane Doe');
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(leverEndpointSchemas)) {
			if (!schemas.input || !schemas.output) {
				throw new Error('Missing input or output schema');
			}
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps every registered endpoint behind a schema boundary', () => {
		const plugin = lever({ key: 'secret' });
		const paths: string[] = [];
		// unknown: the walk covers heterogeneous tree levels (functions and
		// group objects) before any Zod parsing, so a single stricter type
		// cannot describe both shapes.
		const visit = (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				paths.push(prefix.join('.'));
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					visit(child, [...prefix, key]);
				}
			}
		};

		visit(plugin.endpoints);
		expect(paths).toHaveLength(Object.keys(leverEndpointSchemas).length);
		for (const path of paths) {
			expect(
				leverEndpointSchemas[path as keyof typeof leverEndpointSchemas],
			).toBeDefined();
		}
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeLeverRequest);
		const binaryRequest = jest.mocked(makeLeverBinaryRequest);
		request.mockClear();
		binaryRequest.mockReset();
		binaryRequest.mockResolvedValue({
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		});
		const plugin = lever({ key: 'secret' });
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const inputCandidates = [
			{
				opportunityId: 'opp-1',
				applicationId: 'app-1',
				postingId: 'post-1',
				interviewId: 'int-1',
				noteId: 'note-1',
				archiveReasonId: 'arch-1',
				stageId: 'stage-1',
			},
			{},
			{ deleted_at_start: 1711929600000, deleted_at_end: 1714521600000 },
			{ perform_as: 'user-1', name: 'Jane Doe' },
			{ perform_as: 'user-1', text: 'Software Engineer' },
			{ text: 'Phone Screen Feedback Form' },
			{ opportunityId: 'opp-1', stage: 'stage-2' },
			{ opportunityId: 'opp-1', reason: 'reason-1' },
			{ opportunityId: 'opp-1', links: ['linkedin.com/in/jane'] },
			{ opportunityId: 'opp-1', tags: ['remote'] },
			{ opportunityId: 'opp-1', sources: ['Gild'] },
			{ opportunityId: 'opp-1', value: 'note text' },
			{
				opportunityId: 'opp-1',
				noteId: 'note-1',
				values: [{ value: 'note text' }],
			},
			{
				postingId: 'post-1',
				perform_as: 'user-1',
				personalInformation: [{ name: 'fullName', value: 'Jane Doe' }],
			},
			{
				opportunityId: 'opp-1',
				interviewId: 'int-1',
				perform_as: 'user-1',
				panel: 'panel-1',
				interviewers: [{ id: 'user-2' }],
				date: 1700000000000,
				duration: 30,
			},
			{
				opportunityId: 'opp-1',
				panelId: 'panel-1',
				perform_as: 'user-1',
				timezone: 'America/Los_Angeles',
				interviews: [{ date: 1700000000000, duration: 30 }],
			},
			{
				opportunityId: 'opp-1',
				feedbackId: 'fb-1',
				perform_as: 'user-1',
				baseTemplateId: 'ft-1',
			},
			{ feedbackTemplateId: 'ft-1' },
			{ opportunityId: 'opp-1', fileId: 'file-1', perform_as: 'user-1' },
			{ formTemplateId: 'form-1' },
			{ text: 'Offer info', fields: [{ type: 'date', text: 'Start Date' }] },
			{ id: 'work_type', text: 'Work type', type: 'dropdown' },
			{ requisitionFieldId: 'rf-1' },
			{ requisitionFieldId: 'rf-1', values: [{ text: 'hourly' }] },
			{ requisitionFieldId: 'rf-1', values: ['opt-1'] },
			{
				requisitionId: 'req-1',
				requisitionCode: 'ENG-9',
				name: 'Engineer',
				headcountTotal: 1,
			},
			{
				opportunityId: 'opp-1',
				formId: 'form-1',
				baseTemplateId: 'form-1',
				fields: [{ type: 'currency', text: 'Compensation', value: 75000 }],
			},
			{ opportunityId: 'opp-1', resumeId: 'res-1' },
			{ userId: 'user-1' },
			{ contactId: 'con-1' },
			{ opportunityId: 'opp-1', referralId: 'ref-1' },
			{ webhookId: 'wh-1' },
			{ opportunityId: 'opp-1', offerId: 'offer-1' },
			{ name: 'Chandler Bing', email: 'chandler@example.com' },
			{ url: 'https://example.test/hook', event: 'candidateStageChange' },
		];
		// Real-shaped Lever payloads, selected by operation family rather than
		// by probing the output schema, so a contract that rejects genuine
		// records or strips documented fields fails here instead of in
		// production.
		const record = {
			id: 'rec-1',
			name: 'Jane Doe',
			stage: 'f2a1b2c3-received',
			createdAt: 1700000000000,
			updatedAt: 1700000000001,
			owner: 'user-1',
		};
		const listOutput = {
			data: [
				{ ...record, archived: null },
				{ ...record, id: 'rec-2', name: 'John Smith', archived: null },
			],
			hasNext: true,
			next: '0.1414895548650.a6070140-33db-407c-91f5-2760e15c8e94',
		};
		const recordOutput = { data: record };
		// Shapes Lever documents for specific operations.
		// unknown: each entry is a different operation's response shape; the
		// output schema of that operation validates it below.
		const specialOutputs: Record<string, unknown> = {
			'sources.list': { data: [{ text: 'LinkedIn', count: 24 }] },
			'tags.list': { data: [{ text: 'Infrastructure Engineer', count: 23 }] },
			'notes.create': { data: { noteId: 'note-1' } },
			'notes.update': { data: { noteId: 'note-1' } },
			'postings.apply': { data: { applicationId: 'app-1' } },
			'postings.listUsers': {
				posting: { id: 'post-1', text: 'Software Engineer' },
				users: [{ id: 'user-1', name: 'Jane Smith', email: 'jane@x.test' }],
				roles: [{ id: 'role-1', name: 'Hiring Manager', isReadOnly: false }],
			},
			'surveys.retrieveDiversity': {
				data: [{ id: 'survey-1', text: 'Demographic survey', fields: [] }],
			},
			// Interview and panel writes nest a list inside data.
			'interviews.create': { data: { data: [record], hasNext: false } },
			'interviews.update': { data: { data: [record], hasNext: false } },
			'panels.create': { data: { data: [record], hasNext: false } },
			'panels.update': { data: { data: [record], hasNext: false } },
			'webhooks.create': {
				data: {
					data: {
						id: 'wh-1',
						event: 'candidateStageChange',
						url: 'https://example.test/hook',
						configuration: { signatureToken: 'token-not-a-secret' },
					},
				},
			},
			'webhooks.update': {
				data: [{ id: 'wh-1', url: 'https://example.test/hook' }],
			},
			// Lever documents these creates without the data wrapper.
			'feedback.create': { id: 'fb-1', type: 'interview', text: 'On-site' },
			'forms.create': { id: 'form-1', type: 'form', fields: [] },
			'dispositionStages.list': {
				data: {
					stages: [{ id: 'lead-new', text: 'New lead', pipeline: 'lead' }],
					archiveReasons: [{ id: 'arch-1', text: 'Culture fit', type: null }],
				},
			},
		};
		// EEO responses wrap an object, not a list.
		const eeoOutput = {
			data: {
				eeoResponses: [{ gender: 'Female', appliedAt: '1418353241665' }],
			},
		};
		const downloadOutput = {
			data: 'cGRmLWJ5dGVz',
			contentType: 'application/pdf',
		};
		// Deletes and contact link/tag/source changes answer 204 with no body.
		const ackOperations = new Set([
			'delete',
			'deleteOptions',
			'addLinks',
			'removeLinks',
			'addTags',
			'removeTags',
			'addSources',
			'removeSources',
		]);
		const outputFor = (path: string) => {
			const [, operation = ''] = path.split('.');
			if (path in specialOutputs) return specialOutputs[path];
			if (path.endsWith('.download')) return downloadOutput;
			if (path.startsWith('eeo.')) return eeoOutput;
			if (ackOperations.has(operation)) return undefined;
			if (operation.startsWith('list')) return listOutput;
			return recordOutput;
		};
		let invokedOperations = 0;
		let binaryInvocations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the endpoint contract only exists after the group path
		// is joined, so a single stricter type cannot describe both shapes.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof leverEndpointSchemas;
				const contract = leverEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				const { input: inputSchema, output: outputSchema } = contract;
				if (!inputSchema || !outputSchema) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				const input = inputCandidates.find(
					(candidate) => inputSchema.safeParse(candidate).success,
				);
				if (!input) throw new Error(`No valid test input for ${path}`);
				const output = outputFor(path);
				expect(outputSchema.safeParse(output).success).toBe(true);
				request.mockResolvedValue(output);
				// unknown: the walker cannot narrow a function leaf's parameter
				// types; the endpoint schemas validate the actual input/output.
				const result = await (
					value as (context: unknown, args: unknown) => Promise<unknown>
				)(ctx, input);
				if (path.endsWith('.download')) {
					binaryInvocations += 1;
					expect(result).toEqual({
						data: 'cGRmLWJ5dGVz',
						contentType: 'application/pdf',
					});
					return;
				}
				expect(result).toEqual(output);
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(Object.keys(leverEndpointSchemas).length);
		expect(request).toHaveBeenCalledTimes(
			invokedOperations - binaryInvocations,
		);
		expect(binaryRequest).toHaveBeenCalledTimes(binaryInvocations);
	});
});
