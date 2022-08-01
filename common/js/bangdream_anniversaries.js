
var weekdayNames = new Array("일","월","화","수","목","금","토");

function refreshFilter(){
 var categoryFilter = [];
 var categoryFilterList = document.getElementById("filter_types").querySelectorAll("input[name='output_filter']");
 var numCategories = categoryFilterList.length;
 for(x=0;x<numCategories;x++){
  var _checkboxes_c = categoryFilterList[x];
  var categoryCode = _checkboxes_c.value;
  categoryFilter[categoryCode] = !!(_checkboxes_c.checked);
 }

 var seriesFilter = [];
 var seriesFilterList = document.getElementById("filter_series").querySelectorAll("input[name='output_filter']");
 var numSeries = seriesFilterList.length;
 for(y=0;y<numSeries;y++){
  var _checkboxes_s = seriesFilterList[y];
  var seriesCode = _checkboxes_s.value;
  seriesFilter[seriesCode] = !!(_checkboxes_s.checked);
 }

 var $dateList = $(document.getElementsByClassName("i_date"));
 $dateList.each(function(){
  $itemList = $(this).find(document.getElementsByClassName("i_list"));
  $li = $itemList.children("li");
  $li.each(function(){
   var seriesList = this.classList;
   var inSeries = false;

   for(s=0;s<seriesList.length;s++){
    var idText = this.classList[s].split("_");
    if(seriesFilter[idText[1]]){
     inSeries = true;
     break;
    }
   }

   if(categoryFilter[idText[0]] && inSeries){this.style.display = "list-item";}
   else{this.style.display = "none";}

   $(this).closest($dateList).css("display","list-item");
   if($itemList.find(":visible").length == 0){$(this).closest($dateList).css("display","none");}
  });
 });
}

function keywordFilter(){

 var $keyFilter = $(document.getElementById("keywords"));
 var options_h = {};

 $keyFilter.on("keyup",function(){
  var $kv = $keyFilter.val();
  var $listAll = $(document.getElementsByClassName("i_date"));
  $listAll.css("display","none");
  var $res = $listAll.filter(":contains('"+$kv+"')");
  $res.each(function(){
   var sLists = document.getElementsByClassName("i_list");
   var $resLists = $(this).find(sLists);
   $(this).css("display","list-item");
   var $sList = $resLists.children("li");
   $sList.css("display","none");
   var $sRes = $resLists.children("li:contains('"+$kv+"')");
   $sRes.css("display","list-item");
   var $nRes = $resLists.children("li:visible");
   $nRes.unmark({
    done: function(){$nRes.mark($kv,options_h);}
   });
   if($nRes.length == 0){$(this).css("display","none");}
  });
 });
}

function toggleFilterMode(){

 var cboxes = document.getElementById("filter_cboxes");
 var kwords = document.getElementById("filter_keywords");
 var $_boxes = $("input[name='output_filter']");
 var $_boxes_c = $("input[name='output_filter']:checked");
 if(cboxes.checked){
  $_boxes.prop("disabled",false);
  document.getElementById("keywords").value = "";
  document.getElementById("keywords").disabled = true;

  $_boxes.trigger("change");
  $(document.getElementById("keywords")).trigger("change");
 }else if(kwords.checked){
  $_boxes.prop("checked",true);
  $_boxes.prop("disabled",true);
  document.getElementById("keywords").value = "";
  document.getElementById("keywords").disabled = false;

  if($_boxes_c.length !== $_boxes.length){$_boxes.trigger("change");}
 }
 var blankOpts = {};
 $(document.getElementsByClassName("i_date")).unmark(blankOpts);
}

function highlightToday(){
 var now = new Date();
 var mon = now.getMonth()+1;
 var day = now.getDate();
 var checksum = (mon * 100)+day;

 var iToday = document.getElementById("d_"+checksum);
 if(iToday != null){iToday.classList.add("date_today");}

 for(d=1;d<checksum;d++){
  var prevDays = document.getElementById("d_"+d);
  if(prevDays != null && prevDays.classList.contains("date_today")){prevDays.classList.remove("date_today");}
 }
}

