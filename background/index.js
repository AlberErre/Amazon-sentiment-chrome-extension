// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

// IMPORTANT: hostEquals must be explicit domain such as www.amazon.com, non-explicit domains do not work (*.amazon.com)
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.amazon.com" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.amazon.co.uk" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.amazon.ca" }
          }),
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: "www.amazon.com.au" }
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});

function saveCommentsOnDB(rawComments) {
  // remove element and elementId data from rawComments
  const comments = rawComments.map(rawComment => {
    const { element, elementId, ...comment } = rawComment;
    return comment;
  });
  const url = "http://api.fakers.ai/amazon-model/save";
  fetch(url, {
    method: "POST",
    body: JSON.stringify({ comments }), // data can be `string` or {object}!
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .catch(error => console.error("Error on POST:", error));
}

// onMessage needs to return true when handling async response (sendResponse)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!request.comments || request.comments.length === 0) {
    return false;
  }
  saveCommentsOnDB(request.comments);
  return true;
});
