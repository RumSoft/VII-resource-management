using System;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Text.Encodings.Web;
using System.Web;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Mailing;
using TestApp.Api.Services;
using TestApp.Api.Services.Impl;

namespace TestApp.Api.Helpers
{
    public static class PasswordResetHelper
    {
        private static readonly IRandomPasswordGenerator _generator = new RandomPasswordGenerator();

        public static string RandomizePasswordAndSendPasswordReset(User user, DataContext context, IMailerService mailer, IHashService hashService)
        {
            var password = _generator.Generate();
            user.Password = hashService.HashPassword(password);
            user.IsGeneratedPassword = true;

            return SendPasswordChangeLinkToUser(user, context, mailer);
        }

        public static string SendPasswordChangeLinkToUser(User user, DataContext context, IMailerService mailer)
        {
            var token = CreatePaswordResetToken(user);
            context.Tokens.Add(token);
            context.SaveChanges();

            var mail = CreatePasswordResetMessage(user, token);
            mailer.SendMail(mail);

            return token.Value;
        }

        private static Token CreatePaswordResetToken(User user)
        {
            return new Token
            {
                CreatedAt = DateTime.Now,
                ExpiresAt = DateTime.Now.AddDays(1),
                IsUsed = false,
                ParentId = user.Id,
                Type = TokenType.PasswordReset,
                Value = Guid.NewGuid().ToString()
            };
        }

        private static MailMessage CreatePasswordResetMessage(User user, Token token)
        {
            var appUrl = HttpUtility.HtmlEncode(AppConfig.Url);
            var resetUrl = HttpUtility.HtmlEncode(string.Format(AppConfig.PasswordResetUrl, token.Value));
            var userName = HttpUtility.HtmlEncode(user.FullName);

            var sb = new StringBuilder()
                .AppendLine("<html><body>")
                .AppendLine("<h1>Ustawienie nowego hasła do Resource Manager </h1>")
                .AppendLine("<hr />")
                .AppendLine($"<p><b>Witam {userName}</b></p>")
                .AppendLine($"<p>Aby ustawić nowe haslo do naszej aplikacji musisz wejść na podany adres:</p>")
                .AppendLine($"<p><a href=\"{resetUrl}\">{resetUrl}</a></p>")
                .AppendLine($"<br /><br /></ br/>")
                .AppendLine($"<p>Pozdrawiam</p>")
                .AppendLine($"<p><a href={appUrl}>RumSoft Resource Manager</ a></p>");

            return new MailMessage
            {
                Body = sb.ToString(),
                Subject = "Twoje nowe hasło do Resource Manager",
                IsBodyHtml = true,
                To = new MailAddress(user.EmailAddress, user.FirstName, user.LastName)
            };
        }
    }
}