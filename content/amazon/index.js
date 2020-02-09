// SELECTORS
const mainTextSelector =
  "div.a-row.a-spacing-small.review-data > span > div > div.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content > span";
const authorUrlSelector = "div:nth-child(1) > a";

// REGEX
const authorUrlRegex = /.*\/(.*)\/(.*)$/;

// DOM EXTRACTION
const rawComments = [...document.querySelectorAll('[id^="customer_review"]')];

function getAuthor(commentElement) {
  let authorUrl = commentElement.querySelector(authorUrlSelector).href;
  let [, userAccountPath] = authorUrl.match(authorUrlRegex);
  let [, , userId] = userAccountPath.split(".");
  return {
    url: authorUrl,
    id: userId,
    accountPath: userAccountPath
  };
}

const comments = rawComments.map(commentElement => {
  const author = getAuthor(commentElement);
  const mainText = commentElement.querySelector(mainTextSelector).innerText;
  console.log("author", author);
  console.log("mainText", mainText);
});

console.log("comments", comments);

let message = { comments: comments };

chrome.runtime.sendMessage(message, function(result) {
  console.log(result);
});
