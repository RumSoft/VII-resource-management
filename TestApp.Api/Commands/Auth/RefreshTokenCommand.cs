using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Auth
{
    public class RefreshTokenCommand : Command
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;
        private readonly ITokenManager _tokenManager;
        private readonly IUserInfo _userInfo;

        public RefreshTokenCommand(DataContext context, IHashService hashService, ITokenManager tokenManager, IUserInfo userInfo)
        {
            _context = context;
            _hashService = hashService;
            _tokenManager = tokenManager;
            _userInfo = userInfo;
        }

        [Authorize]
        [HttpPost("auth/refresh-token")]
        public override IActionResult Execute()
        {
            try
            {
                var user = _userInfo.GetCurrentUser();
                var newToken = _tokenManager.Generate(user);

                Response.Headers.Add("Authorization", $"Bearer {newToken.AccessToken}");
                Response.Headers.Add("Role", $"{user.Role}");

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}