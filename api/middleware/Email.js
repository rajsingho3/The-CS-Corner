import { transporter } from "./email.config.js"; // Ensure the correct file extension is used

console.log("Current directory:", __dirname); // Log the current directory

export const SendVerificationCode= async (email, verficationCode) => {
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