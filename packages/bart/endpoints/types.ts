import { z } from 'zod';

// CDATA or string text helper schema
export const CDataOrStringSchema = z.union([
	z.string(),
	z
		.object({
			'#cdata-section': z.string(),
		})
		.strict(),
]);
export type CDataOrString = z.infer<typeof CDataOrStringSchema>;

export const BartMessageSchema = z
	.union([z.string(), z.record(z.string(), z.unknown())])
	.optional();

export function unwrapCData(
	value: CDataOrString | undefined | null,
): string | undefined {
	if (value === undefined || value === null) return undefined;
	if (typeof value === 'string') return value;
	if (
		typeof value === 'object' &&
		'#cdata-section' in value &&
		typeof value['#cdata-section'] === 'string'
	) {
		return value['#cdata-section'];
	}
	return undefined;
}

export function advisoryEntityId(
	item: {
		station?: string;
		type?: string;
		posted?: string;
		expires?: string;
		description?: CDataOrString;
		sms_text?: CDataOrString;
	},
	responseDate?: string,
): string {
	const stationKey = item.station?.trim() || 'SYSTEM';
	const timeKey = item.posted?.trim() || responseDate?.trim() || '';
	const typeKey = item.type?.trim() || '';
	const expiresKey = item.expires?.trim() || '';
	const desc = unwrapCData(item.description)?.trim() || '';
	const sms = unwrapCData(item.sms_text)?.trim() || '';
	const content = [desc, sms].filter(Boolean).join('|') || 'advisory';
	return [stationKey, timeKey, typeKey, expiresKey, content].join('::');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Advisories (bsa)
// ─────────────────────────────────────────────────────────────────────────────

export const AdvisoriesListInputSchema = z
	.object({
		orig: z.string().trim().min(1).optional(),
		date: z.string().trim().min(1).optional(),
	})
	.optional();
export type AdvisoriesListInput = z.infer<typeof AdvisoriesListInputSchema>;

export const BsaItemSchema = z
	.object({
		station: z.string().optional(),
		type: z.string().optional(),
		description: CDataOrStringSchema.optional(),
		sms_text: CDataOrStringSchema.optional(),
		posted: z.string().optional(),
		expires: z.string().optional(),
	})
	.passthrough();
export type BsaItem = z.infer<typeof BsaItemSchema>;

export const AdvisoriesListResponseSchema = z
	.object({
		date: z.string().optional(),
		time: z.string().optional(),
		bsa: z.union([z.array(BsaItemSchema), BsaItemSchema]).optional(),
		message: BartMessageSchema,
	})
	.passthrough();
export type AdvisoriesListResponse = z.infer<
	typeof AdvisoriesListResponseSchema
>;

export const AdvisoriesElevatorsInputSchema = z
	.object({
		orig: z.string().trim().min(1).optional(),
		date: z.string().trim().min(1).optional(),
	})
	.optional();
export type AdvisoriesElevatorsInput = z.infer<
	typeof AdvisoriesElevatorsInputSchema
>;

export const AdvisoriesElevatorsResponseSchema = z
	.object({
		date: z.string().optional(),
		time: z.string().optional(),
		bsa: z.union([z.array(BsaItemSchema), BsaItemSchema]).optional(),
	})
	.passthrough();
export type AdvisoriesElevatorsResponse = z.infer<
	typeof AdvisoriesElevatorsResponseSchema
>;

export const AdvisoriesTrainCountInputSchema = z.object({}).optional();
export type AdvisoriesTrainCountInput = z.infer<
	typeof AdvisoriesTrainCountInputSchema
>;

export const AdvisoriesTrainCountResponseSchema = z
	.object({
		date: z.string().optional(),
		time: z.string().optional(),
		traincount: z.union([z.string(), z.number()]),
	})
	.passthrough();
export type AdvisoriesTrainCountResponse = z.infer<
	typeof AdvisoriesTrainCountResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Real-Time Departures (etd)
// ─────────────────────────────────────────────────────────────────────────────

export const EtdStationInputSchema = z.object({
	orig: z.string().trim().min(1),
	plat: z.union([z.string().trim().min(1), z.number()]).optional(),
	dir: z.string().trim().min(1).optional(),
});
export type EtdStationInput = z.infer<typeof EtdStationInputSchema>;

export const EtdEstimateSchema = z
	.object({
		minutes: z.string(),
		platform: z.string().optional(),
		direction: z.string().optional(),
		length: z.string().optional(),
		color: z.string().optional(),
		hexcolor: z.string().optional(),
		bikeflag: z.string().optional(),
		delay: z.string().optional(),
		cancelflag: z.string().optional(),
		dynamicflag: z.string().optional(),
	})
	.passthrough();
export type EtdEstimate = z.infer<typeof EtdEstimateSchema>;

export const EtdDestinationSchema = z
	.object({
		destination: z.string(),
		abbreviation: z.string(),
		limited: z.string().optional(),
		estimate: z.union([z.array(EtdEstimateSchema), EtdEstimateSchema]),
	})
	.passthrough();
export type EtdDestination = z.infer<typeof EtdDestinationSchema>;

export const EtdStationItemSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		etd: z
			.union([z.array(EtdDestinationSchema), EtdDestinationSchema])
			.optional(),
	})
	.passthrough();
