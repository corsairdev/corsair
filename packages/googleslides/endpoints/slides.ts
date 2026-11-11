import type { GoogleSlidesEndpoints } from '..';
import { makeSlidesRequest, markReplaySafe, runBatchUpdate } from '../client';
import type { Page, Presentation, ProviderJson } from '../types';
import { call, compact, compactQuery, replyAt } from './shared';
import {
	GoogleSlidesEndpointInputSchemas,
	GoogleSlidesEndpointOutputSchemas,
} from './types';

/** Reads a presentation, which is the only way to see its slides and layouts. */
async function readPresentation(
	ctx: Parameters<GoogleSlidesEndpoints['slidesList']>[0],
	presentationId: string,
): Promise<Presentation> {
	// Marked replay-safe: a pure read, and the merge write after it is idempotent.
	return markReplaySafe(
		makeSlidesRequest<Presentation>(
			`/presentations/${encodeURIComponent(presentationId)}`,
			ctx,
			{ timeout: 60_000 },
		),
	);
}

/**
 * Speaker notes live on a shape inside the slide's notes page, and only the API
 * names that shape (`notesProperties.speakerNotesObjectId`). Reading the page
 * is therefore unavoidable before a notes write, and a slide whose notes shape
 * has never been created has no id at all until the first insert.
 */
async function readSlide(
	ctx: Parameters<GoogleSlidesEndpoints['slidesGet']>[0],
	presentationId: string,
	slideObjectId: string,
): Promise<Page> {
	// Deliberately unmarked: this same helper is the read-back after a create, and
	// a retry there would replay the write. Callers that only read mark it.
	return makeSlidesRequest<Page>(
		`/presentations/${encodeURIComponent(presentationId)}/pages/${encodeURIComponent(slideObjectId)}`,
		ctx,
	);
}

const NOTE_PLACEHOLDER_TYPES = new Set(['BODY', 'SLIDE_IMAGE']);

/** True when a placeholder type belongs on a notes page, used by the tests. */
export function isNotesPlaceholder(type: string | undefined): boolean {
	return type !== undefined && NOTE_PLACEHOLDER_TYPES.has(type);
}

/**
 * The notes page's text exactly as Google returned it, including the newline it
 * appends to every shape. Callers that decide whether anything needs deleting
 * use this: a page holding only blank lines is non-empty, and `notesText` would
 * hide that.
 *
 * Only the speaker-notes shape counts. The same page carries a `SLIDE_IMAGE`
 * placeholder and can carry other shapes, and only the shape named by
 * `notesProperties.speakerNotesObjectId` holds notes.
 */
export function notesRawText(page: Page): string {
	const speakerNotesId = page.notesProperties?.speakerNotesObjectId;
	const parts: string[] = [];
	for (const element of page.pageElements ?? []) {
		// Without a speaker-notes id the page names no shape to read, so nothing
		// can be attributed to the notes.
		if (!speakerNotesId || element.objectId !== speakerNotesId) continue;
		for (const run of element.shape?.text?.textElements ?? []) {
			const content = run.textRun?.content;
			if (content) parts.push(content);
		}
	}
	return parts.join('');
}

/**
 * Joins the text runs on a page into the string a caller reads. The notes page
 * also holds a `SLIDE_IMAGE` placeholder with no text, so only elements that
 * carry text contribute.
 */
export function notesText(page: Page): string {
	// One trailing newline is Google's, not the user's; keeping it would make
	// every round trip grow the notes by a line.
	return notesRawText(page).replace(/\n$/, '');
}

/**
 * Rejects an id that is not a slide before a slide-only write runs. A page id
 * and a page-element id share one namespace, so nothing else distinguishes them
 * locally, and Google's error for the wrong kind is a 400 after the fact.
 */
async function assertIsSlide(
	ctx: Parameters<GoogleSlidesEndpoints['slidesGet']>[0],
	presentationId: string,
	pageObjectId: string,
): Promise<void> {
	const page = await markReplaySafe(
		readSlide(ctx, presentationId, pageObjectId),
	);
	if (page.pageType !== 'SLIDE') {
		throw new Error(
			`${pageObjectId} is a ${page.pageType ?? 'page without a type'}, not a slide. Use the elements group for page elements.`,
		);
	}
}

