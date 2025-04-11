using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Abp.Domain.Entities;
using Abp.Domain.Entities.Auditing;
using Abp.Timing;

namespace Acme.SimpleTaskApp.Entities.Products
{
    [Table("AppProducts")]
    public class Product : Entity, IHasCreationTime
    {
        public const int MaxNameLength = 256;
        public const int MaxDescriptionLength = 64 * 1024; //64KB

        [Required]
        [StringLength(MaxNameLength)]
        public string Name { get; set; }

        
        public string Images { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public int StockQuantity { get; set; }
        public string Category_Id { get; set; }

        public DateTime CreationTime { get; set; }

        public Product()
        {
            CreationTime = Clock.Now;
        }

        public Product(string name, string image, decimal price, int stockQuantity)
            : this()
        {
            Name = name;
            
            Images = image;
            Price = price;
            StockQuantity = stockQuantity;
            //Category_Id = category_Id;
        }
    }
}
