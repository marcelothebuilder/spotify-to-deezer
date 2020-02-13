import { SpotifyMediaInfoHandler } from './SpotifyMediaInfoHandler';
import { SpotifyCrawler } from './SpotifyCrawler';
import { DeezerSearch } from './DeezerSearch';

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

// DeezerSearch is single instance, we may have to authenticate in a future api change.
const deezer = new DeezerSearch();

registerContextMenuButton(deezer);
