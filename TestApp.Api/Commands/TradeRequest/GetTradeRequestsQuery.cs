using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.TradeRequest
{
    public class GetTradeRequestsQuery : Query<GetTradeRequestsQuery.GetTradeRequestsQueryResult>
    {
        private readonly DataContext _context;
        private readonly IUserInfo _userInfo;
        private readonly IMapper _mapper;

        public GetTradeRequestsQuery(DataContext context, IUserInfo userInfo, IMapper mapper)
        {
            _context = context;
            _userInfo = userInfo;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("trade-request")]
        public override ActionResult<GetTradeRequestsQueryResult> Execute()
        {
            try
            {
                var tr = _context.TradeRequests.AsQueryable();

                var user = _userInfo.GetCurrentUser();
                if (!_userInfo.IsAdmin)
                    tr = tr.Where(x => x.Taker == user || x.Resource.Owner == user);

                var result = _mapper.Map<GetTradeRequestsQueryResult[]>(tr.ToList());
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class GetTradeRequestsQueryResult
        {
            public Guid Id { get; set; }
            public UserDto Owner { get; set; }
            public UserDto Taker { get; set; }
            public ResourceDto Resource { get; set; }
        }
    }
}