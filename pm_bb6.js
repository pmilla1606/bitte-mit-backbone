var TrackModel = Backbone.Model.extend({
  url: 'http://www.bitte.io/go/backbone.php',
  defaults:{
    track_uri: 0,
    vote_count: 0,
    track_id: 0,
    party_name: 0,
    playlist_uri: 0,
    current: 0,
    client_votes: 0,
    track_name: '',
    track_artist: '',
    vote_direction: 0,
  }
});

var TrackCollection = Backbone.Collection.extend({
  model: TrackModel,
  url: 'http://www.bitte.io/go/updateSpotify.php',
  initialize: function(){
    this.reset();
  },
  comparator: function(m){
    return -m.get('vote_count');
  },
});





var AppView = Backbone.View.extend({
  el: '#tracks',
  events: {},
  
  initialize: function(){
    var that = this;
    _.bindAll(that, 'render', 'renderOne');
    
    trackCollection.fetch({
      success: function(data){
        trackCollection.add(data);

      }
    });
    

    trackCollection.bind('change:vote_count', function(){
      console.log('trackCollection has changed');
      that.render();
    });






    
    var pollerOptions = {delay:2500};
  var poller = Backbone.Poller.get(trackCollection, pollerOptions);
  poller.on('success', function(model){
    that.render();
  });
  poller.start();
  $('#loader').fadeOut();
  },
  render: function(){
  var that = this;
    that.$el.html('');
  
  
  
    trackCollection.each(function(model){
    if (model.attributes.current == 1){
      that.renderCurrent(model);
      
    }
    else{
      that.renderOne(model);    
    }
    });


// THIS IS A HACK -- FIGURE IT OUT
$('.primary').on('click', function(){
  $(this).parents('section').toggleClass('active').siblings().toggleClass('inactive');
  $(this).siblings('.secondary').toggle().toggleClass('animated flipInX');
});
    return this;
  },

  renderOne: function(model){
    var track = new TrackView({model:model});
  this.$el.append(track.$el);
    return this;
  },
  renderCurrent: function(model){
    
  if (model.attributes.party_name !== localStorage.getItem('partyName') ){
    console.log('resetting localstorage');
    localStorage.setItem('partyName', model.attributes.party_name);
    localStorage.setItem('votesCast', 0);
  }
  else{
    console.log('ids match -- move on');
  }
  
    
  var currentTemplate = _.template($('#current_track').html());
  $('#current-track-info').html(currentTemplate(model.toJSON()));

  var votesRemainingTemp = _.template($('#vote_counter').html());
  
  $('#voteInfo').html(votesRemainingTemp({'votes_remaining': Math.abs(10 - (localStorage.getItem('votesCast')))}));
  
  
  },

});


var TrackView = Backbone.View.extend({
    
    tagName: 'li',
    className: 'trackListing',
    template: _.template($('#track_listing').html()),
    events:{
      'click .vote-button': 'vote',
    },
    initialize: function(){
      
      this.render();
     
    },
    render: function(){
    _.bindAll(this, 'vote');
     
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    voteUpdate: function(){
      var voteUpdateTemp = _.template($('#vote_counter').html());
      console.log(this);
    
  },
    vote: function(e){
      e.preventDefault();
      
      if (localStorage.getItem('votesCast') == 10){
        console.log('out of votes');
        return;
      }
      
      var thisLi = $(e.target).parents('.trackListing');
      var maxVotes = trackCollection.length;
      var thisVoteCount = this.model.get('vote_count');
      
      var lsVotes = localStorage.getItem('votesCast');
      localStorage.setItem('votesCast', Number(lsVotes) + 1)  
      
      
      if(e.target.attributes[1].name == 'data-upvote'){
        
        this.model.set({'vote_count': Number(thisVoteCount) + 1, 'vote_direction': 1});
      }
      else{
      
        this.model.set({'vote_count': Number(thisVoteCount) - 1, 'vote_direction': -1});
      }
      this.model.save();
      

    $('ul#tracks > li').tsort('span.voteInd', {order: 'desc'});
   
    }
});

var trackCollection = new TrackCollection();
var run = new AppView();

//trackCollection.add('track_uri', 0);  

$('.primary').on('click', function(){
  $(this).parents('section').toggleClass('active').siblings().toggleClass('inactive');
  $(this).siblings('.secondary').toggle().toggleClass('animated flipInX');
});