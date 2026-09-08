import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { BoldsignEndpoints } from '..';
import { makeBoldsignRequest } from '../client';
import {
	BoldsignEndpointInputSchemas,
	BoldsignEndpointOutputSchemas,
} from './types';

// BoldSign documents an empty payload for the two PATCH calls below
// (204 No Content for removeAuthentication, empty 200 for extendExpiry),
// which the transport surfaces as undefined — so the only valid provider
// output is "no content". A non-2xx status already throws in the transport.
const NoContentResponseSchema = z.union([
	z.undefined(),
	z.null(),
	z.literal(''),
]);

function toUploadFile(base64Content: string, mimeType: string): string {
	if (base64Content.toLowerCase().startsWith('data:')) {
		const match = base64Content.match(/^data:([^;,]+)(?:;[^,]*)?;base64,/i);
		if (!match || !match[1]) {
			throw new Error(
				'Invalid data URI format: expected data:<mime>;base64,<data>',
			);
		}
		const actualMime = match[1].toLowerCase();
		if (actualMime !== mimeType.toLowerCase()) {
			throw new Error(
				`MIME type mismatch: declared ${mimeType} but data URI is ${match[1]}. When base64Content is already a data URI, its MIME must match mimeType, or provide raw base64 instead.`,
			);
		}
		return base64Content;
	}
	return `data:${mimeType};base64,${base64Content}`;
}

function authTypeFromContext(ctx: {
	options?: { authType?: 'oauth_2' };
}): 'oauth_2' {
	// OAuth 2.0 is the plugin's sole auth type (defaultAuthType in index.ts).
	return ctx.options?.authType ?? 'oauth_2';
}

