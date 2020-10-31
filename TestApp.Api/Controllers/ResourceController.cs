using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;
using Attribute = TestApp.Api.Models.Attribute;

namespace TestApp.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("resources")]
    public class ResourceController : RumsoftController
    {
        private const string Message_400_InvalidOwner = "Could not verify resource ownership";
        private const string Message_400_ResourceNotFound = "Resource does not exist.";
        private const string Message_Log_TransactionRollback = "Transaction failed, rollbacking";

        private readonly DataContext _context;
        private readonly ILogger<ResourceController> _logger;
        private readonly IMapper _mapper;
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
        public async Task<IActionResult> Create([FromBody] CreateResourceDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var resource = await CreateResource(dto);

                ResourceMerger.TryMergeByResource(resource, _context);

                await transaction.CommitAsync();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, Message_Log_TransactionRollback);
                await transaction.RollbackAsync();
                return BadRequest(e);
            }
        }

        [OnlyUser]
        [HttpPut]
        public async Task<IActionResult> Modify(Guid id, CreateResourceDto dto)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var resource = await ModifyResource(id, dto);

                ResourceMerger.TryMergeByResource(resource, _context);

                await transaction.CommitAsync();

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e, Message_Log_TransactionRollback);
                await transaction.RollbackAsync();
                return BadRequest(e);
            }
        }

        private async Task<Resource> CreateResource(CreateResourceDto dto)
        {
            var resource = new Resource
            {
                Name = dto.Name,
                Quantity = dto.Quantity
            };

            var user = _userInfo.GetCurrentUser();
            resource.Owner = user ?? throw new Exception(Message_400_InvalidOwner);

            if (dto.Room != null)
                resource.Room = await _context.Rooms.FindAsync(dto.Room);

            if (dto.Attributes != null && dto.Attributes.Count > 0)
                resource.Attributes = await _context.Attributes
                    .Where(x => dto.Attributes.Contains(x.Id))
                    .ToListAsync();

            await _context.Resources.AddAsync(resource);
            await _context.SaveChangesAsync();

            return resource;
        }

        private async Task<Resource> ModifyResource(Guid id, CreateResourceDto dto)
        {
            var resource = _context.Resources.Find(id);
            if(resource == null)
                throw new ArgumentNullException(Message_400_ResourceNotFound);

            if(resource.Owner.Id != _userInfo.Id)
                throw new Exception(Message_400_InvalidOwner);

            resource.Name = dto.Name;
            resource.Quantity = dto.Quantity;

            if (dto.Room == null)
                resource.Room = null;
            else if (dto.Room != resource.Room.Id)
                resource.Room = await _context.Rooms.FindAsync(dto.Room);

            if (dto.Attributes == null || dto.Attributes.Count == 0)
                resource.Attributes = new List<Attribute>();
            else if (!dto.Attributes.SequenceEqual(resource.Attributes.Select(x => x.Id)))
                resource.Attributes = await _context.Attributes.Where(x => dto.Attributes.Contains(x.Id)).ToListAsync();

            _context.Resources.Update(resource);
            await _context.SaveChangesAsync();

            return resource;
        }
    }
}