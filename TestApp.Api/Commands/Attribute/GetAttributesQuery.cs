using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.Attribute
{
    public class GetAttributesQuery : Query<IdNameColor>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetAttributesQuery(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("attribute")]
        public override ActionResult<IdNameColor> Execute()
        {
            try
            {
                var attributes = _context.Attributes;
                var result = _mapper.Map<IdNameColor[]>(attributes.ToList());
                return Ok(result);
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't get attributes");
                return BadRequest(e);
            }
        }
    }
}