export type Spreadsheet = {
	spreadsheetId?: string;
	properties?: SpreadsheetProperties;
	sheets?: Sheet[];
	namedRanges?: NamedRange[];
	spreadsheetUrl?: string;
	developerMetadata?: DeveloperMetadata[];
};

export type SpreadsheetProperties = {
	title?: string;
	locale?: string;
	autoRecalc?: 'ON_CHANGE' | 'ON_UPDATE' | 'HOUR' | 'MINUTE';
	timeZone?: string;
	defaultFormat?: CellFormat;
	iterativeCalculationSettings?: IterativeCalculationSettings;
};

export type Sheet = {
	properties?: SheetProperties;
	data?: GridData[];
	merges?: GridRange[];
	conditionalFormats?: ConditionalFormatRule[];
	filterViews?: FilterView[];
	protectedRanges?: ProtectedRange[];
	basicFilter?: BasicFilter;
	charts?: EmbeddedChart[];
	bandedRanges?: BandedRange[];
	developerMetadata?: DeveloperMetadata[];
};

export type SheetProperties = {
	sheetId?: number;
	title?: string;
	index?: number;
	sheetType?: 'GRID' | 'OBJECT' | 'DATA_SOURCE';
	gridProperties?: GridProperties;
	hidden?: boolean;
	tabColor?: Color;
	rightToLeft?: boolean;
};

export type GridProperties = {
	rowCount?: number;
	columnCount?: number;
	frozenRowCount?: number;
	frozenColumnCount?: number;
	hideGridlines?: boolean;
	rowGroupControlAfter?: boolean;
	columnGroupControlAfter?: boolean;
};

export type GridData = {
	startRow?: number;
	startColumn?: number;
	rowData?: RowData[];
	rowMetadata?: DimensionProperties[];
	columnMetadata?: DimensionProperties[];
};

export type RowData = {
	values?: CellData[];
};

export type CellData = {
	userEnteredValue?: ExtendedValue;
	effectiveValue?: ExtendedValue;
	formattedValue?: string;
	userEnteredFormat?: CellFormat;
	effectiveFormat?: CellFormat;
	hyperlink?: string;
	note?: string;
	textFormatRuns?: TextFormatRun[];
	dataValidation?: DataValidationRule;
	pivotTable?: PivotTable;
};

export type ExtendedValue = {
	numberValue?: number;
	stringValue?: string;
	boolValue?: boolean;
	formulaValue?: string;
	errorValue?: ErrorValue;
};

export type ErrorValue = {
	type?:
		| 'ERROR_TYPE_UNSPECIFIED'
		| 'ERROR'
		| 'NULL_VALUE'
		| 'DIVIDE_BY_ZERO'
		| 'VALUE'
		| 'REF'
		| 'NAME'
		| 'NUM'
		| 'N_A'
		| 'LOADING';
	message?: string;
};

export type CellFormat = {
	numberFormat?: NumberFormat;
	backgroundColor?: Color;
	borders?: Borders;
	padding?: Padding;
	horizontalAlignment?: 'LEFT' | 'CENTER' | 'RIGHT';
	verticalAlignment?: 'TOP' | 'MIDDLE' | 'BOTTOM';
	wrapStrategy?: 'OVERFLOW_CELL' | 'LEGACY_WRAP' | 'CLIP' | 'WRAP';
	textDirection?: 'LEFT_TO_RIGHT' | 'RIGHT_TO_LEFT';
	textFormat?: TextFormat;
	hyperlinkDisplayType?: 'LINKED' | 'PLAIN_TEXT';
};

export type NumberFormat = {
	type?:
		| 'NUMBER_FORMAT_TYPE_UNSPECIFIED'
		| 'TEXT'
		| 'NUMBER'
		| 'PERCENT'
		| 'CURRENCY'
		| 'DATE'
		| 'TIME'
		| 'DATE_TIME'
		| 'SCIENTIFIC';
	pattern?: string;
};

export type Color = {
	red?: number;
	green?: number;
	blue?: number;
	alpha?: number;
};

export type Borders = {
	top?: Border;
	bottom?: Border;
	left?: Border;
	right?: Border;
};

