var mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/registration", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Connection to database successful!!");
}).catch((e) => {
    console.log("Connection to database unsuccessful!!");
});