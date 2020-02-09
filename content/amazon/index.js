let message = { comments: "I liked it" };

chrome.runtime.sendMessage(message, function(result) {
  console.log(result);
});
