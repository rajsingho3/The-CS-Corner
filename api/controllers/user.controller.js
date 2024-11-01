export const test = (req, res) => {
    res.json({message: 'API is Working'});
};
export const signout = (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({message: 'Signout successfully'});
    } catch (error) {
        next(error);    
    }
}