namespace TestApp.Api.Models.Dto
{
    public class RoomDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateRoomDto
    {
        public string Name { get; set; }
    }
}