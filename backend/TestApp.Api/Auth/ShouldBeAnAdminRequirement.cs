﻿using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using TestApp.Api.Models;

namespace TestApp.Api.Auth
{
    public class ShouldBeAnAdminRequirement
        : IAuthorizationRequirement
    {
    }

    public class ShouldBeAnAdminRequirementHandler
        : AuthorizationHandler<ShouldBeAnAdminRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            ShouldBeAnAdminRequirement requirement)
        {
            // check if Role claim exists - Else Return
            // (sort of Claim-based requirement)
            if (!context.User.HasClaim(x => x.Type == ClaimTypes.Role))
                return Task.CompletedTask;

            // claim exists - retrieve the value
            var claim = context.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Role);
            var role = claim.Value;

            // check if the claim equals to either Admin or Editor
            // if satisfied, set the requirement as success
            if (role == UserRoles.Admin)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}