export type Border = {
	style?:
		| 'STYLE_UNSPECIFIED'
		| 'DOTTED'
		| 'DASHED'
		| 'SOLID'
		| 'SOLID_MEDIUM'
		| 'SOLID_THICK'
		| 'NONE'
		| 'DOUBLE';
	color?: Color;
};

export type Padding = {
	top?: number;
	right?: number;
	bottom?: number;
	left?: number;
};

export type TextFormat = {
	foregroundColor?: Color;
	fontFamily?: string;
	fontSize?: number;
	bold?: boolean;
	italic?: boolean;
	strikethrough?: boolean;
	underline?: boolean;
};

export type TextFormatRun = {
	startIndex?: number;
	format?: TextFormat;
};

export type DataValidationRule = {
	condition?: BooleanCondition;
	inputMessage?: string;
	strict?: boolean;
	showCustomUi?: boolean;
};

export type BooleanCondition = {
	type?:
		| 'CONDITION_TYPE_UNSPECIFIED'
		| 'NUMBER_GREATER'
		| 'NUMBER_GREATER_THAN_EQ'
		| 'NUMBER_LESS'
		| 'NUMBER_LESS_THAN_EQ'
		| 'NUMBER_EQ'
		| 'NUMBER_NOT_EQ'
		| 'NUMBER_BETWEEN'
		| 'NUMBER_NOT_BETWEEN'
		| 'TEXT_CONTAINS'
		| 'TEXT_NOT_CONTAINS'
		| 'TEXT_STARTS_WITH'
		| 'TEXT_ENDS_WITH'
		| 'TEXT_EQ'
		| 'TEXT_IS_EMAIL'
		| 'TEXT_IS_URL'
		| 'DATE_EQ'
		| 'DATE_BEFORE'
		| 'DATE_AFTER'
		| 'DATE_ON_OR_BEFORE'
		| 'DATE_ON_OR_AFTER'
		| 'DATE_BETWEEN'
		| 'DATE_NOT_BETWEEN'
		| 'DATE_IS_VALID'
		| 'ONE_OF_RANGE'
		| 'ONE_OF_LIST'
		| 'BLANK'
		| 'NOT_BLANK'
		| 'CUSTOM_FORMULA';
	values?: ConditionValue[];
};

export type ConditionValue = {
	relativeDate?:
		| 'RELATIVE_DATE_UNSPECIFIED'
		| 'PAST_YEAR'
		| 'PAST_MONTH'
		| 'PAST_WEEK'
		| 'YESTERDAY'
		| 'TODAY'
		| 'TOMORROW';
	userEnteredValue?: string;
};

export type PivotTable = {
	source?: GridRange;
	rows?: PivotGroup[];
	columns?: PivotGroup[];
	criteria?: Record<number, PivotFilterCriteria>;
	values?: PivotValue[];
	valueLayout?: 'HORIZONTAL' | 'VERTICAL';
};

export type PivotGroup = {
	sourceColumnOffset?: number;
	showTotals?: boolean;
	valueMetadata?: PivotGroupValueMetadata[];
	sortOrder?: 'ASCENDING' | 'DESCENDING';
	valueBucket?: PivotGroupSortValueBucket;
	repeatHeadings?: boolean;
	label?: string;
};

export type PivotGroupValueMetadata = {
	value?: ExtendedValue;
	collapsed?: boolean;
};

export type PivotGroupSortValueBucket = {
	values?: ExtendedValue[];
	buckets?: PivotGroupSortValueBucket[];
};

export type PivotFilterCriteria = {
	visibleValues?: string[];
};

export type PivotValue = {
	sourceColumnOffset?: number;
	formula?: string;
	name?: string;
	calculatedDisplayType?:
		| 'PIVOT_VALUE_CALCULATED_DISPLAY_TYPE_UNSPECIFIED'
		| 'PERCENT_OF_ROW_TOTAL'
		| 'PERCENT_OF_COLUMN_TOTAL'
		| 'PERCENT_OF_GRAND_TOTAL';
};

export type DimensionProperties = {
	hiddenByUser?: boolean;
	hiddenByFilter?: boolean;
	pixelSize?: number;
	developerMetadata?: DeveloperMetadata[];
};

