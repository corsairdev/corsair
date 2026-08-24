import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Clean,
	Find,
	Geolocate,
	IpLocate,
	Profile,
	Suggest,
} from './endpoints';
import type {
	DadataruEndpointInputs,
	DadataruEndpointOutputs,
} from './endpoints/types';
import {
	DadataruEndpointInputSchemas,
	DadataruEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DadataruSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveDadataruOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchDadataruTenantWebhook } from './webhooks/tenant-matcher';
import type { DadataruWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type DadataruPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	secret?: string;
	webhookSecret?: string;
	hooks?: InternalDadataruPlugin['hooks'];
	webhookHooks?: InternalDadataruPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dadataruEndpointsNested>;
};

export type DadataruContext = CorsairPluginContext<
	typeof DadataruSchema,
	DadataruPluginOptions
>;

export type DadataruKeyBuilderContext =
	KeyBuilderContext<DadataruPluginOptions>;

export type DadataruBoundEndpoints = BindEndpoints<
	typeof dadataruEndpointsNested
>;

type DadataruEndpoint<K extends keyof DadataruEndpointOutputs> =
	CorsairEndpoint<
		DadataruContext,
		DadataruEndpointInputs[K],
		DadataruEndpointOutputs[K]
	>;

export type DadataruEndpoints = {
	// Clean
	cleanAddress: DadataruEndpoint<'cleanAddress'>;
	cleanBirthdate: DadataruEndpoint<'cleanBirthdate'>;
	cleanRecord: DadataruEndpoint<'cleanRecord'>;
	cleanEmail: DadataruEndpoint<'cleanEmail'>;
	cleanName: DadataruEndpoint<'cleanName'>;
	cleanPassport: DadataruEndpoint<'cleanPassport'>;
	cleanPhone: DadataruEndpoint<'cleanPhone'>;
	cleanVehicle: DadataruEndpoint<'cleanVehicle'>;
	// Find
	findAddress: DadataruEndpoint<'findAddress'>;
	findFiasById: DadataruEndpoint<'findFiasById'>;
	findBank: DadataruEndpoint<'findBank'>;
	findPartyBy: DadataruEndpoint<'findPartyBy'>;
	findCarBrand: DadataruEndpoint<'findCarBrand'>;
	findCompanyByEmail: DadataruEndpoint<'findCompanyByEmail'>;
	findParty: DadataruEndpoint<'findParty'>;
	findCountry: DadataruEndpoint<'findCountry'>;
	findCourtById: DadataruEndpoint<'findCourtById'>;
	findCurrency: DadataruEndpoint<'findCurrency'>;
	findDelivery: DadataruEndpoint<'findDelivery'>;
	findFmsUnit: DadataruEndpoint<'findFmsUnit'>;
	findFnsUnit: DadataruEndpoint<'findFnsUnit'>;
	findFtsUnit: DadataruEndpoint<'findFtsUnit'>;
	findPartyKz: DadataruEndpoint<'findPartyKz'>;
	findMktu: DadataruEndpoint<'findMktu'>;
	findMedicalPositionById: DadataruEndpoint<'findMedicalPositionById'>;
	findOkpd2ById: DadataruEndpoint<'findOkpd2ById'>;
	findOkpdtrPosition: DadataruEndpoint<'findOkpdtrPosition'>;
	findOkpdtrProfession: DadataruEndpoint<'findOkpdtrProfession'>;
	findOkved2: DadataruEndpoint<'findOkved2'>;
	findPostalOffice: DadataruEndpoint<'findPostalOffice'>;
	findPostalUnitById: DadataruEndpoint<'findPostalUnitById'>;
	findOktmoById: DadataruEndpoint<'findOktmoById'>;
	// Geolocate
	geolocateAddress: DadataruEndpoint<'geolocateAddress'>;
	geolocatePostalUnit: DadataruEndpoint<'geolocatePostalUnit'>;
	// Profile
	getProfileBalance: DadataruEndpoint<'getProfileBalance'>;
	getProfileStatistics: DadataruEndpoint<'getProfileStatistics'>;
	getReferenceVersions: DadataruEndpoint<'getReferenceVersions'>;
	// IP Locate
	ipLocateAddress: DadataruEndpoint<'ipLocateAddress'>;
	// Suggest
	suggestAddress: DadataruEndpoint<'suggestAddress'>;
	suggestBank: DadataruEndpoint<'suggestBank'>;
	suggestPartyBy: DadataruEndpoint<'suggestPartyBy'>;
	suggestCarBrand: DadataruEndpoint<'suggestCarBrand'>;
	suggestCountry: DadataruEndpoint<'suggestCountry'>;
	suggestCourt: DadataruEndpoint<'suggestCourt'>;
	suggestCurrency: DadataruEndpoint<'suggestCurrency'>;
	suggestEmail: DadataruEndpoint<'suggestEmail'>;
	suggestFias: DadataruEndpoint<'suggestFias'>;
	suggestFmsUnit: DadataruEndpoint<'suggestFmsUnit'>;
	suggestFnsUnit: DadataruEndpoint<'suggestFnsUnit'>;
	suggestFtsUnit: DadataruEndpoint<'suggestFtsUnit'>;
	suggestPartyKz: DadataruEndpoint<'suggestPartyKz'>;
	suggestMktu: DadataruEndpoint<'suggestMktu'>;
	suggestMedicalPosition: DadataruEndpoint<'suggestMedicalPosition'>;
	suggestMetro: DadataruEndpoint<'suggestMetro'>;
	suggestName: DadataruEndpoint<'suggestName'>;
	suggestOkpd2: DadataruEndpoint<'suggestOkpd2'>;
	suggestOkpdtrPosition: DadataruEndpoint<'suggestOkpdtrPosition'>;
	suggestOkpdtrProfession: DadataruEndpoint<'suggestOkpdtrProfession'>;
	suggestOktmo: DadataruEndpoint<'suggestOktmo'>;
	suggestOkved2: DadataruEndpoint<'suggestOkved2'>;
	suggestParty: DadataruEndpoint<'suggestParty'>;
	suggestPostalOffice: DadataruEndpoint<'suggestPostalOffice'>;
	suggestPostalUnit: DadataruEndpoint<'suggestPostalUnit'>;
};

