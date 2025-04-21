using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Acme.SimpleTaskApp.Categories.Dto;
using Acme.SimpleTaskApp.Products.Dto;

namespace Acme.SimpleTaskApp.Categories
{
    public interface ICategoryAppService
    {
        Task<PagedResultDto<CategoryDto>> GetAll(GetPagedCategory input);

        Task CreateCategory(CategoryDto input);
        Task DeleteAsync(EntityDto<string> input);

        Task<CategoryDto> GetAsync(EntityDto<string> input);
        Task UpdateCategory(UpdateCategoryDto input);

    }
}
