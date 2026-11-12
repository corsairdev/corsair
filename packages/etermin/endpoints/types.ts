import { z } from 'zod';
import { eTerminOperations } from '../operations';

/** A documented eTermin JSON object has provider-defined fields that may vary by account. */
export const ETerminRecordSchema = z.object({}).passthrough();
const ETerminOpaqueResponseSchema = z.union([
	z.undefined(),
	ETerminRecordSchema,
	z.array(ETerminRecordSchema),
]);

/**
 * eTermin documents language-suffixed field names (for example `servicefr`)
 * instead of enumerating every account language. Keep schemas strict for all
 * other keys while accepting those documented string-valued parameters.
 */
function withLanguageFields<T extends z.ZodObject<z.ZodRawShape>>(
	schema: T,
	fieldName: RegExp,
) {
	return schema.catchall(z.string()).superRefine((value, context) => {
		for (const key of Object.keys(value)) {
			if (!(key in schema.shape) && !fieldName.test(key)) {
				context.addIssue({
					code: 'custom',
					message: `Unrecognized input field: ${key}`,
					path: [key],
				});
			}
		}
	});
}

const serviceLanguageField =
	/^(service|info|emailtxt|pricesuffix|capseltext)[a-z]{2,}$/;
const serviceGroupLanguageField = /^(servicegroup|additionaltext)[a-z]{2,}$/;
const serviceGroupUpdateLanguageField =
	/^(servicegroup|additionaltext|errormsg)[a-z]{2,}$/;

