using TestApp.Api.Data;
using TestApp.Api.Models;

namespace TestApp.Api.Services
{
    public interface IUserInfo
    {
        bool IsLogged { get; }
        bool IsAdmin { get; }
        string EmailAddress { get; }
        string Id { get; }

        User GetCurrentUser(DataContext context);
    }
}