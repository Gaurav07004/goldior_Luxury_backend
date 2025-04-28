// otpStore.js (OTP storage utility)

let otpStore = {}; // In-memory OTP store

/**
 * Store OTP and its expiration time.
 * @param {string} email - The user's email.
 * @param {number} otp - The generated OTP.
 * @param {number} ttl - The TTL (Time-to-Live) for OTP in milliseconds (2 minutes = 120,000 ms).
 */
function storeOtp(email, otp, ttl = 2 * 60 * 1000) {
  const expirationTime = Date.now() + ttl; // Expiration time is current time + TTL
  otpStore[email] = { otp, expirationTime };
  console.log(
    `OTP stored for ${email}: ${otp}, expires at ${new Date(
      expirationTime
    ).toLocaleString()}`
  );
}

/**
 * Retrieve OTP for a given email.
 * @param {string} email - The user's email.
 * @returns {Object|null} - Returns OTP object or null if OTP is not found.
 */
function getOtp(email) {
  const otpData = otpStore[email];
  if (!otpData) return null; // No OTP found for the email
  return otpData;
}

/**
 * Delete OTP from the store after it has been verified or expired.
 * @param {string} email - The user's email.
 */
function deleteOtp(email) {
  delete otpStore[email];
  console.log(`OTP deleted for ${email}`);
}

/**
 * Check if OTP has expired for a given email.
 * @param {string} email - The user's email.
 * @returns {boolean} - Returns true if OTP is expired, otherwise false.
 */
function isOtpExpired(email) {
  const otpData = otpStore[email];
  if (!otpData) return true; // If no OTP found, it's considered expired
  return Date.now() > otpData.expirationTime; // Check if the OTP has expired
}

export { storeOtp, getOtp, deleteOtp, isOtpExpired };
