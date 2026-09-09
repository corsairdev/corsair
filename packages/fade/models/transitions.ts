export interface TransitionParam {
	id: string;
	displayName: string;
	type: 'FloatSlider' | 'IntSlider' | 'Toggle';
	default: number;
	min: number;
	max: number;
}

export interface TransitionCatalogEntry {
	typeId: string;
	name: string;
	category: string;
	desc: string;
	params: TransitionParam[];
}

export const TRANSITION_CATALOG: TransitionCatalogEntry[] = [
	{ typeId: 'dissolve', name: 'Dissolve', category: 'Basic', desc: 'Cross-dissolve blend',
	  params: [{ id: 'softness', displayName: 'Softness', type: 'FloatSlider', default: 0, min: 0, max: 0.5 }] },
	{ typeId: 'fade_black', name: 'Fade to Black', category: 'Basic', desc: 'Dip to black', params: [] },
	{ typeId: 'wipe_left', name: 'Wipe Left', category: 'Wipe', desc: 'Reveals from left',
	  params: [{ id: 'edge_softness', displayName: 'Edge Softness', type: 'FloatSlider', default: 0.02, min: 0, max: 0.1 }] },
	{ typeId: 'wipe_right', name: 'Wipe Right', category: 'Wipe', desc: 'Reveals from right',
	  params: [{ id: 'edge_softness', displayName: 'Edge Softness', type: 'FloatSlider', default: 0.02, min: 0, max: 0.1 }] },
	{ typeId: 'zoom_in', name: 'Zoom In', category: 'Motion', desc: 'Incoming clip zooms in from centre',
	  params: [{ id: 'scale_start', displayName: 'Start Scale', type: 'FloatSlider', default: 0.3, min: 0.05, max: 0.9 }] },
	{ typeId: 'slide_left', name: 'Slide Left', category: 'Motion', desc: 'Incoming clip slides in from right', params: [] },
];

export interface Transition {
	transId: string;
	typeId: string;
	duration: number;
	clipA_id: string;
	clipB_id: string;
	values: Record<string, number>;
}
