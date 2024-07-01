// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".

const LIBRARY_ANALYTICS_API_KEY = "figd_2BGa8U8eeB8G1p1RC_CcMF38Zb_uIwQnXJMNZjyT";
const FIGMA_FILE_KEY = "MeUybKfQii8pHIAjXeQSkp";
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = async msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.

  // Display Library Analytics Button Clicks
  if (msg.type === 'display-analytics') {
    
    
    fetch(`https://api.figma.com/v1/analytics/libraries/${msg.library_file_key}/actions?group_by=component`, {
      method: 'GET',
      headers: {
        'X-FIGMA-TOKEN': LIBRARY_ANALYTICS_API_KEY,
      },
    }).then((response) => {
      response.json().then((data) => {
        console.log(data);
      });
    }).catch((error) => {
      console.error(error);
    })
    // const response = await fetch(`https://httpbin.org/get?success=true`);
        
    // if (figma.currentPage.children.length == 0) figma.notify("This Figma Page seems Empty!");
    // else {
    //   const random__child_node =  figma.currentPage.children[Math.floor(Math.random() * figma.currentPage.children.length)];


    //   console.log(random__child_node);

    // }


    
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};
