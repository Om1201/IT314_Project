export const verificationEmail = (email, verifyUrl) => {
    return {
        subject: 'Welcome to this website',
        text: `Welcome to this website!
    
            Your account has been created with email id: ${email}.
            
            Kindly click on the URL below to verify your account:
            ${verifyUrl}
            
            Please note: This link will expire in 15 minutes. 
            If it expires, you'll need to request a new verification link.
            `,
    };
};

export const passwordResetEmail = (email, verifyUrl) => {
    return {
        subject: 'Password Reset Link',
        text: `We received a request to reset your password for your account linked with email: ${email}.
        
            Your link for resetting your password is:
            ${verifyUrl}
            
            This link will expire in 15 minutes. 
            If you did not request this, please ignore this email.  
            
            For security reasons, do not share this link with anyone.
            `,
    };
};
