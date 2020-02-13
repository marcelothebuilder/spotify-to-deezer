import { SpotifyMediaInfoHandler } from './SpotifyMediaInfoHandler';
import { SpotifyCrawler } from './SpotifyCrawler';
import { DeezerSearch } from './DeezerSearch';

const BUTTON_ID = "open-in-deezer-button";
const TAB_ID = "open-in-deezer-tab";

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

    browser.contextMenus.create({
        id: TAB_ID,
        title: "Open in Deezer",
        documentUrlPatterns: [
            'https://open.spotify.com/track/*',
            'https://open.spotify.com/artist/*',
            'https://open.spotify.com/album/*',
            'https://open.spotify.com/playlist/*',
        ],
        contexts: ["tab"]
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
        console.log(info);
        if ([BUTTON_ID, TAB_ID].indexOf(info.menuItemId) === -1)
            return;

        const urlString = info.linkUrl || info.pageUrl;
        handleUrl(urlString);
    })
}

// DeezerSearch is single instance, we may have to authenticate in a future api change.
const deezer = new DeezerSearch();

registerContextMenuButton(deezer);
