import {Request, Response, NextFunction} from 'express';
import {Result, ValidationError, body, validationResult} from 'express-validator';

export const authorize = [

    body("username").notEmpty().withMessage("username is required"), 
    body("password").notEmpty().withMessage("password is required"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors: Result<ValidationError> = validationResult(req);

        if (!errors.isEmpty()){

          console.error("validation errors: ")
          console.error(errors.array())

          return res.status(422).json({errors: errors.array()});
        }
        next();
      },
]; 