export type DeveloperMetadata = {
	metadataId?: number;
	metadataKey?: string;
	metadataValue?: string;
	location?: DeveloperMetadataLocation;
	visibility?:
		| 'DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED'
		| 'DOCUMENT'
		| 'PROJECT';
};

export type DeveloperMetadataLocation = {
	sheetId?: number;
	spreadsheetLocation?: boolean;
	dimensionRange?: DimensionRange;
	locationType?: 'ROW' | 'COLUMN' | 'SHEET' | 'SPREADSHEET';
};

export type DimensionRange = {
	sheetId?: number;
	dimension?: 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS';
	startIndex?: number;
	endIndex?: number;
};

export type GridRange = {
	sheetId?: number;
	startRowIndex?: number;
	endRowIndex?: number;
	startColumnIndex?: number;
	endColumnIndex?: number;
};

export type NamedRange = {
	namedRangeId?: string;
	name?: string;
	range?: GridRange;
};

export type ConditionalFormatRule = {
	ranges?: GridRange[];
	booleanRule?: BooleanRule;
	gradientRule?: GradientRule;
};

export type BooleanRule = {
	condition?: BooleanCondition;
	format?: CellFormat;
};

export type GradientRule = {
	minpoint?: InterpolationPoint;
	midpoint?: InterpolationPoint;
	maxpoint?: InterpolationPoint;
};

export type InterpolationPoint = {
	color?: Color;
	value?: string;
	type?: 'NUMBER' | 'PERCENT' | 'PERCENTILE' | 'MIN' | 'MAX';
};

export type FilterView = {
	filterViewId?: number;
	title?: string;
	range?: GridRange;
	namedRangeId?: string;
	sortSpecs?: SortSpec[];
	criteria?: Record<number, FilterCriteria>;
};

export type SortSpec = {
	dimensionIndex?: number;
	sortOrder?: 'ASCENDING' | 'DESCENDING';
	dataSourceColumnReference?: DataSourceColumnReference;
};

export type DataSourceColumnReference = {
	name?: string;
};

export type FilterCriteria = {
	hiddenValues?: string[];
	condition?: BooleanCondition;
	visibleBackgroundColor?: Color;
	visibleForegroundColor?: Color;
};

export type ProtectedRange = {
	protectedRangeId?: number;
	range?: GridRange;
	namedRangeId?: string;
	description?: string;
	warningOnly?: boolean;
	unprotectedRanges?: GridRange[];
	editors?: Editors;
};

export type Editors = {
	users?: string[];
	groups?: string[];
	domainUsersCanEdit?: boolean;
};

export type BasicFilter = {
	range?: GridRange;
	sortSpecs?: SortSpec[];
	criteria?: Record<number, FilterCriteria>;
};

export type EmbeddedChart = {
	chartId?: number;
	spec?: ChartSpec;
	position?: EmbeddedObjectPosition;
};

export type ChartSpec = {
	title?: string;
	altText?: string;
	titleTextFormat?: TextFormat;
	titleTextPosition?: TextPosition;
	subtitle?: string;
	subtitleTextFormat?: TextFormat;
	subtitleTextPosition?: TextPosition;
	fontName?: string;
	backgroundColor?: Color;
	chartType?:
		| 'CHART_TYPE_UNSPECIFIED'
		| 'COLUMN'
		| 'LINE'
		| 'PIE'
		| 'BAR'
		| 'AREA'
		| 'SCATTER'
		| 'STOCK'
		| 'HISTOGRAM'
		| 'CANDLESTICK'
		| 'COMBO'
		| 'ORG_CHART'
		| 'WATERFALL'
		| 'TREEMAP';
	legendPosition?:
		| 'LEGEND_POSITION_UNSPECIFIED'
		| 'BOTTOM_LEGEND'
		| 'LEFT_LEGEND'
		| 'RIGHT_LEGEND'
		| 'TOP_LEGEND'
		| 'NO_LEGEND'
		| 'INSIDE_LEGEND';
	axis?: ChartAxis[];
	domains?: BasicChartDomain[];
	series?: BasicChartSeries[];
	headerCount?: number;
	threeDimensional?: boolean;
	interpolateNulls?: boolean;
	stackedType?:
		| 'STACKED_TYPE_UNSPECIFIED'
		| 'NOT_STACKED'
		| 'STACKED'
		| 'PERCENT_STACKED';
	lineSmoothing?: boolean;
	compareMode?: 'BASIC_CHART_COMPARE_MODE_UNSPECIFIED' | 'DATUM' | 'CATEGORY';
	dataSourceChartProperties?: DataSourceChartProperties;
};

