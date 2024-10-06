// background.js

chrome.action.onClicked.addListener((tab) => {
  // Get the URL of the current tab
  const url = new URL(tab.url);
  const origin = url.origin;

  // Define what data to remove
  const dataToRemove = {
    cache: true,
    cacheStorage: true,
    cookies: true,
    fileSystems: true,
    indexedDB: true,
    localStorage: true,
    serviceWorkers: true,
    webSQL: true,
  };

  // Set removal options to target the current origin
  const removalOptions = {
    origins: [origin],
    since: 0,
  };

  // Inject code to click the button
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: () => {
        const button = document.querySelector(
          ".wlc-city-hero__vote-btn.btn.btn--vote"
        );
        if (button) {
          button.click();
          console.log("Button clicked.");
        } else {
          console.log("Button not found.");
        }
      },
    },
    () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
      } else {
        // Wait 5 seconds before cleaning data
        setTimeout(() => {
          // Remove the data
          chrome.browsingData.remove(removalOptions, dataToRemove, () => {
            // Notify the user that data has been cleared
            chrome.notifications.create(
              {
                type: "basic",
                iconUrl: "icons/icon48.png",
                title: "Site Data Cleared",
                message:
                  "All data for ${origin} has been cleared after clicking the button.",
              },
              () => {
                // Refresh the page after cleaning data
                chrome.tabs.reload(tab.id);
              }
            );
          });
        }, 5000); // Wait for 5000 milliseconds (5 seconds)
      }
    }
  );
});
