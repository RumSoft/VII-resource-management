using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Attribute
{
    public class DeleteAttributeCommand : Command<int>
    {
        private readonly DataContext _context;

        public DeleteAttributeCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpDelete("attribute/{id}")]
        public override IActionResult Execute([FromRoute] int id)
        {
            try
            {
                var attr = _context.Attributes.Find(id);
                if (attr == null)
                    return BadRequest(ReturnMessages.Message_400_RoomNotFound);

                if (attr.Resources.Any())
                    return BadRequest(ReturnMessages.Message_400_RoomContainsResources);

                _context.Attributes.Remove(attr);
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