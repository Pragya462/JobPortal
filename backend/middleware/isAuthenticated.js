import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token)
            return res.status(401).json({succeess: false, message: 'Unauthorized'});

        const decode = jwt.verify(token, process.env.SECRET_KEY);

        if(!decode)
            return res.status(401).json({succeess: false, message: 'Invalid Token'});

        req.user = { id: decode.userId };

        next();

    }
    catch(error)
    {
        console.log("Error in authentication middleware ", error);
        res.status(401).json({succeess: false, message: 'Internal Server Error'});
    }
}