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

// onMessage needs to return true when handling async response (sendResponse)
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("message", message);
  sendResponse(message);
  return true;
  //     if (message == “changeColor”){
  //   chrome.tabs.executeScript({
  //     code: 'document.body.style.backgroundColor="orange"'
  //   });
  // }
});
