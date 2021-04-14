// Overlay.js

'use strict';

import React, {Component} from "react";
import {View, DeviceEventEmitter} from 'react-native';

import TopView from './TopView';
import OverlayView from './OverlayView';
import OverlayPullView from './OverlayPullView';
import OverlayPopView from './OverlayPopView';
import OverlayPopoverView from './OverlayPopoverView';

export default class Overlay {

  static View = OverlayView;
  static PullView = OverlayPullView;
  static PopView = OverlayPopView;
  static PopoverView = OverlayPopoverView;

  // base props
  //   style: ViewPropTypes.style,
  //   modal: PropTypes.bool,
  //   animated: PropTypes.bool,
  //   overlayOpacity: PropTypes.number,
  //   overlayPointerEvents: ViewPropTypes.pointerEvents,
  static show(overlayView, options = {}) {
    let key;
    let onDisappearCompletedSave = overlayView.props.onDisappearCompleted;
    let element = React.cloneElement(overlayView, {
      onDisappearCompleted: () => {
        TopView.remove(key);
        onDisappearCompletedSave && onDisappearCompletedSave();
      }
    });
    key = TopView.add(element);

    let { hideWhenUnderViewMove } = options;
    if (hideWhenUnderViewMove) {
      let moveListener = DeviceEventEmitter.addListener('underViewMove',function(){
        moveListener.remove();
        closeListener.remove();
        setTimeout(()=>{
          Overlay.hide(key);
        }, 10);
      });
      let closeListener = DeviceEventEmitter.addListener('removeOverlay',function({key: _key} = {}){
        if (key === _key) {
          moveListener.remove();
          closeListener.remove();
        }
      });

    }    
    
    return key;
  }

  static hide(key) {
    TopView.remove(key);
  }

  static transformRoot(transform, animated, animatesOnly = null) {
    TopView.transform(transform, animated, animatesOnly);
  }

  static restoreRoot(animated, animatesOnly = null) {
    TopView.restore(animated, animatesOnly);
  }

}
