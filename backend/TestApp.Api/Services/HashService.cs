namespace TestApp.Api.Services
{
    public interface IHashService
    {
        string HashPassword(string input);
        bool VerifyPassword(string input, string hashedPassword);
    }
}