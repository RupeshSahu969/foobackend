const mongoose = require('mongoose')


const mongoURL="mongodb://rupeshsahukumar80:Rupeshsahu%401234@ac-yot7qg6-shard-00-00.xkfpezi.mongodb.net:27017,ac-yot7qg6-shard-00-01.xkfpezi.mongodb.net:27017,ac-yot7qg6-shard-00-02.xkfpezi.mongodb.net:27017/gofoodmern?ssl=true&replicaSet=atlas-m8ny4l-shard-0&authSource=admin&retryWrites=true&w=majority"
 
const mongoDB=async()=>{
    await mongoose.connect(mongoURL,{ useNewUrlParser:true },async(err,result) =>{
        if(err) console.log("---",err)
        else{
            console.log("connected")
            const fetched_data=await mongoose.connection.db.collection("food_item")
            fetched_data.find({}).toArray(async function(err,data){
              const foodCategory=await mongoose.connection.db.collection("foodCategory")
              foodCategory.find({}).toArray( function(err,catData){
                if(err) console.log(err);
                else {
                        global.food_item=data
                        global.foodCategory=catData
                        
                     }
              })
                
            })
        }
    })
}

module.exports = mongoDB;
