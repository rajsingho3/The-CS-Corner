
import { transporter } from './email.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current directory:', __dirname);

export const SendVerificationCode = async (email, verficationCode) => {
    try {
         const response = await transporter.sendMail({
                    from: '"Engineering Reference" <engineeringreference7@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Email Verification Code", // Subject line
                    text: "Email Verification Code", // plain text body
                    html: verficationCode, // html body
                  });
                  console.log("Email Send Successfully", response)
    } catch (error) {
        console.log("Email Error")
    }
}