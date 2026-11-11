import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	anchorTimeDatesCreate,
	anchorTimeDatesDelete,
	anchorTimeDatesList,
	anchorTimeDatesUpdate,
	anchorTimesCreate,
	anchorTimesDelete,
	anchorTimesList,
	anchorTimesUpdate,
	appointmentSyncCreate,
	appointmentSyncDelete,
	appointmentSyncList,
	appointmentSyncUpdate,
	appointmentsCreate,
	appointmentsDelete,
	appointmentsList,
	appointmentsUpdate,
	bookingPageLogsList,
	calendarNonWorkingTimesCreate,
	calendarNonWorkingTimesDelete,
	calendarNonWorkingTimesList,
	calendarNonWorkingTimesUpdate,
	calendarReturnTimesCreate,
	calendarReturnTimesDelete,
	calendarReturnTimesList,
	calendarReturnTimesUpdate,
	calendarServicesCreate,
	calendarServicesDelete,
	calendarServicesList,
	calendarsCreate,
	calendarsDelete,
	calendarsList,
	calendarsUpdate,
	contactFrequenciesCreate,
	contactFrequenciesList,
	contactServicesCreate,
	contactServicesList,
	contactsCreate,
	contactsDelete,
	contactsList,
	contactsUpdate,
	deletedAppointmentsList,
	messageLogsList,
	ratingsList,
	serviceCalendarsList,
	serviceGroupsCreate,
	serviceGroupsDelete,
	serviceGroupsList,
	serviceGroupsUpdate,
	servicesCreate,
	servicesDelete,
	servicesList,
	servicesUpdate,
	surveyResultsList,
	timeSlotsList,
	userMappingsCreate,
	userMappingsDelete,
	userMappingsList,
	userMappingsUpdate,
	vouchersCreate,
	vouchersDelete,
	vouchersList,
	vouchersUpdate,
	workingTimeDatesCreate,
	workingTimeDatesDelete,
	workingTimeDatesList,
	workingTimeDatesUpdate,
	workingTimesCreate,
	workingTimesDelete,
	workingTimesList,
	workingTimesUpdate,
} from '../operations';
import { createETerminEndpoint, createETerminSyncEndpoint } from './factory';
import {
	ETerminEndpointInputSchemas,
	ETerminEndpointOutputSchemas,
} from './types';