export const slidesList: GoogleSlidesEndpoints['slidesList'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.list',
			input: GoogleSlidesEndpointInputSchemas.slidesList,
			output: GoogleSlidesEndpointOutputSchemas.slidesList,
		},
		input,
		async (parsed) => {
			const presentation = await readPresentation(ctx, parsed.presentationId);
			const slides = (presentation.slides ?? []).map((slide, index) => {
				if (!slide.objectId) {
					throw new Error(
						`Slide at index ${index} has no objectId: ${JSON.stringify(slide).slice(0, 120)}`,
					);
				}
				return {
					objectId: slide.objectId,
					// Array position is the slide order; the API exposes no index field
					// for slides the way it does for tabs.
					index,
					layoutObjectId: slide.slideProperties?.layoutObjectId,
					isSkipped: slide.slideProperties?.isSkipped,
					elementCount: slide.pageElements?.length ?? 0,
					notesObjectId:
						slide.slideProperties?.notesPage?.notesProperties
							?.speakerNotesObjectId,
				};
			});
			return {
				presentationId: parsed.presentationId,
				title: presentation.title,
				slides,
			};
		},
		(parsed) => ({ presentationId: parsed.presentationId }),
	);

export const slidesGet: GoogleSlidesEndpoints['slidesGet'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.get',
			input: GoogleSlidesEndpointInputSchemas.slidesGet,
			output: GoogleSlidesEndpointOutputSchemas.slidesGet,
		},
		input,
		// Marked replay-safe: this endpoint only reads.
		async (parsed) =>
			markReplaySafe(
				readSlide(ctx, parsed.presentationId, parsed.slideObjectId),
			),
		(parsed) => ({ slideObjectId: parsed.slideObjectId }),
	);

export const slidesCreate: GoogleSlidesEndpoints['slidesCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.create',
			input: GoogleSlidesEndpointInputSchemas.slidesCreate,
			output: GoogleSlidesEndpointOutputSchemas.slidesCreate,
		},
		input,
		async (parsed) => {
			// A caller may name a layout by id or by predefined name; Google
			// rejects both being absent only for the id path, so the predefined
			// name is sent when no id is given.
			const slideLayoutReference = parsed.layoutId
				? { layoutId: parsed.layoutId }
				: { predefinedLayout: parsed.layout ?? 'BLANK' };

			const createSlide = compact({
				objectId: parsed.slideObjectId,
				insertionIndex: parsed.insertionIndex,
				slideLayoutReference,
			});

			// Not marked replay-safe: a 5xx does not prove Google left the slide
			// uncreated, so a whole-endpoint retry could add a second one.
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{ createSlide },
			]);
			const created = replyAt(response.replies, 0)?.createSlide as
				| { objectId?: string }
				| undefined;
			if (!created?.objectId) {
				throw new Error(
					`createSlide reply has no objectId: ${JSON.stringify(response).slice(0, 200)}`,
				);
			}

			// The reply carries only the id. Reading the slide back names the
			// layout that was actually applied, which differs from the request when
			// the named layout is missing from the current master.
			//
			// Best effort: the slide exists at this point, so failing the call
			// because the follow-up read did not complete would report a creation
			// as a failure and invite a retry that adds a second slide.
			const slide = await readSlide(
				ctx,
				parsed.presentationId,
				created.objectId,
			).catch((error: unknown) => {
				// unknown: the read failed; the id came from the create reply.
				console.warn(
					`Created slide ${created.objectId} but could not read it back:`,
					error,
				);
				return undefined;
			});
			return {
				presentationId: parsed.presentationId,
				slideObjectId: created.objectId,
				insertionIndex: parsed.insertionIndex,
				layoutObjectId: slide?.slideProperties?.layoutObjectId,
			};
		},
		(parsed) => ({
			presentationId: parsed.presentationId,
			layout: parsed.layoutId ? 'layoutId' : (parsed.layout ?? 'BLANK'),
		}),
	);

