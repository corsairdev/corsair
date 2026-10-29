import { z } from 'zod';

// Sheet names in addresses stay unquoted. A name with a space is passed as
// the worksheet id/name path segment, and the address stays A1 or A1:B2.
const CELL_OR_RANGE =
	/^(?:[A-Za-z0-9_]{1,31}!)?\$?[A-Za-z]{1,3}\$?[1-9][0-9]{0,6}(?::\$?[A-Za-z]{1,3}\$?[1-9][0-9]{0,6})?$/;

const RANGE_ADDRESS =
	/^(?:[A-Za-z0-9_]{1,31}!)?\$?[A-Za-z]{1,3}\$?[1-9][0-9]{0,6}:\$?[A-Za-z]{1,3}\$?[1-9][0-9]{0,6}$/;

const WORKSHEET_NAME = /^[^:\\/?*[\]]{1,31}$/;

const ITEM_PATH = /^(?!\/)(?!.*\.\.)(?!.*:)(?:[^/]+\/)*[^/]+$/;

const XLSX_PATH = /^(?!\/)(?!.*\.\.)(?!.*:)(?:[^/]+\/)*[^/]+\.xlsx$/i;

export const cellSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);

export const gridSchema = z.array(z.array(cellSchema)).min(1);

const scalarOrGridSchema = z.union([cellSchema, gridSchema]);

// A bare string fills the whole range (Graph's single-cell copy). A grid
// may contain null so one call can set only some cells.
const formulaCellSchema = z.union([z.string(), z.null()]);
const formulaGridSchema = z.union([
	z.string(),
	z.array(z.array(formulaCellSchema)).min(1),
]);

const targetShape = {
	driveId: z.string().min(1).optional(),
	itemId: z.string().min(1).optional(),
	itemPath: z.string().regex(ITEM_PATH).optional(),
	sessionId: z.string().min(1).optional(),
};

// Zod's refine callback types this value as a wide record, so a named
// field type is not practical until the string check below.
function field(value: unknown, key: string): string | undefined {
	if (value === null || typeof value !== 'object' || !(key in value)) {
		return undefined;
	}
	const entry = Object.entries(value).find(
		([entryKey]) => entryKey === key,
	)?.[1];
	return typeof entry === 'string' ? entry : undefined;
}

function requireOneTarget(value: unknown, ctx: z.RefinementCtx): void {
	const hasId = field(value, 'itemId') !== undefined;
	const hasPath = field(value, 'itemPath') !== undefined;
	if (hasId === hasPath) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide exactly one of itemId or itemPath',
			path: ['itemId'],
		});
	}
}

function requireSession(value: unknown, ctx: z.RefinementCtx): void {
	if (field(value, 'sessionId') === undefined) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'sessionId is required',
			path: ['sessionId'],
		});
	}
}

const pageShape = {
	top: z.number().int().positive().optional(),
	skip: z.number().int().nonnegative().optional(),
};

const worksheetIdSchema = z.string().min(1).max(200);

function target<T extends z.ZodRawShape>(
	extra: T,
	options?: { session?: boolean },
) {
	return z
		.object({ ...targetShape, ...extra })
		.strict()
		.superRefine((value, ctx) => {
			requireOneTarget(value, ctx);
			if (options?.session) {
				requireSession(value, ctx);
			}
		});
}

export const emptyOutputSchema = z
	.union([z.undefined(), z.null(), z.looseObject({})])
	.transform(() => ({}));

export const worksheetSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	position: z.number().optional(),
	visibility: z.string().optional(),
});

export const worksheetListSchema = z.looseObject({
	value: z.array(worksheetSchema),
	'@odata.nextLink': z.string().optional(),
});

