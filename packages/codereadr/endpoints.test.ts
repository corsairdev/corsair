import type { XmlRecord } from './client';
import { parseCodereadrXml } from './client';
import { flag, idList } from './endpoints/call';
import {
	readCount,
	readCreatedId,
	shapeDatabases,
	shapeDatabaseValues,
	shapeDevices,
	shapeLimits,
	shapeQuestions,
	shapeScans,
	shapeServices,
	shapeUploads,
	shapeUsers,
} from './endpoints/shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './endpoints/types';
import {
	CREATED_XML,
	DATABASE_VALUES_XML,
	DATABASES_XML,
	DEVICES_XML,
	LIMITS_XML,
	QUESTIONS_XML,
	SCANS_EMPTY_XML,
	SCANS_XML,
	SERVICES_XML,
	SUCCESS_XML,
	UPLOADS_XML,
	USERS_XML,
} from './test-fixtures';

/** Parses a fixture and hands the root record to a shape function, as `call` does. */
function shaped(fixture: string): XmlRecord {
	const root = parseCodereadrXml(fixture);
	if (!root) throw new Error('fixture did not parse');
	return root;
}

describe('request building', () => {
	it('joins an ID list into the comma-separated form', () => {
		expect(idList([1005, 1010, 1254])).toBe('1005,1010,1254');
	});

	it('passes the all keyword through', () => {
		expect(idList('all')).toBe('all');
	});

	it('leaves an absent list undefined so the variable is omitted', () => {
		expect(idList(undefined)).toBeUndefined();
	});

	it('turns booleans into the 1 and 0 the API expects', () => {
		expect(flag(true)).toBe(1);
		expect(flag(false)).toBe(0);
		expect(flag(undefined)).toBeUndefined();
	});
});

describe('scans.list', () => {
	it('parses scans with their device, service, user and answers', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_XML)));

		expect(output.scans).toHaveLength(2);
		const scan = output.scans[0];
		expect(scan?.id).toBe(13193);
		expect(scan?.barcode_value).toBe('A1B2C3D');
		expect(scan?.response).toContain('Floor 2');
		expect(scan?.status).toBe('1');
		expect(scan?.device).toEqual({ id: 573, name: 'iPhone 3' });
		expect(scan?.service).toEqual({ id: 927, name: 'Lead Retrieval' });
		expect(scan?.user).toEqual({ id: 3, name: 'demo' });
	});

	it('reads answers with their question IDs and text', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_XML)));

		expect(output.scans[0]?.answers).toEqual([
			{
				question_id: 386,
				question_text: 'Primary Interest:',
				answer: 'Product A',
			},
			{ question_id: 387, question_text: 'Action Items:', answer: 'Call' },
		]);
	});

	it('reads scan properties as a string map', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_XML)));

		expect(output.scans[0]?.properties).toEqual({
			mode: 'auto',
			color: 'blue',
		});
	});

	it('leaves properties absent when the scan has none', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_XML)));

		expect(output.scans[1]?.properties).toBeUndefined();
	});

	it('keeps an invalid scan status distinct from a valid one', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_XML)));

		expect(output.scans[1]?.status).toBe('0');
	});

	it('parses an empty result set without inventing scans', () => {
		const output = Outputs.scansList.parse(shapeScans(shaped(SCANS_EMPTY_XML)));

		expect(output.scans).toEqual([]);
		expect(output.count).toBe(0);
	});

	it('rejects a body whose scan node is not a list of objects', () => {
		expect(() =>
			Outputs.scansList.parse(
				shapeScans(shaped('<xml><status>1</status><scan>oops</scan></xml>')),
			),
		).toThrow(/instead of fields/);
	});

	it('rejects a wrong-shaped list on the other list actions too', () => {
		// Each shaper guards its own element, so a proxy page or a changed
		// response cannot pass as a list of blank rows.
		expect(() =>
			Outputs.servicesList.parse(
				shapeServices(
					shaped('<xml><status>1</status><service>x</service></xml>'),
				),
			),
		).toThrow(/instead of fields/);
		expect(() =>
			Outputs.databasesList.parse(
				shapeDatabases(
					shaped('<xml><status>1</status><database>x</database></xml>'),
				),
			),
		).toThrow(/instead of fields/);
		expect(() =>
			Outputs.usersList.parse(
				shapeUsers(shaped('<xml><status>1</status><user>x</user></xml>')),
			),
		).toThrow(/instead of fields/);
	});

	it('rejects a known field of the wrong type', () => {
		expect(() =>
			Outputs.scansList.parse({
				scans: [{ id: 'not-a-number', barcode_value: 'X' }],
			}),
		).toThrow();
	});
});

