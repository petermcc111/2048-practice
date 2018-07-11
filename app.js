"use strict";



var timeCounter =0
var mobile = false
console.log("mobile is "+mobile)


/*****************************************************/
// movement case (actions when a move is required)
/*****************************************************/
function move(game,arrow){
	var changed = false
	var grid = game.grid
	var score = game.score
	var slot =[]

	// rearrange a linear array so that all non-zero elements move towards left, 
	// and nearby elements are merged when identical 
	var modify = function(temp,locate){
		//[a,b,c,d] <--
		var obj = {
			array:[temp[0],temp[1],temp[2],temp[3]],
			score:0,
			slot:[],
			changed:false
		}
		for (var i=0;i<3;i++){
			if (obj.array[i]===0){
				cycle: for(var j=i+1;j<4;j++){
					if(obj.array[j]>0){
						obj.array[i]=obj.array[j]
						obj.array[j]=0
						obj.slot.push([locate[j],locate[i],0])
						incycle: for (var k=i+2;k<4;k++){
							if (obj.array[k]===obj.array[i]){
								obj.array[i] = obj.array[i]*2
								obj.score = obj.array[i]
								obj.array[k]=0
								obj.slot.push([locate[k],locate[i],1])
								break incycle
							}else if (obj.array[k]>0) break incycle
						}
						obj.changed=true
						break cycle
					}
				}
			} else {
				cycle: for(var j=i+1;j<4;j++){
					if(obj.array[i]===obj.array[j]){
						obj.array[i]+=obj.array[j]
						obj.score = obj.array[i]
						obj.array[j]=0
						obj.slot.push([locate[j],locate[i],1])
						obj.changed=true
						break cycle
					} else if (obj.array[j]>0) break cycle
				}
			}
		}
		return obj
	}

	function assign(result,reverse,co){
		if (reverse) result.array.reverse()
		if (result.changed){
			for (var i=0;i<4;i++){
				if (co === "y") grid[i][y][1]  = result.array[i]
				else grid[x][i][1] = result.array[i]
				changed = true
			}
		}
		game.score += result.score
		result.slot.forEach(function(i){slot.push(i)})
	}

	switch (arrow){
		case "up":
		for (var y=0; y<4; y++){
			var temp = [grid[0][y][1],grid[1][y][1],grid[2][y][1],grid[3][y][1]] 
			var locate = [grid[0][y][0],grid[1][y][0],grid[2][y][0],grid[3][y][0]]
			assign(modify(temp,locate),false,"y")
		}break

		case "down":
		for (var y=0;y<4;y++){
			var temp = [grid[3][y][1],grid[2][y][1],grid[1][y][1],grid[0][y][1]]
			var locate = [grid[3][y][0],grid[2][y][0],grid[1][y][0],grid[0][y][0]]
			assign(modify(temp,locate),true,"y")
		}break

		case "left":
		for (var x=0;x<4;x++){
			var temp = [grid[x][0][1],grid[x][1][1],grid[x][2][1],grid[x][3][1]]
			var locate = [grid[x][0][0],grid[x][1][0],grid[x][2][0],grid[x][3][0]]
			assign(modify(temp,locate),false,"x")
		}break

		case "right":
		for (var x=0;x<4;x++){
			var temp = [grid[x][3][1],grid[x][2][1],grid[x][1][1],grid[x][0][1]]
			var locate = [grid[x][3][0],grid[x][2][0],grid[x][1][0],grid[x][0][0]]
			assign(modify(temp,locate),true,"x")
		}break

		default:
		console.log("Please check your input!")
		return false;
	}
	if (changed) {postMove(game,slot)} else {}
}

/*******************************************************/
/* post-movement action 
/*******************************************************/

function postMove(game,slot){
	var dfa = $.Deferred(function(dfa){getAnimate(game,slot,dfa);})
	dfa.done(function(){
		newBlock(game)
		updateScore(game)
		/*console.log(...game.grid[0])
		console.log(...game.grid[1])
		console.log(...game.grid[2])
		console.log(...game.grid[3])*/
		console.log("No. of operations: "+(++timeCounter))
		if(checkGameStatus(game)){ } //check if the game ends
	})
}

