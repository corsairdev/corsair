# @corsair-dev/recallai

Recall.ai plugin for Corsair: meeting bots, recordings, transcripts and calendars.

## Install

```bash
pnpm add @corsair-dev/recallai
```

## Region

A Recall.ai API key only works on the host of the region it was created in:
`us-west-2`, `us-east-1`, `eu-central-1` or `ap-northeast-1`. Store the region
with the tenant's key in the `region` account field, or pass it to the factory,
which takes precedence. Without either, requests go to `us-west-2`. A pasted
host such as `eu-central-1.recall.ai` is read as its region; anything else is
rejected.

```ts
recallai({ key: process.env.RECALLAI_API_KEY, region: 'eu-central-1' });
```

## Live test

`live.api.test.ts` is skipped in CI. With a key it lists every resource, round
trips a Google login group and a calendar V1 user, and checks a key sent to
the wrong region fails with a 401. `RECALLAI_LIVE_BOTS=1` also schedules a bot a
week out and deletes it before it can join.

```bash
LIVE_TEST=1 RECALLAI_API_KEY=... RECALLAI_REGION=us-west-2 npx jest live.api.test.ts
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `audioMixed.delete` | `recallai.api.audioMixed.delete` | `destructive` | Delete a mixed audio artifact |
| `audioMixed.list` | `recallai.api.audioMixed.list` | `read` | List mixed audio artifacts |
| `audioMixed.retrieve` | `recallai.api.audioMixed.retrieve` | `read` | Retrieve a mixed audio artifact |
| `audioMixed.update` | `recallai.api.audioMixed.update` | `write` | Update mixed audio artifact metadata |
| `audioSeparate.delete` | `recallai.api.audioSeparate.delete` | `destructive` | Delete a separate audio artifact |
| `audioSeparate.list` | `recallai.api.audioSeparate.list` | `read` | List separate audio artifacts |
| `audioSeparate.retrieve` | `recallai.api.audioSeparate.retrieve` | `read` | Retrieve a separate audio artifact |
| `audioSeparate.update` | `recallai.api.audioSeparate.update` | `write` | Update separate audio artifact metadata |
| `billing.retrieveUsage` | `recallai.api.billing.retrieveUsage` | `read` | Retrieve Recall.ai billing usage |
| `botActions.deleteBotMedia` | `recallai.api.botActions.deleteBotMedia` | `destructive` | Delete stored media for a Recall.ai bot |
| `botActions.leaveBotCall` | `recallai.api.botActions.leaveBotCall` | `destructive` | Remove a Recall.ai bot from its meeting |
| `botActions.outputAudio` | `recallai.api.botActions.outputAudio` | `write` | Output audio from a Recall.ai bot |
| `botActions.outputMedia` | `recallai.api.botActions.outputMedia` | `write` | Start media output from a Recall.ai bot |
| `botActions.outputVideo` | `recallai.api.botActions.outputVideo` | `write` | Output video from a Recall.ai bot |
| `botActions.pauseRecording` | `recallai.api.botActions.pauseRecording` | `write` | Pause a Recall.ai bot recording |
| `botActions.pinParticipant` | `recallai.api.botActions.pinParticipant` | `write` | Pin a participant for a Recall.ai bot |
| `botActions.resumeRecording` | `recallai.api.botActions.resumeRecording` | `write` | Resume a Recall.ai bot recording |
| `botActions.sendChatMessage` | `recallai.api.botActions.sendChatMessage` | `write` | Send a chat message from a Recall.ai bot |
| `botActions.startRecording` | `recallai.api.botActions.startRecording` | `write` | Start a Recall.ai bot recording |
| `botActions.startScreenshare` | `recallai.api.botActions.startScreenshare` | `write` | Start bot screenshare in Recall.ai |
| `botActions.stopOutputAudio` | `recallai.api.botActions.stopOutputAudio` | `write` | Stop bot audio output in Recall.ai |
| `botActions.stopOutputMedia` | `recallai.api.botActions.stopOutputMedia` | `write` | Stop bot media output in Recall.ai |
| `botActions.stopOutputVideo` | `recallai.api.botActions.stopOutputVideo` | `write` | Stop bot video output in Recall.ai |
| `botActions.stopRecording` | `recallai.api.botActions.stopRecording` | `write` | Stop a Recall.ai bot recording |
| `botActions.stopScreenshare` | `recallai.api.botActions.stopScreenshare` | `write` | Stop bot screenshare in Recall.ai |
| `bots.create` | `recallai.api.bots.create` | `write` | Create a Recall.ai meeting bot |
| `bots.delete` | `recallai.api.bots.delete` | `destructive` | Delete a Recall.ai meeting bot |
| `bots.list` | `recallai.api.bots.list` | `read` | List Recall.ai meeting bots |
| `bots.retrieve` | `recallai.api.bots.retrieve` | `read` | Retrieve a Recall.ai meeting bot |
| `bots.update` | `recallai.api.bots.update` | `write` | Update a Recall.ai meeting bot |
| `calendar.authenticate` | `recallai.api.calendar.authenticate` | `write` | Create a Recall.ai calendar auth token |
| `calendar.deleteUser` | `recallai.api.calendar.deleteUser` | `destructive` | Delete a Recall.ai calendar user |
| `calendar.disconnectPlatform` | `recallai.api.calendar.disconnectPlatform` | `destructive` | Disconnect a Recall.ai calendar platform |
| `calendar.listEvents` | `recallai.api.calendar.listEvents` | `read` | List Recall.ai calendar events |
| `calendar.listMeetings` | `recallai.api.calendar.listMeetings` | `read` | List Recall.ai calendar meetings |
| `calendar.listUsers` | `recallai.api.calendar.listUsers` | `read` | List Recall.ai calendar users |
| `calendar.refreshMeetings` | `recallai.api.calendar.refreshMeetings` | `write` | Refresh Recall.ai calendar meetings |
| `calendar.retrieveEvent` | `recallai.api.calendar.retrieveEvent` | `read` | Retrieve a Recall.ai calendar event |
| `calendar.retrieveMeeting` | `recallai.api.calendar.retrieveMeeting` | `read` | Retrieve a Recall.ai calendar meeting |
| `calendar.retrieveUser` | `recallai.api.calendar.retrieveUser` | `read` | Retrieve a Recall.ai calendar user |
| `calendar.scheduleBot` | `recallai.api.calendar.scheduleBot` | `write` | Schedule a Recall.ai bot for a calendar event |
| `calendar.unscheduleBot` | `recallai.api.calendar.unscheduleBot` | `destructive` | Remove a scheduled Recall.ai bot from a calendar event |
| `calendar.updateMeeting` | `recallai.api.calendar.updateMeeting` | `write` | Update a Recall.ai calendar meeting |
| `calendar.updateUser` | `recallai.api.calendar.updateUser` | `write` | Update a Recall.ai calendar user |
| `calendars.create` | `recallai.api.calendars.create` | `write` | Create a Recall.ai calendar |
| `calendars.createAccessToken` | `recallai.api.calendars.createAccessToken` | `write` | Create a Recall.ai calendar access token |
| `calendars.delete` | `recallai.api.calendars.delete` | `destructive` | Delete a Recall.ai calendar |
| `calendars.list` | `recallai.api.calendars.list` | `read` | List Recall.ai calendars |
| `calendars.retrieve` | `recallai.api.calendars.retrieve` | `read` | Retrieve a Recall.ai calendar |
| `calendars.update` | `recallai.api.calendars.update` | `write` | Update a Recall.ai calendar |
| `googleLoginGroups.create` | `recallai.api.googleLoginGroups.create` | `write` | Create a Recall.ai Google login group |
| `googleLoginGroups.delete` | `recallai.api.googleLoginGroups.delete` | `destructive` | Delete a Recall.ai Google login group |
| `googleLoginGroups.list` | `recallai.api.googleLoginGroups.list` | `read` | List Recall.ai Google login groups |
| `googleLoginGroups.partialUpdate` | `recallai.api.googleLoginGroups.partialUpdate` | `write` | Update fields on a Recall.ai Google login group |
| `googleLoginGroups.retrieve` | `recallai.api.googleLoginGroups.retrieve` | `read` | Retrieve a Recall.ai Google login group |
| `googleLoginGroups.update` | `recallai.api.googleLoginGroups.update` | `write` | Replace a Recall.ai Google login group |
| `googleLogins.create` | `recallai.api.googleLogins.create` | `write` | Create a Recall.ai Google login |
| `googleLogins.delete` | `recallai.api.googleLogins.delete` | `destructive` | Delete a Recall.ai Google login |
| `googleLogins.list` | `recallai.api.googleLogins.list` | `read` | List Recall.ai Google logins |
| `googleLogins.partialUpdate` | `recallai.api.googleLogins.partialUpdate` | `write` | Update fields on a Recall.ai Google login |
| `googleLogins.retrieve` | `recallai.api.googleLogins.retrieve` | `read` | Retrieve a Recall.ai Google login |
| `googleLogins.update` | `recallai.api.googleLogins.update` | `write` | Replace a Recall.ai Google login |
| `meetingDirectConnects.create` | `recallai.api.meetingDirectConnects.create` | `write` | Create a Recall.ai direct connection |
| `meetingDirectConnects.list` | `recallai.api.meetingDirectConnects.list` | `read` | List Recall.ai direct connections |
| `meetingDirectConnects.retrieve` | `recallai.api.meetingDirectConnects.retrieve` | `read` | Retrieve a Recall.ai direct connection |
| `meetingMetadata.delete` | `recallai.api.meetingMetadata.delete` | `destructive` | Delete a Recall.ai meeting metadata artifact |
| `meetingMetadata.list` | `recallai.api.meetingMetadata.list` | `read` | List Recall.ai meeting metadata artifacts |
| `meetingMetadata.retrieve` | `recallai.api.meetingMetadata.retrieve` | `read` | Retrieve a Recall.ai meeting metadata artifact |
| `meetingMetadata.update` | `recallai.api.meetingMetadata.update` | `write` | Update Recall.ai meeting metadata |
| `participantEvents.delete` | `recallai.api.participantEvents.delete` | `destructive` | Delete a Recall.ai participant event artifact |
| `participantEvents.list` | `recallai.api.participantEvents.list` | `read` | List Recall.ai participant event artifacts |
| `participantEvents.retrieve` | `recallai.api.participantEvents.retrieve` | `read` | Retrieve a Recall.ai participant event artifact |
| `participantEvents.update` | `recallai.api.participantEvents.update` | `write` | Update Recall.ai participant event metadata |
| `realtimeEndpoints.list` | `recallai.api.realtimeEndpoints.list` | `read` | List Recall.ai real-time endpoints |
| `realtimeEndpoints.retrieve` | `recallai.api.realtimeEndpoints.retrieve` | `read` | Retrieve a Recall.ai real-time endpoint |
| `realtimeEndpoints.update` | `recallai.api.realtimeEndpoints.update` | `write` | Update a Recall.ai real-time endpoint |
| `recordings.createTranscript` | `recallai.api.recordings.createTranscript` | `write` | Create an asynchronous Recall.ai transcript |
| `recordings.delete` | `recallai.api.recordings.delete` | `destructive` | Delete a Recall.ai recording artifact |
| `recordings.list` | `recallai.api.recordings.list` | `read` | List Recall.ai recording artifacts |
| `recordings.retrieve` | `recallai.api.recordings.retrieve` | `read` | Retrieve a Recall.ai recording artifact |
| `recordings.update` | `recallai.api.recordings.update` | `write` | Update Recall.ai recording metadata |
| `sdkUploads.create` | `recallai.api.sdkUploads.create` | `write` | Create a Recall.ai Desktop SDK upload |
| `sdkUploads.list` | `recallai.api.sdkUploads.list` | `read` | List Recall.ai Desktop SDK uploads |
| `sdkUploads.retrieve` | `recallai.api.sdkUploads.retrieve` | `read` | Retrieve a Recall.ai Desktop SDK upload |
| `transcripts.delete` | `recallai.api.transcripts.delete` | `destructive` | Delete a Recall.ai transcript artifact |
| `transcripts.list` | `recallai.api.transcripts.list` | `read` | List Recall.ai transcript artifacts |
| `transcripts.retrieve` | `recallai.api.transcripts.retrieve` | `read` | Retrieve a Recall.ai transcript artifact |
| `transcripts.update` | `recallai.api.transcripts.update` | `write` | Update Recall.ai transcript metadata |
| `videoMixed.delete` | `recallai.api.videoMixed.delete` | `destructive` | Delete a mixed video artifact |
| `videoMixed.list` | `recallai.api.videoMixed.list` | `read` | List mixed video artifacts |
| `videoMixed.retrieve` | `recallai.api.videoMixed.retrieve` | `read` | Retrieve a mixed video artifact |
| `videoMixed.update` | `recallai.api.videoMixed.update` | `write` | Update mixed video artifact metadata |
| `videoSeparate.delete` | `recallai.api.videoSeparate.delete` | `destructive` | Delete a separate video artifact |
| `videoSeparate.list` | `recallai.api.videoSeparate.list` | `read` | List separate video artifacts |
| `videoSeparate.retrieve` | `recallai.api.videoSeparate.retrieve` | `read` | Retrieve a separate video artifact |
| `videoSeparate.update` | `recallai.api.videoSeparate.update` | `write` | Update separate video artifact metadata |
| `zoomMeetingsToCredentials.list` | `recallai.api.zoomMeetingsToCredentials.list` | `read` | List Zoom meeting credential mappings |
| `zoomOAuthAppLogs.list` | `recallai.api.zoomOAuthAppLogs.list` | `read` | List Recall.ai Zoom OAuth app logs |
| `zoomOAuthApps.create` | `recallai.api.zoomOAuthApps.create` | `write` | Create a Recall.ai Zoom OAuth app |
| `zoomOAuthApps.delete` | `recallai.api.zoomOAuthApps.delete` | `destructive` | Delete a Recall.ai Zoom OAuth app |
| `zoomOAuthApps.list` | `recallai.api.zoomOAuthApps.list` | `read` | List Recall.ai Zoom OAuth apps |
| `zoomOAuthApps.retrieve` | `recallai.api.zoomOAuthApps.retrieve` | `read` | Retrieve a Recall.ai Zoom OAuth app |
| `zoomOAuthApps.update` | `recallai.api.zoomOAuthApps.update` | `write` | Update a Recall.ai Zoom OAuth app |
| `zoomOAuthCredentialLogs.list` | `recallai.api.zoomOAuthCredentialLogs.list` | `read` | List Recall.ai Zoom OAuth credential logs |
| `zoomOAuthCredentials.create` | `recallai.api.zoomOAuthCredentials.create` | `write` | Create a Recall.ai Zoom OAuth credential |
| `zoomOAuthCredentials.delete` | `recallai.api.zoomOAuthCredentials.delete` | `destructive` | Delete a Recall.ai Zoom OAuth credential |
| `zoomOAuthCredentials.list` | `recallai.api.zoomOAuthCredentials.list` | `read` | List Recall.ai Zoom OAuth credentials |
| `zoomOAuthCredentials.retrieve` | `recallai.api.zoomOAuthCredentials.retrieve` | `read` | Retrieve a Recall.ai Zoom OAuth credential |
| `zoomOAuthCredentials.retrieveAccessToken` | `recallai.api.zoomOAuthCredentials.retrieveAccessToken` | `read` | Retrieve a Zoom OAuth access token |
| `zoomOAuthCredentials.syncMeetings` | `recallai.api.zoomOAuthCredentials.syncMeetings` | `write` | Synchronize Zoom OAuth credential meetings |
| `zoomOAuthCredentials.validate` | `recallai.api.zoomOAuthCredentials.validate` | `write` | Validate a Recall.ai Zoom OAuth credential |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/recallai

## License

Apache-2.0
