import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  otpCode: string,
  firstName: string
) {
  try {
    await resend.emails.send({
      from: "Karanka Multiverse <noreply@karanka-multiverse.co.za>",
      to: email,
      subject: "Verify Your Multiverse Account",
      html: `
        <div style=${main}>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Karanka Multiverse</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0;"></p>
          </div>

          <div style="background-color: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #1a202c; margin-bottom: 20px;">Welcome, ${firstName}! 🚀</h2>

            <p style="color: #4a5568; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining CryptoAuth. We've automatically created a secure crypto wallet for your account.
            </p>

            <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <p style="color: #2d3748; margin-bottom: 10px; font-weight: 600;">Your Verification Code:</p>
              <div style="background-color: #667eea; color: white; padding: 15px 30px; border-radius: 6px; font-size: 24px; font-weight: bold; letter-spacing: 3px; display: inline-block;">
                ${otpCode}
              </div>
              <p style="color: #718096; margin-top: 10px; font-size: 14px;">⏰ Expires in 10 minutes</p>
            </div>

            <div style="background-color: #f0fff4; border-left: 4px solid #48bb78; padding: 15px; margin: 20px 0;">
              <h3 style="color: #22543d; margin: 0 0 10px 0; font-size: 16px;">🔐 Security Features Activated:</h3>
              <ul style="color: #2f855a; margin: 0; padding-left: 20px;">
                <li>Crypto wallet automatically generated</li>
                <li>Secure password hashing with bcrypt</li>
                <li>JWT token-based authentication</li>
                <li>Email verification required</li>
              </ul>
            </div>

            <p style="color: #718096; font-size: 14px; margin-top: 30px; text-align: center;">
              If you didn't create an account, please ignore this email.
            </p>

            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">

            <p style="color: #a0aec0; font-size: 12px; text-align: center; margin: 0;">
              Best regards,<br>
              The CryptoAuth Team<br><br>
              🔒 This is an automated message from a secure system.
            </p>
          </div>
        </div>
      `,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send email" };
  }
}

const main = {
  fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#f8fafc",
  padding: "20px",
};
