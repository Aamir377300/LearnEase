const clientId = "process.env.GOOGLE_CLIENT_ID";
const redirectUri = "process.env.GOOGLE_REDIRECT_URI";
const scope = "https://www.googleapis.com/auth/calendar";

const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code&approval_prompt=force&access_type=offline`;

console.log(authUrl);

// run the getRefreshToken.js for the url to ger it