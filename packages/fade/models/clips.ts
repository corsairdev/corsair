import type { Transform } from './transform';
import type { SkslEffect, MaskLayer } from './effects';

export type ClipType = 'video' | 'audio' | 'image' | 'text' | 'solid' | 'shape' | 'pen' | 'svg' | 'comp' | 'webcomp' | 'adjustment';
export type RGBA = [number, number, number, number];

export interface BaseClip {
	type: ClipType;
	clipId: string;
	startFrame: number;
	duration: number;
	transform: Transform;
	effects: SkslEffect[];
}

export interface VideoClip extends BaseClip {
	type: 'video';
	assetId: string;
	filepath: string;
	color: RGBA;
	mediaOffset: number;
	cropLeft: number;
	cropRight: number;
	cropTop: number;
	cropBottom: number;
	blendMode: number;
	masks: MaskLayer[];
}

export interface ImageClip extends BaseClip {
	type: 'image';
	assetId: string;
	filepath: string;
	mediaOffset: number;
	cropLeft: number;
	cropRight: number;
	cropTop: number;
	cropBottom: number;
	blendMode: number;
	masks: MaskLayer[];
}

export interface SolidClip extends BaseClip {
	type: 'solid';
	color: { r: number; g: number; b: number; a: number };
}

export interface TextStyle {
	text: string;
	fontFamily: string;
	fontSize: number;
	bold: boolean;
	italic: boolean;
	alignment: 'left' | 'center' | 'right';
	lineHeight: number;
	letterSpacing: number;
	allCaps: boolean;
	color: RGBA;
	strokeColor: RGBA;
	strokeWidth: number;
	shadowEnabled: boolean;
	shadowColor: RGBA;
	shadowOffsetX: number;
	shadowOffsetY: number;
	shadowBlur: number;
	bgEnabled: boolean;
	bgColor: RGBA;
	bgPaddingX: number;
	bgPaddingY: number;
	bgCornerRadius: number;
	animator: Record<string, unknown>;
}

export interface TextClip extends BaseClip {
	type: 'text';
	textStyle: TextStyle;
	masks: MaskLayer[];
}

export type ShapeType = 'rect' | 'ellipse' | 'star' | 'polygon' | 'line' | 'arc';

export interface ShapeStyle {
	shapeType: ShapeType;
	width: number;
	height: number;
	cornerRadius: number;
	radiusX: number;
	radiusY: number;
	outerRadius: number;
	innerRadius: number;
	numPoints: number;
	numSides: number;
	polygonRadius: number;
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	arcStartAngle: number;
	arcSweepAngle: number;
	arcRadius: number;
	fillColor: RGBA;
	fillOpacity: number;
	strokeColor: RGBA;
	strokeWidth: number;
	shadowEnabled: boolean;
	shadowColor: RGBA;
	shadowAngle: number;
	shadowDistance: number;
	shadowBlur: number;
}

export interface ShapeClip extends BaseClip {
	type: 'shape';
	shapeStyle: ShapeStyle;
}

export interface PenPoint {
	x: number;
	y: number;
	inX: number;
	inY: number;
	outX: number;
	outY: number;
}

export interface PenStyle {
	isClosed: boolean;
	points: PenPoint[];
	fillColor: RGBA;
	fillOpacity: number;
	strokeColor: RGBA;
	strokeWidth: number;
	shadowEnabled: boolean;
	shadowColor: RGBA;
	shadowAngle: number;
	shadowDistance: number;
	shadowBlur: number;
}

export interface PenClip extends BaseClip {
	type: 'pen';
	penStyle: PenStyle;
}

export interface SvgStyle {
	displayW: number;
	displayH: number;
	tintEnabled: boolean;
	tintColor: RGBA;
}

export interface SvgClip extends BaseClip {
	type: 'svg';
	file: string;
	svgStyle: SvgStyle;
}

export interface CompClip extends BaseClip {
	type: 'comp';
	compId: string;
	mediaOffset: number;
}

export interface WebCompClip extends BaseClip {
	type: 'webcomp';
	webcompId: string;
	mediaOffset: number;
	runtimeParams: Record<string, unknown>;
}

export interface AudioClip extends BaseClip {
	type: 'audio';
	assetId: string;
	filepath: string;
	mediaOffset: number;
	volume: number;
	pan: number;
	muted: boolean;
}

export type AnyClip =
	| VideoClip | ImageClip | SolidClip | TextClip
	| ShapeClip | PenClip | SvgClip | CompClip
	| WebCompClip | AudioClip;
