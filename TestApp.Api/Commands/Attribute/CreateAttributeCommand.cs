﻿using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
                    Name = input.Name.Cleanup(),
                    Color = input.Color
                };

                _context.Attributes.Add(attr);
                _context.SaveChanges();
                Log.Information("Attribute added: {attribute}'", attr);
                return Ok();
            }
            catch (Exception e)
            {
                Log.Error(e, "Attribute not added");
                return BadRequest(e);
            }
        }

        public class CreateAttributeCommandInput
        {
            public string Name { get; set; }
            public string Color { get; set; }
        }

        public class CreateAttributeCommandInputValidator : AbstractValidator<CreateAttributeCommandInput>
        {
            public CreateAttributeCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).AttributeNameValidator().WithName("Nazwa");
                RuleFor(x => x.Color).HexColorValidator().WithName("Kolor");
            }
        }
    }
}