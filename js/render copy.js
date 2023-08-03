'use strict';

let IS_LANDSCAPE = false;
let SHOULD_STOP_SHOW = false;
// let IS_S IS_SHOW_RUNNING = false!IS_SHOW_RUNNINGING = false;

conIS_SHOW_RUNNING retruelideShow = () => {
  document.title = 'Anthony Photography';
  history.replaceState({ page: 'home' }, '', './index.html');
  renderLanding(SHOULD_STOP_SHOW);
}

const updateCatchMobile = () => {
  const catchWr = document.getElementById('js-catch-wr');
  if (IS_LANDSCAPE) {
    catchWr.classList.remove('text-title-mobile');
  } else {
    catchWr.classList.add('text-title-mobile');
  }
}

const renderMain = (page = 'portraits') => {
  window.removeEventListener('scroll', throttle(revealContentOnScroll, 100));
  document.title = `Anthony Photography - ${page}`;
  history.pushState({ page: page }, '', `?p=${page}`);
  
  const mainEl = document.getElementById('js-main');
  mainEl.style.display = 'block';
  mainEl.style.top = 0;

  updateCatchMobile();

  const picsEl = document.getElementById('js-pics');
  picsEl.innerHTML = '';

  PORTRAITS_LIB.forEach(pic => {
    const el = document.createElement('img');
    el.setAttribute('class', 'pic hidden-content');
    el.setAttribute('src', `${pic.src}${IS_LANDSCAPE ? 'w' : ''}.jpg`);
    picsEl.appendChild(el);
  });

  // second try to ensure additional images are loaded
  setTimeout(revealContentOnScroll, 1000)

  addScrollEvent();
}

const scrollMain = (el, top=100, bounce=9, delta = -1) => {
  if (top < 0 && bounce < 0) {
    renderMain();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealContentOnScroll();
    return;
  }

  if (delta > 0) delta = (bounce - top)/5 + 0.01;

  if (top < 0 && delta < 0) {
    delta = (bounce - top)/5 + 0.01;
  } else if (top >= bounce && delta > 0) {
    delta = -0.9;
    bounce -= bounce >= 5 ? 3: 2;
  }

  el.style.top = `${top}%`;
  setTimeout(() => scrollMain(el, top + delta, bounce, delta), 8);
}

const fadeIn = (el, i = 0) => {
  if (SHOULD_STOP_SHOW || i > 100) return;

  setTimeout(() => {
    el.style.opacity = i * 0.01;
    fadeIn(el, i + 1);
  }, 18);
}

const playSlideShow = (slideInd, isFirst, toggleId = 0) => {
  if (SHOULD_STOP_SHOW) {
    IS_SHOW_RUNNING = false;
    return;
  }
  IS_SHOW_RUNNING = true;

  const duration = isFirst ? 8000 : 5000;
  const imgElement = document.getElementById(`js-img-${toggleId}`);
  imgElement.style.opacity = 0;
  imgElement.src = `${SLIDE_LIST[slideInd].src}${IS_LANDSCAPE ? 'w' : ''}.jpg`;
  imgElement.style.zIndex = -1;
  
  fadeIn(imgElement);

  setTimeout(() => {
    imgElement.style.zIndex = -2;
       
    playSlideShow((slideInd + 1) % SLIDE_LIST.length, false, (toggleId+1)%2 );
  }, duration);
}

const fadeOut = (el, opacity) => {
  if (opacity <= 0) {
    document.getElementById('js-logo-top').style.display = 'block';
    el.style.display = 'none';

 // document.getElementById('js-btn-gallery-wr').style.display = 'block';
    return;
  }
  setTimeout(() => {
    el.style.opacity = opacity;
    fadeOut(el, opacity - 0.1);
  }, 40)
}

