import { z } from 'zod';
import {
	BeaconstacBulkQrCode,
	BeaconstacOrganization,
	BeaconstacPlace,
	BeaconstacQrCode,
	BeaconstacQrTemplate,
	BeaconstacTag,
	BeaconstacUser,
} from '../schema/database';

const pageQuery = {
	page: z.number().int().min(1).optional(),
	page_size: z.number().int().min(1).max(100).optional(),
};

function paged<T extends z.ZodType>(item: T) {
	return z
		.object({
			count: z.number().optional(),
			next: z.string().nullable().optional(),
			previous: z.string().nullable().optional(),
			results: z.array(item).optional(),
		})
		.loose();
}

const productType = z.enum(['beacon', 'nfc', 'qr', 'geofence']);

export const PlacesCreateInputSchema = z
	.object({
		name: z.string(),
		address: z.string(),
		latitude: z.coerce.number(),
		longitude: z.coerce.number(),
		organization: z.number().int(),
		place_id: z.string().optional(),
		business_color: z.string().optional(),
		business_icon_url: z.string().optional(),
		business_cover_url: z.string().optional(),
	})
	.loose();

export const PlacesListInputSchema = z.object({
	...pageQuery,
	name: z.string().optional(),
	search: z.string().optional(),
	ordering: z.string().optional(),
	name__icontains: z.string().optional(),
});

export const PlacesUpdateInputSchema = z
	.object({
		place_id: z.number().int(),
		name: z.string(),
		organization: z.number().int(),
		address: z.string().optional(),
		latitude: z.number().optional(),
		longitude: z.number().optional(),
		business_color: z.string().optional(),
		business_icon_url: z.string().optional(),
		business_cover_url: z.string().optional(),
	})
	.loose();

export const QrTemplatesCreateInputSchema = z
	.object({
		name: z.string(),
		organization: z.number().int(),
		meta: z.record(z.string(), z.unknown()).optional(),
		margin: z.number().optional(),
		default: z.boolean().optional(),
		dotScale: z.number().optional(),
		colorDark: z.string().optional(),
		frameText: z.string().optional(),
		logoImage: z.string().optional(),
		logoScale: z.number().optional(),
		colorLight: z.string().optional(),
		frameColor: z.string().optional(),
		frameStyle: z.string().optional(),
		dataPattern: z.string().optional(),
		eyeBallColor: z.string().optional(),
		eyeBallShape: z.string().optional(),
		gradientType: z.string().optional(),
		eyeFrameColor: z.string().optional(),
		eyeFrameShape: z.string().optional(),
		frameTextColor: z.string().optional(),
		backgroundColor: z.string().optional(),
		backgroundImage: z.string().optional(),
	})
	.loose();

export const QrTemplatesListInputSchema = z.object({
	organization: z.number().int(),
	...pageQuery,
	name__icontains: z.string().optional(),
});

export const QrTemplatesDeleteInputSchema = z.object({
	id: z.number().int(),
});

export const TagsCreateInputSchema = z
	.object({
		name: z.string().max(128),
		organization: z.number().int(),
		color: z.string().optional(),
	})
	.loose();

export const TagsListInputSchema = z.object({
	...pageQuery,
	ordering: z.string().optional(),
	name__icontains: z.string().optional(),
});

export const TagsUpdateInputSchema = z
	.object({
		tag_id: z.number().int(),
		name: z.string().optional(),
		color: z.string().optional(),
	})
	.loose();

export const TagsDeleteInputSchema = z.object({
	tag_id: z.number().int(),
});

export const UsersCreateInputSchema = z
	.object({
		username: z.string(),
		organization: z.number().int(),
		email: z.string().optional(),
		password: z.string().optional(),
		last_name: z.string().optional(),
		first_name: z.string().optional(),
		billing_email: z.string().optional(),
		customer_plan: z.string().optional(),
		profile_picture: z.string().optional(),
		user_group: z.string().optional(),
	})
	.loose();

export const UsersListInputSchema = z.object({
	...pageQuery,
	search: z.string().optional(),
	ordering: z.string().optional(),
	email__exact: z.string().optional(),
	organization: z.number().int().optional(),
	customer_plan: z.string().optional(),
	date_joined__gt: z.string().optional(),
	date_joined__lt: z.string().optional(),
	username__exact: z.string().optional(),
	date_joined__gte: z.string().optional(),
	date_joined__lte: z.string().optional(),
	email__icontains: z.string().optional(),
	last_name__exact: z.string().optional(),
	first_name__exact: z.string().optional(),
	subscription_state: z.string().optional(),
	username__icontains: z.string().optional(),
	last_name__icontains: z.string().optional(),
	first_name__icontains: z.string().optional(),
});

export const UsersGetInputSchema = z.object({
	id: z.number().int(),
});

