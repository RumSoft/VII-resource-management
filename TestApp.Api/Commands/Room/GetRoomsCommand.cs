using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Room
{
    public class GetRoomsCommand : Query<GetRoomsCommand.GetRoomsCommandResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetRoomsCommand(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("room")]
        public override ActionResult<GetRoomsCommandResult> Execute()
        {
            var rooms = _context.Rooms;
            var result = _mapper.Map<GetRoomsCommandResult[]>(rooms.ToList());
            return Ok(result);
        }

        public class GetRoomsCommandResult
        {
            public string Name { get; set; }
            public int Id { get; set; }
        }
    }
}