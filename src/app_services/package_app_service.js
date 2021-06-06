const moment = require('moment-timezone');

// package operations 
class PackageAppService {
    // requires User and Image mongoose model 
    constructor(User, Image, PlantType, userAppService) {
        this.User = User;
        this.Image = Image;
        this.PlantType = PlantType;
        this.userAppService = userAppService;
    }

    findImageById(_id, callback) {
        this.Image.findOne({ '_id': _id }, callback); 
    }

    deletePostImages(post, callback) {
        this.Image.deleteMany({ '_id': { '$in': post._imageIds } }, callback);
    }

    deletePost(imageid, callback) {
        const fun = (post, usr) => {
            const index = usr.posts.indexOf(post);
            if (index > -1) {
                this.deletePostImages(usr.posts.splice(index, 1)[0], err => {});
            }
        };
        const cb = (err) => {
            callback(err);
        };
        this.updatePostByImageIdAndCallbackIt(imageid, fun, cb);
    }

    getPlantTypes(callback) {
        this.PlantType.find(callback);
    }

    flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }

    // retrieves all posts from all users 
    // TODO: refactor, its eager! 
    getAllPosts(callback) {
        this.User.find((err, users) => {
            if (err) callback(err);
            else {
                const ret = users.map(u => u.posts.map(p => {
                    return {
                        'email': u.email,
                        '_imageId': p._imageIds[0],
                        'checked': p.checked
                    };
                }));
                callback(
                    null,
                    (function flatten(arr) {
                        return arr.reduce(function (flat, toFlatten) {
                          return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
                        }, []);
                    })(ret)
                );
            }
        });
    }

    // retrieves all images from all users 
    // TODO: refactor, its eager! 
    getAll(callback) {
        this.Image.find(callback)
    }

    createPlant(access_token, plant, callback) {
                    // modify 
                    const nplant = new this.PlantType({
                        plantType: plant
                    });
                    nplant.save(callback);
    }

    deletePlant(access_token, plantType, callback) {
                    // modify 
                    this.PlantType.deleteMany({ 'plantType': plantType }, callback);
    }

    // retrieves a post by image id 
    getPostByImageId(_id, callback) {
        this.findImageById(_id, (err, image) => {
            if (err) callback(err); 
            else {
                this.userAppService.findOneByEmail(image.email, (err, user) => {
                    if (err) callback(err); 
                    else {
                        const ret = user.posts.find(post => post._imageIds.indexOf(_id) > -1);
                        if (!ret) callback(404);
                        else {
                            ret._id = undefined;
                            callback(null, ret); 
                        }
                    };
                });
            }
        });
    }

    updatePostByImageIdAndCallbackIt(imageid, fun, callback) {
        this.User.findOne({ 'posts': { '$elemMatch': { '_imageIds': imageid } } }, (err, usr) => {
            if (err) callback(err);
            else {
                // usr.posts.forEach(post => {
                //     if (post._imageIds.indexOf(imageid) > -1) {
                //         fun(post);
                //     }
                // });
                for (let post of usr.posts) {
                    if (post._imageIds.indexOf(imageid) > -1) {
                        if (fun.length == 1) { 
                            fun(post);
                        }
                        else if (fun.length == 2) {
                            fun(post, usr);
                            break;
                        }
                    }
                }
                usr.save(err => {
                    if (err) callback(err);
                    else if (fun.length == 1) this.getPostByImageId(imageid, callback);
                    else if (fun.length == 2) callback(err);
                });
            }
        });
    }

    updateType(imageid, newtype, email, callback) {
        // ---- funcion vieja que funcionaba antes del refactor (x si las moscas)
        // this.User.findOne({ 'posts': { '$elemMatch': { '_imageIds': imageid } } }, (err, usr) => {
        //     usr.posts.forEach(post => {
        //         if (post._imageIds.indexOf(imageid) > -1) {
        //             post.type = newtype;
        //         }
        //     });
        //     usr.save(err => {
        //         if (err) callback(err);
        //         else this.getPostByImageId(imageid, callback);
        //     });
        // });
        // ----

        const fun = post => { 
            post.checked = true;
            const ntype = (newtype == 'Select Type...' ? undefined : newtype) || post.type;
            const date = moment().tz('America/Buenos_Aires').format('MMMM Do YYYY, HH:mm');
            post.comments.push({
                'nickname': email,
                'comment': ntype,
                'date': date
            });
        };
        this.updatePostByImageIdAndCallbackIt(imageid, fun, callback);
    }

    setChecked(imageid, email, callback) {
        const fun = post => { 
            post.checked = true 
            const date = moment().tz('America/Buenos_Aires').format('MMMM Do YYYY, HH:mm');
            post.comments.push({
                'nickname': email,
                'comment': post.type,
                'date': date
            });
        };
        this.updatePostByImageIdAndCallbackIt(imageid, fun, callback);
    }

    upload(post, access_token, callback) {
        this.userAppService.getUserFromAccessToken(access_token, body => {
            const email = body.email 
            const arr = post.images.map(img => {
                return {
                    image: img,
                    email: email 
                };
            });
            this.Image.insertMany(arr, (err, savedImages) => {
                if (err) callback(err) 
                else {
                    this.User.where({ 'email': email }).updateOne({ $push: {
                        posts: {
                            'type': post.type,
                            'geolocation': { 'lat': post.lat, 'lng': post.lng },
                            '_imageIds': savedImages.map(si => si._id),
                            'comments': [],
                            'checked': false
                        }
                    } }, (err) => {
                        callback(err); 
                    });
                }
            });
        });
    }
}

module.exports = PackageAppService;