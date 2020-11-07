using System;
using AutoMapper;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;

namespace TestApp.Api.Commands.Resource
{
    public class UpdateResourceCommand : Command<UpdateResourceCommand.UpdateResourceCommandInput>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UpdateResourceCommand(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        /// <summary>
        ///     work in progress!
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [OnlyUser]
        [HttpPut("resource")]
        public override IActionResult Execute([FromBody] UpdateResourceCommandInput input)
        {
            return StatusCode(418, "work in progress");

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var resource = _context.Resources.Find(input.Id);
                if (resource == null)
                    return BadRequest(ReturnMessages.Message_400_ResourceNotFound);


                ResourceMerger.TryMergeByResource(resource, _context);

                transaction.Commit();
                return Ok();
            }
            catch (Exception e)
            {
                transaction.Rollback();
                return BadRequest(e);
            }
        }

        public class UpdateResourceCommandInput
        {
            public Guid Id { get; set; }
        }

        public class UpdateResourceCommandInputValidator : AbstractValidator<UpdateResourceCommandInput>
        {
        }
    }
}