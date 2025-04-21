using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.AutoMapper;

namespace Acme.SimpleTaskApp.Categories.Dto
{
    [AutoMapTo(typeof(Category))]
    public class CategoryDto 
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public DateTime CreationTime { get; set; }

        public DateTime? LastModificationTime { get; set; }
    }
}
