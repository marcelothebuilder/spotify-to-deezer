
const BUTTON_ID = "open-in-deezer";

function registerContextMenuButton(deezer) {
    browser.contextMenus.create({
        id: BUTTON_ID,
        title: "Open in Deezer",
        targetUrlPatterns: [
            'https://open.spotify.com/track/*',
            'https://open.spotify.com/artist/*',
            'https://open.spotify.com/album/*',
            'https://open.spotify.com/playlist/*',
        ],
        contexts: ["link"]
    });

    function handleUrl(urlString) {
        new SpotifyCrawler()
            .fetchMediaInfo(urlString)
            .then(mediaInfo => {
                new SpotifyMediaInfoHandler(deezer)
                    .handleMediaInfo(mediaInfo);
            });
    }

    browser.contextMenus.onClicked.addListener((info) => {
        if (info.menuItemId !== BUTTON_ID)
            return;

        handleUrl(info.linkUrl);
    })
}

function openUrl(url) {
    browser.tabs.create({
        url
    });
}

function openDeezerSearchTab(...terms) {
    const termsAsParams = terms.join(' ').replace('?', '');
    const url = `https://www.deezer.com/search/${termsAsParams}`;
    openUrl(url);
}


class SpotifyMediaInfoHandler {

    constructor(deezer) {
        Object.assign(this, { deezer });
    }

    handleMediaInfo(mediaInfo) {
        const type = mediaInfo.type;

        switch (type) {
            case SpotifyCrawler.MediaType.SONG:
                return this._handleSong(mediaInfo);

            case SpotifyCrawler.MediaType.ALBUM:
                return this._handleAlbum(mediaInfo);

            case SpotifyCrawler.MediaType.MUSICIAN:
                return this._handleArtist(mediaInfo);

            case SpotifyCrawler.MediaType.PLAYLIST:
                return this._handlePlaylist(mediaInfo);

        }
    }

    _handleArtist(mediaInfo) {
        return this.deezer.searchArtist(mediaInfo.name)
            .then(artist => {
                Notificator.showOpeningArtist(artist.name);
                openUrl(artist.link);
            })
            .catch(() => {
                Notificator.showArtistNotFound(mediaInfo.name);
                openDeezerSearchTab(mediaInfo.name);
            });
    }

    _handleAlbum(mediaInfo) {
        return this.deezer.searchAlbum(mediaInfo.title, mediaInfo.artist)
            .then(album => {
                Notificator.showOpeningAlbum(album.title, album.artist.name);
                openUrl(album.link);
            })
            .catch(() => {
                Notificator.showAlbumNotFound(mediaInfo.title, mediaInfo.artist);
                openDeezerSearchTab(mediaInfo.title, mediaInfo.artist);
            });
    }

    _handleSong(mediaInfo) {
        return this.deezer.searchSong(mediaInfo.title, mediaInfo.artist)
            .then(song => {
                Notificator.showOpeningTrack(song.title, song.artist.name, song.album.title);
                openUrl(song.link);
            })
            .catch(() => {
                Notificator.showTrackNotFound(mediaInfo.title, mediaInfo.artist);
                openDeezerSearchTab(mediaInfo.title, mediaInfo.artist);
            });
    }

    _handlePlaylist(mediaInfo) {
        return this.deezer.searchPlaylist(mediaInfo.name)
            .then(playlist => {
                Notificator.showOpeningPlaylist(playlist.title);
                openUrl(playlist.link);
            })
            .catch(() => {
                Notificator.showPlaylistNotFound(mediaInfo.name);
                openDeezerSearchTab(mediaInfo.name);
            });
    }
}


class Notificator {


