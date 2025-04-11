using Acme.SimpleTaskApp.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Acme.SimpleTaskApp.Products;
using Acme.SimpleTaskApp.Products.Dto;
using Acme.SimpleTaskApp.Web.Models.Products;
using Abp.Application.Services.Dto;


namespace Acme.SimpleTaskApp.Web.Controllers;
public class ProductsController : SimpleTaskAppControllerBase
{
    private readonly IProductAppService _productAppService;

    public ProductsController(IProductAppService productAppService)
    {
        _productAppService = productAppService;
    }

    public async Task<ActionResult> Index(GetAllProductsInput input)
    {
        var output = await _productAppService.GetAll(input);
        var model = new ProductViewModel(output.Items);
        return View(model);
    }

    public async Task<ActionResult> CreateProduct()
    {
        return View();
    }

    public async Task<ActionResult> EditModal(int productId)
    {
        var product = await _productAppService.GetAsync(new EntityDto<int>(productId));
        var model = new EditProductViewModel
        {
            Product = ObjectMapper.Map<ProductList>(product) ,
        };
        return PartialView("_EditModal", model);

    }
}
