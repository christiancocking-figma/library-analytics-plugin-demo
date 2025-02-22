// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".

const LIBRARY_ANALYTICS_API_KEY = "Put your access token here";
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
    
    let libray_anayltics = {};

    // Step 2: Parse the Component Data against the components on the current page


    // Step 3: Display Analytics Information about the Components if found

    
    // const response = await fetch(`https://httpbin.org/get?success=true`);
        
    if (figma.currentPage.children.length == 0) figma.notify("This Figma Page seems Empty!");
    else {

      // Get only Instance Nodes

      const child_nodes =  figma.currentPage.children;

      // Filters all nodes on the page and checks if they are instances of Components, can't get library analytics if they are not 
      // Tied to a component
      console.log(child_nodes);
      const main_component_info = child_nodes.filter(function(e) {

        if (e.mainComponent === undefined) {
          return false; // skip
        }
        return true;
      }).map( instance_nodes => {
        if (instance_nodes.mainComponent !== undefined) return {"maincomponent_key": instance_nodes.mainComponent.key};
      });

      console.log(main_component_info);

          // Step 1: Grab Library Analytics Data from the File Key that was Specified
      fetch(`https://api.figma.com/v1/analytics/libraries/${msg.library_file_key}/actions?group_by=component`, {
        method: 'GET',
        headers: {
          'X-FIGMA-TOKEN': LIBRARY_ANALYTICS_API_KEY,
        },
      }).then((response) => {
        response.json().then((data) => {
          const parsed_analytics = parseLibraryAnalytics(main_component_info, data.rows);
          const aggregated_analytics = aggregateLibraryAnalytics(parsed_analytics);

          figma.ui.resize(750,750);
          figma.ui.postMessage({ info: { type: 'update-results', matched_analytics: {raw: parsed_analytics, aggregated: aggregated_analytics }}});
        });
      }).catch((error) => {
        console.error(error);
      })
    }
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  //figma.closePlugin();
};

function parseLibraryAnalytics (component_keys, library_data) {

  // Will return empty array in case we find no matches
  const matched_analytics_data = [];
  // Gets only component keys from the array of main component objects
  const raw_component_keys =  component_keys.map(function (e) { return e.maincomponent_key });
  // Parsing Library Analytics Data for matches against the main component keys of instances found on the Canvas
  const matched_library_nodes = library_data.forEach(function (e) {
    if (raw_component_keys.includes(e.component_key) {
      console.log("Found a Match");
      matched_analytics_data.push(e);
    }
  });
  // Returns all array Library Analytics rows eg. {week: '2023-07-02', component_key: 'e78470ee4714ffd487643ac9a03174ebd5e14cfa', component_name: 'Figma App Icon', detachments: 0, insertions: 5}
  return matched_analytics_data;
}

function aggregateLibraryAnalytics (parsed_analytics_data) {

 const aggregated_component_data = {};

 parsed_analytics_data.forEach(function(library_analytics_row) {

  if (!(library_analytics_row.component_key in aggregated_component_data)) {
    // Created the first entry of the aggregated data
    aggregated_component_data[library_analytics_row.component_key] = { 
                                                component_name: library_analytics_row.component_name,
                                                detachments: library_analytics_row.detachments,
                                                insertions: library_analytics_row.insertions
    }
  } else {
    // Add the row data to the existing aggregated data
    aggregated_component_data[library_analytics_row.component_key].detachments = aggregated_component_data[library_analytics_row.component_key].detachments + library_analytics_row.detachments;
    aggregated_component_data[library_analytics_row.component_key].insertions = aggregated_component_data[library_analytics_row.component_key].insertions + library_analytics_row.insertions;
  }
 });
 return aggregated_component_data;
}
