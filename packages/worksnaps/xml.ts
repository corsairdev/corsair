/**
 * A small XML reader and writer, sized to what the Worksnaps API sends.
 *
 * The API is XML-only (`application/xml`), and the repo has no XML parser
 * dependency — adding one would put a second hunk in the lockfile. The payloads
 * are Rails-style and uniform (`<projects type="array"><project>…</project>
 * </projects>`), so a focused reader is enough and has no failure mode beyond
 * returning what it found.
 *
 * It handles what these responses contain: elements, attributes, text, CDATA,
 * comments, the five predefined entities, numeric character references, and
 * self-closing tags. It does not handle DTDs, namespaces beyond keeping the
 * prefix in the key, or processing instructions other than skipping them.
 */

export type XmlNode = {
	/** The element name, with any namespace prefix kept as written. */
	name: string;
	attributes: Record<string, string>;
	children: XmlNode[];
	text: string;
};

/** A parsed result: the value of the root element. */
export type XmlValue = string | null | XmlValue[] | { [key: string]: XmlValue };

const ENTITIES: Record<string, string> = {
	amp: '&',
	lt: '<',
	gt: '>',
	quot: '"',
	apos: "'",
};

/** Decodes the five predefined entities and numeric character references. */
export function decodeXmlText(value: string): string {
	// The body may be `#x1F600`, `#X1F600`, `#169` or a named entity.
	return value.replace(
		/&(#x[0-9a-fA-F]+|#X[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g,
		(whole, body: string) => {
			if (body.startsWith('#x') || body.startsWith('#X')) {
				const code = Number.parseInt(body.slice(2), 16);
				return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
			}
			if (body.startsWith('#')) {
				const code = Number.parseInt(body.slice(1), 10);
				return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
			}
			return ENTITIES[body.toLowerCase()] ?? whole;
		},
	);
}

/** Escapes text for an XML body. */
export function escapeXmlText(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

/** Escapes a value for an XML attribute. */
export function escapeXmlAttribute(value: string): string {
	return escapeXmlText(value).replace(/"/g, '&quot;');
}

/**
 * Parses a document and returns its root element, or undefined when the text
 * holds no element at all.
 */
export function parseXml(source: string): XmlNode | undefined {
	// The open-element stack; the root is the bottom of it, kept apart so it
	// survives the walk once its closing tag is seen.
	const stack: XmlNode[] = [];
	let root: XmlNode | undefined;
	let index = 0;

	const current = (): XmlNode | undefined => stack[stack.length - 1];

	while (index < source.length) {
		const open = source.indexOf('<', index);
		if (open === -1) {
			const node = current();
			if (node) node.text += decodeXmlText(source.slice(index));
			break;
		}
		if (open > index) {
			const node = current();
			if (node) node.text += decodeXmlText(source.slice(index, open));
		}

		// A comment.
		if (source.startsWith('<!--', open)) {
			const end = source.indexOf('-->', open + 4);
			index = end === -1 ? source.length : end + 3;
			continue;
		}

		// CDATA: kept verbatim, not entity-decoded.
		if (source.startsWith('<![CDATA[', open)) {
			const end = source.indexOf(']]>', open + 9);
			const text = source.slice(open + 9, end === -1 ? source.length : end);
			const node = current();
			if (node) node.text += text;
			index = end === -1 ? source.length : end + 3;
			continue;
		}

		// A declaration, doctype or processing instruction: skipped.
		if (source.startsWith('<?', open) || source.startsWith('<!', open)) {
			const end = source.indexOf('>', open);
			index = end === -1 ? source.length : end + 1;
			continue;
		}

		// A closing tag.
		if (source.startsWith('</', open)) {
			const end = source.indexOf('>', open);
			index = end === -1 ? source.length : end + 1;
			const node = stack.pop();
			if (node) node.text = node.text.trim();
			continue;
		}

		// An opening or self-closing tag.
		const end = findTagEnd(source, open + 1);
		if (end === -1) break;
		const raw = source.slice(open + 1, end);
		const selfClosing = raw.endsWith('/');
		const body = selfClosing ? raw.slice(0, -1) : raw;
		const nameMatch = /^\s*([^\s/>]+)/.exec(body);
		if (!nameMatch) {
			index = end + 1;
			continue;
		}
		const node: XmlNode = {
			name: nameMatch[1] ?? '',
			attributes: readAttributes(body.slice(nameMatch[0].length)),
			children: [],
			text: '',
		};

		const parent = current();
		if (parent) {
			parent.children.push(node);
		} else if (root === undefined) {
			// The first element is the root, whether or not it closes.
			root = node;
		}

		if (!selfClosing) stack.push(node);
		index = end + 1;
	}

	return root;
}

/**
 * Finds the `>` that closes a tag, respecting quoted attribute values so a `>`
 * inside an attribute does not end it early.
 */
function findTagEnd(source: string, from: number): number {
	let quote: string | undefined;
	for (let index = from; index < source.length; index++) {
		const char = source[index];
		if (quote) {
			if (char === quote) quote = undefined;
			continue;
		}
		if (char === '"' || char === "'") {
			quote = char;
			continue;
		}
		if (char === '>') return index;
	}
	return -1;
}

function readAttributes(source: string): Record<string, string> {
	const attributes: Record<string, string> = {};
	const pattern = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
	for (const match of source.matchAll(pattern)) {
		const key = match[1];
		if (!key) continue;
		attributes[key] = decodeXmlText(match[3] ?? match[4] ?? '');
	}
	return attributes;
}

/**
 * Converts a parsed element to a plain value, which is the shape the endpoints
 * validate:
 *
 * - a leaf becomes its text, or null when empty;
 * - an element whose only children share a name becomes an array of them,
 *   which is how Rails writes a collection;
 * - anything else becomes an object keyed by child name;
 * - a `type="integer"` or `type="float"` attribute coerces a leaf, and
 *   `nil="true"` becomes null.
 */
export function toValue(node: XmlNode): XmlValue {
	const type = node.attributes.type;
	const nil =
		node.attributes.nil === 'true' || node.attributes['xsi:nil'] === 'true';

	if (nil) return null;

	// A typed array with no children is an empty collection, not an empty string.
	// Without this, `<projects type="array"/>` becomes '', and every list operation
	// throws on an account that simply has none of that thing yet.
	if (type === 'array' && node.children.length === 0) return [];

	if (node.children.length === 0) {
		const text = node.text;
		if (text === '') {
			// An empty element is an empty string, except a typed one, which is 0
			// or false rather than blank.
			if (type === 'integer') return String(0);
			if (type === 'float' || type === 'decimal') return String(0);
			if (type === 'boolean') return 'false';
			return '';
		}
		return coerce(text, type);
	}

	const names = new Set(node.children.map((child) => child.name));
	if (names.size === 1) {
		// A collection: every child shares a name, so the values become an array.
		const only = node.children[0]?.name ?? '';
		if (only !== '') {
			return node.children.map(toValue);
		}
	}

	const object: Record<string, XmlValue> = {};
	for (const child of node.children) {
		const value = toValue(child);
		const existing = object[child.name];
		if (existing === undefined) {
			object[child.name] = value;
		} else if (Array.isArray(existing)) {
			existing.push(value);
		} else {
			object[child.name] = [existing, value];
		}
	}
	return object;
}

/**
 * Values stay strings for the output schema to coerce, except where the type
 * attribute makes the intent explicit.
 */
function coerce(text: string, type: string | undefined): string {
	if (type === 'boolean') return text === 'true' ? 'true' : 'false';
	return text;
}

/** Parses an XML document and converts it to a plain value. */
export function parseXmlValue(source: string): XmlValue {
	const root = parseXml(source);
	return root ? toValue(root) : null;
}

/**
 * Parses a document and keeps the root element's name as the single key, which
 * is the shape these responses have: `<projects><project>…</project></projects>`
 * becomes `{ projects: [...] }`. A caller can then read the resource by name
 * rather than wondering which wrapper the API used.
 */
export function parseXmlDocument(
	source: string,
): Record<string, XmlValue> | undefined {
	const root = parseXml(source);
	if (!root) return undefined;
	return { [root.name]: toValue(root) };
}

/**
 * Serializes a record to an XML body, which is what a create or update sends.
 * A null or undefined field is omitted rather than written empty, so an update
 * does not clear a value it did not mean to touch.
 */
export function toXml(
	rootName: string,
	fields: Record<string, string | number | boolean | null | undefined>,
): string {
	const inner = Object.entries(fields)
		.filter(([, value]) => value !== undefined && value !== null)
		.map(([key, value]) => {
			if (typeof value === 'boolean') {
				return `<${key}>${value ? 'true' : 'false'}</${key}>`;
			}
			return `<${key}>${escapeXmlText(String(value))}</${key}>`;
		})
		.join('');
	return `<${rootName}>${inner}</${rootName}>`;
}
