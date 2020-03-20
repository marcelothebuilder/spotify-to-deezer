
export class DeezerSearch {
  searchArtist(artist) {
    const deezerRequest = new Request(`https://api.deezer.com/search/artist?order=RANKING&q=artist:"${artist}"`);
    return fetch(deezerRequest)
      .then((response) => response.json())
      .then((response) => response.data)
      .then((artists) => {
        if (!artists.length) {
          return Promise.reject();
        }

        return artists[0];
      });
  }


  searchAlbum(albumTitle, artist) {
    const deezerRequest = new Request(`https://api.deezer.com/search/album?order=RANKING&q=artist:"${artist}" album:"${albumTitle}"`);
    return fetch(deezerRequest)
      .then((response) => response.json())
      .then((response) => response.data)
      .then((albums) => {
        if (!albums.length) {
          return Promise.reject();
        }

        const album = albums[0];

        return album;
      });
  }


  searchSong(trackTitle, artist) {
    const deezerRequest = new Request(`https://api.deezer.com/search/track?order=RANKING&q=artist:"${artist}" track:"${trackTitle}"`);
    return fetch(deezerRequest)
      .then((response) => response.json())
      .then((response) => response.data)
      .then((songs) => {
        if (!songs.length) {
          return Promise.reject();
        }

        const song = songs[0];
        return song;
      });
  }

  searchPlaylist(playlistName) {
    const deezerRequest = new Request(`https://api.deezer.com/search/playlist?strict=on&q=${playlistName}`);

    return fetch(deezerRequest)
      .then((response) => response.json())
      .then((response) => response.data)
      .then((playlists) => playlists.filter((playlist) => playlist.public))
      .then((playlists) => {
        if (!playlists.length) {
          return Promise.reject();
        }

        const playlistWithSameName = playlists
          .find((playlist) => playlist.title.toLowerCase() === playlistName.toLowerCase());

        if (playlistWithSameName) {
          return playlistWithSameName;
        }

        const playlist = playlists[0];

        return playlist;
      });
  }
}
