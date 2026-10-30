export type WorkbookTarget = {
	driveId?: string;
	itemId?: string;
	itemPath?: string;
};

// Graph addresses a workbook by drive item id or by a colon-escaped path.
// Exactly one of itemId or itemPath is required; the schema enforces that
// before this runs. The throw is the leftover for a caller that skipped parse.
export function workbookBase(input: WorkbookTarget): string {
	if (input.itemId !== undefined && input.itemPath === undefined) {
		const item = encodeURIComponent(input.itemId);
		if (input.driveId !== undefined) {
			return `/drives/${encodeURIComponent(input.driveId)}/items/${item}/workbook`;
		}
		return `/me/drive/items/${item}/workbook`;
	}
	if (input.itemPath !== undefined && input.itemId === undefined) {
		const encoded = input.itemPath
			.split('/')
			.map((segment) => encodeURIComponent(segment))
			.join('/');
		if (input.driveId !== undefined) {
			return `/drives/${encodeURIComponent(input.driveId)}/root:/${encoded}:/workbook`;
		}
		return `/me/drive/root:/${encoded}:/workbook`;
	}
	throw new Error('Provide exactly one of itemId or itemPath');
}

export function driveContentUrl(input: {
	driveId?: string;
	path: string;
}): string {
	const encoded = input.path
		.split('/')
		.map((segment) => encodeURIComponent(segment))
		.join('/');
	if (input.driveId !== undefined) {
		return `/drives/${encodeURIComponent(input.driveId)}/root:/${encoded}:/content`;
	}
	return `/me/drive/root:/${encoded}:/content`;
}

export function sessionHeaders(
	sessionId: string | undefined,
): Record<string, string> | undefined {
	if (sessionId === undefined) {
		return undefined;
	}
	return { 'workbook-session-id': sessionId };
}

// OData function arguments keep ':' and '!' so A1:B2 stays a range address.
// encodeURI leaves '#' intact, and a '#' in the path starts a URL fragment.
export function odataQuoted(value: string): string {
	return encodeURI(value.replaceAll("'", "''")).replaceAll('#', '%23');
}
