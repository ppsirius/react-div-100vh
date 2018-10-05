import React from 'react';

const rvhRegex = /(\d+(\.\d*)?)rvh\s*$/;

class Div100vh extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = null;
    this.computeRvhStyles = this.computeRvhStyles.bind(this);
  }

  setNodeHeightToWindowInnerHeight() {
    return this.myRef ?
      this.myRef.style.height = window.innerHeight + 'px' :
      null;
  }

  // On window resize, recalculate any rvh unit style properties
  computeRvhStyles() {
    if (!this.props.style) {
      return this.setNodeHeightToWindowInnerHeight();
    }

    let rvhPropertyFound = false;

    Object.entries(this.props.style).forEach(([property, rawValue]) => {
      const match = rvhRegex.exec(rawValue);
      if (this.myRef && match != null) {
        rvhPropertyFound = true;
        // Guarantee that this only runs for numbers
        const extractedValue = parseFloat(match[0]);
        this.myRef.style[property] = extractedValue / 100 * window.innerHeight + 'px';
      }
    });

    // Default to height 100vh if no rvh found in style
    if (!rvhPropertyFound) {
      this.setNodeHeightToWindowInnerHeight();
    }
  }

  componentDidMount() {
    this.computeRvhStyles();
    window.addEventListener('resize', this.computeRvhStyles, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.computeRvhStyles, false);
  }

  render() {
    return (
      <div
        ref={el => this.myRef = el}
        {...this.props}
      />
    );
  }
}

export default Div100vh;
