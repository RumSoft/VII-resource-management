using System;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
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

            try
            {
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

                var createResourceCommand = new CreateResourceCommand(_context, _userInfo);
                var newResourceResult = createResourceCommand.Execute(_mapper.Map<CreateResourceCommand.CreateResourceCommandInput>(input));

                if (!(newResourceResult.Result is OkObjectResult r))
                {
                    throw new Exception(ReturnMessages.CatastrophicFailure);
                }

                baseResource.Quantity -= input.Quantity;
                _context.Resources.Update(baseResource);
                _context.SaveChanges();

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }
    }
}