export const UsersUpdateInputSchema = z
	.object({
		user_id: z.number().int(),
		last_name: z.string().optional(),
		first_name: z.string().optional(),
		organization: z.number().int().optional(),
		profile_picture: z.string().optional(),
	})
	.loose();

export const QrcodesGetInputSchema = z.object({
	id: z.number().int(),
});

export const QrcodesUpdateInputSchema = z
	.object({
		qrcode_id: z.number().int(),
		meta: z.record(z.string(), z.unknown()).optional(),
		name: z.string().optional(),
		tags: z.array(z.number().int()).optional(),
		place: z.number().int().optional(),
		qr_type: z.number().int().optional(),
		campaign: z.record(z.string(), z.unknown()).optional(),
		attributes: z.record(z.string(), z.unknown()).optional(),
		fields_data: z.record(z.string(), z.unknown()).optional(),
		organization: z.number().int().optional(),
	})
	.loose();

export const QrcodesDeleteInputSchema = z.object({
	id: z.number().int(),
});

export const BulkQrcodesListInputSchema = z.object({
	...pageQuery,
	search: z.string().optional(),
	ordering: z.string().optional(),
	qr_data_type: z.number().int().optional(),
	name__icontains: z.string().optional(),
});

export const OrganizationsListInputSchema = z.object(pageQuery);

export const AnalyticsPeriodOverviewInputSchema = z.object({
	organization: z.number().int(),
	product_type: productType,
	from_timestamp: z.number().int(),
	to_timestamp: z.number().int(),
});

export const AnalyticsProductOverviewInputSchema =
	AnalyticsPeriodOverviewInputSchema;

export const DeletedResponseSchema = z
	.object({
		deleted: z.boolean().optional(),
	})
	.loose();

export const AnalyticsOverviewResponseSchema = z
	.object({
		points: z.array(z.unknown()).optional(),
		columns: z.array(z.unknown()).optional(),
	})
	.loose();

export const PlacesCreateResponseSchema = BeaconstacPlace;
export const PlacesListResponseSchema = paged(BeaconstacPlace);
export const PlacesUpdateResponseSchema = BeaconstacPlace;
export const QrTemplatesCreateResponseSchema = BeaconstacQrTemplate;
export const QrTemplatesListResponseSchema = paged(BeaconstacQrTemplate);
export const QrTemplatesDeleteResponseSchema = DeletedResponseSchema;
export const TagsCreateResponseSchema = BeaconstacTag;
export const TagsListResponseSchema = paged(BeaconstacTag);
export const TagsUpdateResponseSchema = BeaconstacTag;
export const TagsDeleteResponseSchema = DeletedResponseSchema;
export const UsersCreateResponseSchema = BeaconstacUser;
export const UsersListResponseSchema = paged(BeaconstacUser);
export const UsersGetResponseSchema = BeaconstacUser;
export const UsersUpdateResponseSchema = BeaconstacUser;
export const QrcodesGetResponseSchema = BeaconstacQrCode;
export const QrcodesUpdateResponseSchema = BeaconstacQrCode;
export const QrcodesDeleteResponseSchema = DeletedResponseSchema;
export const BulkQrcodesListResponseSchema = paged(BeaconstacBulkQrCode);
export const OrganizationsListResponseSchema = paged(BeaconstacOrganization);

export const BeaconstacEndpointInputSchemas = {
	placesCreate: PlacesCreateInputSchema,
	placesList: PlacesListInputSchema,
	placesUpdate: PlacesUpdateInputSchema,
	qrTemplatesCreate: QrTemplatesCreateInputSchema,
	qrTemplatesList: QrTemplatesListInputSchema,
	qrTemplatesDelete: QrTemplatesDeleteInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsList: TagsListInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	qrcodesGet: QrcodesGetInputSchema,
	qrcodesUpdate: QrcodesUpdateInputSchema,
	qrcodesDelete: QrcodesDeleteInputSchema,
	bulkQrcodesList: BulkQrcodesListInputSchema,
	organizationsList: OrganizationsListInputSchema,
	analyticsPeriodOverview: AnalyticsPeriodOverviewInputSchema,
	analyticsProductOverview: AnalyticsProductOverviewInputSchema,
} as const;

export const BeaconstacEndpointOutputSchemas = {
	placesCreate: PlacesCreateResponseSchema,
	placesList: PlacesListResponseSchema,
	placesUpdate: PlacesUpdateResponseSchema,
	qrTemplatesCreate: QrTemplatesCreateResponseSchema,
	qrTemplatesList: QrTemplatesListResponseSchema,
	qrTemplatesDelete: QrTemplatesDeleteResponseSchema,
	tagsCreate: TagsCreateResponseSchema,
	tagsList: TagsListResponseSchema,
	tagsUpdate: TagsUpdateResponseSchema,
	tagsDelete: TagsDeleteResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	qrcodesGet: QrcodesGetResponseSchema,
	qrcodesUpdate: QrcodesUpdateResponseSchema,
	qrcodesDelete: QrcodesDeleteResponseSchema,
	bulkQrcodesList: BulkQrcodesListResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	analyticsPeriodOverview: AnalyticsOverviewResponseSchema,
	analyticsProductOverview: AnalyticsOverviewResponseSchema,
} as const;

