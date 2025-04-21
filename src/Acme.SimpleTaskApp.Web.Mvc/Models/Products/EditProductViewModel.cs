using Acme.SimpleTaskApp.Categories.Dto;
using System.Collections.Generic;
using Acme.SimpleTaskApp.Products.Dto;
using System.ComponentModel.DataAnnotations;

namespace Acme.SimpleTaskApp.Web.Models.Products
{
    public class EditProductViewModel
    {
        public ProductList Product { get; set; }
        public List<CategoryDto> Categories { get; set; } // Danh sách danh mục

        public string CategoryId
        {
            get => Product?.CategoryId;
            set
            {
                if (Product != null)
                    Product.CategoryId = value;
            }
        }
    }
}