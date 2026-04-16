/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide cleanup.
 * Selectors from captured DOM of https://www.nationwide.com
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie/consent dialogs, tracking iframes, hidden inputs
    // Found in captured HTML: <iframe title="Adobe ID Syncing iFrame">, <input id="isPandP">, <input id="isNvit">
    WebImporter.DOMUtils.remove(element, [
      'iframe[title="Adobe ID Syncing iFrame"]',
      '#truste-consent-track',
      '[id*="CybotCookiebot"]',
      'input#isPandP',
      'input#isNvit',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable content: header, footer, nav, skip links
    // Found in captured HTML: <bolt-header id="header">, <footer id="p37659">, <a class="nw-header__skip">
    WebImporter.DOMUtils.remove(element, [
      'bolt-header',
      'footer',
      'a.nw-header__skip',
      'iframe',
      'link',
      'noscript',
    ]);
    // Clean tracking attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-track');
      el.removeAttribute('onclick');
    });
  }
}
