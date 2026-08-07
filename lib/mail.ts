import nodemailer from 'nodemailer'

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  })
}

export async function sendNoticeMail(
  to: string,
  studentName: string,
  title: string,
  message: string,
  priority: string
): Promise<boolean> {
  try {
    const transporter = createTransporter()
    const priorityEmoji = priority === 'urgent' ? '🚨' : priority === 'normal' ? '📢' : 'ℹ️'

    await transporter.sendMail({
      from: `"SSC AAGAAZ 2026" <${process.env.SMTP_USER}>`,
      to,
      subject: `${priorityEmoji} [AAGAAZ 2026] ${title}`,
      html: noticeEmailTemplate(title, message, studentName, priority),
    })

    return true
  } catch (err) {
    console.error(`Failed to send notice email to ${to}:`, err)
    return false
  }
}

function noticeEmailTemplate(
  title: string,
  message: string,
  studentName: string,
  priority: string
) {
  const borderColor =
    priority === 'urgent' ? '#ef4444' : priority === 'normal' ? '#FF9800' : '#4CAF50'
  const priorityLabel =
    priority === 'urgent' ? '🚨 URGENT' : priority === 'normal' ? '📢 NOTICE' : 'ℹ️ INFO'

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style>
    body { font-family: Arial, sans-serif; background: #f0f0f0; margin: 0; padding: 32px; }
    .wrap { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .header { background: linear-gradient(135deg,#1B5E20,#4CAF50); padding: 28px 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 28px; letter-spacing: 3px; margin: 0; }
    .header p { color: rgba(255,255,255,0.85); font-size: 13px; margin: 6px 0 0; }
    .badge { display: inline-block; margin: 0 auto 20px; padding: 6px 18px; border-radius: 9999px; font-size: 12px; font-weight: 700; letter-spacing: 1px; background: ${borderColor}22; color: ${borderColor}; border: 1px solid ${borderColor}; }
    .body { padding: 32px; }
    .notice-title { font-size: 22px; font-weight: 700; color: #1B5E20; margin: 0 0 16px; }
    .message { font-size: 15px; color: #444; line-height: 1.8; white-space: pre-line; border-left: 4px solid ${borderColor}; padding-left: 16px; margin: 0 0 28px; }
    .footer { background: #f9f9f9; padding: 20px 32px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <h1>AAGAAZ 2026</h1>
      <p>Students Sports Council · GLA University</p>
    </div>
    <div class="body">
      <p style="color:#666;font-size:14px;margin-bottom:20px;">Hello <strong>${studentName}</strong>,</p>
      <div style="text-align:center;margin-bottom:20px;"><span class="badge">${priorityLabel}</span></div>
      <h2 class="notice-title">${title}</h2>
      <div class="message">${message}</div>
      <p style="color:#888;font-size:13px;">
        Regards,<br/>
        <strong>Students Sports Council</strong><br/>GLA University
      </p>
    </div>
    <div class="footer">
      This is an automated notification from SSC AAGAAZ 2026<br/>
      © 2026 Students Sports Council, GLA University
    </div>
  </div>
</body>
</html>`
}
