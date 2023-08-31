// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "extract-text") {
    getSelectedNodesText();
  } else {
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  }
};

//获取选中节点的文本
function getSelectedNodesText() {
  const selectedTexts = figma.currentPage.selection.filter(
    (node) => node.type === "TEXT"
  );
  const texts = selectedTexts.map((node) => (node as TextNode).characters);
  console.log("提取到的文本↓");
  console.log(texts);
  figma.ui.postMessage({ type: "selected-text", texts });
}
