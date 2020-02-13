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

export { SpotifyCrawler };