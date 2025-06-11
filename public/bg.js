chrome.action.onClicked.addListener(() => {
 if (chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
      console.log("bg.js: chrome.runtime.openOptionsPage() called.");
    } else {
      console.error("bg.js: chrome.runtime or chrome.runtime.openOptionsPage is not available.");
    }
});
