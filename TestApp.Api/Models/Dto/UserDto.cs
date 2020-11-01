using System;

namespace TestApp.Api.Models.Dto
{
    public class UserDto
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
    }

    public class CreateUserDto : UserDto
    {
        public string Password { get; set; }
    }

    public class UserWithIdDto : UserDto
    {
        public Guid Id { get; set; }
    }

    public class UserDetailsDto : UserWithIdDto
    {
        public string Role { get; set; }
        public DateTime CreatedAt => DateTime.Today;
        public DateTime LastLogin => DateTime.Now;
    }
}