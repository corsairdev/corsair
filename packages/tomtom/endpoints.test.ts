import { z } from 'zod';
import { TomTomEndpointOutputSchemas } from './endpoints/types';
import {
	emptySearch,
	geocodeEnvelope,
	incidentDetails,
	reverseGeocodeEnvelope,
	routeEnvelope,
	searchEnvelope,
	searchResult,
	trafficFlow,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a search envelope with its summary counters', () => {
		const parsed =
			TomTomEndpointOutputSchemas.fuzzySearch.parse(searchEnvelope);
		expect(parsed.summary?.numResults).toBe(1);
		expect(parsed.summary?.totalResults).toBe(1);
		expect(parsed.summary?.fuzzyLevel).toBe(2);
	});

	it('keeps camelCase: the field is freeformAddress, not freeform_address', () => {
		const parsed =
			TomTomEndpointOutputSchemas.fuzzySearch.parse(searchEnvelope);
		expect(parsed.results[0]?.address?.freeformAddress).toBe(
			'Damrak 1, 1012 Amsterdam, Netherlands',
		);
		expect(parsed.results[0]?.address).not.toHaveProperty('freeform_address');
	});

	it('parses a search result with a null poi', () => {
		const parsed = TomTomEndpointOutputSchemas.fuzzySearch.parse({
			results: [{ ...searchResult, poi: null }],
		});
		expect(parsed.results[0]?.poi).toBeNull();
		expect(parsed.results[0]?.type).toBe('POI');
	});

	it('parses an empty search', () => {
		const parsed = TomTomEndpointOutputSchemas.fuzzySearch.parse(emptySearch);
		expect(parsed.results).toEqual([]);
		expect(parsed.summary?.numResults).toBe(0);
	});

	it('parses a geocode answer whose results may be absent', () => {
		const parsed = TomTomEndpointOutputSchemas.geocode.parse(geocodeEnvelope);
		expect(parsed.results).toHaveLength(1);
		// The schema allows results to be missing; the API omits it when nothing
		// matched rather than sending an empty array.
		expect(() =>
			TomTomEndpointOutputSchemas.geocode.parse({ summary: {} }),
		).not.toThrow();
	});

	it('parses a reverse geocode answer with a string position', () => {
		const parsed = TomTomEndpointOutputSchemas.reverseGeocode.parse(
			reverseGeocodeEnvelope,
		);
		expect(parsed.addresses[0]?.position).toBe('52.378,4.9');
		expect(parsed.addresses[0]?.address?.streetName).toBe('Damrak');
	});

	it('parses a route with its summary', () => {
		const parsed =
			TomTomEndpointOutputSchemas.calculateRoute.parse(routeEnvelope);
		expect(parsed.routes[0]?.summary?.lengthInMeters).toBe(1200);
		expect(parsed.routes[0]?.summary?.trafficDelayInSeconds).toBe(60);
		expect(parsed.formatVersion).toBe('0.0.12');
	});

	it('parses an incident with a null end time', () => {
		const parsed =
			TomTomEndpointOutputSchemas.incidentDetails.parse(incidentDetails);
		expect(parsed.incidents[0]?.properties?.endTime).toBeNull();
		expect(parsed.incidents[0]?.properties?.roadNumbers).toEqual(['A10']);
	});

	it('parses a traffic flow segment', () => {
		const parsed = TomTomEndpointOutputSchemas.trafficFlow.parse(trafficFlow);
		expect(parsed.flowSegmentData?.currentSpeed).toBe(45);
		expect(parsed.flowSegmentData?.roadClosure).toBe(false);
	});

	it('parses the tile body as a string', () => {
		expect(TomTomEndpointOutputSchemas.trafficTile.parse('png-bytes')).toBe(
			'png-bytes',
		);
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a search body whose results is an object', () => {
		expect(() =>
			TomTomEndpointOutputSchemas.fuzzySearch.parse({ results: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a search result with a missing position type', () => {
		expect(() =>
			TomTomEndpointOutputSchemas.fuzzySearch.parse({
				results: [{ position: { lat: '52', lon: 4.9 } }],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a route body with no routes array', () => {
		expect(() =>
			TomTomEndpointOutputSchemas.calculateRoute.parse({ formatVersion: '1' }),
		).toThrow(z.ZodError);
	});

	it('rejects an incidents body whose incidents is missing', () => {
		expect(() => TomTomEndpointOutputSchemas.incidentDetails.parse({})).toThrow(
			z.ZodError,
		);
	});

	it('rejects a traffic flow whose speed is a string', () => {
		expect(() =>
			TomTomEndpointOutputSchemas.trafficFlow.parse({
				flowSegmentData: { currentSpeed: '45' },
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a tile body that is an object', () => {
		expect(() =>
			TomTomEndpointOutputSchemas.trafficTile.parse({ data: 'x' }),
		).toThrow(z.ZodError);
	});
});
