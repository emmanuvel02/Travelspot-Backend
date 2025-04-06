const nodemailer = require('nodemailer');

async function sMail(email) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Your Exploring Journey Has Been Completed",
    text: `Dear Sir/Madam,
  
Your exploring journey with us has been successfully completed. We hope you had a wonderful experience and enjoyed every moment of your trip.

We truly appreciate your trust in SkyBlumes TravelHub and hope to see you again soon for your next adventure.

If you have any feedback or need assistance, feel free to reach out to us anytime.

Warm regards,
SkyBlumes TravelHub`,
  };
  

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error.message);
  }
}

const bookingCompleted = async (email) => {
  await sMail(email);
  
};

module.exports = {
    bookingCompleted,
};
