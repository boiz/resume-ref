var dropdown=document.querySelector(".dropdown");
var list=document.querySelector("table.list");

var loading=document.querySelector(".tips .loading");
var notmatch=document.querySelector(".tips .notmatch");

var q=document.getElementById("q");
var s=document.getElementById("s");

var select="selected";
var index; /*dropdown.children index*/

var json={};

var samp=dropdown.querySelector("li");


var toBlock=/^[\s\*\+\-\.]?$/;

/*get web storage data if exists*/

function conLoadSS(url,xJSON){
	var has=sessionStorage.getItem(xJSON);
	if(has)	{
		json[xJSON]=JSON.parse(has);
		q.classList.remove("nr");
		}
	
	else{
		var xml=new XMLHttpRequest;
		xml.open("get",url);
		xml.send();
		xml.onreadystatechange=function(){
			if(this.readyState==4&&this.status==200){

				sessionStorage.setItem(xJSON,this.response);
				json[xJSON]=JSON.parse(this.response);

				/* visual effect */
				q.classList.remove("nr");
				
				}
			}
		}
	}

/* click control */
var clickCtrl={
	disabled:false,
	lock:function(){this.disabled=true},
	release:function(){this.disabled=false},
	prevKW:"",
	remember:function(p){this.prevKW=p}
	};

conLoadSS("/develop/xhr/chs.php","chsJSON");
conLoadSS("/develop/xhr/eng.php","engJSON");

try{
	/*only when on the page*/
	var parTb=list;
	var sampTb=parTb.querySelector("tbody");
}
catch(e){}

var qs=getParameterByName("v");
if(qs){
	q.value=qs;
	search();
}

s.onclick=search;



/* remove all child in the list */
function removeAllChild(parent,childSelector){
	if(childSelector){
		parent.querySelectorAll(childSelector).forEach(function(v){
			parent.removeChild(v);
		});
	}
	else while(parent.firstChild) parent.removeChild(parent.firstChild);
	}

function search(){
	/*is it on searchlist page*/
	if(!list){
		location.href="/develop/pages/searchlist.php?v="+q.value;
		return;
	}

	/* excute or not */
	var input=q.value.trim();

	var t=toBlock.test(input);
	if(t||clickCtrl.disabled||clickCtrl.prevKW==input) return;

	clickCtrl.lock();
	clickCtrl.remember(input);
	
	var url="/develop/xhr/find.php";
	var xml=new XMLHttpRequest;
	xml.open("post",url);
	xml.setRequestHeader("content-type","application/x-www-form-urlencoded");
	xml.send("kw="+q.value);
	

	/*initial*/
	removeAllChild(dropdown);
	removeAllChild(list,"tbody");

	hide(list);
	show(loading);
	hide(notmatch);

	function replaceHTML(parent,selector,value,text){
		var got=new RegExp(q.value,"i").exec(value);
		var element=parent.querySelector(selector);
		if(text&&text!=value){
			element.innerText=value;
			return;
		}
		element.innerHTML=value.replace(got,"<mark>"+got+"</mark>");
	}
	
	xml.onreadystatechange=function(){
		//console.log(this.readyState,this.status);
		var con=this.readyState==4&&this.status==200;
		if(!con) return;
		var r=JSON.parse(this.response);

		var rememberId;
		var chTb;

		r.forEach(function(v){
			//console.log(v.id);
			var con=rememberId==v.id;

			if(!con) chTb=sampTb.cloneNode(true);
			else chTb.classList.add("haschildren");

			var par=chTb;
			var ch=par.querySelector("tr").cloneNode(true);

			if(!con) removeAllChild(par);

			replaceHTML(ch,".id",v.id,input);
			replaceHTML(ch,".chn a",v.chn);
			replaceHTML(ch,".good",v.good);
			ch.querySelector(".chn a").href="/develop/pages/detail.php?id="+v.id;

			ch.querySelector(".arrow").onclick=function(){
				par.classList.toggle("expand");
			}

			par.appendChild(ch);

			if(!con) parTb.appendChild(chTb);

			rememberId=v.id;

			});

		/* unhide */
		r.length?show(list):show(notmatch);
		hide(loading);

		list.querySelectorAll("td").forEach(function(v){
			v.onmouseover=function(){
				if(v.scrollWidth>v.offsetWidth) v.title=v.innerText;
			}
		});

		clickCtrl.release();
		}
	}

/* auto complete when typing*/

q.oninput=function(){ 
	removeAllChild(dropdown);
	
	var input=this.value.trim();
	var t=toBlock.test(input);
	var r;

	/[\u4E00-\u9FA5]/.test(input)?r=json.chsJSON:r=json.engJSON;
	
	if(!r||t) return;

	var count=0;
	
	r.forEach(function(v,i){

		var got=new RegExp(input,"i").exec(v.name);
		if(!got||count++>=7) return;
		var li=samp.cloneNode(true);

		var a=li.querySelector("a");
		a.innerHTML=got.input.replace(got[0],"<b>"+got[0]+"</b>");

		/*a.dataset.id=v.id;*/
		a.href="/develop/pages/detail.php?id="+v.id;
/*		li.onclick=function(){
			q.value=this.innerText;
			search();
		}*/
		dropdown.appendChild(li);
		});

	show(dropdown);
	}

/*key function*/
q.onkeydown=function(e){
	var li=dropdown.children;
	var up=e.keyCode==38;
	var down=e.keyCode==40;
	var enter=e.keyCode==13;
	var con=up||down||enter;
	if(!con) return;
	var dom=dropdown.querySelector(".selected");
	dom?dom.classList.remove(select):null;
	if(down){
		if(!dom){
			li[index=0].classList.add(select);
			return;
		}
		li[index==li.length-1?index=0:++index].classList.add(select);
	}
	else if(up) li[index==0?index=li.length-1:--index].classList.add(select);
	else if(enter){
		if(dom) q.value=dom.innerText;
		search();
	}

	//this.value=li[index].innerText;
}
