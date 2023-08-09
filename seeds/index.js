const mongoose = require('mongoose')
const Campground = require('../model/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedDes')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error!, Check Connection'))
db.once('open', () => {
    console.log('Connected to Port 27017')
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const rand1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '648b0b6f9051638efcbb5af2',
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Porro totam temporibus ullam accusantium omnis, nam deserunt maxime laboriosam id blanditiis quae nostrum quod magni deleniti reiciendis exercitationem recusandae numquam impedit.',
            price,
            geometry: {
                type: 'Point', coordinates: [
                    cities[rand1000].longitude,
                    cities[rand1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dlnxtngyz/image/upload/v1690268740/Yelpcamp/mn93vrzc9fwnejd97qam.jpg',
                    filename: 'Yelpcamp/mn93vrzc9fwnejd97qam'
                },
                {
                    url: 'https://res.cloudinary.com/dlnxtngyz/image/upload/v1690268743/Yelpcamp/qyhckpk8j5udbctl2nvz.jpg',
                    filename: 'Yelpcamp/qyhckpk8j5udbctl2nvz'
                }
            ],

        })
        await camp.save()
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})

