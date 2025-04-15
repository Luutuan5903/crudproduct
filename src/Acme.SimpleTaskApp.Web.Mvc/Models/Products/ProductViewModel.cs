using Acme.SimpleTaskApp.Products.Dto;
using System.Collections.Generic;
namespace Acme.SimpleTaskApp.Web.Models.Products;

public class ProductViewModel
{
    public IReadOnlyList<ProductListDto> Products { get; set; }
    public int TotalCount { get; set; }
    public string Keyword { get; set; }
    public string Sorting { get; set; }
    public int MaxResultCount { get; set; }
    public int SkipCount { get; set; }
}

