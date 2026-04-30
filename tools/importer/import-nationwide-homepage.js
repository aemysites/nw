/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsServiceParser from './parsers/cards-service.js';
import cardsTileParser from './parsers/cards-tile.js';
import columnsPromoParser from './parsers/columns-promo.js';

// TRANSFORMER IMPORTS
import nationwideCleanup from './transformers/nationwide-cleanup.js';
import nationwideSections from './transformers/nationwide-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-service': cardsServiceParser,
  'cards-tile': cardsTileParser,
  'columns-promo': columnsPromoParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'nationwide-homepage',
  description: 'Nationwide Insurance homepage with hero banner, product categories, and promotional content',
  urls: [
    'https://www.nationwide.com/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['.nw-home-quote-banner'],
    },
    {
      name: 'cards-service',
      instances: ['.row.text-center.align-center.nw-inner-bottom', '#p43486 section.nw-container'],
    },
    {
      name: 'cards-tile',
      instances: ['#p30097', '#p30087'],
    },
    {
      name: 'columns-promo',
      instances: ['#p43655'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.nw-home-quote-banner',
      style: 'brand-blue',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Quick Actions',
      selector: '.row.text-center.align-center.nw-inner-bottom',
      style: null,
      blocks: ['cards-service'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Product Categories',
      selector: '#p43486',
      style: 'light-grey',
      blocks: ['cards-service'],
      defaultContent: ['#p43486 .nw-heading-tiempos-md'],
    },
    {
      id: 'section-4',
      name: 'Member CTA Banner',
      selector: '#p45265',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['#p45265 .nw-cta-small'],
    },
    {
      id: 'section-5',
      name: 'Image Tiles Two-Up',
      selector: '#p30097',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Image Tiles Three-Up',
      selector: '#p30087',
      style: null,
      blocks: ['cards-tile'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'About Text',
      selector: '#p45234',
      style: null,
      blocks: [],
      defaultContent: ['#p45234 .rtc-paragraph'],
    },
    {
      id: 'section-8',
      name: 'Business CTA Banner',
      selector: '#p45310',
      style: 'dark-blue',
      blocks: [],
      defaultContent: ['#p45310 .nw-cta-small'],
    },
    {
      id: 'section-9',
      name: 'Mobile App Promo',
      selector: '#p43655',
      style: 'brand-blue',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Disclaimer',
      selector: '#p44604',
      style: null,
      blocks: [],
      defaultContent: ['#p44604 .rtc-paragraph'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  nationwideCleanup,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [nationwideSections] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
