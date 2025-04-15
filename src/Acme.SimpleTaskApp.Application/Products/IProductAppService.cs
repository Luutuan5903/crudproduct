using Abp.Application.Services.Dto;
using Abp.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Acme.SimpleTaskApp.Tasks.Dtos;
using Acme.SimpleTaskApp.Products.Dto;
using Acme.SimpleTaskApp.Products.Dtos;

namespace Acme.SimpleTaskApp.Products
{
    public interface IProductAppService : IApplicationService
    {
        //Task<PagedResultDto<ProductListDto>> GetPagedAsync(PagedProductDto input);
        //Task<ListResultDto<ProductList>> GetAll(GetAllProductsInput input);
        Task<PagedResultDto<ProductListDto>> GetAll(GetAllProductsInput input);
        System.Threading.Tasks.Task Create(CreateProductInput input);
        Task<ProductList> GetAsync(EntityDto<int> input);
        Task UpdateProductData(UpdateProductInput input);
        Task DeleteAsync(EntityDto<int> input);
    }
}
