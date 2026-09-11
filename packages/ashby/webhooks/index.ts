import {
	submit as applicationSubmit,
	update as applicationUpdate,
} from './applications';
import {
	hire as candidateHire,
	stageChange as candidateStageChange,
} from './candidates';
import {
	planTransition as interviewPlanTransition,
	scheduleCreate as interviewScheduleCreate,
	scheduleUpdate as interviewScheduleUpdate,
} from './interviews';
import {
	create as offerCreate,
	remove as offerDelete,
	update as offerUpdate,
} from './offers';

export const CandidateWebhooks = {
	stageChange: candidateStageChange,
	hire: candidateHire,
};

export const ApplicationWebhooks = {
	submit: applicationSubmit,
	update: applicationUpdate,
};

export const OfferWebhooks = {
	create: offerCreate,
	update: offerUpdate,
	delete: offerDelete,
};

export const InterviewWebhooks = {
	scheduleCreate: interviewScheduleCreate,
	scheduleUpdate: interviewScheduleUpdate,
	planTransition: interviewPlanTransition,
};

export * from './tenant-matcher';
export * from './types';
