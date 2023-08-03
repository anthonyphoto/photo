'use strict';

const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// desktop screen or landscape mode of mobile devices
const isLandscape = () => getWidth() >= 1200 || getWidth() > getHeight();

// applied to resize event
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(args), delay);
  };
}

// applied to scroll event
const throttle = (fn, ms) => {
  let run = true;

  return (...args) => {
    if (!run) return;
    fn(...args);
    run = false;
    setTimeout(() => {
      run = true;
    }, ms)
  }
}

// Function to check if an element is in the viewport
const isElementInViewport = element => {
  const rect = element.getBoundingClientRect();
  const screenHeight = getHeight();
  // console.log("AK: rec", rect.height, element)
  // console.log("AK: rec", rect.top, rect.bottom, element)

  // make sure to check height to ensure images are fully loaded
  return (rect.height > 100 && rect.top >= -50 && rect.top <= screenHeight * 0.80);
}

// Function to reveal hidden content when it's in the viewport
const revealContentOnScroll = () => {
  const hiddenContents = document.querySelectorAll('.hidden-content');
  hiddenContents.forEach((content) => {
    if (isElementInViewport(content)) {
      content.style.opacity = '1';
      content.style.transform = 'translateY(0)';
    }
  });
}
