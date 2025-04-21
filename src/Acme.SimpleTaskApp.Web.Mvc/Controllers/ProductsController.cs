using Acme.SimpleTaskApp.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Acme.SimpleTaskApp.Products;
using Acme.SimpleTaskApp.Products.Dto;
using Acme.SimpleTaskApp.Web.Models.Products;
using Abp.Application.Services.Dto;
using Abp.Domain.Repositories;
using Acme.SimpleTaskApp.Categories;
using System.Linq;
using Acme.SimpleTaskApp.Categories.Dto;


namespace Acme.SimpleTaskApp.Web.Controllers;
public class ProductsController : SimpleTaskAppControllerBase
{
    private readonly IRepository<Category, string> _categoryRepository;  // Sử dụng IRepository<Category, string>
    private readonly IProductAppService _productAppService;

    public ProductsController(IRepository<Category, string> categoryRepository, IProductAppService productAppService)
    {
        _categoryRepository = categoryRepository;
        _productAppService = productAppService;
    }

    //hiển thị danh sách sản phẩm
    public async Task<ActionResult> Index(GetAllProductsInput input)
    {
        var output = await _productAppService.GetAll(input);

        var model = new ProductViewModel
        {
            Products = output.Items,
            TotalCount = output.TotalCount,
            Keyword = input.Keyword,
            Sorting = input.Sorting,
            MaxResultCount = input.MaxResultCount,
            SkipCount = input.SkipCount
        };

        return View(model);
    }

    //giao diện tạo mới
    public async Task<ActionResult> CreateProduct()
    {
        return View();
    }

    public async Task<ActionResult> EditModal(int productId)
    {
        var product = await _productAppService.GetAsync(new EntityDto<int>(productId));

        
        var categories = await _categoryRepository.GetAllListAsync(); // Lấy tất cả danh mục từ repository

        var model = new EditProductViewModel
        {
            Product = new ProductList
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Images = product.Images,
                Price = product.Price,
                StockQuantity = product.StockQuantity,
                CategoryId = product.CategoryId,    
                CreationTime = product.CreationTime,
                LastModificationTime = product.LastModificationTime
            },
            Categories = categories.Select(c => new CategoryDto
            {
                Id = c.Id,   // Category.Id sẽ là kiểu string
                Name = c.Name
            }).ToList()  // Chuyển đổi danh sách Category sang CategoryDto
        };

        return PartialView("_EditModal", model);
    }


}