export const CustomFields = {
	create: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.createCustomField.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/customField/create',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createCustomField.parse(response);
		// PII-safe: only log non-sensitive identifiers, omit formField details
		await logEventFromContext(
			ctx,
			'boldsign.customFields.create',
			{
				fieldName: validInput.fieldName,
				brandId: validInput.brandId,
				sharedField: validInput.sharedField,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createCustomField'],

	edit: (async (ctx, input) => {
		const { customFieldId, ...body } =
			BoldsignEndpointInputSchemas.editCustomField.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/customField/edit',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'POST',
				query: { customFieldId },
				body,
			},
		);
		const parsed =
			BoldsignEndpointOutputSchemas.editCustomField.parse(response);
		// PII-safe: only log identifiers, omit formField payload
		await logEventFromContext(
			ctx,
			'boldsign.customFields.edit',
			{ customFieldId, fieldName: body.fieldName, brandId: body.brandId },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editCustomField'],
};

export const Brands = {
	get: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.getBrandDetails.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/brand/get',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: { brandId: validInput.brandId } },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.getBrandDetails.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.get',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getBrandDetails'],

	list: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.listBrands.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/brand/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET' },
		);
		const parsed = BoldsignEndpointOutputSchemas.listBrands.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.brands.list',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBrands'],
};

export const Documents = {
	createEmbeddedRequestLink: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.createEmbeddedRequestLink.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/createEmbeddedRequestUrl',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.createEmbeddedRequestLink.parse(response);
		// PII-safe: do not log signer emails or message content, only counts and title
		await logEventFromContext(
			ctx,
			'boldsign.documents.createEmbeddedRequestLink',
			{
				title: validInput.title,
				signersCount: validInput.signers?.length ?? 0,
				filesCount: validInput.files?.length ?? 0,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['createEmbeddedRequestLink'],

	send: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.sendDocument.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/send',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'POST', body: validInput },
		);
		const parsed = BoldsignEndpointOutputSchemas.sendDocument.parse(response);
		// PII-safe: avoid logging signer emails and file payloads
		await logEventFromContext(
			ctx,
			'boldsign.documents.send',
			{
				title: validInput.title,
				signersCount: validInput.signers?.length ?? 0,
				filesCount: validInput.files?.length ?? 0,
				brandId: validInput.brandId,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['sendDocument'],

	editBeta: (async (ctx, input) => {
		const { documentId, ...body } =
			BoldsignEndpointInputSchemas.editDocumentBeta.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/edit',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'PUT', query: { documentId }, body },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.editDocumentBeta.parse(response);
		// PII-safe: do not log signer/cc/file details which may contain emails
		await logEventFromContext(
			ctx,
			'boldsign.documents.editBeta',
			{
				documentId,
				title: body.title,
				signersCount: body.signers?.length ?? 0,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['editDocumentBeta'],

	extendExpiry: (async (ctx, input) => {
		const { documentId, newExpiryValue, warnPrior, onBehalfOf } =
			BoldsignEndpointInputSchemas.extendDocumentExpiry.parse(input);
		// Body keys use the PascalCase names from
		// https://developers.boldsign.com/documents/extend-document-expiry
		// unknown: this call returns no content (see NoContentResponseSchema
		// below), so no narrower response type exists; the actual payload is
		// validated right after this call.
		const response = await makeBoldsignRequest<unknown>(
			'/v1/document/extendExpiry',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'PATCH',
				query: { documentId },
				body: {
					NewExpiryValue: newExpiryValue,
					WarnPrior: warnPrior,
					OnBehalfOf: onBehalfOf,
				},
			},
		);
		NoContentResponseSchema.parse(response);
		const parsed = BoldsignEndpointOutputSchemas.extendDocumentExpiry.parse({
			success: true,
		});
		// PII-safe: omit onBehalfOf email, keep non-sensitive expiry data
		await logEventFromContext(
			ctx,
			'boldsign.documents.extendExpiry',
			{ documentId, newExpiryValue, warnPrior },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['extendDocumentExpiry'],

	removeAuthentication: (async (ctx, input) => {
		const { documentId, emailId, zOrder, onBehalfOf } =
			BoldsignEndpointInputSchemas.removeDocumentAuthentication.parse(input);
		// Query param is lowercase `documentId` and body keys use the
		// PascalCase names from
		// https://developers.boldsign.com/documents/remove-authentication-from-the-document
		// unknown: this call returns 204 No Content (see
		// NoContentResponseSchema below), so no narrower response type exists;
		// the actual payload is validated right after this call.
		const response = await makeBoldsignRequest<unknown>(
			'/v1/document/RemoveAuthentication',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{
				method: 'PATCH',
				query: { documentId },
				body: { EmailId: emailId, zOrder, OnBehalfOf: onBehalfOf },
			},
		);
		NoContentResponseSchema.parse(response);
		const parsed =
			BoldsignEndpointOutputSchemas.removeDocumentAuthentication.parse({
				success: true,
			});
		// PII-safe: omit emailId/onBehalfOf which are email addresses
		await logEventFromContext(
			ctx,
			'boldsign.documents.removeAuthentication',
			{ documentId, zOrder },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['removeDocumentAuthentication'],

	list: (async (ctx, input) => {
		const validInput = BoldsignEndpointInputSchemas.listDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/list',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed = BoldsignEndpointOutputSchemas.listDocuments.parse(response);
		// PII-safe: omit sentBy/recipients email arrays, log only pagination and status
		await logEventFromContext(
			ctx,
			'boldsign.documents.list',
			{
				page: validInput.page,
				pageSize: validInput.pageSize,
				status: validInput.status,
				nextCursor: validInput.nextCursor,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listDocuments'],

	listBehalf: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.listBehalfDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/behalfList',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listBehalfDocuments.parse(response);
		// PII-safe: omit emailAddress/signers email arrays
		await logEventFromContext(
			ctx,
			'boldsign.documents.listBehalf',
			{
				page: validInput.page,
				pageSize: validInput.pageSize,
				pageType: validInput.pageType,
				status: validInput.status,
				nextCursor: validInput.nextCursor,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listBehalfDocuments'],

	listTeam: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.listTeamDocuments.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/document/teamlist',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET', query: validInput },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.listTeamDocuments.parse(response);
		// PII-safe: omit userId/teamId arrays tied to identities, log pagination only
		await logEventFromContext(
			ctx,
			'boldsign.documents.listTeam',
			{
				page: validInput.page,
				pageSize: validInput.pageSize,
				status: validInput.status,
				nextCursor: validInput.nextCursor,
			},
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['listTeamDocuments'],
};

export const Plan = {
	getApiCreditsCount: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.getApiCreditsCount.parse(input);
		const response = await makeBoldsignRequest(
			'/v1/plan/apiCreditsCount',
			{ key: ctx.key, authType: authTypeFromContext(ctx) },
			{ method: 'GET' },
		);
		const parsed =
			BoldsignEndpointOutputSchemas.getApiCreditsCount.parse(response);
		await logEventFromContext(
			ctx,
			'boldsign.plan.getApiCreditsCount',
			{ ...validInput },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['getApiCreditsCount'],
};

export const Helpers = {
	uploadFile: (async (ctx, input) => {
		const validInput =
			BoldsignEndpointInputSchemas.uploadFileHelper.parse(input);
		const file = {
			base64: toUploadFile(validInput.base64Content, validInput.mimeType),
			fileName: validInput.fileName,
		};
		const parsed = BoldsignEndpointOutputSchemas.uploadFileHelper.parse({
			file,
		});
		await logEventFromContext(
			ctx,
			'boldsign.helpers.uploadFile',
			{ fileName: validInput.fileName, mimeType: validInput.mimeType },
			'completed',
		);
		return parsed;
	}) satisfies BoldsignEndpoints['uploadFileHelper'],
};

export * from './types';
