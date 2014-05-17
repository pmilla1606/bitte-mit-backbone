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


var App = Backbone.View.extend({
  el: '#tracks',
  initialize: function(){
    var that = this;
    
    trackCollection = new TrackCollection();
    trackCollection.fetch({
      success: function(data){
        trackCollection.add(data);
      }
    });

    var pollerOptions = {delay: 3000};
    var poller = Backbone.Poller.get(trackCollection, pollerOptions);
    poller.on('success', function(model){
      that.render();
    });
    poller.start();
//    trackCollection.bind('change:vote_count', that.render);
  },
  render: function(){
    var that = this;
   
    that.$el.html("");
    
    trackCollection.each(function(model){
      if(model.attributes.current == 1){
        var currentTrack = new CurrentTrackView({model:model});
       
      }
      else{
        var trackListing = new TrackListingView({model:model});

        that.$el.append(trackListing.$el);
      }
    });
    $('#loader').fadeOut();
    
    
  }
});

var CurrentTrackView = Backbone.View.extend({
  el: '#trackInfo',
  className: 'currentTrackDisplay',
  template: _.template( $('#current_track').html() ),
  initialize: function(){
    this.render();
  },
  render: function(){
    if(this.model.attributes.party_name !== localStorage.getItem('partyName')){
      console.log('IDs dont match -- resetting localStorage');
      localStorage.setItem('partyName', this.model.attributes.party_name);
      localStorage.setItem('votesCast', 0);
      $('#out-of-votes').fadeOut();
    }
    else{
      console.log('IDs match -- moving on');
    }
    
    this.$el.html(this.template(this.model.toJSON()))
    var voteHandler = new VoteHandler();
  }
});


var TrackListingView = Backbone.View.extend({
  
  className: 'trackListing',
  tagName: 'li',
  events: {
    'click .vote-button': 'vote'
  },
  template: _.template( $('#track_listing').html() ),
  initialize: function(){

    //console.log('TrackListingView init', this.el);
    this.render();
  },
  render: function(){
    this.$el.append(this.template(this.model.toJSON()));
    return this;
  },
  vote: function(e){
    e.preventDefault();

    if (localStorage.getItem('votesCast') == 3){
      $('#out-of-votes').fadeIn();
      $('#closeWarning').on('click', function(){
        $('#out-of-votes').fadeOut();
      });
      return;
    }
  

      
    var thisLi = $(e.target).parents('.trackListing');
    thisLi.addClass('fadeOutLi');
    var maxVotes = trackCollection.length;
    var thisVoteCount = this.model.get('vote_count');
    
    var lsVotes = localStorage.getItem('votesCast');
    localStorage.setItem('votesCast', Number(lsVotes) + 1)
    
    var thisVoteCount = this.model.get('vote_count');
    if( e.target.attributes[1].name == 'data-upvote' ){
      this.model.set({'vote_count': Number(thisVoteCount)+1, 'vote_direction': 1});
    }
    else{
      this.model.set({'vote_count': Number(thisVoteCount)-1, 'vote_direction': -1});
    }
  

    this.model.save();
    var trackUpdater = new TrackUpdateDisplay({model:this.model});
    var voteHandler = new VoteHandler({model:this.model});
  }
});

var VoteHandler = Backbone.View.extend({
  el: '#voteInfo',
  template: _.template( $('#vote_counter').html() ),
  initialize: function(){
    
  this.render();

  },
  render: function(){
    console.log('votez')
    var votesLeft = Math.abs(3 - (localStorage.getItem('votesCast')));
    console.log(votesLeft)
    this.$el.html(this.template({'votes_remaining':votesLeft}));
  }
});

var TrackUpdateDisplay = Backbone.View.extend({
  el: '#trackUpdateWrap',
  template: _.template( $('#vote_updater').html() ),
  initialize: function(){
    
    this.render();
  },
  render: function(){
    console.log(this.$el)

    this.$el.html(this.template({
      track_name: this.model.attributes.track_name,
      prev_vote: this.model._previousAttributes.vote_count,
      curr_vote: this.model.attributes.vote_count
    }));
    this.$el.addClass('element-animation');

    this.$el.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
      console.log(this);
      $(this).removeClass('element-animation');
    });

  }
});



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// SEARCH SEARCH SEARCH //
// empty console.log for browsers lacking
if (!window.console) window.console={log:function(){}};