export type BeaconstacEndpointInputs = {
	[K in keyof typeof BeaconstacEndpointInputSchemas]: z.infer<
		(typeof BeaconstacEndpointInputSchemas)[K]
	>;
};

export type BeaconstacEndpointOutputs = {
	[K in keyof typeof BeaconstacEndpointOutputSchemas]: z.infer<
		(typeof BeaconstacEndpointOutputSchemas)[K]
	>;
};

export type PlacesCreateInput = BeaconstacEndpointInputs['placesCreate'];
export type PlacesCreateResponse = BeaconstacEndpointOutputs['placesCreate'];
export type PlacesListInput = BeaconstacEndpointInputs['placesList'];
export type PlacesListResponse = BeaconstacEndpointOutputs['placesList'];
export type PlacesUpdateInput = BeaconstacEndpointInputs['placesUpdate'];
export type PlacesUpdateResponse = BeaconstacEndpointOutputs['placesUpdate'];
export type QrTemplatesCreateInput =
	BeaconstacEndpointInputs['qrTemplatesCreate'];
export type QrTemplatesCreateResponse =
	BeaconstacEndpointOutputs['qrTemplatesCreate'];
export type QrTemplatesListInput = BeaconstacEndpointInputs['qrTemplatesList'];
export type QrTemplatesListResponse =
	BeaconstacEndpointOutputs['qrTemplatesList'];
export type QrTemplatesDeleteInput =
	BeaconstacEndpointInputs['qrTemplatesDelete'];
export type QrTemplatesDeleteResponse =
	BeaconstacEndpointOutputs['qrTemplatesDelete'];
export type TagsCreateInput = BeaconstacEndpointInputs['tagsCreate'];
export type TagsCreateResponse = BeaconstacEndpointOutputs['tagsCreate'];
export type TagsListInput = BeaconstacEndpointInputs['tagsList'];
export type TagsListResponse = BeaconstacEndpointOutputs['tagsList'];
export type TagsUpdateInput = BeaconstacEndpointInputs['tagsUpdate'];
export type TagsUpdateResponse = BeaconstacEndpointOutputs['tagsUpdate'];
export type TagsDeleteInput = BeaconstacEndpointInputs['tagsDelete'];
export type TagsDeleteResponse = BeaconstacEndpointOutputs['tagsDelete'];
export type UsersCreateInput = BeaconstacEndpointInputs['usersCreate'];
export type UsersCreateResponse = BeaconstacEndpointOutputs['usersCreate'];
export type UsersListInput = BeaconstacEndpointInputs['usersList'];
export type UsersListResponse = BeaconstacEndpointOutputs['usersList'];
export type UsersGetInput = BeaconstacEndpointInputs['usersGet'];
export type UsersGetResponse = BeaconstacEndpointOutputs['usersGet'];
export type UsersUpdateInput = BeaconstacEndpointInputs['usersUpdate'];
export type UsersUpdateResponse = BeaconstacEndpointOutputs['usersUpdate'];
export type QrcodesGetInput = BeaconstacEndpointInputs['qrcodesGet'];
export type QrcodesGetResponse = BeaconstacEndpointOutputs['qrcodesGet'];
export type QrcodesUpdateInput = BeaconstacEndpointInputs['qrcodesUpdate'];
export type QrcodesUpdateResponse = BeaconstacEndpointOutputs['qrcodesUpdate'];
export type QrcodesDeleteInput = BeaconstacEndpointInputs['qrcodesDelete'];
export type QrcodesDeleteResponse = BeaconstacEndpointOutputs['qrcodesDelete'];
export type BulkQrcodesListInput = BeaconstacEndpointInputs['bulkQrcodesList'];
export type BulkQrcodesListResponse =
	BeaconstacEndpointOutputs['bulkQrcodesList'];
export type OrganizationsListInput =
	BeaconstacEndpointInputs['organizationsList'];
export type OrganizationsListResponse =
	BeaconstacEndpointOutputs['organizationsList'];
export type AnalyticsPeriodOverviewInput =
	BeaconstacEndpointInputs['analyticsPeriodOverview'];
export type AnalyticsPeriodOverviewResponse =
	BeaconstacEndpointOutputs['analyticsPeriodOverview'];
export type AnalyticsProductOverviewInput =
	BeaconstacEndpointInputs['analyticsProductOverview'];
export type AnalyticsProductOverviewResponse =
	BeaconstacEndpointOutputs['analyticsProductOverview'];