// check if the game ends
function checkGameStatus(game){
	var grid = game.grid
	var alertSuccess = $(".alert-success")
	var alertOver = $(".alert-over")
	console.log("checkgame")
	// check if there are no more possible movements
	var gameOver = function(){
		for (var i =0;i<4;i++){
			for (var j =0;j<4;j++){
				if (grid[i][j][1] === 0) return false
				else if (i < 3 && grid[i][j][1] === grid[i+1][j][1]) return false
				else if (j < 3 && grid[i][j][1] === grid[i][j+1][1]) return false
			}
		} return true
	}

	//case 1: Game over (no further action can be performed)
	if (gameOver()){
		alertOver.css({display:"block"})
		alertOver.animate({opacity:1},900)
		return false
	}
	//case 2: Game success (at least one "2048" tile is created)		
	else if (!game.success){
		for (var i=0;i<4;i++){
			for (var j=0;j<4;j++){
				if (grid[i][j][1] === 8){
					alertSuccess.css({display:"block"})
					alertSuccess.animate({opacity:1},900)
					game.setSuccess()
					return false
				}
			}
		}
	} return true
}

/*******************************************************/
/* animating the movement and merging of tiles
/*******************************************************/

function getAnimate(game,slot,dff){
	var count = 0
	var target = "#game_front"

	/*  tile-style-Adjustment  */
	function getStyle(tile){
		if(tile >= 1024) return "tile-1024"
		else if (tile >= 128) return "tile-128"
		else if (tile >= 64) return "tile-64"
		else if (tile >= 32) return "tile-32"
		else if (tile >= 16) return "tile-16"
		else if (tile >= 8) return "tile-8"
		else if (tile >= 4) return "tile-4"
		else if (tile >= 2) return "tile-2"
		else return "tile-0"
	}

	function mergeBlock(block){
		var tile = $(target+" .p"+block+" div").html() *2
		var addClass = getStyle(tile)
		$(target+" .p"+block).remove()
		$(target).append("<div class='p"+block+"'><div class='"+addClass+"'>"+tile+"</div></div>")
	}

	/*  animation 1 : moving tiles  */
	var dfd = $.Deferred(function(dfd){
		for(var i=0;i<slot.length;i++){
			if (slot[i] != ""){
				var ini = slot[i][0]
				var fin = slot[i][1]
				var dx = ref[fin]["gy"] - ref[ini]["gy"]
				var dy = ref[fin]["gx"] - ref[ini]["gx"]
				$(target+" .p"+slot[i][0]).switchClass(
					"p"+slot[i][0],
					"p"+slot[i][1],
					function(){count++;if(count===slot.length)dfd.resolve()}
				)
			}
		}
	})
	/*  animation 2 : popping out merged tiles  */
	dfd.done(function(){
		for(var i=0;i<slot.length;i++){
			if (slot[i][2] === 1)mergeBlock(slot[i][1])
		}
		dff.resolve()
	})
}

//adding a new tile to empty tile slot
function newBlock(game){
	var grid = game.grid
	var target = $("#game_front")
	var isSet = false
	while (!isSet){
		var i = parseInt(Math.random()*4)
		var j = parseInt(Math.random()*4)
		if (grid[i][j][1]===0){
			var tile = parseInt(Math.random()*100) < 20 ? 4 : 2
			grid[i][j][1] = tile
			isSet = true
			for(var k=0; k<ref.length; k++) {
				if (ref[k].gx===i && ref[k].gy===j){
					var addClass = tile === 2 ? "tile-2" : "tile-4"
					target.append("<div class='p"+ref[k].cell+"'><div class='"+addClass+"'>"+tile+"</div></div>")
				}
			}
		}	
	}
}

/*******************************************************/
/* update score
/*******************************************************/

function updateScore(game){
	console.log("score: "+game.score)
	$("#score_current").html(game.score)
	if (game.score>localStorage.getItem("highest")){
		localStorage.highest = game.score
		$("#score_highest").html(localStorage.getItem("highest"))
	}
}

var newgame

function init(){
	/* 1. Create Game object
	 * 2. Create 1st & 2nd tile
	 * 3. Update the grid to table
	 * 4. Disable "gameover" and "success" alert
	 * 5. Get the highest score on the current device
	 */
	newgame = new Game()
	$("#game_front div").remove()
	newBlock(newgame)
	newBlock(newgame)
	$(".alert").css({opacity:0,display:"none"});
	if (typeof(Storage) !== "undefined"){
		try{
			if (!window.localStorage.highest) {window.localStorage.highest = 0}
			$("#score_highest").html(window.localStorage.highest)
		} catch(e){window.localStorage.highest = 0}
		
	}
	timeCounter=0
}


