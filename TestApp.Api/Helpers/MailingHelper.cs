using TestApp.Api.Models;
using TestApp.Api.Models.Mailing;
using TestApp.Api.Services;

namespace TestApp.Api.Helpers
{
    public class MailingHelper
    {
        public static void SendPasswordMail(User user, Token token, IMailerService mailer)
        {
            var url = $"{AppConfig.Url}setpassword?tokenId={token.Value}";
            var mail = new MailMessage
            {
                IsBodyHtml = true,
                Body = "<h3>hello password reset xd </h3> " +
                       "<p>please click here:<p>" +
                       $"<p><a href={url}>click here</a></p>" +
                       $"<p>{url}</p>",
                Subject = $"password reset for {user.FullName}",
                To = new MailAddress(user.EmailAddress, user.FullName)
            };

            mailer.SendMail(mail);
        }
    }
}