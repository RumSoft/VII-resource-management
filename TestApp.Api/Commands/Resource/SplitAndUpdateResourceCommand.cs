using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Resource
{
    public class SplitAndUpdateResourceCommand : Command<UpdateResourceCommand.UpdateResourceCommandInput>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public SplitAndUpdateResourceCommand(DataContext context, IUserInfo userInfo, IMapper mapper)
        {
            _context = context;
            _userInfo = userInfo;
            _mapper = mapper;
        }

        [OnlyUser]
        [HttpPost("resource/split-and-update")]
        public override IActionResult Execute([FromBody] UpdateResourceCommand.UpdateResourceCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var transaction = _context.Database.BeginTransaction();

            try
            {
                //prepare resource
                var baseResource = _context.Resources.Find(input.Id);
                if (baseResource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);

                var user = _userInfo.GetCurrentUser();
                if (user == null || baseResource.Owner != user)
                    return BadRequest(ReturnMessages.CatastrophicFailure);

                if (input.Quantity > baseResource.Quantity)
                {
                    ModelState.AddModelError("Quantity", ReturnMessages.Message_400_TooBigSplitAmount);
                    return BadRequest(ModelState);
                }

                baseResource.Quantity -= input.Quantity;
                _context.Resources.Update(baseResource);
                _context.SaveChanges();

                //create new resource
                var newResource = new Models.Resource()
                {
                    Owner = user,
                    Quantity = input.Quantity,
                    Name = input.Name,
                    Room =  _context.Rooms.Find(input.Room ?? -1),
                    Attributes = _context.Attributes.Where(x => (input.Attributes ?? new int[0]).Contains(x.Id)).ToList()
                };
                _context.Resources.Add(newResource);
                _context.SaveChanges();

                // merge with existing
                Log.Information("Trying to merge resource {id}: {name}", newResource.Id, newResource.Name);
                var mergedCount = ResourceMerger.TryMergeByResource(newResource, _context);
                Log.Warning("Merged {mergedCount} resources", mergedCount);

                transaction.Commit();
                Log.Information("Split resource {id}: {name} to new {@input}", baseResource.Id, baseResource.Name, input);
                return Ok();
            }
            catch (Exception e)
            {
                transaction.Rollback();
                Log.Error(e, "Couldn't split and update resource {@input}", input);
                return BadRequest(e);
            }
        }
    }
}