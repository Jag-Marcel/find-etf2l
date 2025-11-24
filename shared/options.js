// Load existing key into the input
chrome.storage.local.get("steamApiKey", (data) => {
    if (data.steamApiKey) {
        document.getElementById("apiKeyInput").value = data.steamApiKey;
    }
});

chrome.storage.local.get({ autoOpen: true }, (data) => {
    document.getElementById("autoOpen").checked = data.autoOpen;
});

document.getElementById("saveBtn").addEventListener("click", () => {
    const key = document.getElementById("apiKeyInput").value.trim();
    const autoOpen = document.getElementById("autoOpen").checked;

    chrome.storage.local.set({ steamApiKey: key, autoOpen }, () => {
        document.getElementById("status").textContent = "Saved!";
        setTimeout(() => {
            document.getElementById("status").textContent = "";
        }, 4000);
    });
});