type DadataruWebhook<
	K extends keyof DadataruWebhookOutputs,
	TEvent,
> = CorsairWebhook<DadataruContext, TEvent, DadataruWebhookOutputs[K]>;

export type DadataruWebhooks = {
	example: DadataruWebhook<'example', ExampleEvent>;
};

export type DadataruBoundWebhooks = BindWebhooks<DadataruWebhooks>;

const dadataruEndpointsNested = {
	clean: {
		address: Clean.address,
		birthdate: Clean.birthdate,
		record: Clean.cleanRecord,
		email: Clean.email,
		name: Clean.name,
		passport: Clean.passport,
		phone: Clean.phone,
		vehicle: Clean.vehicle,
	},
	find: {
		address: Find.address,
		fiasById: Find.fiasById,
		bank: Find.bank,
		partyBy: Find.partyBy,
		carBrand: Find.carBrand,
		companyByEmail: Find.companyByEmail,
		party: Find.party,
		country: Find.country,
		courtById: Find.courtById,
		currency: Find.currency,
		delivery: Find.delivery,
		fmsUnit: Find.fmsUnit,
		fnsUnit: Find.fnsUnit,
		ftsUnit: Find.ftsUnit,
		partyKz: Find.partyKz,
		mktu: Find.mktu,
		medicalPositionById: Find.medicalPositionById,
		okpd2ById: Find.okpd2ById,
		okpdtrPosition: Find.okpdtrPosition,
		okpdtrProfession: Find.okpdtrProfession,
		okved2: Find.okved2,
		postalOffice: Find.postalOffice,
		postalUnitById: Find.postalUnitById,
		oktmoById: Find.oktmoById,
	},
	geolocate: {
		address: Geolocate.address,
		postalUnit: Geolocate.postalUnit,
	},
	profile: {
		balance: Profile.balance,
		statistics: Profile.statistics,
		versions: Profile.versions,
	},
	ipLocate: {
		address: IpLocate.address,
	},
	suggest: {
		address: Suggest.address,
		bank: Suggest.bank,
		partyBy: Suggest.partyBy,
		carBrand: Suggest.carBrand,
		country: Suggest.country,
		court: Suggest.court,
		currency: Suggest.currency,
		email: Suggest.email,
		fias: Suggest.fias,
		fmsUnit: Suggest.fmsUnit,
		fnsUnit: Suggest.fnsUnit,
		ftsUnit: Suggest.ftsUnit,
		partyKz: Suggest.partyKz,
		mktu: Suggest.mktu,
		medicalPosition: Suggest.medicalPosition,
		metro: Suggest.metro,
		name: Suggest.name,
		okpd2: Suggest.okpd2,
		okpdtrPosition: Suggest.okpdtrPosition,
		okpdtrProfession: Suggest.okpdtrProfession,
		oktmo: Suggest.oktmo,
		okved2: Suggest.okved2,
		party: Suggest.party,
		postalOffice: Suggest.postalOffice,
		postalUnit: Suggest.postalUnit,
	},
} as const;

const dadataruWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const dadataruEndpointSchemas = {
	// Clean
	'clean.address': {
		input: DadataruEndpointInputSchemas.cleanAddress,
		output: DadataruEndpointOutputSchemas.cleanAddress,
	},
	'clean.birthdate': {
		input: DadataruEndpointInputSchemas.cleanBirthdate,
		output: DadataruEndpointOutputSchemas.cleanBirthdate,
	},
	'clean.record': {
		input: DadataruEndpointInputSchemas.cleanRecord,
		output: DadataruEndpointOutputSchemas.cleanRecord,
	},
	'clean.email': {
		input: DadataruEndpointInputSchemas.cleanEmail,
		output: DadataruEndpointOutputSchemas.cleanEmail,
	},
	'clean.name': {
		input: DadataruEndpointInputSchemas.cleanName,
		output: DadataruEndpointOutputSchemas.cleanName,
	},
	'clean.passport': {
		input: DadataruEndpointInputSchemas.cleanPassport,
		output: DadataruEndpointOutputSchemas.cleanPassport,
	},
	'clean.phone': {
		input: DadataruEndpointInputSchemas.cleanPhone,
		output: DadataruEndpointOutputSchemas.cleanPhone,
	},
	'clean.vehicle': {
		input: DadataruEndpointInputSchemas.cleanVehicle,
		output: DadataruEndpointOutputSchemas.cleanVehicle,
	},
	// Find
	'find.address': {
		input: DadataruEndpointInputSchemas.findAddress,
		output: DadataruEndpointOutputSchemas.findAddress,
	},
	'find.fiasById': {
		input: DadataruEndpointInputSchemas.findFiasById,
		output: DadataruEndpointOutputSchemas.findFiasById,
	},
	'find.bank': {
		input: DadataruEndpointInputSchemas.findBank,
		output: DadataruEndpointOutputSchemas.findBank,
	},
	'find.partyBy': {
		input: DadataruEndpointInputSchemas.findPartyBy,
		output: DadataruEndpointOutputSchemas.findPartyBy,
	},
	'find.carBrand': {
		input: DadataruEndpointInputSchemas.findCarBrand,
		output: DadataruEndpointOutputSchemas.findCarBrand,
	},
	'find.companyByEmail': {
		input: DadataruEndpointInputSchemas.findCompanyByEmail,
		output: DadataruEndpointOutputSchemas.findCompanyByEmail,
	},
	'find.party': {
		input: DadataruEndpointInputSchemas.findParty,
		output: DadataruEndpointOutputSchemas.findParty,
	},
	'find.country': {
		input: DadataruEndpointInputSchemas.findCountry,
		output: DadataruEndpointOutputSchemas.findCountry,
	},
	'find.courtById': {
		input: DadataruEndpointInputSchemas.findCourtById,
		output: DadataruEndpointOutputSchemas.findCourtById,
	},
	'find.currency': {
		input: DadataruEndpointInputSchemas.findCurrency,
		output: DadataruEndpointOutputSchemas.findCurrency,
	},
	'find.delivery': {
		input: DadataruEndpointInputSchemas.findDelivery,
		output: DadataruEndpointOutputSchemas.findDelivery,
	},
	'find.fmsUnit': {
		input: DadataruEndpointInputSchemas.findFmsUnit,
		output: DadataruEndpointOutputSchemas.findFmsUnit,
	},
	'find.fnsUnit': {
		input: DadataruEndpointInputSchemas.findFnsUnit,
		output: DadataruEndpointOutputSchemas.findFnsUnit,
	},
	'find.ftsUnit': {
		input: DadataruEndpointInputSchemas.findFtsUnit,
		output: DadataruEndpointOutputSchemas.findFtsUnit,
	},
	'find.partyKz': {
		input: DadataruEndpointInputSchemas.findPartyKz,
		output: DadataruEndpointOutputSchemas.findPartyKz,
	},
	'find.mktu': {
		input: DadataruEndpointInputSchemas.findMktu,
		output: DadataruEndpointOutputSchemas.findMktu,
	},
	'find.medicalPositionById': {
		input: DadataruEndpointInputSchemas.findMedicalPositionById,
		output: DadataruEndpointOutputSchemas.findMedicalPositionById,
	},
	'find.okpd2ById': {
		input: DadataruEndpointInputSchemas.findOkpd2ById,
		output: DadataruEndpointOutputSchemas.findOkpd2ById,
	},
	'find.okpdtrPosition': {
		input: DadataruEndpointInputSchemas.findOkpdtrPosition,
		output: DadataruEndpointOutputSchemas.findOkpdtrPosition,
	},
	'find.okpdtrProfession': {
		input: DadataruEndpointInputSchemas.findOkpdtrProfession,
		output: DadataruEndpointOutputSchemas.findOkpdtrProfession,
	},
	'find.okved2': {
		input: DadataruEndpointInputSchemas.findOkved2,
		output: DadataruEndpointOutputSchemas.findOkved2,
	},
	'find.postalOffice': {
		input: DadataruEndpointInputSchemas.findPostalOffice,
		output: DadataruEndpointOutputSchemas.findPostalOffice,
	},
	'find.postalUnitById': {
		input: DadataruEndpointInputSchemas.findPostalUnitById,
		output: DadataruEndpointOutputSchemas.findPostalUnitById,
	},
	'find.oktmoById': {
		input: DadataruEndpointInputSchemas.findOktmoById,
		output: DadataruEndpointOutputSchemas.findOktmoById,
	},
	// Geolocate
	'geolocate.address': {
		input: DadataruEndpointInputSchemas.geolocateAddress,
		output: DadataruEndpointOutputSchemas.geolocateAddress,
	},
	'geolocate.postalUnit': {
		input: DadataruEndpointInputSchemas.geolocatePostalUnit,
		output: DadataruEndpointOutputSchemas.geolocatePostalUnit,
	},
	// Profile
	'profile.balance': {
		input: DadataruEndpointInputSchemas.getProfileBalance,
		output: DadataruEndpointOutputSchemas.getProfileBalance,
	},
	'profile.statistics': {
		input: DadataruEndpointInputSchemas.getProfileStatistics,
		output: DadataruEndpointOutputSchemas.getProfileStatistics,
	},
	'profile.versions': {
		input: DadataruEndpointInputSchemas.getReferenceVersions,
		output: DadataruEndpointOutputSchemas.getReferenceVersions,
	},
	// IP Locate
	'ipLocate.address': {
		input: DadataruEndpointInputSchemas.ipLocateAddress,
		output: DadataruEndpointOutputSchemas.ipLocateAddress,
	},
	// Suggest
	'suggest.address': {
		input: DadataruEndpointInputSchemas.suggestAddress,
		output: DadataruEndpointOutputSchemas.suggestAddress,
	},
	'suggest.bank': {
		input: DadataruEndpointInputSchemas.suggestBank,
		output: DadataruEndpointOutputSchemas.suggestBank,
	},
	'suggest.partyBy': {
		input: DadataruEndpointInputSchemas.suggestPartyBy,
		output: DadataruEndpointOutputSchemas.suggestPartyBy,
	},
	'suggest.carBrand': {
		input: DadataruEndpointInputSchemas.suggestCarBrand,
		output: DadataruEndpointOutputSchemas.suggestCarBrand,
	},
	'suggest.country': {
		input: DadataruEndpointInputSchemas.suggestCountry,
		output: DadataruEndpointOutputSchemas.suggestCountry,
	},
	'suggest.court': {
		input: DadataruEndpointInputSchemas.suggestCourt,
		output: DadataruEndpointOutputSchemas.suggestCourt,
	},
	'suggest.currency': {
		input: DadataruEndpointInputSchemas.suggestCurrency,
		output: DadataruEndpointOutputSchemas.suggestCurrency,
	},
	'suggest.email': {
		input: DadataruEndpointInputSchemas.suggestEmail,
		output: DadataruEndpointOutputSchemas.suggestEmail,
	},
	'suggest.fias': {
		input: DadataruEndpointInputSchemas.suggestFias,
		output: DadataruEndpointOutputSchemas.suggestFias,
	},
	'suggest.fmsUnit': {
		input: DadataruEndpointInputSchemas.suggestFmsUnit,
		output: DadataruEndpointOutputSchemas.suggestFmsUnit,
	},
	'suggest.fnsUnit': {
		input: DadataruEndpointInputSchemas.suggestFnsUnit,
		output: DadataruEndpointOutputSchemas.suggestFnsUnit,
	},
	'suggest.ftsUnit': {
		input: DadataruEndpointInputSchemas.suggestFtsUnit,
		output: DadataruEndpointOutputSchemas.suggestFtsUnit,
	},
	'suggest.partyKz': {
		input: DadataruEndpointInputSchemas.suggestPartyKz,
		output: DadataruEndpointOutputSchemas.suggestPartyKz,
	},
	'suggest.mktu': {
		input: DadataruEndpointInputSchemas.suggestMktu,
		output: DadataruEndpointOutputSchemas.suggestMktu,
	},
	'suggest.medicalPosition': {
		input: DadataruEndpointInputSchemas.suggestMedicalPosition,
		output: DadataruEndpointOutputSchemas.suggestMedicalPosition,
	},
	'suggest.metro': {
		input: DadataruEndpointInputSchemas.suggestMetro,
		output: DadataruEndpointOutputSchemas.suggestMetro,
	},
	'suggest.name': {
		input: DadataruEndpointInputSchemas.suggestName,
		output: DadataruEndpointOutputSchemas.suggestName,
	},
	'suggest.okpd2': {
		input: DadataruEndpointInputSchemas.suggestOkpd2,
		output: DadataruEndpointOutputSchemas.suggestOkpd2,
	},
	'suggest.okpdtrPosition': {
		input: DadataruEndpointInputSchemas.suggestOkpdtrPosition,
		output: DadataruEndpointOutputSchemas.suggestOkpdtrPosition,
	},
	'suggest.okpdtrProfession': {
		input: DadataruEndpointInputSchemas.suggestOkpdtrProfession,
		output: DadataruEndpointOutputSchemas.suggestOkpdtrProfession,
	},
	'suggest.oktmo': {
		input: DadataruEndpointInputSchemas.suggestOktmo,
		output: DadataruEndpointOutputSchemas.suggestOktmo,
	},
	'suggest.okved2': {
		input: DadataruEndpointInputSchemas.suggestOkved2,
		output: DadataruEndpointOutputSchemas.suggestOkved2,
	},
	'suggest.party': {
		input: DadataruEndpointInputSchemas.suggestParty,
		output: DadataruEndpointOutputSchemas.suggestParty,
	},
	'suggest.postalOffice': {
		input: DadataruEndpointInputSchemas.suggestPostalOffice,
		output: DadataruEndpointOutputSchemas.suggestPostalOffice,
	},
	'suggest.postalUnit': {
		input: DadataruEndpointInputSchemas.suggestPostalUnit,
		output: DadataruEndpointOutputSchemas.suggestPostalUnit,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dadataruEndpointsNested
>;

const dadataruWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof dadataruWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dadataruEndpointMeta = {
	// Clean
	'clean.address': {
		riskLevel: 'read',
		description: 'Clean and standardize Russian addresses',
	},
	'clean.birthdate': {
		riskLevel: 'read',
		description: 'Clean and standardize birthdates',
	},
	'clean.record': {
		riskLevel: 'read',
		description: 'Clean composite multi-field records',
	},
	'clean.email': {
		riskLevel: 'read',
		description: 'Clean and standardize email addresses',
	},
	'clean.name': {
		riskLevel: 'read',
		description: 'Clean and parse full names',
	},
	'clean.passport': {
		riskLevel: 'read',
		description: 'Clean and validate Russian passport numbers',
	},
	'clean.phone': {
		riskLevel: 'read',
		description: 'Clean and standardize phone numbers',
	},
	'clean.vehicle': {
		riskLevel: 'read',
		description: 'Clean and recognize vehicle models',
	},
	// Find
	'find.address': {
		riskLevel: 'read',
		description: 'Find address details by ID',
	},
	'find.fiasById': {
		riskLevel: 'read',
		description: 'Find address by FIAS ID',
	},
	'find.bank': { riskLevel: 'read', description: 'Find bank details' },
	'find.partyBy': {
		riskLevel: 'read',
		description: 'Find Belarus party by UNP',
	},
	'find.carBrand': { riskLevel: 'read', description: 'Find car brand details' },
	'find.companyByEmail': {
		riskLevel: 'read',
		description: 'Find companies by email domain',
	},
	'find.party': {
		riskLevel: 'read',
		description: 'Find Russian party/company details',
	},
	'find.country': { riskLevel: 'read', description: 'Find country metadata' },
	'find.courtById': {
		riskLevel: 'read',
		description: 'Find court details by ID',
	},
	'find.currency': { riskLevel: 'read', description: 'Find currency details' },
	'find.delivery': {
		riskLevel: 'read',
		description: 'Find delivery city mapping IDs',
	},
	'find.fmsUnit': {
		riskLevel: 'read',
		description: 'Find passport issuing authority (FMS)',
	},
	'find.fnsUnit': {
		riskLevel: 'read',
		description: 'Find tax office (FNS) details',
	},
	'find.ftsUnit': {
		riskLevel: 'read',
		description: 'Find customs office (FTS) details',
	},
	'find.partyKz': {
		riskLevel: 'read',
		description: 'Find Kazakhstan company details',
	},
	'find.mktu': {
		riskLevel: 'read',
		description: 'Find MKTU trademark classification items',
	},
	'find.medicalPositionById': {
		riskLevel: 'read',
		description: 'Find medical positions by ID',
	},
	'find.okpd2ById': {
		riskLevel: 'read',
		description: 'Find OKPD2 classifications by ID',
	},
	'find.okpdtrPosition': {
		riskLevel: 'read',
		description: 'Find OKPDTR job positions by code',
	},
	'find.okpdtrProfession': {
		riskLevel: 'read',
		description: 'Find OKPDTR worker professions',
	},
	'find.okved2': {
		riskLevel: 'read',
		description: 'Find OKVED2 economic activities',
	},
	'find.postalOffice': {
		riskLevel: 'read',
		description: 'Find postal office details',
	},
	'find.postalUnitById': {
		riskLevel: 'read',
		description: 'Find postal unit details',
	},
	'find.oktmoById': {
		riskLevel: 'read',
		description: 'Find territory details by OKTMO code',
	},
	// Geolocate
	'geolocate.address': {
		riskLevel: 'read',
		description: 'Find addresses near coordinates',
	},
	'geolocate.postalUnit': {
		riskLevel: 'read',
		description: 'Find postal units near coordinates',
	},
	// Profile
	'profile.balance': {
		riskLevel: 'read',
		description: 'Get current account balance',
	},
	'profile.statistics': {
		riskLevel: 'read',
		description: 'Get usage statistics',
	},
	'profile.versions': {
		riskLevel: 'read',
		description: 'Get reference database update versions',
	},
	// IP Locate
	'ipLocate.address': {
		riskLevel: 'read',
		description: 'Geolocate address by IP',
	},
	// Suggest
	'suggest.address': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest addresses',
	},
	'suggest.bank': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest banks',
	},
	'suggest.partyBy': {
		riskLevel: 'read',
		description: 'Suggest Belarus parties/companies',
	},
	'suggest.carBrand': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest car brands',
	},
	'suggest.country': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest countries',
	},
	'suggest.court': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest courts',
	},
	'suggest.currency': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest currencies',
	},
	'suggest.email': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest emails',
	},
	'suggest.fias': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest FIAS addresses',
	},
	'suggest.fmsUnit': {
		riskLevel: 'read',
		description: 'Suggest passport issuing departments',
	},
	'suggest.fnsUnit': {
		riskLevel: 'read',
		description: 'Suggest tax inspection (FNS) offices',
	},
	'suggest.ftsUnit': {
		riskLevel: 'read',
		description: 'Suggest customs (FTS) offices',
	},
	'suggest.partyKz': {
		riskLevel: 'read',
		description: 'Suggest Kazakhstan parties/companies',
	},
	'suggest.mktu': {
		riskLevel: 'read',
		description: 'Suggest MKTU trademark classifications',
	},
	'suggest.medicalPosition': {
		riskLevel: 'read',
		description: 'Suggest medical positions/specialties',
	},
	'suggest.metro': { riskLevel: 'read', description: 'Suggest metro stations' },
	'suggest.name': {
		riskLevel: 'read',
		description: 'Autocomplete and suggest names (FIO)',
	},
	'suggest.okpd2': {
		riskLevel: 'read',
		description: 'Suggest product classification (OKPD2) codes',
	},
	'suggest.okpdtrPosition': {
		riskLevel: 'read',
		description: 'Suggest job positions from OKPDTR classifier',
	},
	'suggest.okpdtrProfession': {
		riskLevel: 'read',
		description: 'Suggest worker professions from OKPDTR',
	},
	'suggest.oktmo': {
		riskLevel: 'read',
		description: 'Suggest municipal territories (OKTMO)',
	},
	'suggest.okved2': {
		riskLevel: 'read',
		description: 'Suggest economic activities (OKVED2)',
	},
	'suggest.party': {
		riskLevel: 'read',
		description: 'Suggest Russian parties/companies',
	},
	'suggest.postalOffice': {
		riskLevel: 'read',
		description: 'Suggest postal offices',
	},
	'suggest.postalUnit': {
		riskLevel: 'read',
		description: 'Suggest postal units',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dadataruEndpointsNested>;

export const dadataruAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDadataruPlugin<T extends DadataruPluginOptions> = CorsairPlugin<
	'dadataru',
	typeof DadataruSchema,
	typeof dadataruEndpointsNested,
	typeof dadataruWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDadataruPlugin = BaseDadataruPlugin<DadataruPluginOptions>;

export type ExternalDadataruPlugin<T extends DadataruPluginOptions> =
	BaseDadataruPlugin<T>;

export function dadataru<const T extends DadataruPluginOptions>(
	incomingOptions: DadataruPluginOptions & T = {} as DadataruPluginOptions & T,
): ExternalDadataruPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dadataru',
		authConfig: dadataruAuthConfig,
		schema: DadataruSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: dadataruEndpointsNested,
		webhooks: dadataruWebhooksNested,
		endpointMeta: dadataruEndpointMeta,
		endpointSchemas: dadataruEndpointSchemas,
		webhookSchemas: dadataruWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// TODO: Update to match your webhook signature headers
			return 'x-dadataru-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchDadataruTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveDadataruOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DadataruKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalDadataruPlugin;
}

export type {
	BalanceResponse,
	CleanInput,
	CleanResponse,
	CompositeCleanInput,
	CompositeCleanResponse,
	DadataruEndpointInputs,
	DadataruEndpointOutputs,
	GeolocateInput,
	IpLocateInput,
	IpLocateResponse,
	QueryInput,
	StatisticsResponse,
	SuggestResponse,
	VersionsResponse,
} from './endpoints/types';
export type {
	DadataruWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
