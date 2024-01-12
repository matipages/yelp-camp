const mongoose = require('mongoose');
const Campground = require('./models/campground');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Database Conected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const seedDB = async() =>{
    await Campground.deleteMany({});
    const c = new Campground({title: 'purple field'});
    c.save();
}