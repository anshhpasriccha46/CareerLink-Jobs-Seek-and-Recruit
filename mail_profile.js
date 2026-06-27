import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ansh.pasricha2005@gmail.com",
        pass: "yvod asje enot swcp"
    }
});

const sendUserProfile = async (user, email) => {

    const mailOptions = {

        from: "ansh.pasricha2005@gmail.com",

        to: email,

        subject: "New User Profile Submission",

        html: `
            <h3>User Profile</h3>

            <p><strong>Name:</strong> ${user.name}</p>

            <p><strong>Email:</strong> ${user.email}</p>

            <p><strong>Phone:</strong> ${user.phone}</p>

            <p><strong>Age:</strong> ${user.age}</p>

            <p><strong>Experience:</strong> ${user.experience} years</p>

            <p>The candidate's profile picture and resume are attached.</p>
        `,

        attachments: [

            {
                filename: "ProfilePicture",

                content: user.profilePicture.data,

                contentType: user.profilePicture.contentType
            },

            {
                filename: "Resume.pdf",

                content: user.resume.data,

                contentType: user.resume.contentType
            }

        ]

    };

    try {

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);

    } catch (error) {

        console.error("Error sending email:", error);

    }

};

export default sendUserProfile;