'use strict';

const handleOpenMenu = () => {
  SHOULD_STOP_SHOW = true;
  const mainEl = document.getElementById('js-main');
  mainEl.style.display = 'block';
  renderCatchPhrase('portraits');
  updateCatchMobile();
  scrollMain(mainEl);
}

const handlePlaySlideShow = () => {
  const logoElem = document.getElementById('js-logo');
  fadeOutIntro(logoElem, 1);
  document.getElementById('js-audio').play();
  displayAudioEffect();

  setTimeout(() => {
    document.getElementById('js-btn-slide').style.display = 'none';
    document.getElementById('js-audio-control').style.display = 'flex';
    // displayAudioEffect();
    playSlideShow(0, false);
  }, 1000);
}

// This event is triggered occasionally from phone
const handleResize = () => {
  const isRotated = IS_LANDSCAPE !== isLandscape();
  IS_LANDSCAPE = isLandscape();
  document.documentElement.style.fontSize = IS_LANDSCAPE ? '20px' : '16px'; 
  
  document.getElementById('js-img-0').style.height = `${getHeight()}px`;
  document.getElementById('js-img-1').style.height = `${getHeight()}px`;
  
  if (MENU_NAMES.some(name => name === PAGE)) {
    if (isRotated) {
      renderMain(PAGE);
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

const initAnime = () => {
  /*
  * each frame will stay during x scrolls
  * the larger the slower
  * e.g., 24fps: 5spf will requires 150frames
  * 
  */
  const SCROLLS_PER_FRAME = 3;  // the larger the slower
  let i = START_FRAME;
  const frameEl = document.getElementById('js-frame-wr');
  const screenHeight = getHeight();
 
  let baseTop = frameEl?.getBoundingClientRect()?.top;
  // console.log("AK: bastTop", baseTop, window.scrollY)

  return () => {
    // in case baseTop is not defined
    if (baseTop < 10) baseTop = frameEl?.getBoundingClientRect()?.top;    
    const rect = frameEl?.getBoundingClientRect();

    if (rect.top < screenHeight && rect.bottom > 0) {
      const scrollAmount = baseTop - rect.top;
      let newInd = parseInt(scrollAmount/SCROLLS_PER_FRAME);
      if (newInd < START_FRAME) newInd = 1;
      if (newInd > END_FRAME) newInd = newInd % END_FRAME + 1;

      if (newInd !== i) {
        // console.log("--i:", newInd, scrollAmount, rect.top)
        updateAnimeFrames(newInd);
        i = newInd;
      } 
    }
  }
}

const initTopPic = () => {
  const SCROLLS_PER_FRAME = 1.2;  // the larger the slower
  let i = 0;
  let prevTop = 1000; // large value to be out of bound
  let screenWidth = getWidth();
  let screenHeight = getHeight();
  let frameEl = document.getElementById('js-frame-e-wr');
  let baseTop = frameEl?.getBoundingClientRect()?.top;
  // console.log("--init", baseTop)
  
  return () => {
    frameEl = document.getElementById('js-frame-e-wr');
    if (frameEl?.classList.contains('frame-e-wr-wide')) {
      return;
    }
    screenWidth = getWidth();
    screenHeight = getHeight();

      // in case baseTop is not defined
    if (baseTop < 5) {
      baseTop = frameEl?.getBoundingClientRect()?.top;
    }

    const imgEl = document.getElementById('js-frame-e');

    // suppress if image height is enlarged to fit screen width
    if (imgEl && imgEl.style.height > '400px') {
      console.log("AK: height supprss", imgEl?.style.height)
      return;
    }

    const maxLeft = imgEl.width - screenWidth;
    const rect = frameEl?.getBoundingClientRect();

    if (rect.top >= 0 && rect.top < screenHeight) {
      const top = rect.top;
      const scrollAmount = baseTop - rect.top;

      const threshold = screenHeight * 0.4;
      // console.log("--top", top, prevTop, screenHeight);
      
      // going upward
      if (top <= threshold && prevTop >= threshold) {
        imgEl.style.animation = 'moveRight 1.5s linear forwards';
      } else if (top >= threshold && prevTop <= threshold) {
        imgEl.style.animation = 'moveLeft 1.5s linear';
      } 
      prevTop = top;
    
      /* OLD CODE - JS Anime effect */
      /*
      let newInd = parseInt(scrollAmount/SCROLLS_PER_FRAME); // add -30 value for bottom space
      if (newInd < 0) newInd = 0;
      if (newInd > maxLeft) newInd = maxLeft;
      newInd *= -1;

      if (newInd !== i) {
        imgEl.style.left = `${newInd}px`;
        i = newInd;
      } 
      */
    }
  }
}


const scrollToTop = () => {
  setTimeout(() => {
    document.getElementById('js-top-btn-wr').style.display = 'none';
  }, 1000);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const handleMenuClicked = page => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  renderMain(page);
}

const handleTopBtnWr = () => {
  let timeoutId;

  return () => {
    const topBtn = document.getElementById('js-top-btn-wr');
    const scrollY = window.scrollY;

    if (scrollY > getHeight() * 1.1) {
      topBtn.style.display = 'flex';
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        topBtn.style.display = 'none';
      }, 3000);
    } else {
      topBtn.style.display = 'none';
    }
  }
}

const handleScroll = (updateAnime, updateTopPic, handleTopBtn) => {
  revealContentOnScroll();
  handleTopBtn();
  if (PAGE === 'portraits') {
    updateAnime();
  } else {
    updateTopPic();
  }
}

const addScrollEvent = () => {
  const updateAnime = initAnime();  // movie anime
  const updateTopPic = initTopPic(); // still anime
  const handleTopBtn = handleTopBtnWr();
  const throttledHandleScroll = throttle(() => handleScroll(updateAnime, updateTopPic, handleTopBtn), 50);
  
  window.addEventListener('scroll', throttledHandleScroll);

  window.onload = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    revealContentOnScroll();
  };
}

