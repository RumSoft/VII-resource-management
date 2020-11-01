using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : RumsoftController
    {
        private const string UserDoesNotExistOrPasswordInvalid = "";

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
        [Route("login")]
        public ActionResult<AuthResult> Login(LoginDto dto)
        {
            var user = _context.Users.FirstOrDefault(x => x.EmailAddress == dto.EmailAddress);
            if (user == null)
                return BadRequest(UserDoesNotExistOrPasswordInvalid);

            if (!_hashService.VerifyPassword(dto.Password, user.Password))
                return BadRequest(UserDoesNotExistOrPasswordInvalid);

            return Ok(
                new AuthResult
                {
                    IsSuccess = true,
                    Token = _tokenManager.Generate(user),
                    Role = user.Role
                });
        }

        [Authorize]
        [HttpPost]
        [Route("refresh")]
        public ActionResult<AuthResult> Refresh()
        {
            return Ok(
                new AuthResult
                {
                    IsSuccess = true,
                    Role = _userInfo.Role,
                    Token = _tokenManager.Generate(_userInfo.GetCurrentUser())
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