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
    subject: "Booking Cancellation Confirmation",
    text: `Dear Sir/Ma'am,
        Your booking has been successfully cancelled. The payment amount has been credited to your wallet account.

If you have any questions or need further assistance, feel free to contact us via this email.

We look forward to serving you again in the future.

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

const bookingCancel = async (email) => {
  await sMail(email);
  
};

module.exports = {
    bookingCancel,
};
