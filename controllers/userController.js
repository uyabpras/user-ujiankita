const db = require("../db/connect");
const bcrypt = require('bcrypt');
//const kafkaProducer = require('../config/kafka');
const jwt = require('jsonwebtoken');
const mailer = require('../helper/mailer')
const { hashPassword } = require('../helper/hashpassword')
const {regextest} = require('../helper/regextest');
const {encrypt} = require('../helper/encrypt')
const {decrypt} = require('../helper/encrypt')
const UsersDB = db.users;
const Op = db.Sequelize.Op;

exports.register = async (req, res) => {
  try {
      const regexErrorMessage = regextest(req.body.email, req.body.password, req.body.name, req.body.nomer_induk);
      if (regexErrorMessage) {
          return res.status(400).json({ message: regexErrorMessage });
      }

      if (req.body.role === "admin") {
          return res.status(400).json({ message: "access denied" });
      }

      const hashedPassword = await hashPassword(req.body.password);
      const [newuser, isCreated] = await UsersDB.findOrCreate({
          where: { nomer_induk: req.body.nomer_induk, email: req.body.email },
          defaults: {
              name: req.body.name,
              nomer_induk: req.body.nomer_induk,
              email: req.body.email,
              password: hashedPassword,
              role: req.body.role
          }
      });

      if (!isCreated) {
          return res.status(400).json({ message: "User with the specified nomer_induk and email already exists." });
      }

      const newuser1 = { ...newuser.get(), password: "sensored password" };
      const encryptedId = encrypt(newuser1.id.toString());
      console.log('\n' + newuser1.id + '\n' );
      newuser1.id = encryptedId;

      res.status(201).json({ success: true, message: 'User registered successfully', data: newuser1 });
  } catch (error) {
      if (error.message == "Validation error") {
          return res.status(500).json({ success: false, message: 'User with the specified nomer_induk and email already exists.' });
      }

      return res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
  }
};


exports.login = async (req,res) =>{
    try {
        console.log(req.body);
        if (regextest(req.body.email, req.body.password) != null) {
          return res.status(401).json({ message: regextest(req.body.email, req.body.password) });
        }
        const userLoggedin = await UsersDB.findOne({ where: { [Op.or]: [{ email: req.body.email }, { nomer_induk: req.body.nomer_induk }] } });

        if (!userLoggedin) {
          return res.status(401).json({ message: 'Invalid email or nomer_induk' });
        }
        console.log(userLoggedin.id);
    
        const isPasswordValid = await bcrypt.compare(req.body.password, userLoggedin.password);
    
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Authentication failed' });
        }
    
        const token = jwt.sign(
                      { 
                        id: userLoggedin.id, 
                        email: userLoggedin.email,
                        nomer_induk: userLoggedin.nomer_induk,
                        role: userLoggedin.role
                      },
                          process.env.SECRET_KEY, {
                            expiresIn: '1h', 
                          });
    
        res.status(200).json({ message: 'Authentication successful', token: token });
      } catch (error) {
        res.status(500).json({ message: 'Error authenticating user', error: error.message });
      }
};

exports.verify = async(req,res) =>{
  //validate token
  const token = req.query.token;
  const secretKey = process.env.Key_jwt;

  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded)
    const userId = decoded.id;
    const userLoggedin = await UsersDB.update( {is_validate : true},{ where: { id: userId } });
    console.log(userLoggedin);
    if(!userLoggedin){
      res.send([userLoggedin. userId]);

    }
    res.send('Email verified successfully.');

  } catch (err) {
    // Handle token verification failure
    res.send(err);
  }
};

exports.findID = async (req, res) => {
  try {
      console.log(req.params);
      const userId = req.params.id;
      const idDecrypt = decrypt(userId.toString());
      const findID = await UsersDB.findByPk(idDecrypt);
      const findID1 = { ...findID.get(), password: "sensored password" };
      if (!findID) {
          res.status(404).send({ 
              success: false,
              data: null,
              message: "user not found by id:" + req.params.id
          });
      } else {
          res.status(200).send({
              success: true,
              data: findID1,
          });
      }
  } catch (err) {
      res.status(500).send({
          message: err.message || "error getting soal"
      });
  }
};

exports.edit = async (req, res) => {
    try {
      console.log('\n' + req.params.id + '\n');
      const userId = req.params.id;
  
      if (regextest(req.body.email, req.body.password, req.body.name, req.body.namenomer_induk) != null) {
        return res.status(401).json({ message: 'Wrong format' });
      }
  
      // Decrypt and parse the ID
      const idDecrypt = decrypt(userId.toString());
  
      const FindID = await UsersDB.findByPk(idDecrypt);
  
      if (!FindID) {
        res.status(404).send({
          success: false,
          data: null,
          message: "user not found by id:" + req.params.id
        });
      }
      // if(!req.body.password){
        const hashedPassword = await hashPassword(req.body.password);
      // }
      const user = {
        name: req.body.name,
        nomer_induk: req.body.nomer_induk,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
      };
  
      const newuser = await UsersDB.update(user, { where: { id: idDecrypt } });
      if (!newuser) {
        res.status(400).send({
          success: false,
          data: newUser,
          message: "update user is failed by id:" + req.params.id
        });
      }

      user.id = req.params.id;
      user.password = "sensored password";
  
      res.status(200).send({
        success: true,
        data: user,
        message: "successfully updated data by id:" + req.params.id
      });
  
    } catch (err) {
      res.status(500).send({
        message: err.message || "error updating user"
      });
    }
  };
  

exports.getHealth = async(req, res) => {
  const data = {
    uptime: process.uptime(),
    message: 'Ok',
    date: new Date()
  }

  res.status(200).send(data);
};
