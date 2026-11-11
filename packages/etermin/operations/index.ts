import type { ETerminOperation } from '../endpoints/operation-types';

/** The 70 non-deprecated operations in eTermin OpenAPI 3.0.0. */
export const anchorTimesList = {
	key: 'anchorTimesList',
	group: 'anchorTimes',
	action: 'list',
	method: 'GET',
	path: '/api/anchortime',
	riskLevel: 'read',
	description:
		'Use this function if you want to get all information about weekly anchortimes.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar. Use this parameter if you want to get existing anchortimes for a specific calendar.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const anchorTimesCreate = {
	key: 'anchorTimesCreate',
	group: 'anchorTimes',
	action: 'create',
	method: 'POST',
	path: '/api/anchortime',
	riskLevel: 'write',
	description: 'Use this function to create a new weekly anchortime.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'starttime',
			type: 'string',
			required: true,
			description: 'Time of the anchor, e.g. 17:00.',
		},
		{
			name: 'weekday',
			type: 'string',
			required: true,
			description: 'ID of the weekday 1 = Sunday, 7 = Saturday.',
		},
		{
			name: 'ignoreonceappbooked',
			type: 'boolean',
			required: true,
			description:
				'If true the anchortime will be ignored once an appointment is booked this day.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const anchorTimesUpdate = {
	key: 'anchorTimesUpdate',
	group: 'anchorTimes',
	action: 'update',
	method: 'PUT',
	path: '/api/anchortime',
	riskLevel: 'write',
	description: 'Use this function to update a weekly anchortime.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the anchortime.',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'starttime',
			type: 'string',
			required: false,
			description: 'Time of the anchor, e.g. 17:00.',
		},
		{
			name: 'weekday',
			type: 'number',
			required: false,
			description: 'ID of the weekday 1 = Sunday, 7 = Saturday.',
		},
		{
			name: 'ignoreonceappbooked',
			type: 'boolean',
			required: false,
			description:
				'If true the anchortime will be ignored once an appointment is booked this day.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const anchorTimesDelete = {
	key: 'anchorTimesDelete',
	group: 'anchorTimes',
	action: 'delete',
	method: 'DELETE',
	path: '/api/anchortime',
	riskLevel: 'destructive',
	description: 'Use this function to delete a weekly anchortime.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the anchortime.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const anchorTimeDatesList = {
	key: 'anchorTimeDatesList',
	group: 'anchorTimeDates',
	action: 'list',
	method: 'GET',
	path: '/api/anchortimedate',
	riskLevel: 'read',
	description:
		'Use this function if you want to get all information about anchortimes by date.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar. Use this parameter if you want to get existing anchortimes for a specific calendar.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const anchorTimeDatesCreate = {
	key: 'anchorTimeDatesCreate',
	group: 'anchorTimeDates',
	action: 'create',
	method: 'POST',
	path: '/api/anchortimedate',
	riskLevel: 'write',
	description:
		'Use this function to create a new anchortime for a specific date.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'startdate',
			type: 'string',
			required: true,
			description:
				'Date and time of the anchortime. Format is yyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'ignoreonceappbooked',
			type: 'boolean',
			required: true,
			description:
				'If true the anchortime will be ignored once an appointment is booked this day.',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description: 'Reason why this anchortime is created.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const anchorTimeDatesUpdate = {
	key: 'anchorTimeDatesUpdate',
	group: 'anchorTimeDates',
	action: 'update',
	method: 'PUT',
	path: '/api/anchortimedate',
	riskLevel: 'write',
	description: 'Use this function to update an anchortime by date.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the anchortime.',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'startdate',
			type: 'string',
			required: true,
			description:
				'Date and time of the anchortime. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'ignoreonceappbooked',
			type: 'boolean',
			required: true,
			description:
				'If true the anchortime will be ignored once an appointment is booked this day',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description: 'Reason why this anchortime is created',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const anchorTimeDatesDelete = {
	key: 'anchorTimeDatesDelete',
	group: 'anchorTimeDates',
	action: 'delete',
	method: 'DELETE',
	path: '/api/anchortimedate',
	riskLevel: 'destructive',
	description: 'Use this function to delete an anchortime by date.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the anchortime by date.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const appointmentsList = {
	key: 'appointmentsList',
	group: 'appointments',
	action: 'list',
	method: 'GET',
	path: '/api/appointment',
	riskLevel: 'read',
	description:
		'Use this function if you want to get all appointment details that are stored on the eTermin platform. You can use the start/end parameters the get all appointments within a specific time span or the id parameter to get the appointment details of a specific appointment. <br><b>At least one parameter is mandatory!</b>',
	params: [
		{
			name: 'appid',
			type: 'number',
			required: false,
			description: 'ID of an appointment. (relates to the ID)',
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			description: 'ID of an appointment. (relates to the ExternalID)',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description:
				'Start date of the appointments. Format yyyy-mm-dd. It will return a list with all appointments that are between "start" and "end".',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description:
				'End date of the appointments. Format yyyy-mm-dd. It will return a list with all appointments that are between "start" and "end".',
		},
		{
			name: 'bycreationdate',
			type: 'boolean',
			required: false,
			description:
				'Changes the start and end parameters to look for the creation date instead of the date, the appointment takes place',
		},
		{
			name: 'calendarid',
			type: 'string',
			required: false,
			description:
				'IDs of the calendars that you want to get appointments from, you can separate multiple calendars with a ","',
		},
		{
			name: 'wl',
			type: 'boolean',
			required: false,
			description:
				'Set to 1 if you want to get all appointments on the Waiting List (start and end parameters required)',
		},
		{
			name: 'pbl',
			type: 'boolean',
			required: false,
			description:
				'Set to 1 if you want to get all appointments on the Reservation List (start and end parameters not required)',
		},
		{
			name: 'cid',
			type: 'number',
			required: false,
			description:
				'Use a customer ID to see all appointments that are related to this customer. (start and end parameters not required)',
		},
		{
			name: 'email',
			type: 'string',
			required: false,
			description:
				'Use an email address to see all appointments that are related to this email. (start and end parameters required)',
		},
		{
			name: 'limited',
			type: 'boolean',
			required: false,
			description:
				'Reduces the amount of information that the response have. Set to 1 if you want basic information about a lot of appointments.',
		},
		{
			name: 'manualconfirmed',
			type: 'boolean',
			required: false,
			description:
				'If set to 0 shows all appointments in the specified timeframe (start and end) that are not confirmed yet',
		},
		{
			name: 'noholidays',
			type: 'boolean',
			required: false,
			description:
				'Only shows appointments that are no holidays and not blocked appointments.',
		},
		{
			name: 'noholidays2',
			type: 'boolean',
			required: false,
			description:
				'Only shows appointments that are no holidays. (bookingtype <> "Holiday")',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const appointmentsCreate = {
	key: 'appointmentsCreate',
	group: 'appointments',
	action: 'create',
	method: 'POST',
	path: '/api/appointment',
	riskLevel: 'write',
	description:
		'Use this function to create a new appointment in the eTermin calendar',
	params: [
		{
			name: 'start',
			type: 'string',
			required: true,
			description:
				'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description:
				'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description:
				"ID of the calendar. Use the 'Calendar - Get calendar details' function to get a list with all available calendars",
		},
		{
			name: 'calendarname',
			type: 'string',
			required: false,
			description: 'Name of the calendar (needed for Webpush)',
		},
		{
			name: 'services',
			type: 'string',
			required: false,
			description:
				"ID of the service. Use the 'Service - Get service details' function to get a list with all available services. To use multiple services use a comma (,) to seperate the IDs",
		},
		{
			name: 'servicestext',
			type: 'string',
			required: false,
			description: 'Name of the services',
		},
		{
			name: 'servicesinclsgtext',
			type: 'string',
			required: false,
			description: 'Name of the services including the service groups',
		},
		{
			name: 'servicesabb',
			type: 'string',
			required: false,
			description: 'Abbreviation of the services',
		},
		{
			name: 'capacity',
			type: 'number',
			required: false,
			description: 'Defines the capacity of the appointment',
		},
		{
			name: 'capused',
			type: 'boolean',
			required: false,
			description:
				'true if the capacity of the appointment needs to be checked',
		},
		{
			name: 'capmaxused',
			type: 'number',
			required: false,
			description: "Maximum capacity that can't be exceeded",
		},
		{
			name: 'location',
			type: 'string',
			required: false,
			description: 'Location of the appointment',
		},
		{
			name: 'bookingtype',
			type: 'string',
			required: false,
			description: 'Information about how the appointment is booked',
		},
		{
			name: 'bookingurl',
			type: 'string',
			required: false,
			description: 'Information from which URL the appointment got booked',
		},
		{
			name: 'checkexist',
			type: 'boolean',
			required: false,
			description:
				'Checks if the appointment start/end time is available (1 = yes, 0 = no). May not work with multiple capacity',
		},
		{
			name: 'manualconfirmed',
			type: 'number',
			required: false,
			description:
				'Set to 0 to have the appointment manually confirmed by the appoinment provider',
		},
		{
			name: 'confirmappointment',
			type: 'number',
			required: false,
			description:
				"Set to 1 to have the appointment manually confirmed by the booker, won't work if manualconfirmed is set to 0",
		},
		{
			name: 'confirmtime',
			type: 'number',
			required: false,
			description:
				'Time in minutes that the booker is able to confirm the appointment before it gets deleted',
		},
		{
			name: 'language',
			type: 'string',
			required: false,
			description:
				'Languagecode, defines in which language the emails are sent',
		},
		{
			name: 'sendemail',
			type: 'boolean',
			required: false,
			description:
				'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no)',
		},
		{
			name: 'sms',
			type: 'boolean',
			required: false,
			description:
				'Send a confirmation sms to the phone number that was specified in the phone field (1 = yes, 0 = no).',
		},
		{
			name: 'notificationmsg',
			type: 'boolean',
			required: false,
			description:
				'Send an information email to the appointment provider (1 = yes, 0 = no).',
		},
		{
			name: 'sync',
			type: 'boolean',
			required: false,
			description:
				'True if the appointment should be synchronized with external calendars (1 = yes, 0 = no).',
		},
		{
			name: 'calselid',
			type: 'number',
			required: false,
			description:
				'Use this parameter with the value -1 to also use the Calendar Linking function (also requires a valid value for the parameter services)',
		},
		{
			name: 'appointmentreminderhours',
			type: 'number',
			required: false,
			description:
				'Defines when the first reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'appointmentreminderhours2',
			type: 'number',
			required: false,
			description:
				'Defines when the second reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'canceldeadline',
			type: 'number',
			required: false,
			description:
				'Minutes how long before the startdate the appointment can be cancelled',
		},
		{
			name: 'recurrencerule',
			type: 'string',
			required: false,
			description:
				'Recurrence rule. e.g. DTSTART:{20171126T083000Z} DTEND:{20171126T090000Z} RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;',
		},
		{
			name: 'recurrenceparentid',
			type: 'string',
			required: false,
			description: 'ID of the parent recurring appointment',
		},
		{
			name: 'pricegross',
			type: 'number',
			required: false,
			description: 'Price including vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'pricenet',
			type: 'number',
			required: false,
			description: 'Price excluding vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'vat',
			type: 'number',
			required: false,
			description: 'Vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'salutation',
			type: 'string',
			required: false,
			description: 'Salutation of the person',
		},
		{
			name: 'title',
			type: 'string',
			required: false,
			description: 'Title of the person',
		},
		{
			name: 'lastname',
			type: 'string',
			required: false,
			description: 'Lastname of the person',
		},
		{
			name: 'firstname',
			type: 'string',
			required: false,
			description: 'Firstname of the person',
		},
		{
			name: 'email',
			type: 'string',
			required: false,
			description: 'E-Mail of the person',
		},
		{
			name: 'phone',
			type: 'string',
			required: false,
			description: 'Phone of the person',
		},
		{
			name: 'company',
			type: 'string',
			required: false,
			description:
				'Company of the person (make sure this field exists in your account)',
		},
		{
			name: 'notes',
			type: 'string',
			required: false,
			description: 'Appointment notes',
		},
		{
			name: 'street',
			type: 'string',
			required: false,
			description: 'Street of the person that booked appointment',
		},
		{
			name: 'zip',
			type: 'string',
			required: false,
			description: 'Zip of the person that booked appointment',
		},
		{
			name: 'city',
			type: 'string',
			required: false,
			description: 'City of the person that booked appointment',
		},
		{
			name: 'customernumber',
			type: 'string',
			required: false,
			description: 'ID of the person that booked appointment',
		},
		{
			name: 'birthday',
			type: 'string',
			required: false,
			description: 'Date of birth of the person that booked appointment',
		},
		{
			name: 'additional1',
			type: 'string',
			required: false,
			description: 'Additional appointment field 1',
		},
		{
			name: 'additional2',
			type: 'string',
			required: false,
			description: 'Additional appointment field 2',
		},
		{
			name: 'additional3',
			type: 'string',
			required: false,
			description: 'Additional appointment field 3',
		},
		{
			name: 'additional4',
			type: 'string',
			required: false,
			description: 'Additional appointment field 4',
		},
		{
			name: 'additional5',
			type: 'string',
			required: false,
			description: 'Additional appointment field 5',
		},
		{
			name: 'additional6',
			type: 'string',
			required: false,
			description: 'Additional appointment field 6',
		},
		{
			name: 'additional7',
			type: 'string',
			required: false,
			description: 'Additional appointment field 7',
		},
		{
			name: 'additional8',
			type: 'string',
			required: false,
			description: 'Additional appointment field 8',
		},
		{
			name: 'additional9',
			type: 'string',
			required: false,
			description: 'Additional appointment field 9',
		},
		{
			name: 'additional10',
			type: 'string',
			required: false,
			description: 'Additional appointment field 10',
		},
		{
			name: 'additional11',
			type: 'string',
			required: false,
			description: 'Additional appointment field 11',
		},
		{
			name: 'additional12',
			type: 'string',
			required: false,
			description: 'Additional appointment field 12',
		},
		{
			name: 'additional13',
			type: 'string',
			required: false,
			description: 'Additional appointment field 13',
		},
		{
			name: 'additional14',
			type: 'string',
			required: false,
			description: 'Additional appointment field 14',
		},
		{
			name: 'additional15',
			type: 'string',
			required: false,
			description: 'Additional appointment field 15',
		},
		{
			name: 'additional16',
			type: 'string',
			required: false,
			description: 'Additional appointment field 16',
		},
		{
			name: 'additional17',
			type: 'string',
			required: false,
			description: 'Additional appointment field 17',
		},
		{
			name: 'additional18',
			type: 'string',
			required: false,
			description: 'Additional appointment field 18',
		},
		{
			name: 'additional19',
			type: 'string',
			required: false,
			description: 'Additional appointment field 19',
		},
		{
			name: 'additional20',
			type: 'string',
			required: false,
			description: 'Additional appointment field 20',
		},
		{
			name: 'agbaccepted',
			type: 'boolean',
			required: false,
			description: 'true if customer accepted the terms of service',
		},
		{
			name: 'dataprivacyaccepted',
			type: 'boolean',
			required: false,
			description: 'true if customer accepted the privacy terms',
		},
		{
			name: 'feedbackpermissionaccepted',
			type: 'boolean',
			required: false,
			description: 'true if the customer should get a feedback mail',
		},
		{
			name: 'newsletter',
			type: 'boolean',
			required: false,
			description: 'true if the customer accepted to get newsletters',
		},
		{
			name: 'bookerinfo',
			type: 'string',
			required: false,
			description:
				'Parameter that includes information for the notification message to the appointment provider',
		},
		{
			name: 'emailm',
			type: 'number',
			required: false,
			description: 'Checks if there is an email, if set to 1',
		},
		{
			name: 'lnm',
			type: 'number',
			required: false,
			description: 'Checks if there is a lastname, if set to 1',
		},
		{
			name: 'blacklist',
			type: 'number',
			required: false,
			description: 'Checks if the email is on the blacklist, if set to 1',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const appointmentsUpdate = {
	key: 'appointmentsUpdate',
	group: 'appointments',
	action: 'update',
	method: 'PUT',
	path: '/api/appointment',
	riskLevel: 'write',
	description:
		'Use this function if you want to update details of an existing appointment.',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'External ID of the appointment that you want to modify.',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description:
				'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description:
				'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description: 'ID of the calendar.',
		},
		{
			name: 'calendarname',
			type: 'string',
			required: false,
			description: 'Name of the calendar (needed for Webpush)',
		},
		{
			name: 'services',
			type: 'string',
			required: false,
			description:
				"ID of the service. Use the 'Service - Get service details' function to get a list with all available services. To use multiple services use a comma (,) to seperate the IDs",
		},
		{
			name: 'servicestext',
			type: 'string',
			required: false,
			description: 'Name of the services',
		},
		{
			name: 'servicesinclsgtext',
			type: 'string',
			required: false,
			description: 'Name of the services including the service groups',
		},
		{
			name: 'servicesabb',
			type: 'string',
			required: false,
			description: 'Abbreviation of the services',
		},
		{
			name: 'capacity',
			type: 'number',
			required: false,
			description: 'Defines the capacity of the appointment',
		},
		{
			name: 'location',
			type: 'string',
			required: false,
			description: 'Location of the appointment',
		},
		{
			name: 'manualconfirmed',
			type: 'number',
			required: false,
			description:
				'Set to 0 to have the appointment manually confirmed by the appoinment provider, set to 1 if the appointment got confirmed',
		},
		{
			name: 'sendemail',
			type: 'boolean',
			required: false,
			description:
				'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no).',
		},
		{
			name: 'msgtype',
			type: 'number',
			required: false,
			description:
				'ID of the template that is sent to the customer with the API call',
		},
		{
			name: 'sendsms',
			type: 'boolean',
			required: false,
			description:
				'Send a confirmation SMS to the phone number that was specified in the phone parameter (1 = yes, 0 = no).',
		},
		{
			name: 'msgtypesms',
			type: 'number',
			required: false,
			description:
				'ID of the template that is sent to the customer via SMS with the API call (required to send a SMS)',
		},
		{
			name: 'notificationmsg',
			type: 'boolean',
			required: false,
			description:
				'Send an information email to the appointment provider (1 = yes, 0 = no).',
		},
		{
			name: 'sync',
			type: 'boolean',
			required: false,
			description:
				'True if the appointment should be synchronized with external calendars (1 = yes, 0 = no).',
		},
		{
			name: 'appointmentreminderhours',
			type: 'number',
			required: false,
			description:
				'Defines when the first reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'appointmentreminderhours2',
			type: 'number',
			required: false,
			description:
				'Defines when the second reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'canceldeadline',
			type: 'number',
			required: false,
			description:
				'Minutes how long before the startdate the appointment can be cancelled',
		},
		{
			name: 'recurrencerule',
			type: 'string',
			required: false,
			description:
				'Recurrence rule. e.g. DTSTART:20171126T083000Z DTEND:20181126T090000Z RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;',
		},
		{
			name: 'pricegross',
			type: 'number',
			required: false,
			description: 'Price including vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'pricenet',
			type: 'number',
			required: false,
			description: 'Price excluding vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'vat',
			type: 'number',
			required: false,
			description: 'Vat multiplied by 100 (e.g. 18.50€ = 1850)',
		},
		{
			name: 'linkedappidmanual',
			type: 'number',
			required: false,
			description:
				'AppID of the linked app if the calendar linking should be applied after two appointments are booked. Keep in mind to update the second appointment aswell',
		},
		{
			name: 'salutation',
			type: 'string',
			required: false,
			description: 'Salutation of the person.',
		},
		{
			name: 'title',
			type: 'string',
			required: false,
			description: 'Title of the person.',
		},
		{
			name: 'lastname',
			type: 'string',
			required: false,
			description: 'Lastname of the person.',
		},
		{
			name: 'firstname',
			type: 'string',
			required: false,
			description: 'Firstname of the person.',
		},
		{
			name: 'email',
			type: 'string',
			required: false,
			description: 'E-Mail of the person.',
		},
		{
			name: 'phone',
			type: 'string',
			required: false,
			description: 'Phone of the person.',
		},
		{
			name: 'company',
			type: 'string',
			required: false,
			description:
				'Company of the person (make sure this field exists in your account)',
		},
		{
			name: 'notes',
			type: 'string',
			required: false,
			description: 'Appointment notes.',
		},
		{ name: 'street', type: 'string', required: false, description: 'Street.' },
		{ name: 'zip', type: 'string', required: false, description: 'Zip.' },
		{ name: 'city', type: 'string', required: false, description: 'City.' },
		{
			name: 'customernumber',
			type: 'string',
			required: false,
			description: 'ID of the person that booked appointment.',
		},
		{
			name: 'additional1',
			type: 'string',
			required: false,
			description: 'Additional appointment field 1.',
		},
		{
			name: 'additional2',
			type: 'string',
			required: false,
			description: 'Additional appointment field 2.',
		},
		{
			name: 'additional3',
			type: 'string',
			required: false,
			description: 'Additional appointment field 3.',
		},
		{
			name: 'additional4',
			type: 'string',
			required: false,
			description: 'Additional appointment field 4.',
		},
		{
			name: 'additional5',
			type: 'string',
			required: false,
			description: 'Additional appointment field 5.',
		},
		{
			name: 'additional6',
			type: 'string',
			required: false,
			description: 'Additional appointment field 6.',
		},
		{
			name: 'additional7',
			type: 'string',
			required: false,
			description: 'Additional appointment field 7.',
		},
		{
			name: 'additional8',
			type: 'string',
			required: false,
			description: 'Additional appointment field 8.',
		},
		{
			name: 'additional9',
			type: 'string',
			required: false,
			description: 'Additional appointment field 9.',
		},
		{
			name: 'additional10',
			type: 'string',
			required: false,
			description: 'Additional appointment field 10.',
		},
		{
			name: 'additional11',
			type: 'string',
			required: false,
			description: 'Additional appointment field 11.',
		},
		{
			name: 'additional12',
			type: 'string',
			required: false,
			description: 'Additional appointment field 12.',
		},
		{
			name: 'additional13',
			type: 'string',
			required: false,
			description: 'Additional appointment field 13.',
		},
		{
			name: 'additional14',
			type: 'string',
			required: false,
			description: 'Additional appointment field 14.',
		},
		{
			name: 'additional15',
			type: 'string',
			required: false,
			description: 'Additional appointment field 15.',
		},
		{
			name: 'additional16',
			type: 'string',
			required: false,
			description: 'Additional appointment field 16.',
		},
		{
			name: 'additional17',
			type: 'string',
			required: false,
			description: 'Additional appointment field 17.',
		},
		{
			name: 'additional18',
			type: 'string',
			required: false,
			description: 'Additional appointment field 18.',
		},
		{
			name: 'additional19',
			type: 'string',
			required: false,
			description: 'Additional appointment field 19.',
		},
		{
			name: 'additional20',
			type: 'string',
			required: false,
			description: 'Additional appointment field 20.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const appointmentsDelete = {
	key: 'appointmentsDelete',
	group: 'appointments',
	action: 'delete',
	method: 'DELETE',
	path: '/api/appointment',
	riskLevel: 'destructive',
	description:
		'Use this function to delete an appointment in the eTermin calendar. You can either use the id of a specific appointment or the start/end parameters to delete all appointments within a specific time span.',
	params: [
		{
			name: 'appid',
			type: 'number',
			required: false,
			description: 'AppID of the appointment (relates to the ID)',
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			description:
				'ID of the appointment, <b>use externalid instead, if you use the parameter sync=1 or sendemail=1</b> (relates to the ExternalID)',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description: 'Start date of the appointments.',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description: 'End date of the appointments.',
		},
		{
			name: 'sync',
			type: 'boolean',
			required: false,
			description:
				'True if the appointment should be synchronized with external calendars (use externalid instead of id Parameter)',
		},
		{
			name: 'sendemail',
			type: 'boolean',
			required: false,
			description:
				'True if an email should be sent to the customer (use externalid instead of id Parameter)',
		},
		{
			name: 'msgtype',
			type: 'number',
			required: false,
			description: 'Defines which template should be sent',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const deletedAppointmentsList = {
	key: 'deletedAppointmentsList',
	group: 'deletedAppointments',
	action: 'list',
	method: 'GET',
	path: '/api/appointmentdeleted',
	riskLevel: 'read',
	description:
		'Returns all appointments that got deleted during the specified time span.',
	params: [
		{
			name: 'start',
			type: 'string',
			required: false,
			description:
				'Start day when appointment(s) got deleted. Format: yyyy-mm-dd. It will return a list with all appointments that are between start and end',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description:
				'End day when appointment(s) got deleted. Format: yyyy-mm-dd. It will return a list with all appointments there are between start and end',
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			description:
				'External ID of an appointment, it returns only the information of the specific appointment. Start and end parameters are getting ignored if used',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const appointmentSyncList = {
	key: 'appointmentSyncList',
	group: 'appointmentSync',
	action: 'list',
	method: 'GET',
	path: '/api/appointmentsync',
	riskLevel: 'read',
	description:
		"Gets all inserted (I), modified (U) and deleted (D) appointments that were modified on the eTermin platform. The parameter 'SyncStatus' contains the status of the appointment (U, I, D). You can call this function e.g. every 5 minutes to get all appointments that were added, modified or deleted within the last 5 minutes on the eTermin platform. Important: If the SyncStatus returns 'U' and the appointment does not exist in your application, please insert this appointment in your application. There can be cases that the 'SyncStatus' returns 'U' although the appointment does not yet exist in your application.",
	params: [
		{
			name: 'synctoken',
			type: 'number',
			required: true,
			description:
				'SyncToken. If you start the synchronization the first time, please use 1. eTermin will return a (new) SyncToken after each call. This value can be found in the header. Please use then the new SnycToken when you call the api function again.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const appointmentSyncCreate = {
	key: 'appointmentSyncCreate',
	group: 'appointmentSync',
	action: 'create',
	method: 'POST',
	path: '/api/appointmentsync',
	riskLevel: 'write',
	description: 'Create a new appointment',
	params: [
		{
			name: 'appointmentid',
			type: 'string',
			required: true,
			description: 'ID of the appointment',
		},
		{
			name: 'start',
			type: 'string',
			required: true,
			description:
				'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description:
				'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'startutc',
			type: 'string',
			required: true,
			description:
				'Start date and time(utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'endutc',
			type: 'string',
			required: true,
			description:
				'End date and time (utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'summary',
			type: 'string',
			required: true,
			description: 'Title (subject) of the appointment',
		},
		{
			name: 'description',
			type: 'string',
			required: true,
			description: 'Body text of the appointment',
		},
		{ name: 'email', type: 'string', required: false, description: 'E-Mail' },
		{
			name: 'recurrencerule',
			type: 'string',
			required: false,
			description: 'Recurrence rule',
		},
		{
			name: 'recurrenceparentid',
			type: 'string',
			required: false,
			description: 'ID of the parent recurring appointment',
		},
		{
			name: 'sequence',
			type: 'string',
			required: false,
			description:
				'Sequence of the recurring appointment. Leave it empty if it is not an recurring appointment',
		},
		{
			name: 'location',
			type: 'string',
			required: false,
			description: 'Location',
		},
		{
			name: 'sendemail',
			type: 'boolean',
			required: false,
			description:
				'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no)',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const appointmentSyncUpdate = {
	key: 'appointmentSyncUpdate',
	group: 'appointmentSync',
	action: 'update',
	method: 'PUT',
	path: '/api/appointmentsync',
	riskLevel: 'write',
	description: 'Update an existing appointment',
	params: [
		{
			name: 'appointmentid',
			type: 'string',
			required: true,
			description: 'ID of the appointment',
		},
		{
			name: 'start',
			type: 'string',
			required: true,
			description:
				'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description:
				'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'startutc',
			type: 'string',
			required: true,
			description:
				'Start date and time(utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'endutc',
			type: 'string',
			required: true,
			description:
				'End date and time (utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'summary',
			type: 'string',
			required: true,
			description: 'Title (subject) of the appointment',
		},
		{
			name: 'description',
			type: 'string',
			required: true,
			description: 'Body text of the appointment',
		},
		{ name: 'email', type: 'string', required: false, description: 'E-Mail' },
		{
			name: 'recurrencerule',
			type: 'string',
			required: false,
			description: 'Recurrence rule',
		},
		{
			name: 'recurrenceparentid',
			type: 'string',
			required: false,
			description: 'ID if the parent recurring appointment',
		},
		{
			name: 'sequence',
			type: 'string',
			required: false,
			description:
				'Sequence of the recurring appointment. Leave it empty if it is not an recurring appointment',
		},
		{
			name: 'location',
			type: 'string',
			required: false,
			description: 'Location',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const appointmentSyncDelete = {
	key: 'appointmentSyncDelete',
	group: 'appointmentSync',
	action: 'delete',
	method: 'DELETE',
	path: '/api/appointmentsync',
	riskLevel: 'destructive',
	description:
		'Use this function to delete an appointment in the eTermin calendar. You can either use the id of a specific appointment or the start/end parameters to delete all appointments within a specific time span.',
	params: [
		{
			name: 'appointmentid',
			type: 'string',
			required: false,
			description: 'ID of the appointment',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description: 'Start date of the appointments.',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description: 'End date of the appointments.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const bookingPageLogsList = {
	key: 'bookingPageLogsList',
	group: 'bookingPageLogs',
	action: 'list',
	method: 'GET',
	path: '/api/bookingpagelogs',
	riskLevel: 'read',
	description:
		'Use this function if you want to get all requests of your booking page. You can only get the booking page requests of the last 30 days.',
	params: [
		{
			name: 'datefrom',
			type: 'string',
			required: true,
			description: 'Start date of the requests. Format: yyyy-mm-dd.',
		},
		{
			name: 'summaryonly',
			type: 'boolean',
			required: false,
			description:
				'Set to 1 to only get a summary of all requests, not every single request.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const calendarsList = {
	key: 'calendarsList',
	group: 'calendars',
	action: 'list',
	method: 'GET',
	path: '/api/calendar',
	riskLevel: 'read',
	description:
		'Returns all calendars that are available for the specific account.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar, if you only need to get the details of a single calendar',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const calendarsCreate = {
	key: 'calendarsCreate',
	group: 'calendars',
	action: 'create',
	method: 'POST',
	path: '/api/calendar',
	riskLevel: 'write',
	description: 'Use this function to create a new calendar',
	params: [],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarsUpdate = {
	key: 'calendarsUpdate',
	group: 'calendars',
	action: 'update',
	method: 'PUT',
	path: '/api/calendar',
	riskLevel: 'write',
	description:
		'Use this function if you want to update details of an existing calendar/employee/ressource.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'calendarname',
			type: 'string',
			required: false,
			description: 'Name of the calendar. This name is used for all languages',
		},
		{
			name: 'descriptionlanguagecode',
			type: 'string',
			required: false,
			description:
				'e.g. descriptionde adds additional information for this calendar in German language. descriptionen in English etc.',
		},
		{
			name: 'descriptiondisplaytype',
			type: 'number',
			required: false,
			description:
				'defines if the description is shown on the bookingpage <br> 0 = not shown<br> 1 = shown under calendar name<br> 2 = shown as tooltip',
		},
		{
			name: 'enablecapacity',
			type: 'boolean',
			required: false,
			description: 'Several appointments can be booked at the same time',
		},
		{
			name: 'maxcapacity',
			type: 'number',
			required: false,
			description:
				'Maximum capacity of appointments that can be booked at the same time',
		},
		{
			name: 'differentlocation',
			type: 'boolean',
			required: false,
			description:
				'The location of the calendar is different than the main location',
		},
		{
			name: 'name',
			type: 'string',
			required: false,
			description: 'Name of the different company name',
		},
		{ name: 'street', type: 'string', required: false, description: 'Street' },
		{ name: 'zip', type: 'string', required: false, description: 'ZIP' },
		{ name: 'city', type: 'string', required: false, description: 'City' },
		{
			name: 'country',
			type: 'string',
			required: false,
			description: 'Country',
		},
		{
			name: 'telephone',
			type: 'string',
			required: false,
			description: 'Telephone',
		},
		{
			name: 'mobilephone',
			type: 'string',
			required: false,
			description: 'MobilePhone',
		},
		{
			name: 'emaillocation',
			type: 'string',
			required: false,
			description: 'Email',
		},
		{
			name: 'web',
			type: 'string',
			required: false,
			description: 'Internet address',
		},
		{
			name: 'completeappointmentwithinopeninghours',
			type: 'boolean',
			required: false,
			description:
				'If you have configured services where free, idle or down times between appointments occur, you can define whether these should be within the defined available times.',
		},
		{
			name: 'smsnotification',
			type: 'boolean',
			required: false,
			description:
				'Employee will be informed by SMS if an appointment was booked',
		},
		{
			name: 'smsphonenumber',
			type: 'string',
			required: false,
			description: 'Number of the phone',
		},
		{
			name: 'smstimespanhours',
			type: 'number',
			required: false,
			description: 'Threshold (in hours) if SMS should be sent',
		},
		{
			name: 'calendartype',
			type: 'boolean',
			required: false,
			description: 'Main calendar (0) or sub calendar (1)',
		},
		{
			name: 'limittoduration',
			type: 'number',
			required: false,
			description:
				'Calendar can only handle appointments that have a certain length (defined in maxduration)',
		},
		{
			name: 'maxduration',
			type: 'number',
			required: false,
			description: 'Maximum appointment duration (minutes)',
		},
		{
			name: 'waitingnr',
			type: 'boolean',
			required: false,
			description: 'Calculate waiting number',
		},
		{
			name: 'wnprefix',
			type: 'string',
			required: false,
			description: 'Prefix of the waiting number',
		},
		{
			name: 'wnstartnr',
			type: 'number',
			required: false,
			description: 'Start number of the waiting number',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarsDelete = {
	key: 'calendarsDelete',
	group: 'calendars',
	action: 'delete',
	method: 'DELETE',
	path: '/api/calendar',
	riskLevel: 'destructive',
	description: 'Use this function if you want to delete a calendar',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'ID of the calendar',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarReturnTimesList = {
	key: 'calendarReturnTimesList',
	group: 'calendarReturnTimes',
	action: 'list',
	method: 'GET',
	path: '/api/calendarreturntime',
	riskLevel: 'read',
	description:
		'Use this function if you want to get information about return times for a calendar.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const calendarReturnTimesCreate = {
	key: 'calendarReturnTimesCreate',
	group: 'calendarReturnTimes',
	action: 'create',
	method: 'POST',
	path: '/api/calendarreturntime',
	riskLevel: 'write',
	description: 'Use this function to create a new return time.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'starttime',
			type: 'string',
			required: true,
			description: 'Start time of the return time. Format: HH:MM e.g. 18:00',
		},
		{
			name: 'endtime',
			type: 'string',
			required: true,
			description: 'End time of the return time. Format: HH:MM e.g. 18:00',
		},
		{
			name: 'weekdayidx',
			type: 'number',
			required: true,
			description: 'ID of the weekday 1=Sunday, 7 = Saturday.',
		},
		{
			name: 'newday',
			type: 'boolean',
			required: true,
			description:
				'If true the return time will end on the next day. Use this if you have a return time over midnight.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarReturnTimesUpdate = {
	key: 'calendarReturnTimesUpdate',
	group: 'calendarReturnTimes',
	action: 'update',
	method: 'PUT',
	path: '/api/calendarreturntime',
	riskLevel: 'write',
	description: 'Use this function to update a return time.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the return time.',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'starttime',
			type: 'string',
			required: false,
			description: 'Start time of the return time. Format: HH:MM e.g. 18:00',
		},
		{
			name: 'endtime',
			type: 'string',
			required: false,
			description: 'End time of the return time. Format: HH:MM e.g. 18:00',
		},
		{
			name: 'weekdayidx',
			type: 'number',
			required: false,
			description: 'ID of the weekday 1=Sunday, 7 = Saturday.',
		},
		{
			name: 'newday',
			type: 'boolean',
			required: false,
			description:
				'If true the return time will end on the next day. Use this if you have a return time over midnight.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarReturnTimesDelete = {
	key: 'calendarReturnTimesDelete',
	group: 'calendarReturnTimes',
	action: 'delete',
	method: 'DELETE',
	path: '/api/calendarreturntime',
	riskLevel: 'destructive',
	description: 'Use this function to delete a return time by its ID.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the return time.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarServicesList = {
	key: 'calendarServicesList',
	group: 'calendarServices',
	action: 'list',
	method: 'GET',
	path: '/api/calendarservice',
	riskLevel: 'read',
	description: 'Returns all assigned services of a calendar',
	params: [
		{
			name: 'calendarid',
			type: 'string',
			required: false,
			description: 'ID of the calendar you want the service assignments',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const calendarServicesCreate = {
	key: 'calendarServicesCreate',
	group: 'calendarServices',
	action: 'create',
	method: 'POST',
	path: '/api/calendarservice',
	riskLevel: 'write',
	description: 'Creates a new service assignment of a calendar',
	params: [
		{
			name: 'calendarid',
			type: 'string',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'serviceid',
			type: 'string',
			required: true,
			description: 'ID of the service',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarServicesDelete = {
	key: 'calendarServicesDelete',
	group: 'calendarServices',
	action: 'delete',
	method: 'DELETE',
	path: '/api/calendarservice',
	riskLevel: 'destructive',
	description:
		'Use this function if you want to delete a calendar/service assignment',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'ID of the calendar service assignment',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarNonWorkingTimesList = {
	key: 'calendarNonWorkingTimesList',
	group: 'calendarNonWorkingTimes',
	action: 'list',
	method: 'GET',
	path: '/api/calendarsnonworkingtimes',
	riskLevel: 'read',
	description:
		'Use this function if you want to get information about absences for a calendar.',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const calendarNonWorkingTimesCreate = {
	key: 'calendarNonWorkingTimesCreate',
	group: 'calendarNonWorkingTimes',
	action: 'create',
	method: 'POST',
	path: '/api/calendarsnonworkingtimes',
	riskLevel: 'write',
	description: 'Use this function to create a new absence.',
	params: [
		{
			name: 'appcalendarid',
			type: 'number',
			required: true,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'startdate',
			type: 'string',
			required: true,
			description:
				'Start time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'enddate',
			type: 'string',
			required: true,
			description:
				'End time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description: 'Reason or note for the absence.',
		},
		{
			name: 'nwtype',
			type: 'boolean',
			required: false,
			description: 'Indicates if the absence is dynamic.',
		},
		{
			name: 'dynamicdays',
			type: 'number',
			required: false,
			description:
				'Number of days for the dynamic absence to begin (nwtype has to be 1).',
		},
		{
			name: 'dynamicdaysduration',
			type: 'number',
			required: false,
			description:
				'Number of days for the dynamic absence to last (nwtype has to be 1).',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarNonWorkingTimesUpdate = {
	key: 'calendarNonWorkingTimesUpdate',
	group: 'calendarNonWorkingTimes',
	action: 'update',
	method: 'PUT',
	path: '/api/calendarsnonworkingtimes',
	riskLevel: 'write',
	description: 'Use this function to update an absence.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the absence.',
		},
		{
			name: 'appcalendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
		},
		{
			name: 'startdate',
			type: 'string',
			required: false,
			description:
				'Start time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'enddate',
			type: 'string',
			required: false,
			description:
				'End time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description: 'Reason or note for the absence.',
		},
		{
			name: 'nwtype',
			type: 'boolean',
			required: false,
			description: 'Indicates if the absence is dynamic.',
		},
		{
			name: 'dynamicdays',
			type: 'number',
			required: false,
			description:
				'Number of days for the dynamic absence (nwtype has to be 1).',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const calendarNonWorkingTimesDelete = {
	key: 'calendarNonWorkingTimesDelete',
	group: 'calendarNonWorkingTimes',
	action: 'delete',
	method: 'DELETE',
	path: '/api/calendarsnonworkingtimes',
	riskLevel: 'destructive',
	description: 'Use this function to delete an absence.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the absence.',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const contactsList = {
	key: 'contactsList',
	group: 'contacts',
	action: 'list',
	method: 'GET',
	path: '/api/contact',
	riskLevel: 'read',
	description:
		'Returns a list with all contacts that are maintained in the eTermin CRM.',
	params: [
		{
			name: 'email',
			type: 'string',
			required: false,
			description: 'E-Mail of the contact',
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			description: 'ExternalID of the contact',
		},
		{
			name: 'cid',
			type: 'string',
			required: false,
			description: 'CID of the contact',
		},
		{
			name: 'creationdate',
			type: 'string',
			required: false,
			description: 'Displays all contacts that were created on this date',
		},
		{
			name: 'creationdateall',
			type: 'string',
			required: false,
			description: 'Displays all contacts that were created since this date',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const contactsCreate = {
	key: 'contactsCreate',
	group: 'contacts',
	action: 'create',
	method: 'POST',
	path: '/api/contact',
	riskLevel: 'write',
	description:
		'Creates a new contact. You can see the new contact in the eTermin CRM.',
	params: [
		{
			name: 'updatewhenexistsgdt',
			type: 'number',
			required: false,
			description:
				'Set to 1 to check if the contact is already existing. If so the existing contact gets updated. Needs email or firstname, lastname, birthday.',
		},
		{
			name: 'salutation',
			type: 'string',
			required: false,
			description: 'Salutation of the person.',
		},
		{
			name: 'title',
			type: 'string',
			required: false,
			description: 'Title of the person.',
		},
		{
			name: 'lastname',
			type: 'string',
			required: false,
			description: 'Lastname of the person.',
		},
		{
			name: 'firstname',
			type: 'string',
			required: false,
			description: 'Firstname of the person.',
		},
		{
			name: 'birthday',
			type: 'string',
			required: false,
			description: 'Birthday of the person.',
		},
		{
			name: 'email',
			type: 'string',
			required: false,
			description: 'E-Mail of the person.',
		},
		{
			name: 'phone',
			type: 'string',
			required: false,
			description: 'Phone of the person.',
		},
		{
			name: 'company',
			type: 'string',
			required: false,
			description:
				'Company of the person (make sure this field exists in your account)',
		},
		{
			name: 'street',
			type: 'string',
			required: false,
			description: 'Street of the person.',
		},
		{
			name: 'zip',
			type: 'string',
			required: false,
			description: 'Zip of the person.',
		},
		{
			name: 'city',
			type: 'string',
			required: false,
			description: 'City of the person.',
		},
		{
			name: 'state',
			type: 'string',
			required: false,
			description: 'State of the person.',
		},
		{
			name: 'country',
			type: 'string',
			required: false,
			description: 'Country of the person.',
		},
		{
			name: 'customernumber',
			type: 'string',
			required: false,
			description: 'ID of the person.',
		},
		{
			name: 'loginid',
			type: 'string',
			required: false,
			description:
				'Sets the loginID for the contact (if Login is used on Bookingpage).',
		},
		{
			name: 'password',
			type: 'string',
			required: false,
			description: 'Sets the initial password for the contact.',
		},
		{
			name: 'newsletter',
			type: 'boolean',
			required: false,
			description: 'Opts the contact into the newsletter.',
		},
		{
			name: 'additional1',
			type: 'string',
			required: false,
			description: 'Additional appointment field 1.',
		},
		{
			name: 'additional2',
			type: 'string',
			required: false,
			description: 'Additional appointment field 2.',
		},
		{
			name: 'additional3',
			type: 'string',
			required: false,
			description: 'Additional appointment field 3.',
		},
		{
			name: 'additional4',
			type: 'string',
			required: false,
			description: 'Additional appointment field 4.',
		},
		{
			name: 'additional5',
			type: 'string',
			required: false,
			description: 'Additional appointment field 5.',
		},
		{
			name: 'additional6',
			type: 'string',
			required: false,
			description: 'Additional appointment field 6.',
		},
		{
			name: 'additional7',
			type: 'string',
			required: false,
			description: 'Additional appointment field 7.',
		},
		{
			name: 'additional8',
			type: 'string',
			required: false,
			description: 'Additional appointment field 8.',
		},
		{
			name: 'additional9',
			type: 'string',
			required: false,
			description: 'Additional appointment field 9.',
		},
		{
			name: 'additional10',
			type: 'string',
			required: false,
			description: 'Additional appointment field 10.',
		},
		{
			name: 'additional11',
			type: 'string',
			required: false,
			description: 'Additional appointment field 11.',
		},
		{
			name: 'additional12',
			type: 'string',
			required: false,
			description: 'Additional appointment field 12.',
		},
		{
			name: 'additional13',
			type: 'string',
			required: false,
			description: 'Additional appointment field 13.',
		},
		{
			name: 'additional14',
			type: 'string',
			required: false,
			description: 'Additional appointment field 14.',
		},
		{
			name: 'additional15',
			type: 'string',
			required: false,
			description: 'Additional appointment field 15.',
		},
		{
			name: 'additional16',
			type: 'string',
			required: false,
			description: 'Additional appointment field 16.',
		},
		{
			name: 'additional17',
			type: 'string',
			required: false,
			description: 'Additional appointment field 17.',
		},
		{
			name: 'additional18',
			type: 'string',
			required: false,
			description: 'Additional appointment field 18.',
		},
		{
			name: 'additional19',
			type: 'string',
			required: false,
			description: 'Additional appointment field 19.',
		},
		{
			name: 'additional20',
			type: 'string',
			required: false,
			description: 'Additional appointment field 20.',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const contactsUpdate = {
	key: 'contactsUpdate',
	group: 'contacts',
	action: 'update',
	method: 'PUT',
	path: '/api/contact',
	riskLevel: 'write',
	description:
		'Use this function if you want to update details of an existing contact.',
	params: [
		{
			name: 'salutation',
			type: 'string',
			required: false,
			description: 'Salutation of the person.',
		},
		{
			name: 'title',
			type: 'string',
			required: false,
			description: 'Title of the person.',
		},
		{
			name: 'lastname',
			type: 'string',
			required: false,
			description: 'Lastname of the person.',
		},
		{
			name: 'birthday',
			type: 'string',
			required: false,
			description: 'Birthday of the person.',
		},
		{
			name: 'email',
			type: 'string',
			required: false,
			description: 'E-Mail of the person.',
		},
		{
			name: 'phone',
			type: 'string',
			required: false,
			description: 'Phone of the person.',
		},
		{
			name: 'company',
			type: 'string',
			required: false,
			description:
				'Company of the person (make sure this field exists in your account)',
		},
		{
			name: 'street',
			type: 'string',
			required: false,
			description: 'Street of the person.',
		},
		{
			name: 'zip',
			type: 'string',
			required: false,
			description: 'Zip of the person.',
		},
		{
			name: 'city',
			type: 'string',
			required: false,
			description: 'City of the person.',
		},
		{
			name: 'state',
			type: 'string',
			required: false,
			description: 'State of the person.',
		},
		{
			name: 'country',
			type: 'string',
			required: false,
			description: 'Country of the person.',
		},
		{
			name: 'customernumber',
			type: 'string',
			required: false,
			description: 'ID of the person.',
		},
		{
			name: 'loginid',
			type: 'string',
			required: false,
			description:
				'Sets the loginID for the contact (if Login is used on Bookingpage).',
		},
		{
			name: 'password',
			type: 'string',
			required: false,
			description: 'Sets the initial password for the contact.',
		},
		{
			name: 'newsletter',
			type: 'boolean',
			required: false,
			description: 'Opts the contact into the newsletter.',
		},
		{
			name: 'additional1',
			type: 'string',
			required: false,
			description: 'Additional appointment field 1.',
		},
		{
			name: 'additional2',
			type: 'string',
			required: false,
			description: 'Additional appointment field 2.',
		},
		{
			name: 'additional3',
			type: 'string',
			required: false,
			description: 'Additional appointment field 3.',
		},
		{
			name: 'additional4',
			type: 'string',
			required: false,
			description: 'Additional appointment field 4.',
		},
		{
			name: 'additional5',
			type: 'string',
			required: false,
			description: 'Additional appointment field 5.',
		},
		{
			name: 'additional6',
			type: 'string',
			required: false,
			description: 'Additional appointment field 6.',
		},
		{
			name: 'additional7',
			type: 'string',
			required: false,
			description: 'Additional appointment field 7.',
		},
		{
			name: 'additional8',
			type: 'string',
			required: false,
			description: 'Additional appointment field 8.',
		},
		{
			name: 'additional9',
			type: 'string',
			required: false,
			description: 'Additional appointment field 9.',
		},
		{
			name: 'additional10',
			type: 'string',
			required: false,
			description: 'Additional appointment field 10.',
		},
		{
			name: 'additional11',
			type: 'string',
			required: false,
			description: 'Additional appointment field 11.',
		},
		{
			name: 'additional12',
			type: 'string',
			required: false,
			description: 'Additional appointment field 12.',
		},
		{
			name: 'additional13',
			type: 'string',
			required: false,
			description: 'Additional appointment field 13.',
		},
		{
			name: 'additional14',
			type: 'string',
			required: false,
			description: 'Additional appointment field 14.',
		},
		{
			name: 'additional15',
			type: 'string',
			required: false,
			description: 'Additional appointment field 15.',
		},
		{
			name: 'additional16',
			type: 'string',
			required: false,
			description: 'Additional appointment field 16.',
		},
		{
			name: 'additional17',
			type: 'string',
			required: false,
			description: 'Additional appointment field 17.',
		},
		{
			name: 'additional18',
			type: 'string',
			required: false,
			description: 'Additional appointment field 18.',
		},
		{
			name: 'additional19',
			type: 'string',
			required: false,
			description: 'Additional appointment field 19.',
		},
		{
			name: 'additional20',
			type: 'string',
			required: false,
			description: 'Additional appointment field 20.',
		},
		{
			name: 'tags',
			type: 'string',
			required: false,
			description: 'Tags of the person. To add multiple tags use a comma (,)',
		},
		{
			name: 'limitedservices',
			type: 'string',
			required: false,
			description:
				'Set to 1 if you want to limit the services for the contact. Also see <br> /api/contactpermission and <br> /api/contactfrequency <br> for more information. The login on the booking page needs to be activated to use this feature',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const contactsDelete = {
	key: 'contactsDelete',
	group: 'contacts',
	action: 'delete',
	method: 'DELETE',
	path: '/api/contact',
	riskLevel: 'destructive',
	description:
		'Use this function if you want to delete a contact in the eTermin CRM. You can either use the email address or the ID to delete the contact.',
	params: [
		{
			name: 'email',
			type: 'string',
			required: false,
			description:
				'E-Mail of the contact (this can lead to the deletion of multiple contacts with the same Email)',
		},
		{
			name: 'id',
			type: 'string',
			required: false,
			description: 'ExternalID of the contact',
		},
		{
			name: 'cid',
			type: 'string',
			required: false,
			description: 'CID of the contact',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const contactFrequenciesList = {
	key: 'contactFrequenciesList',
	group: 'contactFrequencies',
	action: 'list',
	method: 'GET',
	path: '/api/contactfrequency',
	riskLevel: 'read',
	description: 'Returns the frequency setting of the contact.',
	params: [
		{
			name: 'cid',
			type: 'number',
			required: true,
			description: 'CID of the contact',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const contactFrequenciesCreate = {
	key: 'contactFrequenciesCreate',
	group: 'contactFrequencies',
	action: 'create',
	method: 'POST',
	path: '/api/contactfrequency',
	riskLevel: 'write',
	description:
		'Creates contact frequency that limites the amount of bookings a contact can have. The login on the booking page has to be activated to use this function.',
	params: [
		{
			name: 'cid',
			type: 'number',
			required: true,
			description: 'CID of the contact that should get a frequency',
		},
		{
			name: 'limited',
			type: 'boolean',
			required: true,
			description: 'Set to true if the frequency limitation should apply',
		},
		{
			name: 'frequency',
			type: 'number',
			required: true,
			description:
				'Defines how many appointments can be booked in the specific timeframe',
		},
		{
			name: 'frequencytype',
			type: 'string',
			required: true,
			description:
				'Defines the timeframe of the frequency limitation:<br>0 = per week<br>1 = per month<br>2 = per quarter<br>3 = per year',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const contactServicesList = {
	key: 'contactServicesList',
	group: 'contactServices',
	action: 'list',
	method: 'GET',
	path: '/api/contactservice',
	riskLevel: 'read',
	description: 'Returns a list of the permissions of the contact.',
	params: [
		{
			name: 'cid',
			type: 'number',
			required: true,
			description: 'CID of the contact',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const contactServicesCreate = {
	key: 'contactServicesCreate',
	group: 'contactServices',
	action: 'create',
	method: 'POST',
	path: '/api/contactservice',
	riskLevel: 'write',
	description:
		'Creates contact permission to specific service groups. The login on the booking page has to be activated to use this function.',
	params: [
		{
			name: 'cid',
			type: 'number',
			required: true,
			description: 'CID of the contact that should get permissions',
		},
		{
			name: 'sgid',
			type: 'string',
			required: true,
			description:
				'Servicegroupids of the servicegroups that the contact should have permission to. Multiple servicegroups are separated by a comma (,). Leave empty for no restrictions',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const messageLogsList = {
	key: 'messageLogsList',
	group: 'messageLogs',
	action: 'list',
	method: 'GET',
	path: '/api/messagelogs',
	riskLevel: 'read',
	description:
		'Returns a list with all messages that are sent via eTermin. Note: You can only get the list for the last 30 days or less, depending on your privacy settings in the account',
	params: [
		{
			name: 'id',
			type: 'number',
			required: false,
			description:
				'ID of a messagelog entry. Gives the email text that is sent in this specific email.',
		},
		{
			name: 'appid',
			type: 'number',
			required: false,
			description:
				'Gives a list of all emails and SMS that are sent relating to the numeric appointmentid (not externalid)',
		},
		{
			name: 'smsonly',
			type: 'boolean',
			required: false,
			description:
				"Only gives you a list how many SMS are sent this month and last month. It won't contain the list of SMS that are actually sent, only the amount.",
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const ratingsList = {
	key: 'ratingsList',
	group: 'ratings',
	action: 'list',
	method: 'GET',
	path: '/api/rating',
	riskLevel: 'read',
	description: 'Returns all the ratings that were received from the customers.',
	params: [],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const servicesList = {
	key: 'servicesList',
	group: 'services',
	action: 'list',
	method: 'GET',
	path: '/api/service',
	riskLevel: 'read',
	description:
		'Use this function if you want to get details of an existing service or all services.',
	params: [
		{
			name: 'languageid',
			type: 'string',
			required: false,
			description:
				'Use the language code in which you want the name and description of the service (e.g., DE, EN, etc.)',
		},
		{
			name: 'id',
			type: 'number',
			required: false,
			description:
				'ID of the service to get the information of a specific service',
		},
		{
			name: 'ServiceGroupID',
			type: 'number',
			required: false,
			description: 'Use if you want only services of a specific service group',
		},
		{
			name: 'addimage',
			type: 'number',
			required: false,
			description:
				'true if you want to also get the image-data in your response',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const servicesCreate = {
	key: 'servicesCreate',
	group: 'services',
	action: 'create',
	method: 'POST',
	path: '/api/service',
	riskLevel: 'write',
	description:
		'Use this function if you want to create a service. Note: Most services only need the first few parameters. However, since the services are very versatile, they have much more parameters, especially because they may override global settings.',
	params: [
		{
			name: 'servicegroupid',
			type: 'number',
			required: true,
			description: 'ID of the service group',
		},
		{
			name: 'servicede',
			type: 'string',
			required: true,
			description:
				'Name of the service in german. For other languages use serviceLANGUAGECODE e.g. serviceen',
		},
		{
			name: 'timeslotminutes',
			type: 'number',
			required: true,
			description: 'Duration of the service in minutes',
		},
		{
			name: 'infode',
			type: 'string',
			required: false,
			description:
				'Additional description of the service in german. For other languages use serviceLANGUAGECODE e.g. infoen',
		},
		{
			name: 'infodisplay',
			type: 'number',
			required: false,
			description:
				'Defines where the information is shown (0 = below service name, 1 = informationtext page 2, 2 = summary after booking, 3 = below service name and summary after booking)',
		},
		{
			name: 'differenttimeresource',
			type: 'boolean',
			required: false,
			description: 'True if you want to add pre- or post processing times',
		},
		{
			name: 'timeslotminutesresstart',
			type: 'number',
			required: false,
			description:
				'Busy by minute (use negative number to have a pre-processing time)',
		},
		{
			name: 'timeslotminutesresend',
			type: 'number',
			required: false,
			description:
				'Busy until minute (use a number greater than timeslotminutes to have a post-processing time)',
		},
		{
			name: 'price',
			type: 'number',
			required: false,
			description: 'Price of the service',
		},
		{
			name: 'priceispercentage',
			type: 'boolean',
			required: false,
			description: 'True if price is a percentage',
		},
		{
			name: 'abbreviation',
			type: 'string',
			required: false,
			description: 'abbreviation of the service',
		},
		{
			name: 'enablecapacity',
			type: 'boolean',
			required: false,
			description: 'True to enable the capacity of the service',
		},
		{
			name: 'showcapselectionbox',
			type: 'boolean',
			required: false,
			description: 'True if the customer is able to select the capacity',
		},
		{
			name: 'maxcapacity',
			type: 'number',
			required: false,
			description: 'Sets the maximum capacity of the service',
		},
		{
			name: 'maxcapacityusersel',
			type: 'number',
			required: false,
			description:
				'Sets the maximum capacity the user can set on the booking page (needs showcapselectionbox to be true)',
		},
		{
			name: 'capacitynonsel',
			type: 'number',
			required: false,
			description:
				'Sets the capacity if selected on the booking page (needs showcapselectionbox to be false)',
		},
		{
			name: 'image',
			type: 'string',
			required: false,
			description: 'Image of the service',
		},
		{
			name: 'appdeadline',
			type: 'number',
			required: false,
			description: 'Time the appointment must be booked in advance in minutes',
		},
		{
			name: 'appfuture',
			type: 'number',
			required: false,
			description: 'Time the appointment can be booked in the future in days',
		},
		{
			name: 'startedapp',
			type: 'number',
			required: false,
			description:
				'Time the appointment can be booked if already started in minutes (has to be a negative value)',
		},
		{
			name: 'canceldeadline',
			type: 'number',
			required: false,
			description: 'Time the appointment can be cancelled in hours',
		},
		{
			name: 'dayselectiontype',
			type: 'number',
			required: false,
			description:
				'Defines how page 2 shows the available days (0 = Calendar, 1 = list of days)',
		},
		{
			name: 'appointmentlocation',
			type: 'number',
			required: false,
			description: 'Defines the location of the appointment',
		},
		{
			name: 'appointmentlocationtext',
			type: 'string',
			required: false,
			description: 'Defines the location text if appointmentlocation = 3',
		},
		{
			name: 'vendorconfirmation',
			type: 'number',
			required: false,
			description:
				'Defines if the appointment provider needs to manually confirm the appointment (0 = manually, 1 = automatically)',
		},
		{
			name: 'smsconfirmation',
			type: 'number',
			required: false,
			description:
				'Defines if a SMS confirmation is sent after booking (1 = enabled, 0 = disabled)',
		},
		{
			name: 'reminderhours',
			type: 'number',
			required: false,
			description:
				'Defines when the first reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'reminderhours2',
			type: 'number',
			required: false,
			description:
				'Defines when the second reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'cluster',
			type: 'number',
			required: false,
			description:
				'Defines if the cluster is applied to this service (1 = enabled, 0 = disabled)',
		},
		{
			name: 'customerconfirm',
			type: 'number',
			required: false,
			description:
				"Defines if the customer needs to confirm the appointment (1 = enabled, 0 = disabled; doesn't work with online payments or vendorconfirmation)",
		},
		{
			name: 'customerconfirmtime',
			type: 'number',
			required: false,
			description:
				'Time in minutes the customer has time to confirm the appointment (customerconfirm must be set to 1)',
		},
		{
			name: 'PM0',
			type: 'number',
			required: false,
			description: 'Shows online payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'PM1',
			type: 'number',
			required: false,
			description: 'Shows on site payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'PM2',
			type: 'number',
			required: false,
			description:
				'Shows by invoice payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'paymentamountpercentage',
			type: 'number',
			required: false,
			description:
				'Defines the payment amount that needs to be paid at the end of booking',
		},
		{
			name: 'paymentamountisabsolute',
			type: 'number',
			required: false,
			description:
				'Defines if paymentamountpercentage is abolute or a percentage (1 = absolute, 0 = percentage)',
		},
		{
			name: 'currency',
			type: 'string',
			required: false,
			description: 'Defines the currency of the service',
		},
		{
			name: 'voucherfield',
			type: 'number',
			required: false,
			description:
				'Defines if the voucherfield is shown (0 = not shown, 1 = shown, 2 = shown and mandatory)',
		},
		{
			name: 'mpbs',
			type: 'number',
			required: false,
			description:
				'Defines if the price is multiplied by the amount of booked appointments',
		},
		{
			name: 'timeslotformat',
			type: 'number',
			required: false,
			description:
				'Defines how the timeslots are shown on page 2 on the bookingpage (0 = starttime - endtime, 1 = starttime, 2 = only date, 3 = calendar week, 4 = like 0 but with dates, 5 = startdate only)',
		},
		{
			name: 'multiappointment',
			type: 'number',
			required: false,
			description:
				'Defines if multiple appointments can be booked in one booking (0 = no, 1 = yes)',
		},
		{
			name: 'multiservicedurationcalcmethod',
			type: 'number',
			required: false,
			description:
				'Defines how the duration is calculated if multiple services are selected (0 = all durations are summed up, 1 = only duration of the longest service, 2 = all durations are halfed, 3 = like 2 except the longest service)',
		},
		{
			name: 'calendarselection',
			type: 'number',
			required: false,
			description:
				'Defines if the calendar selection should be shown (0 = no, 1 = yes)',
		},
		{
			name: 'ssca',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar selection the entry all calendars is shown (0 = no, 1 = yes)',
		},
		{
			name: 'showcalname',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar name is shown in the time slot (0 = no, 1 = yes)',
		},
		{
			name: 'showcalpic',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar picture is shown after the timeslot is selected (0 = no, 1 = yes)',
		},
		{
			name: 'showavcap',
			type: 'number',
			required: false,
			description:
				'Defines if the available capacity is shown in time slots (0 = no, 1 = yes)',
		},
		{
			name: 'limitbooking',
			type: 'number',
			required: false,
			description:
				'Defines if this service can be booked a limited amount of times per customer (0 = no, 1 = yes)',
		},
		{
			name: 'limitappointmentstype',
			type: 'number',
			required: false,
			description:
				'Defines how the appointments are limited (0 = per booking day, 1 = per week, 2 = per month, 3 = per year, 4 = per booked day)',
		},
		{
			name: 'limitappointments',
			type: 'number',
			required: false,
			description: 'Defines how many appointments can be booked per customer',
		},
		{
			name: 'limitservice',
			type: 'number',
			required: false,
			description:
				'Defines if the limitation only applies to this specific service',
		},
		{
			name: 'wowing',
			type: 'number',
			required: false,
			description:
				'Set to 0 if the Wowing interface should be disabled for this service',
		},
		{
			name: 'wowingautomationid',
			type: 'number',
			required: false,
			description: 'Defines the Woing Automation ID',
		},
		{
			name: 'paymentduration',
			type: 'number',
			required: false,
			description: 'Defines the payment term for LexOffice',
		},
		{
			name: 'workloadperc',
			type: 'number',
			required: false,
			description: 'Defines the percentage of time slots that are not shown',
		},
		{
			name: 'nrtimeslotentries',
			type: 'number',
			required: false,
			description: 'Defines the maximum amount of time slots that are shown',
		},
		{
			name: 'feedback',
			type: 'number',
			required: false,
			description: 'Set to 0 if the feedback checkbox should not be shown',
		},
		{
			name: 'calcdrivingtime',
			type: 'number',
			required: false,
			description:
				'Defines if driving time should be calculated (0 = no, 1 = yes)',
		},
		{
			name: 'fillcalendarstrategy',
			type: 'number',
			required: false,
			description:
				'Defines how the calender should be filled (0 = standard, 1 = random, 2 = round Robin, 3 = sequential, 4 = skills, 5 = strict round Robin)',
		},
		{
			name: 'waitinglist',
			type: 'number',
			required: false,
			description:
				'Defines if the waiting list should be available (0 = no, 1 = yes)',
		},
		{
			name: 'notearlyapp',
			type: 'number',
			required: false,
			description:
				'Defines if the customer should get an email if an earlier appointment is available (0 = not active, 1 = for appointments that were cancelled online, 2 = for appointments cancelled online and manually, 3 = like 1 but per calendar, 4 = like 2 but per calendar)',
		},
		{
			name: 'sortorder',
			type: 'number',
			required: false,
			description: 'Defines the position in the servicegroup',
		},
		{
			name: 'bookingtype',
			type: 'number',
			required: false,
			description:
				"Defines the bookingtype (0 = appointment, 1 = no appointment booking allowed, 2 = 'negative' appointment, 3 = reservation list, 4 = voucher sale)",
		},
		{
			name: 'showinternal',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is shown in the backend',
		},
		{
			name: 'enabled',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is shown in the frontend',
		},
		{
			name: 'showindb',
			type: 'boolean',
			required: false,
			description:
				'Defines if the service is shown in the most booked area of the Dashboard',
		},
		{
			name: 'emailsender',
			type: 'string',
			required: false,
			description: 'Defines the sender adress of the email for this service',
		},
		{
			name: 'emailtxtde',
			type: 'string',
			required: false,
			description:
				'A special placeholder %SERVICETEXT% for emails, use other language codes to set the text (for example emailtxten for english)',
		},
		{
			name: 'infotxtp2',
			type: 'string',
			required: false,
			description:
				'A special placeholder %INFOTEXTP2% for page 2 of the booking page',
		},
		{
			name: 'pricesuffixde',
			type: 'string',
			required: false,
			description:
				'Additional information for the price, use other language codes to set the text (for example emailtxten for english)',
		},
		{
			name: 'priceinfopos',
			type: 'number',
			required: false,
			description:
				'Defines where the pricesuffix is shown (0 = left side, 1 = right side)',
		},
		{
			name: 'vat',
			type: 'number',
			required: false,
			description: 'Defines the vat rate of the service',
		},
		{
			name: 'multiplypricewithcap',
			type: 'boolean',
			required: false,
			description: 'Defines if the price is multiplied with the capacity',
		},
		{
			name: 'pricediffperday',
			type: 'boolean',
			required: false,
			description: 'Defines if different prices per weekday are applied',
		},
		{
			name: 'issubscription',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is a subscription',
		},
		{
			name: 'capseltextde',
			type: 'string',
			required: false,
			description:
				'Defines the text if there is a capacity selection on that service, use other language codes to set the text (for example capseltexten for english)',
		},
		{
			name: 'mstextpos',
			type: 'number',
			required: false,
			description:
				'Defines the position of capseltext (0 = above selection, 1 = to the right)',
		},
		{
			name: 'allowonlythisservice',
			type: 'boolean',
			required: false,
			description:
				'If there are multiple services with capacity available at the same time, this option prevents that they will get mixed, if set to true',
		},
		{
			name: 'multiservicesel',
			type: 'boolean',
			required: false,
			description:
				"True, if the service can be booked multiple times after another. This won't work if the parameter enablecapacity is true aswell",
		},
		{
			name: 'multiservicemin',
			type: 'number',
			required: false,
			description:
				'Defines the minimum amount that can be choosen for multi service selection',
		},
		{
			name: 'multiservicemax',
			type: 'number',
			required: false,
			description:
				'Defines the maximum amount that can be choosen for multi service selection',
		},
		{
			name: 'extramin',
			type: 'number',
			required: false,
			description: 'Defines total wrap up time',
		},
		{
			name: 'extramintype',
			type: 'number',
			required: false,
			description:
				'0 if extramin should not be applied if differenttimeresource is true, 1 if extramin should be added to timeslotminutesresend',
		},
		{
			name: 'maxappsel',
			type: 'number',
			required: false,
			description:
				'Defines the maximum amount of appointments that can be selected on the booking page if multiappointment is true (in this service or globally)',
		},
		{
			name: 'nrappsel',
			type: 'number',
			required: false,
			description:
				'Defines the maximum / minimum amount of appointments that MUST be selected on the booking page if multiappointment is true (in this service or globally)',
		},
		{
			name: 'maxminslots',
			type: 'boolean',
			required: false,
			description: 'Defines if nrappsel is maximum (0) or minimum (1)',
		},
		{
			name: 'nrappseladjacent',
			type: 'boolean',
			required: false,
			description: 'True, if the selected appointments have to be adjacent',
		},
		{
			name: 'nrappseladjacenttype',
			type: 'number',
			required: false,
			description:
				'0 = the date and time need to be adjacent, 1 = only the day need to be adjacent',
		},
		{
			name: 'specificrangenextslot',
			type: 'boolean',
			required: false,
			description:
				'True, if the next appointment needs to be after a specific timeframe',
		},
		{
			name: 'rangestart',
			type: 'number',
			required: false,
			description: 'Days after the last appoinment',
		},
		{
			name: 'rangeend',
			type: 'number',
			required: false,
			description: 'Days range for the new appointment',
		},
		{
			name: 'infotextinslots',
			type: 'boolean',
			required: false,
			description:
				'True, if the info text should be shown in the slot text in page 2 of the booking page',
		},
		{
			name: 'appattrib',
			type: 'number',
			required: false,
			description:
				'Defines which attribute is set automatically in appointment. Attributes are binary encoded (1st attribute = 1, 2nd = 2, 3rd = 4; 1st + 2nd = 3)',
		},
		{
			name: 'addapphours',
			type: 'number',
			required: false,
			description:
				'Hours after the first appointment, where a second appointment is booked',
		},
		{
			name: 'rrule',
			type: 'string',
			required: false,
			description: 'Defines the RRULE for this service',
		},
		{
			name: 'bookingminute',
			type: 'number',
			required: false,
			description:
				'Defines when the timeslots are shown (61 = no restrictions, 0 = every full hour, 31 = every full and half hour, 15 or 30 or 45 = x minutes after a full hour)',
		},
		{
			name: 'showserviceids',
			type: 'string',
			required: false,
			description: 'Service(s) that have to be selected to show this service',
		},
		{
			name: 'hideserviceids',
			type: 'string',
			required: false,
			description:
				'Service(s) that should be hidden, if this service is selected',
		},
		{
			name: 'uselogo',
			type: 'boolean',
			required: false,
			description:
				'True, if the the picture of this service should be used for the email logo',
		},
		{
			name: 'severalcalendarsused',
			type: 'boolean',
			required: false,
			description:
				'True, if the service can only be booked if another calendar is available',
		},
		{
			name: 'differenttimecombined',
			type: 'boolean',
			required: false,
			description:
				'True, if the service has a different time if booked with another service',
		},
		{
			name: 'timeslotcombined',
			type: 'number',
			required: false,
			description:
				'Defines the time of the appointment if booked with another service. differenttimecombined has to be true',
		},
		{
			name: 'tags',
			type: 'string',
			required: false,
			description: 'ID of the tags that the contact gets after booking',
		},
		{
			name: 'tagscancel',
			type: 'string',
			required: false,
			description:
				'ID of the tags that the contact gets after cancellation of the appointment',
		},
		{
			name: 'externalreference',
			type: 'string',
			required: false,
			description: 'Used for a tag ID or external reference after booking',
		},
		{
			name: 'externalreferencedelete',
			type: 'string',
			required: false,
			description:
				'Used for a tag ID or external reference after cancellation of the appointment',
		},
		{
			name: 'externalreferencechange',
			type: 'string',
			required: false,
			description:
				'Used for a tag ID or external reference after a change of the appointment',
		},
		{
			name: 'externalreferencedate',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the date of the appointment',
		},
		{
			name: 'externalreferencelocation',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the location of the appointment',
		},
		{
			name: 'externalreferencecalname',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the calendar name of the appointment',
		},
		{
			name: 'externalreferencecancel',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the cancellation link of the appointment',
		},
		{
			name: 'jscode',
			type: 'string',
			required: false,
			description:
				'Used for JavaScript code that will be executed after the booking of the appointment (for example to redirect to another website)',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const servicesUpdate = {
	key: 'servicesUpdate',
	group: 'services',
	action: 'update',
	method: 'PUT',
	path: '/api/service',
	riskLevel: 'write',
	description:
		'Use this function if you want to update details of an existing service.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the service',
		},
		{
			name: 'servicegroupid',
			type: 'number',
			required: false,
			description: 'ID of the service group',
		},
		{
			name: 'servicede',
			type: 'string',
			required: false,
			description:
				'Name of the service in german. For other languages use serviceLANGUAGECODE e.g. serviceen',
		},
		{
			name: 'timeslotminutes',
			type: 'number',
			required: false,
			description: 'Duration of the service in minutes',
		},
		{
			name: 'infode',
			type: 'string',
			required: false,
			description:
				'Additional description of the service in german. For other languages use serviceLANGUAGECODE e.g. infoen',
		},
		{
			name: 'infodisplay',
			type: 'number',
			required: false,
			description:
				'Defines where the information is shown (0 = below service name, 1 = informationtext page 2, 2 = summary after booking, 3 = below service name and summary after booking)',
		},
		{
			name: 'differenttimeresource',
			type: 'boolean',
			required: false,
			description: 'True if you want to add pre- or post processing times',
		},
		{
			name: 'timeslotminutesresstart',
			type: 'number',
			required: false,
			description:
				'Busy by minute (use negative number to have a pre-processing time)',
		},
		{
			name: 'timeslotminutesresend',
			type: 'number',
			required: false,
			description:
				'Busy until minute (use a number greater than timeslotminutes to have a post-processing time)',
		},
		{
			name: 'price',
			type: 'number',
			required: false,
			description: 'Price of the service',
		},
		{
			name: 'priceispercentage',
			type: 'boolean',
			required: false,
			description: 'True if price is a percentage',
		},
		{
			name: 'abbreviation',
			type: 'string',
			required: false,
			description: 'abbreviation of the service',
		},
		{
			name: 'enablecapacity',
			type: 'boolean',
			required: false,
			description: 'True to enable the capacity of the service',
		},
		{
			name: 'showcapselectionbox',
			type: 'boolean',
			required: false,
			description: 'True if the customer is able to select the capacity',
		},
		{
			name: 'maxcapacity',
			type: 'number',
			required: false,
			description: 'Sets the maximum capacity of the service',
		},
		{
			name: 'maxcapacityusersel',
			type: 'number',
			required: false,
			description:
				'Sets the maximum capacity the user can set on the booking page (needs showcapselectionbox to be true)',
		},
		{
			name: 'capacitynonsel',
			type: 'number',
			required: false,
			description:
				'Sets the capacity if selected on the booking page (needs showcapselectionbox to be false)',
		},
		{
			name: 'image',
			type: 'string',
			required: false,
			description: 'Image of the service',
		},
		{
			name: 'appdeadline',
			type: 'number',
			required: false,
			description: 'Time the appointment must be booked in advance in minutes',
		},
		{
			name: 'appfuture',
			type: 'number',
			required: false,
			description: 'Time the appointment can be booked in the future in days',
		},
		{
			name: 'startedapp',
			type: 'number',
			required: false,
			description:
				'Time the appointment can be booked if already started in minutes (has to be a negative value)',
		},
		{
			name: 'canceldeadline',
			type: 'number',
			required: false,
			description: 'Time the appointment can be cancelled in hours',
		},
		{
			name: 'dayselectiontype',
			type: 'number',
			required: false,
			description:
				'Defines how page 2 shows the available days (0 = Calendar, 1 = list of days)',
		},
		{
			name: 'appointmentlocation',
			type: 'number',
			required: false,
			description: 'Defines the location of the appointment',
		},
		{
			name: 'appointmentlocationtext',
			type: 'string',
			required: false,
			description: 'Defines the location text if appointmentlocation = 3',
		},
		{
			name: 'vendorconfirmation',
			type: 'number',
			required: false,
			description:
				'Defines if the appointment provider needs to manually confirm the appointment (0 = manually, 1 = automatically)',
		},
		{
			name: 'smsconfirmation',
			type: 'number',
			required: false,
			description:
				'Defines if a SMS confirmation is sent after booking (1 = enabled, 0 = disabled)',
		},
		{
			name: 'reminderhours',
			type: 'number',
			required: false,
			description:
				'Defines when the first reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'reminderhours2',
			type: 'number',
			required: false,
			description:
				'Defines when the second reminder is sent in hours (needs to be a negative value)',
		},
		{
			name: 'cluster',
			type: 'number',
			required: false,
			description:
				'Defines if the cluster is applied to this service (1 = enabled, 0 = disabled)',
		},
		{
			name: 'customerconfirm',
			type: 'number',
			required: false,
			description:
				"Defines if the customer needs to confirm the appointment (1 = enabled, 0 = disabled; doesn't work with online payments or vendorconfirmation)",
		},
		{
			name: 'customerconfirmtime',
			type: 'number',
			required: false,
			description:
				'Time in minutes the customer has time to confirm the appointment (customerconfirm must be set to 1)',
		},
		{
			name: 'PM0',
			type: 'number',
			required: false,
			description: 'Shows online payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'PM1',
			type: 'number',
			required: false,
			description: 'Shows on site payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'PM2',
			type: 'number',
			required: false,
			description:
				'Shows by invoice payment options (1 = enabled, 0 = disabled)',
		},
		{
			name: 'paymentamountpercentage',
			type: 'number',
			required: false,
			description:
				'Defines the payment amount that needs to be paid at the end of booking',
		},
		{
			name: 'paymentamountisabsolute',
			type: 'number',
			required: false,
			description:
				'Defines if paymentamountpercentage is abolute or a percentage (1 = absolute, 0 = percentage)',
		},
		{
			name: 'currency',
			type: 'string',
			required: false,
			description: 'Defines the currency of the service',
		},
		{
			name: 'voucherfield',
			type: 'number',
			required: false,
			description:
				'Defines if the voucherfield is shown (0 = not shown, 1 = shown, 2 = shown and mandatory)',
		},
		{
			name: 'mpbs',
			type: 'number',
			required: false,
			description:
				'Defines if the price is multiplied by the amount of booked appointments',
		},
		{
			name: 'timeslotformat',
			type: 'number',
			required: false,
			description:
				'Defines how the timeslots are shown on page 2 on the bookingpage (0 = starttime - endtime, 1 = starttime, 2 = only date, 3 = calendar week, 4 = like 0 but with dates, 5 = startdate only)',
		},
		{
			name: 'multiappointment',
			type: 'number',
			required: false,
			description:
				'Defines if multiple appointments can be booked in one booking (0 = no, 1 = yes)',
		},
		{
			name: 'multiservicedurationcalcmethod',
			type: 'number',
			required: false,
			description:
				'Defines how the duration is calculated if multiple services are selected (0 = all durations are summed up, 1 = only duration of the longest service, 2 = all durations are halfed, 3 = like 2 except the longest service)',
		},
		{
			name: 'calendarselection',
			type: 'number',
			required: false,
			description:
				'Defines if the calendar selection should be shown (0 = no, 1 = yes)',
		},
		{
			name: 'ssca',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar selection the entry all calendars is shown (0 = no, 1 = yes)',
		},
		{
			name: 'showcalname',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar name is shown in the time slot (0 = no, 1 = yes)',
		},
		{
			name: 'showcalpic',
			type: 'number',
			required: false,
			description:
				'Defines if in the calendar picture is shown after the timeslot is selected (0 = no, 1 = yes)',
		},
		{
			name: 'showavcap',
			type: 'number',
			required: false,
			description:
				'Defines if the available capacity is shown in time slots (0 = no, 1 = yes)',
		},
		{
			name: 'limitbooking',
			type: 'number',
			required: false,
			description:
				'Defines if this service can be booked a limited amount of times per customer (0 = no, 1 = yes)',
		},
		{
			name: 'limitappointmentstype',
			type: 'number',
			required: false,
			description:
				'Defines how the appointments are limited (0 = per booking day, 1 = per week, 2 = per month, 3 = per year, 4 = per booked day)',
		},
		{
			name: 'limitappointments',
			type: 'number',
			required: false,
			description: 'Defines how many appointments can be booked per customer',
		},
		{
			name: 'limitservice',
			type: 'number',
			required: false,
			description:
				'Defines if the limitation only applies to this specific service',
		},
		{
			name: 'wowing',
			type: 'number',
			required: false,
			description:
				'Set to 0 if the Wowing interface should be disabled for this service',
		},
		{
			name: 'wowingautomationid',
			type: 'number',
			required: false,
			description: 'Defines the Woing Automation ID',
		},
		{
			name: 'paymentduration',
			type: 'number',
			required: false,
			description: 'Defines the payment term for LexOffice',
		},
		{
			name: 'workloadperc',
			type: 'number',
			required: false,
			description: 'Defines the percentage of time slots that are not shown',
		},
		{
			name: 'nrtimeslotentries',
			type: 'number',
			required: false,
			description: 'Defines the maximum amount of time slots that are shown',
		},
		{
			name: 'feedback',
			type: 'number',
			required: false,
			description: 'Set to 0 if the feedback checkbox should not be shown',
		},
		{
			name: 'calcdrivingtime',
			type: 'number',
			required: false,
			description:
				'Defines if driving time should be calculated (0 = no, 1 = yes)',
		},
		{
			name: 'fillcalendarstrategy',
			type: 'number',
			required: false,
			description:
				'Defines how the calender should be filled (0 = standard, 1 = random, 2 = round Robin, 3 = sequential, 4 = skills, 5 = strict round Robin)',
		},
		{
			name: 'waitinglist',
			type: 'number',
			required: false,
			description:
				'Defines if the waiting list should be available (0 = no, 1 = yes)',
		},
		{
			name: 'notearlyapp',
			type: 'number',
			required: false,
			description:
				'Defines if the customer should get an email if an earlier appointment is available (0 = not active, 1 = for appointments that were cancelled online, 2 = for appointments cancelled online and manually, 3 = like 1 but per calendar, 4 = like 2 but per calendar)',
		},
		{
			name: 'sortorder',
			type: 'number',
			required: false,
			description: 'Defines the position in the servicegroup',
		},
		{
			name: 'bookingtype',
			type: 'number',
			required: false,
			description:
				"Defines the bookingtype (0 = appointment, 1 = no appointment booking allowed, 2 = 'negative' appointment, 3 = reservation list, 4 = voucher sale)",
		},
		{
			name: 'showinternal',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is shown in the backend',
		},
		{
			name: 'enabled',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is shown in the frontend',
		},
		{
			name: 'showindb',
			type: 'boolean',
			required: false,
			description:
				'Defines if the service is shown in the most booked area of the Dashboard',
		},
		{
			name: 'emailsender',
			type: 'string',
			required: false,
			description: 'Defines the sender adress of the email for this service',
		},
		{
			name: 'emailtxtde',
			type: 'string',
			required: false,
			description:
				'A special placeholder %SERVICETEXT% for emails, use other language codes to set the text (for example emailtxten for english)',
		},
		{
			name: 'infotxtp2',
			type: 'string',
			required: false,
			description:
				'A special placeholder %INFOTEXTP2% for page 2 of the booking page',
		},
		{
			name: 'pricesuffixde',
			type: 'string',
			required: false,
			description:
				'Additional information for the price, use other language codes to set the text (for example emailtxten for english)',
		},
		{
			name: 'priceinfopos',
			type: 'number',
			required: false,
			description:
				'Defines where the pricesuffix is shown (0 = left side, 1 = right side)',
		},
		{
			name: 'vat',
			type: 'number',
			required: false,
			description: 'Defines the vat rate of the service',
		},
		{
			name: 'multiplypricewithcap',
			type: 'boolean',
			required: false,
			description: 'Defines if the price is multiplied with the capacity',
		},
		{
			name: 'pricediffperday',
			type: 'boolean',
			required: false,
			description: 'Defines if different prices per weekday are applied',
		},
		{
			name: 'issubscription',
			type: 'boolean',
			required: false,
			description: 'Defines if the service is a subscription',
		},
		{
			name: 'capseltextde',
			type: 'string',
			required: false,
			description:
				'Defines the text if there is a capacity selection on that service, use other language codes to set the text (for example capseltexten for english)',
		},
		{
			name: 'mstextpos',
			type: 'number',
			required: false,
			description:
				'Defines the position of capseltext (0 = above selection, 1 = to the right)',
		},
		{
			name: 'allowonlythisservice',
			type: 'boolean',
			required: false,
			description:
				'If there are multiple services with capacity available at the same time, this option prevents that they will get mixed, if set to true',
		},
		{
			name: 'multiservicesel',
			type: 'boolean',
			required: false,
			description:
				"True, if the service can be booked multiple times after another. This won't work if the parameter enablecapacity is true aswell",
		},
		{
			name: 'multiservicemin',
			type: 'number',
			required: false,
			description:
				'Defines the minimum amount that can be choosen for multi service selection',
		},
		{
			name: 'multiservicemax',
			type: 'number',
			required: false,
			description:
				'Defines the maximum amount that can be choosen for multi service selection',
		},
		{
			name: 'extramin',
			type: 'number',
			required: false,
			description: 'Defines total wrap up time',
		},
		{
			name: 'extramintype',
			type: 'number',
			required: false,
			description:
				'0 if extramin should not be applied if differenttimeresource is true, 1 if extramin should be added to timeslotminutesresend',
		},
		{
			name: 'maxappsel',
			type: 'number',
			required: false,
			description:
				'Defines the maximum amount of appointments that can be selected on the booking page if multiappointment is true (in this service or globally)',
		},
		{
			name: 'nrappsel',
			type: 'number',
			required: false,
			description:
				'Defines the maximum / minimum amount of appointments that MUST be selected on the booking page if multiappointment is true (in this service or globally)',
		},
		{
			name: 'maxminslots',
			type: 'boolean',
			required: false,
			description: 'Defines if nrappsel is maximum (0) or minimum (1)',
		},
		{
			name: 'nrappseladjacent',
			type: 'boolean',
			required: false,
			description: 'True, if the selected appointments have to be adjacent',
		},
		{
			name: 'nrappseladjacenttype',
			type: 'number',
			required: false,
			description:
				'0 = the date and time need to be adjacent, 1 = only the day need to be adjacent',
		},
		{
			name: 'specificrangenextslot',
			type: 'boolean',
			required: false,
			description:
				'True, if the next appointment needs to be after a specific timeframe',
		},
		{
			name: 'rangestart',
			type: 'number',
			required: false,
			description: 'Days after the last appoinment',
		},
		{
			name: 'rangeend',
			type: 'number',
			required: false,
			description: 'Days range for the new appointment',
		},
		{
			name: 'infotextinslots',
			type: 'boolean',
			required: false,
			description:
				'True, if the info text should be shown in the slot text in page 2 of the booking page',
		},
		{
			name: 'appattrib',
			type: 'number',
			required: false,
			description:
				'Defines which attribute is set automatically in appointment. Attributes are binary encoded (1st attribute = 1, 2nd = 2, 3rd = 4; 1st + 2nd = 3)',
		},
		{
			name: 'addapphours',
			type: 'number',
			required: false,
			description:
				'Hours after the first appointment, where a second appointment is booked',
		},
		{
			name: 'rrule',
			type: 'string',
			required: false,
			description: 'Defines the RRULE for this service',
		},
		{
			name: 'bookingminute',
			type: 'number',
			required: false,
			description:
				'Defines when the timeslots are shown (61 = no restrictions, 0 = every full hour, 31 = every full and half hour, 15 or 30 or 45 = x minutes after a full hour)',
		},
		{
			name: 'showserviceids',
			type: 'string',
			required: false,
			description: 'Service(s) that have to be selected to show this service',
		},
		{
			name: 'hideserviceids',
			type: 'string',
			required: false,
			description:
				'Service(s) that should be hidden, if this service is selected',
		},
		{
			name: 'uselogo',
			type: 'boolean',
			required: false,
			description:
				'True, if the the picture of this service should be used for the email logo',
		},
		{
			name: 'severalcalendarsused',
			type: 'boolean',
			required: false,
			description:
				'True, if the service can only be booked if another calendar is available',
		},
		{
			name: 'differenttimecombined',
			type: 'boolean',
			required: false,
			description:
				'True, if the service has a different time if booked with another service',
		},
		{
			name: 'timeslotcombined',
			type: 'number',
			required: false,
			description:
				'Defines the time of the appointment if booked with another service. differenttimecombined has to be true',
		},
		{
			name: 'tags',
			type: 'string',
			required: false,
			description: 'ID of the tags that the contact gets after booking',
		},
		{
			name: 'tagscancel',
			type: 'string',
			required: false,
			description:
				'ID of the tags that the contact gets after cancellation of the appointment',
		},
		{
			name: 'externalreference',
			type: 'string',
			required: false,
			description: 'Used for a tag ID or external reference after booking',
		},
		{
			name: 'externalreferencedelete',
			type: 'string',
			required: false,
			description:
				'Used for a tag ID or external reference after cancellation of the appointment',
		},
		{
			name: 'externalreferencechange',
			type: 'string',
			required: false,
			description:
				'Used for a tag ID or external reference after a change of the appointment',
		},
		{
			name: 'externalreferencedate',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the date of the appointment',
		},
		{
			name: 'externalreferencelocation',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the location of the appointment',
		},
		{
			name: 'externalreferencecalname',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the calendar name of the appointment',
		},
		{
			name: 'externalreferencecancel',
			type: 'string',
			required: false,
			description:
				'ID of a field that should contain the cancellation link of the appointment',
		},
		{
			name: 'jscode',
			type: 'string',
			required: false,
			description:
				'Used for JavaScript code that will be executed after the booking of the appointment (for example to redirect to another website)',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const servicesDelete = {
	key: 'servicesDelete',
	group: 'services',
	action: 'delete',
	method: 'DELETE',
	path: '/api/service',
	riskLevel: 'destructive',
	description: 'Use this function if you want to delete a service.',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'ID of the service',
		},
	],
	responseKind: 'opaque',
} as const satisfies ETerminOperation;

export const serviceCalendarsList = {
	key: 'serviceCalendarsList',
	group: 'serviceCalendars',
	action: 'list',
	method: 'GET',
	path: '/api/servicecalendar',
	riskLevel: 'read',
	description:
		'Returns a list of all calendars that are compatible with one of the provided serviceid(s)',
	params: [
		{
			name: 'serviceid',
			type: 'string',
			required: true,
			description:
				"ID of a service. Several service ID's can be separated with a comma (,). e.g. 45345,45346 etc.",
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const serviceGroupsList = {
	key: 'serviceGroupsList',
	group: 'serviceGroups',
	action: 'list',
	method: 'GET',
	path: '/api/servicegroup',
	riskLevel: 'read',
	description:
		'Returns all service groups that are available for the specific account.',
	params: [
		{
			name: 'servicegroupid',
			type: 'number',
			required: false,
			description: 'ID of the servicegroup that you want information on',
		},
		{
			name: 'languageid',
			type: 'string',
			required: false,
			description:
				'Language code if you only want the information for a specific language e.g. DE, EN, etc.',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const serviceGroupsCreate = {
	key: 'serviceGroupsCreate',
	group: 'serviceGroups',
	action: 'create',
	method: 'POST',
	path: '/api/servicegroup',
	riskLevel: 'write',
	description: 'Creates a new service group',
	params: [
		{
			name: 'servicegroupde',
			type: 'string',
			required: false,
			description:
				'Name of the service group in german. For other languages use servicegroupLANGUAGECODE e.g. servicegroupen',
		},
		{
			name: 'additionaltextde',
			type: 'string',
			required: false,
			description:
				'Additional information of the service group in german. For other languages use additionaltextLANGUAGECODE e.g. additionaltexten',
		},
		{
			name: 'addtextdisplaymode',
			type: 'number',
			required: false,
			description:
				'Defines the location of the additional text (0 = via Tooltip; 1 = under the name of the service group)',
		},
		{
			name: 'servicegrouptype',
			type: 'number',
			required: false,
			description:
				'Defines the service group type (0 = Service selection; 2 = Text field; 5 = location selection; 8 = Day amount selection; 9 = Number search; 10 = Minutes amount selection)',
		},
		{
			name: 'answerselection',
			type: 'number',
			required: false,
			description:
				'Selection type for services (0 = Single selection; 1 = Multi selection; 2 = list selection). Has to be -1 if servicegrouptype is not 0!',
		},
		{
			name: 'isoptional',
			type: 'boolean',
			required: false,
			description: 'Defines if a selection of a service is mandatory',
		},
		{
			name: 'showprice',
			type: 'boolean',
			required: false,
			description: 'Defines if the price of the service is shown',
		},
		{
			name: 'showduration',
			type: 'boolean',
			required: false,
			description: 'Defines if the duration of the service is shown',
		},
		{
			name: 'nrservicecolumns',
			type: 'number',
			required: false,
			description:
				'Defines how many columns the services should be displayed in',
		},
		{
			name: 'showtoggle',
			type: 'boolean',
			required: false,
			description: 'true if the service group can be collapsed',
		},
		{
			name: 'collapse',
			type: 'boolean',
			required: false,
			description:
				'true if the service group is shown collapsed as default (need showtoggle to be true)',
		},
		{
			name: 'enabled',
			type: 'boolean',
			required: false,
			description:
				'false if the service group should not appear on the bookingpage (only via direct link or for internal services)',
		},
		{
			name: 'showinsummary',
			type: 'boolean',
			required: false,
			description:
				'false if the selected service should not appear in the summary box',
		},
		{
			name: 'showwhencertainanswerselected',
			type: 'string',
			required: false,
			description:
				'List of services that have to be selected to show this service group. Set to -1 if the service group should be shown initially',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const serviceGroupsUpdate = {
	key: 'serviceGroupsUpdate',
	group: 'serviceGroups',
	action: 'update',
	method: 'PUT',
	path: '/api/servicegroup',
	riskLevel: 'write',
	description: 'Updates attributes of a service group',
	params: [
		{
			name: 'servicegroupid',
			type: 'number',
			required: true,
			description: 'ID of the service group that gets updated',
		},
		{
			name: 'servicegroupde',
			type: 'string',
			required: false,
			description:
				'Name of the service group in german. For other languages use servicegroupLANGUAGECODE e.g. servicegroupen',
		},
		{
			name: 'additionaltextde',
			type: 'string',
			required: false,
			description:
				'Additional information of the service group in german. For other languages use additionaltextLANGUAGECODE e.g. additionaltexten',
		},
		{
			name: 'addtextdisplaymode',
			type: 'number',
			required: false,
			description:
				'Defines the location of the additional text (0 = via Tooltip; 1 = under the name of the service group)',
		},
		{
			name: 'servicegrouptype',
			type: 'number',
			required: false,
			description:
				'Defines the service group type (0 = Service selection; 2 = Text field; 5 = location selection; 8 = Day amount selection; 9 = Number search; 10 = Minutes amount selection)',
		},
		{
			name: 'answerselection',
			type: 'number',
			required: false,
			description:
				'Selection type for services (0 = Single selection; 1 = Multi selection; 2 = list selection). Has to be -1 if servicegrouptype is not 0!',
		},
		{
			name: 'isoptional',
			type: 'boolean',
			required: false,
			description: 'Defines if a selection of a service is mandatory',
		},
		{
			name: 'showprice',
			type: 'boolean',
			required: false,
			description: 'Defines if the price of the service is shown',
		},
		{
			name: 'showduration',
			type: 'boolean',
			required: false,
			description: 'Defines if the duration of the service is shown',
		},
		{
			name: 'nrservicecolumns',
			type: 'number',
			required: false,
			description:
				'Defines how many columns the services should be displayed in',
		},
		{
			name: 'showimgfull',
			type: 'boolean',
			required: false,
			description:
				'true if the picture of the service should be shown as big as possible',
		},
		{
			name: 'showtoggle',
			type: 'boolean',
			required: false,
			description: 'true if the service group can be collapsed',
		},
		{
			name: 'collapse',
			type: 'boolean',
			required: false,
			description:
				'true if the service group is shown collapsed as default (need showtoggle to be true)',
		},
		{
			name: 'enabled',
			type: 'boolean',
			required: false,
			description:
				'false if the service group should not appear on the bookingpage (only via direct link or for internal services)',
		},
		{
			name: 'answersortorder',
			type: 'number',
			required: false,
			description:
				'Defines in which order the services are shown (0 = according to position in service; 1 = Ascending by name; 2 = Descending by name)',
		},
		{
			name: 'showinsummary',
			type: 'boolean',
			required: false,
			description:
				'false if the selected service should not appear in the summary box',
		},
		{
			name: 'showinemailsummary',
			type: 'boolean',
			required: false,
			description:
				'false if the selected service should not appear in the summary of the emails',
		},
		{
			name: 'pageidx',
			type: 'number',
			required: false,
			description:
				'If set to 1 the service group will be shown on a second service selection page. Default value is 0',
		},
		{
			name: 'displayindex',
			type: 'number',
			required: true,
			description: 'Index in which order the service group should be shown',
		},
		{
			name: 'showwhencertainanswerselected',
			type: 'string',
			required: false,
			description:
				'List of services that have to be selected to show this service group. Set to -1 if the service group should be shown initially',
		},
		{
			name: 'countrylimitation',
			type: 'string',
			required: false,
			description:
				'Languagecodes that are supported by the location lookup (servicegrouptype has to be 5)',
		},
		{
			name: 'regex',
			type: 'string',
			required: false,
			description:
				'Is a validation rule. Can be used if you want to have your location written in a certain way (servicegrouptype has to be 5)',
		},
		{
			name: 'errormsgde',
			type: 'string',
			required: false,
			description:
				"Error message, if the regex isn't valid or a wrong number on the number search is used. For other languages use errormsgLANGUAGECODE e.g. errormsgen (servicegrouptype has to be 5 or 9)",
		},
		{
			name: 'selminduration',
			type: 'number',
			required: false,
			description:
				'The interval of minutes you can switch up or down with the minute selection (servicegrouptype has to be 10)',
		},
		{
			name: 'selminprice',
			type: 'number',
			required: false,
			description:
				'The price of every minute selection interval (servicegrouptype has to be 10)',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const serviceGroupsDelete = {
	key: 'serviceGroupsDelete',
	group: 'serviceGroups',
	action: 'delete',
	method: 'DELETE',
	path: '/api/servicegroup',
	riskLevel: 'destructive',
	description:
		'Use this function if you want to delete a service group. All services that are linked to this service group will be deleted automatically as well.',
	params: [
		{
			name: 'servicegroupid',
			type: 'number',
			required: true,
			description: 'ID of the servicegroup that you want information on',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const surveyResultsList = {
	key: 'surveyResultsList',
	group: 'surveyResults',
	action: 'list',
	method: 'GET',
	path: '/api/surveyresults',
	riskLevel: 'read',
	description:
		'Returns all survey results that were received from the customers.',
	params: [
		{
			name: 'date',
			type: 'string',
			required: false,
			description: 'Date when the survey result was created',
		},
		{
			name: 'appid',
			type: 'number',
			required: false,
			description:
				'Get all survey results of the appointment with this ID (not externalid).',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const timeSlotsList = {
	key: 'timeSlotsList',
	group: 'timeSlots',
	action: 'list',
	method: 'GET',
	path: '/api/timeslots',
	riskLevel: 'read',
	description:
		'Get available time slots of a specific day or a time range.<br><br> <font color=red>Important:</font> Please pay attention that <b>some fields might be mandatory</b> to not get an empty response, <b>depending how the account is set up</b> (for example serviceid).',
	params: [
		{
			name: 'date',
			type: 'string',
			required: true,
			description:
				'Day that you want to check if there are available slots. Format: yyyy-mm-dd',
		},
		{
			name: 'rangesearch',
			type: 'number',
			required: false,
			description:
				'0 - All slots of a specific day will be displayed <br> 1 - Searches until it found a date when slots are available. Returns the number of slots that are available on a specific day (according to the account settings, the available slots may differ)',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description:
				'End date of the time range. Only works if rangesearch=1. Format: yyyy-mm-dd',
		},
		{
			name: 'serviceid',
			type: 'string',
			required: false,
			description:
				"ID(s) of the selected service(s). This parameter is required if you restrict the calendar or working times to specific services. Several service ID's can be separated with a comma (,). e.g. 45345,45346 etc.",
		},
		{
			name: 'calendarid',
			type: 'string',
			required: false,
			description:
				'ID of the calendar. Use this parameter if you want to get available time slots for a specific calendar. If this parameter is empty, available time slots for all calendars will be returned.',
		},
		{
			name: 'capacity',
			type: 'number',
			required: false,
			description:
				'Defines the capacity that is searched for, if you have capacity enabled',
		},
		{
			name: 'duration',
			type: 'number',
			required: false,
			description:
				'Appointment duration in minutes. Use this parameter if you want to use a different duration than specified for the service',
		},
		{
			name: 'cluster',
			type: 'number',
			required: false,
			description: 'Appointment cluster on (1) or off (0)',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const userMappingsList = {
	key: 'userMappingsList',
	group: 'userMappings',
	action: 'list',
	method: 'GET',
	path: '/api/usermapping',
	riskLevel: 'read',
	description:
		'Usermapping is used for the number search. Use this function to validate a searchvalue to get the according calendarids and servicegroupids',
	params: [
		{
			name: 'searchvalue',
			type: 'number',
			required: false,
			description:
				'Value that needs to be validated by the number search (use no parameter to get all usermappings)',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const userMappingsCreate = {
	key: 'userMappingsCreate',
	group: 'userMappings',
	action: 'create',
	method: 'POST',
	path: '/api/usermapping',
	riskLevel: 'write',
	description:
		'Usermapping is used for the number search. Use this function to create a new entry for the number search.',
	params: [
		{
			name: 'valuetype',
			type: 'number',
			required: false,
			description:
				'Type of the number search Values:<br> 0 = Equals <br> 1 = From - To <br> 2 = Last two digits <br> 3 = Last 3 digits <br> 5 = Last digit <br> 6 = First digit <br> 7 = First two digits <br> 8 = First three digits',
		},
		{
			name: 'value',
			type: 'number',
			required: false,
			description:
				'Value that should be matched (valuetype has to be 0, 2 or 3). If you use last x digits, only use x digits for the value.',
		},
		{
			name: 'valuefrom',
			type: 'number',
			required: false,
			description:
				'First number that works for this range (valuetype has to be 1)',
		},
		{
			name: 'valueto',
			type: 'number',
			required: false,
			description:
				'Last number that works for this range (valuetype has to be 1)',
		},
		{
			name: 'calendarid',
			type: 'string',
			required: false,
			description:
				'List of calendars that work with the searchvalue (default = -1)',
		},
		{
			name: 'servicegroupid',
			type: 'string',
			required: false,
			description:
				'List of servicegroups that work with the searchvalue (default = -1)',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const userMappingsUpdate = {
	key: 'userMappingsUpdate',
	group: 'userMappings',
	action: 'update',
	method: 'PUT',
	path: '/api/usermapping',
	riskLevel: 'write',
	description:
		'Usermapping is used for the number search. Use this function to update an existing entry for the number search.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: false,
			description: 'ID of the value that gets updated',
		},
		{
			name: 'valuetype',
			type: 'number',
			required: false,
			description:
				'Type of the number search (0 = Equals; 1 = From - To; 2 = Last two digits; 3 = Last 3 digits)',
		},
		{
			name: 'value',
			type: 'number',
			required: false,
			description:
				'Value that should be matched (valuetype has to be 0, 2 or 3). If you use last x digits, only use x digits for the value.',
		},
		{
			name: 'valuefrom',
			type: 'number',
			required: false,
			description:
				'First number that works for this range (valuetype has to be 1)',
		},
		{
			name: 'valueto',
			type: 'number',
			required: false,
			description:
				'Last number that works for this range (valuetype has to be 1)',
		},
		{
			name: 'calendarid',
			type: 'string',
			required: false,
			description:
				'List of calendars that work with the searchvalue (default = -1)',
		},
		{
			name: 'servicegroupid',
			type: 'string',
			required: false,
			description:
				'List of servicegroups that work with the searchvalue (default = -1)',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const userMappingsDelete = {
	key: 'userMappingsDelete',
	group: 'userMappings',
	action: 'delete',
	method: 'DELETE',
	path: '/api/usermapping',
	riskLevel: 'destructive',
	description:
		'Usermapping is used for the number search. Use this function to update an existing entry for the number search.',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the value that gets updated',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const vouchersList = {
	key: 'vouchersList',
	group: 'vouchers',
	action: 'list',
	method: 'GET',
	path: '/api/voucher',
	riskLevel: 'read',
	description: 'Returns a list with all vouchers',
	params: [],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const vouchersCreate = {
	key: 'vouchersCreate',
	group: 'vouchers',
	action: 'create',
	method: 'POST',
	path: '/api/voucher',
	riskLevel: 'write',
	description: 'Creates a new voucher',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'ID of the voucher',
		},
		{
			name: 'description',
			type: 'string',
			required: false,
			description: 'Description of the voucher',
		},
		{
			name: 'priceinclvat',
			type: 'number',
			required: false,
			description: 'Price including vat of the voucher',
		},
		{
			name: 'priceoriginal',
			type: 'number',
			required: false,
			description:
				'Should be the same value as in priceinclvat, important with contingent',
		},
		{
			name: 'ispercentage',
			type: 'boolean',
			required: false,
			description: 'true, if the value of the voucher is percentage',
		},
		{
			name: 'contingentmax',
			type: 'number',
			required: false,
			description: 'Max. contingent',
		},
		{
			name: 'contingentcounter',
			type: 'number',
			required: false,
			description:
				'Counter of the contingent. Typically for a new voucher the value is 0',
		},
		{
			name: 'validfrom',
			type: 'string',
			required: false,
			description:
				'Date from which date the voucher is valid. Format YYYY-MM-DD',
		},
		{
			name: 'validuntil',
			type: 'string',
			required: false,
			description: 'Date until the voucher is valid. Format YYYY-MM-DD',
		},
		{
			name: 'calendarsassigned',
			type: 'string',
			required: false,
			description: 'ID(s) of the calendar(s) for which the voucher is valid',
		},
		{
			name: 'servicesassigned',
			type: 'string',
			required: false,
			description: 'ID(s) of the service(s) for which the voucher is valid',
		},
		{
			name: 'customeremail',
			type: 'string',
			required: false,
			description:
				'E-Mail of the customer that is assigned to this voucher/contingent',
		},
		{
			name: 'sendreminder',
			type: 'boolean',
			required: false,
			description:
				'true for a reminder to be sent if complete contingent is used',
		},
		{
			name: 'onetimevalidperemail',
			type: 'boolean',
			required: false,
			description: 'true if the voucher can only be used x times for one email',
		},
		{
			name: 'validxtimes',
			type: 'number',
			required: false,
			description:
				'Number of times the voucher is usable per email, needs onetimevalidperemail to be true',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const vouchersUpdate = {
	key: 'vouchersUpdate',
	group: 'vouchers',
	action: 'update',
	method: 'PUT',
	path: '/api/voucher',
	riskLevel: 'write',
	description: 'Update an existing voucher',
	params: [
		{
			name: 'id',
			type: 'string',
			required: true,
			description: 'ID of the voucher',
		},
		{
			name: 'description',
			type: 'string',
			required: false,
			description: 'Description of the voucher',
		},
		{
			name: 'priceinclvat',
			type: 'number',
			required: false,
			description: 'Price including vat of the voucher',
		},
		{
			name: 'priceoriginal',
			type: 'number',
			required: false,
			description:
				'Should be the same value as in priceinclvat, important with contingent',
		},
		{
			name: 'ispercentage',
			type: 'boolean',
			required: false,
			description: 'true, if the value of the voucher is percentage',
		},
		{
			name: 'contingentmax',
			type: 'number',
			required: false,
			description: 'Max. contingent',
		},
		{
			name: 'contingentcounter',
			type: 'number',
			required: false,
			description:
				'Counter of the contingent. Typically for a new voucher the value is 0',
		},
		{
			name: 'validfrom',
			type: 'string',
			required: false,
			description:
				'Date from which date the voucher is valid. Format YYYY-MM-DD',
		},
		{
			name: 'validuntil',
			type: 'string',
			required: false,
			description: 'Date until the voucher is valid. Format YYYY-MM-DD',
		},
		{
			name: 'calendarsassigned',
			type: 'string',
			required: false,
			description: 'ID(s) of the calendar(s) for which the voucher is valid',
		},
		{
			name: 'servicesassigned',
			type: 'string',
			required: false,
			description: 'ID(s) of the service(s) for which the voucher is valid',
		},
		{
			name: 'customeremail',
			type: 'string',
			required: false,
			description:
				'E-Mail of the customer that is assigned to this voucher/contingent',
		},
		{
			name: 'sendreminder',
			type: 'boolean',
			required: false,
			description:
				'true for a reminder to be sent if complete contingent is used',
		},
		{
			name: 'onetimevalidperemail',
			type: 'boolean',
			required: false,
			description: 'true if the voucher can only be used x times for one email',
		},
		{
			name: 'validxtimes',
			type: 'number',
			required: false,
			description:
				'Number of times the voucher is usable per email, needs onetimevalidperemail to be true',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const vouchersDelete = {
	key: 'vouchersDelete',
	group: 'vouchers',
	action: 'delete',
	method: 'DELETE',
	path: '/api/voucher',
	riskLevel: 'destructive',
	description:
		'Use this function if you want to delete a voucher. Use one of the given parameters!',
	params: [
		{
			name: 'id',
			type: 'string',
			required: false,
			description: 'ID of the voucher that should be deleted',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimesList = {
	key: 'workingTimesList',
	group: 'workingTimes',
	action: 'list',
	method: 'GET',
	path: '/api/workingtimes',
	riskLevel: 'read',
	description: 'Get working time slots for weekdays',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'CalendarID of the calendar you need the working times for',
		},
		{
			name: 'all',
			type: 'boolean',
			required: false,
			description:
				'Use this parameter instead of calendarid, if you want the workingtimes of all calendars',
		},
		{
			name: 'join',
			type: 'number',
			required: false,
			description:
				'Set to 1 for the same information but with names instead of numbers',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const workingTimesCreate = {
	key: 'workingTimesCreate',
	group: 'workingTimes',
	action: 'create',
	method: 'POST',
	path: '/api/workingtimes',
	riskLevel: 'write',
	description: 'Creates a new working slot',
	params: [
		{
			name: 'start',
			type: 'string',
			required: true,
			description: 'Start time of the slot, e.g. 09:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description: 'End time of the slot, e.g. 17:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'weekday',
			type: 'string',
			required: true,
			description:
				'ID of the weekday 1 = Sunday, 7 = Saturday. You can add several weekdays separated by a comma e.g. 2,3,5',
		},
		{
			name: 'enable',
			type: 'number',
			required: false,
			description:
				'0 if the time slot should exist but not being considered yet',
		},
		{
			name: 'slottype',
			type: 'number',
			required: false,
			description:
				'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
		},
		{
			name: 'validwithserviceid',
			type: 'string',
			required: false,
			description: 'List of services that work with this working slot',
		},
		{
			name: 'allserviceidsrequired',
			type: 'number',
			required: false,
			description:
				'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
		},
		{
			name: 'nrapps',
			type: 'number',
			required: false,
			description:
				'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
		},
		{
			name: 'weektype',
			type: 'number',
			required: false,
			description:
				'Defines in which interval the time slot should be shown <br> 0 = Every week <br> 1 = Odd weeks <br> 2 = Even weeks <br> 3 = First occurrence in month <br> 4 = second occurrence in month <br> 5 = third occurrence in month <br> 6 = fourth occurrence in month <br> 7 = Every 3 weeks first occurrence <br> 8 = Every 3 weeks second occurrence <br> 9 = Every 3 weeks third occurrence <br> 10 = fifth occurrence in month <br> 11 = Every 4 weeks first occurrence <br> 12 = Every 4 weeks second occurrence <br> 13 = Every 4 weeks third occurrence <br> 14 = Every 4 weeks fourth occurrence',
		},
		{
			name: 'locationid',
			type: 'number',
			required: false,
			description:
				'ID of the location for this working slot if locations are used in working times',
		},
		{
			name: 'calendarintervalid',
			type: 'number',
			required: false,
			description:
				'ID of the period for this working slot if periods are used in working times',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimesUpdate = {
	key: 'workingTimesUpdate',
	group: 'workingTimes',
	action: 'update',
	method: 'PUT',
	path: '/api/workingtimes',
	riskLevel: 'write',
	description: 'Update an existing working slot',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the working time that needs to be changed',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description: 'Start time of the slot, e.g. 09:00',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description: 'End time of the slot, e.g. 17:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description: 'ID of the calendar',
		},
		{
			name: 'weekday',
			type: 'string',
			required: false,
			description:
				'ID of the weekday 1 = Sunday, 7 = Saturday. You can add several weekdays separated by a comma e.g. 2,3,5',
		},
		{
			name: 'enable',
			type: 'number',
			required: false,
			description:
				'0 if the time slot should exist but not being considered yet',
		},
		{
			name: 'slottype',
			type: 'number',
			required: false,
			description:
				'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
		},
		{
			name: 'validwithserviceid',
			type: 'string',
			required: false,
			description: 'List of services that work with this working slot',
		},
		{
			name: 'allserviceidsrequired',
			type: 'number',
			required: false,
			description:
				'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
		},
		{
			name: 'nrapps',
			type: 'number',
			required: false,
			description:
				'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
		},
		{
			name: 'weektype',
			type: 'number',
			required: false,
			description:
				'Defines in which interval the time slot should be shown <br> 0 = Every week <br> 1 = Odd weeks <br> 2 = Even weeks <br> 3 = First occurrence in month <br> 4 = second occurrence in month <br> 5 = third occurrence in month <br> 6 = fourth occurrence in month <br> 7 = Every 3 weeks first occurrence <br> 8 = Every 3 weeks second occurrence <br> 9 = Every 3 weeks third occurrence <br> 10 = fifth occurrence in month <br> 11 = Every 4 weeks first occurrence <br> 12 = Every 4 weeks second occurrence <br> 13 = Every 4 weeks third occurrence <br> 14 = Every 4 weeks fourth occurrence',
		},
		{
			name: 'locationid',
			type: 'number',
			required: false,
			description:
				'ID of the location for this working slot if locations are used in working times',
		},
		{
			name: 'calendarintervalid',
			type: 'number',
			required: false,
			description:
				'ID of the period for this working slot if periods are used in working times',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimesDelete = {
	key: 'workingTimesDelete',
	group: 'workingTimes',
	action: 'delete',
	method: 'DELETE',
	path: '/api/workingtimes',
	riskLevel: 'destructive',
	description: 'Deletes a working slot',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'id',
			type: 'number',
			required: false,
			description:
				'ID of the working time that needs to be deleted. If not provided, every working slot of the calendar will be deleted',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimeDatesList = {
	key: 'workingTimeDatesList',
	group: 'workingTimeDates',
	action: 'list',
	method: 'GET',
	path: '/api/workingtimesdate',
	riskLevel: 'read',
	description: 'Get working time slots for specific dates',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'CalendarID of the calendar you need the working times for',
		},
		{
			name: 'join',
			type: 'number',
			required: false,
			description:
				'Set to 1 for the same information but with names instead of numbers',
		},
		{
			name: 'start',
			type: 'string',
			required: false,
			description:
				'Start date from when the workingtimes should be shown. Format needs to be yyyy-mm-dd',
		},
		{
			name: 'end',
			type: 'string',
			required: false,
			description:
				'End date until the workingtimes should be shown. Needs the start parameter. Format needs to be yyyy-mm-dd',
		},
	],
	responseKind: 'array',
} as const satisfies ETerminOperation;

export const workingTimeDatesCreate = {
	key: 'workingTimeDatesCreate',
	group: 'workingTimeDates',
	action: 'create',
	method: 'POST',
	path: '/api/workingtimesdate',
	riskLevel: 'write',
	description: 'Creates a new working slot for a specific day',
	params: [
		{
			name: 'start',
			type: 'string',
			required: true,
			description: 'Start date/time of working time e.g. 2019-07-14 09:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description: 'End date/time of working time e.g. 2019-07-14 18:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description:
				'Reason of the specific working time (this is only visible internally)',
		},
		{
			name: 'slottype',
			type: 'number',
			required: false,
			description:
				'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
		},
		{
			name: 'nrapps',
			type: 'number',
			required: false,
			description:
				'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
		},
		{
			name: 'overwriteday',
			type: 'boolean',
			required: false,
			description: 'true, if the workingtime for this day should be disabled',
		},
		{
			name: 'serviceids',
			type: 'string',
			required: false,
			description: 'List of services that work with this working slot',
		},
		{
			name: 'allserviceidsrequired',
			type: 'number',
			required: false,
			description:
				'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
		},
		{
			name: 'locationid',
			type: 'number',
			required: false,
			description:
				'ID of the location for this working slot if locations are used in working times',
		},
		{
			name: 'oneoff',
			type: 'boolean',
			required: false,
			description:
				'true, if this timeslot needs a specific link (requires exactly one service for the validwithserviceid parameter)',
		},
		{
			name: 'oneoffcode',
			type: 'string',
			required: false,
			description:
				'Specific code that is used for the oneoff-link if oneoff is true',
		},
		{
			name: 'waitinglist',
			type: 'boolean',
			required: false,
			description:
				'true, if this timeslot should be filled with appointments from the waitinglist',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimeDatesUpdate = {
	key: 'workingTimeDatesUpdate',
	group: 'workingTimeDates',
	action: 'update',
	method: 'PUT',
	path: '/api/workingtimesdate',
	riskLevel: 'write',
	description: 'Update an existing working slot for a specific date',
	params: [
		{
			name: 'id',
			type: 'number',
			required: true,
			description: 'ID of the working time that needs to be changed',
		},
		{
			name: 'start',
			type: 'string',
			required: true,
			description: 'Start date/time of working time e.g. 2019-07-14 09:00',
		},
		{
			name: 'end',
			type: 'string',
			required: true,
			description: 'End date/time of working time e.g. 2019-07-14 18:00',
		},
		{
			name: 'calendarid',
			type: 'number',
			required: true,
			description: 'ID of the calendar',
		},
		{
			name: 'reason',
			type: 'string',
			required: false,
			description:
				'Reason of the specific working time (this is only visible internally)',
		},
		{
			name: 'slottype',
			type: 'number',
			required: false,
			description:
				'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
		},
		{
			name: 'nrapps',
			type: 'number',
			required: false,
			description:
				'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
		},
		{
			name: 'overwriteday',
			type: 'boolean',
			required: false,
			description: 'true, if the workingtime for this day should be disabled',
		},
		{
			name: 'serviceids',
			type: 'string',
			required: false,
			description: 'List of services that work with this working slot',
		},
		{
			name: 'allserviceidsrequired',
			type: 'number',
			required: false,
			description:
				'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
		},
		{
			name: 'locationid',
			type: 'number',
			required: false,
			description:
				'ID of the location for this working slot if locations are used in working times',
		},
		{
			name: 'oneoff',
			type: 'boolean',
			required: false,
			description:
				'true, if this timeslot needs a specific link (requires exactly one service for the validwithserviceid parameter)',
		},
		{
			name: 'oneoffcode',
			type: 'string',
			required: false,
			description:
				'Specific code that is used for the oneoff-link if oneoff is true',
		},
		{
			name: 'waitinglist',
			type: 'boolean',
			required: false,
			description:
				'true, if this timeslot should be filled with appointments from the waitinglist',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const workingTimeDatesDelete = {
	key: 'workingTimeDatesDelete',
	group: 'workingTimeDates',
	action: 'delete',
	method: 'DELETE',
	path: '/api/workingtimesdate',
	riskLevel: 'destructive',
	description:
		'Delete a working slot for a specific date. Only one of the following parameters are needed',
	params: [
		{
			name: 'calendarid',
			type: 'number',
			required: false,
			description:
				'ID of the calendar, every working slot for specific days will be deleted',
		},
		{
			name: 'id',
			type: 'number',
			required: false,
			description: 'ID of the working time that needs to be deleted',
		},
	],
	responseKind: 'object',
} as const satisfies ETerminOperation;

export const eTerminOperations = [
	anchorTimesList,
	anchorTimesCreate,
	anchorTimesUpdate,
	anchorTimesDelete,
	anchorTimeDatesList,
	anchorTimeDatesCreate,
	anchorTimeDatesUpdate,
	anchorTimeDatesDelete,
	appointmentsList,
	appointmentsCreate,
	appointmentsUpdate,
	appointmentsDelete,
	deletedAppointmentsList,
	appointmentSyncList,
	appointmentSyncCreate,
	appointmentSyncUpdate,
	appointmentSyncDelete,
	bookingPageLogsList,
	calendarsList,
	calendarsCreate,
	calendarsUpdate,
	calendarsDelete,
	calendarReturnTimesList,
	calendarReturnTimesCreate,
	calendarReturnTimesUpdate,
	calendarReturnTimesDelete,
	calendarServicesList,
	calendarServicesCreate,
	calendarServicesDelete,
	calendarNonWorkingTimesList,
	calendarNonWorkingTimesCreate,
	calendarNonWorkingTimesUpdate,
	calendarNonWorkingTimesDelete,
	contactsList,
	contactsCreate,
	contactsUpdate,
	contactsDelete,
	contactFrequenciesList,
	contactFrequenciesCreate,
	contactServicesList,
	contactServicesCreate,
	messageLogsList,
	ratingsList,
	servicesList,
	servicesCreate,
	servicesUpdate,
	servicesDelete,
	serviceCalendarsList,
	serviceGroupsList,
	serviceGroupsCreate,
	serviceGroupsUpdate,
	serviceGroupsDelete,
	surveyResultsList,
	timeSlotsList,
	userMappingsList,
	userMappingsCreate,
	userMappingsUpdate,
	userMappingsDelete,
	vouchersList,
	vouchersCreate,
	vouchersUpdate,
	vouchersDelete,
	workingTimesList,
	workingTimesCreate,
	workingTimesUpdate,
	workingTimesDelete,
	workingTimeDatesList,
	workingTimeDatesCreate,
	workingTimeDatesUpdate,
	workingTimeDatesDelete,
] as const;

export type ETerminOperationKey = (typeof eTerminOperations)[number]['key'];
