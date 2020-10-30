using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("attributes")]
    public partial class AttributeController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public AttributeController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("")]
        public ActionResult<AttributeDto[]> Get()
        {
            var attrs = _context.Attributes.ToArray();
            var dto = _mapper.Map<AttributeDto[]>(attrs);
            return Ok(dto);
        }

        [OnlyAdmin]
        [HttpPost("")]
        public ActionResult<AttributeDto> Create([FromBody] CreateAttributeDto dto)
        {
            var attr = _mapper.Map<Attribute>(dto);

            _context.Attributes.Add(attr);
            _context.SaveChanges();

            var result = _mapper.Map<AttributeDto>(attr);
            return Ok(result);
        }

        [OnlyAdmin]
        [HttpPut("{id}")]
        public ActionResult<AttributeDto> Update([FromRoute] int id, [FromBody] CreateAttributeDto dto)
        {
            var attr = _context.Attributes.Find(id);
            if (attr == null)
                return BadRequest();

            attr.Name = dto.Name;
            _context.SaveChanges();

            var result = _mapper.Map<AttributeDto>(attr);
            return Ok(result);
        }

        [OnlyAdmin]
        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var attr = _context.Attributes.Find(id);
            if (attr == null)
                return BadRequest();

            _context.Attributes.Remove(attr);
            _context.SaveChanges();

            return Ok();
        }
    }
}