// should we persist search query and region in local storage?
var HAS_LOCAL_STORAGE = (typeof localStorage === 'object');

// tracks changes to form inputs in real time
function InputChangeTracker($input, validatorFilter, handler, persistKey, paused) {
  this.$input = $input;
  var old_value = 0;
  $input.change(function() {
    if (persistKey) localStorage[persistKey] = this.value;
    var current_value = $.trim(this.value);
    if (validatorFilter) validatorFilter(current_value);
    if (old_value && current_value && current_value != old_value) {
      handler.replacedValid(old_value, current_value);
    } else if (!old_value && current_value) {
      handler.becameValid(old_value, current_value);
    } else if (old_value && !current_value) {
      handler.resignedValid(old_value, current_value);
    }
    old_value = current_value;
  });
  // record value
  this._input = $input[0];
  this._value = $.trim(this._input.value);
  // resume unless paused
  if (!paused)
    this.resume();
  // load persisted value
  if (persistKey && HAS_LOCAL_STORAGE && String($input[0].value).length == 0) {
    var value = localStorage[persistKey];
    if (value) $input[0].value = value;
  } else persistKey = null;
}

InputChangeTracker.prototype.resume = function(frequency) {
  clearInterval(this.timer);
  frequency = parseInt(frequency);
  var self = this;
  this.timer = setInterval(function() {
    if (self._value != (self._value = $.trim(self._input.value))) {
      self.$input.change();
    }
  }, (frequency > 0 && !isNaN(frequency)) ? frequency : 100);
};

InputChangeTracker.prototype.pause = function() {
  clearInterval(this.timer);
  this.timer = null;
};


