import { z } from 'zod';

// Every schema below mirrors the Google Slides discovery document
// (https://slides.googleapis.com/$discovery/rest?version=v1, revision 20261109)
// and the Drive v3 discovery document for the four Drive-backed operations.
// Output objects are `.loose()` and optional fields `.nullish()`: Google omits
// unset fields rather than sending null, but a null can arrive through a proxy.

const id = z.string().min(1);
const objectId = z
	.string()
	.min(5)
	.max(50)
	.regex(
		/^[a-zA-Z0-9_][a-zA-Z0-9_:\-]*$/,
		'Object ids must start alphanumeric or underscore and use only letters, digits, hyphen or colon',
	)
	.describe('5 to 50 characters, starting alphanumeric or underscore');

const driveMimeType = z
	.string()
	.min(1)
	.describe('Drive MIME type, e.g. application/vnd.google-apps.presentation');

// ── shared value objects ────────────────────────────────────────────────────

const DimensionSchema = z
	.object({
		magnitude: z.number().optional().describe('Size in EMU or PT'),
		unit: z
			.enum(['EMU', 'PT'])
			.optional()
			.describe('Defaults to EMU when omitted'),
	})
	.describe('A size, such as { magnitude: 914400, unit: "EMU" } for one inch');

const SizeSchema = z.object({
	width: DimensionSchema.optional(),
	height: DimensionSchema.optional(),
});

const AffineTransformSchema = z.object({
	scaleX: z.number().optional(),
	scaleY: z.number().optional(),
	shearX: z.number().optional(),
	shearY: z.number().optional(),
	translateX: z.number().optional().describe('Offset on the x axis'),
	translateY: z.number().optional().describe('Offset on the y axis'),
	unit: z
		.enum(['UNIT_UNSPECIFIED', 'EMU', 'PT'])
		.optional()
		.describe('Defaults to EMU when omitted'),
});

const RgbColorSchema = z.object({
	red: z.number().min(0).max(1).optional(),
	green: z.number().min(0).max(1).optional(),
	blue: z.number().min(0).max(1).optional(),
});

const ThemeColorSchema = z.enum([
	'THEME_COLOR_TYPE_UNSPECIFIED',
	'DARK1',
	'LIGHT1',
	'DARK2',
	'LIGHT2',
	'ACCENT1',
	'ACCENT2',
	'ACCENT3',
	'ACCENT4',
	'ACCENT5',
	'ACCENT6',
	'HYPERLINK',
	'FOLLOWED_HYPERLINK',
	'TEXT1',
	'BACKGROUND1',
	'TEXT2',
	'BACKGROUND2',
]);

const OptionalColorSchema = z
	.object({
		opaqueColor: z
			.object({
				rgbColor: RgbColorSchema.optional(),
				themeColor: ThemeColorSchema.optional(),
			})
			.optional()
			.describe('Omit to leave the colour transparent'),
	})
	.describe('Wraps a colour; an empty object means transparent');

const RangeSchema = z
	.object({
		type: z
			.enum(['FIXED_RANGE', 'FROM_START_INDEX', 'ALL'])
			.describe(
				'ALL covers the whole shape. FROM_START_INDEX needs startIndex. FIXED_RANGE needs both indexes.',
			),
		startIndex: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Required for FIXED_RANGE and FROM_START_INDEX'),
		endIndex: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Required for FIXED_RANGE'),
	})
	.superRefine((range, ctx) => {
		if (range.type !== 'ALL' && range.startIndex === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['startIndex'],
				message: `startIndex is required when type is ${range.type}`,
			});
		}
		if (
			range.type === 'FIXED_RANGE' &&
			(range.startIndex === undefined || range.endIndex === undefined)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['endIndex'],
				message: 'FIXED_RANGE requires both startIndex and endIndex',
			});
		}
		if (
			range.startIndex !== undefined &&
			range.endIndex !== undefined &&
			range.endIndex <= range.startIndex
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['endIndex'],
				message: 'endIndex must be greater than startIndex',
			});
		}
	});

const TableCellLocationSchema = z
	.object({
		rowIndex: z.number().int().min(0),
		columnIndex: z.number().int().min(0),
	})
	.describe('0-based cell position; required when the target is a table');

