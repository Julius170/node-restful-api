
const express = require('express');
const bodyParser = requires('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended:true }));

app.use(express.static('public'));
mongoose.connect('mongodb"//localhost:27017/wikiDB');

const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model('Article', "articleSchema");

// //////Requst targeting all articles

app.routes("/articles")
    .get(function(req, res){
        Article.find({}, function(err, found){
            if (err) {
                console.log(err);
                res.send(err);
            }else{
                console.log(found);
                res.send(found);
            }
        });
    })

    .post(function(req, res) {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
            
        });
        newArticle.save(function(err){
            if (err) {
                res.send(err);
            }else{
                res.send("Successfully added a new article")
            }
        });
    })
    
    .delete(function(req, res){
        Article.deleteMany({}, function(err){
            if(!err){
                res.send("Successfully deleted all articles.");
            }else{
                res.send(err)
            }
    });    
});
// make the post requests through Postman
   



// //////Requst targeting a specific articles
app.routes('/articles/:articleTitle')
    .get(function(req, res){
            Article.findOne({title: req.params.articleTitle}, function(err, found){
                if(err){
                    res.send("No article matching that title was found.")
                }else{
                    res.send(found)
                }
            })
        })
    .put(function(req, res){
        Article.update(
            {title: req.params.articleTitle},
            {title:req.body.title, content:req.body.content},
            {overwrite:true}, 
            function(err){
                if(!err){
                    res.denc("Successfully updated article.")
                }
            }
        )
    })
    .patch(function(req, res){
        Article.update(
            {title:req.params.articleTitle},
            {$set: req.body},
            function(err) {
                if(!err){
                    res.send("Successully updated article.")
                }else {
                    res.send(err)
                }
            }
        )
    })
    .delete(function(req, res){
        Article.deleteOne(
            {title:req.params.articleTitle},
            function(err){
                if (!err){
                    res.send("Successfully deleted the corresponding articles.");
                }else{
                    res.send(err);
                }
            }
        )
    });


app.listen(3002, function(){
    console.log("app is successfully running on port http//localhost:3002/")
});


