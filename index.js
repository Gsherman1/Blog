//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");

const homeStartingContent = "This is the home page.";
const aboutContent = "This is the home page.";
const contactContent = "This is the home page.";

const weatherContent = "This is the weather page.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/weather", function(req, res){
  res.render("weather", {weatherContent: weatherContent});
});



app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res) {
    
var city = String(req.body.cityInput);;
console.log(req.body.cityInput);
    
const units = "imperial";
const apiKey = "daff48f4973b01c5b2f0a2c732afafc2";
const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + units + "&APPID=" + apiKey;
    
https.get(url, function(response){
console.log(response.statusCode);
        
response.on("data", function(data){
const weatherData = JSON.parse(data);
const temp = weatherData.main.temp;
const wind = weatherData.wind.speed;
const humidity = weatherData.main.humidity;
const city = weatherData.name;
const weatherDescription = weatherData.weather[0].description;
const icon = weatherData.weather[0].icon;
const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

res.write("<h1> The weather is " + weatherDescription + "<h1>");
res.write("<h2>The Wind Speed in " + city + " is " + wind + "mph" + "<h2>");
res.write("<h2>The humidity is  " + humidity + "%" + "<h2>");
res.write("<h2>The Temp is  " + temp + " Degrees F" + "<h2>");
res.write("<img src=" + imageURL +">");
res.send();
});
});
})


app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

// need to write out an app.get function that open a route /weather Need an EJS view called weather.ejs that displays one text field to input city name
//This EJS view will input a city name from user
// Then need to write out an app.get function that will use the city name to query the Weather API to retrieve basic weather information - temperature, description and humidity
// The display of the weather information must be saved to an array and then the results of the array must be pushed to the /weather EJS view to display
// The /weather route and page created by weather.ejs page should allow for the input of the city name, and the display of the weather for the city - temperature in F, description and humidity

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
