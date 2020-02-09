// SELECTORS
const mainTextSelector =
  "div.a-row.a-spacing-small.review-data > span > div > div.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content > span";
const authorNoUrlNameSelector =
  "div:nth-child(1) > div > div.a-profile-content > span.a-profile-name";
const authorUrlSelector = "div:nth-child(1) > a";
const authorNameSelector =
  "div:nth-child(1) > a > div.a-profile-content > span.a-profile-name";
const geoDateSelector = "span.review-date";
const rateSelector = "i.review-rating > span";

// REGEX
const authorUrlRegex = /.*\/(.*)\/(.*)$/;
const geoDateRegex = /Reviewed in (.*) on (.*)/;
const rateRegex = /(.*) out of 5 stars/;

// DOM EXTRACTION
const rawComments = [...document.querySelectorAll('[id^="customer_review"]')];

function getAuthor(commentElement) {
  const authorUrlElement = commentElement.querySelector(authorUrlSelector);
  if (!authorUrlElement) {
    let authorNoUrlName = commentElement.querySelector(authorNoUrlNameSelector)
      .innerText;
    return { name: authorNoUrlName };
  }
  const authorName = commentElement.querySelector(authorNameSelector).innerText;
  const authorUrl = authorUrlElement.href;
  const [, userAccountPath] = authorUrl.match(authorUrlRegex);
  const [, , userId] = userAccountPath.split(".");
  return {
    name: authorName,
    meta: {
      url: authorUrl,
      id: userId,
      accountPath: userAccountPath
    }
  };
}

function getGeoDate(commentElement) {
  let geoDate = commentElement.querySelector(geoDateSelector).innerText;
  let [, geo, date] = geoDate.match(geoDateRegex);
  return { geo, date };
}

function getRate(commentElement) {
  let rateText = commentElement.querySelector(rateSelector).innerText;
  let [, rate] = rateText.match(rateRegex);
  return parseFloat(rate, 10);
}

const comments = rawComments.map(commentElement => {
  const author = getAuthor(commentElement);
  const { geo, date } = getGeoDate(commentElement);
  const rate = getRate(commentElement);
  const mainText = commentElement.querySelector(mainTextSelector).innerText;

  return {
    element: commentElement,
    author,
    mainText,
    geo,
    date,
    rate
  };
});

// SEND MESSAGE
let message = { comments: comments };

chrome.runtime.sendMessage(message, function(result) {
  console.log(result);
});
