using System;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.User
{
    public class DeleteUserCommand : Command<int>
    {
        private readonly DataContext _context;

        public DeleteUserCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpDelete("user/{id}")]
        public override IActionResult Execute([FromRoute] int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                _context.Users.Remove(user);
                _context.SaveChanges();

                return Ok();
            }

            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}