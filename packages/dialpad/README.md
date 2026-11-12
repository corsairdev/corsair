# @corsair-dev/dialpad

Dialpad's documented REST operations for company calling, contacts, users, call centers, numbers, reporting, Dialpad Meetings, WFM, and PowerDialer.

## Authentication

Dialpad documents two supported Bearer-token paths:

- **API key:** a company admin creates a key in Admin Settings. Configure Corsair with `authType: 'api_key'`; the plugin sends `Authorization: Bearer <api_key>`.
- **OAuth 2:** Dialpad's authorization-code flow vends a Bearer access token on behalf of a user. Configure Corsair with `authType: 'oauth_2'`; the plugin reads the stored access token and sends it as Bearer auth, refreshing it through Dialpad's documented token endpoint when needed. The app's `client_id` and `client_secret` are OAuth application credentials, not an API-key auth method. Initial authorization-code exchange remains part of OAuth setup rather than an exposed resource endpoint.

Official setup: [API key generation](https://developers.dialpad.com/docs/api-key-generation), [OAuth](https://developers.dialpad.com/docs/oauth).

Use `environment: 'sandbox'` for `https://sandbox.dialpad.com`; the default is production `https://dialpad.com`. Every route below uses `/api/v2` unless explicitly indicated.

## Request and response behavior

Every operation has a strict Zod input and output schema. Path parameters go under `path`, query parameters under `query`, and JSON request bodies under `body`. List operations preserve the documented cursor and other pagination arguments. Error handling preserves rate-limit metadata including `Retry-After`; automatic retries are disabled to avoid duplicating non-idempotent operations. Call, SMS, callback, billing, anonymization, and other writes may have provider-side effects or permission requirements; check the linked provider reference and the operation metadata before use.

Operations whose official success response documents no content return `undefined` after the HTTP response is checked.

The legacy [Report Download API](https://developers.dialpad.com/page/report-download-api.md) returns report bytes but does not document a successful media type. `reports.scheduledstats.download` returns `{ kind: 'binary', contentType, base64, sizeBytes }`, reads with a 20-second timeout, and caps responses at 25 MiB. The cap and timeout are plugin safety guards, not provider-published limits.

The [recording download guide](https://developers.dialpad.com/docs/downloading-call-recordings.md) documents call, voicemail, and admin recording URLs as MP3 downloads. These return the same bounded binary envelope; admin recording downloads require a share-link ID created by `recording_share_link.create`. The provider does not publish sandbox recording URLs or a maximum file size, so those routes are production-host only with the same 20-second timeout and 25 MiB plugin safety cap.

## Operations

350 documented request/response operations are implemented. The route and official per-operation reference for each are listed below.

| Corsair operation | Method | Route | Documentation |
|---|---:|---|---|
| `accesscontrolpolicies.assign` | POST | `/api/v2/accesscontrolpolicies/{id}/assign` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesassign.md) |
| `accesscontrolpolicies.delete` | DELETE | `/api/v2/accesscontrolpolicies/{id}` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesdelete.md) |
| `accesscontrolpolicies.update` | PATCH | `/api/v2/accesscontrolpolicies/{id}` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesupdate.md) |
| `agentgroup.get` | GET | `/api/v2/agent-groups/{id}` | [Official reference](https://developers.dialpad.com/reference/agentgroupget.md) |
| `anonymization.requests.get` | GET | `/api/v2/anonymization/requests/{request_id}` | [Official reference](https://developers.dialpad.com/reference/anonymizationrequestsget.md) |
| `accesscontrolpolicies.list` | GET | `/api/v2/accesscontrolpolicies` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpolicieslist.md) |
| `accesscontrolpolicies.unassign` | POST | `/api/v2/accesscontrolpolicies/{id}/unassign` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesunassign.md) |
| `accesscontrolpolicies.create` | POST | `/api/v2/accesscontrolpolicies` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciescreate.md) |
| `accesscontrolpolicies.assignments` | GET | `/api/v2/accesscontrolpolicies/{id}/assignments` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesassignments.md) |
| `anonymization.contacts` | POST | `/api/v2/anonymization/contacts` | [Official reference](https://developers.dialpad.com/reference/anonymizationcontacts.md) |
| `accesscontrolpolicies.get` | GET | `/api/v2/accesscontrolpolicies/{id}` | [Official reference](https://developers.dialpad.com/reference/accesscontrolpoliciesget.md) |
| `app_settings.get` | GET | `/api/v2/app/settings` | [Official reference](https://developers.dialpad.com/reference/app_settingsget.md) |
| `blockednumbers.get` | GET | `/api/v2/blockednumbers/{number}` | [Official reference](https://developers.dialpad.com/reference/blockednumbersget.md) |
| `available_numbers.list` | GET | `/api/v2/available-numbers` | [Official reference](https://developers.dialpad.com/reference/available_numberslist.md) |
| `blockednumbers.add` | POST | `/api/v2/blockednumbers/add` | [Official reference](https://developers.dialpad.com/reference/blockednumbersadd.md) |
| `blockednumbers.list` | GET | `/api/v2/blockednumbers` | [Official reference](https://developers.dialpad.com/reference/blockednumberslist.md) |
| `blockednumbers.remove` | POST | `/api/v2/blockednumbers/remove` | [Official reference](https://developers.dialpad.com/reference/blockednumbersremove.md) |
| `call.assign` | POST | `/api/v2/call/{id}/assign` | [Official reference](https://developers.dialpad.com/reference/callassign.md) |
| `call.get_assigned_operators` | GET | `/api/v2/call/{id}/assigned` | [Official reference](https://developers.dialpad.com/reference/callget_assigned_operators.md) |
| `anonymization.callcontent` | POST | `/api/v2/anonymization/callcontent` | [Official reference](https://developers.dialpad.com/reference/anonymizationcallcontent.md) |
| `call.get_ai_recap` | GET | `/api/v2/call/{id}/ai_recap` | [Official reference](https://developers.dialpad.com/reference/callget_ai_recap.md) |
| `call.participants.add` | POST | `/api/v2/call/{id}/participants/add` | [Official reference](https://developers.dialpad.com/reference/callparticipantsadd.md) |
| `call.list` | GET | `/api/v2/call` | [Official reference](https://developers.dialpad.com/reference/calllist.md) |
| `call.initiate_ivr_call` | POST | `/api/v2/call/initiate_ivr_call` | [Official reference](https://developers.dialpad.com/reference/callinitiate_ivr_call.md) |
| `call.unassign_all_call_operators` | POST | `/api/v2/call/{id}/unassign/all` | [Official reference](https://developers.dialpad.com/reference/callunassign_all_call_operators.md) |
| `call.transfer_call` | POST | `/api/v2/call/{id}/transfer` | [Official reference](https://developers.dialpad.com/reference/calltransfer_call.md) |
| `call.get_call_info` | GET | `/api/v2/call/{id}` | [Official reference](https://developers.dialpad.com/reference/callget_call_info.md) |
| `call.unassign_operator` | POST | `/api/v2/call/{id}/unassign` | [Official reference](https://developers.dialpad.com/reference/callunassign_operator.md) |
| `call.unpark` | POST | `/api/v2/call/{id}/unpark` | [Official reference](https://developers.dialpad.com/reference/callunpark.md) |
| `call.initiate` | POST | `/api/v2/call` | [Official reference](https://developers.dialpad.com/reference/callinitiate.md) |
| `call.add_labels` | PUT | `/api/v2/call/{id}/labels` | [Official reference](https://developers.dialpad.com/reference/calladd_labels.md) |
| `call.hangup` | PUT | `/api/v2/call/{id}/actions/hangup` | [Official reference](https://developers.dialpad.com/reference/callhangup.md) |
| `callbacks.list` | GET | `/api/v2/callback` | [Official reference](https://developers.dialpad.com/reference/callbackslist.md) |
| `callback.validate` | POST | `/api/v2/callback/validate` | [Official reference](https://developers.dialpad.com/reference/callbackvalidate.md) |
| `callcenters.listall` | GET | `/api/v2/callcenters` | [Official reference](https://developers.dialpad.com/reference/callcenterslistall.md) |
| `callcenters.get` | GET | `/api/v2/callcenters/{id}` | [Official reference](https://developers.dialpad.com/reference/callcentersget.md) |
| `callcenters.update` | PATCH | `/api/v2/callcenters/{id}` | [Official reference](https://developers.dialpad.com/reference/callcentersupdate.md) |
| `callcenters.create` | POST | `/api/v2/callcenters` | [Official reference](https://developers.dialpad.com/reference/callcenterscreate.md) |
| `callback.enqueue` | POST | `/api/v2/callback` | [Official reference](https://developers.dialpad.com/reference/callbackenqueue.md) |
| `callcenters.delete` | DELETE | `/api/v2/callcenters/{id}` | [Official reference](https://developers.dialpad.com/reference/callcentersdelete.md) |
| `callcenters.get_status` | GET | `/api/v2/callcenters/{id}/status` | [Official reference](https://developers.dialpad.com/reference/callcentersget_status.md) |
| `callcenters.operators.update_duty_status` | PATCH | `/api/v2/callcenters/operators/{id}/dutystatus` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsupdate_duty_status.md) |
| `callcenters.operators.get_skill_level` | GET | `/api/v2/callcenters/{call_center_id}/operators/{user_id}/skill` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsget_skill_level.md) |
| `callcenters.operators.get_duty_status` | GET | `/api/v2/callcenters/operators/{id}/dutystatus` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsget_duty_status.md) |
| `callcenters.operators.update_skill_level` | PATCH | `/api/v2/callcenters/{call_center_id}/operators/{user_id}/skill` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsupdate_skill_level.md) |
| `callcenters.operators.add` | POST | `/api/v2/callcenters/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsadd.md) |
| `callcenters.queue.list` | GET | `/api/v2/callcenters/{id}/queue` | [Official reference](https://developers.dialpad.com/reference/callcentersqueuelist.md) |
| `callcenters.operators.delete` | DELETE | `/api/v2/callcenters/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorsdelete.md) |
| `call_labels.list` | GET | `/api/v2/calllabels` | [Official reference](https://developers.dialpad.com/reference/call_labelslist.md) |
| `call_review_share_link.get` | GET | `/api/v2/callreviewsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/call_review_share_linkget.md) |
| `call_review_share_link.create` | POST | `/api/v2/callreviewsharelink` | [Official reference](https://developers.dialpad.com/reference/call_review_share_linkcreate.md) |
| `call_review_share_link.delete` | DELETE | `/api/v2/callreviewsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/call_review_share_linkdelete.md) |
| `callrouters.list` | GET | `/api/v2/callrouters` | [Official reference](https://developers.dialpad.com/reference/callrouterslist.md) |
| `callcenters.operators.list` | GET | `/api/v2/callcenters/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/callcentersoperatorslist.md) |
| `callrouters.delete` | DELETE | `/api/v2/callrouters/{id}` | [Official reference](https://developers.dialpad.com/reference/callroutersdelete.md) |
| `callrouters.create` | POST | `/api/v2/callrouters` | [Official reference](https://developers.dialpad.com/reference/callrouterscreate.md) |
| `callrouters.get` | GET | `/api/v2/callrouters/{id}` | [Official reference](https://developers.dialpad.com/reference/callroutersget.md) |
| `call_review_share_link.update` | PUT | `/api/v2/callreviewsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/call_review_share_linkupdate.md) |
| `callrouters.update` | PATCH | `/api/v2/callrouters/{id}` | [Official reference](https://developers.dialpad.com/reference/callroutersupdate.md) |
| `numbers.assign_call_router_number.post` | POST | `/api/v2/callrouters/{id}/assign_number` | [Official reference](https://developers.dialpad.com/reference/numbersassign_call_router_numberpost.md) |
| `channels.delete` | DELETE | `/api/v2/channels/{id}` | [Official reference](https://developers.dialpad.com/reference/channelsdelete.md) |
| `channels.get` | GET | `/api/v2/channels/{id}` | [Official reference](https://developers.dialpad.com/reference/channelsget.md) |
| `channels.members.list` | GET | `/api/v2/channels/{id}/members` | [Official reference](https://developers.dialpad.com/reference/channelsmemberslist.md) |
| `channels.list` | GET | `/api/v2/channels` | [Official reference](https://developers.dialpad.com/reference/channelslist.md) |
| `coaching_team.get` | GET | `/api/v2/coachingteams/{id}` | [Official reference](https://developers.dialpad.com/reference/coaching_teamget.md) |
| `coaching_team.members.get` | GET | `/api/v2/coachingteams/{id}/members` | [Official reference](https://developers.dialpad.com/reference/coaching_teammembersget.md) |
| `channels.create` | POST | `/api/v2/channels` | [Official reference](https://developers.dialpad.com/reference/channelscreate.md) |
| `channels.members.delete` | DELETE | `/api/v2/channels/{id}/members` | [Official reference](https://developers.dialpad.com/reference/channelsmembersdelete.md) |
| `channels.members.add` | POST | `/api/v2/channels/{id}/members` | [Official reference](https://developers.dialpad.com/reference/channelsmembersadd.md) |
| `coaching_team.listall` | GET | `/api/v2/coachingteams` | [Official reference](https://developers.dialpad.com/reference/coaching_teamlistall.md) |
| `company.get` | GET | `/api/v2/company` | [Official reference](https://developers.dialpad.com/reference/companyget.md) |
| `company.sms_opt_out` | GET | `/api/v2/company/{id}/smsoptout` | [Official reference](https://developers.dialpad.com/reference/companysms_opt_out.md) |
| `company.update_settings` | PUT | `/api/v2/company/settings` | [Official reference](https://developers.dialpad.com/reference/companyupdate_settings.md) |
| `coaching_team.members.add` | POST | `/api/v2/coachingteams/{id}/members` | [Official reference](https://developers.dialpad.com/reference/coaching_teammembersadd.md) |
| `company.get_ai_settings` | GET | `/api/v2/company/ai-settings` | [Official reference](https://developers.dialpad.com/reference/companyget_ai_settings.md) |
| `company.update` | PATCH | `/api/v2/company` | [Official reference](https://developers.dialpad.com/reference/companyupdate.md) |
| `company.update_ai_settings` | PATCH | `/api/v2/company/ai-settings` | [Official reference](https://developers.dialpad.com/reference/companyupdate_ai_settings.md) |
| `contacts.delete` | DELETE | `/api/v2/contacts/{id}` | [Official reference](https://developers.dialpad.com/reference/contactsdelete.md) |
| `contacts.update` | PATCH | `/api/v2/contacts/{id}` | [Official reference](https://developers.dialpad.com/reference/contactsupdate.md) |
| `contacts.list` | GET | `/api/v2/contacts` | [Official reference](https://developers.dialpad.com/reference/contactslist.md) |
| `contacts.get` | GET | `/api/v2/contacts/{id}` | [Official reference](https://developers.dialpad.com/reference/contactsget.md) |
| `contacts.create` | POST | `/api/v2/contacts` | [Official reference](https://developers.dialpad.com/reference/contactscreate.md) |
| `contacts.create_with_uid` | PUT | `/api/v2/contacts` | [Official reference](https://developers.dialpad.com/reference/contactscreate_with_uid.md) |
| `ivr.delete` | DELETE | `/api/v2/customivrs/{target_type}/{target_id}/{ivr_type}` | [Official reference](https://developers.dialpad.com/reference/ivrdelete.md) |
| `contacts.search` | GET | `/api/v2/contacts/search` | [Official reference](https://developers.dialpad.com/reference/contactssearch.md) |
| `ivr.assign` | PATCH | `/api/v2/customivrs/{target_type}/{target_id}/{ivr_type}` | [Official reference](https://developers.dialpad.com/reference/ivrassign.md) |
| `custom_ivrs.list` | GET | `/api/v2/customivrs` | [Official reference](https://developers.dialpad.com/reference/custom_ivrslist.md) |
| `ivr.update_details` | PATCH | `/api/v2/customivrs/{ivr_id}` | [Official reference](https://developers.dialpad.com/reference/ivrupdate_details.md) |
| `departments.delete` | DELETE | `/api/v2/departments/{id}` | [Official reference](https://developers.dialpad.com/reference/departmentsdelete.md) |
| `ivr.create` | POST | `/api/v2/customivrs` | [Official reference](https://developers.dialpad.com/reference/ivrcreate.md) |
| `departments.update` | PATCH | `/api/v2/departments/{id}` | [Official reference](https://developers.dialpad.com/reference/departmentsupdate.md) |
| `departments.create` | POST | `/api/v2/departments` | [Official reference](https://developers.dialpad.com/reference/departmentscreate.md) |
| `departments.listall` | GET | `/api/v2/departments` | [Official reference](https://developers.dialpad.com/reference/departmentslistall.md) |
| `departments.get` | GET | `/api/v2/departments/{id}` | [Official reference](https://developers.dialpad.com/reference/departmentsget.md) |
| `departments.operators.delete` | DELETE | `/api/v2/departments/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/departmentsoperatorsdelete.md) |
| `dispositions.delete` | DELETE | `/api/v2/dispositions/{id}` | [Official reference](https://developers.dialpad.com/reference/dispositionsdelete.md) |
| `digital.sessions.list` | GET | `/api/v2/digital/sessionsdata` | [Official reference](https://developers.dialpad.com/reference/digitalsessionslist.md) |
| `dispositions.update` | PATCH | `/api/v2/dispositions/{id}` | [Official reference](https://developers.dialpad.com/reference/dispositionsupdate.md) |
| `dispositions.get` | GET | `/api/v2/dispositions/{id}` | [Official reference](https://developers.dialpad.com/reference/dispositionsget.md) |
| `departments.operators.list` | GET | `/api/v2/departments/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/departmentsoperatorslist.md) |
| `dispositions.list` | GET | `/api/v2/dispositions` | [Official reference](https://developers.dialpad.com/reference/dispositionslist.md) |
| `dispositions.create` | POST | `/api/v2/dispositions` | [Official reference](https://developers.dialpad.com/reference/dispositionscreate.md) |
| `departments.operators.add` | POST | `/api/v2/departments/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/departmentsoperatorsadd.md) |
| `faxline.assign` | POST | `/api/v2/faxline` | [Official reference](https://developers.dialpad.com/reference/faxlineassign.md) |
| `bulk_messages.get` | GET | `/api/v2/message/bulk/{id}` | [Official reference](https://developers.dialpad.com/reference/bulk_messagesget.md) |
| `fax.send` | POST | `/api/v2/fax` | [Official reference](https://developers.dialpad.com/reference/faxsend.md) |
| `bulk_messages.send` | POST | `/api/v2/message/bulk` | [Official reference](https://developers.dialpad.com/reference/bulk_messagessend.md) |
| `scheduled_messages.create` | POST | `/api/v2/message/schedule` | [Official reference](https://developers.dialpad.com/reference/scheduled_messagescreate.md) |
| `scheduled_messages.delete` | DELETE | `/api/v2/message/schedule/{id}` | [Official reference](https://developers.dialpad.com/reference/scheduled_messagesdelete.md) |
| `bulk_messages.update` | PATCH | `/api/v2/message/bulk/{id}` | [Official reference](https://developers.dialpad.com/reference/bulk_messagesupdate.md) |
| `bulk_messages.list` | GET | `/api/v2/message/bulk` | [Official reference](https://developers.dialpad.com/reference/bulk_messageslist.md) |
| `scheduled_messages.list` | GET | `/api/v2/message/schedule` | [Official reference](https://developers.dialpad.com/reference/scheduled_messageslist.md) |
| `numbers.unassign` | DELETE | `/api/v2/numbers/{number}` | [Official reference](https://developers.dialpad.com/reference/numbersunassign.md) |
| `scheduled_messages.get` | GET | `/api/v2/message/schedule/{id}` | [Official reference](https://developers.dialpad.com/reference/scheduled_messagesget.md) |
| `numbers.assign` | POST | `/api/v2/numbers/{number}/assign` | [Official reference](https://developers.dialpad.com/reference/numbersassign.md) |
| `scheduled_messages.send_now` | POST | `/api/v2/message/schedule/{id}/send` | [Official reference](https://developers.dialpad.com/reference/scheduled_messagessend_now.md) |
| `numbers.list` | GET | `/api/v2/numbers` | [Official reference](https://developers.dialpad.com/reference/numberslist.md) |
| `numbers.auto_assign` | POST | `/api/v2/numbers/assign` | [Official reference](https://developers.dialpad.com/reference/numbersauto_assign.md) |
| `numbers.swap` | POST | `/api/v2/numbers/swap` | [Official reference](https://developers.dialpad.com/reference/numbersswap.md) |
| `number_tags.update` | PATCH | `/api/v2/numbers/tags` | [Official reference](https://developers.dialpad.com/reference/number_tagsupdate.md) |
| `scheduled_messages.update` | PATCH | `/api/v2/message/schedule/{id}` | [Official reference](https://developers.dialpad.com/reference/scheduled_messagesupdate.md) |
| `numbers.get` | GET | `/api/v2/numbers/{number}` | [Official reference](https://developers.dialpad.com/reference/numbersget.md) |
| `coaching_team.list` | GET | `/api/v2/offices/{office_id}/teams` | [Official reference](https://developers.dialpad.com/reference/coaching_teamlist.md) |
| `office_plan.get` | GET | `/api/v2/offices/{office_id}/plan` | [Official reference](https://developers.dialpad.com/reference/office_planget.md) |
| `phone_number.format` | POST | `/api/v2/numbers/format` | [Official reference](https://developers.dialpad.com/reference/phone_numberformat.md) |
| `departments.list` | GET | `/api/v2/offices/{office_id}/departments` | [Official reference](https://developers.dialpad.com/reference/departmentslist.md) |
| `numbers.office_unassign_number.post` | POST | `/api/v2/offices/{id}/unassign_number` | [Official reference](https://developers.dialpad.com/reference/numbersoffice_unassign_numberpost.md) |
| `callcenters.list` | GET | `/api/v2/offices/{office_id}/callcenters` | [Official reference](https://developers.dialpad.com/reference/callcenterslist.md) |
| `numbers.assign_office_number.post` | POST | `/api/v2/offices/{id}/assign_number` | [Official reference](https://developers.dialpad.com/reference/numbersassign_office_numberpost.md) |
| `available_licenses.list` | GET | `/api/v2/offices/{office_id}/available_licenses` | [Official reference](https://developers.dialpad.com/reference/available_licenseslist.md) |
| `offices.e911.get` | GET | `/api/v2/offices/{id}/e911` | [Official reference](https://developers.dialpad.com/reference/officese911get.md) |
| `offices.offdutystatuses.get` | GET | `/api/v2/offices/{id}/offdutystatuses` | [Official reference](https://developers.dialpad.com/reference/officesoffdutystatusesget.md) |
| `offices.e911.update` | PUT | `/api/v2/offices/{id}/e911` | [Official reference](https://developers.dialpad.com/reference/officese911update.md) |
| `offices.update` | PATCH | `/api/v2/offices/{id}` | [Official reference](https://developers.dialpad.com/reference/officesupdate.md) |
| `offices.get` | GET | `/api/v2/offices/{id}` | [Official reference](https://developers.dialpad.com/reference/officesget.md) |
| `offices.primary.get` | GET | `/api/v2/offices/primary` | [Official reference](https://developers.dialpad.com/reference/officesprimaryget.md) |
| `offices.list` | GET | `/api/v2/offices` | [Official reference](https://developers.dialpad.com/reference/officeslist.md) |
| `offices.operators.delete` | DELETE | `/api/v2/offices/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/officesoperatorsdelete.md) |
| `offices.create` | POST | `/api/v2/offices` | [Official reference](https://developers.dialpad.com/reference/officescreate.md) |
| `offices.operators.get` | GET | `/api/v2/offices/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/officesoperatorsget.md) |
| `offices.operators.post` | POST | `/api/v2/offices/{id}/operators` | [Official reference](https://developers.dialpad.com/reference/officesoperatorspost.md) |
| `recording_share_link.create` | POST | `/api/v2/recordingsharelink` | [Official reference](https://developers.dialpad.com/reference/recording_share_linkcreate.md) |
| `recording_share_link.get` | GET | `/api/v2/recordingsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/recording_share_linkget.md) |
| `numbers.assign_room_number.post` | POST | `/api/v2/rooms/{id}/assign_number` | [Official reference](https://developers.dialpad.com/reference/numbersassign_room_numberpost.md) |
| `numbers.room_unassign_number.post` | POST | `/api/v2/rooms/{id}/unassign_number` | [Official reference](https://developers.dialpad.com/reference/numbersroom_unassign_numberpost.md) |
| `rooms.delete` | DELETE | `/api/v2/rooms/{id}` | [Official reference](https://developers.dialpad.com/reference/roomsdelete.md) |
| `rooms.get` | GET | `/api/v2/rooms/{id}` | [Official reference](https://developers.dialpad.com/reference/roomsget.md) |
| `recording_share_link.delete` | DELETE | `/api/v2/recordingsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/recording_share_linkdelete.md) |
| `rooms.post` | POST | `/api/v2/rooms` | [Official reference](https://developers.dialpad.com/reference/roomspost.md) |
| `recording_share_link.update` | PUT | `/api/v2/recordingsharelink/{id}` | [Official reference](https://developers.dialpad.com/reference/recording_share_linkupdate.md) |
| `deskphones.rooms.create_international_pin` | POST | `/api/v2/rooms/international_pin` | [Official reference](https://developers.dialpad.com/reference/deskphonesroomscreate_international_pin.md) |
| `rooms.list` | GET | `/api/v2/rooms` | [Official reference](https://developers.dialpad.com/reference/roomslist.md) |
| `deskphones.rooms.get` | GET | `/api/v2/rooms/{parent_id}/deskphones/{id}` | [Official reference](https://developers.dialpad.com/reference/deskphonesroomsget.md) |
| `rooms.patch` | PATCH | `/api/v2/rooms/{id}` | [Official reference](https://developers.dialpad.com/reference/roomspatch.md) |
| `deskphones.rooms.list` | GET | `/api/v2/rooms/{parent_id}/deskphones` | [Official reference](https://developers.dialpad.com/reference/deskphonesroomslist.md) |
| `deskphones.rooms.delete` | DELETE | `/api/v2/rooms/{parent_id}/deskphones/{id}` | [Official reference](https://developers.dialpad.com/reference/deskphonesroomsdelete.md) |
| `schedule_reports.update` | PATCH | `/api/v2/schedulereports/{id}` | [Official reference](https://developers.dialpad.com/reference/schedule_reportsupdate.md) |
| `schedule_reports.create` | POST | `/api/v2/schedulereports` | [Official reference](https://developers.dialpad.com/reference/schedule_reportscreate.md) |
| `schedule_reports.get` | GET | `/api/v2/schedulereports/{id}` | [Official reference](https://developers.dialpad.com/reference/schedule_reportsget.md) |
| `scorecards.export.get` | GET | `/api/v2/scorecards/export/{id}` | [Official reference](https://developers.dialpad.com/reference/scorecardsexportget.md) |
| `scorecards.export.create` | POST | `/api/v2/scorecards/export` | [Official reference](https://developers.dialpad.com/reference/scorecardsexportcreate.md) |
| `scorecards.get` | GET | `/api/v2/scorecards/{id}` | [Official reference](https://developers.dialpad.com/reference/scorecardsget.md) |
| `scorecards.list` | GET | `/api/v2/scorecards` | [Official reference](https://developers.dialpad.com/reference/scorecardslist.md) |
| `schedule_reports.delete` | DELETE | `/api/v2/schedulereports/{id}` | [Official reference](https://developers.dialpad.com/reference/schedule_reportsdelete.md) |
| `schedule_reports.list` | GET | `/api/v2/schedulereports` | [Official reference](https://developers.dialpad.com/reference/schedule_reportslist.md) |
| `stats.export.create` | POST | `/api/v2/stats` | [Official reference](https://developers.dialpad.com/reference/statsexportcreate.md) |
| `stats.export.get` | GET | `/api/v2/stats/{id}` | [Official reference](https://developers.dialpad.com/reference/statsexportget.md) |
| `sms.send` | POST | `/api/v2/sms` | [Official reference](https://developers.dialpad.com/reference/smssend.md) |
| `users.initiate_call` | POST | `/api/v2/users/{id}/initiate_call` | [Official reference](https://developers.dialpad.com/reference/usersinitiate_call.md) |
| `users.toggle_call_vi` | PATCH | `/api/v2/users/{id}/togglevi` | [Official reference](https://developers.dialpad.com/reference/userstoggle_call_vi.md) |
| `userdevices.get` | GET | `/api/v2/userdevices/{id}` | [Official reference](https://developers.dialpad.com/reference/userdevicesget.md) |
| `transcripts.get` | GET | `/api/v2/transcripts/{call_id}` | [Official reference](https://developers.dialpad.com/reference/transcriptsget.md) |
| `userdevices.list` | GET | `/api/v2/userdevices` | [Official reference](https://developers.dialpad.com/reference/userdeviceslist.md) |
| `users.toggle_call_recording` | PATCH | `/api/v2/users/{id}/activecall` | [Official reference](https://developers.dialpad.com/reference/userstoggle_call_recording.md) |
| `transcripts.get_url` | GET | `/api/v2/transcripts/{call_id}/url` | [Official reference](https://developers.dialpad.com/reference/transcriptsget_url.md) |
| `users.set_caller_id` | POST | `/api/v2/users/{id}/caller_id` | [Official reference](https://developers.dialpad.com/reference/usersset_caller_id.md) |
| `deskphones.users.delete` | DELETE | `/api/v2/users/{parent_id}/deskphones/{id}` | [Official reference](https://developers.dialpad.com/reference/deskphonesusersdelete.md) |
| `caller_id.users.get` | GET | `/api/v2/users/{id}/caller_id` | [Official reference](https://developers.dialpad.com/reference/caller_idusersget.md) |
| `deskphones.users.get` | GET | `/api/v2/users/{parent_id}/deskphones/{id}` | [Official reference](https://developers.dialpad.com/reference/deskphonesusersget.md) |
| `users.e911.update` | PUT | `/api/v2/users/{id}/e911` | [Official reference](https://developers.dialpad.com/reference/userse911update.md) |
| `users.toggle_dnd` | PATCH | `/api/v2/users/{id}/togglednd` | [Official reference](https://developers.dialpad.com/reference/userstoggle_dnd.md) |
| `users.unassign_number` | POST | `/api/v2/users/{id}/unassign_number` | [Official reference](https://developers.dialpad.com/reference/usersunassign_number.md) |
| `users.assign_number` | POST | `/api/v2/users/{id}/assign_number` | [Official reference](https://developers.dialpad.com/reference/usersassign_number.md) |
| `users.list_personas` | GET | `/api/v2/users/{id}/personas` | [Official reference](https://developers.dialpad.com/reference/userslist_personas.md) |
| `users.e911.get` | GET | `/api/v2/users/{id}/e911` | [Official reference](https://developers.dialpad.com/reference/userse911get.md) |
| `deskphones.users.list` | GET | `/api/v2/users/{parent_id}/deskphones` | [Official reference](https://developers.dialpad.com/reference/deskphonesuserslist.md) |
| `screen_pop.initiate` | POST | `/api/v2/users/{id}/screenpop` | [Official reference](https://developers.dialpad.com/reference/screen_popinitiate.md) |
| `users.delete` | DELETE | `/api/v2/users/{id}` | [Official reference](https://developers.dialpad.com/reference/usersdelete.md) |
| `users.get` | GET | `/api/v2/users/{id}` | [Official reference](https://developers.dialpad.com/reference/usersget.md) |
| `users.list` | GET | `/api/v2/users` | [Official reference](https://developers.dialpad.com/reference/userslist.md) |
| `users.update` | PATCH | `/api/v2/users/{id}` | [Official reference](https://developers.dialpad.com/reference/usersupdate.md) |
| `users.create` | POST | `/api/v2/users` | [Official reference](https://developers.dialpad.com/reference/userscreate.md) |
| `users.move_office` | PATCH | `/api/v2/users/{id}/move_office` | [Official reference](https://developers.dialpad.com/reference/usersmove_office.md) |
| `users.create_batch` | POST | `/api/v2/users/batch` | [Official reference](https://developers.dialpad.com/reference/userscreate_batch.md) |
| `users.update_status` | PATCH | `/api/v2/users/{id}/status` | [Official reference](https://developers.dialpad.com/reference/usersupdate_status.md) |
| `search.users` | GET | `/api/v2/users/search` | [Official reference](https://developers.dialpad.com/reference/searchusers.md) |
| `websockets.get` | GET | `/api/v2/websockets/{id}` | [Official reference](https://developers.dialpad.com/reference/websocketsget.md) |
| `websockets.list` | GET | `/api/v2/websockets` | [Official reference](https://developers.dialpad.com/reference/websocketslist.md) |
| `websockets.create` | POST | `/api/v2/websockets` | [Official reference](https://developers.dialpad.com/reference/websocketscreate.md) |
| `meetings.conference-meetings.list` | GET | `/api/v2/conference/meetings` | [Official reference](https://developers.dialpad.com/reference/conference-meetingslist.md) |
| `meetings.conference-rooms.list` | GET | `/api/v2/conference/rooms` | [Official reference](https://developers.dialpad.com/reference/conference-roomslist.md) |
| `websockets.update` | PATCH | `/api/v2/websockets/{id}` | [Official reference](https://developers.dialpad.com/reference/websocketsupdate.md) |
| `meetings.meetings.get` | GET | `/api/v2/meetings/{scheduled_conference_id}` | [Official reference](https://developers.dialpad.com/reference/meetingsget.md) |
| `websockets.delete` | DELETE | `/api/v2/websockets/{id}` | [Official reference](https://developers.dialpad.com/reference/websocketsdelete.md) |
| `meetings.meetings.update` | PUT | `/api/v2/meetings/{scheduled_conference_id}` | [Official reference](https://developers.dialpad.com/reference/meetingsupdate.md) |
| `meetings.meetings.delete` | DELETE | `/api/v2/meetings/{scheduled_conference_id}` | [Official reference](https://developers.dialpad.com/reference/meetingsdelete.md) |
| `meetings.meetings.create` | POST | `/api/v2/meetings` | [Official reference](https://developers.dialpad.com/reference/meetingscreate.md) |
| `meetings.meetings.room.create` | POST | `/api/v2/meetings/room` | [Official reference](https://developers.dialpad.com/reference/meetingsroomcreate.md) |
| `wfm.wfm-metrics-activity.get` | GET | `/api/v2/wfm/metrics/activity` | [Official reference](https://developers.dialpad.com/reference/wfm-metrics-activityget.md) |
| `wfm.wfm-metrics-agent.get` | GET | `/api/v2/wfm/metrics/agent` | [Official reference](https://developers.dialpad.com/reference/wfm-metrics-agentget.md) |
| `meetings.meetings.list` | GET | `/api/v2/meetings` | [Official reference](https://developers.dialpad.com/reference/meetingslist.md) |
| `powerdialer.getModelsByKeys` | GET | `/api/v2/powerdialer/bulk` | [Official reference](https://developers.dialpad.com/reference/getmodelsbykeys.md) |
| `powerdialer.getAblyToken` | GET | `/api/v2/powerdialer/ably` | [Official reference](https://developers.dialpad.com/reference/getablytoken.md) |
| `powerdialer.getContact` | GET | `/api/v2/powerdialer/contact/{contact_id}` | [Official reference](https://developers.dialpad.com/reference/getcontact.md) |
| `powerdialer.getModelsByKeysOfKind` | GET | `/api/v2/powerdialer/bulk/{kind}` | [Official reference](https://developers.dialpad.com/reference/getmodelsbykeysofkind.md) |
| `powerdialer.deleteModelsByKeysOfKind` | DELETE | `/api/v2/powerdialer/bulk/{kind}` | [Official reference](https://developers.dialpad.com/reference/deletemodelsbykeysofkind.md) |
| `powerdialer.createCustomProperties` | POST | `/api/v2/powerdialer/custom_property` | [Official reference](https://developers.dialpad.com/reference/createcustomproperties.md) |
| `powerdialer.getCustomProperties` | GET | `/api/v2/powerdialer/custom_property` | [Official reference](https://developers.dialpad.com/reference/getcustomproperties.md) |
| `powerdialer.getCustomProperty` | GET | `/api/v2/powerdialer/custom_property/{id}` | [Official reference](https://developers.dialpad.com/reference/getcustomproperty.md) |
| `powerdialer.updateCustomProperty` | PATCH | `/api/v2/powerdialer/custom_property/{id}` | [Official reference](https://developers.dialpad.com/reference/updatecustomproperty.md) |
| `powerdialer.getDialpadOAuthService` | GET | `/api/v2/powerdialer/dialpad_oauth/{service}` | [Official reference](https://developers.dialpad.com/reference/getdialpadoauthservice.md) |
| `powerdialer.updateGlobalSettings` | PATCH | `/api/v2/powerdialer/globalsettings/{company_id}` | [Official reference](https://developers.dialpad.com/reference/updateglobalsettings.md) |
| `powerdialer.deleteCustomProperty` | DELETE | `/api/v2/powerdialer/custom_property/{id}` | [Official reference](https://developers.dialpad.com/reference/deletecustomproperty.md) |
| `powerdialer.getGlobalSettings` | GET | `/api/v2/powerdialer/globalsettings/{company_id}` | [Official reference](https://developers.dialpad.com/reference/getglobalsettings.md) |
| `powerdialer.getEventLogs` | GET | `/api/v2/powerdialer/event` | [Official reference](https://developers.dialpad.com/reference/geteventlogs.md) |
| `powerdialer.getJobs` | GET | `/api/v2/powerdialer/jobs` | [Official reference](https://developers.dialpad.com/reference/getjobs.md) |
| `powerdialer.getJob` | GET | `/api/v2/powerdialer/jobs/{job_id}` | [Official reference](https://developers.dialpad.com/reference/getjob.md) |
| `powerdialer.getApiKey` | GET | `/api/v2/powerdialer/keys/{key_id}` | [Official reference](https://developers.dialpad.com/reference/getapikey.md) |
| `powerdialer.getApiKeys` | GET | `/api/v2/powerdialer/keys` | [Official reference](https://developers.dialpad.com/reference/getapikeys.md) |
| `powerdialer.getOperator` | GET | `/api/v2/powerdialer/operator` | [Official reference](https://developers.dialpad.com/reference/getoperator.md) |
| `powerdialer.getLogin` | GET | `/api/v2/powerdialer/login` | [Official reference](https://developers.dialpad.com/reference/getlogin.md) |
| `powerdialer.deleteApiKey` | DELETE | `/api/v2/powerdialer/keys/{key_id}` | [Official reference](https://developers.dialpad.com/reference/deleteapikey.md) |
| `powerdialer.updateApiKey` | PATCH | `/api/v2/powerdialer/keys/{key_id}` | [Official reference](https://developers.dialpad.com/reference/updateapikey.md) |
| `powerdialer.postLogin` | POST | `/api/v2/powerdialer/login` | [Official reference](https://developers.dialpad.com/reference/postlogin.md) |
| `powerdialer.createApiKey` | POST | `/api/v2/powerdialer/keys` | [Official reference](https://developers.dialpad.com/reference/createapikey.md) |
| `powerdialer.createServiceAccount` | POST | `/api/v2/powerdialer/service_account` | [Official reference](https://developers.dialpad.com/reference/createserviceaccount.md) |
| `powerdialer.getServiceAccount` | GET | `/api/v2/powerdialer/service_account/{account_id}` | [Official reference](https://developers.dialpad.com/reference/getserviceaccount.md) |
| `powerdialer.updateServiceAccount` | PATCH | `/api/v2/powerdialer/service_account/{account_id}` | [Official reference](https://developers.dialpad.com/reference/updateserviceaccount.md) |
| `powerdialer.deleteServiceAccount` | DELETE | `/api/v2/powerdialer/service_account/{account_id}` | [Official reference](https://developers.dialpad.com/reference/deleteserviceaccount.md) |
| `powerdialer.getSmsForTarget` | GET | `/api/v2/powerdialer/sms` | [Official reference](https://developers.dialpad.com/reference/getsmsfortarget.md) |
| `powerdialer.smsItem` | POST | `/api/v2/powerdialer/sms` | [Official reference](https://developers.dialpad.com/reference/smsitem.md) |
| `powerdialer.getServiceAccounts` | GET | `/api/v2/powerdialer/service_account` | [Official reference](https://developers.dialpad.com/reference/getserviceaccounts.md) |
| `powerdialer.getCurrentUser` | GET | `/api/v2/powerdialer/user/me` | [Official reference](https://developers.dialpad.com/reference/getcurrentuser.md) |
| `powerdialer.getWorker` | GET | `/api/v2/powerdialer/worker/{worker_id}` | [Official reference](https://developers.dialpad.com/reference/getworker.md) |
| `powerdialer.updateWorker` | PATCH | `/api/v2/powerdialer/worker/{worker_id}` | [Official reference](https://developers.dialpad.com/reference/updateworker.md) |
| `powerdialer.getWorkers` | GET | `/api/v2/powerdialer/worker` | [Official reference](https://developers.dialpad.com/reference/getworkers.md) |
| `powerdialer.createAudience` | POST | `/api/v2/powerdialer/audience` | [Official reference](https://developers.dialpad.com/reference/createaudience.md) |
| `powerdialer.getAudiences` | GET | `/api/v2/powerdialer/audience` | [Official reference](https://developers.dialpad.com/reference/getaudiences.md) |
| `powerdialer.updateAudience` | PATCH | `/api/v2/powerdialer/audience/{audience_id}` | [Official reference](https://developers.dialpad.com/reference/updateaudience.md) |
| `powerdialer.getAudience` | GET | `/api/v2/powerdialer/audience/{audience_id}` | [Official reference](https://developers.dialpad.com/reference/getaudience.md) |
| `powerdialer.createBot` | POST | `/api/v2/powerdialer/bot` | [Official reference](https://developers.dialpad.com/reference/createbot.md) |
| `powerdialer.duplicateAudience` | POST | `/api/v2/powerdialer/audience/{audience_id}` | [Official reference](https://developers.dialpad.com/reference/duplicateaudience.md) |
| `powerdialer.getBots` | GET | `/api/v2/powerdialer/bot` | [Official reference](https://developers.dialpad.com/reference/getbots.md) |
| `powerdialer.updateBot` | PATCH | `/api/v2/powerdialer/bot/{bot_id}` | [Official reference](https://developers.dialpad.com/reference/updatebot.md) |
| `powerdialer.deleteAudience` | DELETE | `/api/v2/powerdialer/audience/{audience_id}` | [Official reference](https://developers.dialpad.com/reference/deleteaudience.md) |
| `powerdialer.deleteBot` | DELETE | `/api/v2/powerdialer/bot/{bot_id}` | [Official reference](https://developers.dialpad.com/reference/deletebot.md) |
| `powerdialer.getBot` | GET | `/api/v2/powerdialer/bot/{bot_id}` | [Official reference](https://developers.dialpad.com/reference/getbot.md) |
| `powerdialer.getBotDialogs` | GET | `/api/v2/powerdialer/botdialog` | [Official reference](https://developers.dialpad.com/reference/getbotdialogs.md) |
| `powerdialer.createBotDialog` | POST | `/api/v2/powerdialer/botdialog` | [Official reference](https://developers.dialpad.com/reference/createbotdialog.md) |
| `powerdialer.deleteBotDialog` | DELETE | `/api/v2/powerdialer/botdialog/{bot_dialog_id}` | [Official reference](https://developers.dialpad.com/reference/deletebotdialog.md) |
| `powerdialer.getBotMessages` | GET | `/api/v2/powerdialer/botmessage` | [Official reference](https://developers.dialpad.com/reference/getbotmessages.md) |
| `powerdialer.createBotMessage` | POST | `/api/v2/powerdialer/botmessage` | [Official reference](https://developers.dialpad.com/reference/createbotmessage.md) |
| `powerdialer.deleteBotMessage` | DELETE | `/api/v2/powerdialer/botmessage/{bot_message_id}` | [Official reference](https://developers.dialpad.com/reference/deletebotmessage.md) |
| `powerdialer.getBotMessage` | GET | `/api/v2/powerdialer/botmessage/{bot_message_id}` | [Official reference](https://developers.dialpad.com/reference/getbotmessage.md) |
| `powerdialer.updateBotDialog` | PATCH | `/api/v2/powerdialer/botdialog/{bot_dialog_id}` | [Official reference](https://developers.dialpad.com/reference/updatebotdialog.md) |
| `powerdialer.getCampaigns` | GET | `/api/v2/powerdialer/campaign` | [Official reference](https://developers.dialpad.com/reference/getcampaigns.md) |
| `powerdialer.searchCampaigns` | POST | `/api/v2/powerdialer/campaign/search` | [Official reference](https://developers.dialpad.com/reference/searchcampaigns.md) |
| `powerdialer.deleteCampaign` | DELETE | `/api/v2/powerdialer/campaign/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/deletecampaign.md) |
| `powerdialer.createCampaign` | POST | `/api/v2/powerdialer/campaign` | [Official reference](https://developers.dialpad.com/reference/createcampaign.md) |
| `powerdialer.getCampaign` | GET | `/api/v2/powerdialer/campaign/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/getcampaign.md) |
| `powerdialer.updateCampaign` | PATCH | `/api/v2/powerdialer/campaign/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/updatecampaign.md) |
| `powerdialer.duplicateCampaign` | POST | `/api/v2/powerdialer/campaign/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/duplicatecampaign.md) |
| `powerdialer.getCampaignResultExportUrl` | GET | `/api/v2/powerdialer/campaign_export/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/getcampaignresultexporturl.md) |
| `powerdialer.createCampaignGroup` | POST | `/api/v2/powerdialer/campaign_group` | [Official reference](https://developers.dialpad.com/reference/createcampaigngroup.md) |
| `powerdialer.deleteCampaignGroup` | DELETE | `/api/v2/powerdialer/campaign_group/{campaign_group_id}` | [Official reference](https://developers.dialpad.com/reference/deletecampaigngroup.md) |
| `powerdialer.getCampaignGroup` | GET | `/api/v2/powerdialer/campaign_group/{campaign_group_id}` | [Official reference](https://developers.dialpad.com/reference/getcampaigngroup.md) |
| `powerdialer.getCampaignGroups` | GET | `/api/v2/powerdialer/campaign_group` | [Official reference](https://developers.dialpad.com/reference/getcampaigngroups.md) |
| `powerdialer.startCampaignResultExport` | POST | `/api/v2/powerdialer/campaign_export/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/startcampaignresultexport.md) |
| `powerdialer.getCampaignSettings` | GET | `/api/v2/powerdialer/campaignsettings/{campaign_settings_id}` | [Official reference](https://developers.dialpad.com/reference/getcampaignsettings.md) |
| `powerdialer.updateCampaignGroup` | PATCH | `/api/v2/powerdialer/campaign_group/{campaign_group_id}` | [Official reference](https://developers.dialpad.com/reference/updatecampaigngroup.md) |
| `powerdialer.editCampaignSettings` | PATCH | `/api/v2/powerdialer/campaignsettings/{campaign_settings_id}` | [Official reference](https://developers.dialpad.com/reference/editcampaignsettings.md) |
| `powerdialer.deleteCsv` | DELETE | `/api/v2/powerdialer/csv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/deletecsv.md) |
| `powerdialer.getCsvPresignedUrl` | GET | `/api/v2/powerdialer/csv_presigned_url/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/getcsvpresignedurl.md) |
| `powerdialer.updateCsv` | PATCH | `/api/v2/powerdialer/csv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/updatecsv.md) |
| `powerdialer.getVarsInfo` | GET | `/api/v2/powerdialer/vars_info/{campaign_id}` | [Official reference](https://developers.dialpad.com/reference/getvarsinfo.md) |
| `powerdialer.getCsv` | GET | `/api/v2/powerdialer/csv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/getcsv.md) |
| `powerdialer.getPhoneCsvs` | GET | `/api/v2/powerdialer/phonecsv` | [Official reference](https://developers.dialpad.com/reference/getphonecsvs.md) |
| `powerdialer.getCsvs` | GET | `/api/v2/powerdialer/csv` | [Official reference](https://developers.dialpad.com/reference/getcsvs.md) |
| `powerdialer.getPhoneCsv` | GET | `/api/v2/powerdialer/phonecsv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/getphonecsv.md) |
| `powerdialer.updatePhoneCsv` | PATCH | `/api/v2/powerdialer/phonecsv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/updatephonecsv.md) |
| `powerdialer.deletePhoneCsv` | DELETE | `/api/v2/powerdialer/phonecsv/{csv_id}` | [Official reference](https://developers.dialpad.com/reference/deletephonecsv.md) |
| `powerdialer.createLeadList` | POST | `/api/v2/powerdialer/list` | [Official reference](https://developers.dialpad.com/reference/createleadlist.md) |
| `powerdialer.getBotDialog` | GET | `/api/v2/powerdialer/botdialog/{bot_dialog_id}` | [Official reference](https://developers.dialpad.com/reference/getbotdialog.md) |
| `powerdialer.getListItems` | GET | `/api/v2/powerdialer/item` | [Official reference](https://developers.dialpad.com/reference/getlistitems.md) |
| `powerdialer.deleteLeadListItem` | DELETE | `/api/v2/powerdialer/item/{item_id}` | [Official reference](https://developers.dialpad.com/reference/deleteleadlistitem.md) |
| `powerdialer.getListList` | GET | `/api/v2/powerdialer/list/{list_id}` | [Official reference](https://developers.dialpad.com/reference/getlistlist.md) |
| `powerdialer.getLeadListItem` | GET | `/api/v2/powerdialer/item/{item_id}` | [Official reference](https://developers.dialpad.com/reference/getleadlistitem.md) |
| `powerdialer.deleteLeadList` | DELETE | `/api/v2/powerdialer/list/{list_id}` | [Official reference](https://developers.dialpad.com/reference/deleteleadlist.md) |
| `powerdialer.duplicateLeadList` | POST | `/api/v2/powerdialer/list/{list_id}` | [Official reference](https://developers.dialpad.com/reference/duplicateleadlist.md) |
| `powerdialer.getLeadLists` | GET | `/api/v2/powerdialer/list` | [Official reference](https://developers.dialpad.com/reference/getleadlists.md) |
| `powerdialer.updateLeadList` | PATCH | `/api/v2/powerdialer/list/{list_id}` | [Official reference](https://developers.dialpad.com/reference/updateleadlist.md) |
| `powerdialer.getListView` | GET | `/api/v2/powerdialer/list_view` | [Official reference](https://developers.dialpad.com/reference/getlistview.md) |
| `powerdialer.createStaticList` | POST | `/api/v2/powerdialer/static_list` | [Official reference](https://developers.dialpad.com/reference/createstaticlist.md) |
| `powerdialer.getStaticLists` | GET | `/api/v2/powerdialer/static_list` | [Official reference](https://developers.dialpad.com/reference/getstaticlists.md) |
| `powerdialer.getStaticList` | GET | `/api/v2/powerdialer/static_list/{static_list_id}` | [Official reference](https://developers.dialpad.com/reference/getstaticlist.md) |
| `powerdialer.deleteStaticList` | DELETE | `/api/v2/powerdialer/static_list/{static_list_id}` | [Official reference](https://developers.dialpad.com/reference/deletestaticlist.md) |
| `powerdialer.duplicateStaticList` | POST | `/api/v2/powerdialer/static_list/{static_list_id}` | [Official reference](https://developers.dialpad.com/reference/duplicatestaticlist.md) |
| `powerdialer.createLeads` | POST | `/api/v2/powerdialer/lead` | [Official reference](https://developers.dialpad.com/reference/createleads.md) |
| `powerdialer.queryLeads` | POST | `/api/v2/powerdialer/lead/query` | [Official reference](https://developers.dialpad.com/reference/queryleads.md) |
| `powerdialer.getLead` | GET | `/api/v2/powerdialer/lead/{lead_id}` | [Official reference](https://developers.dialpad.com/reference/getlead.md) |
| `powerdialer.updateLead` | PATCH | `/api/v2/powerdialer/lead/{lead_id}` | [Official reference](https://developers.dialpad.com/reference/updatelead.md) |
| `powerdialer.getLeadCompany` | GET | `/api/v2/powerdialer/lead_company/{lead_company_id}` | [Official reference](https://developers.dialpad.com/reference/getleadcompany.md) |
| `powerdialer.getLeadCompanies` | GET | `/api/v2/powerdialer/lead_company` | [Official reference](https://developers.dialpad.com/reference/getleadcompanies.md) |
| `powerdialer.updateStaticList` | PATCH | `/api/v2/powerdialer/static_list/{static_list_id}` | [Official reference](https://developers.dialpad.com/reference/updatestaticlist.md) |
| `powerdialer.getLeads` | GET | `/api/v2/powerdialer/lead` | [Official reference](https://developers.dialpad.com/reference/getleads.md) |
| `powerdialer.startLeadExport` | POST | `/api/v2/powerdialer/lead_export` | [Official reference](https://developers.dialpad.com/reference/startleadexport.md) |
| `powerdialer.getLeadListView` | GET | `/api/v2/powerdialer/lead_list_view` | [Official reference](https://developers.dialpad.com/reference/getleadlistview.md) |
| `powerdialer.bulkUpdateLeadItems` | PATCH | `/api/v2/powerdialer/leaditem` | [Official reference](https://developers.dialpad.com/reference/bulkupdateleaditems.md) |
| `powerdialer.getLeadItem` | GET | `/api/v2/powerdialer/leaditem/{item_id}` | [Official reference](https://developers.dialpad.com/reference/getleaditem.md) |
| `powerdialer.getLeadItems` | GET | `/api/v2/powerdialer/leaditem` | [Official reference](https://developers.dialpad.com/reference/getleaditems.md) |
| `powerdialer.getLeadListViewById` | GET | `/api/v2/powerdialer/lead_list_view/{list_id}` | [Official reference](https://developers.dialpad.com/reference/getleadlistviewbyid.md) |
| `powerdialer.getLeadExport` | GET | `/api/v2/powerdialer/lead_export/{export_id}` | [Official reference](https://developers.dialpad.com/reference/getleadexport.md) |
| `powerdialer.createPhone` | POST | `/api/v2/powerdialer/phone` | [Official reference](https://developers.dialpad.com/reference/createphone.md) |
| `powerdialer.getPhone` | GET | `/api/v2/powerdialer/phone/{e164}` | [Official reference](https://developers.dialpad.com/reference/getphone.md) |
| `powerdialer.updateLeadItem` | PATCH | `/api/v2/powerdialer/leaditem/{item_id}` | [Official reference](https://developers.dialpad.com/reference/updateleaditem.md) |
| `powerdialer.deletePhone` | DELETE | `/api/v2/powerdialer/phone/{e164}` | [Official reference](https://developers.dialpad.com/reference/deletephone.md) |
| `powerdialer.getSalesforceObjectListViews` | GET | `/api/v2/powerdialer/proxy/salesforce/listview` | [Official reference](https://developers.dialpad.com/reference/getsalesforceobjectlistviews.md) |
| `powerdialer.updatePhone` | PATCH | `/api/v2/powerdialer/phone/{e164}` | [Official reference](https://developers.dialpad.com/reference/updatephone.md) |
| `powerdialer.getSalesforceObjectFields` | GET | `/api/v2/powerdialer/proxy/salesforce/object_fields` | [Official reference](https://developers.dialpad.com/reference/getsalesforceobjectfields.md) |
| `powerdialer.getSalesforceListViewById` | GET | `/api/v2/powerdialer/salesforce/listview/{sfdc_id}` | [Official reference](https://developers.dialpad.com/reference/getsalesforcelistviewbyid.md) |
| `powerdialer.createSalesforceListViewImport` | POST | `/api/v2/powerdialer/salesforce/listview_import` | [Official reference](https://developers.dialpad.com/reference/createsalesforcelistviewimport.md) |
| `powerdialer.getSalesforceListViewImports` | GET | `/api/v2/powerdialer/salesforce/listview_import` | [Official reference](https://developers.dialpad.com/reference/getsalesforcelistviewimports.md) |
| `powerdialer.getSalesforceObjectMappings` | GET | `/api/v2/powerdialer/salesforce/object_mapping` | [Official reference](https://developers.dialpad.com/reference/getsalesforceobjectmappings.md) |
| `powerdialer.createSalesforceObjectMapping` | POST | `/api/v2/powerdialer/salesforce/object_mapping` | [Official reference](https://developers.dialpad.com/reference/createsalesforceobjectmapping.md) |
| `powerdialer.updateSalesforceListViewImport` | PATCH | `/api/v2/powerdialer/salesforce/listview_import/{import_id}` | [Official reference](https://developers.dialpad.com/reference/updatesalesforcelistviewimport.md) |
| `powerdialer.deleteSalesforceObjectMapping` | DELETE | `/api/v2/powerdialer/salesforce/object_mapping/{object_mapping_id}` | [Official reference](https://developers.dialpad.com/reference/deletesalesforceobjectmapping.md) |
| `powerdialer.getSalesforceListViewImport` | GET | `/api/v2/powerdialer/salesforce/listview_import/{import_id}` | [Official reference](https://developers.dialpad.com/reference/getsalesforcelistviewimport.md) |
| `powerdialer.getSalesforceObjectMapping` | GET | `/api/v2/powerdialer/salesforce/object_mapping/{object_mapping_id}` | [Official reference](https://developers.dialpad.com/reference/getsalesforceobjectmapping.md) |
| `powerdialer.patchSalesforceListView` | PATCH | `/api/v2/powerdialer/salesforce/listview/{sfdc_id}` | [Official reference](https://developers.dialpad.com/reference/patchsalesforcelistview.md) |
| `powerdialer.updateSalesforceObjectMapping` | PATCH | `/api/v2/powerdialer/salesforce/object_mapping/{object_mapping_id}` | [Official reference](https://developers.dialpad.com/reference/updatesalesforceobjectmapping.md) |
| `powerdialer.getRules` | GET | `/api/v2/powerdialer/rule` | [Official reference](https://developers.dialpad.com/reference/getrules.md) |
| `powerdialer.createRule` | POST | `/api/v2/powerdialer/rule` | [Official reference](https://developers.dialpad.com/reference/createrule.md) |
| `powerdialer.getPhones` | GET | `/api/v2/powerdialer/phone` | [Official reference](https://developers.dialpad.com/reference/getphones.md) |
| `powerdialer.deleteRule` | DELETE | `/api/v2/powerdialer/rule/{rule_id}` | [Official reference](https://developers.dialpad.com/reference/deleterule.md) |
| `powerdialer.updateRule` | PATCH | `/api/v2/powerdialer/rule/{rule_id}` | [Official reference](https://developers.dialpad.com/reference/updaterule.md) |
| `powerdialer.getRule` | GET | `/api/v2/powerdialer/rule/{rule_id}` | [Official reference](https://developers.dialpad.com/reference/getrule.md) |
| `reports.scheduledstats.download` | GET | `/dl/stats/scheduledstats` | [Official reference](https://developers.dialpad.com/page/report-download-api.md) |
| `recordings.call.download` | GET | `/r/{recording_id}` | [Official reference](https://developers.dialpad.com/docs/downloading-call-recordings.md) |
| `recordings.voicemail.download` | GET | `/v/{recording_id}` | [Official reference](https://developers.dialpad.com/docs/downloading-call-recordings.md) |
| `recordings.admin_call.download` | GET | `/recording/admincallrecording/{share_link_id}` | [Official reference](https://developers.dialpad.com/docs/downloading-call-recordings.md) |

## Exclusions

The following official REST operations are intentionally not exposed for the stated scope/model reasons.

| API area | Method / route | Reason | Official reference |
|---|---|---|---|
| Dialpad | POST `/api/v2/subscriptions/agent_status` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_agent_status_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/agent_status` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_agent_status_event_subscriptionlist.md) |
| Dialpad | PATCH `/api/v2/subscriptions/agent_status/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_agent_status_event_subscriptionupdate.md) |
| Dialpad | DELETE `/api/v2/subscriptions/agent_status/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_agent_status_event_subscriptiondelete.md) |
| Dialpad | GET `/api/v2/subscriptions/agent_status/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_agent_status_event_subscriptionget.md) |
| Dialpad | GET `/api/v2/subscriptions/call` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_call_event_subscriptionlist.md) |
| Dialpad | DELETE `/api/v2/subscriptions/call/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_call_event_subscriptiondelete.md) |
| Dialpad | POST `/api/v2/subscriptions/call` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_call_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/call/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_call_event_subscriptionget.md) |
| Dialpad | GET `/api/v2/subscriptions/changelog` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_change_log_event_subscriptionlist.md) |
| Dialpad | PATCH `/api/v2/subscriptions/call/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_call_event_subscriptionupdate.md) |
| Dialpad | DELETE `/api/v2/subscriptions/changelog/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_change_log_event_subscriptiondelete.md) |
| Dialpad | PATCH `/api/v2/subscriptions/changelog/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_change_log_event_subscriptionupdate.md) |
| Dialpad | POST `/api/v2/subscriptions/channel` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_channel_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/changelog/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_change_log_event_subscriptionget.md) |
| Dialpad | DELETE `/api/v2/subscriptions/channel/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_channel_event_subscriptiondelete.md) |
| Dialpad | PATCH `/api/v2/subscriptions/channel/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_channel_event_subscriptionupdate.md) |
| Dialpad | GET `/api/v2/subscriptions/channel/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_channel_event_subscriptionget.md) |
| Dialpad | POST `/api/v2/subscriptions/changelog` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_change_log_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/contact` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_contact_event_subscriptionlist.md) |
| Dialpad | POST `/api/v2/subscriptions/contact` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_contact_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/contact/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_contact_event_subscriptionget.md) |
| Dialpad | PATCH `/api/v2/subscriptions/contact/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_contact_event_subscriptionupdate.md) |
| Dialpad | GET `/api/v2/subscriptions/fax` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_fax_event_subscriptionlist.md) |
| Dialpad | DELETE `/api/v2/subscriptions/contact/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_contact_event_subscriptiondelete.md) |
| Dialpad | POST `/api/v2/subscriptions/fax` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_fax_event_subscriptioncreate.md) |
| Dialpad | DELETE `/api/v2/subscriptions/fax/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_fax_event_subscriptiondelete.md) |
| Dialpad | GET `/api/v2/subscriptions/channel` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_channel_event_subscriptionlist.md) |
| Dialpad | GET `/api/v2/subscriptions/sms` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_sms_event_subscriptionlist.md) |
| Dialpad | POST `/api/v2/subscriptions/sms` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_sms_event_subscriptioncreate.md) |
| Dialpad | GET `/api/v2/subscriptions/fax/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_fax_event_subscriptionget.md) |
| Dialpad | PATCH `/api/v2/subscriptions/fax/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_fax_event_subscriptionupdate.md) |
| Dialpad | DELETE `/api/v2/subscriptions/sms/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_sms_event_subscriptiondelete.md) |
| Dialpad | GET `/api/v2/subscriptions/sms/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_sms_event_subscriptionget.md) |
| Dialpad | PATCH `/api/v2/subscriptions/sms/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhook_sms_event_subscriptionupdate.md) |
| Dialpad | GET `/api/v2/webhooks` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhookslist.md) |
| Dialpad | DELETE `/api/v2/webhooks/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhooksdelete.md) |
| Dialpad | GET `/api/v2/webhooks/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhooksget.md) |
| Dialpad | POST `/api/v2/webhooks` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhookscreate.md) |
| Dialpad | PATCH `/api/v2/webhooks/{id}` | Webhook configuration or event-subscription management is excluded by request. | [Official reference](https://developers.dialpad.com/reference/webhookupdate.md) |
| OAuth | POST `/oauth2/token` | OAuth authorization/token lifecycle is handled by Corsair OAuth authentication, not exposed as resource operations. | [Official reference](https://developers.dialpad.com/reference/oauth2tokenpost.md) |
| OAuth | POST `/oauth2/deauthorize` | OAuth authorization/token lifecycle is handled by Corsair OAuth authentication, not exposed as resource operations. | [Official reference](https://developers.dialpad.com/reference/oauth2deauthorizepost.md) |
| OAuth | GET `/oauth2/authorize` | OAuth authorization/token lifecycle is handled by Corsair OAuth authentication, not exposed as resource operations. | [Official reference](https://developers.dialpad.com/reference/oauth2authorizeget.md) |
| Powerdialer | POST `/api/v2/powerdialer/hook` | Webhook callback receiver is excluded by request. | [Official reference](https://developers.dialpad.com/reference/hookcallback.md) |
| Powerdialer | POST `/api/v2/powerdialer/csv` | Multipart/non-JSON file upload is outside the Corsair JSON request model. | [Official reference](https://developers.dialpad.com/reference/uploadcsv.md) |
| Powerdialer | POST `/api/v2/powerdialer/phonecsv` | Multipart/non-JSON file upload is outside the Corsair JSON request model. | [Official reference](https://developers.dialpad.com/reference/uploadphonecsv.md) |

OAuth token-exchange/deauthorization routes are not listed as excluded resource operations: OAuth token lifecycle is handled by Corsair auth rather than duplicated as ordinary tools. WebSocket resource CRUD is included where the provider defines ordinary HTTP request/response operations; long-lived event streams are not implemented.
