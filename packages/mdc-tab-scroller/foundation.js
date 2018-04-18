/**
  * @license
  * Copyright 2018 Google Inc. All Rights Reserved.
  *
  * Licensed under the Apache License, Version 2.0 (the "License")
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *      http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import MDCFoundation from '@material/base/foundation';
import MDCTabScrollerAdapter from './adapter';
import {
  cssClasses,
  strings,
} from './constants';

/**
 * @extends {MDCFoundation<!MDCTabScrollerAdapter>}
 * @abstract
 */
class MDCTabScrollerFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /**
   * @see MDCTabScrollerAdapter for typing information
   * @return {!MDCTabScrollerAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTabScrollerAdapter} */ ({
      registerEventHandler: () => {},
      deregisterEventHandler: () => {},
      addClass: () => {},
      removeClass: () => {},
      setContentStyleProperty: () => {},
      getContentStyleValue: () => {},
      setScrollLeft: () => {},
      getScrollLeft: () => {},
      getContentOffsetWidth: () => {},
      getOffsetWidth: () => {},
    });
  }

  /** @param {!MDCTabScrollerAdapter} adapter */
  constructor(adapter) {
    super(Object.assign(MDCTabScrollerFoundation.defaultAdapter, adapter));
  }

  /**
   * Calculates a safe scroll value that is > 0 and < the max scroll value
   * @param {number} scrollX The distance to scroll
   * @return {number}
   * @protected
   */
  calculateSafeScrollValue(scrollX) {
    // Early exit for negative scroll values
    if (scrollX < 0) {
      return 0;
    }
    const contentWidth = this.adapter_.getContentOffsetWidth();
    const rootWidth = this.adapter_.getOffsetWidth();
    // Scroll values on most browsers are ints instead of floats so we round
    const maxScrollValue = Math.round(contentWidth - rootWidth);
    return Math.min(scrollX, maxScrollValue);
  }

  /**
   * Computes the current visual scroll position
   * @return {number}
   */
  computeCurrentScrollPosition() {
    const currentTranslateX = this.calculateCurrentTranslateX_();
    const scrollLeft = this.adapter_.getScrollLeft();
    return scrollLeft - currentTranslateX;
  }

  /**
   * Returns the translateX value from a CSS matrix transform function string
   * @return {number}
   * @private
   */
  calculateCurrentTranslateX_() {
    const transformValue = this.adapter_.getContentStyleValue('transform');
    // Early exit if no transform is present
    if (transformValue === 'none') {
      return 0;
    }

    // The transform value comes back as a matrix transformation in the form
    // of `matrix(a, b, c, d, tx, ty)`. We only care about tx (translateX) so
    // we're going to grab all the parenthesizedvalues, strip out tx, and parse it.
    const results = /\((.+)\)/.exec(transformValue)[1];
    const parts = results.split(',');
    return parseFloat(parts[4]);
  }

  /**
   * Scrolls to the given scrollX value
   * @param {number} scrollX
   * @abstract
   */
  scrollTo(scrollX) {} // eslint-disable-line no-unused-vars

  /**
   * Increments the current scroll value by the given amount
   * @param {number} scrollXIncrement
   * @abstract
   */
  incrementScroll(scrollXIncrement) {} // eslint-disable-line no-unused-vars
}

export default MDCTabScrollerFoundation;