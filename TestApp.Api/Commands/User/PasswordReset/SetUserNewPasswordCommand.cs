using System;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.User.PasswordReset
{
    public class SetUserNewPasswordCommand : Command<SetUserNewPasswordCommand.SetUserNewPasswordCommandInput>
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;

        public SetUserNewPasswordCommand(DataContext context, IHashService hashService)
        {
            _context = context;
            _hashService = hashService;
        }

        [AllowAnonymous]
        [HttpPost("user/new-password")]
        public override IActionResult Execute([FromBody] SetUserNewPasswordCommandInput input)
        {
            try
            {
                var tokenEntity = _context.Tokens.Find(input.Token);
                if (tokenEntity == null || tokenEntity.IsUsed)
                    return BadRequest(ReturnMessages.Message_400_TokenInvalid);

                var user = _context.Users.Find(tokenEntity.ParentId);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                if (!user.IsGeneratedPassword)
                    throw new Exception(ReturnMessages.Message_400_UserCannotResetPassword);

                user.Password = _hashService.HashPassword(input.Password);
                user.IsGeneratedPassword = false;

                _context.Users.Update(user);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class SetUserNewPasswordCommandInput
        {
            public string Password { get; set; }
            public string Token { get; set; }
        }

        public class SetUserNewPasswordCommandInputValidator : AbstractValidator<SetUserNewPasswordCommandInput>
        {
            public SetUserNewPasswordCommandInputValidator()
            {
                RuleFor(x => x.Token).NotEmpty();
                RuleFor(x => x.Password).Transform(x => x.Cleanup()).PasswordValidator().WithName("Hasło");
            }
        }
    }
}