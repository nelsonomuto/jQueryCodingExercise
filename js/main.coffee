$ ->
  makeMovieListSortableByDragAndDrop()

  urlMap =
    nowPlaying: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=0'
    comingSoon: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=1'
    alphabetical: 'http://api.kendomobilebook.com/api/Movies/GetMovieList?listtype=3'

  updateMovieList urlMap.nowPlaying
  $( '#movieListTypeList li' ).click ->
    $('input[data-type=search]').val('')
    updateMovieList urlMap[this.id]
    $( '#movieListTypeList li' ).removeClass 'ActiveListType'
    $( this ).addClass 'ActiveListType'

updateMovieList = ( url ) ->
  nowPlayingMovies = []
  $.mobile.showPageLoadingMsg();
  $.ajax
    type: 'GET'
    dataType: 'xml'
    url: url
    success: (xml) ->
      $.mobile.hidePageLoadingMsg();
      $( xml ).find( 'MovieBO' ).each ->
        nowPlayingMovies.push $.xml2json this

      movieListTemplate = Handlebars.compile $( '#movieList-template' ).html()
      $( '#movieList' ).html movieListTemplate
        movies: nowPlayingMovies
      $( '#movieList' ).listview 'refresh'
    error: (xml) ->
      alert('Error retrieving movie list.')


makeMovieListSortableByDragAndDrop = ->
  $( '#movieList' ).sortable()
  $( '#movieList' ).disableSelection()
  $( '#movieList' ).bind 'sortstop', ->
    $( '#movieList' ).listview 'refresh'