describe('services', () => {
	it('lists services with their validation method and links', () => {
		const output = Outputs.servicesList.parse(
			shapeServices(shaped(SERVICES_XML)),
		);

		expect(output.services).toHaveLength(2);
		expect(output.services[0]?.validation_method).toBe('postback');
		expect(output.services[0]?.postback_url).toBe(
			'https://www.postbackurl.com',
		);
		expect(output.services[0]?.user_ids).toEqual([123, 124]);
		expect(output.services[0]?.question_ids).toEqual([480]);
	});

	it('reads the linked database and duplicate setting', () => {
		const output = Outputs.servicesList.parse(
			shapeServices(shaped(SERVICES_XML)),
		);

		expect(output.services[1]?.validation_method).toBe('database');
		expect(output.services[1]?.database_id).toBe(757);
		expect(output.services[1]?.duplicate_scan_value).toBe(1);
	});

	it('keeps a validation method the API does not define yet readable', () => {
		const output = Outputs.servicesList.parse({
			services: [{ id: 1, validation_method: 'telepathy' }],
		});
		expect(output.services[0]?.validation_method).toBe('telepathy');
	});

	it('still rejects an unknown validation method on create', () => {
		expect(() =>
			Inputs.servicesCreate.parse({ validation_method: 'telepathy' }),
		).toThrow();
	});

	it('reads the ID of a created service', () => {
		const output = Outputs.servicesCreate.parse({
			success: true,
			service_id: readCreatedId(shaped(CREATED_XML)),
		});
		expect(output.service_id).toBe(1001);
	});

	it('reports success for a delete with no created ID', () => {
		const output = Outputs.servicesDelete.parse({ success: true });
		expect(output.success).toBe(true);
	});

	it('requires a validation method on create', () => {
		expect(() => Inputs.servicesCreate.parse({ service_name: 'x' })).toThrow();
	});

	it('requires a database for a database validation method', () => {
		expect(() =>
			Inputs.servicesCreate.parse({ validation_method: 'database' }),
		).toThrow(/database_id/);
		expect(() =>
			Inputs.servicesCreate.parse({ validation_method: 'ondevicedatabase' }),
		).toThrow(/database_id/);
	});

	it('requires a postback URL for a postback service', () => {
		expect(() =>
			Inputs.servicesCreate.parse({ validation_method: 'postback' }),
		).toThrow(/postback_url/);
	});

	it('accepts a database service with its database', () => {
		expect(() =>
			Inputs.servicesCreate.parse({
				validation_method: 'database',
				database_id: 757,
			}),
		).not.toThrow();
	});
});

describe('databases', () => {
	it('lists databases with their value counts and services', () => {
		const output = Outputs.databasesList.parse(
			shapeDatabases(shaped(DATABASES_XML)),
		);

		expect(output.databases).toHaveLength(2);
		expect(output.databases[0]?.name).toBe('My tickets');
		expect(output.databases[0]?.count).toBe(5000);
		expect(output.databases[0]?.service_ids).toEqual([123, 124]);
	});

	it('lists stored values with their validity', () => {
		const output = Outputs.databasesShowValues.parse(
			shapeDatabaseValues(shaped(DATABASE_VALUES_XML)),
		);

		expect(output.values).toEqual([
			{ value: 'A1', response: 'A2', validity: 1 },
			{ value: 'B1', response: 'B2', validity: 0 },
		]);
	});

	it('rejects a values node that is not a list', () => {
		expect(() => Outputs.databasesShowValues.parse({ values: 'A1' })).toThrow();
	});

	it('rejects a numeric value where the barcode string belongs', () => {
		expect(() =>
			Outputs.databasesShowValues.parse({ values: [{ value: 42 }] }),
		).toThrow();
	});

	it('caps a bulk upsert at 100 values, as the API documents', () => {
		const values = Array.from({ length: 101 }, (_, index) => ({
			value: `v${index}`,
		}));
		expect(() =>
			Inputs.databasesUpsertValues.parse({ database_id: 120, values }),
		).toThrow();
	});

	it('accepts exactly 100 values', () => {
		const values = Array.from({ length: 100 }, (_, index) => ({
			value: `v${index}`,
		}));
		expect(() =>
			Inputs.databasesUpsertValues.parse({ database_id: 120, values }),
		).not.toThrow();
	});

	it('rejects a bulk upsert value with no database to write to', () => {
		// CodeREADr skips such a value and still answers success, so the write
		// would look complete while dropping part of the batch.
		expect(() =>
			Inputs.databasesUpsertValues.parse({ values: [{ value: 'A1' }] }),
		).toThrow(/database_id/);
	});

	it('accepts a per-value database when the request has none', () => {
		expect(() =>
			Inputs.databasesUpsertValues.parse({
				values: [{ value: 'A1', database_id: 121 }],
			}),
		).not.toThrow();
	});

	it('requires at least one value', () => {
		expect(() => Inputs.databasesUpsertValues.parse({ values: [] })).toThrow();
	});
});

