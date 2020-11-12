using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Auth
{
    public class RefreshTokenCommand : Query<RefreshTokenCommand.RefreshTokenCommandResult>
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;
        private readonly ILogger<RefreshTokenCommand> _logger;
        private readonly ITokenManager _tokenManager;
        private readonly IUserInfo _userInfo;

        public RefreshTokenCommand(DataContext context, IHashService hashService, ITokenManager tokenManager, IUserInfo userInfo, ILogger<RefreshTokenCommand> logger)
        {
            _context = context;
            _hashService = hashService;
            _tokenManager = tokenManager;
            _userInfo = userInfo;
            _logger = logger;
        }

        [Authorize]
        [HttpPost("auth/refresh-token")]
        public override ActionResult<RefreshTokenCommandResult> Execute()
        {
            try
            {
                var user = _userInfo.GetCurrentUser();
                var newToken = _tokenManager.Generate(user);

                Log.Information("User {userId} refreshed token", user.Id);

                return Ok(new RefreshTokenCommandResult
                {
                    Token = newToken.AccessToken,
                    Role = user.Role
                });
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Couldn't refresh auth token for user {userId}", _userInfo.Id);
                return BadRequest(e);
            }
        }

        public class RefreshTokenCommandResult
        {
            public string Token { get; set; }
            public string Role { get; set; }
        }
    }
}