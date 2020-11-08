using System;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApp.Api.Commands.TradeRequest;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.Search
{
    public class SearchQuery : Command<SearchQuery.SearchQueryInput>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private IUserInfo _userInfo;

        public SearchQuery(IUserInfo userInfo, DataContext context, IMapper mapper)
        {
            _userInfo = userInfo;
            _context = context;
            _mapper = mapper;
        }

        [HttpGet("search")]
        public override IActionResult Execute([FromQuery] SearchQueryInput input)
        {
            try
            {
                Func<SearchQueryInput, object> resultFunc = input.Type.ToLowerInvariant() switch
                {
                    "attributes" => ProcessAttributesQuery,
                    "rooms" => ProcessRoomQuery,
                    "users" => ProcessUsersQuery,
                    "resources" => ProcessResourcesQuery,
                    "traderequests" => ProcessTradeRequestsQuery,
                    _ => throw new NotImplementedException("unknown query type")
                };

                var result = resultFunc(input);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        #region params

        public interface IResourceQueryInput
        {
            string Name { get; set; }
            string ParentName { get; set; }
        }

        public interface ITradeRequestQueryInput
        {
            string Name { get; set; }
            string ParentName { get; set; }
        }

        public interface IAttributeQueryInput
        {
            string Name { get; set; }
        }

        public interface IUserQueryInput
        {
            string Name { get; set; }
        }

        public interface IRoomQueryInput
        {
            string Name { get; set; }
        }

        public class SearchQueryInput
            : IResourceQueryInput,
                ITradeRequestQueryInput,
                IAttributeQueryInput,
                IUserQueryInput,
                IRoomQueryInput
        {
            /// <summary>
            ///     search entity - resources, rooms, etc
            /// </summary>
            public string Type { get; set; }

            public string Name { get; set; }
            public string ParentName { get; set; }
        }

        #endregion

        #region query processing

        private object ProcessResourcesQuery(IResourceQueryInput input)
        {
            var resources = _context.Resources.AsQueryable();

            if (!string.IsNullOrWhiteSpace(input.Name))
                resources = resources.Where(x => x.Name.Contains(input.Name));

            if (!string.IsNullOrWhiteSpace(input.ParentName))
                resources = resources.Where(x => x.Owner.EmailAddress.Contains(input.ParentName)
                                                 || x.Owner.FirstName.Contains(input.ParentName)
                                                 || x.Owner.LastName.Contains(input.ParentName));

            var list = _mapper.Map<ResourceDto[]>(resources
                .Include(x => x.Attributes)
                .Include(x => x.Room)
                .Include(x => x.Owner)
                .ToList());

            return list;
        }

        private object ProcessTradeRequestsQuery(ITradeRequestQueryInput input)
        {
            var tr = _context.TradeRequests.AsQueryable();

            if (!string.IsNullOrWhiteSpace(input.Name))
                tr = tr.Where(x => x.Resource.Name.Contains(input.Name));

            if (!string.IsNullOrWhiteSpace(input.ParentName))
                tr = tr.Where(x => x.Taker.EmailAddress.Contains(input.ParentName)
                                   || x.Taker.FirstName.Contains(input.ParentName)
                                   || x.Taker.LastName.Contains(input.ParentName)
                                   || x.Resource.Owner.FirstName.Contains(input.ParentName)
                                   || x.Resource.Owner.LastName.Contains(input.ParentName)
                                   || x.Resource.Owner.EmailAddress.Contains(input.ParentName));

            var list = _mapper.Map<GetTradeRequestsQuery.GetTradeRequestsQueryResult[]>(tr.ToList());

            return list;
        }

        private object ProcessAttributesQuery(IAttributeQueryInput input)
        {
            var attributes = _context.Attributes.AsQueryable();

            if (!string.IsNullOrWhiteSpace(input.Name)) attributes = attributes.Where(x => x.Name.Contains(input.Name));

            var list = attributes.Select(x => new
            {
                x.Name,
                ResourceCount = x.Resources.Count
            });

            return list;
        }

        private object ProcessUsersQuery(IUserQueryInput input)
        {
            var users = _context.Users.Where(x => x.Role != UserRoles.Admin);

            if (!string.IsNullOrWhiteSpace(input.Name))
                users = users.Where(x => x.FirstName.Contains(input.Name)
                                         || x.LastName.Contains(input.Name)
                                         || x.EmailAddress.Contains(input.Name));

            var list = users.Select(x => new
            {
                x.Id,
                x.FirstName,
                x.LastName,
                x.EmailAddress,
                x.LastLoginAt,
                x.RegisteredAt,
                ResourceCount = x.Resources.Count
            });

            return list;
        }

        private object ProcessRoomQuery(IRoomQueryInput input)
        {
            var rooms = _context.Rooms.AsQueryable();

            if (!string.IsNullOrWhiteSpace(input.Name)) rooms = rooms.Where(x => x.Name.Contains(input.Name));

            var list = rooms.Select(x => new
            {
                x.Name,
                x.Color,
                ResourceCount = x.Resources.Count
            });

            return list;
        }

        #endregion
    }
}