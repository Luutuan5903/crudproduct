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
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using Abp.Authorization;
using Acme.SimpleTaskApp.Authorization;

namespace Acme.SimpleTaskApp.Products
{
    [AbpAuthorize]
    public class ProductAppService : SimpleTaskAppAppServiceBase, IProductAppService
    {
        private readonly IRepository<Product> _productRepository;

        public ProductAppService(IRepository<Product> productRepository)
        {
            _productRepository = productRepository;
        }

        // Danh sách sản phẩm (phân trang, lọc, sắp xếp)
        public async Task<PagedResultDto<ProductListDto>> GetAll(GetAllProductsInput input)
        {
            var query = _productRepository.GetAllIncluding(p => p.Category);

            // Lọc theo từ khóa
            if (!string.IsNullOrWhiteSpace(input.Keyword))
            {
                var keyword = input.Keyword.ToLower();
                query = query.Where(p =>
                    p.Name.ToLower().Contains(keyword) ||
                    p.Description.ToLower().Contains(keyword) ||
                    p.StockQuantity.ToString().Contains(keyword));
            }

            // Lọc theo khoảng giá
            if (input.MinPrice.HasValue)
            {
                query = query.Where(p => p.Price >= input.MinPrice.Value);
            }

            if (input.MaxPrice.HasValue)
            {
                query = query.Where(p => p.Price <= input.MaxPrice.Value);
            }

            // Lọc theo khoảng thời gian tạo
            if (input.CreationTimeFrom.HasValue)
            {
                query = query.Where(p => p.CreationTime >= input.CreationTimeFrom.Value);
            }

            if (input.CreationTimeTo.HasValue)
            {
                query = query.Where(p => p.CreationTime <= input.CreationTimeTo.Value);
            }

            var totalCount = await query.CountAsync();

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
                LastModificationTime = p.LastModificationTime,
                CategoryName = p.Category != null ? p.Category.Name : null
            }).ToList();

            return new PagedResultDto<ProductListDto>(totalCount, result);
        }

        [AbpAuthorize(PermissionNames.Pages_Products_Create)]
        public async Task Create([FromForm] CreateProductInput input)
        {
            var product = new Product
            {
                Name = input.Name?.Trim(),
                Description = input.Description?.Trim(),
                Price = input.Price,
                StockQuantity = input.StockQuantity,
                CategoryId = input.CategoryId,
                CreationTime = Clock.Now
            };

            if (input.Images != null && input.Images.Length > 0)
            {
                var fileName = Path.GetFileName(input.Images.FileName);
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/img/ImageProducts", fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await input.Images.CopyToAsync(stream);
                }

                product.Images = $"/img/ImageProducts/{fileName}";
            }

            await _productRepository.InsertAsync(product);
        }

        public async Task<ProductList> GetAsync(EntityDto<int> input)
        {
            var product = await _productRepository
                .GetAllIncluding(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == input.Id);

            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại.");
            }

            var dto = new ProductList
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                Images = product.Images,
                CreationTime = product.CreationTime,
                LastModificationTime = product.LastModificationTime,
                CategoryId = product.CategoryId
            };

            return dto;
        }

        [HttpPost]
        public async Task UpdateProductData([FromForm] UpdateProductInput input)
        {
            var product = await _productRepository.FirstOrDefaultAsync(p => p.Id == input.Id);
            if (product == null)
            {
                throw new UserFriendlyException("Sản phẩm không tồn tại.");
            }

            product.Name = input.Name?.Trim();
            product.Description = input.Description?.Trim();
            product.Price = input.Price;
            product.StockQuantity = input.StockQuantity;
            product.LastModificationTime = Clock.Now;

            if (!string.IsNullOrEmpty(input.CategoryId))
            {
                product.CategoryId = input.CategoryId;
            }

            if (input.Images != null && input.Images.Length > 0)

            {
                if (!string.IsNullOrEmpty(product.Images))
                {
                    var oldImagePath = Path.Combine("wwwroot", product.Images.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(input.Images.FileName);
                var newPath = Path.Combine("wwwroot/img/ImageProducts", fileName);

                using (var stream = new FileStream(newPath, FileMode.Create))
                {
                    await input.Images.CopyToAsync(stream);
                }

                product.Images = "/img/ImageProducts/" + fileName;
            }

            await _productRepository.UpdateAsync(product);
        }
        //xoá sp theo id
        public async Task DeleteAsync(EntityDto<int> input)
        {
            await _productRepository.DeleteAsync(input.Id);
        }
    }

}
