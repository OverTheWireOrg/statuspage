var checkInterval = 60 * 1000; // 1 minute
var reloadInterval = 24 * 3600 * 1000; // 1 day


var loadData = function (app) {
	fetch("/games.json").then(
		function (response) {
			response.json().then(function (data) {
				app.games = data;
				var tsi = Math.floor((new Date()).getTime()/(1000*10));

				data.forEach(gamename => {
					fetch("/data/game-" + gamename + ".json?" + tsi).then(
						function (response) {
							response.json().then(function (gamedataobj) {
								// this makes sure data reactivity is triggered...
								Vue.set(app.gamedata, gamename, gamedataobj);
							});
						});
				});
			});
		}
	);
}

var app = new Vue({
	el: "#app",
	data: {
		games: [],
		gamedata: {},
	},
	methods: {
		makeArrow(str) {
			if(str == undefined) { return str; }
			var textArea = document.createElement('textarea');
			textArea.innerHTML = str.replace(">", "&rarr;");
			return textArea.value;
		}
	},
	created: function () {
		var app = this;

		// start interval timers to reload data and page
		setInterval(function () { loadData(app); }, checkInterval);
		setInterval(document.location.reload, reloadInterval);

		loadData(app);
	}
});
