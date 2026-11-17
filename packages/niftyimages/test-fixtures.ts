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

/** The docs' own AllStats example. */
export const widgetStats = [
	{
		Users: 3,
		Images: 21,
		Impressions: 54,
		Active: true,
		Name: 'CKEditor Widget',
		WidgetKey: '153607b3-da74-48ed-a579-d2d2430a7578',
	},
	{
		Users: 0,
		Images: 0,
		Impressions: 0,
		Active: true,
		Name: 'TinyMCE Widget',
		WidgetKey: '729c4159-2837-4817-b1d4-104a7ee279b3',
	},
];

export const widgetUsers = [
	{
		Images: 5,
		Impressions: 7,
		User: 'jordan@acme-logistics.com',
		Suspended: false,
	},
	{
		Images: 1,
		Impressions: 2,
		User: 'dana@northwind.example',
		Suspended: true,
	},
];

export const userStats = {
	Images: 11,
	Impressions: 118,
	User: 'jordan@acme-logistics.com',
	Suspended: false,
};

export const widgetImages = [
	{
		ImageID: 8419,
		ImageType: 'Countdown Timer',
		Impressions: 1,
		Name: 'TinyMCE Countdown',
		User: 'jordan@acme-logistics.com',
		Suspended: true,
		Uri: 'https://img1.niftyimages.com/h/ko5/jo5',
	},
];

/** /Images and /Images/AllStats, from the docs: Opens is a string here. */
export const images = [
	{
		Name: 'Welcome Email',
		Url: 'https://img1.niftyimages.com/p/lop/m7w?txt=',
		Opens: '55470',
		ImageType: 'Personalized Image',
		CreateDate: '2017-03-12T11:12Z',
		LastUpdated: '2017-05-10T04:22Z',
		Active: true,
	},
];

/** /Image?url=: Opens is a number on a single image. */
export const singleImage = {
	Name: 'Welcome Email',
	Url: 'https://img1.niftyimages.com/p/lop/m7w?txt=',
	Opens: 55470,
	ImageType: 'Personalized Image',
	CreateDate: '2017-08-07T17:33:25.93',
	LastUpdated: '2017-08-07T17:33:25.93',
};

export const storeFields = [
	{
		name: 'Birthday',
		type: 'DATETIME',
		date_input_format: 'ISO 8601',
		unique: false,
	},
	{ name: 'EmployeeID', type: 'NUMBER', unique: true },
];

export const timerUpdated = {
	TimerImageUrl: 'https://img1.niftyimages.com/z/qwcd/ywcd',
	TimerTimezone: '(UTC-08:00) Pacific Time (US & Canada)',
	UpdatedTargetUtc: '2022-05-17T07:00:00Z',
	UpdatedTargetTimezone: '2022-05-17T00:00:00',
};

export const mapDetails = {
	Url: 'https://img1.niftyimages.com/p/lop/m7w',
	Name: 'Lat Lng Map',
	LocationsGood: 10,
	LocationsBad: 0,
	LocationsNotProcessed: 0,
	Opens: 3221,
	Clicks: 184,
	CreateDate: '2019-10-16T23:53:07.207',
	LastUpdated: '2019-10-16T23:53:20.023',
};

export const mapLocations = [
	{
		NiftyID: '37.788864 | -122.4013971',
		LocationID: '1',
		Address: '609 Market St, San Francisco, CA 94105',
		Latitude: 37.788864,
		Longitude: -122.4013971,
		Properties: [{ Name: 'Phone', Value: '(415) 543-2595' }],
	},
];

export const beeUserImages = [
	{
		ImageID: 96292,
		ImageType: 'Countdown Timer',
		Name: 'Test Image',
		UserName: 'Test User',
		Opens: 121,
		Uri: 'http://ssl.personalizeimage.com/h/eguh/-guh',
		Status: 'Suspended',
	},
];

export const psdImage = {
	Url: 'https://img1.niftyimages.com/p/lop/m7w',
	Name: 'Photoshop Sample Image',
	Variables: [{ Name: '{txt}', DefaultValue: 'Your' }],
	Layers: [
		{ LayerName: 'Background', LayerType: 'RasterLayer', Hide: false },
		{
			LayerName: 'StockPrice',
			LayerType: 'TextLayer',
			Hide: false,
			TextValue: '25,149.30',
			TextColor: '#FF0000',
		},
	],
	Active: true,
};

/** A 401 carries a JSON message, which is the only JSON error the API sends. */
export const invalidKey = {
	message: 'Your API Key does not appear to be valid',
};

/** A wrong path answers a 404 with an ASP.NET HTML page, not JSON. */
export const htmlNotFound =
	"<!DOCTYPE html><html><head><title>The resource cannot be found.</title></head><body><h2>Server Error in '/' Application.</h2></body></html>";
