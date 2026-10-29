import {
	add as chartsAdd,
	remove as chartsDelete,
	get as chartsGet,
	list as chartsList,
	setData as chartsSetData,
	update as chartsUpdate,
} from './charts';
import {
	get as commentsGet,
	list as commentsList,
	listReplies as commentsListReplies,
	reply as commentsReply,
} from './comments';
import { create as filesCreate, find as filesFind } from './files';
import { calculate as functionsCalculate } from './functions';
import {
	add as namesAdd,
	get as namesGet,
	list as namesList,
	range as namesRange,
	update as namesUpdate,
} from './names';
import {
	clear as rangesClear,
	get as rangesGet,
	update as rangesUpdate,
	usedRange as rangesUsedRange,
} from './ranges';
import {
	close as sessionsClose,
	create as sessionsCreate,
	refresh as sessionsRefresh,
} from './sessions';
import {
	add as tablesAdd,
	addColumn as tablesAddColumn,
	addRows as tablesAddRows,
	remove as tablesDelete,
	deleteColumn as tablesDeleteColumn,
	deleteRow as tablesDeleteRow,
	get as tablesGet,
	list as tablesList,
	listColumns as tablesListColumns,
	listRows as tablesListRows,
	update as tablesUpdate,
} from './tables';
import {
	add as worksheetsAdd,
	remove as worksheetsDelete,
	get as worksheetsGet,
	list as worksheetsList,
	update as worksheetsUpdate,
} from './worksheets';

export const Sessions = {
	create: sessionsCreate,
	close: sessionsClose,
	refresh: sessionsRefresh,
};

export const Worksheets = {
	list: worksheetsList,
	get: worksheetsGet,
	add: worksheetsAdd,
	update: worksheetsUpdate,
	delete: worksheetsDelete,
};

export const Ranges = {
	get: rangesGet,
	usedRange: rangesUsedRange,
	update: rangesUpdate,
	clear: rangesClear,
};

export const Tables = {
	list: tablesList,
	get: tablesGet,
	add: tablesAdd,
	update: tablesUpdate,
	delete: tablesDelete,
	listRows: tablesListRows,
	addRows: tablesAddRows,
	deleteRow: tablesDeleteRow,
	listColumns: tablesListColumns,
	addColumn: tablesAddColumn,
	deleteColumn: tablesDeleteColumn,
};

export const Charts = {
	list: chartsList,
	get: chartsGet,
	add: chartsAdd,
	update: chartsUpdate,
	delete: chartsDelete,
	setData: chartsSetData,
};

export const Names = {
	list: namesList,
	get: namesGet,
	add: namesAdd,
	update: namesUpdate,
	range: namesRange,
};

export const Comments = {
	list: commentsList,
	get: commentsGet,
	listReplies: commentsListReplies,
	reply: commentsReply,
};

export const Functions = {
	calculate: functionsCalculate,
};

export const Files = {
	create: filesCreate,
	find: filesFind,
};

export * from './types';
