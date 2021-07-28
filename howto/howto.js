function init_pagination() {
  var pagescount, i, txt = "", activePage, fromPos, toPos, x, prevPage, nextPage, able = "";
  pagescount = 8;
  activePage = window.location.pathname;
  if (activePage.indexOf(".asp") == -1) {activePage = "/howto/default.asp";}
  if (activePage.indexOf("default.asp") > -1) {
    activePage = 1;
  } else {
    fromPos = activePage.indexOf("default_page") + 12;
    toPos = activePage.indexOf(".asp");
    activePage = activePage.substring(fromPos, toPos);
  }
  if (activePage == 1) {
    able = " pagdisabled"
    prevPage = "default.asp"
  } else if (activePage == 2) {
    prevPage = "default.asp";
  } else {
    prevPage = "default_page" + (activePage - 1) + ".asp";
  }
  if (activePage == pagescount) {
    nextPage = "default.asp";
  } else {
    nextPage = "default_page" + (parseInt(activePage) + 1) + ".asp";
  }
  for (i = 1; i <= pagescount; i++) {
    defPage = "default_page" + i + ".asp";
    if (i == 1) {
      txt += "<a class='howtopag_item" + able + "' href='" + prevPage + "'>&#10094;</a>";
      defPage = "default.asp";
    }
    txt += "<a class='howtopag_item' href='" + defPage + "'>" + i + "</a>";
    if (i == pagescount) {
      txt += "<a class='howtopag_item' href='" + nextPage + "'>&#10095;</a>";
    }
  }
  x = document.getElementsByClassName("howtopag");
  for (i = 0; i < x.length; i++) {
    x[i].innerHTML = txt;
    x[i].getElementsByClassName("howtopag_item")[activePage].classList.add("pagactive");
  }  
}

