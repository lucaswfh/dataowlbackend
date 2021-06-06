// User operatons, 
class UserAppService {

    // requires User mongoose model 
    constructor(User) {
        this.User = User
    }

    allAdmins(callback) {
        this.allusers((err, users) => {
            if (err) callback(err);
            else {
                const admins = users.filter(u => u.admin).map(u => u.email);
                callback(null, admins);
            }
        });
    }

    createAdmin(access_token, id_token, target_email, callback) {
                    this.findOneByEmail(target_email, (err, target_user) => {
                        if (err) callback(500);
                        else {
                            target_user.admin = true;
                            target_user.save(callback);
                        }
                    });
    }

    // if logging in for first time, save it to database 
    // access_token e.g. "Bearer AUTH0_ACCESS_TOKEN"
    userLogIn(access_token) {
        this.getUserFromAccessToken(access_token, body => {
                this.findOneByEmail(body.email, (err, user) => {
                if (err) console.log(err)
                if (!user) {
                    const usr = this.createUserFromPayload(body)
                    this.save(usr) 
                }
            });
        });
    }

    getUserFromAccessToken(access_token, callback) {
        const request = require('request');
        const options = {
            url: 'https://killscript.auth0.com/userinfo',
            // url: 'https://killscript.auth0.com/api/v2',
            qs: { fields: 'user_metadata', include_fields: 'true' },
            headers: {
                'content-type': 'application/json',
                'authorization': access_token
            }
        };
        request(options, (err, response, body) => {
            if (err) console.log(err)
            const bodyParsed = JSON.parse(body)
            callback(bodyParsed) 
        });
    }

    // finds by email: (String, (err, user) => Unit) => Unit 
    findOneByEmail(email, callback) {
        this.User.findOne({ 'email': email }, callback);
    }

    allusers(callback) {
        this.User.find({ }, { 'email': 1, 'admin': 1 }, callback);
    }

    // Saves user to database
    save(user) {
        user.save((err) => {
            if (err) console.log(err)
        });
    }

    // Creates user from body, asumes data integrity and security 
    // PRECONDICION: body ya esta parseado con JSON.parse 
    createUserFromPayload(body) {
        return new this.User({
            admin: false,
            givenName: body.given_name,
            familyName: body.family_name,
            email: body.email,
            nickname: body.nickname,
            dateCreated: new Date(),
            picture: body.picture, 
            email_verified: body.email_verified, 
            posts: []
        });
    }
}

module.exports = UserAppService;