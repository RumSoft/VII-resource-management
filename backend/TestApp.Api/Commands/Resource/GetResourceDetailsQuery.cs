using System;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.Resource
{
    public class GetResourceDetailsCommand : Command<Guid, GetResourceDetailsCommand.GetResourceDetailsCommandResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetResourceDetailsCommand(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("resource/{id}")]
        public override ActionResult<GetResourceDetailsCommandResult> Execute([FromRoute] Guid id)
        {
            try
            {
                var resource = _context.Resources.Find(id);
                if (resource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);

                var result = _mapper.Map<GetResourceDetailsCommandResult>(resource);
                return Ok(result);
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't get resource {id} details", id);
                return BadRequest(e);
            }
        }

        public class GetResourceDetailsCommandResult : ResourceDto
        {
            public DateTime CreatedAt => DateTime.Today;
            public DateTime ModifiedAt => DateTime.Now;
            public bool IsLocked { get; set; }
            public Guid? TradeRequest { get; set; }
        }
    }
}