const ElementPropertiesSchema = z.object({
	pageObjectId: id.describe('The slide the element is created on'),
	size: SizeSchema.optional(),
	transform: AffineTransformSchema.optional(),
});

/**
 * Shapes need an explicit size. Images and tables do not: Google documents "the
 * default size of the image is used" and "the table will be automatically
 * sized", so requiring both there would reject a request the API accepts.
 */
function requireElementSize(
	value: {
		elementProperties?: {
			size?: {
				width?: unknown; // unknown: presence only; contents by the element schema.
				height?: unknown; // unknown: presence only; contents by the element schema.
			};
		};
	},
	ctx: z.RefinementCtx,
) {
	const size = value.elementProperties?.size;
	if (!size?.width || !size?.height) {
		ctx.addIssue({
			code: 'custom',
			path: ['elementProperties', 'size'],
			message:
				'A shape needs both width and height in elementProperties.size. Only images and tables can omit elementProperties.size and let Google size them.',
		});
	}
}

/** Images and tables take an optional size, but a half-specified one is a mistake. */
function requireCompleteSize(
	value: {
		elementProperties?: {
			size?: {
				width?: unknown; // unknown: presence only; either both or neither.
				height?: unknown; // unknown: presence only; either both or neither.
			};
		};
	},
	ctx: z.RefinementCtx,
) {
	const size = value.elementProperties?.size;
	if (!size) return;
	if (Boolean(size.width) !== Boolean(size.height)) {
		ctx.addIssue({
			code: 'custom',
			path: ['elementProperties', 'size'],
			message:
				'Size needs both width and height, or neither to use the default',
		});
	}
}

// ── presentations ───────────────────────────────────────────────────────────

const PresentationsCreateInputSchema = z.object({
	title: z.string().min(1).describe('Presentation title'),
	presentationId: objectId
		.optional()
		.describe(
			'Optional caller-chosen id. A random one is generated when omitted.',
		),
});

const PresentationsGetInputSchema = z.object({
	presentationId: id,
	commentsViewMode: z
		.enum([
			'COMMENTS_VIEW_MODE_UNSPECIFIED',
			'COMMENTS_VIEW_MODE_DEFAULT_FOR_CURRENT_ACCESS',
			'COMMENTS_VIEW_MODE_OMITTED',
			'COMMENTS_VIEW_MODE_INCLUDED',
		])
		.optional()
		.describe('INCLUDED needs comment access; otherwise the call answers 403'),
});

const PresentationsListInputSchema = z.object({
	query: z
		.string()
		.optional()
		.describe(
			'Drive query appended with `and mimeType = application/vnd.google-apps.presentation`',
		),
	pageSize: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Drive caps this at 1000; the API default is 100'),
	pageToken: z.string().optional().describe('Cursor from a previous page'),
	orderBy: z
		.string()
		.optional()
		.describe('Drive sort, e.g. modifiedTime desc or name'),
});

const PresentationsCopyInputSchema = z.object({
	presentationId: id,
	name: z.string().min(1).optional().describe('Name for the copy'),
	parents: z.array(id).optional().describe('Folders to place the copy in'),
});

const PresentationsExportInputSchema = z.object({
	presentationId: id,
	format: z
		.enum(['pdf', 'pptx'])
		.optional()
		.describe('pdf by default; pptx needs the same Drive export scope'),
});

const PresentationsDeleteInputSchema = z.object({
	presentationId: id.describe(
		'Drive files.delete removes the file permanently; it does not move it to the trash',
	),
});

// ── slides ─────────────────────────────────────────────────────────────────

const SlideSummarySchema = z.object({
	objectId: id,
	index: z.number().int().min(0),
	layoutObjectId: z.string().nullish(),
	isSkipped: z
		.boolean()
		.nullish()
		.describe('Skipped slides are hidden in a show'),
	elementCount: z.number().int().min(0),
	notesObjectId: z
		.string()
		.nullish()
		.describe('Shape holding the speaker notes'),
});

const SlidesListInputSchema = z.object({
	presentationId: id,
});

const SlidesGetInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
});

