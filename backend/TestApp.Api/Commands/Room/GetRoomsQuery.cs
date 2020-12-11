using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.Room
{
    public class GetRoomsQuery : Query<IdNameColor>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetRoomsQuery(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("room")]
        public override ActionResult<IdNameColor> Execute()
        {
            var rooms = _context.Rooms;
            var result = _mapper.Map<IdNameColor[]>(rooms.ToList());
            return Ok(result);
        }
    }
}