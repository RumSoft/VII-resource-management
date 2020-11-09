using System.Collections.Generic;
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
        private static IQueryable<Resource> Resources(DataContext context)
        {
            return context.Resources.Where(x => x.TradeRequest == null);
        }

        /// <summary>
        ///     try merge resources when resource when attribute is deleted
        /// </summary>
        public static void TryMergeByAttribute(Attribute attr, DataContext context)
        {
            var res = Resources(context).Where(x => x.Attributes.Contains(attr))
                .ToList();
            if (res.Count > 2)
                Merge(res, context);
        }

        /// <summary>
        ///     try merge resources when resource is changed
        /// </summary>
        public static void TryMergeByResource(Resource resource, DataContext context)
        {
            //get exactly same resources (except attributes, see below)
            var matchingResources = Resources(context).Where(x => x.Owner == resource.Owner
                                                                  && x.Name == resource.Name
                                                                  && x.Room == resource.Room)
                .ToList()
                .Where(x => x.Attributes.SequenceEqual(resource.Attributes))
                .ToList();

            if (matchingResources.Count >= 2)
                Merge(matchingResources, context);
        }

        /// <summary>
        ///     try merge resources when room is deleted
        /// </summary>
        public static void TryMergeByRoom(Room room, DataContext context)
        {
            var res = Resources(context).Where(x => x.Room == room)
                .ToList();
            if (res.Count > 2)
                Merge(res, context);
        }

        ///// <summary>
        /////     try merge resources when resource owner changed
        ///// </summary>
        //public static void TryMergeByOwner(User owner, DataContext context)
        //{
        //    var res = Resources(context).Where(x => x.Owner == owner)
        //        .ToList();
        //    if (res.Count > 2)
        //        Merge(res, context);
        //}

        private static void Merge(IList<Resource> resources, DataContext context)
        {
        }
    }
}