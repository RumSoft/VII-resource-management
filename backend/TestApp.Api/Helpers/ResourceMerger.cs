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
        public static int TryMergeByAttribute(Attribute attr, DataContext context)
        {
            var res = Resources(context).Where(x => x.Attributes.Contains(attr))
                .ToList();

            if (res.Count > 2)
                return Merge(res, context);

            return 0;
        }

        /// <summary>
        ///     try merge resources when resource is changed
        /// </summary>
        public static int TryMergeByResource(Resource resource, DataContext context)
        {
            var attributeIds = resource.Attributes?.Select(x => x.Id) ?? new[] {-1};
            var matchingResources = Resources(context).Where(x => x.Owner == resource.Owner
                                                                  && x.Name == resource.Name
                                                                  && x.Room == resource.Room)
                .ToList()
                .Where(x => x.Attributes == null || x.Attributes.Select(y => y.Id).SequenceEqual(attributeIds))
                .ToList();

            if (matchingResources.Count >= 2)
                return Merge(matchingResources, context);

            return 0;
        }

        /// <summary>
        ///     try merge resources when room is deleted
        /// </summary>
        public static int TryMergeByRoom(Room room, DataContext context)
        {
            var res = Resources(context).Where(x => x.Room == room)
                .ToList();

            if (res.Count > 2)
                return Merge(res, context);

            return 0;
        }

        private static int Merge(IList<Resource> resources, DataContext context)
        {
            var merged = 0;

            foreach (var pre_group in resources.GroupBy(x => new {x.Name, x.Room, x.Owner}).ToList())
            {
                //https://stackoverflow.com/questions/31724512/linq-group-by-using-the-elements-inside-an-array-property]
                string stringifyResourceAttributesIds(Resource r)
                {
                    return r?.Attributes == null 
                        ? "none" 
                        : string.Join("|", r.Attributes.Select(y => y.Id).OrderBy(y => y));
                }

                foreach (var group in pre_group.GroupBy(stringifyResourceAttributesIds))
                    if (@group.Count() > 1)
                    {
                        var first = @group.First();
                        var others = @group.Skip(1).ToList();

                        first.Quantity += others.Sum(x => x.Quantity);
                        merged += others.Count;

                        context.Resources.RemoveRange(others);
                        context.Resources.Update(first);
                        context.SaveChanges();
                    }
            }

            return merged;
        }
    }
}