using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using TestApp.Api.Data;
using TestApp.Api.Models;

namespace TestApp.Api.Services.Impl
{
    public class UserInfo : IUserInfo
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserInfo(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        private IEnumerable<Claim> Claims => _httpContextAccessor?.HttpContext?.User?.Claims;
        public string Role => Claims.First(x => x.Type == ClaimTypes.Role)?.Value;

        public bool IsLogged => _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated;

        public bool IsAdmin => IsLogged && Role == Roles.Admin;

        public User GetCurrentUser(DataContext context)
        {
            var user = context.Users.Find(Id);
            return user;
        }

        public string EmailAddress => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        public string Id => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid)?.Value;
    }
}