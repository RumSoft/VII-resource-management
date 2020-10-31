using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;
        private readonly ITokenManager _tokenManager;
        private readonly IUserInfo _userInfo;

        public AuthController(DataContext context, ITokenManager tokenManager, IUserInfo userInfo, IHashService hashService)
        {
            _context = context;
            _tokenManager = tokenManager;
            _userInfo = userInfo;
            _hashService = hashService;
        }

        [HttpPost]
        [Route("")]
        public ActionResult<AuthResult> Validate(LoginDto dto)
        {
            var badRequest = BadRequest(new AuthResult
            {
                IsSuccess = false
            });

            var user = _context.Users.FirstOrDefault(x => x.EmailAddress == dto.EmailAddress);
            if (user == null)
                return badRequest;

            if (!_hashService.VerifyPassword(dto.Password, user.Password))
                return badRequest;

            return Ok(
                new AuthResult
                {
                    IsSuccess = true,
                    Token = _tokenManager.Generate(user),
                    Role = user.Role
                });
        }

        public class AuthResult
        {
            public bool IsSuccess { get; set; }
            public AuthToken Token { get; set; }
            public string Role { get; set; }
        }

        public class LoginDto
        {
            public string EmailAddress { get; set; }
            public string Password { get; set; }
        }
    }
}