chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "cleanAndRefresh") {
    cleanAndRefresh(request.tab);
  } else if (request.action === "fullProcess") {
    fullProcess(request.tab);
  }
});

const cleanAndRefresh = (tab) => {
  const url = new URL(tab.url);
  const origin = url.origin;

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

  const removalOptions = {
    origins: [origin],
    since: 0,
  };

  chrome.browsingData.remove(removalOptions, dataToRemove, () => {
    chrome.notifications.create(
      {
        type: "basic",
        iconUrl: "icons/icon48.png",
        title: "Abecik Cuci Web",
        message: `Data ${origin} sudah di cuci oleh Abecik`,
      },
      () => {
        chrome.tabs.reload(tab.id);
        console.log("Cuci dan refresh completed");
      }
    );
  });
};

const fullProcess = (tab) => {
  let iterations = 0;
  const maxIterations = 100000;

  const cleanSiteDataAndClickButton = (tab) => {
    const url = new URL(tab.url);
    const origin = url.origin;

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

    const removalOptions = {
      origins: [origin],
      since: 0,
    };

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const clickButtonMultipleTimes = (selector, times, interval) => {
            const button = document.querySelector(selector);
            if (button) {
              let clickCount = 0;
              const clickInterval = setInterval(() => {
                button.click();
                clickCount++;
                if (clickCount >= times) {
                  clearInterval(clickInterval);
                  console.log(`Button clicked ${times} times.`);
                }
              }, interval);
            } else {
              console.log("Button not found.");
            }
          };

          // Call the function to click the button 10 times with a 1ms interval
          clickButtonMultipleTimes(
            ".wlc-city-hero__vote-btn.btn.btn--vote",
            10,
            1
          );
        },
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          setTimeout(() => {
            chrome.browsingData.remove(removalOptions, dataToRemove, () => {
              chrome.notifications.create(
                {
                  type: "basic",
                  iconUrl: "icons/icon48.png",
                  title: "Abecik dah cuci",
                  message: `Data ${origin} sudah di cuci oleh Abecik`,
                },
                () => {
                  iterations++;

                  if (iterations < maxIterations) {
                    chrome.tabs.reload(tab.id, () => {
                      setTimeout(() => cleanSiteDataAndClickButton(tab), 5000);
                    });
                  } else {
                    console.log("Prosess 100000 kali run dah setel");
                  }
                }
              );
            });
          }, 5000);
        }
      }
    );
  };

  cleanSiteDataAndClickButton(tab);
};
