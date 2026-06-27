import express from 'express';
import ejsLayouts from 'express-ejs-layouts';
import path from 'path';
import login_register_jobSeeker from './src/controller/login&register_jobSeeker.controller.js';
import login_register_recruiter from './src/controller/login&register_recruiter.controller.js';
import session from 'express-session';
import { auth } from './src/middleware/auth.js';
import { uploadFile } from './src/middleware/image-upload.middleware.js';
import user_profile from './src/model/jobSeeker_profile.js';
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();
const server= express();
connectDB();

//parse form data
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(express.static('public'));

//setup view engine settings
server.set('view engine', 'ejs');
server.set("views", path.join(path.resolve(),"src","views")); 


//Using express-ejs-layouts
server.use(ejsLayouts);

//sessions
server.use(session({
  secret: `SecretKey`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));



server.get("/" , login_register_jobSeeker.getintro);
server.get('/register_jobSeeker' , login_register_jobSeeker.getregister);
server.get("/register_recruiter" , login_register_recruiter.getregister);
server.post("/register_jobSeeker", login_register_jobSeeker.postregister);
server.post("/register_recruiter", login_register_recruiter.postregister);
server.get("/home_recruiter" ,auth , login_register_recruiter.getHome);
server.get("/addjob" ,auth , login_register_recruiter.getAddJob);
server.post("/post-job" ,auth , login_register_recruiter.postJob );
server.get("/editJob/:id" , login_register_recruiter.editJob);
server.post("/editJob/:id" , login_register_recruiter.savechanges);
server.post("/deleteJob/:id" , login_register_recruiter.deleteJob);

server.get('/JobSeeker_profile', (req, res) => {
  res.render('JobSeeker_profile' , {layout:false});
});
server.post(
  "/profile_upload",auth,
  uploadFile.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  login_register_jobSeeker.postProfile
);
server.get("/home_jobSeeker" ,auth,  (req, res) => {
 res.locals.styles = '<link rel="stylesheet" href="/homepage_jobSeeker.css">';
            const profile = user_profile.getProfilesByEmail(req.session.email);
         return res.render("homepage_jobSeeker" , {layout: 'layout_jobSeeker' , profile: profile , jobs:filteredResults});
        
} );
server.post("/filterByParameters" , auth , login_register_jobSeeker.filterJobs);
server.post("/filterJobs_recruiter" ,auth, login_register_recruiter.filterJobsByCompanyOrType);
server.get("/apply_for_job/:id" , auth , login_register_jobSeeker.sendProfile);
server.get("/applicants/:id" , auth , login_register_jobSeeker.viewApplicants);


server.listen(4600 ,  () => {
  console.log('Server is running on http://localhost:4600');
});
