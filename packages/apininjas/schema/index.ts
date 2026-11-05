import {
	ApiNinjasAircraftEntity,
	ApiNinjasAirlineEntity,
	ApiNinjasAirportEntity,
	ApiNinjasAnimalEntity,
	ApiNinjasCityEntity,
	ApiNinjasCountryEntity,
	ApiNinjasEmojiEntity,
	ApiNinjasPlanetEntity,
	ApiNinjasSp500Entity,
	ApiNinjasStarEntity,
	ApiNinjasStockExchangeEntity,
	ApiNinjasUniversityEntity,
	ApiNinjasVehicleEntity,
} from './database';

export const ApiNinjasSchema = {
	version: '1.0.0',
	entities: {
		airports: ApiNinjasAirportEntity,
		airlines: ApiNinjasAirlineEntity,
		aircraft: ApiNinjasAircraftEntity,
		vehicles: ApiNinjasVehicleEntity,
		countries: ApiNinjasCountryEntity,
		cities: ApiNinjasCityEntity,
		universities: ApiNinjasUniversityEntity,
		stockExchanges: ApiNinjasStockExchangeEntity,
		sp500: ApiNinjasSp500Entity,
		emoji: ApiNinjasEmojiEntity,
		animals: ApiNinjasAnimalEntity,
		planets: ApiNinjasPlanetEntity,
		stars: ApiNinjasStarEntity,
	},
} as const;
