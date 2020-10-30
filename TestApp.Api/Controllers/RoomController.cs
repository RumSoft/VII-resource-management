using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("rooms")]
    public class RoomController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public RoomController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("")]
        public ActionResult<RoomDto[]> GetRooms()
        {
            var rooms = _context.Rooms.ToArray();
            var dto = _mapper.Map<RoomDto[]>(rooms);
            return Ok(dto);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("")]
        public ActionResult<RoomDto> Create([FromBody] CreateRoomDto dto)
        {
            var room = _mapper.Map<Room>(dto);

            _context.Rooms.Add(room);
            _context.SaveChanges();

            var result = _mapper.Map<RoomDto>(room);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public ActionResult<RoomDto> Update([FromRoute] int id, [FromBody] CreateRoomDto dto)
        {
            var room = _context.Rooms.Find(id);
            if (room == null)
                return BadRequest();

            room.Name = dto.Name;
            _context.SaveChanges();

            var result = _mapper.Map<RoomDto>(room);
            return Ok(result);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var room = _context.Rooms.Find(id);
            if (room == null)
                return BadRequest();

            _context.Rooms.Remove(room);
            _context.SaveChanges();

            return Ok();
        }

        public class CreateRoomDto
        {
            public string Name { get; set; }
        }

        public class RoomDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
    }
}