
/*floor navigator */

function scrollFunction(){
	var indexFlr=$(".indexFloorNum:visible");
	var flrNav=$(".navigator");
	var liNav=flrNav.find("li");

	var height=33*indexFlr.length;
	var f1Left=indexFlr.eq(0).offset().left;
	//console.log(height);
	flrNav.css({
		"left":f1Left-75,
		"margin-top":-1*height/2
		});
	
	liNav.click(function(){
		var i=$(this).index();
		var x=indexFlr.eq(i).offset().top;
		$("html, body").animate({"scrollTop":x});
	});

	var index=0; /*control*/
	var reached;
	
	var f1Top=indexFlr.eq(0).offset().top;
	var bottomY=$(".bottom").offset().top-22;		
	var change=200;
	
	$(window).scroll(function(){
		var pageY=$(this).scrollTop();
		
		$.each(indexFlr,function(i,v){
			var top=$(this).offset().top;
			if(pageY>=top-change) index=i;
			
			if(pageY>=f1Top-change) reached=true;
			else reached=false;
		});
		
		var con=liNav.eq(index).hasClass("active");
		if(!con){
			flrNav.find(".active").removeClass("active");
			liNav.eq(index).addClass("active");				
		}
		if(reached) flrNav.is(":visible")?null:flrNav.removeClass("hide");
		else flrNav.is(":visible")?flrNav.addClass("hide"):null;
		
		/*bottom align*/
		
		var ulBottomY=flrNav.offset().top+height;				
		var reactiveMeter=pageY+$(window).height()/2+height/2;
		
		if(ulBottomY>bottomY) {
			flrNav.css({
				"position":"absolute",
				"top":bottomY-height,
				"margin-top":0
				});
			}
		else if(reactiveMeter<bottomY){
			flrNav.css({
				"position":"fixed",
				"top":"50%",
				"margin-top":-1*height/2
			}); 
		}		
	});	

}
