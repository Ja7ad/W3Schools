<%@ Page Language="VB" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Data" %>
<%@ Import Namespace="System.Data.OleDb" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>
<script runat="server">
Private Sub page_load()
'''' Appml 2.0.3 - Created by Jan Egil Refsnes W3Schools. Please don't remove this line.
response.buffer=true
response.CacheControl="no-cache"
Response.AppendHeader("Access-Control-Allow-Origin", "*")
response.AddHeader("Pragma","no-cache")
response.expires=-1
response.charset="UTF-8"
'response.charset="windows-1252"
response.ContentType="text/xml"
response.ContentType="application/json"
Dim modConfig,modDatabase,modData,txtModel,txtRequest,txtAppName,requestQuery,modDatasource,mainTable,requestObj
Dim dbConnection,action,displayType,modDateFormat,updItems,recPos,fromRec,toRec,maxLines,totalCounter,thisPos,lastPos,startPos
Dim dataOut,dataSource,filePath,fPath,sql,listSql,formSql,reportSql,defaultSql,where
Dim i,j,k,l,n,x,y,ipos,decsep,pos(255),cc,nn,qq,qqq,xmldoc,txt,arr,arr2
Dim updItemcounter,updItem(2550),keyCounter,keyValue,keyField,keyType
Dim dbRecordset,items,names(2550),values(2550),types(2550),paramCount,params(255)
Dim iOK,fieldList(2550),valueList(2550),fieldCounter
Dim security,userAccess,userName,pwd,req
Dim ctrlItemCounter,ctrlItemName(2550),ctrlItemMin(2550),ctrlItemMax(2550),ctrlItemRequired(2550)
Dim fCount,fNodeName(255),fName(255),fNo(255),fValue(255),fType(255),executeSQLcount,executeSQL(2550)

listSql=""
formSql=""
reportSql=""
defaultSql=""
executeSQLcount=0
fromRec=0
toRec=0
displayType=""
dataSource=""
dataOut=""
ctrlItemCounter=0
maxLines=500
recPos=1
keyCounter=0
paramCount=0
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
txtRequest=app_readRequest()
cc=app_loadTextFromFile("appml_config.aspx")
cc=mid(cc, instr(cc,"{"))
Dim jss = New JavaScriptSerializer()
modConfig = jss.Deserialize(Of Object)(cc)
modDateFormat=app_getProperty(modConfig,"dateformat")
if modDateFormat="" then modDateFormat="YYYY-MM-DD"
requestObj=jss.Deserialize(Of Object)(txtRequest)
txt=app_getProperty(requestObj,"login")
if txt.toString()<>"" then
  userName=app_getProperty(txt,"f1")
    if userName = "appmluser" then
        response.write("{")
        response.write(chr(34) & "appmluser" & chr(34) & " : " & chr(34) & app_getSession("appmluser") & chr(34))
        response.write("}")
        response.end
    end if
  pwd=app_getProperty(txt,"f2")
  userAccess=app_getUserAccess(userName,pwd,modConfig)
  if userAccess<>"" then
    nn=app_setSession("appmluser",userName)
    nn=app_setSession("appmlaccess",userAccess)
  end if
  response.end
end if
txtAppName=request.querystring("model")
if txtAppName="" then app_error("APPML_ERR_APPNAME_REQ")
action=app_getProperty(requestObj,"action")
if action="" then action="GET"
keyValue=app_getProperty(requestObj,"appmlid")
cc=app_loadTextFromFile(txtAppName)
txtModel=jss.Deserialize(Of Object)(cc)
txt=app_getProperty(txtModel,"dateformat")
if txt<>"" then modDateFormat=txt
security=app_getProperty(txtModel,"security")
if getUserAccess(security)<>"OK" then app_error("APPML_ERR_NOT_AUTHORIZED")
modDatabase=app_getProperty(txtModel,"database")
if modDatabase.GetType().toString() <> "System.String" then
  dataSource="database"
    dbConnection=app_getDbConnection(app_getProperty(modDatabase,"connection"),app_getProperty(modConfig,"databases"))
    mainTable=app_getProperty(modDatabase, "maintable")
    keyField=app_getProperty(modDatabase, "keyfield")
    sql=app_getProperty(modDatabase, "sql")
  if keyField<>"" then
    keyCounter=1
        keyType=app_getProperty(modDatabase, "keytype")
    if (keyType="") then keyType="number"
        if keyValue.toString()="" then keyValue="NULL"
  end if
    items=app_getProperty(modDatabase, "execute")
    nn=app_executeSQL(dbConnection,items)
else
  modData=app_getProperty(txtModel,"data")
  if modData.toString()<>"" then
        keyField = ""
    dataSource=app_getProperty(modData, "type")
    end if
  if datasource.toString()<>"" then
    filePath=app_getProperty(modData,"filename")
    fPath=app_getProperty(modData,"record")
    arr2=app_getProperty(modData,"items")
    fCount=app_arrayLength(arr2)
    for i=0 to fCount-1
      fName(i)=app_getProperty(arr2(i),"name")
      fType(i)=app_getProperty(arr2(i),"type")
      if fType(i).toString()="" then fType(i)="text"
      fNodeName(i)=app_getProperty(arr2(i),"nodename")
      fNo(i)=app_getProperty(arr2(i),"index")                    
    next
  end if
end if
if dataSource="" then app_error("APPML_ERR_DATASOURCE_REQ")
if action="GET" then
  displayType=app_getProperty(requestObj,"displayType")
  if displayType="" then displayType="list"
  txt=app_getProperty(requestObj,"totalRecCounter")
  if txt.toString()<>"" then totalCounter=clng(txt)
  txt=app_getProperty(requestObj,"rowsperpage")
    if txt.toString()<>"" then
        maxLines=clng(txt)
    else
        txt=app_getProperty(txtModel, "rowsperpage")
        if txt.toString()<>"" then maxLines=clng(txt)
    end if
  txt=app_getProperty(requestObj,"fromrec")  
  if txt.toString()<>"" then recPos=clng(txt)
  requestQuery=app_getProperty(requestObj,"filters")
  if displayType="form" then maxLines=1
  dataOut=""
  if dataSource="database" then
    if sql<>"" then
      dataOut=app_getData(modDatabase,modConfig,txtModel,modDateFormat,sql,keyField,keyValue,keyCounter,requestQuery,recPos,maxLines,totalCounter)      
    end if
  end if
  if dataSource="xmlfile" or dataSource="csvfile" or dataSource="jsonfile" then
        if dataSource = "jsonfile" then
            i=0
            cc=app_loadTextFromFile(filePath)
            cc=jss.Deserialize(Of Object)(cc)
            arr=app_getProperty(cc, fPath)
            totalCounter = app_arrayLength(arr)
    else if dataSource="csvfile" then
      dim filesystem,fileobject
      on error resume next
      filesystem=Server.CreateObject("Scripting.FileSystemObject")
      fileobject=filesystem.OpenTextFile(Server.MapPath(filePath), 1)
      i=0
            redim arr(255)
      do while fileobject.atendofstream=false
        i=i+1
        arr(i)=fileobject.ReadLine
      loop
      if err.Number<>0 then app_error("APPML_ERR_ERROR: " & err.description)
      fileobject.close
      on error goto 0
      totalCounter=i
    else
      xmldoc=app_loadTextFromFile(filePath)
      arr=app_getElementArray(xmldoc,fpath)
      totalCounter=arr(0)
    end if
    fromRec=recPos
    toRec=app_setToPosition(fromRec,maxLines)
    if totalCounter<toRec then toRec=totalCounter
    if recPos="-1" then
      fromRec=totalCounter-maxLines+1
      toRec=totalCounter
    end if
    if keyValue<>"" then
      i=clng(keyValue)
      fromRec=i
      toRec=i
    end if  
    for i=fromRec to toRec
      for j=0 to fCount-1
        if dataSource="csvfile" then    
          startPos=1
          for k=1 to fNo(j)+1
            pos(k)=instr(startPos,arr(i),",")
            startPos=pos(k)+1
          next
          if fNo(j)=0 then
            lastPos=0
          else
            lastPos=pos(fNo(j)-1)
          end if
          thisPos=pos(fNo(j))
          if thisPos<1 then
            cc=""
          else
            cc=mid(arr(i),lastPos+1,thisPos-lastPos-1)
          end if
        else if dataSource="jsonfile" then
                    cc=app_getProperty(arr(i-1),fNodeName(j))          
                else
          cc=app_getElementValue(arr(i),fNodeName(j))
        end if                  
        fValue(j)=cc
      next
      dataOut=dataOut & app_getRecordAsXML("<keyvalue>" & i & "</keyvalue>",fName,fType,fValue,fCount)
      if i<toRec then dataOut=dataOut & ","    
    next
    cc=", " & chr(34) & "recPos" & chr(34) & " : " & fromRec
    cc=cc & ", " & chr(34) & "fromRec" & chr(34) & " : " & fromRec
    cc=cc & ", " & chr(34) & "toRec" & chr(34) & " : " & toRec
    cc=cc & ", " & chr(34) & "recCounter" & chr(34) & " : " & clng(toRec-fromRec+1)
    cc=cc & ", " & chr(34) & "totalRecCounter" & chr(34) & " : " & totalCounter
    cc=cc & ", " & chr(34) & "records" & chr(34) & " : [" & dataOut & "]"
    dataOut=cc
  end if
  response.write("{")
'  response.write(chr(34) & "user" & chr(34) & " : " & app_getSession("appmluser"))
  response.write(chr(34) & "user" & chr(34) & " : 0")
  response.write(dataOut)
  response.write(", " & chr(34) & "dateFormat" & chr(34) & " : " & chr(34) & modDateFormat & chr(34))
  if keyField<>"" then response.write(", " & chr(34) & "keyField" & chr(34) & " : " & chr(34) & keyField & chr(34))
    cc=jss.Serialize(txtModel)
  cc=replace(cc,chr(10),"")
  cc=replace(cc,chr(13),"")
  cc=replace(cc,"{","",1,1)
    cc=StrReverse(cc)
  cc=replace(cc,"}","",1,1)
    cc=StrReverse(cc)
  response.write(", " & cc)  
  response.write("}")
  response.end
end if
if action<>"UPDATE" and action<>"ADD" and action<>"DELETE" then app_error("APPML_ERR_ILLEGAL_ACTION: " & action)
updItems=app_getProperty(txtModel,"updateItems")
if updItems.toString()="" then app_error("APPML_ERR_ILLEGAL_ACTION: " & action)
if getUserAccess(security)<>"OK" then app_error("APPML_ERR_NOT_AUTHORIZED")
if action="DELETE" then
  if ucase(app_getProperty(txtModel,"delete"))="FALSE" then app_error("APPML_ERR_ILLEGAL_ACTION: " & "DELETE")
  x=app_dbDelete(dbConnection,keyField,keyValue,modDatabase,modConfig)
    response.write("{")
    response.write(chr(34) & "updatemessage" & chr(34) & " : " & chr(34) & x & " APPML_MESSAGE_RECORD_DELETED" & chr(34))
    response.write("}")
  response.end
end if
if action="ADD" then
  if ucase(app_getProperty(txtModel,"add"))="FALSE" then app_error("APPML_ERR_ILLEGAL_ACTION: " & "ADD")
end if
updItemcounter=app_arrayLength(updItems)
fieldCounter=0
txt=app_getProperty(requestObj,"record")
if txt.toString()<>"" then
    names=app_getProperty(txt, "items")
    values=app_getProperty(txt, "values")
    'types=app_getProperty(txt, "items")
end if
fieldCounter=updItemcounter
ctrlItemCounter=0
for j=0 to fieldCounter-1
  if lcase(names(j).toString())<>lcase(app_getProperty(updItems(j), "item").toString()) then app_error("APPML_ERR_DATAMODEL")
  if trim(values(j) <> "")
    'if types(j) = "number" then
    '  decsep=app_getSysDecSep()
    '  values(j)=replace(values(j),",",decsep)
    '  values(j)=replace(values(j),".",decsep)
    'end if
  end if
next
if action="ADD" then
  nn=app_dbAddNew(dbConnection,fieldCounter,names,values,types,modDatabase,modConfig)      
    response.write("{")
    response.write(chr(34) & "updatemessage" & chr(34) & " : " & chr(34) & " 1 APPML_MESSAGE_RECORD_ADDED" & chr(34))
    response.write("," & chr(34) & "updateID" & chr(34) & " : " & nn)
    response.write("}")
  response.end
end if

sql="SELECT "
for i = 0 to (fieldCounter-1)
    if i > 0 then sql=sql & ","
    sql=sql & add_brackets(names(i))
next
sql=sql & " FROM " & add_brackets(mainTable) & " WHERE " & add_brackets(mainTable) & "." & add_brackets(keyField) & "=@0"
paramCount=1
params(1)=keyValue
dbRecordset=app_dbRead(dbConnection, sql, paramCount, params)
fCount=0
do while dbRecordset.read
    for i=0 to dbRecordset.FieldCount-1
        for j=0 to (fieldCounter-1)
            if ucase(dbRecordset.GetName(i))=ucase(names(j)) then
                if dbRecordset.GetValue(i).tostring() <> values(j) then
                    fCount=fCount+1
                    fieldlist(fCount-1)=names(j)
                    valuelist(fCount-1)=values(j)
                end if
            end if
        next
    next
loop
nn=app_dbUpdate(dbConnection,fCount,fieldlist,valuelist,keyField,keyValue,modDatabase,modConfig)
response.write("{")
response.write(chr(34) & "updatemessage" & chr(34) & " : " & chr(34) & nn & " APPML_MESSAGE_RECORD_UPDATED" & chr(34))
response.write("}")
response.end
end sub
''''''''''''''''''''''''''''''''''''''''''''''''''''''
function app_setToPosition(pos,max)
dim toPos
toPos=pos+max-1
if max=0 then toPos=0
app_setToPosition=toPos
end function

function app_getRecordAsXML(keyValue,fieldName,fieldType,fieldValue,fieldCount)
dim x,i,j,c,txt,val
x="{"
'x=x & keyValue & vbcrlf
for i=0 to fieldCount-1
  txt=""
  val=fieldvalue(i)
  for j=1 to len(val)
    c=mid(val,j,1)
    if c="<" then c="#1001;"
    if c=">" then c="#1002;"
    if c="&" then c="#1003;"
    txt=txt & c
  next
  x=x & chr(34) & fieldName(i) & chr(34) & " : " & chr(34) & txt & chr(34)
  if i<fieldCount-1 then x=x & ","
next
x=x & "}"
app_getRecordAsXML=x
end function

function appml_GetQueryWhere(txtParam,filter,requestFilter,ByRef paramCount,ByRef params)
dim legalQueryFieldcount,legalQueryField(255),legalQueryfieldType(255),queryOK
dim where,x,y,z,i,j,l,ll,qOK,valueOK,qlabel,displayvalue,xqoper,qoper,qname,qtype
dim t,c,d,e,f,k,txt,errvar,xdoc,xtxt
dim month,year,dvalue,xmonth,ymonth,ymonth2,day,ipos,fromdate1,todate1,fromdate2,todate2
dim arr,valuearr,qvaluecount,qvalue(255)
qvaluecount=0
where=txtParam
legalQueryFieldcount=0
txt=filter
if txt.toString()<>"" then
  l=app_arrayLength(txt)
  for i=0 to l-1
    legalQueryFieldcount=legalQueryFieldcount+1
    legalQueryField(i)=app_getProperty(txt(i),"item")
    legalQueryfieldType(i)=app_getProperty(txt(i),"type")
    next
end if
arr=app_getProperty(requestFilter,"queryFields")
l=app_arrayLength(arr)
for j=0 to l-1
  qOK=1
  qlabel=""
  qvaluecount=0
  qoper=""
  qname=arr(j)
  qlabel=""
  valuearr=app_getProperty(requestFilter,"queryValues")(j)
  ll=app_arrayLength(valuearr)
  for i=0 to ll-1
    qvaluecount=qvaluecount+1
    qvalue(i)=valuearr(i)
  next
  qoper=app_getProperty(requestFilter,"queryOperators")(j).toString()
  queryOK=0
  for i=0 to legalQueryFieldcount-1
    if lcase(qname)=lcase(legalQueryField(i)) then
      qtype=legalQueryfieldType(i)        
      queryOK=1
      exit for
    end if
  next
  if queryOK=0 then app_error("APPML_ERR_ILLEGAL_QUERY: " & qname)
  for i=0 to qvaluecount-1
    if qvalue(i)="&nbsp;" then qvalue(i)=" "
    if qlabel="" then qlabel=qname
    if qoper="" then qoper="="
    if qoper="0" then qoper="="
    if qoper="1" then qoper="<>"
    if qoper="2" then qoper="<"
    if qoper="3" then qoper=">"
    if qoper="4" then qoper="<="
    if qoper="5" then qoper=">="
    if qoper="6" then qoper="%"
    if qoper="10" then qoper="=="
    if qoper="11" then qoper="!="
    if qvalue(i)<>"" then
      qvalue(i)=remove_quotes(qvalue(i))
      if where="" then
        where=" ("
      else
        if i=0 then
          where=where & " AND ("
        else
          if qoper="=" or qoper="==" or qoper="%" then
            where=where & " OR "
          else
            where=where & " AND "
          end if
        end if
      end if
      if qtype="number" or qtype="date" then
        if qOK=1 then
          xqoper=qoper
          if xqoper="==" then xqoper="="
          if xqoper="!=" then xqoper="<>"              
          where=where & "(" & add_brackets(qname) & xqoper & "@" & paramCount & ")"
          paramCount=paramCount+1
          params(paramCount)=qvalue(i)
        else
          where=where & " (" & add_brackets(qname) & ">0 AND " & add_brackets(qname) & "<0)"
        end if
      else
        if qvalue(i)=" " then
          if qoper="=" or qoper="==" then where=where & "(" & add_brackets(qname) & "='')"
          if qoper="<>" or qoper="!=" then where=where & "(" & add_brackets(qname) & "<>'')"
          if qoper="<" or qoper =">" or qoper="<=" or qoper=">=" then where=where & "(" & add_brackets(qname) & qoper & "'')"
          if qoper="%" then where=where & "(" & add_brackets(qname) & " LIKE '% %')"
        else
          if qoper="=" then
            where=where & "(" & add_brackets(qname) & " LIKE @" & paramCount & " + '%')"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="==" then
            where=where & "(" & add_brackets(qname) & " = @" & paramCount & ")"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="<" or qoper =">" then
            where=where & "(" & add_brackets(qname) & qoper & "@" & paramCount & ")"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="<>" then
            where=where & "(" & add_brackets(qname) & qoper & "@" & paramCount & " AND " & add_brackets(qname) & " NOT LIKE @" & paramCount+1 & " + '%')"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="!=" then
            where=where & "(" & add_brackets(qname) & "<>" & "@" & paramCount & ")"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="<=" or qoper=">=" then
            where=where & "(" & add_brackets(qname) & qoper & "@" & paramCount & " OR " & add_brackets(qname) & " LIKE @" & paramCount+1 & " + '%')"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
          if qoper="%" then
            where=where & "(" & add_brackets(qname) & " LIKE '%' + " & "@" & paramCount & " + '%')"
            paramCount=paramCount+1
            params(paramCount)=qvalue(i)
          end if
        end if
      end if
    end if
    if i=qvaluecount-1 then where=where & ")"
  next
next
appml_GetQueryWhere=where
end function

function appml_GetOrderby(txtOrderby,txtsortitems,requestFilter)
dim legalOrderbyFieldcount,legalOrderbyField(2550),legalOrderbyDir(2550),orderby,orderbyOK,orderselect,orderdir
dim osfield(255),osdir(255),oscount
dim txt,l,i,j,arr
legalOrderbyFieldcount=0
orderby=""
oscount=0
txt=txtsortitems
if txt.toString()<>"" then
  l=app_arrayLength(txt)
  for i=0 to l-1
    legalOrderbyFieldcount=i
    legalOrderbyField(i)=app_getProperty(txt(i),"item")
    legalOrderbyDir(i)="asc"
  next
end if
arr=app_getProperty(requestFilter, "orderBys")
l=app_arrayLength(arr)
for i=0 to l-1
    oscount=i
  osfield(i)=arr(i)
  osdir(i)=app_getProperty(requestFilter, "orderByDirections")(i)
next
orderselect=""
for i=0 to oscount
  if osfield(i)<>"" then
    orderbyOK=0
    for j=0 to legalOrderbyFieldcount
      if trim(osfield(i))=trim(legalOrderbyField(j)) then
        orderbyOK=1
        exit for
      end if
    next
    if orderbyOK=1 then
      if orderselect<>"" then orderselect=orderselect & ","
      orderselect=orderselect & " " & osfield(i) & " " & osdir(i)
    end if
  end if
next
if orderselect<>"" then orderby=orderselect
if orderby="" then orderby=txtOrderby
if orderby<>"" then orderby=" ORDER BY " & orderby
appml_GetOrderby=orderby
end function

function add_brackets(txt)
dim i,ret
ret=txt
i=instr(txt,".")
if i<>0 then
  if instr(mid(txt,i+1),".")=0 then ret="[" & mid(txt,1,i-1) & "].[" & mid(txt,i+1) & "]"
else  
  ret="[" & txt & "]"
end if
add_brackets=ret
end function

function app_formatDate(txt,appformat)
dim y,m,d,t,c,h,n,s
if txt=nothing then
  app_formatDate=""
  exit function
end if  
if trim(txt)="" then
  app_formatDate=""
  exit function
end if
y=datePart("yyyy",txt).tostring()
m=datePart("m",txt).tostring()
d=datePart("d",txt).tostring()
h=datePart("h",txt).tostring()
n=datePart("n",txt).tostring()
s=datePart("s",txt).tostring()
c=mid(y,3,2)
if len(m)<2 then m="0" & m
if len(d)<2 then d="0" & d
if len(h)<2 then h="0" & h
if len(n)<2 then n="0" & n
if len(s)<2 then s="0" & s
t=appformat
t=replace(t,"yyyy",y)
t=replace(t,"mm",m)
t=replace(t,"dd",d)
t=replace(t,"yy",c)
t=replace(t,"hh",h)
t=replace(t,"nn",n)
t=replace(t,"ss",s)
app_formatDate=t
end function

function getUserAccess(security)
dim ret,useraccess,sec,x,z,ARR
ret=""
useraccess=""
sec=ucase(security)
if sec="" then
  ret="OK"
else
  sec=trim(sec)
  useraccess=app_getSession("appmlaccess")
end if
if useraccess<>"" then
  ARR=split(useraccess,",")
  for each x in ARR
    z=trim(ucase(x))
    if sec=z then
      getUserAccess="OK"
      exit function
    end if
  next
end if
getUserAccess=ret
end function

function app_error(errtxt)
response.write("{" & chr(34) & "error" & chr(34) & " : " & chr(34) & errtxt & chr(34) & "}")
response.end
end function

function app_reformatDate(txt,dtype)
dim d,m,y,ret
ret=""
if txt<>"" then
  d=mid(txt,instr(dtype,"dd"),2)
  m=mid(txt,instr(dtype,"mm"),2)
  y=mid(txt,instr(dtype,"yyyy"),4)
  ret=y & "-" & m & "-" & d
end if
app_reformatDate=ret
end function

function remove_quotes(ttt)
dim i,c,out
out=""
for i=1 to len(ttt)
  c=mid(ttt,i,1)
  if c="'" then c= "'" & "'"
  out=out & c
next
remove_quotes=out
end function

function app_getElementValue(element,id)
dim ipos1,ipos2,ipos3,res,uelement,uid
res=""
uelement=ucase(element)
uid=ucase(id)
ipos1=instr(uelement,"<" & uid)
if ipos1>0 then
  ipos2=instr(mid(uelement,ipos1),">")
  ipos3=instr(uelement,"</" & uid & ">")
  if ipos2>0 and ipos3>ipos1 then  res=trim(mid(element,ipos1+ipos2,ipos3-ipos2-ipos1))
end if  
app_getElementValue=res
end function

function app_getElement(element,id)
dim ipos1,ipos2,ipos3,res,uelement,uid
uelement=ucase(element)
uid=ucase(id)
ipos1=instr(uelement,"<" & uid)
ipos3=instr(uelement,"</" & uid & ">")
res=""
if ipos1>0 then
  if ipos3>ipos1 then
    res=mid(element,ipos1,ipos3-ipos1+len(id)+3)
  else
    ipos3=instr(mid(uelement,ipos1),"/>")
    if ipos3>0 then res=mid(element,ipos1,ipos3+1)
  end if
end if  
app_getElement=res
end function

function app_getAttribute(element,attribute)
dim ipos,tst,res,txt
txt=element
res=""
tst=34
ipos=instr(txt," " & attribute & "=" & chr(tst))
if ipos=0 then
  tst=39
  ipos=instr(txt," " & attribute & "=" & chr(tst))
end if  
if ipos<>0 then
  txt=mid(txt,ipos+len(attribute)+3)
  ipos=instr(txt,chr(tst))
  if ipos>1 then res=mid(txt,1,ipos-1)
end if
app_getAttribute=res
end function

function app_getElementArray(element,id)
dim x(10000),i,ipos1,ipos2,ipos3,res,xelement,uelement,uid,l
uid=ucase(id)
xelement=element
l=0
x(0)=0
for i=1 to 10000
  uelement=ucase(xelement)
  ipos1=instr(uelement,"<" & uid)
  ipos3=instr(uelement,"</" & uid & ">")
  if ipos1>0 and ipos3>ipos1 then
    l=l+1
    x(0)=l
    x(l)=mid(xelement,ipos1,ipos3-ipos1+len(id)+3)
    xelement=mid(xelement,ipos3+len(id)+3)
  else
    exit for
  end if  
next
app_getElementArray=x
end function

function app_arrayLength(arr)
app_arrayLength=arr.length
end function

function app_getSysDecSep()
dim decsep
decsep=1/2
decsep=cstr(decsep)
decsep=mid(decsep,2,1)
app_getSysDecSep=decsep
end function

function app_loadTextFromFile(fname)
dim filesystem,fileobject,xml,ext
on error resume next
filesystem=server.createObject("Scripting.FileSystemObject")
ext=".js"
if instr(fname,".")>0 then ext=""
fileobject=filesystem.OpenTextFile(Server.MapPath(fname & ext),1)
if err.Number<>0 then app_error(fname & ext & ": " & err.description)
xml=fileobject.ReadAll
fileobject.Close
on error goto 0
app_loadTextFromFile=xml
end function

function app_setSession(nam,val)
session(nam)=val
end function

function app_getSession(nam)
app_getSession=session(nam)
end function

function app_getData(modDatabase,modConfig,txtModel,modDateFormat,sql,keyField,keyValue,keyCounter,requestQuery,recPos,maxLines,totalCounter)
dim fromRec,toRec,paramCount,params(255),dbRecordset,fCount,fName(255),fValue(255),fType(255),dataOut,dbConnection,mainTable
dim txtFilter,cc,i,nn,keys,dbtype
dim txtWhere,txtOrderby,txtsortitems
mainTable=app_getProperty(modDatabase,"maintable")
paramCount=0
txtWhere=app_getProperty(modDatabase,"where")
txtOrderby=app_getProperty(modDatabase,"orderby")
fromRec=recPos
toRec=app_setToPosition(fromRec,maxLines)
dbtype=app_getDbType(app_getProperty(modDatabase,"connection"),app_getProperty(modConfig,"databases"))
dbConnection=app_getDbConnection(app_getProperty(modDatabase,"connection"),app_getProperty(modConfig,"databases"))
dataOut=""
if keyValue.toString()<>"" then
  if keyCounter=0 then app_error("APPML_ERR_KEYFIELD_REQ")
  if mainTable="" then app_error("APPML_ERR_MAINTABLE_REQ")
  if keyValue.toString()="NULL" then  keyValue="-1"
  sql=sql & " WHERE " & add_brackets(mainTable) & "." & add_brackets(keyField) & "=@0;"
  paramCount=1
  params(1)=keyValue
else
  txtFilter=app_getProperty(txtModel,"filteritems")
  cc=appml_GetQueryWhere(txtWhere,txtFilter,requestQuery,paramCount,params)
  if cc<>"" then sql=sql & " WHERE " & cc
  if totalCounter=0 then
        if dbtype="SQLSERVER" then
      dbRecordset=app_dbRead(dbConnection,"SET ROWCOUNT 500;" & sql & ";SET ROWCOUNT 0;",paramCount,params)
    else
      dbRecordset=app_dbRead(dbConnection,sql,paramCount,params)
    end if
    do while dbrecordset.read
      totalCounter=totalCounter+1
    loop
    dbRecordset.close
  end if
  if toRec=0 then toRec=totalCounter
  if recPos="-1" then
    fromRec=totalCounter-maxLines+1
    toRec=totalCounter
  end if
  txtsortitems=app_getProperty(txtModel, "sortitems")
  cc=appml_GetOrderby(txtOrderby,txtsortitems,requestQuery)
  if cc<>"" then sql=sql & cc
    if dbtype="SQLSERVER" then sql="SET ROWCOUNT " & toRec & ";" & sql & ";SET ROWCOUNT 0;"
end if
dbRecordset=app_dbRead(dbConnection,sql,paramCount,params)
fCount=dbRecordset.FieldCount
for i=0 to fCount-1
  fType(i)=dbRecordset.GetDatatypeName(i)
  fName(i)=dbRecordset.GetName(i)
  fValue(i)=""
next
nn=0
dataOut=""
do while dbRecordset.read
  nn=nn+1
  if nn>=fromRec and nn<=toRec then
    cc=""
    for i=0 to dbRecordset.FieldCount-1
      fValue(i)=dbRecordset.GetValue(i)
      if isDBNull(fValue(i)) then fValue(i)=""
      if app_getType(fType(i))="date" then fValue(i)=app_formatDate(fValue(i),modDateFormat)
      fValue(i)=fValue(i).toString()
      if fName(i)=keyField then cc=fValue(i)
    next  
    keys="<keyvalue>" & cc & "</keyvalue>" & vbcrlf
    if dataOut<>"" then dataOut=dataOut & ","
    dataOut=dataOut & app_getRecordAsXML(keys,fName,fType,fValue,fCount)
  end if
loop
if keyValue.toString()<>"" then totalCounter=nn
if totalCounter<toRec then toRec=totalCounter
if nn=0 or recPos="0" then
  totalCounter=0
  dataOut=dataOut & app_getRecordAsXML("<keyvalue></keyvalue>",fName,fType,fValue,fCount)
end if
dbRecordset.close


    cc=", " & chr(34) & "recPos" & chr(34) & " : " & fromRec
    cc=cc & ", " & chr(34) & "fromRec" & chr(34) & " : " & fromRec
    cc=cc & ", " & chr(34) & "toRec" & chr(34) & " : " & toRec
    cc=cc & ", " & chr(34) & "reccounter" & chr(34) & " : " & clng(toRec-fromRec+1)
    cc=cc & ", " & chr(34) & "totalRecCounter" & chr(34) & " : " & totalCounter
    cc=cc & ", " & chr(34) & "records" & chr(34) & " : [" & dataOut & "]"



app_getData=cc
end function

function app_getUserAccess(userName,pwd,modConfig)
dim nn,sql,dbConnection,paramCount,params(2),dbRecordset,userAccess
paramCount=2
if userName="" or pwd="" then app_error("APPML_ERR_USN_OR_PWD_REQ")
nn=app_setSession("appmluser","")
nn=app_setSession("appmlaccess","")
sql="SELECT groups.group_name FROM ((user_groups"
sql=sql & " LEFT JOIN personer ON user_groups.personer_id=personer.personer_id)"
sql=sql & " LEFT JOIN groups ON user_groups.group_id=groups.group_id)"
sql=sql & " WHERE personer.brukernavn=@0 AND personer.passord=@1;"
dbConnection=app_getDbConnection("offfiles",modConfig)
'  sql="SELECT AppmlRoles.Name FROM ((AppmlUserRoles"
'  sql=sql & " LEFT JOIN AppmlUsers ON AppmlUserRoles.UserID=AppmlUsers.UserID)"
'  sql=sql & " LEFT JOIN AppmlRoles ON AppmlUserRoles.RoleID=AppmlRoles.RoleID)"
'  sql=sql & " WHERE AppmlUsers.Email=@0 AND AppmlUsers.Pass=@1;"
'  dbConnection=app_getDbConnection("AppmlSecurity",modConfig)
params(1)=userName
params(2)=pwd
dbRecordset=app_dbRead(dbConnection,sql,paramCount,params)
userAccess=""
do while dbRecordset.read
  if userAccess<>"" then userAccess=userAccess & ","
  userAccess=userAccess & dbRecordset.GetValue(0)
loop
dbRecordset.close
app_getUserAccess=userAccess
end function

function app_dbRead(conn,sql,count,values)
dim comm,reader,param,i
comm = new OleDbCommand()
comm.Connection=conn
comm.Commandtext=app_prepSQL(sql,count)
for i=1 to count
comm.Parameters.AddWithValue("@" & i-1,values(i))
next 
on error resume next
reader = comm.ExecuteReader()
if err.Number<>0 then app_writeSQLError(err)
on error goto 0
app_dbRead=reader
end function

function app_dbUpdate(conn,fieldCounter,xnames,xvalues,keyField,keyValue,modDatabase,modConfig)
if fieldCounter=0 then
    app_dbUpdate = 0
    exit function
end if
dim i,j,sql,comm,num,params(255),dbRecordset,count,fields(2550),values(2550),table
table=app_getProperty(modDatabase,"maintable")
sql="SELECT "
for i=0 to fieldCounter-1
  if i>0 then sql=sql & ","
  sql=sql & add_brackets(xnames(i))
next
sql=sql & " from " & add_brackets(table) & " WHERE " & add_brackets(table) & "." & add_brackets(keyField) & "=@0;"
params(1)=keyValue
dbRecordset=app_dbRead(conn,sql,1,params)
dbRecordset.read
count=0
for i=1 to dbRecordset.FieldCount
  for j=0 to fieldCounter-1
      if ucase(dbRecordset.GetName(i-1))=ucase(xnames(j)) then
          if dbRecordset.GetValue(i-1).tostring() <> xvalues(j) then
          count=count+1
           fields(count)=xnames(j)
           values(count)=xvalues(j)
           end if
           exit for
    end if
  next
next
dbRecordset.close()
sql="UPDATE " & table & " SET "
for i=1 to count
  sql=sql & fields(i) & "=?"
  if i<>count then sql=sql & ","
next
sql=sql & " WHERE " & keyField & "=?;"
on error resume next
comm = new OleDbCommand()
comm.Connection=conn
comm.Commandtext=app_prepSQL(sql,count)
for i=1 to count
  if trim(values(i))="" then values(i)=DBnull.value
  comm.Parameters.AddWithValue("@" & i-1,values(i))
next 
comm.Parameters.AddWithValue("@" & count,keyValue)
'app_error("kkkhkhk" & keyValue)
num=comm.ExecuteNonQuery()
if err.Number<>0 then app_writeSQLError(err)
conn.Close()
on error goto 0
app_dbUpdate=num
end function

function app_dbAddNew(conn,count,fields,values,types,modDatabase,modConfig)
dim i,sql,comm,num,table
table=app_getProperty(modDatabase,"maintable")
sql="INSERT INTO " & table & " ("
for i=0 to count-1
  sql=sql & fields(i)
  if i<>count-1 then sql=sql & ","
next
sql=sql & ") VALUES ("
for i=0 to count-1
  sql=sql & "?"
  if i<>count-1 then sql=sql & ","
next
sql=sql & ")"
on error resume next
comm = new OleDbCommand()
comm.Connection=conn
comm.Commandtext=app_prepSQL(sql,count)
for i=0 to count-1
  if trim(values(i))="" then values(i)=DBnull.value
  comm.Parameters.AddWithValue("@" & i-1,values(i))
next 
num=comm.ExecuteNonQuery()
conn.Close()
if err.Number<>0 then app_writeSQLError(err)
on error goto 0
app_dbAddNew=num
end function

function app_dbDelete(conn,field,key,modDatabase,modConfig)    
Dim sql,comm,num,table
table=app_getProperty(modDatabase,"maintable")
sql="DELETE FROM " & add_brackets(table) & " WHERE " & add_brackets(field) & "=?;"
on error resume next
comm = new OleDbCommand()
comm.Connection=conn
comm.Commandtext=app_prepSQL(sql,1)
comm.Parameters.AddWithValue("@0",key)
num=comm.ExecuteNonQuery()
if err.Number<>0 then app_writeSQLError(err)
conn.Close()
on error goto 0
app_dbDelete=num
end function

function app_executeSQL(conn,sql)
dim i,comm,xcount
on error resume next
comm = new OleDbCommand()
comm.Connection = conn
xcount = app_arrayLength(sql)
for i=0 to xcount-1
  comm.CommandText = sql(i)
  comm.ExecuteNonQuery()
  if err.Number<>0 then app_writeSQLError(err)
next
on error goto 0
end function

function app_getDbType(dbcon,model)
dim txt,arr,l,i,x,db,xdbcon,dbtype
xdbcon=ucase(dbcon)
arr=model
txt=""
dbtype=""
l=app_arrayLength(arr)
for i=0 to l-1
  x=app_getProperty(arr(i),"connection")
  if ucase(x)=xdbcon then
    txt=arr(i)
    exit for
  end if  
next
if txt.toString()="" then app_error("APPML_ERR_UKNOWN_DB: " & dbcon)
db=app_getProperty(txt,"connectionstring")
if db.toString()="" then db=app_getProperty(txt,"provider")
if db.toString()<>"" then
    if instr(ucase(db),"SQLOLEDB")>0 then dbtype="SQLSERVER"
end if
app_getDbType=dbtype
end function  

function app_getDbConnection(dbcon,model)
dim txt,arr,l,i,x,db,xdbcon,ipos,conn,provider,host,dbname,user,pwd
xdbcon=ucase(dbcon)
arr=model
txt=""
l=app_arrayLength(arr)
for i=0 to l-1
  x=app_getProperty(arr(i),"connection")
  if ucase(x)=xdbcon then
    txt=arr(i)
    exit for
  end if  
next
if txt.toString()="" then app_error("APPML_ERR_UKNOWN_DB: " & dbcon)
db=app_getProperty(txt,"connectionstring")
if db.toString()="" then
  provider=app_getProperty(txt,"provider")
  host=app_getProperty(txt,"host")
  dbname=app_getProperty(txt,"dbname")
  user=app_getProperty(txt,"username")
  pwd=app_getProperty(txt,"password")
  db="Provider=" & provider & ";data source=" & host & ";database=" & dbname & ";User id=" & user & ";Password=" & pwd
end if
'ipos=instr(ucase(db),"#WEBROOT#") 
'if ipos>0 then db=mid(db,1,ipos-1) & Server.MapPath("\") & mid(db,ipos+10)
on error resume next
conn = new OleDBConnection(db)
conn.Open()
if err.Number<>0 then app_writeSQLError(err)
on error goto 0
app_getDbConnection=conn
end function  

function app_prepSQL(sql,count)
dim i,mysql
mysql=sql
for i=1 to count
mysql=replace(mysql,"@" & i-1,"?")
next
app_prepSQL=mysql
end function

function app_getType(txt)
Dim ret
ret="string"
if txt="DBTYPE_NUMERIC" or txt="DBTYPE_DECIMAL" then ret="number"
if txt="DBTYPE_DATE" or txt="DBTYPE_DBDATE" or txt="DBTYPE_DBTIME" or txt="DBTYPE_DBTIMESTAMP" then  ret="date"
app_getType=ret
end function

function app_readRequest()
dim txtReq,txt,cc
txtReq=""
on error resume next
cc=New StreamReader(request.inputstream)
Do
    txt=cc.ReadLine()
    txtReq=txtReq & txt
  Loop Until txt Is Nothing
cc.Close()
if err.Number<>0 then app_error("APPML_ERR_ERROR: " & err.Description)
on error goto 0
app_readRequest=txtReq
End function

function app_writeSQLError(e)
dim message,numb,desc
desc=e.description
numb=e.Number
message=desc
if numb=-2147467259 or numb=-2147217911 then message="APPML_ERR_NOT_AUTHORIZED"
app_error(message)
end function

function app_getProperty(obj, prop)
try
return obj(prop)
catch
return ""
end try
end function

</script>