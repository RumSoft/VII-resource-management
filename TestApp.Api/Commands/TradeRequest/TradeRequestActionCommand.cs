using System;
using System.Diagnostics.CodeAnalysis;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;
using TestApp.Api.Services;

namespace TestApp.Api.Commands.TradeRequest
{
    [SuppressMessage("ReSharper", "SwitchStatementHandlesSomeKnownEnumValuesWithDefault")]
    public class TradeRequestActionCommand : Command<TradeRequestActionCommand.TradeRequestActionCommandInput>
    {
        public enum TradeRequestAction
        {
            Cancel = 0,
            Accept = 1,
            Decline = 2
        }

        private readonly DataContext _context;
        private readonly IUserInfo _userInfo;

        public TradeRequestActionCommand(DataContext context, IUserInfo userInfo)
        {
            _context = context;
            _userInfo = userInfo;
        }

        [OnlyUser]
        [HttpPut("trade-request")]
        public override IActionResult Execute([FromBody] TradeRequestActionCommandInput input)
        {
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var tr = _context.TradeRequests.Find(input.Id);
                if (tr == null)
                    return BadRequest(ReturnMessages.Message_400_TradeRequestNotFound);

                var resource = tr.Resource;
                var owner = resource.Owner;
                var taker = tr.Taker;
                var user = _userInfo.GetCurrentUser();

                switch (input.Action)
                {
                    case TradeRequestAction.Cancel:
                    {
                        if (user != owner)
                            return BadRequest(ReturnMessages.CatastrophicFailure);

                        break;
                    }
                    case TradeRequestAction.Decline:
                    {
                        if (user != taker)
                            return BadRequest(ReturnMessages.CatastrophicFailure);

                        break;
                    }
                    case TradeRequestAction.Accept:
                    {
                        if (user != taker)
                            return BadRequest(ReturnMessages.CatastrophicFailure);

                        resource.Owner = taker;
                        _context.Resources.Update(resource);
                        break;
                    }
                }

                _context.TradeRequests.Remove(tr); // remove because trade request is done 🤷🏿‍
                _context.SaveChanges();

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

        public class TradeRequestActionCommandInput
        {
            public Guid Id { get; set; }
            /// <summary>
            /// CancelByOwner = 0,
            /// Accept = 1,
            /// Decline = 2
            /// </summary>
            public TradeRequestAction? Action { get; set; }
        }

        public class TradeRequestActionCommandInputValidator : AbstractValidator<TradeRequestActionCommandInput>
        {
            public TradeRequestActionCommandInputValidator()
            {
                RuleFor(x => x.Action).NotNull().IsInEnum();
            }
        }
    }
}