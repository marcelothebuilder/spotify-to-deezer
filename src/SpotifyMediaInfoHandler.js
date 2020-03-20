import { SpotifyCrawler } from './SpotifyCrawler';
import { Notificator } from './Notificator';

function openUrl(url) {
  browser.tabs.create({
    url,
  });
}

function openDeezerSearchTab(...terms) {
  const termsAsParams = terms.join(' ').replace('?', '');
  const url = `https://www.deezer.com/search/${termsAsParams}`;
  openUrl(url);
}

export
class SpotifyMediaInfoHandler {
  constructor(deezer) {
    Object.assign(this, { deezer });
  }

  handleMediaInfo(mediaInfo) {
    const { type } = mediaInfo;

    switch (type) {
      case SpotifyCrawler.MediaType.SONG:
        return this._handleSong(mediaInfo);

      case SpotifyCrawler.MediaType.ALBUM:
        return this._handleAlbum(mediaInfo);

      case SpotifyCrawler.MediaType.MUSICIAN:
        return this._handleArtist(mediaInfo);

      case SpotifyCrawler.MediaType.PLAYLIST:
        return this._handlePlaylist(mediaInfo);

      default:
        throw Error('Unknown type');
    }
  }

  _handleArtist(mediaInfo) {
    console.log('_handleArtist', mediaInfo);
    return this.deezer.searchArtist(mediaInfo.name)
      .then((artist) => {
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
      .then((album) => {
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
      .then((song) => {
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
      .then((playlist) => {
        Notificator.showOpeningPlaylist(playlist.title);
        openUrl(playlist.link);
      })
      .catch(() => {
        Notificator.showPlaylistNotFound(mediaInfo.name);
        openDeezerSearchTab(mediaInfo.name);
      });
  }
}
