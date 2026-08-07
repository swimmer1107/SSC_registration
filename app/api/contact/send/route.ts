import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, message } = body

    // Validate
    if (!fullName || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: { fullName, email, message },
    })

    // Send email to SSC (if Resend is configured)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'SSC Contact Form <noreply@yourdomain.com>',
        to: 'ssc@gla.ac.in', // SSC email
        replyTo: email, // User's email for easy reply
        subject: `New Contact Form Submission from ${fullName}`,
        html: contactEmailTemplate(fullName, email, message),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

function contactEmailTemplate(name: string, email: string, message: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #1B5E20 0%, #4CAF50 100%); padding: 32px; text-align: center; }
          .title { font-size: 28px; font-weight: 900; color: white; letter-spacing: 2px; margin: 0; }
          .content { padding: 40px 32px; }
          .field { margin-bottom: 24px; }
          .label { font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
          .value { font-size: 16px; color: #333; }
          .message-box { background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; }
          .footer { background: #f9f9f9; padding: 24px 32px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="title">NEW CONTACT MESSAGE</h1>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From</div>
              <div class="value"><strong>\${name}</strong></div>
            </div>
            <div class="field">
              <div class="label">Email Address</div>
              <div class="value">\${email}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="message-box">\${message}</div>
            </div>
            <p style="color: #666; font-size: 14px; margin-top: 32px;">
              You can reply directly to this email to respond to \${name}.
            </p>
          </div>
          <div class="footer">
            Sent via SSC AAGAAZ 2026 Contact Form<br>
            © 2026 Students Sports Council, GLA University
          </div>
        </div>
      </body>
    </html>
  `
}
