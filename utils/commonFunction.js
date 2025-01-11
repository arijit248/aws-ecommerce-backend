const fetch = require("node-fetch");

async function blobUrlToBuffer(blobUrl) {
  try {
    // Fetch the blob content
    const response = await fetch(blobUrl);
    console.log(response, "fetch(blobUrl)");
    // Check if the fetch was successful
    // if (!response.ok) {
    //   throw new Error(`Failed to fetch blob: ${response.statusText}`);
    // }

    // Read the response as a buffer
    const buffer = await response.arrayBuffer();
    return buffer;
  } catch (error) {
    console.error("Error converting blob URL to buffer:", error);
    throw error;
  }
}

module.exports = { blobUrlToBuffer };
