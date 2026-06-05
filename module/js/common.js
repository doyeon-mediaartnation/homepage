function flash_vars(c,d,e,f) {
	var flash_tag = "";
	flash_tag = '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
	flash_tag +='codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" ';
	flash_tag +='WIDTH="'+c+'" HEIGHT="'+d+'" >';
	flash_tag +='<param name="wmode" value="transparent">'; 
	//이부분은 플래쉬 배경을 투명으로 설정하는 부분으로 필요없다면 삭제해도 무방함
	flash_tag +='<param name="movie" value="'+e+'">';
	flash_tag +='<param name="quality" value="high">';
	flash_tag +='<param name="flashvars" value="'+f+'">';
	flash_tag +='<embed src="'+e+'" flashvars="'+f+'" quality="high" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"  WIDTH="'+c+'" HEIGHT="'+d+'"></embed></object>';
	document.write(flash_tag);
}

function swf_obj(src,w,h,swfid){
	swf_html = '';
	swf_html += '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" WIDTH="'+w+'" HEIGHT="'+h+'" id="'+swfid+'">';
	swf_html += '<param name="movie" value="'+src+'">';
	swf_html += '<param name="quality" value="high">';
	swf_html += '<PARAM NAME="menu" VALUE="false">';
	swf_html += '<PARAM NAME="wmode" VALUE="transparent">';
	swf_html += '<EMBED src="'+src+'" menu="false" wmode="transparent" quality="high" WIDTH="'+w+'" HEIGHT="'+h+'" NAME="'+swfid+'"></EMBED>';
	swf_html += '<\/object>';
	document.write(swf_html);
}

//주민등록번호 유효성 체크
function checkJumin(form_name1,form_name2) 
{
	var formvalue = form_name1.value + form_name2.value;
	var result;
	var sum = 0;
	var temp = 2;
	for(var i = 0; i <= 11; i++) {
		sum += parseInt(formvalue.substr(i,1))*temp;
		temp++;
		if(temp == 10) {
			temp = 2;
		}
	}
	result = parseInt(sum) % 11;
	result = (11 - result) % 10;
	if (result != formvalue.substr(12,1)) {
		return false;
	} else {
		return true;
	}

	return true;
}

//사업자등록번호 유효성 체크(숫자10자리)
function checkBiz(vencod) 
{ 
	var sum = 0; 
	var getlist = new Array(10); 
	var chkvalue =new Array("1","3","7","1","3","7","1","3","5");  

	try
	{
		for(var i=0; i<10; i++) 
		{ 
			getlist[i] = vencod.substring(i, i+1); 
		}         

		for(var i=0; i<9; i++) 
		{ 
			sum += getlist[i]*chkvalue[i]; 
		}  

		sum		= sum + parseInt((getlist[8]*5)/10); 
		sidliy	= sum % 10; 
		sidchk	= 0;        

		if(sidliy != 0)
		{ 
			sidchk = 10 - sidliy; 
		} 
		else 
		{
			sidchk = 0; 
		}         

		if(sidchk != getlist[9]) 
		{ 
			return false; 
		} 

		return true; 
	}
	catch(e)
	{
		return false;
	}
}

//HTML제거 함수
function trimHTML(strHtml){
	var objRegExp = new RegExp("<html(.*|)<body([^>]*)>","gi");
	strHtml = strHtml.replace(objRegExp,"");

	var objRegExp = new RegExp("</body(.*)</html>(.*)","gi");
	strHtml = strHtml.replace(objRegExp,"");

	var objRegExp = new RegExp("<[/]*(div|layer|body|html|head|meta|form|input|select|textarea|base|font|br|p|b|img|embed|object|span|table|tbody|tr|td|embed|u|a|strong|li|em|col|bgsound|script|center|h1|hr|o:p)[^>]*>","gi");
	strHtml = strHtml.replace(objRegExp,"");

	var objRegExp = new RegExp("<(style|script|title|link)(.*)</(style|script|title)>","gi");
	strHtml = strHtml.replace(objRegExp,"");

	var objRegExp = new RegExp("<[/]*(scrit|style|title|xmp)>","gi");
	strHtml = strHtml.replace(objRegExp,"");

	var objRegExp = new RegExp("&nbsp;","gi");
	strHtml = strHtml.replace(objRegExp,"");

	return strHtml;
}

function imgResize(target_img, g_width, g_height)
{
    var newX, newY;
    var newHeight, newWidth;
    var newImg;

    var maxWidth = g_width;
    var maxHeight = g_height;

    newImg = new Image();
    newImg.src = target_img.src;
    imgw = newImg.width;
    imgh = newImg.height;

    /*
	if (imgw*1.2 >= imgh) {
    	return false;
    }
	*/

    if (imgw > maxWidth || imgh > maxHeight)
    {
        if(imgw > imgh)
        {
            if(imgw > maxWidth)
                newWidth = maxWidth;
            else
                newWidth = imgw;
            newHeight = Math.round((imgh*newWidth)/imgw);
        }
        else
        {
            if(imgh > maxHeight)
                newHeight = maxHeight;
            else
                newHeight = imgh;
            newWidth = Math.round((imgw*newHeight)/imgh);
        }
    }
    else
    {
        newWidth = imgw;
        newHeight = imgh;
    }
    newX = maxWidth/2 - newWidth/2;
    newY = maxHeight/2 - newHeight/2;

	target_img.onload = null;
	target_img.src = newImg.src;
    target_img.width = newWidth;
    target_img.height = newHeight;

}


//년, 월, 일 입력시 나이 리턴
function getAge(yy, mm, dd) {

	days = new Date();
	gdate = days.getDate();
	gmonth = days.getMonth();
	gyear = days.getYear();
	age = gyear - yy;
	if((mm == (gmonth + 1)) && (dd <= parseInt(gdate))) {
		age = age;
	}
	else {
		if(mm <= (gmonth)) {
			age = age;
		}
		else {
			age = age - 1; 
		}
	}
	if(age == 0)
		age = age;
		
	return age;
}

function setDayVal(mday, objYear, objMonth, objDay)
{
	dateObj = new Date();

	var year = dateObj.getYear();
	var month = dateObj.getMonth() + 1;
	var date = dateObj.getDate() - mday;

	dateObj2 = new Date(year, month, date);

	objYear.value	= dateObj2.getYear();
	objMonth.value	= dateObj2.getMonth();
	objDay.value	= dateObj2.getDate();
}

