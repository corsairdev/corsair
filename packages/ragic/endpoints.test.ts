import { logEventFromContext } from 'corsair/core';
import * as Records from './endpoints';
import { RagicAPIError } from './client';
import type {
	RagicRecordSet,
	RecordsCommentResponse,
	RecordsDeleteResponse,
	WriteResponse,
} from './endpoints/types';
import {
	BAD_PARAMS,
	COMMENT_ADDED,
	CREATED,
	DELETED,
	GUEST_106,
	INVALID_FIELD,
	RECORD,
	RECORD_WITH_SUBTABLE,
	RECORDS,
	RECORDS_BY_NAME,
	SCHEMA,
	TASK_PROGRESS,
} from './test-fixtures';
import { invoke, lastRequest, respond } from './test-support';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

const SHEET = { account: 'demo', path: '/sales', sheetIndex: 1 };

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('sheet path', () => {
	it('escapes each folder, so a ? or # cannot change the request', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, { ...SHEET, path: '/sales?x=1#y' });

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/demo/sales%3Fx%3D1%23y/1');
		expect(request.query.x).toBeUndefined();
	});

	it('keeps a nested folder path and adds a missing leading slash', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, { ...SHEET, path: 'crm/sales' });

		expect(lastRequest(fetchMock).path).toBe('/demo/crm/sales/1');
	});

	it('refuses a .. segment before sending anything', async () => {
		await expect(
			invoke(Records.list, { ...SHEET, path: '/../other' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('records.list', () => {
	it('lists records from a sheet', async () => {
		respond(fetchMock, RECORDS);

		const result = (await invoke(Records.list, SHEET)) as RagicRecordSet;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/demo/sales/1');
		expect(request.query.api).toBe('');
		expect(result['12345']?.['1000001']).toBe('Acme Corp');
		expect(result['12345']?._ragicId).toBe(12345);
	});

	it('keeps the row-id keys as strings', async () => {
		respond(fetchMock, RECORDS);

		const result = (await invoke(Records.list, SHEET)) as RagicRecordSet;

		expect(Object.keys(result)).toEqual(['12345', '12346']);
	});

	it('reads field names by default', async () => {
		respond(fetchMock, RECORDS_BY_NAME);

		const result = (await invoke(Records.list, SHEET)) as RagicRecordSet;

		expect(result['1']?.['Account Name']).toBe('Alphabet Inc.');
	});

	it('passes a filter as one where parameter', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			where: [{ fieldId: 2000123, op: 'eq', value: 'Alphabet Inc.' }],
		});

		expect(lastRequest(fetchMock).queryAll('where')).toEqual([
			'2000123,eq,Alphabet Inc.',
		]);
	});

	it('repeats the where parameter for several filters', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			where: [
				{ fieldId: 2000123, op: 'eq', value: 'Alphabet Inc.' },
				{ fieldId: 2000127, op: 'eq', value: 'Jeff Kuo' },
			],
		});

		// Several conditions are a repeated parameter, not one joined string.
		expect(lastRequest(fetchMock).queryAll('where')).toEqual([
			'2000123,eq,Alphabet Inc.',
			'2000127,eq,Jeff Kuo',
		]);
	});

	it('sends a date range as gte and lte on one field', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			where: [
				{ fieldId: 105, op: 'gte', value: '2025/10/01' },
				{ fieldId: 105, op: 'lte', value: '2025/10/31' },
			],
		});

		expect(lastRequest(fetchMock).queryAll('where')).toEqual([
			'105,gte,2025/10/01',
			'105,lte,2025/10/31',
		]);
	});

	it('sends an empty third part to filter an empty field', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			where: [{ fieldId: 2000127, op: 'eq' }],
		});

		expect(lastRequest(fetchMock).queryAll('where')).toEqual(['2000127,eq,']);
	});

	it('passes paging and sorting', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			limit: 8,
			offset: 5,
			order: { fieldId: 800236, direction: 'DESC' },
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			limit: '8',
			offset: '5',
			order: '800236,DESC',
		});
	});

	it('sends subtables=0 as a flag', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, { ...SHEET, subtables: false });

		expect(lastRequest(fetchMock).query.subtables).toBe('0');
	});

	it('repeats fetchDomainIds once per field', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, {
			...SHEET,
			fetchDomainIds: [1000231, 1000243],
		});

		expect(lastRequest(fetchMock).queryAll('fetchDomainIds')).toEqual([
			'1000231',
			'1000243',
		]);
	});

	it('passes the full-text search', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, { ...SHEET, fts: 'Alphabet' });

		expect(lastRequest(fetchMock).query.fts).toBe('Alphabet');
	});

	it('reads a task-progress answer when a taskId is given', async () => {
		respond(fetchMock, TASK_PROGRESS);

		const result = (await invoke(Records.list, {
			...SHEET,
			taskId: '550e8400-e29b-41d4-a716-446655440000',
		})) as { status?: string; progress?: number };

		expect(lastRequest(fetchMock).query.taskId).toBe(
			'550e8400-e29b-41d4-a716-446655440000',
		);
		expect(result.status).toBe('RUNNING');
		expect(result.progress).toBe(45);
	});

	it('rejects a filter operator Ragic does not document', async () => {
		await expect(
			invoke(Records.list, {
				...SHEET,
				where: [{ fieldId: 1, op: 'between', value: 'x' }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a sheet index that is not an integer', async () => {
		await expect(
			invoke(Records.list, { ...SHEET, sheetIndex: 1.5 }),
		).rejects.toThrow();
	});

	it('logs the sheet and the record count, never a field value', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, SHEET);

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ragic.records.list',
			{ sheet: 1, status: 'listed', records: 2 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('Acme Corp');
	});
});

describe('records.get', () => {
	it('reads one record by id', async () => {
		respond(fetchMock, RECORD);

		const result = (await invoke(Records.get, {
			...SHEET,
			recordId: 12345,
		})) as RagicRecordSet;

		expect(lastRequest(fetchMock).path).toBe('/demo/sales/1/12345');
		expect(result['12345']?._ragicId).toBe(12345);
	});

	it('keeps a subtable keyed by row id', async () => {
		respond(fetchMock, RECORD_WITH_SUBTABLE);

		const result = (await invoke(Records.get, {
			...SHEET,
			recordId: 41,
		})) as RagicRecordSet;

		// A subtable is itself a record set nested in the record.
		const subtable = result['41']?._subtable_2000154 as RagicRecordSet;
		expect(subtable['0']?.['Contact Name']).toBe('Jeff Kuo');
		expect(subtable['1']?.['Title']).toBe('Marketing');
	});

	it('passes the extra read flags', async () => {
		respond(fetchMock, RECORD);

		await invoke(Records.get, {
			...SHEET,
			recordId: 1,
			naming: 'EID',
			subtables: false,
			info: true,
			ignoreMask: true,
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			naming: 'EID',
			subtables: '0',
			info: 'true',
			ignoreMask: 'true',
		});
	});

	it('logs the record id', async () => {
		respond(fetchMock, RECORD);

		await invoke(Records.get, { ...SHEET, recordId: 12345 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ragic.records.get',
			{ sheet: 1, recordId: 12345 },
			'completed',
		);
	});
});

describe('records.create', () => {
	it('posts the field values keyed by field id', async () => {
		respond(fetchMock, CREATED);

		const result = (await invoke(Records.create, {
			...SHEET,
			fields: {
				'2000123': 'Dunder Mifflin',
				'2000125': '1-267-922-5599',
				'2000127': 'Jeff Kuo',
			},
		})) as WriteResponse;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/demo/sales/1');
		expect(request.bodyRecord).toMatchObject({
			'2000123': 'Dunder Mifflin',
			'2000127': 'Jeff Kuo',
		});
		// The live answer: the id is ragicId, and the saved record is under data.
		expect(result.ragicId).toBe(12347);
		expect(result.data?.['1000001']).toBe('Dunder Mifflin');
	});

	it('keeps a multi-select as an array', async () => {
		respond(fetchMock, CREATED);

		await invoke(Records.create, {
			...SHEET,
			fields: { '1000001': ['Customer', 'Reseller'] },
		});

		expect(lastRequest(fetchMock).bodyRecord?.['1000001']).toEqual([
			'Customer',
			'Reseller',
		]);
	});

	it('keeps a subtable grouped by negative row id', async () => {
		respond(fetchMock, CREATED);

		await invoke(Records.create, {
			...SHEET,
			fields: {
				'2000123': 'Dunder Mifflin',
				_subtable_2000154: {
					'-1': { '2000147': 'Bill', '2000148': 'Manager' },
					'-2': { '2000147': 'Satya', '2000148': 'VP' },
				},
			},
		});

		const fields = lastRequest(fetchMock).bodyRecord;
		expect(fields?._subtable_2000154).toEqual({
			'-1': { '2000147': 'Bill', '2000148': 'Manager' },
			'-2': { '2000147': 'Satya', '2000148': 'VP' },
		});
	});

	it('sends the write options as query flags', async () => {
		respond(fetchMock, CREATED);

		await invoke(Records.create, {
			...SHEET,
			fields: { '2000123': 'x' },
			doFormula: true,
			doValidation: true,
			notification: false,
			doWorkflow: false,
		});

		expect(lastRequest(fetchMock).query).toMatchObject({
			doFormula: 'true',
			doValidation: 'true',
			notification: 'false',
			doWorkflow: 'false',
		});
	});

	it('sends doLinkLoad=first as a string', async () => {
		respond(fetchMock, CREATED);

		await invoke(Records.create, {
			...SHEET,
			fields: { '1': 'x' },
			doLinkLoad: 'first',
			doFormula: true,
		});

		expect(lastRequest(fetchMock).query.doLinkLoad).toBe('first');
	});

	it('rejects a create with no fields', async () => {
		await expect(invoke(Records.create, SHEET)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('logs the new record id', async () => {
		respond(fetchMock, CREATED);

		await invoke(Records.create, { ...SHEET, fields: { '1': 'x' } });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ragic.records.create',
			{ sheet: 1, recordId: 12347 },
			'completed',
		);
	});
});

describe('records.update', () => {
	it('posts only the changed fields to the record URL', async () => {
		respond(fetchMock, { _ragicId: 3, '1000001': 'Dwight Schrute' });

		await invoke(Records.update, {
			...SHEET,
			recordId: 3,
			fields: { '1000001': 'Dwight Schrute' },
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/demo/sales/1/3');
		expect(request.bodyRecord).toEqual({ '1000001': 'Dwight Schrute' });
	});

	it('passes checkLock', async () => {
		respond(fetchMock, { _ragicId: 3 });

		await invoke(Records.update, {
			...SHEET,
			recordId: 3,
			fields: { '1': 'x' },
			checkLock: true,
		});

		expect(lastRequest(fetchMock).query.checkLock).toBe('true');
	});

	it('edits a subtable row by its positive row id', async () => {
		respond(fetchMock, { _ragicId: 3 });

		await invoke(Records.update, {
			...SHEET,
			recordId: 3,
			fields: {
				_subtable_2000154: { '29': { '2000147': 'Ms. Amy Tsai' } },
			},
		});

		expect(lastRequest(fetchMock).bodyRecord?._subtable_2000154).toEqual({
			'29': { '2000147': 'Ms. Amy Tsai' },
		});
	});

	it('deletes a subtable row with _DELSUB_', async () => {
		respond(fetchMock, { _ragicId: 3 });

		await invoke(Records.update, {
			...SHEET,
			recordId: 3,
			fields: { _DELSUB_2000154: [3] },
		});

		expect(lastRequest(fetchMock).bodyRecord?._DELSUB_2000154).toEqual([3]);
	});

	it('does not mark an update replayable, so a 5xx after a save is not sent again', async () => {
		respond(fetchMock, {
			status: 'ERROR',
			code: 500,
			msg: 'Something Unexpected Happened',
		});

		const error = await invoke(Records.update, {
			...SHEET,
			recordId: 3,
			fields: { _subtable_2000154: { '-1': { '2000147': 'Bill' } } },
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(RagicAPIError);
		expect((error as RagicAPIError).isServerError).toBe(true);
		expect((error as RagicAPIError).replayable).toBe(false);
	});

	it('rejects an update with no record id', async () => {
		await expect(
			invoke(Records.update, { ...SHEET, fields: { '1': 'x' } }),
		).rejects.toThrow();
	});
});

describe('records.delete', () => {
	it('deletes a record by id', async () => {
		respond(fetchMock, DELETED);

		const result = (await invoke(Records.remove, {
			...SHEET,
			recordId: 3,
		})) as RecordsDeleteResponse;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('DELETE');
		expect(request.path).toBe('/demo/sales/1/3');
		expect(result.ragicId).toBe(3);
		expect(result.msg).toContain('recycle bin');
	});
});

describe('records.comment', () => {
	it('posts the comment as c', async () => {
		respond(fetchMock, COMMENT_ADDED);

		const result = (await invoke(Records.comment, {
			...SHEET,
			recordId: 2,
			comment: 'Please review this order.',
		})) as RecordsCommentResponse;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/demo/sales/1/2');
		// The comment flag and a multipart `c` are what make it a comment.
		expect(request.query.comment).toBe('');
		expect(request.formData?.get('c')).toBe('Please review this order.');
		expect(request.headers.get('Content-Type')).toBeNull();
		// Keyed by the comment's row id; 66 is the text, 65 the commenter.
		expect(result['4']?.['66']).toBe('Please review this order.');
		expect(result['4']?.['65']).toBe('John Smith');
	});

	it('rejects an empty comment', async () => {
		await expect(
			invoke(Records.comment, { ...SHEET, recordId: 2, comment: '' }),
		).rejects.toThrow();
	});
});

describe('records.lock and records.unlock', () => {
	it('locks with a bare lock flag on POST', async () => {
		respond(fetchMock, { status: 'SUCCESS', code: 200 });

		await invoke(Records.lock, { ...SHEET, recordId: 102 });

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/demo/sales/1/102');
		expect(request.queryAll('lock')).toEqual(['']);
	});

	it('unlocks with a bare unlock flag', async () => {
		respond(fetchMock, { status: 'SUCCESS', code: 200 });

		await invoke(Records.unlock, { ...SHEET, recordId: 102 });

		expect(lastRequest(fetchMock).queryAll('unlock')).toEqual(['']);
	});

	it('logs which direction the lock went', async () => {
		respond(fetchMock, { status: 'SUCCESS', code: 200 });

		await invoke(Records.unlock, { ...SHEET, recordId: 102 });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ragic.records.unlock',
			{ recordId: 102, locked: false },
			'completed',
		);
	});
});

describe('schema.get', () => {
	it('reads the field schema', async () => {
		respond(fetchMock, SCHEMA);

		const result = (await invoke(Records.schema, SHEET)) as {
			sheet?: { sheetName?: string; keyFieldId?: number };
			fields?: { fieldId?: number; fieldName?: string; type?: string }[];
			subtables?: { subtableKey?: number | string }[];
		};

		expect(lastRequest(fetchMock).path).toBe('/demo/sales/1/metadata/schema');
		expect(result.sheet?.sheetName).toBe('Sales');
		expect(result.fields).toHaveLength(3);
		expect(result.fields?.[1]?.type).toBe('date');
	});

	it('keeps the selection options a caller needs to write a select field', async () => {
		respond(fetchMock, SCHEMA);

		const result = (await invoke(Records.schema, SHEET)) as {
			fields?: { selectionOptionsPreview?: string[] }[];
		};

		expect(result.fields?.[2]?.selectionOptionsPreview).toEqual([
			'Active',
			'Pending',
			'Closed',
		]);
	});

	it('keeps the subtable fields', async () => {
		respond(fetchMock, SCHEMA);

		const result = (await invoke(Records.schema, SHEET)) as {
			subtables?: {
				subtableKey?: number | string;
				fields?: { fieldId?: number }[];
			}[];
		};

		expect(result.subtables?.[0]?.subtableKey).toBe(2000154);
		expect(result.subtables?.[0]?.fields?.[0]?.fieldId).toBe(2000147);
	});

	it('logs the sheet name and the counts', async () => {
		respond(fetchMock, SCHEMA);

		await invoke(Records.schema, SHEET);

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ragic.schema.get',
			{ sheet: 'Sales', fields: 3, subtables: 1 },
			'completed',
		);
	});
});

describe('errors expressed inside a 200', () => {
	it('turns the guest-account refusal into an error', async () => {
		respond(fetchMock, GUEST_106);

		await expect(invoke(Records.list, SHEET)).rejects.toThrow(
			'access right protected',
		);
	});

	it('turns a bad-parameter refusal into an error', async () => {
		respond(fetchMock, BAD_PARAMS);

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Records.list, SHEET).catch(
			(e: unknown) => e,
		)) as { code?: number; isValidationError?: boolean };

		expect(error.code).toBe(201);
		expect(error.isValidationError).toBe(true);
	});

	it('throws a write Ragic refused as INVALID instead of returning it', async () => {
		respond(fetchMock, INVALID_FIELD);

		// unknown: the rejection is narrowed by the assertions below.
		const error = (await invoke(Records.create, {
			...SHEET,
			fields: { '1000001': 'Acme' },
		}).catch((e: unknown) => e)) as {
			code?: number;
			message?: string;
			isValidationError?: boolean;
		};

		expect(error.code).toBe(202);
		expect(error.isValidationError).toBe(true);
		expect(error.message).toBe(
			'Ragic 202: Field Account Owner contains empty value',
		);
	});

	it('never lets a refusal reach the output schema as a record', async () => {
		respond(fetchMock, GUEST_106);

		// The error body has a status of ERROR, which is what isRagicError reads;
		// without that check the record set schema would accept it as one row.
		await expect(
			invoke(Records.get, { ...SHEET, recordId: 1 }),
		).rejects.toThrow();
	});
});

describe('server routing', () => {
	it('sends a call to a configured shard', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, SHEET, 'eu2.ragic.com');

		expect(lastRequest(fetchMock).origin).toBe('https://eu2.ragic.com');
	});

	it('stays on www by default', async () => {
		respond(fetchMock, RECORDS);

		await invoke(Records.list, SHEET);

		expect(lastRequest(fetchMock).origin).toBe('https://www.ragic.com');
	});
});