export type TextPosition = {
	horizontalAlignment?:
		| 'HORIZONTAL_ALIGN_UNSPECIFIED'
		| 'LEFT'
		| 'CENTER'
		| 'RIGHT';
	verticalAlignment?:
		| 'VERTICAL_ALIGN_UNSPECIFIED'
		| 'TOP'
		| 'MIDDLE'
		| 'BOTTOM';
};

export type ChartAxis = {
	position?:
		| 'CHART_AXIS_POSITION_UNSPECIFIED'
		| 'BOTTOM_AXIS'
		| 'LEFT_AXIS'
		| 'RIGHT_AXIS';
	format?: TextFormat;
	title?: string;
	titleTextPosition?: TextPosition;
	viewWindowOptions?: ChartAxisViewWindowOptions;
};

export type ChartAxisViewWindowOptions = {
	viewWindowMode?: 'DEFAULT_VIEW_WINDOW_MODE' | 'EXPLICIT' | 'PRETTY';
	viewWindowMin?: number;
	viewWindowMax?: number;
};

export type BasicChartDomain = {
	domain?: ChartData;
	reversed?: boolean;
};

export type ChartData = {
	sourceRange?: ChartSourceRange;
};

export type ChartSourceRange = {
	sources?: GridRange[];
};

export type BasicChartSeries = {
	series?: ChartData;
	targetAxis?:
		| 'BASIC_CHART_AXIS_POSITION_UNSPECIFIED'
		| 'BOTTOM_AXIS'
		| 'LEFT_AXIS'
		| 'RIGHT_AXIS';
	type?: 'BASIC_CHART_TYPE_UNSPECIFIED' | 'BAR' | 'LINE' | 'AREA' | 'COLUMN';
	color?: Color;
	colorStyle?: ColorStyle;
	lineStyle?: LineStyle;
	pointStyle?: PointStyle;
};

export type ColorStyle = {
	rgbColor?: Color;
	themeColor?:
		| 'THEME_COLOR_TYPE_UNSPECIFIED'
		| 'TEXT'
		| 'BACKGROUND'
		| 'ACCENT1'
		| 'ACCENT2'
		| 'ACCENT3'
		| 'ACCENT4'
		| 'ACCENT5'
		| 'ACCENT6'
		| 'LINK';
};

export type LineStyle = {
	width?: number;
	type?:
		| 'LINE_TYPE_UNSPECIFIED'
		| 'STRAIGHT_LINES'
		| 'SMOOTH_LINES'
		| 'STRAIGHT_LINES_WITH_MARKERS'
		| 'SMOOTH_LINES_WITH_MARKERS';
};

export type PointStyle = {
	size?: number;
	shape?:
		| 'POINT_SHAPE_UNSPECIFIED'
		| 'CIRCLE'
		| 'DIAMOND'
		| 'SQUARE'
		| 'STAR'
		| 'TRIANGLE'
		| 'X_MARK';
};

export type DataSourceChartProperties = {
	dataSourceExecutionStatus?: DataSourceExecutionStatus;
	dataSourceId?: string;
};

export type DataSourceExecutionStatus = {
	state?:
		| 'DATA_SOURCE_EXECUTION_STATUS_UNSPECIFIED'
		| 'RUNNING'
		| 'SUCCEEDED'
		| 'FAILED'
		| 'CANCELLED';
	dataExecutionStatus?: DataExecutionStatus;
};

