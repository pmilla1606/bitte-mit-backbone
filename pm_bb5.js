 var rowTemplate=$('#track_listing').html();
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
        // url: 'http://www.bitte.io/go/updateSpotify.php',
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


    /** Collection of models to draw */
    var peopleCollection = new Backbone.Collection(data, {
        model: TrackModel,
        //url:,
        comparator: function(m){
            
            return -m.get('vote_count');
        },
    });


    var VoteManager = Backbone.View.extend({
        el: '#header',
        template: _.template($('#vote_counter').html()),
        initialize: function(){
            
            peopleCollection.on('change',function(){
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


    /** View representing a table */
    var TableView = Backbone.View.extend({
      el: '#tracks',
      initialize : function() {
       
        var partyId = this.collection.models[0].attributes.party_name;
        var maxLength = this.collection.models.length;

       





          _.bindAll(this,'render','renderOne');
          if(this.model) {
            this.model.on('change',this.render,this);
            console.log(this.model);
          }
          peopleCollection.on('change', function(){
           
          });



      },
      render: function() {
        
        
        this.collection.sort();
        this.collection.each(this.renderOne);
         
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
      model: peopleCollection.models,
      render: function() {
         peopleCollection.sort();
         
          var html=_.template(rowTemplate,this.model.toJSON());
          this.$el.html(html);
          return this;
      },
      vote: function(e){
        e.preventDefault();
        var thisModel = this.model;
        var thisClientVotes = Number(this.model.get('vote_count'));
        
        
        
        console.log(updateTemplate);

        if(e.target.attributes[2].name == 'data-upvote'){
            this.$el.addClass('upvoted');
            var thisClientVotes = thisClientVotes +1;
            this.model.set({vote_count:thisClientVotes});



            this.$el.removeClass('upvoted');
        }
        else{
            this.$el.addClass('downvoted');
            var thisClientVotes = thisClientVotes -1;
            this.model.set({vote_count:thisClientVotes});
            this.$el.removeClass('downvoted');
        }
        var updateHtml = _.template(updateTemplate, this.model.toJSON());
        $('#track-updater').html(updateHtml)
            .fadeIn()
            .delay(1250)
            .fadeOut();
        

        



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
    
    var tableView = new TableView({collection: peopleCollection});
    $('body').append( tableView.render().$el );



  