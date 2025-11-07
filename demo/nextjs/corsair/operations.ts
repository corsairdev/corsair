import * as queriesModule from './queries'
import * as mutationsModule from './mutations'

export const queries = {
    'get all artists': queriesModule.getAllArtists,
    'get artist by id': queriesModule.getArtistById,
    'get all albums': queriesModule.getAllAlbums,
    'get album by id': queriesModule.getAlbumById,
    'get album by id with artists': queriesModule.getAlbumByIdWithArtists,
    'get albums by artist id': queriesModule.getAlbumsByArtistId,
    'get all tracks': queriesModule.getAllTracks,
    'get tracks by artist id': queriesModule.getTracksByArtistId,
    'get tracks by album id': queriesModule.getTracksByAlbumId,
    'search artists': queriesModule.searchArtists,
    'search albums': queriesModule.searchAlbums,
    'get all albums by artist id': queriesModule.getAllAlbumsByArtistId,
}

export const mutations = {
    'update artist popularity': mutationsModule.updateArtistPopularity,
    'update album type': mutationsModule.updateAlbumType,
    'toggle track explicit': mutationsModule.toggleTrackExplicit,
    'create artist': mutationsModule.createArtist,
    'create album': mutationsModule.createAlbum,
    'create track': mutationsModule.createTrack,
    'link album to artist': mutationsModule.linkAlbumToArtist,
    'link track to artist': mutationsModule.linkTrackToArtist,
    'create albums': mutationsModule.createAlbums,
    'link album to artists': mutationsModule.linkAlbumToArtists,
    'toggle track explicitssssssssssesssssss':
        mutationsModule.toggleTrackExplicitssssssssssesssssss,
    'toggle track explicitssssssssssessssssses':
        mutationsModule.toggleTrackExplicitssssssssssessssssses,
    'link album to artistss': mutationsModule.linkAlbumToArtistss,
    'toggle track explicitssssssssssessssssseseses':
        mutationsModule.toggleTrackExplicitssssssssssessssssseseses,
    'toggle track explicitssssssssssesssssssesesesess':
        mutationsModule.toggleTrackExplicitssssssssssesssssssesesesess,
    'toggle track explicitssssssssssesssssssesesesesss':
        mutationsModule.toggleTrackExplicitssssssssssesssssssesesesesss,
    'toggle track explicitssssssssssesssssssesesesesssss':
        mutationsModule.toggleTrackExplicitssssssssssesssssssesesesesssss,
    'toggle track explicitssssssssssesssssssesesesesssssss':
        mutationsModule.toggleTrackExplicitssssssssssesssssssesesesesssssss,
}
