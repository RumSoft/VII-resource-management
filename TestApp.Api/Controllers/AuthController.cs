using System.Linq;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [Route("[controller]")]
    [ApiController]
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
                    Token = _tokenManager.Generate(user)
                });
        }


        [HttpGet]
        [Route("info")]
        public ActionResult<string> Info()
        {
            var sb = new StringBuilder("hello! ");
            if (_userInfo.IsLogged)
            {
                sb.AppendLine("i am logged");
                if (_userInfo.IsAdmin)
                    sb.AppendLine("i am admin");

                sb.AppendLine($"my jwt email is: {_userInfo.EmailAddress}");
                sb.AppendLine($"my jwt id is: {_userInfo.Id}");
            }
            else
            {
                sb.AppendLine("i am not logged");
            }

            return Ok(sb.ToString());
        }


        public class AuthResult
        {
            public bool IsSuccess { get; set; }
            public AuthToken Token { get; set; }
        }

        public class LoginDto
        {
            public string EmailAddress { get; set; }
            public string Password { get; set; }
        }
    }
}