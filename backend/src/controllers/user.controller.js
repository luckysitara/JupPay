const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
const multer = require('multer'); 
const path = require('path');
const FormData = require('form-data');

dotenv.config();


const nodemailer = require('nodemailer');
const sendEmailController = require('../controllers/sendEmail');
const Role = require('../models/role.model');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }).single('avatarUrl');

module.exports = {
  async signup(req, res) {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).json({ error: "Error uploading file", message: err.message });
      }
    
      try {
        const { useremail, phonenumber, password, language, userName } = req.body;
        console.log("hhhh", useremail);

      
        const user = await User.findOne({ userEmail: useremail });

        console.log("user", user);

        if (user != null) {
          return res.status(401).json({ message: 'User already exists', error: 'User already exists' });
        }

        const phoneUser = await User.findOne({ phoneNumber: phonenumber });
        if (phoneUser != null) {
          return res.status(401).json({ message: 'Phone already exists.', error: 'Phone already exists.' });
        }

        let rPassword;
        if (!password) {
          rPassword = "";
        } else {
          rPassword = password;
        }
        const hashedPassword = await bcrypt.hash(rPassword, 10);
        const verifyCode = parseInt(Math.random() * 899999) + 100000;
        console.log('verifyCode', verifyCode);
        

        
        let finalAvatarUrl = "https://villagesonmacarthur.com/wp-content/uploads/2020/12/Blank-Avatar.png"; // Default avatar
        if (req.file) {
          console.log('req.file', req.file);
          const formData = new FormData();
          formData.append('image', req.file.buffer, req.file.originalname);
        
          try {
            const response = await axios.post(`${process.env.BASE_URL}/upload`, formData, {
              headers: {
                ...formData.getHeaders(),
                
              },
            });
            console.log('Avatar uploaded successfully:', response.data);
            finalAvatarUrl = `${process.env.BASE_URL}/image/${response.data.file.filename}`;
            console.log(finalAvatarUrl);
          } catch (error) {
            console.error('Error uploading avatar:', error);
          }
        }

        const newUser = await User.create({
          userName: userName,
          userEmail: useremail,
          verifyCode: verifyCode,
          phoneNumber: phonenumber,
          birth: new Date,
          language: language,
          address: "",
          password: hashedPassword,
          avatarUrl: finalAvatarUrl,
          role: "user",
          
        });

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
        
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
          }
        });

        const mailOptions = {
          from: '"JupPay Team" <no-reply@monegliseci.com>',
          to: useremail,
          subject: "Sign up to your JupPay account",
          html: `<h1>Hi ${userName}</h1>
                 <p>Please enter the following verification code to verify this signup attempt:</p>
                 <h2>${verifyCode}</h2>
                 <p>Don't recognize this signup attempt?</p>
                 <p>Regards,<br>The JupPay Team</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log('Verification email sent.');
        res.status(201).json({ message: 'Signup successful', user: newUser, token: token });
      } catch (error) {
        console.log('Signup error:', error);
        res.status(500).json({ error: 'Error', 'Server Error': 'Failed' });
      }
    });
  },

  
  async signupAuth(req, res) {
    try {
      const { useremail, verifyCode } = req.body;
      console.log("signupAuth email", useremail);

      
      const user = await User.findOne({ userEmail: useremail });

      console.log("user", user)

      if (user == null) {
        return res.status(401).json({ message: 'Failed', error: 'Failed' });
      }

      if (user.verifyCode == verifyCode) {  // 6 digit verify code
        await User.findByIdAndUpdate(user._id, { signupComplete: true });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
        return res.status(201).json({ message: 'Succeed', user: user, token: token });
      }
      else {
        return res.status(401).json({ message: 'VerifyIncorrect', error: 'VerifyIncorrect' });
      }

    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async resendVerifyCode(req, res) {
    try {
        const { useremail } = req.body;

        const user = await User.findOne({ userEmail: useremail });

        console.log("user", user);

        if (user == null) {
            return res.status(401).json({ message: `InvalidEmail`, error: 'Your email is not existed' });
        }

        const verifyCode = parseInt(Math.random() * 899999) + 100000;

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });


        await User.findByIdAndUpdate(user._id, {
            verifyCode: verifyCode
        });

        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS 
            }
        });

        
        const mailOptions = {
            from: '"JupPay Team" <no-reply@monegliseci.com>', 
            to: useremail, 
            subject: "Verification Code", 
            html: `<h1> Hi</h1>
                   Please  enter the following verification code to verify this attempt. <br/>
                   <h2> ${verifyCode} </h2>
                   Don't recognize this signup attempt? 
                   Regards,
                   The JupPay Team` 
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'VerifyResent', token: token });
    } catch (error) {
        console.log('Failed', error);
        res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
},

  async forgotPassword(req, res) {
    try {
      const { useremail} = req.body;
      
      const user = await User.findOne({ userEmail: useremail });

      if (user == null) {
        return res.status(401).json({ message:  `InvalidEmail`, error: 'Failed' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
      const verifyCode = parseInt(Math.random() * 899999) + 100000;

      await User.findByIdAndUpdate(user._id, {
        verifyCode: verifyCode
      });


      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS 
        }
    });

    const mailOptions = {
        from: '"JupPay Team" <no-reply@monegliseci.com>', 
        to: useremail, 
        subject: "Verification Code", 
        html: `<h1> Hi </h1>
               Please enter the following verification code to verify this attempt. <br/>
               <h2> ${verifyCode} </h2>
               Don't recognize this signup attempt? 
               Regards,
               The JupPay Team` 
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    console.error('Error sending verification code:', error);
    res.status(500).json({ error: 'Server Error', message: 'Failed to send verification code' });
}
  },

  async resetPassword(req, res) {
    try {
      const { stateEmailorPhone, phoneNumber, useremail, password} = req.body;
      console.log('password', password);
    
      let user;
      if (stateEmailorPhone == 0) {
        user = await User.findOne({ userEmail: useremail });
        if (user == null) {
          return res.status(401).json({ message: `InvalidEmail`, error: 'Failed' });
        }
      } else if(stateEmailorPhone == 1) {
        user = await User.findOne({ phoneNumber: phoneNumber });
        if (user == null) {
          return res.status(401).json({ message: `PhoneOwnerdoesntexist`, error: 'Failed' });
        }
      } else {
        return res.status(401).json({ message: `Failed`, error: 'Failed' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.findByIdAndUpdate(user._id, {
        password: hashedPassword
      });

      res.status(201).json({ message: 'Succeed', user: newUser, token: token });
    } catch (error) {
      console.log('Failed');
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },

  async checkSendcode(req, res) {
    try {

      const { emailorphone } = req.body;

      const user = await User.findOne({ $and: [
        {
          phoneNumber: emailorphone
        },
        { status: true }
      ]});

      console.log(user)
      if (!user) {
        return res.status(401).json({ message: `PhoneOwnerdoesntexist`, status: 'Failed' });
      }

      return res.status(200).json({ message: 'Succeed'});
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },

  async signin(req, res) {
    try {
      const { useremail, password } = req.body;

      console.log('Signin request received:', { useremail, password });

      const user = await User.findOne({
          $or: [
              { userEmail: { $regex: new RegExp(useremail, 'i') } },
              { phoneNumber: useremail },
          ],
      });

      if (!user) {
          console.log('User not found:', useremail);
          return res.status(401).json({ message: 'Enter a valid email or phone number.', status: 'Failed' });
      }

      console.log('User found:', user);

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
          console.log('Invalid password for user:', useremail);
          return res.status(401).json({ message: 'Password is incorrect.', status: 'Failed' });
      }

      /*
      if (!user.signupComplete) {
          return res.status(401).json({ message: 'User needs to complete verification', error: 'Incomplete signup' });
      }
      */

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });

      const verifyCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit code
      const { password: _, ...safeUser } = user.toObject();
      res.status(200).json({ message: 'Succeed', user: safeUser, token });
  } catch (error) {
      console.error('Server error:', error);
      res.status(500).json({ error: 'Server Error', message: 'An unexpected error occurred.' });
  }
  },
  

  async signinAdmin(req, res) {
    try {

      const { useremail, password } = req.body;

      const user = await User.findOne(
        { $and: [
          {
            $or: [
              { userEmail: { $regex: new RegExp(useremail, 'i') } },
              { phoneNumber: { $regex: new RegExp(useremail, 'i') } }
            ]
          },
          {
            $or : [
              { role : "admin" },
              { role : "super" }
            ]
          },
          { status: true }
        ]}
      );

      console.log(user)
      if (!user) {
        return res.status(401).json({ message: 'Login Failed', status: 'Failed' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      console.log(isPasswordValid)

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'PasswordIncorrect', status: 'Failed' });
      }

      
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '6h' });

      res.status(200).json({ message: 'Succeed', user: user, token: token, permission: permission });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },

 
  async updateProfile(req, res) {
    try {
        const { username, useremail, phonenumber, birth, language, address, avatarurl, status, role } = req.body;

        console.log(username, useremail, phonenumber, birth, language, address, avatarurl);
        
        // Find the user by email
        const user = await User.findOne({ userEmail: useremail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        const updateUser = await User.findByIdAndUpdate(user._id, {
            userName: username,
            userEmail: useremail,
            phoneNumber: phonenumber,
            birth: new Date(birth),
            language: language,
            address: address,
            avatarUrl: avatarurl,
            status: status,
            role: role
        });

        // Handle Role logic
        if (role === 'admin') {
            const existingRole = await Role.findOne({ userId: user._id });


            
        } else {
           
            await Role.deleteOne({ userId: user._id });
        }

        
        const userInfo = await User.findOne({ userEmail: useremail });

        console.log(userInfo);

        
        res.status(200).json({ message: 'Profile updated', user: userInfo });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Server Error', message: 'Failed to update profile' });
    }
},
  async updatePassword(req, res) {
    try {
      const { useremail, oldpassword, newpassword, GoogleorFacebook } = req.body;
      const user = await User.findOne({ userEmail: useremail });

      const isPasswordValid = await bcrypt.compare(oldpassword, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Error', message: "PasswordIncorrect" });
      }

      const hashedPassword = await bcrypt.hash(newpassword, 10);
      let updateUser;
      if (GoogleorFacebook) {
        
        updateUser = await User.findByIdAndUpdate(user._id, {
          password: hashedPassword,
          GoogleorFacebook: false
        });
      }
      else {
        updateUser = await User.findByIdAndUpdate(user._id, {
          password: hashedPassword
        });
      }

      res.status(200).json({ message: 'Password updated.', user: updateUser });
    } catch (error) {
      console.log('Failed');
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async getAllUsers(req, res) {
    try {
      console.log('getAllUsers function called');
      const users = await User.find();
      console.log('Users retrieved:', users);

      res.status(200).json({ message: 'User List', users: users });
    } catch (error) {
      console.error('Error retrieving users:', error);
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async getUser(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      res.status(200).json({ message: 'Succeed', user: user });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      const user = await User.deleteOne({ _id: userId });

      res.status(200).json({ message: 'User deleted', user: user });
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  },

 
  
  async adminGetUsersList (req, res) {
    try {
     
      res.status(200).json({ message: 'User List', users : users});
    } catch (error) {
      res.status(500).json({ error: 'Error', 'Server Error:': 'Failed' });
    }
  }
};