/*******************************************************/
/* User-control
   controlon : bind the control of tiles
   controloff : unbind the control of tiles
/*******************************************************/

//function controlon(){
	
	$("body").on("keydown",function(e){
		//$("*").finish()
		keyd(e)
		function keyd(e){
			var event = e || window.event
			switch(event.keyCode){ //switch case: a === b (variable type should be matched)
				case 38:
				// up arrow
				move(newgame,"up")
				break;
				case 40:
				// down arrow
				move(newgame,"down")
				break;
				case 37:
				// left arrow
				move(newgame,"left")
				break;
				case 39:
				// right arrow
				move(newgame,"right")
				break;
			}
		}
	})
//}
	
	
	

///using onscreen controller
$("#up").on("click",function(){move(newgame,"up")})
$("#down").on("click",function(){move(newgame,"down")})
$("#left").on("click",function(){move(newgame,"left")})
$("#right").on("click",function(){move(newgame,"right")})


var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false
if (mobile){
	var mc = new Hammer(document.querySelector(".game-area"));
	mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
	mc.on("swipeleft",function(ev){move(newgame,"left")})
	mc.on("swiperight",function(ev){move(newgame,"right")})
	mc.on("swipeup",function(ev){move(newgame,"up")})
	mc.on("swipedown",function(ev){move(newgame,"down")})

}

//mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
//
// listen to events...
//mc.on("panleft panright panup pandown tap press", function(ev) {
//   myElement.textContent = ev.type +" gesture detected.";
//});

//event controller
$("#control_openMenu").click(function(){$(".control-menu").toggleClass("open close")})
$("#control_newGame, #alert_newGame").click(function(){init()})
$("#control_screen").click(function(){$(".arrow").css("display", $(".arrow").css("display") === "none" ? "block" : "none")})
$("#alert_continue").click(function(){
	$(".alert-success").animate({
		opacity:0,
		complete:function(){$(this).css({display:"none"})}
	},900)
})

$("#control_clear").click(function(){window.localStorage.highest = 0;$("#score_highest").html(window.localStorage.highest)})

window.onload = function(){

	init()
}

