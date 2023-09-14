// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".

const version = "v1.1.5";

figma.showUI(__html__, {
  height: 444,
  title: "angcyo " + version,
});

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === "extract-text") {
    getSelectedNodesText();
  } else if (msg.type === "putItem") {
    //保存数据
    figma.clientStorage.setAsync("angcyo", msg.data).then();
  } else if (msg.type === "extractSvg") {
    if (figma.currentPage.selection.length === 0) {
      figma.notify("没有选中节点,请先选中节点.");
      return;
    }
    extractSvg(figma.currentPage.selection[0]);
  } else if (msg.type === "toAndroidSvg") {
    if (figma.currentPage.selection.length === 0) {
      figma.notify("没有选中节点,请先选中节点.");
      return;
    }
    toAndroidSvg(figma.currentPage.selection[0]);
  } else if (msg.type === "notify") {
    figma.notify(msg.data);
  } else {
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    figma.closePlugin();
  }
};

//获取保存的数据
figma.clientStorage.getAsync("angcyo").then((data) => {
  //console.log("获取到的数据↓");
  //console.log(data);
  figma.ui.postMessage({ type: "getItem", data });
});

//获取选中节点的文本
function getSelectedNodesText() {
  if (figma.currentPage.selection.length === 0) {
    figma.notify("没有选中节点,请先选中节点.");
    return;
  } else {
    figma.notify("正在提取节点文本,请稍等...");
  }

  const nodes: SceneNode[] = [];
  traverse(figma.currentPage.selection, (node) => {
    nodes.push(node);
  });

  //如果没有选中节点
  if (nodes.length === 0) {
    figma.notify("没有选中节点,请先选中节点.");
  } else {
    //过滤文本节点
    const texts = nodes
      .filter((node) => node.type === "TEXT")
      .map((node) => (node as TextNode).characters);
    console.log("提取到的文本↓");
    console.log(texts);
    figma.ui.postMessage({ type: "selected-text", texts });
  }
}

// 递归获取所有节点
function traverse(
  nodes: ReadonlyArray<SceneNode>,
  callback: (node: SceneNode) => void
) {
  nodes.forEach((node) => {
    traverseNode(node, callback);
  });
}

function traverseNode(node: SceneNode, callback: (node: SceneNode) => void) {
  if ("children" in node) {
    node.children.forEach((child) => {
      traverseNode(child, callback);
    });
  }
  callback(node);
}

// 提取节点svg数据
function extractSvg(node: SceneNode) {
  console.log(node.name, node.type);
  console.log(node);
  //导出json

  node.exportAsync({ format: "SVG_STRING" }).then((result) => {
    console.log(result);
    figma.ui.postMessage({ type: "extractSvg", data: result });
  });
}

// 将节点转换为Android svg xml数据
function toAndroidSvg(node: SceneNode) {
  console.log(node.name, node.type);
  console.log(node);
  //导出json

  node.exportAsync({ format: "SVG_STRING" }).then((result) => {
    console.log(result);
    figma.ui.postMessage({ type: "toAndroidSvg", data: result });
    //svg 数据解析
  });
}
