/**
 * Response bodies from https://developer.codereadr.com/1.0/api/, kept verbatim
 * apart from whitespace so the parser is exercised against the real shape.
 */

export const SCANS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <count>2</count>
    <scan id="13193">
        <device id="573">iPhone 3</device>
        <service id="927">Lead Retrieval</service>
        <user id="3">demo</user>
        <status>1</status>
        <tid>A1B2C3D</tid>
        <result>Item # 123450. New location on Floor 2.</result>
        <timestamp>2010-08-06 16:42:35</timestamp>
        <answer qid="386" qtext="Primary Interest:">Product A</answer>
        <answer qid="387" qtext="Action Items:">Call</answer>
        <properties>
            <mode>auto</mode>
            <color>blue</color>
        </properties>
    </scan>
    <scan id="13194">
        <device id="579">My android device</device>
        <service id="926">Inventory</service>
        <user id="3">demo</user>
        <status>0</status>
        <tid>ZZZ</tid>
        <result>Information has been saved.</result>
        <timestamp>2010-08-06 16:46:09</timestamp>
    </scan>
</xml>`;

export const SCANS_EMPTY_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <count>0</count>
</xml>`;

export const SERVICES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <service id="120">
        <name>Friday event</name>
        <validationmethod>postback</validationmethod>
        <postback>https://www.postbackurl.com</postback>
        <user id="123"/>
        <user id="124"/>
        <question id="480"/>
    </service>
    <service id="380">
        <name>Boston Marathon</name>
        <validationmethod>database</validationmethod>
        <database>757</database>
        <duplicateScanValue>1</duplicateScanValue>
        <user id="124"/>
        <question id="482"/>
        <question id="484"/>
    </service>
</xml>`;

export const DATABASES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <database id="120">
        <name>My tickets</name>
        <count>5000</count>
        <service id="123"/>
        <service id="124"/>
    </database>
    <database id="125">
        <name>My inventory</name>
        <count>1574</count>
        <service id="323"/>
    </database>
</xml>`;

export const DATABASE_VALUES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <count>2</count>
    <value validity="1">
        <id>A1</id>
        <response>A2</response>
    </value>
    <value validity="0">
        <id>B1</id>
        <response>B2</response>
    </value>
</xml>`;

export const USERS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <user id="73">
        <username>John</username>
        <service id="1234"/>
        <service id="1235"/>
        <limit>10</limit>
        <created>2009-11-30 11:28:20</created>
    </user>
</xml>`;

export const QUESTIONS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <count>1</count>
    <question id="1">
        <text>Would you like soda with your movie?</text>
        <type>option</type>
        <answer id="27">Yes</answer>
        <answer id="28">No</answer>
    </question>
</xml>`;

export const DEVICES_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <device id="73">
        <udid>cb7e743cf62bc79278890a66e4188afc54670753</udid>
        <devicename>John's Device</devicename>
        <created>2009-11-30 11:28:20</created>
    </device>
</xml>`;

export const UPLOADS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <count>2</count>
    <upload id="13193" device_id="123" service_id="456" user_id="7800" status="1" count="5" timestamp="2011-09-06 16:17:29"/>
    <upload id="13194" device_id="123" service_id="885" user_id="7800" status="1" count="3" timestamp="2011-09-06 16:20:10"/>
</xml>`;

export const LIMITS_XML = `<?xml version="1.0" encoding="utf-8"?>
<xml>
    <status>1</status>
    <minute left="18" limit="30"/>
    <day left="9000" limit="21600"/>
</xml>`;

/** Every write answers this, or `<id>` for the record it created. */
export const SUCCESS_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
</xml>`;

export const CREATED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>1</status>
    <id>1001</id>
</xml>`;

/** The error shape: HTTP 200 with `status` 0 and an `<error code>`. */
export function errorXml(code: number, message: string): string {
	// The message goes into element text, so the characters that would end the
	// element or start a new one have to be escaped.
	const escaped = message
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
	return `<?xml version="1.0" encoding="UTF-8"?>
<xml>
    <status>0</status>
    <error code="${code}">${escaped}</error>
</xml>`;
}

export const API_KEY_ERROR_XML = errorXml(101, 'The API key is missing.');
export const AUTH_ERROR_XML = errorXml(100, 'The API key is invalid.');
export const RATE_LIMIT_ERROR_XML = errorXml(
	111,
	'You have exceeded the number of permitted API calls during current minute.',
);
export const DAILY_LIMIT_ERROR_XML = errorXml(
	113,
	'You have exceeded the number of permitted API calls during current day.',
);
export const TRANSIENT_ERROR_XML = errorXml(
	2,
	'Your request could not be processed at this time.',
);
export const INVALID_SECTION_ERROR_XML = errorXml(
	120,
	'Invalid section Parameter',
);
