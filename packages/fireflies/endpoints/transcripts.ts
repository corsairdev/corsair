import { logEventFromContext } from 'corsair/core';
import type { FirefliesEndpoints } from '..';
import { makeFirefliesRequest } from '../client';
import type { FirefliesEndpointOutputs } from './types';

const TRANSCRIPTS_LIST_QUERY = `
  query Transcripts($title: String, $fromDate: DateTime, $toDate: DateTime, $limit: Int, $skip: Int, $host_email: String, $participant_email: String, $mine: Boolean) {
    transcripts(title: $title, fromDate: $fromDate, toDate: $toDate, limit: $limit, skip: $skip, host_email: $host_email, participant_email: $participant_email, mine: $mine) {
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

export const list: FirefliesEndpoints['transcriptsList'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['transcriptsList']
	>(TRANSCRIPTS_LIST_QUERY, ctx.key, {
		title: input.title,
		fromDate: input.fromDate,
		toDate: input.toDate,
		limit: input.limit,
		skip: input.skip,
		host_email: input.host_email,
		participant_email: input.participant_email,
		mine: input.mine,
	});

	if (ctx.db.transcripts) {
		for (const transcript of response.transcripts) {
			try {
				await ctx.db.transcripts.upsertByEntityId(transcript.id, {
					...transcript,
				});
			} catch (error) {
				console.warn('Failed to save transcript to database:', error);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.transcripts.list',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: FirefliesEndpoints['transcriptsGet'] = async (ctx, input) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['transcriptsGet']
	>(TRANSCRIPT_GET_QUERY, ctx.key, { id: input.transcriptId });

	if (ctx.db.transcripts && response.transcript) {
		try {
			await ctx.db.transcripts.upsertByEntityId(response.transcript.id, {
				...response.transcript,
			});
		} catch (error) {
			console.warn('Failed to save transcript to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'fireflies.transcripts.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const getAnalytics: FirefliesEndpoints['transcriptsGetAnalytics'] =
	async (ctx, input) => {
		const response = await makeFirefliesRequest<
			FirefliesEndpointOutputs['transcriptsGetAnalytics']
		>(TRANSCRIPT_GET_ANALYTICS_QUERY, ctx.key, { id: input.transcriptId });

		await logEventFromContext(
			ctx,
			'fireflies.transcripts.getAnalytics',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getAudioUrl: FirefliesEndpoints['transcriptsGetAudioUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['transcriptsGetAudioUrl']
	>(TRANSCRIPT_GET_AUDIO_URL_QUERY, ctx.key, { id: input.transcriptId });

	await logEventFromContext(
		ctx,
		'fireflies.transcripts.getAudioUrl',
		{ ...input },
		'completed',
	);
	return response;
};

export const getVideoUrl: FirefliesEndpoints['transcriptsGetVideoUrl'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['transcriptsGetVideoUrl']
	>(TRANSCRIPT_GET_VIDEO_URL_QUERY, ctx.key, { id: input.transcriptId });

	await logEventFromContext(
		ctx,
		'fireflies.transcripts.getVideoUrl',
		{ ...input },
		'completed',
	);
	return response;
};

export const getSummary: FirefliesEndpoints['transcriptsGetSummary'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['transcriptsGetSummary']
	>(TRANSCRIPT_GET_SUMMARY_QUERY, ctx.key, { id: input.transcriptId });

	await logEventFromContext(
		ctx,
		'fireflies.transcripts.getSummary',
		{ ...input },
		'completed',
	);
	return response;
};
