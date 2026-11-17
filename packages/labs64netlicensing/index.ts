import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { NetLicensingContext } from './context';
import {
	Licensees,
	Licenses,
	LicenseTemplates,
	ProductModules,
	Products,
	Transactions,
} from './endpoints';
import {
	DeletedOutputSchema,
	ItemOutputSchema,
	ItemsOutputSchema,
	LicenseCreateInputSchema,
	LicenseDeleteInputSchema,
	LicenseeCreateInputSchema,
	LicenseeDeleteInputSchema,
	LicenseeGetInputSchema,
	LicenseeTransferInputSchema,
	LicenseeUpdateInputSchema,
	LicenseeValidateInputSchema,
	LicenseGetInputSchema,
	LicenseTemplateCreateInputSchema,
	LicenseTemplateDeleteInputSchema,
	LicenseTemplateGetInputSchema,
	LicenseTemplateUpdateInputSchema,
	LicenseUpdateInputSchema,
	ListInputSchema,
	ListLicensesResponseSchema,
	ListProductsResponseSchema,
	ProductCreateInputSchema,
	ProductDeleteInputSchema,
	ProductGetInputSchema,
	ProductModuleCreateInputSchema,
	ProductModuleDeleteInputSchema,
	ProductModuleGetInputSchema,
	ProductModuleUpdateInputSchema,
	ProductUpdateInputSchema,
	TransactionGetInputSchema,
	TransferOutputSchema,
	ValidateOutputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NetLicensingSchema } from './schema';

export type { NetLicensingContext };

export type NetLicensingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNetLicensingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof netLicensingEndpointsNested>;
};

export type NetLicensingKeyBuilderContext =
	KeyBuilderContext<NetLicensingPluginOptions>;

const netLicensingEndpointsNested = {
	products: Products,
	productModules: ProductModules,
	licenseTemplates: LicenseTemplates,
	licensees: Licensees,
	licenses: Licenses,
	transactions: Transactions,
} as const;

const netLicensingWebhooksNested = {} as const;

