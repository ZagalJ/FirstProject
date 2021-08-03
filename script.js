$(document).ready(function () {
  //sets initial value for search string and hides divs
  var searchString = "";
  $("#playlistTable").hide();
  $("#suggestionsContainer").hide();

  //creates event listener for search button
  $("#searchSubmit").click(() => {
    searchString = $(".songName").val();
    fetchArtist(searchString);
  });

  //creates event listener for modal button

  $(".btn-clear").click(() => {
    $(".modal").removeClass("active");
  $("#btn-clear").click(() => {
    $("#modal").removeClass("active");
  });

  //fetches artist and track information from Deezer.com api
  function fetchArtist(searchString) {
    var fetchDeezerUrl =
      "https://deezerdevs-deezer.p.rapidapi.com/search/artist?q=" +
      '"' +
      searchString +
      '"';
    fetch(fetchDeezerUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "472ab927bbmsh9b52a6734e789bfp1337bajsn4f53ca22608a",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => {
        if (!response.ok) {
          displayError("Something has gone wrong. Error " + response.status);
          return response.status;
        }
        return response.json();
      })
      .then((responseArray) => {
        console.log(responseArray);

        //calls functions to display information gathered from fetch to Deezer.com
        displaySearchedArtist(responseArray.data);

        //calls function that displays 10 tracks by searched artist and displays 30 second clip
        displayDiscography(responseArray.data);

        //calls fetch for information from TasteDive.com
        fetchTasteDiveApi(responseArray.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //populates divs related to searched artist
  function displaySearchedArtist(data) {
    //clears information from any prior searches
    $(".albumCover").empty();
    $(".artistName").empty();

    //populates artist name and photo
    $(".albumCover").append(
      $("<img>", {
        class: "artistImage",
        src: data[0].picture_xl,
      })
    );
    $(".artistName").append(data[0].name);
    return;
  }

  //populates song and album information with 30 second sample of song
  function displayDiscography(data) {
    //creates url for fetch from Deezer.com
    var fetchDeezerUrl =
      "https://deezerdevs-deezer.p.rapidapi.com/artist/" +
      data[0].id +
      "/top?limit=10";

    //calls second fetch from Deezer.com using specific artist ID to eliminate search issues in API
    fetch(fetchDeezerUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "472ab927bbmsh9b52a6734e789bfp1337bajsn4f53ca22608a",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => {
        if (!response.ok) {
          displayError("Something has gone wrong. Error " + response.status);
          return response.status;
        }

        return response.json();
      })
      .then((responseArray) => {
        //gets list of all direct children of container
        var songList = $("#songListContainer").children();

        //clears display from any previous searches and shows table if still hidden
        $(".songName").empty();
        $(".albumName").empty();
        $(".link").empty();
        $("#playlistTable").show();

        //populates each child of songlist with information from fetch from Deezer.com
        songList.each(function (i, val) {
          var songNameEl = $(this).children(":nth-child(1)");
          var albumNameEl = $(this).children(":nth-child(2)");
          var sampleEL = $(this).children(":nth-child(3)");

          $(songNameEl).append(responseArray.data[i].title_short);
          $(albumNameEl).append(responseArray.data[i].album.title);
          $(sampleEL).append(
            '<audio class="song-controller" id="song" controls="controls" volume="0.1"><source src=' +
              responseArray.data[i].preview +
              "></audio>"
          );
        });

        return;
      })
      .catch((err) => {
        console.error(err);

        songList
          .each(function (i, val) {
            var songNameEl = $(this).children(":nth-child(1)");
            var albumNameEl = $(this).children(":nth-child(2)");
            var sampleEL = $(this).children(":nth-child(3)");

            $(songNameEl).append(responseArray.data[i].title_short);
            $(albumNameEl).append(responseArray.data[i].album.title);
            $(sampleEL).append(
              '<audio class="song-controller" id="song" controls="controls" volume="0.1"><source src=' +
                responseArray.data[i].preview +
                "></audio>"
            );
          })
          .catch((err) => {
            console.error(err);
          });
        return;
      });
  }

  //fetches tasteDive api
  function fetchTasteDiveApi(data) {
    var fetchTasteDiveUrl =
      "https://chriscastle.com/proxy/index.php?:proxy:https://tastedive.com/api/similar?q=" +
      data[0].name +
      "&verbose=1&k=420901-rectunes-4A08YANA";

    fetch(fetchTasteDiveUrl)
      .then((response) => {
        if (!response.ok) {
          displayError("Something has gone wrong. Error " + response.status);
          return response.status;
        }

        return response.json();
      })
      .then((responseArray) => {
        //calls function that displays similar artist reccomendations
        displaySuggestions(responseArray.Similar);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //display 5 similar artist reccomendations with link to a youtube.com video
  function displaySuggestions(data) {
    var suggestionList = $("#suggestions").children();

    //clears any information from revious searches
    $(".suggestedArtist").empty();
    $(".suggestedVideo").empty();
    $("#suggestionsContainer").show();

    //populates suggested artist name and video
    suggestionList.each(function (i, val) {
      var bandNameEl = $(this).children(":nth-child(1)");
      var sampleVideoEl = $(this).children(":nth-child(2)");
      var youtubeId = data.Results[i].yUrl.split("d/");
      $(bandNameEl).append(data.Results[i].Name);
      $(sampleVideoEl).append(
        '<a target="_blank" href="https://www.youtube.com/watch?v=' +
          youtubeId[1] +
          '">' +
          "www.youtube.com/" +
          youtubeId[1] +
          "</a>"
      )

      $(bandNameEl).append(data.Results[i].Name);
      $(sampleVideoEl).append(
        "<iframe src=" +
          data.Results[i].yUrl +
          'width="560" height="315" frameborder="0"></iframe>'
      );
    });

    return;
  }

  //displays error message
  function displayError(errorString) {
    $(".modal").addClass("active");
    $("#content").empty();

    console.log("bad");
    $("#modal").addClass("active");
    $("#content").append(errorString);
    return;
  }
});
