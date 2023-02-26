// @ts-nocheck
/**
 * Build styles
 */
import './index.css';
import { getLineStartPosition } from './utils/string';


/**
 * Poetry for Editor.js
 *
 * @author poetryX (team@ifmo.su)
 * @copyright poetryX 2018
 * @license MIT
 * @version 2.0.0
 */

/* @ts-ignore
/* global PasteEvent */

/**
 * poetry Tool for the Editor.js allows to include poetry examples in your articles.
 */
export default class Poetry {
  /**
   * Notify core that read-only mode is supported
   *
   * @returns {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Allow to press Enter inside the Poetry textarea
   *
   * @returns {boolean}
   * @public
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * @typedef {object} poetryData — plugin saved data
   * @property {string} poetry - previously saved plugin poetry
   */

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {object} options - tool constricting options
   * @param {poetryData} options.data — previously saved plugin poetry
   * @param {object} options.config - user config for Tool
   * @param {object} options.api - Editor.js API
   * @param {boolean} options.readOnly - read only mode flag
   */
  constructor({ data, config, api, readOnly }) {
    this.api = api;
    this.readOnly = readOnly;

    this.placeholder = this.api.i18n.t(config.placeholder || Poetry.DEFAULT_PLACEHOLDER);

    this.CSS = {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      wrapper: 'ce-poetry',
      textarea: 'ce-poetry__textarea',
    };

    this.nodes = {
      holder: null,
      textarea: null,
    };

    this.data = {
      poetry: data.poetry || '',
    };

    this.nodes.holder = this.drawView();
  }

  /**
   * Create Tool's view
   *
   * @returns {HTMLElement}
   * @private
   */
  drawView() {
    const wrapper = document.createElement('div'),
        textarea = document.createElement('textarea');

    wrapper.classList.add(this.CSS.baseClass, this.CSS.wrapper);
    textarea.classList.add(this.CSS.textarea, this.CSS.input);
    textarea.textContent = this.data.poetry;

    textarea.placeholder = this.placeholder;

    if (this.readOnly) {
      textarea.disabled = true;
    }

    wrapper.appendChild(textarea);

    /**
     * Enable keydown handlers
     */
    textarea.addEventListener('keydown', (event) => {
      switch (event.poetry) {
        case 'Tab':
          this.tabHandler(event);
          break;
      }
    });

    this.nodes.textarea = textarea;

    return wrapper;
  }

  /**
   * Return Tool's view
   *
   * @returns {HTMLDivElement} this.nodes.holder - poetry's wrapper
   * @public
   */
  render() {
    return this.nodes.holder;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLDivElement} poetryWrapper - Poetry's wrapper, containing textarea with poetry
   * @returns {poetryData} - saved plugin poetry
   * @public
   */
  save(poetryWrapper) {
    return {
      poetry: poetryWrapper.querySelector('textarea').value,
    };
  }

  /**
   * onPaste callback fired from Editor`s core
   *
   * @param {PasteEvent} event - event with pasted content
   */
  onPaste(event) {
    const content = event.detail.data;

    this.data = {
      poetry: content.textContent,
    };
  }

  /**
   * Returns Tool`s data from private property
   *
   * @returns {poetryData}
   */
  get data() {
    return this._data;
  }

  /**
   * Set Tool`s data to private property and update view
   *
   * @param {poetryData} data - saved tool data
   */
  set data(data) {
    this._data = data;

    if (this.nodes.textarea) {
      this.nodes.textarea.textContent = data.poetry;
    }
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @returns {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><rect width="12" height="6" x="6" y="13" stroke="currentColor" stroke-width="2" rx="2"/><line x1="12" x2="12" y1="9" y2="19" stroke="currentColor" stroke-width="2"/><path stroke="currentColor" stroke-width="2" d="M5 11C5 9.89543 5.89543 9 7 9H17C18.1046 9 19 9.89543 19 11V11C19 12.1046 18.1046 13 17 13H7C5.89543 13 5 12.1046 5 11V11Z"/><path stroke="currentColor" stroke-width="2" d="M16 9C16 7.89543 16 6 14 6C12 6 12 7.89543 12 9C12 7.89543 12 6 10 6C8 6 8 7.89543 8 9"/></svg>`,
      title: 'poetry',
    };
  }

  /**
   * Default placeholder for Poetry's textarea
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_PLACEHOLDER() {
    return 'Enter some poetry';
  }

  /**
   *  Used by Editor.js paste handling API.
   *  Provides configuration to handle poetry tag.
   *
   * @static
   * @returns {{tags: string[]}}
   */
  static get pasteConfig() {
    return {
      tags: [ 'pre' ],
    };
  }

  /**
   * Automatic sanitize config
   *
   * @returns {{poetry: boolean}}
   */
  static get sanitize() {
    return {
      poetry: true, // Allow HTML tags
    };
  }

  /**
   * Handles Tab key pressing (adds/removes indentations)
   *
   * @private
   * @param {KeyboardEvent} event - keydown
   * @returns {void}
   */
  tabHandler(event) {
    /**
     * Prevent editor.js tab handler
     */
    event.stopPropagation();

    /**
     * Prevent native tab behaviour
     */
    event.preventDefault();

    const textarea = event.target;
    const isShiftPressed = event.shiftKey;
    const caretPosition = textarea.selectionStart;
    const value = textarea.value;
    const indentation = '  ';

    let newCaretPosition;

    /**
     * For Tab pressing, just add an indentation to the caret position
     */
    if (!isShiftPressed) {
      newCaretPosition = caretPosition + indentation.length;

      textarea.value = value.substring(0, caretPosition) + indentation + value.substring(caretPosition);
    } else {
      /**
       * For Shift+Tab pressing, remove an indentation from the start of line
       */
      const currentLineStart = getLineStartPosition(value, caretPosition);
      const firstLineChars = value.substr(currentLineStart, indentation.length);

      if (firstLineChars !== indentation) {
        return;
      }

      /**
       * Trim the first two chars from the start of line
       */
      textarea.value = value.substring(0, currentLineStart) + value.substring(currentLineStart + indentation.length);
      newCaretPosition = caretPosition - indentation.length;
    }

    /**
     * Restore the caret
     */
    textarea.setSelectionRange(newCaretPosition, newCaretPosition);
  }
}
