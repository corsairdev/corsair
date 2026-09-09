import type { AnyClip, AudioClip } from './clips';
import type { Transition } from './transitions';

export interface BaseTrack {
	trackId: string;
	name: string;
	muted: boolean;
	solo: boolean;
	locked: boolean;
	height: number;
}

export interface VideoTrack extends BaseTrack {
	type: 'video';
	clips: AnyClip[];
	opacity: number;
	transitions: Transition[];
}

export interface AudioTrack extends BaseTrack {
	type: 'audio';
	clips: AudioClip[];
	volume: number;
}

export type AnyTrack = VideoTrack | AudioTrack;