    static showOpeningPlaylist(playlist) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Opening playlist ${playlist}`
        });
    }

    static showPlaylistNotFound(playlist) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Playlist ${playlist} not found! :(`
        });
    }

    static showOpeningArtist(artist) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Opening artist ${artist}`
        });
    }

    static showArtistNotFound(artist) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Artist ${artist} not found! :(`
        });
    }

    static showOpeningAlbum(artist, album) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Opening album ${album} - ${artist}`
        });
    }

    static showAlbumNotFound(artist, album) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Album ${album} - ${artist} not found! :(`
        });
    }


    static showOpeningTrack(track, artist, album) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Opening track ${track} - ${artist} (${album} album)`
        });
    }


    static showTrackNotFound(track, artist) {
        browser.notifications.create({
            "type": "basic",
            "iconUrl": browser.extension.getURL(Notificator.IconURL),
            "title": 'Spotify to Deezer',
            "message": `Track ${track} - ${artist} not found! :(`
        });
    }

}

Notificator.IconURL = "icons/spot-x-deezer-400x400.png";


class DeezerSearch {

    searchArtist(artist) {
        const deezerRequest = new Request(`https://api.deezer.com/search/artist?order=RANKING&q=artist:"${artist}"`);
        return fetch(deezerRequest)
            .then(response => response.json())
            .then(response => response.data)
            .then(artists => {
                if (!artists.length) {
                    return Promise.reject();
                }

                const artist = artists[0];

                return artist;
            })
    }


    searchAlbum(albumTitle, artist) {
        const deezerRequest = new Request(`https://api.deezer.com/search/album?order=RANKING&q=artist:"${artist}" album:"${albumTitle}"`);
        return fetch(deezerRequest)
            .then(response => response.json())
            .then(response => response.data)
            .then(albums => {
                if (!albums.length) {
                    return Promise.reject();
                }

                const album = albums[0];

                return album;
            })
    }


    searchSong(trackTitle, artist) {
        const deezerRequest = new Request(`https://api.deezer.com/search/track?order=RANKING&q=artist:"${artist}" track:"${trackTitle}"`);
        return fetch(deezerRequest)
            .then(response => response.json())
            .then(response => response.data)
            .then(songs => {
                if (!songs.length) {
                    return Promise.reject();
                }

                const song = songs[0];
                return song;
            })
    }

    searchPlaylist(playlistName) {
        const deezerRequest = new Request(`https://api.deezer.com/search/playlist?strict=on&q=${playlistName}`);

        return fetch(deezerRequest)
            .then(response => response.json())
            .then(response => response.data)
            .then(playlists => playlists.filter(playlist => playlist.public))
            .then(playlists => {
                if (!playlists.length) {
                    return Promise.reject();
                }

                const playlistWithSameName = playlists
                    .find(playlist => playlist.title.toLowerCase() === playlistName.toLowerCase());

                if (playlistWithSameName) {
                    return playlistWithSameName;
                }

                const playlist = playlists[0];

                return playlist;
            })
    }
}


class SpotifyCrawler {

    fetchMediaInfo(url) {
        const myRequest = new Request(url);

        return fetch(myRequest)
            .then(response => response.text())
            .then(response => this._handleHTML(response))
    }


    _handleHTML(spotifyHtml) {
        var parser = new DOMParser();

        var htmlDoc = parser.parseFromString(spotifyHtml, 'text/html');

        const type = htmlDoc.querySelector('meta[property="og:type"]').content;

        switch (type) {
            case 'music.song':
                return this._handleSong(htmlDoc);

            case 'music.album':
                return this._handleAlbum(htmlDoc);

            case 'music.musician':
                return this._handleMusician(htmlDoc);

            case 'music.playlist':
                return this._handlePlaylist(htmlDoc);
        }
    }


    _handleSong(html) {
        const title = html.querySelector('meta[property="og:title"]').content;
        const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content;

        return {
            type: SpotifyCrawler.MediaType.SONG,
            title,
            artist
        }
    }

    _handleAlbum(html) {
        const title = html.querySelector('meta[property="og:title"]').content;
        const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content;

        return {
            type: SpotifyCrawler.MediaType.ALBUM,
            title,
            artist
        }
    }


    _handleMusician(html) {
        const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content;

        return {
            type: SpotifyCrawler.MediaType.MUSICIAN,
            name: artist
        }
    }

    _handlePlaylist(html) {
        const playlistName = html.querySelector('meta[property="twitter:title"]').content;

        return {
            type: SpotifyCrawler.MediaType.PLAYLIST,
            name: playlistName
        }
    }

}

SpotifyCrawler.MediaType = {
    SONG: 1,
    ALBUM: 2,
    MUSICIAN: 3
}

// DeezerSearch is single instance, we may have to authenticate in a future api change.
const deezer = new DeezerSearch();

registerContextMenuButton(deezer);