describe('users', () => {
	it('lists users with their services and device limit', () => {
		const output = Outputs.usersList.parse(shapeUsers(shaped(USERS_XML)));

		expect(output.users[0]?.username).toBe('John');
		expect(output.users[0]?.service_ids).toEqual([1234, 1235]);
		expect(output.users[0]?.device_limit).toBe(10);
	});

	it('leaves the device limit absent when the user has none', () => {
		const output = Outputs.usersList.parse(
			shapeUsers(
				shaped(
					'<xml><status>1</status><user id="9"><username>Ann</username></user></xml>',
				),
			),
		);

		expect(output.users[0]?.device_limit).toBeUndefined();
	});

	it('rejects a device limit below the documented minimum', () => {
		expect(() =>
			Inputs.usersCreate.parse({
				username: 'a',
				password: 'b',
				device_limit: -2,
			}),
		).toThrow();
	});

	it('accepts -1, which blocks sign-in', () => {
		expect(() =>
			Inputs.usersCreate.parse({
				username: 'a',
				password: 'b',
				device_limit: -1,
			}),
		).not.toThrow();
	});

	it('requires a password for a username that is not an email', () => {
		expect(() => Inputs.usersCreate.parse({ username: 'scanner' })).toThrow(
			/password/,
		);
	});

	it('allows an email username without a password, which sends an invitation', () => {
		expect(() =>
			Inputs.usersCreate.parse({ username: 'scanner@example.com' }),
		).not.toThrow();
	});
});

describe('questions', () => {
	it('lists questions with their type and answer options', () => {
		const output = Outputs.questionsList.parse(
			shapeQuestions(shaped(QUESTIONS_XML)),
		);

		expect(output.questions[0]?.text).toContain('soda');
		expect(output.questions[0]?.type).toBe('option');
		expect(output.questions[0]?.answers).toEqual([
			{ id: 27, name: 'Yes' },
			{ id: 28, name: 'No' },
		]);
	});

	it('keeps an unknown question type readable', () => {
		const output = Outputs.questionsList.parse(
			shapeQuestions(
				shaped(
					'<xml><status>1</status><question id="5"><type>signature</type></question></xml>',
				),
			),
		);

		expect(output.questions[0]?.type).toBe('signature');
	});

	it('rejects a question type outside the documented set', () => {
		expect(() =>
			Inputs.questionsCreate.parse({
				question_text: 'x',
				question_type: 'nope',
			}),
		).toThrow();
	});
});

describe('devices', () => {
	it('lists devices with their UDID', () => {
		const output = Outputs.devicesList.parse(shapeDevices(shaped(DEVICES_XML)));

		expect(output.devices[0]?.name).toBe("John's Device");
		expect(output.devices[0]?.udid).toBe(
			'cb7e743cf62bc79278890a66e4188afc54670753',
		);
	});

	it('requires a name to rename a device', () => {
		expect(() => Inputs.devicesUpdate.parse({ device_id: 3 })).toThrow();
	});
});

describe('uploads', () => {
	it('reads uploads whose fields are all attributes', () => {
		const output = Outputs.uploadsList.parse(shapeUploads(shaped(UPLOADS_XML)));

		expect(output.uploads).toHaveLength(2);
		expect(output.uploads[0]?.service_id).toBe(456);
		expect(output.uploads[0]?.count).toBe(5);
		expect(output.uploads[0]?.timestamp).toBe('2011-09-06 16:17:29');
	});
});

describe('limits', () => {
	it('reads the remaining and total requests for each window', () => {
		const output = Outputs.limitsRetrieve.parse(
			shapeLimits(shaped(LIMITS_XML)),
		);

		expect(output.minute).toEqual({ left: 18, limit: 30 });
		expect(output.day).toEqual({ left: 9000, limit: 21600 });
	});

	it('reads -1 as the unlimited marker', () => {
		const output = Outputs.limitsRetrieve.parse(
			shapeLimits(
				shaped('<xml><status>1</status><day left="0" limit="-1"/></xml>'),
			),
		);

		expect(output.day?.limit).toBe(-1);
	});
});

describe('shared parsing', () => {
	it('reads the count node when a list has one', () => {
		expect(readCount(shaped(SCANS_XML))).toBe(2);
	});

	it('leaves the count undefined when the action sends none', () => {
		expect(readCount(shaped(SUCCESS_XML))).toBeUndefined();
	});

	it('reads the created ID from a create response', () => {
		expect(readCreatedId(shaped(CREATED_XML))).toBe(1001);
	});

	it('leaves the created ID undefined for a bare success', () => {
		expect(readCreatedId(shaped(SUCCESS_XML))).toBeUndefined();
	});
});
