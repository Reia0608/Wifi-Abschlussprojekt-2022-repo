using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VRentalsClasses.Interfaces
{
    public interface IFahrzeug
    {
        public IAdresse? AktuellerStandort { get; set; }
    }
}
