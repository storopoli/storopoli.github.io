// Adapted from: https://github.com/Lambdaris/typst-auto-render
document.addEventListener("DOMContentLoaded", function () {
  const replaceMathText = async function (elem) {
    const textNodes = [];
    const walker = document.createTreeWalker(
      elem,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    for (const node of textNodes) {
      const text = node.nodeValue;
      const regex = /\$(.*?)\$/g;
      let match;
      let lastIndex = 0;
      const fragments = [];

      while ((match = regex.exec(text)) !== null) {
        const [fullMatch, mathText] = match;
        const beforeMatch = text.slice(lastIndex, match.index);
        const isMathMode =
          fullMatch.startsWith("$ ") && fullMatch.endsWith(" $");
        const renderedMath = await wypst.renderToString(mathText.trim());

        fragments.push(document.createTextNode(beforeMatch));
        const span = document.createElement("span");
        span.className = "math-element";
        if (isMathMode) {
          span.classList.add("katex-display");
        }
        span.innerHTML = renderedMath;
        fragments.push(span);

        lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
        fragments.push(document.createTextNode(text.slice(lastIndex)));
      }

      if (fragments.length > 0) {
        const parent = node.parentNode;
        fragments.forEach((fragment) => parent.insertBefore(fragment, node));
        parent.removeChild(node);
      }
    }
  };

  const renderMathMode = async function (expression) {
    const div = document.createElement("div");
    div.style.textAlign = "center";
    await wypst.render(expression, div, {});
    return div.innerHTML;
  };

  wypst.initialize().then(() => {
    replaceMathText(document.body);
  });
});
