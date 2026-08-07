import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AccountEndpoints } from './account';
import { AutomationsEndpoints } from './automations';
import { CampaignReportsEndpoints } from './campaign-reports';
import { CampaignsEndpoints } from './campaigns';
import { CommerceEndpoints } from './commerce';
import { ContactsEndpoints } from './contacts';
import { ExternalEndpoints } from './external';
import { GroupsEndpoints } from './groups';
import { LandingpageEndpoints } from './landingpage';
import { MailingListEndpoints } from './mailing-list';
import { OperationalMessageEndpoints } from './operational-message';
import { PushCampaignReportEndpoints } from './push-campaign-report';
import { activeTrailRoutes } from './routes';
import { SegmentationEndpoints } from './segmentation';
import { SignupFormsEndpoints } from './signup-forms';
import { SmartCodeSiteEndpoints } from './smart-code-site';
import { SmsCampaignEndpoints } from './sms-campaign';
import { SmsCampaignReportEndpoints } from './sms-campaign-report';
import { TemplatesEndpoints } from './templates';
import {
	ActiveTrailEndpointInputSchemas,
	ActiveTrailEndpointOutputSchemas,
} from './types';
import { UserSocialEndpoints } from './user-social';
import { WebhooksEndpoints } from './webhooks';

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
	webhooks: WebhooksEndpoints,
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