export const slidesDuplicate: GoogleSlidesEndpoints['slidesDuplicate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.duplicate',
			input: GoogleSlidesEndpointInputSchemas.slidesDuplicate,
			output: GoogleSlidesEndpointOutputSchemas.slidesDuplicate,
		},
		input,
		async (parsed) => {
			await assertIsSlide(ctx, parsed.presentationId, parsed.slideObjectId);
			const response = await runBatchUpdate(ctx, parsed.presentationId, [
				{
					duplicateObject: compact({
						objectId: parsed.slideObjectId,
						objectIds: parsed.objectIds,
					}),
				},
			]);
			const duplicated = replyAt(response.replies, 0)?.duplicateObject as
				| { objectId?: string }
				| undefined;
			if (!duplicated?.objectId) {
				throw new Error(
					`duplicateObject reply has no objectId: ${JSON.stringify(response).slice(0, 200)}`,
				);
			}
			return {
				presentationId: parsed.presentationId,
				objectId: duplicated.objectId,
			};
		},
		(parsed) => ({ slideObjectId: parsed.slideObjectId }),
	);

export const slidesRemove: GoogleSlidesEndpoints['slidesRemove'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.remove',
			input: GoogleSlidesEndpointInputSchemas.slidesRemove,
			output: GoogleSlidesEndpointOutputSchemas.slidesRemove,
		},
		input,
		async (parsed) => {
			// deleteObject deletes page elements too, so the id is checked first:
			// deleting a shape through an endpoint declared as a slide delete would
			// destroy content under the wrong approval.
			await assertIsSlide(ctx, parsed.presentationId, parsed.slideObjectId);
			await runBatchUpdate(ctx, parsed.presentationId, [
				{ deleteObject: { objectId: parsed.slideObjectId } },
			]);
			return {
				presentationId: parsed.presentationId,
				slideObjectId: parsed.slideObjectId,
				removed: true as const,
			};
		},
		(parsed) => ({ slideObjectId: parsed.slideObjectId }),
	);

export const slidesMove: GoogleSlidesEndpoints['slidesMove'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.move',
			input: GoogleSlidesEndpointInputSchemas.slidesMove,
			output: GoogleSlidesEndpointOutputSchemas.slidesMove,
		},
		input,
		async (parsed) => {
			await runBatchUpdate(ctx, parsed.presentationId, [
				{
					updateSlidesPosition: {
						slideObjectIds: parsed.slideObjectIds,
						insertionIndex: parsed.insertionIndex,
					},
				},
			]);
			return {
				presentationId: parsed.presentationId,
				slideObjectIds: parsed.slideObjectIds,
				insertionIndex: parsed.insertionIndex,
			};
		},
		(parsed) => ({
			slideCount: parsed.slideObjectIds.length,
			insertionIndex: parsed.insertionIndex,
		}),
	);

export const slidesSetSkipped: GoogleSlidesEndpoints['slidesSetSkipped'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'slides.setSkipped',
				input: GoogleSlidesEndpointInputSchemas.slidesSetSkipped,
				output: GoogleSlidesEndpointOutputSchemas.slidesSetSkipped,
			},
			input,
			async (parsed) => {
				await runBatchUpdate(ctx, parsed.presentationId, [
					{
						updateSlideProperties: {
							objectId: parsed.slideObjectId,
							slideProperties: { isSkipped: parsed.isSkipped },
							fields: 'isSkipped',
						},
					},
				]);
				return {
					presentationId: parsed.presentationId,
					slideObjectId: parsed.slideObjectId,
					isSkipped: parsed.isSkipped,
				};
			},
			(parsed) => ({ isSkipped: parsed.isSkipped }),
		);

