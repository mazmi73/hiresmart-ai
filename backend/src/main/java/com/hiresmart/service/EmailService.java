package com.hiresmart.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${hiresmart.mail.from:noreply@hiresmart.ai}")
    private String fromEmail;

    @Value("${hiresmart.mail.from-name:HireSmart AI}")
    private String fromName;

    @Value("${hiresmart.mail.app-url:http://localhost:4200}")
    private String appUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String recipientName, String token) {
        String resetUrl = appUrl + "/auth/reset-password?token=" + token;
        String subject = "HireSmart AI — Reset Your Password";

        String htmlContent = buildResetPasswordHtml(recipientName, resetUrl);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Password reset email dispatched to {} via Mailtrap", toEmail);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to dispatch password reset email: " + e.getMessage(), e);
        }
    }

    private String buildResetPasswordHtml(String recipientName, String resetUrl) {
        String greeting = (recipientName != null && !recipientName.isBlank()) ? "Hello " + recipientName + "," : "Hello,";

        return "<!DOCTYPE html>"
                + "<html>"
                + "<head>"
                + "<meta charset='UTF-8'>"
                + "<meta name='viewport' content='width=device-width, initial-scale=1.0'>"
                + "<title>HireSmart AI — Password Reset</title>"
                + "</head>"
                + "<body style='margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif;color:#1e293b;'>"
                + "  <table width='100%' cellpadding='0' cellspacing='0' style='background-color:#f1f5f9;padding:40px 16px;'>"
                + "    <tr>"
                + "      <td align='center'>"
                + "        <table width='100%' style='max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.06);border:1px solid #e2e8f0;' cellpadding='0' cellspacing='0'>"
                + "          <!-- Header -->"
                + "          <tr>"
                + "            <td style='background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px;text-align:center;'>"
                + "              <div style='display:inline-block;padding:8px 16px;background:rgba(37,99,235,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:9999px;margin-bottom:12px;'>"
                + "                <span style='color:#60a5fa;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;'>Security Notification</span>"
                + "              </div>"
                + "              <h1 style='color:#ffffff;font-size:24px;font-weight:800;margin:0 0 6px 0;letter-spacing:-0.5px;'>HireSmart AI</h1>"
                + "              <p style='color:#94a3b8;font-size:14px;margin:0;'>Password Recovery Service</p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Body Content -->"
                + "          <tr>"
                + "            <td style='padding:36px 32px;'>"
                + "              <p style='font-size:15px;line-height:24px;color:#334155;margin:0 0 16px 0;font-weight:600;'>" + greeting + "</p>"
                + "              <p style='font-size:14px;line-height:22px;color:#475569;margin:0 0 24px 0;'>"
                + "                We received a request to reset the password associated with your HireSmart AI account. Click the button below to set a new password."
                + "              </p>"
                + "              <!-- CTA Button -->"
                + "              <div style='text-align:center;margin:32px 0;'>"
                + "                <a href='" + resetUrl + "' style='display:inline-block;background-color:#2563eb;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;box-shadow:0 4px 12px rgba(37,99,235,0.25);'>Reset My Password</a>"
                + "              </div>"
                + "              <!-- Fallback Link -->"
                + "              <p style='font-size:12px;line-height:18px;color:#64748b;margin:0 0 16px 0;'>"
                + "                If the button above does not work, copy and paste the following link directly into your browser:"
                + "              </p>"
                + "              <p style='word-break:break-all;font-size:12px;color:#2563eb;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0;margin:0 0 24px 0;'>"
                + "                <a href='" + resetUrl + "' style='color:#2563eb;text-decoration:underline;'>" + resetUrl + "</a>"
                + "              </p>"
                + "              <!-- Expiration Warning -->"
                + "              <div style='background-color:#fffbeb;border:1px solid #fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:8px;margin-bottom:24px;'>"
                + "                <p style='margin:0;font-size:12px;line-height:18px;color:#92400e;font-weight:500;'>"
                + "                  <strong>Notice:</strong> This reset link will securely expire in <strong>60 minutes</strong>. If you did not request this, please disregard this email or contact support if you suspect unauthorized activity."
                + "                </p>"
                + "              </div>"
                + "              <p style='font-size:13px;line-height:20px;color:#64748b;margin:0;'>"
                + "                Best regards,<br><strong style='color:#1e293b;'>The HireSmart AI Team</strong>"
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "          <!-- Footer -->"
                + "          <tr>"
                + "            <td style='background-color:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;'>"
                + "              <p style='font-size:11px;color:#94a3b8;margin:0;line-height:16px;'>"
                + "                &copy; " + java.time.Year.now().getValue() + " HireSmart AI. Intelligent Recruitment Platform.<br>"
                + "                This automated message was sent securely to your registered email address."
                + "              </p>"
                + "            </td>"
                + "          </tr>"
                + "        </table>"
                + "      </td>"
                + "    </tr>"
                + "  </table>"
                + "</body>"
                + "</html>";
    }
}
