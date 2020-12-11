using System.Net;
using System.Net.Mail;
using MailMessage = TestApp.Api.Models.Mailing.MailMessage;

namespace TestApp.Api.Services.Impl
{
    public class MailerService : IMailerService
    {
        public void SendMail(MailMessage message)
        {
            
            using var smtpClient = new SmtpClient(AppConfig.Smtp_Host, AppConfig.Smtp_Port);

            var username = AppConfig.Smtp_Username;
            var password = AppConfig.Smtp_Password;

            smtpClient.UseDefaultCredentials = false;
            smtpClient.Credentials = new NetworkCredential(username, password);
            smtpClient.EnableSsl = AppConfig.Smtp_EnableSsl;
            smtpClient.Send((System.Net.Mail.MailMessage) message);
        }
    }
}