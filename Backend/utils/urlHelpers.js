export const buildVerifyAccountUrl = (token, email) => {
    return `${process.env.FRONTEND_URL}/verifyAccount?token=${token}&email=${email}`;
};

export const buildResetPasswordUrl = (token, email) => {
    return `${process.env.FRONTEND_URL}/paswordReset?token=${token}&email=${email}`;
};

export const buildGoogleAuthUrl = () => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        response_type: 'code',
        scope: 'email profile',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const buildGoogleTokenUrl = (code) => {
    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        code,
        grant_type: 'authorization_code',
    });
    return `https://oauth2.googleapis.com/token?${params.toString()}`;
};

// Google User Info URL
export const buildGoogleUserInfoUrl = (accessToken) => {
    return `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`;
};
