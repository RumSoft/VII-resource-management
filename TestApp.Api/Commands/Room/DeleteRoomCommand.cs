using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Room
{
    public class DeleteRoomCommand : Command<int>
    {
        private readonly DataContext _context;

        public DeleteRoomCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpDelete("room/{id}")]
        public override IActionResult Execute([FromRoute] int id)
        {
            try
            {
                var room = _context.Rooms.Find(id);
                if (room == null)
                    return BadRequest(ReturnMessages.Message_400_RoomNotFound);

                if (room.Resources.Any())
                    return BadRequest(ReturnMessages.Message_400_RoomContainsResources);

                _context.Rooms.Remove(room);
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