using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Resource
{
    public class CreateResourceCommand
        : Command<CreateResourceCommand.CreateResourceCommandInput, CreateResourceCommand.CreateResourceCommandResult>
    {
        private readonly DataContext _context;
        private readonly IUserInfo _userInfo;

        public CreateResourceCommand(DataContext context, IUserInfo userInfo)
        {
            _context = context;
            _userInfo = userInfo;
        }

        [OnlyUser]
        [HttpPost("resource")]
        public override ActionResult<CreateResourceCommandResult> Execute([FromBody] CreateResourceCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                //add resource
                var resource = new Models.Resource
                {
                    Name = input.Name.Cleanup(),
                    Quantity = input.Quantity
                };

                var user = _userInfo.GetCurrentUser();
                if (user == null)
                    return BadRequest(ReturnMessages.CatastrophicFailure);
                resource.Owner = user;

                if (input.Room != null && input.Room >= 0)
                    resource.Room = _context.Rooms.Find(input.Room);
                else
                    resource.Room = null;
                
                if (input.Attributes != null && input.Attributes.Length > 0)
                    resource.Attributes = _context.Attributes.Where(x => input.Attributes.Contains(x.Id)).ToList();

                _context.Resources.Add(resource);
                _context.SaveChanges();

                //merge with existing
                ResourceMerger.TryMergeByResource(resource, _context);

                transaction.Commit();

                return Ok(new CreateResourceCommandResult
                {
                    Id = resource.Id
                });
            }
            catch (Exception e)
            {
                transaction.Rollback();
                return BadRequest(e);
            }
        }

        public class CreateResourceCommandInput
        {
            public string Name { get; set; }
            public int Quantity { get; set; }
            public int[] Attributes { get; set; }
            public int? Room { get; set; }
        }

        public class CreateResourceCommandResult
        {
            public Guid Id { get; set; }
        }

        public class CreateResourceCommandInputValidator : AbstractValidator<CreateResourceCommandInput>
        {
            public CreateResourceCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).ResourceNameValidator().WithName("Nazwa zasobu");
                RuleFor(x => x.Quantity > 0);
            }
        }
    }
}