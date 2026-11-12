import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Catalog, Contacts, People } from './endpoints';
import type {
	RentmanEndpointInputs,
	RentmanEndpointOutputs,
} from './endpoints/types';
import {
	RentmanEndpointInputSchemas,
	RentmanEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RentmanSchema } from './schema';

export type RentmanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRentmanPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rentmanEndpointsNested>;
};

export type RentmanContext = CorsairPluginContext<
	typeof RentmanSchema,
	RentmanPluginOptions
>;

export type RentmanKeyBuilderContext = KeyBuilderContext<RentmanPluginOptions>;

export type RentmanBoundEndpoints = BindEndpoints<
	typeof rentmanEndpointsNested
>;

type RentmanEndpoint<K extends keyof RentmanEndpointOutputs> = CorsairEndpoint<
	RentmanContext,
	RentmanEndpointInputs[K],
	RentmanEndpointOutputs[K]
>;

export type RentmanEndpoints = {
	contactsList: RentmanEndpoint<'contactsList'>;
	contactsGet: RentmanEndpoint<'contactsGet'>;
	contactsCreate: RentmanEndpoint<'contactsCreate'>;
	contactsUpdate: RentmanEndpoint<'contactsUpdate'>;
	contactsDelete: RentmanEndpoint<'contactsDelete'>;
	projectsList: RentmanEndpoint<'projectsList'>;
	projectsGet: RentmanEndpoint<'projectsGet'>;
	projectsCreate: RentmanEndpoint<'projectsCreate'>;
	projectsUpdate: RentmanEndpoint<'projectsUpdate'>;
	equipmentList: RentmanEndpoint<'equipmentList'>;
	equipmentGet: RentmanEndpoint<'equipmentGet'>;
	equipmentCreate: RentmanEndpoint<'equipmentCreate'>;
	equipmentUpdate: RentmanEndpoint<'equipmentUpdate'>;
	crewList: RentmanEndpoint<'crewList'>;
	crewGet: RentmanEndpoint<'crewGet'>;
	appointmentsList: RentmanEndpoint<'appointmentsList'>;
	appointmentsGet: RentmanEndpoint<'appointmentsGet'>;
	invoicesList: RentmanEndpoint<'invoicesList'>;
	invoicesGet: RentmanEndpoint<'invoicesGet'>;
};

const rentmanEndpointsNested = {
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.remove,
	},
	projects: {
		list: Catalog.projectsList,
		get: Catalog.projectsGet,
		create: Catalog.projectsCreate,
		update: Catalog.projectsUpdate,
	},
	equipment: {
		list: Catalog.equipmentList,
		get: Catalog.equipmentGet,
		create: Catalog.equipmentCreate,
		update: Catalog.equipmentUpdate,
	},
	crew: {
		list: People.crewList,
		get: People.crewGet,
	},
	appointments: {
		list: People.appointmentsList,
		get: People.appointmentsGet,
	},
	invoices: {
		list: People.invoicesList,
		get: People.invoicesGet,
	},
} as const;

