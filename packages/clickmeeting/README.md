# @corsair-dev/clickmeeting

Clickmeeting plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/clickmeeting
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `chats.getChatDetails` | `clickmeeting.api.chats.getChatDetails` | `read` | Retrieve details of a specific chat session |
| `chats.getChats` | `clickmeeting.api.chats.getChats` | `read` | Retrieve a list of all chat sessions |
| `conferences.createConference` | `clickmeeting.api.conferences.createConference` | `write` | Create a new ClickMeeting conference or webinar |
| `conferences.deleteConference` | `clickmeeting.api.conferences.deleteConference` | `write` | Delete a specific conference room |
| `conferences.generateAutologinUrl` | `clickmeeting.api.conferences.generateAutologinUrl` | `write` | Generate an autologin hash for a conference participant |
| `conferences.getConferenceDetails` | `clickmeeting.api.conferences.getConferenceDetails` | `read` | Retrieve detailed information about a specific conference room |
| `conferences.getConferenceFiles` | `clickmeeting.api.conferences.getConferenceFiles` | `read` | Retrieve list of files uploaded to a specific conference room |
| `conferences.getConferences` | `clickmeeting.api.conferences.getConferences` | `read` | Retrieve a list of conference rooms filtered by status |
| `conferences.sendInvitation` | `clickmeeting.api.conferences.sendInvitation` | `write` | Send invitation emails to participants for a conference |
| `conferences.updateConference` | `clickmeeting.api.conferences.updateConference` | `write` | Update an existing conference room parameters |
| `files.deleteFile` | `clickmeeting.api.files.deleteFile` | `write` | Delete a file from the ClickMeeting file library |
| `files.downloadFile` | `clickmeeting.api.files.downloadFile` | `read` | Download file content from the ClickMeeting file library |
| `files.getFileDetails` | `clickmeeting.api.files.getFileDetails` | `read` | Retrieve detailed information about a specific file |
| `files.getFileLibrary` | `clickmeeting.api.files.getFileLibrary` | `read` | Retrieve a list of files from ClickMeeting file library |
| `files.uploadFile` | `clickmeeting.api.files.uploadFile` | `write` | Upload a file to the ClickMeeting file library |
| `recordings.deleteRecording` | `clickmeeting.api.recordings.deleteRecording` | `write` | Delete a specific recording from a conference room |
| `recordings.deleteRecordings` | `clickmeeting.api.recordings.deleteRecordings` | `write` | Delete all recordings for a conference room |
| `recordings.getSessionRecordings` | `clickmeeting.api.recordings.getSessionRecordings` | `read` | Retrieve all recordings for a conference room |
| `registrations.createContact` | `clickmeeting.api.registrations.createContact` | `write` | Create a new contact in your ClickMeeting account |
| `registrations.getRegistrations` | `clickmeeting.api.registrations.getRegistrations` | `read` | Retrieve registrations for a conference room by status |
| `registrations.listRegistrationsByStatus` | `clickmeeting.api.registrations.listRegistrationsByStatus` | `read` | Retrieve registered participants filtered by status |
| `registrations.registerParticipant` | `clickmeeting.api.registrations.registerParticipant` | `write` | Register a participant for a conference room |
| `sessions.generateSessionPdfReport` | `clickmeeting.api.sessions.generateSessionPdfReport` | `write` | Generate a PDF report containing analytics for a session |
| `sessions.getConferenceSessions` | `clickmeeting.api.sessions.getConferenceSessions` | `read` | Retrieve past sessions for a conference room |
| `sessions.getSessionAttendees` | `clickmeeting.api.sessions.getSessionAttendees` | `read` | Retrieve list of attendees who participated in a session |
| `sessions.getSessionDetails` | `clickmeeting.api.sessions.getSessionDetails` | `read` | Retrieve detailed statistics for a specific past conference session |
| `sessions.getSessionRegistrations` | `clickmeeting.api.sessions.getSessionRegistrations` | `read` | Retrieve registrations for a specific session |
| `tokens.createAccessTokens` | `clickmeeting.api.tokens.createAccessTokens` | `write` | Generate access tokens for conference participants |
| `tokens.getTokenByEmail` | `clickmeeting.api.tokens.getTokenByEmail` | `read` | Retrieve access tokens assigned to a specific email address |
| `tokens.listAccessTokens` | `clickmeeting.api.tokens.listAccessTokens` | `read` | Retrieve all generated access tokens for a conference |
| `utility.getPhoneGateways` | `clickmeeting.api.utility.getPhoneGateways` | `read` | Retrieve available phone dial-in numbers for ClickMeeting webinars |
| `utility.getPing` | `clickmeeting.api.utility.getPing` | `read` | Check ClickMeeting API service status |
| `utility.getTimeZoneList` | `clickmeeting.api.utility.getTimeZoneList` | `read` | Retrieve all available time zones supported by ClickMeeting |
| `utility.getTimeZoneListByCountry` | `clickmeeting.api.utility.getTimeZoneListByCountry` | `read` | Retrieve available time zones for a specific country |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/clickmeeting

## License

Apache-2.0
