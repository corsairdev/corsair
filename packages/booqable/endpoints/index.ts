import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { BarcodesEndpoints } from './barcodes';
import { BundleItemsEndpoints } from './bundle-items';
import { BundlesEndpoints } from './bundles';
import { ClustersEndpoints } from './clusters';
import { CompaniesEndpoints } from './companies';
import { CouponsEndpoints } from './coupons';
import { CustomersEndpoints } from './customers';
import { DefaultPropertiesEndpoints } from './default-properties';
import { DocumentsEndpoints } from './documents';
import { EmailTemplatesEndpoints } from './email-templates';
import { EmployeesEndpoints } from './employees';
import { InventoryBreakdownsEndpoints } from './inventory-breakdowns';
import { InventoryLevelsEndpoints } from './inventory-levels';
import { ItemsEndpoints } from './items';
import { LinesEndpoints } from './lines';
import { LocationsEndpoints } from './locations';
import { NotesEndpoints } from './notes';
import { OrdersEndpoints } from './orders';
import { PaymentMethodsEndpoints } from './payment-methods';
import { PaymentsEndpoints } from './payments';
import { PhotosEndpoints } from './photos';
import { PlanningsEndpoints } from './plannings';
import { PriceRulesetsEndpoints } from './price-rulesets';
import { PriceStructuresEndpoints } from './price-structures';
import { ProductGroupsEndpoints } from './product-groups';
import { ProductsEndpoints } from './products';
import { PropertiesEndpoints } from './properties';
import { ProvincesEndpoints } from './provinces';
import { booqableRoutes } from './routes';
import { StockItemPlanningsEndpoints } from './stock-item-plannings';
import { StockItemsEndpoints } from './stock-items';
import { TaxRatesEndpoints } from './tax-rates';
import { TaxValuesEndpoints } from './tax-values';
import {
	BooqableEndpointInputSchemas,
	BooqableEndpointOutputSchemas,
} from './types';
import { UsersEndpoints } from './users';

export const booqableEndpointsNested = {
	customers: CustomersEndpoints,
	orders: OrdersEndpoints,
	productGroups: ProductGroupsEndpoints,
	products: ProductsEndpoints,
	companies: CompaniesEndpoints,
	inventoryLevels: InventoryLevelsEndpoints,
	barcodes: BarcodesEndpoints,
	bundleItems: BundleItemsEndpoints,
	bundles: BundlesEndpoints,
	clusters: ClustersEndpoints,
	coupons: CouponsEndpoints,
	defaultProperties: DefaultPropertiesEndpoints,
	documents: DocumentsEndpoints,
	emailTemplates: EmailTemplatesEndpoints,
	employees: EmployeesEndpoints,
	inventoryBreakdowns: InventoryBreakdownsEndpoints,
	items: ItemsEndpoints,
	lines: LinesEndpoints,
	locations: LocationsEndpoints,
	notes: NotesEndpoints,
	paymentMethods: PaymentMethodsEndpoints,
	payments: PaymentsEndpoints,
	photos: PhotosEndpoints,
	plannings: PlanningsEndpoints,
	priceRulesets: PriceRulesetsEndpoints,
	priceStructures: PriceStructuresEndpoints,
	properties: PropertiesEndpoints,
	provinces: ProvincesEndpoints,
	stockItemPlannings: StockItemPlanningsEndpoints,
	stockItems: StockItemsEndpoints,
	taxRates: TaxRatesEndpoints,
	taxValues: TaxValuesEndpoints,
	users: UsersEndpoints,
} as const;

export const booqableEndpointMeta = Object.fromEntries(
	booqableRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			irreversible: 'irreversible' in route ? route.irreversible : undefined,
			description: route.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof booqableEndpointsNested>;

export const booqableEndpointSchemas = Object.fromEntries(
	booqableRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: BooqableEndpointInputSchemas[route.key],
			output: BooqableEndpointOutputSchemas[route.key],
		},
	]),
);

export { BooqableEndpointInputSchemas, BooqableEndpointOutputSchemas };
export * from './routes';
export * from './types';
