<?php
//Appml 2.0.32 - Created by Jan Egil Refsnes for W3Schools. Please don't remove this line.
session_start();
ob_start();
header("Cache-Control: no-cache");
header("Access-Control-Allow-Origin: *");
header("Pragma: no-cache");
header("Expires: ".gmdate("D, d M Y H:i:s",time()+(-1*60))." GMT");
header("Content-type: application/json; charset=UTF-8");
$fNo=array();
$updItem=array();
$names=array();
$values=array();
$fieldlist=array();
$valuelist=array();
$ctrlItemName=array();$ctrlItemMin=array();$ctrlItemMax=array();$ctrlItemRequired=array();
$pos=array();
$params=array();
$fName=array();$fType=array();$fValue=array();$fNodeName=array();
$txtWhere="";
$mainTable="";
$userName="";$pwd="";
$fromRec=0;
$toRec=0;
$displayType="";
$dataSource="";
$dataOut="";
$maxLines=500;
$recPos=1;
$keyCounter=0;
$paramCount=0;
$totalCounter=0;
//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
$txtRequest=app_readRequest();
//if ($txtRequest=="") {exit();}
$cc = app_loadTextFromFile("appml_config.php");
$cc = substr($cc, strpos($cc,"{"));
$modConfig = app_decodeJSON($cc, false);
$modDateFormat=$modConfig->dateformat;
if ($modDateFormat == "") {$modDateFormat="YYYY-MM-DD";}
$requestObj = app_decodeJSON($txtRequest, false);
$txt=app_getProperty($requestObj, "login");
if ($txt != "") {
  $userName=app_getProperty($txt, "f1");
  if ($userName == "appmluser") {
    echo "{";
    echo "\"appmluser\" : \"".app_getSession("appmluser")."\"";
    echo "}";
    exit();
  }
  $pwd=app_getProperty($txt, "f2");
  $userAccess=app_getUserAccess($userName,$pwd,$modConfig);
  $loginmessage="";
  if ($userAccess != "") {$nn=app_setSession($userName,$userAccess); $loginmessage="OK";}
  echo "{";
  echo "\"loginmessage\" : \"".$loginmessage."\"";
  echo "}";
  exit();
}
//$txtAppModel=app_getProperty($requestObj, "appmodel");
$txtAppModel = $_GET["model"];
if ($txtAppModel == "") {app_error("APPML_ERR_MODEL_REQ");}
$action=app_getProperty($requestObj,"action");
if ($action == "") {$action="GET";/*app_error("APPML_ERR_ACTION_REQ");*/}
$keyValue=app_getProperty($requestObj,"appmlid");
$modelString = app_loadTextFromFile($txtAppModel);
if ($modelString == "") {app_error("APPML_ERR_MODEL_REQ: ".$txtAppModel);}
$txtModel = app_decodeJSON($modelString, false);
if ($txtModel == "") {app_error("APPML_ERR_MODEL_ERR: ".$txtAppModel);}
$txt=app_getProperty($txtModel, "dateformat");
if ($txt != "") {$modDateFormat=$txt;}
$security=app_getProperty($txtModel, "security");
$cc=getUserAccess($security);
if ($cc == "NOTLOGGEDIN") {app_error("APPML_ERR_NO_LOGIN");}
if ($cc != "OK") {app_error("APPML_ERR_NOT_AUTHORIZED");}
$modDatabase=app_getProperty($txtModel, "database");
if ($modDatabase != "") {
  $dataSource="database";
  $dbConnection=app_getDbConnection(app_getProperty($modDatabase, "connection"),$modConfig->databases);
  $mainTable=app_getProperty($modDatabase, "maintable");
  $sql=app_getProperty($modDatabase, "sql");
  $keyField=app_getProperty($modDatabase, "keyfield");
  if ($keyField!="") {
    $keyCounter=1;
    $keyType=app_getProperty($modDatabase, "keytype");
    if ($keyType=="") {$keyType="number";}
    if ($keyValue == "") {$keyValue = "NULL";}
  }
  $items=app_getProperty($modDatabase, "execute");
  $nn=app_executeSQL($dbConnection,$items);
}
else {
  $modData=app_getProperty($txtModel, "data");
  if ($modData != "") {
    $keyField="";
    $dataSource=app_getProperty($modData, "type");
  }
  if ($dataSource != "") {
    $filePath=app_getProperty($modData, "filename");
    $fPath=app_getProperty($modData, "record");
    $arr=app_getProperty($modData, "items");
    $fCount=app_arrayLength($arr);
    for ($i=0; $i<$fCount; $i++) {
      $fName[$i]=app_getProperty($arr[$i], "name");
      $fType[$i]=app_getProperty($arr[$i], "type");
      if ($fType[$i] == "") {$fType[$i]="text";}
      $fNodeName[$i]=app_getProperty($arr[$i], "nodename");
      $fNo[$i]=app_getProperty($arr[$i], "index");
    }
  }
}
if ($dataSource == "") {app_error("APPML_ERR_DATASOURCE_REQ");}
if ($action == "GET") {
  $displayType=app_getProperty($requestObj,"displayType");
  if ($displayType == "") {$displayType="list";}
  $txt=app_getProperty($requestObj,"totalRecCounter");
  if ($txt == 0 || $txt != "") {$totalCounter=intval($txt);}
  $txt=app_getProperty($requestObj, "rowsperpage");
  if ($txt != "") {
    $maxLines=intval($txt);
  } else {
    $txt=app_getProperty($txtModel, "rowsperpage");
    if ($txt != "") { $maxLines=intval($txt); }
  }
  $txt=app_getProperty($requestObj, "fromrec");
  if ($txt != "") {$recPos=intval($txt);}
  $requestQuery=app_getProperty($requestObj, "filters");
  if ($displayType == "form") {$maxLines=1;}
  $dataOut="";
  if ($dataSource == "database") {
    if ($sql != "") {
    $dataOut=app_getData($modDatabase,$modConfig,$txtModel,$modDateFormat,$sql,$keyField,$keyValue,$keyCounter,$requestQuery,$recPos,$maxLines,$totalCounter);
    }
  }
  if ($dataSource == "xmlfile" || $dataSource == "csvfile" || $dataSource == "jsonfile") {
    if ($dataSource == "jsonfile") {
      $i=0;
      try {
        $cc=json_decode(file_get_contents($filePath), true);
      }
      catch (Exception $e) {
        app_error("APPML_ERR_ERROR: ".$e);
      }
      $arr = $cc[$fPath];
      $totalCounter = count($arr);
    }
    else if ($dataSource == "csvfile") {
      $i=0;
      try {
        $lines=file($filePath);
        foreach ($lines as $value) {
          $i++;
          $arr[$i] = $value;
          }
      }
      catch (Exception $e) {
        app_error("APPML_ERR_ERROR: ".$e);
      }
      $totalCounter=$i;
    }
    else {
      $xmldoc=app_loadTextFromFile($filePath);
      $arr=app_getElementArray($xmldoc, $fPath);
      $totalCounter=app_arrayLength($arr);
    }
    $fromRec=$recPos;
    $toRec=app_setToPosition($fromRec,$maxLines);
    if ($totalCounter<$toRec) {$toRec=$totalCounter;}
  if ($recPos=="-1") {
    $fromRec=$totalCounter-$maxLines+1;
    $toRec=$totalCounter;
    }
    if ($keyValue != "") {
      $i=intval($keyValue);
      $fromRec=$i;
      $toRec=$i;
    }
    for ($i=$fromRec; $i<=$toRec; $i++) {
      for ($j=0; $j<$fCount; $j++) {
        if ($dataSource == "csvfile") {
          $startpos=1;
          for ($k=1; $k<=$fNo[$j] + 1; $k++) {
            $pos[$k]=_instr($startpos,$arr[$i],",",0);
            $startpos=$pos[$k] + 1;
          }
          if ($fNo[$j] == 1) {
            $lastpos=0;}
          else {
            $lastpos=$pos[$fNo[$j]-1];
          }
          $thispos=$pos[$fNo[$j]];
          if ($thispos < 1) {
            $cc="";}
          else {$cc=substr($arr[$i],$lastpos,$thispos-$lastpos-1);
          }
        } else if ($dataSource == "jsonfile") {
          $cc=$arr[$i-1][$fNodeName[$j]];          
        } else {
          $cc=app_getElementValue($arr[$i], $fNodeName[$j]);
        }
        $fValue[$j]=$cc;
      }
      $dataOut.=app_getRecordAsJSON($fName, $fType, $fValue, $fCount);
    if ($i<$toRec) {$dataOut.=",";}    
    }
  $cc=", \"recPos\" : ".$fromRec;
  $cc.=", \"fromRec\" : ".$fromRec;
  $cc.=", \"toRec\" : ".$toRec;
  $cc.=", \"totalRecCounter\" : ".$totalCounter;
  $cc.=", \"records\" : [".$dataOut."]";
  $dataOut=$cc;
  }
  echo "{";
  echo "\"user\" : 0";
  echo $dataOut;
  echo ", \"dateFormat\" : \"".$modDateFormat."\"";
  if ($keyField!="") {echo ", \"keyField\" : \"".$keyField."\"";}
  $cc = strpos($modelString, "{");
  if ($cc !== false) {
    $modelString = substr_replace($modelString, "", $cc, strlen("}"));
  }
  $modelString = strrev(implode(strrev(""), explode("}", strrev($modelString), 2)));
  echo ", ".$modelString;
  echo "}";
  exit();
}
if ($action != "UPDATE" and $action != "ADD" and $action != "DELETE") {app_error("APPML_ERR_ILLEGAL_ACTION: ".$action);}
$updItem=app_getProperty($txtModel, "updateItems");
if ($updItem == "") {app_error("APPML_ERR_ILLEGAL_ACTION: ".$action);}
if (getUserAccess($security) <> "OK") {app_error("APPML_ERR_NOT_AUTHORIZED");}    
if ($action == "DELETE") {
  if (strtoupper(app_getProperty($txtModel, "delete")) == "FALSE") {app_error("APPML_ERR_ILLEGAL_ACTION: "."DELETE");}
  $x=app_dbDelete($dbConnection,$mainTable,$keyField,$keyValue);
  echo "{";
  echo "\"updatemessage\" : \"".$x." APPML_MESSAGE_RECORD_DELETED\"";
  echo "}";
//  echo ($x." APPML_MESSAGE_RECORD_DELETED");
  exit();
}
if ($action == "ADD") {
  if (strtoupper(app_getProperty($txtModel, "addnew")) == "FALSE") {app_error("APPML_ERR_ILLEGAL_ACTION: "."INSERT");}
}
$fieldCounter=0;
$txt=app_getProperty($requestObj, "record");
if ($txt != "") {
  $names=app_getProperty($txt, "items");
  $values=app_getProperty($txt, "values");
  //$types=app_getProperty($txt, "items");
  $fieldCounter=app_arrayLength($updItem);
}
for ($j=0; $j<$fieldCounter; $j++) {
  if (strtolower($names[$j]) != strtolower(app_getProperty($updItem[$j], "item"))) {app_error("APPML_ERR_DATAMODEL");}
  if (trim($values[$j]) == "") {
    $values[$j]="";  // DBNULL
  }
  //else {
    //if ($types[$j]="number") {
    //  $decsep=app_getSysDecSep();
    //  $values[$j]=str_replace(",",$decsep,$values[$j]);
    //  $values[$j]=str_replace(".",$decsep,$values[$j]);
    //}
  //}
}
/*for ($i=1; $i<=$ctrlItemCounter; $i++) {
  for ($j=0; $j<$fieldCounter; $j++) {
    if ($names[$j] == $ctrlItemName[$i]) {
      if ($ctrlItemMin[$i] != "") {
        $x=$values[$j];
        $y=$ctrlItemMin[$i];
        if (is_numeric($x)) {$x=intval($x);}
        if (is_numeric($y)) {$y=intval($y);}
        if (app_isDate($x)) {$x=app_cDate($x);}
        if (app_isDate(app_reformatDate($y,$modDateFormat))) {$y=app_cDate(app_reformatDate($y,$modDateFormat));}
        if ($x < $y) {app_error("APPML_ERR_INPUT_MIN: ".$names[$j].",".$ctrlItemMin[$i]);}
      }
      if ($ctrlItemMax[$i] != "") {
        $x=$values[$j];
        $y=$ctrlItemMax[$i];
        if (is_numeric($x)) {$x=intval($x);}
        if (is_numeric($y)) {$y=intval($y);}
        if (app_isDate($x)) {$x=app_cDate($x);}
        if (app_isDate(app_reformatDate($y,$modDateFormat))) {$y=app_cDate(app_reformatDate($y,$modDateFormat));}
        if ($x > $y) {app_error("APPML_ERR_INPUT_MAX: ".$names[$j].",".$ctrlItemMax[$i]);}
      }
      if ($ctrlItemRequired[$i] == 1) {
        $x=$values[$j];
        if ($x == "") {app_error("APPML_ERR_INPUT_REQUIRED: ".$names[$j]);}
      }
    }
  }
}*/
if ($action == "ADD") {
  $nn=app_dbAddNew($dbConnection,$mainTable,$fieldCounter,$names,$values);
  echo "{";
  echo "\"updatemessage\" : \"1 APPML_MESSAGE_RECORD_ADDED\", ";
  echo "\"updateID\" : ".$nn;
  echo "}";
//  echo $nn;
  exit();
}
$sql="SELECT ";
for ($i=0; $i<$fieldCounter; $i++) {
  if ($i > 0) {$sql.=",";}
  $sql.=add_brackets($names[$i]);
}
$sql.=" from ".add_brackets($mainTable)." WHERE ".add_brackets($mainTable).".".add_brackets($keyField)."=@0;";
$paramCount=1;
$params[1]=$keyValue;
$dbRecordset=app_dbRead($dbConnection, $sql, $paramCount, $params);
$fCount=0;
$row=$dbRecordset->fetch_array(MYSQLI_BOTH);
while ($x = $dbRecordset->fetch_field()) {
  for ($j=0;$j<$fieldCounter;$j++) {
      if (strtoupper($x->name)==strtoupper($names[$j])) {
        $fieldtype=app_getType($x->type);
        $fieldvalue=app_getDBfield($row, $names[$j], $fieldtype); 
        if ($fieldvalue != $values[$j]) {
          $fCount++;
          $fieldlist[$fCount]=$names[$j];
          $valuelist[$fCount]=$values[$j];
        }
      }
  }
}
$dbRecordset->close();
$nn=app_dbUpdate($dbConnection,$mainTable,$fCount,$fieldlist,$valuelist,$keyField,$keyValue);
echo "{";
echo "\"updatemessage\" : \"".$nn." APPML_MESSAGE_RECORD_UPDATED\"";
echo "}";
//echo $nn." APPML_MESSAGE_RECORD_UPDATED";
exit();
//'''''''''''''''''''''''''''''''''''''''''''''''''''''
function app_setToPosition($from,$lines) {
$to=$from + $lines-1;
if ($lines == 0) {$to=$lines;}
return $to;
}

