using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Resource
{
    public class DeleteResourceCommand : Command<Guid>
    {
        private readonly DataContext _context;

        public DeleteResourceCommand(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpDelete("resource/{id}")]
        public override IActionResult Execute([FromRoute] Guid id)
        {
            try
            {
                var resource = _context.Resources.Find(id);
                if (resource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);

                _context.Resources.Remove(resource);
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