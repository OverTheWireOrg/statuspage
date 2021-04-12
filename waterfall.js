var checkInterval = 60 * 1000; // 1 minute
var historysize = 24 * 60; // 1 day in minutes
var pixh = 5;
var pixw = 1;

var games = []
var dataStore = {};

function drawLine(ctx, y) {
    ctx.beginPath();    
    ctx.fillStyle = 'black';
    ctx.fillRect(0, y * pixh, historysize * pixw, pixh);
    ctx.fill();
}

/* draw a single datapoint:
 *   either a level is up (green), down (red)
 *   and anything else is unknown (yellow),
 *   which may be missing data as well
 */
function drawDatapoint(ctx, x, y, w, value) {
    ctx.beginPath();
    
    switch(value) {
        case "up":
            ctx.fillStyle = '#88ff88';
            break;
        case "down":
            ctx.fillStyle = '#ff8888';
            break;
        default:
            ctx.fillStyle = '#ffffcc';
            break;
    }

    ctx.fillRect(x * pixw, y * pixh, w * pixw, pixh);
    ctx.fill();
}

function drawEverything() {

    var canvas = document.getElementById('img');
    var ctx = canvas.getContext('2d');

    /* count levels to set height of canvas */
    var levelcount = 0;
    games.forEach(function(gamename) {
        if(dataStore[gamename]) {
            levelcount += dataStore[gamename].length;
        }
        levelcount += 1; /* have a line here */
    });    

    /* resize canvas based on available data */
    canvas.height = levelcount * pixh;
    canvas.width = historysize * pixw;

    /* loop over levels and draw lines */
    var line = 0;
    var currentTime = (new Date()).getTime() / 1000;

    games.forEach(function(gamename) {
        if(dataStore[gamename]) {
            var gamestartline = line;
            var levels = dataStore[gamename];

            /* one line to separate the game from the rest, except the first line */
            if(line != 0) {
                drawLine(ctx, line);
                line += 1;
            }

            /* draw all the levels */
            levels.forEach(function(level) {
                var lastx = historysize;
                level.data.forEach(function(dpoint) {
                    var minago = (currentTime - dpoint.timestamp) / 60;
                    var x = historysize - minago;
                    drawDatapoint(ctx, x, line, lastx - x, dpoint.status);
                    lastx = x;
                })
                line += 1;
            })

            /* show the game name */
            ctx.font = "16px Georgia";
            ctx.fillStyle = 'black';
            ctx.fillText(gamename, 10, (gamestartline * pixh) + 16);        
        }
    });

}

var loadData = function () {
    console.log("fetching new data");
	fetch("/games.json").then(
		function (response) {
			response.json().then(function (data) {
				var tsi = Math.floor((new Date()).getTime() / (1000 * 10));

                games = data;

				data.forEach(gamename => {
                    fetch("/data/archive-" + gamename + ".json?" + tsi).then(
						function (response) {
							response.json().then(function (gamedataobj) {
                                dataStore[gamename] = gamedataobj;
                                drawEverything();
							});
						});
				});
			});
		}
	);
}

loadData();
setInterval(loadData, checkInterval);
