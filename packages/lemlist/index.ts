import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Activities, Campaigns, Leads, Team, Unsubscribes } from './endpoints';
import type {
	LemlistEndpointInputs,
	LemlistEndpointOutputs,
} from './endpoints/types';
import {
	LemlistEndpointInputSchemas,
	LemlistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LemlistSchema } from './schema';

export type LemlistPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	timeout?: number;
	hooks?: InternalLemlistPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof lemlistEndpointsNested>;
};

export type LemlistPluginContext = CorsairPluginContext<
	typeof LemlistSchema,
	LemlistPluginOptions
>;

export type LemlistKeyBuilderContext = KeyBuilderContext<LemlistPluginOptions>;

export type LemlistBoundEndpoints = BindEndpoints<
	typeof lemlistEndpointsNested
>;

type LemlistEndpoint<K extends keyof LemlistEndpointOutputs> = CorsairEndpoint<
	LemlistPluginContext,
	LemlistEndpointInputs[K],
	LemlistEndpointOutputs[K]
>;

export const lemlistEndpointsNested = {
	team: {
		get: Team.get,
		getSenders: Team.getSenders,
		getCredits: Team.getCredits,
		getCrmUsers: Team.getCrmUsers,
	},
	campaigns: {
		list: Campaigns.list,
		create: Campaigns.create,
		get: Campaigns.get,
		update: Campaigns.update,
		getSettings: Campaigns.getSettings,
		updateSettings: Campaigns.updateSettings,
		pause: Campaigns.pause,
		start: Campaigns.start,
		archive: Campaigns.archive,
		unarchive: Campaigns.unarchive,
		duplicate: Campaigns.duplicate,
		getStatutes: Campaigns.getStatutes,
		getStats: Campaigns.getStats,
		getBatchStats: Campaigns.getBatchStats,
		getReports: Campaigns.getReports,
		startExport: Campaigns.startExport,
		getExportStatus: Campaigns.getExportStatus,
		setExportEmail: Campaigns.setExportEmail,
		exportLeads: Campaigns.exportLeads,
		skipStepForEveryone: Campaigns.skipStepForEveryone,
		skipStepForLeads: Campaigns.skipStepForLeads,
		addAbmLeads: Campaigns.addAbmLeads,
	},
	leads: {
		get: Leads.get,
		getByEmail: Leads.getByEmail,
		listInCampaign: Leads.listInCampaign,
		createInCampaign: Leads.createInCampaign,
		updateInCampaign: Leads.updateInCampaign,
		deleteFromCampaign: Leads.deleteFromCampaign,
		unsubscribeFromCampaign: Leads.unsubscribeFromCampaign,
		resume: Leads.resume,
		pause: Leads.pause,
		review: Leads.review,
		markInterested: Leads.markInterested,
		markNotInterested: Leads.markNotInterested,
		markInterestedInCampaign: Leads.markInterestedInCampaign,
		markNotInterestedInCampaign: Leads.markNotInterestedInCampaign,
		skipStep: Leads.skipStep,
		personalizeStep: Leads.personalizeStep,
		resetStepPersonalization: Leads.resetStepPersonalization,
		addVariables: Leads.addVariables,
		updateVariables: Leads.updateVariables,
		deleteVariables: Leads.deleteVariables,
		importFromCrm: Leads.importFromCrm,
		getCrmFilters: Leads.getCrmFilters,
	},
	activities: {
		list: Activities.list,
		deleteRecordingTranscript: Activities.deleteRecordingTranscript,
	},
	unsubscribes: {
		listVariables: Unsubscribes.listVariables,
		bulkUnsubscribeVariables: Unsubscribes.bulkUnsubscribeVariables,
		getVariable: Unsubscribes.getVariable,
		unsubscribeVariable: Unsubscribes.unsubscribeVariable,
		resubscribeVariable: Unsubscribes.resubscribeVariable,
		getContactStatus: Unsubscribes.getContactStatus,
		unsubscribeContact: Unsubscribes.unsubscribeContact,
		resubscribeContact: Unsubscribes.resubscribeContact,
		exportVariables: Unsubscribes.exportVariables,
		exportContacts: Unsubscribes.exportContacts,
	},
} as const;

