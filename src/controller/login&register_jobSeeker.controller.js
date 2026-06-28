import JobSeeker from "../model/JobSeeker.js";
import Job from "../model/Job.js";
import { sendEmail } from "../../mail.js";
import sendUserProfile from "../../mail_profile.js";
import Applicant from "../model/Applicants.js";
import bcrypt from "bcrypt";

export default class login_register_jobSeeker{


    static getintro(req, res){
        res.render("intro" , {layout: false});

    }


    static getregister(req , res){
         
       
          res.render('register_jobSeeker' , {layout: false ,userType: 'jobSeeker'});
    }


    static async postregister(req , res){
        

         req.session.name=req.body.name;
          req.session.email=req.body.email;
          
      

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

const newUser = await JobSeeker.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
});
    req.session.userId = newUser._id;

        const text="Welcome to CareerLink. Lets help you land your dream job:)"
        await sendEmail(req.body.email , "Registered",text);
        console.log("email send for jobseeker registration");

     
        res.redirect('/JobSeeker_profile');


    }

    static async postProfile(req, res){
       
        //Updated
            await JobSeeker.findByIdAndUpdate(

        req.session.userId,

        {

            phone:req.body.phone,

            age:req.body.age,

            experience:req.body.experience,

            profilePicture:{
                data:req.files.profilePic[0].buffer,
                contentType:req.files.profilePic[0].mimetype
            },

            resume:{
                data:req.files.resume[0].buffer,
                contentType:req.files.resume[0].mimetype
            }

        }

    );
    const jobs = await Job.find();

    const profile = await JobSeeker.findById(
        req.session.userId
    );

        
//Get the corrext profile to feed the homepage with
           res.locals.styles = '<link rel="stylesheet" href="/homepage_jobSeeker.css">';
           
        return res.render("homepage_jobSeeker" , {layout: 'layout_jobSeeker' , profile: profile , jobs:jobs});
       
    }
    static getLogin(req, res) {
        res.render("login", { layout: false, userType: "jobSeeker" });
    }
    static async postLogin(req, res) {

    const user = await JobSeeker.findOne({
        email: req.body.email
    });

    if (!user) {
        return res.send("No account found with this email.");
    }

    const isMatch = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if (!isMatch) {
        return res.send("Incorrect password.");
    }

    req.session.userId = user._id;
    req.session.name = user.name;
    req.session.email = user.email;

    res.redirect("/home_jobSeeker");
    }
   static async filterJobs(req, res) {

    let filteredResults = await Job.find();

    const filterJobType = req.body.jobType;
    const filterLocation = req.body.location;
    const filterSkills = req.body.skills;

    // Normalize filter values
    const jobTypeFilter = filterJobType ? filterJobType.toLowerCase().trim() : "";
    const locationFilter = filterLocation ? filterLocation.toLowerCase().trim() : "";
    const skillsFilterArray = filterSkills
        ? filterSkills.toLowerCase().split(",").map(skill => skill.trim()).filter(skill => skill !== "")
        : [];

    // Filter by Job Type
    if (jobTypeFilter) {
        filteredResults = filteredResults.filter(job =>
            job.jobType.toLowerCase().includes(jobTypeFilter)
        );
    }

    // Filter by Location
    if (locationFilter) {
        filteredResults = filteredResults.filter(job =>
            job.location.toLowerCase().includes(locationFilter)
        );
    }

    // Filter by Skills
    if (skillsFilterArray.length > 0) {
        filteredResults = filteredResults.filter(job =>
            skillsFilterArray.every(requiredSkill =>
                job.skills.some(jobSkill =>
                    jobSkill.toLowerCase().includes(requiredSkill)
                )
            )
        );
    }

    const profile = await JobSeeker.findById(req.session.userId);

    res.locals.styles =
        '<link rel="stylesheet" href="/homepage_jobSeeker.css">';

    return res.render("homepage_jobSeeker", {
        layout: "layout_jobSeeker",
        profile,
        jobs: filteredResults
    });
}
static async sendProfile(req, res) {

    const jobId = req.params.id;

    // Logged-in job seeker
    const profile = await JobSeeker.findById(req.session.userId);

    // Job being applied to
    const job = await Job.findById(jobId);

    // Send profile to recruiter
    console.log(profile.profilePicture);
    console.log(profile.resume);
     await sendUserProfile(profile, job.email);

    console.log("Email and profile sent");

    // Save applicant
   await Applicant.create({

    jobId: job._id,

    jobSeekerId: profile._id,

    name: profile.name,

    email: profile.email,

    experience: profile.experience,

    profilePicture: profile.profilePicture

});

    // Reload all jobs
    const jobs = await Job.find();

    res.locals.styles =
        '<link rel="stylesheet" href="/homepage_jobSeeker.css">';

    return res.render("homepage_jobSeeker", {
        layout: "layout_jobSeeker",
        profile,
        jobs,
        successMessage: "Applied Successfully"
    });

}




}