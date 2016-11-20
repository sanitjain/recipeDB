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
  
    res.render('index.ejs', {recipes: recipes.recipes});
  
});

app.post('/addrecipe', (req, res) => {
  
    if(isDefined(req.body.meal_type) && isDefined(req.body.meal_type)){

    function getNextId(obj) {
        return (Math.max.apply(Math, obj.map(function(o) {
        return o.ID;
        })) + 1);
    }
    
    var newRecipes={};
    var newID = 0;
    newRecipes.recipes=[];
    var jsonFileArr = recipes.recipes; // Get recipes from recipes.json
    var newID = getNextId(jsonFileArr); //Find next ID
    var updateData = req.body;
    updateData.ID = newID; //add key ID with value newID
    jsonFileArr.push(updateData);
    newRecipes.recipes = jsonFileArr;
    var jsonRecipes = JSON.stringify(newRecipes);

    fs.writeFile('added_recipes.json', jsonRecipes, (err)  => {
        if (err) {
            return console.log(err);

        }
        console.log("Recipe with ID "+newID+" added to file");
        //dialog.info("Recipe with ID "+newID+" added to file");
    });

    //res.send("Recipe with ID "+newID+" added to file");

    res.redirect('back');

} else {
    res.send("You need to select at least one meal type or recipe type");
    res.end();
}
  
});

app.listen(3000, function() {
  console.log('listening on 3000');
});