const SlidesCreateInputSchema = z.object({
	presentationId: id,
	insertionIndex: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('0-based position; omitted appends to the end'),
	layout: z
		.enum([
			'BLANK',
			'CAPTION_ONLY',
			'TITLE',
			'TITLE_AND_BODY',
			'TITLE_AND_TWO_COLUMNS',
			'TITLE_ONLY',
			'SECTION_HEADER',
			'SECTION_TITLE_AND_DESCRIPTION',
			'ONE_COLUMN_TEXT',
			'MAIN_POINT',
			'BIG_NUMBER',
		])
		.optional()
		.describe('Predefined layout; BLANK when omitted'),
	layoutId: id
		.optional()
		.describe(
			'Layout object id from the presentation, when it is not predefined',
		),
	slideObjectId: objectId
		.optional()
		.describe('Optional caller-chosen id for the new slide'),
});

const SlidesDuplicateInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	/** Keys are source ids, values the id the duplicate receives. */
	objectIds: z
		.record(z.string(), objectId)
		.optional()
		.describe('Optional map of source object id to the id its copy receives'),
});

const SlidesRemoveInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
});

const SlidesMoveInputSchema = z.object({
	presentationId: id,
	slideObjectIds: z.array(id).min(1).describe('Slides in their current order'),
	insertionIndex: z
		.number()
		.int()
		.min(0)
		.describe('Position measured before the move takes place'),
});

const SlidesSetSkippedInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	isSkipped: z.boolean(),
});

const SlidesThumbnailInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	size: z
		.enum(['SMALL', 'MEDIUM', 'LARGE', 'WIDTH2000_PX'])
		.optional()
		.describe('SMALL 200px, MEDIUM 800px, LARGE 1600px, WIDTH2000_PX 2000px'),
});

const SlidesGetNotesInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
});

const SlidesSetNotesInputSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	notes: z
		.string()
		.describe(
			'Replaces the existing speaker notes. An empty string clears them.',
		),
});

// ── text ───────────────────────────────────────────────────────────────────

const TextInsertInputSchema = z.object({
	presentationId: id,
	objectId: id.describe('Shape or table that receives the text'),
	text: z.string().min(1),
	insertionIndex: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Unicode code-unit offset; omitted appends'),
	cellLocation: TableCellLocationSchema.optional(),
});

const TextReplaceAllInputSchema = z.object({
	presentationId: id,
	find: z
		.string()
		.min(1)
		.describe('Text to find, or a pattern with searchByRegex'),
	replace: z
		.string()
		.describe('Replacement text; empty string deletes matches'),
	matchCase: z.boolean().optional().describe('Case sensitive search when true'),
	searchByRegex: z
		.boolean()
		.optional()
		.describe(
			'Treat find as a regular expression; backslashes must be escaped',
		),
	pageObjectIds: z
		.array(id)
		.optional()
		.describe('Limits matches to these slides; omitted searches every slide'),
});

const TextDeleteInputSchema = z.object({
	presentationId: id,
	objectId: id,
	textRange: RangeSchema,
	cellLocation: TableCellLocationSchema.optional(),
});

const TextStyleSchema = z
	.object({
		bold: z.boolean().optional(),
		italic: z.boolean().optional(),
		underline: z.boolean().optional(),
		strikethrough: z.boolean().optional(),
		smallCaps: z.boolean().optional(),
		fontFamily: z.string().optional(),
		fontSize: DimensionSchema.optional(),
		foregroundColor: OptionalColorSchema.optional(),
		backgroundColor: OptionalColorSchema.optional(),
		baselineOffset: z.enum(['NONE', 'SUPERSCRIPT', 'SUBSCRIPT']).optional(),
	})
	.describe('Properties to set; name them in fields');

const TEXT_STYLE_FIELDS = [
	'bold',
	'italic',
	'underline',
	'strikethrough',
	'smallCaps',
	'fontFamily',
	'fontSize',
	'foregroundColor',
	'backgroundColor',
	'baselineOffset',
] as const;

