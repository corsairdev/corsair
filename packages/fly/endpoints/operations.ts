import { apps } from './apps';
import { certificates } from './certificates';
import { ipAssignments } from './ip-assignments';
import { machines } from './machines';
import { platform, tokens } from './platform';
import { secrets } from './secrets';
import { volumes } from './volumes';

/** Every operation, grouped by resource, on Fly's public Machines REST API. */
export const operations = {
	apps,
	machines,
	volumes,
	secrets,
	certificates,
	ipAssignments,
	tokens,
	platform,
};
