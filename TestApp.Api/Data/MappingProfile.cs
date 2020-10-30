using AutoMapper;
using TestApp.Api.Controllers;
using TestApp.Api.Models;

namespace TestApp.Api.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Attribute, AttributeController.AttributeDto>().ReverseMap();
            CreateMap<Attribute, AttributeController.CreateAttributeDto>().ReverseMap();

            CreateMap<Room, RoomController.CreateRoomDto>().ReverseMap();
            CreateMap<Room, RoomController.RoomDto>().ReverseMap();

            CreateMap<User, UserController.UserDto>().ReverseMap();
        }
    }
}