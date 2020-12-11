using Microsoft.AspNetCore.Authorization;
using TestApp.Api.Models;

namespace TestApp.Api.Auth
{
    public class OnlyRolesAttribute : AuthorizeAttribute
    {
        public OnlyRolesAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }

    public class OnlyAdminAttribute : OnlyRolesAttribute
    {
        public OnlyAdminAttribute() : base(UserRoles.Admin)
        {
        }
    }

    public class OnlyUserAttribute : OnlyRolesAttribute
    {
        public OnlyUserAttribute() : base(UserRoles.User)
        {
        }
    }
}