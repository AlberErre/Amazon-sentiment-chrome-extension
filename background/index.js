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

function evaluateComment(comment) {
  // TODO: run ML algorithm here!

  return Math.round(Math.random()) === 1 ? "positive" : "negative";
}

// onMessage needs to return true when handling async response (sendResponse)
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (!request.comments || request.comments.length === 0) {
    sendResponse(undefined);
    return false;
  }

  const response = request.comments.map(comment => {
    return {
      elementId: comment.elementId,
      sentiment: evaluateComment(comment)
    };
  });

  console.log("response", response);

  sendResponse(response);
  // sendResponse(request);
  //console.log("request.comments", request.comments);

  return true;
  //     if (message == “changeColor”){
  //   chrome.tabs.executeScript({
  //     code: 'document.body.style.backgroundColor="orange"'
  //   });
  // }
});
