using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;

namespace Acme.SimpleTaskApp.Products.Dtos
{
    public class PagedProductDto : PagedAndSortedResultRequestDto
    {
        public string Keyword { get; set; }
    }
}
