(function() {
  const getMessage = (id) => {
    try {
      return browser.i18n.getMessage(id) || id.replace(/_/g, " ");
    } catch (e) {
      return id.replace(/_/g, " ");
    }
  };

  const initMenus = () => {
    browser.contextMenus.create({
      id: "save-to-wayback",
      title: getMessage("contextMenu_saveToWayback"),
      contexts: ["page", "link"]
    }, () => { if (browser.runtime.lastError) {} });

    browser.contextMenus.create({
      id: "save-to-archive-is",
      title: getMessage("contextMenu_saveToArchiveIs"),
      contexts: ["page", "link"]
    }, () => { if (browser.runtime.lastError) {} });

    browser.contextMenus.create({
      id: "save-to-ghostarchive",
      title: getMessage("contextMenu_saveToGhostarchive"),
      contexts: ["page", "link"]
    }, () => { if (browser.runtime.lastError) {} });

    browser.contextMenus.create({
      id: "copy-markdown-link",
      title: getMessage("contextMenu_copyMarkdownLink"),
      contexts: ["page", "link"]
    }, () => { if (browser.runtime.lastError) {} });
  };

  browser.runtime.onInstalled.addListener(initMenus);
  browser.runtime.onStartup.addListener(initMenus);
  initMenus();

  browser.contextMenus.onClicked.addListener((info, tab) => {
    const url = info.linkUrl || info.pageUrl;
    if (!url) return;

    if (info.menuItemId === "save-to-wayback") {
      browser.tabs.create({ url: "https://web.archive.org/save/" + url });
    } else if (info.menuItemId === "save-to-archive-is") {
      browser.tabs.create({ url: "https://archive.is/?run=1&url=" + encodeURIComponent(url) });
    } else if (info.menuItemId === "save-to-ghostarchive") {
      browser.tabs.create({ url: "https://ghostarchive.org/copy/" + url });
    } else if (info.menuItemId === "copy-markdown-link") {
      const title = tab.title || "link";
      const markdown = "[" + title + "](" + url + ")";

      // Use clipboard API if available in background, or inject script
      browser.tabs.executeScript(tab.id, {
        code: "navigator.clipboard.writeText(" + JSON.stringify(markdown) + ")"
      });
    }
  });
})();

  // Additional engine logic - redirect defunct cache searches to Wayback Machine
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.id === "search_additional") {
      const { engine, url } = message;
      let searchUrl = "";
      if (engine === "bing" || engine === "google" || engine === "baidu") {
        // Redirect to Wayback Machine since cache operators are no longer reliable
        searchUrl = "https://web.archive.org/web/*/" + encodeURIComponent(url);
      }

      if (searchUrl) {
        browser.tabs.create({ url: searchUrl });
      }
    }
  });