function app_getRecordAsJSON($fieldName, $fieldType, $fieldValue, $numb) {
$x="{";
for ($i=0; $i<$numb; $i++) {
  $val=$fieldValue[$i];
  $n="";
  for ($j=0; $j<strlen($val); $j++) {
    $c=substr($val,$j,1);
    if ($c == "<") {$c="#1001;";}
    if ($c == ">") {$c="#1002;";}
    if ($c == "&") {$c="#1003;";}
    $n.=$c;  
  }
  $x.="\"".$fieldName[$i]."\" : \"".$n."\"";
  if ($i<$numb-1) $x.=",";
}
$x.="}";
return $x;
}

function appml_GetQueryWhere($txtParam,$filter,$requestFilter,&$paramCount,&$params) {
$legalQueryField=array();
$legalQueryFieldType=array();
$qvalue=array();
$qvaluecount=0;
$where=$txtParam;
$legalQueryFieldcount=0;
$txt=$filter;
if ($txt != "") {
    $l=app_arrayLength($txt);
    for ($i=0; $i<$l; $i++) {
      $legalQueryField[$i]=app_getProperty($txt [$i], "item");
      $legalQueryFieldType[$i]=app_getProperty($txt [$i], "type");
    }
}
$legalQueryFieldcount=app_arrayLength($legalQueryField);
$arr="";
if ($requestFilter) {$arr=$requestFilter->queryFields; }
$l=app_arrayLength($arr);
for ($j=0; $j<$l; $j++) {    
  $qOK=1;
  $qlabel="";
  $qvaluecount=0;
  $qoper="";
  $qname=$arr[$j];
  $qlabel="";
  $valuearr=$requestFilter->queryValues[$j];
  $ll=app_arrayLength($valuearr);
  for ($i=0; $i<$ll; $i++) {
    $qvaluecount++;
    $qvalue[$i]=$valuearr[$i];
  }
  $qoper=$requestFilter->queryOperators[$j];
  $queryOK=0;
  for ($i=0; $i<$legalQueryFieldcount; $i++) {
    if (strtolower($qname) == strtolower($legalQueryField[$i])) {
      $qtype=$legalQueryFieldType[$i];
      $queryOK=1;
      break;
    }
  }
  if ($queryOK == 0) {app_error("APPML_ERR_ILLEGAL_QUERY: ".$qname);}
  for ($i=0; $i<$qvaluecount; $i++) {
    if ($qvalue[$i] == "&nbsp;") {$qvalue[$i]=" ";}
    if ($qlabel == "") {$qlabel=$qname;}
    if ($qoper == "") {$qoper="=";}
    if ($qoper == "0") {$qoper="=";}
    if ($qoper == "1") {$qoper="<>";}
    if ($qoper == "2") {$qoper="<";}
    if ($qoper == "3") {$qoper=">";}
    if ($qoper == "4") {$qoper="<=";}
    if ($qoper == "5") {$qoper=">=";}
    if ($qoper == "6") {$qoper="%";}
    if ($qoper == "10") {$qoper="==";}
    if ($qoper == "11") {$qoper="!=";}
    if ($qvalue[$i] != "") {
      $qvalue[$i]=remove_quotes($qvalue[$i]);
      if ($where == "") {$where=" (";}
      else {
        if ($i == 0) {$where.=" AND (";}
        else {
          if ($qoper == "=" || $qoper == "==" || $qoper == "%") {
            $where.=" OR ";
          }
          else {$where.=" AND ";}
        }
      }
      if ($qtype == "number" || $qtype == "date") {
        if ($qOK == 1) {
          $xqoper=$qoper;
          if ($xqoper == "==") {$xqoper="=";}
          if ($xqoper == "!=") {$xqoper="<>";}
          $where.="(".add_brackets($qname).$xqoper."@".(string)$paramCount.")";
          $paramCount++;
          $params[$paramCount]=$qvalue[$i];
        }
        else {$where.=" (".add_brackets($qname).">0 AND ".add_brackets($qname)."<0)";}
      }
      else {
        if ($qvalue[$i] == " ") {
          if ($qoper == "=" || $qoper == "==") {$where.="(".add_brackets($qname)."='')";}
          if ($qoper == "<>" || $qoper == "!=") {$where.="(".add_brackets($qname)."<>'')";}
          if ($qoper == "<" || $qoper == ">" || $qoper == "<=" || $qoper == ">=") {
          $where.="(".add_brackets($qname).$qoper."'')";}
          if ($qoper == "%") {$where.="(".add_brackets($qname)." LIKE '% %')";}
        }
        else {
          if ($qoper == "=") {
              $where.="(".add_brackets($qname)." LIKE @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "==") {
              $where.="(".add_brackets($qname)." =  @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<" || $qoper == ">") {
              $where.="(".add_brackets($qname).$qoper." @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<>") {
              $where.="(".add_brackets($qname).$qoper."@".(string)$paramCount." AND ".add_brackets($qname)." NOT LIKE @".(string)($paramCount+1).")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "!=") {
              $where.="(".add_brackets($qname)."<> @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              }
          if ($qoper == "<=" || $qoper == ">=") {
              $where.="(".add_brackets($qname).$qoper." @".(string)$paramCount." OR ".add_brackets($qname)." LIKE @".(string)($paramCount+1).")";
              $paramCount++;
              $params[$paramCount]=$qvalue[$i];
              $paramCount++;
              $params[$paramCount]=$qvalue[$i].'%';
              }
          if ($qoper == "%") {
              $where.="(".add_brackets($qname)." LIKE @".(string)$paramCount.")";
              $paramCount++;
              $params[$paramCount]='%'.$qvalue[$i].'%';
              }
        }
      }
    }
    if ($i == ($qvaluecount-1)) {$where.=")";}
  }
}
return $where;
}  

function appml_GetOrderby($txtOrderby,$txtsortitems,$requestFilter) {
$legalOrderbyField=array();
$legalOrderbyDir=array();
$osfield=array();
$osdir=array();
$legalOrderbyFieldcount=0;
$orderby="";
$txt=$txtsortitems;
if ($txt != "") {
    $l=app_arrayLength($txt);
    for ($i=0; $i<$l; $i++) {
      $legalOrderbyField[$i]=app_getProperty($txt[$i], "item");
      $legalOrderbyDir[$i]="asc";
    }
}
$legalOrderbyFieldcount=app_arrayLength($legalOrderbyField);
$arr="";
if ($requestFilter) {$arr=$requestFilter->orderBys; }
$l=app_arrayLength($arr);
for ($i=0; $i<$l; $i++) {
  $osfield[$i]=$arr[$i];
  $osdir[$i]=$requestFilter->orderByDirections[$i];
}
$orderselect="";
$l=app_arrayLength($osfield);
for ($i=0; $i<$l; $i++) {
  if ($osfield[$i] != "") {
    $orderbyOK=0;
    for ($j=0; $j<$legalOrderbyFieldcount; $j++) {
      if (trim($osfield[$i]) == trim($legalOrderbyField[$j])) {
        $orderbyOK=1;
        break;
      }
    }
    if ($orderbyOK == 1) {
      if ($orderselect != "") {$orderselect.=",";}
      $orderselect.=" ".$osfield[$i]." ".$osdir[$i];
    }
  }
}
if ($orderselect != "" && $orderby != "") {
  $orderby=$orderselect.", ".$orderby;
}
else {
  if ($orderselect != "" && $orderby == "") {
    $orderby=$orderselect;
  }
}
if ($orderby == "") {
  $orderby=$txtOrderby;
}
if ($orderby != "") {
  $orderby=" ORDER BY ".$orderby;
}
return $orderby;
}

function add_brackets($txt) {return $txt;}

function app_formatDate($txt, $appformat) {
if (app_nullTest($txt)) {
  return "";
}
if (trim($txt) == "") {
  return "";
}
$date=date_create($txt);
$y=date_format($date,"Y");
$m=date_format($date,"m");
$d=date_format($date,"d");
$h=date_format($date,"H");
$n=date_format($date,"i");
$s=date_format($date,"s");  
$c=substr($y,2,2);
if (strlen($m) < 2) {$m="0".$m;}
if (strlen($d) < 2) {$d="0".$d;}
if (strlen($h) < 2) {$h="0".$h;}
if (strlen($n) < 2) {$n="0".$n;}
if (strlen($s) < 2) {$s="0".$s;}
$t=$appformat;
$t=str_replace("yyyy",$y,$t);
$t=str_replace("mm",$m,$t);
$t=str_replace("dd",$d,$t);
$t=str_replace("yy",$c,$t);
$t=str_replace("hh",$h,$t);
$t=str_replace("nn",$n,$t);
$t=str_replace("ss",$s,$t);
return $t;
}

function app_getSQLDateFormat() {
return "yyyy-mm-dd";
}

function getUserAccess($security) {
    $ret = "";
    $userAccess = "";
    if (app_nullTest($security)) {
        $sec = "";
    } else {
        $sec = strtoupper($security);
    }
    if ($sec == "") {
        $ret = "OK";
    } else {
        $sec = trim($sec);
        $userAccess = app_getSession("appmlaccess");
      if ($userAccess == "") {
          return "NOTLOGGEDIN";
      } else {
          $ARR = explode(",", $userAccess);
          foreach ($ARR as $x) {
              $z = trim(strtoupper($x));
              if ($sec == $z) {
                  return "OK";
              }
          }
      }
    }
    return $ret;
}

function app_error($errtxt) {
echo "{\"error\" : \"".$errtxt."\"}";
exit();
return;
}

function app_reformatDate($txt,$dtype) {
$ret="";
if ($txt != "") {
  $d=substr($txt,_instr(0,$dtype,"dd",0)-1,2);
  $m=substr($txt,_instr(0,$dtype,"mm",0)-1,2);
  $y=substr($txt,_instr(0,$dtype,"yyyy",0)-1,4);
  $ret=$y."-".$m."-".$d;
}
return $ret;
}

function remove_quotes($ttt) {
$out="";
if (app_nullTest($ttt)) {return "";}
for ($i=1; $i<=strlen($ttt); $i++) {
  $c=substr($ttt,$i-1,1);
  if ($c == "'") {$c="''";}
  $out.=$c;
}
return $out;
}

function app_getElementValue($element, $id) {
$res="";
$uelement=strtoupper($element);
$uid=strtoupper($id);
$ipos1=_instr(0,$uelement,"<".$uid,0);
if ($ipos1 > 0) {
  $ipos2=_instr(0,substr($uelement,$ipos1-1),">",0);
  $ipos3=_instr(0,$uelement,"</".$uid.">",0);
  if ($ipos2 > 0 && $ipos3 > $ipos1) {
    $res=trim(substr($element,$ipos1 + $ipos2-1,$ipos3-$ipos2-$ipos1));
  }
}
return $res;
}

function app_getElement($element, $id) {
$uelement=strtoupper($element);
$uid=strtoupper($id);
$ipos1=_instr(0,$uelement,"<".$uid,0);
$ipos3=_instr(0,$uelement,"</".$uid.">",0);
$res="";
if ($ipos1 > 0) {
  if ($ipos3 > $ipos1) {
    $res=substr($element,$ipos1-1,$ipos3-$ipos1 + strlen($id) + 3);
  }
  else {
    $ipos3=_instr(0,substr($uelement,$ipos1-1),"/>",0);
    if ($ipos3 > 0) {
      $res=substr($element,$ipos1-1,$ipos3 + 1);
    }
  }
}
return $res;
}

function app_getAttribute($element, $attribute) {
$txt=$element;
$res="";
$tst=34;
$ipos=_instr(0,$txt," ".$attribute."=".chr($tst),0);
if ($ipos == 0) {
  $tst=39;
  $ipos=_instr(0,$txt," ".$attribute."=".chr($tst),0);
}
if ($ipos != 0) {
  $txt=substr($txt,$ipos + strlen($attribute) + 2);
  $ipos=_instr(0,$txt,chr($tst),0);
  if ($ipos > 1) {
    $res=substr($txt,0,$ipos-1);
  }
}
return $res;
}

function app_getElementArray($element, $id) {
$x=array();
$uid=strtoupper($id);
$xelement=$element;
$l=0;
for ($i=1; $i<=10000; $i++) {
  $uelement=strtoupper($xelement);
  $ipos1=_instr(0,$uelement,"<".$uid,0);
  $ipos3=_instr(0,$uelement,"</".$uid.">",0);
  if ($ipos1 > 0 && $ipos3 > $ipos1) {
    $l++;
    $x[$l]=substr($xelement,$ipos1-1,$ipos3-$ipos1 + strlen($id) + 3);
    $xelement=substr($xelement,$ipos3 + strlen($id) + 2);
  }
  else {
    break;
  }
}
return $x;
}

function app_arrayLength($arr) {
    if (is_array($arr)) {
        return count($arr);
    }
    return 0;
}

function app_getSysDecSep() {
$decsep=1 / 2;
$decsep=($decsep);
$decsep=substr($decsep,1,1);
return $decsep;
}

function app_readRequest() {
$tmp="";
$file=fopen("php://input","r") or exit("Unable to open file!");
while (!feof($file))  {$tmp=$tmp.fgetc($file);}
fclose($file);
return $tmp;
}

function app_loadTextFromFile($fname) {
$tmp="";
$ext=".js";
if (_instr(0,$fname,".",0) > 0) {$ext="";}
if (!file_exists($fname.$ext)) {app_error("No such file or directory: $fname.$ext"); }
return file_get_contents($fname.$ext);
/*$lines=file($fname.$ext);
foreach ($lines as $value) {
  if (!$tmp)
    {$tmp = $value;}
    else
    {$tmp=$tmp.$value;}
}
return $tmp;*/
}

function app_nullTest($x) {
$cc=false;
if (!isset($x)) {$cc=true;}
else {
  if (empty($x)) {$cc=true;}
}
return $cc;
}

function app_setSession($nam, $acc) {
$_SESSION["appmluser"]=$nam;
$_SESSION["appmlaccess"]=$acc;
return 0;
}

function app_getSession($nam) {
    if (isset($_SESSION[$nam])) {
      return $_SESSION[$nam];
    }
    return "";
}

function app_getUserAccess($userName,$pwd,$modConfig) {
    $nn=app_setSession("","");
  $userAccess = "";
    if ($userName == "" || $pwd == "") {return $userAccess;}
    if (isset($modConfig->users)) {
      $userArr = $modConfig->users;
      $ll = count($userArr);
      for ($ii = 0; $ii < $ll; $ii++) {
          if ($userArr[$ii]->username == $userName && $userArr[$ii]->password == $pwd) {
              $arr = $userArr[$ii]->roles;
              $lll = count($arr);
              $userAccess = "";
              for ($iii = 0; $iii < $lll; $iii++) {
                  if ($userAccess != "") {$userAccess.=",";}
                  $userAccess .= $arr[$iii];
              }
          }
      }
    } else {
      if (isset($modConfig->securitydb)) {
        $database = $modConfig->securitydb;
        if ($database != "") {
            //$sql="SELECT AppmlRoles.Name FROM ((AppmlUserRoles";
            //$sql.= " LEFT JOIN AppmlUsers ON AppmlUserRoles.UserID=AppmlUsers.UserID)";
            //$sql.=" LEFT JOIN AppmlRoles ON AppmlUserRoles.RoleID=AppmlRoles.RoleID)";
            //$sql.=" WHERE AppmlUsers.Email=@0 AND AppmlUsers.Pass=@1;";
        $sql = $database->sql;
            $dbConnection=app_getDbConnection("", $database);
            $paramCount=2;
            $params[1]=$userName;
            $params[2]=$pwd;
            $dbRecordset=app_dbRead($dbConnection,$sql,$paramCount,$params);
            $userAccess="";
            $totalCounter=app_dbRowcount($dbRecordset);
            if ($totalCounter==0) {app_error("APPML_ERR_NOT_AUTHORIZED");}
            $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
            $nn=0;
            while ($nn < $totalCounter) {
                $nn++;
                if ($userAccess != "") {$userAccess.=",";}
                $userAccess.=$row[0];
                $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
            }           $dbRecordset->close();
        }
        }
    }
    return $userAccess;
}

function app_dbRead($conn,$sql,$count,$p) {
$xarr=array();
$xsql=app_prepSQL($sql,$count);
$stmt=$conn->stmt_init();
$stmt->prepare($xsql);
if ($count>0) {
    $xarr[0]="";
    for ($j=1;$j<=$count;$j++) {
        $xarr[0].="s";
        $xarr[$j]=&$p[$j];
    }
    call_user_func_array(array($stmt,'bind_param'), $xarr);
}
if (!$stmt->execute()) {app_error($conn->error);}
if (!$dbRecordset = $stmt->get_result()) {app_error($conn->error);}
return $dbRecordset;
}

function app_executeSQL($conn,$sql) {
$xcount=app_arrayLength($sql);
for ($i=0; $i<$xcount; $i++) {
    //$sql[$i]=iconv("ISO-8859-1", "UTF-8//TRANSLIT", $sql[$i]);
    if (!$conn->query($sql[$i])) {app_error($conn->error." ".$sql[$i]);}
}
return;
}

function app_dbUpdate($conn,$table,$count,$fields,$values,$keyField,$keyValue) {
$xarr=array();
if ($count==0) {return 0;}
$sql="UPDATE ".$table." SET ";
$xarr[0]="";
for ($i=1;$i<=$count;$i++) {
  $xarr[0].="s";
  $xarr[$i]=&$values[$i];
  $sql=$sql.$fields[$i]."=@".(string)($i-1)." ";
  if ($i!=$count) {$sql=$sql.",";}
}
$xarr[0].="s";
$xarr[$count+1]=&$keyValue;
$sql=$sql." WHERE ".$keyField."=@".(string)($count)." ";
$sql=app_prepSQL($sql,$count+1);
$stmt=$conn->stmt_init();
$stmt->prepare($sql);
call_user_func_array(array($stmt,'bind_param'), $xarr);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$conn->affected_rows;
$conn->close();
return $num;
}

function app_dbAddNew($conn,$table,$count,$fields,$values) {
$xarr=array();
$sql="INSERT INTO ".$table."(";
for ($i=0;$i<$count;$i++)
  {
  $sql=$sql.$fields[$i];
  if ($i<$count-1) {$sql=$sql.",";}
  }
$sql=$sql.") VALUES (";
$xarr[0]="";
for ($i=1;$i<=$count;$i++)
  {
  $xarr[0].="s";
  $sql.="@".(string)($i-1);
  $xarr[$i]=&$values[$i-1];
  if ($i!=$count) {$sql=$sql.",";}
  }
$sql=$sql.");";
$sql=app_prepSQL($sql,$count);
$stmt=$conn->stmt_init();
$stmt->prepare($sql);
call_user_func_array(array($stmt,'bind_param'), $xarr);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$stmt->insert_id;
$conn->close();
return $num;
}

function app_dbDelete($conn,$mainTable,$keyField,$keyValue) {
$sql="DELETE FROM ".add_brackets($mainTable)." WHERE ".$keyField."=@0;";
$sql=app_prepSQL($sql,1);
$stmt=$conn->stmt_init();
$stmt->prepare($sql);
$stmt->bind_param('s',$keyValue);
if (!$stmt->execute()) {app_error($conn->error." ".$sql);}
$num=$conn->affected_rows;
$conn->close();
return $num;
}

function app_getDbConnection($dbcon,$model) {
    $arr = array();
    $xdbcon = strtoupper($dbcon);
    $arr = $model;
    $txt = "";
    if (is_array($arr)) {
        $l = app_arrayLength($arr);
        for ($i = 0; $i < $l; $i++) {
            $x = $arr[$i]->connection;
            if (strtoupper($x) == $xdbcon) {
                $txt = $arr[$i];
                break;
            }
        }  
    } else {
        $txt = $arr;
    }
if ($txt=="") {app_error("APPML_ERR_UKNOWN_DB: ".$dbcon);}
$dbHost=$txt->host;
$dbName=$txt->dbname;
$dbUser=$txt->username;
$dbPass=$txt->password;
$conn = new mysqli($dbHost,$dbUser,$dbPass,$dbName);
if (mysqli_connect_errno())
  {
  app_error("Failed to connect to MySQL: " . mysqli_connect_error());
  }
$conn->set_charset('utf8');
return $conn;
} 

function app_getDBfield($row, $fnam, $typ) {
$x="";
try {
    $x=$row[$fnam];
    if (app_nullTest($x)) {$x="";}
    else {
      if ($typ == "date") {
        $x=app_formatDate($x, app_GetSQLDateFormat());}
        else {$x=(string)$x;}
    }
}
catch (Exception $e){$x="";} 
return $x;
}

function app_dbRowcount($recset) {
return $recset->num_rows;
}

function app_prepSQL($sql,$count) {
$mysql=$sql;
for ($i=1;$i<=$count;$i++) {
$mysql=str_replace("@".(string)($i-1),"?",$mysql);
}
return $mysql;
}

function app_getType($txt) {
$ret="number";
if ($txt==252) {$ret="binary";}
if ($txt==7 || $txt==10 || $txt==11 || $txt==12 || $txt==13) {$ret="date";}
if ($txt==253 || $txt==254) {$ret="string";}
return $ret;
}

function app_isDate($x) {$x=true;}

function app_cDate($x) {return strtotime($x);}

// Helper Function
function _instr($start,$str1,$str2,$mode) {
if ($mode) { $str1=strtolower($str1); $str2=strtolower($str2); }
$retval=strpos($str1,$str2,$start);
return ($retval===false) ? 0 : $retval+1;
}

function app_decodeJSON($txt, $bool) {
    try {
        $jsonObj = json_decode($txt, $bool);
    } catch (Exception $e) {
        $jsonObj = "";
    }
    return $jsonObj;
}

function app_getProperty($obj, $prop) {
    if (isset($obj->$prop)) {
        return $obj->$prop;
    }
    return "";
}

function app_getData($modDatabase,$modConfig,$txtModel,$modDateFormat,$sql,$keyField,
$keyValue,$keyCounter,$requestQuery,$recPos,$maxLines,$totalCounter) {
$params=array();
$fName=array();
$fValue=array();
$fType=array();
$mainTable=app_getProperty($modDatabase, "maintable");
$paramCount=0;
$txtWhere=app_getProperty($modDatabase, "where");
$txtOrderby=app_getProperty($modDatabase, "orderby");
$fromRec=$recPos;
$toRec=app_setToPosition($fromRec,$maxLines);
$dbConnection=app_getDbConnection(app_getProperty($modDatabase, "connection"),$modConfig->databases);
$dataOut="";
if ($keyValue!="") {
  if ($keyCounter==0) {app_error("APPML_ERR_KEYFIELD_REQ");}
  if ($mainTable=="") {app_error("APPML_ERR_MAINTABLE_REQ");}
  if ($keyValue=="NULL") {$keyValue="-1";}
  $sql=$sql . " WHERE " . add_brackets($mainTable) . "." . add_brackets($keyField) . "=@0;";
  $paramCount=1;
  $params[1]=$keyValue;
}
else
{
  $txtFilter=app_getProperty($txtModel, "filteritems");
  $cc=appml_GetQueryWhere($txtWhere,$txtFilter,$requestQuery,$paramCount,$params);
  if ($cc!="") {$sql=$sql . " WHERE " . $cc;}
  if ($totalCounter==0) {
      //$dbRecordset=app_dbRead($dbConnection,$sql." LIMIT 500",$paramCount,$params);
      $dbRecordset=app_dbRead($dbConnection,$sql,$paramCount,$params);
        $totalCounter=app_dbRowcount($dbRecordset);
    $dbRecordset->close();
  }
  if ($toRec==0) {$toRec=$totalCounter;}
  if ($recPos=="-1") {
    $fromRec=$totalCounter-$maxLines+1;
    $toRec=$totalCounter;
    }
  $txtsortitems=app_getProperty($txtModel, "sortitems");
  $cc=appml_GetOrderby($txtOrderby,$txtsortitems,$requestQuery);
  if ($cc!="") {$sql=$sql . $cc;}
    //$sql=$sql." LIMIT ".$toRec;
}
$dbRecordset=app_dbRead($dbConnection,$sql,$paramCount,$params);
if ($keyValue!="") {
  $totalCounter=app_dbRowcount($dbRecordset);
}
$fCount=$dbRecordset->field_count;
$i=0;
while ($x=$dbRecordset->fetch_field()) {
  $fType[$i]=app_getType($x->type);
    $fName[$i]=$x->name;
    $fValue[$i]="";
    $i++;
}
$row=$dbRecordset->fetch_array(MYSQLI_BOTH);
$nn=0;
while ($nn<$totalCounter) {
  $nn=$nn+1;
  if ($nn>=$fromRec and $nn<=$toRec) {
    $cc="";
        $i=count($row)/2;
    for ($j=0; $j<count($row)/2; $j++) {
      $txt=$row[$j];
      if ($txt==NULL) {$txt="";}
        if (app_getType($fType[$j])=="date") {
                $txt=app_formatDate($txt,$modDateFormat);
            }
      $fValue[$j]=$txt;
      if ($fName[$j]==$keyField) {$cc=$fValue[$j];}
    }
        if ($dataOut!="") {$dataOut.=",";}
    $dataOut=$dataOut . app_getRecordAsJSON($fName,$fType,$fValue,$fCount);
  }
    $row=$dbRecordset->fetch_array(MYSQLI_BOTH);
}
if ($keyValue!="") {$totalCounter=$nn;}
if ($totalCounter<$toRec) {$toRec=$totalCounter;}
if ($nn==0 or $recPos=="0") {
  $totalCounter=0;
  $dataOut=$dataOut . app_getRecordAsJSON($fName,$fType,$fValue,$fCount);
}
$dbRecordset->close();
$cc= <<<EOT
, "recPos" : $fromRec, "fromRec" : $fromRec, "toRec" : $toRec, "rowsperpage" : $maxLines, "totalRecCounter" : $totalCounter, "records" : [$dataOut]
EOT;
return $cc;
}
?>