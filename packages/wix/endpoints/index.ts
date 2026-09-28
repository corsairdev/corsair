import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AutomationsEndpoints } from './automations';
import { BenefitsEndpoints } from './benefits';
import { BillingEndpoints } from './billing';
import { BookingsEndpoints } from './bookings';
import { CmsEndpoints } from './cms';
import { CommunityEndpoints } from './community';
import { ContactsEndpoints } from './contacts';
import { EventsEndpoints } from './events';
import { FormsEndpoints } from './forms';
import { MarketingEndpoints } from './marketing';
import { MediaEndpoints } from './media';
import { MembersEndpoints } from './members';
import { MultilingualEndpoints } from './multilingual';
import { OrdersEndpoints } from './orders';
import { PortfolioEndpoints } from './portfolio';
import { RestaurantsEndpoints } from './restaurants';
import { wixRoutes } from './routes';
import { SitesEndpoints } from './sites';
import { StoresEndpoints } from './stores';
import { SystemEndpoints } from './system';
import { WixEndpointInputSchemas, WixEndpointOutputSchemas } from './types';

export const wixEndpointsNested = {
	contacts: ContactsEndpoints,
	stores: StoresEndpoints,
	orders: OrdersEndpoints,
	bookings: BookingsEndpoints,
	members: MembersEndpoints,
	sites: SitesEndpoints,
	marketing: MarketingEndpoints,
	forms: FormsEndpoints,
	events: EventsEndpoints,
	restaurants: RestaurantsEndpoints,
	billing: BillingEndpoints,
	cms: CmsEndpoints,
	media: MediaEndpoints,
	automations: AutomationsEndpoints,
	community: CommunityEndpoints,
	portfolio: PortfolioEndpoints,
	benefits: BenefitsEndpoints,
	multilingual: MultilingualEndpoints,
	system: SystemEndpoints,
} as const;

export const wixEndpointMeta = Object.fromEntries(
	wixRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof wixEndpointsNested>;

type WixInputKey = keyof typeof WixEndpointInputSchemas;
type WixOutputKey = keyof typeof WixEndpointOutputSchemas;

export const wixEndpointSchemas = Object.fromEntries(
	wixRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: WixEndpointInputSchemas[route.key as WixInputKey],
			output: WixEndpointOutputSchemas[route.key as WixOutputKey],
		},
	]),
);

export { WixEndpointInputSchemas, WixEndpointOutputSchemas };
export * from './routes';
export * from './types';