/* 새창을 화면 가운데 띠움 */
function openCenterWin(w_url,w_title,w_width,w_height,w_resizable,w_scrollbars)
{
	var option = "alwaysRaised,toolbar=0,status=0,menubar=0";
	
	var w_left = (screen.width)?(screen.width-w_width)/2:100;
	var w_top = (screen.height)?(screen.height-w_height)/2:100;
	
	//width 와 height 가 있을때만 화면의 가운데에 표시한다
	if (w_width) option = option + ",width=" + w_width + ",left=" + w_left;
	if (w_height) option = option + ",height=" + w_height + ",top=" + w_top;
	//창크기 조절가능과 스크롤바 표시는 기본적으로 보이지 않으며, 지정할때만 보인다
	if (w_resizable == true) option = option + ",resizable=yes";
	if (w_scrollbars == true) option = option + ",scrollbars=yes";

	var new_instance = window.open(w_url,w_title,option,"");
	new_instance.focus();
}

function isObject(form_element_name)
{
	val = typeof(form_element_name);

	if( val == "undefined")
		return false;
	else
		return true;
}

//알파벳 체크 함수
function isAlpha(form_element_name, msg)
{
	var alpha ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var num='0123456789';
	var alphanum=alpha + num;
	var t = form_element_name.value;

	for (i=0; i<t.length; i++){
			if (alphanum.indexOf(t.substring(i,i+1))<0) {
				alert(msg);
				form_element_name.focus();
				return false;
			}
	}

	return true;
}

function isAlphaModal(form_element_name, msg)
{
	var alpha ='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	var num='0123456789';
	var alphanum=alpha + num;
	var t = form_element_name.value;

	for (i=0; i<t.length; i++){
			if (alphanum.indexOf(t.substring(i,i+1))<0) {
				document.getElementById("alertTxt").innerText = msg;
				$(".GblNotice_open").click();
				form_element_name.focus();
				return false;
			}
	}

	return true;
}

function moveNextBox(str_size, form_element_name, next_form_element_name)
{
	if(form_element_name.value.length>=str_size)
		next_form_element_name.focus();
}

function isEmail(form_element_name){
	var email = form_element_name.value;
	var strPattern = "^[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*@[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+$";
	
	if (email.match(strPattern)){
		return true;
	}
	else{
		alert("이메일 주소를 정확히 입력해 주십시오.");
		form_element_name.focus();
		return false;
	}
} 

function isEmailModal(form_element_name,msg){
	var email = form_element_name.value;
	var strPattern = "^[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*@[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+$";
	
	if (email.match(strPattern)){
		return true;
	}
	else{
		document.getElementById("alertTxt").innerText = msg;
		$(".GblNotice_open").click();
		form_element_name.focus();
		return false;
	}
} 

//basic function : 
/*
function isFrmEmpty(form_element_name, msg)
{
	if(form_element_name.value == ""){
		alert(msg);
		form_element_name.focus();
		return true;
	}
	else
		return false;
}
*/
function isFrmEmpty(form_element_name, msg)
{
	chkTxt = form_element_name.value.replace(/\s/gi, ''); // 모든 공백을 제거

	if(chkTxt == ""){
		alert(msg);
		form_element_name.focus();
		return true;
	}
	else
		return false;
}

function isFrmEmptyModal(form_element_name, msg)
{
	chkTxt = form_element_name.value.replace(/\s/gi, ''); // 모든 공백을 제거
	if(chkTxt == ""){
		document.getElementById("alertTxt").innerText = msg;
		$(".GblNotice_open").click();
		form_element_name.focus();
		return true;
	}
	else
		return false;
}

//basic function : 
function isNumber(form_element_name, msg)
{
	if(isFrmEmpty(form_element_name, msg))
		return false;
	else {
		if(!isNaN(form_element_name.value))
			return true;
		else {
			alert(msg);
			form_element_name.focus();
			return false;
		}
	}
}

//basic function :
function isSame(form_element_name1, form_element_name2, msg)
{
	if(form_element_name1.value == form_element_name2.value)
		return true;
	else {
		alert(msg);
		form_element_name1.focus();
		return false;
	}
}

function isCheck(form_element, msg){
	var is_checked = false;
	for(i=0; i<form_element.length; i++){
		if(form_element[i].checked){
			is_checked = true;
			break;
		}
	}

	if(is_checked){
		return true;
	}
	else {
		alert(msg);
		return false;
	}
}


function isCheckModal(form_element, msg){
	var is_checked = false;
	for(i=0; i<form_element.length; i++){
		if(form_element[i].checked){
			is_checked = true;
			break;
		}
	}

	if(is_checked){
		return true;
	}
	else {
		document.getElementById("alertTxt").innerText = msg;
		$(".GblNotice_open").click();
		return false;
	}
}


function isOneCheckModal(form_element, msg){
	if(form_element.checked){
		return true;
	}else{
		document.getElementById("alertTxt").innerText = msg;
		$(".GblNotice_open").click();
		return false;
	}
}

//extend function :
function isNumber3(form_element_num1, form_element_num2, form_element_num3, msg)
{
	if(!isNumber(form_element_num1, msg))	return false;
	if(!isNumber(form_element_num2, msg))	return false;
	if(!isNumber(form_element_num3, msg))	return false;

	return true;
}

function isMultiCheck(form_name, form_element, msg){
	var box = eval("document."+form_name+".elements['"+form_element+"']");
	if(box.length>1){
		is_checked = false;
		for(i=0; i<box.length; i++){
			if(box[i].checked==true){
				is_checked = true;
				break;
			}
		}

		if(!is_checked){
			alert(msg);
			return false;
		}
	}

	return true;
}

function isArray(form_name, form_element){
	var form_element2 = eval("document."+form_name+".elements['"+form_element+"']");
	if(form_element2.length>1)
		return true;
	else
		return false;
}

//extend function :
function isJumin(form_element_jumin1, form_element_jumin2)
{
	if(!isNumber(form_element_jumin1, "주민등록 번호를 숫자로 입력해 주세요"))	return false;
	if(!isNumber(form_element_jumin2, "주민등록 번호를 숫자로 입력해 주세요"))	return false;
	
	if(!checkJumin(form_element_jumin1, form_element_jumin2)){
		alert("주민등록번호가 일치하지 않습니다.");
		form_element_jumin1.focus();
		return false;
	}

	return true;
}

function getChkLen(form_element)
{
	var cnt; 
	var vartype = typeof(form_element.length);

	if(vartype=="undefined")
		 cnt = 1;
	else
		cnt = form_element.length;
	
	return cnt;
}

