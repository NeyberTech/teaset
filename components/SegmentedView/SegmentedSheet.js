// SegmentedSheet.js

'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import {TextPropTypes, ViewPropTypes} from 'deprecated-react-native-prop-types';

import Theme from 'teaset/themes/Theme';

export default class SegmentedSheet extends Component {
  
  static propTypes = {
    ...ViewPropTypes,
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]).isRequired,
    titleStyle: TextPropTypes.style,
    activeTitleStyle: TextPropTypes.style,
    badge: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.number]),
  };

  render() {
    let {style, title, titleStyle, activeTitleStyle, badge, ...others} = this.props;
    style = [{flexGrow: 1}].concat(style);
    return <View style={style} {...others} />;
  }
}
