'use strict';

/*
 * lanscape 2x1: 2000 * 1000px
 * portrait 4x5: 960 * 1200px
 * weight -100 ~ +100
 */
const SLIDE_LIST = [
  {
    src: './img/m1',
    weight: 0,    
  },
  {
    src: './img/m2',
    weight: 0,    
  },
  {
    src: './img/m3',
    weight: 0,    
  },
  {
    src: './img/m4',
    weight: 0,    
  },
  {
    src: './img/m5',
    weight: 0,    
  },
  {
    src: './img/m6',
    weight: 0,    
  },
  {
    src: './img/m7',
    weight: 0,    
  },
  {
    src: './img/m8',
    weight: 0,    
  },
  {
    src: './img/m9',
    weight: 0,    
  },
  {
    src: './img/m10',
    weight: 0,    
  }, 
];

/*
 * stored in object in case additional attributes needed
 * portraitOnly: non-mobile will display as portrait
 * title: text will display under the picture
 * 
 */
const PORTRAITS_LIB = [
  {
    src: './img/m1',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m3',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m4',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m5',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m6',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m8',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m10',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m11',
    portraitOnly: false,
    title: '',
  },
];

const EVENTS_LIB = [
  {
    src: './img/m2',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m4',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m6',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m7',
    portraitOnly: false,
    title: '',
  },
];

const OTHERS_LIB = [
  {
    src: './img/m12',
    portraitOnly: false,
    title: 'Kerry Park, Seattle',
  },
  {
    src: './img/m9',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m4',
    portraitOnly: false,
    title: '',
  },
  {
    src: './img/m13',
    portraitOnly: false,
    title: 'Golden Gate Bridge, San Francisco',
  },
];