function dispDateNow(){
 var dateNow = new Date();
 var yearNow = dateNow.getFullYear();
 var monthNow = dateNow.getMonth()+1;
 var dayNow = dateNow.getDate();
 var weekdayNow = dateNow.getDay();
 var dispHourNow = dateNow.getHours();
 var dispMinsNow = dateNow.getMinutes();
 var dispSecsNow = dateNow.getSeconds();

 var timezoneNow0 = dateNow.getTimezoneOffset();
 var timezoneHours = ((timezoneNow0 <= 0) ? "+" : "-")+Math.floor(-timezoneNow0 / 60);
 var timezoneMins = Math.abs(timezoneNow0) % 60;
 timezoneMins = padzero(timezoneMins,2);
 
 var dispDateTime = `현재 날짜/시간: ${yearNow}년 ${monthNow}월 ${dayNow}일 (${weekdayNames[weekdayNow]}요일) ${padzero(dispHourNow,2)}:${padzero(dispMinsNow,2)}:${padzero(dispSecsNow,2)} (UTC${timezoneHours}:${timezoneMins})`;
 
 document.getElementById("date_now").innerHTML = dispDateTime;
}


function moveToMonthNow(){
 var dateTimeNow = new Date();
 var monthNow = dateTimeNow.getMonth()+1;
 
 var destSect = document.getElementById("scroll_month_"+monthNow);
 if(typeof destSect.scrollIntoView !== "undefined"){destSect.scrollIntoView(true);}
 else{document.location.hash = "month_"+monthNow;}
}

function hideTodayPopup(){
 document.getElementById("layer_today").style.display = "none";
 document.getElementById("anniversaries_today").style.display = "none";
}

function moveToToday(){
 var dateNow = new Date();
 var yearNow = dateNow.getFullYear();
 var monthNow = dateNow.getMonth()+1;
 var dayNow = dateNow.getDate();
 var checksum = (monthNow * 100)+dayNow;

 var destSect = document.getElementById("d_"+checksum);
 var listText = "<p><b>오늘의 생일/기념일 목록</b></p>";
 if(destSect != null){
  var $todayList = $(destSect).find(document.getElementsByClassName("i_list"));
  var $charaList = $todayList.find("[class^='chara']");
  var $otherList = $todayList.find("[class^='voices'],[class^='anniv']");
  
  if($charaList.length > 0){$charaList.each(function(){listText += "- "+$(this).text()+"<br />";});}
  if($otherList.length > 0){$otherList.each(function(){listText += "- "+$(this).text()+"<br />";});}

  if($charaList.length == 0 && $otherList.length == 0){listText += "(해당하는 생일이나 기념일이 없습니다)<br />";}

  listText += "<br />";

  var hidePopup = document.createElement("input");
  hidePopup.type = "button";
  hidePopup.value = "닫기";
  hidePopup.addEventListener("click",function(){hideTodayPopup();});

  document.getElementById("layer_today").style.display = "inline-block";
  document.getElementById("anniversaries_today").innerHTML = listText;
  document.getElementById("anniversaries_today").appendChild(hidePopup);
  document.getElementById("anniversaries_today").style.display = "inline-block";

  return;
 }
 alert("해당하는 항목이 없습니다.");
 return;
}

function displayWeekdayYearNow(){
 var y = (new Date()).getFullYear();

 for(c=1;c<=1231;c++){
  if(document.getElementById("d_"+c) != null){
   var m = Math.floor(c / 100);
   var d = c % 100;
   var w = (new Date(y,m-1,d)).getDay();
   $(document.getElementById("d_"+c)).find(".i_weekday").append(`(${weekdayNames[w]}요일)`);
  }else{continue;}
 }
}

var cMessage = "오늘도 반짝반짝 두근두근!!";

if((navigator.appName == "Netscape" && navigator.userAgent.search("Trident") != -1) || (navigator.userAgent.indexOf("msie") != -1)){console.log(cMessage);}
else{console.log("%c "+cMessage,"color:#FF5522;font-weight:bold;");}
