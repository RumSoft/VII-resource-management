using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Api.Models;

namespace TestApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AttributeController : ControllerBase
    {
        private readonly DataContext _context;

        public AttributeController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("")]
        public async Task<IEnumerable<Attribute>> GetRooms()
        {
            return await _context.Attributes.ToListAsync();
        }

        [HttpPost("")]
        public IActionResult CreateNewAttribute([FromBody] CreateAttributeDto attributeDto)
        {
            var room = new Attribute
            {
                Name = attributeDto.Name
            };

            _context.Attributes.Add(room);
            _context.SaveChanges();

            return Ok(room);
        }

        [HttpPut("")]
        public IActionResult UpdateAttribute([FromBody] Attribute attributeDto)
        {
            _context.Attributes.Update(attributeDto);
            _context.SaveChanges();

            return Ok(attributeDto);
        }


        public class CreateAttributeDto
        {
            public string Name { get; set; }
        }
    }
}