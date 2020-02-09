// SELECTORS
const mainTextSelector =
  "div.a-row.a-spacing-small.review-data > span > div > div.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content > span";
const titleTextSelector = ".review-title.review-title-content > span";
const authorNoUrlNameSelector =
  "div:nth-child(1) > div > div.a-profile-content > span.a-profile-name";
const authorUrlSelector = "div:nth-child(1) > a";
const authorNameSelector =
  "div:nth-child(1) > a > div.a-profile-content > span.a-profile-name";
const geoDateSelector = "span.review-date";
const rateSelector = "i.review-rating > span";
const helpfulSelector =
  "div.a-row.review-comments.cr-vote-action-bar > span.cr-vote > div.a-row.a-spacing-small > span";
const videoSelector = ".video-block";
const imageCountSelector = "div.review-image-tile-section > img";

// REGEX
const authorUrlRegex = /.*\/(.*)\/(.*)$/;
const geoDateRegex = /Reviewed in (.*) on (.*)/;
const rateRegex = /(.*) out of 5 stars/;
const helpfulRegex = /(.*) (people|person) found this helpful/;

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

function getHelpfulness(commentElement) {
  let helpfulElement = commentElement.querySelector(helpfulSelector);
  if (!helpfulElement) {
    return undefined;
  }
  let helpfulText = helpfulElement.innerText;
  let [, helpful, peopleOrPerson] = helpfulText.match(helpfulRegex);
  return peopleOrPerson === "people" ? parseInt(helpful, 10) : 1;
}

function hasVideo(commentElement) {
  return commentElement.querySelector(videoSelector) ? true : false;
}

function getPhotosCount(commentElement) {
  const photos = [...commentElement.querySelectorAll(imageCountSelector)];
  return photos.length > 0 ? photos.length : 0;
}

const comments = rawComments.map(commentElement => {
  const author = getAuthor(commentElement);
  const { geo, date } = getGeoDate(commentElement);
  const rate = getRate(commentElement);
  const helpfulness = getHelpfulness(commentElement);
  const mainText = commentElement.querySelector(mainTextSelector).innerText;
  const titleText = commentElement.querySelector(titleTextSelector).innerText;
  const mediaAssets = {
    video: hasVideo(commentElement),
    photos: getPhotosCount(commentElement)
  };
  // console.log("comment: ", {
  //   element: commentElement,
  //   author,
  //   titleText,
  //   mainText,
  //   rate,
  //   date,
  //   geo,
  //   helpfulness,
  //   mediaAssets
  // });
  return {
    element: commentElement,
    author,
    titleText,
    mainText,
    rate,
    date,
    geo,
    helpfulness,
    mediaAssets
  };
});

// SEND MESSAGE
let message = { comments: comments };

chrome.runtime.sendMessage(message, function(result) {
  console.log(result);
});
