var tracks = {"bitteSortOrder":[{"track_uri":"spotify:track:7zqlsIvDCJ8vvUNq2ZKVJc","vote_count":"2","track_id":"74","party_name":"1394920562676","playlist_uri":"spotify:user:@d80ac4a1dba37081d5896f4b92c85c22:playlist:38WJcE72IrYwe8Y0gW3f4T","current":"1"},{"track_uri":"spotify:track:7IAS2YBDl12L4XKrP8izlh","vote_count":"1","track_id":"16","party_name":"1394920562676","playlist_uri":"spotify:user:@d80ac4a1dba37081d5896f4b92c85c22:playlist:38WJcE72IrYwe8Y0gW3f4T","current":"0"},{"track_uri":"spotify:track:669YTmizON4m8JPubkoIPb","vote_count":"0","track_id":"17","party_name":"1394920562676","playlist_uri":"spotify:user:@d80ac4a1dba37081d5896f4b92c85c22:playlist:38WJcE72IrYwe8Y0gW3f4T","current":"0"}]};

var trackModel = Backbone.Model.extend({
	id: 'track',
    defaults:{
        track_uri: 0,
        vote_count: 0,
        track_id: 0,
        party_name: 0,
        playlist_uri: 0,
        curent: 0,
        client_votes: 0
    }
});

var trackCollection = Backbone.Collection.extend({
    model: trackModel,
    comparator: function(m){
        return -m.get('client_votes');
    },
    initialize:function(){
        var that = this;

        _.each(tracks.bitteSortOrder, function(i){
            that.add(i)
        });
    }
});

var collection = new trackCollection().sort(); 
var maxVotes = collection.length;

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
       
       var thisModel = collection.get(this.model.cid);
       var thisVotes = thisModel.attributes.client_votes;
      
        if(Math.abs(thisVotes) == maxVotes){
            return;
        } 
        else if($(event.target).hasClass('upvote')){
            
            thisVotes = thisVotes +1;
            thisModel.set({'client_votes': thisVotes});
            this.$el.addClass('upvoted');
        }
        else{
            
            thisVotes = thisVotes -1;
            thisModel.set({'client_votes': thisVotes});
            this.$el.addClass('downvoted');
            
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
    el: '#trackWrap',
    initialize: function(){
        this.render();
    },
    render:function(){
        myCollectionView.render();
        
        this.$el.prepend(this);
        
        collection.on('change:client_votes', function(){
            collection.sort();
            myCollectionView.render();
       });
       
        collection.on('change', function(){
            console.log('change', this.models);
            
        });
    },
});

var run = new appView();
