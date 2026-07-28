// NavigationPage.js

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Platform, View, Dimensions} from 'react-native';
import {SafeAreaInsetsContext} from 'react-native-safe-area-context';

import Theme from 'teaset/themes/Theme';
// import TeaNavigator from '../TeaNavigator/TeaNavigator';
import BasePage from '../BasePage/BasePage';
import NavigationBar from '../NavigationBar/NavigationBar';
import KeyboardSpace from '../KeyboardSpace/KeyboardSpace';

export default class NavigationPage extends BasePage {
  static contextType = SafeAreaInsetsContext;

  static propTypes = {
    ...BasePage.propTypes,
    title: PropTypes.string,
    showBackButton: PropTypes.bool,
    navigationBarInsets: PropTypes.bool,
  };

  static defaultProps = {
    ...BasePage.defaultProps,
    // scene: TeaNavigator.SceneConfigs.PushFromRight,
    title: null,
    showBackButton: false,
    navigationBarInsets: true,
  };

  constructor(props) {
    super(props);
    this.screenWidth = Dimensions.get('window').width;
  }

  onLayout(e) {
    let {width} = Dimensions.get('window');
    if (width != this.screenWidth) {
      this.screenWidth = width;
      this.forceUpdate();
    }
    this.props.onLayout && this.props.onLayout(e);
  }

  renderNavigationTitle() {
    return this.props.title;
  }

  renderNavigationLeftView() {
    if (!this.props.showBackButton) return null;
    return (
      <NavigationBar.BackButton
        title={Theme.backButtonTitle}
        onPress={() => this.navigator.pop()}
        />
    );
  }

  renderNavigationRightView() {
    return null;
  }

  renderNavigationBar() {
    return (
      <NavigationBar
        style={{position: 'relative'}}
        safeAreaInsets={this.context}
        title={this.renderNavigationTitle()}
        leftView={this.renderNavigationLeftView()}
        rightView={this.renderNavigationRightView()}
        />
    );
  }

  renderPage() {
    return null;
  }

  render() {
    let {style, children, scene, autoKeyboardInsets, keyboardTopInsets, title, showBackButton, navigationBarInsets, ...others} = this.props;

    let pageContainerStyle = [{
      flex: 1,
    }];

    return (
      <View style={this.buildStyle()} onLayout={e => this.onLayout(e)} {...others}>
        <View style={{flex: 1}} >
          {this.renderNavigationBar()}
          <View style={pageContainerStyle}>
            {this.renderPage()}
          </View>
        </View>
        {autoKeyboardInsets ? <KeyboardSpace topInsets={keyboardTopInsets} /> : null}
      </View>
    );
  }


}

