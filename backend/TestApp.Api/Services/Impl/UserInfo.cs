using System;
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
        private readonly DataContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserInfo(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        private IEnumerable<Claim> Claims => _httpContextAccessor?.HttpContext?.User?.Claims;
        private string _id => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid)?.Value;

        private string _authHeadr => _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
        public string Role => Claims.First(x => x.Type == ClaimTypes.Role)?.Value;

        public bool IsLogged => _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated;

        public bool IsAdmin => IsLogged && Role == UserRoles.Admin;

        public User GetCurrentUser()
        {
            var user = _context.Users.Find(Id);
            return user;
        }

        public string EmailAddress => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        public Guid Id => _id == null ? Guid.Empty : new Guid(_id);
        public string AuthToken => _authHeadr[7..]; //Bearer_TOKEN
    }
}