export const slidesThumbnail: GoogleSlidesEndpoints['slidesThumbnail'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.getThumbnail',
			input: GoogleSlidesEndpointInputSchemas.slidesThumbnail,
			output: GoogleSlidesEndpointOutputSchemas.slidesThumbnail,
		},
		input,
		async (parsed) => {
			// Dotted keys stay flat strings: corsair/http renders a nested object
			// as key[sub], which Google ignores and answers with a default size.
			// Marked replay-safe: this endpoint only reads.
			const thumbnail = await markReplaySafe(
				makeSlidesRequest<{
					contentUrl?: string;
					width?: number;
					height?: number;
				}>(
					`/presentations/${encodeURIComponent(parsed.presentationId)}/pages/${encodeURIComponent(parsed.slideObjectId)}/thumbnail`,
					ctx,
					{
						query: compactQuery({
							'thumbnailProperties.thumbnailSize': parsed.size,
							'thumbnailProperties.mimeType': 'PNG',
						}),
					},
				),
			);
			if (!thumbnail.contentUrl) {
				throw new Error(
					`Thumbnail reply has no contentUrl: ${JSON.stringify(thumbnail)}`,
				);
			}
			return {
				presentationId: parsed.presentationId,
				slideObjectId: parsed.slideObjectId,
				contentUrl: thumbnail.contentUrl,
				width: thumbnail.width,
				height: thumbnail.height,
				// Google documents a 30 minute lifetime for contentUrl.
				expiresInMinutes: 30,
			};
		},
		(parsed) => ({
			slideObjectId: parsed.slideObjectId,
			size: parsed.size ?? 'server default',
		}),
	);

export const slidesGetNotes: GoogleSlidesEndpoints['slidesGetNotes'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.getNotes',
			input: GoogleSlidesEndpointInputSchemas.slidesGetNotes,
			output: GoogleSlidesEndpointOutputSchemas.slidesGetNotes,
		},
		input,
		// Marked replay-safe: this endpoint only reads.
		async (parsed) => {
			const slide = await markReplaySafe(
				readSlide(ctx, parsed.presentationId, parsed.slideObjectId),
			);
			const notesPage = slide.slideProperties?.notesPage;
			return {
				presentationId: parsed.presentationId,
				slideObjectId: parsed.slideObjectId,
				notes: notesText(notesPage ?? {}),
				notesObjectId: notesPage?.notesProperties?.speakerNotesObjectId,
			};
		},
		(parsed) => ({ slideObjectId: parsed.slideObjectId }),
	);

export const slidesSetNotes: GoogleSlidesEndpoints['slidesSetNotes'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'slides.setNotes',
			input: GoogleSlidesEndpointInputSchemas.slidesSetNotes,
			output: GoogleSlidesEndpointOutputSchemas.slidesSetNotes,
		},
		input,
		async (parsed) => {
			const slide = await readSlide(
				ctx,
				parsed.presentationId,
				parsed.slideObjectId,
			);
			const notesObjectId =
				slide.slideProperties?.notesPage?.notesProperties?.speakerNotesObjectId;
			if (!notesObjectId) {
				throw new Error(
					`Slide ${parsed.slideObjectId} has no speaker notes shape yet. Insert text through text.insert with the slide's notes page, or open the slide in the editor once.`,
				);
			}

			// Existing notes have to go first: insertText appends at the end, so a
			// set over non-empty notes would concatenate instead of replace. The
			// raw text decides this, because a shape holding only blank lines still
			// has content that an empty write would leave behind.
			const hasExistingNotes =
				notesRawText(slide.slideProperties?.notesPage ?? {}).length > 0;
			const requests: ProviderJson[] = [];
			if (hasExistingNotes) {
				requests.push({
					deleteText: {
						objectId: notesObjectId,
						textRange: { type: 'ALL' },
					},
				});
			}
			if (parsed.notes.length > 0) {
				requests.push({
					insertText: { objectId: notesObjectId, text: parsed.notes },
				});
			}
			if (requests.length > 0) {
				await runBatchUpdate(ctx, parsed.presentationId, requests);
			}

			return {
				presentationId: parsed.presentationId,
				slideObjectId: parsed.slideObjectId,
				notes: parsed.notes,
				notesObjectId,
			};
		},
		(parsed) => ({
			slideObjectId: parsed.slideObjectId,
			length: parsed.notes.length,
		}),
	);

export const SlidesEndpoints = {
	list: slidesList,
	get: slidesGet,
	create: slidesCreate,
	duplicate: slidesDuplicate,
	remove: slidesRemove,
	move: slidesMove,
	setSkipped: slidesSetSkipped,
	getThumbnail: slidesThumbnail,
	getNotes: slidesGetNotes,
	setNotes: slidesSetNotes,
};
