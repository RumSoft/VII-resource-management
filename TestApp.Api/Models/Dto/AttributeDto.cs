namespace TestApp.Api.Models.Dto
{
    public class AttributeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CreateAttributeDto
    {
        public string Name { get; set; }
    }
}