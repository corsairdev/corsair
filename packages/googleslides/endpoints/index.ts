import { BatchEndpoints } from './batch';
import { ElementsEndpoints } from './elements';
import { PresentationsEndpoints } from './presentations';
import { SlidesEndpoints } from './slides';
import { TextEndpoints } from './text';

export {
	BatchEndpoints,
	ElementsEndpoints,
	PresentationsEndpoints,
	SlidesEndpoints,
	TextEndpoints,
};

export { compact, compactQuery, replyAt } from './shared';
// Shared helpers, exported so the tests exercise the same function the
// endpoints use rather than a copy of its logic.
export { isNotesPlaceholder, notesText } from './slides';

export * from './types';
