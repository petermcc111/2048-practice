


/*********************************************/
/* display & update the tiles
/*********************************************/

function Game(){
	this.grid = [
	[[0,0],[1,0],[2,0],[3,0]],
	[[4,0],[5,0],[6,0],[7,0]],
	[[8,0],[9,0],[10,0],[11,0]],
	[[12,0],[13,0],[14,0],[15,0]]
	]
	this.ratio = 2 //probability of getting 4
	this.score = 0
	this.success = false

	this.setSuccess = function(){
		this.success = true
	}
}

var ref = [
	{cell: 0, gx: 0,gy:0},
	{cell: 1, gx: 0,gy:1},
	{cell: 2, gx: 0,gy:2},
	{cell: 3, gx: 0,gy:3},
	{cell: 4, gx: 1,gy:0},
	{cell: 5, gx: 1,gy:1},
	{cell: 6, gx: 1,gy:2},
	{cell: 7, gx: 1,gy:3},
	{cell: 8, gx: 2,gy:0},
	{cell: 9, gx: 2,gy:1},
	{cell: 10, gx: 2,gy:2},
	{cell: 11, gx: 2,gy:3},
	{cell: 12, gx: 3,gy:0},
	{cell: 13, gx: 3,gy:1},
	{cell: 14, gx: 3,gy:2},
	{cell: 15, gx: 3,gy:3}
]

var sep = window.screen.width > 400 ? 97 : 72.5

