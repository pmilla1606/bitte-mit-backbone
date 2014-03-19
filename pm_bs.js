
var Collection = Backbone.Collection.extend({
    model: Model,
    
    initialize:function(){
    	var that = this;
    	_.map(tracks, function(num){
            that.add(num);
            
        });
        that.on('change:client_votes', function(){
        	new app();

        }, that);

	}
});


var app = Backbone.View.extend({
	el: 'body',
    
    initialize: function(){
        
        this.render();
    },
    render: function(){
		var trackViews = _.each(collection.models, function(i){
            new trackView(i);   
        });
       	
        return this;
     }
});

var trackView = Backbone.View.extend({
	el: '#tracks',
	template: _.template($('#track_listing').html()),
	events: {
        'click .vote-button': 'vote'
    },
    initialize: function(){
    	this.render();
    },
	render: function(){
		this.$el.append(this.template(this.attributes));
		
	},
	vote: function(e){
		thisClick = e.target.attributes;
		
		if (thisClick[2].nodeName == 'data-upvote'){
			var thisTrack = collection.get('track');
						
			console.log(thisTrack)
			// thisTrack.set({'client_votes':'1'});
			// console.log(collection);
			console.log('upvote', thisClick[2].textContent);
		}
		else{
			console.log('downvote', thisClick[2].textContent)
		}
       	
    
    }
});





var run = new app();