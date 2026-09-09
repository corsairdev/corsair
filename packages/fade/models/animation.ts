export type Interpolation =
	| 'constant'
	| 'linear'
	| 'bezier'
	| 'ease_in'
	| 'ease_out'
	| 'ease_both';

export interface BezierHandle {
	frame: number;
	value: number;
}

export interface Keyframe {
	frame: number;
	value: number;
	interp: Interpolation;
	handleIn: BezierHandle;
	handleOut: BezierHandle;
	manualHandles: boolean;
}

export interface AnimatableProperty {
	base: number;
	keyframes: Keyframe[];
}

export interface Vec2Property {
	x: AnimatableProperty;
	y: AnimatableProperty;
}

export const ap = (base: number): AnimatableProperty => ({ base, keyframes: [] });
export const vec2 = (x: number, y: number): Vec2Property => ({ x: ap(x), y: ap(y) });
