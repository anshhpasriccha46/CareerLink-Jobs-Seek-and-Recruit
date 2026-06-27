import user_jobSeeker from "../model/user_jobSeeker.model.js";
import JobSeeker from "../model/JobSeeker.js";
import Job from "../model/Job.js";
import { sendEmail } from "../../mail.js";
import recruiter_jobData from "../model/recruiter_jobPostData.model.js";
import user_profile from "../model/jobSeeker_profile.js";
import sendUserProfile from "../../mail_profile.js";
import applicant from "../model/recruiter_applicants.js";

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
          
      

            const newUser  = await JobSeeker.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    req.session.userId = newUser._id;

        const text="Welcome to CareerLink. Lets help you land your dream job:)"
        sendEmail(req.body.email , "Registered",text);
        

     
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
static sendProfile(req , res){
    const id=req.params.id;
    console.log("*************GOT id" , id);
    const profile=user_profile.getProfilesByEmail(req.session.email);
    const recruiter_email=recruiter_jobData.getJobById(id).email;
    
    sendUserProfile(profile , recruiter_email);
    console.log("Email and profile sent");
    
    applicant.addApplicant(profile.profilePic , req.session.name , req.session.email , profile.experience ,id);
console.log(profile.profilePic);
    const job = recruiter_jobData.getData();
    
     res.locals.styles = '<link rel="stylesheet" href="/homepage_jobSeeker.css">';
        return res.render("homepage_jobSeeker" , {
        layout: 'layout_jobSeeker',
        profile,
        jobs: job,
        successMessage: "Applied Successfully"
    });
}
static viewApplicants(req, res){
    const id=req.params.id;
    const allapps=applicant.getData();

   const apps=allapps.filter(function(aaps){
        return aaps.id === id;
    })

    res.locals.styles = '<link rel="stylesheet" href="/recruiter_applicants.css">';
    return res.render("recruiter_applicants" , {layout:'layout_recruiter' , applicants:apps});

}



}