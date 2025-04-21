using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Abp.Runtime.Validation;
using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Http;
using System;


namespace Acme.SimpleTaskApp.Products.Dto;
public class GetAllProductsInput : PagedAndSortedResultRequestDto, IShouldNormalize
{
    // Lọc theo khoảng giá
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }

    // Lọc theo khoảng thời gian tạo
    public DateTime? CreationTimeFrom { get; set; }
    public DateTime? CreationTimeTo { get; set; }
    
    // Tìm kiếm theo từ khóa
    public string Keyword { get; set; }

    public void Normalize()
    {
        if (string.IsNullOrEmpty(Sorting) || Sorting == "0 asc")
        {
            Sorting = "CreationTime DESC";
        }
    }
}

[AutoMapFrom(typeof(Product))]
public class ProductList : EntityDto, IHasCreationTime
{
    //public string Id { get; set; }
    public string Name { get; set; }

    public string Description { get; set; }

    public string Images { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public string CategoryId { get; set; }

    public DateTime CreationTime { get; set; }

    public DateTime? LastModificationTime { get; set; }

}
