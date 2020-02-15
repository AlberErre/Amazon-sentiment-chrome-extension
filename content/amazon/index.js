// HANDLE COMMENTS
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
  const id = btoa(Math.random() * Date.now() + Date.now()).substring(0, 12);
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
  return {
    element: commentElement,
    elementId: id,
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

// DRAWING METHODS
const styles = {
  position: "absolute",
  top: "0",
  right: "0",
  padding: "0.5em",
  border: "1px solid black"
};

function generateUI(score) {
  let ui = document.createElement("div");
  Object.keys(styles).forEach(key => {
    ui.style.setProperty(key, styles[key]);
  });
  const uiContent = `<span>${score >= 0.5 ? "Positive" : "Negative"} Comment ${
    score >= 0.5 ? "😄" : "😡"
  }</span>`;
  ui.innerHTML = uiContent;
  return ui;
}

function drawComments(comments) {
  if (!comments || comments.length === 0) return;
  const sentimentComments = comments.map(comment => {
    const { score } = sentimentModel.predict(comment.mainText);
    comment.element.style.setProperty("position", "relative");
    comment.element.appendChild(generateUI(score));
    return { ...comment, predictedSentiment: score };
  });
  // STORE ON DB
  let message = { comments: sentimentComments };
  chrome.runtime.sendMessage(message);
}

// HANDLE MODEL
const sentimentModel = ml5.sentiment("movieReviews", () => {
  drawComments(comments);
});
