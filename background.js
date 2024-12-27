chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.url && request.filename) {
      chrome.downloads.download(
        {
          url: request.url,
          filename: `images/sal/${request.filename}`,
        },
        (downloadId) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Download failed:",
              chrome.runtime.lastError.message
            )
            sendResponse({
              success: false,
              message: "Download failed.",
            })
          } else {
            console.log(
              "Download started, ID:",
              downloadId
            )
            sendResponse({
              success: true,
              message: "Download initiated.",
            })
          }
        }
      )

      return true
    }
  }
)
