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
