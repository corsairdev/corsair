import { salesforce } from './index';

jest.mock('./client', () => ({
	SALESFORCE_API_VERSION: '60.0',
	SALESFORCE_LOGIN_HOST: 'https://login.salesforce.com',
	discoverSalesforceInstanceUrl: jest.fn(
		async () => 'https://example.my.salesforce.com',
	),
	makeSalesforceRequest: jest.fn(
		async (endpoint: string, _apiKey: string, options: any) => {
			if (endpoint.includes('tree')) {
				return { hasErrors: false, results: [] };
			}
			if (endpoint.includes('quickActions')) {
				return { success: true, recordId: 'rec_123' };
			}
			if (endpoint.includes('Account')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'acc_123',
					Id: 'acc_123',
					Name: 'Acme Corp',
					totalSize: 1,
					done: true,
					records: [{ Id: 'acc_123', Name: 'Acme Corp' }],
				};
			}
			if (endpoint.includes('Contact')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'con_123',
					Id: 'con_123',
					LastName: 'Doe',
					totalSize: 1,
					done: true,
					records: [{ Id: 'con_123', LastName: 'Doe' }],
				};
			}
			if (endpoint.includes('Lead')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'lead_123',
					Id: 'lead_123',
					LastName: 'Smith',
					totalSize: 1,
					done: true,
					records: [{ Id: 'lead_123' }],
				};
			}
			if (endpoint.includes('Opportunity')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'opp_123',
					Id: 'opp_123',
					Name: 'Big Deal',
					totalSize: 1,
					done: true,
					records: [{ Id: 'opp_123' }],
				};
			}
			if (endpoint.includes('Campaign')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'camp_123',
					Id: 'camp_123',
					Name: 'Q1 Campaign',
					totalSize: 1,
					done: true,
					records: [{ Id: 'camp_123' }],
				};
			}
			if (endpoint.includes('Note')) {
				if (options?.method === 'DELETE') return { success: true };
				return {
					id: 'note_123',
					Id: 'note_123',
					Title: 'Memo',
					records: [{ Id: 'note_123' }],
				};
			}
			if (endpoint.includes('Task')) {
				return { id: 'task_123' };
			}
			if (endpoint.includes('jobs')) {
				return {
					id: 'job_123',
					state: 'UploadComplete',
					records: [],
					data: 'csv_data',
				};
			}
			if (endpoint.includes('query') || endpoint.includes('search')) {
				return {
					totalSize: 1,
					done: true,
					records: [{ Id: 'rec_1' }],
					searchRecords: [{ Id: 'rec_1' }],
				};
			}
			if (endpoint.includes('composite')) {
				return { hasErrors: false, results: [], graphs: [], records: [] };
			}
			if (endpoint.includes('VersionData')) {
				return Buffer.from('sample content');
			}
			if (
				endpoint.includes('ContentVersion') ||
				endpoint.includes('ContentDocument')
			) {
				if (options?.method === 'DELETE') return { success: true };
				return { content: 'sample content', fileId: 'doc_123', shares: [] };
			}
			if (endpoint.includes('analytics') || endpoint.includes('wave')) {
				return { dashboards: [], reports: [], templates: [] };
			}
			return {
				success: true,
				id: 'res_123',
				Id: 'res_123',
				records: [],
				actions: [],
				sObjects: [],
			};
		},
	),
}));

