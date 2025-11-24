chrome.action.onClicked.addListener(() => {
    if (chrome.runtime.lastDetectedSteamID) {
        chrome.tabs.create({
            url: `https://etf2l.org/search/${chrome.runtime.lastDetectedSteamID}/`,
            active: false,
        });
    }
});

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "steamIdDetected") {
        chrome.storage.local.get({ autoOpen: true }, (data) => {
            if (data.autoOpen) {
                chrome.tabs.create({
                    url: `https://etf2l.org/search/${msg.steamId}/`,
                    active: false,
                });
            } else {
                chrome.runtime.lastDetectedSteamID = msg.steamId;
            }
        });
    }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "resolveVanity") {
        chrome.storage.local.get("steamApiKey", (data) => {
            const key = data.steamApiKey;

            if (!key) {
                sendResponse({ error: "No API key set" });
                return;
            }

            fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${msg.vanity}`)
                .then(r => r.json())
                .then(json => sendResponse({ steamId: json.response.steamid }))
                .catch(() => sendResponse({ error: "API error" }));
        });

        return true; // keep message channel open for async response
    }
});
