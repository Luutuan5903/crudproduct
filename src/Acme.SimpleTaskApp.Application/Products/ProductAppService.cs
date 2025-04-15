using Abp.Application.Services;
using Abp.Domain.Repositories;
using Abp.Application.Services.Dto;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Abp.Timing;
using Abp.UI;
using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using Acme.SimpleTaskApp.Products.Dto;
using System.Linq;
using Acme.SimpleTaskApp.Products.Dtos;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;

namespace Acme.SimpleTaskApp.Products
{
    public class ProductAppService : SimpleTaskAppAppServiceBase, IProductAppService
    {
        private readonly IRepository<Product> _productRepository;

        public ProductAppService(IRepository<Product> productRepository)
        {
            _productRepository = productRepository;
        }

        //    public async Task<PagedResultDto<ProductListDto>> GetPagedAsync(PagedProductDto input)
        //    {
        //        var query = _productRepository.GetAll();
        //        //lọc
        //        if (!string.IsNullOrWhiteSpace(input.Keyword))
        //        {
        //            var keyword = input.Keyword.ToLower();
        //            query = query.Where(p => p.Name.ToLower().Contains(keyword)
        //            || p.StockQuantity.ToString().Contains(keyword));
        //        }

        //        var totalCount = await query.CountAsync();


        //        var products = await query
        //            .OrderBy(input.Sorting)
        //            .PageBy(input)
        //            .ToListAsync();

        //        var result = products.Select(p => new ProductListDto
        //        {
        //            Id = p.Id,
        //            Name = p.Name,
        //            Price = p.Price,
        //            Images = p.Images,
        //            StockQuantity = p.StockQuantity,
        //            Description = p.Description,
        //            CreationTime = p.CreationTime,
        //            LastModificationTime = p.LastModificationTime
        //        }).ToList();

        //        return new PagedResultDto<ProductListDto>(
        //    totalCount,
        //    result
        //);
        //    }


        //    public async Task<ListResultDto<ProductList>> GetAll(GetAllProductsInput input)
        //    {
        //        var products = await _productRepository
        //            .GetAll()
        //            .ToListAsync();

        //        return new ListResultDto<ProductList>(
        //            //map tay
        //            //cách hàm
        //            ObjectMapper.Map<List<ProductList>>(products)
        //        );
        //    }

        public async Task<PagedResultDto<ProductListDto>> GetAll(GetAllProductsInput input)
        {
            var query = _productRepository.GetAll();

            // Lọc theo từ khóa nếu có
            if (!string.IsNullOrWhiteSpace(input.Keyword))
            {
                var keyword = input.Keyword.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(keyword) ||
                    p.StockQuantity.ToString().Contains(keyword));
            }

            var totalCount = await query.CountAsync();

            // Phân trang và sắp xếp
            var products = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .ToListAsync();

            var result = products.Select(p => new ProductListDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Images = p.Images,
                StockQuantity = p.StockQuantity,
                Description = p.Description,
                CreationTime = p.CreationTime,
                LastModificationTime = p.LastModificationTime
            }).ToList();

            return new PagedResultDto<ProductListDto>(totalCount, result);
        }

        public async System.Threading.Tasks.Task Create([FromForm] CreateProductInput input)
        {
            var product = ObjectMapper.Map<Product>(input);
            product.CreationTime = Clock.Now;
            if (input.Images != null && input.Images.Length > 0)
            {
                var fileName = Path.GetFileName(input.Images.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/ImageProducts", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await input.Images.CopyToAsync(stream);
                }
                ;
                product.Images = $"/img/ImageProducts/{fileName}";
            }
            await _productRepository.InsertAsync(product);
        }

        public async Task<ProductList> GetAsync(EntityDto<int> input)
        {
            var product = await _productRepository.GetAsync(input.Id);
            return ObjectMapper.Map<ProductList>(product);
        }

        [HttpPost]
        public async Task UpdateProductData([FromForm] UpdateProductInput input)
        {
            //CheckUpdatePermission();

            var product = await _productRepository.FirstOrDefaultAsync(p => p.Id == input.Id);
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại.");
            }
            product.Name = input.Name;
            product.Description = input.Description;
            product.Price = input.Price;
            product.StockQuantity = input.StockQuantity;
            product.LastModificationTime = Clock.Now;
            if (input.Images != null && input.Images.Length > 0)
            {
                // 1. Xoá ảnh cũ nếu tồn tại
                if (!string.IsNullOrEmpty(product.Images))
                {
                    var oldImagePath = Path.Combine("wwwroot", product.Images.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }
                // 2. Lưu ảnh mới
                var newFileName = System.Guid.NewGuid().ToString() + Path.GetExtension(input.Images.FileName);
                var newPath = Path.Combine("wwwroot/img/ImageProducts", newFileName);

                using (var stream = new FileStream(newPath, FileMode.Create))
                {
                    await input.Images.CopyToAsync(stream);
                }
                // 3. Cập nhật đường dẫn ảnh
                product.Images = "/img/ImageProducts/" + newFileName;
            }

            await _productRepository.UpdateAsync(product);
        }

        public async Task DeleteAsync(EntityDto<int> input)
        {
            await _productRepository.DeleteAsync(input.Id); 
        }
    }
}
