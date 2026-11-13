import type { CorsairContext, CorsairEndpoint } from 'corsair/core';
import type { ZodType } from 'zod';
import type { GoogleClassroomContext } from '..';
import type { GoogleClassroomQueryValue } from '../client';
import { makeGoogleClassroomRequest } from '../client';
import type {
	GoogleClassroomEndpointInputs,
	GoogleClassroomEndpointOutputs,
	GoogleClassroomOperationId,
} from './types';
import {
	GOOGLE_CLASSROOM_ROUTES,
	GoogleClassroomEndpointInputSchemas,
	GoogleClassroomEndpointOutputSchemas,
} from './types';

type OperationContext = CorsairContext & Pick<GoogleClassroomContext, 'key'>;
type RouteInput = { pathParams: object; query: object; body?: object };
type RouteDefinition =
	(typeof GOOGLE_CLASSROOM_ROUTES)[GoogleClassroomOperationId];

function encodeRoute(path: string, pathParams: object): string {
	return path.replace(/\{([^}]+)\}/g, (_match, name: string) => {
		// unknown because dynamic route substitution reads validated path fields by discovery parameter name.
		const value: unknown = Reflect.get(pathParams, name);
		if (typeof value !== 'string') {
			throw new Error('Missing required Google Classroom path parameter');
		}
		return encodeURIComponent(value);
	});
}

function cleanQuery(query: object): Record<string, GoogleClassroomQueryValue> {
	const output: Record<string, GoogleClassroomQueryValue> = {};
	for (const key of Object.keys(query)) {
		// unknown because dynamic query fields have already passed the operation-specific Zod schema.
		const value: unknown = Reflect.get(query, key);
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			output[key] = value;
		} else if (
			Array.isArray(value) &&
			value.every(
				(item) =>
					typeof item === 'string' ||
					typeof item === 'number' ||
					typeof item === 'boolean',
			)
		) {
			output[key] = value;
		}
	}
	return output;
}

function defineOperation<TInput extends RouteInput, TOutput>(
	operationId: GoogleClassroomOperationId,
	route: RouteDefinition,
	inputSchema: ZodType<TInput>,
	outputSchema: ZodType<TOutput>,
): CorsairEndpoint<OperationContext, TInput, TOutput> {
	return async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		const response = await makeGoogleClassroomRequest(
			encodeRoute(route.path, parsedInput.pathParams),
			ctx.key,
			{
				method: route.method,
				query: cleanQuery(parsedInput.query),
				body: parsedInput.body,
			},
		);
		const parsedOutput = outputSchema.parse(response);
		console.info('Google Classroom operation completed', { operationId });
		return parsedOutput;
	};
}

