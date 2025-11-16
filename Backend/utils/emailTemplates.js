export const verificationEmail = (email, verifyUrl) => {
  return {
    subject: 'Welcome to this website',
    html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome! 🎉</h1>
            <p style="color: #b2ebf2; margin: 10px 0 0 0; font-size: 14px;">Let's verify your account</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi there,
            </p>
            
            <p style="color: #555555; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0;">
              Welcome to our website! Your account has been successfully created with:
            </p>
            
            <!-- Email Display -->
            <div style="background-color: #e0f7fa; border-left: 4px solid #00bcd4; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #00695c; font-size: 14px; margin: 0; font-weight: 500;">Email Address</p>
              <p style="color: #00897b; font-size: 16px; margin: 8px 0 0 0; word-break: break-all; font-weight: 600;">${email}</p>
            </div>
            
            <p style="color: #555555; font-size: 15px; line-height: 1.8; margin: 25px 0 20px 0;">
              To complete your registration, please verify your account by clicking the button below:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; transition: transform 0.2s ease; box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);">
                ✓ Verify Account
              </a>
            </div>
            
            <!-- Alternative Link -->
            <p style="color: #999999; font-size: 13px; text-align: center; margin: 20px 0;">
              Or copy and paste this link:
            </p>
            <p style="color: #0097a7; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0; font-family: monospace; background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
              ${verifyUrl}
            </p>
            
            <!-- Warning -->
            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #e65100; font-size: 14px; margin: 0; font-weight: 500;">⏱️ Link Expires Soon</p>
              <p style="color: #f57c00; font-size: 13px; margin: 8px 0 0 0; line-height: 1.6;">
                This verification link will expire in <strong>15 minutes</strong>. If it expires, you can request a new verification link.
              </p>
            </div>
            
            <p style="color: #888888; font-size: 14px; margin: 25px 0 10px 0;">
              If you didn't create this account, please ignore this email.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #eceff1; padding: 20px 30px; text-align: center; border-top: 1px solid #cfd8dc;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              © 2025 Our Website. All rights reserved.
            </p>
            <p style="color: #999999; font-size: 11px; margin: 8px 0 0 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
export const passwordResetEmail = (email, verifyUrl) => {
  return {
    subject: 'Password Reset Link',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f7fa;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Password Reset</h1>
            <p style="color: #b2ebf2; margin: 10px 0 0 0; font-size: 14px;">Secure your account</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Hi there,
            </p>
            
            <p style="color: #555555; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0;">
              We received a request to reset the password for your account linked with:
            </p>
            
            <!-- Email Display -->
            <div style="background-color: #e0f7fa; border-left: 4px solid #00bcd4; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
              <p style="color: #00695c; font-size: 14px; margin: 0; font-weight: 500;">Email Address</p>
              <p style="color: #00897b; font-size: 16px; margin: 8px 0 0 0; word-break: break-all; font-weight: 600;">${email}</p>
            </div>
            
            <p style="color: #555555; font-size: 15px; line-height: 1.8; margin: 25px 0 20px 0;">
              Click the button below to create a new password:
            </p>
            
            <!-- CTA Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verifyUrl}" style="display: inline-block; background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-size: 16px; font-weight: 600; transition: transform 0.2s ease; box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);">
                Reset Password
              </a>
            </div>
            
            <!-- Alternative Link -->
            <p style="color: #999999; font-size: 13px; text-align: center; margin: 20px 0;">
              Or copy and paste this link:
            </p>
            <p style="color: #0097a7; font-size: 12px; text-align: center; word-break: break-all; margin: 10px 0; font-family: monospace; background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
              ${verifyUrl}
            </p>
            
            <!-- Security Warning -->
            <div style="background-color: #ffebee; border-left: 4px solid #d32f2f; padding: 15px 20px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #b71c1c; font-size: 14px; margin: 0; font-weight: 500;">Security Notice</p>
              <ul style="color: #c62828; font-size: 13px; margin: 10px 0 0 0; padding-left: 20px; line-height: 1.8;">
                <li>This link will expire in <strong>15 minutes</strong></li>
                <li>Do not share this link with anyone</li>
                <li>If you didn't request this, your account may be at risk</li>
              </ul>
            </div>
            
            <p style="color: #888888; font-size: 14px; margin: 25px 0 10px 0;">
              If you did not request a password reset, please ignore this email and your account will remain secure.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #eceff1; padding: 20px 30px; text-align: center; border-top: 1px solid #cfd8dc;">
            <p style="color: #666666; font-size: 12px; margin: 0;">
              © 2025 Our Website. All rights reserved.
            </p>
            <p style="color: #999999; font-size: 11px; margin: 8px 0 0 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
};
