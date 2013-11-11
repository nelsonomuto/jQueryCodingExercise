(function() {
  var makeMovieListSortableByDragAndDrop, updateMovieList;

  $(function() {
    var urlMap;
    makeMovieListSortableByDragAndDrop();
    urlMap = {
      nowPlaying: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=0',
      comingSoon: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=1',
      alphabetical: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=3'
    };
    updateMovieList(urlMap.nowPlaying);
    return $('#movieListTypeList li').click(function() {
      $('input[data-type=search]').val('');
      updateMovieList(urlMap[this.id]);
      $('#movieListTypeList li').removeClass('ActiveListType');
      return $(this).addClass('ActiveListType');
    });
  });

  updateMovieList = function(url) {
    var nowPlayingMovies;
    nowPlayingMovies = [];
    $.mobile.showPageLoadingMsg();
    return $.ajax({
      type: 'GET',
      dataType: 'xml',
      url: url,
      success: function(xml) {
        var movieListTemplate;
        $.mobile.hidePageLoadingMsg();
        $(xml).find('MovieBO').each(function() {
          return nowPlayingMovies.push($.xml2json(this));
        });
        movieListTemplate = Handlebars.compile($('#movieList-template').html());
        $('#movieList').html(movieListTemplate({
          movies: nowPlayingMovies
        }));
        return $('#movieList').listview('refresh');
      },
      error: function(xml) {
        return alert('Error retrieving movie list.');
      }
    });
  };

  makeMovieListSortableByDragAndDrop = function() {
    $('#movieList').sortable();
    $('#movieList').disableSelection();
    return $('#movieList').bind('sortstop', function() {
      return $('#movieList').listview('refresh');
    });
  };

}).call(this);
