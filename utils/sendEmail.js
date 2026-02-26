import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config()

const sendEmail = async(options) =>{
    try {
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            form: `"Task Manager" <${process.env.EMAIL_USER}>`,
            to:options.email,
            subject:options.subject,
            html:options.message
        };

        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.log("Send Email Error: ", error);
        res.status(500).json({message:"Server Error"})
        
    }
}

export default sendEmail;