using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace VRentalsClasses.Models
{
    public class ListToUpdate
    {
        [JsonPropertyName("listtoadd")]
        public List<int>? ListToAdd { get; set; }

        [JsonPropertyName("listtoremove")]
        public List<int>? ListToRemove { get; set; }
    }
}
