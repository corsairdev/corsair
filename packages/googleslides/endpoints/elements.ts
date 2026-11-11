import type { GoogleSlidesEndpoints } from '..';
import { runBatchUpdate } from '../client';
import type { BatchUpdateResponse, ProviderJson } from '../types';
import { call, compact, replyAt } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

/** Reads the objectId out of a create reply, which is the only thing it carries. */
function createdObjectId(
	response: BatchUpdateResponse,
	replyKey: string,
): string {
	const reply = replyAt(response.replies, 0)?.[replyKey] as
		| { objectId?: string }
		| undefined;
	if (!reply?.objectId) {
		throw new Error(
			`${replyKey} reply has no objectId: ${JSON.stringify(response).slice(0, 200)}`,
		);
	}
	return reply.objectId;
}

/**
 * A create request sends the size as width and height, but the API also accepts
 * an omitted size and derives it. `elementProperties` is passed through as the
 * caller gave it, with only undefined keys dropped.
 */
function elementProperties(properties: {
	pageObjectId: string;
	size?: {
		width?: { magnitude?: number; unit?: 'EMU' | 'PT' };
		height?: { magnitude?: number; unit?: 'EMU' | 'PT' };
	};
	transform?: ProviderJson;
}) {
	return compact({
		pageObjectId: properties.pageObjectId,
		size: properties.size
			? compact({
					width: properties.size.width
						? compact({
								magnitude: properties.size.width.magnitude,
								unit: properties.size.width.unit,
							})
						: undefined,
					height: properties.size.height
						? compact({
								magnitude: properties.size.height.magnitude,
								unit: properties.size.height.unit,
							})
						: undefined,
				})
			: undefined,
		transform: properties.transform,
	});
}

/**
 * Google reads a missing scale as 0, which collapses the element. In RELATIVE
 * mode the transform multiplies into the existing one, so an omitted scale has
 * to mean "leave the size alone" and is filled with 1. In ABSOLUTE mode the
 * transform replaces the matrix outright, so the caller's values are sent as
 * given and a partial matrix stays partial.
 */
export function transformForApplyMode(
	transform: ProviderJson,
	applyMode: 'RELATIVE' | 'ABSOLUTE',
): ProviderJson {
	if (applyMode === 'ABSOLUTE') return transform;
	return {
		...transform,
		scaleX: transform.scaleX ?? 1,
		scaleY: transform.scaleY ?? 1,
	};
}

export const elementsCreateShape: GoogleSlidesEndpoints['elementsCreateShape'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'elements.createShape',
				input: GoogleSlidesEndpointInputSchemas.elementsCreateShape,
				output: GoogleSlidesEndpointOutputSchemas.elementsCreateShape,
			},
			input,
			async (parsed) => {
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						createShape: compact({
							objectId: parsed.objectId,
							shapeType: parsed.shapeType,
							elementProperties: elementProperties(parsed.elementProperties),
						}),
					},
				]);
				return {
					presentationId: parsed.presentationId,
					objectId: createdObjectId(response, 'createShape'),
				};
			},
			(parsed) => ({
				shapeType: parsed.shapeType,
				pageObjectId: parsed.elementProperties.pageObjectId,
			}),
		);

export const elementsCreateImage: GoogleSlidesEndpoints['elementsCreateImage'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'elements.createImage',
				input: GoogleSlidesEndpointInputSchemas.elementsCreateImage,
				output: GoogleSlidesEndpointOutputSchemas.elementsCreateImage,
			},
			input,
			async (parsed) => {
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						createImage: compact({
							objectId: parsed.objectId,
							url: parsed.url,
							elementProperties: elementProperties(parsed.elementProperties),
						}),
					},
				]);
				return {
					presentationId: parsed.presentationId,
					objectId: createdObjectId(response, 'createImage'),
				};
			},
			(parsed) => ({ pageObjectId: parsed.elementProperties.pageObjectId }),
		);

export const elementsCreateTable: GoogleSlidesEndpoints['elementsCreateTable'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'elements.createTable',
				input: GoogleSlidesEndpointInputSchemas.elementsCreateTable,
				output: GoogleSlidesEndpointOutputSchemas.elementsCreateTable,
			},
			input,
			async (parsed) => {
				// A table transform must have a scale of 1 and no shear, which Google
				// documents; sending the caller's scale fails the whole batch. Scale
				// is therefore pinned to 1 and shear removed, while the position is
				// kept, so a caller wanting a different size sets elementProperties
				// .size instead.
				const properties = elementProperties(parsed.elementProperties);
				if (properties.transform) {
					const { scaleX, scaleY, shearX, shearY, ...rest } =
						// unknown: an AffineTransform; scale and shear are replaced below.
						properties.transform as ProviderJson;
					properties.transform = { ...rest, scaleX: 1, scaleY: 1 };
				}

				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						createTable: compact({
							objectId: parsed.objectId,
							rows: parsed.rows,
							columns: parsed.columns,
							elementProperties: properties,
						}),
					},
				]);
				return {
					presentationId: parsed.presentationId,
					objectId: createdObjectId(response, 'createTable'),
				};
			},
			(parsed) => ({
				rows: parsed.rows,
				columns: parsed.columns,
				pageObjectId: parsed.elementProperties.pageObjectId,
			}),
		);

