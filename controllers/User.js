const User=require('../models/User')
const State=require('../models/State')
const{bookingCancel}=require('../otp/Cancelmail')
const Booking=require('../models/Booking')
const Destination=require('../models/Destination')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const {bookingsuccessfull}=require('../otp/Bookingmail')
const {sendotp}=require('../otp/otp')
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51R9Ix42S9HepzQWj73YqmQfj2ZXpNkWnZsyuEArY0B39cEyFnTbeDx6YZOfdyrUZzbYGG5sXxTkOBeRaC2dwMvvv00vOqJZX5K"
);
/****************************userSend the OTP***************************** */
let otp=null
const userSignupOtp = async (req, res) => {
    try {
      
      const {email} = req.body.data;
      const userExists = await User.findOne({ email: email });
  
      if (!userExists) {
         otp = await sendotp(email);
        res.status(200).json({ success: true, message: "OTP sent successfully", otp: otp });
      } else {
        res.status(201).json({ success: false, message: "Email already exists" });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };
  /*****************User Click the resend otp--------------*/
const ResendOtp = async (req, res) => {
  try {
    const { email } = req.body.data.userdetails;
    await User.findOne({ email: email });
    sendotp(email);
    res.status(200).json({ success: true, message: "resend" });
  } catch (error) {
    console.log(error.message);
  }
};
  
  /****************************userDetils saved***************************** */
const userSignup=async(req,res)=>{
  try {
    
   const userotp=req.body.data.otp
   const {fname,lname,mob,email,password}=req.body.data.userdetails;
  
   const convertotp = Object.values(userotp).join('').toString().replace(/,/g, '');
   const hashpassword = await bcrypt.hash(password, 10);
    if(otp==convertotp){
      const userdata=new User({
        fname,
        lname,
        mob,
        email,
        password:hashpassword
      })
      await userdata.save()
      
      res.status(200).json({success:true,message:"details saved"})
    }else{
      res.status(201).json({success:false,messages:"Wrong OTP"})
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });

  }
}
/****************************userLogin***************************** */
const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body.data;

    const userDetails = await User.findOne({ email: username });
    if (!userDetails) {
      return res.status(200).json({ success: false, notfound: "notfound" });
    }

    if (userDetails.status === false) {
      return res.status(200).json({ success: false, Block: "Block" });
    }

    const passwordMatch = await bcrypt.compare(password, userDetails.password);

    if (!passwordMatch || userDetails.email !== username) {
      return res.status(200).json({ success: false, incorrectdatas: "incorrectdatas" });
    }

    const token = jwt.sign({ id: userDetails._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: "19d" });
    const data = {
      username: `${userDetails.fname} ${userDetails.lname}`,
      token: token,
      id: userDetails._id,
    };
    return res.status(200).json({ success: true, userDatas: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
/*------------------------Forget Password----------------------*/
const forGetOtp=async(req,res)=>{
  try {
    const {email}=req.body.data
      otp = await sendotp(email);
      res.status(200).json({success:true})
    }
    
   catch (error) {
    return res.status(500).json({ success: false, message: "Something went wrong" });

  }
}
const forgetOtpsubmit=async(req,res)=>{
  try {
    const details=req.body.data
    const convertotp = Object.values(details.otp).join('').toString().replace(/,/g, '');
    if(otp==convertotp){

      res.status(200).json({success:true,message:"success"})

    }else{
      res.status(201).json({success:false,wrongotp:"WrongOtp"})
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });

  }
}
const changePassword=async(req,res)=>{
  try {
    const {email,password}=req.body.data
    const haspassword=await bcrypt.hash(password,10)
    const passwordUpdate=await User.updateOne({email:email},
      {$set:{
        password:haspassword,
      }}

    )
    if(passwordUpdate){
      res.status(200).json({success:true})
    }else{
      res.status(403).json({success:false})
    }

    
  } catch (error) {
    console.log(error);
  }
}

/****************Google Login ******/
const googleLogin = async (req, res) => {
  try {
    const { email, given_name, family_name } = req.body.data;

    // Check if required fields are present
    

    const userExists = await User.findOne({ email: email });
    if(userExists){
      const token = jwt.sign({ id: userExists._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: "19d" });
    const data = {
      username: `${userExists.fname} ${userExists.lname}`,
      token: token,
      id: userExists._id,
    };
    res.status(200).json({success:true,messages:"success" ,userData:data})
    }
   
   else if (!userExists) {
     
      const userdata = new User({
        fname: given_name,
        lname: family_name,
        email: email,
      });
      await userdata.save();
      const token = jwt.sign({ id: userdata._id, role: "user" }, process.env.JWT_SECRET_KEY, { expiresIn: "19d" });
    const data = {
      username: `${userdata.fname} ${userdata.lname}`,
      token: token,
      id: userdata._id,
    };
   
    
      res.status(200).json({ success: true ,userDatas:data});
    }
    
   
  } catch (error) {
    console.error("Error during Google login:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const DestinationPoint = async (req, res) => {
  try {


    const { districtname } = req.query;
   

    const destinations = await Destination.find({ districtname })
      .populate("state");


    res.status(200).json({ success: true, destinations });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const UserProfile=async(req,res)=>{
  try {
    
    const id=req.id
    const finddata=await User.findById(id)
    
    res.status(200).json({success:true,finddata})

    
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });

  }
}

const Editprofile = async (req, res) => {
  try {
    const id = req.id; 
    // Getting user ID from the request
    const { firstName, lastName, mobile, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fname:firstName, lname:lastName, email, mob:mobile }, 
      { new: true } // ✅ Ensures the returned document is updated
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("EditProfile Error:", error); // Log the error for debugging
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const DestinationBooking = async (req, res) => {
  try {
    
    const users = req.id;
   
    
    const { _id, exploringDate, peopleCount, totalAmount, paymentMethod,state } = req.body.data;
    
    const destinationid = _id;
    const userdata = await User.findById(users);
    const destinations=await Destination.findById(destinationid)
    

    if (paymentMethod === 'online') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "SkyBlumes TravelHub",
              },
              unit_amount: totalAmount * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        // success_url: "http://localhost:3000/bookingsuccessfull",
        success_url: "https://skyblumes.vercel.app/bookingsuccessfull",

        cancel_url: "http://localhost:3000/cancelbooking",
      
      });

      const bookingdata = new Booking({
        user: users,
        destination: destinationid,
        paymentMethod:paymentMethod ,
        totalAmount: totalAmount,
        date: exploringDate,
        state:state,
        peopleCount: peopleCount,
      });

      await bookingdata.save();
      bookingsuccessfull(userdata.email,destinations.destination,exploringDate)

      return res.status(200).json({ 
        success: true, 
        url: session.url, 
        message: "Proceed to payment" 
      });
    } 
    else if (paymentMethod === "wallet") {
     
      
      if (userdata.walletAmount >= totalAmount) {
        const walletamount = userdata.walletAmount - totalAmount;
     
        
        await User.findByIdAndUpdate(
          users,
          { $set: { walletAmount: walletamount } },
          { new: true }
        );

        const bookingdata = new Booking({
          user: users,
          destination: destinationid,
          paymentMethod: paymentMethod,
          totalAmount: totalAmount,
          date: exploringDate,
          state:state,
          peopleCount: peopleCount,
        });

        await bookingdata.save();
        bookingsuccessfull(userdata.email,destinations.destination,exploringDate)
        return res.status(200).json({
          success: true,
          wallet: true,
          message: "Booking successful using wallet"
        });
      } else {
        return res.status(200).json({
          success: false,
          notamount: "Insufficient wallet balance",
          wallet: false
        });
      }
    } else {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid payment method" 
      });
    }
  } catch (error) {
    console.error("Booking error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

const WalletAmount=async(req,res)=>{
  try {
    
    const id=req.id
    const finddata=await User.findById(id)
    
    res.status(200).json({success:true,finddata})
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
}

const findBooking = async (req, res) => {
  try {
    const userId = req.id;
    
    // First verify the state data exists independently
    
    // Find bookings with proper population
    const bookings = await Booking.find({ user: userId })
    .populate(['user', 'state', 'destination']);
      
    
    
  
    res.status(200).json({
      success: true,
      bookingdata: bookings
    });
    
  } catch (error) {
    console.error("Error finding bookings:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error",
      error: error.message 
    });
  }
};

const BookingCancel=async(req,res)=>{
  try {
    const id=req.query.id
    
const cancelled = await Booking.findOneAndUpdate(
  {
    _id: id,
    status: "booked"
  },
  {
    $set: { status: "Cancelled" }
  },
  {
    new: true
  }
)

// 2. Update the user's walletAmount if booking was successfully cancelled



 
    
    const userId = req.id;

    const finduser=await User.findByIdAndUpdate(
      {_id:userId},
{
  $inc:{
    walletAmount:cancelled.totalAmount
  }
},
{
  new:true
}
    )
   
    bookingCancel(finduser.email)
    
      
    res.status(200).json({success:true})
  } catch (error) {
    
  }
}


module.exports={
    userSignupOtp,
    userSignup,
    ResendOtp,
    userLogin,
    forGetOtp,
    forgetOtpsubmit,
    changePassword,
    googleLogin,
    DestinationPoint,
    UserProfile,
    Editprofile,
    DestinationBooking,
    WalletAmount,
    findBooking,
    BookingCancel

}