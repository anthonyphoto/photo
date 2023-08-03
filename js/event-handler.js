'use strict';


const handleOpenMenu = () => {
  SHOULD_STOP_SHOW = true;
  const mainEl = document.getElementById('js-main');
  mainEl.style.display = 'block';
  renderCatchPhrase('portraits');
  updateCatchMobile();

  scrollMain(mainEl);
}

const handleResize = () => {
  document.getElementById('js-img-0').style.height = `${getHeight()}px`;
  document.getElementById('js-img-1').style.height = `${getHeight()}px`;
  if (IS_LANDSCAPE !== isLandscape()) {
    IS_LANDSCAPE = isLandscape();
    document.documentElement.style.fontSize = IS_LANDSCAPE ? '20px' : '16px'; 
    const mainEl = document.getElementById('js-main');
    const isMainDisplayed = window.getComputedStyle(mainEl).display === 'block';
    const page = history.state?.page;
    if (page === 'portraits' || page === 'events' || page === 'others') {
      renderMain(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      revealContentOnScroll();  
    }
  }
}

const handlePopState = () => {
  const page = history.state?.page;

  if (page === 'home') {
    resumeSlideShow();
  } else {
    renderMain(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealContentOnScroll();  
  }
}

const addScrollEvent = () => {
  window.addEventListener('scroll', throttle(revealContentOnScroll, 100));
  window.onload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealContentOnScroll();
  };
}

const removeScrollEvent = () => {
  window.removeEventListener('scroll', throttle(revealContentOnScroll, 100));
}

const handleEvent = () => {
  window.addEventListener('resize', debounce(handleResize, 500));
  window.addEventListener('popstate', handlePopState);
}