describe('Salesforce Plugin API', () => {
	const plugin = salesforce({ key: 'test_token' });
	const endpoints = plugin.endpoints!;
	const ctx = {
		key: 'test_token',
		authType: 'api_key' as const,
		options: {
			key: 'test_token',
			instanceUrl: 'https://example.my.salesforce.com',
		},
		$getAccountId: () => 'acc_test',
	} as any;

	describe('Accounts', () => {
		it('updates account', async () => {
			const res = await endpoints.accounts.updateAccount(ctx, {
				id: 'acc_123',
				Name: 'Acme Updated',
			});
			expect(res.success).toBe(true);
		});

		it('creates account', async () => {
			const res = await endpoints.accounts.createAccount(ctx, { Name: 'Acme' });
			expect(res).toBeDefined();
			expect(res.id).toBe('acc_123');
		});

		it('gets account', async () => {
			const res = await endpoints.accounts.getAccount(ctx, { id: 'acc_123' });
			expect(res.Id).toBe('acc_123');
		});

		it('lists accounts', async () => {
			const res = await endpoints.accounts.listAccounts(ctx, { limit: 10 });
			expect(res.records).toHaveLength(1);
		});

		it('searches accounts', async () => {
			const res = await endpoints.accounts.searchAccounts(ctx, {
				name: 'Acme',
			});
			expect(res.records).toBeDefined();
		});

		it('deletes account', async () => {
			const res = await endpoints.accounts.deleteAccount(ctx, {
				id: 'acc_123',
			});
			expect(res.success).toBe(true);
		});

		it('handles deprecated account endpoints', async () => {
			const createRes =
				await endpoints.accounts.accountCreationWithContentTypeOption(ctx, {
					Name: 'Acme',
				});
			expect(createRes.id).toBeDefined();

			const fetchRes = await endpoints.accounts.fetchAccountByIdWithQuery(ctx, {
				id: 'acc_123',
			});
			expect(fetchRes.Id).toBe('acc_123');

			const removeRes =
				await endpoints.accounts.removeAccountByUniqueIdentifier(ctx, {
					id: 'acc_123',
				});
			expect(removeRes.success).toBe(true);

			const retrieveRes =
				await endpoints.accounts.retrieveAccountDataAndErrorResponses(ctx, {
					id: 'acc_123',
				});
			expect(retrieveRes.objectDescribe).toBeDefined();
		});
	});

	describe('Contacts', () => {
		it('creates contact', async () => {
			const res = await endpoints.contacts.createContact(ctx, {
				LastName: 'Doe',
			});
			expect(res.id).toBe('con_123');
		});

		it('gets contact', async () => {
			const res = await endpoints.contacts.getContact(ctx, { id: 'con_123' });
			expect(res.Id).toBe('con_123');
		});

		it('lists contacts', async () => {
			const res = await endpoints.contacts.listContacts(ctx, {});
			expect(res.records).toHaveLength(1);
		});

		it('deletes contact', async () => {
			const res = await endpoints.contacts.deleteContact(ctx, {
				id: 'con_123',
			});
			expect(res.success).toBe(true);
		});

		it('associates contact to account', async () => {
			const res = await endpoints.contacts.associateContactToAccount(ctx, {
				contactId: 'con_123',
				accountId: 'acc_123',
			});
			expect(res.success).toBe(true);
		});

		it('handles deprecated contact endpoints', async () => {
			const createRes = await endpoints.contacts.createNewContactWithJsonHeader(
				ctx,
				{ LastName: 'Doe' },
			);
			expect(createRes.id).toBeDefined();

			const queryRes = await endpoints.contacts.queryContactsByName(ctx, {
				name: 'Doe',
			});
			expect(queryRes.records).toBeDefined();

			const removeRes = await endpoints.contacts.removeASpecificContactById(
				ctx,
				{ id: 'con_123' },
			);
			expect(removeRes.success).toBe(true);

			const retrieveRes =
				await endpoints.contacts.retrieveContactInfoWithStandardResponses(ctx, {
					id: 'con_123',
				});
			expect(retrieveRes.metadata).toBeDefined();

			const getByIdRes = await endpoints.contacts.getContactById(ctx, {
				id: 'con_123',
			});
			expect(getByIdRes.Id).toBe('con_123');
		});
	});

	describe('Leads', () => {
		it('creates lead', async () => {
			const res = await endpoints.leads.createLead(ctx, {
				LastName: 'Smith',
				Company: 'Corp',
			});
			expect(res.id).toBe('lead_123');
		});

		it('gets lead', async () => {
			const res = await endpoints.leads.getLead(ctx, { id: 'lead_123' });
			expect(res.Id).toBe('lead_123');
		});

		it('lists leads', async () => {
			const res = await endpoints.leads.listLeads(ctx, {});
			expect(res.records).toHaveLength(1);
		});

		it('deletes lead', async () => {
			const res = await endpoints.leads.deleteLead(ctx, { id: 'lead_123' });
			expect(res.success).toBe(true);
		});

		it('applies lead assignment rules', async () => {
			const res = await endpoints.leads.applyLeadAssignmentRules(ctx, {
				leadId: 'lead_123',
			});
			expect(res.success).toBe(true);
		});

		it('handles deprecated lead endpoints', async () => {
			const createRes =
				await endpoints.leads.createLeadWithSpecifiedContentType(ctx, {
					LastName: 'Smith',
					Company: 'Corp',
				});
			expect(createRes.id).toBeDefined();

			const delRes = await endpoints.leads.deleteALeadObjectByItsId(ctx, {
				id: 'lead_123',
			});
			expect(delRes.success).toBe(true);

			const retrieveByIdRes = await endpoints.leads.retrieveLeadById(ctx, {
				id: 'lead_123',
			});
			expect(retrieveByIdRes.Id).toBe('lead_123');

			const retrieveDataRes =
				await endpoints.leads.retrieveLeadDataWithVariousResponses(ctx, {
					id: 'lead_123',
				});
			expect(retrieveDataRes.records).toBeDefined();
		});
	});

	describe('Opportunities', () => {
		it('creates opportunity', async () => {
			const res = await endpoints.opportunities.createOpportunity(ctx, {
				Name: 'Deal',
				StageName: 'Prospecting',
				CloseDate: '2026-12-31',
			});
			expect(res.id).toBe('opp_123');
		});

		it('gets opportunity', async () => {
			const res = await endpoints.opportunities.getOpportunity(ctx, {
				id: 'opp_123',
			});
			expect(res.Id).toBe('opp_123');
		});

		it('lists opportunities', async () => {
			const res = await endpoints.opportunities.listOpportunities(ctx, {});
			expect(res.records).toHaveLength(1);
		});

		it('deletes opportunity', async () => {
			const res = await endpoints.opportunities.deleteOpportunity(ctx, {
				id: 'opp_123',
			});
			expect(res.success).toBe(true);
		});

		it('adds line item to opportunity', async () => {
			const res = await endpoints.opportunities.addOpportunityLineItem(ctx, {
				OpportunityId: 'opp_123',
				PricebookEntryId: 'pbe_123',
				Quantity: 2,
			});
			expect(res.id).toBeDefined();
		});

		it('clones opportunity with products', async () => {
			const res = await endpoints.opportunities.cloneOpportunityWithProducts(
				ctx,
				{
					opportunityId: 'opp_123',
					cloneProducts: true,
				},
			);
			expect(res.id).toBeDefined();
		});

		it('lists pricebook entries & pricebooks', async () => {
			const pbe = await endpoints.opportunities.listPricebookEntries(ctx, {});
			expect(pbe.records).toBeDefined();
			const pb = await endpoints.opportunities.listPricebooks(ctx, {});
			expect(pb.records).toBeDefined();
		});

		it('handles deprecated opportunity endpoints', async () => {
			const createRes = await endpoints.opportunities.createOpportunityRecord(
				ctx,
				{
					Name: 'Deal',
					StageName: 'Prospecting',
					CloseDate: '2026-12-31',
				},
			);
			expect(createRes.id).toBeDefined();

			const remRes = await endpoints.opportunities.removeOpportunityById(ctx, {
				id: 'opp_123',
			});
			expect(remRes.success).toBe(true);

			const retDataRes =
				await endpoints.opportunities.retrieveOpportunitiesData(ctx, {});
			expect(retDataRes.records).toBeDefined();

			const retByIdRes =
				await endpoints.opportunities.retrieveOpportunityByIdWithOptionalFields(
					ctx,
					{ id: 'opp_123' },
				);
			expect(retByIdRes.Id).toBe('opp_123');
		});
	});

	describe('Campaigns', () => {
		it('creates campaign', async () => {
			const res = await endpoints.campaigns.createCampaign(ctx, {
				Name: 'Spring Promo',
			});
			expect(res.id).toBe('camp_123');
		});

		it('gets campaign', async () => {
			const res = await endpoints.campaigns.getCampaign(ctx, {
				id: 'camp_123',
			});
			expect(res.Id).toBe('camp_123');
		});

		it('lists campaigns', async () => {
			const res = await endpoints.campaigns.listCampaigns(ctx, {});
			expect(res.records).toHaveLength(1);
		});

		it('deletes campaign', async () => {
			const res = await endpoints.campaigns.deleteCampaign(ctx, {
				id: 'camp_123',
			});
			expect(res.success).toBe(true);
		});

		it('adds contact & lead to campaign and removes', async () => {
			const addCon = await endpoints.campaigns.addContactToCampaign(ctx, {
				campaignId: 'camp_123',
				contactId: 'con_123',
			});
			expect(addCon.id).toBeDefined();

			const addLd = await endpoints.campaigns.addLeadToCampaign(ctx, {
				campaign_id: 'camp_123',
				lead_id: 'lead_123',
			});
			expect(addLd.id).toBeDefined();

			const rem = await endpoints.campaigns.removeFromCampaign(ctx, {
				campaign_member_id: 'cm_123',
			});
			expect(rem.success).toBe(true);
		});

		it('searches campaigns and deprecated endpoints', async () => {
			const searchRes = await endpoints.campaigns.searchCampaigns(ctx, {
				name: 'Spring',
			});
			expect(searchRes.records).toBeDefined();

			const createPostRes =
				await endpoints.campaigns.createCampaignRecordViaPost(ctx, {
					Name: 'Campaign',
				});
			expect(createPostRes.id).toBeDefined();

			const remObjRes = await endpoints.campaigns.removeCampaignObjectById(
				ctx,
				{ id: 'camp_123' },
			);
			expect(remObjRes.success).toBe(true);

			const retErrRes =
				await endpoints.campaigns.retrieveCampaignDataWithErrorHandling(ctx, {
					id: 'camp_123',
				});
			expect(retErrRes.metadata).toBeDefined();

			const retSpecRes =
				await endpoints.campaigns.retrieveSpecificCampaignObjectDetails(ctx, {
					id: 'camp_123',
				});
			expect(retSpecRes.Id).toBe('camp_123');
		});
	});

	describe('Notes, Tasks, Jobs, SOQL/SOSL, Composite, Metadata, UI API, Files, Analytics', () => {
		it('handles notes', async () => {
			const cNote = await endpoints.notes.createNote(ctx, { Title: 'Note 1' });
			expect(cNote.id).toBe('note_123');

			const gNote = await endpoints.notes.getNote(ctx, { id: 'note_123' });
			expect(gNote.Id).toBe('note_123');

			const lNotes = await endpoints.notes.listNotes(ctx, {});
			expect(lNotes.records).toBeDefined();

			const dNote = await endpoints.notes.deleteNote(ctx, { id: 'note_123' });
			expect(dNote.success).toBe(true);

			const cNoteDep =
				await endpoints.notes.createNoteRecordWithContentTypeHeader(ctx, {
					Title: 'Note',
					ParentId: 'acc_123',
				});
			expect(cNoteDep.id).toBeDefined();

			const rNoteDep = await endpoints.notes.removeNoteObjectById(ctx, {
				id: 'note_123',
			});
			expect(rNoteDep.success).toBe(true);

			const gNoteFields = await endpoints.notes.getNoteByIdWithFields(ctx, {
				id: 'note_123',
			});
			expect(gNoteFields.Id).toBe('note_123');

			const retInfo = await endpoints.notes.retrieveNoteObjectInformation(ctx, {
				id: 'note_123',
			});
			expect(retInfo.metadata).toBeDefined();
		});

		it('handles tasks', async () => {
			const cTask = await endpoints.tasks.createTask(ctx, {
				Subject: 'Follow up',
			});
			expect(cTask.id).toBe('task_123');

			const compTask = await endpoints.tasks.completeTask(ctx, {
				taskId: 'task_123',
			});
			expect(compTask.success).toBe(true);

			const logC = await endpoints.tasks.logCall(ctx, {
				Subject: 'Discovery Call',
			});
			expect(logC.id).toBe('task_123');

			const logE = await endpoints.tasks.logEmailActivity(ctx, {
				Subject: 'Intro Email',
			});
			expect(logE.id).toBeDefined();

			const updated = await endpoints.tasks.updateTask(ctx, {
				id: 'task_123',
				Status: 'In Progress',
			});
			expect(updated.success).toBe(true);

			const searched = await endpoints.tasks.searchTasks(ctx, {
				subject: 'Follow',
			});
			expect(searched.records).toBeDefined();

			const sent = await endpoints.tasks.sendEmail(ctx, {
				toAddresses: ['a@example.com'],
				subject: 'Hi',
				body: 'Hello',
			});
			expect(sent.result).toBeDefined();
		});

		it('handles bulk jobs', async () => {
			const closeRes = await endpoints.jobs.closeOrAbortJob(ctx, {
				jobId: 'job_123',
				state: 'UploadComplete',
			});
			expect(closeRes.id).toBe('job_123');

			const delQ = await endpoints.jobs.deleteJobQuery(ctx, {
				jobId: 'job_123',
			});
			expect(delQ.success).toBe(true);

			const failedR = await endpoints.jobs.getJobFailedRecordResults(ctx, {
				jobId: 'job_123',
			});
			expect(failedR.records).toBeDefined();

			const qInfo = await endpoints.jobs.getQueryJobInfo(ctx, {
				jobId: 'job_123',
			});
			expect(qInfo.id).toBe('job_123');

			const qRes = await endpoints.jobs.getQueryJobResults(ctx, {
				jobId: 'job_123',
			});
			expect(qRes.data).toBeDefined();

			const succR = await endpoints.jobs.getJobSuccessfulRecordResults(ctx, {
				jobId: 'job_123',
			});
			expect(succR.records).toBeDefined();

			const unprocR = await endpoints.jobs.getJobUnprocessedRecordResults(ctx, {
				jobId: 'job_123',
			});
			expect(unprocR.records).toBeDefined();

			const uploaded = await endpoints.jobs.uploadJobData(ctx, {
				jobId: 'job_123',
				csv: 'Name\nAcme',
			});
			expect(uploaded.success).toBe(true);
		});

		it('handles SOQL and SOSL queries', async () => {
			const runSoql = await endpoints.soqlSosl.runSoqlQuery(ctx, {
				q: 'SELECT Id FROM Account',
			});
			expect(runSoql.records).toBeDefined();

			const qAll = await endpoints.soqlSosl.queryAll(ctx, {
				q: 'SELECT Id FROM Account',
			});
			expect(qAll.records).toBeDefined();

			const srch = await endpoints.soqlSosl.search(ctx, { q: 'FIND {Acme}' });
			expect(srch.searchRecords).toBeDefined();

			const sosl = await endpoints.soqlSosl.executeSoslSearch(ctx, {
				q: 'FIND {Acme}',
			});
			expect(sosl.searchRecords).toBeDefined();

			const toolQ = await endpoints.soqlSosl.toolingQuery(ctx, {
				q: 'SELECT Id FROM ApexClass',
			});
			expect(toolQ.records).toBeDefined();

			const paramSearch = await endpoints.soqlSosl.parameterizedSearch(ctx, {
				q: 'Acme',
			});
			expect(paramSearch.searchRecords).toBeDefined();

			const postParamSearch = await endpoints.soqlSosl.postParameterizedSearch(
				ctx,
				{ q: 'Acme' },
			);
			expect(postParamSearch.searchRecords).toBeDefined();

			const searchLayout = await endpoints.soqlSosl.getSearchLayout(ctx, {
				sobjects: 'Account',
			});
			expect(searchLayout).toBeDefined();

			const qDep = await endpoints.soqlSosl.query(ctx, {
				q: 'SELECT Id FROM Account',
			});
			expect(qDep.records).toBeDefined();

			const execSoqlDep = await endpoints.soqlSosl.executeSoqlQuery(ctx, {
				q: 'SELECT Id FROM Account',
			});
			expect(execSoqlDep.records).toBeDefined();
		});

		it('handles composite operations', async () => {
			const postComp = await endpoints.composite.postCompositeSobjects(ctx, {
				records: [{ attributes: { type: 'Account' }, Name: 'Acme' }],
			});
			expect(postComp).toBeDefined();

			const tree = await endpoints.composite.createSobjectTree(ctx, {
				sobject: 'Account',
				records: [],
			});
			expect(tree.hasErrors).toBe(false);

			const delColl = await endpoints.composite.deleteSobjectCollections(ctx, {
				ids: ['acc_1'],
			});
			expect(delColl).toBeDefined();

			const postGraph = await endpoints.composite.postCompositeGraph(ctx, {
				graphs: [],
			});
			expect(postGraph.graphs).toBeDefined();

			const graphActDep = await endpoints.composite.compositeGraphAction(ctx, {
				graphs: [],
			});
			expect(graphActDep.graphs).toBeDefined();

			const batchRec = await endpoints.composite.getABatchOfRecords(ctx, {
				ids: ['acc_1'],
			});
			expect(batchRec.results).toBeDefined();

			const compRes = await endpoints.composite.getCompositeResources(ctx, {});
			expect(compRes).toBeDefined();

			const compSob = await endpoints.composite.getCompositeSobjects(ctx, {
				ids: ['acc_1'],
			});
			expect(compSob).toBeDefined();

			const sobColl = await endpoints.composite.getSobjectCollections(ctx, {
				ids: ['acc_1'],
			});
			expect(sobColl).toBeDefined();
		});

		it('handles files', async () => {
			const content = await endpoints.files.getFileContent(ctx, {
				fileId: 'doc_123',
			});
			expect(content.content).toBeDefined();

			const info = await endpoints.files.getFileInformation(ctx, {
				fileId: 'doc_123',
			});
			expect(info.fileId).toBe('doc_123');

			const shares = await endpoints.files.getFileShares(ctx, {
				fileId: 'doc_123',
			});
			expect(shares.shares).toBeDefined();

			const delF = await endpoints.files.deleteFile(ctx, { fileId: 'doc_123' });
			expect(delF.success).toBe(true);

			const uploaded = await endpoints.files.uploadFile(ctx, {
				title: 'notes.txt',
				versionData: 'aGVsbG8=',
			});
			expect(uploaded).toBeDefined();
		});

		it('handles analytics and reports', async () => {
			const dash = await endpoints.analyticsReports.getDashboard(ctx, {
				dashboardId: 'dash_123',
			});
			expect(dash).toBeDefined();

			const listD = await endpoints.analyticsReports.listDashboards(ctx, {});
			expect(listD.dashboards).toBeDefined();

			const listET = await endpoints.analyticsReports.listEmailTemplates(
				ctx,
				{},
			);
			expect(listET.templates).toBeDefined();

			const listR = await endpoints.analyticsReports.listReports(ctx, {});
			expect(listR.reports).toBeDefined();

			const runR = await endpoints.analyticsReports.runReport(ctx, {
				reportId: 'rep_123',
			});
			expect(runR).toBeDefined();

			const listAT = await endpoints.analyticsReports.listAnalyticsTemplates(
				ctx,
				{},
			);
			expect(listAT.templates).toBeDefined();

			const getRI = await endpoints.analyticsReports.getReportInstance(ctx, {
				reportId: 'rep_123',
				instanceId: 'inst_123',
			});
			expect(getRI).toBeDefined();

			const getR = await endpoints.analyticsReports.getReport(ctx, {
				reportId: 'rep_123',
			});
			expect(getR).toBeDefined();

			const qR = await endpoints.analyticsReports.queryReport(ctx, {
				id: 'rep_123',
			});
			expect(qR).toBeDefined();
		});

		it('handles metadata operations', async () => {
			const cSob = await endpoints.metadata.createSObjectRecord(ctx, {
				sobject: 'Account',
				fields: { Name: 'Test' },
			});
			expect(cSob.id).toBeDefined();

			const cloneR = await endpoints.metadata.cloneRecord(ctx, {
				sobject: 'Account',
				recordId: 'acc_123',
			});
			expect(cloneR.id).toBeDefined();

			const cField = await endpoints.metadata.createCustomField(ctx, {
				sobject: 'Account',
				developerName: 'Custom',
				label: 'Custom',
				type: 'Text',
			});
			expect(cField.id).toBeDefined();

			const cObj = await endpoints.metadata.createCustomObject(ctx, {
				developerName: 'Custom',
				label: 'Custom',
				pluralLabel: 'Customs',
			});
			expect(cObj.id).toBeDefined();

			const dSob = await endpoints.metadata.deleteSobject(ctx, {
				sobject: 'Account',
				id: 'acc_123',
			});
			expect(dSob.success).toBe(true);

			const dRows = await endpoints.metadata.deleteSobjectRows(ctx, {
				sobject: 'Account',
				id: 'acc_123',
			});
			expect(dRows.success).toBe(true);

			const getSobs = await endpoints.metadata.getSobjects(ctx, {});
			expect(getSobs).toBeDefined();

			const execQA = await endpoints.metadata.executeSobjectQuickAction(ctx, {
				sobject: 'Account',
				actionName: 'NewContact',
			});
			expect(execQA.success).toBe(true);

			const orgLimits = await endpoints.metadata.getOrgLimits(ctx, {});
			expect(orgLimits).toBeDefined();

			const userInfo = await endpoints.metadata.getUserInfo(ctx, {});
			expect(userInfo).toBeDefined();

			const massXfer = await endpoints.metadata.massTransferOwnership(ctx, {
				sobject: 'Account',
				fromUserId: 'u1',
				toUserId: 'u2',
			});
			expect(massXfer.success).toBe(true);
		});
	});
});
