using System;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.User.PasswordReset
{
    public class ResetUserPasswordCommand : Command<Guid, ResetUserPasswordCommand.ResetUserPasswordCommandOutput>
    {
        private readonly DataContext _context;
        private readonly IMailerService _mailer;

        public ResetUserPasswordCommand(DataContext context, IMailerService mailer)
        {
            _context = context;
            _mailer = mailer;
        }

        [OnlyAdmin]
        [HttpGet("user/reset-password/{id}")]
        public override ActionResult<ResetUserPasswordCommandOutput> Execute([FromRoute] Guid id)
        {
            var transaction = _context.Database.BeginTransaction();
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                var token = PasswordResetHelper.SendPasswordChangeLinkToUser(user, _context, _mailer);

                transaction.Commit();

                return Ok(new ResetUserPasswordCommandOutput
                {
                    Token = token
                });
            }
            catch (Exception e)
            {
                transaction.Rollback();
                return BadRequest(e);
            }
        }

        public class ResetUserPasswordCommandOutput
        {
            public string Token { get; set; }
        }
    }
}