
// to avoind xhtml shit use this instead of server calls (obviously won't help when debugging php shit)
var dummy = {"bitteSortOrder":[{"track_id":"11","track_name":"I Am The Lion King","track_artist":"PAPA","track_uri":"spotify:track:68rLqLxfsninXMmL9YOYDQ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"5","current":"1"},{"track_id":"8","track_name":"If You\u2019re My Girl, Then I\u2019m Your Man","track_artist":"PAPA","track_uri":"spotify:track:7L7KEdJEetZZlXdOGjiPZR","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"3","current":"0"},{"track_id":"3","track_name":"Young Rut","track_artist":"PAPA","track_uri":"spotify:track:1OO8jZXbcBiy1BHd4btWyH","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"7","track_name":"Get Me Through The Night","track_artist":"PAPA","track_uri":"spotify:track:2HwaPOkklM2wLBiFgzxnrV","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},{"track_id":"12","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"1","current":"0"},{"track_id":"2","track_name":"Put Me To Work","track_artist":"PAPA","track_uri":"spotify:track:1nTvJgr9WaRk6BDoUdjAmZ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"4","track_name":"Forgotten Days","track_artist":"PAPA","track_uri":"spotify:track:0FkPGV98QtSzlaA7QxKZDM","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"5","track_name":"Cotton Candy","track_artist":"PAPA","track_uri":"spotify:track:7KYmNEICvEZkHEeY0RMz13","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"6","track_name":"If The Moon Rises","track_artist":"PAPA","track_uri":"spotify:track:3Dfs0kLsKAtnM304KsKPQE","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"9","track_name":"Tender Madness","track_artist":"PAPA","track_uri":"spotify:track:7bBnRjOgSI53XhAhT0vym8","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"10","track_name":"Got To Move","track_artist":"PAPA","track_uri":"spotify:track:1YpTGlr4XtU0xrlEI60ori","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},{"track_id":"1","track_name":"PAPA","track_artist":"PAPA","track_uri":"spotify:track:78CKlM2G8bWHzNn9s7QlKj","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"-1","current":"0"}]};

var trackModel = Backbone.Model.extend({
    url: 'http://www.bitte.io/go/backbone.php',
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
var tracks = new trackModel();

var trackCollection = Backbone.Collection.extend({
    model: trackModel,
    url: 'http://www.bitte.io/go/updateSpotify.php',
    comparator: function(m){
        return -m.get('client_votes');
    },
    initialize:function(){
        var that = this;
        that.on('change:client_votes', function(){
            console.log('collection changed in collection', that);
    
        })
    },
    // maybe this is better than calling collection.fetch() in init?? I have no clue
    // parse: function(response){
    //      var that = this;
    //      var tracks = response;
    //      console.log('parse', tracks.bitteSortOrder);
    //      _.each(tracks.bitteSortOrder, function(i){
    //          console.log(i);
    //          that.add(i);
    //      });
    //  }
});
var collection = new trackCollection();



var trackView = Backbone.View.extend( {
    template : _.template( $( '#track_listing' ).html() ),
    events:{
        'click .vote-button': 'vote'
    },

    render : function() {
        var emp = this.model.toJSON();
        var html = this.template( emp );
        
        this.$el.removeClass('upvoted').removeClass('downvoted');
        this.$el.html( html );

    },
    vote:function(e){
       e.preventDefault();
       var maxVotes = collection.length;
       var thisModel = collection.get(this.model.cid);
       var thisVotes = thisModel.attributes.client_votes;
    
        if(Math.abs(thisVotes) == maxVotes){
            console.log('out of votes');
            return;
        } 
        else if($(event.target).hasClass('upvote')){
            console.log('up');
            thisVotes = thisVotes +1;
            thisModel.set({'client_votes': thisVotes});
            this.$el.addClass('upvoted');
            thisModel.save();
        }
        else{
           
            thisVotes = thisVotes -1;
            thisModel.set({'client_votes': thisVotes});
            this.$el.addClass('downvoted');
            thisModel.save();
        };
        
    },
});


var myCollectionView = new Backbone.CollectionView( {
    el : $('#tracks'),     // must be a 'ul' (i.e. unordered list) or 'table' element 
    modelView : trackView,           // a View class to be used for rendering each model in the collection
    collection : collection,
    selectable: false

});

var appView = Backbone.View.extend({
    
    initialize: function(){
        var that = this;            
         that.render();
         
         /* setInterval(function(){ */
            that.longPoll();
         /* }, 2000)  */
        
    },
    longPoll: function(){
        var that = this;
        collection.fetch({
            success: function(data){
            // wtf is happening here??
            var jaysawn = data;
            _.each(data.models, function(i){
               console.log(i.attributes.bitteSortOrder);
               collection.add(i.attributes.bitteSortOrder);
            });
        
            console.log(collection);
            }
        });
    },
    render:function(){
        myCollectionView.render();
        
        this.$el.prepend(this);
        
        collection.on('change:client_votes', function(){
            collection.sort();
            myCollectionView.render();
            console.log('changed collection');
       });
       
        collection.on('change', function(){
            // var map = _.map(this.models, function(m){
            //     m.save();
            // });
            // console.log(map);
            
        });
    },
});

var run = new appView();
