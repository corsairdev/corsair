import { asRecord } from 'corsair/core';
import type { NiftyimagesEndpoints } from '..';
import { segment } from '../client';
import { asList, call } from './call';
import {
	NiftyimagesEndpointInputSchemas as Inputs,
	NiftyimagesEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Lists every widget in the account. The docs' example shows a bare array of
 * `{ Name, WidgetKey }`, and the WidgetKey is what every other widget call takes.
 */
export const list: NiftyimagesEndpoints['widgetsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'widgets.list',
			input: Inputs.widgetsList,
			output: Outputs.widgetsList,
		},
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			path: '/Widgets',
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ widgets: asList(raw, 'widget') }),
			log: (_, result) => ({ count: result.widgets.length }),
		},
	);

/**
 * Per-widget stats for a time window. `/Widgets/AllStats` answers every widget
 * at once, so this is the call for a dashboard rather than one widget.
 */
export const stats: NiftyimagesEndpoints['widgetsStats'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'widgets.stats',
			input: Inputs.widgetsStats,
			output: Outputs.widgetsStats,
		},
		input,
		({ startDate, endDate }) => ({
			method: 'GET',
			path: '/Widgets/AllStats',
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ stats: asList(raw, 'widget stat') }),
			log: (_, result) => ({ count: result.stats.length }),
		},
	);

/** Lists the users a widget recorded, with their view and click counts. */
export const users: NiftyimagesEndpoints['widgetsUsers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'widgets.users',
			input: Inputs.widgetsUsers,
			output: Outputs.widgetsUsers,
		},
		input,
		({ widgetKey, startDate, endDate }) => ({
			method: 'GET',
			path: `/Widgets/${segment(widgetKey)}/Users`,
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ users: asList(raw, 'user') }),
			log: ({ widgetKey }, result) => ({
				widgetKey,
				count: result.users.length,
			}),
		},
	);

/**
 * Aggregated stats for one user of one widget. The user is whatever the widget
 * recorded for that recipient, which is usually an email address, so it is
 * encoded as one path segment.
 */
export const userStats: NiftyimagesEndpoints['widgetUserStats'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'widgets.userStats',
			input: Inputs.widgetUserStats,
			output: Outputs.widgetUserStats,
		},
		input,
		({ widgetKey, user, startDate, endDate }) => ({
			method: 'GET',
			path: `/Widgets/${segment(widgetKey)}/Users/${segment(user)}`,
			query: { startDate, endDate },
		}),
		{
			// The docs show this endpoint's payload without an envelope, so a bare
			// object is accepted as well as `{ stats }`.
			shape: (raw) => (asRecord(raw)?.stats ? raw : { stats: raw }),
			log: ({ widgetKey }, result) => ({
				widgetKey,
				views: result.stats.Views ?? undefined,
			}),
		},
	);

/** Lists the images a widget generated in a time window. */
export const images: NiftyimagesEndpoints['widgetImages'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'widgets.images',
			input: Inputs.widgetImages,
			output: Outputs.widgetImages,
		},
		input,
		({ widgetKey, startDate, endDate }) => ({
			method: 'GET',
			path: `/Widgets/${segment(widgetKey)}/Images`,
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ images: asList(raw, 'image') }),
			log: ({ widgetKey }, result) => ({
				widgetKey,
				count: result.images.length,
			}),
		},
	);

/** Lists the images a widget generated for one user. */
export const userImages: NiftyimagesEndpoints['widgetUserImages'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'widgets.userImages',
			input: Inputs.widgetUserImages,
			output: Outputs.widgetUserImages,
		},
		input,
		({ widgetKey, user, startDate, endDate }) => ({
			method: 'GET',
			path: `/Widgets/${segment(widgetKey)}/Images/${segment(user)}`,
			query: { startDate, endDate },
		}),
		{
			shape: (raw) => ({ images: asList(raw, 'image') }),
			log: ({ widgetKey }, result) => ({
				widgetKey,
				count: result.images.length,
			}),
		},
	);
