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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(".bg-image-container img, .large-shrink img");
    const heading = element.querySelector("h1, h2.nw-heading-tiempos-md, .banner-title");
    const subtitle = element.querySelector(".nw-banner-inpage__content h2, .banner-content-custom h2");
    const ctaLinks = Array.from(element.querySelectorAll("a.find-an-agent-link, .nw-banner-inpage__content a"));
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (subtitle) contentCell.push(subtitle);
    ctaLinks.forEach((link) => contentCell.push(link));
    if (contentCell.length > 0) cells.push(contentCell);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icon.js
  function parse2(element, { document: document2 }) {
    const cardItems = Array.from(element.querySelectorAll(".custom-tri-promo, .column.small-12.large-4"));
    if (cardItems.length === 0) return;
    const cells = [];
    cardItems.forEach((card) => {
      const heading = card.querySelector("h3");
      const desc = card.querySelector(":scope > p, .mopDesc");
      const cta = card.querySelector(':scope > a, a.button, a[class*="button"]');
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (desc) contentCell.push(desc);
      if (cta) contentCell.push(cta);
      if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, { name: "cards-icon", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-tile.js
  function parse3(element, { document: document2 }) {
    const tileLinks = Array.from(element.querySelectorAll("a.nw-tile-block__tile"));
    if (tileLinks.length === 0) return;
    const tileData = tileLinks.map((tile) => {
      const imageDiv = tile.querySelector(".nw-tile-block__image");
      const headingEl = tile.querySelector(".nw-tile-block__content-subheader");
      let bgUrl = null;
      if (imageDiv) {
        const bgStyle = imageDiv.style.backgroundImage || "";
        const match = bgStyle.match(/url\(["']?([^"')]+)["']?\)/);
        if (match) {
          bgUrl = match[1];
          if (bgUrl.startsWith("/")) {
            bgUrl = "https://www.nationwide.com" + bgUrl;
          }
        }
      }
      if (!bgUrl) {
        const imgEl = imageDiv ? imageDiv.querySelector("img") : tile.querySelector("img");
        if (imgEl) {
          bgUrl = imgEl.getAttribute("src") || imgEl.src || null;
        }
      }
      return {
        imgSrc: bgUrl,
        headingText: headingEl ? headingEl.textContent.trim() : null,
        href: tile.href || tile.getAttribute("href")
      };
    });
    const cells = [];
    tileData.forEach((tile) => {
      let img = null;
      if (tile.imgSrc) {
        img = document2.createElement("img");
        img.src = tile.imgSrc;
        img.alt = tile.headingText || "";
      }
      const contentCell = [];
      if (tile.headingText && tile.href) {
        const link = document2.createElement("a");
        link.href = tile.href;
        link.textContent = tile.headingText;
        const h2 = document2.createElement("h2");
        h2.append(link);
        contentCell.push(h2);
      }
      if (img && contentCell.length > 0) {
        cells.push([img, contentCell]);
      } else if (contentCell.length > 0) {
        cells.push(contentCell);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, { name: "cards-tile", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-promo.js
  function parse4(element, { document: document2 }) {
    const columnDivs = Array.from(element.querySelectorAll(".rtc-paragraph, .columns.rtc-paragraph"));
    if (columnDivs.length < 2) return;
    const col1 = columnDivs[0];
    const col1Content = [];
    const introText = col1.querySelector(".nw-text-lg, div.nw-text-lg");
    if (introText) col1Content.push(introText);
    const heading = col1.querySelector("h3");
    if (heading) col1Content.push(heading);
    const featureItems = Array.from(col1.querySelectorAll("span > div"));
    const ul = document2.createElement("ul");
    featureItems.forEach((item) => {
      const text = item.textContent.trim().replace(/^\s*/, "");
      if (text) {
        const li = document2.createElement("li");
        li.textContent = text;
        ul.append(li);
      }
    });
    if (ul.children.length > 0) col1Content.push(ul);
    const col2 = columnDivs[1];
    const col2Content = [];
    const qrImage = col2.querySelector("img");
    if (qrImage) col2Content.push(qrImage);
    const caption = col2.querySelector("p");
    if (caption) col2Content.push(caption);
    const cells = [];
    if (col1Content.length > 0 || col2Content.length > 0) {
      cells.push([col1Content, col2Content]);
    }
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/transformers/nationwide-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        'iframe[title="Adobe ID Syncing iFrame"]',
        "#truste-consent-track",
        '[id*="CybotCookiebot"]',
        "input#isPandP",
        "input#isNvit"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "bolt-header",
        "footer",
        "a.nw-header__skip",
        "iframe",
        "link",
        "noscript"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-track");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/nationwide-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const selector = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selector) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-icon": parse2,
    "cards-tile": parse3,
    "columns-promo": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Nationwide homepage with hero, product offerings, and promotional content",
    urls: [
      "https://www.nationwide.com"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [".nw-home-quote-banner"]
      },
      {
        name: "cards-icon",
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
      { id: "section-1", name: "Hero Banner", selector: ".nw-home-quote-banner", style: "dark-blue", blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-2", name: "Quick Actions", selector: ".row.text-center.align-center.nw-inner-bottom", style: null, blocks: ["cards-icon"], defaultContent: [] },
      { id: "section-3", name: "Product Categories", selector: "#p43486", style: "light-grey", blocks: ["cards-icon"], defaultContent: ["#p43486 .nw-heading-tiempos-md"] },
      { id: "section-4", name: "Member CTA Banner", selector: "#p45265", style: "dark-blue", blocks: [], defaultContent: ["#p45265 .nw-cta-small"] },
      { id: "section-5", name: "Image Tiles Two Up", selector: "#p30097", style: null, blocks: ["cards-tile"], defaultContent: [] },
      { id: "section-6", name: "Image Tiles Three Up", selector: "#p30087", style: null, blocks: ["cards-tile"], defaultContent: [] },
      { id: "section-7", name: "About Text", selector: "#p45234", style: null, blocks: [], defaultContent: ["#p45234 .rtc-paragraph"] },
      { id: "section-8", name: "Business CTA Banner", selector: "#p45310", style: "dark-blue", blocks: [], defaultContent: ["#p45310 .nw-cta-small"] },
      { id: "section-9", name: "Mobile App Promo", selector: "#p43655", style: "brand-blue", blocks: ["columns-promo"], defaultContent: [] },
      { id: "section-10", name: "Disclaimer", selector: "#p44604", style: null, blocks: [], defaultContent: ["#p44604 .rtc-paragraph"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
