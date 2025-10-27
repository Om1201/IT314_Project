export const buildVerifyAccountUrl = (token) => {
    return `${process.env.FRONTEND_URL}/verifyAccount?token=${token}`;
};

export const buildResetPasswordUrl = (token) => {
    return `${process.env.FRONTEND_URL}/passwordReset?token=${token}`;
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

export const buildGoogleTokenParams = (code) => {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("client_id", process.env.GOOGLE_CLIENT_ID);
    params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
    params.append("redirect_uri", process.env.GOOGLE_REDIRECT_URI);
    params.append("grant_type", "authorization_code");
    return params;
};