export const rangeSchema = z.looseObject({
	address: z.string(),
	addressLocal: z.string().optional(),
	cellCount: z.number().optional(),
	columnCount: z.number().optional(),
	columnIndex: z.number().optional(),
	rowCount: z.number().optional(),
	rowIndex: z.number().optional(),
	values: z.array(z.array(cellSchema)),
	formulas: z.array(z.array(z.union([z.string(), z.null()]))).optional(),
	text: z.array(z.array(z.union([z.string(), z.null()]))).optional(),
	numberFormat: z.array(z.array(z.string())).optional(),
	valueTypes: z.array(z.array(z.string())).optional(),
});

export const tableSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	showHeaders: z.boolean().optional(),
	showTotals: z.boolean().optional(),
	style: z.string().optional(),
});

export const tableListSchema = z.looseObject({
	value: z.array(tableSchema),
	'@odata.nextLink': z.string().optional(),
});

export const tableRowSchema = z.looseObject({
	index: z.number().optional(),
	values: z.array(z.array(cellSchema)).optional(),
});

export const tableRowListSchema = z.looseObject({
	value: z.array(tableRowSchema),
	'@odata.nextLink': z.string().optional(),
});

export const tableColumnSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	index: z.number().optional(),
	values: z.array(z.array(cellSchema)).optional(),
});

export const tableColumnListSchema = z.looseObject({
	value: z.array(tableColumnSchema),
	'@odata.nextLink': z.string().optional(),
});

export const sessionSchema = z.looseObject({
	id: z.string(),
	persistChanges: z.boolean().optional(),
});

export const driveItemSchema = z.looseObject({
	id: z.string(),
	name: z.string(),
	size: z.number().optional(),
	webUrl: z.string().optional(),
});

const functionValueSchema = z.union([
	cellSchema,
	z.array(cellSchema),
	z.array(z.array(cellSchema)),
]);

export const functionResultSchema = z.looseObject({
	error: z.string().nullable().optional(),
	value: functionValueSchema.optional(),
});

const functionArgSchema = z.union([
	cellSchema,
	z.object({ address: z.string().regex(CELL_OR_RANGE) }).strict(),
]);

export const SessionsCreateInputSchema = target({
	persistChanges: z.boolean(),
});

export const SessionsCloseInputSchema = target({}, { session: true });
export const SessionsRefreshInputSchema = target({}, { session: true });

export const WorksheetsListInputSchema = target(pageShape);

export const WorksheetsGetInputSchema = target({
	worksheet: worksheetIdSchema,
});

export const WorksheetsAddInputSchema = target({
	name: z.string().regex(WORKSHEET_NAME).optional(),
});

export const WorksheetsUpdateInputSchema = target({
	worksheet: worksheetIdSchema,
	name: z.string().regex(WORKSHEET_NAME).optional(),
	position: z.number().int().nonnegative().optional(),
}).superRefine((value, ctx) => {
	if (value.name === undefined && value.position === undefined) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide name or position',
			path: ['name'],
		});
	}
});

export const WorksheetsDeleteInputSchema = WorksheetsGetInputSchema;

export const RangesGetInputSchema = target({
	worksheet: worksheetIdSchema,
	address: z.string().regex(CELL_OR_RANGE),
});

export const RangesUsedInputSchema = target({
	worksheet: worksheetIdSchema,
	valuesOnly: z.boolean().optional(),
});

export const RangesUpdateInputSchema = target({
	worksheet: worksheetIdSchema,
	address: z.string().regex(CELL_OR_RANGE),
	values: scalarOrGridSchema.optional(),
	formulas: formulaGridSchema.optional(),
	numberFormat: formulaGridSchema.optional(),
}).superRefine((value, ctx) => {
	if (
		value.values === undefined &&
		value.formulas === undefined &&
		value.numberFormat === undefined
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide values, formulas, or numberFormat',
			path: ['values'],
		});
	}
});

export const RangesClearInputSchema = target({
	worksheet: worksheetIdSchema,
	address: z.string().regex(CELL_OR_RANGE),
	applyTo: z.enum(['All', 'Formats', 'Contents']).optional(),
});

