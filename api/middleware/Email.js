
import { transporter } from './email.config.js';


export const SendVerificationCode = async (email, verficationCode) => {
    try {
         const response = await transporter.sendMail({
                    from: '"Engineering Reference" <engineeringreference7@gmail.com>', 
                    to: email, 
                    subject: "Email Verification Code", 
                    text: "Email Verification Code", 
                    html: verficationCode, 
                  });
                  console.log("Email Send Successfully", response)
    } catch (error) {
        console.log("Email Error")
    }
}