import { logEventFromContext } from 'corsair/core';
import { makeLemlistRequest } from './client';
import { Activities, Campaigns, Leads, Team, Unsubscribes } from './endpoints';
import type { LemlistPluginContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeLemlistRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeLemlistRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

const fakeCtx = {
	key: 'test_api_key',
	endpoints: {},
	db: {},
	$getAccountId: async () => 'test-account-id',
	options: {},
	keys: {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: async () => 'test_api_key',
		get_webhook_signature: async () => null,
		set_api_key: async () => undefined,
		set_webhook_signature: async () => undefined,
	},
} satisfies LemlistPluginContext;

const routeContracts = {
	'team.get': { method: 'GET', path: '/team' },
	'team.getSenders': { method: 'GET', path: '/team/senders' },
	'team.getCredits': { method: 'GET', path: '/team/credits' },
	'team.getCrmUsers': { method: 'GET', path: '/team/crmUsers' },
	'campaigns.list': { method: 'GET', path: '/campaigns' },
	'campaigns.create': { method: 'POST', path: '/campaigns' },
	'campaigns.get': { method: 'GET', path: '/campaigns/cam_123' },
	'campaigns.update': { method: 'PATCH', path: '/campaigns/cam_123' },
	'campaigns.getSettings': {
		method: 'GET',
		path: '/campaigns/cam_123/settings',
	},
	'campaigns.updateSettings': {
		method: 'PATCH',
		path: '/campaigns/cam_123/settings',
	},
	'campaigns.pause': { method: 'POST', path: '/campaigns/cam_123/pause' },
	'campaigns.start': { method: 'POST', path: '/campaigns/cam_123/start' },
	'campaigns.archive': { method: 'POST', path: '/campaigns/cam_123/archive' },
	'campaigns.unarchive': {
		method: 'POST',
		path: '/campaigns/cam_123/unarchive',
	},
	'campaigns.duplicate': {
		method: 'POST',
		path: '/campaigns/cam_123/duplicate',
	},
	'campaigns.getStatutes': {
		method: 'GET',
		path: '/campaigns/cam_123/statutes',
	},
	'campaigns.getStats': { method: 'GET', path: '/v2/campaigns/cam_123/stats' },
	'campaigns.getBatchStats': {
		method: 'POST',
		path: '/v2/campaigns/stats/batch',
	},
	'campaigns.getReports': { method: 'GET', path: '/campaigns/reports' },
	'campaigns.startExport': {
		method: 'GET',
		path: '/campaigns/cam_123/export/start',
	},
	'campaigns.getExportStatus': {
		method: 'GET',
		path: '/campaigns/cam_123/export/exp_123/status',
	},
	'campaigns.setExportEmail': {
		method: 'PUT',
		path: '/campaigns/cam_123/export/exp_123/email/user%40example.com',
	},
	'campaigns.exportLeads': {
		method: 'GET',
		path: '/v2/campaigns/cam_123/export/leads',
	},
	'campaigns.skipStepForEveryone': {
		method: 'POST',
		path: '/campaigns/cam_123/steps/stp_123/skip',
	},
	'campaigns.skipStepForLeads': {
		method: 'POST',
		path: '/campaigns/cam_123/steps/stp_123/skip-for-leads',
	},
	'campaigns.addAbmLeads': {
		method: 'POST',
		path: '/campaigns/cam_123/abm-leads',
	},
	'leads.get': { method: 'GET', path: '/leads' },
	'leads.getByEmail': { method: 'GET', path: '/leads/john%40example.com' },
	'leads.listInCampaign': { method: 'GET', path: '/campaigns/cam_123/leads/' },
	'leads.createInCampaign': {
		method: 'POST',
		path: '/campaigns/cam_123/leads/',
	},
	'leads.updateInCampaign': {
		method: 'PATCH',
		path: '/campaigns/cam_123/leads/lea_123',
	},
	'leads.deleteFromCampaign': {
		method: 'DELETE',
		path: '/campaigns/cam_123/leads/lea_123',
	},
	'leads.unsubscribeFromCampaign': {
		method: 'DELETE',
		path: '/campaigns/cam_123/leads/john%40example.com',
	},
	'leads.resume': { method: 'POST', path: '/leads/start/lea_123' },
	'leads.pause': { method: 'POST', path: '/leads/pause/lea_123' },
	'leads.review': { method: 'POST', path: '/leads/review/lea_123' },
	'leads.markInterested': { method: 'POST', path: '/leads/interested/lea_123' },
	'leads.markNotInterested': {
		method: 'POST',
		path: '/leads/notinterested/lea_123',
	},
	'leads.markInterestedInCampaign': {
		method: 'POST',
		path: '/campaigns/cam_123/leads/lea_123/interested',
	},
	'leads.markNotInterestedInCampaign': {
		method: 'POST',
		path: '/campaigns/cam_123/leads/lea_123/notinterested',
	},
	'leads.skipStep': {
		method: 'POST',
		path: '/campaigns/cam_123/leads/lea_123/steps/stp_123/skip',
	},
	'leads.personalizeStep': {
		method: 'PUT',
		path: '/campaigns/cam_123/leads/lea_123/steps/stp_123/personalization',
	},
	'leads.resetStepPersonalization': {
		method: 'DELETE',
		path: '/campaigns/cam_123/leads/lea_123/steps/stp_123/personalization',
	},
	'leads.addVariables': { method: 'POST', path: '/leads/lea_123/variables' },
	'leads.updateVariables': {
		method: 'PATCH',
		path: '/leads/lea_123/variables',
	},
	'leads.deleteVariables': {
		method: 'DELETE',
		path: '/leads/lea_123/variables',
	},
	'leads.importFromCrm': {
		method: 'POST',
		path: '/campaigns/cam_123/leads/import',
	},
	'leads.getCrmFilters': { method: 'GET', path: '/crm/filters' },
	'activities.list': { method: 'GET', path: '/activities' },
	'activities.deleteRecordingTranscript': {
		method: 'DELETE',
		path: '/activities/act_123/recording-transcript',
	},
	'unsubscribes.listVariables': {
		method: 'GET',
		path: '/v2/unsubscribes/variables',
	},
	'unsubscribes.bulkUnsubscribeVariables': {
		method: 'POST',
		path: '/v2/unsubscribes/variables',
	},
	'unsubscribes.getVariable': {
		method: 'GET',
		path: '/v2/unsubscribes/variables/test%40example.com',
	},
	'unsubscribes.unsubscribeVariable': {
		method: 'POST',
		path: '/v2/unsubscribes/variables/test%40example.com',
	},
	'unsubscribes.resubscribeVariable': {
		method: 'DELETE',
		path: '/v2/unsubscribes/variables/test%40example.com',
	},
	'unsubscribes.getContactStatus': {
		method: 'GET',
		path: '/v2/unsubscribes/contacts/ctc_123',
	},
	'unsubscribes.unsubscribeContact': {
		method: 'POST',
		path: '/v2/unsubscribes/contacts/ctc_123',
	},
	'unsubscribes.resubscribeContact': {
		method: 'DELETE',
		path: '/v2/unsubscribes/contacts/ctc_123',
	},
	'unsubscribes.exportVariables': {
		method: 'GET',
		path: '/v2/unsubscribes/exports/variables',
	},
	'unsubscribes.exportContacts': {
		method: 'GET',
		path: '/v2/unsubscribes/exports/contacts',
	},
} as const;

async function invoke<I, R>(
	operation: keyof typeof routeContracts,
	endpoint: (ctx: LemlistPluginContext, input: I) => Promise<R>,
	input: I,
): Promise<R> {
	const result = await endpoint(fakeCtx, input);
	const contract = routeContracts[operation];
	expect(mockRequest).toHaveBeenCalledTimes(1);
	expect(mockRequest.mock.calls[0]?.[2]?.method).toBe(contract.method);
	expect(mockRequest.mock.calls[0]?.[0]).toBe(contract.path);
	return result;
}

const fakeSettings = {
	campaignId: 'cam_123',
	timezone: 'Europe/Paris',
	senderStrategy: 'random',
	general: {
		labels: [],
		sequenceId: 'seq_123',
		sequenceSharing: false,
		unsubscribeMode: 'contact',
		addUnsubscribeLink: true,
		unsubscribeLinkText: 'Unsubscribe',
	},
	senders: { espMatching: true, espRouting: null },
	automation: { autoReview: false, autoReviewConditions: [] },
	tracking: { trackOpens: true, trackClicks: true, trackReplies: true },
	onReplied: {
		createNewTask: false,
		campaignProgress: 'continue',
		propagateProgressToCompany: false,
		disableOutOfOffice: false,
	},
	onLinkClicked: {
		createNewTask: false,
		campaignProgress: 'continue',
		propagateProgressToCompany: false,
		specificLinks: [],
	},
	onMeetingBooked: {
		campaignProgress: 'continue',
		propagateProgressToCompany: false,
	},
	aiFeatures: {
		scoreReplies: false,
		onInterestedReply: {
			enabled: false,
			pauseAllCampaignsForLead: false,
			pauseCampaignForCompany: false,
			pauseAllCampaignsForCompany: false,
		},
		onNotInterestedReply: {
			enabled: false,
			pauseAllCampaignsForLead: false,
			pauseCampaignForCompany: false,
			pauseAllCampaignsForCompany: false,
		},
	},
	schedule: {
		isTimezoneBasedSchedule: false,
		timezoneBasedScheduleId: null,
		scheduleIds: ['skd_123'],
		holidayCountries: [],
	},
};

describe('endpoints.test.ts', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLogEvent.mockReset();
	});

	describe('team.get', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'tea_123', name: 'Test Team' });

			const input = { version: 'v2' } as const;
			const res = await invoke('team.get', Team.get, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.team.get');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('team.getSenders', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ userId: 'usr_123', campaigns: [] }]);

			const input = { state: 'running' } as const;
			const res = await invoke('team.getSenders', Team.getSenders, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.team.getSenders');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('team.getCredits', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ credits: 100 });

			const input = {};
			const res = await invoke('team.getCredits', Team.getCredits, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.team.getCredits');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('team.getCrmUsers', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ userId: 'usr_123', crm: 'hubspot' }]);

			const input = {};
			const res = await invoke('team.getCrmUsers', Team.getCrmUsers, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.team.getCrmUsers');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.list', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'cam_123', name: 'Camp 1' }]);

			const input = { limit: 10, offset: 0 };
			const res = await invoke('campaigns.list', Campaigns.list, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
				limit: 10,
				offset: 0,
				version: 'v2',
			});
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.list');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.create', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'cam_123', name: 'Camp 1' });

			const input = { name: 'Outreach Campaign', timezone: 'UTC' };
			const res = await invoke('campaigns.create', Campaigns.create, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual(input);
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.create');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.get', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'cam_123', name: 'Camp 1' });

			const input = { campaignId: 'cam_123' };
			const res = await invoke('campaigns.get', Campaigns.get, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.get');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.update', () => {
		it('executes PATCH request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'cam_123', name: 'Camp 1' });

			const input = { campaignId: 'cam_123', name: 'Updated Campaign' };
			const res = await invoke('campaigns.update', Campaigns.update, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PATCH');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.update');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getSettings', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue(fakeSettings);

			const input = { campaignId: 'cam_123' };
			const res = await invoke(
				'campaigns.getSettings',
				Campaigns.getSettings,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getSettings',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.updateSettings', () => {
		it('executes PATCH request and logs completed event', async () => {
			mockRequest.mockResolvedValue(fakeSettings);

			const input = { campaignId: 'cam_123', tracking: { trackOpens: true } };
			const res = await invoke(
				'campaigns.updateSettings',
				Campaigns.updateSettings,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PATCH');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.updateSettings',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.pause', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'cam_123',
				name: 'Camp 1',
				status: 'paused',
			});

			const input = { campaignId: 'cam_123' };
			const res = await invoke('campaigns.pause', Campaigns.pause, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.pause');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.start', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'cam_123',
				name: 'Camp 1',
				status: 'running',
			});

			const input = { campaignId: 'cam_123' };
			const res = await invoke('campaigns.start', Campaigns.start, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.start');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.archive', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'cam_123',
				name: 'Camp 1',
				status: 'archived',
			});

			const input = { campaignId: 'cam_123' };
			const res = await invoke('campaigns.archive', Campaigns.archive, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.campaigns.archive');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.unarchive', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'cam_123',
				name: 'Camp 1',
				status: 'paused',
			});

			const input = { campaignId: 'cam_123' };
			const res = await invoke(
				'campaigns.unarchive',
				Campaigns.unarchive,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.unarchive',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.duplicate', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'cam_copy', name: 'Camp Copy' });

			const input = { campaignId: 'cam_123', name: 'Copy Campaign' };
			const res = await invoke(
				'campaigns.duplicate',
				Campaigns.duplicate,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.duplicate',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getStatutes', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				name: 'Campaign',
				status: 'draft',
				statutes: [],
			});

			const input = { campaignId: 'cam_123' };
			const res = await invoke(
				'campaigns.getStatutes',
				Campaigns.getStatutes,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getStatutes',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getStats', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				campaignId: 'cam_123',
				sent: 50,
				opened: 20,
			});

			const input = {
				campaignId: 'cam_123',
				startDate: '2025-01-01T00:00:00Z',
				endDate: '2025-01-31T23:59:59Z',
			};
			const res = await invoke('campaigns.getStats', Campaigns.getStats, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockRequest.mock.calls[0]?.[2]?.query).toEqual({
				startDate: input.startDate,
				endDate: input.endDate,
			});
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getStats',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getBatchStats', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				results: [{ campaignId: 'cam_123', nbLeads: 50 }],
				errors: [],
			});

			const input = {
				campaignIds: ['cam_123'],
				startDate: '2025-01-01T00:00:00Z',
				endDate: '2025-01-31T23:59:59Z',
			};
			const res = await invoke(
				'campaigns.getBatchStats',
				Campaigns.getBatchStats,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getBatchStats',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getReports', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{ _id: 'cam_123', name: 'Camp 1', emailsSent: 50 },
			]);

			const input = { campaignIds: 'cam_123' };
			const res = await invoke(
				'campaigns.getReports',
				Campaigns.getReports,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getReports',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.startExport', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ id: 'exp_123', status: 'pending' });

			const input = { campaignId: 'cam_123' };
			const res = await invoke(
				'campaigns.startExport',
				Campaigns.startExport,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.startExport',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.getExportStatus', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				ok: true,
				status: { id: 'exp_123', status: 'done' },
			});

			const input = { campaignId: 'cam_123', exportId: 'exp_123' };
			const res = await invoke(
				'campaigns.getExportStatus',
				Campaigns.getExportStatus,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.getExportStatus',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.setExportEmail', () => {
		it('executes PUT request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				ok: true,
				status: { id: 'exp_123', status: 'done', email: 'user@example.com' },
			});

			const input = {
				campaignId: 'cam_123',
				exportId: 'exp_123',
				email: 'user@example.com',
			};
			const res = await invoke(
				'campaigns.setExportEmail',
				Campaigns.setExportEmail,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PUT');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.setExportEmail',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.exportLeads', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ email: 'lead@example.com' }]);

			const input = { campaignId: 'cam_123', format: 'json' } as const;
			const res = await invoke(
				'campaigns.exportLeads',
				Campaigns.exportLeads,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.exportLeads',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.skipStepForEveryone', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ skipped: true });

			const input = { campaignId: 'cam_123', stepId: 'stp_123' };
			const res = await invoke(
				'campaigns.skipStepForEveryone',
				Campaigns.skipStepForEveryone,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.skipStepForEveryone',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.skipStepForLeads', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				total: 1,
				skipped: 1,
				alreadySkipped: 0,
				notFound: [],
				results: [{ lead: 'lea_123', status: 'skipped' }],
			});

			const input = {
				campaignId: 'cam_123',
				stepId: 'stp_123',
				leads: ['lea_123'],
			};
			const res = await invoke(
				'campaigns.skipStepForLeads',
				Campaigns.skipStepForLeads,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.skipStepForLeads',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('campaigns.addAbmLeads', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				data: { addedCount: 1, alreadyInCampaignCount: 0, skipped: [] },
			});

			const input = { campaignId: 'cam_123', leadIds: ['123456'] };
			const res = await invoke(
				'campaigns.addAbmLeads',
				Campaigns.addAbmLeads,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.campaigns.addAbmLeads',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.get', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{ _id: 'lea_123', email: 'john@example.com' },
			]);

			const input = { email: 'john@example.com' };
			const res = await invoke('leads.get', Leads.get, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.get');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.getByEmail', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{ _id: 'lea_123', email: 'john@example.com' },
			]);

			const input = { email: 'john@example.com' };
			const res = await invoke('leads.getByEmail', Leads.getByEmail, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.getByEmail');
			expect(JSON.stringify(mockLogEvent.mock.calls[0]?.[2])).not.toContain(
				'john@example.com',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.listInCampaign', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{ _id: 'lea_123', email: 'john@example.com' },
			]);

			const input = { campaignId: 'cam_123' };
			const res = await invoke(
				'leads.listInCampaign',
				Leads.listInCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.listInCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.createInCampaign', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'lea_123',
				email: 'john@example.com',
			});

			const input = {
				campaignId: 'cam_123',
				email: 'john@example.com',
				firstName: 'John',
				deduplicate: true,
				updateStrategy: 'fillEmptyOnly',
			} as const;
			const res = await invoke(
				'leads.createInCampaign',
				Leads.createInCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockRequest.mock.calls[0]?.[2]?.query).toMatchObject({
				deduplicate: true,
				updateStrategy: 'fillEmptyOnly',
			});
			expect(mockRequest.mock.calls[0]?.[2]?.body).toEqual({
				email: 'john@example.com',
				firstName: 'John',
			});
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.createInCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.updateInCampaign', () => {
		it('executes PATCH request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'lea_123', firstName: 'Johnny' });

			const input = {
				campaignId: 'cam_123',
				leadId: 'lea_123',
				firstName: 'Johnny',
			};
			const res = await invoke(
				'leads.updateInCampaign',
				Leads.updateInCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PATCH');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.updateInCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.deleteFromCampaign', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'lea_123' });

			const input = {
				campaignId: 'cam_123',
				leadId: 'lea_123',
				action: 'remove',
			} as const;
			const res = await invoke(
				'leads.deleteFromCampaign',
				Leads.deleteFromCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.deleteFromCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.unsubscribeFromCampaign', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'lea_123',
				email: 'john@example.com',
			});

			const input = { campaignId: 'cam_123', email: 'john@example.com' };
			const res = await invoke(
				'leads.unsubscribeFromCampaign',
				Leads.unsubscribeFromCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.unsubscribeFromCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.resume', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'lea_123', isPaused: false }]);

			const input = { leadId: 'lea_123' };
			const res = await invoke('leads.resume', Leads.resume, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.resume');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.pause', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'lea_123', isPaused: true }]);

			const input = { leadId: 'lea_123' };
			const res = await invoke('leads.pause', Leads.pause, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.pause');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.review', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true, launched: 1 });

			const input = { leadId: 'lea_123' };
			const res = await invoke('leads.review', Leads.review, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.review');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.markInterested', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'lea_123' }]);

			const input = { leadIdOrEmail: 'lea_123' };
			const res = await invoke(
				'leads.markInterested',
				Leads.markInterested,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.markInterested',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.markNotInterested', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'lea_123' }]);

			const input = { leadIdOrEmail: 'lea_123' };
			const res = await invoke(
				'leads.markNotInterested',
				Leads.markNotInterested,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.markNotInterested',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.markInterestedInCampaign', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'lea_123' });

			const input = { campaignId: 'cam_123', leadIdOrEmail: 'lea_123' };
			const res = await invoke(
				'leads.markInterestedInCampaign',
				Leads.markInterestedInCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.markInterestedInCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.markNotInterestedInCampaign', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'lea_123' });

			const input = { campaignId: 'cam_123', leadIdOrEmail: 'lea_123' };
			const res = await invoke(
				'leads.markNotInterestedInCampaign',
				Leads.markNotInterestedInCampaign,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.markNotInterestedInCampaign',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.skipStep', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				leadId: 'lea_123',
				stepId: 'stp_123',
				variant: 'A',
				emailTemplateId: 'etp_123',
				content: { message: 'Hello' },
			});

			const input = {
				campaignId: 'cam_123',
				leadIdOrEmail: 'lea_123',
				stepId: 'stp_123',
			};
			const res = await invoke('leads.skipStep', Leads.skipStep, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.leads.skipStep');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.personalizeStep', () => {
		it('executes PUT request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				leadId: 'lea_123',
				stepId: 'stp_123',
				variant: 'A',
				emailTemplateId: 'etp_123',
				content: { message: 'Hello' },
			});

			const input = {
				campaignId: 'cam_123',
				leadIdOrEmail: 'lea_123',
				stepId: 'stp_123',
				message: 'Hello',
			};
			const res = await invoke(
				'leads.personalizeStep',
				Leads.personalizeStep,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PUT');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.personalizeStep',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.resetStepPersonalization', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ reset: true });

			const input = {
				campaignId: 'cam_123',
				leadIdOrEmail: 'lea_123',
				stepId: 'stp_123',
			};
			const res = await invoke(
				'leads.resetStepPersonalization',
				Leads.resetStepPersonalization,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.resetStepPersonalization',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.addVariables', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true });

			const input = { leadId: 'lea_123', variables: { role: 'CTO' } };
			const res = await invoke('leads.addVariables', Leads.addVariables, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.addVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.updateVariables', () => {
		it('executes PATCH request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true });

			const input = { leadId: 'lea_123', variables: { role: 'VP' } };
			const res = await invoke(
				'leads.updateVariables',
				Leads.updateVariables,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('PATCH');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.updateVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.deleteVariables', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true });

			const input = { leadId: 'lea_123', variableNames: ['role'] };
			const res = await invoke(
				'leads.deleteVariables',
				Leads.deleteVariables,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.deleteVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.importFromCrm', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true });

			const input = { campaignId: 'cam_123', filterId: 'flt_123' };
			const res = await invoke(
				'leads.importFromCrm',
				Leads.importFromCrm,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.importFromCrm',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('leads.getCrmFilters', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ id: 'flt_123', name: 'My Leads' }]);

			const input = { type: 'lead' } as const;
			const res = await invoke(
				'leads.getCrmFilters',
				Leads.getCrmFilters,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.leads.getCrmFilters',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('activities.list', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'act_123', type: 'emailsSent' }]);

			const input = { limit: 10 };
			const res = await invoke('activities.list', Activities.list, input);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe('lemlist.activities.list');
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('activities.deleteRecordingTranscript', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ ok: true });

			const input = { activityId: 'act_123' };
			const res = await invoke(
				'activities.deleteRecordingTranscript',
				Activities.deleteRecordingTranscript,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.activities.deleteRecordingTranscript',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.listVariables', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{
					_id: 'uns_123',
					value: 'test@example.com',
					source: 'user',
					createdAt: '2025-01-01',
				},
			]);

			const input = { limit: 10 };
			const res = await invoke(
				'unsubscribes.listVariables',
				Unsubscribes.listVariables,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.listVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.bulkUnsubscribeVariables', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue('Variables unsubscribed');

			const input = { values: ['test@example.com'] };
			const res = await invoke(
				'unsubscribes.bulkUnsubscribeVariables',
				Unsubscribes.bulkUnsubscribeVariables,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.bulkUnsubscribeVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.getVariable', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'uns_123',
				value: 'test@example.com',
				variable: 'test@example.com',
				source: 'user',
			});

			const input = { value: 'test@example.com' };
			const res = await invoke(
				'unsubscribes.getVariable',
				Unsubscribes.getVariable,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.getVariable',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.unsubscribeVariable', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue({
				_id: 'uns_123',
				value: 'test@example.com',
				variable: 'test@example.com',
				source: 'api',
			});

			const input = { value: 'test@example.com' };
			const res = await invoke(
				'unsubscribes.unsubscribeVariable',
				Unsubscribes.unsubscribeVariable,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.unsubscribeVariable',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.resubscribeVariable', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue('Variable subscribed');

			const input = { value: 'test@example.com' };
			const res = await invoke(
				'unsubscribes.resubscribeVariable',
				Unsubscribes.resubscribeVariable,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.resubscribeVariable',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.getContactStatus', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue({ _id: 'ctc_123', doNotContact: true });

			const input = { contactId: 'ctc_123' };
			const res = await invoke(
				'unsubscribes.getContactStatus',
				Unsubscribes.getContactStatus,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.getContactStatus',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.unsubscribeContact', () => {
		it('executes POST request and logs completed event', async () => {
			mockRequest.mockResolvedValue('Contact subscription updated');

			const input = { contactId: 'ctc_123' };
			const res = await invoke(
				'unsubscribes.unsubscribeContact',
				Unsubscribes.unsubscribeContact,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('POST');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.unsubscribeContact',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.resubscribeContact', () => {
		it('executes DELETE request and logs completed event', async () => {
			mockRequest.mockResolvedValue('Contact subscription updated');

			const input = { contactId: 'ctc_123' };
			const res = await invoke(
				'unsubscribes.resubscribeContact',
				Unsubscribes.resubscribeContact,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('DELETE');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.resubscribeContact',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.exportVariables', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([
				{ _id: 'uns_123', value: 'test@example.com', source: 'user' },
			]);

			const input = { format: 'json' } as const;
			const res = await invoke(
				'unsubscribes.exportVariables',
				Unsubscribes.exportVariables,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.exportVariables',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});

	describe('unsubscribes.exportContacts', () => {
		it('executes GET request and logs completed event', async () => {
			mockRequest.mockResolvedValue([{ _id: 'ctc_123', doNotContact: true }]);

			const input = { format: 'json' } as const;
			const res = await invoke(
				'unsubscribes.exportContacts',
				Unsubscribes.exportContacts,
				input,
			);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(mockRequest.mock.calls[0]?.[1]).toBe('test_api_key');
			expect(mockRequest.mock.calls[0]?.[2]?.method).toBe('GET');
			expect(mockLogEvent).toHaveBeenCalledTimes(1);
			expect(mockLogEvent.mock.calls[0]?.[1]).toBe(
				'lemlist.unsubscribes.exportContacts',
			);
			expect(mockLogEvent.mock.calls[0]?.[3]).toBe('completed');
			expect(res).toBeDefined();
		});
	});
});
