/**
 * @typedef Options
 * @property {RegExp} regex
 * @property {Modifier} modifier
 */

/**
 * @typedef Modifier
 * @property {(text: string) => string} modifyText
 * @property {(link: string) => string} modifyLink
 */

const visitWithParents = require("unist-util-visit-parents");
const flatMap = require("unist-util-flatmap");

function mergeFlags(...allFlags) {
  const set = new Set();
  for (const flags of allFlags) {
    for (const char of flags) {
      set.add(char);
    }
  }
  return [...set.values()].join("");
}

function removeExtremes(regex) {
  return new RegExp(
    regex.source.replace(/^\^/, "").replace(/\$$/, ""),
    mergeFlags("g", regex.flags)
  );
}

function createText(value) {
  return { type: "text", value: value };
}

function createLink(url, title) {
  return {
    type: "link",
    title,
    url,
    children: [createText(title)],
  };
}

/**
 * @param {Options} options
 */
function splitTextNode(textNode, options) {
  const oldText = textNode.value;
  const regex = removeExtremes(options.regex);
  const newNodes = [];
  let startTextIdx = 0;
  let output;

  const modifyText = options?.modifier?.modifyText
    ? options.modifier.modifyText
    : (v) => v;
  const modifyLink = options?.modifier?.modifyLink
    ? options.modifier.modifyLink
    : (v) => v;

  while ((output = regex.exec(oldText)) !== null) {
    if (startTextIdx !== output.index) {
      newNodes.push(
        createText(modifyText(oldText.slice(startTextIdx, output.index)))
      );
    }
    const feedId = output[0];
    newNodes.push(createLink(modifyLink(feedId), modifyText(feedId)));
    startTextIdx = regex.lastIndex;
  }

  const remainingText = oldText.slice(startTextIdx);
  if (remainingText.length > 0) {
    newNodes.push(createText(modifyText(remainingText)));
  }

  return newNodes;
}

/**
 * @param {Options} options
 */
function remarkLinkifyModifier(options) {
  const opt = options?.regex ? options : { regex: options };

  return () => (ast) => {
    const ignored = new WeakSet();
    visitWithParents(ast, "text", (textNode, parents) => {
      if (parents.some((parent) => parent.type === "link")) {
        ignored.add(textNode);
        return;
      }
    });

    flatMap(ast, (node) => {
      if (node.type !== "text") {
        return [node];
      }
      if (ignored.has(node)) {
        ignored.delete(node);
        return [node];
      }
      return splitTextNode(node, opt);
    });

    return ast;
  };
}

module.exports = remarkLinkifyModifier;
