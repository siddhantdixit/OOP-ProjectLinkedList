const jwt = require('jsonwebtoken');
const Account = require('../models/account');
const User = require('../models/account');

const requireAuth = (req, res, next) => {
  if(req.path === '/subscription/transaction') 
  {
    next();
    return;
  }

  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWTLOGINSECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/login');
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect('/login');
  }
};

const checkUser = (req, res, next) => {
  if(req.path === '/subscription/transaction') 
  {
    next();
    return;
  }

  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.JWTLOGINSECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.myuserid = null;
        res.locals.myusername = null;
        res.locals.myemail = null;
        res.locals.mysubscription = null;
        next();
      } else {
        let user = await Account.findById(decodedToken.id);
        res.locals.myuserid = decodedToken.id;
        res.locals.myusername = user.username;
        res.locals.myemail = user.email;
        res.locals.mysubscription = user.subscription;
        if(user.status==='verification')
        {
          res.render('dashboard/mailverification.ejs');
        }
        else
        {
          next();
        }
      }
    });
  } else {
    res.locals.myuserid = null;
    res.locals.myusername = null;
    res.locals.myemail = null;
    res.locals.mysubscription = null;
    next();
  }
};


module.exports = { requireAuth, checkUser };