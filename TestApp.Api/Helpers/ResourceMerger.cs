using System.Linq;
using TestApp.Api.Data;
using TestApp.Api.Models;

namespace TestApp.Api.Helpers
{
    /// <summary>
    ///     Used for merging same resources when resource property is changed.
    /// </summary>
    public class ResourceMerger
    {
        public static void TryMergeByAttribute(Attribute attr, DataContext context)
        {
        }


        public static void TryMergeByResource(Resource resource, DataContext context)
        {
            //get exactly same resources (except attributes, see below)
            var matchingResources = context.Resources.Where(x => x.Owner == resource.Owner
                                                                 && x.Name == resource.Name
                                                                 && x.Room == resource.Room).ToList();

            if (matchingResources.Count < 2)
                return; // no exactly same resources found

            //filter to have same attributes (must be after ToList())
            matchingResources = matchingResources.Where(x => x.Attributes.SequenceEqual(resource.Attributes)).ToList();

            //sum to resource
            resource.Quantity = matchingResources.Sum(x => x.Quantity);

            var toDelete = matchingResources.Remove(resource);

            context.Resources.RemoveRange(matchingResources);
        }

        public static void TryMergeByRoom(Room room, DataContext context)
        {
        }

        public static void TryMergeByOwner(User owner, DataContext context)
        {
        }
    }
}