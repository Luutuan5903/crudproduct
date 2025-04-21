using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;


namespace Acme.SimpleTaskApp.Products.Dto
{
    [AutoMapFrom(typeof(Product))]
    public class UpdateProductInput : EntityDto<long>
    {
        public int Id { get; set; }

        [Required]
        [StringLength(Product.MaxNameLength)]
        public string Name { get; set; }

        [StringLength(Product.MaxDescriptionLength)]
        public string Description { get; set; }
        public IFormFile Images { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public string CategoryId { get; set; }
    }
}
