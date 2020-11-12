using System;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
                var token = _context.Tokens.Find(input.Token);
                if (token == null || token.IsUsed || DateTime.Now > token.ExpiresAt)
                    return BadRequest(ReturnMessages.Message_400_TokenInvalid);

                var user = _context.Users.Find(token.ParentId);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                token.IsUsed = true;
                user.Password = _hashService.HashPassword(input.Password);
                user.IsGeneratedPassword = false;

                _context.Tokens.Update(token);
                _context.Users.Update(user);
                _context.SaveChanges();

                Log.Information("Set new password for user {id}: {email}", user.Id, user.EmailAddress);

                return Ok();
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't set new password for reset-token {token}", input.Token);
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