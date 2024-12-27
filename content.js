function handleAction(action) {
  const images = document.querySelectorAll("img")
  for (const img of images) {
    if (
      img.alt &&
      img.alt
        .toLowerCase()
        .includes("profile picture") &&
      img.width === 150 &&
      img.height === 150
    ) {
      const imageUrl = img.src
      const filename = img.alt
        .split("'s profile picture")
        .join("")

      // console.log("action", action)
      if (action === "download") {
        chrome.runtime.sendMessage({
          url: imageUrl,
          filename: `${filename}.jpg`,
        })
        return {
          success: true,
          message: "Image download initiated.",
        }
      } else if (action === "copy") {
        // console.log("Copying URL:", imageUrl)
        return copyToClipboard(imageUrl)
      }
    }
  }

  return {
    success: false,
    message: "No profile picture found.",
  }
}

function copyToClipboard(text) {
  // console.log("Attempting to copy:", text)

  const textarea =
    document.createElement("textarea")
  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()

  try {
    const successful =
      document.execCommand("copy")
    // console.log(
    //   "Fallback copy successful:",
    //   successful
    // )
    return {
      success: successful,
      message: successful
        ? "URL copied to clipboard."
        : "Fallback copy failed.",
    }
  } catch (err) {
    console.error(
      "Fallback clipboard error:",
      err
    )
    return {
      success: false,
      message: `Fallback clipboard error: ${err.message}`,
    }
  } finally {
    document.body.removeChild(textarea)
  }
}

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (
      request.action === "download" ||
      request.action === "copy"
    ) {
      const response = handleAction(
        request.action
      )
      if (response instanceof Promise) {
        response
          .then(sendResponse)
          .catch(sendResponse)
        return true
      } else {
        sendResponse(response)
      }
    }
  }
)

window.__contentScriptInjected = true