const TextUpdateStyleInputSchema = z.object({
	presentationId: id,
	objectId: id,
	textRange: RangeSchema,
	style: TextStyleSchema,
	fields: z
		.array(z.enum(TEXT_STYLE_FIELDS))
		.min(1)
		.describe('Properties the write applies; others are left untouched'),
	cellLocation: TableCellLocationSchema.optional(),
});
// No cross-field check on purpose: Google documents that naming a field in
// the mask while leaving it unset resets that property to its default, so a
// field absent from `style` is a reset, not a mistake.

const TextBulletsInputSchema = z.object({
	presentationId: id,
	objectId: id,
	textRange: RangeSchema,
	bulletPreset: z
		.enum([
			'BULLET_DISC_CIRCLE_SQUARE',
			'BULLET_DIAMONDX_ARROW3D_SQUARE',
			'BULLET_CHECKBOX',
			'BULLET_ARROW_DIAMOND_DISC',
			'BULLET_STAR_CIRCLE_SQUARE',
			'BULLET_ARROW3D_CIRCLE_SQUARE',
			'BULLET_LEFTTRIANGLE_DIAMOND_DISC',
			'BULLET_DIAMONDX_HOLLOWDIAMOND_SQUARE',
			'BULLET_DIAMOND_CIRCLE_SQUARE',
			'NUMBERED_DIGIT_ALPHA_ROMAN',
			'NUMBERED_DIGIT_ALPHA_ROMAN_PARENS',
			'NUMBERED_DIGIT_NESTED',
			'NUMBERED_UPPERALPHA_ALPHA_ROMAN',
			'NUMBERED_UPPERROMAN_UPPERALPHA_DIGIT',
			'NUMBERED_ZERODIGIT_ALPHA_ROMAN',
		])
		.optional()
		.describe('Defaults to BULLET_DISC_CIRCLE_SQUARE'),
	cellLocation: TableCellLocationSchema.optional(),
});

const TextRemoveBulletsInputSchema = z.object({
	presentationId: id,
	objectId: id,
	textRange: RangeSchema,
	cellLocation: TableCellLocationSchema.optional(),
});

// ── elements ───────────────────────────────────────────────────────────────

const ElementsCreateShapeInputSchema = z
	.object({
		presentationId: id,
		shapeType: z
			.enum([
				'TEXT_BOX',
				'RECTANGLE',
				'ROUND_RECTANGLE',
				'ELLIPSE',
				'TRIANGLE',
				'DIAMOND',
				'STAR_5',
				'CLOUD',
				'CHEVRON',
				'ARROW_EAST',
			])
			.describe(
				'A subset of the full shape list; any ECMA-376 shape works via batch.update',
			),
		elementProperties: ElementPropertiesSchema,
		objectId: objectId.optional(),
	})
	.superRefine(requireElementSize);

const ElementsCreateImageInputSchema = z
	.object({
		presentationId: id,
		url: z
			.string()
			.min(1)
			.max(2048)
			.describe(
				'Publicly readable image URL, under 50 MB and 25 megapixels. PNG, JPEG or GIF only.',
			),
		elementProperties: ElementPropertiesSchema,
		objectId: objectId.optional(),
	})
	.superRefine(requireCompleteSize);

const ElementsCreateTableInputSchema = z
	.object({
		presentationId: id,
		rows: z.number().int().min(1),
		columns: z.number().int().min(1),
		elementProperties: ElementPropertiesSchema,
		objectId: objectId.optional(),
	})
	.superRefine(requireCompleteSize);

const ElementsSetAltTextInputSchema = z.object({
	presentationId: id,
	objectId: id.describe('Page element, not a slide'),
	title: z
		.string()
		.optional()
		.describe('Short alt text read by screen readers'),
	description: z.string().optional(),
});

const ElementsUpdateTransformInputSchema = z.object({
	presentationId: id,
	objectId: id,
	transform: AffineTransformSchema,
	applyMode: z
		.enum(['RELATIVE', 'ABSOLUTE'])
		.optional()
		.describe(
			'RELATIVE (default) multiplies into the current transform, ABSOLUTE replaces it',
		),
});

const ElementsZOrderInputSchema = z.object({
	presentationId: id,
	objectIds: z.array(id).min(1).describe('Elements on one slide, not grouped'),
	operation: z.enum([
		'BRING_TO_FRONT',
		'BRING_FORWARD',
		'SEND_BACKWARD',
		'SEND_TO_BACK',
	]),
});

