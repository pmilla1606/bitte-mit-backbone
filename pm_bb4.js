var dummy = [{"track_id":"11","track_name":"I Am The Lion King","track_artist":"PAPA","track_uri":"spotify:track:68rLqLxfsninXMmL9YOYDQ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"5","current":"1","client_votes":"-5"},{"track_id":"8","track_name":"If You\u2019re My Girl, Then I\u2019m Your Man","track_artist":"PAPA","track_uri":"spotify:track:7L7KEdJEetZZlXdOGjiPZR","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"3","current":"0"},{"track_id":"3","track_name":"Young Rut","track_artist":"PAPA","track_uri":"spotify:track:1OO8jZXbcBiy1BHd4btWyH","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"7","track_name":"Get Me Through The Night","track_artist":"PAPA","track_uri":"spotify:track:2HwaPOkklM2wLBiFgzxnrV","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"12","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"1","current":"0"},{"track_id":"2","track_name":"Put Me To Work","track_artist":"PAPA","track_uri":"spotify:track:1nTvJgr9WaRk6BDoUdjAmZ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"4","track_name":"Forgotten Days","track_artist":"PAPA","track_uri":"spotify:track:0FkPGV98QtSzlaA7QxKZDM","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"5","track_name":"Cotton Candy","track_artist":"PAPA","track_uri":"spotify:track:7KYmNEICvEZkHEeY0RMz13","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"6","track_name":"If The Moon Rises","track_artist":"PAPA","track_uri":"spotify:track:3Dfs0kLsKAtnM304KsKPQE","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"9","track_name":"Tender Madness","track_artist":"PAPA","track_uri":"spotify:track:7bBnRjOgSI53XhAhT0vym8","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"10","track_name":"Got To Move","track_artist":"PAPA","track_uri":"spotify:track:1YpTGlr4XtU0xrlEI60ori","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"1","track_name":"PAPA","track_artist":"PAPA","track_uri":"spotify:track:78CKlM2G8bWHzNn9s7QlKj","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"-1","current":"0"}];


var TrackModel = Backbone.Model.extend({
	//url:
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
    }
});

var TrackCollection = Backbone.Collection.extend({
	model: TrackModel,
	//url:'',
	comparator: function(m){
        return -m.get('client_votes');
    },	
});

trackCollection = new TrackCollection();

var AppView = Backbone.View.extend({
	el: '#trackWrap',
	events: {
		'click .vote-button': 'vote'
	},
	template: _.template($('#track_listing').html()),
	initialize: function(){

		_.each(dummy, function(track){
			trackCollection.add(track);
		});

		trackCollection.on('change:client_votes', function(){
			console.log('collection has changed', trackCollection);
			
		});

		this.render();
	},
	render: function(){
		//console.log(dummy);
		var that = this;
		var trackList = that.$el.find('#tracks');
		
		
		trackCollection.sort();

		// trackCollection.models.hasChanged(function(){
		// 	console.log(this)
		// });

		//$('.trackListing').removeClass('upvoted').removeClass('downvoted')
		trackList.html('');
		var eachTracks = _.each(trackCollection.models, function(tracks){
			trackList.append(that.template(tracks.toJSON()));	
		});

	},
	vote: function(e){
		e.preventDefault();
		// MAX VOTES HERE
		var thisTrackId = e.target.attributes[2].value;
		var thisModel = trackCollection.where({track_id: thisTrackId});

		var thisVotes = thisModel[0].attributes.client_votes;
		
		var thisListItem = $(e.target).parents('.trackListing');
		console.log(thisListItem)
		if (e.target.attributes[2].name == 'data-upvote'){
			thisListItem.addClass('upvoted');
			var thisVotes = thisVotes+1;
			
			thisModel[0].set({'client_votes':thisVotes});

			//thisModel[0].save();
		}
		else{
			thisListItem.addClass('downvoted');
			var thisVotes = thisVotes-1;
			thisModel[0].set({'client_votes':thisVotes});
			//thisModel[0].save();
		}

		this.render();

	}
});






// var TrackView = Backbone.View.extend({
// 	el: '.trackListing',
	
// 	events: {
// 		'click .vote-button':'voteMe'
// 	},
// 	initialize: function(){
// 		this.render();
// 	},
// 	render: function(){
		
// 	},
// 	voteMe: function(e){
// 		console.log(trackCollection);
// 		//var thisVote = e.target.
// 		console.log(e);

// 		var thisVote = e.target.attributes[2].value;
// 		var thisModel = trackCollection.get({'track_id':'11'});

// 		console.log(trackCollection);
		
// 	}		
// });


var run = new AppView();