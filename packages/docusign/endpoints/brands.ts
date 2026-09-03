import { z } from 'zod';
import { resolveClient } from './context';
import type { DocusignExecutionContext } from './types';

export const CreateBrandProfilesForAccountInputSchema = z.object({
	body: z.record(z.string(), z.unknown()).optional(),
});

export const CreateBrandProfilesForAccountOutputSchema = z
	.object({})
	.passthrough();

export type CreateBrandProfilesForAccountParams = z.infer<
	typeof CreateBrandProfilesForAccountInputSchema
>;

export const createBrandProfilesForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateBrandProfilesForAccountParams,
) => {
	const input = CreateBrandProfilesForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/brands`, {
		method: 'POST',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return CreateBrandProfilesForAccountOutputSchema.parse(data);
};

export const DeleteAccountBrandInputSchema = z.object({
	brandId: z.string(),
});

export const DeleteAccountBrandOutputSchema = z.object({}).passthrough();

export type DeleteAccountBrandParams = z.infer<
	typeof DeleteAccountBrandInputSchema
>;

export const deleteAccountBrand = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteAccountBrandParams,
) => {
	const input = DeleteAccountBrandInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/brands/${input.brandId}`, {
		method: 'DELETE',
	});
	return DeleteAccountBrandOutputSchema.parse(data);
};

export const DeleteBrandLogoByTypeInputSchema = z.object({
	brandId: z.string(),
	logoType: z.string(),
});

export const DeleteBrandLogoByTypeOutputSchema = z.object({}).passthrough();

export type DeleteBrandLogoByTypeParams = z.infer<
	typeof DeleteBrandLogoByTypeInputSchema
>;

export const deleteBrandLogoByType = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteBrandLogoByTypeParams,
) => {
	const input = DeleteBrandLogoByTypeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/brands/${input.brandId}/logos/${input.logoType}`,
		{
			method: 'DELETE',
		},
	);
	return DeleteBrandLogoByTypeOutputSchema.parse(data);
};

export const DeleteBrandProfilesInputSchema = z.object({});

export const DeleteBrandProfilesOutputSchema = z.object({}).passthrough();

export type DeleteBrandProfilesParams = z.infer<
	typeof DeleteBrandProfilesInputSchema
>;

export const deleteBrandProfiles = async (
	ctxOrClient: DocusignExecutionContext,
	params: DeleteBrandProfilesParams,
) => {
	const input = DeleteBrandProfilesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/brands`, {
		method: 'DELETE',
	});
	return DeleteBrandProfilesOutputSchema.parse(data);
};

export const ExportBrandToXmlfileInputSchema = z.object({
	brandId: z.string(),
});

export const ExportBrandToXmlfileOutputSchema = z.unknown();

export type ExportBrandToXmlfileParams = z.infer<
	typeof ExportBrandToXmlfileInputSchema
>;

export const exportBrandToXmlfile = async (
	ctxOrClient: DocusignExecutionContext,
	params: ExportBrandToXmlfileParams,
) => {
	const input = ExportBrandToXmlfileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/brands/${input.brandId}/file`, {
		method: 'GET',
	});
	return ExportBrandToXmlfileOutputSchema.parse(data);
};

export const GetBrandLogoByTypeInputSchema = z.object({
	brandId: z.string(),
	logoType: z.string(),
});

export const GetBrandLogoByTypeOutputSchema = z.unknown();

export type GetBrandLogoByTypeParams = z.infer<
	typeof GetBrandLogoByTypeInputSchema
>;

export const getBrandLogoByType = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetBrandLogoByTypeParams,
) => {
	const input = GetBrandLogoByTypeInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/brands/${input.brandId}/logos/${input.logoType}`,
		{
			method: 'GET',
		},
	);
	return GetBrandLogoByTypeOutputSchema.parse(data);
};

export const GetSpecificBrandResourceFileInputSchema = z.object({
	brandId: z.string(),
	resourceContentType: z.string(),
	langcode: z.string().optional(),
	return_master: z.string().optional(),
});

export const GetSpecificBrandResourceFileOutputSchema = z.unknown();

export type GetSpecificBrandResourceFileParams = z.infer<
	typeof GetSpecificBrandResourceFileInputSchema
>;

export const getSpecificBrandResourceFile = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetSpecificBrandResourceFileParams,
) => {
	const input = GetSpecificBrandResourceFileInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.langcode !== undefined)
		query.append('langcode', String(input.langcode));
	if (input.return_master !== undefined)
		query.append('return_master', String(input.return_master));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(
		`/brands/${input.brandId}/resources/${input.resourceContentType}` + qs,
		{
			method: 'GET',
		},
	);
	return GetSpecificBrandResourceFileOutputSchema.parse(data);
};

export const ListBrandsForAccountInputSchema = z.object({
	exclude_distributor_brand: z.string().optional(),
	include_logos: z.string().optional(),
});

export const ListBrandsForAccountOutputSchema = z.object({}).passthrough();

export type ListBrandsForAccountParams = z.infer<
	typeof ListBrandsForAccountInputSchema
>;