export type EtdStationItem = z.infer<typeof EtdStationItemSchema>;

export const EtdStationResponseSchema = z
	.object({
		date: z.string().optional(),
		time: z.string().optional(),
		station: z.union([z.array(EtdStationItemSchema), EtdStationItemSchema]),
		message: BartMessageSchema,
	})
	.passthrough();
export type EtdStationResponse = z.infer<typeof EtdStationResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Routes (route)
// ─────────────────────────────────────────────────────────────────────────────

export const RoutesListInputSchema = z
	.object({
		sched: z.union([z.string().trim().min(1), z.number()]).optional(),
		date: z.string().trim().min(1).optional(),
	})
	.optional();
export type RoutesListInput = z.infer<typeof RoutesListInputSchema>;

export const RouteListItemSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		routeID: z.string(),
		number: z.string(),
		hexcolor: z.string().optional(),
		color: z.string().optional(),
	})
	.passthrough();
export type RouteListItem = z.infer<typeof RouteListItemSchema>;

export const RoutesListResponseSchema = z
	.object({
		sched: z.string().optional(),
		routes: z
			.object({
				route: z.union([z.array(RouteListItemSchema), RouteListItemSchema]),
			})
			.passthrough(),
	})
	.passthrough();
export type RoutesListResponse = z.infer<typeof RoutesListResponseSchema>;

export const RoutesInfoInputSchema = z.object({
	route: z.union([z.string().trim().min(1), z.number()]),
	sched: z.union([z.string().trim().min(1), z.number()]).optional(),
	date: z.string().trim().min(1).optional(),
});
export type RoutesInfoInput = z.infer<typeof RoutesInfoInputSchema>;

export const RouteDetailSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		routeID: z.string(),
		number: z.string(),
		origin: z.string().optional(),
		destination: z.string().optional(),
		direction: z.string().optional(),
		color: z.string().optional(),
		hexcolor: z.string().optional(),
		holidays: z.string().optional(),
		numStns: z.string().optional(),
		config: z
			.object({
				station: z.union([z.array(z.string()), z.string()]).optional(),
			})
			.optional(),
	})
	.passthrough();
export type RouteDetail = z.infer<typeof RouteDetailSchema>;

export const RoutesInfoResponseSchema = z
	.object({
		sched: z.string().optional(),
		routes: z
			.object({
				route: z.union([z.array(RouteDetailSchema), RouteDetailSchema]),
			})
			.passthrough(),
	})
	.passthrough();
export type RoutesInfoResponse = z.infer<typeof RoutesInfoResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 4. Stations (stn)
// ─────────────────────────────────────────────────────────────────────────────

export const StationsListInputSchema = z.object({}).optional();
export type StationsListInput = z.infer<typeof StationsListInputSchema>;

export const StationListItemSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		gtfs_latitude: z.string().optional(),
		gtfs_longitude: z.string().optional(),
		address: z.string().optional(),
		city: z.string().optional(),
		county: z.string().optional(),
		state: z.string().optional(),
		zipcode: z.string().optional(),
	})
	.passthrough();
export type StationListItem = z.infer<typeof StationListItemSchema>;

export const StationsListResponseSchema = z
	.object({
		stations: z
			.object({
				station: z.union([
					z.array(StationListItemSchema),
					StationListItemSchema,
				]),
			})
			.passthrough(),
	})
	.passthrough();
export type StationsListResponse = z.infer<typeof StationsListResponseSchema>;

export const StationsInfoInputSchema = z.object({
	orig: z.string().trim().min(1),
});
export type StationsInfoInput = z.infer<typeof StationsInfoInputSchema>;

