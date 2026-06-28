import { Resend } from "resend";



const sendUserProfile = async (user, email) => {

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({

            from: "onboarding@resend.dev",

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
        filename: "ProfilePicture.jpg",
        content: Buffer.from(user.profilePicture.data).toString("base64")
    },
    {
        filename: "Resume.pdf",
        content: Buffer.from(user.resume.data).toString("base64")
    }
]

        });

        if (error) {
            console.error(error);
            return;
        }

        console.log("Email sent:", data);

    } catch (err) {

        console.error("Error sending email:", err);

    }

};

export default sendUserProfile;