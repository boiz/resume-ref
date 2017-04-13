var ul=$(".banner323");

var screenWidth=$(window).width();
var len=$(".banner323 li").length;

ul.width(len*screenWidth);
$(".slider, .banner323 li").width(screenWidth);

var index=0,intv,hd=$(".slider .hd");

function animate(p){
    ul.animate({"margin-left":-p*screenWidth},"fast");
    hd.find(".on").removeClass("on");
    hd.find("li").eq(index).addClass("on");
}

function set(){
    intv=setInterval(function(){
        animate(++index==len?index=0:index);
    },5000);
}

var img=new Image;
img.src="images/banner2.jpg";

img.onload=function(){
    set();
}

hd.find("li").mouseover(function(){
    var n=$(this).index();
    animate(index=n);
});

hd.hover(function(){
    clearInterval(intv);
},function(){
    clearInterval(intv);    
    set();
});
