//Appml_sql 2.0.3 - Created by Jan Egil Refsnes for W3Schools. Please don't remove this line.
var appmlLocalDatabase;
if (w3schoolsWebSQLOK) {w3schoolsWebSQL1 = new w3WebSQLInit(); }
function w3WebSQLInit() {
  var w3DBObj = this;
    var testObj;
  appmlLocalDatabase = window.openDatabase('AppMLDemoDatabase_1', '1.0', 'W3SchoolsDemoDatabase', 2 * 1024 * 1024);
  this.runSQL = function(obj, cb) {
        testObj = obj;
        var keyValue, cc, sql = obj.data.database.sql, paramCount = 0, params = [], names = [], values = [], executesql = [];
        executesql = obj.data.database.execute;
        if (executesql) {
            w3DBObj.w3ExecuteSQL("", obj, cb, "execute", executesql);
        }
        mainTable = (obj.data.database.maintable || "");
        keyField = (obj.data.database.keyfield || "");
        keyValue = (obj.app.appmlid || "");
        if (keyField != "") {
            obj.data.keyField = keyField;
            keyCounter = 1;
            keyType = (obj.data.database.keytype || "");
            if (keyType == "") {keyType = "number"; }
            if (keyValue == "") {keyValue = "NULL"; }
        }
        if (obj.app.action == "DELETE") {
            if (obj.app.record) {
                sql="DELETE FROM " + mainTable;
                sql += " WHERE " + keyField + "='" + keyValue + "';";
                w3DBObj.w3ExecuteSQL(sql, obj, cb);
            }
        } else if (obj.app.action == "ADD") {
            if (obj.app.record) {
                updCount = 0;
                for (i = 0; i < obj.data.updateItems.length; i++) {
                    for (j = 0; j < obj.app.record.items.length; j++) {
                        if (obj.data.updateItems[i].item.toLowerCase() == obj.app.record.items[j].toLowerCase()) {
                            updCount++
                            names[updCount] = obj.data.updateItems[i].item;
                            values[updCount] = obj.app.record.values[j];
                        }
                    }
                }
                if (updCount > 0) {
                    sql="INSERT INTO " + mainTable  + " (";
                    for (i = 1; i <= updCount; i++) {
                        sql += names[i];
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += ") VALUES (";
                    for (i = 1; i <= updCount; i++) {
                        sql += "'" + values[i] + "'";
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += ");";
                    w3DBObj.w3ExecuteSQL(sql, obj, cb);
                }
            }
        } else if (obj.app.action == "UPDATE") {
            if (obj.app.record) {
                updCount = 0;
                for (i = 0; i < obj.data.updateItems.length; i++) {
                    for (j = 0; j < obj.app.record.items.length; j++) {
                        if (obj.data.updateItems[i].item.toLowerCase() == obj.app.record.items[j].toLowerCase()) {
                            //if (obj.data.updateItems[i].value != obj.app.record.values[j]) {
                                updCount++
                                names[updCount] = obj.data.updateItems[i].item;
                                values[updCount] = obj.app.record.values[j];
                            //}
                        }
                    }
                }
                if (updCount > 0) {
                    sql="UPDATE " + mainTable  + " SET ";
                    for (i = 1; i <= updCount; i++) {
                        sql += names[i] + "='" + values[i] + "'";
                        if (i < updCount) {sql = sql + ","; }
                    }
                    sql += " WHERE " + keyField + "='" + keyValue + "';";
                    w3DBObj.w3ExecuteSQL(sql, obj, cb);
                }
            }
        } else {
            if (sql) {
                if (keyValue != "") {
                    if (keyValue == "NULL") { keyValue = "-1"; }
                    sql = sql + " WHERE " + add_brackets(mainTable) + "." + add_brackets(keyField) + "='" + keyValue + "';";
                } else {
                    cc = appml_GetQueryWhere(obj,paramCount,params);
                    if (cc) {sql = sql + " WHERE "+ cc; }
                    cc = appml_GetOrderby(obj);
                    if (cc) {sql = sql  + cc; }
                }
                w3DBObj.w3ExecuteSQL(sql, obj, cb, "", 0, keyValue);
            }
        }
  };
  this.w3ExecuteSQL = function(sql, obj, cb, exe, exeObj, keyValue) {
    var json = "";
    appmlLocalDatabase.transaction(function (tx) {
            if (exe === "execute") {
                for (var i = 0; i < exeObj.length; i++) {
                    var successFunc = function () {};
                    if (i == exeObj.length-1) {
                        if (cb) {
                            successFunc = cb;
                        }
                    }
                    var runSQL = exeObj[i];
              tx.executeSql(exeObj[i],[],successFunc,function (transaction,err) {
                        obj.displayMessage("SQL Error : " + err.message + " SQL: " + runSQL);
                        return true;
              });
                }
                return;
            }
      tx.executeSql(sql,[],function (tx, results) {
                if (exe === "execute") {
                    if (exeno == 1) {
                        obj.displayMessage("Executing " + exelen + " statements.");
                    }
                    if (exeno == exelen) {
                        obj.displayMessage("Done! Executed " + exelen + " statement(s)");
                    }
                    return;
                }
                if (obj.app.action == "UPDATE" || obj.app.action == "ADD" || obj.app.action == "DELETE") {
                    if (obj.app.action == "UPDATE") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_UPDATED"); }
                    if (obj.app.action == "ADD") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_ADDED"); }
                    if (obj.app.action == "DELETE") {httpText = obj.translate("1 APPML_MESSAGE_RECORD_DELETED"); }
                    if (obj.app.action === "ADD") {
                        kx = results.insertId;
                        obj.app.appmlid = kx;
                        obj.data.records[0][obj.data.keyField] = kx;
                    } 
                    obj.displayMessage(httpText);
                    //if (obj.app.action === "DELETE") {obj.clear(); }
                    if (obj.list) {obj.list.data.totalRecCounter = 0; obj.list.fnpl("same"); }
                    return;
                }
        var len = results.rows.length, toRec, cc, i, j, m, txt, columns = [], DBChanges = 0, recPos, fromRec, totalCounter = len;
                recPos = (obj.app.fromrec || 1);
                fromRec = recPos;
                if (!obj.app.rowsperpage) {
                    obj.app.rowsperpage = (obj.data.rowsperpage || 500);
                }
                obj.rowsperpage = (obj.rowsperpage || obj.app.rowsperpage); 
                toRec=app_setToPosition(obj.app.fromrec,obj.app.rowsperpage);
                if (toRec == 0) {toRec = totalCounter;}
                if (recPos == -1) {
                    fromRec=totalCounter - obj.app.rowsperpage + 1;
                    toRec=totalCounter;
                }
                obj.data.user = 0;
                obj.data.recPos = fromRec;
                obj.data.fromRec = fromRec;
                obj.data.toRec = toRec;
                obj.data.totalRecCounter = totalCounter;
                json += ' [';
        if (len > 0) {
          for (m in results.rows.item(0)) {
              columns.push(m);
          }
          for (i = 0; i < len; i++) {
                        if ((i+1) >= fromRec && (i+1) <= toRec) {
              for (j = 0; j < columns.length; j++) {
                              if (j === 0) {json += '{'; }
                              if (j > 0) {json += ','; }
                                if (keyValue == "-1") {
                                     json += '"' + columns[j] + '":""';
                                } else {
                                  json += '"' + columns[j] + '":"' + results.rows.item(i)[columns[j]] + '"';
                                }
                              if (j === (columns.length - 1)) {
                                  json += '}';
                                  if (i < (len -1) && (i+1) < toRec) {json += ','; }
                              }
                            }
            }
          }
                    json += ']';
                    if (totalCounter < toRec) {obj.data.toRec = totalCounter; }
                    obj.data.records = JSON.parse(json);
                    if (obj.data.records) {
                        obj.data.itemNames = [];
                        i = -1;
                        for (cc in obj.data.records[0]) {
                            i++
                            obj.data.itemNames[i] = cc;
                        }
                    }
                    obj.gotData();
        } else {
                    obj.data.recPos = 0;
                    obj.data.fromRec = 0;
                    obj.data.toRec = 0;
                    obj.data.totalRecCounter = 0;
            obj.data.records = [];
                    obj.gotData();
        }
      },function (transaction, err) {
                obj.displayMessage("SQL Error : " + err.message + "<br>" + sql);
                return true;
      })
    });
  };

    function app_setToPosition(from,lines) {
        to = from +  lines-1;
        if (lines == 0) {to=lines; }
        return to;
    }

    function appml_GetOrderby(obj) {
        txtOrderby = (obj.data.database.orderby || "");
        txtsortitems = obj.data.sortitems;
        requestFilter = obj.app.filters;
        legalOrderbyField = [];
        legalOrderbyDir = [];
        osfield = [];
        osdir = [];
        legalOrderbyFieldcount = 0;
        orderby = "";
        if (txtsortitems != undefined) {
            l = txtsortitems.length;
            for (i = 0; i < l; i++) {
                legalOrderbyField[i] = txtsortitems[i].item;
                legalOrderbyDir[i] = "asc";
            }
        }
        legalOrderbyFieldcount = legalOrderbyField.length;
        arr = obj.app.filters.orderBys;
        l = arr.length;
        for (i = 0; i < l; i++) {
            osfield[i] = arr[i];
            osdir[i] = obj.app.filters.orderByDirections[i];
        }
        orderselect = "";
        l = osfield.length;
        for (i = 0; i < l; i++) {
            if (osfield[i] != "") {
                orderbyOK = 0;
                for (j = 0; j < legalOrderbyFieldcount; j++) {
                    if (osfield[i] == legalOrderbyField[j]) {
                        orderbyOK = 1;
                        break;
                    }
                }
                if (orderbyOK == 1) {
                    if (orderselect != "") {orderselect += ",";}
                    orderselect += " " + osfield[i] + " " + osdir[i];
                }
            }
        }
        if (orderselect != "" && orderby != "") {
            orderby = orderselect + ", " + orderby;
        } else {
            if (orderselect != "" && orderby == "") {
                orderby = orderselect;
            }
        }
        if (orderby == "") {
          orderby = txtOrderby;
        }
        if (orderby != "") {
            orderby = " ORDER BY " + orderby;
        }
        return orderby;
    }
    function appml_GetQueryWhere(obj,paramCount,params) {
        txtParam = obj.data.database.where;
        filter = obj.data.filteritems;
        requestFilter = obj.app.filters;
        legalQueryField = [];
        legalQueryFieldType = [];
        qvalue = [];
        qvaluecount = 0;
        where = (txtParam || "");
        legalQueryFieldcount = 0;
        txt = filter;
        if (txt != undefined) {
            l = txt.length;
            for (i=0; i<l; i++) {
              legalQueryField[i] = txt[i].item;
              legalQueryFieldType[i] = txt[i].type;
            }
        }
        legalQueryFieldcount = legalQueryField.length;
        arr = requestFilter.queryFields;
        l = arr.length;
        for (j = 0; j < l; j++) {    
            qOK = 1;
            qlabel = "";
            qvaluecount = 0;
            qoper = "";
            qname = arr[j];
            qlabel = "";
            valuearr = requestFilter.queryValues[j];
            ll = valuearr.length;
            for (i = 0; i < ll; i++) {
                qvaluecount++;
                qvalue[i] = valuearr[i];
            }
            qoper = requestFilter.queryOperators[j];
            queryOK = 0;
            for (i = 0; i < legalQueryFieldcount; i++) {
                if (qname.toLowerCase() == legalQueryField[i].toLowerCase()) {
                    qtype = legalQueryFieldType[i];
                    queryOK=1;
                    break;
                }
            }
            if (queryOK == 0) {obj.displayMessage("APPML_ERR_ILLEGAL_QUERY: " + qname); return -1;}
            for (i = 0; i < qvaluecount; i++) {
                if (qvalue[i] == "&nbsp;") {qvalue[i] = " ";}
                if (qlabel == "") {qlabel = qname;}
                if (qoper == "") {qoper = "=";}
                if (qoper == "0") {qoper = "=";}
                if (qoper == "1") {qoper = "<>";}
                if (qoper == "2") {qoper = "<";}
                if (qoper == "3") {qoper = ">";}
                if (qoper == "4") {qoper = "<=";}
                if (qoper == "5") {qoper = ">=";}
                if (qoper == "6") {qoper = "%";}
                if (qoper == "10") {qoper = "==";}
                if (qoper == "11") {qoper = "!=";}
                if (qvalue[i] != "") {
                    if (where == "") {
                        where = " (";
                    } else {
                        if (i == 0) {
                            where += " AND (";
                        } else {
                            if (qoper == "=" || qoper == "==" || qoper == "%") {
                                where += " OR ";
                            } else {
                                where +=" AND ";
                            }
                        }
                    }
                    if (qtype == "number" || qtype == "date") {
                        if (qOK == 1) {
                            xqoper = qoper;
                            if (xqoper == "==") {xqoper="=";}
                            if (xqoper == "!=") {xqoper="<>";}
                            where +="(" + add_brackets(qname) + xqoper + "'" + qvalue[i] + "')";
                        } else {
                            where +=" (" + add_brackets(qname) + ">0 AND " + add_brackets(qname) + "<0)";
                        }
                    } else {
                        if (qvalue[i] == " ") {
                            if (qoper == "=" || qoper == "==") {where += "(" + add_brackets(qname) + "='')";}
                            if (qoper == "<>" || qoper == "!=") {where += "(" + add_brackets(qname) + "<>'')";}
                            if (qoper == "<" || qoper == ">" || qoper == "<=" || qoper == ">=") {
                                where += "(" + add_brackets(qname) + qoper + "'')";
                            }
                            if (qoper == "%") {where += "(" + add_brackets(qname) + " LIKE '% %')";}
                        } else {
                            if (qoper == "=") {
                                where += "(" + add_brackets(qname) + " LIKE '" + qvalue[i] + "%'" + ")";
                            }
                            if (qoper == "==") {
                                where += "(" + add_brackets(qname) + " = '" + qvalue[i] + "'" + ")";
                            }
                            if (qoper == "<" || qoper == ">") {
                                where += "(" + add_brackets(qname) + qoper + "'" + qvalue[i] + "'" + ")";
                            }
                            if (qoper == "<>") {
                                where += "(" + add_brackets(qname) + qoper + "'" + qvalue[i] + "' AND " + add_brackets(qname) + " NOT LIKE '" + qvalue[i] + "%')";
                            }
                            if (qoper == "!=") {
                                where += "(" + add_brackets(qname) + "<> '" + qvalue[i] + "')";
                            }
                            if (qoper == "<=" || qoper == ">=") {
                                where += "(" + add_brackets(qname) + qoper + " '" + qvalue[i] + "' OR " + add_brackets(qname) + " LIKE '" + qvalue[i] + "%')";
                            }
                            if (qoper == "%") {
                                where += "(" + add_brackets(qname) + " LIKE '%" + qvalue[i] + "%')";
                            }
                        }
                    }
                }
                if (i == (qvaluecount-1)) {where +=")";}
            }
        }
        return where;
    }  
    function remove_quotes(ttt) {
        out = "";
        if (ttt == "" || ttt == undefined || ttt == "undefined") {return "";}
        for (i = 1; i <= ttt.length; i++) {
            c = ttt.substr(i-1, 1);
            if (c == "'") {c = "''";}
            out += c;
        }
        return out;
    }
    function add_brackets(txt) {
        return txt;
    }
}