export const GoogleClassroomOperationFunctions = {
	'courses.aliases.create': defineOperation(
		'courses.aliases.create',
		GOOGLE_CLASSROOM_ROUTES['courses.aliases.create'],
		GoogleClassroomEndpointInputSchemas['courses.aliases.create'],
		GoogleClassroomEndpointOutputSchemas['courses.aliases.create'],
	),
	'courses.aliases.delete': defineOperation(
		'courses.aliases.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.aliases.delete'],
		GoogleClassroomEndpointInputSchemas['courses.aliases.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.aliases.delete'],
	),
	'courses.aliases.list': defineOperation(
		'courses.aliases.list',
		GOOGLE_CLASSROOM_ROUTES['courses.aliases.list'],
		GoogleClassroomEndpointInputSchemas['courses.aliases.list'],
		GoogleClassroomEndpointOutputSchemas['courses.aliases.list'],
	),
	'courses.announcements.addOnAttachments.create': defineOperation(
		'courses.announcements.addOnAttachments.create',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.create'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.addOnAttachments.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.addOnAttachments.create'
		],
	),
	'courses.announcements.addOnAttachments.delete': defineOperation(
		'courses.announcements.addOnAttachments.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.delete'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.addOnAttachments.delete'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.addOnAttachments.delete'
		],
	),
	'courses.announcements.addOnAttachments.get': defineOperation(
		'courses.announcements.addOnAttachments.get',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.get'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.addOnAttachments.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.addOnAttachments.get'
		],
	),
	'courses.announcements.addOnAttachments.list': defineOperation(
		'courses.announcements.addOnAttachments.list',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.list'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.addOnAttachments.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.addOnAttachments.list'
		],
	),
	'courses.announcements.addOnAttachments.patch': defineOperation(
		'courses.announcements.addOnAttachments.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.addOnAttachments.patch'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.addOnAttachments.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.addOnAttachments.patch'
		],
	),
	'courses.announcements.create': defineOperation(
		'courses.announcements.create',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.create'],
		GoogleClassroomEndpointInputSchemas['courses.announcements.create'],
		GoogleClassroomEndpointOutputSchemas['courses.announcements.create'],
	),
	'courses.announcements.delete': defineOperation(
		'courses.announcements.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.delete'],
		GoogleClassroomEndpointInputSchemas['courses.announcements.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.announcements.delete'],
	),
	'courses.announcements.get': defineOperation(
		'courses.announcements.get',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.get'],
		GoogleClassroomEndpointInputSchemas['courses.announcements.get'],
		GoogleClassroomEndpointOutputSchemas['courses.announcements.get'],
	),
	'courses.announcements.getAddOnContext': defineOperation(
		'courses.announcements.getAddOnContext',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.getAddOnContext'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.getAddOnContext'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.getAddOnContext'
		],
	),
	'courses.announcements.list': defineOperation(
		'courses.announcements.list',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.list'],
		GoogleClassroomEndpointInputSchemas['courses.announcements.list'],
		GoogleClassroomEndpointOutputSchemas['courses.announcements.list'],
	),
	'courses.announcements.modifyAssignees': defineOperation(
		'courses.announcements.modifyAssignees',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.modifyAssignees'],
		GoogleClassroomEndpointInputSchemas[
			'courses.announcements.modifyAssignees'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.announcements.modifyAssignees'
		],
	),
	'courses.announcements.patch': defineOperation(
		'courses.announcements.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.announcements.patch'],
		GoogleClassroomEndpointInputSchemas['courses.announcements.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.announcements.patch'],
	),
	'courses.courseWork.addOnAttachments.create': defineOperation(
		'courses.courseWork.addOnAttachments.create',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.create'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.create'
		],
	),
	'courses.courseWork.addOnAttachments.delete': defineOperation(
		'courses.courseWork.addOnAttachments.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.delete'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.delete'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.delete'
		],
	),
	'courses.courseWork.addOnAttachments.get': defineOperation(
		'courses.courseWork.addOnAttachments.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.get'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.get'
		],
	),
	'courses.courseWork.addOnAttachments.list': defineOperation(
		'courses.courseWork.addOnAttachments.list',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.list'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.list'
		],
	),
	'courses.courseWork.addOnAttachments.patch': defineOperation(
		'courses.courseWork.addOnAttachments.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.addOnAttachments.patch'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.patch'
		],
	),
	'courses.courseWork.addOnAttachments.studentSubmissions.get': defineOperation(
		'courses.courseWork.addOnAttachments.studentSubmissions.get',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWork.addOnAttachments.studentSubmissions.get'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.addOnAttachments.studentSubmissions.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.addOnAttachments.studentSubmissions.get'
		],
	),
	'courses.courseWork.addOnAttachments.studentSubmissions.list':
		defineOperation(
			'courses.courseWork.addOnAttachments.studentSubmissions.list',
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			],
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			],
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			],
		),
	'courses.courseWork.addOnAttachments.studentSubmissions.patch':
		defineOperation(
			'courses.courseWork.addOnAttachments.studentSubmissions.patch',
			GOOGLE_CLASSROOM_ROUTES[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			],
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			],
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			],
		),
	'courses.courseWork.create': defineOperation(
		'courses.courseWork.create',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.create'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.create'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.create'],
	),
	'courses.courseWork.delete': defineOperation(
		'courses.courseWork.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.delete'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.delete'],
	),
	'courses.courseWork.get': defineOperation(
		'courses.courseWork.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.get'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.get'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.get'],
	),
	'courses.courseWork.getAddOnContext': defineOperation(
		'courses.courseWork.getAddOnContext',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.getAddOnContext'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.getAddOnContext'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.getAddOnContext'],
	),
	'courses.courseWork.list': defineOperation(
		'courses.courseWork.list',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.list'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.list'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.list'],
	),
	'courses.courseWork.modifyAssignees': defineOperation(
		'courses.courseWork.modifyAssignees',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.modifyAssignees'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.modifyAssignees'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.modifyAssignees'],
	),
	'courses.courseWork.patch': defineOperation(
		'courses.courseWork.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.patch'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.patch'],
	),
	'courses.courseWork.rubrics.create': defineOperation(
		'courses.courseWork.rubrics.create',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.create'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.create'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.create'],
	),
	'courses.courseWork.rubrics.delete': defineOperation(
		'courses.courseWork.rubrics.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.delete'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.delete'],
	),
	'courses.courseWork.rubrics.get': defineOperation(
		'courses.courseWork.rubrics.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.get'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.get'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.get'],
	),
	'courses.courseWork.rubrics.list': defineOperation(
		'courses.courseWork.rubrics.list',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.list'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.list'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.list'],
	),
	'courses.courseWork.rubrics.patch': defineOperation(
		'courses.courseWork.rubrics.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.rubrics.patch'],
		GoogleClassroomEndpointInputSchemas['courses.courseWork.rubrics.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWork.rubrics.patch'],
	),
	'courses.courseWork.studentSubmissions.get': defineOperation(
		'courses.courseWork.studentSubmissions.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.get'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.get'
		],
	),
	'courses.courseWork.studentSubmissions.list': defineOperation(
		'courses.courseWork.studentSubmissions.list',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.list'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.list'
		],
	),
	'courses.courseWork.studentSubmissions.modifyAttachments': defineOperation(
		'courses.courseWork.studentSubmissions.modifyAttachments',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWork.studentSubmissions.modifyAttachments'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.modifyAttachments'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.modifyAttachments'
		],
	),
	'courses.courseWork.studentSubmissions.patch': defineOperation(
		'courses.courseWork.studentSubmissions.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.patch'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.patch'
		],
	),
	'courses.courseWork.studentSubmissions.reclaim': defineOperation(
		'courses.courseWork.studentSubmissions.reclaim',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.reclaim'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.reclaim'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.reclaim'
		],
	),
	'courses.courseWork.studentSubmissions.return': defineOperation(
		'courses.courseWork.studentSubmissions.return',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.return'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.return'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.return'
		],
	),
	'courses.courseWork.studentSubmissions.turnIn': defineOperation(
		'courses.courseWork.studentSubmissions.turnIn',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWork.studentSubmissions.turnIn'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWork.studentSubmissions.turnIn'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWork.studentSubmissions.turnIn'
		],
	),
	'courses.courseWorkMaterials.addOnAttachments.create': defineOperation(
		'courses.courseWorkMaterials.addOnAttachments.create',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWorkMaterials.addOnAttachments.create'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.create'
		],
	),
	'courses.courseWorkMaterials.addOnAttachments.delete': defineOperation(
		'courses.courseWorkMaterials.addOnAttachments.delete',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWorkMaterials.addOnAttachments.delete'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.delete'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.delete'
		],
	),
	'courses.courseWorkMaterials.addOnAttachments.get': defineOperation(
		'courses.courseWorkMaterials.addOnAttachments.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.addOnAttachments.get'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.get'
		],
	),
	'courses.courseWorkMaterials.addOnAttachments.list': defineOperation(
		'courses.courseWorkMaterials.addOnAttachments.list',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWorkMaterials.addOnAttachments.list'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.list'
		],
	),
	'courses.courseWorkMaterials.addOnAttachments.patch': defineOperation(
		'courses.courseWorkMaterials.addOnAttachments.patch',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.courseWorkMaterials.addOnAttachments.patch'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.addOnAttachments.patch'
		],
	),
	'courses.courseWorkMaterials.create': defineOperation(
		'courses.courseWorkMaterials.create',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.create'],
		GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.create'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.create'],
	),
	'courses.courseWorkMaterials.delete': defineOperation(
		'courses.courseWorkMaterials.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.delete'],
		GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.delete'],
	),
	'courses.courseWorkMaterials.get': defineOperation(
		'courses.courseWorkMaterials.get',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.get'],
		GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.get'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.get'],
	),
	'courses.courseWorkMaterials.getAddOnContext': defineOperation(
		'courses.courseWorkMaterials.getAddOnContext',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.getAddOnContext'],
		GoogleClassroomEndpointInputSchemas[
			'courses.courseWorkMaterials.getAddOnContext'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.courseWorkMaterials.getAddOnContext'
		],
	),
	'courses.courseWorkMaterials.list': defineOperation(
		'courses.courseWorkMaterials.list',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.list'],
		GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.list'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.list'],
	),
	'courses.courseWorkMaterials.patch': defineOperation(
		'courses.courseWorkMaterials.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.courseWorkMaterials.patch'],
		GoogleClassroomEndpointInputSchemas['courses.courseWorkMaterials.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.courseWorkMaterials.patch'],
	),
	'courses.create': defineOperation(
		'courses.create',
		GOOGLE_CLASSROOM_ROUTES['courses.create'],
		GoogleClassroomEndpointInputSchemas['courses.create'],
		GoogleClassroomEndpointOutputSchemas['courses.create'],
	),
	'courses.delete': defineOperation(
		'courses.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.delete'],
		GoogleClassroomEndpointInputSchemas['courses.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.delete'],
	),
	'courses.get': defineOperation(
		'courses.get',
		GOOGLE_CLASSROOM_ROUTES['courses.get'],
		GoogleClassroomEndpointInputSchemas['courses.get'],
		GoogleClassroomEndpointOutputSchemas['courses.get'],
	),
	'courses.getGradingPeriodSettings': defineOperation(
		'courses.getGradingPeriodSettings',
		GOOGLE_CLASSROOM_ROUTES['courses.getGradingPeriodSettings'],
		GoogleClassroomEndpointInputSchemas['courses.getGradingPeriodSettings'],
		GoogleClassroomEndpointOutputSchemas['courses.getGradingPeriodSettings'],
	),
	'courses.list': defineOperation(
		'courses.list',
		GOOGLE_CLASSROOM_ROUTES['courses.list'],
		GoogleClassroomEndpointInputSchemas['courses.list'],
		GoogleClassroomEndpointOutputSchemas['courses.list'],
	),
	'courses.patch': defineOperation(
		'courses.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.patch'],
		GoogleClassroomEndpointInputSchemas['courses.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.patch'],
	),
	'courses.posts.addOnAttachments.create': defineOperation(
		'courses.posts.addOnAttachments.create',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.create'],
		GoogleClassroomEndpointInputSchemas[
			'courses.posts.addOnAttachments.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.posts.addOnAttachments.create'
		],
	),
	'courses.posts.addOnAttachments.delete': defineOperation(
		'courses.posts.addOnAttachments.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.delete'],
		GoogleClassroomEndpointInputSchemas[
			'courses.posts.addOnAttachments.delete'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.posts.addOnAttachments.delete'
		],
	),
	'courses.posts.addOnAttachments.get': defineOperation(
		'courses.posts.addOnAttachments.get',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.get'],
		GoogleClassroomEndpointInputSchemas['courses.posts.addOnAttachments.get'],
		GoogleClassroomEndpointOutputSchemas['courses.posts.addOnAttachments.get'],
	),
	'courses.posts.addOnAttachments.list': defineOperation(
		'courses.posts.addOnAttachments.list',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.list'],
		GoogleClassroomEndpointInputSchemas['courses.posts.addOnAttachments.list'],
		GoogleClassroomEndpointOutputSchemas['courses.posts.addOnAttachments.list'],
	),
	'courses.posts.addOnAttachments.patch': defineOperation(
		'courses.posts.addOnAttachments.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.addOnAttachments.patch'],
		GoogleClassroomEndpointInputSchemas['courses.posts.addOnAttachments.patch'],
		GoogleClassroomEndpointOutputSchemas[
			'courses.posts.addOnAttachments.patch'
		],
	),
	'courses.posts.addOnAttachments.studentSubmissions.get': defineOperation(
		'courses.posts.addOnAttachments.studentSubmissions.get',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.posts.addOnAttachments.studentSubmissions.get'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.posts.addOnAttachments.studentSubmissions.get'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.posts.addOnAttachments.studentSubmissions.get'
		],
	),
	'courses.posts.addOnAttachments.studentSubmissions.patch': defineOperation(
		'courses.posts.addOnAttachments.studentSubmissions.patch',
		GOOGLE_CLASSROOM_ROUTES[
			'courses.posts.addOnAttachments.studentSubmissions.patch'
		],
		GoogleClassroomEndpointInputSchemas[
			'courses.posts.addOnAttachments.studentSubmissions.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.posts.addOnAttachments.studentSubmissions.patch'
		],
	),
	'courses.posts.getAddOnContext': defineOperation(
		'courses.posts.getAddOnContext',
		GOOGLE_CLASSROOM_ROUTES['courses.posts.getAddOnContext'],
		GoogleClassroomEndpointInputSchemas['courses.posts.getAddOnContext'],
		GoogleClassroomEndpointOutputSchemas['courses.posts.getAddOnContext'],
	),
	'courses.studentGroups.create': defineOperation(
		'courses.studentGroups.create',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.create'],
		GoogleClassroomEndpointInputSchemas['courses.studentGroups.create'],
		GoogleClassroomEndpointOutputSchemas['courses.studentGroups.create'],
	),
	'courses.studentGroups.delete': defineOperation(
		'courses.studentGroups.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.delete'],
		GoogleClassroomEndpointInputSchemas['courses.studentGroups.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.studentGroups.delete'],
	),
	'courses.studentGroups.list': defineOperation(
		'courses.studentGroups.list',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.list'],
		GoogleClassroomEndpointInputSchemas['courses.studentGroups.list'],
		GoogleClassroomEndpointOutputSchemas['courses.studentGroups.list'],
	),
	'courses.studentGroups.patch': defineOperation(
		'courses.studentGroups.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.patch'],
		GoogleClassroomEndpointInputSchemas['courses.studentGroups.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.studentGroups.patch'],
	),
	'courses.studentGroups.studentGroupMembers.create': defineOperation(
		'courses.studentGroups.studentGroupMembers.create',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.studentGroupMembers.create'],
		GoogleClassroomEndpointInputSchemas[
			'courses.studentGroups.studentGroupMembers.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.studentGroups.studentGroupMembers.create'
		],
	),
	'courses.studentGroups.studentGroupMembers.delete': defineOperation(
		'courses.studentGroups.studentGroupMembers.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.studentGroupMembers.delete'],
		GoogleClassroomEndpointInputSchemas[
			'courses.studentGroups.studentGroupMembers.delete'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.studentGroups.studentGroupMembers.delete'
		],
	),
	'courses.studentGroups.studentGroupMembers.list': defineOperation(
		'courses.studentGroups.studentGroupMembers.list',
		GOOGLE_CLASSROOM_ROUTES['courses.studentGroups.studentGroupMembers.list'],
		GoogleClassroomEndpointInputSchemas[
			'courses.studentGroups.studentGroupMembers.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'courses.studentGroups.studentGroupMembers.list'
		],
	),
	'courses.students.create': defineOperation(
		'courses.students.create',
		GOOGLE_CLASSROOM_ROUTES['courses.students.create'],
		GoogleClassroomEndpointInputSchemas['courses.students.create'],
		GoogleClassroomEndpointOutputSchemas['courses.students.create'],
	),
	'courses.students.delete': defineOperation(
		'courses.students.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.students.delete'],
		GoogleClassroomEndpointInputSchemas['courses.students.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.students.delete'],
	),
	'courses.students.get': defineOperation(
		'courses.students.get',
		GOOGLE_CLASSROOM_ROUTES['courses.students.get'],
		GoogleClassroomEndpointInputSchemas['courses.students.get'],
		GoogleClassroomEndpointOutputSchemas['courses.students.get'],
	),
	'courses.students.list': defineOperation(
		'courses.students.list',
		GOOGLE_CLASSROOM_ROUTES['courses.students.list'],
		GoogleClassroomEndpointInputSchemas['courses.students.list'],
		GoogleClassroomEndpointOutputSchemas['courses.students.list'],
	),
	'courses.teachers.create': defineOperation(
		'courses.teachers.create',
		GOOGLE_CLASSROOM_ROUTES['courses.teachers.create'],
		GoogleClassroomEndpointInputSchemas['courses.teachers.create'],
		GoogleClassroomEndpointOutputSchemas['courses.teachers.create'],
	),
	'courses.teachers.delete': defineOperation(
		'courses.teachers.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.teachers.delete'],
		GoogleClassroomEndpointInputSchemas['courses.teachers.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.teachers.delete'],
	),
	'courses.teachers.get': defineOperation(
		'courses.teachers.get',
		GOOGLE_CLASSROOM_ROUTES['courses.teachers.get'],
		GoogleClassroomEndpointInputSchemas['courses.teachers.get'],
		GoogleClassroomEndpointOutputSchemas['courses.teachers.get'],
	),
	'courses.teachers.list': defineOperation(
		'courses.teachers.list',
		GOOGLE_CLASSROOM_ROUTES['courses.teachers.list'],
		GoogleClassroomEndpointInputSchemas['courses.teachers.list'],
		GoogleClassroomEndpointOutputSchemas['courses.teachers.list'],
	),
	'courses.topics.create': defineOperation(
		'courses.topics.create',
		GOOGLE_CLASSROOM_ROUTES['courses.topics.create'],
		GoogleClassroomEndpointInputSchemas['courses.topics.create'],
		GoogleClassroomEndpointOutputSchemas['courses.topics.create'],
	),
	'courses.topics.delete': defineOperation(
		'courses.topics.delete',
		GOOGLE_CLASSROOM_ROUTES['courses.topics.delete'],
		GoogleClassroomEndpointInputSchemas['courses.topics.delete'],
		GoogleClassroomEndpointOutputSchemas['courses.topics.delete'],
	),
	'courses.topics.get': defineOperation(
		'courses.topics.get',
		GOOGLE_CLASSROOM_ROUTES['courses.topics.get'],
		GoogleClassroomEndpointInputSchemas['courses.topics.get'],
		GoogleClassroomEndpointOutputSchemas['courses.topics.get'],
	),
	'courses.topics.list': defineOperation(
		'courses.topics.list',
		GOOGLE_CLASSROOM_ROUTES['courses.topics.list'],
		GoogleClassroomEndpointInputSchemas['courses.topics.list'],
		GoogleClassroomEndpointOutputSchemas['courses.topics.list'],
	),
	'courses.topics.patch': defineOperation(
		'courses.topics.patch',
		GOOGLE_CLASSROOM_ROUTES['courses.topics.patch'],
		GoogleClassroomEndpointInputSchemas['courses.topics.patch'],
		GoogleClassroomEndpointOutputSchemas['courses.topics.patch'],
	),
	'courses.update': defineOperation(
		'courses.update',
		GOOGLE_CLASSROOM_ROUTES['courses.update'],
		GoogleClassroomEndpointInputSchemas['courses.update'],
		GoogleClassroomEndpointOutputSchemas['courses.update'],
	),
	'courses.updateGradingPeriodSettings': defineOperation(
		'courses.updateGradingPeriodSettings',
		GOOGLE_CLASSROOM_ROUTES['courses.updateGradingPeriodSettings'],
		GoogleClassroomEndpointInputSchemas['courses.updateGradingPeriodSettings'],
		GoogleClassroomEndpointOutputSchemas['courses.updateGradingPeriodSettings'],
	),
	'invitations.accept': defineOperation(
		'invitations.accept',
		GOOGLE_CLASSROOM_ROUTES['invitations.accept'],
		GoogleClassroomEndpointInputSchemas['invitations.accept'],
		GoogleClassroomEndpointOutputSchemas['invitations.accept'],
	),
	'invitations.create': defineOperation(
		'invitations.create',
		GOOGLE_CLASSROOM_ROUTES['invitations.create'],
		GoogleClassroomEndpointInputSchemas['invitations.create'],
		GoogleClassroomEndpointOutputSchemas['invitations.create'],
	),
	'invitations.delete': defineOperation(
		'invitations.delete',
		GOOGLE_CLASSROOM_ROUTES['invitations.delete'],
		GoogleClassroomEndpointInputSchemas['invitations.delete'],
		GoogleClassroomEndpointOutputSchemas['invitations.delete'],
	),
	'invitations.get': defineOperation(
		'invitations.get',
		GOOGLE_CLASSROOM_ROUTES['invitations.get'],
		GoogleClassroomEndpointInputSchemas['invitations.get'],
		GoogleClassroomEndpointOutputSchemas['invitations.get'],
	),
	'invitations.list': defineOperation(
		'invitations.list',
		GOOGLE_CLASSROOM_ROUTES['invitations.list'],
		GoogleClassroomEndpointInputSchemas['invitations.list'],
		GoogleClassroomEndpointOutputSchemas['invitations.list'],
	),
	'registrations.create': defineOperation(
		'registrations.create',
		GOOGLE_CLASSROOM_ROUTES['registrations.create'],
		GoogleClassroomEndpointInputSchemas['registrations.create'],
		GoogleClassroomEndpointOutputSchemas['registrations.create'],
	),
	'registrations.delete': defineOperation(
		'registrations.delete',
		GOOGLE_CLASSROOM_ROUTES['registrations.delete'],
		GoogleClassroomEndpointInputSchemas['registrations.delete'],
		GoogleClassroomEndpointOutputSchemas['registrations.delete'],
	),
	'userProfiles.get': defineOperation(
		'userProfiles.get',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.get'],
		GoogleClassroomEndpointInputSchemas['userProfiles.get'],
		GoogleClassroomEndpointOutputSchemas['userProfiles.get'],
	),
	'userProfiles.guardianInvitations.create': defineOperation(
		'userProfiles.guardianInvitations.create',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.create'],
		GoogleClassroomEndpointInputSchemas[
			'userProfiles.guardianInvitations.create'
		],
		GoogleClassroomEndpointOutputSchemas[
			'userProfiles.guardianInvitations.create'
		],
	),
	'userProfiles.guardianInvitations.get': defineOperation(
		'userProfiles.guardianInvitations.get',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.get'],
		GoogleClassroomEndpointInputSchemas['userProfiles.guardianInvitations.get'],
		GoogleClassroomEndpointOutputSchemas[
			'userProfiles.guardianInvitations.get'
		],
	),
	'userProfiles.guardianInvitations.list': defineOperation(
		'userProfiles.guardianInvitations.list',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.list'],
		GoogleClassroomEndpointInputSchemas[
			'userProfiles.guardianInvitations.list'
		],
		GoogleClassroomEndpointOutputSchemas[
			'userProfiles.guardianInvitations.list'
		],
	),
	'userProfiles.guardianInvitations.patch': defineOperation(
		'userProfiles.guardianInvitations.patch',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardianInvitations.patch'],
		GoogleClassroomEndpointInputSchemas[
			'userProfiles.guardianInvitations.patch'
		],
		GoogleClassroomEndpointOutputSchemas[
			'userProfiles.guardianInvitations.patch'
		],
	),
	'userProfiles.guardians.delete': defineOperation(
		'userProfiles.guardians.delete',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.delete'],
		GoogleClassroomEndpointInputSchemas['userProfiles.guardians.delete'],
		GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.delete'],
	),
	'userProfiles.guardians.get': defineOperation(
		'userProfiles.guardians.get',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.get'],
		GoogleClassroomEndpointInputSchemas['userProfiles.guardians.get'],
		GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.get'],
	),
	'userProfiles.guardians.list': defineOperation(
		'userProfiles.guardians.list',
		GOOGLE_CLASSROOM_ROUTES['userProfiles.guardians.list'],
		GoogleClassroomEndpointInputSchemas['userProfiles.guardians.list'],
		GoogleClassroomEndpointOutputSchemas['userProfiles.guardians.list'],
	),
} as const;

export type GoogleClassroomOperationFunctionInputs =
	GoogleClassroomEndpointInputs;
export type GoogleClassroomOperationFunctionOutputs =
	GoogleClassroomEndpointOutputs;

export { defineOperation };
