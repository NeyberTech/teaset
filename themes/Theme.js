// Theme.js

'use strict';

import {Platform, Dimensions, NativeModules, DeviceInfo, StatusBar} from 'react-native';

import ThemeDefault from './ThemeDefault';
import ThemeBlack from './ThemeBlack';
import ThemeViolet from './ThemeViolet';

// See https://mydevice.io/devices/ for device dimensions
const X_WIDTH = 375;
const X_HEIGHT = 812;
const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;
const PAD_WIDTH = 768;
const PAD_HEIGHT = 1024;
const IPHONE12_WIDTH = 390;
const IPHONE12_HEIGHT = 844;
const IPHONE12PROMAX_WIDTH = 428;
const IPHONE12PROMAX_HEIGHT = 926;
// IPHONE14 & IPHONE14 Plus = IPHONE13 Series = IPHONE12 Series

// Dynamic island device
const IPHONE14PRO_WIDTH = 393;
const IPHONE14PRO_HEIGHT = 852;
const IPHONE14PROMAX_WIDTH = 430;
const IPHONE14PROMAX_HEIGHT = 932;
const IPHONE16PRO_WIDTH = 402;
const IPHONE16PRO_HEIGHT = 874;
const IPHONE16PROMAX_WIDTH = 440;
const IPHONE16PROMAX_HEIGHT = 956;

let {width: D_WIDTH, height: D_HEIGHT} = Dimensions.get('window');

if (Platform.OS === 'web') {
  D_WIDTH = window.outerWidth;
  D_HEIGHT = window.outerHeight;
}

const isIPhoneWeb = Platform.OS === 'web' && navigator.platform === 'iPhone';
const isIPadWeb = Platform.OS === 'web' && navigator.platform === 'iPad';

// 灵动岛异形屏
const isDynamicIslandIPhone = (() => {
  return (
    (Platform.OS === 'ios' || isIPhoneWeb) && (
      (
        (D_HEIGHT === IPHONE14PRO_HEIGHT && D_WIDTH === IPHONE14PRO_WIDTH) ||
        (D_HEIGHT === IPHONE14PRO_WIDTH && D_WIDTH === IPHONE14PRO_HEIGHT)
      ) ||
      (
        (D_HEIGHT === IPHONE14PROMAX_HEIGHT && D_WIDTH === IPHONE14PROMAX_WIDTH) ||
        (D_HEIGHT === IPHONE14PROMAX_WIDTH && D_WIDTH === IPHONE14PROMAX_HEIGHT)
      ) ||
      (
        (D_HEIGHT === IPHONE16PRO_HEIGHT && D_WIDTH === IPHONE16PRO_WIDTH) ||
        (D_HEIGHT === IPHONE16PRO_WIDTH && D_WIDTH === IPHONE16PRO_HEIGHT)
      ) ||
      (
        (D_HEIGHT === IPHONE16PROMAX_HEIGHT && D_WIDTH === IPHONE16PROMAX_WIDTH) ||
        (D_HEIGHT === IPHONE16PROMAX_WIDTH && D_WIDTH === IPHONE16PROMAX_HEIGHT)
      )
    )
  );
})();

const isIPhoneX = (() => {
  return (
    (Platform.OS === 'ios' || isIPhoneWeb) && (
      ((D_HEIGHT === X_HEIGHT && D_WIDTH === X_WIDTH) ||
        (D_HEIGHT === X_WIDTH && D_WIDTH === X_HEIGHT)) ||
      ((D_HEIGHT === XSMAX_HEIGHT && D_WIDTH === XSMAX_WIDTH) ||
        (D_HEIGHT === XSMAX_WIDTH && D_WIDTH === XSMAX_HEIGHT)) ||
      ((D_HEIGHT === IPHONE12_HEIGHT && D_WIDTH === IPHONE12_WIDTH) ||
        (D_HEIGHT === IPHONE12_WIDTH && D_WIDTH === IPHONE12_HEIGHT)) ||
      ((D_HEIGHT === IPHONE12PROMAX_HEIGHT && D_WIDTH === IPHONE12PROMAX_WIDTH) ||
        (D_HEIGHT === IPHONE12PROMAX_WIDTH && D_WIDTH === IPHONE12PROMAX_HEIGHT)) ||
      isDynamicIslandIPhone
    )
  );
})();

const isIPad = (() => {
  if ((Platform.OS !== 'ios' && !isIPadWeb) || isIPhoneX) return false;

  // if portrait and width is smaller than iPad width
  if (D_HEIGHT > D_WIDTH && D_WIDTH < PAD_WIDTH) {
    return false;
  }

  // if landscape and height is smaller that iPad height
  if (D_WIDTH > D_HEIGHT && D_HEIGHT < PAD_WIDTH) {
    return false;
  }

  return true;
})();


const Theme = {

  themes: {
    default: ThemeDefault,
    black: ThemeBlack,
    violet: ThemeViolet,
  },

  set: function(theme) {
    Object.assign(this, theme);
  },

  isIOSWeb: isIPhoneWeb || isIPadWeb,
  isIOSWebInAPP: false,
  isIPhoneWeb,
  isIPadWeb,

  isPad: isIPad,

  isIPhoneX: isIPhoneX,
  
  isDynamicIslandIPhone: isDynamicIslandIPhone,

  fitIPhoneX: true,

  get isLandscape() {
    return Dimensions.get('window').width > Dimensions.get('window').height;
  },

  get statusBarHeight() {
    if (this.isIOSWeb && !this.isIOSWebInAPP) {
      return 0;
    }
    else if (Platform.OS === 'ios' || (this.isIOSWeb && this.isIOSWebInAPP)) {
      if (this.isIPhoneX) return this.isLandscape ? 0 : (this.fitIPhoneX ? (this.isDynamicIslandIPhone ? 54 : 44) : 20);
      if (this.isPad) return 20;
    } else if (Platform.OS === 'android') {
      if (Platform.Version > 20) return StatusBar.currentHeight; //translucent StatusBar is required
      return 0;
    }
    return this.isLandscape ? 0 : 20;
  },

  get screenInset() {
    let isLandscape = this.isLandscape;
    let isIPhoneX = this.isIPhoneX;
    let isDynamicIslandIPhone = this.isDynamicIslandIPhone;
    let fitIPhoneX = this.fitIPhoneX;
    return ({
      left: isLandscape && isIPhoneX && fitIPhoneX ? (isDynamicIslandIPhone ? 54 : 44) : 0,
      right: isLandscape && isIPhoneX && fitIPhoneX ? (isDynamicIslandIPhone ? 54 : 44) : 0,
      top: this.statusBarHeight,
      bottom: isIPhoneX && fitIPhoneX ? (isLandscape ? 24 : 34) : 0,
    });
  },

};

Theme.set(ThemeDefault);

module.exports = Theme;