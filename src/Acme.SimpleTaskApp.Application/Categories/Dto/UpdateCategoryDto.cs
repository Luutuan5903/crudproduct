using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Acme.SimpleTaskApp.Categories.Dto
{
    public class UpdateCategoryDto
    {
        public string Id { get; set; }  
        public string Name { get; set; }
        public DateTime? LastModificationTime { get; set; }
    }
}
