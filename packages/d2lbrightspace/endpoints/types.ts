import { z } from 'zod';
import type { D2lRouteDefinition } from '../route-definitions';

export type D2lJsonValue =
	| null
	| boolean
	| number
	| string
	| D2lJsonValue[]
	| { [key: string]: D2lJsonValue };

export type D2lQueryValue = string | number | boolean | undefined;

export type D2lFormValue =
	| string
	| number
	| boolean
	| readonly (string | number | boolean)[];

export type D2lFileUploadInput = {
	filename: string;
	contentType: string;
	base64: string;
};

export type D2lRouteInput = {
	pathParams: Record<string, string>;
	query?: Record<string, D2lQueryValue>;
	body?: D2lJsonValue;
	form?: Record<string, D2lFormValue>;
	files?: D2lFileUploadInput[];
	upload?: D2lFileUploadInput;
};

export type D2lUploadSessionOutput = {
	kind: 'upload_session';
	fileKey: string;
	uploadedBytes: number;
};

export type D2lRouteOutput =
	| D2lJsonValue
	| D2lBinaryResponse
	| D2lUploadSessionOutput
	| undefined;

export type D2lBinaryResponse = {
	kind: 'binary';
	contentType: string;
	base64: string;
	sizeBytes: number;
};

function queryValueSchema(route: D2lRouteDefinition, name: string) {
	const typeName =
		route.queryDetails
			.find((detail) => detail.name === name)
			?.type.toLowerCase() ?? 'string';
	if (typeName.includes('boolean')) return z.boolean();
	if (
		typeName.includes('number') ||
		typeName.includes('integer') ||
		typeName.includes('d2lid')
	) {
		return z.union([z.string(), z.number()]);
	}
	return z.string();
}

// D2L documents that response resource fields can be added without changing an API version.
const ProductVersionsSchema = z
	.object({
		ProductCode: z.string(),
		LatestVersion: z.string(),
		SupportedVersions: z.array(z.string()),
	})
	.passthrough();

const SupportedVersionSchema = z
	.object({
		Supported: z.boolean(),
		LatestVersion: z.string(),
	})
	.passthrough();

const SupportedVersionRequestSchema = z
	.object({
		ProductCode: z.string(),
		Version: z.string(),
	})
	.strict();

const BulkSupportedVersionResponseSchema = z
	.object({
		Supported: z.boolean(),
		Versions: z.array(
			z
				.object({
					ProductCode: z.string(),
					Version: z.string(),
					Supported: z.boolean(),
					LatestVersion: z.string(),
				})
				.passthrough(),
		),
	})
	.passthrough();

const apiPropertiesOutputSchemas = {
	d2l0001: ProductVersionsSchema,
	d2l0002: SupportedVersionSchema,
	d2l0003: z.array(ProductVersionsSchema),
	d2l0004: BulkSupportedVersionResponseSchema,
} as const;

const UserActivationDataSchema = z.object({ IsActive: z.boolean() }).strict();
const UserPasswordDataSchema = z
	.object({ Password: z.string(), ForcePasswordReset: z.boolean() })
	.strict();
const UserResetPasswordSchema = z
	.object({ ForcePasswordReset: z.boolean() })
	.strict();
const LegalPreferredNamesSchema = z
	.object({
		LegalFirstName: z.string(),
		LegalLastName: z.string(),
		PreferredFirstName: z.string().nullable(),
		PreferredLastName: z.string().nullable(),
		SortLastName: z.string().nullable(),
	})
	.strict();
const UserPronounsInputSchema = z
	.object({
		UserDefinedPronouns: z.string().nullable(),
		ShowPronouns: z.boolean(),
		UseUserDefinedPronouns: z.boolean(),
	})
	.strict();
const UserPronounsOutputSchema = z
	.object({
		UserDefinedPronouns: z.string().nullable(),
		SystemDefinedPronouns: z.string().nullable(),
		ShowPronouns: z.boolean(),
		UseUserDefinedPronouns: z.boolean(),
	})
	.passthrough();
const PronounsVisibilitySchema = z
	.object({ ShowPronouns: z.boolean() })
	.passthrough();
const UserDataSchema = z
	.object({
		OrgId: z.number(),
		UserId: z.number(),
		FirstName: z.string(),
		MiddleName: z.string().nullable(),
		LastName: z.string(),
		UserName: z.string(),
		ExternalEmail: z.string().nullable(),
		OrgDefinedId: z.string().nullable(),
		UniqueIdentifier: z.string(),
		Activation: UserActivationDataSchema,
		DisplayName: z.string(),
		LastAccessedDate: z.string().nullable(),
		Pronouns: z.string(),
		FirstLoginDate: z.string().nullable(),
	})
	.passthrough();