export type DataExecutionStatus = {
	state?:
		| 'DATA_EXECUTION_STATE_UNSPECIFIED'
		| 'NOT_STARTED'
		| 'RUNNING'
		| 'SUCCEEDED'
		| 'FAILED';
	errorCode?:
		| 'DATA_EXECUTION_ERROR_CODE_UNSPECIFIED'
		| 'TIMED_OUT'
		| 'TOO_MANY_ROWS'
		| 'TOO_MANY_COLUMNS'
		| 'TOO_MANY_CELLS'
		| 'ENGINE'
		| 'PARAMETER_INVALID'
		| 'UNSUPPORTED_DATA_TYPE'
		| 'DUPLICATE_COLUMN_NAMES'
		| 'INTERRUPTED';
	errorMessage?: string;
	lastRefreshTime?: string;
};

export type EmbeddedObjectPosition = {
	sheetId?: number;
	overlayPosition?: OverlayPosition;
};

export type OverlayPosition = {
	anchorCell?: GridCoordinate;
	offsetXPixels?: number;
	offsetYPixels?: number;
	widthPixels?: number;
	heightPixels?: number;
};

export type GridCoordinate = {
	rowIndex?: number;
	columnIndex?: number;
};

export type BandedRange = {
	bandedRangeId?: number;
	range?: GridRange;
	rowProperties?: BandingProperties;
	columnProperties?: BandingProperties;
};

export type BandingProperties = {
	headerColor?: Color;
	firstBandColor?: Color;
	secondBandColor?: Color;
	footerColor?: Color;
};

export type IterativeCalculationSettings = {
	maxIterations?: number;
	convergenceThreshold?: number;
};

export type ValueRange = {
	range?: string;
	majorDimension?: 'ROWS' | 'COLUMNS' | 'DIMENSION_UNSPECIFIED';
	values?: (string | number | boolean | null)[][];
};

export type BatchUpdateValuesRequest = {
	valueInputOption?: 'INPUT_VALUE_OPTION_UNSPECIFIED' | 'RAW' | 'USER_ENTERED';
	data?: ValueRange[];
	includeValuesInResponse?: boolean;
	responseValueRenderOption?:
		| 'FORMATTED_VALUE'
		| 'UNFORMATTED_VALUE'
		| 'FORMULA';
	responseDateTimeRenderOption?: 'SERIAL_NUMBER' | 'FORMATTED_STRING';
};

export type BatchUpdateValuesResponse = {
	spreadsheetId?: string;
	totalUpdatedRows?: number;
	totalUpdatedColumns?: number;
	totalUpdatedCells?: number;
	totalUpdatedSheets?: number;
	responses?: UpdateValuesResponse[];
};

export type UpdateValuesResponse = {
	spreadsheetId?: string;
	updatedRange?: string;
	updatedRows?: number;
	updatedColumns?: number;
	updatedCells?: number;
	updatedData?: ValueRange;
};

export type ClearValuesRequest = {
	spreadsheetId?: string;
	range?: string;
};

export type ClearValuesResponse = {
	spreadsheetId?: string;
	clearedRange?: string;
};

export type BatchClearValuesRequest = {
	ranges?: string[];
};

export type BatchClearValuesResponse = {
	spreadsheetId?: string;
	clearedRanges?: string[];
};

export type BatchGetValuesResponse = {
	spreadsheetId?: string;
	valueRanges?: ValueRange[];
};

export type AddSheetRequest = {
	properties?: SheetProperties;
};

export type AddSheetResponse = {
	properties?: SheetProperties;
};

export type DeleteSheetRequest = {
	sheetId?: number;
};

export type BatchUpdateSpreadsheetRequest = {
	requests?: Request[];
	includeSpreadsheetInResponse?: boolean;
	responseRanges?: string[];
	responseIncludeGridData?: boolean;
};

export type BatchUpdateSpreadsheetResponse = {
	spreadsheetId?: string;
	replies?: any[];
	updatedSpreadsheet?: Spreadsheet;
};

