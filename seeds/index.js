const mongoose=require('mongoose');
const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
const Campground = require('../models/campground');
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelpcamp');
    console.log("connection open");
}
const sample=array=>array[Math.floor(Math.random()*array.length)];
const seedDB=async()=>{
    await Campground.deleteMany({});
    // for(let i=0;i<50;i++){
    //     const random1000=Math.floor(Math.random()*1000);
    //     const price=Math.floor(Math.random()*100)+10;
    //     const camp=new Campground({
    //         author:'6257db4d317a6677143da2c3',
    //         location:`${cities[random1000].city},${cities[random1000].state}`,
    //         title:`${sample(descriptors)} ${sample(places)}`,
    //         description:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid necessitatibus magni non et perferendis molestiae architecto unde cumque rem. Voluptates accusantium reiciendis pariatur veniam iusto expedita placeat eligendi cum distinctio!`,
    //         price:price,
    //         images:[
    //             {
    //                 url: 'https://res.cloudinary.com/dbub9n729/image/upload/v1650090856/YelpCamp/rvipo1xh0rdxsvbdpxqr.png',
    //                 filename: 'YelpCamp/rvipo1xh0rdxsvbdpxqr',
    //               },
    //               {
    //                 url: 'https://res.cloudinary.com/dbub9n729/image/upload/v1650090859/YelpCamp/e9oflb7jeoweiau0dhes.png',
    //                 filename: 'YelpCamp/e9oflb7jeoweiau0dhes',
    //               },
    //               {
    //                 url: 'https://res.cloudinary.com/dbub9n729/image/upload/v1650090875/YelpCamp/efhisdgcom3dpfqxf5il.jpg',
    //                 filename: 'YelpCamp/efhisdgcom3dpfqxf5il',
    //               }
    //         ]
    //     })
        // await camp.save();
        // console.log(camp);
    // }
}

seedDB().then(()=>{
    mongoose.connection.close();
});