export type EventDateTime = {
	date?: string;
	dateTime?: string;
	timeZone?: string;
};

export type Attendee = {
	id?: string;
	email?: string;
	displayName?: string;
	organizer?: boolean;
	self?: boolean;
	resource?: boolean;
	optional?: boolean;
	responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
	comment?: string;
	additionalGuests?: number;
};

export type Organizer = {
	id?: string;
	email?: string;
	displayName?: string;
	self?: boolean;
};

export type Reminder = {
	method?: 'email' | 'popup';
	minutes?: number;
};

export type EventReminders = {
	useDefault?: boolean;
	overrides?: Reminder[];
};

export type ConferenceData = {
	createRequest?: {
		requestId?: string;
		conferenceSolutionKey?: {
			type?: string;
		};
		status?: {
			statusCode?: string;
		};
	};
	entryPoints?: Array<{
		entryPointType?: string;
		uri?: string;
		label?: string;
		pin?: string;
		accessCode?: string;
		meetingCode?: string;
		passcode?: string;
		password?: string;
	}>;
	conferenceSolution?: {
		key?: {
			type?: string;
		};
		name?: string;
		iconUri?: string;
	};
	conferenceId?: string;
	signature?: string;
	notes?: string;
};

export type Event = {
	id?: string;
	status?: 'confirmed' | 'tentative' | 'cancelled';
	htmlLink?: string;
	created?: string;
	updated?: string;
	summary?: string;
	description?: string;
	location?: string;
	colorId?: string;
	creator?: Organizer;
	organizer?: Organizer;
	start?: EventDateTime;
	end?: EventDateTime;
	endTimeUnspecified?: boolean;
	recurrence?: string[];
	recurringEventId?: string;
	originalStartTime?: EventDateTime;
	transparency?: 'opaque' | 'transparent';
	visibility?: 'default' | 'public' | 'private' | 'confidential';
	iCalUID?: string;
	sequence?: number;
	attendees?: Attendee[];
	attendeesOmitted?: boolean;
	hangoutLink?: string;
	conferenceData?: ConferenceData;
	gadget?: {
		type?: string;
		title?: string;
		link?: string;
		iconLink?: string;
		width?: number;
		height?: number;
		display?: string;
		preferences?: Record<string, string>;
	};
	anyoneCanAddSelf?: boolean;
	guestsCanInviteOthers?: boolean;
	guestsCanModify?: boolean;
	guestsCanSeeOtherGuests?: boolean;
	privateCopy?: boolean;
	locked?: boolean;
	reminders?: EventReminders;
	source?: {
		url?: string;
		title?: string;
	};
	attachments?: Array<{
		fileUrl?: string;
		title?: string;
		mimeType?: string;
		iconLink?: string;
		fileId?: string;
	}>;
	eventType?: 'default' | 'outOfOffice' | 'focusTime' | 'workingLocation';
};

export type EventListResponse = {
	kind?: string;
	etag?: string;
	summary?: string;
	description?: string;
	updated?: string;
	timeZone?: string;
	accessRole?: string;
	defaultReminders?: Reminder[];
	nextPageToken?: string;
	nextSyncToken?: string;
	items?: Event[];
};

export type FreeBusyRequest = {
	timeMin: string;
	timeMax: string;
	timeZone?: string;
	groupExpansionMax?: number;
	calendarExpansionMax?: number;
	items?: Array<{
		id: string;
	}>;
};

export type FreeBusyCalendar = {
	busy?: Array<{
		start?: string;
		end?: string;
	}>;
	errors?: Array<{
		domain?: string;
		reason?: string;
	}>;
};

export type FreeBusyResponse = {
	kind?: string;
	calendars?: Record<string, FreeBusyCalendar>;
	groups?: Record<
		string,
		{
			calendars?: string[];
			errors?: Array<{
				domain?: string;
				reason?: string;
			}>;
		}
	>;
	timeMin?: string;
	timeMax?: string;
};

export type Calendar = {
	id?: string;
	summary?: string;
	description?: string;
	location?: string;
	timeZone?: string;
	conferenceProperties?: {
		allowedConferenceSolutionTypes?: string[];
	};
};

export type CalendarListResponse = {
	kind?: string;
	etag?: string;
	nextPageToken?: string;
	nextSyncToken?: string;
	items?: Calendar[];
};
