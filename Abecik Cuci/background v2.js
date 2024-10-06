chrome.action.onClicked.addListener((tab) => {
  // Set a variable to track the number of iterations
  let iterations = 0;
  const maxIterations = 300; // Set the number of iterations (3 in this case)

  const cleanSiteDataAndClickButton = (tab) => {
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
                  message: `All data for ${origin} has been cleared after clicking the button.`,
                },
                () => {
                  // Increment iteration counter
                  iterations++;

                  if (iterations < maxIterations) {
                    // Refresh the page after cleaning data and loop again
                    chrome.tabs.reload(tab.id, () => {
                      // Wait for the page to reload, then run the process again
                      setTimeout(() => cleanSiteDataAndClickButton(tab), 3000); // Wait 3 seconds after reload before running again
                    });
                  } else {
                    console.log("Process completed after 3 iterations.");
                  }
                }
              );
            });
          }, 8000); // Wait for 5000 milliseconds (5 seconds)
        }
      }
    );
  };

  // Start the process
  cleanSiteDataAndClickButton(tab);
});
