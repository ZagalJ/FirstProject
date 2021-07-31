$(document).ready(function () {
  var searchString = "";

  $("#searchSubmit").click(() => {
    searchString = $("#searchText").val();
    test();
  });

  function test() {
    var fetchUrl =
      "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + searchString;

    fetch(fetchUrl, {
      method: "GET",
      headers: {
        "x-rapidapi-key": "472ab927bbmsh9b52a6734e789bfp1337bajsn4f53ca22608a",
        "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
      },
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  fetch("https://deezerdevs-deezer.p.rapidapi.com/artist/tool", {
    method: "GET",
    headers: {
      "x-rapidapi-key": "472ab927bbmsh9b52a6734e789bfp1337bajsn4f53ca22608a",
      "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
    },
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
});
