const CitationCore = require('citation-core');

const resultNode = document.getElementById('result');
const citationFormatsNode = document.getElementById('citationFormats');
const textNode = document.getElementById('citation-URL');
const discussionIssuesLink = document.getElementById('suggestionsLink');
/**
 * Generates the citation based on the link that is passed in from tab info.
 * @param  {String} tabInfo - The url passed in as a string
 * @return {String} citationStr The citation is returned as a string
 */
function citationGeneration(tabInfo) {
  const formatOptions = new CitationCore.FormatOptions();
  const selectedStyleIndex = citationFormatsNode.selectedIndex;
  const selectedStyle = citationFormatsNode.options[selectedStyleIndex].value;

  formatOptions.url = tabInfo;
  formatOptions.style = CitationCore.styles[selectedStyle];
  CitationCore.generate(formatOptions, (citationStr, errors) => {
    // Handle completion of citation generation
    resultNode.value = citationStr;
  });
}

/**
 * A helper to get the url from the tab info if there is no user entered url.
 * @param  {List} browserURL - Contains a list of objects that hold the tab information.
 */
function generationHelper(browserURL) {
  citationGeneration(browserURL[0].url);
}

/**
 * Error handler
 * @param  {Error[]} error - The error if there is one that occurs during operation.
 */
function onError(error) {
  throw new Error(`Error: ${error}`);
}

/**
 * Get the current tabs url, then send it via a promise to citation generation.
 * @param  {string} On click of the cite button return the correct citation.
 * @return {string} The string representation of the citation
 */
document.getElementById('citation-form').addEventListener('submit', (e) => {
  e.preventDefault();
  if (textNode.value === '') {
    const gettingCurrent = browser.tabs.query({ active: true });
    gettingCurrent.then(generationHelper).catch(onError);
  }
  else {
    citationGeneration(textNode.value);
  }
}, false);

/**
 * Opens a new tab to the discussion issues for the plugin
 */
discussionIssuesLink.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("HELLO");
  var creating = browser.tabs.create({
    url:"https://github.com/mozillascience/software-citation-tools/issues?q=is%3Aopen+is%3Aissue+label%3ADiscussion+label%3ACitationPlugin"
  });
  creating.then(onCreated, onError);
}, false);

function onCreated(tab) {
  console.log(`Created new tab: ${tab.id}`)
}

function onError(error) {
  console.log(`Error: ${error}`);
}




const styles = Object.keys(CitationCore.styles);
styles.forEach((style) => {
  const newElement = document.createElement('option');
  newElement.innerHTML = style;
  newElement.value = style;
  citationFormatsNode.appendChild(newElement);
});
