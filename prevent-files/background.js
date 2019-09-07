// background.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the browser level activities (e.g. tab management, etc.)
// License: MIT
chrome.downloads.onCreated.addListener(function(item) {
    console.log(item,chrome.downloads);

    chrome.downloads.pause(item.id);

    const serviceUrl = "http://localhost:3000?checkUrl="+item.url;
    $.ajax({
        type: "GET",
        url: serviceUrl,
        crossDomain:true,
        cache:false,
        async:false,
        success: function(data){
            
            if(data['msg'] === "Allowed"){
                chrome.downloads.resume(item.id);
            }else{
                chrome.downloads.cancel(item.id);
                chrome.downloads.removeFile(item.id);
                alert("Downloading files is not permitted");
            }
       },
       error: function(jxhr){
           alert(jxhr.responseText);
       }
     });
  });