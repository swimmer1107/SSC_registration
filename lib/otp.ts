export async function sendOTP(contact: string, code: string, method: 'phone' | 'email') {
  // Check if SMTP is configured (for production)
  const isProduction = !!process.env.RESEND_API_KEY
  
  if (!isProduction) {
    // DEV MODE - Just log OTP to console
    console.log('\n' + '═'.repeat(60))
    console.log('  🔐 DEVELOPMENT MODE - OTP VERIFICATION')
    console.log('═'.repeat(60))
    console.log(`  Contact: ${contact}`)
    console.log(`  Method:  ${method}`)
    console.log(`  OTP:     ${code}`)
    console.log('═'.repeat(60) + '\n')
    
    // Return success with OTP for auto-fill in dev
    return { 
      success: true, 
      devMode: true,
      devOtp: code, // Frontend can auto-fill this in dev
    }
  }

  // PRODUCTION MODE - Send via Resend
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'AAGAAZ SSC <noreply@yourdomain.com>',
      to: contact,
      subject: 'Your AAGAAZ Registration OTP',
      html: emailTemplate(code),
    })

    return { success: true, devMode: false }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send OTP' }
  }
}

function emailTemplate(code: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%); padding: 32px; text-align: center; }
          .title { font-size: 32px; font-weight: 900; color: white; letter-spacing: 2px; margin: 0; }
          .subtitle { font-size: 14px; color: rgba(255,255,255,0.9); margin-top: 8px; }
          .content { padding: 40px 32px; }
          .code-box { background: #f5f5f5; border: 2px solid #4CAF50; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0; }
          .code { font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #1B5E20; font-family: monospace; }
          .note { text-align: center; font-size: 14px; color: #666; margin-top: 24px; }
          .footer { background: #f9f9f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">AAGAAZ 2026</h1>
            <p class="subtitle">GLA University Sports Festival</p>
          </div>
          <div class="content">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Your one-time verification code for sports registration:
            </p>
            <div class="code-box">
              <span class="code">${code}</span>
            </div>
            <p class="note">
              This code is valid for <strong style="color: #4CAF50;">10 minutes</strong>.<br>
              Do not share this code with anyone.
            </p>
          </div>
          <div class="footer">
            If you didn't request this code, please ignore this email.<br>
            © 2026 Students Sports Council, GLA University
          </div>
        </div>
      </body>
    </html>
  `
}

