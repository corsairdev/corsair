import {
	decodeXmlText,
	escapeXmlAttribute,
	escapeXmlText,
	parseXml,
	parseXmlValue,
	toValue,
	toXml,
} from './xml';

describe('decodeXmlText', () => {
	it('decodes the five predefined entities', () => {
		expect(decodeXmlText('&amp; &lt; &gt; &quot; &apos;')).toBe('& < > " \'');
	});

	it('decodes a decimal character reference', () => {
		expect(decodeXmlText('&#169;')).toBe('©');
	});

	it('decodes a hex character reference', () => {
		expect(decodeXmlText('&#xA9;')).toBe('©');
		expect(decodeXmlText('&#XA9;')).toBe('©');
	});

	it('leaves an unknown entity as written', () => {
		expect(decodeXmlText('&unknown;')).toBe('&unknown;');
	});

	it('leaves plain text alone', () => {
		expect(decodeXmlText('plain text')).toBe('plain text');
	});
});

describe('escapeXmlText', () => {
	it('escapes the three characters that would break a body', () => {
		expect(escapeXmlText('a & b < c > d')).toBe('a &amp; b &lt; c &gt; d');
	});

	it('escapes quotes only for an attribute', () => {
		expect(escapeXmlAttribute('say "hi"')).toBe('say &quot;hi&quot;');
		expect(escapeXmlText('say "hi"')).toBe('say "hi"');
	});
});

describe('parseXml', () => {
	it('reads a single element with text', () => {
		const root = parseXml('<project><name>Acme</name></project>');
		expect(root?.name).toBe('project');
		expect(root?.children[0]?.name).toBe('name');
		expect(root?.children[0]?.text).toBe('Acme');
	});

	it('reads attributes', () => {
		const root = parseXml('<project id="42" type="integer" />');
		expect(root?.attributes.id).toBe('42');
		expect(root?.attributes.type).toBe('integer');
	});

	it('reads a self-closing tag as an empty element', () => {
		const root = parseXml('<empty />');
		expect(root?.name).toBe('empty');
		expect(root?.children).toHaveLength(0);
	});

	it('skips a declaration and a comment', () => {
		const root = parseXml(
			'<?xml version="1.0" encoding="UTF-8"?><!-- a note --><a>x</a>',
		);
		expect(root?.name).toBe('a');
		expect(root?.text).toBe('x');
	});

	it('keeps CDATA verbatim, without decoding entities', () => {
		const root = parseXml('<a><![CDATA[5 & 6 < 7]]></a>');
		expect(root?.text).toBe('5 & 6 < 7');
	});

	it('does not end a tag at a > inside a quoted attribute', () => {
		const root = parseXml('<a filter="x > y"><b>1</b></a>');
		expect(root?.attributes.filter).toBe('x > y');
		expect(root?.children).toHaveLength(1);
	});

	it('trims surrounding whitespace from text', () => {
		const root = parseXml('<a>\n  spaced  \n</a>');
		expect(root?.text).toBe('spaced');
	});

	it('returns undefined for text with no element', () => {
		expect(parseXml('not xml at all')).toBeUndefined();
		expect(parseXml('')).toBeUndefined();
	});
});

describe('toValue', () => {
	it('turns a leaf into its text', () => {
		const root = parseXml('<name>Acme</name>');
		expect(root && toValue(root)).toBe('Acme');
	});

	it('turns an empty leaf into an empty string', () => {
		const root = parseXml('<description></description>');
		expect(root && toValue(root)).toBe('');
	});

	it('turns an empty typed array into an empty array, not a string', () => {
		// `<projects type="array"/>` is what an account with no projects returns;
		// '' here made every list operation throw.
		const root = parseXml('<projects type="array"/>');
		expect(root && toValue(root)).toEqual([]);
	});

	it('turns a nil attribute into null', () => {
		const root = parseXml('<description nil="true"></description>');
		expect(root && toValue(root)).toBeNull();
	});

	it('turns an xsi:nil attribute into null', () => {
		const root = parseXml('<description xsi:nil="true"></description>');
		expect(root && toValue(root)).toBeNull();
	});

	it('turns a typed empty integer into "0"', () => {
		const root = parseXml('<count type="integer"></count>');
		// The value stays a string for the output schema to coerce.
		expect(root && toValue(root)).toBe('0');
	});

	it('turns siblings sharing a name into an array', () => {
		const root = parseXml(
			'<projects type="array"><project><id>1</id></project><project><id>2</id></project></projects>',
		);
		const value = root && toValue(root);
		expect(Array.isArray(value)).toBe(true);
		expect((value as unknown[]).length).toBe(2);
	});

	it('turns mixed children into an object keyed by name', () => {
		const root = parseXml('<project><id>1</id><name>Acme</name></project>');
		const value = root && toValue(root);
		expect(value).toEqual({ id: '1', name: 'Acme' });
	});

	it('keeps a repeated child inside an object as an array', () => {
		const root = parseXml(
			'<project><tag>a</tag><name>Acme</name><tag>b</tag></project>',
		);
		const value = root && toValue(root);
		expect(value).toEqual({ tag: ['a', 'b'], name: 'Acme' });
	});
});

describe('parseXmlValue', () => {
	it('parses a document into a plain value', () => {
		const value = parseXmlValue(
			'<project><id type="integer">42</id><name>Acme</name></project>',
		);
		expect(value).toEqual({ id: '42', name: 'Acme' });
	});

	it('returns null for text with no element', () => {
		expect(parseXmlValue('')).toBeNull();
	});

	it('parses the Rails array shape the API uses', () => {
		const xml =
			'<?xml version="1.0" encoding="UTF-8"?>\n' +
			'<projects type="array">\n' +
			'  <project>\n' +
			'    <id type="integer">3456</id>\n' +
			'    <name>Acme</name>\n' +
			'    <description></description>\n' +
			'  </project>\n' +
			'</projects>\n';
		const value = parseXmlValue(xml);
		expect(value).toEqual([{ id: '3456', name: 'Acme', description: '' }]);
	});
});

describe('toXml', () => {
	it('writes a record as an XML body', () => {
		expect(toXml('project', { name: 'Acme' })).toBe(
			'<project><name>Acme</name></project>',
		);
	});

	it('omits an undefined field rather than writing it empty', () => {
		// An update that omitted a field must not clear it.
		expect(toXml('project', { name: 'Acme', description: undefined })).toBe(
			'<project><name>Acme</name></project>',
		);
	});

	it('omits a null field', () => {
		expect(toXml('project', { name: 'Acme', description: null })).toBe(
			'<project><name>Acme</name></project>',
		);
	});

	it('writes a boolean as true or false', () => {
		expect(toXml('x', { flag: true, other: false })).toBe(
			'<x><flag>true</flag><other>false</other></x>',
		);
	});

	it('writes a number as its digits', () => {
		expect(toXml('time_entry', { duration_in_minutes: 90 })).toBe(
			'<time_entry><duration_in_minutes>90</duration_in_minutes></time_entry>',
		);
	});

	it('escapes text so a value cannot break the body', () => {
		expect(toXml('project', { name: 'A & B <c>' })).toBe(
			'<project><name>A &amp; B &lt;c&gt;</name></project>',
		);
	});

	it('writes an empty body for no fields', () => {
		expect(toXml('project', {})).toBe('<project></project>');
	});
});
