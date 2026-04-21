const express=require("express")
const app=express()
const mongoose=require("mongoose")
const path=require("path")
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate")
const wrapAsync=require("./utils/wrapAync")
const listingroutes=require("./routes/listing")
const userroutes=require("./routes/user")
const reviewroutes=require("./routes/review")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
const User=require("./models/user.js")


app.use(methodOverride("_method"))
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate)
app.use(express.json());
app.use(express.static(path.join(__dirname,"/public")))


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))

const sessionOptions={
    secret:"mysupersecretkey",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}
app.use(session(sessionOptions));
app.use(flash())

//middlewares for the passport 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

//connecting the mongoose 
const MONGO_URL="mongodb+srv://nadeemahmedmohammad7_db_user:jLBSCOOZn7kUGCzV@cluster0.2phrxdg.mongodb.net/"
async function main(){
   await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Connected to the db ")

}).catch(err=>{
    console.log(err)
})

app.use("/listings",listingroutes)
app.use("/user",userroutes)
app.use("/listings/:id/reviews",reviewroutes,)

app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong "} = err
    res.render("./listings/error.ejs",{err})
    // res.status(statuscode).send(message)
})


app.listen(8080,(req,res)=>{
    console.log("app started to port no 8080");
})