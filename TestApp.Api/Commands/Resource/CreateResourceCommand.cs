using System;
using System.Linq;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Serilog;
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
            {   var user = _userInfo.GetCurrentUser();
                if (user == null)
                    return BadRequest(ReturnMessages.CatastrophicFailure);

                //add resource
                var resource = new Models.Resource()
                {
                    Owner = user,
                    Quantity = input.Quantity,
                    Name = input.Name,
                    Room = _context.Rooms.Find(input.Room ?? -1),
                    Attributes = _context.Attributes.Where(x => (input.Attributes ?? new int[0]).Contains(x.Id)).ToList()
                };
                _context.Resources.Add(resource);
                _context.SaveChanges();

                // merge with existing
                Log.Information("Trying to merge resource {id}: {name}", resource.Id, resource.Name);
                var mergedCount = ResourceMerger.TryMergeByResource(resource, _context);
                Log.Warning("Merged {mergedCount} resources", mergedCount);

                transaction.Commit();
                Log.Information("Created resource {id}: {name}", resource.Id, resource.Name);
                return Ok(new CreateResourceCommandResult
                {
                    Id = resource.Id
                });
            }
            catch (Exception e)
            {
                transaction.Rollback();
                Log.Error(e, "Couldn't create resource {@input}, rolling back transaction", input);
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
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).ResourceNameValidator().WithName("Nazwa");
                RuleFor(x => x.Quantity).GreaterThan(0).WithName("Ilość");
            }
        }
    }
}