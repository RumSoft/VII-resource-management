﻿using System;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Models;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.TradeRequest
{
    public class CreateTradeRequestCommand : Command<CreateTradeRequestCommand.CreateTradeRequestCommandInput>
    {
        private readonly DataContext _context;
        private readonly IUserInfo _userInfo;

        public CreateTradeRequestCommand(IUserInfo userInfo, DataContext context)
        {
            _userInfo = userInfo;
            _context = context;
        }

        [OnlyUser]
        [HttpPost("trade-request")]
        public override IActionResult Execute([FromBody] CreateTradeRequestCommandInput input)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var user = _userInfo.GetCurrentUser();
                var taker = _context.Users.Find(input.TakerId);
                var resource = _context.Resources.Find(input.ResourceId);

                if (user == null || taker == null || resource == null 
                    || user.Id == taker.Id
                    || user.Role != UserRoles.User
                    || taker.Role != UserRoles.User)
                    return BadRequest(ReturnMessages.CatastrophicFailure);

                if (resource.IsLocked || resource.Quantity < input.Quantity)
                    return BadRequest(ReturnMessages.Message_418_ValidationFailed);

                var newResource = resource;
                if (input.Quantity < resource.Quantity)
                {
                    newResource = new Models.Resource
                    {
                        Attributes = resource.Attributes,
                        Quantity = input.Quantity,
                        Name = resource.Name,
                        Owner = resource.Owner,
                        Room = resource.Room
                    };
                    resource.Quantity -= input.Quantity;
                }

                var tr = new Models.TradeRequest
                {
                    CreatedAt = DateTime.Now,
                    Resource = newResource,
                    Taker = taker
                };


                if (resource != newResource)
                    _context.Resources.Add(newResource);
                _context.Resources.Update(resource);
                _context.SaveChanges();

                _context.TradeRequests.Add(tr);
                _context.SaveChanges();

                transaction.Commit();
                Log.Information("Created trade request {trid}: {resname}", tr.Id, resource.Name);
                return Ok();
            }
            catch (Exception e)
            {
                Log.Error(e, "Couldn't create trade request {@input}", input);
                transaction.Rollback();
                return BadRequest(e);
            }
        }

        public class CreateTradeRequestCommandInput
        {
            public Guid ResourceId { get; set; }
            public Guid TakerId { get; set; }
            public int Quantity { get; set; }
        }

        public class CreateTradeRequestCommandInputValidator : AbstractValidator<CreateTradeRequestCommandInput>
        {
            public CreateTradeRequestCommandInputValidator()
            {
                RuleFor(x => x.Quantity).GreaterThan(0);
                RuleFor(x => x.TakerId).NotEmpty();
                RuleFor(x => x.ResourceId).NotEmpty();
            }
        }
    }
}