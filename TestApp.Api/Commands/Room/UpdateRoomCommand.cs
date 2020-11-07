using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.Room
{
    public class UpdateRoomCommand : Command<UpdateRoomCommand.UpdateRoomCommandInput>
    {
        private readonly DataContext _context;

        public UpdateRoomCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpPut("room")]
        public override IActionResult Execute([FromBody] UpdateRoomCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var room = _context.Rooms.Find(input.Id);
                if (room == null)
                    return BadRequest(ReturnMessages.Message_400_RoomNotFound);

                if (room.Name.Equals(input.Name, StringComparison.InvariantCultureIgnoreCase))
                    return Ok();

                if (_context.Rooms.Any(x => x.Name == input.Name))
                    return BadRequest(ReturnMessages.Message_400_RoomAlreadyExists);

                room.Name = input.Name.Cleanup();
                _context.Rooms.Update(room);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class UpdateRoomCommandInput : IdName
        {

        }

        public class UpdateRoomCommandInputValidator : AbstractValidator<UpdateRoomCommandInput>
        {
            public UpdateRoomCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).RoomNameValidator().WithName("Nazwa");
            }
        }
    }
}