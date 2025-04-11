using Acme.SimpleTaskApp.Products.Dto;
using System.Collections.Generic;
namespace Acme.SimpleTaskApp.Web.Models.Products;

public class ProductViewModel
{
    public IReadOnlyList<ProductList> Products { get; set; }

    public ProductViewModel(IReadOnlyList<ProductList> products)
    {
        Products = products;
    }
}

