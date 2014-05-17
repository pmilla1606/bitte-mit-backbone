 var rowTemplate=$('#track_listing').html();
 var currentTemplate = $('#current_track').html();
var updateTemplate = $('#vote_updates').html();
    var data = [
      {"track_id":"11","track_name":"I Am The Lion King","track_artist":"PAPA","track_uri":"spotify:track:68rLqLxfsninXMmL9YOYDQ","party_name":"SSS1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"5","current":"1"},
      {"track_id":"8","track_name":"If You\u2019re My Girl, Then I\u2019m Your Man","track_artist":"PAPA","track_uri":"spotify:track:7L7KEdJEetZZlXdOGjiPZR","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"3","current":"0"},
      {"track_id":"3","track_name":"Young Rut","track_artist":"PAPA","track_uri":"spotify:track:1OO8jZXbcBiy1BHd4btWyH","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},
      {"track_id":"7","track_name":"Get Me Through The Night","track_artist":"PAPA","track_uri":"spotify:track:2HwaPOkklM2wLBiFgzxnrV","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"2","current":"0"},
      {"track_id":"12","track_name":"Replacements (Curls In The Grass)","track_artist":"PAPA","track_uri":"spotify:track:0WXvxkxF7DrHbniMWFt3B5","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"1","current":"0"},
      {"track_id":"2","track_name":"Put Me To Work","track_artist":"PAPA","track_uri":"spotify:track:1nTvJgr9WaRk6BDoUdjAmZ","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"4","track_name":"Forgotten Days","track_artist":"PAPA","track_uri":"spotify:track:0FkPGV98QtSzlaA7QxKZDM","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"5","track_name":"Cotton Candy","track_artist":"PAPA","track_uri":"spotify:track:7KYmNEICvEZkHEeY0RMz13","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"6","track_name":"If The Moon Rises","track_artist":"PAPA","track_uri":"spotify:track:3Dfs0kLsKAtnM304KsKPQE","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"9","track_name":"Tender Madness","track_artist":"PAPA","track_uri":"spotify:track:7bBnRjOgSI53XhAhT0vym8","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"10","track_name":"Got To Move","track_artist":"PAPA","track_uri":"spotify:track:1YpTGlr4XtU0xrlEI60ori","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"0","current":"0"},
      {"track_id":"1","track_name":"PAPA","track_artist":"PAPA","track_uri":"spotify:track:78CKlM2G8bWHzNn9s7QlKj","party_name":"1395271676171","playlist_uri":"spotify:user:@:playlist:2riMRzFySmWTlEwLyONivf","vote_count":"-1","current":"0"}
    ];

    var TrackModel = Backbone.Model.extend({
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

  
  var PeopleCollection = Backbone.Collection.extend({
    model: TrackModel,
    url:'http://www.bitte.io/go/updateSpotify.php',

    comparator: function(m){
            return -m.get('vote_count');
    },
  });
  


    var VoteManager = Backbone.View.extend({
        el: '#header',
        template: _.template($('#vote_counter').html()),
        initialize: function(){
            
            peopleCollection.on('change',function(){
            	console.log('peopleCollection has changed');
                var voteCount = [];
                for(i=0; i<localStorage.length; i++){
                   
                    var tracksOnly = localStorage.key(i);
                    if (tracksOnly !== 'partyName'){
                        voteCount.push(parseInt(localStorage.getItem(i+1)));
                    }
                }
                console.log(voteCount);
            },this);

            this.render();
        },
        render: function(){
            console.log('vote manager render', peopleCollection.length);
            var maxVotes = peopleCollection.length;

            this.$el.html(this.template({ls_votes_left: maxVotes}))
        }
    });

	var peopleCollection = new PeopleCollection();
    /** View representing a table */
    var TableView = Backbone.View.extend({
      el: '#tracks',
      collection: peopleCollection,
      initialize : function() {
      	var that = this;
      			//peopleCollection.reset();
      	
				peopleCollection.fetch({
					success: function(){
						that.collection.add(data);
						console.log(that.collection);
					}
				});
				console.log(peopleCollection);
		        
		        
		
				_.bindAll(that,'render','renderOne');
		        
		        if(that.model) {
		
		        	that.model.on('change',that.render,that);
		        }
      	var poller = Backbone.Poller.get(this.collection);
		
		/*
poller.on('success', function(model){
			
		});
        
        poller.start()
        
*/
		
          

      },
      render: function() {
      console.log(peopleCollection);
      			var partyId = this.collection.models[0].attributes.party_name;
		        var maxLength = this.collection.models.length;
                $('body').append( tableView.render().$el );
            
        console.log(peopleCollection);
        //this.collection.sort();
        //this.collection.each(this.renderOne);
        
       this.collection.on('add', function(){
			
       });
        
         
        return this;
      },
      renderOne : function(model) {
           
          var row = new RowView({model:model});
          this.$el.append(row.render().$el);
        
          return this;
      }
    });

    /** View representing a row of that table */
    var RowView = Backbone.View.extend({
        tagName: 'li',
        className: 'trackListing',
        events: {
          //'click .vote-button': function() {console.log(this.model.get('track_id'));}
          'click .vote-button': 'vote'
      },
      initialize: function() {
        this.model.on('change',this.render,this);
        	
        	
      	},
		//model: peopleCollection.models,
      render: function() {

         if(this.model.attributes.current ==1){
          	var currHtml=_.template(currentTemplate,this.model.toJSON());
         	$('#trackInfo .secondary').append(currHtml);
         }
         else{
         	var html = _.template(rowTemplate, this.model.toJSON() );
         	this.$el.html(html);
         }
          
         return this;
      },
      vote: function(e){
        e.preventDefault();
        var thisModel = this.model;
        var thisClientVotes = Number(this.model.get('vote_count'));
        
       
        if(e.target.attributes[2].name == 'data-upvote'){
            console.log('up');
          /*   var thisClientVotes = thisClientVotes +1; */
            this.model.set({vote_count:1});
            
        }
        else{

			this.model.set({vote_count:-1});
            
        }
        this.model.save();
       
 		var updateHtml = _.template(updateTemplate, this.model.toJSON());
        $('#track-updater').html(updateHtml)
            .fadeIn()
            .delay(1250)
            .fadeOut();
        $('ul#tracks > li').tsort('span.voteInd', {order: 'desc'});

        
        //this.sortList();            
        
      },
      sortList: function () {
          
            ul = this.$el.parents('ul');
            console.log(ul);
          // Get the list items and setup an array for sorting
          var lis = ul[0].getElementsByTagName("LI");
          var vals = [];

          // Populate the array
          for(var i = 0, l = lis.length; i < l; i++)
            vals.push(lis[i].innerHTML);

          // Sort it
          vals.sort();
          vals.reverse();
          

          // Change the list on the page
          for(var i = 0, l = lis.length; i < l; i++)
            lis[i].innerHTML = vals[i];
        }
    });

    var UpdateView = Backbone.View.extend({
        el: '#track-updater',
        template: _.template($('#vote_updates').html()),
        initialize: function(){
            var that = this;

            that.render();
        },
        render: function(){
            console.log('update trigger', this);
        }

    });
    //var server = new serverCollection();
   // var peopleCollection = new PeopleCollection();

    			var tableView = new TableView();
    $('body').append( tableView.render().$el );

//var tableView = new TableView();

$(document).ready(function(){
  $('nav section').on('click', function(){
      
      $(this).toggleClass('active').siblings().toggleClass('inactive')
      $(this).children('.secondary').toggle().toggleClass('animated flipInX');
      
  });
});

  