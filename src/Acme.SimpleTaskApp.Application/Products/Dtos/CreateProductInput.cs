using Abp.AutoMapper;
using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Acme.SimpleTaskApp.Products.Dto
{
    [AutoMapTo(typeof(Product))]
    public class CreateProductInput
    {
        [Required]
        [StringLength(Product.MaxNameLength)]
        public string Name { get; set; }

        [StringLength(Product.MaxDescriptionLength)]
        public string Description { get; set; }
        public IFormFile Images { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }
}