/** Literal public endpoint tree for the 70-operation official eTermin contract. */
export const eTerminEndpoints = {
	anchorTimes: {
		list: createETerminEndpoint(anchorTimesList),
		create: createETerminEndpoint(anchorTimesCreate),
		update: createETerminEndpoint(anchorTimesUpdate),
		delete: createETerminEndpoint(anchorTimesDelete),
	},
	anchorTimeDates: {
		list: createETerminEndpoint(anchorTimeDatesList),
		create: createETerminEndpoint(anchorTimeDatesCreate),
		update: createETerminEndpoint(anchorTimeDatesUpdate),
		delete: createETerminEndpoint(anchorTimeDatesDelete),
	},
	appointments: {
		list: createETerminEndpoint(appointmentsList),
		create: createETerminEndpoint(appointmentsCreate),
		update: createETerminEndpoint(appointmentsUpdate),
		delete: createETerminEndpoint(appointmentsDelete),
	},
	deletedAppointments: {
		list: createETerminEndpoint(deletedAppointmentsList),
	},
	appointmentSync: {
		list: createETerminSyncEndpoint(),
		create: createETerminEndpoint(appointmentSyncCreate),
		update: createETerminEndpoint(appointmentSyncUpdate),
		delete: createETerminEndpoint(appointmentSyncDelete),
	},
	bookingPageLogs: {
		list: createETerminEndpoint(bookingPageLogsList),
	},
	calendars: {
		list: createETerminEndpoint(calendarsList),
		create: createETerminEndpoint(calendarsCreate),
		update: createETerminEndpoint(calendarsUpdate),
		delete: createETerminEndpoint(calendarsDelete),
	},
	calendarReturnTimes: {
		list: createETerminEndpoint(calendarReturnTimesList),
		create: createETerminEndpoint(calendarReturnTimesCreate),
		update: createETerminEndpoint(calendarReturnTimesUpdate),
		delete: createETerminEndpoint(calendarReturnTimesDelete),
	},
	calendarServices: {
		list: createETerminEndpoint(calendarServicesList),
		create: createETerminEndpoint(calendarServicesCreate),
		delete: createETerminEndpoint(calendarServicesDelete),
	},
	calendarNonWorkingTimes: {
		list: createETerminEndpoint(calendarNonWorkingTimesList),
		create: createETerminEndpoint(calendarNonWorkingTimesCreate),
		update: createETerminEndpoint(calendarNonWorkingTimesUpdate),
		delete: createETerminEndpoint(calendarNonWorkingTimesDelete),
	},
	contacts: {
		list: createETerminEndpoint(contactsList),
		create: createETerminEndpoint(contactsCreate),
		update: createETerminEndpoint(contactsUpdate),
		delete: createETerminEndpoint(contactsDelete),
	},
	contactFrequencies: {
		list: createETerminEndpoint(contactFrequenciesList),
		create: createETerminEndpoint(contactFrequenciesCreate),
	},
	contactServices: {
		list: createETerminEndpoint(contactServicesList),
		create: createETerminEndpoint(contactServicesCreate),
	},
	messageLogs: {
		list: createETerminEndpoint(messageLogsList),
	},
	ratings: {
		list: createETerminEndpoint(ratingsList),
	},
	services: {
		list: createETerminEndpoint(servicesList),
		create: createETerminEndpoint(servicesCreate),
		update: createETerminEndpoint(servicesUpdate),
		delete: createETerminEndpoint(servicesDelete),
	},
	serviceCalendars: {
		list: createETerminEndpoint(serviceCalendarsList),
	},
	serviceGroups: {
		list: createETerminEndpoint(serviceGroupsList),
		create: createETerminEndpoint(serviceGroupsCreate),
		update: createETerminEndpoint(serviceGroupsUpdate),
		delete: createETerminEndpoint(serviceGroupsDelete),
	},
	surveyResults: {
		list: createETerminEndpoint(surveyResultsList),
	},
	timeSlots: {
		list: createETerminEndpoint(timeSlotsList),
	},
	userMappings: {
		list: createETerminEndpoint(userMappingsList),
		create: createETerminEndpoint(userMappingsCreate),
		update: createETerminEndpoint(userMappingsUpdate),
		delete: createETerminEndpoint(userMappingsDelete),
	},
	vouchers: {
		list: createETerminEndpoint(vouchersList),
		create: createETerminEndpoint(vouchersCreate),
		update: createETerminEndpoint(vouchersUpdate),
		delete: createETerminEndpoint(vouchersDelete),
	},
	workingTimes: {
		list: createETerminEndpoint(workingTimesList),
		create: createETerminEndpoint(workingTimesCreate),
		update: createETerminEndpoint(workingTimesUpdate),
		delete: createETerminEndpoint(workingTimesDelete),
	},
	workingTimeDates: {
		list: createETerminEndpoint(workingTimeDatesList),
		create: createETerminEndpoint(workingTimeDatesCreate),
		update: createETerminEndpoint(workingTimeDatesUpdate),
		delete: createETerminEndpoint(workingTimeDatesDelete),
	},
} as const;

