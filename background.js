chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    // Inject the content script into the active tab
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      })
      .then(() => {
        // Send a message to the content script after injection
        chrome.tabs.sendMessage(tab.id, {
          action: "check_and_copy",
        })
      })
      .catch((err) => {
        console.error(
          "Failed to inject content script:",
          err
        )
      })
  }
})

chrome.runtime.onMessage.addListener(function (
  request,
  sender,
  sendResponse
) {
  if (
    request.message !== "nimf" &&
    request.message !== "imf"
  ) {
    console.log(
      `Request message: ${request.message}, request.url: ${request.url}, request.filename: ${request.filename}`
    )

    const filename = request.filename
      ? request.filename
      : "profile_picture.png"
    console.log("filename: ", request.filename)

    // Download the file
    chrome.downloads.download({
      url: request.url,
      filename: `images/sal/${filename}`,
    })
  } else if (request.message === "nimf") {
    console.log(
      "No profile picture image found on this page."
    )
  } else if (request.message === "imf") {
    console.log(
      "Profile picture image found on this page."
    )
  }
})
