/*jshint scripturl:true*/

var fs = require('fs'),
    page = require('webpage').create(),
    RESOURCE ={};
page.viewportSize = { width: 1000, height: 600 };
page.paperSize = {
    width: '10in',
    height: '11in',
    margin:'1cm'    
  };

RESOURCE.url = "http://www.fusioncharts.com/dev/";
RESOURCE.links =[];
RESOURCE.pageCounter = 1;

// ignoring all console log of the site
page.onConsoleMessage = (function(msg) {
    //console.log("");
});

// ignoring all javascript error of the site
page.onError = (function(msg) {
    //console.log("");
}); 

// ignoring all javascript alert of the page
page.onAlert = (function(msg) {
    //console.log("");
});

RESOURCE.removeDuplicate = function(currentLinks){
  var uniqLinks = [];
  for(var i=0; i<currentLinks.length; i++){
    var current = currentLinks[i];
    if(uniqLinks.indexOf(current) < 0)
    uniqLinks.push(current);
  } 
  return uniqLinks;  
};


RESOURCE.getLinks = function () {
  var links = page.evaluate(function(){
    var anchors = document.getElementsByTagName('a'),
        links = [];
    for(var i=0; i<anchors.length; i++) {
      var link = anchors[i].href;
      if(link !== "" && link !== 'javascript:void(0)' && typeof link !== 'object' && 
        link.indexOf('http://www.fusioncharts.com/dev/') !== -1)
        links.push(link);
    }
    return links;
  });

  if(links && links.length > 0) {
    RESOURCE.links = RESOURCE.removeDuplicate(links);
    RESOURCE.parseLinks();
  }
};

RESOURCE.parseLinks = function() {    
    openPage(RESOURCE.links.shift(),  RESOURCE.screenShots);
};

RESOURCE.removeElements = function () {
  if(page.injectJs("jquery.js")){
    page.evaluate(function(){
      //removing chart dialog box
      $('#fc_chat_layout').remove();
      //removing table-of-contents
      $('.toc').remove();
      //removing header search and version selection dropdown list
      $('.prev-doc-link.pull-right').remove();
      $('.header-menu.pull-right').remove();
      $('#form_search').remove();
      //make page-content start from left side
      $('.page-content').css({"margin-left": "10px", "margin-right": "10px" });
      
      //document.getElementById('fc_chat_layout').remove();
    });

  
  }
};


RESOURCE.screenShots = function(filename){
  RESOURCE.removeElements();
  if(!filename)
    filename = 'images-pdf/page-'+RESOURCE.pageCounter++ + '.pdf';
  page.render(filename);
  console.log(filename);
  RESOURCE.parseLinks();
};

var openPage = (function(url, callbackfunc) {
   
  console.log("** Openning --> "+ url +" **");    
  page.open(url, function(status) {
     console.log('success : ' + status);  
    if (status == 'success') {
       setTimeout(function() {
        callbackfunc();
        }, 3000);      
        
    }
  });    
});


openPage(RESOURCE.url, RESOURCE.getLinks);

