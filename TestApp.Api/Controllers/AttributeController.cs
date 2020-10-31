using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;
using Attribute = TestApp.Api.Models.Attribute;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("attributes")]
    public partial class AttributeController : RumsoftController
    {
        private const string Message_400_AttributeExists = "Attribute with same name already exists";
        private const string Message_400_AttributeNotFound = "This attribute no longer exists";

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
            if (_context.Attributes.Any(x => x.Name == dto.Name))
                return BadRequest(Message_400_AttributeExists);

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
                return BadRequest(Message_400_AttributeNotFound);

            if (dto.Name.Equals(attr.Name, StringComparison.CurrentCultureIgnoreCase))
                return Ok(attr);

            if (_context.Attributes.Any(x => x.Name == dto.Name))
                return BadRequest(Message_400_AttributeExists);

            attr.Name = dto.Name;
            _context.SaveChanges();

            var result = _mapper.Map<AttributeDto>(attr);
            return Ok(result);
        }

        [OnlyAdmin]
        [HttpDelete("{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            //todo: merge after attribute delete

            var attr = _context.Attributes.Find(id);
            if (attr == null)
                return BadRequest(Message_400_AttributeNotFound);

            _context.Attributes.Remove(attr);
            _context.SaveChanges();

            return Ok();
        }
    }
}