function getChkCnt(form_name, element_name)
{
	var chklen = 0;
	var form_element;

	form_element = eval("document."+form_name+"."+element_name);
	var cnt = getChkLen(form_element);

	if(cnt==1){
		if(form_element.checked==true)
			chklen = 1;
		else
			chklen = 0;
	}
	else{
		for(i=0; i<cnt; i++){
			form_element = eval("document."+form_name+"."+element_name+"["+i+"]");
			if(form_element.checked==true)
				chklen += 1;
		}
	}

	return chklen;
}

function selectAll(form_name, element_name)
{
	var form_element = eval("document."+form_name+"."+element_name);
	var len = getChkLen(form_element);

	if(len<=1){
		var chkbox = eval("document."+form_name+"."+element_name);
		if(chkbox.checked==false)
			chkbox.checked = true;
		else
			chkbox.checked = false;
	}
	else {
		var chkbox0 = eval("document."+form_name+"."+element_name+"[0].checked");

		for(i=0; i<len; i++){
			var chkbox = eval("document."+form_name+"."+element_name+"["+i+"]");
			
			if(chkbox0==true)
				chkbox.checked = true;
			else
				chkbox.checked = false;
		}
	}
}

function selectAll2(root_check, form_name, element_name)
{
	var form_element = eval("document.all('"+form_name+"')."+element_name);

	var len = getChkLen(form_element);

	if(len<=1){
		var chkbox = eval("document.all('"+form_name+"')."+element_name);
		if(root_check.checked==false)
			chkbox.checked = false;
		else
			chkbox.checked = true;
	}
	else {
		for(i=0; i<len; i++){
			var chkbox = eval("document.all('"+form_name+"')."+element_name+"["+i+"]");
			
			if(root_check.checked==true)
				chkbox.checked = true;
			else
				chkbox.checked = false;
		}
	}
}

//모든 checkbox선택
function allcheck(sel){ 
	var f = document.FRM; 
    var getobj = document.getElementsByTagName("input"); 
    for(var i=0; i<getobj.length; i++){ 
        if(getobj[i].type.toLowerCase() == "checkbox"){ 
            getobj[i].checked = sel; 
        }
    } 
} 


function search()

{
	var form = document.FRM;
/*
	if(isObject(form.scolumn)){
		if(isFrmEmpty(form.scolumn, "검색할 분류를 선택해 주십시오"))	return;
	}
*/
	form.submit();
}

function searchM(form)
{
	form.action = "/module/common/requestMult.php";
	form.submit();
}

function getCookie( name )
{
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x <= document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 )
			break;
	}
	return "";
}

