using Abp.Application.Services.Dto;
using Abp.AutoMapper;
using Abp.Domain.Entities.Auditing;
using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Http;
using System;


namespace Acme.SimpleTaskApp.Products.Dto;
public class GetAllProductsInput
{

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

    public string Category_Id { get; set; }

    public DateTime CreationTime { get; set; }

}
