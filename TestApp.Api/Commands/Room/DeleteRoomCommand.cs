using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;

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

                if (AppConfig.CanRemoveRoomsWithResources)
                {
                    if (room.Resources.Any())
                        return BadRequest(ReturnMessages.Message_400_RoomContainsResources);
                }
                else
                {
                    ResourceMerger.TryMergeByRoom(room, _context);
                }

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