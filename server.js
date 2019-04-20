
var express = require("express");
var mongojs = require("mongojs");

var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.get("/", function(req, res) {
  res.send("Hello world");
});

app.get("/all", function(req, res) {

  db.scrapedData.find({}, function(error, found) {

    if (error) {
      console.log(error);
    }
    else {
      res.json(found);
    }
  });
});

app.get("/scrape", function(req, res) {

  axios.get("https://usatoday.com/").then(function(response) {

  var $ = cheerio.load(response.data);

  $("p.hfwmm-primary-image-hed").each(function(i, element) {

    var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");


      if (title && link) {
 
        db.scrapedData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {

            console.log(err);
          }
          else {

            console.log(inserted);
          }
        });
      }
    });
  });

  res.send("Scrape Complete");
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
