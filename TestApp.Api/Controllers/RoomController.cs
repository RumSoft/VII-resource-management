using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Api.Models;

namespace TestApp.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly DataContext _context;

        public RoomController(DataContext context)
        {
            _context = context;
        }

        [HttpGet("")]
        public async Task<IEnumerable<Room>> GetRooms()
        {
            return await _context.Rooms.ToListAsync();
        }

        [HttpPost("")]
        public IActionResult CreateNewRoom([FromBody] CreateRoomDto roomDto)
        {
            var room = new Room
            {
                Name = roomDto.Name
            };

            _context.Rooms.Add(room);
            _context.SaveChanges();

            return Ok(room);
        }

        [HttpPut("")]
        public IActionResult UpdateRoom([FromBody] Room roomDto)
        {
            _context.Rooms.Update(roomDto);
            _context.SaveChanges();

            return Ok(roomDto);
        }


        public class CreateRoomDto
        {
            public string Name { get; set; }
        }
    }
}