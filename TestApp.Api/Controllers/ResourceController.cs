using System;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("resources")]
    public class ResourceController : RumsoftController
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<ResourceController> _logger;
        private readonly IUserInfo _userInfo;

        public ResourceController(DataContext context, IUserInfo userInfo, IMapper mapper, ILogger<ResourceController> logger)
        {
            _context = context;
            _userInfo = userInfo;
            _mapper = mapper;
            _logger = logger;
        }


        [HttpGet]
        public ActionResult GetMyResources()
        {
            IQueryable<Resource> resources = _context.Resources;

            if (!_userInfo.IsAdmin)
            {
                var user = _userInfo.GetCurrentUser();
                resources = resources.Where(x => x.Owner == user);
            }

            var result = _mapper.Map<ResourceDto[]>(resources.ToList());
            return Ok(result);
        }

        [OnlyUser]
        [HttpPost]
        public async Task<IActionResult> CreateResource([FromBody] CreateResourceDto dto)
        {
            await using var insertTransaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var resource = new Resource
                {
                    Name = dto.Name,
                    Quantity = dto.Quantity,
                };

                var user = _userInfo.GetCurrentUser();
                if (user == null)
                    return BadRequest();
                resource.Owner = user;

                if (dto.Room != null)
                {
                    var room = await _context.Rooms.FindAsync(dto.Room);
                    resource.Room = room;
                }

                if (dto.Attributes != null && dto.Attributes.Count > 0)
                {
                    var attributes = _context.Attributes.Where(x => dto.Attributes.Contains(x.Id));
                    resource.Attributes = await attributes.ToListAsync();
                }

                await _context.Resources.AddAsync(resource);

                await insertTransaction.CommitAsync();
                await _context.SaveChangesAsync();

                await using var mergeTransaction = await _context.Database.BeginTransactionAsync();
                await TryMergeResource(resource);
                await mergeTransaction.CommitAsync();
                await _context.SaveChangesAsync();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return BadRequest(e.Message);
            }


        }

        private async Task TryMergeResource(Resource resource)
        {

            //get exactly same resources (except attributes, see below)
            var matchingResources = await _context.Resources.Where(x => x.Owner == resource.Owner
                                                                        && x.Name == resource.Name
                                                                        && x.Room == resource.Room).ToListAsync();

            if (matchingResources.Count < 2)
                return;

            //filter to have same attributes (must be after ToList())
            matchingResources = matchingResources.Where(x => x.Attributes.SequenceEqual(resource.Attributes)).ToList();

            //sum to resource
            resource.Quantity = matchingResources.Sum(x => x.Quantity);

            var toDelete = matchingResources.Remove(resource);

            _context.Resources.RemoveRange(matchingResources);

        }
    }

    
}