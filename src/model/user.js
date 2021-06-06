const email = {
    type: String,
    required: true,
    validator: v => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(v).toLowerCase());
    }
};

// Defines Mongoose model for easy saving on MongoDB
// behaviuor funcions can also be put in here 
const modelSetUp = (mongoose) => {
    return {
        'User': mongoose.model('User', new mongoose.Schema({
            admin: {
                type: Boolean,
                required: true 
            },
            givenName: {
                type: String,
                required: true,
                min: 1,
                max: 200
            },
            familyName: {
                type: String,
                required: true,
                min: 1,
                max: 200
            },
            email: email,
            nickname: {
                type: String,
                required: true,
                min: 1,
                max: 200
            },
            dateCreated: {
                type: Date,
                required: true
            }, 
            picture: String,
            email_verified: {
                type: Boolean,
                required: true
            }, 
            posts: [{
                checked: {
                    type: Boolean,
                    required: true 
                },
                type: {
                    type: String,
                    required: true,
                    min: 1,
                    max: 200
                },
                geolocation: { 
                    lat: {
                        type: String,
                    }, 
                    lng: {
                        type: String,
                    } 
                },
                _imageIds: [String],
                comments: [{
                    nickname: {
                        type: String,
                        required: true,
                        min: 1,
                        max: 200
                    },
                    comment: {
                        type: String,
                        required: true,
                        min: 10,
                        max: 500
                    },
                    date: {
                        type: String,
                        required: true 
                    }
                }]
            }]
        })),
        'Image': mongoose.model('Image', new mongoose.Schema({
            image: {
                type: String,
                required: true
            },
            email
        })),
        'PlantType': mongoose.model('PlantType', new mongoose.Schema({
            plantType: {
                type: String,
                required: true 
            }
        }))
    }
};

module.exports = modelSetUp; 