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
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Resource
{
    public class UpdateResourceCommand : Command<UpdateResourceCommand.UpdateResourceCommandInput>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public UpdateResourceCommand(DataContext context, IMapper mapper, IUserInfo userInfo)
        {
            _context = context;
            _mapper = mapper;
            _userInfo = userInfo;
        }

        [OnlyUser]
        [HttpPut("resource")]
        public override IActionResult Execute([FromBody] UpdateResourceCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();
            try
            {
                //add resource
                var resource = _context.Resources.Find(input.Id);
                if (resource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);

                var user = _userInfo.GetCurrentUser();
                if (user == null || resource.Owner != user)
                    return BadRequest(ReturnMessages.CatastrophicFailure);

                resource.Name = input.Name.Cleanup();
                resource.Quantity = input.Quantity;

                //set room
                //https://github.com/dotnet/efcore/issues/6504
                Models.Room roomToSet = null;
                if (input.Room != null && input.Room >= 0)
                    roomToSet = _context.Rooms.Find(input.Room);
                if (roomToSet != null)
                    resource.Room = roomToSet;
                else
                    _context.Entry(resource).Property("RoomId").CurrentValue = null;

                resource.Attributes.Clear();
                if (input.Attributes != null && input.Attributes.Length > 0)
                    resource.Attributes = _context.Attributes.Where(x => input.Attributes.Contains(x.Id)).ToList();

                _context.Resources.Update(resource);
                _context.SaveChanges();

                //merge with existing
                Log.Information("Trying to merge resource");
                var mergedCount = ResourceMerger.TryMergeByResource(resource, _context);
                Log.Warning("Merged {mergedCount} resources", mergedCount);

                _context.SaveChanges();
                transaction.Commit();
                Log.Information("Updated resource {resid}: {resname}", resource.Id, resource.Name);
                return Ok(new CreateResourceCommand.CreateResourceCommandResult
                {
                    Id = resource.Id
                });
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't update resource {@input}", input);
                transaction.Rollback();
                return BadRequest(e);
            }
        }

        public class UpdateResourceCommandInput : GuidName
        {
            public int Quantity { get; set; }
            public int[] Attributes { get; set; }
            public int? Room { get; set; }
        }

        public class UpdateResourceCommandInputValidator : AbstractValidator<UpdateResourceCommandInput>
        {
            public UpdateResourceCommandInputValidator()
            {
                RuleFor(x => x.Name).Transform(x => x.Cleanup()).ResourceNameValidator().WithName("Nazwa");
                RuleFor(x => x.Id).NotEmpty();
                RuleFor(x => x.Quantity).GreaterThan(0).WithName("Ilość");
            }
        }
    }
}