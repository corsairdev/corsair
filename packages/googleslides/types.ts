// Google Slides API v1 resource types (subset used by this plugin).
// https://developers.google.com/slides/api/reference/rest
//
// Field names mirror the discovery document exactly (camelCase from JSON).
// Optional means the provider omits the field rather than sending null: probing
// shows absent keys for unset values, not JSON nulls.

/**
 * A provider payload this plugin forwards without reading it. The Slides
 * schemas describe 155 response types, so a passthrough field (shape fills,
 * outlines, shadows, chart specs) keeps its JSON rather than re-declaring it.
 *
 * unknown: the JSON a provider sent for a field whose inner shape this plugin
 * does not interpret; callers that need it read the documented sub-fields.
 */
export type ProviderJson = Record<string, unknown>;

export type Dimension = {
	magnitude?: number;
	unit?: 'EMU' | 'PT';
};

export type Size = {
	width?: Dimension;
	height?: Dimension;
};

export type AffineTransform = {
	scaleX?: number;
	scaleY?: number;
	shearX?: number;
	shearY?: number;
	translateX?: number;
	translateY?: number;
	unit?: 'UNIT_UNSPECIFIED' | 'EMU' | 'PT';
};

export type RgbColor = {
	red?: number;
	green?: number;
	blue?: number;
};

export type OpaqueColor = {
	rgbColor?: RgbColor;
	themeColor?: string;
};

export type OptionalColor = {
	opaqueColor?: OpaqueColor;
};

export type TextRun = {
	content?: string;
	style?: TextStyle;
};

export type ParagraphMarker = {
	style?: {
		alignment?: string;
		direction?: string;
		indentStart?: Dimension;
		indentEnd?: Dimension;
		spaceAbove?: Dimension;
		spaceBelow?: Dimension;
		lineSpacing?: number;
	};
	bullet?: {
		listId?: string;
		nestingLevel?: number;
	};
};

export type TextElement = {
	startIndex?: number;
	endIndex?: number;
	textRun?: TextRun;
	paragraphMarker?: ParagraphMarker;
	autoText?: { type?: string; content?: string };
};

export type TextStyle = {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
	smallCaps?: boolean;
	fontFamily?: string;
	fontSize?: Dimension;
	foregroundColor?: OptionalColor;
	backgroundColor?: OptionalColor;
	baselineOffset?:
		| 'BASELINE_OFFSET_UNSPECIFIED'
		| 'NONE'
		| 'SUPERSCRIPT'
		| 'SUBSCRIPT';
	link?: { url?: string; pageObjectId?: string; relativeLink?: string };
	weightedFontFamily?: { fontFamily?: string; weight?: number };
};

export type TextContent = {
	textElements?: TextElement[];
	lists?: ProviderJson;
};

export type Shape = {
	shapeType?: string;
	shapeProperties?: {
		shapeBackgroundFill?: ProviderJson;
		outline?: ProviderJson;
		shadow?: ProviderJson;
		link?: { url?: string };
		contentAlignment?: string;
		autofit?: ProviderJson;
	};
	text?: TextContent;
	placeholder?: Placeholder;
};

export type Placeholder = {
	type?: string;
	index?: number;
	parentObjectId?: string;
};

export type TableCell = {
	location?: { rowIndex?: number; columnIndex?: number };
	rowSpan?: number;
	columnSpan?: number;
	text?: TextContent;
};

export type TableRow = {
	rowHeight?: Dimension;
	tableCells?: TableCell[];
};

export type Table = {
	rows?: number;
	columns?: number;
	tableRows?: TableRow[];
	tableColumns?: { width?: Dimension; columnWidth?: Dimension }[];
};

export type PageElement = {
	objectId?: string;
	size?: Size;
	transform?: AffineTransform;
	title?: string;
	description?: string;
	shape?: Shape;
	image?: { contentUrl?: string; imageProperties?: ProviderJson };
	video?: ProviderJson;
	line?: ProviderJson;
	table?: Table;
	sheetsChart?: ProviderJson;
	wordArt?: ProviderJson;
	elementGroup?: { children?: PageElement[] };
	speakerSpotlight?: ProviderJson;
};

export type Page = {
	objectId?: string;
	pageType?: 'SLIDE' | 'MASTER' | 'LAYOUT' | 'NOTES' | 'NOTES_MASTER';
	pageElements?: PageElement[];
	pageProperties?: {
		pageBackgroundFill?: ProviderJson;
		colorScheme?: ProviderJson;
	};
	slideProperties?: {
		layoutObjectId?: string;
		masterObjectId?: string;
		isSkipped?: boolean;
		notesPage?: Page;
	};
	notesProperties?: {
		speakerNotesObjectId?: string;
	};
	layoutProperties?: {
		masterObjectId?: string;
		displayName?: string;
		name?: string;
	};
	masterProperties?: {
		displayName?: string;
	};
	revisionId?: string;
};

export type Presentation = {
	presentationId?: string;
	title?: string;
	locale?: string;
	revisionId?: string;
	pageSize?: Size;
	slides?: Page[];
	masters?: Page[];
	layouts?: Page[];
	notesMaster?: Page;
};

export type WriteControl = {
	requiredRevisionId?: string;
};

export type BatchUpdateReply = {
	createShape?: { objectId?: string };
	createSlide?: { objectId?: string };
	createTable?: { objectId?: string };
	createImage?: { objectId?: string };
	createVideo?: { objectId?: string };
	createLine?: { objectId?: string };
	createSheetsChart?: { objectId?: string };
	duplicateObject?: { objectId?: string };
	replaceAllText?: { occurrencesChanged?: number };
	replaceAllShapesWithImage?: { occurrencesChanged?: number };
	replaceAllShapesWithSheetsChart?: { occurrencesChanged?: number };
	groupObjects?: { objectId?: string };
	insertComment?: ProviderJson;
	addCommentReply?: ProviderJson;
};

export type BatchUpdateResponse = {
	presentationId?: string;
	replies?: BatchUpdateReply[];
	writeControl?: WriteControl;
	commentUpdateState?: string;
};

export type Thumbnail = {
	contentUrl?: string;
	width?: number;
	height?: number;
};

export type DriveFile = {
	id?: string;
	name?: string;
	mimeType?: string;
	createdTime?: string;
	modifiedTime?: string;
	webViewLink?: string;
	parents?: string[];
	trashed?: boolean;
	owners?: { displayName?: string; emailAddress?: string }[];
	size?: string;
};

export type DriveFileList = {
	nextPageToken?: string;
	incompleteSearch?: boolean;
	files?: DriveFile[];
};