export const eTerminEndpointSchemas = {
	'anchorTimes.list': {
		input: ETerminEndpointInputSchemas.anchorTimesList,
		output: ETerminEndpointOutputSchemas.anchorTimesList,
	},
	'anchorTimes.create': {
		input: ETerminEndpointInputSchemas.anchorTimesCreate,
		output: ETerminEndpointOutputSchemas.anchorTimesCreate,
	},
	'anchorTimes.update': {
		input: ETerminEndpointInputSchemas.anchorTimesUpdate,
		output: ETerminEndpointOutputSchemas.anchorTimesUpdate,
	},
	'anchorTimes.delete': {
		input: ETerminEndpointInputSchemas.anchorTimesDelete,
		output: ETerminEndpointOutputSchemas.anchorTimesDelete,
	},
	'anchorTimeDates.list': {
		input: ETerminEndpointInputSchemas.anchorTimeDatesList,
		output: ETerminEndpointOutputSchemas.anchorTimeDatesList,
	},
	'anchorTimeDates.create': {
		input: ETerminEndpointInputSchemas.anchorTimeDatesCreate,
		output: ETerminEndpointOutputSchemas.anchorTimeDatesCreate,
	},
	'anchorTimeDates.update': {
		input: ETerminEndpointInputSchemas.anchorTimeDatesUpdate,
		output: ETerminEndpointOutputSchemas.anchorTimeDatesUpdate,
	},
	'anchorTimeDates.delete': {
		input: ETerminEndpointInputSchemas.anchorTimeDatesDelete,
		output: ETerminEndpointOutputSchemas.anchorTimeDatesDelete,
	},
	'appointments.list': {
		input: ETerminEndpointInputSchemas.appointmentsList,
		output: ETerminEndpointOutputSchemas.appointmentsList,
	},
	'appointments.create': {
		input: ETerminEndpointInputSchemas.appointmentsCreate,
		output: ETerminEndpointOutputSchemas.appointmentsCreate,
	},
	'appointments.update': {
		input: ETerminEndpointInputSchemas.appointmentsUpdate,
		output: ETerminEndpointOutputSchemas.appointmentsUpdate,
	},
	'appointments.delete': {
		input: ETerminEndpointInputSchemas.appointmentsDelete,
		output: ETerminEndpointOutputSchemas.appointmentsDelete,
	},
	'deletedAppointments.list': {
		input: ETerminEndpointInputSchemas.deletedAppointmentsList,
		output: ETerminEndpointOutputSchemas.deletedAppointmentsList,
	},
	'appointmentSync.list': {
		input: ETerminEndpointInputSchemas.appointmentSyncList,
		output: ETerminEndpointOutputSchemas.appointmentSyncList,
	},
	'appointmentSync.create': {
		input: ETerminEndpointInputSchemas.appointmentSyncCreate,
		output: ETerminEndpointOutputSchemas.appointmentSyncCreate,
	},
	'appointmentSync.update': {
		input: ETerminEndpointInputSchemas.appointmentSyncUpdate,
		output: ETerminEndpointOutputSchemas.appointmentSyncUpdate,
	},
	'appointmentSync.delete': {
		input: ETerminEndpointInputSchemas.appointmentSyncDelete,
		output: ETerminEndpointOutputSchemas.appointmentSyncDelete,
	},
	'bookingPageLogs.list': {
		input: ETerminEndpointInputSchemas.bookingPageLogsList,
		output: ETerminEndpointOutputSchemas.bookingPageLogsList,
	},
	'calendars.list': {
		input: ETerminEndpointInputSchemas.calendarsList,
		output: ETerminEndpointOutputSchemas.calendarsList,
	},
	'calendars.create': {
		input: ETerminEndpointInputSchemas.calendarsCreate,
		output: ETerminEndpointOutputSchemas.calendarsCreate,
	},
	'calendars.update': {
		input: ETerminEndpointInputSchemas.calendarsUpdate,
		output: ETerminEndpointOutputSchemas.calendarsUpdate,
	},
	'calendars.delete': {
		input: ETerminEndpointInputSchemas.calendarsDelete,
		output: ETerminEndpointOutputSchemas.calendarsDelete,
	},
	'calendarReturnTimes.list': {
		input: ETerminEndpointInputSchemas.calendarReturnTimesList,
		output: ETerminEndpointOutputSchemas.calendarReturnTimesList,
	},
	'calendarReturnTimes.create': {
		input: ETerminEndpointInputSchemas.calendarReturnTimesCreate,
		output: ETerminEndpointOutputSchemas.calendarReturnTimesCreate,
	},
	'calendarReturnTimes.update': {
		input: ETerminEndpointInputSchemas.calendarReturnTimesUpdate,
		output: ETerminEndpointOutputSchemas.calendarReturnTimesUpdate,
	},
	'calendarReturnTimes.delete': {
		input: ETerminEndpointInputSchemas.calendarReturnTimesDelete,
		output: ETerminEndpointOutputSchemas.calendarReturnTimesDelete,
	},
	'calendarServices.list': {
		input: ETerminEndpointInputSchemas.calendarServicesList,
		output: ETerminEndpointOutputSchemas.calendarServicesList,
	},
	'calendarServices.create': {
		input: ETerminEndpointInputSchemas.calendarServicesCreate,
		output: ETerminEndpointOutputSchemas.calendarServicesCreate,
	},
	'calendarServices.delete': {
		input: ETerminEndpointInputSchemas.calendarServicesDelete,
		output: ETerminEndpointOutputSchemas.calendarServicesDelete,
	},
	'calendarNonWorkingTimes.list': {
		input: ETerminEndpointInputSchemas.calendarNonWorkingTimesList,
		output: ETerminEndpointOutputSchemas.calendarNonWorkingTimesList,
	},
	'calendarNonWorkingTimes.create': {
		input: ETerminEndpointInputSchemas.calendarNonWorkingTimesCreate,
		output: ETerminEndpointOutputSchemas.calendarNonWorkingTimesCreate,
	},
	'calendarNonWorkingTimes.update': {
		input: ETerminEndpointInputSchemas.calendarNonWorkingTimesUpdate,
		output: ETerminEndpointOutputSchemas.calendarNonWorkingTimesUpdate,
	},
	'calendarNonWorkingTimes.delete': {
		input: ETerminEndpointInputSchemas.calendarNonWorkingTimesDelete,
		output: ETerminEndpointOutputSchemas.calendarNonWorkingTimesDelete,
	},
	'contacts.list': {
		input: ETerminEndpointInputSchemas.contactsList,
		output: ETerminEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: ETerminEndpointInputSchemas.contactsCreate,
		output: ETerminEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: ETerminEndpointInputSchemas.contactsUpdate,
		output: ETerminEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: ETerminEndpointInputSchemas.contactsDelete,
		output: ETerminEndpointOutputSchemas.contactsDelete,
	},
	'contactFrequencies.list': {
		input: ETerminEndpointInputSchemas.contactFrequenciesList,
		output: ETerminEndpointOutputSchemas.contactFrequenciesList,
	},
	'contactFrequencies.create': {
		input: ETerminEndpointInputSchemas.contactFrequenciesCreate,
		output: ETerminEndpointOutputSchemas.contactFrequenciesCreate,
	},
	'contactServices.list': {
		input: ETerminEndpointInputSchemas.contactServicesList,
		output: ETerminEndpointOutputSchemas.contactServicesList,
	},
	'contactServices.create': {
		input: ETerminEndpointInputSchemas.contactServicesCreate,
		output: ETerminEndpointOutputSchemas.contactServicesCreate,
	},
	'messageLogs.list': {
		input: ETerminEndpointInputSchemas.messageLogsList,
		output: ETerminEndpointOutputSchemas.messageLogsList,
	},
	'ratings.list': {
		input: ETerminEndpointInputSchemas.ratingsList,
		output: ETerminEndpointOutputSchemas.ratingsList,
	},
	'services.list': {
		input: ETerminEndpointInputSchemas.servicesList,
		output: ETerminEndpointOutputSchemas.servicesList,
	},
	'services.create': {
		input: ETerminEndpointInputSchemas.servicesCreate,
		output: ETerminEndpointOutputSchemas.servicesCreate,
	},
	'services.update': {
		input: ETerminEndpointInputSchemas.servicesUpdate,
		output: ETerminEndpointOutputSchemas.servicesUpdate,
	},
	'services.delete': {
		input: ETerminEndpointInputSchemas.servicesDelete,
		output: ETerminEndpointOutputSchemas.servicesDelete,
	},
	'serviceCalendars.list': {
		input: ETerminEndpointInputSchemas.serviceCalendarsList,
		output: ETerminEndpointOutputSchemas.serviceCalendarsList,
	},
	'serviceGroups.list': {
		input: ETerminEndpointInputSchemas.serviceGroupsList,
		output: ETerminEndpointOutputSchemas.serviceGroupsList,
	},
	'serviceGroups.create': {
		input: ETerminEndpointInputSchemas.serviceGroupsCreate,
		output: ETerminEndpointOutputSchemas.serviceGroupsCreate,
	},
	'serviceGroups.update': {
		input: ETerminEndpointInputSchemas.serviceGroupsUpdate,
		output: ETerminEndpointOutputSchemas.serviceGroupsUpdate,
	},
	'serviceGroups.delete': {
		input: ETerminEndpointInputSchemas.serviceGroupsDelete,
		output: ETerminEndpointOutputSchemas.serviceGroupsDelete,
	},
	'surveyResults.list': {
		input: ETerminEndpointInputSchemas.surveyResultsList,
		output: ETerminEndpointOutputSchemas.surveyResultsList,
	},
	'timeSlots.list': {
		input: ETerminEndpointInputSchemas.timeSlotsList,
		output: ETerminEndpointOutputSchemas.timeSlotsList,
	},
	'userMappings.list': {
		input: ETerminEndpointInputSchemas.userMappingsList,
		output: ETerminEndpointOutputSchemas.userMappingsList,
	},
	'userMappings.create': {
		input: ETerminEndpointInputSchemas.userMappingsCreate,
		output: ETerminEndpointOutputSchemas.userMappingsCreate,
	},
	'userMappings.update': {
		input: ETerminEndpointInputSchemas.userMappingsUpdate,
		output: ETerminEndpointOutputSchemas.userMappingsUpdate,
	},
	'userMappings.delete': {
		input: ETerminEndpointInputSchemas.userMappingsDelete,
		output: ETerminEndpointOutputSchemas.userMappingsDelete,
	},
	'vouchers.list': {
		input: ETerminEndpointInputSchemas.vouchersList,
		output: ETerminEndpointOutputSchemas.vouchersList,
	},
	'vouchers.create': {
		input: ETerminEndpointInputSchemas.vouchersCreate,
		output: ETerminEndpointOutputSchemas.vouchersCreate,
	},
	'vouchers.update': {
		input: ETerminEndpointInputSchemas.vouchersUpdate,
		output: ETerminEndpointOutputSchemas.vouchersUpdate,
	},
	'vouchers.delete': {
		input: ETerminEndpointInputSchemas.vouchersDelete,
		output: ETerminEndpointOutputSchemas.vouchersDelete,
	},
	'workingTimes.list': {
		input: ETerminEndpointInputSchemas.workingTimesList,
		output: ETerminEndpointOutputSchemas.workingTimesList,
	},
	'workingTimes.create': {
		input: ETerminEndpointInputSchemas.workingTimesCreate,
		output: ETerminEndpointOutputSchemas.workingTimesCreate,
	},
	'workingTimes.update': {
		input: ETerminEndpointInputSchemas.workingTimesUpdate,
		output: ETerminEndpointOutputSchemas.workingTimesUpdate,
	},
	'workingTimes.delete': {
		input: ETerminEndpointInputSchemas.workingTimesDelete,
		output: ETerminEndpointOutputSchemas.workingTimesDelete,
	},
	'workingTimeDates.list': {
		input: ETerminEndpointInputSchemas.workingTimeDatesList,
		output: ETerminEndpointOutputSchemas.workingTimeDatesList,
	},
	'workingTimeDates.create': {
		input: ETerminEndpointInputSchemas.workingTimeDatesCreate,
		output: ETerminEndpointOutputSchemas.workingTimeDatesCreate,
	},
	'workingTimeDates.update': {
		input: ETerminEndpointInputSchemas.workingTimeDatesUpdate,
		output: ETerminEndpointOutputSchemas.workingTimeDatesUpdate,
	},
	'workingTimeDates.delete': {
		input: ETerminEndpointInputSchemas.workingTimeDatesDelete,
		output: ETerminEndpointOutputSchemas.workingTimeDatesDelete,
	},
} satisfies RequiredPluginEndpointSchemas<typeof eTerminEndpoints>;

