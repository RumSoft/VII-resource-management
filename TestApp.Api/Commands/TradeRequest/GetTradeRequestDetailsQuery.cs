using System;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.TradeRequest
{
    public class GetTradeRequestsDetailsQuery : Command<Guid, GetTradeRequestsDetailsQuery.GetTradeRequestsDetailsQueryResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public GetTradeRequestsDetailsQuery(DataContext context, IUserInfo userInfo, IMapper mapper)
        {
            _context = context;
            _userInfo = userInfo;
            _mapper = mapper;
        }

        [Authorize]
        [HttpGet("trade-request/{id}")]
        public override ActionResult<GetTradeRequestsDetailsQueryResult> Execute(Guid id)
        {
            try
            {
                var tr = _context.TradeRequests.Find(id);
                if (tr == null)
                    return BadRequest(ReturnMessages.Message_400_TradeRequestNotFound);

                var result = _mapper.Map<GetTradeRequestsDetailsQueryResult>(tr);
                return Ok(result);
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't get trade request {id} details", id);
                return BadRequest(e);
            }
        }

        public class GetTradeRequestsDetailsQueryResult
        {
            public Guid Id { get; set; }
            public UserDto Owner { get; set; }
            public UserDto Taker { get; set; }
            public ResourceDto Resource { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime? FinalizedAt { get; set; }
        }
    }
}