export const TablesListInputSchema = target({
	...pageShape,
	worksheet: worksheetIdSchema.optional(),
});

export const TablesGetInputSchema = target({ table: worksheetIdSchema });

export const TablesAddInputSchema = target({
	address: z.string().regex(RANGE_ADDRESS),
	hasHeaders: z.boolean(),
});

export const TablesUpdateInputSchema = target({
	table: worksheetIdSchema,
	name: z.string().min(1).max(255).optional(),
	showHeaders: z.boolean().optional(),
	showTotals: z.boolean().optional(),
	style: z.string().min(1).optional(),
}).superRefine((value, ctx) => {
	if (
		value.name === undefined &&
		value.showHeaders === undefined &&
		value.showTotals === undefined &&
		value.style === undefined
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide a table property to update',
			path: ['name'],
		});
	}
});

export const TablesDeleteInputSchema = TablesGetInputSchema;

export const TablesListRowsInputSchema = target({
	...pageShape,
	table: worksheetIdSchema,
});

export const TablesAddRowsInputSchema = target({
	table: worksheetIdSchema,
	values: gridSchema,
	index: z.number().int().nonnegative().optional(),
});

export const TablesDeleteRowInputSchema = target({
	table: worksheetIdSchema,
	index: z.number().int().nonnegative(),
});

export const TablesListColumnsInputSchema = TablesListRowsInputSchema;

export const TablesAddColumnInputSchema = target({
	table: worksheetIdSchema,
	values: gridSchema,
	index: z.number().int().nonnegative().optional(),
});

export const TablesDeleteColumnInputSchema = target({
	table: worksheetIdSchema,
	column: worksheetIdSchema,
});

export const FunctionsCalculateInputSchema = target({
	name: z.string().regex(/^[A-Za-z][A-Za-z0-9.]{0,63}$/),
	args: z.record(z.string(), functionArgSchema).optional(),
});

export const FilesCreateInputSchema = z
	.object({
		driveId: z.string().min(1).optional(),
		path: z.string().regex(XLSX_PATH),
	})
	.strict();

// Graph's chart type list ends with "etc.", so a closed enum would reject
// valid types the page does not spell out.
const chartTypeSchema = z.string().regex(/^[A-Za-z][A-Za-z0-9]{0,63}$/);
const seriesBySchema = z.enum(['Auto', 'Columns', 'Rows']);

export const chartSchema = z.looseObject({
	id: z.string(),
	name: z.string().optional(),
	height: z.number().optional(),
	left: z.number().optional(),
	top: z.number().optional(),
	width: z.number().optional(),
});

export const chartListSchema = z.looseObject({
	value: z.array(chartSchema),
	'@odata.nextLink': z.string().optional(),
});

const namedValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.looseObject({}),
]);

export const namedItemSchema = z.looseObject({
	name: z.string(),
	comment: z.string().optional(),
	scope: z.string().optional(),
	type: z.string().optional(),
	value: namedValueSchema.optional(),
	visible: z.boolean().optional(),
});

export const namedItemListSchema = z.looseObject({
	value: z.array(namedItemSchema),
	'@odata.nextLink': z.string().optional(),
});

export const commentSchema = z.looseObject({
	id: z.string(),
	content: z.string().optional(),
	contentType: z.string().optional(),
});

export const commentListSchema = z.looseObject({
	value: z.array(commentSchema),
	'@odata.nextLink': z.string().optional(),
});

export const driveItemListSchema = z.looseObject({
	value: z.array(driveItemSchema),
	'@odata.nextLink': z.string().optional(),
});

export const ChartsListInputSchema = target({
	...pageShape,
	worksheet: worksheetIdSchema,
});

export const ChartsGetInputSchema = target({
	worksheet: worksheetIdSchema,
	chart: worksheetIdSchema,
});

