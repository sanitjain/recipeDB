const express = require('express');
const bodyParser= require('body-parser');
var fs = require('fs');
var recipes = require('./added_recipes.json');
const REST_PORT = (process.env.PORT || 5000);
const app = express();

function isDefined(obj) {
    if (typeof obj == 'undefined') {
        return false;
    }

    if (!obj) {
        return false;
    }

    return obj != null;
}

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine','ejs');

app.get('/', (req, res) => {
  
    var content = {};
    fs.readFile('added_recipes.json', function read(err, data){
            if(err) {
                return console.error(err);
            } else {
                content=JSON.parse(data);
                res.render('index.ejs', {recipes: content.recipes});
                console.log("Recipes after page load"+JSON.stringify(content));
            }
        });
});

function getNextId(obj) {
    return (Math.max.apply(Math, obj.map(function(o) {
        return o.ID;
    })) + 1);
}

function writeToFile(content,formdata){

            var newRecipes={};
            newRecipes.recipes=[];
            var jsonFileArr = content.recipes;
            formdata.ID = getNextId(jsonFileArr);
            jsonFileArr.push(formdata);
            newRecipes.recipes = jsonFileArr;
            fs.writeFile('added_recipes.json', JSON.stringify(newRecipes), (err)  => { //write all data back to file
                if (err) {
                    return console.log(err);
                } 
                    console.log("Recipe with ID "+formdata.ID+" added to file\n");
                    console.log("New Recipe inside function writeFile"+JSON.stringify(newRecipes));
                
            });
            //console.log("New Recipe File "+newRecipes);
}

app.post('/', (req, res) => {
  
    if(isDefined(req.body.meal_type) && isDefined(req.body.recipe_type)){

        var content = {};

        fs.readFile('added_recipes.json', function read(err, data){
            if(err) {
                throw err;
            } else {

                content=JSON.parse(data);
                console.log("Recipes after reading file before writing"+JSON.stringify(content));
                writeToFile(content,req.body);
                
            }
        });
        res.redirect('/');

        } else {
            res.send("You need to select at least one meal type or recipe type. Click the browser back button to go back");
            res.end();
        }
  
});

app.post('/download', (req, res) => {
  
    //var allRecipes = recipes;

    fs.readFile('added_recipes.json', function read(err, data){
            if(err) {
                throw err;
            } else {

                var filename = 'recipeDB.json';
                var mimetype = 'application/json';
                res.setHeader('Content-Type', mimetype);
                res.setHeader('Content-disposition','attachment; filename='+filename);
                res.send(data);
            }
    });

    
  
});

app.listen(REST_PORT, function() {
  console.log('Server is running');
});