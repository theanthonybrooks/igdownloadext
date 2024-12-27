function checkAndDownloadImage() {
  const images = document.querySelectorAll("img")
  let foundImage = false

  for (const img of images) {
    if (
      img.alt &&
      img.alt
        .toLowerCase()
        .includes("profile picture") &&
      img.width === 150 &&
      img.height === 150
    ) {
      foundImage = true

      const imageUrl = img.src
      let filename = img.alt
        .split("'s profile picture")
        .join("")

      // Send the image details to the background script
      chrome.runtime.sendMessage({
        message: filename,
        url: imageUrl,
        filename: `${filename}.jpg`,
      })

      return // Exit after finding the first matching image
    }
  }

  if (!foundImage) {
    chrome.runtime.sendMessage({
      message: "nimf",
    })
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.action === "check_and_copy") {
      checkAndDownloadImage()
    }
  }
)
