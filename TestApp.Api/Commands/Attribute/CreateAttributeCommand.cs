using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;

namespace TestApp.Api.Commands.Attribute
{
    public class CreateAttributeCommand : Command<CreateAttributeCommand.CreateAttributeCommandInput>
    {
        private readonly DataContext _context;

        public CreateAttributeCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpPost("attribute")]
        public override IActionResult Execute([FromBody] CreateAttributeCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var attr = new Models.Attribute
                {
                    Name = input.Name.Cleanup()
                };

                _context.Attributes.Add(attr);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class CreateAttributeCommandInput
        {
            public string Name { get; set; }
        }

        public class CreateAttributeCommandInputValidator : AbstractValidator<CreateAttributeCommandInput>
        {
            public CreateAttributeCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).AttributeNameValidator().WithName("Nazwa");
            }
        }
    }
}