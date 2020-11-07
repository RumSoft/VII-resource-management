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
        /// <summary>
        ///     try merge resources when resource when attribute is deleted
        /// </summary>
        public static void TryMergeByAttribute(Attribute attr, DataContext context)
        {
        }

        /// <summary>
        ///     try merge resources when resource is changed
        /// </summary>
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

            if (matchingResources.Count < 2)
                return;  // no exactly same resources found

            //sum to resource
            resource.Quantity = matchingResources.Sum(x => x.Quantity);

            var toDelete = matchingResources.Where(x => x != resource);
            context.Resources.RemoveRange(toDelete);
            context.Resources.Update(resource);
            context.SaveChanges();
        }

        /// <summary>
        ///     try merge resources when room is deleted
        /// </summary>
        public static void TryMergeByRoom(Room room, DataContext context)
        {
        }

        /// <summary>
        ///     try merge resources when resource owner changed
        /// </summary>
        public static void TryMergeByOwner(User owner, DataContext context)
        {
        }
    }
}