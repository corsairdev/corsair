import type { AnyTrack } from './tracks';

export interface Timeline {
	timelineId: string;
	name: string;
	width: number;
	height: number;
	fps: number;
	totalFrames: number;
	tracks: AnyTrack[];
}