const ElementsGroupInputSchema = z.object({
	presentationId: id,
	objectIds: z
		.array(id)
		.min(2)
		.describe('At least two ungrouped elements on the same slide'),
	groupObjectId: objectId.optional(),
});

const ElementsUngroupInputSchema = z.object({
	presentationId: id,
	objectIds: z.array(id).min(1).describe('Group ids, at most one level deep'),
});

// ── batch ──────────────────────────────────────────────────────────────────

const BatchUpdateInputSchema = z.object({
	presentationId: id,
	requests: z
		.array(
			// One key names the request type, e.g. { insertText: { objectId, text } };
			// extra keys carry any of the 49 documented request types.
			z.looseObject({ insertText: z.looseObject({}).optional() }),
		)
		.min(1)
		.describe(
			'Raw Slides batchUpdate requests, applied atomically. Use the typed groups where they exist.',
		),
	writeControl: z
		.object({ requiredRevisionId: z.string().optional() })
		.optional()
		.describe('Fails the batch when the presentation moved past this revision'),
});

// ── input map ──────────────────────────────────────────────────────────────

export const GoogleSlidesEndpointInputSchemas = {
	presentationsCreate: PresentationsCreateInputSchema,
	presentationsGet: PresentationsGetInputSchema,
	presentationsList: PresentationsListInputSchema,
	presentationsCopy: PresentationsCopyInputSchema,
	presentationsExport: PresentationsExportInputSchema,
	presentationsDelete: PresentationsDeleteInputSchema,
	slidesList: SlidesListInputSchema,
	slidesGet: SlidesGetInputSchema,
	slidesCreate: SlidesCreateInputSchema,
	slidesDuplicate: SlidesDuplicateInputSchema,
	slidesRemove: SlidesRemoveInputSchema,
	slidesMove: SlidesMoveInputSchema,
	slidesSetSkipped: SlidesSetSkippedInputSchema,
	slidesThumbnail: SlidesThumbnailInputSchema,
	slidesGetNotes: SlidesGetNotesInputSchema,
	slidesSetNotes: SlidesSetNotesInputSchema,
	textInsert: TextInsertInputSchema,
	textReplaceAll: TextReplaceAllInputSchema,
	textDelete: TextDeleteInputSchema,
	textUpdateStyle: TextUpdateStyleInputSchema,
	textCreateBullets: TextBulletsInputSchema,
	textRemoveBullets: TextRemoveBulletsInputSchema,
	elementsCreateShape: ElementsCreateShapeInputSchema,
	elementsCreateImage: ElementsCreateImageInputSchema,
	elementsCreateTable: ElementsCreateTableInputSchema,
	elementsSetAltText: ElementsSetAltTextInputSchema,
	elementsUpdateTransform: ElementsUpdateTransformInputSchema,
	elementsZOrder: ElementsZOrderInputSchema,
	elementsGroup: ElementsGroupInputSchema,
	elementsUngroup: ElementsUngroupInputSchema,
	batchUpdate: BatchUpdateInputSchema,
} as const;

export type GoogleSlidesEndpointInputs = {
	[K in keyof typeof GoogleSlidesEndpointInputSchemas]: z.input<
		(typeof GoogleSlidesEndpointInputSchemas)[K]
	>;
};

// ── output schemas ─────────────────────────────────────────────────────────

const DriveMimeTypeSchema = z.string().nullish();

const PresentationSummarySchema = z
	.object({
		presentationId: id,
		title: z.string().nullish(),
		locale: z.string().nullish(),
		revisionId: z.string().nullish(),
		url: z.string(),
		slideCount: z.number().int().min(0),
		layoutCount: z.number().int().min(0),
		masterCount: z.number().int().min(0),
		pageWidthEmu: z.number().nullish(),
		pageHeightEmu: z.number().nullish(),
		// Only populated when the caller asked for commentsViewMode
		// COMMENTS_VIEW_MODE_INCLUDED, which needs comment access. A thread holds
		// ids, timestamps, author names and nested replies, so it stays a loose
		// object rather than a record of declared fields.
		comments: z
			.array(z.looseObject({}))
			.nullish()
			.describe('Comment threads, when comment viewing was requested'),
	})
	.loose();

