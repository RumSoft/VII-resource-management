using System;

namespace TestApp.Api.Models.Mailing
{
    public class MailMessage
    {
        public MailMessage()
        {
            var address = AppConfig.Smtp_SenderEmail;
            var name = AppConfig.Smtp_SenderName;

            if (string.IsNullOrWhiteSpace(address) || string.IsNullOrWhiteSpace(name))
                throw new Exception("App error: missing mail configuration");

            From = new MailAddress(address, name);
        }

        public MailAddress To { get; set; }
        public MailAddress From { get; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public bool IsBodyHtml { get; set; }

        public static explicit operator System.Net.Mail.MailMessage(MailMessage message)
        {
            return new System.Net.Mail.MailMessage(message.From, message.To)
            {
                Subject = message.Subject,
                Body = message.Body,
                IsBodyHtml = message.IsBodyHtml
            };
        }
    }
}