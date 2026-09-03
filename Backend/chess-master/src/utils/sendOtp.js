/*const axios = require("axios");
require("dotenv").config();

let otp = 1234

async function sendOtp(mobile, otp) {
    try {

        const response = await axios.get(
            "https://www.fast2sms.com/dev/bulkV2",
            {
                headers: {
                    Authorization: process.env.FAST2SMS_API_KEY,
                    mobile: mobile,
                    message: `Your OTP is ${otp}`,
                }
            }
        );

        console.log("========== FAST2SMS ==========");
        console.log(response.data);
        console.log("==============================");

        return response.data;

    } catch (err) {

        console.log("========== ERROR ==========");

        console.log(
            err.response?.data || err.message
        );

        console.log("===========================");

        return null;
    }
}

module.exports = sendOtp;
*/