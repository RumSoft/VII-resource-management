using TestApp.Api.Models;
using TestApp.Api.Models.Mailing;
using TestApp.Api.Services;

namespace TestApp.Api.Helpers
{
    public class MailingHelper
    {
        public static void SendPasswordMail(User user, IMailerService mailer)
        {
            var mail = new MailMessage
            {
                IsBodyHtml = true,
                Body = "<h3>hello password reset xd</h3>",
                Subject = $"password reset for {user.FullName}",
                To = new MailAddress(user.EmailAddress, user.FullName)
            };

            mailer.SendMail(mail);
        }
    }
}