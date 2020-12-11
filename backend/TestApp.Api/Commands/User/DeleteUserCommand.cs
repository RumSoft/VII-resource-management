using System;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.User
{
    public class DeleteUserCommand : Command<Guid>
    {
        private readonly DataContext _context;

        public DeleteUserCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpDelete("user/{id}")]
        public override IActionResult Execute([FromRoute] Guid id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                _context.Users.Remove(user);
                _context.SaveChanges();
                Log.Information("User deleted {id}: {email}", user.Id, user.EmailAddress);
                return Ok();
            }

            catch (Exception e)
            {
                Log.Error(e, "Couldn't delete user {id}", id);
                return BadRequest(e);
            }
        }
    }
}