export const eTerminEndpointMeta = {
	'anchorTimes.list': {
		riskLevel: anchorTimesList.riskLevel,
		description: anchorTimesList.description,
	},
	'anchorTimes.create': {
		riskLevel: anchorTimesCreate.riskLevel,
		description: anchorTimesCreate.description,
	},
	'anchorTimes.update': {
		riskLevel: anchorTimesUpdate.riskLevel,
		description: anchorTimesUpdate.description,
	},
	'anchorTimes.delete': {
		riskLevel: anchorTimesDelete.riskLevel,
		description: anchorTimesDelete.description,
	},
	'anchorTimeDates.list': {
		riskLevel: anchorTimeDatesList.riskLevel,
		description: anchorTimeDatesList.description,
	},
	'anchorTimeDates.create': {
		riskLevel: anchorTimeDatesCreate.riskLevel,
		description: anchorTimeDatesCreate.description,
	},
	'anchorTimeDates.update': {
		riskLevel: anchorTimeDatesUpdate.riskLevel,
		description: anchorTimeDatesUpdate.description,
	},
	'anchorTimeDates.delete': {
		riskLevel: anchorTimeDatesDelete.riskLevel,
		description: anchorTimeDatesDelete.description,
	},
	'appointments.list': {
		riskLevel: appointmentsList.riskLevel,
		description: appointmentsList.description,
	},
	'appointments.create': {
		riskLevel: appointmentsCreate.riskLevel,
		description: appointmentsCreate.description,
	},
	'appointments.update': {
		riskLevel: appointmentsUpdate.riskLevel,
		description: appointmentsUpdate.description,
	},
	'appointments.delete': {
		riskLevel: appointmentsDelete.riskLevel,
		description: appointmentsDelete.description,
	},
	'deletedAppointments.list': {
		riskLevel: deletedAppointmentsList.riskLevel,
		description: deletedAppointmentsList.description,
	},
	'appointmentSync.list': {
		riskLevel: appointmentSyncList.riskLevel,
		description: appointmentSyncList.description,
	},
	'appointmentSync.create': {
		riskLevel: appointmentSyncCreate.riskLevel,
		description: appointmentSyncCreate.description,
	},
	'appointmentSync.update': {
		riskLevel: appointmentSyncUpdate.riskLevel,
		description: appointmentSyncUpdate.description,
	},
	'appointmentSync.delete': {
		riskLevel: appointmentSyncDelete.riskLevel,
		description: appointmentSyncDelete.description,
	},
	'bookingPageLogs.list': {
		riskLevel: bookingPageLogsList.riskLevel,
		description: bookingPageLogsList.description,
	},
	'calendars.list': {
		riskLevel: calendarsList.riskLevel,
		description: calendarsList.description,
	},
	'calendars.create': {
		riskLevel: calendarsCreate.riskLevel,
		description: calendarsCreate.description,
	},
	'calendars.update': {
		riskLevel: calendarsUpdate.riskLevel,
		description: calendarsUpdate.description,
	},
	'calendars.delete': {
		riskLevel: calendarsDelete.riskLevel,
		description: calendarsDelete.description,
	},
	'calendarReturnTimes.list': {
		riskLevel: calendarReturnTimesList.riskLevel,
		description: calendarReturnTimesList.description,
	},
	'calendarReturnTimes.create': {
		riskLevel: calendarReturnTimesCreate.riskLevel,
		description: calendarReturnTimesCreate.description,
	},
	'calendarReturnTimes.update': {
		riskLevel: calendarReturnTimesUpdate.riskLevel,
		description: calendarReturnTimesUpdate.description,
	},
	'calendarReturnTimes.delete': {
		riskLevel: calendarReturnTimesDelete.riskLevel,
		description: calendarReturnTimesDelete.description,
	},
	'calendarServices.list': {
		riskLevel: calendarServicesList.riskLevel,
		description: calendarServicesList.description,
	},
	'calendarServices.create': {
		riskLevel: calendarServicesCreate.riskLevel,
		description: calendarServicesCreate.description,
	},
	'calendarServices.delete': {
		riskLevel: calendarServicesDelete.riskLevel,
		description: calendarServicesDelete.description,
	},
	'calendarNonWorkingTimes.list': {
		riskLevel: calendarNonWorkingTimesList.riskLevel,
		description: calendarNonWorkingTimesList.description,
	},
	'calendarNonWorkingTimes.create': {
		riskLevel: calendarNonWorkingTimesCreate.riskLevel,
		description: calendarNonWorkingTimesCreate.description,
	},
	'calendarNonWorkingTimes.update': {
		riskLevel: calendarNonWorkingTimesUpdate.riskLevel,
		description: calendarNonWorkingTimesUpdate.description,
	},
	'calendarNonWorkingTimes.delete': {
		riskLevel: calendarNonWorkingTimesDelete.riskLevel,
		description: calendarNonWorkingTimesDelete.description,
	},
	'contacts.list': {
		riskLevel: contactsList.riskLevel,
		description: contactsList.description,
	},
	'contacts.create': {
		riskLevel: contactsCreate.riskLevel,
		description: contactsCreate.description,
	},
	'contacts.update': {
		riskLevel: contactsUpdate.riskLevel,
		description: contactsUpdate.description,
	},
	'contacts.delete': {
		riskLevel: contactsDelete.riskLevel,
		description: contactsDelete.description,
	},
	'contactFrequencies.list': {
		riskLevel: contactFrequenciesList.riskLevel,
		description: contactFrequenciesList.description,
	},
	'contactFrequencies.create': {
		riskLevel: contactFrequenciesCreate.riskLevel,
		description: contactFrequenciesCreate.description,
	},
	'contactServices.list': {
		riskLevel: contactServicesList.riskLevel,
		description: contactServicesList.description,
	},
	'contactServices.create': {
		riskLevel: contactServicesCreate.riskLevel,
		description: contactServicesCreate.description,
	},
	'messageLogs.list': {
		riskLevel: messageLogsList.riskLevel,
		description: messageLogsList.description,
	},
	'ratings.list': {
		riskLevel: ratingsList.riskLevel,
		description: ratingsList.description,
	},
	'services.list': {
		riskLevel: servicesList.riskLevel,
		description: servicesList.description,
	},
	'services.create': {
		riskLevel: servicesCreate.riskLevel,
		description: servicesCreate.description,
	},
	'services.update': {
		riskLevel: servicesUpdate.riskLevel,
		description: servicesUpdate.description,
	},
	'services.delete': {
		riskLevel: servicesDelete.riskLevel,
		description: servicesDelete.description,
	},
	'serviceCalendars.list': {
		riskLevel: serviceCalendarsList.riskLevel,
		description: serviceCalendarsList.description,
	},
	'serviceGroups.list': {
		riskLevel: serviceGroupsList.riskLevel,
		description: serviceGroupsList.description,
	},
	'serviceGroups.create': {
		riskLevel: serviceGroupsCreate.riskLevel,
		description: serviceGroupsCreate.description,
	},
	'serviceGroups.update': {
		riskLevel: serviceGroupsUpdate.riskLevel,
		description: serviceGroupsUpdate.description,
	},
	'serviceGroups.delete': {
		riskLevel: serviceGroupsDelete.riskLevel,
		description: serviceGroupsDelete.description,
	},
	'surveyResults.list': {
		riskLevel: surveyResultsList.riskLevel,
		description: surveyResultsList.description,
	},
	'timeSlots.list': {
		riskLevel: timeSlotsList.riskLevel,
		description: timeSlotsList.description,
	},
	'userMappings.list': {
		riskLevel: userMappingsList.riskLevel,
		description: userMappingsList.description,
	},
	'userMappings.create': {
		riskLevel: userMappingsCreate.riskLevel,
		description: userMappingsCreate.description,
	},
	'userMappings.update': {
		riskLevel: userMappingsUpdate.riskLevel,
		description: userMappingsUpdate.description,
	},
	'userMappings.delete': {
		riskLevel: userMappingsDelete.riskLevel,
		description: userMappingsDelete.description,
	},
	'vouchers.list': {
		riskLevel: vouchersList.riskLevel,
		description: vouchersList.description,
	},
	'vouchers.create': {
		riskLevel: vouchersCreate.riskLevel,
		description: vouchersCreate.description,
	},
	'vouchers.update': {
		riskLevel: vouchersUpdate.riskLevel,
		description: vouchersUpdate.description,
	},
	'vouchers.delete': {
		riskLevel: vouchersDelete.riskLevel,
		description: vouchersDelete.description,
	},
	'workingTimes.list': {
		riskLevel: workingTimesList.riskLevel,
		description: workingTimesList.description,
	},
	'workingTimes.create': {
		riskLevel: workingTimesCreate.riskLevel,
		description: workingTimesCreate.description,
	},
	'workingTimes.update': {
		riskLevel: workingTimesUpdate.riskLevel,
		description: workingTimesUpdate.description,
	},
	'workingTimes.delete': {
		riskLevel: workingTimesDelete.riskLevel,
		description: workingTimesDelete.description,
	},
	'workingTimeDates.list': {
		riskLevel: workingTimeDatesList.riskLevel,
		description: workingTimeDatesList.description,
	},
	'workingTimeDates.create': {
		riskLevel: workingTimeDatesCreate.riskLevel,
		description: workingTimeDatesCreate.description,
	},
	'workingTimeDates.update': {
		riskLevel: workingTimeDatesUpdate.riskLevel,
		description: workingTimeDatesUpdate.description,
	},
	'workingTimeDates.delete': {
		riskLevel: workingTimeDatesDelete.riskLevel,
		description: workingTimeDatesDelete.description,
	},
} satisfies RequiredPluginEndpointMeta<typeof eTerminEndpoints>;
