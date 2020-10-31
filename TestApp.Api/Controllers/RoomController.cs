using System.ComponentModel;
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

        [OnlyAdmin]
        [HttpPost("")]
        public ActionResult<RoomDto> Create([FromBody] CreateRoomDto dto)
        {
            var room = _mapper.Map<Room>(dto);

            _context.Rooms.Add(room);
            _context.SaveChanges();

            var result = _mapper.Map<RoomDto>(room);
            return Ok(result);
        }

        [OnlyAdmin]
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

        [OnlyAdmin]
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
    }
}