export const ChartsAddInputSchema = target({
	worksheet: worksheetIdSchema,
	type: chartTypeSchema,
	sourceData: z.string().regex(CELL_OR_RANGE),
	seriesBy: seriesBySchema.optional(),
});

export const ChartsUpdateInputSchema = target({
	worksheet: worksheetIdSchema,
	chart: worksheetIdSchema,
	name: z.string().min(1).max(255).optional(),
	height: z.number().nonnegative().optional(),
	width: z.number().nonnegative().optional(),
	left: z.number().optional(),
	top: z.number().optional(),
}).superRefine((value, ctx) => {
	if (
		value.name === undefined &&
		value.height === undefined &&
		value.width === undefined &&
		value.left === undefined &&
		value.top === undefined
	) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide a chart property to update',
			path: ['name'],
		});
	}
});

export const ChartsDeleteInputSchema = ChartsGetInputSchema;

export const ChartsSetDataInputSchema = target({
	worksheet: worksheetIdSchema,
	chart: worksheetIdSchema,
	sourceData: z.string().regex(CELL_OR_RANGE),
	seriesBy: seriesBySchema.optional(),
});

export const NamesListInputSchema = target({
	...pageShape,
	worksheet: worksheetIdSchema.optional(),
});

export const NamesGetInputSchema = target({
	worksheet: worksheetIdSchema.optional(),
	name: z.string().min(1).max(255),
});

export const NamesAddInputSchema = target({
	worksheet: worksheetIdSchema.optional(),
	name: z.string().min(1).max(255),
	reference: z.string().min(1).max(8192),
	comment: z.string().max(8192).optional(),
});

export const NamesUpdateInputSchema = target({
	worksheet: worksheetIdSchema.optional(),
	name: z.string().min(1).max(255),
	comment: z.string().max(8192).optional(),
	visible: z.boolean().optional(),
}).superRefine((value, ctx) => {
	if (value.comment === undefined && value.visible === undefined) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'Provide comment or visible',
			path: ['comment'],
		});
	}
});

export const NamesRangeInputSchema = NamesGetInputSchema;

export const CommentsListInputSchema = target(pageShape);

export const CommentsGetInputSchema = target({
	comment: worksheetIdSchema,
});

export const CommentsListRepliesInputSchema = target({
	...pageShape,
	comment: worksheetIdSchema,
});

export const CommentsReplyInputSchema = target({
	comment: worksheetIdSchema,
	content: z.string().min(1),
	contentType: z.string().min(1).max(32).optional(),
});