export const lemlistEndpointSchemas = {
	'team.get': {
		input: LemlistEndpointInputSchemas.teamGet,
		output: LemlistEndpointOutputSchemas.teamGet,
	},
	'team.getSenders': {
		input: LemlistEndpointInputSchemas.teamGetSenders,
		output: LemlistEndpointOutputSchemas.teamGetSenders,
	},
	'team.getCredits': {
		input: LemlistEndpointInputSchemas.teamGetCredits,
		output: LemlistEndpointOutputSchemas.teamGetCredits,
	},
	'team.getCrmUsers': {
		input: LemlistEndpointInputSchemas.teamGetCrmUsers,
		output: LemlistEndpointOutputSchemas.teamGetCrmUsers,
	},
	'campaigns.list': {
		input: LemlistEndpointInputSchemas.campaignsList,
		output: LemlistEndpointOutputSchemas.campaignsList,
	},
	'campaigns.create': {
		input: LemlistEndpointInputSchemas.campaignsCreate,
		output: LemlistEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.get': {
		input: LemlistEndpointInputSchemas.campaignsGet,
		output: LemlistEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.update': {
		input: LemlistEndpointInputSchemas.campaignsUpdate,
		output: LemlistEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.getSettings': {
		input: LemlistEndpointInputSchemas.campaignsGetSettings,
		output: LemlistEndpointOutputSchemas.campaignsGetSettings,
	},
	'campaigns.updateSettings': {
		input: LemlistEndpointInputSchemas.campaignsUpdateSettings,
		output: LemlistEndpointOutputSchemas.campaignsUpdateSettings,
	},
	'campaigns.pause': {
		input: LemlistEndpointInputSchemas.campaignsPause,
		output: LemlistEndpointOutputSchemas.campaignsPause,
	},
	'campaigns.start': {
		input: LemlistEndpointInputSchemas.campaignsStart,
		output: LemlistEndpointOutputSchemas.campaignsStart,
	},
	'campaigns.archive': {
		input: LemlistEndpointInputSchemas.campaignsArchive,
		output: LemlistEndpointOutputSchemas.campaignsArchive,
	},
	'campaigns.unarchive': {
		input: LemlistEndpointInputSchemas.campaignsUnarchive,
		output: LemlistEndpointOutputSchemas.campaignsUnarchive,
	},
	'campaigns.duplicate': {
		input: LemlistEndpointInputSchemas.campaignsDuplicate,
		output: LemlistEndpointOutputSchemas.campaignsDuplicate,
	},
	'campaigns.getStatutes': {
		input: LemlistEndpointInputSchemas.campaignsGetStatutes,
		output: LemlistEndpointOutputSchemas.campaignsGetStatutes,
	},
	'campaigns.getStats': {
		input: LemlistEndpointInputSchemas.campaignsGetStats,
		output: LemlistEndpointOutputSchemas.campaignsGetStats,
	},
	'campaigns.getBatchStats': {
		input: LemlistEndpointInputSchemas.campaignsGetBatchStats,
		output: LemlistEndpointOutputSchemas.campaignsGetBatchStats,
	},
	'campaigns.getReports': {
		input: LemlistEndpointInputSchemas.campaignsGetReports,
		output: LemlistEndpointOutputSchemas.campaignsGetReports,
	},
	'campaigns.startExport': {
		input: LemlistEndpointInputSchemas.campaignsStartExport,
		output: LemlistEndpointOutputSchemas.campaignsStartExport,
	},
	'campaigns.getExportStatus': {
		input: LemlistEndpointInputSchemas.campaignsGetExportStatus,
		output: LemlistEndpointOutputSchemas.campaignsGetExportStatus,
	},
	'campaigns.setExportEmail': {
		input: LemlistEndpointInputSchemas.campaignsSetExportEmail,
		output: LemlistEndpointOutputSchemas.campaignsSetExportEmail,
	},
	'campaigns.exportLeads': {
		input: LemlistEndpointInputSchemas.campaignsExportLeads,
		output: LemlistEndpointOutputSchemas.campaignsExportLeads,
	},
	'campaigns.skipStepForEveryone': {
		input: LemlistEndpointInputSchemas.campaignsSkipStepForEveryone,
		output: LemlistEndpointOutputSchemas.campaignsSkipStepForEveryone,
	},
	'campaigns.skipStepForLeads': {
		input: LemlistEndpointInputSchemas.campaignsSkipStepForLeads,
		output: LemlistEndpointOutputSchemas.campaignsSkipStepForLeads,
	},
	'campaigns.addAbmLeads': {
		input: LemlistEndpointInputSchemas.campaignsAddAbmLeads,
		output: LemlistEndpointOutputSchemas.campaignsAddAbmLeads,
	},
	'leads.get': {
		input: LemlistEndpointInputSchemas.leadsGet,
		output: LemlistEndpointOutputSchemas.leadsGet,
	},
	'leads.getByEmail': {
		input: LemlistEndpointInputSchemas.leadsGetByEmail,
		output: LemlistEndpointOutputSchemas.leadsGetByEmail,
	},
	'leads.listInCampaign': {
		input: LemlistEndpointInputSchemas.leadsListInCampaign,
		output: LemlistEndpointOutputSchemas.leadsListInCampaign,
	},
	'leads.createInCampaign': {
		input: LemlistEndpointInputSchemas.leadsCreateInCampaign,
		output: LemlistEndpointOutputSchemas.leadsCreateInCampaign,
	},
	'leads.updateInCampaign': {
		input: LemlistEndpointInputSchemas.leadsUpdateInCampaign,
		output: LemlistEndpointOutputSchemas.leadsUpdateInCampaign,
	},
	'leads.deleteFromCampaign': {
		input: LemlistEndpointInputSchemas.leadsDeleteFromCampaign,
		output: LemlistEndpointOutputSchemas.leadsDeleteFromCampaign,
	},
	'leads.unsubscribeFromCampaign': {
		input: LemlistEndpointInputSchemas.leadsUnsubscribeFromCampaign,
		output: LemlistEndpointOutputSchemas.leadsUnsubscribeFromCampaign,
	},
	'leads.resume': {
		input: LemlistEndpointInputSchemas.leadsResume,
		output: LemlistEndpointOutputSchemas.leadsResume,
	},
	'leads.pause': {
		input: LemlistEndpointInputSchemas.leadsPause,
		output: LemlistEndpointOutputSchemas.leadsPause,
	},
	'leads.review': {
		input: LemlistEndpointInputSchemas.leadsReview,
		output: LemlistEndpointOutputSchemas.leadsReview,
	},
	'leads.markInterested': {
		input: LemlistEndpointInputSchemas.leadsMarkInterested,
		output: LemlistEndpointOutputSchemas.leadsMarkInterested,
	},
	'leads.markNotInterested': {
		input: LemlistEndpointInputSchemas.leadsMarkNotInterested,
		output: LemlistEndpointOutputSchemas.leadsMarkNotInterested,
	},
	'leads.markInterestedInCampaign': {
		input: LemlistEndpointInputSchemas.leadsMarkInterestedInCampaign,
		output: LemlistEndpointOutputSchemas.leadsMarkInterestedInCampaign,
	},
	'leads.markNotInterestedInCampaign': {
		input: LemlistEndpointInputSchemas.leadsMarkNotInterestedInCampaign,
		output: LemlistEndpointOutputSchemas.leadsMarkNotInterestedInCampaign,
	},
	'leads.skipStep': {
		input: LemlistEndpointInputSchemas.leadsSkipStep,
		output: LemlistEndpointOutputSchemas.leadsSkipStep,
	},
	'leads.personalizeStep': {
		input: LemlistEndpointInputSchemas.leadsPersonalizeStep,
		output: LemlistEndpointOutputSchemas.leadsPersonalizeStep,
	},
	'leads.resetStepPersonalization': {
		input: LemlistEndpointInputSchemas.leadsResetStepPersonalization,
		output: LemlistEndpointOutputSchemas.leadsResetStepPersonalization,
	},
	'leads.addVariables': {
		input: LemlistEndpointInputSchemas.leadsAddVariables,
		output: LemlistEndpointOutputSchemas.leadsAddVariables,
	},
	'leads.updateVariables': {
		input: LemlistEndpointInputSchemas.leadsUpdateVariables,
		output: LemlistEndpointOutputSchemas.leadsUpdateVariables,
	},
	'leads.deleteVariables': {
		input: LemlistEndpointInputSchemas.leadsDeleteVariables,
		output: LemlistEndpointOutputSchemas.leadsDeleteVariables,
	},
	'leads.importFromCrm': {
		input: LemlistEndpointInputSchemas.leadsImportFromCrm,
		output: LemlistEndpointOutputSchemas.leadsImportFromCrm,
	},
	'leads.getCrmFilters': {
		input: LemlistEndpointInputSchemas.leadsGetCrmFilters,
		output: LemlistEndpointOutputSchemas.leadsGetCrmFilters,
	},
	'activities.list': {
		input: LemlistEndpointInputSchemas.activitiesList,
		output: LemlistEndpointOutputSchemas.activitiesList,
	},
	'activities.deleteRecordingTranscript': {
		input: LemlistEndpointInputSchemas.activitiesDeleteRecordingTranscript,
		output: LemlistEndpointOutputSchemas.activitiesDeleteRecordingTranscript,
	},
	'unsubscribes.listVariables': {
		input: LemlistEndpointInputSchemas.unsubscribesListVariables,
		output: LemlistEndpointOutputSchemas.unsubscribesListVariables,
	},
	'unsubscribes.bulkUnsubscribeVariables': {
		input: LemlistEndpointInputSchemas.unsubscribesBulkUnsubscribeVariables,
		output: LemlistEndpointOutputSchemas.unsubscribesBulkUnsubscribeVariables,
	},
	'unsubscribes.getVariable': {
		input: LemlistEndpointInputSchemas.unsubscribesGetVariable,
		output: LemlistEndpointOutputSchemas.unsubscribesGetVariable,
	},
	'unsubscribes.unsubscribeVariable': {
		input: LemlistEndpointInputSchemas.unsubscribesUnsubscribeVariable,
		output: LemlistEndpointOutputSchemas.unsubscribesUnsubscribeVariable,
	},
	'unsubscribes.resubscribeVariable': {
		input: LemlistEndpointInputSchemas.unsubscribesResubscribeVariable,
		output: LemlistEndpointOutputSchemas.unsubscribesResubscribeVariable,
	},
	'unsubscribes.getContactStatus': {
		input: LemlistEndpointInputSchemas.unsubscribesGetContactStatus,
		output: LemlistEndpointOutputSchemas.unsubscribesGetContactStatus,
	},
	'unsubscribes.unsubscribeContact': {
		input: LemlistEndpointInputSchemas.unsubscribesUnsubscribeContact,
		output: LemlistEndpointOutputSchemas.unsubscribesUnsubscribeContact,
	},
	'unsubscribes.resubscribeContact': {
		input: LemlistEndpointInputSchemas.unsubscribesResubscribeContact,
		output: LemlistEndpointOutputSchemas.unsubscribesResubscribeContact,
	},
	'unsubscribes.exportVariables': {
		input: LemlistEndpointInputSchemas.unsubscribesExportVariables,
		output: LemlistEndpointOutputSchemas.unsubscribesExportVariables,
	},
	'unsubscribes.exportContacts': {
		input: LemlistEndpointInputSchemas.unsubscribesExportContacts,
		output: LemlistEndpointOutputSchemas.unsubscribesExportContacts,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof lemlistEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const lemlistEndpointMeta = {
	'team.get': {
		riskLevel: 'read',
		description: 'Retrieve team details and members',
	},
	'team.getSenders': {
		riskLevel: 'read',
		description: 'Retrieve all team members and their associated campaigns',
	},
	'team.getCredits': {
		riskLevel: 'read',
		description: 'Retrieve team remaining credits balance',
	},
	'team.getCrmUsers': {
		riskLevel: 'read',
		description: 'List team members connected to CRM',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of all campaigns in team',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a new campaign with schedule and settings',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description: 'Retrieve details of a specific campaign by ID',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description: 'Update settings and configuration of a campaign',
	},
	'campaigns.getSettings': {
		riskLevel: 'read',
		description: 'Retrieve all settings of a campaign',
	},
	'campaigns.updateSettings': {
		riskLevel: 'write',
		description: 'Update settings of a campaign',
	},
	'campaigns.pause': {
		riskLevel: 'write',
		description: 'Pause a running campaign',
	},
	'campaigns.start': {
		riskLevel: 'destructive',
		description:
			'Resume a paused campaign and allow its outreach messages to send',
	},
	'campaigns.archive': {
		riskLevel: 'write',
		description: 'Archive a campaign',
	},
	'campaigns.unarchive': {
		riskLevel: 'write',
		description: 'Restore an archived campaign',
	},
	'campaigns.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate an existing campaign with sequences and schedules',
	},
	'campaigns.getStatutes': {
		riskLevel: 'read',
		description:
			'Retrieve validation statutes and launch blockers for a campaign',
	},
	'campaigns.getStats': {
		riskLevel: 'read',
		description: 'Retrieve performance statistics for a specific campaign',
	},
	'campaigns.getBatchStats': {
		riskLevel: 'read',
		description: 'Retrieve performance statistics for multiple campaigns',
	},
	'campaigns.getReports': {
		riskLevel: 'read',
		description: 'Retrieve aggregated reports for one or multiple campaigns',
	},
	'campaigns.startExport': {
		riskLevel: 'write',
		description: 'Initiate asynchronous export of campaign statistics',
	},
	'campaigns.getExportStatus': {
		riskLevel: 'read',
		description: 'Check status of an asynchronous campaign export',
	},
	'campaigns.setExportEmail': {
		riskLevel: 'destructive',
		description:
			'Email the campaign export download link to an address when the export completes',
	},
	'campaigns.exportLeads': {
		riskLevel: 'read',
		description: 'Export leads from campaign with state filtering',
	},
	'campaigns.skipStepForEveryone': {
		riskLevel: 'destructive',
		description: 'Skip one sequence step for every lead in campaign',
	},
	'campaigns.skipStepForLeads': {
		riskLevel: 'destructive',
		description: 'Skip one sequence step for specific leads in campaign',
	},
	'campaigns.addAbmLeads': {
		riskLevel: 'destructive',
		description: 'Add People Database contacts to an ABM campaign',
	},
	'leads.get': {
		riskLevel: 'read',
		description: 'Retrieve lead by email address or lead ID',
	},
	'leads.getByEmail': {
		riskLevel: 'read',
		description: 'Retrieve lead details by email address',
	},
	'leads.listInCampaign': {
		riskLevel: 'read',
		description: 'Retrieve leads from a specific campaign',
	},
	'leads.createInCampaign': {
		riskLevel: 'destructive',
		description: 'Create a new lead and add it to a campaign',
	},
	'leads.updateInCampaign': {
		riskLevel: 'write',
		description: 'Update lead information in a campaign',
	},
	'leads.deleteFromCampaign': {
		riskLevel: 'destructive',
		description:
			'Remove a lead from a campaign by ID (use leads.unsubscribeFromCampaign to unsubscribe)',
	},
	'leads.unsubscribeFromCampaign': {
		riskLevel: 'destructive',
		description: 'Unsubscribe a lead from a campaign by email',
	},
	'leads.resume': {
		riskLevel: 'destructive',
		description:
			'Resume a paused lead in all campaigns or one campaign, allowing outreach to continue',
	},
	'leads.pause': {
		riskLevel: 'write',
		description:
			'Pause lead activity across campaigns or in a specific campaign',
	},
	'leads.review': {
		riskLevel: 'destructive',
		description:
			'Manually launch a lead into its campaign, allowing outreach to begin',
	},
	'leads.markInterested': {
		riskLevel: 'write',
		description: 'Mark lead as interested across all campaigns',
	},
	'leads.markNotInterested': {
		riskLevel: 'write',
		description: 'Mark lead as not interested across all campaigns',
	},
	'leads.markInterestedInCampaign': {
		riskLevel: 'write',
		description: 'Mark lead as interested in a specific campaign',
	},
	'leads.markNotInterestedInCampaign': {
		riskLevel: 'write',
		description: 'Mark lead as not interested in a specific campaign',
	},
	'leads.skipStep': {
		riskLevel: 'destructive',
		description: 'Skip one step of a running campaign for a single lead',
	},
	'leads.personalizeStep': {
		riskLevel: 'write',
		description: 'Personalize step message for a single lead',
	},
	'leads.resetStepPersonalization': {
		riskLevel: 'destructive',
		description: 'Reset step personalization for a single lead',
	},
	'leads.addVariables': {
		riskLevel: 'write',
		description: 'Add custom variables to a lead',
	},
	'leads.updateVariables': {
		riskLevel: 'write',
		description: 'Update custom variables of a lead',
	},
	'leads.deleteVariables': {
		riskLevel: 'destructive',
		description: 'Erase custom variables of a lead',
	},
	'leads.importFromCrm': {
		riskLevel: 'destructive',
		description: 'Import leads from connected CRM filter into campaign',
	},
	'leads.getCrmFilters': {
		riskLevel: 'read',
		description: 'Retrieve filters and list views from connected CRM',
	},
	'activities.list': {
		riskLevel: 'read',
		description: 'Retrieve outreach activities across team or campaigns',
	},
	'activities.deleteRecordingTranscript': {
		riskLevel: 'destructive',
		description: 'Delete call recording and transcript of an activity',
	},
	'unsubscribes.listVariables': {
		riskLevel: 'read',
		description: 'List unsubscribed variables (emails, domains, phones)',
	},
	'unsubscribes.bulkUnsubscribeVariables': {
		riskLevel: 'destructive',
		description: 'Bulk unsubscribe variables up to 10,000 items',
	},
	'unsubscribes.getVariable': {
		riskLevel: 'read',
		description: 'Get unsubscribed status of a variable',
	},
	'unsubscribes.unsubscribeVariable': {
		riskLevel: 'destructive',
		description: 'Unsubscribe a single variable (email, domain, or phone)',
	},
	'unsubscribes.resubscribeVariable': {
		riskLevel: 'write',
		description: 'Re-subscribe a variable to allow future outreach',
	},
	'unsubscribes.getContactStatus': {
		riskLevel: 'read',
		description: 'Get subscription status of a contact',
	},
	'unsubscribes.unsubscribeContact': {
		riskLevel: 'destructive',
		description: 'Unsubscribe a contact by ID',
	},
	'unsubscribes.resubscribeContact': {
		riskLevel: 'write',
		description: 'Re-subscribe a contact by ID',
	},
	'unsubscribes.exportVariables': {
		riskLevel: 'read',
		description: 'Export unsubscribed variables in CSV or JSON format',
	},
	'unsubscribes.exportContacts': {
		riskLevel: 'read',
		description:
			'Export all contacts with their subscription status (doNotContact) in CSV or JSON format',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof lemlistEndpointsNested>;

export const lemlistAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLemlistPlugin<T extends LemlistPluginOptions> = CorsairPlugin<
	'lemlist',
	typeof LemlistSchema,
	typeof lemlistEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalLemlistPlugin = BaseLemlistPlugin<LemlistPluginOptions>;

export type ExternalLemlistPlugin<T extends LemlistPluginOptions> =
	BaseLemlistPlugin<T>;

export function lemlist<const T extends LemlistPluginOptions>(
	incomingOptions: LemlistPluginOptions & T = {} as LemlistPluginOptions & T,
): ExternalLemlistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'lemlist',
		authConfig: lemlistAuthConfig,
		schema: LemlistSchema,
		options,
		hooks: options.hooks,
		endpoints: lemlistEndpointsNested,
		webhooks: {},
		endpointMeta: lemlistEndpointMeta,
		endpointSchemas: lemlistEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: LemlistKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('lemlist', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey || apiKey.trim().length === 0) {
				throw new AuthMissingError('lemlist', 'api_key');
			}
			return apiKey;
		},
	} satisfies InternalLemlistPlugin;
}

export {
	basicAuthHeader,
	LEMLIST_API_BASE,
	LemlistAPIError,
	makeLemlistRequest,
} from './client';
export * from './endpoints/types';
export { LemlistSchema } from './schema';
