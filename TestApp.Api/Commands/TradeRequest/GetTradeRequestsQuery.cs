using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.TradeRequest
{
    public class GetTradeRequestsQuery : Query<GetTradeRequestsQuery.GetTradeRequestsQueryResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

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

                var result = _mapper.Map<GetTradeRequestsQueryResult[]>(tr.ToList()).Select(x =>
                {
                    x.UserInfo = new GetTradeRequestsQueryResultUserInfo
                    {
                        IsOwner = x.Owner.Id == user.Id,
                        IsTaker = x.Taker.Id == user.Id
                    };
                    return x;
                });

                return Ok(result);
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't get trade requests");
                return BadRequest(e);
            }
        }

        public class GetTradeRequestsQueryResult
        {
            public Guid Id { get; set; }
            public UserDto Owner { get; set; }
            public UserDto Taker { get; set; }
            public ResourceDto Resource { get; set; }
            public GetTradeRequestsQueryResultUserInfo UserInfo { get; set; }
        }

        public class GetTradeRequestsQueryResultUserInfo
        {
            public bool IsTaker { get; set; }
            public bool IsOwner { get; set; }
        }
    }
}