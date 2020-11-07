using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
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
                var attribute = _context.Attributes.Find(input.Id);
                if (attribute == null)
                    return BadRequest(ReturnMessages.Message_400_AttributeNotFound);

                if (attribute.Name.Equals(input.Name, StringComparison.InvariantCultureIgnoreCase))
                    return Ok();

                if (_context.Attributes.Any(x => x.Name == input.Name))
                    return BadRequest(ReturnMessages.Message_400_AttributeAlreadyExists);

                attribute.Name = input.Name.Cleanup();
                _context.Attributes.Update(attribute);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class UpdateAttributeCommandInput : IdNameColor
        { }

        public class UpdateAttributeCommandInputValidator : AbstractValidator<UpdateAttributeCommandInput>
        {
            public UpdateAttributeCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).AttributeNameValidator().WithName("Nazwa");
            }
        }
    }
}