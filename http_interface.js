// Sets up app (express app) http interface 
const httpInterfaceSetup = (app, packageAppService, userAppService) => {

    // const jwtAuthz = require('express-jwt-authz');
    // const adminScope = jwtAuthz([ 'admin:actions' ]);

    // TEST
    app.get('/private/endpoint', (req, res) => {
        res.send('Hello from a private endpoint!');
    });

    // GET, all admins
    app.get('/alladmins', (req, res) => {
        userAppService.allAdmins((err, admins) => {
            if (err) res.sendStatus(500);
            else res.send(admins);
        });
    });

    // DEPRECATED AND EAGER, DO NOT UNCOMMENT!
    // GET, returns all images 
    // app.get('/allimages', (req, res) => {
    //     packageAppService.getAll((err, images) => {
    //         if (err) console.log(err);
    //         else res.send(images); 
    //     });
    // });

    // GET, all users 
    app.get('/user/allusers', (req, res) => {
        userAppService.allusers((err, users) => {
            if (err) res.sendStatus(500);
            else res.send(users);
        });
    });

    // GET, returns all posts 
    app.get('/allposts', (req, res) => {
        packageAppService.getAllPosts((err, posts) => {
            if (err) console.log(err);
            else res.send(posts);
        });
    });

    // GET, returns all plant types 
    app.get('/planttypes', (req, res) => {
        packageAppService.getPlantTypes((err, types) => {
            if (err) console.log(err);
            else { res.setHeader('Content-Type', 'application/json'); res.send(types.map(t => t.plantType)); }
        });
    });

    // GET, post by id 
    app.get('/post/:postId', (req, res) => {
        const id = req.params.postId;
        res.setHeader('Content-Type', 'application/json');
        packageAppService.getPostByImageId(id, (err, post) => {
            if (err) res.sendStatus(500);
            else res.send(JSON.stringify(post));
        });
    });

    // GET, user by email 
    app.get('/user/:email', (req, res) => {
        const email = req.params.email;
        userAppService.findOneByEmail(email, (err, user) => {
            res.send(user);
        });
    });

    // GET, gets image by id 
    app.get('/post/image/:imageId', (req, res) => {
        const imageId = req.params.imageId;
        packageAppService.findImageById(imageId, (err, image) => {
            res.send(image);
        });
    });

    // PUT, creates admin 
    app.put('/private/cradmin'/*, adminScope*/,  (req, res) => {
        const access_token = req.body.access_token;
        const target_email = req.body.target_email;
        userAppService.createAdmin(access_token, "id_token", target_email, err => {
            res.sendStatus(err || 200);
        });
    });

    // POST, creates plant
    app.post('/private/crplant'/*, adminScope*/, (req, res) => {
        const access_token = req.body.access_token;
        const plant = req.body.plant;
        packageAppService.createPlant(access_token, plant, err => {
            res.sendStatus(err || 200);
        });
    });

    // DELETE, deteles plant 
    app.delete('/private/plant/:plantType'/*, adminScope*/, (req, res) => {
        const access_token = req.body.access_token;
        const plantType = req.params.plantType;
        packageAppService.deletePlant(access_token, plantType, err => {
            res.sendStatus(err || 200);
        });
    });

    // PUT, sets post checked to true 
    app.put('/private/post/setchecked', (req, res) => { 
        const imageid = req.body.imageid;
        const email = body.email;
        packageAppService.setChecked(imageid, email, (err, pots) => {
            if (err) res.sendStatus(500);
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(pots);
            }
        })
    });

    // PUT, updates post type
    app.put('/private/post/updatetype', (req, res) => {
        const body = req.body;
        const imageid = body.imageid;
        const newtype = body.newtype; 
        const email = body.email;
        packageAppService.updateType(imageid, newtype, email, (err, pots) => {
            if (err) {res.sendStatus(500);console.log(err);}
            else {
                res.setHeader('Content-Type', 'application/json');
                res.send(pots);
            }
        });
    });
    
    // POST, logs user in 
    app.post('/private/userlogin', (req, res) => {
        userAppService.userLogIn(req.headers.authorization);
        res.sendStatus(200);
    });
    
    // POST, uploads a package 
    app.post('/private/uploadpackage', (req, res) => {
        packageAppService.upload(req.body, req.headers.authorization, (err) => {
            if (err) {
                res.sendStatus(400)
            } else {
                res.sendStatus(200) 
            }
        });
    });

    // DELETE, deletes a package 
    app.delete('/private/post/:imageid', (req, res) => {
        const imageid = req.params.imageid;
        packageAppService.deletePost(imageid, (err) => {
            if (err) { 
                console.log(err);
                res.sendStatus(304); // not modified 
            }
            else {
                res.sendStatus(200); // ok
            }
        });
    });

}

module.exports = httpInterfaceSetup;