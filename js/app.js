$(document).ready(function(){

  // Utils object to store any misc. methods
  var Utils = {
    formatResponse: function(response) {
      return _.map(response.artists, function(artist) {
        return {
          name: artist.name,
          thumbnail: artist.images[1].url,
          url: artist.external_urls.spotify
        };
      });
    },
    getGridMarkup: function(artists) {
      var gridMarkupArray = _.map(artists, function(artist) {
        return Utils.getSingleArtistMarkup(artist);
      });

      return gridMarkupArray.join('');
    },
    getSingleArtistMarkup: function(artist) {
      return Utils.gridTemplate(artist);
    },
    gridTemplate: _.template(
      '<div class="grid-artist col-sm-6 col-md-4">' +
        '<div class="thumbnail">' +
          '<img src="<%= thumbnail %>" alt="...">' +
          '<div class="caption">' +
            '<h3><%= name %></h3>' +
            '<p><a href="<%= url %>" class="btn btn-primary" role="button">Play on Spotify</a></p>' +
          '</div>' +
        '</div>' +
      '</div>'
    )
  };


  // App object to store all app related metods
  var App = {
    init: function() {
      // Methods that need to be called on initialization
      App.bindEvents();
    },
    bindEvents: function() {
      $(".form-control").keyup(function(event){
          if(event.keyCode == 13){
              $(".search").click();
          }
      });

      $('.search').on('click', function(e) {
        e.preventDefault();
        var query = $('input').val();
        $('input').val('');
        var artistIdRequest = App.getArtistId(query);
        artistIdRequest.done(function(response) {
              var artist_id = response.artists.items[0].id;
              var artist_name = response.artists.items[0].name;
              App.renderIntro(artist_name);
              var relatedArtistRequest = App.getRelatedArtists(artist_id);
              relatedArtistRequest.done(function(response) {
                 var relatedArtists = Utils.formatResponse(response);
                 App.renderRelatedArtists(relatedArtists);
              });
          });
      });
  },
    getArtistId: function(query) {
    return $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        dataType: 'json'
      });
  },
    getRelatedArtists: function(id) {
      return $.ajax({
          url: 'https://api.spotify.com/v1/artists/' + id + '/related-artists',
          dataType: 'json'
      });
    },
    renderIntro: function(artist_name) {
      $("#recommendations .intro").html('<h2>Your recommendations based on ' + artist_name + '</h2>');
    },
    renderRelatedArtists: function(artists) {
      var gridMarkup = Utils.getGridMarkup(artists);
      $("#recommendations .grid").html(gridMarkup);
    }
};

  App.init();
});
