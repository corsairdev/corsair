// Documented examples from
// https://docs.snowflake.com/en/developer-guide/sql-api/reference
// and https://docs.snowflake.com/en/developer-guide/sql-api/submitting-requests
export const STATEMENT_HANDLE = '019c06a4-0000-df4f-0000-00100006589e';
export const REQUEST_ID = 'ea7b46ed-bdc1-8c32-d593-764fcad64e83';

export const runningStatus = {
	code: '333334',
	message:
		'Asynchronous execution in progress. Use provided query id to perform query monitoring and management.',
	statementHandle: STATEMENT_HANDLE,
	statementStatusUrl: `/api/v2/statements/${STATEMENT_HANDLE}`,
};

export const resultSet = {
	resultSetMetaData: {
		numRows: 1,
		format: 'jsonv2',
		rowType: [
			{
				name: 'COLUMN1',
				database: '',
				schema: '',
				table: '',
				scale: 0,
				precision: 1,
				length: null,
				type: 'fixed',
				nullable: false,
				byteLength: null,
				collation: null,
			},
		],
		partitionInfo: [{ rowCount: 1, uncompressedSize: 16 }],
	},
	data: [['1']],
	code: '090001',
	statementStatusUrl: `/api/v2/statements/${STATEMENT_HANDLE}?requestId=${REQUEST_ID}&partition=0`,
	sqlState: '00000',
	statementHandle: STATEMENT_HANDLE,
	message: 'Statement executed successfully.',
	createdOn: 1620151584132,
	vendorField: 'keep-me',
};

export const cancelStatus = {
	code: '000604',
	sqlState: '57014',
	message: 'SQL execution canceled',
	statementHandle: STATEMENT_HANDLE,
	statementStatusUrl: `/api/v2/statements/${STATEMENT_HANDLE}`,
};

export const statementMissing = {
	code: '000709',
	message: `Statement ${STATEMENT_HANDLE} not found`,
	sqlState: '02000',
	statementHandle: STATEMENT_HANDLE,
};
