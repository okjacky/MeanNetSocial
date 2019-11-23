'use strict';

//const Role = require('../helpers/roles');
const errorHandler = require('../helpers/error-handler');
const bcrypt = require('bcryptjs');
const db = require('../helpers/db');
const User = db.User;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

module.exports = {
  login,
  signup,
  getAll,
  getById,
  getByName,
  getEmail,
  update,
  updateAvatar,
  searchItem,
  confirmationToken,
  delete: _delete,
  connexionRequest
};

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_LOGIN,
    pass: process.env.GMAIL_PWD
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  }
});

async function login(email, password) {

  const user = await User.findOne({email});
  if (user && bcrypt.compareSync(password, user.password)) {
    const { hash, ...userWithoutHash } = user.toObject();
    return {
      ...userWithoutHash,
      user
    };
  }
}

async function signup(registerData) {
  if (await User.findOne({ email: registerData.email})) {
    return registerData;
  }
  const newUser = new User(registerData);
  // hash password
  if (registerData.password) {
    newUser.password = bcrypt.hashSync(registerData.password, 10);
  }
  // save user
  await newUser.save();
}

async function getAll() {
  return await User.find().select('-password');
}

async function getEmail(emailm) {
  console.log('us getmail:', emailm);
  const user = await User.findOne({email: emailm.email});
  if (!user) return;
  const tempPassword = 'tempPassword';
  //await user.updateOne({}, {password: bcrypt.hashSync(tempPassword, 10)});
  await jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
      process.env.EMAil_SECRET,
    {
      expiresIn: '1d',
    }, (err, emailToken) => {
      if(err) {
        next(err);
      }
      try {
        const url = `http://localhost:4200/changermdp/${emailToken}`;
        transporter.sendMail({
          from: 'noreply@netSocial.com',
          to: user.email,
          subject: 'netSocial - Changer mot de passe ',
          text: 'Plaintext version of the message',
          html: `
                <h1>Bonjour ${user.prenom}</h1>
                <p>Nous avons reçu une demande d'initialisation de votre mot de passe netSocial.com</p>
                <p>Nous sommes là pour vous aider !</p>
                <p>Cliquez simplement sue le lien pour créer un nouveau mot de passe</p>
                <a href= ${url}>Choisissez un nouveau mot de passe</a>
                `
        });
        return true;
      }catch (err) {
        next(err);
      }

    }
  )
  // return await User.findOne({email: emailm.email}).select('email');
}

async function confirmationToken(token) {
  const tokenUser = jwt.verify(token, process.env.EMAIL_SECRET);
  console.log('us confirmationToken:', tokenUser);
  return tokenUser;
}

async function getById(id) {
  return await User.findById(id).select('-password');
}

async function getByName(name) {
  return await User.findOne({nom: name}).select('-password');
}

async function update(id, userParam) {
  const user = await User.findById(id).select('-password');

  // validate
  if (!user) return;
  if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
    return;
  }
  // hash password
  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
    // save user
    await user.save();
    return true;
  }
  /**if (userParam.request) {
    console.log('us update%', userParam.request);
    user.request.filter((demande) => {demande._id === userParam.request});
    await user.save;
    return true;
  }**/
  // copy userParam properties to user
  Object.assign(user, userParam);
  await user.save();
  return user;
}

async function updateAvatar(id, avatar) {
  const user = await User.findById(id);

  if (!user) return;
  avatar.mv('../../jeu - Cv/netSocial/uploads/' + id + avatar.name);
  user.image = '/uploads/' + id + avatar.name;
  await user.save(function(err){
    if(err){
      console.log('failled save image :', err);
      // res.json({status: 500});
    }else{
      console.log('save image successful !');
      // res.json({status: 200});
    }
  });
  return user;
}

async function searchItem(item) {
  return await User.find({$or: [
    {nom: {$regex: item, $options: "i"}},
          {prenom: {$regex: item, $options: "i"}},
          {pseudo: {$regex: item, $options: "i"}},
        ]});
}

async function _delete(id) {
  return await User.findByIdAndRemove(id);
}

async function connexionRequest(item) {

  if (item.acceptRequest) {
    console.log('us rcon');
    const currentUserId = item.acceptRequest.senderId;
    const receiverId = item.acceptRequest.receiverId;

    const user = await User.findById(currentUserId, function (err, s) {
      if(err) {return errorHandler(err)};
      s.followers.push({userId: receiverId});
      s.save((err, user) => {
        if(err) {return errorHandler(err)}

      });
    })
    await User.findById(receiverId, function (err, r) {
      if(err) {return errorHandler(err)};
      r.followers.push({userId: currentUserId});
      r.save(err => {
        if(err) {return errorHandler(err)}
      });
    })
    return user;
  }

  if (item.deleteRequest) {
    console.log('us deletcon',item);
    const currentUserId = item.deleteRequest.senderId;
    const receiverId = item.deleteRequest.receiverId;

    const user$ = await User.findById(currentUserId, function (err, s) {
      if(err) {return errorHandler(err)};
      for(let i = 0; i < s.request.length; i++) {
        if(s.request[i].userId === receiverId) {
          s.request[i].remove();
          s.save(err => {
            if(err) {return errorHandler(err)}
          });
        }
      }
    });
    await User.findById(receiverId, function (err, r) {
      if(err) {return errorHandler(err)};
      for(let i = 0; i < r.sendRequest.length; i++) {
        if(r.sendRequest[i].userId === currentUserId) {
          r.sendRequest[i].remove();
          r.save(err => {
            if(err) {return errorHandler(err)}
          });
        }
      }
    });
    return user$
  }

  const sender = await User.findById(item.senderId, function (err, s) {
    s.sendRequest.push({userId: item.receiver.receiverId, userNom: item.receiver.receiverNom, image: item.receiver.image});
    s.save(err => {
      if(err) {return errorHandler(err)}
      });
  });
  await User.findById(item.receiver.receiverId, function (err, r) {
    r.request.push({userId: sender._id, userNom: sender.nom, image: sender.image});
    r.save(err => {
      if(err) {return errorHandler(err)}
    });
  })
  return true;

}