export const StationDetailSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		gtfs_latitude: z.string().optional(),
		gtfs_longitude: z.string().optional(),
		address: z.string().optional(),
		city: z.string().optional(),
		county: z.string().optional(),
		state: z.string().optional(),
		zipcode: z.string().optional(),
		north_routes: z
			.object({
				route: z.union([z.array(z.string()), z.string()]).optional(),
			})
			.optional(),
		south_routes: z
			.object({
				route: z.union([z.array(z.string()), z.string()]).optional(),
			})
			.optional(),
		north_platforms: z
			.object({
				platform: z.union([z.array(z.string()), z.string()]).optional(),
			})
			.optional(),
		south_platforms: z
			.object({
				platform: z.union([z.array(z.string()), z.string()]).optional(),
			})
			.optional(),
		platform_info: z.string().optional(),
		intro: CDataOrStringSchema.optional(),
		cross_street: CDataOrStringSchema.optional(),
		food: CDataOrStringSchema.optional(),
		shopping: CDataOrStringSchema.optional(),
		attraction: CDataOrStringSchema.optional(),
		link: CDataOrStringSchema.optional(),
	})
	.passthrough();
export type StationDetail = z.infer<typeof StationDetailSchema>;

export const StationsInfoResponseSchema = z
	.object({
		stations: z
			.object({
				station: z.union([z.array(StationDetailSchema), StationDetailSchema]),
			})
			.optional(),
		station: z
			.union([z.array(StationDetailSchema), StationDetailSchema])
			.optional(),
	})
	.passthrough();
export type StationsInfoResponse = z.infer<typeof StationsInfoResponseSchema>;

export const StationsAccessInputSchema = z.object({
	orig: z.string().trim().min(1),
	l: z.union([z.string().trim().min(1), z.number()]).optional(),
});
export type StationsAccessInput = z.infer<typeof StationsAccessInputSchema>;

export const StationAccessDetailSchema = z
	.object({
		name: z.string(),
		abbr: z.string(),
		entering: CDataOrStringSchema.optional(),
		exiting: CDataOrStringSchema.optional(),
		parking: CDataOrStringSchema.optional(),
		fill_time: CDataOrStringSchema.optional(),
		car_share: CDataOrStringSchema.optional(),
		lockers: CDataOrStringSchema.optional(),
		bike_station_text: CDataOrStringSchema.optional(),
		dest_stations: CDataOrStringSchema.optional(),
		transit_info: CDataOrStringSchema.optional(),
		link: CDataOrStringSchema.optional(),
	})
	.passthrough();
export type StationAccessDetail = z.infer<typeof StationAccessDetailSchema>;

export const StationsAccessResponseSchema = z
	.object({
		stations: z
			.object({
				station: z.union([
					z.array(StationAccessDetailSchema),
					StationAccessDetailSchema,
				]),
			})
			.optional(),
		station: z
			.union([z.array(StationAccessDetailSchema), StationAccessDetailSchema])
			.optional(),
	})
	.passthrough();
export type StationsAccessResponse = z.infer<
	typeof StationsAccessResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 5. Schedules (sched)
// ─────────────────────────────────────────────────────────────────────────────

export const SchedulesDeparturesInputSchema = z.object({
	orig: z.string().trim().min(1),
	dest: z.string().trim().min(1),
	time: z.string().trim().min(1).optional(),
	date: z.string().trim().min(1).optional(),
	b: z.union([z.string().trim().min(1), z.number()]).optional(),
	a: z.union([z.string().trim().min(1), z.number()]).optional(),
	l: z.union([z.string().trim().min(1), z.number()]).optional(),
});
export type SchedulesDeparturesInput = z.infer<
	typeof SchedulesDeparturesInputSchema
>;

export const TripLegSchema = z
	.object({
		'@order': z.string().optional(),
		'@transfercode': z.string().optional(),
		'@origin': z.string().optional(),
		'@destination': z.string().optional(),
		'@origTimeMin': z.string().optional(),
		'@origTimeDate': z.string().optional(),
		'@destTimeMin': z.string().optional(),
		'@destTimeDate': z.string().optional(),
		'@line': z.string().optional(),
		'@bikeflag': z.string().optional(),
		'@trainHeadStation': z.string().optional(),
		'@trainIdx': z.string().optional(),
	})
	.passthrough();
export type TripLeg = z.infer<typeof TripLegSchema>;

