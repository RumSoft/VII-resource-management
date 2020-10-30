using Microsoft.AspNetCore.Authorization;

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
        public OnlyAdminAttribute() : base(Models.Roles.Admin)
        {
        }
    }

    public class OnlyUserAttribute : OnlyRolesAttribute
    {
        public OnlyUserAttribute() : base(Models.Roles.User)
        {
        }
    }
}