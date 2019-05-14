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
