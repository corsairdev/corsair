import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const clickMouseRoute = getRoute('clickMouse');
export const clickMouse: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, clickMouseRoute);
};

const copySelectedTextRoute = getRoute('copySelectedText');
export const copySelectedText: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, copySelectedTextRoute);
};

const doubleClickMouseRoute = getRoute('doubleClickMouse');
export const doubleClickMouse: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, doubleClickMouseRoute);
};

const dragAndDropRoute = getRoute('dragAndDrop');
export const dragAndDrop: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, dragAndDropRoute);
};

const getClipboardContentRoute = getRoute('getClipboardContent');
export const getClipboardContent: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, getClipboardContentRoute);
};

const moveMouseRoute = getRoute('moveMouse');
export const moveMouse: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, moveMouseRoute);
};

const navigateToUrlRoute = getRoute('navigateToUrl');
export const navigateToUrl: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, navigateToUrlRoute);
};

const pasteTextRoute = getRoute('pasteText');
export const pasteText: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, pasteTextRoute);
};

const performKeyboardShortcutRoute = getRoute('performKeyboardShortcut');
export const performKeyboardShortcut: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(
		ctx,
		input,
		performKeyboardShortcutRoute,
	);
};

const pressMouseButtonRoute = getRoute('pressMouseButton');
export const pressMouseButton: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, pressMouseButtonRoute);
};

const releaseMouseButtonRoute = getRoute('releaseMouseButton');
export const releaseMouseButton: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, releaseMouseButtonRoute);
};

const scrollSessionRoute = getRoute('scrollSession');
export const scrollSession: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, scrollSessionRoute);
};

const setClipboardContentRoute = getRoute('setClipboardContent');
export const setClipboardContent: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, setClipboardContentRoute);
};

const typeTextRoute = getRoute('typeText');
export const typeText: AnchorBrowserEndpoint = async (ctx, input = {}) => {
	return executeAnchorBrowserOperation(ctx, input, typeTextRoute);
};

export const OsLevelEndpoints = {
	clickMouse,
	copySelectedText,
	doubleClickMouse,
	dragAndDrop,
	getClipboardContent,
	moveMouse,
	navigateToUrl,
	pasteText,
	performKeyboardShortcut,
	pressMouseButton,
	releaseMouseButton,
	scrollSession,
	setClipboardContent,
	typeText,
} as const;
