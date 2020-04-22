export const setupTabSet = function (tabs) {
  const tabsArray = Array.from(tabs);
  let arrowCount = 0;

  function arrowKey(event) {
    if (event.keyCode === 37) { // If left arrow key
      if (tabsArray.indexOf(event.target) <= 0) {
        arrowCount = 2;
      } else {
        arrowCount--;
      }
    } else if (event.keyCode === 39) {
      if (tabsArray.indexOf(event.target) >= 2) {
        arrowCount = 0;
      } else {
        arrowCount++;
      }
    }

    tabs[arrowCount].focus();
    tabs[arrowCount].click();
  }

  // Add arrow key loop to tabs
  tabs.forEach((currentNode) => {
    currentNode.addEventListener('keydown', arrowKey);
    currentNode.addEventListener('click', function () {
      arrowCount = tabsArray.indexOf(this);
    });
  });
};