export const ETerminEndpointInputSchemas = {
	anchorTimesList: z
		.object({
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar. Use this parameter if you want to get existing anchortimes for a specific calendar.',
				),
		})
		.strict(),
	anchorTimesCreate: z
		.object({
			calendarid: z
				.number()
				.int()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			starttime: z.string().describe('Time of the anchor, e.g. 17:00.'),
			weekday: z
				.string()
				.describe('ID of the weekday 1 = Sunday, 7 = Saturday.'),
			ignoreonceappbooked: z
				.boolean()
				.describe(
					'If true the anchortime will be ignored once an appointment is booked this day.',
				),
		})
		.strict(),
	anchorTimesUpdate: z
		.object({
			id: z.number().int().describe('ID of the anchortime.'),
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			starttime: z
				.string()
				.optional()
				.describe('Time of the anchor, e.g. 17:00.'),
			weekday: z
				.number()
				.int()
				.optional()
				.describe('ID of the weekday 1 = Sunday, 7 = Saturday.'),
			ignoreonceappbooked: z
				.boolean()
				.optional()
				.describe(
					'If true the anchortime will be ignored once an appointment is booked this day.',
				),
		})
		.strict(),
	anchorTimesDelete: z
		.object({
			id: z.number().int().describe('ID of the anchortime.'),
		})
		.strict(),
	anchorTimeDatesList: z
		.object({
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar. Use this parameter if you want to get existing anchortimes for a specific calendar.',
				),
		})
		.strict(),
	anchorTimeDatesCreate: z
		.object({
			calendarid: z
				.number()
				.int()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			startdate: z
				.string()
				.describe(
					'Date and time of the anchortime. Format is yyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			ignoreonceappbooked: z
				.boolean()
				.describe(
					'If true the anchortime will be ignored once an appointment is booked this day.',
				),
			reason: z
				.string()
				.optional()
				.describe('Reason why this anchortime is created.'),
		})
		.strict(),
	anchorTimeDatesUpdate: z
		.object({
			id: z.number().int().describe('ID of the anchortime.'),
			calendarid: z
				.number()
				.int()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			startdate: z
				.string()
				.describe(
					'Date and time of the anchortime. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			ignoreonceappbooked: z
				.boolean()
				.describe(
					'If true the anchortime will be ignored once an appointment is booked this day',
				),
			reason: z
				.string()
				.optional()
				.describe('Reason why this anchortime is created'),
		})
		.strict(),
	anchorTimeDatesDelete: z
		.object({
			id: z.number().int().describe('ID of the anchortime by date.'),
		})
		.strict(),
	appointmentsList: z
		.object({
			appid: z
				.number()
				.optional()
				.describe('ID of an appointment. (relates to the ID)'),
			id: z
				.string()
				.optional()
				.describe('ID of an appointment. (relates to the ExternalID)'),
			start: z
				.string()
				.optional()
				.describe(
					'Start date of the appointments. Format yyyy-mm-dd. It will return a list with all appointments that are between "start" and "end".',
				),
			end: z
				.string()
				.optional()
				.describe(
					'End date of the appointments. Format yyyy-mm-dd. It will return a list with all appointments that are between "start" and "end".',
				),
			bycreationdate: z
				.boolean()
				.optional()
				.describe(
					'Changes the start and end parameters to look for the creation date instead of the date, the appointment takes place',
				),
			calendarid: z
				.string()
				.optional()
				.describe(
					'IDs of the calendars that you want to get appointments from, you can separate multiple calendars with a ","',
				),
			wl: z
				.boolean()
				.optional()
				.describe(
					'Set to 1 if you want to get all appointments on the Waiting List (start and end parameters required)',
				),
			pbl: z
				.boolean()
				.optional()
				.describe(
					'Set to 1 if you want to get all appointments on the Reservation List (start and end parameters not required)',
				),
			cid: z
				.number()
				.int()
				.optional()
				.describe(
					'Use a customer ID to see all appointments that are related to this customer. (start and end parameters not required)',
				),
			email: z
				.string()
				.optional()
				.describe(
					'Use an email address to see all appointments that are related to this email. (start and end parameters required)',
				),
			limited: z
				.boolean()
				.optional()
				.describe(
					'Reduces the amount of information that the response have. Set to 1 if you want basic information about a lot of appointments.',
				),
			manualconfirmed: z
				.boolean()
				.optional()
				.describe(
					'If set to 0 shows all appointments in the specified timeframe (start and end) that are not confirmed yet',
				),
			noholidays: z
				.boolean()
				.optional()
				.describe(
					'Only shows appointments that are no holidays and not blocked appointments.',
				),
			noholidays2: z
				.boolean()
				.optional()
				.describe(
					'Only shows appointments that are no holidays. (bookingtype <> "Holiday")',
				),
		})
		.strict()
		.refine(
			(value) => Object.values(value).some((entry) => entry !== undefined),
			{ message: 'eTermin requires at least one appointment filter.' },
		),
	appointmentsCreate: z
		.object({
			start: z
				.string()
				.describe(
					'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			end: z
				.string()
				.describe(
					'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			calendarid: z
				.number()
				.int()
				.describe(
					"ID of the calendar. Use the 'Calendar - Get calendar details' function to get a list with all available calendars",
				),
			calendarname: z
				.string()
				.optional()
				.describe('Name of the calendar (needed for Webpush)'),
			services: z
				.string()
				.optional()
				.describe(
					"ID of the service. Use the 'Service - Get service details' function to get a list with all available services. To use multiple services use a comma (,) to seperate the IDs",
				),
			servicestext: z.string().optional().describe('Name of the services'),
			servicesinclsgtext: z
				.string()
				.optional()
				.describe('Name of the services including the service groups'),
			servicesabb: z
				.string()
				.optional()
				.describe('Abbreviation of the services'),
			capacity: z
				.number()
				.int()
				.optional()
				.describe('Defines the capacity of the appointment'),
			capused: z
				.boolean()
				.optional()
				.describe(
					'true if the capacity of the appointment needs to be checked',
				),
			capmaxused: z
				.number()
				.int()
				.optional()
				.describe("Maximum capacity that can't be exceeded"),
			location: z.string().optional().describe('Location of the appointment'),
			bookingtype: z
				.string()
				.optional()
				.describe('Information about how the appointment is booked'),
			bookingurl: z
				.string()
				.optional()
				.describe('Information from which URL the appointment got booked'),
			checkexist: z
				.boolean()
				.optional()
				.describe(
					'Checks if the appointment start/end time is available (1 = yes, 0 = no). May not work with multiple capacity',
				),
			manualconfirmed: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 0 to have the appointment manually confirmed by the appoinment provider',
				),
			confirmappointment: z
				.number()
				.int()
				.optional()
				.describe(
					"Set to 1 to have the appointment manually confirmed by the booker, won't work if manualconfirmed is set to 0",
				),
			confirmtime: z
				.number()
				.int()
				.optional()
				.describe(
					'Time in minutes that the booker is able to confirm the appointment before it gets deleted',
				),
			language: z
				.string()
				.optional()
				.describe(
					'Languagecode, defines in which language the emails are sent',
				),
			sendemail: z
				.boolean()
				.optional()
				.describe(
					'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no)',
				),
			sms: z
				.boolean()
				.optional()
				.describe(
					'Send a confirmation sms to the phone number that was specified in the phone field (1 = yes, 0 = no).',
				),
			notificationmsg: z
				.boolean()
				.optional()
				.describe(
					'Send an information email to the appointment provider (1 = yes, 0 = no).',
				),
			sync: z
				.boolean()
				.optional()
				.describe(
					'True if the appointment should be synchronized with external calendars (1 = yes, 0 = no).',
				),
			calselid: z
				.number()
				.int()
				.optional()
				.describe(
					'Use this parameter with the value -1 to also use the Calendar Linking function (also requires a valid value for the parameter services)',
				),
			appointmentreminderhours: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the first reminder is sent in hours (needs to be a negative value)',
				),
			appointmentreminderhours2: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the second reminder is sent in hours (needs to be a negative value)',
				),
			canceldeadline: z
				.number()
				.int()
				.optional()
				.describe(
					'Minutes how long before the startdate the appointment can be cancelled',
				),
			recurrencerule: z
				.string()
				.optional()
				.describe(
					'Recurrence rule. e.g. DTSTART:{20171126T083000Z} DTEND:{20171126T090000Z} RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;',
				),
			recurrenceparentid: z
				.string()
				.optional()
				.describe('ID of the parent recurring appointment'),
			pricegross: z
				.number()
				.int()
				.optional()
				.describe('Price including vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			pricenet: z
				.number()
				.int()
				.optional()
				.describe('Price excluding vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			vat: z
				.number()
				.int()
				.optional()
				.describe('Vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			salutation: z.string().optional().describe('Salutation of the person'),
			title: z.string().optional().describe('Title of the person'),
			lastname: z.string().optional().describe('Lastname of the person'),
			firstname: z.string().optional().describe('Firstname of the person'),
			email: z.string().optional().describe('E-Mail of the person'),
			phone: z.string().optional().describe('Phone of the person'),
			company: z
				.string()
				.optional()
				.describe(
					'Company of the person (make sure this field exists in your account)',
				),
			notes: z.string().optional().describe('Appointment notes'),
			street: z
				.string()
				.optional()
				.describe('Street of the person that booked appointment'),
			zip: z
				.string()
				.optional()
				.describe('Zip of the person that booked appointment'),
			city: z
				.string()
				.optional()
				.describe('City of the person that booked appointment'),
			customernumber: z
				.string()
				.optional()
				.describe('ID of the person that booked appointment'),
			birthday: z
				.string()
				.optional()
				.describe('Date of birth of the person that booked appointment'),
			additional1: z
				.string()
				.optional()
				.describe('Additional appointment field 1'),
			additional2: z
				.string()
				.optional()
				.describe('Additional appointment field 2'),
			additional3: z
				.string()
				.optional()
				.describe('Additional appointment field 3'),
			additional4: z
				.string()
				.optional()
				.describe('Additional appointment field 4'),
			additional5: z
				.string()
				.optional()
				.describe('Additional appointment field 5'),
			additional6: z
				.string()
				.optional()
				.describe('Additional appointment field 6'),
			additional7: z
				.string()
				.optional()
				.describe('Additional appointment field 7'),
			additional8: z
				.string()
				.optional()
				.describe('Additional appointment field 8'),
			additional9: z
				.string()
				.optional()
				.describe('Additional appointment field 9'),
			additional10: z
				.string()
				.optional()
				.describe('Additional appointment field 10'),
			additional11: z
				.string()
				.optional()
				.describe('Additional appointment field 11'),
			additional12: z
				.string()
				.optional()
				.describe('Additional appointment field 12'),
			additional13: z
				.string()
				.optional()
				.describe('Additional appointment field 13'),
			additional14: z
				.string()
				.optional()
				.describe('Additional appointment field 14'),
			additional15: z
				.string()
				.optional()
				.describe('Additional appointment field 15'),
			additional16: z
				.string()
				.optional()
				.describe('Additional appointment field 16'),
			additional17: z
				.string()
				.optional()
				.describe('Additional appointment field 17'),
			additional18: z
				.string()
				.optional()
				.describe('Additional appointment field 18'),
			additional19: z
				.string()
				.optional()
				.describe('Additional appointment field 19'),
			additional20: z
				.string()
				.optional()
				.describe('Additional appointment field 20'),
			agbaccepted: z
				.boolean()
				.optional()
				.describe('true if customer accepted the terms of service'),
			dataprivacyaccepted: z
				.boolean()
				.optional()
				.describe('true if customer accepted the privacy terms'),
			feedbackpermissionaccepted: z
				.boolean()
				.optional()
				.describe('true if the customer should get a feedback mail'),
			newsletter: z
				.boolean()
				.optional()
				.describe('true if the customer accepted to get newsletters'),
			bookerinfo: z
				.string()
				.optional()
				.describe(
					'Parameter that includes information for the notification message to the appointment provider',
				),
			emailm: z
				.number()
				.int()
				.optional()
				.describe('Checks if there is an email, if set to 1'),
			lnm: z
				.number()
				.int()
				.optional()
				.describe('Checks if there is a lastname, if set to 1'),
			blacklist: z
				.number()
				.int()
				.optional()
				.describe('Checks if the email is on the blacklist, if set to 1'),
		})
		.strict(),
	appointmentsUpdate: z
		.object({
			id: z
				.string()
				.describe('External ID of the appointment that you want to modify.'),
			start: z
				.string()
				.optional()
				.describe(
					'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			end: z
				.string()
				.optional()
				.describe(
					'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			calendarid: z.number().int().optional().describe('ID of the calendar.'),
			calendarname: z
				.string()
				.optional()
				.describe('Name of the calendar (needed for Webpush)'),
			services: z
				.string()
				.optional()
				.describe(
					"ID of the service. Use the 'Service - Get service details' function to get a list with all available services. To use multiple services use a comma (,) to seperate the IDs",
				),
			servicestext: z.string().optional().describe('Name of the services'),
			servicesinclsgtext: z
				.string()
				.optional()
				.describe('Name of the services including the service groups'),
			servicesabb: z
				.string()
				.optional()
				.describe('Abbreviation of the services'),
			capacity: z
				.number()
				.int()
				.optional()
				.describe('Defines the capacity of the appointment'),
			location: z.string().optional().describe('Location of the appointment'),
			manualconfirmed: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 0 to have the appointment manually confirmed by the appoinment provider, set to 1 if the appointment got confirmed',
				),
			sendemail: z
				.boolean()
				.optional()
				.describe(
					'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no).',
				),
			msgtype: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the template that is sent to the customer with the API call',
				),
			sendsms: z
				.boolean()
				.optional()
				.describe(
					'Send a confirmation SMS to the phone number that was specified in the phone parameter (1 = yes, 0 = no).',
				),
			msgtypesms: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the template that is sent to the customer via SMS with the API call (required to send a SMS)',
				),
			notificationmsg: z
				.boolean()
				.optional()
				.describe(
					'Send an information email to the appointment provider (1 = yes, 0 = no).',
				),
			sync: z
				.boolean()
				.optional()
				.describe(
					'True if the appointment should be synchronized with external calendars (1 = yes, 0 = no).',
				),
			appointmentreminderhours: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the first reminder is sent in hours (needs to be a negative value)',
				),
			appointmentreminderhours2: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the second reminder is sent in hours (needs to be a negative value)',
				),
			canceldeadline: z
				.number()
				.int()
				.optional()
				.describe(
					'Minutes how long before the startdate the appointment can be cancelled',
				),
			recurrencerule: z
				.string()
				.optional()
				.describe(
					'Recurrence rule. e.g. DTSTART:20171126T083000Z DTEND:20181126T090000Z RRULE:FREQ=WEEKLY;INTERVAL=1;BYDAY=WE;',
				),
			pricegross: z
				.number()
				.int()
				.optional()
				.describe('Price including vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			pricenet: z
				.number()
				.int()
				.optional()
				.describe('Price excluding vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			vat: z
				.number()
				.int()
				.optional()
				.describe('Vat multiplied by 100 (e.g. 18.50€ = 1850)'),
			linkedappidmanual: z
				.number()
				.int()
				.optional()
				.describe(
					'AppID of the linked app if the calendar linking should be applied after two appointments are booked. Keep in mind to update the second appointment aswell',
				),
			salutation: z.string().optional().describe('Salutation of the person.'),
			title: z.string().optional().describe('Title of the person.'),
			lastname: z.string().optional().describe('Lastname of the person.'),
			firstname: z.string().optional().describe('Firstname of the person.'),
			email: z.string().optional().describe('E-Mail of the person.'),
			phone: z.string().optional().describe('Phone of the person.'),
			company: z
				.string()
				.optional()
				.describe(
					'Company of the person (make sure this field exists in your account)',
				),
			notes: z.string().optional().describe('Appointment notes.'),
			street: z.string().optional().describe('Street.'),
			zip: z.string().optional().describe('Zip.'),
			city: z.string().optional().describe('City.'),
			customernumber: z
				.string()
				.optional()
				.describe('ID of the person that booked appointment.'),
			additional1: z
				.string()
				.optional()
				.describe('Additional appointment field 1.'),
			additional2: z
				.string()
				.optional()
				.describe('Additional appointment field 2.'),
			additional3: z
				.string()
				.optional()
				.describe('Additional appointment field 3.'),
			additional4: z
				.string()
				.optional()
				.describe('Additional appointment field 4.'),
			additional5: z
				.string()
				.optional()
				.describe('Additional appointment field 5.'),
			additional6: z
				.string()
				.optional()
				.describe('Additional appointment field 6.'),
			additional7: z
				.string()
				.optional()
				.describe('Additional appointment field 7.'),
			additional8: z
				.string()
				.optional()
				.describe('Additional appointment field 8.'),
			additional9: z
				.string()
				.optional()
				.describe('Additional appointment field 9.'),
			additional10: z
				.string()
				.optional()
				.describe('Additional appointment field 10.'),
			additional11: z
				.string()
				.optional()
				.describe('Additional appointment field 11.'),
			additional12: z
				.string()
				.optional()
				.describe('Additional appointment field 12.'),
			additional13: z
				.string()
				.optional()
				.describe('Additional appointment field 13.'),
			additional14: z
				.string()
				.optional()
				.describe('Additional appointment field 14.'),
			additional15: z
				.string()
				.optional()
				.describe('Additional appointment field 15.'),
			additional16: z
				.string()
				.optional()
				.describe('Additional appointment field 16.'),
			additional17: z
				.string()
				.optional()
				.describe('Additional appointment field 17.'),
			additional18: z
				.string()
				.optional()
				.describe('Additional appointment field 18.'),
			additional19: z
				.string()
				.optional()
				.describe('Additional appointment field 19.'),
			additional20: z
				.string()
				.optional()
				.describe('Additional appointment field 20.'),
		})
		.strict(),
	appointmentsDelete: z
		.object({
			appid: z
				.number()
				.optional()
				.describe('AppID of the appointment (relates to the ID)'),
			id: z
				.string()
				.optional()
				.describe(
					'ID of the appointment, <b>use externalid instead, if you use the parameter sync=1 or sendemail=1</b> (relates to the ExternalID)',
				),
			externalid: z
				.string()
				.optional()
				.describe(
					'External ID of the appointment, required when sync or sendemail is used.',
				),
			start: z.string().optional().describe('Start date of the appointments.'),
			end: z.string().optional().describe('End date of the appointments.'),
			sync: z
				.boolean()
				.optional()
				.describe(
					'True if the appointment should be synchronized with external calendars (use externalid instead of id Parameter)',
				),
			sendemail: z
				.boolean()
				.optional()
				.describe(
					'True if an email should be sent to the customer (use externalid instead of id Parameter)',
				),
			msgtype: z
				.number()
				.optional()
				.describe('Defines which template should be sent'),
		})
		.strict()
		.refine(
			(value) =>
				value.appid !== undefined ||
				value.id !== undefined ||
				value.externalid !== undefined ||
				(value.start !== undefined && value.end !== undefined),
			{
				message:
					'Provide appid, id, externalid, or both start and end to delete appointments.',
			},
		),
	deletedAppointmentsList: z
		.object({
			start: z
				.string()
				.optional()
				.describe(
					'Start day when appointment(s) got deleted. Format: yyyy-mm-dd. It will return a list with all appointments that are between start and end',
				),
			end: z
				.string()
				.optional()
				.describe(
					'End day when appointment(s) got deleted. Format: yyyy-mm-dd. It will return a list with all appointments there are between start and end',
				),
			id: z
				.string()
				.optional()
				.describe(
					'External ID of an appointment, it returns only the information of the specific appointment. Start and end parameters are getting ignored if used',
				),
		})
		.strict(),
	appointmentSyncList: z
		.object({
			synctoken: z
				.number()
				.describe(
					'SyncToken. If you start the synchronization the first time, please use 1. eTermin will return a (new) SyncToken after each call. This value can be found in the header. Please use then the new SnycToken when you call the api function again.',
				),
		})
		.strict(),
	appointmentSyncCreate: z
		.object({
			appointmentid: z.string().describe('ID of the appointment'),
			start: z
				.string()
				.describe(
					'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			end: z
				.string()
				.describe(
					'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			startutc: z
				.string()
				.describe(
					'Start date and time(utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			endutc: z
				.string()
				.describe(
					'End date and time (utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			calendarid: z.number().int().describe('ID of the calendar'),
			summary: z.string().describe('Title (subject) of the appointment'),
			description: z.string().describe('Body text of the appointment'),
			email: z.string().optional().describe('E-Mail'),
			recurrencerule: z.string().optional().describe('Recurrence rule'),
			recurrenceparentid: z
				.string()
				.optional()
				.describe('ID of the parent recurring appointment'),
			sequence: z
				.string()
				.optional()
				.describe(
					'Sequence of the recurring appointment. Leave it empty if it is not an recurring appointment',
				),
			location: z.string().optional().describe('Location'),
			sendemail: z
				.boolean()
				.optional()
				.describe(
					'Send a confirmation email to the adress that was specified in the email parameter (1 = yes, 0 = no)',
				),
		})
		.strict(),
	appointmentSyncUpdate: z
		.object({
			appointmentid: z.string().describe('ID of the appointment'),
			start: z
				.string()
				.describe(
					'Start date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			end: z
				.string()
				.describe(
					'End date and time of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			startutc: z
				.string()
				.describe(
					'Start date and time(utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			endutc: z
				.string()
				.describe(
					'End date and time (utc) of the appointment. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 19:00',
				),
			calendarid: z.number().int().describe('ID of the calendar'),
			summary: z.string().describe('Title (subject) of the appointment'),
			description: z.string().describe('Body text of the appointment'),
			email: z.string().optional().describe('E-Mail'),
			recurrencerule: z.string().optional().describe('Recurrence rule'),
			recurrenceparentid: z
				.string()
				.optional()
				.describe('ID if the parent recurring appointment'),
			sequence: z
				.string()
				.optional()
				.describe(
					'Sequence of the recurring appointment. Leave it empty if it is not an recurring appointment',
				),
			location: z.string().optional().describe('Location'),
		})
		.strict(),
	appointmentSyncDelete: z
		.object({
			appointmentid: z.string().optional().describe('ID of the appointment'),
			start: z.string().optional().describe('Start date of the appointments.'),
			end: z.string().optional().describe('End date of the appointments.'),
		})
		.strict(),
	bookingPageLogsList: z
		.object({
			datefrom: z
				.string()
				.describe('Start date of the requests. Format: yyyy-mm-dd.'),
			summaryonly: z
				.boolean()
				.optional()
				.describe(
					'Set to 1 to only get a summary of all requests, not every single request.',
				),
		})
		.strict(),
	calendarsList: z
		.object({
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar, if you only need to get the details of a single calendar',
				),
		})
		.strict(),
	calendarsCreate: z.object({}).strict(),
	calendarsUpdate: z
		.object({
			id: z.number().int().describe('ID of the calendar'),
			calendarname: z
				.string()
				.optional()
				.describe('Name of the calendar. This name is used for all languages'),
			descriptionlanguagecode: z
				.string()
				.optional()
				.describe(
					'e.g. descriptionde adds additional information for this calendar in German language. descriptionen in English etc.',
				),
			descriptiondisplaytype: z
				.number()
				.int()
				.optional()
				.describe(
					'defines if the description is shown on the bookingpage <br> 0 = not shown<br> 1 = shown under calendar name<br> 2 = shown as tooltip',
				),
			enablecapacity: z
				.boolean()
				.optional()
				.describe('Several appointments can be booked at the same time'),
			maxcapacity: z
				.number()
				.int()
				.optional()
				.describe(
					'Maximum capacity of appointments that can be booked at the same time',
				),
			differentlocation: z
				.boolean()
				.optional()
				.describe(
					'The location of the calendar is different than the main location',
				),
			name: z
				.string()
				.optional()
				.describe('Name of the different company name'),
			street: z.string().optional().describe('Street'),
			zip: z.string().optional().describe('ZIP'),
			city: z.string().optional().describe('City'),
			country: z.string().optional().describe('Country'),
			telephone: z.string().optional().describe('Telephone'),
			mobilephone: z.string().optional().describe('MobilePhone'),
			emaillocation: z.string().optional().describe('Email'),
			web: z.string().optional().describe('Internet address'),
			completeappointmentwithinopeninghours: z
				.boolean()
				.optional()
				.describe(
					'If you have configured services where free, idle or down times between appointments occur, you can define whether these should be within the defined available times.',
				),
			smsnotification: z
				.boolean()
				.optional()
				.describe(
					'Employee will be informed by SMS if an appointment was booked',
				),
			smsphonenumber: z.string().optional().describe('Number of the phone'),
			smstimespanhours: z
				.number()
				.optional()
				.describe('Threshold (in hours) if SMS should be sent'),
			calendartype: z
				.boolean()
				.optional()
				.describe('Main calendar (0) or sub calendar (1)'),
			limittoduration: z
				.number()
				.optional()
				.describe(
					'Calendar can only handle appointments that have a certain length (defined in maxduration)',
				),
			maxduration: z
				.number()
				.optional()
				.describe('Maximum appointment duration (minutes)'),
			waitingnr: z.boolean().optional().describe('Calculate waiting number'),
			wnprefix: z.string().optional().describe('Prefix of the waiting number'),
			wnstartnr: z
				.number()
				.optional()
				.describe('Start number of the waiting number'),
		})
		.strict(),
	calendarsDelete: z
		.object({
			id: z.string().describe('ID of the calendar'),
		})
		.strict(),
	calendarReturnTimesList: z
		.object({
			calendarid: z.number().int().describe('ID of the calendar.'),
		})
		.strict(),
	calendarReturnTimesCreate: z
		.object({
			calendarid: z
				.number()
				.int()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			starttime: z
				.string()
				.describe('Start time of the return time. Format: HH:MM e.g. 18:00'),
			endtime: z
				.string()
				.describe('End time of the return time. Format: HH:MM e.g. 18:00'),
			weekdayidx: z
				.number()
				.int()
				.describe('ID of the weekday 1=Sunday, 7 = Saturday.'),
			newday: z
				.boolean()
				.describe(
					'If true the return time will end on the next day. Use this if you have a return time over midnight.',
				),
		})
		.strict(),
	calendarReturnTimesUpdate: z
		.object({
			id: z.number().int().describe('ID of the return time.'),
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			starttime: z
				.string()
				.optional()
				.describe('Start time of the return time. Format: HH:MM e.g. 18:00'),
			endtime: z
				.string()
				.optional()
				.describe('End time of the return time. Format: HH:MM e.g. 18:00'),
			weekdayidx: z
				.number()
				.int()
				.optional()
				.describe('ID of the weekday 1=Sunday, 7 = Saturday.'),
			newday: z
				.boolean()
				.optional()
				.describe(
					'If true the return time will end on the next day. Use this if you have a return time over midnight.',
				),
		})
		.strict(),
	calendarReturnTimesDelete: z
		.object({
			id: z.number().int().describe('ID of the return time.'),
		})
		.strict(),
	calendarServicesList: z
		.object({
			calendarid: z
				.string()
				.optional()
				.describe('ID of the calendar you want the service assignments'),
		})
		.strict(),
	calendarServicesCreate: z
		.object({
			calendarid: z.string().describe('ID of the calendar'),
			serviceid: z.string().describe('ID of the service'),
		})
		.strict(),
	calendarServicesDelete: z
		.object({
			id: z.string().describe('ID of the calendar service assignment'),
		})
		.strict(),
	calendarNonWorkingTimesList: z
		.object({
			calendarid: z.number().int().describe('ID of the calendar.'),
		})
		.strict(),
	calendarNonWorkingTimesCreate: z
		.object({
			appcalendarid: z
				.number()
				.int()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			startdate: z
				.string()
				.describe(
					'Start time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			enddate: z
				.string()
				.describe(
					'End time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			reason: z.string().optional().describe('Reason or note for the absence.'),
			nwtype: z
				.boolean()
				.optional()
				.describe('Indicates if the absence is dynamic.'),
			dynamicdays: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days for the dynamic absence to begin (nwtype has to be 1).',
				),
			dynamicdaysduration: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days for the dynamic absence to last (nwtype has to be 1).',
				),
		})
		.strict(),
	calendarNonWorkingTimesUpdate: z
		.object({
			id: z.number().int().describe('ID of the absence.'),
			appcalendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar. Use the "Calendar - Get calendar details" function to get a list with all available calendars.',
				),
			startdate: z
				.string()
				.optional()
				.describe(
					'Start time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			enddate: z
				.string()
				.optional()
				.describe(
					'End time of the absence. Format: yyyy-mm-dd HH:MM e.g. 2017-10-24 18:00',
				),
			reason: z.string().optional().describe('Reason or note for the absence.'),
			nwtype: z
				.boolean()
				.optional()
				.describe('Indicates if the absence is dynamic.'),
			dynamicdays: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of days for the dynamic absence (nwtype has to be 1).',
				),
		})
		.strict(),
	calendarNonWorkingTimesDelete: z
		.object({
			id: z.number().int().describe('ID of the absence.'),
		})
		.strict(),
	contactsList: z
		.object({
			email: z.string().optional().describe('E-Mail of the contact'),
			id: z.string().optional().describe('ExternalID of the contact'),
			cid: z.string().optional().describe('CID of the contact'),
			creationdate: z
				.string()
				.optional()
				.describe('Displays all contacts that were created on this date'),
			creationdateall: z
				.string()
				.optional()
				.describe('Displays all contacts that were created since this date'),
		})
		.strict(),
	contactsCreate: z
		.object({
			updatewhenexistsgdt: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 1 to check if the contact is already existing. If so the existing contact gets updated. Needs email or firstname, lastname, birthday.',
				),
			salutation: z.string().optional().describe('Salutation of the person.'),
			title: z.string().optional().describe('Title of the person.'),
			lastname: z.string().optional().describe('Lastname of the person.'),
			firstname: z.string().optional().describe('Firstname of the person.'),
			birthday: z.string().optional().describe('Birthday of the person.'),
			email: z.string().optional().describe('E-Mail of the person.'),
			phone: z.string().optional().describe('Phone of the person.'),
			company: z
				.string()
				.optional()
				.describe(
					'Company of the person (make sure this field exists in your account)',
				),
			street: z.string().optional().describe('Street of the person.'),
			zip: z.string().optional().describe('Zip of the person.'),
			city: z.string().optional().describe('City of the person.'),
			state: z.string().optional().describe('State of the person.'),
			country: z.string().optional().describe('Country of the person.'),
			customernumber: z.string().optional().describe('ID of the person.'),
			loginid: z
				.string()
				.optional()
				.describe(
					'Sets the loginID for the contact (if Login is used on Bookingpage).',
				),
			password: z
				.string()
				.optional()
				.describe('Sets the initial password for the contact.'),
			newsletter: z
				.boolean()
				.optional()
				.describe('Opts the contact into the newsletter.'),
			additional1: z
				.string()
				.optional()
				.describe('Additional appointment field 1.'),
			additional2: z
				.string()
				.optional()
				.describe('Additional appointment field 2.'),
			additional3: z
				.string()
				.optional()
				.describe('Additional appointment field 3.'),
			additional4: z
				.string()
				.optional()
				.describe('Additional appointment field 4.'),
			additional5: z
				.string()
				.optional()
				.describe('Additional appointment field 5.'),
			additional6: z
				.string()
				.optional()
				.describe('Additional appointment field 6.'),
			additional7: z
				.string()
				.optional()
				.describe('Additional appointment field 7.'),
			additional8: z
				.string()
				.optional()
				.describe('Additional appointment field 8.'),
			additional9: z
				.string()
				.optional()
				.describe('Additional appointment field 9.'),
			additional10: z
				.string()
				.optional()
				.describe('Additional appointment field 10.'),
			additional11: z
				.string()
				.optional()
				.describe('Additional appointment field 11.'),
			additional12: z
				.string()
				.optional()
				.describe('Additional appointment field 12.'),
			additional13: z
				.string()
				.optional()
				.describe('Additional appointment field 13.'),
			additional14: z
				.string()
				.optional()
				.describe('Additional appointment field 14.'),
			additional15: z
				.string()
				.optional()
				.describe('Additional appointment field 15.'),
			additional16: z
				.string()
				.optional()
				.describe('Additional appointment field 16.'),
			additional17: z
				.string()
				.optional()
				.describe('Additional appointment field 17.'),
			additional18: z
				.string()
				.optional()
				.describe('Additional appointment field 18.'),
			additional19: z
				.string()
				.optional()
				.describe('Additional appointment field 19.'),
			additional20: z
				.string()
				.optional()
				.describe('Additional appointment field 20.'),
		})
		.strict(),
	contactsUpdate: z
		.object({
			salutation: z.string().optional().describe('Salutation of the person.'),
			title: z.string().optional().describe('Title of the person.'),
			lastname: z.string().optional().describe('Lastname of the person.'),
			birthday: z.string().optional().describe('Birthday of the person.'),
			email: z.string().optional().describe('E-Mail of the person.'),
			phone: z.string().optional().describe('Phone of the person.'),
			company: z
				.string()
				.optional()
				.describe(
					'Company of the person (make sure this field exists in your account)',
				),
			street: z.string().optional().describe('Street of the person.'),
			zip: z.string().optional().describe('Zip of the person.'),
			city: z.string().optional().describe('City of the person.'),
			state: z.string().optional().describe('State of the person.'),
			country: z.string().optional().describe('Country of the person.'),
			customernumber: z.string().optional().describe('ID of the person.'),
			loginid: z
				.string()
				.optional()
				.describe(
					'Sets the loginID for the contact (if Login is used on Bookingpage).',
				),
			password: z
				.string()
				.optional()
				.describe('Sets the initial password for the contact.'),
			newsletter: z
				.boolean()
				.optional()
				.describe('Opts the contact into the newsletter.'),
			additional1: z
				.string()
				.optional()
				.describe('Additional appointment field 1.'),
			additional2: z
				.string()
				.optional()
				.describe('Additional appointment field 2.'),
			additional3: z
				.string()
				.optional()
				.describe('Additional appointment field 3.'),
			additional4: z
				.string()
				.optional()
				.describe('Additional appointment field 4.'),
			additional5: z
				.string()
				.optional()
				.describe('Additional appointment field 5.'),
			additional6: z
				.string()
				.optional()
				.describe('Additional appointment field 6.'),
			additional7: z
				.string()
				.optional()
				.describe('Additional appointment field 7.'),
			additional8: z
				.string()
				.optional()
				.describe('Additional appointment field 8.'),
			additional9: z
				.string()
				.optional()
				.describe('Additional appointment field 9.'),
			additional10: z
				.string()
				.optional()
				.describe('Additional appointment field 10.'),
			additional11: z
				.string()
				.optional()
				.describe('Additional appointment field 11.'),
			additional12: z
				.string()
				.optional()
				.describe('Additional appointment field 12.'),
			additional13: z
				.string()
				.optional()
				.describe('Additional appointment field 13.'),
			additional14: z
				.string()
				.optional()
				.describe('Additional appointment field 14.'),
			additional15: z
				.string()
				.optional()
				.describe('Additional appointment field 15.'),
			additional16: z
				.string()
				.optional()
				.describe('Additional appointment field 16.'),
			additional17: z
				.string()
				.optional()
				.describe('Additional appointment field 17.'),
			additional18: z
				.string()
				.optional()
				.describe('Additional appointment field 18.'),
			additional19: z
				.string()
				.optional()
				.describe('Additional appointment field 19.'),
			additional20: z
				.string()
				.optional()
				.describe('Additional appointment field 20.'),
			tags: z
				.string()
				.optional()
				.describe('Tags of the person. To add multiple tags use a comma (,)'),
			limitedservices: z
				.string()
				.optional()
				.describe(
					'Set to 1 if you want to limit the services for the contact. Also see <br> /api/contactpermission and <br> /api/contactfrequency <br> for more information. The login on the booking page needs to be activated to use this feature',
				),
		})
		.strict(),
	contactsDelete: z
		.object({
			email: z
				.string()
				.optional()
				.describe(
					'E-Mail of the contact (this can lead to the deletion of multiple contacts with the same Email)',
				),
			id: z.string().optional().describe('ExternalID of the contact'),
			cid: z.string().optional().describe('CID of the contact'),
		})
		.strict(),
	contactFrequenciesList: z
		.object({
			cid: z.number().int().describe('CID of the contact'),
		})
		.strict(),
	contactFrequenciesCreate: z
		.object({
			cid: z
				.number()
				.int()
				.describe('CID of the contact that should get a frequency'),
			limited: z
				.boolean()
				.describe('Set to true if the frequency limitation should apply'),
			frequency: z
				.number()
				.int()
				.describe(
					'Defines how many appointments can be booked in the specific timeframe',
				),
			frequencytype: z
				.string()
				.describe(
					'Defines the timeframe of the frequency limitation:<br>0 = per week<br>1 = per month<br>2 = per quarter<br>3 = per year',
				),
		})
		.strict(),
	contactServicesList: z
		.object({
			cid: z.number().int().describe('CID of the contact'),
		})
		.strict(),
	contactServicesCreate: z
		.object({
			cid: z
				.number()
				.int()
				.describe('CID of the contact that should get permissions'),
			sgid: z
				.string()
				.describe(
					'Servicegroupids of the servicegroups that the contact should have permission to. Multiple servicegroups are separated by a comma (,). Leave empty for no restrictions',
				),
		})
		.strict(),
	messageLogsList: z
		.object({
			id: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of a messagelog entry. Gives the email text that is sent in this specific email.',
				),
			appid: z
				.number()
				.int()
				.optional()
				.describe(
					'Gives a list of all emails and SMS that are sent relating to the numeric appointmentid (not externalid)',
				),
			smsonly: z
				.boolean()
				.optional()
				.describe(
					"Only gives you a list how many SMS are sent this month and last month. It won't contain the list of SMS that are actually sent, only the amount.",
				),
		})
		.strict(),
	ratingsList: z.object({}).strict(),
	servicesList: z
		.object({
			languageid: z
				.string()
				.optional()
				.describe(
					'Use the language code in which you want the name and description of the service (e.g., DE, EN, etc.)',
				),
			id: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the service to get the information of a specific service',
				),
			ServiceGroupID: z
				.number()
				.int()
				.optional()
				.describe('Use if you want only services of a specific service group'),
			addimage: z
				.number()
				.int()
				.optional()
				.describe(
					'true if you want to also get the image-data in your response',
				),
		})
		.strict(),
	servicesCreate: withLanguageFields(
		z.object({
			servicegroupid: z.number().int().describe('ID of the service group'),
			servicede: z
				.string()
				.describe(
					'Name of the service in german. For other languages use serviceLANGUAGECODE e.g. serviceen',
				),
			timeslotminutes: z
				.number()
				.int()
				.describe('Duration of the service in minutes'),
			infode: z
				.string()
				.optional()
				.describe(
					'Additional description of the service in german. For other languages use serviceLANGUAGECODE e.g. infoen',
				),
			infodisplay: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines where the information is shown (0 = below service name, 1 = informationtext page 2, 2 = summary after booking, 3 = below service name and summary after booking)',
				),
			differenttimeresource: z
				.boolean()
				.optional()
				.describe('True if you want to add pre- or post processing times'),
			timeslotminutesresstart: z
				.number()
				.int()
				.optional()
				.describe(
					'Busy by minute (use negative number to have a pre-processing time)',
				),
			timeslotminutesresend: z
				.number()
				.int()
				.optional()
				.describe(
					'Busy until minute (use a number greater than timeslotminutes to have a post-processing time)',
				),
			price: z.number().optional().describe('Price of the service'),
			priceispercentage: z
				.boolean()
				.optional()
				.describe('True if price is a percentage'),
			abbreviation: z
				.string()
				.optional()
				.describe('abbreviation of the service'),
			enablecapacity: z
				.boolean()
				.optional()
				.describe('True to enable the capacity of the service'),
			showcapselectionbox: z
				.boolean()
				.optional()
				.describe('True if the customer is able to select the capacity'),
			maxcapacity: z
				.number()
				.optional()
				.describe('Sets the maximum capacity of the service'),
			maxcapacityusersel: z
				.number()
				.optional()
				.describe(
					'Sets the maximum capacity the user can set on the booking page (needs showcapselectionbox to be true)',
				),
			capacitynonsel: z
				.number()
				.optional()
				.describe(
					'Sets the capacity if selected on the booking page (needs showcapselectionbox to be false)',
				),
			image: z.string().optional().describe('Image of the service'),
			appdeadline: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment must be booked in advance in minutes'),
			appfuture: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment can be booked in the future in days'),
			startedapp: z
				.number()
				.int()
				.optional()
				.describe(
					'Time the appointment can be booked if already started in minutes (has to be a negative value)',
				),
			canceldeadline: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment can be cancelled in hours'),
			dayselectiontype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how page 2 shows the available days (0 = Calendar, 1 = list of days)',
				),
			appointmentlocation: z
				.number()
				.int()
				.optional()
				.describe('Defines the location of the appointment'),
			appointmentlocationtext: z
				.string()
				.optional()
				.describe('Defines the location text if appointmentlocation = 3'),
			vendorconfirmation: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the appointment provider needs to manually confirm the appointment (0 = manually, 1 = automatically)',
				),
			smsconfirmation: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if a SMS confirmation is sent after booking (1 = enabled, 0 = disabled)',
				),
			reminderhours: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the first reminder is sent in hours (needs to be a negative value)',
				),
			reminderhours2: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the second reminder is sent in hours (needs to be a negative value)',
				),
			cluster: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the cluster is applied to this service (1 = enabled, 0 = disabled)',
				),
			customerconfirm: z
				.number()
				.int()
				.optional()
				.describe(
					"Defines if the customer needs to confirm the appointment (1 = enabled, 0 = disabled; doesn't work with online payments or vendorconfirmation)",
				),
			customerconfirmtime: z
				.number()
				.int()
				.optional()
				.describe(
					'Time in minutes the customer has time to confirm the appointment (customerconfirm must be set to 1)',
				),
			PM0: z
				.number()
				.int()
				.optional()
				.describe('Shows online payment options (1 = enabled, 0 = disabled)'),
			PM1: z
				.number()
				.int()
				.optional()
				.describe('Shows on site payment options (1 = enabled, 0 = disabled)'),
			PM2: z
				.number()
				.int()
				.optional()
				.describe(
					'Shows by invoice payment options (1 = enabled, 0 = disabled)',
				),
			paymentamountpercentage: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the payment amount that needs to be paid at the end of booking',
				),
			paymentamountisabsolute: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if paymentamountpercentage is abolute or a percentage (1 = absolute, 0 = percentage)',
				),
			currency: z
				.string()
				.optional()
				.describe('Defines the currency of the service'),
			voucherfield: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the voucherfield is shown (0 = not shown, 1 = shown, 2 = shown and mandatory)',
				),
			mpbs: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the price is multiplied by the amount of booked appointments',
				),
			timeslotformat: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the timeslots are shown on page 2 on the bookingpage (0 = starttime - endtime, 1 = starttime, 2 = only date, 3 = calendar week, 4 = like 0 but with dates, 5 = startdate only)',
				),
			multiappointment: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if multiple appointments can be booked in one booking (0 = no, 1 = yes)',
				),
			multiservicedurationcalcmethod: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the duration is calculated if multiple services are selected (0 = all durations are summed up, 1 = only duration of the longest service, 2 = all durations are halfed, 3 = like 2 except the longest service)',
				),
			calendarselection: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the calendar selection should be shown (0 = no, 1 = yes)',
				),
			ssca: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar selection the entry all calendars is shown (0 = no, 1 = yes)',
				),
			showcalname: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar name is shown in the time slot (0 = no, 1 = yes)',
				),
			showcalpic: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar picture is shown after the timeslot is selected (0 = no, 1 = yes)',
				),
			showavcap: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the available capacity is shown in time slots (0 = no, 1 = yes)',
				),
			limitbooking: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if this service can be booked a limited amount of times per customer (0 = no, 1 = yes)',
				),
			limitappointmentstype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the appointments are limited (0 = per booking day, 1 = per week, 2 = per month, 3 = per year, 4 = per booked day)',
				),
			limitappointments: z
				.number()
				.int()
				.optional()
				.describe('Defines how many appointments can be booked per customer'),
			limitservice: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the limitation only applies to this specific service',
				),
			wowing: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 0 if the Wowing interface should be disabled for this service',
				),
			wowingautomationid: z
				.number()
				.int()
				.optional()
				.describe('Defines the Woing Automation ID'),
			paymentduration: z
				.number()
				.int()
				.optional()
				.describe('Defines the payment term for LexOffice'),
			workloadperc: z
				.number()
				.int()
				.optional()
				.describe('Defines the percentage of time slots that are not shown'),
			nrtimeslotentries: z
				.number()
				.int()
				.optional()
				.describe('Defines the maximum amount of time slots that are shown'),
			feedback: z
				.number()
				.int()
				.optional()
				.describe('Set to 0 if the feedback checkbox should not be shown'),
			calcdrivingtime: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if driving time should be calculated (0 = no, 1 = yes)',
				),
			fillcalendarstrategy: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the calender should be filled (0 = standard, 1 = random, 2 = round Robin, 3 = sequential, 4 = skills, 5 = strict round Robin)',
				),
			waitinglist: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the waiting list should be available (0 = no, 1 = yes)',
				),
			notearlyapp: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the customer should get an email if an earlier appointment is available (0 = not active, 1 = for appointments that were cancelled online, 2 = for appointments cancelled online and manually, 3 = like 1 but per calendar, 4 = like 2 but per calendar)',
				),
			sortorder: z
				.number()
				.int()
				.optional()
				.describe('Defines the position in the servicegroup'),
			bookingtype: z
				.number()
				.int()
				.optional()
				.describe(
					"Defines the bookingtype (0 = appointment, 1 = no appointment booking allowed, 2 = 'negative' appointment, 3 = reservation list, 4 = voucher sale)",
				),
			showinternal: z
				.boolean()
				.optional()
				.describe('Defines if the service is shown in the backend'),
			enabled: z
				.boolean()
				.optional()
				.describe('Defines if the service is shown in the frontend'),
			showindb: z
				.boolean()
				.optional()
				.describe(
					'Defines if the service is shown in the most booked area of the Dashboard',
				),
			emailsender: z
				.string()
				.optional()
				.describe('Defines the sender adress of the email for this service'),
			emailtxtde: z
				.string()
				.optional()
				.describe(
					'A special placeholder %SERVICETEXT% for emails, use other language codes to set the text (for example emailtxten for english)',
				),
			infotxtp2: z
				.string()
				.optional()
				.describe(
					'A special placeholder %INFOTEXTP2% for page 2 of the booking page',
				),
			pricesuffixde: z
				.string()
				.optional()
				.describe(
					'Additional information for the price, use other language codes to set the text (for example emailtxten for english)',
				),
			priceinfopos: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines where the pricesuffix is shown (0 = left side, 1 = right side)',
				),
			vat: z
				.number()
				.int()
				.optional()
				.describe('Defines the vat rate of the service'),
			multiplypricewithcap: z
				.boolean()
				.optional()
				.describe('Defines if the price is multiplied with the capacity'),
			pricediffperday: z
				.boolean()
				.optional()
				.describe('Defines if different prices per weekday are applied'),
			issubscription: z
				.boolean()
				.optional()
				.describe('Defines if the service is a subscription'),
			capseltextde: z
				.string()
				.optional()
				.describe(
					'Defines the text if there is a capacity selection on that service, use other language codes to set the text (for example capseltexten for english)',
				),
			mstextpos: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the position of capseltext (0 = above selection, 1 = to the right)',
				),
			allowonlythisservice: z
				.boolean()
				.optional()
				.describe(
					'If there are multiple services with capacity available at the same time, this option prevents that they will get mixed, if set to true',
				),
			multiservicesel: z
				.boolean()
				.optional()
				.describe(
					"True, if the service can be booked multiple times after another. This won't work if the parameter enablecapacity is true aswell",
				),
			multiservicemin: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the minimum amount that can be choosen for multi service selection',
				),
			multiservicemax: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum amount that can be choosen for multi service selection',
				),
			extramin: z
				.number()
				.int()
				.optional()
				.describe('Defines total wrap up time'),
			extramintype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if extramin should not be applied if differenttimeresource is true, 1 if extramin should be added to timeslotminutesresend',
				),
			maxappsel: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum amount of appointments that can be selected on the booking page if multiappointment is true (in this service or globally)',
				),
			nrappsel: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum / minimum amount of appointments that MUST be selected on the booking page if multiappointment is true (in this service or globally)',
				),
			maxminslots: z
				.boolean()
				.optional()
				.describe('Defines if nrappsel is maximum (0) or minimum (1)'),
			nrappseladjacent: z
				.boolean()
				.optional()
				.describe('True, if the selected appointments have to be adjacent'),
			nrappseladjacenttype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 = the date and time need to be adjacent, 1 = only the day need to be adjacent',
				),
			specificrangenextslot: z
				.boolean()
				.optional()
				.describe(
					'True, if the next appointment needs to be after a specific timeframe',
				),
			rangestart: z
				.number()
				.int()
				.optional()
				.describe('Days after the last appoinment'),
			rangeend: z
				.number()
				.int()
				.optional()
				.describe('Days range for the new appointment'),
			infotextinslots: z
				.boolean()
				.optional()
				.describe(
					'True, if the info text should be shown in the slot text in page 2 of the booking page',
				),
			appattrib: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines which attribute is set automatically in appointment. Attributes are binary encoded (1st attribute = 1, 2nd = 2, 3rd = 4; 1st + 2nd = 3)',
				),
			addapphours: z
				.number()
				.int()
				.optional()
				.describe(
					'Hours after the first appointment, where a second appointment is booked',
				),
			rrule: z
				.string()
				.optional()
				.describe('Defines the RRULE for this service'),
			bookingminute: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the timeslots are shown (61 = no restrictions, 0 = every full hour, 31 = every full and half hour, 15 or 30 or 45 = x minutes after a full hour)',
				),
			showserviceids: z
				.string()
				.optional()
				.describe('Service(s) that have to be selected to show this service'),
			hideserviceids: z
				.string()
				.optional()
				.describe(
					'Service(s) that should be hidden, if this service is selected',
				),
			uselogo: z
				.boolean()
				.optional()
				.describe(
					'True, if the the picture of this service should be used for the email logo',
				),
			severalcalendarsused: z
				.boolean()
				.optional()
				.describe(
					'True, if the service can only be booked if another calendar is available',
				),
			differenttimecombined: z
				.boolean()
				.optional()
				.describe(
					'True, if the service has a different time if booked with another service',
				),
			timeslotcombined: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the time of the appointment if booked with another service. differenttimecombined has to be true',
				),
			tags: z
				.string()
				.optional()
				.describe('ID of the tags that the contact gets after booking'),
			tagscancel: z
				.string()
				.optional()
				.describe(
					'ID of the tags that the contact gets after cancellation of the appointment',
				),
			externalreference: z
				.string()
				.optional()
				.describe('Used for a tag ID or external reference after booking'),
			externalreferencedelete: z
				.string()
				.optional()
				.describe(
					'Used for a tag ID or external reference after cancellation of the appointment',
				),
			externalreferencechange: z
				.string()
				.optional()
				.describe(
					'Used for a tag ID or external reference after a change of the appointment',
				),
			externalreferencedate: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the date of the appointment',
				),
			externalreferencelocation: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the location of the appointment',
				),
			externalreferencecalname: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the calendar name of the appointment',
				),
			externalreferencecancel: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the cancellation link of the appointment',
				),
			jscode: z
				.string()
				.optional()
				.describe(
					'Used for JavaScript code that will be executed after the booking of the appointment (for example to redirect to another website)',
				),
		}),
		serviceLanguageField,
	),
	servicesUpdate: withLanguageFields(
		z.object({
			id: z.number().int().describe('ID of the service'),
			servicegroupid: z
				.number()
				.int()
				.optional()
				.describe('ID of the service group'),
			servicede: z
				.string()
				.optional()
				.describe(
					'Name of the service in german. For other languages use serviceLANGUAGECODE e.g. serviceen',
				),
			serviceen: z
				.string()
				.optional()
				.describe('Name of the service in English.'),
			timeslotminutes: z
				.number()
				.int()
				.optional()
				.describe('Duration of the service in minutes'),
			infode: z
				.string()
				.optional()
				.describe(
					'Additional description of the service in german. For other languages use serviceLANGUAGECODE e.g. infoen',
				),
			infoen: z
				.string()
				.optional()
				.describe('Additional description of the service in English.'),
			infodisplay: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines where the information is shown (0 = below service name, 1 = informationtext page 2, 2 = summary after booking, 3 = below service name and summary after booking)',
				),
			differenttimeresource: z
				.boolean()
				.optional()
				.describe('True if you want to add pre- or post processing times'),
			timeslotminutesresstart: z
				.number()
				.int()
				.optional()
				.describe(
					'Busy by minute (use negative number to have a pre-processing time)',
				),
			timeslotminutesresend: z
				.number()
				.int()
				.optional()
				.describe(
					'Busy until minute (use a number greater than timeslotminutes to have a post-processing time)',
				),
			price: z.number().optional().describe('Price of the service'),
			priceispercentage: z
				.boolean()
				.optional()
				.describe('True if price is a percentage'),
			abbreviation: z
				.string()
				.optional()
				.describe('abbreviation of the service'),
			enablecapacity: z
				.boolean()
				.optional()
				.describe('True to enable the capacity of the service'),
			showcapselectionbox: z
				.boolean()
				.optional()
				.describe('True if the customer is able to select the capacity'),
			maxcapacity: z
				.number()
				.optional()
				.describe('Sets the maximum capacity of the service'),
			maxcapacityusersel: z
				.number()
				.optional()
				.describe(
					'Sets the maximum capacity the user can set on the booking page (needs showcapselectionbox to be true)',
				),
			capacitynonsel: z
				.number()
				.optional()
				.describe(
					'Sets the capacity if selected on the booking page (needs showcapselectionbox to be false)',
				),
			image: z.string().optional().describe('Image of the service'),
			appdeadline: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment must be booked in advance in minutes'),
			appfuture: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment can be booked in the future in days'),
			startedapp: z
				.number()
				.int()
				.optional()
				.describe(
					'Time the appointment can be booked if already started in minutes (has to be a negative value)',
				),
			canceldeadline: z
				.number()
				.int()
				.optional()
				.describe('Time the appointment can be cancelled in hours'),
			dayselectiontype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how page 2 shows the available days (0 = Calendar, 1 = list of days)',
				),
			appointmentlocation: z
				.number()
				.int()
				.optional()
				.describe('Defines the location of the appointment'),
			appointmentlocationtext: z
				.string()
				.optional()
				.describe('Defines the location text if appointmentlocation = 3'),
			vendorconfirmation: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the appointment provider needs to manually confirm the appointment (0 = manually, 1 = automatically)',
				),
			smsconfirmation: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if a SMS confirmation is sent after booking (1 = enabled, 0 = disabled)',
				),
			reminderhours: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the first reminder is sent in hours (needs to be a negative value)',
				),
			reminderhours2: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the second reminder is sent in hours (needs to be a negative value)',
				),
			cluster: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the cluster is applied to this service (1 = enabled, 0 = disabled)',
				),
			customerconfirm: z
				.number()
				.int()
				.optional()
				.describe(
					"Defines if the customer needs to confirm the appointment (1 = enabled, 0 = disabled; doesn't work with online payments or vendorconfirmation)",
				),
			customerconfirmtime: z
				.number()
				.int()
				.optional()
				.describe(
					'Time in minutes the customer has time to confirm the appointment (customerconfirm must be set to 1)',
				),
			PM0: z
				.number()
				.int()
				.optional()
				.describe('Shows online payment options (1 = enabled, 0 = disabled)'),
			PM1: z
				.number()
				.int()
				.optional()
				.describe('Shows on site payment options (1 = enabled, 0 = disabled)'),
			PM2: z
				.number()
				.int()
				.optional()
				.describe(
					'Shows by invoice payment options (1 = enabled, 0 = disabled)',
				),
			paymentamountpercentage: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the payment amount that needs to be paid at the end of booking',
				),
			paymentamountisabsolute: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if paymentamountpercentage is abolute or a percentage (1 = absolute, 0 = percentage)',
				),
			currency: z
				.string()
				.optional()
				.describe('Defines the currency of the service'),
			voucherfield: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the voucherfield is shown (0 = not shown, 1 = shown, 2 = shown and mandatory)',
				),
			mpbs: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the price is multiplied by the amount of booked appointments',
				),
			timeslotformat: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the timeslots are shown on page 2 on the bookingpage (0 = starttime - endtime, 1 = starttime, 2 = only date, 3 = calendar week, 4 = like 0 but with dates, 5 = startdate only)',
				),
			multiappointment: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if multiple appointments can be booked in one booking (0 = no, 1 = yes)',
				),
			multiservicedurationcalcmethod: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the duration is calculated if multiple services are selected (0 = all durations are summed up, 1 = only duration of the longest service, 2 = all durations are halfed, 3 = like 2 except the longest service)',
				),
			calendarselection: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the calendar selection should be shown (0 = no, 1 = yes)',
				),
			ssca: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar selection the entry all calendars is shown (0 = no, 1 = yes)',
				),
			showcalname: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar name is shown in the time slot (0 = no, 1 = yes)',
				),
			showcalpic: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if in the calendar picture is shown after the timeslot is selected (0 = no, 1 = yes)',
				),
			showavcap: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the available capacity is shown in time slots (0 = no, 1 = yes)',
				),
			limitbooking: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if this service can be booked a limited amount of times per customer (0 = no, 1 = yes)',
				),
			limitappointmentstype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the appointments are limited (0 = per booking day, 1 = per week, 2 = per month, 3 = per year, 4 = per booked day)',
				),
			limitappointments: z
				.number()
				.int()
				.optional()
				.describe('Defines how many appointments can be booked per customer'),
			limitservice: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the limitation only applies to this specific service',
				),
			wowing: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 0 if the Wowing interface should be disabled for this service',
				),
			wowingautomationid: z
				.number()
				.int()
				.optional()
				.describe('Defines the Woing Automation ID'),
			paymentduration: z
				.number()
				.int()
				.optional()
				.describe('Defines the payment term for LexOffice'),
			workloadperc: z
				.number()
				.int()
				.optional()
				.describe('Defines the percentage of time slots that are not shown'),
			nrtimeslotentries: z
				.number()
				.int()
				.optional()
				.describe('Defines the maximum amount of time slots that are shown'),
			feedback: z
				.number()
				.int()
				.optional()
				.describe('Set to 0 if the feedback checkbox should not be shown'),
			calcdrivingtime: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if driving time should be calculated (0 = no, 1 = yes)',
				),
			fillcalendarstrategy: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the calender should be filled (0 = standard, 1 = random, 2 = round Robin, 3 = sequential, 4 = skills, 5 = strict round Robin)',
				),
			waitinglist: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the waiting list should be available (0 = no, 1 = yes)',
				),
			notearlyapp: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines if the customer should get an email if an earlier appointment is available (0 = not active, 1 = for appointments that were cancelled online, 2 = for appointments cancelled online and manually, 3 = like 1 but per calendar, 4 = like 2 but per calendar)',
				),
			sortorder: z
				.number()
				.int()
				.optional()
				.describe('Defines the position in the servicegroup'),
			bookingtype: z
				.number()
				.int()
				.optional()
				.describe(
					"Defines the bookingtype (0 = appointment, 1 = no appointment booking allowed, 2 = 'negative' appointment, 3 = reservation list, 4 = voucher sale)",
				),
			showinternal: z
				.boolean()
				.optional()
				.describe('Defines if the service is shown in the backend'),
			enabled: z
				.boolean()
				.optional()
				.describe('Defines if the service is shown in the frontend'),
			showindb: z
				.boolean()
				.optional()
				.describe(
					'Defines if the service is shown in the most booked area of the Dashboard',
				),
			emailsender: z
				.string()
				.optional()
				.describe('Defines the sender adress of the email for this service'),
			emailtxtde: z
				.string()
				.optional()
				.describe(
					'A special placeholder %SERVICETEXT% for emails, use other language codes to set the text (for example emailtxten for english)',
				),
			infotxtp2: z
				.string()
				.optional()
				.describe(
					'A special placeholder %INFOTEXTP2% for page 2 of the booking page',
				),
			pricesuffixde: z
				.string()
				.optional()
				.describe(
					'Additional information for the price, use other language codes to set the text (for example emailtxten for english)',
				),
			priceinfopos: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines where the pricesuffix is shown (0 = left side, 1 = right side)',
				),
			vat: z
				.number()
				.int()
				.optional()
				.describe('Defines the vat rate of the service'),
			multiplypricewithcap: z
				.boolean()
				.optional()
				.describe('Defines if the price is multiplied with the capacity'),
			pricediffperday: z
				.boolean()
				.optional()
				.describe('Defines if different prices per weekday are applied'),
			issubscription: z
				.boolean()
				.optional()
				.describe('Defines if the service is a subscription'),
			capseltextde: z
				.string()
				.optional()
				.describe(
					'Defines the text if there is a capacity selection on that service, use other language codes to set the text (for example capseltexten for english)',
				),
			mstextpos: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the position of capseltext (0 = above selection, 1 = to the right)',
				),
			allowonlythisservice: z
				.boolean()
				.optional()
				.describe(
					'If there are multiple services with capacity available at the same time, this option prevents that they will get mixed, if set to true',
				),
			multiservicesel: z
				.boolean()
				.optional()
				.describe(
					"True, if the service can be booked multiple times after another. This won't work if the parameter enablecapacity is true aswell",
				),
			multiservicemin: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the minimum amount that can be choosen for multi service selection',
				),
			multiservicemax: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum amount that can be choosen for multi service selection',
				),
			extramin: z
				.number()
				.int()
				.optional()
				.describe('Defines total wrap up time'),
			extramintype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if extramin should not be applied if differenttimeresource is true, 1 if extramin should be added to timeslotminutesresend',
				),
			maxappsel: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum amount of appointments that can be selected on the booking page if multiappointment is true (in this service or globally)',
				),
			nrappsel: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the maximum / minimum amount of appointments that MUST be selected on the booking page if multiappointment is true (in this service or globally)',
				),
			maxminslots: z
				.boolean()
				.optional()
				.describe('Defines if nrappsel is maximum (0) or minimum (1)'),
			nrappseladjacent: z
				.boolean()
				.optional()
				.describe('True, if the selected appointments have to be adjacent'),
			nrappseladjacenttype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 = the date and time need to be adjacent, 1 = only the day need to be adjacent',
				),
			specificrangenextslot: z
				.boolean()
				.optional()
				.describe(
					'True, if the next appointment needs to be after a specific timeframe',
				),
			rangestart: z
				.number()
				.int()
				.optional()
				.describe('Days after the last appoinment'),
			rangeend: z
				.number()
				.int()
				.optional()
				.describe('Days range for the new appointment'),
			infotextinslots: z
				.boolean()
				.optional()
				.describe(
					'True, if the info text should be shown in the slot text in page 2 of the booking page',
				),
			appattrib: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines which attribute is set automatically in appointment. Attributes are binary encoded (1st attribute = 1, 2nd = 2, 3rd = 4; 1st + 2nd = 3)',
				),
			addapphours: z
				.number()
				.int()
				.optional()
				.describe(
					'Hours after the first appointment, where a second appointment is booked',
				),
			rrule: z
				.string()
				.optional()
				.describe('Defines the RRULE for this service'),
			bookingminute: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines when the timeslots are shown (61 = no restrictions, 0 = every full hour, 31 = every full and half hour, 15 or 30 or 45 = x minutes after a full hour)',
				),
			showserviceids: z
				.string()
				.optional()
				.describe('Service(s) that have to be selected to show this service'),
			hideserviceids: z
				.string()
				.optional()
				.describe(
					'Service(s) that should be hidden, if this service is selected',
				),
			uselogo: z
				.boolean()
				.optional()
				.describe(
					'True, if the the picture of this service should be used for the email logo',
				),
			severalcalendarsused: z
				.boolean()
				.optional()
				.describe(
					'True, if the service can only be booked if another calendar is available',
				),
			differenttimecombined: z
				.boolean()
				.optional()
				.describe(
					'True, if the service has a different time if booked with another service',
				),
			timeslotcombined: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the time of the appointment if booked with another service. differenttimecombined has to be true',
				),
			tags: z
				.string()
				.optional()
				.describe('ID of the tags that the contact gets after booking'),
			tagscancel: z
				.string()
				.optional()
				.describe(
					'ID of the tags that the contact gets after cancellation of the appointment',
				),
			externalreference: z
				.string()
				.optional()
				.describe('Used for a tag ID or external reference after booking'),
			externalreferencedelete: z
				.string()
				.optional()
				.describe(
					'Used for a tag ID or external reference after cancellation of the appointment',
				),
			externalreferencechange: z
				.string()
				.optional()
				.describe(
					'Used for a tag ID or external reference after a change of the appointment',
				),
			externalreferencedate: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the date of the appointment',
				),
			externalreferencelocation: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the location of the appointment',
				),
			externalreferencecalname: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the calendar name of the appointment',
				),
			externalreferencecancel: z
				.string()
				.optional()
				.describe(
					'ID of a field that should contain the cancellation link of the appointment',
				),
			jscode: z
				.string()
				.optional()
				.describe(
					'Used for JavaScript code that will be executed after the booking of the appointment (for example to redirect to another website)',
				),
		}),
		serviceLanguageField,
	),
	servicesDelete: z
		.object({
			id: z.string().describe('ID of the service'),
		})
		.strict(),
	serviceCalendarsList: z
		.object({
			serviceid: z
				.string()
				.describe(
					"ID of a service. Several service ID's can be separated with a comma (,). e.g. 45345,45346 etc.",
				),
		})
		.strict(),
	serviceGroupsList: z
		.object({
			servicegroupid: z
				.number()
				.int()
				.optional()
				.describe('ID of the servicegroup that you want information on'),
			languageid: z
				.string()
				.optional()
				.describe(
					'Language code if you only want the information for a specific language e.g. DE, EN, etc.',
				),
		})
		.strict(),
	serviceGroupsCreate: withLanguageFields(
		z.object({
			servicegroupde: z
				.string()
				.optional()
				.describe(
					'Name of the service group in german. For other languages use servicegroupLANGUAGECODE e.g. servicegroupen',
				),
			servicegroupen: z
				.string()
				.optional()
				.describe('Name of the service group in English.'),
			additionaltextde: z
				.string()
				.optional()
				.describe(
					'Additional information of the service group in german. For other languages use additionaltextLANGUAGECODE e.g. additionaltexten',
				),
			additionaltexten: z
				.string()
				.optional()
				.describe('Additional information in English.'),
			addtextdisplaymode: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the location of the additional text (0 = via Tooltip; 1 = under the name of the service group)',
				),
			servicegrouptype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the service group type (0 = Service selection; 2 = Text field; 5 = location selection; 8 = Day amount selection; 9 = Number search; 10 = Minutes amount selection)',
				),
			answerselection: z
				.number()
				.int()
				.optional()
				.describe(
					'Selection type for services (0 = Single selection; 1 = Multi selection; 2 = list selection). Has to be -1 if servicegrouptype is not 0!',
				),
			isoptional: z
				.boolean()
				.optional()
				.describe('Defines if a selection of a service is mandatory'),
			showprice: z
				.boolean()
				.optional()
				.describe('Defines if the price of the service is shown'),
			showduration: z
				.boolean()
				.optional()
				.describe('Defines if the duration of the service is shown'),
			nrservicecolumns: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how many columns the services should be displayed in',
				),
			showtoggle: z
				.boolean()
				.optional()
				.describe('true if the service group can be collapsed'),
			collapse: z
				.boolean()
				.optional()
				.describe(
					'true if the service group is shown collapsed as default (need showtoggle to be true)',
				),
			enabled: z
				.boolean()
				.optional()
				.describe(
					'false if the service group should not appear on the bookingpage (only via direct link or for internal services)',
				),
			showinsummary: z
				.boolean()
				.optional()
				.describe(
					'false if the selected service should not appear in the summary box',
				),
			showwhencertainanswerselected: z
				.string()
				.optional()
				.describe(
					'List of services that have to be selected to show this service group. Set to -1 if the service group should be shown initially',
				),
		}),
		serviceGroupLanguageField,
	),
	serviceGroupsUpdate: withLanguageFields(
		z.object({
			servicegroupid: z
				.number()
				.int()
				.describe('ID of the service group that gets updated'),
			servicegroupde: z
				.string()
				.optional()
				.describe(
					'Name of the service group in german. For other languages use servicegroupLANGUAGECODE e.g. servicegroupen',
				),
			servicegroupen: z
				.string()
				.optional()
				.describe('Name of the service group in English.'),
			additionaltextde: z
				.string()
				.optional()
				.describe(
					'Additional information of the service group in german. For other languages use additionaltextLANGUAGECODE e.g. additionaltexten',
				),
			additionaltexten: z
				.string()
				.optional()
				.describe('Additional information in English.'),
			addtextdisplaymode: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the location of the additional text (0 = via Tooltip; 1 = under the name of the service group)',
				),
			servicegrouptype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the service group type (0 = Service selection; 2 = Text field; 5 = location selection; 8 = Day amount selection; 9 = Number search; 10 = Minutes amount selection)',
				),
			answerselection: z
				.number()
				.int()
				.optional()
				.describe(
					'Selection type for services (0 = Single selection; 1 = Multi selection; 2 = list selection). Has to be -1 if servicegrouptype is not 0!',
				),
			isoptional: z
				.boolean()
				.optional()
				.describe('Defines if a selection of a service is mandatory'),
			showprice: z
				.boolean()
				.optional()
				.describe('Defines if the price of the service is shown'),
			showduration: z
				.boolean()
				.optional()
				.describe('Defines if the duration of the service is shown'),
			nrservicecolumns: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how many columns the services should be displayed in',
				),
			showimgfull: z
				.boolean()
				.optional()
				.describe(
					'true if the picture of the service should be shown as big as possible',
				),
			showtoggle: z
				.boolean()
				.optional()
				.describe('true if the service group can be collapsed'),
			collapse: z
				.boolean()
				.optional()
				.describe(
					'true if the service group is shown collapsed as default (need showtoggle to be true)',
				),
			enabled: z
				.boolean()
				.optional()
				.describe(
					'false if the service group should not appear on the bookingpage (only via direct link or for internal services)',
				),
			answersortorder: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines in which order the services are shown (0 = according to position in service; 1 = Ascending by name; 2 = Descending by name)',
				),
			showinsummary: z
				.boolean()
				.optional()
				.describe(
					'false if the selected service should not appear in the summary box',
				),
			showinemailsummary: z
				.boolean()
				.optional()
				.describe(
					'false if the selected service should not appear in the summary of the emails',
				),
			pageidx: z
				.number()
				.int()
				.optional()
				.describe(
					'If set to 1 the service group will be shown on a second service selection page. Default value is 0',
				),
			displayindex: z
				.number()
				.int()
				.describe('Index in which order the service group should be shown'),
			showwhencertainanswerselected: z
				.string()
				.optional()
				.describe(
					'List of services that have to be selected to show this service group. Set to -1 if the service group should be shown initially',
				),
			countrylimitation: z
				.string()
				.optional()
				.describe(
					'Languagecodes that are supported by the location lookup (servicegrouptype has to be 5)',
				),
			regex: z
				.string()
				.optional()
				.describe(
					'Is a validation rule. Can be used if you want to have your location written in a certain way (servicegrouptype has to be 5)',
				),
			errormsgde: z
				.string()
				.optional()
				.describe(
					"Error message, if the regex isn't valid or a wrong number on the number search is used. For other languages use errormsgLANGUAGECODE e.g. errormsgen (servicegrouptype has to be 5 or 9)",
				),
			selminduration: z
				.number()
				.int()
				.optional()
				.describe(
					'The interval of minutes you can switch up or down with the minute selection (servicegrouptype has to be 10)',
				),
			selminprice: z
				.number()
				.int()
				.optional()
				.describe(
					'The price of every minute selection interval (servicegrouptype has to be 10)',
				),
		}),
		serviceGroupUpdateLanguageField,
	),
	serviceGroupsDelete: z
		.object({
			servicegroupid: z
				.number()
				.int()
				.describe('ID of the servicegroup that you want information on'),
		})
		.strict(),
	surveyResultsList: z
		.object({
			date: z
				.string()
				.optional()
				.describe('Date when the survey result was created'),
			appid: z
				.number()
				.int()
				.optional()
				.describe(
					'Get all survey results of the appointment with this ID (not externalid).',
				),
		})
		.strict(),
	timeSlotsList: z
		.object({
			date: z
				.string()
				.describe(
					'Day that you want to check if there are available slots. Format: yyyy-mm-dd',
				),
			rangesearch: z
				.number()
				.int()
				.optional()
				.describe(
					'0 - All slots of a specific day will be displayed <br> 1 - Searches until it found a date when slots are available. Returns the number of slots that are available on a specific day (according to the account settings, the available slots may differ)',
				),
			end: z
				.string()
				.optional()
				.describe(
					'End date of the time range. Only works if rangesearch=1. Format: yyyy-mm-dd',
				),
			serviceid: z
				.string()
				.optional()
				.describe(
					"ID(s) of the selected service(s). This parameter is required if you restrict the calendar or working times to specific services. Several service ID's can be separated with a comma (,). e.g. 45345,45346 etc.",
				),
			calendarid: z
				.string()
				.optional()
				.describe(
					'ID of the calendar. Use this parameter if you want to get available time slots for a specific calendar. If this parameter is empty, available time slots for all calendars will be returned.',
				),
			capacity: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines the capacity that is searched for, if you have capacity enabled',
				),
			duration: z
				.number()
				.int()
				.optional()
				.describe(
					'Appointment duration in minutes. Use this parameter if you want to use a different duration than specified for the service',
				),
			cluster: z
				.number()
				.int()
				.optional()
				.describe('Appointment cluster on (1) or off (0)'),
		})
		.strict(),
	userMappingsList: z
		.object({
			searchvalue: z
				.number()
				.int()
				.optional()
				.describe(
					'Value that needs to be validated by the number search (use no parameter to get all usermappings)',
				),
		})
		.strict(),
	userMappingsCreate: z
		.object({
			valuetype: z
				.number()
				.int()
				.optional()
				.describe(
					'Type of the number search Values:<br> 0 = Equals <br> 1 = From - To <br> 2 = Last two digits <br> 3 = Last 3 digits <br> 5 = Last digit <br> 6 = First digit <br> 7 = First two digits <br> 8 = First three digits',
				),
			value: z
				.number()
				.int()
				.optional()
				.describe(
					'Value that should be matched (valuetype has to be 0, 2 or 3). If you use last x digits, only use x digits for the value.',
				),
			valuefrom: z
				.number()
				.int()
				.optional()
				.describe(
					'First number that works for this range (valuetype has to be 1)',
				),
			valueto: z
				.number()
				.int()
				.optional()
				.describe(
					'Last number that works for this range (valuetype has to be 1)',
				),
			calendarid: z
				.string()
				.optional()
				.describe(
					'List of calendars that work with the searchvalue (default = -1)',
				),
			servicegroupid: z
				.string()
				.optional()
				.describe(
					'List of servicegroups that work with the searchvalue (default = -1)',
				),
		})
		.strict(),
	userMappingsUpdate: z
		.object({
			id: z
				.number()
				.int()
				.optional()
				.describe('ID of the value that gets updated'),
			valuetype: z
				.number()
				.int()
				.optional()
				.describe(
					'Type of the number search (0 = Equals; 1 = From - To; 2 = Last two digits; 3 = Last 3 digits)',
				),
			value: z
				.number()
				.int()
				.optional()
				.describe(
					'Value that should be matched (valuetype has to be 0, 2 or 3). If you use last x digits, only use x digits for the value.',
				),
			valuefrom: z
				.number()
				.int()
				.optional()
				.describe(
					'First number that works for this range (valuetype has to be 1)',
				),
			valueto: z
				.number()
				.int()
				.optional()
				.describe(
					'Last number that works for this range (valuetype has to be 1)',
				),
			calendarid: z
				.string()
				.optional()
				.describe(
					'List of calendars that work with the searchvalue (default = -1)',
				),
			servicegroupid: z
				.string()
				.optional()
				.describe(
					'List of servicegroups that work with the searchvalue (default = -1)',
				),
		})
		.strict(),
	userMappingsDelete: z
		.object({
			id: z.number().int().describe('ID of the value that gets updated'),
		})
		.strict(),
	vouchersList: z.object({}).strict(),
	vouchersCreate: z
		.object({
			id: z.string().describe('ID of the voucher'),
			description: z.string().optional().describe('Description of the voucher'),
			priceinclvat: z
				.number()
				.optional()
				.describe('Price including vat of the voucher'),
			priceoriginal: z
				.number()
				.optional()
				.describe(
					'Should be the same value as in priceinclvat, important with contingent',
				),
			ispercentage: z
				.boolean()
				.optional()
				.describe('true, if the value of the voucher is percentage'),
			contingentmax: z.number().int().optional().describe('Max. contingent'),
			contingentcounter: z
				.number()
				.int()
				.optional()
				.describe(
					'Counter of the contingent. Typically for a new voucher the value is 0',
				),
			validfrom: z
				.string()
				.optional()
				.describe(
					'Date from which date the voucher is valid. Format YYYY-MM-DD',
				),
			validuntil: z
				.string()
				.optional()
				.describe('Date until the voucher is valid. Format YYYY-MM-DD'),
			calendarsassigned: z
				.string()
				.optional()
				.describe('ID(s) of the calendar(s) for which the voucher is valid'),
			servicesassigned: z
				.string()
				.optional()
				.describe('ID(s) of the service(s) for which the voucher is valid'),
			customeremail: z
				.string()
				.optional()
				.describe(
					'E-Mail of the customer that is assigned to this voucher/contingent',
				),
			sendreminder: z
				.boolean()
				.optional()
				.describe(
					'true for a reminder to be sent if complete contingent is used',
				),
			onetimevalidperemail: z
				.boolean()
				.optional()
				.describe('true if the voucher can only be used x times for one email'),
			validxtimes: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of times the voucher is usable per email, needs onetimevalidperemail to be true',
				),
		})
		.strict(),
	vouchersUpdate: z
		.object({
			id: z.string().describe('ID of the voucher'),
			description: z.string().optional().describe('Description of the voucher'),
			priceinclvat: z
				.number()
				.optional()
				.describe('Price including vat of the voucher'),
			priceoriginal: z
				.number()
				.optional()
				.describe(
					'Should be the same value as in priceinclvat, important with contingent',
				),
			ispercentage: z
				.boolean()
				.optional()
				.describe('true, if the value of the voucher is percentage'),
			contingentmax: z.number().int().optional().describe('Max. contingent'),
			contingentcounter: z
				.number()
				.int()
				.optional()
				.describe(
					'Counter of the contingent. Typically for a new voucher the value is 0',
				),
			validfrom: z
				.string()
				.optional()
				.describe(
					'Date from which date the voucher is valid. Format YYYY-MM-DD',
				),
			validuntil: z
				.string()
				.optional()
				.describe('Date until the voucher is valid. Format YYYY-MM-DD'),
			calendarsassigned: z
				.string()
				.optional()
				.describe('ID(s) of the calendar(s) for which the voucher is valid'),
			servicesassigned: z
				.string()
				.optional()
				.describe('ID(s) of the service(s) for which the voucher is valid'),
			customeremail: z
				.string()
				.optional()
				.describe(
					'E-Mail of the customer that is assigned to this voucher/contingent',
				),
			sendreminder: z
				.boolean()
				.optional()
				.describe(
					'true for a reminder to be sent if complete contingent is used',
				),
			onetimevalidperemail: z
				.boolean()
				.optional()
				.describe('true if the voucher can only be used x times for one email'),
			validxtimes: z
				.number()
				.int()
				.optional()
				.describe(
					'Number of times the voucher is usable per email, needs onetimevalidperemail to be true',
				),
		})
		.strict(),
	vouchersDelete: z
		.object({
			id: z
				.string()
				.optional()
				.describe('ID of the voucher that should be deleted'),
		})
		.strict(),
	workingTimesList: z
		.object({
			calendarid: z
				.number()
				.int()
				.optional()
				.describe('CalendarID of the calendar you need the working times for'),
			all: z
				.boolean()
				.optional()
				.describe(
					'Use this parameter instead of calendarid, if you want the workingtimes of all calendars',
				),
			join: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 1 for the same information but with names instead of numbers',
				),
		})
		.strict()
		.refine((value) => value.calendarid !== undefined || value.all === true, {
			message: 'Provide calendarid or set all to true to list working times.',
		}),
	workingTimesCreate: z
		.object({
			start: z.string().describe('Start time of the slot, e.g. 09:00'),
			end: z.string().describe('End time of the slot, e.g. 17:00'),
			calendarid: z.number().int().describe('ID of the calendar'),
			weekday: z
				.string()
				.describe(
					'ID of the weekday 1 = Sunday, 7 = Saturday. You can add several weekdays separated by a comma e.g. 2,3,5',
				),
			enable: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if the time slot should exist but not being considered yet',
				),
			slottype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
				),
			validwithserviceid: z
				.string()
				.optional()
				.describe('List of services that work with this working slot'),
			allserviceidsrequired: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
				),
			nrapps: z
				.number()
				.int()
				.optional()
				.describe(
					'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
				),
			weektype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines in which interval the time slot should be shown <br> 0 = Every week <br> 1 = Odd weeks <br> 2 = Even weeks <br> 3 = First occurrence in month <br> 4 = second occurrence in month <br> 5 = third occurrence in month <br> 6 = fourth occurrence in month <br> 7 = Every 3 weeks first occurrence <br> 8 = Every 3 weeks second occurrence <br> 9 = Every 3 weeks third occurrence <br> 10 = fifth occurrence in month <br> 11 = Every 4 weeks first occurrence <br> 12 = Every 4 weeks second occurrence <br> 13 = Every 4 weeks third occurrence <br> 14 = Every 4 weeks fourth occurrence',
				),
			locationid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the location for this working slot if locations are used in working times',
				),
			calendarintervalid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the period for this working slot if periods are used in working times',
				),
		})
		.strict(),
	workingTimesUpdate: z
		.object({
			id: z
				.number()
				.int()
				.describe('ID of the working time that needs to be changed'),
			start: z
				.string()
				.optional()
				.describe('Start time of the slot, e.g. 09:00'),
			end: z.string().optional().describe('End time of the slot, e.g. 17:00'),
			calendarid: z.number().int().optional().describe('ID of the calendar'),
			weekday: z
				.string()
				.optional()
				.describe(
					'ID of the weekday 1 = Sunday, 7 = Saturday. You can add several weekdays separated by a comma e.g. 2,3,5',
				),
			enable: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if the time slot should exist but not being considered yet',
				),
			slottype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
				),
			validwithserviceid: z
				.string()
				.optional()
				.describe('List of services that work with this working slot'),
			allserviceidsrequired: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
				),
			nrapps: z
				.number()
				.int()
				.optional()
				.describe(
					'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
				),
			weektype: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines in which interval the time slot should be shown <br> 0 = Every week <br> 1 = Odd weeks <br> 2 = Even weeks <br> 3 = First occurrence in month <br> 4 = second occurrence in month <br> 5 = third occurrence in month <br> 6 = fourth occurrence in month <br> 7 = Every 3 weeks first occurrence <br> 8 = Every 3 weeks second occurrence <br> 9 = Every 3 weeks third occurrence <br> 10 = fifth occurrence in month <br> 11 = Every 4 weeks first occurrence <br> 12 = Every 4 weeks second occurrence <br> 13 = Every 4 weeks third occurrence <br> 14 = Every 4 weeks fourth occurrence',
				),
			locationid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the location for this working slot if locations are used in working times',
				),
			calendarintervalid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the period for this working slot if periods are used in working times',
				),
		})
		.strict(),
	workingTimesDelete: z
		.object({
			calendarid: z.number().int().describe('ID of the calendar'),
			id: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the working time that needs to be deleted. If not provided, every working slot of the calendar will be deleted',
				),
		})
		.strict(),
	workingTimeDatesList: z
		.object({
			calendarid: z
				.number()
				.int()
				.describe('CalendarID of the calendar you need the working times for'),
			join: z
				.number()
				.int()
				.optional()
				.describe(
					'Set to 1 for the same information but with names instead of numbers',
				),
			start: z
				.string()
				.optional()
				.describe(
					'Start date from when the workingtimes should be shown. Format needs to be yyyy-mm-dd',
				),
			end: z
				.string()
				.optional()
				.describe(
					'End date until the workingtimes should be shown. Needs the start parameter. Format needs to be yyyy-mm-dd',
				),
		})
		.strict(),
	workingTimeDatesCreate: z
		.object({
			start: z
				.string()
				.describe('Start date/time of working time e.g. 2019-07-14 09:00'),
			end: z
				.string()
				.describe('End date/time of working time e.g. 2019-07-14 18:00'),
			calendarid: z.number().int().describe('ID of the calendar'),
			reason: z
				.string()
				.optional()
				.describe(
					'Reason of the specific working time (this is only visible internally)',
				),
			slottype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
				),
			nrapps: z
				.number()
				.int()
				.optional()
				.describe(
					'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
				),
			overwriteday: z
				.boolean()
				.optional()
				.describe('true, if the workingtime for this day should be disabled'),
			serviceids: z
				.string()
				.optional()
				.describe('List of services that work with this working slot'),
			allserviceidsrequired: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
				),
			locationid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the location for this working slot if locations are used in working times',
				),
			oneoff: z
				.boolean()
				.optional()
				.describe(
					'true, if this timeslot needs a specific link (requires exactly one service for the validwithserviceid parameter)',
				),
			oneoffcode: z
				.string()
				.optional()
				.describe(
					'Specific code that is used for the oneoff-link if oneoff is true',
				),
			waitinglist: z
				.boolean()
				.optional()
				.describe(
					'true, if this timeslot should be filled with appointments from the waitinglist',
				),
		})
		.strict(),
	workingTimeDatesUpdate: z
		.object({
			id: z
				.number()
				.int()
				.describe('ID of the working time that needs to be changed'),
			start: z
				.string()
				.describe('Start date/time of working time e.g. 2019-07-14 09:00'),
			end: z
				.string()
				.describe('End date/time of working time e.g. 2019-07-14 18:00'),
			calendarid: z.number().int().describe('ID of the calendar'),
			reason: z
				.string()
				.optional()
				.describe(
					'Reason of the specific working time (this is only visible internally)',
				),
			slottype: z
				.number()
				.int()
				.optional()
				.describe(
					'0 if time slots should be valid for internal and external (online booked) appointments. 1 if timeslots are only valid for interal (manually entered) appointments',
				),
			nrapps: z
				.number()
				.int()
				.optional()
				.describe(
					'Amount of appointments that are bookable in this working slot. (-1 = unlimited)',
				),
			overwriteday: z
				.boolean()
				.optional()
				.describe('true, if the workingtime for this day should be disabled'),
			serviceids: z
				.string()
				.optional()
				.describe('List of services that work with this working slot'),
			allserviceidsrequired: z
				.number()
				.int()
				.optional()
				.describe(
					'Defines how the validity of the services are checked. Exclusive means that only the services provided with the parameter validwithserviceid are allowed. If not exclusive, every service the calendar is activated for can be used. <br> 0 = one service needs to be selected <br> 1 = all services need to be selected exclusively <br> 2 = all services need to be selected <br> 3 = one service needs to be selected exclusively)',
				),
			locationid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the location for this working slot if locations are used in working times',
				),
			oneoff: z
				.boolean()
				.optional()
				.describe(
					'true, if this timeslot needs a specific link (requires exactly one service for the validwithserviceid parameter)',
				),
			oneoffcode: z
				.string()
				.optional()
				.describe(
					'Specific code that is used for the oneoff-link if oneoff is true',
				),
			waitinglist: z
				.boolean()
				.optional()
				.describe(
					'true, if this timeslot should be filled with appointments from the waitinglist',
				),
		})
		.strict(),
	workingTimeDatesDelete: z
		.object({
			calendarid: z
				.number()
				.int()
				.optional()
				.describe(
					'ID of the calendar, every working slot for specific days will be deleted',
				),
			id: z
				.number()
				.int()
				.optional()
				.describe('ID of the working time that needs to be deleted'),
		})
		.strict()
		.refine(
			(value) => value.calendarid !== undefined || value.id !== undefined,
			{
				message:
					'Provide calendarid or id to delete date-specific working times.',
			},
		),
} as const;

