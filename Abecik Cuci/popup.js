document.getElementById("clean-refresh").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.runtime.sendMessage({ action: "cleanAndRefresh", tab: activeTab });
  });
});

document.getElementById("full-process").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.runtime.sendMessage({ action: "fullProcess", tab: activeTab });
  });
});
