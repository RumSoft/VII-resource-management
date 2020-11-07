using AutoMapper;
using TestApp.Api.Commands.Attribute;
using TestApp.Api.Commands.Resource;
using TestApp.Api.Commands.Room;
using TestApp.Api.Commands.User;

namespace TestApp.Api.Commands
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Models.Room, GetRoomsCommand.GetRoomsCommandResult>().ReverseMap();

            CreateMap<Models.Attribute, GetAttributesCommand.GetAttributesCommandResult>().ReverseMap();

            CreateMap<Models.User, GetUserDetailsCommand.GetUserDetailsCommandResult>().ReverseMap();
            CreateMap<Models.User, GetUsersCommand.GetUsersCommandResult>().ReverseMap();
            CreateMap<Models.User, CreateUserCommand.CreateUserCommandInput>().ReverseMap();

            CreateMap<Models.Resource, GetResourcesCommand.GetResourcesCommandResult>().ReverseMap();
            CreateMap<Models.Room, GetResourcesCommand.GetResourcesCommandResult.GetResourcesCommandResultRoom>().ReverseMap();
            CreateMap<Models.Attribute, GetResourcesCommand.GetResourcesCommandResult.GetResourcesCommandResultAttribute>().ReverseMap();
            CreateMap<Models.User, GetResourcesCommand.GetResourcesCommandResult.GetResourcesCommandResultOwner>().ReverseMap();

            CreateMap<Models.Resource, GetResourceDetailsCommand.GetResourceDetailsCommandResult>().ReverseMap();
            CreateMap<Models.Room, GetResourceDetailsCommand.GetResourceDetailsCommandResult.GetResourceDetailsCommandResultRoom>().ReverseMap();
            CreateMap<Models.Attribute, GetResourceDetailsCommand.GetResourceDetailsCommandResult.GetResourceDetailsCommandResultAttribute>().ReverseMap();
            CreateMap<Models.User, GetResourceDetailsCommand.GetResourceDetailsCommandResult.GetResourceDetailsCommandResultOwner>().ReverseMap();
            CreateMap<UpdateResourceCommand.UpdateResourceCommandInput, CreateResourceCommand.CreateResourceCommandInput>().ReverseMap();
        }
    }
}