var spotifyMDQuery = {
  $view: null, $input: null,
  
  enable: function() {
    var self = this;
    this.$view.animate({opacity:1.0}, 100, function(){
      $(this).removeClass('disabled');
      self.$input[0].disabled = false;
      self.changeTracker.resume();
    });
    this.searchResults.$view = this.$view.find('.results');
    // setup region
    if (!this._hasSetupRegion) {
      // set region from stored data, if any
      
      regionCode = 'US';
      this._hasSetupRegion = true;
    }
  },
  
  disable: function() {
    this.$view.addClass('disabled').animate({opacity:0.15}, 200);
    this.$input[0].disabled = true;
    this.changeTracker.pause();
  },
  
  searchResults: {
    $view: null,
    update: function (data) {
      if (data) this.data = data;
      else data = this.data;
      if (!data) return;
      var $count = this.$view.find('.count');
      var $list = this.$view.find('.list');
      console.log($list);
      $count.text(data.info.num_results);
      $list.empty();
      var A = function(href, text, styleClass) {
        var a = document.createElement('a');
        a.setAttribute('href', href);
        if (styleClass)
          a.setAttribute('class', styleClass);
        if (text) a.appendChild(document.createTextNode(text));
        return a
      }
      var i, L, li, $li, a, x, artist, track, limit = 30;
      for (i=0,L=data.tracks.length; i<L; ++i) {
        track = data.tracks[i];
        
        // check region
        if (track.album && track.album.availability && spotifyMDQuery.regionCode) {
          if (track.album.availability.territories.indexOf(spotifyMDQuery.regionCode) === -1) {
            // not available
            continue;
          }
        }
        
        li = document.createElement('div');
        $li = $(li);
		$li.append('<button type="button" class="progress-button btn btn-default" data-style="fill" data-horizontal data-spouri="'+track.href+'">Add<span class="searchResultLine"><strong><span class="trackName">'+track.name+'</span></strong><br /> by <span class="trackArtist">'+track.artists[0].name+'</span></span><div class="buttonLoader"><div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div></div></button>');


        $list.append($li);

        if (--limit === 0) {
          
          break;
        }
      }
    
    $('.progress-button').on('click', function(){
    	var that = this;
  		var thisUri = $(this).data('spouri');
		var partyName = Date.now();
		var thisTrack = $(this).find('.trackName').html();
		var thisArtist = $(this).find('.trackArtist').html();
		
		
		console.log(thisTrack);
		
		$.ajax({
				url: "http://www.bitte.io/go/addTrack.php",
				data: {	'party_name':JSON.stringify(partyName),
						'uri':JSON.stringify(thisUri),
						'track_name': JSON.stringify(thisTrack),
						'track_artist':JSON.stringify(thisArtist)
						},
				type: 'POST',
				beforeSend: function(){
					$(that).find('.buttonLoader').fadeIn();
				},
				success: function() {
						$(that).fadeOut();
						
				}
		});
  		
  	});  
    },
    
    clear: function () {
      this.$view.find('.list').empty();
    }
    
    
  },
  
  sendQuery: function (query) {
    var self = this;
    if (self._activeQueryXHR)
      self._activeQueryXHR.abort();
    $.ajax({
      url: 'http://ws.spotify.com/search/1/track.json',
      dataType: 'json',
      data: {q: query},
      timeout: 30000,
      beforeSend: function (xhr) {
        self._activeQueryXHR = xhr;
      },
      complete: function (xhr, textStatus) {
        if (self._activeQueryXHR === xhr)
          self._activeQueryXHR = null;
      },
      success: function (data, textStatus, xhr) {
        //console.log('results: ', data, textStatus, xhr);
        self.searchResults.update(data);
      }
    });
  },
  
  dispatchSendQuery: function (query) {
    if (!this._sendQueryLatency) {
      // no latency first time
      this.sendQuery(query);
      this._sendQueryLatency = 100;
      return;
    } else {
      this._sendQueryLatency = Math.min(this._sendQueryLatency + 100, 600);
    }
    if (this._sendQueryTimer) clearInterval(this._sendQueryTimer);
    var self = this;
    this._sendQueryTimer = setTimeout(function(){
      self._sendQueryTimer = null;
      self._sendQueryLatency = 100;
      self.sendQuery(query);
    }, this._sendQueryLatency);
  },
  
  // --- change handlers ---
  
  // still valid but id changed
  replacedValid: function (oldValue, value) {
    console.log('query changed: still valid but id changed', 
                oldValue, '-->', value)
    this.dispatchSendQuery(value);
  },
  
  // changed from invalid to valid
  becameValid: function (oldValue, value) {
    console.log('query changed: became valid id', value)
    this.searchResults.$view.fadeIn(200);
    this.dispatchSendQuery(value);
  },
  
  // changed from valid to invalid
  resignedValid: function (oldValue, value) {
    console.log('query changed: resigned valid id (was '+oldValue+')')
    var searchResults = this.searchResults;
    searchResults.$view.fadeOut(200, function() {
      searchResults.clear();
    });
  }
};



$(document).ready(function(){
 
  $('#navToggle').on('click', function(){
    $('.hamburger, nav').toggleClass('open');
  });
  

  
  
  
  
  
 // is the host browser capable of CORS?
  if (typeof XMLHttpRequest === 'undefined' ||   (new XMLHttpRequest).withCredentials === undefined ) {
    $('#spotifyMDQuery').empty().html('<h1>Sorry...</h1><p>'+
      'This browser does not support requesting remote resources. '+
      'Try again with a recent version of Google Chrome, Safari, Firefox or '+
      'another modern browser supporting "Cross-Origin Resource Sharing".');
    return;
  }

  // setup and enable our "spotifyMDQuery" object
  spotifyMDQuery.$view = $('#spotifyMDQuery');
  spotifyMDQuery.$input = spotifyMDQuery.$view.find('input[type=text]');
  spotifyMDQuery.changeTracker = new InputChangeTracker(spotifyMDQuery.$input, null, spotifyMDQuery, 'spotifyMDQuery');
  spotifyMDQuery.$region = spotifyMDQuery.$view.find('select.region');
  spotifyMDQuery.enable();
  spotifyMDQuery.$input.focus();  
  
  var run = new App();
});