const WhoAmIUserSchema = z
	.object({
		Identifier: z.string(),
		FirstName: z.string(),
		LastName: z.string(),
		UniqueName: z.string(),
		ProfileIdentifier: z.string(),
		Pronouns: z.string(),
	})
	.passthrough();
const EnrollmentLogDataSchema = z
	.object({
		LogId: z.number(),
		Date: z.string(),
		Action: z.number(),
		OrgUnitId: z.number(),
		OrgUnitTypeId: z.number(),
		OrgUnitName: z.string(),
		OrgUnitCode: z.string(),
		RoleId: z.number(),
		EnrolledBy: z.number().nullable(),
	})
	.passthrough();
const UserTrackingLogSchema = z
	.object({
		LoginDate: z.string(),
		IpAddress: z.string(),
		DaysOff: z.number().nullable(),
	})
	.passthrough();
const BatchUserCreateErrorSchema = z
	.object({
		UserName: z.string(),
		StatusError: z.number(),
		StatusMessage: z.string(),
	})
	.passthrough();
const UsersPagedSchema = (itemSchema: z.ZodType) =>
	z
		.object({
			PagingInfo: z
				.object({ Bookmark: z.string(), HasMoreItems: z.boolean() })
				.passthrough(),
			Items: z.array(itemSchema),
		})
		.passthrough();
const UserStatsSchema = z
	.object({
		TotalUsers: z.number(),
		ActiveUsers: z.number(),
		InactiveUsers: z.number(),
		LockedUsers: z.number(),
		UnenrolledUsers: z.number(),
		OnlineUsers: z.number(),
		NeverLoggedInUsers: z.number(),
	})
	.passthrough();
const UsersRolesStatsSchema = z
	.object({
		OrgRoleStatistics: z.array(
			z.object({ RoleId: z.number(), UserCount: z.number() }).passthrough(),
		),
	})
	.passthrough();

// D2L documents additive response fields within the same API version; keep the known resource fields validated while tolerating documented additions.
const userOutputSchemas: Record<string, z.ZodType> = {
	d2l0854: z.union([
		UserDataSchema,
		z.array(UserDataSchema),
		UsersPagedSchema(UserDataSchema),
	]),
	d2l0855: UserDataSchema,
	d2l0857: UserDataSchema,
	d2l0858: UserDataSchema,
	d2l0859: UserActivationDataSchema,
	d2l0861: UsersPagedSchema(EnrollmentLogDataSchema),
	d2l0862: LegalPreferredNamesSchema,
	d2l0863: LegalPreferredNamesSchema,
	d2l0867: z.array(UserTrackingLogSchema),
	d2l0868: z
		.object({
			CreatedUsers: z.array(UserDataSchema),
			Errors: z.array(BatchUserCreateErrorSchema),
		})
		.passthrough(),
	d2l0870: UserPronounsOutputSchema,
	d2l0871: UserPronounsOutputSchema,
	d2l0872: PronounsVisibilitySchema,
	d2l0873: PronounsVisibilitySchema,
	d2l0874: UsersRolesStatsSchema,
	d2l0875: UserStatsSchema,
	d2l0876: WhoAmIUserSchema,
};

const userInputSchemas: Record<string, z.ZodType> = {
	d2l0855: z
		.object({
			OrgDefinedId: z.string().nullable(),
			FirstName: z.string(),
			MiddleName: z.string().nullable(),
			LastName: z.string(),
			ExternalEmail: z.string().nullable(),
			UserName: z.string(),
			RoleId: z.number(),
			IsActive: z.boolean(),
			SendCreationEmail: z.boolean(),
			Pronouns: z.string().nullable(),
			PasswordData: UserPasswordDataSchema.nullable().optional(),
		})
		.strict(),
	d2l0858: z
		.object({
			OrgDefinedId: z.string(),
			FirstName: z.string(),
			MiddleName: z.string().nullable(),
			LastName: z.string(),
			ExternalEmail: z.string().nullable(),
			UserName: z.string(),
			Activation: UserActivationDataSchema,
			Pronouns: z.string().nullable(),
		})
		.strict(),
	d2l0860: UserActivationDataSchema,
	d2l0863: LegalPreferredNamesSchema,
	d2l0865: UserResetPasswordSchema,
	d2l0866: UserPasswordDataSchema,
	d2l0868: z.array(
		z
			.object({
				OrgDefinedId: z.string().nullable(),
				FirstName: z.string(),
				MiddleName: z.string().nullable(),
				LastName: z.string(),
				ExternalEmail: z.string().nullable(),
				UserName: z.string(),
				RoleId: z.number(),
				IsActive: z.boolean(),
				SendCreationEmail: z.boolean(),
				Pronouns: z.string().nullable(),
				PasswordData: UserPasswordDataSchema.nullable().optional(),
			})
			.strict(),
	),
	d2l0869: z
		.object({
			SourceUserId: z.number(),
			DestinationUserId: z.number(),
			IncludedTools: z.array(z.enum(['awards', 'enrollments'])),
			DeleteSourceUser: z.boolean(),
		})
		.strict(),
	d2l0871: UserPronounsInputSchema,
	d2l0873: PronounsVisibilitySchema.strict(),
};

