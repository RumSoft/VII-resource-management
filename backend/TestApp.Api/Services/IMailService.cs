using TestApp.Api.Models.Mailing;

namespace TestApp.Api.Services
{
    public interface IMailerService
    {
        void SendMail(MailMessage message);
    }
}