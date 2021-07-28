function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
  function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function updateColorCoding() {
  Prism.highlightAll();
}

function updateParts(rContent, rTitle) {
  var myRemote= [
    {remoteName : "github", title : "GitHub"},
    {remoteName : "bitbucket", title : "Bitbucket"},
    {remoteName : "gitlab", title : "GitLab"}
    ];
  var remote;
  var getRemote = getUrlVars()["remote"];
  if (getRemote && (getRemote=="github" || getRemote=="bitbucket" || getRemote=="gitlab")) { 
    remote = myRemote.filter(obj => {
      return obj.remoteName == getRemote;
    });
  } else {
    remote = myRemote.filter(obj => {
      return obj.remoteName == "github";
    });
  }
  w3.displayObject("sidenav", remote[0]);
  w3.displayObject("mainContent", remote[0]);
  if (rContent) {
    url=window.location.href.split('?')[0];
    url=url.split("/");
    url=url[url.length - 1];
    
    if (url.includes("remote")) {
      url = url.replace("remote", remote[0].remoteName);
      url = url.replace(".asp", ".html");
    } else {
      url = url.replace(".asp", "_" + remote[0].remoteName + ".html");  
    }
    
    document.getElementById("remoteNameContent").innerHTML='<section w3-include-html="' + url + '"></section>';
    w3.includeHTML(updateColorCoding);
  } else {
    w3.includeHTML(updateColorCoding);  
  }
  if (rTitle) {
    w3.displayObject("title", remote[0]);
  }
}



