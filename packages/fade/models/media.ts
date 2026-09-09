export type MediaType = 'video' | 'audio' | 'image' | 'svg' | 'lottie';

export interface MediaAsset {
	assetId: string;
	name: string;
	filepath: string;
	mediaType: MediaType;
	/** Duration in seconds (0 for images) */
	duration: number;
	/** Native width in pixels */
	width: number;
	/** Native height in pixels */
	height: number;
	/** File size in bytes */
	fileSize: number;
	/** Absolute path to generated thumbnail */
	thumbnailPath: string | null;
	addedAt: string;
}
