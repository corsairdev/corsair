# @corsair-dev/spotify

Spotify plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/spotify
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `albums.get` | `spotify.api.albums.get` | `read` | Get info about an album |
| `albums.getNewReleases` | `spotify.api.albums.getNewReleases` | `read` | Get new album releases |
| `albums.getTracks` | `spotify.api.albums.getTracks` | `read` | Get tracks from an album |
| `albums.search` | `spotify.api.albums.search` | `read` | Search for albums |
| `artists.get` | `spotify.api.artists.get` | `read` | Get info about an artist |
| `artists.getAlbums` | `spotify.api.artists.getAlbums` | `read` | Get albums by an artist |
| `artists.getRelatedArtists` | `spotify.api.artists.getRelatedArtists` | `read` | Get artists related to an artist |
| `artists.getTopTracks` | `spotify.api.artists.getTopTracks` | `read` | Get top tracks for an artist |
| `artists.search` | `spotify.api.artists.search` | `read` | Search for artists |
| `library.getLikedTracks` | `spotify.api.library.getLikedTracks` | `read` | Get the current user's liked tracks |
| `myData.getFollowedArtists` | `spotify.api.myData.getFollowedArtists` | `read` | Get artists followed by the current user |
| `player.addToQueue` | `spotify.api.player.addToQueue` | `write` | Add a track to the playback queue |
| `player.getCurrentlyPlaying` | `spotify.api.player.getCurrentlyPlaying` | `read` | Get the currently playing track |
| `player.getRecentlyPlayed` | `spotify.api.player.getRecentlyPlayed` | `read` | Get recently played tracks |
| `player.pause` | `spotify.api.player.pause` | `write` | Pause playback |
| `player.resume` | `spotify.api.player.resume` | `write` | Resume playback |
| `player.setVolume` | `spotify.api.player.setVolume` | `write` | Set the playback volume |
| `player.skipToNext` | `spotify.api.player.skipToNext` | `write` | Skip to the next track |
| `player.skipToPrevious` | `spotify.api.player.skipToPrevious` | `write` | Skip to the previous track |
| `player.startPlayback` | `spotify.api.player.startPlayback` | `write` | Start playback of specified content |
| `playlists.addItem` | `spotify.api.playlists.addItem` | `write` | Add a track to a playlist |
| `playlists.create` | `spotify.api.playlists.create` | `write` | Create a new playlist |
| `playlists.get` | `spotify.api.playlists.get` | `read` | Get info about a playlist |
| `playlists.getTracks` | `spotify.api.playlists.getTracks` | `read` | Get tracks in a playlist |
| `playlists.getUserPlaylists` | `spotify.api.playlists.getUserPlaylists` | `read` | Get the current user's playlists |
| `playlists.removeItem` | `spotify.api.playlists.removeItem` | `write` | Remove a track from a playlist |
| `playlists.search` | `spotify.api.playlists.search` | `read` | Search for playlists |
| `tracks.get` | `spotify.api.tracks.get` | `read` | Get info about a track |
| `tracks.getAudioFeatures` | `spotify.api.tracks.getAudioFeatures` | `read` | Get audio features for a track |
| `tracks.search` | `spotify.api.tracks.search` | `read` | Search for tracks |

## Auth

Auth: OAuth 2.0, API key, Managed OAuth (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/spotify

## License

Apache-2.0
