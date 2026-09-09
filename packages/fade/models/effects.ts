/** A single GPU uniform: scalar → [v], vec4 → [r,g,b,a], etc. */
export interface EffectUniform {
	id: string;
	values: number[];
}

export interface SkslEffect {
	typeId: string;
	enabled: boolean;
	uniforms: EffectUniform[];
}

export interface MaskLayer {
	maskId: string;
	maskType: 'luma' | 'alpha' | 'inverted_alpha' | 'inverted_luma';
	assetId: string;
	filepath: string;
}
