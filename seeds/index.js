const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
  console.log("Database Conected")

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) +10;
        const camp = new Campground({
            author: '65df4b1cbe1bfc47b350a05b',
            location: `${cities[random].city}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/random/?camping',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis laborum pariatur dolorem cupiditate ab praesentium debitis explicabo dicta vero illum, sunt dolore unde officia ut molestiae fugit mollitia? Maiores, voluptatem.',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})