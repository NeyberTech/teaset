// Label.js

'use strict';

import React, {Component} from "react";
import PropTypes from 'prop-types';
import {View,Text} from 'react-native';

import Theme from 'teaset/themes/Theme';

export default class Label extends Component {

  static propTypes = {
    ...Text.propTypes,
    type: PropTypes.oneOf(['default', 'title', 'detail', 'danger']),
    size: PropTypes.oneOf(['xl', 'lg', 'md', 'sm', 'xs']),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    ...Text.defaultProps,
    type: 'default',
    size: 'md',
    numberOfLines: 1,
  };

  buildStyle() {
    let {type, size, style} = this.props;

    let color, fontSize;
    switch (size) {
      case 'xl': fontSize = Theme.labelFontSizeXL; break;
      case 'lg': fontSize = Theme.labelFontSizeLG; break;
      case 'sm': fontSize = Theme.labelFontSizeSM; break;
      case 'xs': fontSize = Theme.labelFontSizeXS; break;
      default: fontSize = Theme.labelFontSizeMD;
    }
    switch (type) {
      case 'title':
        color = Theme.labelTextTitleColor;
        fontSize = Math.round(fontSize * Theme.labelTitleScale);
        break;
      case 'detail':
        color = Theme.labelTextDetailColor;
        fontSize = Math.round(fontSize * Theme.labelDetailScale);
        break;
      case 'danger':
        color = Theme.labelTextDangerColor;
        fontSize = Math.round(fontSize * Theme.labelDangerScale);
        break;
      default:
        color = Theme.labelTextColor;
    }
    style = [{
      backgroundColor: 'rgba(0, 0, 0, 0)',
      color: color,
      fontSize: fontSize,
      overflow: 'hidden',
    }].concat(style);

    return style;
  }

  render() {
    let { style, type, size, text, children, withRedDot, redDotContainerStyle, redDotStyle, ...others } = this.props;
    
    redDotContainerStyle=[{
      height: 6,
      width: 6,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: -4,
      top: 0,
    }].concat(redDotContainerStyle)

    redDotStyle=[{
      height: 5,
      width: 5,
      borderRadius: 2.5,
      backgroundColor: '#F44336',
    }].concat(redDotStyle)

    return (withRedDot ?
    <View>
      <Text style={[this.buildStyle(), {alignSelf:'center',flexGrow:0,flexShrink:0}]} {...others}>
        {(text || text === '' || text === 0) ? text : children}
      </Text>
      <View style={redDotContainerStyle}>
        <View style={redDotStyle} />
      </View>
    </View> :
    <Text style={this.buildStyle()} {...others}>
    {(text || text === '' || text === 0) ? text : children}
    </Text>)
  }
}


