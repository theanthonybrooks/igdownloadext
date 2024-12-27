function sendMessage(action) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs) => {
      const tab = tabs[0]
      if (tab && tab.id) {
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            function: () =>
              !!window.__contentScriptInjected,
          })
          .then(([result]) => {
            if (!result.result) {
              chrome.scripting
                .executeScript({
                  target: { tabId: tab.id },
                  files: ["content.js"],
                })
                .then(() => {
                  sendActionMessage(
                    tab.id,
                    action
                  )
                })
            } else {
              sendActionMessage(tab.id, action)
            }
          })
      }
    }
  )
}

function sendActionMessage(tabId, action) {
  chrome.tabs.sendMessage(
    tabId,
    { action },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error:",
          chrome.runtime.lastError.message
        )
      } else if (response && response.success) {
        if (action === "copy") {
          handleCopySuccess()
        }
      }
    }
  )
}

function handleCopySuccess() {
  const copyBtn =
    document.getElementById("copyBtn")
  const originalIcon =
    copyBtn.querySelector("i").className
  copyBtn.querySelector("i").className =
    "fa-solid fa-check"

  setTimeout(() => {
    copyBtn.querySelector("i").className =
      originalIcon
  }, 2000)
}

document
  .getElementById("downloadBtn")
  .addEventListener("click", () =>
    sendMessage("download")
  )
document
  .getElementById("copyBtn")
  .addEventListener("click", () =>
    sendMessage("copy")
  )
