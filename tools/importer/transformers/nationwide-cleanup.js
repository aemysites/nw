/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide cleanup.
 * Selectors from captured DOM of https://www.nationwide.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove consent/cookie overlays and hidden inputs (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#consent_blackbar',
      '#trustarcNoticeFrame',
      '#isPandP',
      '#isNvit',
    ]);
  }
  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site shell content (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      'bolt-header',
      '.nw-header__skip',
      'footer',
      '.nw-footer',
      'iframe',
      'link',
      'noscript',
    ]);
  }
}
