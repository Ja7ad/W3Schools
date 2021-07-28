//Appml 2.0.3- Created by Jan Egil Refsnes for W3Schools. Please don't remove this line.
"use strict";
var appmlObjects = [];
var w3schoolsWebSQLOK = !!window.openDatabase;
function appml(appmlname) {
    var i;
    for (i = 0; i < appmlObjects.length; i += 1) {
        if (appmlname == appmlObjects[i].appName) {return appmlObjects[i]; }
    }
}
(function () {
    var x;
    x = function () { var z; z = new AppML("", "", "invoke"); z.invokeAppML(); };
    if (window.addEventListener) {
        window.addEventListener("load", x);
    } else if (window.attachEvent) {
        window.attachEvent("onload", x);
    }
})();
function AppML(container, appsrc, appmlname) {
    if (appmlname != "invoke") {
        appmlObjects.push(this);
    }
    this.appName = appmlname;
    if (container !== undefined) {
        if (typeof container === "object") {
            this.container = container;
        } else {
            this.container = document.getElementById(container);
        }
    }
    if (this.container === undefined || this.container === null) {
        if (container !== "" && container !== undefined) {
            window.alert("The container '" + container + "' does not exist.");
          return -1;
      }
  }
    if (typeof window[appsrc] == "object") {
        this.dataObject = appsrc;
    } else {
        this.dataSource = appsrc;
    }
    this.error = {};
    this.appmlID = "";
    this.displayType = "list";
    this.queryFields = [];
    this.queryValues = [];
    this.queryDisplayValues = [];
    this.queryTypes = [];
    this.queryOperators = [];
    this.queryDisplayOperators = [];
    this.orderBys = [];
    this.orderByDirections = [];
    this.maxRecords = 0;
    this.data = {};
    this.data.keyField = "";    
    this.data.filteritems = [];
    this.data.sortitems = [];
    this.invokeAppML = function () {
        var z, i, a, datasource, controller, appmlid, count, xmlhttp, att;
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i += 1) { //Manage Includes:
            if (z[i].getAttribute("appml-include-html")) {
                a = z[i].cloneNode(false);
                xmlhttp = this.xmlHttp(z[i].getAttribute("appml-include-html"), "", "GET", false);
                a.removeAttribute("appml-include-html");
                a.innerHTML = xmlhttp.responseText;
                z[i].parentNode.replaceChild(a, z[i]);
            }
        }
        for (i = 0; i < z.length; i += 1) { //Manage Appml Applications:
            if (z[i].hasAttributes && ((att = z[i].getAttribute("appml-controller")) !== null || (att = z[i].getAttribute("appml-data")) !== null)) {
                controller = z[i].getAttribute("appml-controller");
                datasource = z[i].getAttribute("appml-data");
                appmlid = z[i].id;
                z[i].removeAttribute("appml-controller");
                if (controller || datasource) {
                    new AppML(z[i], datasource, appmlid);
                    count = appmlObjects.length;
                    if (controller) {
                        appmlObjects[count-1].controller = controller;
                    }
               }
           } 
        }
        for (i = appmlObjects.length -1; i > -1; i -= 1) {
            if (appmlObjects[i].controller) {
                if (typeof window[appmlObjects[i].controller] == "undefined") {
                    window.alert("The controller " + controller + " does not exist");
                } else {
                    appmlObjects[i].message = "ready";
                    if (window[appmlObjects[i].controller](appmlObjects[i]) == -1) {
                        continue;
                    } else {
                        appmlObjects[i].run();
                    }
                }
            } else {
                appmlObjects[i].run();
            }
        }
    };
    this.appmlInit = function (id) {
        this.getData(1, id);
    };
    this.gotData = function () {
        this.message = "loaded";
        if (this.controller) {
            window[this.controller](this);
        }
        this.displayHTML();
    };
    this.run = function (id) {
        if (this.getData(1, id) === -1) {return -1; }
    };
    this.fnpl = function (nav) {
        this.getData(nav);
    };
    this.getData = function (nav, id) {
        var navigate = nav, fromrec, xmlhttp, xml = "", errmsg = null, i, cc, ext;
        if (id) {this.appmlID = id; }       
        if (navigate === 1) {navigate = "first"; }
        if (!navigate || navigate === "") {navigate = "first"; }
        if (navigate === "first") {fromrec = 1; }
        if (navigate === "next") {fromrec = (this.data.recPos + this.rowsperpage); }
        if (navigate === "previous") {
          fromrec = (this.data.recPos - this.rowsperpage);
          if (fromrec < 1) {fromrec = 1; }
        }
        if (navigate === "last") {fromrec = -1; }
        if (navigate === "same") {fromrec = this.data.fromRec; }
        if (this.dataSource) {
            if (this.dataSource.indexOf(".") == -1 && this.dataSource.indexOf("local?") == -1) {errmsg = "The datasource " + this.dataSource + " does not exist"; }
            if (errmsg == null && this.dataSource.indexOf("?model=") > -1) {
            this.data.records = [];
            if (this.appmlID === "NULL") {fromrec = 0; }
        this.app = {};
        this.app.displayType = this.displayType.toLowerCase();
        this.app.action = "GET";
        this.app.appmlid = this.appmlID;
        this.app.rowsperpage = this.rowsperpage;
        this.app.totalRecCounter = this.data.totalRecCounter;
        this.app.fromrec = fromrec;
        this.app.filters = {};
        this.app.filters.queryFields = this.queryFields;
        this.app.filters.queryOperators = this.queryOperators;
        this.app.filters.queryValues = this.queryValues;
        this.app.filters.orderBys = this.orderBys;
        this.app.filters.orderByDirections = this.orderByDirections;
        xml = JSON.stringify(this.app);
            //this.displayMessage("Request to the server:\n" + xml);
          if (this.dataSource.substr(0,12) === "local?model=") {
                    ext = ".js";
                    if (this.dataSource.substr(12).indexOf(".") > -1) {ext = ""; }
                  this.appFile = this.dataSource.substr(12) + ext;
                  localStorage(this, this.callBack);
                  return -1;
              }
                xmlhttp = this.xmlHttp(this.dataSource, xml, "POST", false);
            } else if (errmsg == null) {
                xmlhttp = this.xmlHttp(this.dataSource, "", "GET", false);
            }
          //this.displayMessage("Answer from the server:\n" + xmlhttp.responseText);
            if (errmsg == null) {
                try {
                this.data = JSON.parse(xmlhttp.responseText);
                } catch (er) {
                  errmsg = xmlhttp.responseText;
                }
                if (xmlhttp.status == 404) {errmsg = "The page cannot be found: " + this.dataSource; }
                if (this.data.error) {errmsg = this.data.error; }
            }
            if (errmsg !== null) {
            errmsg = this.translate(errmsg);
              if (errmsg === "") {errmsg = "Empty response."; }
              try {
                  this.displayMessage(errmsg);
              } catch (er) {
                  window.alert(errmsg);
              }
              return -1;
          }
        } else if (this.dataObject) {
          this.data = window[this.dataObject];
        }
        this.data.dateFormat = (this.data.dateFormat || "dd.mm.yyyy");
        this.rowsperpage = (this.rowsperpage || this.data.rowsperpage); 
        if (this.data.records) {
            this.data.itemNames = [];
            i = -1;
            for (cc in this.data.records[0]) {
                i += 1;
                this.data.itemNames[i] = cc;
            }
        }
        this.gotData();
    };
    this.displayHTML = function () {
        var arr = [], a, l, ll, rowClone, x, j, i, ii, iii, cc, repeat, repeatObj, repeatX = "";
        //if (this.container) {this.container.style.display = ""; }
        if (this.messageDIV) {this.closeMessage(); }
        if (!this.template) {manageTemplate(this); }
        if (!this.template) {return false; }
        if (this.template === null) {
            this.displayMessage("The template does not exist.");
            return false;
        }
        //if (this.data.records && this.data.records.length === 0) {this.container.innerHTML = ""; return false; }
        this.html = this.template.cloneNode(true);
        arr = this.getElementsByAttribute(this.html, "appml-repeat");
        l = arr.length;
        for (j = 0; j < l; j += 1) {
            cc = arr[j].getAttribute("appml-repeat").split(" ");
            if (cc.length == 1) {
                repeat = cc[0];
            } else {
                repeatX = cc[0];
                repeat = cc[2];
            }
            arr[j].removeAttribute("appml-repeat");
            repeatObj = (eval("this.data." + repeat) || eval("this." + repeat));
            if (!repeatObj) {
                this.displayMessage("appml-repeat must be an array.\n\n'" + repeat + "' is not an Array.\n\n");
                return -1;
            }
            if (repeatObj && typeof repeatObj === "object" && repeatObj.length != "undefined") {
                i = 0;
        for (x in repeatObj) {
                    i += 1;
            rowClone = arr[j].cloneNode(true);
                    rowClone = this.needleInHaystack(rowClone, "element", repeatX, repeatObj[x]);
                    a = rowClone.attributes;
                    for (ii = 0; ii < a.length; ii += 1) {
                        a[ii].value = this.needleInHaystack(a[ii], "attribute", repeatX, repeatObj[x]).value;
                    }
            if (i === repeatObj.length) {
                arr[j].parentNode.replaceChild(rowClone, arr[j]);
            } else {
                arr[j].parentNode.insertBefore(rowClone, arr[j]);
            }
        }
            }
        }
        this.html = this.needleInHaystack(this.html, "element");
        if (this.data.records) {
            for (i = 1; i <= this.data.records.length; i += 1) {
                for (j = 0; j < 3; j += 1) {
                    if (j === 0) {a = this.html.getElementsByTagName("select"); }
                    if (j === 1) {a = this.html.getElementsByTagName("input"); }
                    if (j === 2) {a = this.html.getElementsByTagName("textarea"); }
                    l = a.length;
                    for (ii = 0; ii < l; ii += 1) {
                        ll = this.data.itemNames.length;
                        for (iii = 0; iii < ll; iii += 1) {
                            if (a[ii].id.toLowerCase() === this.data.itemNames[iii].toLowerCase()) {a[ii].value = this.data.records[i - 1][this.data.itemNames[iii]]; }
                        }
                    }
                }
            }
        }
        this.container.parentNode.replaceChild(this.html, this.container);
        this.container = this.html;
        this.setCommandsClick();
        this.message = "done";
        if (this.controller) {
            window[this.controller](this);
        }
    };
    this.needleInHaystack = function (elmnt, typ, repeatX, x) {
        var rowClone, pos1, haystack, pos2, needle = [], needleToReplace, i, cc, replaceFast = -1, r;
        rowClone = elmnt;
      pos1 = 0;
      while (pos1 > -1) {
            if (typ == "attribute") {
                haystack = rowClone.value;
            } else {
                haystack = rowClone.innerHTML;
            }
          pos1 = haystack.indexOf("{{", pos1);
          if (pos1 === -1) {break; }
          pos2 = haystack.indexOf("}}", pos1 + 1);
          needleToReplace = haystack.substring(pos1 + 2, pos2);
          needle = needleToReplace.split("||");
            for (i = 0; i < needle.length; i += 1) {
                this.display = {};
                needle[i] = appmlTrim(needle[i]);
                this.display.name = needle[i];
              try {
                  this.display.value = eval("this.data." + needle[i]);
              } catch (er) {
                  this.display.value = undefined;
              }
              if (this.display.value == undefined) {
                  try {
                      this.display.value = eval("this." + needle[i]);
                  } catch (er) {
                      this.display.value = undefined;
                  }
              }
              if (this.display.value == undefined) {
                  try {
                      cc = needle[i].split(".");
                      if (cc[0] == repeatX) {this.display.value = x[cc[1]]; this.display.name = cc[1]; }
                  } catch (er) {
                      this.display.value = undefined;
                        this.display.name = needle[i];
                  }
              }
              if (this.display.value == undefined) {
                 try {
                      this.display.value = x[needle[i]];
                  } catch (er) {
                      this.display.value = undefined;
                  }
              }
              if (this.display.value == undefined) {
                  try {
                      if (needle[i] == repeatX) {this.display.value = x; }
                  } catch (er) {
                      this.display.value = undefined;
                  }
              }
                if (this.display.value != undefined && this.controller) {
                    this.message = "display";
                    window[this.controller](this);
                    break;
                }
            }
            if (this.display.value != undefined) {
              r = "{{" + needleToReplace + "}}";
                if (typ == "attribute") {
                rowClone.value = rowClone.value.replace(r, this.display.value);
                } else {
                if (replaceFast === -1) {replaceFast = checkReplaceInnerHTML(rowClone); }
                        this.replaceHTML(rowClone, r, this.display.value, replaceFast);
                    }
                }
          pos1 = pos1 + 1;
      }
        return rowClone;
    };    
    this.replaceHTML = function (a, r, result, replaceFast) {
        var b, bb, l, lll, i, iii, iiii;
        if (a.hasAttributes()) {
            b = a.attributes;
            l = b.length;
            for (i = 0; i < l; i += 1) {
                if (b[i].value.indexOf(r) > -1) {b[i].value = b[i].value.replace(r, result); }
            }
        }
        if (replaceFast === 1) {
            a.innerHTML = a.innerHTML.replace(r, result);
        } else {
            b = a.getElementsByTagName("*");
            l = b.length;
            if (l == 0 && a.innerHTML != "") {
                if (a.innerHTML.indexOf(r) > -1) {a.innerHTML = a.innerHTML.replace(r, result); }
            }
            for (iii = 0; iii < l; iii += 1) {
                if (b[iii].outerHTML.indexOf(r) > -1) {
                    if (b[iii].tagName !== "TBODY" && b[iii].tagName !== "TR") {
                        if (b[iii].innerHTML.indexOf(r) > -1) {b[iii].innerHTML = b[iii].innerHTML.replace(r, result); }
                    } else {
                        if (b[iii].hasAttributes()) {
                            bb = b[iii].attributes;
                            lll = bb.length;
                            for (iiii = 0; iiii < lll; iiii += 1) {
                                if (bb[iiii].value.indexOf(r) > -1) {bb[iiii].value = bb[iiii].value.replace(r, result); }
                            }
                        }
                    }
                }
            }
            b = a.childNodes;
            l = b.length;
            for (iii = 0; iii < l; iii += 1) {
                if (b[iii].nodeName !="#text" && b[iii].hasAttributes()) {
                    bb = b[iii].attributes;
                    lll = bb.length;
                    for (iiii = 0; iiii < lll; iiii += 1) {
                        if (bb[iiii].value.indexOf(r) > -1) {bb[iiii].value = bb[iiii].value.replace(r, result); }
                    }
                }
            }
        }
    };
    this.getElement = function (id, parent) {//Search within a specified element, or the appml container if no parent is defined. Return the element with the specified id:
        var parentObj = (parent || this.container);
        if (!parentObj) {return false; }
        var y = parentObj.getElementsByTagName("*"), l = y.length, i, z = id.toUpperCase();
        for (i = 0; i < l; i += 1) {
            if (y[i].id.toUpperCase() === z) {return y[i]; }
        }
    };
    this.getElementsByAttribute = function (x, att) {//Search within a specified element, and return all elements with the specified attribute
        var arr = [], arrCount = -1, i, l, y = x.getElementsByTagName("*"), z = att.toUpperCase();
        l = y.length;
        for (i = -1; i < l; i += 1) {
            if (i == -1) {y[i] = x; }
            if (y[i].getAttribute(z) !== null) {arrCount += 1; arr[arrCount] = y[i];}
        }
        return arr;
    };
    this.setCommandsClick = function () {
        var cc, i, x, typ, fc, recout, from, to, count, obj = this;
        cc = this.getElement("appmlbtn_query");
        if (cc) {cc.onclick = function () {obj.appmlQuery(); }; }
        cc = this.getElement("appmlbtn_queryOK");
        if (cc) {cc.onclick = function () {obj.makeQuery(); }; }
        cc = this.getElement("appmlbtn_queryClose");
        if (cc) {cc.onclick = function () {obj.getElement("appml_filtercontainer").style.display="none"; }; }
        cc = this.getElement("appmlbtn_new");
        if (cc) {cc.onclick = function () {obj.appmlNew(); }; }
        cc = this.getElement("appmlbtn_save");
        if (cc) {cc.onclick = function () {obj.putRecord("UPDATE"); }; }
        cc = this.getElement("appmlbtn_delete");
        if (cc) {cc.onclick = function () {obj.deleteRecord(); }; }
        cc = this.getElement("appmlbtn_close");
        if (cc) {cc.onclick = function () {obj.closeForm(); }; }
        if (!this.data.records) {return false; }
        fc = this.data.records.length;
        from = this.data.fromRec; to = this.data.toRec; count = this.data.totalRecCounter;
        if (this.displayType.toUpperCase() != "LIST" && this.displayType.toUpperCase() != "FORM") {return false; }
        for (i = 1; i <= 4; i += 1) {
            typ = "";
            if (i === 1) {
                x = "first";
                if (from <= 1 && (to===fc || to===count)) {typ = "disable"; }
            }
            if (i === 2) {
                x = "previous";
                if (from <= 1) {typ = "disable"; }
            }
            if (i === 3) {
                x = "next";
                if (to === count) {typ = "disable"; }
            }
            if (i === 4) {
                x = "last";
                if (((to === count) && ((Number(from) - 1) === (Number(to) - Number(fc)))) || (Number(count) < Number(fc))) {typ = "disable"; }
            }
            if (this.getElement("appmlbtn_" + x) && typ === "disable") {
                this.disableFNPL(x);
            } else {
                this.enableFNPL(x);
            }
        }
        if (to === "0") {from = "0"; }
        recout = from + " - " + to + " " + this.translate("APPML_MESSAGE_OF") + " " + count;
        if (this.maxRecords !== 0) {if (Number(count) >= Number(this.maxRecords)) {recout = recout + "+"; } }
        cc = this.getElement("appmlbtn_text");
        if (cc) {cc.innerHTML = recout; }
    };
    this.disableFNPL = function (nav) {
        if (this.getElement("appmlbtn_" + nav)) {
            addClass(this.getElement("appmlbtn_" + nav), "disabled");
            addClass(this.getElement("appmlbtn_" + nav), "w3-disabled");            
            this.getElement("appmlbtn_" + nav).onclick = function () {return false; };
        }
    };
    this.enableFNPL = function (nav) {
        var obj = this;
        if (this.getElement("appmlbtn_" + nav)) {
            removeClass(this.getElement("appmlbtn_" + nav), "disabled");
            removeClass(this.getElement("appmlbtn_" + nav), "w3-disabled");            
            this.getElement("appmlbtn_" + nav).onclick = function () {obj.fnpl(nav); };
        }
    };
    this.translate = function (txt) {
      var patt;
      patt = /APPML_ERR_USN_OR_PWD_REQ/g; txt = txt.replace(patt, "Username or password required");
      patt = /APPML_ERR_ACTION_REQ/g; txt = txt.replace(patt, "Action required");      
      patt = /APPML_ERR_MODEL_REQ/g; txt = txt.replace(patt, "Model required");      
      patt = /APPML_ERR_MODEL_ERR/g; txt = txt.replace(patt, "Error in Model");
      patt = /APPML_ERR_NO_LOGIN/g; txt = txt.replace(patt, "You are not logged in");
      patt = /APPML_ERR_NOT_AUTHORIZED/g; txt = txt.replace(patt, "You are not authorized to perform this action");      
      patt = /APPML_ERR_DATASOURCE_REQ/g; txt = txt.replace(patt, "Datasource required");      
      patt = /APPML_ERR_KEYFIELD_REQ/g; txt = txt.replace(patt, "Keyfield required");      
      patt = /APPML_ERR_MAINTABLE_REQ/g; txt = txt.replace(patt, "Maintable required");      
      patt = /APPML_ERR_ILLEGAL_ACTION/g; txt = txt.replace(patt, "Illegal action");      
      patt = /APPML_ERR_DATAMODEL/g; txt = txt.replace(patt, "Error in datamodel");      
      patt = /APPML_ERR_INPUT_MIN/g; txt = txt.replace(patt, "Minimum value error");      
      patt = /APPML_ERR_INPUT_MAX/g; txt = txt.replace(patt, "Maximum value error");      
      patt = /APPML_ERR_INPUT_REQ/g; txt = txt.replace(patt, "Required value error");      
      patt = /APPML_ERR_ILLEGAL_QUERY/g; txt = txt.replace(patt, "Illegal query error");      
      patt = /APPML_ERR_UKNOWN_DB/g; txt = txt.replace(patt, "Unknown database");      
      patt = /APPML_ERR_UKNOWN_DB_FIELD/g; txt = txt.replace(patt, "Unknown database field");      
      patt = /APPML_ERR_INVALID_KEY/g; txt = txt.replace(patt, "Invalid key");      
      patt = /APPML_ERR_ERROR/g; txt = txt.replace(patt, "Error");      
      patt = /APPML_MESSAGE_RECORD_UPDATED/g; txt = txt.replace(patt, "Record updated");      
      patt = /APPML_MESSAGE_RECORD_ADDED/g; txt = txt.replace(patt, "Record added");
      patt = /APPML_MESSAGE_RECORD_DELETED/g; txt = txt.replace(patt, "Record deleted");
      patt = /APPML_MESSAGE_OF/g; txt = txt.replace(patt, "of");      
      return txt;
    };
    this.displayMessage = function (txt) {
        var messageDIV = (this.messageDIV || this.getElement("appmlmessage") || "");
        if (messageDIV === "") {

            if (txt === "") {return; }
            window.alert(txt); return;
        }
        if (txt === "") {
            messageDIV.innerHTML = "";
            messageDIV.style.display = "none";
        } else {
            this.getElement("message", messageDIV).innerHTML = txt;
            messageDIV.style.display = "block";
        }
    };
    this.setError = function (n, desc) {
        this.error.number = n;
        this.error.description = desc;
        if (this.controller) {
            this.message = "error";
            if (window[this.controller](this) == -1) {return -1; }
        }
        this.displayMessage(this.error.description);
    };
    this.putRecord = function (param) {
        var xml, i, l, felmnt, fname, fvalue, errmsg = "", http, httpText, action = param;
        if (this.controller) {
            this.message = "submit";
            if (window[this.controller](this) == -1) {return -1; }
        }
        if (action === "UPDATE") {
            if (this.data.records[0][this.data.keyField] === "") {action = "ADD"; }            
        }
    this.app = {};
    this.app.action = action;
    if (action !== "ADD") {
        this.app.appmlid = this.data.records[0][this.data.keyField];
    }
    this.app.record = {};
    this.app.record.items = [];
    this.app.record.values = [];
    this.app.record.types = [];
        if (action !== "DELETE") {
            l = this.data.updateItems.length;
            for (i = 0; i < l; i += 1) {
                felmnt = this.getElement(this.data.updateItems[i].item);
                if (felmnt) {
                    fname = felmnt.id;
                    fvalue = felmnt.value;
                    //apptyp = "number";
                    //for (j = 0; j < this.data.itemCounter; j += 1) {
                    //    if (this.data.itemNames[j].toLowerCase() === fname.toLowerCase()) {apptyp = this.data.itemTypes[j]; }
                    //}
                    //if (apptyp === "date") {fvalue = reformatDate(fvalue, this.data.dateFormat); }
          this.app.record.items.push(fname);
          this.app.record.values.push(fvalue);
          //this.app.record.types.push(apptyp);
                }
            }
        }
      if (this.dataSource.substr(0,5) === "local") {
            this.appFile = this.dataSource.substr(6);
            localStorage(this);
            return;
        }
    xml = JSON.stringify(this.app);
        //this.displayMessage("UPDATE to the server:\n" + xml);
        http = this.xmlHttp(this.dataSource, xml, "POST");
        //this.displayMessage("Answer from the server:\n" + http.responseText);
        try {
          this.upd = JSON.parse(http.responseText);
        } catch (er) {
            errmsg = http.responseText;
        }
        if (this.upd && this.upd.error) {errmsg = this.upd.error;}
        if (errmsg != "") {this.displayMessage(errmsg); return -1; }
        httpText = this.translate(this.upd.updatemessage);
        if (action === "ADD") {
        this.app.appmlid = this.upd.updateID;
        this.data.records[0][this.data.keyField] = this.upd.updateID;
        }
        this.displayMessage(httpText);
        if (action === "DELETE") {this.clear(); }
        if (this.list) {this.list.data.totalRecCounter = 0; this.list.fnpl("same"); }
    };
    this.deleteRecord = function () {
        var s = window.confirm("Are you sure you want to delete this record?");
        if (s === false) {return -1; }
        this.putRecord("DELETE");
    };
    this.appmlNew = function () {
    this.run("NULL");
    };
    this.newRecord = function () {
    this.run("NULL");
    };
    this.saveRecord = function () {
        this.putRecord("UPDATE");
    };
    this.clear = function () {
        this.closeMessage();
        this.container.style.display = "none";
    };
    this.closeForm = function () {
        this.clear();
    };
    this.closeMessage = function () {
        this.displayMessage("");
    };
    this.xmlHttp = function (target, xml, method, a, readyfunc) {
        var httpObj, async = a;
        if (async !== true) {async = false; }
        if (method !== "GET" && method !== "POST") {
            window.alert("The httpRequest requires GET or POST");
            return false;
        }
        if (window.XMLHttpRequest) {
            httpObj = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            httpObj = new ActiveXObject("Microsoft.XMLHTTP");
        }
        if (httpObj) {
            if (async === true) {
                if (readyfunc) {httpObj.onreadystatechange = readyfunc; }
            }
            httpObj.open(method, target, async);
            httpObj.send(xml);
            if (async === false) {return httpObj; }
        }
    };
    function manageTemplate(obj) {
        if (obj.container) {obj.template = obj.container.cloneNode(true); }
  }
    function appmlTrim(x) {
        return x.replace(/^\s+|\s+$/gm,'');
    }
    function addClass(x, addclass) {
        var clsnm = x.className;
        if (clsnm === addclass) {return false; }
        if (clsnm.indexOf(addclass + " ") === 0) {return false; }
        if (clsnm.indexOf(" " + addclass) > -1) {
            if (clsnm.indexOf(addclass) + addclass.length === clsnm.length) {return false; }
            if (clsnm.indexOf(" " + addclass + " ") > -1) {return false; }
        }
        x.className = clsnm + " " + addclass;
    }
    function removeClass(x, removeclass) {
        var clsnm = x.className;
        if (clsnm === removeclass) {
            clsnm = "";
        } else {
            if (clsnm.indexOf(removeclass) === 0) {
                clsnm = clsnm.replace(removeclass + " ", "");
            } else {
                if (clsnm.indexOf(removeclass) + removeclass.length === clsnm.length) {
                    clsnm = clsnm.replace(" " + removeclass, "");
                } else {
                    clsnm = clsnm.replace(" " + removeclass + " ", "");
                }
            }
        }
        x.className = clsnm;
    }
    function reformatDate(txt, dtype) {
        var d, m, y;
        if (txt !== "") {
            d = txt.substr(dtype.indexOf("dd"), 2);
            m = txt.substr(dtype.indexOf("mm"), 2);
            y = txt.substr(dtype.indexOf("yyyy"), 4);
            return y + "/" + m + "/" + d;
        }
        return "";
    }
    function checkReplaceInnerHTML(elmnt) { // checking how the browser replaces the innerHTML, IE has problems replacing the innerHTML of some elements, like TR
        var cc, cc1, cc2, cc3, x = 1;
        try {
            cc = elmnt.cloneNode(true);
            cc1 = cc.innerHTML.length;
            cc3 = cc.innerHTML;
            cc.innerHTML = cc3;
            cc2 = cc.innerHTML.length;
            if (cc1 !== cc2) {x = 0; }
        } catch (er) {
            x = 0;
        }
        return x;
    }
    function isDate(x) {
        return (null !== x) && !isNaN(x) && (x.getDate !== "undefined");
    }
    this.appmlQuery = function () {
        var queryElmnt, l, qfname, qvalue, qoper, ovalue, odir, i;
        queryElmnt = this.getElement("appml_filtercontainer");
        l = (this.queryFields) ? this.queryFields.length : 0;
        for (i = 0; i < l; i += 1) {
            qfname = this.queryFields[i];
            qvalue = (this.queryValues[i] || "");
            qoper = (this.queryOperators[i] || "");
            if (this.getElement("appml_query_" + qfname, queryElmnt)) {this.getElement("appml_query_" + qfname, queryElmnt).value = qvalue; }
            if (qoper !== "") {
                if (this.getElement("appml_operator_" + qfname, queryElmnt)) {this.getElement("appml_operator_" + qfname, queryElmnt).value = qoper; }
            }
        }
        if (!this.data.filteritems || this.data.filteritems.length === 0) {this.getElement("appml_filter", queryElmnt).style.display = "none"; }
        l = (this.orderBys) ? this.orderBys.length : 0;
        for (i = 0; i < l; i += 1) {
            ovalue = (this.orderBys[i] || "");
            odir = (this.orderByDirections[i] || "asc");
            this.getElement("appml_orderselect", queryElmnt).value = ovalue;
            this.getElement("appml_orderdirection_" + odir, queryElmnt).checked = true;
        }
        if (this.getElement("appml_orderby", queryElmnt) && (!this.data.sortitems || this.data.sortitems.length === 0)) {this.getElement("appml_orderby", queryElmnt).style.display = "none"; }
        queryElmnt.style.display="block";
    };
    this.makeQuery = function () {
        var x, xx, l, ll, i, ii, fname, fvalue = "", foper = "=", ftype = "", ocount, ofname = [], odir = [], odirvalue, qcount = -1, fromDate, toDate, dateOK, displayvalue;
        l = this.queryFields.length;
        for (i = 0; i < l; i += 1) {
            this.queryFields.pop();
        }
        x = this.getElement("appml_filtercontainer").getElementsByTagName("*");
        l = x.length;
        for (i = 0; i < l; i += 1) {
            if (x[i].id) {
                if (x[i].id.substr(0, 12) === "appml_query_") {
                    fname = x[i].id.substr(12);
                    fvalue = x[i].value;
                    foper = Number(this.getElement("appml_operator_" + fname).value);
                    ftype = this.getElement("appml_datatype_" + fname).value.toLowerCase();
                    if (fvalue.length > 0) {
                        qcount += 1;
                        this.queryFields[qcount] = fname;
                        this.queryValues[qcount] = [];
                        displayvalue = fvalue;
                        if (ftype === "number") {
                            if (!Number(fvalue)) {
                                window.alert("Illegal Number");
                                fvalue = "2...1";
                            }
                        }
                        if (ftype === "date") {
                            fromDate = "";
                            toDate = "";
                            dateOK = 0;
                            try {
                                if (fvalue.length === 10 || fvalue.length === 9 || fvalue.length === 8) {
                                    fromDate = new Date(reformatDate(fvalue, this.data.dateFormat));
                                    dateOK = 1;
                                }
                                if (fvalue.length === 7 || fvalue.length === 6) {
                                    fromDate = new Date(reformatDate("01/" + fvalue, this.data.dateFormat));
                                    toDate = new Date(fromDate);
                                    toDate.setMonth(fromDate.getMonth() + 1);
                                    toDate.setDate(0);
                                    dateOK = 1;
                                }
                                if (fvalue.length === 4) {
                                    fromDate = new Date(fvalue + "/01/01");
                                    toDate = new Date(fvalue + "/12/31");
                                    dateOK = 1;
                                }
                            } catch (er) {
                                dateOK = 0;
                            }
                            if (dateOK === 1) {
                                dateOK = 0;
                                if (isDate(fromDate)) {dateOK = 1; }
                                if (dateOK === 1 && toDate !== "") {
                                    if (isDate(toDate)) {dateOK = 1; }
                                }
                            }
                            if (dateOK === 0) {
                                window.alert("Illegal Date");
                                fromDate = new Date("2012/01/01");
                                toDate = new Date("2011/12/31");// does not return any result
                            }
                            fvalue = "#" + fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate() + "#";
                            if (toDate !== "") {
                                fvalue = fvalue + "...#" + toDate.getFullYear() + "/" + (toDate.getMonth() + 1) + "/" + toDate.getDate() + "#";
                            }
                        }
                        if (fvalue.indexOf("...") > -1) {
                            this.queryValues[qcount][0] = fvalue.split("...")[0];
                            this.queryOperators[qcount] = 5;
                            qcount += 1;
                            this.queryFields[qcount] = fname;
                            this.queryValues[qcount] = [];
                            this.queryValues[qcount][0] = fvalue.split("...")[1];
                            this.queryOperators[qcount] = 4;
                        } else {
                            this.queryValues[qcount] = fvalue.split("|");
                            this.queryOperators[qcount] = foper;
                        }
                        this.queryDisplayValues[qcount] = displayvalue;
                        this.queryDisplayOperators[qcount] = foper;
                    }
                }
            }
        }
        x = this.getElement("appml_filtercontainer").getElementsByTagName("*");
        l = x.length;
        ocount = 0;
        for (i = 0; i < l; i += 1) {
            if (x[i].id && x[i].id === "appml_orderselect") {
                ocount += 1;
                ofname[ocount] = x[i].value;
                xx = this.getElement("appml_filtercontainer").getElementsByTagName("input");
                ll = xx.length;
                for (ii = 0; ii < ll; ii += 1) {
                    if (xx[ii].name === "appml_orderdirection") {
                        odirvalue = "asc";
                        if (xx[ii].checked === true) {odirvalue = xx[ii].value; }
                        odir[ocount] = odirvalue;
                    }
                }
            }
        }
        for (i = 1; i <= ocount; i += 1) {
            this.orderBys[i-1] = ofname[i];
            this.orderByDirections[i-1] = odir[i];
        }
        this.data.totalRecCounter = 0;
        this.fnpl();
    };
    this.resetQuery = function () {
        var i, l, x = this.getElement("appmlquery").getElementsByTagName("INPUT");
        l = x.length;
        for (i = 0; i < l; i += 1) {
            if (x[i].id.substr(0, 12) === "appml_query_") {
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
        x = this.getElement("appmlquery").getElementsByTagName("SELECT");
        l = x.length;
        for (i = 0; i < l; i += 1) {
            if (x[i].id.substr(0, 12) === "appml_query_") {            
                if (x[i].getAttribute("reset") !== "no") {x[i].value = ""; }
            }
        }
    };
    this.setQuery = function (field, value, type) {
        var l = this.queryFields.length;
        if (!l) {l = -1; }
        l += 1;
        this.queryFields[l] = field;
        if (!type) {type = "text"; }
        this.queryTypes[l] = "number";
        this.queryValues[l] = [];
        if (typeof value === "object") {
            this.queryValues[l] = value;
        } else {
            this.queryValues[l][0] = value;
        }
        this.queryDisplayValues[l] = value;
        this.queryOperators[l] = 0;
        this.queryDisplayOperators[l] = 0;
        this.data.totalRecCounter = 0;        
    };
    this.clearQuery = function () {
        this.queryFields = [];
        this.queryValues = [];
        this.queryDisplayValues = [];
        this.queryTypes = [];
        this.queryOperators = [];
        this.queryDisplayOperators = [];
        this.data.totalRecCounter = 0;        
    };
    this.adoptQuery = function (adoptObj) {
        this.queryFields = adoptObj.queryFields;
        this.queryValues = adoptObj.queryValues;
        this.queryDisplayValues = adoptObj.queryDisplayValues;
        this.queryTypes = adoptObj.queryTypes;
        this.queryOperators = adoptObj.queryOperators;
        this.queryDisplayOperators = adoptObj.queryDisplayOperators;
        this.orderBys = adoptObj.orderBys;
        this.orderByDirections = adoptObj.orderByDirections;
        this.data.totalRecCounter = 0;        
    };
    this.query = function (field, value, type) {
        this.setQuery(field, value, type);
        this.run();
    };
    this.setOrder = function (field, direction) {
        var dir = "asc";
        if (!direction || direction === "") {
            if (this.orderBys[0] === field) {
                if (this.orderByDirections[0] === "asc") {dir = "desc"; }
            }
        }
        this.orderBys.splice(0, 0, field);
        this.orderByDirections.splice(0, 0, dir);
    };
    this.order = function (field, direction) {
        this.setOrder(field, direction);
        this.fnpl();
    };
    function localStorage(obj, cb) {
        var xmlhttp;
        if (!w3schoolsWebSQLOK) {
            obj.displayMessage("Your browser does not support Local Storage Database (WebSQL).");
            return;
        }
        if (obj.app.action === "GET") {
            xmlhttp = obj.xmlHttp(obj.appFile + "?r=" + Math.random(), "", "GET", false);
            obj.data = JSON.parse(xmlhttp.responseText);
        }
        w3schoolsWebSQL1.runSQL(obj, cb);
    }
}