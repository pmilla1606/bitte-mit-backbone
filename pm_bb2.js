var dummy = {"bitteSortOrder":[{"track_id":"11","track_name":"I Am The Lion King","track_artist":"PAPA","track_uri":"spotify:track:68rLqLxfsninXMmL9YOYDQ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"5","current":"1"},{"track_id":"8","track_name":"If You\u2019re My Girl, Then I\u2019m Your Man","track_artist":"PAPA","track_uri":"spotify:track:7L7KEdJEetZZlXdOGjiPZR","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"3","current":"0"},{"track_id":"3","track_name":"Young Rut","track_artist":"PAPA","track_uri":"spotify:track:1OO8jZXbcBiy1BHd4btWyH","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"7","track_name":"Get Me Through The Night","track_artist":"PAPA","track_uri":"spotify:track:2HwaPOkklM2wLBiFgzxnrV","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"12","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"1","current":"0"},{"track_id":"2","track_name":"Put Me To Work","track_artist":"PAPA","track_uri":"spotify:track:1nTvJgr9WaRk6BDoUdjAmZ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"4","track_name":"Forgotten Days","track_artist":"PAPA","track_uri":"spotify:track:0FkPGV98QtSzlaA7QxKZDM","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"5","track_name":"Cotton Candy","track_artist":"PAPA","track_uri":"spotify:track:7KYmNEICvEZkHEeY0RMz13","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"6","track_name":"If The Moon Rises","track_artist":"PAPA","track_uri":"spotify:track:3Dfs0kLsKAtnM304KsKPQE","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"9","track_name":"Tender Madness","track_artist":"PAPA","track_uri":"spotify:track:7bBnRjOgSI53XhAhT0vym8","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"10","track_name":"Got To Move","track_artist":"PAPA","track_uri":"spotify:track:1YpTGlr4XtU0xrlEI60ori","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"1","track_name":"PAPA","track_artist":"PAPA","track_uri":"spotify:track:78CKlM2G8bWHzNn9s7QlKj","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"-1","current":"0"}]};

var TrackModel = Backbone.Model.extend({
	defaults:{
	    track_uri: 0,
	    vote_count: 0,
	    track_id: 0,
	    party_name: 0,
	    playlist_uri: 0,
	    curent: 0,
	    client_votes: 0,
	    track_name: '',
	    track_artist: ''
	},

});

var TrackCollection = Backbone.Collection.extend({
	model: TrackModel,
	comparator: function(m){
		return -m.get('client_votes');
	},
	initialize:function(){
		var that = this;
		_.each(dummy, function(i){
			that.add(i);
			console.log('filled collection');
		})
		var that = this;
		that.on('change:client_votes', function(){
			console.log('collection changed - call from TrackCollection', that);
		});
	}
});

var AppView = Backbone.View.extend({
	el: '#trackWrap',
	initialize:function(){
		this.render();
	},
	render:function(){
		var that = this;
		
		new TrackView();
	}
});


var TrackView = Backbone.View.extend({
	el: '#tracks',
	events:{
		'click .vote-button': 'vote'
	},
	template: _.template( $('#track_listing').html() ),
	initialize: function(){
		var that = this;
		
		that.render();

		console.log('trackview init', that);
		//this.$el.append(that.template);	
	},
	render: function(){
		//console.log(this.$el);
		var that = this;
		var trackCollection = new TrackCollection();
		var toJsonCollection = trackCollection.toJSON();
		
		_.each(toJsonCollection, function(track){
			var temp = track;
			that.$el.append(that.template(temp));
		});
	},
	vote: function(e){
		var voteCollection = new TrackCollection();
		var thisModel = this.model;
		
		console.log(this);
		console.log('you done click', this);
	}
});

var run = new AppView();
