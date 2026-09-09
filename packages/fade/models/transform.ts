import type { Vec2Property, AnimatableProperty } from './animation';
import { ap, vec2 } from './animation';

export interface Transform {
	position: Vec2Property;
	scale: Vec2Property;
	rotation: AnimatableProperty;
	opacity: AnimatableProperty;
	anchor: Vec2Property;
}

export const makeTransform = (): Transform => ({
	position: vec2(0, 0),
	scale: vec2(1, 1),
	rotation: ap(0),
	opacity: ap(1),
	anchor: vec2(0, 0),
});
