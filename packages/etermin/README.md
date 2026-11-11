# @corsair-dev/etermin

ETermin plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/etermin
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `anchorTimeDates.create` | `etermin.api.anchorTimeDates.create` | `write` | Use this function to create a new anchortime for a specific date. |
| `anchorTimeDates.delete` | `etermin.api.anchorTimeDates.delete` | `destructive` | Use this function to delete an anchortime by date. |
| `anchorTimeDates.list` | `etermin.api.anchorTimeDates.list` | `read` | Use this function if you want to get all information about anchortimes by date. |
| `anchorTimeDates.update` | `etermin.api.anchorTimeDates.update` | `write` | Use this function to update an anchortime by date. |
| `anchorTimes.create` | `etermin.api.anchorTimes.create` | `write` | Use this function to create a new weekly anchortime. |
| `anchorTimes.delete` | `etermin.api.anchorTimes.delete` | `destructive` | Use this function to delete a weekly anchortime. |
| `anchorTimes.list` | `etermin.api.anchorTimes.list` | `read` | Use this function if you want to get all information about weekly anchortimes. |
| `anchorTimes.update` | `etermin.api.anchorTimes.update` | `write` | Use this function to update a weekly anchortime. |
| `appointments.create` | `etermin.api.appointments.create` | `write` | Use this function to create a new appointment in the eTermin calendar |
| `appointments.delete` | `etermin.api.appointments.delete` | `destructive` | Use this function to delete an appointment in the eTermin calendar. You can either use the id of a specific appointment or the start/end parameters to delete all appointments within a specific time span. |
| `appointments.list` | `etermin.api.appointments.list` | `read` | Use this function if you want to get all appointment details that are stored on the eTermin platform. You can use the start/end parameters the get all appointments within a specific time span or the id parameter to get the appointment details of a specific appointment. <br><b>At least one parameter is mandatory!</b> |
| `appointments.update` | `etermin.api.appointments.update` | `write` | Use this function if you want to update details of an existing appointment. |
| `appointmentSync.create` | `etermin.api.appointmentSync.create` | `write` | Create a new appointment |
| `appointmentSync.delete` | `etermin.api.appointmentSync.delete` | `destructive` | Use this function to delete an appointment in the eTermin calendar. You can either use the id of a specific appointment or the start/end parameters to delete all appointments within a specific time span. |
| `appointmentSync.list` | `etermin.api.appointmentSync.list` | `read` | Gets all inserted (I), modified (U) and deleted (D) appointments that were modified on the eTermin platform. The parameter 'SyncStatus' contains the status of the appointment (U, I, D). You can call this function e.g. every 5 minutes to get all appointments that were added, modified or deleted within the last 5 minutes on the eTermin platform. Important: If the SyncStatus returns 'U' and the appointment does not exist in your application, please insert this appointment in your application. There can be cases that the 'SyncStatus' returns 'U' although the appointment does not yet exist in your application. |
| `appointmentSync.update` | `etermin.api.appointmentSync.update` | `write` | Update an existing appointment |
| `bookingPageLogs.list` | `etermin.api.bookingPageLogs.list` | `read` | Use this function if you want to get all requests of your booking page. You can only get the booking page requests of the last 30 days. |
| `calendarNonWorkingTimes.create` | `etermin.api.calendarNonWorkingTimes.create` | `write` | Use this function to create a new absence. |
| `calendarNonWorkingTimes.delete` | `etermin.api.calendarNonWorkingTimes.delete` | `destructive` | Use this function to delete an absence. |
| `calendarNonWorkingTimes.list` | `etermin.api.calendarNonWorkingTimes.list` | `read` | Use this function if you want to get information about absences for a calendar. |
| `calendarNonWorkingTimes.update` | `etermin.api.calendarNonWorkingTimes.update` | `write` | Use this function to update an absence. |
| `calendarReturnTimes.create` | `etermin.api.calendarReturnTimes.create` | `write` | Use this function to create a new return time. |
| `calendarReturnTimes.delete` | `etermin.api.calendarReturnTimes.delete` | `destructive` | Use this function to delete a return time by its ID. |
| `calendarReturnTimes.list` | `etermin.api.calendarReturnTimes.list` | `read` | Use this function if you want to get information about return times for a calendar. |
| `calendarReturnTimes.update` | `etermin.api.calendarReturnTimes.update` | `write` | Use this function to update a return time. |
| `calendars.create` | `etermin.api.calendars.create` | `write` | Use this function to create a new calendar |
| `calendars.delete` | `etermin.api.calendars.delete` | `destructive` | Use this function if you want to delete a calendar |
| `calendars.list` | `etermin.api.calendars.list` | `read` | Returns all calendars that are available for the specific account. |
| `calendars.update` | `etermin.api.calendars.update` | `write` | Use this function if you want to update details of an existing calendar/employee/ressource. |
| `calendarServices.create` | `etermin.api.calendarServices.create` | `write` | Creates a new service assignment of a calendar |
| `calendarServices.delete` | `etermin.api.calendarServices.delete` | `destructive` | Use this function if you want to delete a calendar/service assignment |
| `calendarServices.list` | `etermin.api.calendarServices.list` | `read` | Returns all assigned services of a calendar |
| `contactFrequencies.create` | `etermin.api.contactFrequencies.create` | `write` | Creates contact frequency that limites the amount of bookings a contact can have. The login on the booking page has to be activated to use this function. |
| `contactFrequencies.list` | `etermin.api.contactFrequencies.list` | `read` | Returns the frequency setting of the contact. |
| `contacts.create` | `etermin.api.contacts.create` | `write` | Creates a new contact. You can see the new contact in the eTermin CRM. |
| `contacts.delete` | `etermin.api.contacts.delete` | `destructive` | Use this function if you want to delete a contact in the eTermin CRM. You can either use the email address or the ID to delete the contact. |
| `contacts.list` | `etermin.api.contacts.list` | `read` | Returns a list with all contacts that are maintained in the eTermin CRM. |
| `contacts.update` | `etermin.api.contacts.update` | `write` | Use this function if you want to update details of an existing contact. |
| `contactServices.create` | `etermin.api.contactServices.create` | `write` | Creates contact permission to specific service groups. The login on the booking page has to be activated to use this function. |
| `contactServices.list` | `etermin.api.contactServices.list` | `read` | Returns a list of the permissions of the contact. |
| `deletedAppointments.list` | `etermin.api.deletedAppointments.list` | `read` | Returns all appointments that got deleted during the specified time span. |
| `messageLogs.list` | `etermin.api.messageLogs.list` | `read` | Returns a list with all messages that are sent via eTermin. Note: You can only get the list for the last 30 days or less, depending on your privacy settings in the account |
| `ratings.list` | `etermin.api.ratings.list` | `read` | Returns all the ratings that were received from the customers. |
| `serviceCalendars.list` | `etermin.api.serviceCalendars.list` | `read` | Returns a list of all calendars that are compatible with one of the provided serviceid(s) |
| `serviceGroups.create` | `etermin.api.serviceGroups.create` | `write` | Creates a new service group |
| `serviceGroups.delete` | `etermin.api.serviceGroups.delete` | `destructive` | Use this function if you want to delete a service group. All services that are linked to this service group will be deleted automatically as well. |
| `serviceGroups.list` | `etermin.api.serviceGroups.list` | `read` | Returns all service groups that are available for the specific account. |
| `serviceGroups.update` | `etermin.api.serviceGroups.update` | `write` | Updates attributes of a service group |
| `services.create` | `etermin.api.services.create` | `write` | Use this function if you want to create a service. Note: Most services only need the first few parameters. However, since the services are very versatile, they have much more parameters, especially because they may override global settings. |
| `services.delete` | `etermin.api.services.delete` | `destructive` | Use this function if you want to delete a service. |
| `services.list` | `etermin.api.services.list` | `read` | Use this function if you want to get details of an existing service or all services. |
| `services.update` | `etermin.api.services.update` | `write` | Use this function if you want to update details of an existing service. |
| `surveyResults.list` | `etermin.api.surveyResults.list` | `read` | Returns all survey results that were received from the customers. |
| `timeSlots.list` | `etermin.api.timeSlots.list` | `read` | Get available time slots of a specific day or a time range.<br><br> <font color=red>Important:</font> Please pay attention that <b>some fields might be mandatory</b> to not get an empty response, <b>depending how the account is set up</b> (for example serviceid). |
| `userMappings.create` | `etermin.api.userMappings.create` | `write` | Usermapping is used for the number search. Use this function to create a new entry for the number search. |
| `userMappings.delete` | `etermin.api.userMappings.delete` | `destructive` | Usermapping is used for the number search. Use this function to update an existing entry for the number search. |
| `userMappings.list` | `etermin.api.userMappings.list` | `read` | Usermapping is used for the number search. Use this function to validate a searchvalue to get the according calendarids and servicegroupids |
| `userMappings.update` | `etermin.api.userMappings.update` | `write` | Usermapping is used for the number search. Use this function to update an existing entry for the number search. |
| `vouchers.create` | `etermin.api.vouchers.create` | `write` | Creates a new voucher |
| `vouchers.delete` | `etermin.api.vouchers.delete` | `destructive` | Use this function if you want to delete a voucher. Use one of the given parameters! |
| `vouchers.list` | `etermin.api.vouchers.list` | `read` | Returns a list with all vouchers |
| `vouchers.update` | `etermin.api.vouchers.update` | `write` | Update an existing voucher |
| `workingTimeDates.create` | `etermin.api.workingTimeDates.create` | `write` | Creates a new working slot for a specific day |
| `workingTimeDates.delete` | `etermin.api.workingTimeDates.delete` | `destructive` | Delete a working slot for a specific date. Only one of the following parameters are needed |
| `workingTimeDates.list` | `etermin.api.workingTimeDates.list` | `read` | Get working time slots for specific dates |
| `workingTimeDates.update` | `etermin.api.workingTimeDates.update` | `write` | Update an existing working slot for a specific date |
| `workingTimes.create` | `etermin.api.workingTimes.create` | `write` | Creates a new working slot |
| `workingTimes.delete` | `etermin.api.workingTimes.delete` | `destructive` | Deletes a working slot |
| `workingTimes.list` | `etermin.api.workingTimes.list` | `read` | Get working time slots for weekdays |
| `workingTimes.update` | `etermin.api.workingTimes.update` | `write` | Update an existing working slot |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/etermin

## License

Apache-2.0
