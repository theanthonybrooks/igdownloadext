document
  .getElementById("checkButton")
  .addEventListener("click", () => {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (tabs) {
        if (tabs && tabs[0]) {
          const pageUrl = tabs[0].url
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: () => {
              chrome.runtime.sendMessage({
                message: "check_images",
                pageUrl: window.location.href,
              })
            },
          })
          chrome.runtime.onMessage.addListener(
            function (
              request,
              sender,
              sendResponse
            ) {
              if (
                request.message ===
                "no_image_found"
              ) {
                alert(
                  "No 150x150 profile picture image found on this page."
                )
              }
            }
          )
        } else {
          alert("No active tab found.")
        }
      }
    )
  })
