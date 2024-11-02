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

    // Collect promises to ensure all rendering is completed
    const renderPromises = [];

    for (const node of textNodes) {
      const text = node.nodeValue;
      // Updated regex to handle multi-line expressions
      const regex = /\$([\s\S]*?)\$/g;
      let match;
      let lastIndex = 0;
      const fragments = [];

      while ((match = regex.exec(text)) !== null) {
        const [fullMatch, mathText] = match;
        const beforeMatch = text.slice(lastIndex, match.index);

        // Check if mathText contains newline characters
        const containsNewline = mathText.includes("\n");
        // Check for whitespace immediately after opening $ and before closing $
        const hasWhitespaceAroundDelimiters =
          /^\$\s/.test(fullMatch) && /\s\$$/.test(fullMatch);

        // Determine if it's math mode based on whitespace or newlines
        const isMathMode = hasWhitespaceAroundDelimiters || containsNewline;

        fragments.push(document.createTextNode(beforeMatch));

        const span = document.createElement("span");
        span.className = "math-element katex";
        if (isMathMode) {
          span.classList.add("katex-display", "math-block");
        }

        // Use wypst.render to render the math into the span element
        const renderPromise = wypst.render(mathText.trim(), span, {});
        renderPromises.push(renderPromise);

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

    // Wait for all rendering promises to complete
    await Promise.all(renderPromises);
  };

  wypst.initialize().then(() => {
    replaceMathText(document.body);
  });
});
