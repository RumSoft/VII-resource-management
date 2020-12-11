namespace TestApp.Api.Models.Mailing
{
    public class MailAddress : System.Net.Mail.MailAddress
    {
        public MailAddress(string address) : base(address)
        {
        }

        public MailAddress(string address, string name) : base(address, name)
        {
        }

        public MailAddress(string address, string firstName, string lastName) : base(address, $"{firstName} {lastName}")
        {
        }
    }
}