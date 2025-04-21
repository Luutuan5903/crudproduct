using Abp.Application.Services.Dto;
using Acme.SimpleTaskApp.Categories;
using Acme.SimpleTaskApp.Categories.Dto;
using Acme.SimpleTaskApp.Controllers;
using Acme.SimpleTaskApp.Web.Models.Category;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;

namespace Acme.SimpleTaskApp.Web.Controllers
{
    public class CategoryController : SimpleTaskAppControllerBase
    {
        private readonly ICategoryAppService _categoryAppService;

        public CategoryController(ICategoryAppService categoryAppService)
        {
            _categoryAppService = categoryAppService;
        }

        public async Task<ActionResult> Index(GetPagedCategory input)
        {
            var result = await _categoryAppService.GetAll(input);

            var model = new CategoryViewModel
            {
                Categories = result.Items.ToList(),
                TotalCount = result.TotalCount,
                Keyword = input.Keyword,
                Sorting = input.Sorting,
                MaxResultCount = input.MaxResultCount,
                SkipCount = input.SkipCount
            };

            return View(model);
        }


        public async Task<ActionResult> EditModal(string categoryId)
        {
            var category = await _categoryAppService.GetAsync(new EntityDto<string>(categoryId));

            var model = new EditCategoryViewModel
            {
                Category = new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    LastModificationTime = category.LastModificationTime
                }
            };

            return PartialView("_EditModal", model);
        }



    }
}
