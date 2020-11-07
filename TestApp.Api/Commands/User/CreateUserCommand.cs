using System;
using System.Linq;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.User
{
    public class CreateUserCommand : Command<CreateUserCommand.CreateUserCommandInput>
    {
        private readonly DataContext _context;
        private readonly IHashService _hashService;
        private readonly IMailerService _mailer;
        private readonly IMapper _mapper;

        public CreateUserCommand(DataContext context, IMapper mapper, IMailerService mailer, IHashService hashService)
        {
            _context = context;
            _mapper = mapper;
            _mailer = mailer;
            _hashService = hashService;
        }

        [OnlyAdmin]
        [HttpPost("user")]
        public override IActionResult Execute([FromBody] CreateUserCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var exists = _context.Users.FirstOrDefault(x => x.EmailAddress == input.EmailAddress);
                if (exists != null)
                    return BadRequest(ReturnMessages.Message_400_UserExists);

                var user = _mapper.Map<Models.User>(input);

                PasswordResetHelper.RandomizePasswordAndSendPasswordReset(user, _context, _mailer, _hashService);

                _context.Add((object) user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class CreateUserCommandInput
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string EmailAddress { get; set; }
        }

        public class AddUserCommandInputValidator : AbstractValidator<CreateUserCommandInput>
        {
            public AddUserCommandInputValidator()
            {
                RuleFor(x => x.FirstName).Transform(x => x.Cleanup()).NameValidator().WithName("Imię");
                RuleFor(x => x.LastName).Transform(x => x.Cleanup()).NameValidator().WithName("Nazwisko");
                RuleFor(x => x.EmailAddress).Transform(x => x.Cleanup()).EmailAddressValidator().WithName("Adres e-mail");
            }
        }
    }
}