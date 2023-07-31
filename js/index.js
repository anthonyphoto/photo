'use strict';

let IS_LANDSCAPE = false;



const getWidth = () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

const getHeight = () => window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

// desktop screen or landscape mode of mobile devices
const isLandscape = () => getWidth() >= 1200 || getWidth() > getHeight();

const handleEvent = () => {
  window.addEventListener('resize', renderContent);
}

const renderContent = () => {
  IS_LANDSCAPE = isLandscape();

  console.log("AK: render", isLandscape(), getWidth(), getHeight());

  // lanscape 2*1: 2000 * 1000
  // portrait 4*5: 960 * 1200
  const SLIDE_LIST = [
    {
      src: './img/m1',
      weight: 60,    
    }, 
    {
      src: './img/m2',
      weight: 60,    
    }, 
    {
      src: './img/m3',
      weight: 60,    
    }, 
    {
      src: './img/m4',
      weight: 60,    
    }, 
    {
      src: './img/m5',
      weight: 60,    
    }, 
  ];

  SLIDE_LIST.sort((a, b) => {
    const aRand = Math.random() + a.weight/100;
    const bRand = Math.random() + b.weight/100;
    return bRand - aRand;
  });

  if (IS_LANDSCAPE) {
    console.log("AK: update to lands")
    document.getElementById('js-img1').style.height = `${getHeight()}px`;
    document.getElementById('js-img1').src = `${SLIDE_LIST[0].src}w.jpg`;
  } else {
    console.log("AK: update to port")
    // document.getElementById('js-img1').style.width = `${getWidth()}px`;
    document.getElementById('js-img1').style.height = `${getHeight()}px`;
    document.getElementById('js-img1').src = `${SLIDE_LIST[0].src}.jpg`;
  }
}
const main = () => {
  handleEvent();
  renderContent();
}

main();