function setCookie( name, value, expiredays )
{
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function set_auto(pos)
{
	if(pos=="0")
		var form = document.LOG;
	else
		var form = document.LOG2;

	save_userid = getCookie("save_userid");
	if(save_userid=="Y"){
		form.isSave.checked = true;
		form.userid.value = getCookie("ck_userid");
	}
}

function format_number(num) { 
	if (num < 0) { num *= -1; var minus = true} 
	else var minus = false 

	var dotPos = (num+"").split(".") 
	var dotU = dotPos[0] 
	var dotD = dotPos[1] 
	var commaFlag = dotU.length%3 

	if(commaFlag) { 
	var out = dotU.substring(0, commaFlag) 
	if (dotU.length > 3) out += "," 
	} 
	else var out = "" 

	for (var i=commaFlag; i < dotU.length; i+=3) { 
	out += dotU.substring(i, i+3) 
	if( i < dotU.length-3) out += "," 
	} 

	if(minus) out = "-" + out 
	if(dotD) return out + "." + dotD 
	else return out 
} 

function zoomZ(img){
	window.open("/module/common/zoom.php?img="+img,"img","left=100,top=100");
}

function openMovie(file_name){
	window.open("/module/common/viewMovie.php?fn="+file_name,"movie","left=0,top=0,width=350,height=350,scrollbars=auto");
}

function downFile(file_dir, file_name){
	location.href="/module/common/download.php?file_dir="+file_dir+"&file_name="+file_name;
}

function AutoAddr(key){
	url	= "/module/common/PostChoice.php?key="+key;
	window.open(url,"AutoAddr","toolbar=no,menubar=no,scrollbars=1,resizable=no,width=340,height=350");
}

function checkid(stype)
{
	var form = document.MEM;

	switch(stype){
		case 'N':
			stype = 'N';
			col_name	= form.nicname.value;
			if (form.nicname.value.length <= 0) {
				alert("닉네임을 입력해 주십시오!!") ;
				form.nicname.focus() ;
				return;
			}
			break;

		default:
			stype = '';
			col_name	= form.userid.value;

			if (form.userid.value.length < 4) {
				alert("아이디는 4글자 이상입니다!!") ;
				form.userid.focus() ;
				return;
			}
			break;
	}

	window.open('/module/common/UserIdCheck.php?stype='+stype+'&userid=' + col_name,'CheckID','top=200,left=500,width=300,height=200');
}

function find_zip(zip1,zip2,address) 
{
	openCenterWin('/module/common/find_zip.php?zip1='+zip1+'&zip2='+zip2+'&addr1='+address,'우편번호검색',450,280)
}



function flash(c,d,e) {
 var flash_tag = "";
 flash_tag = '<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';
 flash_tag +='codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" ';
 flash_tag +='WIDTH="'+c+'" HEIGHT="'+d+'" >';
 flash_tag +='<param name="wmode" value="transparent">'; 
 //이부분은 플래쉬 배경을 투명으로 설정하는 부분으로 필요없다면 삭제해도 무방함
 flash_tag +='<param name="movie" value="'+e+'">';
 flash_tag +='<param name="quality" value="high">';
 flash_tag +='<embed src="'+e+'" quality="high" wmode="transparent" pluginspage="http://www.macromedia.com/go/getflashplayer" ';
 flash_tag +='type="application/x-shockwave-flash"  WIDTH="'+c+'" HEIGHT="'+d+'"></embed></object>'
 document.write(flash_tag);
}


function site_fav(url,txt){
	window.external.AddFavorite(url,txt);
}


function re_id_form(){
	form = document.frm_reply;
	re_user.innerHTML="<input type='text' name='re_name' style='width:90px;height:21px;' value=''>";
	form.re_name.focus();
	form.re_name.focus();
}

 function re_pwd_form(){
  re_pwd.innerHTML="<input type='password' name='re_pwd' style='width:90px;height:21px;' value=''>";

  document.frm_reply.re_pwd.focus();
  document.frm_reply.re_pwd.focus();
 }

function pwd_popup(mod,type,idx,table){
	var w = 268;
	var h = 152;
	var left = (screen.width) ? (screen.width-w)/2 : 0;
    var top = (screen.height) ? (screen.height-h)/2 : 0;
	window.open("/board/pwd_popup.php","pwd","width="+w+", height="+h+", left="+left+", top="+top+", scrollbars=no");

	if(mod=='1'){		
		document.frm_view.type.value = type;
		document.frm_view.target = "pwd";
		document.frm_view.action = '/board/pwd_popup.php?mod='+mod;
		document.frm_view.submit();
	}else{
		document.frm_reply.idx.value = idx;
		document.frm_reply.target = "pwd";
		document.frm_reply.action = '/mboardodule/pwd_popup.php?mod='+mod;
		document.frm_reply.submit();
	}
}





function All_chk(a_name,e_name){
	var all = document.getElementsByName(a_name); 
    var f = document.getElementsByName(e_name); 

	isCheck = all[0].checked;

   
    for(var i = 0; i < f.length; i++){ 
		f[i].checked = isCheck; 
    } 
}

function All_chk_btn(a_name,e_name){
	var all = document.getElementsByName(a_name); 
    var f = document.getElementsByName(e_name); 

	isCheck = all[0].checked;

	if(isCheck){
		all[0].checked = false;
		isCheck = false;
	}else{
		all[0].checked = true;
		isCheck = true;
	}

   
    for(var i = 0; i < f.length; i++){ 
		f[i].checked = isCheck; 
    } 
}


function id_pwd_search(){
	var w = 410;
	var h = 223;
	var left = (screen.width) ? (screen.width-w)/2 : 0;
    var top = (screen.height) ? (screen.height-h)/2 : 0;
	var win = window.open("/member/find.html","sear","width="+w+", height="+h+", left="+left+", top="+top+", scrollbars=no");
}



function imgResize(img){ 
  img1= new Image(); 
  img1.src=(img); 
  imgControll(img); 
} 

function imgControll(img){ 
  if((img1.width!=0)&&(img1.height!=0)){ 
    viewImage(img); 
  } 
  else{ 
    controller="imgControll('"+img+"')"; 
    intervalID=setTimeout(controller,20); 
  } 
} 

function viewImage(img){ 
 W=img1.width; 
 H=img1.height; 
 O="width="+W+",height="+H+",scrollbars=no"; 
 imgWin=window.open("","",O); 
 imgWin.document.write("<html><head><title>:*:*:*:*:*:*: 그린텍 :*:*:*:*:*:*:</title></head>");
 imgWin.document.write("<body topmargin=0 leftmargin=0 style='text-align:center;'>");
 imgWin.document.write("<img src="+img+" onclick='self.close()' style='cursor:hand;'>");
 imgWin.document.close();
} 





var isNN = (navigator.appName.indexOf("Netscape")!=-1);
function autoTab(input,len, e){
var keyCode = (isNN) ? e.which : e.keyCode; 
var filter = (isNN) ? [0,8,9] : [0,8,9,16,17,18,37,38,39,40,46];
if(input.value.length >= len && !containsElement(filter,keyCode)) {
input.value = input.value.slice(0, len);
input.form[(getIndex(input)+1) % input.form.length].focus();
}
function containsElement(arr, ele) {
var found = false, index = 0;
while(!found && index < arr.length)
if(arr[index] == ele)
found = true;
else
index++;
return found;
}
function getIndex(input) {
var index = -1, i = 0, found = false;
while (i < input.form.length && index == -1)
if (input.form[i] == input)index = i;
else i++;
return index;
}
return true;
}





//숫자를 한글로 변환해주기
function number_han(numstr) {
 if (numstr == 0) return '';
 var phonemic = ['','일','이','삼','사','오','육','칠','팔','구'];
 var unit = ['','','십','백','천','만','십만','백만','천만','억','십억','백억','천억','조','십조','백조'];

 var ret = '';
 var part = new Array();
 for (var x=0; x<String(numstr).length; x++) part[x] = String(numstr).substring(x,x+1);
 for (var i=0, cnt = String(numstr).length; cnt > 0; --cnt,++i) {
  p = phonemic[part[i]];
  p+= (p) ? (cnt>4 && phonemic[part[i+1]]) ? unit[cnt].substring(0,1) : unit[cnt] : '';
  ret+= p;
 }

 return ret+" 원";
}



function number_format(numstr){
	var numstr = String(numstr);
	var re0 = /(\d+)(\d{3})($|\..*)/;
	if(re0.test(numstr))
		return numstr.replace(re0,function(str,p1,p2,p3){ return number_format(p1) + "," + p2 + p3;});
	else
		return numstr;
}


function number_format_reset(numstr){
	var price = numstr; // 넘어온 값을 변수에 할당
	var len = numstr.length;  // 넘어온값의 길이를 구함
	for(i=0;i<len;i++){
		price = price.replace(",","");
	}

	return price;  
}


function onlyNumber(){
	var key = event.keyCode;
	
    if((key >= 48 && key <= 57)){
		event.returnValue=true;
	}else{
		alert("숫자만 입력 가능합니다");
		event.returnValue=false;
	}
}


function onManual(num,x,y){

	/*모든 레이어 숨기기*/
	Mimg = document.getElementsByName("Mimg[]");
	Mimg_len = Mimg.length;

	for(i=1; i<=Mimg_len; i++){
		if(num != i){
			chk_table = document.getElementById("Manual"+i);
			chk_table.style.display = 'none';
		}
	}



	/*클릭 위치 확인*/
	tempX = event.clientX + document.body.scrollLeft;
    tempY = event.clientY + document.body.scrollTop;


	modX = x.substring(0,1);	//x값 설정
	posX = x.substring(1,x.length);	//x값 위치

	if(modX=='+')	 var	img_x = tempX + parseInt(posX);
	else	 var	img_x = tempX - parseInt(posX);



	modY = y.substring(0,1);	//y값 설정
	posY = y.substring(1,y.length);	//y값 위치

	if(modY=='+')	 var	img_y = tempY + parseInt(posY);
	else	 var	img_y = tempY - parseInt(posY);





	var	Mtable = document.getElementById("Manual"+num);


	/*토글설정*/
	if(Mtable){
		if(Mtable.style.display == ''){
			Mtable.style.display = 'none';
		}else{
			Mtable.style.display = '';
			Mtable.style.left = img_x+'px';
			Mtable.style.top = img_y+'px';
		}
	}

}

function calcHeight(FrameName,Target){
		if(!Target)	scrollTo(0,0)
		var the_height= document.getElementById(FrameName).contentWindow.document.body.scrollHeight; 
		document.getElementById(FrameName).height=the_height;
}

function iFrameHeight(FrameName){
	arg = document.getElementById(FrameName);

	arg.height = 0;
	arg.height = eval(arg.name+".document.body.scrollHeight");
}

function onlyNumberNew(event){
	var key = window.event ? event.keyCode : event.which;
	
	if ((event.shiftKey == false) && ((key  > 47 && key  < 58) || (key  > 95 && key  < 106) || key  == 35 || key  == 36 || key  == 37 || key  == 39 || key  == 8  || key  == 46  || key  == 144  || key  == 9   || key  == 190   || key  == 110 )){
		return true;
	} else {
		alert('숫자만 입력이 가능합니다');
		return false;
	}
}

function onlyNumberHard(event){
	var key = window.event ? event.keyCode : event.which;
	
	if ((event.shiftKey == false) && ((key  > 47 && key  < 58) || (key  > 95 && key  < 106) || key  == 35 || key  == 36 || key  == 37 || key  == 39 || key  == 8  || key  == 46  || key  == 144  || key  == 9)){
		return true;
	} else {
		alert('숫자만 입력이 가능합니다');
		return false;
	}
}

function GblMsgBoxHtml(msg,url){
	document.getElementById("alertTxt").innerHTML = msg;

	if(url){		
		document.getElementById("alertCloseBtn").innerHTML = "";
		document.getElementById("alertBtn").innerHTML = "<input type='button' class='btn_notice_reg' value='확인' onclick=\""+url+"\">";
	}

	$(".GblNotice_open").click();
	return;
}

function GblMsgBox(msg,url){
	document.getElementById("alertTxt").innerText = msg;

	if(url){		
		document.getElementById("alertCloseBtn").innerHTML = "";
		document.getElementById("alertBtn").innerHTML = "<input type='button' class='btn_notice_reg' value='확인' onclick=\""+url+"\">";
	}

	$(".GblNotice_open").click();
	return;
}

function GblMsgConfirmBox(msg,url){
	document.getElementById("confirmTxt").innerText = msg;

	if(url){
		document.getElementById("confirmBtn").innerHTML = "<input type='button' class='btn_notice_reg_add' value='확인' onclick=\""+url+"\">";
	}

	$(".conFirm_open").click();
	return;
}

function GblMsgConfirmBox2(msg,url){
	document.getElementById("confirmTxt").innerText = msg;

	if(url){
		document.getElementById("confirmBtn").innerHTML = "<input type='button' class='btn_notice_reg_add' value='네' onclick=\""+url+"\">";
	}

	$(".conFirm_open").click();
	return;
}

function pageNum(fname,rs){
	form = document[fname];
	form.type.value = '';
	form.record_start.value = rs;
	form.target = '';
	form.action = form.next_url.value;
	form.submit();
}

function pageNumType(fname,rs,ftype){
	form = document[fname];
	form.type.value = ftype;
	form.record_start.value = rs;
	form.target = '';
	form.action = form.next_url.value;
	form.submit();
}


// 철자틀린문자 체크 ################################################################################################################################
MSG_CHAR_CHECK = "가각간갇갈갉갊감갑값갓갔강갖갗같갚갛개객갠갤갬갭갯갰갱갸갹갼걀걋걍걔걘걜거걱건걷걸걺검겁것겄겅겆겉겊겋게겐겔겜겝겟겠겡겨격겪견겯결겸겹겻겼경곁계곈곌곕곗고곡곤곧골곪곬곯곰곱곳공곶과곽관괄괆괌괍괏광괘괜괠괩괬괭괴괵괸괼굄굅굇굉교굔굘굡굣구국군굳굴굵굶굻굼굽굿궁궂궈궉권궐궜궝궤궷귀귁귄귈귐귑귓규균귤그극근귿글긁금급긋긍긔기긱긴긷길긺김깁깃깅깆깊까깍깎깐깔깖깜깝깟깠깡깥깨깩깬깰깸깹깻깼깽꺄꺅꺌꺼꺽꺾껀껄껌껍껏껐껑께껙껜껨껫껭껴껸껼꼇꼈꼍꼐꼬꼭꼰꼲꼴꼼꼽꼿꽁꽂꽃꽈꽉꽐꽜꽝꽤꽥꽹꾀꾄꾈꾐꾑꾕꾜꾸꾹꾼꿀꿇꿈꿉꿋꿍꿎꿔꿜꿨꿩꿰꿱꿴꿸뀀뀁뀄뀌뀐뀔뀜뀝뀨끄끅끈끊끌끎끓끔끕끗끙끝끼끽낀낄낌낍낏낑나낙낚난낟날낡낢남납낫났낭낮낯낱낳내낵낸낼냄냅냇냈냉냐냑냔냘냠냥너넉넋넌널넒넓넘넙넛넜넝넣네넥넨넬넴넵넷넸넹녀녁년녈념녑녔녕녘녜녠노녹논놀놂놈놉놋농높놓놔놘놜놨뇌뇐뇔뇜뇝뇟뇨뇩뇬뇰뇹뇻뇽누눅눈눋눌눔눕눗눙눠눴눼뉘뉜뉠뉨뉩뉴뉵뉼늄늅늉느늑는늘늙늚늠늡늣능늦늪늬늰늴니닉닌닐닒님닙닛닝닢다닥닦단닫달닭닮닯닳담답닷닸당닺닻닿대댁댄댈댐댑댓댔댕댜더덕덖던덛덜덞덟덤덥덧덩덫덮데덱덴델뎀뎁뎃뎄뎅뎌뎐뎔뎠뎡뎨뎬도독돈돋돌돎돐돔돕돗동돛돝돠돤돨돼됐되된될됨됩됫됴두둑둔둘둠둡둣둥둬뒀뒈뒝뒤뒨뒬뒵뒷뒹듀듄듈듐듕드득든듣들듦듬듭듯등듸디딕딘딛딜딤딥딧딨딩딪따딱딴딸땀땁땃땄땅땋때땍땐땔땜땝땟땠땡떠떡떤떨떪떫떰떱떳떴떵떻떼떽뗀뗄뗌뗍뗏뗐뗑뗘뗬또똑똔똘똥똬똴뙈뙤뙨뚜뚝뚠뚤뚫뚬뚱뛔뛰뛴뛸뜀뜁뜅뜨뜩뜬뜯뜰뜸뜹뜻띄띈띌띔띕띠띤띨띰띱띳띵라락란랄람랍랏랐랑랒랖랗래랙랜랠램랩랫랬랭랴략랸럇량러럭런럴럼럽럿렀렁렇레렉렌렐렘렙렛렝려력련렬렴렵렷렸령례롄롑롓로록론롤롬롭롯롱롸롼뢍뢨뢰뢴뢸룀룁룃룅료룐룔룝룟룡루룩룬룰룸룹룻룽뤄뤘뤠뤼뤽륀륄륌륏륑류륙륜률륨륩륫륭르륵른를름릅릇릉릊릍릎리릭린릴림립릿링마막만많맏말맑맒맘맙맛망맞맡맣매맥맨맬맴맵맷맸맹맺먀먁먈먕머먹먼멀멂멈멉멋멍멎멓메멕멘멜멤멥멧멨멩며멱면멸몃몄명몇몌모목몫몬몰몲몸몹못몽뫄뫈뫘뫙뫼묀묄묍묏묑묘묜묠묩묫무묵묶문묻물묽묾뭄뭅뭇뭉뭍뭏뭐뭔뭘뭡뭣뭬뮈뮌뮐뮤뮨뮬뮴뮷므믄믈믐믓미믹민믿밀밂밈밉밋밌밍및밑바박밖밗반받발밝밞밟밤밥밧방밭배백밴밸뱀뱁뱃뱄뱅뱉뱌뱍뱐뱝버벅번벋벌벎범법벗벙벚베벡벤벧벨벰벱벳벴벵벼벽변별볍볏볐병볕볘볜보복볶본볼봄봅봇봉봐봔봤봬뵀뵈뵉뵌뵐뵘뵙뵤뵨부북분붇불붉붊붐붑붓붕붙붚붜붤붰붸뷔뷕뷘뷜뷩뷰뷴뷸븀븃븅브븍븐블븜븝븟비빅빈빌빎빔빕빗빙빚빛빠빡빤빨빪빰빱빳빴빵빻빼빽뺀뺄뺌뺍뺏뺐뺑뺘뺙뺨뻐뻑뻔뻗뻘뻠뻣뻤뻥뻬뼁뼈뼉뼘뼙뼛뼜뼝뽀뽁뽄뽈뽐뽑뽕뾔뾰뿅뿌뿍뿐뿔뿜뿟뿡쀼쁑쁘쁜쁠쁨쁩삐삑삔삘삠삡삣삥사삭삯산삳살삵삶삼삽삿샀상샅새색샌샐샘샙샛샜생샤샥샨샬샴샵샷샹섀섄섈섐섕서석섞섟선섣설섦섧섬섭섯섰성섶세섹센셀셈셉셋셌셍셔셕션셜셤셥셧셨셩셰셴셸솅소속솎손솔솖솜솝솟송솥솨솩솬솰솽쇄쇈쇌쇔쇗쇘쇠쇤쇨쇰쇱쇳쇼쇽숀숄숌숍숏숑수숙순숟술숨숩숫숭숯숱숲숴쉈쉐쉑쉔쉘쉠쉥쉬쉭쉰쉴쉼쉽쉿슁슈슉슐슘슛슝스슥슨슬슭슴습슷승시식신싣실싫심십싯싱싶싸싹싻싼쌀쌈쌉쌌쌍쌓쌔쌕쌘쌜쌤쌥쌨쌩썅써썩썬썰썲썸썹썼썽쎄쎈쎌쏀쏘쏙쏜쏟쏠쏢쏨쏩쏭쏴쏵쏸쐈쐐쐤쐬쐰쐴쐼쐽쑈쑤쑥쑨쑬쑴쑵쑹쒀쒔쒜쒸쒼쓩쓰쓱쓴쓸쓺쓿씀씁씌씐씔씜씨씩씬씰씸씹씻씽아악안앉않알앍앎앓암압앗았앙앝앞애액앤앨앰앱앳앴앵야약얀얄얇얌얍얏양얕얗얘얜얠얩어억언얹얻얼얽얾엄업없엇었엉엊엌엎에엑엔엘엠엡엣엥여역엮연열엶엷염엽엾엿였영옅옆옇예옌옐옘옙옛옜오옥온올옭옮옰옳옴옵옷옹옻와왁완왈왐왑왓왔왕왜왝왠왬왯왱외왹왼욀욈욉욋욍요욕욘욜욤욥욧용우욱운울욹욺움웁웃웅워웍원월웜웝웠웡웨웩웬웰웸웹웽위윅윈윌윔윕윗윙유육윤율윰윱윳융윷으윽은을읊음읍읏응읒읓읔읕읖읗의읜읠읨읫이익인일읽읾잃임입잇있잉잊잎자작잔잖잗잘잚잠잡잣잤장잦재잭잰잴잼잽잿쟀쟁쟈쟉쟌쟎쟐쟘쟝쟤쟨쟬저적전절젊점접젓정젖제젝젠젤젬젭젯젱져젼졀졈졉졌졍졔조족존졸졺좀좁좃종좆좇좋좌좍좔좝좟좡좨좼좽죄죈죌죔죕죗죙죠죡죤죵주죽준줄줅줆줌줍줏중줘줬줴쥐쥑쥔쥘쥠쥡쥣쥬쥰쥴쥼즈즉즌즐즘즙즛증지직진짇질짊짐집짓징짖짙짚짜짝짠짢짤짧짬짭짯짰짱째짹짼쨀쨈쨉쨋쨌쨍쨔쨘쨩쩌쩍쩐쩔쩜쩝쩟쩠쩡쩨쩽쪄쪘쪼쪽쫀쫄쫌쫍쫏쫑쫓쫘쫙쫠쫬쫴쬈쬐쬔쬘쬠쬡쭁쭈쭉쭌쭐쭘쭙쭝쭤쭸쭹쮜쮸쯔쯤쯧쯩찌찍찐찔찜찝찡찢찧차착찬찮찰참찹찻찼창찾채책챈챌챔챕챗챘챙챠챤챦챨챰챵처척천철첨첩첫첬청체첵첸첼쳄쳅쳇쳉쳐쳔쳤쳬쳰촁초촉촌촐촘촙촛총촤촨촬촹최쵠쵤쵬쵭쵯쵱쵸춈추축춘출춤춥춧충춰췄췌췐취췬췰췸췹췻췽츄츈츌츔츙츠측츤츨츰츱츳층치칙친칟칠칡침칩칫칭카칵칸칼캄캅캇캉캐캑캔캘캠캡캣캤캥캬캭컁커컥컨컫컬컴컵컷컸컹케켁켄켈켐켑켓켕켜켠켤켬켭켯켰켱켸코콕콘콜콤콥콧콩콰콱콴콸쾀쾅쾌쾡쾨쾰쿄쿠쿡쿤쿨쿰쿱쿳쿵쿼퀀퀄퀑퀘퀭퀴퀵퀸퀼큄큅큇큉큐큔큘큠크큭큰클큼큽킁키킥킨킬킴킵킷킹타탁탄탈탉탐탑탓탔탕태택탠탤탬탭탯탰탱탸턍터턱턴털턺텀텁텃텄텅테텍텐텔템텝텟텡텨텬텼톄톈토톡톤톨톰톱톳통톺톼퇀퇘퇴퇸툇툉툐투툭툰툴툼툽툿퉁퉈퉜퉤튀튁튄튈튐튑튕튜튠튤튬튱트특튼튿틀틂틈틉틋틔틘틜틤틥티틱틴틸팀팁팃팅파팍팎판팔팖팜팝팟팠팡팥패팩팬팰팸팹팻팼팽퍄퍅퍼퍽펀펄펌펍펏펐펑페펙펜펠펨펩펫펭펴편펼폄폅폈평폐폘폡폣포폭폰폴폼폽폿퐁퐈퐝푀푄표푠푤푭푯푸푹푼푿풀풂품풉풋풍풔풩퓌퓐퓔퓜퓟퓨퓬퓰퓸퓻퓽프픈플픔픕픗피픽핀필핌핍핏핑하학한할핥함합핫항해핵핸핼햄햅햇했행햐향허헉헌헐헒험헙헛헝헤헥헨헬헴헵헷헹혀혁현혈혐협혓혔형혜혠혤혭호혹혼홀홅홈홉홋홍홑화확환활홧황홰홱홴횃횅회획횐횔횝횟횡효횬횰횹횻후훅훈훌훑훔훗훙훠훤훨훰훵훼훽휀휄휑휘휙휜휠휨휩휫휭휴휵휸휼흄흇흉흐흑흔흖흗흘흙흠흡흣흥흩희흰흴흼흽힁히힉힌힐힘힙힛힝";
MSG_CHAR_CHECK += "　！'，．／：；？＾＿｀｜￣、。·‥…¨〃­―∥＼～´?ˇ˘˝˚˙¸˛¡¿ː＂（）［］｛｝‘’“”〔〕〈〉《》「」『』【】+－＜=＞±×÷≠≤≥∞∴♂♀∠⊥⌒∂∇≡≒≪≫√∽∝∵∫∬∈∋⊆⊇⊂⊃∪∩∧∨￢⇒⇔∀∃∮∑∏＄％￦Ｆ′″℃Å￠￡￥¤℉‰㎕㎖㎗ℓ㎘㏄㎣㎤㎥㎦㎙㎚㎛㎜㎝㎞㎟㎠㎡㎢㏊㎍㎎㎏㏏㎈㎉㏈㎧㎨㎰㎱㎳㎴㎵㎶㎷㎸㎹㎀㎁㎂㎃㎄㎺㎻㎼㎽㎾㎿㎐㎑㎒㎓㎔Ω㏀㏁㎊㎋㎌㏖㏅㎭㎭㎮㎯㏛㎩㎪㎫㎬㏝㏐㏓㏃㏉㏜㏆＃＆＊＠■※☆★○●◎◇◆□■△▲▽▼→←↑↓↔〓◁◀▷▶♤♠♡♥♧♣⊙◈▣◐◑▒▤▥▨▧▦▩♨☏☎☜☞■†‡↕↗↙↖↘♭♩♪♬㉿㈜№㏇™㏂㏘℡■■─│┌┐┘└├┬┤┴┼━┃┏┓┛┗┣┳┫┻╋┠┯┨┷┿┝┰┥┸╂┒┑┚┙┖┕┎┍┞┟┡┢┦┧┩┪┭┮┱┲┵┶┹┺┽┾╀╁╃╄╅╆╇╈╉╊㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯⒰⒱⒲⒳⑻⒵⑴⑵⑶⑷⑸⑹⑺⒴⑼⑽⑾⑿⒀⒁⒂ⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩ½⅔⅔¼¾⅛⅜⅝⅞¹²³⁴ⁿ₁₂₃₄ㄱㄲㄳㄴㄵㄶㄷㄸㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅃㅄㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣㅥㅦㅧㅨㅩㅪㅫㅬㅭㅮㅯㅰㅱㅲㅳㅴㅵㅶㅷㅸㅹㅺㅻㅼㅽㅾㅿㆀㆁㆂㆃㆄㆅㆆㆇㆈㆉㆊㆋㆌㆍㆎＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚㅍΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω¶~";
MSG_CHAR_CHECK += "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
MSG_CHAR_CHECK += "ㅏㅑㅓㅕㅗㅛㅜㅠㅡㅣ";
MSG_CHAR_CHECK += "ァィゥェォアイウエオカキクケコガギグゲゴサシスセソザジズゼゾタチッツテトダヂヅデドナニヌネノハヒフヘホバビブベボパピプペポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ";
MSG_CHAR_CHECK += "ぁぃぅぇぉあいうえおかきくけこがぎぐげごさしすせそざじずぜぞたちっつてとだぢづでどなにぬねのはひふへほばびぶべぼぱぴぷぺぽまみむめもゃやゅゆょよらりるれろゎわゐゑをん";
MSG_CHAR_CHECK += "зº";

function notEucKR_Check(str)
{
	var chr;
    var notstr = new Array();
    var j = 0;

	for (var i=0; i<str.length; i++)
    {
		if (str.charCodeAt(i) > 127)
        {
			chr = str.charAt(i);
			if (MSG_CHAR_CHECK.indexOf(chr) < 0)
            {
				notstr[j] = chr;
                j++;
			}
		}
	}

	var rslt = (j > 0) ? notstr.join(", ") : null;

    return rslt;
}
//##################################################################################################################################################

$(function(){
	$("#left_area").css("height",$("#wrap").height());
})




function fn_Number(obj,e){
	if(e.which=='229' || e.which=='197' && $.browser.opera) {
		setInterval(function(){
			obj.trigger('keyup');
		}, 100);
	}

/*
	48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // 0 ~ 9 Key
	96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // 키패드 0 ~ 9 Key
	189, 109, // -, 키패드 - Key
	8, 46, // Back Space, Delete Key
	37, 39, // ←, → 방향 Key
	9, // Tab Key
	35, 36, // End, Home Key
	110, 190,		//dot 
	144	//NumLock
*/
	
	if (!(e.which && (e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || e.which == 8 || e.which == 46 || e.which == 37 || e.which == 39 || e.which == 9 || e.which == 35 || e.which == 36 || e.which == 110 || e.which == 190 || e.which == 144)) {
		e.preventDefault();
	}
	
	var value = obj.val().match(/[^0-9^.]/g);
	if(value!=null) {
		obj.val(obj.val().replace(/[^0-9^.]/g,''));
	}
}





function urldecode(str){
	return decodeURIComponent((str + '').replace(/%(?![\da-f]{2})/gi, function(){
		return '%25';
	}).replace(/\+/g, '%20'));
}



function isCellPhone(p){
	p = p.split('-').join('');
	var regPhone = /^((01[1|6|7|8|9])[1-9]+[0-9]{6,7})|(010[1-9][0-9]{7})$/;
	return regPhone.test(p);
}


function isEmailChk(email){
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}
//쪽지보내기
function noteForm(receiver){
	UserOS = $('#UserOS').text();

	w = '500';
	document.getElementById("multiFrame").innerHTML = "<iframe src='/module/noteForm.php?receiver="+receiver+"' width='"+w+"' height='600' frameborder='0' scrolling='auto'></iframe>";
	$(".multiBox_open").click();
}

//공지쪽지보내기
function noteNotice(receiver){
	UserOS = $('#UserOS').text();

	w = '500';

	document.getElementById("multiFrame").innerHTML = "<iframe src='/module/noteForm.php?notice=1&receiver="+receiver+"' width='"+w+"' height='600' frameborder='0' scrolling='auto'></iframe>";
	$(".multiBox_open").click();
}

//작성글보러가기
function userSearch(userid){
	UserOS = $('#UserOS').text();

	if(UserOS == 'PC')	document.location.href = '/search/up_index.php?f_userid='+userid;
	
	
}

//회원명 클릭시 활성화메뉴
function userBoxMenuOpen(thisID,userid){
	var pos = $('#'+thisID).offset();
	var w = $('#'+thisID).width();

	GBL_USERID = $('#GBL_USERID').text();

	if(GBL_USERID)	$('#boxMenu01').html("<a href=\"javascript:noteForm('"+userid+"');\"><img src='/images/note.png' class='icon'>쪽지보내기</a>");
	else					$('#boxMenu01').html("<a href=\"javascript:GblMsgBox('로그인 후 이용이 가능합니다.','');\"><img src='/images/note.png' class='icon'>쪽지보내기</a>");

	$('#boxMenu02').html("<a href=\"javascript:userSearch('"+userid+"');\"><img src='/images/txt.png' class='icon'>작성글보러가기</a>");

	$('.userBox').css('top',pos.top);
	$('.userBox').css('left',(pos.left)+w+10);
	$('.userBox').fadeIn("fast");
}

//회원명 클릭시 활성화메뉴(팝업용)
function userBoxMenuOpen2(thisID,userid){
	var pos = $('#'+thisID).offset();
	var w = $('#'+thisID).width();

	$('#boxMenu01').html("<a href=\"javascript:opener.noteForm('"+userid+"');self.close();\"><img src='/images/note.png' class='icon'>쪽지보내기</a>");
	$('#boxMenu02').html("<a href=\"javascript:opener.userSearch('"+userid+"');\"><img src='/images/txt.png' class='icon'>작성글보러가기</a>");

	$('.userBox').css('top',pos.top);
	$('.userBox').css('left',(pos.left)+w+10);
	$('.userBox').fadeIn("fast");
}

function userBoxMenuClose(){
	$('.userBox').hide();
}


function UploadFileChk(fname,fsize,no){
	upFile = $("#upfile"+no).val();

	if( upFile != "" ){
		var ext = $('#upfile'+no).val().split('.').pop().toLowerCase();

		if($.inArray(ext, ['gif','jpg','jpeg','bmp','png','swf','doc','docx','txt','pdf','xls','xlsx','hwp','ico','wmv','wma','mp3','dwg','dxf','ai','ppt','pptx','zip']) == -1) {
			GblMsgBox('등록할 수 없는 파일입니다.','');
			$("#upfile"+no).val('');
			$("#file_route"+no).val('');
			return;
		}


		var fileSize = 0;

		// 브라우저 확인
		var browser=navigator.appName;

		file = document[fname]['upfile'+no];
		
		// 익스플로러일 경우
		if(browser=="Microsoft Internet Explorer"){
			var oas = new ActiveXObject("Scripting.FileSystemObject");
			fileSize = oas.getFile(file.value).size;

		// 익스플로러가 아닐경우			
		}else{
			fileSize = file.files[0].size;
		}

		fS = Math.round(fileSize / 1024);
		fC = fsize * 1024

		if(fS > fC){
			GblMsgBox('첨부파일은 '+fsize+'MB이상 등록할 수 없습니다.','');
			$("#upfile"+no).val('');
			$("#file_route"+no).val('');
			return;
		}
	}

	$("#file_route"+no).val(upFile);
}


function ImageFileChk(fname,fsize,no){
	upFile = $("#upfile"+no).val();

	if( upFile != "" ){
		var ext = $('#upfile'+no).val().split('.').pop().toLowerCase();

		if($.inArray(ext, ['gif','jpg','jpeg','png']) == -1) {
			GblMsgBox('gif, jpg, jpeg, png 파일만 등록할 수 있습니다..','');
			$("#upfile"+no).val('');
			$("#file_route"+no).val('');
			return;
		}


		var fileSize = 0;

		// 브라우저 확인
		var browser=navigator.appName;

		file = document[fname]['upfile'+no];
		
		// 익스플로러일 경우
		if(browser=="Microsoft Internet Explorer"){
			var oas = new ActiveXObject("Scripting.FileSystemObject");
			fileSize = oas.getFile(file.value).size;

		// 익스플로러가 아닐경우			
		}else{
			fileSize = file.files[0].size;
		}

		fS = Math.round(fileSize / 1024);
		fC = fsize * 1024

		if(fS > fC){
			GblMsgBox('첨부파일은 '+fsize+'MB이상 등록할 수 없습니다.','');
			$("#upfile"+no).val('');
			$("#file_route"+no).val('');
			return;
		}
	}

	$("#file_route"+no).val(upFile);
}