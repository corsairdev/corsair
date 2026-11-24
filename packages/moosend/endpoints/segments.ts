import { segment } from '../client';
import { compact, endpoint, success } from './call';

type CriterionInput = {
	field: string;
	comparer: string;
	value?: string;
	lastXMinutes?: number;
	dateFrom?: string;
	dateTo?: string;
	dateFunction?: string;
};

function criterionBody(input: CriterionInput) {
	return compact({
		Field: input.field,
		Comparer: input.comparer,
		Value: input.value,
		LastXMinutes: input.lastXMinutes,
		DateFrom: input.dateFrom,
		DateTo: input.dateTo,
		DateFunction: input.dateFunction,
	});
}

type SegmentSettingsInput = {
	name: string;
	matchType?: string;
	fetchType?: string;
	fetchValue?: number;
	criteria?: CriterionInput[];
};

function segmentBody(input: SegmentSettingsInput) {
	return compact({
		Name: input.name,
		MatchType: input.matchType,
		FetchType: input.fetchType,
		FetchValue: input.fetchValue,
		Criteria: input.criteria?.map(criterionBody),
	});
}

const segmentsPath = (mailingListId: string, rest = '') =>
	`/lists/${segment(mailingListId)}/segments${rest}`;

/** Lists a mailing list's segments with their criteria. */
export const list = endpoint('segmentsList', {
	event: 'segments.list',
	request: ({ mailingListId }) => ({
		method: 'GET',
		path: segmentsPath(mailingListId, '.json'),
	}),
	log: (_, result) => ({ segments: result.Segments.length }),
});

/** Reads one segment with its criteria. */
export const get = endpoint('segmentsGet', {
	event: 'segments.get',
	request: ({ mailingListId, segmentId }) => ({
		method: 'GET',
		path: segmentsPath(mailingListId, `/${segment(segmentId)}/details.json`),
	}),
});

/** Lists the subscribers a segment matches, one page at a time. */
export const members = endpoint('segmentsMembers', {
	event: 'segments.members',
	request: ({ mailingListId, segmentId, page, pageSize }) => ({
		method: 'GET',
		path: segmentsPath(mailingListId, `/${segment(segmentId)}/members.json`),
		query: { Page: page, PageSize: pageSize },
	}),
	log: (_, result) => ({ subscribers: result.Subscribers.length }),
});

/** Creates a segment, empty or with criteria; Moosend answers with its ID. */
export const create = endpoint('segmentsCreate', {
	event: 'segments.create',
	request: ({ mailingListId, ...settings }) => ({
		method: 'POST',
		path: segmentsPath(mailingListId, '/create.json'),
		body: segmentBody(settings),
	}),
	shape: (context) => ({ segmentId: context }),
});

/** Renames a segment or changes its settings; criteria, when given, replace all. */
export const update = endpoint('segmentsUpdate', {
	event: 'segments.update',
	request: ({ mailingListId, segmentId, ...settings }) => ({
		method: 'POST',
		path: segmentsPath(mailingListId, `/${segment(segmentId)}/update.json`),
		body: segmentBody(settings),
	}),
	shape: success,
});

/** Adds one criterion to a segment. */
export const addCriteria = endpoint('segmentsAddCriteria', {
	event: 'segments.addCriteria',
	request: ({ mailingListId, segmentId, ...criterion }) => ({
		method: 'POST',
		path: segmentsPath(
			mailingListId,
			`/${segment(segmentId)}/criteria/add.json`,
		),
		body: criterionBody(criterion),
	}),
	// Moosend answers with the criterion's position, not its ID.
	shape: (context) => ({ criterionNumber: context }),
});

/** Changes one criterion, addressed by its position in the segment. */
export const updateCriteria = endpoint('segmentsUpdateCriteria', {
	event: 'segments.updateCriteria',
	request: ({ mailingListId, segmentId, criterionNumber, ...criterion }) => ({
		method: 'POST',
		path: segmentsPath(
			mailingListId,
			`/${segment(segmentId)}/criteria/${segment(criterionNumber)}/update.json`,
		),
		body: criterionBody(criterion),
	}),
	shape: success,
});

/** Deletes a segment; its subscribers stay on the list. */
export const remove = endpoint('segmentsDelete', {
	event: 'segments.delete',
	request: ({ mailingListId, segmentId }) => ({
		method: 'DELETE',
		path: segmentsPath(mailingListId, `/${segment(segmentId)}/delete.json`),
	}),
	shape: success,
});
