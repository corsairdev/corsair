import type { RecruiteeEndpoints } from '..';
import { companyPath, segment } from '../client';
import { call, queryOf } from './call';
import { deletedShape, listShape, singleShape } from './shape';
import {
	RecruiteeEndpointInputSchemas as Inputs,
	RecruiteeEndpointOutputSchemas as Outputs,
} from './types';

export const candidatesList: RecruiteeEndpoints['candidatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'candidates.list',
			input: Inputs.candidatesList,
			output: Outputs.candidatesList,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			// The search route is the one that filters; `/candidates` itself is
			// the create route.
			path: companyPath(companyId, '/search/new/candidates'),
			replayable: true,
			query: queryOf({
				query: parsed.query,
				offer_id: parsed.offer_id,
				stage: parsed.stage,
				status: parsed.status,
				department_id: parsed.department_id,
				location_id: parsed.location_id,
				sort_by: parsed.sort_by,
				sort_direction: parsed.sort_direction,
				limit: parsed.limit,
				offset: parsed.offset,
			}),
		}),
		{
			shape: listShape('candidates'),
			log: (_, result) => ({
				count: result.candidates.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const candidatesGet: RecruiteeEndpoints['candidatesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'candidates.get',
			input: Inputs.candidatesGet,
			output: Outputs.candidatesGet,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			path: companyPath(
				companyId,
				`/candidates/${segment(parsed.candidate_id)}`,
			),
			replayable: true,
		}),
		{
			shape: singleShape('candidate'),
			log: (_, result) => ({ candidateId: result.candidate.id ?? 0 }),
		},
	);

export const candidatesCreate: RecruiteeEndpoints['candidatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'candidates.create',
			input: Inputs.candidatesCreate,
			output: Outputs.candidatesCreate,
		},
		input,
		(companyId, parsed) => ({
			method: 'POST',
			path: companyPath(companyId, '/candidates'),
			replayable: false,
			// The create route wraps the record in `candidate` and takes the offer
			// assignments beside it, not inside it.
			body: {
				candidate: queryOf({
					name: parsed.name,
					emails: parsed.emails,
					phones: parsed.phones,
					social_links: parsed.social_links,
					links: parsed.links,
					cover_letter: parsed.cover_letter,
					sources: parsed.sources,
					remote_cv_url: parsed.remote_cv_url,
				}),
				offers: parsed.offer_id !== undefined ? [parsed.offer_id] : undefined,
			},
		}),
		{
			shape: singleShape('candidate'),
			// The name and email are personal data, so only the id is logged.
			log: (_, result) => ({ candidateId: result.candidate.id ?? 0 }),
		},
	);

export const candidatesUpdate: RecruiteeEndpoints['candidatesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'candidates.update',
			input: Inputs.candidatesUpdate,
			output: Outputs.candidatesUpdate,
		},
		input,
		(companyId, parsed) => ({
			method: 'PATCH',
			path: companyPath(
				companyId,
				`/candidates/${segment(parsed.candidate_id)}`,
			),
			replayable: false,
			body: {
				candidate: queryOf({
					name: parsed.name,
					emails: parsed.emails,
					phones: parsed.phones,
					cover_letter: parsed.cover_letter,
					status: parsed.status,
					stage: parsed.stage,
				}),
			},
		}),
		{
			shape: singleShape('candidate'),
			log: (parsed) => ({ candidateId: parsed.candidate_id }),
		},
	);

export const candidatesDelete: RecruiteeEndpoints['candidatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'candidates.delete',
			input: Inputs.candidatesDelete,
			output: Outputs.candidatesDelete,
		},
		input,
		(companyId, parsed) => ({
			method: 'DELETE',
			path: companyPath(
				companyId,
				`/candidates/${segment(parsed.candidate_id)}`,
			),
			replayable: false,
		}),
		{
			shape: deletedShape('candidate_id'),
			log: (parsed) => ({ candidateId: parsed.candidate_id }),
		},
	);

export const offersList: RecruiteeEndpoints['offersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.list',
			input: Inputs.offersList,
			output: Outputs.offersList,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			path: companyPath(companyId, '/offers'),
			replayable: true,
			query: queryOf({
				query: parsed.query,
				department_id: parsed.department_id,
				location_id: parsed.location_id,
				status: parsed.status,
				kind: parsed.kind,
				limit: parsed.limit,
				offset: parsed.offset,
			}),
		}),
		{
			shape: listShape('offers'),
			log: (_, result) => ({
				count: result.offers.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const offersGet: RecruiteeEndpoints['offersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.get',
			input: Inputs.offersGet,
			output: Outputs.offersGet,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			path: companyPath(companyId, `/offers/${segment(parsed.offer_id)}`),
			replayable: true,
		}),
		{
			shape: singleShape('offer'),
			log: (_, result) => ({ offerId: result.offer.id ?? 0 }),
		},
	);

export const offersCreate: RecruiteeEndpoints['offersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.create',
			input: Inputs.offersCreate,
			output: Outputs.offersCreate,
		},
		input,
		(companyId, parsed) => ({
			method: 'POST',
			path: companyPath(companyId, '/offers'),
			replayable: false,
			body: {
				offer: queryOf({
					title: parsed.title,
					kind: parsed.kind,
					description: parsed.description,
					requirements: parsed.requirements,
					department_id: parsed.department_id,
					location_id: parsed.location_id,
					status: parsed.status,
				}),
			},
		}),
		{
			shape: singleShape('offer'),
			log: (_, result) => ({ offerId: result.offer.id ?? 0 }),
		},
	);

export const offersUpdate: RecruiteeEndpoints['offersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.update',
			input: Inputs.offersUpdate,
			output: Outputs.offersUpdate,
		},
		input,
		(companyId, parsed) => {
			const { offer_id: offerId, ...rest } = parsed;
			return {
				method: 'PATCH',
				path: companyPath(companyId, `/offers/${segment(offerId)}`),
				replayable: false,
				body: {
					offer: queryOf({
						title: rest.title,
						kind: rest.kind,
						description: rest.description,
						requirements: rest.requirements,
						department_id: rest.department_id,
						location_id: rest.location_id,
						status: rest.status,
					}),
				},
			};
		},
		{
			shape: singleShape('offer'),
			log: (parsed) => ({ offerId: parsed.offer_id }),
		},
	);

export const departmentsList: RecruiteeEndpoints['departmentsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'departments.list',
			input: Inputs.departmentsList,
			output: Outputs.departmentsList,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			path: companyPath(companyId, '/departments'),
			replayable: true,
			query: queryOf({ limit: parsed.limit, offset: parsed.offset }),
		}),
		{
			shape: listShape('departments'),
			log: (_, result) => ({
				count: result.departments.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);

export const locationsList: RecruiteeEndpoints['locationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'locations.list',
			input: Inputs.locationsList,
			output: Outputs.locationsList,
		},
		input,
		(companyId, parsed) => ({
			method: 'GET',
			path: companyPath(companyId, '/locations'),
			replayable: true,
			query: queryOf({ limit: parsed.limit, offset: parsed.offset }),
		}),
		{
			shape: listShape('locations'),
			log: (_, result) => ({
				count: result.locations.length,
				hasNext: result.next_offset !== null,
			}),
		},
	);
