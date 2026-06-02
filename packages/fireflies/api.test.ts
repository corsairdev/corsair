import 'dotenv/config';
import { makeFirefliesRequest } from './client';
import type {
	AiAppGetOutputsResponse,
	AskFredContinueThreadResponse,
	AskFredCreateThreadResponse,
	AskFredDeleteThreadResponse,
	AskFredGetThreadResponse,
	AskFredGetThreadsResponse,
	AudioUploadResponse,
	TranscriptsGetAnalyticsResponse,
	TranscriptsGetAudioUrlResponse,
	TranscriptsGetResponse,
	TranscriptsGetSummaryResponse,
	TranscriptsGetVideoUrlResponse,
	TranscriptsListResponse,
	UsersGetCurrentResponse,
	UsersListResponse,
} from './endpoints/types';
import { FirefliesEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.FIREFLIES_API_KEY!;

const TRANSCRIPTS_LIST_QUERY = `
  query Transcripts($limit: Int) {
    transcripts(limit: $limit) {
      id title date duration host_email organizer_email calendar_id transcript_url meeting_link video_url audio_url privacy
    }
  }
`;

const TRANSCRIPT_GET_QUERY = `
  query Transcript($id: String!) {
    transcript(id: $id) {
      id title date duration host_email organizer_email calendar_id transcript_url meeting_link video_url audio_url privacy
      sentences {
        index speaker_id speaker_name raw_text text start_time end_time
        ai_filters { task pricing metric question date_and_time }
      }
      summary {
        keywords action_items outline shorthand_bullet overview bullet_gist gist short_summary notes short_overview meeting_type
      }
      speakers { id name }
      meeting_attendees { displayName email phoneNumber name location }
    }
  }
`;

const TRANSCRIPT_GET_ANALYTICS_QUERY = `
  query TranscriptAnalytics($id: String!) {
    transcript(id: $id) {
      id
      analytics {
        sentiments { negative_pct neutral_pct positive_pct }
        categories { questions date_times metrics tasks }
      }
    }
  }
`;

const TRANSCRIPT_GET_AUDIO_URL_QUERY = `
  query TranscriptAudioUrl($id: String!) {
    transcript(id: $id) {
      id
      audio_url
    }
  }
`;

const TRANSCRIPT_GET_VIDEO_URL_QUERY = `
  query TranscriptVideoUrl($id: String!) {
    transcript(id: $id) {
      id
      video_url
    }
  }
`;

const TRANSCRIPT_GET_SUMMARY_QUERY = `
  query TranscriptSummary($id: String!) {
    transcript(id: $id) {
      id
      summary {
        keywords action_items outline shorthand_bullet overview bullet_gist gist short_summary notes short_overview meeting_type
      }
    }
  }
`;

const USER_QUERY = `
  query User {
    user {
      user_id email name num_transcripts minutes_consumed is_admin integrations
    }
  }
`;

const USERS_LIST_QUERY = `
  query Users {
    users {
      user_id email name num_transcripts minutes_consumed is_admin integrations
    }
  }
`;

// askfred_threads returns AskFredThreadSummary (no messages field)
const THREAD_SUMMARY_FIELDS = `id title transcript_id user_id created_at`;
// askfred_thread returns AskFredThread (has messages field)
const THREAD_FIELDS = `id title transcript_id user_id created_at messages { id thread_id query answer status created_at updated_at }`;

// Fireflies uses snake_case query names: askfred_threads, askfred_thread
const ASK_FRED_THREADS_QUERY = `
  query AskFredThreads($transcript_id: String) {
    askfred_threads(transcript_id: $transcript_id) {
      ${THREAD_SUMMARY_FIELDS}
    }
  }
`;

const ASK_FRED_THREAD_QUERY = `
  query AskFredThread($id: String!) {
    askfred_thread(id: $id) {
      ${THREAD_FIELDS}
    }
  }
`;

const MESSAGE_FIELDS = `id thread_id query answer status created_at updated_at`;

// createAskFredThread takes input: { query, transcript_id }
const CREATE_ASK_FRED_THREAD_MUTATION = `
  mutation CreateAskFredThread($input: CreateAskFredThreadInput!) {
    createAskFredThread(input: $input) {
      message { ${MESSAGE_FIELDS} }
      cost
    }
  }
`;

// continueAskFredThread takes input: { thread_id, query }
const CONTINUE_ASK_FRED_THREAD_MUTATION = `
  mutation ContinueAskFredThread($input: ContinueAskFredThreadInput!) {
    continueAskFredThread(input: $input) {
      message { ${MESSAGE_FIELDS} }
      cost
    }
  }
`;

// deleteAskFredThread returns the deleted AskFredThread
const DELETE_ASK_FRED_THREAD_MUTATION = `
  mutation DeleteAskFredThread($id: String!) {
    deleteAskFredThread(id: $id) {
      ${THREAD_FIELDS}
    }
  }
`;

// AudioUploadInput uses custom_language (not language), uploadAudio returns success/title/message
const UPLOAD_AUDIO_MUTATION = `
  mutation UploadAudio($url: String!, $title: String, $custom_language: String) {
    uploadAudio(input: { url: $url, title: $title, custom_language: $custom_language }) {
      success
      title
      message
    }
  }
`;

// apps(app_id, transcript_id) returns Apps { outputs: AppOutput[] }
const AI_APP_OUTPUTS_QUERY = `
  query AiAppOutputs($transcript_id: String, $app_id: String) {
    apps(transcript_id: $transcript_id, app_id: $app_id) {
      outputs {
        transcript_id user_id app_id created_at title prompt response
      }
    }
  }
`;

describe('Fireflies API Type Tests', () => {
	describe('schema introspection', () => {
		it('lists available queries and mutations', async () => {
			const SCHEMA_QUERY = `
				query {
					__schema {
						queryType { fields { name } }
						mutationType { fields { name } }
					}
				}
			`;
			// type: unknown - GraphQL introspection has no static TypeScript type
			await makeFirefliesRequest<unknown>(SCHEMA_QUERY, TEST_API_KEY);
		});

		it('lists Transcript type fields', async () => {
			const TYPE_QUERY = `
				query {
					__type(name: "Transcript") {
						fields {
							name
							type { name kind ofType { name kind } }
						}
					}
				}
			`;
			// type: unknown - GraphQL introspection has no static TypeScript type
			await makeFirefliesRequest<unknown>(TYPE_QUERY, TEST_API_KEY);
		});

		it('lists MeetingAnalytics, Summary, Sentence, AskFredThread type fields', async () => {
			const TYPES_QUERY = `
				query {
					meetingAnalytics: __type(name: "MeetingAnalytics") {
						fields { name type { name kind ofType { name kind } } }
					}
					summary: __type(name: "Summary") {
						fields { name type { name kind ofType { name kind } } }
					}
					sentence: __type(name: "Sentence") {
						fields { name type { name kind ofType { name kind } } }
					}
					askFredThread: __type(name: "AskFredThread") {
						fields { name type { name kind ofType { name kind } } }
					}
					appOutput: __type(name: "App") {
						fields { name type { name kind ofType { name kind } } }
					}
				}
			`;
			// type: unknown - GraphQL introspection has no static TypeScript type
			await makeFirefliesRequest<unknown>(TYPES_QUERY, TEST_API_KEY);
		});
	});

	describe('transcripts', () => {
		it('transcriptsList returns correct type', async () => {
			const response = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 10 },
			);

			FirefliesEndpointOutputSchemas.transcriptsList.parse(response);
		});

		it('transcriptsGet returns correct type', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const response = await makeFirefliesRequest<TranscriptsGetResponse>(
				TRANSCRIPT_GET_QUERY,
				TEST_API_KEY,
				{ id: transcriptId },
			);

			FirefliesEndpointOutputSchemas.transcriptsGet.parse(response);
		});

		it('transcriptsGetAnalytics returns correct type', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const response =
				await makeFirefliesRequest<TranscriptsGetAnalyticsResponse>(
					TRANSCRIPT_GET_ANALYTICS_QUERY,
					TEST_API_KEY,
					{ id: transcriptId },
				);

			FirefliesEndpointOutputSchemas.transcriptsGetAnalytics.parse(response);
		});

		it('transcriptsGetAudioUrl returns correct type', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const response =
				await makeFirefliesRequest<TranscriptsGetAudioUrlResponse>(
					TRANSCRIPT_GET_AUDIO_URL_QUERY,
					TEST_API_KEY,
					{ id: transcriptId },
				);

			FirefliesEndpointOutputSchemas.transcriptsGetAudioUrl.parse(response);
		});

		it('transcriptsGetVideoUrl returns correct type', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const response =
				await makeFirefliesRequest<TranscriptsGetVideoUrlResponse>(
					TRANSCRIPT_GET_VIDEO_URL_QUERY,
					TEST_API_KEY,
					{ id: transcriptId },
				);

			FirefliesEndpointOutputSchemas.transcriptsGetVideoUrl.parse(response);
		});

		it('transcriptsGetSummary returns correct type', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const response =
				await makeFirefliesRequest<TranscriptsGetSummaryResponse>(
					TRANSCRIPT_GET_SUMMARY_QUERY,
					TEST_API_KEY,
					{ id: transcriptId },
				);

			FirefliesEndpointOutputSchemas.transcriptsGetSummary.parse(response);
		});
	});

	describe('users', () => {
		it('usersGetCurrent returns correct type', async () => {
			const response = await makeFirefliesRequest<UsersGetCurrentResponse>(
				USER_QUERY,
				TEST_API_KEY,
			);

			FirefliesEndpointOutputSchemas.usersGetCurrent.parse(response);
		});

		it('usersList returns correct type', async () => {
			const response = await makeFirefliesRequest<UsersListResponse>(
				USERS_LIST_QUERY,
				TEST_API_KEY,
			);

			FirefliesEndpointOutputSchemas.usersList.parse(response);
		});
	});

	describe('askFred', () => {
		it('askFredGetThreads returns correct type', async () => {
			const response = await makeFirefliesRequest<AskFredGetThreadsResponse>(
				ASK_FRED_THREADS_QUERY,
				TEST_API_KEY,
				{ transcript_id: undefined },
			);

			FirefliesEndpointOutputSchemas.askFredGetThreads.parse(response);
		});

		it('askFredCreateThread, getThread, continueThread, deleteThread lifecycle', async () => {
			const listResponse = await makeFirefliesRequest<TranscriptsListResponse>(
				TRANSCRIPTS_LIST_QUERY,
				TEST_API_KEY,
				{ limit: 1 },
			);

			const transcriptId = listResponse.transcripts[0]?.id;
			if (!transcriptId) {
				throw new Error('No transcripts found');
			}

			const createResponse =
				await makeFirefliesRequest<AskFredCreateThreadResponse>(
					CREATE_ASK_FRED_THREAD_MUTATION,
					TEST_API_KEY,
					{
						input: {
							transcript_id: transcriptId,
							query: 'What were the main topics discussed?',
						},
					},
				);

			FirefliesEndpointOutputSchemas.askFredCreateThread.parse(createResponse);

			const threadId = createResponse.createAskFredThread.message.thread_id;
			if (!threadId) {
				throw new Error('Thread was not created');
			}

			const getResponse = await makeFirefliesRequest<AskFredGetThreadResponse>(
				ASK_FRED_THREAD_QUERY,
				TEST_API_KEY,
				{ id: threadId },
			);

			FirefliesEndpointOutputSchemas.askFredGetThread.parse(getResponse);

			const continueResponse =
				await makeFirefliesRequest<AskFredContinueThreadResponse>(
					CONTINUE_ASK_FRED_THREAD_MUTATION,
					TEST_API_KEY,
					{
						input: {
							thread_id: threadId,
							query: 'Can you summarize the action items?',
						},
					},
				);

			FirefliesEndpointOutputSchemas.askFredContinueThread.parse(
				continueResponse,
			);

			const deleteResponse =
				await makeFirefliesRequest<AskFredDeleteThreadResponse>(
					DELETE_ASK_FRED_THREAD_MUTATION,
					TEST_API_KEY,
					{ id: threadId },
				);

			FirefliesEndpointOutputSchemas.askFredDeleteThread.parse(deleteResponse);
		});
	});

	describe('audio', () => {
		it('audioUpload returns correct type', async () => {
			const response = await makeFirefliesRequest<AudioUploadResponse>(
				UPLOAD_AUDIO_MUTATION,
				TEST_API_KEY,
				{
					url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
					title: 'Test Upload',
				},
			);

			FirefliesEndpointOutputSchemas.audioUpload.parse(response);
		});
	});

	describe('aiApp', () => {
		it('aiAppGetOutputs returns correct type', async () => {
			const response = await makeFirefliesRequest<AiAppGetOutputsResponse>(
				AI_APP_OUTPUTS_QUERY,
				TEST_API_KEY,
				{ transcript_id: undefined, app_id: undefined },
			);

			FirefliesEndpointOutputSchemas.aiAppGetOutputs.parse(response);
		});
	});
});
