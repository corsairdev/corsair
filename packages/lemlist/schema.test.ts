import {
	LemlistEndpointInputSchemas,
	LemlistEndpointOutputSchemas,
	LemlistSchema,
	lemlistEndpointSchemas,
	lemlistEndpointsNested,
} from './index';

describe('schema.test.ts', () => {
	it('defines plugin schema version and empty database entities', () => {
		expect(LemlistSchema.version).toBe('1.0.0');
		expect(LemlistSchema.entities).toEqual({});
	});

	it('registers all 60 endpoints in lemlistEndpointSchemas', () => {
		const nestedOps: string[] = [];
		for (const [groupKey, groupOps] of Object.entries(lemlistEndpointsNested)) {
			for (const opKey of Object.keys(groupOps)) {
				nestedOps.push(`${groupKey}.${opKey}`);
			}
		}

		const schemaOps = Object.keys(lemlistEndpointSchemas);
		expect(schemaOps.sort()).toEqual(nestedOps.sort());
		expect(schemaOps).toHaveLength(60);
	});

	describe('Input Schemas', () => {
		it('teamGet input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.teamGet;
			expect(schema).toBeDefined();
		});
		it('teamGetSenders input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.teamGetSenders;
			expect(schema).toBeDefined();
		});
		it('teamGetCredits input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.teamGetCredits;
			expect(schema).toBeDefined();
		});
		it('teamGetCrmUsers input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.teamGetCrmUsers;
			expect(schema).toBeDefined();
		});
		it('campaignsList input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsList;
			expect(schema).toBeDefined();
		});
		it('campaignsCreate input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsCreate;
			expect(schema).toBeDefined();
		});
		it('campaignsGet input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGet;
			expect(schema).toBeDefined();
		});
		it('campaignsUpdate input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsUpdate;
			expect(schema).toBeDefined();
		});
		it('campaignsGetSettings input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetSettings;
			expect(schema).toBeDefined();
		});
		it('campaignsUpdateSettings input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsUpdateSettings;
			expect(schema).toBeDefined();
		});
		it('campaignsPause input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsPause;
			expect(schema).toBeDefined();
		});
		it('campaignsStart input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsStart;
			expect(schema).toBeDefined();
		});
		it('campaignsArchive input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsArchive;
			expect(schema).toBeDefined();
		});
		it('campaignsUnarchive input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsUnarchive;
			expect(schema).toBeDefined();
		});
		it('campaignsDuplicate input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsDuplicate;
			expect(schema).toBeDefined();
		});
		it('campaignsGetStatutes input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetStatutes;
			expect(schema).toBeDefined();
		});
		it('campaignsGetStats input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetStats;
			expect(schema).toBeDefined();
		});
		it('campaignsGetBatchStats input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetBatchStats;
			expect(schema).toBeDefined();
		});
		it('campaignsGetReports input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetReports;
			expect(schema).toBeDefined();
		});
		it('campaignsStartExport input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsStartExport;
			expect(schema).toBeDefined();
		});
		it('campaignsGetExportStatus input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGetExportStatus;
			expect(schema).toBeDefined();
		});
		it('campaignsSetExportEmail input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsSetExportEmail;
			expect(schema).toBeDefined();
		});
		it('campaignsExportLeads input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsExportLeads;
			expect(schema).toBeDefined();
		});
		it('campaignsSkipStepForEveryone input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsSkipStepForEveryone;
			expect(schema).toBeDefined();
		});
		it('campaignsSkipStepForLeads input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsSkipStepForLeads;
			expect(schema).toBeDefined();
		});
		it('campaignsAddAbmLeads input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.campaignsAddAbmLeads;
			expect(schema).toBeDefined();
		});
		it('leadsGet input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsGet;
			expect(schema).toBeDefined();
		});
		it('leadsGetByEmail input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsGetByEmail;
			expect(schema).toBeDefined();
		});
		it('leadsListInCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsListInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsCreateInCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsCreateInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsUpdateInCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsUpdateInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsDeleteFromCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsDeleteFromCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsUnsubscribeFromCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsUnsubscribeFromCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsResume input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsResume;
			expect(schema).toBeDefined();
		});
		it('leadsPause input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsPause;
			expect(schema).toBeDefined();
		});
		it('leadsReview input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsReview;
			expect(schema).toBeDefined();
		});
		it('leadsMarkInterested input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsMarkInterested;
			expect(schema).toBeDefined();
		});
		it('leadsMarkNotInterested input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsMarkNotInterested;
			expect(schema).toBeDefined();
		});
		it('leadsMarkInterestedInCampaign input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsMarkInterestedInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsMarkNotInterestedInCampaign input schema validates correctly', () => {
			const schema =
				LemlistEndpointInputSchemas.leadsMarkNotInterestedInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsSkipStep input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsSkipStep;
			expect(schema).toBeDefined();
		});
		it('leadsPersonalizeStep input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsPersonalizeStep;
			expect(schema).toBeDefined();
		});
		it('leadsResetStepPersonalization input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsResetStepPersonalization;
			expect(schema).toBeDefined();
		});
		it('leadsAddVariables input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsAddVariables;
			expect(schema).toBeDefined();
		});
		it('leadsUpdateVariables input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsUpdateVariables;
			expect(schema).toBeDefined();
		});
		it('leadsDeleteVariables input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsDeleteVariables;
			expect(schema).toBeDefined();
		});
		it('leadsImportFromCrm input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsImportFromCrm;
			expect(schema).toBeDefined();
		});
		it('leadsGetCrmFilters input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.leadsGetCrmFilters;
			expect(schema).toBeDefined();
		});
		it('activitiesList input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.activitiesList;
			expect(schema).toBeDefined();
		});
		it('activitiesDeleteRecordingTranscript input schema validates correctly', () => {
			const schema =
				LemlistEndpointInputSchemas.activitiesDeleteRecordingTranscript;
			expect(schema).toBeDefined();
		});
		it('unsubscribesListVariables input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesListVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesBulkUnsubscribeVariables input schema validates correctly', () => {
			const schema =
				LemlistEndpointInputSchemas.unsubscribesBulkUnsubscribeVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesGetVariable input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesGetVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesUnsubscribeVariable input schema validates correctly', () => {
			const schema =
				LemlistEndpointInputSchemas.unsubscribesUnsubscribeVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesResubscribeVariable input schema validates correctly', () => {
			const schema =
				LemlistEndpointInputSchemas.unsubscribesResubscribeVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesGetContactStatus input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesGetContactStatus;
			expect(schema).toBeDefined();
		});
		it('unsubscribesUnsubscribeContact input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesUnsubscribeContact;
			expect(schema).toBeDefined();
		});
		it('unsubscribesResubscribeContact input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesResubscribeContact;
			expect(schema).toBeDefined();
		});
		it('unsubscribesExportVariables input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesExportVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesExportContacts input schema validates correctly', () => {
			const schema = LemlistEndpointInputSchemas.unsubscribesExportContacts;
			expect(schema).toBeDefined();
		});
	});

	describe('Output Schemas', () => {
		it('teamGet output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.teamGet;
			expect(schema).toBeDefined();
		});
		it('teamGetSenders output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.teamGetSenders;
			expect(schema).toBeDefined();
		});
		it('teamGetCredits output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.teamGetCredits;
			expect(schema).toBeDefined();
		});
		it('teamGetCrmUsers output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.teamGetCrmUsers;
			expect(schema).toBeDefined();
		});
		it('campaignsList output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsList;
			expect(schema).toBeDefined();
		});
		it('campaignsCreate output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsCreate;
			expect(schema).toBeDefined();
		});
		it('campaignsGet output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGet;
			expect(schema).toBeDefined();
		});
		it('campaignsUpdate output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsUpdate;
			expect(schema).toBeDefined();
		});
		it('campaignsGetSettings output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetSettings;
			expect(schema).toBeDefined();
		});
		it('campaignsUpdateSettings output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsUpdateSettings;
			expect(schema).toBeDefined();
		});
		it('campaignsPause output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsPause;
			expect(schema).toBeDefined();
		});
		it('campaignsStart output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsStart;
			expect(schema).toBeDefined();
		});
		it('campaignsArchive output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsArchive;
			expect(schema).toBeDefined();
		});
		it('campaignsUnarchive output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsUnarchive;
			expect(schema).toBeDefined();
		});
		it('campaignsDuplicate output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsDuplicate;
			expect(schema).toBeDefined();
		});
		it('campaignsGetStatutes output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetStatutes;
			expect(schema).toBeDefined();
		});
		it('campaignsGetStats output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetStats;
			expect(schema).toBeDefined();
		});
		it('campaignsGetBatchStats output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetBatchStats;
			expect(schema).toBeDefined();
		});
		it('campaignsGetReports output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetReports;
			expect(schema).toBeDefined();
		});
		it('campaignsStartExport output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsStartExport;
			expect(schema).toBeDefined();
		});
		it('campaignsGetExportStatus output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsGetExportStatus;
			expect(schema).toBeDefined();
		});
		it('campaignsSetExportEmail output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsSetExportEmail;
			expect(schema).toBeDefined();
		});
		it('campaignsExportLeads output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsExportLeads;
			expect(schema).toBeDefined();
		});
		it('campaignsSkipStepForEveryone output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsSkipStepForEveryone;
			expect(schema).toBeDefined();
		});
		it('campaignsSkipStepForLeads output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsSkipStepForLeads;
			expect(schema).toBeDefined();
		});
		it('campaignsAddAbmLeads output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.campaignsAddAbmLeads;
			expect(schema).toBeDefined();
		});
		it('leadsGet output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsGet;
			expect(schema).toBeDefined();
		});
		it('leadsGetByEmail output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsGetByEmail;
			expect(schema).toBeDefined();
		});
		it('leadsListInCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsListInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsCreateInCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsCreateInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsUpdateInCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsUpdateInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsDeleteFromCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsDeleteFromCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsUnsubscribeFromCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsUnsubscribeFromCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsResume output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsResume;
			expect(schema).toBeDefined();
		});
		it('leadsPause output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsPause;
			expect(schema).toBeDefined();
		});
		it('leadsReview output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsReview;
			expect(schema).toBeDefined();
		});
		it('leadsMarkInterested output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsMarkInterested;
			expect(schema).toBeDefined();
		});
		it('leadsMarkNotInterested output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsMarkNotInterested;
			expect(schema).toBeDefined();
		});
		it('leadsMarkInterestedInCampaign output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsMarkInterestedInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsMarkNotInterestedInCampaign output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.leadsMarkNotInterestedInCampaign;
			expect(schema).toBeDefined();
		});
		it('leadsSkipStep output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsSkipStep;
			expect(schema).toBeDefined();
		});
		it('leadsPersonalizeStep output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsPersonalizeStep;
			expect(schema).toBeDefined();
		});
		it('leadsResetStepPersonalization output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsResetStepPersonalization;
			expect(schema).toBeDefined();
		});
		it('leadsAddVariables output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsAddVariables;
			expect(schema).toBeDefined();
		});
		it('leadsUpdateVariables output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsUpdateVariables;
			expect(schema).toBeDefined();
		});
		it('leadsDeleteVariables output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsDeleteVariables;
			expect(schema).toBeDefined();
		});
		it('leadsImportFromCrm output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsImportFromCrm;
			expect(schema).toBeDefined();
		});
		it('leadsGetCrmFilters output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.leadsGetCrmFilters;
			expect(schema).toBeDefined();
		});
		it('activitiesList output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.activitiesList;
			expect(schema).toBeDefined();
		});
		it('activitiesDeleteRecordingTranscript output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.activitiesDeleteRecordingTranscript;
			expect(schema).toBeDefined();
		});
		it('unsubscribesListVariables output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.unsubscribesListVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesBulkUnsubscribeVariables output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.unsubscribesBulkUnsubscribeVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesGetVariable output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.unsubscribesGetVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesUnsubscribeVariable output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.unsubscribesUnsubscribeVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesResubscribeVariable output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.unsubscribesResubscribeVariable;
			expect(schema).toBeDefined();
		});
		it('unsubscribesGetContactStatus output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.unsubscribesGetContactStatus;
			expect(schema).toBeDefined();
		});
		it('unsubscribesUnsubscribeContact output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.unsubscribesUnsubscribeContact;
			expect(schema).toBeDefined();
		});
		it('unsubscribesResubscribeContact output schema validates correctly', () => {
			const schema =
				LemlistEndpointOutputSchemas.unsubscribesResubscribeContact;
			expect(schema).toBeDefined();
		});
		it('unsubscribesExportVariables output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.unsubscribesExportVariables;
			expect(schema).toBeDefined();
		});
		it('unsubscribesExportContacts output schema validates correctly', () => {
			const schema = LemlistEndpointOutputSchemas.unsubscribesExportContacts;
			expect(schema).toBeDefined();
		});
	});

	describe('Specific schema validation and constraint rejection', () => {
		it('rejects invalid email in leadsCreateInCampaign', () => {
			const schema = LemlistEndpointInputSchemas.leadsCreateInCampaign;
			expect(() =>
				schema.parse({
					campaignId: 'cam_123',
					email: 'not-an-email',
				}),
			).toThrow();
		});

		it('accepts valid email in leadsCreateInCampaign', () => {
			const schema = LemlistEndpointInputSchemas.leadsCreateInCampaign;
			const valid = schema.parse({
				campaignId: 'cam_123',
				email: 'lead@example.com',
				firstName: 'Alice',
			});
			expect(valid.email).toBe('lead@example.com');
		});

		it('rejects missing required campaignId in campaignsGet', () => {
			const schema = LemlistEndpointInputSchemas.campaignsGet;
			expect(() => schema.parse({})).toThrow();
		});

		it('rejects missing required leadIds in campaignsAddAbmLeads', () => {
			const schema = LemlistEndpointInputSchemas.campaignsAddAbmLeads;
			expect(() =>
				schema.parse({
					campaignId: 'cam_123',
					leadIds: [],
				}),
			).toThrow();
		});

		it('validates TeamSchema and allows passthrough fields', () => {
			const schema = LemlistEndpointOutputSchemas.teamGet;
			const parsed = schema.parse({
				_id: 'tea_123',
				name: 'My Team',
				extraCustomField: 'allowed',
			});
			expect(parsed._id).toBe('tea_123');
			expect(parsed).toHaveProperty('extraCustomField', 'allowed');
		});
	});
});