export type Request = {
	addSheet?: AddSheetRequest;
	deleteSheet?: DeleteSheetRequest;
	updateSheetProperties?: UpdateSheetPropertiesRequest;
	updateDimensionProperties?: UpdateDimensionPropertiesRequest;
	appendCells?: AppendCellsRequest;
	deleteDimension?: DeleteDimensionRequest;
	insertDimension?: InsertDimensionRequest;
	mergeCells?: MergeCellsRequest;
	unmergeCells?: UnmergeCellsRequest;
	updateCells?: UpdateCellsRequest;
	updateBorders?: UpdateBordersRequest;
	updateFilterView?: UpdateFilterViewRequest;
	deleteFilterView?: DeleteFilterViewRequest;
	appendDimension?: AppendDimensionRequest;
	addConditionalFormatRule?: AddConditionalFormatRuleRequest;
	deleteConditionalFormatRule?: DeleteConditionalFormatRuleRequest;
	updateConditionalFormatRule?: UpdateConditionalFormatRuleRequest;
	sortRange?: SortRangeRequest;
	setDataValidation?: SetDataValidationRequest;
	deleteRange?: DeleteRangeRequest;
	cutPaste?: CutPasteRequest;
	copyPaste?: CopyPasteRequest;
	moveDimension?: MoveDimensionRequest;
	updateEmbeddedObjectPosition?: UpdateEmbeddedObjectPositionRequest;
	deleteEmbeddedObject?: DeleteEmbeddedObjectRequest;
	updateChartSpec?: UpdateChartSpecRequest;
	addBanding?: AddBandingRequest;
	deleteBanding?: DeleteBandingRequest;
	createDeveloperMetadata?: CreateDeveloperMetadataRequest;
	updateDeveloperMetadata?: UpdateDeveloperMetadataRequest;
	deleteDeveloperMetadata?: DeleteDeveloperMetadataRequest;
	randomizeRange?: RandomizeRangeRequest;
	addDimensionGroup?: AddDimensionGroupRequest;
	deleteDimensionGroup?: DeleteDimensionGroupRequest;
	updateDimensionGroup?: UpdateDimensionGroupRequest;
	trimWhitespace?: TrimWhitespaceRequest;
	deleteDuplicates?: DeleteDuplicatesRequest;
	addSlicer?: AddSlicerRequest;
	updateSlicerSpec?: UpdateSlicerSpecRequest;
	deleteSlicer?: DeleteSlicerRequest;
};

export type UpdateSheetPropertiesRequest = {
	properties?: SheetProperties;
	fields?: string;
};

export type UpdateDimensionPropertiesRequest = {
	range?: DimensionRange;
	properties?: DimensionProperties;
	fields?: string;
};

export type AppendCellsRequest = {
	sheetId?: number;
	rows?: RowData[];
	fields?: string;
};

export type DeleteDimensionRequest = {
	range?: DimensionRange;
};

export type InsertDimensionRequest = {
	range?: DimensionRange;
	inheritFromBefore?: boolean;
};

export type MergeCellsRequest = {
	range?: GridRange;
	mergeType?: 'MERGE_ALL' | 'MERGE_COLUMNS' | 'MERGE_ROWS';
};

export type UnmergeCellsRequest = {
	range?: GridRange;
};

export type UpdateCellsRequest = {
	rows?: RowData[];
	fields?: string;
	start?: GridCoordinate;
	range?: GridRange;
};

export type UpdateBordersRequest = {
	range?: GridRange;
	top?: Border;
	bottom?: Border;
	left?: Border;
	right?: Border;
	innerHorizontal?: Border;
	innerVertical?: Border;
};

export type UpdateFilterViewRequest = {
	filter?: FilterView;
	fields?: string;
};

export type DeleteFilterViewRequest = {
	filterId?: number;
};

export type AppendDimensionRequest = {
	sheetId?: number;
	dimension?: 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS';
	length?: number;
};

export type AddConditionalFormatRuleRequest = {
	rule?: ConditionalFormatRule;
	index?: number;
};

export type DeleteConditionalFormatRuleRequest = {
	sheetId?: number;
	index?: number;
};

export type UpdateConditionalFormatRuleRequest = {
	sheetId?: number;
	index?: number;
	rule?: ConditionalFormatRule;
	newIndex?: number;
};

export type SortRangeRequest = {
	range?: GridRange;
	sortSpecs?: SortSpec[];
};

export type SetDataValidationRequest = {
	range?: GridRange;
	rule?: DataValidationRule;
};

