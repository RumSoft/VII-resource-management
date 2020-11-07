using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Attribute
{
    public class GetAttributesCommand : Query<GetAttributesCommand.GetAttributesCommandResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetAttributesCommand(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("attribute")]
        public override ActionResult<GetAttributesCommandResult> Execute()
        {
            var attributes = _context.Attributes;
            var result = _mapper.Map<GetAttributesCommandResult[]>(attributes.ToList());
            return Ok(result);
        }

        public class GetAttributesCommandResult
        {
            public string Name { get; set; }
            public int Id { get; set; }
        }
    }
}