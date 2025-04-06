const nodemailer = require('nodemailer');

async function sMail(email, destination, date) {
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
    subject: "SkyBlumes TravelHub Booking Details",
    text: `Dear Sir/Ma'am,
               Your booking has been successful. Please come on ${date} and enjoy this place: ${destination}. We hope you have a great experience!If you have any doubts about this place or any other inquiries, please contact us via this email.
  
  Sincerely,  
  SkyBlumes TravelHub`,
  };
  

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email: ", error.message);
  }
}

const bookingsuccessfull = async (email, destination, date) => {
  await sMail(email, destination, date);
  
};

module.exports = {
  bookingsuccessfull,
};
