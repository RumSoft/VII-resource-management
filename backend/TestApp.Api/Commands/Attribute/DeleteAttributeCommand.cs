﻿using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Serilog;
using TestApp.Api.Auth;
using TestApp.Api.Data;
using TestApp.Api.Helpers;

namespace TestApp.Api.Commands.Attribute
{
    public class DeleteAttributeCommand : Command<int>
    {
        private readonly DataContext _context;

        public DeleteAttributeCommand(DataContext context)
        {
            _context = context;
        }

        [OnlyAdmin]
        [HttpDelete("attribute/{id}")]
        public override IActionResult Execute([FromRoute] int id)
        {
            try
            {
                var attr = _context.Attributes.Find(id);
                if (attr == null)
                    return BadRequest(ReturnMessages.Message_400_RoomNotFound);

                if (AppConfig.CanRemoveAttributesWithResources)
                {
                    Log.Information("Merging resources for attribute {attribute}", attr.Id);
                    var mergedCount = ResourceMerger.TryMergeByAttribute(attr, _context);
                    Log.Warning("Merged {mergedCount} resource entities in total", mergedCount);

                }
                else
                {
                    if (attr.Resources.Any())
                        return BadRequest(ReturnMessages.Message_400_AttributeContainsResources);
                }

                _context.Attributes.Remove(attr);
                _context.SaveChanges();
                Log.Information("Deleted attribute {id}: {name}", id, attr.Name);
                return Ok();
            }

            catch (Exception e)
            {
                Log.Error(e, "Couldn't delete attribute {id}", id);
                return BadRequest(e);
            }
        }
    }
}