$(document).ready(function () {
  var searchString = "";

  $("#searchSubmit").click(() => {
    searchString = $(".songName").val();
    fetchArtist(searchString);
  });

  function fetchArtist(searchString) {
    var fetchDeezerUrl =
      "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchString;
    fetch(fetchDeezerUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "472ab927bbmsh9b52a6734e789bfp1337bajsn4f53ca22608a",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => {
        if (!response.ok) {
          alert("Something has gone wrong. Error " + response.status);
          return response.status;
        }
        console.log(response);
        return response.json();
      })
      .then((responseArray) => {
        console.log(responseArray);
        displaySearchedArtist(responseArray.data);
        displayDiscography(responseArray.data);
        fetchTasteDiveApi(responseArray.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function displaySearchedArtist(data) {
    $(".albumCover").empty();
    $(".artistName").empty();
    $(".albumCover").append(
      $("<img>", {
        class: "artistImage",
        src: data[0].artist.picture_xl,
      })
    );
    $(".artistName").append(data[0].artist.name);
    return;
  }

  function displayDiscography(data) {
    var songList = $("#songListContainer").children();
    console.log(songList);
    $(".songName").empty();
    $(".albumName").empty();
    $(".link").empty();
    // $(".songList").show();

    songList.each(function (i, val) {
      console.log(i);
      //   console.log($(this));
      var songNameEl = $(this).children(":nth-child(1)");
      var albumNameEl = $(this).children(":nth-child(2)");
      var sampleEL = $(this).children(":nth-child(3)");

      //   var songTitle = data[i].title_short;
      //   console.log(songTitle);

      $(songNameEl).append(data[i].title_short);
      $(albumNameEl).append(data[i].album.title);
      $(sampleEL).append(
        '<audio class="song-controller" id="song" controls="controls" volume="0.1"><source src=' +
          data[i].preview +
          "></audio>"
      );
    });
    return;
  }

  //fetch tasteDive api
  function fetchTasteDiveApi(data) {
    var fetchTasteDiveUrl =
      "https://chriscastle.com/proxy/index.php?:proxy:https://tastedive.com/api/similar?q=" +
      data[0].artist.name +
      "&verbose=1&k=420901-rectunes-4A08YANA";
    console.log(fetchTasteDiveUrl);

    fetch(fetchTasteDiveUrl)
      .then((response) => {
        if (!response.ok) {
          alert("Something has gone wrong. Error " + response.status);
          return response.status;
        }
        console.log(response);
        return response.json();
      })
      .then((responseArray) => {
        console.log(responseArray);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  //display 5 similar artist reccomendations
  //sample song
});
