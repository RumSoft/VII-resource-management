using AutoMapper;
using Microsoft.VisualBasic;
using TestApp.Api.Commands.Resource;
using TestApp.Api.Commands.TradeRequest;
using TestApp.Api.Commands.User;
using TestApp.Api.Models.Dto;

namespace TestApp.Api.Commands
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Models.Resource, ResourceDto>().ReverseMap();
            CreateMap<Models.Attribute, IdNameColor>().ReverseMap();
            CreateMap<Models.User, UserDto>().ReverseMap();
            CreateMap<Models.Room, IdNameColor>().ReverseMap();

            CreateMap<Models.User, GetUserDetailsQuery.GetUserDetailsCommandResult>().ReverseMap();
            CreateMap<Models.User, CreateUserCommand.CreateUserCommandInput>().ReverseMap();

            CreateMap<Models.Resource, GetResourcesCommand.GetResourcesCommandResult>()
                .ForMember(x => x.TradeRequest, x => x.MapFrom(y => y.TradeRequest.Id))
                .ReverseMap();

            CreateMap<Models.Resource, GetResourceDetailsCommand.GetResourceDetailsCommandResult>()
                .ForMember(x => x.TradeRequest, x => x.MapFrom(y => y.TradeRequest.Id))
                .ReverseMap();
            CreateMap<UpdateResourceCommand.UpdateResourceCommandInput, CreateResourceCommand.CreateResourceCommandInput>()
                .ReverseMap();

            CreateMap<Models.TradeRequest, GetTradeRequestsQuery.GetTradeRequestsQueryResult>()
                .ForMember(x => x.Owner, opts => opts.MapFrom(src => src.Resource.Owner))
                .ReverseMap();

            CreateMap<Models.TradeRequest, GetTradeRequestsDetailsQuery.GetTradeRequestsDetailsQueryResult>()
                .ForMember(x => x.Owner, opts => opts.MapFrom(src => src.Resource.Owner))
                .ReverseMap();

        }
    }
}