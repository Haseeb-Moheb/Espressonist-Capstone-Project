//* Dependencies
const mongoose = require('mongoose');
const url = 'wv4zjxc';
const database = 'Expressonist';
const userName = process.env.DBUSERNAME;
const password = process.env.DBPASSWORD;

const db = async () => {
    try {
        // Remove warning for depreciated features
        mongoose.set('strictQuery', true);
    
        await mongoose.connect(`mongoose+srv://${userName}:${password}@atlascluster.${url}.mongodb.net/${database}`, {
            // Remove mongoose dependency warnings
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    
        console.log(`Database Connected: mongodb+srv://...@atlascluster.${url}.mongodb.net/${database}`);
    } catch (err) {
        throw new Error(err);
    };
};

module.exports = { db, mongoose };