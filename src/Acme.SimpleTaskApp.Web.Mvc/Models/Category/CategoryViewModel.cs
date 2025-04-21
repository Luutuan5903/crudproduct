using Acme.SimpleTaskApp.Categories.Dto;
using System.Collections.Generic;

namespace Acme.SimpleTaskApp.Web.Models.Category
{
    public class CategoryViewModel
    {
        public IReadOnlyList<CategoryDto> Categories { get; set; }
        public int TotalCount { get; set; }
        public string Keyword { get; set; }
        public string Sorting { get; set; }
        public int MaxResultCount { get; set; }
        public int SkipCount { get; set; }
    }
}
