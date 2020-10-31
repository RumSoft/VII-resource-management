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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public UserInfo(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        private IEnumerable<Claim> Claims => _httpContextAccessor?.HttpContext?.User?.Claims;
        public string Role => Claims.First(x => x.Type == ClaimTypes.Role)?.Value;

        public bool IsLogged => _httpContextAccessor.HttpContext.User.Identity.IsAuthenticated;

        public bool IsAdmin => IsLogged && Role == Roles.Admin;

        public User GetCurrentUser()
        {
            var user = _context.Users.Find(Id);
            return user;
        }

        public string EmailAddress => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value;
        private string _id => Claims.FirstOrDefault(x => x.Type == ClaimTypes.Sid)?.Value;
        public Guid Id => _id == null ? Guid.Empty : new Guid(_id);
    }
}