const addClassLoadEvent = () => {
  let requested = false;
  let loadedCnt = 0;

  return className => {
    const elements = document.querySelectorAll(`.${className}`);
    const len = elements.length;
    
    const removeClassLoadEvent = () => {
      elements.forEach(el => {
        el.removeEventListener('load', handleClassLoad);
      });
    }
    
    const handleClassLoad = () => {
      if (++loadedCnt === len) {
        FRAMES_LOADED = true;
        console.log("AK: Frames loaded")
        removeClassLoadEvent();  
      }
    }
    
    if (!requested) {
      elements.forEach(el => {
        el.addEventListener('load', handleClassLoad);
      });
      requested = true;
    }
  }
}

const stopMusic = () => {
  document.getElementById('js-audio').pause();
  // document.getElementById('js-stop').style.display = 'none';
  document.getElementById('js-play').style.display = 'block';
}
const playMusic = () => {
  document.getElementById('js-audio').play();
  document.getElementById('js-play').style.display = 'none';
  // document.getElementById('js-stop').style.display = 'block';
}

function playNext() {
  const audioEl = document.getElementById('js-audio');
  if (++SONG_TRACK === SONG_LIST.length) SONG_TRACK = 0;
  audioEl.src = SONG_LIST[SONG_TRACK].path;
  audioEl.play();
}

const displayAudioEffect = () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const canvas = document.getElementById('js-visualizer');
  const canvasContext = canvas.getContext('2d');

  // Connect the audio source to the analyser node
  const audioElement = document.getElementById('js-audio');
  const audioSource = audioContext.createMediaElementSource(audioElement);
  audioSource.connect(analyser);
  analyser.connect(audioContext.destination);

  // Set up the analyser node
  analyser.fftSize = 256;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  // Draw the js-visualizer
  function draw() {
    analyser.getByteFrequencyData(dataArray);
    
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5 * 3;
    let x = 0;    
    for (let i = 0; i < bufferLength; i += 3) {
      const barHeight = dataArray[i];

      canvasContext.fillStyle = 'rgb(255, 255, 255, 0.1)';
      canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
      canvasContext.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50, 0.7)';
      canvasContext.fillRect(x, canvas.height - barHeight / 2, barWidth, 15);
      
      x += barWidth + 1;
    }
    requestAnimationFrame(draw);
  }

  draw();
}


const addAudioListener = () => {
  SONG_LIST.sort((a, b) => {
    const aRand = Math.random() + a.weight/100;
    const bRand = Math.random() + b.weight/100;
    return bRand - aRand;
  });

  const audioEl = document.getElementById('js-audio');
  audioEl.src = SONG_LIST[SONG_TRACK].path;
  
  audioEl.addEventListener('ended', () => {
    if (++SONG_TRACK === SONG_LIST.length) SONG_TRACK = 0;
    audioEl.src = SONG_LIST[SONG_TRACK].path;
    audioEl.play();
  });
}

const handleEvent = () => {
  window.addEventListener('resize', debounce(handleResize, 500));
  window.addEventListener('popstate', handlePopState);
  addAudioListener();
}
