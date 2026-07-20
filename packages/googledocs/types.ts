// Google Docs API v1 resource types (subset used by this plugin).
// https://developers.google.com/docs/api/reference/rest/v1/documents

export type TextRun = {
	content?: string;
	textStyle?: TextStyle;
};

export type TextStyle = {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	fontSize?: { magnitude?: number; unit?: string };
	weightedFontFamily?: { fontFamily?: string; weight?: number };
	link?: { url?: string };
};

export type ParagraphElement = {
	startIndex?: number;
	endIndex?: number;
	textRun?: TextRun;
	inlineObjectElement?: { inlineObjectId?: string };
	pageBreak?: Record<string, unknown>;
	footnoteReference?: { footnoteId?: string };
	horizontalRule?: Record<string, unknown>;
};

export type ParagraphStyle = {
	namedStyleType?: string;
	alignment?: string;
	direction?: string;
	headingId?: string;
};

export type Paragraph = {
	elements?: ParagraphElement[];
	paragraphStyle?: ParagraphStyle;
	bullet?: { listId?: string; nestingLevel?: number };
};

export type TableCell = {
	startIndex?: number;
	endIndex?: number;
	content?: StructuralElement[];
};

export type TableRow = {
	startIndex?: number;
	endIndex?: number;
	tableCells?: TableCell[];
	tableRowStyle?: TableRowStyle;
};

export type TableRowStyle = {
	minRowHeight?: { magnitude?: number; unit?: string };
	tableHeader?: boolean;
	preventOverflow?: boolean;
};

export type Table = {
	rows?: number;
	columns?: number;
	tableRows?: TableRow[];
};

export type SectionBreak = {
	sectionStyle?: Record<string, unknown>;
};

export type StructuralElement = {
	startIndex?: number;
	endIndex?: number;
	paragraph?: Paragraph;
	table?: Table;
	sectionBreak?: SectionBreak;
	tableOfContents?: { content?: StructuralElement[] };
};

export type Body = {
	content?: StructuralElement[];
};

export type Header = {
	headerId?: string;
	content?: StructuralElement[];
};

export type Footer = {
	footerId?: string;
	content?: StructuralElement[];
};

export type Footnote = {
	footnoteId?: string;
	content?: StructuralElement[];
};

export type NamedRange = {
	namedRangeId?: string;
	name?: string;
	ranges?: DocsRange[];
};

export type NamedRanges = {
	name?: string;
	namedRanges?: NamedRange[];
};

export type DocsRange = {
	segmentId?: string;
	startIndex?: number;
	endIndex?: number;
	tabId?: string;
};

export type Location = {
	segmentId?: string;
	index?: number;
	tabId?: string;
};

export type EndOfSegmentLocation = {
	segmentId?: string;
	tabId?: string;
};

export type Size = {
	height?: { magnitude?: number; unit?: string };
	width?: { magnitude?: number; unit?: string };
};

export type InlineObject = {
	objectId?: string;
	inlineObjectProperties?: {
		embeddedObject?: {
			title?: string;
			description?: string;
			imageProperties?: { contentUri?: string; sourceUri?: string };
			size?: Size;
		};
	};
};

export type DocumentStyle = {
	background?: Record<string, unknown>;
	pageSize?: Size;
	marginTop?: { magnitude?: number; unit?: string };
	marginBottom?: { magnitude?: number; unit?: string };
	marginLeft?: { magnitude?: number; unit?: string };
	marginRight?: { magnitude?: number; unit?: string };
	defaultHeaderId?: string;
	defaultFooterId?: string;
	firstPageHeaderId?: string;
	firstPageFooterId?: string;
	evenPageHeaderId?: string;
	evenPageFooterId?: string;
	useFirstPageHeaderFooter?: boolean;
	pageNumberStart?: number;
	flipPageOrientation?: boolean;
};

export type Document = {
	documentId?: string;
	title?: string;
	revisionId?: string;
	suggestionsViewMode?: string;
	body?: Body;
	headers?: Record<string, Header>;
	footers?: Record<string, Footer>;
	footnotes?: Record<string, Footnote>;
	namedRanges?: Record<string, NamedRanges>;
	inlineObjects?: Record<string, InlineObject>;
	positionedObjects?: Record<string, unknown>;
	lists?: Record<string, unknown>;
	documentStyle?: DocumentStyle;
};

// batchUpdate request/response
// https://developers.google.com/docs/api/reference/rest/v1/documents/batchUpdate

export type BatchUpdateRequest = Record<string, unknown>;

export type BatchUpdateResponse = {
	documentId?: string;
	replies?: Array<Record<string, unknown>>;
	writeControl?: { requiredRevisionId?: string; targetRevisionId?: string };
};

// Google Drive file resource (subset used for search / copy / export / folders)

export type DriveFile = {
	id?: string;
	name?: string;
	mimeType?: string;
	parents?: string[];
	trashed?: boolean;
	createdTime?: string;
	modifiedTime?: string;
	webViewLink?: string;
	size?: string;
	owners?: Array<{ displayName?: string; emailAddress?: string }>;
};

export type DriveFileList = {
	kind?: string;
	nextPageToken?: string;
	incompleteSearch?: boolean;
	files?: DriveFile[];
};

// Google Sheets chart listing (subset)

export type SheetChart = {
	chartId?: number;
	spec?: Record<string, unknown>;
	position?: Record<string, unknown>;
};

export type SpreadsheetSheet = {
	properties?: { sheetId?: number; title?: string; index?: number };
	charts?: SheetChart[];
};

export type SpreadsheetChartsResponse = {
	spreadsheetId?: string;
	sheets?: SpreadsheetSheet[];
};
