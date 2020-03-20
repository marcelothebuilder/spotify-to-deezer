class SpotifyCrawler {
  fetchMediaInfo(url) {
    const myRequest = new Request(url);

    return fetch(myRequest)
      .then((response) => response.text())
      .then((response) => this._handleHTML(response));
  }


  _handleHTML(spotifyHtml) {
    const parser = new DOMParser();

    const htmlDoc = parser.parseFromString(spotifyHtml, 'text/html');

    const type = htmlDoc.querySelector('meta[property="og:type"]').content;

    console.log('spotifyHtml', spotifyHtml);

    switch (type) {
      case 'music.song':
        return this._handleSong(htmlDoc);

      case 'music.album':
        return this._handleAlbum(htmlDoc);

      case 'music.musician':
        return this._handleMusician(htmlDoc);

      case 'music.playlist':
        return this._handlePlaylist(htmlDoc);

      default:
        throw Error('Unknown type');
    }
  }


  _handleSong(html) {
    const title = html.querySelector('meta[property="og:title"]').content;
    const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content;

    return {
      type: SpotifyCrawler.MediaType.SONG,
      title,
      artist,
    };
  }

  _handleAlbum(html) {
    const title = html.querySelector('meta[property="og:title"]').content;
    const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content;

    return {
      type: SpotifyCrawler.MediaType.ALBUM,
      title,
      artist,
    };
  }


  _handleMusician(html) {
    const artist = html.querySelector('meta[property="twitter:audio:artist_name"]').content
            || html.querySelector('meta[property="og:title"]').content; // fallback, the previous attribute is blank now (is spotify bugged?)

    return {
      type: SpotifyCrawler.MediaType.MUSICIAN,
      name: artist,
    };
  }

  _handlePlaylist(html) {
    const playlistName = html.querySelector('meta[property="twitter:title"]').content;

    return {
      type: SpotifyCrawler.MediaType.PLAYLIST,
      name: playlistName,
    };
  }
}

SpotifyCrawler.MediaType = {
  SONG: 1,
  ALBUM: 2,
  MUSICIAN: 3,
};

export { SpotifyCrawler };
