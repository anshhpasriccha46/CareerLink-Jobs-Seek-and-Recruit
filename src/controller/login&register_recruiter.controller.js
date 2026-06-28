import { sendEmail } from "../../mail.js";
import Job from "../model/Job.js";
import Recruiter from "../model/Recruiter.js";
import Applicant from "../model/Applicants.js";
import bcrypt from "bcrypt";

export default class login_register_recruiter{
    static getintro(req, res){
        res.render("intro" , {layout: false});

    }
    static getregister(req , res){
        
            res.render('register_recruiter' , {layout:false ,userType: 'recruiter'});
    }
    static async postregister(req, res) {

    req.session.name = req.body.name;
    req.session.email = req.body.email;
const hashedPassword = await bcrypt.hash(req.body.password, 10);

const newRecruiter = await Recruiter.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
});
    req.session.userId = newRecruiter._id;

    const text = "Welcome to CareerLink. Start posting jobs and find the perfect candidates! :)";

    sendEmail(req.body.email, "Registered", text);

    res.redirect("/home_recruiter");
}
static getLogin(req, res) {
        res.render("login", { layout: false, userType: "recruiter" });
    }
    static async postLogin(req, res) {

    const recruiter = await Recruiter.findOne({
        email: req.body.email
    });

    if (!recruiter) {
        return res.send("No account found with this email.");
    }

    const isMatch = await bcrypt.compare(
        req.body.password,
        recruiter.password
    );

    if (!isMatch) {
        return res.send("Incorrect password.");
    }

    req.session.userId = recruiter._id;
    req.session.name = recruiter.name;
    req.session.email = recruiter.email;

    res.redirect("/home_recruiter");
    }
      static async getHome(req, res) {

    const recruiter = await Recruiter.findById(req.session.userId);

    const jobs = await Job.find({
        recruiterId: req.session.userId
    });

    res.locals.styles =
        '<link rel="stylesheet" href="/homepage_recruiter.css">';

    return res.render("homepage_recruiter", {
        layout: "layout_recruiter",
        recruiter,
        jobs
    });
}
        static getAddJob(req, res){
           res.locals.styles = '<link rel="stylesheet" href="/addJob.css">';
           res.render("addJob" , {layout:false});
        }

     static async postJob(req, res) {
        


    await Job.create({

        name: req.session.name,

        email: req.session.email,

        company: req.body.company,

        jobType: req.body.jobType,

        location: req.body.location,

        experience: req.body.experience,

        skills: req.body.skills.split(",").map(skill => skill.trim()),

        logo: {
            data: req.file.buffer,
            contentType: req.file.mimetype
        },

        recruiterId: req.session.userId
    });

    res.redirect("/home_recruiter");
}

       static async editJob(req, res) {

    const job = await Job.findById(req.params.id);

    return res.render("editJob", {
        layout: false,
        job
    });

}

      static async savechanges(req, res) {

    await Job.findByIdAndUpdate(

        req.params.id,

        {

            company: req.body.company,

            jobType: req.body.jobType,

            location: req.body.location,

            experience: req.body.experience,

            skills: req.body.skills
                .split(",")
                .map(skill => skill.trim())

        }

    );

    res.redirect("/home_recruiter");

}
       static async deleteJob(req, res) {

    await Job.findByIdAndDelete(req.params.id);

    res.redirect("/home_recruiter");

}
       static async filterJobsByCompanyOrType(req, res) {

    const jobs = await Job.find({
        recruiterId: req.session.userId
    });

    const searchTerms = req.body.search
        .toLowerCase()
        .split(",")
        .map(term => term.trim())
        .filter(term => term !== "");

    const filteredResults = jobs.filter(job =>

        searchTerms.some(term =>

            job.company.toLowerCase().includes(term) ||

            job.jobType.toLowerCase().includes(term)

        )

    );

    res.locals.styles =
        '<link rel="stylesheet" href="/homepage_recruiter.css">';

    return res.render("homepage_recruiter", {
        layout: "layout_recruiter",
        jobs: filteredResults
    });

}
    

static async viewApplicants(req, res) {

    const applicants = await Applicant.find({
        jobId: req.params.id
    });

    res.locals.styles =
        '<link rel="stylesheet" href="/recruiter_applicants.css">';

    return res.render("recruiter_applicants", {
        layout: "layout_recruiter",
        applicants
    });

}
    
}