exports.createPostValidator = (req, res, next) => {
  //Title
  req.check('title', "Write a title").notEmpty()
  req.check('title', "Title must be between 4 to 150 chars").isLength({
    min: 4,
    max: 150
  });

  //Body
  req.check('body', "Write a body").notEmpty()
  req.check('body', "Body must be between 4 to 2000 chars").isLength({
    min: 4,
    max: 2000
  });

  //Errors
  const errors = req.validationErrors()
  if(errors){
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json( {error: firstError} );
  }

  //proceed to next middleware
  next();
};

exports.userSignupValidator = (req, res, next) => {
  //name
  req.check('name', "Name is required").notEmpty();

  //email
  req.check('email', "This field must be between 3 to 32 chars")
  .matches(/.+\@.+\..+/)
  .withMessage("Email must contain @ char")
  .isLength({
    min: 4,
    max: 32
  })

  //password
  req.check('password', "Password is required").notEmpty();
  req.check('password')
  .isLength({min:6})
  .withMessage("Password must contain at least 6 chars")
  .matches(/\d/)
  .withMessage("Password must contain at least one number")

  //Errors
  const errors = req.validationErrors()
  if(errors){
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json( {error: firstError} );
  }

  next();
};
