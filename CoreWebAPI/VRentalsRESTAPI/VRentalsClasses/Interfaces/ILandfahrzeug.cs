using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses.Interfaces
{
    public interface ILandfahrzeug: IFahrzeug
    {
        public string? Marke { get; set; }
        public string? Modell { get; set; }
    }
}
