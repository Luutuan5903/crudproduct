using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Abp;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Abp.Linq.Extensions;
using Abp.Timing;
using Abp.UI;
using Acme.SimpleTaskApp.Categories.Dto;
using Acme.SimpleTaskApp.Products;
using Microsoft.EntityFrameworkCore;

namespace Acme.SimpleTaskApp.Categories
{
    public class CategoryAppService : SimpleTaskAppAppServiceBase, ICategoryAppService
    {
        private readonly IRepository<Category, string> _categoryRepository;

        public CategoryAppService(IRepository<Category, string> categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<PagedResultDto<CategoryDto>> GetAll(GetPagedCategory input)
        {
            //getAll -> truy vấn tất cả dữ liệu 
            var query = _categoryRepository.GetAll()
                .WhereIf(!string.IsNullOrWhiteSpace(input.Keyword), p =>
                    p.Name.ToLower().Contains(input.Keyword.ToLower()) ||
                    p.Id.ToLower().Contains(input.Keyword.ToLower()));

            var totalCount = await query.CountAsync();

            var categories = await query
                .OrderBy(input.Sorting)
                .PageBy(input)
                .Select(p => new CategoryDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    CreationTime = p.CreationTime,
                    LastModificationTime = p.LastModificationTime
                })
                .ToListAsync();

            return new PagedResultDto<CategoryDto>(totalCount, categories);
        }

        public async Task<CategoryDto> GetAsync(EntityDto<string> input)
        {
            var category = await _categoryRepository.GetAsync(input.Id);//truy vấn đối tượng cụ thể theo id
            return new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                CreationTime = category.CreationTime,
                LastModificationTime = category.LastModificationTime
            };
        }


        public async Task CreateCategory(CategoryDto input)
        {
            var category = new Category
            {
                Id = input.Id.Trim(),
                Name = input.Name.Trim(),
                CreationTime = Clock.Now
            };

            await _categoryRepository.InsertAsync(category);
        }

        public async Task UpdateCategory(UpdateCategoryDto input)
        {
            var category = await _categoryRepository.GetAsync(input.Id);
            category.Name = input.Name.Trim();
            category.LastModificationTime = Clock.Now;

            await _categoryRepository.UpdateAsync(category);
        }

        public async Task DeleteAsync(EntityDto<string> input)
        {
            // Kiểm tra xem danh mục có sản phẩm nào liên quan không
            var hasProducts = await _categoryRepository.GetAll()
                .Where(c => c.Id == input.Id)
                .AnyAsync(c => c.Products.Any());  // kiểm tra xem trong db có bất kì điều gì thoả mãn đk 

            if (hasProducts)
            {
                throw new UserFriendlyException("Không thể xóa danh mục này vì còn sản phẩm thuộc danh mục.");
            }
            await _categoryRepository.DeleteAsync(input.Id);
        }
    }
}
