using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Auth
{
    public class LoginCommand : Command<LoginCommand.LoginCommandInput>
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;
        private readonly ITokenManager _tokenManager;

        public LoginCommand(DataContext context, IHashService hashService, ITokenManager tokenManager)
        {
            _context = context;
            _hashService = hashService;
            _tokenManager = tokenManager;
        }

        [AllowAnonymous]
        [HttpPost("auth/login")]
        public override IActionResult Execute([FromBody] LoginCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = _context.Users.FirstOrDefault(x => x.EmailAddress == input.EmailAddress);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotExistOrInvalidPassword);

                if (!_hashService.VerifyPassword(input.Password, user.Password))
                    return BadRequest(ReturnMessages.Message_400_UserNotExistOrInvalidPassword);

                var token = _tokenManager.Generate(user);
                var role = user.Role;
                Response.Headers.Add("Authorization", $"Bearer {token.AccessToken}");
                Response.Headers.Add("Role", $"{role}");

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class LoginCommandInput
        {
            public string EmailAddress { get; set; }
            public string Password { get; set; }
        }

        public class LoginCommandInputValidator : AbstractValidator<LoginCommandInput>
        {
            public LoginCommandInputValidator()
            {
                RuleFor(x => x.EmailAddress).EmailAddressValidator().WithName("Adres e-mail");
                RuleFor(x => x.Password).PasswordValidator().WithName("Hasło");
            }
        }
    }
}