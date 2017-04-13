
/*floor */
$.ajax({
	url:root+MetgodAccount.queryIndexGoodsNewFloor,
	dataType:"json",
	type:"post",
	data:{clientId:clientId,appType:0},
	success:function(r){

		var parentFloor=$(".indexFloor");
		var parentNav=$(".navigator");
		var sampNav=parentNav.find("li").remove().eq(0);
		
		$.each(r.data,function(i,v){
			
			/*banner slider */
			if(v.layout==1){
				try{
					sliderFunction(v.list);
				}
				catch(e){}
				return;
			}
			
			var child=parentFloor.find("[layout="+v.layout+"]").eq(0).clone();
					
			/*split showName*/
			var fIndex=v.showName.indexOf("F");
			var floorNum=v.showName.substr(0,fIndex+1);
			var floorName=v.showName.substr(fIndex+1);
			
			child.find(".floorNum").text(floorNum);
			child.find(".floorName").text(floorName);
			
			/* sorted data collection*/
			var jsonList=[];
			var jsonText=[];
			
			$.each(v.list,function(i,v){
				if(v.type==1) jsonList.push(v);
				else if(v.type==2) jsonText.push(v);
			});
			
			/* list for picture */
			var listChild=child.find(".sample");
			$.each(jsonList,function(i,v){
				
				listChild.eq(i).find(".name").text(v.name);
				
				var price=Number(v.hoverPrice1).toFixed(2);
				listChild.eq(i).find(".price").text(price);
				
				var oldPrice=Number(v.hoverPrice).toFixed(2);
				listChild.eq(i).find(".oldPrice").text(oldPrice);

				listChild.eq(i).find(".goodsUrl").attr("href",v.goodsUrl);

			});
			

			/* list for text */
			var textParent=child.find(".floatCon ul");
			var textSamp=textParent.find("li").remove().eq(0);
			
			var newtextParent=child.find(".floorCon1 ul");
			var newtextSamp=newtextParent.find("li").remove().eq(0);
			
			textList=jsonText.slice(0,6); /*6*/
			$.each(textList,function(i,v){
				var child=textSamp.clone();
				var newchild=newtextSamp.clone();
				
				child.find("a").text(v.name).attr("href",v.goodsUrl);
				newchild.find("a").text(v.name).attr("href",v.goodsUrl);
				textParent.append(child);
				newtextParent.append(newchild);
			});
			
			child.removeClass("hide");
			parentFloor.append(child);
			
			/*small slider function */
			if(v.layout==5){
				sliderWork({
					width:440,
					wrapper:child.find(".slider1017"),
					prev:child.find(".l1017"),
					next:child.find(".r1017"),
					navdiv:child.find(".blt1017"),
					navItem:"span",
					navActiveClass:"on",
					navUnit:0,
					speed:"normal"
				});					
			}
			
			/*floorNav */
			if(clientId) return;
			
			var childNav=sampNav.clone();
			childNav.find("a").text(floorName);
			if(v.type==3) parentNav.append(childNav);
		});
		
		try{
			scrollFunction();
		}
		catch(e){}
		
		$(".indexFloor img").lazyload({
			threshold:200
		});
		
	}
	
});