const PresentResponseSchema = PresentationSummarySchema;

// A copy reports its counts from a read of the new deck. When that read fails
// after the copy succeeded, the counts are unknown and left out.
const PresentationsCopyResponseSchema = PresentationSummarySchema.extend({
	slideCount: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Absent when the copy could not be read back'),
	layoutCount: z.number().int().min(0).optional(),
	masterCount: z.number().int().min(0).optional(),
});

const PresentationsListResponseSchema = z
	.object({
		files: z.array(
			z
				.object({
					presentationId: id,
					name: z.string().nullish(),
					mimeType: DriveMimeTypeSchema,
					createdTime: z.string().nullish(),
					modifiedTime: z.string().nullish(),
					webViewLink: z.string().nullish(),
					owners: z
						.array(
							z.object({
								displayName: z.string().nullish(),
								emailAddress: z.string().nullish(),
							}),
						)
						.nullish(),
				})
				.loose(),
		),
		nextPageToken: z.string().nullish(),
	})
	.loose();

const DeleteResponseSchema = z.object({
	presentationId: id,
	deleted: z.literal(true),
});

const SlideSummaryListSchema = z
	.object({
		presentationId: id,
		title: z.string().nullish(),
		slides: z.array(SlideSummarySchema),
	})
	.loose();

const PageResponseSchema = z
	.object({
		objectId: id,
		pageType: z.string().nullish(),
		pageElements: z
			.array(z.looseObject({ objectId: z.string().nullish() }))
			.nullish(),
	})
	.loose();

const CreatedSlideSchema = z
	.object({
		presentationId: id,
		slideObjectId: id,
		insertionIndex: z.number().int().min(0).nullish(),
		layoutObjectId: z.string().nullish(),
	})
	.loose();

const SlideRemoveResponseSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	removed: z.literal(true),
});

const MovedResponseSchema = z
	.object({
		presentationId: id,
		slideObjectIds: z.array(id),
		insertionIndex: z.number().int().min(0),
	})
	.loose();

const SkippedResponseSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	isSkipped: z.boolean(),
});

const ThumbnailResponseSchema = z
	.object({
		presentationId: id,
		slideObjectId: id,
		contentUrl: z.string(),
		width: z.number().int().min(0).nullish(),
		height: z.number().int().min(0).nullish(),
		expiresInMinutes: z
			.number()
			.int()
			.describe('contentUrl stops working after 30 minutes'),
	})
	.loose();

const SlideNotesSchema = z.object({
	presentationId: id,
	slideObjectId: id,
	notes: z.string(),
	notesObjectId: z.string().nullish(),
});

const TextWriteResponseSchema = z
	.object({
		presentationId: id,
		replyCount: z.number().int().min(0),
		occurrencesChanged: z
			.number()
			.int()
			.min(0)
			.nullish()
			.describe('Set by replace operations, absent otherwise'),
	})
	.loose();

const CreatedElementSchema = z
	.object({
		presentationId: id,
		objectId: id,
	})
	.loose();

const ElementUpdateResponseSchema = z
	.object({
		presentationId: id,
		replyCount: z.number().int().min(0),
	})
	.loose();

const GroupResponseSchema = z
	.object({
		presentationId: id,
		groupObjectId: z.string().nullish(),
	})
	.loose();

const UngroupResponseSchema = z
	.object({
		presentationId: id,
		replyCount: z.number().int().min(0),
	})
	.loose();

const ExportResponseSchema = z
	.object({
		presentationId: id,
		format: z.enum(['pdf', 'pptx']),
		mimeType: z.string(),
		byteLength: z.number().int().min(0),
		data: z.string().describe('Base64-encoded file'),
	})
	.loose();

const BatchUpdateResponseSchema = z
	.object({
		presentationId: id,
		// Keys depend on the request each slot answered, so the value is an
		// object with no declared fields rather than `any`.
		replies: z.array(z.record(z.string(), z.object({}).loose())),
		// Google returns the write control it applied, which a caller uses as the
		// requiredRevisionId of a later batch.
		writeControl: z
			.object({
				requiredRevisionId: z
					.string()
					.nullish()
					.describe('Revision the batch was applied to'),
			})
			.loose()
			.nullish(),
	})
	.loose();

