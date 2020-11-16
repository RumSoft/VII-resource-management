using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.Attribute
{
    public class UpdateAttributeCommand : Command<UpdateAttributeCommand.UpdateAttributeCommandInput>
    {
        private readonly DataContext _context;

        public UpdateAttributeCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpPut("attribute")]
        public override IActionResult Execute([FromBody] UpdateAttributeCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var name = input.Name.Cleanup();

                var attribute = _context.Attributes.Find(input.Id);
                if (attribute == null)
                    return BadRequest(ReturnMessages.Message_400_AttributeNotFound);

                if (_context.Attributes.Any(x => x.Name == name && x.Id != input.Id))
                    return BadRequest(ReturnMessages.Message_400_AttributeAlreadyExists);

                attribute.Name = name;
                attribute.Color = input.Color;
                _context.Attributes.Update(attribute);
                _context.SaveChanges();
                Log.Information("Updated attribute {id}: {name}", attribute.Id, attribute.Name);
                return Ok();
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't update attribute {@input}", input);
                return BadRequest(e);
            }
        }

        public class UpdateAttributeCommandInput : IdNameColor
        {
        }

        public class UpdateAttributeCommandInputValidator : AbstractValidator<UpdateAttributeCommandInput>
        {
            public UpdateAttributeCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).AttributeNameValidator().WithName("Nazwa");
                RuleFor(x => x.Color).HexColorValidator().WithName("Kolor");
            }
        }
    }
}