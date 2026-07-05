import { AccountEndpoints } from './account';
import { AutomationsEndpoints } from './automations';
import { CampaignReportsEndpoints } from './campaignReports';
import { CampaignsEndpoints } from './campaigns';
import { CommerceEndpoints } from './commerce';
import { ContactsEndpoints } from './contacts';
import { ExternalEndpoints } from './external';
import { GroupsEndpoints } from './groups';
import { LandingpageEndpoints } from './landingpage';
import { MailingListEndpoints } from './mailingList';
import { OperationalMessageEndpoints } from './operationalMessage';
import { PushCampaignReportEndpoints } from './pushCampaignReport';
import { SegmentationEndpoints } from './segmentation';
import { SignupFormsEndpoints } from './signupForms';
import { SmartCodeSiteEndpoints } from './smartCodeSite';
import { SmsCampaignEndpoints } from './smsCampaign';
import { SmsCampaignReportEndpoints } from './smsCampaignReport';
import { TemplatesEndpoints } from './templates';
import { UserSocialEndpoints } from './userSocial';
import { WebhooksEndpoints } from './webhooks';
import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { activeTrailRoutes } from './routes';
import { ActiveTrailEndpointInputSchemas, ActiveTrailEndpointOutputSchemas } from './types';

export const activeTrailEndpointsNested = {
	account: AccountEndpoints,
	automations: AutomationsEndpoints,
	campaignReports: CampaignReportsEndpoints,
	campaigns: CampaignsEndpoints,
	commerce: CommerceEndpoints,
	contacts: ContactsEndpoints,
	external: ExternalEndpoints,
	groups: GroupsEndpoints,
	landingpage: LandingpageEndpoints,
	mailingList: MailingListEndpoints,
	operationalMessage: OperationalMessageEndpoints,
	pushCampaignReport: PushCampaignReportEndpoints,
	segmentation: SegmentationEndpoints,
	signupForms: SignupFormsEndpoints,
	smartCodeSite: SmartCodeSiteEndpoints,
	smsCampaign: SmsCampaignEndpoints,
	smsCampaignReport: SmsCampaignReportEndpoints,
	templates: TemplatesEndpoints,
	userSocial: UserSocialEndpoints,
	webhooks: WebhooksEndpoints
} as const;

export const activeTrailEndpointMeta = Object.fromEntries(
	activeTrailRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof activeTrailEndpointsNested>;

export const activeTrailEndpointSchemas = Object.fromEntries(
	activeTrailRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: ActiveTrailEndpointInputSchemas[route.key],
			output: ActiveTrailEndpointOutputSchemas[route.key],
		},
	]),
);

export { ActiveTrailEndpointInputSchemas, ActiveTrailEndpointOutputSchemas };
export * from './routes';
export * from './types';
