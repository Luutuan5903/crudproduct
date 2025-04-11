using Acme.SimpleTaskApp.Entities.Products;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace Acme.SimpleTaskApp.Web.Models.Products
{
    public class CreateProductViewModel
    {
        public List<SelectListItem> Products { get; set; }

        public CreateProductViewModel(List<SelectListItem> products)
        {
            Products = products;
        }
    }
}
