import { Resend } from "resend";
import type { ContactFormData } from "./contact-schema";

// Initialize Resend only when needed to avoid build-time errors
let resend: Resend | null = null;

function getResendInstance(): Resend {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export class EmailService {
  private static instance: EmailService;
  private fromEmail: string;
  private toEmail: string;

  private constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@yourdomain.com";
    this.toEmail = process.env.TO_EMAIL || "your.email@example.com";
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const resendInstance = getResendInstance();
      const result = await resendInstance.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo,
      });

      if (result.error) {
        throw new Error(`Email service error: ${result.error.message}`);
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new Error(`Failed to send email: ${errorMessage}`);
    }
  }

  public async sendContactEmail(data: ContactFormData): Promise<void> {
    const { name, email, message } = data;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Form Submission</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .field {
              margin-bottom: 20px;
            }
            .field-label {
              font-weight: 600;
              color: #495057;
              margin-bottom: 5px;
              display: block;
            }
            .field-value {
              background: white;
              padding: 12px;
              border-radius: 4px;
              border: 1px solid #dee2e6;
              word-wrap: break-word;
            }
            .message-content {
              white-space: pre-wrap;
              min-height: 100px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 14px;
              color: #6c757d;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio website</p>
          </div>
          
          <div class="content">
            <div class="field">
              <label class="field-label">Name:</label>
              <div class="field-value">${this.escapeHtml(name)}</div>
            </div>
            
            <div class="field">
              <label class="field-label">Email:</label>
              <div class="field-value">
                <a href="mailto:${this.escapeHtml(
                  email
                )}" style="color: #667eea; text-decoration: none;">
                  ${this.escapeHtml(email)}
                </a>
              </div>
            </div>
            
            <div class="field">
              <label class="field-label">Message:</label>
              <div class="field-value message-content">${this.escapeHtml(
                message
              )}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This message was sent from your portfolio contact form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: this.toEmail,
      subject: `Portfolio Contact: ${name}`,
      html,
      replyTo: email,
    });
  }

  public async sendConfirmationEmail(data: ContactFormData): Promise<void> {
    const { name, email, message } = data;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Message Confirmation</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              padding: 30px 20px;
              border-radius: 8px 8px 0 0;
              text-align: center;
            }
            .content {
              background: #f8f9fa;
              padding: 30px 20px;
              border-radius: 0 0 8px 8px;
            }
            .message-copy {
              background: white;
              padding: 20px;
              border-radius: 4px;
              border: 1px solid #dee2e6;
              margin: 20px 0;
              white-space: pre-wrap;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 14px;
              color: #6c757d;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Message Sent Successfully!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for reaching out</p>
          </div>
          
          <div class="content">
            <p>Hi ${this.escapeHtml(name)},</p>
            
            <p>Thank you for contacting me through my portfolio website. I've received your message and will get back to you as soon as possible.</p>
            
            <p><strong>Here's a copy of your message:</strong></p>
            <div class="message-copy">${this.escapeHtml(message)}</div>
            
            <p>I typically respond within 24-48 hours during business days. If your inquiry is urgent, please feel free to mention it in a follow-up email.</p>
            
            <p>Best regards,<br>Your Name</p>
          </div>
          
          <div class="footer">
            <p>This is an automated confirmation email.</p>
            <p>Sent: ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: "Message Received - Thank You for Contacting Me",
      html,
    });
  }

  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}
