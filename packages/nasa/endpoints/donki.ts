import type { z } from 'zod';
import type { NasaContext, NasaEndpoints } from '..';
import { call } from './call';
import {
	NasaEndpointInputSchemas as Inputs,
	NasaEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Shapes a DONKI answer into the response key the endpoint documents. Every
 * DONKI route answers a bare array, `[]` when nothing matched, so anything else
 * means the contract changed and the call fails here instead of returning an
 * empty page.
 */
export function donkiList(key: string) {
	// unknown: a DONKI body, validated as an array before anything is read.
	return (raw: unknown) => {
		if (!Array.isArray(raw)) {
			throw new Error(`Expected a NASA DONKI event array, got ${typeof raw}`);
		}
		return { [key]: raw };
	};
}

/** The six DONKI routes that take only an inclusive date range. */
function dateRange<Output extends z.ZodType>(
	ctx: NasaContext,
	path: string,
	event: string,
	key: string,
	input: unknown,
	output: Output,
): Promise<z.output<Output>> {
	return call(
		ctx,
		{ event, input: Inputs.cmeList, output },
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			host: 'api',
			path,
			query: { startDate, endDate },
		}),
		{ shape: donkiList(key) },
	);
}

export const cmeList: NasaEndpoints['cmeList'] = (ctx, input) =>
	dateRange(ctx, '/DONKI/CME', 'donki.cme', 'events', input, Outputs.cmeList);

/**
 * CME analyses carry their own filters, and `mostAccurateOnly` and
 * `completeEntryOnly` default to true at the provider, so omitting them hides
 * most analyses.
 */
export const cmeAnalysisList: NasaEndpoints['cmeAnalysisList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'donki.cmeAnalysis',
			input: Inputs.cmeAnalysisList,
			output: Outputs.cmeAnalysisList,
		},
		input,
		({
			startDate,
			endDate,
			mostAccurateOnly,
			completeEntryOnly,
			speed,
			halfAngle,
			catalog,
			keyword,
		}) => ({
			method: 'GET',
			host: 'api',
			path: '/DONKI/CMEAnalysis',
			query: {
				startDate,
				endDate,
				mostAccurateOnly,
				completeEntryOnly,
				speed,
				halfAngle,
				catalog,
				keyword,
			},
		}),
		{ shape: donkiList('analyses') },
	);

export const geomagneticStormList: NasaEndpoints['geomagneticStormList'] = (
	ctx,
	input,
) =>
	dateRange(
		ctx,
		'/DONKI/GST',
		'donki.geomagneticStorm',
		'storms',
		input,
		Outputs.geomagneticStormList,
	);

export const solarFlareList: NasaEndpoints['solarFlareList'] = (ctx, input) =>
	dateRange(
		ctx,
		'/DONKI/FLR',
		'donki.solarFlare',
		'flares',
		input,
		Outputs.solarFlareList,
	);

export const solarEnergeticParticleList: NasaEndpoints['solarEnergeticParticleList'] =
	(ctx, input) =>
		dateRange(
			ctx,
			'/DONKI/SEP',
			'donki.solarEnergeticParticle',
			'particles',
			input,
			Outputs.solarEnergeticParticleList,
		);

export const magnetopauseCrossingList: NasaEndpoints['magnetopauseCrossingList'] =
	(ctx, input) =>
		dateRange(
			ctx,
			'/DONKI/MPC',
			'donki.magnetopauseCrossing',
			'crossings',
			input,
			Outputs.magnetopauseCrossingList,
		);

export const radiationBeltList: NasaEndpoints['radiationBeltList'] = (
	ctx,
	input,
) =>
	dateRange(
		ctx,
		'/DONKI/RBE',
		'donki.radiationBelt',
		'enhancements',
		input,
		Outputs.radiationBeltList,
	);

export const highSpeedStreamList: NasaEndpoints['highSpeedStreamList'] = (
	ctx,
	input,
) =>
	dateRange(
		ctx,
		'/DONKI/HSS',
		'donki.highSpeedStream',
		'streams',
		input,
		Outputs.highSpeedStreamList,
	);

export const interplanetaryShockList: NasaEndpoints['interplanetaryShockList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'donki.interplanetaryShock',
				input: Inputs.interplanetaryShockList,
				output: Outputs.interplanetaryShockList,
			},
			input,
			({ startDate, endDate, location, catalog }) => ({
				method: 'GET',
				host: 'api',
				path: '/DONKI/IPS',
				query: { startDate, endDate, location, catalog },
			}),
			{ shape: donkiList('shocks') },
		);

export const enlilSimulationList: NasaEndpoints['enlilSimulationList'] = (
	ctx,
	input,
) =>
	dateRange(
		ctx,
		'/DONKI/WSAEnlilSimulations',
		'donki.enlilSimulation',
		'simulations',
		input,
		Outputs.enlilSimulationList,
	);

/**
 * Notifications wrap a free-text body and are capped to a 30-day window. NASA
 * shifts a wider range rather than rejecting it, so the range is not checked
 * here.
 */
export const notificationList: NasaEndpoints['notificationList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'donki.notification',
			input: Inputs.notificationList,
			output: Outputs.notificationList,
		},
		input,
		({ startDate, endDate, type }) => ({
			method: 'GET',
			host: 'api',
			path: '/DONKI/notifications',
			query: { startDate, endDate, type },
		}),
		{
			shape: donkiList('notifications'),
			log: (_, result) => ({ count: result.notifications.length }),
		},
	);
