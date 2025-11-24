const steamIdMatch = location.pathname.match(/^\/profiles\/(\d+)/);

if (steamIdMatch) {
    const steamId = steamIdMatch[1];

    chrome.runtime.sendMessage({
        type: "steamIdDetected",
        steamId: steamId
    });
} else {
    const vanityName = location.pathname.match(/^\/id\/([^/]+)/);

    if(vanityName) {
        chrome.runtime.sendMessage({
            type: "resolveVanity",
            vanity: vanityName[1]
        }, (response) => {
            if (response.steamId) {
                chrome.runtime.sendMessage({
                    type: "steamIdDetected",
                    steamId: response.steamId
                });
            }
        });
    }
}