export const ETerminEndpointOutputSchemas = {
	anchorTimesList: z.array(ETerminRecordSchema),
	anchorTimesCreate: ETerminOpaqueResponseSchema,
	anchorTimesUpdate: ETerminOpaqueResponseSchema,
	anchorTimesDelete: ETerminOpaqueResponseSchema,
	anchorTimeDatesList: z.array(ETerminRecordSchema),
	anchorTimeDatesCreate: ETerminOpaqueResponseSchema,
	anchorTimeDatesUpdate: ETerminOpaqueResponseSchema,
	anchorTimeDatesDelete: ETerminOpaqueResponseSchema,
	appointmentsList: z.array(ETerminRecordSchema),
	appointmentsCreate: ETerminRecordSchema,
	appointmentsUpdate: ETerminOpaqueResponseSchema,
	appointmentsDelete: ETerminOpaqueResponseSchema,
	deletedAppointmentsList: z.array(ETerminRecordSchema),
	appointmentSyncList: z.object({
		appointments: z.array(ETerminRecordSchema),
		synctoken: z.number().int(),
	}),
	appointmentSyncCreate: ETerminOpaqueResponseSchema,
	appointmentSyncUpdate: ETerminOpaqueResponseSchema,
	appointmentSyncDelete: ETerminOpaqueResponseSchema,
	bookingPageLogsList: z.array(ETerminRecordSchema),
	calendarsList: z.array(ETerminRecordSchema),
	calendarsCreate: ETerminOpaqueResponseSchema,
	calendarsUpdate: ETerminOpaqueResponseSchema,
	calendarsDelete: ETerminOpaqueResponseSchema,
	calendarReturnTimesList: z.array(ETerminRecordSchema),
	calendarReturnTimesCreate: ETerminOpaqueResponseSchema,
	calendarReturnTimesUpdate: ETerminOpaqueResponseSchema,
	calendarReturnTimesDelete: ETerminOpaqueResponseSchema,
	calendarServicesList: z.array(ETerminRecordSchema),
	calendarServicesCreate: ETerminOpaqueResponseSchema,
	calendarServicesDelete: ETerminOpaqueResponseSchema,
	calendarNonWorkingTimesList: z.array(ETerminRecordSchema),
	calendarNonWorkingTimesCreate: ETerminOpaqueResponseSchema,
	calendarNonWorkingTimesUpdate: ETerminOpaqueResponseSchema,
	calendarNonWorkingTimesDelete: ETerminOpaqueResponseSchema,
	contactsList: z.array(ETerminRecordSchema),
	contactsCreate: ETerminRecordSchema,
	contactsUpdate: ETerminRecordSchema,
	contactsDelete: ETerminRecordSchema,
	contactFrequenciesList: z.array(ETerminRecordSchema),
	contactFrequenciesCreate: ETerminRecordSchema,
	contactServicesList: z.array(ETerminRecordSchema),
	contactServicesCreate: ETerminRecordSchema,
	messageLogsList: z.array(ETerminRecordSchema),
	ratingsList: z.array(ETerminRecordSchema),
	servicesList: z.array(ETerminRecordSchema),
	servicesCreate: ETerminRecordSchema,
	servicesUpdate: ETerminRecordSchema,
	servicesDelete: ETerminOpaqueResponseSchema,
	serviceCalendarsList: z.array(ETerminRecordSchema),
	serviceGroupsList: z.array(ETerminRecordSchema),
	serviceGroupsCreate: ETerminRecordSchema,
	serviceGroupsUpdate: ETerminRecordSchema,
	serviceGroupsDelete: ETerminRecordSchema,
	surveyResultsList: z.array(ETerminRecordSchema),
	timeSlotsList: z.array(ETerminRecordSchema),
	userMappingsList: z.array(ETerminRecordSchema),
	userMappingsCreate: ETerminRecordSchema,
	userMappingsUpdate: ETerminRecordSchema,
	userMappingsDelete: ETerminRecordSchema,
	vouchersList: z.array(ETerminRecordSchema),
	vouchersCreate: ETerminRecordSchema,
	vouchersUpdate: ETerminRecordSchema,
	vouchersDelete: ETerminRecordSchema,
	workingTimesList: z.array(ETerminRecordSchema),
	workingTimesCreate: ETerminRecordSchema,
	workingTimesUpdate: ETerminRecordSchema,
	workingTimesDelete: ETerminRecordSchema,
	workingTimeDatesList: z.array(ETerminRecordSchema),
	workingTimeDatesCreate: ETerminRecordSchema,
	workingTimeDatesUpdate: ETerminRecordSchema,
	workingTimeDatesDelete: ETerminRecordSchema,
} as const;

export type ETerminEndpointInputs = {
	[K in keyof typeof ETerminEndpointInputSchemas]: z.infer<
		(typeof ETerminEndpointInputSchemas)[K]
	>;
};
export type ETerminEndpointOutputs = {
	[K in keyof typeof ETerminEndpointOutputSchemas]: z.infer<
		(typeof ETerminEndpointOutputSchemas)[K]
	>;
};

/** Keeps the generated registry and the executable schemas synchronized. */
export const ETERMIN_OPERATION_COUNT = eTerminOperations.length;
