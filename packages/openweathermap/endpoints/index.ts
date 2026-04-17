import { oneCall } from './weather';
import { timeMachine } from './history';
import { daySummary, overview } from './summary';

export const Weather = {
	oneCall,
};

export const History = {
	timeMachine,
};

export const Summary = {
	daySummary,
	overview,
};

export * from './types';
