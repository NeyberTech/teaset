// OverlayPullView.js

'use strict';

import React, {Component} from "react";
import PropTypes from 'prop-types';
import { Animated, View } from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';

import Theme from '../../themes/Theme';
import TopView from './TopView';
import OverlayView from './OverlayView';

export default class OverlayPullView extends OverlayView {

  static propTypes = {
    ...OverlayView.propTypes,
    side: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    animationSide: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
    containerStyle: ViewPropTypes.style,
    rootTransform: PropTypes.oneOfType([
      PropTypes.oneOf(['none', 'translate', 'scale']),
      PropTypes.arrayOf(PropTypes.shape({
        translateX: PropTypes.number,
        translateY: PropTypes.number,
        scaleX: PropTypes.number,
        scaleY: PropTypes.number,
      })),
    ]),
  };

  static defaultProps = {
    ...OverlayView.defaultProps,
    side: 'bottom',
    animated: true,
    rootTransform: 'none',
  };

  constructor(props) {
    super(props);
    this.viewLayout = {x: 0, y: 0, width: 0, height: 0};
    this._inited = false;
    Object.assign(this.state, {
      translateValue: new Animated.Value(0),
      opacityValue: new Animated.Value(0),
    });
  }

  get appearAnimates() {
    let animates = super.appearAnimates;
    animates.push(
      Animated.spring(this.state.translateValue, {
        toValue: 0,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opacityValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    );
    return animates;
  }
  
  get disappearAnimates() {
    let animates = super.disappearAnimates;
    animates.push(
      Animated.spring(this.state.translateValue, {
        toValue: this._initTranslateValue || 0,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.opacityValue, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      })
    );
    return animates;
  }

  get appearAfterMount() {
    return false;
  }

  get rootTransformValue() {
    let {side, rootTransform} = this.props;
    if (!rootTransform || rootTransform === 'none') {
      return [];
    }
    let transform;
    switch (rootTransform) {
      case 'translate':
        switch (side) {
          case 'top': return [{translateY: this.viewLayout.height}];
          case 'left': return [{translateX: this.viewLayout.width}];
          case 'right': return [{translateX: -this.viewLayout.width}];
          default: return [{translateY: -this.viewLayout.height}];
        }
        break;
      case 'scale':
        return [{scaleX: Theme.overlayRootScale}, {scaleY: Theme.overlayRootScale}];
      default:
        return rootTransform;
    }
  }

  appear(animated = this.props.animated) {
    super.appear(animated);

    let {rootTransform} = this.props;
    if (rootTransform && rootTransform !== 'none') {
      TopView.transform(this.rootTransformValue, animated);
    }
  }

  disappear(animated = this.props.animated) {
    let {rootTransform} = this.props;
    if (rootTransform && rootTransform !== 'none') {
      TopView.restore(animated);
    }

    super.disappear(animated);
  }

  onLayout(e) {
    const {side, animationSide} = this.props;
    const {width, height} = e.nativeEvent.layout;
    this.viewLayout = {width, height};

    if (!this._inited) {
      this._inited = true;

      const initSide = animationSide || side;
      let initValue =
        initSide === 'left' || initSide === 'right' ? width : height;

      if (initSide === 'top' || initSide === 'left') {
        initValue = -initValue;
      }

      this._initTranslateValue = initValue;
      this.state.translateValue.setValue(initValue);
      this.state.opacityValue.setValue(0);

      this.appear(true);
    }
  }

  buildStyle() {
    let {side} = this.props;
    let sideStyle;
    //Set flexDirection so that the content view will fill the side
    switch (side) {
      case 'top':
        sideStyle = {flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch'};
        break;
      case 'left':
        sideStyle = {flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'stretch'};
        break;
      case 'right':
        sideStyle = {flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'stretch'};
        break;
      default:
        sideStyle = {flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'stretch'};
    }
    return super.buildStyle().concat(sideStyle);
  }

  renderContent(content = null) {
    let {side, containerStyle, children} = this.props;

    let contentStyle;
    switch (side) {
      case 'top':
        contentStyle = {
          transform: [{ translateY: this.state.translateValue }],
        };
        break;
      case 'left':
        contentStyle = {
          transform: [{ translateX: this.state.translateValue }],
        };
        break;
      case 'right':
        contentStyle = {
          transform: [{ translateX: this.state.translateValue }],
        };
        break;
      default:
        contentStyle = {
          transform: [{ translateY: this.state.translateValue }],
        };
    }

    contentStyle.opacity = this.state.opacityValue;
    containerStyle = [{
      backgroundColor: Theme.defaultColor,
    }].concat(containerStyle).concat(contentStyle);

    return (
      <Animated.View style={containerStyle} onLayout={(e) => this.onLayout(e)}>
        {content ? content : children}
      </Animated.View>
    );
  }

}
