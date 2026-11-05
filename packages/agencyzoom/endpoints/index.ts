import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AuthEndpoints } from './auth';
import { ContactEndpoints } from './contact';
import { CustomersEndpoints } from './customers';
import { EmailThreadsEndpoints } from './email-threads';
import { LeadsEndpoints } from './leads';
import { LifeEndpoints } from './life';
import { OpportunitiesEndpoints } from './opportunities';
import { PoliciesEndpoints } from './policies';
import { ProfileEndpoints } from './profile';
import { ReferenceDataEndpoints } from './reference-data';
import { agencyZoomRoutes } from './routes';
import { ServiceTicketsEndpoints } from './service-tickets';
import { TasksEndpoints } from './tasks';
import { TextThreadsEndpoints } from './text-threads';
import {
	AgencyZoomEndpointInputSchemas,
	AgencyZoomEndpointOutputSchemas,
} from './types';
import { V4ssoEndpoints } from './v4sso';

export const agencyZoomEndpointsNested = {
	auth: AuthEndpoints,
	contact: ContactEndpoints,
	customers: CustomersEndpoints,
	emailThreads: EmailThreadsEndpoints,
	leads: LeadsEndpoints,
	life: LifeEndpoints,
	opportunities: OpportunitiesEndpoints,
	policies: PoliciesEndpoints,
	profile: ProfileEndpoints,
	referenceData: ReferenceDataEndpoints,
	serviceTickets: ServiceTicketsEndpoints,
	tasks: TasksEndpoints,
	textThreads: TextThreadsEndpoints,
	v4sso: V4ssoEndpoints,
} as const;

export const agencyZoomEndpointMeta = Object.fromEntries(
	agencyZoomRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof agencyZoomEndpointsNested>;

export const agencyZoomEndpointSchemas = Object.fromEntries(
	agencyZoomRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: AgencyZoomEndpointInputSchemas[route.key],
			output: AgencyZoomEndpointOutputSchemas[route.key],
		},
	]),
);

export { AgencyZoomEndpointInputSchemas, AgencyZoomEndpointOutputSchemas };
export * from './routes';
export * from './types';