const formScalarSchema = z.union([z.string(), z.number(), z.boolean()]);
const fileUploadSchema = z
	.object({
		filename: z.string().min(1).max(255),
		contentType: z.string().min(1).max(255),
		base64: z
			.string()
			.max(35_000_000)
			.regex(
				/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
			),
	})
	.strict();

/**
 * Creates a closed route-input envelope using only the path and query names
 * listed on the linked official D2L operation page.
 */
export function createD2lRouteInputSchema(route: D2lRouteDefinition) {
	const pathParamsSchema = z
		.object(
			Object.fromEntries(
				route.pathParams.map((name) => [name, z.string().min(1)]),
			),
		)
		.strict();
	const querySchema = z
		.object(
			Object.fromEntries(
				route.queryParams.map((name) => [
					name,
					new Set<string>(route.requiredQueryParams).has(name)
						? queryValueSchema(route, name)
						: queryValueSchema(route, name).optional(),
				]),
			),
		)
		.strict();
	const bodySchema =
		route.routeId === 'd2l0004'
			? z.array(SupportedVersionRequestSchema)
			: (userInputSchemas[route.routeId] ?? z.json());
	const uploadShape =
		route.requestMode === 'resumable'
			? route.routeId === 'd2l0056'
				? { upload: fileUploadSchema.optional() }
				: { upload: fileUploadSchema }
			: {};
	const requiredFormFields = new Set<string>(route.requiredFormFields);
	const formSchema = z
		.object(
			Object.fromEntries(
				route.formDetails.map((field) => {
					const valueSchema = field.repeatable
						? z.array(formScalarSchema).min(field.required ? 1 : 0)
						: formScalarSchema;
					return [
						field.name,
						requiredFormFields.has(field.name)
							? valueSchema
							: valueSchema.optional(),
					];
				}),
			),
		)
		.strict();
	const shape = {
		pathParams: pathParamsSchema,
		...(route.queryParams.length > 0
			? {
					query:
						route.requiredQueryParams.length > 0
							? querySchema
							: querySchema.optional(),
				}
			: {}),
		...(route.jsonParams.length > 0 ? { body: bodySchema } : {}),
		...(route.formFields.length > 0
			? {
					form:
						route.requiredFormFields.length > 0
							? formSchema
							: formSchema.optional(),
				}
			: {}),
		...(route.filePartNames.length > 0
			? {
					files: route.filesRequired
						? z.array(fileUploadSchema).min(1).max(10)
						: z.array(fileUploadSchema).max(10).optional(),
				}
			: {}),
		...uploadShape,
	};
	return z.object(shape).strict();
}

export const D2lBinaryResponseSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string(),
		base64: z.string(),
		sizeBytes: z.number().int().nonnegative(),
	})
	.strict();

export const D2lUploadSessionOutputSchema = z
	.object({
		kind: z.literal('upload_session'),
		fileKey: z.string().min(1),
		uploadedBytes: z.number().int().nonnegative(),
	})
	.strict();

/** D2L documents JSON responses as resource-specific JSON blocks. */
export const D2lRouteOutputSchema = z.union([
	z.json(),
	D2lBinaryResponseSchema,
	D2lUploadSessionOutputSchema,
	z.undefined(),
]);

export function createD2lRouteOutputSchema(route: D2lRouteDefinition) {
	if (route.responseMode === 'binary') return D2lBinaryResponseSchema;
	if (route.responseMode === 'binary_or_json') {
		return z.union([z.json(), D2lBinaryResponseSchema]);
	}
	if (route.requestMode === 'resumable' && route.routeId !== 'd2l0056') {
		return D2lUploadSessionOutputSchema;
	}
	switch (route.routeId) {
		case 'd2l0001':
			return apiPropertiesOutputSchemas.d2l0001;
		case 'd2l0002':
			return apiPropertiesOutputSchemas.d2l0002;
		case 'd2l0003':
			return apiPropertiesOutputSchemas.d2l0003;
		case 'd2l0004':
			return apiPropertiesOutputSchemas.d2l0004;
		default:
			return userOutputSchemas[route.routeId] ?? D2lRouteOutputSchema;
	}
}

export const D2lBrightspaceEndpointInputSchemas = {
	forRoute: createD2lRouteInputSchema,
} as const;

export const D2lBrightspaceEndpointOutputSchemas = {
	json: D2lRouteOutputSchema,
} as const;

export type D2lBrightspaceEndpointInputs = Record<string, D2lRouteInput>;
export type D2lBrightspaceEndpointOutputs = Record<string, D2lRouteOutput>;
