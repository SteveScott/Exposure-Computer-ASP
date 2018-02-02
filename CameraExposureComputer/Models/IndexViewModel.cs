using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CameraExposureComputer.Models

{

    public class IndexViewModel
    {
        [Display(Name = "Light Level")]
        public int SelectedLightLevel { get; set; }

        public IEnumerable<SelectListItem> LightLevels { get; set; }
        public double ShutterSpeed { get; set; } = .008;
        public double FStop { get; set; } = 16;
        public int Iso { get; set; } = 100;
        public double Ev { get; set; } = 0;
        public int GN { get; set; } = 0;

        public string FlashType { get; set; }
        public string FlashPower { get; set; }
        public float DistanceIlluminated { get; set; }

        public float ObjectDistance { get; set; }
        public int FocalLength { get; set; }
        public float NearFocusDistance { get; set; }
        public float FarFocusDistance { get; set; }
    }
}
