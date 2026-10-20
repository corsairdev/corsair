import { logEventFromContext } from 'corsair/core';
import type { BenzingaEndpoints } from '..';
import type { StreamConnection } from './types';
import { BenzingaEndpointInputSchemas } from './types';

const BENZINGA_STREAM_BASE = 'wss://api.benzinga.com';

function streamConnection(
	path: string,
	filters: Record<string, string | undefined>,
): StreamConnection {
	const url = new URL(path, BENZINGA_STREAM_BASE);
	for (const [name, value] of Object.entries(filters)) {
		if (value !== undefined) {
			url.searchParams.set(name, value);
		}
	}
	return {
		url: url.toString(),
		authQueryParam: 'token',
		commands: ['ping', 'replay'],
	};
}

export const getEarningsStream: BenzingaEndpoints['getEarningsStream'] = async (
	ctx,
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.getEarningsStream.parse(rawInput);
	const response = streamConnection('/api/v2.1/calendar/earnings/stream', {
		tickers: input.tickers,
		isins: input.isins,
	});

	await logEventFromContext(
		ctx,
		'benzinga.calendar.getEarningsStream',
		{ ...input },
		'completed',
	);

	return response;
};

export const getNewsStream: BenzingaEndpoints['getNewsStream'] = async (
	ctx,
	rawInput,
) => {
	const input = BenzingaEndpointInputSchemas.getNewsStream.parse(rawInput);
	const response = streamConnection('/api/v1/news/stream', {
		tickers: input.tickers,
		channels: input.channels,
	});

	await logEventFromContext(
		ctx,
		'benzinga.news.getStream',
		{ ...input },
		'completed',
	);

	return response;
};
