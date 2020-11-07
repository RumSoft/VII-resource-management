using System;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Data;

namespace TestApp.Api.Commands.Resource
{
    public class GetResourceDetailsCommand : Command<Guid, GetResourceDetailsCommand.GetResourceDetailsCommandResult>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public GetResourceDetailsCommand(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }

        [Authorize]
        [HttpGet("resource/{id}")]
        public override ActionResult<GetResourceDetailsCommandResult> Execute([FromRoute] Guid id)
        {
            try
            {
                var resource = _context.Resources.Find(id);
                if (resource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);

                var result = _mapper.Map<GetResourceDetailsCommandResult>(resource);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e);
            }
        }

        public class GetResourceDetailsCommandResult
        {
            public Guid Id { get; set; }
            public string Name { get; set; }
            public int Quantity { get; set; }
            public GetResourceDetailsCommandResultRoom Room { get; set; }
            public GetResourceDetailsCommandResultOwner Owner { get; set; }
            public GetResourceDetailsCommandResultAttribute[] Attributes { get; set; }
            public DateTime CreatedAt => DateTime.Today;
            public DateTime ModifiedAt => DateTime.Now;

            public class GetResourceDetailsCommandResultRoom
            {
                public int Id { get; set; }
                public string Name { get; set; }
            }

            public class GetResourceDetailsCommandResultOwner
            {
                public Guid Id { get; set; }
                public string FirstName { get; set; }
                public string LastName { get; set; }
                public string EmailAddress { get; set; }
            }

            public class GetResourceDetailsCommandResultAttribute
            {
                public int Id { get; set; }
                public string Name { get; set; }
            }
        }
    }
}