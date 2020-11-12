﻿using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Resource
{
    public class GetResourcesCommand : Query<GetResourcesCommand.GetResourcesCommandResult[]>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserInfo _userInfo;

        public GetResourcesCommand(IMapper mapper, DataContext context, IUserInfo userInfo)
        {
            _mapper = mapper;
            _context = context;
            _userInfo = userInfo;
        }

        [Authorize]
        [HttpGet("resource")]
        public override ActionResult<GetResourcesCommandResult[]> Execute()
        {
            var resources = _context.Resources.AsQueryable();

            if (!_userInfo.IsAdmin)
                resources = resources.Where(x => x.Owner.Id == _userInfo.Id);

            var result = _mapper.Map<GetResourcesCommandResult[]>(resources.ToList());
            return Ok(result);
        }

        public class GetResourcesCommandResult : ResourceDto
        {
            public bool IsLocked { get; set; }
            public Guid? TradeRequest { get; set; }
        }
    }
}