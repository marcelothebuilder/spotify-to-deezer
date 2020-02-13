
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

export { Notificator };