import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const mainStyle = `
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f8fafc;
  padding: 20px;
`;

const headerStyle = `
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  text-align: center;
  border-radius: 10px 10px 0 0;
`;

const titleStyle = `
  color: white;
  margin: 0;
  font-size: 28px;
`;

const bodyStyle = `
  background-color: white;
  padding: 40px;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const greetingStyle = `
  color: #1a202c;
  margin-bottom: 20px;
`;

const paragraphStyle = `
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const codeBlockContainerStyle = `
  background-color: #edf2f7;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin: 30px 0;
`;

const codeLabelStyle = `
  color: #2d3748;
  margin-bottom: 10px;
  font-weight: 600;
`;

const codeStyle = `
  background-color: #667eea;
  color: white;
  padding: 15px 30px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 3px;
  display: inline-block;
`;

const expiresStyle = `
  color: #718096;
  margin-top: 10px;
  font-size: 14px;
`;

const securityContainerStyle = `
  background-color: #f0fff4;
  border-left: 4px solid #48bb78;
  padding: 15px;
  margin: 20px 0;
`;

const securityTitleStyle = `
  color: #22543d;
  margin: 0 0 10px 0;
  font-size: 16px;
`;

const securityListStyle = `
  color: #2f855a;
  margin: 0;
  padding-left: 20px;
`;

const footerNoteStyle = `
  color: #718096;
  font-size: 14px;
  margin-top: 30px;
  text-align: center;
`;

const hrStyle = `
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 30px 0;
`;

const signatureStyle = `
  color: #a0aec0;
  font-size: 12px;
  text-align: center;
  margin: 0;
`;

export async function sendVerificationEmail(
  email: string,
  otpCode: string,
  firstName: string
) {
  try {
    await resend.emails.send({
      from: "Karanka Multiverse <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Multiverse Account",
      html: `
        <div style="${mainStyle}">
          <div style="${headerStyle}">
            <h1 style="${titleStyle}">Karanka Multiverse</h1>
          </div>

          <div style="${bodyStyle}">
            <h2 style="${greetingStyle}">Welcome, ${firstName}! 🚀</h2>

            <p style="${paragraphStyle}">
              Thank you for joining Karanka Multiverse. We've automatically created a secure crypto wallet for your account.
            </p>

            <div style="${codeBlockContainerStyle}">
              <p style="${codeLabelStyle}">Your Verification Code:</p>
              <div style="${codeStyle}">
                ${otpCode}
              </div>
              <p style="${expiresStyle}">⏰ Expires in 10 minutes</p>
            </div>

            <div style="${securityContainerStyle}">
              <h3 style="${securityTitleStyle}">🔐 Security Features Activated:</h3>
              <ul style="${securityListStyle}">
                <li>Crypto wallet automatically generated</li>
                <li>Secure password hashing with bcrypt</li>
                <li>JWT token-based authentication</li>
                <li>Email verification required</li>
              </ul>
            </div>

            <p style="${footerNoteStyle}">
              If you didn't create an account, please ignore this email.
            </p>

            <hr style="${hrStyle}">

            <p style="${signatureStyle}">
              Best regards,<br>
              The Karanka Multiverse Team<br><br>
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
