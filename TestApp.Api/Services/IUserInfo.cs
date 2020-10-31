using System;
using TestApp.Api.Data;
using TestApp.Api.Models;

namespace TestApp.Api.Services
{
    public interface IUserInfo
    {
        bool IsLogged { get; }
        bool IsAdmin { get; }
        string EmailAddress { get; }
        Guid Id { get; }

        User GetCurrentUser();
    }
}