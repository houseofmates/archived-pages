(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const btnSaveAll = document.getElementById('btn-save-all');
    const btnWayback = document.getElementById('btn-save-wayback');
    const btnArchiveIs = document.getElementById('btn-save-archiveis');

    const getUrl = async () => {
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      return tab ? tab.url : null;
    };

    if (btnSaveAll) {
      btnSaveAll.addEventListener('click', async () => {
        const url = await getUrl();
        if (url) {
          browser.tabs.create({ url: "https://web.archive.org/save/" + url });
          browser.tabs.create({ url: "https://archive.is/?run=1&url=" + encodeURIComponent(url) });
          browser.tabs.create({ url: "https://ghostarchive.org/copy/" + url });
        }
      });
    }

    if (btnWayback) {
      btnWayback.addEventListener('click', async () => {
        const url = await getUrl();
        if (url) browser.tabs.create({ url: "https://web.archive.org/save/" + url });
      });
    }

    if (btnArchiveIs) {
      btnArchiveIs.addEventListener('click', async () => {
        const url = await getUrl();
        if (url) browser.tabs.create({ url: "https://archive.is/?run=1&url=" + encodeURIComponent(url) });
      });
    }
  });
})();

  // staggered reveal for dynamic items
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const items = document.querySelectorAll('.list-items > *');
        items.forEach((item, index) => {
          item.style.setProperty('--item-index', index);
        });
      }
    });
  });

  const target = document.body;
  if (target) {
    observer.observe(target, { childList: true, subtree: true });
  }

  const btnGoogle = document.getElementById('btn-cache-google');
  const btnBing = document.getElementById('btn-cache-bing');

  if (btnGoogle) {
    btnGoogle.addEventListener('click', async () => {
      const url = await getUrl();
      if (url) browser.runtime.sendMessage({ id: "search_additional", engine: "google", url: url });
    });
  }

  if (btnBing) {
    btnBing.addEventListener('click', async () => {
      const url = await getUrl();
      if (url) browser.runtime.sendMessage({ id: "search_additional", engine: "bing", url: url });
    });
  }
