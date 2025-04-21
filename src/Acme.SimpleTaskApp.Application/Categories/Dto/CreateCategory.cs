using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.AutoMapper;

namespace Acme.SimpleTaskApp.Categories.Dto
{
    [AutoMapTo(typeof(Category))]
    public class CreateCategory
    {
        [Required]
        [MaxLength(256)]
        public string Name { get; set; }
    }
}