const shrink = (el, width, logoWidth, logoHeight, screenWidth, screenHeight, finalWidth) => {
  if (width < finalWidth) {
    return setTimeout(() => {
      fadeOut(el, 1);      
      return;
    }, 3000)
  }

  el.style.width = `${width}px`;

  const height = logoHeight * width / logoWidth;
  el.style.width = `${width}px`;
  el.style.left = `${screenWidth/2 - width/2}px`;
  el.style.top = `${screenHeight/2 - height*0.5}px`;
  
  const delta = width > screenWidth * 1.5 ? width / screenWidth * 4 : 2;

  setTimeout(() => {
    shrink(el, width - delta, logoWidth, logoHeight, screenWidth, screenHeight, finalWidth);
  }, 1);
}

const scrollLogo = (el, left, finalLeft) => {
  return new Promise(resolve => {
    if (left <= finalLeft) {
      document.getElementById('js-btn-gallery-wr').style.display = 'block';
      return resolve();
    }
    setTimeout(() => {
      el.style.left = `${left}px`;
      scrollLogo(el, left - 1.5, finalLeft)
        .then(resolve);
    }, 1);
  });
}

const displayIntro = async () => {
  const logoElem = document.getElementById('js-logo');
  logoElem.style.display = 'block';
  const logoWidth = logoElem.naturalWidth;
  const logoHeight = logoElem.naturalHeight;
  const screenWidth = getWidth();
  const screenHeight = getHeight();

  const finalWidth = IS_LANDSCAPE ? screenWidth * 0.8 : screenWidth * 0.96;
  // width & height have value to resize
  let width = IS_LANDSCAPE ? screenHeight * 20 : screenWidth * 50;
  let height = logoHeight * width / logoWidth;
  const finalLeft = screenWidth/2 - width/2;
  logoElem.style.width = `${width}px`;
  logoElem.style.left = `0px`;
  logoElem.style.top = `${screenHeight/2 - height*0.5}px`;
  
  await scrollLogo(logoElem, finalLeft * 0.93, finalLeft);

  setTimeout(() => shrink(logoElem, width, logoWidth, logoHeight, screenWidth, screenHeight, finalWidth), 100
  );
}

const renderLanding = (skipIntro = false) => {
  removeScrollEvent();  // scroll not applied in landing

  SHOULD_STOP_SHOW = false;
  document.getElementById('js-main').style.display = 'none';
  
  SLIDE_LIST.sort((a, b) => {
    const aRand = Math.random() + a.weight/100;
    const bRand = Math.random() + b.weight/100;
    return bRand - aRand;
  });

  document.getElementById('js-img-0').style.height = `${getHeight()}px`;
  document.getElementById('js-img-1').style.height = `${getHeight()}px`;

  // document.getElementById('js-img-1').src = './img/m2.jpg'; // test purpose
  if (skipIntro) {
    document.getElementById('js-logo-top').style.display = 'block';
    document.getElementById('js-btn-gallery-wr').style.display = 'block';
  } else {
    displayIntro();
  }

  // set the first image during intro
  const startImage = './img/m1';
  // const startImage = Math.random() > 0.5 ? './img/m3' : './img/m1';
  const slideInd = skipIntro ? 0 : SLIDE_LIST.findIndex(slide => slide.src === startImage);

  console.log("AK: RUNNING?, SHOULD_STOP", IS_SHOW_RUNNING, SHOULD_STOP_SHOW, )
  if (!IS_SHOW_RUNNING) {
    console.log("AK: RUN, RUNNING?, skipIntro", IS_SHOW_RUNNING, skipIntro)
    playSlideShow(slideInd, !skipIntro);
  } 
}

const main = () => {
  IS_LANDSCAPE = isLandscape();
  document.documentElement.style.fontSize = IS_LANDSCAPE ? '20px' : '16px'; 

  const param = window.location.search.split(/=/);
  const id = param.length === 2 ? param[1] : '';
  handleEvent();

  if (id !== 'portraits' && id !== 'events' && id !== 'others') {
    document.title = 'Anthony Photography';
    history.pushState({ page: 'home' }, '', '');
    renderLanding();
  } else {
    // document.getElementById('js-main').classList.add('fi');
    renderMain(id);
  }
}

main();


