const express= require("express");
const bodyParser = require("body-parser");

const mongoose= require("mongoose");


const app=express();
var items = ["buy food","cook food","eat food"];
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-Akshat:Akshatsinha2000@cluster0.dq8nn9e.mongodb.net/ItemDB",{useNewUrlParser:true});

const itemschema = new mongoose.Schema({
    name: String
});

const Item= mongoose.model("Item",itemschema);

const item1=new Item({
    name: "akshat"
});
const item2=new Item({
    name: "mukut"
});
const item3=new Item({
    name: "arman"
});

const defaultItem=[item1,item2,item3];

const listSchema = {
    name: String,
    items: [itemschema]
};

const List = mongoose.model("List",listSchema);


app.get("/",function(req,res){
    
    Item.find(function(err,founditems){
        if(founditems.length === 0){
            Item.insertMany(defaultItem, function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("succes");
                }
            });
            res.redirect("/");
        }else{

            res.render("list",{kindOfday:"Today", newitemname: founditems});
        }
      
    })

});

app.post("/",function(req,res){
    const items=req.body.newItem;
    const listName=req.body.button;
    const item = new Item({
        name: items
    });

    if(listName==="Today"){
        item.save();
        res.redirect("/");

    }else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" +listName);
        });
    }
});

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
            console.log("success");
            res.redirect("/");
        }
    });
});

app.get("/:customListName", function(req, res){
    const customListName= req.params.customListName;

    List.findOne({name: customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list=new List({
                    name: customListName,
                    items: defaultItem
                });
                list.save();
                res.redirect("/"+ customListName);
            }else{
                res.render("list",{kindOfday: foundList.name, newitemname: foundList.items})
            }
        }
    });

  
    
});

app.listen(3000,function(){
    console.log("server 3000 running");
});