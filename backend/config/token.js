
import jwt from "jsonwebtoken";
const genToken = (userId) => {
    try {
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return token;
    } catch (error) {
        console.error("❌ JWT Token generation failed. Check JWT_SECRET in .env file.", error);
        return null; 
    }
};
export default genToken;