export const FareItemSchema = z
	.object({
		'@amount': z.string().optional(),
		'@class': z.string().optional(),
		'@name': z.string().optional(),
		'@type': z.string().optional(),
	})
	.passthrough();
export type FareItem = z.infer<typeof FareItemSchema>;

export const TripItemSchema = z
	.object({
		'@origin': z.string().optional(),
		'@destination': z.string().optional(),
		'@fare': z.string().optional(),
		'@origTimeMin': z.string().optional(),
		'@origTimeDate': z.string().optional(),
		'@destTimeMin': z.string().optional(),
		'@destTimeDate': z.string().optional(),
		'@tripTime': z.string().optional(),
		'@clipper': z.string().optional(),
		leg: z.union([z.array(TripLegSchema), TripLegSchema]).optional(),
		fares: z
			.object({
				fare: z.union([z.array(FareItemSchema), FareItemSchema]).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type TripItem = z.infer<typeof TripItemSchema>;

export const ScheduleTripRequestSchema = z
	.object({
		trip: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export type ScheduleTripRequest = z.infer<typeof ScheduleTripRequestSchema>;

export const SchedulePlanSchema = z
	.object({
		date: z.string().optional(),
		time: z.string().optional(),
		before: z.string().optional(),
		after: z.string().optional(),
		request: ScheduleTripRequestSchema.optional(),
		trip: z.union([z.array(TripItemSchema), TripItemSchema]).optional(),
	})
	.passthrough();
export type SchedulePlan = z.infer<typeof SchedulePlanSchema>;

export const ScheduleFilesSchema = z
	.object({
		file: z
			.union([
				z.array(z.record(z.string(), z.string())),
				z.record(z.string(), z.string()),
			])
			.optional(),
	})
	.passthrough();
export type ScheduleFiles = z.infer<typeof ScheduleFilesSchema>;

export const SchedulesDeparturesResponseSchema = z
	.object({
		origin: z.string().optional(),
		destination: z.string().optional(),
		schedule: SchedulePlanSchema.optional(),
		schedule_files: ScheduleFilesSchema.optional(),
	})
	.passthrough();
export type SchedulesDeparturesResponse = z.infer<
	typeof SchedulesDeparturesResponseSchema
>;

export const SchedulesArrivalsInputSchema = z.object({
	orig: z.string().trim().min(1),
	dest: z.string().trim().min(1),
	time: z.string().trim().min(1).optional(),
	date: z.string().trim().min(1).optional(),
	b: z.union([z.string().trim().min(1), z.number()]).optional(),
	a: z.union([z.string().trim().min(1), z.number()]).optional(),
	l: z.union([z.string().trim().min(1), z.number()]).optional(),
});
export type SchedulesArrivalsInput = z.infer<
	typeof SchedulesArrivalsInputSchema
>;

export const SchedulesArrivalsResponseSchema = z
	.object({
		origin: z.string().optional(),
		destination: z.string().optional(),
		schedule: SchedulePlanSchema.optional(),
		schedule_files: ScheduleFilesSchema.optional(),
	})
	.passthrough();
export type SchedulesArrivalsResponse = z.infer<
	typeof SchedulesArrivalsResponseSchema
>;

export const SchedulesRoutesInputSchema = z.object({
	route: z.union([z.string().trim().min(1), z.number()]),
	time: z.string().trim().min(1).optional(),
	date: z.string().trim().min(1).optional(),
	l: z.union([z.string().trim().min(1), z.number()]).optional(),
});
export type SchedulesRoutesInput = z.infer<typeof SchedulesRoutesInputSchema>;

export const RouteScheduleStopSchema = z
	.object({
		'@station': z.string().optional(),
		'@origTime': z.string().optional(),
		'@bikeflag': z.string().optional(),
		'@load': z.string().optional(),
	})
	.passthrough();
export type RouteScheduleStop = z.infer<typeof RouteScheduleStopSchema>;

export const RouteScheduleTrainSchema = z
	.object({
		'@trainIdx': z.string().optional(),
		'@trainHeadStation': z.string().optional(),
		stop: z
			.union([z.array(RouteScheduleStopSchema), RouteScheduleStopSchema])
			.optional(),
	})
	.passthrough();
export type RouteScheduleTrain = z.infer<typeof RouteScheduleTrainSchema>;

export const SchedulesRoutesResponseSchema = z
	.object({
		route: z
			.object({
				train: z
					.union([z.array(RouteScheduleTrainSchema), RouteScheduleTrainSchema])
					.optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type SchedulesRoutesResponse = z.infer<
	typeof SchedulesRoutesResponseSchema
>;

export const FareTripSchema = z
	.object({
		fare: z.string().optional(),
		discount: z.record(z.string(), z.string()).optional(),
	})
	.passthrough();
export type FareTrip = z.infer<typeof FareTripSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Fares (fare)
// ─────────────────────────────────────────────────────────────────────────────

export const FaresCalculateInputSchema = z.object({
	orig: z.string().trim().min(1),
	dest: z.string().trim().min(1),
	date: z.string().trim().min(1).optional(),
	sched: z.union([z.string().trim().min(1), z.number()]).optional(),
});
export type FaresCalculateInput = z.infer<typeof FaresCalculateInputSchema>;

export const FaresCalculateResponseSchema = z
	.object({
		origin: z.string().optional(),
		destination: z.string().optional(),
		sched: z.string().optional(),
		sched_num: z.string().optional(),
		trip: FareTripSchema.optional(),
		fares: z
			.object({
				fare: z.union([z.array(FareItemSchema), FareItemSchema]).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();
export type FaresCalculateResponse = z.infer<
	typeof FaresCalculateResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Inputs & Outputs Maps
// ─────────────────────────────────────────────────────────────────────────────

export type BartEndpointInputs = {
	advisoriesList: AdvisoriesListInput;
	advisoriesElevators: AdvisoriesElevatorsInput;
	advisoriesTrainCount: AdvisoriesTrainCountInput;
	etdStation: EtdStationInput;
	routesList: RoutesListInput;
	routesInfo: RoutesInfoInput;
	stationsList: StationsListInput;
	stationsInfo: StationsInfoInput;
	stationsAccess: StationsAccessInput;
	schedulesDepartures: SchedulesDeparturesInput;
	schedulesArrivals: SchedulesArrivalsInput;
	schedulesRoutes: SchedulesRoutesInput;
	faresCalculate: FaresCalculateInput;
};

export type BartEndpointOutputs = {
	advisoriesList: AdvisoriesListResponse;
	advisoriesElevators: AdvisoriesElevatorsResponse;
	advisoriesTrainCount: AdvisoriesTrainCountResponse;
	etdStation: EtdStationResponse;
	routesList: RoutesListResponse;
	routesInfo: RoutesInfoResponse;
	stationsList: StationsListResponse;
	stationsInfo: StationsInfoResponse;
	stationsAccess: StationsAccessResponse;
	schedulesDepartures: SchedulesDeparturesResponse;
	schedulesArrivals: SchedulesArrivalsResponse;
	schedulesRoutes: SchedulesRoutesResponse;
	faresCalculate: FaresCalculateResponse;
};

export const BartEndpointInputSchemas = {
	advisoriesList: AdvisoriesListInputSchema,
	advisoriesElevators: AdvisoriesElevatorsInputSchema,
	advisoriesTrainCount: AdvisoriesTrainCountInputSchema,
	etdStation: EtdStationInputSchema,
	routesList: RoutesListInputSchema,
	routesInfo: RoutesInfoInputSchema,
	stationsList: StationsListInputSchema,
	stationsInfo: StationsInfoInputSchema,
	stationsAccess: StationsAccessInputSchema,
	schedulesDepartures: SchedulesDeparturesInputSchema,
	schedulesArrivals: SchedulesArrivalsInputSchema,
	schedulesRoutes: SchedulesRoutesInputSchema,
	faresCalculate: FaresCalculateInputSchema,
} as const;

export const BartEndpointOutputSchemas = {
	advisoriesList: AdvisoriesListResponseSchema,
	advisoriesElevators: AdvisoriesElevatorsResponseSchema,
	advisoriesTrainCount: AdvisoriesTrainCountResponseSchema,
	etdStation: EtdStationResponseSchema,
	routesList: RoutesListResponseSchema,
	routesInfo: RoutesInfoResponseSchema,
	stationsList: StationsListResponseSchema,
	stationsInfo: StationsInfoResponseSchema,
	stationsAccess: StationsAccessResponseSchema,
	schedulesDepartures: SchedulesDeparturesResponseSchema,
	schedulesArrivals: SchedulesArrivalsResponseSchema,
	schedulesRoutes: SchedulesRoutesResponseSchema,
	faresCalculate: FaresCalculateResponseSchema,
} as const;
