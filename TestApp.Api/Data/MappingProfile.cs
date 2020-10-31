using AutoMapper;
using TestApp.Api.Controllers;
using TestApp.Api.Models;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Data
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Attribute, AttributeDto>().ReverseMap();
            CreateMap<Attribute, CreateAttributeDto>().ReverseMap();

            CreateMap<Room, CreateRoomDto>().ReverseMap();
            CreateMap<Room, RoomDto>().ReverseMap();

            CreateMap<User, UserDto>().ReverseMap();

            CreateMap<Resource, ResourceDto>().ReverseMap();
            CreateMap<Resource, CreateResourceDto>().ReverseMap();
        }
    }
}