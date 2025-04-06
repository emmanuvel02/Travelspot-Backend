const express=require('express')
const userRoutes=express()
const middleware=require('../middleware/auth')
const userController=require('../controllers/User')

userRoutes.post('/signup',userController.userSignupOtp)
userRoutes.post('/otpsubmit',userController.userSignup)
userRoutes.post('/resendotp', userController.ResendOtp);
userRoutes.post('/login',userController.userLogin)
userRoutes.post('/forgetotp',userController.forGetOtp)
userRoutes.post('/forgetotpsubmit',userController.forgetOtpsubmit)
userRoutes.post('/passwordcahnge',userController.changePassword)
userRoutes.post('/googlelog',userController.googleLogin)
userRoutes.get('/destinationpoint',userController.DestinationPoint);
userRoutes.get('/userprofile',middleware.UserAuth,userController.UserProfile)
userRoutes.post('/editprofile',middleware.UserAuth,userController.Editprofile)
userRoutes.get('/walletamount',middleware.UserAuth,userController.WalletAmount)
userRoutes.post('/create-checkout-session',middleware.UserAuth,userController.DestinationBooking)
userRoutes.get('/findbooking',middleware.UserAuth,userController.findBooking)
userRoutes.post('/bookingcancel',middleware.UserAuth,userController.BookingCancel)



module.exports=userRoutes