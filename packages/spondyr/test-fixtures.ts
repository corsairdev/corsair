/**
 * Envelopes shaped like the ones the live API sends. The error envelopes are
 * copied verbatim from unauthenticated probes, because Spondyr reports a bad
 * key with the same 400 a bad field gets and the text is the only signal.
 */

export const transactionType = {
	Name: 'Customer Orders',
	TemplateJSON: '{"OrderNumber":12345,"Customer":{"FirstName":"John"}}',
	TemplateCSV: 'OrderNumber,Customer.FirstName',
};

export const transactionTypeList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [transactionType],
};

export const eventType = {
	TransactionType: 'Customer Orders',
	Name: 'OrderPlaced',
};

export const eventTypeList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [eventType],
};

export const recipient = {
	TransactionType: 'Customer Orders',
	Name: 'Customer',
	RemoteID: '{Customer.CustomerID}',
	FirstName: '{Customer.FirstName}',
	LastName: '{Customer.LastName}',
	Address1: '',
	Address2: null,
	City: null,
	State: null,
	Zip: null,
	Fax: null,
	Email: '{Customer.Email}',
	MobilePhone: null,
};

export const recipientList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [recipient],
};

export const condition = {
	TransactionType: 'Customer Orders',
	Name: 'Is Express',
	FieldName: 'Shipping',
	PossibleValues: 'Express\r\nOvernight',
};

export const conditionList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [condition],
};

export const searchFilter = {
	TransactionType: 'Customer Orders',
	Name: 'OrderNumber',
	Tag: '{OrderNumber}',
};

export const searchFilterList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [searchFilter],
};

export const template = {
	TransactionType: 'Customer Orders',
	Name: 'Order Confirmation',
	EventType: 'OrderPlaced',
	ContentType: 'PDF',
	TemplateContentReferenceID: '9f2c-template-content',
	TemplateContent: null,
	Recipients: [
		{
			Name: 'Customer',
			DeliveryMethod: 'Email',
			EmailFromAddress: 'orders@acme.com',
			EmailSubject: 'Your order {OrderNumber}',
			EmailBody: 'Thanks {Customer.FirstName}',
			MailFromName: null,
			MailFromAddress1: null,
			MailFromAddress2: null,
			MailFromCity: null,
			MailFromState: null,
			MailFromZip: null,
			TextBody: null,
			DestinationFolder: null,
			Signers: null,
		},
	],
	Conditions: [
		{
			Name: 'Is Express',
			LogicalOperator: 'AND',
			CompareOperator: '=',
			CompareValue: 'Express',
		},
	],
	Searches: ['OrderNumber'],
};

export const templateList = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [template],
};

/** A `send` answer. The reference ID is what every later call needs. */
export const sendAccepted = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: 'c1a2b3-reference',
};

/** A `status` answer while the correspondence is still being generated. */
export const statusSubmitted = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: 'c1a2b3-reference',
	EventType: 'OrderPlaced',
	StatusCode: 'MATCH',
	StatusName: 'Processing - Matching Templates Found',
	CreatedDate: '2026-05-02T13:00:00Z',
	Correspondence: [
		{
			URI: 'https://client.spondyr.io/correspondence/abc',
			Template: 'Order Confirmation',
			ContentType: 'PDF',
			StatusCode: 'GENERATED',
			StatusName: 'Generated',
			CreatedDate: '2026-05-02T13:00:05Z',
			Recipients: [
				{
					Name: 'Customer',
					DeliveryTo: 'john@acme.com',
					DeliveryStatusCode: 'SUCCESS',
					DeliveryStatusName: 'Success',
					IsSuccessful: true,
					Details: null,
					DeliveryDate: '2026-05-02T13:00:09Z',
					CoverPageURI: null,
				},
			],
			SearchFilters: [{ Name: 'OrderNumber', Value: '12345' }],
		},
	],
	Data: null,
};

/** A `status` answer that matched no template. */
export const statusNoMatch = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: 'c1a2b3-reference',
	EventType: 'OrderPlaced',
	StatusCode: 'NOMATCH',
	StatusName: 'Finished - No Matching Templates Found',
	CreatedDate: '2026-05-02T13:00:00Z',
	Correspondence: [],
};

export const batchAccepted = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: 'batch-reference',
};

export const batchStatus = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: 'batch-reference',
	EventType: 'OrderPlaced',
	IsGenerateOnly: false,
	StatusCode: 'FINISH',
	StatusName: 'Finished - Successful',
	CreatedDate: '2026-05-02T13:00:00Z',
	URI: 'https://client.spondyr.io/batches/abc.json',
	BatchSize: 2,
	TotalProcessed: 2,
	BatchErrors: [],
};

export const batchStatusPartial = {
	...batchStatus,
	StatusCode: 'FINISHPART',
	StatusName:
		'Finished - Partially Successful (Errors or Delivery Issues Exist)',
	TotalProcessed: 1,
	BatchErrors: [
		{ ReferenceID: 'item-2', Index: 1, Issue: 'Recipient email is missing' },
	],
};

export const searchResults = {
	APIStatus: 'OK',
	ErrorMessage: null,
	Data: [
		{
			ReferenceID: 'c1a2b3-reference',
			StatusCode: 'FINISH',
			StatusName: 'Finished - Successful',
			CreatedDate: '2026-05-02T13:00:00Z',
			Correspondence: [],
		},
	],
	PageCount: 1,
	RecordCount: 1,
	Page: 1,
	PageSize: 10,
	SortColumn: 'CreatedDate',
	SortOrder: 'DESC',
};

/** A delete: only the envelope, with no payload. */
export const deleted = { APIStatus: 'OK', ErrorMessage: null };

export const templateContentAccepted = {
	APIStatus: 'OK',
	ErrorMessage: null,
	ReferenceID: '9f2c-template-content',
};

// ---------------------------------------------------------------------------
// error envelopes, copied from live responses
// ---------------------------------------------------------------------------

/** A completely missing credential, answered with 400. */
export const noCredentials = {
	Data: [],
	APIStatus: 'ERROR',
	ErrorMessage: 'API Key not specified! Application Token not specified!',
};

/** A wrong credential, answered with 400. */
export const badCredentials = {
	Data: [],
	APIStatus: 'ERROR',
	ErrorMessage: 'API Key is invalid! Application Token is invalid!',
};

/** An unknown ReferenceID, answered with 404 on the status route. */
export const invalidReference = {
	APIStatus: 'ERROR',
	ErrorMessage: 'Reference ID is invalid!',
	ReferenceID: null,
	EventType: null,
	StatusCode: null,
	StatusName: null,
	CreatedDate: null,
	Correspondence: [],
};

/** A 200 whose body still says the request failed. */
export const refusedInEnvelope = {
	APIStatus: 'ERROR',
	ErrorMessage: 'No template matched the event',
};