export const rentmanEndpointSchemas = {
	'contacts.list': {
		input: RentmanEndpointInputSchemas.contactsList,
		output: RentmanEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: RentmanEndpointInputSchemas.contactsGet,
		output: RentmanEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: RentmanEndpointInputSchemas.contactsCreate,
		output: RentmanEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: RentmanEndpointInputSchemas.contactsUpdate,
		output: RentmanEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: RentmanEndpointInputSchemas.contactsDelete,
		output: RentmanEndpointOutputSchemas.contactsDelete,
	},
	'projects.list': {
		input: RentmanEndpointInputSchemas.projectsList,
		output: RentmanEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: RentmanEndpointInputSchemas.projectsGet,
		output: RentmanEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: RentmanEndpointInputSchemas.projectsCreate,
		output: RentmanEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: RentmanEndpointInputSchemas.projectsUpdate,
		output: RentmanEndpointOutputSchemas.projectsUpdate,
	},
	'equipment.list': {
		input: RentmanEndpointInputSchemas.equipmentList,
		output: RentmanEndpointOutputSchemas.equipmentList,
	},
	'equipment.get': {
		input: RentmanEndpointInputSchemas.equipmentGet,
		output: RentmanEndpointOutputSchemas.equipmentGet,
	},
	'equipment.create': {
		input: RentmanEndpointInputSchemas.equipmentCreate,
		output: RentmanEndpointOutputSchemas.equipmentCreate,
	},
	'equipment.update': {
		input: RentmanEndpointInputSchemas.equipmentUpdate,
		output: RentmanEndpointOutputSchemas.equipmentUpdate,
	},
	'crew.list': {
		input: RentmanEndpointInputSchemas.crewList,
		output: RentmanEndpointOutputSchemas.crewList,
	},
	'crew.get': {
		input: RentmanEndpointInputSchemas.crewGet,
		output: RentmanEndpointOutputSchemas.crewGet,
	},
	'appointments.list': {
		input: RentmanEndpointInputSchemas.appointmentsList,
		output: RentmanEndpointOutputSchemas.appointmentsList,
	},
	'appointments.get': {
		input: RentmanEndpointInputSchemas.appointmentsGet,
		output: RentmanEndpointOutputSchemas.appointmentsGet,
	},
	'invoices.list': {
		input: RentmanEndpointInputSchemas.invoicesList,
		output: RentmanEndpointOutputSchemas.invoicesList,
	},
	'invoices.get': {
		input: RentmanEndpointInputSchemas.invoicesGet,
		output: RentmanEndpointOutputSchemas.invoicesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rentmanEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rentmanEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts with country, type and folder filters, field projection and cursor paging',
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Fetch one contact with its address blocks and linked items expanded on request',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Create a company or person contact with its mailing, visit and invoice addresses',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Update a contact: its name, code, addresses, coordinates or contact details',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact permanently',
	},
	'projects.list': {
		riskLevel: 'read',
		description:
			'List rental projects with name and number filters, field projection and cursor paging',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Fetch one project with its customer, totals and period fields, expanding linked items on request',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Create a project with its number, account manager and deposit settings (Rentman sets no customer through the API)',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Update a project: its name, number, reference, account manager or deposit settings',
	},
	'equipment.list': {
		riskLevel: 'read',
		description:
			'List equipment with name, code and shop-availability filters, field projection and cursor paging',
	},
	'equipment.get': {
		riskLevel: 'read',
		description:
			'Fetch one equipment item with its pricing, dimensions and stock settings',
	},
	'equipment.create': {
		riskLevel: 'write',
		description:
			'Create an equipment item with its code, price, replacement value, dimensions and remarks',
	},
	'equipment.update': {
		riskLevel: 'write',
		description:
			'Update an equipment item: its name, code, price, dimensions or remarks',
	},
	'crew.list': {
		riskLevel: 'read',
		description:
			'List crew members with name and active filters, field projection and cursor paging',
	},
	'crew.get': {
		riskLevel: 'read',
		description:
			'Fetch one crew member with their contact details, address and custom fields',
	},
	'appointments.list': {
		riskLevel: 'read',
		description:
			'List calendar appointments with start and end filters plus cursor paging',
	},
	'appointments.get': {
		riskLevel: 'read',
		description:
			'Fetch one appointment with its start, end, location and recurrence settings',
	},
	'invoices.list': {
		riskLevel: 'read',
		description:
			'List invoices with number and project filters plus cursor paging',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Fetch one invoice with its totals, balance and payment state',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof rentmanEndpointsNested>;

export type BaseRentmanPlugin<T extends RentmanPluginOptions> = CorsairPlugin<
	'rentman',
	typeof RentmanSchema,
	typeof rentmanEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRentmanPlugin = BaseRentmanPlugin<RentmanPluginOptions>;

export type ExternalRentmanPlugin<T extends RentmanPluginOptions> =
	BaseRentmanPlugin<T>;

export function rentman<const T extends RentmanPluginOptions>(
	incomingOptions: RentmanPluginOptions & T = {} as RentmanPluginOptions & T,
): ExternalRentmanPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rentman',
		schema: RentmanSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rentmanEndpointsNested,
		webhooks: {},
		endpointMeta: rentmanEndpointMeta,
		endpointSchemas: rentmanEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RentmanKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('rentman', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRentmanPlugin;
}

export { RentmanAPIError } from './client';

export type {
	AppointmentsGetInput,
	AppointmentsGetResponse,
	AppointmentsListInput,
	AppointmentsListResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	CrewGetInput,
	CrewGetResponse,
	CrewListInput,
	CrewListResponse,
	EquipmentCreateInput,
	EquipmentCreateResponse,
	EquipmentGetInput,
	EquipmentGetResponse,
	EquipmentListInput,
	EquipmentListResponse,
	EquipmentUpdateInput,
	EquipmentUpdateResponse,
	InvoicesGetInput,
	InvoicesGetResponse,
	InvoicesListInput,
	InvoicesListResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	RentmanAppointment,
	RentmanContact,
	RentmanCrewMember,
	RentmanEndpointInputs,
	RentmanEndpointOutputs,
	RentmanEquipment,
	RentmanInvoice,
	RentmanProject,
} from './endpoints/types';
