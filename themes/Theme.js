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
const IPHONE_AIR_WIDTH = 420;
const IPHONE_AIR_HEIGHT = 912;
// Display Zoom dimensions overlap between notch and Dynamic Island devices, so
// they can only be used to detect full-screen iPhones, not the exact cutout type.
// Common full-screen iPhone Display Zoom sizes:
// - 320x693: 5.4", 6.1", and 6.3" full-screen iPhones
// - 375x812: 6.5", 6.7", and 6.9" full-screen iPhones, and iPhone Air
// Non-full-screen zoomed sizes like 320x568 and 375x667 are intentionally excluded.
const IPHONE_ZOOMED_COMPACT_WIDTH = 320;
const IPHONE_ZOOMED_COMPACT_HEIGHT = 693;
const IPHONE_ZOOMED_LARGE_WIDTH = 375;
const IPHONE_ZOOMED_LARGE_HEIGHT = 812;

let {width: D_WIDTH, height: D_HEIGHT} = Dimensions.get('window');

const isIPhoneWeb = Platform.OS === 'web' && navigator.platform === 'iPhone';
const isIPadWeb = Platform.OS === 'web' && navigator.platform === 'iPad';

if (Platform.OS === 'web') {
  // iPhone微信浏览器单独兼容
  if (
    isIPhoneWeb &&
    (/MicroMessenger/i).test(window?.navigator?.userAgent) &&
    window?.screen?.width &&
    window?.screen?.height
  ) {
    D_WIDTH = window.screen.width;
    D_HEIGHT = window.screen.height;
  } else {
    D_WIDTH = window.outerWidth;
    D_HEIGHT = window.outerHeight;
  }
}

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
      ) ||
      (
        (D_HEIGHT === IPHONE_AIR_HEIGHT && D_WIDTH === IPHONE_AIR_WIDTH) ||
        (D_HEIGHT === IPHONE_AIR_WIDTH && D_WIDTH === IPHONE_AIR_HEIGHT)
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
      ((D_HEIGHT === IPHONE_ZOOMED_COMPACT_HEIGHT && D_WIDTH === IPHONE_ZOOMED_COMPACT_WIDTH) ||
        (D_HEIGHT === IPHONE_ZOOMED_COMPACT_WIDTH && D_WIDTH === IPHONE_ZOOMED_COMPACT_HEIGHT)) ||
      ((D_HEIGHT === IPHONE_ZOOMED_LARGE_HEIGHT && D_WIDTH === IPHONE_ZOOMED_LARGE_WIDTH) ||
        (D_HEIGHT === IPHONE_ZOOMED_LARGE_WIDTH && D_WIDTH === IPHONE_ZOOMED_LARGE_HEIGHT)) ||
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
    return Platform.OS !== 'web' && Dimensions.get('window').width > Dimensions.get('window').height;
  },

  get statusBarHeight() {
    if (Platform.OS === 'ios' || this.isIOSWebInAPP) {
      if (this.isIPhoneX) return this.isLandscape ? 0 : (this.fitIPhoneX ? (this.isDynamicIslandIPhone ? 54 : 44) : 20);
      if (this.isPad) return 20;
    } else if (Platform.OS === 'android') {
      if (Platform.Version > 20) {
        if (this.isLandscape) return 0;
        return StatusBar.currentHeight || 24; //translucent StatusBar is required
      }
      return 0;
    } else if (Platform.OS === 'web') {
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