// NavigationIconButton.js

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import {ImagePropTypes} from 'deprecated-react-native-prop-types';

import Theme from 'teaset/themes/Theme';
import NavigationButton from './NavigationButton';

export default class NavigationIconButton extends NavigationButton {

  static propTypes = {
    ...NavigationButton.propTypes,
    icon: ImagePropTypes.source,
  }

  renderTitle() {
    let {icon} = this.props;
    if (icon === null || icon === undefined) return super.renderTitle();
    let iconStyle = {
      tintColor: this.context.tintColor,
      width: 20,
      height: 20,
    };
    return <Image style={iconStyle} source={icon} />;
  }

}

