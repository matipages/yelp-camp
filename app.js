const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Database Conected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}



//-----------
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req,res)=> {
    res.render('home');
})

app.get('/makecampground', async (req, res)=> {
    const camp  =  new Campground({title: 'My Backyard', description: 'cheap camping'});
    await camp.save();
    res.send(camp);
})

app.listen(3000, ()=> {
    console.log("Listening on PORT 3000");
})