export const netLicensingEndpointSchemas = {
	'products.list': {
		input: ListInputSchema,
		output: ListProductsResponseSchema,
	},
	'products.get': { input: ProductGetInputSchema, output: ItemOutputSchema },
	'products.create': {
		input: ProductCreateInputSchema,
		output: ItemOutputSchema,
	},
	'products.update': {
		input: ProductUpdateInputSchema,
		output: ItemOutputSchema,
	},
	'products.delete': {
		input: ProductDeleteInputSchema,
		output: DeletedOutputSchema,
	},
	'productModules.list': { input: ListInputSchema, output: ItemsOutputSchema },
	'productModules.get': {
		input: ProductModuleGetInputSchema,
		output: ItemOutputSchema,
	},
	'productModules.create': {
		input: ProductModuleCreateInputSchema,
		output: ItemOutputSchema,
	},
	'productModules.update': {
		input: ProductModuleUpdateInputSchema,
		output: ItemOutputSchema,
	},
	'productModules.delete': {
		input: ProductModuleDeleteInputSchema,
		output: DeletedOutputSchema,
	},
	'licenseTemplates.list': {
		input: ListInputSchema,
		output: ItemsOutputSchema,
	},
	'licenseTemplates.get': {
		input: LicenseTemplateGetInputSchema,
		output: ItemOutputSchema,
	},
	'licenseTemplates.create': {
		input: LicenseTemplateCreateInputSchema,
		output: ItemOutputSchema,
	},
	'licenseTemplates.update': {
		input: LicenseTemplateUpdateInputSchema,
		output: ItemOutputSchema,
	},
	'licenseTemplates.delete': {
		input: LicenseTemplateDeleteInputSchema,
		output: DeletedOutputSchema,
	},
	'licensees.list': { input: ListInputSchema, output: ItemsOutputSchema },
	'licensees.get': { input: LicenseeGetInputSchema, output: ItemOutputSchema },
	'licensees.create': {
		input: LicenseeCreateInputSchema,
		output: ItemOutputSchema,
	},
	'licensees.update': {
		input: LicenseeUpdateInputSchema,
		output: ItemOutputSchema,
	},
	'licensees.delete': {
		input: LicenseeDeleteInputSchema,
		output: DeletedOutputSchema,
	},
	'licensees.validate': {
		input: LicenseeValidateInputSchema,
		output: ValidateOutputSchema,
	},
	'licensees.transfer': {
		input: LicenseeTransferInputSchema,
		output: TransferOutputSchema,
	},
	'licenses.list': {
		input: ListInputSchema,
		output: ListLicensesResponseSchema,
	},
	'licenses.get': { input: LicenseGetInputSchema, output: ItemOutputSchema },
	'licenses.create': {
		input: LicenseCreateInputSchema,
		output: ItemOutputSchema,
	},
	'licenses.update': {
		input: LicenseUpdateInputSchema,
		output: ItemOutputSchema,
	},
	'licenses.delete': {
		input: LicenseDeleteInputSchema,
		output: DeletedOutputSchema,
	},
	'transactions.list': { input: ListInputSchema, output: ItemsOutputSchema },
	'transactions.get': {
		input: TransactionGetInputSchema,
		output: ItemOutputSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof netLicensingEndpointsNested
>;

const netLicensingEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description: "List the vendor's products.",
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Get one product by number.',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product.',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a product; fields left out stay as they are.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a product; forceCascade also deletes its modules, templates, licensees and licenses.',
	},
	'productModules.list': {
		riskLevel: 'read',
		description: 'List product modules.',
	},
	'productModules.get': {
		riskLevel: 'read',
		description: 'Get one product module by number.',
	},
	'productModules.create': {
		riskLevel: 'write',
		description: 'Create a product module with a licensing model.',
	},
	'productModules.update': {
		riskLevel: 'write',
		description: 'Update a product module.',
	},
	'productModules.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a product module; forceCascade also deletes what depends on it.',
	},
	'licenseTemplates.list': {
		riskLevel: 'read',
		description: 'List license templates.',
	},
	'licenseTemplates.get': {
		riskLevel: 'read',
		description: 'Get one license template by number.',
	},
	'licenseTemplates.create': {
		riskLevel: 'write',
		description: 'Create a license template in a product module.',
	},
	'licenseTemplates.update': {
		riskLevel: 'write',
		description: 'Update a license template.',
	},
	'licenseTemplates.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a license template; forceCascade also deletes its licenses.',
	},
	'licensees.list': {
		riskLevel: 'read',
		description: "List licensees (the vendor's customers).",
	},
	'licensees.get': {
		riskLevel: 'read',
		description: 'Get one licensee by number.',
	},
	'licensees.create': {
		riskLevel: 'write',
		description: 'Create a licensee for a product.',
	},
	'licensees.update': {
		riskLevel: 'write',
		description: 'Update a licensee.',
	},
	'licensees.delete': {
		riskLevel: 'destructive',
		description: 'Delete a licensee; forceCascade also deletes its licenses.',
	},
	'licensees.validate': {
		riskLevel: 'write',
		description:
			'Check which product modules a licensee may use; floating checkouts and pay-per-use counts change unless dryRun is true.',
	},
	'licensees.transfer': {
		riskLevel: 'destructive',
		description:
			'Move every license of a source licensee (marked for transfer) to this licensee; NetLicensing then removes the source licensee.',
	},
	'licenses.list': {
		riskLevel: 'read',
		description: "List the vendor's licenses.",
	},
	'licenses.get': {
		riskLevel: 'read',
		description: 'Get one license by number.',
	},
	'licenses.create': {
		riskLevel: 'write',
		description: 'Create a license for a licensee from a license template.',
	},
	'licenses.update': {
		riskLevel: 'write',
		description: 'Update a license, for example to deactivate it.',
	},
	'licenses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a license.',
	},
	'transactions.list': {
		riskLevel: 'read',
		description: 'List transactions, newest first.',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Get one transaction by number.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof netLicensingEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const netLicensingAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNetLicensingPlugin<T extends NetLicensingPluginOptions> =
	CorsairPlugin<
		'labs64netlicensing',
		typeof NetLicensingSchema,
		typeof netLicensingEndpointsNested,
		typeof netLicensingWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalNetLicensingPlugin =
	BaseNetLicensingPlugin<NetLicensingPluginOptions>;

export type ExternalNetLicensingPlugin<T extends NetLicensingPluginOptions> =
	BaseNetLicensingPlugin<T>;

export function labs64netlicensing<const T extends NetLicensingPluginOptions>(
	incomingOptions: NetLicensingPluginOptions &
		T = {} as NetLicensingPluginOptions & T,
): ExternalNetLicensingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'labs64netlicensing',
		authConfig: netLicensingAuthConfig,
		schema: NetLicensingSchema,
		options,
		hooks: options.hooks,
		endpoints: netLicensingEndpointsNested,
		webhooks: netLicensingWebhooksNested,
		endpointMeta: netLicensingEndpointMeta,
		endpointSchemas: netLicensingEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NetLicensingKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('labs64netlicensing', 'api_key');
		},
	} satisfies InternalNetLicensingPlugin;
}