export const listBrandsForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ListBrandsForAccountParams,
) => {
	const input = ListBrandsForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.exclude_distributor_brand !== undefined)
		query.append(
			'exclude_distributor_brand',
			String(input.exclude_distributor_brand),
		);
	if (input.include_logos !== undefined)
		query.append('include_logos', String(input.include_logos));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/brands` + qs, {
		method: 'GET',
	});
	return ListBrandsForAccountOutputSchema.parse(data);
};

export const RetrieveAccountBrandInformationInputSchema = z.object({
	brandId: z.string(),
	include_external_references: z.string().optional(),
	include_logos: z.string().optional(),
});

export const RetrieveAccountBrandInformationOutputSchema = z
	.object({})
	.passthrough();

export type RetrieveAccountBrandInformationParams = z.infer<
	typeof RetrieveAccountBrandInformationInputSchema
>;

export const retrieveAccountBrandInformation = async (
	ctxOrClient: DocusignExecutionContext,
	params: RetrieveAccountBrandInformationParams,
) => {
	const input = RetrieveAccountBrandInformationInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.include_external_references !== undefined)
		query.append(
			'include_external_references',
			String(input.include_external_references),
		);
	if (input.include_logos !== undefined)
		query.append('include_logos', String(input.include_logos));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/brands/${input.brandId}` + qs, {
		method: 'GET',
	});
	return RetrieveAccountBrandInformationOutputSchema.parse(data);
};

export const ReturnBrandResourceMetadataForAccountInputSchema = z.object({
	brandId: z.string(),
});

export const ReturnBrandResourceMetadataForAccountOutputSchema = z
	.object({})
	.passthrough();

export type ReturnBrandResourceMetadataForAccountParams = z.infer<
	typeof ReturnBrandResourceMetadataForAccountInputSchema
>;

export const returnBrandResourceMetadataForAccount = async (
	ctxOrClient: DocusignExecutionContext,
	params: ReturnBrandResourceMetadataForAccountParams,
) => {
	const input = ReturnBrandResourceMetadataForAccountInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(`/brands/${input.brandId}/resources`, {
		method: 'GET',
	});
	return ReturnBrandResourceMetadataForAccountOutputSchema.parse(data);
};

export const UpdateAccountBrandSettingsInputSchema = z.object({
	brandId: z.string(),
	replace_brand: z.string().optional(),
	body: z.record(z.string(), z.unknown()).optional(),
});

export const UpdateAccountBrandSettingsOutputSchema = z
	.object({})
	.passthrough();

export type UpdateAccountBrandSettingsParams = z.infer<
	typeof UpdateAccountBrandSettingsInputSchema
>;

export const updateAccountBrandSettings = async (
	ctxOrClient: DocusignExecutionContext,
	params: UpdateAccountBrandSettingsParams,
) => {
	const input = UpdateAccountBrandSettingsInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input.replace_brand !== undefined)
		query.append('replace_brand', String(input.replace_brand));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/brands/${input.brandId}` + qs, {
		method: 'PUT',
		body: input.body === undefined ? undefined : JSON.stringify(input.body),
	});
	return UpdateAccountBrandSettingsOutputSchema.parse(data);
};

export const BrandsInputSchemas = {
	createBrandProfilesForAccount: CreateBrandProfilesForAccountInputSchema,
	deleteAccountBrand: DeleteAccountBrandInputSchema,
	deleteBrandLogoByType: DeleteBrandLogoByTypeInputSchema,
	deleteBrandProfiles: DeleteBrandProfilesInputSchema,
	exportBrandToXmlfile: ExportBrandToXmlfileInputSchema,
	getBrandLogoByType: GetBrandLogoByTypeInputSchema,
	getSpecificBrandResourceFile: GetSpecificBrandResourceFileInputSchema,
	listBrandsForAccount: ListBrandsForAccountInputSchema,
	retrieveAccountBrandInformation: RetrieveAccountBrandInformationInputSchema,
	returnBrandResourceMetadataForAccount:
		ReturnBrandResourceMetadataForAccountInputSchema,
	updateAccountBrandSettings: UpdateAccountBrandSettingsInputSchema,
};

export const BrandsOutputSchemas = {
	createBrandProfilesForAccount: CreateBrandProfilesForAccountOutputSchema,
	deleteAccountBrand: DeleteAccountBrandOutputSchema,
	deleteBrandLogoByType: DeleteBrandLogoByTypeOutputSchema,
	deleteBrandProfiles: DeleteBrandProfilesOutputSchema,
	exportBrandToXmlfile: ExportBrandToXmlfileOutputSchema,
	getBrandLogoByType: GetBrandLogoByTypeOutputSchema,
	getSpecificBrandResourceFile: GetSpecificBrandResourceFileOutputSchema,
	listBrandsForAccount: ListBrandsForAccountOutputSchema,
	retrieveAccountBrandInformation: RetrieveAccountBrandInformationOutputSchema,
	returnBrandResourceMetadataForAccount:
		ReturnBrandResourceMetadataForAccountOutputSchema,
	updateAccountBrandSettings: UpdateAccountBrandSettingsOutputSchema,
};
