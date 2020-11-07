using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Resource
{
    public class GetResourcesCommand : Query<GetResourcesCommand.GetResourcesCommandResult[]>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public GetResourcesCommand(IMapper mapper, DataContext context, IUserInfo userInfo)
        {
            _mapper = mapper;
            _context = context;
            _userInfo = userInfo;
        }

        [Authorize]
        [HttpGet("resource")]
        public override ActionResult<GetResourcesCommandResult[]> Execute()
        {
            var resources = _context.Resources.AsQueryable();
            
            if (!_userInfo.IsAdmin)
                resources = resources.Where(x => x.Owner.Id == _userInfo.Id);

            var result = _mapper.Map<GetResourcesCommandResult[]>(resources);
            return Ok(result);
        }

        public class GetResourcesCommandResult
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public int Quantity { get; set; }
            public GetResourcesCommandResultRoom Room { get; set; }
            public GetResourcesCommandResultAttribute[] Attributes { get; set; }

            public class GetResourcesCommandResultRoom
            {
                public int Id { get; set; }
                public string Name { get; set; }
            }

            public class GetResourcesCommandResultAttribute
            {
                public int Id { get; set; }
                public string Name { get; set; }
            }
        }
    }
}