using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands.User
{
    public class GetUsersQuery : Query<UserDto[]>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetUsersQuery(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("user")]
        public override ActionResult<UserDto[]> Execute()
        {
            var users = _context.Users.ToArray();
            var result = _mapper.Map<UserDto[]>(users);
            return Ok(result);
        }
    }
}