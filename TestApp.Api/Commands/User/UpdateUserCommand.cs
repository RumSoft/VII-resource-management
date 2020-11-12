using System;
using System.Linq;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.User
{
    public class UpdateUserCommand : Command<UpdateUserCommand.UpdateUserCommandInput>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UpdateUserCommand(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [OnlyAdmin]
        [HttpPut("user")]
        public override IActionResult Execute([FromBody] UpdateUserCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var user = _context.Users.Find(input.Id);
                if (user == null)
                    return BadRequest(ReturnMessages.Message_400_UserNotFound);

                var isEmailUsed = _context.Users.Any(x => x.EmailAddress == input.EmailAddress && user.Id != input.Id);
                if (isEmailUsed)
                    return BadRequest(ReturnMessages.Message_400_UserExists);

                user = _mapper.Map(input, user);
                _context.Users.Update(user);
                _context.SaveChanges();
                Log.Information("Updated user {user}", user);
                return Ok();
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't update user {input}", input);
                return BadRequest(e);
            }
        }

        public class UpdateUserCommandInput : UserDto
        {
        }

        public class UpdateUserCommandInputValidator : AbstractValidator<UpdateUserCommandInput>
        {
            public UpdateUserCommandInputValidator()
            {
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.FirstName).Transform(x => x.Cleanup()).NameValidator().WithName("Imię");
                RuleFor(x => x.LastName).Transform(x => x.Cleanup()).NameValidator().WithName("Nazwisko");
                RuleFor(x => x.EmailAddress).Transform(x => x.Cleanup()).EmailAddressValidator().WithName("Adres e-mail");
            }
        }
    }
}