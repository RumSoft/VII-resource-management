using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;

namespace TestApp.Api.Commands.Room
{
    public class CreateRoomCommand : Command<CreateRoomCommand.AddRoomCommandInput>
    {
        private readonly DataContext _context;

        public CreateRoomCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpPost("room")]
        public override IActionResult Execute([FromBody] AddRoomCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var room = new Models.Room
                {
                    Name = input.Name.Cleanup()
                };

                _context.Add(room);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class AddRoomCommandInput
        {
            public string Name { get; set; }
        }

        public class AddRoomCommandInputValidator : AbstractValidator<AddRoomCommandInput>
        {
            public AddRoomCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).RoomNameValidator().WithName("Nazwa");
            }
        }
    }
}