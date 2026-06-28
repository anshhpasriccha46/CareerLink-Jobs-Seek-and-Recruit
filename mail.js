import { Resend } from "resend";



export const sendEmail = async (to, subject, text) => {

    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { data, error } = await resend.emails.send({

            from: "onboarding@resend.dev",

            to,

            subject,

            text

        });

        if (error) {

            console.error("Error sending email:", error);
            return;

        }

        console.log("Email sent:", data);

    } catch (err) {

        console.error("Error sending email:", err);

    }

};