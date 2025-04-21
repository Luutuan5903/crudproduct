using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;
using Acme.SimpleTaskApp.Entities.Products;

namespace Acme.SimpleTaskApp.Categories
{
    [Table("AppCategories")]
    public class Category : Entity<string>, IHasCreationTime
    {
        [Required]
        [MaxLength(256)]
        public string Name { get; set; }
        public ICollection<Product> Products { get; set; }
        public DateTime CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }

        public Category()
        {
            CreationTime = Clock.Now;
        }

        public Category(string name)
        {
            Name = name;
        }
    }
}
