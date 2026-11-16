/**
 * Bodies below follow NiftyImages' REST API documentation
 * (https://api.niftyimages.com/Docs). The shapes that matter and are easy to
 * get wrong: every list answers a bare array, dates use PascalCase property
 * names (`CreateDate`), and an unknown path answers an HTML page rather than a
 * JSON 404.
 */

export const widgets = [
	{
		Name: 'CKEditor Widget',
		WidgetKey: '153607b3-da74-48ed-a579-d2d2430a7578',
	},
	{ Name: 'TinyMCE Widget', WidgetKey: '729c4159-2837-4817-b1d4-104a7ee279b3' },
	{
		Name: 'Internal Widget',
		WidgetKey: '61e1b493-0c56-479f-bc15-259e26e94fcc',
	},
];

/** The docs' own stats example, which reports counts in PascalCase. */
export const widgetStats = [
	{
		WidgetKey: '153607b3-da74-48ed-a579-d2d2430a7578',
		Name: 'CKEditor Widget',
		Views: 12480,
		UniqueViews: 9032,
		Clicks: 812,
		UniqueClicks: 640,
	},
	{
		WidgetKey: '729c4159-2837-4817-b1d4-104a7ee279b3',
		Name: 'TinyMCE Widget',
		Views: 0,
		UniqueViews: 0,
		Clicks: 0,
		UniqueClicks: 0,
	},
];

export const widgetUsers = [
	{
		User: 'jordan@acme-logistics.com',
		Views: 12,
		Clicks: 3,
		LastSeen: '2016-03-12T12:00Z',
	},
	{
		User: 'dana@northwind.example',
		Views: 4,
		Clicks: 0,
		LastSeen: '2016-03-10T08:30Z',
	},
];

export const userStats = {
	User: 'jordan@acme-logistics.com',
	Views: 12,
	Clicks: 3,
	FirstSeen: '2016-02-10T11:23Z',
	LastSeen: '2016-03-12T12:00Z',
};

export const widgetImages = [
	{
		ImageKey: 'img_2f1c8d9e',
		ImageUrl: 'https://d3e54v103j8qbb.cloudfront.net/img/2f1c8d9e.png',
		User: 'jordan@acme-logistics.com',
		CreateDate: '2016-03-12T12:00Z',
		Views: 3,
		Clicks: 1,
	},
];

/** A 401 carries a JSON message, which is the only JSON error the API sends. */
export const invalidKey = {
	message: 'Your API Key does not appear to be valid',
};

/** A wrong path answers a 404 with an ASP.NET HTML page, not JSON. */
export const htmlNotFound =
	"<!DOCTYPE html><html><head><title>The resource cannot be found.</title></head><body><h2>Server Error in '/' Application.</h2></body></html>";