export const GoogleSlidesEndpointOutputSchemas = {
	presentationsCreate: PresentResponseSchema,
	presentationsGet: PresentResponseSchema,
	presentationsList: PresentationsListResponseSchema,
	presentationsCopy: PresentationsCopyResponseSchema,
	presentationsExport: ExportResponseSchema,
	presentationsDelete: DeleteResponseSchema,
	slidesList: SlideSummaryListSchema,
	slidesGet: PageResponseSchema,
	slidesCreate: CreatedSlideSchema,
	slidesDuplicate: CreatedElementSchema,
	slidesRemove: SlideRemoveResponseSchema,
	slidesMove: MovedResponseSchema,
	slidesSetSkipped: SkippedResponseSchema,
	slidesThumbnail: ThumbnailResponseSchema,
	slidesGetNotes: SlideNotesSchema,
	slidesSetNotes: SlideNotesSchema,
	textInsert: TextWriteResponseSchema,
	textReplaceAll: TextWriteResponseSchema,
	textDelete: TextWriteResponseSchema,
	textUpdateStyle: TextWriteResponseSchema,
	textCreateBullets: TextWriteResponseSchema,
	textRemoveBullets: TextWriteResponseSchema,
	elementsCreateShape: CreatedElementSchema,
	elementsCreateImage: CreatedElementSchema,
	elementsCreateTable: CreatedElementSchema,
	elementsSetAltText: ElementUpdateResponseSchema,
	elementsUpdateTransform: ElementUpdateResponseSchema,
	elementsZOrder: ElementUpdateResponseSchema,
	elementsGroup: GroupResponseSchema,
	elementsUngroup: UngroupResponseSchema,
	batchUpdate: BatchUpdateResponseSchema,
} as const;

export type GoogleSlidesEndpointOutputs = {
	presentationsCreate: z.output<typeof PresentResponseSchema>;
	presentationsGet: z.output<typeof PresentResponseSchema>;
	presentationsList: z.output<typeof PresentationsListResponseSchema>;
	presentationsCopy: z.output<typeof PresentationsCopyResponseSchema>;
	presentationsExport: z.output<typeof ExportResponseSchema>;
	presentationsDelete: z.output<typeof DeleteResponseSchema>;
	slidesList: z.output<typeof SlideSummaryListSchema>;
	slidesGet: z.output<typeof PageResponseSchema>;
	slidesCreate: z.output<typeof CreatedSlideSchema>;
	slidesDuplicate: z.output<typeof CreatedElementSchema>;
	slidesRemove: z.output<typeof SlideRemoveResponseSchema>;
	slidesMove: z.output<typeof MovedResponseSchema>;
	slidesSetSkipped: z.output<typeof SkippedResponseSchema>;
	slidesThumbnail: z.output<typeof ThumbnailResponseSchema>;
	slidesGetNotes: z.output<typeof SlideNotesSchema>;
	slidesSetNotes: z.output<typeof SlideNotesSchema>;
	textInsert: z.output<typeof TextWriteResponseSchema>;
	textReplaceAll: z.output<typeof TextWriteResponseSchema>;
	textDelete: z.output<typeof TextWriteResponseSchema>;
	textUpdateStyle: z.output<typeof TextWriteResponseSchema>;
	textCreateBullets: z.output<typeof TextWriteResponseSchema>;
	textRemoveBullets: z.output<typeof TextWriteResponseSchema>;
	elementsCreateShape: z.output<typeof CreatedElementSchema>;
	elementsCreateImage: z.output<typeof CreatedElementSchema>;
	elementsCreateTable: z.output<typeof CreatedElementSchema>;
	elementsSetAltText: z.output<typeof ElementUpdateResponseSchema>;
	elementsUpdateTransform: z.output<typeof ElementUpdateResponseSchema>;
	elementsZOrder: z.output<typeof ElementUpdateResponseSchema>;
	elementsGroup: z.output<typeof GroupResponseSchema>;
	elementsUngroup: z.output<typeof UngroupResponseSchema>;
	batchUpdate: z.output<typeof BatchUpdateResponseSchema>;
};