export const elementsSetAltText: GoogleSlidesEndpoints['elementsSetAltText'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'elements.setAltText',
				input: GoogleSlidesEndpointInputSchemas.elementsSetAltText,
				output: GoogleSlidesEndpointOutputSchemas.elementsSetAltText,
			},
			input,
			async (parsed) => {
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						updatePageElementAltText: compact({
							objectId: parsed.objectId,
							title: parsed.title,
							description: parsed.description,
						}),
					},
				]);
				return {
					presentationId: parsed.presentationId,
					replyCount: response.replies?.length ?? 0,
				};
			},
			(parsed) => ({ objectId: parsed.objectId }),
		);

export const elementsUpdateTransform: GoogleSlidesEndpoints['elementsUpdateTransform'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'elements.updateTransform',
				input: GoogleSlidesEndpointInputSchemas.elementsUpdateTransform,
				output: GoogleSlidesEndpointOutputSchemas.elementsUpdateTransform,
			},
			input,
			async (parsed) => {
				const applyMode = parsed.applyMode ?? 'RELATIVE';
				const response = await runBatchUpdate(ctx, parsed.presentationId, [
					{
						updatePageElementTransform: {
							objectId: parsed.objectId,
							transform: transformForApplyMode(parsed.transform, applyMode),
							// ABSOLUTE replaces the existing transform; RELATIVE multiplies
							// into it, which is the provider default and stated here so the
							// intent is visible in the request.
							applyMode,
						},
					},
				]);
				return {
					presentationId: parsed.presentationId,
					replyCount: response.replies?.length ?? 0,
				};
			},
			(parsed) => ({
				objectId: parsed.objectId,
				applyMode: parsed.applyMode ?? 'RELATIVE',
			}),
		);

export const elementsZOrder: GoogleSlidesEndpoints['elementsZOrder'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'elements.zOrder',
			input: GoogleSlidesEndpointInputSchemas.elementsZOrder,
			output: GoogleSlidesEndpointOutputSchemas.elementsZOrder,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					updatePageElementsZOrder: {
						pageElementObjectIds: parsed.objectIds,
						operation: parsed.operation,
					},
				},
			]);
			return {
				presentationId: parsed.presentationId,
				replyCount: response.replies?.length ?? 0,
			};
		},
		(parsed) => ({
			operation: parsed.operation,
			count: parsed.objectIds.length,
		}),
	);

export const elementsGroup: GoogleSlidesEndpoints['elementsGroup'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'elements.group',
			input: GoogleSlidesEndpointInputSchemas.elementsGroup,
			output: GoogleSlidesEndpointOutputSchemas.elementsGroup,
		},
		input,
		async (parsed) => {
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					groupObjects: compact({
						groupObjectId: parsed.groupObjectId,
						childrenObjectIds: parsed.objectIds,
					}),
				},
			]);
			const groupObjectId = createdObjectId(response, 'groupObjects');
			return { presentationId: parsed.presentationId, groupObjectId };
		},
		(parsed) => ({ count: parsed.objectIds.length }),
	);

export const elementsUngroup: GoogleSlidesEndpoints['elementsUngroup'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'elements.ungroup',
			input: GoogleSlidesEndpointInputSchemas.elementsUngroup,
			output: GoogleSlidesEndpointOutputSchemas.elementsUngroup,
		},
		input,
		async (parsed) => {
			// Ungroup deletes the group and keeps the children at their rendered
			// size and position, so nothing else needs reporting.
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{ ungroupObjects: { objectIds: parsed.objectIds } },
			]);
			return {
				presentationId: parsed.presentationId,
				replyCount: response.replies?.length ?? 0,
			};
		},
		(parsed) => ({ count: parsed.objectIds.length }),
	);

export const ElementsEndpoints = {
	createShape: elementsCreateShape,
	createImage: elementsCreateImage,
	createTable: elementsCreateTable,
	setAltText: elementsSetAltText,
	updateTransform: elementsUpdateTransform,
	zOrder: elementsZOrder,
	group: elementsGroup,
	ungroup: elementsUngroup,
};
