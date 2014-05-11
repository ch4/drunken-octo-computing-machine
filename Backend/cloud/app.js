
// These two lines are required to initialize Express in Cloud Code.
var express = require('express');
var Buffer = require('buffer').Buffer;
var app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get('/api', function (req, res) {
    res.end('{"success" : "true"}');
    //res.render('hello', { message: req.body.id });

});

app.post('/api', function (req, res) {
    res.end('{"success" : "true"}');
    //res.render('hello', { message: req.body.id });

});

app.post('/createUser', function (req, res) {
    var user = new Parse.User();
    user.set("username", req.body.username);
    user.set("password", req.body.password);
    //user.set("email", "email@example.com");

    //// other fields can be set just like with Parse.Object
    //user.set("phone", "415-392-0202");

    user.signUp(null, {
        success: function (user) {
            // Hooray! Let them use the app now.
            console.log("New user created: " + user);
            res.end('{"success" : "true"}');
        },
        error: function (user, error) {
            // Show the error message somewhere and let the user try again.
            alert("Error creating new user: " + error.code + " " + error.message);
            res.end('{"success" : "false"}');
        }
    });

    //res.end('{"success" : ' + req.body.username + '}');
    //res.end('{"success" : "true"}');
});

app.post('/authenticateUser', function (req, res) {

    Parse.User.logIn(req.body.username, req.body.password, {
        success: function (user) {
            // Do stuff after successful login.
            console.log("User logged in: " + user);
            res.end('{"success" : "true"}');
        },
        error: function (user, error) {
            // The login failed. Check error to see why.
            alert("Error logging in: " + error.code + " " + error.message);
            res.end('{"success" : "false"}');
        }
    });

    //res.end('{"success" : "true"}');
    //res.render('hello', { message: req.body.id });

});

//createApp(name, description, BINARY) -> Uploads binary to database
app.post('/createApp', function (req, res) {

    var AppItem = Parse.Object.extend("Apps");
    var appItem = new AppItem();

    appItem.set("name", req.body.name);
    appItem.set("description", req.body.description);
    appItem.set("binary", req.body.binary);

    appItem.save(null, {
        success: function (appItem) {
            // Execute any logic that should take place after the object is saved.
            console.log('New object created with objectId: ' + appItem.id);
            res.end('{"success" : "true"}');
        },
        error: function (appItem, error) {
            // Execute any logic that should take place if the save fails.
            // error is a Parse.Error with an error code and description.
            console.log('Failed to create new object, with error code: ' + error.description);
            res.end('{"success" : "false"}');
        }
    });
    //res.render('hello', { message: req.body.id });

});

//listApps() -> JSON responses of app
app.get('/listApps', function (req, res) {
    var AppItem = Parse.Object.extend("Apps");
    var query = new Parse.Query(AppItem);
    query.find({
        success: function (appList) {
            // The object was retrieved successfully.
            var list = [];
            
            function pushArrayElements(element, index, array) {
                //console.log("a[" + index + "] = " + element);
                var listitem = {};
                listitem['name'] = element.get('name');
                listitem['description'] = element.get('description');
                listitem['binary'] = element.get('binary');
                list.push(listitem);
            }
            appList.forEach(pushArrayElements);
            
            if (list.length == appList.length) {
                res.end(JSON.stringify(list));
            }
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            res.end('{"success" : "false"}');
        }
    });
    
    //res.render('hello', { message: req.body.id });

});

//uploadApp(username,password,name) -> Uploads app to device and starts running it
app.post('/uploadRunningApp', function (req, res) {

    var UserItem = Parse.Object.extend("User");
    var query = new Parse.Query(UserItem);

    query.equalTo("username", req.body.username);
    query.find({
        success: function (userList) {
            // The object was retrieved successfully.
            var user = userList[0];
            
            user.set("app", req.body.name);
            user.save(null,{
                success: function (appList) {
                    res.end('{"success" : "true"}');
                },
                error: function (object, error) {
                    // The object was not retrieved successfully.
                    // error is a Parse.Error with an error code and description.
                    res.end('{"success" : "false"}');
                },
                useMasterKey : true
            });
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            res.end('{"success" : "false"}');
        },
        useMasterKey: true
    });

});

//queryRunningApp(username,password) -> Used by the device to figure out to run
app.post('/queryRunningApp', function (req, res) {

    var UserItem = Parse.Object.extend("User");
    var query = new Parse.Query(UserItem);

    query.equalTo("username", req.body.username);
    query.find({
        success: function (userList) {
            // The object was retrieved successfully.
            var user = userList[0];

            res.end('{"app" : "' + user.get("app") + '"}');
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            res.end('{"success" : "false"}');
        },
        useMasterKey: true
    });

});

//getBinary(name)
app.get('/getBinary', function (req, res) {
    var AppItem = Parse.Object.extend("Apps");
    var query = new Parse.Query(AppItem);

    query.equalTo("name", req.body.name);
    query.find({
        success: function (appList) {
            // The object was retrieved successfully.
            var list = [];

            function pushArrayElements(element, index, array) {
                //console.log("a[" + index + "] = " + element);
                var listitem = {};
                listitem['name'] = element.get('name');
                listitem['description'] = element.get('description');
                listitem['binary'] = element.get('binary');
                list.push(listitem);
            }
            appList.forEach(pushArrayElements);

            if (list.length == appList.length) {
                res.end(JSON.stringify(appList[0]));
            }
        },
        error: function (object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and description.
            res.end('{"success" : "false"}');
        }
    });

    //res.render('hello', { message: req.body.id });

});
// // Example reading from the request query string of an HTTP get request.
// app.get('/test', function(req, res) {
//   // GET http://example.parseapp.com/test?message=hello
//   res.send(req.query.message);
// });

// // Example reading from the request body of an HTTP post request.
// app.post('/test', function(req, res) {
//   // POST http://example.parseapp.com/test (with request body "message=hello")
//   res.send(req.body.message);
// });

// Attach the Express app to Cloud Code.
app.listen();
