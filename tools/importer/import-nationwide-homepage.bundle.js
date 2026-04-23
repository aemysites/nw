var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-nationwide-homepage.js
  var import_nationwide_homepage_exports = {};
  __export(import_nationwide_homepage_exports, {
    default: () => import_nationwide_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    let bgImage = element.querySelector(".bg-image-container img");
    if (!bgImage) bgImage = element.querySelector(".large-shrink img, .large-shrink-custom img");
    if (!bgImage) {
      const allImgs = element.querySelectorAll("img[src]");
      for (const img of allImgs) {
        const src = img.getAttribute("src") || "";
        if (!src.startsWith("data:") && src.length > 0) {
          bgImage = img;
          break;
        }
      }
    }
    const heading = element.querySelector("h1, .nw-banner-media__title, .banner-title");
    const subheading = element.querySelector(".nw-banner-inpage__content h2, .banner-content-custom h2");
    const ctaLinks = element.querySelectorAll("a.find-an-agent-link, a.nw-text-sm[href]");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subheading) contentCell.push(subheading);
    ctaLinks.forEach((link) => contentCell.push(link));
    if (contentCell.length > 0) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse2(element, { document }) {
    let cardEls = element.querySelectorAll(".custom-tri-promo");
    if (cardEls.length === 0) {
      cardEls = element.querySelectorAll(":scope > .row > .column, :scope > div > .column");
    }
    const cells = [];
    cardEls.forEach((card) => {
      let icon = card.querySelector(".nw-fg-rebrand-vibrant-blue img");
      if (!icon) icon = card.querySelector('bolt-icon img, svg, img[src^="data:image/svg"]');
      if (!icon) {
        const imgs = card.querySelectorAll("img");
        for (const img of imgs) {
          const src = img.getAttribute("src") || "";
          if (src.startsWith("data:image/svg") || src.includes(".svg")) {
            icon = img;
            break;
          }
        }
      }
      const heading = card.querySelector("h3, .nw-heading-sm, .mopHeading, .custom-heading");
      const description = card.querySelector("p, .mopDesc");
      const cta = card.querySelector('a.button, a[class*="button"], a[class*="nw-button"]');
      const imageCell = icon ? [icon] : [];
      const textCell = [];
      if (heading) textCell.push(heading);
      if (description) textCell.push(description);
      if (cta) textCell.push(cta);
      if (textCell.length > 0) {
        cells.push(imageCell.length > 0 ? [imageCell, textCell] : [textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tile.js
  function parse3(element, { document }) {
    const tileLinks = element.querySelectorAll("a.nw-tile-block__tile");
    const cells = [];
    tileLinks.forEach((tile) => {
      var _a;
      let img = tile.querySelector(".nw-tile-block__image img[src]");
      if (!img) img = tile.querySelector("img[src]");
      if (!img) {
        const lazyImg = tile.querySelector("img[data-src]");
        if (lazyImg) {
          lazyImg.setAttribute("src", lazyImg.getAttribute("data-src"));
          img = lazyImg;
        }
      }
      if (!img) {
        const imgContainer = tile.querySelector(".nw-tile-block__image");
        if (imgContainer) {
          const bgStyle = ((_a = imgContainer.style) == null ? void 0 : _a.backgroundImage) || "";
          const bgMatch = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
          if (bgMatch) {
            img = document.createElement("img");
            img.src = bgMatch[1];
          }
        }
      }
      const heading = tile.querySelector(".nw-tile-block__content-subheader, h2");
      const imageCell = img ? [img] : [];
      const textCell = [];
      if (heading && tile.href) {
        const link = document.createElement("a");
        link.href = tile.href;
        link.textContent = heading.textContent.trim();
        textCell.push(link);
      } else if (heading) {
        textCell.push(heading);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-tile", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document }) {
    const columnEls = element.querySelectorAll(".rtc-paragraph, .columns");
    const cells = [];
    if (columnEls.length >= 2) {
      const col1 = columnEls[0];
      const col1Content = [];
      const col1Elements = col1.querySelectorAll("div, h3, p, span > *");
      col1Elements.forEach((el) => {
        if (el.textContent.trim()) col1Content.push(el);
      });
      if (col1Content.length === 0) col1Content.push(col1);
      const col2 = columnEls[1];
      const col2Content = [];
      const qrImage = col2.querySelector("img");
      const qrText = col2.querySelector("p");
      if (qrImage) col2Content.push(qrImage);
      if (qrText) col2Content.push(qrText);
      if (col2Content.length === 0) col2Content.push(col2);
      cells.push([col1Content, col2Content]);
    } else {
      cells.push([[element]]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/nationwide-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#consent_blackbar",
        "#trustarcNoticeFrame",
        "#isPandP",
        "#isNvit"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "bolt-header",
        ".nw-header__skip",
        "footer",
        ".nw-footer",
        "iframe",
        "link",
        "noscript"
      ]);
    }
  }

  // tools/importer/transformers/nationwide-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (section.id !== template.sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-nationwide-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-service": parse2,
    "cards-tile": parse3,
    "columns-promo": parse4
  };
  var PAGE_TEMPLATE = {
    name: "nationwide-homepage",
    description: "Nationwide Insurance homepage with hero banner, product categories, and promotional content",
    urls: [
      "https://www.nationwide.com/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".nw-home-quote-banner"]
      },
      {
        name: "cards-service",
        instances: [".row.text-center.align-center.nw-inner-bottom", "#p43486 section.nw-container"]
      },
      {
        name: "cards-tile",
        instances: ["#p30097", "#p30087"]
      },
      {
        name: "columns-promo",
        instances: ["#p43655"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".nw-home-quote-banner",
        style: "brand-blue",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Quick Actions",
        selector: ".row.text-center.align-center.nw-inner-bottom",
        style: null,
        blocks: ["cards-service"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Product Categories",
        selector: "#p43486",
        style: "light-grey",
        blocks: ["cards-service"],
        defaultContent: ["#p43486 .nw-heading-tiempos-md"]
      },
      {
        id: "section-4",
        name: "Member CTA Banner",
        selector: "#p45265",
        style: "dark-blue",
        blocks: [],
        defaultContent: ["#p45265 .nw-cta-small"]
      },
      {
        id: "section-5",
        name: "Image Tiles Two-Up",
        selector: "#p30097",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Image Tiles Three-Up",
        selector: "#p30087",
        style: null,
        blocks: ["cards-tile"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "About Text",
        selector: "#p45234",
        style: null,
        blocks: [],
        defaultContent: ["#p45234 .rtc-paragraph"]
      },
      {
        id: "section-8",
        name: "Business CTA Banner",
        selector: "#p45310",
        style: "dark-blue",
        blocks: [],
        defaultContent: ["#p45310 .nw-cta-small"]
      },
      {
        id: "section-9",
        name: "Mobile App Promo",
        selector: "#p43655",
        style: "brand-blue",
        blocks: ["columns-promo"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Disclaimer",
        selector: "#p44604",
        style: null,
        blocks: [],
        defaultContent: ["#p44604 .rtc-paragraph"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_nationwide_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_nationwide_homepage_exports);
})();