export type DeleteRangeRequest = {
	range?: GridRange;
	shiftDimension?: 'DIMENSION_UNSPECIFIED' | 'ROWS' | 'COLUMNS';
};

export type CutPasteRequest = {
	source?: GridRange;
	destination?: GridCoordinate;
	pasteType?:
		| 'PASTE_NORMAL'
		| 'PASTE_VALUES'
		| 'PASTE_FORMAT'
		| 'PASTE_NO_BORDERS'
		| 'PASTE_FORMULA'
		| 'PASTE_DATA_VALIDATION'
		| 'PASTE_CONDITIONAL_FORMATTING'
		| 'PASTE_ALL';
};

export type CopyPasteRequest = {
	source?: GridRange;
	destination?: GridCoordinate;
	pasteType?:
		| 'PASTE_NORMAL'
		| 'PASTE_VALUES'
		| 'PASTE_FORMAT'
		| 'PASTE_NO_BORDERS'
		| 'PASTE_FORMULA'
		| 'PASTE_DATA_VALIDATION'
		| 'PASTE_CONDITIONAL_FORMATTING'
		| 'PASTE_ALL';
	pasteOrientation?: 'NORMAL' | 'TRANSPOSE';
};

export type MoveDimensionRequest = {
	source?: DimensionRange;
	destinationIndex?: number;
};

export type UpdateEmbeddedObjectPositionRequest = {
	objectId?: number;
	newPosition?: EmbeddedObjectPosition;
	fields?: string;
};

export type DeleteEmbeddedObjectRequest = {
	objectId?: number;
};

export type UpdateChartSpecRequest = {
	chartId?: number;
	spec?: ChartSpec;
};

export type AddBandingRequest = {
	bandedRange?: BandedRange;
};

export type DeleteBandingRequest = {
	bandedRangeId?: number;
};

export type CreateDeveloperMetadataRequest = {
	developerMetadata?: DeveloperMetadata;
};

export type UpdateDeveloperMetadataRequest = {
	developerMetadata?: DeveloperMetadata;
	dataFilters?: DataFilter[];
	fields?: string;
};

export type DataFilter = {
	developerMetadataLookup?: DeveloperMetadataLookup;
	a1Range?: string;
};

export type DeveloperMetadataLookup = {
	locationType?:
		| 'DEVELOPER_METADATA_LOCATION_TYPE_UNSPECIFIED'
		| 'ROW'
		| 'COLUMN'
		| 'SHEET'
		| 'SPREADSHEET';
	locationMatchingStrategy?:
		| 'LOCATION_MATCHING_STRATEGY_UNSPECIFIED'
		| 'EXACT_LOCATION'
		| 'INTERSECTING_LOCATION';
	metadataId?: number;
	metadataKey?: string;
	metadataValue?: string;
	visibility?:
		| 'DEVELOPER_METADATA_VISIBILITY_UNSPECIFIED'
		| 'DOCUMENT'
		| 'PROJECT';
};

export type DeleteDeveloperMetadataRequest = {
	dataFilter?: DataFilter;
};

export type RandomizeRangeRequest = {
	range?: GridRange;
};

export type AddDimensionGroupRequest = {
	range?: DimensionRange;
};

export type DeleteDimensionGroupRequest = {
	range?: DimensionRange;
};

export type UpdateDimensionGroupRequest = {
	range?: DimensionRange;
	dimensionGroup?: DimensionGroup;
	fields?: string;
};

export type DimensionGroup = {
	range?: DimensionRange;
	depth?: number;
	collapsed?: boolean;
};

export type TrimWhitespaceRequest = {
	range?: GridRange;
};

export type DeleteDuplicatesRequest = {
	range?: GridRange;
	comparisonColumns?: number[];
};

export type AddSlicerRequest = {
	slicer?: SlicerSpec;
};

export type SlicerSpec = {
	slicerId?: number;
	title?: string;
	position?: EmbeddedObjectPosition;
	applyToPivotTables?: boolean;
	dataSourceColumn?: DataSourceColumnReference;
};

export type UpdateSlicerSpecRequest = {
	slicerId?: number;
	spec?: SlicerSpec;
	fields?: string;
};

export type DeleteSlicerRequest = {
	slicerId?: number;
};