export const FilesFindInputSchema = z
	.object({
		driveId: z.string().min(1).optional(),
		query: z.string().regex(/^[^'()]{1,200}$/),
		top: z.number().int().positive().optional(),
	})
	.strict();

export type SessionsCreateInput = z.infer<typeof SessionsCreateInputSchema>;
export type SessionsCloseInput = z.infer<typeof SessionsCloseInputSchema>;
export type SessionsRefreshInput = z.infer<typeof SessionsRefreshInputSchema>;
export type WorksheetsListInput = z.infer<typeof WorksheetsListInputSchema>;
export type WorksheetsGetInput = z.infer<typeof WorksheetsGetInputSchema>;
export type WorksheetsAddInput = z.infer<typeof WorksheetsAddInputSchema>;
export type WorksheetsUpdateInput = z.infer<typeof WorksheetsUpdateInputSchema>;
export type WorksheetsDeleteInput = z.infer<typeof WorksheetsDeleteInputSchema>;
export type RangesGetInput = z.infer<typeof RangesGetInputSchema>;
export type RangesUsedInput = z.infer<typeof RangesUsedInputSchema>;
export type RangesUpdateInput = z.infer<typeof RangesUpdateInputSchema>;
export type RangesClearInput = z.infer<typeof RangesClearInputSchema>;
export type TablesListInput = z.infer<typeof TablesListInputSchema>;
export type TablesGetInput = z.infer<typeof TablesGetInputSchema>;
export type TablesAddInput = z.infer<typeof TablesAddInputSchema>;
export type TablesUpdateInput = z.infer<typeof TablesUpdateInputSchema>;
export type TablesDeleteInput = z.infer<typeof TablesDeleteInputSchema>;
export type TablesListRowsInput = z.infer<typeof TablesListRowsInputSchema>;
export type TablesAddRowsInput = z.infer<typeof TablesAddRowsInputSchema>;
export type TablesDeleteRowInput = z.infer<typeof TablesDeleteRowInputSchema>;
export type TablesListColumnsInput = z.infer<
	typeof TablesListColumnsInputSchema
>;
export type TablesAddColumnInput = z.infer<typeof TablesAddColumnInputSchema>;
export type TablesDeleteColumnInput = z.infer<
	typeof TablesDeleteColumnInputSchema
>;
export type FunctionsCalculateInput = z.infer<
	typeof FunctionsCalculateInputSchema
>;
export type FilesCreateInput = z.infer<typeof FilesCreateInputSchema>;
export type FilesFindInput = z.infer<typeof FilesFindInputSchema>;
export type ChartsListInput = z.infer<typeof ChartsListInputSchema>;
export type ChartsGetInput = z.infer<typeof ChartsGetInputSchema>;
export type ChartsAddInput = z.infer<typeof ChartsAddInputSchema>;
export type ChartsUpdateInput = z.infer<typeof ChartsUpdateInputSchema>;
export type ChartsDeleteInput = z.infer<typeof ChartsDeleteInputSchema>;
export type ChartsSetDataInput = z.infer<typeof ChartsSetDataInputSchema>;
export type NamesListInput = z.infer<typeof NamesListInputSchema>;
export type NamesGetInput = z.infer<typeof NamesGetInputSchema>;
export type NamesAddInput = z.infer<typeof NamesAddInputSchema>;
export type NamesUpdateInput = z.infer<typeof NamesUpdateInputSchema>;
export type NamesRangeInput = z.infer<typeof NamesRangeInputSchema>;
export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;
export type CommentsGetInput = z.infer<typeof CommentsGetInputSchema>;
export type CommentsListRepliesInput = z.infer<
	typeof CommentsListRepliesInputSchema
>;
export type CommentsReplyInput = z.infer<typeof CommentsReplyInputSchema>;

export type SessionOutput = z.infer<typeof sessionSchema>;
export type WorksheetOutput = z.infer<typeof worksheetSchema>;
export type WorksheetListOutput = z.infer<typeof worksheetListSchema>;
export type RangeOutput = z.infer<typeof rangeSchema>;
export type EmptyOutput = z.infer<typeof emptyOutputSchema>;
export type TableOutput = z.infer<typeof tableSchema>;
export type TableListOutput = z.infer<typeof tableListSchema>;
export type TableRowOutput = z.infer<typeof tableRowSchema>;
export type TableRowListOutput = z.infer<typeof tableRowListSchema>;
export type TableColumnOutput = z.infer<typeof tableColumnSchema>;
export type TableColumnListOutput = z.infer<typeof tableColumnListSchema>;
export type FunctionResultOutput = z.infer<typeof functionResultSchema>;
export type DriveItemOutput = z.infer<typeof driveItemSchema>;
export type DriveItemListOutput = z.infer<typeof driveItemListSchema>;
export type ChartOutput = z.infer<typeof chartSchema>;
export type ChartListOutput = z.infer<typeof chartListSchema>;
export type NamedItemOutput = z.infer<typeof namedItemSchema>;
export type NamedItemListOutput = z.infer<typeof namedItemListSchema>;
export type CommentOutput = z.infer<typeof commentSchema>;
export type CommentListOutput = z.infer<typeof commentListSchema>;

export type ExcelEndpointInputs = {
	sessionsCreate: SessionsCreateInput;
	sessionsClose: SessionsCloseInput;
	sessionsRefresh: SessionsRefreshInput;
	worksheetsList: WorksheetsListInput;
	worksheetsGet: WorksheetsGetInput;
	worksheetsAdd: WorksheetsAddInput;
	worksheetsUpdate: WorksheetsUpdateInput;
	worksheetsDelete: WorksheetsDeleteInput;
	rangesGet: RangesGetInput;
	rangesUsed: RangesUsedInput;
	rangesUpdate: RangesUpdateInput;
	rangesClear: RangesClearInput;
	tablesList: TablesListInput;
	tablesGet: TablesGetInput;
	tablesAdd: TablesAddInput;
	tablesUpdate: TablesUpdateInput;
	tablesDelete: TablesDeleteInput;
	tablesListRows: TablesListRowsInput;
	tablesAddRows: TablesAddRowsInput;
	tablesDeleteRow: TablesDeleteRowInput;
	tablesListColumns: TablesListColumnsInput;
	tablesAddColumn: TablesAddColumnInput;
	tablesDeleteColumn: TablesDeleteColumnInput;
	functionsCalculate: FunctionsCalculateInput;
	filesCreate: FilesCreateInput;
	filesFind: FilesFindInput;
	chartsList: ChartsListInput;
	chartsGet: ChartsGetInput;
	chartsAdd: ChartsAddInput;
	chartsUpdate: ChartsUpdateInput;
	chartsDelete: ChartsDeleteInput;
	chartsSetData: ChartsSetDataInput;
	namesList: NamesListInput;
	namesGet: NamesGetInput;
	namesAdd: NamesAddInput;
	namesUpdate: NamesUpdateInput;
	namesRange: NamesRangeInput;
	commentsList: CommentsListInput;
	commentsGet: CommentsGetInput;
	commentsListReplies: CommentsListRepliesInput;
	commentsReply: CommentsReplyInput;
};

export type ExcelEndpointOutputs = {
	sessionsCreate: SessionOutput;
	sessionsClose: EmptyOutput;
	sessionsRefresh: EmptyOutput;
	worksheetsList: WorksheetListOutput;
	worksheetsGet: WorksheetOutput;
	worksheetsAdd: WorksheetOutput;
	worksheetsUpdate: WorksheetOutput;
	worksheetsDelete: EmptyOutput;
	rangesGet: RangeOutput;
	rangesUsed: RangeOutput;
	rangesUpdate: RangeOutput;
	rangesClear: EmptyOutput;
	tablesList: TableListOutput;
	tablesGet: TableOutput;
	tablesAdd: TableOutput;
	tablesUpdate: TableOutput;
	tablesDelete: EmptyOutput;
	tablesListRows: TableRowListOutput;
	tablesAddRows: TableRowOutput;
	tablesDeleteRow: EmptyOutput;
	tablesListColumns: TableColumnListOutput;
	tablesAddColumn: TableColumnOutput;
	tablesDeleteColumn: EmptyOutput;
	functionsCalculate: FunctionResultOutput;
	filesCreate: DriveItemOutput;
	filesFind: DriveItemListOutput;
	chartsList: ChartListOutput;
	chartsGet: ChartOutput;
	chartsAdd: ChartOutput;
	chartsUpdate: ChartOutput;
	chartsDelete: EmptyOutput;
	chartsSetData: EmptyOutput;
	namesList: NamedItemListOutput;
	namesGet: NamedItemOutput;
	namesAdd: NamedItemOutput;
	namesUpdate: NamedItemOutput;
	namesRange: RangeOutput;
	commentsList: CommentListOutput;
	commentsGet: CommentOutput;
	commentsListReplies: CommentListOutput;
	commentsReply: CommentOutput;
};

export const ExcelEndpointInputSchemas = {
	sessionsCreate: SessionsCreateInputSchema,
	sessionsClose: SessionsCloseInputSchema,
	sessionsRefresh: SessionsRefreshInputSchema,
	worksheetsList: WorksheetsListInputSchema,
	worksheetsGet: WorksheetsGetInputSchema,
	worksheetsAdd: WorksheetsAddInputSchema,
	worksheetsUpdate: WorksheetsUpdateInputSchema,
	worksheetsDelete: WorksheetsDeleteInputSchema,
	rangesGet: RangesGetInputSchema,
	rangesUsed: RangesUsedInputSchema,
	rangesUpdate: RangesUpdateInputSchema,
	rangesClear: RangesClearInputSchema,
	tablesList: TablesListInputSchema,
	tablesGet: TablesGetInputSchema,
	tablesAdd: TablesAddInputSchema,
	tablesUpdate: TablesUpdateInputSchema,
	tablesDelete: TablesDeleteInputSchema,
	tablesListRows: TablesListRowsInputSchema,
	tablesAddRows: TablesAddRowsInputSchema,
	tablesDeleteRow: TablesDeleteRowInputSchema,
	tablesListColumns: TablesListColumnsInputSchema,
	tablesAddColumn: TablesAddColumnInputSchema,
	tablesDeleteColumn: TablesDeleteColumnInputSchema,
	functionsCalculate: FunctionsCalculateInputSchema,
	filesCreate: FilesCreateInputSchema,
	filesFind: FilesFindInputSchema,
	chartsList: ChartsListInputSchema,
	chartsGet: ChartsGetInputSchema,
	chartsAdd: ChartsAddInputSchema,
	chartsUpdate: ChartsUpdateInputSchema,
	chartsDelete: ChartsDeleteInputSchema,
	chartsSetData: ChartsSetDataInputSchema,
	namesList: NamesListInputSchema,
	namesGet: NamesGetInputSchema,
	namesAdd: NamesAddInputSchema,
	namesUpdate: NamesUpdateInputSchema,
	namesRange: NamesRangeInputSchema,
	commentsList: CommentsListInputSchema,
	commentsGet: CommentsGetInputSchema,
	commentsListReplies: CommentsListRepliesInputSchema,
	commentsReply: CommentsReplyInputSchema,
} as const;

export const ExcelEndpointOutputSchemas = {
	sessionsCreate: sessionSchema,
	sessionsClose: emptyOutputSchema,
	sessionsRefresh: emptyOutputSchema,
	worksheetsList: worksheetListSchema,
	worksheetsGet: worksheetSchema,
	worksheetsAdd: worksheetSchema,
	worksheetsUpdate: worksheetSchema,
	worksheetsDelete: emptyOutputSchema,
	rangesGet: rangeSchema,
	rangesUsed: rangeSchema,
	rangesUpdate: rangeSchema,
	rangesClear: emptyOutputSchema,
	tablesList: tableListSchema,
	tablesGet: tableSchema,
	tablesAdd: tableSchema,
	tablesUpdate: tableSchema,
	tablesDelete: emptyOutputSchema,
	tablesListRows: tableRowListSchema,
	tablesAddRows: tableRowSchema,
	tablesDeleteRow: emptyOutputSchema,
	tablesListColumns: tableColumnListSchema,
	tablesAddColumn: tableColumnSchema,
	tablesDeleteColumn: emptyOutputSchema,
	functionsCalculate: functionResultSchema,
	filesCreate: driveItemSchema,
	filesFind: driveItemListSchema,
	chartsList: chartListSchema,
	chartsGet: chartSchema,
	chartsAdd: chartSchema,
	chartsUpdate: chartSchema,
	chartsDelete: emptyOutputSchema,
	chartsSetData: emptyOutputSchema,
	namesList: namedItemListSchema,
	namesGet: namedItemSchema,
	namesAdd: namedItemSchema,
	namesUpdate: namedItemSchema,
	namesRange: rangeSchema,
	commentsList: commentListSchema,
	commentsGet: commentSchema,
	commentsListReplies: commentListSchema,
	commentsReply: commentSchema,
} as const;
